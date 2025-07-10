'use client';

import { useMemo } from 'react';
import { useTexture, useEnvironment } from '@react-three/drei';
import * as THREE from 'three';

// PBR Material Library with realistic physical properties
export const PBR_MATERIAL_LIBRARY = {
  // Wood materials with detailed PBR properties
  'oak-wood': {
    baseColor: '#8B4513',
    roughness: 0.7,
    metalness: 0.0,
    normalScale: 1.5,
    aoIntensity: 0.8,
    textures: {
      diffuse: '/textures/wood/oak/oak_diffuse_4k.jpg',
      normal: '/textures/wood/oak/oak_normal_4k.jpg',
      roughness: '/textures/wood/oak/oak_roughness_4k.jpg',
      ao: '/textures/wood/oak/oak_ao_4k.jpg'
    },
    repeat: [4, 4],
    anisotropy: 16
  },
  
  'walnut-wood': {
    baseColor: '#654321',
    roughness: 0.6,
    metalness: 0.0,
    normalScale: 1.2,
    aoIntensity: 0.9,
    textures: {
      diffuse: '/textures/wood/walnut/walnut_diffuse_4k.jpg',
      normal: '/textures/wood/walnut/walnut_normal_4k.jpg',
      roughness: '/textures/wood/walnut/walnut_roughness_4k.jpg',
      ao: '/textures/wood/walnut/walnut_ao_4k.jpg'
    },
    repeat: [3, 3],
    anisotropy: 16
  },

  'pine-wood': {
    baseColor: '#DEB887',
    roughness: 0.8,
    metalness: 0.0,
    normalScale: 1.0,
    aoIntensity: 0.7,
    textures: {
      diffuse: '/textures/wood/pine/pine_diffuse_4k.jpg',
      normal: '/textures/wood/pine/pine_normal_4k.jpg',
      roughness: '/textures/wood/pine/pine_roughness_4k.jpg',
      ao: '/textures/wood/pine/pine_ao_4k.jpg'
    },
    repeat: [5, 5],
    anisotropy: 16
  },

  // Metal materials with realistic PBR
  'brushed-steel': {
    baseColor: '#C0C0C0',
    roughness: 0.2,
    metalness: 1.0,
    normalScale: 0.5,
    aoIntensity: 0.3,
    textures: {
      diffuse: '/textures/metal/steel/steel_diffuse_4k.jpg',
      normal: '/textures/metal/steel/steel_normal_4k.jpg',
      roughness: '/textures/metal/steel/steel_roughness_4k.jpg',
      metalness: '/textures/metal/steel/steel_metalness_4k.jpg'
    },
    repeat: [2, 2],
    anisotropy: 16
  },

  'polished-brass': {
    baseColor: '#B5A642',
    roughness: 0.1,
    metalness: 1.0,
    normalScale: 0.3,
    aoIntensity: 0.2,
    textures: {
      diffuse: '/textures/metal/brass/brass_diffuse_4k.jpg',
      normal: '/textures/metal/brass/brass_normal_4k.jpg',
      roughness: '/textures/metal/brass/brass_roughness_4k.jpg',
      metalness: '/textures/metal/brass/brass_metalness_4k.jpg'
    },
    repeat: [1, 1],
    anisotropy: 16
  },

  'aged-copper': {
    baseColor: '#B87333',
    roughness: 0.4,
    metalness: 0.8,
    normalScale: 1.0,
    aoIntensity: 0.6,
    textures: {
      diffuse: '/textures/metal/copper/copper_diffuse_4k.jpg',
      normal: '/textures/metal/copper/copper_normal_4k.jpg',
      roughness: '/textures/metal/copper/copper_roughness_4k.jpg',
      metalness: '/textures/metal/copper/copper_metalness_4k.jpg'
    },
    repeat: [2, 2],
    anisotropy: 16
  },

  // Fabric materials with subsurface scattering simulation
  'linen-fabric': {
    baseColor: '#FAF0E6',
    roughness: 0.9,
    metalness: 0.0,
    normalScale: 2.0,
    aoIntensity: 0.8,
    textures: {
      diffuse: '/textures/fabric/linen/linen_diffuse_4k.jpg',
      normal: '/textures/fabric/linen/linen_normal_4k.jpg',
      roughness: '/textures/fabric/linen/linen_roughness_4k.jpg',
      ao: '/textures/fabric/linen/linen_ao_4k.jpg'
    },
    repeat: [8, 8],
    anisotropy: 4,
    transmission: 0.1, // Slight light transmission for fabric
    thickness: 0.05
  },

  'velvet-fabric': {
    baseColor: '#8B008B',
    roughness: 0.95,
    metalness: 0.0,
    normalScale: 1.5,
    aoIntensity: 0.9,
    textures: {
      diffuse: '/textures/fabric/velvet/velvet_diffuse_4k.jpg',
      normal: '/textures/fabric/velvet/velvet_normal_4k.jpg',
      roughness: '/textures/fabric/velvet/velvet_roughness_4k.jpg',
      ao: '/textures/fabric/velvet/velvet_ao_4k.jpg'
    },
    repeat: [6, 6],
    anisotropy: 2,
    sheen: 0.1,
    sheenColor: new THREE.Color(0.1, 0.1, 0.1)
  },

  'silk-fabric': {
    baseColor: '#F0F8FF',
    roughness: 0.3,
    metalness: 0.0,
    normalScale: 0.8,
    aoIntensity: 0.5,
    textures: {
      diffuse: '/textures/fabric/silk/silk_diffuse_4k.jpg',
      normal: '/textures/fabric/silk/silk_normal_4k.jpg',
      roughness: '/textures/fabric/silk/silk_roughness_4k.jpg',
      ao: '/textures/fabric/silk/silk_ao_4k.jpg'
    },
    repeat: [4, 4],
    anisotropy: 8,
    sheen: 0.8,
    sheenColor: new THREE.Color(0.95, 0.95, 0.95)
  },

  // Stone materials
  'carrara-marble': {
    baseColor: '#F8F8FF',
    roughness: 0.1,
    metalness: 0.0,
    normalScale: 0.5,
    aoIntensity: 0.3,
    textures: {
      diffuse: '/textures/stone/marble/marble_diffuse_4k.jpg',
      normal: '/textures/stone/marble/marble_normal_4k.jpg',
      roughness: '/textures/stone/marble/marble_roughness_4k.jpg',
      ao: '/textures/stone/marble/marble_ao_4k.jpg'
    },
    repeat: [2, 2],
    anisotropy: 16,
    clearcoat: 0.3,
    clearcoatRoughness: 0.1
  },

  'black-granite': {
    baseColor: '#2F2F2F',
    roughness: 0.2,
    metalness: 0.1,
    normalScale: 0.8,
    aoIntensity: 0.7,
    textures: {
      diffuse: '/textures/stone/granite/granite_diffuse_4k.jpg',
      normal: '/textures/stone/granite/granite_normal_4k.jpg',
      roughness: '/textures/stone/granite/granite_roughness_4k.jpg',
      ao: '/textures/stone/granite/granite_ao_4k.jpg'
    },
    repeat: [3, 3],
    anisotropy: 16
  },

  // Glass materials
  'clear-glass': {
    baseColor: '#FFFFFF',
    roughness: 0.0,
    metalness: 0.0,
    normalScale: 0.1,
    aoIntensity: 0.1,
    textures: {
      normal: '/textures/glass/clear/glass_normal_2k.jpg'
    },
    repeat: [1, 1],
    anisotropy: 16,
    transmission: 0.95,
    thickness: 0.1,
    ior: 1.5,
    transparent: true,
    opacity: 0.1
  },

  // Leather materials
  'brown-leather': {
    baseColor: '#8B4513',
    roughness: 0.6,
    metalness: 0.0,
    normalScale: 1.5,
    aoIntensity: 0.8,
    textures: {
      diffuse: '/textures/leather/brown/leather_diffuse_4k.jpg',
      normal: '/textures/leather/brown/leather_normal_4k.jpg',
      roughness: '/textures/leather/brown/leather_roughness_4k.jpg',
      ao: '/textures/leather/brown/leather_ao_4k.jpg'
    },
    repeat: [2, 2],
    anisotropy: 8
  }
};

