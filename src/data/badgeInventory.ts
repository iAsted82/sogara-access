import { PhysicalBadge, BadgeStatus, BadgeInventoryStats, BadgeIssuanceRecord } from '../types/badge';
import { generateBadgeNumber } from '../utils/badgeManager';

/**
 * Données d'inventaire des badges physiques
 */
export const badgeInventory: PhysicalBadge[] = [
  {
    id: 'badge-001',
    badgeNumber: 'SOGARA-001',
    status: 'available',
    createdAt: new Date('2023-01-15'),
    lastUpdated: new Date(),
    issuedCount: 45,
    category: 'standard',
    zone: 'general'
  },
  {
    id: 'badge-002',
    badgeNumber: 'SOGARA-002',
    status: 'available',
    createdAt: new Date('2023-01-15'),
    lastUpdated: new Date(),
    issuedCount: 52,
    category: 'standard',
    zone: 'general'
  },
  {
    id: 'badge-003',
    badgeNumber: 'SOGARA-003',
    status: 'issued',
    createdAt: new Date('2023-01-15'),
    lastUpdated: new Date(),
    lastIssuedTo: 'v-001', // Marie OBAME
    lastIssuedAt: new Date('2024-06-10T09:15:00'),
    issuedCount: 38,
    category: 'standard',
    zone: 'general'
  },
  {
    id: 'badge-004',
    badgeNumber: 'SOGARA-004',
    status: 'issued',
    createdAt: new Date('2023-01-15'),
    lastUpdated: new Date(),
    lastIssuedTo: 'v-002', // Pierre NZAMBA
    lastIssuedAt: new Date('2024-06-10T10:30:00'),
    issuedCount: 41,
    category: 'standard',
    zone: 'general'
  },
  {
    id: 'badge-005',
    badgeNumber: 'SOGARA-005',
    status: 'damaged',
    createdAt: new Date('2023-01-15'),
    lastUpdated: new Date('2024-06-09'),
    issuedCount: 37,
    notes: 'Badge endommagé - à remplacer',
    category: 'standard',
    zone: 'general'
  },
  {
    id: 'badge-006',
    badgeNumber: 'SOGARA-VIP-001',
    status: 'available',
    createdAt: new Date('2023-01-15'),
    lastUpdated: new Date(),
    issuedCount: 12,
    category: 'vip',
    zone: 'all'
  },
  {
    id: 'badge-007',
    badgeNumber: 'SOGARA-007',
    status: 'lost',
    createdAt: new Date('2023-01-15'),
    lastUpdated: new Date('2024-06-08'),
    lastIssuedTo: 'v-previous',
    lastIssuedAt: new Date('2024-06-08T10:15:00'),
    issuedCount: 29,
    notes: 'Badge perdu par le visiteur',
    category: 'standard',
    zone: 'general'
  },
  {
    id: 'badge-008',
    badgeNumber: 'SOGARA-008',
    status: 'available',
    createdAt: new Date('2023-01-15'),
    lastUpdated: new Date(),
    issuedCount: 33,
    category: 'standard',
    zone: 'general'
  },
  {
    id: 'badge-009',
    badgeNumber: 'SOGARA-009',
    status: 'available',
    createdAt: new Date('2023-01-15'),
    lastUpdated: new Date(),
    issuedCount: 28,
    category: 'standard',
    zone: 'general'
  },
  {
    id: 'badge-010',
    badgeNumber: 'SOGARA-010',
    status: 'available',
    createdAt: new Date('2023-01-15'),
    lastUpdated: new Date(),
    issuedCount: 31,
    category: 'standard',
    zone: 'general'
  }
];

/**
 * Historique des attributions de badges
 */
export const badgeIssuanceHistory: BadgeIssuanceRecord[] = [
  {
    id: 'issuance-001',
    badgeId: 'badge-003',
    visitorId: 'v-001',
    visitorName: 'Marie OBAME',
    issuedAt: new Date('2024-06-10T09:15:00'),
    issuedBy: 'Sylvie MBOUMBA',
    isReturned: false,
    status: 'active',
    expectedReturnTime: new Date('2024-06-10T10:15:00')
  },
  {
    id: 'issuance-002',
    badgeId: 'badge-004',
    visitorId: 'v-002',
    visitorName: 'Pierre NZAMBA',
    issuedAt: new Date('2024-06-10T10:30:00'),
    issuedBy: 'Sylvie MBOUMBA',
    isReturned: false,
    status: 'active',
    expectedReturnTime: new Date('2024-06-10T11:15:00')
  },
  {
    id: 'issuance-003',
    badgeId: 'badge-001',
    visitorId: 'v-003',
    visitorName: 'Sophie ELLA',
    issuedAt: new Date('2024-06-10T11:00:00'),
    issuedBy: 'Sylvie MBOUMBA',
    returnedAt: new Date('2024-06-10T12:15:00'),
    returnedBy: 'Sylvie MBOUMBA',
    isReturned: true,
    status: 'completed'
  }
];

