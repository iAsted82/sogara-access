import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: number | string;
  change?: number;
  icon: React.ElementType;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'indigo' | 'orange' | 'gray';
  onClick?: () => void;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  color = 'blue',
  onClick
}) => {
  // Déterminer si la tendance est positive ou négative
  // Note: certaines métriques comme le temps de traitement sont inversées
  // (une réduction du temps est positive)
  let isPositive = change !== undefined ? change > 0 : undefined;
  if (title.toLowerCase().includes('temps')) {
    isPositive = change !== undefined ? change < 0 : undefined;
  }
  
  // Classes de couleur pour les icônes et indicateurs
  const colorClasses = {
    blue: {
      bg: 'bg-blue-100',
      text: 'text-blue-600',
      icon: 'text-blue-600',
    },
    green: {
      bg: 'bg-green-100',
      text: 'text-green-600',
      icon: 'text-green-600',
    },
    red: {
      bg: 'bg-red-100',
      text: 'text-red-600',
      icon: 'text-red-600',
    },
    yellow: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-600',
      icon: 'text-yellow-600',
    },
    purple: {
      bg: 'bg-purple-100',
      text: 'text-purple-600',
      icon: 'text-purple-600',
    },
    indigo: {
      bg: 'bg-indigo-100',
      text: 'text-indigo-600',
      icon: 'text-indigo-600',
    },
    orange: {
      bg: 'bg-orange-100',
      text: 'text-orange-600',
      icon: 'text-orange-600',
    },
    gray: {
      bg: 'bg-gray-100',
      text: 'text-gray-600',
      icon: 'text-gray-600',
    },
  };
  
  // Classes pour l'indicateur de changement
  const changeColorClass = isPositive ? 'text-green-600' : 'text-red-600';

  return (
    <div 
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-4 transition-all hover:shadow-md ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg ${colorClasses[color].bg}`}>
          <Icon className={`h-5 w-5 ${colorClasses[color].icon}`} />
        </div>
        
        {/* Indicateur de changement */}
        {change !== undefined && (
          <div className={`flex items-center ${changeColorClass}`}>
            {isPositive ? (
              <>
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span className="text-xs font-medium">{Math.abs(change)}%</span>
              </>
            ) : (
              <>
                <ArrowDownRight className="h-4 w-4 mr-1" />
                <span className="text-xs font-medium">{Math.abs(change)}%</span>
              </>
            )}
          </div>
        )}
      </div>
      
      {/* Valeur et titre */}
      <div className="space-y-2">
        <div className="text-2xl font-bold text-gray-900">
          {typeof value === 'number' ? value.toLocaleString('fr-FR') : value}
        </div>
        <div className="text-sm text-gray-500">{title}</div>
      </div>
    </div>
  );
};