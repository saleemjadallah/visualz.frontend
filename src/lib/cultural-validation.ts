import { 
  CultureType, 
  CulturalValidationResult, 
  CulturalElement, 
  CulturalThemeData,
  EventType,
  Design,
  DesignElement
} from './types';

// Cultural validation rules and guidelines
const CULTURAL_GUIDELINES = {
  japanese: {
    respectfulColors: ['#8B0000', '#FFD700', '#FFFFFF', '#000000'],
    avoidColors: ['#FF0000'], // Avoid pure red in certain contexts
    appropriatePatterns: ['sakura', 'waves', 'geometric'],
    restrictedSymbols: ['rising_sun'], // Context-sensitive
    materials: ['wood', 'paper', 'bamboo', 'silk'],
    principles: ['minimalism', 'harmony', 'nature_connection'],
    restrictions: [
      'Avoid mixing sacred and secular elements',
      'Respect seasonal appropriateness',
      'Maintain color harmony principles'
    ]
  },
  scandinavian: {
    respectfulColors: ['#FFFFFF', '#F5F5F5', '#2E5266', '#8B4513'],
    avoidColors: ['#FF69B4'], // Avoid overly bright colors
    appropriatePatterns: ['geometric', 'nature', 'minimalist'],
    restrictedSymbols: ['runes'], // Context-sensitive
    materials: ['wood', 'wool', 'leather', 'stone'],
    principles: ['functionality', 'simplicity', 'natural_light'],
    restrictions: [
      'Avoid cluttered designs',
      'Respect hygge principles',
      'Maintain connection to nature'
    ]
  },
  italian: {
    respectfulColors: ['#008C45', '#F4F5F0', '#CD212A', '#FFD700'],
    avoidColors: ['#000000'], // Avoid pure black in festive contexts
    appropriatePatterns: ['renaissance', 'floral', 'geometric'],
    restrictedSymbols: ['religious_imagery'], // Context-sensitive
    materials: ['marble', 'leather', 'silk', 'gold'],
    principles: ['elegance', 'artistry', 'family_focus'],
    restrictions: [
      'Respect religious sensitivities',
      'Maintain artistic integrity',
      'Honor family traditions'
    ]
  },
  french: {
    respectfulColors: ['#0055A4', '#FFFFFF', '#EF4135', '#FFD700'],
    avoidColors: ['#800080'], // Avoid certain purples in formal contexts
    appropriatePatterns: ['baroque', 'art_nouveau', 'classic'],
    restrictedSymbols: ['fleur_de_lis'], // Context-sensitive
    materials: ['silk', 'crystal', 'gold', 'marble'],
    principles: ['sophistication', 'artistry', 'refinement'],
    restrictions: [
      'Maintain cultural authenticity',
      'Respect artistic traditions',
      'Avoid cultural appropriation'
    ]
  },
  modern: {
    respectfulColors: ['#000000', '#FFFFFF', '#808080', '#0066CC'],
    avoidColors: [] as string[], // Generally flexible
    appropriatePatterns: ['geometric', 'minimal', 'clean-lines'],
    restrictedSymbols: [] as string[], // Less cultural restrictions
    materials: ['steel', 'glass', 'concrete', 'synthetic'],
    principles: ['innovation', 'simplicity', 'functionality'],
    restrictions: [
      'Ensure accessibility',
      'Focus on usability',
      'Avoid overly complex designs'
    ]
  },
  american: {
    respectfulColors: ['#FF0000', '#FFFFFF', '#0000FF', '#FFD700'],
    avoidColors: [] as string[],
    appropriatePatterns: ['patriotic', 'comfortable', 'family-friendly'],
    restrictedSymbols: [] as string[],
    materials: ['leather', 'denim', 'wood', 'metal'],
    principles: ['comfort', 'functionality', 'family-focus'],
    restrictions: [
      'Ensure family-friendly design',
      'Prioritize comfort and accessibility',
      'Respect diverse backgrounds'
    ]
  },
  mexican: {
    respectfulColors: ['#DC143C', '#228B22', '#FFD700', '#FFFFFF'],
    avoidColors: [] as string[],
    appropriatePatterns: ['geometric', 'floral', 'traditional', 'festive'],
    restrictedSymbols: ['aztec_sacred'], // Context-sensitive
    materials: ['ceramic', 'textiles', 'papel picado', 'wood'],
    principles: ['celebration', 'family', 'tradition'],
    restrictions: [
      'Respect sacred symbols and traditions',
      'Honor family customs',
      'Avoid stereotypical representations'
    ]
  },
  korean: {
    respectfulColors: ['#4169E1', '#FFFFFF', '#FFD700', '#DC143C'],
    avoidColors: [] as string[],
    appropriatePatterns: ['balanced', 'harmonious', 'traditional'],
    restrictedSymbols: ['buddhist_sacred'], // Context-sensitive
    materials: ['wood', 'silk', 'ceramic', 'natural fibers'],
    principles: ['harmony', 'balance', 'respect'],
    restrictions: [
      'Maintain balance and harmony',
      'Respect generational traditions',
      'Honor ancestral customs'
    ]
  },
  jewish: {
    respectfulColors: ['#4169E1', '#FFFFFF', '#C0C0C0', '#FFD700'],
    avoidColors: [] as string[],
    appropriatePatterns: ['traditional', 'ceremonial', 'community-focused'],
    restrictedSymbols: ['religious_sacred'], // Context-sensitive
    materials: ['wood', 'fabric', 'metal', 'ceramic'],
    principles: ['tradition', 'community', 'sacred_space'],
    restrictions: [
      'Respect religious traditions and laws',
      'Honor ceremonial requirements',
      'Ensure community accessibility'
    ]
  }
};

