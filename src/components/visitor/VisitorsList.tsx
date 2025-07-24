import React, { useState } from 'react';
import { 
  User, Clock, MapPin, CheckCircle, AlertTriangle, 
  Search, Filter, Eye, Tag, Calendar, ChevronDown, ChevronUp,
  QrCode, Edit, Trash2, Users, RefreshCw 
} from 'lucide-react';
import { VisitorAppointmentIndicator } from './VisitorAppointmentIndicator';
import { Appointment } from '../../types/appointment';
import { verifyVisitorAppointment } from '../../utils/appointmentHelpers';

interface Visitor {
  id: string;
  fullName: string;
  badgeNumber: string;
  checkInTime: string;
  company?: string;
  purposeOfVisit: string;
  serviceRequested: string;
  employeeToVisit: string;
  department: string;
  expectedDuration: string;
  status: 'present' | 'completed' | 'overdue';
  appointmentId?: string;
}

interface VisitorsListProps {
  visitors: Visitor[];
  appointments: Appointment[];
  onViewVisitor: (visitor: Visitor) => void;
  onEditVisitor: (visitor: Visitor) => void;
  onDeleteVisitor: (visitor: Visitor) => void;
  onCheckoutVisitor: (visitor: Visitor) => void;
  loading: boolean;
  className?: string;
}

