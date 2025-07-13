export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  parameters?: ExtractedParameters;
  clarificationOptions?: ClarificationOption[];
}

export interface ExtractedParameters {
  eventType?: string;
  guestCount?: number;
  budget?: string;
  culture?: string;
  style?: string;
  spaceType?: string;
  timeOfDay?: string;
  missing?: string[];
}

export interface ClarificationOption {
  id: string;
  question: string;
  options: string[];
  required: boolean;
}

export interface ParameterExtractionRequest {
  message: string;
  existingParams: ExtractedParameters;
  conversationHistory: ChatMessage[];
}

export interface ParameterExtractionResponse {
  extractedParams: ExtractedParameters;
  needsClarification: boolean;
  clarificationQuestion?: string;
  clarificationOptions?: ClarificationOption;
  readyToGenerate: boolean;
  response: string;
}

export interface Design3DGenerationRequest {
  eventRequirements: {
    event_type?: string;
    guest_count?: number;
    budget_range?: string;
    cultural_background?: string[];
    style_preferences?: string[];
    space_type?: string;
    time_of_day?: string;
  };
  spaceData: {
    dimensions: {
      width: number;
      depth: number;
      height: number;
    };
    type: string;
  };
}

// System capabilities boundary
export const SYSTEM_CAPABILITIES = {
  eventTypes: [
    'wedding', 'birthday-child', 'birthday-adult', 'corporate', 
    'baby-shower', 'graduation', 'anniversary', 'cultural-celebration',
    'quinceañera', 'bar-bat-mitzvah', 'product-launch'
  ],
  cultures: [
    'japanese', 'scandinavian', 'italian', 'french', 'modern',
    'american', 'mexican', 'korean', 'jewish', 'indian', 'mixed-heritage'
  ],
  budgetRanges: [
    'under-2k', '2k-5k', '5k-15k', '15k-30k', '30k-50k', 'over-50k'
  ],
  stylePreferences: [
    'elegant', 'rustic', 'modern', 'traditional', 'minimalist', 
    'vintage', 'bohemian', 'industrial', 'wabi-sabi', 'hygge', 
    'bella-figura', 'savoir-vivre'
  ],
  spaceTypes: [
    'indoor', 'outdoor', 'ballroom', 'conference-room', 'backyard',
    'pavilion', 'home-living-room', 'rooftop', 'garden'
  ],
  timeOfDay: ['morning', 'afternoon', 'evening', 'all-day']
};

// Helper functions
// Get API base URL from environment or use default
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const extractParametersFromMessage = async (
  request: ParameterExtractionRequest
): Promise<ParameterExtractionResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/ai/extract-parameters`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
  });

  if (!response.ok) {
    throw new Error(`Parameter extraction failed: ${response.statusText}`);
  }

  return response.json();
};

export const generateDesign3D = async (
  request: Design3DGenerationRequest
): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/api/ai/generate-3d-scene`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
  });

  if (!response.ok) {
    throw new Error(`3D generation failed: ${response.statusText}`);
  }

  return response.json();
};

// Formatting helpers
export const formatParameterValue = (key: string, value: any): string => {
  switch (key) {
    case 'guestCount':
      return `${value} guests`;
    case 'budget':
      return value
        .replace('-', ' - $')
        .replace('k', ',000')
        .replace('under', 'Under')
        .replace('over', 'Over');
    case 'eventType':
      return value
        .split('-')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    case 'culture':
    case 'timeOfDay':
    case 'spaceType':
    case 'style':
      return value.charAt(0).toUpperCase() + value.slice(1);
    default:
      return value;
  }
};

// Validation helpers
export const validateParameter = (key: string, value: any): boolean => {
  switch (key) {
    case 'guestCount':
      const count = parseInt(value);
      return !isNaN(count) && count >= 1 && count <= 1000;
    case 'eventType':
      return SYSTEM_CAPABILITIES.eventTypes.includes(value);
    case 'culture':
      return SYSTEM_CAPABILITIES.cultures.includes(value);
    case 'budget':
      return SYSTEM_CAPABILITIES.budgetRanges.includes(value);
    case 'style':
      return SYSTEM_CAPABILITIES.stylePreferences.includes(value);
    case 'spaceType':
      return SYSTEM_CAPABILITIES.spaceTypes.includes(value);
    case 'timeOfDay':
      return SYSTEM_CAPABILITIES.timeOfDay.includes(value);
    default:
      return false;
  }
};

// Chat history helpers
export const getRecentMessages = (messages: ChatMessage[], count: number = 5): ChatMessage[] => {
  return messages.slice(-count);
};

export const hasAllRequiredParameters = (params: ExtractedParameters): boolean => {
  return !!(params.eventType && params.guestCount && params.budget);
};