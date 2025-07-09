'use client';

import React, { useRef, useState, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface FurnitureItem {
  id: string;
  name: string;
  category: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
  model?: THREE.Object3D;
  bounds?: { width: number; height: number; depth: number };
}

interface FurniturePlacementProps {
  items: FurnitureItem[];
  roomBounds: { width: number; height: number; depth: number };
  onItemUpdate: (id: string, updates: Partial<FurnitureItem>) => void;
  onItemSelect: (id: string | null) => void;
  selectedItem: string | null;
  isDragEnabled: boolean;
}

export function FurniturePlacement({
  items,
  roomBounds,
  onItemUpdate,
  onItemSelect,
  selectedItem,
  isDragEnabled
}: FurniturePlacementProps) {
  const { camera, gl, raycaster, mouse } = useThree();
  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    itemId: string | null;
    dragPlane: THREE.Plane;
    offset: THREE.Vector3;
  }>({
    isDragging: false,
    itemId: null,
    dragPlane: new THREE.Plane(),
    offset: new THREE.Vector3()
  });

  const groupRef = useRef<THREE.Group>(null);

  // Handle mouse interactions
  const handlePointerDown = useCallback((event: any, itemId: string) => {
    if (!isDragEnabled) return;
    
    event.stopPropagation();
    onItemSelect(itemId);
    
    // Set up drag plane at ground level
    const dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    
    // Calculate offset from item center to click point
    const intersection = new THREE.Vector3();
    raycaster.ray.intersectPlane(dragPlane, intersection);
    
    const item = items.find(i => i.id === itemId);
    if (item) {
      const offset = intersection.clone().sub(new THREE.Vector3(item.position.x, item.position.y, item.position.z));
      
      setDragState({
        isDragging: true,
        itemId,
        dragPlane,
        offset
      });
    }
  }, [isDragEnabled, items, onItemSelect, raycaster]);

  const handlePointerMove = useCallback((event: any) => {
    if (!dragState.isDragging || !dragState.itemId) return;
    
    event.stopPropagation();
    
    // Update mouse position
    const rect = gl.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    // Calculate new position
    raycaster.setFromCamera(mouse, camera);
    const intersection = new THREE.Vector3();
    raycaster.ray.intersectPlane(dragState.dragPlane, intersection);
    
    if (intersection) {
      const newPosition = intersection.sub(dragState.offset);
      
      // Constrain to room bounds
      const constrainedPosition = constrainToRoom(newPosition, roomBounds);
      
      onItemUpdate(dragState.itemId, {
        position: {
          x: constrainedPosition.x,
          y: constrainedPosition.y,
          z: constrainedPosition.z
        }
      });
    }
  }, [dragState, gl, mouse, camera, raycaster, roomBounds, onItemUpdate]);

  const handlePointerUp = useCallback(() => {
    if (dragState.isDragging) {
      setDragState({
        isDragging: false,
        itemId: null,
        dragPlane: new THREE.Plane(),
        offset: new THREE.Vector3()
      });
    }
  }, [dragState]);

  // Constrain furniture to room bounds
  const constrainToRoom = (position: THREE.Vector3, bounds: { width: number; height: number; depth: number }) => {
    const margin = 0.5; // Keep furniture away from walls
    
    return new THREE.Vector3(
      Math.max(-bounds.width / 2 + margin, Math.min(bounds.width / 2 - margin, position.x)),
      Math.max(0, Math.min(bounds.height - margin, position.y)),
      Math.max(-bounds.depth / 2 + margin, Math.min(bounds.depth / 2 - margin, position.z))
    );
  };

  // Handle rotation with keyboard
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!selectedItem) return;
    
    const item = items.find(i => i.id === selectedItem);
    if (!item) return;
    
    switch (event.key) {
      case 'r':
      case 'R':
        // Rotate 90 degrees
        onItemUpdate(selectedItem, {
          rotation: {
            ...item.rotation,
            y: item.rotation.y + Math.PI / 2
          }
        });
        break;
      case 'Delete':
      case 'Backspace':
        // Remove item (you might want to handle this differently)
        onItemSelect(null);
        break;
    }
  }, [selectedItem, items, onItemUpdate, onItemSelect]);

  // Set up event listeners
  React.useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerup', handlePointerUp);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [gl, handlePointerMove, handlePointerUp, handleKeyDown]);

  return (
    <group ref={groupRef}>
      {items.map((item) => (
        <FurnitureItemRenderer
          key={item.id}
          item={item}
          isSelected={selectedItem === item.id}
          isDragging={dragState.isDragging && dragState.itemId === item.id}
          onPointerDown={(event) => handlePointerDown(event, item.id)}
        />
      ))}
    </group>
  );
}

