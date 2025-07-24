import React from 'react';
import { Calendar, Clock, CheckCircle } from 'lucide-react';
import { Appointment } from '../../types/appointment';

interface VisitorAppointmentIndicatorProps {
  appointment: Appointment;
  compact?: boolean;
}

export const VisitorAppointmentIndicator: React.FC<VisitorAppointmentIndicatorProps> = ({
  appointment,
  compact = false
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'arrived': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (compact) {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
        <Calendar className="h-3 w-3" />
        RDV
      </span>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-2">
        <Calendar className="h-4 w-4 text-blue-600" />
        <span className="text-sm font-medium text-blue-800">Rendez-vous confirmé</span>
      </div>
      <div className="space-y-1 text-sm text-blue-700">
        <div className="flex items-center gap-2">
          <Clock className="h-3 w-3" />
          <span>{appointment.time} - {appointment.duration} min</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="h-3 w-3" />
          <span>Agent: {appointment.agent}</span>
        </div>
      </div>
    </div>
  );
};