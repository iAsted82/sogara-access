import { useState, useEffect } from 'react';

interface GuideStep {
  id: string;
  title: string;
  content: string;
  target?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  highlight?: boolean;
  action?: () => void;
}

interface UseInteractiveGuideProps {
  guideId: string;
  steps: GuideStep[];
  autoStart?: boolean;
  showOnFirstVisit?: boolean;
  delayBeforeStart?: number;
}

export const useInteractiveGuide = ({
  guideId,
  steps,
  autoStart = false,
  showOnFirstVisit = true,
  delayBeforeStart = 1000
}: UseInteractiveGuideProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenCompleted, setHasBeenCompleted] = useState(false);
  const [hasBeenSkipped, setHasBeenSkipped] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Vérification de l'état du guide et gestion de l'auto-start
  useEffect(() => {
    const checkGuideState = () => {
      const completed = localStorage.getItem(`guide_completed_${guideId}`) === 'true';
      const skipped = localStorage.getItem(`guide_skipped_${guideId}`) === 'true';
      const firstVisit = localStorage.getItem(`first_visit_${guideId}`) !== 'false';

      setHasBeenCompleted(completed);
      setHasBeenSkipped(skipped);
      setIsReady(true);

      // Auto-start avec délai si conditions remplies
      if (autoStart && showOnFirstVisit && firstVisit && !completed && !skipped) {
        const timer = setTimeout(() => {
          setIsVisible(true);
          localStorage.setItem(`first_visit_${guideId}`, 'false');
        }, delayBeforeStart);

        return () => clearTimeout(timer);
      }
    };

    // Attendre que le DOM soit prêt
    if (document.readyState === 'complete') {
      checkGuideState();
    } else {
      window.addEventListener('load', checkGuideState);
      return () => window.removeEventListener('load', checkGuideState);
    }
  }, [guideId, autoStart, showOnFirstVisit, delayBeforeStart]);

  const startGuide = () => {
    if (steps.length > 0) {
      setIsVisible(true);
      // Marquer comme vu
      localStorage.setItem(`first_visit_${guideId}`, 'false');
    }
  };

  const closeGuide = () => {
    setIsVisible(false);
  };

  const completeGuide = () => {
    setHasBeenCompleted(true);
    localStorage.setItem(`guide_completed_${guideId}`, 'true');
    localStorage.setItem(`guide_completion_date_${guideId}`, new Date().toISOString());
    setIsVisible(false);
  };

  const skipGuide = () => {
    setHasBeenSkipped(true);
    localStorage.setItem(`guide_skipped_${guideId}`, 'true');
    localStorage.setItem(`guide_skip_date_${guideId}`, new Date().toISOString());
    setIsVisible(false);
  };

  const resetGuide = () => {
    localStorage.removeItem(`guide_completed_${guideId}`);
    localStorage.removeItem(`guide_skipped_${guideId}`);
    localStorage.removeItem(`first_visit_${guideId}`);
    localStorage.removeItem(`guide_completion_date_${guideId}`);
    localStorage.removeItem(`guide_skip_date_${guideId}`);
    setHasBeenCompleted(false);
    setHasBeenSkipped(false);
  };

  const shouldShowGuideButton = () => {
    return isReady && !hasBeenCompleted && !isVisible;
  };

  const getGuideStatus = () => {
    if (!isReady) return 'loading';
    if (hasBeenCompleted) return 'completed';
    if (hasBeenSkipped) return 'skipped';
    if (isVisible) return 'active';
    return 'available';
  };

  const getCompletionDate = () => {
    const date = localStorage.getItem(`guide_completion_date_${guideId}`);
    return date ? new Date(date) : null;
  };

  return {
    isVisible,
    hasBeenCompleted,
    hasBeenSkipped,
    isReady,
    startGuide,
    closeGuide,
    completeGuide,
    skipGuide,
    resetGuide,
    shouldShowGuideButton,
    getGuideStatus,
    getCompletionDate
  };
};