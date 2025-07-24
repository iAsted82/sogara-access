import React from 'react';
import { HelpCircle, Sparkles, Play, BookOpen, Zap } from 'lucide-react';

interface GuideButtonProps {
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'minimal' | 'floating';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
  isVisible?: boolean;
}

export const GuideButton: React.FC<GuideButtonProps> = ({
  onClick,
  variant = 'primary',
  size = 'md',
  label,
  className = '',
  isVisible = true
}) => {
  if (!isVisible) return null;

  const baseClasses = 'flex items-center gap-2 font-medium transition-all hover:scale-105 transform touch-target';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl',
    secondary: 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-50',
    minimal: 'text-blue-600 hover:text-blue-700 hover:bg-blue-50',
    floating: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-2xl hover:shadow-3xl'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm rounded-lg',
    md: 'px-4 py-2 text-sm rounded-lg',
    lg: 'px-6 py-3 text-base rounded-xl'
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      title={label || "Guide d'utilisation interactif"}
    >
      {variant === 'minimal' ? (
        <HelpCircle className="h-4 w-4" />
      ) : variant === 'floating' ? (
        <BookOpen className="h-5 w-5" />
      ) : (
        <Sparkles className="h-4 w-4" />
      )}
      {label && <span>{label}</span>}
      {!label && variant !== 'minimal' && (
        <span className="hidden sm:inline">Guide</span>
      )}
    </button>
  );
};

export const FloatingGuideButton: React.FC<{
  onClick: () => void;
  isVisible: boolean;
}> = ({ onClick, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40">
      {/* Bouton principal */}
      <button
        onClick={onClick}
        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-full shadow-2xl hover:from-blue-700 hover:to-blue-800 transition-all hover:scale-110 transform min-w-[56px] min-h-[56px] flex items-center justify-center"
        title="Guide d'utilisation DGDI"
      >
        <div className="relative">
          <BookOpen className="h-6 w-6" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        </div>
      </button>
      
      {/* Label informatif */}
      <div className="absolute bottom-full left-0 mb-2 bg-black/80 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
        Aide & Guide d'utilisation
      </div>
    </div>
  );
};

export const QuickStartButton: React.FC<{
  onClick: () => void;
  className?: string;
}> = ({ onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all hover:scale-105 transform shadow-lg hover:shadow-xl font-medium text-xs min-h-[40px] ${className}`}
      title="Démarrage rapide - 3 étapes essentielles"
    >
      <Zap className="h-3 w-3" />
      <span className="hidden sm:inline">Démarrage Rapide</span>
      <span className="sm:hidden">Quick</span>
    </button>
  );
};

// Bouton d'aide contextuelle globale
export const GlobalHelpButton: React.FC<{
  onGuideClick: () => void;
  onHelpClick?: () => void;
}> = ({ onGuideClick, onHelpClick }) => {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      {/* Bouton aide contextuelle */}
      {onHelpClick && (
        <button
          onClick={onHelpClick}
          aria-label="Aide contextuelle"
          className="bg-gray-600 text-white p-3 rounded-full shadow-xl hover:bg-gray-700 transition-all hover:scale-110 transform min-w-[48px] min-h-[48px] flex items-center justify-center"
          title="Aide contextuelle"
          data-action="contextual-help"
        >
          <HelpCircle className="h-5 w-5" />
        </button>
      )}
      
      {/* Bouton guide principal */}
      <button
        onClick={onGuideClick}
        aria-label="Guide complet"
        className="bg-blue-600 text-white p-4 rounded-full shadow-xl hover:bg-blue-700 transition-all hover:scale-110 transform min-w-[56px] min-h-[56px] flex items-center justify-center"
        title="Guide complet"
        data-action="main-guide"
      >
        <BookOpen className="h-6 w-6" />
      </button>
    </div>
  );
};