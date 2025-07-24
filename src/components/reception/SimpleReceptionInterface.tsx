import React, { useState, useEffect } from 'react';
import { 
  User, 
  Calendar, 
  Search, 
  MessageSquare, 
  ArrowLeft, 
  Check, 
  X, 
  HelpCircle,
  Clock,
  Phone,
  Building2,
  FileText,
  AlertCircle,
  CheckCircle,
  Volume2,
  Settings
} from 'lucide-react';

interface SimpleReceptionInterfaceProps {
  onBackToAdvanced?: () => void;
}

interface Visitor {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  motif: string;
  personneAVoir: string;
  heureArrivee: string;
  status: 'present' | 'termine';
}

interface RendezVous {
  id: string;
  nom: string;
  heure: string;
  motif: string;
  status: 'prevu' | 'arrive' | 'termine';
}

export const SimpleReceptionInterface: React.FC<SimpleReceptionInterfaceProps> = ({ 
  onBackToAdvanced 
}) => {
  const [currentScreen, setCurrentScreen] = useState<'accueil' | 'nouveau-client' | 'rendez-vous' | 'recherche' | 'messages'>('accueil');
  const [showHelp, setShowHelp] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Données simulées
  const [visiteurs, setVisiteurs] = useState<Visitor[]>([
    {
      id: '1',
      nom: 'OBAME',
      prenom: 'Marie',
      telephone: '01 23 45 67',
      motif: 'Demande CNI',
      personneAVoir: 'M. NGUEMA',
      heureArrivee: '09:15',
      status: 'present'
    }
  ]);

  const [rendezVous] = useState<RendezVous[]>([
    {
      id: '1',
      nom: 'Paul OBIANG',
      heure: '14:30',
      motif: 'Renouvellement passeport',
      status: 'prevu'
    },
    {
      id: '2',
      nom: 'Sophie ELLA',
      heure: '15:00',
      motif: 'Visa affaires',
      status: 'prevu'
    }
  ]);

  // Formulaire nouveau client
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    motif: '',
    personneAVoir: ''
  });

  // Mise à jour de l'heure
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Liste des motifs prédéfinis
  const motifsCommuns = [
    'Demande CNI',
    'Renouvellement passeport',
    'Demande visa',
    'Certificat de nationalité',
    'Extrait acte naissance',
    'Autre'
  ];

  // Personnel disponible
  const personnel = [
    'M. NGUEMA (Documentation)',
    'Mme AKUE (Passeports)',
    'M. OBIANG (Immigration)',
    'Mme MOUELE (Administration)'
  ];

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    
    // Son de confirmation (simulation)
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance('Enregistrement réussi');
      utterance.volume = 0.1;
      speechSynthesis.speak(utterance);
    }
    
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  const handleSubmitNouveauClient = () => {
    // Validation simple
    if (!formData.nom || !formData.prenom) {
      alert('❌ Le nom et le prénom sont obligatoires.\nMerci de les remplir.');
      return;
    }

    // Créer nouveau visiteur
    const nouveauVisiteur: Visitor = {
      id: Date.now().toString(),
      nom: formData.nom.toUpperCase(),
      prenom: formData.prenom,
      telephone: formData.telephone,
      motif: formData.motif,
      personneAVoir: formData.personneAVoir,
      heureArrivee: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      status: 'present'
    };

    setVisiteurs(prev => [nouveauVisiteur, ...prev]);
    
    // Réinitialiser le formulaire
    setFormData({
      nom: '',
      prenom: '',
      telephone: '',
      motif: '',
      personneAVoir: ''
    });

    showSuccessMessage(`${nouveauVisiteur.prenom} ${nouveauVisiteur.nom} a été enregistré avec succès !`);
    
    // Retour à l'accueil après 2 secondes
    setTimeout(() => {
      setCurrentScreen('accueil');
    }, 2000);
  };

  const renderAccueil = () => (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* En-tête simple */}
      <header className="text-center mb-8 bg-white rounded-lg p-6 shadow-sm">
        <img 
          src="/Photoroom_20250703_164401.PNG" 
          alt="Logo SOGARA" 
          className="h-16 mx-auto mb-4"
        />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">ACCUEIL SOGARA</h1>
        <div className="text-xl text-blue-600 font-semibold">
          {currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
        </div>
        <div className="text-sm text-gray-600 mt-1">
          {currentTime.toLocaleDateString('fr-FR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </header>

      {/* Boutons principaux - TRÈS GRANDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <button
          onClick={() => setCurrentScreen('nouveau-client')}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl p-8 transition-all transform hover:scale-105 shadow-lg min-h-[200px] flex flex-col items-center justify-center group"
        >
          <User className="h-16 w-16 mb-4 group-hover:scale-110 transition-transform" />
          <span className="text-2xl font-bold mb-2">NOUVEAU CLIENT</span>
          <span className="text-lg opacity-90">Enregistrer un visiteur</span>
          <div className="mt-3 bg-white/20 rounded-full px-4 py-2">
            <span className="text-sm">Étape 1 → Cliquez ici</span>
          </div>
        </button>

        <button
          onClick={() => setCurrentScreen('rendez-vous')}
          className="bg-green-600 hover:bg-green-700 text-white rounded-2xl p-8 transition-all transform hover:scale-105 shadow-lg min-h-[200px] flex flex-col items-center justify-center group"
        >
          <Calendar className="h-16 w-16 mb-4 group-hover:scale-110 transition-transform" />
          <span className="text-2xl font-bold mb-2">RENDEZ-VOUS</span>
          <span className="text-lg opacity-90">Voir les RDV du jour</span>
          <div className="mt-3 bg-white/20 rounded-full px-4 py-2">
            <span className="text-sm">{rendezVous.length} rendez-vous aujourd'hui</span>
          </div>
        </button>

        <button
          onClick={() => setCurrentScreen('recherche')}
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-2xl p-8 transition-all transform hover:scale-105 shadow-lg min-h-[200px] flex flex-col items-center justify-center group"
        >
          <Search className="h-16 w-16 mb-4 group-hover:scale-110 transition-transform" />
          <span className="text-2xl font-bold mb-2">RECHERCHER</span>
          <span className="text-lg opacity-90">Trouver un client</span>
          <div className="mt-3 bg-white/20 rounded-full px-4 py-2">
            <span className="text-sm">{visiteurs.length} clients présents</span>
          </div>
        </button>

        <button
          onClick={() => setCurrentScreen('messages')}
          className="bg-orange-600 hover:bg-orange-700 text-white rounded-2xl p-8 transition-all transform hover:scale-105 shadow-lg min-h-[200px] flex flex-col items-center justify-center group"
        >
          <MessageSquare className="h-16 w-16 mb-4 group-hover:scale-110 transition-transform" />
          <span className="text-2xl font-bold mb-2">MESSAGES</span>
          <span className="text-lg opacity-90">Appels en attente</span>
          <div className="mt-3 bg-white/20 rounded-full px-4 py-2">
            <span className="text-sm">2 messages</span>
          </div>
        </button>
      </div>

      {/* Informations importantes en bas */}
      <div className="mt-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
            📊 SITUATION ACTUELLE
          </h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{visiteurs.filter(v => v.status === 'present').length}</div>
              <div className="text-sm text-blue-800">Clients présents</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{rendezVous.filter(r => r.status === 'prevu').length}</div>
              <div className="text-sm text-green-800">Rendez-vous prévus</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">2</div>
              <div className="text-sm text-purple-800">Messages urgents</div>
            </div>
          </div>
        </div>
      </div>

      {/* Boutons d'aide et paramètres */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3">
        <button
          onClick={() => setShowHelp(true)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-full p-4 shadow-lg transition-all hover:scale-110"
          title="Aide et guide d'utilisation"
        >
          <HelpCircle className="h-8 w-8" />
        </button>
        
        {onBackToAdvanced && (
          <button
            onClick={onBackToAdvanced}
            className="bg-gray-600 hover:bg-gray-700 text-white rounded-full p-4 shadow-lg transition-all hover:scale-110"
            title="Interface avancée"
          >
            <Settings className="h-8 w-8" />
          </button>
        )}
      </div>
    </div>
  );

  const renderNouveauClient = () => (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* En-tête avec retour */}
      <header className="flex items-center mb-8">
        <button
          onClick={() => setCurrentScreen('accueil')}
          className="bg-white hover:bg-gray-50 text-gray-700 rounded-lg p-4 shadow-sm transition-all mr-4 flex items-center gap-2 text-lg font-medium"
        >
          <ArrowLeft className="h-6 w-6" />
          RETOUR
        </button>
        <h1 className="text-3xl font-bold text-gray-900">NOUVEAU CLIENT</h1>
      </header>

      {/* Formulaire très simple */}
      <div className="max-w-2xl mx-auto bg-white rounded-2xl p-8 shadow-lg">
        <div className="text-center mb-8">
          <User className="h-20 w-20 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Enregistrement d'un visiteur</h2>
          <p className="text-lg text-gray-600">Remplissez les informations ci-dessous</p>
        </div>

        {/* Numérotation des étapes */}
        <div className="space-y-8">
          {/* Étape 1 */}
          <div className="border-l-4 border-blue-500 pl-6">
            <div className="flex items-center mb-4">
              <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">1</div>
              <h3 className="text-xl font-bold text-gray-900">NOM DE FAMILLE *</h3>
            </div>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
              className="w-full p-4 text-xl border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all"
              placeholder="Exemple: OBAME"
              style={{ fontSize: '18px' }}
            />
            {!formData.nom && (
              <p className="text-red-600 mt-2 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Ce champ est obligatoire
              </p>
            )}
          </div>

          {/* Étape 2 */}
          <div className="border-l-4 border-blue-500 pl-6">
            <div className="flex items-center mb-4">
              <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">2</div>
              <h3 className="text-xl font-bold text-gray-900">PRÉNOM *</h3>
            </div>
            <input
              type="text"
              value={formData.prenom}
              onChange={(e) => setFormData(prev => ({ ...prev, prenom: e.target.value }))}
              className="w-full p-4 text-xl border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all"
              placeholder="Exemple: Marie"
              style={{ fontSize: '18px' }}
            />
            {!formData.prenom && (
              <p className="text-red-600 mt-2 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Ce champ est obligatoire
              </p>
            )}
          </div>

          {/* Étape 3 */}
          <div className="border-l-4 border-green-500 pl-6">
            <div className="flex items-center mb-4">
              <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">3</div>
              <h3 className="text-xl font-bold text-gray-900">TÉLÉPHONE</h3>
            </div>
            <input
              type="tel"
              value={formData.telephone}
              onChange={(e) => setFormData(prev => ({ ...prev, telephone: e.target.value }))}
              className="w-full p-4 text-xl border-2 border-gray-300 rounded-lg focus:border-green-500 focus:ring-4 focus:ring-green-200 transition-all"
              placeholder="Exemple: 01 23 45 67"
              style={{ fontSize: '18px' }}
            />
          </div>

          {/* Étape 4 */}
          <div className="border-l-4 border-purple-500 pl-6">
            <div className="flex items-center mb-4">
              <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">4</div>
              <h3 className="text-xl font-bold text-gray-900">MOTIF DE VISITE</h3>
            </div>
            <select
              value={formData.motif}
              onChange={(e) => setFormData(prev => ({ ...prev, motif: e.target.value }))}
              className="w-full p-4 text-xl border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all"
              style={{ fontSize: '18px' }}
            >
              <option value="">-- Choisir le motif --</option>
              {motifsCommuns.map(motif => (
                <option key={motif} value={motif}>{motif}</option>
              ))}
            </select>
          </div>

          {/* Étape 5 */}
          <div className="border-l-4 border-orange-500 pl-6">
            <div className="flex items-center mb-4">
              <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">5</div>
              <h3 className="text-xl font-bold text-gray-900">PERSONNE À VOIR</h3>
            </div>
            <select
              value={formData.personneAVoir}
              onChange={(e) => setFormData(prev => ({ ...prev, personneAVoir: e.target.value }))}
              className="w-full p-4 text-xl border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-4 focus:ring-orange-200 transition-all"
              style={{ fontSize: '18px' }}
            >
              <option value="">-- Choisir la personne --</option>
              {personnel.map(personne => (
                <option key={personne} value={personne}>{personne}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Boutons d'action TRÈS GRANDS */}
        <div className="flex gap-6 mt-12">
          <button
            onClick={() => setCurrentScreen('accueil')}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white rounded-xl p-6 text-xl font-bold transition-all transform hover:scale-105 flex items-center justify-center gap-3 min-h-[80px]"
          >
            <X className="h-8 w-8" />
            ANNULER
          </button>
          
          <button
            onClick={handleSubmitNouveauClient}
            disabled={!formData.nom || !formData.prenom}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl p-6 text-xl font-bold transition-all transform hover:scale-105 flex items-center justify-center gap-3 min-h-[80px]"
          >
            <Check className="h-8 w-8" />
            ENREGISTRER
          </button>
        </div>
      </div>
    </div>
  );

  const renderRendezVous = () => (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* En-tête avec retour */}
      <header className="flex items-center mb-8">
        <button
          onClick={() => setCurrentScreen('accueil')}
          className="bg-white hover:bg-gray-50 text-gray-700 rounded-lg p-4 shadow-sm transition-all mr-4 flex items-center gap-2 text-lg font-medium"
        >
          <ArrowLeft className="h-6 w-6" />
          RETOUR
        </button>
        <h1 className="text-3xl font-bold text-gray-900">RENDEZ-VOUS DU JOUR</h1>
      </header>

      {/* Liste des rendez-vous */}
      <div className="max-w-4xl mx-auto space-y-4">
        {rendezVous.map(rdv => (
          <div key={rdv.id} className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 rounded-full p-4">
                  <Calendar className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{rdv.nom}</h3>
                  <p className="text-lg text-gray-600">{rdv.motif}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{rdv.heure}</div>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                  rdv.status === 'prevu' ? 'bg-yellow-100 text-yellow-800' :
                  rdv.status === 'arrive' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {rdv.status === 'prevu' ? 'PRÉVU' :
                   rdv.status === 'arrive' ? 'ARRIVÉ' : 'TERMINÉ'}
                </span>
              </div>
            </div>
          </div>
        ))}
        
        {rendezVous.length === 0 && (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-600 mb-2">Aucun rendez-vous aujourd'hui</h3>
            <p className="text-lg text-gray-500">Vous n'avez pas de rendez-vous programmés</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderRecherche = () => (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* En-tête avec retour */}
      <header className="flex items-center mb-8">
        <button
          onClick={() => setCurrentScreen('accueil')}
          className="bg-white hover:bg-gray-50 text-gray-700 rounded-lg p-4 shadow-sm transition-all mr-4 flex items-center gap-2 text-lg font-medium"
        >
          <ArrowLeft className="h-6 w-6" />
          RETOUR
        </button>
        <h1 className="text-3xl font-bold text-gray-900">CLIENTS PRÉSENTS</h1>
      </header>

      {/* Liste des visiteurs */}
      <div className="max-w-4xl mx-auto space-y-4">
        {visiteurs.filter(v => v.status === 'present').map(visiteur => (
          <div key={visiteur.id} className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 rounded-full p-4">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {visiteur.prenom} {visiteur.nom}
                  </h3>
                  <p className="text-lg text-gray-600">{visiteur.motif}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Arrivé à {visiteur.heureArrivee}
                    </span>
                    <span className="flex items-center gap-1">
                      <Building2 className="h-4 w-4" />
                      {visiteur.personneAVoir}
                    </span>
                    {visiteur.telephone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {visiteur.telephone}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <button
                  onClick={() => {
                    setVisiteurs(prev => prev.map(v => 
                      v.id === visiteur.id ? { ...v, status: 'termine' as const } : v
                    ));
                    showSuccessMessage(`${visiteur.prenom} ${visiteur.nom} - Visite terminée`);
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-6 py-3 text-lg font-medium transition-all transform hover:scale-105 flex items-center gap-2"
                >
                  <Check className="h-6 w-6" />
                  TERMINÉ
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {visiteurs.filter(v => v.status === 'present').length === 0 && (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm">
            <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-600 mb-2">Aucun client présent</h3>
            <p className="text-lg text-gray-500">Tous les clients ont terminé leur visite</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderMessages = () => (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* En-tête avec retour */}
      <header className="flex items-center mb-8">
        <button
          onClick={() => setCurrentScreen('accueil')}
          className="bg-white hover:bg-gray-50 text-gray-700 rounded-lg p-4 shadow-sm transition-all mr-4 flex items-center gap-2 text-lg font-medium"
        >
          <ArrowLeft className="h-6 w-6" />
          RETOUR
        </button>
        <h1 className="text-3xl font-bold text-gray-900">MESSAGES</h1>
      </header>

      {/* Messages simulés */}
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-red-500">
          <div className="flex items-center gap-4">
            <div className="bg-red-100 rounded-full p-4">
              <Phone className="h-8 w-8 text-red-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Appel urgent</h3>
              <p className="text-lg text-gray-600">M. MBENG demande à rappeler</p>
              <p className="text-sm text-gray-500">Il y a 15 minutes</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-orange-500">
          <div className="flex items-center gap-4">
            <div className="bg-orange-100 rounded-full p-4">
              <MessageSquare className="h-8 w-8 text-orange-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Message important</h3>
              <p className="text-lg text-gray-600">Réunion décalée à 16h</p>
              <p className="text-sm text-gray-500">Il y a 1 heure</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHelp = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">AIDE ET GUIDE</h2>
            <button
              onClick={() => setShowHelp(false)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="h-8 w-8" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
              <User className="h-6 w-6" />
              Comment enregistrer un nouveau client ?
            </h3>
            <ol className="space-y-2 text-blue-800">
              <li>1️⃣ Cliquez sur le bouton bleu "NOUVEAU CLIENT"</li>
              <li>2️⃣ Remplissez le nom de famille (obligatoire)</li>
              <li>3️⃣ Remplissez le prénom (obligatoire)</li>
              <li>4️⃣ Ajoutez le numéro de téléphone (optionnel)</li>
              <li>5️⃣ Choisissez le motif de visite</li>
              <li>6️⃣ Sélectionnez la personne à voir</li>
              <li>7️⃣ Cliquez sur "ENREGISTRER"</li>
            </ol>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="text-lg font-bold text-green-900 mb-3 flex items-center gap-2">
              <Calendar className="h-6 w-6" />
              Comment voir les rendez-vous ?
            </h3>
            <ol className="space-y-2 text-green-800">
              <li>1️⃣ Cliquez sur le bouton vert "RENDEZ-VOUS"</li>
              <li>2️⃣ Vous verrez tous les rendez-vous du jour</li>
              <li>3️⃣ L'heure et le motif sont affichés clairement</li>
            </ol>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <h3 className="text-lg font-bold text-purple-900 mb-3 flex items-center gap-2">
              <Search className="h-6 w-6" />
              Comment voir qui est présent ?
            </h3>
            <ol className="space-y-2 text-purple-800">
              <li>1️⃣ Cliquez sur le bouton violet "RECHERCHER"</li>
              <li>2️⃣ Vous verrez tous les clients actuellement présents</li>
              <li>3️⃣ Cliquez sur "TERMINÉ" quand ils partent</li>
            </ol>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4">
            <h3 className="text-lg font-bold text-yellow-900 mb-3">⚠️ En cas de problème</h3>
            <ul className="space-y-1 text-yellow-800">
              <li>• Appelez le support technique: <strong>123</strong></li>
              <li>• Redémarrez l'application si elle se bloque</li>
              <li>• N'hésitez pas à demander de l'aide</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  // Notification de succès
  const renderSuccessNotification = () => (
    showSuccess && (
      <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-8 py-4 rounded-xl shadow-2xl z-50 flex items-center gap-3 animate-fade-in">
        <CheckCircle className="h-8 w-8" />
        <div>
          <div className="text-xl font-bold">✅ SUCCÈS</div>
          <div className="text-lg">{successMessage}</div>
        </div>
      </div>
    )
  );

  return (
    <div className="font-sans" style={{ fontSize: '16px', lineHeight: '1.5' }}>
      {currentScreen === 'accueil' && renderAccueil()}
      {currentScreen === 'nouveau-client' && renderNouveauClient()}
      {currentScreen === 'rendez-vous' && renderRendezVous()}
      {currentScreen === 'recherche' && renderRecherche()}
      {currentScreen === 'messages' && renderMessages()}
      
      {showHelp && renderHelp()}
      {renderSuccessNotification()}

      {/* Son de notification */}
      <audio id="success-sound" preload="auto">
        <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBCl+zPLXeicEK4B1c5IhCADT" type="audio/wav" />
      </audio>
    </div>
  );
};