# Guide des Patterns d'Interaction - SOGARA Access

## 🎯 Micro-interactions

### Boutons

#### Feedback Tactile
```css
.btn:active {
  transform: scale(0.95);
  transition: transform 0.1s ease-out;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

#### États de Chargement
```jsx
<AppleButton loading={isSubmitting}>
  {isSubmitting ? 'Traitement...' : 'Valider'}
</AppleButton>
```

### Inputs

#### Animation du Label Flottant
```css
.floating-label {
  transition: all 0.2s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.input:focus + .floating-label,
.input:not(:placeholder-shown) + .floating-label {
  transform: translateY(-20px) scale(0.8);
  color: var(--color-blue);
}
```

#### Validation en Temps Réel
```jsx
const [email, setEmail] = useState('');
const [isValid, setIsValid] = useState(null);

const validateEmail = (value) => {
  const isValidEmail = /\S+@\S+\.\S+/.test(value);
  setIsValid(isValidEmail);
  return isValidEmail;
};

<AppleInput
  type="email"
  value={email}
  onChange={(e) => {
    setEmail(e.target.value);
    validateEmail(e.target.value);
  }}
  error={isValid === false ? 'Email invalide' : undefined}
  success={isValid === true ? 'Email valide' : undefined}
/>
```

## 🔄 Transitions d'État

### Modals

#### Apparition Progressive
```css
.modal-backdrop {
  animation: fadeIn 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.modal-content {
  animation: slideInUp 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
}

@keyframes slideInUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
```

### Navigation

#### Transitions Entre Pages
```jsx
const PageTransition = ({ children, isVisible }) => (
  <div 
    className={`page-transition ${isVisible ? 'visible' : 'hidden'}`}
    style={{
      transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
      opacity: isVisible ? 1 : 0,
      transition: 'all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)'
    }}
  >
    {children}
  </div>
);
```

## 👆 Gestures et Touch

### Swipe Navigation
```jsx
const useSwipeNavigation = (onSwipeLeft, onSwipeRight) => {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) onSwipeLeft();
    if (isRightSwipe) onSwipeRight();
  };

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd
  };
};
```

### Pull to Refresh
```jsx
const PullToRefresh = ({ onRefresh, children }) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handlePullStart = (e) => {
    if (window.scrollY === 0) {
      const touch = e.touches[0];
      setPullStartY(touch.clientY);
    }
  };

  const handlePullMove = (e) => {
    if (pullStartY && window.scrollY === 0) {
      const touch = e.touches[0];
      const distance = Math.max(0, (touch.clientY - pullStartY) * 0.5);
      setPullDistance(Math.min(distance, 80));
    }
  };

  const handlePullEnd = async () => {
    if (pullDistance > 60) {
      setIsRefreshing(true);
      await onRefresh();
      setIsRefreshing(false);
    }
    setPullDistance(0);
  };

  return (
    <div
      onTouchStart={handlePullStart}
      onTouchMove={handlePullMove}
      onTouchEnd={handlePullEnd}
      style={{ transform: `translateY(${pullDistance}px)` }}
    >
      {pullDistance > 60 && (
        <div className="pull-refresh-indicator">
          {isRefreshing ? <Spinner /> : '↓ Relâcher pour actualiser'}
        </div>
      )}
      {children}
    </div>
  );
};
```

## 🔔 Notifications et Feedback

### Toast Notifications
```jsx
const Toast = ({ message, type, onClose }) => (
  <div className={`toast toast-${type}`}>
    <div className="toast-content">
      <Icon className="toast-icon" />
      <span>{message}</span>
    </div>
    <button onClick={onClose} className="toast-close">
      <X className="h-4 w-4" />
    </button>
  </div>
);

// Usage avec contexte
const { addToast } = useToast();

const handleSuccess = () => {
  addToast({
    message: 'Données sauvegardées avec succès',
    type: 'success',
    duration: 3000
  });
};
```

### Feedback Haptique (Web)
```jsx
const useHapticFeedback = () => {
  const vibrate = (pattern = [100]) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };

  return {
    light: () => vibrate([50]),
    medium: () => vibrate([100]),
    heavy: () => vibrate([200]),
    success: () => vibrate([50, 50, 100]),
    error: () => vibrate([100, 50, 100, 50, 100])
  };
};
```

## 🎨 Loading States

### Skeleton Loading
```jsx
const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton skeleton-avatar" />
    <div className="skeleton-content">
      <div className="skeleton skeleton-text" style={{ width: '80%' }} />
      <div className="skeleton skeleton-text" style={{ width: '60%' }} />
      <div className="skeleton skeleton-text" style={{ width: '40%' }} />
    </div>
  </div>
);

