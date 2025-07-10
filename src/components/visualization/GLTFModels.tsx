'use client';

import { useMemo, Suspense, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { usePBRMaterial } from './PBRMaterials';

// GLTF Model Library - URLs to realistic 3D models
export const GLTF_MODEL_LIBRARY = {
  // Basic furniture models (using free/CC0 models from Sketchfab or similar)
  chair: {
    url: '/models/furniture/modern-chair.glb',
    fallback: 'chair',
    scale: [1, 1, 1],
    rotation: [0, 0, 0]
  },
  table: {
    url: '/models/furniture/dining-table-large.glb', 
    fallback: 'table',
    scale: [1, 1, 1],
    rotation: [0, 0, 0]
  },
  sofa: {
    url: '/models/furniture/modern-sofa.glb',
    fallback: 'sofa', 
    scale: [1, 1, 1],
    rotation: [0, 0, 0]
  },
  'coffee-table': {
    url: '/models/furniture/coffee-table.glb',
    fallback: 'coffee-table',
    scale: [1, 1, 1],
    rotation: [0, 0, 0]
  },
  armchair: {
    url: '/models/furniture/armchair.glb',
    fallback: 'armchair',
    scale: [1, 1, 1], 
    rotation: [0, 0, 0]
  },
  bookshelf: {
    url: '/models/furniture/bookshelf.glb',
    fallback: 'bookshelf',
    scale: [1, 1, 1],
    rotation: [0, 0, 0]
  },
  'side-table': {
    url: '/models/furniture/side-table.glb',
    fallback: 'side-table',
    scale: [1, 1, 1],
    rotation: [0, 0, 0]
  },
  'dining-table': {
    url: '/models/furniture/dining-table-large.glb',
    fallback: 'dining-table',
    scale: [1, 1, 1],
    rotation: [0, 0, 0]
  },
  bed: {
    url: '/models/furniture/modern-bed.glb',
    fallback: 'bed',
    scale: [1, 1, 1],
    rotation: [0, 0, 0]
  },
  cabinet: {
    url: '/models/furniture/storage-cabinet.glb',
    fallback: 'cabinet',
    scale: [1, 1, 1],
    rotation: [0, 0, 0]
  },
  // Event-specific furniture
  bar: {
    url: '/models/event/bar-counter.glb',
    fallback: 'bar',
    scale: [1, 1, 1],
    rotation: [0, 0, 0]
  },
  'bar-stool': {
    url: '/models/event/bar-stool.glb',
    fallback: 'bar-stool',
    scale: [1, 1, 1],
    rotation: [0, 0, 0]
  },
  stage: {
    url: '/models/event/stage-platform.glb',
    fallback: 'stage',
    scale: [1, 1, 1],
    rotation: [0, 0, 0]
  },
  piano: {
    url: '/models/event/grand-piano.glb',
    fallback: 'piano',
    scale: [1, 1, 1],
    rotation: [0, 0, 0]
  },
  // Decorative items
  plant: {
    url: '/models/decor/potted-plant.glb',
    fallback: 'plant',
    scale: [1, 1, 1],
    rotation: [0, 0, 0]
  },
  chandelier: {
    url: '/models/lighting/crystal-chandelier.glb',
    fallback: 'chandelier',
    scale: [1, 1, 1],
    rotation: [0, 0, 0]
  },
  mirror: {
    url: '/models/decor/wall-mirror.glb',
    fallback: 'mirror',
    scale: [1, 1, 1],
    rotation: [0, 0, 0]
  }
};

interface GLTFModelProps {
  category: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  culturalTheme?: string;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
  onClick?: (event?: any) => void;
}

// GLTF Model Component
export function GLTFModel({ 
  category, 
  position = [0, 0, 0], 
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  culturalTheme = 'modern',
  onPointerOver,
  onPointerOut,
  onClick
}: GLTFModelProps) {
  const modelConfig = GLTF_MODEL_LIBRARY[category as keyof typeof GLTF_MODEL_LIBRARY];
  
  if (!modelConfig) {
    // Fallback to our procedural furniture
    return <FallbackFurniture category={category} position={position} rotation={rotation} scale={scale} />;
  }

  return (
    <Suspense fallback={<FallbackFurniture category={category} position={position} rotation={rotation} scale={scale} />}>
      <LoadedGLTFModel 
        modelConfig={modelConfig}
        category={category}
        position={position}
        rotation={rotation}
        scale={scale}
        culturalTheme={culturalTheme}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
        onClick={onClick}
      />
    </Suspense>
  );
}

// Component for loaded GLTF models
function LoadedGLTFModel({ 
  modelConfig, 
  category,
  position, 
  rotation, 
  scale,
  culturalTheme,
  onPointerOver,
  onPointerOut,
  onClick
}: any) {
  let gltf, scene, error;
  
  try {
    gltf = useGLTF(modelConfig.url) as any;
    scene = gltf?.scene;
    error = gltf?.error;
  } catch (loadError) {
    console.warn(`Failed to load GLTF model for ${category}:`, loadError);
    return <FallbackFurniture category={category} position={position} rotation={rotation} scale={scale} />;
  }

  const surfaceType = getSurfaceType(category);
  let pbrMaterial;
  
  try {
    pbrMaterial = usePBRMaterial({ 
      materialType: 'oak-wood', 
      culturalTheme, 
      surfaceType 
    });
  } catch (materialError) {
    console.warn(`Failed to create PBR material for ${category}:`, materialError);
    // Create a basic material as fallback
    pbrMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
  }

  // If model fails to load, use fallback
  if (error || !scene) {
    console.warn(`Failed to load GLTF model for ${category}:`, error);
    return <FallbackFurniture category={category} position={position} rotation={rotation} scale={scale} />;
  }

  const modelClone = useMemo(() => {
    if (!scene) return null;
    
    const clone = scene.clone();
    
    // Apply cultural theme materials to the model
    clone.traverse((child: any) => {
      if (child instanceof THREE.Mesh) {
        // Enable shadows
        child.castShadow = true;
        child.receiveShadow = true;
        
        // Apply PBR cultural material theme
        if (child.material) {
          try {
            // Use our PBR material with cultural theming
            child.material = pbrMaterial.clone();
          } catch (e) {
            // Keep original material if PBR material fails
            console.warn('Failed to apply PBR material:', e);
          }
        }
      }
    });
    
    return clone;
  }, [scene, culturalTheme, pbrMaterial]);

  if (!modelClone) return <FallbackFurniture category={category} position={position} rotation={rotation} scale={scale} />;

  const finalScale = [
    scale[0] * modelConfig.scale[0],
    scale[1] * modelConfig.scale[1], 
    scale[2] * modelConfig.scale[2]
  ] as [number, number, number];

  const finalRotation = [
    rotation[0] + modelConfig.rotation[0],
    rotation[1] + modelConfig.rotation[1],
    rotation[2] + modelConfig.rotation[2]
  ] as [number, number, number];

  return (
    <primitive 
      object={modelClone}
      position={position}
      rotation={finalRotation}
      scale={finalScale}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      onClick={onClick}
    />
  );
}

// Helper function to determine surface type from material name
function getSurfaceType(materialName: string): string {
  const name = materialName.toLowerCase();
  
  if (name.includes('wood') || name.includes('oak') || name.includes('pine')) return 'wood';
  if (name.includes('fabric') || name.includes('cloth') || name.includes('cushion')) return 'fabric';
  if (name.includes('metal') || name.includes('steel') || name.includes('brass')) return 'metal';
  if (name.includes('marble') || name.includes('stone') || name.includes('granite')) return 'stone';
  if (name.includes('glass') || name.includes('crystal')) return 'glass';
  if (name.includes('leather')) return 'leather';
  
  // Default based on furniture category
  if (name.includes('table') || name.includes('chair') || name.includes('cabinet')) return 'wood';
  if (name.includes('sofa') || name.includes('cushion') || name.includes('pillow')) return 'fabric';
  
  return 'wood'; // Default fallback
}

// Fallback component when GLTF models fail to load
function FallbackFurniture({ category, position, rotation, scale }: any) {
  // Create appropriate furniture component based on category
  const furnitureComponent = useMemo(() => {
    switch (category) {
      case 'chair':
        return <ChairFallback />;
      case 'table':
      case 'dining-table':
        return <TableFallback />;
      case 'sofa':
        return <SofaFallback />;
      case 'coffee-table':
        return <CoffeeTableFallback />;
      case 'armchair':
        return <ArmchairFallback />;
      case 'bookshelf':
        return <BookshelfFallback />;
      case 'bar':
        return <BarFallback />;
      case 'bar-stool':
        return <BarStoolFallback />;
      case 'stage':
        return <StageFallback />;
      case 'plant':
        return <PlantFallback />;
      default:
        return <DefaultFallback />;
    }
  }, [category]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {furnitureComponent}
    </group>
  );
}

// Fallback furniture components
function ChairFallback() {
  return (
    <group>
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[1, 0.1, 1]} />
        <meshStandardMaterial color={0x8B4513} roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.2, -0.45]} castShadow receiveShadow>
        <boxGeometry args={[1, 1.5, 0.1]} />
        <meshStandardMaterial color={0x8B4513} roughness={0.8} />
      </mesh>
    </group>
  );
}

