import React, { useState } from 'react';
import { Calendar, Clock, User, Users, CheckCircle, XCircle } from 'lucide-react';
import { StaffMember } from '../../types/staff';

interface StaffPlanningProps {
  staff: StaffMember[];
  onUpdateAvailability: (staff: StaffMember) => void;
}

export const StaffPlanning: React.FC<StaffPlanningProps> = ({ 
  staff, 
  onUpdateAvailability 
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');

  // Grouper le personnel par département
  const staffByDepartment = staff.reduce((acc, member) => {
    if (!acc[member.department]) {
      acc[member.department] = [];
    }
    acc[member.department].push(member);
    return acc;
  }, {} as Record<string, StaffMember[]>);

  // Horaires de travail par défaut
  const workingHours = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-blue-50 border-b border-blue-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-blue-900">Planning du Personnel</h3>
            <p className="text-sm text-blue-700">Vue d'ensemble des disponibilités</p>
          </div>
          
          <div className="flex items-center gap-3">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('day')}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  viewMode === 'day' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600'
                }`}
              >
                Jour
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  viewMode === 'week' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600'
                }`}
              >
                Semaine
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Vue planning */}
      <div className="p-4">
        {viewMode === 'day' && (
          <div className="space-y-6">
            {Object.entries(staffByDepartment).map(([department, members]) => (
              <div key={department} className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  {department}
                  <span className="text-sm text-gray-500">({members.length})</span>
                </h4>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {members.map(member => (
                    <div key={member.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {member.firstName} {member.lastName}
                            </p>
                            <p className="text-sm text-gray-600">{member.function}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            member.isAvailable 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {member.isAvailable ? (
                              <>
                                <CheckCircle className="h-3 w-3" />
                                Disponible
                              </>
                            ) : (
                              <>
                                <XCircle className="h-3 w-3" />
                                Absent
                              </>
                            )}
                          </span>
                          
                          <button
                            onClick={() => onUpdateAvailability(member)}
                            className={`px-3 py-1 rounded text-xs font-medium ${
                              member.isAvailable
                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            {member.isAvailable ? 'Marquer absent' : 'Marquer présent'}
                          </button>
                        </div>
                      </div>
                      
                      {/* Horaires de travail */}
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">Horaires prévus:</p>
                        <div className="grid grid-cols-5 gap-1">
                          {workingHours.map(hour => (
                            <div
                              key={hour}
                              className={`text-center py-1 px-2 rounded text-xs ${
                                member.isAvailable 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-500'
                              }`}
                            >
                              {hour}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {!member.isAvailable && member.absenceReason && (
                        <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded">
                          <p className="text-sm text-orange-800">
                            <strong>Motif:</strong> {member.absenceReason}
                          </p>
                          {member.expectedReturnDate && (
                            <p className="text-sm text-orange-700 mt-1">
                              <strong>Retour prévu:</strong> {new Date(member.expectedReturnDate).toLocaleDateString('fr-FR')}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {viewMode === 'week' && (
          <div className="space-y-4">
            <div className="grid grid-cols-8 gap-2 text-sm font-medium text-gray-700">
              <div>Personnel</div>
              <div>Lun</div>
              <div>Mar</div>
              <div>Mer</div>
              <div>Jeu</div>
              <div>Ven</div>
              <div>Sam</div>
              <div>Dim</div>
            </div>
            
            {staff.map(member => (
              <div key={member.id} className="grid grid-cols-8 gap-2 py-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-blue-600">
                      {member.firstName.charAt(0)}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {member.firstName} {member.lastName}
                  </span>
                </div>
                
                {/* Jours de la semaine */}
                {[1, 2, 3, 4, 5, 6, 0].map(day => (
                  <div
                    key={day}
                    className={`text-center py-2 rounded text-xs ${
                      member.isAvailable 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {member.isAvailable ? '✓' : '✗'}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Résumé */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{staff.length}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">
              {staff.filter(s => s.isAvailable).length}
            </div>
            <div className="text-sm text-gray-600">Présents</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-red-600">
              {staff.filter(s => !s.isAvailable).length}
            </div>
            <div className="text-sm text-gray-600">Absents</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">
              {Math.round((staff.filter(s => s.isAvailable).length / staff.length) * 100)}%
            </div>
            <div className="text-sm text-gray-600">Disponibilité</div>
          </div>
        </div>
      </div>
    </div>
  );
};