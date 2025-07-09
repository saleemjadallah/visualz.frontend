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
      
      case 'bookshelf':
      case 'shelf':
        return <Bookshelf width={width} height={height} depth={depth} culturalTheme={culturalTheme} />;
      
      case 'armchair':
      case 'lounge-chair':
        return <Armchair width={width} height={height} depth={depth} culturalTheme={culturalTheme} />;
      
      case 'ottoman':
      case 'footstool':
        return <Ottoman width={width} height={height} depth={depth} culturalTheme={culturalTheme} />;
      
      case 'coffee-table':
        return <CoffeeTable width={width} height={height} depth={depth} culturalTheme={culturalTheme} />;
      
      case 'side-table':
      case 'nightstand':
        return <SideTable width={width} height={height} depth={depth} culturalTheme={culturalTheme} />;
      
      case 'dining-table':
        return <DiningTable width={width} height={height} depth={depth} culturalTheme={culturalTheme} />;
      
      case 'bar':
      case 'bar-counter':
        return <BarCounter width={width} height={height} depth={depth} culturalTheme={culturalTheme} />;
      
      case 'bar-stool':
        return <BarStool width={width} height={height} depth={depth} culturalTheme={culturalTheme} />;
      
      case 'bench':
        return <Bench width={width} height={height} depth={depth} culturalTheme={culturalTheme} />;
      
      case 'piano':
        return <Piano width={width} height={height} depth={depth} culturalTheme={culturalTheme} />;
      
      case 'plant':
      case 'decoration':
        return <Plant width={width} height={height} depth={depth} culturalTheme={culturalTheme} />;
      
      case 'chandelier':
      case 'light-fixture':
        return <Chandelier width={width} height={height} depth={depth} culturalTheme={culturalTheme} />;
      
      case 'stage':
      case 'platform':
        return <Stage width={width} height={height} depth={depth} culturalTheme={culturalTheme} />;
      
      case 'buffet':
      case 'sideboard':
        return <Buffet width={width} height={height} depth={depth} culturalTheme={culturalTheme} />;
      
      case 'wardrobe':
      case 'closet':
        return <Wardrobe width={width} height={height} depth={depth} culturalTheme={culturalTheme} />;
      
      case 'mirror':
        return <Mirror width={width} height={height} depth={depth} culturalTheme={culturalTheme} />;
      
      case 'rug':
      case 'carpet':
        return <Rug width={width} height={height} depth={depth} culturalTheme={culturalTheme} />;
      
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

