// Générateur de badges et QR codes pour SOGARA Access
export interface BadgeData {
  number: string;
  visitorName: string;
  company: string;
  purpose: string;
  employeeToVisit: string;
  validDate: string;
  qrCode: string;
  accessZones: string[];
  securityLevel: 'standard' | 'elevated' | 'maximum';
}

// Générer un numéro de badge unique
export const generateBadgeNumber = (prefix = 'V'): string => {
  const year = new Date().getFullYear();
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `${prefix}-${year}-${timestamp}${random}`;
};

// Générer un QR code (simulation)
export const generateQRCode = (badgeNumber: string, visitorId: string): string => {
  const qrData = {
    badgeNumber,
    visitorId,
    timestamp: Date.now(),
    issuer: 'SOGARA-ACCESS',
    version: '1.0'
  };
  
  // En production, ceci utiliserait une vraie bibliothèque QR
  const encoded = btoa(JSON.stringify(qrData));
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="white"/>
      <rect x="20" y="20" width="160" height="160" fill="black"/>
      <rect x="30" y="30" width="140" height="140" fill="white"/>
      <text x="100" y="100" text-anchor="middle" font-family="monospace" font-size="8" fill="black">
        ${badgeNumber}
      </text>
      <text x="100" y="120" text-anchor="middle" font-family="monospace" font-size="6" fill="black">
        SOGARA ACCESS
      </text>
    </svg>
  `)}`;
};

// Valider un badge
export const validateBadge = (badgeNumber: string): boolean => {
  // Vérifier le format du badge
  const badgePattern = /^[A-Z]-\d{4}-\d{9}$/;
  return badgePattern.test(badgeNumber);
};

// Générer des données complètes de badge
export const generateBadgeData = (
  visitorInfo: {
    firstName: string;
    lastName: string;
    company: string;
    purpose: string;
    contactPerson: string;
    securityLevel?: 'standard' | 'elevated' | 'maximum';
  },
  visitorId: string
): BadgeData => {
  const badgeNumber = generateBadgeNumber();
  const qrCode = generateQRCode(badgeNumber, visitorId);
  
  // Déterminer les zones d'accès selon le niveau de sécurité
  const getAccessZones = (level: string): string[] => {
    switch (level) {
      case 'maximum':
        return ['Accueil', 'Zone Public', 'Zone Sécurisée', 'Direction'];
      case 'elevated':
        return ['Accueil', 'Zone Public', 'Zone Sécurisée'];
      default:
        return ['Accueil', 'Zone Public'];
    }
  };
  
  return {
    number: badgeNumber,
    visitorName: `${visitorInfo.firstName} ${visitorInfo.lastName}`,
    company: visitorInfo.company,
    purpose: visitorInfo.purpose,
    employeeToVisit: visitorInfo.contactPerson,
    validDate: new Date().toLocaleDateString('fr-FR'),
    qrCode,
    accessZones: getAccessZones(visitorInfo.securityLevel || 'standard'),
    securityLevel: visitorInfo.securityLevel || 'standard'
  };
};

// Décoder un QR code badge
export const decodeBadgeQR = (qrData: string): any => {
  try {
    // Extraire les données du QR code
    const decoded = atob(qrData.replace('data:image/svg+xml;base64,', ''));
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Erreur décodage QR:', error);
    return null;
  }
};

// Vérifier l'expiration d'un badge
export const isBadgeExpired = (validDate: string): boolean => {
  const badgeDate = new Date(validDate.split('/').reverse().join('-'));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return badgeDate < today;
};

// Générer un rapport de badge
export const generateBadgeReport = (badges: BadgeData[]): {
  total: number;
  active: number;
  expired: number;
  bySecurityLevel: Record<string, number>;
  byCompany: Record<string, number>;
} => {
  const report = {
    total: badges.length,
    active: 0,
    expired: 0,
    bySecurityLevel: {} as Record<string, number>,
    byCompany: {} as Record<string, number>
  };
  
  badges.forEach(badge => {
    // Compter actifs/expirés
    if (isBadgeExpired(badge.validDate)) {
      report.expired++;
    } else {
      report.active++;
    }
    
    // Compter par niveau de sécurité
    report.bySecurityLevel[badge.securityLevel] = 
      (report.bySecurityLevel[badge.securityLevel] || 0) + 1;
    
    // Compter par entreprise
    report.byCompany[badge.company] = 
      (report.byCompany[badge.company] || 0) + 1;
  });
  
  return report;
};