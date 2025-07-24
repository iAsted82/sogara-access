import React, { useState, useEffect } from 'react';
import { User, Building2, Phone, Mail, MapPin, FileText, CheckCircle, XCircle, Camera } from 'lucide-react';
import { StaffMember, StaffFormData } from '../../types/staff';
import { validateStaffForm } from '../../utils/staffUtils';
import { getAllDepartments } from '../../data/staffData';

interface StaffFormProps {
  initialData?: StaffFormData;
  onSubmit: (data: StaffFormData) => void;
  onCancel: () => void;
  isEdit?: boolean;
}

export const StaffForm: React.FC<StaffFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isEdit = false
}) => {
  // Default empty form data
  const defaultFormData: StaffFormData = {
    firstName: '',
    lastName: '',
    function: '',
    department: '',
    internalPhone: '',
    email: '',
    isAvailable: true,
    location: '',
    notes: ''
  };
  
  // Form state
  const [formData, setFormData] = useState<StaffFormData>(initialData || defaultFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get all departments for dropdown
  const allDepartments = getAllDepartments();
  
  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Handle checkbox inputs
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: checkbox.checked
      }));
    } else {
      // Handle text inputs and selects
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Mark form as dirty when changes are made
    setIsDirty(true);
    
    // Clear error for this field when value changes
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate form
    const validation = validateStaffForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setIsSubmitting(false);
      return;
    }
    
    // Submit if valid
    onSubmit(formData);
    setIsSubmitting(false);
  };
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900">
          {isEdit ? 'Modifier un membre du personnel' : 'Ajouter un membre du personnel'}
        </h3>
        <p className="text-sm text-blue-700">
          {isEdit
            ? 'Modifiez les informations de ce membre du personnel'
            : 'Saisissez les informations du nouveau membre du personnel'}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Personal Information */}
        <div className="space-y-5">
          <h4 className="text-md font-semibold text-gray-900 flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            Informations Personnelles
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                Prénom *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 border ${
                  errors.firstName ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
              {errors.firstName && (
                <p className="text-sm text-red-600 mt-1">{errors.firstName}</p>
              )}
            </div>
            
            <div className="space-y-1">
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Nom *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 border ${
                  errors.lastName ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
              {errors.lastName && (
                <p className="text-sm text-red-600 mt-1">{errors.lastName}</p>
              )}
            </div>
            
            <div className="space-y-1 md:col-span-2">
              <label htmlFor="function" className="block text-sm font-medium text-gray-700">
                Fonction *
              </label>
              <input
                type="text"
                id="function"
                name="function"
                value={formData.function}
                onChange={handleChange}
                required
                placeholder="Ex: Agent de Guichet, Chef Service, etc."
                className={`w-full px-4 py-2 border ${
                  errors.function ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
              {errors.function && (
                <p className="text-sm text-red-600 mt-1">{errors.function}</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Department & Contact Information */}
        <div className="space-y-5 pt-4 border-t border-gray-200">
          <h4 className="text-md font-semibold text-gray-900 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            Département & Contact
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                Département *
              </label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 border ${
                  errors.department ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              >
                <option value="">Sélectionner un département</option>
                {allDepartments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
                <option value="autre">Autre...</option>
              </select>
              {errors.department && (
                <p className="text-sm text-red-600 mt-1">{errors.department}</p>
              )}
            </div>
            
            <div className="space-y-1">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Localisation
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location || ''}
                  onChange={handleChange}
                  placeholder="Bureau, étage, bâtiment..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <label htmlFor="internalPhone" className="block text-sm font-medium text-gray-700">
                Téléphone Interne *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="internalPhone"
                  name="internalPhone"
                  value={formData.internalPhone}
                  onChange={handleChange}
                  required
                  placeholder="Ex: 4001"
                  className={`w-full pl-10 pr-4 py-2 border ${
                    errors.internalPhone ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
              </div>
              {errors.internalPhone && (
                <p className="text-sm text-red-600 mt-1">{errors.internalPhone}</p>
              )}
            </div>
            
            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Professionnel *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="nom.prenom@sogara.ga"
                  className={`w-full pl-10 pr-4 py-2 border ${
                    errors.email ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email}</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Additional Information */}
        <div className="space-y-5 pt-4 border-t border-gray-200">
          <h4 className="text-md font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Informations Additionnelles
          </h4>
          
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <label htmlFor="isAvailable" className="text-sm font-medium text-gray-700">
                Disponibilité:
              </label>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="isAvailableYes"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={() => setFormData(prev => ({ ...prev, isAvailable: true }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isAvailableYes" className="ml-2 block text-sm text-gray-700 flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Présent
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="isAvailableNo"
                    name="isAvailable"
                    checked={!formData.isAvailable}
                    onChange={() => setFormData(prev => ({ ...prev, isAvailable: false }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isAvailableNo" className="ml-2 block text-sm text-gray-700 flex items-center gap-1">
                    <XCircle className="h-4 w-4 text-red-500" />
                    Absent
                  </label>
                </div>
              </div>
            </div>
            
            <div className="space-y-1">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes || ''}
                onChange={handleChange}
                rows={3}
                placeholder="Informations supplémentaires..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
            
            <div className="space-y-1">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Rôle dans l'organisation
              </label>
              <input
                type="text"
                id="role"
                name="role"
                value={formData.role || ''}
                onChange={handleChange}
                placeholder="Ex: Administrateur, Utilisateur, Manager..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="space-y-1">
              <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
                Compétences
              </label>
              <input
                type="text"
                id="skills"
                name="skills"
                value={formData.skills?.join(', ') || ''}
                onChange={(e) => {
                  const skillsArray = e.target.value.split(',').map(skill => skill.trim()).filter(Boolean);
                  setFormData(prev => ({ ...prev, skills: skillsArray }));
                }}
                placeholder="Ex: Management, Documentation, Administration..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Séparez les compétences par des virgules</p>
            </div>
            
            <div className="space-y-1">
              <label htmlFor="languages" className="block text-sm font-medium text-gray-700">
                Langues
              </label>
              <input
                type="text"
                id="languages"
                name="languages"
                value={formData.languages?.join(', ') || ''}
                onChange={(e) => {
                  const languagesArray = e.target.value.split(',').map(lang => lang.trim()).filter(Boolean);
                  setFormData(prev => ({ ...prev, languages: languagesArray }));
                }}
                placeholder="Ex: Français, Anglais, Espagnol..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Séparez les langues par des virgules</p>
            </div>
            
            <div className="space-y-1">
              <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700">
                Contact d'urgence
              </label>
              <input
                type="text"
                id="emergencyContact"
                name="emergencyContact"
                value={formData.emergencyContact || ''}
                onChange={handleChange}
                placeholder="Nom et numéro de téléphone"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="space-y-1">
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                Date d'entrée
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="rounded-lg border border-dashed border-gray-300 p-4 text-center">
              <div className="flex flex-col items-center">
                <Camera className="h-6 w-6 text-gray-400 mb-2" />
                <div className="text-sm text-gray-500">Photo du personnel</div>
                <div className="text-xs text-gray-400 mt-1">Fonctionnalité à venir</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row sm:justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            Annuler
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting || (!isDirty && isEdit)}
            className={`px-4 py-2 bg-blue-600 text-white rounded-lg font-medium transition-colors ${
              isSubmitting 
                ? 'opacity-70 cursor-not-allowed'
                : 'hover:bg-blue-700'
            } ${!isDirty && isEdit ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Traitement...' : isEdit ? 'Mettre à jour' : 'Ajouter'}
          </button>
        </div>
      </form>
    </div>
  );
};