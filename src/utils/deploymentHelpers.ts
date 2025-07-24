// Utilitaires pour gérer le déploiement et la mise à jour des composants

/**
 * Force un re-render global en mettant à jour un timestamp dans le localStorage
 * et en déclenchant un événement personnalisé
 * @returns Timestamp de la mise à jour
 */
export const forceComponentUpdate = (): number => {
  // Générer un timestamp unique
  const timestamp = Date.now();
  
  // Stocker le timestamp dans le localStorage pour persister entre les rechargements
  localStorage.setItem('last_update_timestamp', timestamp.toString());
  
  // Déclencher un événement personnalisé pour notifier les composants
  const updateEvent = new CustomEvent('force-update', { 
    detail: { timestamp } 
  });
  window.dispatchEvent(updateEvent);
  
  // Forcer un rechargement de certains composants spécifiques
  if (typeof document !== 'undefined') {
    // Mettre à jour les attributs data-timestamp pour forcer le rechargement
    document.querySelectorAll('[data-component]').forEach(element => {
      element.setAttribute('data-timestamp', timestamp.toString());
      element.setAttribute('data-updated', 'true');
    });
    
    // Mise à jour spécifique des composants réceptionniste
    document.querySelectorAll('[data-receptionist-component]').forEach(element => {
      element.setAttribute('data-timestamp', timestamp.toString());
      element.setAttribute('data-updated', 'true');
      
      // Générer un événement de clic simulé pour réinitialiser les handlers
      if (element instanceof HTMLElement) {
        try {
          // Cloner et remplacer l'élément pour réinitialiser les handlers
          const clone = element.cloneNode(true);
          if (element.parentNode) {
            element.parentNode.replaceChild(clone, element);
          }
        } catch (error) {
          console.warn('Erreur lors de la réinitialisation du composant:', error);
        }
      }
    });
    
    // Mise à jour spécifique des boutons d'action rapide
    document.querySelectorAll('[data-quick-action]').forEach(element => {
      element.setAttribute('data-timestamp', timestamp.toString());
      element.setAttribute('data-updated', 'true');
      
      // Forcer la réinitialisation des gestionnaires d'événements
      if (element instanceof HTMLElement) {
        try {
          // Créer un clone sans les gestionnaires d'événements
          const clone = element.cloneNode(true);
          // Remplacer l'élément original par le clone
          if (element.parentNode) {
            element.parentNode.replaceChild(clone, element);
          }
        } catch (error) {
          console.warn('Erreur lors de la réinitialisation du bouton d\'action rapide:', error);
        }
      }
    });
    
    // Déclencher un événement de rechargement pour les modules réceptionniste
    const receptionistUpdateEvent = new CustomEvent('force-receptionist-update', {
      detail: { timestamp }
    });
    window.dispatchEvent(receptionistUpdateEvent);
  }
  
  console.log('🔄 Mise à jour forcée déclenchée:', new Date(timestamp).toLocaleString());
  return timestamp;
};

/**
 * Nettoie les caches locaux qui pourraient empêcher les mises à jour
 */
export const clearComponentCache = (): void => {
  // Liste des préfixes de clés à nettoyer
  const cacheKeys = [
    'guide_completed_',
    'guide_skipped_',
    'first_visit_',
    'component_cache_',
    'temp_state_',
    'ui_preferences_'
  ];
  
  // Nettoyer les clés spécifiques dans le localStorage
  if (typeof localStorage !== 'undefined') {
    Object.keys(localStorage).forEach(key => {
      if (cacheKeys.some(prefix => key.startsWith(prefix))) {
        localStorage.removeItem(key);
        console.log(`🧹 Nettoyé: ${key}`);
      }
    });
  }
  
  // Nettoyer les attributs de mise en cache dans le DOM
  if (typeof document !== 'undefined') {
    // Nettoyer les attributs data-cache
    document.querySelectorAll('[data-cache]').forEach(element => {
      element.removeAttribute('data-cache');
    });
    
    // Réinitialiser les attributs de mise à jour
    document.querySelectorAll('[data-updated]').forEach(element => {
      element.setAttribute('data-updated', 'false');
    });
    
    // Forcer le rechargement des composants avec état
    document.querySelectorAll('[data-state]').forEach(element => {
      element.setAttribute('data-reset-state', 'true');
    });
  }
  
  // Réinitialiser les variables globales de mise en cache
  if (typeof window !== 'undefined') {
    // @ts-ignore
    if (window.__cache) {
      // @ts-ignore
      window.__cache = {};
    }
    
    // Déclencher un événement de nettoyage du cache
    window.dispatchEvent(new CustomEvent('cache-cleared'));
  }
  
  console.log('🧹 Cache des composants nettoyé avec succès');
};

/**
 * Vérifie l'intégrité des composants critiques
 * @returns boolean - true si tous les composants sont intègres, false sinon
 */
