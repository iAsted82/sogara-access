import { useState, useEffect } from 'react';

interface PWACapabilities {
  isInstalled: boolean;
  isStandalone: boolean;
  canInstall: boolean;
}

export const usePWA = () => {
  const [capabilities, setCapabilities] = useState<PWACapabilities>({
    isInstalled: false,
    isStandalone: false,
    canInstall: false
  });

  useEffect(() => {
    // Detect if app is installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInstalled = (window.navigator as any).standalone === true || isStandalone;
    
    setCapabilities({
      isInstalled,
      isStandalone,
      canInstall: !isInstalled
    });
  }, []);

  const addToHomeScreen = () => {
    // Basic implementation
    console.log('Add to home screen functionality');
  };

  return {
    capabilities,
    addToHomeScreen
  };
};