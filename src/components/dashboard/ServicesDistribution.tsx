import React, { useState, useEffect, useRef } from 'react';
import { PieChart, Download } from 'lucide-react';

interface ServicesDistributionProps {
  data: {
    name: string;
    value: number;
  }[];
}

export const ServicesDistribution: React.FC<ServicesDistributionProps> = ({ data }) => {
  const [selectedSegment, setSelectedSegment] = useState<number | null>(null);
  const [animateChart, setAnimateChart] = useState(true);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Réinitialise l'animation lors du changement de données
    setAnimateChart(false);
    const timeout = setTimeout(() => setAnimateChart(true), 50);
    return () => clearTimeout(timeout);
  }, [data]);

  // Calcule le total pour obtenir les pourcentages
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // Couleurs pour les segments du graphique
  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
    'bg-purple-500', 'bg-indigo-500', 'bg-pink-500', 
    'bg-red-500', 'bg-teal-500'
  ];
  
  // Calculer la position de chaque segment
  const segments = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    return {
      ...item,
      percentage,
      color: colors[index % colors.length]
    };
  });

  // Fonction pour générer le graphique en donut
  const renderDonutChart = () => {
    let cumulativePercentage = 0;
    
    return (
      <div className="relative w-48 h-48 mx-auto">
        <div className="absolute inset-0 rounded-full overflow-hidden">
          {segments.map((segment, index) => {
            const startPercentage = cumulativePercentage;
            cumulativePercentage += segment.percentage;
            
            return (
              <div
                key={index}
                className={`absolute inset-0 ${segment.color} ${animateChart ? 'transition-all duration-1000' : ''}`}
                style={{
                  clipPath: `conic-gradient(from ${startPercentage * 3.6}deg, transparent 0%, transparent 100%, transparent 100%)`
                }}
                onMouseEnter={() => setSelectedSegment(index)}
                onMouseLeave={() => setSelectedSegment(null)}
              />
            );
          })}
        </div>
        
        {/* Centre du donut */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-white flex items-center justify-center">
          <div className="text-center">
            <PieChart className="h-6 w-6 text-gray-400 mx-auto mb-1" />
            <div className="text-sm font-medium text-gray-800">
              Distribution
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Distribution des Services</h3>
        <button className="p-1 text-gray-400 hover:text-gray-600">
          <Download className="h-5 w-5" />
        </button>
      </div>
      
      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
        {/* Graphique */}
        <div className="lg:w-1/2" ref={chartRef}>
          <div className="relative">
            {renderDonutChart()}
          </div>
        </div>
        
        {/* Légende et détails */}
        <div className="lg:w-1/2">
          <div className="space-y-3">
            {segments.map((segment, index) => (
              <div 
                key={index}
                className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                  selectedSegment === index ? 'bg-gray-100' : ''
                }`}
                onMouseEnter={() => setSelectedSegment(index)}
                onMouseLeave={() => setSelectedSegment(null)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${segment.color}`}></div>
                  <span className="font-medium text-gray-800">{segment.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{segment.value} visites</span>
                  <span className="text-sm font-bold">{segment.percentage.toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Résumé */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="text-sm text-gray-600">
              <div className="flex justify-between items-center">
                <span>Total des services traités:</span>
                <span className="font-bold text-gray-900">{total}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span>Service le plus demandé:</span>
                <span className="font-medium text-gray-900">{
                  segments.sort((a, b) => b.value - a.value)[0]?.name
                }</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};