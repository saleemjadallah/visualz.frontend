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
import { PostProcessing, EnhancedLighting } from './PostProcessing';
import { PhysicsWorld, PhysicsRoom, PhysicsPerformanceMonitor } from './PhysicsSystem';
import { PhysicsFurnitureItem } from './PhysicsFurnitureItem';
import { LODFurniture } from './LODSystem';
import { HDRIEnvironment, EnvironmentControls, EnvironmentEffects, HDRI_PRESETS } from './HDRIEnvironment';
import { 
  WebGLEngineManager, 
  WebGLCapabilities, 
  PerformanceMonitor, 
  WebGLErrorHandler,
  useWebGLEngine 
} from './WebGLEngine';
import { 
  MobileWebGLOptimizer, 
  VenueRenderer, 
  FurnitureRenderer,
  useWebGLOptimization 
} from './WebGLOptimization';
import { 
  CulturalThemeRenderer,
  CulturalThemeSelector,
  useCulturalThemeRenderer,
  ThemeTransitionManager
} from './WebGLCulturalThemes';
import { 
  WebGLDebugger, 
  RealTimePerformanceMonitor,
  WebGLDebugPanel,
  useWebGLDebugger 
} from './WebGLDebugger';

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
  celebrationProps?: Array<{
    id: string;
    name: string;
    type: 'decor' | 'entertainment' | 'seating' | 'lighting' | 'props' | 'ceremonial';
    x: number;
    y: number;
    z?: number;
    width: number;
    height: number;
    depth?: number;
    rotation: number;
    color?: string;
    culturalSignificance?: string;
    celebrationType?: string;
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
  onCelebrationPropSelect?: (propId: string) => void;
  culturalTheme?: string;
  celebrationType?: string;
  enablePhysics?: boolean;
  enableSnapping?: boolean;
  enableLOD?: boolean;
  hdriPreset?: keyof typeof HDRI_PRESETS;
  enablePerformanceOptimization?: boolean;
  enableWebGLOptimization?: boolean;
  enableCulturalThemeOptimization?: boolean;
  enableWebGLDebugging?: boolean;
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
  celebrationProps = [],
  colorPalette,
  lightingPlan,
  onFurnitureSelect,
  onFurnitureMove,
  onCelebrationPropSelect,
  culturalTheme = 'modern',
  celebrationType,
  enablePhysics = true,
  enableSnapping = true,
  enableLOD = true,
  hdriPreset = 'studio',
  enablePerformanceOptimization = true,
  enableWebGLOptimization = true,
  enableCulturalThemeOptimization = true,
  enableWebGLDebugging = false
}: Scene3DProps) {
  const [selectedFurniture, setSelectedFurniture] = useState<string | null>(null);
  const [selectedCelebrationProp, setSelectedCelebrationProp] = useState<string | null>(null);
  const [cameraPreset, setCameraPreset] = useState<string>('overview');
  const [isDragging, setIsDragging] = useState(false);
  const [dragObject, setDragObject] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [currentHDRIPreset, setCurrentHDRIPreset] = useState<keyof typeof HDRI_PRESETS>(hdriPreset);
  const [hdriIntensity, setHdriIntensity] = useState(1.0);
  const [hdriRotation, setHdriRotation] = useState(0);
  const [showEnvironmentControls, setShowEnvironmentControls] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(culturalTheme);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const recommendedLODDistance = 30; // Default LOD distance
  
  // WebGL optimization state - will be initialized in onCreated
  const [webglOptimization, setWebglOptimization] = useState<any>(null);
  const [culturalThemeRenderer, setCulturalThemeRenderer] = useState<any>(null);
  const [webglDebugger, setWebglDebugger] = useState<any>(null);

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
    setSelectedCelebrationProp(null); // Clear celebration prop selection
    onFurnitureSelect?.(furnitureId);
  };

  const handleFurnitureMove = (furnitureId: string, position: { x: number; y: number }) => {
    onFurnitureMove?.(furnitureId, position);
  };

  const handleCelebrationPropClick = (propId: string) => {
    setSelectedCelebrationProp(propId);
    setSelectedFurniture(null); // Clear furniture selection
    onCelebrationPropSelect?.(propId);
  };

  const handleThemeChange = async (newTheme: string) => {
    if (!culturalThemeRenderer || isTransitioning) return;
    
    setIsTransitioning(true);
    
    // Apply theme immediately without transition for now
    // TODO: Implement scene access for smooth transitions
    culturalThemeRenderer.applyTheme(newTheme);
    
    setCurrentTheme(newTheme);
    setIsTransitioning(false);
  };

  return (
    <WebGLErrorHandler>
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
            antialias: true,
            powerPreference: "high-performance",
            alpha: false,
            stencil: false,
            depth: true
          }}
        onCreated={({ gl, scene }) => {
          // Initialize WebGL Engine Manager for advanced optimization
          if (enableWebGLOptimization) {
            try {
              const engineManager = new WebGLEngineManager(gl.domElement);
              
              // Setup venue-specific rendering
              const venueRenderer = new VenueRenderer(gl);
              
              // Initialize mobile optimizations
              const mobileOptimizer = new MobileWebGLOptimizer(gl);
              
              // Setup furniture renderer optimizations
              const furnitureRenderer = new FurnitureRenderer(gl);
              
              // Initialize cultural theme renderer
              if (enableCulturalThemeOptimization) {
                const themeRenderer = new CulturalThemeRenderer(gl);
                themeRenderer.applyTheme(currentTheme);
                setCulturalThemeRenderer(themeRenderer);
              }
              
              // Debug setup in development
              if (enableWebGLDebugging && process.env.NODE_ENV === 'development') {
                const debuggerInstance = new WebGLDebugger(gl);
                debuggerInstance.startDebugging();
                debuggerInstance.logCapabilities();
                setWebglDebugger({ webglDebugger: debuggerInstance, performanceMonitor: null });
              }
              
              setWebglOptimization({ optimizer: mobileOptimizer, venueRenderer, furnitureRenderer });
              
            } catch (error) {
              console.warn('WebGL optimization initialization failed:', error);
              // Fallback to basic WebGL setup
              gl.shadowMap.enabled = true;
              gl.shadowMap.type = THREE.PCFSoftShadowMap;
              gl.outputColorSpace = THREE.SRGBColorSpace;
              gl.toneMapping = THREE.ACESFilmicToneMapping;
              gl.toneMappingExposure = 1.0;
            }
          } else {
            // Basic WebGL setup
            gl.shadowMap.enabled = true;
            gl.shadowMap.type = THREE.PCFSoftShadowMap;
            gl.outputColorSpace = THREE.SRGBColorSpace;
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.0;
          }
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

          {/* Physics World Wrapper */}
          {enablePhysics ? (
            <PhysicsWorld gravity={[0, -9.81, 0]} iterations={5}>
              <PhysicsSceneContent 
                roomDimensions={roomDimensions}
                furnitureItems={furnitureItems}
                celebrationProps={celebrationProps}
                colorPalette={colorPalette}
                lightingPlan={lightingPlan}
                selectedFurniture={selectedFurniture}
                selectedCelebrationProp={selectedCelebrationProp}
                culturalTheme={currentTheme}
                enableSnapping={enableSnapping}
                enableLOD={enableLOD}
                recommendedLODDistance={recommendedLODDistance}
                onFurnitureClick={handleFurnitureClick}
                onFurnitureMove={handleFurnitureMove}
                onCelebrationPropClick={handleCelebrationPropClick}
                enableWebGLOptimization={enableWebGLOptimization}
              />
              <PhysicsPerformanceMonitor />
            </PhysicsWorld>
          ) : (
            <StandardSceneContent 
              roomDimensions={roomDimensions}
              furnitureItems={furnitureItems}
              celebrationProps={celebrationProps}
              colorPalette={colorPalette}
              lightingPlan={lightingPlan}
              selectedFurniture={selectedFurniture}
              selectedCelebrationProp={selectedCelebrationProp}
              culturalTheme={currentTheme}
              enableLOD={enableLOD}
              recommendedLODDistance={recommendedLODDistance}
              onFurnitureClick={handleFurnitureClick}
              onFurnitureMove={handleFurnitureMove}
              onCelebrationPropClick={handleCelebrationPropClick}
              enableWebGLOptimization={enableWebGLOptimization}
            />
          )}

          {/* HDRI Environment System */}
          <HDRIEnvironment 
            preset={currentHDRIPreset}
            culturalTheme={currentTheme}
            intensity={hdriIntensity}
            rotation={hdriRotation}
            background={true}
            enableReflections={true}
            enableRefraction={false}
          />
          
          {/* Environment Effects */}
          <EnvironmentEffects 
            preset={currentHDRIPreset}
            enableVolumetricLighting={true}
            enableGodRays={false}
            fogDensity={0.01}
          />

          {/* Enhanced Lighting System with Post-Processing */}
          <EnhancedLighting />
          <LightingSystem 
            lightingPlan={lightingPlan}
            roomDimensions={roomDimensions}
            culturalTheme={currentTheme}
          />
          
          {/* Ultra-Realistic Post-Processing Pipeline */}
          <PostProcessing
            enableSSAO={true}
            enableBloom={true}
            enableAntialiasing={true}
            enableToneMapping={true}
            bloomStrength={0.3}
            bloomRadius={0.4}
            bloomThreshold={0.85}
            ssaoRadius={0.1}
            ssaoIntensity={0.5}
          />
          
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

        {/* Cultural Theme Selector */}
        {enableCulturalThemeOptimization && culturalThemeRenderer && (
          <div className="absolute top-4 right-4">
            <CulturalThemeSelector
              themeRenderer={culturalThemeRenderer}
              currentTheme={currentTheme}
              onThemeChange={handleThemeChange}
            />
          </div>
        )}

        {/* WebGL Debug Panel (Development Only) */}
        {enableWebGLDebugging && webglDebugger?.webglDebugger && (
          <WebGLDebugPanel
            webglDebugger={webglDebugger.webglDebugger}
            performanceMonitor={webglDebugger.performanceMonitor}
          />
        )}

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

      {(selectedFurniture || selectedCelebrationProp) && (
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg max-w-48">
          <h4 className="font-semibold text-gray-800 mb-1">Selected Item</h4>
          {selectedFurniture && (
            <div>
              <p className="text-sm text-gray-600">
                {furnitureItems.find(item => item.id === selectedFurniture)?.name}
              </p>
              <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                Furniture
              </span>
            </div>
          )}
          {selectedCelebrationProp && (
            <div>
              <p className="text-sm text-gray-600">
                {celebrationProps.find(prop => prop.id === selectedCelebrationProp)?.name}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="inline-block px-2 py-1 bg-cultural-primary/20 text-cultural-primary text-xs rounded">
                  Celebration
                </span>
                {celebrationProps.find(prop => prop.id === selectedCelebrationProp)?.culturalSignificance && (
                  <span className="inline-block px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded">
                    Cultural
                  </span>
                )}
              </div>
            </div>
          )}
          <button
            onClick={() => {
              setSelectedFurniture(null);
              setSelectedCelebrationProp(null);
            }}
            className="mt-2 text-xs text-blue-600 hover:text-blue-800"
          >
            Deselect
          </button>
        </div>
      )}

      {/* Performance Stats removed to avoid R3F hook conflicts */}

      {/* Environment Controls */}
      {showEnvironmentControls && (
        <div className="absolute top-4 right-4">
          <EnvironmentControls
            currentPreset={currentHDRIPreset}
            onPresetChange={setCurrentHDRIPreset}
            intensity={hdriIntensity}
            onIntensityChange={setHdriIntensity}
            rotation={hdriRotation}
            onRotationChange={setHdriRotation}
            background={true}
            onBackgroundChange={() => {}}
          />
        </div>
      )}

      {/* Environment Toggle Button */}
      <button
        onClick={() => setShowEnvironmentControls(!showEnvironmentControls)}
        className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors"
      >
        Environment Settings
      </button>
      </div>
    </WebGLErrorHandler>
  );
}

