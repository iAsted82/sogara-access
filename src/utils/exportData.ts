/**
 * Utilitaires pour l'exportation des données du tableau de bord
 */

/**
 * Convertit des données en format CSV
 * @param data Les données à convertir
 * @returns Chaîne CSV
 */
export function convertToCSV(data: any[]): string {
  if (data.length === 0) return '';
  
  // Extraire les en-têtes du premier objet
  const headers = Object.keys(data[0]);
  
  // Créer la ligne d'en-tête
  const headerRow = headers.join(',');
  
  // Créer les lignes de données
  const rows = data.map(item => {
    return headers.map(header => {
      // Échapper les virgules et les guillemets dans les valeurs
      let value = item[header]?.toString() || '';
      if (value.includes(',') || value.includes('"')) {
        value = `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',');
  });
  
  // Joindre les lignes pour former le CSV complet
  return [headerRow, ...rows].join('\n');
}

/**
 * Télécharge un fichier CSV
 * @param data Les données à télécharger
 * @param filename Nom du fichier
 */
export function downloadCSV(data: any[], filename: string = 'export.csv'): void {
  const csvContent = convertToCSV(data);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Prépare les données pour Excel (convertit en format CSV pour cette démo)
 * Dans une application réelle, on utiliserait une bibliothèque comme xlsx
 * @param data Les données à convertir
 * @param filename Nom du fichier
 */
export function downloadExcel(data: any[], filename: string = 'export.xlsx'): void {
  // Pour cette démo, nous allons simplement utiliser CSV avec une extension différente
  // Dans une application réelle, vous utiliseriez une bibliothèque comme xlsx
  const csvContent = convertToCSV(data);
  const blob = new Blob([csvContent], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  console.log('Téléchargement Excel', data);
}

/**
 * Prépare les données pour les graphiques
 * @param data Données brutes
 * @returns Données formatées pour les graphiques
 */
export function prepareChartData(data: any): any {
  // Exemple de transformation de données pour graphiques
  // Cette fonction serait plus complexe dans une application réelle
  
  return {
    labels: data.map((item: any) => item.label || ''),
    datasets: [
      {
        data: data.map((item: any) => item.value || 0),
        backgroundColor: [
          '#3B82F6', // blue-500
          '#10B981', // green-500
          '#F59E0B', // amber-500
          '#8B5CF6', // purple-500
          '#EC4899', // pink-500
          '#EF4444', // red-500
        ]
      }
    ]
  };
}

/**
 * Prépare un rapport PDF (simulé pour cette démo)
 * @param data Données du rapport
 * @param options Options du rapport
 */
export function preparePDFReport(data: any, options?: any): string {
  // Dans une application réelle, vous utiliseriez une bibliothèque PDF
  // Pour cette démo, nous simulons simplement la préparation des données
  
  const timestamp = new Date().toISOString();
  const reportTitle = options?.title || 'Rapport de tableau de bord';
  
  const report = {
    title: reportTitle,
    timestamp,
    data,
    options
  };
  
  console.log('Préparation du rapport PDF', report);
  return JSON.stringify(report, null, 2);
}

/**
 * Prépare et exporte les données du tableau de bord
 * @param data Données à exporter
 * @param format Format d'export (csv, excel, pdf)
 * @param options Options d'export
 */
export function exportDashboardData(data: any, format: 'csv' | 'excel' | 'pdf', options?: any): void {
  // Préparation du nom de fichier
  const date = new Date().toISOString().split('T')[0];
  const filename = options?.filename || `dgi-dashboard-${date}`;
  
  // Formater les données selon le type
  let formattedData: any[] = [];
  
  // Adapter les données selon le type demandé
  if (options?.dataTypes?.includes('visitors')) {
    data.visitorsByDay.forEach((day: any) => {
      formattedData.push({
        type: 'Visiteurs',
        jour: day.day,
        nombre: day.count,
        objectif: day.target,
        pourcentage: ((day.count / day.target) * 100).toFixed(1) + '%'
      });
    });
  }
  
  if (options?.dataTypes?.includes('services')) {
    data.servicesDistribution.forEach((service: any) => {
      formattedData.push({
        type: 'Services',
        nom: service.name,
        valeur: service.value,
        pourcentage: ((service.value / data.servicesDistribution.reduce((sum: number, s: any) => sum + s.value, 0)) * 100).toFixed(1) + '%'
      });
    });
  }
  
  if (options?.dataTypes?.includes('performance')) {
    data.performanceMetrics.forEach((metric: any) => {
      formattedData.push({
        type: 'Performance',
        metrique: metric.metric,
        valeur: metric.value,
        objectif: metric.target,
        pourcentage: ((metric.value / metric.target) * 100).toFixed(1) + '%'
      });
    });
  }
  
  // Exporter selon le format demandé
  switch (format) {
    case 'csv':
      downloadCSV(formattedData, `${filename}.csv`);
      break;
    case 'excel':
      downloadExcel(formattedData, `${filename}.xlsx`);
      break;
    case 'pdf':
      const pdfData = preparePDFReport(formattedData, {
        title: 'Rapport du Tableau de Bord SOGARA',
        ...options
      });
      
      // Pour une démo, nous affichons simplement une alerte
      alert('Préparation du rapport PDF. Dans une application réelle, cela générerait un PDF téléchargeable.');
      console.log(pdfData);
      break;
    default:
      console.error('Format d\'export non supporté:', format);
  }
}