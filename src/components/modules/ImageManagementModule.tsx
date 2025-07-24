import React, { useState, useRef, useCallback } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  Folder, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Edit3, 
  Trash2, 
  Download, 
  Eye, 
  Star, 
  Copy, 
  Move, 
  Share2, 
  Settings, 
  Plus, 
  X, 
  Save, 
  RotateCw, 
  Crop, 
  Palette, 
  Maximize2, 
  FolderPlus,
  Tag,
  Calendar,
  FileText,
  Shield,
  Zap,
  Layers,
  Monitor,
  Smartphone,
  Camera,
  Video,
  Music,
  File,
  Archive,
  Award,
  CheckCircle,
  AlertCircle,
  Clock,
  Users,
  Globe,
  Lock
} from 'lucide-react';

interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'document' | 'archive';
  url: string;
  thumbnail: string;
  size: number;
  dimensions?: { width: number; height: number };
  category: string;
  tags: string[];
  uploadedAt: Date;
  uploadedBy: string;
  usage: 'logo' | 'hero' | 'gallery' | 'content' | 'icon' | 'background';
  isOptimized: boolean;
  isFeatured: boolean;
  status: 'active' | 'archived' | 'processing';
  permissions: {
    canEdit: boolean;
    canDelete: boolean;
    canShare: boolean;
  };
  metadata: {
    alt?: string;
    description?: string;
    copyright?: string;
    keywords: string[];
  };
}

interface ImageFolder {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  itemCount: number;
  createdAt: Date;
  isSystem: boolean;
  permissions: {
    canEdit: boolean;
    canDelete: boolean;
    canAddFiles: boolean;
  };
}