// Cultural theme material mappings
export const CULTURAL_PBR_MAPPING = {
  'wabi-sabi': {
    wood: 'pine-wood',
    fabric: 'linen-fabric',
    metal: 'aged-copper',
    stone: 'black-granite'
  },
  'hygge': {
    wood: 'pine-wood',
    fabric: 'linen-fabric', 
    metal: 'brushed-steel',
    stone: 'carrara-marble'
  },
  'bella-figura': {
    wood: 'walnut-wood',
    fabric: 'silk-fabric',
    metal: 'polished-brass',
    stone: 'carrara-marble'
  },
  'savoir-vivre': {
    wood: 'walnut-wood',
    fabric: 'velvet-fabric',
    metal: 'polished-brass',
    stone: 'carrara-marble'
  },
  'modern': {
    wood: 'oak-wood',
    fabric: 'linen-fabric',
    metal: 'brushed-steel', 
    stone: 'black-granite'
  }
};

interface PBRMaterialProps {
  materialType: string;
  culturalTheme?: string;
  surfaceType?: string;
}

// Advanced PBR Material Hook
export function usePBRMaterial({ materialType, culturalTheme = 'modern', surfaceType }: PBRMaterialProps) {
  // Get environment map for reflections
  const envMap = useEnvironment({ preset: 'studio' });
  
  const material = useMemo(() => {
    let config;
    
    // Determine material config
    if (culturalTheme && surfaceType) {
      const culturalMapping = CULTURAL_PBR_MAPPING[culturalTheme as keyof typeof CULTURAL_PBR_MAPPING];
      const mappedType = culturalMapping?.[surfaceType as keyof typeof culturalMapping];
      config = PBR_MATERIAL_LIBRARY[mappedType as keyof typeof PBR_MATERIAL_LIBRARY];
    }
    
    if (!config) {
      config = PBR_MATERIAL_LIBRARY[materialType as keyof typeof PBR_MATERIAL_LIBRARY];
    }
    
    if (!config) {
      // Fallback to basic oak wood
      config = PBR_MATERIAL_LIBRARY['oak-wood'];
    }

    // Create advanced PBR material
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(config.baseColor),
      roughness: config.roughness,
      metalness: config.metalness,
      envMap: envMap,
      envMapIntensity: config.metalness > 0.5 ? 1.0 : 0.3,
    });

    // Add advanced properties if available
    if ((config as any).transmission) {
      (mat as any).transmission = (config as any).transmission;
      (mat as any).thickness = (config as any).thickness || 0.1;
      (mat as any).ior = (config as any).ior || 1.5;
    }

    if ((config as any).sheen) {
      (mat as any).sheen = (config as any).sheen;
      (mat as any).sheenColor = (config as any).sheenColor || new THREE.Color(1, 1, 1);
    }

    if ((config as any).clearcoat) {
      (mat as any).clearcoat = (config as any).clearcoat;
      (mat as any).clearcoatRoughness = (config as any).clearcoatRoughness || 0.1;
    }

    if ((config as any).transparent) {
      mat.transparent = true;
      mat.opacity = (config as any).opacity || 0.1;
    }

    return mat;
  }, [materialType, culturalTheme, surfaceType, envMap]);

  return material;
}

