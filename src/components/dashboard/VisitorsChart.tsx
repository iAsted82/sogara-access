import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Info, Calendar } from 'lucide-react';

interface VisitorsChartProps {
  data: {
    day: string;
    count: number;
    target: number;
  }[];
  timeRange: string;
}

export const VisitorsChart: React.FC<VisitorsChartProps> = ({ data, timeRange }) => {
  const [showInfo, setShowInfo] = useState(false);
  
  // Calculer le total de visiteurs et la moyenne
  const totalVisitors = data.reduce((sum, day) => sum + day.count, 0);
  const averageVisitors = Math.round(totalVisitors / data.filter(d => d.target > 0).length);
  
  // Calculer la différence avec la cible
  const totalTarget = data.reduce((sum, day) => sum + day.target, 0);
  const targetDifference = totalVisitors - totalTarget;
  const targetPercentage = Math.round((targetDifference / totalTarget) * 100);
  
  // Trouver le jour le plus occupé
  const busiestDay = [...data].sort((a, b) => b.count - a.count)[0];
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-900">Affluence des Visiteurs</h3>
          <button 
            className="p-1 text-gray-400 hover:text-gray-600 rounded-full"
            onClick={() => setShowInfo(!showInfo)}
          >
            <Info className="h-4 w-4" />
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-500">
            {timeRange === 'day' ? "Aujourd'hui" : 
             timeRange === 'week' ? "7 derniers jours" : 
             timeRange === 'month' ? "30 derniers jours" : 
             "Ce trimestre"}
          </span>
        </div>
      </div>
      
      {/* Tooltip d'information */}
      {showInfo && (
        <div className="mb-4 p-3 bg-blue-50 text-blue-800 rounded-lg text-sm border border-blue-100">
          <p>Ce graphique montre l'affluence des visiteurs par jour comparée aux objectifs.</p>
        </div>
      )}
      
      {/* Statistiques clés */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="text-sm text-blue-700">Total Visiteurs</div>
          <div className="text-xl font-bold text-blue-900">{totalVisitors.toLocaleString('fr-FR')}</div>
        </div>
        <div className="bg-green-50 rounded-lg p-3">
          <div className="text-sm text-green-700">Moyenne / Jour</div>
          <div className="text-xl font-bold text-green-900">{averageVisitors.toLocaleString('fr-FR')}</div>
        </div>
        <div className={`${targetDifference >= 0 ? 'bg-green-50' : 'bg-orange-50'} rounded-lg p-3`}>
          <div className={`text-sm ${targetDifference >= 0 ? 'text-green-700' : 'text-orange-700'}`}>vs Objectif</div>
          <div className={`text-xl font-bold flex items-center ${targetDifference >= 0 ? 'text-green-900' : 'text-orange-900'}`}>
            {targetPercentage >= 0 ? '+' : ''}{targetPercentage}%
            {targetDifference >= 0 
              ? <ArrowUpRight className="h-4 w-4 ml-1" /> 
              : <ArrowDownRight className="h-4 w-4 ml-1" />}
          </div>
        </div>
      </div>
      
      {/* Le graphique */}
      <div className="flex-1 flex flex-col justify-end">
        <div className="space-y-3">
          {data.map((day, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">{day.day}</span>
                <span className="text-sm text-gray-500">{day.count} visiteurs</span>
              </div>
              <div className="h-8 bg-gray-100 rounded-lg overflow-hidden relative">
                {/* Objectif (ligne) */}
                {day.target > 0 && (
                  <div 
                    className="absolute top-0 bottom-0 border-l-2 border-red-400 z-10"
                    style={{ left: `${(day.target / Math.max(...data.map(d => Math.max(d.count, d.target)))) * 100}%` }}
                  />
                )}
                
                {/* Barre de données */}
                <div 
                  className={`h-full ${day.count >= day.target ? 'bg-green-500' : 'bg-blue-500'}`}
                  style={{ 
                    width: `${(day.count / Math.max(...data.map(d => Math.max(d.count, d.target)))) * 100}%`,
                    transition: 'width 1s ease-in-out'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-500"></div>
            <span>Visiteurs</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded border-l-2 border-red-400"></div>
            <span>Objectif</span>
          </div>
        </div>
      </div>
      
      {/* Informations additionnelles */}
      <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600">
        <div className="flex justify-between items-center">
          <span>Jour le plus occupé: <strong>{busiestDay.day}</strong> avec {busiestDay.count} visiteurs</span>
          <button className="text-blue-600 hover:text-blue-800">Voir détails</button>
        </div>
      </div>
    </div>
  );
};