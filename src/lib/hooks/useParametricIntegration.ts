// useParametricIntegration Hook - Manages the complete AI Parametric System integration flow

import { useState, useCallback } from 'react';
import { 
  convertFormToCompleteEventParams,
  validateFormData,
  getEstimatedCosts,
  VisionFormData 
} from '../utils/parameterMapping';
import { useFormProgressStore } from '../store';
import { 
  UserFurnitureRequest,
  LightingParameters,
  FloralParameters,
  StageParameters 
} from '../types';

// Backend integration endpoint configuration
const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

interface ParametricGenerationResult {
  furniture: {
    models: any[];
    culturalScore: number;
    recommendations: string[];
  };
  lighting?: {
    setup: any;
    ambiance: string;
    powerUsage: number;
  };
  floral?: {
    arrangements: any[];
    seasonalElements: string[];
    sustainabilityScore: number;
  };
  stage?: {
    configuration: any;
    accessibilityFeatures: string[];
    audioSpecs: any;
  };
  summary: {
    totalBudget: number;
    culturalAuthenticity: number;
    sustainabilityScore: number;
    accessibility: string[];
    timeline: string;
  };
  previewUrl?: string;
  designId: string;
}

interface UseParametricIntegrationState {
  // State
  isGenerating: boolean;
  generationProgress: number;
  currentPhase: 'idle' | 'validating' | 'converting' | 'generating' | 'rendering' | 'complete' | 'error';
  result: ParametricGenerationResult | null;
  error: string | null;
  
  // Generation breakdown
  progressPhases: {
    validation: boolean;
    parameterConversion: boolean;
    furnitureGeneration: boolean;
    lightingGeneration: boolean;
    floralGeneration: boolean;
    stageGeneration: boolean;
    rendering: boolean;
    finalization: boolean;
  };
  
  // Actions
  generateCompleteEvent: (formData: VisionFormData) => Promise<ParametricGenerationResult | null>;
  resetGeneration: () => void;
  retryGeneration: () => void;
  cancelGeneration: () => void;
}

