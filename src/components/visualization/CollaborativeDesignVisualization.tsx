'use client';

import React, { useState, useEffect, useRef } from 'react';
import { DesignVisualization } from './DesignVisualization';
import { CollaborationPanel } from '../collaboration/CollaborationPanel';
import CursorOverlay from '../collaboration/CursorOverlay';
import ElementLockIndicator from '../collaboration/ElementLockIndicator';
import { useCollaboration } from '@/lib/hooks/useCollaboration';
import { Users, Eye, EyeOff } from 'lucide-react';

interface CollaborativeDesignVisualizationProps {
  design: {
    id: string;
    name: string;
    furniture_items: Array<{
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
    }>;
    color_palette: {
      primary: string;
      secondary: string;
      accent: string;
      neutral: string;
    };
    lighting_plan: {
      ambient_lighting: string;
      task_lighting: string[];
      accent_lighting: string[];
      color_temperature: string;
    };
  };
  project: {
    id: string;
    space_data: {
      length: number;
      width: number;
      height: number;
      room_type: string;
      features: string[];
      limitations: string[];
    };
  };
  onFurnitureUpdate?: (furnitureId: string, updates: any) => void;
  onDesignUpdate?: (designUpdates: any) => void;
}

export function CollaborativeDesignVisualization({
  design,
  project,
  onFurnitureUpdate,
  onDesignUpdate
}: CollaborativeDesignVisualizationProps) {
  const [showCollaborationPanel, setShowCollaborationPanel] = useState(true);
  const [showCursors, setShowCursors] = useState(true);
  const [localDesign, setLocalDesign] = useState(design);
  const [cursors, setCursors] = useState<Array<{
    x: number;
    y: number;
    userId: string;
    username: string;
  }>>([]);
  
  const visualizationRef = useRef<HTMLDivElement>(null);
  const collaboration = useCollaboration(project.id);

  // Update local design when collaboration changes come in
  useEffect(() => {
    setLocalDesign(design);
  }, [design]);

  // Set up cursor tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!visualizationRef.current) return;
      
      const rect = visualizationRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Only update cursor if it's within the visualization area
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        collaboration.updateCursor({ x, y });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [collaboration]);

  // Update cursors from collaboration state
  useEffect(() => {
    const otherUsers = collaboration.getOtherUsers();
    const cursorData = otherUsers
      .filter(user => user.cursor_position)
      .map(user => ({
        x: user.cursor_position!.x,
        y: user.cursor_position!.y,
        userId: user.user_id,
        username: user.username
      }));
    
    setCursors(cursorData);
  }, [collaboration.users]);

  const handleFurnitureMove = (furnitureId: string, position: { x: number; y: number }) => {
    // Check if element is locked by another user
    if (collaboration.isElementLocked(furnitureId)) {
      const lockOwner = collaboration.getElementLockOwner(furnitureId);
      const currentUser = collaboration.getCurrentUser();
      
      if (lockOwner !== currentUser?.user_id) {
        console.warn('Cannot move furniture: locked by another user');
        return;
      }
    }

    // Lock the element while moving
    collaboration.lockElement(furnitureId);
    
    // Update local state
    const updatedItems = localDesign.furniture_items.map(item => 
      item.id === furnitureId 
        ? { ...item, x: position.x, y: position.y }
        : item
    );
    
    setLocalDesign({ ...localDesign, furniture_items: updatedItems });
    
    // Broadcast the move to other users
    collaboration.moveFurniture(furnitureId, position);
    
    // Call the original handler
    onFurnitureUpdate?.(furnitureId, position);
    
    // Unlock after a short delay
    setTimeout(() => {
      collaboration.unlockElement(furnitureId);
    }, 1000);
  };

  const handleFurnitureAdd = (furnitureData: any) => {
    const newItem = {
      id: `furniture_${Date.now()}`,
      ...furnitureData
    };
    
    const updatedItems = [...localDesign.furniture_items, newItem];
    setLocalDesign({ ...localDesign, furniture_items: updatedItems });
    
    // Broadcast the addition to other users
    collaboration.addFurniture(newItem);
    
    // Call the original handler
    onDesignUpdate?.({ furniture_items: updatedItems });
  };

  const handleFurnitureRemove = (furnitureId: string) => {
    const updatedItems = localDesign.furniture_items.filter(item => item.id !== furnitureId);
    setLocalDesign({ ...localDesign, furniture_items: updatedItems });
    
    // Broadcast the removal to other users
    collaboration.removeFurniture(furnitureId);
    
    // Call the original handler
    onDesignUpdate?.({ furniture_items: updatedItems });
  };

  const handleDesignUpdate = (designUpdates: any) => {
    setLocalDesign({ ...localDesign, ...designUpdates });
    
    // Broadcast the design update to other users
    collaboration.updateDesign(designUpdates);
    
    // Call the original handler
    onDesignUpdate?.(designUpdates);
  };

  return (
    <div className="w-full h-full flex">
      {/* Main Visualization Area */}
      <div className={`flex-1 h-full relative ${showCollaborationPanel ? 'mr-80' : ''}`}>
        <div ref={visualizationRef} className="w-full h-full relative">
          <DesignVisualization
            design={localDesign}
            project={project}
            onFurnitureUpdate={handleFurnitureMove}
            onDesignUpdate={handleDesignUpdate}
          />
          
          {/* Element Lock Indicators */}
          {Object.entries(collaboration.lockedElements).map(([elementId, userId]) => {
            const user = collaboration.users.find(u => u.user_id === userId);
            const furniture = localDesign.furniture_items.find(f => f.id === elementId);
            
            if (!furniture) return null;
            
            return (
              <div
                key={elementId}
                className="absolute"
                style={{
                  left: `${(furniture.x / project.space_data.length) * 100}%`,
                  top: `${(furniture.y / project.space_data.width) * 100}%`,
                }}
              >
                <ElementLockIndicator
                  elementId={elementId}
                  lockedBy={userId}
                  username={user?.username}
                />
              </div>
            );
          })}
          
          {/* Cursor Overlay */}
          {showCursors && (
            <CursorOverlay
              cursors={cursors}
              currentUserId={collaboration.getCurrentUser()?.user_id}
            />
          )}
        </div>
        
        {/* Collaboration Controls */}
        <div className="absolute top-4 right-4 flex items-center space-x-2 bg-white rounded-lg shadow-md p-2">
          <button
            onClick={() => setShowCursors(!showCursors)}
            className={`p-2 rounded-md transition-colors ${
              showCursors ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
            }`}
            title={showCursors ? 'Hide cursors' : 'Show cursors'}
          >
            {showCursors ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
          
          <button
            onClick={() => setShowCollaborationPanel(!showCollaborationPanel)}
            className={`p-2 rounded-md transition-colors ${
              showCollaborationPanel ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
            }`}
            title={showCollaborationPanel ? 'Hide collaboration panel' : 'Show collaboration panel'}
          >
            <Users className="w-4 h-4" />
          </button>
          
          {/* Connection Status */}
          <div className="flex items-center space-x-2 px-3 py-1 bg-gray-50 rounded-md">
            <div className={`w-2 h-2 rounded-full ${
              collaboration.connected ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className="text-sm text-gray-600">
              {collaboration.userCount} user{collaboration.userCount !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>
      
      {/* Collaboration Panel */}
      {showCollaborationPanel && (
        <CollaborationPanel
          projectId={project.id}
          onFurnitureMove={handleFurnitureMove}
          onFurnitureAdd={handleFurnitureAdd}
          onFurnitureRemove={handleFurnitureRemove}
          onDesignUpdate={handleDesignUpdate}
        />
      )}
    </div>
  );
}