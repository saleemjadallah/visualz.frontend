'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Palette, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Lightbulb,
  Heart,
  Sparkles,
  ArrowRight,
  Info,
  ExternalLink
} from 'lucide-react';
import { aiApi, culturalPhilosophyApi } from '@/lib/api';
import { Button } from '@/app/components/ui/Button';

interface CulturalFusionDesignerProps {
  projectId: string;
  onDesignGenerated?: (design: any) => void;
}

const CulturalFusionDesigner: React.FC<CulturalFusionDesignerProps> = ({
  projectId,
  onDesignGenerated
}) => {
  const [availablePhilosophies, setAvailablePhilosophies] = useState<any[]>([]);
  const [selectedPrimary, setSelectedPrimary] = useState<string>('');
  const [selectedSecondary, setSelectedSecondary] = useState<string>('');
  const [fusionApproach, setFusionApproach] = useState<'respectful_blend' | 'harmonic_fusion' | 'selective_integration'>('respectful_blend');
  const [compatibilityData, setCompatibilityData] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [fusionResult, setFusionResult] = useState<any>(null);
  const [step, setStep] = useState<'selection' | 'analysis' | 'generation' | 'results'>('selection');

  useEffect(() => {
    loadPhilosophies();
  }, []);

  const loadPhilosophies = async () => {
    try {
      const response = await culturalPhilosophyApi.getAllPhilosophies();
      setAvailablePhilosophies(response.philosophies);
    } catch (error) {
      console.error('Failed to load philosophies:', error);
    }
  };

  const analyzeCompatibility = async () => {
    if (!selectedPrimary || !selectedSecondary) return;
    
    setIsAnalyzing(true);
    try {
      const result = await culturalPhilosophyApi.validateCulturalFusion({
        primaryPhilosophy: selectedPrimary,
        secondaryPhilosophy: selectedSecondary,
        eventContext: 'celebration_event'
      });
      
      setCompatibilityData(result);
      setStep('analysis');
    } catch (error) {
      console.error('Failed to analyze compatibility:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateFusionDesign = async () => {
    setIsGenerating(true);
    try {
      const result = await aiApi.generateFusionDesign({
        projectId,
        primaryPhilosophy: selectedPrimary,
        secondaryPhilosophy: selectedSecondary,
        fusionApproach
      });
      
      setFusionResult(result);
      setStep('results');
      onDesignGenerated?.(result);
    } catch (error) {
      console.error('Failed to generate fusion design:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getCompatibilityColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 0.6) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getCompatibilityIcon = (score: number) => {
    if (score >= 0.8) return <CheckCircle className="w-5 h-5" />;
    if (score >= 0.6) return <Info className="w-5 h-5" />;
    return <AlertTriangle className="w-5 h-5" />;
  };

  const fusionApproaches = [
    {
      id: 'respectful_blend',
      name: 'Respectful Blend',
      description: 'Carefully combines elements while maintaining cultural integrity',
      icon: Heart,
      safety: 'high'
    },
    {
      id: 'harmonic_fusion',
      name: 'Harmonic Fusion',
      description: 'Creates harmony between philosophies with balanced integration',
      icon: Palette,
      safety: 'medium'
    },
    {
      id: 'selective_integration',
      name: 'Selective Integration',
      description: 'Strategically selects specific elements for thoughtful combination',
      icon: Sparkles,
      safety: 'medium'
    }
  ];

  const renderPhilosophyCard = (philosophy: any, isSelected: boolean, onSelect: () => void) => (
    <motion.div
      layoutId={philosophy.id}
      onClick={onSelect}
      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
        isSelected 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-200 hover:border-gray-300 bg-white'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <h3 className="font-semibold text-gray-900">{philosophy.name}</h3>
      <p className="text-sm text-gray-600 mt-1">{philosophy.culture}</p>
      <div className="mt-2 flex flex-wrap gap-1">
        {philosophy.core_principles?.slice(0, 2).map((principle: string, index: number) => (
          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
            {principle}
          </span>
        ))}
      </div>
    </motion.div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Cultural Fusion Designer
        </h2>
        <p className="text-gray-600">
          Create respectful multi-cultural designs with AI guidance and cultural validation
        </p>
      </div>

      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {['selection', 'analysis', 'generation', 'results'].map((stepName, index) => (
            <div key={stepName} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === stepName ? 'bg-blue-600 text-white' :
                ['selection', 'analysis', 'generation', 'results'].indexOf(step) > index 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {index + 1}
              </div>
              {index < 3 && (
                <ArrowRight className="w-4 h-4 text-gray-400 mx-2" />
              )}
            </div>
          ))}
        </div>
        <div className="mt-2 text-sm text-gray-600 text-center">
          {step === 'selection' && 'Select Cultural Philosophies'}
          {step === 'analysis' && 'Compatibility Analysis'}
          {step === 'generation' && 'Design Generation'}
          {step === 'results' && 'Fusion Results'}
        </div>
      </div>

      {/* Selection Step */}
      {step === 'selection' && (
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">
              Primary Cultural Philosophy
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availablePhilosophies.map((philosophy) => 
                renderPhilosophyCard(
                  philosophy,
                  selectedPrimary === philosophy.id,
                  () => setSelectedPrimary(philosophy.id)
                )
              )}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">
              Secondary Cultural Philosophy
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availablePhilosophies
                .filter(p => p.id !== selectedPrimary)
                .map((philosophy) => 
                  renderPhilosophyCard(
                    philosophy,
                    selectedSecondary === philosophy.id,
                    () => setSelectedSecondary(philosophy.id)
                  )
                )}
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={analyzeCompatibility}
              disabled={!selectedPrimary || !selectedSecondary || isAnalyzing}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
            >
              {isAnalyzing ? 'Analyzing Compatibility...' : 'Analyze Compatibility'}
            </Button>
          </div>
        </div>
      )}

      {/* Analysis Step */}
      {step === 'analysis' && compatibilityData && (
        <div className="space-y-6">
          <div className={`p-4 rounded-lg border ${getCompatibilityColor(compatibilityData.compatibility.overall_score)}`}>
            <div className="flex items-center space-x-3 mb-3">
              {getCompatibilityIcon(compatibilityData.compatibility.overall_score)}
              <h3 className="font-semibold">
                Compatibility Score: {(compatibilityData.compatibility.overall_score * 100).toFixed(0)}%
              </h3>
            </div>
            <p className="text-sm mb-3">
              Recommended Approach: {compatibilityData.compatibility.recommended_approach}
            </p>
          </div>

          {compatibilityData.compatibility.potential_conflicts?.length > 0 && (
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-medium text-yellow-900 mb-2">Potential Conflicts:</h4>
              <ul className="space-y-1">
                {compatibilityData.compatibility.potential_conflicts.map((conflict: string, index: number) => (
                  <li key={index} className="text-sm text-yellow-800 flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{conflict}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Choose Fusion Approach</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {fusionApproaches.map((approach) => {
                const Icon = approach.icon;
                return (
                  <motion.div
                    key={approach.id}
                    onClick={() => setFusionApproach(approach.id as any)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      fusionApproach === approach.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon className="w-5 h-5 text-gray-600" />
                      <h5 className="font-medium text-gray-900">{approach.name}</h5>
                    </div>
                    <p className="text-sm text-gray-600">{approach.description}</p>
                    <div className="mt-2">
                      <span className={`px-2 py-1 text-xs rounded ${
                        approach.safety === 'high' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {approach.safety === 'high' ? 'Safe' : 'Moderate Risk'}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {compatibilityData.fusion_guidance.consultation_required && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="w-5 h-5 text-blue-600" />
                <h4 className="font-medium text-blue-900">Cultural Expert Consultation Required</h4>
              </div>
              <p className="text-sm text-blue-800">
                This fusion combination requires consultation with cultural experts to ensure respectful representation.
              </p>
            </div>
          )}

          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => setStep('selection')}
              variant="outline"
              className="px-6 py-2"
            >
              Back to Selection
            </Button>
            <Button
              onClick={generateFusionDesign}
              disabled={isGenerating}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
            >
              {isGenerating ? 'Generating Design...' : 'Generate Fusion Design'}
            </Button>
          </div>
        </div>
      )}

      {/* Results Step */}
      {step === 'results' && fusionResult && (
        <div className="space-y-6">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-900 mb-2">Fusion Design Generated Successfully!</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-green-700">Cultural Harmony:</span>
                <div className="font-medium">
                  {(fusionResult.fusionAnalysis.culturalHarmony * 100).toFixed(0)}%
                </div>
              </div>
              <div>
                <span className="text-green-700">Appropriateness:</span>
                <div className="font-medium">
                  {(fusionResult.validationResult.culturalAppropriateness * 100).toFixed(0)}%
                </div>
              </div>
              <div>
                <span className="text-green-700">Compatibility:</span>
                <div className="font-medium">
                  {(fusionResult.fusionAnalysis.compatibility * 100).toFixed(0)}%
                </div>
              </div>
              <div>
                <span className="text-green-700">Consultation:</span>
                <div className="font-medium">
                  {fusionResult.fusionAnalysis.consultationRequired ? 'Required' : 'Optional'}
                </div>
              </div>
            </div>
          </div>

          {fusionResult.fusionAnalysis.blendingGuidance && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">Blending Guidance:</h4>
              <ul className="space-y-1">
                {fusionResult.fusionAnalysis.blendingGuidance.slice(0, 3).map((guidance: string, index: number) => (
                  <li key={index} className="text-sm text-blue-800 flex items-start space-x-2">
                    <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{guidance}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {fusionResult.validationResult.warnings?.length > 0 && (
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-medium text-yellow-900 mb-2">Cultural Warnings:</h4>
              <ul className="space-y-1">
                {fusionResult.validationResult.warnings.map((warning: string, index: number) => (
                  <li key={index} className="text-sm text-yellow-800 flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{warning}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => {
                setStep('selection');
                setFusionResult(null);
                setCompatibilityData(null);
              }}
              variant="outline"
              className="px-6 py-2"
            >
              Create New Fusion
            </Button>
            <Button
              onClick={() => onDesignGenerated?.(fusionResult)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
            >
              Apply to Project
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CulturalFusionDesigner;