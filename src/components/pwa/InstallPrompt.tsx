import React, { useState, useEffect } from 'react';
import { X, Download, Smartphone, Monitor, Zap } from 'lucide-react';

interface InstallPromptProps {
  onClose: () => void;
}

const InstallPrompt: React.FC<InstallPromptProps> = ({ onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      // Fallback pour les navigateurs qui ne supportent pas l'installation automatique
      alert('Pour installer l\'application :\n\n1. Ouvrez le menu de votre navigateur\n2. Sélectionnez "Ajouter à l\'écran d\'accueil" ou "Installer l\'application"');
      return;
    }

    setIsInstalling(true);

    try {
      // Déclencher l'invite d'installation
      deferredPrompt.prompt();

      // Attendre la réponse de l'utilisateur
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        console.log('Application installée avec succès');
      } else {
        console.log('Installation annulée par l\'utilisateur');
      }

      setDeferredPrompt(null);
    } catch (error) {
      console.error('Erreur lors de l\'installation:', error);
    } finally {
      setIsInstalling(false);
      onClose();
    }
  };

  const features = [
    {
      icon: Zap,
      title: 'Accès rapide',
      description: 'Lancez SOGARA Access directement depuis votre écran d\'accueil'
    },
    {
      icon: Monitor,
      title: 'Mode hors ligne',
      description: 'Consultez vos données même sans connexion internet'
    },
    {
      icon: Smartphone,
      title: 'Expérience native',
      description: 'Interface optimisée comme une application mobile'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          
          <div className="flex items-center gap-3 mb-3">
            <img 
              src="/Photoroom_20250703_164401.PNG" 
              alt="SOGARA" 
              className="h-10 w-10 rounded-lg bg-white p-1"
            />
            <div>
              <h2 className="text-xl font-bold">Installer SOGARA Access</h2>
              <p className="text-blue-100 text-sm">Application Web Progressive</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 mb-6">
            Installez SOGARA Access sur votre appareil pour une expérience optimale et un accès rapide à tous vos outils de gestion.
          </p>

          {/* Features */}
          <div className="space-y-4 mb-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-start gap-3">
                  <div className="bg-blue-100 rounded-lg p-2 flex-shrink-0">
                    <Icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Install instructions for unsupported browsers */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-blue-900 mb-2">Instructions d'installation manuelle :</h4>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Ouvrez le menu de votre navigateur (⋮)</li>
              <li>2. Sélectionnez "Ajouter à l'écran d'accueil"</li>
              <li>3. Confirmez l'installation</li>
            </ol>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Plus tard
            </button>
            <button
              onClick={handleInstall}
              disabled={isInstalling}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              {isInstalling ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Installation...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Installer
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;