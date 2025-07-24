import React, { useState } from 'react';
import { 
  Search, Filter, Download, Calendar, ChevronDown, 
  FileSpreadsheet, FileText, RefreshCw 
} from 'lucide-react';

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
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Réinitialiser tous les filtres
  const resetFilters = () => {
    onFilterChange('searchTerm', '');
    onFilterChange('status', 'all');
    onFilterChange('dateRange', 'all');
    onFilterChange('department', 'all');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Recherche */}
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
        
        {/* Filtre par statut */}
        <select
          value={filterOptions.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Tous les statuts</option>
          <option value="present">Présent</option>
          <option value="completed">Terminé</option>
          <option value="overdue">Dépassement</option>
        </select>
        
        {/* Bouton de filtres avancés */}
        <button 
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          <span>Filtres</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
        </button>
        
        {/* Exporter */}
        <button 
          onClick={onExport}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          <span>Exporter</span>
        </button>
      </div>
      
      {/* Filtres avancés */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700 mb-1">
              Période
            </label>
            <select
              id="dateRange"
              value={filterOptions.dateRange}
              onChange={(e) => onFilterChange('dateRange', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Toutes les dates</option>
              <option value="today">Aujourd'hui</option>
              <option value="yesterday">Hier</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
              Département
            </label>
            <select
              id="department"
              value={filterOptions.department}
              onChange={(e) => onFilterChange('department', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous les départements</option>
              {departments.map((dept, index) => (
                <option key={index} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          
          {activeTab === 'history' && (
            <div>
              <label htmlFor="visitType" className="block text-sm font-medium text-gray-700 mb-1">
                Type de visite
              </label>
              <select
                id="visitType"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tous les types</option>
                <option value="appointment">Avec rendez-vous</option>
                <option value="walkIn">Sans rendez-vous</option>
                <option value="recurring">Récurrent</option>
              </select>
            </div>
          )}
          
          {activeTab !== 'history' && (
            <div>
              <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
                Trier par
              </label>
              <select
                id="sortBy"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="checkInTime">Heure d'arrivée</option>
                <option value="name">Nom</option>
                <option value="department">Département</option>
                <option value="duration">Durée</option>
              </select>
            </div>
          )}
          
          <div className="md:col-span-3 flex justify-end">
            <button 
              onClick={resetFilters}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Réinitialiser les filtres
            </button>
          </div>
        </div>
      )}
      
      {/* Filtres rapides */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => onFilterChange('status', 'all')}
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            filterOptions.status === 'all' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
          }`}
        >
          Tous
        </button>
        <button
          onClick={() => onFilterChange('status', 'present')}
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            filterOptions.status === 'present' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}
        >
          Présents
        </button>
        <button
          onClick={() => onFilterChange('status', 'completed')}
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            filterOptions.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
          }`}
        >
          Terminés
        </button>
        <button
          onClick={() => onFilterChange('dateRange', 'today')}
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            filterOptions.dateRange === 'today' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
          }`}
        >
          Aujourd'hui
        </button>
      </div>
    </div>
  );
};