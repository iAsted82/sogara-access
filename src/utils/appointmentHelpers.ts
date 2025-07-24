import { Appointment } from '../types/appointment';

/**
 * Interface for appointment verification result
 */
export interface AppointmentVerificationResult {
  isExpected: boolean;
  appointments: Appointment[];
  matchType: 'exact' | 'partial' | 'none';
  exactMatch?: Appointment;
}

/**
 * Search for appointments by visitor details
 * @param appointments List of all appointments
 * @param visitorName Name of the visitor to search for
 * @param phoneNumber Optional phone number to improve match accuracy
 * @param email Optional email to improve match accuracy
 * @returns Result with matching appointments and verification status
 */
export function verifyVisitorAppointment(
  appointments: Appointment[],
  visitorName: string,
  phoneNumber?: string,
  email?: string
): AppointmentVerificationResult {
  if (!visitorName) {
    return {
      isExpected: false,
      appointments: [],
      matchType: 'none'
    };
  }
  
  // Normalize the visitor name for search (lowercase, trim)
  const normalizedName = visitorName.toLowerCase().trim();
  const normalizedPhone = phoneNumber?.replace(/\s+/g, '');
  
  // Find today's and future appointments
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  
  const relevantAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.date);
    appointmentDate.setHours(0, 0, 0, 0);
    return appointmentDate >= currentDate;
  });
  
  // Look for exact match (both name and contact info)
  const exactMatch = relevantAppointments.find(appointment => {
    const appointmentCitizenName = appointment.citizenName.toLowerCase();
    
    // Perfect match with name and contact info
    const nameMatch = appointmentCitizenName === normalizedName;
    const phoneMatch = normalizedPhone && appointment.citizenPhone && 
                      appointment.citizenPhone.replace(/\s+/g, '').includes(normalizedPhone);
    const emailMatch = email && appointment.citizenEmail && 
                      appointment.citizenEmail.toLowerCase() === email.toLowerCase();
    
    return nameMatch && (phoneMatch || emailMatch);
  });
  
  if (exactMatch) {
    return {
      isExpected: true,
      appointments: [exactMatch],
      matchType: 'exact',
      exactMatch
    };
  }
  
  // Look for partial matches (just name)
  const partialMatches = relevantAppointments.filter(appointment => {
    const appointmentCitizenName = appointment.citizenName.toLowerCase();
    return appointmentCitizenName.includes(normalizedName) || 
           normalizedName.includes(appointmentCitizenName);
  });
  
  if (partialMatches.length > 0) {
    return {
      isExpected: true,
      appointments: partialMatches,
      matchType: 'partial'
    };
  }
  
  return {
    isExpected: false,
    appointments: [],
    matchType: 'none'
  };
}

/**
 * Checks if a visitor's appointment is today
 * @param appointment Appointment to check
 * @returns true if appointment is today
 */
export function isAppointmentToday(appointment: Appointment): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const appointmentDate = new Date(appointment.date);
  appointmentDate.setHours(0, 0, 0, 0);
  
  return appointmentDate.getTime() === today.getTime();
}

/**
 * Get appointment status color based on status
 * @param status Appointment status
 * @returns CSS class for background and text color
 */
export function getAppointmentStatusColor(status: string): string {
  switch (status) {
    case 'confirmed':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'arrived':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'completed':
      return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    case 'cancelled':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'no_show':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

/**
 * Formats time for display
 * @param timeString Time string in format "HH:MM"
 * @returns Formatted time
 */
export function formatAppointmentTime(timeString: string): string {
  // If already in correct format, return as is
  if (/^\d{1,2}:\d{2}$/.test(timeString)) {
    return timeString;
  }
  
  // Try to parse if in other format
  try {
    const date = new Date(timeString);
    if (!isNaN(date.getTime())) {
      return date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  } catch (e) {
    console.error('Error formatting appointment time:', e);
  }
  
  return timeString;
}