'use client';

import { useEffect, useCallback } from 'react';
import { useCulturalThemeStore } from '../store';
import { CultureType } from '../types';

interface CulturalThemeConfig {
  autoSaveHistory?: boolean;
  maxHistoryLength?: number;
  transitionDuration?: number;
}

export const useCulturalTheme = (config: CulturalThemeConfig = {}) => {
  const {
    autoSaveHistory = true,
    maxHistoryLength = 5,
    transitionDuration = 300
  } = config;

  const {
    currentTheme,
    isTransitioning,
    themeHistory,
    setTheme,
    toggleTheme,
    resetTheme
  } = useCulturalThemeStore();

  // Apply theme to document on mount and when theme changes
  useEffect(() => {
    document.documentElement.className = `theme-${currentTheme}`;
    
    // Apply smooth transitions
    document.documentElement.style.setProperty('--theme-transition-duration', `${transitionDuration}ms`);
    
    // Add cultural theme data attributes for CSS targeting
    document.documentElement.setAttribute('data-cultural-theme', currentTheme);
    
    // Dispatch custom event for theme changes
    window.dispatchEvent(new CustomEvent('culturalThemeChange', { 
      detail: { theme: currentTheme, isTransitioning } 
    }));
  }, [currentTheme, isTransitioning, transitionDuration]);

  const switchTheme = useCallback((theme: CultureType) => {
    if (theme !== currentTheme) {
      setTheme(theme);
    }
  }, [currentTheme, setTheme]);

  const getThemeColors = useCallback(() => {
    const styles = getComputedStyle(document.documentElement);
    return {
      primary: styles.getPropertyValue('--cultural-primary').trim(),
      secondary: styles.getPropertyValue('--cultural-secondary').trim(),
      accent: styles.getPropertyValue('--cultural-accent').trim(),
      neutral: styles.getPropertyValue('--cultural-neutral').trim(),
      soft: styles.getPropertyValue('--cultural-soft').trim(),
    };
  }, []);

  const getThemeInfo = useCallback(() => {
    const themeInfo: Record<CultureType, {
      name: string;
      description: string;
      inspiration: string;
      flag: string;
    }> = {
      japanese: {
        name: 'Japanese Temple Garden',
        description: 'Zen gardens & aged cedar',
        inspiration: 'Morning mist over bamboo forests',
        flag: '🇯🇵'
      },
      scandinavian: {
        name: 'Swedish Cabin',
        description: 'Cozy wool & lingonberry',
        inspiration: 'Weathered pine, soft winter light',
        flag: '🇸🇪'
      },
      italian: {
        name: 'Tuscan Vineyard',
        description: 'Terracotta & autumn vines',
        inspiration: 'Sun-baked terracotta, olive groves',
        flag: '🇮🇹'
      },
      french: {
        name: 'Provence Château',
        description: 'Lavender & vintage brass',
        inspiration: 'Lavender fields, aged brass',
        flag: '🇫🇷'
      },
      modern: {
        name: 'Modern Contemporary',
        description: 'Bold & contemporary',
        inspiration: 'Urban loft, industrial chic',
        flag: '🌐'
      },
      american: {
        name: 'American Classic',
        description: 'Comfortable & patriotic',
        inspiration: 'Family gatherings, stars and stripes',
        flag: '🇺🇸'
      },
      mexican: {
        name: 'Mexican Celebration',
        description: 'Vibrant & festive',
        inspiration: 'Colorful markets, papel picado',
        flag: '🇲🇽'
      },
      korean: {
        name: 'Korean Traditional',
        description: 'Harmonious & balanced',
        inspiration: 'Temple gardens, traditional hanbok',
        flag: '🇰🇷'
      },
      jewish: {
        name: 'Jewish Heritage',
        description: 'Traditional & ceremonial',
        inspiration: 'Sacred traditions, community gatherings',
        flag: '🇮🇱'
      }
    };
    return themeInfo[currentTheme] || themeInfo.japanese;
  }, [currentTheme]);

  const cycleTheme = useCallback(() => {
    const themes: CultureType[] = ['japanese', 'scandinavian', 'italian', 'french'];
    const currentIndex = themes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  }, [currentTheme, setTheme]);

  const isPreviousTheme = useCallback((theme: CultureType) => {
    return themeHistory.includes(theme);
  }, [themeHistory]);

  const canUseTheme = useCallback((theme: CultureType) => {
    // Add any business logic for theme availability
    return true;
  }, []);

  return {
    // Current state
    currentTheme,
    isTransitioning,
    themeHistory: themeHistory.slice(-maxHistoryLength),
    
    // Theme actions
    setTheme: switchTheme,
    toggleTheme,
    resetTheme,
    cycleTheme,
    
    // Theme information
    getThemeColors,
    getThemeInfo,
    
    // Utilities
    isPreviousTheme,
    canUseTheme,
    
    // Configuration
    config: {
      autoSaveHistory,
      maxHistoryLength,
      transitionDuration
    }
  };
};

export default useCulturalTheme;