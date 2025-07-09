'use client';

import React from 'react';

interface CursorPosition {
  x: number;
  y: number;
  userId: string;
  username: string;
}

interface CursorOverlayProps {
  cursors: CursorPosition[];
  currentUserId?: string;
}

const CursorOverlay: React.FC<CursorOverlayProps> = ({ cursors, currentUserId }) => {
  // Generate a consistent color for each user based on their ID
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
    <div className="fixed inset-0 pointer-events-none z-50">
      {cursors
        .filter(cursor => cursor.userId !== currentUserId)
        .map((cursor) => (
          <div
            key={cursor.userId}
            className="absolute transition-all duration-100 ease-out"
            style={{
              left: cursor.x,
              top: cursor.y,
              transform: 'translate(-2px, -2px)',
            }}
          >
            {/* Cursor Arrow */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              className="drop-shadow-md"
            >
              <path
                d="M0 0l16 6-6 2-2 6z"
                fill={getUserColor(cursor.userId)}
                stroke="white"
                strokeWidth="1"
              />
            </svg>
            
            {/* Username Label */}
            <div
              className="absolute left-5 top-0 px-2 py-1 text-xs text-white rounded shadow-lg whitespace-nowrap"
              style={{ backgroundColor: getUserColor(cursor.userId) }}
            >
              {cursor.username}
            </div>
          </div>
        ))}
    </div>
  );
};

export default CursorOverlay;