function TableFallback() {
  return (
    <mesh position={[0, 1, 0]} castShadow receiveShadow>
      <boxGeometry args={[2, 0.1, 1]} />
      <meshStandardMaterial color={0x8B4513} roughness={0.8} />
    </mesh>
  );
}

function SofaFallback() {
  return (
    <group>
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 0.8, 1.5]} />
        <meshStandardMaterial color={0x4A5568} roughness={0.9} />
      </mesh>
      <mesh position={[0, 1, -0.6]} castShadow receiveShadow>
        <boxGeometry args={[3, 1.2, 0.3]} />
        <meshStandardMaterial color={0x4A5568} roughness={0.9} />
      </mesh>
    </group>
  );
}

function CoffeeTableFallback() {
  return (
    <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
      <boxGeometry args={[1.5, 0.1, 1]} />
      <meshStandardMaterial color={0x8B4513} roughness={0.8} />
    </mesh>
  );
}

function ArmchairFallback() {
  return (
    <group>
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.1, 1.2]} />
        <meshStandardMaterial color={0x8B4513} roughness={0.8} />
      </mesh>
      <mesh position={[0, 1, -0.5]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 1, 0.1]} />
        <meshStandardMaterial color={0x8B4513} roughness={0.8} />
      </mesh>
    </group>
  );
}

