'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { loadingSpinner, loadingDots, loadingPulse } from '@/lib/animations';

// Spinner Loading Component
export const LoadingSpinner: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  cultural?: boolean;
  culturalType?: 'japanese' | 'scandinavian' | 'italian' | 'french';
}> = ({ size = 'md', color, cultural = false, culturalType }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3'
  };

  const culturalColors = {
    japanese: 'border-gray-800 border-t-transparent',
    scandinavian: 'border-blue-600 border-t-transparent',
    italian: 'border-red-600 border-t-transparent',
    french: 'border-purple-600 border-t-transparent'
  };

  const colorClass = cultural && culturalType 
    ? culturalColors[culturalType]
    : color || 'border-blue-600 border-t-transparent';

  return (
    <motion.div
      className={`${sizeClasses[size]} ${colorClass} rounded-full`}
      variants={loadingSpinner}
      animate="animate"
    />
  );
};

// Dots Loading Component
export const LoadingDots: React.FC<{
  cultural?: boolean;
  culturalType?: 'japanese' | 'scandinavian' | 'italian' | 'french';
}> = ({ cultural = false, culturalType }) => {
  const culturalColors = {
    japanese: 'bg-gray-800',
    scandinavian: 'bg-blue-600',
    italian: 'bg-red-600',
    french: 'bg-purple-600'
  };

  const colorClass = cultural && culturalType 
    ? culturalColors[culturalType]
    : 'bg-blue-600';

  return (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={`w-2 h-2 rounded-full ${colorClass}`}
          variants={loadingDots}
          animate="animate"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  );
};

// Pulse Loading Component
export const LoadingPulse: React.FC<{
  children: React.ReactNode;
  cultural?: boolean;
  culturalType?: 'japanese' | 'scandinavian' | 'italian' | 'french';
}> = ({ children, cultural = false, culturalType }) => {
  const culturalClasses = {
    japanese: 'ring-gray-800/20',
    scandinavian: 'ring-blue-600/20',
    italian: 'ring-red-600/20',
    french: 'ring-purple-600/20'
  };

  const ringClass = cultural && culturalType 
    ? culturalClasses[culturalType]
    : 'ring-blue-600/20';

  return (
    <motion.div
      className={`ring-4 ${ringClass} rounded-full`}
      variants={loadingPulse}
      animate="animate"
    >
      {children}
    </motion.div>
  );
};

// Skeleton Loading Component
export const LoadingSkeleton: React.FC<{
  width?: string;
  height?: string;
  className?: string;
  lines?: number;
}> = ({ width = '100%', height = '20px', className = '', lines = 1 }) => {
  const skeletonLines = Array.from({ length: lines }, (_, i) => (
    <div
      key={i}
      className={`loading-skeleton rounded ${className}`}
      style={{
        width: i === lines - 1 ? '75%' : width,
        height,
        marginBottom: lines > 1 ? '8px' : '0'
      }}
    />
  ));

  return <div className="space-y-2">{skeletonLines}</div>;
};

// AI Generation Loading Component
export const AIGenerationLoading: React.FC<{
  stage?: 'analyzing' | 'generating' | 'finalizing';
  cultural?: boolean;
  culturalType?: 'japanese' | 'scandinavian' | 'italian' | 'french';
}> = ({ stage = 'analyzing', cultural = false, culturalType }) => {
  const stages = {
    analyzing: {
      title: 'Analyzing Your Space',
      description: 'Understanding your space dimensions and lighting...',
      progress: 33
    },
    generating: {
      title: 'Generating Cultural Design',
      description: 'Creating authentic cultural elements...',
      progress: 66
    },
    finalizing: {
      title: 'Finalizing Your Design',
      description: 'Adding finishing touches and details...',
      progress: 90
    }
  };

  const currentStage = stages[stage];
  const culturalColors = {
    japanese: 'from-gray-800 to-gray-900',
    scandinavian: 'from-blue-600 to-blue-700',
    italian: 'from-red-600 to-red-700',
    french: 'from-purple-600 to-purple-700'
  };

  const gradientClass = cultural && culturalType 
    ? culturalColors[culturalType]
    : 'from-blue-600 to-blue-700';

  return (
    <div className="text-center space-y-6">
      {/* Animated Logo */}
      <motion.div
        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradientClass} mx-auto flex items-center justify-center`}
        variants={loadingPulse}
        animate="animate"
      >
        <span className="text-white text-2xl">✨</span>
      </motion.div>

      {/* Title and Description */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {currentStage.title}
        </h3>
        <p className="text-gray-600">{currentStage.description}</p>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-md mx-auto">
        <div className="bg-gray-200 rounded-full h-2">
          <motion.div
            className={`h-2 rounded-full bg-gradient-to-r ${gradientClass}`}
            initial={{ width: '0%' }}
            animate={{ width: `${currentStage.progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">{currentStage.progress}% complete</p>
      </div>

      {/* Loading Animation */}
      <LoadingDots cultural={cultural} culturalType={culturalType} />
    </div>
  );
};

