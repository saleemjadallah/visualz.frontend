'use client';

import React, { useRef, useState, useEffect } from 'react';

interface SwipeGestureProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  className?: string;
  disabled?: boolean;
}

interface TouchPoint {
  x: number;
  y: number;
  time: number;
}

export const SwipeGesture: React.FC<SwipeGestureProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 100,
  className = '',
  disabled = false,
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<TouchPoint | null>(null);
  const [isSwipeActive, setIsSwipeActive] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return;
    
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
    setIsSwipeActive(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (disabled || !touchStartRef.current) return;
    
    // Prevent scrolling during swipe
    e.preventDefault();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (disabled || !touchStartRef.current) return;
    
    const touch = e.changedTouches[0];
    const touchEnd = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };

    const deltaX = touchEnd.x - touchStartRef.current.x;
    const deltaY = touchEnd.y - touchStartRef.current.y;
    const deltaTime = touchEnd.time - touchStartRef.current.time;

    // Calculate swipe distance and speed
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const speed = distance / deltaTime;

    // Minimum speed to register as swipe (prevent accidental swipes)
    const minSpeed = 0.3;
    
    if (distance > threshold && speed > minSpeed) {
      // Determine swipe direction
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      if (absDeltaX > absDeltaY) {
        // Horizontal swipe
        if (deltaX > 0) {
          onSwipeRight?.();
        } else {
          onSwipeLeft?.();
        }
      } else {
        // Vertical swipe
        if (deltaY > 0) {
          onSwipeDown?.();
        } else {
          onSwipeUp?.();
        }
      }
    }

    touchStartRef.current = null;
    setIsSwipeActive(false);
  };

  return (
    <div
      ref={elementRef}
      className={`${className} ${isSwipeActive ? 'select-none' : ''}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        touchAction: disabled ? 'auto' : 'none',
        userSelect: isSwipeActive ? 'none' : 'auto',
      }}
    >
      {children}
    </div>
  );
};

interface SwipeableCarouselProps {
  items: React.ReactNode[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  className?: string;
  showIndicators?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export const SwipeableCarousel: React.FC<SwipeableCarouselProps> = ({
  items,
  currentIndex,
  onIndexChange,
  className = '',
  showIndicators = true,
  autoPlay = false,
  autoPlayInterval = 5000,
}) => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleSwipeLeft = () => {
    if (isTransitioning) return;
    const nextIndex = (currentIndex + 1) % items.length;
    onIndexChange(nextIndex);
  };

  const handleSwipeRight = () => {
    if (isTransitioning) return;
    const prevIndex = (currentIndex - 1 + items.length) % items.length;
    onIndexChange(prevIndex);
  };

  const handleIndicatorClick = (index: number) => {
    if (isTransitioning || index === currentIndex) return;
    onIndexChange(index);
  };

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      handleSwipeLeft();
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, currentIndex]);

  // Handle transition animation
  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  return (
    <div className={`relative ${className}`}>
      <SwipeGesture
        onSwipeLeft={handleSwipeLeft}
        onSwipeRight={handleSwipeRight}
        className="overflow-hidden"
      >
        <div 
          className="flex transition-transform duration-300 ease-out"
          style={{ 
            transform: `translateX(-${currentIndex * 100}%)`,
            width: `${items.length * 100}%`
          }}
        >
          {items.map((item, index) => (
            <div key={index} className="w-full flex-shrink-0">
              {item}
            </div>
          ))}
        </div>
      </SwipeGesture>

      {showIndicators && items.length > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => handleIndicatorClick(index)}
              className={`
                w-3 h-3 rounded-full transition-all duration-200
                ${index === currentIndex 
                  ? 'bg-cultural-accent scale-125' 
                  : 'bg-cultural-secondary hover:bg-cultural-accent opacity-50'
                }
                ios-optimized android-optimized
              `}
              style={{
                backgroundColor: index === currentIndex ? 'var(--cultural-accent)' : 'var(--cultural-secondary)',
                minWidth: '12px',
                minHeight: '12px',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface SwipeableListProps {
  items: Array<{
    id: string;
    content: React.ReactNode;
    actions?: Array<{
      label: string;
      color: string;
      onAction: () => void;
    }>;
  }>;
  className?: string;
}

export const SwipeableList: React.FC<SwipeableListProps> = ({
  items,
  className = '',
}) => {
  const [swipedItemId, setSwipedItemId] = useState<string | null>(null);

  const handleSwipeLeft = (itemId: string) => {
    setSwipedItemId(itemId);
  };

  const handleSwipeRight = () => {
    setSwipedItemId(null);
  };

  const handleActionClick = (action: () => void) => {
    action();
    setSwipedItemId(null);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((item) => (
        <div key={item.id} className="relative overflow-hidden bg-white rounded-lg shadow-sm">
          {/* Action buttons background */}
          {item.actions && (
            <div className="absolute inset-y-0 right-0 flex">
              {item.actions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleActionClick(action.onAction)}
                  className="px-6 py-4 text-white font-medium transition-all duration-200 ios-optimized android-optimized"
                  style={{ 
                    backgroundColor: action.color,
                    minWidth: '80px',
                  }}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}

          {/* Main content */}
          <SwipeGesture
            onSwipeLeft={() => handleSwipeLeft(item.id)}
            onSwipeRight={handleSwipeRight}
            className={`
              relative z-10 bg-white transition-transform duration-300 ease-out
              ${swipedItemId === item.id ? '-translate-x-32' : 'translate-x-0'}
            `}
          >
            <div className="p-4">
              {item.content}
            </div>
          </SwipeGesture>
        </div>
      ))}
    </div>
  );
};

export default SwipeGesture;