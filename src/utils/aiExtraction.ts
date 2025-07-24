// Simulation de l'extraction IA pour les documents d'identité

export interface ExtractionResult {
  success: boolean;
  confidence: number;
  data: {
    firstName?: string;
    lastName?: string;
    idNumber?: string;
    idType?: string;
    nationality?: string;
    birthDate?: string;
    issueDate?: string;
    expiryDate?: string;
    placeOfBirth?: string;
  };
  warnings: string[];
  requiresVerification: boolean;
}

/**
 * Simule l'extraction IA d'une CNI gabonaise
 */
export const extractCNIData = async (imageData: string | File): Promise<ExtractionResult> => {
  // Simulation d'un délai de traitement IA
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Données mockées pour la démonstration
  const mockData = [
    {
      firstName: 'Marie',
      lastName: 'OBAME',
      idNumber: '240115001234',
      nationality: 'Gabonaise',
      birthDate: '1985-03-15',
      issueDate: '2020-01-15',
      expiryDate: '2030-01-15',
      placeOfBirth: 'Libreville'
    },
    {
      firstName: 'Jean',
      lastName: 'MBENG',
      idNumber: '240116005678',
      nationality: 'Gabonaise',
      birthDate: '1978-08-22',
      issueDate: '2019-06-10',
      expiryDate: '2029-06-10',
      placeOfBirth: 'Port-Gentil'
    },
    {
      firstName: 'Sophie',
      lastName: 'ELLA',
      idNumber: '240117009012',
      nationality: 'Gabonaise',
      birthDate: '1990-12-05',
      issueDate: '2021-11-20',
      expiryDate: '2031-11-20',
      placeOfBirth: 'Franceville'
    }
  ];
  
  const randomData = mockData[Math.floor(Math.random() * mockData.length)];
  const confidence = 0.85 + Math.random() * 0.14; // 85-99%
  
  const warnings: string[] = [];
  
  if (confidence < 0.90) {
    warnings.push('Qualité d\'image moyennée - Vérification recommandée');
  }
  
  if (confidence < 0.85) {
    warnings.push('Document partiellement lisible');
  }
  
  return {
    success: true,
    confidence,
    data: {
      ...randomData,
      idType: 'CNI'
    },
    warnings,
    requiresVerification: confidence < 0.95
  };
};

/**
 * Simule l'extraction IA d'un passeport
 */
export const extractPassportData = async (imageData: string | File): Promise<ExtractionResult> => {
  await new Promise(resolve => setTimeout(resolve, 2500));
  
  const mockData = {
    firstName: 'André',
    lastName: 'KOMBILA',
    idNumber: 'GA1234567',
    nationality: 'Gabonaise',
    birthDate: '1982-07-18',
    issueDate: '2019-04-12',
    expiryDate: '2029-04-12',
    placeOfBirth: 'Oyem'
  };
  
  const confidence = 0.92 + Math.random() * 0.07; // 92-99%
  
  return {
    success: true,
    confidence,
    data: {
      ...mockData,
      idType: 'passeport'
    },
    warnings: confidence < 0.95 ? ['Vérification manuelle recommandée'] : [],
    requiresVerification: confidence < 0.95
  };
};

/**
 * Simule l'extraction IA d'un permis de conduire
 */
export const extractPermisData = async (imageData: string | File): Promise<ExtractionResult> => {
  await new Promise(resolve => setTimeout(resolve, 1800));
  
  const mockData = {
    firstName: 'Paul',
    lastName: 'NZAMBA',
    idNumber: 'PC240156789',
    nationality: 'Gabonaise',
    birthDate: '1975-11-30',
    issueDate: '2020-09-15',
    expiryDate: '2025-09-15',
    placeOfBirth: 'Lambaréné'
  };
  
  const confidence = 0.88 + Math.random() * 0.11; // 88-99%
  
  return {
    success: true,
    confidence,
    data: {
      ...mockData,
      idType: 'permis'
    },
    warnings: confidence < 0.92 ? ['Document peu net - Vérification conseillée'] : [],
    requiresVerification: confidence < 0.95
  };
};

/**
 * Extraction automatique basée sur le type de document détecté
 */
export const autoExtractDocument = async (imageData: string | File): Promise<ExtractionResult> => {
  // Simulation de la détection du type de document
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Choix aléatoire du type pour la démo
  const documentTypes = ['CNI', 'passeport', 'permis'];
  const detectedType = documentTypes[Math.floor(Math.random() * documentTypes.length)];
  
  switch (detectedType) {
    case 'CNI':
      return extractCNIData(imageData);
    case 'passeport':
      return extractPassportData(imageData);
    case 'permis':
      return extractPermisData(imageData);
    default:
      return {
        success: false,
        confidence: 0,
        data: {},
        warnings: ['Type de document non reconnu'],
        requiresVerification: true
      };
  }
};

/**
 * Valide les données extraites
 */
export const validateExtractedData = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data.firstName || data.firstName.length < 2) {
    errors.push('Prénom invalide ou manquant');
  }
  
  if (!data.lastName || data.lastName.length < 2) {
    errors.push('Nom invalide ou manquant');
  }
  
  if (!data.idNumber || data.idNumber.length < 5) {
    errors.push('Numéro de document invalide');
  }
  
  if (data.expiryDate && new Date(data.expiryDate) < new Date()) {
    errors.push('Document expiré');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Améliore la qualité de l'image pour l'extraction
 */
export const preprocessImage = async (imageData: string | File): Promise<string> => {
  // Simulation du preprocessing
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // En production, ici on ferait:
  // - Correction de la luminosité/contraste
  // - Redressement automatique
  // - Réduction du bruit
  // - Amélioration de la netteté
  
  return typeof imageData === 'string' ? imageData : URL.createObjectURL(imageData);
};

/**
 * Génère un rapport de confiance pour l'extraction
 */
export const generateConfidenceReport = (result: ExtractionResult): string => {
  let report = `RAPPORT D'EXTRACTION IA - DGDI Access\n`;
  report += `${'='.repeat(40)}\n\n`;
  
  report += `Statut: ${result.success ? 'SUCCÈS' : 'ÉCHEC'}\n`;
  report += `Confiance globale: ${Math.round(result.confidence * 100)}%\n`;
  report += `Vérification requise: ${result.requiresVerification ? 'OUI' : 'NON'}\n\n`;
  
  if (result.data) {
    report += `DONNÉES EXTRAITES:\n`;
    report += `Prénom: ${result.data.firstName || 'Non détecté'}\n`;
    report += `Nom: ${result.data.lastName || 'Non détecté'}\n`;
    report += `N° Document: ${result.data.idNumber || 'Non détecté'}\n`;
    report += `Type: ${result.data.idType || 'Non détecté'}\n`;
    report += `Nationalité: ${result.data.nationality || 'Non détecté'}\n`;
  }
  
  if (result.warnings.length > 0) {
    report += `\nAVERTISSEMENTS:\n`;
    result.warnings.forEach((warning, index) => {
      report += `${index + 1}. ${warning}\n`;
    });
  }
  
  report += `\nRECOMMANDATIONS:\n`;
  if (result.confidence >= 0.95) {
    report += `✓ Extraction fiable - Traitement automatique possible\n`;
  } else if (result.confidence >= 0.85) {
    report += `⚠ Vérification manuelle recommandée\n`;
  } else {
    report += `✗ Qualité insuffisante - Nouvelle capture recommandée\n`;
  }
  
  return report;
};