'use client';

import React, { useMemo, useCallback } from 'react';
import * as THREE from 'three';

// Cultural themes based on our research
export interface CulturalTheme {
  name: string;
  displayName: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    neutral: string;
    background: string;
  };
  materials: {
    roughness: number;
    metalness: number;
    opacity: number;
  };
  lighting: {
    ambient: {
      color: string;
      intensity: number;
    };
    directional: {
      color: string;
      intensity: number;
      position: [number, number, number];
    };
    accent: {
      color: string;
      intensity: number;
      spots: Array<{
        position: [number, number, number];
        target: [number, number, number];
        angle: number;
      }>;
    };
  };
  furniture: {
    defaultScale: number;
    preferredShapes: string[];
    materialPreferences: string[];
  };
  textures: {
    floor: string;
    wall: string;
    ceiling: string;
    fabric: string;
  };
}

// Cultural themes data
const CULTURAL_THEMES: Record<string, CulturalTheme> = {
  'wabi-sabi': {
    name: 'wabi-sabi',
    displayName: 'Wabi-Sabi (Japanese)',
    description: 'Embrace imperfection, impermanence, and incompleteness',
    colors: {
      primary: '#F5F5DC',    // Beige
      secondary: '#8B7355',  // Saddle brown
      accent: '#2F4F4F',     // Dark slate gray
      neutral: '#D2B48C',    // Tan
      background: '#FFF8DC'  // Cornsilk
    },
    materials: {
      roughness: 0.8,
      metalness: 0.1,
      opacity: 0.9
    },
    lighting: {
      ambient: {
        color: '#FFF8DC',
        intensity: 0.3
      },
      directional: {
        color: '#FFE4B5',
        intensity: 0.7,
        position: [10, 10, 5]
      },
      accent: {
        color: '#F5DEB3',
        intensity: 0.5,
        spots: [
          { position: [0, 8, 0], target: [0, 0, 0], angle: Math.PI / 4 }
        ]
      }
    },
    furniture: {
      defaultScale: 0.9,
      preferredShapes: ['organic', 'curved', 'asymmetrical'],
      materialPreferences: ['wood', 'bamboo', 'linen', 'cotton']
    },
    textures: {
      floor: 'bamboo-floor.jpg',
      wall: 'paper-wall.jpg',
      ceiling: 'wood-ceiling.jpg',
      fabric: 'linen-texture.jpg'
    }
  },
  
  'hygge': {
    name: 'hygge',
    displayName: 'Hygge (Scandinavian)',
    description: 'Cozy, comfortable, and content living',
    colors: {
      primary: '#FFE4B5',    // Moccasin
      secondary: '#DEB887',  // Burlywood
      accent: '#8B4513',     // Saddle brown
      neutral: '#F5F5F5',    // White smoke
      background: '#FFFAF0'  // Floral white
    },
    materials: {
      roughness: 0.6,
      metalness: 0.0,
      opacity: 1.0
    },
    lighting: {
      ambient: {
        color: '#FFFAF0',
        intensity: 0.4
      },
      directional: {
        color: '#FFE4B5',
        intensity: 0.8,
        position: [8, 12, 8]
      },
      accent: {
        color: '#DEB887',
        intensity: 0.6,
        spots: [
          { position: [-5, 6, -5], target: [-2, 0, -2], angle: Math.PI / 6 },
          { position: [5, 6, 5], target: [2, 0, 2], angle: Math.PI / 6 }
        ]
      }
    },
    furniture: {
      defaultScale: 1.0,
      preferredShapes: ['simple', 'clean', 'functional'],
      materialPreferences: ['light-wood', 'wool', 'cotton', 'linen']
    },
    textures: {
      floor: 'light-wood-floor.jpg',
      wall: 'white-wall.jpg',
      ceiling: 'wood-ceiling.jpg',
      fabric: 'wool-texture.jpg'
    }
  },
  
  'bella-figura': {
    name: 'bella-figura',
    displayName: 'Bella Figura (Italian)',
    description: 'Making a beautiful impression with style and elegance',
    colors: {
      primary: '#F5DEB3',    // Wheat
      secondary: '#CD853F',  // Peru
      accent: '#8B4513',     // Saddle brown
      neutral: '#FFF8DC',    // Cornsilk
      background: '#FFFAF0'  // Floral white
    },
    materials: {
      roughness: 0.3,
      metalness: 0.4,
      opacity: 1.0
    },
    lighting: {
      ambient: {
        color: '#FFFAF0',
        intensity: 0.5
      },
      directional: {
        color: '#F5DEB3',
        intensity: 1.0,
        position: [12, 15, 10]
      },
      accent: {
        color: '#CD853F',
        intensity: 0.8,
        spots: [
          { position: [0, 10, 0], target: [0, 0, 0], angle: Math.PI / 3 },
          { position: [-8, 8, -8], target: [-3, 0, -3], angle: Math.PI / 4 },
          { position: [8, 8, 8], target: [3, 0, 3], angle: Math.PI / 4 }
        ]
      }
    },
    furniture: {
      defaultScale: 1.1,
      preferredShapes: ['ornate', 'classical', 'elegant'],
      materialPreferences: ['marble', 'velvet', 'silk', 'leather']
    },
    textures: {
      floor: 'marble-floor.jpg',
      wall: 'elegant-wall.jpg',
      ceiling: 'decorative-ceiling.jpg',
      fabric: 'velvet-texture.jpg'
    }
  },
  
  'savoir-vivre': {
    name: 'savoir-vivre',
    displayName: 'Savoir-Vivre (French)',
    description: 'The art of living well with refined taste',
    colors: {
      primary: '#F0E68C',    // Khaki
      secondary: '#BDB76B',  // Dark khaki
      accent: '#8B4513',     // Saddle brown
      neutral: '#F5F5DC',    // Beige
      background: '#FFFAF0'  // Floral white
    },
    materials: {
      roughness: 0.4,
      metalness: 0.2,
      opacity: 1.0
    },
    lighting: {
      ambient: {
        color: '#FFFAF0',
        intensity: 0.4
      },
      directional: {
        color: '#F0E68C',
        intensity: 0.9,
        position: [10, 12, 8]
      },
      accent: {
        color: '#BDB76B',
        intensity: 0.7,
        spots: [
          { position: [0, 9, 0], target: [0, 0, 0], angle: Math.PI / 3 },
          { position: [-6, 7, 0], target: [-2, 0, 0], angle: Math.PI / 5 },
          { position: [6, 7, 0], target: [2, 0, 0], angle: Math.PI / 5 }
        ]
      }
    },
    furniture: {
      defaultScale: 1.0,
      preferredShapes: ['refined', 'classic', 'proportional'],
      materialPreferences: ['parquet', 'linen', 'silk', 'wrought-iron']
    },
    textures: {
      floor: 'parquet-floor.jpg',
      wall: 'refined-wall.jpg',
      ceiling: 'classic-ceiling.jpg',
      fabric: 'silk-texture.jpg'
    }
  },
  
  'modern': {
    name: 'modern',
    displayName: 'Modern Contemporary',
    description: 'Clean lines, minimalist design, and functional beauty',
    colors: {
      primary: '#FFFFFF',    // White
      secondary: '#F5F5F5',  // White smoke
      accent: '#4F46E5',     // Indigo
      neutral: '#9CA3AF',    // Gray
      background: '#FAFAFA'  // Light gray
    },
    materials: {
      roughness: 0.2,
      metalness: 0.8,
      opacity: 1.0
    },
    lighting: {
      ambient: {
        color: '#FFFFFF',
        intensity: 0.6
      },
      directional: {
        color: '#FFFFFF',
        intensity: 1.0,
        position: [10, 10, 10]
      },
      accent: {
        color: '#4F46E5',
        intensity: 0.8,
        spots: [
          { position: [0, 8, 0], target: [0, 0, 0], angle: Math.PI / 4 }
        ]
      }
    },
    furniture: {
      defaultScale: 1.0,
      preferredShapes: ['geometric', 'clean', 'minimal'],
      materialPreferences: ['metal', 'glass', 'leather', 'concrete']
    },
    textures: {
      floor: 'concrete-floor.jpg',
      wall: 'white-wall.jpg',
      ceiling: 'minimal-ceiling.jpg',
      fabric: 'leather-texture.jpg'
    }
  }
};

