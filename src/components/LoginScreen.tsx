import React, { useState, useEffect } from 'react';
import { Lock, User, AlertCircle, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LoginScreenProps {
  onBackToHome?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onBackToHome }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, loading } = useAuth();

  // Sauvegarde des données avant suppression (journalisation uniquement)
  useEffect(() => {
    console.log('📋 Sauvegarde des comptes avant suppression effectuée');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password);
    } catch (err) {
      setError('Identifiants invalides. Veuillez réessayer.');
    }
  };

  const quickLogin = async (demoEmail: string, isEnabled: boolean = true) => {
    if (!isEnabled) {
      setError('Cette fonction est temporairement désactivée.');
      return;
    }

    setError('');
    setEmail(demoEmail);
    setPassword('Admin123!');
    
    try {
      await login(demoEmail, 'Admin123!');
    } catch (err) {
      setError('Échec de la connexion. Veuillez réessayer.');
    }
  };

  // Comptes prioritaires (actifs)
  const activeAccounts = [
    { 
      email: 'admin@sogara.ga', 
      role: 'Administrateur Système', 
      name: 'Robert NDONG',
      icon: '🔧', 
      color: 'from-red-500 to-red-600',
      description: 'Accès complet système',
      priority: 1
    },
    { 
      email: 'recep@sogara.ga', 
      role: 'Réceptionniste Principal', 
      name: 'Sylvie MBOUMBA',
      icon: '🎯', 
      color: 'from-teal-500 to-teal-600',
      description: 'Accueil intelligent avec IA',
      priority: 2
    }
  ];
  // Les comptes désactivés ont été supprimés du système
  const disabledAccounts: never[] = [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 py-4 px-4 flex items-center justify-center">
      <div className="w-full max-w-sm mx-auto">
        {/* Back to Home Button */}
        {onBackToHome && (
          <div className="mb-6">
            <button
              onClick={onBackToHome}
              className="text-white hover:text-blue-200 flex items-center gap-2 transition-colors min-h-[44px] px-2 -ml-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Retour à l'accueil</span>
            </button>
          </div>
        )}

        {/* Header - MOBILE OPTIMISÉ */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <img
              src="/Photoroom_20250703_164401.PNG"
              alt="Logo SOGARA"
              className="h-20 w-auto bg-white rounded-full p-1 shadow-lg"
            />
          </div>
          <h1 className="text-xl font-bold text-white mb-2">SOGARA Access</h1>
           <p className="text-teal-100 text-xs leading-relaxed">
             Mot de passe : Admin123!
          </p>
          <p className="text-blue-200 text-xs">
            Direction Générale de la Documentation et de l'Immigration
          </p>
        </div>

        {/* Login Form - MOBILE FIRST */}
        <div className="bg-white rounded-lg shadow-xl p-5 mb-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Adresse email
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-base"
                  placeholder="nom@dgi.ga"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-base"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 h-5 w-5 text-gray-400 hover:text-gray-600 min-w-[20px] min-h-[20px] flex items-center justify-center"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-800 text-white py-3 rounded-lg font-semibold hover:bg-blue-900 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] text-base"
            >
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-gray-600 text-xs">
              Accès sécurisé réservé aux agents autorisés SOGARA
            </p>
          </div>
        </div>

        {/* Demo Accounts - MOBILE STACK LAYOUT */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <h3 className="text-white font-semibold mb-4 text-center text-sm">Accès Rapide - SOGARA</h3>
          
          {/* Comptes Actifs - MOBILE STACK */}
          <div className="space-y-3 mb-4">
            <div className="text-center mb-3">
              <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Fonctions Actives
              </div>
            </div>
            
            {activeAccounts.map((account, index) => (
              <button
                key={index}
                onClick={() => quickLogin(account.email, true)}
                disabled={loading}
                className={`w-full bg-gradient-to-r ${account.color} text-white p-4 rounded-lg font-medium text-sm transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg border-2 border-white/20 min-h-[80px]`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl flex-shrink-0">{account.icon}</span>
                  <div className="text-left flex-1 min-w-0">
                    <div className="font-bold text-base leading-tight">{account.role}</div>
                    <div className="text-xs opacity-90 mt-1">{account.name}</div>
                    <div className="text-xs opacity-75 mt-1 truncate">{account.description}</div>
                  </div>
                  <div className="text-xs opacity-75 flex flex-col items-end flex-shrink-0">
                    <div className="bg-white/20 px-2 py-1 rounded text-center min-w-[50px] text-xs">
                      {account.email.split('@')[0]}
                    </div>
                    {account.priority === 1 && (
                      <div className="text-xs mt-1 text-yellow-300 font-bold">🔥 ADMIN</div>
                    )}
                    {account.priority === 2 && (
                      <div className="text-xs mt-1 text-blue-200 font-bold">⭐ IA</div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          {/* Séparateur */}
          {disabledAccounts.length > 0 && <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-blue-800 px-3 text-blue-200">Fonctions désactivées</span>
            </div>
          </div>}
          
          {/* Comptes Désactivés - MOBILE STACK SIMPLE */}
          {disabledAccounts.length > 0 && (
            <div className="space-y-2">
              <div className="text-center mb-3">
                <div className="inline-flex items-center gap-2 bg-gray-500/20 text-gray-300 px-3 py-1 rounded-full text-xs">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  Maintenance en cours
                </div>
              </div>
              
              {disabledAccounts.map((account, index) => (
                <button
                  key={index}
                  onClick={() => quickLogin(account.email, false)}
                  disabled={true}
                  className="w-full bg-gray-500 text-gray-300 p-3 rounded-lg font-medium text-sm transition-all cursor-not-allowed flex items-center gap-3 justify-between opacity-60 relative overflow-hidden min-h-[56px]"
                >
                  {/* Overlay de désactivation */}
                  <div className="absolute inset-0 bg-gray-600/50 flex items-center justify-center">
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                      DÉSACTIVÉ
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 opacity-50 flex-1 min-w-0">
                    <span className="text-lg flex-shrink-0">{account.icon}</span>
                    <div className="text-left flex-1 min-w-0">
                      <div className="font-bold text-xs truncate">{account.role}</div>
                      <div className="text-xs opacity-70 truncate">{account.name}</div>
                    </div>
                  </div>
                  <div className="text-xs opacity-60 flex-shrink-0">
                    {account.email.split('@')[0]}
                  </div>
                </button>
              ))}
            </div>
          )}
          
          <div className="mt-4 text-center space-y-1">
            <p className="text-blue-200 text-xs font-medium">
              🔹 Accès Admin DGDI et Réceptionniste uniquement
            </p>
            <p className="text-blue-300 text-xs">
              Mot de passe : password123
            </p>
          </div>
          
          {/* Encart spécial réceptionniste - MOBILE COMPACT */}
          <div className="mt-4 p-3 bg-teal-600/30 border border-teal-400/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🎯</span>
              <span className="text-white font-medium text-sm">Réceptionniste Intelligent SOGARA</span>
            </div>
            <p className="text-blue-200 text-xs mb-2">
              Mot de passe: Admin123!
            </p>
            <p className="text-blue-200 text-xs">
              ✅ Scanner IA 99% précision • Badges QR sécurisés • Gestion visiteurs temps réel • 
              Statistiques intelligentes • Notifications automatiques
             </p>
          </div>
        </div>

        {/* Footer - MOBILE COMPACT */}
        <div className="mt-6 text-center text-blue-200 text-xs space-y-1">
          <p>© 2024 République Gabonaise - SOGARA</p>
          <p>Direction Générale de la Documentation et de l'Immigration</p>
          <p className="mt-1">Développé et conçu par ORGANEUS Gabon pour la SOGARA | © 2024 Tous droits réservés</p>
        </div>
      </div>
    </div>
  );
};