'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Three.js components to prevent SSR issues
const Scene3D = dynamic(() => import('./Scene3D').then(mod => ({ default: mod.Scene3D })), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <p className="text-gray-600 text-sm">Loading 3D scene...</p>
      </div>
    </div>
  )
});

const ThemeSelector = dynamic(() => import('./CulturalThemeManager').then(mod => ({ default: mod.ThemeSelector })), {
  ssr: false
});

const FurnitureLibrary = dynamic(() => import('./FurnitureLoader').then(mod => ({ default: mod.FurnitureLibrary })), {
  ssr: false
});

import { useCulturalTheme } from './CulturalThemeManager';
import { useFurnitureLibrary } from './FurnitureLoader';

// Placeholder component for 2D view
const Canvas2DPlaceholder = () => (
  <div className="flex items-center justify-center h-full section-cultural">
    <div className="text-center p-8">
      <div className="w-24 h-24 mx-auto mb-6 rounded-3xl flex items-center justify-center"
           style={{ background: 'var(--cultural-accent)' }}>
        <span className="text-4xl">🎨</span>
      </div>
      <h3 className="text-2xl font-semibold mb-4" style={{ color: 'var(--cultural-text)' }}>
        2D Canvas View
      </h3>
      <p className="text-lg mb-6" style={{ color: 'var(--cultural-text-light)' }}>
        Advanced 2D floor planning coming soon
      </p>
      <div className="btn-cultural-secondary">
        Coming in Future Update
      </div>
    </div>
  </div>
);

interface DesignVisualizationProps {
  design: {
    id: string;
    name: string;
    furniture_items: Array<{
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
    }>;
    color_palette: {
      primary: string;
      secondary: string;
      accent: string;
      neutral: string;
    };
    lighting_plan: {
      ambient_lighting: string;
      task_lighting: string[];
      accent_lighting: string[];
      color_temperature: string;
    };
  };
  project: {
    space_data: {
      length: number;
      width: number;
      height: number;
      room_type: string;
      features: string[];
      limitations: string[];
    };
  };
  onFurnitureUpdate?: (furnitureId: string, updates: any) => void;
  onDesignUpdate?: (designUpdates: any) => void;
}

type ViewMode = '2d' | '3d' | 'split';

