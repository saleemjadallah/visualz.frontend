'use client';

import React from 'react';
import { Camera, Eye, LayoutGrid, ArrowRight, Play } from 'lucide-react';

const HeroSection = () => {
  const culturalFeatures = [
    { culture: 'japanese', label: 'Wabi-Sabi', flag: '🇯🇵', description: 'Beauty in imperfection' },
    { culture: 'scandinavian', label: 'Hygge', flag: '🇸🇪', description: 'Cozy contentment' },
    { culture: 'italian', label: 'Bella Figura', flag: '🇮🇹', description: 'Beautiful appearance' },
    { culture: 'french', label: 'Savoir-Vivre', flag: '🇫🇷', description: 'Art of living' }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50 section-padding">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.3) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      
      <div className="container-custom relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content Side */}
          <div className="space-y-8 animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-soft">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">AI-Powered Cultural Intelligence</span>
            </div>
            
            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-gray-900 leading-tight">
                Design Events with
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800">
                  Cultural Intelligence
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-2xl">
                Create stunning, culturally-aware event designs using AI that understands 
                traditions, aesthetics, and the art of beautiful celebrations.
              </p>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button className="btn-primary group">
                <Camera className="w-5 h-5 mr-2" />
                Start Designing
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </button>
              <button className="btn-secondary group">
                <Play className="w-4 h-4 mr-2" />
                Watch Demo
              </button>
            </div>
            
            {/* Cultural Features */}
            <div className="space-y-4">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Celebrating Cultural Traditions
              </p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {culturalFeatures.map(({ culture, label, flag, description }) => (
                  <div key={culture} className="group">
                    <div className={`cultural-badge-${culture} hover:scale-105 transition-transform cursor-pointer`}>
                      <span className="text-base mr-2">{flag}</span>
                      <div className="text-left">
                        <div className="font-semibold">{label}</div>
                        <div className="text-xs opacity-75">{description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Visual Side */}
          <div className="relative animate-slide-up">
            <div className="relative">
              {/* Main Preview Card */}
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-200">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto">
                      <LayoutGrid className="w-10 h-10 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">3D Event Preview</h3>
                      <p className="text-sm text-gray-600">Real-time cultural design visualization</p>
                    </div>
                  </div>
                </div>
                
                {/* Preview Elements */}
                <div className="absolute top-6 left-6">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-medium">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-xs font-medium text-gray-700">Live Preview</span>
                    </div>
                  </div>
                </div>
                
                <div className="absolute bottom-6 right-6">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-medium">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">🎭</span>
                      <span className="text-xs font-medium text-gray-700">Cultural Theme</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl animate-float">
                <span className="text-white text-2xl">✨</span>
              </div>
              
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg animate-float" style={{animationDelay: '1s'}}>
                <span className="text-white text-lg">🎨</span>
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              {[
                { label: 'Cultural Traditions', value: '50+', icon: '🌍' },
                { label: 'Design Templates', value: '1000+', icon: '🎨' },
                { label: 'Happy Users', value: '10K+', icon: '😊' }
              ].map((stat, index) => (
                <div key={index} className="card-base p-4 text-center">
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-600">{stat.label}</div>
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