// File Upload Loading Component
export const FileUploadLoading: React.FC<{
  progress: number;
  fileName: string;
  cultural?: boolean;
  culturalType?: 'japanese' | 'scandinavian' | 'italian' | 'french';
}> = ({ progress, fileName, cultural = false, culturalType }) => {
  const culturalColors = {
    japanese: 'from-gray-800 to-gray-900',
    scandinavian: 'from-blue-600 to-blue-700',
    italian: 'from-red-600 to-red-700',
    french: 'from-purple-600 to-purple-700'
  };

  const gradientClass = cultural && culturalType 
    ? culturalColors[culturalType]
    : 'from-blue-600 to-blue-700';

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center space-x-4">
        {/* File Icon */}
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${gradientClass} flex items-center justify-center`}>
          <span className="text-white text-xl">📁</span>
        </div>

        {/* File Info */}
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 truncate">{fileName}</h4>
          <div className="mt-2">
            <div className="bg-gray-200 rounded-full h-2">
              <motion.div
                className={`h-2 rounded-full bg-gradient-to-r ${gradientClass}`}
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">{progress}% uploaded</p>
          </div>
        </div>

        {/* Loading Spinner */}
        <LoadingSpinner cultural={cultural} culturalType={culturalType} />
      </div>
    </div>
  );
};

// Form Submission Loading Component
export const FormSubmissionLoading: React.FC<{
  message?: string;
  cultural?: boolean;
  culturalType?: 'japanese' | 'scandinavian' | 'italian' | 'french';
}> = ({ message = 'Processing your request...', cultural = false, culturalType }) => {
  return (
    <div className="flex items-center justify-center space-x-3 p-4">
      <LoadingSpinner cultural={cultural} culturalType={culturalType} />
      <span className="text-gray-600">{message}</span>
    </div>
  );
};

// Gallery Loading Component
export const GalleryLoading: React.FC<{
  items?: number;
  cultural?: boolean;
  culturalType?: 'japanese' | 'scandinavian' | 'italian' | 'french';
}> = ({ items = 6, cultural = false, culturalType }) => {
  const culturalBorders = {
    japanese: 'border-gray-800/20',
    scandinavian: 'border-blue-600/20',
    italian: 'border-red-600/20',
    french: 'border-purple-600/20'
  };

  const borderClass = cultural && culturalType 
    ? culturalBorders[culturalType]
    : 'border-blue-600/20';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: items }, (_, i) => (
        <motion.div
          key={i}
          className={`bg-white rounded-2xl p-6 shadow-lg border-2 ${borderClass}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <LoadingSkeleton height="200px" className="mb-4" />
          <LoadingSkeleton height="16px" width="60%" className="mb-2" />
          <LoadingSkeleton height="14px" lines={2} />
        </motion.div>
      ))}
    </div>
  );
};

export default {
  LoadingSpinner,
  LoadingDots,
  LoadingPulse,
  LoadingSkeleton,
  AIGenerationLoading,
  FileUploadLoading,
  FormSubmissionLoading,
  GalleryLoading
};