import { CultureType, CulturalTheme, EventType, BudgetTier } from './types';

// Cultural Themes Database
export const CULTURAL_THEMES: Record<CultureType, CulturalTheme> = {
  japanese: {
    culture: 'japanese',
    name: 'Japanese Design Philosophy',
    principles: [
      {
        name: 'Wabi-Sabi',
        description: 'Finding beauty in imperfection and impermanence',
        application: 'Use natural materials, embrace asymmetry, celebrate aging and patina',
        colors: ['#8B4513', '#F5E6D3', '#2F4F4F'],
        materials: ['wood', 'bamboo', 'stone', 'paper', 'ceramic'],
        patterns: ['asymmetric', 'organic', 'minimal', 'flowing']
      },
      {
        name: 'Ma (Negative Space)',
        description: 'The power of emptiness and intervals',
        application: 'Strategic use of empty spaces, breathing room between elements',
        colors: ['#FFFFFF', '#F8F8FF', '#E6E6FA'],
        materials: ['air', 'light', 'shadow'],
        patterns: ['spacious', 'contemplative', 'minimal']
      },
      {
        name: 'Seasonal Harmony',
        description: 'Honoring the natural cycle of seasons',
        application: 'Incorporate seasonal elements, flowers, and seasonal color shifts',
        colors: ['#FFB6C1', '#98FB98', '#F0E68C', '#DDA0DD'],
        materials: ['seasonal flowers', 'seasonal fruits', 'seasonal textiles'],
        patterns: ['seasonal', 'natural', 'cyclical']
      }
    ],
    colorPalette: {
      primary: '#2c3e50',
      secondary: '#8b7355',
      accent: '#d4af37',
      neutral: ['#fafaf9', '#f5f5f4', '#e7e5e4', '#d6d3d1']
    },
    guidelines: [
      'Use natural materials: wood, bamboo, stone, paper',
      'Maintain low furniture and eye levels',
      'Incorporate water elements for tranquility',
      'Use warm, low lighting (2700K-3000K)',
      'Respect the concept of "less is more"',
      'Create harmony between indoor and outdoor spaces'
    ],
    materials: ['wood', 'bamboo', 'stone', 'paper', 'ceramic', 'natural fibers'],
    patterns: ['asymmetric', 'organic', 'minimal', 'flowing', 'nature-inspired']
  },

  scandinavian: {
    culture: 'scandinavian',
    name: 'Scandinavian Design Philosophy',
    principles: [
      {
        name: 'Hygge',
        description: 'Creating cozy, comfortable, and content atmospheres',
        application: 'Warm lighting, soft textiles, comfortable seating areas',
        colors: ['#F5F5DC', '#D2B48C', '#CD853F'],
        materials: ['wool', 'cotton', 'linen', 'sheepskin'],
        patterns: ['cozy', 'comfortable', 'inviting', 'warm']
      },
      {
        name: 'Lagom',
        description: 'The balance of not too little, not too much, just right',
        application: 'Balanced proportions, moderate use of color and pattern',
        colors: ['#F8F8FF', '#E6E6FA', '#D3D3D3'],
        materials: ['natural wood', 'neutral fabrics', 'simple metals'],
        patterns: ['balanced', 'moderate', 'harmonious']
      },
      {
        name: 'Functionality',
        description: 'Beautiful design that serves a purpose',
        application: 'Multi-purpose furniture, clean lines, practical solutions',
        colors: ['#FFFFFF', '#F0F0F0', '#E0E0E0'],
        materials: ['light wood', 'white metal', 'glass'],
        patterns: ['functional', 'clean', 'purposeful']
      }
    ],
    colorPalette: {
      primary: '#5b9bd5',
      secondary: '#d2b48c',
      accent: '#fafafa',
      neutral: ['#ffffff', '#f8f9fa', '#f1f3f4', '#e8eaed']
    },
    guidelines: [
      'Maximize natural light and bright spaces',
      'Use light woods like birch, pine, and oak',
      'Incorporate cozy textiles and layers',
      'Keep color palettes neutral with accent colors',
      'Focus on functionality and simplicity',
      'Create connection with nature'
    ],
    materials: ['light wood', 'wool', 'linen', 'leather', 'metal', 'glass'],
    patterns: ['geometric', 'minimal', 'cozy', 'functional', 'light']
  },

  italian: {
    culture: 'italian',
    name: 'Italian Design Philosophy',
    principles: [
      {
        name: 'Bella Figura',
        description: 'Making a beautiful impression through attention to detail',
        application: 'Attention to every detail, quality materials, refined finishes',
        colors: ['#DAA520', '#CD853F', '#D2691E'],
        materials: ['marble', 'leather', 'silk', 'gold'],
        patterns: ['elegant', 'refined', 'detailed', 'luxurious']
      },
      {
        name: 'La Dolce Vita',
        description: 'The sweet life - celebrating pleasure and beauty',
        application: 'Comfortable luxury, spaces for gathering, celebration of life',
        colors: ['#FF6347', '#FF7F50', '#FFB6C1'],
        materials: ['rich fabrics', 'warm metals', 'comfortable seating'],
        patterns: ['celebratory', 'warm', 'inviting', 'luxurious']
      },
      {
        name: 'Artisan Tradition',
        description: 'Honoring traditional craftsmanship and quality',
        application: 'Handcrafted elements, traditional techniques, quality materials',
        colors: ['#8B4513', '#A0522D', '#CD853F'],
        materials: ['handcrafted wood', 'artisan ceramics', 'woven textiles'],
        patterns: ['traditional', 'crafted', 'authentic', 'timeless']
      }
    ],
    colorPalette: {
      primary: '#a0522d',
      secondary: '#faf0e6',
      accent: '#ffd700',
      neutral: ['#fdf6e3', '#f7f1e8', '#f0ebe2', '#e8ddd4']
    },
    guidelines: [
      'Use warm, earthy colors with rich accents',
      'Incorporate natural materials like stone and wood',
      'Layer textures and patterns thoughtfully',
      'Create intimate conversation areas',
      'Use warm, ambient lighting',
      'Celebrate food and gathering spaces'
    ],
    materials: ['stone', 'terracotta', 'wood', 'leather', 'silk', 'marble'],
    patterns: ['warm', 'rich', 'textured', 'traditional', 'elegant']
  },

  french: {
    culture: 'french',
    name: 'French Design Philosophy',
    principles: [
      {
        name: 'Savoir-Vivre',
        description: 'The art of living well with refinement and grace',
        application: 'Elegant proportions, refined details, graceful arrangements',
        colors: ['#6495ED', '#B0C4DE', '#E6E6FA'],
        materials: ['silk', 'velvet', 'crystal', 'silver'],
        patterns: ['elegant', 'graceful', 'refined', 'sophisticated']
      },
      {
        name: 'Joie de Vivre',
        description: 'Joy of living - celebrating life and beauty',
        application: 'Cheerful colors, comfortable luxury, spaces for enjoyment',
        colors: ['#FFB6C1', '#FFC0CB', '#FFE4E1'],
        materials: ['comfortable fabrics', 'fresh flowers', 'quality linens'],
        patterns: ['joyful', 'light', 'cheerful', 'comfortable']
      },
      {
        name: 'Chic Simplicity',
        description: 'Effortless elegance through thoughtful restraint',
        application: 'Clean lines with luxurious touches, quality over quantity',
        colors: ['#F8F6F0', '#E6E6FA', '#D3D3D3'],
        materials: ['quality fabrics', 'refined metals', 'crystal'],
        patterns: ['chic', 'simple', 'elegant', 'understated']
      }
    ],
    colorPalette: {
      primary: '#6495ed',
      secondary: '#f8f6f0',
      accent: '#d4af37',
      neutral: ['#ffffff', '#faf9f7', '#f5f4f1', '#efebe6']
    },
    guidelines: [
      'Balance elegance with comfort',
      'Use soft, romantic color palettes',
      'Incorporate antique and vintage elements',
      'Create layered, sophisticated lighting',
      'Focus on quality fabrics and materials',
      'Design spaces for entertaining and conversation'
    ],
    materials: ['silk', 'velvet', 'linen', 'crystal', 'antique wood', 'porcelain'],
    patterns: ['romantic', 'elegant', 'sophisticated', 'timeless', 'refined']
  },

  modern: {
    culture: 'modern',
    name: 'Modern Design Philosophy',
    principles: [
      {
        name: 'Bold Expression',
        description: 'Confident use of color, pattern, and scale',
        application: 'Statement pieces, bold color combinations, confident proportions',
        colors: ['#FF0000', '#0000FF', '#FFFFFF'],
        materials: ['various', 'mixed', 'eclectic'],
        patterns: ['bold', 'confident', 'expressive', 'diverse']
      },
      {
        name: 'Comfort First',
        description: 'Prioritizing livability and everyday comfort',
        application: 'Comfortable seating, practical layouts, family-friendly spaces',
        colors: ['#F5DEB3', '#D2B48C', '#DDA0DD'],
        materials: ['comfortable fabrics', 'durable materials', 'easy-care finishes'],
        patterns: ['comfortable', 'practical', 'livable', 'family-friendly']
      },
      {
        name: 'Innovation',
        description: 'Embracing new ideas, technologies, and approaches',
        application: 'Modern technology integration, creative solutions, fresh approaches',
        colors: ['#00CED1', '#FF6347', '#32CD32'],
        materials: ['modern materials', 'technology', 'innovative solutions'],
        patterns: ['innovative', 'modern', 'creative', 'fresh']
      }
    ],
    colorPalette: {
      primary: '#1e40af',
      secondary: '#f59e0b',
      accent: '#dc2626',
      neutral: ['#ffffff', '#f9fafb', '#f3f4f6', '#e5e7eb']
    },
    guidelines: [
      'Embrace eclectic mixing of styles',
      'Prioritize comfort and functionality',
      'Use technology to enhance living',
      'Create spaces for family gatherings',
      'Be bold with color and pattern',
      'Focus on individual expression'
    ],
    materials: ['varied', 'comfortable', 'durable', 'innovative', 'practical'],
    patterns: ['eclectic', 'bold', 'comfortable', 'innovative', 'expressive']
  }
};