export function DesignVisualization({
  design,
  project,
  onFurnitureUpdate,
  onDesignUpdate
}: DesignVisualizationProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('3d');
  const [selectedFurniture, setSelectedFurniture] = useState<string | null>(null);
  const [furnitureItems, setFurnitureItems] = useState(design.furniture_items);
  const [culturalTheme, setCulturalTheme] = useState<string>('modern');
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [showFurnitureLibrary, setShowFurnitureLibrary] = useState(false);
  
  // Cultural theme management
  const { applyTheme, currentTheme } = useCulturalTheme(culturalTheme);
  
  // Furniture library management
  const { availableModels, getModelById } = useFurnitureLibrary(culturalTheme);

  useEffect(() => {
    setFurnitureItems(design.furniture_items);
  }, [design.furniture_items]);

  const handleFurnitureSelect = (furnitureId: string) => {
    setSelectedFurniture(furnitureId);
  };

  const handleFurnitureMove = (furnitureId: string, position: { x: number; y: number }) => {
    const updatedItems = furnitureItems.map(item => 
      item.id === furnitureId 
        ? { ...item, x: position.x, y: position.y }
        : item
    );
    
    setFurnitureItems(updatedItems);
    onFurnitureUpdate?.(furnitureId, { x: position.x, y: position.y });
  };

  const handleFurnitureRotate = (furnitureId: string, rotation: number) => {
    const updatedItems = furnitureItems.map(item => 
      item.id === furnitureId 
        ? { ...item, rotation }
        : item
    );
    
    setFurnitureItems(updatedItems);
    onFurnitureUpdate?.(furnitureId, { rotation });
  };

  const handleAddFurniture = (furnitureData: any) => {
    const newItem = {
      id: `furniture_${Date.now()}`,
      ...furnitureData
    };
    
    const updatedItems = [...furnitureItems, newItem];
    setFurnitureItems(updatedItems);
    onDesignUpdate?.({ furniture_items: updatedItems });
  };
  
  const handleThemeChange = (newTheme: string) => {
    setCulturalTheme(newTheme);
    applyTheme(newTheme);
    
    // Update design with new theme
    onDesignUpdate?.({ 
      cultural_theme: newTheme,
      color_palette: {
        primary: currentTheme.colors.primary,
        secondary: currentTheme.colors.secondary,
        accent: currentTheme.colors.accent,
        neutral: currentTheme.colors.neutral
      }
    });
  };
  
  const handleAddFurnitureFromLibrary = (modelConfig: any) => {
    const newItem = {
      id: `furniture_${Date.now()}`,
      name: modelConfig.name,
      category: modelConfig.category,
      x: modelConfig.defaultPosition[0],
      y: modelConfig.defaultPosition[1],
      width: modelConfig.bounds.width,
      height: modelConfig.bounds.height,
      rotation: 0,
      modelPath: modelConfig.modelPath,
      scale: modelConfig.scale
    };
    
    const updatedItems = [...furnitureItems, newItem];
    setFurnitureItems(updatedItems);
    onDesignUpdate?.({ furniture_items: updatedItems });
    setShowFurnitureLibrary(false);
  };

  const handleRemoveFurniture = (furnitureId: string) => {
    const updatedItems = furnitureItems.filter(item => item.id !== furnitureId);
    setFurnitureItems(updatedItems);
    onDesignUpdate?.({ furniture_items: updatedItems });
    
    if (selectedFurniture === furnitureId) {
      setSelectedFurniture(null);
    }
  };

  return (
    <div className="w-full h-full bg-gray-50 rounded-lg overflow-hidden">
      {/* Enhanced View Mode Controls */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">{design.name}</h2>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('2d')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === '2d'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              2D Plan
            </button>
            
            <button
              onClick={() => setViewMode('3d')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === '3d'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              3D View
            </button>
            
            <button
              onClick={() => setViewMode('split')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'split'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Split View
            </button>
            
            {/* Theme Selector Button */}
            <button
              onClick={() => setShowThemeSelector(!showThemeSelector)}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
            >
              Theme
            </button>
            
            {/* Furniture Library Button */}
            <button
              onClick={() => setShowFurnitureLibrary(!showFurnitureLibrary)}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
            >
              Add Furniture
            </button>
          </div>
        </div>

        {/* Room Info */}
        <div className="mt-3 text-sm text-gray-600">
          <span className="inline-flex items-center space-x-4">
            <span>{project.space_data.room_type}</span>
            <span>•</span>
            <span>{project.space_data.length}' × {project.space_data.width}' × {project.space_data.height}'</span>
            <span>•</span>
            <span>{furnitureItems.length} items</span>
          </span>
        </div>
      </div>

      {/* Visualization Area */}
      <div className="flex-1 h-full">
        {viewMode === '2d' && (
          <div className="w-full h-full">
            <Canvas2DPlaceholder />
          </div>
        )}

        {viewMode === '3d' && (
          <div className="w-full h-full relative">
            <Scene3D
              roomDimensions={project.space_data}
              furnitureItems={furnitureItems}
              colorPalette={design.color_palette}
              lightingPlan={design.lighting_plan}
              onFurnitureSelect={handleFurnitureSelect}
              onFurnitureMove={handleFurnitureMove}
              culturalTheme={culturalTheme}
            />
            
            {/* Theme Selector Panel */}
            {showThemeSelector && (
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg max-w-md z-10">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800">Cultural Theme</h3>
                  <button
                    onClick={() => setShowThemeSelector(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>
                <ThemeSelector
                  currentTheme={culturalTheme}
                  onThemeChange={handleThemeChange}
                />
              </div>
            )}
            
            {/* Furniture Library Panel */}
            {showFurnitureLibrary && (
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg max-w-sm z-10">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800">Furniture Library</h3>
                  <button
                    onClick={() => setShowFurnitureLibrary(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>
                <FurnitureLibrary
                  culturalTheme={culturalTheme}
                  onModelSelect={handleAddFurnitureFromLibrary}
                />
              </div>
            )}
          </div>
        )}

        {viewMode === 'split' && (
          <div className="w-full h-full flex">
            <div className="w-1/2 h-full border-r border-gray-200">
              <Canvas2DPlaceholder />
            </div>
            <div className="w-1/2 h-full">
              <Scene3D
                roomDimensions={project.space_data}
                furnitureItems={furnitureItems}
                colorPalette={design.color_palette}
                lightingPlan={design.lighting_plan}
                onFurnitureSelect={handleFurnitureSelect}
                onFurnitureMove={handleFurnitureMove}
              />
            </div>
          </div>
        )}
      </div>

      {/* Selected Furniture Panel */}
      {selectedFurniture && (
        <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-xs">
          <h3 className="font-semibold text-gray-800 mb-2">Selected Item</h3>
          {(() => {
            const item = furnitureItems.find(f => f.id === selectedFurniture);
            if (!item) return null;
            
            return (
              <div className="space-y-2">
                <div className="text-sm">
                  <strong>{item.name}</strong>
                  <div className="text-gray-600">
                    {item.category} • {item.width}' × {item.height}'
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleFurnitureRotate(selectedFurniture, item.rotation + 90)}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
                  >
                    Rotate
                  </button>
                  
                  <button
                    onClick={() => handleRemoveFurniture(selectedFurniture)}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}