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

      {/* Enhanced Cultural Theme Decorative Elements */}
      {culturalTheme === 'wabi-sabi' && (
        <>
          {/* Bamboo corner elements */}
          <mesh position={[-width / 2 + 0.1, height / 4, -depth / 2 + 0.1]} castShadow receiveShadow>
            <boxGeometry args={[0.2, height / 2, 0.2]} />
            <primitive object={getCulturalMaterial('wabi-sabi', 'bamboo')} />
          </mesh>
          
          {/* Zen garden stone */}
          <mesh position={[width / 4, 0.3, depth / 4]} castShadow receiveShadow>
            <sphereGeometry args={[0.8, 16, 16]} />
            <primitive object={getCulturalMaterial('wabi-sabi', 'granite')} />
          </mesh>
          
          {/* Paper screen divider */}
          <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.1, height * 0.8, width * 0.6]} />
            <primitive object={getCulturalMaterial('wabi-sabi', 'linen')} />
          </mesh>
          
          {/* Wooden platform */}
          <mesh position={[-width / 4, 0.1, -depth / 4]} castShadow receiveShadow>
            <boxGeometry args={[2, 0.2, 2]} />
            <primitive object={getCulturalMaterial('wabi-sabi', 'bamboo')} />
          </mesh>
        </>
      )}

      {culturalTheme === 'hygge' && (
        <>
          {/* Cozy wooden beam */}
          <mesh position={[0, height - 0.2, 0]} castShadow receiveShadow>
            <boxGeometry args={[width * 0.8, 0.4, 0.4]} />
            <primitive object={getCulturalMaterial('hygge', 'pine')} />
          </mesh>
          
          {/* Fireplace mantel */}
          <mesh position={[-width / 2 + 0.5, height / 3, 0]} castShadow receiveShadow>
            <boxGeometry args={[1, 2, 0.5]} />
            <primitive object={getCulturalMaterial('hygge', 'pine')} />
          </mesh>
          
          {/* Cozy reading nook */}
          <mesh position={[width / 3, 0.5, -depth / 3]} castShadow receiveShadow>
            <boxGeometry args={[2, 1, 2]} />
            <primitive object={getCulturalMaterial('hygge', 'cotton')} />
          </mesh>
          
          {/* Hanging lantern */}
          <mesh position={[0, height - 1, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.3, 0.3, 0.6, 8]} />
            <primitive object={getCulturalMaterial('hygge', 'pine')} />
          </mesh>
          
          {/* Wooden shelving */}
          <mesh position={[width / 2 - 0.2, height / 2, -depth / 2 + 0.2]} castShadow receiveShadow>
            <boxGeometry args={[0.4, height * 0.8, 0.3]} />
            <primitive object={getCulturalMaterial('hygge', 'pine')} />
          </mesh>
        </>
      )}

      {culturalTheme === 'bella-figura' && (
        <>
          {/* Elegant columns */}
          <mesh position={[-width / 3, height / 2, -depth / 3]} castShadow receiveShadow>
            <cylinderGeometry args={[0.3, 0.3, height, 8]} />
            <primitive object={getCulturalMaterial('bella-figura', 'marble')} />
          </mesh>
          <mesh position={[width / 3, height / 2, depth / 3]} castShadow receiveShadow>
            <cylinderGeometry args={[0.3, 0.3, height, 8]} />
            <primitive object={getCulturalMaterial('bella-figura', 'marble')} />
          </mesh>
          
          {/* Ornate chandelier base */}
          <mesh position={[0, height - 0.5, 0]} castShadow receiveShadow>
            <sphereGeometry args={[0.8, 16, 16]} />
            <primitive object={getCulturalMaterial('bella-figura', 'brass')} />
          </mesh>
          
          {/* Venetian mirror frame */}
          <mesh position={[0, height / 2, -depth / 2 + 0.1]} castShadow receiveShadow>
            <boxGeometry args={[2, 3, 0.2]} />
            <primitive object={getCulturalMaterial('bella-figura', 'brass')} />
          </mesh>
          
          {/* Marble pedestal */}
          <mesh position={[width / 4, 1, depth / 4]} castShadow receiveShadow>
            <cylinderGeometry args={[0.4, 0.4, 2, 8]} />
            <primitive object={getCulturalMaterial('bella-figura', 'marble')} />
          </mesh>
          
          {/* Decorative vase */}
          <mesh position={[width / 4, 2.2, depth / 4]} castShadow receiveShadow>
            <cylinderGeometry args={[0.2, 0.15, 0.4, 8]} />
            <primitive object={getCulturalMaterial('bella-figura', 'marble')} />
          </mesh>
        </>
      )}

      {culturalTheme === 'savoir-vivre' && (
        <>
          {/* Crown molding */}
          <mesh position={[0, height - 0.1, 0]} castShadow receiveShadow>
            <torusGeometry args={[width / 2.2, 0.1, 8, 50]} />
            <primitive object={getCulturalMaterial('savoir-vivre', 'walnut')} />
          </mesh>
          
          {/* French door frame */}
          <mesh position={[width / 2 - 0.1, height / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.2, height * 0.8, 0.1]} />
            <primitive object={getCulturalMaterial('savoir-vivre', 'walnut')} />
          </mesh>
          
          {/* Elegant side table */}
          <mesh position={[-width / 3, 1.5, depth / 3]} castShadow receiveShadow>
            <boxGeometry args={[1, 0.1, 0.6]} />
            <primitive object={getCulturalMaterial('savoir-vivre', 'walnut')} />
          </mesh>
          
          {/* Crystal chandelier elements */}
          {[
            [0, height - 1, 0],
            [-0.5, height - 1.2, 0],
            [0.5, height - 1.2, 0],
            [0, height - 1.2, 0.5],
            [0, height - 1.2, -0.5]
          ].map((pos, i) => (
            <mesh key={i} position={pos as [number, number, number]} castShadow receiveShadow>
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshStandardMaterial color={0xFFFFFF} roughness={0.0} metalness={0.1} transparent opacity={0.8} />
            </mesh>
          ))}
          
          {/* Parquet floor accent */}
          <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <boxGeometry args={[width * 0.6, depth * 0.6, 0.02]} />
            <primitive object={getCulturalMaterial('savoir-vivre', 'walnut')} />
          </mesh>
        </>
      )}
      
      {/* Universal Room Accessories */}
      {/* Baseboards */}
      <mesh position={[0, 0.1, -depth / 2]} castShadow receiveShadow>
        <boxGeometry args={[width, 0.2, 0.1]} />
        <primitive object={wallMaterial.clone()} />
      </mesh>
      
      <mesh position={[0, 0.1, depth / 2]} castShadow receiveShadow>
        <boxGeometry args={[width, 0.2, 0.1]} />
        <primitive object={wallMaterial.clone()} />
      </mesh>
      
      <mesh position={[-width / 2, 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 0.2, depth]} />
        <primitive object={wallMaterial.clone()} />
      </mesh>
      
      <mesh position={[width / 2, 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 0.2, depth]} />
        <primitive object={wallMaterial.clone()} />
      </mesh>
      
      {/* Ceiling trim */}
      <mesh position={[0, height - 0.1, -depth / 2]} castShadow receiveShadow>
        <boxGeometry args={[width, 0.2, 0.1]} />
        <primitive object={ceilingMaterial.clone()} />
      </mesh>
      
      <mesh position={[0, height - 0.1, depth / 2]} castShadow receiveShadow>
        <boxGeometry args={[width, 0.2, 0.1]} />
        <primitive object={ceilingMaterial.clone()} />
      </mesh>
      
      <mesh position={[-width / 2, height - 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 0.2, depth]} />
        <primitive object={ceilingMaterial.clone()} />
      </mesh>
      
      <mesh position={[width / 2, height - 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 0.2, depth]} />
        <primitive object={ceilingMaterial.clone()} />
      </mesh>
      
      {/* Corner decorative elements */}
      {[
        [-width / 2, height / 4, -depth / 2],
        [width / 2, height / 4, -depth / 2],
        [-width / 2, height / 4, depth / 2],
        [width / 2, height / 4, depth / 2]
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow receiveShadow>
          <boxGeometry args={[0.1, height / 2, 0.1]} />
          <primitive object={wallMaterial.clone()} />
        </mesh>
      ))}
      
      {/* Ambient decoration objects */}
      {/* Wall sconces */}
      <mesh position={[-width / 2 + 0.2, height * 0.7, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.3, 8]} />
        <meshStandardMaterial color={0xFFD700} roughness={0.2} metalness={0.8} />
      </mesh>
      
      <mesh position={[width / 2 - 0.2, height * 0.7, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.3, 8]} />
        <meshStandardMaterial color={0xFFD700} roughness={0.2} metalness={0.8} />
      </mesh>
      
      {/* Floor vents */}
      <mesh position={[width / 4, 0.02, -depth / 4]} receiveShadow>
        <boxGeometry args={[0.6, 0.02, 0.2]} />
        <meshStandardMaterial color={0x808080} roughness={0.3} metalness={0.7} />
      </mesh>
      
      <mesh position={[-width / 4, 0.02, depth / 4]} receiveShadow>
        <boxGeometry args={[0.6, 0.02, 0.2]} />
        <meshStandardMaterial color={0x808080} roughness={0.3} metalness={0.7} />
      </mesh>
    </group>
  );
}