export class CulturalThemeManager {
  private currentTheme: CulturalTheme;
  private scene: THREE.Scene | null = null;
  
  constructor(themeName: string = 'modern') {
    this.currentTheme = CULTURAL_THEMES[themeName] || CULTURAL_THEMES['modern'];
  }
  
  setScene(scene: THREE.Scene) {
    this.scene = scene;
  }
  
  applyTheme(themeName: string) {
    const theme = CULTURAL_THEMES[themeName];
    if (!theme) return;
    
    this.currentTheme = theme;
    
    if (this.scene) {
      this.updateSceneBackground();
      this.updateMaterials();
      this.updateLighting();
    }
  }
  
  private updateSceneBackground() {
    if (!this.scene) return;
    
    this.scene.background = new THREE.Color(this.currentTheme.colors.background);
  }
  
  private updateMaterials() {
    if (!this.scene) return;
    
    this.scene.traverse((object) => {
      if (object instanceof THREE.Mesh && object.material) {
        if (object.userData.culturalThemeable) {
          const material = object.material as THREE.MeshStandardMaterial;
          material.color.setHex(parseInt(this.currentTheme.colors.primary.replace('#', '0x')));
          material.roughness = this.currentTheme.materials.roughness;
          material.metalness = this.currentTheme.materials.metalness;
          material.opacity = this.currentTheme.materials.opacity;
        }
      }
    });
  }
  
