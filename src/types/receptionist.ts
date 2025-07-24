// Types spécifiques pour le module réceptionniste SOGARA

export interface Visitor {
  id: string;
  badgeNumber: string;
  
  // Informations personnelles
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  company: string;
  idType: 'CNI' | 'passeport' | 'permis' | 'autre';
  idNumber: string;
  nationality: string;
  photo?: string;
  
  // Détails de la visite
  purposeOfVisit: string;
  serviceRequested: string;
  employeeToVisit: string;
  department: string;
  appointmentRef?: string;
  expectedDuration: string;
  urgencyLevel: 'normal' | 'high' | 'vip';
  
  // Contrôle d'accès
  accessMode: 'libre' | 'badge' | 'escorte';
  accessZones: string[];
  securityLevel: 'standard' | 'elevated' | 'maximum';
  
  // Objets gardés
  hasKeptItems: boolean;
  keptItems: string[];
  
  // Temporisation
  checkInTime: string;
  checkOutTime?: string;
  duration?: string;
  expectedCheckOut?: string;
  
  // Statut et suivi
  status: 'present' | 'completed' | 'overdue' | 'emergency_exit';
  lastSeen: string;
  location: string;
  
  // QR Code et sécurité
  qrCode: string;
  issuedBy: string;
  
  // Évaluation
  satisfaction?: number;
  notes?: string;
  
  // AI et automatisation
  aiExtracted?: boolean;
  aiConfidence?: number;
  requiresVerification?: boolean;
}

export interface Badge {
  number: string;
  visitorId: string;
  issuedAt: string;
  expiresAt: string;
  status: 'active' | 'expired' | 'revoked' | 'lost';
  qrCode: string;
  accessZones: string[];
  securityLevel: string;
  printedBy: string;
}

export interface VisitorFormData {
  // Informations visiteur
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  company: string;
  idType: string;
  idNumber: string;
  nationality: string;
  
  // Détails de la visite
  purposeOfVisit: string;
  serviceRequested: string;
  employeeToVisit: string;
  department: string;
  appointmentRef: string;
  expectedDuration: string;
  urgencyLevel: string;
  
  // Mode d'accès
  accessMode: string;
  badgeNumber: string;
  accessZones: string[];
  securityLevel: string;
  
  // Objets gardés
  itemsKept: {
    keepItems: boolean;
    items: {
      passport: boolean;
      idCard: boolean;
      drivingLicense: boolean;
      mobilePhone: boolean;
      laptop: boolean;
      keys: boolean;
      wallet: boolean;
      other: boolean;
      otherDescription: string;
    };
  };
  
  // Conformité et sécurité
  hasSignedNDA: boolean;
  hasAcceptedTerms: boolean;
  photoConsent: boolean;
  emergencyContact: string;
  healthDeclaration: boolean;
  
  // IA et extraction
  aiExtracted: boolean;
  aiConfidence: number;
  requiresVerification: boolean;
  extractedData: any;
}

export interface ReceptionistStats {
  visitorsToday: number;
  visitorsWeek: number;
  visitorsMonth: number;
  badgesActive: number;
  badgesIssued: number;
  averageProcessingTime: number; // en secondes
  averageVisitDuration: number; // en minutes
  satisfactionScore: number;
  urgentVisitors: number;
  vipVisitors: number;
  overdueVisitors: number;
  emergencyContacts: number;
  aiExtractions: number;
  securityAlerts: number;
}

export interface EmergencyEvacuation {
  id: string;
  triggeredAt: string;
  triggeredBy: string;
  reason: string;
  visitorsPresent: Visitor[];
  evacuationStatus: 'initiated' | 'in_progress' | 'completed';
  completedAt?: string;
  notes?: string;
}

export interface SecurityAlert {
  id: string;
  type: 'overdue_visitor' | 'unauthorized_access' | 'lost_badge' | 'suspicious_activity' | 'emergency';
  visitorId?: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: string;
}

export interface AIExtraction {
  id: string;
  documentType: 'CNI' | 'passeport' | 'permis' | 'autre';
  extractedData: any;
  confidence: number;
  verified: boolean;
  verifiedBy?: string;
  timestamp: string;
  imageUrl?: string;
  corrections?: any;
}

export interface NotificationConfig {
  employeeEmail: boolean;
  employeeSMS: boolean;
  managerNotification: boolean;
  securityAlert: boolean;
  overdueReminder: boolean;
  vipProtocol: boolean;
}

export interface AccessZone {
  id: string;
  name: string;
  description: string;
  securityLevel: 'public' | 'restricted' | 'secure' | 'classified';
  requiresEscort: boolean;
  maxOccupancy?: number;
  currentOccupancy: number;
}

export interface Employee {
  id: string;
  name: string;
  department: string;
  position: string;
  email: string;
  phone: string;
  office: string;
  available: boolean;
  notifications: NotificationConfig;
}