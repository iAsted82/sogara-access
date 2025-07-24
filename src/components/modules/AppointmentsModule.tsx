import React, { useState } from 'react';
import { 
  Calendar, Clock, User, CheckCircle, XCircle, AlertTriangle, Plus,
  Search, Filter, Eye, ArrowLeft, ArrowRight, ChevronDown, ChevronUp,
  Calendar as CalendarIcon, ClipboardList, CalendarCheck, CalendarPlus,
  Info, FileText
} from 'lucide-react';
import { appointmentsData, getAppointmentStats } from '../../data/appointmentsData';
import { Appointment } from '../../types/appointment';

// Interface pour les rendez-vous
// Interface moved to src/types/appointment.ts

export const AppointmentsModule: React.FC = () => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today.toISOString().split('T')[0]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeCategory, setActiveCategory] = useState<'past' | 'current' | 'future'>('current');
  const [expandedAppointment, setExpandedAppointment] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Utiliser les données d'appointmentsData.ts
  const allAppointments = appointmentsData;

  // Fonction pour déterminer si une date est aujourd'hui
  const isToday = (dateStr: string) => {
    const today = new Date();
    const date = new Date(dateStr);
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Fonction pour déterminer si une date est dans le futur
  const isFuture = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0);
    return date > today;
  };

  // Fonction pour déterminer si une date est dans le passé
  const isPast = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Fonction pour déterminer si un rendez-vous est dans cette semaine
  const isThisWeek = (dateStr: string) => {
    const today = new Date();
    const date = new Date(dateStr);
    
    // Début de la semaine (lundi)
    const startOfWeek = new Date(today);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);
    
    // Fin de la semaine (dimanche)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    
    return date >= startOfWeek && date <= endOfWeek;
  };

  // Get the stats from our helper function

  // Organize appointments by category
  const pastAppointments = appointmentsData
    .filter(a => isPast(a.date))
    .sort((a, b) => new Date(b.date + 'T' + b.time).getTime() - new Date(a.date + 'T' + a.time).getTime());
  
  const currentAppointments = appointmentsData
    .filter(a => isToday(a.date) || (isFuture(a.date) && isThisWeek(a.date)))
    .sort((a, b) => new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime());
  
  const futureAppointments = appointmentsData
    .filter(a => isFuture(a.date) && !isThisWeek(a.date))
    .sort((a, b) => new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime());

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'arrived':
        return <User className="h-4 w-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'no_show':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      pending: 'En attente',
      confirmed: 'Confirmé',
      arrived: 'Présent',
      completed: 'Terminé',
      cancelled: 'Annulé',
      no_show: 'Absent'
    };
    return labels[status as keyof typeof labels] || status;
  };

  // Filtrer les rendez-vous en fonction de la recherche
  const filterAppointmentsBySearch = (appointments: Appointment[]) => {
    if (!searchTerm) return appointments;
    return appointments.filter(a => 
      a.citizenName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.service.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      arrived: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      no_show: 'bg-orange-100 text-orange-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  // Appliquer le filtre par statut à la liste d'origine pour les statistiques
  const filteredAppointmentsByStatus = (appointments: Appointment[]) => {
    if (filterStatus === 'all') return appointments;
    return appointments.filter(a => a.status === filterStatus);
  };

  // Filtres combinés
  const filteredPastAppointments = filterAppointmentsBySearch(filteredAppointmentsByStatus(pastAppointments));
  const filteredCurrentAppointments = filterAppointmentsBySearch(filteredAppointmentsByStatus(currentAppointments));
  const filteredFutureAppointments = filterAppointmentsBySearch(filteredAppointmentsByStatus(futureAppointments));

  // Statistiques de rendez-vous
  const appointmentStats = {
    total: allAppointments.length,
    confirmed: allAppointments.filter(a => a.status === 'confirmed').length,
    completed: allAppointments.filter(a => a.status === 'completed').length,
    pending: allAppointments.filter(a => a.status === 'pending').length,
    cancelled: allAppointments.filter(a => a.status === 'cancelled').length,
    noShow: allAppointments.filter(a => a.status === 'no_show').length,
    todayCount: allAppointments.filter(a => isToday(a.date)).length,
    thisWeekCount: allAppointments.filter(a => isThisWeek(a.date)).length,
    futureCount: allAppointments.filter(a => isFuture(a.date) && !isThisWeek(a.date)).length,
    pastCount: allAppointments.filter(a => isPast(a.date)).length
  };
  
  // Fonction pour formater une date en français
  const formatDate = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      weekday: 'long'
    };
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', options);
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Rendez-vous</h1>
          <p className="text-gray-600">Organisation et suivi des rendez-vous de A à Z</p>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouveau Rendez-vous
          </button>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{appointmentStats.total}</p>
            </div>
            <Calendar className="h-8 w-8 text-gray-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Aujourd'hui</p>
              <p className="text-2xl font-bold text-green-600">{appointmentStats.today}</p>
            </div>
            <CalendarIcon className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En cours</p>
              <p className="text-2xl font-bold text-blue-600">{appointmentStats.confirmed + appointmentStats.arrived}</p>
            </div>
            <User className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">À venir</p>
              <p className="text-2xl font-bold text-yellow-600">{futureAppointments.length}</p>
            </div>
            <CalendarPlus className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Passés</p>
              <p className="text-2xl font-bold text-purple-600">{pastAppointments.length}</p>
            </div>
            <ClipboardList className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, service ou motif..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
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
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtres
          </button>
        </div>
      </div>
      
      {/* Navigation entre catégories */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
        <div className="flex">
          <button
            onClick={() => setActiveCategory('past')}
            className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-medium ${
              activeCategory === 'past' 
                ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <ClipboardList className="h-5 w-5" />
            <span>Historique</span>
            <span className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-full">
              {filteredPastAppointments.length}
            </span>
          </button>
          
          <button
            onClick={() => setActiveCategory('current')}
            className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-medium ${
              activeCategory === 'current' 
                ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <CalendarCheck className="h-5 w-5" />
            <span>Actualité</span>
            <span className={`${
              filteredCurrentAppointments.length > 0 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-200 text-gray-800'
            } text-xs px-2 py-1 rounded-full`}>
              {filteredCurrentAppointments.length}
            </span>
          </button>
          
          <button
            onClick={() => setActiveCategory('future')}
            className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-medium ${
              activeCategory === 'future' 
                ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <CalendarPlus className="h-5 w-5" />
            <span>Avenir</span>
            <span className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-full">
              {filteredFutureAppointments.length}
            </span>
          </button>
        </div>
      </div>

      {/* Section 1: HISTORIQUE (Rendez-vous passés) */}
      {activeCategory === 'past' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 rounded-lg p-2">
                <ClipboardList className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Historique des rendez-vous</h2>
                <p className="text-sm text-gray-600">Rendez-vous passés classés par ordre chronologique</p>
              </div>
            </div>
            <div>
              <span className="text-sm text-gray-500">{filteredPastAppointments.length} rendez-vous</span>
            </div>
          </div>

          {filteredPastAppointments.length > 0 ? (
            <div className="space-y-4">
              {filteredPastAppointments.map(appointment => (
                <div 
                  key={appointment.id}
                  className="border border-gray-200 rounded-lg hover:shadow-md transition-all"
                >
                  <div 
                    className="p-4 cursor-pointer flex justify-between items-center"
                    onClick={() => setExpandedAppointment(expandedAppointment === appointment.id ? null : appointment.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`${
                        appointment.status === 'completed' ? 'bg-green-100 text-green-700' :
                        appointment.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        appointment.status === 'no_show' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-700'
                      } p-3 rounded-lg`}>
                        {getStatusIcon(appointment.status)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{appointment.citizenName}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(appointment.status)}`}>
                            {getStatusLabel(appointment.status)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {formatDate(appointment.date)} - {appointment.time} ({appointment.duration} min)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium">{appointment.service}</p>
                        <p className="text-xs text-gray-500">{appointment.purpose}</p>
                      </div>
                      <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${
                        expandedAppointment === appointment.id ? 'rotate-180' : ''
                      }`} />
                    </div>
                  </div>
                  
                  {expandedAppointment === appointment.id && (
                    <div className="p-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-700 mb-2">Détails du rendez-vous</h3>
                          <div className="space-y-1 text-sm">
                            <p><span className="font-medium">Motif:</span> {appointment.purpose}</p>
                            <p><span className="font-medium">Service:</span> {appointment.service}</p>
                            <p><span className="font-medium">Agent assigné:</span> {appointment.agent}</p>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-700 mb-2">Résultat</h3>
                          <div className="bg-white p-3 rounded border border-gray-200 text-sm min-h-[80px]">
                            {appointment.status === 'completed' ? (
                              <div className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                                <p>Service {appointment.purpose} complété avec succès pour {appointment.citizenName}.</p>
                              </div>
                            ) : appointment.status === 'cancelled' ? (
                              <div className="flex items-start gap-2">
                                <XCircle className="h-4 w-4 text-red-500 mt-0.5" />
                                <p>Rendez-vous annulé. {appointment.notes}</p>
                              </div>
                            ) : appointment.status === 'no_show' ? (
                              <div className="flex items-start gap-2">
                                <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                                <p>Absence non justifiée. {appointment.notes}</p>
                              </div>
                            ) : (
                              <div className="flex items-start gap-2">
                                <Info className="h-4 w-4 text-gray-500 mt-0.5" />
                                <p>{appointment.notes || "Aucune information supplémentaire."}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm">
                          <FileText className="h-4 w-4" />
                          Générer récapitulatif
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 border border-dashed border-gray-300 rounded-lg">
              <ClipboardList className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 font-medium">Aucun rendez-vous passé trouvé</p>
              <p className="text-sm text-gray-400">Ajustez les filtres pour voir plus de résultats</p>
            </div>
          )}
        </div>
      )}

      {/* Section 2: ACTUALITÉ (Rendez-vous en cours/prévus) */}
      {activeCategory === 'current' && (
        <div className="space-y-6">
          {/* Rendez-vous d'aujourd'hui */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 rounded-lg p-2">
                  <CalendarIcon className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Aujourd'hui</h2>
                  <p className="text-sm text-gray-600">{formatDate(today.toISOString().split('T')[0])}</p>
                </div>
              </div>
            </div>

            {filteredCurrentAppointments.filter(a => isToday(a.date)).length > 0 ? (
              <div className="space-y-3">
                {filteredCurrentAppointments
                  .filter(a => isToday(a.date))
                  .map(appointment => (
                    <div 
                      key={appointment.id}
                      className={`bg-white border rounded-lg p-4 flex items-center gap-4 hover:shadow-md transition-all ${
                        appointment.priority === 'urgent' 
                          ? 'border-l-4 border-l-red-500' 
                          : appointment.priority === 'high'
                            ? 'border-l-4 border-l-orange-500'
                            : ''
                      }`}
                    >
                      <div className="w-16 flex-shrink-0 text-center">
                        <p className="text-lg font-bold text-gray-900">{appointment.time}</p>
                        <p className="text-xs text-gray-500">{appointment.duration} min</p>
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900">{appointment.citizenName}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(appointment.status)}`}>
                            {getStatusLabel(appointment.status)}
                          </span>
                          {appointment.priority === 'urgent' && (
                            <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">URGENT</span>
                          )}
                          {appointment.priority === 'high' && (
                            <span className="bg-orange-100 text-orange-800 text-xs px-2 py-0.5 rounded-full">Prioritaire</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{appointment.purpose}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg">
                          <Eye className="h-5 w-5" />
                        </button>
                        {appointment.status === 'confirmed' && (
                          <button className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg">
                            <User className="h-5 w-5" />
                          </button>
                        )}
                        {appointment.status === 'arrived' && (
                          <button className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg">
                            <CheckCircle className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
                <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 font-medium">Aucun rendez-vous aujourd'hui</p>
                <button 
                  className="mt-2 text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1 mx-auto"
                  onClick={() => setShowAddModal(true)}
                >
                  <Plus className="h-4 w-4" />
                  Ajouter un rendez-vous
                </button>
              </div>
            )}
          </div>
          
          {/* Rendez-vous cette semaine */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 rounded-lg p-2">
                  <CalendarCheck className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Cette semaine</h2>
                  <p className="text-sm text-gray-600">Rendez-vous prévus pour les prochains jours</p>
                </div>
              </div>
            </div>

            {filteredCurrentAppointments.filter(a => !isToday(a.date)).length > 0 ? (
              <div className="space-y-4">
                {/* Grouper par date */}
                {[...new Set(filteredCurrentAppointments.filter(a => !isToday(a.date)).map(a => a.date))].map(date => (
                  <div key={date} className="space-y-3">
                    <h3 className="font-medium text-gray-700 bg-gray-50 p-2 rounded">
                      {formatDate(date)}
                    </h3>
                    {filteredCurrentAppointments
                      .filter(a => a.date === date)
                      .map(appointment => (
                        <div 
                          key={appointment.id}
                          className={`bg-white border rounded-lg p-4 flex items-center gap-4 hover:shadow-md transition-all ${
                            appointment.priority === 'urgent' 
                              ? 'border-l-4 border-l-red-500' 
                              : appointment.priority === 'high'
                                ? 'border-l-4 border-l-orange-500'
                                : ''
                          }`}
                        >
                          <div className="w-16 flex-shrink-0 text-center">
                            <p className="text-lg font-bold text-gray-900">{appointment.time}</p>
                            <p className="text-xs text-gray-500">{appointment.duration} min</p>
                          </div>
                          
                          <div className="flex-grow">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-gray-900">{appointment.citizenName}</p>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(appointment.status)}`}>
                                {getStatusLabel(appointment.status)}
                              </span>
                              {appointment.priority === 'urgent' && (
                                <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">URGENT</span>
                              )}
                              {appointment.priority === 'high' && (
                                <span className="bg-orange-100 text-orange-800 text-xs px-2 py-0.5 rounded-full">Prioritaire</span>
                              )}
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <p className="text-sm text-gray-600">{appointment.purpose}</p>
                              <p className="text-xs text-gray-500">Agent: {appointment.agent}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg">
                              <Eye className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
                <CalendarCheck className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 font-medium">Aucun rendez-vous prévu cette semaine</p>
                <button 
                  className="mt-2 text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1 mx-auto"
                  onClick={() => setShowAddModal(true)}
                >
                  <Plus className="h-4 w-4" />
                  Planifier un rendez-vous
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Section 3: AVENIR (Rendez-vous à venir) */}
      {activeCategory === 'future' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 rounded-lg p-2">
                <CalendarPlus className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Rendez-vous à enregistrer</h2>
                <p className="text-sm text-gray-600">Planification des futurs rendez-vous</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Ajouter
            </button>
          </div>

          {filteredFutureAppointments.length > 0 ? (
            <div className="space-y-4">
              {/* Grouper par date */}
              {[...new Set(filteredFutureAppointments.map(a => a.date))].map(date => (
                <div key={date} className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition-all">
                  <div 
                    className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer"
                    onClick={() => setExpandedAppointment(expandedAppointment === date ? null : date)}
                  >
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5 text-blue-600" />
                      <h3 className="font-medium text-gray-800">{formatDate(date)}</h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500">
                        {filteredFutureAppointments.filter(a => a.date === date).length} rendez-vous
                      </span>
                      <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${
                        expandedAppointment === date ? 'rotate-180' : ''
                      }`} />
                    </div>
                  </div>
                  
                  {expandedAppointment === date && (
                    <div className="p-4 divide-y divide-gray-100">
                      {filteredFutureAppointments
                        .filter(a => a.date === date)
                        .sort((a, b) => a.time.localeCompare(b.time))
                        .map(appointment => (
                          <div key={appointment.id} className="py-3 first:pt-0 last:pb-0">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-16 flex-shrink-0">
                                  <p className="text-base font-semibold text-gray-900">{appointment.time}</p>
                                  <p className="text-xs text-gray-500">{appointment.duration} min</p>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{appointment.citizenName}</p>
                                  <p className="text-sm text-gray-600">{appointment.purpose}</p>
                                  <p className="text-xs text-gray-500">Service: {appointment.service}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(appointment.status)}`}>
                                  {getStatusLabel(appointment.status)}
                                </span>
                                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                                  <Eye className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 border border-dashed border-gray-300 rounded-lg">
              <CalendarPlus className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 font-medium">Aucun rendez-vous futur enregistré</p>
              <button 
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
                onClick={() => setShowAddModal(true)}
              >
                <Plus className="h-4 w-4" />
                Enregistrer un nouveau rendez-vous
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Navigation de pagination pour mobile */}
      <div className="flex justify-between md:hidden mt-4">
        <button 
          onClick={() => setActiveCategory(activeCategory === 'past' ? 'current' : activeCategory === 'current' ? 'past' : 'current')}
          className="flex items-center gap-2 text-blue-600 px-4 py-2 rounded-lg border border-blue-200"
        >
          <ArrowLeft className="h-4 w-4" />
          {activeCategory === 'future' ? 'Actualité' : activeCategory === 'current' ? 'Historique' : 'Actualité'}
        </button>
        
        <button 
          onClick={() => setActiveCategory(activeCategory === 'future' ? 'current' : activeCategory === 'current' ? 'future' : 'current')}
          className="flex items-center gap-2 text-blue-600 px-4 py-2 rounded-lg border border-blue-200"
        >
          {activeCategory === 'past' ? 'Actualité' : activeCategory === 'current' ? 'Avenir' : 'Actualité'}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};