/**
 * Get available badges
 */
export function getAvailableBadges(): PhysicalBadge[] {
  return badgeInventory.filter(badge => badge.status === 'available');
}

/**
 * Get active badges (currently issued)
 */
export function getIssuedBadges(): PhysicalBadge[] {
  return badgeInventory.filter(badge => badge.status === 'issued');
}

/**
 * Calculate badge inventory statistics
 */
export function getBadgeInventoryStats(): BadgeInventoryStats {
  const total = badgeInventory.length;
  const available = badgeInventory.filter(b => b.status === 'available').length;
  const issued = badgeInventory.filter(b => b.status === 'issued').length;
  const returned = badgeInventory.filter(b => b.status === 'returned').length;
  const lost = badgeInventory.filter(b => b.status === 'lost').length;
  const damaged = badgeInventory.filter(b => b.status === 'damaged').length;
  const retired = badgeInventory.filter(b => b.status === 'retired').length;
  
  // Count badges issued today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const issuedToday = badgeIssuanceHistory.filter(record => {
    const issuedDate = new Date(record.issuedAt);
    issuedDate.setHours(0, 0, 0, 0);
    return issuedDate.getTime() === today.getTime();
  }).length;
  
  // Calculate return rate
  const totalIssuances = badgeIssuanceHistory.length;
  const totalReturns = badgeIssuanceHistory.filter(record => record.isReturned).length;
  const returnRate = totalIssuances > 0 ? (totalReturns / totalIssuances) * 100 : 100;
  
  return {
    total,
    available,
    issued,
    returned,
    lost,
    damaged,
    retired,
    issuedToday,
    returnRate
  };
}

/**
 * Get badge by ID
 */
export function getBadgeById(id: string): PhysicalBadge | undefined {
  return badgeInventory.find(badge => badge.id === id);
}

/**
 * Get badge by number
 */
export function getBadgeByNumber(badgeNumber: string): PhysicalBadge | undefined {
  return badgeInventory.find(badge => badge.badgeNumber === badgeNumber);
}

/**
 * Get badge issuance record by badge ID (active only)
 */
export function getActiveBadgeIssuance(badgeId: string): BadgeIssuanceRecord | undefined {
  return badgeIssuanceHistory.find(record => 
    record.badgeId === badgeId && !record.isReturned
  );
}

/**
 * Create a new badge
 */
export function createNewBadge(category: string = 'standard', zone: string = 'general', customNumber?: string): PhysicalBadge {
  const badgeNumber = customNumber || `SOGARA-${badgeInventory.length + 1}`.padStart(7, '0');
  
  const newBadge: PhysicalBadge = {
    id: `badge-${Date.now()}`,
    badgeNumber,
    status: 'available',
    createdAt: new Date(),
    lastUpdated: new Date(),
    issuedCount: 0,
    category,
    zone
  };
  
  // Add to inventory (in a real app, this would be persisted to a database)
  badgeInventory.push(newBadge);
  
  return newBadge;
}

/**
 * Issue a badge to a visitor
 */
export function issueBadge(
  badgeId: string, 
  visitorId: string, 
  visitorName: string, 
  issuedBy: string,
  expectedDuration: number = 30
): BadgeIssuanceRecord | undefined {
  // Find the badge
  const badge = getBadgeById(badgeId);
  if (!badge) return undefined;
  
  // Check if badge is available
  if (badge.status !== 'available') return undefined;
  
  // Calculate expected return time
  const now = new Date();
  const expectedReturnTime = new Date(now.getTime() + expectedDuration * 60000);
  
  // Create issuance record
  const issuanceRecord: BadgeIssuanceRecord = {
    id: `issuance-${Date.now()}`,
    badgeId,
    visitorId,
    visitorName,
    issuedAt: now,
    issuedBy,
    isReturned: false,
    status: 'active',
    expectedReturnTime
  };
  
  // Update badge status
  const badgeIndex = badgeInventory.findIndex(b => b.id === badgeId);
  if (badgeIndex !== -1) {
    badgeInventory[badgeIndex] = {
      ...badge,
      status: 'issued',
      lastUpdated: now,
      lastIssuedTo: visitorId,
      lastIssuedAt: now,
      issuedCount: badge.issuedCount + 1
    };
  }
  
  // Add issuance record
  badgeIssuanceHistory.push(issuanceRecord);
  
  return issuanceRecord;
}

