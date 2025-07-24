// Gestionnaire des badges physiques pour visiteurs SOGARA

export interface Badge {
  id: string;               // Identifiant unique dans la base de données
  badgeNumber: string;      // Numéro de badge physique unique
  visitorName: string;      // Nom complet du visiteur
  issueDate: Date;          // Date et heure de délivrance
  returnDate?: Date;        // Date et heure de retour (si retourné)
  status: BadgeStatus;      // Statut actuel du badge
  notes?: string;           // Notes additionnelles
  issuedBy: string;         // Agent qui a délivré le badge
  returnedTo?: string;      // Agent qui a reçu le badge retourné
  visitorId?: string;       // Référence à un visiteur enregistré (optionnel)
}

export type BadgeStatus = 'issued' | 'returned' | 'lost' | 'damaged';

/**
 * Génère un numéro de badge unique au format DGI-YYYYMMDD-XXX
 */
export function generateBadgeNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  
  // Générer un numéro aléatoire à 3 chiffres
  const random = Math.floor(Math.random() * 900) + 100;
  
  return `SOGARA-${year}${month}${day}-${random}`;
}

/**
 * Valide que le numéro de badge respecte le format attendu
 */
export function validateBadgeNumber(badgeNumber: string): boolean {
  const regex = /^SOGARA-\d{8}-\d{3}$/;
  return regex.test(badgeNumber);
}

/**
 * Obtient la liste des badges par statut
 */
export function getBadgesByStatus(badges: Badge[], status?: BadgeStatus): Badge[] {
  if (!status) return badges;
  return badges.filter(badge => badge.status === status);
}

/**
 * Obtient les statistiques des badges
 */
export interface BadgeStats {
  total: number;
  active: number;
  returned: number;
  lost: number;
  damaged: number;
  issuedToday: number;
  returnedToday: number;
}

export function getBadgeStatistics(badges: Badge[]): BadgeStats {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return {
    total: badges.length,
    active: badges.filter(badge => badge.status === 'issued').length,
    returned: badges.filter(badge => badge.status === 'returned').length,
    lost: badges.filter(badge => badge.status === 'lost').length,
    damaged: badges.filter(badge => badge.status === 'damaged').length,
    issuedToday: badges.filter(badge => {
      const issueDate = new Date(badge.issueDate);
      issueDate.setHours(0, 0, 0, 0);
      return issueDate.getTime() === today.getTime();
    }).length,
    returnedToday: badges.filter(badge => {
      if (!badge.returnDate) return false;
      const returnDate = new Date(badge.returnDate);
      returnDate.setHours(0, 0, 0, 0);
      return returnDate.getTime() === today.getTime();
    }).length
  };
}

/**
 * Vérifie si un badge est actuellement actif
 */
export function isBadgeActive(badge: Badge): boolean {
  return badge.status === 'issued';
}

/**
 * Convertit un statut de badge en texte localisé
 */
export function getBadgeStatusText(status: BadgeStatus, locale = 'fr'): string {
  const statusTexts: Record<BadgeStatus, Record<string, string>> = {
    issued: {
      fr: 'Délivré',
      en: 'Issued',
      es: 'Entregado'
    },
    returned: {
      fr: 'Retourné',
      en: 'Returned', 
      es: 'Devuelto'
    },
    lost: {
      fr: 'Perdu',
      en: 'Lost',
      es: 'Perdido'
    },
    damaged: {
      fr: 'Endommagé',
      en: 'Damaged',
      es: 'Dañado'
    }
  };
  
  return statusTexts[status][locale] || statusTexts[status].fr;
}

/**
 * Formate une date en texte localisé
 */
export function formatDate(date: Date, locale = 'fr'): string {
  const options: Intl.DateTimeFormatOptions = { 
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return new Intl.DateTimeFormat(locale, options).format(date);
}

/**
 * Génère un rapport d'audit des mouvements de badges
 */
export function generateBadgeAuditReport(badges: Badge[], locale = 'fr'): string {
  const translations = {
    title: {
      fr: 'RAPPORT D\'AUDIT DES BADGES VISITEURS',
      en: 'VISITOR BADGE AUDIT REPORT',
      es: 'INFORME DE AUDITORÍA DE CREDENCIALES DE VISITANTES'
    },
    badgeNumber: {
      fr: 'Numéro de badge',
      en: 'Badge number',
      es: 'Número de credencial'
    },
    visitorName: {
      fr: 'Nom du visiteur',
      en: 'Visitor name',
      es: 'Nombre del visitante'
    },
    issued: {
      fr: 'Délivré le',
      en: 'Issued on',
      es: 'Entregado el'
    },
    returned: {
      fr: 'Retourné le',
      en: 'Returned on',
      es: 'Devuelto el'
    },
    status: {
      fr: 'Statut',
      en: 'Status',
      es: 'Estado'
    },
    notReturned: {
      fr: 'Non retourné',
      en: 'Not returned',
      es: 'No devuelto'
    },
    summary: {
      fr: 'RÉSUMÉ',
      en: 'SUMMARY',
      es: 'RESUMEN'
    },
    total: {
      fr: 'Total des badges',
      en: 'Total badges',
      es: 'Total de credenciales'
    },
    active: {
      fr: 'Badges actifs',
      en: 'Active badges',
      es: 'Credenciales activas'
    },
    returnRate: {
      fr: 'Taux de retour',
      en: 'Return rate',
      es: 'Tasa de devolución'
    }
  };
  
  const t = (key: keyof typeof translations) => translations[key][locale] || translations[key].fr;
  
  let report = `${t('title')}\n`;
  report += `${'='.repeat(50)}\n\n`;
  report += `${t('badgeNumber')}\t${t('visitorName')}\t${t('issued')}\t${t('returned')}\t${t('status')}\n`;
  report += `${'-'.repeat(120)}\n`;
  
  badges.forEach(badge => {
    const returnedText = badge.returnDate 
      ? formatDate(badge.returnDate, locale) 
      : t('notReturned');
    
    report += `${badge.badgeNumber}\t${badge.visitorName}\t${formatDate(badge.issueDate, locale)}\t${returnedText}\t${getBadgeStatusText(badge.status, locale)}\n`;
  });
  
  const stats = getBadgeStatistics(badges);
  const returnRate = badges.length > 0 
    ? Math.round((stats.returned / badges.length) * 100) 
    : 0;
  
  report += `\n${t('summary')}\n`;
  report += `${'-'.repeat(30)}\n`;
  report += `${t('total')}: ${badges.length}\n`;
  report += `${t('active')}: ${stats.active}\n`;
  report += `${t('returnRate')}: ${returnRate}%\n`;
  
  return report;
}

/**
 * Recherche des badges selon différents critères
 */
export function searchBadges(badges: Badge[], query: string): Badge[] {
  const lowercaseQuery = query.toLowerCase().trim();
  
  return badges.filter(badge => 
    badge.badgeNumber.toLowerCase().includes(lowercaseQuery) ||
    badge.visitorName.toLowerCase().includes(lowercaseQuery) ||
    (badge.notes && badge.notes.toLowerCase().includes(lowercaseQuery))
  );
}