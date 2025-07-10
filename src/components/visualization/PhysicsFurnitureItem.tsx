'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useBox } from '@react-three/cannon';
import * as THREE from 'three';
import { GLTFModel } from './GLTFModels';
import { useDragWithPhysics, useCollisionDetection, useSnapToGrid } from './PhysicsSystem';

interface PhysicsFurnitureItemProps {
  furniture: {
    id: string;
    name: string;
    category: string;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    color?: string;
    style?: string;
  };
  isSelected: boolean;
  onClick: () => void;
  onMove: (position: { x: number; y: number }) => void;
  culturalTheme?: string;
  enablePhysics?: boolean;
  enableSnapping?: boolean;
  gridSize?: number;
}

export function PhysicsFurnitureItem({
  furniture,
  isSelected,
  onClick,
  onMove,
  culturalTheme = 'modern',
  enablePhysics = true,
  enableSnapping = true,
  gridSize = 0.5
}: PhysicsFurnitureItemProps) {
  const meshRef = useRef<THREE.Group>(null);
  const physicsMeshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [isValidPlacement, setIsValidPlacement] = useState(true);
  const { snapToGrid } = useSnapToGrid(gridSize);
  const { checkValidPlacement, addCollision, removeCollision } = useCollisionDetection();

  // Get furniture dimensions
  const dimensions = {
    width: furniture.width,
    height: getFurnitureHeight(furniture.category),
    depth: furniture.height // 2D height becomes 3D depth
  };

  // Physics body for collision detection and dragging
  const [physicsRef, api] = useBox(() => ({
    mass: 1,
    position: [furniture.x, dimensions.height / 2, furniture.y],
    args: [dimensions.width, dimensions.height, dimensions.depth],
    material: {
      friction: 0.8,
      restitution: 0.1,
    },
    onCollide: (e) => {
      // Handle collisions with other furniture
      const otherObjectId = e.body.userData?.furnitureId;
      if (otherObjectId && otherObjectId !== furniture.id) {
        setIsValidPlacement(false);
        addCollision(furniture.id, {
          position: [furniture.x, furniture.y, furniture.y],
          minDistance: Math.max(dimensions.width, dimensions.depth) / 2 + 0.5,
          conflictingObject: otherObjectId
        });
      }
    }
  }));

  // Advanced drag system
  const { isDragging, onPointerDown } = useDragWithPhysics(physicsMeshRef, api);

  // Update collision detection data
  useEffect(() => {
    addCollision(furniture.id, {
      position: [furniture.x, furniture.y, furniture.y],
      minDistance: Math.max(dimensions.width, dimensions.depth) / 2 + 0.5,
      conflictingObject: null
    });

    return () => {
      removeCollision(furniture.id);
    };
  }, [furniture.id, furniture.x, furniture.y, dimensions, addCollision, removeCollision]);

  // Subscribe to physics position updates
  useEffect(() => {
    const unsubscribe = api.position.subscribe((position) => {
      if (!isDragging) return;

      let finalPosition = [position[0], position[1], position[2]] as [number, number, number];
      
      // Apply snapping if enabled
      if (enableSnapping) {
        finalPosition = snapToGrid(finalPosition);
      }

      // Check placement validity
      const validationResult = checkValidPlacement(furniture.id, finalPosition);
      setIsValidPlacement(validationResult.valid);

      // Update position if valid
      if (validationResult.valid) {
        onMove({ x: finalPosition[0], y: finalPosition[2] });
      }
    });

    return unsubscribe;
  }, [api, isDragging, enableSnapping, snapToGrid, checkValidPlacement, furniture.id, onMove]);

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

  const handleClick = useCallback((event: any) => {
    event.stopPropagation();
    onClick();
  }, [onClick]);

  const handlePointerOver = useCallback(() => {
    setHovered(true);
    document.body.style.cursor = 'grab';
  }, []);

  const handlePointerOut = useCallback(() => {
    setHovered(false);
    document.body.style.cursor = 'default';
  }, []);

  const handleDragStart = useCallback((event: any) => {
    onPointerDown(event);
    document.body.style.cursor = 'grabbing';
  }, [onPointerDown]);

  // Visual feedback colors
  const getIndicatorColor = () => {
    if (!isValidPlacement) return "#EF4444"; // Red for invalid placement
    if (isSelected) return "#3B82F6"; // Blue for selected
    if (hovered) return "#10B981"; // Green for hovered
    return "#6B7280"; // Gray for default
  };

  const getIndicatorOpacity = () => {
    if (!isValidPlacement) return 0.8;
    if (isSelected) return 0.6;
    if (hovered) return 0.4;
    return 0.2;
  };

  return (
    <group
      ref={meshRef}
      position={[furniture.x, 0, furniture.y]}
      rotation={[0, (furniture.rotation * Math.PI) / 180, 0]}
    >
      {/* Physics body (invisible) */}
      <mesh 
        ref={physicsRef as any} 
        visible={false}
        userData={{ furnitureId: furniture.id }}
        onPointerDown={handleDragStart}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <boxGeometry args={[dimensions.width, dimensions.height, dimensions.depth]} />
      </mesh>

      {/* Selection/hover/validity indicator */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry 
          args={[
            Math.max(dimensions.width, dimensions.depth) / 2 + 0.3, 
            Math.max(dimensions.width, dimensions.depth) / 2 + 0.3, 
            0.1, 
            32
          ]} 
        />
        <meshBasicMaterial 
          color={getIndicatorColor()} 
          transparent 
          opacity={getIndicatorOpacity()}
        />
      </mesh>

      {/* Invalid placement warning */}
      {!isValidPlacement && (
        <mesh position={[0, dimensions.height + 1, 0]}>
          <sphereGeometry args={[0.2]} />
          <meshBasicMaterial color="#EF4444" />
        </mesh>
      )}

      {/* Dragging ghost effect */}
      {isDragging && (
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry 
            args={[
              Math.max(dimensions.width, dimensions.depth) / 2 + 0.1, 
              Math.max(dimensions.width, dimensions.depth) / 2 + 0.1, 
              0.05, 
              32
            ]} 
          />
          <meshBasicMaterial color="#FBBF24" transparent opacity={0.5} />
        </mesh>
      )}

      {/* Snap grid preview when dragging */}
      {isDragging && enableSnapping && (
        <group>
          {/* Grid points around the object */}
          {[-1, 0, 1].map(x =>
            [-1, 0, 1].map(z => (
              <mesh key={`${x}-${z}`} position={[x * gridSize, 0.02, z * gridSize]}>
                <cylinderGeometry args={[0.05, 0.05, 0.04]} />
                <meshBasicMaterial color="#8B5CF6" transparent opacity={0.6} />
              </mesh>
            ))
          )}
        </group>
      )}

      {/* Realistic GLTF Model */}
      <GLTFModel
        category={furniture.category}
        position={[0, dimensions.height / 2, 0]}
        rotation={[0, 0, 0]}
        scale={[
          dimensions.width / 2, 
          dimensions.height / 2, 
          dimensions.depth / 2
        ]}
        culturalTheme={culturalTheme}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      />

      {/* Furniture info label */}
      {(isSelected || hovered) && (
        <group position={[0, dimensions.height + 0.5, 0]}>
          <mesh>
            <planeGeometry args={[3, 0.8]} />
            <meshBasicMaterial 
              color="white" 
              transparent 
              opacity={0.9}
            />
          </mesh>
          {/* Text would go here - using mesh for now */}
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[2.8, 0.6]} />
            <meshBasicMaterial 
              color="#1F2937" 
              transparent 
              opacity={0.8}
            />
          </mesh>
        </group>
      )}

      {/* Distance measurements when selected */}
      {isSelected && (
        <DistanceMeasurements 
          furnitureId={furniture.id}
          position={[furniture.x, dimensions.height / 2, furniture.y]}
          dimensions={dimensions}
        />
      )}
    </group>
  );
}