function BookshelfFallback() {
  return (
    <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
      <boxGeometry args={[1.5, 3, 0.5]} />
      <meshStandardMaterial color={0x8B4513} roughness={0.8} />
    </mesh>
  );
}

function BarFallback() {
  return (
    <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
      <boxGeometry args={[3, 1.2, 1]} />
      <meshStandardMaterial color={0x654321} roughness={0.8} />
    </mesh>
  );
}

function BarStoolFallback() {
  return (
    <group>
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.1]} />
        <meshStandardMaterial color={0x8B4513} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.05, 0.05, 1]} />
        <meshStandardMaterial color={0x666666} roughness={0.3} metalness={0.8} />
      </mesh>
    </group>
  );
}

function StageFallback() {
  return (
    <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
      <boxGeometry args={[4, 0.5, 3]} />
      <meshStandardMaterial color={0x2D3748} roughness={0.9} />
    </mesh>
  );
}

function PlantFallback() {
  return (
    <group>
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.25, 0.4]} />
        <meshStandardMaterial color={0x8B4513} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.4]} />
        <meshStandardMaterial color={0x228B22} roughness={0.9} />
      </mesh>
    </group>
  );
}

function DefaultFallback() {
  return (
    <mesh castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={0x888888} roughness={0.8} />
    </mesh>
  );
}

// Enhanced model loader with caching and preloading
export class GLTFModelManager {
  private static instance: GLTFModelManager;
  private modelCache: Map<string, any> = new Map();
  private loadingPromises: Map<string, Promise<any>> = new Map();
  private preloadQueue: Set<string> = new Set();
  private maxConcurrentLoads = 3;
  private currentLoads = 0;
  
