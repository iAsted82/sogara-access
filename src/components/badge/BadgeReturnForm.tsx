import React, { useState, useEffect } from 'react';
import { 
  ArrowLeftRight, Tag, Search, AlertTriangle, 
  CheckCircle, XCircle, Info, Shield 
} from 'lucide-react';
import { BadgeReturnForm as BadgeReturnFormType, PhysicalBadge, BadgeIssuanceRecord } from '../../types/badge';
import { getBadgeByNumber, getBadgeInventoryStats, getIssuedBadges, getActiveBadgeIssuance } from '../../data/badgeInventory';

interface BadgeReturnFormProps {
  onSubmit: (data: BadgeReturnFormType) => void;
  onCancel: () => void;
  className?: string;
}

export const BadgeReturnForm: React.FC<BadgeReturnFormProps> = ({
  onSubmit,
  onCancel,
  className = ''
}) => {
  const [badgeNumber, setBadgeNumber] = useState('');
  const [returnNotes, setReturnNotes] = useState('');
  const [condition, setCondition] = useState<'good' | 'damaged' | 'lost'>('good');
  const [foundBadge, setFoundBadge] = useState<PhysicalBadge | null>(null);
  const [issuanceRecord, setIssuanceRecord] = useState<BadgeIssuanceRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Stats for information
  const stats = getBadgeInventoryStats();
  
  // Clear error when input changes
  useEffect(() => {
    if (error) setError(null);
  }, [badgeNumber]);
  
  // Search for badge
  const searchBadge = () => {
    if (!badgeNumber.trim()) {
      setError('Veuillez entrer un numéro de badge');
      return;
    }
    
    const badge = getBadgeByNumber(badgeNumber.trim());
    setSearchAttempted(true);
    
    if (!badge) {
      setError('Badge non trouvé');
      setFoundBadge(null);
      setIssuanceRecord(null);
      return;
    }
    
    setFoundBadge(badge);
    
    // Check if badge is issued
    if (badge.status !== 'issued') {
      setError(`Ce badge n'est pas actuellement attribué (Statut: ${badge.status})`);
      setIssuanceRecord(null);
      return;
    }
    
    // Get issuance record
    const record = getActiveBadgeIssuance(badge.id);
    if (!record) {
      setError('Enregistrement d\'attribution non trouvé');
      setIssuanceRecord(null);
      return;
    }
    
    setIssuanceRecord(record);
    setError(null);
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!foundBadge) {
      setError('Veuillez d\'abord rechercher un badge');
      return;
    }
    
    if (foundBadge.status !== 'issued') {
      setError(`Ce badge n'est pas actuellement attribué`);
      return;
    }
    
    setIsSubmitting(true);
    
    // Prepare form data
    const formData: BadgeReturnFormType = {
      badgeId: foundBadge.id,
      badgeNumber: foundBadge.badgeNumber,
      returnNotes: returnNotes.trim() || undefined,
      condition
    };
    
    // Submit data
    onSubmit(formData);
  };
  
  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden ${className}`}>
      <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-blue-900">Retour de Badge</h3>
            <p className="text-sm text-blue-700">Enregistrez le retour d'un badge visiteur</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">
              {stats.issued} badge{stats.issued !== 1 ? 's' : ''} en circulation
            </div>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Badge Search */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Numéro de Badge *
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={badgeNumber}
                onChange={(e) => setBadgeNumber(e.target.value)}
                placeholder="Ex: DGI-001"
                className={`w-full pl-10 pr-4 py-2 border ${
                  error ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
            </div>
            <button
              type="button"
              onClick={searchBadge}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              Rechercher
            </button>
          </div>
          {error && (
            <p className="text-sm text-red-600 mt-1 flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4" />
              {error}
            </p>
          )}
        </div>
        
        {/* Found Badge Details */}
        {foundBadge && issuanceRecord && (
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <h3 className="font-medium text-blue-900">Badge trouvé</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-blue-900">Informations du Badge</h4>
                <div className="mt-2 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Numéro:</span>
                    <span className="font-medium text-blue-900">{foundBadge.badgeNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Catégorie:</span>
                    <span className="font-medium text-blue-900">{foundBadge.category || 'Standard'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Zone d'accès:</span>
                    <span className="font-medium text-blue-900">{foundBadge.zone || 'Général'}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-blue-900">Attribution Actuelle</h4>
                <div className="mt-2 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Visiteur:</span>
                    <span className="font-medium text-blue-900">{issuanceRecord.visitorName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Attribué le:</span>
                    <span className="font-medium text-blue-900">
                      {new Date(issuanceRecord.issuedAt).toLocaleString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Par:</span>
                    <span className="font-medium text-blue-900">{issuanceRecord.issuedBy}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* No Badge Found Message */}
        {searchAttempted && !foundBadge && !error && (
          <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-yellow-900">Badge non trouvé</h3>
                <p className="text-sm text-yellow-800 mt-1">
                  Le numéro de badge que vous avez saisi n'a pas été trouvé dans le système.
                  Veuillez vérifier et réessayer.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Condition Selection */}
        {foundBadge && issuanceRecord && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              État du badge au retour
            </label>
            <div className="flex space-x-3">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="condition-good"
                  name="condition"
                  checked={condition === 'good'}
                  onChange={() => setCondition('good')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="condition-good" className="ml-2 block text-sm text-gray-700">
                  Bon état
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="condition-damaged"
                  name="condition"
                  checked={condition === 'damaged'}
                  onChange={() => setCondition('damaged')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="condition-damaged" className="ml-2 block text-sm text-gray-700">
                  Endommagé
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="condition-lost"
                  name="condition"
                  checked={condition === 'lost'}
                  onChange={() => setCondition('lost')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="condition-lost" className="ml-2 block text-sm text-gray-700">
                  Perdu
                </label>
              </div>
            </div>
          </div>
        )}
        
        {/* Notes */}
        {foundBadge && issuanceRecord && (
          <div className="space-y-1">
            <label htmlFor="returnNotes" className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              id="returnNotes"
              name="returnNotes"
              value={returnNotes}
              onChange={(e) => setReturnNotes(e.target.value)}
              rows={3}
              placeholder="Notes additionnelles sur l'état du badge ou les circonstances du retour..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}
        
        {/* Help Text */}
        {!foundBadge && !issuanceRecord && (
          <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-lg">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-blue-900">Comment retourner un badge</h3>
              <ol className="mt-1 text-sm text-blue-800 list-decimal list-inside space-y-1">
                <li>Entrez le numéro du badge dans le champ ci-dessus</li>
                <li>Cliquez sur "Rechercher" pour vérifier le badge</li>
                <li>Sélectionnez l'état du badge au moment du retour</li>
                <li>Ajoutez des notes si nécessaire</li>
                <li>Cliquez sur "Confirmer le retour" pour finaliser</li>
              </ol>
            </div>
          </div>
        )}
        
        {/* List of badges in circulation - optional help */}
        {!foundBadge && !issuanceRecord && (
          <div className="mt-6 bg-gray-50 rounded-lg border border-gray-200 p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4 text-gray-600" />
              Badges actuellement en circulation
            </h4>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {getIssuedBadges().slice(0, 6).map(badge => {
                const record = getActiveBadgeIssuance(badge.id);
                return (
                  <div 
                    key={badge.id}
                    className="p-2 border border-gray-200 rounded-lg bg-white hover:border-blue-300 cursor-pointer"
                    onClick={() => {
                      setBadgeNumber(badge.badgeNumber);
                      setSearchAttempted(false);
                      setError(null);
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm text-gray-900">{badge.badgeNumber}</span>
                      <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded">
                        {record?.visitorName?.split(' ')[0] || 'Visiteur'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Annuler
          </button>
          
          <button
            type="submit"
            disabled={!foundBadge || !issuanceRecord || isSubmitting}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              foundBadge && issuanceRecord && !isSubmitting
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Traitement...</span>
              </>
            ) : (
              <>
                <ArrowLeftRight className="h-4 w-4" />
                <span>Confirmer le retour</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};