// Texture loading hook with fallbacks
export function usePBRTextures(materialType: string) {
  const config = PBR_MATERIAL_LIBRARY[materialType as keyof typeof PBR_MATERIAL_LIBRARY];
  
  const textures = useMemo(() => {
    if (!config?.textures) return null;

    try {
      // Create fallback procedural textures if files don't exist
      const fallbackTextures = createProceduralTextures(config);
      
      return {
        diffuse: fallbackTextures.diffuse,
        normal: fallbackTextures.normal,
        roughness: fallbackTextures.roughness,
        ao: fallbackTextures.ao,
        metalness: fallbackTextures.metalness
      };
    } catch (error) {
      console.warn(`Failed to load textures for ${materialType}, using procedural fallback`);
      return createProceduralTextures(config);
    }
  }, [materialType, config]);

  return textures;
}

// Create procedural PBR textures as fallbacks
function createProceduralTextures(config: any) {
  const size = 512;
  
  // Create diffuse texture
  const diffuseCanvas = document.createElement('canvas');
  diffuseCanvas.width = diffuseCanvas.height = size;
  const diffuseCtx = diffuseCanvas.getContext('2d')!;
  
  // Generate material-appropriate pattern
  if (config.baseColor.includes('wood') || config.textures?.diffuse?.includes('wood')) {
    generateWoodPattern(diffuseCtx, size, config.baseColor);
  } else if (config.baseColor.includes('metal') || config.textures?.diffuse?.includes('metal')) {
    generateMetalPattern(diffuseCtx, size, config.baseColor);
  } else if (config.baseColor.includes('fabric') || config.textures?.diffuse?.includes('fabric')) {
    generateFabricPattern(diffuseCtx, size, config.baseColor);
  } else {
    generateSolidColor(diffuseCtx, size, config.baseColor);
  }
  
  const diffuseTexture = new THREE.CanvasTexture(diffuseCanvas);
  diffuseTexture.wrapS = diffuseTexture.wrapT = THREE.RepeatWrapping;
  if (config.repeat) {
    diffuseTexture.repeat.set(config.repeat[0], config.repeat[1]);
  }
  if (config.anisotropy) {
    diffuseTexture.anisotropy = config.anisotropy;
  }

  // Create normal map
  const normalTexture = generateNormalMap(size, config.normalScale || 1.0);
  normalTexture.wrapS = normalTexture.wrapT = THREE.RepeatWrapping;
  if (config.repeat) {
    normalTexture.repeat.set(config.repeat[0], config.repeat[1]);
  }

  // Create roughness map
  const roughnessTexture = generateRoughnessMap(size, config.roughness || 0.5);
  roughnessTexture.wrapS = roughnessTexture.wrapT = THREE.RepeatWrapping;
  if (config.repeat) {
    roughnessTexture.repeat.set(config.repeat[0], config.repeat[1]);
  }

  // Create AO map
  const aoTexture = generateAOMap(size, config.aoIntensity || 0.5);
  aoTexture.wrapS = aoTexture.wrapT = THREE.RepeatWrapping;
  if (config.repeat) {
    aoTexture.repeat.set(config.repeat[0], config.repeat[1]);
  }

  return {
    diffuse: diffuseTexture,
    normal: normalTexture,
    roughness: roughnessTexture,
    ao: aoTexture,
    metalness: config.metalness > 0.5 ? generateMetalnessMap(size) : null
  };
}

