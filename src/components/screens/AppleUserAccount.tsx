import React, { useState, useEffect } from 'react';
import { 
  User, 
  Shield, 
  Bell, 
  Key, 
  Settings, 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  Lock, 
  Eye, 
  EyeOff, 
  Check, 
  ArrowRight, 
  ChevronRight,
  RefreshCw,
  Fingerprint,
  Smartphone,
  Globe,
  HelpCircle,
  Monitor,
  Moon,
  Sun,
  Zap,
  Camera,
  Palette,
  Save,
  XCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { AppleButton } from '../ui/AppleButton';
import { AppleCard } from '../ui/AppleCard';
import { AppleInput } from '../ui/AppleInput';
import { AppleBadge } from '../ui/AppleBadge';

interface TabProps {
  id: string;
  label: string;
  icon: React.ElementType;
}

const UserAccount: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('profile');
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '+241 XX XX XX XX',
    jobTitle: user?.position || '',
    department: user?.department || '',
    securityLevel: user?.securityLevel || 'standard',
  });
  
  // Animation states
  const [animateIn, setAnimateIn] = useState(false);
  
  useEffect(() => {
    setAnimateIn(true);
    
    // Reset animation when tab changes
    return () => setAnimateIn(false);
  }, [activeTab]);

  const tabs: TabProps[] = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Apparence', icon: Palette },
    { id: 'accessibility', label: 'Accessibilité', icon: Eye },
  ];

  const handleTabChange = (tabId: string) => {
    setAnimateIn(false);
    setTimeout(() => {
      setActiveTab(tabId);
      setAnimateIn(true);
    }, 200);
  };

  const handleSaveProfile = () => {
    // Here you would save the profile data to your backend
    console.log('Saving profile:', profileData);
    setIsEditing(false);
    
    // Show success animation
    const successElement = document.getElementById('save-success');
    if (successElement) {
      successElement.classList.add('opacity-100', 'translate-y-0');
      setTimeout(() => {
        successElement.classList.remove('opacity-100', 'translate-y-0');
      }, 3000);
    }
  };

  const renderProfileTab = () => (
    <div className={`space-y-8 transition-all duration-500 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* User Info Header */}
      <div className="relative">
        <AppleCard 
          variant="elevated" 
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 p-6">
            <div className="relative group">
              <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center text-3xl font-bold backdrop-blur-sm border border-white/30 shadow-2xl">
                {user?.firstName.charAt(0)}{user?.lastName.charAt(0)}
              </div>
              <div className="absolute inset-0 bg-black/30 rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="h-6 w-6 text-white" />
              </div>
            </div>
            
            <div className="text-center md:text-left flex-1">
              <h1 className="text-large-title font-bold mb-2">{user?.firstName} {user?.lastName}</h1>
              <div className="text-headline text-white/80 mb-4">{user?.position}</div>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                <AppleBadge variant="info" className="bg-white/20 backdrop-blur-sm">
                  <Shield className="h-3.5 w-3.5 mr-1.5" />
                  {user?.securityLevel}
                </AppleBadge>
                <AppleBadge variant="info" className="bg-white/20 backdrop-blur-sm">
                  <Globe className="h-3.5 w-3.5 mr-1.5" />
                  {user?.location}
                </AppleBadge>
                <AppleBadge variant="info" className="bg-white/20 backdrop-blur-sm">
                  <Clock className="h-3.5 w-3.5 mr-1.5" />
                  Dernière connexion: {new Date().toLocaleDateString('fr-FR')}
                </AppleBadge>
              </div>
            </div>
            
            <div className="md:self-start">
              <AppleButton 
                variant={isEditing ? "secondary" : "ghost"} 
                className={isEditing ? "bg-white text-blue-600" : "text-white border border-white/20 hover:bg-white/20"}
                onClick={() => setIsEditing(!isEditing)}
                icon={isEditing ? XCircle : Settings}
              >
                {isEditing ? 'Annuler' : 'Modifier'}
              </AppleButton>
            </div>
          </div>
        </AppleCard>
        
        {/* Success message */}
        <div 
          id="save-success"
          className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full flex items-center opacity-0 translate-y-4 transition-all duration-300"
        >
          <Check className="h-4 w-4 mr-2" />
          Profil mis à jour
        </div>
      </div>
      
      {/* Profile Information */}
      <AppleCard variant="elevated" padding="lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-title-2 font-semibold">Informations du Compte</h2>
          {isEditing && (
            <AppleButton 
              variant="primary" 
              onClick={handleSaveProfile}
              icon={Save}
            >
              Enregistrer
            </AppleButton>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AppleInput 
            label="Prénom" 
            value={profileData.firstName}
            onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
            disabled={!isEditing}
            variant="floating"
          />
          
          <AppleInput 
            label="Nom" 
            value={profileData.lastName}
            onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
            disabled={!isEditing}
            variant="floating"
          />
          
          <AppleInput 
            label="Email professionnel" 
            value={profileData.email}
            onChange={(e) => setProfileData({...profileData, email: e.target.value})}
            disabled={!isEditing}
            icon={Mail}
            variant="floating"
          />
          
          <AppleInput 
            label="Téléphone" 
            value={profileData.phone}
            onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
            disabled={!isEditing}
            icon={Phone}
            variant="floating"
          />
          
          <div className="md:col-span-2 space-y-2">
            <label className="text-callout font-medium text-label">Niveau de sécurité</label>
            <div className="bg-blue-50 text-blue-800 p-4 rounded-xl flex items-center">
              <Shield className="h-5 w-5 mr-3 text-blue-600" />
              <div>
                <div className="font-semibold">{user?.securityLevel === 'maximum' ? 'Niveau Maximum' : user?.securityLevel === 'elevated' ? 'Niveau Élevé' : 'Niveau Standard'}</div>
                <div className="text-sm mt-1">
                  {user?.securityLevel === 'maximum' ? 
                    'Accès à toutes les fonctionnalités et données sensibles du système.' :
                    user?.securityLevel === 'elevated' ?
                    'Accès aux fonctionnalités principales et données sensibles limitées.' :
                    'Accès aux fonctionnalités de base uniquement.'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppleCard>
      
      {/* Account Activity */}
      <AppleCard variant="elevated" padding="lg">
        <h2 className="text-title-2 font-semibold mb-6">Activité du Compte</h2>
        
        <div className="space-y-4">
          {[
            { icon: Clock, title: 'Dernière connexion', value: 'Aujourd\'hui à 10:45', detail: 'Depuis Libreville, Gabon' },
            { icon: Monitor, title: 'Appareil', value: 'MacBook Pro', detail: 'Chrome 118.0.5993.117' },
            { icon: Shield, title: 'Statut de sécurité', value: 'Bon', detail: 'Aucune activité suspecte détectée' }
          ].map((item, index) => (
            <div key={index} className="flex items-center p-4 hover:bg-gray-50 rounded-xl transition-colors">
              <div className="mr-4 p-3 bg-blue-100 rounded-xl">
                <item.icon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="text-callout font-medium">{item.title}</div>
                <div className="text-body text-secondary-label">{item.value}</div>
              </div>
              <div className="text-footnote text-tertiary-label">{item.detail}</div>
            </div>
          ))}
        </div>
        
        <div className="mt-6">
          <AppleButton variant="secondary" icon={Eye}>
            Voir l'historique complet
          </AppleButton>
        </div>
      </AppleCard>
      
      {/* Account Permissions */}
      <AppleCard variant="elevated" padding="lg">
        <h2 className="text-title-2 font-semibold mb-6">Autorisations</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {user?.permissions?.map((permission, index) => (
            <div key={index} className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-100 rounded-xl">
              <Check className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-800 capitalize">
                {permission.replace(/_/g, ' ')}
              </span>
            </div>
          ))}
        </div>
      </AppleCard>
    </div>
  );

  const renderSecurityTab = () => (
    <div className={`space-y-8 transition-all duration-500 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* Password Management */}
      <AppleCard variant="elevated" padding="lg">
        <h2 className="text-title-2 font-semibold mb-6">Sécurité du Compte</h2>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors">
            <div className="flex items-center">
              <div className="mr-4 p-3 bg-green-100 rounded-xl">
                <Key className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-callout font-medium">Mot de passe</div>
                <div className="text-body text-secondary-label">Dernière modification il y a 30 jours</div>
              </div>
            </div>
            <AppleButton variant="secondary" size="sm">
              Modifier
            </AppleButton>
          </div>
          
          <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors">
            <div className="flex items-center">
              <div className="mr-4 p-3 bg-blue-100 rounded-xl">
                <Smartphone className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-callout font-medium">Authentification à deux facteurs</div>
                <div className="text-body text-secondary-label">Non activée</div>
              </div>
            </div>
            <AppleButton variant="secondary" size="sm">
              Activer
            </AppleButton>
          </div>
          
          <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors">
            <div className="flex items-center">
              <div className="mr-4 p-3 bg-purple-100 rounded-xl">
                <Fingerprint className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-callout font-medium">Méthodes de récupération</div>
                <div className="text-body text-secondary-label">Email configuré</div>
              </div>
            </div>
            <AppleButton variant="secondary" size="sm">
              Gérer
            </AppleButton>
          </div>
        </div>
      </AppleCard>
      
      {/* Connected Devices */}
      <AppleCard variant="elevated" padding="lg">
        <h2 className="text-title-2 font-semibold mb-6">Appareils Connectés</h2>
        
        <div className="space-y-4">
          {[
            { name: 'MacBook Pro', location: 'Libreville, Gabon', lastActive: 'Maintenant', isCurrent: true },
            { name: 'iPhone 15 Pro', location: 'Libreville, Gabon', lastActive: 'Il y a 2 heures' },
            { name: 'iPad Air', location: 'Port-Gentil, Gabon', lastActive: 'Il y a 3 jours' }
          ].map((device, index) => (
            <div key={index} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors">
              <div className="flex items-center">
                <div className="mr-4 p-3 bg-gray-100 rounded-xl">
                  <Monitor className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <div className="flex items-center">
                    <span className="text-callout font-medium">{device.name}</span>
                    {device.isCurrent && (
                      <AppleBadge variant="success" size="sm" className="ml-2">Actuel</AppleBadge>
                    )}
                  </div>
                  <div className="text-body text-secondary-label">{device.location}</div>
                </div>
              </div>
              <div className="text-footnote text-tertiary-label">{device.lastActive}</div>
            </div>
          ))}
        </div>
        
        <div className="mt-6">
          <AppleButton variant="secondary" icon={Lock}>
            Se déconnecter de tous les appareils
          </AppleButton>
        </div>
      </AppleCard>
      
      {/* Login History */}
      <AppleCard variant="elevated" padding="lg">
        <h2 className="text-title-2 font-semibold mb-6">Historique de Connexion</h2>
        
        <div className="space-y-4">
          {[
            { date: 'Aujourd\'hui, 10:45', location: 'Libreville, Gabon', device: 'Chrome sur MacOS', status: 'success' },
            { date: 'Hier, 18:23', location: 'Libreville, Gabon', device: 'Safari sur iOS', status: 'success' },
            { date: '10 Juin, 09:15', location: 'Port-Gentil, Gabon', device: 'Firefox sur Windows', status: 'failed' }
          ].map((login, index) => (
            <div key={index} className="flex items-center p-4 hover:bg-gray-50 rounded-xl transition-colors">
              <div className="mr-4 p-2 rounded-full bg-gray-100">
                {login.status === 'success' 
                  ? <Check className="h-5 w-5 text-green-600" />
                  : <XCircle className="h-5 w-5 text-red-600" />
                }
              </div>
              <div className="flex-1">
                <div className="text-callout font-medium">{login.date}</div>
                <div className="text-body text-secondary-label">{login.device}</div>
              </div>
              <div className="text-footnote text-tertiary-label">{login.location}</div>
            </div>
          ))}
        </div>
        
        <div className="mt-6">
          <AppleButton variant="secondary" icon={Eye}>
            Voir tout l'historique
          </AppleButton>
        </div>
      </AppleCard>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className={`space-y-8 transition-all duration-500 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <AppleCard variant="elevated" padding="lg">
        <h2 className="text-title-2 font-semibold mb-6">Préférences de Notification</h2>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <div className="mr-4 p-3 bg-blue-100 rounded-xl">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-callout font-medium">Notifications par email</div>
                <div className="text-body text-secondary-label">Recevoir des notifications importantes par email</div>
              </div>
            </div>
            <div className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" value="" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <div className="mr-4 p-3 bg-green-100 rounded-xl">
                <Phone className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-callout font-medium">Notifications par SMS</div>
                <div className="text-body text-secondary-label">Recevoir des notifications urgentes par SMS</div>
              </div>
            </div>
            <div className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" value="" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <div className="mr-4 p-3 bg-purple-100 rounded-xl">
                <Bell className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-callout font-medium">Notifications push</div>
                <div className="text-body text-secondary-label">Recevoir des notifications push sur vos appareils</div>
              </div>
            </div>
            <div className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" value="" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </div>
          </div>
        </div>
      </AppleCard>
      
      <AppleCard variant="elevated" padding="lg">
        <h2 className="text-title-2 font-semibold mb-6">Catégories de Notification</h2>
        
        <div className="space-y-6">
          {[
            { name: 'Connexions au compte', description: 'Soyez alerté des nouvelles connexions à votre compte', enabled: true },
            { name: 'Mises à jour système', description: 'Nouvelles fonctionnalités et améliorations', enabled: true },
            { name: 'Rendez-vous', description: 'Rappels des rendez-vous à venir', enabled: true },
            { name: 'Activités administratives', description: 'Changements liés à l\'administration', enabled: false },
            { name: 'Rapports statistiques', description: 'Rapports hebdomadaires et mensuels', enabled: false },
          ].map((category, index) => (
            <div key={index} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors">
              <div>
                <div className="text-callout font-medium">{category.name}</div>
                <div className="text-body text-secondary-label">{category.description}</div>
              </div>
              <div className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" defaultChecked={category.enabled} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </div>
            </div>
          ))}
        </div>
      </AppleCard>
    </div>
  );
  
  const renderAppearanceTab = () => (
    <div className={`space-y-8 transition-all duration-500 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <AppleCard variant="elevated" padding="lg">
        <h2 className="text-title-2 font-semibold mb-6">Apparence</h2>
        
        <div className="space-y-6">
          {/* Theme Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-blue-500 p-4 rounded-xl text-center cursor-pointer bg-white">
              <Sun className="h-10 w-10 mx-auto mb-3 text-blue-600" />
              <div className="text-callout font-medium">Clair</div>
              <div className="mt-2 w-4 h-4 bg-blue-600 rounded-full mx-auto"></div>
            </div>
            
            <div className="border border-gray-200 p-4 rounded-xl text-center cursor-pointer hover:border-blue-300 transition-colors">
              <Moon className="h-10 w-10 mx-auto mb-3 text-gray-600" />
              <div className="text-callout font-medium">Sombre</div>
            </div>
            
            <div className="border border-gray-200 p-4 rounded-xl text-center cursor-pointer hover:border-blue-300 transition-colors">
              <Monitor className="h-10 w-10 mx-auto mb-3 text-gray-600" />
              <div className="text-callout font-medium">Système</div>
            </div>
          </div>
          
          {/* Color Scheme */}
          <div className="mt-8">
            <h3 className="text-headline font-semibold mb-4">Couleur d'accentuation</h3>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
              {[
                { color: 'bg-blue-500', name: 'Bleu', active: true },
                { color: 'bg-purple-500', name: 'Violet', active: false },
                { color: 'bg-pink-500', name: 'Rose', active: false },
                { color: 'bg-red-500', name: 'Rouge', active: false },
                { color: 'bg-orange-500', name: 'Orange', active: false },
                { color: 'bg-yellow-500', name: 'Jaune', active: false },
                { color: 'bg-green-500', name: 'Vert', active: false },
                { color: 'bg-teal-500', name: 'Turquoise', active: false },
              ].map((colorOption, index) => (
                <div key={index} className="flex flex-col items-center">
                  <button 
                    className={`w-10 h-10 ${colorOption.color} rounded-full mb-2 ${colorOption.active ? 'ring-2 ring-offset-2 ring-blue-600' : 'hover:ring-2 hover:ring-offset-2 hover:ring-gray-300 transition-all'}`}
                    aria-label={colorOption.name}
                  />
                  <span className="text-xs">{colorOption.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AppleCard>
      
      <AppleCard variant="elevated" padding="lg">
        <h2 className="text-title-2 font-semibold mb-6">Personnalisation de l'Interface</h2>
        
        <div className="space-y-6">
          {/* Font Size */}
          <div>
            <h3 className="text-headline font-semibold mb-4">Taille de police</h3>
            <div className="flex items-center gap-3">
              <span className="text-xs">A</span>
              <input 
                type="range" 
                min="1" 
                max="5" 
                value="3"
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className="text-xl">A</span>
            </div>
          </div>
          
          {/* Animation Toggle */}
          <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors">
            <div className="flex items-center">
              <div className="mr-4 p-3 bg-blue-100 rounded-xl">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-callout font-medium">Animations et effets</div>
                <div className="text-body text-secondary-label">Activer les transitions et animations fluides</div>
              </div>
            </div>
            <div className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" value="" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </div>
          </div>
          
          {/* Blur Effects */}
          <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors">
            <div className="flex items-center">
              <div className="mr-4 p-3 bg-purple-100 rounded-xl">
                <Globe className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-callout font-medium">Effets de transparence</div>
                <div className="text-body text-secondary-label">Activer les effets de verre et flou</div>
              </div>
            </div>
            <div className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" value="" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </div>
          </div>
          
          {/* Layout Density */}
          <div>
            <h3 className="text-headline font-semibold mb-4">Densité de l'interface</h3>
            <div className="grid grid-cols-3 gap-4">
              <button className="border border-blue-500 p-3 rounded-xl text-center">
                <div className="text-callout font-medium text-blue-600">Compacte</div>
              </button>
              
              <button className="border border-gray-200 p-3 rounded-xl text-center hover:border-blue-300 transition-colors">
                <div className="text-callout font-medium">Standard</div>
              </button>
              
              <button className="border border-gray-200 p-3 rounded-xl text-center hover:border-blue-300 transition-colors">
                <div className="text-callout font-medium">Confortable</div>
              </button>
            </div>
          </div>
        </div>
      </AppleCard>
    </div>
  );
  
  const renderAccessibilityTab = () => (
    <div className={`space-y-8 transition-all duration-500 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <AppleCard variant="elevated" padding="lg">
        <h2 className="text-title-2 font-semibold mb-6">Accessibilité</h2>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors">
            <div className="flex items-center">
              <div className="mr-4 p-3 bg-blue-100 rounded-xl">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-callout font-medium">Contraste élevé</div>
                <div className="text-body text-secondary-label">Augmente le contraste pour une meilleure lisibilité</div>
              </div>
            </div>
            <div className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" value="" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors">
            <div className="flex items-center">
              <div className="mr-4 p-3 bg-green-100 rounded-xl">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-callout font-medium">Réduire les animations</div>
                <div className="text-body text-secondary-label">Désactive ou réduit les animations de l'interface</div>
              </div>
            </div>
            <div className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" value="" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors">
            <div className="flex items-center">
              <div className="mr-4 p-3 bg-purple-100 rounded-xl">
                <HelpCircle className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-callout font-medium">Description des éléments</div>
                <div className="text-body text-secondary-label">Active les descriptions détaillées pour les lecteurs d'écran</div>
              </div>
            </div>
            <div className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" value="" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </div>
          </div>
        </div>
      </AppleCard>
      
      <AppleCard variant="elevated" padding="lg">
        <h2 className="text-title-2 font-semibold mb-6">Options Avancées</h2>
        
        <div>
          <h3 className="text-headline font-semibold mb-4">Taille du texte</h3>
          <div className="space-y-3">
            {[
              { label: 'Très petit', value: 'xs' },
              { label: 'Petit', value: 'sm' },
              { label: 'Moyen (par défaut)', value: 'md', selected: true },
              { label: 'Grand', value: 'lg' },
              { label: 'Très grand', value: 'xl' }
            ].map((size, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-lg border ${size.selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'} cursor-pointer transition-colors`}
              >
                <div className="flex items-center justify-between">
                  <span className={`${
                    size.value === 'xs' ? 'text-xs' :
                    size.value === 'sm' ? 'text-sm' :
                    size.value === 'lg' ? 'text-lg' :
                    size.value === 'xl' ? 'text-xl' :
                    'text-base'
                  }`}>
                    {size.label}
                  </span>
                  {size.selected && <Check className="h-5 w-5 text-blue-600" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </AppleCard>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-title-2 font-bold">Mon Compte</h1>
            <div className="flex items-center space-x-2">
              <div className="h-2.5 w-2.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Connecté</span>
            </div>
          </div>
        </div>
      </header>
      
      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex overflow-x-auto no-scrollbar">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center px-4 py-3 border-b-2 font-medium text-sm whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <TabIcon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {activeTab === 'profile' && renderProfileTab()}
        {activeTab === 'security' && renderSecurityTab()}
        {activeTab === 'notifications' && renderNotificationsTab()}
        {activeTab === 'appearance' && renderAppearanceTab()}
        {activeTab === 'accessibility' && renderAccessibilityTab()}
      </div>
    </div>
  );
};

export default UserAccount;