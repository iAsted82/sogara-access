import React, { useState, useEffect, useRef } from 'react';
import { 
  UserCheck, 
  Camera, 
  QrCode, 
  Package, 
  Bell, 
  Clock, 
  Calendar,
  Search, 
  Filter, 
  Plus, 
  User, 
  Building2, 
  Phone, 
  Mail, 
  FileText, 
  Shield, 
  Map,
  Clipboard, 
  Check, 
  X, 
  Eye,
  Download, 
  AlertTriangle,
  RefreshCw,
  Zap,
  Star,
  Sparkles,
  Users,
  CheckCircle,
  Upload,
  InfoIcon,
  Printer,
  Power,
  Monitor,
  Tag
} from 'lucide-react';
import { Appointment } from '../../types/appointment';
import { VisitorRegistrationForm } from '../visitor/VisitorRegistrationForm';
import { appointmentsData } from '../../data/appointmentsData';
import { AppointmentVerificationPanel } from '../visitor/AppointmentVerificationPanel';
import { extractCNIData, extractPassportData, extractPermisData, autoExtractDocument } from '../../utils/aiExtraction';
import { BadgePreview } from '../ui/BadgePreview';
import { generateBadgeNumber, generateQRCode } from '../../utils/badgeGenerator';
import { useAuth } from '../../contexts/AuthContext';
import { BadgeManagementModule } from './BadgeManagementModule';

interface Visitor {
  id: string;
  badgeNumber: string;
  firstName: string;
  lastName: string;
  company: string;
  phone: string;
  email?: string;
  purpose: string;
  contactPerson: string;
  department: string;
  idType: string;
  idNumber: string;
  checkInTime: string;
  expectedDuration: string;
  status: 'active' | 'completed' | 'delayed';
  photo?: string;
  securityLevel: 'standard' | 'elevated' | 'maximum';
}

