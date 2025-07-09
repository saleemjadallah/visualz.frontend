'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Room3DProps {
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  colorPalette: {
    primary: string;
    secondary: string;
    accent: string;
    neutral: string;
  };
}

export function Room3D({ dimensions, colorPalette }: Room3DProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Convert hex colors to THREE.Color objects
  const primaryColor = new THREE.Color(colorPalette.primary);
  const secondaryColor = new THREE.Color(colorPalette.secondary);
  const neutralColor = new THREE.Color(colorPalette.neutral);

  // Floor
  const Floor = () => (
    <mesh 
      position={[dimensions.length / 2, 0, dimensions.width / 2]} 
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
    >
      <planeGeometry args={[dimensions.length, dimensions.width]} />
      <meshLambertMaterial 
        color={neutralColor}
        transparent
        opacity={0.9}
      />
    </mesh>
  );

  // Walls
  const Walls = () => (
    <>
      {/* Back Wall */}
      <mesh 
        position={[dimensions.length / 2, dimensions.height / 2, 0]} 
        castShadow
        receiveShadow
      >
        <planeGeometry args={[dimensions.length, dimensions.height]} />
        <meshLambertMaterial 
          color={secondaryColor}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Left Wall */}
      <mesh 
        position={[0, dimensions.height / 2, dimensions.width / 2]} 
        rotation={[0, Math.PI / 2, 0]}
        castShadow
        receiveShadow
      >
        <planeGeometry args={[dimensions.width, dimensions.height]} />
        <meshLambertMaterial 
          color={secondaryColor}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Right Wall */}
      <mesh 
        position={[dimensions.length, dimensions.height / 2, dimensions.width / 2]} 
        rotation={[0, -Math.PI / 2, 0]}
        castShadow
        receiveShadow
      >
        <planeGeometry args={[dimensions.width, dimensions.height]} />
        <meshLambertMaterial 
          color={secondaryColor}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Front Wall (partially transparent for visibility) */}
      <mesh 
        position={[dimensions.length / 2, dimensions.height / 2, dimensions.width]} 
        rotation={[0, Math.PI, 0]}
        castShadow
        receiveShadow
      >
        <planeGeometry args={[dimensions.length, dimensions.height]} />
        <meshLambertMaterial 
          color={secondaryColor}
          transparent
          opacity={0.3}
        />
      </mesh>
    </>
  );

  // Ceiling (optional, often omitted for better visibility)
  const Ceiling = () => (
    <mesh 
      position={[dimensions.length / 2, dimensions.height, dimensions.width / 2]} 
      rotation={[Math.PI / 2, 0, 0]}
      receiveShadow
    >
      <planeGeometry args={[dimensions.length, dimensions.width]} />
      <meshLambertMaterial 
        color={neutralColor}
        transparent
        opacity={0.4}
      />
    </mesh>
  );

  // Room corners/edges for better depth perception
  const RoomEdges = () => {
    const edgeGeometry = new THREE.BoxGeometry(0.1, dimensions.height, 0.1);
    const edgeMaterial = new THREE.MeshLambertMaterial({ color: primaryColor });

    return (
      <>
        {/* Corner posts */}
        <mesh position={[0, dimensions.height / 2, 0]} geometry={edgeGeometry} material={edgeMaterial} />
        <mesh position={[dimensions.length, dimensions.height / 2, 0]} geometry={edgeGeometry} material={edgeMaterial} />
        <mesh position={[0, dimensions.height / 2, dimensions.width]} geometry={edgeGeometry} material={edgeMaterial} />
        <mesh position={[dimensions.length, dimensions.height / 2, dimensions.width]} geometry={edgeGeometry} material={edgeMaterial} />
      </>
    );
  };

  // Baseboard/Molding
  const Baseboard = () => {
    const baseboardHeight = 0.3;
    const baseboardDepth = 0.1;
    
    return (
      <>
        {/* Back wall baseboard */}
        <mesh position={[dimensions.length / 2, baseboardHeight / 2, -baseboardDepth / 2]}>
          <boxGeometry args={[dimensions.length, baseboardHeight, baseboardDepth]} />
          <meshLambertMaterial color={primaryColor} />
        </mesh>
        
        {/* Left wall baseboard */}
        <mesh position={[-baseboardDepth / 2, baseboardHeight / 2, dimensions.width / 2]}>
          <boxGeometry args={[baseboardDepth, baseboardHeight, dimensions.width]} />
          <meshLambertMaterial color={primaryColor} />
        </mesh>
        
        {/* Right wall baseboard */}
        <mesh position={[dimensions.length + baseboardDepth / 2, baseboardHeight / 2, dimensions.width / 2]}>
          <boxGeometry args={[baseboardDepth, baseboardHeight, dimensions.width]} />
          <meshLambertMaterial color={primaryColor} />
        </mesh>
        
        {/* Front wall baseboard */}
        <mesh position={[dimensions.length / 2, baseboardHeight / 2, dimensions.width + baseboardDepth / 2]}>
          <boxGeometry args={[dimensions.length, baseboardHeight, baseboardDepth]} />
          <meshLambertMaterial color={primaryColor} />
        </mesh>
      </>
    );
  };

  return (
    <group ref={groupRef}>
      <Floor />
      <Walls />
      <Ceiling />
      <RoomEdges />
      <Baseboard />
    </group>
  );
}