# SOGARA Access - Guide du Système de Design Apple-Inspired

## Vue d'ensemble

Ce guide présente le système de design complet de SOGARA Access, inspiré des principes de design d'Apple et des Human Interface Guidelines. Il fournit une approche cohérente pour créer des interfaces utilisateur exceptionnelles.

## 🎨 Philosophie de Design

### Principes Fondamentaux

1. **Clarté** - L'interface doit être immédiatement compréhensible
2. **Déférence** - Le design sert le contenu, pas l'inverse
3. **Profondeur** - Les couches visuelles créent une hiérarchie claire

### Objectifs UX

- **Efficacité** : Minimiser les clics et interactions
- **Accessibilité** : Conforme WCAG 2.1 AA
- **Performance** : Animations fluides et chargements rapides
- **Cohérence** : Expérience unifiée sur tous les écrans

## 🎨 Palette de Couleurs

### Couleurs Système (iOS-inspired)

```css
/* Couleurs Primaires */
--color-blue: #007AFF     /* Bleu système iOS */
--color-green: #30D158    /* Vert système iOS */
--color-orange: #FF9500   /* Orange système iOS */
--color-red: #FF3B30      /* Rouge système iOS */

/* Nuances de Gris */
--color-gray-50: #F9F9F9   /* Background tertiaire */
--color-gray-100: #F2F2F7  /* Background secondaire */
--color-gray-200: #E5E5EA  /* Séparateurs */
--color-gray-600: #8E8E93  /* Labels secondaires */
--color-gray-900: #1C1C1E  /* Labels primaires */
```

### Usage des Couleurs

