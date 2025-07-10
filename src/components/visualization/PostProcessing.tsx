'use client';

import { useMemo, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PostProcessingProps {
  enableSSAO?: boolean;
  enableBloom?: boolean;
  enableAntialiasing?: boolean;
  enableToneMapping?: boolean;
  bloomStrength?: number;
  bloomRadius?: number;
  bloomThreshold?: number;
  ssaoRadius?: number;
  ssaoIntensity?: number;
}

export function PostProcessing({
  enableSSAO = true,
  enableBloom = true,
  enableAntialiasing = true,
  enableToneMapping = true,
  bloomStrength = 0.3,
  bloomRadius = 0.4,
  bloomThreshold = 0.85,
  ssaoRadius = 0.1,
  ssaoIntensity = 0.5
}: PostProcessingProps) {
  const { gl } = useThree();

  useEffect(() => {
    // Enhanced WebGL settings for better visual quality
    if (enableToneMapping) {
      gl.toneMapping = THREE.ACESFilmicToneMapping;
      gl.toneMappingExposure = 1.2;
    }
    
    // Enable better shadow sampling
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Enable proper color space
    gl.outputColorSpace = THREE.SRGBColorSpace;
    
    // Enhanced render quality
    if (enableAntialiasing) {
      gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
    
  }, [gl, enableToneMapping, enableAntialiasing]);

  return null;
}

// Enhanced scene lighting setup for post-processing
export function EnhancedLighting() {
  return (
    <>
      {/* Main directional light (sun) */}
      <directionalLight
        position={[10, 20, 5]}
        intensity={1.5}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-bias={-0.0001}
      />

      {/* Ambient light for global illumination simulation */}
      <ambientLight intensity={0.3} color="#f0f0f0" />

      {/* Fill lights for realistic interior lighting */}
      <pointLight position={[-10, 10, -10]} intensity={0.5} color="#ffeecc" />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#ccddff" />

      {/* Rim light for object definition */}
      <spotLight
        position={[0, 20, -20]}
        intensity={0.8}
        color="#ffffff"
        angle={Math.PI / 4}
        penumbra={0.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
    </>
  );
}

// Advanced material enhancement for post-processing compatibility
export function usePostProcessingMaterial(baseMaterial: THREE.Material) {
  return useMemo(() => {
    const material = baseMaterial.clone();
    
    // Enable proper shadows and reflections
    if (material instanceof THREE.MeshStandardMaterial) {
      material.shadowSide = THREE.DoubleSide;
      
      // Enhance material properties for post-processing
      material.toneMapped = true;
      
      // Enable proper environment mapping
      if (!material.envMapIntensity) {
        material.envMapIntensity = 0.5;
      }
    }
    
    return material;
  }, [baseMaterial]);
}

// Performance monitoring for post-processing
export function PostProcessingStats() {
  const { gl } = useThree();
  
  useFrame(() => {
    const info = gl.info;
    
    // Log performance stats occasionally
    if (Math.random() < 0.01) { // Log 1% of frames
      console.log('WebGL Stats:', {
        triangles: info.render.triangles,
        calls: info.render.calls,
        points: info.render.points,
        lines: info.render.lines
      });
    }
  });
  
  return null;
}