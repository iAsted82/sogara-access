import React, { useState } from 'react';
import { AppleInput } from '../ui/AppleInput';
import { AppleButton } from '../ui/AppleButton';
import { AppleCard } from '../ui/AppleCard';
import { ArrowLeft, SmileIcon as FaceSmileIcon, TouchpadIcon as TouchIdIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface AppleLoginScreenProps {
  onBackToHome?: () => void;
}

export const AppleLoginScreen: React.FC<AppleLoginScreenProps> = ({ onBackToHome }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(email, password);
    } catch (err) {
      setError('Identifiants invalides. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = async (demoEmail: string, isEnabled: boolean = true) => {
    if (!isEnabled) {
      setError('Cette fonction est temporairement désactivée.');
      return;
    }

    setError('');
    setEmail(demoEmail);
    setPassword('password123');
    setIsLoading(true);
    
    try {
      await login(demoEmail, 'password123');
    } catch (err) {
      setError('Échec de la connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  // Comptes avec design Apple-like
  const activeAccounts = [
    { 
      email: 'admin@sogara.ga', 
      role: 'Administrateur Système', 
      name: 'Robert NDONG',
      icon: '🔧', 
      color: 'from-red-500 to-red-600',
      description: 'Accès complet système'
    },
    { 
      email: 'recep@sogara.ga', 
      role: 'Réceptionniste Principal', 
      name: 'Sylvie MBOUMBA',
      icon: '🎯', 
      color: 'from-teal-500 to-teal-600',
      description: 'Accueil intelligent avec IA'
    }
  ];

  const disabledAccounts = [
    { email: 'dg@sogara.ga', role: 'Direction Générale', name: 'M-C. NZUE NGUEMA', icon: '🏛️' },
    { email: 'csd@sogara.ga', role: 'Chef Service Doc', name: 'J-P. NGUEMA', icon: '📄' },
    { email: 'csi@sogara.ga', role: 'Chef Service Imm', name: 'P-O. OBIANG', icon: '🛂' },
    { email: 'agent@sogara.ga', role: 'Agent Guichet', name: 'M-T. AKUE', icon: '👤' },
    { email: 'acf@sogara.ga', role: 'Agent Frontière', name: 'A. MOUNGOUNGOU', icon: '🛡️' },
    { email: 'sr@sogara.ga', role: 'Superviseur', name: 'C. MBENG', icon: '👥' },
    { email: 'ac@sogara.ga', role: 'Auditeur', name: 'S. ELLA', icon: '🔍' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div className="w-full max-w-md animate-fade-in">
        {/* Back Button */}
        {onBackToHome && (
          <div className="mb-6">
            <AppleButton
              variant="ghost"
              onClick={onBackToHome}
              icon={ArrowLeft}
              className="text-white hover:bg-white/10"
            >
              Retour à l'accueil
            </AppleButton>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <div className="glass rounded-3xl p-4 inline-block mb-6">
            <img 
              src="/logo DGDI.PNG" 
              alt="Logo DGDI" 
              className="h-16 w-auto"
            />
          </div>
          <h1 className="text-large-title text-white mb-2">SOGARA Access</h1>
          <p className="text-title-3 text-white/80 mb-2">Système de Gestion Intégré</p>
          <p className="text-body text-white/60">
            Direction Générale de la Documentation et de l'Immigration
          </p>
        </div>

        {/* Login Form */}
        <AppleCard variant="glass" className="mb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <AppleInput
                label="Adresse email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nom@dgdi.ga"
                variant="floating"
                required
              />

              <AppleInput
                label="Mot de passe"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                variant="floating"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-callout text-red-800 flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  {error}
                </p>
              </div>
            )}

            <AppleButton
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
            >
              {isLoading ? 'Connexion en cours...' : 'Se connecter'}
            </AppleButton>

            {/* Biometric Options */}
            <div className="flex items-center justify-center gap-4 pt-4">
              <button
                type="button"
                className="glass rounded-xl p-3 text-white hover:bg-white/10 transition-all duration-200"
                title="Touch ID"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zm0 2c4.963 0 9 4.037 9 9s-4.037 9-9 9-9-4.037-9-9 4.037-9 9-9z"/>
                </svg>
              </button>
              <button
                type="button"
                className="glass rounded-xl p-3 text-white hover:bg-white/10 transition-all duration-200"
                title="Face ID"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                </svg>
              </button>
            </div>
          </form>
        </AppleCard>

        {/* Quick Access */}
        <AppleCard variant="glass" className="mb-6">
          <div className="text-center mb-4">
            <h3 className="text-headline text-white font-semibold">Accès Rapide</h3>
            <p className="text-footnote text-white/70">Équipe DGDI autorisée</p>
          </div>
          
          {/* Active Accounts */}
          <div className="space-y-3 mb-6">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-caption-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Fonctions Actives
              </div>
            </div>
            
            {activeAccounts.map((account, index) => (
              <button
                key={index}
                onClick={() => quickLogin(account.email, true)}
                disabled={isLoading}
                className={`w-full bg-gradient-to-r ${account.color} text-white p-4 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 shadow-lg hover:shadow-xl`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{account.icon}</span>
                  <div className="text-left flex-1">
                    <div className="text-callout font-semibold">{account.role}</div>
                    <div className="text-caption-1 opacity-90">{account.name}</div>
                    <div className="text-caption-2 opacity-75">{account.description}</div>
                  </div>
                  <div className="text-caption-2 opacity-75 bg-white/20 px-2 py-1 rounded-lg">
                    {account.email.split('@')[0]}
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          {/* Disabled Accounts */}
          <div className="space-y-2">
            <div className="text-center mb-3">
              <div className="inline-flex items-center gap-2 bg-gray-500/20 text-gray-300 px-3 py-1 rounded-full text-caption-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                Maintenance
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {disabledAccounts.map((account, index) => (
                <div
                  key={index}
                  className="bg-gray-500/20 text-gray-300 p-3 rounded-xl opacity-60 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gray-600/50 flex items-center justify-center">
                    <span className="bg-red-500 text-white text-caption-2 px-2 py-1 rounded-full font-semibold">
                      DÉSACTIVÉ
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="text-lg opacity-50">{account.icon}</span>
                    <div className="text-caption-2 mt-1">{account.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-4 text-center space-y-1">
            <p className="text-caption-1 text-white/70">
              🔹 Accès Admin et Réceptionniste uniquement
            </p>
            <p className="text-caption-2 text-white/60">
              Mot de passe : password123
            </p>
          </div>
        </AppleCard>

        {/* Footer */}
        <div className="text-center text-white/60 text-caption-1 space-y-1">
          <p>© 2024 République Gabonaise - SOGARA</p>
          <p>Zone industrielle d'Oloumi Nord, Libreville</p>
        </div>
      </div>
    </div>
  );
};