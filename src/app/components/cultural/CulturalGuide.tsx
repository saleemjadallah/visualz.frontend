'use client';

import React, { useState } from 'react';
import { Globe, Heart, Lightbulb, Palette, BookOpen, Users } from 'lucide-react';

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
          icon: Heart,
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
          icon: Lightbulb,
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
          icon: BookOpen,
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
          icon: Heart,
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
          icon: Lightbulb,
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
          icon: BookOpen,
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
          icon: Heart,
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
          icon: Lightbulb,
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
          icon: Users,
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
          icon: Heart,
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
          icon: Lightbulb,
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
          icon: Users,
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
    <section className="section-padding bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Globe className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-gray-900 mb-6">
            Cultural Design Intelligence
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore authentic design principles from around the world. Learn how to respectfully 
            integrate cultural aesthetics into your event celebrations.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Culture Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Cultural Traditions</h3>
              <div className="space-y-2">
                {cultures.map((culture) => (
                  <button
                    key={culture.id}
                    onClick={() => setSelectedCulture(culture.id)}
                    className={`w-full flex items-center space-x-3 p-4 rounded-xl text-left transition-all duration-200 ${
                      selectedCulture === culture.id
                        ? 'bg-blue-50 text-blue-700 border-2 border-blue-200'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
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
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-3xl"
                    style={{ backgroundColor: selectedCultureData.primaryColor }}
                  >
                    {selectedCultureData.flag}
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-bold text-gray-900">
                      {selectedCultureData.name} Design Philosophy
                    </h3>
                    <p className="text-gray-600">
                      Authentic principles for respectful cultural integration
                    </p>
                  </div>
                </div>
                <div className="hidden sm:flex space-x-2">
                  {selectedCultureData.principles.slice(0, 3).map((principle, index) => (
                    <div 
                      key={index}
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: principle.colors[0] }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Principle Cards */}
            <div className="space-y-6">
              {selectedCultureData.principles.map((principle, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-start space-x-6">
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-white"
                      style={{ backgroundColor: selectedCultureData.primaryColor }}
                    >
                      <principle.icon className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-display font-semibold text-gray-900 mb-2">
                        {principle.name}
                      </h4>
                      <p className="text-gray-600 mb-4 text-lg leading-relaxed">
                        {principle.description}
                      </p>
                      <div className="bg-gray-50 rounded-xl p-4 mb-6">
                        <p className="text-sm font-medium text-gray-700 mb-2">Application:</p>
                        <p className="text-gray-600">{principle.application}</p>
                      </div>
                      
                      {/* Color Palette */}
                      <div className="mb-6">
                        <p className="text-sm font-medium text-gray-700 mb-3">Color Palette:</p>
                        <div className="flex space-x-2">
                          {principle.colors.map((color, colorIndex) => (
                            <div
                              key={colorIndex}
                              className="w-8 h-8 rounded-lg border-2 border-gray-200"
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>
                      </div>
                      
                      {/* Examples */}
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-3">Examples:</p>
                        <div className="grid sm:grid-cols-3 gap-3">
                          {principle.examples.map((example, exampleIndex) => (
                            <div key={exampleIndex} className="bg-blue-50 rounded-lg p-3">
                              <p className="text-sm text-blue-800">{example}</p>
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
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mt-8">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                  <Heart className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-amber-900 mb-2">Cultural Sensitivity Reminder</h4>
                  <p className="text-amber-800 text-sm">
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