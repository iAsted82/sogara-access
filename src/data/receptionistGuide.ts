interface GuideStep {
  id: string;
  title: string;
  content: string;
  target?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  highlight?: boolean;
  action?: () => void;
}

export const receptionistGuideSteps: GuideStep[] = [
  {
    id: 'welcome',
    title: 'Bienvenue dans DGDI Access',
    content: 'Découvrez votre poste d\'accueil intelligent en 9 étapes simples. Ce guide vous accompagne pour maîtriser tous les outils essentiels.',
    position: 'bottom'
  },
  {
    id: 'header-stats',
    title: 'Métriques Temps Réel',
    content: 'Vos indicateurs de performance se mettent à jour automatiquement : visiteurs présents, VIP, badges actifs et satisfaction.',
    target: '[data-guide="header-stats"]',
    position: 'bottom',
    highlight: true
  },
  {
    id: 'ai-actions',
    title: 'Outils IA Avancés',
    content: 'Accédez rapidement au scanner IA (99% précision), système de badges QR et surveillance intelligente.',
    target: '[data-guide="ai-actions"]',
    position: 'bottom',
    highlight: true
  },
  {
    id: 'notifications',
    title: 'Hub Notifications',
    content: 'Recevez des alertes intelligentes pour VIP, colis urgents et rendez-vous. Les urgences sont prioritaires.',
    target: '[data-guide="notifications"]',
    position: 'left',
    highlight: true
  },
  {
    id: 'quick-actions',
    title: 'Actions Express',
    content: 'Boutons d\'accès direct : enregistrement citoyen, scan IA, badges sécurisés et procédures d\'urgence.',
    target: '[data-guide="quick-actions"]',
    position: 'top',
    highlight: true
  },
  {
    id: 'registration-form',
    title: 'Enregistrement IA',
    content: 'Trois modes disponibles : manuel, scan IA automatique, ou upload. L\'IA atteint 99.2% de précision.',
    target: '[data-guide="registration-form"]',
    position: 'right',
    highlight: true
  },
  {
    id: 'visitors-list',
    title: 'Suivi Temps Réel',
    content: 'Surveillez tous les visiteurs présents avec leur statut, localisation et alertes automatiques.',
    target: '[data-guide="visitors-list"]',
    position: 'left',
    highlight: true
  },
  {
    id: 'security-controls',
    title: 'Sécurité Intégrée',
    content: 'Accès immédiat aux urgences, contacts SOS, surveillance caméras et rapports automatiques.',
    target: '[data-guide="security-controls"]',
    position: 'top',
    highlight: true
  },
  {
    id: 'completion',
    title: 'Félicitations ! 🇬🇦',
    content: 'Votre formation est terminée. Vous maîtrisez maintenant votre poste d\'accueil SOGARA. Excellence dans le service !',
    position: 'bottom'
  }
];

export const quickGuideSteps: GuideStep[] = [
  {
    id: 'ai-scan-quick',
    title: 'Scanner IA - 99% Précision',
    content: 'Placez le document CNI/Passeport devant la caméra. L\'extraction automatique prend 2-3 secondes.',
    target: '[data-guide="ai-scan"]',
    position: 'bottom',
    highlight: true
  },
  {
    id: 'badge-system-quick',
    title: 'Badges QR Sécurisés',
    content: 'Générez instantanément des badges visiteurs avec QR code pour un contrôle d\'accès optimal.',
    target: '[data-guide="badge-system"]',
    position: 'bottom',
    highlight: true
  },
  {
    id: 'emergency-quick',
    title: 'Urgences & Sécurité',
    content: 'Accès direct aux 25 contacts d\'urgence et procédures d\'évacuation pour la sécurité de tous.',
    target: '[data-guide="emergency"]',
    position: 'top',
    highlight: true
  }
];

// Guide contextuel pour chaque section
export const contextualGuides = {
  scanner: [
    {
      id: 'scanner-setup',
      title: 'Configuration Scanner',
      content: 'Vérifiez que l\'éclairage est suffisant et le document bien positionné dans le cadre.',
      highlight: true
    }
  ],
  badges: [
    {
      id: 'badge-creation',
      title: 'Création de Badge',
      content: 'Sélectionnez les zones d\'accès autorisées avant de générer le QR code sécurisé.',
      highlight: true
    }
  ],
  notifications: [
    {
      id: 'notification-priority',
      title: 'Gestion des Priorités',
      content: 'Les alertes VIP (rouge) sont prioritaires sur les notifications standard (bleu).',
      highlight: true
    }
  ]
};