export const ImageManagementModule: React.FC = () => {
  const [activeView, setActiveView] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFolder, setSelectedFolder] = useState<string>('root');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [showUploader, setShowUploader] = useState(false);
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [editingImage, setEditingImage] = useState<MediaFile | null>(null);
  const [showFolderCreator, setShowFolderCreator] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Données simulées
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([
    {
      id: '1',
      name: 'logo-sogara-principal.png',
      type: 'image',
      url: 'https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg?auto=compress&cs=tinysrgb&w=400',
      thumbnail: 'https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg?auto=compress&cs=tinysrgb&w=200',
      size: 256000,
      dimensions: { width: 1920, height: 1080 },
      category: 'logos',
      tags: ['logo', 'principal', 'dgdi'],
      uploadedAt: new Date('2024-01-15'),
      uploadedBy: 'Admin DGDI',
      usage: 'logo',
      isOptimized: true,
      isFeatured: true,
      status: 'active',
      permissions: { canEdit: true, canDelete: true, canShare: true },
      metadata: {
        alt: 'Logo principal SOGARA Access',
        description: 'Logo officiel de la Direction Générale de la Documentation et de l\'Immigration',
        keywords: ['sogara', 'gabon', 'administration']
      }
    },
    {
      id: '2',
      name: 'hero-accueil.jpg',
      type: 'image',
      url: 'https://images.pexels.com/photos/5668772/pexels-photo-5668772.jpeg?auto=compress&cs=tinysrgb&w=400',
      thumbnail: 'https://images.pexels.com/photos/5668772/pexels-photo-5668772.jpeg?auto=compress&cs=tinysrgb&w=200',
      size: 512000,
      dimensions: { width: 1920, height: 1080 },
      category: 'hero-images',
      tags: ['hero', 'accueil', 'bannière'],
      uploadedAt: new Date('2024-01-14'),
      uploadedBy: 'Admin DGDI',
      usage: 'hero',
      isOptimized: true,
      isFeatured: false,
      status: 'active',
      permissions: { canEdit: true, canDelete: true, canShare: true },
      metadata: {
        alt: 'Image hero page d\'accueil',
        description: 'Image de bannière pour la page d\'accueil',
        keywords: ['accueil', 'bannière', 'hero']
      }
    },
    {
      id: '3',
      name: 'galerie-services.jpg',
      type: 'image',
      url: 'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=400',
      thumbnail: 'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=200',
      size: 384000,
      dimensions: { width: 1200, height: 800 },
      category: 'gallery',
      tags: ['services', 'galerie', 'illustration'],
      uploadedAt: new Date('2024-01-13'),
      uploadedBy: 'Admin DGDI',
      usage: 'gallery',
      isOptimized: false,
      isFeatured: false,
      status: 'active',
      permissions: { canEdit: true, canDelete: true, canShare: true },
      metadata: {
        alt: 'Illustration des services DGDI',
        description: 'Image illustrant les services offerts par DGDI',
        keywords: ['services', 'dgdi', 'illustration']
      }
    }
  ]);

  const [folders, setFolders] = useState<ImageFolder[]>([
    {
      id: 'logos',
      name: 'Logos et Identité',
      description: 'Logos officiels et éléments d\'identité visuelle',
      itemCount: 5,
      createdAt: new Date('2024-01-01'),
      isSystem: true,
      permissions: { canEdit: false, canDelete: false, canAddFiles: true }
    },
    {
      id: 'hero-images',
      name: 'Images Hero',
      description: 'Images de bannières et héros pour les pages',
      itemCount: 8,
      createdAt: new Date('2024-01-01'),
      isSystem: true,
      permissions: { canEdit: false, canDelete: false, canAddFiles: true }
    },
    {
      id: 'gallery',
      name: 'Galerie',
      description: 'Images pour galeries et illustrations',
      itemCount: 15,
      createdAt: new Date('2024-01-01'),
      isSystem: false,
      permissions: { canEdit: true, canDelete: true, canAddFiles: true }
    },
    {
      id: 'icons',
      name: 'Icônes',
      description: 'Icônes et pictogrammes',
      itemCount: 12,
      createdAt: new Date('2024-01-01'),
      isSystem: false,
      permissions: { canEdit: true, canDelete: true, canAddFiles: true }
    }
  ]);

  const categories = [
    { id: 'all', label: 'Tout', count: mediaFiles.length },
    { id: 'logos', label: 'Logos', count: mediaFiles.filter(f => f.category === 'logos').length },
    { id: 'hero-images', label: 'Images Hero', count: mediaFiles.filter(f => f.category === 'hero-images').length },
    { id: 'gallery', label: 'Galerie', count: mediaFiles.filter(f => f.category === 'gallery').length },
    { id: 'icons', label: 'Icônes', count: mediaFiles.filter(f => f.category === 'icons').length }
  ];

  const usageTypes = [
    { id: 'logo', label: 'Logo', icon: Award, color: 'text-yellow-600' },
    { id: 'hero', label: 'Hero/Bannière', icon: Monitor, color: 'text-blue-600' },
    { id: 'gallery', label: 'Galerie', icon: ImageIcon, color: 'text-green-600' },
    { id: 'content', label: 'Contenu', icon: FileText, color: 'text-purple-600' },
    { id: 'icon', label: 'Icône', icon: Star, color: 'text-orange-600' },
    { id: 'background', label: 'Arrière-plan', icon: Layers, color: 'text-gray-600' }
  ];

  const filteredFiles = mediaFiles.filter(file => {
    const matchesCategory = selectedCategory === 'all' || file.category === selectedCategory;
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFolder = selectedFolder === 'root' || file.category === selectedFolder;
    return matchesCategory && matchesSearch && matchesFolder;
  });

  const handleFileUpload = useCallback((files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const newFile: MediaFile = {
          id: Date.now().toString() + Math.random().toString(36),
          name: file.name,
          type: 'image',
          url: URL.createObjectURL(file),
          thumbnail: URL.createObjectURL(file),
          size: file.size,
          category: selectedFolder === 'root' ? 'gallery' : selectedFolder,
          tags: [],
          uploadedAt: new Date(),
          uploadedBy: 'Admin DGDI',
          usage: 'content',
          isOptimized: false,
          isFeatured: false,
          status: 'processing',
          permissions: { canEdit: true, canDelete: true, canShare: true },
          metadata: {
            alt: file.name.split('.')[0],
            keywords: []
          }
        };

        setMediaFiles(prev => [...prev, newFile]);

        // Simuler le traitement
        setTimeout(() => {
          setMediaFiles(prev => prev.map(f => 
            f.id === newFile.id ? { ...f, status: 'active' as const } : f
          ));
        }, 2000);
      }
    });
  }, [selectedFolder]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  }, [handleFileUpload]);

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return ImageIcon;
      case 'video': return Video;
      case 'audio': return Music;
      case 'document': return FileText;
      case 'archive': return Archive;
      default: return File;
    }
  };

  const getUsageIcon = (usage: string) => {
    const usageType = usageTypes.find(u => u.id === usage);
    return usageType ? usageType.icon : FileText;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const deleteSelectedFiles = () => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${selectedFiles.length} fichier(s) ?`)) {
      setMediaFiles(prev => prev.filter(file => !selectedFiles.includes(file.id)));
      setSelectedFiles([]);
    }
  };

  const optimizeImages = () => {
    const filesToOptimize = mediaFiles.filter(file => 
      selectedFiles.includes(file.id) && !file.isOptimized
    );

    filesToOptimize.forEach(file => {
      setMediaFiles(prev => prev.map(f => 
        f.id === file.id 
          ? { ...f, isOptimized: true, size: Math.round(f.size * 0.7) }
          : f
      ));
    });

    alert(`${filesToOptimize.length} image(s) optimisée(s) avec succès !`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Images</h1>
          <p className="text-gray-600">Gérez tous vos médias, logos et galeries SOGARA Access</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFolderCreator(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <FolderPlus className="h-4 w-4" />
            <span className="hidden sm:inline">Nouveau Dossier</span>
          </button>
          <button
            onClick={() => setShowUploader(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">Uploader</span>
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Fichiers</p>
              <p className="text-2xl font-bold text-gray-900">{mediaFiles.length}</p>
            </div>
            <ImageIcon className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Optimisés</p>
              <p className="text-2xl font-bold text-green-600">{mediaFiles.filter(f => f.isOptimized).length}</p>
            </div>
            <Zap className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Dossiers</p>
              <p className="text-2xl font-bold text-purple-600">{folders.length}</p>
            </div>
            <Folder className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Espace Utilisé</p>
              <p className="text-2xl font-bold text-orange-600">
                {formatFileSize(mediaFiles.reduce((acc, file) => acc + file.size, 0))}
              </p>
            </div>
            <Monitor className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Zone de drag & drop */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-700 mb-2">
          Glissez-déposez vos images ici
        </p>
        <p className="text-gray-500 mb-4">ou</p>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Sélectionner des fichiers
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFileUpload(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Barre d'outils */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Recherche */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher des images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filtres */}
          <div className="flex items-center gap-2">
            <select
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="root">Tous les dossiers</option>
              {folders.map(folder => (
                <option key={folder.id} value={folder.id}>{folder.name}</option>
              ))}
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.label} ({category.count})
                </option>
              ))}
            </select>

            <div className="flex items-center gap-1 border border-gray-300 rounded-lg p-1">
              <button
                onClick={() => setActiveView('grid')}
                className={`p-2 rounded ${activeView === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setActiveView('list')}
                className={`p-2 rounded ${activeView === 'list' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Actions pour fichiers sélectionnés */}
        {selectedFiles.length > 0 && (
          <div className="mt-4 flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <span className="text-sm font-medium text-blue-800">
              {selectedFiles.length} fichier(s) sélectionné(s)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={optimizeImages}
                className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
              >
                <Zap className="h-3 w-3" />
                Optimiser
              </button>
              <button
                onClick={() => {/* Ouvrir éditeur de tags */}}
                className="flex items-center gap-1 px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors text-sm"
              >
                <Tag className="h-3 w-3" />
                Tags
              </button>
              <button
                onClick={deleteSelectedFiles}
                className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
              >
                <Trash2 className="h-3 w-3" />
                Supprimer
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Galerie d'images */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {activeView === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-6">
            {filteredFiles.map((file) => {
              const FileIcon = getFileIcon(file.type);
              const UsageIcon = getUsageIcon(file.usage);
              const isSelected = selectedFiles.includes(file.id);

              return (
                <div
                  key={file.id}
                  className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                    isSelected ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => toggleFileSelection(file.id)}
                >
                  {/* Checkbox */}
                  <div className="absolute top-2 left-2 z-10">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleFileSelection(file.id)}
                      className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>

                  {/* Badges de statut */}
                  <div className="absolute top-2 right-2 z-10 flex gap-1">
                    {file.isFeatured && (
                      <div className="bg-yellow-500 rounded-full p-1">
                        <Star className="h-3 w-3 text-white" />
                      </div>
                    )}
                    {file.isOptimized && (
                      <div className="bg-green-500 rounded-full p-1">
                        <Zap className="h-3 w-3 text-white" />
                      </div>
                    )}
                    {file.status === 'processing' && (
                      <div className="bg-orange-500 rounded-full p-1">
                        <Clock className="h-3 w-3 text-white animate-spin" />
                      </div>
                    )}
                  </div>

                  {/* Image/Thumbnail */}
                  <div className="aspect-square bg-gray-100 flex items-center justify-center">
                    {file.type === 'image' ? (
                      <img
                        src={file.thumbnail}
                        alt={file.metadata.alt}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FileIcon className="h-8 w-8 text-gray-400" />
                    )}
                  </div>

                  {/* Overlay d'actions */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingImage(file);
                          setShowImageEditor(true);
                        }}
                        className="p-2 bg-white rounded-full text-gray-600 hover:text-blue-600 transition-colors"
                        title="Modifier"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(file.url, '_blank');
                        }}
                        className="p-2 bg-white rounded-full text-gray-600 hover:text-green-600 transition-colors"
                        title="Voir"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Download logic
                        }}
                        className="p-2 bg-white rounded-full text-gray-600 hover:text-purple-600 transition-colors"
                        title="Télécharger"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Informations du fichier */}
                  <div className="p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <UsageIcon className="h-3 w-3 text-gray-500" />
                      <p className="text-xs text-gray-600 truncate flex-1">{file.name}</p>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{formatFileSize(file.size)}</span>
                      {file.dimensions && (
                        <span>{file.dimensions.width}×{file.dimensions.height}</span>
                      )}
                    </div>
                    {file.tags.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {file.tags.slice(0, 2).map((tag, index) => (
                          <span
                            key={index}
                            className="inline-block bg-gray-100 text-gray-600 text-xs px-1 py-0.5 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {file.tags.length > 2 && (
                          <span className="text-xs text-gray-400">+{file.tags.length - 2}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredFiles.map((file) => {
              const FileIcon = getFileIcon(file.type);
              const UsageIcon = getUsageIcon(file.usage);
              const isSelected = selectedFiles.includes(file.id);

              return (
                <div
                  key={file.id}
                  className={`flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors ${
                    isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleFileSelection(file.id)}
                    className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                  />

                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    {file.type === 'image' ? (
                      <img
                        src={file.thumbnail}
                        alt={file.metadata.alt}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <FileIcon className="h-6 w-6 text-gray-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <UsageIcon className="h-4 w-4 text-gray-500" />
                      <h3 className="font-medium text-gray-900 truncate">{file.name}</h3>
                      {file.isFeatured && <Star className="h-4 w-4 text-yellow-500" />}
                      {file.isOptimized && <Zap className="h-4 w-4 text-green-500" />}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{formatFileSize(file.size)}</span>
                      {file.dimensions && (
                        <span>{file.dimensions.width}×{file.dimensions.height}</span>
                      )}
                      <span>{file.uploadedAt.toLocaleDateString('fr-FR')}</span>
                      <span>{file.uploadedBy}</span>
                    </div>
                    {file.tags.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {file.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingImage(file);
                        setShowImageEditor(true);
                      }}
                      className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                      title="Modifier"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => window.open(file.url, '_blank')}
                      className="p-2 text-gray-600 hover:text-green-600 transition-colors"
                      title="Voir"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {/* Share logic */}}
                      className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
                      title="Partager"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {/* Download logic */}}
                      className="p-2 text-gray-600 hover:text-orange-600 transition-colors"
                      title="Télécharger"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal d'édition d'image */}
      {showImageEditor && editingImage && (
        <ImageEditorModal
          image={editingImage}
          onClose={() => {
            setShowImageEditor(false);
            setEditingImage(null);
          }}
          onSave={(updatedImage) => {
            setMediaFiles(prev => prev.map(f => 
              f.id === updatedImage.id ? updatedImage : f
            ));
            setShowImageEditor(false);
            setEditingImage(null);
          }}
        />
      )}

      {/* Modal de création de dossier */}
      {showFolderCreator && (
        <FolderCreatorModal
          onClose={() => setShowFolderCreator(false)}
          onCreate={(folder) => {
            setFolders(prev => [...prev, folder]);
            setShowFolderCreator(false);
          }}
        />
      )}
    </div>
  );
};

