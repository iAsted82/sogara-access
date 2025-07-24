import { StaffMember, StaffFormData } from '../types/staff';

/**
 * Generate a unique ID for a new staff member
 */
export function generateStaffId(): string {
  return `staff-${Date.now().toString().slice(-6)}`;
}

/**
 * Validate staff form data
 * @param data Staff form data to validate
 * @returns Object containing validation result and error messages
 */
export function validateStaffForm(data: StaffFormData): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  // Required fields
  if (!data.firstName.trim()) errors.firstName = 'Le prénom est requis';
  if (!data.lastName.trim()) errors.lastName = 'Le nom est requis';
  if (!data.function.trim()) errors.function = 'La fonction est requise';
  if (!data.department.trim()) errors.department = 'Le département est requis';
  if (!data.internalPhone.trim()) errors.internalPhone = 'Le numéro de téléphone interne est requis';
  if (!data.email.trim()) errors.email = 'L\'email est requis';
  
  // Email format validation
  if (data.email && !isValidEmail(data.email)) {
    errors.email = 'Format d\'email invalide';
  }
  
  // Phone format validation (simple check for internal extension)
  if (data.internalPhone && !/^\d{4,5}$/.test(data.internalPhone.trim())) {
    errors.internalPhone = 'Format de numéro interne invalide (4-5 chiffres)';
  }

  // Skills validation (optional)
  if (data.skills && Array.isArray(data.skills)) {
    if (data.skills.some(skill => !skill.trim())) {
      errors.skills = 'Les compétences ne peuvent pas être vides';
    }
  }
  
  // Languages validation (optional)
  if (data.languages && Array.isArray(data.languages)) {
    if (data.languages.some(language => !language.trim())) {
      errors.languages = 'Les langues ne peuvent pas être vides';
    }
  }
  
  // Start date validation (optional)
  if (data.startDate) {
    const startDate = new Date(data.startDate);
    if (isNaN(startDate.getTime()) || startDate > new Date()) {
      errors.startDate = 'Date d\'entrée invalide';
    }
  }
  
  // Emergency contact validation (optional)
  if (data.emergencyContact && data.emergencyContact.trim().length < 10) {
    errors.emergencyContact = 'Contact d\'urgence invalide';
  }
  
  // Absence data validation (optional)
  if (data.absenceReason && !data.absenceDuration) {
    errors.absenceDuration = 'Veuillez spécifier une durée d\'absence';
  }
  
  if (data.expectedReturnDate) {
    const returnDate = new Date(data.expectedReturnDate);
    if (isNaN(returnDate.getTime())) {
      errors.expectedReturnDate = 'Date de retour invalide';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Check if email has valid format
 * @param email Email to validate
 * @returns True if email format is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Format phone number for display
 */
export function formatPhoneNumber(phone: string): string {
  // If it's already a 4-5 digit internal extension, return as is
  if (/^\d{4,5}$/.test(phone)) {
    return phone;
  }
  
  // If it's a full phone number, format it
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 8) {
    return `+241 ${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6, 8)}`;
  }
  
  // Return original if no formatting applied
  return phone;
}

/**
 * Filter staff by department
 */
export function filterByDepartment(staff: StaffMember[], department: string): StaffMember[] {
  if (!department || department === 'all') return staff;
  return staff.filter(member => member.department === department);
}

/**
 * Filter staff by availability
 */
export function filterByAvailability(staff: StaffMember[], availability: string): StaffMember[] {
  if (!availability || availability === 'all') return staff;
  return staff.filter(member => 
    availability === 'available' ? member.isAvailable : !member.isAvailable
  );
}

/**
 * Filter staff by role
 */
export function filterByRole(staff: StaffMember[], role: string): StaffMember[] {
  if (!role || role === 'all') return staff;
  return staff.filter(member => 
    member.role && member.role.toLowerCase() === role.toLowerCase()
  );
}

/**
 * Filter staff by location
 */
export function filterByLocation(staff: StaffMember[], location: string): StaffMember[] {
  if (!location || location === 'all') return staff;
  return staff.filter(member => 
    member.location && member.location.toLowerCase().includes(location.toLowerCase())
  );
}

/**
 * Filter staff by absence status
 */
export function filterByAbsenceStatus(staff: StaffMember[], absenceStatus?: 'all' | 'present' | 'absent'): StaffMember[] {
  if (!absenceStatus || absenceStatus === 'all') return staff;
  
  if (absenceStatus === 'present') {
    return staff.filter(member => member.isAvailable);
  } else {
    return staff.filter(member => !member.isAvailable);
  }
}

/**
 * Get absence reason with fallback
 */
export function getAbsenceReason(staff: StaffMember): string {
  if (!staff.absenceReason) return 'Absence non spécifiée';
  return staff.absenceReason;
}

/**
 * Format expected return date
 */
export function formatExpectedReturn(staff: StaffMember): string {
  if (!staff.isAvailable) {
    if (staff.expectedReturnDate) {
      return `Retour prévu le ${new Date(staff.expectedReturnDate).toLocaleDateString('fr-FR')}`;
    }
    
    if (staff.absenceDuration) {
      switch (staff.absenceDuration) {
        case 'hour': return 'Retour dans quelques heures';
        case 'day': return 'Retour demain';
        case 'days': return 'Retour dans quelques jours';
        case 'week': return 'Retour la semaine prochaine';
        case 'weeks': return 'Retour dans plusieurs semaines';
        case 'undetermined': return 'Retour indéterminé';
        default: return 'Absence temporaire';
      }
    }
  }
  
  return 'Non spécifié';
}

/**
 * Search staff members based on search term
 * @param staff Array of staff members
 * @param searchTerm Search term
 * @returns Filtered staff members
 */
export function searchStaff(staff: StaffMember[], searchTerm: string): StaffMember[] {
  const term = searchTerm.toLowerCase().trim();
  if (!term) return staff;

  return staff.filter(member => 
    member.firstName.toLowerCase().includes(term) ||
    member.lastName.toLowerCase().includes(term) ||
    member.function.toLowerCase().includes(term) ||
    member.department.toLowerCase().includes(term) ||
    member.email.toLowerCase().includes(term) ||
    member.internalPhone.includes(term) ||
    (member.role && member.role.toLowerCase().includes(term)) ||
    (member.skills && member.skills.some(skill => skill.toLowerCase().includes(term))) ||
    (member.languages && member.languages.some(language => language.toLowerCase().includes(term)))
  );
}

/**
 * Sort staff members by given criteria
 */
export function sortStaffMembers(
  staff: StaffMember[], 
  sortBy: 'name' | 'department' | 'function' | 'lastSeen' = 'name',
  sortDirection: 'asc' | 'desc' = 'asc'
): StaffMember[] {
  return [...staff].sort((a, b) => {
    let valueA: any;
    let valueB: any;
    
    switch (sortBy) {
      case 'name':
        valueA = `${a.lastName} ${a.firstName}`.toLowerCase();
        valueB = `${b.lastName} ${b.firstName}`.toLowerCase();
        break;
      case 'department':
        valueA = a.department.toLowerCase();
        valueB = b.department.toLowerCase();
        break;
      case 'function':
        valueA = a.function.toLowerCase();
        valueB = b.function.toLowerCase();
        break;
      case 'lastSeen':
        valueA = a.lastSeen ? new Date(a.lastSeen).getTime() : 0;
        valueB = b.lastSeen ? new Date(b.lastSeen).getTime() : 0;
        break;
      default:
        valueA = a.lastName.toLowerCase();
        valueB = b.lastName.toLowerCase();
    }
    
    if (valueA < valueB) {
      return sortDirection === 'asc' ? -1 : 1;
    }
    if (valueA > valueB) {
      return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });
}

/**
 * Calculate staff statistics
 */
export function calculateStaffStatistics(staff: StaffMember[]) {
  return {
    totalStaff: staff.length,
    availableNow: staff.filter(member => member.isAvailable).length,
    unavailableNow: staff.filter(member => !member.isAvailable).length,
    absencesByReason: getAbsencesByReason(staff),
    departmentBreakdown: getDepartmentBreakdown(staff),
    roleBreakdown: getRoleBreakdown(staff),
    availabilityRate: getAvailabilityRate(staff)
  };
}

/**
 * Get department breakdown
 */
function getDepartmentBreakdown(staff: StaffMember[]) {
  const departments = [...new Set(staff.map(member => member.department))];
  return departments.map(department => {
    const membersInDepartment = staff.filter(member => member.department === department);
    return {
      department,
      count: membersInDepartment.length,
      availableCount: membersInDepartment.filter(member => member.isAvailable).length
    };
  });
}

/**
 * Get absences grouped by reason
 */
function getAbsencesByReason(staff: StaffMember[]) {
  const absentStaff = staff.filter(member => !member.isAvailable);
  const reasonsMap: Record<string, number> = {};
  
  absentStaff.forEach(member => {
    const reason = member.absenceReason || 'Non spécifié';
    if (reasonsMap[reason]) {
      reasonsMap[reason]++;
    } else {
      reasonsMap[reason] = 1;
    }
  });
  
  return Object.entries(reasonsMap).map(([reason, count]) => ({ reason, count }));
}

/**
 * Get role breakdown
 */
function getRoleBreakdown(staff: StaffMember[]) {
  const rolesSet = new Set<string>();
  staff.forEach(member => {
    if (member.role) rolesSet.add(member.role);
  });
  
  const roles = Array.from(rolesSet);
  return roles.map(role => {
    const membersInRole = staff.filter(member => member.role === role);
    return {
      role,
      count: membersInRole.length
    };
  });
}

/**
 * Get availability rate
 */
function getAvailabilityRate(staff: StaffMember[]) {
  if (staff.length === 0) return 0;
  const availableCount = staff.filter(member => member.isAvailable).length;
  return (availableCount / staff.length) * 100;
}

/**
 * Get time since last status change
 */
export function getTimeSinceLastSeen(lastSeen?: string): string {
  if (!lastSeen) return 'Inconnu';
  
  const lastSeenDate = new Date(lastSeen);
  const now = new Date();
  
  const diffMs = now.getTime() - lastSeenDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'À l\'instant';
  if (diffMins < 60) return `Il y a ${diffMins} min`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `Il y a ${diffHours} h`;
  
  const diffDays = Math.floor(diffHours / 24);
  return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
}