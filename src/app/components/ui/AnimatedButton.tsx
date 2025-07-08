'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { buttonHover, buttonTap } from '@/lib/animations';

interface AnimatedButtonProps {
  variant?: 'primary' | 'secondary' | 'cultural' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  isLoading?: boolean;
  icon?: React.ReactNode;
  culturalType?: 'japanese' | 'scandinavian' | 'italian' | 'french';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  isLoading = false,
  icon,
  culturalType,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 focus:ring-blue-500',
    secondary: 'bg-white text-gray-900 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 focus:ring-gray-500',
    cultural: getCulturalStyles(culturalType),
    ghost: 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500 shadow-none'
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  function getCulturalStyles(type?: string) {
    const culturalStyles = {
      japanese: 'bg-gradient-to-r from-gray-800 to-gray-900 text-white hover:from-gray-900 hover:to-black focus:ring-gray-700',
      scandinavian: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 focus:ring-blue-500',
      italian: 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 focus:ring-red-500',
      french: 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 focus:ring-purple-500'
    };
    
    return type ? culturalStyles[type as keyof typeof culturalStyles] : culturalStyles.japanese;
  }

  return (
    <motion.button
      whileHover={buttonHover}
      whileTap={buttonTap}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <motion.div
            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          Loading...
        </>
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </>
      )}
    </motion.button>
  );
};

export default AnimatedButton;