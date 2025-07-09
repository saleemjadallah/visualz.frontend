'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface EventRoomProps {
  width: number;
  height: number;
  depth: number;
  colorPalette: {
    primary: string;
    secondary: string;
    accent: string;
    neutral: string;
  };
  culturalTheme?: string;
}

export function EventRoom({ width, height, depth, colorPalette, culturalTheme = 'modern' }: EventRoomProps) {
  const roomGroup = useRef<THREE.Group>(null);
  
  // Load textures based on cultural theme
  const textures = useMemo(() => {
    const textureLoader = new THREE.TextureLoader();
    
    // Default textures - in production, these would be loaded from assets
    const defaultTextures: {
      floor: THREE.Texture | null;
      wall: THREE.Texture | null;
      ceiling: THREE.Texture | null;
    } = {
      floor: null,
      wall: null,
      ceiling: null
    };
    
    // Cultural theme-specific textures
    switch (culturalTheme) {
      case 'wabi-sabi':
        // Bamboo floor, paper walls, wooden ceiling
        break;
      case 'hygge':
        // Light wood floor, white walls, wood ceiling
        break;
      case 'bella-figura':
        // Marble floor, elegant walls, decorative ceiling
        break;
      case 'savoir-vivre':
        // Parquet floor, refined walls, classic ceiling
        break;
      default:
        // Modern defaults
        break;
    }
    
    return defaultTextures;
  }, [culturalTheme]);

  // Create floor geometry and material
  const floorGeometry = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(width, depth);
    return geometry;
  }, [width, depth]);

  const floorMaterial = useMemo(() => {
    const material = new THREE.MeshLambertMaterial({
      color: colorPalette.neutral,
      side: THREE.DoubleSide
    });
    
    // Add texture if available
    if (textures.floor) {
      material.map = textures.floor;
      textures.floor.wrapS = THREE.RepeatWrapping;
      textures.floor.wrapT = THREE.RepeatWrapping;
      textures.floor.repeat.set(width / 2, depth / 2);
    }
    
    return material;
  }, [colorPalette.neutral, textures.floor, width, depth]);

  // Create wall materials
  const wallMaterial = useMemo(() => {
    const material = new THREE.MeshLambertMaterial({
      color: colorPalette.primary,
      side: THREE.DoubleSide
    });
    
    if (textures.wall) {
      material.map = textures.wall;
      textures.wall.wrapS = THREE.RepeatWrapping;
      textures.wall.wrapT = THREE.RepeatWrapping;
    }
    
    return material;
  }, [colorPalette.primary, textures.wall]);

  // Create ceiling material
  const ceilingMaterial = useMemo(() => {
    const material = new THREE.MeshLambertMaterial({
      color: colorPalette.secondary,
      side: THREE.DoubleSide
    });
    
    if (textures.ceiling) {
      material.map = textures.ceiling;
      textures.ceiling.wrapS = THREE.RepeatWrapping;
      textures.ceiling.wrapT = THREE.RepeatWrapping;
    }
    
    return material;
  }, [colorPalette.secondary, textures.ceiling]);

  // Create wall geometries
  const wallGeometries = useMemo(() => {
    return {
      front: new THREE.PlaneGeometry(width, height),
      back: new THREE.PlaneGeometry(width, height),
      left: new THREE.PlaneGeometry(depth, height),
      right: new THREE.PlaneGeometry(depth, height)
    };
  }, [width, height, depth]);

  return (
    <group ref={roomGroup}>
      {/* Floor */}
      <mesh
        geometry={floorGeometry}
        material={floorMaterial}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      />

      {/* Ceiling */}
      <mesh
        geometry={floorGeometry}
        material={ceilingMaterial}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, height, 0]}
        receiveShadow
      />

      {/* Front Wall */}
      <mesh
        geometry={wallGeometries.front}
        material={wallMaterial}
        position={[0, height / 2, -depth / 2]}
        receiveShadow
      />

      {/* Back Wall */}
      <mesh
        geometry={wallGeometries.back}
        material={wallMaterial}
        position={[0, height / 2, depth / 2]}
        rotation={[0, Math.PI, 0]}
        receiveShadow
      />

      {/* Left Wall */}
      <mesh
        geometry={wallGeometries.left}
        material={wallMaterial}
        position={[-width / 2, height / 2, 0]}
        rotation={[0, Math.PI / 2, 0]}
        receiveShadow
      />

      {/* Right Wall */}
      <mesh
        geometry={wallGeometries.right}
        material={wallMaterial}
        position={[width / 2, height / 2, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        receiveShadow
      />

      {/* Cultural Theme Decorative Elements */}
      {culturalTheme === 'wabi-sabi' && (
        <>
          {/* Add bamboo corner elements */}
          <mesh position={[-width / 2 + 0.1, height / 4, -depth / 2 + 0.1]}>
            <boxGeometry args={[0.2, height / 2, 0.2]} />
            <meshLambertMaterial color="#8B7355" />
          </mesh>
        </>
      )}

      {culturalTheme === 'hygge' && (
        <>
          {/* Add cozy wooden beam */}
          <mesh position={[0, height - 0.2, 0]}>
            <boxGeometry args={[width * 0.8, 0.4, 0.4]} />
            <meshLambertMaterial color="#DEB887" />
          </mesh>
        </>
      )}

      {culturalTheme === 'bella-figura' && (
        <>
          {/* Add elegant columns */}
          <mesh position={[-width / 3, height / 2, -depth / 3]}>
            <cylinderGeometry args={[0.3, 0.3, height, 8]} />
            <meshPhongMaterial color="#F5F5DC" />
          </mesh>
          <mesh position={[width / 3, height / 2, depth / 3]}>
            <cylinderGeometry args={[0.3, 0.3, height, 8]} />
            <meshPhongMaterial color="#F5F5DC" />
          </mesh>
        </>
      )}

      {culturalTheme === 'savoir-vivre' && (
        <>
          {/* Add French-style crown molding */}
          <mesh position={[0, height - 0.1, 0]}>
            <torusGeometry args={[width / 2.2, 0.1, 8, 50]} />
            <meshPhongMaterial color="#8B4513" />
          </mesh>
        </>
      )}
    </group>
  );
}