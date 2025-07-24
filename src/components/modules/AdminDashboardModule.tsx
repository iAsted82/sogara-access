import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  FileText, 
  Image as ImageIcon,
  Award,
  Palette, 
  BarChart3, 
  Bell, 
  Settings, 
  Shield, 
  Clock, 
  Calendar,
  Eye,
  RefreshCw,
  Loader,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ChevronRight,
  Download,
  Search,
  Filter,
  Grid,
  List,
  Star,
  Zap,
  ArrowUpRight,
  ExternalLink,
  Info,
  HelpCircle,
  Edit,
  Trash2,
  Share,
  Save,
  Lock,
  Activity,
  Server
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const AdminDashboardModule: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [statsInterval, setStatsInterval] = useState<'day' | 'week' | 'month'>('day');
  const [activityType, setActivityType] = useState<'all' | 'user' | 'content' | 'system'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeSection, setActiveSection] = useState<'overview' | 'performance' | 'alerts' | 'activity'>('overview');
  const { user } = useAuth();

  useEffect(() => {
    // Simuler le chargement des données
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Données statistiques simulées
  const systemStats = {
    usersTotal: 358,
    usersActive: 42,
    usersGrowth: 5.2,
    contentItems: 842,
    contentGrowth: 12.3,
    visitors: 15742,
    visitorsGrowth: 8.7,
    systemHealth: 98.5,
    uptime: "99.98%",
    responseTime: "0.8s",
    errorRate: "0.02%",
    storageUsed: "42.8GB",
    storageTotal: "100GB",
    mediaItems: 1247,
    pendingTasks: 8,
    lastBackup: "2024-06-10 03:00:00",
    serverLoad: 23.4,
    memoryUsage: 42.1
  };

  // Activités récentes simulées
  const recentActivities = [
    {
      id: 'act-001',
      type: 'user',
      action: 'Connexion',
      user: 'Marie Akue',
      timestamp: '2024-06-10T10:30:00',
      details: 'Connexion depuis Libreville, IP: 192.168.1.100',
      status: 'success'
    },
    {
      id: 'act-002',
      type: 'content',
      action: 'Publication',
      user: 'Robert Ndong',
      timestamp: '2024-06-10T09:15:00',
      details: 'Publication de "Mise à jour des procédures CNI"',
      status: 'success'
    },
    {
      id: 'act-003',
      type: 'system',
      action: 'Sauvegarde',
      user: 'Système',
      timestamp: '2024-06-10T08:00:00',
      details: 'Sauvegarde automatique complétée - 2.3GB',
      status: 'success'
    },
    {
      id: 'act-004',
      type: 'user',
      action: 'Création compte',
      user: 'Robert Ndong',
      timestamp: '2024-06-09T16:45:00',
      details: 'Création du compte pour "Paul Obiang"',
      status: 'success'
    },
    {
      id: 'act-005',
      type: 'content',
      action: 'Modification',
      user: 'Sophie Ella',
      timestamp: '2024-06-09T14:30:00',
      details: 'Mise à jour du logo principal',
      status: 'warning'
    },
    {
      id: 'act-006',
      type: 'system',
      action: 'Mise à jour',
      user: 'Système',
      timestamp: '2024-06-09T02:15:00',
      details: 'Mise à jour système v2.4.1 appliquée avec succès',
      status: 'success'
    },
    {
      id: 'act-007',
      type: 'user',
      action: 'Tentative connexion',
      user: 'Inconnu',
      timestamp: '2024-06-08T21:30:00',
      details: 'Tentative échouée depuis IP: 87.112.45.28',
      status: 'error'
    },
    {
      id: 'act-008',
      type: 'content',
      action: 'Suppression',
      user: 'Robert Ndong',
      timestamp: '2024-06-08T15:45:00',
      details: 'Suppression de la page "Test temporaire"',
      status: 'success'
    }
  ];

  // Alertes systèmes simulées
  const systemAlerts = [
    {
      id: 'alert-001',
      type: 'warning',
      message: 'Espace disque faible - 85% utilisé',
      timestamp: '2024-06-10T08:30:00',
      priority: 'medium',
      resolved: false
    },
    {
      id: 'alert-002',
      type: 'success',
      message: 'Sauvegarde complétée avec succès',
      timestamp: '2024-06-10T08:00:00',
      priority: 'low',
      resolved: true
    },
    {
      id: 'alert-003',
      type: 'error',
      message: 'Échec tentative de connexion - 5 essais',
      timestamp: '2024-06-09T22:15:00',
      priority: 'high',
      resolved: false
    },
    {
      id: 'alert-004',
      type: 'warning',
      message: 'Certificat SSL expire dans 15 jours',
      timestamp: '2024-06-09T14:10:00',
      priority: 'medium',
      resolved: false
    },
    {
      id: 'alert-005',
      type: 'error',
      message: 'Échec intégration API paiement',
      timestamp: '2024-06-08T11:45:00',
      priority: 'high',
      resolved: true
    }
  ];

  // Performances des modules simulées
  const modulePerformance = [
    { name: 'Accueil', views: 8742, growth: 12.3, responseTime: 0.8 },
    { name: 'Documentation', views: 4321, growth: 8.7, responseTime: 1.2 },
    { name: 'Immigration', views: 3256, growth: -2.1, responseTime: 1.5 },
    { name: 'Réception', views: 2189, growth: 15.4, responseTime: 0.9 },
    { name: 'Audit', views: 1835, growth: 5.2, responseTime: 1.1 }
  ];
  
  // Données d'usage système simulées
  const systemUsageData = [
    { time: '08:00', cpu: 25, memory: 40, visitors: 120 },
    { time: '10:00', cpu: 42, memory: 45, visitors: 280 },
    { time: '12:00', cpu: 65, memory: 60, visitors: 350 },
    { time: '14:00', cpu: 54, memory: 52, visitors: 410 },
    { time: '16:00', cpu: 48, memory: 48, visitors: 380 },
    { time: '18:00', cpu: 30, memory: 45, visitors: 220 },
    { time: '20:00', cpu: 22, memory: 38, visitors: 150 },
  ];
  
  // Tâches en attente simulées
  const pendingTasks = [
    {
      id: 'task-001',
      title: 'Renouvellement certificat SSL',
      dueDate: '2024-06-25',
      priority: 'high',
      assignee: 'Admin Système'
    },
    {
      id: 'task-002',
      title: 'Revue des permissions utilisateurs',
      dueDate: '2024-06-15',
      priority: 'medium',
      assignee: 'Robert Ndong'
    },
    {
      id: 'task-003',
      title: 'Mise à jour contenu page d\'accueil',
      dueDate: '2024-06-12',
      priority: 'medium',
      assignee: 'Sophie Ella'
    },
    {
      id: 'task-004',
      title: 'Optimisation base de données',
      dueDate: '2024-06-30',
      priority: 'low',
      assignee: 'Admin Système'
    }
  ];

  // Rapports récents simulés
  const recentReports = [
    {
      id: 'report-001',
      title: 'Activité utilisateurs - Mai 2024',
      type: 'users',
      createdAt: '2024-06-05',
      creator: 'Système',
      format: 'PDF'
    },
    {
      id: 'report-002',
      title: 'Audit sécurité - Q2 2024',
      type: 'security',
      createdAt: '2024-06-01',
      creator: 'Robert Ndong',
      format: 'XLSX'
    },
    {
      id: 'report-003',
      title: 'Performance système - Mai 2024',
      type: 'system',
      createdAt: '2024-06-01',
      creator: 'Système',
      format: 'PDF'
    }
  ];

  // Filtrer les activités
  const filteredActivities = recentActivities.filter(activity => {
    if (activityType === 'all') return true;
    return activity.type === activityType;
  });

  // Fonction pour le formatage des dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Fonction pour obtenir l'icône selon le type d'activité
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'content':
        return <FileText className="h-4 w-4 text-green-500" />;
      case 'system':
        return <Settings className="h-4 w-4 text-purple-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  // Fonction pour obtenir l'icône selon le type d'alerte
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-blue-500" />;
    }
  };

  // Fonction pour obtenir la couleur selon la priorité
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low':
        return 'text-blue-600 bg-blue-100 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  // Fonction pour obtenir la couleur selon le statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[400px]">
        <Loader className="h-12 w-12 text-blue-500 animate-spin mb-4" />
        <p className="text-lg text-gray-600">Chargement du tableau de bord administrateur...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header avec titre et date */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord Administrateur</h1>
          <p className="text-gray-600">
            {new Date().toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            <span>Actualiser</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span>Exporter</span>
          </button>
        </div>
      </div>

      {/* Navigation des sections */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1">
        <div className="flex flex-wrap">
          <button 
            className={`px-4 py-2 rounded-lg font-medium text-sm ${
              activeSection === 'overview' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setActiveSection('overview')}
          >
            Vue d'ensemble
          </button>
          <button 
            className={`px-4 py-2 rounded-lg font-medium text-sm ${
              activeSection === 'performance' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setActiveSection('performance')}
          >
            Performance
          </button>
          <button 
            className={`px-4 py-2 rounded-lg font-medium text-sm ${
              activeSection === 'alerts' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setActiveSection('alerts')}
          >
            Alertes
          </button>
          <button 
            className={`px-4 py-2 rounded-lg font-medium text-sm ${
              activeSection === 'activity' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setActiveSection('activity')}
          >
            Activité
          </button>
        </div>
      </div>

      {/* Vue d'ensemble */}
      {activeSection === 'overview' && (
        <>
          {/* Cartes de statistiques principales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Utilisateurs */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Utilisateurs</p>
                  <div className="flex items-end gap-2">
                    <p className="text-2xl font-bold text-gray-900">{systemStats.usersTotal}</p>
                    <p className="text-sm text-green-600 font-medium">
                      +{systemStats.usersGrowth}%
                    </p>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {systemStats.usersActive} actifs aujourd'hui
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Contenu */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Contenu</p>
                  <div className="flex items-end gap-2">
                    <p className="text-2xl font-bold text-gray-900">{systemStats.contentItems}</p>
                    <p className="text-sm text-green-600 font-medium">
                      +{systemStats.contentGrowth}%
                    </p>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Articles, pages et médias
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            {/* Visiteurs */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Visiteurs</p>
                  <div className="flex items-end gap-2">
                    <p className="text-2xl font-bold text-gray-900">
                      {systemStats.visitors.toLocaleString('fr-FR')}
                    </p>
                    <p className="text-sm text-green-600 font-medium">
                      +{systemStats.visitorsGrowth}%
                    </p>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Ce mois-ci
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Eye className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>

            {/* Santé Système */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Santé Système</p>
                  <div className="flex items-end gap-2">
                    <p className="text-2xl font-bold text-gray-900">{systemStats.systemHealth}%</p>
                    <p className="text-sm text-green-600 font-medium">
                      Excellent
                    </p>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Temps de réponse: {systemStats.responseTime}
                  </p>
                </div>
                <div className="bg-teal-100 p-3 rounded-lg">
                  <Zap className="h-6 w-6 text-teal-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Rangée de modules principaux - Accès rapide */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Modules de Gestion</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              <a href="#" className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-colors">
                <Users className="h-8 w-8 text-blue-600 mb-2" />
                <span className="text-sm font-medium text-gray-700">Utilisateurs</span>
              </a>
              <a href="#" className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:bg-green-50 hover:border-green-200 transition-colors">
                <FileText className="h-8 w-8 text-green-600 mb-2" />
                <span className="text-sm font-medium text-gray-700">Contenu</span>
              </a>
              <a href="#" className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:bg-purple-50 hover:border-purple-200 transition-colors">
                <ImageIcon className="h-8 w-8 text-purple-600 mb-2" />
                <span className="text-sm font-medium text-gray-700">Médias</span>
              </a>
              <a href="#" className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:bg-yellow-50 hover:border-yellow-200 transition-colors">
                <Award className="h-8 w-8 text-yellow-600 mb-2" />
                <span className="text-sm font-medium text-gray-700">Logos</span>
              </a>
              <a href="#" className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:bg-red-50 hover:border-red-200 transition-colors">
                <Shield className="h-8 w-8 text-red-600 mb-2" />
                <span className="text-sm font-medium text-gray-700">Sécurité</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Activités récentes */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Activités récentes</h2>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button 
                    className={`px-3 py-1 text-xs font-medium rounded-md ${
                      activityType === 'all' ? 'bg-white shadow-sm' : 'text-gray-600'
                    }`}
                    onClick={() => setActivityType('all')}
                  >
                    Tout
                  </button>
                  <button 
                    className={`px-3 py-1 text-xs font-medium rounded-md ${
                      activityType === 'user' ? 'bg-white shadow-sm' : 'text-gray-600'
                    }`}
                    onClick={() => setActivityType('user')}
                  >
                    Utilisateurs
                  </button>
                  <button 
                    className={`px-3 py-1 text-xs font-medium rounded-md ${
                      activityType === 'content' ? 'bg-white shadow-sm' : 'text-gray-600'
                    }`}
                    onClick={() => setActivityType('content')}
                  >
                    Contenu
                  </button>
                  <button 
                    className={`px-3 py-1 text-xs font-medium rounded-md ${
                      activityType === 'system' ? 'bg-white shadow-sm' : 'text-gray-600'
                    }`}
                    onClick={() => setActivityType('system')}
                  >
                    Système
                  </button>
                </div>
              </div>
              <div className="space-y-3 max-h-[400px] overflow-auto">
                {filteredActivities.slice(0, 6).map((activity) => (
                  <div key={activity.id} className="flex items-start p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                    <div className="mr-3 mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <p className="font-medium text-sm text-gray-900">{activity.action}</p>
                        <span className={`ml-2 text-xs ${getStatusColor(activity.status)}`}>•</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 truncate">{activity.details}</p>
                      <div className="flex items-center mt-1 space-x-2 text-xs text-gray-500">
                        <span>{activity.user}</span>
                        <span>•</span>
                        <span>{formatDate(activity.timestamp)}</span>
                      </div>
                    </div>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <a href="#" className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center">
                  <span>Voir toutes les activités</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </a>
              </div>
            </div>

            {/* Alertes système */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Alertes système</h2>
                <div className="bg-red-100 text-red-600 text-xs font-medium px-2.5 py-1 rounded-full">
                  {systemAlerts.filter(alert => !alert.resolved).length} actives
                </div>
              </div>
              <div className="space-y-3 max-h-[400px] overflow-auto">
                {systemAlerts.map((alert) => (
                  <div 
                    key={alert.id} 
                    className={`p-4 rounded-lg border ${
                      alert.type === 'error' 
                        ? 'bg-red-50 border-red-200' 
                        : alert.type === 'warning'
                          ? 'bg-yellow-50 border-yellow-200'
                          : 'bg-green-50 border-green-200'
                    } ${alert.resolved ? 'opacity-60' : ''}`}
                  >
                    <div className="flex items-center">
                      {getAlertIcon(alert.type)}
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <p className={`font-medium text-sm ${
                            alert.type === 'error' 
                              ? 'text-red-800' 
                              : alert.type === 'warning'
                                ? 'text-yellow-800'
                                : 'text-green-800'
                          }`}>
                            {alert.message}
                          </p>
                          <div className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                            alert.priority === 'high'
                              ? 'bg-red-100 text-red-800'
                              : alert.priority === 'medium'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-blue-100 text-blue-800'
                          }`}>
                            {alert.priority === 'high' ? 'Haute' : alert.priority === 'medium' ? 'Moyenne' : 'Basse'}
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-gray-600">
                            {formatDate(alert.timestamp)}
                          </p>
                          <span className="text-xs font-medium text-gray-600">
                            {alert.resolved ? 'Résolu' : 'En cours'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <a href="#" className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center">
                  <span>Centre d'alertes</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </a>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tâches en attente */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Tâches en attente</h2>
              <div className="space-y-3">
                {pendingTasks.map((task) => (
                  <div key={task.id} className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                    <div className={`w-2 h-2 rounded-full mr-3 ${
                      task.priority === 'high' 
                        ? 'bg-red-500' 
                        : task.priority === 'medium'
                          ? 'bg-yellow-500'
                          : 'bg-blue-500'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 truncate">{task.title}</p>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <span>{task.assignee}</span>
                        <span className="mx-1">•</span>
                        <span>Échéance: {task.dueDate}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <a href="#" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Voir toutes les tâches
                </a>
              </div>
            </div>

            {/* Rapports récents */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Rapports récents</h2>
              <div className="space-y-3">
                {recentReports.map((report) => (
                  <div key={report.id} className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center">
                      <div className="mr-3 bg-blue-100 p-2 rounded">
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-900 truncate">{report.title}</p>
                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          <span>{report.format}</span>
                          <span className="mx-1">•</span>
                          <span>{report.createdAt}</span>
                        </div>
                      </div>
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <a href="#" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Tous les rapports
                </a>
              </div>
            </div>

            {/* État du système */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">État du système</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-medium text-gray-700">Charge serveur</span>
                    <span className="text-xs font-medium text-gray-700">{systemStats.serverLoad}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${systemStats.serverLoad}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-medium text-gray-700">Utilisation mémoire</span>
                    <span className="text-xs font-medium text-gray-700">{systemStats.memoryUsage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${systemStats.memoryUsage}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-medium text-gray-700">Stockage</span>
                    <span className="text-xs font-medium text-gray-700">
                      {systemStats.storageUsed} / {systemStats.storageTotal}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${(parseInt(systemStats.storageUsed) / parseInt(systemStats.storageTotal)) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                    <div className="text-sm font-semibold text-blue-700">{systemStats.uptime}</div>
                    <div className="text-xs text-blue-600">Disponibilité</div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                    <div className="text-sm font-semibold text-green-700">{systemStats.lastBackup}</div>
                    <div className="text-xs text-green-600">Dernière sauvegarde</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Section Performance */}
      {activeSection === 'performance' && (
        <>
          {/* Filtres de période */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Performance du système</h2>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button 
                  className={`px-3 py-1 text-xs font-medium rounded-md ${
                    statsInterval === 'day' ? 'bg-white shadow-sm' : 'text-gray-600'
                  }`}
                  onClick={() => setStatsInterval('day')}
                >
                  Aujourd'hui
                </button>
                <button 
                  className={`px-3 py-1 text-xs font-medium rounded-md ${
                    statsInterval === 'week' ? 'bg-white shadow-sm' : 'text-gray-600'
                  }`}
                  onClick={() => setStatsInterval('week')}
                >
                  Cette semaine
                </button>
                <button 
                  className={`px-3 py-1 text-xs font-medium rounded-md ${
                    statsInterval === 'month' ? 'bg-white shadow-sm' : 'text-gray-600'
                  }`}
                  onClick={() => setStatsInterval('month')}
                >
                  Ce mois
                </button>
              </div>
            </div>
          </div>

          {/* Graphique usage système */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Utilisation système dans le temps</h3>
            
            <div className="h-80 w-full">
              {/* Graphique simplifié */}
              <div className="relative h-full">
                {/* Axe Y */}
                <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between py-2">
                  <span className="text-xs text-gray-500">100%</span>
                  <span className="text-xs text-gray-500">75%</span>
                  <span className="text-xs text-gray-500">50%</span>
                  <span className="text-xs text-gray-500">25%</span>
                  <span className="text-xs text-gray-500">0%</span>
                </div>
                
                {/* Grid */}
                <div className="absolute left-8 right-0 top-0 bottom-0">
                  <div className="w-full h-full border-l border-gray-200 grid grid-rows-4">
                    <div className="border-b border-gray-200"></div>
                    <div className="border-b border-gray-200"></div>
                    <div className="border-b border-gray-200"></div>
                    <div className="border-b border-gray-200"></div>
                  </div>
                </div>
                
                {/* Graphique */}
                <div className="absolute left-8 right-0 top-0 bottom-0 flex items-end">
                  <div className="flex-1 flex items-end justify-around h-full p-2">
                    {systemUsageData.map((data, index) => (
                      <div key={index} className="flex flex-col items-center justify-end h-full group relative">
                        {/* CPU Bar */}
                        <div 
                          className="w-4 bg-blue-500 rounded-t"
                          style={{ height: `${data.cpu}%` }}
                          title={`CPU: ${data.cpu}%`}
                        ></div>
                        
                        {/* Memory Bar */}
                        <div 
                          className="w-4 bg-green-500 rounded-t ml-1"
                          style={{ height: `${data.memory}%` }}
                          title={`Mémoire: ${data.memory}%`}
                        ></div>
                        
                        {/* Visitors Line */}
                        <div 
                          className="w-4 bg-purple-500 rounded-t ml-1"
                          style={{ height: `${data.visitors / 5}%` }}
                          title={`Visiteurs: ${data.visitors}`}
                        ></div>
                        
                        {/* Time Label */}
                        <span className="text-xs text-gray-500 mt-2">{data.time}</span>
                        
                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-2 bg-gray-800 text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                          <div>CPU: {data.cpu}%</div>
                          <div>Mémoire: {data.memory}%</div>
                          <div>Visiteurs: {data.visitors}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center mt-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded mr-1"></div>
                  <span className="text-xs text-gray-600">CPU</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded mr-1"></div>
                  <span className="text-xs text-gray-600">Mémoire</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded mr-1"></div>
                  <span className="text-xs text-gray-600">Visiteurs</span>
                </div>
              </div>
            </div>
          </div>

          {/* Performances des modules */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Performance des modules</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-600">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 rounded-lg">
                  <tr>
                    <th className="px-6 py-3">Module</th>
                    <th className="px-6 py-3">Vues</th>
                    <th className="px-6 py-3">Croissance</th>
                    <th className="px-6 py-3">Temps de réponse</th>
                    <th className="px-6 py-3">État</th>
                  </tr>
                </thead>
                <tbody>
                  {modulePerformance.map((module, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{module.name}</td>
                      <td className="px-6 py-4">{module.views.toLocaleString('fr-FR')}</td>
                      <td className="px-6 py-4">
                        <span className={module.growth >= 0 ? "text-green-600" : "text-red-600"}>
                          {module.growth >= 0 ? "+" : ""}{module.growth}%
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={module.responseTime < 1 ? "text-green-600" : module.responseTime < 2 ? "text-yellow-600" : "text-red-600"}>
                          {module.responseTime}s
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          Optimal
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Section Alertes */}
      {activeSection === 'alerts' && (
        <>
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Centre d'alertes</h2>
              <div className="flex space-x-2">
                <div className="bg-red-100 text-red-600 text-xs font-medium px-2.5 py-1 rounded-full">
                  {systemAlerts.filter(a => a.type === 'error' && !a.resolved).length} critiques
                </div>
                <div className="bg-yellow-100 text-yellow-600 text-xs font-medium px-2.5 py-1 rounded-full">
                  {systemAlerts.filter(a => a.type === 'warning' && !a.resolved).length} avertissements
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 mb-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input 
                  type="text" 
                  className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Rechercher des alertes..."
                />
              </div>
              <button className="p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">
                <Filter className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-auto">
              {systemAlerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className={`p-4 rounded-lg border ${
                    alert.type === 'error' 
                      ? 'bg-red-50 border-red-200' 
                      : alert.type === 'warning'
                        ? 'bg-yellow-50 border-yellow-200'
                        : 'bg-green-50 border-green-200'
                  } ${alert.resolved ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-center">
                    {getAlertIcon(alert.type)}
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <p className={`font-medium text-sm ${
                          alert.type === 'error' 
                            ? 'text-red-800' 
                            : alert.type === 'warning'
                              ? 'text-yellow-800'
                              : 'text-green-800'
                        }`}>
                          {alert.message}
                        </p>
                        <div className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          alert.priority === 'high'
                            ? 'bg-red-100 text-red-800'
                            : alert.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                        }`}>
                          {alert.priority === 'high' ? 'Haute' : alert.priority === 'medium' ? 'Moyenne' : 'Basse'}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-gray-600">
                          {formatDate(alert.timestamp)}
                        </p>
                        <span className="text-xs font-medium text-gray-600">
                          {alert.resolved ? 'Résolu' : 'En cours'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {!alert.resolved && (
                    <div className="mt-3 ml-8 flex space-x-2">
                      <button className="px-3 py-1 bg-white border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-50">
                        Détails
                      </button>
                      {alert.type === 'error' && (
                        <button className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700">
                          Résoudre maintenant
                        </button>
                      )}
                      {alert.type === 'warning' && (
                        <button className="px-3 py-1 bg-yellow-600 text-white rounded text-xs hover:bg-yellow-700">
                          Examiner
                        </button>
                      )}
                      <button className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700">
                        Marquer comme résolu
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Configuration des alertes */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Configuration des alertes</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <Server className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Alertes serveur</p>
                      <p className="text-xs text-gray-600">CPU, mémoire, espace disque</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Alertes sécurité</p>
                      <p className="text-xs text-gray-600">Tentatives connexion, activités suspectes</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <Activity className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Activité utilisateurs</p>
                      <p className="text-xs text-gray-600">Connexions, actions importantes</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Rappels maintenance</p>
                      <p className="text-xs text-gray-600">Sauvegardes, mises à jour</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
              <div className="mt-4">
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  Personnaliser les alertes
                </button>
              </div>
            </div>

            {/* Historique des problèmes résolus */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Historique des problèmes résolus</h3>
              
              <div className="space-y-1 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Cette semaine</span>
                  <span className="text-xs font-medium text-green-600">5 problèmes résolus</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-green-600 h-1.5 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
              
              <div className="space-y-3 max-h-[300px] overflow-auto">
                <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">Problème d'authentification résolu</p>
                      <p className="text-xs text-gray-600 mt-1">Échec de connexion pour certains utilisateurs - Correctif déployé</p>
                      <div className="mt-1 text-xs text-gray-500">10/06/2024 - 11:45</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">Lenteur base de données résolue</p>
                      <p className="text-xs text-gray-600 mt-1">Optimisation des requêtes et index - Performance améliorée de 35%</p>
                      <div className="mt-1 text-xs text-gray-500">09/06/2024 - 16:20</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">Erreur de chargement médias corrigée</p>
                      <p className="text-xs text-gray-600 mt-1">Problème CDN identifié et résolu - Toutes les images chargent correctement</p>
                      <div className="mt-1 text-xs text-gray-500">08/06/2024 - 09:35</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <a href="#" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Voir l'historique complet
                </a>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Section Activité */}
      {activeSection === 'activity' && (
        <>
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Journal d'activité complet</h2>
              <div className="flex space-x-2">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-xs text-gray-600">Utilisateurs</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-xs text-gray-600">Contenu</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <span className="text-xs text-gray-600">Système</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 mb-6">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input 
                  type="text" 
                  className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Rechercher dans les activités..."
                />
              </div>
              <button className="p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">
                <Filter className="h-5 w-5" />
              </button>
              <div className="bg-gray-100 rounded-lg p-1 hidden sm:flex">
                <button 
                  className={`p-1.5 ${viewMode === 'grid' ? 'bg-white shadow-sm rounded-md' : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4 text-gray-600" />
                </button>
                <button 
                  className={`p-1.5 ${viewMode === 'list' ? 'bg-white shadow-sm rounded-md' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Activités - Vue Grille */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentActivities.map((activity) => (
                  <div 
                    key={activity.id} 
                    className={`p-4 rounded-lg border ${
                      activity.status === 'error'
                        ? 'border-red-200 bg-red-50'
                        : activity.status === 'warning'
                          ? 'border-yellow-200 bg-yellow-50'
                          : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start">
                      <div className="p-2 rounded bg-white border border-gray-100 mr-3">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm text-gray-900">{activity.action}</p>
                          <span className={`w-2 h-2 rounded-full ${
                            activity.status === 'error' 
                              ? 'bg-red-500' 
                              : activity.status === 'warning'
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                          }`}></span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{activity.details}</p>
                        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                          <span>{activity.user}</span>
                          <span>{formatDate(activity.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Activités - Vue Liste */}
            {viewMode === 'list' && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 rounded-lg">
                    <tr>
                      <th className="px-6 py-3">Action</th>
                      <th className="px-6 py-3">Utilisateur</th>
                      <th className="px-6 py-3">Détails</th>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3 text-center">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentActivities.map((activity) => (
                      <tr key={activity.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium">
                          <div className="flex items-center">
                            <span className="mr-2">{getActivityIcon(activity.type)}</span>
                            {activity.action}
                          </div>
                        </td>
                        <td className="px-6 py-4">{activity.user}</td>
                        <td className="px-6 py-4 max-w-xs truncate">{activity.details}</td>
                        <td className="px-6 py-4">{formatDate(activity.timestamp)}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-block w-2 h-2 rounded-full ${
                            activity.status === 'error' 
                              ? 'bg-red-500' 
                              : activity.status === 'warning'
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                          }`}></span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex items-center justify-between mt-6">
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium">
                Précédent
              </button>
              <div className="text-sm text-gray-600">
                Page 1 sur 5
              </div>
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium">
                Suivant
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Filtres avancés et export</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label htmlFor="user-filter" className="block text-xs font-medium text-gray-700 mb-1">
                  Utilisateur
                </label>
                <select 
                  id="user-filter"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="">Tous les utilisateurs</option>
                  <option value="robert">Robert Ndong</option>
                  <option value="marie">Marie Akue</option>
                  <option value="sophie">Sophie Ella</option>
                  <option value="system">Système</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="date-filter" className="block text-xs font-medium text-gray-700 mb-1">
                  Période
                </label>
                <select 
                  id="date-filter"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="">Toutes les dates</option>
                  <option value="today">Aujourd'hui</option>
                  <option value="week">Cette semaine</option>
                  <option value="month">Ce mois</option>
                  <option value="custom">Période personnalisée</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="action-filter" className="block text-xs font-medium text-gray-700 mb-1">
                  Type d'action
                </label>
                <select 
                  id="action-filter"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="">Toutes les actions</option>
                  <option value="login">Connexion</option>
                  <option value="create">Création</option>
                  <option value="update">Modification</option>
                  <option value="delete">Suppression</option>
                  <option value="system">Actions système</option>
                </select>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
              <button className="w-full sm:w-auto px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium flex items-center justify-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Appliquer les filtres</span>
              </button>
              
              <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2 sm:items-center">
                <button className="w-full sm:w-auto px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium flex items-center justify-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Export CSV</span>
                </button>
                
                <button className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                  <Download className="h-4 w-4" />
                  <span>Télécharger rapport</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Guide d'utilisation */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start">
          <div className="bg-blue-100 rounded-lg p-3 mr-4">
            <Info className="h-6 w-6 text-blue-700" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-blue-900 mb-2">Guide administrateur</h3>
            <p className="text-sm text-blue-800 mb-4">
              Ce tableau de bord vous donne une vue d'ensemble de votre système DGDI Access. Accédez aux modules spécialisés pour une gestion plus détaillée de chaque aspect de votre plateforme.
            </p>
            <div className="flex flex-wrap gap-2">
              <a href="#" className="text-sm bg-white text-blue-600 px-3 py-1 rounded-lg border border-blue-200 hover:bg-blue-600 hover:text-white transition-colors flex items-center gap-1">
                <HelpCircle className="h-4 w-4" />
                Documentation complète
              </a>
              <a href="#" className="text-sm bg-white text-blue-600 px-3 py-1 rounded-lg border border-blue-200 hover:bg-blue-600 hover:text-white transition-colors flex items-center gap-1">
                <ExternalLink className="h-4 w-4" />
                Centre de formation
              </a>
              <a href="#" className="text-sm bg-white text-blue-600 px-3 py-1 rounded-lg border border-blue-200 hover:bg-blue-600 hover:text-white transition-colors flex items-center gap-1">
                <Users className="h-4 w-4" />
                Support administrateur
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};