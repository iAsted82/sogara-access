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
  private static syncQueue: Map<string, any> = new Map();
  private static isOnline: boolean = navigator.onLine;
  private static retryTimeouts: Map<string, NodeJS.Timeout> = new Map();
  private static syncInProgress: Set<string> = new Set();

  // Initialiser le service de synchronisation
  static initialize(): void {
    // Écouter les changements de connexion
    window.addEventListener('online', () => {
      this.isOnline = true;
      console.log('[OfflineDataManager] Connexion rétablie - traitement de la queue');
      this.processSyncQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      console.log('[OfflineDataManager] Connexion perdue - mode offline activé');
    });

    // Charger la queue depuis localStorage
    this.loadQueueFromStorage();
    
    // Traiter la queue si déjà en ligne
    if (this.isOnline) {
      this.processSyncQueue();
    }

    console.log('[OfflineDataManager] Service initialisé');
  }

  static async addToQueue(action: string, data: any, priority: 'high' | 'normal' | 'low' = 'normal'): Promise<void> {
    const queue = await this.getQueue();
    const queueItem = {
      id: `${action}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      action,
      data,
      timestamp: Date.now(),
      retries: 0,
      priority,
      status: 'pending',
      lastError: null,
      lastRetryTimestamp: null
    };

    queue.push(queueItem);
    localStorage.setItem(this.OFFLINE_QUEUE_KEY, JSON.stringify(queue));
    this.syncQueue.set(queueItem.id, queueItem);
    
    console.log(`[OfflineDataManager] Ajouté à la queue: ${action} (${queueItem.id})`);
    
    // Tenter la synchronisation immédiate si en ligne
    if (this.isOnline) {
      this.performSyncForItem(queueItem.id);
    }
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

  // Synchroniser les données des visiteurs (méthode spécialisée)
  static async syncVisitorData(data: any): Promise<void> {
    const syncId = `visitor_${data.id || Date.now()}`;
    
    try {
      await this.addToQueue('sync_visitor_data', data, 'high');
      console.log(`[OfflineDataManager] Données visiteur ajoutées à la queue: ${syncId}`);
    } catch (error) {
      console.error('[OfflineDataManager] Erreur de synchronisation visiteur:', error);
      throw error;
    }
  }

  // Synchroniser les données du personnel
  static async syncStaffData(data: any): Promise<void> {
    const syncId = `staff_${data.id || Date.now()}`;
    
    try {
      await this.addToQueue('sync_staff_data', data, 'normal');
      console.log(`[OfflineDataManager] Données personnel ajoutées à la queue: ${syncId}`);
    } catch (error) {
      console.error('[OfflineDataManager] Erreur de synchronisation personnel:', error);
      throw error;
    }
  }

  // Synchroniser par batch
  static async syncBatch(items: any[], type: string): Promise<void> {
    const batchId = `batch_${type}_${Date.now()}`;
    
    try {
      const batchData = {
        id: batchId,
        items,
        count: items.length,
        type,
        batchTimestamp: Date.now()
      };

      await this.addToQueue(`sync_batch_${type}`, batchData, 'normal');
      console.log(`[OfflineDataManager] Batch ajouté: ${type} (${items.length} éléments)`);
    } catch (error) {
      console.error('[OfflineDataManager] Erreur sync batch:', error);
      throw error;
    }
  }

  static async processQueue(): Promise<void> {
    if (!navigator.onLine) {
      console.log('[Offline Manager] Still offline, skipping queue processing');
      return;
    }

    const queue = await this.getQueue();
    
    if (queue.length === 0) {
      console.log('[OfflineDataManager] Queue vide - rien à synchroniser');
      return;
    }

    console.log(`[OfflineDataManager] Traitement de ${queue.length} éléments en queue`);

    const processedItems: string[] = [];
    const failedItems: any[] = [];

    for (const item of queue) {
      if (this.syncInProgress.has(item.id)) {
        console.log(`[OfflineDataManager] Synchronisation déjà en cours pour: ${item.id}`);
        continue;
      }

      try {
        this.syncInProgress.add(item.id);
        await this.processQueueItem(item);
        processedItems.push(item.id);
        console.log(`[OfflineDataManager] Élément traité avec succès: ${item.action} (${item.id})`);
        
        // Notifier le succès
        this.notifySuccess(item.action, item.data);
        
      } catch (error) {
        console.error(`[OfflineDataManager] Échec traitement élément ${item.id}:`, error);
        
        // Réessayer jusqu'à 3 fois
        if (item.retries < 5) {
          item.retries++;
          item.lastError = error.message;
          item.lastRetryTimestamp = Date.now();
          item.status = 'retrying';
          failedItems.push(item);
          
          // Planifier un retry avec backoff exponentiel
          const delay = Math.min(1000 * Math.pow(2, item.retries), 30000);
          this.scheduleRetry(item.id, delay);
          
          console.log(`[OfflineDataManager] Retry planifié pour ${item.id} dans ${delay}ms (tentative ${item.retries}/5)`);
        } else {
          console.error(`[OfflineDataManager] Max tentatives atteint pour ${item.id}, suppression de la queue`);
          processedItems.push(item.id);
          this.notifyFailure(item.action, item.data, error);
        }
      } finally {
        this.syncInProgress.delete(item.id);
      }
    }

    // Supprimer les éléments traités
    const remainingQueue = queue.filter(item => !processedItems.includes(item.id));
    
    // Mettre à jour les éléments ayant échoué avec nouvelles infos de retry
    const updatedQueue = remainingQueue.map(item => {
      const failedItem = failedItems.find(failed => failed.id === item.id);
      return failedItem || item;
    });
    
    localStorage.setItem(this.OFFLINE_QUEUE_KEY, JSON.stringify(remainingQueue));

    if (processedItems.length > 0) {
      console.log(`[OfflineDataManager] ${processedItems.length} éléments traités avec succès`);
    }
    
    if (failedItems.length > 0) {
      console.log(`[OfflineDataManager] ${failedItems.length} éléments en attente de retry`);
    }
  }

  // Effectuer la synchronisation pour un élément spécifique
  private static async performSyncForItem(itemId: string): Promise<void> {
    const queue = await this.getQueue();
    const item = queue.find(q => q.id === itemId);
    
    if (!item) {
      console.warn(`[OfflineDataManager] Élément ${itemId} non trouvé dans la queue`);
      return;
    }
    
    if (this.syncInProgress.has(itemId)) {
      console.log(`[OfflineDataManager] Synchronisation déjà en cours pour: ${itemId}`);
      return;
    }

    try {
      this.syncInProgress.add(itemId);
      await this.processQueueItem(item);
      
      // Supprimer de la queue après succès
      await this.removeFromQueue(itemId);
      this.notifySuccess(item.action, item.data);
      
    } catch (error) {
      console.error(`[OfflineDataManager] Échec sync ${itemId}:`, error);
      
      // Incrémenter les tentatives
      item.retries++;
      item.lastError = error.message;
      item.lastRetryTimestamp = Date.now();
      
      if (item.retries < 5) {
        // Planifier un retry
        const delay = Math.min(1000 * Math.pow(2, item.retries), 30000);
        this.scheduleRetry(itemId, delay);
        await this.updateQueueItem(item);
      } else {
        // Trop de tentatives - supprimer
        await this.removeFromQueue(itemId);
        this.notifyFailure(item.action, item.data, error);
      }
    } finally {
      this.syncInProgress.delete(itemId);
    }
  }

  // Supprimer un élément de la queue
  private static async removeFromQueue(itemId: string): Promise<void> {
    const queue = await this.getQueue();
    const filteredQueue = queue.filter(item => item.id !== itemId);
    localStorage.setItem(this.OFFLINE_QUEUE_KEY, JSON.stringify(filteredQueue));
    this.syncQueue.delete(itemId);
    this.clearRetry(itemId);
  }

  // Mettre à jour un élément de la queue
  private static async updateQueueItem(updatedItem: any): Promise<void> {
    const queue = await this.getQueue();
    const updatedQueue = queue.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    );
    localStorage.setItem(this.OFFLINE_QUEUE_KEY, JSON.stringify(updatedQueue));
    this.syncQueue.set(updatedItem.id, updatedItem);
  }

  // Planifier un retry avec backoff exponentiel
  private static scheduleRetry(itemId: string, delay: number): void {
    this.clearRetry(itemId);
    
    const timeout = setTimeout(async () => {
      if (this.isOnline) {
        console.log(`[OfflineDataManager] Retry automatique pour: ${itemId}`);
        await this.performSyncForItem(itemId);
      }
    }, delay);
    
    this.retryTimeouts.set(itemId, timeout);
  }

  // Annuler un retry programmé
  private static clearRetry(itemId: string): void {
    const timeout = this.retryTimeouts.get(itemId);
    if (timeout) {
      clearTimeout(timeout);
      this.retryTimeouts.delete(itemId);
    }
  }

  // Charger la queue depuis localStorage
  private static loadQueueFromStorage(): void {
    try {
      const queue = this.getQueue();
      queue.then(items => {
        items.forEach(item => {
          this.syncQueue.set(item.id, item);
        });
        console.log(`[OfflineDataManager] Queue chargée: ${items.length} éléments`);
      });
    } catch (error) {
      console.error('[OfflineDataManager] Erreur chargement queue:', error);
    }
  }

  // Traiter toute la queue
  private static async processSyncQueue(): Promise<void> {
    const queue = await this.getQueue();
    const promises = queue.map(item => 
      this.performSyncForItem(item.id).catch(error => 
        console.error(`[OfflineDataManager] Erreur traitement ${item.id}:`, error)
      )
    );
    
    await Promise.allSettled(promises);
    console.log(`[OfflineDataManager] Traitement de la queue terminé`);
  }
  private static async processQueueItem(item: any): Promise<void> {
    const endpoint = this.getEndpoint(item.action);
    
    // Configuration de la requête avec authentification
    const config: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Sync-Id': item.id,
        'X-Timestamp': item.timestamp.toString(),
        'X-Retry-Count': item.retries.toString(),
        'X-Client-Time': Date.now().toString()
      },
      body: JSON.stringify({
        ...item.data,
        _sync: {
          id: item.id,
          action: item.action,
          timestamp: item.timestamp,
          retries: item.retries
        }
      })
    };
    
    console.log(`[OfflineDataManager] Synchronisation ${item.action} vers ${endpoint}`);
    
    // Effectuer la requête avec timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout
    
    config.signal = controller.signal;
    
    try {
      const response = await fetch(endpoint, config);
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      console.log(`[OfflineDataManager] Sync réussie:`, result);
      
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Timeout de synchronisation (30s)');
      }
      
      throw error;
    }
  }
  
  // Obtenir l'endpoint selon le type d'action
  private static getEndpoint(action: string): string {
    const endpoints = {
      sync_visitor_data: '/api/visitors/sync',
      sync_staff_data: '/api/staff/sync',
      sync_appointment_data: '/api/appointments/sync',
      sync_package_data: '/api/packages/sync',
      sync_analytics: '/api/analytics/sync',
      sync_user_data: '/api/users/sync',
      sync_form_data: '/api/forms/sync',
      sync_batch_visitor: '/api/visitors/batch-sync',
      sync_batch_staff: '/api/staff/batch-sync'
    };
    
    return endpoints[action] || '/api/sync';
  }

  // Obtenir le statut de la queue
  static getQueueStatus() {
    return {
      online: this.isOnline,
      queueSize: this.syncQueue.size,
      syncInProgress: this.syncInProgress.size,
      retryScheduled: this.retryTimeouts.size,
      items: Array.from(this.syncQueue.entries()).map(([id, item]) => ({
        id,
        action: item.action,
        priority: item.priority,
        status: item.status,
        attempts: item.retries,
        timestamp: item.timestamp,
        lastError: item.lastError,
        lastRetryTimestamp: item.lastRetryTimestamp
      }))
    };
  }

  // Forcer la synchronisation
  static async forceSync(): Promise<void> {
    if (!this.isOnline) {
      throw new Error('Pas de connexion internet disponible');
    }
    
    console.log('[OfflineDataManager] Synchronisation forcée démarrée');
    await this.processSyncQueue();
  }

  // Vider la queue
  static clearQueue(): void {
    this.syncQueue.clear();
    this.retryTimeouts.forEach(timeout => clearTimeout(timeout));
    this.retryTimeouts.clear();
    this.syncInProgress.clear();
    localStorage.removeItem(this.OFFLINE_QUEUE_KEY);
    console.log('[OfflineDataManager] Queue vidée');
  }

  // Obtenir des statistiques détaillées
  static async getDetailedStats() {
    const queue = await this.getQueue();
    const now = Date.now();
    
    const stats = {
      total: queue.length,
      byAction: {},
      byPriority: { high: 0, normal: 0, low: 0 },
      byStatus: { pending: 0, retrying: 0, failed: 0 },
      byRetries: { 0: 0, 1: 0, 2: 0, 3: 0, '4+': 0 },
      oldestItem: null,
      newestItem: null,
      avgAge: 0,
      failureRate: 0
    };
    
    let totalAge = 0;
    let totalFailures = 0;
    
    queue.forEach(item => {
      // Statistiques par action
      stats.byAction[item.action] = (stats.byAction[item.action] || 0) + 1;
      
      // Statistiques par priorité
      if (item.priority && stats.byPriority[item.priority] !== undefined) {
        stats.byPriority[item.priority]++;
      }
      
      // Statistiques par statut
      if (item.status && stats.byStatus[item.status] !== undefined) {
        stats.byStatus[item.status]++;
      }
      
      // Statistiques par nombre de tentatives
      if (item.retries <= 3) {
        stats.byRetries[item.retries]++;
      } else {
        stats.byRetries['4+']++;
      }
      
      // Calculer l'âge
      const age = now - item.timestamp;
      totalAge += age;
      
      // Suivre les éléments les plus anciens/récents
      if (!stats.oldestItem || item.timestamp < stats.oldestItem.timestamp) {
        stats.oldestItem = item;
      }
      if (!stats.newestItem || item.timestamp > stats.newestItem.timestamp) {
        stats.newestItem = item;
      }
      
      // Compter les échecs
      if (item.retries > 0) {
        totalFailures += item.retries;
      }
    });
    
    // Calculer les moyennes
    if (queue.length > 0) {
      stats.avgAge = totalAge / queue.length;
      stats.failureRate = totalFailures / queue.length;
    }
    
    return stats;
  }

  // Nettoyer les anciens éléments de la queue
  static async cleanupOldItems(maxAgeMs: number = 7 * 24 * 60 * 60 * 1000): Promise<number> {
    const queue = await this.getQueue();
    const cutoffTime = Date.now() - maxAgeMs;
    
    const validItems = queue.filter(item => {
      const isValid = item.timestamp > cutoffTime;
      if (!isValid) {
        console.log(`[OfflineDataManager] Suppression élément expiré: ${item.id}`);
        this.clearRetry(item.id);
      }
      return isValid;
    });
    
    const removedCount = queue.length - validItems.length;
    
    if (removedCount > 0) {
      localStorage.setItem(this.OFFLINE_QUEUE_KEY, JSON.stringify(validItems));
      console.log(`[OfflineDataManager] ${removedCount} éléments expirés supprimés`);
    }
    
    return removedCount;
  }

  // Notifications de succès
  private static notifySuccess(action: string, data: any): void {
    window.dispatchEvent(new CustomEvent('sogara:sync:success', {
      detail: { action, data, timestamp: Date.now() }
    }));
    
    // Afficher une notification utilisateur si approprié
    PWANotifications.showNotification('Synchronisation réussie', {
      body: `Données ${action.replace('sync_', '').replace('_', ' ')} synchronisées`,
      icon: '/Photoroom_20250703_164401.PNG',
      tag: 'sync-success',
      silent: true,
      data: { action, autoClose: 3000 }
    });
  }

  // Notifications d'échec
  private static notifyFailure(action: string, data: any, error: any): void {
    window.dispatchEvent(new CustomEvent('sogara:sync:failure', {
      detail: { action, data, error: error.message, timestamp: Date.now() }
    }));
    
    // Afficher une notification d'erreur
    PWANotifications.showNotification('Erreur de synchronisation', {
      body: `Impossible de synchroniser ${action.replace('sync_', '').replace('_', ' ')}`,
      icon: '/Photoroom_20250703_164401.PNG',
      tag: 'sync-error',
      requireInteraction: true,
      actions: [
        { action: 'retry', title: 'Réessayer' },
        { action: 'dismiss', title: 'Ignorer' }
      ],
      data: { action, error: error.message }
    });
  }

  private static async processQueueItem(item: any): Promise<void> {
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

  /**
   * Configurer la communication avec le Service Worker
   */
  static setupServiceWorkerCommunication(): void {
    if (!('serviceWorker' in navigator)) return;
    
    navigator.serviceWorker.addEventListener('message', (event) => {
      const { type, key, itemId, data } = event.data;
      
      switch (type) {
        case 'GET_OFFLINE_QUEUE':
          this.handleGetOfflineQueue(event, key);
          break;
          
        case 'REMOVE_FROM_OFFLINE_QUEUE':
          this.handleRemoveFromQueue(event, key, itemId);
          break;
          
        case 'UPDATE_OFFLINE_QUEUE':
          this.handleUpdateQueue(event, key, data);
          break;
      }
    });
  }

  private static handleGetOfflineQueue(event: MessageEvent, key: string): void {
    try {
      const queueData = localStorage.getItem(key);
      const queue = queueData ? JSON.parse(queueData) : [];
      
      event.ports[0]?.postMessage({
        success: true,
        data: queue
      });
    } catch (error) {
      console.error('[OfflineManager] Error getting queue:', error);
      event.ports[0]?.postMessage({
        success: false,
        error: error.message
      });
    }
  }

  private static handleRemoveFromQueue(event: MessageEvent, key: string, itemId: string): void {
    try {
      const queueData = localStorage.getItem(key);
      const queue = queueData ? JSON.parse(queueData) : [];
      
      const originalLength = queue.length;
      const filteredQueue = queue.filter((item: any) => item.id !== itemId);
      const removedCount = originalLength - filteredQueue.length;
      
      localStorage.setItem(key, JSON.stringify(filteredQueue));
      
      event.ports[0]?.postMessage({
        success: true,
        removedCount
      });
    } catch (error) {
      console.error('[OfflineManager] Error removing from queue:', error);
      event.ports[0]?.postMessage({
        success: false,
        error: error.message
      });
    }
  }

  private static handleUpdateQueue(event: MessageEvent, key: string, data: any[]): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      
      event.ports[0]?.postMessage({
        success: true
      });
    } catch (error) {
      console.error('[OfflineManager] Error updating queue:', error);
      event.ports[0]?.postMessage({
        success: false,
        error: error.message
      });
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
    try {
      // Vérifier si les notifications sont supportées
      if (!('Notification' in window)) {
        console.warn('[PWA Notifications] Les notifications ne sont pas supportées par ce navigateur');
        // Fallback: afficher un toast à la place
        this.showToastFallback(title, options.body || '');
        return false;
      }

      // Vérifier et demander la permission si nécessaire
      let permission = Notification.permission;
      
      if (permission === 'default') {
        permission = await Notification.requestPermission();
      }
      
      if (permission !== 'granted') {
        console.warn('[PWA Notifications] Permission de notification refusée');
        this.showToastFallback(title, options.body || '');
        return false;
      }

      // Options par défaut avec support avancé
      const defaultOptions: NotificationOptions = {
        icon: '/Photoroom_20250703_164401.PNG',
        badge: '/Photoroom_20250703_164401.PNG',
        vibrate: [200, 100, 200],
        timestamp: Date.now(),
        requireInteraction: false,
        silent: false,
        tag: 'sogara-notification',
        dir: 'ltr',
        lang: 'fr',
        renotify: false,
        sticky: false,
        actions: [
          {
            action: 'view',
            title: 'Voir',
            icon: '/Photoroom_20250703_164401.PNG'
          },
          {
            action: 'dismiss',
            title: 'Ignorer',
            icon: '/Photoroom_20250703_164401.PNG'
          }
        ],
        ...options
      };

      // Créer la notification avec gestion d'événements
      const notification = new Notification(title, defaultOptions);

      // Gestion des événements de notification
      notification.onclick = (event) => {
        event.preventDefault();
        window.focus();
        notification.close();
        
        // Si une action est définie dans les options
        if (options.data?.action) {
          if (typeof options.data.action === 'string') {
            window.location.href = options.data.action;
          } else if (typeof options.data.action === 'function') {
            options.data.action();
          }
        }
        
        // Dispatcher un événement personnalisé
        window.dispatchEvent(new CustomEvent('notification:clicked', {
          detail: { title, options }
        }));
      };

      notification.onerror = (error) => {
        console.error('[PWA Notifications] Erreur de notification:', error);
      };

      notification.onshow = () => {
        console.log('[PWA Notifications] Notification affichée:', title);
      };

      notification.onclose = () => {
        console.log('[PWA Notifications] Notification fermée:', title);
      };

      // Auto-fermeture après délai (si pas requireInteraction)
      if (!defaultOptions.requireInteraction) {
        const autoCloseDelay = options.data?.autoClose || 5000;
        setTimeout(() => {
          if (notification) {
            notification.close();
          }
        }, autoCloseDelay);
      }

      // Vibration si supportée et demandée
      if ('vibrate' in navigator && defaultOptions.vibrate) {
        navigator.vibrate(defaultOptions.vibrate);
      }

      return true;
    } catch (error) {
      console.error('[PWA Notifications] Erreur lors de l\'affichage de la notification:', error);
      this.showToastFallback(title, options.body || '');
      return false;
    }
  }

  // Fallback toast si notifications non supportées
  private static showToastFallback(title: string, body: string): void {
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-blue-600 text-white px-6 py-4 rounded-lg shadow-lg z-50 max-w-sm';
    toast.innerHTML = `
      <div class="font-bold">${title}</div>
      ${body ? `<div class="text-sm mt-1">${body}</div>` : ''}
      <button class="absolute top-2 right-2 text-white hover:text-gray-200" onclick="this.parentElement.remove()">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    `;
    
    document.body.appendChild(toast);
    
    // Auto-suppression après 5 secondes
    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove();
      }
    }, 5000);
  }

  // Notification avec actions personnalisées
  static async showActionNotification(
    title: string,
    body: string,
    actions: Array<{ action: string; title: string; handler: () => void }>
  ): Promise<boolean> {
    const actionOptions: NotificationOptions = {
      body,
      actions: actions.map(a => ({ action: a.action, title: a.title })),
      requireInteraction: true,
      data: { actionHandlers: actions }
    };

    return this.showNotification(title, actionOptions);
  }

  // Notification persistante (ne se ferme pas automatiquement)
  static async showPersistentNotification(title: string, body: string): Promise<boolean> {
    return this.showNotification(title, {
      body,
      requireInteraction: true,
      sticky: true,
      data: { autoClose: false }
    });
  }

  // Notification avec progression
  static async showProgressNotification(title: string, progress: number): Promise<boolean> {
    return this.showNotification(title, {
      body: `Progression: ${Math.round(progress)}%`,
      icon: '/Photoroom_20250703_164401.PNG',
      tag: 'progress-notification',
      renotify: true,
      data: { progress }
    });
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