// Event Type Definitions
export const EVENT_TYPES: Record<EventType, { 
  label: string; 
  icon: string; 
  description: string;
  culturalConsiderations: string[];
}> = {
  birthday: {
    label: 'Birthday Celebration',
    icon: '🎂',
    description: 'Personal milestone celebrations',
    culturalConsiderations: [
      'Age-appropriate cultural elements',
      'Family traditions and customs',
      'Seasonal considerations',
      'Personal cultural heritage'
    ]
  },
  wedding: {
    label: 'Wedding Reception',
    icon: '💒',
    description: 'Sacred union celebrations',
    culturalConsiderations: [
      'Religious and spiritual traditions',
      'Family cultural backgrounds',
      'Ceremonial significance',
      'Cultural fusion sensitivity'
    ]
  },
  corporate: {
    label: 'Corporate Event',
    icon: '🏢',
    description: 'Professional gatherings',
    culturalConsiderations: [
      'Professional cultural norms',
      'International attendee sensitivity',
      'Brand cultural alignment',
      'Inclusive design principles'
    ]
  },
  cultural: {
    label: 'Cultural Festival',
    icon: '🎭',
    description: 'Traditional celebrations',
    culturalConsiderations: [
      'Authentic cultural representation',
      'Traditional elements and symbols',
      'Community cultural standards',
      'Educational opportunities'
    ]
  },
  holiday: {
    label: 'Holiday Party',
    icon: '🎄',
    description: 'Seasonal celebrations',
    culturalConsiderations: [
      'Religious sensitivity',
      'Seasonal cultural traditions',
      'Inclusive celebration approaches',
      'Multiple faith considerations'
    ]
  }
};

