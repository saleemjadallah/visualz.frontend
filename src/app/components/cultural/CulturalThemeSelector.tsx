'use client';

import React, { useState } from 'react';

const CulturalThemeSelector = () => {
  const [currentTheme, setCurrentTheme] = useState('japanese');
  
  const themes = [
    { 
      id: 'japanese', 
      name: 'Wabi-Sabi', 
      flag: '🇯🇵',
      description: 'Beauty in imperfection',
      fullName: 'Japanese'
    },
    { 
      id: 'scandinavian', 
      name: 'Hygge', 
      flag: '🇸🇪',
      description: 'Cozy contentment',
      fullName: 'Swedish'
    },
    { 
      id: 'italian', 
      name: 'Bella Figura', 
      flag: '🇮🇹',
      description: 'Beautiful appearance',
      fullName: 'Italian'
    },
    { 
      id: 'french', 
      name: 'Savoir-Vivre', 
      flag: '🇫🇷',
      description: 'Art of living',
      fullName: 'French'
    }
  ];
  
  const switchTheme = (themeId: string) => {
    setCurrentTheme(themeId);
    document.documentElement.className = `theme-${themeId}`;
    
    // Update background patterns
    const sections = document.querySelectorAll('.section-cultural, .section-cultural-alt');
    sections.forEach(section => {
      section.className = section.className.replace(/pattern-\w+/, `pattern-${themeId}`);
    });
  };
  
  return (
    <section className="section-cultural-alt pattern-japanese relative overflow-hidden">
      <div className="container-cultural">
        <div className="text-center mb-16">
          <h2 className="section-title">Celebrating Cultural Traditions</h2>
          <p className="section-subtitle">
            Choose your cultural inspiration and watch the entire experience transform
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {themes.map((theme) => (
            <div
              key={theme.id}
              onClick={() => switchTheme(theme.id)}
              className={`theme-selector-item group ${currentTheme === theme.id ? 'active' : ''}`}
            >
              <div className={`theme-circle ${theme.id} group-hover:scale-110 transition-transform duration-300`}>
                <span>{theme.flag}</span>
              </div>
              
              <div className="text-center space-y-1">
                <h3 className="font-semibold text-lg" style={{ color: 'var(--cultural-text)' }}>
                  {theme.name}
                </h3>
                <p className="text-sm" style={{ color: 'var(--cultural-text-light)' }}>
                  {theme.description}
                </p>
              </div>
              
              {currentTheme === theme.id && (
                <div className="absolute top-4 right-4 w-3 h-3 bg-green-500 rounded-full animate-gentle-pulse"></div>
              )}
            </div>
          ))}
        </div>
        
        {/* Current Theme Display */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/50 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
            <span className="text-sm font-medium" style={{ color: 'var(--cultural-text)' }}>
              Current Theme: {themes.find(t => t.id === currentTheme)?.fullName}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CulturalThemeSelector;