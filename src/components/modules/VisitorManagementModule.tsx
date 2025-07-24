import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  UserPlus,
  Download,
  FileSpreadsheet,
  FileText,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  AlignLeft,
  Printer,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Eye,
  Edit,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { appointmentsData, getAppointmentStats } from '../../data/appointmentsData';
import { VisitorsList } from '../visitor/VisitorsList';
import { VisitorDetail } from '../visitor/VisitorDetail';
import { VisitorRegistrationForm } from '../visitor/VisitorRegistrationForm';
import { VisitPlanningTab } from '../visitor/VisitPlanningTab';
import { VisitorFilter } from '../visitor/VisitorFilter';
import { VisitorExport } from '../visitor/VisitorExport';
import { ConfirmDialog } from '../staff/ConfirmDialog';

interface Visitor {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
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
  idType: string;
  idNumber: string;
  notes?: string;
  photo?: string;
}

export const VisitorManagementModule: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'visitors' | 'register' | 'planning' | 'history'>('visitors');
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [visitorHistory, setVisitorHistory] = useState<Visitor[]>([]);
  const [filteredVisitors, setFilteredVisitors] = useState<Visitor[]>([]);
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterOptions, setFilterOptions] = useState({
    searchTerm: '',
    status: 'all',
    dateRange: 'all',
    department: 'all'
  });
  const [showStats, setShowStats] = useState(true);
  
  // Charger les données des visiteurs (simulation)
  useEffect(() => {
    // Simuler une requête API
    const timer = setTimeout(() => {
      const mockVisitors: Visitor[] = [
        {
          id: 'v-001',
          fullName: 'Marie OBAME',
          firstName: 'Marie',
          lastName: 'OBAME',
          badgeNumber: 'DGI-20240610-001',
          checkInTime: '2024-06-10T09:15:00',
          company: 'N/A',
          phone: '+241 01 23 45 67',
          email: 'marie.obame@example.com',
          purposeOfVisit: 'Première demande CNI',
          serviceRequested: 'Documentation',
          employeeToVisit: 'Jean NGUEMA',
          department: 'Documentation',
          expectedDuration: '30',
          status: 'present',
          idType: 'CNI',
          idNumber: '12345678',
          photo: 'https://randomuser.me/api/portraits/women/1.jpg'
        },
        {
          id: 'v-002',
          fullName: 'Pierre NZAMBA',
          firstName: 'Pierre',
          lastName: 'NZAMBA',
          badgeNumber: 'DGI-20240610-002',
          checkInTime: '2024-06-10T10:30:00',
          company: 'SEEG',
          phone: '+241 02 34 56 78',
          email: 'pierre.nzamba@seeg.ga',
          purposeOfVisit: 'Demande d\'autorisation',
          serviceRequested: 'Immigration',
          employeeToVisit: 'Paul MBENG',
          department: 'Immigration',
          expectedDuration: '45',
          status: 'present',
          idType: 'passeport',
          idNumber: 'GA123456',
          photo: 'https://randomuser.me/api/portraits/men/1.jpg'
        },
        {
          id: 'v-003',
          fullName: 'Sophie ELLA',
          firstName: 'Sophie',
          lastName: 'ELLA',
          badgeNumber: 'DGI-20240610-003',
          checkInTime: '2024-06-10T11:00:00',
          checkOutTime: '2024-06-10T12:30:00',
          company: 'N/A',
          phone: '+241 03 45 67 89',
          email: 'sophie.ella@example.com',
          purposeOfVisit: 'Demande visa affaires',
          serviceRequested: 'Immigration',
          employeeToVisit: 'Paul MBENG',
          department: 'Immigration',
          expectedDuration: '60',
          status: 'completed',
          appointmentId: 'RDV-2024-003',
          idType: 'CNI',
          idNumber: '87654321',
          photo: 'https://randomuser.me/api/portraits/women/2.jpg'
        },
        {
          id: 'v-004',
          fullName: 'André MABIKA',
          firstName: 'André',
          lastName: 'MABIKA',
          badgeNumber: 'DGI-20240610-004',
          checkInTime: '2024-06-10T14:00:00',
          company: 'Banque Gabonaise',
          phone: '+241 04 56 78 90',
          email: 'andre.mabika@bgfi.ga',
          purposeOfVisit: 'Renouvellement passeport',
          serviceRequested: 'Passeports',
          employeeToVisit: 'Marie AKUE',
          department: 'Documentation',
          expectedDuration: '45',
          status: 'present',
          idType: 'passeport',
          idNumber: 'GA654321',
          photo: 'https://randomuser.me/api/portraits/men/2.jpg'
        },
        {
          id: 'v-005',
          fullName: 'Jeanne NTSAME',
          firstName: 'Jeanne',
          lastName: 'NTSAME',
          badgeNumber: 'DGI-20240610-005',
          checkInTime: '2024-06-10T09:45:00',
          checkOutTime: '2024-06-10T10:15:00',
          company: 'Ministère de l\'Éducation',
          phone: '+241 05 67 89 01',
          email: 'jeanne.ntsame@education.gouv.ga',
          purposeOfVisit: 'Dépôt dossier administratif',
          serviceRequested: 'Administration',
          employeeToVisit: 'Claire MOUELE',
          department: 'Administration',
          expectedDuration: '30',
          status: 'completed',
          idType: 'CNI',
          idNumber: '23456789',
          photo: 'https://randomuser.me/api/portraits/women/3.jpg'
        }
      ];
      
      const mockHistory: Visitor[] = [
        {
          id: 'v-101',
          fullName: 'Thomas NDONG',
          firstName: 'Thomas',
          lastName: 'NDONG',
          badgeNumber: 'DGI-20240609-001',
          checkInTime: '2024-06-09T10:00:00',
          checkOutTime: '2024-06-09T11:30:00',
          company: 'N/A',
          phone: '+241 06 78 90 12',
          email: 'thomas.ndong@example.com',
          purposeOfVisit: 'Demande de passeport',
          serviceRequested: 'Passeports',
          employeeToVisit: 'Marie AKUE',
          department: 'Documentation',
          expectedDuration: '90',
          status: 'completed',
          idType: 'CNI',
          idNumber: '34567890',
          photo: 'https://randomuser.me/api/portraits/men/3.jpg'
        },
        {
          id: 'v-102',
          fullName: 'Catherine MOUSSAVOU',
          firstName: 'Catherine',
          lastName: 'MOUSSAVOU',
          badgeNumber: 'DGI-20240609-002',
          checkInTime: '2024-06-09T11:15:00',
          checkOutTime: '2024-06-09T12:00:00',
          company: 'SOBRAGA',
          phone: '+241 07 89 01 23',
          email: 'catherine.moussavou@sobraga.ga',
          purposeOfVisit: 'Attestation fiscale',
          serviceRequested: 'Administration',
          employeeToVisit: 'Claire MOUELE',
          department: 'Administration',
          expectedDuration: '45',
          status: 'completed',
          idType: 'passeport',
          idNumber: 'GA987654',
          photo: 'https://randomuser.me/api/portraits/women/4.jpg'
        },
        {
          id: 'v-103',
          fullName: 'Pascal OYONO',
          firstName: 'Pascal',
          lastName: 'OYONO',
          badgeNumber: 'DGI-20240608-001',
          checkInTime: '2024-06-08T09:30:00',
          checkOutTime: '2024-06-08T10:45:00',
          company: 'N/A',
          phone: '+241 08 90 12 34',
          email: 'pascal.oyono@example.com',
          purposeOfVisit: 'Demande d\'extrait d\'acte de naissance',
          serviceRequested: 'Documentation',
          employeeToVisit: 'Jean NGUEMA',
          department: 'Documentation',
          expectedDuration: '60',
          status: 'completed',
          idType: 'CNI',
          idNumber: '45678901',
          photo: 'https://randomuser.me/api/portraits/men/4.jpg'
        }
      ];
      
      setVisitors(mockVisitors);
      setVisitorHistory(mockHistory);
      setFilteredVisitors(mockVisitors);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Appliquer les filtres aux visiteurs
  useEffect(() => {
    let result = visitors;
    
    // Filtre par recherche
    if (filterOptions.searchTerm) {
      const search = filterOptions.searchTerm.toLowerCase();
      result = result.filter(visitor => 
        visitor.fullName.toLowerCase().includes(search) ||
        visitor.badgeNumber.toLowerCase().includes(search) ||
        visitor.company?.toLowerCase().includes(search) ||
        visitor.purposeOfVisit.toLowerCase().includes(search) ||
        visitor.serviceRequested.toLowerCase().includes(search) ||
        visitor.employeeToVisit.toLowerCase().includes(search)
      );
    }
    
    // Filtre par statut
    if (filterOptions.status !== 'all') {
      result = result.filter(visitor => visitor.status === filterOptions.status);
    }
    
    // Filtre par département
    if (filterOptions.department !== 'all') {
      result = result.filter(visitor => visitor.department === filterOptions.department);
    }
    
    // Filtre par plage de dates (à implémenter si nécessaire)
    
    setFilteredVisitors(result);
  }, [visitors, filterOptions]);
  
  // Gestionnaire pour l'enregistrement de nouveaux visiteurs
  const handleRegisterVisitor = (data: any) => {
    // Créer un nouvel ID unique
    const newId = `v-${Date.now().toString().slice(-6)}`;
    
    // Créer un nouveau numéro de badge
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const badgeCount = visitors.length + 1;
    const badgeNumber = `SOGARA-${today}-${badgeCount.toString().padStart(3, '0')}`;
    
    // Créer le nouvel objet visiteur
    const newVisitor: Visitor = {
      id: newId,
      fullName: `${data.firstName} ${data.lastName}`,
      firstName: data.firstName,
      lastName: data.lastName,
      badgeNumber: badgeNumber,
      checkInTime: new Date().toISOString(),
      company: data.company,
      phone: data.phone,
      email: data.email,
      purposeOfVisit: data.purposeOfVisit,
      serviceRequested: data.serviceRequested,
      employeeToVisit: data.employeeToVisit,
      department: data.department,
      expectedDuration: data.expectedDuration,
      status: 'present',
      appointmentId: data.appointmentId,
      idType: data.idType,
      idNumber: data.idNumber,
      notes: data.notes
    };
    
    // Ajouter le visiteur à la liste
    setVisitors(prev => [newVisitor, ...prev]);
    
    // Afficher un message de confirmation
    alert(`Visiteur ${newVisitor.fullName} enregistré avec succès.\nBadge: ${badgeNumber}`);
    
    // Rediriger vers la liste des visiteurs
    setActiveTab('visitors');
  };
  
  // Gestionnaire pour la mise à jour d'un visiteur
  const handleUpdateVisitor = (updatedVisitor: Visitor) => {
    setVisitors(prev => 
      prev.map(visitor => 
        visitor.id === updatedVisitor.id ? updatedVisitor : visitor
      )
    );
    
    setSelectedVisitor(updatedVisitor);
    setIsEditMode(false);
    setIsDetailOpen(true);
  };
  
  // Gestionnaire pour la suppression d'un visiteur
  const handleDeleteVisitor = () => {
    if (!selectedVisitor) return;
    
    setVisitors(prev => 
      prev.filter(visitor => visitor.id !== selectedVisitor.id)
    );
    
    setIsDeleteDialogOpen(false);
    setIsDetailOpen(false);
    setSelectedVisitor(null);
  };
  
  // Gestionnaire pour marquer un visiteur comme sorti
  const handleCheckoutVisitor = (visitor: Visitor) => {
    const updatedVisitor: Visitor = {
      ...visitor,
      checkOutTime: new Date().toISOString(),
      status: 'completed'
    };
    
    setVisitors(prev => 
      prev.map(v => v.id === visitor.id ? updatedVisitor : v)
    );
    
    // Si c'est le visiteur sélectionné, mettre à jour
    if (selectedVisitor && selectedVisitor.id === visitor.id) {
      setSelectedVisitor(updatedVisitor);
    }
  };
  
  // Afficher un visiteur
  const handleViewVisitor = (visitor: Visitor) => {
    setSelectedVisitor(visitor);
    setIsEditMode(false);
    setIsDetailOpen(true);
  };
  
  // Éditer un visiteur
  const handleEditVisitor = (visitor: Visitor) => {
    setSelectedVisitor(visitor);
    setIsEditMode(true);
    setIsDetailOpen(false); // Fermer la vue détaillée si ouverte
  };
  
  // Gérer les filtres
  const handleFilterChange = (filterName: string, value: string) => {
    setFilterOptions(prev => ({
      ...prev,
      [filterName]: value
    }));
  };
  
  // Gérer l'exportation des données
  const handleExportData = (format: string, data: Visitor[]) => {
    // Implémenter l'exportation des données (CSV, Excel, PDF)
    console.log(`Exporting ${data.length} visitors in ${format} format`);
    alert(`Exportation en ${format.toUpperCase()} déclenchée pour ${data.length} visiteurs`);
    setIsExportOpen(false);
  };
  
  // Statistiques des visiteurs
  const visitorStats = {
    total: visitors.length,
    present: visitors.filter(v => v.status === 'present').length,
    completed: visitors.filter(v => v.status === 'completed').length,
    overdue: visitors.filter(v => v.status === 'overdue').length,
  };
  
  // Récupérer les statistiques des rendez-vous
  const appointmentStats = getAppointmentStats();
  
  // Liste des départements pour le filtre
  const departments = [...new Set(visitors.map(v => v.department))];

  return (
    <div data-module="visitors" className="space-y-6">
      {/* En-tête avec onglets */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Visiteurs</h1>
          <p className="text-gray-600">Enregistrez, suivez et gérez les visiteurs et visites prévues</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setActiveTab('visitors')}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
              activeTab === 'visitors'
                ? 'bg-blue-600 text-white'
                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Users className="h-4 w-4" />
            Liste
          </button>
          <button
            onClick={() => {
              setIsEditMode(false);
              setSelectedVisitor(null);
              setActiveTab('register');
            }}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
              activeTab === 'register'
                ? 'bg-blue-600 text-white'
                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <UserPlus className="h-4 w-4" />
            Enregistrer
          </button>
          <button
            onClick={() => setActiveTab('planning')}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
              activeTab === 'planning'
                ? 'bg-blue-600 text-white'
                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Calendar className="h-4 w-4" />
            Visites Prévues
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
              activeTab === 'history'
                ? 'bg-blue-600 text-white'
                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Clock className="h-4 w-4" />
            Historique
          </button>
        </div>
      </div>

      {/* Statistiques - Affichées seulement dans les onglets liste et enregistrement */}
      {showStats && (activeTab === 'visitors' || activeTab === 'history') && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Visiteurs Total</p>
                <p className="text-2xl font-bold text-gray-900">{visitors.length + visitorHistory.length}</p>
              </div>
              <div className="bg-blue-100 rounded-lg p-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Présents</p>
                <p className="text-2xl font-bold text-green-600">{visitorStats.present}</p>
              </div>
              <div className="bg-green-100 rounded-lg p-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Traités</p>
                <p className="text-2xl font-bold text-blue-600">{visitorStats.completed + visitorHistory.length}</p>
              </div>
              <div className="bg-blue-100 rounded-lg p-3">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Visites Prévues</p>
                <p className="text-2xl font-bold text-purple-600">{appointmentStats.confirmed}</p>
              </div>
              <div className="bg-purple-100 rounded-lg p-3">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filtres de recherche pour les onglets liste et historique */}
      {(activeTab === 'visitors' || activeTab === 'history') && (
        <VisitorFilter
          filterOptions={filterOptions}
          onFilterChange={handleFilterChange}
          departments={departments}
          onExport={() => setIsExportOpen(true)}
          activeTab={activeTab}
        />
      )}

      {/* Contenu principal - change selon l'onglet actif */}
      {activeTab === 'visitors' && (
        <VisitorsList 
          visitors={filteredVisitors}
          appointments={appointmentsData}
          onViewVisitor={handleViewVisitor}
          onEditVisitor={handleEditVisitor}
          onDeleteVisitor={(visitor) => {
            setSelectedVisitor(visitor);
            setIsDeleteDialogOpen(true);
          }}
          onCheckoutVisitor={handleCheckoutVisitor}
          loading={loading}
          searchTerm={filterOptions.searchTerm}
        />
      )}

      {activeTab === 'register' && (
        <div className="space-y-6">
          {isEditMode && selectedVisitor ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Modification du Visiteur</h2>
                <button
                  onClick={() => {
                    setIsEditMode(false);
                    setSelectedVisitor(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <VisitorRegistrationForm 
                appointments={appointmentsData}
                onRegisterVisitor={handleUpdateVisitor}
                initialData={{
                  id: selectedVisitor.id,
                  firstName: selectedVisitor.firstName,
                  lastName: selectedVisitor.lastName,
                  phone: selectedVisitor.phone,
                  email: selectedVisitor.email || '',
                  company: selectedVisitor.company || '',
                  purposeOfVisit: selectedVisitor.purposeOfVisit,
                  serviceRequested: selectedVisitor.serviceRequested,
                  employeeToVisit: selectedVisitor.employeeToVisit,
                  department: selectedVisitor.department,
                  expectedDuration: selectedVisitor.expectedDuration,
                  idType: selectedVisitor.idType,
                  idNumber: selectedVisitor.idNumber,
                  notes: selectedVisitor.notes || '',
                  badgeNumber: selectedVisitor.badgeNumber,
                  status: selectedVisitor.status
                }}
                isEdit={true}
              />
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <VisitorRegistrationForm 
                appointments={appointmentsData}
                onRegisterVisitor={handleRegisterVisitor}
              />
            </div>
          )}
        </div>
      )}

      {activeTab === 'planning' && <VisitPlanningTab />}

      {activeTab === 'history' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-600" />
              Historique des Visites
            </h3>
          </div>
          
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <RefreshCw className="h-10 w-10 text-gray-400 animate-spin" />
              </div>
            ) : visitorHistory.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Clock className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Aucun historique trouvé</h3>
                <p className="text-gray-500 max-w-md mx-auto mt-2">
                  L'historique des visites terminées apparaîtra ici.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {visitorHistory.map(visitor => (
                  <div key={visitor.id} className="py-4 flex flex-col md:flex-row md:items-center gap-4 group hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0 w-12 h-12">
                      {visitor.photo ? (
                        <img 
                          src={visitor.photo} 
                          alt={visitor.fullName}
                          className="rounded-full w-full h-full object-cover" 
                        />
                      ) : (
                        <div className="bg-gray-200 rounded-full w-full h-full flex items-center justify-center">
                          <Users className="h-6 w-6 text-gray-500" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div>
                          <h4 className="font-medium text-gray-900">{visitor.fullName}</h4>
                          <div className="text-sm text-gray-600">{visitor.purposeOfVisit}</div>
                        </div>
                        
                        <div className="md:text-right">
                          <div className="text-sm font-medium text-gray-900">{visitor.serviceRequested}</div>
                          <div className="text-xs text-gray-500">{visitor.department}</div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                          <span>Visite terminée</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{new Date(visitor.checkInTime).toLocaleDateString('fr-FR')}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          <span>
                            {new Date(visitor.checkInTime).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}
                            {' '}-{' '}
                            {visitor.checkOutTime ? new Date(visitor.checkOutTime).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'}) : 'N/A'}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <AlignLeft className="h-3.5 w-3.5" />
                          <span>Badge: {visitor.badgeNumber}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleViewVisitor(visitor)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedVisitor(visitor);
                          setIsExportOpen(true);
                        }}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                      >
                        <FileText className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals et Dialogs */}
      {isDetailOpen && selectedVisitor && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black bg-opacity-50">
          <div className="max-w-2xl w-full animate-fade-in">
            <VisitorDetail 
              visitor={selectedVisitor}
              onClose={() => {
                setIsDetailOpen(false);
                setSelectedVisitor(null);
              }}
              onEdit={() => {
                setIsDetailOpen(false);
                setIsEditMode(true);
                setActiveTab('register');
              }}
              onDelete={() => setIsDeleteDialogOpen(true)}
              onCheckout={
                selectedVisitor.status === 'present' 
                  ? () => handleCheckoutVisitor(selectedVisitor) 
                  : undefined
              }
              onExport={() => setIsExportOpen(true)}
              appointments={appointmentsData}
            />
          </div>
        </div>
      )}

      {/* Confirmation de suppression */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Confirmer la suppression"
        message={`Êtes-vous sûr de vouloir supprimer le visiteur "${selectedVisitor?.fullName}" ? Cette action est irréversible.`}
        type="danger"
        confirmText="Supprimer"
        cancelText="Annuler"
        onConfirm={handleDeleteVisitor}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />

      {/* Modal d'exportation */}
      {isExportOpen && (
        <VisitorExport
          visitor={selectedVisitor}
          visitors={activeTab === 'history' ? visitorHistory : filteredVisitors}
          onExport={handleExportData}
          onClose={() => setIsExportOpen(false)}
          exportType={selectedVisitor ? 'single' : 'multiple'}
        />
      )}
    </div>
  );
};