// Bookshelf with shelves
function Bookshelf({ width, height, depth, culturalTheme }: any) {
  const { getMaterial } = useTextureManager();
  
  const shelfMaterial = useMemo(() => {
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

  const numShelves = Math.floor(height / 1.5);

  return (
    <group>
      {/* Back panel */}
      <mesh position={[0, height / 2, -depth / 2 + 0.05]} castShadow receiveShadow>
        <boxGeometry args={[width, height, 0.1]} />
        <primitive object={shelfMaterial} />
      </mesh>
      
      {/* Shelves */}
      {Array.from({ length: numShelves + 1 }, (_, i) => (
        <mesh key={i} position={[0, (i * height) / numShelves, 0]} castShadow receiveShadow>
          <boxGeometry args={[width, 0.1, depth]} />
          <primitive object={shelfMaterial.clone()} />
        </mesh>
      ))}
      
      {/* Side panels */}
      <mesh position={[-width / 2 + 0.05, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.1, height, depth]} />
        <primitive object={shelfMaterial.clone()} />
      </mesh>
      
      <mesh position={[width / 2 - 0.05, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.1, height, depth]} />
        <primitive object={shelfMaterial.clone()} />
      </mesh>
    </group>
  );
}

// Armchair with wide seat
function Armchair({ width, height, depth, culturalTheme }: any) {
  const { getMaterial } = useTextureManager();
  
  const frameMaterial = useMemo(() => getMaterial('walnut'), [getMaterial]);
  const cushionMaterial = useMemo(() => getMaterial('velvet'), [getMaterial]);

  return (
    <group>
      {/* Seat */}
      <mesh position={[0, 1.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, 0.4, depth]} />
        <primitive object={cushionMaterial} />
      </mesh>
      
      {/* Backrest */}
      <mesh position={[0, height - 0.8, -depth / 2 + 0.1]} castShadow receiveShadow>
        <boxGeometry args={[width, height - 1.4, 0.3]} />
        <primitive object={frameMaterial} />
      </mesh>
      
      {/* Wide armrests */}
      <mesh position={[-width / 2 - 0.3, 2.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 1.2, depth]} />
        <primitive object={frameMaterial.clone()} />
      </mesh>
      
      <mesh position={[width / 2 + 0.3, 2.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 1.2, depth]} />
        <primitive object={frameMaterial.clone()} />
      </mesh>
    </group>
  );
}

// Ottoman/footstool
function Ottoman({ width, height, depth, culturalTheme }: any) {
  const { getMaterial } = useTextureManager();
  
  const cushionMaterial = useMemo(() => getMaterial('velvet'), [getMaterial]);
  const legMaterial = useMemo(() => getMaterial('walnut'), [getMaterial]);

  return (
    <group>
      {/* Cushion top */}
      <mesh position={[0, height - 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, 0.3, depth]} />
        <primitive object={cushionMaterial} />
      </mesh>
      
      {/* Legs */}
      {[
        [-width / 3, height / 2, -depth / 3],
        [width / 3, height / 2, -depth / 3],
        [-width / 3, height / 2, depth / 3],
        [width / 3, height / 2, depth / 3]
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow receiveShadow>
          <cylinderGeometry args={[0.05, 0.05, height - 0.3, 8]} />
          <primitive object={legMaterial.clone()} />
        </mesh>
      ))}
    </group>
  );
}

// Coffee table - low and wide
function CoffeeTable({ width, height, depth, culturalTheme }: any) {
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

  return (
    <group>
      {/* Table top */}
      <mesh position={[0, height - 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, 0.2, depth]} />
        <primitive object={tableMaterial} />
      </mesh>
      
      {/* Lower shelf */}
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width * 0.8, 0.1, depth * 0.8]} />
        <primitive object={tableMaterial.clone()} />
      </mesh>
      
      {/* Legs */}
      {[
        [-width / 2 + 0.2, height / 2, -depth / 2 + 0.2],
        [width / 2 - 0.2, height / 2, -depth / 2 + 0.2],
        [-width / 2 + 0.2, height / 2, depth / 2 - 0.2],
        [width / 2 - 0.2, height / 2, depth / 2 - 0.2]
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow receiveShadow>
          <boxGeometry args={[0.15, height - 0.2, 0.15]} />
          <primitive object={tableMaterial.clone()} />
        </mesh>
      ))}
    </group>
  );
}

// Side table/nightstand
function SideTable({ width, height, depth, culturalTheme }: any) {
  const { getMaterial } = useTextureManager();
  
  const tableMaterial = useMemo(() => getMaterial('oak'), [getMaterial]);

  return (
    <group>
      {/* Table top */}
      <mesh position={[0, height - 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, 0.2, depth]} />
        <primitive object={tableMaterial} />
      </mesh>
      
      {/* Drawer */}
      <mesh position={[0, height - 0.5, depth / 2 - 0.05]} castShadow receiveShadow>
        <boxGeometry args={[width * 0.8, 0.3, 0.1]} />
        <primitive object={tableMaterial.clone()} />
      </mesh>
      
      {/* Drawer handle */}
      <mesh position={[0, height - 0.5, depth / 2 + 0.02]} castShadow receiveShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.1, 8]} />
        <primitive object={getMaterial('brass')} />
      </mesh>
      
      {/* Legs */}
      {[
        [-width / 2 + 0.1, height / 2, -depth / 2 + 0.1],
        [width / 2 - 0.1, height / 2, -depth / 2 + 0.1],
        [-width / 2 + 0.1, height / 2, depth / 2 - 0.1],
        [width / 2 - 0.1, height / 2, depth / 2 - 0.1]
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow receiveShadow>
          <boxGeometry args={[0.1, height - 0.2, 0.1]} />
          <primitive object={tableMaterial.clone()} />
        </mesh>
      ))}
    </group>
  );
}

