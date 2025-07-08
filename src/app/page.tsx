import React from 'react';
import NavigationHeader from './components/layout/NavigationHeader';
import HeroSection from './components/sections/HeroSection';
import EventRequirementsForm from './components/forms/EventRequirementsForm';
import SpaceUploadInterface from './components/sections/SpaceUploadInterface';
import DesignGallery from './components/sections/DesignGallery';
import CulturalIntelligencePanel from './components/cultural/CulturalIntelligencePanel';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <NavigationHeader />
      <main>
        <HeroSection />
        <EventRequirementsForm />
        <SpaceUploadInterface />
        <DesignGallery />
        <CulturalIntelligencePanel />
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg flex items-center justify-center">
              ✨
            </div>
            <h3 className="text-xl font-display font-semibold">DesignVisualz</h3>
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