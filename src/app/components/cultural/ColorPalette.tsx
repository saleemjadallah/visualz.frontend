'use client';

import React, { useState } from 'react';
import { Copy, Check, Palette } from 'lucide-react';

interface ColorPaletteProps {
  colors: string[];
  title: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  showCopy?: boolean;
}

const ColorPalette: React.FC<ColorPaletteProps> = ({
  colors,
  title,
  description,
  size = 'md',
  showLabels = true,
  showCopy = true
}) => {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const copyToClipboard = async (color: string) => {
    try {
      await navigator.clipboard.writeText(color);
      setCopiedColor(color);
      setTimeout(() => setCopiedColor(null), 2000);
    } catch (err) {
      console.error('Failed to copy color:', err);
    }
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-4">
        <Palette className="w-5 h-5 text-gray-600" />
        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
        </div>
      </div>

      {/* Color Swatches */}
      <div className="grid grid-cols-4 gap-3">
        {colors.map((color, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="relative group">
              <div
                className={`${sizeClasses[size]} rounded-xl border-2 border-gray-200 shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-110`}
                style={{ backgroundColor: color }}
                onClick={() => showCopy && copyToClipboard(color)}
              />
              
              {/* Copy Button */}
              {showCopy && (
                <button
                  onClick={() => copyToClipboard(color)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Copy color"
                >
                  {copiedColor === color ? (
                    <Check className="w-3 h-3 text-green-600" />
                  ) : (
                    <Copy className="w-3 h-3 text-gray-600" />
                  )}
                </button>
              )}
              
              {/* Copied notification */}
              {copiedColor === color && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded animate-fade-in">
                  Copied!
                </div>
              )}
            </div>
            
            {/* Color Label */}
            {showLabels && (
              <div className="mt-2 text-center">
                <p className="text-xs font-mono text-gray-600">{color}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Usage Tips */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          <strong>Usage tip:</strong> Click any color to copy its hex value. 
          Use these colors to maintain cultural authenticity in your designs.
        </p>
      </div>
    </div>
  );
};

export default ColorPalette;