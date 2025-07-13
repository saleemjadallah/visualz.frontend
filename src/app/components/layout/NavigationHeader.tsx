// app/components/layout/NavigationHeader.tsx
'use client';

import React, { useState } from 'react';
import { LineIcon } from '@/lib/icons/lineicons';
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
                <LineIcon name="star-filled" size={24} style={{ color: 'var(--cultural-text)' }} />
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
                { id: 'chat', label: 'AI Chat', icon: 'comment' as const, action: 'stay' },
                { id: 'gallery', label: 'Gallery', icon: 'camera' as const, action: 'link', href: '/gallery' },
                { id: 'cultural', label: 'Cultural Guide', icon: 'globe' as const, action: 'link', href: '/cultural' },
                { id: 'vendors', label: 'Marketplace', icon: 'home' as const, action: 'external' }
              ].map(({ id, label, icon, action, href }) => (
                <button
                  key={id}
                  onClick={() => {
                    setActiveTab(id);
                    if (action === 'stay') {
                      // Stay on current page (chat)
                    } else if (action === 'link' && href) {
                      // Navigate to internal link
                      window.location.href = href;
                    } else if (action === 'external') {
                      // Handle external links
                      // TODO: Add external marketplace link
                    }
                  }}
                  className={`nav-item ${activeTab === id ? 'nav-item-active' : ''}`}
                >
                  <LineIcon name={icon} size={16} />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-2 md:space-x-4">
              <button className="btn-cultural-secondary hidden sm:flex">
                <LineIcon name="share-alt" size={16} className="mr-2" />
                <span className="hidden lg:inline">Share</span>
              </button>
              <button className="btn-cultural">
                <LineIcon name="download" size={16} className="mr-2" />
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