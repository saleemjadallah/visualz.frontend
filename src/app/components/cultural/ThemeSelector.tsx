// app/components/cultural/ThemeSelector.tsx
'use client';

import React, { useState } from 'react';

const ThemeSelector = () => {
  const [currentTheme, setCurrentTheme] = useState('japanese');
  
  const themes = [
    { 
      id: 'japanese', 
      name: 'Temple Garden', 
      flag: '🇯🇵',
      description: 'Soft bamboo & aged wood'
    },
    { 
      id: 'scandinavian', 
      name: 'Cozy Cabin', 
      flag: '🇸🇪',
      description: 'Warm wool & gentle sage'
    },
    { 
      id: 'italian', 
      name: 'Countryside', 
      flag: '🇮🇹',
      description: 'Soft terracotta & honey'
    },
    { 
      id: 'french', 
      name: 'Provence', 
      flag: '🇫🇷',
      description: 'Gentle lavender & cream'
    }
  ];
  
  const switchTheme = (themeId: string) => {
    setCurrentTheme(themeId);
    document.documentElement.className = `theme-${themeId}`;
  };
  
  return (
    <div className="fixed top-1/2 right-6 transform -translate-y-1/2 z-40 space-y-3">
      {themes.map((theme) => (
        <button
          key={theme.id}
          onClick={() => switchTheme(theme.id)}
          className={`
            group relative w-14 h-14 rounded-full transition-all duration-300 
            ${currentTheme === theme.id ? 'scale-110' : 'hover:scale-105'}
          `}
          style={{
            background: currentTheme === theme.id ? 'var(--cultural-accent)' : 'var(--cultural-soft)',
            border: '2px solid var(--cultural-secondary)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
          title={`${theme.name}: ${theme.description}`}
        >
          <span className="text-xl">{theme.flag}</span>
          
          {/* Tooltip */}
          <div className="absolute right-16 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="bg-white px-3 py-2 rounded-lg shadow-lg border text-sm font-medium whitespace-nowrap">
              {theme.name}
              <div className="text-xs opacity-75">{theme.description}</div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default ThemeSelector;