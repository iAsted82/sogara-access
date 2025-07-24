import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, Plus, Search, Filter, RefreshCw, UserCheck, 
  UserX, Building2, CheckCircle, Download, Upload, 
  FileSpreadsheet, FileText, Calendar, CheckSquare, BarChart,
  Camera, Zap, Clock, X, User
} from 'lucide-react';
import { StaffList } from '../staff/StaffList';
import { StaffForm } from '../staff/StaffForm';
import { StaffDetail } from '../staff/StaffDetail';
import { ConfirmDialog } from '../staff/ConfirmDialog';
import { StaffPlanning } from '../staff/StaffPlanning';
import { StaffImport } from '../staff/StaffImport';
import { StaffStats } from '../staff/StaffStats';
import { AbsenceForm } from '../staff/AbsenceForm';
import { VisitorView } from '../staff/VisitorView';
import { StaffMember, StaffFormData, StaffFilter } from '../../types/staff';
import { staffData, getAllDepartments, getStaffStats } from '../../data/staffData';
import { generateStaffId, validateStaffForm, searchStaff, filterByDepartment, filterByAvailability } from '../../utils/staffUtils';

export const StaffManagementModule: React.FC = () => {
  // Staff data state
  const [staff, setStaff] = useState<StaffMember[]>(staffData);
  const [filteredStaff, setFilteredStaff] = useState<StaffMember[]>(staffData);
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'list' | 'add'>('list');
  const [activeView, setActiveView] = useState<'list' | 'planning' | 'stats' | 'visitor'>('list');
  const [filter, setFilter] = useState<StaffFilter>({
    searchTerm: '',
    department: 'all',
    availability: 'all'
  });
  const [absenceModalOpen, setAbsenceModalOpen] = useState(false);
  const [selectedStaffForAbsence, setSelectedStaffForAbsence] = useState<StaffMember | null>(null);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Modal states
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [editFormData, setEditFormData] = useState<StaffFormData | undefined>(undefined);
  
  // Toast notification state
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  }>({
    show: false,
    message: '',
    type: 'info'
  });
  
  // Get all departments
  const departments = getAllDepartments();
  const stats = getStaffStats();
  
  // Apply filters when filter state changes
  useEffect(() => {
    let result = staff;
    
    // Apply search filter
    if (filter.searchTerm) {
      result = searchStaff(result, filter.searchTerm);
    }
    
    // Apply department filter
    if (filter.department && filter.department !== 'all') {
      result = filterByDepartment(result, filter.department);
    }
    
    // Apply availability filter
    if (filter.availability && filter.availability !== 'all') {
      result = filterByAvailability(result, filter.availability);
    }
    
    setFilteredStaff(result);
  }, [staff, filter]);
  
  // Handle filter changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(prev => ({ ...prev, searchTerm: e.target.value }));
  };
  
  const handleDepartmentFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(prev => ({ ...prev, department: e.target.value }));
  };
  
  const handleAvailabilityFilter = (availability: 'all' | 'available' | 'unavailable') => {
    setFilter(prev => ({ ...prev, availability }));
  };
  
  // Handle CRUD operations
  const handleAddStaff = (data: StaffFormData) => {
    const newStaffMember: StaffMember = {
      id: generateStaffId(),
      firstName: data.firstName,
      lastName: data.lastName,
      function: data.function,
      department: data.department,
      internalPhone: data.internalPhone,
      email: data.email,
      isAvailable: data.isAvailable,
      location: data.location,
      notes: data.notes,
      role: data.role,
      skills: data.skills,
      languages: data.languages,
      startDate: data.startDate,
      emergencyContact: data.emergencyContact,
      lastSeen: new Date().toISOString()
    };
    
    setStaff(prev => [newStaffMember, ...prev]);
    setActiveTab('list');
    showNotification('success', `${newStaffMember.firstName} ${newStaffMember.lastName} a été ajouté avec succès.`);
  };
  
  const handleEditStaff = (data: StaffFormData) => {
    if (!selectedStaff) return;
    
    const updatedStaffMember: StaffMember = {
      ...selectedStaff,
      firstName: data.firstName,
      lastName: data.lastName,
      function: data.function,
      department: data.department,
      internalPhone: data.internalPhone,
      email: data.email,
      isAvailable: data.isAvailable,
      location: data.location,
      notes: data.notes,
      role: data.role,
      skills: data.skills,
      languages: data.languages,
      startDate: data.startDate,
      emergencyContact: data.emergencyContact,
      lastSeen: new Date().toISOString()
    };
    
    setStaff(prev => prev.map(member => 
      member.id === selectedStaff.id ? updatedStaffMember : member
    ));
    
    setShowEditForm(false);
    setSelectedStaff(updatedStaffMember);
    showNotification('success', `Les informations de ${updatedStaffMember.firstName} ${updatedStaffMember.lastName} ont été mises à jour.`);
  };
  
  const handleDeleteStaff = () => {
    if (!selectedStaff) return;
    
    setStaff(prev => prev.filter(member => member.id !== selectedStaff.id));
    setShowConfirmDelete(false);
    setSelectedStaff(null);
    showNotification('success', `${selectedStaff.firstName} ${selectedStaff.lastName} a été supprimé de la liste du personnel.`);
  };
  
  // Handle absence registration
  const handleRegisterAbsence = (staffId: string, data: { reason: string; duration: string; returnDate?: string }) => {
    // Update staff member with absence info
    setStaff(prev => prev.map(member => {
      if (member.id === staffId) {
        return {
          ...member,
          isAvailable: false,
          lastSeen: new Date().toISOString(),
          absenceReason: data.reason,
          absenceDuration: data.duration,
          expectedReturnDate: data.returnDate
        };
      }
      return member;
    }));
    
    setAbsenceModalOpen(false);
    setSelectedStaffForAbsence(null);
    
    // Show success message
    showNotification('success', 'Absence enregistrée avec succès.');
  };
  
  // Handle toggle availability with optional reason
  const handleToggleAvailabilityWithReason = (staffMember: StaffMember) => {
    if (staffMember.isAvailable) {
      // If currently available, show absence modal to collect reason
      setSelectedStaffForAbsence(staffMember);
      setAbsenceModalOpen(true);
    } else {
      // If currently unavailable, simply mark as available
      handleToggleAvailability(staffMember);
    }
  };
  
  const handleToggleAvailability = (staffMember: StaffMember) => {
    const updatedStaffMember = {
      ...staffMember,
      isAvailable: !staffMember.isAvailable,
      lastSeen: new Date().toISOString(),
      // Reset absence info if becoming available
      ...(staffMember.isAvailable ? {} : { 
        absenceReason: undefined, 
        absenceDuration: undefined,
        expectedReturnDate: undefined 
      })
    };
    
    setStaff(prev => prev.map(member => 
      member.id === staffMember.id ? updatedStaffMember : member
    ));
    
    // If we're viewing this staff member, update the selection
    if (selectedStaff && selectedStaff.id === staffMember.id) {
      setSelectedStaff(updatedStaffMember);
    }
    
    showNotification('info', `${updatedStaffMember.firstName} ${updatedStaffMember.lastName} est maintenant ${updatedStaffMember.isAvailable ? 'disponible' : 'indisponible'}.`);
  };

  // Handle import from file
  const handleImportStaff = (newStaff: StaffMember[]) => {
    // Add the imported staff to the current list
    setStaff(prev => [...newStaff, ...prev]);
    setImportModalOpen(false);
    showNotification('success', `${newStaff.length} membre(s) du personnel importé(s) avec succès.`);
  };
  
  // Handle export staff data
  const handleExportData = (format: 'csv' | 'excel' | 'pdf') => {
    // In a real application, we would generate and download the file
    // For demo purposes, we'll just show a message
    const staffToExport = filteredStaff.length > 0 ? filteredStaff : staff;
    const exportData = staffToExport.map(member => ({
      Nom: member.lastName,
      Prénom: member.firstName,
      Fonction: member.function,
      Département: member.department,
      Téléphone: member.internalPhone,
      Email: member.email,
      Disponible: member.isAvailable ? 'Oui' : 'Non',
      Localisation: member.location || 'Non spécifié',
      'Dernière activité': member.lastSeen ? new Date(member.lastSeen).toLocaleString('fr-FR') : 'Inconnue'
    }));
    
    showNotification('success', `Export en ${format.toUpperCase()} pour ${exportData.length} membres du personnel déclenché.`);
    setExportModalOpen(false);
  };
  
  // View staff details
  const handleViewStaff = (staffMember: StaffMember) => {
    setSelectedStaff(staffMember);
    setShowDetail(true);
  };
  
  // Show edit form
  const handleEditClick = (staffMember: StaffMember) => {
    setSelectedStaff(staffMember);
    
    // Prepare form data
    const formData: StaffFormData = {
      firstName: staffMember.firstName,
      lastName: staffMember.lastName,
      function: staffMember.function,
      department: staffMember.department,
      internalPhone: staffMember.internalPhone,
      email: staffMember.email,
      isAvailable: staffMember.isAvailable,
      location: staffMember.location,
      notes: staffMember.notes,
      role: staffMember.role,
      skills: staffMember.skills,
      languages: staffMember.languages,
      startDate: staffMember.startDate,
      emergencyContact: staffMember.emergencyContact,
      absenceReason: staffMember.absenceReason,
      absenceDuration: staffMember.absenceDuration,
      expectedReturnDate: staffMember.expectedReturnDate
    };
    
    setEditFormData(formData);
    setShowEditForm(true);
  };
  
  // Show delete confirmation
  const handleDeleteClick = (staffMember: StaffMember) => {
    setSelectedStaff(staffMember);
    setShowConfirmDelete(true);
  };
  
  // Reset filtered staff
  const handleResetFilters = () => {
    setFilter({
      searchTerm: '',
      department: 'all',
      availability: 'all'
    });
  };
  
  // Show notification
  const showNotification = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    setNotification({
      show: true,
      message,
      type
    });
    
    // Auto hide after 5 seconds
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 5000);
  };
  
  // Render notification
  const renderNotification = () => {
    if (!notification.show) return null;
    
    const typeClasses = {
      success: 'bg-green-100 border-green-400 text-green-800',
      error: 'bg-red-100 border-red-400 text-red-800',
      warning: 'bg-yellow-100 border-yellow-400 text-yellow-800',
      info: 'bg-blue-100 border-blue-400 text-blue-800'
    };
    
    const icon = {
      success: <CheckCircle className="h-5 w-5" />,
      error: <X className="h-5 w-5" />,
      warning: <X className="h-5 w-5" />,
      info: <CheckCircle className="h-5 w-5" />
    };
    
    return (
      <div className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg border ${typeClasses[notification.type]} shadow-lg z-50 animate-fade-in`}>
        <div className="flex items-center">
          <div className="flex-shrink-0 mr-3">
            {icon[notification.type]}
          </div>
          <div>{notification.message}</div>
          <button 
            onClick={() => setNotification(prev => ({ ...prev, show: false }))}
            className="ml-4 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion du Personnel</h1>
          <p className="text-gray-600">Gérez la liste du personnel et leurs disponibilités</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
              activeTab === 'list'
                ? 'bg-blue-600 text-white'
                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Users className="h-4 w-4" />
            Liste
          </button>
          <button 
            onClick={() => {
              setActiveTab('add');
              setIsEditMode(false);
            }}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
              activeTab === 'add'
                ? 'bg-blue-600 text-white'
                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Plus className="h-4 w-4" />
            Ajouter
          </button>
        </div>
      </div>
      
      {/* Staff Stats */}
      {activeTab === 'list' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Personnel Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Personnel Disponible</p>
                <p className="text-2xl font-bold text-green-600">{stats.available}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Personnel Absent</p>
                <p className="text-2xl font-bold text-red-600">{stats.unavailable}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <UserX className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Départements</p>
                <p className="text-2xl font-bold text-purple-600">{stats.departments}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Building2 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Staff List View */}
      {activeTab === 'list' && (
        <>
          {/* Filters */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, fonction, département..."
                  value={filter.searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={filter.department}
                onChange={handleDepartmentFilter}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[200px]"
              >
                <option value="all">Tous les départements</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleAvailabilityFilter('all')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm ${
                    filter.availability === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Tous
                </button>
                <button 
                  onClick={() => handleAvailabilityFilter('available')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm ${
                    filter.availability === 'available'
                      ? 'bg-green-600 text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Disponibles
                </button>
                <button 
                  onClick={() => handleAvailabilityFilter('unavailable')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm ${
                    filter.availability === 'unavailable'
                      ? 'bg-red-600 text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Absents
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-600">
                {filteredStaff.length} sur {staff.length} membres du personnel
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-sm flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Réinitialiser les filtres
                </button>
                <button
                  onClick={() => setExportModalOpen(true)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium text-sm flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Exporter
                </button>
                <div className="space-y-2 md:space-y-3">
                  <button
                    onClick={() => setActiveView('list')}
                    className="w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center justify-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Exporter
                  </button>
                  <button 
                    onClick={() => setActiveView('planning')}
                    className="w-full px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center justify-center gap-2"
                  >
                    <Calendar className="h-4 w-4" />
                    Vue Planification
                  </button>
                  <button
                    onClick={() => setExportModalOpen(true)} 
                    className="w-full px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center justify-center gap-2"
                  >
                    <BarChart className="h-4 w-4" />
                    Statistiques
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Staff Management UI - Tab Navigation */}
          <div className="mb-6 bg-white rounded-lg border border-gray-200 shadow-sm p-2">
            <div className="flex flex-wrap gap-2">
              <div className="flex flex-wrap gap-2 w-full">
                {/* Add Staff Button */}
                <button
                  onClick={() => {
                    setActiveTab('add');
                    setIsEditMode(false);
                  }}
                  className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <Plus className="h-5 w-5" />
                  <span className="font-medium">Ajouter un membre</span>
                </button>
                
                {/* Import Staff Button */}
                <button
                  onClick={() => setImportModalOpen(true)}
                  className="flex-1 py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                >
                  <Zap className="h-5 w-5" />
                  <span className="font-medium">Import IA</span>
                </button>
                
                {/* Reset Filters Button */}
                <button
                  onClick={handleResetFilters}
                  className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2"
                >
                  <RefreshCw className="h-5 w-5" />
                  <span className="font-medium">Réinitialiser les filtres</span>
                </button>
              </div>
              
              {/* View Toggle */}
              <div className="flex w-full mt-2 border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setActiveView('list')}
                  className={`flex-1 py-2 px-4 flex items-center justify-center gap-2 ${
                    activeView === 'list' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Users className="h-4 w-4" />
                  <span className="font-medium text-sm">Liste</span>
                </button>
                <button
                  onClick={() => setActiveView('planning')}
                  className={`flex-1 py-2 px-4 flex items-center justify-center gap-2 ${
                    activeView === 'planning' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium text-sm">Planning</span>
                </button>
                <button
                  onClick={() => setActiveView('stats')}
                  className={`flex-1 py-2 px-4 flex items-center justify-center gap-2 ${
                    activeView === 'stats' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <BarChart className="h-4 w-4" />
                  <span className="font-medium text-sm">Statistiques</span>
                </button>
                <button
                  onClick={() => setActiveView('visitor')}
                  className={`flex-1 py-2 px-4 flex items-center justify-center gap-2 ${
                    activeView === 'visitor' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <User className="h-4 w-4" />
                  <span className="font-medium text-sm">Vue Visiteur</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Main Content Views */}
          {activeView === 'list' ? (
            <StaffList 
              staffMembers={filteredStaff}
              onView={handleViewStaff}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              onToggleAvailability={handleToggleAvailabilityWithReason}
              onViewChange={() => setActiveView('planning')}
              currentView="list"
            />
          ) : activeView === 'planning' ? (
            <StaffPlanning 
              staff={staff}
              onUpdateAvailability={handleToggleAvailabilityWithReason}
            />
          ) : activeView === 'stats' ? (
            <StaffStats staff={staff} />
          ) : (
            <VisitorView staff={staff} />
          )}
        </>
      )}
      
      {/* Add Staff View */}
      {activeTab === 'add' && (
        <StaffForm
          onSubmit={handleAddStaff}
          onCancel={() => setActiveTab('list')}
        />
      )}
      
      {/* Staff Detail Modal */}
      {showDetail && selectedStaff && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black bg-opacity-50">
          <div className="max-w-2xl w-full animate-fade-in">
            <StaffDetail
              staff={selectedStaff}
              onClose={() => setShowDetail(false)}
              onEdit={() => {
                setShowDetail(false);
                handleEditClick(selectedStaff);
              }}
              onToggleAvailability={() => {
                handleToggleAvailabilityWithReason(selectedStaff);
                setShowDetail(false);
              }}
            />
          </div>
        </div>
      )}
      
      {/* Edit Staff Modal */}
      {showEditForm && selectedStaff && editFormData && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black bg-opacity-50">
          <div className="max-w-2xl w-full animate-fade-in">
            <StaffForm
              initialData={editFormData}
              onSubmit={handleEditStaff}
              onCancel={() => setShowEditForm(false)}
              isEdit={true}
            />
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showConfirmDelete}
        title="Confirmer la suppression"
        message={`Êtes-vous sûr de vouloir supprimer ${selectedStaff?.firstName} ${selectedStaff?.lastName} de la liste du personnel ? Cette action est irréversible.`}
        type="danger"
        confirmText="Supprimer"
        cancelText="Annuler"
        onConfirm={handleDeleteStaff}
        onCancel={() => setShowConfirmDelete(false)}
      />
      
      {/* Export Modal */}
      {exportModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Exporter les données du personnel</h3>
            
            <div className="grid grid-cols-3 gap-3 mb-6">
              <button 
                onClick={() => handleExportData('csv')}
                className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
              >
                <FileText className="h-8 w-8 text-blue-600" />
                <span className="text-sm font-medium">CSV</span>
              </button>
              
              <button 
                onClick={() => handleExportData('excel')}
                className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors"
              >
                <FileSpreadsheet className="h-8 w-8 text-green-600" />
                <span className="text-sm font-medium">Excel</span>
              </button>
              
              <button 
                onClick={() => handleExportData('pdf')}
                className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors"
              >
                <FileText className="h-8 w-8 text-red-600" />
                <span className="text-sm font-medium">PDF</span>
              </button>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <div className="flex items-start gap-3">
                <CheckSquare className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Données incluses</h4>
                  <p className="text-sm text-blue-800 mt-1">
                    L'export inclura {filteredStaff.length > 0 ? filteredStaff.length : staff.length} membres du personnel
                    {filteredStaff.length > 0 ? ' (filtrés)' : ''} avec leurs informations de contact et statut.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setExportModalOpen(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Import Modal */}
      {importModalOpen && (
        <StaffImport 
          onImport={handleImportStaff}
          onClose={() => setImportModalOpen(false)}
        />
      )}
      
      {/* Absence Form Modal */}
      {absenceModalOpen && selectedStaffForAbsence && (
        <AbsenceForm
          staff={selectedStaffForAbsence}
          onSubmit={(data) => handleRegisterAbsence(selectedStaffForAbsence.id, data)}
          onCancel={() => {
            setAbsenceModalOpen(false);
            setSelectedStaffForAbsence(null);
          }}
        />
      )}
      
      {/* Notification Toast */}
      {renderNotification()}
    </div>
  );
};