import React, { useState, useEffect } from 'react';
import { AppleCard, StatCard } from '../ui/AppleCard';
import { AppleButton, SegmentedControl } from '../ui/AppleButton';
import { AppleInput } from '../ui/AppleInput';
import { 
  User, 
  Settings, 
  Shield, 
  Camera, 
  Bell, 
  Moon, 
  Sun,
  Phone,
  Mail,
  MapPin,
  Building2,
  Award,
  TrendingUp,
  Monitor,
  Star,
  Edit3,
  Save
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const AppleProfileScreen: React.FC = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const [editData, setEditData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: '+241 XX XX XX XX',
    email: user?.email || ''
  });

  const isReceptionist = user?.role === 'RECEP';

  const sectionOptions = [
    { label: 'Aperçu', value: 'overview', icon: User },
    { label: 'Profil', value: 'profile', icon: Edit3 },
    { label: 'Performance', value: 'performance', icon: TrendingUp },
    { label: 'Paramètres', value: 'settings', icon: Settings }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Hero Section */}
      <AppleCard variant="elevated" className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center text-3xl font-bold backdrop-blur-sm">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </div>
            {isReceptionist && (
              <div className="absolute -bottom-2 -right-2 bg-yellow-400 rounded-full p-2">
                <Award className="h-5 w-5 text-yellow-900" />
              </div>
            )}
            <button className="absolute inset-0 bg-black/50 rounded-3xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <Camera className="h-6 w-6 text-white" />
            </button>
          </div>
          
          <div className="flex-1">
            <h1 className="text-title-1 font-bold mb-2">
              {user?.firstName} {user?.lastName}
            </h1>
            <p className="text-title-3 text-white/80 mb-4">{user?.position}</p>
            
            <div className="flex flex-wrap gap-3">
              <div className="bg-white/20 rounded-full px-3 py-1 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="h-4 w-4" />
                  {user?.department}
                </div>
              </div>
              <div className="bg-white/20 rounded-full px-3 py-1 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4" />
                  {user?.location}
                </div>
              </div>
              <div className="bg-white/20 rounded-full px-3 py-1 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4" />
                  {user?.securityLevel}
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppleCard>

      {/* Quick Stats */}
      {isReceptionist && user?.stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Citoyens Accueillis"
            value={user.stats.visitorsRegisteredToday}
            change="+12%"
            changeType="positive"
            icon={User}
            color="blue"
          />
          <StatCard
            title="Satisfaction"
            value={`${user.stats.satisfactionScore}/5`}
            change="+0.2"
            changeType="positive"
            icon={Star}
            color="green"
          />
          <StatCard
            title="Badges Émis"
            value={user.stats.badgesIssuedToday}
            change="+3"
            changeType="positive"
            icon={Shield}
            color="purple"
          />
        </div>
      )}

      {/* Quick Actions */}
      <AppleCard variant="elevated" padding="lg">
        <h3 className="text-title-3 font-semibold mb-6">Actions Rapides</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <AppleButton
            variant="secondary"
            icon={Edit3}
            onClick={() => setActiveSection('profile')}
            className="h-20 flex-col"
          >
            Modifier
          </AppleButton>
          <AppleButton
            variant="secondary"
            icon={Settings}
            onClick={() => setActiveSection('settings')}
            className="h-20 flex-col"
          >
            Paramètres
          </AppleButton>
          <AppleButton
            variant="secondary"
            icon={TrendingUp}
            onClick={() => setActiveSection('performance')}
            className="h-20 flex-col"
          >
            Performance
          </AppleButton>
          <AppleButton
            variant="secondary"
            icon={Monitor}
            className="h-20 flex-col"
          >
            Équipements
          </AppleButton>
        </div>
      </AppleCard>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-title-1 font-bold">Informations Personnelles</h2>
        <AppleButton
          variant={isEditing ? "primary" : "secondary"}
          icon={isEditing ? Save : Edit3}
          onClick={() => {
            if (isEditing) {
              // Save logic here
              console.log('Saving:', editData);
            }
            setIsEditing(!isEditing);
          }}
        >
          {isEditing ? 'Sauvegarder' : 'Modifier'}
        </AppleButton>
      </div>

      <AppleCard variant="elevated" padding="lg">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AppleInput
              label="Prénom"
              value={editData.firstName}
              onChange={(e) => setEditData({...editData, firstName: e.target.value})}
              disabled={!isEditing}
              variant="floating"
            />
            <AppleInput
              label="Nom"
              value={editData.lastName}
              onChange={(e) => setEditData({...editData, lastName: e.target.value})}
              disabled={!isEditing}
              variant="floating"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AppleInput
              label="Email"
              type="email"
              value={editData.email}
              onChange={(e) => setEditData({...editData, email: e.target.value})}
              disabled={!isEditing}
              variant="floating"
              icon={Mail}
            />
            <AppleInput
              label="Téléphone"
              type="tel"
              value={editData.phone}
              onChange={(e) => setEditData({...editData, phone: e.target.value})}
              disabled={!isEditing}
              variant="floating"
              icon={Phone}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-callout font-medium text-label">Département</label>
              <div className="input bg-gray-50 text-gray-600 cursor-not-allowed">
                {user?.department}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-callout font-medium text-label">Localisation</label>
              <div className="input bg-gray-50 text-gray-600 cursor-not-allowed">
                {user?.location}
              </div>
            </div>
          </div>
        </div>
      </AppleCard>

      {/* Permissions */}
      <AppleCard variant="elevated" padding="lg">
        <h3 className="text-title-3 font-semibold mb-6">Permissions DGDI</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {user?.permissions?.slice(0, 12).map((permission, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-callout text-blue-800 capitalize">
                {permission.replace(/_/g, ' ')}
              </span>
            </div>
          ))}
          {user?.permissions && user.permissions.length > 12 && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <span className="text-callout text-gray-600">
                +{user.permissions.length - 12} autres permissions
              </span>
            </div>
          )}
        </div>
      </AppleCard>
    </div>
  );

  const renderPerformance = () => (
    <div className="space-y-6">
      <h2 className="text-title-1 font-bold">Analyse de Performance</h2>

      {isReceptionist && user?.stats ? (
        <>
          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              title="Visiteurs Aujourd'hui"
              value={user.stats.visitorsRegisteredToday}
              change="+12%"
              changeType="positive"
              icon={User}
              color="blue"
              size="lg"
            />
            <StatCard
              title="Temps Moyen"
              value="3 min"
              change="-30s"
              changeType="positive"
              icon={TrendingUp}
              color="green"
              size="lg"
            />
            <StatCard
              title="Satisfaction"
              value={`${user.stats.satisfactionScore}/5`}
              change="+0.2"
              changeType="positive"
              icon={Star}
              color="orange"
              size="lg"
            />
          </div>

          {/* Weekly Chart */}
          <AppleCard variant="elevated" padding="lg">
            <h3 className="text-title-3 font-semibold mb-6">Performance Hebdomadaire</h3>
            <div className="space-y-4">
              {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, index) => {
                const value = [45, 52, 38, 61, 47, 23, 15][index];
                const percentage = (value / 70) * 100;
                return (
                  <div key={day} className="flex items-center gap-4">
                    <div className="w-12 text-callout font-medium text-secondary-label">{day}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-3 relative overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-1000 ease-apple"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="w-12 text-callout font-semibold text-label text-right">{value}</div>
                  </div>
                );
              })}
            </div>
          </AppleCard>
        </>
      ) : (
        <AppleCard variant="elevated" padding="lg" className="text-center">
          <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-title-3 font-semibold text-gray-600 mb-2">
            Données de Performance
          </h3>
          <p className="text-body text-gray-500">
            Les métriques de performance ne sont pas disponibles pour votre rôle.
          </p>
        </AppleCard>
      )}
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-title-1 font-bold">Paramètres</h2>

      {/* Appearance */}
      <AppleCard variant="elevated" padding="lg">
        <h3 className="text-title-3 font-semibold mb-6">Apparence</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              <span className="text-body">Mode Sombre</span>
            </div>
            <SegmentedControl
              options={[
                { label: 'Clair', value: 'light', icon: Sun },
                { label: 'Sombre', value: 'dark', icon: Moon }
              ]}
              value={isDarkMode ? 'dark' : 'light'}
              onChange={(value) => setIsDarkMode(value === 'dark')}
            />
          </div>
        </div>
      </AppleCard>

      {/* Notifications */}
      <AppleCard variant="elevated" padding="lg">
        <h3 className="text-title-3 font-semibold mb-6">Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5" />
              <div>
                <div className="text-body font-medium">Notifications Push</div>
                <div className="text-footnote text-secondary-label">
                  Recevoir des alertes en temps réel
                </div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </AppleCard>

      {/* Security */}
      <AppleCard variant="elevated" padding="lg">
        <h3 className="text-title-3 font-semibold mb-6">Sécurité</h3>
        <div className="space-y-4">
          <AppleButton variant="secondary" fullWidth>
            Changer le mot de passe
          </AppleButton>
          <AppleButton variant="secondary" fullWidth>
            Configurer l'authentification à deux facteurs
          </AppleButton>
          <AppleButton variant="secondary" fullWidth>
            Voir les sessions actives
          </AppleButton>
        </div>
      </AppleCard>

      {/* Privacy */}
      <AppleCard variant="elevated" padding="lg">
        <h3 className="text-title-3 font-semibold mb-6">Confidentialité</h3>
        <div className="space-y-4">
          <AppleButton variant="secondary" fullWidth>
            Télécharger mes données
          </AppleButton>
          <AppleButton variant="secondary" fullWidth>
            Gérer les permissions
          </AppleButton>
          <AppleButton variant="destructive" fullWidth>
            Supprimer mon compte
          </AppleButton>
        </div>
      </AppleCard>
    </div>
  );

  return (
    <div className="min-h-screen bg-secondary-background">
      {/* Header */}
      <div className="bg-background border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-title-2 font-bold">Mon Profil</h1>
              <p className="text-body text-secondary-label">
                Gérez vos informations personnelles et préférences
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-footnote text-secondary-label">En ligne</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-background border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <SegmentedControl
            options={sectionOptions}
            value={activeSection}
            onChange={setActiveSection}
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="animate-fade-in">
          {activeSection === 'overview' && renderOverview()}
          {activeSection === 'profile' && renderProfile()}
          {activeSection === 'performance' && renderPerformance()}
          {activeSection === 'settings' && renderSettings()}
        </div>
      </div>
    </div>
  );
};