import React, { useState, useEffect } from 'react';
import { usePWA } from '../../hooks/usePWA';
import InstallPrompt from './InstallPrompt';
import UpdateNotification from './UpdateNotification';
import OfflineIndicator from './OfflineIndicator';

interface PWAManagerProps {
  children: React.ReactNode;
}

export const PWAManager: React.FC<PWAManagerProps> = ({ children }) => {
  const { capabilities } = usePWA();
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [installPromptDismissed, setInstallPromptDismissed] = useState(false);
  const [visitCount, setVisitCount] = useState(0);

  // Enregistrer le Service Worker
  useEffect(() => {
    const initializePWA = async () => {
      // Check if Service Workers are supported in this environment
      if (!('serviceWorker' in navigator)) {
        console.log('[PWA] Service Workers not supported in this environment');
        return;
      }

      // Check for StackBlitz environment
      if (window.location.hostname.includes('stackblitz') || 
          window.location.hostname.includes('webcontainer')) {
        console.log('[PWA] Service Workers not supported on StackBlitz');
        return;
      }

      try {
        // Register service worker
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('[PWA] Service Worker registered successfully:', registration);

        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  setUpdateAvailable(true);
                }
              }
            });
          }
        });
      } catch (error) {
        console.log('[PWA] Service Worker registration failed - likely unsupported environment');
      }

      // Initialize install prompt
    };

    initializePWA();
  }, []);

  // Gérer l'affichage du prompt d'installation
  useEffect(() => {
    // Ne pas afficher si déjà installé ou prompt déjà fermé
    if (capabilities.isInstalled || 
        capabilities.isStandalone || 
        installPromptDismissed) {
      return;
    }

    // Compter les visites
    const visits = parseInt(localStorage.getItem('sogara-visit-count') || '0');
    const newVisitCount = visits + 1;
    localStorage.setItem('sogara-visit-count', newVisitCount.toString());
    setVisitCount(newVisitCount);

    // Conditions pour afficher le prompt
    const shouldShowPrompt = (
      // Après 3 visites
      newVisitCount >= 3 ||
      // Ou si l'utilisateur a passé plus de 2 minutes sur le site
      shouldShowBasedOnEngagement() ||
      // Ou si prompt natif disponible (Android)
      capabilities.canInstall
    );

    if (shouldShowPrompt) {
      // Délai avant affichage pour ne pas être intrusif
      const timer = setTimeout(() => {
        setShowInstallPrompt(true);
      }, 5000); // 5 secondes après le chargement

      return () => clearTimeout(timer);
    }
  }, [capabilities, installPromptDismissed]);

  // Vérifier l'engagement utilisateur
  const shouldShowBasedOnEngagement = (): boolean => {
    const startTime = sessionStorage.getItem('sogara-session-start');
    
    if (!startTime) {
      sessionStorage.setItem('sogara-session-start', Date.now().toString());
      return false;
    }
    
    const elapsed = Date.now() - parseInt(startTime);
    return elapsed > 120000; // 2 minutes
  };

  // Gérer la fermeture du prompt
  const handleCloseInstallPrompt = () => {
    setShowInstallPrompt(false);
    setInstallPromptDismissed(true);
    
    // Se souvenir que l'utilisateur a fermé le prompt
    localStorage.setItem('sogara-install-prompt-dismissed', 'true');
    
    // Remettre à zéro le compteur de visites
    localStorage.setItem('sogara-visit-count', '0');
  };

  // Réinitialiser le flag de fermeture après 7 jours
  useEffect(() => {
    const dismissedDate = localStorage.getItem('sogara-install-prompt-dismissed-date');
    const now = Date.now();
    
    if (dismissedDate) {
      const daysPassed = (now - parseInt(dismissedDate)) / (1000 * 60 * 60 * 24);
      
      if (daysPassed >= 7) {
        localStorage.removeItem('sogara-install-prompt-dismissed');
        localStorage.removeItem('sogara-install-prompt-dismissed-date');
        setInstallPromptDismissed(false);
      }
    }
  }, []);

  return (
    <div className="pwa-manager">
      {/* Application principale */}
      <div className={`app-content ${!capabilities.isOnline ? 'offline-mode' : ''}`}>
        {children}
      </div>

      {/* Indicateur hors ligne */}
      <OfflineIndicator />

      {/* Prompt d'installation */}
      {showInstallPrompt && (
        <InstallPrompt onClose={handleCloseInstallPrompt} />
      )}

      {/* Notification de mise à jour */}
      <UpdateNotification />

      {/* Styles pour le mode PWA */}
      <style jsx global>{`
        /* Ajustements pour le mode standalone */
        @media (display-mode: standalone) {
          body {
            user-select: none;
            -webkit-user-select: none;
            -webkit-touch-callout: none;
            -webkit-tap-highlight-color: transparent;
          }
          
          /* Masquer les barres de défilement sur mobile */
          ::-webkit-scrollbar {
            width: 0px;
            background: transparent;
          }
          
          /* Empêcher le zoom sur les inputs */
          input[type="text"],
          input[type="email"],
          input[type="password"],
          input[type="number"],
          select,
          textarea {
            font-size: 16px !important;
          }
        }
        
        /* Mode hors ligne */
        .offline-mode {
          filter: grayscale(0.1);
        }
        
        .offline-mode::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, #ef4444, #f97316, #eab308);
          z-index: 1000;
          animation: offline-pulse 2s infinite;
        }
        
        @keyframes offline-pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        
        /* Animations PWA */
        .animate-slide-in {
          animation: slideInUp 0.3s ease-out;
        }
        
        @keyframes slideInUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        /* Optimisations tactiles */
        .touch-optimized {
          -webkit-tap-highlight-color: transparent;
          -webkit-touch-callout: none;
          user-select: none;
        }
        
        /* Transitions fluides pour la navigation */
        .page-transition {
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                      opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .page-transition.entering {
          transform: translateX(100%);
          opacity: 0;
        }
        
        .page-transition.entered {
          transform: translateX(0);
          opacity: 1;
        }
        
        /* Safe area pour les dispositifs avec encoche */
        .safe-area-top {
          padding-top: env(safe-area-inset-top);
        }
        
        .safe-area-bottom {
          padding-bottom: env(safe-area-inset-bottom);
        }
        
        .safe-area-left {
          padding-left: env(safe-area-inset-left);
        }
        
        .safe-area-right {
          padding-right: env(safe-area-inset-right);
        }
        
        /* Adaptation iOS */
        @supports (-webkit-appearance: none) {
          .ios-optimized {
            -webkit-appearance: none;
            border-radius: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default PWAManager;