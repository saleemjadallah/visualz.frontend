import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { 
  User, 
  UserLogin, 
  UserRegister, 
  AuthToken, 
  Project, 
  Design, 
  ApiResponse,
  CultureType,
  BudgetTier,
  EventType,
  CelebrationType,
  CelebrationAmenity,
  EventRequirementsForm
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9847';
const API_TIMEOUT = 30000; // 30 seconds

// Enhanced API response interface
export interface EnhancedAPIResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
    culturalContext?: CultureType;
    timestamp: string;
  };
}

// API Error interface
export interface APIError {
  message: string;
  code?: string;
  status?: number;
  errors?: string[];
  culturalContext?: CultureType;
}

// Create enhanced axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Enhanced request interceptor
api.interceptors.request.use(
  (config) => {
    // Add authentication token
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add cultural context header
    const culturalContext = typeof window !== 'undefined' ? localStorage.getItem('culturalContext') : null;
    if (culturalContext) {
      config.headers['X-Cultural-Context'] = culturalContext;
    }

    // Add request timestamp
    config.headers['X-Request-Timestamp'] = new Date().toISOString();

    // Add user agent for analytics
    if (typeof window !== 'undefined') {
      config.headers['X-User-Agent'] = navigator.userAgent;
    }

    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
      headers: config.headers,
      data: config.data,
    });

    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Enhanced response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
      status: response.status,
      data: response.data,
    });

    return response;
  },
  (error: AxiosError) => {
    console.error('[API Response Error]', error);

    // Handle different error types
    const apiError: APIError = {
      message: 'An unexpected error occurred',
      status: error.response?.status,
      code: error.code,
    };

    if (error.response) {
      // Server responded with error status
      const responseData = error.response.data as any;
      apiError.message = responseData.message || `Server error: ${error.response.status}`;
      apiError.errors = responseData.errors;
      apiError.culturalContext = responseData.culturalContext;
    } else if (error.request) {
      // Request was made but no response received
      apiError.message = 'Network error - please check your connection';
      apiError.code = 'NETWORK_ERROR';
    } else {
      // Error setting up the request
      apiError.message = error.message || 'Request configuration error';
      apiError.code = 'REQUEST_ERROR';
    }

    // Handle specific error codes
    switch (error.response?.status) {
      case 401:
        apiError.message = 'Authentication required';
        // Clear invalid token
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          window.location.href = '/auth/login';
        }
        break;
      case 403:
        apiError.message = 'Access forbidden';
        break;
      case 404:
        apiError.message = 'Resource not found';
        break;
      case 422:
        apiError.message = 'Validation error';
        break;
      case 429:
        apiError.message = 'Too many requests - please try again later';
        break;
      case 500:
        apiError.message = 'Internal server error';
        break;
      case 503:
        apiError.message = 'Service temporarily unavailable';
        break;
    }

    return Promise.reject(apiError);
  }
);

// Error handling utility
export const handleApiError = (error: APIError, showToast?: (message: string) => void) => {
  console.error('[API Error]', error);

  // Show user-friendly error message
  if (showToast) {
    showToast(error.message);
  }

  // Log error for monitoring
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'api_error', {
      error_message: error.message,
      error_code: error.code,
      error_status: error.status,
    });
  }

  return error;
};

// Retry utility
export const retryApiCall = async <T>(
  apiCall: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: APIError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error as APIError;
      
      // Don't retry on certain error codes
      if (lastError.status && [400, 401, 403, 404, 422].includes(lastError.status)) {
        throw lastError;
      }

      // Wait before retrying
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }

  throw lastError!;
};

// Auth API
export const authApi = {
  register: async (userData: UserRegister): Promise<AuthToken> => {
    const response = await api.post<AuthToken>('/api/auth/register', userData);
    return response.data;
  },

  login: async (credentials: UserLogin): Promise<AuthToken> => {
    const response = await api.post<AuthToken>('/api/auth/login', credentials);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/api/auth/me');
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/api/auth/logout');
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  }
};

