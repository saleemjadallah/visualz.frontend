import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  CultureType, 
  EventRequirementsForm, 
  UploadedImage, 
  Design, 
  User, 
  Project,
  BudgetTier,
  EventType
} from './types';

// Cultural Theme Store
interface CulturalThemeState {
  currentTheme: CultureType;
  isTransitioning: boolean;
  themeHistory: CultureType[];
  setTheme: (theme: CultureType) => void;
  toggleTheme: () => void;
  resetTheme: () => void;
}

export const useCulturalThemeStore = create<CulturalThemeState>()(
  persist(
    (set, get) => ({
      currentTheme: 'japanese',
      isTransitioning: false,
      themeHistory: ['japanese'],
      
      setTheme: (theme: CultureType) => {
        const { currentTheme, themeHistory } = get();
        if (theme !== currentTheme) {
          set({ 
            isTransitioning: true,
            currentTheme: theme,
            themeHistory: [...themeHistory.slice(-4), theme]
          });
          
          // Apply theme to document
          document.documentElement.className = `theme-${theme}`;
          
          // Reset transition after animation
          setTimeout(() => {
            set({ isTransitioning: false });
          }, 300);
        }
      },
      
      toggleTheme: () => {
        const themes: CultureType[] = ['japanese', 'scandinavian', 'italian', 'french'];
        const { currentTheme } = get();
        const currentIndex = themes.indexOf(currentTheme);
        const nextTheme = themes[(currentIndex + 1) % themes.length];
        get().setTheme(nextTheme);
      },
      
      resetTheme: () => {
        get().setTheme('japanese');
      }
    }),
    {
      name: 'cultural-theme-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        currentTheme: state.currentTheme,
        themeHistory: state.themeHistory
      })
    }
  )
);

// Form Progress Store
interface FormProgressState {
  currentStep: number;
  formData: Partial<EventRequirementsForm>;
  completedSteps: number[];
  isSubmitting: boolean;
  errors: Record<string, string>;
  
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateFormData: (data: Partial<EventRequirementsForm>) => void;
  markStepComplete: (step: number) => void;
  setError: (field: string, error: string) => void;
  clearError: (field: string) => void;
  clearAllErrors: () => void;
  resetForm: () => void;
  submitForm: () => Promise<void>;
}

export const useFormProgressStore = create<FormProgressState>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      formData: {},
      completedSteps: [],
      isSubmitting: false,
      errors: {},
      
      setStep: (step: number) => {
        set({ currentStep: step });
      },
      
      nextStep: () => {
        const { currentStep, completedSteps } = get();
        const nextStep = currentStep + 1;
        if (nextStep <= 5) {
          set({ 
            currentStep: nextStep,
            completedSteps: [...new Set([...completedSteps, currentStep])]
          });
        }
      },
      
      prevStep: () => {
        const { currentStep } = get();
        if (currentStep > 1) {
          set({ currentStep: currentStep - 1 });
        }
      },
      
      updateFormData: (data: Partial<EventRequirementsForm>) => {
        const { formData } = get();
        set({ 
          formData: { ...formData, ...data },
          errors: {} // Clear errors when updating data
        });
      },
      
      markStepComplete: (step: number) => {
        const { completedSteps } = get();
        set({ completedSteps: [...new Set([...completedSteps, step])] });
      },
      
      setError: (field: string, error: string) => {
        const { errors } = get();
        set({ errors: { ...errors, [field]: error } });
      },
      
      clearError: (field: string) => {
        const { errors } = get();
        const { [field]: _, ...remainingErrors } = errors;
        set({ errors: remainingErrors });
      },
      
      clearAllErrors: () => {
        set({ errors: {} });
      },
      
      resetForm: () => {
        set({ 
          currentStep: 1,
          formData: {},
          completedSteps: [],
          isSubmitting: false,
          errors: {}
        });
      },
      
      submitForm: async () => {
        set({ isSubmitting: true });
        try {
          // Form submission logic would go here
          await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
          set({ isSubmitting: false });
        } catch (error) {
          set({ 
            isSubmitting: false,
            errors: { submit: 'Failed to submit form. Please try again.' }
          });
        }
      }
    }),
    {
      name: 'form-progress-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        formData: state.formData,
        completedSteps: state.completedSteps
      })
    }
  )
);

// User Preferences Store
interface UserPreferencesState {
  user: User | null;
  preferences: {
    favoriteThemes: CultureType[];
    defaultBudget: BudgetTier;
    language: string;
    notifications: boolean;
    darkMode: boolean;
    culturalSensitivity: boolean;
  };
  
