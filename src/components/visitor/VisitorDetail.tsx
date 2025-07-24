import React, { useState } from 'react';
import { 
  User, X, Edit, Trash2, CheckCircle, Calendar, Clock, 
  Building2, Phone, Mail, MapPin, FileText, Tag,
  Printer, Download, ArrowLeftRight, QrCode, AlignLeft,
  Shield, AlertTriangle
} from 'lucide-react';
import { Appointment } from '../../types/appointment';
import { VisitorAppointmentIndicator } from './VisitorAppointmentIndicator';

interface Visitor {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  badgeNumber: string;
  checkInTime: string;
  checkOutTime?: string;
  company?: string;
  phone: string;
  email?: string;
  purposeOfVisit: string;
  serviceRequested: string;
  employeeToVisit: string;
  department: string;
  expectedDuration: string;
  status: 'present' | 'completed' | 'overdue';
  appointmentId?: string;
  idType: string;
  idNumber: string;
  notes?: string;
  photo?: string;
}

interface VisitorDetailProps {
  visitor: Visitor;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onCheckout?: () => void;
  onExport: () => void;
  appointments: Appointment[];
}

export const VisitorDetail: React.FC<VisitorDetailProps> = ({
  visitor,
  onClose,
  onEdit,
  onDelete,
  onCheckout,
  onExport,
  appointments
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'history' | 'documents'>('info');
  
  // Trouver le rendez-vous correspondant
  const appointment = appointments.find(a => a.id === visitor.appointmentId);
  
  // Calculer la durée de la visite
  const calculateDuration = () => {
    if (!visitor.checkInTime) return 'Non défini';
    if (!visitor.checkOutTime) {
      if (visitor.status === 'completed') return 'Non enregistré';
      
      // Calculer la durée jusqu'à maintenant pour les visiteurs présents
      const start = new Date(visitor.checkInTime);
      const now = new Date();
      const diffMs = now.getTime() - start.getTime();
      const diffMins = Math.round(diffMs / 60000);
      
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      
      if (hours > 0) {
        return `${hours}h ${mins}m (en cours)`;
      }
      return `${mins}m (en cours)`;
    } else {
      // Calculer la durée totale pour les visites terminées
      const start = new Date(visitor.checkInTime);
      const end = new Date(visitor.checkOutTime);
      const diffMs = end.getTime() - start.getTime();
      const diffMins = Math.round(diffMs / 60000);
      
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      
      if (hours > 0) {
        return `${hours}h ${mins}m`;
      }
      return `${mins}m`;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden">
      {/* En-tête */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="flex items-center gap-6">
          {/* Photo du visiteur */}
          <div className="h-24 w-24 rounded-full bg-blue-400 flex items-center justify-center overflow-hidden border-4 border-white">
            {visitor.photo ? (
              <img 
                src={visitor.photo} 
                alt={visitor.fullName} 
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-12 w-12 text-white" />
            )}
          </div>
          
          {/* Informations principales */}
          <div>
            <h2 className="text-2xl font-bold mb-1">{visitor.fullName}</h2>
            
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                visitor.status === 'present' ? 'bg-green-500/20 text-green-50' :
                visitor.status === 'completed' ? 'bg-blue-500/20 text-blue-50' :
                'bg-orange-500/20 text-orange-50'
              }`}>
                {visitor.status === 'present' ? 'Présent' :
                 visitor.status === 'completed' ? 'Visite terminée' :
                 'Dépassement'}
              </span>
              
              {visitor.company && (
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  {visitor.company}
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-blue-100">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date(visitor.checkInTime).toLocaleDateString('fr-FR')}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {new Date(visitor.checkInTime).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}
                {visitor.checkOutTime && ` - ${new Date(visitor.checkOutTime).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}`}
              </div>
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                {visitor.badgeNumber}
              </div>
            </div>
          </div>
        </div>
        <div className="text-center text-xs text-gray-500 pt-2">
          Ce document a été généré par SOGARA Access le {new Date().toLocaleString('fr-FR')}.<br/>
        </div>
      </div>
      
      {/* Onglets de navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          <button
            onClick={() => setActiveTab('info')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'info'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Informations
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'history'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Historique
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'documents'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Documents
          </button>
        </nav>
      </div>
      
      {/* Contenu de l'onglet */}
      <div className="p-6">
        {activeTab === 'info' && (
          <div className="space-y-6">
            {/* Si lié à un rendez-vous, afficher les détails */}
            {appointment && (
              <div className="mb-4">
                <VisitorAppointmentIndicator 
                  appointment={appointment}
                />
              </div>
            )}
            
            {/* Informations de la visite */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations de la Visite</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Motif:</span>
                    <span className="text-sm font-medium text-gray-900">{visitor.purposeOfVisit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Service:</span>
                    <span className="text-sm font-medium text-gray-900">{visitor.serviceRequested}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Personne à voir:</span>
                    <span className="text-sm font-medium text-gray-900">{visitor.employeeToVisit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Département:</span>
                    <span className="text-sm font-medium text-gray-900">{visitor.department}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Heure d'arrivée:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(visitor.checkInTime).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Heure de sortie:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {visitor.checkOutTime ? new Date(visitor.checkOutTime).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'}) : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Durée prévue:</span>
                    <span className="text-sm font-medium text-gray-900">{visitor.expectedDuration} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Durée réelle:</span>
                    <span className="text-sm font-medium text-gray-900">{calculateDuration()}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Coordonnées du visiteur */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Coordonnées du Visiteur</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-sm text-gray-500">Téléphone</div>
                      <div className="text-base font-medium text-gray-900">{visitor.phone}</div>
                    </div>
                  </div>
                  
                  {visitor.email && (
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <div className="text-sm text-gray-500">Email</div>
                        <div className="text-base font-medium text-gray-900">{visitor.email}</div>
                      </div>
                    </div>
                  )}
                  
                  {visitor.company && (
                    <div className="flex items-start gap-3">
                      <Building2 className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <div className="text-sm text-gray-500">Entreprise/Organisation</div>
                        <div className="text-base font-medium text-gray-900">{visitor.company}</div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-sm text-gray-500">Pièce d'identité</div>
                      <div className="text-base font-medium text-gray-900">{visitor.idType === 'CNI' ? 'CNI' : 
                                                                       visitor.idType === 'passeport' ? 'Passeport' : 
                                                                       visitor.idType}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <AlignLeft className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-sm text-gray-500">Numéro</div>
                      <div className="text-base font-medium text-gray-900">{visitor.idNumber}</div>
                    </div>
                  </div>
                  
                  {visitor.notes && (
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <div className="text-sm text-gray-500">Notes</div>
                        <div className="text-base font-medium text-gray-900">{visitor.notes}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Badge et accès */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Badge et Accès</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-blue-600">Numéro de badge:</span>
                      <span className="text-sm font-medium text-blue-900">{visitor.badgeNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-blue-600">Statut du badge:</span>
                      <span className={`text-sm font-medium ${visitor.status === 'completed' ? 'text-green-600' : 'text-blue-900'}`}>
                        {visitor.status === 'completed' ? 'Retourné' : 'En circulation'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-blue-600">Zones autorisées:</span>
                      <span className="text-sm font-medium text-blue-900">Accueil, {visitor.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-blue-600">Niveau de sécurité:</span>
                      <span className="text-sm font-medium text-blue-900">Standard</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-center justify-center bg-white p-4 rounded-lg border border-blue-200">
                  <QrCode className="h-16 w-16 text-blue-600 mb-2" />
                  <div className="text-xs text-blue-600 text-center">
                    QR Code du badge<br/>
                    {visitor.badgeNumber}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'history' && (
          <div>
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Historique des Visites</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-blue-900">{new Date(visitor.checkInTime).toLocaleDateString('fr-FR', { dateStyle: 'long' })}</div>
                      <div className="text-sm text-blue-600">
                        {new Date(visitor.checkInTime).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}
                        {visitor.checkOutTime && ` - ${new Date(visitor.checkOutTime).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}`}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-blue-900">{visitor.purposeOfVisit}</div>
                    <div className="text-xs text-blue-600">{visitor.serviceRequested}</div>
                  </div>
                </div>
                
                <div className="text-center py-4 text-gray-500">
                  Pas de visites antérieures enregistrées.
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'documents' && (
          <div>
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents Associés</h3>
              
              <div className="text-center py-6">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-medium text-gray-700 mb-1">Aucun document</h4>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  Ce visiteur n'a pas de documents associés à sa visite.
                </p>
                <div className="mt-4">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto">
                    <FileText className="h-4 w-4" />
                    Ajouter un document
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Actions */}
      <div className="bg-gray-50 p-4 border-t border-gray-200 flex flex-wrap justify-end gap-3">
        {onCheckout && (
          <button 
            onClick={onCheckout}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            Marquer comme sorti
          </button>
        )}
        
        <button 
          onClick={onEdit}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Edit className="h-4 w-4" />
          Modifier
        </button>
        
        <button 
          onClick={onExport}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Exporter
        </button>
        
        <button 
          onClick={onDelete}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Supprimer
        </button>
      </div>
    </div>
  );
};