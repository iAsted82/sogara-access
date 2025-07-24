import React from 'react';
import { Calendar, RefreshCw, Download, Clock, ChevronDown } from 'lucide-react';

interface DashboardHeaderProps {
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  lastUpdated: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  timeRange,
  onTimeRangeChange,
  onRefresh,
  isRefreshing,
  lastUpdated
}) => {
  // Traduire la plage temporelle pour l'affichage
  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case 'day': return "Aujourd'hui";
      case 'week': return "Cette semaine";
      case 'month': return "Ce mois";
      case 'quarter': return "Ce trimestre";
      case 'year': return "Cette année";
      default: return "Cette semaine";
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord</h1>
        <div className="flex items-center gap-2">
          <p className="text-gray-600">Vue d'ensemble des activités et performances</p>
          <div className="flex items-center text-sm text-blue-600">
            <Clock className="h-4 w-4 mr-1" />
            <span>{getTimeRangeLabel()}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button 
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Mise à jour...' : 'Rafraîchir'}</span>
        </button>
        
        <div className="flex items-center text-sm text-gray-500 ml-2">
          <span className="text-xs">Dernière mise à jour: {new Date(lastUpdated).toLocaleTimeString('fr-FR')}</span>
        </div>
      </div>
    </div>
  );
};