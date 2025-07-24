import React, { useState, useEffect, useCallback } from 'react';
import { Users, FileText, Import as Passport, TrendingUp, AlertTriangle, CheckCircle, Clock, Eye, UserCheck, Package, Calendar, Camera, Shield, Bell, MapPin, Star, Award, RefreshCw, Tag, UserPlus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { UpdateStatusBanner } from '../UpdateStatusBanner';
import { executeSystemUpdate } from '../../utils/systemUpdate';
import { SystemUpdateModal } from '../SystemUpdateModal';
import { navigateToModule } from '../../utils/deploymentHelpers';

export const DashboardHome: React.FC = () => {
  const { user } = useAuth();
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateReport, setUpdateReport] = useState<string | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<string | null>(null);
  const [forceUpdate, setForceUpdate] = useState(0);

  // Force un re-render lorsque le composant est monté
  useEffect(() => {
    // Vérifier s'il y a eu une mise à jour récente
    const lastUpdate = localStorage.getItem('last_update_timestamp');
    if (lastUpdate) {
      const updateTime = new Date(parseInt(lastUpdate));
      setLastUpdateTime(updateTime.toLocaleString('fr-FR'));
    }
  }, []);

  // Écouteur d'événements pour forcer le rechargement du composant
  useEffect(() => {
    const handleForceUpdate = () => {
      setForceUpdate(prevState => prevState + 1);
      console.log('🔄 Rechargement forcé du dashboard');
    };
    
    window.addEventListener('force-update', handleForceUpdate);
    window.addEventListener('force-receptionist-update', handleForceUpdate);
    
    return () => {
      window.removeEventListener('force-update', handleForceUpdate);
      window.removeEventListener('force-receptionist-update', handleForceUpdate);
    };
  }, []);

  const handleForceUpdate = () => {
    setShowUpdateModal(true);
  };

  // Handlers pour les actions rapides
  const handleRegisterVisitor = useCallback(() => {
    navigateToModule('reception', 'register');
    console.log('🎯 Navigation vers le module de réception - Enregistrement visiteur');
  }, []);
  
  const handleStaffManagement = useCallback(() => {
    navigateToModule('staff');
    console.log('🎯 Navigation vers le module de gestion du personnel');
  }, []);

  const handleScanDocument = useCallback(() => {
    navigateToModule('reception', 'scanner');
    console.log('🎯 Navigation vers le module de réception - Scanner IA');
  }, []);

  const handleManageBadges = useCallback(() => {
    navigateToModule('reception', 'badges');
    console.log('🎯 Navigation vers le module de réception - Gestion des badges');
  }, []);
  
  const handleManageVisitors = useCallback(() => {
    navigateToModule('visitors');
    console.log('🎯 Navigation vers le module de gestion des visiteurs');
  }, []);

  const handleManageAppointments = useCallback(() => {
    navigateToModule('visitors', 'planning');
    console.log('🎯 Navigation vers la gestion des visites prévues');
  }, []);

  const handleViewStatistics = useCallback(() => {
    navigateToModule('visitor-stats');
    console.log('🎯 Navigation vers les statistiques visiteurs');
  }, []);

  const handleManagePackages = useCallback(() => {
    navigateToModule('packages');
    console.log('🎯 Navigation vers la gestion des colis');
  }, []);

  const handleEmergencyAlerts = useCallback(() => {
    navigateToModule('reception', 'alerts');
    console.log('🎯 Navigation vers le module de réception - Alertes d\'urgence');
  }, []);

  const handleViewVisitorDetails = useCallback((activityType: string) => {
    switch(activityType) {
      case 'Citoyen':
        navigateToModule('reception', 'visitors');
        break;
      case 'Badge':
        navigateToModule('badges');
        break;
      case 'Rendez-vous':
        navigateToModule('appointments');
        break;
      case 'Colis':
        navigateToModule('packages');
        break;
      case 'Alerte':
        navigateToModule('reception', 'alerts');
        break;
      default:
        navigateToModule('dashboard');
    }
  }, []);

  const getWelcomeMessage = () => {
    const messages = {
      ADMIN: `Bienvenue Administrateur. Vous avez accès à toutes les fonctionnalités du système.`,
      RECEP: `Bonjour ${user?.firstName}. Votre poste d'accueil SOGARA est opérationnel pour servir nos citoyens gabonais avec excellence.`,
    };
    return messages[user?.role as keyof typeof messages] || 'Bienvenue dans SOGARA Access';
  };

  const getReceptionistStats = () => [
    { 
      title: 'Citoyens accueillis', 
      value: user?.stats?.visitorsRegisteredToday?.toString() || '47', 
      change: '+12%', 
      icon: Users, 
      color: 'bg-blue-500',
      description: 'Aujourd\'hui'
    },
    { 
      title: 'Rendez-vous confirmés', 
      value: user?.stats?.appointmentsToday?.toString() || '8', 
      change: '+2', 
      icon: Calendar, 
      color: 'bg-green-500',
      description: 'Aujourd\'hui'
    },
    { 
      title: 'Badges émis', 
      value: user?.stats?.badgesIssuedToday?.toString() || '8', 
      change: '+5', 
      icon: UserCheck, 
      color: 'bg-purple-500',
      description: 'Badges actifs'
    },
    { 
      title: 'Colis reçus', 
      value: user?.stats?.packagesReceivedToday?.toString() || '3', 
      change: '+1', 
      icon: Package, 
      color: 'bg-orange-500',
      description: 'À remettre'
    },
    { 
      title: 'Temps moyen', 
      value: '3 min', 
      change: '-30s', 
      icon: Clock, 
      color: 'bg-teal-500',
      description: 'Par enregistrement'
    },
    { 
      title: 'Satisfaction', 
      value: user?.stats?.satisfactionScore?.toFixed(1) || '4.3', 
      change: '+0.2', 
      icon: Star, 
      color: 'bg-yellow-500',
      description: 'Sur 5 étoiles'
    },
  ];

  const getDefaultStats = () => [
    { 
      title: 'Demandes CNI', 
      value: '1,247', 
      change: '+12%', 
      icon: FileText, 
      color: 'bg-blue-500',
      description: 'Ce mois'
    },
    { 
      title: 'Passeports émis', 
      value: '834', 
      change: '+8%', 
      icon: Passport, 
      color: 'bg-green-500',
      description: 'Ce mois'
    },
    { 
      title: 'Contrôles frontières', 
      value: '15,642', 
      change: '+23%', 
      icon: Users, 
      color: 'bg-purple-500',
      description: 'Cette semaine'
    },
    { 
      title: 'Visas délivrés', 
      value: '567', 
      change: '+15%', 
      icon: TrendingUp, 
      color: 'bg-orange-500',
      description: 'Ce mois'
    },
  ];

  const getReceptionistActivity = () => [
    { 
      id: 1, 
      type: 'Citoyen', 
      description: 'Marie OBAME - Demande CNI première', 
      status: 'in_progress', 
      time: '5 min',
      priority: 'normal',
      service: 'Documentation'
    },
    { 
      id: 2, 
      type: 'Rendez-vous', 
      description: 'Paul OBIANG - 14h30 - Passeport', 
      status: 'confirmed', 
      time: '12 min',
      priority: 'normal',
      service: 'Passeports'
    },
    { 
      id: 3, 
      type: 'Colis', 
      description: 'DHL - Ministère Justice - Documents', 
      status: 'pending', 
      time: '25 min',
      priority: 'urgent',
      service: 'Direction'
    },
    { 
      id: 4, 
      type: 'Alerte', 
      description: 'Temps d\'attente élevé - Service CNI', 
      status: 'alert', 
      time: '1h',
      priority: 'high',
      service: 'Documentation'
    },
    { 
      id: 5, 
      type: 'Badge', 
      description: 'Visite VIP - Ambassadeur France', 
      status: 'completed', 
      time: '2h',
      priority: 'vip',
      service: 'Direction'
    },
  ];

  const getDefaultActivity = () => [
    { 
      id: 1, 
      type: 'CNI', 
      description: 'Nouvelle demande CNI - Marie OBAME', 
      status: 'pending', 
      time: '5 min',
      priority: 'normal',
      service: 'Documentation'
    },
    { 
      id: 2, 
      type: 'Passeport', 
      description: 'Passeport approuvé - Jean NGUEMA', 
      status: 'approved', 
      time: '12 min',
      priority: 'normal',
      service: 'Passeports'
    },
    { 
      id: 3, 
      type: 'Visa', 
      description: 'Visa refusé - Motif sécuritaire', 
      status: 'rejected', 
      time: '25 min',
      priority: 'high',
      service: 'Immigration'
    },
    { 
      id: 4, 
      type: 'Contrôle', 
      description: 'Alert frontière - Personne suspecte', 
      status: 'alert', 
      time: '1h',
      priority: 'urgent',
      service: 'Sécurité'
    },
  ];

  const stats = user?.role === 'RECEP' ? getReceptionistStats() : getDefaultStats();
  const recentActivity = user?.role === 'RECEP' ? getReceptionistActivity() : getDefaultActivity();

  // Attribut de contexte pour faciliter les mises à jour
  const updateContext = `${forceUpdate}-${user?.role || 'unknown'}`;

  const getStatusIcon = (status: string, priority?: string) => {
    if (priority === 'vip') return <Award className="h-4 md:h-5 w-4 md:w-5 text-gold-500" />;
    if (priority === 'urgent' || priority === 'high') return <AlertTriangle className="h-4 md:h-5 w-4 md:w-5 text-red-500" />;
    
    switch (status) {
      case 'pending':
        return <Clock className="h-4 md:h-5 w-4 md:w-5 text-yellow-500" />;
      case 'approved':
      case 'completed':
        return <CheckCircle className="h-4 md:h-5 w-4 md:w-5 text-green-500" />;
      case 'confirmed':
        return <CheckCircle className="h-4 md:h-5 w-4 md:w-5 text-blue-500" />;
      case 'in_progress':
        return <UserCheck className="h-4 md:h-5 w-4 md:w-5 text-blue-500" />;
      case 'rejected':
        return <AlertTriangle className="h-4 md:h-5 w-4 md:w-5 text-red-500" />;
      case 'alert':
        return <AlertTriangle className="h-4 md:h-5 w-4 md:w-5 text-orange-500" />;
      default:
        return <Clock className="h-4 md:h-5 w-4 md:w-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'vip':
        return 'border-l-4 border-yellow-400 bg-yellow-50';
      case 'urgent':
      case 'high':
        return 'border-l-4 border-red-400 bg-red-50';
      case 'normal':
        return 'border-l-4 border-blue-400 bg-blue-50';
      default:
        return 'border-l-4 border-gray-400 bg-gray-50';
    }
  };

  return (
    <div 
      className="p-4 md:p-6 lg:p-8 space-y-6" 
      data-component="dashboard-home" 
      data-module="dashboard" 
      data-updated={Date.now()} 
      key={`dashboard-${updateContext}`}
    >
      {/* Bannière de statut de mise à jour */}
      <UpdateStatusBanner 
        version="2024.01.15-OPTIMIZED"
        lastUpdateTime={lastUpdateTime || undefined}
      />
      
      {/* Modal de mise à jour */}
      <SystemUpdateModal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
      />
      
      {/* Welcome Section - MOBILE FIRST */}
      <div className={`rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 text-white ${
        user?.role === 'RECEP' 
          ? 'bg-gradient-to-r from-blue-800 via-blue-700 to-teal-600' 
          : 'bg-gradient-to-r from-blue-800 to-blue-900'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2">
              Bonjour {user?.firstName} {user?.lastName}
            </h1>
            <p className="text-blue-100 text-sm md:text-base lg:text-lg mb-4">
              {getWelcomeMessage()}
            </p>
            <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 md:h-4 w-3 md:w-4" />
                <span className="truncate max-w-[120px] sm:max-w-none">{user?.location}</span>
              </span>
              <span className="flex items-center gap-1">
                <Shield className="h-3 md:h-4 w-3 md:w-4" />
                {user?.department}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 md:h-4 w-3 md:w-4" />
                <span className="hidden sm:inline">Dernière connexion: </span>
                {new Date().toLocaleDateString('fr-FR')}
              </span>
              {user?.role === 'RECEP' && (
                <span className="flex items-center gap-1">
                  <Award className="h-3 md:h-4 w-3 md:w-4" />
                  Satisfaction: {user?.stats?.satisfactionScore}/5
                </span>
              )}
            </div>
          </div>
          
          {user?.role === 'RECEP' && (
            <div className="hidden lg:block">
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-center">
                  <div className="text-3xl font-bold">{user?.stats?.visitorsRegisteredToday || 47}</div>
                  <div className="text-sm text-blue-100">Citoyens accueillis</div>
                  <div className="text-xs text-blue-200 mt-1">Aujourd'hui</div>
                </div>
              </div>
            </div>
          )}
          
          {/* Bouton de mise à jour pour l'admin */}
          {user?.role === 'ADMIN' && (
            <div>
              <button
                onClick={handleForceUpdate}
                className="bg-white text-blue-800 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2 shadow-lg"
              >
                <RefreshCw className="h-4 w-4" />
                Forcer la mise à jour
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Statistics Grid - MOBILE RESPONSIVE */}
      <div className={`grid gap-3 md:gap-4 lg:gap-6 ${
        user?.role === 'RECEP' 
          ? 'grid-cols-2 sm:grid-cols-3 xl:grid-cols-6'
          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
      }`}>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={`${index}-${updateContext}`} 
              className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-200 p-3 md:p-4 lg:p-6 hover:shadow-md transition-shadow"
              data-stat-index={index}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm text-gray-600 mb-1 truncate">{stat.title}</p>
                  <p className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">{stat.value}</p>
                  <div className="flex items-center justify-between mt-1 md:mt-2">
                    <p className="text-xs md:text-sm text-green-600">{stat.change}</p>
                    <p className="text-xs text-gray-500 truncate max-w-[80px] sm:max-w-none">{stat.description}</p>
                  </div>
                </div>
                <div className={`${stat.color} rounded-lg p-2 md:p-3 ml-2 md:ml-4 flex-shrink-0`}>
                  <Icon className="h-4 md:h-5 lg:h-6 w-4 md:w-5 lg:w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        {/* Recent Activity - MOBILE OPTIMIZED */}
        <div 
          className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-200 p-4 md:p-6"
          data-component="activity-feed"
        >
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h3 className="text-base md:text-lg font-semibold text-gray-900">
              {user?.role === 'RECEP' ? 'Activité Temps Réel' : 'Activité récente'}
            </h3>
            {user?.role === 'RECEP' && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs md:text-sm text-gray-600">Live</span>
              </div>
            )}
          </div>
          <div className="space-y-3 md:space-y-4">
            {recentActivity.map((activity) => (
              <div 
                key={`${activity.id}-${updateContext}`} 
                className={`flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-lg md:rounded-xl ${getPriorityColor(activity.priority)}`}
                data-activity-id={activity.id}
              >
                <div className="flex-shrink-0">
                  {getStatusIcon(activity.status, activity.priority)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{activity.description}</p>
                    {activity.priority === 'vip' && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex-shrink-0">VIP</span>
                    )}
                    {activity.priority === 'urgent' && (
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full flex-shrink-0">URGENT</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">Il y a {activity.time}</p>
                    <p className="text-xs text-gray-600 font-medium truncate max-w-[100px] sm:max-w-none">{activity.service}</p>
                  </div>
                </div>
                <button 
                  className="text-blue-600 hover:text-blue-700 p-1 min-w-[32px] min-h-[32px] flex items-center justify-center"
                  onClick={() => handleViewVisitorDetails(activity.type)}
                  data-activity-action="view"
                >
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions - MOBILE GRID */}
        <div 
          className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-200 p-4 md:p-6"
          data-component="quick-actions" 
          data-guide="quick-actions"
        >
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h3>
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {user?.role === 'RECEP' ? (
              <>
                <button 
                  className="p-3 md:p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors group min-h-[80px] md:min-h-[100px]" 
                  onClick={handleRegisterVisitor}
                  data-quick-action="register-visitor"
                >
                  <UserCheck className="h-6 md:h-8 w-6 md:w-8 text-blue-600 mb-2 group-hover:scale-110 transition-transform mx-auto" />
                  <p className="text-xs md:text-sm font-medium text-gray-900">Enregistrer</p>
                  <p className="text-xs text-gray-500 mt-1 hidden sm:block">Accueil & Orientation</p>
                </button>
                <button 
                  className="p-3 md:p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors group min-h-[80px] md:min-h-[100px]"
                  onClick={handleScanDocument}
                  data-quick-action="scan-document"
                >
                  <Camera className="h-6 md:h-8 w-6 md:w-8 text-green-600 mb-2 group-hover:scale-110 transition-transform mx-auto" />
                  <p className="text-xs md:text-sm font-medium text-gray-900">Scan IA</p>
                  <p className="text-xs text-gray-500 mt-1 hidden sm:block">Extraction auto</p>
                </button>
                <button 
                  className="p-3 md:p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors group min-h-[80px] md:min-h-[100px]"
                  onClick={handleStaffManagement}
                  data-quick-action="staff-management"
                >
                  <Users className="h-6 md:h-8 w-6 md:w-8 text-indigo-600 mb-2 group-hover:scale-110 transition-transform mx-auto" />
                  <p className="text-xs md:text-sm font-medium text-gray-900">Personnel</p>
                  <p className="text-xs text-gray-500 mt-1 hidden sm:block">Gestion personnel</p>
                </button>
                <button 
                  className="p-3 md:p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors group min-h-[80px] md:min-h-[100px]"
                  onClick={handleManageVisitors}
                  data-quick-action="manage-visitors"
                >
                  <UserPlus className="h-6 md:h-8 w-6 md:w-8 text-green-600 mb-2 group-hover:scale-110 transition-transform mx-auto" />
                  <p className="text-xs md:text-sm font-medium text-gray-900">Visiteurs</p>
                  <p className="text-xs text-gray-500 mt-1 hidden sm:block">Gestion & Visites</p>
                </button>
                <button 
                  className="p-3 md:p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors group min-h-[80px] md:min-h-[100px]"
                  onClick={handleManageBadges}
                  data-quick-action="manage-badges"
                >
                  <Tag className="h-6 md:h-8 w-6 md:w-8 text-blue-600 mb-2 group-hover:scale-110 transition-transform mx-auto" />
                  <p className="text-xs md:text-sm font-medium text-gray-900">Badges</p>
                  <p className="text-xs text-gray-500 mt-1 hidden sm:block">Gestion badges physiques</p>
                </button>
                <button 
                  className="p-3 md:p-4 border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-colors group min-h-[80px] md:min-h-[100px]"
                  onClick={handleManagePackages}
                  data-quick-action="manage-packages"
                >
                  <Package className="h-6 md:h-8 w-6 md:w-8 text-orange-600 mb-2 group-hover:scale-110 transition-transform mx-auto" />
                  <p className="text-xs md:text-sm font-medium text-gray-900">Colis</p>
                  <p className="text-xs text-gray-500 mt-1 hidden sm:block">Documentation</p>
                </button>
                <button 
                  className="p-3 md:p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors group min-h-[80px] md:min-h-[100px]"
                  onClick={handleManageAppointments}
                  data-quick-action="manage-appointments"
                >
                  <Calendar className="h-6 md:h-8 w-6 md:w-8 text-purple-600 mb-2 group-hover:scale-110 transition-transform mx-auto" />
                  <p className="text-xs md:text-sm font-medium text-gray-900">RDV</p>
                  <p className="text-xs text-gray-500 mt-1 hidden sm:block">Confirmations</p>
                </button>
                <button 
                  className="p-3 md:p-4 border border-gray-200 rounded-lg hover:bg-teal-50 hover:border-teal-300 transition-colors group min-h-[80px] md:min-h-[100px]"
                  onClick={handleViewStatistics}
                  data-quick-action="view-statistics"
                >
                  <TrendingUp className="h-6 md:h-8 w-6 md:w-8 text-teal-600 mb-2 group-hover:scale-110 transition-transform mx-auto" />
                  <p className="text-xs md:text-sm font-medium text-gray-900">Stats</p>
                  <p className="text-xs text-gray-500 mt-1 hidden sm:block">Métriques</p>
                </button>
              </>
            ) : (
              <>
                <button 
                  className="p-3 md:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors min-h-[80px] md:min-h-[100px]"
                  onClick={() => navigateToModule('documentation')}
                >
                  <FileText className="h-6 md:h-8 w-6 md:w-8 text-blue-600 mb-2 mx-auto" />
                  <p className="text-xs md:text-sm font-medium">Nouvelle CNI</p>
                </button>
                <button 
                  className="p-3 md:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors min-h-[80px] md:min-h-[100px]"
                  onClick={() => navigateToModule('immigration')}
                >
                  <Passport className="h-6 md:h-8 w-6 md:w-8 text-green-600 mb-2 mx-auto" />
                  <p className="text-xs md:text-sm font-medium">Passeport</p>
                </button>
                <button 
                  className="p-3 md:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors min-h-[80px] md:min-h-[100px]"
                  onClick={() => navigateToModule('immigration')}
                >
                  <Users className="h-6 md:h-8 w-6 md:w-8 text-purple-600 mb-2 mx-auto" />
                  <p className="text-xs md:text-sm font-medium">Visa</p>
                </button>
               <button 
                 className="p-3 md:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors min-h-[80px] md:min-h-[100px]"
                 onClick={handleForceUpdate}
                 data-quick-action="system-update"
               >
                 <RefreshCw className="h-6 md:h-8 w-6 md:w-8 text-orange-600 mb-2 mx-auto" />
                 <p className="text-xs md:text-sm font-medium">Mise à jour</p>
               </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* System Status - MOBILE RESPONSIVE */}
      <div 
        className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-200 p-4 md:p-6"
        data-component="system-status"
      >
        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">
          {user?.role === 'RECEP' ? 'État des Équipements' : 'État du système'}
        </h3>
        <div className={`grid gap-3 md:gap-4 ${user?.role === 'RECEP' ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-3'}`}>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0 animate-pulse"></div>
            <span className="text-xs md:text-sm text-gray-700">Serveur principal: Opérationnel</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0 animate-pulse"></div>
            <span className="text-xs md:text-sm text-gray-700">Base de données: Connectée</span>
          </div>
          {user?.role === 'RECEP' && (
            <>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0 animate-pulse"></div>
                <span className="text-xs md:text-sm text-gray-700">Scanner IA: Actif</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0 animate-pulse"></div>
                <span className="text-xs md:text-sm text-gray-700">Imprimante badges: Prête</span>
              </div>
            </>
          )}
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-yellow-500 rounded-full flex-shrink-0"></div>
            <span className="text-xs md:text-sm text-gray-700">Sauvegarde: En cours</span>
          </div>
        </div>

        {user?.role === 'RECEP' && (
          <div className="mt-4 md:mt-6 p-3 md:p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 md:h-5 w-4 md:w-5 text-blue-600 flex-shrink-0" />
              <span className="text-xs md:text-sm font-semibold text-blue-900">DGDI Access - Excellence dans l'Accueil</span>
            </div>
            <p className="text-xs md:text-sm text-blue-800">
              Votre poste d'accueil est configuré pour offrir un service d'excellence aux citoyens gabonais. 
              Tous les systèmes d'assistance IA et de sécurité sont opérationnels.
            </p>
          </div>
        )}
        
        {user?.role === 'ADMIN' && (
          <div className="mt-4 md:mt-6 p-3 md:p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 md:h-5 w-4 md:w-5 text-blue-600 flex-shrink-0" />
              <span className="text-xs md:text-sm font-semibold text-blue-900">DGDI Access - Système d'Administration</span>
            </div>
            <p className="text-xs md:text-sm text-blue-800">
              Tous les modules administratifs sont opérationnels. Version actuelle: 2024.01.15-OPTIMIZED.
              {lastUpdateTime && ` Dernière mise à jour: ${lastUpdateTime}.`}
            </p>
            <div className="mt-3">
              <button 
                onClick={handleForceUpdate}
                data-action="force-update"
                className="text-xs md:text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
              >
                <RefreshCw className="h-3 w-3" />
                Vérifier les mises à jour
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};