export const validateComponentIntegrity = (): boolean => {
  // Vérifier que tous les composants critiques sont bien chargés
  if (typeof document === 'undefined') {
    return true; // Exécution côté serveur, pas de validation possible
  }
  
  const criticalSelectors = [
    '[data-guide="header-stats"]',
    '[data-guide="ai-actions"]',
    '[data-guide="notifications"]',
    '[data-guide="quick-actions"]',
    '[data-component="header"]',
    '[data-component="sidebar"]',
    '[data-component="main-content"]'
  ];
  
  const missingElements: string[] = [];
  
  criticalSelectors.forEach(selector => {
    if (!document.querySelector(selector)) {
      missingElements.push(selector);
      console.warn(`⚠️ Élément critique manquant: ${selector}`);
    }
  });
  
  // Vérification spécifique des boutons d'action rapide
  const quickActionButtons = document.querySelectorAll('[data-quick-action]');
  if (quickActionButtons.length === 0) {
    missingElements.push('data-quick-action');
    console.warn('⚠️ Aucun bouton d\'action rapide trouvé');
  }
  
  // Vérifier les modules de base
  const requiredModules = ['dashboard', 'reception', 'visitor-stats', 'packages', 'visitors'];
  requiredModules.forEach(module => {
    if (!document.querySelector(`[data-module="${module}"]`)) {
      missingElements.push(`Module ${module}`);
      console.warn(`⚠️ Module requis manquant: ${module}`);
    }
  });
  
  if (missingElements.length > 0) {
    console.error('❌ Validation d\'intégrité échouée. Éléments manquants:', missingElements);
    return false;
  }
  
  console.log('✅ Intégrité des composants validée');
  return true;
};

/**
 * Génère un rapport de déploiement
 */
export const deploymentReport = () => {
  const report = {
    timestamp: new Date().toISOString(),
    userAgent: navigator?.userAgent,
    viewport: {
      width: window?.innerWidth,
      height: window?.innerHeight
    },
    components: {
      header: typeof document !== 'undefined' && !!document.querySelector('header'),
      sidebar: typeof document !== 'undefined' && !!document.querySelector('[data-component="sidebar"]'),
      mainContent: typeof document !== 'undefined' && !!document.querySelector('main'),
      guide: typeof document !== 'undefined' && !!document.querySelector('[data-guide]'),
      quickActions: typeof document !== 'undefined' && document.querySelectorAll('[data-quick-action]').length,
      receptionModule: typeof document !== 'undefined' && !!document.querySelector('[data-component="reception-module"]')
    },
    guides: {
      mainGuideAvailable: typeof localStorage !== 'undefined' && localStorage.getItem('guide_completed_receptionist-main') !== null,
      quickGuideAvailable: typeof localStorage !== 'undefined' && localStorage.getItem('guide_completed_receptionist-quick') !== null
    },
    lastUpdate: typeof localStorage !== 'undefined' && localStorage.getItem('last_update_timestamp'),
    domReady: typeof document !== 'undefined' && document.readyState === 'complete'
  };
  
  console.log('📊 Rapport de déploiement:', report);
  return report;
};

/**
 * Simule la création des composants après un rechargement forcé
 * pour les scénarios où les gestionnaires d'événements sont perdus
 */
export const recreateComponentHandlers = (): void => {
  if (typeof document === 'undefined') return;
  
  console.log('🔄 Recréation des gestionnaires d\'événements...');
  
  // Recréer les boutons d'action rapide
  document.querySelectorAll('[data-quick-action]').forEach(element => {
    if (element instanceof HTMLElement) {
      const actionType = element.getAttribute('data-quick-action');
      
      // Cloner et remplacer pour réinitialiser les gestionnaires
      const clone = element.cloneNode(true) as HTMLElement;
      if (element.parentNode) {
        element.parentNode.replaceChild(clone, element);
      }
      
      // Ajouter des gestionnaires d'événements aux clones
      if (actionType === 'register-visitor') {
        clone.addEventListener('click', () => {
          console.log('🎯 Action: Enregistrer visiteur');
          window.location.hash = 'reception';
          window.dispatchEvent(new CustomEvent('navigate-reception-module', {
            detail: { section: 'register' }
          }));
        });
      } else if (actionType === 'scan-document') {
        clone.addEventListener('click', () => {
          console.log('🎯 Action: Scanner document');
          window.location.hash = 'reception';
          window.dispatchEvent(new CustomEvent('navigate-reception-module', {
            detail: { section: 'scanner' }
          }));
        });
      } else if (actionType === 'manage-badges') {
        clone.addEventListener('click', () => {
          console.log('🎯 Action: Gestion badges');
          window.location.hash = 'reception';
          window.dispatchEvent(new CustomEvent('navigate-reception-module', {
            detail: { section: 'badges' }
          }));
        });
      }
    }
  });
  
  console.log('✅ Gestionnaires d\'événements recréés');
};

/**
 * Hook pour auto-validation après le montage des composants
 * @param callback Fonction de rappel appelée après validation
 */
export const useDeploymentValidation = (callback?: () => void): void => {
  if (typeof React === 'undefined' || typeof React.useEffect === 'undefined') return;
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      const isValid = validateComponentIntegrity();
      deploymentReport();
      
      if (!isValid) {
        console.warn('⚠️ La validation du déploiement a échoué, tentative de réparation...');
        recreateComponentHandlers();
      }
      
      if (callback) {
        callback();
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [callback]);
};

/**
 * Déclenche un événement de navigation pour un module spécifique
 * @param module Le module cible
 * @param section La section spécifique du module (optionnel)
 */
export const navigateToModule = (module: string, section?: string): void => {
  if (typeof window === 'undefined') return;
  
  // Définir le hash pour la navigation
  window.location.hash = module;
  
  // Déclencher un événement personnalisé pour la navigation interne
  const event = new CustomEvent('navigate-module', {
    detail: { module, section }
  });
  window.dispatchEvent(event);
  
  // Événement spécifique au module de réception
  if (module === 'reception' && section) {
    const receptionEvent = new CustomEvent('navigate-reception-module', {
      detail: { section }
    });
    window.dispatchEvent(receptionEvent);
  }
  
  console.log(`🧭 Navigation vers le module: ${module}${section ? ' - ' + section : ''}`);
};