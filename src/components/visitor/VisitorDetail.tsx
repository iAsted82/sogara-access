import React from 'react';
import { User, Phone, Mail, Clock, Building2, X } from 'lucide-react';
import { Appointment } from '../../types/appointment';

interface Visitor {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  company?: string;
  purposeOfVisit: string;
  serviceRequested: string;
  department: string;
  checkInTime: string;
  status: string;
  badgeNumber: string;
}

interface VisitorDetailProps {
  visitor: Visitor;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onCheckout?: () => void;
  onExport: () => void;
  appointments: Appointment[];
}

export const VisitorDetail: React.FC<VisitorDetailProps> = ({
  visitor,
  onClose,
  onEdit,
  onDelete,
  onCheckout,
  onExport
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-lg max-w-2xl w-full">
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Détails du Visiteur</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">{visitor.fullName}</h3>
            <p className="text-gray-600">{visitor.company}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{visitor.phone}</span>
            </div>
            {visitor.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{visitor.email}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{visitor.department}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm">Arrivée: {new Date(visitor.checkInTime).toLocaleTimeString()}</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Motif: {visitor.purposeOfVisit}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Badge: {visitor.badgeNumber}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
        <button
          onClick={onEdit}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Modifier
        </button>
        {onCheckout && (
          <button
            onClick={onCheckout}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Check-out
          </button>
        )}
        <button
          onClick={onDelete}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Supprimer
        </button>
      </div>
    </div>
  );
};