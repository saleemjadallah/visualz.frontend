import React from 'react';
import NavigationHeader from './components/layout/NavigationHeader';
import HeroSection from './components/sections/HeroSection';
import CulturalThemeSelector from './components/cultural/CulturalThemeSelector';
import EventRequirementsForm from './components/forms/EventRequirementsForm';
import EventVisionSteps from './components/sections/EventVisionSteps';
import SpaceUploadInterface from './components/sections/SpaceUploadInterface';
import DesignGallery from './components/sections/DesignGallery';
import CulturalIntelligencePanel from './components/cultural/CulturalIntelligencePanel';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <NavigationHeader />
      
      <main>
        <HeroSection />
        
        <CulturalThemeSelector />
        
        <section className="section-cultural pattern-japanese">
          <EventRequirementsForm />
        </section>
        
        <EventVisionSteps />
        
        <section className="section-cultural-alt pattern-japanese">
          <SpaceUploadInterface />
        </section>
        
        <section className="section-cultural pattern-japanese">
          <DesignGallery />
        </section>
        
        <section className="section-cultural-alt pattern-japanese">
          <CulturalIntelligencePanel />
        </section>
      </main>
      
      {/* Enhanced Footer */}
      <footer className="py-16" style={{ background: 'var(--cultural-primary)' }}>
        <div className="container-cultural text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center animate-gentle-float"
              style={{ background: 'var(--cultural-accent)' }}
            >
              <span style={{ color: 'var(--cultural-text)' }}>✨</span>
            </div>
            <h3 className="text-2xl font-display font-semibold text-white">DesignVisualz</h3>
          </div>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Bringing cultural intelligence to event design, one celebration at a time.
          </p>
          <div className="flex justify-center space-x-8 text-white/60">
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