- **Bleu (#007AFF)** : Actions primaires, liens, état actif
- **Vert (#30D158)** : Succès, validation, états positifs
- **Orange (#FF9500)** : Avertissements, notifications
- **Rouge (#FF3B30)** : Erreurs, actions destructives
- **Gris** : Texte, backgrounds, éléments neutres

## 📝 Typographie

### Hiérarchie Typographique

```css
.text-large-title {
  font-size: 36px;
  font-weight: 800;
  line-height: 1.25;
  letter-spacing: -0.5px;
}

.text-title-1 {
  font-size: 32px;
  font-weight: 700;
  line-height: 1.25;
}

.text-title-2 {
  font-size: 28px;
  font-weight: 600;
  line-height: 1.3;
}

.text-headline {
  font-size: 20px;
  font-weight: 600;
  line-height: 1.4;
}

.text-body {
  font-size: 16px;
  font-weight: 400;
  line-height: 1.6;
}

.text-callout {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
}

.text-footnote {
  font-size: 12px;
  font-weight: 400;
  line-height: 1.3;
}
```

### Usage Typographique

- **Large Title** : Titres de pages principales
- **Title 1-2** : Sections importantes, headers
- **Headline** : Sous-titres, noms de cartes
- **Body** : Contenu principal, descriptions
- **Callout** : Labels, métadonnées
- **Footnote** : Informations secondaires

## 📐 Espacement

### Système de Grille 8px

```css
--space-1: 4px    /* Espacement minimal */
--space-2: 8px    /* Espacement de base */
--space-3: 12px   /* Espacement petit */
--space-4: 16px   /* Espacement standard */
--space-6: 24px   /* Espacement moyen */
--space-8: 32px   /* Espacement large */
--space-12: 48px  /* Espacement très large */
```

### Applications

- **Padding intérieur** : Utiliser space-4 (16px) par défaut
- **Marges entre éléments** : space-3 (12px) à space-6 (24px)
- **Sections importantes** : space-8 (32px) ou plus

## 🔘 Composants

### Boutons

#### Variantes

```jsx
// Bouton Primaire
<AppleButton variant="primary" size="lg">
  Action Principale
</AppleButton>

// Bouton Secondaire
<AppleButton variant="secondary" icon={Settings}>
  Action Secondaire
</AppleButton>

// Bouton Fantôme
<AppleButton variant="ghost" size="sm">
  Action Tertiaire
</AppleButton>
```

#### États

- **Normal** : Couleur de base
- **Hover** : Légère transformation (-2px) + ombre
- **Active** : Transformation réduite + ombre minimale
- **Disabled** : Opacité 30%

### Cartes

#### Types de Cartes

```jsx
// Carte Standard
<AppleCard variant="default" padding="lg">
  Contenu de la carte
</AppleCard>

// Carte Élevée
<AppleCard variant="elevated" hoverable>
  Contenu avec shadow prononcée
</AppleCard>

// Effet Verre
<AppleCard variant="glass">
  Contenu avec backdrop-blur
</AppleCard>
```

### Inputs

#### Variantes d'Input

```jsx
// Input Standard
<AppleInput 
  label="Email"
  type="email"
  placeholder="nom@exemple.com"
/>

// Input Flottant
<AppleInput 
  label="Nom complet"
  variant="floating"
  icon={User}
/>

// Barre de Recherche
<SearchBar 
  value={searchTerm}
  onChange={setSearchTerm}
  placeholder="Rechercher..."
/>
```

## 🎬 Animations

### Timing et Courbes

```css
/* Durées Standards */
--duration-fast: 0.15s     /* Micro-interactions */
--duration-normal: 0.25s   /* Transitions standards */
--duration-slow: 0.35s     /* Animations complexes */

/* Courbes d'Animation */
--ease-apple: cubic-bezier(0.25, 0.1, 0.25, 1)  /* Courbe Apple */
--ease-in-out: cubic-bezier(0.4, 0.0, 0.2, 1)   /* Material Design */
```

### Animations Clés

```css
/* Apparition Fluide */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mise à l'échelle */
.hover-scale:hover {
  transform: translateY(-2px) scale(1.02);
  transition: transform var(--duration-normal) var(--ease-apple);
}
```

## 📱 Responsive Design

### Breakpoints

```css
/* Mobile First Approach */
@media (min-width: 576px) { /* Large mobile */ }
@media (min-width: 768px) { /* Tablet */ }
@media (min-width: 992px) { /* Desktop */ }
@media (min-width: 1200px) { /* Large desktop */ }
```

### Adaptations Mobiles

- **Touch Targets** : Minimum 44px × 44px
- **Espacement** : Augmenter padding sur mobile
- **Typographie** : Tailles réduites sur petit écran
- **Navigation** : Menu hamburger en dessous de 768px

## ♿ Accessibilité

### Contraste

- **Ratio minimum** : 4.5:1 pour le texte normal
- **Ratio large text** : 3:1 pour texte ≥ 18px
- **Focus visible** : Contour 2px solide bleu

### Navigation Clavier

```css
.focus-ring:focus {
  outline: 2px solid var(--color-blue);
  outline-offset: 2px;
}
```

### Support Screen Reader

```jsx
// ARIA Labels appropriés
<button aria-label="Fermer la modal">
  <X className="h-4 w-4" />
</button>

// Texte visually hidden
<span className="sr-only">
  Information pour lecteur d'écran
</span>
```

## 🌙 Mode Sombre

### Variables Dynamiques

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-background: #000000;
    --color-secondary-background: #1C1C1E;
    --color-label: #FFFFFF;
    --color-secondary-label: #EBEBF5;
  }
}
```

## 📊 Métriques de Performance

### Objectifs

- **First Contentful Paint** : < 1.5s
- **Largest Contentful Paint** : < 2.5s
- **Cumulative Layout Shift** : < 0.1
- **Time to Interactive** : < 3.0s

### Optimisations

1. **Images** : WebP avec fallback
2. **Animations** : CSS transforms uniquement
3. **Lazy Loading** : Composants non critiques
4. **Code Splitting** : Routes dynamiques

## 🧪 Testing

### Tests Visuels

- **Cross-browser** : Chrome, Firefox, Safari, Edge
- **Devices** : iPhone, iPad, Android, Desktop
- **Accessibility** : WAVE, axe-core

### Tests Utilisateur

- **A/B Testing** : Variantes de composants
- **Usability Testing** : Sessions d'observation
- **Performance Monitoring** : Core Web Vitals

## 📚 Ressources

### Outils Recommandés

- **Design** : Figma avec Apple Design Resources
- **Icons** : Lucide React (cohérent avec Apple style)
- **Animations** : Framer Motion pour animations complexes
- **Testing** : React Testing Library + jest-axe

### Références

- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [iOS Design Guidelines](https://developer.apple.com/design/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

*Ce guide évolue avec le produit. Toute question ou suggestion d'amélioration est bienvenue.*