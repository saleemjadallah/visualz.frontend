'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { useTextureManager } from './TextureManager';

interface FurnitureModelProps {
  category: string;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  culturalTheme?: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

// Enhanced furniture models with better geometry and materials
export function FurnitureModel({ 
  category, 
  dimensions, 
  culturalTheme = 'modern',
  position = [0, 0, 0],
  rotation = [0, 0, 0]
}: FurnitureModelProps) {
  const { getMaterial, getCulturalMaterial } = useTextureManager();
  
  const furnitureGeometry = useMemo(() => {
    const { width, height, depth } = dimensions;
    
    switch (category) {
      case 'table':
      case 'desk':
        return <RoundTable width={width} height={height} depth={depth} culturalTheme={culturalTheme} />;
      
      case 'chair':
      case 'seating':
        return <ModernChair width={width} height={height} depth={depth} culturalTheme={culturalTheme} />;
      
      case 'sofa':
      case 'couch':
        return <ComfortableSofa width={width} height={height} depth={depth} culturalTheme={culturalTheme} />;
      
      case 'bed':
        return <BedFrame width={width} height={height} depth={depth} culturalTheme={culturalTheme} />;
      
      case 'cabinet':
      case 'dresser':
        return <StorageCabinet width={width} height={height} depth={depth} culturalTheme={culturalTheme} />;
      
      default:
        return <BasicFurniture width={width} height={height} depth={depth} culturalTheme={culturalTheme} />;
    }
  }, [category, dimensions, culturalTheme]);

  return (
    <group position={position} rotation={rotation}>
      {furnitureGeometry}
    </group>
  );
}

// Round table with pedestal base
function RoundTable({ width, height, depth, culturalTheme }: any) {
  const { getMaterial } = useTextureManager();
  
  const tableMaterial = useMemo(() => {
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
  }, [culturalTheme, getMaterial]);

  const legMaterial = useMemo(() => getMaterial('walnut'), [getMaterial]);
  const radius = Math.min(width, depth) / 2;

  return (
    <group>
      {/* Table top - circular */}
      <mesh position={[0, height - 0.1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius, 0.2, 32]} />
        <primitive object={tableMaterial} />
      </mesh>
      
      {/* Pedestal base */}
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.5, height - 0.2, 16]} />
        <primitive object={legMaterial} />
      </mesh>
      
      {/* Base disk */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[radius * 0.6, radius * 0.6, 0.4, 32]} />
        <primitive object={legMaterial.clone()} />
      </mesh>
    </group>
  );
}

// Modern chair with curved backrest
function ModernChair({ width, height, depth, culturalTheme }: any) {
  const { getMaterial } = useTextureManager();
  
  const frameMaterial = useMemo(() => getMaterial('walnut'), [getMaterial]);
  const cushionMaterial = useMemo(() => {
    switch (culturalTheme) {
      case 'wabi-sabi':
        return getMaterial('linen');
      case 'hygge':
        return getMaterial('cotton');
      case 'bella-figura':
        return getMaterial('silk');
      case 'savoir-vivre':
        return getMaterial('velvet');
      default:
        return getMaterial('linen');
    }
  }, [culturalTheme, getMaterial]);

  return (
    <group>
      {/* Seat cushion */}
      <mesh position={[0, 1.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[width * 0.9, 0.3, depth * 0.9]} />
        <primitive object={cushionMaterial} />
      </mesh>
      
      {/* Backrest - curved */}
      <mesh position={[0, height - 0.8, -depth * 0.3]} castShadow receiveShadow>
        <boxGeometry args={[width * 0.8, height - 1.4, 0.2]} />
        <primitive object={frameMaterial} />
      </mesh>
      
      {/* Armrests */}
      <mesh position={[-width * 0.4, 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 0.8, depth * 0.8]} />
        <primitive object={frameMaterial.clone()} />
      </mesh>
      
      <mesh position={[width * 0.4, 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 0.8, depth * 0.8]} />
        <primitive object={frameMaterial.clone()} />
      </mesh>
      
      {/* Chair legs */}
      {[
        [-width * 0.35, 0.7, -depth * 0.35],
        [width * 0.35, 0.7, -depth * 0.35],
        [-width * 0.35, 0.7, depth * 0.35],
        [width * 0.35, 0.7, depth * 0.35]
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow receiveShadow>
          <boxGeometry args={[0.1, 1.4, 0.1]} />
          <primitive object={frameMaterial.clone()} />
        </mesh>
      ))}
    </group>
  );
}

