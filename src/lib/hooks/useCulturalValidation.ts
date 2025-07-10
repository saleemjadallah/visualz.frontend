'use client';

import { useCallback, useMemo } from 'react';
import { useUserPreferencesStore } from '../store';
import { CultureType } from '../types';

interface CulturalValidationRule {
  id: string;
  name: string;
  description: string;
  severity: 'error' | 'warning' | 'info';
  validator: (context: CulturalValidationContext) => boolean;
  message: string;
}

interface CulturalValidationContext {
  primaryCulture: CultureType;
  secondaryCultures: CultureType[];
  eventType: string;
  elements: any[];
  userPreferences: any;
}

interface ValidationResult {
  isValid: boolean;
  errors: CulturalValidationRule[];
  warnings: CulturalValidationRule[];
  infos: CulturalValidationRule[];
  score: number;
}

export const useCulturalValidation = () => {
  const { preferences } = useUserPreferencesStore();

  // Cultural validation rules
  const validationRules: CulturalValidationRule[] = useMemo(() => [
    {
      id: 'cultural-fusion-limit',
      name: 'Cultural Fusion Limit',
      description: 'Avoid mixing too many cultural elements',
      severity: 'warning',
      validator: (context) => context.secondaryCultures.length <= 2,
      message: 'Consider limiting cultural fusion to 2-3 cultures for authentic representation'
    },
    {
      id: 'japanese-minimalism',
      name: 'Japanese Minimalism',
      description: 'Japanese themes should emphasize simplicity',
      severity: 'warning',
      validator: (context) => {
        if (context.primaryCulture === 'japanese') {
          return context.elements.length <= 8;
        }
        return true;
      },
      message: 'Japanese design principles favor minimalism - consider reducing elements'
    },
    {
      id: 'scandinavian-functionality',
      name: 'Scandinavian Functionality',
      description: 'Scandinavian designs should prioritize function',
      severity: 'info',
      validator: (context) => {
        if (context.primaryCulture === 'scandinavian') {
          // Check if functional elements are present
          const functionalElements = context.elements.filter(el => 
            el.type === 'furniture' || el.type === 'lighting'
          );
          return functionalElements.length >= context.elements.length * 0.6;
        }
        return true;
      },
      message: 'Scandinavian design emphasizes functional beauty - ensure 60% of elements serve a purpose'
    },
    {
      id: 'italian-warmth',
      name: 'Italian Warmth',
      description: 'Italian designs should feel warm and inviting',
      severity: 'info',
      validator: (context) => {
        if (context.primaryCulture === 'italian') {
          // Check for warm colors and materials
          const warmElements = context.elements.filter(el => 
            el.color?.includes('warm') || el.material?.includes('wood') || el.material?.includes('terracotta')
          );
          return warmElements.length >= context.elements.length * 0.4;
        }
        return true;
      },
      message: 'Italian design celebrates warmth - consider adding warm colors and natural materials'
    },
    {
      id: 'french-elegance',
      name: 'French Elegance',
      description: 'French designs should maintain sophistication',
      severity: 'info',
      validator: (context) => {
        if (context.primaryCulture === 'french') {
          // Check for refined elements
          const refinedElements = context.elements.filter(el => 
            el.type === 'decor' || el.material?.includes('silk') || el.material?.includes('brass')
          );
          return refinedElements.length >= context.elements.length * 0.3;
        }
        return true;
      },
      message: 'French design values elegance - consider adding refined decorative elements'
    },
    {
      id: 'cultural-appropriateness',
      name: 'Cultural Appropriateness',
      description: 'Ensure respectful cultural representation',
      severity: 'error',
      validator: (context) => {
        // Check for culturally inappropriate combinations
        const inappropriateCombinations = [
          ['japanese', 'scandinavian'], // Traditional vs modern minimalism conflict
        ];
        
        return !inappropriateCombinations.some(combo => 
          combo.includes(context.primaryCulture) && 
          context.secondaryCultures.some(culture => combo.includes(culture))
        );
      },
      message: 'Some cultural combinations may not be appropriate - consider cultural sensitivity'
    },
    {
      id: 'budget-cultural-alignment',
      name: 'Budget Cultural Alignment',
      description: 'Budget should align with cultural expectations',
      severity: 'warning',
      validator: (context) => {
        // Different cultures have different cost expectations
        const culturalBudgetExpectations = {
          japanese: 'comfortable', // Quality materials, craftsmanship
          scandinavian: 'comfortable', // Functional, well-made pieces
          italian: 'luxurious', // Rich materials, artistic elements
          french: 'luxurious' // Refined, elegant pieces
        };
        
        return true; // Implement budget checking logic
      },
      message: 'Consider if budget aligns with cultural design expectations'
    }
  ], []);

  const validateCulturalDesign = useCallback((context: CulturalValidationContext): ValidationResult => {
    const results = validationRules.map(rule => ({
      rule,
      passed: rule.validator(context)
    }));

    const errors = results.filter(r => !r.passed && r.rule.severity === 'error').map(r => r.rule);
    const warnings = results.filter(r => !r.passed && r.rule.severity === 'warning').map(r => r.rule);
    const infos = results.filter(r => !r.passed && r.rule.severity === 'info').map(r => r.rule);

    const totalRules = validationRules.length;
    const passedRules = results.filter(r => r.passed).length;
    const score = Math.round((passedRules / totalRules) * 100);

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      infos,
      score
    };
  }, [validationRules]);

  const validateCulturalCombination = useCallback((
    primary: CultureType, 
    secondary: CultureType[]
  ): ValidationResult => {
    const context: CulturalValidationContext = {
      primaryCulture: primary,
      secondaryCultures: secondary,
      eventType: 'general',
      elements: [],
      userPreferences: preferences
    };

    return validateCulturalDesign(context);
  }, [preferences, validateCulturalDesign]);

  const getSuggestedCultures = useCallback((primary: CultureType): CultureType[] => {
    const culturalCompatibility: Record<CultureType, CultureType[]> = {
      japanese: ['scandinavian'], // Both value minimalism
      scandinavian: ['japanese'], // Both value functionality
      italian: ['french'], // Both European, warm traditions
      french: ['italian'], // Both appreciate refinement
      modern: ['scandinavian'] // Both value functionality
    };

    return culturalCompatibility[primary] || [];
  }, []);

  const getCulturalGuidelines = useCallback((culture: CultureType): string[] => {
    const guidelines: Record<CultureType, string[]> = {
      japanese: [
        'Embrace wabi-sabi - find beauty in imperfection',
        'Use natural materials like wood, bamboo, stone',
        'Maintain low furniture and eye levels',
        'Incorporate water elements for tranquility',
        'Emphasize negative space (Ma)',
        'Choose muted, earth-tone colors'
      ],
      scandinavian: [
        'Prioritize functionality in all design choices',
        'Use light, natural colors - whites, beiges, soft blues',
        'Incorporate cozy textiles (hygge)',
        'Emphasize natural light and openness',
        'Choose sustainable, well-crafted materials',
        'Add warm wood tones and textures'
      ],
      italian: [
        'Use rich, warm colors - terracotta, gold, deep reds',
        'Incorporate natural stone and aged materials',
        'Add artistic and decorative elements',
        'Create inviting, family-focused spaces',
        'Use traditional patterns and textures',
        'Emphasize craftsmanship and quality'
      ],
      french: [
        'Focus on elegance and refinement',
        'Use sophisticated color palettes',
        'Incorporate antique and vintage elements',
        'Add luxurious fabrics and textures',
        'Create balanced, symmetrical compositions',
        'Emphasize quality over quantity'
      ],
      modern: [
        'Embrace bold, contemporary design',
        'Use modern materials and technology',
        'Create open, flexible spaces',
        'Incorporate industrial elements',
        'Focus on convenience and efficiency',
        'Mix styles for eclectic appeal'
      ]
    };

    return guidelines[culture] || [];
  }, []);

  const checkCulturalSensitivity = useCallback((elements: any[]): boolean => {
    // Check for culturally sensitive elements
    const sensitiveElements = [
      'religious symbols',
      'traditional ceremonies',
      'sacred patterns',
      'ceremonial objects'
    ];

    return !elements.some(element => 
      sensitiveElements.some(sensitive => 
        element.name?.toLowerCase().includes(sensitive.toLowerCase())
      )
    );
  }, []);

  return {
    validateCulturalDesign,
    validateCulturalCombination,
    getSuggestedCultures,
    getCulturalGuidelines,
    checkCulturalSensitivity,
    validationRules,
    
    // Utility functions
    isCulturalSensitivityEnabled: preferences.culturalSensitivity,
    
    // Cultural insights
    getCulturalInsight: useCallback((culture: CultureType) => {
      const insights: Record<CultureType, string> = {
        japanese: 'Japanese design values harmony with nature, simplicity, and finding beauty in imperfection',
        scandinavian: 'Scandinavian design emphasizes functionality, natural materials, and creating cozy, livable spaces',
        italian: 'Italian design celebrates warmth, family gathering, and the beauty of aged, crafted materials',
        french: 'French design focuses on elegance, sophistication, and timeless beauty with attention to detail',
        modern: 'Modern design embraces bold innovation, mixing styles, and creating flexible, efficient spaces'
      };
      return insights[culture] || '';
    }, [])
  };
};

export default useCulturalValidation;