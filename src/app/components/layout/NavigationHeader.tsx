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
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-soft">
      <div className="container-custom">
        <div className="flex items-center justify-between py-4">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-medium">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold text-gray-900">
                DesignVisualz
              </h1>
              <p className="text-xs text-gray-500 font-medium">Cultural Intelligence AI</p>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {navigationItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={
                  activeTab === id 
                    ? 'nav-link-active' 
                    : 'nav-link-inactive'
                }
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
          
          {/* User Actions */}
          <div className="flex items-center space-x-3">
            <button className="btn-secondary hidden sm:flex">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </button>
            <button className="btn-primary">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 mt-4">
            <nav className="flex flex-col space-y-2 pt-4">
              {navigationItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => {
                    setActiveTab(id);
                    setMobileMenuOpen(false);
                  }}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg font-medium text-sm text-left
                    transition-all duration-200 ${
                      activeTab === id 
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default NavigationHeader;