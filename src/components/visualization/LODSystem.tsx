'use client';

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTFModel } from './GLTFModels';

// LOD levels for different model complexities
export enum LODLevel {
  HIGH = 0,    // Full detail - close up
  MEDIUM = 1,  // Reduced detail - medium distance  
  LOW = 2,     // Basic geometry - far distance
  CULLED = 3   // Not rendered - very far
}

interface LODFurnitureProps {
  category: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  culturalTheme?: string;
  maxDistance?: number;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
  onClick?: (event?: any) => void;
}

// LOD-enabled furniture component
export function LODFurniture({
  category,
  position,
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  culturalTheme = 'modern',
  maxDistance = 50,
  onPointerOver,
  onPointerOut,
  onClick
}: LODFurnitureProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [currentLOD, setCurrentLOD] = useState<LODLevel>(LODLevel.HIGH);
  const [distance, setDistance] = useState(0);
  const { camera } = useThree();

  // Calculate distance to camera every frame
  useFrame(() => {
    if (!meshRef.current) return;

    const objectPosition = new THREE.Vector3(...position);
    const cameraPosition = camera.position;
    const dist = objectPosition.distanceTo(cameraPosition);
    
    setDistance(dist);

    // Determine LOD level based on distance
    let newLOD: LODLevel;
    if (dist > maxDistance) {
      newLOD = LODLevel.CULLED;
    } else if (dist > maxDistance * 0.7) {
      newLOD = LODLevel.LOW;
    } else if (dist > maxDistance * 0.3) {
      newLOD = LODLevel.MEDIUM;
    } else {
      newLOD = LODLevel.HIGH;
    }

    if (newLOD !== currentLOD) {
      setCurrentLOD(newLOD);
    }
  });

  // Don't render if culled
  if (currentLOD === LODLevel.CULLED) {
    return null;
  }

  return (
    <group
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={scale}
    >
      {currentLOD === LODLevel.HIGH && (
        <HighDetailModel
          category={category}
          culturalTheme={culturalTheme}
          onPointerOver={onPointerOver}
          onPointerOut={onPointerOut}
          onClick={onClick}
        />
      )}
      
      {currentLOD === LODLevel.MEDIUM && (
        <MediumDetailModel
          category={category}
          culturalTheme={culturalTheme}
          onPointerOver={onPointerOver}
          onPointerOut={onPointerOut}
          onClick={onClick}
        />
      )}
      
      {currentLOD === LODLevel.LOW && (
        <LowDetailModel
          category={category}
          onPointerOver={onPointerOver}
          onPointerOut={onPointerOut}
          onClick={onClick}
        />
      )}

      {/* Debug info - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <mesh position={[0, 3, 0]}>
          <planeGeometry args={[2, 0.5]} />
          <meshBasicMaterial 
            color="white" 
            transparent 
            opacity={0.8}
          />
          {/* LOD level text would go here */}
        </mesh>
      )}
    </group>
  );
}

// High detail model - full GLTF with all features
function HighDetailModel({
  category,
  culturalTheme,
  onPointerOver,
  onPointerOut,
  onClick
}: {
  category: string;
  culturalTheme: string;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
  onClick?: (event?: any) => void;
}) {
  return (
    <GLTFModel
      category={category}
      position={[0, 0, 0]}
      rotation={[0, 0, 0]}
      scale={[1, 1, 1]}
      culturalTheme={culturalTheme}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      onClick={onClick}
    />
  );
}

// Medium detail model - simplified GLTF or detailed geometry
function MediumDetailModel({
  category,
  culturalTheme,
  onPointerOver,
  onPointerOut,
  onClick
}: {
  category: string;
  culturalTheme: string;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
  onClick?: (event?: any) => void;
}) {
  const geometry = useMemo(() => {
    switch (category) {
      case 'chair':
        return <ChairMediumLOD />;
      case 'table':
        return <TableMediumLOD />;
      case 'sofa':
        return <SofaMediumLOD />;
      default:
        return <BasicMediumLOD />;
    }
  }, [category]);

  return (
    <group
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      onClick={onClick}
    >
      {geometry}
    </group>
  );
}

// Low detail model - basic boxes with color coding
function LowDetailModel({
  category,
  onPointerOver,
  onPointerOut,
  onClick
}: {
  category: string;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
  onClick?: (event?: any) => void;
}) {
  const color = useMemo(() => {
    switch (category) {
      case 'chair': return '#8B4513';
      case 'table': return '#A0522D';  
      case 'sofa': return '#2F4F4F';
      case 'bed': return '#E6E6FA';
      default: return '#A0AEC0';
    }
  }, [category]);

  const dimensions = useMemo(() => {
    switch (category) {
      case 'chair': return [1, 2, 1];
      case 'table': return [2, 1, 1];
      case 'sofa': return [3, 1.5, 1.5];
      case 'bed': return [2, 0.5, 3];
      default: return [1, 1, 1];
    }
  }, [category]);

  return (
    <mesh
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      onClick={onClick}
      castShadow
      receiveShadow
    >
      <boxGeometry args={dimensions as [number, number, number]} />
      <meshLambertMaterial color={color} />
    </mesh>
  );
}