// Individual furniture item renderer
interface FurnitureItemRendererProps {
  item: FurnitureItem;
  isSelected: boolean;
  isDragging: boolean;
  onPointerDown: (event: any) => void;
}

function FurnitureItemRenderer({ item, isSelected, isDragging, onPointerDown }: FurnitureItemRendererProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Create geometry based on category
  const geometry = React.useMemo(() => {
    switch (item.category) {
      case 'table':
        return new THREE.BoxGeometry(item.bounds?.width || 2, item.bounds?.height || 0.1, item.bounds?.depth || 2);
      case 'chair':
        return new THREE.BoxGeometry(item.bounds?.width || 0.6, item.bounds?.height || 1.2, item.bounds?.depth || 0.6);
      case 'decoration':
        return new THREE.SphereGeometry(item.bounds?.width || 0.3, 8, 8);
      default:
        return new THREE.BoxGeometry(1, 1, 1);
    }
  }, [item.category, item.bounds]);

  // Create material with selection highlighting
  const material = React.useMemo(() => {
    const baseColor = isSelected ? '#4F46E5' : '#8B7355';
    const opacity = isDragging ? 0.7 : 1;
    
    return new THREE.MeshLambertMaterial({
      color: baseColor,
      opacity,
      transparent: isDragging
    });
  }, [isSelected, isDragging]);

  // Animation for selection
  useFrame(() => {
    if (meshRef.current && isSelected) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group
      position={[item.position.x, item.position.y, item.position.z]}
      rotation={[item.rotation.x, item.rotation.y, item.rotation.z]}
      scale={[item.scale.x, item.scale.y, item.scale.z]}
    >
      <mesh
        ref={meshRef}
        geometry={geometry}
        material={material}
        castShadow
        receiveShadow
        onPointerDown={onPointerDown}
        userData={{ furnitureId: item.id, draggable: true }}
      />
      
      {/* Selection indicator */}
      {isSelected && (
        <mesh position={[0, -0.05, 0]}>
          <ringGeometry args={[0.8, 1.2, 16]} />
          <meshBasicMaterial color="#4F46E5" opacity={0.5} transparent />
        </mesh>
      )}
      
      {/* Category label */}
      <mesh position={[0, (item.bounds?.height || 1) + 0.5, 0]}>
        <planeGeometry args={[2, 0.5]} />
        <meshBasicMaterial color="white" opacity={0.8} transparent />
      </mesh>
    </group>
  );
}

// Hook for managing furniture placement
export function useFurniturePlacement(initialItems: FurnitureItem[] = []) {
  const [items, setItems] = useState<FurnitureItem[]>(initialItems);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [isDragEnabled, setIsDragEnabled] = useState(true);

  const updateItem = useCallback((id: string, updates: Partial<FurnitureItem>) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  }, []);

  const addItem = useCallback((newItem: Omit<FurnitureItem, 'id'>) => {
    const item: FurnitureItem = {
      id: `furniture_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...newItem
    };
    setItems(prev => [...prev, item]);
    return item.id;
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    if (selectedItem === id) {
      setSelectedItem(null);
    }
  }, [selectedItem]);

  const duplicateItem = useCallback((id: string) => {
    const item = items.find(i => i.id === id);
    if (item) {
      const newItem = {
        ...item,
        position: {
          x: item.position.x + 1,
          y: item.position.y,
          z: item.position.z + 1
        }
      };
      delete (newItem as any).id;
      return addItem(newItem);
    }
    return null;
  }, [items, addItem]);

  return {
    items,
    selectedItem,
    isDragEnabled,
    setSelectedItem,
    setIsDragEnabled,
    updateItem,
    addItem,
    removeItem,
    duplicateItem
  };
}