export class CulturalValidator {
  private guidelines: typeof CULTURAL_GUIDELINES;

  constructor() {
    this.guidelines = CULTURAL_GUIDELINES;
  }

  // Main validation function
  async validateDesign(design: Design, culturalContext: CultureType): Promise<CulturalValidationResult> {
    const warnings: string[] = [];
    const suggestions: string[] = [];
    let culturalScore = 100;
    let respectfulUsage = true;

    // Validate colors
    const colorValidation = this.validateColors(design.colorPalette, culturalContext);
    warnings.push(...colorValidation.warnings);
    suggestions.push(...colorValidation.suggestions);
    culturalScore -= colorValidation.penalty;

    // Validate materials
    const materialValidation = this.validateMaterials(design.materials, culturalContext);
    warnings.push(...materialValidation.warnings);
    suggestions.push(...materialValidation.suggestions);
    culturalScore -= materialValidation.penalty;

    // Validate design elements
    const elementValidation = this.validateDesignElements(design.designElements, culturalContext);
    warnings.push(...elementValidation.warnings);
    suggestions.push(...elementValidation.suggestions);
    culturalScore -= elementValidation.penalty;

    // Validate cultural influences
    const influenceValidation = this.validateCulturalInfluences(
      design.culturalInfluences,
      culturalContext
    );
    warnings.push(...influenceValidation.warnings);
    suggestions.push(...influenceValidation.suggestions);
    culturalScore -= influenceValidation.penalty;

    // Check for cultural appropriation
    const appropriationCheck = this.checkCulturalAppropriation(design, culturalContext);
    warnings.push(...appropriationCheck.warnings);
    suggestions.push(...appropriationCheck.suggestions);
    culturalScore -= appropriationCheck.penalty;

    // Determine if usage is respectful
    respectfulUsage = culturalScore >= 70 && warnings.length === 0;

    return {
      valid: culturalScore >= 60,
      warnings: warnings.filter(w => w.trim().length > 0),
      suggestions: suggestions.filter(s => s.trim().length > 0),
      culturalScore: Math.max(0, Math.min(100, culturalScore)),
      respectfulUsage
    };
  }

  // Validate color palette
  private validateColors(colors: string[], culturalContext: CultureType): {
    warnings: string[];
    suggestions: string[];
    penalty: number;
  } {
    const warnings: string[] = [];
    const suggestions: string[] = [];
    let penalty = 0;

    const guidelines = this.guidelines[culturalContext];
    
    // Check for avoided colors
    colors.forEach(color => {
      if (guidelines.avoidColors.length > 0 && guidelines.avoidColors.includes(color)) {
        warnings.push(`Color ${color} may be inappropriate in ${culturalContext} cultural context`);
        penalty += 10;
      }
    });

    // Check for respectful colors
    const respectfulColorCount = colors.filter(color => 
      guidelines.respectfulColors.includes(color)
    ).length;

    if (respectfulColorCount === 0) {
      suggestions.push(`Consider incorporating traditional ${culturalContext} colors`);
      penalty += 5;
    }

    // Check color harmony
    if (colors.length > 5) {
      suggestions.push('Consider reducing color palette for better cultural harmony');
      penalty += 3;
    }

    return { warnings, suggestions, penalty };
  }

