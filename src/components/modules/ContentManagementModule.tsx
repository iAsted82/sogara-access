import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  Eye, 
  Edit, 
  Trash2, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Calendar,
  Layout,
  Tag,
  PenTool,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
  Download,
  Copy,
  Globe,
  BarChart3,
  AlignLeft,
  Link,
  ListFilter
} from 'lucide-react';

interface ContentItem {
  id: string;
  title: string;
  type: 'page' | 'article' | 'news' | 'document';
  status: 'published' | 'draft' | 'scheduled' | 'archived';
  author: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  scheduledFor?: string;
  views?: number;
  tags: string[];
  featured: boolean;
  seoScore?: number;
  thumbnail?: string;
}

export const ContentManagementModule: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortField, setSortField] = useState<string>('updatedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [activeSection, setActiveSection] = useState<'content' | 'categories' | 'seo'>('content');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Contenu simulé
  const contentItems: ContentItem[] = [
    {
      id: 'cnt-001',
      title: 'Procédure de demande de CNI',
      type: 'page',
      status: 'published',
      author: 'Robert Ndong',
      category: 'Documentation',
      createdAt: '2024-05-10T10:30:00',
      updatedAt: '2024-06-05T14:45:00',
      publishedAt: '2024-06-05T15:00:00',
      views: 2547,
      tags: ['cni', 'procédure', 'important'],
      featured: true,
      seoScore: 92,
      thumbnail: 'https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg?auto=compress&cs=tinysrgb&w=200'
    },
    {
      id: 'cnt-002',
      title: 'Nouveaux horaires d\'accueil',
      type: 'news',
      status: 'published',
      author: 'Marie Akue',
      category: 'Actualités',
      createdAt: '2024-06-01T09:15:00',
      updatedAt: '2024-06-01T09:15:00',
      publishedAt: '2024-06-01T10:00:00',
      views: 1823,
      tags: ['horaires', 'accueil'],
      featured: false,
      seoScore: 85,
      thumbnail: 'https://images.pexels.com/photos/5668772/pexels-photo-5668772.jpeg?auto=compress&cs=tinysrgb&w=200'
    },
    {
      id: 'cnt-003',
      title: 'Mise à jour de la plateforme - Version 2.4',
      type: 'article',
      status: 'draft',
      author: 'Robert Ndong',
      category: 'Technique',
      createdAt: '2024-06-08T16:20:00',
      updatedAt: '2024-06-09T11:30:00',
      tags: ['mise à jour', 'technique', 'plateforme'],
      featured: false,
      thumbnail: 'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=200'
    },
    {
      id: 'cnt-004',
      title: 'Procédure de renouvellement de passeport',
      type: 'page',
      status: 'published',
      author: 'Sophie Ella',
      category: 'Documentation',
      createdAt: '2024-05-15T14:00:00',
      updatedAt: '2024-06-02T10:30:00',
      publishedAt: '2024-06-02T11:00:00',
      views: 1952,
      tags: ['passeport', 'procédure', 'renouvellement'],
      featured: true,
      seoScore: 88,
    },
    {
      id: 'cnt-005',
      title: 'Journée de maintenance planifiée',
      type: 'news',
      status: 'scheduled',
      author: 'Marie Akue',
      category: 'Actualités',
      createdAt: '2024-06-09T09:00:00',
      updatedAt: '2024-06-09T09:00:00',
      scheduledFor: '2024-06-12T08:00:00',
      tags: ['maintenance', 'indisponibilité', 'planifié'],
      featured: false,
      seoScore: 78,
    },
    {
      id: 'cnt-006',
      title: 'Guide de l\'agent d\'accueil',
      type: 'document',
      status: 'published',
      author: 'Robert Ndong',
      category: 'Formation',
      createdAt: '2024-04-20T11:45:00',
      updatedAt: '2024-06-03T16:30:00',
      publishedAt: '2024-06-03T17:00:00',
      views: 342,
      tags: ['formation', 'guide', 'accueil'],
      featured: false,
      seoScore: 72,
    },
    {
      id: 'cnt-007',
      title: 'Archives - Anciennes procédures (2023)',
      type: 'document',
      status: 'archived',
      author: 'Sophie Ella',
      category: 'Archives',
      createdAt: '2023-12-01T10:00:00',
      updatedAt: '2024-01-15T14:30:00',
      publishedAt: '2023-12-01T11:00:00',
      views: 128,
      tags: ['archives', 'procédures', '2023'],
      featured: false,
      seoScore: 65,
    }
  ];

  // Catégories simulées
  const categories = [
    { id: 'cat-001', name: 'Documentation', count: 2, color: '#3B82F6' },
    { id: 'cat-002', name: 'Actualités', count: 2, color: '#10B981' },
    { id: 'cat-003', name: 'Technique', count: 1, color: '#8B5CF6' },
    { id: 'cat-004', name: 'Formation', count: 1, color: '#F59E0B' },
    { id: 'cat-005', name: 'Archives', count: 1, color: '#6B7280' },
  ];

  // Statistiques SEO simulées
  const seoStats = {
    globalScore: 84,
    contentWithImages: 71,
    contentWithMetaDesc: 92,
    contentWithKeywords: 88,
    searchTraffic: 1547,
    inboundLinks: 28,
    topPerformingPages: [
      { title: 'Procédure de demande de CNI', visits: 2547, conversion: 14.2 },
      { title: 'Procédure de renouvellement de passeport', visits: 1952, conversion: 12.8 },
      { title: 'Nouveaux horaires d\'accueil', visits: 1823, conversion: 8.5 }
    ]
  };

  // Filtrer le contenu
  const filteredContent = contentItems.filter(item => {
    // Filtre par statut
    if (selectedStatus !== 'all' && item.status !== selectedStatus) return false;
    
    // Filtre par type
    if (selectedType !== 'all' && item.type !== selectedType) return false;
    
    // Filtre par recherche
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        item.title.toLowerCase().includes(searchLower) ||
        item.author.toLowerCase().includes(searchLower) ||
        item.category.toLowerCase().includes(searchLower) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    return true;
  });

  // Trier le contenu
  const sortedContent = [...filteredContent].sort((a, b) => {
    let aValue = a[sortField as keyof ContentItem] as any;
    let bValue = b[sortField as keyof ContentItem] as any;
    
    // Gérer les valeurs nulles ou undefined
    if (aValue === undefined) aValue = '';
    if (bValue === undefined) bValue = '';
    
    // Comparer les valeurs
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Format de date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Icône de statut
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'draft':
        return <PenTool className="h-4 w-4 text-gray-500" />;
      case 'scheduled':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'archived':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  // Étiquette de statut
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'published':
        return 'Publié';
      case 'draft':
        return 'Brouillon';
      case 'scheduled':
        return 'Planifié';
      case 'archived':
        return 'Archivé';
      default:
        return status;
    }
  };

  // Couleur de statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'archived':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Icône de type de contenu
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'page':
        return <Layout className="h-4 w-4 text-purple-500" />;
      case 'article':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'news':
        return <Globe className="h-4 w-4 text-green-500" />;
      case 'document':
        return <FileText className="h-4 w-4 text-orange-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  // Étiquette de type de contenu
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'page':
        return 'Page';
      case 'article':
        return 'Article';
      case 'news':
        return 'Actualité';
      case 'document':
        return 'Document';
      default:
        return type;
    }
  };

  // Basculer la direction de tri
  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Icône de direction de tri
  const getSortIcon = (field: string) => {
    if (sortField !== field) return null;
    
    return sortDirection === 'asc' 
      ? <ArrowUp className="h-3 w-3" />
      : <ArrowDown className="h-3 w-3" />;
  };

  return (
    <div className="space-y-6 p-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion du Contenu</h1>
          <p className="text-gray-600">Créez, modifiez et gérez tous vos contenus</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Filtres</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Nouveau contenu</span>
          </button>
        </div>
      </div>

      {/* Navigation des sections */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1">
        <div className="flex flex-wrap">
          <button 
            className={`px-4 py-2 rounded-lg font-medium text-sm ${
              activeSection === 'content' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setActiveSection('content')}
          >
            Contenu
          </button>
          <button 
            className={`px-4 py-2 rounded-lg font-medium text-sm ${
              activeSection === 'categories' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setActiveSection('categories')}
          >
            Catégories & Tags
          </button>
          <button 
            className={`px-4 py-2 rounded-lg font-medium text-sm ${
              activeSection === 'seo' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setActiveSection('seo')}
          >
            SEO
          </button>
        </div>
      </div>

      {/* Section Contenu */}
      {activeSection === 'content' && (
        <>
          {/* Filtres */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2 relative">
                <input
                  type="text"
                  placeholder="Rechercher du contenu..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              
              <div>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="all">Tous les statuts</option>
                  <option value="published">Publié</option>
                  <option value="draft">Brouillon</option>
                  <option value="scheduled">Planifié</option>
                  <option value="archived">Archivé</option>
                </select>
              </div>
              
              <div>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="all">Tous les types</option>
                  <option value="page">Pages</option>
                  <option value="article">Articles</option>
                  <option value="news">Actualités</option>
                  <option value="document">Documents</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <button
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              >
                {showAdvancedFilters ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" />
                    Masquer les filtres avancés
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" />
                    Afficher les filtres avancés
                  </>
                )}
              </button>
              
              <div className="flex items-center text-sm text-gray-600">
                <span>{filteredContent.length} élément{filteredContent.length > 1 ? 's' : ''}</span>
              </div>
            </div>
            
            {showAdvancedFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Auteur
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Tous les auteurs</option>
                    <option value="robert">Robert Ndong</option>
                    <option value="marie">Marie Akue</option>
                    <option value="sophie">Sophie Ella</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Catégorie
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Toutes les catégories</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tag
                  </label>
                  <input
                    type="text"
                    placeholder="Rechercher par tag"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de création
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Toutes les dates</option>
                    <option value="today">Aujourd'hui</option>
                    <option value="week">Cette semaine</option>
                    <option value="month">Ce mois</option>
                    <option value="quarter">Ce trimestre</option>
                    <option value="year">Cette année</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Score SEO minimum
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="0">Tous</option>
                    <option value="50">50+</option>
                    <option value="70">70+</option>
                    <option value="80">80+</option>
                    <option value="90">90+</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contenu mis en avant
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Tous</option>
                    <option value="featured">Mis en avant</option>
                    <option value="not-featured">Non mis en avant</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Liste du contenu */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-600">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th 
                      className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => toggleSort('title')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Titre</span>
                        {getSortIcon('title')}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => toggleSort('type')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Type</span>
                        {getSortIcon('type')}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => toggleSort('author')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Auteur</span>
                        {getSortIcon('author')}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => toggleSort('category')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Catégorie</span>
                        {getSortIcon('category')}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => toggleSort('status')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Statut</span>
                        {getSortIcon('status')}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => toggleSort('updatedAt')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Dernière mise à jour</span>
                        {getSortIcon('updatedAt')}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sortedContent.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {item.thumbnail ? (
                            <div className="flex-shrink-0 h-10 w-10 rounded border border-gray-200 mr-3 overflow-hidden">
                              <img 
                                src={item.thumbnail} 
                                alt={item.title} 
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="flex-shrink-0 h-10 w-10 rounded bg-gray-100 flex items-center justify-center mr-3">
                              <FileText className="h-5 w-5 text-gray-500" />
                            </div>
                          )}
                          <div className="flex flex-col">
                            <div className="font-medium text-gray-900">{item.title}</div>
                            {item.featured && (
                              <div className="flex items-center mt-1">
                                <div className="text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded">
                                  Mis en avant
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getTypeIcon(item.type)}
                          <span className="ml-1.5">{getTypeLabel(item.type)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.author}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(item.status)}
                              <span>{getStatusLabel(item.status)}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-gray-400 mr-1.5" />
                          <span>{formatDate(item.updatedAt)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded">
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <div className="relative">
                            <button className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded">
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Précédent
              </button>
              <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Suivant
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Affichage de <span className="font-medium">1</span> à <span className="font-medium">{sortedContent.length}</span> sur <span className="font-medium">{contentItems.length}</span> résultats
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Précédent</span>
                    <ChevronDown className="h-5 w-5 rotate-90" />
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    1
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-700 hover:bg-blue-100">
                    2
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    3
                  </button>
                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                    ...
                  </span>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    8
                  </button>
                  <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Suivant</span>
                    <ChevronDown className="h-5 w-5 -rotate-90" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Section Catégories & Tags */}
      {activeSection === 'categories' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Catégories */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Catégories de contenu</h2>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Nouvelle catégorie</span>
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 rounded-lg">
                    <tr>
                      <th className="px-6 py-3">Nom</th>
                      <th className="px-6 py-3">Contenu</th>
                      <th className="px-6 py-3">Couleur</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {categories.map((category) => (
                      <tr key={category.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">{category.name}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 text-gray-400 mr-2" />
                            <span>{category.count} élément{category.count > 1 ? 's' : ''}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: category.color }}
                            ></div>
                            <span>{category.color}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded">
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

          {/* Tags */}
          <div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Tags populaires</h2>
                <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Nouveau tag</span>
                </button>
              </div>
              
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <div className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium flex items-center gap-2">
                    <Tag className="h-3.5 w-3.5" />
                    <span>procédure</span>
                    <span className="bg-blue-200 text-blue-700 rounded-full text-xs px-1.5">3</span>
                  </div>
                  <div className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-lg text-sm font-medium flex items-center gap-2">
                    <Tag className="h-3.5 w-3.5" />
                    <span>cni</span>
                    <span className="bg-gray-200 text-gray-700 rounded-full text-xs px-1.5">2</span>
                  </div>
                  <div className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-lg text-sm font-medium flex items-center gap-2">
                    <Tag className="h-3.5 w-3.5" />
                    <span>important</span>
                    <span className="bg-gray-200 text-gray-700 rounded-full text-xs px-1.5">2</span>
                  </div>
                  <div className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-lg text-sm font-medium flex items-center gap-2">
                    <Tag className="h-3.5 w-3.5" />
                    <span>passeport</span>
                    <span className="bg-gray-200 text-gray-700 rounded-full text-xs px-1.5">1</span>
                  </div>
                  <div className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-lg text-sm font-medium flex items-center gap-2">
                    <Tag className="h-3.5 w-3.5" />
                    <span>horaires</span>
                    <span className="bg-gray-200 text-gray-700 rounded-full text-xs px-1.5">1</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">Ajouter un nouveau tag</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Nom du tag"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Description (optionnel)"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Ajouter le tag
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section SEO */}
      {activeSection === 'seo' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Score SEO global</h3>
                  <p className="text-sm text-gray-600">Performance générale</p>
                </div>
                <div className="text-3xl font-bold text-blue-600">{seoStats.globalScore}%</div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${seoStats.globalScore}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">{seoStats.searchTraffic}</div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">Visites via recherche</h3>
                <p className="text-sm text-gray-600">+12% vs mois précédent</p>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2">
                <div className="text-center">
                  <div className="text-sm font-semibold text-gray-700">{seoStats.contentWithMetaDesc}%</div>
                  <p className="text-xs text-gray-500">Meta desc.</p>
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold text-gray-700">{seoStats.contentWithImages}%</div>
                  <p className="text-xs text-gray-500">Avec images</p>
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold text-gray-700">{seoStats.contentWithKeywords}%</div>
                  <p className="text-xs text-gray-500">Mots-clés</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Liens entrants</h3>
                  <p className="text-sm text-gray-600">Backlinks et références</p>
                </div>
                <div className="text-3xl font-bold text-green-600">{seoStats.inboundLinks}</div>
              </div>
              <div className="mt-4">
                <button className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium">
                  Analyser les liens
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pages les plus performantes</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 rounded-lg">
                    <tr>
                      <th className="px-6 py-3">Page</th>
                      <th className="px-6 py-3">Visites</th>
                      <th className="px-6 py-3">Conversion</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {seoStats.topPerformingPages.map((page, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">{page.title}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 text-gray-400 mr-2" />
                            <span>{page.visits.toLocaleString('fr-FR')}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
                            <span>{page.conversion}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded">
                              <BarChart3 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Optimisation SEO</h3>
              
              <div className="space-y-4">
                <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex items-start">
                    <AlignLeft className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Meta descriptions</h4>
                      <p className="text-sm text-gray-600 mt-1">{seoStats.contentWithMetaDesc}% de votre contenu possède des meta descriptions</p>
                      <button className="mt-2 text-blue-600 text-xs font-medium hover:text-blue-800">
                        Optimiser →
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex items-start">
                    <ImageIcon className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Optimisation d'images</h4>
                      <p className="text-sm text-gray-600 mt-1">{seoStats.contentWithImages}% de votre contenu utilise des images optimisées</p>
                      <button className="mt-2 text-green-600 text-xs font-medium hover:text-green-800">
                        Optimiser →
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex items-start">
                    <Link className="h-5 w-5 text-purple-500 mt-0.5 mr-3" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Liens internes</h4>
                      <p className="text-sm text-gray-600 mt-1">5 pages n'ont pas de liens internes</p>
                      <button className="mt-2 text-purple-600 text-xs font-medium hover:text-purple-800">
                        Analyser →
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex items-start">
                    <Tag className="h-5 w-5 text-yellow-500 mt-0.5 mr-3" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Mots-clés</h4>
                      <p className="text-sm text-gray-600 mt-1">{seoStats.contentWithKeywords}% de votre contenu utilise des mots-clés optimisés</p>
                      <button className="mt-2 text-yellow-600 text-xs font-medium hover:text-yellow-800">
                        Suggérer →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>Rapport SEO complet</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};