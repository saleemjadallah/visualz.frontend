// app/page.tsx
import React from 'react';
import NavigationHeader from './components/layout/NavigationHeader';
import HeroSection from './components/sections/HeroSection';
import EventRequirementsForm from './components/forms/EventRequirementsForm';
import SpaceUploadInterface from './components/sections/SpaceUploadInterface';
import DesignGallery from './components/sections/DesignGallery';
import CulturalIntelligencePanel from './components/cultural/CulturalIntelligencePanel';
import ThemeSelector from './components/cultural/ThemeSelector';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <NavigationHeader />
      <ThemeSelector />
      
      <main>
        <section className="section-cultural">
          <HeroSection />
        </section>
        
        <section className="section-cultural-alt">
          <EventRequirementsForm />
        </section>
        
        <section className="section-cultural">
          <SpaceUploadInterface />
        </section>
        
        <section className="section-cultural-alt">
          <DesignGallery />
        </section>
        
        <section className="section-cultural">
          <CulturalIntelligencePanel />
        </section>
      </main>
      
      {/* Footer */}
      <footer style={{ background: 'var(--cultural-primary)' }} className="text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--cultural-accent)' }}
            >
              <span style={{ color: 'var(--cultural-text)' }}>✨</span>
            </div>
            <h3 className="text-xl font-display font-semibold">DesignVisualz</h3>
          </div>
          <p className="opacity-75 mb-6">
            Bringing cultural intelligence to event design, one celebration at a time.
          </p>
        </div>
      </footer>
    </div>
  );
}