/**
 * Types related to appointments in DGI Access
 */

export type AppointmentStatus = 
  | 'pending'    // En attente de confirmation
  | 'confirmed'  // Confirmé mais pas encore arrivé
  | 'arrived'    // Visiteur arrivé, en cours
  | 'completed'  // Rendez-vous terminé
  | 'cancelled'  // Annulé
  | 'no_show';   // Absent

export type AppointmentPriority = 'normal' | 'high' | 'urgent';

export interface Appointment {
  id: string;
  date: string;         // YYYY-MM-DD format
  time: string;         // HH:MM format
  duration: number;     // In minutes
  citizenName: string;
  citizenPhone: string;
  citizenEmail?: string;
  service: string;
  purpose: string;
  agent: string;
  status: AppointmentStatus;
  notes: string;
  priority?: AppointmentPriority;
  department?: string;
  attachments?: string[];
  createdBy?: string;
  createdAt?: string;
  lastUpdated?: string;
  lastUpdatedBy?: string;
}

export interface AppointmentFilter {
  date?: string;
  status?: AppointmentStatus | 'all';
  service?: string;
  searchTerm?: string;
}

export interface AppointmentStats {
  total: number;
  today: number;
  pending: number;
  confirmed: number;
  arrived: number;
  completed: number;
  cancelled: number;
  noShow: number;
}

export interface AppointmentFormData {
  citizenName: string;
  citizenPhone: string;
  citizenEmail?: string;
  date: string;
  time: string;
  duration: number;
  service: string;
  purpose: string;
  agent: string;
  priority: AppointmentPriority;
  notes?: string;
}