  static getInstance(): GLTFModelManager {
    if (!GLTFModelManager.instance) {
      GLTFModelManager.instance = new GLTFModelManager();
    }
    return GLTFModelManager.instance;
  }

  async preloadModel(category: string): Promise<void> {
    const modelConfig = GLTF_MODEL_LIBRARY[category as keyof typeof GLTF_MODEL_LIBRARY];
    if (!modelConfig || this.modelCache.has(category)) return;

    if (this.loadingPromises.has(category)) {
      await this.loadingPromises.get(category);
      return;
    }

    // Queue management for concurrent loads
    if (this.currentLoads >= this.maxConcurrentLoads) {
      this.preloadQueue.add(category);
      return;
    }

    this.currentLoads++;
    
    const loadPromise = this.performModelLoad(category, modelConfig.url);
    this.loadingPromises.set(category, loadPromise);
    
    try {
      await loadPromise;
      console.log(`Successfully preloaded model ${category}`);
    } catch (error) {
      console.warn(`Failed to preload model ${category}:`, error);
    } finally {
      this.loadingPromises.delete(category);
      this.currentLoads--;
      this.processQueue();
    }
  }

  private async performModelLoad(category: string, url: string): Promise<void> {
    try {
      // Check if file exists first
      const response = await fetch(url, { method: 'HEAD' });
      if (!response.ok) {
        throw new Error(`Model file not found: ${url} (${response.status})`);
      }

      // Preload the GLTF model
      await new Promise((resolve, reject) => {
        try {
          useGLTF.preload(url);
          resolve(true);
        } catch (error) {
          reject(error);
        }
      });

      this.modelCache.set(category, { status: 'loaded', url });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.modelCache.set(category, { status: 'error', url, error: errorMessage });
      throw error;
    }
  }

  private processQueue(): void {
    if (this.preloadQueue.size > 0 && this.currentLoads < this.maxConcurrentLoads) {
      const nextCategory = this.preloadQueue.values().next().value;
      if (nextCategory) {
        this.preloadQueue.delete(nextCategory);
        this.preloadModel(nextCategory);
      }
    }
  }

  async preloadCommonModels(): Promise<void> {
    const commonModels = ['chair', 'table', 'sofa', 'coffee-table', 'armchair'];
    await Promise.all(commonModels.map(model => this.preloadModel(model)));
  }

