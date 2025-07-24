import React, { useState } from 'react';
import { Calendar, Clock, AlignJustify, User, X, Check } from 'lucide-react';
import { StaffMember } from '../../types/staff';

interface AbsenceFormProps {
  staff: StaffMember;
  onSubmit: (data: { reason: string; duration: string; returnDate?: string }) => void;
  onCancel: () => void;
}

export const AbsenceForm: React.FC<AbsenceFormProps> = ({ staff, onSubmit, onCancel }) => {
  const [reason, setReason] = useState('');
  const [duration, setDuration] = useState('day');
  const [returnDate, setReturnDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason) {
      alert('Veuillez indiquer un motif d\'absence');
      return;
    }
    
    setIsSubmitting(true);
    
    // Submit the data
    onSubmit({
      reason,
      duration,
      returnDate: returnDate || undefined
    });
    
    setIsSubmitting(false);
  };
  
  // Format date with day name
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-red-50 p-4 border-b border-red-200">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-red-900 flex items-center gap-2">
              <Clock className="h-5 w-5 text-red-600" />
              Enregistrer une absence
            </h3>
            
            <button
              onClick={onCancel}
              className="p-1 hover:bg-red-100 rounded-lg"
            >
              <X className="h-5 w-5 text-red-600" />
            </button>
          </div>
          
          <div className="flex items-center gap-3 mt-2 text-red-800">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <User className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <div className="font-medium">{staff.firstName} {staff.lastName}</div>
              <div className="text-sm text-red-700">{staff.function}</div>
            </div>
          </div>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Motif d'absence */}
          <div className="space-y-1">
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
              Motif d'absence *
            </label>
            <div className="relative">
              <AlignJustify className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Congé maladie, formation, congé..."
              />
            </div>
          </div>
          
          {/* Durée d'absence */}
          <div className="space-y-1">
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
              Durée prévue
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="hour">Quelques heures</option>
                <option value="day">La journée</option>
                <option value="days">Quelques jours</option>
                <option value="week">Une semaine</option>
                <option value="weeks">Plusieurs semaines</option>
                <option value="undetermined">Indéterminée</option>
              </select>
            </div>
          </div>
          
          {/* Date de retour prévue */}
          {(['days', 'week', 'weeks'].includes(duration)) && (
            <div className="space-y-1">
              <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700">
                Date de retour prévue
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  id="returnDate"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min={getTomorrowDate()}
                />
              </div>
            </div>
          )}
          
          {/* Message automatique */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Message automatique aux visiteurs</h4>
            <p className="text-sm text-blue-800">
              <span className="font-medium">{staff.firstName} {staff.lastName}</span> est actuellement 
              {reason ? <span> absent(e) pour <span className="font-medium">{reason}</span></span> : <span> indisponible</span>}
              {returnDate ? <span> jusqu'au <span className="font-medium">{new Date(returnDate).toLocaleDateString('fr-FR')}</span></span> : ''}.
            </p>
          </div>
        </form>
        
        {/* Actions */}
        <div className="flex justify-end gap-3 p-6 bg-gray-50 border-t border-gray-200">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !reason}
            className={`px-4 py-2 ${
              reason ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-red-300 text-white cursor-not-allowed'
            } rounded-lg transition-colors flex items-center gap-2`}
          >
            <Check className="h-4 w-4" />
            Confirmer l'absence
          </button>
        </div>
      </div>
    </div>
  );
};