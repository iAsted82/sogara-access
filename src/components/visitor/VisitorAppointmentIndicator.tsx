import React from 'react';
import { Calendar, CheckCircle, Clock, AlertTriangle, XCircle, User } from 'lucide-react';
import { Appointment } from '../../types/appointment';
import { isAppointmentToday, formatAppointmentTime } from '../../utils/appointmentHelpers';

interface VisitorAppointmentIndicatorProps {
  appointment: Appointment | null;
  className?: string;
  compact?: boolean;
}

export const VisitorAppointmentIndicator: React.FC<VisitorAppointmentIndicatorProps> = ({ 
  appointment,
  className = '',
  compact = false
}) => {
  if (!appointment) return null;
  
  const todayCheck = isAppointmentToday(appointment);
  
  // Status indicator
  const getStatusIndicator = () => {
    switch (appointment.status) {
      case 'pending':
        return {
          color: 'bg-yellow-100 text-yellow-800',
          icon: Clock,
          label: 'En attente'
        };
      case 'confirmed':
        return {
          color: 'bg-green-100 text-green-800',
          icon: CheckCircle,
          label: 'Confirmé'
        };
      case 'arrived':
        return {
          color: 'bg-blue-100 text-blue-800',
          icon: User,
          label: 'Présent'
        };
      case 'completed':
        return {
          color: 'bg-indigo-100 text-indigo-800',
          icon: CheckCircle,
          label: 'Terminé'
        };
      case 'cancelled':
        return {
          color: 'bg-red-100 text-red-800',
          icon: XCircle,
          label: 'Annulé'
        };
      case 'no_show':
        return {
          color: 'bg-orange-100 text-orange-800',
          icon: AlertTriangle,
          label: 'Absent'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: Clock,
          label: 'Indéfini'
        };
    }
  };
  
  const status = getStatusIndicator();
  const StatusIcon = status.icon;
  
  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className={`px-2 py-1 rounded-full ${status.color} flex items-center gap-1`}>
          <StatusIcon className="h-3 w-3" />
          <span className="text-xs font-medium">RDV</span>
        </div>
        {todayCheck && (
          <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
            Aujourd'hui
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Calendar className="h-4 w-4 text-blue-600" />
      
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium whitespace-nowrap">RDV</span>
        <div className={`px-2 py-1 rounded-full ${status.color} text-xs font-medium`}>
          {status.label}
        </div>
        
        <div className="text-sm text-gray-700">
          RDV {todayCheck ? "aujourd'hui" : new Date(appointment.date).toLocaleDateString('fr-FR')} à {formatAppointmentTime(appointment.time)}
        </div>
        
        {appointment.priority === 'urgent' && (
          <div className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
            URGENT
          </div>
        )}
        
        {appointment.priority === 'high' && (
          <div className="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full">
            Prioritaire
          </div>
        )}
      </div>
      
      {todayCheck && (
        <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
          Aujourd'hui
        </div>
      )}
    </div>
  );
};