  setUser: (user: User | null) => void;
  updatePreferences: (preferences: Partial<UserPreferencesState['preferences']>) => void;
  addFavoriteTheme: (theme: CultureType) => void;
  removeFavoriteTheme: (theme: CultureType) => void;
  resetPreferences: () => void;
}

export const useUserPreferencesStore = create<UserPreferencesState>()(
  persist(
    (set, get) => ({
      user: null,
      preferences: {
        favoriteThemes: ['japanese'],
        defaultBudget: 'comfortable',
        language: 'en',
        notifications: true,
        darkMode: false,
        culturalSensitivity: true
      },
      
      setUser: (user: User | null) => {
        set({ user });
      },
      
      updatePreferences: (newPreferences) => {
        const { preferences } = get();
        set({ preferences: { ...preferences, ...newPreferences } });
      },
      
      addFavoriteTheme: (theme: CultureType) => {
        const { preferences } = get();
        if (!preferences.favoriteThemes.includes(theme)) {
          set({ 
            preferences: { 
              ...preferences, 
              favoriteThemes: [...preferences.favoriteThemes, theme] 
            }
          });
        }
      },
      
      removeFavoriteTheme: (theme: CultureType) => {
        const { preferences } = get();
        set({ 
          preferences: { 
            ...preferences, 
            favoriteThemes: preferences.favoriteThemes.filter(t => t !== theme) 
          }
        });
      },
      
      resetPreferences: () => {
        set({ 
          preferences: {
            favoriteThemes: ['japanese'],
            defaultBudget: 'comfortable',
            language: 'en',
            notifications: true,
            darkMode: false,
            culturalSensitivity: true
          }
        });
      }
    }),
    {
      name: 'user-preferences-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
);

// Design Gallery Store
interface DesignGalleryState {
  designs: Design[];
  filteredDesigns: Design[];
  searchQuery: string;
  filters: {
    cultures: CultureType[];
    budgetTiers: BudgetTier[];
    eventTypes: EventType[];
    sortBy: 'newest' | 'oldest' | 'popular' | 'budget';
  };
  viewMode: 'grid' | 'list';
  currentPage: number;
  itemsPerPage: number;
  isLoading: boolean;
  
  setDesigns: (designs: Design[]) => void;
  addDesign: (design: Design) => void;
  updateDesign: (id: string, updates: Partial<Design>) => void;
  removeDesign: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Partial<DesignGalleryState['filters']>) => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  setCurrentPage: (page: number) => void;
  resetFilters: () => void;
  likeDesign: (id: string) => void;
  shareDesign: (id: string) => void;
}

export const useDesignGalleryStore = create<DesignGalleryState>()((set, get) => {
  const applyFilters = () => {
    const { designs, searchQuery, filters } = get();
    
    let filtered = [...designs];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(design => 
        design.title.toLowerCase().includes(query) ||
        design.description.toLowerCase().includes(query) ||
        design.culturalInfluences.some(culture => culture.toLowerCase().includes(query))
      );
    }
    
    // Apply culture filters
    if (filters.cultures.length > 0) {
      filtered = filtered.filter(design => 
        design.culturalInfluences.some(culture => filters.cultures.includes(culture))
      );
    }
    
    // Apply budget filters
    if (filters.budgetTiers.length > 0) {
      filtered = filtered.filter(design => {
        const budgetRange = design.estimatedBudget.max - design.estimatedBudget.min;
        if (filters.budgetTiers.includes('modest')) {
          return design.estimatedBudget.max <= 5000;
        }
        if (filters.budgetTiers.includes('comfortable')) {
          return design.estimatedBudget.max <= 15000;
        }
        if (filters.budgetTiers.includes('luxurious')) {
          return design.estimatedBudget.max <= 50000;
        }
        return true;
      });
    }
    
    // Apply sorting
    switch (filters.sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'popular':
        filtered.sort((a, b) => (b.likes + b.shares) - (a.likes + a.shares));
        break;
      case 'budget':
        filtered.sort((a, b) => a.estimatedBudget.min - b.estimatedBudget.min);
        break;
    }
    
    set({ filteredDesigns: filtered });
  };

  return {
    designs: [],
    filteredDesigns: [],
    searchQuery: '',
    filters: {
      cultures: [],
      budgetTiers: [],
      eventTypes: [],
      sortBy: 'newest'
    },
    viewMode: 'grid',
    currentPage: 1,
    itemsPerPage: 12,
    isLoading: false,
    
    setDesigns: (designs: Design[]) => {
      set({ designs });
      applyFilters();
    },
    
    addDesign: (design: Design) => {
      const { designs } = get();
      set({ designs: [design, ...designs] });
      applyFilters();
    },
    
    updateDesign: (id: string, updates: Partial<Design>) => {
      const { designs } = get();
      const updatedDesigns = designs.map(design => 
        design.id === id ? { ...design, ...updates } : design
      );
      set({ designs: updatedDesigns });
      applyFilters();
    },
    
    removeDesign: (id: string) => {
      const { designs } = get();
      set({ designs: designs.filter(design => design.id !== id) });
      applyFilters();
    },
    
    setSearchQuery: (query: string) => {
      set({ searchQuery: query, currentPage: 1 });
      applyFilters();
    },
    
    setFilters: (newFilters) => {
      const { filters } = get();
      set({ filters: { ...filters, ...newFilters }, currentPage: 1 });
      applyFilters();
    },
    
    setViewMode: (mode: 'grid' | 'list') => {
      set({ viewMode: mode });
    },
    
    setCurrentPage: (page: number) => {
      set({ currentPage: page });
    },
    
    resetFilters: () => {
      set({ 
        filters: {
          cultures: [],
          budgetTiers: [],
          eventTypes: [],
          sortBy: 'newest'
        },
        searchQuery: '',
        currentPage: 1
      });
      applyFilters();
    },
    
    likeDesign: (id: string) => {
      const { designs } = get();
      const updatedDesigns = designs.map(design => 
        design.id === id ? { ...design, likes: design.likes + 1 } : design
      );
      set({ designs: updatedDesigns });
      applyFilters();
    },
    
    shareDesign: (id: string) => {
      const { designs } = get();
      const updatedDesigns = designs.map(design => 
        design.id === id ? { ...design, shares: design.shares + 1 } : design
      );
      set({ designs: updatedDesigns });
      applyFilters();
    }
  };
});

