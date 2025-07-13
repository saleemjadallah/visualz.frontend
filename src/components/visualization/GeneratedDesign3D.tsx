'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { X, Maximize2, Minimize2, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// Dynamically import Scene3D to prevent SSR issues
const Scene3D = dynamic(() => import('./Scene3D').then(mod => ({ default: mod.Scene3D })), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading 3D scene...</p>
      </div>
    </div>
  )
});

interface GeneratedDesign3DProps {
  design: {
    design_id: string;
    scene_data: {
      furniture_items?: Array<{
        id: string;
        name: string;
        category: string;
        x: number;
        y: number;
        width: number;
        height: number;
        rotation: number;
        color?: string;
        style?: string;
        material?: {
          type: string;
          pbrProperties?: {
            roughness?: number;
            metalness?: number;
            textureUrls?: {
              diffuse?: string;
              normal?: string;
              roughness?: string;
              metalness?: string;
              ao?: string;
            };
          };
          culturalMaterial?: string;
        };
      }>;
      color_palette?: {
        primary: string;
        secondary: string;
        accent: string;
        neutral: string;
      };
      lighting_plan?: {
        ambient_lighting: string;
        task_lighting: string[];
        accent_lighting: string[];
        color_temperature: string;
      };
      scene?: {
        cultural_theme?: string;
      };
    };
    cultural_metadata?: Array<{ [key: string]: any }>;
    generation_metadata?: {
      cultural_authenticity_score?: number;
      generation_time_ms?: number;
    };
  };
  isFullscreen?: boolean;
  onClose?: () => void;
  onToggleFullscreen?: () => void;
}

export function GeneratedDesign3D({ 
  design, 
  isFullscreen = false,
  onClose,
  onToggleFullscreen 
}: GeneratedDesign3DProps) {
  const [selectedFurniture, setSelectedFurniture] = useState<string | null>(null);

  // Extract data from the generated design
  const furnitureItems = design.scene_data?.furniture_items || [];
  const colorPalette = design.scene_data?.color_palette || {
    primary: '#8B4513',
    secondary: '#D2691E',
    accent: '#FFD700',
    neutral: '#F5F5DC'
  };
  const lightingPlan = design.scene_data?.lighting_plan || {
    ambient_lighting: 'warm',
    task_lighting: ['spotlights'],
    accent_lighting: ['uplights'],
    color_temperature: '3000K'
  };
  const culturalTheme = design.scene_data?.scene?.cultural_theme || 'modern';

  // Default room dimensions if not provided
  const roomDimensions = {
    length: 20,
    width: 15,
    height: 10
  };

  const handleFurnitureSelect = (furnitureId: string) => {
    setSelectedFurniture(furnitureId);
  };

  const handleFurnitureMove = (furnitureId: string, position: { x: number; y: number }) => {
    // For now, just log the movement
    console.log(`Furniture ${furnitureId} moved to:`, position);
  };

  const handleShare = () => {
    // Share functionality
    if (navigator.share) {
      navigator.share({
        title: 'My AI-Generated Event Design',
        text: `Check out my design #${design.design_id}`,
        url: window.location.href
      });
    }
  };

  const handleDownload = () => {
    // TODO: Implement 3D scene export
    console.log('Downloading 3D scene...');
  };

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50' : 'w-full h-[600px]'} bg-gray-50`}>
      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          icon={<Share2 />}
          onClick={handleShare}
          className="bg-white/90 backdrop-blur-sm shadow-sm"
        >
          Share
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          icon={<Download />}
          onClick={handleDownload}
          className="bg-white/90 backdrop-blur-sm shadow-sm"
        >
          Export
        </Button>

        {onToggleFullscreen && (
          <Button
            variant="ghost"
            size="sm"
            icon={isFullscreen ? <Minimize2 /> : <Maximize2 />}
            onClick={onToggleFullscreen}
            className="bg-white/90 backdrop-blur-sm shadow-sm"
          />
        )}
        
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            icon={<X />}
            onClick={onClose}
            className="bg-white/90 backdrop-blur-sm shadow-sm"
          />
        )}
      </div>

      {/* Design Info */}
      <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-sm max-w-xs">
        <h3 className="font-semibold text-gray-800 mb-2">
          Design #{design.design_id}
        </h3>
        <div className="space-y-1 text-sm text-gray-600">
          <div>Theme: {culturalTheme}</div>
          <div>{furnitureItems.length} furniture items</div>
          {design.generation_metadata?.cultural_authenticity_score && (
            <div>Cultural Score: {Math.round(design.generation_metadata.cultural_authenticity_score * 100)}%</div>
          )}
        </div>
      </div>

      {/* 3D Scene */}
      <Scene3D
        roomDimensions={roomDimensions}
        furnitureItems={furnitureItems}
        colorPalette={colorPalette}
        lightingPlan={lightingPlan}
        onFurnitureSelect={handleFurnitureSelect}
        onFurnitureMove={handleFurnitureMove}
        culturalTheme={culturalTheme}
        enablePhysics={true}
        enableLOD={true}
        enableWebGLOptimization={true}
      />

      {/* Selected Furniture Info */}
      {selectedFurniture && (
        <div className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-sm max-w-xs">
          <h4 className="font-semibold text-gray-800 mb-2">Selected Item</h4>
          {(() => {
            const item = furnitureItems.find(f => f.id === selectedFurniture);
            if (!item) return null;
            
            return (
              <div className="space-y-1 text-sm text-gray-600">
                <div className="font-medium text-gray-800">{item.name}</div>
                <div>Type: {item.category}</div>
                {item.material?.culturalMaterial && (
                  <div>Material: {item.material.culturalMaterial}</div>
                )}
                {item.material?.pbrProperties && (
                  <div className="text-xs">
                    Roughness: {item.material.pbrProperties.roughness}, 
                    Metalness: {item.material.pbrProperties.metalness}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

// Default export for better compatibility with dynamic imports
export default GeneratedDesign3D;