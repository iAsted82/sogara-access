// Service d'export complet pour SOGARA Access
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { preparePDFReport } from './PDFService';
import { ExportFormat, ExportOptions, DashboardData, PDFReportOptions } from '../types/export';

export async function exportDashboardData(
  dashboardData: DashboardData | any,
  format: ExportFormat,
  options: ExportOptions = {}
): Promise<void> {
  try {
    // Normaliser les données
    const normalizedData = normalizeDashboardData(dashboardData);
    
    // Appliquer les transformations et filtres
    const processedData = processDataForExport(normalizedData, options);

    // Configuration par défaut
    const config: Required<ExportOptions> = {
      filename: generateFilename(format, normalizedData.title),
      includeHeaders: true,
      delimiter: ';',
      sheetName: 'Données SOGARA',
      includeMetadata: true,
      dateFormat: 'DD/MM/YYYY',
      numberFormat: '#,##0.00',
      encoding: 'utf-8',
      pdfOptions: {
        title: normalizedData.title || 'Rapport SOGARA Access',
        subtitle: normalizedData.description,
        header: {
          companyName: 'SOGARA - Société Gabonaise de Raffinage',
          address: 'Zone Industrielle d\'Oloumi Nord, Port-Gentil, Gabon'
        }
      },
      columns: [],
      filters: {},
      sortBy: { field: '', order: 'asc' },
      transform: (data) => data,
      ...options
    };

    // Exporter selon le format
    switch (format) {
      case 'csv':
        await exportToCSV(processedData, config);
        break;
      case 'excel':
        await exportToExcel(processedData, config);
        break;
      case 'pdf':
        await exportToPDF(processedData, config);
        break;
      case 'json':
        await exportToJSON(processedData, config);
        break;
      default:
        throw new Error(`Format d'export non supporté: ${format}`);
    }

    console.log(`Export ${format.toUpperCase()} réussi: ${config.filename}`);

  } catch (error) {
    console.error('Erreur lors de l\'export:', error);
    throw new Error(`Échec de l'export en ${format}: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
}

// Normaliser les données du dashboard
function normalizeDashboardData(data: any): DashboardData {
  if (data.data) {
    return data as DashboardData;
  }

  // Si les données sont directement un tableau ou objet
  return {
    title: 'Export SOGARA Access',
    data: data,
    metadata: {
      generatedAt: new Date(),
      totalRecords: Array.isArray(data) ? data.length : Object.keys(data).length,
      generatedBy: 'SOGARA Access System',
      version: '2024.01.15'
    }
  };
}

// Traiter les données pour l'export
function processDataForExport(
  dashboardData: DashboardData,
  options: ExportOptions
): DashboardData {
  let { data } = dashboardData;

  // Convertir en tableau si nécessaire
  if (!Array.isArray(data)) {
    data = [data];
  }

  // Appliquer les filtres
  if (options.filters && Object.keys(options.filters).length > 0) {
    data = data.filter(item => {
      return Object.entries(options.filters!).every(([key, value]) => {
        if (Array.isArray(value)) {
          return value.includes(item[key]);
        }
        return item[key] === value;
      });
    });
  }

  // Sélectionner les colonnes spécifiques
  if (options.columns && options.columns.length > 0) {
    data = data.map(item => {
      const filtered: Record<string, any> = {};
      options.columns!.forEach(col => {
        if (col in item) {
          filtered[col] = item[col];
        }
      });
      return filtered;
    });
  }

  // Trier les données
  if (options.sortBy && options.sortBy.field) {
    data = [...data].sort((a, b) => {
      const aVal = a[options.sortBy!.field];
      const bVal = b[options.sortBy!.field];
      
      if (options.sortBy!.order === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  }

  // Appliquer la transformation personnalisée
  if (options.transform) {
    data = options.transform(data);
  }

  return {
    ...dashboardData,
    data,
    metadata: {
      ...dashboardData.metadata,
      totalRecords: data.length,
      filters: options.filters
    }
  };
}

// Export CSV
async function exportToCSV(
  dashboardData: DashboardData,
  options: Required<ExportOptions>
): Promise<void> {
  const data = Array.isArray(dashboardData.data) 
    ? dashboardData.data 
    : [dashboardData.data];

  if (data.length === 0) {
    throw new Error('Aucune donnée à exporter');
  }

  let csv = '';

  // Ajouter les métadonnées si demandé
  if (options.includeMetadata && dashboardData.metadata) {
    csv += `# ${dashboardData.title || 'Export SOGARA Access'}\n`;
    csv += `# Généré le: ${formatDate(dashboardData.metadata.generatedAt || new Date(), options.dateFormat)}\n`;
    csv += `# Nombre d'enregistrements: ${data.length}\n`;
    if (dashboardData.metadata.filters) {
      csv += `# Filtres appliqués: ${JSON.stringify(dashboardData.metadata.filters)}\n`;
    }
    csv += '\n';
  }

  // Extraire les en-têtes
  const headers = Object.keys(data[0]);
  
  // Ajouter les en-têtes
  if (options.includeHeaders) {
    csv += headers.map(h => escapeCSV(h)).join(options.delimiter) + '\n';
  }

  // Ajouter les données
  data.forEach(row => {
    csv += headers
      .map(header => escapeCSV(formatValue(row[header], options)))
      .join(options.delimiter) + '\n';
  });

  // Créer et télécharger le fichier
  const blob = new Blob([addBOM(csv, options.encoding)], {
    type: `text/csv;charset=${options.encoding}`
  });
  saveAs(blob, `${options.filename}.csv`);
}

// Export Excel
async function exportToExcel(
  dashboardData: DashboardData,
  options: Required<ExportOptions>
): Promise<void> {
  const workbook = XLSX.utils.book_new();
  
  // Feuille principale avec les données
  const data = Array.isArray(dashboardData.data) 
    ? dashboardData.data 
    : [dashboardData.data];

  if (data.length > 0) {
    // Créer la feuille de données
    const worksheet = XLSX.utils.json_to_sheet(data, {
      header: options.columns.length > 0 ? options.columns : Object.keys(data[0]),
      dateNF: options.dateFormat
    });

    // Appliquer des styles (largeur des colonnes)
    const cols = Object.keys(data[0]).map(key => ({
      wch: Math.max(
        key.length,
        ...data.map(row => String(row[key] || '').length)
      ) + 2
    }));
    worksheet['!cols'] = cols;

    // Ajouter la feuille au workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, options.sheetName);
  }

  // Feuille de métadonnées si demandé
  if (options.includeMetadata && dashboardData.metadata) {
    const metadataSheet = XLSX.utils.aoa_to_sheet([
      ['Propriété', 'Valeur'],
      ['Titre', dashboardData.title || 'Export SOGARA Access'],
      ['Date de génération', formatDate(dashboardData.metadata.generatedAt || new Date(), options.dateFormat)],
      ['Généré par', dashboardData.metadata.generatedBy || 'SOGARA Access System'],
      ['Nombre d\'enregistrements', dashboardData.metadata.totalRecords || data.length],
      ['Version', dashboardData.metadata.version || '2024.01.15']
    ]);

    XLSX.utils.book_append_sheet(workbook, metadataSheet, 'Métadonnées');
  }

  // Feuille de graphiques si disponible
  if (dashboardData.charts && dashboardData.charts.length > 0) {
    dashboardData.charts.forEach((chart, index) => {
      const chartData = Array.isArray(chart.data) ? chart.data : [chart.data];
      const chartSheet = XLSX.utils.json_to_sheet(chartData);
      XLSX.utils.book_append_sheet(
        workbook,
        chartSheet,
        `Graphique ${index + 1} - ${chart.title}`.slice(0, 31) // Excel limite à 31 caractères
      );
    });
  }

  // Générer le fichier Excel
  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array'
  });

  // Télécharger
  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
  saveAs(blob, `${options.filename}.xlsx`);
}

