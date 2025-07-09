'use client';

import * as THREE from 'three';
import { useMemo } from 'react';

export interface TextureConfig {
  color: string;
  roughness: number;
  metalness: number;
  normalScale?: number;
  repeat?: [number, number];
}

export interface MaterialLibrary {
  [key: string]: TextureConfig;
}

// Material configurations for different surfaces
export const MATERIAL_LIBRARY: MaterialLibrary = {
  // Wood materials
  oak: {
    color: '#8B4513',
    roughness: 0.8,
    metalness: 0.1,
    repeat: [4, 4]
  },
  walnut: {
    color: '#654321',
    roughness: 0.7,
    metalness: 0.1,
    repeat: [4, 4]
  },
  pine: {
    color: '#DEB887',
    roughness: 0.9,
    metalness: 0.0,
    repeat: [4, 4]
  },
  bamboo: {
    color: '#F5F5DC',
    roughness: 0.6,
    metalness: 0.0,
    repeat: [6, 6]
  },

  // Fabric materials
  linen: {
    color: '#FAF0E6',
    roughness: 0.9,
    metalness: 0.0,
    repeat: [8, 8]
  },
  cotton: {
    color: '#F8F8FF',
    roughness: 0.85,
    metalness: 0.0,
    repeat: [6, 6]
  },
  velvet: {
    color: '#8B008B',
    roughness: 0.95,
    metalness: 0.0,
    repeat: [10, 10]
  },
  silk: {
    color: '#F0F8FF',
    roughness: 0.3,
    metalness: 0.1,
    repeat: [5, 5]
  },

  // Metal materials
  steel: {
    color: '#C0C0C0',
    roughness: 0.2,
    metalness: 0.9,
    repeat: [2, 2]
  },
  brass: {
    color: '#B5A642',
    roughness: 0.3,
    metalness: 0.8,
    repeat: [2, 2]
  },
  copper: {
    color: '#B87333',
    roughness: 0.4,
    metalness: 0.7,
    repeat: [2, 2]
  },

  // Stone materials
  marble: {
    color: '#F8F8FF',
    roughness: 0.1,
    metalness: 0.0,
    repeat: [2, 2]
  },
  granite: {
    color: '#696969',
    roughness: 0.6,
    metalness: 0.1,
    repeat: [3, 3]
  },

  // Floor materials
  hardwood: {
    color: '#8B4513',
    roughness: 0.7,
    metalness: 0.0,
    repeat: [8, 8]
  },
  carpet: {
    color: '#8B0000',
    roughness: 0.95,
    metalness: 0.0,
    repeat: [10, 10]
  },
  tile: {
    color: '#F5F5DC',
    roughness: 0.1,
    metalness: 0.0,
    repeat: [6, 6]
  },

  // Cultural theme materials
  'wabi-sabi-wood': {
    color: '#F5F5DC',
    roughness: 0.8,
    metalness: 0.1,
    repeat: [6, 6]
  },
  'hygge-birch': {
    color: '#FFE4B5',
    roughness: 0.6,
    metalness: 0.0,
    repeat: [4, 4]
  },
  'bella-figura-marble': {
    color: '#F0F8FF',
    roughness: 0.1,
    metalness: 0.0,
    repeat: [2, 2]
  },
  'savoir-vivre-mahogany': {
    color: '#C04000',
    roughness: 0.7,
    metalness: 0.1,
    repeat: [4, 4]
  }
};

// Procedural texture generators
export function createWoodTexture(width = 512, height = 512, color = '#8B4513'): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Wood grain pattern
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);

  // Add wood grain lines
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.lineWidth = 1;
  
  for (let i = 0; i < height; i += 8) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(width, i + Math.sin(i * 0.1) * 5);
    ctx.stroke();
  }

  // Add knots
  for (let i = 0; i < 5; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const radius = Math.random() * 20 + 10;
    
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

export function createFabricTexture(width = 512, height = 512, color = '#FAF0E6'): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Base fabric color
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);

  // Add fabric weave pattern
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.lineWidth = 1;

  // Horizontal threads
  for (let i = 0; i < height; i += 4) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(width, i);
    ctx.stroke();
  }

  // Vertical threads
  for (let i = 0; i < width; i += 4) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, height);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

