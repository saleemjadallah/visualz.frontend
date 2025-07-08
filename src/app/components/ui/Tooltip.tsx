'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { tooltipVariants } from '@/lib/animations';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
  cultural?: boolean;
  culturalType?: 'japanese' | 'scandinavian' | 'italian' | 'french';
  maxWidth?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 0,
  className = '',
  cultural = false,
  culturalType,
  maxWidth = '200px'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const culturalStyles = {
    japanese: 'bg-gray-900 text-white border-gray-700',
    scandinavian: 'bg-blue-900 text-white border-blue-700',
    italian: 'bg-red-900 text-white border-red-700',
    french: 'bg-purple-900 text-white border-purple-700'
  };

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      calculatePosition();
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const calculatePosition = () => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    let x = 0;
    let y = 0;

    switch (position) {
      case 'top':
        x = rect.left + scrollX + rect.width / 2;
        y = rect.top + scrollY - 10;
        break;
      case 'bottom':
        x = rect.left + scrollX + rect.width / 2;
        y = rect.bottom + scrollY + 10;
        break;
      case 'left':
        x = rect.left + scrollX - 10;
        y = rect.top + scrollY + rect.height / 2;
        break;
      case 'right':
        x = rect.right + scrollX + 10;
        y = rect.top + scrollY + rect.height / 2;
        break;
    }

    setTooltipPosition({ x, y });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isVisible) {
        calculatePosition();
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isVisible]);

  const getTransformOrigin = () => {
    switch (position) {
      case 'top':
        return 'bottom center';
      case 'bottom':
        return 'top center';
      case 'left':
        return 'right center';
      case 'right':
        return 'left center';
      default:
        return 'bottom center';
    }
  };

  const getArrowStyles = () => {
    const baseClasses = 'absolute w-2 h-2 bg-gray-900 transform rotate-45';
    const culturalClasses = cultural && culturalType ? culturalStyles[culturalType].split(' ')[0] : 'bg-gray-900';
    
    switch (position) {
      case 'top':
        return `${baseClasses} ${culturalClasses} -bottom-1 left-1/2 transform -translate-x-1/2`;
      case 'bottom':
        return `${baseClasses} ${culturalClasses} -top-1 left-1/2 transform -translate-x-1/2`;
      case 'left':
        return `${baseClasses} ${culturalClasses} -right-1 top-1/2 transform -translate-y-1/2`;
      case 'right':
        return `${baseClasses} ${culturalClasses} -left-1 top-1/2 transform -translate-y-1/2`;
      default:
        return `${baseClasses} ${culturalClasses} -bottom-1 left-1/2 transform -translate-x-1/2`;
    }
  };

  const tooltipContent = (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={tooltipVariants}
          className={`fixed z-50 pointer-events-none ${
            position === 'left' || position === 'right' ? 'transform -translate-y-1/2' : ''
          } ${
            position === 'top' || position === 'bottom' ? 'transform -translate-x-1/2' : ''
          }`}
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            maxWidth,
            transformOrigin: getTransformOrigin()
          }}
        >
          <div className={`relative px-3 py-2 text-sm rounded-lg shadow-lg border ${
            cultural && culturalType 
              ? culturalStyles[culturalType]
              : 'bg-gray-900 text-white border-gray-700'
          } ${className}`}>
            {content}
            <div className={getArrowStyles()} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className="inline-block"
      >
        {children}
      </div>
      {typeof document !== 'undefined' && createPortal(tooltipContent, document.body)}
    </>
  );
};

// Cultural tooltip variants for specific use cases
export const CulturalTooltip: React.FC<{
  principle: string;
  explanation: string;
  culturalType: 'japanese' | 'scandinavian' | 'italian' | 'french';
  children: React.ReactNode;
}> = ({ principle, explanation, culturalType, children }) => {
  const culturalFlags = {
    japanese: '🇯🇵',
    scandinavian: '🇸🇪',
    italian: '🇮🇹',
    french: '🇫🇷'
  };

  return (
    <Tooltip
      cultural
      culturalType={culturalType}
      maxWidth="300px"
      content={
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-base">{culturalFlags[culturalType]}</span>
            <span className="font-semibold">{principle}</span>
          </div>
          <p className="text-sm leading-relaxed">{explanation}</p>
          <div className="text-xs opacity-75 pt-1 border-t border-gray-700">
            Cultural design principle
          </div>
        </div>
      }
    >
      {children}
    </Tooltip>
  );
};

export default Tooltip;