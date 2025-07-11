import React from 'react';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CultureType } from '@/lib/types';

export interface CulturalBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  culture: CultureType;
}

const CulturalBadge = React.forwardRef<HTMLSpanElement, CulturalBadgeProps>(
  ({ culture, className, ...props }, ref) => {
    const culturalStyles = {
      japanese: 'bg-gradient-to-r from-red-100 to-orange-100 text-red-800 border-red-200',
      scandinavian: 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200',
      italian: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200',
      french: 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-purple-200',
      modern: 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-200',
      american: 'bg-gradient-to-r from-red-100 to-blue-100 text-blue-800 border-blue-200',
      mexican: 'bg-gradient-to-r from-green-100 to-red-100 text-green-800 border-green-200',
      korean: 'bg-gradient-to-r from-blue-100 to-white text-blue-800 border-blue-200',
      jewish: 'bg-gradient-to-r from-blue-100 to-indigo-100 text-indigo-800 border-indigo-200'
    };
    
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border",
          culturalStyles[culture] || culturalStyles.modern,
          className
        )}
        {...props}
      >
        <Globe className="w-3 h-3 mr-1" />
        {culture.charAt(0).toUpperCase() + culture.slice(1)}
      </span>
    );
  }
);
CulturalBadge.displayName = "CulturalBadge";

export { CulturalBadge };