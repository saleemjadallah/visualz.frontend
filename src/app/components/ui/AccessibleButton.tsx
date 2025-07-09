'use client';

import React, { forwardRef, useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { focusManagement, aria, touchAccessibility } from '@/lib/accessibility';

interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  cultural?: boolean;
  describedBy?: string;
  announcement?: string;
  onPress?: () => void;
}

export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    loadingText = 'Loading...',
    icon,
    iconPosition = 'left',
    fullWidth = false,
    cultural = false,
    describedBy,
    announcement,
    onPress,
    className = '',
    onClick,
    onKeyDown,
    disabled,
    ...props
  }, ref) => {
    const [isPressed, setIsPressed] = useState(false);
    const [announceText, setAnnounceText] = useState('');

    // Handle click with accessibility features
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || loading) return;
      
      setIsPressed(true);
      
      // Announce to screen readers if specified
      if (announcement) {
        setAnnounceText(announcement);
      }
      
      // Call custom onPress handler
      if (onPress) {
        onPress();
      }
      
      // Call original onClick
      if (onClick) {
        onClick(e);
      }
      
      // Reset pressed state
      setTimeout(() => setIsPressed(false), 150);
    };

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (disabled || loading) return;
      
      // Handle Enter and Space keys
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick(e as any);
      }
      
      // Call original onKeyDown
      if (onKeyDown) {
        onKeyDown(e);
      }
    };

    // Update ARIA pressed state
    useEffect(() => {
      if (ref && 'current' in ref && ref.current) {
        aria.setPressed(ref.current, isPressed);
      }
    }, [isPressed, ref]);

    // Ensure touch target size
    useEffect(() => {
      if (ref && 'current' in ref && ref.current) {
        if (!touchAccessibility.meetsTouchTarget(ref.current)) {
          touchAccessibility.addTouchTargetPadding(ref.current);
        }
      }
    }, [ref]);

    // Base classes
    const baseClasses = [
      'inline-flex items-center justify-center',
      'font-medium rounded-lg',
      'transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'touch-manipulation', // Prevent double-tap zoom on mobile
      fullWidth ? 'w-full' : '',
    ];

    // Variant classes
    const variantClasses = {
      primary: cultural 
        ? 'bg-cultural-accent text-white hover:bg-cultural-accent/90 focus:ring-cultural-accent/50'
        : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      secondary: cultural
        ? 'bg-cultural-secondary text-cultural-text hover:bg-cultural-secondary/90 focus:ring-cultural-secondary/50'
        : 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
      outline: cultural
        ? 'border-2 border-cultural-accent text-cultural-accent hover:bg-cultural-accent hover:text-white focus:ring-cultural-accent/50'
        : 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white focus:ring-blue-500',
      ghost: cultural
        ? 'text-cultural-accent hover:bg-cultural-accent/10 focus:ring-cultural-accent/50'
        : 'text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
    };

    // Size classes
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm min-h-[32px]',
      md: 'px-4 py-2 text-base min-h-[40px]',
      lg: 'px-6 py-3 text-lg min-h-[48px]',
    };

    // Pressed state classes
    const pressedClasses = isPressed ? 'scale-95' : '';

    // Combine all classes
    const buttonClasses = [
      ...baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      pressedClasses,
      className,
    ].filter(Boolean).join(' ');

    // ARIA attributes
    const ariaAttributes = {
      'aria-pressed': isPressed ? 'true' as const : 'false' as const,
      'aria-disabled': disabled || loading,
      'aria-describedby': describedBy,
      'aria-label': loading ? loadingText : undefined,
      'role': 'button' as const,
      'tabIndex': disabled ? -1 : 0,
    };

    return (
      <>
        <button
          ref={ref}
          className={buttonClasses}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          disabled={disabled || loading}
          {...ariaAttributes}
          {...props}
        >
          {/* Loading state */}
          {loading && (
            <Loader2 
              className="w-4 h-4 mr-2 animate-spin" 
              aria-hidden="true"
            />
          )}
          
          {/* Icon on left */}
          {icon && iconPosition === 'left' && !loading && (
            <span className="mr-2" aria-hidden="true">
              {icon}
            </span>
          )}
          
          {/* Button content */}
          <span>
            {loading ? loadingText : children}
          </span>
          
          {/* Icon on right */}
          {icon && iconPosition === 'right' && !loading && (
            <span className="ml-2" aria-hidden="true">
              {icon}
            </span>
          )}
        </button>

        {/* Screen reader announcements */}
        {announceText && (
          <div
            className="sr-only"
            aria-live="polite"
            aria-atomic="true"
            onAnimationEnd={() => setAnnounceText('')}
          >
            {announceText}
          </div>
        )}
      </>
    );
  }
);

AccessibleButton.displayName = 'AccessibleButton';

export default AccessibleButton;