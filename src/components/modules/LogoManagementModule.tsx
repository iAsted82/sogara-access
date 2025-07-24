import React, { useState } from 'react';
import { 
  Shield, 
  Upload, 
  Download, 
  Edit3, 
  Trash2, 
  Eye, 
  Star, 
  Copy, 
  Settings, 
  Plus, 
  X, 
  Save, 
  Award,
  Monitor,
  Smartphone,
  Palette,
  Layers,
  CheckCircle,
  AlertCircle,
  Zap,
  RotateCw,
  Crop,
  Image as ImageIcon
} from 'lucide-react';

interface LogoVariant {
  id: string;
  name: string;
  type: 'primary' | 'secondary' | 'icon' | 'favicon' | 'watermark';
  url: string;
  format: 'svg' | 'png' | 'jpg' | 'ico';
  size: { width: number; height: number };
  fileSize: number;
  backgroundColor: 'transparent' | 'white' | 'dark' | 'colored';
  usage: string[];
  isActive: boolean;
  createdAt: Date;
  lastUpdated: Date;
  versions: LogoVersion[];
}

interface LogoVersion {
  id: string;
  version: string;
  url: string;
  createdAt: Date;
  changes: string;
}

interface BrandColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export const LogoManagementModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'logos' | 'brand' | 'guidelines'>('logos');
  const [showUploader, setShowUploader] = useState(false);
  const [showLogoEditor, setShowLogoEditor] = useState(false);
  const [editingLogo, setEditingLogo] = useState<LogoVariant | null>(null);

  const [logoVariants, setLogoVariants] = useState<LogoVariant[]>([
    {
      id: '1',
      name: 'Logo Principal SOGARA',
      type: 'primary',
      url: 'https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg?auto=compress&cs=tinysrgb&w=400',
      format: 'svg',
      size: { width: 1920, height: 540 },
      fileSize: 45000,
      backgroundColor: 'transparent',
      usage: ['website', 'documents', 'presentations'],
      isActive: true,
      createdAt: new Date('2024-01-01'),
      lastUpdated: new Date('2024-01-15'),
      versions: [
        {
          id: 'v1',
          version: '2.0',
          url: 'https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg?auto=compress&cs=tinysrgb&w=400',
          createdAt: new Date('2024-01-15'),
          changes: 'Amélioration de la lisibilité et modernisation'
        },
        {
          id: 'v2',
          version: '1.0',
          url: 'https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg?auto=compress&cs=tinysrgb&w=400',
          createdAt: new Date('2024-01-01'),
          changes: 'Version initiale'
        }
      ]
    },
    {
      id: '2',
      name: 'Logo Secondaire SOGARA',
      type: 'secondary',
      url: 'https://images.pexels.com/photos/5668772/pexels-photo-5668772.jpeg?auto=compress&cs=tinysrgb&w=400',
      format: 'png',
      size: { width: 800, height: 800 },
      fileSize: 128000,
      backgroundColor: 'white',
      usage: ['social-media', 'mobile', 'app'],
      isActive: true,
      createdAt: new Date('2024-01-05'),
      lastUpdated: new Date('2024-01-10'),
      versions: [
        {
          id: 'v1',
          version: '1.0',
          url: 'https://images.pexels.com/photos/5668772/pexels-photo-5668772.jpeg?auto=compress&cs=tinysrgb&w=400',
          createdAt: new Date('2024-01-05'),
          changes: 'Version pour réseaux sociaux'
        }
      ]
    },
    {
      id: '3',
      name: 'Icône SOGARA',
      type: 'icon',
      url: 'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=400',
      format: 'png',
      size: { width: 512, height: 512 },
      fileSize: 64000,
      backgroundColor: 'transparent',
      usage: ['favicon', 'app-icon', 'notification'],
      isActive: true,
      createdAt: new Date('2024-01-08'),
      lastUpdated: new Date('2024-01-12'),
      versions: []
    },
    {
      id: '4',
      name: 'Favicon SOGARA',
      type: 'favicon',
      url: 'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=400',
      format: 'ico',
      size: { width: 32, height: 32 },
      fileSize: 8000,
      backgroundColor: 'transparent',
      usage: ['website'],
      isActive: true,
      createdAt: new Date('2024-01-10'),
      lastUpdated: new Date('2024-01-10'),
      versions: []
    }
  ]);

  const [brandColors, setBrandColors] = useState<BrandColors>({
    primary: '#1e40af',
    secondary: '#0f766e',
    accent: '#eab308',
    background: '#f8fafc',
    text: '#1e293b'
  });

  const logoTypes = [
    { id: 'primary', label: 'Logo Principal', icon: Award, color: 'text-blue-600', description: 'Logo principal pour tous les supports officiels' },
    { id: 'secondary', label: 'Logo Secondaire', icon: Star, color: 'text-purple-600', description: 'Version alternative pour certains contextes' },
    { id: 'icon', label: 'Icône', icon: Shield, color: 'text-green-600', description: 'Version iconique simplifiée' },
    { id: 'favicon', label: 'Favicon', icon: Monitor, color: 'text-orange-600', description: 'Icône pour navigateurs web' },
    { id: 'watermark', label: 'Filigrane', icon: Layers, color: 'text-gray-600', description: 'Version transparente pour documents' }
  ];

  const usageContexts = [
    { id: 'website', label: 'Site Web', icon: Monitor },
    { id: 'documents', label: 'Documents', icon: ImageIcon },
    { id: 'presentations', label: 'Présentations', icon: Layers },
    { id: 'social-media', label: 'Réseaux Sociaux', icon: Smartphone },
    { id: 'mobile', label: 'Application Mobile', icon: Smartphone },
    { id: 'print', label: 'Impression', icon: ImageIcon }
  ];

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getTypeInfo = (type: string) => {
    return logoTypes.find(t => t.id === type) || logoTypes[0];
  };

  const generateLogoSizes = (originalLogo: LogoVariant) => {
    const sizes = [
      { name: 'Large', width: 1920, height: 540 },
      { name: 'Medium', width: 800, height: 225 },
      { name: 'Small', width: 400, height: 113 },
      { name: 'Icon Large', width: 512, height: 512 },
      { name: 'Icon Medium', width: 256, height: 256 },
      { name: 'Icon Small', width: 128, height: 128 },
      { name: 'Favicon', width: 32, height: 32 }
    ];

    return sizes;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Logos</h1>
          <p className="text-gray-600">Gérez l'identité visuelle de SOGARA Access</p>
        </div>
        <button
          onClick={() => setShowUploader(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Upload className="h-4 w-4" />
          Nouveau Logo
        </button>
      </div>

      {/* Navigation par onglets */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('logos')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'logos'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Logos
            </button>
            <button
              onClick={() => setActiveTab('brand')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'brand'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Couleurs de Marque
            </button>
            <button
              onClick={() => setActiveTab('guidelines')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'guidelines'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Guide d'Usage
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Onglet Logos */}
          {activeTab === 'logos' && (
            <div className="space-y-6">
              {/* Statistiques */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600">Total Logos</p>
                      <p className="text-2xl font-bold text-blue-900">{logoVariants.length}</p>
                    </div>
                    <Award className="h-8 w-8 text-blue-500" />
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600">Actifs</p>
                      <p className="text-2xl font-bold text-green-900">{logoVariants.filter(l => l.isActive).length}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-600">Formats</p>
                      <p className="text-2xl font-bold text-purple-900">
                        {new Set(logoVariants.map(l => l.format)).size}
                      </p>
                    </div>
                    <Layers className="h-8 w-8 text-purple-500" />
                  </div>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-orange-600">Taille Totale</p>
                      <p className="text-2xl font-bold text-orange-900">
                        {formatFileSize(logoVariants.reduce((acc, logo) => acc + logo.fileSize, 0))}
                      </p>
                    </div>
                    <Monitor className="h-8 w-8 text-orange-500" />
                  </div>
                </div>
              </div>

              {/* Grille des logos */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {logoVariants.map((logo) => {
                  const typeInfo = getTypeInfo(logo.type);
                  const TypeIcon = typeInfo.icon;

                  return (
                    <div key={logo.id} className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                      {/* Header de la carte */}
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <TypeIcon className={`h-5 w-5 ${typeInfo.color}`} />
                            <span className="font-medium text-gray-900">{typeInfo.label}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {logo.isActive && (
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                Actif
                              </span>
                            )}
                            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full uppercase">
                              {logo.format}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Image du logo */}
                      <div className="relative bg-white p-8 flex items-center justify-center min-h-[200px]">
                        <img
                          src={logo.url}
                          alt={logo.name}
                          className="max-w-full max-h-32 object-contain"
                        />
                        
                        {/* Overlay d'actions */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditingLogo(logo);
                                setShowLogoEditor(true);
                              }}
                              className="p-2 bg-white rounded-full text-gray-600 hover:text-blue-600 transition-colors"
                              title="Modifier"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => window.open(logo.url, '_blank')}
                              className="p-2 bg-white rounded-full text-gray-600 hover:text-green-600 transition-colors"
                              title="Voir"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {/* Download logic */}}
                              className="p-2 bg-white rounded-full text-gray-600 hover:text-purple-600 transition-colors"
                              title="Télécharger"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Informations du logo */}
                      <div className="p-4 space-y-3">
                        <h3 className="font-semibold text-gray-900">{logo.name}</h3>
                        
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Dimensions:</span>
                            <br />
                            {logo.size.width}×{logo.size.height}px
                          </div>
                          <div>
                            <span className="font-medium">Taille:</span>
                            <br />
                            {formatFileSize(logo.fileSize)}
                          </div>
                        </div>

                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Usage:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {logo.usage.slice(0, 3).map((usage, index) => (
                              <span
                                key={index}
                                className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs"
                              >
                                {usage}
                              </span>
                            ))}
                            {logo.usage.length > 3 && (
                              <span className="text-xs text-gray-400">
                                +{logo.usage.length - 3}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="text-xs text-gray-500">
                          Mis à jour le {logo.lastUpdated.toLocaleDateString('fr-FR')}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                          <button
                            onClick={() => {
                              setEditingLogo(logo);
                              setShowLogoEditor(true);
                            }}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            Modifier
                          </button>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {/* Generate sizes */}}
                              className="text-green-600 hover:text-green-700 text-sm"
                              title="Générer toutes les tailles"
                            >
                              <Zap className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {/* Duplicate */}}
                              className="text-purple-600 hover:text-purple-700 text-sm"
                              title="Dupliquer"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Onglet Couleurs de Marque */}
          {activeTab === 'brand' && (
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">Palette de Couleurs SOGARA Access</h3>
                <p className="text-blue-700 mb-6">
                  Définissez et gérez les couleurs officielles de votre identité visuelle.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {Object.entries(brandColors).map(([key, color]) => (
                    <div key={key} className="bg-white rounded-lg p-4 border border-gray-200">
                      <div
                        className="w-full h-20 rounded-lg mb-3 border border-gray-200"
                        style={{ backgroundColor: color }}
                      ></div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 capitalize">
                          {key === 'primary' ? 'Primaire' :
                           key === 'secondary' ? 'Secondaire' :
                           key === 'accent' ? 'Accent' :
                           key === 'background' ? 'Arrière-plan' :
                           'Texte'}
                        </label>
                        <input
                          type="color"
                          value={color}
                          onChange={(e) => setBrandColors(prev => ({
                            ...prev,
                            [key]: e.target.value
                          }))}
                          className="w-full h-8 rounded border border-gray-300"
                        />
                        <input
                          type="text"
                          value={color}
                          onChange={(e) => setBrandColors(prev => ({
                            ...prev,
                            [key]: e.target.value
                          }))}
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Les couleurs sont utilisées automatiquement dans l'interface et les nouveaux designs.
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Sauvegarder les Couleurs
                  </button>
                </div>
              </div>

              {/* Prévisualisation */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Aperçu des Couleurs</h4>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg" style={{ backgroundColor: brandColors.background }}>
                    <h5 className="font-semibold mb-2" style={{ color: brandColors.text }}>
                      Titre Principal
                    </h5>
                    <p className="mb-3" style={{ color: brandColors.text }}>
                      Ceci est un exemple de texte utilisant les couleurs de votre marque.
                    </p>
                    <div className="flex gap-2">
                      <button
                        className="px-4 py-2 rounded text-white font-medium"
                        style={{ backgroundColor: brandColors.primary }}
                      >
                        Bouton Primaire
                      </button>
                      <button
                        className="px-4 py-2 rounded text-white font-medium"
                        style={{ backgroundColor: brandColors.secondary }}
                      >
                        Bouton Secondaire
                      </button>
                      <button
                        className="px-4 py-2 rounded text-white font-medium"
                        style={{ backgroundColor: brandColors.accent }}
                      >
                        Accent
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Onglet Guide d'Usage */}
          {activeTab === 'guidelines' && (
            <div className="space-y-6">
              <div className="bg-yellow-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-900 mb-4">Guide d'Utilisation des Logos</h3>
                <p className="text-yellow-700">
                  Respectez ces guidelines pour maintenir la cohérence de l'identité visuelle SOGARA Access.
                </p>
              </div>

              {/* Usage par contexte */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {usageContexts.map((context) => {
                  const ContextIcon = context.icon;
                  const recommendedLogos = logoVariants.filter(logo => 
                    logo.usage.includes(context.id)
                  );

                  return (
                    <div key={context.id} className="bg-white rounded-lg border border-gray-200 p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <ContextIcon className="h-6 w-6 text-blue-600" />
                        <h4 className="text-lg font-semibold text-gray-900">{context.label}</h4>
                      </div>

                      <div className="space-y-3">
                        <p className="text-sm text-gray-600">Logos recommandés:</p>
                        <div className="grid grid-cols-2 gap-2">
                          {recommendedLogos.map((logo) => (
                            <div key={logo.id} className="bg-gray-50 rounded-lg p-3">
                              <img
                                src={logo.url}
                                alt={logo.name}
                                className="w-full h-12 object-contain mb-2"
                              />
                              <p className="text-xs text-gray-600 text-center">{logo.name}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Règles générales */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Règles Générales</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium text-green-700 mb-2">✓ À faire</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Respecter l'espace de protection minimum</li>
                      <li>• Utiliser les couleurs officielles</li>
                      <li>• Maintenir les proportions originales</li>
                      <li>• Choisir le bon format selon l'usage</li>
                      <li>• Assurer un contraste suffisant</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-red-700 mb-2">✗ À éviter</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Déformer ou étirer le logo</li>
                      <li>• Modifier les couleurs sans autorisation</li>
                      <li>• Placer sur des fonds peu contrastés</li>
                      <li>• Utiliser des versions basse résolution</li>
                      <li>• Ajouter des effets ou ombres</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal d'édition de logo */}
      {showLogoEditor && editingLogo && (
        <LogoEditorModal
          logo={editingLogo}
          onClose={() => {
            setShowLogoEditor(false);
            setEditingLogo(null);
          }}
          onSave={(updatedLogo) => {
            setLogoVariants(prev => prev.map(l => 
              l.id === updatedLogo.id ? updatedLogo : l
            ));
            setShowLogoEditor(false);
            setEditingLogo(null);
          }}
        />
      )}
    </div>
  );
};

// Modal d'édition de logo
const LogoEditorModal: React.FC<{
  logo: LogoVariant;
  onClose: () => void;
  onSave: (logo: LogoVariant) => void;
}> = ({ logo, onClose, onSave }) => {
  const [editedLogo, setEditedLogo] = useState(logo);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Modifier le Logo</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Prévisualisation */}
          <div className="flex justify-center bg-gray-50 rounded-lg p-8">
            <img
              src={editedLogo.url}
              alt={editedLogo.name}
              className="max-w-full max-h-32 object-contain"
            />
          </div>

          {/* Informations de base */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du logo
              </label>
              <input
                type="text"
                value={editedLogo.name}
                onChange={(e) => setEditedLogo(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de logo
              </label>
              <select
                value={editedLogo.type}
                onChange={(e) => setEditedLogo(prev => ({ ...prev, type: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="primary">Logo Principal</option>
                <option value="secondary">Logo Secondaire</option>
                <option value="icon">Icône</option>
                <option value="favicon">Favicon</option>
                <option value="watermark">Filigrane</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Arrière-plan
              </label>
              <select
                value={editedLogo.backgroundColor}
                onChange={(e) => setEditedLogo(prev => ({ ...prev, backgroundColor: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="transparent">Transparent</option>
                <option value="white">Blanc</option>
                <option value="dark">Sombre</option>
                <option value="colored">Coloré</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Format
              </label>
              <select
                value={editedLogo.format}
                onChange={(e) => setEditedLogo(prev => ({ ...prev, format: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="svg">SVG</option>
                <option value="png">PNG</option>
                <option value="jpg">JPG</option>
                <option value="ico">ICO</option>
              </select>
            </div>
          </div>

          {/* Usage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Contextes d'usage
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {['website', 'documents', 'presentations', 'social-media', 'mobile', 'print'].map((usage) => (
                <label key={usage} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editedLogo.usage.includes(usage)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setEditedLogo(prev => ({ ...prev, usage: [...prev.usage, usage] }));
                      } else {
                        setEditedLogo(prev => ({ ...prev, usage: prev.usage.filter(u => u !== usage) }));
                      }
                    }}
                    className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 capitalize">
                    {usage.replace('-', ' ')}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={editedLogo.isActive}
                onChange={(e) => setEditedLogo(prev => ({ ...prev, isActive: e.target.checked }))}
                className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Logo actif</span>
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
            onClick={() => onSave(editedLogo)}
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