import React from 'react';
import { 
  Tag, CheckCircle, AlertTriangle, XCircle, Clock, ArrowLeftRight,
  User, Calendar, Shield
} from 'lucide-react';
import { BadgeIssuanceRecord, PhysicalBadge } from '../../types/badge';

interface BadgeStatusProps {
  badge?: PhysicalBadge;
  issuanceRecord?: BadgeIssuanceRecord;
  compact?: boolean;
  showActions?: boolean;
  onReturn?: () => void;
  onReportLost?: () => void;
  className?: string;
}

export const BadgeStatus: React.FC<BadgeStatusProps> = ({
  badge,
  issuanceRecord,
  compact = false,
  showActions = false,
  onReturn,
  onReportLost,
  className = ''
}) => {
  if (!badge) return null;
  
  // Badge status information
  const getStatusInfo = () => {
    switch (badge.status) {
      case 'available':
        return {
          icon: <CheckCircle className="h-4 w-4 text-green-500" />,
          label: 'Disponible',
          color: 'bg-green-100 text-green-800 border-green-200',
          description: 'Badge disponible pour attribution'
        };
      case 'issued':
        return {
          icon: <User className="h-4 w-4 text-blue-500" />,
          label: 'Attribué',
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          description: issuanceRecord 
            ? `Attribué à ${issuanceRecord.visitorName}`
            : 'Badge actuellement attribué à un visiteur'
        };
      case 'returned':
        return {
          icon: <ArrowLeftRight className="h-4 w-4 text-indigo-500" />,
          label: 'Retourné',
          color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
          description: 'Badge retourné et prêt à être réutilisé'
        };
      case 'lost':
        return {
          icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
          label: 'Perdu',
          color: 'bg-red-100 text-red-800 border-red-200',
          description: 'Badge signalé comme perdu'
        };
      case 'damaged':
        return {
          icon: <XCircle className="h-4 w-4 text-orange-500" />,
          label: 'Endommagé',
          color: 'bg-orange-100 text-orange-800 border-orange-200',
          description: 'Badge endommagé, nécessite remplacement'
        };
      case 'retired':
        return {
          icon: <XCircle className="h-4 w-4 text-gray-500" />,
          label: 'Retiré',
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          description: 'Badge retiré de la circulation'
        };
      default:
        return {
          icon: <AlertTriangle className="h-4 w-4 text-gray-500" />,
          label: 'Inconnu',
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          description: 'Statut de badge inconnu'
        };
    }
  };
  
  const statusInfo = getStatusInfo();
  
  // Compact version (for inline use)
  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color} ${className}`}>
        {statusInfo.icon}
        <span>{statusInfo.label}</span>
      </div>
    );
  }
  
  // Full version
  return (
    <div className={`rounded-lg border ${statusInfo.color.includes('border') ? statusInfo.color : 'border-gray-200'} ${className}`}>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3">
            <div className={`p-2.5 rounded-lg ${statusInfo.color.replace(/border-[a-z]+-\d+/g, '').replace('text-', 'bg-').replace('800', '100')}`}>
              <Tag className="h-5 w-5 text-gray-600" />
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900">{badge.badgeNumber}</h3>
              <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium mt-1.5 ${statusInfo.color}`}>
                {statusInfo.icon}
                <span>{statusInfo.label}</span>
              </div>
              
              <div className="mt-2 text-sm text-gray-600">
                {statusInfo.description}
              </div>
            </div>
          </div>
          
          {badge.category && (
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              badge.category === 'vip'
                ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                : badge.category === 'temporary'
                ? 'bg-orange-100 text-orange-800 border-orange-200'
                : 'bg-gray-100 text-gray-800 border-gray-200'
            }`}>
              {badge.category === 'vip' ? 'VIP' : 
               badge.category === 'standard' ? 'Standard' : 
               badge.category === 'temporary' ? 'Temporaire' : 
               badge.category}
            </div>
          )}
        </div>
        
        {/* Issuance details if issued */}
        {badge.status === 'issued' && issuanceRecord && (
          <div className="mt-4 bg-blue-50 rounded-lg p-3 border border-blue-100">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center gap-1.5 text-sm">
                <User className="h-4 w-4 text-blue-600" />
                <span className="text-blue-900 font-medium">Attribué à:</span>
                <span className="text-blue-800">{issuanceRecord.visitorName}</span>
              </div>
              
              <div className="flex items-center gap-1.5 text-sm">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="text-blue-900 font-medium">Attribué le:</span>
                <span className="text-blue-800">
                  {new Date(issuanceRecord.issuedAt).toLocaleString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              
              {issuanceRecord.expectedReturnTime && (
                <div className="flex items-center gap-1.5 text-sm">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-900 font-medium">Retour prévu:</span>
                  <span className="text-blue-800">
                    {new Date(issuanceRecord.expectedReturnTime).toLocaleString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              )}
              
              {issuanceRecord.notes && (
                <div className="flex items-start gap-1.5 text-sm">
                  <AlertTriangle className="h-4 w-4 text-blue-600 mt-0.5" />
                  <span className="text-blue-800">{issuanceRecord.notes}</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Badge details */}
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-500">Zone d'accès:</div>
            <div className="font-medium text-gray-900">{badge.zone || 'Général'}</div>
          </div>
          <div>
            <div className="text-gray-500">Utilisé:</div>
            <div className="font-medium text-gray-900">{badge.issuedCount} fois</div>
          </div>
        </div>
        
        {/* Actions */}
        {showActions && badge.status === 'issued' && (
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={onReportLost}
              className="px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-sm flex items-center gap-1.5"
            >
              <AlertTriangle className="h-4 w-4" />
              Signaler perdu
            </button>
            <button
              onClick={onReturn}
              className="px-3 py-1.5 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg text-sm flex items-center gap-1.5"
            >
              <ArrowLeftRight className="h-4 w-4" />
              Retourner
            </button>
          </div>
        )}
        
        {/* Notes for lost/damaged badges */}
        {(badge.status === 'lost' || badge.status === 'damaged') && badge.notes && (
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-100 text-sm">
            <div className="flex items-start gap-1.5">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <span className="text-yellow-800">{badge.notes}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};