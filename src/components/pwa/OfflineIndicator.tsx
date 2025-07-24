import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, AlertTriangle, RefreshCw } from 'lucide-react';
import { useNetworkStatus } from '../../hooks/usePWA';

export const OfflineIndicator: React.FC = () => {
  const { isOnline, connectionType } = useNetworkStatus();
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    if (!isOnline && !wasOffline) {
      setShowOfflineMessage(true);
      setWasOffline(true);
    } else if (isOnline && wasOffline) {
      // Afficher brièvement le message de reconnexion
      setShowOfflineMessage(true);
      setTimeout(() => {
        setShowOfflineMessage(false);
        setWasOffline(false);
      }, 3000);
    }
  }, [isOnline, wasOffline]);

  // Indicateur de connexion permanent en haut
  const PermanentIndicator = () => (
    <div className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      isOnline ? 'bg-green-500' : 'bg-red-500'
    } text-white`}>
      <div className="flex items-center justify-center gap-2 py-1 text-sm font-medium">
        {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
        <span>
          {isOnline 
            ? `Connexion active${connectionType !== 'unknown' ? ` (${connectionType})` : ''}` 
            : 'Mode hors ligne - Fonctionnalités limitées'}
        </span>
      </div>
    </div>
  );

  // Message de notification temporaire
  const TemporaryMessage = () => {
    if (!showOfflineMessage) return null;

    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 animate-slide-in">
        <div className={`rounded-xl shadow-2xl p-4 ${
          isOnline 
            ? 'bg-green-100 border border-green-300' 
            : 'bg-red-100 border border-red-300'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isOnline ? 'bg-green-500' : 'bg-red-500'
            }`}>
              {isOnline ? <Wifi className="h-5 w-5 text-white" /> : <WifiOff className="h-5 w-5 text-white" />}
            </div>
            
            <div className="flex-1">
              <div className={`font-semibold ${isOnline ? 'text-green-800' : 'text-red-800'}`}>
                {isOnline ? 'Connexion rétablie' : 'Mode hors ligne activé'}
              </div>
              <div className={`text-sm ${isOnline ? 'text-green-700' : 'text-red-700'}`}>
                {isOnline 
                  ? 'Toutes les fonctionnalités sont disponibles'
                  : 'Fonctionnalités limitées - Données en cache disponibles'
                }
              </div>
            </div>
            
            {!isOnline && (
              <button
                onClick={() => window.location.reload()}
                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                title="Réessayer la connexion"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            )}
          </div>
          
          {/* Fermeture automatique pour le message de reconnexion */}
          {isOnline && (
            <div className="mt-2">
              <div className="h-1 bg-green-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full animate-pulse"
                  style={{ 
                    width: '100%',
                    animation: 'shrink 3s linear forwards'
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {!isOnline && <PermanentIndicator />}
      <TemporaryMessage />
      
      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
        
        @keyframes slide-in {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default OfflineIndicator;