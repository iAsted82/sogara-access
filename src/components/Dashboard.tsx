import React, { useState, useEffect } from 'react';
import { Header } from './layout/Header';
import { Sidebar } from './layout/Sidebar';
import { MainContent } from './layout/MainContent';

export const Dashboard: React.FC = () => {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false); // Fermé par défaut sur mobile
  const [forceUpdate, setForceUpdate] = useState(0);

  // Écouteur d'événements pour la navigation entre modules
  useEffect(() => {
    const handleNavigateModule = (e: CustomEvent) => {
      const { module, section } = e.detail;
      console.log('🧭 Navigation vers module:', module, section ? `(section: ${section})` : '');
      
      if (module) {
        setActiveModule(module);
        
        // Fermer le sidebar sur mobile
        if (window.innerWidth < 1024) {
          setSidebarOpen(false);
        }
      }
    };
    
    // Écouter l'événement personnalisé
    window.addEventListener('navigate-module', handleNavigateModule as EventListener);
    
    // Écouter les changements de hash dans l'URL
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash && hash !== activeModule) {
        setActiveModule(hash);
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);
    
    // Écouter les événements de mise à jour forcée
    const handleForceUpdate = () => {
      setForceUpdate(prev => prev + 1);
      console.log('🔄 Dashboard rechargé');
    };
    
    window.addEventListener('force-update', handleForceUpdate);
    
    // Vérification initiale du hash
    if (window.location.hash) {
      const initialHash = window.location.hash.slice(1);
      if (initialHash && initialHash !== activeModule) {
        setActiveModule(initialHash);
      }
    }
    
    return () => {
      window.removeEventListener('navigate-module', handleNavigateModule as EventListener);
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('force-update', handleForceUpdate);
    };
  }, [activeModule]);
  const handleNavigateToProfile = () => {
    console.log('🎯 Navigation vers profil...');
    setActiveModule('profile');
  };

  const handleModuleChange = (module: string) => {
    console.log('🔄 Changement de module vers:', module);
    setActiveModule(module);
    // Fermer le sidebar sur mobile après sélection
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div 
      className="min-h-screen bg-gray-50 flex flex-col" 
      key={`dashboard-${forceUpdate}`}
      data-component="dashboard"
    >
      <Header 
        onMenuClick={handleMenuClick} 
        onNavigateToProfile={handleNavigateToProfile}
      />
      
      <div className="flex flex-1 relative">
        {/* Overlay pour mobile quand sidebar ouvert */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar avec positionnement mobile */}
        <div className={`
          fixed lg:relative top-0 left-0 h-full z-50 lg:z-auto
          transform transition-transform duration-300 ease-in-out lg:transform-none
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <Sidebar 
            isOpen={sidebarOpen || window.innerWidth >= 1024} 
            activeModule={activeModule}
            onModuleChange={handleModuleChange}
          />
        </div>
        
        {/* Contenu principal avec margin responsive */}
        <div className={`
          flex-1 transition-all duration-300 bg-gray-50 min-h-screen overflow-auto
          ${sidebarOpen && window.innerWidth >= 1024 ? 'lg:ml-0' : ''}
        `}>
          <MainContent 
            activeModule={activeModule}
            sidebarOpen={sidebarOpen && window.innerWidth >= 1024}
          />
        </div>
      </div>
      {/* Footer */}
      <div className="mt-auto text-center text-xs text-gray-500 py-3 border-t border-gray-200">
        <p>Développé et conçu par ORGANEUS Gabon pour la SOGARA | © {new Date().getFullYear()} Tous droits réservés</p>
      </div>
    </div>
  );
};