  // Validate materials
  private validateMaterials(materials: string[], culturalContext: CultureType): {
    warnings: string[];
    suggestions: string[];
    penalty: number;
  } {
    const warnings: string[] = [];
    const suggestions: string[] = [];
    let penalty = 0;

    const guidelines = this.guidelines[culturalContext];
    
    // Check for culturally appropriate materials
    const appropriateMaterials = materials.filter(material => 
      guidelines.materials.includes(material.toLowerCase())
    );

    if (appropriateMaterials.length === 0) {
      suggestions.push(`Consider using traditional ${culturalContext} materials: ${guidelines.materials.join(', ')}`);
      penalty += 8;
    }

    // Material-specific validations
    if (culturalContext === 'japanese' && materials.includes('plastic')) {
      warnings.push('Plastic materials may conflict with Japanese natural harmony principles');
      penalty += 12;
    }

    if (culturalContext === 'scandinavian' && materials.includes('synthetic')) {
      warnings.push('Synthetic materials may not align with Scandinavian sustainability values');
      penalty += 10;
    }

    return { warnings, suggestions, penalty };
  }

  // Validate design elements
  private validateDesignElements(elements: DesignElement[], culturalContext: CultureType): {
    warnings: string[];
    suggestions: string[];
    penalty: number;
  } {
    const warnings: string[] = [];
    const suggestions: string[] = [];
    let penalty = 0;

    const guidelines = this.guidelines[culturalContext];

    // Check for overcrowding (especially important for Japanese and Scandinavian)
    if ((culturalContext === 'japanese' || culturalContext === 'scandinavian') && elements.length > 8) {
      warnings.push(`Too many elements may violate ${culturalContext} minimalism principles`);
      penalty += 15;
    }

    // Check for cultural significance
    elements.forEach(element => {
      if (element.culturalSignificance) {
        // Validate that cultural significance is appropriate
        if (!this.validateCulturalSignificance(element.culturalSignificance, culturalContext)) {
          warnings.push(`Cultural significance of ${element.name} may be inappropriate`);
          penalty += 20;
        }
      }
    });

    // Check for balance and harmony
    if (culturalContext === 'japanese' || culturalContext === 'scandinavian') {
      const symmetryCheck = this.checkSymmetry(elements);
      if (!symmetryCheck.isBalanced) {
        suggestions.push('Consider improving balance and symmetry for cultural harmony');
        penalty += 5;
      }
    }

    return { warnings, suggestions, penalty };
  }

  // Validate cultural influences
  private validateCulturalInfluences(influences: CultureType[], primaryCulture: CultureType): {
    warnings: string[];
    suggestions: string[];
    penalty: number;
  } {
    const warnings: string[] = [];
    const suggestions: string[] = [];
    let penalty = 0;

    // Check for cultural mixing appropriateness
    const otherCultures = influences.filter(culture => culture !== primaryCulture);
    
    if (otherCultures.length > 2) {
      warnings.push('Too many cultural influences may dilute authentic representation');
      penalty += 15;
    }

    // Check for conflicting cultural principles
    otherCultures.forEach(culture => {
      const conflicts = this.checkCulturalConflicts(primaryCulture, culture);
      if (conflicts.length > 0) {
        warnings.push(`Potential cultural conflict between ${primaryCulture} and ${culture}: ${conflicts.join(', ')}`);
        penalty += 10;
      }
    });

    return { warnings, suggestions, penalty };
  }

  // Check for cultural appropriation
  private checkCulturalAppropriation(design: Design, culturalContext: CultureType): {
    warnings: string[];
    suggestions: string[];
    penalty: number;
  } {
    const warnings: string[] = [];
    const suggestions: string[] = [];
    let penalty = 0;

    // Check for sacred symbols or patterns
    const sacredElements = this.identifySacredElements(design, culturalContext);
    if (sacredElements.length > 0) {
      warnings.push(`Sacred elements detected: ${sacredElements.join(', ')}. Ensure appropriate context and respect.`);
      penalty += 25;
    }

    // Check for stereotypical representations
    const stereotypes = this.identifyStereotypes(design, culturalContext);
    if (stereotypes.length > 0) {
      warnings.push(`Potential stereotypical elements: ${stereotypes.join(', ')}`);
      penalty += 20;
    }

    // Check for commercialization of cultural elements
    if (design.estimatedBudget.max > 50000) {
      suggestions.push('Ensure cultural elements are used respectfully in high-budget contexts');
      penalty += 5;
    }

    return { warnings, suggestions, penalty };
  }

  // Helper methods
  private validateCulturalSignificance(significance: string, culture: CultureType): boolean {
    const inappropriate = ['sacred', 'religious', 'ceremonial'];
    return !inappropriate.some(term => significance.toLowerCase().includes(term));
  }

