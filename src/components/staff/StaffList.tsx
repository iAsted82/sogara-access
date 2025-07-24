import React, { useState } from 'react';
import { StaffMember } from '../../types/staff';
import { 
  User, Phone, Mail, CheckCircle, XCircle, Clock, Edit, Trash2, AlarmClock,
  Eye, Building2, MapPin, MoreVertical, UserCheck, UserX, X, Filter, Users, MessageSquare
} from 'lucide-react';
import { getTimeSinceLastSeen } from '../../utils/staffUtils';

interface StaffListProps {
  staffMembers: StaffMember[];
  onView: (staffMember: StaffMember) => void;
  onEdit: (staffMember: StaffMember) => void;
  onDelete: (staffMember: StaffMember) => void;
  onToggleAvailability: (staffMember: StaffMember) => void;
  onViewChange?: () => void;
  currentView?: 'list' | 'planning';
  className?: string;
}

export const StaffList: React.FC<StaffListProps> = ({
  staffMembers,
  onView,
  onEdit,
  onDelete,
  onToggleAvailability,
  onViewChange,
  currentView = 'list',
  className = ''
}) => {
  // Ajouter une option de filtrage avancé
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden ${className}`}>
      {/* Table header */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            <h3 className="font-medium text-gray-900">Personnel DGDI</h3>
            <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full ml-2">
              {staffMembers.length} {staffMembers.length > 1 ? 'membres' : 'membre'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={onViewChange} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center gap-2">
              {currentView === 'list' ? 'Vue Planning' : 'Vue Liste'}
            </button>
          
          <button
            onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm"
          >
            <Filter className="h-4 w-4" />
            {showAdvancedFilter ? 'Masquer les filtres avancés' : 'Filtres avancés'}
          </button>
          </div>
        </div>
        
        {showAdvancedFilter && (
          <div className="mt-4 pt-3 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">Statut</label>
              <select 
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg"
                onChange={(e) => {
                  if (e.target.value === 'available') {
                    // Filter to only available staff
                    const availableStaff = staffMembers.filter(s => s.isAvailable);
                    // Update filtered staff in parent component
                    // This would need a callback to the parent component
                  } else if (e.target.value === 'unavailable') {
                    // Filter to only unavailable staff
                    const unavailableStaff = staffMembers.filter(s => !s.isAvailable);
                    // Update filtered staff in parent component
                  }
                }}
              >
                <option value="all">Tous</option>
                <option value="available">Disponibles uniquement</option>
                <option value="unavailable">Indisponibles uniquement</option>
              </select>
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">Trier par</label>
              <select 
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg"
                onChange={(e) => {
                  // Implement sorting logic
                  // This would need a callback to the parent component
                }}
              >
                <option value="name">Nom</option>
                <option value="department">Département</option>
                <option value="function">Fonction</option>
                <option value="lastSeen">Dernière activité</option>
              </select>
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">Localisation</label>
              <select 
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg"
                onChange={(e) => {
                  // Filter by location
                  // This would need a callback to the parent component
                }}
              >
                <option value="all">Toutes</option>
                <option value="batimentA">Bâtiment A</option>
                <option value="batimentB">Bâtiment B</option>
                <option value="guichet">Guichet</option>
                <option value="frontiere">Poste Frontière</option>
              </select>
            </div>
          </div>
        )}
      </div>
      
      <div className="hidden md:block">
        <div className="bg-gray-50 border-b border-gray-200 grid grid-cols-12 gap-4 px-6 py-3">
          <div className="col-span-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
            Membre du Personnel
          </div>
          <div className="col-span-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
            Fonction/Département
          </div>
          <div className="col-span-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
            Contact
          </div>
          <div className="col-span-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
            Disponibilité
          </div>
          <div className="col-span-1 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">
            Actions
          </div>
        </div>
      </div>

      {/* Staff members list */}
      <div className="divide-y divide-gray-200">
        {staffMembers.length > 0 ? (
          staffMembers.map((staff) => (
            <div key={staff.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              {/* Desktop view */}
              <div className="hidden md:grid grid-cols-12 gap-4">
                <div className="col-span-3 flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden mr-4">
                    {staff.avatar ? (
                      <img src={staff.avatar} alt={`${staff.firstName} ${staff.lastName}`} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                        <User className="h-6 w-6 text-gray-500" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {staff.firstName} {staff.lastName}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {getTimeSinceLastSeen(staff.lastSeen)}
                    </div>
                  </div>
                </div>
                
                <div className="col-span-3 flex flex-col justify-center">
                  <div className="text-sm text-gray-900">{staff.function}</div>
                  <div className="text-xs text-gray-500 mt-1 flex items-center">
                    <Building2 className="h-3 w-3 mr-1" />
                    {staff.department}
                    {staff.role && (
                      <span className="ml-3 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {staff.role}
                      </span>
                    )}
                  </div>
                  {staff.location && (
                    <div className="text-xs text-gray-500 mt-1 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {staff.location}
                    </div>
                  )}
                </div>
                
                <div className="col-span-3 flex flex-col justify-center">
                  <div className="text-sm text-gray-900 flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    {staff.internalPhone}
                    {staff.skills && staff.skills.length > 0 && (
                      <div className="ml-4 flex items-center gap-1">
                        <span className="text-xs text-gray-500">Compétences:</span>
                        <div className="flex gap-1">
                          {staff.skills.slice(0, 2).map((skill, idx) => (
                            <span key={idx} className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                              {skill}
                            </span>
                          ))}
                          {staff.skills.length > 2 && (
                            <span className="text-xs text-gray-500">+{staff.skills.length - 2}</span>
                          )}
                        </div>
                      </div>
                    )}
                  
                  {!staff.isAvailable && staff.absenceReason && (
                    <div className="ml-4 flex items-center gap-1">
                      <span className="text-xs text-red-500">Absence:</span>
                      <span className="text-xs bg-red-100 px-1.5 py-0.5 rounded text-red-700">
                        {staff.absenceReason}
                      </span>
                    </div>
                  )}
                  </div>
                  <div className="text-sm text-gray-900 mt-2 flex items-center">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    <a href={`mailto:${staff.email}`} className="text-blue-600 hover:text-blue-800 truncate">
                      {staff.email}
                    </a>
                  </div>
                </div>
                
                <div className="col-span-2 flex items-center">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                    staff.isAvailable 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {staff.isAvailable ? (
                      <>
                        <CheckCircle className="h-3 w-3" />
                        Disponible
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3" />
                        Indisponible
                      </>
                    )}
                  </span>
                </div>
                
                <div className="col-span-1 flex items-center justify-end space-x-2">
                  <button 
                    onClick={() => onView(staff)} 
                    className="text-blue-600 hover:text-blue-800 p-1.5 rounded-full hover:bg-blue-50"
                    title="Voir détails"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => onEdit(staff)}
                    className="text-indigo-600 hover:text-indigo-800 p-1.5 rounded-full hover:bg-indigo-50"
                    title="Modifier"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => onDelete(staff)}
                    className="text-red-600 hover:text-red-800 p-1.5 rounded-full hover:bg-red-50"
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {/* Mobile view */}
              <div className="block md:hidden">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden">
                      {staff.avatar ? (
                        <img src={staff.avatar} alt={`${staff.firstName} ${staff.lastName}`} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                          <User className="h-6 w-6 text-gray-500" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {staff.firstName} {staff.lastName}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{staff.function}</div>
                      <div className="text-xs text-gray-500 flex items-center mt-1">
                        <Building2 className="h-3 w-3 mr-1" />
                        {staff.department}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <span className={`inline-flex items-center mr-2 px-2 py-0.5 rounded text-xs font-medium ${
                      staff.isAvailable 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {staff.isAvailable ? 'Disponible' : 'Indisponible'}
                    </span>
                    <div className="relative">
                      <button className="text-gray-500 hover:text-gray-700 p-1.5">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 grid grid-cols-1 gap-3">
                  <div className="text-sm text-gray-900 flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    {staff.internalPhone}
                    {staff.skills && staff.skills.length > 0 && (
                      <div className="ml-4 flex items-center gap-1">
                        <span className="text-xs text-gray-500">Compétences:</span>
                        <div className="flex gap-1">
                          {staff.skills.slice(0, 1).map((skill, idx) => (
                            <span key={idx} className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                              {skill}
                            </span>
                          ))}
                          {staff.skills.length > 1 && (
                            <span className="text-xs text-gray-500">+{staff.skills.length - 1}</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="text-sm flex items-center">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    <a href={`mailto:${staff.email}`} className="text-blue-600 hover:text-blue-800 truncate">
                      {staff.email}
                    </a>
                  </div>
                </div>
                
                <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>
                      {getTimeSinceLastSeen(staff.lastSeen)}
                    </span>
                    
                    {!staff.isAvailable && (
                      <div className="flex items-center gap-1 ml-3 text-red-600">
                        <AlarmClock className="h-3.5 w-3.5" />
                        {staff.expectedReturnDate
                          ? `Retour: ${new Date(staff.expectedReturnDate).toLocaleDateString('fr-FR')}`
                          : staff.absenceDuration === 'day'
                            ? 'Retour demain'
                            : 'Absence temporaire'}
                      </div>
                    )}
                  </div>
                  
                  {!staff.isAvailable && staff.absenceReason && (
                    <div className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-lg inline-flex items-center gap-1 ml-2">
                      <MessageSquare className="h-3 w-3" />
                      <span>{staff.absenceReason}</span>
                    </div>
                  )}
                  
                  {staff.role && (
                    <span className="ml-2 px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                      {staff.role}
                    </span>
                  )}
                  
                  <div className="flex items-center gap-2">
                    {staff.isAvailable ? (
                      <button 
                        onClick={() => onToggleAvailability(staff)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <UserX className="h-4 w-4" />
                      </button>
                    ) : (
                      <button 
                        onClick={() => onToggleAvailability(staff)} 
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                        title={staff.absenceReason || "Marquer comme présent"}
                      >
                        <UserCheck className="h-4 w-4" />
                      </button>
                    )}
                    
                    <button 
                      onClick={() => onEdit(staff)}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="flex items-center justify-between">
                    {!staff.isAvailable && staff.absenceReason && (
                      <div className="text-xs text-gray-600 mt-2 flex items-center">
                        <AlarmClock className="h-3.5 w-3.5 mr-1 text-red-500" />
                        <span>
                          {staff.expectedReturnDate
                            ? `Retour prévu: ${new Date(staff.expectedReturnDate).toLocaleDateString('fr-FR')}`
                            : 'Absence temporaire'}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {getTimeSinceLastSeen(staff.lastSeen)}
                      {staff.role && (
                        <span className="ml-2 px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                          {staff.role}
                        </span>
                      )}
                    </div>
                  
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => onToggleAvailability(staff)} 
                        className={`px-3 py-1 ${
                          staff.isAvailable 
                            ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        } rounded-lg text-sm flex items-center gap-1`}
                      >
                        {staff.isAvailable ? (
                          <>
                            <UserX className="h-3 w-3" />
                            Absent
                          </>
                        ) : (
                          <>
                            <UserCheck className="h-3 w-3" />
                            Présent
                          </>
                        )}
                      </button>
                      
                      <button 
                        onClick={() => onEdit(staff)}
                        className="text-sm bg-indigo-50 text-indigo-600 px-2 py-1 rounded flex items-center gap-1"
                      >
                        <Edit className="h-3 w-3" />
                        Modifier
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="h-12 w-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <User className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun membre du personnel trouvé</h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              Aucun résultat ne correspond à vos critères de recherche. Veuillez modifier vos filtres ou ajouter de nouveaux membres du personnel.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};