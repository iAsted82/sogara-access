import React, { useState, useEffect } from 'react';
import { RefreshCw, Download, X, Zap, CheckCircle } from 'lucide-react';
import { usePWA } from '../../hooks/usePWA';

interface UpdateNotificationProps {
  onClose?: () => void;
}

export const UpdateNotification: React.FC<UpdateNotificationProps> = ({ onClose }) => {
  const { capabilities, updateApp } = usePWA();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (capabilities.hasUpdate) {
      setIsVisible(true);
    }
  }, [capabilities.hasUpdate]);

  const handleUpdate = async () => {
    setIsUpdating(true);
    
    try {
      await updateApp();
      console.log('[PWA] App updated successfully');
    } catch (error) {
      console.error('[PWA] Update failed:', error);
      setIsUpdating(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible || !capabilities.hasUpdate) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-slide-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Mise à jour disponible</h3>
                <p className="text-green-100 text-sm">Nouvelle version de SOGARA Access</p>
              </div>
            </div>
            
            <button
              onClick={handleClose}
              className="p-1 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              <div className="flex items-start gap-2 mb-3">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-gray-900">Améliorations incluses :</div>
                  <ul className="mt-1 space-y-1 text-xs">
                    <li>• Optimisations de performance</li>
                    <li>• Corrections de bugs</li>
                    <li>• Nouvelles fonctionnalités</li>
                    <li>• Amélioration de la sécurité</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Plus tard
              </button>
              
              <button
                onClick={handleUpdate}
                disabled={isUpdating}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isUpdating ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Mise à jour...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Mettre à jour
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateNotification;