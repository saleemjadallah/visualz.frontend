'use client';

import React, { useState } from 'react';
import { Palette, Eye, Globe, Menu, X } from 'lucide-react';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('design');
  
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg">✨</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">DesignVisualz</h1>
                <p className="text-xs text-gray-500">Cultural Intelligence AI</p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center space-x-1">
              <button
                onClick={() => setActiveTab('design')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  activeTab === 'design' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Palette className="w-4 h-4" />
                <span>Design Studio</span>
              </button>
              <button
                onClick={() => setActiveTab('gallery')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  activeTab === 'gallery' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>Gallery</span>
              </button>
              <button
                onClick={() => setActiveTab('cultural')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  activeTab === 'cultural' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>Cultural Guide</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50 py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Design Events with
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-500">
                  Cultural Intelligence
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Create stunning, culturally-aware event designs using AI that understands 
                traditions, aesthetics, and the art of beautiful celebrations.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300">
                  Start Designing
                </button>
                <button className="px-8 py-3 bg-white text-gray-900 border-2 border-gray-200 rounded-xl font-medium hover:border-gray-300 transition-all duration-300">
                  View Gallery
                </button>
              </div>
              
              <div className="flex flex-wrap gap-4 justify-center mt-8">
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
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                How It Works
              </h2>
              <p className="text-xl text-gray-600">
                Three simple steps to culturally-intelligent event design
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📷</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Your Space</h3>
                <p className="text-gray-600">
                  Share photos of your venue and let our AI analyze the dimensions and potential
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎨</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Choose Your Culture</h3>
                <p className="text-gray-600">
                  Select cultural traditions that resonate with your vision and values
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Get AI Designs</h3>
                <p className="text-gray-600">
                  Receive beautiful, culturally-aware designs tailored to your space and budget
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg flex items-center justify-center">
              ✨
            </div>
            <h3 className="text-xl font-semibold">DesignVisualz</h3>
          </div>
          <p className="text-gray-300 mb-6">
            Bringing cultural intelligence to event design, one celebration at a time.
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Cultural Guidelines</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}