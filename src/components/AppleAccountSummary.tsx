import React from 'react';
import { 
  User, 
  Shield, 
  Calendar, 
  Clock, 
  Bell, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Building2,
  MapPin,
  Mail,
  Phone
} from 'lucide-react';
import { AppleCard } from './ui/AppleCard';
import { AppleBadge } from './ui/AppleBadge';
import { useAuth } from '../contexts/AuthContext';

export const AppleAccountSummary: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  return (
    <div className="space-y-8">
      {/* Hero Card with User Info */}
      <AppleCard variant="elevated" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="p-8 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-white/20 blur-3xl"></div>
            <div className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full bg-white/20 blur-3xl"></div>
          </div>
          
          {/* Content */}
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative">
              <div className="w-28 h-28 bg-white/20 rounded-3xl flex items-center justify-center text-4xl font-bold backdrop-blur-sm border border-white/30 shadow-2xl">
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </div>
              
              {user.role === 'ADMIN' && (
                <div className="absolute -bottom-2 -right-2 bg-red-500 rounded-full p-2">
                  <Shield className="h-5 w-5 text-white" />
                </div>
              )}
              
              {user.role === 'RECEP' && (
                <div className="absolute -bottom-2 -right-2 bg-yellow-500 rounded-full p-2">
                  <Bell className="h-5 w-5 text-yellow-900" />
                </div>
              )}
            </div>
            
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {user.firstName} {user.lastName}
              </h1>
              <div className="text-xl text-white/80 mb-4">{user.position}</div>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <div className="bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="h-4 w-4" />
                    {user.department}
                  </div>
                </div>
                <div className="bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4" />
                    {user.location}
                  </div>
                </div>
                <div className="bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4" />
                    {user.securityLevel}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Status Indicator */}
            <div className="md:self-start mt-2">
              <div className="bg-white/10 rounded-lg px-4 py-2 backdrop-blur-sm border border-white/20">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span className="flex h-2.5 w-2.5 bg-green-500 rounded-full animate-pulse"></span>
                  Actif
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppleCard>
      
      {/* Contact Information Card */}
      <AppleCard variant="elevated">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-5">Informations de Contact</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <div className="mt-1 mr-4 p-3 bg-blue-100 rounded-xl">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Email Professionnel</div>
                <div className="text-lg font-medium">{user.email}</div>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="mt-1 mr-4 p-3 bg-green-100 rounded-xl">
                <Phone className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Téléphone</div>
                <div className="text-lg font-medium">+241 XX XX XX XX</div>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="mt-1 mr-4 p-3 bg-purple-100 rounded-xl">
                <Building2 className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Département</div>
                <div className="text-lg font-medium">{user.department}</div>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="mt-1 mr-4 p-3 bg-orange-100 rounded-xl">
                <MapPin className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Localisation</div>
                <div className="text-lg font-medium">{user.location}</div>
              </div>
            </div>
          </div>
        </div>
      </AppleCard>
      
      {/* Account Activity Card */}
      <AppleCard variant="elevated">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-5">Activité Récente</h2>
          
          <div className="space-y-4">
            {[
              { 
                icon: User, 
                title: 'Connexion réussie', 
                timestamp: 'Aujourd\'hui, 10:45', 
                status: 'success', 
                details: 'Chrome sur MacOS' 
              },
              { 
                icon: Shield, 
                title: 'Modification du mot de passe', 
                timestamp: 'Il y a 3 jours', 
                status: 'success',
                details: 'Firefox sur Windows'
              },
              { 
                icon: Bell, 
                title: 'Préférences de notification mises à jour', 
                timestamp: 'Il y a 1 semaine', 
                status: 'info',
                details: 'Safari sur iOS'
              },
              { 
                icon: User, 
                title: 'Tentative de connexion échouée', 
                timestamp: 'Il y a 2 semaines', 
                status: 'error',
                details: 'Adresse IP inconnue'
              }
            ].map((activity, index) => (
              <div key={index} className="flex items-start p-3 hover:bg-gray-50 rounded-xl transition-colors">
                <div className="mr-4 p-2 rounded-full bg-gray-100">
                  {activity.status === 'success' && <CheckCircle className="h-5 w-5 text-green-600" />}
                  {activity.status === 'error' && <XCircle className="h-5 w-5 text-red-600" />}
                  {activity.status === 'info' && <activity.icon className="h-5 w-5 text-blue-600" />}
                  {activity.status === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-base font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-500">{activity.timestamp}</p>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{activity.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AppleCard>
      
      {/* User Stats - Only for Receptionist */}
      {user.role === 'RECEP' && user.stats && (
        <AppleCard variant="elevated">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-5">Mes Statistiques</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-xl p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <AppleBadge variant="info">Aujourd'hui</AppleBadge>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{user.stats.visitorsRegisteredToday}</h3>
                <p className="text-sm text-gray-600">Visiteurs Accueillis</p>
                <p className="text-xs text-green-600 font-medium mt-2">+12% vs. hier</p>
              </div>
              
              <div className="bg-green-50 rounded-xl p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <AppleBadge variant="success">Excellent</AppleBadge>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{user.stats.satisfactionScore}/5</h3>
                <p className="text-sm text-gray-600">Score Satisfaction</p>
                <p className="text-xs text-green-600 font-medium mt-2">+0.2 vs. semaine dernière</p>
              </div>
              
              <div className="bg-purple-50 rounded-xl p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <AppleBadge variant="info">Moyenne</AppleBadge>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{user.stats.averageCheckInTime / 60} min</h3>
                <p className="text-sm text-gray-600">Temps Traitement</p>
                <p className="text-xs text-green-600 font-medium mt-2">-30s vs. objectif</p>
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                Voir toutes les statistiques
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        </AppleCard>
      )}
      
      {/* Upcoming Activities */}
      <AppleCard variant="elevated">
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-semibold">Activités à Venir</h2>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          
          {/* No activities placeholder */}
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Calendar className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700">Aucune activité planifiée</h3>
            <p className="text-sm text-gray-500 mt-1 max-w-md">
              Vous n'avez aucune activité planifiée pour le moment.
            </p>
          </div>
        </div>
      </AppleCard>
    </div>
  );
};