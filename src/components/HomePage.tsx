import React from 'react';
import { Users, FileText, Clock, Package, QrCode, UserCheck, BarChart3, ArrowRight, Building2 } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';
import InstallPrompt from './pwa/InstallPrompt';

interface HomePageProps {
  onNavigateToLogin: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigateToLogin }) => {
  const { capabilities, addToHomeScreen } = usePWA();
  const [showInstallPrompt, setShowInstallPrompt] = React.useState(false);

  const features = [
    {
      icon: Users,
      title: "Gestion du Personnel",
      description: "Supervision du personnel de raffinage, équipes techniques et intervenants externes."
    },
    {
      icon: Package,
      title: "Logistique Industrielle",
      description: "Gestion des livraisons, équipements et approvisionnements de la raffinerie."
    },
    {
      icon: BarChart3,
      title: "Données Opérationnelles",
      description: "Suivi de la production, performance industrielle et indicateurs de sécurité."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Simplifié */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-2">
              <img 
                src="/Photoroom_20250703_164401.PNG" 
                alt="Logo SOGARA" 
                className="h-12 sm:h-14 w-auto"
              />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">SOGARA Access</h1>
                <p className="text-xs sm:text-sm text-gray-600">Gestion intégrée des flux</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Bouton d'installation PWA */}
              {!capabilities.isInstalled && !capabilities.isStandalone && (
                <button
                  onClick={() => setShowInstallPrompt(true)}
                  className="bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-1 text-sm"
                >
                  📱 Installer
                </button>
              )}
              
              <button
                onClick={onNavigateToLogin}
                className="bg-blue-800 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-900 transition-colors font-semibold flex items-center gap-2 min-h-[44px]"
              >
                Connexion
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Bannière Interne - Design Simplifiée */}
      <section className="relative text-white min-h-[400px] flex items-center">
        {/* Full width background image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/IMGaccueil.png" 
            alt="Fond DGI" 
            className="w-full h-full object-cover object-center"
          />
          {/* Overlay to ensure text readability */}
          <div className="absolute inset-0 bg-blue-900/35"></div>
        </div>

        <div className="relative z-10 w-full py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl bg-blue-950/50 p-4 sm:p-6 rounded-xl backdrop-blur-md border border-blue-700/40 shadow-2xl">
              <div className="mb-1">
                <span className="px-3 py-1 bg-blue-700/80 rounded-full text-xs font-medium text-white">SOGARA ACCESS</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3 leading-tight">
                Plateforme de gestion intégrée de la
                <span className="text-yellow-400"> raffinerie SOGARA</span>
              </h2>
              <p className="text-base sm:text-lg text-blue-100 mb-3 sm:mb-4 leading-relaxed">
                Système de gestion opérationnelle réservé au personnel de la Société Gabonaise de Raffinage 
                pour optimiser les opérations, la sécurité industrielle et l'accueil des intervenants.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onNavigateToLogin}
                  className="bg-yellow-500 text-blue-900 px-6 py-3 sm:px-8 sm:py-4 rounded-lg hover:bg-yellow-400 transition-colors font-bold text-base sm:text-lg flex items-center justify-center gap-2 min-h-[48px] shadow-lg"
                >
                  Accéder au Système
                  <ArrowRight className="h-4 sm:h-5 w-4 sm:w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Usage interne badge */}
        <div className="absolute bottom-4 right-4 z-10 bg-white rounded-lg p-3 shadow-xl hidden sm:block">
          <div className="flex items-center gap-1 font-bold text-gray-900 text-sm">
            <Building2 className="h-5 w-5 text-blue-600" />
            Usage interne uniquement
          </div>
        </div>
      </section>

      {/* Features Section - MOBILE GRID */}
      <section className="py-8 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2"></div>
          
          <div className="relative">
            <div className="text-center mb-6 sm:mb-8">
              <div className="relative mb-3">
                <span className="text-sm font-medium text-blue-800 bg-blue-50 px-3 py-1 rounded-full shadow-sm">Fonctionnalités</span>
                <h2 className="mt-1 text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-800 via-blue-700 to-blue-900 text-transparent bg-clip-text leading-tight">
                  Modules opérationnels SOGARA
                </h2>
                <p className="text-gray-600 mt-1 max-w-2xl mx-auto text-sm sm:text-base">
                  Outils intégrés pour une gestion optimale des opérations de raffinage et de la sécurité industrielle
                </p>
              </div>
              
              <div className="mt-2 flex items-center justify-center text-sm text-blue-600 lg:hidden">
                <svg className="w-5 h-5 mr-2 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                Faire défiler pour voir plus
              </div>
            </div>
            
            <div className="features-container grid grid-cols-1 md:grid-cols-3 gap-4 pb-3">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div 
                    key={index} 
                    className="bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
                  >
                    <div className="p-2 border-b border-gray-50">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl w-12 h-12 flex items-center justify-center mb-2 transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                          <Icon className="h-7 w-7 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors">{feature.title}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                    <div className="p-3 flex items-center justify-between">
                      <span className="text-xs text-blue-600 font-medium">Module SOGARA</span>
                      <span className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 transform group-hover:scale-110 transition-transform shadow-sm">
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Banner d'accès - MOBILE OPTIMISÉ */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-800 to-blue-900 text-white rounded-2xl overflow-hidden shadow-xl transform hover:scale-[1.02] transition-transform duration-300">
            <div className="p-6 sm:p-8 text-center">
              <span className="inline-block px-4 py-1 bg-blue-700/50 text-blue-100 font-medium rounded-full text-sm mb-2">Raffinerie SOGARA - Port-Gentil</span>
              <h2 className="text-2xl sm:text-4xl font-bold mb-3">
                Plateforme réservée aux collaborateurs SOGARA
              </h2>
              <p className="text-base sm:text-lg text-blue-100 mb-4 max-w-2xl mx-auto">
                Cette plateforme est un outil interne de gestion opérationnelle pour la Société Gabonaise de Raffinage, 
                unique raffinerie du Gabon. Gérez les activités industrielles, la sécurité, l'accueil des partenaires 
                et le suivi des opérations de raffinage depuis 1967.
              </p>
              <button
                onClick={onNavigateToLogin}
                className="bg-white text-blue-800 px-6 py-3 rounded-xl hover:bg-blue-50 transition-all font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 min-h-[48px] group"
              >
                Authentification Requise
                <ArrowRight className="h-5 w-5 ml-2 inline-block group-hover:translate-x-1 transition-transform" />
              </button>
              
              {/* Bouton d'installation PWA pour mobile */}
              {!capabilities.isInstalled && !capabilities.isStandalone && (
                <button
                  onClick={addToHomeScreen}
                  className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-all font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 min-h-[48px] mt-4 group"
                >
                  📱 Installer l'Application
                  <ArrowRight className="h-5 w-5 ml-2 inline-block group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer - MOBILE OPTIMISÉ */}
      <footer className="bg-gray-900 text-white py-4 sm:py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <img 
              src="/Photoroom_20250703_164401.PNG"
              alt="Logo SOGARA" 
              className="h-10 w-auto"
            />
            <h3 className="text-base sm:text-lg font-bold">SOGARA Access</h3>
          </div>
          <div className="text-xs sm:text-sm text-gray-400 mt-2">
            <p>© 2024 Société Gabonaise de Raffinage (SOGARA) - République Gabonaise</p>
            <p className="mt-1 text-gray-500 text-xs">Unique raffinerie du Gabon - Opérationnelle depuis 1967 - Port-Gentil</p>
            <p className="mt-2 text-gray-400 text-xs">Système de gestion développé pour SOGARA | © 2024 Tous droits réservés</p>
          </div>
        </div>
      </footer>
      
      {/* Prompt d'installation PWA */}
      {showInstallPrompt && (
        <InstallPrompt onClose={() => setShowInstallPrompt(false)} />
      )}
    </div>
  );
};