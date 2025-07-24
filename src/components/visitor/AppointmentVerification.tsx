import React from 'react';
import { Calendar, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { Appointment } from '../../types/appointment';
import { AppointmentVerificationResult } from '../../utils/appointmentHelpers';

interface AppointmentVerificationProps {
  verificationResult: AppointmentVerificationResult;
  onSelectAppointment: (appointment: Appointment) => void;
}

export const AppointmentVerification: React.FC<AppointmentVerificationProps> = ({
  verificationResult,
  onSelectAppointment
}) => {
  if (!verificationResult.isExpected) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-gray-600">
          <AlertTriangle className="h-5 w-5" />
          <span className="text-sm">Aucun rendez-vous trouvé</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <CheckCircle className="h-5 w-5 text-green-600" />
        <span className="text-sm font-medium text-green-800">
          {verificationResult.matchType === 'exact' ? 'Rendez-vous confirmé' : 'Rendez-vous similaires trouvés'}
        </span>
      </div>
      
      <div className="space-y-2">
        {verificationResult.appointments.map(appointment => (
          <div
            key={appointment.id}
            className="bg-white border border-green-200 rounded p-3 cursor-pointer hover:bg-green-50"
            onClick={() => onSelectAppointment(appointment)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{appointment.citizenName}</p>
                <p className="text-sm text-gray-600">{appointment.purpose}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Clock className="h-3 w-3" />
                  <span>{appointment.time}</span>
                </div>
                <p className="text-xs text-gray-500">{appointment.service}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};