// Modal d'édition d'image
const ImageEditorModal: React.FC<{
  image: MediaFile;
  onClose: () => void;
  onSave: (image: MediaFile) => void;
}> = ({ image, onClose, onSave }) => {
  const [editedImage, setEditedImage] = useState(image);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Modifier l'image</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Prévisualisation */}
          <div className="flex justify-center">
            <img
              src={editedImage.url}
              alt={editedImage.metadata.alt}
              className="max-w-full max-h-64 object-contain rounded-lg border border-gray-200"
            />
          </div>

          {/* Informations de base */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du fichier
              </label>
              <input
                type="text"
                value={editedImage.name}
                onChange={(e) => setEditedImage(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usage
              </label>
              <select
                value={editedImage.usage}
                onChange={(e) => setEditedImage(prev => ({ ...prev, usage: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="logo">Logo</option>
                <option value="hero">Hero/Bannière</option>
                <option value="gallery">Galerie</option>
                <option value="content">Contenu</option>
                <option value="icon">Icône</option>
                <option value="background">Arrière-plan</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Texte alternatif
              </label>
              <input
                type="text"
                value={editedImage.metadata.alt || ''}
                onChange={(e) => setEditedImage(prev => ({
                  ...prev,
                  metadata: { ...prev.metadata, alt: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie
              </label>
              <select
                value={editedImage.category}
                onChange={(e) => setEditedImage(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="logos">Logos</option>
                <option value="hero-images">Images Hero</option>
                <option value="gallery">Galerie</option>
                <option value="icons">Icônes</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={editedImage.metadata.description || ''}
              onChange={(e) => setEditedImage(prev => ({
                ...prev,
                metadata: { ...prev.metadata, description: e.target.value }
              }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (séparés par des virgules)
            </label>
            <input
              type="text"
              value={editedImage.tags.join(', ')}
              onChange={(e) => setEditedImage(prev => ({
                ...prev,
                tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="logo, dgdi, officiel"
            />
          </div>

          {/* Options */}
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={editedImage.isFeatured}
                onChange={(e) => setEditedImage(prev => ({ ...prev, isFeatured: e.target.checked }))}
                className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Image vedette</span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={() => onSave(editedImage)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  );
};

// Modal de création de dossier
const FolderCreatorModal: React.FC<{
  onClose: () => void;
  onCreate: (folder: ImageFolder) => void;
}> = ({ onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newFolder: ImageFolder = {
      id: Date.now().toString(),
      name: name.trim(),
      description: description.trim() || undefined,
      itemCount: 0,
      createdAt: new Date(),
      isSystem: false,
      permissions: {
        canEdit: true,
        canDelete: true,
        canAddFiles: true
      }
    };

    onCreate(newFolder);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Nouveau Dossier</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom du dossier *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Photos événements"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Description optionnelle du dossier"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <FolderPlus className="h-4 w-4" />
              Créer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};