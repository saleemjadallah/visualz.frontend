'use client';

import React from 'react';
import { Badge } from 'lucide-react';

interface Culture {
  id: string;
  name: string;
  flag: string;
  primaryColor: string;
  accentColor: string;
  principleCount: number;
  description: string;
}

interface CultureNavProps {
  cultures: Culture[];
  selectedCulture: string;
  onCultureSelect: (cultureId: string) => void;
}

const CultureNav: React.FC<CultureNavProps> = ({ 
  cultures, 
  selectedCulture, 
  onCultureSelect 
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
      <div className="flex items-center space-x-2 mb-6">
        <Badge className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Cultural Traditions</h3>
      </div>
      
      <div className="space-y-2">
        {cultures.map((culture) => (
          <button
            key={culture.id}
            onClick={() => onCultureSelect(culture.id)}
            className={`w-full group relative overflow-hidden rounded-xl p-4 text-left transition-all duration-300 ${
              selectedCulture === culture.id
                ? 'bg-blue-50 text-blue-700 border-2 border-blue-200 shadow-md'
                : 'hover:bg-gray-50 text-gray-700 hover:shadow-sm'
            }`}
          >
            {/* Background gradient on hover */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300"
              style={{ 
                background: `linear-gradient(135deg, ${culture.primaryColor}, ${culture.accentColor})` 
              }}
            />
            
            <div className="relative flex items-center space-x-3">
              <div className="text-2xl">{culture.flag}</div>
              <div className="flex-1">
                <div className="font-medium">{culture.name}</div>
                <div className="text-sm opacity-75">
                  {culture.principleCount} principles
                </div>
              </div>
              
              {/* Selection indicator */}
              {selectedCulture === culture.id && (
                <div className="w-2 h-2 bg-blue-600 rounded-full" />
              )}
            </div>
            
            {/* Expanded description for selected culture */}
            {selectedCulture === culture.id && (
              <div className="mt-3 pt-3 border-t border-blue-200">
                <p className="text-xs text-blue-600 leading-relaxed">
                  {culture.description}
                </p>
              </div>
            )}
          </button>
        ))}
      </div>
      
      {/* Cultural Sensitivity Note */}
      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <div className="flex items-start space-x-2">
          <div className="w-4 h-4 bg-amber-400 rounded-full mt-0.5" />
          <div>
            <p className="text-xs font-medium text-amber-900 mb-1">
              Cultural Respect
            </p>
            <p className="text-xs text-amber-800">
              Learn and apply these principles with respect for their cultural origins.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CultureNav;