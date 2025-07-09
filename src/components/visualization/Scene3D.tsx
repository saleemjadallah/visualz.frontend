'use client';

import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Environment, 
  Grid,
  Text,
  Html
} from '@react-three/drei';
import * as THREE from 'three';
import { Room3D } from './Room3D';
import { EventRoom } from './EventRoom';
import { FurnitureItem3D } from './FurnitureItem3D';
import { LightingSystem } from './LightingSystem';

interface Scene3DProps {
  roomDimensions: {
    length: number;
    width: number;
    height: number;
  };
  furnitureItems: Array<{
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
    modelPath?: string;
    scale?: number;
  }>;
  colorPalette: {
    primary: string;
    secondary: string;
    accent: string;
    neutral: string;
  };
  lightingPlan: {
    ambient_lighting: string;
    task_lighting: string[];
    accent_lighting: string[];
    color_temperature: string;
  };
  onFurnitureSelect?: (furnitureId: string) => void;
  onFurnitureMove?: (furnitureId: string, position: { x: number; y: number }) => void;
  culturalTheme?: string;
}

// Enhanced Camera Controller with preset views
function CameraController({ preset = 'overview' }: { preset?: string }) {
  const { camera, controls } = useThree();
  
  useEffect(() => {
    if (controls) {
      setViewPreset(preset);
    }
  }, [preset, controls]);
  
  const setViewPreset = (preset: string) => {
    switch (preset) {
      case 'overview':
        camera.position.set(15, 15, 15);
        break;
      case 'ground':
        camera.position.set(0, 2, 10);
        break;
      case 'aerial':
        camera.position.set(0, 30, 0);
        break;
      case 'corner':
        camera.position.set(20, 8, 20);
        break;
      default:
        camera.position.set(15, 12, 15);
    }
    camera.lookAt(0, 0, 0);
  };
  
  return null;
}

function LoadingFallback() {
  return (
    <Html center>
      <div className="flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-700">Loading 3D visualization...</span>
      </div>
    </Html>
  );
}

export function Scene3D({
  roomDimensions,
  furnitureItems = [],
  colorPalette,
  lightingPlan,
  onFurnitureSelect,
  onFurnitureMove,
  culturalTheme = 'modern'
}: Scene3DProps) {
  const [selectedFurniture, setSelectedFurniture] = useState<string | null>(null);
  const [cameraPreset, setCameraPreset] = useState<string>('overview');
  const [isDragging, setIsDragging] = useState(false);
  const [dragObject, setDragObject] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-b from-sky-100 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading 3D visualization...</p>
        </div>
      </div>
    );
  }

  const handleFurnitureClick = (furnitureId: string) => {
    setSelectedFurniture(furnitureId);
    onFurnitureSelect?.(furnitureId);
  };

  const handleFurnitureMove = (furnitureId: string, position: { x: number; y: number }) => {
    onFurnitureMove?.(furnitureId, position);
  };

  return (
    <div className="w-full h-full min-h-[500px] bg-gradient-to-b from-sky-100 to-white rounded-lg overflow-hidden">
      <Canvas
        shadows
        camera={{ 
          fov: 60, 
          near: 0.1, 
          far: 1000,
          position: [15, 12, 15]
        }}
        gl={{ 
          antialias: true
        }}
        onCreated={({ gl }) => {
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
      >
        <Suspense fallback={<LoadingFallback />}>
          {/* Enhanced Camera Controls */}
          <CameraController preset={cameraPreset} />
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            enableDamping={true}
            dampingFactor={0.05}
            minDistance={5}
            maxDistance={50}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2}
            target={[roomDimensions.length / 2, 0, roomDimensions.width / 2]}
          />

          {/* Lighting System */}
          <LightingSystem 
            lightingPlan={lightingPlan}
            roomDimensions={roomDimensions}
          />

          {/* Environment */}
          <Environment preset="studio" />
          
          {/* Grid for reference */}
          <Grid
            args={[roomDimensions.length * 2, roomDimensions.width * 2]}
            cellSize={1}
            cellThickness={0.5}
            cellColor="#d1d5db"
            sectionSize={5}
            sectionThickness={1}
            sectionColor="#9ca3af"
            fadeDistance={30}
            fadeStrength={1}
            followCamera={false}
            infiniteGrid={false}
          />

          {/* Enhanced Room with Cultural Theme */}
          <EventRoom
            width={roomDimensions.length}
            height={roomDimensions.height}
            depth={roomDimensions.width}
            colorPalette={colorPalette}
            culturalTheme={culturalTheme}
          />

          {/* Furniture Items */}
          {furnitureItems.map((item) => (
            <FurnitureItem3D
              key={item.id}
              furniture={item}
              isSelected={selectedFurniture === item.id}
              onClick={() => handleFurnitureClick(item.id)}
              onMove={(position) => handleFurnitureMove(item.id, position)}
            />
          ))}

          {/* Room Dimensions Labels */}
          <Text
            position={[roomDimensions.length / 2, 0.5, -1]}
            fontSize={0.8}
            color="#374151"
            anchorX="center"
            anchorY="middle"
          >
            {roomDimensions.length}ft
          </Text>
          
          <Text
            position={[-1, 0.5, roomDimensions.width / 2]}
            fontSize={0.8}
            color="#374151"
            anchorX="center"
            anchorY="middle"
            rotation={[0, Math.PI / 2, 0]}
          >
            {roomDimensions.width}ft
          </Text>

          {/* Height indicator */}
          <Text
            position={[roomDimensions.length + 2, roomDimensions.height / 2, 0]}
            fontSize={0.8}
            color="#374151"
            anchorX="center"
            anchorY="middle"
            rotation={[0, 0, Math.PI / 2]}
          >
            {roomDimensions.height}ft
          </Text>
        </Suspense>
      </Canvas>

      {/* Enhanced UI Overlay with Camera Presets */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <h3 className="font-semibold text-gray-800 mb-2">3D Room View</h3>
        <div className="text-sm text-gray-600 space-y-1 mb-3">
          <div>• Drag to rotate view</div>
          <div>• Scroll to zoom</div>
          <div>• Click furniture to select</div>
        </div>
        
        {/* Camera Preset Buttons */}
        <div className="space-y-1">
          <div className="text-xs font-medium text-gray-700 mb-1">Camera Views:</div>
          <div className="flex flex-wrap gap-1">
            {['overview', 'ground', 'aerial', 'corner'].map((preset) => (
              <button
                key={preset}
                onClick={() => setCameraPreset(preset)}
                className={`px-2 py-1 text-xs rounded ${
                  cameraPreset === preset 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {preset.charAt(0).toUpperCase() + preset.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {selectedFurniture && (
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg max-w-48">
          <h4 className="font-semibold text-gray-800 mb-1">Selected Item</h4>
          <p className="text-sm text-gray-600">
            {furnitureItems.find(item => item.id === selectedFurniture)?.name}
          </p>
          <button
            onClick={() => setSelectedFurniture(null)}
            className="mt-2 text-xs text-blue-600 hover:text-blue-800"
          >
            Deselect
          </button>
        </div>
      )}
    </div>
  );
}