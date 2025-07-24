// Système de notifications pour le module réceptionniste DGDI

export interface Notification {
  id: string;
  type: 'visitor_arrival' | 'visitor_overdue' | 'vip_arrival' | 'emergency' | 'badge_issue' | 'security_alert';
  title: string;
  message: string;
  recipient: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  read: boolean;
  actions?: NotificationAction[];
  data?: any;
}

export interface NotificationAction {
  id: string;
  label: string;
  action: string;
  style: 'primary' | 'secondary' | 'danger';
}

/**
 * Envoie une notification d'arrivée de visiteur
 */
export const notifyVisitorArrival = async (visitorData: any, employeeData: any): Promise<void> => {
  const notification: Notification = {
    id: `arrival_${Date.now()}`,
    type: 'visitor_arrival',
    title: 'Nouveau visiteur',
    message: `${visitorData.firstName} ${visitorData.lastName} de ${visitorData.company} est arrivé(e) pour vous voir.`,
    recipient: employeeData.email,
    priority: visitorData.urgencyLevel === 'high' ? 'high' : 'medium',
    timestamp: new Date().toISOString(),
    read: false,
    actions: [
      {
        id: 'confirm',
        label: 'Confirmer la réception',
        action: 'confirm_visitor',
        style: 'primary'
      },
      {
        id: 'reschedule',
        label: 'Reporter',
        action: 'reschedule_visitor',
        style: 'secondary'
      }
    ],
    data: {
      visitorId: visitorData.id,
      badgeNumber: visitorData.badgeNumber,
      purpose: visitorData.purposeOfVisit
    }
  };

  // Simulation d'envoi email
  
  // Simulation d'envoi SMS si configuré
  if (employeeData.notifications?.employeeSMS) {
    const smsMessage = `SOGARA: ${visitorData.firstName} ${visitorData.lastName} vous attend à l'accueil. Badge: ${visitorData.badgeNumber}`;
    console.log(`📱 SMS envoyé à ${employeeData.phone}:`, smsMessage);
  }
  
  // Notification manager si VIP
  if (visitorData.urgencyLevel === 'vip') {
    await notifyManager(visitorData, 'VIP arrival notification');
  }
};

/**
 * Alerte pour visiteur en retard
 */
export const notifyVisitorOverdue = async (visitorData: any): Promise<void> => {
  const notification: Notification = {
    id: `overdue_${Date.now()}`,
    type: 'visitor_overdue',
    title: 'Visiteur en retard',
    message: `${visitorData.firstName} ${visitorData.lastName} dépasse la durée prévue de visite (${visitorData.expectedDuration}).`,
    recipient: 'reception@dgi.ga',
    priority: 'medium',
    timestamp: new Date().toISOString(),
    read: false,
    actions: [
      {
        id: 'extend',
        label: 'Prolonger la visite',
        action: 'extend_visit',
        style: 'primary'
      },
      {
        id: 'contact',
        label: 'Contacter le visiteur',
        action: 'contact_visitor',
        style: 'secondary'
      },
      {
        id: 'checkout',
        label: 'Forcer le check-out',
        action: 'force_checkout',
        style: 'danger'
      }
    ],
    data: {
      visitorId: visitorData.id,
      expectedDuration: visitorData.expectedDuration,
      actualDuration: visitorData.duration
    }
  };

  console.log('⚠️ Alerte visiteur en retard:', notification);
};

/**
 * Notification VIP avec protocole spécial
 */
export const notifyVIPArrival = async (visitorData: any): Promise<void> => {
  const notifications = [
    // Réception
    {
      id: `vip_reception_${Date.now()}`,
      type: 'vip_arrival' as const,
      title: 'ARRIVÉE VIP',
      message: `URGENT: ${visitorData.firstName} ${visitorData.lastName} (${visitorData.company}) - Protocole VIP activé`,
      recipient: 'reception@dgi.ga',
      priority: 'critical' as const,
      timestamp: new Date().toISOString(),
      read: false
    },
    // Direction
    {
      id: `vip_direction_${Date.now()}`,
      type: 'vip_arrival' as const,
      title: 'PROTOCOLE VIP ACTIVÉ',
      message: `Visiteur VIP: ${visitorData.firstName} ${visitorData.lastName} - Escorte requise immédiatement`,
      recipient: 'direction@dgi.ga',
      priority: 'critical' as const,
      timestamp: new Date().toISOString(),
      read: false
    },
    // Sécurité
    {
      id: `vip_security_${Date.now()}`,
      type: 'vip_arrival' as const,
      title: 'ALERTE SÉCURITÉ VIP',
      message: `Activation protocole sécurité renforcée - Visiteur: ${visitorData.firstName} ${visitorData.lastName}`,
      recipient: 'security@dgi.ga',
      priority: 'critical' as const,
      timestamp: new Date().toISOString(),
      read: false
    }
  ];

  notifications.forEach(notification => {
    console.log('🚨 Notification VIP:', notification);
  });
};

