import React from 'react';
import { QrCode, User } from 'lucide-react';

interface VisitorBadgeProps {
  visitor: {
    fullName: string;
    badgeNumber: string;
    company?: string;
    department: string;
    serviceRequested: string;
    employeeToVisit: string;
    checkInTime: string;
  };
  className?: string;
}

export const VisitorBadge: React.FC<VisitorBadgeProps> = ({ visitor, className = '' }) => {
  // Format de la date pour l'affichage
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  // Validité du badge (24h par défaut)
  const calculateValidUntil = (checkInTime: string) => {
    const checkIn = new Date(checkInTime);
    const validUntil = new Date(checkIn);
    validUntil.setHours(validUntil.getHours() + 24);
    return validUntil.toLocaleDateString('fr-FR');
  };

  return (
    <div className={`max-w-xs mx-auto bg-white rounded-lg shadow-lg overflow-hidden border border-gray-300 ${className}`}>
      {/* En-tête du badge */}
      <div className="bg-blue-600 text-white p-3">
        <div className="flex items-center gap-2">
          <img 
            src="/Photoroom_20250703_164401.PNG"
            alt="Logo SOGARA" 
            className="h-10 w-auto bg-white rounded p-1"
          />
          <div>
            <h3 className="font-bold text-lg">SOGARA Access</h3>
            <p className="text-sm text-blue-100">Badge Visiteur</p>
          </div>
        </div>
      </div>
      
      {/* Corps du badge */}
      <div className="p-4 space-y-3">
        {/* Informations principales */}
        <div className="flex items-center gap-3">
          <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
            <User className="h-8 w-8" />
          </div>
          
          <div>
            <h4 className="font-bold text-gray-900">{visitor.fullName}</h4>
            {visitor.company && (
              <p className="text-sm text-gray-600">{visitor.company}</p>
            )}
          </div>
        </div>
        
        {/* Détails de la visite */}
        <div className="border-t border-gray-200 pt-3">
          <div className="grid grid-cols-2 gap-x-2 gap-y-1">
            <div>
              <p className="text-xs text-gray-500">Numéro</p>
              <p className="text-sm font-medium">{visitor.badgeNumber}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Date</p>
              <p className="text-sm font-medium">{formatDate(visitor.checkInTime)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Service</p>
              <p className="text-sm font-medium">{visitor.serviceRequested}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Contact</p>
              <p className="text-sm font-medium">{visitor.employeeToVisit}</p>
            </div>
          </div>
        </div>
        
        {/* QR Code */}
        <div className="flex justify-center pt-2">
          <div className="p-2 border border-gray-200 rounded">
            <QrCode className="h-20 w-20 text-gray-900" />
          </div>
        </div>
        
        {/* Informations de validité */}
        <div className="bg-blue-50 p-2 rounded text-center text-sm border border-blue-100">
          <p className="text-blue-800">Valide jusqu'au {calculateValidUntil(visitor.checkInTime)}</p>
        </div>
      </div>
      
      {/* Pied de badge */}
      <div className="bg-gray-800 text-white text-center p-2 text-xs">
        <p>Direction Générale de la Documentation et de l'Immigration - République Gabonaise</p>
        <p>Ce badge doit être visible à tout moment et rendu à la sortie</p>
      </div>
    </div>
  );
};