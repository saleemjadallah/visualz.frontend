'use client';

import React, { useState, useCallback, useRef } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import * as THREE from 'three';

// Furniture model configuration
interface FurnitureModelConfig {
  id: string;
  name: string;
  category: string;
  modelPath: string;
  scale: number;
  defaultPosition: [number, number, number];
  bounds: { width: number; height: number; depth: number };
  description: string;
  culturalThemes: string[];
  price?: number;
  thumbnail?: string;
}

// Predefined furniture models
const FURNITURE_MODELS: FurnitureModelConfig[] = [
  {
    id: 'round-table-modern',
    name: 'Modern Round Table',
    category: 'table',
    modelPath: '/models/furniture/round-table-modern.gltf',
    scale: 1.0,
    defaultPosition: [0, 0, 0],
    bounds: { width: 1.2, height: 0.75, depth: 1.2 },
    description: 'Contemporary round dining table with clean lines',
    culturalThemes: ['modern', 'hygge'],
    price: 450,
    thumbnail: '/images/furniture/round-table-modern-thumb.jpg'
  },
  {
    id: 'wabi-sabi-chair',
    name: 'Wabi-Sabi Chair',
    category: 'chair',
    modelPath: '/models/furniture/wabi-sabi-chair.gltf',
    scale: 1.0,
    defaultPosition: [0, 0, 0],
    bounds: { width: 0.6, height: 0.9, depth: 0.6 },
    description: 'Handcrafted wooden chair with natural imperfections',
    culturalThemes: ['wabi-sabi'],
    price: 280,
    thumbnail: '/images/furniture/wabi-sabi-chair-thumb.jpg'
  },
  {
    id: 'hygge-sofa',
    name: 'Hygge Comfort Sofa',
    category: 'seating',
    modelPath: '/models/furniture/hygge-sofa.gltf',
    scale: 1.0,
    defaultPosition: [0, 0, 0],
    bounds: { width: 2.0, height: 0.8, depth: 0.9 },
    description: 'Cozy Scandinavian-style sofa with soft cushions',
    culturalThemes: ['hygge'],
    price: 890,
    thumbnail: '/images/furniture/hygge-sofa-thumb.jpg'
  },
  {
    id: 'bella-figura-chandelier',
    name: 'Bella Figura Chandelier',
    category: 'lighting',
    modelPath: '/models/furniture/bella-figura-chandelier.gltf',
    scale: 1.0,
    defaultPosition: [0, 2.5, 0],
    bounds: { width: 0.8, height: 1.0, depth: 0.8 },
    description: 'Elegant Italian-inspired crystal chandelier',
    culturalThemes: ['bella-figura'],
    price: 1200,
    thumbnail: '/images/furniture/bella-figura-chandelier-thumb.jpg'
  },
  {
    id: 'savoir-vivre-cabinet',
    name: 'Savoir-Vivre Cabinet',
    category: 'storage',
    modelPath: '/models/furniture/savoir-vivre-cabinet.gltf',
    scale: 1.0,
    defaultPosition: [0, 0, 0],
    bounds: { width: 1.2, height: 1.8, depth: 0.4 },
    description: 'French-style cabinet with refined details',
    culturalThemes: ['savoir-vivre'],
    price: 750,
    thumbnail: '/images/furniture/savoir-vivre-cabinet-thumb.jpg'
  }
];

// Fallback geometries for when models aren't available
const FALLBACK_GEOMETRIES = {
  table: { geometry: 'box', args: [1.2, 0.1, 1.2] },
  chair: { geometry: 'box', args: [0.6, 1.2, 0.6] },
  seating: { geometry: 'box', args: [2.0, 0.8, 0.9] },
  lighting: { geometry: 'cylinder', args: [0.4, 0.4, 1.0, 8] },
  storage: { geometry: 'box', args: [1.2, 1.8, 0.4] },
  decoration: { geometry: 'sphere', args: [0.3, 8, 8] }
};

export class FurnitureLoader {
  private loader: GLTFLoader;
  private dracoLoader: DRACOLoader;
  private loadedModels: Map<string, THREE.Group> = new Map();
  private loadingPromises: Map<string, Promise<THREE.Group>> = new Map();
  
  constructor() {
    this.loader = new GLTFLoader();
    this.dracoLoader = new DRACOLoader();
    
    // Configure DRACO loader for compressed models
    this.dracoLoader.setDecoderPath('/draco/');
    this.loader.setDRACOLoader(this.dracoLoader);
  }
  
