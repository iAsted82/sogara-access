// Types pour le système d'export SOGARA Access
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    saveGraphicsState: () => void;
    restoreGraphicsState: () => void;
    setGState: (state: any) => void;
    GState: new (options: { opacity?: number }) => any;
  }
}

export interface ExportContext {
  user?: string;
  timestamp?: Date;
  filters?: Record<string, any>;
  source?: string;
}

export interface ExportResult {
  success: boolean;
  filename?: string;
  size?: number;
  error?: string;
}

export type ExportProgressCallback = (progress: number, message: string) => void;

// Types pour les options PDF
export interface PDFReportOptions {
  title?: string;
  subtitle?: string;
  filename?: string;
  orientation?: 'portrait' | 'landscape';
  format?: 'a4' | 'letter' | 'a3';
  margins?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  header?: {
    logo?: string;
    companyName?: string;
    address?: string;
  };
  footer?: {
    showPageNumbers?: boolean;
    text?: string;
  };
  theme?: 'striped' | 'grid' | 'plain';
  includeTimestamp?: boolean;
  includeCharts?: boolean;
  watermark?: string;
}

// Types pour les données du dashboard
export interface DashboardData {
  title?: string;
  description?: string;
  data: any[] | Record<string, any>;
  metadata?: {
    generatedAt?: Date;
    generatedBy?: string;
    version?: string;
    filters?: Record<string, any>;
    totalRecords?: number;
  };
  charts?: Array<{
    type: string;
    data: any;
    title: string;
  }>;
}

// Types pour les options d'export
export type ExportFormat = 'csv' | 'excel' | 'pdf' | 'json';

export interface ExportOptions {
  filename?: string;
  includeHeaders?: boolean;
  delimiter?: string; // Pour CSV
  sheetName?: string; // Pour Excel
  includeMetadata?: boolean;
  dateFormat?: string;
  numberFormat?: string;
  encoding?: 'utf-8' | 'utf-16' | 'ascii';
  pdfOptions?: PDFReportOptions;
  columns?: string[]; // Colonnes spécifiques à exporter
  filters?: Record<string, any>; // Filtres à appliquer
  sortBy?: { field: string; order: 'asc' | 'desc' };
  transform?: (data: any) => any; // Fonction de transformation
}