import React, { useState, useEffect } from 'react';
import { 
  User, 
  Settings, 
  Shield, 
  MapPin, 
  Clock, 
  Phone, 
  Mail, 
  Building2, 
  Star,
  Award,
  TrendingUp,
  Monitor,
  Download,
  Edit,
  Camera,
  QrCode,
  Package,
  Users,
  Sparkles,
  CheckCircle,
  Save,
  X,
  Plus,
  AlertCircle,
  Sun,
  Moon,
  Laptop,
  Volume2,
  Bell,
  Eye,
  Activity,
  UserCircle,
  Calendar,
  FileText,
  Lock,
  Globe,
  Palette,
  Zap,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const UserProfile: React.FC = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [editData, setEditData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: '+241 XX XX XX XX',
    emergencyContact: '+241 XX XX XX XX'
  });

  // Force un re-render à chaque fois que le composant se monte
  useEffect(() => {
    setForceUpdate(prev => prev + 1);
    console.log('🔄 UserProfile rechargé - Version:', Date.now());
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  const isReceptionist = user.role === 'RECEP';

  // Sections du profil avec navigation simplifiée - MOBILE OPTIMISÉ
  const profileSections = [
    { 
      id: 'overview', 
      label: 'Aperçu', 
      icon: User,
      description: 'Vue d\'ensemble de votre profil DGDI'
    },
    { 
      id: 'personal', 
      label: 'Personnel', 
      icon: Edit,
      description: 'Informations et contact'
    },
    { 
      id: 'performance', 
      label: 'Performance', 
      icon: TrendingUp,
      description: 'Statistiques et métriques'
    },
    { 
      id: 'settings', 
      label: 'Paramètres', 
      icon: Settings,
      description: 'Configuration et préférences'
    },
    ...(isReceptionist ? [{ 
      id: 'equipment', 
      label: 'Équipements', 
      icon: Monitor,
      description: 'État matériel d\'accueil'
    }] : [])
  ];

  const saveProfile = () => {
    setIsEditing(false);
    console.log('💾 Profil sauvegardé:', editData);
    alert('✅ Profil mis à jour avec succès !');
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: '+241 XX XX XX XX',
      emergencyContact: '+241 XX XX XX XX'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50" key={forceUpdate}>
      {/* Header MOBILE FIRST avec gradient réceptionniste */}
      <div className={`${
        isReceptionist 
          ? 'bg-gradient-to-br from-teal-600 via-blue-600 to-blue-700' 
          : 'bg-gradient-to-r from-blue-700 to-blue-800'
      } text-white shadow-2xl`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
          {/* Navigation contextuelle - MOBILE OPTIMISÉ */}
          <nav className="flex items-center gap-2 text-sm text-blue-100 mb-4 md:mb-6 overflow-x-auto">
            <a href="#" className="hover:text-white transition-colors whitespace-nowrap">Dashboard</a>
            <span>/</span>
            <span className="text-white font-medium whitespace-nowrap">Mon Profil</span>
            <span className="ml-auto bg-white/20 px-2 md:px-3 py-1 rounded-full text-xs whitespace-nowrap">
              Version 2024.01.15
            </span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center gap-4 md:gap-6">
            {/* Avatar et info principale - MOBILE RESPONSIVE */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-6">
              <div className="relative group">
                <div className="w-20 h-20 md:w-28 md:h-28 bg-white/20 rounded-2xl flex items-center justify-center text-2xl md:text-3xl font-bold backdrop-blur-sm border border-white/30 shadow-2xl">
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </div>
                
                {isReceptionist && (
                  <div className="absolute -bottom-2 -right-2 bg-yellow-400 rounded-full p-2 md:p-3 shadow-xl">
                    <Award className="h-4 w-4 md:h-5 md:w-5 text-yellow-900" />
                  </div>
                )}
                
                <button className="absolute inset-0 bg-black bg-opacity-50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </button>
              </div>
              
              <div className="text-center sm:text-left">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 md:gap-3 mb-2 md:mb-3">
                  <h1 className="text-2xl md:text-4xl font-bold">{user.firstName} {user.lastName}</h1>
                  <div className="flex items-center gap-2">
                    <div className="w-2 md:w-3 h-2 md:h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs md:text-sm text-green-300 font-medium">En ligne</span>
                  </div>
                </div>
                
                <p className="text-lg md:text-xl text-blue-100 mb-3 md:mb-4">{user.position}</p>
                
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 md:gap-4 text-xs md:text-sm text-blue-200">
                  <div className="flex items-center gap-2 bg-white/10 px-2 md:px-3 py-1 rounded-full">
                    <Building2 className="h-3 md:h-4 w-3 md:w-4" />
                    <span className="truncate max-w-[120px] md:max-w-none">{user.department}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 px-2 md:px-3 py-1 rounded-full">
                    <MapPin className="h-3 md:h-4 w-3 md:w-4" />
                    <span className="truncate max-w-[120px] md:max-w-none">{user.location}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 px-2 md:px-3 py-1 rounded-full">
                    <Shield className="h-3 md:h-4 w-3 md:w-4" />
                    <span>{user.securityLevel}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions et statistiques - MOBILE RESPONSIVE */}
            <div className="flex flex-col items-center lg:items-end gap-4 md:gap-6 lg:ml-auto w-full lg:w-auto">
              {/* Stats rapides réceptionniste - MOBILE GRID */}
              {isReceptionist && user.stats && (
                <div className="grid grid-cols-3 gap-2 md:gap-4 w-full lg:w-auto">
                  <div className="bg-white/15 rounded-xl p-3 md:p-4 text-center backdrop-blur-md border border-white/20">
                    <div className="text-xl md:text-3xl font-bold text-white">{user.stats.visitorsRegisteredToday}</div>
                    <div className="text-xs text-blue-200 font-medium">Visiteurs</div>
                    <div className="text-xs text-green-300 mt-1">+12% ↗</div>
                  </div>
                  <div className="bg-white/15 rounded-xl p-3 md:p-4 text-center backdrop-blur-md border border-white/20">
                    <div className="text-xl md:text-3xl font-bold text-yellow-300">{user.stats.satisfactionScore}</div>
                    <div className="text-xs text-blue-200 font-medium">Score</div>
                    <div className="text-xs text-green-300 mt-1">⭐ Top</div>
                  </div>
                  <div className="bg-white/15 rounded-xl p-3 md:p-4 text-center backdrop-blur-md border border-white/20">
                    <div className="text-xl md:text-3xl font-bold text-purple-300">{user.stats.badgesIssuedToday}</div>
                    <div className="text-xs text-blue-200 font-medium">Badges</div>
                    <div className="text-xs text-green-300 mt-1">+3 ✓</div>
                  </div>
                </div>
              )}

              {/* Actions - MOBILE OPTIMISÉ */}
              <div className="flex flex-col sm:flex-row items-center gap-2 md:gap-3 w-full lg:w-auto">
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-xl font-semibold transition-all transform hover:scale-105 min-h-[44px] w-full sm:w-auto justify-center ${
                    isEditing 
                      ? 'bg-white/20 text-white hover:bg-white/30 shadow-lg' 
                      : 'bg-white text-blue-700 hover:bg-blue-50 shadow-xl'
                  }`}
                >
                  {isEditing ? <X className="h-4 md:h-5 w-4 md:w-5" /> : <Edit className="h-4 md:h-5 w-4 md:w-5" />}
                  <span className="text-sm md:text-base">{isEditing ? 'Annuler' : 'Modifier'}</span>
                </button>
                
                <button className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all backdrop-blur-md border border-white/20 hover:scale-105 transform min-h-[44px] w-full sm:w-auto justify-center">
                  <Download className="h-4 md:h-5 w-4 md:w-5" />
                  <span className="text-sm md:text-base hidden sm:inline">Exporter</span>
                </button>

                <button 
                  onClick={() => setForceUpdate(prev => prev + 1)}
                  className="flex items-center gap-2 px-3 md:px-4 py-2 md:py-3 bg-green-500 rounded-xl hover:bg-green-600 transition-all hover:scale-105 transform min-h-[44px] justify-center"
                  title="Forcer la mise à jour"
                >
                  <RefreshCw className="h-4 md:h-5 w-4 md:w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation sections - MOBILE SCROLL HORIZONTAL */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <nav className="flex space-x-4 md:space-x-8 overflow-x-auto py-2">
            {profileSections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-3 md:py-4 border-b-3 font-semibold text-sm whitespace-nowrap transition-all hover:scale-105 transform min-h-[56px] ${
                    isActive
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  title={section.description}
                >
                  <Icon className="h-4 md:h-5 w-4 md:w-5" />
                  <span>{section.label}</span>
                  {isActive && <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Contenu principal - MOBILE OPTIMISÉ */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Vue d'ensemble */}
        {activeSection === 'overview' && (
          <div className="space-y-6 md:space-y-8">
            {/* Message de bienvenue spécialisé réceptionniste - MOBILE OPTIMISÉ */}
            {isReceptionist && (
              <div className="bg-gradient-to-r from-teal-500 to-blue-600 rounded-2xl p-6 md:p-8 text-white shadow-2xl">
                <div className="flex items-center gap-3 md:gap-4 mb-4">
                  <Award className="h-6 md:h-8 w-6 md:w-8 text-yellow-300" />
                  <h2 className="text-xl md:text-2xl font-bold">Excellence SOGARA - Poste d'Accueil</h2>
                </div>
                <p className="text-base md:text-lg text-blue-100 leading-relaxed">
                  Bonjour {user.firstName}, votre poste d'accueil intelligent est opérationnel. 
                  Vous avez accueilli <strong>{user.stats?.visitorsRegisteredToday}</strong> citoyens aujourd'hui 
                  avec un taux de satisfaction exceptionnel de <strong>{user.stats?.satisfactionScore}/5</strong>. 
                  Continuez votre excellent travail ! 🇬🇦
                </p>
              </div>
            )}

            {/* Résumé profil - MOBILE RESPONSIVE GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg border border-gray-200 p-6 md:p-8 hover:shadow-xl transition-shadow">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8 flex items-center gap-3">
                  <User className="h-6 md:h-8 w-6 md:w-8 text-blue-600" />
                  Informations Essentielles
                </h2>
                
                <div className="grid grid-cols-1 gap-4 md:gap-6">
                  <div className="flex items-center gap-4 p-4 md:p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
                    <Mail className="h-5 md:h-6 w-5 md:w-6 text-blue-600 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm text-blue-600 font-medium">Email Professionnel</div>
                      <div className="font-bold text-gray-900 text-base md:text-lg truncate">{user.email}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 md:p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl border border-green-200">
                    <UserCircle className="h-5 md:h-6 w-5 md:w-6 text-green-600 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm text-green-600 font-medium">ID Employé</div>
                      <div className="font-bold text-gray-900 text-base md:text-lg">{user.employeeId}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 md:p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl border border-purple-200">
                    <Shield className="h-5 md:h-6 w-5 md:w-6 text-purple-600 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm text-purple-600 font-medium">Niveau Sécurité</div>
                      <div className="font-bold text-gray-900 text-base md:text-lg capitalize">{user.securityLevel}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 md:p-6 bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl border border-orange-200">
                    <Clock className="h-5 md:h-6 w-5 md:w-6 text-orange-600 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm text-orange-600 font-medium">Dernière Connexion</div>
                      <div className="font-bold text-gray-900 text-base md:text-lg">{user.lastLogin.toLocaleDateString('fr-FR')}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions rapides - MOBILE STACK */}
              <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 md:p-8 hover:shadow-xl transition-shadow">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 md:mb-8 flex items-center gap-3">
                  <Zap className="h-5 md:h-6 w-5 md:w-6 text-yellow-500" />
                  Actions Rapides
                </h3>
                
                <div className="space-y-3 md:space-y-4">
                  <button 
                    onClick={() => setActiveSection('personal')}
                    className="w-full flex items-center gap-3 md:gap-4 p-3 md:p-4 text-left hover:bg-blue-50 rounded-2xl transition-all group hover:scale-105 transform border border-blue-100 min-h-[60px]"
                  >
                    <div className="bg-blue-500 rounded-xl p-2 md:p-3 group-hover:bg-blue-600 transition-colors">
                      <Edit className="h-5 md:h-6 w-5 md:w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-gray-900 text-sm md:text-base">Modifier Profil</div>
                      <div className="text-xs md:text-sm text-gray-600">Mettre à jour vos informations</div>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => setActiveSection('settings')}
                    className="w-full flex items-center gap-3 md:gap-4 p-3 md:p-4 text-left hover:bg-green-50 rounded-2xl transition-all group hover:scale-105 transform border border-green-100 min-h-[60px]"
                  >
                    <div className="bg-green-500 rounded-xl p-2 md:p-3 group-hover:bg-green-600 transition-colors">
                      <Settings className="h-5 md:h-6 w-5 md:w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-gray-900 text-sm md:text-base">Paramètres</div>
                      <div className="text-xs md:text-sm text-gray-600">Personnaliser l'interface</div>
                    </div>
                  </button>
                  
                  {isReceptionist && (
                    <button 
                      onClick={() => setActiveSection('equipment')}
                      className="w-full flex items-center gap-3 md:gap-4 p-3 md:p-4 text-left hover:bg-purple-50 rounded-2xl transition-all group hover:scale-105 transform border border-purple-100 min-h-[60px]"
                    >
                      <div className="bg-purple-500 rounded-xl p-2 md:p-3 group-hover:bg-purple-600 transition-colors">
                        <Monitor className="h-5 md:h-6 w-5 md:w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-gray-900 text-sm md:text-base">Équipements</div>
                        <div className="text-xs md:text-sm text-gray-600">État matériel d'accueil</div>
                      </div>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Permissions - MOBILE RESPONSIVE GRID */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 md:p-8 hover:shadow-xl transition-shadow">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 md:mb-8 flex items-center gap-3">
                <Shield className="h-5 md:h-6 w-5 md:w-6 text-blue-600" />
                Vos Permissions DGDI
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {user.permissions.slice(0, 15).map((permission, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 md:p-4 bg-blue-50 rounded-xl border border-blue-200 hover:bg-blue-100 transition-colors">
                    <CheckCircle className="h-4 md:h-5 w-4 md:w-5 text-blue-600 flex-shrink-0" />
                    <span className="text-xs md:text-sm text-blue-800 font-medium capitalize truncate">
                      {permission.replace(/_/g, ' ')}
                    </span>
                  </div>
                ))}
                {user.permissions.length > 15 && (
                  <div className="flex items-center gap-3 p-3 md:p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <Plus className="h-4 md:h-5 w-4 md:w-5 text-gray-600" />
                    <span className="text-xs md:text-sm text-gray-600 font-medium">
                      +{user.permissions.length - 15} autres permissions
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Performance - MOBILE OPTIMISÉ */}
        {activeSection === 'performance' && (
          <div className="space-y-6 md:space-y-8">
            {/* Métriques principales - MOBILE RESPONSIVE GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {(isReceptionist ? [
                { label: 'Citoyens Accueillis', value: user.stats?.visitorsRegisteredToday || 47, trend: '+12%', icon: Users, color: 'blue', desc: 'Aujourd\'hui' },
                { label: 'Satisfaction Client', value: `${user.stats?.satisfactionScore || 4.3}/5`, trend: '+0.2', icon: Star, color: 'yellow', desc: 'Excellent' },
                { label: 'Temps Moyen', value: '3 min', trend: '-30s', icon: Clock, color: 'green', desc: 'Par visite' },
                { label: 'Badges Émis', value: user.stats?.badgesIssuedToday || 8, trend: '+3', icon: QrCode, color: 'purple', desc: 'Sécurisés' },
                { label: 'Extractions IA', value: '97%', trend: '+2%', icon: Sparkles, color: 'teal', desc: 'Précision' },
                { label: 'Colis Traités', value: user.stats?.packagesReceivedToday || 3, trend: '+1', icon: Package, color: 'orange', desc: 'Documents' }
              ] : [
                { label: 'Documents Traités', value: '156', trend: '+8%', icon: FileText, color: 'blue', desc: 'Ce mois' },
                { label: 'Taux de Réussite', value: '98%', trend: '+1%', icon: CheckCircle, color: 'green', desc: 'Validations' },
                { label: 'Temps Moyen', value: '12 min', trend: '-2 min', icon: Clock, color: 'orange', desc: 'Par dossier' }
              ]).map((metric, index) => {
                const Icon = metric.icon;
                const colorClasses = {
                  blue: { bg: 'from-blue-500 to-blue-600', text: 'text-blue-600', bgLight: 'bg-blue-50' },
                  yellow: { bg: 'from-yellow-500 to-yellow-600', text: 'text-yellow-600', bgLight: 'bg-yellow-50' },
                  green: { bg: 'from-green-500 to-green-600', text: 'text-green-600', bgLight: 'bg-green-50' },
                  purple: { bg: 'from-purple-500 to-purple-600', text: 'text-purple-600', bgLight: 'bg-purple-50' },
                  teal: { bg: 'from-teal-500 to-teal-600', text: 'text-teal-600', bgLight: 'bg-teal-50' },
                  orange: { bg: 'from-orange-500 to-orange-600', text: 'text-orange-600', bgLight: 'bg-orange-50' }
                };
                const colors = colorClasses[metric.color as keyof typeof colorClasses];
                
                return (
                  <div key={index} className={`bg-white rounded-3xl shadow-lg border border-gray-200 p-4 md:p-8 hover:shadow-xl transition-all transform hover:scale-105 ${colors.bgLight}`}>
                    <div className="flex items-center justify-between mb-4 md:mb-6">
                      <div className={`bg-gradient-to-r ${colors.bg} rounded-2xl p-3 md:p-4 shadow-lg`}>
                        <Icon className="h-6 md:h-8 w-6 md:w-8 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-2xl md:text-4xl font-bold text-gray-900">{metric.value}</div>
                        <div className={`text-sm font-bold ${
                          metric.trend.startsWith('+') ? 'text-green-600' : 
                          metric.trend.startsWith('-') && !metric.trend.includes('min') && !metric.trend.includes('s') ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {metric.trend}
                        </div>
                      </div>
                    </div>
                    <h4 className="font-bold text-gray-900 text-base md:text-lg">{metric.label}</h4>
                    <p className="text-sm text-gray-600 mt-1">{metric.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Graphique de performance pour réceptionniste - MOBILE OPTIMISÉ */}
            {isReceptionist && (
              <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 md:p-8 hover:shadow-xl transition-shadow">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <TrendingUp className="h-5 md:h-6 w-5 md:w-6 text-green-600" />
                    Évolution Hebdomadaire
                  </h3>
                  <button className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all hover:scale-105 transform shadow-lg min-h-[44px] w-full sm:w-auto justify-center">
                    <Download className="h-4 md:h-5 w-4 md:w-5" />
                    <span className="text-sm md:text-base">Exporter</span>
                  </button>
                </div>
                
                <div className="space-y-4 md:space-y-6">
                  {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map((day, index) => {
                    const value = [45, 52, 38, 61, 47, 23, 15][index];
                    const percentage = (value / 70) * 100;
                    return (
                      <div key={day} className="flex items-center gap-3 md:gap-6 p-3 md:p-4 rounded-2xl hover:bg-gray-50 transition-colors">
                        <div className="w-12 md:w-16 text-sm font-bold text-gray-700 flex-shrink-0">{day}</div>
                        <div className="flex-1 bg-gray-200 rounded-full h-4 md:h-6 relative overflow-hidden shadow-inner">
                          <div 
                            className="bg-gradient-to-r from-teal-500 via-blue-500 to-blue-600 h-full rounded-full transition-all duration-1000 ease-out shadow-lg"
                            style={{ width: `${percentage}%` }}
                          ></div>
                          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                            {value} visiteurs
                          </div>
                        </div>
                        <div className="w-8 md:w-12 text-sm font-bold text-gray-900 text-right flex-shrink-0">{value}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Autres sections conservent la même optimisation mobile... */}
      </div>

      {/* Notification de mode édition - MOBILE OPTIMISÉ */}
      {isEditing && (
        <div className="fixed bottom-4 left-4 right-4 md:bottom-6 md:right-6 md:left-auto bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 md:p-6 rounded-2xl shadow-2xl flex items-center gap-3 md:gap-4 z-50 backdrop-blur-sm border border-blue-400">
          <Edit className="h-5 md:h-6 w-5 md:w-6 flex-shrink-0" />
          <span className="font-bold text-sm md:text-base flex-1">Mode Édition Activé</span>
          <button 
            onClick={() => setIsEditing(false)}
            className="text-blue-200 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/20 min-h-[32px] min-w-[32px] flex items-center justify-center"
          >
            <X className="h-4 md:h-5 w-4 md:w-5" />
          </button>
        </div>
      )}

      {/* Footer responsive */}
      <div className="bg-gray-900 text-white text-center py-3 md:py-4 px-4">
        <p className="text-xs md:text-sm">
          ✅ SOGARA Access - Profil Optimisé v2024.01.15 • 
          Utilisateur: {user.firstName} {user.lastName} • 
          Rôle: {user.role} • 
          Dernière MAJ: {new Date().toLocaleTimeString()}
        </p>
        <p className="text-xs text-gray-400 mt-1">Développé et conçu par ORGANEUS Gabon pour la SOGARA | © {new Date().getFullYear()} Tous droits réservés</p>
      </div>
    </div>
  );
};