// Parameter Mapping Utilities - Convert EventVisionSteps form data to AI Parametric System parameters

import { 
  UserFurnitureRequest, 
  LightingParameters, 
  FloralParameters, 
  StageParameters,
  CultureType,
  FormalityLevel 
} from '../types';

// EventVisionSteps form data interface
export interface VisionFormData {
  eventType: string;
  guestCount: string;
  culturalStyle: string;
  venueType: string;
  spaceSize: string;
  budgetRange: string;
  photos: File[];
  colorPreferences: string[];
  specialElements: string[];
  accessibility: string[];
  seasonalElements: string;
}

// Convert cultural style IDs to our system's culture types
export const mapCulturalStyleToCulture = (culturalStyle: string): CultureType => {
  const mapping: Record<string, CultureType> = {
    'wabi-sabi': 'japanese',
    'hygge': 'scandinavian', 
    'bella-figura': 'italian',
    'savoir-vivre': 'french',
    'modern': 'modern',
    'fusion': 'modern' // Default fusion to modern for now
  };
  
  return mapping[culturalStyle] || 'modern';
};

// Convert event types to formality levels
export const mapEventTypeToFormality = (eventType: string, budgetRange: string): FormalityLevel => {
  const eventFormalityMap: Record<string, FormalityLevel> = {
    'wedding': 'ceremonial',
    'anniversary': 'formal',
    'corporate': 'formal',
    'graduation': 'semi-formal',
    'holiday': 'semi-formal',
    'baby-shower': 'semi-formal',
    'reunion': 'casual',
    'birthday': 'casual',
    'other': 'semi-formal'
  };
  
  // Adjust based on budget
  let formality = eventFormalityMap[eventType] || 'semi-formal';
  
  if (budgetRange === 'premium' || budgetRange === 'luxury') {
    if (formality === 'casual') formality = 'semi-formal';
    if (formality === 'semi-formal') formality = 'formal';
  } else if (budgetRange === 'essential') {
    if (formality === 'formal') formality = 'semi-formal';
    if (formality === 'ceremonial') formality = 'formal';
  }
  
  return formality;
};

// Convert guest count to numeric values
export const mapGuestCountToNumber = (guestCount: string): number => {
  const mapping: Record<string, number> = {
    'intimate': 6,    // 1-10 guests, use 6 as optimal for furniture generation
    'small': 20,      // 11-30 guests
    'medium': 50,     // 31-75 guests
    'large': 100,     // 76-150 guests
    'grand': 200,     // 151-300 guests
    'massive': 400    // 300+ guests
  };
  
  return mapping[guestCount] || 50;
};

// Convert space size to dimensions
export const mapSpaceSizeToDimensions = (spaceSize: string, venueType: string) => {
  const baseDimensions: Record<string, { width: number; height: number; depth: number }> = {
    'small': { width: 6, height: 3, depth: 6 },     // Up to 500 sq ft
    'medium': { width: 10, height: 3.5, depth: 10 }, // 500-1500 sq ft
    'large': { width: 15, height: 4, depth: 15 },    // 1500-5000 sq ft
    'grand': { width: 25, height: 5, depth: 25 }     // 5000+ sq ft
  };
  
  const base = baseDimensions[spaceSize] || baseDimensions['medium'];
  
  // Adjust for venue type
  if (venueType === 'outdoor' || venueType === 'both') {
    return {
      ...base,
      height: Math.max(base.height, 4), // Outdoor events often have higher ceilings/open air
      width: base.width * 1.2, // Outdoor spaces tend to be larger
      depth: base.depth * 1.2
    };
  }
  
  return base;
};

// Convert budget range to actual budget numbers
export const mapBudgetRangeToNumber = (budgetRange: string): number => {
  const mapping: Record<string, number> = {
    'essential': 800,   // Under $1K
    'elevated': 3000,   // $1K - $5K
    'luxury': 10000,    // $5K - $15K
    'premium': 25000    // $15K+
  };
  
  return mapping[budgetRange] || 3000;
};

// Convert form data to furniture parameters
export const convertFormToFurnitureParams = (formData: VisionFormData): UserFurnitureRequest => {
  const culture = mapCulturalStyleToCulture(formData.culturalStyle);
  const guestCount = mapGuestCountToNumber(formData.guestCount);
  const spaceDimensions = mapSpaceSizeToDimensions(formData.spaceSize, formData.venueType);
  const formality = mapEventTypeToFormality(formData.eventType, formData.budgetRange);
  
  return {
    eventType: formData.eventType,
    culture,
    guestCount,
    spaceDimensions,
    budgetRange: formData.budgetRange as 'low' | 'medium' | 'high' | 'luxury',
    formalityLevel: formality,
    specialRequirements: [
      ...formData.specialElements,
      ...formData.accessibility,
      ...(formData.colorPreferences.length > 0 ? [`Color preferences: ${formData.colorPreferences.join(', ')}`] : []),
      ...(formData.seasonalElements ? [`Seasonal: ${formData.seasonalElements}`] : [])
    ].join('; ')
  };
};

