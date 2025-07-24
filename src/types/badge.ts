/**
 * Types pour la gestion des badges visiteurs DGI
 */

export type BadgeStatus = 
  | 'available'  // Badge disponible pour attribution
  | 'issued'     // Badge attribué à un visiteur
  | 'returned'   // Badge retourné et prêt à être réutilisé
  | 'lost'       // Badge signalé comme perdu
  | 'damaged'    // Badge endommagé, non utilisable
  | 'retired';   // Badge retiré de la circulation

export interface PhysicalBadge {
  id: string;
  badgeNumber: string;
  status: BadgeStatus;
  createdAt: Date;
  lastUpdated: Date;
  lastIssuedTo?: string;  // ID du dernier visiteur
  lastIssuedAt?: Date;    // Date de dernière attribution
  returnedAt?: Date;      // Date de dernier retour
  issuedCount: number;    // Nombre total d'attributions
  notes?: string;         // Notes sur le badge (endommagements, etc.)
  category?: string;      // Catégorie du badge (standard, VIP, etc.)
  zone?: string;          // Zone d'accès autorisée
}

export interface BadgeIssuanceRecord {
  id: string;
  badgeId: string;
  visitorId: string;
  visitorName: string;
  issuedAt: Date;
  issuedBy: string;
  returnedAt?: Date;
  returnedBy?: string;
  expectedReturnTime?: Date;
  isReturned: boolean;
  status: 'active' | 'completed' | 'overdue' | 'lost';
  notes?: string;
}

export interface BadgeInventoryStats {
  total: number;
  available: number;
  issued: number;
  returned: number;
  lost: number;
  damaged: number;
  retired: number;
  issuedToday: number;
  returnRate: number;
}

export interface BadgeForm {
  badgeNumber: string;
  category?: string;
  zone?: string;
  notes?: string;
}

export interface BadgeAssignmentForm {
  badgeId: string;
  visitorId: string;
  visitorName: string;
  expectedDuration: number;
  notes?: string;
}

export interface BadgeReturnForm {
  badgeId: string;
  badgeNumber: string;
  returnNotes?: string;
  condition: 'good' | 'damaged' | 'lost';
}