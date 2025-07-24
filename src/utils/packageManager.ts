// Utilitaires pour la gestion des colis
import { Package, PackageStatus, PackageType, PackageCreationData, PackageStats, PackagePriority } from '../types/package';

/**
 * Génère un numéro de suivi unique au format DGI-PKG-YYYYMMDD-XXX
 */
export function generateTrackingNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 900) + 100; // Nombre à 3 chiffres
  
  return `SOGARA-PKG-${year}${month}${day}-${random}`;
}

/**
 * Calcule automatiquement les frais d'expédition basés sur le poids et le type de colis
 * @param weight Poids en kg
 * @param packageType Type de colis
 * @param priority Priorité d'expédition
 * @returns Montant en CFA
 */
export function calculateShippingCost(weight: number = 1, packageType: PackageType, priority: PackagePriority): number {
  // Tarif de base selon le type de colis
  const baseRates: Record<PackageType, number> = {
    document: 1000, // 1000 CFA pour les documents
    envelope: 2000, // 2000 CFA pour les enveloppes
    box: 5000, // 5000 CFA pour les colis standard
    parcel: 10000, // 10000 CFA pour les grands colis
    fragile: 8000, // 8000 CFA pour les colis fragiles
    diplomatic: 0 // Gratuit pour les documents diplomatiques
  };

  // Multiplicateurs selon la priorité
  const priorityMultipliers: Record<PackagePriority, number> = {
    normal: 1.0,
    high: 1.5,
    urgent: 2.0
  };

  // Calcul du coût
  let cost = baseRates[packageType];
  
  // Ajustement selon le poids (sauf pour les documents et enveloppes)
  if (packageType !== 'document' && packageType !== 'envelope') {
    // Au-delà de 1kg, ajouter des frais supplémentaires
    const extraWeight = Math.max(0, weight - 1);
    cost += extraWeight * 1000; // 1000 CFA par kg supplémentaire
  }
  
  // Application du multiplicateur de priorité
  cost *= priorityMultipliers[priority];
  
  // Arrondir au multiple de 100 supérieur
  return Math.ceil(cost / 100) * 100;
}

/**
 * Valide les données du colis avant création
 * @returns Objet contenant les erreurs éventuelles
 */
