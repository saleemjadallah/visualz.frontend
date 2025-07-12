'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  Lightbulb, 
  Flower2, 
  Palette, 
  Download,
  Star,
  TrendingUp,
  DollarSign,
  Check,
  Loader2,
  Wand2
} from 'lucide-react';
import { culturalPhilosophyApi } from '@/lib/api';
import Button from '@/app/components/ui/Button';

interface ParametricGenerationPanelProps {
  eventType: string;
  culture: string;
  guestCount: number;
  spaceDimensions: { width: number; depth: number; height: number };
  budget: number;
  onGenerationComplete?: (results: any) => void;
}

const ParametricGenerationPanel: React.FC<ParametricGenerationPanelProps> = ({
  eventType,
  culture,
  guestCount,
  spaceDimensions,
  budget,
  onGenerationComplete
}) => {
  const [activeTab, setActiveTab] = useState<'furniture' | 'lighting' | 'floral' | 'complete'>('complete');
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [culturalPhilosophy, setCulturalPhilosophy] = useState<any>(null);
  const [generationOptions, setGenerationOptions] = useState({
    formalityLevel: 'casual',
    ambiance: 'warm',
    sustainability: 'high',
    specialRequirements: [] as string[]
  });

  // Load cultural philosophy data
  useEffect(() => {
    const loadCulturalData = async () => {
      try {
        const philosophyData = await culturalPhilosophyApi.getPhilosophy(culture);
        setCulturalPhilosophy(philosophyData.philosophy);
      } catch (error) {
        console.error('Failed to load cultural philosophy:', error);
      }
    };

    if (culture) {
      loadCulturalData();
    }
  }, [culture]);

  const generateParametricElements = async (type: 'furniture' | 'lighting' | 'floral' | 'complete') => {
    setIsGenerating(true);
    
    try {
      // Mock parametric generation results for now
      let result: any = {
        generation_id: `${type}_${Date.now()}`,
        culturalScore: 0.85 + Math.random() * 0.1,
        budgetUtilization: 0.75 + Math.random() * 0.2,
        recommendations: [
          `Optimized ${type} design for ${culture} cultural context`,
          `Budget-conscious approach for ${getBudgetRange(budget)} tier`,
          `Suitable for ${guestCount} guests in ${eventType} setting`
        ]
      };

      // Add type-specific mock data
      switch (type) {
        case 'furniture':
          result.furniture = [
            { id: '1', name: 'Cultural Seating Arrangement', style: culture },
            { id: '2', name: 'Traditional Table Setup', style: culture }
          ];
          result.estimatedCost = budget * 0.4;
          break;
          
        case 'lighting':
          result.lightingPlan = {
            zones: ['ambient', 'task', 'accent'],
            culturalAlignment: 0.9
          };
          break;
          
        case 'floral':
          result.floralArrangements = [
            { type: 'centerpiece', season: getCurrentSeason() },
            { type: 'entrance', season: getCurrentSeason() }
          ];
          result.sustainabilityScore = generationOptions.sustainability === 'high' ? 0.9 : 0.7;
          result.seasonalGuidance = [`${getCurrentSeason()} flowers recommended for authenticity`];
          break;
          
        case 'complete':
          result.furniture = [{ id: '1', name: 'Complete Setup' }];
          result.lighting = { zones: ['main'] };
          result.floral = [{ type: 'integrated' }];
          result.exportOptions = ['gltf', 'glb', 'obj'];
          break;
      }
      
      setResults({ ...results, [type]: result });
      onGenerationComplete?.(result);
      
    } catch (error) {
      console.error(`Failed to generate ${type}:`, error);
    } finally {
      setIsGenerating(false);
    }
  };

  const export3DModel = async (furnitureId: string, format: 'gltf' | 'glb' | 'obj' | 'stl') => {
    try {
      // Mock 3D export for now
      console.log(`Exporting ${furnitureId} as ${format} format`);
      
      // Simulate download
      const mockData = new Blob([`Mock ${format} file for ${furnitureId}`], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(mockData);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${furnitureId}_${culture}_${format}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Failed to export 3D model:', error);
    }
  };

  const getBudgetRange = (budget: number): string => {
    if (budget < 1500) return 'low';
    if (budget < 4000) return 'medium';
    if (budget < 8000) return 'high';
    return 'luxury';
  };

  const getCurrentSeason = (): string => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
  };

  const tabs = [
    { id: 'complete', label: 'Complete Event', icon: Wand2, description: 'Generate everything at once' },
    { id: 'furniture', label: 'Furniture', icon: Settings, description: 'Parametric furniture generation' },
    { id: 'lighting', label: 'Lighting', icon: Lightbulb, description: 'Cultural lighting design' },
    { id: 'floral', label: 'Floral', icon: Flower2, description: 'Sustainable floral arrangements' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Advanced Parametric Generation
        </h2>
        <p className="text-gray-600">
          Leverage AI-powered parametric design with cultural intelligence
        </p>
        
        {culturalPhilosophy && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900">{culturalPhilosophy.name} Philosophy</h3>
            <p className="text-sm text-blue-700 mt-1">{culturalPhilosophy.foundation}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {culturalPhilosophy.core_principles?.slice(0, 3).map((principle: string, index: number) => (
                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                  {principle}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Generation Options */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-3">Generation Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Formality Level
            </label>
            <select
              value={generationOptions.formalityLevel}
              onChange={(e) => setGenerationOptions({
                ...generationOptions,
                formalityLevel: e.target.value
              })}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="casual">Casual</option>
              <option value="semi-formal">Semi-formal</option>
              <option value="formal">Formal</option>
              <option value="ceremonial">Ceremonial</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ambiance
            </label>
            <select
              value={generationOptions.ambiance}
              onChange={(e) => setGenerationOptions({
                ...generationOptions,
                ambiance: e.target.value
              })}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="warm">Warm & Inviting</option>
              <option value="cool">Cool & Modern</option>
              <option value="dramatic">Dramatic & Bold</option>
              <option value="serene">Serene & Peaceful</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sustainability
            </label>
            <select
              value={generationOptions.sustainability}
              onChange={(e) => setGenerationOptions({
                ...generationOptions,
                sustainability: e.target.value
              })}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Generation Button */}
      <div className="mb-6">
        <Button
          onClick={() => generateParametricElements(activeTab)}
          disabled={isGenerating}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating {tabs.find(t => t.id === activeTab)?.label}...
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4 mr-2" />
              Generate {tabs.find(t => t.id === activeTab)?.label}
            </>
          )}
        </Button>
      </div>

      {/* Results Display */}
      <AnimatePresence>
        {results && results[activeTab] && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-green-900">
                  Generation Results
                </h3>
                <div className="flex items-center space-x-4 text-sm">
                  {results[activeTab].culturalScore && (
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>Cultural Score: {(results[activeTab].culturalScore * 100).toFixed(0)}%</span>
                    </div>
                  )}
                  {results[activeTab].budgetUtilization && (
                    <div className="flex items-center space-x-1">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <span>Budget: {(results[activeTab].budgetUtilization * 100).toFixed(0)}%</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Recommendations */}
              {results[activeTab].recommendations && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">AI Recommendations:</h4>
                  <ul className="space-y-1">
                    {results[activeTab].recommendations.slice(0, 3).map((rec: string, index: number) => (
                      <li key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Export Options */}
              {results[activeTab].generation_id && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm font-medium text-gray-700">Export 3D Models:</span>
                  {(['gltf', 'glb', 'obj', 'stl'] as const).map((format) => (
                    <button
                      key={format}
                      onClick={() => export3DModel(results[activeTab].generation_id, format)}
                      className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs rounded-md flex items-center space-x-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>{format.toUpperCase()}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ParametricGenerationPanel;