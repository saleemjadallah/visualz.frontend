'use client';

import React, { useEffect, useState } from 'react';
import * as THREE from 'three';

// Cultural Theme-Specific WebGL Rendering Settings
export class CulturalThemeRenderer {
  private renderer: THREE.WebGLRenderer;
  private currentTheme: string = 'modern';
  private themes: Map<string, ThemeConfiguration>;

  constructor(renderer: THREE.WebGLRenderer) {
    this.renderer = renderer;
    this.themes = new Map();
    this.initializeThemes();
  }

  private initializeThemes() {
    // Wabi-Sabi: Japanese aesthetic of imperfect beauty
    this.themes.set('wabi-sabi', {
      name: 'Wabi-Sabi',
      description: 'Japanese aesthetic embracing imperfection and transience',
      rendering: {
        toneMapping: THREE.LinearToneMapping,
        toneMappingExposure: 0.8,
        shadowType: THREE.PCFShadowMap,
        colorSpace: THREE.SRGBColorSpace,
        shadowBias: -0.0005,
        shadowIntensity: 0.6
      },
      lighting: {
        ambientIntensity: 0.3,
        directionalIntensity: 0.7,
        colorTemperature: 3200, // Warm
        shadowSoftness: 0.8
      },
      materials: {
        roughnessMultiplier: 1.2,
        metalnessReduction: 0.8,
        saturationReduction: 0.9,
        imperfectionIntensity: 0.3
      },
      effects: {
        enableVignette: true,
        enableFilmGrain: true,
        bloomThreshold: 0.9,
        bloomStrength: 0.2
      }
    });

    // Hygge: Danish cozy comfort
    this.themes.set('hygge', {
      name: 'Hygge',
      description: 'Danish concept of cozy contentment',
      rendering: {
        toneMapping: THREE.CineonToneMapping,
        toneMappingExposure: 1.1,
        shadowType: THREE.PCFSoftShadowMap,
        colorSpace: THREE.SRGBColorSpace,
        shadowBias: -0.0003,
        shadowIntensity: 0.5
      },
      lighting: {
        ambientIntensity: 0.4,
        directionalIntensity: 0.6,
        colorTemperature: 2700, // Very warm
        shadowSoftness: 1.0
      },
      materials: {
        roughnessMultiplier: 1.1,
        metalnessReduction: 0.9,
        saturationReduction: 1.0,
        imperfectionIntensity: 0.1
      },
      effects: {
        enableVignette: false,
        enableFilmGrain: false,
        bloomThreshold: 0.8,
        bloomStrength: 0.3
      }
    });

    // Bella Figura: Italian elegance and style
    this.themes.set('bella-figura', {
      name: 'Bella Figura',
      description: 'Italian aesthetic of making a beautiful impression',
      rendering: {
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.3,
        shadowType: THREE.PCFSoftShadowMap,
        colorSpace: THREE.SRGBColorSpace,
        shadowBias: -0.0002,
        shadowIntensity: 0.7
      },
      lighting: {
        ambientIntensity: 0.2,
        directionalIntensity: 1.0,
        colorTemperature: 5500, // Neutral to cool
        shadowSoftness: 0.6
      },
      materials: {
        roughnessMultiplier: 0.8,
        metalnessReduction: 1.2,
        saturationReduction: 1.1,
        imperfectionIntensity: 0.05
      },
      effects: {
        enableVignette: false,
        enableFilmGrain: false,
        bloomThreshold: 0.7,
        bloomStrength: 0.4
      }
    });

    // Savoir-Vivre: French art of living well
    this.themes.set('savoir-vivre', {
      name: 'Savoir-Vivre',
      description: 'French art of living well with refinement',
      rendering: {
        toneMapping: THREE.ReinhardToneMapping,
        toneMappingExposure: 1.2,
        shadowType: THREE.PCFSoftShadowMap,
        colorSpace: THREE.SRGBColorSpace,
        shadowBias: -0.0001,
        shadowIntensity: 0.6
      },
      lighting: {
        ambientIntensity: 0.25,
        directionalIntensity: 0.9,
        colorTemperature: 4500, // Neutral warm
        shadowSoftness: 0.7
      },
      materials: {
        roughnessMultiplier: 0.9,
        metalnessReduction: 1.0,
        saturationReduction: 1.05,
        imperfectionIntensity: 0.1
      },
      effects: {
        enableVignette: true,
        enableFilmGrain: false,
        bloomThreshold: 0.75,
        bloomStrength: 0.35
      }
    });

    // Modern: Contemporary clean aesthetic
    this.themes.set('modern', {
      name: 'Modern',
      description: 'Contemporary minimalist aesthetic',
      rendering: {
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.0,
        shadowType: THREE.PCFSoftShadowMap,
        colorSpace: THREE.SRGBColorSpace,
        shadowBias: -0.0003,
        shadowIntensity: 0.8
      },
      lighting: {
        ambientIntensity: 0.3,
        directionalIntensity: 0.8,
        colorTemperature: 6500, // Cool daylight
        shadowSoftness: 0.5
      },
      materials: {
        roughnessMultiplier: 1.0,
        metalnessReduction: 1.0,
        saturationReduction: 1.0,
        imperfectionIntensity: 0.0
      },
      effects: {
        enableVignette: false,
        enableFilmGrain: false,
        bloomThreshold: 0.8,
        bloomStrength: 0.3
      }
    });
  }

