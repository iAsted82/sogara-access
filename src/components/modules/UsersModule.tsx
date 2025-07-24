import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';

export const UsersModule: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');

  const users = [
    {
      id: 1,
      firstName: 'Jean',
      lastName: 'NGUEMA',
      email: 'jean.nguema@sogara.ga',
      role: 'CSD',
      department: 'Documentation',
      location: 'Libreville',
      status: 'active',
      lastLogin: '2024-01-15T10:30:00',
      createdAt: '2023-06-15'
    },
    {
      id: 2,
      firstName: 'Marie',
      lastName: 'AKUE',
      email: 'marie.akue@sogara.ga',
      role: 'AG',
      department: 'Documentation',
      location: 'Port-Gentil',
      status: 'active',
      lastLogin: '2024-01-15T09:15:00',
      createdAt: '2023-08-20'
    },
    {
      id: 3,
      firstName: 'Paul',
      lastName: 'OBIANG',
      email: 'paul.obiang@sogara.ga',
      role: 'CSI',
      department: 'Immigration',
      location: 'Libreville',
      status: 'inactive',
      lastLogin: '2024-01-10T14:45:00',
      createdAt: '2023-05-10'
    },
    {
      id: 4,
      firstName: 'Sylvie',
      lastName: 'MBOUMBA',
      email: 'sylvie.mboumba@sogara.ga',
      role: 'ACF',
      department: 'Contrôle Frontalier',
      location: 'Bitam',
      status: 'active',
      lastLogin: '2024-01-15T11:20:00',
      createdAt: '2023-09-05'
    },
    {
      id: 5,
      firstName: 'André',
      lastName: 'MOUNGOUNGOU',
      email: 'andre.moungoungou@sogara.ga',
      role: 'SR',
      department: 'Supervision',
      location: 'Franceville',
      status: 'suspended',
      lastLogin: '2024-01-12T16:30:00',
      createdAt: '2023-07-12'
    }
  ];

  const getRoleLabel = (role: string) => {
    const labels = {
      ADMIN: 'Administrateur Système',
      DG: 'Direction Générale',
      CSD: 'Chef Service Documentation',
      CSI: 'Chef Service Immigration',
      AG: 'Agent de Guichet',
      ACF: 'Agent Contrôle Frontalier',
      SR: 'Superviseur Régional',
      AC: 'Auditeur/Contrôleur'
    };
    return labels[role as keyof typeof labels] || role;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'inactive':
        return <XCircle className="h-4 w-4 text-gray-500" />;
      case 'suspended':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      active: 'Actif',
      inactive: 'Inactif',
      suspended: 'Suspendu'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const roleStats = [
    { role: 'Administrateurs', count: 3, color: 'bg-red-500' },
    { role: 'Chefs de Service', count: 8, color: 'bg-blue-500' },
    { role: 'Agents', count: 45, color: 'bg-green-500' },
    { role: 'Superviseurs', count: 12, color: 'bg-purple-500' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
          <p className="text-gray-600">Administration des comptes et permissions</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nouvel utilisateur
        </button>
      </div>

      {/* Role Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {roleStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.role}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
              </div>
              <div className={`${stat.color} rounded-lg p-3`}>
                <Users className="h-6 w-6 text-white" />
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
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous les rôles</option>
            <option value="ADMIN">Administrateur</option>
            <option value="DG">Direction Générale</option>
            <option value="CSD">Chef Service Documentation</option>
            <option value="CSI">Chef Service Immigration</option>
            <option value="AG">Agent de Guichet</option>
            <option value="ACF">Agent Contrôle Frontalier</option>
            <option value="SR">Superviseur Régional</option>
            <option value="AC">Auditeur/Contrôleur</option>
          </select>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtres
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Département
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Localisation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dernière connexion
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{getRoleLabel(user.role)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(user.status)}
                      <span className="text-sm text-gray-700">{getStatusLabel(user.status)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(user.lastLogin).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <button className="text-blue-600 hover:text-blue-700">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-700">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};