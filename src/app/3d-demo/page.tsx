'use client';

import dynamic from 'next/dynamic';
import { ClientOnly } from '@/components/ui/ClientOnly';

// Dynamically import the 3D visualization component to prevent SSR issues
const DesignVisualization = dynamic(() => 
  import('@/components/visualization').then(mod => ({ default: mod.DesignVisualization })),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading 3D visualization...</p>
        </div>
      </div>
    )
  }
);

// Sample data for testing
const sampleDesign = {
  id: 'design-1',
  name: 'Modern Event Space Layout',
  furniture_items: [
    {
      id: 'dining-table-1',
      name: 'Main Dining Table',
      category: 'dining-table',
      x: 8,
      y: 6,
      width: 6,
      height: 2.5,
      rotation: 0,
      color: '#8B4513'
    },
    {
      id: 'chair-1',
      name: 'Chair 1',
      category: 'chair',
      x: 6,
      y: 5,
      width: 1.5,
      height: 3,
      rotation: 0
    },
    {
      id: 'chair-2',
      name: 'Chair 2',
      category: 'chair',
      x: 10,
      y: 5,
      width: 1.5,
      height: 3,
      rotation: 0
    },
    {
      id: 'chair-3',
      name: 'Chair 3',
      category: 'chair',
      x: 6,
      y: 8.5,
      width: 1.5,
      height: 3,
      rotation: 180
    },
    {
      id: 'chair-4',
      name: 'Chair 4',
      category: 'chair',
      x: 10,
      y: 8.5,
      width: 1.5,
      height: 3,
      rotation: 180
    },
    {
      id: 'sofa-1',
      name: 'Lounge Sofa',
      category: 'sofa',
      x: 2,
      y: 2,
      width: 4,
      height: 2.8,
      rotation: 0,
      color: '#4A5568'
    },
    {
      id: 'coffee-table-1',
      name: 'Coffee Table',
      category: 'coffee-table',
      x: 2,
      y: 4,
      width: 2.5,
      height: 1.5,
      rotation: 0
    },
    {
      id: 'bookshelf-1',
      name: 'Display Bookshelf',
      category: 'bookshelf',
      x: 15,
      y: 2,
      width: 2,
      height: 6,
      rotation: 0
    },
    {
      id: 'plant-1',
      name: 'Decorative Plant',
      category: 'plant',
      x: 16,
      y: 10,
      width: 1,
      height: 4,
      rotation: 0
    },
    {
      id: 'bar-1',
      name: 'Bar Counter',
      category: 'bar',
      x: 12,
      y: 12,
      width: 4,
      height: 3.5,
      rotation: 0
    },
    {
      id: 'bar-stool-1',
      name: 'Bar Stool 1',
      category: 'bar-stool',
      x: 11,
      y: 11,
      width: 1,
      height: 3,
      rotation: 0
    },
    {
      id: 'bar-stool-2',
      name: 'Bar Stool 2',
      category: 'bar-stool',
      x: 13,
      y: 11,
      width: 1,
      height: 3,
      rotation: 0
    },
    {
      id: 'armchair-1',
      name: 'Lounge Armchair',
      category: 'armchair',
      x: 4,
      y: 8,
      width: 2,
      height: 3,
      rotation: 45
    },
    {
      id: 'ottoman-1',
      name: 'Ottoman',
      category: 'ottoman',
      x: 4,
      y: 6,
      width: 1.5,
      height: 1.5,
      rotation: 0
    },
    {
      id: 'stage-1',
      name: 'Performance Stage',
      category: 'stage',
      x: 18,
      y: 7,
      width: 3,
      height: 0.8,
      rotation: 0
    },
    {
      id: 'rug-1',
      name: 'Area Rug',
      category: 'rug',
      x: 8,
      y: 6,
      width: 8,
      height: 0.1,
      rotation: 0
    }
  ],
  color_palette: {
    primary: '#FF6B9D',
    secondary: '#FFE66D',
    accent: '#4ECDC4',
    neutral: '#F8F9FA'
  },
  lighting_plan: {
    ambient_lighting: 'Warm LED overhead lighting',
    task_lighting: ['Table spotlights', 'Activity area lighting'],
    accent_lighting: ['Wall wash lights', 'Decorative string lights'],
    color_temperature: '2700K'
  }
};

const sampleProject = {
  space_data: {
    length: 20,
    width: 15,
    height: 9,
    room_type: 'Living Room',
    features: ['Large windows', 'Hardwood floors'],
    limitations: ['No nails in walls']
  }
};

export default function ThreeDDemoPage() {
  const handleFurnitureUpdate = (furnitureId: string, updates: any) => {
    console.log('Furniture update:', furnitureId, updates);
  };

  const handleDesignUpdate = (designUpdates: any) => {
    console.log('Design update:', designUpdates);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            3D Visualization Demo
          </h1>
          <p className="text-gray-600">
            Testing React Three Fiber integration with DesignVisualz
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: '700px' }}>
          <ClientOnly fallback={
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Initializing 3D visualization...</p>
              </div>
            </div>
          }>
            <DesignVisualization
              design={sampleDesign}
              project={sampleProject}
              onFurnitureUpdate={handleFurnitureUpdate}
              onDesignUpdate={handleDesignUpdate}
            />
          </ClientOnly>
        </div>

        {/* Info Panel */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 shadow">
            <h3 className="font-semibold text-gray-800 mb-2">Room Details</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <div>Type: {sampleProject.space_data.room_type}</div>
              <div>Size: {sampleProject.space_data.length}' × {sampleProject.space_data.width}' × {sampleProject.space_data.height}'</div>
              <div>Features: {sampleProject.space_data.features.join(', ')}</div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow">
            <h3 className="font-semibold text-gray-800 mb-2">Color Palette</h3>
            <div className="flex space-x-2">
              <div 
                className="w-8 h-8 rounded border"
                style={{ backgroundColor: sampleDesign.color_palette.primary }}
                title="Primary"
              />
              <div 
                className="w-8 h-8 rounded border"
                style={{ backgroundColor: sampleDesign.color_palette.secondary }}
                title="Secondary"
              />
              <div 
                className="w-8 h-8 rounded border"
                style={{ backgroundColor: sampleDesign.color_palette.accent }}
                title="Accent"
              />
              <div 
                className="w-8 h-8 rounded border"
                style={{ backgroundColor: sampleDesign.color_palette.neutral }}
                title="Neutral"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow">
            <h3 className="font-semibold text-gray-800 mb-2">Furniture</h3>
            <div className="text-sm text-gray-600">
              {sampleDesign.furniture_items.length} items placed
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}