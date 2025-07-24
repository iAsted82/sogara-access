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
    console.log('[SW] Starting background sync...');
    
    // Nettoyer les éléments expirés
    await cleanExpiredQueueItems();
    
    // Obtenir les données en attente
    const pendingData = await getStoredPendingData();
    
    if (pendingData.length === 0) {
      console.log('[SW] No pending data to sync');
      return;
    }
    
    console.log(`[SW] Found ${pendingData.length} items to sync`);
    
    // Afficher les statistiques
    const stats = await getQueueStats();
    console.log('[SW] Queue stats:', stats);
    
    const processedItems = [];
    const failedItems = [];
    
    for (const item of pendingData) {
      if (!validateQueueItem(item)) {
        console.warn('[SW] Invalid queue item found:', item);
        processedItems.push(item.id || 'unknown');
        continue;
      }
      
      try {
        console.log(`[SW] Processing item: ${item.action} (attempt ${item.retries + 1}/4)`);
        
        await syncDataWithServer(item.data, item.action);
        processedItems.push(item.id);
        
        console.log(`[SW] Successfully synced: ${item.action} (${item.id})`);
        
      } catch (error) {
        console.error(`[SW] Failed to sync item ${item.id}:`, error);
        
        // Réessayer jusqu'à 3 fois
        if (item.retries < 3) {
          item.retries++;
          item.lastError = error.message;
          item.lastRetryTimestamp = Date.now();
          failedItems.push(item);
          console.log(`[SW] Will retry item ${item.id} (attempt ${item.retries + 1}/4)`);
        } else {
          console.error(`[SW] Max retries reached for item ${item.id}, removing from queue`);
          processedItems.push(item.id);
        }
      }
    }
    
    // Supprimer les éléments traités avec succès
    for (const itemId of processedItems) {
      await removePendingData(itemId);
    }
    
    // Mettre à jour les éléments ayant échoué (pour les nouvelles tentatives)
    if (failedItems.length > 0) {
      const currentQueue = await getStoredPendingData();
      const updatedQueue = currentQueue.map(item => {
        const failedItem = failedItems.find(failed => failed.id === item.id);
        return failedItem || item;
      });
      await updateStoredQueue(updatedQueue);
    }
    
    console.log(`[SW] Background sync completed. Processed: ${processedItems.length}, Failed: ${failedItems.length}`);
    
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

// Récupérer les données stockées localement en attente de synchronisation
async function getStoredPendingData() {
  const OFFLINE_QUEUE_KEY = 'sogara-offline-queue';
  
  try {
    // Obtenir les clients pour accéder aux données
    const clients = await self.clients.matchAll();
    
    if (clients.length === 0) {
      console.log('[SW] No clients available to access localStorage');
      return [];
    }
    
    // Demander les données à un client actif via postMessage
    return new Promise((resolve) => {
      const messageChannel = new MessageChannel();
      
      messageChannel.port1.onmessage = (event) => {
        const { success, data } = event.data;
        if (success) {
          resolve(data || []);
        } else {
          console.error('[SW] Failed to get pending data from client');
          resolve([]);
        }
      };
      
      // Envoyer la demande au premier client disponible
      clients[0].postMessage({
        type: 'GET_OFFLINE_QUEUE',
        key: OFFLINE_QUEUE_KEY
      }, [messageChannel.port2]);
      
      // Timeout après 5 secondes
      setTimeout(() => {
        console.warn('[SW] Timeout getting offline queue data');
        resolve([]);
      }, 5000);
    });
    
  } catch (error) {
    console.error('[SW] Error getting stored pending data:', error);
    return [];
  }
}

async function syncDataWithServer(data, action) {
  // Synchroniser avec le serveur
  const endpoint = getEndpointForAction(action);
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    throw new Error(`Sync failed: ${response.status}`);
  }
  
  return response.json();
}

