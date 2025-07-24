import React from 'react';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Building2, 
  UserCheck,
  Download, 
  PieChart, 
  BarChart,
  TrendingUp
} from 'lucide-react';
import { StaffMember } from '../../types/staff';
import { calculateStaffStatistics } from '../../utils/staffUtils';

interface StaffStatisticsProps {
  staff: StaffMember[];
  onExport?: () => void;
  onClose?: () => void;
}

export const StaffStatistics: React.FC<StaffStatisticsProps> = ({ 
  staff,
  onExport,
  onClose
}) => {
  const stats = calculateStaffStatistics(staff);
  
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Statistiques du Personnel</h3>
          {onClose && (
            <button 
              onClick={onClose}
              className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
            >
              <XCircle className="h-5 w-5" />
            </button>
          )}
        </div>
        <p className="text-blue-100">Aperçu global des données RH</p>
      </div>
      
      {/* Main Stats */}
      <div className="p-6 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Personnel Total</p>
                <p className="text-2xl font-bold text-blue-900">{stats.totalStaff}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Disponibles</p>
                <p className="text-2xl font-bold text-green-900">{stats.availableNow}</p>
                <p className="text-xs text-green-600">{Math.round(stats.availabilityRate)}% du total</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-red-50 rounded-lg p-4 border border-red-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600">Indisponibles</p>
                <p className="text-2xl font-bold text-red-900">{stats.unavailableNow}</p>
                <p className="text-xs text-red-600">{100 - Math.round(stats.availabilityRate)}% du total</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Department Breakdown */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="h-5 w-5 text-gray-600" />
            <h4 className="font-medium text-gray-900">Répartition par Département</h4>
          </div>
          
          <div className="space-y-3">
            {stats.departmentBreakdown.map((dept, index) => (
              <div key={index} className="bg-white p-3 rounded-lg border border-gray-100 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-gray-900">{dept.department}</div>
                  <div className="text-sm text-gray-600">{dept.count} membres</div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-2 bg-blue-500 rounded-full"
                      style={{ width: `${(dept.availableCount / dept.count) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-blue-600 font-medium">
                    {dept.availableCount} disponibles
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Role Breakdown */}
        {stats.roleBreakdown.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-gray-600" />
              <h4 className="font-medium text-gray-900">Répartition par Rôle</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stats.roleBreakdown.map((role, index) => (
                <div key={index} className="bg-white p-3 rounded-lg border border-gray-100 hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-gray-900">{role.role || 'Non spécifié'}</div>
                    <div className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {role.count} {role.count > 1 ? 'personnes' : 'personne'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Chart Visualization (simplified) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-indigo-600" />
                <h4 className="font-medium text-gray-900">Disponibilité</h4>
              </div>
              <div className="text-sm text-gray-500">{Math.round(stats.availabilityRate)}% disponible</div>
            </div>
            
            <div className="flex items-center justify-center my-4">
              <div className="w-32 h-32 rounded-full border-8 border-blue-500 flex items-center justify-center relative">
                <div 
                  className="absolute inset-0 rounded-full bg-green-500"
                  style={{ 
                    clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.sin(stats.availabilityRate / 100 * 2 * Math.PI)}% ${50 - 50 * Math.cos(stats.availabilityRate / 100 * 2 * Math.PI)}%, 50% 50%)` 
                  }}
                ></div>
                <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center z-10">
                  <div className="text-xl font-bold text-gray-900">{Math.round(stats.availabilityRate)}%</div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-8 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Disponible</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <span className="text-sm text-gray-600">Indisponible</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart className="h-5 w-5 text-purple-600" />
                <h4 className="font-medium text-gray-900">Départements</h4>
              </div>
            </div>
            
            <div className="space-y-4">
              {stats.departmentBreakdown.map((dept, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700">{dept.department}</span>
                    <span className="text-gray-600">{dept.count}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-2 bg-purple-500"
                      style={{ width: `${(dept.count / stats.totalStaff) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Dernière mise à jour: {new Date().toLocaleString('fr-FR')}
        </div>
        
        {onExport && (
          <button 
            onClick={onExport}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm"
          >
            <Download className="h-4 w-4" />
            Exporter les données
          </button>
        )}
      </div>
    </div>
  );
};