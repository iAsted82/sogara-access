// Utilitaires pour la génération et gestion des badges visiteurs SOGARA

export interface BadgeData {
  number: string;
  visitorName: string;
  company: string;
  purpose: string;
  employeeToVisit: string;
  validDate: string;
  qrCode: string;
  accessZones: string[];
  photo?: string;
  securityLevel: string;
}

/**
 * Génère un numéro de badge unique au format V-YYYY-XXX
 */
export const generateBadgeNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const sequence = Math.floor(Math.random() * 999) + 1;
  return `V-${year}-${sequence.toString().padStart(3, '0')}`;
};

/**
 * Génère un QR Code pour le badge visiteur
 */
export const generateQRCode = (badgeNumber: string, visitorId: string): string => {
  const qrData = {
    badge: badgeNumber,
    visitor: visitorId,
    issued: new Date().toISOString(),
    org: 'DGI',
    type: 'visitor_access'
  };
  
  // En production, utiliser une vraie librairie QR Code
  // Pour la démonstration, on retourne une URL d'image
  return 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' + encodeURIComponent(JSON.stringify(qrData));
};

/**
 * Valide un numéro de badge
 */
export const validateBadgeNumber = (badgeNumber: string): boolean => {
  const badgeRegex = /^V-\d{4}-\d{3}$/;
  return badgeRegex.test(badgeNumber);
};

/**
 * Calcule l'expiration du badge (par défaut 24h)
 */
export const calculateBadgeExpiry = (duration?: string): Date => {
  const now = new Date();
  
  switch (duration) {
    case '15min':
      return new Date(now.getTime() + 15 * 60 * 1000);
    case '30min':
      return new Date(now.getTime() + 30 * 60 * 1000);
    case '45min':
      return new Date(now.getTime() + 45 * 60 * 1000);
    case '1h':
      return new Date(now.getTime() + 60 * 60 * 1000);
    case '2h':
      return new Date(now.getTime() + 2 * 60 * 60 * 1000);
    case '4h':
      return new Date(now.getTime() + 4 * 60 * 60 * 1000);
    case 'journee':
      return new Date(now.getTime() + 8 * 60 * 60 * 1000);
    default:
      return new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24h par défaut
  }
};

/**
 * Formate les données pour l'impression du badge
 */
export const formatBadgeForPrint = (badgeData: BadgeData): string => {
  return `
    <div class="badge-print" style="width: 86mm; height: 54mm; border: 1px solid #000; padding: 4mm; font-family: Arial, sans-serif;">
      <div style="display: flex; align-items: center; margin-bottom: 2mm;">
        <img src="/Photoroom_20250703_164401.PNG" style="width: 15mm; height: 15mm; margin-right: 3mm;" />
        <div>
          <div style="font-size: 8pt; font-weight: bold;">RÉPUBLIQUE GABONAISE</div>
          <div style="font-size: 7pt;">Direction Générale de la Documentation et de l'Immigration</div>
          <div style="font-size: 7pt;"></div>
        </div>
      </div>
      
      <div style="text-align: center; margin-bottom: 2mm;">
        <div style="font-size: 6pt; color: #666;">BADGE VISITEUR</div>
        <div style="font-size: 8pt; font-weight: bold;">${badgeData.number}</div>
      </div>
      
      <div style="display: flex; gap: 3mm;">
        <div style="flex: 1;">
          <div style="font-size: 9pt; font-weight: bold; margin-bottom: 1mm;">${badgeData.visitorName}</div>
          <div style="font-size: 7pt; margin-bottom: 1mm;">${badgeData.company}</div>
          <div style="font-size: 6pt; margin-bottom: 1mm;">Motif: ${badgeData.purpose}</div>
          <div style="font-size: 6pt; margin-bottom: 1mm;">Contact: ${badgeData.employeeToVisit}</div>
          <div style="font-size: 6pt;">Valide le: ${badgeData.validDate}</div>
        </div>
        <div style="width: 15mm; text-align: center;">
          <div style="width: 15mm; height: 15mm; border: 1px solid #ccc; margin-bottom: 1mm; background: url('${badgeData.qrCode}') center/contain no-repeat;"></div>
          <div style="font-size: 5pt;">QR Access</div>
        </div>
      </div>
      
      <div style="margin-top: 2mm; border-top: 1px solid #ccc; padding-top: 1mm;">
        <div style="font-size: 5pt; color: #666;">
          Zones autorisées: ${badgeData.accessZones.join(', ')}
          <br/>Développé et conçu par ORGANEUS Gabon pour la SOGARA | © ${new Date().getFullYear()} Tous droits réservés
        </div>
        <div style="font-size: 5pt; color: #666;">
          Sécurité: ${badgeData.securityLevel} • Badge SOGARA • À rendre à la sortie
        </div>
      </div>
    </div>
  `;
};

/**
 * Génère les instructions de sécurité pour le badge
 */
export const generateSecurityInstructions = (accessMode: string, securityLevel: string): string[] => {
  const baseInstructions = [
    "Port du badge obligatoire et visible en permanence",
    "Badge personnel et non transférable",
    "À rendre obligatoirement à la réception avant de quitter les locaux",
    "Signaler immédiatement toute perte ou vol du badge"
  ];

  const modeInstructions: { [key: string]: string[] } = {
    libre: [
      "Circulation autorisée dans les zones spécifiées uniquement",
      "Respecter les horaires d'ouverture des services"
    ],
    badge: [
      "Présenter le badge à chaque point de contrôle",
      "Accès limité aux zones autorisées par le badge"
    ],
    escorte: [
      "Accompagnement obligatoire par un agent DGDI",
      "Ne pas quitter votre accompagnateur"
    ]
  };

  const securityInstructions: { [key: string]: string[] } = {
    standard: [],
    elevated: [
      "Contrôle d'identité renforcé",
      "Enregistrement photo obligatoire"
    ],
    maximum: [
      "Escorte sécurisée obligatoire",
      "Fouille et contrôle des objets",
      "Zones classifiées - Confidentialité absolue"
    ]
  };

  return [
    ...baseInstructions,
    ...modeInstructions[accessMode] || [],
    ...securityInstructions[securityLevel] || []
  ];
};