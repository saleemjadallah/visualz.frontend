'use client';

import React, { useRef, useState, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Physics, useBox, usePlane, useConvexPolyhedron } from '@react-three/cannon';
import * as THREE from 'three';

// Physics-enabled furniture component
interface PhysicsFurnitureProps {
  category: string;
  position: [number, number, number];
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  onPositionChange?: (position: [number, number, number]) => void;
  onCollision?: (otherObject: any) => void;
  isSelected?: boolean;
  isDragging?: boolean;
}

export function PhysicsFurniture({
  category,
  position,
  dimensions,
  onPositionChange,
  onCollision,
  isSelected = false,
  isDragging = false
}: PhysicsFurnitureProps) {
  const [ref, api] = useBox(() => ({
    mass: isDragging ? 0 : 1, // Make kinematic when dragging
    position,
    args: [dimensions.width, dimensions.height, dimensions.depth],
    material: {
      friction: 0.6,
      restitution: 0.1,
    },
    onCollide: (e) => {
      if (onCollision) {
        onCollision(e.body);
      }
    }
  }));

  // Update physics when dragging state changes
  React.useEffect(() => {
    if (isDragging) {
      api.mass.set(0); // Make kinematic
      api.velocity.set(0, 0, 0);
      api.angularVelocity.set(0, 0, 0);
    } else {
      api.mass.set(1); // Make dynamic
    }
  }, [isDragging, api]);

  // Subscribe to position changes
  React.useEffect(() => {
    const unsubscribe = api.position.subscribe((position) => {
      if (onPositionChange && !isDragging) {
        onPositionChange(position as [number, number, number]);
      }
    });
    return unsubscribe;
  }, [api, onPositionChange, isDragging]);

  return (
    <mesh ref={ref as any} castShadow receiveShadow>
      <boxGeometry args={[dimensions.width, dimensions.height, dimensions.depth]} />
      <meshStandardMaterial 
        color={isSelected ? "#3B82F6" : "#8B4513"} 
        transparent 
        opacity={isDragging ? 0.7 : 1.0}
      />
    </mesh>
  );
}

// Room boundaries with physics
export function PhysicsRoom({
  width,
  height,
  depth
}: {
  width: number;
  height: number;
  depth: number;
}) {
  // Floor
  const [floorRef] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [width / 2, 0, depth / 2],
    material: {
      friction: 0.8,
      restitution: 0.1,
    }
  }));

  // Walls
  const [leftWallRef] = usePlane(() => ({
    rotation: [0, Math.PI / 2, 0],
    position: [0, height / 2, depth / 2],
  }));

  const [rightWallRef] = usePlane(() => ({
    rotation: [0, -Math.PI / 2, 0],
    position: [width, height / 2, depth / 2],
  }));

  const [backWallRef] = usePlane(() => ({
    rotation: [0, 0, 0],
    position: [width / 2, height / 2, 0],
  }));

  const [frontWallRef] = usePlane(() => ({
    rotation: [0, Math.PI, 0],
    position: [width / 2, height / 2, depth],
  }));

  return (
    <>
      {/* Invisible physics boundaries */}
      <mesh ref={floorRef as any} visible={false}>
        <planeGeometry args={[width * 2, depth * 2]} />
      </mesh>
      <mesh ref={leftWallRef as any} visible={false}>
        <planeGeometry args={[depth * 2, height * 2]} />
      </mesh>
      <mesh ref={rightWallRef as any} visible={false}>
        <planeGeometry args={[depth * 2, height * 2]} />
      </mesh>
      <mesh ref={backWallRef as any} visible={false}>
        <planeGeometry args={[width * 2, height * 2]} />
      </mesh>
      <mesh ref={frontWallRef as any} visible={false}>
        <planeGeometry args={[width * 2, height * 2]} />
      </mesh>
    </>
  );
}