// Supprimer les données synchronisées du stockage local
async function removePendingData(dataId) {
  const OFFLINE_QUEUE_KEY = 'sogara-offline-queue';
  
  try {
    // Obtenir les clients pour accéder aux données
    const clients = await self.clients.matchAll();
    
    if (clients.length === 0) {
      console.warn('[SW] No clients available to remove pending data');
      return false;
    }
    
    // Demander la suppression à un client actif
    return new Promise((resolve) => {
      const messageChannel = new MessageChannel();
      
      messageChannel.port1.onmessage = (event) => {
        const { success, removedCount } = event.data;
        if (success) {
          console.log(`[SW] Successfully removed pending data: ${dataId} (${removedCount} items removed)`);
          resolve(true);
        } else {
          console.error(`[SW] Failed to remove pending data: ${dataId}`);
          resolve(false);
        }
      };
      
      // Envoyer la demande de suppression
      clients[0].postMessage({
        type: 'REMOVE_FROM_OFFLINE_QUEUE',
        key: OFFLINE_QUEUE_KEY,
        itemId: dataId
      }, [messageChannel.port2]);
      
      // Timeout après 5 secondes
      setTimeout(() => {
        console.warn(`[SW] Timeout removing pending data: ${dataId}`);
        resolve(false);
      }, 5000);
    });
    
  } catch (error) {
    console.error('[SW] Error removing pending data:', error);
    return false;
  }
}

// Valider la structure des données en queue
function validateQueueItem(item) {
  return (
    item &&
    typeof item === 'object' &&
    item.id &&
    item.action &&
    item.timestamp &&
    typeof item.retries === 'number'
  );
}

// Nettoyer les éléments expirés de la queue (plus de 7 jours)
async function cleanExpiredQueueItems() {
  const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
  const cutoffTime = Date.now() - SEVEN_DAYS;
  
  try {
    const pendingData = await getStoredPendingData();
    const validItems = pendingData.filter(item => {
      const isValid = validateQueueItem(item) && item.timestamp > cutoffTime;
      if (!isValid) {
        console.log(`[SW] Removing expired/invalid queue item: ${item.id || 'unknown'}`);
      }
      return isValid;
    });
    
    if (validItems.length !== pendingData.length) {
      // Mettre à jour la queue avec les éléments valides
      await updateStoredQueue(validItems);
      console.log(`[SW] Cleaned ${pendingData.length - validItems.length} expired queue items`);
    }
    
    return validItems;
  } catch (error) {
    console.error('[SW] Error cleaning expired queue items:', error);
    return [];
  }
}

// Mettre à jour toute la queue dans le stockage
async function updateStoredQueue(queueData) {
  const OFFLINE_QUEUE_KEY = 'sogara-offline-queue';
  
  try {
    const clients = await self.clients.matchAll();
    
    if (clients.length === 0) {
      console.warn('[SW] No clients available to update queue');
      return false;
    }
    
    return new Promise((resolve) => {
      const messageChannel = new MessageChannel();
      
      messageChannel.port1.onmessage = (event) => {
        const { success } = event.data;
        resolve(success);
      };
      
      clients[0].postMessage({
        type: 'UPDATE_OFFLINE_QUEUE',
        key: OFFLINE_QUEUE_KEY,
        data: queueData
      }, [messageChannel.port2]);
      
      setTimeout(() => resolve(false), 5000);
    });
    
  } catch (error) {
    console.error('[SW] Error updating stored queue:', error);
    return false;
  }
}

// Obtenir des statistiques sur la queue
async function getQueueStats() {
  try {
    const pendingData = await getStoredPendingData();
    const validItems = pendingData.filter(validateQueueItem);
    
    const stats = {
      total: validItems.length,
      byAction: {},
      byRetries: { 0: 0, 1: 0, 2: 0, '3+': 0 },
      oldestTimestamp: null,
      newestTimestamp: null
    };
    
    validItems.forEach(item => {
      // Compter par action
      stats.byAction[item.action] = (stats.byAction[item.action] || 0) + 1;
      
      // Compter par nombre de tentatives
      if (item.retries <= 2) {
        stats.byRetries[item.retries]++;
      } else {
        stats.byRetries['3+']++;
      }
      
      // Suivre les timestamps
      if (!stats.oldestTimestamp || item.timestamp < stats.oldestTimestamp) {
        stats.oldestTimestamp = item.timestamp;
      }
      if (!stats.newestTimestamp || item.timestamp > stats.newestTimestamp) {
        stats.newestTimestamp = item.timestamp;
      }
    });
    
    return stats;
  } catch (error) {
    console.error('[SW] Error getting queue stats:', error);
    return { total: 0, byAction: {}, byRetries: {}, oldestTimestamp: null, newestTimestamp: null };
  }
}

// Obtenir l'endpoint selon l'action
function getEndpointForAction(action) {
  const endpoints = {
    'sync_visitor_data': '/api/visitors/sync',
    'sync_staff_data': '/api/staff/sync',
    'sync_appointment_data': '/api/appointments/sync',
    'sync_package_data': '/api/packages/sync'
  };
  
  return endpoints[action] || '/api/sync';
}

console.log('[SW] SOGARA Access Service Worker loaded');