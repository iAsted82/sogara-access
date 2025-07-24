/**
 * Types for Staff Management Module
 */

export interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  function: string; // Job function/title
  department: string;
  internalPhone: string;
  email: string;
  isAvailable: boolean;
  avatar?: string; // URL for staff photo
  location?: string; // Physical location/office
  lastSeen?: string; // Timestamp of last status change
  notes?: string; // Additional notes
  absenceReason?: string; // Reason for absence
  absenceDuration?: string; // Expected duration of absence
  expectedReturnDate?: string; // Expected date of return
  role?: string; // Role in the organization
  skills?: string[]; // Professional skills
  languages?: string[]; // Languages spoken
  startDate?: string; // When the person started working
  emergencyContact?: string; // Emergency contact information
}

export type StaffAvailability = 'available' | 'unavailable' | 'meeting' | 'leave' | 'remote';

export interface StaffFormData {
  firstName: string;
  lastName: string;
  function: string;
  department: string;
  internalPhone: string;
  email: string;
  isAvailable: boolean;
  location?: string;
  notes?: string;
  role?: string;
  skills?: string[];
  absenceReason?: string;
  absenceDuration?: string;
  expectedReturnDate?: string;
  languages?: string[];
  startDate?: string;
  emergencyContact?: string;
}

export interface StaffFilter {
  searchTerm: string;
  department: string;
  availability: 'all' | 'available' | 'unavailable';
  role?: string;
  location?: string;
  absenceStatus?: 'all' | 'present' | 'absent';
  sortBy?: 'name' | 'department' | 'function' | 'lastSeen';
  sortDirection?: 'asc' | 'desc';
}