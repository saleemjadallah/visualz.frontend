import { ExtractedParameters, Design3DGenerationRequest } from './chat-api';

// Get API base URL from environment or use default
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Parametric generation request types
export interface ParametricFurnitureRequest {
  event_type: string;
  cultural_style: string;
  guest_count: number;
  space_dimensions: {
    width: number;
    depth: number;
    height: number;
  };
  furniture_types: string[];
  budget_tier: string;
  accessibility_requirements?: string[];
}

export interface ParametricLightingRequest {
  event_type: string;
  cultural_style: string;
  space_dimensions: {
    width: number;
    depth: number;
    height: number;
  };
  time_of_day: string;
  ambiance_level: string;
  color_temperature?: string;
}

export interface ParametricFloralRequest {
  event_type: string;
  cultural_style: string;
  guest_count: number;
  season?: string;
  color_scheme?: string[];
  arrangement_types: string[];
}

export interface ParametricStageRequest {
  event_type: string;
  entertainment_type: string;
  guest_count: number;
  space_dimensions: {
    width: number;
    depth: number;
  };
  av_requirements?: string[];
}

export interface CompleteEventRequest {
  event_requirements: {
    event_type: string;
    guest_count: number;
    budget_range: string;
    cultural_background: string[];
    style_preferences: string[];
    space_type: string;
    time_of_day: string;
  };
  space_data: {
    dimensions: {
      width: number;
      depth: number;
      height: number;
    };
    type: string;
  };
  systems_to_generate: string[];
}

// Parametric API functions
export const generateParametricFurniture = async (
  request: ParametricFurnitureRequest
): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/api/parametric/furniture/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
  });

  if (!response.ok) {
    throw new Error(`Parametric furniture generation failed: ${response.statusText}`);
  }

  return response.json();
};

export const generateParametricLighting = async (
  request: ParametricLightingRequest
): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/api/parametric/lighting/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
  });

  if (!response.ok) {
    throw new Error(`Parametric lighting generation failed: ${response.statusText}`);
  }

  return response.json();
};

export const generateParametricFloral = async (
  request: ParametricFloralRequest
): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/api/parametric/floral/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
  });

  if (!response.ok) {
    throw new Error(`Parametric floral generation failed: ${response.statusText}`);
  }

  return response.json();
};

export const generateParametricStage = async (
  request: ParametricStageRequest
): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/api/parametric/stage/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
  });

  if (!response.ok) {
    throw new Error(`Parametric stage generation failed: ${response.statusText}`);
  }

  return response.json();
};

export const generateCompleteParametricEvent = async (
  request: CompleteEventRequest
): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/api/parametric/generate-complete-event`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
  });

  if (!response.ok) {
    throw new Error(`Complete event generation failed: ${response.statusText}`);
  }

  return response.json();
};

export const renderCompleteScene = async (
  sceneData: any
): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/api/parametric/render/complete-scene`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scene_data: sceneData })
  });

  if (!response.ok) {
    throw new Error(`Scene rendering failed: ${response.statusText}`);
  }

  return response.json();
};

// Export functions
export const exportParametricFurniture = async (
  furnitureId: string,
  format: 'gltf' | 'glb' | 'obj' | 'stl' = 'glb'
): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/api/parametric-furniture/export/${furnitureId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ format })
  });

  if (!response.ok) {
    throw new Error(`Export failed: ${response.statusText}`);
  }

  return response.json();
};