const UserList = ({ loading, users }) => (
  <div>
    {loading ? (
      Array(5).fill(0).map((_, i) => <SkeletonCard key={i} />)
    ) : (
      users.map(user => <UserCard key={user.id} user={user} />)
    )}
  </div>
);
```

### Progressive Loading
```jsx
const useProgressiveImage = (src, placeholder) => {
  const [imgSrc, setImgSrc] = useState(placeholder);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImgSrc(src);
      setLoading(false);
    };
    img.src = src;
  }, [src]);

  return { src: imgSrc, loading };
};
```

## 🎯 Onboarding et Guides

### Tour Interactif
```jsx
const InteractiveTour = ({ steps, isActive, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetPosition, setTargetPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isActive && steps[currentStep]) {
      const target = document.querySelector(steps[currentStep].target);
      if (target) {
        const rect = target.getBoundingClientRect();
        setTargetPosition({
          top: rect.top + rect.height + 10,
          left: rect.left + rect.width / 2
        });
        
        // Highlight element
        target.style.outline = '2px solid #007AFF';
        target.style.outlineOffset = '4px';
      }
    }
  }, [currentStep, isActive]);

  return isActive ? (
    <div className="tour-overlay">
      <div 
        className="tour-tooltip"
        style={{
          top: targetPosition.top,
          left: targetPosition.left,
          transform: 'translateX(-50%)'
        }}
      >
        <h3>{steps[currentStep].title}</h3>
        <p>{steps[currentStep].content}</p>
        <div className="tour-actions">
          <button onClick={() => setCurrentStep(currentStep + 1)}>
            Suivant
          </button>
        </div>
      </div>
    </div>
  ) : null;
};
```

### Progressive Disclosure
```jsx
const ExpandableSection = ({ title, children, defaultExpanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="expandable-section">
      <button
        className="expandable-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span>{title}</span>
        <ChevronDown 
          className={`chevron ${isExpanded ? 'rotated' : ''}`} 
        />
      </button>
      
      <div 
        className={`expandable-content ${isExpanded ? 'expanded' : 'collapsed'}`}
        style={{
          maxHeight: isExpanded ? '1000px' : '0',
          opacity: isExpanded ? 1 : 0,
          transition: 'all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)'
        }}
      >
        {children}
      </div>
    </div>
  );
};
```

## 📱 Mobile-Specific Patterns

### Bottom Sheet
```jsx
const BottomSheet = ({ isOpen, onClose, children }) => {
  const [dragY, setDragY] = useState(0);

  const handleDragEnd = () => {
    if (dragY > 100) {
      onClose();
    }
    setDragY(0);
  };

  return (
    <div className={`bottom-sheet ${isOpen ? 'open' : 'closed'}`}>
      <div 
        className="bottom-sheet-content"
        style={{ transform: `translateY(${dragY}px)` }}
        onDragEnd={handleDragEnd}
      >
        <div className="bottom-sheet-handle" />
        {children}
      </div>
    </div>
  );
};
```

### Tab Bar Navigation
```jsx
const TabBar = ({ tabs, activeTab, onTabChange }) => (
  <div className="tab-bar">
    {tabs.map(tab => (
      <button
        key={tab.id}
        className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
        onClick={() => onTabChange(tab.id)}
      >
        <tab.icon className="tab-icon" />
        <span className="tab-label">{tab.label}</span>
      </button>
    ))}
  </div>
);
```

## 🔍 Search Patterns

### Live Search
```jsx
const useSearch = (searchFn, delay = 300) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    const timeoutId = setTimeout(async () => {
      try {
        const searchResults = await searchFn(query);
        setResults(searchResults);
      } finally {
        setLoading(false);
      }
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [query, searchFn, delay]);

  return { query, setQuery, results, loading };
};
```

### Search with Filters
```jsx
const SearchWithFilters = ({ onSearch, filters }) => {
  const [query, setQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);

  const handleSearch = () => {
    onSearch({ query, filters: activeFilters });
  };

  return (
    <div className="search-container">
      <SearchBar
        value={query}
        onChange={setQuery}
        onSubmit={handleSearch}
      />
      
      <div className="filter-chips">
        {filters.map(filter => (
          <FilterChip
            key={filter.id}
            label={filter.label}
            active={activeFilters.includes(filter.id)}
            onClick={() => {
              setActiveFilters(prev => 
                prev.includes(filter.id)
                  ? prev.filter(id => id !== filter.id)
                  : [...prev, filter.id]
              );
            }}
          />
        ))}
      </div>
    </div>
  );
};
```

---

*Ces patterns d'interaction garantissent une expérience utilisateur fluide et intuitive, conforme aux attentes des utilisateurs modernes.*