  async preloadAllModels(): Promise<void> {
    const allCategories = Object.keys(GLTF_MODEL_LIBRARY);
    const batchSize = 5;
    
    for (let i = 0; i < allCategories.length; i += batchSize) {
      const batch = allCategories.slice(i, i + batchSize);
      await Promise.allSettled(batch.map(category => this.preloadModel(category)));
      
      // Small delay between batches to avoid overwhelming the browser
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  getLoadedModel(category: string): any {
    return this.modelCache.get(category);
  }

  getModelStats(): { total: number; loaded: number; errors: number; pending: number } {
    const total = Object.keys(GLTF_MODEL_LIBRARY).length;
    const cached = Array.from(this.modelCache.values());
    const loaded = cached.filter(c => c.status === 'loaded').length;
    const errors = cached.filter(c => c.status === 'error').length;
    const pending = this.loadingPromises.size + this.preloadQueue.size;

    return { total, loaded, errors, pending };
  }

  clearCache(): void {
    this.modelCache.clear();
    this.loadingPromises.clear();
    this.preloadQueue.clear();
    this.currentLoads = 0;
  }

  isModelAvailable(category: string): boolean {
    const cached = this.modelCache.get(category);
    return cached?.status === 'loaded';
  }

  getModelError(category: string): string | null {
    const cached = this.modelCache.get(category);
    return cached?.status === 'error' ? cached.error : null;
  }
}

// Hook for using the model manager
export function useGLTFModelManager() {
  const manager = GLTFModelManager.getInstance();
  
  return {
    preloadModel: (category: string) => manager.preloadModel(category),
    preloadCommonModels: () => manager.preloadCommonModels(),
    preloadAllModels: () => manager.preloadAllModels(),
    getLoadedModel: (category: string) => manager.getLoadedModel(category),
    getModelStats: () => manager.getModelStats(),
    isModelAvailable: (category: string) => manager.isModelAvailable(category),
    getModelError: (category: string) => manager.getModelError(category),
    clearCache: () => manager.clearCache()
  };
}

// Enhanced preloader with progress tracking
export function ModelPreloader({ preloadAll = false }: { preloadAll?: boolean }) {
  const { preloadCommonModels, preloadAllModels, getModelStats } = useGLTFModelManager();
  const [stats, setStats] = useState(getModelStats());
  const [isPreloading, setIsPreloading] = useState(false);
  
  const updateStats = () => {
    const newStats = getModelStats();
    setStats(newStats);
    return newStats;
  };

  useMemo(() => {
    const performPreload = async () => {
      setIsPreloading(true);
      try {
        if (preloadAll) {
          await preloadAllModels();
        } else {
          await preloadCommonModels();
        }
      } catch (error) {
        console.warn('Model preloading failed:', error);
      } finally {
        setIsPreloading(false);
        updateStats();
      }
    };

    performPreload();
  }, [preloadCommonModels, preloadAllModels, preloadAll]);

  // Update stats periodically during preloading
  useMemo(() => {
    if (!isPreloading) return;

    const interval = setInterval(updateStats, 1000);
    return () => clearInterval(interval);
  }, [isPreloading]);
  
  return null;
}

// Model installation guide component
export function ModelInstallationGuide() {
  const { getModelStats } = useGLTFModelManager();
  const [stats, setStats] = useState(getModelStats());
  const [showInstructions, setShowInstructions] = useState(false);

  const missingModels = Object.entries(GLTF_MODEL_LIBRARY).filter(([category]) => {
    const manager = GLTFModelManager.getInstance();
    const cached = manager.getLoadedModel(category);
    return !cached || cached.status === 'error';
  });

  const updateStats = () => setStats(getModelStats());

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">3D Models Setup</h3>
        <button
          onClick={updateStats}
          className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
        >
          Refresh
        </button>
      </div>

      {/* Progress indicator */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Models Available</span>
          <span>{stats.loaded} / {stats.total}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(stats.loaded / stats.total) * 100}%` }}
          ></div>
        </div>
      </div>

      {missingModels.length > 0 && (
        <div className="mb-4">
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className="flex items-center space-x-2 text-yellow-700 hover:text-yellow-800"
          >
            <span>⚠</span>
            <span className="text-sm font-medium">
              {missingModels.length} models need to be installed
            </span>
            <span className="text-xs">{showInstructions ? '▼' : '▶'}</span>
          </button>

          {showInstructions && (
            <div className="mt-3 p-3 bg-yellow-50 rounded border border-yellow-200">
              <h4 className="font-medium text-yellow-800 mb-2">Installation Instructions:</h4>
              <ol className="text-sm text-yellow-700 space-y-1 ml-4">
                <li>1. Download GLB models from recommended sources:</li>
                <li className="ml-4">
                  • <a href="https://sketchfab.com/" target="_blank" className="underline hover:text-yellow-900">Sketchfab</a> (search for furniture)
                </li>
                <li className="ml-4">
                  • <a href="https://poly.pizza/" target="_blank" className="underline hover:text-yellow-900">Google Poly Archive</a>
                </li>
                <li className="ml-4">
                  • <a href="https://kenney.nl/assets" target="_blank" className="underline hover:text-yellow-900">Kenney Assets</a>
                </li>
                <li>2. Place files in <code className="bg-yellow-100 px-1 rounded">/public/models/</code> with exact names:</li>
              </ol>
              
              <div className="mt-3 max-h-32 overflow-y-auto">
                <div className="text-xs space-y-1">
                  {missingModels.map(([category, config]) => (
                    <div key={category} className="flex justify-between items-center p-1 bg-white rounded">
                      <span className="font-mono text-gray-800">{config.url.replace('/models/', '')}</span>
                      <span className="text-gray-500">({category})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {stats.loaded === stats.total && (
        <div className="flex items-center space-x-2 text-green-700 bg-green-50 p-2 rounded">
          <span>✓</span>
          <span className="text-sm font-medium">All models installed and ready!</span>
        </div>
      )}
    </div>
  );
}