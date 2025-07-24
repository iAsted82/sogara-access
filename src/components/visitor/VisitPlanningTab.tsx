import React, { useState } from 'react';
import { 
  Calendar, FileSpreadsheet, FileUp, Camera, Plus, 
  Search, Filter, Download, RefreshCw, Upload, CheckCircle,
  Clock, AlertTriangle, XCircle, Eye, Edit, Trash2, User,
  CalendarCheck, CalendarDays, CalendarPlus, Info
} from 'lucide-react';
import { appointmentsData, getAppointmentStats } from '../../data/appointmentsData';
import { Appointment } from '../../types/appointment';
import { isAppointmentToday, getAppointmentStatusColor, formatAppointmentTime } from '../../utils/appointmentHelpers';

export const VisitPlanningTab: React.FC = () => {
  const [importMethod, setImportMethod] = useState<'manual' | 'excel' | 'pdf' | 'ai'>('manual');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [showAddVisitModal, setShowAddVisitModal] = useState(false);
  
  // Get appointments stats
  const stats = getAppointmentStats();
  
  // Filter appointments based on search, status, and date
  const filteredAppointments = appointmentsData.filter(appointment => {
    // Search filter
    const matchesSearch = appointment.citizenName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         appointment.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.service.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    
    // Date filter
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const appointmentDate = new Date(appointment.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dateFilter === 'today') {
        matchesDate = isAppointmentToday(appointment);
      } else if (dateFilter === 'week') {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const endOfWeek = new Date(today);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        
        matchesDate = appointmentDate >= startOfWeek && appointmentDate <= endOfWeek;
      } else if (dateFilter === 'month') {
        matchesDate = appointmentDate.getMonth() === today.getMonth() && 
                     appointmentDate.getFullYear() === today.getFullYear();
      } else if (dateFilter === 'future') {
        matchesDate = appointmentDate > today;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });
  
  // Sort appointments by date/time
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    // Sort by date first
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    
    const dateComparison = dateA.getTime() - dateB.getTime();
    if (dateComparison !== 0) return dateComparison;
    
    // Then by time if same date
    return a.time.localeCompare(b.time);
  });
  
  // Format date for display
  const formatDate = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    };
    return new Date(dateStr).toLocaleDateString('fr-FR', options);
  };
  
  // Get status label
  const getStatusLabel = (status: string): string => {
    const statusLabels: Record<string, string> = {
      pending: 'En attente',
      confirmed: 'Confirmé',
      arrived: 'Présent',
      completed: 'Terminé',
      cancelled: 'Annulé',
      no_show: 'Absent'
    };
    
    return statusLabels[status] || status;
  };
  
  // Group appointments by date
  const appointmentsByDate = sortedAppointments.reduce((acc, appointment) => {
    if (!acc[appointment.date]) {
      acc[appointment.date] = [];
    }
    acc[appointment.date].push(appointment);
    return acc;
  }, {} as Record<string, Appointment[]>);

  return (
    <div className="space-y-6">
      {/* Import Methods */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Importer des Visites Prévues</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button
            onClick={() => setImportMethod('manual')}
            className={`p-4 rounded-lg border text-center hover:shadow-md transition-all ${
              importMethod === 'manual'
                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <Calendar className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <h4 className="font-medium text-gray-900">Saisie Manuelle</h4>
            <p className="text-xs text-gray-500 mt-1">Créez des visites une par une</p>
          </button>
          
          <button
            onClick={() => setImportMethod('excel')}
            className={`p-4 rounded-lg border text-center hover:shadow-md transition-all ${
              importMethod === 'excel'
                ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
                : 'border-gray-200 hover:border-green-300'
            }`}
          >
            <FileSpreadsheet className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <h4 className="font-medium text-gray-900">Import Excel</h4>
            <p className="text-xs text-gray-500 mt-1">Importez depuis fichier Excel</p>
          </button>
          
          <button
            onClick={() => setImportMethod('pdf')}
            className={`p-4 rounded-lg border text-center hover:shadow-md transition-all ${
              importMethod === 'pdf'
                ? 'border-red-500 bg-red-50 ring-2 ring-red-200'
                : 'border-gray-200 hover:border-red-300'
            }`}
          >
            <FileUp className="h-8 w-8 mx-auto mb-2 text-red-600" />
            <h4 className="font-medium text-gray-900">Import PDF</h4>
            <p className="text-xs text-gray-500 mt-1">Importez depuis fichier PDF</p>
          </button>
          
          <button
            onClick={() => setImportMethod('ai')}
            className={`p-4 rounded-lg border text-center hover:shadow-md transition-all ${
              importMethod === 'ai'
                ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
                : 'border-gray-200 hover:border-purple-300'
            }`}
          >
            <Camera className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <h4 className="font-medium text-gray-900">Reconnaissance IA</h4>
            <p className="text-xs text-gray-500 mt-1">Extraction automatique par IA</p>
          </button>
        </div>
        
        {/* Action button based on selected method */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => setShowAddVisitModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {importMethod === 'manual' ? 'Nouvelle Visite' :
             importMethod === 'excel' ? 'Importer Fichier Excel' :
             importMethod === 'pdf' ? 'Importer Fichier PDF' :
             'Scanner Document'}
          </button>
        </div>
      </div>
      
      {/* Filters and Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Statistics */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Total</span>
                <span className="font-bold text-gray-900">{stats.total}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Aujourd'hui</span>
                <span className="font-bold text-blue-600">{stats.today}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Confirmés</span>
                <span className="font-bold text-green-600">{stats.confirmed}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">En attente</span>
                <span className="font-bold text-yellow-600">{stats.pending}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Annulés</span>
                <span className="font-bold text-red-600">{stats.cancelled}</span>
              </div>
            </div>
            
            <div className="mt-6 flex flex-col gap-2">
              <button className="w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center justify-center gap-2">
                <Download className="h-4 w-4" />
                Exporter les données
              </button>
              <button className="w-full px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center justify-center gap-2">
                <Calendar className="h-4 w-4" />
                Vue Calendrier
              </button>
            </div>
          </div>
        </div>
        
        {/* Search and Filters */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, service ou motif..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="confirmed">Confirmés</option>
                <option value="arrived">Présents</option>
                <option value="completed">Terminés</option>
                <option value="cancelled">Annulés</option>
                <option value="no_show">Absents</option>
              </select>
              
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Toutes les dates</option>
                <option value="today">Aujourd'hui</option>
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
                <option value="future">À venir</option>
              </select>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  statusFilter === 'all' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                }`}
              >
                Tous
              </button>
              <button 
                onClick={() => setStatusFilter('confirmed')}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  statusFilter === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}
              >
                Confirmés
              </button>
              <button 
                onClick={() => setStatusFilter('pending')}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  statusFilter === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                }`}
              >
                En attente
              </button>
              <button 
                onClick={() => setDateFilter('today')}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  dateFilter === 'today' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                }`}
              >
                Aujourd'hui
              </button>
              
              <div className="ml-auto">
                <button
                  onClick={() => setShowAddVisitModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Nouvelle Visite
                </button>
              </div>
            </div>
          </div>
          
          {/* Appointments List Grouped By Date */}
          <div className="mt-6 space-y-6">
            {Object.entries(appointmentsByDate).length > 0 ? (
              Object.entries(appointmentsByDate)
                .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
                .map(([date, appointments]) => (
                  <div key={date} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-4 bg-gray-50 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            isAppointmentToday({ date } as Appointment) ? 'bg-green-100' : 'bg-blue-100'
                          }`}>
                            {isAppointmentToday({ date } as Appointment) ? (
                              <CalendarCheck className="h-5 w-5 text-green-600" />
                            ) : (
                              <CalendarDays className="h-5 w-5 text-blue-600" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{formatDate(date)}</h3>
                            <p className="text-sm text-gray-600">{appointments.length} visite(s) prévue(s)</p>
                          </div>
                        </div>
                        
                        {isAppointmentToday({ date } as Appointment) && (
                          <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium">
                            Aujourd'hui
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="divide-y divide-gray-100">
                      {appointments.map((appointment) => (
                        <div 
                          key={appointment.id} 
                          className="p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex-shrink-0 w-12 text-center">
                                <div className="text-base font-medium text-gray-900">
                                  {appointment.time}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {appointment.duration}min
                                </div>
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <div className="font-medium text-gray-900">
                                    {appointment.citizenName}
                                  </div>
                                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                    getAppointmentStatusColor(appointment.status)
                                  }`}>
                                    {getStatusLabel(appointment.status)}
                                  </span>
                                  {appointment.priority === 'urgent' && (
                                    <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">
                                      URGENT
                                    </span>
                                  )}
                                </div>
                                
                                <div className="text-sm text-gray-600 mt-1">
                                  {appointment.purpose}
                                </div>
                                
                                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                  <div className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    {appointment.agent}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {appointment.service}
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
                                <Eye className="h-4 w-4" />
                              </button>
                              <button className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg">
                                <Edit className="h-4 w-4" />
                              </button>
                              <button className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <CalendarPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune visite prévue trouvée</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  {searchTerm || statusFilter !== 'all' || dateFilter !== 'all'
                    ? "Aucun résultat ne correspond à vos critères de recherche. Veuillez modifier vos filtres."
                    : "Aucune visite n'est prévue pour le moment. Vous pouvez ajouter de nouvelles visites."}
                </p>
                <button
                  onClick={() => setShowAddVisitModal(true)}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Ajouter une visite
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};