// Celebration Prop 3D Component
function CelebrationProp3D({ 
  prop, 
  isSelected, 
  onClick,
  culturalTheme 
}: { 
  prop: any; 
  isSelected: boolean; 
  onClick: () => void;
  culturalTheme: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Get color based on prop type and cultural theme
  const getPropColor = () => {
    if (prop.color) return prop.color;
    
    switch (prop.type) {
      case 'ceremonial':
        return culturalTheme === 'korean' ? '#ff6b6b' : culturalTheme === 'jewish' ? '#4dabf7' : '#ffd43b';
      case 'decor':
        return culturalTheme === 'mexican' ? '#ff8cc8' : '#69db7c';
      case 'entertainment':
        return '#74c0fc';
      case 'props':
        return '#fcc419';
      case 'seating':
        return '#8ce99a';
      case 'lighting':
        return '#ffe066';
      default:
        return '#868e96';
    }
  };

  // Get prop geometry based on type
  const getPropGeometry = () => {
    switch (prop.type) {
      case 'ceremonial':
        // Altar or ceremonial table - rectangular and elevated
        return <boxGeometry args={[prop.width, prop.height * 0.8, prop.depth || prop.width * 0.6]} />;
      case 'decor':
        // Decorative elements - varied shapes
        if (prop.name.toLowerCase().includes('balloon')) {
          return <sphereGeometry args={[prop.width * 0.3, 16, 16]} />;
        } else if (prop.name.toLowerCase().includes('arch')) {
          return <torusGeometry args={[prop.width * 0.4, prop.width * 0.1, 8, 32]} />;
        }
        return <boxGeometry args={[prop.width, prop.height, prop.depth || prop.width]} />;
      case 'entertainment':
        // Entertainment areas - platform-like
        return <cylinderGeometry args={[prop.width * 0.8, prop.width * 0.8, prop.height * 0.3, 16]} />;
      case 'props':
        // Display tables and prop areas
        return <boxGeometry args={[prop.width, prop.height * 0.6, prop.depth || prop.width * 0.8]} />;
      case 'seating':
        // Special seating arrangements
        return <boxGeometry args={[prop.width, prop.height * 0.4, prop.depth || prop.width * 0.5]} />;
      case 'lighting':
        // Lighting elements - tall and thin
        return <cylinderGeometry args={[prop.width * 0.1, prop.width * 0.1, prop.height, 8]} />;
      default:
        return <boxGeometry args={[prop.width, prop.height, prop.depth || prop.width]} />;
    }
  };

  return (
    <group
      position={[prop.x, (prop.z || 0) + prop.height / 2, prop.y]}
      rotation={[0, (prop.rotation * Math.PI) / 180, 0]}
      onClick={onClick}
    >
      <mesh 
        ref={meshRef}
        castShadow
        receiveShadow
      >
        {getPropGeometry()}
        <meshStandardMaterial 
          color={getPropColor()}
          transparent={prop.type === 'lighting'}
          opacity={prop.type === 'lighting' ? 0.7 : 1}
          roughness={0.3}
          metalness={prop.type === 'ceremonial' ? 0.2 : 0.1}
        />
      </mesh>
      
      {/* Selection indicator */}
      {isSelected && (
        <mesh>
          <boxGeometry args={[prop.width + 0.2, prop.height + 0.2, (prop.depth || prop.width) + 0.2]} />
          <meshBasicMaterial 
            color="#ff6b6b" 
            transparent 
            opacity={0.3} 
            wireframe 
          />
        </mesh>
      )}
      
      {/* Cultural significance indicator */}
      {prop.culturalSignificance && (
        <Html position={[0, prop.height * 0.6, 0]} center>
          <div className="bg-cultural-primary text-white px-2 py-1 rounded text-xs">
            Cultural
          </div>
        </Html>
      )}
      
      {/* Label */}
      <Html position={[0, prop.height + 0.5, 0]} center>
        <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs text-gray-800">
          {prop.name}
        </div>
      </Html>
    </group>
  );
}

// Physics-enabled scene content
function PhysicsSceneContent({
  roomDimensions,
  furnitureItems,
  celebrationProps,
  colorPalette,
  lightingPlan,
  selectedFurniture,
  selectedCelebrationProp,
  culturalTheme,
  enableSnapping,
  enableLOD,
  recommendedLODDistance,
  onFurnitureClick,
  onFurnitureMove,
  onCelebrationPropClick,
  enableWebGLOptimization
}: any) {
  return (
    <>
      {/* Physics Room Boundaries */}
      <PhysicsRoom 
        width={roomDimensions.length}
        height={roomDimensions.height}
        depth={roomDimensions.width}
      />

      {/* Enhanced Room with Cultural Theme */}
      <EventRoom
        width={roomDimensions.length}
        height={roomDimensions.height}
        depth={roomDimensions.width}
        colorPalette={colorPalette}
        culturalTheme={culturalTheme}
      />

      {/* Physics-enabled Furniture Items with LOD */}
      {furnitureItems.map((item: any) => (
        enableLOD ? (
          <LODFurniture
            key={item.id}
            category={item.category}
            position={[item.x, 0, item.y]}
            rotation={[0, (item.rotation * Math.PI) / 180, 0]}
            scale={[
              item.width / 2,
              getFurnitureHeight(item.category) / 2,
              item.height / 2
            ]}
            culturalTheme={culturalTheme}
            maxDistance={recommendedLODDistance}
            onPointerOver={() => {}}
            onPointerOut={() => {}}
            onClick={() => onFurnitureClick(item.id)}
          />
        ) : (
          <PhysicsFurnitureItem
            key={item.id}
            furniture={item}
            isSelected={selectedFurniture === item.id}
            onClick={() => onFurnitureClick(item.id)}
            onMove={(position) => onFurnitureMove(item.id, position)}
            culturalTheme={culturalTheme}
            enablePhysics={true}
            enableSnapping={enableSnapping}
            gridSize={0.5}
          />
        )
      ))}

      {/* Celebration Props */}
      {celebrationProps.map((prop: any) => (
        <CelebrationProp3D
          key={prop.id}
          prop={prop}
          isSelected={selectedCelebrationProp === prop.id}
          onClick={() => onCelebrationPropClick(prop.id)}
          culturalTheme={culturalTheme}
        />
      ))}
    </>
  );
}

// Standard scene content (fallback without physics)
// Helper function for furniture height
function getFurnitureHeight(category: string): number {
  switch (category) {
    case 'table':
    case 'desk':
      return 2.5;
    case 'chair':
    case 'seating':
      return 3;
    case 'sofa':
    case 'couch':
      return 2.8;
    case 'bed':
      return 2;
    case 'cabinet':
    case 'dresser':
      return 3.5;
    case 'bookshelf':
      return 6;
    default:
      return 2.5;
  }
}

function StandardSceneContent({
  roomDimensions,
  furnitureItems,
  celebrationProps,
  colorPalette,
  lightingPlan,
  selectedFurniture,
  selectedCelebrationProp,
  culturalTheme,
  enableLOD,
  recommendedLODDistance,
  onFurnitureClick,
  onFurnitureMove,
  onCelebrationPropClick,
  enableWebGLOptimization
}: any) {
  return (
    <>
      {/* Enhanced Room with Cultural Theme */}
      <EventRoom
        width={roomDimensions.length}
        height={roomDimensions.height}
        depth={roomDimensions.width}
        colorPalette={colorPalette}
        culturalTheme={culturalTheme}
      />

      {/* Standard Furniture Items with Optional LOD */}
      {furnitureItems.map((item: any) => (
        enableLOD ? (
          <LODFurniture
            key={item.id}
            category={item.category}
            position={[item.x, 0, item.y]}
            rotation={[0, (item.rotation * Math.PI) / 180, 0]}
            scale={[
              item.width / 2,
              getFurnitureHeight(item.category) / 2,
              item.height / 2
            ]}
            culturalTheme={culturalTheme}
            maxDistance={recommendedLODDistance}
            onPointerOver={() => {}}
            onPointerOut={() => {}}
            onClick={() => onFurnitureClick(item.id)}
          />
        ) : (
          <FurnitureItem3D
            key={item.id}
            furniture={item}
            isSelected={selectedFurniture === item.id}
            onClick={() => onFurnitureClick(item.id)}
            onMove={(position) => onFurnitureMove(item.id, position)}
            culturalTheme={culturalTheme}
          />
        )
      ))}

      {/* Celebration Props */}
      {celebrationProps.map((prop: any) => (
        <CelebrationProp3D
          key={prop.id}
          prop={prop}
          isSelected={selectedCelebrationProp === prop.id}
          onClick={() => onCelebrationPropClick(prop.id)}
          culturalTheme={culturalTheme}
        />
      ))}
    </>
  );
}