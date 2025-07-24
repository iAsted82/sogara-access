import React, { useState } from 'react';
import { Building2, ArrowUpRight, ArrowDownRight, BarChart3, ChevronDown } from 'lucide-react';

interface DepartmentData {
  name: string;
  processed: number;
  target: number;
  satisfaction: number;
}

interface DepartmentPerformanceProps {
  data: DepartmentData[];
}

export const DepartmentPerformance: React.FC<DepartmentPerformanceProps> = ({ data }) => {
  const [sortBy, setSortBy] = useState<'name' | 'processed' | 'target' | 'percentage' | 'satisfaction'>('processed');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [expandedDept, setExpandedDept] = useState<string | null>(null);
  
  // Trier les départements
  const sortedData = [...data].sort((a, b) => {
    if (sortBy === 'name') {
      return sortDirection === 'asc' 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortBy === 'processed') {
      return sortDirection === 'asc' 
        ? a.processed - b.processed
        : b.processed - a.processed;
    } else if (sortBy === 'target') {
      return sortDirection === 'asc' 
        ? a.target - b.target
        : b.target - a.target;
    } else if (sortBy === 'percentage') {
      const percentA = (a.processed / a.target) * 100;
      const percentB = (b.processed / b.target) * 100;
      return sortDirection === 'asc'
        ? percentA - percentB
        : percentB - percentA;
    } else { // satisfaction
      return sortDirection === 'asc'
        ? a.satisfaction - b.satisfaction
        : b.satisfaction - a.satisfaction;
    }
  });
  
  // Changer le tri
  const handleSortChange = (column: 'name' | 'processed' | 'target' | 'percentage' | 'satisfaction') => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('desc'); // Par défaut, tri descendant
    }
  };
  
  // Calculer le meilleur département
  const bestDepartment = [...data].sort((a, b) => {
    const percentA = (a.processed / a.target) * 100;
    const percentB = (b.processed / b.target) * 100;
    return percentB - percentA;
  })[0];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">Performance par Département</h3>
        </div>
        
        <button className="p-1 text-gray-400 hover:text-gray-600">
          <BarChart3 className="h-5 w-5" />
        </button>
      </div>
      
      {/* En-tête du tableau */}
      <div className="grid grid-cols-12 gap-2 pb-2 border-b border-gray-100 text-xs font-medium text-gray-500 uppercase tracking-wider">
        <div className="col-span-4 flex items-center cursor-pointer" onClick={() => handleSortChange('name')}>
          <span>Département</span>
          {sortBy === 'name' && (
            <ChevronDown className={`h-3 w-3 ml-1 transform ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
          )}
        </div>
        <div className="col-span-3 flex items-center cursor-pointer" onClick={() => handleSortChange('processed')}>
          <span>Traités</span>
          {sortBy === 'processed' && (
            <ChevronDown className={`h-3 w-3 ml-1 transform ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
          )}
        </div>
        <div className="col-span-3 flex items-center cursor-pointer" onClick={() => handleSortChange('percentage')}>
          <span>% Objectif</span>
          {sortBy === 'percentage' && (
            <ChevronDown className={`h-3 w-3 ml-1 transform ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
          )}
        </div>
        <div className="col-span-2 flex items-center justify-end cursor-pointer" onClick={() => handleSortChange('satisfaction')}>
          <span>Sat.</span>
          {sortBy === 'satisfaction' && (
            <ChevronDown className={`h-3 w-3 ml-1 transform ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
          )}
        </div>
      </div>
      
      {/* Lignes des départements */}
      <div className="overflow-y-auto flex-1">
        {sortedData.map((department, index) => {
          const percentage = (department.processed / department.target) * 100;
          const isExpanded = expandedDept === department.name;
          
          return (
            <div key={index} className="border-b border-gray-100 last:border-b-0">
              {/* Ligne principale */}
              <div 
                className="grid grid-cols-12 gap-2 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpandedDept(isExpanded ? null : department.name)}
              >
                <div className="col-span-4 font-medium text-gray-900 flex items-center">
                  <span className="truncate">{department.name}</span>
                  <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
                <div className="col-span-3 text-gray-700 flex items-center">
                  <span>{department.processed}</span>
                  <span className="text-gray-400 mx-1">/</span>
                  <span className="text-gray-500">{department.target}</span>
                </div>
                <div className="col-span-3 flex items-center">
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={percentage >= 100 ? 'bg-green-500' : percentage >= 90 ? 'bg-yellow-500' : 'bg-red-500'}
                      style={{ width: `${Math.min(100, percentage)}%`, height: '100%' }}
                    />
                  </div>
                  <span className={`text-xs ml-2 font-medium ${
                    percentage >= 100 ? 'text-green-600' : percentage >= 90 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {percentage.toFixed(0)}%
                  </span>
                </div>
                <div className="col-span-2 flex items-center justify-end">
                  <span className="flex items-center gap-1 text-blue-600 font-medium">
                    {department.satisfaction.toFixed(1)}
                  </span>
                </div>
              </div>
              
              {/* Détails supplémentaires (si développé) */}
              {isExpanded && (
                <div className="py-3 px-4 bg-gray-50 text-sm rounded-lg mb-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-gray-500 mb-1">Détails de performance</div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Taux de conversion:</span>
                          <span className="font-medium text-gray-900">86%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Temps moyen:</span>
                          <span className="font-medium text-gray-900">18 min</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Taux d'erreur:</span>
                          <span className="font-medium text-gray-900">2.3%</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">Tendance vs mois précédent</div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Traités:</span>
                          <span className="font-medium text-green-600 flex items-center">
                            +12%
                            <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Temps de traitement:</span>
                          <span className="font-medium text-green-600 flex items-center">
                            -8%
                            <ArrowDownRight className="h-3.5 w-3.5 ml-1" />
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Satisfaction:</span>
                          <span className="font-medium text-green-600 flex items-center">
                            +0.3
                            <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex justify-end">
                    <button className="text-sm text-blue-600 hover:text-blue-800">
                      Voir rapport complet
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Résumé */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="text-sm text-gray-700 flex items-center gap-2">
          <Building2 className="h-4 w-4 text-green-600" />
          <span>
            Meilleure performance: <span className="font-medium">{bestDepartment.name}</span> 
            ({((bestDepartment.processed / bestDepartment.target) * 100).toFixed(0)}% de l'objectif)
          </span>
        </div>
      </div>
    </div>
  );
};