/**
 * Return a badge
 */
export function returnBadge(
  badgeId: string,
  returnedBy: string,
  condition: 'good' | 'damaged' | 'lost' = 'good',
  notes?: string
): boolean {
  // Find the badge
  const badge = getBadgeById(badgeId);
  if (!badge) return false;
  
  // Find active issuance record
  const issuanceRecord = getActiveBadgeIssuance(badgeId);
  if (!issuanceRecord) return false;
  
  // Update issuance record
  const recordIndex = badgeIssuanceHistory.findIndex(record => record.id === issuanceRecord.id);
  if (recordIndex !== -1) {
    const now = new Date();
    badgeIssuanceHistory[recordIndex] = {
      ...issuanceRecord,
      returnedAt: now,
      returnedBy,
      isReturned: true,
      status: 'completed',
      notes: notes ? (issuanceRecord.notes ? `${issuanceRecord.notes}; ${notes}` : notes) : issuanceRecord.notes
    };
  }
  
  // Update badge status based on condition
  const badgeIndex = badgeInventory.findIndex(b => b.id === badgeId);
  if (badgeIndex !== -1) {
    const now = new Date();
    let newStatus: BadgeStatus = 'available';
    
    if (condition === 'damaged') {
      newStatus = 'damaged';
    } else if (condition === 'lost') {
      newStatus = 'lost';
    } else {
      newStatus = 'available';
    }
    
    badgeInventory[badgeIndex] = {
      ...badge,
      status: newStatus,
      lastUpdated: now,
      returnedAt: now,
      notes: notes ? (badge.notes ? `${badge.notes}; ${notes}` : notes) : badge.notes
    };
  }
  
  return true;
}

/**
 * Report a badge as lost
 */
export function reportBadgeLost(badgeId: string, reportedBy: string, notes?: string): boolean {
  // Find the badge
  const badge = getBadgeById(badgeId);
  if (!badge) return false;
  
  // If badge is issued, try to close the issuance record
  if (badge.status === 'issued') {
    const issuanceRecord = getActiveBadgeIssuance(badgeId);
    if (issuanceRecord) {
      const recordIndex = badgeIssuanceHistory.findIndex(record => record.id === issuanceRecord.id);
      if (recordIndex !== -1) {
        const now = new Date();
        badgeIssuanceHistory[recordIndex] = {
          ...issuanceRecord,
          returnedAt: now,
          returnedBy: reportedBy,
          isReturned: true,
          status: 'lost',
          notes: notes ? `Badge perdu: ${notes}` : 'Badge perdu'
        };
      }
    }
  }
  
  // Update badge status
  const badgeIndex = badgeInventory.findIndex(b => b.id === badgeId);
  if (badgeIndex !== -1) {
    const now = new Date();
    badgeInventory[badgeIndex] = {
      ...badge,
      status: 'lost',
      lastUpdated: now,
      notes: notes ? `Badge perdu: ${notes}` : (badge.notes ? `${badge.notes}; Badge perdu` : 'Badge perdu')
    };
    return true;
  }
  
  return false;
}

/**
 * Get badge issuance history
 */
export function getBadgeIssuanceHistory(): BadgeIssuanceRecord[] {
  return [...badgeIssuanceHistory].sort((a, b) => 
    new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime()
  );
}

/**
 * Get current active badge issuances
 */
export function getActiveBadgeIssuances(): BadgeIssuanceRecord[] {
  return badgeIssuanceHistory
    .filter(record => !record.isReturned)
    .sort((a, b) => new Date(a.issuedAt).getTime() - new Date(b.issuedAt).getTime());
}

/**
 * Get badge issuance history for a specific visitor
 */
export function getVisitorBadgeHistory(visitorId: string): BadgeIssuanceRecord[] {
  return badgeIssuanceHistory
    .filter(record => record.visitorId === visitorId)
    .sort((a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime());
}