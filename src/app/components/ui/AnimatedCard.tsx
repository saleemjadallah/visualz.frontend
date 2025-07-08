'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cardHover, cardTap } from '@/lib/animations';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  cultural?: boolean;
  culturalType?: 'japanese' | 'scandinavian' | 'italian' | 'french';
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = true,
  cultural = false,
  culturalType
}) => {
  const baseClasses = 'bg-white rounded-2xl border border-gray-100 shadow-lg transition-all duration-300';
  
  const culturalStyles = {
    japanese: 'border-l-4 border-gray-800 bg-gradient-to-br from-white to-gray-50',
    scandinavian: 'border-l-4 border-blue-600 bg-gradient-to-br from-white to-blue-50',
    italian: 'border-l-4 border-red-600 bg-gradient-to-br from-white to-red-50',
    french: 'border-l-4 border-purple-600 bg-gradient-to-br from-white to-purple-50'
  };

  const cardClasses = `${baseClasses} ${
    cultural && culturalType ? culturalStyles[culturalType] : ''
  } ${className}`;

  if (onClick) {
    return (
      <motion.div
        whileHover={hoverable ? "hover" : undefined}
        variants={cardHover}
        whileTap={cardTap}
        className={`${cardClasses} cursor-pointer`}
        onClick={onClick}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={hoverable ? "hover" : undefined}
      variants={cardHover}
      className={cardClasses}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;