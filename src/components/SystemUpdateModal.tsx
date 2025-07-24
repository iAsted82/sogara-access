import React from 'react';
import { X, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';

interface SystemUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemUpdateModal: React.FC<SystemUpdateModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Mise à jour système</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
            <div>
              <h4 className="font-medium text-gray-900">Vérification des mises à jour</h4>
              <p className="text-sm text-gray-600">Recherche de nouvelles versions...</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm">Composants interface - À jour</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm">Base de données - Synchronisée</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <span className="text-sm">Vérification des performances...</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};