// Budget Tier Definitions
export const BUDGET_TIERS: Record<BudgetTier, {
  label: string;
  range: string;
  icon: string;
  description: string;
  features: string[];
}> = {
  modest: {
    label: 'Modest',
    range: '$500 - $2,000',
    icon: '💰',
    description: 'Creative solutions, DIY elements',
    features: [
      'DIY decoration elements',
      'Budget-friendly cultural touches',
      'Creative space utilization',
      'Simple but meaningful details'
    ]
  },
  comfortable: {
    label: 'Comfortable',
    range: '$2,000 - $8,000',
    icon: '💎',
    description: 'Balanced professional touches',
    features: [
      'Professional setup services',
      'Quality cultural elements',
      'Balanced decoration and catering',
      'Some custom design pieces'
    ]
  },
  luxurious: {
    label: 'Luxurious',
    range: '$8,000 - $25,000',
    icon: '👑',
    description: 'Premium materials and services',
    features: [
      'Premium cultural artifacts',
      'Professional design consultation',
      'High-end materials and finishes',
      'Custom cultural installations'
    ]
  },
  unlimited: {
    label: "Sky's the Limit",
    range: '$25,000+',
    icon: '✨',
    description: 'Unlimited creative expression',
    features: [
      'Bespoke cultural experiences',
      'Master artisan collaborations',
      'Exclusive venue transformations',
      'Museum-quality cultural pieces'
    ]
  }
};

