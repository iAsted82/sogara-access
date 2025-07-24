import React, { useState, useRef } from 'react';
import { Upload, FileText, X, CheckCircle, AlertTriangle, Download, FileSpreadsheet } from 'lucide-react';
import { StaffMember } from '../../types/staff';
import { generateStaffId } from '../../utils/staffUtils';

interface StaffImportProps {
  onImport: (staffMembers: StaffMember[]) => void;
  onClose: () => void;
}

export const StaffImport: React.FC<StaffImportProps> = ({ onImport, onClose }) => {
  const [dragOver, setDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importPreview, setImportPreview] = useState<StaffMember[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [step, setStep] = useState<'upload' | 'preview' | 'success'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    setErrors([]);

    try {
      const text = await file.text();
      let staffData: StaffMember[] = [];

      if (file.name.endsWith('.csv')) {
        staffData = parseCSV(text);
      } else if (file.name.endsWith('.json')) {
        staffData = parseJSON(text);
      } else {
        throw new Error('Format de fichier non supporté. Utilisez CSV ou JSON.');
      }

      setImportPreview(staffData);
      setStep('preview');
    } catch (error) {
      setErrors([error instanceof Error ? error.message : 'Erreur lors du traitement du fichier']);
    } finally {
      setIsProcessing(false);
    }
  };

  const parseCSV = (text: string): StaffMember[] => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) throw new Error('Le fichier CSV doit contenir au moins un en-tête et une ligne de données');

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data: StaffMember[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      
      if (values.length !== headers.length) {
        setErrors(prev => [...prev, `Ligne ${i + 1}: Nombre de colonnes incorrect`]);
        continue;
      }

      try {
        const staffMember: StaffMember = {
          id: generateStaffId(),
          firstName: getValueByHeader(headers, values, 'firstName') || getValueByHeader(headers, values, 'prenom') || '',
          lastName: getValueByHeader(headers, values, 'lastName') || getValueByHeader(headers, values, 'nom') || '',
          function: getValueByHeader(headers, values, 'function') || getValueByHeader(headers, values, 'fonction') || '',
          department: getValueByHeader(headers, values, 'department') || getValueByHeader(headers, values, 'departement') || '',
          internalPhone: getValueByHeader(headers, values, 'internalPhone') || getValueByHeader(headers, values, 'telephone') || '',
          email: getValueByHeader(headers, values, 'email') || '',
          isAvailable: getValueByHeader(headers, values, 'isAvailable')?.toLowerCase() === 'true' || 
                      getValueByHeader(headers, values, 'disponible')?.toLowerCase() === 'oui' || true,
          location: getValueByHeader(headers, values, 'location') || getValueByHeader(headers, values, 'localisation'),
          notes: getValueByHeader(headers, values, 'notes'),
          role: getValueByHeader(headers, values, 'role'),
          lastSeen: new Date().toISOString()
        };

        // Validation basique
        if (!staffMember.firstName || !staffMember.lastName || !staffMember.function || !staffMember.department) {
          setErrors(prev => [...prev, `Ligne ${i + 1}: Champs obligatoires manquants`]);
          continue;
        }

        data.push(staffMember);
      } catch (error) {
        setErrors(prev => [...prev, `Ligne ${i + 1}: ${error instanceof Error ? error.message : 'Erreur de parsing'}`]);
      }
    }

    return data;
  };

  const parseJSON = (text: string): StaffMember[] => {
    const jsonData = JSON.parse(text);
    
    if (!Array.isArray(jsonData)) {
      throw new Error('Le fichier JSON doit contenir un tableau de données');
    }

    return jsonData.map((item, index) => {
      const staffMember: StaffMember = {
        id: generateStaffId(),
        firstName: item.firstName || item.prenom || '',
        lastName: item.lastName || item.nom || '',
        function: item.function || item.fonction || '',
        department: item.department || item.departement || '',
        internalPhone: item.internalPhone || item.telephone || '',
        email: item.email || '',
        isAvailable: item.isAvailable !== undefined ? item.isAvailable : 
                    item.disponible !== undefined ? item.disponible : true,
        location: item.location || item.localisation,
        notes: item.notes,
        role: item.role,
        lastSeen: new Date().toISOString()
      };

      // Validation
      if (!staffMember.firstName || !staffMember.lastName || !staffMember.function || !staffMember.department) {
        setErrors(prev => [...prev, `Ligne ${index + 1}: Champs obligatoires manquants`]);
      }

      return staffMember;
    });
  };

  const getValueByHeader = (headers: string[], values: string[], headerName: string): string | undefined => {
    const index = headers.findIndex(h => 
      h.toLowerCase() === headerName.toLowerCase() ||
      h.toLowerCase().includes(headerName.toLowerCase())
    );
    return index >= 0 ? values[index] : undefined;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const confirmImport = () => {
    onImport(importPreview);
    setStep('success');
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const downloadTemplate = () => {
    const csvContent = 'firstName,lastName,function,department,internalPhone,email,location,notes,role\n' +
                      'Jean,DUPONT,Chef Service,Documentation,4001,jean.dupont@sogara.ga,Bureau 201,Notes exemple,Manager\n' +
                      'Marie,MARTIN,Agent,Administration,4002,marie.martin@sogara.ga,Bureau 105,,Agent';
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'template_personnel_sogara.csv';
    link.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
          <div>
            <h3 className="text-lg font-semibold text-blue-900">Import Personnel</h3>
            <p className="text-sm text-blue-700">Importer des données personnel depuis un fichier</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {step === 'upload' && (
            <div className="space-y-6">
              {/* Zone de téléchargement */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
                } ${isProcessing ? 'opacity-50' : ''}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  {isProcessing ? 'Traitement en cours...' : 'Glissez-déposez votre fichier ici'}
                </h4>
                <p className="text-gray-600 mb-4">ou</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  Sélectionner un fichier
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.json"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <p className="text-sm text-gray-500 mt-4">
                  Formats supportés: CSV, JSON
                </p>
              </div>

              {/* Template */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <FileSpreadsheet className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-yellow-800">Modèle de fichier</h4>
                    <p className="text-sm text-yellow-700 mb-3">
                      Téléchargez le modèle CSV pour structurer vos données correctement.
                    </p>
                    <button
                      onClick={downloadTemplate}
                      className="text-yellow-800 hover:text-yellow-900 font-medium text-sm flex items-center gap-1"
                    >
                      <Download className="h-4 w-4" />
                      Télécharger le modèle
                    </button>
                  </div>
                </div>
              </div>

              {/* Format attendu */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Colonnes attendues :</h4>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                  <div>• firstName (Prénom) *</div>
                  <div>• lastName (Nom) *</div>
                  <div>• function (Fonction) *</div>
                  <div>• department (Département) *</div>
                  <div>• internalPhone (Tél. interne) *</div>
                  <div>• email (Email) *</div>
                  <div>• location (Localisation)</div>
                  <div>• notes (Notes)</div>
                  <div>• role (Rôle)</div>
                </div>
                <p className="text-xs text-gray-500 mt-2">* Champs obligatoires</p>
              </div>

              {/* Erreurs */}
              {errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-red-800">Erreurs détectées :</h4>
                      <ul className="text-sm text-red-700 mt-2 space-y-1">
                        {errors.map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 'preview' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-medium text-gray-900">Aperçu de l'import</h4>
                  <p className="text-sm text-gray-600">
                    {importPreview.length} membre(s) du personnel à importer
                  </p>
                </div>
                <button
                  onClick={() => setStep('upload')}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  ← Retour
                </button>
              </div>

              {/* Aperçu des données */}
              <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium text-gray-700">Nom</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-700">Fonction</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-700">Département</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-700">Contact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {importPreview.map((staff, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-3 py-2">
                          {staff.firstName} {staff.lastName}
                        </td>
                        <td className="px-3 py-2">{staff.function}</td>
                        <td className="px-3 py-2">{staff.department}</td>
                        <td className="px-3 py-2">
                          <div className="text-xs">
                            <div>{staff.internalPhone}</div>
                            <div className="text-gray-500">{staff.email}</div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Erreurs */}
              {errors.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">Avertissements :</h4>
                      <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                        {errors.slice(0, 5).map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                        {errors.length > 5 && (
                          <li>• ... et {errors.length - 5} autres erreurs</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setStep('upload')}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmImport}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Confirmer l'import
                </button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Import réussi !</h4>
              <p className="text-gray-600">
                {importPreview.length} membre(s) du personnel ont été importés avec succès.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};