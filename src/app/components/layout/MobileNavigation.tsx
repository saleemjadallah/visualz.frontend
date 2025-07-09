'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X, Palette, Camera, Globe, Home, Share, Download, ChevronRight, User, Settings, Eye, ShoppingBag } from 'lucide-react';
import { useCulturalTheme } from '../../../lib/hooks/useCulturalTheme';

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ isOpen, onClose, onOpen }) => {
  const { currentTheme, setTheme } = useCulturalTheme();
  const [activeSection, setActiveSection] = useState('design');

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navigationItems = [
    { id: 'design', label: 'Design Studio', icon: Palette, description: 'Create your vision' },
    { id: 'gallery', label: 'Gallery', icon: Eye, description: 'Explore designs' },
    { id: 'cultural', label: 'Cultural Guide', icon: Globe, description: 'Learn traditions' },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag, description: 'Find vendors' },
  ];

  const themeOptions = [
    { id: 'japanese', name: 'Japanese', flag: '🇯🇵', description: 'Zen & Harmony' },
    { id: 'scandinavian', name: 'Scandinavian', flag: '🇸🇪', description: 'Cozy & Functional' },
    { id: 'italian', name: 'Italian', flag: '🇮🇹', description: 'Warm & Inviting' },
    { id: 'french', name: 'French', flag: '🇫🇷', description: 'Elegant & Refined' },
  ];

  const handleThemeChange = (theme: string) => {
    setTheme(theme as any);
    onClose();
  };

  const handleNavigationClick = (sectionId: string) => {
    setActiveSection(sectionId);
    onClose();
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={onOpen}
        className="md:hidden fixed top-4 left-4 z-50 p-3 rounded-xl bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg ios-optimized android-optimized"
        style={{
          background: 'var(--cultural-soft)',
          borderColor: 'var(--cultural-secondary)',
        }}
      >
        <Menu className="w-6 h-6" style={{ color: 'var(--cultural-primary)' }} />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Mobile Navigation Drawer */}
      <div className={`
        fixed top-0 left-0 h-full w-80 max-w-[80vw] z-50 transform transition-transform duration-300 ease-in-out md:hidden
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div 
          className="h-full flex flex-col bg-white/95 backdrop-blur-sm border-r shadow-2xl"
          style={{
            background: 'var(--cultural-neutral)',
            borderColor: 'var(--cultural-secondary)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--cultural-secondary)' }}>
            <div className="flex items-center space-x-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'var(--cultural-accent)' }}
              >
                <Palette className="w-5 h-5" style={{ color: 'var(--cultural-primary)' }} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-cultural-heading">DesignVisualz</h2>
                <p className="text-sm opacity-75" style={{ color: 'var(--cultural-text)' }}>Cultural AI Design</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors touch:bg-gray-100 ios-optimized"
            >
              <X className="w-6 h-6" style={{ color: 'var(--cultural-primary)' }} />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigationClick(item.id)}
                  className={`
                    w-full flex items-center space-x-4 p-4 rounded-xl transition-all duration-200 text-left
                    ${activeSection === item.id 
                      ? 'bg-opacity-20 transform scale-[0.98]' 
                      : 'hover:bg-opacity-10 active:bg-opacity-20 active:scale-[0.98]'
                    }
                    ios-optimized android-optimized
                  `}
                  style={{
                    backgroundColor: activeSection === item.id ? 'var(--cultural-accent)' : 'transparent',
                    color: 'var(--cultural-text)',
                  }}
                >
                  <div 
                    className={`
                      w-12 h-12 rounded-xl flex items-center justify-center transition-colors
                      ${activeSection === item.id ? 'bg-white/20' : 'bg-gray-100'}
                    `}
                    style={{
                      background: activeSection === item.id ? 'var(--cultural-primary)' : 'var(--cultural-soft)',
                    }}
                  >
                    <IconComponent className="w-6 h-6" style={{ 
                      color: activeSection === item.id ? 'var(--cultural-neutral)' : 'var(--cultural-primary)' 
                    }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-base">{item.label}</h3>
                    <p className="text-sm opacity-75">{item.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 opacity-50" />
                </button>
              );
            })}
          </nav>

          {/* Theme Selector */}
          <div className="p-4 border-t" style={{ borderColor: 'var(--cultural-secondary)' }}>
            <h3 className="text-sm font-medium mb-3 text-cultural-heading">Cultural Theme</h3>
            <div className="grid grid-cols-2 gap-2">
              {themeOptions.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => handleThemeChange(theme.id)}
                  className={`
                    p-3 rounded-lg border transition-all duration-200 text-left
                    ${currentTheme === theme.id 
                      ? 'border-current bg-opacity-10 scale-[0.98]' 
                      : 'border-gray-200 hover:border-current hover:bg-opacity-5 active:scale-[0.98]'
                    }
                    ios-optimized android-optimized
                  `}
                  style={{
                    borderColor: currentTheme === theme.id ? 'var(--cultural-accent)' : 'var(--cultural-secondary)',
                    backgroundColor: currentTheme === theme.id ? 'var(--cultural-accent)' : 'transparent',
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{theme.flag}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate" style={{ color: 'var(--cultural-text)' }}>
                        {theme.name}
                      </div>
                      <div className="text-xs opacity-75 truncate" style={{ color: 'var(--cultural-text)' }}>
                        {theme.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t" style={{ borderColor: 'var(--cultural-secondary)' }}>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 text-sm text-cultural-text hover:text-cultural-accent transition-colors">
                <User className="w-4 h-4" />
                <span>Profile</span>
              </button>
              <button className="flex items-center space-x-2 text-sm text-cultural-text hover:text-cultural-accent transition-colors">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileNavigation;