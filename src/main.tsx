import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Enregistrement du Service Worker
const isUnsupportedEnvironment = window.location.hostname.includes('stackblitz') || 
                                 window.location.hostname.includes('webcontainer') ||
                                 window.location.port === '5173' ||
                                 window.location.hostname === 'localhost';

if ('serviceWorker' in navigator && !isUnsupportedEnvironment) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then(registration => {
        console.log('✅ Service Worker registered successfully:', registration);
      })
      .catch(error => {
        console.log('ℹ️ Service Worker registration skipped:', error.message);
      });
  });
} else {
  console.log('🔧 Service Worker registration skipped - unsupported environment or not available');
}

// Initialisation PWA
console.log('🚀 SOGARA Access PWA initializing...');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
