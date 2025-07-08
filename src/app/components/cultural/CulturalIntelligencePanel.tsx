'use client';

import React, { useState } from 'react';
import { Globe } from 'lucide-react';
import Card from '../ui/Card';

const CulturalIntelligencePanel = () => {
  const [selectedCulture, setSelectedCulture] = useState('japanese');
  
  const cultures = [
    { id: 'japanese', label: 'Japanese', flag: '🇯🇵' },
    { id: 'scandinavian', label: 'Scandinavian', flag: '🇸🇪' },
    { id: 'italian', label: 'Italian', flag: '🇮🇹' },
    { id: 'french', label: 'French', flag: '🇫🇷' }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">
            Cultural Intelligence Guide
          </h2>
          <p className="text-xl text-gray-600">
            Learn authentic design principles from cultures around the world
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <Card className="p-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Culture Navigation */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Explore Cultures
                </h3>
                {cultures.map((culture) => (
                  <button
                    key={culture.id}
                    onClick={() => setSelectedCulture(culture.id)}
                    className={`
                      w-full flex items-center space-x-3 p-4 rounded-lg text-left
                      transition-all duration-200 ${
                        selectedCulture === culture.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <span className="text-xl">{culture.flag}</span>
                    <span className="font-medium">{culture.label}</span>
                  </button>
                ))}
              </div>
              
              {/* Culture Content */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h3 className="text-2xl font-display font-semibold text-gray-900 mb-4">
                    {cultures.find(c => c.id === selectedCulture)?.label} Design Philosophy
                  </h3>
                  
                  <div className="bg-white p-6 rounded-xl border border-gray-100">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Core Principles
                    </h4>
                    <p className="text-gray-600 mb-4">
                      Discover the authentic design principles that make each culture unique and beautiful.
                    </p>
                    
                    <div className="flex items-center space-x-2 text-sm">
                      <Globe className="w-4 h-4 text-blue-500" />
                      <span className="text-gray-500">Cultural guidance coming soon...</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CulturalIntelligencePanel;