export const useParametricIntegration = (): UseParametricIntegrationState => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<UseParametricIntegrationState['currentPhase']>('idle');
  const [result, setResult] = useState<ParametricGenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastFormData, setLastFormData] = useState<VisionFormData | null>(null);
  
  const [progressPhases, setProgressPhases] = useState({
    validation: false,
    parameterConversion: false,
    furnitureGeneration: false,
    lightingGeneration: false,
    floralGeneration: false,
    stageGeneration: false,
    rendering: false,
    finalization: false
  });

  const { updateFormData, setError: setFormError, clearAllErrors } = useFormProgressStore();

  // Helper function to update progress
  const updateProgress = useCallback((phase: string, progress: number) => {
    setGenerationProgress(progress);
    setCurrentPhase(phase as UseParametricIntegrationState['currentPhase']);
  }, []);

  // Helper function to mark phase complete
  const markPhaseComplete = useCallback((phase: keyof typeof progressPhases) => {
    setProgressPhases(prev => ({ ...prev, [phase]: true }));
  }, []);

  // Main generation function
  const generateCompleteEvent = useCallback(async (formData: VisionFormData): Promise<ParametricGenerationResult | null> => {
    try {
      setIsGenerating(true);
      setError(null);
      setResult(null);
      setLastFormData(formData);
      clearAllErrors();
      
      // Reset progress phases
      setProgressPhases({
        validation: false,
        parameterConversion: false,
        furnitureGeneration: false,
        lightingGeneration: false,
        floralGeneration: false,
        stageGeneration: false,
        rendering: false,
        finalization: false
      });

      // Phase 1: Validation (5%)
      updateProgress('validating', 5);
      const validation = validateFormData(formData);
      if (!validation.isValid) {
        throw new Error(`Missing required fields: ${validation.missingFields.join(', ')}`);
      }
      markPhaseComplete('validation');

      // Phase 2: Parameter Conversion (15%)
      updateProgress('converting', 15);
      const eventParams = convertFormToCompleteEventParams(formData);
      const estimatedCosts = getEstimatedCosts(formData);
      markPhaseComplete('parameterConversion');

      // Phase 3: Generate Furniture (35%)
      updateProgress('generating', 35);
      const furnitureResponse = await fetch(`${BACKEND_BASE_URL}/api/parametric/furniture/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          request: eventParams.furniture,
          options: {
            includeCulturalAnalysis: true,
            generateRecommendations: true,
            optimizeForBudget: true
          }
        })
      });

      if (!furnitureResponse.ok) {
        throw new Error(`Furniture generation failed: ${furnitureResponse.statusText}`);
      }

      const furnitureResult = await furnitureResponse.json();
      markPhaseComplete('furnitureGeneration');

      // Phase 4: Generate Lighting (50%)
      updateProgress('generating', 50);
      let lightingResult = null;
      if (eventParams.lighting) {
        const lightingResponse = await fetch(`${BACKEND_BASE_URL}/api/parametric/lighting/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            parameters: eventParams.lighting,
            integrationMode: 'with-furniture'
          })
        });

        if (lightingResponse.ok) {
          lightingResult = await lightingResponse.json();
        }
      }
      markPhaseComplete('lightingGeneration');

      // Phase 5: Generate Floral (65%)
      updateProgress('generating', 65);
      let floralResult = null;
      if (eventParams.floral) {
        const floralResponse = await fetch(`${BACKEND_BASE_URL}/api/parametric/floral/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            parameters: eventParams.floral,
            sustainabilityFocus: true
          })
        });

        if (floralResponse.ok) {
          floralResult = await floralResponse.json();
        }
      }
      markPhaseComplete('floralGeneration');

      // Phase 6: Generate Stage (80%)
      updateProgress('generating', 80);
      let stageResult = null;
      if (eventParams.stage) {
        const stageResponse = await fetch(`${BACKEND_BASE_URL}/api/parametric/stage/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            parameters: eventParams.stage,
            accessibilityCompliance: true
          })
        });

        if (stageResponse.ok) {
          stageResult = await stageResponse.json();
        }
      }
      markPhaseComplete('stageGeneration');

      // Phase 7: 3D Rendering & Preview (95%)
      updateProgress('rendering', 95);
      const renderResponse = await fetch(`${BACKEND_BASE_URL}/api/parametric/render/complete-scene`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          furniture: furnitureResult,
          lighting: lightingResult,
          floral: floralResult,
          stage: stageResult,
          renderOptions: {
            quality: 'high',
            culturalTheme: eventParams.furniture.culture,
            includeMetadata: true
          }
        })
      });

      let previewUrl = null;
      if (renderResponse.ok) {
        const renderResult = await renderResponse.json();
        previewUrl = renderResult.previewUrl;
      }
      markPhaseComplete('rendering');

      // Phase 8: Finalization (100%)
      updateProgress('complete', 100);
      
      // Calculate overall scores
      const culturalAuthenticity = furnitureResult.culturalScore || 85;
      const sustainabilityScore = floralResult?.sustainabilityScore || 75;
      const accessibilityFeatures = [
        ...(stageResult?.accessibilityFeatures || []),
        ...(formData.accessibility || [])
      ].filter((item, index, arr) => arr.indexOf(item) === index);

      const finalResult: ParametricGenerationResult = {
        furniture: {
          models: furnitureResult.models || [],
          culturalScore: furnitureResult.culturalScore || 85,
          recommendations: furnitureResult.recommendations || []
        },
        lighting: lightingResult ? {
          setup: lightingResult.setup,
          ambiance: lightingResult.ambiance || 'warm',
          powerUsage: lightingResult.powerUsage || 0
        } : undefined,
        floral: floralResult ? {
          arrangements: floralResult.arrangements || [],
          seasonalElements: floralResult.seasonalElements || [],
          sustainabilityScore: floralResult.sustainabilityScore || 75
        } : undefined,
        stage: stageResult ? {
          configuration: stageResult.configuration,
          accessibilityFeatures: stageResult.accessibilityFeatures || [],
          audioSpecs: stageResult.audioSpecs
        } : undefined,
        summary: {
          totalBudget: estimatedCosts.total,
          culturalAuthenticity,
          sustainabilityScore,
          accessibility: accessibilityFeatures,
          timeline: '2-3 weeks for full implementation'
        },
        previewUrl,
        designId: `design_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };

      markPhaseComplete('finalization');
      setResult(finalResult);
      setCurrentPhase('complete');

      // Note: Could store generation result in separate store if needed
      // For now, just log the successful generation

      return finalResult;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred during generation';
      setError(errorMessage);
      setCurrentPhase('error');
      setFormError('generation', errorMessage);
      console.error('Parametric generation error:', err);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [updateFormData, setFormError, clearAllErrors, updateProgress, markPhaseComplete]);

  // Reset generation state
  const resetGeneration = useCallback(() => {
    setIsGenerating(false);
    setGenerationProgress(0);
    setCurrentPhase('idle');
    setResult(null);
    setError(null);
    setLastFormData(null);
    setProgressPhases({
      validation: false,
      parameterConversion: false,
      furnitureGeneration: false,
      lightingGeneration: false,
      floralGeneration: false,
      stageGeneration: false,
      rendering: false,
      finalization: false
    });
    clearAllErrors();
  }, [clearAllErrors]);

  // Retry generation with last form data
  const retryGeneration = useCallback(async () => {
    if (lastFormData) {
      await generateCompleteEvent(lastFormData);
    }
  }, [lastFormData, generateCompleteEvent]);

  // Cancel generation (for future AbortController implementation)
  const cancelGeneration = useCallback(() => {
    setIsGenerating(false);
    setCurrentPhase('idle');
    setError('Generation was cancelled by user');
  }, []);

  return {
    // State
    isGenerating,
    generationProgress,
    currentPhase,
    result,
    error,
    progressPhases,
    
    // Actions
    generateCompleteEvent,
    resetGeneration,
    retryGeneration,
    cancelGeneration
  };
};

// Export types for external use
export type { ParametricGenerationResult, UseParametricIntegrationState };