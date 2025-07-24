// Traductions pour l'application SOGARA Access
// Système multilingue pour l'interface

export type LocaleKey = 'fr' | 'en' | 'es';

export interface TranslationDictionary {
  [key: string]: {
    [locale in LocaleKey]: string;
  };
}

export const translations: TranslationDictionary = {
  // Navigation et titres de pages
  'badge_management': {
    fr: 'Gestion des Badges',
    en: 'Badge Management',
    es: 'Gestión de Credenciales'
  },
  'badge_issuance': {
    fr: 'Délivrance de Badge',
    en: 'Badge Issuance',
    es: 'Emisión de Credencial'
  },
  'badge_return': {
    fr: 'Retour de Badge',
    en: 'Badge Return',
    es: 'Devolución de Credencial'
  },
  'badge_history': {
    fr: 'Historique des Badges',
    en: 'Badge History',
    es: 'Historial de Credenciales'
  },
  'badge_reports': {
    fr: 'Rapports de Badges',
    en: 'Badge Reports',
    es: 'Informes de Credenciales'
  },
  'active_badges': {
    fr: 'Badges Actifs',
    en: 'Active Badges',
    es: 'Credenciales Activas'
  },
  
  // Statuts de badge
  'status_issued': {
    fr: 'Délivré',
    en: 'Issued',
    es: 'Entregado'
  },
  'status_returned': {
    fr: 'Retourné',
    en: 'Returned',
    es: 'Devuelto'
  },
  'status_lost': {
    fr: 'Perdu',
    en: 'Lost',
    es: 'Perdido'
  },
  'status_damaged': {
    fr: 'Endommagé',
    en: 'Damaged',
    es: 'Dañado'
  },
  
  // Champs de formulaire
  'badge_number': {
    fr: 'Numéro de badge',
    en: 'Badge number',
    es: 'Número de credencial'
  },
  'visitor_name': {
    fr: 'Nom du visiteur',
    en: 'Visitor name',
    es: 'Nombre del visitante'
  },
  'issue_date': {
    fr: 'Date de délivrance',
    en: 'Issue date',
    es: 'Fecha de emisión'
  },
  'return_date': {
    fr: 'Date de retour',
    en: 'Return date',
    es: 'Fecha de devolución'
  },
  'notes': {
    fr: 'Notes / Commentaires',
    en: 'Notes / Comments',
    es: 'Notas / Comentarios'
  },
  'issued_by': {
    fr: 'Délivré par',
    en: 'Issued by',
    es: 'Entregado por'
  },
  'returned_to': {
    fr: 'Retourné à',
    en: 'Returned to',
    es: 'Devuelto a'
  },
  
  // Actions
  'issue_badge': {
    fr: 'Délivrer un badge',
    en: 'Issue badge',
    es: 'Entregar credencial'
  },
  'return_badge': {
    fr: 'Retourner un badge',
    en: 'Return badge',
    es: 'Devolver credencial'
  },
  'report_lost': {
    fr: 'Signaler comme perdu',
    en: 'Report as lost',
    es: 'Reportar como perdido'
  },
  'report_damaged': {
    fr: 'Signaler comme endommagé',
    en: 'Report as damaged',
    es: 'Reportar como dañado'
  },
  'generate_report': {
    fr: 'Générer un rapport',
    en: 'Generate report',
    es: 'Generar informe'
  },
  'search': {
    fr: 'Rechercher',
    en: 'Search',
    es: 'Buscar'
  },
  'cancel': {
    fr: 'Annuler',
    en: 'Cancel',
    es: 'Cancelar'
  },
  'save': {
    fr: 'Enregistrer',
    en: 'Save',
    es: 'Guardar'
  },
  'confirm': {
    fr: 'Confirmer',
    en: 'Confirm',
    es: 'Confirmar'
  },
  
  // Messages de validation
  'required_field': {
    fr: 'Ce champ est obligatoire',
    en: 'This field is required',
    es: 'Este campo es obligatorio'
  },
  'invalid_badge_number': {
    fr: 'Numéro de badge invalide',
    en: 'Invalid badge number',
    es: 'Número de credencial inválido'
  },
  'badge_not_found': {
    fr: 'Badge non trouvé',
    en: 'Badge not found',
    es: 'Credencial no encontrada'
  },
  'badge_already_returned': {
    fr: 'Ce badge a déjà été retourné',
    en: 'This badge has already been returned',
    es: 'Esta credencial ya ha sido devuelta'
  },
  
  // Messages de succès
  'badge_issued_success': {
    fr: 'Badge délivré avec succès',
    en: 'Badge issued successfully',
    es: 'Credencial entregada exitosamente'
  },
  'badge_returned_success': {
    fr: 'Badge retourné avec succès',
    en: 'Badge returned successfully',
    es: 'Credencial devuelta exitosamente'
  },
  'badge_updated_success': {
    fr: 'Badge mis à jour avec succès',
    en: 'Badge updated successfully',
    es: 'Credencial actualizada exitosamente'
  },
  
  // Statistiques et rapports
  'total_badges': {
    fr: 'Total des badges',
    en: 'Total badges',
    es: 'Total de credenciales'
  },
  'active_badges': {
    fr: 'Badges actifs',
    en: 'Active badges',
    es: 'Credenciales activas'
  },
  'returned_badges': {
    fr: 'Badges retournés',
    en: 'Returned badges',
    es: 'Credenciales devueltas'
  },
  'return_rate': {
    fr: 'Taux de retour',
    en: 'Return rate',
    es: 'Tasa de devolución'
  },
  'badges_issued_today': {
    fr: 'Badges délivrés aujourd\'hui',
    en: 'Badges issued today',
    es: 'Credenciales entregadas hoy'
  },
  'badges_returned_today': {
    fr: 'Badges retournés aujourd\'hui',
    en: 'Badges returned today',
    es: 'Credenciales devueltas hoy'
  },
  
  // Instructions
  'badge_issuance_instructions': {
    fr: 'Enregistrez les informations du visiteur et délivrez un badge physique avec le numéro généré',
    en: 'Record visitor information and issue a physical badge with the generated number',
    es: 'Registre la información del visitante y entregue una credencial física con el número generado'
  },
  'badge_return_instructions': {
    fr: 'Scannez ou saisissez le numéro du badge retourné par le visiteur',
    en: 'Scan or enter the badge number returned by the visitor',
    es: 'Escanee o ingrese el número de la credencial devuelta por el visitante'
  },
  'surveillance_disabled': {
    fr: 'Les fonctionnalités de surveillance ont été désactivées',
    en: 'Surveillance features have been disabled',
    es: 'Las funciones de vigilancia han sido desactivadas'
  },
  
  // En-têtes de tableau
  'table_badge_number': {
    fr: 'N° Badge',
    en: 'Badge No.',
    es: 'N° Credencial'
  },
  'table_visitor_name': {
    fr: 'Visiteur',
    en: 'Visitor',
    es: 'Visitante'
  },
  'table_issue_date': {
    fr: 'Délivré le',
    en: 'Issued on',
    es: 'Emitido el'
  },
  'table_return_date': {
    fr: 'Retourné le',
    en: 'Returned on',
    es: 'Devuelto el'
  },
  'table_status': {
    fr: 'Statut',
    en: 'Status',
    es: 'Estado'
  },
  'table_actions': {
    fr: 'Actions',
    en: 'Actions',
    es: 'Acciones'
  },
  
  // Messages d'interface
  'no_active_badges': {
    fr: 'Aucun badge actif',
    en: 'No active badges',
    es: 'No hay credenciales activas'
  },
  'no_results': {
    fr: 'Aucun résultat trouvé',
    en: 'No results found',
    es: 'No se encontraron resultados'
  },
  'days_active': {
    fr: 'jours actif',
    en: 'days active',
    es: 'días activo'
  },
  'date_format': {
    fr: 'jj/mm/aaaa',
    en: 'mm/dd/yyyy',
    es: 'dd/mm/aaaa'
  }
};

/**
 * Obtient la traduction d'une clé dans la langue spécifiée
 * @param key Clé de traduction
 * @param locale Code de langue (fr, en, es)
 * @returns Texte traduit ou clé si non trouvée
 */
export function getTranslation(key: string, locale: LocaleKey = 'fr'): string {
  if (!translations[key]) {
    console.warn(`Missing translation for key: ${key}`);
    return key;
  }
  
  return translations[key][locale] || translations[key].fr;
}

/**
 * Hook pour utiliser les traductions dans un composant
 * @param locale Code de langue actif
 * @returns Fonction de traduction
 */
export function useTranslation(locale: LocaleKey = 'fr') {
  return (key: string) => getTranslation(key, locale);
}