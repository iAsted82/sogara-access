import React, { useState } from 'react';
import { BarChart3, TrendingUp, Calendar, Download, Filter, Users, FileText, Import as Passport, MapPin } from 'lucide-react';

export const StatisticsModule: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedRegion, setSelectedRegion] = useState('all');

  const statsData = {
    documents: {
      cni: { current: 1247, previous: 1115, change: 11.8 },
      passports: { current: 834, previous: 778, change: 7.2 },
      visas: { current: 567, previous: 492, change: 15.2 },
      certificates: { current: 312, previous: 298, change: 4.7 }
    },
    regions: [
      { name: 'Estuaire', documents: 45, percentage: 38.2 },
      { name: 'Haut-Ogooué', documents: 28, percentage: 23.7 },
      { name: 'Ogooué-Maritime', documents: 18, percentage: 15.3 },
      { name: 'Moyen-Ogooué', documents: 12, percentage: 10.2 },
      { name: 'Autres', documents: 15, percentage: 12.7 }
    ],
    revenue: {
      total: 127000000,
      target: 125000000,
      achievement: 101.6
    }
  };

  const recentTrends = [
    { month: 'Jan', cni: 1100, passports: 750, visas: 450 },
    { month: 'Fév', cni: 1150, passports: 780, visas: 480 },
    { month: 'Mar', cni: 1200, passports: 820, visas: 510 },
    { month: 'Avr', cni: 1247, passports: 834, visas: 567 }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Statistiques et Rapports</h1>
          <p className="text-gray-600">Analyse des performances et indicateurs clés</p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="quarter">Ce trimestre</option>
            <option value="year">Cette année</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exporter
          </button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">CNI émises</p>
              <p className="text-2xl font-bold text-blue-600">{statsData.documents.cni.current.toLocaleString()}</p>
              <p className="text-sm text-green-600 mt-1">
                +{statsData.documents.cni.change}% vs période précédente
              </p>
            </div>
            <div className="bg-blue-100 rounded-lg p-3">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Passeports émis</p>
              <p className="text-2xl font-bold text-green-600">{statsData.documents.passports.current.toLocaleString()}</p>
              <p className="text-sm text-green-600 mt-1">
                +{statsData.documents.passports.change}% vs période précédente
              </p>
            </div>
            <div className="bg-green-100 rounded-lg p-3">
              <Passport className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Visas délivrés</p>
              <p className="text-2xl font-bold text-purple-600">{statsData.documents.visas.current.toLocaleString()}</p>
              <p className="text-sm text-green-600 mt-1">
                +{statsData.documents.visas.change}% vs période précédente
              </p>
            </div>
            <div className="bg-purple-100 rounded-lg p-3">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Recettes</p>
              <p className="text-2xl font-bold text-orange-600">{formatCurrency(statsData.revenue.total)}</p>
              <p className="text-sm text-green-600 mt-1">
                {statsData.revenue.achievement}% de l'objectif
              </p>
            </div>
            <div className="bg-orange-100 rounded-lg p-3">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Production Trends */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Évolution de la production</h3>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">4 derniers mois</span>
            </div>
          </div>
          
          <div className="space-y-4">
            {recentTrends.map((trend, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-900 w-8">{trend.month}</span>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">CNI: {trend.cni.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Passeports: {trend.passports.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Visas: {trend.visas.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Répartition régionale</h3>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Par province</span>
            </div>
          </div>
          
          <div className="space-y-4">
            {statsData.regions.map((region, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-blue-600">
                      {region.name.charAt(0)}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{region.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${region.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">
                    {region.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Résumé des performances</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900">Objectifs atteints</h4>
            <p className="text-2xl font-bold text-green-600 mt-2">94.5%</p>
            <p className="text-sm text-gray-600 mt-1">Moyenne générale</p>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900">Citoyens servis</h4>
            <p className="text-2xl font-bold text-blue-600 mt-2">2,960</p>
            <p className="text-sm text-gray-600 mt-1">Ce mois</p>
          </div>
          
          <div className="text-center">
            <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="h-8 w-8 text-orange-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900">Temps moyen</h4>
            <p className="text-2xl font-bold text-orange-600 mt-2">12 min</p>
            <p className="text-sm text-gray-600 mt-1">Par demande</p>
          </div>
        </div>
      </div>
    </div>
  );
};