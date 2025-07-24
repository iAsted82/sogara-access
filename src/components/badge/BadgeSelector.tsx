import React, { useState, useEffect } from 'react';
import { Tag, CheckCircle, AlertTriangle, Info, Search } from 'lucide-react';
import { PhysicalBadge } from '../../types/badge';
import { getAvailableBadges } from '../../data/badgeInventory';

interface BadgeSelectorProps {
  onBadgeSelect: (badge: PhysicalBadge) => void;
  selectedBadgeId?: string;
  className?: string;
}

export const BadgeSelector: React.FC<BadgeSelectorProps> = ({
  onBadgeSelect,
  selectedBadgeId,
  className = ''
}) => {
  const [availableBadges, setAvailableBadges] = useState<PhysicalBadge[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Load available badges on component mount
  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setAvailableBadges(getAvailableBadges());
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Filter badges by search term
  const filteredBadges = availableBadges.filter(badge => 
    badge.badgeNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    badge.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    badge.zone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (badge.notes && badge.notes.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Group badges by category
  const groupedBadges = filteredBadges.reduce((acc, badge) => {
    const category = badge.category || 'standard';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(badge);
    return acc;
  }, {} as Record<string, PhysicalBadge[]>);
  
  return (
    <div className={`border border-gray-200 rounded-lg bg-white shadow-sm ${className}`}>
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-blue-600" />
            <h3 className="font-medium text-gray-900">Sélection du badge</h3>
          </div>
          <div className="text-sm text-gray-500">
            {filteredBadges.length} badge{filteredBadges.length > 1 ? 's' : ''} disponible{filteredBadges.length > 1 ? 's' : ''}
          </div>
        </div>
        
        <div className="mt-3 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un badge..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
      </div>
      
      <div className="p-4">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredBadges.length === 0 ? (
          <div className="text-center py-6">
            <div className="mx-auto w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mb-3">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-900">Aucun badge disponible</h3>
            <p className="text-xs text-gray-500 mt-1 px-4">
              {searchTerm 
                ? "Aucun badge ne correspond à votre recherche" 
                : "Tous les badges sont actuellement attribués ou indisponibles"}
            </p>
          </div>
        ) : (
          <div className="max-h-56 overflow-y-auto">
            {Object.entries(groupedBadges).map(([category, badges]) => (
              <div key={category} className="mb-4 last:mb-0">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  {category === 'vip' ? 'VIP' : 
                   category === 'standard' ? 'Standard' : 
                   category === 'temporary' ? 'Temporaire' : 
                   category}
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {badges.map(badge => (
                    <div
                      key={badge.id}
                      onClick={() => onBadgeSelect(badge)}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedBadgeId === badge.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Tag className={`h-4 w-4 ${
                            category === 'vip' ? 'text-yellow-600' :
                            category === 'temporary' ? 'text-orange-600' :
                            'text-blue-600'
                          }`} />
                          <span className="font-medium text-gray-900">{badge.badgeNumber}</span>
                        </div>
                        {selectedBadgeId === badge.id && (
                          <CheckCircle className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                      
                      <div className="mt-1 flex items-center justify-between text-xs">
                        <div className="text-gray-500">
                          Utilisé {badge.issuedCount} fois
                        </div>
                        {badge.zone && (
                          <div className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-700">
                            {badge.zone}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-3 flex items-start gap-2 bg-blue-50 p-3 rounded-lg border border-blue-100">
          <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-blue-800">
            <p>Sélectionnez un badge à attribuer au visiteur. Le badge sera marqué comme "attribué" jusqu'à ce qu'il soit rendu.</p>
          </div>
        </div>
      </div>
    </div>
  );
};