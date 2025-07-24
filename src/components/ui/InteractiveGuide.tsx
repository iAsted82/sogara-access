import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X, SkipForward, Target, Lightbulb, CheckCircle, Minimize2 } from 'lucide-react';

interface GuideStep {
  id: string;
  title: string;
  content: string;
  target?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  highlight?: boolean;
  action?: () => void;
}

interface InteractiveGuideProps {
  steps: GuideStep[];
  isVisible: boolean;
  onClose: () => void;
  onComplete: () => void;
  guideId: string;
}

export const InteractiveGuide: React.FC<InteractiveGuideProps> = ({
  steps,
  isVisible,
  onClose,
  onComplete,
  guideId
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  // Position responsive et adaptative
  const calculatePosition = () => {
    const step = steps[currentStep];
    const isMobile = window.innerWidth < 768;
    
    if (!step.target || isMobile) {
      // Position optimisée mobile ou centrée
      setTooltipPosition({
        top: isMobile ? window.innerHeight - 280 : window.innerHeight / 2 - 120,
        left: isMobile ? 16 : window.innerWidth / 2 - 180
      });
      return;
    }

    const targetElement = document.querySelector(step.target);
    if (!targetElement) {
      setTooltipPosition({
        top: window.innerHeight / 2 - 120,
        left: window.innerWidth / 2 - 180
      });
      return;
    }

    const rect = targetElement.getBoundingClientRect();
    const tooltipWidth = isMobile ? window.innerWidth - 32 : 360;
    const tooltipHeight = 240;
    const offset = 16;

    let top = 0;
    let left = 0;

    switch (step.position || 'bottom') {
      case 'top':
        top = rect.top - tooltipHeight - offset;
        left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
        break;
      case 'bottom':
        top = rect.bottom + offset;
        left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
        break;
      case 'left':
        top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
        left = rect.left - tooltipWidth - offset;
        break;
      case 'right':
        top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
        left = rect.right + offset;
        break;
    }

    // Contraintes viewport
    if (left < 16) left = 16;
    if (left + tooltipWidth > window.innerWidth - 16) left = window.innerWidth - tooltipWidth - 16;
    if (top < 16) top = 16;
    if (top + tooltipHeight > window.innerHeight - 16) top = window.innerHeight - tooltipHeight - 16;

    setTooltipPosition({ top, left });
  };

  useEffect(() => {
    if (isVisible && steps[currentStep]) {
      const timer = setTimeout(calculatePosition, 100);
      return () => clearTimeout(timer);
    }
  }, [currentStep, isVisible, isMinimized]);

  useEffect(() => {
    const handleResize = () => calculatePosition();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentStep]);

  // Highlight optimisé
  const highlightTarget = () => {
    const step = steps[currentStep];
    if (!step.target || !step.highlight) return;

    const targetElement = document.querySelector(step.target);
    if (!targetElement || !highlightRef.current) return;

    const rect = targetElement.getBoundingClientRect();
    
    highlightRef.current.style.top = `${rect.top - 6}px`;
    highlightRef.current.style.left = `${rect.left - 6}px`;
    highlightRef.current.style.width = `${rect.width + 12}px`;
    highlightRef.current.style.height = `${rect.height + 12}px`;
    highlightRef.current.style.display = 'block';
  };

  useEffect(() => {
    if (isVisible && !isMinimized) {
      highlightTarget();
    } else if (highlightRef.current) {
      highlightRef.current.style.display = 'none';
    }
  }, [currentStep, isVisible, isMinimized]);

  const nextStep = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
        if (steps[currentStep].action) {
          steps[currentStep].action!();
        }
      } else {
        handleComplete();
      }
      setIsAnimating(false);
    }, 150);
  };

  const prevStep = () => {
    if (isAnimating || currentStep === 0) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(currentStep - 1);
      setIsAnimating(false);
    }, 150);
  };

  const handleComplete = () => {
    localStorage.setItem(`guide_completed_${guideId}`, 'true');
    localStorage.setItem(`guide_completion_date_${guideId}`, new Date().toISOString());
    onComplete();
    onClose();
  };

  const handleSkip = () => {
    localStorage.setItem(`guide_skipped_${guideId}`, 'true');
    localStorage.setItem(`guide_skip_date_${guideId}`, new Date().toISOString());
    onClose();
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  if (!isVisible || !steps[currentStep]) return null;

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;
  const isMobile = window.innerWidth < 768;

  // Mode minimisé pour réduire l'encombrement
  if (isMinimized) {
    return (
      <div
        className="fixed bottom-4 right-4 z-50 bg-white rounded-full shadow-xl border border-gray-200 p-3 cursor-pointer hover:shadow-2xl transition-all min-w-[48px] min-h-[48px] flex items-center justify-center"
        onClick={toggleMinimize}
      >
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-blue-600" />
          <span className="text-sm font-medium text-gray-900 hidden sm:inline">
            Guide ({currentStep + 1}/{steps.length})
          </span>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Overlay discret */}
      <div className="fixed inset-0 bg-black/10 backdrop-blur-[2px] z-40 transition-opacity duration-300" />
      
      {/* Highlight subtil */}
      {step.highlight && (
        <div
          ref={highlightRef}
          className="fixed z-50 border-2 border-blue-400 rounded-xl shadow-lg pointer-events-none transition-all duration-300"
          style={{
            boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.15), 0 0 12px rgba(59, 130, 246, 0.2)',
            background: 'rgba(59, 130, 246, 0.03)'
          }}
        />
      )}

      {/* Tooltip compact et épuré - MOBILE OPTIMISÉ */}
      <div
        ref={tooltipRef}
        className={`fixed z-50 bg-white/95 rounded-xl shadow-2xl border border-gray-200/80 transition-all duration-300 transform backdrop-blur-md ${
          isAnimating ? 'scale-95 opacity-70' : 'scale-100 opacity-100'
        } ${isMobile ? 'w-[calc(100vw-2rem)] max-w-sm' : 'w-80'}`}
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left
        }}
      >
        {/* Header épuré */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100/80">
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 rounded-lg p-1.5">
              <Lightbulb className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">{step.title}</h3>
              <p className="text-xs text-gray-500">
                {currentStep + 1}/{steps.length}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={toggleMinimize}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center"
              title="Réduire"
            >
              <Minimize2 className="h-4 w-4 text-gray-500" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center"
              title="Fermer"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Barre de progression fine */}
        <div className="px-4 pt-2">
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div 
              className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Contenu compact */}
        <div className="p-4">
          <p className="text-gray-700 text-sm leading-relaxed mb-4">
            {step.content}
          </p>

          {/* Navigation simplifiée */}
          <div className="flex items-center justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all min-w-[40px] min-h-[40px] ${
                currentStep === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
              {!isMobile && 'Précédent'}
            </button>

            <div className="flex items-center gap-2">
              {/* Bouton Ignorer/Passer bien visible */}
              <button
                onClick={handleSkip}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium text-sm transition-all hover:scale-105 min-w-[40px] min-h-[40px]"
              >
                {isMobile ? 'Ignorer' : 'Passer le guide'}
              </button>
              
              <button
                onClick={nextStep}
                className="flex items-center gap-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 font-medium text-sm transition-all hover:scale-105 min-w-[40px] min-h-[40px]"
              >
                {currentStep === steps.length - 1 ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    {isMobile ? 'Fini' : 'Terminer'}
                  </>
                ) : (
                  <>
                    {isMobile ? 'Suivant' : 'Continuer'}
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Indicateurs de progression minimalistes */}
        <div className="flex items-center justify-center pb-3">
          <div className="flex gap-1">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  index === currentStep ? 'bg-blue-500 w-3' : 
                  index < currentStep ? 'bg-blue-300' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};