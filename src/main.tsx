import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Enregistrement du Service Worker
const isStackBlitz = window.location.hostname.includes('stackblitz') || 
                    window.location.hostname.includes('webcontainer') ||
                    window.location.hostname.includes('localhost');

if ('serviceWorker' in navigator && !isStackBlitz) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then(registration => {
        console.log('✅ Service Worker registered successfully:', registration);
      })
      .catch(error => {
        console.error('❌ Service Worker registration failed:', error);
      });
  });
} else if (isStackBlitz) {
  console.log('🔧 Service Workers not supported in this environment, skipping registration');
}

// Initialisation PWA
console.log('🚀 SOGARA Access PWA initializing...');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
