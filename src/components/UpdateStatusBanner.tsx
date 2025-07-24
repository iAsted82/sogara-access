import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle, AlertTriangle, X, Info } from 'lucide-react';
import { SystemUpdateModal } from './SystemUpdateModal';

interface UpdateStatusBannerProps {
  version: string;
  lastUpdateTime?: string;
}

export const UpdateStatusBanner: React.FC<UpdateStatusBannerProps> = ({ 
  version = '2024.01.15-OPTIMIZED',
  lastUpdateTime
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<'pending' | 'success' | 'warning'>('pending');
  
  useEffect(() => {
    // Simuler une vérification de mise à jour
    const timer = setTimeout(() => {
      // 80% chance de succès, 20% d'avertissement
      setUpdateStatus(Math.random() > 0.2 ? 'success' : 'warning');
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const getStatusIcon = () => {
    switch (updateStatus) {
      case 'pending':
        return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
    }
  };
  
  const getStatusColor = () => {
    switch (updateStatus) {
      case 'pending':
        return 'bg-blue-500';
      case 'success':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
    }
  };
  
  const getStatusText = () => {
    switch (updateStatus) {
      case 'pending':
        return 'Vérification des mises à jour...';
      case 'success':
        return 'Système à jour';
      case 'warning':
        return 'Mise à jour recommandée';
    }
  };
  
  if (!isVisible) return null;
  
  return (
    <>
      <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <div className={`${getStatusColor()} h-1 w-full`}></div>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${
                updateStatus === 'pending' ? 'bg-blue-100 text-blue-600' :
                updateStatus === 'success' ? 'bg-green-100 text-green-600' :
                'bg-yellow-100 text-yellow-600'
              }`}>
                {getStatusIcon()}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">SOGARA Access</h3>
                <p className="text-sm text-gray-600">Version {version}</p>
              </div>
            </div>
            <button 
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <div className={`w-2 h-2 rounded-full ${
                updateStatus === 'pending' ? 'bg-blue-500' :
                updateStatus === 'success' ? 'bg-green-500' :
                'bg-yellow-500'
              }`}></div>
              <span className={
                updateStatus === 'pending' ? 'text-blue-600' :
                updateStatus === 'success' ? 'text-green-600' :
                'text-yellow-600'
              }>
                {getStatusText()}
              </span>
            </div>
            
            <button
              onClick={() => setShowUpdateModal(true)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              {updateStatus === 'warning' ? 'Mettre à jour' : 'Détails'}
            </button>
          </div>
          
          {lastUpdateTime && (
            <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
              <Info className="h-3 w-3" />
              <span>Dernière mise à jour: {lastUpdateTime}</span>
            </div>
          )}
        </div>
      </div>
      
      <SystemUpdateModal 
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
      />
    </>
  );
};