// Helper function to convert chat parameters to parametric requests
export const convertChatToParametricRequests = (params: ExtractedParameters) => {
  const spaceDimensions = {
    width: 30, // Default dimensions
    depth: 20,
    height: 10
  };

  const furnitureRequest: ParametricFurnitureRequest = {
    event_type: params.eventType || 'celebration',
    cultural_style: params.culture || 'modern',
    guest_count: params.guestCount || 50,
    space_dimensions: spaceDimensions,
    furniture_types: determineFurnitureTypes(params.eventType, params.guestCount),
    budget_tier: params.budget || 'medium',
    accessibility_requirements: []
  };

  const lightingRequest: ParametricLightingRequest = {
    event_type: params.eventType || 'celebration',
    cultural_style: params.culture || 'modern',
    space_dimensions: spaceDimensions,
    time_of_day: params.timeOfDay || 'evening',
    ambiance_level: determineAmbianceLevel(params.eventType),
    color_temperature: params.timeOfDay === 'evening' ? '3000K' : '4000K'
  };

  const floralRequest: ParametricFloralRequest = {
    event_type: params.eventType || 'celebration',
    cultural_style: params.culture || 'modern',
    guest_count: params.guestCount || 50,
    arrangement_types: determineFloralTypes(params.eventType, params.culture)
  };

  const completeEventRequest: CompleteEventRequest = {
    event_requirements: {
      event_type: params.eventType || 'celebration',
      guest_count: params.guestCount || 50,
      budget_range: params.budget || 'medium',
      cultural_background: params.culture ? [params.culture] : [],
      style_preferences: params.style ? [params.style] : [],
      space_type: params.spaceType || 'indoor',
      time_of_day: params.timeOfDay || 'evening'
    },
    space_data: {
      dimensions: spaceDimensions,
      type: params.spaceType || 'ballroom'
    },
    systems_to_generate: ['furniture', 'lighting', 'floral', 'climate', 'av']
  };

  return {
    furnitureRequest,
    lightingRequest,
    floralRequest,
    completeEventRequest
  };
};

// Helper functions
function determineFurnitureTypes(eventType?: string, guestCount?: number): string[] {
  const baseTypes = ['seating', 'tables'];
  
  if (eventType?.includes('wedding')) {
    baseTypes.push('altar', 'aisle-decor');
  } else if (eventType?.includes('birthday')) {
    baseTypes.push('gift-table', 'cake-table');
  } else if (eventType?.includes('corporate')) {
    baseTypes.push('podium', 'presentation-screen');
  }
  
  if (guestCount && guestCount > 100) {
    baseTypes.push('additional-seating');
  }
  
  return baseTypes;
}

function determineAmbianceLevel(eventType?: string): string {
  if (eventType?.includes('wedding') || eventType?.includes('anniversary')) {
    return 'romantic';
  } else if (eventType?.includes('corporate')) {
    return 'professional';
  } else if (eventType?.includes('birthday')) {
    return 'festive';
  }
  return 'balanced';
}

function determineFloralTypes(eventType?: string, culture?: string): string[] {
  const types = ['centerpieces'];
  
  if (eventType?.includes('wedding')) {
    types.push('bridal-bouquet', 'arch-arrangements');
  }
  
  if (culture === 'japanese') {
    types.push('ikebana');
  } else if (culture === 'indian') {
    types.push('garlands', 'rangoli-inspired');
  }
  
  return types;
}

// Advanced parametric generation with AI optimization
export const generateOptimizedParametricDesign = async (
  chatParams: ExtractedParameters
): Promise<any> => {
  // First, use the complete event generation endpoint
  const { completeEventRequest } = convertChatToParametricRequests(chatParams);
  
  try {
    // Generate complete parametric event
    const eventResult = await generateCompleteParametricEvent(completeEventRequest);
    
    // If successful, render the complete scene
    if (eventResult.success && eventResult.scene_data) {
      const renderedScene = await renderCompleteScene(eventResult.scene_data);
      
      return {
        ...eventResult,
        rendered_scene: renderedScene,
        parametric_systems: {
          furniture: eventResult.furniture_system,
          lighting: eventResult.lighting_system,
          floral: eventResult.floral_system,
          stage: eventResult.stage_system
        }
      };
    }
    
    return eventResult;
  } catch (error) {
    console.error('Parametric generation error:', error);
    throw error;
  }
};