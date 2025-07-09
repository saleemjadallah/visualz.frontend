'use client';

import React, { useState } from 'react';
import { Search, LayoutGrid, Sparkles, Filter, Heart } from 'lucide-react';

const DesignGallery = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Designs', emoji: '🎨' },
    { id: 'wedding', name: 'Wedding', emoji: '💍' },
    { id: 'birthday', name: 'Birthday', emoji: '🎂' },
    { id: 'corporate', name: 'Corporate', emoji: '🏢' },
    { id: 'cultural', name: 'Cultural', emoji: '🌍' }
  ];

  const designs = [
    {
      id: 1,
      title: 'Japanese Wabi-Sabi Wedding',
      category: 'wedding',
      culture: 'Japanese',
      description: 'Minimalist elegance with natural imperfection',
      image: '/api/placeholder/400/300',
      colors: ['#8B7355', '#D4B896', '#F5F5DC'],
      tags: ['Minimalist', 'Natural', 'Wabi-Sabi']
    },
    {
      id: 2,
      title: 'Scandinavian Hygge Birthday',
      category: 'birthday',
      culture: 'Scandinavian',
      description: 'Cozy warmth with candlelight and comfort',
      image: '/api/placeholder/400/300',
      colors: ['#F5F5F5', '#D3D3D3', '#8B4513'],
      tags: ['Cozy', 'Hygge', 'Warm']
    },
    {
      id: 3,
      title: 'Italian Bella Figura Gala',
      category: 'corporate',
      culture: 'Italian',
      description: 'Sophisticated elegance with refined details',
      image: '/api/placeholder/400/300',
      colors: ['#8B0000', '#FFD700', '#2F4F4F'],
      tags: ['Elegant', 'Sophisticated', 'Luxury']
    },
    {
      id: 4,
      title: 'French Savoir-Vivre Soirée',
      category: 'cultural',
      culture: 'French',
      description: 'Refined art of living with graceful sophistication',
      image: '/api/placeholder/400/300',
      colors: ['#4169E1', '#FFB6C1', '#F5F5F5'],
      tags: ['Refined', 'Graceful', 'Sophisticated']
    },
    {
      id: 5,
      title: 'Modern Fusion Celebration',
      category: 'birthday',
      culture: 'Contemporary',
      description: 'Blend of cultural elements with modern aesthetics',
      image: '/api/placeholder/400/300',
      colors: ['#FF6B6B', '#4ECDC4', '#45B7D1'],
      tags: ['Modern', 'Fusion', 'Contemporary']
    },
    {
      id: 6,
      title: 'Traditional Cultural Festival',
      category: 'cultural',
      culture: 'Multi-Cultural',
      description: 'Authentic celebration of diverse traditions',
      image: '/api/placeholder/400/300',
      colors: ['#E74C3C', '#F39C12', '#27AE60'],
      tags: ['Traditional', 'Authentic', 'Diverse']
    }
  ];

  const filteredDesigns = designs.filter(design => 
    (selectedCategory === 'all' || design.category === selectedCategory) &&
    (searchTerm === '' || 
     design.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     design.culture.toLowerCase().includes(searchTerm.toLowerCase()) ||
     design.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  );

  return (
    <section className="section-cultural pattern-japanese">
      <div className="container-cultural">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 animate-gentle-float"
               style={{ backgroundColor: 'var(--cultural-accent)' }}>
            <Sparkles className="w-8 h-8" style={{ color: 'var(--cultural-text)' }} />
          </div>
          <h2 className="hero-title" style={{ color: 'var(--cultural-text)' }}>
            Design Gallery
          </h2>
          <p className="section-subtitle">
            Explore culturally-intelligent designs created by our AI
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-12 gap-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2" 
                     style={{ color: 'var(--cultural-text-light)' }} />
              <input
                type="text"
                placeholder="Search designs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 border rounded-xl w-72 focus:outline-none focus:ring-2 transition-all"
                style={{ 
                  borderColor: 'var(--cultural-secondary)',
                  backgroundColor: 'var(--cultural-soft)',
                  color: 'var(--cultural-text)',
                  focusBorderColor: 'var(--cultural-accent)'
                }}
              />
            </div>
            <div className="flex items-center">
              <Filter className="w-5 h-5 mr-2" style={{ color: 'var(--cultural-text-light)' }} />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all"
                style={{ 
                  borderColor: 'var(--cultural-secondary)',
                  backgroundColor: 'var(--cultural-soft)',
                  color: 'var(--cultural-text)'
                }}
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.emoji} {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="text-sm" style={{ color: 'var(--cultural-text-light)' }}>
            Showing {filteredDesigns.length} design{filteredDesigns.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Design Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDesigns.map((design) => (
            <div key={design.id} className="card-cultural overflow-hidden group cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-2">
              <div className="aspect-[4/3] flex items-center justify-center relative overflow-hidden"
                   style={{ backgroundColor: 'var(--cultural-soft)' }}>
                <LayoutGrid className="w-12 h-12" style={{ color: 'var(--cultural-text-light)' }} />
                
                {/* Overlay with culture badge */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium"
                     style={{ 
                       backgroundColor: 'var(--cultural-accent)',
                       color: 'var(--cultural-text)'
                     }}>
                  {design.culture}
                </div>
                
                {/* Heart icon for favorites */}
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100"
                     style={{ backgroundColor: 'var(--cultural-soft)' }}>
                  <Heart className="w-4 h-4" style={{ color: 'var(--cultural-text)' }} />
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-display font-semibold mb-2" style={{ color: 'var(--cultural-text)' }}>
                  {design.title}
                </h3>
                <p className="text-sm mb-4" style={{ color: 'var(--cultural-text-light)' }}>
                  {design.description}
                </p>
                
                {/* Color palette */}
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-xs font-medium" style={{ color: 'var(--cultural-text-light)' }}>
                    Colors:
                  </span>
                  {design.colors.map((color, index) => (
                    <div
                      key={index}
                      className="w-6 h-6 rounded-full border-2"
                      style={{ 
                        backgroundColor: color,
                        borderColor: 'var(--cultural-secondary)'
                      }}
                    />
                  ))}
                </div>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {design.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{ 
                        backgroundColor: 'var(--cultural-soft)',
                        color: 'var(--cultural-text-light)'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredDesigns.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                 style={{ backgroundColor: 'var(--cultural-soft)' }}>
              <Search className="w-8 h-8" style={{ color: 'var(--cultural-text-light)' }} />
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--cultural-text)' }}>
              No designs found
            </h3>
            <p className="text-sm" style={{ color: 'var(--cultural-text-light)' }}>
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default DesignGallery;