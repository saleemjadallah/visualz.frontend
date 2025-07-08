'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Info } from 'lucide-react';

interface ColorSwatch {
  name: string;
  hex: string;
  cssVar: string;
  meaning: string;
  description: string;
  usage: string;
}

interface CulturalPalette {
  id: string;
  name: string;
  theme: string;
  flag: string;
  description: string;
  colors: ColorSwatch[];
  gradient: string;
  pattern: string;
}

const CulturalColorPalette = () => {
  const [selectedPalette, setSelectedPalette] = useState('japanese');
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const palettes: CulturalPalette[] = [
    {
      id: 'japanese',
      name: 'Temple Garden at Dawn',
      theme: 'Japanese',
      flag: '🇯🇵',
      description: 'Inspired by misty temple gardens, aged cedar, and golden morning light filtering through bamboo',
      colors: [
        {
          name: 'Ink Wash',
          hex: '#2d3436',
          cssVar: '--jp-ink-wash',
          meaning: 'Depth & Wisdom',
          description: 'Traditional sumi-e ink wash technique',
          usage: 'Primary text, main elements'
        },
        {
          name: 'Bamboo Mist',
          hex: '#636e72',
          cssVar: '--jp-bamboo-mist',
          meaning: 'Serenity & Growth',
          description: 'Morning mist through bamboo forest',
          usage: 'Secondary text, borders'
        },
        {
          name: 'Aged Cedar',
          hex: '#8b7355',
          cssVar: '--jp-aged-cedar',
          meaning: 'Endurance & Strength',
          description: 'Weathered temple wood',
          usage: 'Structural elements, navigation'
        },
        {
          name: 'Temple Gold',
          hex: '#f39c12',
          cssVar: '--jp-temple-gold',
          meaning: 'Enlightenment & Sacred',
          description: 'Golden temple bells and accents',
          usage: 'Highlights, buttons, accents'
        },
        {
          name: 'Cherry Blush',
          hex: '#fd79a8',
          cssVar: '--jp-cherry-blush',
          meaning: 'Beauty & Impermanence',
          description: 'Delicate sakura petals',
          usage: 'Soft highlights, notifications'
        },
        {
          name: 'Stone Garden',
          hex: '#ecf0f1',
          cssVar: '--jp-stone-garden',
          meaning: 'Balance & Meditation',
          description: 'Zen garden stones',
          usage: 'Backgrounds, cards'
        },
        {
          name: 'Paper White',
          hex: '#ffeaa7',
          cssVar: '--jp-paper-white',
          meaning: 'Purity & Simplicity',
          description: 'Handmade washi paper',
          usage: 'Main backgrounds, content areas'
        },
        {
          name: 'Moss Green',
          hex: '#00b894',
          cssVar: '--jp-moss-green',
          meaning: 'Life & Harmony',
          description: 'Temple moss and gardens',
          usage: 'Success states, nature elements'
        }
      ],
      gradient: 'linear-gradient(135deg, #2d3436, #636e72)',
      pattern: 'pattern-japanese'
    },
    {
      id: 'scandinavian',
      name: 'Cozy Cabin Winter',
      theme: 'Swedish',
      flag: '🇸🇪',
      description: 'Inspired by weathered pine, soft winter light, and cozy cabin moments with lingonberry warmth',
      colors: [
        {
          name: 'Pine Bark',
          hex: '#5d4e37',
          cssVar: '--se-pine-bark',
          meaning: 'Stability & Groundedness',
          description: 'Weathered pine bark texture',
          usage: 'Primary elements, headers'
        },
        {
          name: 'Winter Sky',
          hex: '#74b9ff',
          cssVar: '--se-winter-sky',
          meaning: 'Clarity & Openness',
          description: 'Clear winter sky blue',
          usage: 'Links, interactive elements'
        },
        {
          name: 'Wool Cream',
          hex: '#f8f5f0',
          cssVar: '--se-wool-cream',
          meaning: 'Comfort & Warmth',
          description: 'Hand-knitted wool texture',
          usage: 'Backgrounds, cards'
        },
        {
          name: 'Lingonberry',
          hex: '#e84393',
          cssVar: '--se-lingonberry',
          meaning: 'Vitality & Tradition',
          description: 'Nordic lingonberry preserve',
          usage: 'Accents, calls-to-action'
        },
        {
          name: 'Birch White',
          hex: '#ffefd5',
          cssVar: '--se-birch-white',
          meaning: 'Purity & Renewal',
          description: 'Birch bark white',
          usage: 'Content backgrounds'
        },
        {
          name: 'Forest Deep',
          hex: '#2d3436',
          cssVar: '--se-forest-deep',
          meaning: 'Depth & Mystery',
          description: 'Deep forest shadows',
          usage: 'Text, important elements'
        },
        {
          name: 'Copper Pot',
          hex: '#d63031',
          cssVar: '--se-copper-pot',
          meaning: 'Craft & Heritage',
          description: 'Traditional copper cookware',
          usage: 'Warnings, emphasis'
        },
        {
          name: 'Sage Green',
          hex: '#a4b494',
          cssVar: '--se-sage-green',
          meaning: 'Wisdom & Nature',
          description: 'Nordic sage and herbs',
          usage: 'Secondary elements, calm states'
        }
      ],
      gradient: 'linear-gradient(135deg, #5d4e37, #74b9ff)',
      pattern: 'pattern-scandinavian'
    },
    {
      id: 'italian',
      name: 'Tuscan Autumn',
      theme: 'Italian',
      flag: '🇮🇹',
      description: 'Inspired by sun-baked terracotta, ancient olive groves, and golden vineyard harvests',
      colors: [
        {
          name: 'Terracotta',
          hex: '#c0392b',
          cssVar: '--it-terracotta',
          meaning: 'Earthiness & Passion',
          description: 'Sun-baked clay pottery',
          usage: 'Primary elements, headers'
        },
        {
          name: 'Olive Grove',
          hex: '#27ae60',
          cssVar: '--it-olive-grove',
          meaning: 'Abundance & Peace',
          description: 'Ancient olive tree leaves',
          usage: 'Success states, nature elements'
        },
        {
          name: 'Vineyard Gold',
          hex: '#f39c12',
          cssVar: '--it-vineyard-gold',
          meaning: 'Harvest & Prosperity',
          description: 'Autumn vine leaves',
          usage: 'Highlights, golden accents'
        },
        {
          name: 'Stone Cream',
          hex: '#f8f5f1',
          cssVar: '--it-stone-cream',
          meaning: 'Timelessness & Strength',
          description: 'Tuscan stone walls',
          usage: 'Backgrounds, neutral areas'
        },
        {
          name: 'Wine Deep',
          hex: '#8e44ad',
          cssVar: '--it-wine-deep',
          meaning: 'Richness & Tradition',
          description: 'Aged Chianti wine',
          usage: 'Luxury elements, depth'
        },
        {
          name: 'Herb Sage',
          hex: '#95a5a6',
          cssVar: '--it-herb-sage',
          meaning: 'Wisdom & Healing',
          description: 'Wild Mediterranean herbs',
          usage: 'Secondary text, subtle elements'
        },
        {
          name: 'Lemon Zest',
          hex: '#f1c40f',
          cssVar: '--it-lemon-zest',
          meaning: 'Joy & Freshness',
          description: 'Amalfi lemon brightness',
          usage: 'Bright accents, alerts'
        },
        {
          name: 'Earth Brown',
          hex: '#795548',
          cssVar: '--it-earth-brown',
          meaning: 'Stability & Growth',
          description: 'Rich Italian earth',
          usage: 'Grounding elements, foundations'
        }
      ],
      gradient: 'linear-gradient(135deg, #c0392b, #f39c12)',
      pattern: 'pattern-italian'
    },
    {
      id: 'french',
      name: 'Provence Afternoon',
      theme: 'French',
      flag: '🇫🇷',
      description: 'Inspired by lavender fields, limestone châteaux, and the elegance of vintage French brass',
      colors: [
        {
          name: 'Lavender',
          hex: '#9b59b6',
          cssVar: '--fr-lavender',
          meaning: 'Elegance & Tranquility',
          description: 'Provence lavender fields',
          usage: 'Primary accents, luxury elements'
        },
        {
          name: 'Château Cream',
          hex: '#f8f6f0',
          cssVar: '--fr-château-cream',
          meaning: 'Sophistication & Heritage',
          description: 'Limestone château walls',
          usage: 'Backgrounds, elegant areas'
        },
        {
          name: 'Vintage Brass',
          hex: '#d4af37',
          cssVar: '--fr-vintage-brass',
          meaning: 'Luxury & Craftsmanship',
          description: 'Antique brass fixtures',
          usage: 'Highlights, premium elements'
        },
        {
          name: 'Wine Burgundy',
          hex: '#722f37',
          cssVar: '--fr-wine-burgundy',
          meaning: 'Depth & Refinement',
          description: 'Burgundy wine richness',
          usage: 'Primary text, important elements'
        },
        {
          name: 'Sage Grey',
          hex: '#95a5a6',
          cssVar: '--fr-sage-grey',
          meaning: 'Balance & Sophistication',
          description: 'French grey-green tones',
          usage: 'Secondary elements, subtle accents'
        },
        {
          name: 'Honey Gold',
          hex: '#f39c12',
          cssVar: '--fr-honey-gold',
          meaning: 'Sweetness & Warmth',
          description: 'Acacia honey golden',
          usage: 'Warm accents, highlights'
        },
        {
          name: 'Chalk White',
          hex: '#fdfcfb',
          cssVar: '--fr-chalk-white',
          meaning: 'Purity & Lightness',
          description: 'Champagne chalk cliffs',
          usage: 'Clean backgrounds, content areas'
        },
        {
          name: 'Forest Green',
          hex: '#27ae60',
          cssVar: '--fr-forest-green',
          meaning: 'Nature & Growth',
          description: 'Loire Valley forests',
          usage: 'Success states, natural elements'
        }
      ],
      gradient: 'linear-gradient(135deg, #722f37, #d4af37)',
      pattern: 'pattern-french'
    }
  ];

  const currentPalette = palettes.find(p => p.id === selectedPalette) || palettes[0];

  const copyToClipboard = (color: ColorSwatch) => {
    navigator.clipboard.writeText(color.hex);
    setCopiedColor(color.hex);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-display font-bold text-cultural-heading">
          🎨 Authentic Cultural Color Palettes
        </h1>
        <p className="text-lg text-cultural-body max-w-3xl mx-auto">
          Colors that transport users through design - each palette tells a story and evokes specific cultural atmospheres
        </p>
      </div>

      {/* Palette Selector */}
      <div className="flex justify-center">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {palettes.map((palette) => (
            <motion.button
              key={palette.id}
              onClick={() => setSelectedPalette(palette.id)}
              className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                selectedPalette === palette.id 
                  ? 'border-cultural-accent shadow-lg scale-105' 
                  : 'border-cultural-soft hover:border-cultural-secondary'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-center space-y-2">
                <div className="text-3xl">{palette.flag}</div>
                <div className="text-sm font-semibold text-cultural-primary">{palette.theme}</div>
                <div className="text-xs text-cultural-body">{palette.name}</div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Selected Palette Display */}
      <motion.div 
        key={selectedPalette}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* Palette Header */}
        <div className="text-center space-y-4 p-8 card-cultural">
          <div className="text-5xl">{currentPalette.flag}</div>
          <h2 className="text-3xl font-display font-bold text-cultural-heading">
            {currentPalette.name}
          </h2>
          <p className="text-lg text-cultural-body max-w-2xl mx-auto">
            {currentPalette.description}
          </p>
          <div 
            className="h-16 rounded-2xl mx-auto max-w-md shadow-inner"
            style={{ background: currentPalette.gradient }}
          />
        </div>

        {/* Color Swatches */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentPalette.colors.map((color, index) => (
            <motion.div
              key={color.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl border border-cultural-soft shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Color Swatch */}
              <div 
                className="h-32 relative cursor-pointer group"
                style={{ backgroundColor: color.hex }}
                onClick={() => copyToClipboard(color)}
              >
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {copiedColor === color.hex ? (
                      <Check className="w-6 h-6 text-white" />
                    ) : (
                      <Copy className="w-6 h-6 text-white" />
                    )}
                  </div>
                </div>
              </div>

              {/* Color Info */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-cultural-primary">{color.name}</h3>
                  <button
                    onClick={() => setShowTooltip(showTooltip === color.name ? null : color.name)}
                    className="text-cultural-secondary hover:text-cultural-accent transition-colors"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-cultural-body">HEX:</span>
                    <code className="bg-cultural-soft px-2 py-1 rounded text-cultural-primary font-mono">
                      {color.hex}
                    </code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-cultural-body">CSS:</span>
                    <code className="bg-cultural-soft px-2 py-1 rounded text-cultural-primary font-mono text-xs">
                      {color.cssVar}
                    </code>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-semibold text-cultural-accent">
                    {color.meaning}
                  </div>
                  <div className="text-xs text-cultural-body">
                    {color.description}
                  </div>
                </div>

                {/* Tooltip */}
                {showTooltip === color.name && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-cultural-soft rounded-lg p-3 text-xs text-cultural-body"
                  >
                    <strong>Usage:</strong> {color.usage}
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pattern Preview */}
        <div className="p-8 card-cultural">
          <h3 className="text-xl font-display font-bold text-cultural-heading mb-4 text-center">
            Cultural Pattern Preview
          </h3>
          <div 
            className={`h-32 rounded-2xl ${currentPalette.pattern} border border-cultural-secondary`}
            style={{ background: currentPalette.gradient }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default CulturalColorPalette;