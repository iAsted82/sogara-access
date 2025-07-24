import React, { useState, useEffect } from 'react';
import { 
  User, Search, Calendar, AlertTriangle, Camera, QrCode,
  CheckCircle, X, Smartphone, Mail, Briefcase, FileText,
  Clock, MapPin, Shield, Package, ChevronDown, ChevronUp,
  RefreshCw, Tag
} from 'lucide-react';
import { AppointmentVerificationResult, verifyVisitorAppointment } from '../../utils/appointmentHelpers';
import { Appointment } from '../../types/appointment';
import { AppointmentVerification } from './AppointmentVerification';

interface VisitorRegistrationFormProps {
  appointments: Appointment[];
  onRegisterVisitor: (visitorData: any) => void;
  onAppointmentSelected?: (appointment: Appointment | null) => void;
  initialData?: any;
  availableBadges?: any[];
  onBadgeSelected?: (badge: any) => void;
  isEdit?: boolean;
  className?: string;
}

export const VisitorRegistrationForm: React.FC<VisitorRegistrationFormProps> = ({
  appointments,
  onRegisterVisitor,
  onAppointmentSelected,
  initialData,
  availableBadges = [],
  onBadgeSelected,
  isEdit = false,
  className = ''
}) => {
  // Selected appointment - must be declared before formData
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedBadge, setSelectedBadge] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || (selectedAppointment ? getFirstName(selectedAppointment.citizenName) : ''),
    lastName: initialData?.lastName || (selectedAppointment ? getLastName(selectedAppointment.citizenName) : ''),
    phone: initialData?.phone || selectedAppointment?.citizenPhone || '',
    email: initialData?.email || selectedAppointment?.citizenEmail || '',
    company: initialData?.company || '',
    idType: initialData?.idType || 'CNI',
    idNumber: initialData?.idNumber || '',
    purposeOfVisit: initialData?.purposeOfVisit || selectedAppointment?.purpose || '',
    serviceRequested: initialData?.serviceRequested || selectedAppointment?.service || '',
    employeeToVisit: initialData?.employeeToVisit || selectedAppointment?.agent || '',
    department: initialData?.department || selectedAppointment?.department || '',
    expectedDuration: initialData?.expectedDuration || selectedAppointment?.duration.toString() || '30',
    urgencyLevel: initialData?.urgencyLevel || selectedAppointment?.priority || 'normal',
    notes: initialData?.notes || selectedAppointment?.notes || ''
  });

  // Form section visibility
  const [showAppointmentSection, setShowAppointmentSection] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [showBadgeSelector, setShowBadgeSelector] = useState(false);

  // Appointment verification
  const [verificationResult, setVerificationResult] = useState<AppointmentVerificationResult>({
    isExpected: false,
    appointments: [],
    matchType: 'none'
  });
  
  // Check for appointment when name is entered
  useEffect(() => {
    // Send the visitor name and contact info to parent component for real-time verification
    if (onAppointmentSelected && selectedAppointment) {
      onAppointmentSelected(selectedAppointment);
    }
  }, [selectedAppointment, onAppointmentSelected]);

  // Update parent component when a badge is selected
  useEffect(() => {
    if (onBadgeSelected && selectedBadge) {
      onBadgeSelected(selectedBadge);
    }
  }, [selectedBadge, onBadgeSelected]);

  useEffect(() => {
    if (formData.firstName && formData.lastName) {
      const fullName = `${formData.firstName} ${formData.lastName}`;
      const result = verifyVisitorAppointment(appointments, fullName, formData.phone, formData.email);
      
      setVerificationResult(result);
      setShowAppointmentSection(result.isExpected);
      
      // If exact match, pre-fill form data
      if (result.matchType === 'exact' && result.exactMatch) {
        prefillFormFromAppointment(result.exactMatch);
      }
    } else {
      setVerificationResult({
        isExpected: false,
        appointments: [],
        matchType: 'none'
      });
    }
  }, [formData.firstName, formData.lastName, formData.phone, formData.email, appointments]);

  // Pre-fill form data from appointment
  const prefillFormFromAppointment = (appointment: Appointment) => {
    // Extract first and last name from full name
    const nameParts = appointment.citizenName.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');
    
    setFormData(prev => ({
      ...prev,
      firstName: firstName || prev.firstName,
      lastName: lastName || prev.lastName,
      phone: appointment.citizenPhone || prev.phone,
      email: appointment.citizenEmail || prev.email,
      purposeOfVisit: appointment.purpose || prev.purposeOfVisit,
      serviceRequested: appointment.service || prev.serviceRequested,
      department: appointment.department || prev.department,
      expectedDuration: appointment.duration.toString() || prev.expectedDuration,
      urgencyLevel: appointment.priority || prev.urgencyLevel,
      notes: appointment.notes || prev.notes
    }));

    // Update selected appointment
    setSelectedAppointment(appointment);
    
    if (onAppointmentSelected) {
      onAppointmentSelected(appointment);
    }
  };

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle badge selection
  const handleBadgeSelection = (badge: any) => {
    setSelectedBadge(badge);
    if (onBadgeSelected) {
      onBadgeSelected(badge);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create visitor data object
      const visitorData = {
        ...(initialData || {}), // Spread any existing data (for edit mode)
        ...formData,
        badgeId: selectedBadge?.id,
        badgeNumber: selectedBadge?.badgeNumber,
        fullName: `${formData.firstName} ${formData.lastName}`,
        hasAppointment: verificationResult.isExpected,
        appointmentId: selectedAppointment?.id,
        appointmentStatus: selectedAppointment?.status,
        registrationTime: new Date().toISOString(),
        appointmentVerified: selectedAppointment ? true : false,
        appointmentMatchType: verificationResult.matchType,
        badgeNumber: initialData?.badgeNumber // Preserve badge number if editing
      };

      onRegisterVisitor(visitorData);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle appointment selection
  const handleAppointmentSelected = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    prefillFormFromAppointment(appointment);
    
    if (onAppointmentSelected) {
      onAppointmentSelected(appointment);
    }
  };

  // Helper functions to extract first and last name
  function getFirstName(fullName: string): string {
    const parts = fullName.split(' ');
    return parts[0] || '';
  }

  function getLastName(fullName: string): string {
    const parts = fullName.split(' ');
    return parts.slice(1).join(' ') || '';
  }

  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden ${className}`}>
      <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-blue-900">Enregistrement Visiteur</h3>
            <p className="text-sm text-blue-700">
              {isEdit ? 'Modifiez les informations du visiteur' : 'Saisissez les informations du visiteur'}
            </p>
          </div>
          <button
            onClick={() => window.location.hash = 'visitors/planning'}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1.5"
          >
            <Calendar className="h-4 w-4" />
            Voir les visites prévues
          </button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Visitor's Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-5">
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="space-y-1">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Téléphone *
              </label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+241 XX XX XX XX"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-5">
            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="nom@example.com"
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                Entreprise / Organisation
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="space-y-1 w-1/3">
                <label htmlFor="idType" className="block text-sm font-medium text-gray-700">
                  Type d'ID
                </label>
                <select
                  id="idType"
                  name="idType"
                  value={formData.idType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="CNI">CNI</option>
                  <option value="passeport">Passeport</option>
                  <option value="permis">Permis</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
              
              <div className="space-y-1 flex-1">
                <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700">
                  Numéro d'ID
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="idNumber"
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Appointment Verification Section */}
        {showAppointmentSection && (
          <div className="border-t border-b border-gray-200 py-6">
            <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Vérification des Visites Prévues
            </h4>
            
            <AppointmentVerification 
              verificationResult={verificationResult}
              onSelectAppointment={handleAppointmentSelected}
            />
          </div>
        )}
        
        {/* Visit Purpose */}
        <div className="space-y-5">
          <h4 className="text-md font-semibold text-gray-900 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            Motif de la Visite
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label htmlFor="purposeOfVisit" className="block text-sm font-medium text-gray-700">
                Motif de visite *
              </label>
              <input
                type="text"
                id="purposeOfVisit"
                name="purposeOfVisit"
                value={formData.purposeOfVisit}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Demande de CNI"
              />
            </div>
            
            <div className="space-y-1">
              <label htmlFor="serviceRequested" className="block text-sm font-medium text-gray-700">
                Service concerné *
              </label>
              <select
                id="serviceRequested"
                name="serviceRequested"
                value={formData.serviceRequested}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Sélectionner un service</option>
                <option value="Documentation">Documentation</option>
                <option value="Passeports">Passeports</option>
                <option value="Immigration">Immigration</option>
                <option value="Direction">Direction</option>
                <option value="Administration">Administration</option>
              </select>
            </div>
            
            <div className="space-y-1">
              <label htmlFor="employeeToVisit" className="block text-sm font-medium text-gray-700">
                Personne à rencontrer *
              </label>
              <input
                type="text"
                id="employeeToVisit"
                name="employeeToVisit"
                value={formData.employeeToVisit}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="space-y-1">
              <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                Département
              </label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-5">
            <div className="md:w-1/3 space-y-1">
              <label htmlFor="expectedDuration" className="block text-sm font-medium text-gray-700">
                Durée estimée *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  id="expectedDuration"
                  name="expectedDuration"
                  value={formData.expectedDuration}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">1 heure</option>
                  <option value="90">1h30</option>
                  <option value="120">2 heures</option>
                </select>
              </div>
            </div>
            
            <div className="md:w-1/3 space-y-1">
              <label htmlFor="urgencyLevel" className="block text-sm font-medium text-gray-700">
                Niveau d'urgence
              </label>
              <div className="relative">
                <AlertTriangle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  id="urgencyLevel"
                  name="urgencyLevel"
                  value={formData.urgencyLevel}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="normal">Normal</option>
                  <option value="high">Prioritaire</option>
                  <option value="vip">VIP</option>
                </select>
              </div>
            </div>
            
            <div className="md:w-1/3 space-y-1">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={1}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Informations complémentaires..."
              />
            </div>
          </div>
        </div>
        
        {/* Advanced Options Toggle */}
        <div className="border-t border-gray-200 pt-4">
          <button
            type="button"
            onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            {showAdvancedOptions ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            {showAdvancedOptions ? 'Masquer les options avancées' : 'Afficher les options avancées'}
          </button>
          
          {showAdvancedOptions && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-4">
              {/* Access Mode */}
              <div className="space-y-1">
                <label htmlFor="accessMode" className="block text-sm font-medium text-gray-700">
                  Mode d'accès
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    id="accessMode"
                    name="accessMode"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="badge">Badge</option>
                    <option value="escorte">Avec escorte</option>
                    <option value="libre">Libre</option>
                  </select>
                </div>
              </div>
              
              {/* Badge Generation */}
              <div className="space-y-1">
                <label htmlFor="badgeType" className="block text-sm font-medium text-gray-700">
                  Type de badge
                </label>
                <div className="flex items-start gap-3">
                  <div className="relative w-full">
                    <QrCode className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder={selectedBadge ? `Badge ${selectedBadge.badgeNumber} sélectionné` : "Sélectionnez un badge..."}
                      readOnly
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                      onClick={() => setShowBadgeSelector(!showBadgeSelector)}
                    />
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>
                
                {/* Badge Selector Dropdown */}
                {showBadgeSelector && availableBadges.length > 0 && (
                  <div className="relative">
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                      <div className="max-h-60 overflow-y-auto p-2">
                        <div className="py-2 px-3 border-b border-gray-200 mb-1">
                          <div className="text-xs text-gray-500">Badges disponibles: {availableBadges.length}</div>
                        </div>
                        {availableBadges.map((badge, index) => (
                          <div
                            key={badge.id}
                            onClick={() => {
                              handleBadgeSelection(badge);
                              setShowBadgeSelector(false);
                            }}
                            className={`cursor-pointer p-2 rounded ${
                              selectedBadge?.id === badge.id ? 'bg-blue-50 border-blue-300 border' : 'hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Tag className={`h-4 w-4 ${
                                  badge.category === 'vip' ? 'text-yellow-600' :
                                  badge.category === 'temporary' ? 'text-orange-600' :
                                  'text-blue-600'
                                }`} />
                                <span className="font-medium">{badge.badgeNumber}</span>
                              </div>
                              {badge.category && (
                                <div className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                                  {badge.category}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                        {availableBadges.length === 0 && (
                          <div className="p-4 text-center text-sm text-gray-500">
                            Aucun badge disponible
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {availableBadges.length === 0 && (
                  <div className="mt-2 text-xs text-red-600">
                    Aucun badge disponible. Veuillez en ajouter dans la gestion des badges.
                  </div>
                )}
              </div>
              
              {/* Kept Items */}
              <div className="space-y-1">
                <label htmlFor="keptItems" className="block text-sm font-medium text-gray-700">
                  Objets gardés
                </label>
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="keptItems"
                    name="keptItems"
                    placeholder="Colis, téléphone, etc."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Form Actions */}
        <div className="pt-4 border-t border-gray-200 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
          {/* Appointment Information Badge */}
          {selectedAppointment && (
            <div className={`text-sm px-3 py-1.5 rounded-full inline-flex items-center gap-1 ${
              verificationResult.matchType === 'exact' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              <Calendar className="h-4 w-4" />
              Visite prévue {selectedAppointment.id} sélectionnée
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors flex items-center gap-2"
            >
              <Camera className="h-5 w-5" />
              Scanner
            </button>
            
            <button
              type="submit"
              disabled={isLoading || (!selectedBadge && availableBadges.length > 0)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center gap-2"
            >
              {isLoading ? 
                <RefreshCw className="h-5 w-5 animate-spin" /> : 
                <CheckCircle className="h-5 w-5" />
              }
              {isEdit ? 'Mettre à jour' : 'Enregistrer'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};