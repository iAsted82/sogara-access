import React from 'react';
import { Download, FileText, FileSpreadsheet, X } from 'lucide-react';

interface VisitorExportProps {
  visitor?: any;
  visitors: any[];
  onExport: (format: string, data: any[]) => void;
  onClose: () => void;
  exportType: 'single' | 'multiple';
}

export const VisitorExport: React.FC<VisitorExportProps> = ({
  visitor,
  visitors,
  onExport,
  onClose,
  exportType
}) => {
  const handleExport = (format: string) => {
    const data = exportType === 'single' && visitor ? [visitor] : visitors;
    onExport(format, data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Exporter les données</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-gray-600 mb-4">
            {exportType === 'single' 
              ? `Exporter les données de ${visitor?.fullName}`
              : `Exporter ${visitors.length} visiteur(s)`
            }
          </p>
          
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleExport('csv')}
              className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:bg-blue-50 hover:border-blue-300"
            >
              <FileText className="h-8 w-8 text-blue-600" />
              <span className="text-sm font-medium">CSV</span>
            </button>
            
            <button
              onClick={() => handleExport('excel')}
              className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:bg-green-50 hover:border-green-300"
            >
              <FileSpreadsheet className="h-8 w-8 text-green-600" />
              <span className="text-sm font-medium">Excel</span>
            </button>
            
            <button
              onClick={() => handleExport('pdf')}
              className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:bg-red-50 hover:border-red-300"
            >
              <FileText className="h-8 w-8 text-red-600" />
              <span className="text-sm font-medium">PDF</span>
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};