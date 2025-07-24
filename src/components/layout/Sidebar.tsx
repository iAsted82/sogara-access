import React from 'react';
import { Home, FileText, Import as Passport, Users, BarChart3, Settings, AlertTriangle, MapPin, Search, UserCheck, Package, Calendar, Camera, Bell, User, HelpCircle, BookOpen, Image as ImageIcon, Award, Tag, Shield, UserPlus, Phone, Briefcase } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useInteractiveGuide } from '../../hooks/useInteractiveGuide';
import { receptionistGuideSteps, quickGuideSteps } from '../../data/receptionistGuide';
import { GuideButton } from '../ui/GuideButton';
import { AdminSidebar } from './AdminSidebar';
import { navigateToModule } from '../../utils/deploymentHelpers';

interface SidebarProps {
  isOpen: boolean;
  activeModule: string;
  onModuleChange: (module: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, activeModule, onModuleChange }) => {
  const { user } = useAuth();

  // Si c'est un admin, utiliser la sidebar admin
  if (user?.role === 'ADMIN') {
    return (
      <AdminSidebar 
        isOpen={isOpen}
        activeModule={activeModule}
        onModuleChange={onModuleChange}
      />
    );
  }

  // Guides interactifs pour les réceptionnistes
  const { startGuide: startMainGuide, shouldShowGuideButton } = useInteractiveGuide({
    guideId: 'receptionist-main',
    steps: receptionistGuideSteps,
    autoStart: false,
    showOnFirstVisit: false
  });

  const { startGuide: startQuickGuide } = useInteractiveGuide({
    guideId: 'receptionist-quick',
    steps: quickGuideSteps,
    autoStart: false,
    showOnFirstVisit: false
  });

  const getMenuItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Tableau de bord', icon: Home, color: 'text-blue-600' },
    ];
    
    // Items spécifiques aux rôles - seuls les rôles actifs sont conservés
    const roleItems: Record<string, { id: string, label: string, icon: any, color: string, description?: string }[]> = {
      ADMIN: [     
        { id: 'users', label: 'Gestion Utilisateurs', icon: Users, color: 'text-purple-600' },
        { id: 'visitors', label: 'Gestion Visiteurs', icon: UserPlus, color: 'text-green-600' },
        { id: 'image-management', label: 'Gestion d\'Images', icon: ImageIcon, color: 'text-green-600' },
        { id: 'logo-management', label: 'Gestion des Logos', icon: Award, color: 'text-yellow-600' },
        { id: 'system', label: 'Administration', icon: Settings, color: 'text-gray-600' },
        { id: 'audit', label: 'Audit & Logs', icon: Shield, color: 'text-red-600' },
      ],
      RECEP: [
        { id: 'reception', label: 'Accueil Citoyen', icon: UserCheck, color: 'text-green-600', description: 'Enregistrement visiteurs et gestion des badges' },
        { id: 'visitors', label: 'Gestion Visiteurs', icon: UserPlus, color: 'text-blue-600', description: 'Système de gestion des visites & visites prévues' },
        { id: 'staff', label: 'Personnel', icon: Briefcase, color: 'text-indigo-600', description: 'Gestion du personnel interne' },
        { id: 'packages', label: 'Colis & Courrier', icon: Package, color: 'text-orange-600', description: 'Réception avec notification' },
        { id: 'visitor-stats', label: 'Statistiques Accueil', icon: BarChart3, color: 'text-purple-600', description: 'Métriques & performance' },
      ].filter(item => !item.label.includes('Surveillance')),
    };

    // Ajouter l'option profil pour tous les utilisateurs
    const profileItem = { id: 'profile', label: 'Mon Profil', icon: User, color: 'text-indigo-600', description: 'Gestion du profil personnel' };

    return [...baseItems, ...(roleItems[user?.role as keyof typeof roleItems] || []), profileItem];
  };

  // Gestionnaire amélioré pour le changement de module avec navigation
  const handleModuleChange = (moduleId: string) => {
    console.log('🎯 Changement de module vers:', moduleId);
    
    // Utiliser l'utilitaire de navigation pour une cohérence globale
    navigateToModule(moduleId);
    
    // Appeler le gestionnaire original pour la mise à jour du state
    onModuleChange(moduleId);
  };

  return (
    <div 
      data-component="sidebar"
      className={`${isOpen ? 'w-64' : 'w-16'} bg-white shadow-lg border-r border-gray-200 transition-all duration-300 h-screen overflow-y-auto flex flex-col`}
    >
      <div className="p-3 md:p-4 flex-1">
        <nav className="space-y-0.5 md:space-y-1">
          <div className="flex items-center gap-2 w-full">
            <img 
              src="/Photoroom_20250703_164401.PNG" 
              alt="Logo SOGARA" 
              className="h-11 w-auto" 
            />
            <div className="flex-1 min-w-0 pl-1">
              <h2 className="text-sm font-bold text-gray-900 truncate">SOGARA Access</h2>
            </div>
          </div>
          {getMenuItems().map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleModuleChange(item.id)}
                data-module-navigation={item.id}
                className={`w-full flex items-center gap-2 md:gap-3 px-2 md:px-3 py-3 md:py-3 rounded-lg transition-colors group relative min-h-[48px] ${
                  activeModule === item.id
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                title={!isOpen ? item.label : ''}
              >
                <Icon className={`h-5 w-5 ${item.color} ${activeModule === item.id ? 'text-blue-700' : ''} group-hover:scale-110 transition-transform flex-shrink-0`} />
                {isOpen && (
                  <div className="flex-1 text-left min-w-0">
                    <span className="font-medium text-sm md:text-base block truncate">{item.label}</span>
                    {item.description && user?.role === 'RECEP' && item.id !== 'profile' && (
                      <p className="text-xs text-gray-500 mt-1 hidden md:block leading-tight">{item.description}</p>
                    )}
                    {item.id === 'profile' && (
                      <p className="text-xs text-gray-500 mt-1 hidden md:block">Informations personnelles</p>
                    )}
                  </div>
                )}
                
                {/* Indicateur de profil */}
                {item.id === 'profile' && activeModule === item.id && (
                  <div className="absolute right-2 w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0"></div>
                )}
              </button>
            );
          })}
          <div className="mx-auto">
            <img 
              src="/Photoroom_20250703_164401.PNG" 
              alt="Logo SOGARA" 
              className="h-14 w-auto" 
            />
          </div>
        </nav>
      </div>

      {/* Zone d'aide contextuelle en bas - MOBILE OPTIMISÉ */}
      {isOpen && (
        <div className="p-2 md:p-3 border-t border-gray-200 bg-gray-50/50">
          {user?.role === 'RECEP' ? (
            <div className="space-y-2">
              {/* Titre section aide */}
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-blue-600 flex-shrink-0" />
                <span className="text-sm font-bold text-gray-900">Centre d'Aide</span>
              </div>

              {/* Guides disponibles */}
              <div className="space-y-1">
                {/* Guide principal */}
                {shouldShowGuideButton() && (
                  <GuideButton
                    onClick={startMainGuide}
                    variant="primary"
                    size="sm"
                    label="Guide Complet"
                    className="w-full justify-center text-xs min-h-[36px]"
                  />
                )}
                
                {/* Guide rapide */}
                <GuideButton
                  onClick={startQuickGuide}
                  variant="secondary"
                  size="sm"
                  label="Démarrage Rapide"
                  className="w-full justify-center text-xs min-h-[36px]"
                />

                {/* Aide contextuelle */}
                <button className="w-full text-xs bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors min-h-[36px] flex items-center justify-center gap-2">
                  <HelpCircle className="h-3 w-3 flex-shrink-0" />
                  Aide Contextuelle
                </button>
              </div>

              {/* Statut des équipements - COMPACT */}
              <div className="bg-gradient-to-br from-teal-50 to-blue-50 border border-teal-200 rounded-lg p-2">
                <div className="flex items-center gap-2 mb-1">
                  <Camera className="h-4 w-4 text-teal-600 flex-shrink-0" />
                  <span className="text-xs font-bold text-teal-900">État Équipements</span>
                </div>
                <div className="space-y-1 text-xs text-teal-800">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                    <span className="truncate">Scanner IA - 99% prêt</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                    <span className="truncate">Badges - Opérationnel</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                    <span className="truncate">Notifications - Actif</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0" />
                <span className="text-sm font-medium text-amber-800">Informations</span>
              </div>
              <p className="text-xs text-amber-700 mb-2">
                Système opérationnel
              </p>
              <div className="mt-2">
                <GuideButton
                  onClick={() => console.log('Guide général')}
                  variant="secondary"
                  size="sm"
                  label="Aide"
                  className="w-full justify-center text-xs min-h-[32px]"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};