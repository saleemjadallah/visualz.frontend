'use client';

import React, { useState } from 'react';
import { LineIcon } from '@/lib/icons/lineicons';

const CulturalGuide = () => {
  const [selectedCulture, setSelectedCulture] = useState('japanese');

  const cultures = [
    {
      id: 'japanese',
      name: 'Japanese',
      flag: '🇯🇵',
      primaryColor: '#2c3e50',
      accentColor: '#d4af37',
      principles: [
        {
          name: 'Wabi-Sabi',
          description: 'Finding beauty in imperfection and impermanence',
          icon: 'heart-filled',
          application: 'Use natural materials, embrace asymmetry, celebrate aging',
          colors: ['#8B4513', '#F5E6D3', '#2F4F4F'],
          examples: [
            'Weathered wood surfaces',
            'Asymmetrical arrangements',
            'Natural stone textures'
          ]
        },
        {
          name: 'Ma (Negative Space)',
          description: 'The power of emptiness and pause in design',
          icon: 'star-filled',
          application: 'Create breathing room, strategic emptiness, mindful spacing',
          colors: ['#FFFFFF', '#F8F8F8', '#E8E8E8'],
          examples: [
            'Minimalist table settings',
            'Spacious room layouts',
            'Thoughtful silence moments'
          ]
        },
        {
          name: 'Kanso (Simplicity)',
          description: 'Eliminating clutter and expressing more with less',
          icon: 'pencil-alt',
          application: 'Clean lines, essential elements only, functional beauty',
          colors: ['#2c3e50', '#8b7355', '#fafaf9'],
          examples: [
            'Simple bamboo decorations',
            'Uncluttered surfaces',
            'Natural material focus'
          ]
        }
      ]
    },
    {
      id: 'scandinavian',
      name: 'Scandinavian',
      flag: '🇸🇪',
      primaryColor: '#4299e1',
      accentColor: '#d69e2e',
      principles: [
        {
          name: 'Hygge',
          description: 'Creating cozy, comfortable, and content atmosphere',
          icon: 'heart-filled',
          application: 'Warm lighting, soft textures, intimate gathering spaces',
          colors: ['#F7F7F7', '#E8E8E8', '#D4AF37'],
          examples: [
            'Candles and warm lighting',
            'Cozy blankets and pillows',
            'Natural wood elements'
          ]
        },
        {
          name: 'Lagom',
          description: 'The perfect balance - not too little, not too much',
          icon: 'star-filled',
          application: 'Balanced proportions, moderate luxury, sustainable choices',
          colors: ['#5b9bd5', '#fafafa', '#d2b48c'],
          examples: [
            'Balanced color schemes',
            'Moderate decoration',
            'Quality over quantity'
          ]
        },
        {
          name: 'Funktionalism',
          description: 'Form follows function in beautiful, practical design',
          icon: 'pencil-alt',
          application: 'Multi-purpose furniture, clean lines, practical beauty',
          colors: ['#4299e1', '#ffffff', '#718096'],
          examples: [
            'Multi-functional furniture',
            'Clean architectural lines',
            'Practical storage solutions'
          ]
        }
      ]
    },
    {
      id: 'italian',
      name: 'Italian',
      flag: '🇮🇹',
      primaryColor: '#c53030',
      accentColor: '#d69e2e',
      principles: [
        {
          name: 'Bella Figura',
          description: 'Making a beautiful impression through style and presentation',
          icon: 'heart-filled',
          application: 'Elegant presentations, refined details, visual sophistication',
          colors: ['#c53030', '#fffaf0', '#d69e2e'],
          examples: [
            'Elegant table settings',
            'Sophisticated color palettes',
            'Attention to visual details'
          ]
        },
        {
          name: 'Sprezzatura',
          description: 'Studied carelessness - effortless elegance',
          icon: 'star-filled',
          application: 'Relaxed sophistication, natural flow, effortless beauty',
          colors: ['#8B4513', '#F5E6D3', '#DEB887'],
          examples: [
            'Naturally flowing arrangements',
            'Effortless luxury',
            'Relaxed formal settings'
          ]
        },
        {
          name: 'Convivialità',
          description: 'Creating warmth and togetherness through gathering',
          icon: 'users',
          application: 'Communal spaces, family-style arrangements, shared experiences',
          colors: ['#FF6B35', '#FFF8DC', '#CD853F'],
          examples: [
            'Family-style dining',
            'Communal gathering spaces',
            'Warm, inviting atmospheres'
          ]
        }
      ]
    },
    {
      id: 'french',
      name: 'French',
      flag: '🇫🇷',
      primaryColor: '#2563eb',
      accentColor: '#d4af37',
      principles: [
        {
          name: 'Savoir-Vivre',
          description: 'The art of living well with grace and sophistication',
          icon: 'heart-filled',
          application: 'Refined details, quality materials, sophisticated arrangements',
          colors: ['#2563eb', '#f8fafc', '#d4af37'],
          examples: [
            'Refined table settings',
            'Quality fabric choices',
            'Sophisticated lighting'
          ]
        },
        {
          name: 'Joie de Vivre',
          description: 'Joy of living expressed through celebration and beauty',
          icon: 'star-filled',
          application: 'Vibrant celebrations, artistic expressions, joyful gatherings',
          colors: ['#ec4899', '#fef3c7', '#8b5cf6'],
          examples: [
            'Vibrant floral arrangements',
            'Artistic table designs',
            'Celebratory color schemes'
          ]
        },
        {
          name: 'L\'Art de Recevoir',
          description: 'The art of receiving and hosting with elegance',
          icon: 'users',
          application: 'Gracious hospitality, thoughtful details, memorable experiences',
          colors: ['#1e40af', '#f1f5f9', '#f59e0b'],
          examples: [
            'Thoughtful place settings',
            'Gracious hosting details',
            'Memorable presentation'
          ]
        }
      ]
    }
  ];

  const selectedCultureData = cultures.find(c => c.id === selectedCulture) || cultures[0];

  return (
    <section className="section-cultural pattern-japanese" data-section="cultural-intelligence">
      <div className="container-cultural">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-gentle-float"
               style={{ backgroundColor: 'var(--cultural-accent)' }}>
            <LineIcon name="world" size={32} style={{ color: 'var(--cultural-text)' }} />
          </div>
          <h2 className="hero-title" style={{ color: 'var(--cultural-text)' }}>
            Cultural Design Intelligence
          </h2>
          <p className="section-subtitle max-w-3xl mx-auto">
            Explore authentic design principles from around the world. Learn how to respectfully 
            integrate cultural aesthetics into your event celebrations.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Culture Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="card-cultural p-6 sticky top-8">
              <h3 className="text-lg font-semibold mb-6" style={{ color: 'var(--cultural-text)' }}>
                Cultural Traditions
              </h3>
              <div className="space-y-2">
                {cultures.map((culture) => (
                  <button
                    key={culture.id}
                    onClick={() => setSelectedCulture(culture.id)}
                    className={`w-full flex items-center space-x-3 p-4 rounded-xl text-left transition-all duration-200 ${
                      selectedCulture === culture.id
                        ? 'border-2 transform -translate-y-1'
                        : 'border hover:transform hover:-translate-y-1'
                    }`}
                    style={{
                      backgroundColor: selectedCulture === culture.id 
                        ? 'var(--cultural-soft)' 
                        : 'var(--cultural-primary)',
                      borderColor: selectedCulture === culture.id 
                        ? 'var(--cultural-accent)' 
                        : 'var(--cultural-secondary)',
                      color: selectedCulture === culture.id 
                        ? 'var(--cultural-text)' 
                        : 'var(--cultural-text-light)'
                    }}
                  >
                    <span className="text-2xl">{culture.flag}</span>
                    <div>
                      <div className="font-medium">{culture.name}</div>
                      <div className="text-sm opacity-75">
                        {culture.principles.length} principles
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Culture Header */}
            <div className="card-cultural p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-3xl animate-gentle-float"
                    style={{ backgroundColor: 'var(--cultural-accent)' }}
                  >
                    {selectedCultureData.flag}
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-bold" style={{ color: 'var(--cultural-text)' }}>
                      {selectedCultureData.name} Design Philosophy
                    </h3>
                    <p style={{ color: 'var(--cultural-text-light)' }}>
                      Authentic principles for respectful cultural integration
                    </p>
                  </div>
                </div>
                <div className="hidden sm:flex space-x-2">
                  {selectedCultureData.principles.slice(0, 3).map((principle, index) => (
                    <div 
                      key={index}
                      className="w-6 h-6 rounded-full border-2"
                      style={{ 
                        backgroundColor: principle.colors[0],
                        borderColor: 'var(--cultural-secondary)'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Principle Cards */}
            <div className="space-y-6">
              {selectedCultureData.principles.map((principle, index) => (
                <div key={index} className="card-cultural p-8 hover:transform hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-start space-x-6">
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-white"
                      style={{ backgroundColor: 'var(--cultural-accent)' }}
                    >
                      <LineIcon name={principle.icon} size={32} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-display font-semibold mb-2" style={{ color: 'var(--cultural-text)' }}>
                        {principle.name}
                      </h4>
                      <p className="mb-4 text-lg leading-relaxed" style={{ color: 'var(--cultural-text-light)' }}>
                        {principle.description}
                      </p>
                      <div className="rounded-xl p-4 mb-6" style={{ backgroundColor: 'var(--cultural-soft)' }}>
                        <p className="text-sm font-medium mb-2" style={{ color: 'var(--cultural-text)' }}>Application:</p>
                        <p style={{ color: 'var(--cultural-text-light)' }}>{principle.application}</p>
                      </div>
                      
                      {/* Color Palette */}
                      <div className="mb-6">
                        <p className="text-sm font-medium mb-3" style={{ color: 'var(--cultural-text)' }}>Color Palette:</p>
                        <div className="flex space-x-2">
                          {principle.colors.map((color, colorIndex) => (
                            <div
                              key={colorIndex}
                              className="w-8 h-8 rounded-lg border-2"
                              style={{ 
                                backgroundColor: color,
                                borderColor: 'var(--cultural-secondary)'
                              }}
                              title={color}
                            />
                          ))}
                        </div>
                      </div>
                      
                      {/* Examples */}
                      <div>
                        <p className="text-sm font-medium mb-3" style={{ color: 'var(--cultural-text)' }}>Examples:</p>
                        <div className="grid sm:grid-cols-3 gap-3">
                          {principle.examples.map((example, exampleIndex) => (
                            <div key={exampleIndex} className="rounded-lg p-3" style={{ backgroundColor: 'var(--cultural-soft)' }}>
                              <p className="text-sm" style={{ color: 'var(--cultural-text)' }}>{example}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cultural Sensitivity Note */}
            <div className="card-cultural p-6 mt-8 border-2" style={{ borderColor: 'var(--cultural-accent)' }}>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--cultural-accent)' }}>
                  <LineIcon name="heart-filled" size={16} style={{ color: 'var(--cultural-text)' }} />
                </div>
                <div>
                  <h4 className="font-semibold mb-2" style={{ color: 'var(--cultural-text)' }}>Cultural Sensitivity Reminder</h4>
                  <p className="text-sm" style={{ color: 'var(--cultural-text-light)' }}>
                    These design principles are meant to inspire respectful cultural integration. 
                    Always consider the context, consult with cultural experts when appropriate, 
                    and avoid appropriation by understanding the deeper meaning behind each element.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CulturalGuide;