  private checkSymmetry(elements: DesignElement[]): { isBalanced: boolean; score: number } {
    // Simple symmetry check based on element positions
    const centerX = elements.reduce((sum, el) => sum + el.position.x, 0) / elements.length;
    const variance = elements.reduce((sum, el) => sum + Math.pow(el.position.x - centerX, 2), 0) / elements.length;
    return {
      isBalanced: variance < 100,
      score: Math.max(0, 100 - variance)
    };
  }

  private checkCulturalConflicts(culture1: CultureType, culture2: CultureType): string[] {
    const conflicts: string[] = [];
    
    // Example conflicts
    if (culture1 === 'japanese' && culture2 === 'modern') {
      conflicts.push('minimalism vs. functionality');
    }
    
    if (culture1 === 'scandinavian' && culture2 === 'italian') {
      conflicts.push('simplicity vs. ornate design');
    }

    return conflicts;
  }

  private identifySacredElements(design: Design, culture: CultureType): string[] {
    const sacred: string[] = [];
    
    // Check for sacred symbols in design elements
    design.designElements.forEach(element => {
      if (element.culturalSignificance?.toLowerCase().includes('sacred')) {
        sacred.push(element.name);
      }
    });

    return sacred;
  }

  private identifyStereotypes(design: Design, culture: CultureType): string[] {
    const stereotypes: string[] = [];
    
    // Common stereotypical elements to avoid
    const stereotypicalElements = {
      japanese: ['ninja', 'samurai', 'geisha'],
      italian: ['gondola', 'pizza', 'pasta'],
      french: ['beret', 'baguette', 'wine'],
      scandinavian: ['viking', 'ikea'],
      modern: ['tech', 'minimal', 'glass'],
      american: ['cowboy', 'eagles', 'stars-stripes'],
      mexican: ['sombreros', 'cactus', 'tequila'],
      korean: ['taekwondo', 'kimchi', 'k-pop'],
      jewish: ['stereotypical', 'religious-only', 'kosher-only']
    };

    const culturalStereotypes = stereotypicalElements[culture] || [];
    
    design.designElements.forEach(element => {
      if (culturalStereotypes.some(stereotype => 
        element.name.toLowerCase().includes(stereotype)
      )) {
        stereotypes.push(element.name);
      }
    });

    return stereotypes;
  }

  // Event-specific validation
  validateEventAppropriatenesss(design: Design, eventType: EventType, culture: CultureType): {
    warnings: string[];
    suggestions: string[];
    score: number;
  } {
    const warnings: string[] = [];
    const suggestions: string[] = [];
    let score = 100;

    // Event-specific cultural guidelines
    if (eventType === 'wedding') {
      if (culture === 'japanese' && design.colorPalette.includes('#000000')) {
        warnings.push('Black may be inappropriate for Japanese wedding celebrations');
        score -= 15;
      }
      
      if (culture === 'modern' && !design.colorPalette.some(color => 
        ['#FFFFFF', '#F5F5F5', '#FFF'].includes(color)
      )) {
        suggestions.push('Consider incorporating white for modern, clean aesthetics');
        score -= 5;
      }
    }

    if (eventType === 'cultural' && design.culturalInfluences.length === 1) {
      suggestions.push('Consider incorporating authentic cultural elements for cultural events');
      score -= 10;
    }

    return { warnings, suggestions, score };
  }

  // Generate cultural recommendations
  generateCulturalRecommendations(culture: CultureType, eventType: EventType): {
    colors: string[];
    materials: string[];
    patterns: string[];
    principles: string[];
    restrictions: string[];
  } {
    const guidelines = this.guidelines[culture];
    
    return {
      colors: guidelines.respectfulColors,
      materials: guidelines.materials,
      patterns: guidelines.appropriatePatterns,
      principles: guidelines.principles,
      restrictions: guidelines.restrictions
    };
  }
}

// Export singleton instance
export const culturalValidator = new CulturalValidator();

// Utility functions
export const validateCulturalDesign = async (
  design: Design,
  culturalContext: CultureType
): Promise<CulturalValidationResult> => {
  return culturalValidator.validateDesign(design, culturalContext);
};

export const getCulturalRecommendations = (
  culture: CultureType,
  eventType: EventType
) => {
  return culturalValidator.generateCulturalRecommendations(culture, eventType);
};

export const validateEventCulturalMatch = (
  design: Design,
  eventType: EventType,
  culture: CultureType
) => {
  return culturalValidator.validateEventAppropriatenesss(design, eventType, culture);
};

export default culturalValidator;