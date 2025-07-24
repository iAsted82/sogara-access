// Utilitaires PWA pour SOGARA Access

export interface DeviceInfo {
  platform: 'ios' | 'android' | 'desktop' | 'unknown';
  isStandalone: boolean;
  canInstall: boolean;
  hasTouch: boolean;
  screenSize: {
    width: number;
    height: number;
    ratio: number;
  };
  orientation: 'portrait' | 'landscape';
  capabilities: {
    hasCamera: boolean;
    hasGeolocation: boolean;
    hasNotifications: boolean;
    hasVibration: boolean;
    hasShare: boolean;
  };
}

// Détection détaillée du dispositif
export const getDeviceInfo = (): DeviceInfo => {
  const userAgent = navigator.userAgent.toLowerCase();
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  // Détection de plateforme
  let platform: DeviceInfo['platform'] = 'unknown';
  if (/iphone|ipad|ipod/.test(userAgent)) {
    platform = 'ios';
  } else if (/android/.test(userAgent)) {
    platform = 'android';
  } else if (/windows|macintosh|linux/.test(userAgent)) {
    platform = 'desktop';
  }

  // Détection du mode standalone
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                      ('standalone' in navigator && (navigator as any).standalone) ||
                      window.matchMedia('(display-mode: minimal-ui)').matches;

  // Informations d'écran
  const screenSize = {
    width: window.screen.width,
    height: window.screen.height,
    ratio: window.devicePixelRatio || 1
  };

  const orientation = screenSize.width > screenSize.height ? 'landscape' : 'portrait';

  // Capacités du dispositif
  const capabilities = {
    hasCamera: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
    hasGeolocation: 'geolocation' in navigator,
    hasNotifications: 'Notification' in window,
    hasVibration: 'vibrate' in navigator,
    hasShare: 'share' in navigator
  };

  return {
    platform,
    isStandalone,
    canInstall: false, // Sera mis à jour par l'événement beforeinstallprompt
    hasTouch,
    screenSize,
    orientation,
    capabilities
  };
};

// Gestion du cache des données
export class PWACache {
  private static readonly CACHE_PREFIX = 'sogara-data-';
  private static readonly CACHE_EXPIRY_HOURS = 24;

  static async set(key: string, data: any, expiryHours?: number): Promise<void> {
    const expiry = Date.now() + (expiryHours || this.CACHE_EXPIRY_HOURS) * 60 * 60 * 1000;
    const cacheData = {
      data,
      expiry,
      timestamp: Date.now()
    };

    try {
      localStorage.setItem(this.CACHE_PREFIX + key, JSON.stringify(cacheData));
    } catch (error) {
      console.error('[PWA Cache] Failed to cache data:', error);
    }
  }

  static async get<T>(key: string): Promise<T | null> {
    try {
      const cached = localStorage.getItem(this.CACHE_PREFIX + key);
      
      if (!cached) {
        return null;
      }

      const cacheData = JSON.parse(cached);
      
      // Vérifier l'expiration
      if (Date.now() > cacheData.expiry) {
        localStorage.removeItem(this.CACHE_PREFIX + key);
        return null;
      }

      return cacheData.data;
    } catch (error) {
      console.error('[PWA Cache] Failed to retrieve data:', error);
      return null;
    }
  }

  static async remove(key: string): Promise<void> {
    localStorage.removeItem(this.CACHE_PREFIX + key);
  }

