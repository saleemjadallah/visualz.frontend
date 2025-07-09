'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useTextureManager } from './TextureManager';

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
  const { getCulturalMaterial } = useTextureManager();

  // Create geometries
  const floorGeometry = useMemo(() => new THREE.PlaneGeometry(width, depth), [width, depth]);
  const wallGeometries = useMemo(() => ({
    front: new THREE.PlaneGeometry(width, height),
    back: new THREE.PlaneGeometry(width, height),
    left: new THREE.PlaneGeometry(depth, height),
    right: new THREE.PlaneGeometry(depth, height)
  }), [width, height, depth]);

  // Get cultural materials
  const floorMaterial = useMemo(() => {
    switch (culturalTheme) {
      case 'wabi-sabi':
        return getCulturalMaterial('wabi-sabi', 'bamboo');
      case 'hygge':
        return getCulturalMaterial('hygge', 'hardwood');
      case 'bella-figura':
        return getCulturalMaterial('bella-figura', 'marble');
      case 'savoir-vivre':
        return getCulturalMaterial('savoir-vivre', 'hardwood');
      default:
        return getCulturalMaterial('modern', 'hardwood');
    }
  }, [culturalTheme, getCulturalMaterial]);

  const wallMaterial = useMemo(() => {
    const material = new THREE.MeshStandardMaterial({
      color: colorPalette.primary,
      roughness: 0.9,
      metalness: 0.0
    });
    return material;
  }, [colorPalette.primary]);

  const ceilingMaterial = useMemo(() => {
    const material = new THREE.MeshStandardMaterial({
      color: colorPalette.secondary,
      roughness: 0.8,
      metalness: 0.0
    });
    return material;
  }, [colorPalette.secondary]);

  return (
    <group ref={roomGroup}>
      {/* Floor */}
      <mesh
        geometry={floorGeometry}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <primitive object={floorMaterial} />
      </mesh>

      {/* Ceiling */}
      <mesh
        geometry={floorGeometry}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, height, 0]}
        receiveShadow
      >
        <primitive object={ceilingMaterial} />
      </mesh>

      {/* Front Wall */}
      <mesh
        geometry={wallGeometries.front}
        position={[0, height / 2, -depth / 2]}
        receiveShadow
      >
        <primitive object={wallMaterial} />
      </mesh>

      {/* Back Wall */}
      <mesh
        geometry={wallGeometries.back}
        position={[0, height / 2, depth / 2]}
        rotation={[0, Math.PI, 0]}
        receiveShadow
      >
        <primitive object={wallMaterial.clone()} />
      </mesh>

      {/* Left Wall */}
      <mesh
        geometry={wallGeometries.left}
        position={[-width / 2, height / 2, 0]}
        rotation={[0, Math.PI / 2, 0]}
        receiveShadow
      >
        <primitive object={wallMaterial.clone()} />
      </mesh>

      {/* Right Wall */}
      <mesh
        geometry={wallGeometries.right}
        position={[width / 2, height / 2, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        receiveShadow
      >
        <primitive object={wallMaterial.clone()} />
      </mesh>

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