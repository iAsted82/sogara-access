import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileText, CheckCircle, X } from 'lucide-react';

interface DataExportProps {
  onExport: (format: 'csv' | 'excel' | 'pdf', options?: any) => void;
  availableFormats?: ('csv' | 'excel' | 'pdf')[];
  onClose: () => void;
  isOpen: boolean;
}

export const DataExport: React.FC<DataExportProps> = ({
  onExport,
  availableFormats = ['csv', 'excel'],
  onClose,
  isOpen
}) => {
  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'excel' | 'pdf'>('csv');
  const [selectedData, setSelectedData] = useState<string[]>(['visitors', 'services', 'performance']);
  const [timeRange, setTimeRange] = useState<string>('current');
  const [isExporting, setIsExporting] = useState(false);
  
  // Si le modal n'est pas ouvert, ne rien afficher
  if (!isOpen) return null;
  
  // Options de données à exporter
  const dataOptions = [
    { id: 'visitors', label: 'Données visiteurs' },
    { id: 'services', label: 'Distribution des services' },
    { id: 'performance', label: 'Métriques de performance' },
    { id: 'departments', label: 'Performance par département' },
    { id: 'activity', label: 'Activité récente' }
  ];
  
  // Options de période
  const timeRangeOptions = [
    { id: 'current', label: 'Période actuelle uniquement' },
    { id: 'last30', label: '30 derniers jours' },
    { id: 'last90', label: '90 derniers jours' },
    { id: 'year', label: 'Année en cours' },
    { id: 'all', label: 'Toutes les données' }
  ];
  
  // Gérer la sélection/désélection des données
  const toggleDataSelection = (dataId: string) => {
    if (selectedData.includes(dataId)) {
      setSelectedData(selectedData.filter(id => id !== dataId));
    } else {
      setSelectedData([...selectedData, dataId]);
    }
  };
  
  // Gérer l'export
  const handleExport = async () => {
    if (selectedData.length === 0) return;
    
    setIsExporting(true);
    
    try {
      // Simuler une attente pour montrer le chargement
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Appeler la fonction d'export avec les options
      onExport(selectedFormat, {
        dataTypes: selectedData,
        timeRange: timeRange
      });
      
      // Fermer le modal après l'export
      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
        {/* Entête */}
        <div className="p-5 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Exporter les données</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Contenu */}
        <div className="p-5 space-y-6">
          {/* Format d'export */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Format d'export
            </label>
            <div className="grid grid-cols-3 gap-3">
              {availableFormats.includes('csv') && (
                <button
                  onClick={() => setSelectedFormat('csv')}
                  className={`flex flex-col items-center p-3 border rounded-lg ${
                    selectedFormat === 'csv' 
                      ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-200' 
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <FileText className="h-6 w-6 text-blue-600 mb-1" />
                  <span className="text-sm font-medium">CSV</span>
                </button>
              )}
              
              {availableFormats.includes('excel') && (
                <button
                  onClick={() => setSelectedFormat('excel')}
                  className={`flex flex-col items-center p-3 border rounded-lg ${
                    selectedFormat === 'excel' 
                      ? 'border-green-500 bg-green-50 ring-1 ring-green-200' 
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <FileSpreadsheet className="h-6 w-6 text-green-600 mb-1" />
                  <span className="text-sm font-medium">Excel</span>
                </button>
              )}
              
              {availableFormats.includes('pdf') && (
                <button
                  onClick={() => setSelectedFormat('pdf')}
                  className={`flex flex-col items-center p-3 border rounded-lg ${
                    selectedFormat === 'pdf' 
                      ? 'border-red-500 bg-red-50 ring-1 ring-red-200' 
                      : 'border-gray-200 hover:border-red-300'
                  }`}
                >
                  <FileText className="h-6 w-6 text-red-600 mb-1" />
                  <span className="text-sm font-medium">PDF</span>
                </button>
              )}
            </div>
          </div>
          
          {/* Données à exporter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Données à inclure
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {dataOptions.map(option => (
                <div key={option.id} className="flex items-center">
                  <input
                    id={option.id}
                    type="checkbox"
                    checked={selectedData.includes(option.id)}
                    onChange={() => toggleDataSelection(option.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor={option.id} className="ml-2 block text-sm text-gray-700">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Période */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Période
            </label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              {timeRangeOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Actions */}
        <div className="p-5 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 mr-3"
          >
            Annuler
          </button>
          <button
            onClick={handleExport}
            disabled={selectedData.length === 0 || isExporting}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              selectedData.length === 0 || isExporting
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                <span>Exportation...</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                <span>Exporter</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};