// Dining table - larger rectangular table
function DiningTable({ width, height, depth, culturalTheme }: any) {
  const { getMaterial } = useTextureManager();
  
  const tableMaterial = useMemo(() => getMaterial('walnut'), [getMaterial]);

  return (
    <group>
      {/* Table top */}
      <mesh position={[0, height - 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, 0.2, depth]} />
        <primitive object={tableMaterial} />
      </mesh>
      
      {/* Support beam */}
      <mesh position={[0, height - 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[width * 0.6, 0.2, 0.2]} />
        <primitive object={tableMaterial.clone()} />
      </mesh>
      
      {/* Legs */}
      {[
        [-width / 3, height / 2, -depth / 2 + 0.1],
        [width / 3, height / 2, -depth / 2 + 0.1],
        [-width / 3, height / 2, depth / 2 - 0.1],
        [width / 3, height / 2, depth / 2 - 0.1]
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow receiveShadow>
          <boxGeometry args={[0.2, height - 0.2, 0.2]} />
          <primitive object={tableMaterial.clone()} />
        </mesh>
      ))}
    </group>
  );
}

// Bar counter
function BarCounter({ width, height, depth, culturalTheme }: any) {
  const { getMaterial } = useTextureManager();
  
  const barMaterial = useMemo(() => getMaterial('oak'), [getMaterial]);
  const metalMaterial = useMemo(() => getMaterial('steel'), [getMaterial]);

  return (
    <group>
      {/* Counter top */}
      <mesh position={[0, height - 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, 0.2, depth]} />
        <primitive object={barMaterial} />
      </mesh>
      
      {/* Base cabinet */}
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height - 0.2, depth]} />
        <primitive object={barMaterial.clone()} />
      </mesh>
      
      {/* Foot rail */}
      <mesh position={[0, 0.3, depth / 2 - 0.1]} castShadow receiveShadow>
        <cylinderGeometry args={[0.02, 0.02, width * 0.8, 8]} />
        <primitive object={metalMaterial} />
      </mesh>
    </group>
  );
}

// Bar stool
function BarStool({ width, height, depth, culturalTheme }: any) {
  const { getMaterial } = useTextureManager();
  
  const seatMaterial = useMemo(() => getMaterial('linen'), [getMaterial]);
  const legMaterial = useMemo(() => getMaterial('steel'), [getMaterial]);

  return (
    <group>
      {/* Seat */}
      <mesh position={[0, height - 0.1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[width / 2, width / 2, 0.2, 16]} />
        <primitive object={seatMaterial} />
      </mesh>
      
      {/* Central leg */}
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.05, 0.05, height - 0.2, 8]} />
        <primitive object={legMaterial} />
      </mesh>
      
      {/* Base */}
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[width / 2, width / 2, 0.2, 16]} />
        <primitive object={legMaterial.clone()} />
      </mesh>
      
      {/* Foot rest */}
      <mesh position={[0, height * 0.6, 0]} castShadow receiveShadow>
        <torusGeometry args={[width / 3, 0.02, 8, 16]} />
        <primitive object={legMaterial.clone()} />
      </mesh>
    </group>
  );
}

// Bench
function Bench({ width, height, depth, culturalTheme }: any) {
  const { getMaterial } = useTextureManager();
  
  const benchMaterial = useMemo(() => getMaterial('oak'), [getMaterial]);

  return (
    <group>
      {/* Seat */}
      <mesh position={[0, height - 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, 0.2, depth]} />
        <primitive object={benchMaterial} />
      </mesh>
      
      {/* Legs */}
      <mesh position={[-width / 2 + 0.2, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.3, height - 0.2, depth]} />
        <primitive object={benchMaterial.clone()} />
      </mesh>
      
      <mesh position={[width / 2 - 0.2, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.3, height - 0.2, depth]} />
        <primitive object={benchMaterial.clone()} />
      </mesh>
    </group>
  );
}