  async loadModel(modelPath: string, name: string): Promise<THREE.Group> {
    // Check if already loaded
    if (this.loadedModels.has(name)) {
      return this.loadedModels.get(name)!.clone();
    }
    
    // Check if currently loading
    if (this.loadingPromises.has(name)) {
      const model = await this.loadingPromises.get(name)!;
      return model.clone();
    }
    
    // Start loading
    const loadingPromise = new Promise<THREE.Group>((resolve, reject) => {
      this.loader.load(
        modelPath,
        (gltf) => {
          const model = gltf.scene;
          
          // Optimize the model
          this.optimizeModel(model);
          
          // Store the original
          this.loadedModels.set(name, model);
          this.loadingPromises.delete(name);
          
          resolve(model.clone());
        },
        (progress) => {
          // Handle loading progress
          console.log(`Loading ${name}: ${(progress.loaded / progress.total * 100)}%`);
        },
        (error) => {
          console.error(`Failed to load ${name}:`, error);
          this.loadingPromises.delete(name);
          reject(error);
        }
      );
    });
    
    this.loadingPromises.set(name, loadingPromise);
    return loadingPromise;
  }
  
  private optimizeModel(model: THREE.Group) {
    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Enable shadows
        child.castShadow = true;
        child.receiveShadow = true;
        
        // Optimize materials
        if (child.material) {
          const material = child.material as THREE.MeshStandardMaterial;
          if (material.map) {
            material.map.generateMipmaps = false;
            material.map.minFilter = THREE.LinearFilter;
          }
        }
        
        // Enable frustum culling
        child.frustumCulled = true;
      }
    });
  }
  
  createFallbackGeometry(category: string): THREE.Mesh {
    const config = FALLBACK_GEOMETRIES[category as keyof typeof FALLBACK_GEOMETRIES] || FALLBACK_GEOMETRIES.decoration;
    
    let geometry: THREE.BufferGeometry;
    
    switch (config.geometry) {
      case 'box':
        geometry = new THREE.BoxGeometry(...config.args);
        break;
      case 'cylinder':
        geometry = new THREE.CylinderGeometry(...config.args);
        break;
      case 'sphere':
        geometry = new THREE.SphereGeometry(...config.args);
        break;
      default:
        geometry = new THREE.BoxGeometry(1, 1, 1);
    }
    
    const material = new THREE.MeshLambertMaterial({
      color: this.getCategoryColor(category),
      transparent: true,
      opacity: 0.8
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    
    return mesh;
  }
  
  private getCategoryColor(category: string): string {
    const colors = {
      table: '#8B4513',
      chair: '#A0522D',
      seating: '#CD853F',
      lighting: '#FFD700',
      storage: '#DEB887',
      decoration: '#F0E68C'
    };
    return colors[category as keyof typeof colors] || '#8B7355';
  }
  
  dispose() {
    this.loadedModels.clear();
    this.loadingPromises.clear();
    this.dracoLoader.dispose();
  }
}

// React component for loading and displaying furniture
interface FurnitureModelProps {
  config: FurnitureModelConfig;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  isSelected?: boolean;
  onLoad?: (model: THREE.Group) => void;
  onError?: (error: Error) => void;
  onClick?: () => void;
}

export function FurnitureModel({
  config,
  position,
  rotation,
  scale,
  isSelected = false,
  onLoad,
  onError,
  onClick
}: FurnitureModelProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<Error | null>(null);
  const [useFallback, setUseFallback] = useState(false);
  const modelRef = useRef<THREE.Group>(null);
  
  const loader = useRef(new FurnitureLoader());
  
  // Load the model
  React.useEffect(() => {
    let mounted = true;
    
    const loadModel = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        
        const model = await loader.current.loadModel(config.modelPath, config.id);
        
        if (mounted) {
          setIsLoading(false);
          setUseFallback(false);
          onLoad?.(model);
        }
      } catch (error) {
        if (mounted) {
          console.warn(`Failed to load model ${config.name}, using fallback`);
          setLoadError(error as Error);
          setUseFallback(true);
          setIsLoading(false);
          onError?.(error as Error);
        }
      }
    };
    
    loadModel();
    
    return () => {
      mounted = false;
    };
  }, [config.modelPath, config.id, onLoad, onError]);
  
  // Cleanup
  React.useEffect(() => {
    return () => {
      loader.current.dispose();
    };
  }, []);
  
  if (isLoading) {
    return (
      <group position={position} rotation={rotation}>
        <mesh>
          <boxGeometry args={[config.bounds.width, config.bounds.height, config.bounds.depth]} />
          <meshBasicMaterial color="#cccccc" wireframe />
        </mesh>
      </group>
    );
  }
  
  if (useFallback) {
    const fallbackMesh = loader.current.createFallbackGeometry(config.category);
    
    return (
      <group
        ref={modelRef}
        position={position}
        rotation={rotation}
        scale={[scale, scale, scale]}
        onClick={onClick}
      >
        <primitive object={fallbackMesh} />
        
        {/* Selection indicator */}
        {isSelected && (
          <mesh position={[0, -config.bounds.height / 2 - 0.1, 0]}>
            <ringGeometry args={[config.bounds.width * 0.6, config.bounds.width * 0.8, 16]} />
            <meshBasicMaterial color="#4F46E5" transparent opacity={0.6} />
          </mesh>
        )}
      </group>
    );
  }
  
  // Try to load the actual model
  let gltf: any;
  try {
    gltf = useLoader(GLTFLoader, config.modelPath);
  } catch (error) {
    console.warn(`React Three Fiber loader failed for ${config.name}`);
    const fallbackMesh = loader.current.createFallbackGeometry(config.category);
    
    return (
      <group
        ref={modelRef}
        position={position}
        rotation={rotation}
        scale={[scale, scale, scale]}
        onClick={onClick}
      >
        <primitive object={fallbackMesh} />
        
        {isSelected && (
          <mesh position={[0, -config.bounds.height / 2 - 0.1, 0]}>
            <ringGeometry args={[config.bounds.width * 0.6, config.bounds.width * 0.8, 16]} />
            <meshBasicMaterial color="#4F46E5" transparent opacity={0.6} />
          </mesh>
        )}
      </group>
    );
  }
  
  return (
    <group
      ref={modelRef}
      position={position}
      rotation={rotation}
      scale={[scale, scale, scale]}
      onClick={onClick}
    >
      <primitive object={gltf.scene} />
      
      {/* Selection indicator */}
      {isSelected && (
        <mesh position={[0, -config.bounds.height / 2 - 0.1, 0]}>
          <ringGeometry args={[config.bounds.width * 0.6, config.bounds.width * 0.8, 16]} />
          <meshBasicMaterial color="#4F46E5" transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  );
}

// Hook for managing furniture library
export function useFurnitureLibrary(culturalTheme?: string) {
  const [availableModels, setAvailableModels] = useState<FurnitureModelConfig[]>(FURNITURE_MODELS);
  
  const getModelsByCategory = useCallback((category: string) => {
    return availableModels.filter(model => model.category === category);
  }, [availableModels]);
  
  const getModelsByTheme = useCallback((theme: string) => {
    return availableModels.filter(model => 
      model.culturalThemes.includes(theme) || model.culturalThemes.includes('modern')
    );
  }, [availableModels]);
  
  const getModelById = useCallback((id: string) => {
    return availableModels.find(model => model.id === id);
  }, [availableModels]);
  
  const filteredModels = React.useMemo(() => {
    if (!culturalTheme) return availableModels;
    return getModelsByTheme(culturalTheme);
  }, [availableModels, culturalTheme, getModelsByTheme]);
  
  return {
    availableModels: filteredModels,
    allModels: availableModels,
    getModelsByCategory,
    getModelsByTheme,
    getModelById,
    categories: [...new Set(availableModels.map(m => m.category))]
  };
}

// Furniture library panel component
interface FurnitureLibraryProps {
  culturalTheme?: string;
  onModelSelect: (config: FurnitureModelConfig) => void;
  className?: string;
}

export function FurnitureLibrary({ culturalTheme, onModelSelect, className = '' }: FurnitureLibraryProps) {
  const { availableModels, categories, getModelsByCategory } = useFurnitureLibrary(culturalTheme);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const displayModels = selectedCategory === 'all' 
    ? availableModels 
    : getModelsByCategory(selectedCategory);
  
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="space-y-2">
        <div className="text-sm font-medium text-gray-700">Furniture Library</div>
        
        {/* Category Filter */}
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2 py-1 text-xs rounded ${
              selectedCategory === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-2 py-1 text-xs rounded capitalize ${
                selectedCategory === category 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      {/* Models Grid */}
      <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
        {displayModels.map(model => (
          <button
            key={model.id}
            onClick={() => onModelSelect(model)}
            className="p-2 bg-white border border-gray-200 rounded hover:bg-gray-50 text-left"
          >
            <div className="text-xs font-medium text-gray-800">{model.name}</div>
            <div className="text-xs text-gray-500 mt-1">{model.category}</div>
            {model.price && (
              <div className="text-xs text-green-600 mt-1">${model.price}</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}