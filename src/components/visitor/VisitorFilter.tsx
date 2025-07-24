import React from 'react';
import { Search, Filter, Download } from 'lucide-react';

interface VisitorFilterProps {
  filterOptions: {
    searchTerm: string;
    status: string;
    dateRange: string;
    department: string;
  };
  onFilterChange: (filterName: string, value: string) => void;
  departments: string[];
  onExport: () => void;
  activeTab: string;
}

export const VisitorFilter: React.FC<VisitorFilterProps> = ({
  filterOptions,
  onFilterChange,
  departments,
  onExport,
  activeTab
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un visiteur..."
            value={filterOptions.searchTerm}
            onChange={(e) => onFilterChange('searchTerm', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <select
          value={filterOptions.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Tous les statuts</option>
          <option value="present">Présents</option>
          <option value="completed">Terminés</option>
          <option value="overdue">En retard</option>
        </select>
        
        <select
          value={filterOptions.department}
          onChange={(e) => onFilterChange('department', e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Tous les départements</option>
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
        
        <button
          onClick={onExport}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Exporter
        </button>
      </div>
    </div>
  );
};