// Advanced drag system with physics
export function useDragWithPhysics(ref: React.RefObject<THREE.Mesh>, api: any) {
  const { camera, raycaster, mouse, scene, gl } = useThree();
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(new THREE.Vector3());
  const dragPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));
  const intersectionPoint = useRef(new THREE.Vector3());

  const handlePointerDown = useCallback((event: any) => {
    if (!ref.current) return;

    event.stopPropagation();
    setIsDragging(true);

    // Calculate offset from object center to click point
    const intersection = event.intersections[0];
    if (intersection) {
      const objectPosition = ref.current.position;
      dragOffset.subVectors(intersection.point, objectPosition);
    }

    // Set up drag plane at object's Y position
    dragPlane.current.setFromNormalAndCoplanarPoint(
      new THREE.Vector3(0, 1, 0),
      ref.current.position
    );

    // Make object kinematic for dragging
    api.mass.set(0);
    api.velocity.set(0, 0, 0);
    api.angularVelocity.set(0, 0, 0);

    gl.domElement.style.cursor = 'grabbing';
  }, [ref, api, gl]);

  const handlePointerMove = useCallback((event: PointerEvent) => {
    if (!isDragging || !ref.current) return;

    // Update mouse position for raycasting
    const rect = gl.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Raycast to drag plane
    raycaster.setFromCamera(mouse, camera);
    
    if (raycaster.ray.intersectPlane(dragPlane.current, intersectionPoint.current)) {
      // Apply offset to get final position
      const newPosition = intersectionPoint.current.clone().sub(dragOffset);
      
      // Update physics body position
      api.position.set(newPosition.x, newPosition.y, newPosition.z);
    }
  }, [isDragging, camera, raycaster, mouse, api, gl]);

  const handlePointerUp = useCallback(() => {
    if (!isDragging) return;

    setIsDragging(false);
    gl.domElement.style.cursor = 'grab';

    // Make object dynamic again for physics
    setTimeout(() => {
      api.mass.set(1);
    }, 100); // Small delay to prevent immediate falling
  }, [isDragging, api, gl]);

  // Set up global event listeners
  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      return () => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
      };
    }
  }, [isDragging, handlePointerMove, handlePointerUp]);

  return {
    isDragging,
    onPointerDown: handlePointerDown,
  };
}

// Collision detection and response system
export function useCollisionDetection() {
  const [collisions, setCollisions] = useState<Map<string, any>>(new Map());

  const addCollision = useCallback((objectId: string, collisionData: any) => {
    setCollisions(prev => new Map(prev.set(objectId, collisionData)));
  }, []);

  const removeCollision = useCallback((objectId: string) => {
    setCollisions(prev => {
      const newMap = new Map(prev);
      newMap.delete(objectId);
      return newMap;
    });
  }, []);

  const checkValidPlacement = useCallback((objectId: string, position: [number, number, number]) => {
    // Check if position overlaps with other objects
    for (const [id, collision] of collisions) {
      if (id !== objectId) {
        const distance = Math.sqrt(
          Math.pow(collision.position[0] - position[0], 2) +
          Math.pow(collision.position[2] - position[2], 2)
        );
        
        // If too close, placement is invalid
        if (distance < collision.minDistance) {
          return {
            valid: false,
            reason: 'Too close to other furniture',
            conflictingObject: id
          };
        }
      }
    }

    return { valid: true };
  }, [collisions]);

  return {
    collisions,
    addCollision,
    removeCollision,
    checkValidPlacement
  };
}

// Snap-to-grid system for precise placement
export function useSnapToGrid(gridSize: number = 0.5) {
  const snapToGrid = useCallback((position: [number, number, number]): [number, number, number] => {
    return [
      Math.round(position[0] / gridSize) * gridSize,
      position[1], // Don't snap Y axis
      Math.round(position[2] / gridSize) * gridSize
    ];
  }, [gridSize]);

  const getGridPosition = useCallback((worldPosition: THREE.Vector3): [number, number, number] => {
    return snapToGrid([worldPosition.x, worldPosition.y, worldPosition.z]);
  }, [snapToGrid]);

  return {
    snapToGrid,
    getGridPosition
  };
}

// Physics world wrapper
export function PhysicsWorld({ 
  children, 
  gravity = [0, -9.81, 0],
  iterations = 5
}: {
  children: React.ReactNode;
  gravity?: [number, number, number];
  iterations?: number;
}) {
  return (
    <Physics
      gravity={gravity}
      iterations={iterations}
      allowSleep={true}
    >
      {children}
    </Physics>
  );
}

// Performance monitor for physics simulation
export function PhysicsPerformanceMonitor() {
  const frameTimeRef = useRef<number[]>([]);
  const [averageFrameTime, setAverageFrameTime] = useState(0);

  useFrame((state, delta) => {
    frameTimeRef.current.push(delta * 1000); // Convert to milliseconds
    
    // Keep only last 60 frames
    if (frameTimeRef.current.length > 60) {
      frameTimeRef.current.shift();
    }
    
    // Update average every 30 frames
    if (frameTimeRef.current.length % 30 === 0) {
      const average = frameTimeRef.current.reduce((a, b) => a + b, 0) / frameTimeRef.current.length;
      setAverageFrameTime(average);
      
      // Warn if performance is poor
      if (average > 33) { // More than 30 FPS
        console.warn(`Physics performance warning: Average frame time ${average.toFixed(2)}ms`);
      }
    }
  });

  return null;
}