import React from 'react';
import { CheckCircle, RefreshCw } from 'lucide-react';

interface UpdateStatusBannerProps {
  version: string;
  lastUpdateTime?: string;
}

export const UpdateStatusBanner: React.FC<UpdateStatusBannerProps> = ({ version, lastUpdateTime }) => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-3">
        <CheckCircle className="h-5 w-5 text-blue-600" />
        <div>
          <h3 className="font-medium text-blue-900">Système à jour - Version {version}</h3>
          {lastUpdateTime && (
            <p className="text-sm text-blue-700">Dernière mise à jour: {lastUpdateTime}</p>
          )}
        </div>
      </div>
    </div>
  );
};