  applyTheme(themeName: string) {
    const theme = this.themes.get(themeName);
    if (!theme) {
      console.warn(`Theme '${themeName}' not found, using modern theme`);
      this.applyTheme('modern');
      return;
    }

    this.currentTheme = themeName;
    this.applyRenderingSettings(theme.rendering);
    
    console.log(`Applied cultural theme: ${theme.name}`);
  }

  private applyRenderingSettings(settings: any) {
    // Apply tone mapping
    this.renderer.toneMapping = settings.toneMapping;
    this.renderer.toneMappingExposure = settings.toneMappingExposure;
    
    // Apply shadow settings
    this.renderer.shadowMap.type = settings.shadowType;
    
    // Apply color space
    this.renderer.outputColorSpace = settings.colorSpace;
  }

  // Apply theme-specific lighting to a scene
  applyThemeLighting(scene: THREE.Scene, themeName?: string): THREE.Light[] {
    const theme = this.themes.get(themeName || this.currentTheme);
    if (!theme) return [];

    const lights: THREE.Light[] = [];
    
    // Remove existing lights
    const existingLights = scene.children.filter(child => child instanceof THREE.Light);
    existingLights.forEach(light => scene.remove(light));

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(
      this.kelvinToRGB(theme.lighting.colorTemperature),
      theme.lighting.ambientIntensity
    );
    scene.add(ambientLight);
    lights.push(ambientLight);

    // Add main directional light
    const directionalLight = new THREE.DirectionalLight(
      this.kelvinToRGB(theme.lighting.colorTemperature),
      theme.lighting.directionalIntensity
    );
    directionalLight.position.set(10, 20, 5);
    directionalLight.castShadow = this.renderer.shadowMap.enabled;

    if (directionalLight.castShadow) {
      directionalLight.shadow.mapSize.width = 2048;
      directionalLight.shadow.mapSize.height = 2048;
      directionalLight.shadow.camera.near = 0.5;
      directionalLight.shadow.camera.far = 50;
      directionalLight.shadow.bias = theme.rendering.shadowBias;
      directionalLight.shadow.radius = theme.lighting.shadowSoftness * 10;
    }

    scene.add(directionalLight);
    lights.push(directionalLight);

    // Add theme-specific accent lighting
    this.addThemeAccentLights(scene, theme, lights);

    return lights;
  }

  private addThemeAccentLights(scene: THREE.Scene, theme: ThemeConfiguration, lights: THREE.Light[]) {
    switch (this.currentTheme) {
      case 'wabi-sabi':
        // Soft, filtered light mimicking natural window light
        const wabiLight = new THREE.SpotLight(
          this.kelvinToRGB(2800),
          0.4,
          30,
          Math.PI / 6,
          0.8
        );
        wabiLight.position.set(-5, 8, 8);
        scene.add(wabiLight);
        lights.push(wabiLight);
        break;

      case 'hygge':
        // Warm, cozy point lights like candles or fireplaces
        const cozyLight1 = new THREE.PointLight(this.kelvinToRGB(2200), 0.3, 15);
        cozyLight1.position.set(3, 1.5, 2);
        scene.add(cozyLight1);
        lights.push(cozyLight1);

        const cozyLight2 = new THREE.PointLight(this.kelvinToRGB(2400), 0.2, 12);
        cozyLight2.position.set(-2, 1.2, -3);
        scene.add(cozyLight2);
        lights.push(cozyLight2);
        break;

      case 'bella-figura':
        // Dramatic accent lighting for elegance
        const elegantLight = new THREE.SpotLight(
          this.kelvinToRGB(4000),
          0.6,
          25,
          Math.PI / 8,
          0.3
        );
        elegantLight.position.set(8, 12, -5);
        scene.add(elegantLight);
        lights.push(elegantLight);
        break;

      case 'savoir-vivre':
        // Refined, balanced lighting
        const refinedLight = new THREE.RectAreaLight(
          this.kelvinToRGB(3500),
          0.4,
          6,
          4
        );
        refinedLight.position.set(0, 8, -8);
        refinedLight.lookAt(0, 0, 0);
        scene.add(refinedLight);
        lights.push(refinedLight);
        break;
    }
  }

