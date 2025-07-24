import { Appointment } from '../types/appointment';

export interface AppointmentVerificationResult {
  isExpected: boolean;
  appointments: Appointment[];
  matchType: 'none' | 'partial' | 'exact';
  exactMatch?: Appointment;
}

export const verifyVisitorAppointment = (
  appointments: Appointment[],
  visitorName: string,
  phone?: string,
  email?: string
): AppointmentVerificationResult => {
  // Find exact match
  const exactMatch = appointments.find(apt => 
    apt.citizenName.toLowerCase() === visitorName.toLowerCase() &&
    (phone ? apt.citizenPhone === phone : true) &&
    (email ? apt.citizenEmail === email : true)
  );

  if (exactMatch) {
    return {
      isExpected: true,
      appointments: [exactMatch],
      matchType: 'exact',
      exactMatch
    };
  }

  // Find partial matches
  const partialMatches = appointments.filter(apt =>
    apt.citizenName.toLowerCase().includes(visitorName.toLowerCase()) ||
    visitorName.toLowerCase().includes(apt.citizenName.toLowerCase())
  );

  return {
    isExpected: partialMatches.length > 0,
    appointments: partialMatches,
    matchType: partialMatches.length > 0 ? 'partial' : 'none'
  };
};