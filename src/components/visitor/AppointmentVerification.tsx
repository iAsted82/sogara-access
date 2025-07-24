import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, User, Clock, MapPin, Info, AlertTriangle } from 'lucide-react';
import { Appointment } from '../../types/appointment';
import { AppointmentVerificationResult, isAppointmentToday, getAppointmentStatusColor, formatAppointmentTime } from '../../utils/appointmentHelpers';

interface AppointmentVerificationProps {
  verificationResult: AppointmentVerificationResult;
  onSelectAppointment?: (appointment: Appointment) => void;
  className?: string;
}

export const AppointmentVerification: React.FC<AppointmentVerificationProps> = ({ 
  verificationResult,
  onSelectAppointment,
  className = ''
}) => {
  const { isExpected, appointments, matchType, exactMatch } = verificationResult;
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  
  // Initialize with exact match if available
  useEffect(() => {
    if (exactMatch) {
      setSelectedAppointment(exactMatch);
      if (onSelectAppointment) {
        onSelectAppointment(exactMatch);
      }
    } else if (appointments.length === 1) {
      setSelectedAppointment(appointments[0]);
      if (onSelectAppointment) {
        onSelectAppointment(appointments[0]);
      }
    }
  }, [exactMatch, appointments, onSelectAppointment]);
  
  if (!isExpected || appointments.length === 0) {
    return (
      <div className={`bg-yellow-50 border border-yellow-200 rounded-xl p-4 ${className}`}>
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-yellow-800">Aucune visite prévue trouvée</h3>
            <p className="text-sm text-yellow-700 mt-1">
              Ce visiteur n'a pas de visite prévue enregistrée dans le système.
            </p>
            <p className="text-sm text-yellow-700 mt-1">
              Procédez à l'enregistrement standard et demandez si un rendez-vous a été pris.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  // Determine if we have multiple matches
  const hasMultipleMatches = appointments.length > 1;
  
  // Sort appointments by date/time (today's appointments first)
  const sortedAppointments = [...appointments].sort((a, b) => {
    // Sort by date first
    const aIsToday = isAppointmentToday(a);
    const bIsToday = isAppointmentToday(b);
    
    if (aIsToday && !bIsToday) return -1;
    if (!aIsToday && bIsToday) return 1;
    
    // If same day, sort by time
    return `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`);
  });
  
  return (
    <div className={`${className}`}>
      {matchType === 'exact' ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-green-800">Visite prévue confirmée</h3>
              <p className="text-sm text-green-700 mt-1">
                Ce visiteur a une visite prévue {isAppointmentToday(exactMatch as Appointment) ? "aujourd'hui" : "prochainement"}.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-blue-800">Correspondance possible</h3>
              <p className="text-sm text-blue-700 mt-1">
                {hasMultipleMatches 
                  ? `${appointments.length} visites prévues possibles trouvées pour ce visiteur.` 
                  : "Une visite prévue possible a été trouvée pour ce visiteur."}
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-medium text-gray-900 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-600" />
            {hasMultipleMatches ? 'Visites prévues possibles' : 'Détails de la visite prévue'}
          </h3>
        </div>
        
        <div className="divide-y divide-gray-100">
          {sortedAppointments.map(appointment => {
            const isToday = isAppointmentToday(appointment);
            const isSelected = selectedAppointment?.id === appointment.id;
            
            return (
              <div 
                key={appointment.id}
                onClick={() => {
                  setSelectedAppointment(appointment);
                  if (onSelectAppointment) {
                    onSelectAppointment(appointment);
                  }
                }}
                className={`p-4 cursor-pointer transition-colors ${
                  isSelected 
                    ? 'bg-blue-50 border-l-4 border-blue-500' 
                    : 'hover:bg-gray-50 border-l-4 border-transparent'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <div className={`px-3 py-1.5 rounded-lg ${getAppointmentStatusColor(appointment.status)} text-sm font-medium mt-1`}>
                      {formatAppointmentTime(appointment.time)}
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-1.5">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="font-medium text-gray-900">{appointment.citizenName}</span>
                        {isToday && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                            Aujourd'hui
                          </span>
                        )}
                      </div>
                      
                      <div className="mt-1.5 text-sm text-gray-600">
                        <div className="flex items-center gap-1.5 mt-1">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span>{appointment.duration} minutes</span>
                        </div>
                        
                        <div className="flex items-center gap-1.5 mt-1">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          <span>{appointment.service}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      getAppointmentStatusColor(appointment.status)
                    }`}>
                      {appointment.status === 'pending' ? 'En attente' :
                       appointment.status === 'confirmed' ? 'Confirmé' :
                       appointment.status === 'arrived' ? 'Présent' :
                       appointment.status === 'completed' ? 'Terminé' :
                       appointment.status === 'cancelled' ? 'Annulé' :
                       appointment.status === 'no_show' ? 'Absent' : appointment.status}
                    </div>
                    
                    {appointment.priority === 'urgent' && (
                      <div className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full mt-1">URGENT</div>
                    )}
                    {appointment.priority === 'high' && (
                      <div className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full mt-1">Prioritaire</div>
                    )}
                  </div>
                </div>
                
                {isSelected && (
                  <div className="mt-3 text-sm text-gray-600">
                    <div className="bg-gray-50 rounded-lg p-3 mt-2">
                      <div className="font-medium text-gray-900 mb-1">Motif de la visite prévue:</div>
                      <p>{appointment.purpose}</p>
                    </div>
                    
                    {appointment.notes && (
                      <div className="bg-yellow-50 rounded-lg p-3 mt-2">
                        <div className="font-medium text-gray-900 mb-1">Notes:</div>
                        <p>{appointment.notes}</p>
                      </div>
                    )}
                    
                    <div className="mt-2 font-medium">
                      Agent assigné: {appointment.agent}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};