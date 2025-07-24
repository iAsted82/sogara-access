import React, { useState } from 'react';
import { ChevronRight, User, Shield, Bell, Palette, Eye, Lock, HelpCircle, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ElementType;
  description?: string;
  action?: () => void;
  hasBadge?: boolean;
  badgeCount?: number;
}

interface AppleAccountNavigationProps {
  onNavigate: (itemId: string) => void;
  activeItem: string;
}

export const AppleAccountNavigation: React.FC<AppleAccountNavigationProps> = ({ 
  onNavigate,
  activeItem 
}) => {
  const { logout } = useAuth();
  const [expandedSection, setExpandedSection] = useState<string | null>('main');

  const mainNavItems: NavigationItem[] = [
    { 
      id: 'profile', 
      label: 'Mon Profil', 
      icon: User,
      description: 'Informations personnelles et préférences'
    },
    { 
      id: 'security', 
      label: 'Sécurité', 
      icon: Shield,
      description: 'Mot de passe et authentification'
    },
    { 
      id: 'notifications', 
      label: 'Notifications', 
      icon: Bell,
      description: 'Préférences de notification',
      hasBadge: true,
      badgeCount: 3
    },
    { 
      id: 'appearance', 
      label: 'Apparence', 
      icon: Palette,
      description: 'Thème et personnalisation'
    },
    { 
      id: 'accessibility', 
      label: 'Accessibilité', 
      icon: Eye,
      description: 'Options d\'accessibilité'
    }
  ];

  const supportItems: NavigationItem[] = [
    { 
      id: 'help', 
      label: 'Aide et Support', 
      icon: HelpCircle,
      description: 'Centre d\'aide et documentation'
    },
    { 
      id: 'privacy', 
      label: 'Confidentialité', 
      icon: Lock,
      description: 'Politique de confidentialité'
    },
    { 
      id: 'logout', 
      label: 'Déconnexion', 
      icon: LogOut,
      action: logout
    }
  ];

  const handleNavigate = (item: NavigationItem) => {
    if (item.action) {
      item.action();
    } else {
      onNavigate(item.id);
    }
  };

  const renderNavItems = (items: NavigationItem[]) => (
    <div className="space-y-1.5">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => handleNavigate(item)}
          className={`w-full flex items-center justify-between p-3.5 rounded-xl transition-all text-left ${
            activeItem === item.id 
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center">
            <div className={`mr-3.5 p-2.5 rounded-lg ${
              activeItem === item.id
                ? 'bg-blue-100'
                : 'bg-gray-100'
            }`}>
              <item.icon className={`h-5 w-5 ${
                activeItem === item.id
                  ? 'text-blue-600'
                  : 'text-gray-500'
              }`} />
            </div>
            <div>
              <div className="font-medium">{item.label}</div>
              {item.description && (
                <div className="text-sm text-gray-500">{item.description}</div>
              )}
            </div>
          </div>
          <div className="flex items-center">
            {item.hasBadge && (
              <span className="bg-red-500 text-white text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
                {item.badgeCount}
              </span>
            )}
            <ChevronRight className={`h-5 w-5 ${
              activeItem === item.id
                ? 'text-blue-600'
                : 'text-gray-400'
            }`} />
          </div>
        </button>
      ))}
    </div>
  );

  return (
    <div className="h-full w-full max-w-xs bg-white border-r border-gray-200 overflow-auto p-6 space-y-8">
      {/* Profile Section */}
      <div 
        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-5 shadow-lg"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundPosition: '0 0',
          backgroundSize: '60px 60px'
        }}
      >
        <div className="flex items-center mb-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-xl font-bold backdrop-blur-sm border border-white/30">
            RA
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-bold">Robert NDONG</h3>
            <p className="text-sm text-blue-100">Administrateur</p>
          </div>
        </div>
        
        <div className="bg-white/10 rounded-lg px-3 py-2 backdrop-blur-sm border border-white/20">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <Shield className="h-3.5 w-3.5 mr-1.5" />
              Sécurité maximum
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-1.5"></span>
              En ligne
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Navigation */}
      <div>
        <button
          onClick={() => setExpandedSection(expandedSection === 'main' ? null : 'main')}
          className="w-full flex items-center justify-between mb-3"
        >
          <h3 className="text-sm font-semibold uppercase text-gray-500">Compte</h3>
        </button>
        
        {expandedSection === 'main' && renderNavItems(mainNavItems)}
      </div>
      
      {/* Support Navigation */}
      <div>
        <button
          onClick={() => setExpandedSection(expandedSection === 'support' ? null : 'support')}
          className="w-full flex items-center justify-between mb-3"
        >
          <h3 className="text-sm font-semibold uppercase text-gray-500">Support & Aide</h3>
        </button>
        
        {expandedSection === 'support' && renderNavItems(supportItems)}
      </div>
      
      {/* App Info */}
      <div className="pt-4 border-t border-gray-200">
        <div className="text-center">
          <p className="text-sm text-gray-600">SOGARA Access</p>
          <p className="text-xs text-gray-400">Version 2024.01.15</p>
          <p className="text-xs text-gray-400 mt-2">© 2024 Direction Générale de la Documentation et de l'Immigration</p>
          <div className="mt-3 flex justify-center">
            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-500">
              Excellence dans le service
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};