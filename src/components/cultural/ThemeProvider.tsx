'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CultureType, CulturalTheme } from '@/lib/types';
import { CULTURAL_THEMES } from '@/lib/constants';

// Theme Context Interface
interface ThemeContextType {
  currentTheme: CulturalTheme;
  currentCulture: CultureType;
  setTheme: (culture: CultureType) => void;
  themes: typeof CULTURAL_THEMES;
  isTransitioning: boolean;
}

// Create Context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Hook to use theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Theme Provider Props
interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: CultureType;
  enableTransitions?: boolean;
}

// Cultural Theme Provider Component
export const CulturalThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'japanese',
  enableTransitions = true
}) => {
  const [currentCulture, setCurrentCulture] = useState<CultureType>(defaultTheme);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Get current theme object
  const currentTheme = CULTURAL_THEMES[currentCulture];

  // Load theme from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('designvisualz-cultural-theme') as CultureType;
      if (savedTheme && CULTURAL_THEMES[savedTheme]) {
        setCurrentCulture(savedTheme);
      }
    }
  }, []);

  // Update CSS variables when theme changes
  useEffect(() => {
    updateCSSVariables(currentTheme);
  }, [currentTheme]);

  // Set theme function with transitions
  const setTheme = (culture: CultureType) => {
    if (culture === currentCulture) return;

    if (enableTransitions) {
      setIsTransitioning(true);
      
      // Add transition class to body
      document.body.classList.add('theme-transitioning');
      
      setTimeout(() => {
        setCurrentCulture(culture);
        
        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('designvisualz-cultural-theme', culture);
        }
        
        // Remove transition class after animation
        setTimeout(() => {
          setIsTransitioning(false);
          document.body.classList.remove('theme-transitioning');
        }, 300);
      }, 150);
    } else {
      setCurrentCulture(culture);
      if (typeof window !== 'undefined') {
        localStorage.setItem('designvisualz-cultural-theme', culture);
      }
    }
  };

  const contextValue: ThemeContextType = {
    currentTheme,
    currentCulture,
    setTheme,
    themes: CULTURAL_THEMES,
    isTransitioning
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Function to update CSS variables
const updateCSSVariables = (theme: CulturalTheme) => {
  if (typeof window === 'undefined') return;

  const root = document.documentElement;
  const { colorPalette } = theme;

  // Update cultural color variables
  root.style.setProperty('--cultural-primary', colorPalette.primary);
  root.style.setProperty('--cultural-secondary', colorPalette.secondary);
  root.style.setProperty('--cultural-accent', colorPalette.accent);
  
  // Update neutral colors
  colorPalette.neutral.forEach((color, index) => {
    root.style.setProperty(`--cultural-neutral-${index + 1}`, color);
  });

  // Add cultural theme class to body for CSS targeting
  document.body.className = document.body.className
    .replace(/culture-\w+/g, '')
    .trim() + ` culture-${theme.culture}`;
};

// Theme Selector Component
interface ThemeSelectorProps {
  className?: string;
  showLabels?: boolean;
  variant?: 'pills' | 'dropdown' | 'grid';
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  className = '',
  showLabels = true,
  variant = 'pills'
}) => {
  const { currentCulture, setTheme, themes, isTransitioning } = useTheme();

  if (variant === 'dropdown') {
    return (
      <select
        value={currentCulture}
        onChange={(e) => setTheme(e.target.value as CultureType)}
        disabled={isTransitioning}
        className={`
          px-4 py-2 rounded-xl border border-primary-200 bg-white
          focus:outline-none focus:ring-2 focus:ring-cultural-primary
          disabled:opacity-50 transition-all duration-200
          ${className}
        `}
      >
        {Object.entries(themes).map(([key, theme]) => (
          <option key={key} value={key}>
            {theme.name}
          </option>
        ))}
      </select>
    );
  }

  if (variant === 'grid') {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-3 gap-4 ${className}`}>
        {Object.entries(themes).map(([key, theme]) => (
          <button
            key={key}
            onClick={() => setTheme(key as CultureType)}
            disabled={isTransitioning}
            className={`
              p-4 rounded-xl border-2 transition-all duration-300 text-left
              ${currentCulture === key
                ? 'border-cultural-primary bg-cultural-primary/5'
                : 'border-primary-200 hover:border-cultural-primary/50 hover:bg-primary-50'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            <div
              className="w-full h-8 rounded-lg mb-3"
              style={{
                background: `linear-gradient(135deg, ${theme.colorPalette.primary}, ${theme.colorPalette.secondary})`
              }}
            />
            <h3 className="font-semibold text-primary-900 mb-1">{theme.name}</h3>
            <p className="text-sm text-primary-600">{theme.principles[0]?.name}</p>
          </button>
        ))}
      </div>
    );
  }

  // Default pills variant
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {Object.entries(themes).map(([key, theme]) => (
        <button
          key={key}
          onClick={() => setTheme(key as CultureType)}
          disabled={isTransitioning}
          className={`
            px-4 py-2 rounded-full border transition-all duration-300
            ${currentCulture === key
              ? 'bg-cultural-primary text-white border-cultural-primary'
              : 'bg-white text-primary-700 border-primary-200 hover:border-cultural-primary hover:bg-cultural-primary/5'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
            ${showLabels ? '' : 'w-12 h-12 p-0'}
          `}
        >
          {showLabels ? theme.name : theme.culture.charAt(0).toUpperCase()}
        </button>
      ))}
    </div>
  );
};

// Cultural Theme Display Component
export const ThemeDisplay: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { currentTheme } = useTheme();

  return (
    <div className={`p-6 rounded-xl bg-cultural-primary/5 border border-cultural-primary/20 ${className}`}>
      <div className="flex items-start gap-4">
        <div
          className="w-16 h-16 rounded-xl flex-shrink-0"
          style={{
            background: `linear-gradient(135deg, ${currentTheme.colorPalette.primary}, ${currentTheme.colorPalette.secondary})`
          }}
        />
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-primary-900 mb-2">
            {currentTheme.name}
          </h3>
          <div className="space-y-2">
            {currentTheme.principles.slice(0, 2).map((principle, index) => (
              <div key={index} className="text-sm">
                <span className="font-medium text-cultural-primary">{principle.name}:</span>
                <span className="text-primary-600 ml-2">{principle.description}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CulturalThemeProvider;