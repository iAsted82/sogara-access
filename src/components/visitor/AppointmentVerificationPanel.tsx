import React from 'react';
import { Calendar, Clock, User } from 'lucide-react';
import { Appointment } from '../../types/appointment';

interface AppointmentVerificationPanelProps {
  appointments: Appointment[];
  visitorName: string;
  phoneNumber: string;
  email: string;
  onAppointmentSelected: (appointment: Appointment) => void;
}

export const AppointmentVerificationPanel: React.FC<AppointmentVerificationPanelProps> = ({
  appointments,
  visitorName,
  phoneNumber,
  email,
  onAppointmentSelected
}) => {
  const matchingAppointments = appointments.filter(apt =>
    apt.citizenName.toLowerCase().includes(visitorName.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Calendar className="h-5 w-5 text-blue-600" />
        Vérification des Rendez-vous
      </h3>
      
      {matchingAppointments.length > 0 ? (
        <div className="space-y-3">
          {matchingAppointments.map(appointment => (
            <div
              key={appointment.id}
              className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
              onClick={() => onAppointmentSelected(appointment)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{appointment.citizenName}</p>
                  <p className="text-sm text-gray-600">{appointment.purpose}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{appointment.time}</p>
                  <p className="text-xs text-gray-500">{appointment.service}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <User className="h-12 w-12 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500">Aucun rendez-vous trouvé</p>
        </div>
      )}
    </div>
  );
};