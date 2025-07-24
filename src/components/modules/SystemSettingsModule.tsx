import React, { useState } from 'react';
import { Settings, Shield, Bell, Server, Database, Globe, Mail, MessageSquare, Clock, Calendar, Languages, Save, RefreshCw, Download, Upload, AlertTriangle, HelpCircle, CheckCircle, ChevronDown, Search, Code, Cpu, Layout, Layers, Lock, Key, EyeOff, UserCheck, Wallet, BellRing, Smartphone, PanelLeft, CloudOff, Cloud as CloudSync, Trash2, Archive, Info } from 'lucide-react';

export const SystemSettingsModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('general');
  const [formChanged, setFormChanged] = useState<boolean>(false);
  const [backupInProgress, setBackupInProgress] = useState<boolean>(false);

  const simulateBackup = () => {
    setBackupInProgress(true);
    setTimeout(() => {
      setBackupInProgress(false);
      alert('Sauvegarde terminée avec succès!');
    }, 3000);
  };

  return (
    <div className="space-y-6 p-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Paramètres Système</h1>
          <p className="text-gray-600">Configuration avancée et personnalisation de la plateforme</p>
        </div>
        <div className="flex space-x-3">
          {formChanged && (
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
              <Save className="h-4 w-4" />
              <span>Enregistrer les modifications</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200">
        <div className="border-b border-gray-200 overflow-x-auto">
          <nav className="flex space-x-6 p-4">
            <button
              className={`py-2 px-1 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'general'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('general')}
            >
              Général
            </button>
            <button
              className={`py-2 px-1 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'security'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('security')}
            >
              Sécurité
            </button>
            <button
              className={`py-2 px-1 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'appearance'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('appearance')}
            >
              Apparence
            </button>
            <button
              className={`py-2 px-1 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'notifications'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('notifications')}
            >
              Notifications
            </button>
            <button
              className={`py-2 px-1 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'backups'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('backups')}
            >
              Sauvegardes
            </button>
            <button
              className={`py-2 px-1 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'integrations'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('integrations')}
            >
              Intégrations
            </button>
            <button
              className={`py-2 px-1 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'system'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('system')}
            >
              Système
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Onglet Général */}
          {activeTab === 'general' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations générales</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="site-title" className="block text-sm font-medium text-gray-700 mb-1">
                        Titre du site
                      </label>
                      <input
                        type="text"
                        id="site-title"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        defaultValue="DGDI Access - Direction Générale Documentation et Immigration"
                        onChange={() => setFormChanged(true)}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="site-description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description du site
                      </label>
                      <textarea
                        id="site-description"
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        defaultValue="Système de gestion intégré de la Direction Générale de la Documentation et de l'Immigration du Gabon"
                        onChange={() => setFormChanged(true)}
                      ></textarea>
                    </div>
                    
                    <div>
                      <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email de contact
                      </label>
                      <input
                        type="email"
                        id="contact-email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        defaultValue="contact@dgdi.ga"
                        onChange={() => setFormChanged(true)}
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Paramètres régionaux</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">
                        Fuseau horaire
                      </label>
                      <select
                        id="timezone"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        defaultValue="Africa/Libreville"
                        onChange={() => setFormChanged(true)}
                      >
                        <option value="Africa/Libreville">Afrique/Libreville (GMT+1)</option>
                        <option value="Europe/Paris">Europe/Paris (GMT+2)</option>
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">Amérique/New York (GMT-4)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="date-format" className="block text-sm font-medium text-gray-700 mb-1">
                        Format de date
                      </label>
                      <select
                        id="date-format"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        defaultValue="DD/MM/YYYY"
                        onChange={() => setFormChanged(true)}
                      >
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        <option value="DD-MM-YYYY">DD-MM-YYYY</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                        Langue par défaut
                      </label>
                      <select
                        id="language"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        defaultValue="fr"
                        onChange={() => setFormChanged(true)}
                      >
                        <option value="fr">Français</option>
                        <option value="en">Anglais</option>
                        <option value="es">Espagnol</option>
                        <option value="pt">Portugais</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuration du système</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-gray-500 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Durée de session</p>
                        <p className="text-xs text-gray-600">Temps avant déconnexion automatique</p>
                      </div>
                    </div>
                    <select
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      defaultValue="30"
                      onChange={() => setFormChanged(true)}
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">1 heure</option>
                      <option value="120">2 heures</option>
                      <option value="240">4 heures</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                      <Layers className="h-5 w-5 text-gray-500 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Cache système</p>
                        <p className="text-xs text-gray-600">Améliore les performances du site</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                      <Layout className="h-5 w-5 text-gray-500 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Page d'accueil administrative</p>
                        <p className="text-xs text-gray-600">Page affichée après connexion</p>
                      </div>
                    </div>
                    <select
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      defaultValue="dashboard"
                      onChange={() => setFormChanged(true)}
                    >
                      <option value="dashboard">Tableau de bord</option>
                      <option value="content">Gestion de contenu</option>
                      <option value="stats">Statistiques</option>
                      <option value="users">Utilisateurs</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Onglet Sécurité */}
          {activeTab === 'security' && (
            <div className="space-y-8">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Attention aux paramètres de sécurité</h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        Ces paramètres sont critiques pour la protection des données sensibles du système DGDI. 
                        Veuillez consulter le protocole de sécurité avant toute modification.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Authentification</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center">
                        <UserCheck className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Authentification à deux facteurs</p>
                          <p className="text-xs text-gray-600">Obligatoire pour tous les utilisateurs</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center">
                        <Lock className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Complexité du mot de passe</p>
                          <p className="text-xs text-gray-600">Exigences minimales de sécurité</p>
                        </div>
                      </div>
                      <select
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        defaultValue="high"
                        onChange={() => setFormChanged(true)}
                      >
                        <option value="medium">Moyen (8+ caractères)</option>
                        <option value="high">Élevé (12+ caractères)</option>
                        <option value="very-high">Très élevé (16+ caractères)</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center">
                        <Key className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Expiration du mot de passe</p>
                          <p className="text-xs text-gray-600">Force le changement périodique</p>
                        </div>
                      </div>
                      <select
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        defaultValue="90"
                        onChange={() => setFormChanged(true)}
                      >
                        <option value="30">30 jours</option>
                        <option value="60">60 jours</option>
                        <option value="90">90 jours</option>
                        <option value="180">180 jours</option>
                        <option value="never">Jamais</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center">
                        <EyeOff className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Verrouillage du compte</p>
                          <p className="text-xs text-gray-600">Après tentatives de connexion échouées</p>
                        </div>
                      </div>
                      <select
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        defaultValue="5"
                        onChange={() => setFormChanged(true)}
                      >
                        <option value="3">3 tentatives</option>
                        <option value="5">5 tentatives</option>
                        <option value="10">10 tentatives</option>
                        <option value="disabled">Désactivé</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Protection des données</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center">
                        <Shield className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Chiffrement des données</p>
                          <p className="text-xs text-gray-600">Protection des informations sensibles</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center">
                        <UserCheck className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Anonymisation des données personnelles</p>
                          <p className="text-xs text-gray-600">Pour les rapports et exports</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center">
                        <Code className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Protection contre les injections SQL</p>
                          <p className="text-xs text-gray-600">Sécurité avancée des requêtes</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center">
                        <Shield className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Protection CSRF</p>
                          <p className="text-xs text-gray-600">Contre les falsifications de requêtes</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Accès et permissions</h3>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b border-gray-200 bg-gray-50">
                      <h4 className="font-medium text-gray-900">Configuration des permissions par rôle</h4>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
                          <tr>
                            <th className="px-6 py-3">Module</th>
                            <th className="px-6 py-3 text-center">Admin</th>
                            <th className="px-6 py-3 text-center">Gestionnaire</th>
                            <th className="px-6 py-3 text-center">Éditeur</th>
                            <th className="px-6 py-3 text-center">Visiteur</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          <tr className="bg-white">
                            <td className="px-6 py-3 font-medium">Utilisateurs</td>
                            <td className="px-6 py-3 text-center">
                              <input type="checkbox" checked readOnly className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300" />
                            </td>
                            <td className="px-6 py-3 text-center">
                              <input type="checkbox" checked readOnly className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300" />
                            </td>
                            <td className="px-6 py-3 text-center">
                              <input type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300" onChange={() => setFormChanged(true)} />
                            </td>
                            <td className="px-6 py-3 text-center">
                              <input type="checkbox" disabled className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300" />
                            </td>
                          </tr>
                          <tr className="bg-white">
                            <td className="px-6 py-3 font-medium">Contenu</td>
                            <td className="px-6 py-3 text-center">
                              <input type="checkbox" checked readOnly className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300" />
                            </td>
                            <td className="px-6 py-3 text-center">
                              <input type="checkbox" checked readOnly className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300" />
                            </td>
                            <td className="px-6 py-3 text-center">
                              <input type="checkbox" checked readOnly className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300" />
                            </td>
                            <td className="px-6 py-3 text-center">
                              <input type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300" onChange={() => setFormChanged(true)} />
                            </td>
                          </tr>
                          <tr className="bg-white">
                            <td className="px-6 py-3 font-medium">Médias</td>
                            <td className="px-6 py-3 text-center">
                              <input type="checkbox" checked readOnly className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300" />
                            </td>
                            <td className="px-6 py-3 text-center">
                              <input type="checkbox" checked readOnly className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300" />
                            </td>
                            <td className="px-6 py-3 text-center">
                              <input type="checkbox" checked readOnly className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300" />
                            </td>
                            <td className="px-6 py-3 text-center">
                              <input type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300" onChange={() => setFormChanged(true)} />
                            </td>
                          </tr>
                          <tr className="bg-white">
                            <td className="px-6 py-3 font-medium">Paramètres</td>
                            <td className="px-6 py-3 text-center">
                              <input type="checkbox" checked readOnly className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300" />
                            </td>
                            <td className="px-6 py-3 text-center">
                              <input type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300" onChange={() => setFormChanged(true)} />
                            </td>
                            <td className="px-6 py-3 text-center">
                              <input type="checkbox" disabled className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300" />
                            </td>
                            <td className="px-6 py-3 text-center">
                              <input type="checkbox" disabled className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300" />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium">
                      Configuration avancée des permissions
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Onglet Apparence */}
          {activeTab === 'appearance' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Thème et couleurs</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Thème du système
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="relative">
                          <input 
                            type="radio" 
                            name="theme" 
                            id="theme-default" 
                            value="default"
                            className="sr-only peer" 
                            defaultChecked 
                            onChange={() => setFormChanged(true)}
                          />
                          <label 
                            htmlFor="theme-default"
                            className="flex flex-col items-center p-4 bg-white border border-gray-300 rounded-lg cursor-pointer peer-checked:border-blue-600 peer-checked:ring-2 peer-checked:ring-blue-600 hover:bg-gray-50"
                          >
                            <div className="w-full h-12 bg-gradient-to-r from-blue-800 to-blue-600 rounded-md mb-2"></div>
                            <span className="text-sm font-medium">Défaut</span>
                          </label>
                        </div>
                        <div className="relative">
                          <input 
                            type="radio" 
                            name="theme" 
                            id="theme-dark" 
                            value="dark"
                            className="sr-only peer" 
                            onChange={() => setFormChanged(true)}
                          />
                          <label 
                            htmlFor="theme-dark"
                            className="flex flex-col items-center p-4 bg-white border border-gray-300 rounded-lg cursor-pointer peer-checked:border-blue-600 peer-checked:ring-2 peer-checked:ring-blue-600 hover:bg-gray-50"
                          >
                            <div className="w-full h-12 bg-gradient-to-r from-gray-900 to-gray-700 rounded-md mb-2"></div>
                            <span className="text-sm font-medium">Sombre</span>
                          </label>
                        </div>
                        <div className="relative">
                          <input 
                            type="radio" 
                            name="theme" 
                            id="theme-high-contrast" 
                            value="high-contrast"
                            className="sr-only peer" 
                            onChange={() => setFormChanged(true)}
                          />
                          <label 
                            htmlFor="theme-high-contrast"
                            className="flex flex-col items-center p-4 bg-white border border-gray-300 rounded-lg cursor-pointer peer-checked:border-blue-600 peer-checked:ring-2 peer-checked:ring-blue-600 hover:bg-gray-50"
                          >
                            <div className="w-full h-12 bg-black rounded-md mb-2"></div>
                            <span className="text-sm font-medium">Contraste élevé</span>
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Couleurs primaires
                      </label>
                      <div className="grid grid-cols-5 gap-2">
                        {['#007AFF', '#30D158', '#FF9500', '#FF3B30', '#AF52DE'].map((color, index) => (
                          <button
                            key={index}
                            className="w-full h-10 rounded-lg border-2 hover:scale-110 transition-transform"
                            style={{ backgroundColor: color, borderColor: color === '#007AFF' ? '#0056b3' : 'transparent' }}
                            onClick={() => setFormChanged(true)}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Personnaliser les couleurs
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Couleur primaire
                          </label>
                          <input 
                            type="color" 
                            className="h-10 w-full border border-gray-300 rounded-lg cursor-pointer"
                            defaultValue="#007AFF" 
                            onChange={() => setFormChanged(true)}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Couleur secondaire
                          </label>
                          <input 
                            type="color" 
                            className="h-10 w-full border border-gray-300 rounded-lg cursor-pointer"
                            defaultValue="#30D158" 
                            onChange={() => setFormChanged(true)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Interface et disposition</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="menu-style" className="block text-sm font-medium text-gray-700 mb-1">
                        Style de menu
                      </label>
                      <select
                        id="menu-style"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        defaultValue="expanded"
                        onChange={() => setFormChanged(true)}
                      >
                        <option value="expanded">Étendu</option>
                        <option value="collapsed">Réduit</option>
                        <option value="hover">Déplié au survol</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="dashboard-layout" className="block text-sm font-medium text-gray-700 mb-1">
                        Disposition du tableau de bord
                      </label>
                      <select
                        id="dashboard-layout"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        defaultValue="standard"
                        onChange={() => setFormChanged(true)}
                      >
                        <option value="standard">Standard</option>
                        <option value="compact">Compact</option>
                        <option value="expanded">Étendu</option>
                        <option value="custom">Personnalisé</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="content-density" className="block text-sm font-medium text-gray-700 mb-1">
                        Densité du contenu
                      </label>
                      <select
                        id="content-density"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        defaultValue="comfortable"
                        onChange={() => setFormChanged(true)}
                      >
                        <option value="comfortable">Confortable</option>
                        <option value="compact">Compact</option>
                        <option value="spacious">Spacieux</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center">
                        <PanelLeft className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Barre latérale fixe</p>
                          <p className="text-xs text-gray-600">Reste visible lors du défilement</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center">
                        <Smartphone className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Optimisation mobile</p>
                          <p className="text-xs text-gray-600">Interface adaptative</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Prévisualisation</h3>
                
                <div className="bg-gray-100 border border-gray-200 rounded-lg h-64 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-lg font-medium text-gray-900 mb-2">Aperçu du thème</div>
                    <p className="text-gray-600">La prévisualisation sera disponible après l'enregistrement des modifications</p>
                    <button 
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      disabled={!formChanged}
                    >
                      Prévisualiser les changements
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Onglet Notifications */}
          {activeTab === 'notifications' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuration des notifications</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center">
                        <BellRing className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Notifications système</p>
                          <p className="text-xs text-gray-600">Alertes et informations importantes</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Notifications par email</p>
                          <p className="text-xs text-gray-600">Envoi d'emails pour événements importants</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center">
                        <Smartphone className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Notifications push (navigateur)</p>
                          <p className="text-xs text-gray-600">Alertes en temps réel</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center">
                        <MessageSquare className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Notifications SMS</p>
                          <p className="text-xs text-gray-600">Pour événements critiques uniquement</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Types d'événements à notifier</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sélectionnez les types d'événements
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-3">
                          <input type="checkbox" checked readOnly className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300" />
                          <span className="text-gray-700">Connexion utilisateur</span>
                        </label>
                        <label className="flex items-center space-x-3">
                          <input type="checkbox" checked readOnly className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300" />
                          <span className="text-gray-700">Tentative de connexion échouée</span>
                        </label>
                        <label className="flex items-center space-x-3">
                          <input type="checkbox" checked readOnly className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300" />
                          <span className="text-gray-700">Modification des paramètres de sécurité</span>
                        </label>
                        <label className="flex items-center space-x-3">
                          <input type="checkbox" checked readOnly className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300" />
                          <span className="text-gray-700">Mises à jour système</span>
                        </label>
                        <label className="flex items-center space-x-3">
                          <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300" onChange={() => setFormChanged(true)} />
                          <span className="text-gray-700">Publication de contenu</span>
                        </label>
                        <label className="flex items-center space-x-3">
                          <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300" onChange={() => setFormChanged(true)} />
                          <span className="text-gray-700">Création/Modification d'utilisateur</span>
                        </label>
                        <label className="flex items-center space-x-3">
                          <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300" onChange={() => setFormChanged(true)} />
                          <span className="text-gray-700">Sauvegardes système</span>
                        </label>
                        <label className="flex items-center space-x-3">
                          <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300" onChange={() => setFormChanged(true)} />
                          <span className="text-gray-700">Alerte de sécurité</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuration d'email</h3>
                
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="email-sender" className="block text-sm font-medium text-gray-700 mb-1">
                          Email expéditeur
                        </label>
                        <input
                          type="email"
                          id="email-sender"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          defaultValue="noreply@dgdi.ga"
                          onChange={() => setFormChanged(true)}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email-sender-name" className="block text-sm font-medium text-gray-700 mb-1">
                          Nom d'expéditeur
                        </label>
                        <input
                          type="text"
                          id="email-sender-name"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          defaultValue="DGDI Access"
                          onChange={() => setFormChanged(true)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="email-method" className="block text-sm font-medium text-gray-700 mb-1">
                          Méthode d'envoi
                        </label>
                        <select
                          id="email-method"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          defaultValue="smtp"
                          onChange={() => setFormChanged(true)}
                        >
                          <option value="smtp">SMTP</option>
                          <option value="api">API Mail</option>
                          <option value="sendmail">Sendmail</option>
                        </select>
                      </div>
                      
                      <div>
                        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                          <Mail className="h-4 w-4" />
                          <span>Tester la configuration email</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Onglet Sauvegardes */}
          {activeTab === 'backups' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuration des sauvegardes</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center">
                        <CloudSync className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Sauvegardes automatiques</p>
                          <p className="text-xs text-gray-600">Création périodique de backups</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div>
                      <label htmlFor="backup-frequency" className="block text-sm font-medium text-gray-700 mb-1">
                        Fréquence des sauvegardes
                      </label>
                      <select
                        id="backup-frequency"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        defaultValue="daily"
                        onChange={() => setFormChanged(true)}
                      >
                        <option value="hourly">Toutes les heures</option>
                        <option value="daily">Quotidienne</option>
                        <option value="weekly">Hebdomadaire</option>
                        <option value="monthly">Mensuelle</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="backup-retention" className="block text-sm font-medium text-gray-700 mb-1">
                        Conservation des sauvegardes
                      </label>
                      <select
                        id="backup-retention"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        defaultValue="30"
                        onChange={() => setFormChanged(true)}
                      >
                        <option value="7">7 jours</option>
                        <option value="15">15 jours</option>
                        <option value="30">30 jours</option>
                        <option value="90">90 jours</option>
                        <option value="365">1 an</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="flex items-center space-x-3 mb-3">
                        <input 
                          type="checkbox" 
                          defaultChecked 
                          className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300"
                          onChange={() => setFormChanged(true)}
                        />
                        <span className="text-gray-700">Inclure les fichiers médias dans les sauvegardes</span>
                      </label>
                      <label className="flex items-center space-x-3 mb-3">
                        <input 
                          type="checkbox" 
                          defaultChecked 
                          className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300"
                          onChange={() => setFormChanged(true)}
                        />
                        <span className="text-gray-700">Inclure les fichiers logs dans les sauvegardes</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input 
                          type="checkbox" 
                          defaultChecked 
                          className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300"
                          onChange={() => setFormChanged(true)}
                        />
                        <span className="text-gray-700">Compression des sauvegardes</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Emplacements de sauvegarde</h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <Server className="h-5 w-5 text-gray-500 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Serveur local</p>
                            <p className="text-xs text-gray-600">/var/backups/dgdi</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                      <div className="mt-2 text-xs text-gray-600">
                        Espace utilisé: 85% (42.5 GB / 50 GB)
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <CloudSync className="h-5 w-5 text-gray-500 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Stockage cloud</p>
                            <p className="text-xs text-gray-600">Serveur sécurisé DGDI</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '35%' }}></div>
                      </div>
                      <div className="mt-2 text-xs text-gray-600">
                        Espace utilisé: 35% (175 GB / 500 GB)
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 opacity-70">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <CloudOff className="h-5 w-5 text-gray-500 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Service externe</p>
                            <p className="text-xs text-gray-600">Non configuré</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div className="mt-2 text-center">
                        <button className="text-blue-600 text-sm font-medium">
                          Configurer un service externe
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sauvegardes disponibles</h3>
                
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="p-4 flex items-center justify-between bg-gray-50 border-b border-gray-200">
                    <h4 className="font-medium text-gray-900">Historique des sauvegardes</h4>
                    <button 
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                      onClick={simulateBackup}
                      disabled={backupInProgress}
                    >
                      {backupInProgress ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          <span>Sauvegarde en cours...</span>
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4" />
                          <span>Créer une sauvegarde maintenant</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-600">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3">Nom</th>
                          <th className="px-6 py-3">Date</th>
                          <th className="px-6 py-3">Taille</th>
                          <th className="px-6 py-3">Type</th>
                          <th className="px-6 py-3">Statut</th>
                          <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-gray-900">backup_20240610_030000</td>
                          <td className="px-6 py-4">10/06/2024 03:00</td>
                          <td className="px-6 py-4">2.3 GB</td>
                          <td className="px-6 py-4">Automatique</td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Complète</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded">
                                <Download className="h-4 w-4" />
                              </button>
                              <button className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded">
                                <RefreshCw className="h-4 w-4" />
                              </button>
                              <button className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-gray-900">backup_20240609_030000</td>
                          <td className="px-6 py-4">09/06/2024 03:00</td>
                          <td className="px-6 py-4">2.3 GB</td>
                          <td className="px-6 py-4">Automatique</td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Complète</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded">
                                <Download className="h-4 w-4" />
                              </button>
                              <button className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded">
                                <RefreshCw className="h-4 w-4" />
                              </button>
                              <button className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-gray-900">backup_manual_20240608_145300</td>
                          <td className="px-6 py-4">08/06/2024 14:53</td>
                          <td className="px-6 py-4">2.2 GB</td>
                          <td className="px-6 py-4">Manuelle</td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Complète</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded">
                                <Download className="h-4 w-4" />
                              </button>
                              <button className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded">
                                <RefreshCw className="h-4 w-4" />
                              </button>
                              <button className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-gray-900">backup_20240608_030000</td>
                          <td className="px-6 py-4">08/06/2024 03:00</td>
                          <td className="px-6 py-4">2.1 GB</td>
                          <td className="px-6 py-4">Automatique</td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Complète</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded">
                                <Download className="h-4 w-4" />
                              </button>
                              <button className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded">
                                <RefreshCw className="h-4 w-4" />
                              </button>
                              <button className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-gray-900">backup_20240607_030000</td>
                          <td className="px-6 py-4">07/06/2024 03:00</td>
                          <td className="px-6 py-4">2.1 GB</td>
                          <td className="px-6 py-4">Automatique</td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Complète</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded">
                                <Download className="h-4 w-4" />
                              </button>
                              <button className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded">
                                <RefreshCw className="h-4 w-4" />
                              </button>
                              <button className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Restauration</h3>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start">
                      <div className="mr-3">
                        <Archive className="h-5 w-5 text-gray-500" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Restauration à partir d'une sauvegarde</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Restaurez le système à partir d'une sauvegarde existante. Cette action remplacera toutes les données actuelles.
                        </p>
                        <button className="mt-3 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium">
                          Démarrer une restauration
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-start">
                      <div className="mr-3">
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-yellow-800">Opérations critiques</h4>
                        <p className="text-sm text-yellow-700 mt-1">
                          Les opérations suivantes sont irréversibles et doivent être effectuées avec précaution.
                        </p>
                        <div className="mt-3 flex flex-col sm:flex-row gap-2">
                          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">
                            Nettoyer les caches
                          </button>
                          <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-medium">
                            Réinitialiser les paramètres
                          </button>
                          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium">
                            Supprimer toutes les données
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Onglet Intégrations */}
          {activeTab === 'integrations' && (
            <div className="space-y-8">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Info className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Intégrations tierces</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        Ces intégrations permettent de connecter DGDI Access à d'autres services et plateformes.
                        Veuillez suivre les instructions de configuration pour chaque service.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex justify-between mb-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg mr-4">
                        <Shield className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-lg text-gray-900">API de sécurité</h3>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    Intégration avec les services de sécurité externes pour la protection avancée des données.
                  </p>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <p className="text-xs font-medium text-gray-700">Statut: <span className="text-green-600">Connecté</span></p>
                    <p className="text-xs text-gray-600 mt-1">Dernière synchronisation: 10/06/2024 08:15</p>
                  </div>
                  <div className="mt-4">
                    <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
                      Configurer →
                    </button>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex justify-between mb-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg mr-4">
                        <Mail className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="font-semibold text-lg text-gray-900">Email Marketing</h3>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    Connectez-vous à votre service d'email marketing pour des campagnes automatisées.
                  </p>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <p className="text-xs font-medium text-gray-700">Statut: <span className="text-gray-500">Non configuré</span></p>
                    <p className="text-xs text-gray-600 mt-1">Services disponibles: Mailchimp, SendGrid, etc.</p>
                  </div>
                  <div className="mt-4">
                    <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
                      Configurer →
                    </button>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex justify-between mb-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-100 rounded-lg mr-4">
                        <BarChart3 className="h-6 w-6 text-purple-600" />
                      </div>
                      <h3 className="font-semibold text-lg text-gray-900">Analytics</h3>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    Intégration avec des outils d'analyse pour suivre les performances du site.
                  </p>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <p className="text-xs font-medium text-gray-700">Statut: <span className="text-green-600">Connecté</span></p>
                    <p className="text-xs text-gray-600 mt-1">Google Analytics ID: GA-12345678</p>
                  </div>
                  <div className="mt-4">
                    <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
                      Configurer →
                    </button>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex justify-between mb-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-red-100 rounded-lg mr-4">
                        <Wallet className="h-6 w-6 text-red-600" />
                      </div>
                      <h3 className="font-semibold text-lg text-gray-900">Paiements</h3>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    Intégrez des systèmes de paiement pour les services en ligne.
                  </p>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <p className="text-xs font-medium text-gray-700">Statut: <span className="text-gray-500">Non configuré</span></p>
                    <p className="text-xs text-gray-600 mt-1">Services supportés: Stripe, PayPal</p>
                  </div>
                  <div className="mt-4">
                    <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
                      Configurer →
                    </button>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex justify-between mb-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-orange-100 rounded-lg mr-4">
                        <MessageSquare className="h-6 w-6 text-orange-600" />
                      </div>
                      <h3 className="font-semibold text-lg text-gray-900">Support en ligne</h3>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    Système de chat en direct pour l'assistance aux utilisateurs.
                  </p>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <p className="text-xs font-medium text-gray-700">Statut: <span className="text-gray-500">Non configuré</span></p>
                    <p className="text-xs text-gray-600 mt-1">Services supportés: Intercom, Crisp, Tawk.to</p>
                  </div>
                  <div className="mt-4">
                    <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
                      Configurer →
                    </button>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex justify-between mb-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-indigo-100 rounded-lg mr-4">
                        <Globe className="h-6 w-6 text-indigo-600" />
                      </div>
                      <h3 className="font-semibold text-lg text-gray-900">Réseaux sociaux</h3>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    Connectez vos profils sociaux pour le partage automatique de contenu.
                  </p>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <p className="text-xs font-medium text-gray-700">Statut: <span className="text-gray-500">Non configuré</span></p>
                    <p className="text-xs text-gray-600 mt-1">Facebook, Twitter, LinkedIn</p>
                  </div>
                  <div className="mt-4">
                    <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
                      Configurer →
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ajouter une nouvelle intégration</h3>
                
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Rechercher des intégrations..." 
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700">
                    Filtrer
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Explorer
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Onglet Système */}
          {activeTab === 'system' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Server className="h-6 w-6 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Informations système</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Version DGDI Access</p>
                      <p className="text-sm text-gray-900">v2024.01.15</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Serveur</p>
                      <p className="text-sm text-gray-900">Node.js v20.9.0</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Base de données</p>
                      <p className="text-sm text-gray-900">PostgreSQL 16.1</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Environnement</p>
                      <p className="text-sm text-gray-900">Production</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Cpu className="h-6 w-6 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Performance</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-medium text-gray-700">Utilisation CPU</span>
                        <span className="text-xs font-medium text-gray-700">23%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '23%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-medium text-gray-700">Utilisation mémoire</span>
                        <span className="text-xs font-medium text-gray-700">42%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '42%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-medium text-gray-700">Espace disque</span>
                        <span className="text-xs font-medium text-gray-700">85%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Clock className="h-6 w-6 text-purple-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Disponibilité</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Uptime</p>
                      <p className="text-lg font-semibold text-gray-900">99.9%</p>
                      <p className="text-xs text-gray-600">Derniers 30 jours</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Temps de réponse moyen</p>
                      <p className="text-lg font-semibold text-gray-900">0.8s</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Dernier redémarrage</p>
                      <p className="text-sm text-gray-900">01/06/2024 03:15</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Maintenance système</h3>
                
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start">
                      <div className="mr-3">
                        <RefreshCw className="h-5 w-5 text-gray-500" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Mode maintenance</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Active le mode maintenance pour effectuer des opérations sensibles. Le site affichera une page d'attente aux visiteurs.
                        </p>
                        <div className="mt-3 flex items-center">
                          <label className="relative inline-flex items-center cursor-pointer mr-4">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50">
                            Configurer
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start">
                      <div className="mr-3">
                        <Database className="h-5 w-5 text-gray-500" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Optimisation de la base de données</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Optimise les tables et les index pour améliorer les performances générales du système.
                        </p>
                        <div className="mt-3">
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Optimiser maintenant
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start">
                      <div className="mr-3">
                        <Trash2 className="h-5 w-5 text-gray-500" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Nettoyage du système</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Supprime les fichiers temporaires, les caches et les données obsolètes.
                        </p>
                        <div className="mt-3">
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Nettoyer le système
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start">
                      <div className="mr-3">
                        <Cpu className="h-5 w-5 text-gray-500" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Cache système</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Gérez les options de mise en cache pour optimiser les performances.
                        </p>
                        <div className="mt-3 flex flex-col sm:flex-row gap-2">
                          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                            Configurer
                          </button>
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Vider le cache
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Logs système</h3>
                
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                    <h4 className="font-medium text-gray-900">Journaux d'activité</h4>
                    <div className="flex items-center space-x-2">
                      <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                        <option>Tous les journaux</option>
                        <option>Erreurs</option>
                        <option>Avertissements</option>
                        <option>Informations</option>
                      </select>
                      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                        <Download className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-600">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                          <th className="px-6 py-3">Date</th>
                          <th className="px-6 py-3">Type</th>
                          <th className="px-6 py-3">Message</th>
                          <th className="px-6 py-3">Composant</th>
                          <th className="px-6 py-3">IP</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">10/06/2024 10:45:12</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Info</span>
                          </td>
                          <td className="px-6 py-4">Connexion utilisateur réussie</td>
                          <td className="px-6 py-4">Auth</td>
                          <td className="px-6 py-4 whitespace-nowrap">192.168.1.100</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">10/06/2024 10:30:05</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Warning</span>
                          </td>
                          <td className="px-6 py-4">Espace disque faible (85%)</td>
                          <td className="px-6 py-4">System</td>
                          <td className="px-6 py-4 whitespace-nowrap">-</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">10/06/2024 09:15:36</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Error</span>
                          </td>
                          <td className="px-6 py-4">Échec tentative de connexion (5/5)</td>
                          <td className="px-6 py-4">Auth</td>
                          <td className="px-6 py-4 whitespace-nowrap">87.112.45.28</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">10/06/2024 08:00:00</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Info</span>
                          </td>
                          <td className="px-6 py-4">Sauvegarde automatique réussie</td>
                          <td className="px-6 py-4">Backup</td>
                          <td className="px-6 py-4 whitespace-nowrap">-</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};