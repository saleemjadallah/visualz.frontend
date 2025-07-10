import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats, Environment, Grid } from '@react-three/drei';
import { ParametricGenerationEngine } from '../parametric-furniture/core/ParametricGenerationEngine';
import { 
  ParametricParameters, 
  GenerationResult, 
  UserFurnitureRequest,
  FurnitureType,
  CultureType,
  MaterialType,
  FormalityLevel,
  StyleVariant
} from '../parametric-furniture/types/index';

interface ParametricFurnitureGeneratorProps {
  className?: string;
  onFurnitureGenerated?: (results: GenerationResult[]) => void;
  initialParameters?: Partial<ParametricParameters>;
}

export const ParametricFurnitureGenerator: React.FC<ParametricFurnitureGeneratorProps> = ({
  className = '',
  onFurnitureGenerated,
  initialParameters = {}
}) => {
  const [generationEngine] = useState(() => new ParametricGenerationEngine());
  const [currentFurniture, setCurrentFurniture] = useState<GenerationResult[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true);
  const [selectedFurnitureIndex, setSelectedFurnitureIndex] = useState(0);
  
  const [parameters, setParameters] = useState<ParametricParameters>({
    type: 'chair',
    culture: 'japanese',
    width: 0.5,
    height: 0.8,
    depth: 0.5,
    style: 'traditional',
    formality: 'formal',
    primaryMaterial: 'wood-oak',
    culturalElements: ['natural-joinery'],
    ergonomicProfile: 'average',
    colorPalette: ['#8B4513', '#D2691E'],
    decorativeIntensity: 0.7,
    craftsmanshipLevel: 'refined',
    ...initialParameters
  });

  // Real-time generation when parameters change
  useEffect(() => {
    if (!isRealTimeEnabled) return;
    
    const debounceTimer = setTimeout(() => {
      generateFurnitureRealTime();
    }, 500); // 500ms debounce

    return () => clearTimeout(debounceTimer);
  }, [parameters, isRealTimeEnabled]);

  const generateFurnitureRealTime = useCallback(async () => {
    if (isGenerating) return;
    
    try {
      setIsGenerating(true);
      const result = await generationEngine.generateSinglePiece(parameters);
      setCurrentFurniture([result]);
      onFurnitureGenerated?.([result]);
    } catch (error) {
      console.error('Failed to generate furniture:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [parameters, generationEngine, isGenerating, onFurnitureGenerated]);

  const handleParameterChange = useCallback((key: string, value: any) => {
    setParameters(prev => {
      const adjusted = generationEngine.adjustParametersRealTime(prev, { [key]: value });
      return adjusted;
    });
  }, [generationEngine]);

  const generateFromUserInput = useCallback(async () => {
    setIsGenerating(true);
    try {
      const userInput: UserFurnitureRequest = {
        eventType: 'formal-dinner',
        culture: parameters.culture,
        guestCount: 6,
        spaceDimensions: { width: 4, height: 3, depth: 4 },
        budgetRange: 'medium',
        formalityLevel: parameters.formality,
        specialRequirements: `Generate authentic ${parameters.culture} furniture for ${parameters.formality} occasions`
      };

      const results = await generationEngine.generateFurnitureFromUserInput(userInput);
      setCurrentFurniture(results);
      onFurnitureGenerated?.(results);
    } catch (error) {
      console.error('Failed to generate furniture from user input:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [parameters, generationEngine, onFurnitureGenerated]);

  const handleReset = useCallback(() => {
    setParameters({
      type: 'chair',
      culture: 'japanese',
      width: 0.5,
      height: 0.8,
      depth: 0.5,
      style: 'traditional',
      formality: 'formal',
      primaryMaterial: 'wood-oak',
      culturalElements: ['natural-joinery'],
      ergonomicProfile: 'average',
      colorPalette: ['#8B4513', '#D2691E'],
      decorativeIntensity: 0.7,
      craftsmanshipLevel: 'refined'
    });
  }, []);

  const performanceReport = useMemo(() => {
    return generationEngine.getPerformanceReport();
  }, [currentFurniture]);

  const selectedFurniture = currentFurniture[selectedFurnitureIndex];

  return (
    <div className={`w-full h-screen flex bg-gray-50 ${className}`}>
      {/* Parameter Controls Panel */}
      <div className="w-1/3 p-6 bg-white shadow-lg overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            AI Parametric Furniture Generator
          </h2>
          <p className="text-sm text-gray-600">
            Generate infinite furniture variations with cultural authenticity
          </p>
        </div>
        
        {/* Real-time toggle */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isRealTimeEnabled}
              onChange={(e) => setIsRealTimeEnabled(e.target.checked)}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-sm font-medium">Real-time Generation</span>
          </label>
        </div>
        
        {/* Furniture Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Furniture Type
          </label>
          <select 
            value={parameters.type}
            onChange={(e) => handleParameterChange('type', e.target.value as FurnitureType)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="chair">Chair</option>
            <option value="dining-table">Dining Table</option>
            <option value="coffee-table">Coffee Table</option>
            <option value="side-table">Side Table</option>
            <option value="sofa">Sofa</option>
            <option value="bench">Bench</option>
          </select>
        </div>

        {/* Cultural Style Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cultural Style
          </label>
          <select 
            value={parameters.culture}
            onChange={(e) => handleParameterChange('culture', e.target.value as CultureType)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="japanese">Japanese Traditional</option>
            <option value="scandinavian">Scandinavian Hygge</option>
            <option value="italian">Italian Luxury</option>
            <option value="french">French Elegance</option>
            <option value="modern">Modern Contemporary</option>
          </select>
        </div>

        {/* Dimensional Controls */}
        <div className="mb-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Width: {parameters.width.toFixed(2)}m
            </label>
            <input
              type="range"
              min="0.3"
              max="2.0"
              step="0.05"
              value={parameters.width}
              onChange={(e) => handleParameterChange('width', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Height: {parameters.height.toFixed(2)}m
            </label>
            <input
              type="range"
              min="0.3"
              max="1.2"
              step="0.05"
              value={parameters.height}
              onChange={(e) => handleParameterChange('height', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Depth: {parameters.depth.toFixed(2)}m
            </label>
            <input
              type="range"
              min="0.3"
              max="1.5"
              step="0.05"
              value={parameters.depth}
              onChange={(e) => handleParameterChange('depth', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Style Controls */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Style Variant
          </label>
          <select 
            value={parameters.style}
            onChange={(e) => handleParameterChange('style', e.target.value as StyleVariant)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="traditional">Traditional</option>
            <option value="contemporary">Contemporary</option>
            <option value="rustic">Rustic</option>
            <option value="elegant">Elegant</option>
            <option value="minimalist">Minimalist</option>
            <option value="ornate">Ornate</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Formality Level
          </label>
          <select 
            value={parameters.formality}
            onChange={(e) => handleParameterChange('formality', e.target.value as FormalityLevel)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="casual">Casual</option>
            <option value="semi-formal">Semi-Formal</option>
            <option value="formal">Formal</option>
            <option value="ceremonial">Ceremonial</option>
          </select>
        </div>

        {/* Material Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Primary Material
          </label>
          <select 
            value={parameters.primaryMaterial}
            onChange={(e) => handleParameterChange('primaryMaterial', e.target.value as MaterialType)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="wood-oak">Oak Wood</option>
            <option value="wood-pine">Pine Wood</option>
            <option value="wood-cherry">Cherry Wood</option>
            <option value="wood-bamboo">Bamboo</option>
            <option value="fabric-cotton">Cotton Fabric</option>
            <option value="fabric-linen">Linen Fabric</option>
            <option value="fabric-silk">Silk Fabric</option>
            <option value="fabric-wool">Wool Fabric</option>
            <option value="metal-brass">Brass Metal</option>
            <option value="metal-steel">Steel Metal</option>
            <option value="metal-copper">Copper Metal</option>
            <option value="leather">Leather</option>
            <option value="ceramic">Ceramic</option>
            <option value="glass">Glass</option>
            <option value="stone">Stone</option>
          </select>
        </div>

        {/* Decorative Intensity */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Decorative Intensity: {(parameters.decorativeIntensity * 100).toFixed(0)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={parameters.decorativeIntensity}
            onChange={(e) => handleParameterChange('decorativeIntensity', parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Craftsmanship Level */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Craftsmanship Level
          </label>
          <select 
            value={parameters.craftsmanshipLevel}
            onChange={(e) => handleParameterChange('craftsmanshipLevel', e.target.value as 'simple' | 'refined' | 'masterwork')}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="simple">Simple</option>
            <option value="refined">Refined</option>
            <option value="masterwork">Masterwork</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mb-6">
          <button
            onClick={generateFromUserInput}
            disabled={isGenerating}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating ? 'Generating...' : 'Generate Complete Furniture Set'}
          </button>
          
          <button
            onClick={handleReset}
            className="w-full bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Reset to Defaults
          </button>
        </div>

        {/* Cultural Authenticity Score */}
        {selectedFurniture && (
          <div className="mb-6 p-4 bg-green-50 rounded-lg">
            <h3 className="font-medium text-green-800 mb-3">Cultural Authenticity Score</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Overall:</span>
                <span className="font-medium">{(selectedFurniture.culturalAuthenticity.overall * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Proportions:</span>
                <span>{(selectedFurniture.culturalAuthenticity.proportions * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Materials:</span>
                <span>{(selectedFurniture.culturalAuthenticity.materials * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Aesthetics:</span>
                <span>{(selectedFurniture.culturalAuthenticity.aesthetics * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Cultural Elements:</span>
                <span>{(selectedFurniture.culturalAuthenticity.culturalElements * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Performance Metrics */}
        {selectedFurniture && (
          <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-medium text-yellow-800 mb-3">Performance Metrics</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Generation Time:</span>
                <span className="font-medium">{selectedFurniture.performanceMetrics.generationTime.toFixed(2)}ms</span>
              </div>
              <div className="flex justify-between">
                <span>Polygon Count:</span>
                <span>{selectedFurniture.performanceMetrics.polygonCount.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Memory Usage:</span>
                <span>{(selectedFurniture.performanceMetrics.memoryUsage / 1024).toFixed(2)}KB</span>
              </div>
            </div>
          </div>
        )}

        {/* Furniture Selection */}
        {currentFurniture.length > 1 && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Furniture ({currentFurniture.length} pieces)
            </label>
            <select 
              value={selectedFurnitureIndex}
              onChange={(e) => setSelectedFurnitureIndex(parseInt(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {currentFurniture.map((furniture, index) => (
                <option key={index} value={index}>
                  {furniture.metadata.name} #{index + 1}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* 3D Visualization */}
      <div className="w-2/3 h-full relative">
        <Canvas
          camera={{ position: [2, 1.5, 2], fov: 50 }}
          shadows
          gl={{ preserveDrawingBuffer: true }}
        >
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={0.8} 
            castShadow
            shadow-mapSize={[2048, 2048]}
          />
          <pointLight position={[-10, 10, -5]} intensity={0.3} />
          
          {/* Environment */}
          <Environment preset="studio" />
          
          {/* Render generated furniture */}
          {currentFurniture.map((furniture, index) => (
            <primitive 
              key={`furniture-${index}`}
              object={furniture.geometry} 
              position={[index * 1.5 - (currentFurniture.length - 1) * 0.75, 0, 0]}
              scale={[1, 1, 1]}
            />
          ))}
          
          {/* Floor grid for reference */}
          <Grid 
            args={[10, 10]}
            position={[0, -0.01, 0]}
            cellSize={0.5}
            cellThickness={0.5}
            cellColor="#e0e0e0"
            sectionSize={2}
            sectionThickness={1}
            sectionColor="#c0c0c0"
          />
          
          {/* Controls */}
          <OrbitControls 
            enablePan 
            enableZoom 
            enableRotate 
            dampingFactor={0.05}
            minDistance={1}
            maxDistance={10}
          />
          
          {/* Performance stats */}
          <Stats />
        </Canvas>
        
        {/* Loading overlay */}
        {isGenerating && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-lg font-medium">Generating Furniture...</p>
              <p className="text-sm text-gray-600">AI is creating your custom piece</p>
            </div>
          </div>
        )}
        
        {/* Furniture info overlay */}
        {selectedFurniture && (
          <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg max-w-xs">
            <h3 className="font-bold text-lg mb-2">{selectedFurniture.metadata.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{selectedFurniture.metadata.description}</p>
            <p className="text-sm">
              <span className="font-medium">Estimated Cost:</span> ${selectedFurniture.metadata.estimatedCost}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};