// Comfortable sofa with cushions
function ComfortableSofa({ width, height, depth, culturalTheme }: any) {
  const { getMaterial } = useTextureManager();
  
  const frameMaterial = useMemo(() => getMaterial('pine'), [getMaterial]);
  const cushionMaterial = useMemo(() => {
    switch (culturalTheme) {
      case 'wabi-sabi':
        return getMaterial('linen');
      case 'hygge':
        return getMaterial('cotton');
      case 'bella-figura':
        return getMaterial('velvet');
      case 'savoir-vivre':
        return getMaterial('silk');
      default:
        return getMaterial('velvet');
    }
  }, [culturalTheme, getMaterial]);

  return (
    <group>
      {/* Main frame */}
      <mesh position={[0, height * 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height * 0.6, depth]} />
        <primitive object={frameMaterial} />
      </mesh>
      
      {/* Seat cushions */}
      <mesh position={[0, height * 0.7, 0]} castShadow receiveShadow>
        <boxGeometry args={[width * 0.9, 0.3, depth * 0.8]} />
        <primitive object={cushionMaterial} />
      </mesh>
      
      {/* Back cushions */}
      <mesh position={[0, height * 0.8, -depth * 0.3]} castShadow receiveShadow>
        <boxGeometry args={[width * 0.8, height * 0.6, 0.3]} />
        <primitive object={cushionMaterial.clone()} />
      </mesh>
      
      {/* Armrests */}
      <mesh position={[-width * 0.45, height * 0.7, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.4, height * 0.8, depth]} />
        <primitive object={frameMaterial.clone()} />
      </mesh>
      
      <mesh position={[width * 0.45, height * 0.7, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.4, height * 0.8, depth]} />
        <primitive object={frameMaterial.clone()} />
      </mesh>
      
      {/* Sofa legs */}
      {[
        [-width * 0.35, 0.3, -depth * 0.35],
        [width * 0.35, 0.3, -depth * 0.35],
        [-width * 0.35, 0.3, depth * 0.35],
        [width * 0.35, 0.3, depth * 0.35]
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow receiveShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.6, 8]} />
          <primitive object={frameMaterial.clone()} />
        </mesh>
      ))}
    </group>
  );
}

// Bed frame with headboard
function BedFrame({ width, height, depth, culturalTheme }: any) {
  const { getMaterial } = useTextureManager();
  
  const frameMaterial = useMemo(() => getMaterial('walnut'), [getMaterial]);
  const mattressMaterial = useMemo(() => getMaterial('cotton'), [getMaterial]);

  return (
    <group>
      {/* Mattress */}
      <mesh position={[0, height * 0.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[width * 0.9, 0.4, depth * 0.9]} />
        <primitive object={mattressMaterial} />
      </mesh>
      
      {/* Bed frame */}
      <mesh position={[0, height * 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, 0.2, depth]} />
        <primitive object={frameMaterial} />
      </mesh>
      
      {/* Headboard */}
      <mesh position={[0, height * 0.8, -depth * 0.45]} castShadow receiveShadow>
        <boxGeometry args={[width * 0.8, height * 0.8, 0.2]} />
        <primitive object={frameMaterial.clone()} />
      </mesh>
      
      {/* Bed legs */}
      {[
        [-width * 0.4, 0.2, -depth * 0.4],
        [width * 0.4, 0.2, -depth * 0.4],
        [-width * 0.4, 0.2, depth * 0.4],
        [width * 0.4, 0.2, depth * 0.4]
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow receiveShadow>
          <boxGeometry args={[0.1, 0.4, 0.1]} />
          <primitive object={frameMaterial.clone()} />
        </mesh>
      ))}
    </group>
  );
}

// Storage cabinet with doors
function StorageCabinet({ width, height, depth, culturalTheme }: any) {
  const { getMaterial } = useTextureManager();
  
  const cabinetMaterial = useMemo(() => {
    switch (culturalTheme) {
      case 'wabi-sabi':
        return getMaterial('bamboo');
      case 'hygge':
        return getMaterial('pine');
      case 'bella-figura':
        return getMaterial('walnut');
      case 'savoir-vivre':
        return getMaterial('oak');
      default:
        return getMaterial('oak');
    }
  }, [culturalTheme, getMaterial]);

  const handleMaterial = useMemo(() => getMaterial('brass'), [getMaterial]);

  return (
    <group>
      {/* Main cabinet body */}
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <primitive object={cabinetMaterial} />
      </mesh>
      
      {/* Cabinet doors */}
      <mesh position={[-width * 0.15, height / 2, depth * 0.51]} castShadow receiveShadow>
        <boxGeometry args={[width * 0.3, height * 0.8, 0.05]} />
        <primitive object={cabinetMaterial.clone()} />
      </mesh>
      
      <mesh position={[width * 0.15, height / 2, depth * 0.51]} castShadow receiveShadow>
        <boxGeometry args={[width * 0.3, height * 0.8, 0.05]} />
        <primitive object={cabinetMaterial.clone()} />
      </mesh>
      
      {/* Door handles */}
      <mesh position={[-width * 0.25, height / 2, depth * 0.54]} castShadow receiveShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.1, 8]} />
        <primitive object={handleMaterial} />
      </mesh>
      
      <mesh position={[width * 0.25, height / 2, depth * 0.54]} castShadow receiveShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.1, 8]} />
        <primitive object={handleMaterial.clone()} />
      </mesh>
    </group>
  );
}

// Basic furniture fallback
function BasicFurniture({ width, height, depth, culturalTheme }: any) {
  const { getMaterial } = useTextureManager();
  
  const material = useMemo(() => getMaterial('oak'), [getMaterial]);

  return (
    <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
      <boxGeometry args={[width, height, depth]} />
      <primitive object={material} />
    </mesh>
  );
}