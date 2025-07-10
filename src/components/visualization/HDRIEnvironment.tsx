'use client';

import React, { useMemo, useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { useEnvironment } from '@react-three/drei';
import * as THREE from 'three';

// HDRI Environment presets for different lighting scenarios
export const HDRI_PRESETS = {
  'studio': {
    name: 'Studio',
    description: 'Bright, even lighting perfect for showcasing furniture',
    intensity: 1.0,
    rotation: 0,
    background: true,
    blur: 0.1,
    preset: 'studio' as const
  },
  'apartment': {
    name: 'Modern Apartment',
    description: 'Warm indoor lighting with window light',
    intensity: 0.8,
    rotation: Math.PI / 4,
    background: true,
    blur: 0.2,
    preset: 'apartment' as const
  },
  'warehouse': {
    name: 'Industrial Warehouse',
    description: 'Large space with dramatic industrial lighting',
    intensity: 1.2,
    rotation: 0,
    background: true,
    blur: 0.05,
    preset: 'warehouse' as const
  },
  'city': {
    name: 'Urban Evening',
    description: 'City lights for evening events',
    intensity: 0.6,
    rotation: Math.PI / 2,
    background: true,
    blur: 0.3,
    preset: 'city' as const
  },
  'forest': {
    name: 'Natural Forest',
    description: 'Soft natural lighting for outdoor events',
    intensity: 0.9,
    rotation: 0,
    background: true,
    blur: 0.4,
    preset: 'forest' as const
  },
  'sunset': {
    name: 'Golden Hour',
    description: 'Warm sunset lighting for romantic events',
    intensity: 1.1,
    rotation: Math.PI / 6,
    background: true,
    blur: 0.2,
    preset: 'sunset' as const
  },
  'park': {
    name: 'Outdoor Park',
    description: 'Bright daylight for outdoor celebrations',
    intensity: 1.3,
    rotation: 0,
    background: true,
    blur: 0.1,
    preset: 'park' as const
  }
} as const;

// Cultural theme to HDRI environment mapping
export const CULTURAL_HDRI_MAPPING = {
  'wabi-sabi': 'forest',
  'hygge': 'apartment', 
  'bella-figura': 'studio',
  'savoir-vivre': 'sunset',
  'modern': 'studio'
} as const;

interface HDRIEnvironmentProps {
  preset?: keyof typeof HDRI_PRESETS;
  culturalTheme?: string;
  intensity?: number;
  rotation?: number;
  background?: boolean;
  enableReflections?: boolean;
  enableRefraction?: boolean;
  blur?: number;
  customHDRIUrl?: string;
}

export function HDRIEnvironment({
  preset,
  culturalTheme = 'modern',
  intensity,
  rotation,
  background = true,
  enableReflections = true,
  enableRefraction = false,
  blur,
  customHDRIUrl
}: HDRIEnvironmentProps) {
  const { scene, gl } = useThree();
  const [currentPreset, setCurrentPreset] = useState<string>('studio');

  // Determine which preset to use
  const selectedPreset = useMemo(() => {
    if (preset) return preset;
    if (culturalTheme && CULTURAL_HDRI_MAPPING[culturalTheme as keyof typeof CULTURAL_HDRI_MAPPING]) {
      return CULTURAL_HDRI_MAPPING[culturalTheme as keyof typeof CULTURAL_HDRI_MAPPING];
    }
    return 'studio';
  }, [preset, culturalTheme]);

  // Get environment configuration
  const envConfig = useMemo(() => {
    return HDRI_PRESETS[selectedPreset];
  }, [selectedPreset]);

  // Load environment map using drei
  const envMap = useEnvironment({
    preset: envConfig.preset
  });

  // Apply environment settings
  useEffect(() => {
    if (!envMap) return;

    // Set environment intensity
    const envIntensity = intensity !== undefined ? intensity : envConfig.intensity;
    scene.environment = envMap;
    
    // Apply rotation if specified (environment maps handle rotation differently)
    if (rotation !== undefined || envConfig.rotation) {
      const rotationY = rotation !== undefined ? rotation : envConfig.rotation;
      // Environment rotation would be applied through scene.environment.mapping
      console.log(`Environment rotation set to: ${rotationY}`);
    }

    // Configure renderer for HDRI
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = envIntensity;
    gl.outputColorSpace = THREE.SRGBColorSpace;

    // Set background if enabled
    if (background && envConfig.background) {
      scene.background = envMap;
    }

    setCurrentPreset(selectedPreset);
  }, [envMap, scene, gl, selectedPreset, intensity, rotation, background, envConfig]);

  // Environment probe for reflections
  useEffect(() => {
    if (!enableReflections) return;

    // Create cube camera for local reflections
    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256);
    const cubeCamera = new THREE.CubeCamera(0.1, 1000, cubeRenderTarget);
    
    // Position cube camera for room reflections
    cubeCamera.position.set(0, 2, 0);
    scene.add(cubeCamera);

    // Update cube camera periodically for dynamic reflections
    const interval = setInterval(() => {
      cubeCamera.update(gl, scene);
    }, 1000); // Update every second

    return () => {
      clearInterval(interval);
      scene.remove(cubeCamera);
      cubeRenderTarget.dispose();
    };
  }, [enableReflections, scene, gl]);

  return null;
}