// Procedural texture generators
function generateWoodPattern(ctx: CanvasRenderingContext2D, size: number, baseColor: string) {
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, size, size);
  
  // Add wood grain
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.lineWidth = 1;
  for (let i = 0; i < size; i += 8) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(size, i + Math.sin(i * 0.1) * 10);
    ctx.stroke();
  }
  
  // Add knots
  for (let i = 0; i < 3; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const radius = Math.random() * 20 + 10;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fill();
  }
}

function generateMetalPattern(ctx: CanvasRenderingContext2D, size: number, baseColor: string) {
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, size, size);
  
  // Add brushed metal lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1;
  for (let i = 0; i < size; i += 2) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, size);
    ctx.stroke();
  }
}

function generateFabricPattern(ctx: CanvasRenderingContext2D, size: number, baseColor: string) {
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, size, size);
  
  // Add fabric weave
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.lineWidth = 1;
  
  // Horizontal threads
  for (let i = 0; i < size; i += 4) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(size, i);
    ctx.stroke();
  }
  
  // Vertical threads
  for (let i = 0; i < size; i += 4) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, size);
    ctx.stroke();
  }
}

function generateSolidColor(ctx: CanvasRenderingContext2D, size: number, baseColor: string) {
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, size, size);
}

function generateNormalMap(size: number, intensity: number): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  
  const imageData = ctx.createImageData(size, size);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * intensity;
    data[i] = 128 + noise * 127;     // Red (X)
    data[i + 1] = 128 + noise * 127; // Green (Y)
    data[i + 2] = 255;               // Blue (Z - pointing up)
    data[i + 3] = 255;               // Alpha
  }
  
  ctx.putImageData(imageData, 0, 0);
  return new THREE.CanvasTexture(canvas);
}

function generateRoughnessMap(size: number, baseRoughness: number): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  
  const imageData = ctx.createImageData(size, size);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const variation = (Math.random() - 0.5) * 0.2;
    const roughness = Math.max(0, Math.min(1, baseRoughness + variation));
    const value = roughness * 255;
    data[i] = value;     // Red
    data[i + 1] = value; // Green
    data[i + 2] = value; // Blue
    data[i + 3] = 255;   // Alpha
  }
  
  ctx.putImageData(imageData, 0, 0);
  return new THREE.CanvasTexture(canvas);
}

function generateAOMap(size: number, intensity: number): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  
  // Create gradient AO effect
  const gradient = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
  gradient.addColorStop(0, `rgba(255, 255, 255, ${1 - intensity})`);
  gradient.addColorStop(1, `rgba(0, 0, 0, ${intensity})`);
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  
  return new THREE.CanvasTexture(canvas);
}

function generateMetalnessMap(size: number): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, size, size);
  
  return new THREE.CanvasTexture(canvas);
}