// Upload State Store
interface UploadState {
  uploads: UploadedImage[];
  isUploading: boolean;
  uploadProgress: number;
  dragActive: boolean;
  
  addUpload: (upload: UploadedImage) => void;
  removeUpload: (id: string) => void;
  updateUpload: (id: string, updates: Partial<UploadedImage>) => void;
  setUploading: (isUploading: boolean) => void;
  setUploadProgress: (progress: number) => void;
  setDragActive: (active: boolean) => void;
  clearUploads: () => void;
}

export const useUploadStore = create<UploadState>()((set, get) => ({
  uploads: [],
  isUploading: false,
  uploadProgress: 0,
  dragActive: false,
  
  addUpload: (upload: UploadedImage) => {
    const { uploads } = get();
    set({ uploads: [...uploads, upload] });
  },
  
  removeUpload: (id: string) => {
    const { uploads } = get();
    set({ uploads: uploads.filter(upload => upload.id !== id) });
  },
  
  updateUpload: (id: string, updates: Partial<UploadedImage>) => {
    const { uploads } = get();
    const updatedUploads = uploads.map(upload => 
      upload.id === id ? { ...upload, ...updates } : upload
    );
    set({ uploads: updatedUploads });
  },
  
  setUploading: (isUploading: boolean) => {
    set({ isUploading });
    if (!isUploading) {
      set({ uploadProgress: 0 });
    }
  },
  
  setUploadProgress: (progress: number) => {
    set({ uploadProgress: progress });
  },
  
  setDragActive: (active: boolean) => {
    set({ dragActive: active });
  },
  
  clearUploads: () => {
    set({ uploads: [] });
  }
}));

// Auth Store (temporary mock for collaboration)
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  
  login: (user: User, token: string) => {
    set({ user, token, isAuthenticated: true });
  },
  
  logout: () => {
    set({ user: null, token: null, isAuthenticated: false });
  }
}));

// Combined App State (for complex operations)
interface AppState {
  isInitialized: boolean;
  globalLoading: boolean;
  globalError: string | null;
  
  initialize: () => Promise<void>;
  setGlobalLoading: (loading: boolean) => void;
  setGlobalError: (error: string | null) => void;
  clearGlobalError: () => void;
}

export const useAppStore = create<AppState>()((set, get) => ({
  isInitialized: false,
  globalLoading: false,
  globalError: null,
  
  initialize: async () => {
    set({ globalLoading: true });
    try {
      // Initialize app state, load user data, etc.
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate initialization
      set({ isInitialized: true, globalLoading: false });
    } catch (error) {
      set({ 
        globalError: 'Failed to initialize application',
        globalLoading: false
      });
    }
  },
  
  setGlobalLoading: (loading: boolean) => {
    set({ globalLoading: loading });
  },
  
  setGlobalError: (error: string | null) => {
    set({ globalError: error });
  },
  
  clearGlobalError: () => {
    set({ globalError: null });
  }
}));