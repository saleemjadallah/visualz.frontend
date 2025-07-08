'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/lib/hooks/useScrollAnimation';
import { scrollFadeIn, scrollSlideIn, scrollScaleIn, staggerContainer, staggerItem } from '@/lib/animations';

interface ScrollAnimationWrapperProps {
  children: React.ReactNode;
  animation?: 'fadeIn' | 'slideIn' | 'scaleIn' | 'stagger';
  delay?: number;
  threshold?: number;
  className?: string;
}

const ScrollAnimationWrapper: React.FC<ScrollAnimationWrapperProps> = ({
  children,
  animation = 'fadeIn',
  delay = 0,
  threshold = 0.1,
  className = ''
}) => {
  const { ref, controls } = useScrollAnimation(threshold);

  const animationVariants = {
    fadeIn: scrollFadeIn,
    slideIn: scrollSlideIn,
    scaleIn: scrollScaleIn,
    stagger: staggerContainer
  };

  const selectedVariant = animationVariants[animation];

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={selectedVariant}
      transition={{ delay }}
      className={className}
    >
      {animation === 'stagger' 
        ? React.Children.map(children, (child, index) => (
            <motion.div key={index} variants={staggerItem}>
              {child}
            </motion.div>
          ))
        : children
      }
    </motion.div>
  );
};

export default ScrollAnimationWrapper;