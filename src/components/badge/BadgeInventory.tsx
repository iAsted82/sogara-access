import React, { useState, useEffect } from 'react';
import {
  Tag, Plus, Search, Filter, Download, Zap, CheckCircle,
  AlertTriangle, XCircle, Eye, ArrowUpDown, SortAsc, Trash2,
  Info, RefreshCw, FilePlus
} from 'lucide-react';
import { 
  badgeInventory, getBadgeInventoryStats, 
  getAvailableBadges, getIssuedBadges, 
  createNewBadge, getActiveBadgeIssuance,
  getVisitorBadgeHistory
} from '../../data/badgeInventory';
import { PhysicalBadge, BadgeForm } from '../../types/badge';
import { BadgeStatus } from './BadgeStatus';

interface BadgeInventoryProps {
  onSelectBadge?: (badge: PhysicalBadge) => void;
  onAddNewBadge?: (badge: PhysicalBadge) => void;
  className?: string;
}

export const BadgeInventory: React.FC<BadgeInventoryProps> = ({
  onSelectBadge,
  onAddNewBadge,
  className = ''
}) => {
  const [badges, setBadges] = useState<PhysicalBadge[]>([]);
  const [filteredBadges, setFilteredBadges] = useState<PhysicalBadge[]>([]);
  const [selectedBadge, setSelectedBadge] = useState<PhysicalBadge | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [newBadgeForm, setNewBadgeForm] = useState<BadgeForm>({
    badgeNumber: '',
    category: 'standard',
    zone: 'general'
  });
  const [isLoading, setIsLoading] = useState(true);
  
  // Load badges on component mount
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setBadges(badgeInventory);
      setFilteredBadges(badgeInventory);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Filter badges based on search and status
  useEffect(() => {
    let result = [...badges];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(badge => 
        badge.badgeNumber.toLowerCase().includes(term) ||
        badge.category?.toLowerCase().includes(term) ||
        badge.zone?.toLowerCase().includes(term) ||
        badge.notes?.toLowerCase().includes(term)
      );
    }
    
    if (statusFilter !== 'all') {
      result = result.filter(badge => badge.status === statusFilter);
    }
    
    setFilteredBadges(result);
  }, [badges, searchTerm, statusFilter]);
  
  // Get inventory statistics
  const stats = getBadgeInventoryStats();
  
  // Generate new badge number
  const generateNewBadgeNumber = () => {
    const standardBadges = badges
      .filter(badge => badge.badgeNumber.startsWith('SOGARA-') && !badge.badgeNumber.includes('VIP'))
      .map(badge => {
        const match = badge.badgeNumber.match(/SOGARA-(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
      });
    
    const highestNumber = Math.max(0, ...standardBadges);
    const nextNumber = highestNumber + 1;
    
    return `SOGARA-${String(nextNumber).padStart(3, '0')}`;
  };
  
  // Handle new badge form change
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewBadgeForm(prev => ({ ...prev, [name]: value }));
  };
  
  // Add new badge
  const handleAddBadge = () => {
    const badgeNumber = newBadgeForm.badgeNumber || generateNewBadgeNumber();
    
    // Create the new badge
    const newBadge = createNewBadge(
      newBadgeForm.category || 'standard',
      newBadgeForm.zone || 'general',
      badgeNumber
    );
    
    // Reset form
    setNewBadgeForm({
      badgeNumber: '',
      category: 'standard',
      zone: 'general'
    });
    
    // Close modal
    setShowAddModal(false);
    
    // Notify parent component
    if (onAddNewBadge) {
      onAddNewBadge(newBadge);
    }
  };
  
  // Handle badge selection
  const handleSelectBadge = (badge: PhysicalBadge) => {
    if (onSelectBadge && badge.status === 'available') {
      onSelectBadge(badge);
    } else {
      setSelectedBadge(badge);
      setShowDetailModal(true);
    }
  };
  
  // Return formatted statistics
  const formattedStats = [
    { label: 'Total', value: stats.total, color: 'text-gray-900' },
    { label: 'Disponibles', value: stats.available, color: 'text-green-600' },
    { label: 'Attribués', value: stats.issued, color: 'text-blue-600' },
    { label: 'Perdus', value: stats.lost, color: 'text-red-600' },
    { label: 'Endommagés', value: stats.damaged, color: 'text-orange-600' }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {formattedStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
            <div className="text-sm text-gray-600">{stat.label}</div>
            <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>
      
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un badge..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[160px]"
          >
            <option value="all">Tous les statuts</option>
            <option value="available">Disponibles</option>
            <option value="issued">Attribués</option>
            <option value="lost">Perdus</option>
            <option value="damaged">Endommagés</option>
            <option value="retired">Retirés</option>
          </select>
          
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nouveau Badge
          </button>
        </div>
      </div>
      
      {/* Badges Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Inventaire des Badges</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {filteredBadges.length} badge{filteredBadges.length !== 1 ? 's' : ''} trouvé{filteredBadges.length !== 1 ? 's' : ''}
            </span>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredBadges.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Tag className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun badge trouvé</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? "Aucun badge ne correspond à vos critères de recherche." 
                : "Il n'y a actuellement aucun badge dans l'inventaire."}
            </p>
            {(!searchTerm && statusFilter === 'all') && (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Ajouter un badge
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredBadges.map(badge => {
              const issuanceRecord = badge.status === 'issued' ? getActiveBadgeIssuance(badge.id) : undefined;
              
              return (
                <div
                  key={badge.id}
                  onClick={() => handleSelectBadge(badge)}
                  className={`border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow ${
                    badge.status === 'available' 
                      ? 'border-green-200 hover:border-green-300'
                      : badge.status === 'issued'
                      ? 'border-blue-200 hover:border-blue-300'
                      : badge.status === 'lost'
                      ? 'border-red-200 hover:border-red-300'
                      : badge.status === 'damaged'
                      ? 'border-orange-200 hover:border-orange-300'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="p-3 border-b border-gray-100">
                    <div className="flex justify-between items-center">
                      <div className="font-medium text-gray-900">{badge.badgeNumber}</div>
                      {badge.category === 'vip' && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full">
                          VIP
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        {badge.zone || 'Zone générale'}
                      </div>
                      <div className="text-xs text-gray-500">
                        #{badge.issuedCount}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 flex items-center justify-between bg-gray-50">
                    <div className="text-xs">
                      {badge.status === 'available' ? (
                        <span className="flex items-center gap-1 text-green-600 font-medium">
                          <CheckCircle className="h-3 w-3" />
                          Disponible
                        </span>
                      ) : badge.status === 'issued' ? (
                        <span className="flex items-center gap-1 text-blue-600 font-medium">
                          <Tag className="h-3 w-3" />
                          Attribué
                        </span>
                      ) : badge.status === 'lost' ? (
                        <span className="flex items-center gap-1 text-red-600 font-medium">
                          <AlertTriangle className="h-3 w-3" />
                          Perdu
                        </span>
                      ) : badge.status === 'damaged' ? (
                        <span className="flex items-center gap-1 text-orange-600 font-medium">
                          <XCircle className="h-3 w-3" />
                          Endommagé
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-gray-600 font-medium">
                          <XCircle className="h-3 w-3" />
                          Retiré
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectBadge(badge);
                        }}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Add Badge Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Ajouter un Nouveau Badge</h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <label htmlFor="badgeNumber" className="block text-sm font-medium text-gray-700">
                  Numéro de badge
                </label>
                <input
                  type="text"
                  id="badgeNumber"
                  name="badgeNumber"
                  value={newBadgeForm.badgeNumber}
                  onChange={handleFormChange}
                  placeholder={generateNewBadgeNumber()}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500">
                  Laissez vide pour générer automatiquement
                </p>
              </div>
              
              <div className="space-y-1">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Catégorie
                </label>
                <select
                  id="category"
                  name="category"
                  value={newBadgeForm.category}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="standard">Standard</option>
                  <option value="vip">VIP</option>
                  <option value="temporary">Temporaire</option>
                </select>
              </div>
              
              <div className="space-y-1">
                <label htmlFor="zone" className="block text-sm font-medium text-gray-700">
                  Zone d'accès
                </label>
                <select
                  id="zone"
                  name="zone"
                  value={newBadgeForm.zone}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="general">Générale</option>
                  <option value="restricted">Restreinte</option>
                  <option value="secured">Sécurisée</option>
                  <option value="all">Toutes les zones</option>
                </select>
              </div>
              
              <div className="flex items-start gap-3 bg-blue-50 p-3 rounded-lg">
                <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-800">
                  Les badges sont des éléments physiques donnés aux visiteurs pour contrôler leur accès.
                  Chaque badge doit avoir un numéro unique.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleAddBadge}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Badge Detail Modal */}
      {showDetailModal && selectedBadge && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Détails du Badge</h3>
            </div>
            
            <div className="p-6">
              <BadgeStatus 
                badge={selectedBadge}
                issuanceRecord={selectedBadge.status === 'issued' ? getActiveBadgeIssuance(selectedBadge.id) : undefined}
                showActions={true}
              />
              
              <div className="mt-6 space-y-4">
                <h4 className="font-medium text-gray-900 text-sm">Historique d'utilisation</h4>
                <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
                  {getVisitorBadgeHistory(selectedBadge.id).length > 0 ? (
                    getVisitorBadgeHistory(selectedBadge.id).slice(0, 5).map((record, index) => (
                      <div key={index} className="p-3">
                        <div className="flex justify-between items-center">
                          <div className="text-sm font-medium text-gray-900">
                            {record.visitorName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(record.issuedAt).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                        <div className="mt-1 flex items-center justify-between">
                          <div className="text-xs text-gray-600">
                            {record.isReturned ? 'Retourné' : 'Non retourné'}
                          </div>
                          <div className="text-xs text-gray-600">
                            Durée: {record.returnedAt ? 
                              Math.round((new Date(record.returnedAt).getTime() - new Date(record.issuedAt).getTime()) / 60000) 
                              : 'N/A'} min
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      Aucun historique d'utilisation disponible
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                type="button"
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Fermer
              </button>
              {selectedBadge.status === 'available' && (
                <button
                  type="button"
                  onClick={() => {
                    if (onSelectBadge) {
                      onSelectBadge(selectedBadge);
                      setShowDetailModal(false);
                    }
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <Tag className="h-4 w-4" />
                  Utiliser ce badge
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};