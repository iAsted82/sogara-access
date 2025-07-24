// Service PDF pour SOGARA Access
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { UserOptions } from 'jspdf-autotable';
import { PDFReportOptions } from '../types/export';

// Étendre l'interface jsPDF pour TypeScript
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: UserOptions) => jsPDF;
  }
}

export function preparePDFReport(data: any, options: PDFReportOptions = {}): string {
  try {
    // Configuration par défaut
    const config: Required<PDFReportOptions> = {
      title: 'Rapport SOGARA Access',
      subtitle: '',
      filename: `rapport_${new Date().toISOString().split('T')[0]}`,
      orientation: 'portrait',
      format: 'a4',
      margins: { top: 20, right: 20, bottom: 20, left: 20 },
      header: {
        logo: '/Photoroom_20250703_164401.PNG',
        companyName: 'SOGARA - Société Gabonaise de Raffinage',
        address: 'Zone Industrielle d\'Oloumi Nord, Port-Gentil, Gabon'
      },
      footer: {
        showPageNumbers: true,
        text: 'Document confidentiel - Usage interne uniquement'
      },
      theme: 'striped',
      includeTimestamp: true,
      includeCharts: false,
      watermark: '',
      ...options
    };

    // Créer le document PDF
    const pdf = new jsPDF({
      orientation: config.orientation,
      unit: 'mm',
      format: config.format
    });

    // Variables pour le positionnement
    let yPosition = config.margins.top;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const contentWidth = pageWidth - config.margins.left - config.margins.right;

    // Ajouter le watermark si défini
    if (config.watermark) {
      pdf.setTextColor(200, 200, 200);
      pdf.setFontSize(50);
      pdf.setFont('helvetica', 'bold');
      
      // Calculer la position centrale
      const textWidth = pdf.getTextWidth(config.watermark);
      const xPos = (pageWidth - textWidth) / 2;
      const yPos = pageHeight / 2;
      
      // Rotation du texte
      pdf.saveGraphicsState();
      pdf.setGState(new pdf.GState({ opacity: 0.2 }));
      pdf.text(config.watermark, xPos, yPos, { angle: 45 });
      pdf.restoreGraphicsState();
    }

    // En-tête avec logo
    if (config.header.logo) {
      try {
        pdf.addImage(
          config.header.logo,
          'PNG',
          config.margins.left,
          yPosition,
          30,
          15
        );
        yPosition += 20;
      } catch (error) {
        console.warn('Erreur lors de l\'ajout du logo:', error);
      }
    }

    // Informations de l'entreprise
    if (config.header.companyName) {
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(
        config.header.companyName,
        pageWidth - config.margins.right,
        yPosition,
        { align: 'right' }
      );
      yPosition += 5;
    }

    if (config.header.address) {
      pdf.setFontSize(8);
      pdf.text(
        config.header.address,
        pageWidth - config.margins.right,
        yPosition,
        { align: 'right' }
      );
      yPosition += 10;
    }

    // Titre principal
    pdf.setFontSize(20);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'bold');
    pdf.text(config.title, config.margins.left, yPosition);
    yPosition += 10;

    // Sous-titre
    if (config.subtitle) {
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(100, 100, 100);
      pdf.text(config.subtitle, config.margins.left, yPosition);
      yPosition += 8;
    }

    // Date et heure
    if (config.includeTimestamp) {
      pdf.setFontSize(10);
      pdf.setTextColor(150, 150, 150);
      const timestamp = new Date().toLocaleString('fr-FR', {
        dateStyle: 'long',
        timeStyle: 'short'
      });
      pdf.text(`Généré le ${timestamp}`, config.margins.left, yPosition);
      yPosition += 10;
    }

    // Ligne de séparation
    pdf.setDrawColor(200, 200, 200);
    pdf.line(
      config.margins.left,
      yPosition,
      pageWidth - config.margins.right,
      yPosition
    );
    yPosition += 10;

    // Traitement des données selon leur type
    if (Array.isArray(data)) {
      // Données tabulaires
      renderTableData(pdf, data, yPosition, config);
    } else if (typeof data === 'object' && data !== null) {
      // Données en sections
      renderSectionData(pdf, data, yPosition, config);
    } else {
      // Données texte simple
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      const lines = pdf.splitTextToSize(String(data), contentWidth);
      pdf.text(lines, config.margins.left, yPosition);
    }

    // Ajouter le pied de page à toutes les pages
    const totalPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      addFooter(pdf, i, totalPages, config);
    }

    // Retourner le PDF en base64
    return pdf.output('datauristring');

  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    throw new Error(`Impossible de générer le PDF: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
}

// Fonction helper pour rendre des données tabulaires
function renderTableData(
  pdf: jsPDF,
  data: any[],
  startY: number,
  config: Required<PDFReportOptions>
): void {
  if (data.length === 0) return;

  // Extraire les colonnes
  const columns = Object.keys(data[0]).map(key => ({
    header: formatColumnHeader(key),
    dataKey: key
  }));

  // Préparer les données
  const rows = data.map(item => {
    const row: Record<string, any> = {};
    columns.forEach(col => {
      const value = item[col.dataKey];
      row[col.dataKey] = formatCellValue(value);
    });
    return row;
  });

  // Options de style pour la table
  const tableThemes = {
    striped: {
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    },
    grid: {
      theme: 'grid',
      headStyles: { fillColor: [52, 73, 94], textColor: 255 },
      gridLineColor: [200, 200, 200]
    },
    plain: {
      theme: 'plain',
      headStyles: { fillColor: [255, 255, 255], textColor: 0, fontStyle: 'bold' }
    }
  };

  // Générer la table
  pdf.autoTable({
    head: [columns.map(col => col.header)],
    body: rows.map(row => columns.map(col => row[col.dataKey])),
    startY: startY,
    margin: {
      left: config.margins.left,
      right: config.margins.right
    },
    ...(tableThemes[config.theme] as any),
    styles: {
      fontSize: 10,
      cellPadding: 5
    },
    columnStyles: {
      // Ajuster automatiquement la largeur des colonnes
      ...columns.reduce((acc, col, index) => {
        const maxLength = Math.max(
          col.header.length,
          ...rows.map(row => String(row[col.dataKey]).length)
        );
        if (maxLength > 50) {
          acc[index] = { cellWidth: 'wrap' };
        }
        return acc;
      }, {} as Record<number, any>)
    }
  });
}

// Fonction helper pour rendre des données en sections
function renderSectionData(
  pdf: jsPDF,
  data: any,
  startY: number,
  config: Required<PDFReportOptions>
): void {
  let yPosition = startY;
  const pageHeight = pdf.internal.pageSize.getHeight();
  const marginBottom = config.margins.bottom;

  Object.entries(data).forEach(([key, value]) => {
    // Vérifier si on a besoin d'une nouvelle page
    if (yPosition > pageHeight - marginBottom - 30) {
      pdf.addPage();
      yPosition = config.margins.top;
    }

    // Titre de section
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(41, 128, 185);
    pdf.text(formatSectionTitle(key), config.margins.left, yPosition);
    yPosition += 8;

    // Contenu de la section
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);

    if (Array.isArray(value)) {
      // Liste
      value.forEach(item => {
        if (yPosition > pageHeight - marginBottom - 10) {
          pdf.addPage();
          yPosition = config.margins.top;
        }
        pdf.text(`• ${formatCellValue(item)}`, config.margins.left + 5, yPosition);
        yPosition += 6;
      });
    } else if (typeof value === 'object' && value !== null) {
      // Sous-sections
      Object.entries(value).forEach(([subKey, subValue]) => {
        if (yPosition > pageHeight - marginBottom - 10) {
          pdf.addPage();
          yPosition = config.margins.top;
        }
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${formatColumnHeader(subKey)}:`, config.margins.left + 5, yPosition);
        pdf.setFont('helvetica', 'normal');
        pdf.text(formatCellValue(subValue), config.margins.left + 50, yPosition);
        yPosition += 6;
      });
    } else {
      // Valeur simple
      const text = formatCellValue(value);
      const lines = pdf.splitTextToSize(
        text,
        pdf.internal.pageSize.getWidth() - config.margins.left - config.margins.right
      );
      lines.forEach((line: string) => {
        if (yPosition > pageHeight - marginBottom - 10) {
          pdf.addPage();
          yPosition = config.margins.top;
        }
        pdf.text(line, config.margins.left + 5, yPosition);
        yPosition += 6;
      });
    }

    yPosition += 5; // Espace entre sections
  });
}

