'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { modalOverlay, modalContent as modalContentVariants } from '@/lib/animations';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  cultural?: boolean;
  culturalType?: 'japanese' | 'scandinavian' | 'italian' | 'french';
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  cultural = false,
  culturalType
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-6xl'
  };

  const culturalStyles = {
    japanese: 'border-t-4 border-gray-800',
    scandinavian: 'border-t-4 border-blue-600',
    italian: 'border-t-4 border-red-600',
    french: 'border-t-4 border-purple-600'
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose, closeOnEscape]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalOverlay}
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={handleOverlayClick}
          />
          
          {/* Modal Content */}
          <motion.div
            ref={modalRef}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalContentVariants}
            className={`relative bg-white rounded-2xl shadow-2xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden ${
              cultural && culturalType ? culturalStyles[culturalType] : ''
            }`}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                {title && (
                  <h2 className="text-xl font-display font-semibold text-gray-900">
                    {title}
                  </h2>
                )}
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}
            
            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
};

// Design Detail Modal - specialized for design showcase
export const DesignDetailModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  design: {
    title: string;
    description: string;
    culturalType: 'japanese' | 'scandinavian' | 'italian' | 'french';
    images: string[];
    culturalPrinciples: string[];
    colors: string[];
    budget: string;
    likes: number;
  };
}> = ({ isOpen, onClose, design }) => {
  const culturalFlags = {
    japanese: '🇯🇵',
    scandinavian: '🇸🇪',
    italian: '🇮🇹',
    french: '🇫🇷'
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      cultural
      culturalType={design.culturalType}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{culturalFlags[design.culturalType]}</span>
          <div>
            <h3 className="text-2xl font-display font-bold text-gray-900">
              {design.title}
            </h3>
            <p className="text-gray-600 capitalize">{design.culturalType} inspired design</p>
          </div>
        </div>

        {/* Description */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Description</h4>
          <p className="text-gray-700 leading-relaxed">{design.description}</p>
        </div>

        {/* Cultural Principles */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Cultural Principles</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {design.culturalPrinciples.map((principle, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3">
                <span className="text-sm font-medium text-gray-800">{principle}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Color Palette */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Color Palette</h4>
          <div className="flex space-x-2">
            {design.colors.map((color, index) => (
              <div
                key={index}
                className="w-12 h-12 rounded-lg border-2 border-gray-200 shadow-sm"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          <div>
            <h5 className="text-sm font-medium text-gray-500 mb-1">Budget Tier</h5>
            <p className="text-lg font-semibold text-gray-900">{design.budget}</p>
          </div>
          <div>
            <h5 className="text-sm font-medium text-gray-500 mb-1">Likes</h5>
            <p className="text-lg font-semibold text-gray-900">{design.likes}</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

// Cultural Information Modal - for educational content
export const CulturalInfoModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  culturalInfo: {
    name: string;
    description: string;
    principles: Array<{
      name: string;
      explanation: string;
      examples: string[];
    }>;
    culturalType: 'japanese' | 'scandinavian' | 'italian' | 'french';
  };
}> = ({ isOpen, onClose, culturalInfo }) => {
  const culturalFlags = {
    japanese: '🇯🇵',
    scandinavian: '🇸🇪',
    italian: '🇮🇹',
    french: '🇫🇷'
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      cultural
      culturalType={culturalInfo.culturalType}
      title={`${culturalFlags[culturalInfo.culturalType]} ${culturalInfo.name}`}
    >
      <div className="space-y-6">
        <p className="text-lg text-gray-700 leading-relaxed">
          {culturalInfo.description}
        </p>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900">Cultural Principles</h4>
          {culturalInfo.principles.map((principle, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-4">
              <h5 className="font-semibold text-gray-900 mb-2">{principle.name}</h5>
              <p className="text-gray-700 mb-3">{principle.explanation}</p>
              <div className="space-y-2">
                <h6 className="text-sm font-medium text-gray-600">Examples:</h6>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {principle.examples.map((example, exampleIndex) => (
                    <li key={exampleIndex} className="text-sm text-gray-600 flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                      {example}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default Modal;