// Piano
function Piano({ width, height, depth, culturalTheme }: any) {
  const { getMaterial } = useTextureManager();
  
  const pianoMaterial = useMemo(() => getMaterial('walnut'), [getMaterial]);

  return (
    <group>
      {/* Piano body */}
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <primitive object={pianoMaterial} />
      </mesh>
      
      {/* Piano lid */}
      <mesh position={[0, height + 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, 0.1, depth]} />
        <primitive object={pianoMaterial.clone()} />
      </mesh>
      
      {/* Legs */}
      {[
        [-width / 3, height / 2, -depth / 3],
        [width / 3, height / 2, -depth / 3],
        [0, height / 2, depth / 3]
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow receiveShadow>
          <cylinderGeometry args={[0.1, 0.1, height, 8]} />
          <primitive object={pianoMaterial.clone()} />
        </mesh>
      ))}
    </group>
  );
}

// Plant decoration
function Plant({ width, height, depth, culturalTheme }: any) {
  const { getMaterial } = useTextureManager();
  
  const potMaterial = useMemo(() => getMaterial('granite'), [getMaterial]);
  const plantMaterial = useMemo(() => getMaterial('bamboo'), [getMaterial]);

  return (
    <group>
      {/* Pot */}
      <mesh position={[0, height * 0.3, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[width / 2, width / 3, height * 0.6, 16]} />
        <primitive object={potMaterial} />
      </mesh>
      
      {/* Plant stem */}
      <mesh position={[0, height * 0.7, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.05, 0.05, height * 0.4, 8]} />
        <primitive object={plantMaterial} />
      </mesh>
      
      {/* Leaves */}
      {[
        [-0.2, height * 0.8, 0],
        [0.2, height * 0.8, 0],
        [0, height * 0.9, 0.2],
        [0, height * 0.9, -0.2]
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow receiveShadow>
          <sphereGeometry args={[0.15, 8, 8]} />
          <primitive object={plantMaterial.clone()} />
        </mesh>
      ))}
    </group>
  );
}

// Chandelier
function Chandelier({ width, height, depth, culturalTheme }: any) {
  const { getMaterial } = useTextureManager();
  
  const metalMaterial = useMemo(() => getMaterial('brass'), [getMaterial]);
  const glassMaterial = useMemo(() => getMaterial('marble'), [getMaterial]);

  return (
    <group>
      {/* Central chain */}
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.02, 0.02, height, 8]} />
        <primitive object={metalMaterial} />
      </mesh>
      
      {/* Main body */}
      <mesh position={[0, height * 0.3, 0]} castShadow receiveShadow>
        <sphereGeometry args={[width / 2, 16, 16]} />
        <primitive object={metalMaterial.clone()} />
      </mesh>
      
      {/* Light bulbs */}
      {[
        [-width / 3, height * 0.2, 0],
        [width / 3, height * 0.2, 0],
        [0, height * 0.2, width / 3],
        [0, height * 0.2, -width / 3]
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow receiveShadow>
          <sphereGeometry args={[0.1, 8, 8]} />
          <primitive object={glassMaterial.clone()} />
        </mesh>
      ))}
    </group>
  );
}

// Stage platform
function Stage({ width, height, depth, culturalTheme }: any) {
  const { getMaterial } = useTextureManager();
  
  const stageMaterial = useMemo(() => getMaterial('oak'), [getMaterial]);

  return (
    <group>
      {/* Platform */}
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <primitive object={stageMaterial} />
      </mesh>
      
      {/* Support beams */}
      {[
        [-width / 3, height / 4, -depth / 3],
        [width / 3, height / 4, -depth / 3],
        [-width / 3, height / 4, depth / 3],
        [width / 3, height / 4, depth / 3]
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow receiveShadow>
          <boxGeometry args={[0.2, height / 2, 0.2]} />
          <primitive object={stageMaterial.clone()} />
        </mesh>
      ))}
    </group>
  );
}

