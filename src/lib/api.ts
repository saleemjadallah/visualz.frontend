import axios from 'axios';
import { 
  User, 
  UserLogin, 
  UserRegister, 
  AuthToken, 
  Project, 
  Design, 
  ApiResponse 
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9847';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

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

// AI API
export const aiApi = {
  generateDesign: async (request: {
    project_id: string;
    style_preferences?: string[];
    priority_elements?: string[];
    avoid_elements?: string[];
  }): Promise<Design> => {
    const response = await api.post<Design>('/api/ai/generate-design', request);
    return response.data;
  },

  validateCulturalSensitivity: async (designId: string): Promise<any> => {
    const response = await api.post(`/api/ai/validate-cultural-sensitivity?design_id=${designId}`);
    return response.data;
  },

  getCulturalElements: async (culture: string): Promise<any> => {
    const response = await api.get(`/api/ai/cultural-elements/${culture}`);
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