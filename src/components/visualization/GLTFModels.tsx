'use client';

import { useMemo, Suspense } from 'react';
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
    url: '/models/furniture/dining-table.glb', 
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
  const gltf = useGLTF(modelConfig.url) as any;
  const scene = gltf?.scene;
  const error = gltf?.error;
  const surfaceType = getSurfaceType(category);
  const pbrMaterial = usePBRMaterial({ 
    materialType: 'oak-wood', 
    culturalTheme, 
    surfaceType 
  });

  // If model fails to load, use fallback
  if (error) {
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
  // Import our existing procedural furniture as fallback
  const { FurnitureModel } = require('./FurnitureModels');
  
  return (
    <FurnitureModel
      category={category}
      dimensions={{ width: scale[0] * 2, height: scale[1] * 2, depth: scale[2] * 2 }}
      position={position}
      rotation={rotation}
    />
  );
}

// Enhanced model loader with caching and preloading
export class GLTFModelManager {
  private static instance: GLTFModelManager;
  private modelCache: Map<string, any> = new Map();
  private loadingPromises: Map<string, Promise<any>> = new Map();
  
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

    const loadPromise = new Promise((resolve, reject) => {
      try {
        useGLTF.preload(modelConfig.url);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
    
    this.loadingPromises.set(category, loadPromise);
    
    try {
      await loadPromise;
      console.log(`Successfully preloaded model ${category}`);
    } catch (error) {
      console.warn(`Failed to preload model ${category}:`, error);
    } finally {
      this.loadingPromises.delete(category);
    }
  }

  async preloadCommonModels(): Promise<void> {
    const commonModels = ['chair', 'table', 'sofa', 'coffee-table', 'armchair'];
    await Promise.all(commonModels.map(model => this.preloadModel(model)));
  }

  getLoadedModel(category: string): any {
    return this.modelCache.get(category);
  }

  clearCache(): void {
    this.modelCache.clear();
    this.loadingPromises.clear();
  }
}

// Hook for using the model manager
export function useGLTFModelManager() {
  const manager = GLTFModelManager.getInstance();
  
  return {
    preloadModel: (category: string) => manager.preloadModel(category),
    preloadCommonModels: () => manager.preloadCommonModels(),
    getLoadedModel: (category: string) => manager.getLoadedModel(category),
    clearCache: () => manager.clearCache()
  };
}

// Preload models on component mount
export function ModelPreloader() {
  const { preloadCommonModels } = useGLTFModelManager();
  
  useMemo(() => {
    preloadCommonModels();
  }, [preloadCommonModels]);
  
  return null;
}