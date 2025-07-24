// Types pour le système de gestion des colis
import { User } from '../contexts/AuthContext';

export type PackageStatus = 
  | 'pending' // En attente à la réception
  | 'delivered' // Livré au service concerné
  | 'returned' // Retourné à l'expéditeur
  | 'canceled' // Colis annulé
  | 'lost'; // Colis perdu

export type PackageType =
  | 'document' // Documents administratifs
  | 'envelope' // Enveloppes
  | 'box' // Colis standard
  | 'parcel' // Grands colis
  | 'fragile' // Colis fragile
  | 'diplomatic'; // Documents diplomatiques

export type PackagePriority = 
  | 'normal' // Priorité standard
  | 'high' // Priorité élevée
  | 'urgent'; // Urgence

export interface Package {
  id: string;
  trackingNumber: string;
  packageType: PackageType;
  description: string;
  
  // Méta-données
  weight?: number; // En kg
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };
  imageUrl?: string;
  
  // Statut et dates
  status: PackageStatus;
  priority: PackagePriority;
  receivedDate: Date;
  receivedTime: string;
  deliveredDate?: Date;
  deliveryTime?: string;
  
  // Expéditeur
  senderName: string;
  senderOrganization?: string;
  senderContact?: string;
  
  // Destinataire
  recipientName: string;
  recipientDepartment: string;
  recipientOffice?: string;
  recipientContact?: string;
  
  // Traitement
  receivedBy: string; // Réceptionniste qui a reçu le colis
  deliveredBy?: string; // Personne qui a livré le colis
  signatureRequired: boolean;
  signatureImageUrl?: string;
  signedBy?: string;
  
  // Frais et coûts
  shippingCost?: number;
  customsFees?: number;
  isPrepaid: boolean;
  
  // Informations additionnelles
  notes?: string;
  tags?: string[];
  lastUpdated: Date;
  isDeleted: boolean;
}

export interface PackageCreationData {
  packageType: PackageType;
  description: string;
  weight?: number;
  senderName: string;
  senderOrganization?: string;
  senderContact?: string;
  recipientName: string;
  recipientDepartment: string;
  recipientContact?: string;
  priority: PackagePriority;
  signatureRequired: boolean;
  notes?: string;
  isPrepaid: boolean;
}

export interface PackageStats {
  total: number;
  pending: number;
  delivered: number;
  returned: number;
  canceled: number;
  lost: number;
  urgent: number;
  todayReceived: number;
  todayDelivered: number;
}

export interface PackageFilters {
  status: PackageStatus | 'all';
  packageType: PackageType | 'all';
  dateRange?: {
    start: Date;
    end: Date;
  };
  search?: string;
  department?: string;
  priority?: PackagePriority | 'all';
}

export interface PackageNotification {
  id: string;
  packageId: string;
  recipientId: string;
  message: string;
  type: 'receipt' | 'delivery' | 'reminder' | 'status_change';
  timestamp: Date;
  isRead: boolean;
  action?: string;
}