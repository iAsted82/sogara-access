import React, { useState, useEffect } from 'react';
import { 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Download, 
  Clock, 
  Shield, 
  Server, 
  Database, 
  Zap,
  X
} from 'lucide-react';
import { forceSystemUpdate, SystemUpdateStatus, generateUpdateReport } from '../utils/systemUpdate';

interface SystemUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemUpdateModal: React.FC<SystemUpdateModalProps> = ({ isOpen, onClose }) => {
  const [updating, setUpdating] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<SystemUpdateStatus | null>(null);
  const [updateReport, setUpdateReport] = useState<string>('');
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    if (isOpen && !updating && !updateStatus) {
      startUpdate();
    }
  }, [isOpen]);

  const startUpdate = async () => {
    setUpdating(true);
    
    // Simuler un délai pour l'interface utilisateur
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      const status = forceSystemUpdate();
      setUpdateStatus(status);
      setUpdateReport(generateUpdateReport(status));
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      setUpdateStatus({
        success: false,
        timestamp: new Date().toISOString(),
        version: '2024.01.15-OPTIMIZED',
        componentsUpdated: [],
        errors: [`Erreur inattendue: ${error instanceof Error ? error.message : String(error)}`],
        warnings: []
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleClose = () => {
    if (!updating) {
      onClose();
      // Reset state after closing
      setTimeout(() => {
        setUpdateStatus(null);
        setUpdateReport('');
        setShowReport(false);
      }, 300);
    }
  };

  const downloadReport = () => {
    if (!updateReport) return;
    
    const blob = new Blob([updateReport], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dgdi-update-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Server className="h-6 w-6" />
              <h2 className="text-xl font-bold">Mise à jour système SOGARA Access</h2>
            </div>
            <button 
              onClick={handleClose}
              disabled={updating}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="text-blue-100 mt-2">
            Version: 2024.01.15-OPTIMIZED
          </p>
        </div>
        
        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {updating ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-700 mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Mise à jour en cours...</h3>
              <p className="text-gray-600">Veuillez patienter pendant que nous mettons à jour tous les composants du système.</p>
              
              <div className="mt-8 space-y-4 max-w-md mx-auto">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <Database className="h-5 w-5 text-blue-600" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-blue-800">Modules principaux</span>
                        <span className="text-blue-600">En cours...</span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-1.5 mt-2">
                        <div className="bg-blue-600 h-1.5 rounded-full animate-pulse" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <Zap className="h-5 w-5 text-green-600" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-green-800">Système IA</span>
                        <span className="text-green-600">En cours...</span>
                      </div>
                      <div className="w-full bg-green-200 rounded-full h-1.5 mt-2">
                        <div className="bg-green-600 h-1.5 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-purple-600" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-purple-800">Sécurité</span>
                        <span className="text-purple-600">En attente...</span>
                      </div>
                      <div className="w-full bg-purple-200 rounded-full h-1.5 mt-2">
                        <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: '10%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : updateStatus ? (
            <div>
              {/* Résultat de la mise à jour */}
              <div className="flex items-center justify-center mb-6">
                {updateStatus.success ? (
                  <div className="bg-green-100 rounded-full p-4">
                    <CheckCircle className="h-12 w-12 text-green-600" />
                  </div>
                ) : updateStatus.errors.length > 0 ? (
                  <div className="bg-red-100 rounded-full p-4">
                    <XCircle className="h-12 w-12 text-red-600" />
                  </div>
                ) : (
                  <div className="bg-yellow-100 rounded-full p-4">
                    <AlertTriangle className="h-12 w-12 text-yellow-600" />
                  </div>
                )}
              </div>
              
              <h3 className="text-xl font-semibold text-center mb-6">
                {updateStatus.success 
                  ? 'Mise à jour terminée avec succès !' 
                  : updateStatus.errors.length > 0
                    ? 'La mise à jour a rencontré des erreurs'
                    : 'Mise à jour terminée avec des avertissements'}
              </h3>
              
              {/* Résumé */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-700">{updateStatus.componentsUpdated.length}</div>
                    <div className="text-sm text-blue-600">Composants mis à jour</div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-700">{updateStatus.warnings.length}</div>
                    <div className="text-sm text-yellow-600">Avertissements</div>
                  </div>
                </div>
                
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-700">{updateStatus.errors.length}</div>
                    <div className="text-sm text-red-600">Erreurs</div>
                  </div>
                </div>
              </div>
              
              {/* Détails */}
              {showReport ? (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">Rapport détaillé</h4>
                    <button 
                      onClick={() => setShowReport(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <pre className="text-xs bg-gray-100 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap">
                    {updateReport}
                  </pre>
                </div>
              ) : (
                <div className="space-y-4 mb-6">
                  {/* Composants mis à jour */}
                  {updateStatus.componentsUpdated.length > 0 && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-900 mb-2">Composants mis à jour</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {updateStatus.componentsUpdated.slice(0, 6).map((component, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{component}</span>
                          </div>
                        ))}
                        {updateStatus.componentsUpdated.length > 6 && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-700">
                              +{updateStatus.componentsUpdated.length - 6} autres...
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Avertissements */}
                  {updateStatus.warnings.length > 0 && (
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <h4 className="font-semibold text-yellow-900 mb-2">Avertissements</h4>
                      <ul className="space-y-1">
                        {updateStatus.warnings.map((warning, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700">{warning}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Erreurs */}
                  {updateStatus.errors.length > 0 && (
                    <div className="bg-red-50 rounded-lg p-4">
                      <h4 className="font-semibold text-red-900 mb-2">Erreurs</h4>
                      <ul className="space-y-1">
                        {updateStatus.errors.map((error, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <XCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700">{error}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setShowReport(!showReport)}
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
                >
                  {showReport ? 'Masquer le rapport' : 'Afficher le rapport complet'}
                </button>
                
                <button
                  onClick={downloadReport}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Télécharger le rapport
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
              <p className="text-gray-600 mb-4">Impossible d'initialiser la mise à jour du système.</p>
              <button
                onClick={startUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Réessayer
              </button>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>
                {updating 
                  ? 'Mise à jour en cours...' 
                  : updateStatus 
                    ? `Terminé à ${new Date().toLocaleTimeString()}` 
                    : 'En attente...'}
              </span>
            </div>
            
            <button
              onClick={handleClose}
              disabled={updating}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
              {updating ? 'Veuillez patienter...' : 'Fermer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};