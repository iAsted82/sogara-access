// SOGARA Access Service Worker
// Version: 1.0.0

const CACHE_NAME = 'sogara-access-v1.0.0';
const CACHE_STATIC_NAME = 'sogara-static-v1.0.0';
const CACHE_DYNAMIC_NAME = 'sogara-dynamic-v1.0.0';

// Fichiers à mettre en cache immédiatement
const STATIC_FILES = [
  '/',
  '/index.html',
  '/Photoroom_20250703_164401.PNG',
  '/IMGaccueil.png',
  '/manifest.json'
];

// Fichiers critiques pour le fonctionnement offline
const CRITICAL_PAGES = [
  '/',
  '/#dashboard',
  '/#reception',
  '/#staff'
];

// Stratégies de cache
const CACHE_STRATEGIES = {
  images: 'cache-first',
  api: 'network-first', 
  static: 'cache-first',
  html: 'network-first'
};

// Installation du Service Worker
self.addEventListener('install', event => {
  console.log('[SW] Installing SOGARA Access Service Worker...');
  
  event.waitUntil(
    Promise.all([
      // Cache des fichiers statiques
      caches.open(CACHE_STATIC_NAME).then(cache => {
        console.log('[SW] Caching static files...');
        return cache.addAll(STATIC_FILES);
      }),
      
      // Cache des pages critiques
      caches.open(CACHE_NAME).then(cache => {
        console.log('[SW] Caching critical pages...');
        return cache.addAll(CRITICAL_PAGES);
      })
    ]).then(() => {
      console.log('[SW] SOGARA Access cached successfully');
      // Force l'activation immédiate
      self.skipWaiting();
    })
  );
});

// Activation du Service Worker
self.addEventListener('activate', event => {
  console.log('[SW] Activating SOGARA Access Service Worker...');
  
  event.waitUntil(
    Promise.all([
      // Nettoyer les anciens caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME && 
                cacheName !== CACHE_STATIC_NAME && 
                cacheName !== CACHE_DYNAMIC_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Prendre le contrôle de tous les clients
      self.clients.claim()
    ]).then(() => {
      console.log('[SW] SOGARA Access Service Worker activated');
    })
  );
});

// Interception des requêtes
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Ignorer les requêtes non-GET et les extensions de navigateur
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return;
  }
  
  event.respondWith(
    handleRequest(request)
  );
});