export const ReceptionModule: React.FC = () => {
  const { user } = useAuth();
  const isReceptionist = user?.role === 'RECEP';
  
  // State variables
  const [activeSection, setActiveSection] = useState<'register' | 'visitors' | 'scanner' | 'badges' | 'packages' | 'alerts'>('register');
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [visitorFormData, setVisitorFormData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    phone: '',
    email: '',
    purpose: '',
    contactPerson: '',
    department: '',
    idType: 'cni',
    idNumber: '',
    expectedDuration: '1h',
    securityLevel: 'standard'
  });
  
  // Scanner state
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [scanConfidence, setScanConfidence] = useState(0);
  const [scanProgress, setScanProgress] = useState(0);
  
  // Badge state
  const [showBadgePreview, setShowBadgePreview] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
  const [badgeData, setBadgeData] = useState<any>(null);
  const [activeBadges, setActiveBadges] = useState<string[]>([]);
  
  // Other state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  
  // New state for additional features
  const [forceUpdate, setForceUpdate] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [badges, setBadges] = useState([
    { id: 'BDG001', visitorName: 'Marie OBAME', company: 'Ministère des Finances', isActive: true, zones: ['Accueil', 'Services'] },
    { id: 'BDG002', visitorName: 'Jean NGUEMA', company: 'Consultant', isActive: true, zones: ['Accueil', 'Direction'] },
    { id: 'BDG003', visitorName: 'Paul OBIANG', company: 'DHL', isActive: false, zones: ['Accueil', 'Logistique'] }
  ]);
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);
  const [surveillanceActive, setSurveillanceActive] = useState(true);
  const [surveillanceAlerts, setSurveillanceAlerts] = useState([
    { id: 'ALT001', message: 'Visiteur sans badge détecté - Zone A', level: 'warning', time: '5 min' },
    { id: 'ALT002', message: 'Temps d\'attente excessif - Guichet 3', level: 'info', time: '15 min' }
  ]);
  const [emergencyMode, setEmergencyMode] = useState(false);

  // New state for visitor registration form
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');

  // Écouteurs d'événements pour la navigation interne et la mise à jour forcée
  useEffect(() => {
    const handleNavigation = (event: CustomEvent) => {
      const { section } = event.detail;
      if (section && ['register', 'visitors', 'scanner', 'badges', 'surveillance', 'alerts'].includes(section)) {
        setActiveSection(section as any);
        console.log('🧭 Navigation vers section de réception:', section);
      }
    };

    const handleForceUpdate = () => {
      setForceUpdate(prev => prev + 1);
      console.log('🔄 Module Réception rechargé');
    };

    window.addEventListener('navigate-reception-module', handleNavigation as EventListener);
    window.addEventListener('force-update', handleForceUpdate);
    window.addEventListener('force-receptionist-update', handleForceUpdate);

    return () => {
      window.removeEventListener('navigate-reception-module', handleNavigation as EventListener);
      window.removeEventListener('force-update', handleForceUpdate);
      window.removeEventListener('force-receptionist-update', handleForceUpdate);
    };
  }, []);
  
  // Initialize with sample visitors
  useEffect(() => {
    if (visitors.length === 0) {
      const initialVisitors: Visitor[] = [
        {
          id: '1',
          badgeNumber: 'V-2024-001',
          firstName: 'Marie',
          lastName: 'OBAME',
          company: 'Ministère des Finances',
          phone: '+241 77 12 34 56',
          email: 'marie.obame@finances.ga',
          purpose: 'Réunion trimestrielle',
          contactPerson: 'Jean NGUEMA',
          department: 'Documentation',
          idType: 'CNI',
          idNumber: 'GA12345678',
          checkInTime: '09:15',
          expectedDuration: '2h',
          status: 'active',
          securityLevel: 'elevated'
        },
        {
          id: '2',
          badgeNumber: 'V-2024-002',
          firstName: 'Paul',
          lastName: 'OBIANG',
          company: 'SEEG',
          phone: '+241 66 78 90 12',
          purpose: 'Maintenance informatique',
          contactPerson: 'Marie AKUE',
          department: 'Informatique',
          idType: 'Passeport',
          idNumber: 'PAB567890',
          checkInTime: '10:30',
          expectedDuration: '4h',
          status: 'active',
          securityLevel: 'standard'
        }
      ];
      
      setVisitors(initialVisitors);
      setActiveBadges(['V-2024-001', 'V-2024-002']);
    }
  }, [visitors.length]);
  
  // Form handling
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setVisitorFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle visitor registration
  const handleRegisterVisitor = (data: any) => {
    console.log('Visitor registered:', data);
    
    // Show success message
    alert(`Visiteur ${data.firstName} ${data.lastName} enregistré avec succès!`);
  };

  // Handle visitor name change for appointment verification
  const handleVisitorNameChange = (name: string) => {
    setVisitorName(name);
  };

  // Handle visitor contact info change
  const handleVisitorContactChange = (phone: string, email: string) => {
    setVisitorPhone(phone);
    setVisitorEmail(email);
  };

  // Handle appointment selection
  const handleAppointmentSelected = (appointment: any) => {
    setSelectedAppointment(appointment);
    console.log('Selected appointment:', appointment);
  };
  
  // AI Scanner functionality
  const handleStartScan = async () => {
    setIsScanning(true);
    setScanProgress(0);
    setScanResult(null);
    
    try {
      // Simulate scanning process
      for (let i = 0; i <= 100; i += 10) {
        setScanProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      // Simulate document extraction
      const result = await autoExtractDocument('dummy-image-data');
      setScanResult(result);
      setScanConfidence(result.confidence);
      
      // Populate form with extracted data
      if (result.success && result.data) {
        setVisitorFormData(prev => ({
          ...prev,
          firstName: result.data.firstName || prev.firstName,
          lastName: result.data.lastName || prev.lastName,
          idType: result.data.idType?.toLowerCase() || prev.idType,
          idNumber: result.data.idNumber || prev.idNumber,
        }));
        
        setSuccessMessage(`Document extrait avec succès! Taux de confiance: ${Math.round(result.confidence * 100)}%`);
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
      }
    } catch (error) {
      console.error('Erreur lors du scan:', error);
      setErrorMessage('Erreur lors du scan du document');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setIsScanning(false);
    }
  };
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setIsScanning(true);
    setScanProgress(0);
    
    try {
      // Simulate scanning progress
      for (let i = 0; i <= 100; i += 10) {
        setScanProgress(i);
        await new Promise(resolve => setTimeout(resolve, 150));
      }
      
      // Simulate document extraction
      const result = await autoExtractDocument(file);
      setScanResult(result);
      setScanConfidence(result.confidence);
      
      // Populate form with extracted data
      if (result.success && result.data) {
        setVisitorFormData(prev => ({
          ...prev,
          firstName: result.data.firstName || prev.firstName,
          lastName: result.data.lastName || prev.lastName,
          idType: result.data.idType?.toLowerCase() || prev.idType,
          idNumber: result.data.idNumber || prev.idNumber,
        }));
        
        setSuccessMessage(`Document extrait avec succès! Taux de confiance: ${Math.round(result.confidence * 100)}%`);
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
      }
    } catch (error) {
      console.error('Erreur lors du traitement du fichier:', error);
      setErrorMessage('Erreur lors du traitement du fichier');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setIsScanning(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Simuler le scan de document avec l'IA
  const handleScanDocument = () => {
    setScanning(true);
    setScanResult(null);
    
    // Simuler un délai de traitement
    setTimeout(() => {
      const success = Math.random() > 0.1; // 90% de réussite
      const confidence = 0.85 + (Math.random() * 0.14); // 85-99% de confiance
      
      const mockData = {
        firstName: 'Marie',
        lastName: 'OBAME',
        idNumber: '240115001234',
        nationality: 'Gabonaise',
        birthDate: '1985-03-15',
        issueDate: '2020-01-15',
        expiryDate: '2030-01-15',
        placeOfBirth: 'Libreville'
      };
      
      setScanResult({
        success,
        confidence,
        data: success ? mockData : {}
      });
      
      setScanning(false);
    }, 2000);
  };

  const handleCreateBadge = () => {
    const newBadge = {
      id: `BDG00${badges.length + 1}`,
      visitorName: 'Nouveau Visiteur',
      company: 'Entreprise',
      isActive: true,
      zones: ['Accueil']
    };
    
    setBadges(prev => [...prev, newBadge]);
    setSelectedBadge(newBadge.id);
    
    // Afficher notification de succès
    alert('Badge créé avec succès !');
  };

  const handleToggleSurveillance = () => {
    setSurveillanceActive(prev => !prev);
    alert(`Surveillance ${!surveillanceActive ? 'activée' : 'désactivée'} !`);
  };

  const handleEmergencyAlert = () => {
    setEmergencyMode(true);
    alert('ALERTE D\'URGENCE DÉCLENCHÉE ! Tous les services ont été notifiés.');
    
    // Désactiver après 5 secondes
    setTimeout(() => setEmergencyMode(false), 5000);
  };
  
  // Badge functionality
  const handleGenerateBadge = (visitor: Visitor) => {
    setSelectedVisitor(visitor);
    
    // Create badge data
    const badgeData = {
      number: visitor.badgeNumber,
      visitorName: `${visitor.firstName} ${visitor.lastName}`,
      company: visitor.company,
      purpose: visitor.purpose,
      employeeToVisit: visitor.contactPerson,
      validDate: new Date().toLocaleDateString('fr-FR'),
      qrCode: generateQRCode(visitor.badgeNumber, visitor.id),
      accessZones: ['Accueil', 'Zone Public'],
      securityLevel: visitor.securityLevel
    };
    
    setBadgeData(badgeData);
    setShowBadgePreview(true);
  };
  
  const handlePrintBadge = () => {
    // Simulate badge printing
    setSuccessMessage(`Badge ${selectedVisitor?.badgeNumber} imprimé avec succès!`);
    setShowSuccessMessage(true);
    setShowBadgePreview(false);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };
  
  // Visitor management
  const handleCheckoutVisitor = (visitorId: string) => {
    setVisitors(prev => 
      prev.map(visitor => 
        visitor.id === visitorId 
          ? { ...visitor, status: 'completed' as const } 
          : visitor
      )
    );
    
    // Remove from active badges
    const visitor = visitors.find(v => v.id === visitorId);
    if (visitor) {
      setActiveBadges(prev => prev.filter(badge => badge !== visitor.badgeNumber));
      
      setSuccessMessage(`Visiteur ${visitor.firstName} ${visitor.lastName} a quitté les locaux`);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    }
  };
  
  const handleRevokeBadge = (badgeNumber: string) => {
    // Remove badge from active list
    setActiveBadges(prev => prev.filter(badge => badge !== badgeNumber));
    
    // Update visitor status
    const visitor = visitors.find(v => v.badgeNumber === badgeNumber);
    if (visitor) {
      setVisitors(prev => 
        prev.map(v => 
          v.id === visitor.id 
            ? { ...v, status: 'completed' as const } 
            : v
        )
      );
      
      setSuccessMessage(`Badge ${badgeNumber} révoqué avec succès`);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    }
  };
  
  // Filtered visitors
  const filteredVisitors = visitors.filter(visitor => {
    const matchesSearch = 
      visitor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.badgeNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = filterStatus === 'all' || visitor.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });
  
  // Emergency alert simulation
  const triggerEmergencyAlert = (type: string) => {
    const alertMessages = {
      'fire': 'ALERTE INCENDIE déclenchée! Procédure d\'évacuation initiée.',
      'security': 'ALERTE SÉCURITÉ déclenchée! Équipe de sécurité notifiée.',
      'medical': 'URGENCE MÉDICALE signalée! Premiers secours demandés.',
      'evacuation': 'ÉVACUATION GÉNÉRALE déclenchée! Veuillez suivre le protocole d\'urgence.'
    };
    
    setErrorMessage(alertMessages[type as keyof typeof alertMessages] || 'Alerte déclenchée!');
    setTimeout(() => setErrorMessage(''), 5000);
  };
  
  // UI sections
  const renderRegisterForm = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <UserCheck className="h-6 w-6 text-blue-600" />
        Enregistrement Visiteur
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <VisitorRegistrationForm 
            appointments={appointmentsData} 
            onRegisterVisitor={handleRegisterVisitor}
            onAppointmentSelected={handleAppointmentSelected}
          />
        </div>

        <div className="space-y-6">
          <AppointmentVerificationPanel
            appointments={appointmentsData}
            visitorName={visitorName}
            phoneNumber={visitorPhone}
            email={visitorEmail}
            onAppointmentSelected={handleAppointmentSelected}
          />

          {/* Section scan document */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Scan IA Document</h3>
              {/* Contenu du scan */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  const renderScannerInterface = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <Camera className="h-6 w-6 text-green-600" />
        Scanner IA Documents
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Zone de Scan</h3>
          
          {isScanning ? (
            <div className="text-center py-10">
              <div className="mb-4">
                <div className="w-20 h-20 mx-auto border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-gray-700 mb-2">Analyse du document en cours...</p>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-600 h-2 transition-all duration-300"
                  style={{ width: `${scanProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-2">{scanProgress}% traité</p>
            </div>
          ) : (
            <div className="text-center">
              {scanResult ? (
                <div className="py-6 text-center">
                  <div className="mb-4 mx-auto">
                    <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                      <Sparkles className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold text-green-800 mb-2">Document analysé avec succès!</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Taux de confiance: <span className="font-semibold">{Math.round(scanConfidence * 100)}%</span>
                  </p>
                  
                  <div className="text-left bg-white p-4 rounded-lg border border-gray-200 mb-4">
                    <h5 className="font-medium text-gray-900 mb-2">Données extraites:</h5>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><span className="text-gray-500">Prénom:</span> {scanResult.data.firstName || 'N/A'}</div>
                      <div><span className="text-gray-500">Nom:</span> {scanResult.data.lastName || 'N/A'}</div>
                      <div><span className="text-gray-500">Type:</span> {scanResult.data.idType || 'N/A'}</div>
                      <div><span className="text-gray-500">Numéro:</span> {scanResult.data.idNumber || 'N/A'}</div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setScanResult(null)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Nouveau scan
                  </button>
                </div>
              ) : (
                <div className="py-10 border-2 border-dashed border-gray-300 rounded-lg">
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-700 mb-6">Placez un document d'identité pour scanner</p>
                  <div className="space-y-4">
                    <button
                      onClick={handleStartScan}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors mx-auto block"
                    >
                      Démarrer le scan
                    </button>
                    <div className="text-center">
                      <span className="text-gray-500 text-sm">ou</span>
                    </div>
                    <div className="text-center">
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleFileUpload} 
                        className="hidden"
                        accept="image/*"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Importer une image
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Information Scanner IA</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Zap className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Précision IA</h4>
                  <p className="text-sm text-gray-700">99.2% d'extraction précise</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Documents supportés</h4>
                  <p className="text-sm text-gray-700">CNI, Passeport, Permis de conduire</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Temps de traitement</h4>
                  <p className="text-sm text-gray-700">2-3 secondes par document</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 p-6 rounded-xl border border-green-200">
            <h3 className="text-lg font-semibold text-green-900 mb-4">Guide d'utilisation</h3>
            <ol className="space-y-2 text-sm text-green-800">
              <li className="flex items-start gap-2">
                <span className="bg-green-200 rounded-full w-5 h-5 flex items-center justify-center text-green-700 flex-shrink-0 mt-0.5">1</span>
                <span>Placez le document d'identité face visible devant la caméra</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-green-200 rounded-full w-5 h-5 flex items-center justify-center text-green-700 flex-shrink-0 mt-0.5">2</span>
                <span>Assurez-vous que l'éclairage est suffisant</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-green-200 rounded-full w-5 h-5 flex items-center justify-center text-green-700 flex-shrink-0 mt-0.5">3</span>
                <span>Attendez que le système IA analyse automatiquement</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-green-200 rounded-full w-5 h-5 flex items-center justify-center text-green-700 flex-shrink-0 mt-0.5">4</span>
                <span>Vérifiez les informations extraites avant validation</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
  
  const renderBadgeManagement = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <QrCode className="h-6 w-6 text-purple-600" />
        Gestion des Badges
      </h2>
      
      <BadgeManagementModule 
        appointments={appointmentsData}
        onRegisterVisitor={handleRegisterVisitor}
      />
    </div>
  );
  
  const renderVisitorsList = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <Users className="h-6 w-6 text-blue-600" />
        Gestion des Visiteurs
      </h2>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Rechercher un visiteur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 pl-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Tous les statuts</option>
          <option value="active">Présents</option>
          <option value="completed">Sortis</option>
          <option value="delayed">En retard</option>
        </select>
      </div>
      
      {filteredVisitors.length > 0 ? (
        <div className="space-y-4">
          {filteredVisitors.map(visitor => {
            const statusColor = 
              visitor.status === 'active' ? 'bg-green-100 text-green-800' : 
              visitor.status === 'completed' ? 'bg-gray-100 text-gray-800' : 
              'bg-orange-100 text-orange-800';
            
            return (
              <div key={visitor.id} className="p-4 rounded-lg border border-gray-200 hover:border-blue-200 hover:bg-blue-50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-semibold flex-shrink-0">
                      {visitor.firstName.charAt(0)}{visitor.lastName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-medium text-gray-900">{visitor.firstName} {visitor.lastName}</h3>
                      <p className="text-sm text-gray-600 truncate">{visitor.company}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${statusColor}`}>
                      {visitor.status === 'active' ? (
                        <>
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                          Présent
                        </>
                      ) : visitor.status === 'completed' ? (
                        <>
                          <Check className="h-3 w-3" />
                          Sorti
                        </>
                      ) : (
                        <>
                          <Clock className="h-3 w-3" />
                          En retard
                        </>
                      )}
                    </span>
                    
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                      Badge: {visitor.badgeNumber}
                    </span>
                    
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {visitor.checkInTime}
                    </span>
                    
                    {visitor.securityLevel === 'elevated' && (
                      <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                        Sécurité Élevée
                      </span>
                    )}
                    
                    {visitor.securityLevel === 'maximum' && (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                        Sécurité Maximum
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">Contact</p>
                    <p className="text-gray-900 flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      {visitor.phone}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-gray-500 mb-1">Motif</p>
                    <p className="text-gray-900">{visitor.purpose}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-500 mb-1">Personne à voir</p>
                    <p className="text-gray-900">{visitor.contactPerson} ({visitor.department})</p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">
                      ID: <span className="text-gray-600">{visitor.idType} {visitor.idNumber}</span>
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {visitor.status === 'active' && (
                      <>
                        <button
                          onClick={() => handleGenerateBadge(visitor)}
                          className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors text-sm flex items-center gap-1"
                        >
                          <QrCode className="h-3 w-3" />
                          Badge
                        </button>
                        <button
                          onClick={() => handleCheckoutVisitor(visitor.id)}
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm flex items-center gap-1"
                        >
                          <Check className="h-3 w-3" />
                          Check-out
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Aucun visiteur trouvé</p>
        </div>
      )}
    </div>
  );
  
  const renderEmergencyAlerts = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <AlertTriangle className="h-6 w-6 text-red-600" />
        Système d'Urgence
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Alertes d'Urgence</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => triggerEmergencyAlert('fire')}
              className="p-4 bg-red-50 rounded-lg border-2 border-red-200 hover:bg-red-100 hover:border-red-300 transition-colors text-center"
            >
              <div className="w-12 h-12 mx-auto bg-red-500 text-white rounded-lg flex items-center justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <path d="M8 16c0 4 1.333 6 4 6s4-2 4-6-1.333-6-4-6"></path>
                  <path d="M15 2c-1.5 0-3 .5-4 2-1-1.5-2.5-2-4-2s-4 1-4 4 2 5 4 6c2 1 4-1 4-3 0 2 2 4 4 3 2-1 4-3 4-6s-2.5-4-4-4z"></path>
                </svg>
              </div>
              <h4 className="font-semibold text-red-900">Alerte Incendie</h4>
              <p className="text-xs text-red-700 mt-1">Système d'évacuation</p>
            </button>
            
            <button
              onClick={() => triggerEmergencyAlert('security')}
              className="p-4 bg-amber-50 rounded-lg border-2 border-amber-200 hover:bg-amber-100 hover:border-amber-300 transition-colors text-center"
            >
              <div className="w-12 h-12 mx-auto bg-amber-500 text-white rounded-lg flex items-center justify-center mb-2">
                <Shield className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-amber-900">Alerte Sécurité</h4>
              <p className="text-xs text-amber-700 mt-1">Intervention immédiate</p>
            </button>
            
            <button
              onClick={() => triggerEmergencyAlert('medical')}
              className="p-4 bg-green-50 rounded-lg border-2 border-green-200 hover:bg-green-100 hover:border-green-300 transition-colors text-center"
            >
              <div className="w-12 h-12 mx-auto bg-green-500 text-white rounded-lg flex items-center justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <path d="M8 2h8l4 4-4 4H8l-4-4 4-4z"></path>
                  <path d="M12 12v10"></path>
                  <path d="M8 16h8"></path>
                </svg>
              </div>
              <h4 className="font-semibold text-green-900">Urgence Médicale</h4>
              <p className="text-xs text-green-700 mt-1">Premiers secours</p>
            </button>
            
            <button
              onClick={() => triggerEmergencyAlert('evacuation')}
              className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-colors text-center"
            >
              <div className="w-12 h-12 mx-auto bg-blue-500 text-white rounded-lg flex items-center justify-center mb-2">
                <Map className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-blue-900">Évacuation</h4>
              <p className="text-xs text-blue-700 mt-1">Sortie d'urgence</p>
            </button>
          </div>
          
          <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <h4 className="font-semibold text-red-900">Procédure d'urgence</h4>
            </div>
            <ol className="text-sm text-red-700 space-y-1 pl-6 list-decimal">
              <li>Évaluer la situation et la gravité</li>
              <li>Déclencher l'alerte appropriée</li>
              <li>Contacter les services d'urgence si nécessaire</li>
              <li>Suivre le protocole d'évacuation</li>
              <li>Rassembler les visiteurs au point de regroupement</li>
              <li>Faire l'appel avec la liste des visiteurs présents</li>
            </ol>
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Contacts d'Urgence</h3>
          
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-full">
                    <Phone className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Pompiers</h4>
                    <p className="text-sm text-gray-600">Urgence incendie</p>
                  </div>
                </div>
                <button className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm font-medium">
                  18
                </button>
              </div>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Phone className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Police</h4>
                    <p className="text-sm text-gray-600">Sécurité et protection</p>
                  </div>
                </div>
                <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-sm font-medium">
                  17
                </button>
              </div>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <Phone className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">SAMU</h4>
                    <p className="text-sm text-gray-600">Urgence médicale</p>
                  </div>
                </div>
                <button className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors text-sm font-medium">
                  15
                </button>
              </div>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-full">
                    <Phone className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Responsable Sécurité</h4>
                    <p className="text-sm text-gray-600">André MOUNGOUNGOU</p>
                  </div>
                </div>
                <button className="px-3 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors text-sm font-medium">
                  +241 77 12 34 56
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-3">Plan d'évacuation</h4>
            
            <div className="mb-4 bg-white p-3 rounded border border-blue-100 text-center">
              <div className="text-blue-700 mb-2">
                <Map className="h-8 w-8 mx-auto" />
              </div>
              <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm">
                Voir le plan
              </button>
            </div>
            
            <p className="text-sm text-blue-700">
              Points de rassemblement:
            </p>
            <ul className="text-sm text-blue-700 mt-1 space-y-1">
              <li>• Parking principal (Zone A)</li>
              <li>• Esplanade avant (Zone B)</li>
              <li>• Jardin arrière (Zone C)</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <RefreshCw className="h-5 w-5 text-green-600" />
            <div>
              <h4 className="font-medium text-gray-900">Statut Système d'Urgence</h4>
              <p className="text-sm text-gray-600">Dernière vérification: {new Date().toLocaleString('fr-FR')}</p>
            </div>
          </div>
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Opérationnel
          </span>
        </div>
      </div>
    </div>
  );
  
  // Navigation
  const navigationItems = [
    { id: 'register', label: 'Enregistrer', icon: UserCheck, color: 'text-blue-600' },
    { id: 'visitors', label: 'Visiteurs', icon: Users, color: 'text-purple-600' },
    { id: 'scanner', label: 'Scanner IA', icon: Camera, color: 'text-green-600' },
    { id: 'badges', label: 'Badges', icon: Tag, color: 'text-indigo-600' },
    { id: 'packages', label: 'Colis', icon: Package, color: 'text-orange-600' },
    { id: 'alerts', label: 'Urgences', icon: Bell, color: 'text-red-600' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Accueil Citoyen</h1>
            <p className="text-blue-200">Système d'enregistrement et suivi des visiteurs</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 flex items-center gap-3">
            <div className="text-center">
              <div className="text-2xl font-bold">{visitors.filter(v => v.status === 'active').length}</div>
              <div className="text-sm text-blue-200">Actuels</div>
            </div>
            <div className="h-8 border-r border-white/20"></div>
            <div className="text-center">
              <div className="text-2xl font-bold">{visitors.length}</div>
              <div className="text-sm text-blue-200">Total</div>
            </div>
            <div className="h-8 border-r border-white/20"></div>
            <div className="text-center">
              <div className="text-2xl font-bold">{activeBadges.length}</div>
              <div className="text-sm text-blue-200">Badges</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <div className="bg-white rounded-xl shadow-lg p-2">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {navigationItems.map(item => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as any)}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className={`h-6 w-6 ${isActive ? 'text-blue-600' : item.color}`} />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Success/Error Messages */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 max-w-md animate-fade-in">
          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
          <p>{successMessage}</p>
          <button 
            onClick={() => setShowSuccessMessage(false)}
            className="ml-auto text-green-600 hover:text-green-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      
      {errorMessage && (
        <div className="fixed top-4 right-4 z-50 bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 max-w-md animate-fade-in">
          <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
          <p>{errorMessage}</p>
          <button 
            onClick={() => setErrorMessage('')}
            className="ml-auto text-red-600 hover:text-red-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      
      {/* Main Content */}
      <div className="space-y-6">
        {activeSection === 'register' && renderRegisterForm()}
        {activeSection === 'visitors' && renderVisitorsList()}
        {activeSection === 'scanner' && renderScannerInterface()}
        {activeSection === 'badges' && renderBadgeManagement()}
        {activeSection === 'alerts' && renderEmergencyAlerts()}
        {activeSection === 'packages' && (
          <div className="bg-white rounded-xl shadow-lg p-6 text-center py-10">
            <Package className="h-12 w-12 text-orange-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Gestion des Colis</h2>
            <p className="text-gray-600 mb-6">Système de gestion des colis et courriers</p>
            <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors inline-flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nouveau Colis
            </button>
          </div>
        )}
      </div>
    </div>
  );
};