export const VisitorsList: React.FC<VisitorsListProps> = ({
  visitors,
  appointments,
  onViewVisitor,
  onEditVisitor,
  onDeleteVisitor,
  onCheckoutVisitor,
  loading,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedVisitor, setExpandedVisitor] = useState<string | null>(null);

  // Filter visitors based on search and status
  const filteredVisitors = visitors.filter(visitor => {
    const matchesSearch = visitor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         visitor.badgeNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         visitor.purposeOfVisit.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || visitor.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Get visitor appointment
  const getVisitorAppointment = (visitor: Visitor): Appointment | null => {
    // If visitor already has an appointmentId, use it
    if (visitor.appointmentId) {
      const appointment = appointments.find(a => a.id === visitor.appointmentId);
      if (appointment) return appointment;
    }
    
    // Otherwise try to find a matching appointment
    const result = verifyVisitorAppointment(appointments, visitor.fullName);
    return result.exactMatch || null;
  };

  // Get status indicator
  const getStatusIndicator = (status: string) => {
    switch (status) {
      case 'present':
        return {
          icon: <CheckCircle className="h-4 w-4 text-green-500" />,
          text: 'Présent',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800'
        };
      case 'completed':
        return {
          icon: <CheckCircle className="h-4 w-4 text-blue-500" />,
          text: 'Terminé',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800'
        };
      case 'overdue':
        return {
          icon: <AlertTriangle className="h-4 w-4 text-orange-500" />,
          text: 'Dépassement',
          bgColor: 'bg-orange-100',
          textColor: 'text-orange-800'
        };
      default:
        return {
          icon: <Clock className="h-4 w-4 text-gray-500" />,
          text: 'Inconnu',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800'
        };
    }
  };
  
  // Calculate visit duration
  const calculateDuration = (checkInTime: string): string => {
    const checkIn = new Date(checkInTime);
    const now = new Date();
    const diffMs = now.getTime() - checkIn.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return loading ? (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-10 text-center">
      <RefreshCw className="h-10 w-10 text-gray-400 animate-spin mx-auto mb-4" />
      <p className="text-gray-600 font-medium">Chargement des visiteurs...</p>
    </div>
  ) : visitors.length === 0 ? (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-10 text-center">
      <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-xl font-medium text-gray-900 mb-2">Aucun visiteur trouvé</h3>
      <p className="text-gray-600 max-w-md mx-auto mb-6">
        {searchTerm ? 
          "Aucun visiteur ne correspond à votre recherche." : 
          "Il n'y a actuellement aucun visiteur enregistré. Vous pouvez en ajouter un nouveau avec le bouton Enregistrer."}
      </p>
    </div>
  ) : (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden ${className}`}>
      {/* Header and search */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-blue-900">Visiteurs Actuels</h3>
            <p className="text-sm text-blue-700">{filteredVisitors.length} visiteur(s) présent(s)</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un visiteur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="present">Présent</option>
              <option value="completed">Terminé</option>
              <option value="overdue">Dépassement</option>
            </select>
            
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtres
            </button>
          </div>
        </div>
      </div>
      
      {/* Visitors list */}
      <div className="divide-y divide-gray-100">
        {filteredVisitors.length > 0 ? (
          filteredVisitors.map((visitor) => {
            const status = getStatusIndicator(visitor.status);
            const duration = calculateDuration(visitor.checkInTime);
            const isExpanded = expandedVisitor === visitor.id;
            const appointment = getVisitorAppointment(visitor);
            
            return (
              <div key={visitor.id} className="group">
                <div 
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setExpandedVisitor(isExpanded ? null : visitor.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-lg mt-1">
                        {visitor.fullName.charAt(0)}
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-900">{visitor.fullName}</h4>
                          <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.bgColor} ${status.textColor} flex items-center gap-1`}>
                            {status.icon}
                            <span>{status.text}</span>
                          </div>
                          
                          {appointment && (
                            <VisitorAppointmentIndicator appointment={appointment} compact={true} />
                          )}
                        </div>
                        
                        <div className="text-sm text-gray-600 mt-1">{visitor.purposeOfVisit}</div>
                        
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            <span>Arrivée: {new Date(visitor.checkInTime).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}</span>
                            <span className="text-blue-600 font-medium">({duration})</span>
                          </div>
                          
                          <div className="flex items-center gap-1.5">
                            <Tag className="h-3.5 w-3.5" />
                            <span>Badge: {visitor.badgeNumber}</span>
                          </div>
                          
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5" />
                            <span>{visitor.serviceRequested}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onViewVisitor) onViewVisitor(visitor);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 bg-gray-50 border-t border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <h5 className="font-medium text-gray-700">Informations de visite</h5>
                        
                        <div className="bg-white p-3 rounded-lg border border-gray-200 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Service demandé:</span>
                            <span className="font-medium text-gray-900">{visitor.serviceRequested}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Personne à voir:</span>
                            <span className="font-medium text-gray-900">{visitor.employeeToVisit}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Département:</span>
                            <span className="font-medium text-gray-900">{visitor.department}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Durée prévue:</span>
                            <span className="font-medium text-gray-900">{visitor.expectedDuration} min</span>
                          </div>
                          {visitor.company && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Entreprise:</span>
                              <span className="font-medium text-gray-900">{visitor.company}</span>
                            </div>
                          )}
                        </div>
                        
                        {appointment && (
                          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="h-4 w-4 text-blue-600" />
                              <h5 className="font-medium text-blue-800">Détails du rendez-vous</h5>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-blue-700">Référence:</span>
                                <span className="font-medium text-blue-900">{appointment.id}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-blue-700">Date prévue:</span>
                                <span className="font-medium text-blue-900">
                                  {new Date(appointment.date).toLocaleDateString('fr-FR')}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-blue-700">Heure prévue:</span>
                                <span className="font-medium text-blue-900">{appointment.time}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-blue-700">Agent assigné:</span>
                                <span className="font-medium text-blue-900">{appointment.agent}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        <h5 className="font-medium text-gray-700">Suivi et Actions</h5>
                        
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="text-sm">
                                <span className="text-gray-600">Arrivée: </span>
                                <span className="font-medium text-gray-900 ml-2">
                                  {new Date(visitor.checkInTime).toLocaleTimeString('fr-FR', {
                                    hour: '2-digit', 
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>
                              
                              <div className="text-sm">
                                <span className="text-gray-600">Durée:</span>
                                <span className="font-medium text-blue-700 ml-2">{duration}</span>
                              </div>
                            </div>
                            
                            <div className="text-sm">
                              <span className="text-gray-600">Départ estimé: </span>
                              <span className="font-medium text-gray-900 ml-2">
                                {(() => {
                                  const checkIn = new Date(visitor.checkInTime);
                                  const durationMins = parseInt(visitor.expectedDuration);
                                  const estimated = new Date(checkIn.getTime() + durationMins * 60000);
                                  return estimated.toLocaleTimeString('fr-FR', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  });
                                })()}
                              </span>
                            </div>
                            
                            {visitor.badgeNumber && (
                              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                <div className="flex items-center gap-2 mb-1">
                                  <QrCode className="h-4 w-4 text-blue-600" />
                                  <span className="text-sm font-medium text-blue-800">Badge Visiteur</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <div className="text-blue-700 text-sm">
                                    {visitor.badgeNumber}
                                  </div>
                                  <button className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                                    Détails
                                  </button>
                                </div>
                              </div>
                            )}
                            
                          </div>
                          
                          <div className="mt-4 space-y-2">
                            <button className="w-full px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 text-sm">
                              <CheckCircle className="h-4 w-4" />
                              Marquer comme terminé
                            </button>
                            
                            <button className="w-full px-3 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 flex items-center justify-center gap-2 text-sm"
                              onClick={() => onViewVisitor(visitor)}>
                              <Eye className="h-4 w-4" />
                              Voir les détails
                            </button>
                            
                            <button className="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 text-sm">
                              <AlertTriangle className="h-4 w-4" />
                              Signaler un problème
                            </button>
                            
                            <button 
                              onClick={() => onEditVisitor(visitor)}
                              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            
                            {visitor.status === 'present' && (
                              <button 
                                onClick={() => onCheckoutVisitor(visitor)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                            )}
                            
                            <button 
                              onClick={() => onDeleteVisitor(visitor)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <User className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun visiteur trouvé</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {searchTerm 
                ? "Aucun visiteur ne correspond à votre recherche." 
                : statusFilter !== 'all'
                  ? "Aucun visiteur avec ce statut actuellement."
                  : "Il n'y a actuellement aucun visiteur enregistré."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};