import React from 'react';
import { StaffMember } from '../../types/staff';
import {
  User, Phone, Mail, Building2, MapPin, Clock, CheckCircle, 
  XCircle, FileText, Edit, UserCheck, UserX, X
} from 'lucide-react';
import { getTimeSinceLastSeen } from '../../utils/staffUtils';

interface StaffDetailProps {
  staff: StaffMember;
  onClose: () => void;
  onEdit: () => void;
  onToggleAvailability: () => void;
}

export const StaffDetail: React.FC<StaffDetailProps> = ({
  staff,
  onClose,
  onEdit,
  onToggleAvailability
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="relative">
        {/* Banner background */}
        <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600"></div>
        
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
        
        {/* Avatar */}
        <div className="absolute -bottom-12 left-6">
          <div className="h-24 w-24 rounded-full border-4 border-white overflow-hidden bg-white">
            {staff.avatar ? (
              <img 
                src={staff.avatar} 
                alt={`${staff.firstName} ${staff.lastName}`} 
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                <User className="h-12 w-12 text-gray-400" />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="pt-16 pb-6 px-6">
        {/* Name and function */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {staff.firstName} {staff.lastName}
            </h2>
            
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
              staff.isAvailable 
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {staff.isAvailable ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Disponible
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4" />
                  Indisponible
                </>
              )}
            </div>
          </div>
          
          <div className="text-lg text-gray-600 mt-1">{staff.function}</div>
          
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
            <Building2 className="h-4 w-4" />
            <span>{staff.department}</span>
          </div>
        </div>
        
        {/* Info sections */}
        <div className="space-y-6">
          {/* Contact info */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Phone className="h-4 w-4 text-blue-600" />
              Coordonnées
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Téléphone interne:</span>
                <span className="text-sm font-medium text-gray-900">{staff.internalPhone}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Email professionnel:</span>
                <a href={`mailto:${staff.email}`} className="text-sm font-medium text-blue-600 hover:text-blue-800">
                  {staff.email}
                </a>
              </div>
            </div>
          </div>
          
          {/* Location */}
          {staff.location && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-600" />
                Localisation
              </h3>
              
              <div className="text-sm text-gray-700">{staff.location}</div>
            </div>
          )}
          
          {/* Availability */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              Statut
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Dernière mise à jour:</span>
                <span className="text-sm font-medium text-gray-900">
                  {staff.lastSeen ? new Date(staff.lastSeen).toLocaleString('fr-FR') : 'N/A'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Il y a:</span>
                <span className="text-sm font-medium text-gray-900">
                  {getTimeSinceLastSeen(staff.lastSeen)}
                </span>
              </div>
              
              {!staff.isAvailable && (
                <div>
                  <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-100">
                    <h4 className="font-medium text-red-800 mb-2 flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                      Informations d'absence
                    </h4>
                    <div className="space-y-1.5 text-sm text-red-700">
                      {staff.absenceReason && (
                        <div className="flex justify-between">
                          <span>Motif:</span>
                          <span className="font-medium">{staff.absenceReason}</span>
                        </div>
                      )}
                      
                      {staff.absenceDuration && (
                        <div className="flex justify-between">
                          <span>Durée prévue:</span>
                          <span className="font-medium">
                            {staff.absenceDuration === 'hour' ? 'Quelques heures' : 
                            staff.absenceDuration === 'day' ? 'La journée' :
                            staff.absenceDuration === 'days' ? 'Quelques jours' :
                            staff.absenceDuration === 'week' ? 'Une semaine' :
                            staff.absenceDuration === 'weeks' ? 'Plusieurs semaines' :
                            'Indéterminée'}
                          </span>
                        </div>
                      )}
                      
                      {staff.expectedReturnDate && (
                        <div className="flex justify-between">
                          <span>Retour prévu:</span>
                          <span className="font-medium">
                            {new Date(staff.expectedReturnDate).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Notes */}
          {staff.notes && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-600" />
                Notes
              </h3>
              
              <p className="text-sm text-gray-700">{staff.notes}</p>
            </div>
          )}
          
          {/* Additional Information */}
          {(staff.role || staff.skills || staff.languages) && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h3 className="text-md font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <User className="h-4 w-4 text-blue-600" />
                Informations Additionnelles
              </h3>
              
              <div className="space-y-2">
                {staff.role && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-700">Rôle:</span>
                    <span className="text-sm font-medium text-blue-900">{staff.role}</span>
                  </div>
                )}
                
                {staff.skills && staff.skills.length > 0 && (
                  <div className="flex flex-col">
                    <span className="text-sm text-blue-700 mb-1">Compétences:</span>
                    <div className="flex flex-wrap gap-2">
                      {staff.skills.map((skill, index) => (
                        <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {staff.languages && staff.languages.length > 0 && (
                  <div className="flex flex-col">
                    <span className="text-sm text-blue-700 mb-1">Langues:</span>
                    <div className="flex flex-wrap gap-2">
                      {staff.languages.map((language, index) => (
                        <span key={index} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          {language}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Actions */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex flex-wrap justify-end gap-3">
          <button
            onClick={onToggleAvailability}
            className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 ${
              staff.isAvailable
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {staff.isAvailable ? (
              <>
                <UserX className="h-4 w-4" />
                Marquer comme absent
              </>
            ) : (
              <>
                <UserCheck className="h-4 w-4" />
                Marquer comme présent
              </>
            )}
          </button>
          
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Modifier
          </button>
        </div>
      </div>
    </div>
  );
};