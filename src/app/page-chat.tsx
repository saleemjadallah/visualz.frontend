'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ChatInterface } from '@/components/chat/ChatInterface';
import NavigationHeader from './components/layout/NavigationHeader';
import HeroSection from './components/sections/HeroSection';
import CulturalThemeSelector from './components/cultural/CulturalThemeSelector';
import DesignGallery from './components/sections/DesignGallery';
import CulturalIntelligencePanel from './components/cultural/CulturalIntelligencePanel';
import { Sparkles, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

// Dynamically import 3D component to prevent SSR issues
const GeneratedDesign3D = dynamic(
  () => import('@/components/visualization/GeneratedDesign3D'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cultural-primary mx-auto mb-4"></div>
          <p className="text-cultural-text-light">Loading 3D visualization...</p>
        </div>
      </div>
    )
  }
);

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

export default function HomePage() {
  const [generatedDesign, setGeneratedDesign] = useState<GeneratedDesign | null>(null);
  const [isFullscreen3D, setIsFullscreen3D] = useState(false);
  const [showChatSection, setShowChatSection] = useState(false);

  // Listen for design generation from chat
  useEffect(() => {
    const handleShowDesign = (event: CustomEvent) => {
      setGeneratedDesign(event.detail);
      // Scroll to design section
      setTimeout(() => {
        const designSection = document.querySelector('#generated-design');
        designSection?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    };
    
    window.addEventListener('showDesign' as any, handleShowDesign);
    return () => window.removeEventListener('showDesign' as any, handleShowDesign);
  }, []);

  const handleGetStarted = () => {
    setShowChatSection(true);
    setTimeout(() => {
      const chatSection = document.querySelector('#chat-interface');
      chatSection?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen">
      <NavigationHeader />
      
      <main>
        {/* Modified Hero Section with Chat CTA */}
        <section className="relative overflow-hidden bg-gradient-to-b from-cultural-soft to-white py-20">
          <div className="container-cultural">
            <div className="text-center max-w-4xl mx-auto">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl"
              >
                <MessageSquare className="h-10 w-10 text-white" />
              </motion.div>
              
              <h1 className="hero-title mb-6">
                AI-Powered Event Design,
                <span className="block text-gradient">Just a Conversation Away</span>
              </h1>
              
              <p className="text-xl mb-10" style={{ color: 'var(--cultural-text-light)' }}>
                No forms, no complex steps. Simply chat with our AI about your dream event, 
                and watch as it creates a culturally-aware, beautiful 3D design in real-time.
              </p>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGetStarted}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                Start Designing with AI Chat
              </motion.button>
              
              <div className="mt-8 flex flex-wrap gap-4 justify-center">
                <div className="flex items-center space-x-2 text-sm" style={{ color: 'var(--cultural-text-light)' }}>
                  <Sparkles className="h-4 w-4" />
                  <span>No forms required</span>
                </div>
                <div className="flex items-center space-x-2 text-sm" style={{ color: 'var(--cultural-text-light)' }}>
                  <Sparkles className="h-4 w-4" />
                  <span>AI understands natural language</span>
                </div>
                <div className="flex items-center space-x-2 text-sm" style={{ color: 'var(--cultural-text-light)' }}>
                  <Sparkles className="h-4 w-4" />
                  <span>Instant 3D visualization</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <CulturalThemeSelector />
        
        {/* Chat Interface Section - Replaces Form */}
        {showChatSection && (
          <motion.section
            id="chat-interface"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-cultural pattern-japanese"
          >
            <div className="container-cultural">
              <div className="text-center mb-12">
                <h2 className="hero-title" style={{ color: 'var(--cultural-text)' }}>
                  Chat with Your AI Designer
                </h2>
                <p className="section-subtitle">
                  Describe your event in your own words - our AI will understand and create the perfect design
                </p>
              </div>
              
              <div className="max-w-4xl mx-auto">
                <div className="card-cultural shadow-2xl rounded-2xl overflow-hidden">
                  <div className="h-[600px]">
                    <ChatInterface />
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}
        
        {/* Generated Design Display */}
        {generatedDesign && (
          <section id="generated-design" className="section-cultural-alt pattern-japanese">
            <div className="container-cultural">
              <div className="text-center mb-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 animate-gentle-float"
                  style={{ backgroundColor: 'var(--cultural-accent)' }}
                >
                  <Sparkles className="w-8 h-8" style={{ color: 'var(--cultural-text)' }} />
                </motion.div>
                <h2 className="hero-title" style={{ color: 'var(--cultural-text)' }}>
                  Your AI-Generated Design
                </h2>
                <p className="section-subtitle">
                  Explore your personalized event space with cultural authenticity
                </p>
              </div>
              
              <div className="card-cultural p-8 max-w-5xl mx-auto">
                {/* 3D Visualization */}
                <div className="rounded-lg overflow-hidden border" style={{ borderColor: 'var(--cultural-accent)' }}>
                  <GeneratedDesign3D 
                    design={generatedDesign}
                    isFullscreen={isFullscreen3D}
                    onToggleFullscreen={() => setIsFullscreen3D(!isFullscreen3D)}
                    onClose={() => setIsFullscreen3D(false)}
                  />
                </div>
                
                {/* Design Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="text-center p-6 rounded-lg" style={{ backgroundColor: 'var(--cultural-soft)' }}>
                    <div className="text-3xl font-bold mb-2" style={{ color: 'var(--cultural-accent)' }}>
                      {generatedDesign.generation_metadata.cultural_authenticity_score}/10
                    </div>
                    <p className="text-sm" style={{ color: 'var(--cultural-text-light)' }}>
                      Cultural Authenticity Score
                    </p>
                  </div>
                  
                  <div className="text-center p-6 rounded-lg" style={{ backgroundColor: 'var(--cultural-soft)' }}>
                    <div className="text-3xl font-bold mb-2" style={{ color: 'var(--cultural-accent)' }}>
                      {generatedDesign.generation_metadata.template_count}
                    </div>
                    <p className="text-sm" style={{ color: 'var(--cultural-text-light)' }}>
                      Design Elements
                    </p>
                  </div>
                  
                  <div className="text-center p-6 rounded-lg" style={{ backgroundColor: 'var(--cultural-soft)' }}>
                    <div className="text-3xl font-bold mb-2" style={{ color: 'var(--cultural-accent)' }}>
                      {generatedDesign.generation_metadata.accessibility_compliance}
                    </div>
                    <p className="text-sm" style={{ color: 'var(--cultural-text-light)' }}>
                      Accessibility Rating
                    </p>
                  </div>
                </div>
                
                {/* Cultural Elements */}
                {generatedDesign.cultural_metadata && generatedDesign.cultural_metadata.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--cultural-text)' }}>
                      Cultural Elements Included
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {generatedDesign.cultural_metadata.map((item, index) => (
                        <div key={index} className="p-4 rounded-lg border" style={{ borderColor: 'var(--cultural-accent)' }}>
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
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--cultural-text)' }}>
                      Accessibility Features
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {generatedDesign.accessibility_features.map((feature, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 rounded-full text-sm font-medium"
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
              </div>
            </div>
          </section>
        )}
        
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
            AI-powered event design with cultural intelligence, now as simple as having a conversation.
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