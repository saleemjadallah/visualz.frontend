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
import { EventRequirementsForm as FormData } from '@/lib/types';

// Type for the AI-generated 3D scene response
interface GeneratedDesign {
  scene_data: any;
  cultural_metadata: Array<{ [key: string]: any }>;
  accessibility_features: string[];
  budget_breakdown: { [key: string]: any };
  preview_url?: string;
  design_id: string;
  generation_metadata: {
    generation_time_ms: number;
    ai_model_used: string;
    threejs_version: string;
    template_count: number;
    cultural_authenticity_score: number;
    accessibility_compliance: string;
    celebratory_features_included: any[];
  };
}
import { Loader2, AlertCircle, Sparkles } from 'lucide-react';

export default function HomePage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDesign, setGeneratedDesign] = useState<GeneratedDesign | null>(null);
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
                  AI-Generated Event Design #{generatedDesign.design_id}
                </h3>
                <p className="text-lg mb-6" style={{ color: 'var(--cultural-text-light)' }}>
                  Your personalized event design is ready with cultural intelligence and 3D visualization!
                </p>
                
                {/* Generation Metadata */}
                <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--cultural-soft)' }}>
                  <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--cultural-text)' }}>
                    Generation Details:
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm" style={{ color: 'var(--cultural-text-light)' }}>
                    <div>Time: {generatedDesign.generation_metadata.generation_time_ms}ms</div>
                    <div>Templates: {generatedDesign.generation_metadata.template_count}</div>
                    <div>Cultural Score: {generatedDesign.generation_metadata.cultural_authenticity_score}/10</div>
                    <div>Accessibility: {generatedDesign.generation_metadata.accessibility_compliance}</div>
                  </div>
                </div>
                
                {/* Cultural Metadata */}
                {generatedDesign.cultural_metadata && generatedDesign.cultural_metadata.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-medium mb-3" style={{ color: 'var(--cultural-text)' }}>
                      Cultural Elements:
                    </h4>
                    <div className="space-y-2">
                      {generatedDesign.cultural_metadata.map((item, index) => (
                        <div key={index} className="p-3 rounded-lg" style={{ backgroundColor: 'var(--cultural-soft)' }}>
                          <pre className="text-sm" style={{ color: 'var(--cultural-text-light)' }}>
                            {JSON.stringify(item, null, 2)}
                          </pre>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Accessibility Features */}
                {generatedDesign.accessibility_features && generatedDesign.accessibility_features.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-medium mb-3" style={{ color: 'var(--cultural-text)' }}>
                      Accessibility Features:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {generatedDesign.accessibility_features.map((feature, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 rounded-full text-sm"
                          style={{ 
                            backgroundColor: 'var(--cultural-accent)',
                            color: 'var(--cultural-text)'
                          }}
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Budget Breakdown */}
                {generatedDesign.budget_breakdown && (
                  <div className="mb-6">
                    <h4 className="text-lg font-medium mb-3" style={{ color: 'var(--cultural-text)' }}>
                      Budget Breakdown:
                    </h4>
                    <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--cultural-soft)' }}>
                      <pre className="text-sm" style={{ color: 'var(--cultural-text-light)' }}>
                        {JSON.stringify(generatedDesign.budget_breakdown, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
                
                {generatedDesign.preview_url && (
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