// Export PDF
async function exportToPDF(
  dashboardData: DashboardData,
  options: Required<ExportOptions>
): Promise<void> {
  // Préparer les options PDF
  const pdfOptions: PDFReportOptions = {
    title: dashboardData.title || 'Export SOGARA Access',
    subtitle: dashboardData.description,
    filename: options.filename,
    includeTimestamp: true,
    watermark: 'SOGARA',
    ...options.pdfOptions
  };

  // Préparer les données pour le PDF
  let pdfData: any;
  
  if (Array.isArray(dashboardData.data)) {
    // Pour les données tabulaires
    pdfData = dashboardData.data;
  } else {
    // Pour les données structurées
    pdfData = {
      'Résumé': dashboardData.description || 'Données exportées du tableau de bord SOGARA Access',
      'Données': dashboardData.data
    };

    // Ajouter les métadonnées
    if (options.includeMetadata && dashboardData.metadata) {
      pdfData['Informations'] = {
        'Date de génération': formatDate(dashboardData.metadata.generatedAt || new Date(), options.dateFormat),
        'Nombre d\'enregistrements': dashboardData.metadata.totalRecords,
        'Version': dashboardData.metadata.version || '2024.01.15',
        'Généré par': dashboardData.metadata.generatedBy || 'SOGARA Access System'
      };
    }
  }

  // Générer le PDF
  const pdfDataUri = preparePDFReport(pdfData, pdfOptions);
  
  // Convertir dataURI en blob
  const pdfBlob = dataURItoBlob(pdfDataUri);
  
  // Télécharger
  saveAs(pdfBlob, `${options.filename}.pdf`);
}