  private updateLighting() {
    if (!this.scene) return;
    
    // Remove existing lights
    const lightsToRemove: THREE.Light[] = [];
    this.scene.traverse((object) => {
      if (object instanceof THREE.Light && object.userData.culturalTheme) {
        lightsToRemove.push(object);
      }
    });
    lightsToRemove.forEach(light => this.scene!.remove(light));
    
    // Add new lights based on theme
    this.addThematicLighting();
  }
  
  private addThematicLighting() {
    if (!this.scene) return;
    
    const theme = this.currentTheme;
    
    // Ambient light
    const ambientLight = new THREE.AmbientLight(
      theme.lighting.ambient.color,
      theme.lighting.ambient.intensity
    );
    ambientLight.userData.culturalTheme = true;
    this.scene.add(ambientLight);
    
    // Directional light
    const directionalLight = new THREE.DirectionalLight(
      theme.lighting.directional.color,
      theme.lighting.directional.intensity
    );
    directionalLight.position.set(...theme.lighting.directional.position);
    directionalLight.castShadow = true;
    directionalLight.userData.culturalTheme = true;
    this.scene.add(directionalLight);
    
    // Accent spot lights
    theme.lighting.accent.spots.forEach((spot, index) => {
      const spotLight = new THREE.SpotLight(
        theme.lighting.accent.color,
        theme.lighting.accent.intensity,
        100,
        spot.angle,
        0.1,
        2
      );
      spotLight.position.set(...spot.position);
      spotLight.target.position.set(...spot.target);
      spotLight.castShadow = true;
      spotLight.userData.culturalTheme = true;
      
      this.scene!.add(spotLight);
      this.scene!.add(spotLight.target);
    });
  }
  
  getCurrentTheme(): CulturalTheme {
    return this.currentTheme;
  }
  
  getAvailableThemes(): CulturalTheme[] {
    return Object.values(CULTURAL_THEMES);
  }
  
  getThemeColors(): Record<string, string> {
    return this.currentTheme.colors;
  }
  
  getThemeMaterials(): Record<string, number> {
    return this.currentTheme.materials;
  }
  
  createThematicMaterial(baseColor?: string): THREE.MeshStandardMaterial {
    const color = baseColor || this.currentTheme.colors.primary;
    return new THREE.MeshStandardMaterial({
      color: color,
      roughness: this.currentTheme.materials.roughness,
      metalness: this.currentTheme.materials.metalness,
      opacity: this.currentTheme.materials.opacity
    });
  }
}

// React hook for using the cultural theme manager
export function useCulturalTheme(initialTheme: string = 'modern') {
  const themeManager = useMemo(() => new CulturalThemeManager(initialTheme), [initialTheme]);
  
  const applyTheme = useCallback((themeName: string) => {
    themeManager.applyTheme(themeName);
  }, [themeManager]);
  
  const getCurrentTheme = useCallback(() => {
    return themeManager.getCurrentTheme();
  }, [themeManager]);
  
  const getAvailableThemes = useCallback(() => {
    return themeManager.getAvailableThemes();
  }, [themeManager]);
  
  return {
    themeManager,
    applyTheme,
    getCurrentTheme,
    getAvailableThemes,
    currentTheme: themeManager.getCurrentTheme()
  };
}

// Theme selection component
interface ThemeSelectorProps {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
  className?: string;
}

export function ThemeSelector({ currentTheme, onThemeChange, className = '' }: ThemeSelectorProps) {
  const themes = Object.values(CULTURAL_THEMES);
  
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="text-sm font-medium text-gray-700 mb-2">Cultural Theme:</div>
      <div className="grid grid-cols-2 gap-2">
        {themes.map((theme) => (
          <button
            key={theme.name}
            onClick={() => onThemeChange(theme.name)}
            className={`p-2 text-left rounded-lg border transition-colors ${
              currentTheme === theme.name
                ? 'bg-blue-50 border-blue-500 text-blue-700'
                : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className="font-medium text-sm">{theme.displayName}</div>
            <div className="text-xs text-gray-500 mt-1">{theme.description}</div>
            <div className="flex space-x-1 mt-2">
              {Object.values(theme.colors).slice(0, 4).map((color, index) => (
                <div
                  key={index}
                  className="w-3 h-3 rounded-full border border-gray-300"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}