'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { EnhancedChatInterface } from '@/components/chat/EnhancedChatInterface';
import NavigationHeader from '../components/layout/NavigationHeader';
import { Sparkles, MessageSquare, Box, Zap, Package, Lightbulb, Flower } from 'lucide-react';
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

interface ParametricSystem {
  name: string;
  icon: React.ReactNode;
  count: number;
  status: 'pending' | 'generating' | 'complete';
}

export default function ChatParametricPage() {
  const [showDesign, setShowDesign] = useState(false);
  const [sceneData, setSceneData] = useState<any>(null);
  const [isFullscreen3D, setIsFullscreen3D] = useState(false);
  const [parametricSystems, setParametricSystems] = useState<ParametricSystem[]>([
    { name: 'Furniture', icon: <Package className="h-4 w-4" />, count: 0, status: 'pending' },
    { name: 'Lighting', icon: <Lightbulb className="h-4 w-4" />, count: 0, status: 'pending' },
    { name: 'Florals', icon: <Flower className="h-4 w-4" />, count: 0, status: 'pending' },
    { name: 'Stage/AV', icon: <Zap className="h-4 w-4" />, count: 0, status: 'pending' }
  ]);
  
  // Listen for parametric design generation completion
  useEffect(() => {
    const handleShowDesign = (event: CustomEvent) => {
      const design = event.detail;
      setSceneData(design);
      setShowDesign(true);
      
      // Update parametric systems status
      if (design.parametric_systems) {
        setParametricSystems([
          { 
            name: 'Furniture', 
            icon: <Package className="h-4 w-4" />, 
            count: design.parametric_systems.furniture?.item_count || 0, 
            status: 'complete' 
          },
          { 
            name: 'Lighting', 
            icon: <Lightbulb className="h-4 w-4" />, 
            count: design.parametric_systems.lighting?.fixture_count || 0, 
            status: 'complete' 
          },
          { 
            name: 'Florals', 
            icon: <Flower className="h-4 w-4" />, 
            count: design.parametric_systems.floral?.arrangement_count || 0, 
            status: 'complete' 
          },
          { 
            name: 'Stage/AV', 
            icon: <Zap className="h-4 w-4" />, 
            count: design.parametric_systems.stage?.component_count || 0, 
            status: 'complete' 
          }
        ]);
      }
    };
    
    window.addEventListener('showParametricDesign' as any, handleShowDesign);
    window.addEventListener('showDesign' as any, handleShowDesign); // Fallback
    return () => {
      window.removeEventListener('showParametricDesign' as any, handleShowDesign);
      window.removeEventListener('showDesign' as any, handleShowDesign);
    };
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <NavigationHeader />
      
      <div className="flex-1 flex">
        {/* Left Panel - Enhanced Chat Interface */}
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-full lg:w-1/2 border-r border-gray-200 flex flex-col bg-white"
        >
          <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold">DesignVisualz AI + Parametric</h1>
            </div>
            <p className="text-purple-100">Advanced AI-driven parametric generation for culturally-aware events</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                AI Parameter Extraction
              </span>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                Parametric Furniture
              </span>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                Dynamic Lighting
              </span>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                Cultural Florals
              </span>
            </div>
          </div>
          
          <div className="flex-1 overflow-hidden">
            <EnhancedChatInterface />
          </div>
        </motion.div>
        
        {/* Right Panel - 3D Visualization with Parametric Info */}
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
                        <h2 className="text-lg font-semibold text-gray-900">Parametric 3D Design</h2>
                        <p className="text-sm text-gray-600">AI-generated with cultural authenticity</p>
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
                
                {/* Parametric Systems Status */}
                <div className="bg-white border-t p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Parametric Systems Generated</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {parametricSystems.map((system) => (
                      <motion.div
                        key={system.name}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`p-3 rounded-lg border ${
                          system.status === 'complete' 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className={`p-1.5 rounded ${
                              system.status === 'complete' 
                                ? 'bg-green-100 text-green-600' 
                                : 'bg-gray-100 text-gray-400'
                            }`}>
                              {system.icon}
                            </div>
                            <span className="text-sm font-medium text-gray-700">{system.name}</span>
                          </div>
                          <span className={`text-lg font-bold ${
                            system.status === 'complete' ? 'text-green-600' : 'text-gray-400'
                          }`}>
                            {system.count}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Design Metrics */}
                  <div className="mt-4 pt-4 border-t grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Cultural Score</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {sceneData?.generation_metadata?.cultural_authenticity_score || 'N/A'}/10
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Total Items</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {parametricSystems.reduce((sum, sys) => sum + sys.count, 0)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Generation Time</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {sceneData?.generation_metadata?.generation_time_ms 
                          ? `${(sceneData.generation_metadata.generation_time_ms / 1000).toFixed(1)}s`
                          : 'N/A'}
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
                    Parametric Design Awaits
                  </h3>
                  <p className="text-gray-500 leading-relaxed mb-6">
                    Start chatting to describe your event. Our AI will extract parameters and generate 
                    a complete parametric design with furniture, lighting, florals, and more - all 
                    culturally authentic and optimized for your space.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <Package className="h-5 w-5 text-purple-600 mx-auto mb-1" />
                      <p className="text-xs text-purple-700 font-medium">Smart Furniture</p>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <Lightbulb className="h-5 w-5 text-yellow-600 mx-auto mb-1" />
                      <p className="text-xs text-yellow-700 font-medium">Dynamic Lighting</p>
                    </div>
                    <div className="p-3 bg-pink-50 rounded-lg">
                      <Flower className="h-5 w-5 text-pink-600 mx-auto mb-1" />
                      <p className="text-xs text-pink-700 font-medium">Cultural Florals</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <Zap className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                      <p className="text-xs text-blue-700 font-medium">Complete Systems</p>
                    </div>
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