import React, { useState } from 'react';
import { Calendar, Clock, User, Plus } from 'lucide-react';
import { appointmentsData } from '../../data/appointmentsData';

export const VisitPlanningTab: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const todayAppointments = appointmentsData.filter(apt => 
    apt.date === selectedDate
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Planification des Visites</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle visite
        </button>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date sélectionnée
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900">
            Visites prévues ({todayAppointments.length})
          </h3>
          
          {todayAppointments.length > 0 ? (
            <div className="space-y-2">
              {todayAppointments.map(appointment => (
                <div key={appointment.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <div className="flex-1">
                    <p className="font-medium">{appointment.citizenName}</p>
                    <p className="text-sm text-gray-600">{appointment.purpose}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{appointment.time}</p>
                    <p className="text-xs text-gray-500">{appointment.service}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">Aucune visite prévue pour cette date</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};