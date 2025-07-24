import React, { useState, useEffect, useRef } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  Plus, 
  User,
  Mail,
  Phone,
  Building2,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  Truck,
  Eye,
  Download,
  FileText,
  AlertTriangle,
  Camera,
  MoreVertical,
  Tag,
  Clipboard,
  Send,
  List,
  RefreshCw,
  Printer,
  Upload,
  ChevronDown,
  ChevronUp,
  Scale,
  Loader,
  BarChart2,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  X,
  Settings,
  Trash2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Package as PackageType, 
  PackageCreationData,
  PackageStatus,
  PackageType as PackageCategory,
  PackagePriority,
  PackageStats
} from '../../types/package';
import {
  generateTrackingNumber,
  calculateShippingCost,
  validatePackageData,
  createPackage,
  updatePackageStatus,
  calculatePackageStats,
  formatPackageReceipt,
  generatePackageQRCode,
  generateStatusChangeNotification
} from '../../utils/packageManager';

export const PackagesModule: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [selectedPackage, setSelectedPackage] = useState<any | null>(null);
  const [showAddPackageModal, setShowAddPackageModal] = useState(false);
  const [showPackageDetail, setShowPackageDetail] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [packageStats, setPackageStats] = useState<PackageStats>({
    total: 0,
    pending: 0,
    delivered: 0,
    returned: 0,
    canceled: 0,
    lost: 0,
    urgent: 0,
    todayReceived: 0,
    todayDelivered: 0
  });

  // Nouveau formulaire package
  const [newPackage, setNewPackage] = useState<PackageCreationData>({
    senderName: '',
    senderOrganization: '',
    senderContact: '',
    packageType: 'document',
    description: '',
    weight: undefined,
    recipientName: '', 
    recipientDepartment: '',
    recipientContact: '',
    priority: 'normal' as PackagePriority,
    needsSignature: false,
    notes: '',
    signatureRequired: false,
    isPrepaid: false
  });
  
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [formStep, setFormStep] = useState(1);
  const [packageImage, setPackageImage] = useState<string | null>(null);
  const [allPackages, setAllPackages] = useState<PackageType[]>([]);
  
  // Effet pour calculer les statistiques
  useEffect(() => {
    setPackageStats(calculatePackageStats(allPackages));
  }, [allPackages]);

  // Charger les données simulées au démarrage
  useEffect(() => {
    const initialPackages: PackageType[] = [
    {
      id: 'PKG-2024-001',
      trackingNumber: 'DGDI-PKG-20240605-123',
      packageType: 'document',
      description: 'Documents confidentiels',
      
      status: 'pending',
      priority: 'urgent',
      receivedDate: new Date('2024-06-05T09:15:00'),
      receivedTime: '09:15',
      
      senderName: 'DHL',
      senderOrganization: 'DHL Express',
      senderContact: '+241 77123456',
      
      recipientName: 'Jean NGUEMA',
      recipientDepartment: 'Service Documentation',
      recipientContact: '+241 65432198',
      
      receivedBy: 'Sylvie MBOUMBA',
      signatureRequired: true,
      
      shippingCost: 2500,
      isPrepaid: true,
      
      notes: 'Documents scellés - Ne pas ouvrir',
      lastUpdated: new Date('2024-06-05T09:15:00'),
      isDeleted: false,
      imageUrl: 'https://images.pexels.com/photos/5668772/pexels-photo-5668772.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      id: 'PKG-2024-002',
      trackingNumber: 'DGDI-PKG-20240604-456',
      packageType: 'envelope',
      description: 'Courrier diplomatique',
      
      status: 'delivered',
      priority: 'high',
      receivedDate: new Date('2024-06-04T14:30:00'),
      receivedTime: '14:30',
      deliveredDate: new Date('2024-06-04T15:20:00'),
      deliveryTime: '15:20',
      
      senderName: 'Ministère des Affaires Étrangères',
      senderOrganization: 'MAE',
      senderContact: '+241 01234567',
      
      recipientName: 'Marie AKUE',
      recipientDepartment: 'Direction Générale',
      recipientContact: '+241 76543210',
      
      receivedBy: 'Robert NDONG',
      deliveredBy: 'Sophie ELLA',
      signatureRequired: true,
      signatureImageUrl: 'signature-data-url',
      signedBy: 'Marie AKUE',
      
      shippingCost: 3000,
      isPrepaid: true,
      
      notes: 'Remis en main propre',
      lastUpdated: new Date('2024-06-04T15:20:00'),
      isDeleted: false,
      imageUrl: 'https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      id: 'PKG-2024-003',
      trackingNumber: 'DGDI-PKG-20240603-789',
      packageType: 'box',
      description: 'Fournitures administratives',
      weight: 3.5,
      
      status: 'pending',
      priority: 'normal',
      receivedDate: new Date('2024-06-03T11:00:00'),
      receivedTime: '11:00',
      
      senderName: 'Chronopost',
      senderOrganization: 'Chronopost Gabon',
      senderContact: '+241 07654321',
      
      recipientName: 'Paul OBIANG',
      recipientDepartment: 'Service Immigration',
      recipientContact: '+241 01234567',
      
      receivedBy: 'Sylvie MBOUMBA',
      signatureRequired: false,
      
      shippingCost: 7500,
      isPrepaid: false,
      
      notes: 'Stocké en salle de réception',
      lastUpdated: new Date('2024-06-03T11:00:00'),
      isDeleted: false,
      imageUrl: 'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=150'
    }
  ];
    setAllPackages(initialPackages);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'returned':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'canceled':
        return <XCircle className="h-4 w-4 text-orange-500" />;
      case 'lost':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'delivered':
        return 'Livré';
      case 'returned':
        return 'Retourné';
      case 'canceled':
        return 'Annulé';
      case 'lost':
        return 'Perdu';
      default:
        return 'Inconnu';
    }
  };

  const getPackageTypeIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText className="h-5 w-5 text-blue-600" />;
      case 'envelope':
        return <Mail className="h-5 w-5 text-purple-600" />;
      case 'box':
        return <Package className="h-5 w-5 text-orange-600" />;
      case 'parcel':
        return <Package className="h-5 w-5 text-purple-600" />;
      case 'fragile':
        return <Package className="h-5 w-5 text-red-600" />;
      case 'diplomatic':
        return <FileText className="h-5 w-5 text-blue-800" />;
      default:
        return <Package className="h-5 w-5 text-gray-600" />;
    }
  };

  const getPriorityBadge = (priority: PackagePriority) => {
    switch (priority) {
      case 'urgent':
        return (
          <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full font-medium">
            URGENT
          </span>
        );
      case 'high':
        return (
          <span className="bg-orange-100 text-orange-800 text-xs px-2 py-0.5 rounded-full font-medium">
            Prioritaire
          </span>
        );
      default:
        return null;
    }
  };

  const filteredPackages = allPackages.filter(pkg => {
    const matchesSearch = 
      pkg.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.senderName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || pkg.status === filterStatus;
    const matchesType = filterType === 'all' || pkg.packageType === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          setPackageImage(event.target.result as string);
        }
      };
      
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const validateForm = (step: number): boolean => {
    if (step === 1) {
      const { isValid, errors } = validatePackageData({
        ...newPackage,
        packageType: newPackage.packageType as PackageCategory
      });
      
      setValidationErrors(errors);
      return isValid;
    }
    
    return true;
  };

  const handleNextStep = () => {
    if (validateForm(formStep)) {
      setFormStep(formStep + 1);
    }
  };

  const handlePrevStep = () => {
    setFormStep(formStep - 1);
  };

  const handleAddPackage = async () => {
    setLoading(true);
    
    // Validation finale
    if (!validateForm(formStep)) {
      setLoading(false);
      return;
    }
    
    // Simuler un délai de traitement
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Créer le nouveau colis avec les données du formulaire
      if (!user) {
        throw new Error('Utilisateur non connecté');
      }
      
      const receivedBy = `${user.firstName} ${user.lastName}`;
      const newPackageData: PackageCreationData = {
        ...newPackage,
        packageType: newPackage.packageType as PackageCategory,
        signatureRequired: newPackage.signatureRequired
      };
      
      const createdPackage = createPackage(newPackageData, receivedBy);
      
      // Ajouter l'image si disponible
      if (packageImage) {
        createdPackage.imageUrl = packageImage;
      }
      
      // Ajouter à la liste des colis
      setAllPackages(prev => [createdPackage, ...prev]);
      
      // Notification de succès
      setLoading(false);
      setShowAddPackageModal(false);
      alert(`✅ Colis enregistré avec succès!\nNuméro de suivi: ${createdPackage.trackingNumber}`);
      
      // Réinitialiser le formulaire
      setNewPackage({
        senderName: '',
        senderOrganization: '',
        senderContact: '',
        packageType: 'document',
        description: '',
        weight: undefined,
        recipientName: '',
        recipientDepartment: '',
        recipientContact: '',
        priority: 'normal',
        signatureRequired: false,
        isPrepaid: false,
        notes: '',
      });
      setPackageImage(null);
      setFormStep(1);
    } catch (error) {
      setLoading(false);
      console.error('Erreur lors de l\'enregistrement du colis:', error);
      alert(`Une erreur est survenue: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  const openPackageDetail = (pkg: PackageType) => {
    setSelectedPackage(pkg);
    setShowPackageDetail(true);
  };

  const markAsDelivered = async (id: string) => {
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Trouver le colis
      const packageToUpdate = allPackages.find(p => p.id === id);
      if (!packageToUpdate) {
        throw new Error('Colis introuvable');
      }
      
      // Mettre à jour le statut
      if (!user) {
        throw new Error('Utilisateur non connecté');
      }
      
      const updatedBy = `${user.firstName} ${user.lastName}`;
      const oldStatus = packageToUpdate.status;
      
      // Générer une notification de changement de statut
      const notificationMessage = generateStatusChangeNotification(
        {...packageToUpdate, status: 'delivered'}, 
        oldStatus
      );
      
      // Mettre à jour le colis
      const updatedPackage = updatePackageStatus(
        packageToUpdate, 
        'delivered', 
        updatedBy, 
        'Colis livré au destinataire'
      );
      
      // Mettre à jour la liste des colis
      setAllPackages(prev => 
        prev.map(p => p.id === id ? updatedPackage : p)
      );
      
      // Afficher la notification
      console.log('Notification:', notificationMessage);
      
      setLoading(false);
      setShowPackageDetail(false);
      alert('✅ Colis marqué comme livré avec succès!');
    } catch (error) {
      setLoading(false);
      console.error('Erreur lors de la mise à jour du statut:', error);
      alert(`Une erreur est survenue: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  const returnPackage = async (id: string) => {
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Trouver le colis
      const packageToUpdate = allPackages.find(p => p.id === id);
      if (!packageToUpdate) {
        throw new Error('Colis introuvable');
      }
      
      // Mettre à jour le statut
      if (!user) {
        throw new Error('Utilisateur non connecté');
      }
      
      const updatedBy = `${user.firstName} ${user.lastName}`;
      const oldStatus = packageToUpdate.status;
      
      // Générer une notification de changement de statut
      const notificationMessage = generateStatusChangeNotification(
        {...packageToUpdate, status: 'returned'}, 
        oldStatus
      );
      
      // Mettre à jour le colis
      const updatedPackage = updatePackageStatus(
        packageToUpdate, 
        'returned', 
        updatedBy, 
        'Colis retourné à l\'expéditeur'
      );
      
      // Mettre à jour la liste des colis
      setAllPackages(prev => 
        prev.map(p => p.id === id ? updatedPackage : p)
      );
      
      // Afficher la notification
      console.log('Notification:', notificationMessage);
      
      setLoading(false);
      setShowPackageDetail(false);
      alert('✅ Colis marqué comme retourné!');
    } catch (error) {
      setLoading(false);
      console.error('Erreur lors du retour du colis:', error);
      alert(`Une erreur est survenue: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };
  
  const markAsLost = async (id: string) => {
    try {
      if (window.confirm('Êtes-vous sûr de vouloir signaler ce colis comme perdu ?')) {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (!user) {
          throw new Error('Utilisateur non connecté');
        }
        
        const packageToUpdate = allPackages.find(p => p.id === id);
        if (!packageToUpdate) {
          throw new Error('Colis introuvable');
        }
        
        const updatedBy = `${user.firstName} ${user.lastName}`;
        const updatedPackage = updatePackageStatus(
          packageToUpdate, 
          'lost', 
          updatedBy, 
          'Colis signalé comme perdu'
        );
        
        setAllPackages(prev => 
          prev.map(p => p.id === id ? updatedPackage : p)
        );
        
        setShowPackageDetail(false);
        alert('⚠️ Colis signalé comme perdu');
      }
    } catch (error) {
      console.error('Erreur lors du signalement de perte:', error);
      alert(`Une erreur est survenue: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };
  
  const deletePackageLogically = async (id: string) => {
    try {
      if (window.confirm('Êtes-vous sûr de vouloir supprimer ce colis ? Cette action ne peut pas être annulée.')) {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Suppression logique (changement de l'attribut isDeleted)
        setAllPackages(prev => 
          prev.map(p => p.id === id ? {...p, isDeleted: true} : p)
        );
        
        setShowPackageDetail(false);
        alert('✅ Colis supprimé avec succès');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert(`Une erreur est survenue: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };
  
  const exportToCSV = () => {
    const headers = [
      'Numéro de suivi',
      'Type',
      'Description',
      'Date de réception',
      'Statut',
      'Expéditeur',
      'Destinataire',
      'Service',
      'Priorité'
    ].join(',');
    
    const rows = allPackages
      .filter(pkg => !pkg.isDeleted)
      .map(pkg => [
        pkg.trackingNumber,
        pkg.packageType,
        `"${pkg.description.replace(/"/g, '""')}"`,
        new Date(pkg.receivedDate).toLocaleDateString('fr-FR'),
        getStatusText(pkg.status),
        `"${pkg.senderName.replace(/"/g, '""')}"`,
        `"${pkg.recipientName.replace(/"/g, '""')}"`,
        `"${pkg.recipientDepartment.replace(/"/g, '""')}"`,
        pkg.priority
      ].join(','));
    
    const csvContent = `${headers}\n${rows.join('\n')}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `colis-dgdi-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const packageTypes = [
    { id: 'document', label: 'Document' },
    { id: 'envelope', label: 'Enveloppe' },
    { id: 'box', label: 'Colis standard' },
    { id: 'parcel', label: 'Colis volumineux' },
    { id: 'fragile', label: 'Colis fragile' },
    { id: 'diplomatic', label: 'Document diplomatique' }
  ];

  const statuses = [
    { id: 'pending', label: 'En attente' },
    { id: 'delivered', label: 'Livré' },
    { id: 'returned', label: 'Retourné' },
    { id: 'canceled', label: 'Annulé' },
    { id: 'lost', label: 'Perdu' }
  ];

  const departments = [
    'Service Documentation',
    'Service Immigration',
    'Direction Générale',
    'Service Administratif',
    'Service Informatique'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Colis</h1>
          <p className="text-gray-600">Suivi des colis et courriers reçus</p>
        </div>
        <button 
          onClick={() => setShowAddPackageModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Nouveau colis
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En attente</p>
              <p className="text-2xl font-bold text-yellow-600">{packageStats.pending}</p>
            </div>
            <div className="bg-yellow-100 rounded-lg p-3">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Livrés</p>
              <p className="text-2xl font-bold text-green-600">{packageStats.delivered}</p>
            </div>
            <div className="bg-green-100 rounded-lg p-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Urgents</p>
              <p className="text-2xl font-bold text-red-600">{packageStats.urgent}</p>
            </div>
            <div className="bg-red-100 rounded-lg p-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Aujourd'hui</p>
              <p className="text-2xl font-bold text-purple-600">{packageStats.todayReceived}</p>
            </div>
            <div className="bg-purple-100 rounded-lg p-3">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-blue-600">{packageStats.total}</p>
            </div>
            <div className="bg-blue-100 rounded-lg p-3">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par description, destinataire ou numéro de suivi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="delivered">Livrés</option>
              <option value="returned">Retournés</option>
            </select>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous les types</option>
              <option value="document">Documents</option>
              <option value="envelope">Enveloppes</option>
              <option value="box">Colis</option>
            </select>
            
            <button 
              onClick={exportToCSV}
              className="whitespace-nowrap px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Exporter CSV
            </button>
          </div>
        </div>
      </div>

      {/* Packages List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Colis
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Destinataire
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reçu le
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expéditeur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPackages.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-10 h-10 overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center">
                        {pkg.imageUrl ? (
                          <img src={pkg.imageUrl} alt={pkg.description} className="w-10 h-10 object-cover" />
                        ) : (
                          getPackageTypeIcon(pkg.packageType)
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate flex items-center gap-1">
                          {pkg.description}
                          {getPriorityBadge(pkg.priority)}
                        </p>
                        <p className="text-xs text-gray-500">{pkg.trackingNumber}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{pkg.recipientName}</div>
                    <div className="text-xs text-gray-500">{pkg.recipientDepartment}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{new Date(pkg.receivedDate).toLocaleDateString('fr-FR')}</div>
                    <div className="text-xs text-gray-500">{pkg.receivedTime}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{pkg.senderName}</div>
                    <div className="text-xs text-gray-500">{pkg.senderOrganization || ''}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(pkg.status)}
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${
                        pkg.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        pkg.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        pkg.status === 'returned' ? 'bg-red-100 text-red-800' :
                        pkg.status === 'canceled' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {getStatusText(pkg.status)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => openPackageDetail(pkg)}
                        className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      
                      {pkg.status === 'pending' && (
                        <button 
                          onClick={() => markAsDelivered(pkg.id)}
                          className="text-green-600 hover:text-green-700 p-2 rounded-lg hover:bg-green-50"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                      
                      <button 
                        onClick={() => openPackageDetail(pkg)}
                        className="text-gray-600 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-50"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ajouter Colis Modal */}
      {showAddPackageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-auto max-h-[90vh]">
            <div className="p-4 md:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Enregistrer un nouveau colis</h3>
                <button 
                  onClick={() => setShowAddPackageModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-4 md:p-6 space-y-4">
              {/* Indicateur d'étape */}
              <div className="flex items-center justify-center space-x-2 mb-4">
                {[1, 2, 3].map((step) => (
                  <div 
                    key={step} 
                    className={`w-3 h-3 rounded-full ${
                      formStep === step 
                        ? 'bg-blue-600' 
                        : formStep > step 
                        ? 'bg-green-500' 
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              
              {/* Étape 1: Informations de base */}
              {formStep === 1 && (
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <Package className="h-5 w-5 text-blue-600" />
                    Informations de base
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type de colis *
                      </label>
                      <select
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          validationErrors.packageType ? 'border-red-500' : 'border-gray-300'
                        }`}
                        value={newPackage.packageType}
                        onChange={(e) => setNewPackage({...newPackage, packageType: e.target.value as PackageCategory})}
                      >
                        {packageTypes.map(type => (
                          <option key={type.id} value={type.id}>{type.label}</option>
                        ))}
                      </select>
                      {validationErrors.packageType && (
                        <p className="mt-1 text-xs text-red-600">{validationErrors.packageType}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Priorité *
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="priority"
                            value="normal"
                            checked={newPackage.priority === 'normal'}
                            onChange={() => setNewPackage({...newPackage, priority: 'normal'})}
                            className="rounded-full border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                          />
                          <span className="text-sm text-gray-700">Normal</span>
                        </label>
                        
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="priority"
                            value="high"
                            checked={newPackage.priority === 'high'}
                            onChange={() => setNewPackage({...newPackage, priority: 'high'})}
                            className="rounded-full border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                          />
                          <span className="text-sm text-gray-700">Prioritaire</span>
                        </label>
                        
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="priority"
                            value="urgent"
                            checked={newPackage.priority === 'urgent'}
                            onChange={() => setNewPackage({...newPackage, priority: 'urgent'})}
                            className="rounded-full border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                          />
                          <span className="text-sm text-gray-700">Urgent</span>
                        </label>
                      </div>
                      {validationErrors.priority && (
                        <p className="mt-1 text-xs text-red-600">{validationErrors.priority}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        validationErrors.description ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Description détaillée du contenu"
                      rows={2}
                      value={newPackage.description}
                      onChange={(e) => setNewPackage({...newPackage, description: e.target.value})}
                    />
                    {validationErrors.description && (
                      <p className="mt-1 text-xs text-red-600">{validationErrors.description}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Poids (kg) {['box', 'parcel', 'fragile'].includes(newPackage.packageType) && '*'}
                    </label>
                    <div className="flex items-center">
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          validationErrors.weight ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Poids en kilogrammes"
                        value={newPackage.weight || ''}
                        onChange={(e) => setNewPackage({
                          ...newPackage, 
                          weight: e.target.value ? parseFloat(e.target.value) : undefined
                        })}
                      />
                      <Scale className="h-5 w-5 text-gray-400 ml-2" />
                    </div>
                    {validationErrors.weight && (
                      <p className="mt-1 text-xs text-red-600">{validationErrors.weight}</p>
                    )}
                    {['box', 'parcel', 'fragile'].includes(newPackage.packageType) && 
                      !validationErrors.weight && 
                      newPackage.weight && (
                        <div className="mt-2 text-xs">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Frais d'expédition estimés:</span>
                            <span className="font-medium text-green-600">
                              {calculateShippingCost(
                                newPackage.weight, 
                                newPackage.packageType as PackageCategory, 
                                newPackage.priority
                              ).toLocaleString('fr-FR')} CFA
                            </span>
                          </div>
                        </div>
                      )
                    }
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image du colis (optionnel)
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                      <div className="space-y-1 text-center">
                        {packageImage ? (
                          <div className="relative">
                            <img 
                              src={packageImage} 
                              alt="Aperçu du colis" 
                              className="mx-auto h-32 w-auto rounded-lg" 
                            />
                            <button
                              onClick={() => setPackageImage(null)}
                              className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 transform translate-x-1/2 -translate-y-1/2"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <svg
                              className="mx-auto h-12 w-12 text-gray-400"
                              stroke="currentColor"
                              fill="none"
                              viewBox="0 0 48 48"
                            >
                              <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <div className="flex text-sm text-gray-600">
                              <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                              >
                                <span>Télécharger une image</span>
                                <input
                                  id="file-upload"
                                  name="file-upload"
                                  type="file"
                                  className="sr-only"
                                  accept="image/*"
                                  ref={fileInputRef}
                                  onChange={handleImageUpload}
                                />
                              </label>
                              <p className="pl-1">ou glisser-déposer</p>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG jusqu'à 5MB</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Étape 2: Informations expéditeur/destinataire */}
              {formStep === 2 && (
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600" />
                    Expéditeur et Destinataire
                  </h4>
                  
                  <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 mb-4">
                    <h5 className="font-medium text-blue-800 mb-1">Informations Expéditeur</h5>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nom de l'expéditeur *
                        </label>
                        <input
                          type="text"
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                            validationErrors.senderName ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Nom de l'expéditeur"
                          value={newPackage.senderName}
                          onChange={(e) => setNewPackage({...newPackage, senderName: e.target.value})}
                        />
                        {validationErrors.senderName && (
                          <p className="mt-1 text-xs text-red-600">{validationErrors.senderName}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Organisation (optionnel)
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Entreprise / Organisation"
                          value={newPackage.senderOrganization || ''}
                          onChange={(e) => setNewPackage({...newPackage, senderOrganization: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact expéditeur {newPackage.senderOrganization ? '*' : '(optionnel)'}
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                            validationErrors.senderContact ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Téléphone ou email"
                          value={newPackage.senderContact || ''}
                          onChange={(e) => setNewPackage({...newPackage, senderContact: e.target.value})}
                        />
                        <Phone className="h-5 w-5 text-gray-400 ml-2" />
                      </div>
                      {validationErrors.senderContact && (
                        <p className="mt-1 text-xs text-red-600">{validationErrors.senderContact}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="border-l-4 border-green-500 pl-4 py-2 bg-green-50">
                    <h5 className="font-medium text-green-800 mb-1">Informations Destinataire</h5>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nom du destinataire *
                        </label>
                        <input
                          type="text"
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                            validationErrors.recipientName ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Nom du destinataire"
                          value={newPackage.recipientName}
                          onChange={(e) => setNewPackage({...newPackage, recipientName: e.target.value})}
                        />
                        {validationErrors.recipientName && (
                          <p className="mt-1 text-xs text-red-600">{validationErrors.recipientName}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Service destinataire *
                        </label>
                        <select
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                            validationErrors.recipientDepartment ? 'border-red-500' : 'border-gray-300'
                          }`}
                          value={newPackage.recipientDepartment}
                          onChange={(e) => setNewPackage({...newPackage, recipientDepartment: e.target.value})}
                        >
                          <option value="">Sélectionner un service</option>
                          {departments.map((dept, index) => (
                            <option key={index} value={dept}>{dept}</option>
                          ))}
                        </select>
                        {validationErrors.recipientDepartment && (
                          <p className="mt-1 text-xs text-red-600">{validationErrors.recipientDepartment}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact destinataire (optionnel)
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Téléphone ou email"
                          value={newPackage.recipientContact || ''}
                          onChange={(e) => setNewPackage({...newPackage, recipientContact: e.target.value})}
                        />
                        <Phone className="h-5 w-5 text-gray-400 ml-2" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Étape 3: Options et confirmation */}
              {formStep === 3 && (
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <Settings className="h-5 w-5 text-blue-600" />
                    Options et Confirmation
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Options de traitement
                      </label>
                      
                      <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={newPackage.signatureRequired}
                            onChange={(e) => setNewPackage({...newPackage, signatureRequired: e.target.checked})}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                          />
                          <span className="text-sm text-gray-700">Signature requise à la livraison</span>
                        </label>
                        
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={newPackage.isPrepaid}
                            onChange={(e) => setNewPackage({...newPackage, isPrepaid: e.target.checked})}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                          />
                          <span className="text-sm text-gray-700">Frais prépayés</span>
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notes et instructions
                      </label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                        placeholder="Instructions spéciales ou remarques"
                        rows={4}
                        value={newPackage.notes}
                        onChange={(e) => setNewPackage({...newPackage, notes: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg mt-4">
                    <h5 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Récapitulatif du colis
                    </h5>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="flex items-start gap-2">
                        <div className="w-24 text-sm font-medium text-gray-700">Type:</div>
                        <div className="text-sm text-gray-900">{
                          packageTypes.find(t => t.id === newPackage.packageType)?.label || newPackage.packageType
                        }</div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <div className="w-24 text-sm font-medium text-gray-700">Priorité:</div>
                        <div className="text-sm text-gray-900 capitalize">{newPackage.priority}</div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <div className="w-24 text-sm font-medium text-gray-700">Expéditeur:</div>
                        <div className="text-sm text-gray-900">{newPackage.senderName}</div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <div className="w-24 text-sm font-medium text-gray-700">Destinataire:</div>
                        <div className="text-sm text-gray-900">{newPackage.recipientName}</div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <div className="w-24 text-sm font-medium text-gray-700">Service:</div>
                        <div className="text-sm text-gray-900">{newPackage.recipientDepartment}</div>
                      </div>
                      
                      {newPackage.weight && (
                        <div className="flex items-start gap-2">
                          <div className="w-24 text-sm font-medium text-gray-700">Frais:</div>
                          <div className="text-sm text-green-700 font-medium">
                            {calculateShippingCost(
                              newPackage.weight, 
                              newPackage.packageType as PackageCategory, 
                              newPackage.priority
                            ).toLocaleString('fr-FR')} CFA
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 text-sm text-yellow-800">
                    <div className="flex">
                      <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500 flex-shrink-0" />
                      <p>
                        Une fois le colis enregistré, un numéro de suivi unique sera automatiquement généré. Les frais d'expédition seront calculés en fonction du poids, du type de colis et de la priorité choisie.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Navigation entre les étapes */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                {formStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    disabled={loading}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Précédent
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowAddPackageModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    disabled={loading}
                  >
                    Annuler
                  </button>
                )}
                
                {formStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                  >
                    Suivant
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleAddPackage}
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                    Enregistrer le colis
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Package Detail Modal */}
      {showPackageDetail && selectedPackage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className={`p-4 md:p-6 border-b border-gray-200 ${
              selectedPackage.priority === 'urgent' ? 'bg-red-600' : 
              selectedPackage.priority === 'high' ? 'bg-orange-600' : 
              'bg-blue-600'
            } text-white`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                    {getPackageTypeIcon(selectedPackage.packageType)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{selectedPackage.trackingNumber}</h3>
                      {selectedPackage.priority === 'urgent' && (
                        <span className="bg-red-800 text-white px-2 py-1 rounded-full text-xs font-medium">
                          URGENT
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-white/80">{selectedPackage.description}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowPackageDetail(false)}
                  className="p-2 text-white/80 hover:text-white rounded-lg"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-4 md:p-6 space-y-4">
              {/* Détails du colis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-600" />
                    Informations générales
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Expéditeur:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedPackage.senderName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Numéro de suivi:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedPackage.trackingNumber}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Date de réception:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(selectedPackage.receivedDate).toLocaleDateString('fr-FR')} ({selectedPackage.receivedTime})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Frais d'expédition:</span>
                      <span className="text-sm font-medium text-green-700">
                        {selectedPackage.shippingCost?.toLocaleString('fr-FR')} CFA 
                        ({selectedPackage.isPrepaid ? 'Prépayé' : 'À payer'})
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-600" />
                    Destinataire
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Nom:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedPackage.recipientName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Service:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedPackage.recipientDepartment}</span>
                    </div>
                    {selectedPackage.recipientContact && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Contact:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedPackage.recipientContact}</span>
                      </div>
                    )}
                    {selectedPackage.status === 'delivered' && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-600">Livré le:</span>
                        <span className="text-sm font-medium text-green-600">
                          {selectedPackage.deliveredDate && 
                            `${new Date(selectedPackage.deliveredDate).toLocaleDateString('fr-FR')} ${selectedPackage.deliveryTime || ''}`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Image et notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                <div>
                  {selectedPackage.imageUrl ? (
                    <div className="rounded-xl overflow-hidden border border-gray-200">
                      <img 
                        src={selectedPackage.imageUrl} 
                        alt={selectedPackage.description} 
                        className="w-full h-40 object-cover"
                      />
                    </div>
                  ) : (
                    <div className="rounded-xl overflow-hidden border border-gray-200 h-40 flex items-center justify-center bg-gray-100">
                      <Camera className="h-12 w-12 text-gray-300" />
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200 min-h-20">
                      {selectedPackage.notes || "Aucune note particulière"}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Exigences</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPackage.signatureRequired && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                          Signature requise
                        </span>
                      )}
                      {selectedPackage.priority === 'urgent' && (
                        <span className="bg-red-100 text-red-800 text-xs px-3 py-1 rounded-full">
                          Traitement urgent
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex-1 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    Dernière mise à jour: {new Date(selectedPackage.lastUpdated).toLocaleString('fr-FR')}
                  </span>
                </div>
              
                <div className="flex items-center gap-2">
                  {selectedPackage.status === 'pending' ? (
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => markAsDelivered(selectedPackage.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Marquer comme livré
                    </button>
                    <button 
                      onClick={() => returnPackage(selectedPackage.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <XCircle className="h-4 w-4" />
                      Retourner
                    </button>
                  </div>
                  ) : (
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                    selectedPackage.status === 'delivered' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedPackage.status === 'delivered' && selectedPackage.deliveredDate
                      ? `Livré le ${new Date(selectedPackage.deliveredDate).toLocaleDateString('fr-FR')}` 
                      : selectedPackage.status === 'returned'
                      ? 'Retourné à l\'expéditeur'
                      : selectedPackage.status === 'canceled'
                      ? 'Colis annulé'
                      : 'Colis perdu'}
                  </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between border-t border-gray-200 pt-4 mt-4">
                <div className="flex gap-2">
                  {selectedPackage.status === 'pending' && (
                    <button 
                      onClick={() => markAsLost(selectedPackage.id)}
                      className="px-3 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
                    >
                      <AlertTriangle className="h-4 w-4" />
                      Signaler perdu
                    </button>
                  )}
                  
                  <button 
                    onClick={() => deletePackageLogically(selectedPackage.id)}
                    className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                    Supprimer
                  </button>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                    onClick={() => {
                      const receipt = formatPackageReceipt(selectedPackage);
                      console.log(receipt);
                      alert("Récépissé généré et prêt à imprimer");
                    }}
                  >
                    <Printer className="h-4 w-4" />
                    Imprimer
                  </button>
                  
                  <button 
                    onClick={() => setShowPackageDetail(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actions rapides - quick access bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <button 
            onClick={() => setShowAddPackageModal(true)}
            className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-xl border border-blue-100 hover:bg-blue-100 transition-all hover:scale-105 min-h-[120px]"
          >
            <div className="bg-blue-600 text-white p-3 rounded-lg mb-3">
              <Plus className="h-6 w-6" />
            </div>
            <span className="font-medium text-blue-800">Nouveau Colis</span>
            <span className="text-xs text-blue-600 mt-1">Enregistrer une réception</span>
          </button>
          
          <button 
            onClick={() => alert("Scan de code-barres en cours de développement...")}
            className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-xl border border-green-100 hover:bg-green-100 transition-all hover:scale-105 min-h-[120px]"
          >
            <div className="bg-gray-400 text-white p-3 rounded-lg mb-3">
              <Camera className="h-6 w-6" />
            </div>
            <span className="font-medium text-gray-500">Scanner</span>
            <span className="text-xs text-gray-400 mt-1">Fonction en développement</span>
          </button>
          
          <button 
            onClick={() => alert("Notification en cours d'envoi...")}
            className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-xl border border-purple-100 hover:bg-purple-100 transition-all hover:scale-105 min-h-[120px]"
          >
            <div className="bg-purple-600 text-white p-3 rounded-lg mb-3">
              <Send className="h-6 w-6" />
            </div>
            <span className="font-medium text-purple-800">Notifier</span>
            <span className="text-xs text-purple-600 mt-1">Alerter les destinataires</span>
          </button>
          
          <button 
            onClick={exportToCSV}
            className="flex flex-col items-center justify-center p-4 bg-orange-50 rounded-xl border border-orange-100 hover:bg-orange-100 transition-all hover:scale-105 min-h-[120px]"
          >
            <div className="bg-orange-600 text-white p-3 rounded-lg mb-3">
              <Download className="h-6 w-6" />
            </div>
            <span className="font-medium text-orange-800">Rapport</span>
            <span className="text-xs text-orange-600 mt-1">Générer un rapport</span>
          </button>
        </div>
      </div>

      {/* Recent Packages */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Colis récents</h3>
          <button 
            onClick={() => window.location.reload()}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-lg"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
        
        <div className="space-y-3">
          {filteredPackages.slice(0, 3).map((pkg) => (
            <div 
              key={pkg.id} 
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
              onClick={() => openPackageDetail(pkg)}
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden">
                  {pkg.imageUrl ? (
                    <img src={pkg.imageUrl} alt={pkg.description} className="w-10 h-10 object-cover" />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 flex items-center justify-center">
                      {getPackageTypeIcon(pkg.packageType)}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">{pkg.description}</p>
                  <p className="text-gray-500 text-xs">Pour: {pkg.recipientName}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  pkg.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  pkg.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {getStatusText(pkg.status)}
                </div>
                <div className="text-xs text-gray-500">{new Date(pkg.receivedDate).toLocaleDateString('fr-FR')}</div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-200 text-center">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1 mx-auto"
          >
            <List className="h-4 w-4" />
            Voir tous les colis
          </button>
        </div>
      </div>
    </div>
  );
};