import React, { useState } from 'react';
import { 
  BarChart3, TrendingUp, Calendar, Clock, Users, 
  CheckCircle, ChevronDown, ChevronUp, User, 
  Building2, BarChart, Download, FileText, FileSpreadsheet 
} from 'lucide-react';

interface VisitorStatisticsProps {
  visitors: any[]; // Utiliser le type approprié selon vos données
  appointments: any[];
  className?: string;
  onExportStats?: (format: string) => void;
}

export const VisitorStatistics: React.FC<VisitorStatisticsProps> = ({
  visitors,
  appointments,
  className = '',
  onExportStats
}) => {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('week');
  const [showDetails, setShowDetails] = useState<string[]>([]);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel'>('pdf');
  const [showExportOptions, setShowExportOptions] = useState(false);
  
  // Fonction pour calculer les statistiques
  const calculateStats = () => {
    // Dans une application réelle, ces stats seraient calculées à partir des données réelles
    return {
      today: {
        totalVisitors: 47,
        completed: 32,
        inProgress: 15,
        withAppointment: 28,
        withoutAppointment: 19,
        avgDuration: 45, // en minutes
        peakHour: '10:00 - 11:00',
        satisfactionRate: 4.7
      },
      week: {
        totalVisitors: 324,
        completed: 302,
        inProgress: 22,
        withAppointment: 203,
        withoutAppointment: 121,
        avgDuration: 42, // en minutes
        peakDay: 'Mardi',
        satisfactionRate: 4.5
      },
      departmentBreakdown: [
        { name: 'Documentation', count: 152, percentage: 47 },
        { name: 'Passeports', count: 87, percentage: 27 },
        { name: 'Immigration', count: 54, percentage: 17 },
        { name: 'Administration', count: 31, percentage: 9 }
      ],
      serviceBreakdown: [
        { name: 'Demande CNI', count: 98, percentage: 30 },
        { name: 'Renouvellement Passeport', count: 65, percentage: 20 },
        { name: 'Demande Visa', count: 54, percentage: 17 },
        { name: 'Certificat Nationalité', count: 42, percentage: 13 },
        { name: 'Autres Services', count: 65, percentage: 20 }
      ],
      timeDistribution: [
        { hour: '8-9h', count: 31, percentage: 10 },
        { hour: '9-10h', count: 52, percentage: 16 },
        { hour: '10-11h', count: 83, percentage: 26 },
        { hour: '11-12h', count: 45, percentage: 14 },
        { hour: '14-15h', count: 61, percentage: 19 },
        { hour: '15-16h', count: 34, percentage: 10 },
        { hour: '16-17h', count: 18, percentage: 5 }
      ]
    };
  };
  
  const stats = calculateStats();
  
  // Basculer l'affichage des détails
  const toggleDetails = (section: string) => {
    setShowDetails(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };
  
  // Gérer l'exportation des statistiques
  const handleExport = () => {
    if (onExportStats) {
      onExportStats(exportFormat);
    }
    setShowExportOptions(false);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* En-tête avec contrôles */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Statistiques des Visiteurs</h3>
            <p className="text-gray-600">Analyse des tendances et performances</p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Sélection de la période */}
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <button 
                onClick={() => setTimeRange('day')}
                className={`px-3 py-1.5 text-sm ${timeRange === 'day' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                Jour
              </button>
              <button 
                onClick={() => setTimeRange('week')}
                className={`px-3 py-1.5 text-sm ${timeRange === 'week' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                Semaine
              </button>
              <button 
                onClick={() => setTimeRange('month')}
                className={`px-3 py-1.5 text-sm ${timeRange === 'month' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                Mois
              </button>
              <button 
                onClick={() => setTimeRange('year')}
                className={`px-3 py-1.5 text-sm ${timeRange === 'year' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                Année
              </button>
            </div>
            
            {/* Exportation */}
            <div className="relative">
              <button 
                onClick={() => setShowExportOptions(!showExportOptions)}
                className="px-3 py-1.5 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                <span>Exporter</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showExportOptions ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Menu d'exportation */}
              {showExportOptions && (
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-10">
                  <div className="py-1">
                    <button 
                      onClick={() => {
                        setExportFormat('pdf');
                        handleExport();
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                    >
                      <FileText className="h-4 w-4 text-red-600" />
                      <span>Exporter en PDF</span>
                    </button>
                    <button 
                      onClick={() => {
                        setExportFormat('excel');
                        handleExport();
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                    >
                      <FileSpreadsheet className="h-4 w-4 text-green-600" />
                      <span>Exporter en Excel</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* KPIs principaux */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Visiteurs</p>
              <p className="text-2xl font-bold text-gray-900">
                {timeRange === 'day' ? stats.today.totalVisitors : stats.week.totalVisitors}
              </p>
              <p className="text-xs text-green-600 mt-1">+12% vs période précédente</p>
            </div>
            <div className="bg-blue-100 rounded-lg p-3">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Visites Terminées</p>
              <p className="text-2xl font-bold text-green-600">
                {timeRange === 'day' ? stats.today.completed : stats.week.completed}
              </p>
              <p className="text-xs text-green-600 mt-1">
                {timeRange === 'day' 
                  ? `${Math.round((stats.today.completed / stats.today.totalVisitors) * 100)}%` 
                  : `${Math.round((stats.week.completed / stats.week.totalVisitors) * 100)}%`} du total
              </p>
            </div>
            <div className="bg-green-100 rounded-lg p-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Temps Moyen</p>
              <p className="text-2xl font-bold text-orange-600">
                {timeRange === 'day' ? `${stats.today.avgDuration}m` : `${stats.week.avgDuration}m`}
              </p>
              <p className="text-xs text-green-600 mt-1">-3min vs période précédente</p>
            </div>
            <div className="bg-orange-100 rounded-lg p-3">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Satisfaction</p>
              <p className="text-2xl font-bold text-indigo-600">
                {timeRange === 'day' ? stats.today.satisfactionRate : stats.week.satisfactionRate}/5
              </p>
              <p className="text-xs text-green-600 mt-1">+0.2 vs période précédente</p>
            </div>
            <div className="bg-indigo-100 rounded-lg p-3">
              <TrendingUp className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Répartition par département */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div 
          className="p-5 border-b border-gray-200 flex justify-between items-center cursor-pointer"
          onClick={() => toggleDetails('departments')}
        >
          <div className="flex items-center gap-3">
            <Building2 className="h-5 w-5 text-blue-600" />
            <h4 className="font-semibold text-lg text-gray-900">Répartition par Département</h4>
          </div>
          {showDetails.includes('departments') ? 
            <ChevronUp className="h-5 w-5 text-gray-500" /> : 
            <ChevronDown className="h-5 w-5 text-gray-500" />
          }
        </div>
        
        {showDetails.includes('departments') && (
          <div className="p-5 space-y-4">
            {stats.departmentBreakdown.map((dept, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full bg-blue-${(6-index) * 100}`}></div>
                    <span className="font-medium text-gray-900">{dept.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700">{dept.count}</span>
                    <span className="text-sm text-gray-500">{dept.percentage}%</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-2 bg-blue-${(6-index) * 100}`}
                    style={{ width: `${dept.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
            
            <div className="bg-blue-50 p-4 mt-4 rounded-lg border border-blue-100">
              <div className="flex items-start gap-3">
                <BarChart className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <div>
                  <h5 className="font-medium text-blue-900">Analyse</h5>
                  <p className="text-sm text-blue-800 mt-1">
                    Le département de Documentation reçoit près de la moitié des visiteurs (47%). 
                    Cela suggère que les demandes de CNI et de documents administratifs restent le service 
                    le plus demandé par les citoyens.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Distribution par type de service */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div 
          className="p-5 border-b border-gray-200 flex justify-between items-center cursor-pointer"
          onClick={() => toggleDetails('services')}
        >
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-green-600" />
            <h4 className="font-semibold text-lg text-gray-900">Distribution par Type de Service</h4>
          </div>
          {showDetails.includes('services') ? 
            <ChevronUp className="h-5 w-5 text-gray-500" /> : 
            <ChevronDown className="h-5 w-5 text-gray-500" />
          }
        </div>
        
        {showDetails.includes('services') && (
          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Graphique (simulé) */}
              <div className="flex items-center justify-center">
                <div className="w-64 h-64 rounded-full border-8 border-gray-100 relative">
                  {stats.serviceBreakdown.map((service, index) => {
                    const rotate = index > 0 
                      ? stats.serviceBreakdown.slice(0, index).reduce((acc, curr) => acc + curr.percentage, 0) * 3.6 
                      : 0;
                    
                    return (
                      <div 
                        key={index}
                        className={`absolute inset-0 bg-${['blue', 'green', 'yellow', 'purple', 'indigo'][index % 5]}-500`}
                        style={{ 
                          clipPath: `conic-gradient(from ${rotate}deg, currentColor ${service.percentage * 3.6}deg, transparent 0)` 
                        }}
                      ></div>
                    );
                  })}
                  <div className="absolute inset-0 m-auto w-32 h-32 bg-white rounded-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="font-medium text-gray-900">{stats.week.totalVisitors}</div>
                      <div className="text-sm text-gray-500">Visiteurs</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Légende et détails */}
              <div>
                <div className="space-y-3">
                  {stats.serviceBreakdown.map((service, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`h-3 w-3 rounded-full bg-${['blue', 'green', 'yellow', 'purple', 'indigo'][index % 5]}-500`}></div>
                        <span className="text-sm">{service.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{service.count}</span>
                        <span className="text-xs text-gray-500">{service.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Distribution horaire */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div 
          className="p-5 border-b border-gray-200 flex justify-between items-center cursor-pointer"
          onClick={() => toggleDetails('timeDistribution')}
        >
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-purple-600" />
            <h4 className="font-semibold text-lg text-gray-900">Distribution Horaire</h4>
          </div>
          {showDetails.includes('timeDistribution') ? 
            <ChevronUp className="h-5 w-5 text-gray-500" /> : 
            <ChevronDown className="h-5 w-5 text-gray-500" />
          }
        </div>
        
        {showDetails.includes('timeDistribution') && (
          <div className="p-5">
            <div className="flex items-end justify-between gap-2 h-40">
              {stats.timeDistribution.map((hour, index) => (
                <div 
                  key={index}
                  className="flex-1 flex flex-col items-center"
                >
                  <div className="text-xs text-gray-500 mb-1">{hour.count}</div>
                  <div 
                    className="w-full bg-purple-500 rounded-t"
                    style={{ height: `${(hour.count / Math.max(...stats.timeDistribution.map(h => h.count))) * 120}px` }}
                  ></div>
                  <div className="text-xs text-gray-700 mt-1">{hour.hour}</div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 bg-purple-50 p-4 rounded-lg border border-purple-100">
              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-purple-600 flex-shrink-0" />
                <div>
                  <h5 className="font-medium text-purple-900">Analyse de l'affluence</h5>
                  <p className="text-sm text-purple-800 mt-1">
                    Les pics d'affluence se situent entre 10h et 11h le matin, et entre 14h et 15h l'après-midi.
                    La période la plus calme est entre 16h et 17h.
                    Il est recommandé d'allouer plus de personnel pendant les heures de pointe.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Comparaisons */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div 
          className="p-5 border-b border-gray-200 flex justify-between items-center cursor-pointer"
          onClick={() => toggleDetails('comparisons')}
        >
          <div className="flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-indigo-600" />
            <h4 className="font-semibold text-lg text-gray-900">Comparaisons et Tendances</h4>
          </div>
          {showDetails.includes('comparisons') ? 
            <ChevronUp className="h-5 w-5 text-gray-500" /> : 
            <ChevronDown className="h-5 w-5 text-gray-500" />
          }
        </div>
        
        {showDetails.includes('comparisons') && (
          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <h5 className="font-medium text-gray-900">Avec vs Sans Rendez-vous</h5>
                </div>
                <div className="space-y-2 mt-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-500">Avec Rendez-vous</span>
                      <span className="text-sm font-medium text-gray-900">{stats.week.withAppointment}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-green-500 rounded-full"
                        style={{ width: `${(stats.week.withAppointment / stats.week.totalVisitors) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-500">Sans Rendez-vous</span>
                      <span className="text-sm font-medium text-gray-900">{stats.week.withoutAppointment}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-blue-500 rounded-full"
                        style={{ width: `${(stats.week.withoutAppointment / stats.week.totalVisitors) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <h5 className="font-medium text-gray-900">Temps de Traitement</h5>
                </div>
                <div className="mt-3 text-center">
                  <div className="text-3xl font-bold text-orange-600">{stats.week.avgDuration}</div>
                  <div className="text-sm text-gray-600">Minutes en moyenne</div>
                  
                  <div className="flex justify-between mt-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-800">25</div>
                      <div className="text-xs text-gray-500">Min</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-800">{stats.week.avgDuration}</div>
                      <div className="text-xs text-gray-500">Moy</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-800">90</div>
                      <div className="text-xs text-gray-500">Max</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <h5 className="font-medium text-gray-900">Tendance Mensuelle</h5>
                </div>
                <div className="flex items-end gap-1 h-32 mt-3">
                  {[310, 285, 350, 390, 370, 345, 324].map((count, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-green-500 rounded-t"
                        style={{ height: `${(count / 390) * 100}%` }}
                      ></div>
                      <div className="text-xs text-gray-500 mt-1">S{index + 1}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-5 text-center">
              <button 
                onClick={() => onExportStats && onExportStats('pdf')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Rapport Détaillé
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Note de bas de page */}
      <div className="text-center text-xs text-gray-500 pt-2">
        Données générées le {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR')}
      </div>
    </div>
  );
};