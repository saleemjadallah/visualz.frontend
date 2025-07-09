// app/components/cultural/ThemeSelector.tsx
'use client';

import React from 'react';
import { useCulturalTheme } from '../../../lib/hooks/useCulturalTheme';
import { CultureType } from '../../../lib/types';

const ThemeSelector = () => {
  const { 
    currentTheme, 
    setTheme, 
    getThemeInfo, 
    isTransitioning,
    themeHistory 
  } = useCulturalTheme();
  
  const themes = [
    { 
      id: 'japanese' as CultureType, 
      name: 'Temple Garden', 
      flag: '🇯🇵',
      description: 'Zen gardens & aged cedar'
    },
    { 
      id: 'scandinavian' as CultureType, 
      name: 'Cozy Cabin', 
      flag: '🇸🇪',
      description: 'Cozy wool & lingonberry'
    },
    { 
      id: 'italian' as CultureType, 
      name: 'Tuscan Vineyard', 
      flag: '🇮🇹',
      description: 'Terracotta & autumn vines'
    },
    { 
      id: 'french' as CultureType, 
      name: 'Provence Château', 
      flag: '🇫🇷',
      description: 'Lavender & vintage brass'
    }
  ];
  
  const switchTheme = (themeId: CultureType) => {
    setTheme(themeId);
  };
  
  return (
    <div className="fixed top-1/2 right-6 transform -translate-y-1/2 z-40 space-y-3">
      {themes.map((theme) => (
        <button
          key={theme.id}
          onClick={() => switchTheme(theme.id)}
          disabled={isTransitioning}
          className={`
            group relative w-14 h-14 rounded-full transition-all duration-300 
            ${currentTheme === theme.id ? 'scale-110' : 'hover:scale-105'}
            ${isTransitioning ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          style={{
            background: currentTheme === theme.id ? 'var(--cultural-accent)' : 'var(--cultural-soft)',
            border: '2px solid var(--cultural-secondary)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
          title={`${theme.name}: ${theme.description}`}
        >
          <span className="text-xl">{theme.flag}</span>
          
          {/* Transition indicator */}
          {isTransitioning && currentTheme === theme.id && (
            <div className="absolute inset-0 rounded-full border-2 border-white animate-spin border-t-transparent"></div>
          )}
          
          {/* Tooltip */}
          <div className="absolute right-16 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="bg-white px-3 py-2 rounded-lg shadow-lg border text-sm font-medium whitespace-nowrap">
              {theme.name}
              <div className="text-xs opacity-75">{theme.description}</div>
              {themeHistory.includes(theme.id) && (
                <div className="text-xs text-blue-500 mt-1">Previously used</div>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default ThemeSelector;