// Projects API
export const projectsApi = {
  getProjects: async (): Promise<Project[]> => {
    const response = await api.get<Project[]>('/api/projects/');
    return response.data;
  },

  getProject: async (id: string): Promise<Project> => {
    const response = await api.get<Project>(`/api/projects/${id}`);
    return response.data;
  },

  createProject: async (projectData: Omit<Project, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Project> => {
    const response = await api.post<Project>('/api/projects/', projectData);
    return response.data;
  },

  updateProject: async (id: string, projectData: Partial<Project>): Promise<Project> => {
    const response = await api.put<Project>(`/api/projects/${id}`, projectData);
    return response.data;
  },

  deleteProject: async (id: string): Promise<void> => {
    await api.delete(`/api/projects/${id}`);
  }
};

// Designs API
export const designsApi = {
  getProjectDesigns: async (projectId: string): Promise<Design[]> => {
    const response = await api.get<Design[]>(`/api/designs/project/${projectId}`);
    return response.data;
  },

  getDesign: async (id: string): Promise<Design> => {
    const response = await api.get<Design>(`/api/designs/${id}`);
    return response.data;
  },

  createDesign: async (designData: Omit<Design, 'id' | 'user_id' | 'version' | 'created_at' | 'updated_at'>): Promise<Design> => {
    const response = await api.post<Design>('/api/designs/', designData);
    return response.data;
  },

  updateDesign: async (id: string, designData: Partial<Design>): Promise<Design> => {
    const response = await api.put<Design>(`/api/designs/${id}`, designData);
    return response.data;
  },

  deleteDesign: async (id: string): Promise<void> => {
    await api.delete(`/api/designs/${id}`);
  }
};

// Enhanced AI API with cultural context
export const aiApi = {
  generateDesign: async (request: {
    project_id: string;
    style_preferences?: string[];
    priority_elements?: string[];
    avoid_elements?: string[];
    cultural_context?: CultureType;
    budget_tier?: BudgetTier;
    event_type?: EventType;
  }): Promise<Design> => {
    const response = await api.post<Design>('/api/ai/generate-design', request);
    return response.data;
  },

  generateCelebrationDesign: async (formData: EventRequirementsForm): Promise<Design> => {
    const response = await api.post<Design>('/api/ai/generate-3d-scene', {
      event_type: formData.eventType,
      celebration_type: formData.celebrationType,
      cultural_preferences: formData.culturalPreferences,
      budget_tier: formData.budgetTier,
      guest_count: formData.guestCount,
      age_range: formData.ageRange,
      space_data: formData.spaceData,
      celebration_amenities: formData.celebrationAmenities,
      style_preferences: formData.stylePreferences,
      special_needs: formData.specialNeeds
    });
    return response.data;
  },

  getCelebrationAmenities: async (celebrationType: CelebrationType): Promise<CelebrationAmenity[]> => {
    const response = await api.get<CelebrationAmenity[]>(`/api/ai/celebration-amenities/${celebrationType}`);
    return response.data;
  },

  getCelebrationSuggestions: async (celebrationType: CelebrationType, culturalContext: CultureType): Promise<{
    suggestedAmenities: string[];
    traditionalElements: string[];
    culturalRequirements: string[];
    ceremonialAspects: string[];
  }> => {
    const response = await api.get(`/api/ai/celebration-suggestions`, {
      params: { 
        celebration_type: celebrationType, 
        cultural_context: culturalContext 
      }
    });
    return response.data;
  },

  validateCulturalSensitivity: async (designId: string, culturalContext?: CultureType): Promise<{
    valid: boolean;
    warnings: string[];
    suggestions: string[];
    culturalScore: number;
  }> => {
    const response = await api.post(`/api/ai/validate-cultural-sensitivity?design_id=${designId}`, {
      cultural_context: culturalContext
    });
    return response.data;
  },

  getCulturalElements: async (culture: CultureType): Promise<{
    colors: string[];
    patterns: any[];
    symbols: any[];
    materials: string[];
    restrictions: string[];
  }> => {
    const response = await api.get(`/api/ai/cultural-elements/${culture}`);
    return response.data;
  },

  getCulturalSuggestions: async (eventType: EventType, culture: CultureType): Promise<{
    suggestions: string[];
    themes: string[];
    avoid: string[];
  }> => {
    const response = await api.get(`/api/ai/cultural-suggestions`, {
      params: { event_type: eventType, culture }
    });
    return response.data;
  },

  analyzeImageForCulture: async (imageUrl: string, targetCulture: CultureType): Promise<{
    culturalElements: any[];
    appropriateness: number;
    recommendations: string[];
  }> => {
    const response = await api.post('/api/ai/analyze-image', {
      image_url: imageUrl,
      target_culture: targetCulture
    });
    return response.data;
  }
};

// Cultural API
export const culturalApi = {
  getCulturalThemes: async (): Promise<{
    [key in CultureType]: {
      name: string;
      description: string;
      colors: string[];
      patterns: string[];
      symbols: string[];
    }
  }> => {
    const response = await api.get('/api/cultural/themes');
    return response.data;
  },

  validateCulturalUsage: async (elements: any[], culture: CultureType): Promise<{
    valid: boolean;
    warnings: string[];
    suggestions: string[];
  }> => {
    const response = await api.post('/api/cultural/validate', {
      elements,
      culture
    });
    return response.data;
  },

  getCulturalColors: async (culture: CultureType): Promise<{
    primary: string[];
    secondary: string[];
    accent: string[];
    neutral: string[];
  }> => {
    const response = await api.get(`/api/cultural/colors/${culture}`);
    return response.data;
  },

  getCulturalPatterns: async (culture: CultureType): Promise<{
    patterns: Array<{
      name: string;
      description: string;
      usage: string;
      restrictions: string[];
    }>;
  }> => {
    const response = await api.get(`/api/cultural/patterns/${culture}`);
    return response.data;
  }
};

// File upload helper
export const uploadFile = async (file: File, type: 'image' | 'document' = 'image'): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);

  const response = await api.post<{ url: string }>('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.url;
};

// Health check
export const healthCheck = async (): Promise<boolean> => {
  try {
    await api.get('/health');
    return true;
  } catch (error) {
    return false;
  }
};

export default api;