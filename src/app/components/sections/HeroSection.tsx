'use client';

import React from 'react';
import { Camera, Eye, LayoutGrid, ArrowRight, Play } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="section-cultural pattern-japanese relative overflow-hidden">
      <div className="container-cultural">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Content Side */}
          <div className="space-y-8 animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-gentle-pulse"></div>
              <span className="text-sm font-medium" style={{ color: 'var(--cultural-text)' }}>
                AI-Powered Cultural Intelligence
              </span>
            </div>
            
            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="hero-title" style={{ color: 'var(--cultural-text)' }}>
                Design Events with
                <span className="hero-subtitle block">
                  Cultural Intelligence
                </span>
              </h1>
              <p className="text-xl lg:text-2xl leading-relaxed max-w-2xl" style={{ color: 'var(--cultural-text-light)' }}>
                Create stunning, culturally-aware event designs using AI that understands 
                traditions, aesthetics, and the art of beautiful celebrations.
              </p>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button className="btn-cultural group">
                <Camera className="w-5 h-5 mr-2" />
                Start Designing
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </button>
              <button className="btn-cultural-secondary group">
                <Play className="w-4 h-4 mr-2" />
                Watch Demo
              </button>
            </div>
          </div>
          
          {/* Visual Side */}
          <div className="relative animate-fade-in-up">
            <div className="relative">
              {/* Main Preview Card */}
              <div className="card-cultural aspect-[4/3] p-8 relative overflow-hidden">
                <div className="absolute inset-0 pattern-japanese opacity-30"></div>
                <div className="relative z-10 flex items-center justify-center h-full">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto animate-gentle-float"
                         style={{ background: 'var(--cultural-accent)' }}>
                      <LayoutGrid className="w-10 h-10" style={{ color: 'var(--cultural-text)' }} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--cultural-text)' }}>
                        3D Event Preview
                      </h3>
                      <p className="text-sm" style={{ color: 'var(--cultural-text-light)' }}>
                        Real-time cultural design visualization
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Preview Elements */}
                <div className="absolute top-6 left-6">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-xs font-medium" style={{ color: 'var(--cultural-text)' }}>
                        Live Preview
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Element */}
              <div className="absolute -top-6 -right-6 w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl animate-gentle-float"
                   style={{ background: 'var(--cultural-accent)' }}>
                <span className="text-white text-2xl">✨</span>
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              {[
                { label: 'Cultural Traditions', value: '50+', icon: '🌍' },
                { label: 'Design Templates', value: '1000+', icon: '🎨' },
                { label: 'Happy Users', value: '10K+', icon: '😊' }
              ].map((stat, index) => (
                <div key={index} className="stats-item">
                  <div className="stats-icon">
                    <span>{stat.icon}</span>
                  </div>
                  <div className="text-lg font-bold" style={{ color: 'var(--cultural-text)' }}>
                    {stat.value}
                  </div>
                  <div className="text-xs text-center" style={{ color: 'var(--cultural-text-light)' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;