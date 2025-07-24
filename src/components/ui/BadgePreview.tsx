import React from 'react';
import { Shield, QrCode, Calendar, MapPin, User, Building2 } from 'lucide-react';

interface BadgePreviewProps {
  badgeData: {
    number: string;
    visitorName: string;
    company: string;
    purpose: string;
    employeeToVisit: string;
    validDate: string;
    qrCode: string;
    accessZones: string[];
    securityLevel: string;
    photo?: string;
  };
  onPrint?: () => void;
  onCancel?: () => void;
}

export const BadgePreview: React.FC<BadgePreviewProps> = ({ badgeData, onPrint, onCancel }) => {
  const getSecurityColor = (level: string) => {
    switch (level) {
      case 'standard':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'elevated':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'maximum':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <div className="p-6">
          
          {/* Badge Preview */}
          <div className="bg-gray-50 p-6 rounded-lg mb-6 flex justify-center">
            <div className="w-80 h-52 bg-white border-2 border-gray-300 rounded-lg p-4 shadow-lg relative overflow-hidden">
              {/* Header */}
              <div className="flex items-center gap-3 mb-3">
                <img 
                  src="/Photoroom_20250703_164401.PNG" 
                  alt="Logo SOGARA" 
                  className="h-6 w-auto"
                />
                <div className="flex-1">
                  <div className="text-xs font-bold text-gray-900">RÉPUBLIQUE GABONAISE</div>
                  <div className="text-xs text-gray-600">Direction Générale de la Documentation</div>
                  <div className="text-xs text-gray-600">et de l'Immigration</div>
                </div>
              </div>

              {/* Badge Number */}
                <div className="text-xs text-gray-500">BADGE VISITEUR</div>
                <div className="text-sm font-bold text-blue-800">{badgeData.number}</div>
              </div>

              {/* Content */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <div className="text-sm font-bold text-gray-900 mb-1">{badgeData.visitorName}</div>
                  <div className="text-xs text-gray-700 mb-1">{badgeData.company}</div>
                  <div className="text-xs text-gray-600 mb-1">Motif: {badgeData.purpose}</div>
                  <div className="text-xs text-gray-600 mb-1">Contact: {badgeData.employeeToVisit}</div>
                  <div className="text-xs text-gray-600">Valide le: {badgeData.validDate}</div>
                </div>
                
                <div className="w-12 flex flex-col items-center">
                  {badgeData.photo ? (
                    <img src={badgeData.photo} alt="Photo" className="w-12 h-12 rounded border mb-1 object-cover" />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded border mb-1 flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                  <div className="w-12 h-12 bg-gray-100 border rounded flex items-center justify-center">
                    {badgeData.qrCode ? (
                      <img src={badgeData.qrCode} alt="QR Code" className="w-10 h-10" />
                    ) : (
                      <QrCode className="h-8 w-8 text-gray-600" />
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
                <div className="text-xs text-gray-500">
                  Zones: {badgeData.accessZones.join(', ')}
                </div>
                <div className="text-xs text-gray-500">
                  Sécurité: {badgeData.securityLevel} • Badge SOGARA • À rendre à la sortie
                </div>
              </div>

              {/* Security Level Indicator */}
              <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs border ${getSecurityColor(badgeData.securityLevel)}`}>
                {badgeData.securityLevel.toUpperCase()}
              </div>
            </div>
          </div>

          {/* Badge Details */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-blue-600" />
                <div>
                  <div className="text-sm font-medium text-gray-900">Visiteur</div>
                  <div className="text-sm text-gray-600">{badgeData.visitorName}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-blue-600" />
                <div>
                  <div className="text-sm font-medium text-gray-900">Entreprise</div>
                  <div className="text-sm text-gray-600">{badgeData.company}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <div>
                  <div className="text-sm font-medium text-gray-900">Validité</div>
                  <div className="text-sm text-gray-600">{badgeData.validDate}</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-600" />
                <div>
                  <div className="text-sm font-medium text-gray-900">Zones d'accès</div>
                  <div className="text-sm text-gray-600">{badgeData.accessZones.join(', ')}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-600" />
                <div>
                  <div className="text-sm font-medium text-gray-900">Niveau sécurité</div>
                  <div className="text-sm text-gray-600">{badgeData.securityLevel}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <QrCode className="h-4 w-4 text-blue-600" />
                <div>
                  <div className="text-sm font-medium text-gray-900">QR Code</div>
                  <div className="text-sm text-gray-600">Intégré</div>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions de sécurité */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-blue-900 mb-2">Instructions de sécurité</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Port du badge obligatoire et visible en permanence</li>
              <li>• Badge personnel et non transférable</li>
              <li>• À rendre obligatoirement à la réception avant de quitter les locaux</li>
              <li>• Respecter les zones d'accès autorisées uniquement</li>
              <li>• Signaler immédiatement toute perte ou vol du badge</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            src="/logo DGDI.PNG" 
            alt="Logo DGDI" 
              onClick={onPrint}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <QrCode className="h-4 w-4" />
            <div className="text-xs text-gray-600">Direction Générale de la Documentation</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};