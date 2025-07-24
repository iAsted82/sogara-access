import React, { useState } from 'react';
import { 
  Shield, 
  Search, 
  Filter, 
  Download, 
  AlertTriangle,
  CheckCircle,
  Eye,
  Calendar,
  User,
  FileText,
  Lock
} from 'lucide-react';

export const AuditModule: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState('all');
  const [selectedUser, setSelectedUser] = useState('all');

  const auditLogs = [
    {
      id: 1,
      timestamp: '2024-01-15T10:30:00',
      user: 'Jean NGUEMA',
      action: 'LOGIN',
      resource: 'Système',
      details: 'Connexion réussie depuis IP 192.168.1.100',
      status: 'success',
      riskLevel: 'low'
    },
    {
      id: 2,
      timestamp: '2024-01-15T10:32:00',
      user: 'Jean NGUEMA',
      action: 'CREATE_CNI',
      resource: 'CNI-2024-001',
      details: 'Création nouvelle demande CNI pour Marie OBAME',
      status: 'success',
      riskLevel: 'low'
    },
    {
      id: 3,
      timestamp: '2024-01-15T10:45:00',
      user: 'Marie AKUE',
      action: 'FAILED_LOGIN',
      resource: 'Système',
      details: 'Tentative de connexion échouée - mot de passe incorrect',
      status: 'failure',
      riskLevel: 'medium'
    },
    {
      id: 4,
      timestamp: '2024-01-15T11:00:00',
      user: 'Paul OBIANG',
      action: 'APPROVE_VISA',
      resource: 'VISA-2024-002',
      details: 'Approbation visa tourisme pour Wang LI',
      status: 'success',
      riskLevel: 'low'
    },
    {
      id: 5,
      timestamp: '2024-01-15T11:15:00',
      user: 'Admin System',
      action: 'DELETE_USER',
      resource: 'USER-123',
      details: 'Suppression compte utilisateur inactif',
      status: 'success',
      riskLevel: 'high'
    },
    {
      id: 6,
      timestamp: '2024-01-15T11:30:00',
      user: 'Sylvie MBOUMBA',
      action: 'BORDER_CONTROL',
      resource: 'BC-2024-001',
      details: 'Contrôle frontière - Personne signalée détectée',
      status: 'alert',
      riskLevel: 'high'
    }
  ];

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'LOGIN':
        return <User className="h-4 w-4 text-blue-500" />;
      case 'FAILED_LOGIN':
        return <Lock className="h-4 w-4 text-red-500" />;
      case 'CREATE_CNI':
      case 'APPROVE_VISA':
        return <FileText className="h-4 w-4 text-green-500" />;
      case 'DELETE_USER':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'BORDER_CONTROL':
        return <Shield className="h-4 w-4 text-orange-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failure':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'alert':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskLevelLabel = (riskLevel: string) => {
    const labels = {
      low: 'Faible',
      medium: 'Moyen',
      high: 'Élevé'
    };
    return labels[riskLevel as keyof typeof labels] || riskLevel;
  };

  const getActionLabel = (action: string) => {
    const labels = {
      LOGIN: 'Connexion',
      FAILED_LOGIN: 'Connexion échouée',
      CREATE_CNI: 'Création CNI',
      APPROVE_VISA: 'Approbation visa',
      DELETE_USER: 'Suppression utilisateur',
      BORDER_CONTROL: 'Contrôle frontière'
    };
    return labels[action as keyof typeof labels] || action;
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.resource.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = selectedAction === 'all' || log.action === selectedAction;
    const matchesUser = selectedUser === 'all' || log.user === selectedUser;
    return matchesSearch && matchesAction && matchesUser;
  });

  const securityStats = [
    { title: 'Connexions réussies', value: 847, change: '+5%', color: 'text-green-600' },
    { title: 'Tentatives échouées', value: 23, change: '-12%', color: 'text-red-600' },
    { title: 'Alertes sécurité', value: 5, change: '+2%', color: 'text-orange-600' },
    { title: 'Actions sensibles', value: 12, change: '0%', color: 'text-purple-600' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit et Sécurité</h1>
          <p className="text-gray-600">Surveillance des accès et traçabilité des opérations</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Download className="h-4 w-4" />
          Exporter les logs
        </button>
      </div>

      {/* Security Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {securityStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.change} cette semaine</p>
              </div>
              <div className="bg-gray-100 rounded-lg p-3">
                <Shield className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher dans les logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Toutes les actions</option>
            <option value="LOGIN">Connexions</option>
            <option value="FAILED_LOGIN">Échecs connexion</option>
            <option value="CREATE_CNI">Création CNI</option>
            <option value="APPROVE_VISA">Approbation visa</option>
            <option value="DELETE_USER">Suppression utilisateur</option>
            <option value="BORDER_CONTROL">Contrôle frontière</option>
          </select>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous les utilisateurs</option>
            <option value="Jean NGUEMA">Jean NGUEMA</option>
            <option value="Marie AKUE">Marie AKUE</option>
            <option value="Paul OBIANG">Paul OBIANG</option>
            <option value="Sylvie MBOUMBA">Sylvie MBOUMBA</option>
          </select>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtres
          </button>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Horodatage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ressource
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Détails
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risque
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {new Date(log.timestamp).toLocaleString('fr-FR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.user}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getActionIcon(log.action)}
                      <span className="text-sm text-gray-700">{getActionLabel(log.action)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.resource}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                    {log.details}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(log.status)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskLevelColor(log.riskLevel)}`}>
                      {getRiskLevelLabel(log.riskLevel)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-blue-600 hover:text-blue-700">
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Alerts */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertes de sécurité récentes</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">Tentatives de connexion multiples échouées</p>
              <p className="text-sm text-red-600">IP: 192.168.1.50 - 5 tentatives en 2 minutes</p>
            </div>
            <span className="text-xs text-red-600">Il y a 15 min</span>
          </div>
          
          <div className="flex items-center gap-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-800">Accès à ressource sensible</p>
              <p className="text-sm text-yellow-600">Consultation base de données interdictions</p>
            </div>
            <span className="text-xs text-yellow-600">Il y a 1h</span>
          </div>
          
          <div className="flex items-center gap-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-orange-800">Personne signalée détectée</p>
              <p className="text-sm text-orange-600">Contrôle frontière Aéroport Libreville</p>
            </div>
            <span className="text-xs text-orange-600">Il y a 2h</span>
          </div>
        </div>
      </div>
    </div>
  );
};