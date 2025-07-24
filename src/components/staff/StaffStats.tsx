import React from 'react';
import { 
  Users, 
  UserCheck, 
  Building2, 
  Clock, 
  CheckCircle, 
  XCircle,
  BarChart,
  ArrowUp,
  ArrowDown,
  ArrowRight
} from 'lucide-react';
import { StaffMember } from '../../types/staff';

interface StaffStatsProps {
  staff: StaffMember[];
  className?: string;
}

export const StaffStats: React.FC<StaffStatsProps> = ({ staff, className = '' }) => {
  // Calculate stats
  const totalStaff = staff.length;
  const availableStaff = staff.filter(member => member.isAvailable).length;
  const availabilityRate = totalStaff > 0 ? (availableStaff / totalStaff) * 100 : 0;
  
  // Department distribution
  const departmentCounts: Record<string, { total: number; available: number }> = {};
  staff.forEach(member => {
    if (!departmentCounts[member.department]) {
      departmentCounts[member.department] = { total: 0, available: 0 };
    }
    departmentCounts[member.department].total += 1;
    if (member.isAvailable) {
      departmentCounts[member.department].available += 1;
    }
  });
  
  // Role distribution
  const roleCounts: Record<string, number> = {};
  staff.forEach(member => {
    if (member.role) {
      if (!roleCounts[member.role]) {
        roleCounts[member.role] = 0;
      }
      roleCounts[member.role] += 1;
    }
  });
  
  // Skills distribution
  const skillsCount: Record<string, number> = {};
  staff.forEach(member => {
    if (member.skills) {
      member.skills.forEach(skill => {
        if (!skillsCount[skill]) {
          skillsCount[skill] = 0;
        }
        skillsCount[skill] += 1;
      });
    }
  });
  
  // Top skills
  const topSkills = Object.entries(skillsCount)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, 5);
  
  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden ${className}`}>
      <div className="p-4 bg-blue-50 border-b border-blue-200">
        <div className="flex items-center gap-2">
          <BarChart className="h-5 w-5 text-blue-600" />
          <h3 className="font-medium text-blue-900">Statistiques du Personnel</h3>
        </div>
      </div>
      
      <div className="p-4">
        {/* Main KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Effectif Total</div>
                <div className="text-2xl font-bold text-gray-900">{totalStaff}</div>
              </div>
              <div className="p-2.5 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-3 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-green-600">Personnel Disponible</div>
                <div className="text-2xl font-bold text-green-900">{availableStaff}</div>
                <div className="text-xs text-green-600">{Math.round(availabilityRate)}% du total</div>
              </div>
              <div className="p-2.5 bg-green-100 rounded-lg">
                <UserCheck className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-red-50 rounded-lg p-3 border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-red-600">Personnel Indisponible</div>
                <div className="text-2xl font-bold text-red-900">{totalStaff - availableStaff}</div>
                <div className="text-xs text-red-600">{Math.round(100 - availabilityRate)}% du total</div>
              </div>
              <div className="p-2.5 bg-red-100 rounded-lg">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Department breakdown */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Building2 className="h-4 w-4 text-gray-600" />
            Répartition par département
          </h4>
          
          <div className="space-y-3">
            {Object.entries(departmentCounts).map(([department, { total, available }], index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-gray-900">{department}</div>
                  <div className="text-sm text-gray-600">{total} {total > 1 ? 'membres' : 'membre'}</div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-2 bg-blue-500 rounded-full"
                      style={{ width: `${(available / total) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-xs font-medium text-blue-600">
                    {available} disponible{available > 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Top skills */}
        {topSkills.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Top compétences</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {topSkills.map(([skill, count], index) => (
                <div key={index} className="bg-blue-50 text-blue-800 px-3 py-2 rounded-lg flex items-center justify-between">
                  <span>{skill}</span>
                  <span className="bg-blue-100 px-2 py-0.5 rounded-full text-xs font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Role distribution */}
        {Object.keys(roleCounts).length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Répartition par rôle</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(roleCounts).map(([role, count], index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="font-medium text-gray-900">{role}</div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-gray-600">{count} {count > 1 ? 'personnes' : 'personne'}</div>
                    <div className="text-xs px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full">
                      {Math.round((count / totalStaff) * 100)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};