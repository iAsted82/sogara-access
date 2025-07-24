import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, AlertTriangle, Clock, Search, User, MapPin, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { Appointment } from '../../types/appointment';
import { verifyVisitorAppointment, isAppointmentToday, getAppointmentStatusColor, formatAppointmentTime } from '../../utils/appointmentHelpers';

interface AppointmentVerificationPanelProps {
  appointments: Appointment[];
  visitorName: string;
  phoneNumber?: string;
  email?: string;
  onAppointmentSelected: (appointment: Appointment) => void;
  className?: string;
}

export const AppointmentVerificationPanel: React.FC<AppointmentVerificationPanelProps> = ({
  appointments,
  visitorName,
  phoneNumber,
  email,
  onAppointmentSelected,
  className = ''
}) => {
  const [searchResults, setSearchResults] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'none' | 'exact' | 'partial' | 'searching'>('searching');
  const [isExpanded, setIsExpanded] = useState(true);
  const [expandedAppointment, setExpandedAppointment] = useState<string | null>(null);

  // Perform verification when visitor name changes or component mounts
  useEffect(() => {
    if (!visitorName.trim()) {
      setSearchResults([]);
      setVerificationStatus('none');
      return;
    }
    
    // Verify appointment
    const result = verifyVisitorAppointment(appointments, visitorName, phoneNumber, email);
    
    setSearchResults(result.appointments);
    setVerificationStatus(result.matchType);
    
    // If exact match found, select it automatically
    if (result.matchType === 'exact' && result.exactMatch) {
      setSelectedAppointment(result.exactMatch);
      setExpandedAppointment(result.exactMatch.id);
      onAppointmentSelected(result.exactMatch);
    } else if (result.appointments.length === 1) {
      // If only one match, select it
      setSelectedAppointment(result.appointments[0]);
      setExpandedAppointment(result.appointments[0].id);
      onAppointmentSelected(result.appointments[0]);
    } else {
      setSelectedAppointment(null);
    }
  }, [visitorName, phoneNumber, email, appointments, onAppointmentSelected]);

  // No appointments found, show empty state
  if (verificationStatus === 'none' || searchResults.length === 0) {
    return (
      <div className={`bg-gray-50 border border-gray-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            <h3 className="font-medium text-gray-700">Vérification des Rendez-vous</h3>
          </div>
          {isExpanded ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
        </div>
        
        {isExpanded && (
          <div className="mt-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">Aucun rendez-vous trouvé</h4>
                  <p className="text-sm text-yellow-700 mt-1">Ce visiteur n'a pas de rendez-vous enregistré dans le système.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Search className="h-4 w-4" />
                  <span>Recherche effectuée pour: </span>
                  <span className="font-medium text-gray-900">{visitorName}</span>
                </div>
              </div>
              
              <button 
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center gap-1.5"
                onClick={() => alert("Création de rendez-vous")}
              >
                <Calendar className="h-4 w-4" />
                Créer un RDV
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Sort results: today's appointments first, then by time
  const sortedResults = [...searchResults].sort((a, b) => {
    const aIsToday = isAppointmentToday(a);
    const bIsToday = isAppointmentToday(b);
    
    // Today's appointments first
    if (aIsToday && !bIsToday) return -1;
    if (!aIsToday && bIsToday) return 1;
    
    // If same day, sort by time
    return a.time.localeCompare(b.time);
  });

  return (
    <div className={`bg-white border border-gray-200 rounded-lg ${className} overflow-hidden shadow-sm`}>
      <div 
        className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          <h3 className="font-medium text-blue-900">
            {verificationStatus === 'exact' ? 'Rendez-vous vérifié' : 'Rendez-vous possible'}
          </h3>
          
          <div className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
            verificationStatus === 'exact' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {verificationStatus === 'exact' ? 'Correspondance exacte' : 'Correspondance partielle'}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="text-sm text-blue-700 font-medium">
            {searchResults.length} {searchResults.length > 1 ? 'rendez-vous trouvés' : 'rendez-vous trouvé'}
          </div>
          {isExpanded ? <ChevronUp className="h-5 w-5 text-blue-600" /> : <ChevronDown className="h-5 w-5 text-blue-600" />}
        </div>
      </div>
      
      {isExpanded && (
        <div className="divide-y divide-gray-100">
          {/* Verification Status Banner */}
          {verificationStatus === 'exact' ? (
            <div className="bg-green-50 p-4 border-b border-green-200">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-green-800">Rendez-vous confirmé</h4>
                  <p className="text-sm text-green-700 mt-0.5">
                    Ce visiteur a un rendez-vous programmé. Les informations ont été automatiquement pré-remplies.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 p-4 border-b border-blue-200">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-800">Correspondance possible trouvée</h4>
                  <p className="text-sm text-blue-700 mt-0.5">
                    {searchResults.length > 1 
                      ? 'Plusieurs rendez-vous possibles ont été trouvés. Veuillez sélectionner le rendez-vous correct.'
                      : 'Un rendez-vous possible a été trouvé. Veuillez vérifier les informations.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Appointment List */}
          <div className="max-h-72 overflow-y-auto">
            {sortedResults.map((appointment) => {
              const isToday = isAppointmentToday(appointment);
              const isSelected = selectedAppointment?.id === appointment.id;
              const isItemExpanded = expandedAppointment === appointment.id;
              
              return (
                <div 
                  key={appointment.id} 
                  className={`border-l-4 ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-transparent hover:bg-gray-50'} transition-colors`}
                >
                  <div 
                    className="p-4 cursor-pointer"
                    onClick={() => {
                      setSelectedAppointment(appointment);
                      setExpandedAppointment(isItemExpanded ? null : appointment.id);
                      onAppointmentSelected(appointment);
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{appointment.citizenName}</span>
                            {isToday && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                Aujourd'hui
                              </span>
                            )}
                          </div>
                          
                          <div className="text-sm text-gray-600 mt-1">{appointment.purpose}</div>
                          
                          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{appointment.time} ({appointment.duration} min)</span>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>{appointment.service}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getAppointmentStatusColor(appointment.status)}`}>
                          {appointment.status === 'pending' ? 'En attente' : 
                          appointment.status === 'confirmed' ? 'Confirmé' : 
                          appointment.status === 'arrived' ? 'Présent' : 
                          appointment.status === 'completed' ? 'Terminé' : 
                          appointment.status === 'cancelled' ? 'Annulé' : 'Absent'}
                        </div>
                        
                        {isItemExpanded ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
                      </div>
                    </div>
                  </div>
                  
                  {isItemExpanded && (
                    <div className="px-4 pb-4 text-sm">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <h5 className="font-medium text-gray-900">Informations du rendez-vous</h5>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-500">ID:</span>
                              <span className="font-medium text-gray-900">{appointment.id}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Date:</span>
                              <span className="font-medium text-gray-900">
                                {new Date(appointment.date).toLocaleDateString('fr-FR')}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Heure:</span>
                              <span className="font-medium text-gray-900">{appointment.time}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Téléphone:</span>
                              <span className="font-medium text-gray-900">{appointment.citizenPhone}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Agent assigné:</span>
                              <span className="font-medium text-gray-900">{appointment.agent}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <h5 className="font-medium text-gray-900">Détails</h5>
                          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                            <div className="flex items-start gap-2">
                              <FileText className="h-4 w-4 text-gray-500 mt-0.5" />
                              <div className="flex-1">
                                <div className="font-medium text-gray-900 mb-1">Motif:</div>
                                <p className="text-gray-700">{appointment.purpose}</p>
                              </div>
                            </div>
                          </div>
                          
                          {appointment.notes && (
                            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                              <div className="flex items-start gap-2">
                                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900 mb-1">Notes:</div>
                                  <p className="text-gray-700">{appointment.notes}</p>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAppointment(appointment);
                              onAppointmentSelected(appointment);
                            }}
                            className="w-full px-4 py-2 mt-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center justify-center gap-2"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Utiliser ce rendez-vous
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer with helpful info */}
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-sm text-gray-500 flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>
                  {selectedAppointment 
                    ? 'Rendez-vous sélectionné. Les informations ont été pré-remplies.' 
                    : 'Sélectionnez un rendez-vous pour pré-remplir le formulaire.'}
                </span>
              </div>
              
              <button 
                className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm flex items-center gap-1.5"
                onClick={() => setSelectedAppointment(null)}
              >
                <Clock className="h-4 w-4" />
                Vider la sélection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};