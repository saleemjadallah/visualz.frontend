'use client';

import React, { useState } from 'react';
import { Share2, Download, Palette, Eye, Globe, Menu, X, Sparkles } from 'lucide-react';

const NavigationHeader = () => {
  const [activeTab, setActiveTab] = useState('design');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navigationItems = [
    { id: 'design', label: 'Design Studio', icon: Palette },
    { id: 'gallery', label: 'Gallery', icon: Eye },
    { id: 'cultural', label: 'Cultural Guide', icon: Globe },
    { id: 'vendors', label: 'Marketplace', icon: Menu }
  ];

  return (
    <header className="sticky top-0 z-50 header-cultural">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Cultural Logo */}
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl animate-cultural-float"
                 style={{
                   background: 'linear-gradient(135deg, var(--cultural-primary), var(--cultural-accent))'
                 }}>
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-cultural-heading">
                DesignVisualz
              </h1>
              <p className="text-sm text-cultural-body font-medium">Cultural Intelligence AI</p>
            </div>
          </div>
          
          {/* Cultural Navigation */}
          <nav className="hidden md:flex items-center space-x-3">
            {navigationItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                  activeTab === id 
                    ? 'nav-cultural-active' 
                    : 'nav-cultural-inactive hover:nav-cultural-inactive'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
          
          {/* Cultural Actions */}
          <div className="flex items-center space-x-4">
            <button className="btn-cultural-secondary hidden sm:flex">
              <Share2 className="w-5 h-5 mr-2" />
              Share
            </button>
            <button className="btn-cultural">
              <Download className="w-5 h-5 mr-2" />
              Export Design
            </button>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 rounded-lg text-cultural-primary hover:text-cultural-accent hover:bg-cultural-soft transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-cultural-secondary">
            <div className="flex flex-col space-y-2">
              {navigationItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => {
                    setActiveTab(id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === id 
                      ? 'nav-cultural-active' 
                      : 'nav-cultural-inactive hover:nav-cultural-inactive'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default NavigationHeader;