// Buffet/sideboard
function Buffet({ width, height, depth, culturalTheme }: any) {
  const { getMaterial } = useTextureManager();
  
  const buffetMaterial = useMemo(() => getMaterial('walnut'), [getMaterial]);

  return (
    <group>
      {/* Main body */}
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <primitive object={buffetMaterial} />
      </mesh>
      
      {/* Doors */}
      <mesh position={[-width / 4, height / 2, depth / 2 + 0.02]} castShadow receiveShadow>
        <boxGeometry args={[width / 2 - 0.1, height * 0.8, 0.05]} />
        <primitive object={buffetMaterial.clone()} />
      </mesh>
      
      <mesh position={[width / 4, height / 2, depth / 2 + 0.02]} castShadow receiveShadow>
        <boxGeometry args={[width / 2 - 0.1, height * 0.8, 0.05]} />
        <primitive object={buffetMaterial.clone()} />
      </mesh>
      
      {/* Legs */}
      {[
        [-width / 2 + 0.1, height / 4, -depth / 2 + 0.1],
        [width / 2 - 0.1, height / 4, -depth / 2 + 0.1],
        [-width / 2 + 0.1, height / 4, depth / 2 - 0.1],
        [width / 2 - 0.1, height / 4, depth / 2 - 0.1]
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow receiveShadow>
          <cylinderGeometry args={[0.05, 0.05, height / 2, 8]} />
          <primitive object={buffetMaterial.clone()} />
        </mesh>
      ))}
    </group>
  );
}

// Wardrobe
function Wardrobe({ width, height, depth, culturalTheme }: any) {
  const { getMaterial } = useTextureManager();
  
  const wardrobeMaterial = useMemo(() => getMaterial('oak'), [getMaterial]);

  return (
    <group>
      {/* Main body */}
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <primitive object={wardrobeMaterial} />
      </mesh>
      
      {/* Doors */}
      <mesh position={[-width / 4, height / 2, depth / 2 + 0.02]} castShadow receiveShadow>
        <boxGeometry args={[width / 2 - 0.1, height * 0.9, 0.05]} />
        <primitive object={wardrobeMaterial.clone()} />
      </mesh>
      
      <mesh position={[width / 4, height / 2, depth / 2 + 0.02]} castShadow receiveShadow>
        <boxGeometry args={[width / 2 - 0.1, height * 0.9, 0.05]} />
        <primitive object={wardrobeMaterial.clone()} />
      </mesh>
      
      {/* Handles */}
      <mesh position={[-width / 6, height / 2, depth / 2 + 0.05]} castShadow receiveShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.1, 8]} />
        <primitive object={getMaterial('brass')} />
      </mesh>
      
      <mesh position={[width / 6, height / 2, depth / 2 + 0.05]} castShadow receiveShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.1, 8]} />
        <primitive object={getMaterial('brass')} />
      </mesh>
    </group>
  );
}

// Mirror
function Mirror({ width, height, depth, culturalTheme }: any) {
  const { getMaterial } = useTextureManager();
  
  const frameMaterial = useMemo(() => getMaterial('walnut'), [getMaterial]);

  return (
    <group>
      {/* Frame */}
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <primitive object={frameMaterial} />
      </mesh>
      
      {/* Mirror surface */}
      <mesh position={[0, height / 2, depth / 2 + 0.01]} castShadow receiveShadow>
        <boxGeometry args={[width * 0.9, height * 0.9, 0.02]} />
        <meshStandardMaterial color={0xF0F0F0} roughness={0.0} metalness={0.9} />
      </mesh>
    </group>
  );
}

// Rug/carpet
function Rug({ width, height, depth, culturalTheme }: any) {
  const { getMaterial } = useTextureManager();
  
  const rugMaterial = useMemo(() => {
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
        return getMaterial('carpet');
    }
  }, [culturalTheme, getMaterial]);

  return (
    <group>
      {/* Main rug surface */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <boxGeometry args={[width, depth, height]} />
        <primitive object={rugMaterial} />
      </mesh>
      
      {/* Rug border */}
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <boxGeometry args={[width * 1.1, depth * 1.1, height / 2]} />
        <primitive object={rugMaterial.clone()} />
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