export function createMetalTexture(width = 512, height = 512, color = '#C0C0C0'): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Base metal color
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);

  // Add brushed metal effect
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1;

  for (let i = 0; i < width; i += 2) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, height);
    ctx.stroke();
  }

  // Add subtle scratches
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
  for (let i = 0; i < 10; i++) {
    ctx.beginPath();
    ctx.moveTo(Math.random() * width, Math.random() * height);
    ctx.lineTo(Math.random() * width, Math.random() * height);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

export function createNormalMap(width = 512, height = 512, intensity = 0.5): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Create noise pattern for normal map
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const noise = Math.random() * intensity;
    data[i] = 128 + noise * 127;     // Red (X)
    data[i + 1] = 128 + noise * 127; // Green (Y)
    data[i + 2] = 255;               // Blue (Z - pointing up)
    data[i + 3] = 255;               // Alpha
  }

  ctx.putImageData(imageData, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// Hook for using textures in components
export function useTextureManager() {
  const textureCache = useMemo(() => new Map<string, THREE.Texture>(), []);
  
  const getTexture = (materialName: string): THREE.Texture => {
    if (textureCache.has(materialName)) {
      return textureCache.get(materialName)!;
    }

    let texture: THREE.Texture;
    
    if (materialName.includes('wood') || materialName.includes('oak') || 
        materialName.includes('walnut') || materialName.includes('pine') || 
        materialName.includes('bamboo') || materialName.includes('birch') || 
        materialName.includes('mahogany')) {
      texture = createWoodTexture(512, 512, MATERIAL_LIBRARY[materialName]?.color || '#8B4513');
    } else if (materialName.includes('fabric') || materialName.includes('linen') || 
               materialName.includes('cotton') || materialName.includes('velvet') || 
               materialName.includes('silk')) {
      texture = createFabricTexture(512, 512, MATERIAL_LIBRARY[materialName]?.color || '#FAF0E6');
    } else if (materialName.includes('metal') || materialName.includes('steel') || 
               materialName.includes('brass') || materialName.includes('copper')) {
      texture = createMetalTexture(512, 512, MATERIAL_LIBRARY[materialName]?.color || '#C0C0C0');
    } else {
      // Default wood texture
      texture = createWoodTexture(512, 512, MATERIAL_LIBRARY[materialName]?.color || '#8B4513');
    }

    textureCache.set(materialName, texture);
    return texture;
  };

  const getMaterial = (materialName: string): THREE.MeshStandardMaterial => {
    const config = MATERIAL_LIBRARY[materialName] || MATERIAL_LIBRARY.oak;
    const texture = getTexture(materialName);
    const normalMap = createNormalMap(512, 512, 0.3);

    const material = new THREE.MeshStandardMaterial({
      color: config.color,
      map: texture,
      normalMap: normalMap,
      roughness: config.roughness,
      metalness: config.metalness
    });

    if (config.repeat) {
      texture.repeat.set(config.repeat[0], config.repeat[1]);
      normalMap.repeat.set(config.repeat[0], config.repeat[1]);
    }

    return material;
  };

  const getCulturalMaterial = (culturalTheme: string, surfaceType: string): THREE.MeshStandardMaterial => {
    const materialKey = `${culturalTheme}-${surfaceType}`;
    if (MATERIAL_LIBRARY[materialKey]) {
      return getMaterial(materialKey);
    }
    
    // Fallback to theme-appropriate defaults
    switch (culturalTheme) {
      case 'wabi-sabi':
        return getMaterial('bamboo');
      case 'hygge':
        return getMaterial('pine');
      case 'bella-figura':
        return getMaterial('marble');
      case 'savoir-vivre':
        return getMaterial('walnut');
      default:
        return getMaterial('oak');
    }
  };

  return {
    getTexture,
    getMaterial,
    getCulturalMaterial,
    MATERIAL_LIBRARY
  };
}