/**
 * Appointment Verification Utilities
 * 
 * This file contains helper functions for appointment verification in the SOGARA Access system.
 */

import { Appointment } from '../types/appointment';

/**
 * Normalize text for comparison by removing diacritics, converting to lowercase,
 * and removing extra spaces
 * 
 * @param text Text to normalize
 * @returns Normalized text
 */
export function normalizeText(text: string): string {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/\s+/g, ' ')            // Remove extra spaces
    .trim();
}

/**
 * Calculate similarity score between two strings (0-100)
 * Higher score means more similar
 * 
 * @param str1 First string
 * @param str2 Second string
 * @returns Similarity score (0-100)
 */
export function calculateSimilarity(str1: string, str2: string): number {
  const s1 = normalizeText(str1);
  const s2 = normalizeText(str2);
  
  if (!s1 || !s2) return 0;
  if (s1 === s2) return 100;
  
  // Simple algorithm: check if one is contained in the other
  if (s1.includes(s2)) return Math.round((s2.length / s1.length) * 100);
  if (s2.includes(s1)) return Math.round((s1.length / s2.length) * 100);
  
  // Calculate Levenshtein distance for more complex comparisons
  const distance = levenshteinDistance(s1, s2);
  const maxLength = Math.max(s1.length, s2.length);
  
  if (maxLength === 0) return 0;
  
  return Math.round((1 - distance / maxLength) * 100);
}

/**
 * Calculate Levenshtein distance between two strings
 * (Helper function for similarity calculation)
 */
function levenshteinDistance(str1: string, str2: string): number {
  const track = Array(str2.length + 1).fill(null).map(() => 
    Array(str1.length + 1).fill(null)
  );
  
  for (let i = 0; i <= str1.length; i++) {
    track[0][i] = i;
  }
  
  for (let j = 0; j <= str2.length; j++) {
    track[j][0] = j;
  }
  
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1, // deletion
        track[j - 1][i] + 1, // insertion
        track[j - 1][i - 1] + indicator // substitution
      );
    }
  }
  
  return track[str2.length][str1.length];
}

/**
 * Check if a phone number matches partially
 * 
 * @param phone1 First phone number
 * @param phone2 Second phone number
 * @returns True if there's a partial match
 */
export function phoneNumberMatches(phone1?: string, phone2?: string): boolean {
  if (!phone1 || !phone2) return false;
  
  // Normalize phone numbers by removing spaces, +, and other non-digit characters
  const normalizedPhone1 = phone1.replace(/\D/g, '');
  const normalizedPhone2 = phone2.replace(/\D/g, '');
  
  // Check if either phone number contains the other
  return normalizedPhone1.includes(normalizedPhone2) || 
         normalizedPhone2.includes(normalizedPhone1);
}

/**
 * Find best appointment match for a visitor
 * 
 * @param appointments List of appointments
 * @param visitorName Visitor's name
 * @param phone Optional phone number
 * @param email Optional email address
 * @returns Best matching appointment or null
 */
export function findBestAppointmentMatch(
  appointments: Appointment[],
  visitorName: string,
  phone?: string,
  email?: string
): Appointment | null {
  if (!visitorName || !appointments.length) return null;
  
  const normalizedName = normalizeText(visitorName);
  
  // First look for exact matches
  const exactMatches = appointments.filter(appointment => {
    const appointmentName = normalizeText(appointment.citizenName);
    const nameMatch = appointmentName === normalizedName;
    
    const phoneMatch = phone && appointment.citizenPhone && 
                       phoneNumberMatches(phone, appointment.citizenPhone);
    
    const emailMatch = email && appointment.citizenEmail && 
                      normalizeText(email) === normalizeText(appointment.citizenEmail);
    
    return nameMatch && (phoneMatch || emailMatch);
  });
  
  if (exactMatches.length > 0) {
    // If multiple exact matches, prioritize today's appointments
    const todayMatches = exactMatches.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      const today = new Date();
      return (
        appointmentDate.getDate() === today.getDate() &&
        appointmentDate.getMonth() === today.getMonth() &&
        appointmentDate.getFullYear() === today.getFullYear()
      );
    });
    
    return todayMatches.length > 0 ? todayMatches[0] : exactMatches[0];
  }
  
  // Look for partial matches and calculate similarity scores
  const matchesWithScores = appointments.map(appointment => {
    const score = calculateSimilarity(visitorName, appointment.citizenName);
    return { appointment, score };
  }).filter(match => match.score > 50); // Only consider significant matches
  
  // Sort by score (descending)
  matchesWithScores.sort((a, b) => b.score - a.score);
  
  return matchesWithScores.length > 0 ? matchesWithScores[0].appointment : null;
}

/**
 * Generate a summary of appointment verification results
 * 
 * @param appointmentFound Whether an appointment was found
 * @param appointment The appointment if found
 * @param matchType Type of match (exact, partial, none)
 * @returns Human-readable summary
 */
export function generateVerificationSummary(
  appointmentFound: boolean,
  appointment?: Appointment,
  matchType?: 'exact' | 'partial' | 'none'
): string {
  if (!appointmentFound) {
    return "Aucun rendez-vous n'a été trouvé pour ce visiteur.";
  }
  
  if (!appointment) {
    return "Un rendez-vous existe mais les détails sont indisponibles.";
  }
  
  const appointmentDate = new Date(appointment.date);
  const today = new Date();
  const isToday = (
    appointmentDate.getDate() === today.getDate() &&
    appointmentDate.getMonth() === today.getMonth() &&
    appointmentDate.getFullYear() === today.getFullYear()
  );
  
  let summary = "";
  
  if (matchType === 'exact') {
    summary = `Rendez-vous vérifié et confirmé pour ${appointment.citizenName}`;
  } else if (matchType === 'partial') {
    summary = `Correspondance possible trouvée pour ${appointment.citizenName}`;
  }
  
  summary += ` ${isToday ? "aujourd'hui" : "le " + appointmentDate.toLocaleDateString('fr-FR')}`;
  summary += ` à ${appointment.time} (${appointment.duration} min)`;
  summary += `. Service: ${appointment.service}, Agent: ${appointment.agent}.`;
  
  return summary;
}