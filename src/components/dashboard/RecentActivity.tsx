import React from 'react';
import { 
  Bell, CheckCircle, AlertTriangle, XCircle, Info,
  Users, FileText, Shield, Globe, Clock
} from 'lucide-react';

interface Activity {
  id: string;
  type: 'visitor' | 'document' | 'system' | 'alert' | 'visa';
  message: string;
  timestamp: string;
  status: 'success' | 'error' | 'warning' | 'info';
}

interface RecentActivityProps {
  data: Activity[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ data }) => {
  // Fonction pour formater la date
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Obtenir l'icône pour chaque type d'activité
  const getActivityIcon = (activity: Activity) => {
    const typeIcons = {
      visitor: <Users className="h-4 w-4" />,
      document: <FileText className="h-4 w-4" />,
      system: <Shield className="h-4 w-4" />,
      alert: <AlertTriangle className="h-4 w-4" />,
      visa: <Globe className="h-4 w-4" />
    };
    
    return typeIcons[activity.type] || <Info className="h-4 w-4" />;
  };
  
  // Obtenir l'icône et la couleur pour chaque statut
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'success':
        return { 
          icon: <CheckCircle className="h-4 w-4" />, 
          color: 'text-green-600 bg-green-100'
        };
      case 'error':
        return { 
          icon: <XCircle className="h-4 w-4" />, 
          color: 'text-red-600 bg-red-100'
        };
      case 'warning':
        return { 
          icon: <AlertTriangle className="h-4 w-4" />, 
          color: 'text-yellow-600 bg-yellow-100'
        };
      case 'info':
      default:
        return { 
          icon: <Info className="h-4 w-4" />, 
          color: 'text-blue-600 bg-blue-100'
        };
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full">
      <div className="flex items-center gap-2 mb-6">
        <Bell className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Activité Récente</h3>
      </div>
      
      <div className="space-y-4">
        {data.map((activity) => {
          const statusInfo = getStatusInfo(activity.status);
          
          return (
            <div 
              key={activity.id}
              className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              {/* Icône de statut avec couleur */}
              <div className={`p-2 rounded-lg ${statusInfo.color} flex-shrink-0`}>
                {statusInfo.icon}
              </div>
              
              <div className="flex-1 min-w-0">
                {/* Message d'activité */}
                <p className="text-sm text-gray-900 font-medium">{activity.message}</p>
                
                {/* Métadonnées d'activité */}
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatTimestamp(activity.timestamp)}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {getActivityIcon(activity)}
                    <span>{activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}</span>
                  </div>
                </div>
              </div>
              
              {/* Indicateur de temps écoulé */}
              <span className="text-xs text-gray-400 flex-shrink-0">
                {Math.floor((Date.now() - new Date(activity.timestamp).getTime()) / 60000)}m
              </span>
            </div>
          );
        })}
      </div>
      
      {/* Bouton pour voir plus */}
      <div className="mt-4 text-center">
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          Voir toute l'activité
        </button>
      </div>
    </div>
  );
};