  // Apply theme-specific material modifications
  applyThemeMaterials(object: THREE.Object3D, themeName?: string) {
    const theme = this.themes.get(themeName || this.currentTheme);
    if (!theme) return;

    object.traverse(child => {
      if (child instanceof THREE.Mesh && child.material) {
        this.modifyMaterialForTheme(child.material, theme);
      }
    });
  }

  private modifyMaterialForTheme(material: THREE.Material, theme: ThemeConfiguration) {
    if (material instanceof THREE.MeshStandardMaterial) {
      // Apply roughness modification
      material.roughness *= theme.materials.roughnessMultiplier;
      material.roughness = Math.min(1.0, Math.max(0.0, material.roughness));

      // Apply metalness modification
      material.metalness *= theme.materials.metalnessReduction;
      material.metalness = Math.min(1.0, Math.max(0.0, material.metalness));

      // Apply color saturation modification
      if (material.color) {
        const hsl = material.color.getHSL({ h: 0, s: 0, l: 0 });
        hsl.s *= theme.materials.saturationReduction;
        material.color.setHSL(hsl.h, hsl.s, hsl.l);
      }

      // Add imperfections for certain themes
      if (theme.materials.imperfectionIntensity > 0) {
        this.addMaterialImperfections(material, theme.materials.imperfectionIntensity);
      }

      material.needsUpdate = true;
    }
  }

  private addMaterialImperfections(material: THREE.MeshStandardMaterial, intensity: number) {
    // Add subtle roughness variation for more realistic appearance
    if (!material.roughnessMap) {
      const roughnessVariation = this.createNoiseTexture(512, intensity * 0.1);
      material.roughnessMap = roughnessVariation;
    }
  }

  private createNoiseTexture(size: number, intensity: number): THREE.DataTexture {
    const data = new Uint8Array(size * size);
    
    for (let i = 0; i < data.length; i++) {
      const noise = (Math.random() - 0.5) * intensity;
      data[i] = Math.max(0, Math.min(255, 128 + noise * 255));
    }
    
    const texture = new THREE.DataTexture(data, size, size, THREE.RedFormat);
    texture.needsUpdate = true;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    
    return texture;
  }

  // Convert color temperature in Kelvin to RGB
  private kelvinToRGB(kelvin: number): number {
    const temp = kelvin / 100;
    let red, green, blue;

    if (temp <= 66) {
      red = 255;
      green = temp;
      green = 99.4708025861 * Math.log(green) - 161.1195681661;

      if (temp >= 19) {
        blue = temp - 10;
        blue = 138.5177312231 * Math.log(blue) - 305.0447927307;
      } else {
        blue = 0;
      }
    } else {
      red = temp - 60;
      red = 329.698727446 * Math.pow(red, -0.1332047592);
      
      green = temp - 60;
      green = 288.1221695283 * Math.pow(green, -0.0755148492);
      
      blue = 255;
    }

    red = Math.max(0, Math.min(255, red)) / 255;
    green = Math.max(0, Math.min(255, green)) / 255;
    blue = Math.max(0, Math.min(255, blue)) / 255;

    return new THREE.Color(red, green, blue).getHex();
  }

  // Get theme configuration
  getTheme(themeName: string): ThemeConfiguration | undefined {
    return this.themes.get(themeName);
  }

  // Get all available themes
  getAvailableThemes(): string[] {
    return Array.from(this.themes.keys());
  }

  // Get current theme
  getCurrentTheme(): string {
    return this.currentTheme;
  }

  // Create cultural theme-specific post-processing effects
  getThemePostProcessingSettings(themeName?: string): any {
    const theme = this.themes.get(themeName || this.currentTheme);
    if (!theme) return null;

    return {
      enableSSAO: true,
      ssaoIntensity: theme.rendering.shadowIntensity * 0.5,
      enableBloom: true,
      bloomThreshold: theme.effects.bloomThreshold,
      bloomStrength: theme.effects.bloomStrength,
      bloomRadius: 0.4,
      enableVignette: theme.effects.enableVignette,
      enableFilmGrain: theme.effects.enableFilmGrain,
      toneMappingExposure: theme.rendering.toneMappingExposure
    };
  }
}

// Theme configuration interface
interface ThemeConfiguration {
  name: string;
  description: string;
  rendering: {
    toneMapping: THREE.ToneMapping;
    toneMappingExposure: number;
    shadowType: THREE.ShadowMapType;
    colorSpace: THREE.ColorSpace;
    shadowBias: number;
    shadowIntensity: number;
  };
  lighting: {
    ambientIntensity: number;
    directionalIntensity: number;
    colorTemperature: number;
    shadowSoftness: number;
  };
  materials: {
    roughnessMultiplier: number;
    metalnessReduction: number;
    saturationReduction: number;
    imperfectionIntensity: number;
  };
  effects: {
    enableVignette: boolean;
    enableFilmGrain: boolean;
    bloomThreshold: number;
    bloomStrength: number;
  };
}

