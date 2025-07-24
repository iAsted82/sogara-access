import React, { useState } from 'react';
import { 
  User, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Search, 
  Phone, 
  Mail, 
  Building2, 
  MapPin 
} from 'lucide-react';
import { StaffMember } from '../../types/staff';
import { getTimeSinceLastSeen } from '../../utils/staffUtils';

interface VisitorViewProps {
  staff: StaffMember[];
  className?: string;
}

export const VisitorView: React.FC<VisitorViewProps> = ({ staff, className = '' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  
  // Filter staff based on search term and department
  const filteredStaff = staff.filter(member => {
    const matchesSearch = 
      member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.function.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = filterDepartment === 'all' || member.department === filterDepartment;
    
    return matchesSearch && matchesDepartment;
  });
  
  // Get all departments
  const departments = Array.from(new Set(staff.map(member => member.department))).sort();
  
  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 bg-blue-50 border-b border-blue-200">
        <h2 className="text-xl font-semibold text-blue-900 mb-2">Disponibilité du Personnel</h2>
        <p className="text-blue-700 text-sm">
          Consultez la disponibilité du personnel en temps réel
        </p>
      </div>
      
      {/* Search and Filter */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom ou fonction..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="md:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous les services</option>
            {departments.map((department, index) => (
              <option key={index} value={department}>{department}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Staff List for Visitors */}
      <div className="max-h-[600px] overflow-y-auto">
        <div className="divide-y divide-gray-200">
          {filteredStaff.length > 0 ? (
            filteredStaff.map((member) => (
              <div key={member.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4">
                  {/* Staff Photo/Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gray-200">
                      {member.avatar ? (
                        <img src={member.avatar} alt={`${member.firstName} ${member.lastName}`} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <User className="h-8 w-8 text-gray-500" />
                        </div>
                      )}
                    </div>
                    <div className="mt-2 flex justify-center">
                      {member.isAvailable ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          <CheckCircle className="h-3 w-3" />
                          Disponible
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                          <XCircle className="h-3 w-3" />
                          Indisponible
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Staff Info */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{member.firstName} {member.lastName}</h3>
                    <p className="text-gray-700">{member.function}</p>
                    
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Building2 className="h-4 w-4 text-gray-400 mr-2" />
                        {member.department}
                      </div>
                      
                      {member.location && (
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                          {member.location}
                        </div>
                      )}
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 text-gray-400 mr-2" />
                        {member.internalPhone}
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-4 w-4 text-gray-400 mr-2" />
                        <a href={`mailto:${member.email}`} className="text-blue-600 hover:underline">{member.email}</a>
                      </div>
                    </div>
                  </div>
                  
                  {/* Availability Status */}
                  <div className="flex-shrink-0 text-right">
                    {!member.isAvailable && (
                      <div className="bg-red-50 border border-red-100 rounded-lg p-3 max-w-xs">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="h-4 w-4 text-red-600" />
                          <span className="text-sm font-medium text-red-900">Absence</span>
                        </div>
                        
                        {member.absenceReason && (
                          <p className="text-sm text-red-800 mb-1">
                            <span className="font-medium">Motif:</span> {member.absenceReason}
                          </p>
                        )}
                        
                        {member.absenceDuration && (
                          <p className="text-sm text-red-800 mb-1">
                            <span className="font-medium">Durée:</span> {member.absenceDuration}
                          </p>
                        )}
                        
                        {member.expectedReturnDate && (
                          <p className="text-sm text-red-800 mb-1">
                            <span className="font-medium">Retour prévu:</span> {new Date(member.expectedReturnDate).toLocaleDateString('fr-FR')}
                          </p>
                        )}
                        
                        <p className="text-xs text-red-700 mt-2">
                          Dernière mise à jour: {getTimeSinceLastSeen(member.lastSeen)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Languages and Skills */}
                {(member.languages || member.skills) && (
                  <div className="mt-3 ml-16">
                    <div className="flex flex-wrap gap-2">
                      {member.languages && member.languages.map((language, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {language}
                        </span>
                      ))}
                      
                      {member.skills && member.skills.map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <User className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Aucun personnel trouvé</h3>
              <p className="text-gray-600 mt-1 max-w-md mx-auto">
                {searchTerm || filterDepartment !== 'all'
                  ? "Aucun membre du personnel ne correspond à vos critères de recherche."
                  : "Aucun membre du personnel n'est enregistré dans le système."}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <div className="p-4 bg-gray-50 border-t border-gray-200 text-sm text-center text-gray-500">
        Statut mis à jour en temps réel • {new Date().toLocaleDateString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
};