// Color Palettes for Cultural Themes
export const CULTURAL_COLOR_PALETTES = {
  japanese: {
    primary: ['#2c3e50', '#34495e', '#2c3e50'],
    warm: ['#8b7355', '#a0916c', '#b5a784'],
    accent: ['#d4af37', '#e6c757', '#f7dc6f'],
    neutral: ['#fafaf9', '#f5f5f4', '#e7e5e4', '#d6d3d1'],
    seasonal: ['#ffb6c1', '#98fb98', '#f0e68c', '#dda0dd']
  },
  scandinavian: {
    primary: ['#5b9bd5', '#74a9d8', '#8db6db'],
    cool: ['#d2b48c', '#ddbf94', '#e8ca9c'],
    accent: ['#fafafa', '#ffffff', '#f8f9fa'],
    neutral: ['#ffffff', '#f8f9fa', '#f1f3f4', '#e8eaed'],
    nature: ['#8fbc8f', '#98fb98', '#f0f8ff', '#e0ffff']
  },
  italian: {
    primary: ['#a0522d', '#b8623a', '#d07247'],
    warm: ['#faf0e6', '#fdf6e3', '#f7f1e8'],
    accent: ['#ffd700', '#ffed4e', '#fff59d'],
    neutral: ['#fdf6e3', '#f7f1e8', '#f0ebe2', '#e8ddd4'],
    earth: ['#8b4513', '#cd853f', '#daa520', '#f4a460']
  },
  french: {
    primary: ['#6495ed', '#7ba3f0', '#91b1f3'],
    soft: ['#f8f6f0', '#faf9f7', '#f5f4f1'],
    accent: ['#d4af37', '#e6c757', '#f7dc6f'],
    neutral: ['#ffffff', '#faf9f7', '#f5f4f1', '#efebe6'],
    romantic: ['#ffb6c1', '#ffc0cb', '#ffe4e1', '#f0f8ff']
  },
  modern: {
    primary: ['#1e40af', '#3b82f6', '#60a5fa'],
    bold: ['#f59e0b', '#fbbf24', '#fcd34d'],
    accent: ['#dc2626', '#ef4444', '#f87171'],
    neutral: ['#ffffff', '#f9fafb', '#f3f4f6', '#e5e7eb'],
    vibrant: ['#10b981', '#8b5cf6', '#f59e0b', '#ef4444']
  }
};

