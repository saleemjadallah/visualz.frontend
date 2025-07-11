'use client';

import React, { useState } from 'react';
import NavigationHeader from './components/layout/NavigationHeader';
import HeroSection from './components/sections/HeroSection';
import CulturalThemeSelector from './components/cultural/CulturalThemeSelector';
import EventRequirementsForm from '@/components/forms/EventRequirementsForm';
import SpaceUploadInterface from './components/sections/SpaceUploadInterface';
import DesignGallery from './components/sections/DesignGallery';
import CulturalIntelligencePanel from './components/cultural/CulturalIntelligencePanel';
import { aiApi } from '@/lib/api';
import { EventRequirementsForm as FormData, Design } from '@/lib/types';
import { Loader2, AlertCircle, Sparkles } from 'lucide-react';

export default function HomePage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDesign, setGeneratedDesign] = useState<Design | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFormComplete = async (formData: FormData) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const design = await aiApi.generateCelebrationDesign(formData);
      setGeneratedDesign(design);
      // Scroll to design gallery
      const gallerySection = document.querySelector('#design-gallery');
      gallerySection?.scrollIntoView({ behavior: 'smooth' });
    } catch (err: any) {
      console.error('Failed to generate design:', err);
      setError(err.message || 'Failed to generate design. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen">
      <NavigationHeader />
      
      <main>
        <HeroSection />
        
        <CulturalThemeSelector />
        
        <EventRequirementsForm onComplete={handleFormComplete} />
        
        {/* Loading State */}
        {isGenerating && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: 'var(--cultural-accent)' }} />
              <p className="text-lg font-medium" style={{ color: 'var(--cultural-text)' }}>
                Creating your perfect event design...
              </p>
              <p className="text-sm mt-2" style={{ color: 'var(--cultural-text-light)' }}>
                Our AI is analyzing your requirements and generating a unique design
              </p>
            </div>
          </div>
        )}
        
        {/* Error State */}
        {error && (
          <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-start">
                <AlertCircle className="w-6 h-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-red-900 mb-1">Generation Failed</h3>
                  <p className="text-red-700">{error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="mt-3 text-sm text-red-600 hover:text-red-800 underline"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Generated Design Display */}
        {generatedDesign && !isGenerating && (
          <section className="section-cultural-alt pattern-japanese">
            <div className="container-cultural">
              <div className="text-center mb-12">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 animate-gentle-float"
                     style={{ backgroundColor: 'var(--cultural-accent)' }}>
                  <Sparkles className="w-8 h-8" style={{ color: 'var(--cultural-text)' }} />
                </div>
                <h2 className="hero-title" style={{ color: 'var(--cultural-text)' }}>
                  Your Generated Design
                </h2>
                <p className="section-subtitle">
                  Here's your AI-generated event design based on your requirements
                </p>
              </div>
              
              <div className="card-cultural p-8 max-w-4xl mx-auto">
                <h3 className="text-2xl font-semibold mb-4" style={{ color: 'var(--cultural-text)' }}>
                  {generatedDesign.name || 'Custom Event Design'}
                </h3>
                <p className="text-lg mb-6" style={{ color: 'var(--cultural-text-light)' }}>
                  {generatedDesign.description || 'Your personalized event design is ready!'}
                </p>
                
                {generatedDesign.cultural_elements && (
                  <div className="mb-6">
                    <h4 className="text-lg font-medium mb-3" style={{ color: 'var(--cultural-text)' }}>
                      Cultural Elements:
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(generatedDesign.cultural_elements).map(([key, value]) => (
                        <div key={key} className="flex items-start">
                          <span className="font-medium mr-2" style={{ color: 'var(--cultural-accent)' }}>
                            {key}:
                          </span>
                          <span style={{ color: 'var(--cultural-text-light)' }}>
                            {JSON.stringify(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {generatedDesign.visualization_config && (
                  <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--cultural-soft)' }}>
                    <p className="text-sm" style={{ color: 'var(--cultural-text-light)' }}>
                      3D visualization configuration ready. Scroll down to see more designs or refine your requirements.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
        
        <section className="section-cultural-alt pattern-japanese">
          <SpaceUploadInterface />
        </section>
        
        <section id="design-gallery" className="section-cultural pattern-japanese">
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