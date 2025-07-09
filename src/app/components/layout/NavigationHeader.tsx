// app/components/layout/NavigationHeader.tsx
'use client';

import React, { useState } from 'react';
import { Share2, Download, Palette, Eye, Globe, Menu, X, Sparkles } from 'lucide-react';
import MobileNavigation from './MobileNavigation';

const NavigationHeader = () => {
  const [activeTab, setActiveTab] = useState('design');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <>
      <header className="sticky top-0 z-50 header-cultural">
        <div className="container-custom">
          <div className="flex items-center justify-between">
            
            {/* Logo Section */}
            <div className="flex items-center space-x-3 md:space-x-4">
              <div 
                className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg animate-gentle-float"
                style={{ 
                  background: 'var(--cultural-accent)',
                  border: '1px solid var(--cultural-secondary)'
                }}
              >
                <Sparkles className="w-5 h-5 md:w-6 md:h-6" style={{ color: 'var(--cultural-text)' }} />
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-display font-bold text-cultural-heading">
                  DesignVisualz
                </h1>
                <p className="text-xs md:text-sm opacity-75 hidden xs:block" style={{ color: 'var(--cultural-text)' }}>
                  Cultural Intelligence AI
                </p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4">
              {[
                { id: 'design', label: 'Design Studio', icon: Palette },
                { id: 'gallery', label: 'Gallery', icon: Eye },
                { id: 'cultural', label: 'Cultural Guide', icon: Globe },
                { id: 'vendors', label: 'Marketplace', icon: Menu }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`nav-item ${activeTab === id ? 'nav-item-active' : ''}`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-2 md:space-x-4">
              <button className="btn-cultural-secondary hidden sm:flex">
                <Share2 className="w-4 h-4 mr-2" />
                <span className="hidden lg:inline">Share</span>
              </button>
              <button className="btn-cultural">
                <Download className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Export</span>
                <span className="sm:hidden">Export</span>
              </button>
            </div>
            
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <MobileNavigation 
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onOpen={() => setMobileMenuOpen(true)}
      />
    </>
  );
};

export default NavigationHeader;