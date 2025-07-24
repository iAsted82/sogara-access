import { useState, useEffect, useCallback } from 'react';
import { OfflineDataManager } from '../utils/pwaUtils';

interface PWAInstallPrompt {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWACapabilities {
  canInstall: boolean;
  isInstalled: boolean;
  isStandalone: boolean;
  platform: 'ios' | 'android' | 'desktop' | 'unknown';
  isOnline: boolean;
  hasUpdate: boolean;
}

interface PWAHookReturn {
  capabilities: PWACapabilities;
  showInstallPrompt: () => Promise<boolean>;
  installApp: () => Promise<boolean>;
  updateApp: () => Promise<void>;
  shareApp: () => Promise<boolean>;
  addToHomeScreen: () => void;
}

export const usePWA = (): PWAHookReturn => {
  const [deferredPrompt, setDeferredPrompt] = useState<PWAInstallPrompt | null>(null);
  const [capabilities, setCapabilities] = useState<PWACapabilities>({
    canInstall: false,
    isInstalled: false,
    isStandalone: false,
    platform: 'unknown',
    isOnline: navigator.onLine,
    hasUpdate: false
  });

  // Détection de la plateforme
  const detectPlatform = useCallback((): 'ios' | 'android' | 'desktop' | 'unknown' => {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (/iphone|ipad|ipod/.test(userAgent)) {
      return 'ios';
    } else if (/android/.test(userAgent)) {
      return 'android';
    } else if (/windows|macintosh|linux/.test(userAgent)) {
      return 'desktop';
    }
    
    return 'unknown';
  }, []);

  // Détection du mode standalone
  const isStandalone = useCallback((): boolean => {
    // PWA installée et lancée en mode standalone
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return true;
    }
    
    // Safari iOS en mode standalone
    if ('standalone' in window.navigator && (window.navigator as any).standalone) {
      return true;
    }
    
    // Android avec window.matchMedia
    if (window.matchMedia('(display-mode: minimal-ui)').matches ||
        window.matchMedia('(display-mode: fullscreen)').matches) {
      return true;
    }
    
    return false;
  }, []);

  // Vérifier si l'app est déjà installée
  const checkInstallStatus = useCallback((): boolean => {
    // Méthode 1: Mode standalone
    if (isStandalone()) {
      return true;
    }
    
    // Méthode 2: localStorage flag (défini lors de l'installation)
    const installFlag = localStorage.getItem('sogara-pwa-installed');
    if (installFlag === 'true') {
      return true;
    }
    
    // Méthode 3: User agent contient des indicateurs PWA
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('wv') || userAgent.includes('version')) {
      return true;
    }
    
    return false;
  }, [isStandalone]);

  // Initialisation des capacités PWA
  useEffect(() => {
    const platform = detectPlatform();
    const installed = checkInstallStatus();
    const standalone = isStandalone();
    
    setCapabilities(prev => ({
      ...prev,
      platform,
      isInstalled: installed,
      isStandalone: standalone,
      isOnline: navigator.onLine
    }));

    // Écouter les événements PWA
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('[PWA] Install prompt available');
      e.preventDefault();
      setDeferredPrompt(e as any);
      setCapabilities(prev => ({ ...prev, canInstall: true }));
    };

    const handleAppInstalled = () => {
      console.log('[PWA] App installed successfully');
      localStorage.setItem('sogara-pwa-installed', 'true');
      setCapabilities(prev => ({ 
        ...prev, 
        isInstalled: true, 
        canInstall: false 
      }));
      setDeferredPrompt(null);
    };

    const handleOnlineStatusChange = () => {
      setCapabilities(prev => ({ ...prev, isOnline: navigator.onLine }));
    };

    // Event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);

    // Initialiser la communication avec le Service Worker
    if (typeof OfflineDataManager !== 'undefined') {
      OfflineDataManager.setupServiceWorkerCommunication();
    }

    // Nettoyage
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, [detectPlatform, checkInstallStatus, isStandalone]);

  // Écouter les mises à jour du Service Worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', event => {
        if (event.data.type === 'UPDATE_AVAILABLE') {
          setCapabilities(prev => ({ ...prev, hasUpdate: true }));
        }
      });
    }
  }, []);

  // Afficher le prompt d'installation
  const showInstallPrompt = useCallback(async (): Promise<boolean> => {
    if (!deferredPrompt) {
      console.log('[PWA] No install prompt available');
      return false;
    }

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      console.log('[PWA] User choice:', choiceResult.outcome);
      
      if (choiceResult.outcome === 'accepted') {
        setCapabilities(prev => ({ ...prev, canInstall: false }));
        setDeferredPrompt(null);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('[PWA] Install prompt failed:', error);
      return false;
    }
  }, [deferredPrompt]);

  // Installer l'application (fallback pour iOS)
  const installApp = useCallback(async (): Promise<boolean> => {
    if (capabilities.platform === 'ios') {
      // iOS nécessite des instructions manuelles
      return false;
    }
    
    return await showInstallPrompt();
  }, [capabilities.platform, showInstallPrompt]);

  // Mettre à jour l'application
  const updateApp = useCallback(async (): Promise<void> => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      
      if (registration && registration.waiting) {
        // Demander au service worker d'activer la nouvelle version
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        
        // Recharger la page pour appliquer la mise à jour
        window.location.reload();
      }
    }
  }, []);

  // Partager l'application
  const shareApp = useCallback(async (): Promise<boolean> => {
    const shareData = {
      title: 'SOGARA Access',
      text: 'Plateforme de gestion intégrée de la raffinerie SOGARA',
      url: window.location.href
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        return true;
      } else if (navigator.clipboard) {
        // Fallback: copier l'URL
        await navigator.clipboard.writeText(window.location.href);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('[PWA] Share failed:', error);
      return false;
    }
  }, []);

  // Instructions pour ajouter à l'écran d'accueil (iOS principalement)
  const addToHomeScreen = useCallback((): void => {
    if (capabilities.platform === 'ios') {
      // Les instructions seront gérées par le composant InstallPrompt
      console.log('[PWA] iOS add to home screen instructions needed');
    } else {
      // Pour Android, utiliser le prompt natif
      showInstallPrompt();
    }
  }, [capabilities.platform, showInstallPrompt]);

  return {
    capabilities,
    showInstallPrompt,
    installApp,
    updateApp,
    shareApp,
    addToHomeScreen
  };
};

// Hook pour gérer la connectivité
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionType, setConnectionType] = useState<string>('unknown');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    const handleConnectionChange = () => {
      const connection = (navigator as any).connection || 
                        (navigator as any).mozConnection || 
                        (navigator as any).webkitConnection;
      
      if (connection) {
        setConnectionType(connection.effectiveType || connection.type || 'unknown');
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Network Information API
    if ('connection' in navigator) {
      (navigator as any).connection.addEventListener('change', handleConnectionChange);
      handleConnectionChange(); // Initial check
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
    
    // Initialiser la communication avec le Service Worker
    if (typeof OfflineDataManager !== 'undefined') {
      OfflineDataManager.setupServiceWorkerCommunication();
      OfflineDataManager.initialize();
    }
      if ('connection' in navigator) {
        (navigator as any).connection.removeEventListener('change', handleConnectionChange);
      }
    };
  }, []);

  return { isOnline, connectionType };
};