// Gestion des requêtes avec stratégies adaptées
async function handleRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Requêtes d'images - Cache First
    if (isImageRequest(request)) {
      return await cacheFirst(request, CACHE_STATIC_NAME);
    }
    
    // Requêtes API - Network First
    if (isApiRequest(request)) {
      return await networkFirst(request, CACHE_DYNAMIC_NAME);
    }
    
    // Fichiers statiques - Cache First
    if (isStaticAsset(request)) {
      return await cacheFirst(request, CACHE_STATIC_NAME);
    }
    
    // Pages HTML - Network First avec fallback
    if (isHtmlRequest(request)) {
      return await networkFirstWithFallback(request);
    }
    
    // Stratégie par défaut - Network First
    return await networkFirst(request, CACHE_DYNAMIC_NAME);
    
  } catch (error) {
    console.error('[SW] Request failed:', error);
    
    // Fallback vers la page d'accueil en cas d'erreur
    if (isHtmlRequest(request)) {
      const cachedHome = await caches.match('/');
      if (cachedHome) {
        return cachedHome;
      }
    }
    
    // Réponse d'erreur offline
    return new Response(
      JSON.stringify({ 
        error: 'Application hors ligne', 
        message: 'Fonctionnalité non disponible sans connexion' 
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Stratégie Cache First
async function cacheFirst(request, cacheName) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    // Mise à jour en arrière-plan
    fetch(request).then(response => {
      if (response.ok) {
        caches.open(cacheName).then(cache => {
          cache.put(request, response.clone());
        });
      }
    }).catch(() => {
      // Ignore les erreurs de mise à jour en arrière-plan
    });
    
    return cachedResponse;
  }
  
  // Si pas en cache, récupérer du réseau
  const networkResponse = await fetch(request);
  
  if (networkResponse.ok) {
    const cache = await caches.open(cacheName);
    cache.put(request, networkResponse.clone());
  }
  
  return networkResponse;
}

// Stratégie Network First
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache...');
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Network First avec fallback vers page d'accueil
async function networkFirstWithFallback(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed for HTML, trying cache...');
    
    // Chercher dans le cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback vers la page d'accueil
    const homeResponse = await caches.match('/');
    if (homeResponse) {
      return homeResponse;
    }
    
    throw error;
  }
}

// Détecteurs de type de requête
function isImageRequest(request) {
  return request.destination === 'image' || 
         /\.(jpg|jpeg|png|gif|webp|svg|ico)$/i.test(new URL(request.url).pathname);
}

function isApiRequest(request) {
  const url = new URL(request.url);
  return url.pathname.startsWith('/api/') || 
         url.pathname.startsWith('/functions/') ||
         request.headers.get('Accept')?.includes('application/json');
}

function isStaticAsset(request) {
  return request.destination === 'script' ||
         request.destination === 'style' ||
         request.destination === 'font' ||
         /\.(js|css|woff|woff2|ttf|eot)$/i.test(new URL(request.url).pathname);
}

function isHtmlRequest(request) {
  return request.destination === 'document' ||
         request.headers.get('Accept')?.includes('text/html');
}

// Gestion des messages depuis l'application
self.addEventListener('message', event => {
  const { type, payload } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'CLAIM_CLIENTS':
      self.clients.claim();
      break;
      
    case 'CACHE_URLS':
      if (payload && payload.urls) {
        cacheUrls(payload.urls);
      }
      break;
      
    case 'CLEAR_CACHE':
      clearAllCaches();
      break;
      
    case 'GET_CACHE_STATUS':
      getCacheStatus().then(status => {
        event.ports[0]?.postMessage({ type: 'CACHE_STATUS', payload: status });
      });
      break;
  }
});

// Cache des URLs spécifiques
async function cacheUrls(urls) {
  const cache = await caches.open(CACHE_DYNAMIC_NAME);
  
  try {
    await cache.addAll(urls);
    console.log('[SW] URLs cached successfully:', urls);
  } catch (error) {
    console.error('[SW] Failed to cache URLs:', error);
  }
}

// Nettoyage des caches
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  
  await Promise.all(
    cacheNames.map(cacheName => caches.delete(cacheName))
  );
  
  console.log('[SW] All caches cleared');
}

// Statut des caches
async function getCacheStatus() {
  const cacheNames = await caches.keys();
  const status = {};
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();
    status[cacheName] = requests.length;
  }
  
  return status;
}

// Notification de mise à jour disponible
self.addEventListener('controllerchange', () => {
  console.log('[SW] New version available');
  
  // Notifier tous les clients qu'une mise à jour est disponible
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'UPDATE_AVAILABLE',
        payload: { version: '1.0.0' }
      });
    });
  });
});

// Gestion des événements de synchronisation en arrière-plan
self.addEventListener('sync', event => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'sogara-sync') {
    event.waitUntil(performBackgroundSync());
  }
});

// Synchronisation en arrière-plan
async function performBackgroundSync() {
  try {
    // Ici, vous pouvez implémenter la synchronisation des données
    // avec votre backend quand la connexion est rétablie
    console.log('[SW] Performing background sync...');
    
    // Exemple : synchroniser les données en attente
    const pendingData = await getStoredPendingData();
    
    if (pendingData.length > 0) {
      for (const data of pendingData) {
        try {
          await syncDataWithServer(data);
          await removePendingData(data.id);
        } catch (error) {
          console.error('[SW] Failed to sync data:', error);
        }
      }
    }
    
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

// Fonctions utilitaires pour la synchronisation
async function getStoredPendingData() {
  // Récupérer les données stockées localement en attente de synchronisation
  return [];
}

async function syncDataWithServer(data) {
  // Synchroniser avec le serveur
  const response = await fetch('/api/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    throw new Error(`Sync failed: ${response.status}`);
  }
  
  return response.json();
}

async function removePendingData(dataId) {
  // Supprimer les données synchronisées du stockage local
  console.log('[SW] Data synced and removed:', dataId);
}

console.log('[SW] SOGARA Access Service Worker loaded');