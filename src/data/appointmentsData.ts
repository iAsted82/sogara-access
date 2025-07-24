import { Appointment } from '../types/appointment';

/**
 * Sample appointments data for visit planning functionality
 */
export const appointmentsData: Appointment[] = [
  {
    id: 'RDV-2024-001',
    date: '2024-06-12',
    time: '09:00',
    duration: 30,
    citizenName: 'Marie OBAME',
    citizenPhone: '+241 01 23 45 67',
    citizenEmail: 'marie.obame@example.com',
    service: 'Documentation',
    purpose: 'Première demande CNI',
    agent: 'Jean NGUEMA',
    status: 'completed',
    notes: 'Citoyen possède tous les documents requis',
    priority: 'normal',
    department: 'Documentation'
  },
  {
    id: 'RDV-2024-002',
    date: new Date().toISOString().split('T')[0], // Today
    time: '10:30',
    duration: 45,
    citizenName: 'Paul OBIANG',
    citizenPhone: '+241 02 34 56 78',
    service: 'Passeports',
    purpose: 'Renouvellement passeport',
    agent: 'Marie AKUE',
    status: 'confirmed',
    notes: 'En attente de confirmation',
    priority: 'normal',
    department: 'Passeports'
  },
  {
    id: 'RDV-2024-003',
    date: new Date().toISOString().split('T')[0], // Today
    time: '14:00',
    duration: 60,
    citizenName: 'Sophie ELLA',
    citizenPhone: '+241 03 45 67 89',
    citizenEmail: 'sophie.ella@example.com',
    service: 'Immigration',
    purpose: 'Demande visa affaires',
    agent: 'Paul MBENG',
    status: 'arrived',
    notes: 'Citoyen présent, en cours de traitement',
    priority: 'high',
    department: 'Immigration'
  },
  {
    id: 'RDV-2024-004',
    date: '2024-06-08',
    time: '15:30',
    duration: 30,
    citizenName: 'André KOMBILA',
    citizenPhone: '+241 04 56 78 90',
    service: 'Documentation',
    purpose: 'Certificat de nationalité',
    agent: 'Claire MOUELE',
    status: 'completed',
    notes: 'Service terminé avec succès',
    priority: 'normal',
    department: 'Documentation'
  },
  {
    id: 'RDV-2024-005',
    date: '2024-06-10',
    time: '16:00',
    duration: 30,
    citizenName: 'Sylvie MBOUMBA',
    citizenPhone: '+241 05 67 89 01',
    service: 'Documentation',
    purpose: 'Duplicata CNI (perte)',
    agent: 'Jean NGUEMA',
    status: 'cancelled',
    notes: 'Annulé par le citoyen',
    priority: 'normal',
    department: 'Documentation'
  },
  {
    id: 'RDV-2024-006',
    date: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
    time: '11:00',
    duration: 45,
    citizenName: 'Jacques ONDO',
    citizenPhone: '+241 06 78 90 12',
    service: 'Passeports',
    purpose: 'Passeport diplomatique',
    agent: 'Marie AKUE',
    status: 'pending',
    notes: 'Dossier prioritaire - Ambassade',
    priority: 'urgent',
    department: 'Passeports'
  },
  {
    id: 'RDV-2024-007',
    date: '2024-06-07',
    time: '09:30',
    duration: 30,
    citizenName: 'Laurent MOUKETOU',
    citizenPhone: '+241 07 89 01 23',
    service: 'Documentation',
    purpose: 'Attestation de résidence',
    agent: 'Jean NGUEMA',
    status: 'no_show',
    notes: 'Citoyen absent sans prévenir',
    priority: 'normal',
    department: 'Documentation'
  },
  {
    id: 'RDV-2024-008',
    date: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days from now
    time: '14:30',
    duration: 60,
    citizenName: 'Marie-Claire EYENE',
    citizenPhone: '+241 05 43 21 09',
    citizenEmail: 'marie-claire.eyene@example.com',
    service: 'Immigration',
    purpose: 'Visa touristique famille',
    agent: 'Paul MBENG',
    status: 'confirmed',
    notes: 'Famille de 4 personnes',
    priority: 'normal',
    department: 'Immigration'
  },
  {
    id: 'RDV-2024-009',
    date: '2024-06-09',
    time: '10:00',
    duration: 45,
    citizenName: 'Serge NDONG',
    citizenPhone: '+241 06 12 34 56',
    service: 'Passeports',
    purpose: 'Renouvellement passeport',
    agent: 'Claire MOUELE',
    status: 'completed',
    notes: 'Passeport remis en main propre',
    priority: 'normal',
    department: 'Passeports'
  },
  // New appointments - some for today to demonstrate functionality
  {
    id: 'RDV-2024-010',
    date: new Date().toISOString().split('T')[0], // Today
    time: '15:45',
    duration: 30,
    citizenName: 'Pierre NZAMBA',
    citizenPhone: '+241 01 23 56 89',
    service: 'Documentation',
    purpose: 'Demande extrait d\'acte de naissance',
    agent: 'Jean NGUEMA',
    status: 'confirmed',
    notes: 'Apporter ancienne pièce d\'identité',
    priority: 'normal',
    department: 'Documentation'
  },
  {
    id: 'RDV-2024-011',
    date: new Date().toISOString().split('T')[0], // Today
    time: '16:30',
    duration: 45,
    citizenName: 'François KOUMBA',
    citizenPhone: '+241 02 34 67 91',
    citizenEmail: 'francois.koumba@example.com',
    service: 'Immigration',
    purpose: 'Demande permis de résidence',
    agent: 'Paul MBENG',
    status: 'pending',
    notes: 'Vérifier documents originaux',
    priority: 'normal',
    department: 'Immigration'
  }
];

/**
 * Get appointment by ID
 */
export function getAppointmentById(id: string): Appointment | undefined {
  return appointmentsData.find(appointment => appointment.id === id);
}

/**
 * Get appointments by status
 */
export function getAppointmentsByStatus(status: string): Appointment[] {
  return appointmentsData.filter(appointment => appointment.status === status);
}

/**
 * Get today's appointments
 */
export function getTodayAppointments(): Appointment[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return appointmentsData.filter(appointment => {
    const appointmentDate = new Date(appointment.date);
    appointmentDate.setHours(0, 0, 0, 0);
    return appointmentDate.getTime() === today.getTime();
  });
}

/**
 * Update appointment status
 */
export function updateAppointmentStatus(id: string, newStatus: string): Appointment | null {
  const appointmentIndex = appointmentsData.findIndex(a => a.id === id);
  if (appointmentIndex === -1) return null;
  
  appointmentsData[appointmentIndex] = {
    ...appointmentsData[appointmentIndex],
    status: newStatus as any,
    lastUpdated: new Date().toISOString()
  };
  
  return appointmentsData[appointmentIndex];
}

/**
 * Calculate appointment statistics
 */
export function getAppointmentStats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return {
    total: appointmentsData.length,
    today: getTodayAppointments().length,
    pending: getAppointmentsByStatus('pending').length,
    confirmed: getAppointmentsByStatus('confirmed').length,
    arrived: getAppointmentsByStatus('arrived').length,
    completed: getAppointmentsByStatus('completed').length,
    cancelled: getAppointmentsByStatus('cancelled').length,
    noShow: getAppointmentsByStatus('no_show').length
  };
}