  static async clear(): Promise<void> {
    const keys = Object.keys(localStorage);
    
    keys.forEach(key => {
      if (key.startsWith(this.CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }

  static async getSize(): Promise<{ keys: number; sizeKB: number }> {
    const keys = Object.keys(localStorage);
    const cacheKeys = keys.filter(key => key.startsWith(this.CACHE_PREFIX));
    
    let totalSize = 0;
    cacheKeys.forEach(key => {
      const value = localStorage.getItem(key);
      if (value) {
        totalSize += new Blob([value]).size;
      }
    });

    return {
      keys: cacheKeys.length,
      sizeKB: Math.round(totalSize / 1024)
    };
  }
}

// Gestion des données hors ligne
export class OfflineDataManager {
  private static readonly OFFLINE_QUEUE_KEY = 'sogara-offline-queue';

  static async addToQueue(action: string, data: any): Promise<void> {
    const queue = await this.getQueue();
    const queueItem = {
      id: Date.now().toString(),
      action,
      data,
      timestamp: Date.now(),
      retries: 0
    };

    queue.push(queueItem);
    localStorage.setItem(this.OFFLINE_QUEUE_KEY, JSON.stringify(queue));
  }

  static async getQueue(): Promise<any[]> {
    try {
      const queue = localStorage.getItem(this.OFFLINE_QUEUE_KEY);
      return queue ? JSON.parse(queue) : [];
    } catch (error) {
      console.error('[Offline Manager] Failed to get queue:', error);
      return [];
    }
  }

  static async processQueue(): Promise<void> {
    if (!navigator.onLine) {
      console.log('[Offline Manager] Still offline, skipping queue processing');
      return;
    }

    const queue = await this.getQueue();
    
    if (queue.length === 0) {
      return;
    }

    console.log(`[Offline Manager] Processing ${queue.length} items`);

    const processedItems: string[] = [];

    for (const item of queue) {
      try {
        await this.processQueueItem(item);
        processedItems.push(item.id);
        console.log(`[Offline Manager] Processed item: ${item.action}`);
      } catch (error) {
        console.error(`[Offline Manager] Failed to process item ${item.id}:`, error);
        
        // Réessayer jusqu'à 3 fois
        if (item.retries < 3) {
          item.retries++;
        } else {
          // Marquer pour suppression après 3 échecs
          processedItems.push(item.id);
        }
      }
    }

    // Supprimer les éléments traités
    const remainingQueue = queue.filter(item => !processedItems.includes(item.id));
    localStorage.setItem(this.OFFLINE_QUEUE_KEY, JSON.stringify(remainingQueue));

    if (processedItems.length > 0) {
      console.log(`[Offline Manager] Processed ${processedItems.length} items successfully`);
    }
  }

  private static async processQueueItem(item: any): Promise<void> {
    // Ici vous pouvez implémenter la logique spécifique pour traiter
    // différents types d'actions en mode hors ligne
    
    switch (item.action) {
      case 'sync_visitor_data':
        await this.syncVisitorData(item.data);
        break;
        
      case 'sync_staff_data':
        await this.syncStaffData(item.data);
        break;
        
      case 'sync_appointment_data':
        await this.syncAppointmentData(item.data);
        break;
        
      default:
        console.warn(`[Offline Manager] Unknown action: ${item.action}`);
    }
  }

  private static async syncVisitorData(data: any): Promise<void> {
    // Simuler la synchronisation des données de visiteurs
    const response = await fetch('/api/visitors/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Sync failed: ${response.status}`);
    }
  }

  private static async syncStaffData(data: any): Promise<void> {
    // Simuler la synchronisation des données du personnel
    const response = await fetch('/api/staff/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Sync failed: ${response.status}`);
    }
  }

  private static async syncAppointmentData(data: any): Promise<void> {
    // Simuler la synchronisation des données de rendez-vous
    const response = await fetch('/api/appointments/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Sync failed: ${response.status}`);
    }
  }

  static async clearQueue(): Promise<void> {
    localStorage.removeItem(this.OFFLINE_QUEUE_KEY);
  }
}

// Utilitaires de notification
export class PWANotifications {
  static async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.log('[PWA Notifications] Not supported');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('[PWA Notifications] Permission request failed:', error);
      return false;
    }
  }

  static async showNotification(
    title: string, 
    options: NotificationOptions = {}
  ): Promise<boolean> {
    const hasPermission = await this.requestPermission();
    
    if (!hasPermission) {
      return false;
    }

    try {
      const defaultOptions: NotificationOptions = {
        icon: '/Photoroom_20250703_164401.PNG',
        badge: '/Photoroom_20250703_164401.PNG',
        vibrate: [200, 100, 200],
        tag: 'sogara-notification',
        requireInteraction: false,
        ...options
      };

      new Notification(title, defaultOptions);
      return true;
    } catch (error) {
      console.error('[PWA Notifications] Failed to show notification:', error);
      return false;
    }
  }

  static async scheduleNotification(
    title: string,
    options: NotificationOptions,
    delay: number
  ): Promise<void> {
    setTimeout(() => {
      this.showNotification(title, options);
    }, delay);
  }
}

// Gestionnaire d'événements PWA
export const setupPWAEventListeners = () => {
  // Écouter la connexion réseau
  window.addEventListener('online', () => {
    console.log('[PWA] Back online');
    OfflineDataManager.processQueue();
  });

  window.addEventListener('offline', () => {
    console.log('[PWA] Gone offline');
  });

  // Écouter les changements d'orientation
  window.addEventListener('orientationchange', () => {
    console.log('[PWA] Orientation changed');
    // Déclencher un redimensionnement pour les composants réactifs
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
  });

  // Prévenir le geste de retour sur mobile
  if ('standalone' in navigator && (navigator as any).standalone) {
    window.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      const startX = touch.clientX;
      
      // Prévenir le geste de retour sur les bords
      if (startX < 10 || startX > window.innerWidth - 10) {
        e.preventDefault();
      }
    }, { passive: false });
  }

  console.log('[PWA] Event listeners initialized');
};

// Vérifier les capacités PWA
export const checkPWASupport = (): boolean => {
  return (
    'serviceWorker' in navigator &&
    'caches' in window &&
    'PushManager' in window
  );
};

// Obtenir les informations d'installation
export const getInstallationInfo = () => {
  return {
    isInstallable: checkPWASupport(),
    isInstalled: window.matchMedia('(display-mode: standalone)').matches,
    platform: getDeviceInfo().platform,
    lastInstallPrompt: localStorage.getItem('sogara-last-install-prompt'),
    installCount: parseInt(localStorage.getItem('sogara-install-attempts') || '0')
  };
};