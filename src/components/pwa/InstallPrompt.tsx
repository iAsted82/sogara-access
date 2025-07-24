import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Download, 
  Share, 
  Plus, 
  ArrowUp, 
  X, 
  CheckCircle,
  Wifi,
  WifiOff,
  RefreshCw
} from 'lucide-react';
import { usePWA, useNetworkStatus } from '../../hooks/usePWA';

interface InstallPromptProps {
  onClose?: () => void;
  className?: string;
}

export const InstallPrompt: React.FC<InstallPromptProps> = ({ 
  onClose,
  className = '' 
}) => {
  const { capabilities, installApp, shareApp, addToHomeScreen } = usePWA();
  const { isOnline } = useNetworkStatus();
  const [currentStep, setCurrentStep] = useState(0);
  const [isInstalling, setIsInstalling] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  // Ne pas afficher si déjà installé
  if (capabilities.isInstalled || capabilities.isStandalone) {
    return null;
  }

  // Instructions d'installation par plateforme
  const getInstallInstructions = () => {
    switch (capabilities.platform) {
      case 'ios':
        return {
          title: 'Installer SOGARA Access sur iOS',
          icon: <Smartphone className="h-8 w-8 text-blue-600" />,
          steps: [
            {
              icon: <Share className="h-5 w-5 text-blue-600" />,
              title: 'Appuyez sur le bouton Partager',
              description: 'Touchez l\'icône de partage en bas de Safari',
              visual: '📱 → 📤'
            },
            {
              icon: <Plus className="h-5 w-5 text-green-600" />,
              title: 'Sélectionnez "Sur l\'écran d\'accueil"',
              description: 'Faites défiler et choisissez cette option',
              visual: '📤 → ➕ 🏠'
            },
            {
              icon: <CheckCircle className="h-5 w-5 text-purple-600" />,
              title: 'Confirmez l\'ajout',
              description: 'Tapez "Ajouter" pour installer l\'app',
              visual: '✅ SOGARA Access'
            }
          ]
        };
        
      case 'android':
        return {
          title: 'Installer SOGARA Access sur Android',
          icon: <Download className="h-8 w-8 text-green-600" />,
          steps: [
            {
              icon: <Download className="h-5 w-5 text-blue-600" />,
              title: 'Notification d\'installation',
              description: 'Une notification apparaîtra automatiquement',
              visual: '🔔 "Ajouter à l\'écran d\'accueil"'
            },
            {
              icon: <Plus className="h-5 w-5 text-green-600" />,
              title: 'Appuyez sur "Installer"',
              description: 'Confirmez l\'installation de l\'application',
              visual: '⬇️ Installation...'
            },
            {
              icon: <CheckCircle className="h-5 w-5 text-purple-600" />,
              title: 'Application installée',
              description: 'SOGARA Access est maintenant sur votre écran d\'accueil',
              visual: '🎉 ✅ Installé'
            }
          ]
        };
        
      default:
        return {
          title: 'Installer SOGARA Access',
          icon: <Download className="h-8 w-8 text-blue-600" />,
          steps: [
            {
              icon: <Download className="h-5 w-5 text-blue-600" />,
              title: 'Cliquez sur installer',
              description: 'Utilisez le bouton d\'installation ci-dessous',
              visual: '⬇️ Installation'
            }
          ]
        };
    }
  };

  const instructions = getInstallInstructions();

  // Gérer l'installation
  const handleInstall = async () => {
    setIsInstalling(true);
    
    try {
      const success = await installApp();
      
      if (success) {
        console.log('[PWA] Installation successful');
        onClose?.();
      } else if (capabilities.platform === 'ios') {
        // Pour iOS, afficher les instructions manuelles
        setShowInstructions(true);
      }
    } catch (error) {
      console.error('[PWA] Installation failed:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  // Partager l'application
  const handleShare = async () => {
    try {
      await shareApp();
    } catch (error) {
      console.error('[PWA] Share failed:', error);
    }
  };

  if (showInstructions) {
    return (
      <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 ${className}`}>
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 relative">
            <button
              onClick={() => setShowInstructions(false)}
              className="absolute top-4 right-4 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="flex items-center gap-3">
              {instructions.icon}
              <div>
                <h2 className="text-xl font-bold">{instructions.title}</h2>
                <p className="text-blue-100 text-sm">Guide d'installation étape par étape</p>
              </div>
            </div>
          </div>

          {/* Instructions étape par étape */}
          <div className="p-6 space-y-6">
            {instructions.steps.map((step, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  {step.icon}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                  <div className="text-lg">{step.visual}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 p-6 text-center">
            <div className="text-sm text-gray-600 mb-4">
              Une fois installée, SOGARA Access sera accessible depuis votre écran d'accueil 
              et fonctionnera comme une application native.
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleShare}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Partager
              </button>
              <button
                onClick={() => setShowInstructions(false)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Compris
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 ${className}`}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 relative">
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
          
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <img 
                src="/Photoroom_20250703_164401.PNG" 
                alt="SOGARA Logo" 
                className="w-12 h-12 object-contain"
              />
            </div>
            <h2 className="text-xl font-bold mb-2">Installer SOGARA Access</h2>
            <p className="text-blue-100 text-sm">
              Profitez d'une expérience optimale avec l'application installée
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Avantages */}
          <div className="space-y-4 mb-6">
            <h3 className="font-semibold text-gray-900">Avantages de l'installation :</h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-900">Accès rapide</div>
                  <div className="text-gray-600">Depuis votre écran d'accueil</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <WifiOff className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-900">Mode hors-ligne</div>
                  <div className="text-gray-600">Fonctionne sans connexion</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Smartphone className="h-5 w-5 text-purple-600" />
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-900">Expérience native</div>
                  <div className="text-gray-600">Interface optimisée mobile</div>
                </div>
              </div>
            </div>
          </div>

          {/* Statut de connexion */}
          <div className={`flex items-center gap-2 mb-4 text-sm p-3 rounded-lg ${
            isOnline 
              ? 'bg-green-50 text-green-800' 
              : 'bg-orange-50 text-orange-800'
          }`}>
            {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
            <span>
              {isOnline 
                ? 'Connexion active - Installation recommandée' 
                : 'Hors ligne - Installation limitée'}
            </span>
          </div>

          {/* Boutons d'action */}
          <div className="space-y-3">
            {capabilities.canInstall ? (
              <button
                onClick={handleInstall}
                disabled={isInstalling}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isInstalling ? (
                  <RefreshCw className="h-5 w-5 animate-spin" />
                ) : (
                  <Download className="h-5 w-5" />
                )}
                {isInstalling ? 'Installation...' : 'Installer maintenant'}
              </button>
            ) : (
              <button
                onClick={() => setShowInstructions(true)}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <Smartphone className="h-5 w-5" />
                Voir les instructions
              </button>
            )}
            
            <button
              onClick={handleShare}
              className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Share className="h-5 w-5" />
              Partager l'application
            </button>
          </div>

          {/* Note pour iOS */}
          {capabilities.platform === 'ios' && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-2">
                <ArrowUp className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <div className="font-medium mb-1">Sur Safari iOS :</div>
                  <div>Utilisez le bouton de partage puis "Sur l'écran d'accueil"</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;