// Convert form data to lighting parameters
export const convertFormToLightingParams = (formData: VisionFormData): LightingParameters => {
  const culture = mapCulturalStyleToCulture(formData.culturalStyle);
  const spaceDimensions = mapSpaceSizeToDimensions(formData.spaceSize, formData.venueType);
  
  // Map event types to lighting event types
  const eventTypeMapping: Record<string, LightingParameters['eventType']> = {
    'wedding': 'ceremony',
    'anniversary': 'intimate-dinner',
    'corporate': 'corporate',
    'birthday': 'celebration',
    'graduation': 'celebration',
    'holiday': 'celebration',
    'baby-shower': 'reception',
    'reunion': 'reception',
    'other': 'ceremony'
  };
  
  // Determine ambiance based on event type and formality
  const ambianceMapping: Record<string, LightingParameters['ambiance']> = {
    'wedding': 'romantic',
    'anniversary': 'romantic',
    'corporate': 'professional',
    'birthday': 'energetic',
    'reunion': 'serene',
    'graduation': 'dramatic',
    'holiday': 'energetic',
    'baby-shower': 'serene',
    'other': 'serene'
  };
  
  // Get traditional elements based on culture
  const culturalLightingElements: Record<CultureType, string[]> = {
    'japanese': ['andon-lanterns'],
    'french': ['crystal-chandeliers', 'candelabras'],
    'italian': ['chandeliers', 'wall-sconces'],
    'scandinavian': ['candles', 'string-lights'],
    'modern': ['track-lighting', 'led-strips']
  };
  
  return {
    culture,
    eventType: eventTypeMapping[formData.eventType] || 'ceremony',
    timeOfDay: 'evening', // Most events are evening
    season: (formData.seasonalElements as 'spring' | 'summer' | 'autumn' | 'winter') || 'spring',
    spaceType: formData.venueType === 'outdoor' ? 'outdoor' : 
               formData.venueType === 'both' ? 'mixed' : 'indoor',
    spaceDimensions,
    ambiance: ambianceMapping[formData.eventType] || 'serene',
    functionality: 'balanced',
    powerBudget: Math.round(mapBudgetRangeToNumber(formData.budgetRange) * 0.15), // 15% of total budget for lighting
    installationComplexity: formData.budgetRange === 'premium' ? 'professional' : 
                           formData.budgetRange === 'luxury' ? 'complex' : 'moderate',
    weatherResistance: formData.venueType === 'outdoor' || formData.venueType === 'both',
    traditionalElements: culturalLightingElements[culture] || [],
    colorTemperature: 'warm',
    brightness: formData.eventType === 'corporate' ? 'bright' : 'moderate'
  };
};

// Convert form data to floral parameters
export const convertFormToFloralParams = (formData: VisionFormData): FloralParameters => {
  const culture = mapCulturalStyleToCulture(formData.culturalStyle);
  const formality = mapEventTypeToFormality(formData.eventType, formData.budgetRange);
  
  // Map event types to floral event types
  const eventTypeMapping: Record<string, FloralParameters['eventType']> = {
    'wedding': 'wedding',
    'anniversary': 'celebration',
    'corporate': 'corporate',
    'birthday': 'birthday',
    'graduation': 'celebration',
    'holiday': 'celebration',
    'baby-shower': 'celebration',
    'reunion': 'celebration',
    'other': 'celebration'
  };
  
  // Map guest count to arrangement scale
  const scaleMapping: Record<string, FloralParameters['scale']> = {
    'intimate': 'intimate',
    'small': 'medium',
    'medium': 'medium',
    'large': 'grand',
    'grand': 'grand',
    'massive': 'monumental'
  };
  
  // Cultural traditional flowers
  const culturalFlowers: Record<CultureType, string[]> = {
    'japanese': ['cherry-blossom', 'chrysanthemum', 'iris'],
    'french': ['garden-rose', 'peony', 'hydrangea'],
    'italian': ['rose', 'lily', 'olive-branches'],
    'scandinavian': ['tulip', 'daffodil', 'wildflowers'],
    'modern': ['orchid', 'calla-lily', 'modern-roses']
  };
  
  return {
    culture,
    eventType: eventTypeMapping[formData.eventType] || 'celebration',
    formality,
    season: (formData.seasonalElements as 'spring' | 'summer' | 'autumn' | 'winter') || 'spring',
    arrangementStyle: 'centerpiece', // Default to centerpiece, could be enhanced based on special elements
    scale: scaleMapping[formData.guestCount] || 'medium',
    colorScheme: 'natural', // Could be enhanced based on color preferences
    budget: Math.round(mapBudgetRangeToNumber(formData.budgetRange) * 0.2), // 20% of total budget for florals
    venue: formData.venueType === 'outdoor' ? 'outdoor' : 
           formData.venueType === 'both' ? 'mixed' : 'indoor',
    duration: 6, // Assume 6-hour events on average
    maintenance: formData.budgetRange === 'essential' ? 'low' : 
                formData.budgetRange === 'premium' ? 'high' : 'medium',
    symbolism: [], // Could be enhanced based on special elements
    traditionalFlowers: culturalFlowers[culture] || [],
    avoidFlowers: [],
    localSourcing: true, // Default to sustainable practices
    sustainablePractices: true,
    reusability: formData.accessibility.includes('Child-Safe Setup') // If child-safe, prefer reusable elements
  };
};

