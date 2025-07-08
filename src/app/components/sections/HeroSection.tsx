'use client';

import React from 'react';
import { Camera, Eye, LayoutGrid } from 'lucide-react';
import Button from '../ui/Button';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-display font-bold text-gray-900 leading-tight">
                Design Events with
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-500">
                  Cultural Intelligence
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Create stunning, culturally-aware event designs using AI that understands 
                traditions, aesthetics, and the art of beautiful celebrations.
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="primary" size="lg">
                <Camera className="w-5 h-5 mr-2" />
                Start Designing
              </Button>
              <Button variant="secondary" size="lg">
                <Eye className="w-5 h-5 mr-2" />
                View Gallery
              </Button>
            </div>
            
            {/* Feature List */}
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full border border-gray-200">
                <span className="text-lg">🇯🇵</span>
                <span className="text-gray-700">Japanese Wabi-Sabi</span>
              </div>
              <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full border border-gray-200">
                <span className="text-lg">🇸🇪</span>
                <span className="text-gray-700">Scandinavian Hygge</span>
              </div>
              <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full border border-gray-200">
                <span className="text-lg">🇮🇹</span>
                <span className="text-gray-700">Italian Bella Figura</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-blue-500/20 z-10"></div>
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <LayoutGrid className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-sm">3D Event Preview</p>
                </div>
              </div>
            </div>
            
            {/* Floating Element */}
            <div className="absolute -top-6 -right-6 w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-xl animate-float">
              <span className="text-white text-lg">✨</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;