// Distance measurement component
function DistanceMeasurements({
  furnitureId,
  position,
  dimensions
}: {
  furnitureId: string;
  position: [number, number, number];
  dimensions: { width: number; height: number; depth: number };
}) {
  const { scene } = useThree();
  const [nearbyObjects, setNearbyObjects] = useState<any[]>([]);

  useEffect(() => {
    // Find nearby furniture objects
    const objects: any[] = [];
    scene.traverse((child) => {
      if (child.userData?.furnitureId && child.userData.furnitureId !== furnitureId) {
        const distance = child.position.distanceTo(new THREE.Vector3(...position));
        if (distance < 10) { // Within 10 units
          objects.push({
            id: child.userData.furnitureId,
            position: child.position,
            distance
          });
        }
      }
    });
    setNearbyObjects(objects);
  }, [scene, furnitureId, position]);

  return (
    <group>
      {nearbyObjects.map((obj, index) => {
        const start = new THREE.Vector3(...position);
        const end = obj.position.clone();
        const midpoint = start.clone().lerp(end, 0.5);
        
        return (
          <group key={`distance-${index}`}>
            {/* Distance line */}
            <line>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  array={new Float32Array([
                    start.x, start.y, start.z,
                    end.x, end.y, end.z
                  ])}
                  count={2}
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial color="#8B5CF6" />
            </line>
            
            {/* Distance label */}
            <mesh position={[midpoint.x, midpoint.y + 0.5, midpoint.z]}>
              <planeGeometry args={[1, 0.3]} />
              <meshBasicMaterial color="white" transparent opacity={0.9} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}