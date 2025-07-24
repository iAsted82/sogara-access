import React, { useState } from 'react';
import { 
  Download, FileText, FileSpreadsheet, Printer, 
  QrCode, X, CheckCircle, Calendar, User, MapPin,
  Check
} from 'lucide-react';

interface Visitor {
  id: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  badgeNumber: string;
  checkInTime: string;
  checkOutTime?: string;
  company?: string;
  phone: string;
  email?: string;
  purposeOfVisit: string;
  serviceRequested: string;
  employeeToVisit: string;
  department: string;
  expectedDuration: string;
  status: 'present' | 'completed' | 'overdue';
  appointmentId?: string;
  idType?: string;
  idNumber?: string;
  notes?: string;
  photo?: string;
}

interface VisitorExportProps {
  visitor?: Visitor | null;
  visitors: Visitor[];
  onExport: (format: string, data: Visitor[]) => void;
  onClose: () => void;
  exportType: 'single' | 'multiple';
}

export const VisitorExport: React.FC<VisitorExportProps> = ({
  visitor,
  visitors,
  onExport,
  onClose,
  exportType
}) => {
  const [selectedFormat, setSelectedFormat] = useState<string>('pdf');
  const [includeFields, setIncludeFields] = useState<{[key: string]: boolean}>({
    personalInfo: true,
    contactInfo: true,
    visitDetails: true,
    identityInfo: true,
    badgeInfo: true,
    photo: true
  });
  const [exportInProgress, setExportInProgress] = useState(false);
  
  // Basculer l'inclusion d'un champ
  const toggleField = (field: string) => {
    setIncludeFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };
  
  // Gérer l'exportation
  const handleExport = () => {
    setExportInProgress(true);
    
    // Simuler un délai de traitement
    setTimeout(() => {
      // Si c'est une exportation unique, n'inclure que le visiteur sélectionné
      const dataToExport = exportType === 'single' && visitor 
        ? [visitor] 
        : visitors;
      
      // Filtrer les champs à inclure
      const filteredData = dataToExport.map(v => {
        const result: {[key: string]: any} = {};
        
        if (includeFields.personalInfo) {
          result.fullName = v.fullName;
          result.firstName = v.firstName;
          result.lastName = v.lastName;
          result.company = v.company;
        }
        
        if (includeFields.contactInfo) {
          result.phone = v.phone;
          result.email = v.email;
        }
        
        if (includeFields.visitDetails) {
          result.purposeOfVisit = v.purposeOfVisit;
          result.serviceRequested = v.serviceRequested;
          result.employeeToVisit = v.employeeToVisit;
          result.department = v.department;
          result.checkInTime = v.checkInTime;
          result.checkOutTime = v.checkOutTime;
          result.status = v.status;
          result.expectedDuration = v.expectedDuration;
        }
        
        if (includeFields.identityInfo) {
          result.idType = v.idType;
          result.idNumber = v.idNumber;
        }
        
        if (includeFields.badgeInfo) {
          result.badgeNumber = v.badgeNumber;
        }
        
        if (includeFields.photo) {
          result.photo = v.photo;
        }
        
        return result;
      });
      
      // Appeler la fonction d'exportation
      onExport(selectedFormat, filteredData);
      setExportInProgress(false);
    }, 1500);
  };
  
  // Prévisualiser le document
  const previewDocument = () => {
    if (!visitor) return null;
    
    return (
      <div className="border border-gray-200 rounded-lg p-4 bg-white">
        <div className="border-b border-gray-200 pb-3 mb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/Photoroom_20250703_164401.PNG" 
                alt="Logo SOGARA"
                className="h-12 w-auto"
              />
              <div>
                <div className="text-lg font-bold text-gray-900">Direction Générale de la Documentation et de l'Immigration</div>
                <div className="text-sm text-gray-600">République Gabonaise</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-700">Fiche Visiteur</div>
              <div className="text-sm text-gray-500">#{visitor.id}</div>
              <div className="text-sm text-gray-500">{new Date().toLocaleDateString('fr-FR')}</div>
            </div>
          </div>
        </div>
        
        {includeFields.personalInfo && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Informations Personnelles</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-sm text-gray-500">Nom complet</div>
                <div className="text-base font-medium">{visitor.fullName}</div>
              </div>
              {visitor.company && (
                <div>
                  <div className="text-sm text-gray-500">Entreprise/Organisation</div>
                  <div className="text-base font-medium">{visitor.company}</div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {includeFields.contactInfo && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Coordonnées</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-sm text-gray-500">Téléphone</div>
                <div className="text-base font-medium">{visitor.phone}</div>
              </div>
              {visitor.email && (
                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <div className="text-base font-medium">{visitor.email}</div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {includeFields.visitDetails && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Détails de la Visite</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-sm text-gray-500">Date</div>
                <div className="text-base font-medium">{new Date(visitor.checkInTime).toLocaleDateString('fr-FR')}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Heure d'arrivée</div>
                <div className="text-base font-medium">{new Date(visitor.checkInTime).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}</div>
              </div>
              {visitor.checkOutTime && (
                <div>
                  <div className="text-sm text-gray-500">Heure de sortie</div>
                  <div className="text-base font-medium">{new Date(visitor.checkOutTime).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}</div>
                </div>
              )}
              <div>
                <div className="text-sm text-gray-500">Statut</div>
                <div className="text-base font-medium">
                  {visitor.status === 'present' ? 'Présent' :
                   visitor.status === 'completed' ? 'Terminé' :
                   'Dépassement'}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Motif</div>
                <div className="text-base font-medium">{visitor.purposeOfVisit}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Service</div>
                <div className="text-base font-medium">{visitor.serviceRequested}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Département</div>
                <div className="text-base font-medium">{visitor.department}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Personne à voir</div>
                <div className="text-base font-medium">{visitor.employeeToVisit}</div>
              </div>
            </div>
          </div>
        )}
        
        {includeFields.identityInfo && visitor.idType && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Document d'Identité</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-sm text-gray-500">Type</div>
                <div className="text-base font-medium">
                  {visitor.idType === 'CNI' ? 'Carte Nationale d\'Identité' :
                   visitor.idType === 'passeport' ? 'Passeport' :
                   visitor.idType}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Numéro</div>
                <div className="text-base font-medium">{visitor.idNumber}</div>
              </div>
            </div>
          </div>
        )}
        
        {includeFields.badgeInfo && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Badge Visiteur</h3>
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <div className="text-sm text-gray-500">Numéro de badge</div>
                <div className="text-base font-medium">{visitor.badgeNumber}</div>
              </div>
              <div className="h-16 w-16 flex items-center justify-center bg-gray-100 rounded">
                <QrCode className="h-10 w-10 text-gray-600" />
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-6 border-t border-gray-200 pt-3 text-center text-xs text-gray-500">
          Ce document a été généré par SOGARA Access le {new Date().toLocaleString('fr-FR')}.<br/>
          Direction Générale des Impôts - République Gabonaise
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6 flex justify-between items-center border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">
            {exportType === 'single' ? 'Exporter les informations du visiteur' : 'Exporter les données des visiteurs'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Options d'exportation */}
            <div className="space-y-6">
              {/* Format d'exportation */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">Format d'exportation</h4>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setSelectedFormat('pdf')}
                    className={`p-4 rounded-lg border text-center transition-colors ${
                      selectedFormat === 'pdf'
                        ? 'border-red-500 bg-red-50 ring-2 ring-red-200'
                        : 'border-gray-200 hover:border-red-300'
                    }`}
                  >
                    <FileText className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <div className="font-medium">PDF</div>
                  </button>
                  
                  <button
                    onClick={() => setSelectedFormat('excel')}
                    className={`p-4 rounded-lg border text-center transition-colors ${
                      selectedFormat === 'excel'
                        ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <FileSpreadsheet className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="font-medium">Excel</div>
                  </button>
                  
                  <button
                    onClick={() => setSelectedFormat('print')}
                    className={`p-4 rounded-lg border text-center transition-colors ${
                      selectedFormat === 'print'
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <Printer className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="font-medium">Imprimer</div>
                  </button>
                </div>
              </div>
              
              {/* Données à inclure */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">Informations à inclure</h4>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={includeFields.personalInfo}
                      onChange={() => toggleField('personalInfo')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-600" />
                      <span>Informations personnelles</span>
                    </div>
                  </label>
                  
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={includeFields.contactInfo}
                      onChange={() => toggleField('contactInfo')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      <span>Coordonnées</span>
                    </div>
                  </label>
                  
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={includeFields.visitDetails}
                      onChange={() => toggleField('visitDetails')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <span>Détails de la visite</span>
                    </div>
                  </label>
                  
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={includeFields.identityInfo}
                      onChange={() => toggleField('identityInfo')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <span>Document d'identité</span>
                    </div>
                  </label>
                  
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={includeFields.badgeInfo}
                      onChange={() => toggleField('badgeInfo')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div className="flex items-center gap-2">
                      <QrCode className="h-4 w-4 text-blue-600" />
                      <span>Informations du badge</span>
                    </div>
                  </label>
                  
                  {exportType === 'single' && (
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={includeFields.photo}
                        onChange={() => toggleField('photo')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-blue-600" />
                        <span>Photo</span>
                      </div>
                    </label>
                  )}
                </div>
              </div>
              
              {/* Format spécifique pour l'exportation multiple */}
              {exportType === 'multiple' && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="text-md font-medium text-blue-900 mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    Résumé de l'exportation
                  </h4>
                  <p className="text-sm text-blue-800 mb-2">
                    Cette exportation inclura {visitors.length} visiteurs avec les informations sélectionnées ci-dessus.
                  </p>
                  {selectedFormat === 'excel' && (
                    <p className="text-sm text-blue-800">
                      Les données seront organisées en feuilles par catégorie pour faciliter l'analyse.
                    </p>
                  )}
                </div>
              )}
            </div>
            
            {/* Aperçu (uniquement pour l'exportation individuelle) */}
            {exportType === 'single' && visitor && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 max-h-[500px] overflow-auto">
                <h4 className="text-lg font-medium text-gray-900 mb-3">Aperçu du document</h4>
                {previewDocument()}
              </div>
            )}
            
            {/* Liste d'exportation (pour l'exportation multiple) */}
            {exportType === 'multiple' && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 max-h-[500px] overflow-auto">
                <h4 className="text-lg font-medium text-gray-900 mb-3">Visiteurs à exporter ({visitors.length})</h4>
                
                <div className="divide-y divide-gray-200">
                  {visitors.slice(0, 7).map((v, index) => (
                    <div key={index} className="py-3 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{v.fullName}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(v.checkInTime).toLocaleDateString('fr-FR')} • {v.serviceRequested}
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        v.status === 'present' ? 'bg-green-100 text-green-800' :
                        v.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {v.status === 'present' ? 'Présent' :
                         v.status === 'completed' ? 'Terminé' :
                         'Dépassement'}
                      </div>
                    </div>
                  ))}
                  
                  {visitors.length > 7 && (
                    <div className="py-3 text-center text-sm text-gray-500">
                      + {visitors.length - 7} autres visiteurs
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Annuler
          </button>
          
          <button
            onClick={handleExport}
            disabled={exportInProgress}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exportInProgress ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                <span>Génération en cours...</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                <span>
                  {selectedFormat === 'print' ? 'Imprimer' : 
                   `Exporter en ${selectedFormat.toUpperCase()}`}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};