// Environment lighting controls component
export function EnvironmentControls({
  currentPreset,
  onPresetChange,
  intensity = 1.0,
  onIntensityChange,
  rotation = 0,
  onRotationChange,
  background = true,
  onBackgroundChange
}: {
  currentPreset: keyof typeof HDRI_PRESETS;
  onPresetChange: (preset: keyof typeof HDRI_PRESETS) => void;
  intensity?: number;
  onIntensityChange?: (intensity: number) => void;
  rotation?: number;
  onRotationChange?: (rotation: number) => void;
  background?: boolean;
  onBackgroundChange?: (background: boolean) => void;
}) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg max-w-xs">
      <h3 className="font-semibold text-gray-800 mb-3">Environment Lighting</h3>
      
      {/* Preset Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          HDRI Preset
        </label>
        <select
          value={currentPreset}
          onChange={(e) => onPresetChange(e.target.value as keyof typeof HDRI_PRESETS)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {Object.entries(HDRI_PRESETS).map(([key, config]) => (
            <option key={key} value={key}>
              {config.name}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">
          {HDRI_PRESETS[currentPreset].description}
        </p>
      </div>

      {/* Intensity Control */}
      {onIntensityChange && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Intensity: {intensity.toFixed(1)}
          </label>
          <input
            type="range"
            min="0.1"
            max="2.0"
            step="0.1"
            value={intensity}
            onChange={(e) => onIntensityChange(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      )}

      {/* Rotation Control */}
      {onRotationChange && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rotation: {Math.round((rotation * 180) / Math.PI)}°
          </label>
          <input
            type="range"
            min="0"
            max={Math.PI * 2}
            step="0.1"
            value={rotation}
            onChange={(e) => onRotationChange(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      )}

      {/* Background Toggle */}
      {onBackgroundChange && (
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={background}
              onChange={(e) => onBackgroundChange(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Show background</span>
          </label>
        </div>
      )}

      {/* Quick Presets for Cultural Themes */}
      <div className="border-t pt-3">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cultural Theme Presets
        </label>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(CULTURAL_HDRI_MAPPING).map(([theme, hdri]) => (
            <button
              key={theme}
              onClick={() => onPresetChange(hdri)}
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              {theme}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Advanced environment effects
export function EnvironmentEffects({
  preset,
  enableVolumetricLighting = false,
  enableGodRays = false,
  fogDensity = 0.01,
  fogColor = '#ffffff'
}: {
  preset: keyof typeof HDRI_PRESETS;
  enableVolumetricLighting?: boolean;
  enableGodRays?: boolean;
  fogDensity?: number;
  fogColor?: string;
}) {
  const { scene } = useThree();

  // Add atmospheric fog based on environment
  useEffect(() => {
    const config = HDRI_PRESETS[preset];
    
    if (preset === 'forest' || preset === 'city') {
      // Use FogExp2 for density-based fog
      scene.fog = new THREE.FogExp2(fogColor, fogDensity);
    } else {
      scene.fog = null;
    }

    return () => {
      scene.fog = null;
    };
  }, [preset, scene, fogDensity, fogColor]);

  // Volumetric lighting effects
  useEffect(() => {
    if (!enableVolumetricLighting) return;

    // Add subtle volumetric lighting for studio and warehouse presets
    if (preset === 'studio' || preset === 'warehouse') {
      const volumetricLight = new THREE.SpotLight(0xffffff, 0.3, 100, Math.PI / 8, 0.5);
      volumetricLight.position.set(10, 10, 5);
      volumetricLight.castShadow = true;
      
      scene.add(volumetricLight);

      return () => {
        scene.remove(volumetricLight);
      };
    }
  }, [enableVolumetricLighting, preset, scene]);

  return null;
}

// Environment performance optimizer
export function useEnvironmentOptimization() {
  const [optimizationLevel, setOptimizationLevel] = useState<'low' | 'medium' | 'high'>('high');
  const { gl } = useThree();

  useEffect(() => {
    // Detect device capabilities
    const isLowEnd = gl.capabilities.maxTextureSize < 4096;
    const isMedium = gl.capabilities.maxTextureSize < 8192;

    if (isLowEnd) {
      setOptimizationLevel('low');
    } else if (isMedium) {
      setOptimizationLevel('medium');
    } else {
      setOptimizationLevel('high');
    }
  }, [gl]);

  const getOptimizedSettings = () => {
    switch (optimizationLevel) {
      case 'low':
        return {
          blur: 0.3,
          intensity: 0.8,
          enableReflections: false,
          enableRefraction: false,
          backgroundResolution: 512
        };
      case 'medium':
        return {
          blur: 0.2,
          intensity: 1.0,
          enableReflections: true,
          enableRefraction: false,
          backgroundResolution: 1024
        };
      default:
        return {
          blur: 0.1,
          intensity: 1.2,
          enableReflections: true,
          enableRefraction: true,
          backgroundResolution: 2048
        };
    }
  };

  return {
    optimizationLevel,
    optimizedSettings: getOptimizedSettings()
  };
}

// Time-based environment transitions
export function useTimeBasedEnvironment() {
  const [currentTime, setCurrentTime] = useState<'morning' | 'day' | 'evening' | 'night'>('day');

  useEffect(() => {
    const updateTimeBasedEnvironment = () => {
      const hour = new Date().getHours();
      
      if (hour >= 6 && hour < 12) setCurrentTime('morning');
      else if (hour >= 12 && hour < 17) setCurrentTime('day');
      else if (hour >= 17 && hour < 21) setCurrentTime('evening');
      else setCurrentTime('night');
    };

    updateTimeBasedEnvironment();
    const interval = setInterval(updateTimeBasedEnvironment, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const getTimeBasedPreset = (): keyof typeof HDRI_PRESETS => {
    switch (currentTime) {
      case 'morning': return 'park';
      case 'day': return 'studio';
      case 'evening': return 'sunset';
      case 'night': return 'city';
    }
  };

  return {
    currentTime,
    recommendedPreset: getTimeBasedPreset()
  };
}