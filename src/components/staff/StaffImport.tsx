import React, { useState, useRef } from 'react';
import { Upload, FileText, FileSpreadsheet, Camera, Zap, CheckCircle, X, AlertTriangle, Eye, User } from 'lucide-react';
import { StaffMember } from '../../types/staff';
import { generateStaffId } from '../../utils/staffUtils';

interface StaffImportProps {
  onImport: (staff: StaffMember[]) => void;
  onClose: () => void;
}

export const StaffImport: React.FC<StaffImportProps> = ({ onImport, onClose }) => {
  const [importMethod, setImportMethod] = useState<'csv' | 'excel' | 'pdf' | 'camera'>('csv');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<StaffMember[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [aiConfidence, setAiConfidence] = useState<number>(0);
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    
    if (!e.target.files || e.target.files.length === 0) {
      setFile(null);
      setPreview([]);
      return;
    }
    
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    
    // Check file type
    const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
    
    if (importMethod === 'csv' && fileExtension !== 'csv') {
      setError('Veuillez sélectionner un fichier CSV');
      setFile(null);
      return;
    }
    
    if (importMethod === 'excel' && !['xlsx', 'xls'].includes(fileExtension || '')) {
      setError('Veuillez sélectionner un fichier Excel');
      setFile(null);
      return;
    }
    
    if (importMethod === 'pdf' && fileExtension !== 'pdf') {
      setError('Veuillez sélectionner un fichier PDF');
      setFile(null);
      return;
    }
    
    // Process the file with AI simulation
    processFile(selectedFile);
  };
  
  // Simulate AI processing of the file
  const processFile = async (file: File) => {
    setIsProcessing(true);
    setPreview([]);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      // This is a simulation of AI processing
      // In a real app, this would be an API call
      
      // Generate random confidence score between 85% and 99%
      const confidence = 85 + Math.floor(Math.random() * 15);
      setAiConfidence(confidence);
      
      // Generate mock data based on the import method
      let mockData: StaffMember[] = [];
      
      if (importMethod === 'camera') {
        // Simulate camera capture
        mockData = [generateMockStaffMember()];
      } else {
        // Simulate file import
        const numRecords = 3 + Math.floor(Math.random() * 5); // 3-7 records
        for (let i = 0; i < numRecords; i++) {
          mockData.push(generateMockStaffMember());
        }
      }
      
      setPreview(mockData);
      setIsProcessing(false);
    } catch (err) {
      console.error('Error processing file:', err);
      setError('Erreur lors du traitement du fichier');
      setIsProcessing(false);
    }
  };
  
  // Generate a mock staff member
  const generateMockStaffMember = (): StaffMember => {
    const firstNames = ['Thomas', 'Marie', 'Laurent', 'Sophie', 'Pierre', 'Isabelle'];
    const lastNames = ['DUPONT', 'MARTIN', 'BERNARD', 'PETIT', 'DUBOIS', 'THOMAS'];
    const functions = ['Agent Administratif', 'Responsable', 'Conseiller', 'Assistant', 'Chef de Service', 'Technicien'];
    const departments = ['Documentation', 'Administration', 'Immigration', 'IT', 'Accueil', 'Services Généraux'];
    const roles = ['Agent', 'Chef d\'équipe', 'Manager', 'Administrateur', 'Superviseur'];
    const skills = ['Administration', 'Gestion', 'Communication', 'Informatique', 'Accueil', 'Langues', 'Documentation'];
    const languages = ['Français', 'Anglais', 'Espagnol'];
    
    const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const randomFunction = functions[Math.floor(Math.random() * functions.length)];
    const randomDepartment = departments[Math.floor(Math.random() * departments.length)];
    const randomRole = roles[Math.floor(Math.random() * roles.length)];
    
    // Generate 1-3 random skills
    const numSkills = 1 + Math.floor(Math.random() * 3);
    const randomSkills = [];
    for (let i = 0; i < numSkills; i++) {
      const skill = skills[Math.floor(Math.random() * skills.length)];
      if (!randomSkills.includes(skill)) {
        randomSkills.push(skill);
      }
    }
    
    // Generate 1-2 random languages
    const numLanguages = 1 + Math.floor(Math.random() * 2);
    const randomLanguages = [];
    for (let i = 0; i < numLanguages; i++) {
      const language = languages[Math.floor(Math.random() * languages.length)];
      if (!randomLanguages.includes(language)) {
        randomLanguages.push(language);
      }
    }
    
    return {
      id: generateStaffId(),
      firstName: randomFirstName,
      lastName: randomLastName,
      function: randomFunction,
      department: randomDepartment,
      internalPhone: `${1 + Math.floor(Math.random() * 9)}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      email: `${randomFirstName.toLowerCase()}.${randomLastName.toLowerCase()}@dgi.ga`,
      isAvailable: true,
      location: `Bureau ${100 + Math.floor(Math.random() * 400)}`,
      role: randomRole,
      skills: randomSkills,
      languages: randomLanguages,
      lastSeen: new Date().toISOString()
    };
  };
  
  // Trigger file input click
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };
  
  // Handle camera capture (simulated)
  const handleCameraCapture = () => {
    setIsProcessing(true);
    
    // Simulate camera processing
    setTimeout(() => {
      const mockData = [generateMockStaffMember()];
      setPreview(mockData);
      setAiConfidence(90 + Math.floor(Math.random() * 10)); // 90-99% confidence
      setIsProcessing(false);
    }, 2000);
  };
  
  // Confirm import
  const confirmImport = () => {
    if (preview.length > 0) {
      onImport(preview);
    }
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-5 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Import IA de Personnel</h2>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="text-green-100">
            Importez facilement du personnel à partir de fichiers ou en utilisant la caméra
          </p>
        </div>
        
        {/* Method Selection */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-medium text-gray-900 mb-4">Choisissez une méthode d'import</h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => setImportMethod('csv')}
              className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                importMethod === 'csv' 
                  ? 'bg-blue-50 border-2 border-blue-500 shadow-md' 
                  : 'border border-gray-200 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              <FileText className="h-8 w-8 text-blue-600" />
              <span className="font-medium text-gray-900">CSV</span>
              <span className="text-xs text-gray-500">Fichier .csv</span>
            </button>
            
            <button
              onClick={() => setImportMethod('excel')}
              className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                importMethod === 'excel' 
                  ? 'bg-green-50 border-2 border-green-500 shadow-md' 
                  : 'border border-gray-200 hover:border-green-300 hover:bg-green-50'
              }`}
            >
              <FileSpreadsheet className="h-8 w-8 text-green-600" />
              <span className="font-medium text-gray-900">Excel</span>
              <span className="text-xs text-gray-500">Fichier .xlsx</span>
            </button>
            
            <button
              onClick={() => setImportMethod('pdf')}
              className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                importMethod === 'pdf' 
                  ? 'bg-red-50 border-2 border-red-500 shadow-md' 
                  : 'border border-gray-200 hover:border-red-300 hover:bg-red-50'
              }`}
            >
              <FileText className="h-8 w-8 text-red-600" />
              <span className="font-medium text-gray-900">PDF</span>
              <span className="text-xs text-gray-500">Fichier .pdf</span>
            </button>
            
            <button
              onClick={() => setImportMethod('camera')}
              className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                importMethod === 'camera' 
                  ? 'bg-purple-50 border-2 border-purple-500 shadow-md' 
                  : 'border border-gray-200 hover:border-purple-300 hover:bg-purple-50'
              }`}
            >
              <Camera className="h-8 w-8 text-purple-600" />
              <span className="font-medium text-gray-900">Caméra</span>
              <span className="text-xs text-gray-500">Scanner</span>
            </button>
          </div>
        </div>
        
        {/* Upload/Capture Area */}
        <div className="p-6">
          {importMethod === 'camera' ? (
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-4">Capture d'image</h3>
              
              {isProcessing ? (
                <div className="bg-gray-100 rounded-xl h-60 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 border-t-2 border-b-2 border-purple-600 rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-600 font-medium">Analyse en cours...</p>
                  <p className="text-gray-500 text-sm mt-1">L'IA traite les données</p>
                </div>
              ) : (
                <div className="bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 h-60 flex flex-col items-center justify-center cursor-pointer hover:border-purple-400 transition-colors"
                     onClick={handleCameraCapture}>
                  <Camera className="h-12 w-12 text-gray-400 mb-3" />
                  <p className="text-gray-600 font-medium">Cliquez pour activer la caméra</p>
                  <p className="text-gray-500 text-sm mt-1">ou déposez une image ici</p>
                  
                  <button className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    <span>Capturer</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-4">Téléverser un fichier</h3>
              
              {file && !isProcessing ? (
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    {importMethod === 'csv' && <FileText className="h-8 w-8 text-blue-600" />}
                    {importMethod === 'excel' && <FileSpreadsheet className="h-8 w-8 text-green-600" />}
                    {importMethod === 'pdf' && <FileText className="h-8 w-8 text-red-600" />}
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-600">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      setFile(null);
                      setPreview([]);
                    }}
                    className="p-2 hover:bg-blue-100 rounded-lg"
                  >
                    <X className="h-5 w-5 text-blue-600" />
                  </button>
                </div>
              ) : isProcessing ? (
                <div className="bg-gray-100 rounded-xl h-48 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 border-t-2 border-b-2 border-blue-600 rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-600 font-medium">Analyse en cours...</p>
                  <p className="text-gray-500 text-sm mt-1">Extraction par IA</p>
                </div>
              ) : (
                <div className="bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 h-48 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition-colors"
                     onClick={triggerFileUpload}>
                  <Upload className="h-12 w-12 text-gray-400 mb-3" />
                  <p className="text-gray-600 font-medium">Cliquez pour choisir un fichier</p>
                  <p className="text-gray-500 text-sm mt-1">ou déposez le fichier ici</p>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept={importMethod === 'csv' ? '.csv' : 
                            importMethod === 'excel' ? '.xlsx,.xls' : 
                            '.pdf'}
                  />
                </div>
              )}
              
              {error && (
                <div className="mt-3 bg-red-50 text-red-800 p-3 rounded-lg border border-red-200 flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}
            </div>
          )}
          
          {/* Preview */}
          {preview.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">Aperçu des données ({preview.length})</h3>
                
                <div className="flex items-center gap-2">
                  <div className="text-sm text-gray-500">Confiance IA:</div>
                  <div className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5" />
                    {aiConfidence}%
                  </div>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm text-left text-gray-600">
                  <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
                    <tr>
                      <th className="px-4 py-3">Nom</th>
                      <th className="px-4 py-3">Fonction</th>
                      <th className="px-4 py-3">Département</th>
                      <th className="px-4 py-3">Contact</th>
                      <th className="px-4 py-3">Rôle</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((staff, index) => (
                      <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {staff.firstName} {staff.lastName}
                        </td>
                        <td className="px-4 py-3">{staff.function}</td>
                        <td className="px-4 py-3">{staff.department}</td>
                        <td className="px-4 py-3">{staff.internalPhone}</td>
                        <td className="px-4 py-3">
                          {staff.role && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {staff.role}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 bg-green-50 p-4 rounded-lg border border-green-200 flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900">Analyse IA réussie</h4>
                  <p className="text-sm text-green-700 mt-1">
                    L'IA a extrait {preview.length} membres du personnel avec une confiance de {aiConfidence}%.
                    Vérifiez les informations avant d'importer.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex justify-end gap-3 p-6 bg-gray-50 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          
          {!isProcessing && importMethod !== 'camera' && !file && (
            <button
              onClick={triggerFileUpload}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sélectionner un fichier
            </button>
          )}
          
          {!isProcessing && importMethod === 'camera' && preview.length === 0 && (
            <button
              onClick={handleCameraCapture}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Lancer la caméra
            </button>
          )}
          
          {preview.length > 0 && (
            <button
              onClick={confirmImport}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Importer {preview.length} membre{preview.length > 1 ? 's' : ''}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};