// Convert form data to stage parameters
export const convertFormToStageParams = (formData: VisionFormData): StageParameters | null => {
  // Only create stage if certain special elements are requested
  const stageElements = ['Live Music Space', 'Dancing Area', 'Traditional Ceremonies'];
  const needsStage = formData.specialElements.some(element => stageElements.includes(element));
  
  if (!needsStage && !['wedding', 'corporate', 'graduation'].includes(formData.eventType)) {
    return null; // No stage needed for intimate events without performance elements
  }
  
  const culture = mapCulturalStyleToCulture(formData.culturalStyle);
  const guestCount = mapGuestCountToNumber(formData.guestCount);
  const spaceDimensions = mapSpaceSizeToDimensions(formData.spaceSize, formData.venueType);
  
  // Map event types to performance types
  const performanceTypeMapping: Record<string, StageParameters['performanceType']> = {
    'wedding': 'ceremony',
    'corporate': 'presentation',
    'graduation': 'ceremony',
    'birthday': 'dj-set',
    'anniversary': 'live-music',
    'holiday': 'live-music',
    'reunion': 'speaker',
    'other': 'ceremony'
  };
  
  // Determine audio requirements based on budget and event
  const audioRequirements: StageParameters['audioRequirements'] = 
    formData.budgetRange === 'premium' ? 'audiophile' :
    formData.budgetRange === 'luxury' ? 'professional' :
    formData.eventType === 'corporate' ? 'professional' : 'basic';
  
  // Cultural traditional elements
  const culturalStageElements: Record<CultureType, string[]> = {
    'japanese': ['elevated-platform', 'tatami-edging'],
    'french': ['salon-furniture', 'elegant-drapery'],
    'italian': ['classical-columns', 'ornate-details'],
    'scandinavian': ['natural-materials', 'clean-lines'],
    'modern': ['tech-features', 'minimalist-design']
  };
  
  return {
    performanceType: performanceTypeMapping[formData.eventType] || 'ceremony',
    audienceSize: guestCount,
    interactionLevel: formData.specialElements.includes('Quiet Conversation Zones') ? 'some-interaction' : 'performance-only',
    audioRequirements,
    visualRequirements: formData.budgetRange === 'premium' ? 'spectacular' : 'standard',
    lightingIntegration: true,
    culture,
    ceremony: ['wedding', 'graduation'].includes(formData.eventType),
    traditionalElements: culturalStageElements[culture] || [],
    spaceDimensions: {
      width: spaceDimensions.width,
      depth: spaceDimensions.depth,
      maxHeight: spaceDimensions.height
    },
    budget: Math.round(mapBudgetRangeToNumber(formData.budgetRange) * 0.25), // 25% of total budget for stage
    setupTime: 4, // Assume 4 hours setup time
    weatherProtection: formData.venueType === 'outdoor',
    accessibilityRequired: formData.accessibility.length > 0,
    multilingual: formData.eventType === 'corporate',
    hearingAssistance: formData.accessibility.includes('Hearing Assistance'),
    visualAssistance: formData.accessibility.includes('Visual Impairment Support')
  };
};

// Main conversion function for complete event setup
export const convertFormToCompleteEventParams = (formData: VisionFormData) => {
  const furniture = convertFormToFurnitureParams(formData);
  const lighting = convertFormToLightingParams(formData);
  const floral = convertFormToFloralParams(formData);
  const stage = convertFormToStageParams(formData);
  
  return {
    furniture,
    lighting,
    floral,
    ...(stage && { stage })
  };
};

// Validation function to ensure all required parameters are present
export const validateFormData = (formData: VisionFormData): { isValid: boolean; missingFields: string[] } => {
  const requiredFields = ['eventType', 'guestCount', 'culturalStyle', 'venueType', 'spaceSize', 'budgetRange'];
  const missingFields = requiredFields.filter(field => !formData[field as keyof VisionFormData]);
  
  return {
    isValid: missingFields.length === 0,
    missingFields
  };
};

// Get estimated costs breakdown
export const getEstimatedCosts = (formData: VisionFormData) => {
  const totalBudget = mapBudgetRangeToNumber(formData.budgetRange);
  
  return {
    furniture: Math.round(totalBudget * 0.4), // 40% for furniture
    lighting: Math.round(totalBudget * 0.15), // 15% for lighting
    floral: Math.round(totalBudget * 0.2),    // 20% for floral
    stage: Math.round(totalBudget * 0.25),    // 25% for stage (if needed)
    total: totalBudget
  };
};