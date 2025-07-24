import React, { useState, useEffect, useCallback } from 'react';
import { HomePage } from './components/HomePage';
import { LoginScreen } from './components/LoginScreen';
import { Dashboard } from './components/Dashboard';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from './components/ui/Toaster';
import PWAManager from './components/pwa/PWAManager';
import { setupPWAEventListeners } from './utils/pwaUtils';

function AppContent() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState<'home' | 'login'>('home');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [forceUpdate, setForceUpdate] = useState(0);

  // Détection de l'appareil mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Écouteur d'événements pour forcer le rechargement de l'application
  useEffect(() => {
    const handleForceUpdate = () => {
      setForceUpdate(prev => prev + 1);
      console.log('🔄 Application rechargée');
    };
    
    window.addEventListener('force-update', handleForceUpdate);
    
    // Initialiser les événements PWA
    setupPWAEventListeners();
    
    return () => {
      window.removeEventListener('force-update', handleForceUpdate);
    };
  }, []);

  // Gestion de la navigation par hash dans l'URL
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash) {
        const event = new CustomEvent('navigate-module', {
          detail: { module: hash }
        });
        window.dispatchEvent(event);
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);
    
    // Check initial hash
    if (window.location.hash) {
      handleHashChange();
    }
    
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigateToLogin = () => {
    setCurrentPage('login');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
  };

  // Créer le contexte de mise à jour pour les composants
  const updateContext = `app-${forceUpdate}-${user?.role || 'guest'}`;

  if (user) {
    return (
      <div className="min-h-screen bg-gray-50" key={updateContext} data-app-state={updateContext}>
        <Dashboard />
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {currentPage === 'home' ? (
        <HomePage onNavigateToLogin={handleNavigateToLogin} />
      ) : (
        <LoginScreen onBackToHome={handleBackToHome} />
      )}
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <PWAManager>
        <AppContent />
      </PWAManager>
    </AuthProvider>
  );
}

export default App;