export function validatePackageData(data: PackageCreationData): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  
  // Vérification des champs obligatoires
  if (!data.packageType) errors.packageType = 'Le type de colis est requis';
  if (!data.description?.trim()) errors.description = 'La description est requise';
  if (!data.senderName?.trim()) errors.senderName = 'Le nom de l\'expéditeur est requis';
  if (!data.recipientName?.trim()) errors.recipientName = 'Le nom du destinataire est requis';
  if (!data.recipientDepartment?.trim()) errors.recipientDepartment = 'Le service destinataire est requis';
  if (!data.priority) errors.priority = 'La priorité est requise';
  
  // Vérification du poids pour les colis
  if (['box', 'parcel', 'fragile'].includes(data.packageType) && (!data.weight || data.weight <= 0)) {
    errors.weight = 'Le poids est requis pour ce type de colis';
  }
  
  // Vérification du contact expéditeur si organisation fournie
  if (data.senderOrganization && !data.senderContact) {
    errors.senderContact = 'Le contact de l\'expéditeur est requis pour une organisation';
  }
  
  return { 
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Crée un nouveau colis à partir des données saisies
 */
export function createPackage(data: PackageCreationData, receivedBy: string): Package {
  const trackingNumber = generateTrackingNumber();
  const now = new Date();
  
  const newPackage: Package = {
    id: `pkg-${Date.now()}`,
    trackingNumber,
    packageType: data.packageType,
    description: data.description,
    
    // Méta-données
    weight: data.weight,
    imageUrl: undefined, // À remplir après upload
    
    // Statut et dates
    status: 'pending',
    priority: data.priority,
    receivedDate: now,
    receivedTime: now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    
    // Expéditeur
    senderName: data.senderName,
    senderOrganization: data.senderOrganization,
    senderContact: data.senderContact,
    
    // Destinataire
    recipientName: data.recipientName,
    recipientDepartment: data.recipientDepartment,
    recipientContact: data.recipientContact,
    
    // Traitement
    receivedBy,
    signatureRequired: data.signatureRequired,
    
    // Frais
    shippingCost: data.weight ? calculateShippingCost(data.weight, data.packageType, data.priority) : 0,
    isPrepaid: data.isPrepaid,
    
    // Informations additionnelles
    notes: data.notes,
    lastUpdated: now,
    isDeleted: false
  };
  
  return newPackage;
}

/**
 * Met à jour le statut d'un colis
 */
export function updatePackageStatus(pkg: Package, newStatus: PackageStatus, updatedBy: string, notes?: string): Package {
  const now = new Date();
  
  const updatedPackage: Package = {
    ...pkg,
    status: newStatus,
    lastUpdated: now,
    notes: notes ? `${pkg.notes ? pkg.notes + ' | ' : ''}${now.toLocaleDateString('fr-FR')}: ${notes}` : pkg.notes
  };
  
  // Si le colis est livré, ajouter les informations de livraison
  if (newStatus === 'delivered' && pkg.status !== 'delivered') {
    updatedPackage.deliveredDate = now;
    updatedPackage.deliveryTime = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    updatedPackage.deliveredBy = updatedBy;
  }
  
  return updatedPackage;
}

/**
 * Calcule les statistiques des colis
 */
export function calculatePackageStats(packages: Package[]): PackageStats {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return {
    total: packages.filter(pkg => !pkg.isDeleted).length,
    pending: packages.filter(pkg => pkg.status === 'pending' && !pkg.isDeleted).length,
    delivered: packages.filter(pkg => pkg.status === 'delivered' && !pkg.isDeleted).length,
    returned: packages.filter(pkg => pkg.status === 'returned' && !pkg.isDeleted).length,
    canceled: packages.filter(pkg => pkg.status === 'canceled' && !pkg.isDeleted).length,
    lost: packages.filter(pkg => pkg.status === 'lost' && !pkg.isDeleted).length,
    urgent: packages.filter(pkg => pkg.priority === 'urgent' && !pkg.isDeleted).length,
    todayReceived: packages.filter(pkg => {
      const receivedDate = new Date(pkg.receivedDate);
      receivedDate.setHours(0, 0, 0, 0);
      return receivedDate.getTime() === today.getTime() && !pkg.isDeleted;
    }).length,
    todayDelivered: packages.filter(pkg => {
      if (!pkg.deliveredDate) return false;
      const deliveredDate = new Date(pkg.deliveredDate);
      deliveredDate.setHours(0, 0, 0, 0);
      return deliveredDate.getTime() === today.getTime() && !pkg.isDeleted;
    }).length
  };
}

/**
 * Formate les données d'un colis pour l'impression d'un récépissé
 */
export function formatPackageReceipt(pkg: Package): string {
  const { trackingNumber, packageType, description, senderName, recipientName, 
    recipientDepartment, receivedDate, priority, shippingCost } = pkg;
  
  const formattedDate = new Date(receivedDate).toLocaleDateString('fr-FR');
  const formattedTime = pkg.receivedTime;
  
  const packageTypeLabels: Record<PackageType, string> = {
    document: 'Document',
    envelope: 'Enveloppe',
    box: 'Colis standard',
    parcel: 'Colis volumineux',
    fragile: 'Colis fragile',
    diplomatic: 'Document diplomatique'
  };
  
  const priorityLabels: Record<PackagePriority, string> = {
    normal: 'Standard',
    high: 'Prioritaire',
    urgent: 'Urgent'
  };
  
  return `
    RÉCÉPISSÉ DE COLIS - SOGARA Access
    ===============================
    
    N° de suivi: ${trackingNumber}
    Date/heure: ${formattedDate} à ${formattedTime}
    
    INFORMATIONS COLIS
    ------------------
    Type: ${packageTypeLabels[packageType]}
    Description: ${description}
    Priorité: ${priorityLabels[priority]}
    ${pkg.weight ? `Poids: ${pkg.weight} kg` : ''}
    
    EXPÉDITEUR
    ----------
    ${senderName}
    ${pkg.senderOrganization ? `Organisation: ${pkg.senderOrganization}` : ''}
    ${pkg.senderContact ? `Contact: ${pkg.senderContact}` : ''}
    
    DESTINATAIRE
    -----------
    ${recipientName}
    Service: ${recipientDepartment}
    ${pkg.recipientContact ? `Contact: ${pkg.recipientContact}` : ''}
    
    INFORMATIONS ADDITIONNELLES
    --------------------------
    Signature requise: ${pkg.signatureRequired ? 'Oui' : 'Non'}
    ${shippingCost ? `Frais d'expédition: ${shippingCost.toLocaleString('fr-FR')} CFA` : ''}
    ${pkg.notes ? `Notes: ${pkg.notes}` : ''}
    
    Reçu par: ${pkg.receivedBy}
    
    
    SOGARA Access - Direction Générale de la Documentation et de l'Immigration
    Pour suivre votre colis: https://sogara.access.ga/tracking/${trackingNumber}
  `;
}

/**
 * Génère un QR code pour le suivi du colis
 */
export function generatePackageQRCode(trackingNumber: string): string {
  // En production, utiliser une vraie librairie QR code
  return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(trackingNumber)}`;
}

/**
 * Génère un modèle de notification pour un changement de statut de colis
 */
export function generateStatusChangeNotification(pkg: Package, oldStatus: PackageStatus): string {
  const statusLabels: Record<PackageStatus, string> = {
    pending: 'En attente',
    delivered: 'Livré',
    returned: 'Retourné',
    canceled: 'Annulé',
    lost: 'Perdu'
  };

  const templates: Record<PackageStatus, string> = {
    pending: `Le colis ${pkg.trackingNumber} a été reçu et est en attente de livraison.`,
    delivered: `Le colis ${pkg.trackingNumber} a été livré à ${pkg.recipientName} (${pkg.recipientDepartment}).`,
    returned: `Le colis ${pkg.trackingNumber} a été retourné à l'expéditeur.`,
    canceled: `Le colis ${pkg.trackingNumber} a été annulé.`,
    lost: `Le colis ${pkg.trackingNumber} a été signalé comme perdu.`
  };

  return `
    📦 DGDI Access - Changement de statut
    
    ${templates[pkg.status]}
    
    Statut précédent: ${statusLabels[oldStatus]}
    Nouveau statut: ${statusLabels[pkg.status]}
    Mis à jour le: ${new Date().toLocaleString('fr-FR')}
    
    ${pkg.priority === 'urgent' ? '⚠️ Ce colis est marqué comme URGENT' : ''}
    
    Pour plus d'informations, consultez les détails du colis.
  `;
}