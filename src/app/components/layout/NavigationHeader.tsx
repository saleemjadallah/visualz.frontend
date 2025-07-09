// app/components/layout/NavigationHeader.tsx
'use client';

import React, { useState } from 'react';
import { Share2, Download, Palette, Eye, Globe, Menu, X, Sparkles } from 'lucide-react';

const NavigationHeader = () => {
  const [activeTab, setActiveTab] = useState('design');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <header className="sticky top-0 z-50 header-cultural">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg animate-gentle-float"
              style={{ 
                background: 'var(--cultural-accent)',
                border: '1px solid var(--cultural-secondary)'
              }}
            >
              <Sparkles className="w-6 h-6" style={{ color: 'var(--cultural-text)' }} />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold text-cultural-heading">
                DesignVisualz
              </h1>
              <p className="text-sm opacity-75" style={{ color: 'var(--cultural-text)' }}>
                Cultural Intelligence AI
              </p>
            </div>
          </div>
          
          {/* Navigation - Properly Spaced */}
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
          
          {/* Action Buttons - Properly Spaced */}
          <div className="flex items-center space-x-4">
            <button className="btn-cultural-secondary hidden sm:flex">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </button>
            <button className="btn-cultural">
              <Download className="w-4 h-4 mr-2" />
              Export Design
            </button>
          </div>
          
        </div>
      </div>
    </header>
  );
};

export default NavigationHeader;