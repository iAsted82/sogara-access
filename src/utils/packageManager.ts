// Gestionnaire de colis pour le module PackagesModule

export interface Package {
  id: string;
  trackingNumber: string;
  senderName: string;
  senderOrganization?: string;
  recipientName: string;
  recipientDepartment: string;
  description: string;
  weight?: number;
  receivedDate: Date;
  status: 'pending' | 'delivered' | 'returned';
  priority: 'normal' | 'high' | 'urgent';
  signatureRequired: boolean;
  notes?: string;
}

export interface PackageStats {
  total: number;
  pending: number;
  delivered: number;
  returned: number;
  urgent: number;
  todayReceived: number;
}

// Données simulées de colis
const mockPackages: Package[] = [
  {
    id: 'pkg-001',
    trackingNumber: 'DHL123456789',
    senderName: 'Ministère des Finances',
    recipientName: 'Direction SOGARA',
    recipientDepartment: 'Administration',
    description: 'Documents administratifs urgents',
    weight: 0.5,
    receivedDate: new Date(),
    status: 'pending',
    priority: 'urgent',
    signatureRequired: true,
    notes: 'À remettre en main propre'
  },
  {
    id: 'pkg-002',
    trackingNumber: 'UPS987654321',
    senderName: 'TOTAL Gabon',
    recipientName: 'Service Technique',
    recipientDepartment: 'Maintenance',
    description: 'Pièces de rechange',
    weight: 2.3,
    receivedDate: new Date(Date.now() - 86400000),
    status: 'delivered',
    priority: 'normal',
    signatureRequired: false
  }
];

export class PackageManager {
  private packages: Package[] = mockPackages;

  // Obtenir tous les colis
  getAllPackages(): Package[] {
    return this.packages;
  }

  // Obtenir les colis en attente
  getPendingPackages(): Package[] {
    return this.packages.filter(pkg => pkg.status === 'pending');
  }

  // Obtenir les statistiques
  getPackageStats(): PackageStats {
    const total = this.packages.length;
    const pending = this.packages.filter(p => p.status === 'pending').length;
    const delivered = this.packages.filter(p => p.status === 'delivered').length;
    const returned = this.packages.filter(p => p.status === 'returned').length;
    const urgent = this.packages.filter(p => p.priority === 'urgent').length;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayReceived = this.packages.filter(p => {
      const pkgDate = new Date(p.receivedDate);
      pkgDate.setHours(0, 0, 0, 0);
      return pkgDate.getTime() === today.getTime();
    }).length;

    return {
      total,
      pending,
      delivered,
      returned,
      urgent,
      todayReceived
    };
  }

  // Ajouter un nouveau colis
  addPackage(packageData: Omit<Package, 'id'>): Package {
    const newPackage: Package = {
      id: `pkg-${Date.now()}`,
      ...packageData
    };
    
    this.packages.unshift(newPackage);
    return newPackage;
  }

  // Mettre à jour le statut d'un colis
  updatePackageStatus(packageId: string, status: Package['status'], notes?: string): boolean {
    const packageIndex = this.packages.findIndex(p => p.id === packageId);
    
    if (packageIndex === -1) return false;
    
    this.packages[packageIndex] = {
      ...this.packages[packageIndex],
      status,
      notes: notes || this.packages[packageIndex].notes
    };
    
    return true;
  }

  // Rechercher des colis
  searchPackages(query: string): Package[] {
    const lowerQuery = query.toLowerCase();
    return this.packages.filter(pkg => 
      pkg.trackingNumber.toLowerCase().includes(lowerQuery) ||
      pkg.senderName.toLowerCase().includes(lowerQuery) ||
      pkg.recipientName.toLowerCase().includes(lowerQuery) ||
      pkg.description.toLowerCase().includes(lowerQuery)
    );
  }

  // Obtenir un colis par ID
  getPackageById(id: string): Package | undefined {
    return this.packages.find(p => p.id === id);
  }

  // Supprimer un colis
  deletePackage(id: string): boolean {
    const initialLength = this.packages.length;
    this.packages = this.packages.filter(p => p.id !== id);
    return this.packages.length < initialLength;
  }
}

// Export singleton
export const packageManager = new PackageManager();