'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface LightingSystemProps {
  lightingPlan: {
    ambient_lighting: string;
    task_lighting: string[];
    accent_lighting: string[];
    color_temperature: string;
  };
  roomDimensions: {
    length: number;
    width: number;
    height: number;
  };
  culturalTheme?: string;
}

export function LightingSystem({ lightingPlan, roomDimensions, culturalTheme = 'modern' }: LightingSystemProps) {
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const directionalRef = useRef<THREE.DirectionalLight>(null);

  // Convert color temperature to RGB with cultural adjustments
  function colorTemperatureToRGB(kelvin: string): THREE.Color {
    const temp = parseInt(kelvin.replace('K', ''));
    
    let baseColor: THREE.Color;
    if (temp <= 3000) {
      baseColor = new THREE.Color(1.0, 0.9, 0.7); // Warm white
    } else if (temp <= 4000) {
      baseColor = new THREE.Color(1.0, 0.95, 0.8); // Neutral warm
    } else if (temp <= 5000) {
      baseColor = new THREE.Color(1.0, 1.0, 0.9); // Neutral
    } else {
      baseColor = new THREE.Color(0.9, 0.95, 1.0); // Cool white
    }

    // Apply cultural theme adjustments
    switch (culturalTheme) {
      case 'wabi-sabi':
        return baseColor.multiplyScalar(0.8).lerp(new THREE.Color(0xFFF4E6), 0.3);
      case 'hygge':
        return baseColor.lerp(new THREE.Color(0xFFE4B5), 0.2);
      case 'bella-figura':
        return baseColor.lerp(new THREE.Color(0xF0F8FF), 0.1);
      case 'savoir-vivre':
        return baseColor.lerp(new THREE.Color(0xFFF8DC), 0.15);
      default:
        return baseColor;
    }
  }

  const lightColor = colorTemperatureToRGB(lightingPlan.color_temperature);

  // Calculate lighting intensity based on room size and cultural theme
  const roomVolume = roomDimensions.length * roomDimensions.width * roomDimensions.height;
  let baseIntensity = Math.min(1.0, roomVolume / 1000 + 0.3);
  
  // Cultural theme intensity adjustments
  switch (culturalTheme) {
    case 'wabi-sabi':
      baseIntensity *= 0.7; // Softer, more subdued
      break;
    case 'hygge':
      baseIntensity *= 0.8; // Cozy, warm
      break;
    case 'bella-figura':
      baseIntensity *= 1.1; // Brighter, more dramatic
      break;
    case 'savoir-vivre':
      baseIntensity *= 0.9; // Refined, balanced
      break;
  }

  return (
    <>
      {/* Ambient lighting - overall room illumination */}
      <ambientLight
        ref={ambientRef}
        color={lightColor}
        intensity={baseIntensity * 0.4}
      />

      {/* Main directional light (simulating window/overhead lighting) */}
      <directionalLight
        ref={directionalRef}
        position={[roomDimensions.length / 2, roomDimensions.height + 5, roomDimensions.width / 2]}
        color={lightColor}
        intensity={baseIntensity * 0.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-roomDimensions.length}
        shadow-camera-right={roomDimensions.length}
        shadow-camera-top={roomDimensions.width}
        shadow-camera-bottom={-roomDimensions.width}
        target-position={[roomDimensions.length / 2, 0, roomDimensions.width / 2]}
      />

      {/* Task lighting - specific work areas */}
      {lightingPlan.task_lighting.map((task, index) => (
        <pointLight
          key={`task-${index}`}
          position={[
            (roomDimensions.length / (lightingPlan.task_lighting.length + 1)) * (index + 1),
            roomDimensions.height - 1,
            roomDimensions.width / 2
          ]}
          color={lightColor}
          intensity={baseIntensity * 0.6}
          distance={8}
          decay={2}
          castShadow
        />
      ))}

      {/* Accent lighting - decorative/mood lighting */}
      {lightingPlan.accent_lighting.map((accent, index) => (
        <spotLight
          key={`accent-${index}`}
          position={[
            Math.random() * roomDimensions.length,
            roomDimensions.height / 2,
            Math.random() * roomDimensions.width
          ]}
          color={new THREE.Color().setHSL((index * 0.2) % 1, 0.5, 0.7)}
          intensity={baseIntensity * 0.3}
          distance={6}
          angle={Math.PI / 6}
          penumbra={0.5}
          decay={2}
        />
      ))}

      {/* Rim lighting for better depth perception */}
      <pointLight
        position={[-2, roomDimensions.height / 2, roomDimensions.width / 2]}
        color={lightColor.clone().multiplyScalar(0.5)}
        intensity={baseIntensity * 0.2}
        distance={15}
      />

      <pointLight
        position={[roomDimensions.length + 2, roomDimensions.height / 2, roomDimensions.width / 2]}
        color={lightColor.clone().multiplyScalar(0.5)}
        intensity={baseIntensity * 0.2}
        distance={15}
      />

      {/* Floor uplighting for ambient warmth */}
      <pointLight
        position={[roomDimensions.length / 2, 0.5, roomDimensions.width / 2]}
        color={lightColor.clone().multiplyScalar(0.8)}
        intensity={baseIntensity * 0.1}
        distance={roomDimensions.length}
      />

      {/* Ceiling downlighting */}
      <pointLight
        position={[roomDimensions.length / 4, roomDimensions.height - 0.5, roomDimensions.width / 4]}
        color={lightColor}
        intensity={baseIntensity * 0.4}
        distance={8}
        castShadow
      />

      <pointLight
        position={[(3 * roomDimensions.length) / 4, roomDimensions.height - 0.5, (3 * roomDimensions.width) / 4]}
        color={lightColor}
        intensity={baseIntensity * 0.4}
        distance={8}
        castShadow
      />

      {/* Helper to visualize shadow camera (dev only) */}
      {process.env.NODE_ENV === 'development' && directionalRef.current && (
        <cameraHelper args={[directionalRef.current.shadow.camera]} />
      )}
    </>
  );
}