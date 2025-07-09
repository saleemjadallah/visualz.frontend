// Core Application Types for DesignVisualz

export type CultureType = 'japanese' | 'scandinavian' | 'italian' | 'french' | 'american';

export type EventType = 'birthday' | 'wedding' | 'corporate' | 'cultural' | 'holiday';

export type BudgetTier = 'modest' | 'comfortable' | 'luxurious' | 'unlimited';

export type ComponentSize = 'sm' | 'md' | 'lg' | 'xl';

export type ComponentVariant = 'primary' | 'secondary' | 'cultural' | 'ghost';

// Cultural Intelligence Types
export interface CulturalPrinciple {
  name: string;
  description: string;
  application: string;
  colors: string[];
  materials: string[];
  patterns: string[];
}

export interface CulturalTheme {
  culture: CultureType;
  name: string;
  principles: CulturalPrinciple[];
  colorPalette: {
    primary: string;
    secondary: string;
    accent: string;
    neutral: string[];
  };
  guidelines: string[];
  materials: string[];
  patterns: string[];
}

// User and Project Types
export interface User {
  id: string;
  email: string;
  name: string;
  preferences: {
    favoriteStyles: CultureType[];
    defaultBudget: BudgetTier;
    culturalSensitivity: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  userId: string;
  title: string;
  description?: string;
  eventType: EventType;
  culturalThemes: CultureType[];
  budgetTier: BudgetTier;
  guestCount: number;
  ageRange?: string;
  specialRequirements?: string[];
  spaceImages: string[];
  spaceDimensions?: {
    length: number;
    width: number;
    height: number;
  };
  designPreferences: {
    colors: string[];
    materials: string[];
    styles: string[];
    mustHave: string[];
    mustAvoid: string[];
  };
  aiGeneratedDesigns: Design[];
  status: 'draft' | 'generating' | 'completed' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

// Design and AI Generation Types
export interface Design {
  id: string;
  projectId: string;
  title: string;
  description: string;
  culturalInfluences: CultureType[];
  designElements: DesignElement[];
  colorPalette: string[];
  materials: string[];
  estimatedBudget: {
    min: number;
    max: number;
    breakdown: BudgetBreakdown[];
  };
  images: string[];
  threeDModel?: string;
  aiPrompt: string;
  culturalSensitivityScore: number;
  likes: number;
  shares: number;
  createdAt: Date;
}

export interface DesignElement {
  id: string;
  type: 'furniture' | 'decor' | 'lighting' | 'floral' | 'fabric' | 'structure';
  name: string;
  description: string;
  culturalSignificance?: string;
  position: {
    x: number;
    y: number;
    z?: number;
  };
  dimensions: {
    width: number;
    height: number;
    depth?: number;
  };
  color: string;
  material: string;
  price?: number;
  vendor?: Vendor;
}

export interface BudgetBreakdown {
  category: string;
  amount: number;
  percentage: number;
  items: {
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
}

// Vendor and Marketplace Types
export interface Vendor {
  id: string;
  name: string;
  type: 'rental' | 'purchase' | 'service';
  location: {
    city: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  rating: number;
  reviewCount: number;
  culturalSpecialties: CultureType[];
  priceRange: BudgetTier[];
  contact: {
    email: string;
    phone: string;
    website?: string;
  };
}

// Form and UI Types
export interface EventRequirementsForm {
  step: number;
  eventType: EventType;
  culturalPreferences: CultureType[];
  budgetTier: BudgetTier;
  guestCount: number;
  ageRange: string;
  specialNeeds: string[];
  stylePreferences: {
    colors: string[];
    materials: string[];
    styles: string[];
    mustHave: string[];
    mustAvoid: string[];
  };
  timeline: {
    eventDate: Date;
    planningStartDate: Date;
  };
}

export interface UploadedImage {
  id: string;
  url: string;
  name: string;
  size: number;
  type: string;
  analysis?: {
    dimensions: {
      estimatedLength: number;
      estimatedWidth: number;
      estimatedHeight: number;
    };
    lighting: {
      type: 'natural' | 'artificial' | 'mixed';
      quality: 'excellent' | 'good' | 'fair' | 'poor';
      direction: string[];
    };
    objects: {
      name: string;
      confidence: number;
      position: { x: number; y: number; width: number; height: number };
    }[];
    style: {
      current: string[];
      recommendations: string[];
    };
  };
  uploadedAt: Date;
}

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: ComponentVariant;
  size?: ComponentSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface CardProps extends BaseComponentProps {
  hover?: boolean;
  cultural?: boolean;
  padding?: ComponentSize;
}

export interface CulturalBadgeProps extends BaseComponentProps {
  culture: CultureType;
  showTooltip?: boolean;
  size?: ComponentSize;
}

// Animation and Theme Types
export interface ThemeConfig {
  culture: CultureType;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
  };
  fonts: {
    display: string;
    body: string;
  };
  spacing: Record<string, string>;
  borderRadius: Record<string, string>;
}

// State Management Types
export interface AppState {
  user: User | null;
  currentProject: Project | null;
  culturalTheme: CultureType;
  formData: Partial<EventRequirementsForm>;
  uploads: UploadedImage[];
  designs: Design[];
  loading: boolean;
  error: string | null;
}

// API Types
export interface UserLogin {
  email: string;
  password: string;
}

export interface UserRegister {
  email: string;
  password: string;
  name: string;
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
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

// Enhanced API Types for Phase 15
export interface APIError {
  message: string;
  code?: string;
  status?: number;
  errors?: string[];
  culturalContext?: CultureType;
}

export interface CulturalValidationResult {
  valid: boolean;
  warnings: string[];
  suggestions: string[];
  culturalScore: number;
  respectfulUsage: boolean;
}

export interface CulturalElement {
  id: string;
  name: string;
  description: string;
  culture: CultureType;
  type: 'symbol' | 'color' | 'pattern' | 'material' | 'practice';
  significance: string;
  usage: string;
  restrictions: string[];
  respectfulGuidelines: string[];
  appropriateContexts: EventType[];
  inappropriateContexts: EventType[];
}

export interface CulturalThemeData {
  culture: CultureType;
  name: string;
  displayName: string;
  description: string;
  principles: CulturalPrinciple[];
  colorPalette: {
    primary: string[];
    secondary: string[];
    accent: string[];
    neutral: string[];
  };
  patterns: CulturalPattern[];
  symbols: CulturalSymbol[];
  materials: CulturalMaterial[];
  guidelines: string[];
  respectfulUsage: string[];
  avoidances: string[];
}

export interface CulturalPattern {
  id: string;
  name: string;
  description: string;
  culture: CultureType;
  significance: string;
  usage: string;
  restrictions: string[];
  imageUrl?: string;
}

export interface CulturalSymbol {
  id: string;
  name: string;
  description: string;
  culture: CultureType;
  significance: string;
  usage: string;
  restrictions: string[];
  respectfulGuidelines: string[];
  imageUrl?: string;
}

export interface CulturalMaterial {
  id: string;
  name: string;
  description: string;
  culture: CultureType;
  significance: string;
  usage: string;
  restrictions: string[];
  alternatives: string[];
}

// Loading States and UI Enhancement Types for Phase 16
export interface LoadingState {
  isLoading: boolean;
  message?: string;
  progress?: number;
  stage?: string;
  error?: string;
}

export interface EmptyState {
  title: string;
  description: string;
  actionLabel?: string;
  actionCallback?: () => void;
  illustrationUrl?: string;
  type: 'no-data' | 'no-results' | 'error' | 'coming-soon';
}

export interface NotificationState {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  dismissible?: boolean;
  culturalContext?: CultureType;
  timestamp: Date;
}

// Enhanced Form Types
export interface FormFieldState {
  value: any;
  error?: string;
  touched: boolean;
  validated: boolean;
  dirty: boolean;
}

export interface FormState {
  fields: Record<string, FormFieldState>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
  culturalValidation?: CulturalValidationResult;
}

// AI Generation Types
export interface AIGenerationRequest {
  projectId: string;
  prompt: string;
  culturalContext: CultureType;
  eventType: EventType;
  budgetTier: BudgetTier;
  stylePreferences: string[];
  culturalElements: string[];
  restrictions: string[];
  customRequirements?: string;
}

export interface AIGenerationResponse {
  designId: string;
  design: Design;
  culturalValidation: CulturalValidationResult;
  estimatedTime: number;
  progress: number;
  stage: 'analyzing' | 'generating' | 'validating' | 'finalizing' | 'complete';
}

// Analytics and Monitoring Types
export interface AnalyticsEvent {
  event: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  culturalContext?: CultureType;
  userId?: string;
  timestamp: Date;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  culturalContext?: CultureType;
}

// Accessibility Types
export interface AccessibilityFeatures {
  screenReaderSupport: boolean;
  keyboardNavigation: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  fontSize: 'small' | 'medium' | 'large';
  colorBlindnessSupport: boolean;
  culturalAccessibility: boolean;
}

// Cultural Sensitivity Review Types
export interface CulturalSensitivityReview {
  id: string;
  designId: string;
  culture: CultureType;
  reviewer: {
    id: string;
    name: string;
    credentials: string[];
    culturalBackground: CultureType[];
  };
  status: 'pending' | 'approved' | 'rejected' | 'needs-revision';
  score: number;
  feedback: {
    positive: string[];
    concerns: string[];
    suggestions: string[];
    culturalAccuracy: number;
    respectfulness: number;
    authenticity: number;
  };
  reviewDate: Date;
  culturalElements: {
    element: string;
    appropriate: boolean;
    feedback: string;
  }[];
}

// Utility Types
export type WithRequired<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Event Handlers
export type EventHandler<T = any> = (event: T) => void;

export type FormEventHandler = EventHandler<React.FormEvent>;

export type ChangeEventHandler = EventHandler<React.ChangeEvent>;

export type ClickEventHandler = EventHandler<React.MouseEvent>;