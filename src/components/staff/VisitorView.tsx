import React from 'react';
import { Users, Clock, Building2, Phone, Mail, MapPin } from 'lucide-react';
import { StaffMember } from '../../types/staff';

interface VisitorViewProps {
  staff: StaffMember[];
}

export const VisitorView: React.FC<VisitorViewProps> = ({ staff }) => {
  // Organiser le personnel par département pour les visiteurs
  const staffByDepartment = staff.reduce((acc, member) => {
    if (!acc[member.department]) {
      acc[member.department] = [];
    }
    acc[member.department].push(member);
    return acc;
  }, {} as Record<string, StaffMember[]>);

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 bg-green-50 border-b border-green-200">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-green-600" />
          <h3 className="font-medium text-green-900">Annuaire du Personnel</h3>
        </div>
        <p className="text-sm text-green-700 mt-1">
          Vue destinée aux visiteurs pour trouver les contacts
        </p>
      </div>

      <div className="p-6">
        <div className="space-y-6">
          {Object.entries(staffByDepartment).map(([department, members]) => (
            <div key={department} className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                <Building2 className="h-5 w-5 text-blue-600" />
                <h4 className="font-semibold text-gray-900">{department}</h4>
                <span className="text-sm text-gray-500">({members.length})</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {members
                  .filter(member => member.isAvailable) // Seulement les disponibles pour les visiteurs
                  .map(member => (
                    <div
                      key={member.id}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
                          {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h5 className="font-medium text-gray-900">
                            {member.firstName} {member.lastName}
                          </h5>
                          <p className="text-sm text-gray-600 mb-2">{member.function}</p>
                          
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Phone className="h-3 w-3" />
                              <span>Poste {member.internalPhone}</span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-gray-600">
                              <Mail className="h-3 w-3" />
                              <span className="truncate">{member.email}</span>
                            </div>
                            
                            {member.location && (
                              <div className="flex items-center gap-2 text-gray-600">
                                <MapPin className="h-3 w-3" />
                                <span className="truncate">{member.location}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="mt-2 flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-green-600 font-medium">Disponible</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Personnel absent */}
              {members.filter(member => !member.isAvailable).length > 0 && (
                <div className="mt-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">
                    Personnel actuellement absent ({members.filter(member => !member.isAvailable).length})
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {members
                      .filter(member => !member.isAvailable)
                      .map(member => (
                        <div
                          key={member.id}
                          className="bg-red-50 rounded-lg p-3 border border-red-200"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-medium text-sm">
                              {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm">
                                {member.firstName} {member.lastName}
                              </p>
                              <p className="text-xs text-gray-600">{member.function}</p>
                              {member.absenceReason && (
                                <p className="text-xs text-red-600 mt-1">
                                  {member.absenceReason}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Information pour les visiteurs */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Information pour les visiteurs</h4>
              <p className="text-sm text-blue-800 mt-1">
                Cet annuaire présente le personnel actuellement disponible. 
                Pour prendre rendez-vous ou obtenir des informations, 
                contactez la réception au <strong>+241 01 XX XX XX</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};