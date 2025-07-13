'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function Box() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

export default function Test3DPage() {
  return (
    <div className="w-full h-screen">
      <h1 className="text-2xl font-bold p-4">Simple 3D Test</h1>
      <div className="w-full h-[600px]">
        <Canvas>
          <ambientLight intensity={0.5} />
          <directionalLight position={[0, 0, 5]} />
          <Box />
          <OrbitControls />
        </Canvas>
      </div>
    </div>
  );
}