// Fonction helper pour ajouter le pied de page
function addFooter(
  pdf: jsPDF,
  currentPage: number,
  totalPages: number,
  config: Required<PDFReportOptions>
): void {
  const pageHeight = pdf.internal.pageSize.getHeight();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const footerY = pageHeight - 10;

  pdf.setFontSize(9);
  pdf.setTextColor(150, 150, 150);

  // Texte personnalisé du footer
  if (config.footer.text) {
    pdf.text(
      config.footer.text,
      config.margins.left,
      footerY
    );
  }

  // Numéros de page
  if (config.footer.showPageNumbers) {
    pdf.text(
      `Page ${currentPage} sur ${totalPages}`,
      pageWidth - config.margins.right,
      footerY,
      { align: 'right' }
    );
  }
}

// Fonctions helper de formatage
function formatColumnHeader(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function formatSectionTitle(key: string): string {
  return formatColumnHeader(key).toUpperCase();
}

function formatCellValue(value: any): string {
  if (value === null || value === undefined) return '';
  if (value instanceof Date) {
    return value.toLocaleDateString('fr-FR');
  }
  if (typeof value === 'boolean') {
    return value ? 'Oui' : 'Non';
  }
  if (typeof value === 'number') {
    if (Number.isInteger(value)) {
      return value.toLocaleString('fr-FR');
    }
    return value.toLocaleString('fr-FR', { maximumFractionDigits: 2 });
  }
  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2);
  }
  return String(value);
}