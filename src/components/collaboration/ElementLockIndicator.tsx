'use client';

import React from 'react';
import { Lock, UserIcon } from 'lucide-react';

interface ElementLockIndicatorProps {
  elementId: string;
  lockedBy?: string;
  username?: string;
  className?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

const ElementLockIndicator: React.FC<ElementLockIndicatorProps> = ({
  elementId,
  lockedBy,
  username,
  className = '',
  position = 'top-right'
}) => {
  if (!lockedBy) return null;

  const positionClasses = {
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'bottom-right': 'bottom-0 right-0'
  };

  // Generate a consistent color for the user
  const getUserColor = (userId: string): string => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ];
    
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = ((hash << 5) - hash + userId.charCodeAt(i)) & 0xffffffff;
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div
      className={`absolute ${positionClasses[position]} transform translate-x-1 -translate-y-1 z-10 ${className}`}
    >
      <div className="relative group">
        {/* Lock Icon */}
        <div
          className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-white shadow-lg animate-pulse"
          style={{ backgroundColor: getUserColor(lockedBy) }}
        >
          <Lock className="w-3 h-3 text-white" />
        </div>
        
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div
            className="px-2 py-1 text-xs text-white rounded whitespace-nowrap shadow-lg"
            style={{ backgroundColor: getUserColor(lockedBy) }}
          >
            <div className="flex items-center space-x-1">
              <UserIcon className="w-3 h-3" />
              <span>Locked by {username || lockedBy}</span>
            </div>
          </div>
          {/* Arrow */}
          <div
            className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent"
            style={{ borderTopColor: getUserColor(lockedBy) }}
          />
        </div>
      </div>
    </div>
  );
};

export default ElementLockIndicator;