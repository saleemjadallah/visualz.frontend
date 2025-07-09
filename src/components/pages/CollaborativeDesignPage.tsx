'use client';

import React, { useState, useEffect } from 'react';
import { CollaborativeDesignVisualization } from '../visualization/CollaborativeDesignVisualization';
import { Save, Share2, Download, Settings } from 'lucide-react';

interface CollaborativeDesignPageProps {
  projectId: string;
  designId: string;
}

export function CollaborativeDesignPage({ projectId, designId }: CollaborativeDesignPageProps) {
  const [design, setDesign] = useState({
    id: designId,
    name: "Modern Living Room",
    furniture_items: [
      {
        id: "sofa_1",
        name: "Modern Sectional Sofa",
        category: "seating",
        x: 2,
        y: 3,
        width: 3,
        height: 2,
        rotation: 0,
        color: "#4A5568",
        style: "modern"
      },
      {
        id: "coffee_table_1",
        name: "Glass Coffee Table",
        category: "table",
        x: 4,
        y: 5,
        width: 2,
        height: 1,
        rotation: 0,
        color: "#E2E8F0",
        style: "modern"
      },
      {
        id: "tv_stand_1",
        name: "Entertainment Center",
        category: "storage",
        x: 1,
        y: 1,
        width: 4,
        height: 0.5,
        rotation: 0,
        color: "#2D3748",
        style: "modern"
      }
    ],
    color_palette: {
      primary: "#4A5568",
      secondary: "#E2E8F0",
      accent: "#3182CE",
      neutral: "#F7FAFC"
    },
    lighting_plan: {
      ambient_lighting: "recessed",
      task_lighting: ["table_lamps", "floor_lamps"],
      accent_lighting: ["wall_sconces"],
      color_temperature: "warm"
    }
  });

  const [project] = useState({
    id: projectId,
    space_data: {
      length: 12,
      width: 10,
      height: 9,
      room_type: "living_room",
      features: ["large_windows", "hardwood_floors"],
      limitations: ["low_ceiling"]
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const handleFurnitureUpdate = async (furnitureId: string, updates: any) => {
    console.log('Furniture update:', furnitureId, updates);
    
    // Update local state
    setDesign(prev => ({
      ...prev,
      furniture_items: prev.furniture_items.map(item =>
        item.id === furnitureId ? { ...item, ...updates } : item
      )
    }));

    // Here you would typically save to your backend
    await simulateAutoSave();
  };

  const handleDesignUpdate = async (designUpdates: any) => {
    console.log('Design update:', designUpdates);
    
    // Update local state
    setDesign(prev => ({ ...prev, ...designUpdates }));

    // Here you would typically save to your backend
    await simulateAutoSave();
  };

  const simulateAutoSave = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setLastSaved(new Date());
    setIsLoading(false);
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      // Here you would save the design to your backend
      console.log('Saving design:', design);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setLastSaved(new Date());
      
      // Show success message
      alert('Design saved successfully!');
      
    } catch (error) {
      console.error('Error saving design:', error);
      alert('Error saving design. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = () => {
    // Generate shareable link
    const shareUrl = `${window.location.origin}/collaborative-design/${projectId}/${designId}`;
    
    if (navigator.share) {
      navigator.share({
        title: design.name,
        text: 'Check out this collaborative design!',
        url: shareUrl
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
  };

  const handleExport = () => {
    // Here you would generate and download the design
    const designData = JSON.stringify(design, null, 2);
    const blob = new Blob([designData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${design.name.replace(/\s+/g, '_')}_design.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">{design.name}</h1>
            
            {/* Save Status */}
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : lastSaved ? (
                <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
              ) : (
                <span>Not saved</span>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
            
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
            
            <button
              onClick={handleExport}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <CollaborativeDesignVisualization
          design={design}
          project={project}
          onFurnitureUpdate={handleFurnitureUpdate}
          onDesignUpdate={handleDesignUpdate}
        />
      </main>
    </div>
  );
}