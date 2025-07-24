import React, { useState, useEffect, useCallback } from 'react';
import { 
  BarChart3, PieChart, LineChart, ArrowUpRight, ArrowDownRight, 
  Download, RefreshCw, Filter, Calendar, ChevronDown, FileSpreadsheet,
  Users, FileText, Import as Passport, TrendingUp, Clock, CheckCircle, 
  Bell, AlertTriangle, Building2, MapPin, Briefcase, Package, Eye, Search
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { DashboardHeader } from './DashboardHeader';
import { KpiCard } from './KpiCard';
import { VisitorsChart } from './VisitorsChart';
import { ServicesDistribution } from './ServicesDistribution';
import { PerformanceMetrics } from './PerformanceMetrics';
import { RecentActivity } from './RecentActivity';
import { DepartmentPerformance } from './DepartmentPerformance';

const DashboardModule: React.FC = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('week');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [department, setDepartment] = useState('all');
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [exportFormat, setExportFormat] = useState<'csv' | 'excel'>('csv');
  const [showExportOptions, setShowExportOptions] = useState(false);
  
  // Charger les données du tableau de bord
  const loadDashboardData = useCallback(async () => {
    setIsRefreshing(true);
    setError(null);
    
    try {
      // Dans une application réelle, ceci serait un appel API
      // Ici nous simulons un délai pour montrer le chargement
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Données simulées
      const mockData = {
        timeRange,
        department,
        kpis: {
          visitorsTotal: 1486,
          visitorsChange: 12.5,
          documentsProcessed: 892,
          documentsChange: 8.3,
          passportsIssued: 347,
          passportsChange: 5.2,
          visasApproved: 215,
          visasChange: 15.7,
          avgProcessingTime: 22, // minutes
          timeChange: -5.3,
          satisfactionRate: 4.7,
          satisfactionChange: 0.3
        },
        visitorsByDay: [
          { day: 'Lun', count: 245, target: 220 },
          { day: 'Mar', count: 290, target: 220 },
          { day: 'Mer', count: 187, target: 220 },
          { day: 'Jeu', count: 305, target: 220 },
          { day: 'Ven', count: 321, target: 220 },
          { day: 'Sam', count: 138, target: 120 },
          { day: 'Dim', count: 0, target: 0 }
        ],
        servicesDistribution: [
          { name: 'Documentation', value: 45 },
          { name: 'Immigration', value: 25 },
          { name: 'Passeports', value: 15 },
          { name: 'Visas', value: 10 },
          { name: 'Autres', value: 5 }
        ],
        performanceMetrics: [
          { metric: 'Vitesse de traitement', value: 88, target: 85 },
          { metric: 'Satisfaction client', value: 94, target: 90 },
          { metric: 'Précision des données', value: 97, target: 95 },
          { metric: 'Rendez-vous respectés', value: 92, target: 95 }
        ],
        recentActivity: [
          {
            id: 'act-1',
            type: 'visitor',
            message: 'Nouveau visiteur enregistré - Marie OBAME',
            timestamp: '2024-06-10T09:15:00',
            status: 'success'
          },
          {
            id: 'act-2',
            type: 'document',
            message: 'Demande CNI approuvée - Paul OBIANG',
            timestamp: '2024-06-10T10:30:00',
            status: 'success'
          },
          {
            id: 'act-3',
            type: 'system',
            message: 'Sauvegarde système complétée',
            timestamp: '2024-06-10T11:00:00',
            status: 'info'
          },
          {
            id: 'act-4',
            type: 'alert',
            message: 'Dépassement temps d\'attente - Zone Passeports',
            timestamp: '2024-06-10T11:45:00',
            status: 'warning'
          },
          {
            id: 'act-5',
            type: 'visa',
            message: 'Demande visa refusée - Motif: documents incomplets',
            timestamp: '2024-06-10T13:15:00',
            status: 'error'
          }
        ],
        departmentPerformance: [
          { name: 'Documentation', processed: 453, target: 430, satisfaction: 4.6 },
          { name: 'Immigration', processed: 215, target: 200, satisfaction: 4.3 },
          { name: 'Passeports', processed: 184, target: 180, satisfaction: 4.8 },
          { name: 'Visas', processed: 132, target: 150, satisfaction: 4.2 },
          { name: 'Administration', processed: 87, target: 90, satisfaction: 4.5 }
        ],
        timestamp: new Date().toISOString()
      };
      
      setDashboardData(mockData);
    } catch (err) {
      console.error("Erreur lors du chargement des données:", err);
      setError("Impossible de charger les données du tableau de bord. Veuillez réessayer.");
    } finally {
      setIsRefreshing(false);
    }
  }, [timeRange, department]);
  
  // Charger les données au montage et quand les filtres changent
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);
  
  // Configurer la mise à jour automatique toutes les 5 minutes
  useEffect(() => {
    const intervalId = setInterval(() => {
      loadDashboardData();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [loadDashboardData]);
  
  // Gérer l'exportation des données
  const handleExport = () => {
    if (!dashboardData) return;
    
    // Dans une implémentation réelle, on générerait un fichier CSV/Excel
    // Pour cette démo, nous allons simuler un téléchargement
    
    alert(`Export des données en format ${exportFormat.toUpperCase()} déclenché`);
    console.log("Données exportées:", dashboardData);
    
    // Fermer les options d'export
    setShowExportOptions(false);
  };

  // Gérer le changement de plage temporelle
  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
  };

  if (error) {
    return (
      <div className="p-8 text-center">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Erreur</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={loadDashboardData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-module="dashboard">
      {/* Entête du tableau de bord */}
      <DashboardHeader 
        timeRange={timeRange} 
        onTimeRangeChange={handleTimeRangeChange}
        onRefresh={loadDashboardData}
        isRefreshing={isRefreshing}
        lastUpdated={dashboardData.timestamp}
      />

      {/* Filtres et contrôles */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Filtres */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
              >
                <Filter className="h-5 w-5" />
                <span>Filtres</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Sélecteur de plage */}
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <button 
                onClick={() => handleTimeRangeChange('day')}
                className={`px-3 py-1.5 text-sm ${timeRange === 'day' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                Jour
              </button>
              <button 
                onClick={() => handleTimeRangeChange('week')}
                className={`px-3 py-1.5 text-sm ${timeRange === 'week' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                Semaine
              </button>
              <button 
                onClick={() => handleTimeRangeChange('month')}
                className={`px-3 py-1.5 text-sm ${timeRange === 'month' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                Mois
              </button>
              <button 
                onClick={() => handleTimeRangeChange('quarter')}
                className={`px-3 py-1.5 text-sm ${timeRange === 'quarter' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                Trimestre
              </button>
            </div>

            {/* Date picker */}
            <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900 px-3 py-1.5 border border-gray-300 rounded-lg">
              <Calendar className="h-4 w-4" />
              <span>Date</span>
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button 
              onClick={loadDashboardData}
              className="flex items-center gap-2 px-3 py-1.5 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg"
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Rafraîchissement...' : 'Rafraîchir'}</span>
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setShowExportOptions(!showExportOptions)}
                className="flex items-center gap-2 px-3 py-1.5 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg"
              >
                <Download className="h-4 w-4" />
                <span>Exporter</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showExportOptions ? 'rotate-180' : ''}`} />
              </button>

              {/* Options d'export */}
              {showExportOptions && (
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-10">
                  <div className="py-1">
                    <button 
                      onClick={() => {
                        setExportFormat('csv');
                        handleExport();
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                    >
                      <FileSpreadsheet className="h-4 w-4" />
                      <span>Exporter en CSV</span>
                    </button>
                    <button 
                      onClick={() => {
                        setExportFormat('excel');
                        handleExport();
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                    >
                      <FileSpreadsheet className="h-4 w-4" />
                      <span>Exporter en Excel</span>
                    </button>
                  </div>
                </div>
              )
              }
        <div className="text-center text-xs text-gray-500 pt-2">
          Ce document a été généré par SOGARA Access le {new Date().toLocaleString('fr-FR')}.<br/>
          </div>
        </div>

        {/* Filtres avancés (conditionnels) */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Département
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="all">Tous les départements</option>
                <option value="documentation">Documentation</option>
                <option value="immigration">Immigration</option>
                <option value="passeports">Passeports</option>
                <option value="visas">Visas</option>
                <option value="administration">Administration</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type de service
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="all">Tous les services</option>
                <option value="cni">Demande CNI</option>
                <option value="passport">Demande passeport</option>
                <option value="visa">Demande visa</option>
                <option value="certificate">Certificats</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Localisation
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="all">Tous les sites</option>
                <option value="libreville">DGI Libreville</option>
                <option value="port-gentil">DGI Port-Gentil</option>
                <option value="franceville">DGI Franceville</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* KPIs principaux */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-4">
        <KpiCard 
          title="Visiteurs"
          value={dashboardData.kpis.visitorsTotal}
          change={dashboardData.kpis.visitorsChange}
          icon={Users}
          color="blue"
        />
        <KpiCard 
          title="Documents traités"
          value={dashboardData.kpis.documentsProcessed}
          change={dashboardData.kpis.documentsChange}
          icon={FileText}
          color="green"
        />
        <KpiCard 
          title="Passeports émis"
          value={dashboardData.kpis.passportsIssued}
          change={dashboardData.kpis.passportsChange}
          icon={Passport}
          color="purple"
        />
        <KpiCard 
          title="Visas approuvés"
          value={dashboardData.kpis.visasApproved}
          change={dashboardData.kpis.visasChange}
          icon={CheckCircle}
          color="indigo"
        />
        <KpiCard 
          title="Temps moyen"
          value={`${dashboardData.kpis.avgProcessingTime} min`}
          change={dashboardData.kpis.timeChange}
          icon={Clock}
          color="orange"
        />
        <KpiCard 
          title="Satisfaction"
          value={`${dashboardData.kpis.satisfactionRate}/5`}
          change={dashboardData.kpis.satisfactionChange}
          icon={TrendingUp}
          color="yellow"
        />
      </div>

      {/* Graphiques et analyses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique des visiteurs */}
        <VisitorsChart 
          data={dashboardData.visitorsByDay} 
          timeRange={timeRange}
        />
        
        {/* Distribution des services */}
        <ServicesDistribution 
          data={dashboardData.servicesDistribution}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Métriques de performance */}
        <PerformanceMetrics 
          data={dashboardData.performanceMetrics}
        />
        
        {/* Activité récente */}
        <RecentActivity 
          data={dashboardData.recentActivity}
        />
        
        {/* Performance par département */}
        <DepartmentPerformance 
          data={dashboardData.departmentPerformance}
        />
      </div>

      {/* Footer */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
        <p className="text-sm text-gray-600">
          Données actualisées le {new Date(dashboardData.timestamp).toLocaleString('fr-FR')}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Les données sont automatiquement rafraîchies toutes les 5 minutes
        </p>
      </div>
    </div>
  );
};

export default DashboardModule;