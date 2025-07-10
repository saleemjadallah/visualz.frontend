'use client';

import { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
// import { useDrag } from '@react-three/cannon'; // Not available in current version
import * as THREE from 'three';
import { useTextureManager } from './TextureManager';
import { FurnitureModel } from './FurnitureModels';
import { GLTFModel } from './GLTFModels';

interface FurnitureItem3DProps {
  furniture: {
    id: string;
    name: string;
    category: string;
    x: number;
    y: number; // This will be treated as z-position in 3D
    width: number;
    height: number; // This will be treated as depth in 3D
    rotation: number;
    color?: string;
    style?: string;
  };
  isSelected: boolean;
  onClick: () => void;
  onMove: (position: { x: number; y: number }) => void;
  culturalTheme?: string;
}

export function FurnitureItem3D({ 
  furniture, 
  isSelected, 
  onClick, 
  onMove,
  culturalTheme = 'modern'
}: FurnitureItem3DProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const { getMaterial } = useTextureManager();

  // Convert 2D position to 3D (y becomes z, add appropriate height)
  const position: [number, number, number] = [
    furniture.x, 
    getFurnitureHeight(furniture.category) / 2, // Place on floor
    furniture.y
  ];

  // Get furniture color or default
  const furnitureColor = furniture.color ? new THREE.Color(furniture.color) : getFurnitureColor(furniture.category);

  // Get furniture dimensions based on category
  const dimensions = getFurnitureDimensions(furniture);

  function getFurnitureHeight(category: string): number {
    switch (category) {
      case 'table':
      case 'desk':
        return 2.5;
      case 'chair':
      case 'seating':
        return 3;
      case 'sofa':
      case 'couch':
        return 2.8;
      case 'bed':
        return 2;
      case 'cabinet':
      case 'dresser':
        return 3.5;
      case 'bookshelf':
        return 6;
      default:
        return 2.5;
    }
  }

  function getFurnitureColor(category: string): THREE.Color {
    switch (category) {
      case 'table':
      case 'desk':
        return new THREE.Color('#8B4513'); // Brown wood
      case 'chair':
      case 'seating':
        return new THREE.Color('#4A5568'); // Gray
      case 'sofa':
      case 'couch':
        return new THREE.Color('#2D3748'); // Dark gray
      case 'bed':
        return new THREE.Color('#E2E8F0'); // Light gray
      case 'cabinet':
      case 'dresser':
        return new THREE.Color('#744210'); // Dark brown
      case 'bookshelf':
        return new THREE.Color('#8B4513'); // Brown
      default:
        return new THREE.Color('#A0AEC0'); // Default gray
    }
  }

  function getFurnitureDimensions(furniture: any) {
    const height = getFurnitureHeight(furniture.category);
    return {
      width: furniture.width,
      height: height,
      depth: furniture.height // 2D height becomes 3D depth
    };
  }

  function getFurnitureGeometry(category: string, dimensions: any) {
    const { width, height, depth } = dimensions;
    
    switch (category) {
      case 'table':
      case 'desk':
        const tableMaterial = getMaterial('oak');
        const tableLegMaterial = getMaterial('walnut');
        return (
          <>
            {/* Table top */}
            <mesh position={[0, height - 0.1, 0]} castShadow receiveShadow>
              <boxGeometry args={[width, 0.2, depth]} />
              <primitive object={tableMaterial} />
            </mesh>
            {/* Table legs */}
            {[
              [-width/2 + 0.1, height/2 - 0.1, -depth/2 + 0.1],
              [width/2 - 0.1, height/2 - 0.1, -depth/2 + 0.1],
              [-width/2 + 0.1, height/2 - 0.1, depth/2 - 0.1],
              [width/2 - 0.1, height/2 - 0.1, depth/2 - 0.1]
            ].map((pos, i) => (
              <mesh key={i} position={pos as [number, number, number]} castShadow receiveShadow>
                <boxGeometry args={[0.2, height - 0.2, 0.2]} />
                <primitive object={tableLegMaterial.clone()} />
              </mesh>
            ))}
          </>
        );
      
      case 'chair':
      case 'seating':
        const chairFrameMaterial = getMaterial('walnut');
        const chairCushionMaterial = getMaterial('linen');
        return (
          <>
            {/* Seat cushion */}
            <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
              <boxGeometry args={[width, 0.2, depth]} />
              <primitive object={chairCushionMaterial} />
            </mesh>
            {/* Backrest */}
            <mesh position={[0, height - 0.5, -depth/2 + 0.1]} castShadow receiveShadow>
              <boxGeometry args={[width, height - 1.5, 0.2]} />
              <primitive object={chairFrameMaterial} />
            </mesh>
            {/* Legs */}
            {[
              [-width/2 + 0.1, 0.75, -depth/2 + 0.1],
              [width/2 - 0.1, 0.75, -depth/2 + 0.1],
              [-width/2 + 0.1, 0.75, depth/2 - 0.1],
              [width/2 - 0.1, 0.75, depth/2 - 0.1]
            ].map((pos, i) => (
              <mesh key={i} position={pos as [number, number, number]} castShadow receiveShadow>
                <boxGeometry args={[0.15, 1.5, 0.15]} />
                <primitive object={chairFrameMaterial.clone()} />
              </mesh>
            ))}
          </>
        );
      
      case 'sofa':
      case 'couch':
        const sofaFrameMaterial = getMaterial('pine');
        const sofaCushionMaterial = getMaterial('velvet');
        return (
          <>
            {/* Main body */}
            <mesh position={[0, height/2, 0]} castShadow receiveShadow>
              <boxGeometry args={[width, height, depth]} />
              <primitive object={sofaCushionMaterial} />
            </mesh>
            {/* Armrests */}
            <mesh position={[-width/2 - 0.15, height/2 + 0.2, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.3, height + 0.4, depth]} />
              <primitive object={sofaFrameMaterial} />
            </mesh>
            <mesh position={[width/2 + 0.15, height/2 + 0.2, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.3, height + 0.4, depth]} />
              <primitive object={sofaFrameMaterial.clone()} />
            </mesh>
          </>
        );
      
      default:
        const defaultMaterial = getMaterial('oak');
        return (
          <mesh castShadow receiveShadow>
            <boxGeometry args={[width, height, depth]} />
            <primitive object={defaultMaterial} />
          </mesh>
        );
    }
  }

  const handleClick = (event: any) => {
    event.stopPropagation();
    onClick();
  };

  const handlePointerOver = () => setHovered(true);
  const handlePointerOut = () => setHovered(false);

  const handlePointerDown = () => setIsDragging(true);
  const handlePointerUp = () => {
    setIsDragging(false);
    if (meshRef.current) {
      const newPosition = meshRef.current.position;
      onMove({ x: newPosition.x, y: newPosition.z });
    }
  };

  return (
    <group
      ref={meshRef}
      position={position}
      rotation={[0, (furniture.rotation * Math.PI) / 180, 0]}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      {/* Selection indicator */}
      {isSelected && (
        <mesh position={[0, -0.05, 0]}>
          <cylinderGeometry args={[Math.max(dimensions.width, dimensions.depth) / 2 + 0.3, Math.max(dimensions.width, dimensions.depth) / 2 + 0.3, 0.1, 32]} />
          <meshBasicMaterial color="#3B82F6" transparent opacity={0.3} />
        </mesh>
      )}

      {/* Hover indicator */}
      {hovered && !isSelected && (
        <mesh position={[0, -0.03, 0]}>
          <cylinderGeometry args={[Math.max(dimensions.width, dimensions.depth) / 2 + 0.2, Math.max(dimensions.width, dimensions.depth) / 2 + 0.2, 0.06, 32]} />
          <meshBasicMaterial color="#10B981" transparent opacity={0.2} />
        </mesh>
      )}

      {/* Realistic GLTF Model with PBR fallback */}
      <GLTFModel
        category={furniture.category}
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
        scale={[dimensions.width / 2, dimensions.height / 2, dimensions.depth / 2]}
        culturalTheme={culturalTheme}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={(event) => handleClick(event)}
      />

      {/* Furniture label */}
      {(isSelected || hovered) && (
        <mesh position={[0, dimensions.height + 0.5, 0]}>
          <planeGeometry args={[2, 0.5]} />
          <meshBasicMaterial color="white" transparent opacity={0.9} />
        </mesh>
      )}
    </group>
  );
}