/**
 * Alerte sécurité critique
 */
export const notifySecurityAlert = async (alertType: string, message: string, data?: any): Promise<void> => {
  const notification: Notification = {
    id: `security_${Date.now()}`,
    type: 'security_alert',
    title: 'ALERTE SÉCURITÉ',
    message: message,
    recipient: 'security@dgi.ga',
    priority: 'critical',
    timestamp: new Date().toISOString(),
    read: false,
    actions: [
      {
        id: 'investigate',
        label: 'Enquête immédiate',
        action: 'investigate_alert',
        style: 'danger'
      },
      {
        id: 'lockdown',
        label: 'Confinement',
        action: 'initiate_lockdown',
        style: 'danger'
      }
    ],
    data: { alertType, ...data }
  };

  console.log('🚨 ALERTE SÉCURITÉ:', notification);
  
  // Notification supplémentaire à la direction pour les alertes critiques
  await notifyManager(data, `Alerte sécurité: ${alertType}`);
};

/**
 * Notification d'urgence évacuation
 */
export const notifyEmergencyEvacuation = async (visitors: any[], reason: string): Promise<void> => {
  const notification: Notification = {
    id: `emergency_${Date.now()}`,
    type: 'emergency',
    title: 'ÉVACUATION D\'URGENCE',
    message: `Procédure d'évacuation activée. ${visitors.length} visiteur(s) présent(s). Raison: ${reason}`,
    recipient: 'all@dgi.ga',
    priority: 'critical',
    timestamp: new Date().toISOString(),
    read: false,
    actions: [
      {
        id: 'confirm',
        label: 'Confirmer évacuation',
        action: 'confirm_evacuation',
        style: 'danger'
      }
    ],
    data: { visitors, reason, evacuationId: `EVAC_${Date.now()}` }
  };

  console.log('🚨 ÉVACUATION D\'URGENCE:', notification);
  
  // Notifications spécifiques
  const emergencyContacts = [
    'direction@dgi.ga',
    'security@dgi.ga',
    'reception@dgi.ga',
    'emergency@dgi.ga'
  ];
  
  emergencyContacts.forEach(contact => {
    console.log(`🚨 Notification urgence envoyée à: ${contact}`);
  });
};

/**
 * Notification de remise d'objets gardés
 */
export const notifyItemReturn = async (visitorData: any, items: string[]): Promise<void> => {
  const notification: Notification = {
    id: `items_${Date.now()}`,
    type: 'badge_issue',
    title: 'Remise d\'objets',
    message: `Objets à rendre à ${visitorData.firstName} ${visitorData.lastName}: ${items.join(', ')}`,
    recipient: 'reception@dgi.ga',
    priority: 'medium',
    timestamp: new Date().toISOString(),
    read: false,
    data: { visitorId: visitorData.id, items }
  };

  console.log('📦 Notification remise objets:', notification);
};

/**
 * Notification au manager/direction
 */
const notifyManager = async (data: any, context: string): Promise<void> => {
  const managerNotification: Notification = {
    id: `manager_${Date.now()}`,
    type: 'vip_arrival',
    title: 'Notification Direction',
    message: `${context} - Action requise`,
    recipient: 'direction@dgi.ga',
    priority: 'high',
    timestamp: new Date().toISOString(),
    read: false,
    data
  };

  console.log('👔 Notification direction:', managerNotification);
};

/**
 * Envoie un rapport de fin de journée
 */
export const sendDailyReport = async (stats: any): Promise<void> => {
  const report = {
    date: new Date().toLocaleDateString('fr-FR'),
    visitorsTotal: stats.visitorsToday,
    badgesIssued: stats.badgesIssued,
    averageProcessingTime: stats.averageProcessingTime,
    satisfactionScore: stats.satisfactionScore,
    incidents: stats.securityAlerts,
    vipVisitors: stats.vipVisitors
  };

  console.log('📊 Rapport quotidien envoyé:', report);
};

/**
 * Configuration des préférences de notification
 */
export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  desktop: boolean;
  sound: boolean;
  vibration: boolean;
}

/**
 * Met à jour les préférences de notification d'un utilisateur
 */
export const updateNotificationPreferences = async (
  userId: string, 
  preferences: NotificationPreferences
): Promise<void> => {
  console.log(`Préférences mises à jour pour ${userId}:`, preferences);
  // En production: sauvegarder en base de données
};

/**
 * Marque une notification comme lue
 */
export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  console.log(`Notification ${notificationId} marquée comme lue`);
  // En production: mettre à jour en base de données
};

/**
 * Récupère toutes les notifications non lues
 */
export const getUnreadNotifications = async (userId: string): Promise<Notification[]> => {
  // Simulation de notifications non lues
  return [
    {
      id: 'notif_1',
      type: 'visitor_arrival',
      title: 'Nouveau visiteur',
      message: 'Marie OBAME vous attend à l\'accueil',
      recipient: userId,
      priority: 'medium',
      timestamp: new Date().toISOString(),
      read: false
    }
  ];
};