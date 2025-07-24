import React from 'react';
import { TrendingUp, Download, Shield, Eye, AlertTriangle } from 'lucide-react';

interface PerformanceMetricsProps {
  data: {
    metric: string;
    value: number;
    target: number;
  }[];
}

export const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ data }) => {
  // Déterminer l'icône et la couleur pour chaque métrique
  const getMetricIcon = (metricName: string) => {
    if (metricName.toLowerCase().includes('vitesse') || metricName.toLowerCase().includes('traitement')) {
      return <TrendingUp className="h-5 w-5 text-green-600" />;
    } else if (metricName.toLowerCase().includes('satisfaction') || metricName.toLowerCase().includes('client')) {
      return <Eye className="h-5 w-5 text-blue-600" />;
    } else if (metricName.toLowerCase().includes('précision') || metricName.toLowerCase().includes('données')) {
      return <Shield className="h-5 w-5 text-purple-600" />;
    } else {
      return <TrendingUp className="h-5 w-5 text-gray-600" />;
    }
  };

  // Déterminer la couleur de la barre en fonction de la performance vs la cible
  const getBarColor = (value: number, target: number) => {
    const ratio = value / target;
    if (ratio >= 1) return 'bg-green-500'; // Au-dessus de la cible
    if (ratio >= 0.9) return 'bg-yellow-500'; // Proche de la cible
    return 'bg-red-500'; // Bien en-dessous de la cible
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Métriques de Performance</h3>
        <button className="p-1 text-gray-400 hover:text-gray-600">
          <Download className="h-5 w-5" />
        </button>
      </div>
      
      <div className="space-y-5">
        {data.map((metric, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getMetricIcon(metric.metric)}
                <span className="font-medium text-gray-800">{metric.metric}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className={`font-medium ${
                  metric.value >= metric.target ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.value}%
                </span>
                <span className="text-gray-500">
                  / {metric.target}%
                </span>
              </div>
            </div>
            
            {/* Barre de progression */}
            <div className="h-2.5 bg-gray-200 rounded-full">
              <div 
                className={`h-2.5 rounded-full ${getBarColor(metric.value, metric.target)}`}
                style={{ width: `${metric.value}%`, transition: 'width 1s ease-in-out' }}
              />
            </div>
            
            {/* Indicateur de cible */}
            <div className="relative h-0">
              <div 
                className="absolute top-[-10px] w-px h-4 bg-gray-400"
                style={{ left: `${metric.target}%` }}
              >
                <div className="absolute -top-6 transform -translate-x-1/2 left-0">
                  <div className="text-[10px] text-gray-500 whitespace-nowrap">Objectif: {metric.target}%</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Synthèse */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className={`flex items-start gap-2 p-3 rounded-lg ${
          data.every(m => m.value >= m.target) 
            ? 'bg-green-50 text-green-800'
            : data.some(m => m.value < m.target * 0.9)
              ? 'bg-red-50 text-red-800'
              : 'bg-yellow-50 text-yellow-800'
        }`}>
          {data.every(m => m.value >= m.target) ? (
            <Shield className="h-5 w-5 flex-shrink-0" />
          ) : data.some(m => m.value < m.target * 0.9) ? (
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          ) : (
            <Eye className="h-5 w-5 flex-shrink-0" />
          )}
          
          <div className="text-sm">
            {data.every(m => m.value >= m.target) 
              ? 'Toutes les métriques atteignent ou dépassent les objectifs'
              : data.some(m => m.value < m.target * 0.9)
                ? 'Certaines métriques sont significativement en dessous des objectifs'
                : 'La plupart des métriques sont proches des objectifs'}
          </div>
        </div>
      </div>
    </div>
  );
};