// Medium LOD furniture geometries
function ChairMediumLOD() {
  return (
    <>
      {/* Seat */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[1, 0.1, 1]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      {/* Back */}
      <mesh position={[0, 1.2, -0.4]} castShadow receiveShadow>
        <boxGeometry args={[1, 1.5, 0.1]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      {/* Legs */}
      {[[-0.4, 0.25, -0.4], [0.4, 0.25, -0.4], [-0.4, 0.25, 0.4], [0.4, 0.25, 0.4]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.5]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
      ))}
    </>
  );
}

function TableMediumLOD() {
  return (
    <>
      {/* Top */}
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.1, 1]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      {/* Legs */}
      {[[-0.9, 0.5, -0.4], [0.9, 0.5, -0.4], [-0.9, 0.5, 0.4], [0.9, 0.5, 0.4]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 1]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
      ))}
    </>
  );
}

function SofaMediumLOD() {
  return (
    <>
      {/* Main body */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 1, 1.5]} />
        <meshStandardMaterial color="#2F4F4F" />
      </mesh>
      {/* Back cushions */}
      <mesh position={[0, 1, -0.6]} castShadow receiveShadow>
        <boxGeometry args={[3, 1, 0.3]} />
        <meshStandardMaterial color="#2F4F4F" />
      </mesh>
      {/* Armrests */}
      <mesh position={[-1.4, 0.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 1.6, 1.5]} />
        <meshStandardMaterial color="#1C1C1C" />
      </mesh>
      <mesh position={[1.4, 0.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 1.6, 1.5]} />
        <meshStandardMaterial color="#1C1C1C" />
      </mesh>
    </>
  );
}

function BasicMediumLOD() {
  return (
    <mesh castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#A0AEC0" />
    </mesh>
  );
}

// Performance monitoring and optimization
export function usePerformanceOptimization() {
  const [frameRate, setFrameRate] = useState(60);
  const [renderTime, setRenderTime] = useState(0);
  const frameTimeHistory = useRef<number[]>([]);
  const lastTime = useRef(performance.now());

  useFrame(() => {
    const now = performance.now();
    const deltaTime = now - lastTime.current;
    lastTime.current = now;

    frameTimeHistory.current.push(deltaTime);
    
    // Keep only last 60 frames
    if (frameTimeHistory.current.length > 60) {
      frameTimeHistory.current.shift();
    }

    // Update metrics every 30 frames
    if (frameTimeHistory.current.length % 30 === 0) {
      const avgFrameTime = frameTimeHistory.current.reduce((a, b) => a + b, 0) / frameTimeHistory.current.length;
      const fps = 1000 / avgFrameTime;
      
      setFrameRate(Math.round(fps));
      setRenderTime(Math.round(avgFrameTime * 100) / 100);
    }
  });

  const getOptimizationLevel = () => {
    if (frameRate < 30) return 'aggressive';
    if (frameRate < 45) return 'moderate';
    return 'none';
  };

  const getRecommendedLODDistance = () => {
    const optimization = getOptimizationLevel();
    switch (optimization) {
      case 'aggressive': return 20; // Closer LOD switches
      case 'moderate': return 35;
      default: return 50;
    }
  };

  return {
    frameRate,
    renderTime,
    optimizationLevel: getOptimizationLevel(),
    recommendedLODDistance: getRecommendedLODDistance()
  };
}

// Instanced rendering for repeated objects
export function InstancedFurniture({
  category,
  positions,
  culturalTheme = 'modern'
}: {
  category: string;
  positions: [number, number, number][];
  culturalTheme?: string;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const geometry = useMemo(() => {
    switch (category) {
      case 'chair':
        return new THREE.BoxGeometry(1, 2, 1);
      case 'table':
        return new THREE.BoxGeometry(2, 1, 1);
      default:
        return new THREE.BoxGeometry(1, 1, 1);
    }
  }, [category]);

  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: category === 'chair' ? '#8B4513' : '#A0522D'
    });
  }, [category]);

  useEffect(() => {
    if (!meshRef.current) return;

    positions.forEach((position, i) => {
      const matrix = new THREE.Matrix4();
      matrix.setPosition(...position);
      meshRef.current!.setMatrixAt(i, matrix);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [positions]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, positions.length]}
      castShadow
      receiveShadow
    />
  );
}

// Frustum culling helper
export function useFrustumCulling(maxDistance: number = 100) {
  const { camera } = useThree();
  const frustum = useMemo(() => new THREE.Frustum(), []);
  const cameraMatrix = useMemo(() => new THREE.Matrix4(), []);

  const isInView = (position: [number, number, number], radius: number = 2) => {
    // Update frustum
    cameraMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    frustum.setFromProjectionMatrix(cameraMatrix);

    // Create bounding sphere
    const sphere = new THREE.Sphere(new THREE.Vector3(...position), radius);
    
    // Check if in frustum and within distance
    const distance = camera.position.distanceTo(sphere.center);
    return frustum.intersectsSphere(sphere) && distance <= maxDistance;
  };

  return { isInView };
}

// Performance stats overlay (development only)
export function PerformanceStats() {
  const { frameRate, renderTime, optimizationLevel } = usePerformanceOptimization();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div 
      style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontFamily: 'monospace',
        fontSize: '12px',
        zIndex: 1000
      }}
    >
      <div>FPS: {frameRate}</div>
      <div>Render Time: {renderTime}ms</div>
      <div>Optimization: {optimizationLevel}</div>
    </div>
  );
}