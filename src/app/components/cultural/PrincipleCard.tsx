'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface Principle {
  name: string;
  description: string;
  icon: LucideIcon;
  application: string;
  colors: string[];
  examples: string[];
}

interface PrincipleCardProps {
  principle: Principle;
  cultureColor: string;
  index: number;
}

const PrincipleCard: React.FC<PrincipleCardProps> = ({ 
  principle, 
  cultureColor, 
  index 
}) => {
  const { name, description, icon: Icon, application, colors, examples } = principle;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 group animate-slide-up">
      <div className="flex items-start space-x-6">
        {/* Icon */}
        <div 
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300"
          style={{ backgroundColor: cultureColor }}
        >
          <Icon className="w-8 h-8" />
        </div>
        
        <div className="flex-1">
          {/* Header */}
          <div className="mb-4">
            <h4 className="text-xl font-display font-semibold text-gray-900 mb-2">
              {name}
            </h4>
            <p className="text-gray-600 text-lg leading-relaxed">
              {description}
            </p>
          </div>
          
          {/* Application */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6 border-l-4 border-blue-500">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Practical Application:
            </p>
            <p className="text-gray-600">{application}</p>
          </div>
          
          {/* Color Palette */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-3">
              Cultural Color Palette:
            </p>
            <div className="flex items-center space-x-3">
              {colors.map((color, colorIndex) => (
                <div key={colorIndex} className="group/color relative">
                  <div
                    className="w-10 h-10 rounded-xl border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                  {/* Color value tooltip */}
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/color:opacity-100 transition-opacity pointer-events-none">
                    {color}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Examples */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">
              Design Examples:
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {examples.map((example, exampleIndex) => (
                <div 
                  key={exampleIndex} 
                  className="bg-blue-50 rounded-lg p-3 border border-blue-100 hover:bg-blue-100 transition-colors"
                >
                  <p className="text-sm text-blue-800 font-medium">{example}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Principle Number Badge */}
      <div className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
        <span className="text-sm font-bold text-gray-600">{index + 1}</span>
      </div>
    </div>
  );
};

export default PrincipleCard;