// React component for cultural theme selector
export function CulturalThemeSelector({
  themeRenderer,
  currentTheme,
  onThemeChange
}: {
  themeRenderer: CulturalThemeRenderer | null;
  currentTheme: string;
  onThemeChange: (theme: string) => void;
}) {
  const [availableThemes, setAvailableThemes] = useState<string[]>([]);

  useEffect(() => {
    if (themeRenderer) {
      setAvailableThemes(themeRenderer.getAvailableThemes());
    }
  }, [themeRenderer]);

  const handleThemeChange = (themeName: string) => {
    if (themeRenderer) {
      themeRenderer.applyTheme(themeName);
      onThemeChange(themeName);
    }
  };

  if (!themeRenderer) return null;

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
      <h3 className="font-semibold text-gray-800 mb-3">Cultural Themes</h3>
      
      <div className="space-y-2">
        {availableThemes.map(themeName => {
          const theme = themeRenderer.getTheme(themeName);
          if (!theme) return null;

          return (
            <div key={themeName} className="flex flex-col">
              <button
                onClick={() => handleThemeChange(themeName)}
                className={`p-3 rounded-lg text-left transition-colors ${
                  currentTheme === themeName
                    ? 'bg-blue-100 border-2 border-blue-500'
                    : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                }`}
              >
                <div className="font-medium text-gray-800">{theme.name}</div>
                <div className="text-sm text-gray-600 mt-1">{theme.description}</div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Theme preview indicators */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="text-sm text-gray-700 mb-2">Current Theme Settings:</div>
        {currentTheme && themeRenderer.getTheme(currentTheme) && (
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-gray-100 p-2 rounded">
              <div className="font-medium">Lighting</div>
              <div>{themeRenderer.getTheme(currentTheme)!.lighting.colorTemperature}K</div>
            </div>
            <div className="bg-gray-100 p-2 rounded">
              <div className="font-medium">Shadows</div>
              <div>{themeRenderer.getTheme(currentTheme)!.rendering.shadowIntensity * 100}%</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// React hook for cultural theme rendering
export function useCulturalThemeRenderer(renderer: THREE.WebGLRenderer | null) {
  const [themeRenderer, setThemeRenderer] = useState<CulturalThemeRenderer | null>(null);

  useEffect(() => {
    if (!renderer) return;

    const cultural = new CulturalThemeRenderer(renderer);
    setThemeRenderer(cultural);

    return () => {
      // Cleanup if needed
    };
  }, [renderer]);

  return themeRenderer;
}

// Theme transition manager
export class ThemeTransitionManager {
  private renderer: THREE.WebGLRenderer;
  private isTransitioning: boolean = false;
  private transitionDuration: number = 1000; // 1 second

  constructor(renderer: THREE.WebGLRenderer) {
    this.renderer = renderer;
  }

  async transitionToTheme(
    scene: THREE.Scene,
    fromTheme: string,
    toTheme: string,
    themeRenderer: CulturalThemeRenderer,
    onProgress?: (progress: number) => void
  ): Promise<void> {
    if (this.isTransitioning) return;

    this.isTransitioning = true;
    const startTime = performance.now();

    return new Promise((resolve) => {
      const animate = () => {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / this.transitionDuration, 1);

        // Interpolate between themes
        this.interpolateThemes(scene, fromTheme, toTheme, progress, themeRenderer);

        onProgress?.(progress);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Apply final theme
          themeRenderer.applyTheme(toTheme);
          themeRenderer.applyThemeLighting(scene, toTheme);
          
          this.isTransitioning = false;
          resolve();
        }
      };

      animate();
    });
  }

  private interpolateThemes(
    scene: THREE.Scene,
    fromTheme: string,
    toTheme: string,
    progress: number,
    themeRenderer: CulturalThemeRenderer
  ) {
    const fromConfig = themeRenderer.getTheme(fromTheme);
    const toConfig = themeRenderer.getTheme(toTheme);

    if (!fromConfig || !toConfig) return;

    // Interpolate tone mapping exposure
    const exposure = this.lerp(
      fromConfig.rendering.toneMappingExposure,
      toConfig.rendering.toneMappingExposure,
      progress
    );
    this.renderer.toneMappingExposure = exposure;

    // Interpolate lighting intensity
    scene.traverse(child => {
      if (child instanceof THREE.AmbientLight) {
        const intensity = this.lerp(
          fromConfig.lighting.ambientIntensity,
          toConfig.lighting.ambientIntensity,
          progress
        );
        child.intensity = intensity;
      }
    });
  }

  private lerp(start: number, end: number, progress: number): number {
    return start + (end - start) * progress;
  }

  isTransitionInProgress(): boolean {
    return this.isTransitioning;
  }
}