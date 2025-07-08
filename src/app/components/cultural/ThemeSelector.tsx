'use client';

import React, { useState } from 'react';

const ThemeSelector = () => {
  const [currentTheme, setCurrentTheme] = useState('japanese');
  
  const themes = [
    { 
      id: 'japanese', 
      name: 'Japanese Temple', 
      flag: '🇯🇵',
      description: 'Zen gardens & aged cedar'
    },
    { 
      id: 'scandinavian', 
      name: 'Swedish Cabin', 
      flag: '🇸🇪',
      description: 'Cozy wool & lingonberry'
    },
    { 
      id: 'italian', 
      name: 'Tuscan Vineyard', 
      flag: '🇮🇹',
      description: 'Terracotta & autumn vines'
    },
    { 
      id: 'french', 
      name: 'Provence Château', 
      flag: '🇫🇷',
      description: 'Lavender & vintage brass'
    }
  ];
  
  const switchTheme = (themeId: string) => {
    setCurrentTheme(themeId);
    document.documentElement.className = `theme-${themeId}`;
  };
  
  return (
    <div className="theme-selector">
      {themes.map((theme) => (
        <button
          key={theme.id}
          onClick={() => switchTheme(theme.id)}
          className={`theme-button ${theme.id} ${currentTheme === theme.id ? 'scale-110' : ''}`}
          title={`${theme.name}: ${theme.description}`}
        >
          <span className="text-2xl">{theme.flag}</span>
        </button>
      ))}
    </div>
  );
};

export default ThemeSelector;