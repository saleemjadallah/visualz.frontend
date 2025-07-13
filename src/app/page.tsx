'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ChatInterface } from '@/components/chat/ChatInterface';
import NavigationHeader from './components/layout/NavigationHeader';
import { Sparkles, MessageSquare, Box } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Dynamically import 3D component to prevent SSR issues
const Scene3D = dynamic(
  () => import('@/components/visualization/GeneratedDesign3D'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cultural-primary mx-auto mb-4"></div>
          <p className="text-cultural-text-light">Loading 3D visualization...</p>
        </div>
      </div>
    )
  }
);

export default function HomePage() {
  const [showDesign, setShowDesign] = useState(false);
  const [sceneData, setSceneData] = useState<any>(null);
  const [isFullscreen3D, setIsFullscreen3D] = useState(false);
  
  // Listen for design generation completion
  useEffect(() => {
    const handleShowDesign = (event: CustomEvent) => {
      setSceneData(event.detail);
      setShowDesign(true);
    };
    
    window.addEventListener('showDesign' as any, handleShowDesign);
    return () => window.removeEventListener('showDesign' as any, handleShowDesign);
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <NavigationHeader />
      
      <div className="flex-1 flex">
        {/* Left Panel - Chat Interface */}
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-full lg:w-1/2 border-r border-gray-200 flex flex-col bg-white"
        >
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold">DesignVisualz AI Chat</h1>
            </div>
            <p className="text-purple-100">Describe your vision, and I'll create a culturally-aware event design</p>
          </div>
          
          <div className="flex-1 overflow-hidden">
            <ChatInterface />
          </div>
        </motion.div>
        
        {/* Right Panel - 3D Visualization */}
        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="hidden lg:flex w-1/2 flex-col bg-gray-50"
        >
          <AnimatePresence mode="wait">
            {showDesign && sceneData ? (
              <motion.div 
                key="design"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex-1 flex flex-col"
              >
                <div className="bg-white border-b p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Box className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">Your 3D Design</h2>
                        <p className="text-sm text-gray-600">Explore and interact with your event space</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsFullscreen3D(!isFullscreen3D)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
                    >
                      {isFullscreen3D ? 'Exit Fullscreen' : 'Fullscreen'}
                    </button>
                  </div>
                </div>
                <div className="flex-1 relative">
                  <Scene3D 
                    design={sceneData}
                    isFullscreen={isFullscreen3D}
                    onToggleFullscreen={() => setIsFullscreen3D(!isFullscreen3D)}
                    onClose={() => setIsFullscreen3D(false)}
                  />
                </div>
                
                {/* Design Metadata */}
                <div className="bg-white border-t p-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Cultural Score</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {sceneData?.generation_metadata?.cultural_authenticity_score || 'N/A'}/10
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Items Placed</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {sceneData?.generation_metadata?.template_count || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Render Time</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {sceneData?.generation_metadata?.generation_time_ms || 0}ms
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex items-center justify-center"
              >
                <div className="text-center max-w-md mx-auto p-8">
                  <motion.div 
                    animate={{ 
                      y: [0, -10, 0],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                    className="w-24 h-24 bg-gradient-to-br from-purple-400 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg"
                  >
                    <Sparkles className="h-12 w-12 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-3">
                    Your Design Will Appear Here
                  </h3>
                  <p className="text-gray-500 leading-relaxed">
                    Start chatting to describe your event vision. Once I have enough details, 
                    I'll create a beautiful 3D design that honors your cultural preferences and requirements.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2 justify-center">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                      AI-Powered
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      Culturally Aware
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                      Real-time 3D
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      
      {/* Mobile Design View - Shows below chat on mobile */}
      <div className="lg:hidden">
        {showDesign && sceneData && (
          <div className="h-96 border-t bg-gray-50">
            <Scene3D 
              design={sceneData}
              isFullscreen={false}
              onToggleFullscreen={() => {}}
              onClose={() => {}}
            />
          </div>
        )}
      </div>
    </div>
  );
}