// Export JSON
async function exportToJSON(
  dashboardData: DashboardData,
  options: Required<ExportOptions>
): Promise<void> {
  const exportData = options.includeMetadata 
    ? dashboardData 
    : dashboardData.data;

  const json = JSON.stringify(exportData, null, 2);
  
  const blob = new Blob([json], {
    type: 'application/json;charset=utf-8'
  });
  
  saveAs(blob, `${options.filename}.json`);
}

// Fonctions utilitaires
function generateFilename(format: string, title?: string): string {
  const baseTitle = title 
    ? title.toLowerCase().replace(/[^a-z0-9]/g, '_')
    : 'export_sogara';
  const date = new Date().toISOString().split('T')[0];
  return `${baseTitle}_${date}`;
}

function escapeCSV(value: string): string {
  if (value == null) return '';
  
  value = String(value);
  
  // Échapper les guillemets
  value = value.replace(/"/g, '""');
  
  // Entourer de guillemets si nécessaire
  if (value.includes(',') || value.includes(';') || value.includes('"') || value.includes('\n')) {
    value = `"${value}"`;
  }
  
  return value;
}

function formatValue(value: any, options: ExportOptions): string {
  if (value == null) return '';
  
  if (value instanceof Date) {
    return formatDate(value, options.dateFormat || 'DD/MM/YYYY');
  }
  
  if (typeof value === 'number') {
    return formatNumber(value, options.numberFormat || '#,##0.00');
  }
  
  if (typeof value === 'boolean') {
    return value ? 'Oui' : 'Non';
  }
  
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  
  return String(value);
}

function formatDate(date: Date, format: string): string {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  return format
    .replace('DD', day)
    .replace('MM', month)
    .replace('YYYY', String(year))
    .replace('YY', String(year).slice(-2));
}

function formatNumber(value: number, format: string): string {
  // Format simple pour cette démo
  return value.toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function addBOM(text: string, encoding: string): string {
  if (encoding === 'utf-8') {
    return '\ufeff' + text;
  }
  return text;
}

function dataURItoBlob(dataURI: string): Blob {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  
  return new Blob([ab], { type: mimeString });
}

// Fonction helper pour l'export en masse
export async function exportMultipleFormats(
  data: DashboardData,
  formats: ExportFormat[],
  options: ExportOptions = {}
): Promise<void> {
  const promises = formats.map(format => 
    exportDashboardData(data, format, options)
  );
  
  await Promise.all(promises);
}

// Export par défaut pour faciliter l'import
export default {
  exportDashboardData,
  exportMultipleFormats,
  preparePDFReport
};