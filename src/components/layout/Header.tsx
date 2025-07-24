import React, { useState, useEffect } from 'react';
import { Menu, Bell, User, LogOut, Settings, Phone, AlertTriangle, Monitor, UserCircle, ChevronDown, Camera, QrCode, Package, Calendar, Clock, Award, X, Sparkles, MapPin, Building2, Zap, Grid3X3 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { GlobalHelpButton } from '../ui/GuideButton';
import { useInteractiveGuide } from '../../hooks/useInteractiveGuide';
import { receptionistGuideSteps } from '../../data/receptionistGuide';
import { navigateToModule } from '../../utils/deploymentHelpers';
import { usePWA } from '../../hooks/usePWA';

interface HeaderProps {
  onMenuClick: () => void;
  onNavigateToProfile?: () => void;
}

interface NotificationItem {
  id: string;
  type: 'urgent' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  count?: number;
  timestamp: string;
  actions?: { label: string; action: () => void }[];
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, onNavigateToProfile }) => {
  const { user, logout } = useAuth();
  const { capabilities } = usePWA();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);

  // Écouteurs d'événements pour forcer le rechargement du composant
  useEffect(() => {
    const handleForceUpdate = () => {
      setForceUpdate(prev => prev + 1);
      console.log('🔄 Header rechargé');
    };
    
    window.addEventListener('force-update', handleForceUpdate);
    window.addEventListener('force-receptionist-update', handleForceUpdate);
    
    return () => {
      window.removeEventListener('force-update', handleForceUpdate);
      window.removeEventListener('force-receptionist-update', handleForceUpdate);
    };
  }, []);

  // Guide principal pour réceptionniste
  const mainGuide = useInteractiveGuide({
    guideId: 'receptionist-header',
    steps: receptionistGuideSteps,
    autoStart: false,
    showOnFirstVisit: false
  });

  const getRoleLabel = (role: string) => {
    const labels = {
      ADMIN: 'Administrateur Système',
      DG: 'Direction Générale',
      CSD: 'Chef Service Documentation',
      CSI: 'Chef Service Immigration',
      AG: 'Agent de Guichet',
      ACF: 'Agent Contrôle Frontalier',
      SR: 'Superviseur Régional',
      AC: 'Auditeur/Contrôleur',
      RECEP: 'Réceptionniste DGDI'
    };
    return labels[role as keyof typeof labels] || role;
  };

  // Notifications optimisées pour réceptionniste
  const notifications: NotificationItem[] = user?.role === 'RECEP' ? [
    {
      id: 'urgent-vip',
      type: 'urgent',
      title: 'Visiteurs VIP',
      message: '3 visiteurs VIP attendus dans 30 min',
      count: 3,
      timestamp: '5 min',
      actions: [
        { label: 'Préparer', action: () => console.log('Prepare VIP') },
        { label: 'Détails', action: () => console.log('View VIP details') }
      ]
    },
    {
      id: 'packages-urgent',
      type: 'warning',
      title: 'Colis Urgents',
      message: '2 colis urgents non récupérés',
      count: 2,
      timestamp: '15 min',
      actions: [
        { label: 'Notifier', action: () => console.log('Notify recipients') }
      ]
    },
    {
      id: 'appointments-today',
      type: 'info',
      title: 'RDV Confirmés',
      message: '5 RDV confirmés 14h-16h',
      count: 5,
      timestamp: '1h'
    }
  ] : [
    {
      id: 'system-alert',
      type: 'info',
      title: 'Système',
      message: 'Sauvegarde en cours',
      timestamp: '5 min'
    }
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'urgent': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning': return <Package className="h-4 w-4 text-orange-500" />;
      case 'info': return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'success': return <Sparkles className="h-4 w-4 text-green-500" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const urgentCount = notifications.filter(n => n.type === 'urgent').length;
  const totalCount = notifications.length;

  return (
    <>
      <header 
        className={`bg-white shadow-sm border-b border-gray-200 relative z-50 ${
          capabilities.isStandalone ? 'safe-area-top' : ''
        }`}
        data-component="header"
        key={`header-${forceUpdate}`}
      >
        {/* Header principal - MOBILE OPTIMISÉ */}
        <div className="flex items-center justify-between px-3 md:px-6 py-2 md:py-3">
          {/* Côté gauche - Navigation */}
          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={onMenuClick}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <Menu className="h-5 w-5 text-gray-600" />
            </button>
            
            {/* Logo et titre - RESPONSIVE */}
            <div className="flex items-center gap-2 md:gap-3">
              <img
                src="/Photoroom_20250703_164401.PNG"
                alt="Logo SOGARA" 
                className="h-7 md:h-9 w-auto"
              />
              <div className="hidden sm:block">
                <h1 className="text-sm md:text-lg font-bold text-gray-900">SOGARA Access</h1>
                <p className="text-xs text-gray-600 hidden md:block">
                  {user?.role === 'RECEP' ? 'Accueil Intelligent' : 'Système de Gestion'}
                </p>
              </div>
              {/* Version mobile très compacte */}
              <div className="sm:hidden">
                <h1 className="text-sm font-bold text-gray-900">SOGARA</h1>
              </div>
            </div>
          </div>

          {/* Côté droit - Actions MOBILE FIRST */}
          <div className="flex items-center gap-1 md:gap-2">
            {/* Actions rapides réceptionniste - MOBILE OPTIMISÉ */}
            {user?.role === 'RECEP' && (
              <div className="relative">
                {/* Version mobile - bouton très compact */}
                <button 
                  onClick={() => setShowQuickActions(!showQuickActions)}
                  className="md:hidden flex items-center gap-1 px-2 py-2 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg shadow-lg min-w-[44px] min-h-[44px]"
                  data-guide="ai-actions"
                >
                  <Grid3X3 className="h-4 w-4" />
                  <span className="text-xs">IA</span>
                </button>

                {/* Version desktop */}
                <button 
                  onClick={() => setShowQuickActions(!showQuickActions)}
                  className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl hover:from-green-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                  data-guide="ai-actions"
                >
                  <Zap className="h-4 w-4" />
                  Actions IA
                  <ChevronDown className={`h-4 w-4 transition-transform ${showQuickActions ? 'rotate-180' : ''}`} />
                </button>

                {/* Menu déroulant actions - MOBILE RESPONSIVE */}
                {showQuickActions && (
                  <div className="absolute right-0 top-full mt-2 w-[calc(100vw-1rem)] max-w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 py-4 z-50 md:w-96">
                    <div className="px-4 md:px-6 py-2 border-b border-gray-200" data-guide-header="ai-menu">
                      <h3 className="font-bold text-gray-900 flex items-center gap-2 text-sm md:text-base">
                        <Sparkles className="h-4 md:h-5 w-4 md:w-5 text-teal-600" />
                        Actions Rapides IA
                      </h3>
                      <p className="text-xs md:text-sm text-gray-600">Outils d'accueil intelligent</p>
                    </div>
                    
                    <div className="p-3 md:p-4 space-y-2 md:space-y-3">
                      {/* Scanner de Colis action */}
                      <button 
                        onClick={() => {
                          setShowQuickActions(false);
                          navigateToModule('packages', 'scanner');
                        }}
                        className="w-full flex items-center gap-3 md:gap-4 p-3 md:p-4 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 rounded-xl transition-all group border border-green-200 min-h-[60px] hover:shadow-md"
                        data-ai-action="scan-package"
                        data-guide="ai-scan"
                      >
                        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-2 md:p-3 group-hover:scale-110 transition-transform shadow-md">
                          <Camera className="h-4 md:h-6 w-4 md:w-6 text-white" />
                        </div>
                        <div className="text-left flex-1">
                          <div className="font-bold text-gray-900 text-sm md:text-base">Scanner Colis</div>
                          <div className="text-xs md:text-sm text-gray-600">Traitement automatique</div>
                          <div className="text-xs text-green-600 font-medium">Extraction rapide</div>
                        </div>
                      </button>

                      {/* Gestion des Colis action */}
                      <button 
                        onClick={() => {
                          setShowQuickActions(false);
                          navigateToModule('packages');
                        }}
                        className="w-full flex items-center gap-3 md:gap-4 p-3 md:p-4 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 rounded-xl transition-all group border border-orange-200 min-h-[60px] hover:shadow-md"
                        data-ai-action="manage-packages"
                        data-guide="ai-packages"
                      >
                        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-2 md:p-3 group-hover:scale-110 transition-transform shadow-md">
                          <Package className="h-4 md:h-6 w-4 md:w-6 text-white" />
                        </div>
                        <div className="text-left flex-1">
                          <div className="font-bold text-gray-900 text-sm md:text-base">Gestion Colis</div>
                          <div className="text-xs md:text-sm text-gray-600">Suivi et livraison</div>
                          <div className="text-xs text-orange-600 font-medium">{user?.stats?.packagesReceivedToday || 3} colis aujourd'hui</div>
                        </div>
                      </button>
                      
                      {/* Système de Badges action */}
                      <button 
                        onClick={() => {
                           setShowQuickActions(false);
                           navigateToModule('reception', 'badges');
                        }}
                        className="w-full flex items-center gap-3 md:gap-4 p-3 md:p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 rounded-xl transition-all group border border-blue-200 min-h-[60px] hover:shadow-md"
                        data-ai-action="badge-system"
                        data-guide="ai-badges"
                      >
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-2 md:p-3 group-hover:scale-110 transition-transform shadow-md">
                          <QrCode className="h-4 md:h-6 w-4 md:w-6 text-white" />
                        </div>
                        <div className="text-left flex-1">
                          <div className="font-bold text-gray-900 text-sm md:text-base">Système Badge</div>
                          <div className="text-xs md:text-sm text-gray-600">Génération QR sécurisé</div>
                          <div className="text-xs text-blue-600 font-medium">{user?.stats?.badgesActive || 8} badges actifs</div>
                        </div>
                      </button>
                      
                      {/* Surveillance désactivée */}
                      <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-gray-50 rounded-xl opacity-60 border border-gray-200 min-h-[60px]">
                        <div className="bg-gray-400 rounded-xl p-2 md:p-3">
                          <Monitor className="h-4 md:h-6 w-4 md:w-6 text-white" />
                        </div>
                        <div className="text-left flex-1">
                          <div className="font-bold text-gray-900 text-sm md:text-base">Surveillance</div>
                          <div className="text-xs md:text-sm text-gray-600">Fonctionnalité désactivée</div>
                          <div className="text-xs text-gray-500">Conformément aux directives</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Notifications - MOBILE OPTIMISÉ */}
            <div className="relative">
              <button 
                aria-label="Notifications"
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 md:p-3 hover:bg-gray-100 rounded-xl transition-colors relative group min-w-[44px] min-h-[44px] flex items-center justify-center"
                data-guide="notifications"
                data-guide="notifications"
              >
                <Bell className={`h-4 md:h-5 w-4 md:w-5 ${urgentCount > 0 ? 'text-red-600' : 'text-gray-600'} group-hover:scale-110 transition-transform`} />
                {totalCount > 0 && (
                  <span className={`absolute -top-1 -right-1 text-white text-xs rounded-full h-5 md:h-6 w-5 md:w-6 flex items-center justify-center font-bold ${
                    urgentCount > 0 ? 'bg-red-500 animate-pulse' : 'bg-blue-500'
                  } shadow-lg`}>
                    {totalCount > 9 ? '9+' : totalCount}
                  </span>
                )}
              </button>
              
              {/* Menu notifications - MOBILE RESPONSIVE */}
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-[calc(100vw-1rem)] max-w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 py-4 z-50 max-h-[80vh] overflow-hidden md:w-96">
                  <div className="px-4 md:px-6 py-3 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-gray-900 flex items-center gap-2 text-sm md:text-base">
                        <Bell className="h-4 md:h-5 w-4 md:w-5 text-blue-600" />
                        Notifications
                      </h3>
                      <div className="flex items-center gap-2">
                        {urgentCount > 0 && (
                          <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-bold">
                            {urgentCount} urgent{urgentCount > 1 ? 's' : ''}
                          </span>
                        )}
                        <button 
                          onClick={() => setShowNotifications(false)}
                          className="p-1 hover:bg-gray-100 rounded-lg min-w-[32px] min-h-[32px] flex items-center justify-center"
                        >
                          <X className="h-4 w-4 text-gray-500" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs md:text-sm text-gray-600 mt-1">
                      {totalCount} notification{totalCount > 1 ? 's' : ''} • Temps réel
                    </p>
                  </div>
                  
                  <div className="max-h-64 md:max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div key={notification.id} className={`px-4 md:px-6 py-3 md:py-4 hover:bg-gray-50 border-l-4 transition-all ${
                        notification.type === 'urgent' ? 'border-red-400 bg-red-50/50' :
                        notification.type === 'warning' ? 'border-orange-400 bg-orange-50/50' :
                        notification.type === 'info' ? 'border-blue-400 bg-blue-50/50' :
                        'border-green-400 bg-green-50/50'
                      }`}>
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-gray-900 text-sm md:text-base">{notification.title}</p>
                              {notification.count && (
                                <span className={`text-xs px-2 py-1 rounded-full text-white font-bold ${
                                  notification.type === 'urgent' ? 'bg-red-500' : 'bg-blue-500'
                                }`}>
                                  {notification.count}
                                </span>
                              )}
                            </div>
                            <p className="text-xs md:text-sm text-gray-700 mb-2">{notification.message}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">Il y a {notification.timestamp}</span>
                              {notification.actions && (
                                <div className="flex gap-1 md:gap-2" data-notification-actions={notification.id}>
                                  {notification.actions.map((action, index) => (
                                    <button
                                      key={index}
                                      onClick={() => {
                                        // Fermer le menu des notifications
                                        setShowNotifications(false);
                                        // Exécuter l'action en fonction de son type
                                        if (action.action === 'confirm_visitor') {
                                          navigateToModule('reception', 'visitors');
                                        } else if (action.action === 'reschedule_visitor') {
                                          navigateToModule('appointments');
                                        }
                                      }}
                                      className="text-xs bg-blue-600 text-white px-2 md:px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors min-h-[32px]"
                                    >
                                      {action.label}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="px-4 md:px-6 py-3 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <button className="text-xs md:text-sm text-blue-600 hover:text-blue-700 font-medium min-h-[32px]">
                        Tout marquer lu
                      </button>
                      <button className="text-xs md:text-sm text-blue-600 hover:text-blue-700 font-medium min-h-[32px]">
                        Voir tout
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Menu hamburger mobile pour profil */}
            <div className="relative">
              <button 
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </div>
              </button>

              {/* Profil utilisateur desktop */}
              <div className="hidden md:flex items-center gap-3 border-l border-gray-200 pl-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-600">
                    {user?.position || getRoleLabel(user?.role || '')}
                  </p>
                  {user?.role === 'RECEP' && user?.stats && (
                    <p className="text-xs text-green-600 font-medium">
                      {user.stats.visitorsRegisteredToday} citoyens • {user.stats.satisfactionScore}/5
                    </p>
                  )}
                </div>
                
                <div className="relative group">
                  <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold">
                      {user?.firstName?.charAt(0) || 'U'}{user?.lastName?.charAt(0) || 'N'}
                    </div>
                  </button>
                  
                  {/* Menu desktop profil */}
                  <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-200 py-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    {user?.role === 'RECEP' && (
                      <div className="px-6 py-3 border-b border-gray-200 bg-gradient-to-r from-teal-50 to-blue-50">
                        <div className="flex items-center gap-3">
                          <Award className="h-6 w-6 text-teal-600" />
                          <div>
                            <p className="font-bold text-gray-900">Excellence DGDI</p>
                            <p className="text-sm text-gray-600">Performance Aujourd'hui</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3 mt-3">
                          <div className="text-center">
                            <div className="text-lg font-bold text-teal-600">{user.stats?.visitorsRegisteredToday}</div>
                            <div className="text-xs text-gray-600">Visiteurs</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-blue-600">{user.stats?.satisfactionScore}</div>
                            <div className="text-xs text-gray-600">Satisfaction</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-purple-600">{user.stats?.badgesIssuedToday}</div>
                            <div className="text-xs text-gray-600">Badges</div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <button 
                      onClick={onNavigateToProfile}
                      className="w-full px-6 py-3 text-left hover:bg-blue-50 flex items-center gap-3 text-blue-600 hover:text-blue-700 font-medium border-b border-gray-100"
                    >
                      <UserCircle className="h-5 w-5" />
                      Mon Profil
                    </button>
                    
                    <button className="w-full px-6 py-3 text-left hover:bg-gray-50 flex items-center gap-3">
                      <Settings className="h-5 w-5 text-gray-500" />
                      Paramètres
                    </button>
                    
                    {user?.role === 'RECEP' && (
                      <button className="w-full px-6 py-3 text-left hover:bg-gray-50 flex items-center gap-3">
                        <Monitor className="h-5 w-5 text-gray-500" />
                        Poste de Travail
                      </button>
                    )}
                    
                    <button 
                      onClick={logout}
                      className="w-full px-6 py-3 text-left hover:bg-red-50 flex items-center gap-3 text-red-600 border-t border-gray-100"
                    >
                      <LogOut className="h-5 w-5" />
                      Déconnexion
                    </button>
                  </div>
                </div>
              </div>

              {/* Menu mobile profil - OPTIMISÉ */}
              {showMobileMenu && (
                <div className="absolute right-0 top-full mt-2 w-[calc(100vw-1rem)] max-w-72 bg-white rounded-2xl shadow-2xl border border-gray-200 py-4 z-50 md:hidden">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="font-bold text-gray-900 text-sm">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-gray-600">{getRoleLabel(user?.role || '')}</p>
                    {user?.role === 'RECEP' && user?.stats && (
                      <div className="mt-2 grid grid-cols-3 gap-2">
                        <div className="text-center bg-teal-50 rounded-lg p-2">
                          <div className="text-sm font-bold text-teal-600">{user.stats.visitorsRegisteredToday}</div>
                          <div className="text-xs text-teal-700">Visiteurs</div>
                        </div>
                        <div className="text-center bg-blue-50 rounded-lg p-2">
                          <div className="text-sm font-bold text-blue-600">{user.stats.satisfactionScore}</div>
                          <div className="text-xs text-blue-700">Score</div>
                        </div>
                        <div className="text-center bg-purple-50 rounded-lg p-2">
                          <div className="text-sm font-bold text-purple-600">{user.stats.badgesIssuedToday}</div>
                          <div className="text-xs text-purple-700">Badges</div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <button 
                    onClick={onNavigateToProfile}
                    className="w-full px-4 py-3 text-left hover:bg-blue-50 flex items-center gap-3 text-blue-600 font-medium min-h-[48px]"
                  >
                    <UserCircle className="h-5 w-5" />
                    Mon Profil
                  </button>
                  
                  <button className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 min-h-[48px]">
                    <Settings className="h-5 w-5 text-gray-500" />
                    Paramètres
                  </button>
                  
                  <button 
                    onClick={logout}
                    className="w-full px-4 py-3 text-left hover:bg-red-50 flex items-center gap-3 text-red-600 border-t border-gray-100 min-h-[48px]"
                  >
                    <LogOut className="h-5 w-5" />
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Barre de statut mobile COMPACTE pour réceptionniste */}
        {user?.role === 'RECEP' && (
          <div
            className={`bg-gradient-to-r from-teal-500 to-blue-600 border-t border-teal-400 px-2 md:px-3 py-1 ${
              capabilities.isStandalone ? 'safe-area-bottom' : ''
            }`}
            data-guide="header-stats"
          >
            <div className="flex items-center justify-between text-xs md:text-sm text-white">
              {/* Version mobile très compacte */}
              <div className="flex items-center gap-2 md:gap-6">
                <div className="flex items-center gap-1 md:gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="hidden sm:inline">Poste {user.firstName} opérationnel</span>
                  <span className="sm:hidden">Actif</span>
                </div>
                <div className="flex items-center gap-1 md:gap-2">
                  <QrCode className="h-3 md:h-4 w-3 md:w-4" />
                  <span>{user.stats?.badgesActive || 0} badge(s)</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 md:gap-4 text-blue-100">
                <span className="hidden md:inline">Temps d'attente: 15 min</span>
                <span className="md:hidden">15 min</span>
                <span className="hidden md:inline">•</span>
                <span className="font-bold text-yellow-300">🇬🇦</span>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Bouton d'aide global pour réceptionniste */}
      {user?.role === 'RECEP' && (
        <GlobalHelpButton
          onGuideClick={mainGuide.startGuide}
          onHelpClick={() => console.log('Aide contextuelle')}
        />
      )}
    </>
  );
};