// Cultural Materials Database
export const CULTURAL_MATERIALS = {
  japanese: [
    { name: 'Bamboo', significance: 'Flexibility and strength', sustainability: 'high' },
    { name: 'Cedar Wood', significance: 'Purification and longevity', sustainability: 'high' },
    { name: 'Washi Paper', significance: 'Traditional craftsmanship', sustainability: 'high' },
    { name: 'Natural Stone', significance: 'Permanence and stability', sustainability: 'high' },
    { name: 'Ceramic', significance: 'Earth connection', sustainability: 'medium' }
  ],
  scandinavian: [
    { name: 'Birch Wood', significance: 'Light and renewal', sustainability: 'high' },
    { name: 'Wool', significance: 'Warmth and comfort', sustainability: 'high' },
    { name: 'Linen', significance: 'Natural simplicity', sustainability: 'high' },
    { name: 'Sheepskin', significance: 'Hygge comfort', sustainability: 'medium' },
    { name: 'Glass', significance: 'Clarity and light', sustainability: 'high' }
  ],
  italian: [
    { name: 'Marble', significance: 'Timeless elegance', sustainability: 'medium' },
    { name: 'Travertine', significance: 'Natural beauty', sustainability: 'high' },
    { name: 'Leather', significance: 'Craftsmanship', sustainability: 'medium' },
    { name: 'Silk', significance: 'Luxury and refinement', sustainability: 'medium' },
    { name: 'Terracotta', significance: 'Earth connection', sustainability: 'high' }
  ],
  french: [
    { name: 'Crystal', significance: 'Elegance and light', sustainability: 'high' },
    { name: 'Silk', significance: 'Luxury and sophistication', sustainability: 'medium' },
    { name: 'Antique Wood', significance: 'History and character', sustainability: 'high' },
    { name: 'Porcelain', significance: 'Refinement', sustainability: 'high' },
    { name: 'Velvet', significance: 'Comfort and luxury', sustainability: 'medium' }
  ],
  modern: [
    { name: 'Reclaimed Wood', significance: 'Sustainability and character', sustainability: 'high' },
    { name: 'Steel', significance: 'Strength and innovation', sustainability: 'high' },
    { name: 'Cotton', significance: 'Comfort and versatility', sustainability: 'medium' },
    { name: 'Concrete', significance: 'Modern functionality', sustainability: 'medium' },
    { name: 'Recycled Materials', significance: 'Innovation and responsibility', sustainability: 'high' }
  ]
};

// Animation Presets
export const ANIMATION_PRESETS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.5 }
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.4 }
  },
  staggerChildren: {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }
};

// Responsive Breakpoints
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
} as const;

// Component Size Variants
export const SIZE_VARIANTS = {
  sm: {
    padding: 'px-4 py-2',
    text: 'text-sm',
    height: 'h-8'
  },
  md: {
    padding: 'px-6 py-3',
    text: 'text-base',
    height: 'h-10'
  },
  lg: {
    padding: 'px-8 py-4',
    text: 'text-lg',
    height: 'h-12'
  },
  xl: {
    padding: 'px-10 py-5',
    text: 'text-xl',
    height: 'h-14'
  }
};

// Default Form Values
export const DEFAULT_FORM_VALUES = {
  eventType: '' as EventType | '',
  culturalPreferences: [] as CultureType[],
  budgetTier: '' as BudgetTier | '',
  guestCount: 0,
  ageRange: '',
  specialNeeds: [] as string[],
  stylePreferences: {
    colors: [] as string[],
    materials: [] as string[],
    styles: [] as string[],
    mustHave: [] as string[],
    mustAvoid: [] as string[]
  }
};