'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { culturalThemeTransition } from '@/lib/animations';

interface CulturalThemeTransitionProps {
  children: React.ReactNode;
  culturalType: 'japanese' | 'scandinavian' | 'italian' | 'french';
  className?: string;
}

const CulturalThemeTransition: React.FC<CulturalThemeTransitionProps> = ({
  children,
  culturalType,
  className = ''
}) => {
  const culturalBackgrounds = {
    japanese: 'bg-gradient-to-br from-gray-50 to-gray-100',
    scandinavian: 'bg-gradient-to-br from-blue-50 to-blue-100',
    italian: 'bg-gradient-to-br from-red-50 to-red-100',
    french: 'bg-gradient-to-br from-purple-50 to-purple-100'
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={culturalType}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={culturalThemeTransition}
        className={`${culturalBackgrounds[culturalType]} ${className}`}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default CulturalThemeTransition;