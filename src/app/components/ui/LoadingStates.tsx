'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Wifi, WifiOff, AlertCircle, CheckCircle, Clock, ImageIcon, AlertTriangle } from 'lucide-react';
import { loadingSpinner, loadingDots, loadingPulse } from '@/lib/animations';
import { SkeletonLoader } from './SkeletonLoader';

// Enhanced Loading State with comprehensive error handling
interface LoadingStateProps {
  isLoading?: boolean;
  error?: string | null;
  retry?: () => void;
  children?: React.ReactNode;
  loadingText?: string;
  emptyState?: React.ReactNode;
  skeleton?: boolean;
  culturalTheme?: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  isLoading = false,
  error = null,
  retry,
  children,
  loadingText = 'Loading...',
  emptyState,
  skeleton = false,
  culturalTheme = true,
}) => {
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        {retry && (
          <button
            onClick={retry}
            className="btn-cultural"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  if (isLoading) {
    if (skeleton) {
      return <SkeletonLoader count={3} height="60px" className="mb-4" />;
    }

    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cultural-accent mb-4"></div>
        <p className="text-cultural-text">{loadingText}</p>
      </div>
    );
  }

  if (!children && emptyState) {
    return <>{emptyState}</>;
  }

  return <>{children}</>;
};

// Progressive Loading with multiple stages
interface ProgressiveLoadingProps {
  stages: Array<{
    key: string;
    label: string;
    duration?: number;
  }>;
  currentStage?: string;
  onComplete?: () => void;
}

export const ProgressiveLoading: React.FC<ProgressiveLoadingProps> = ({
  stages,
  currentStage = '',
  onComplete,
}) => {
  const [completedStages, setCompletedStages] = useState<Set<string>>(new Set());
  const [activeStage, setActiveStage] = useState<string>(stages[0]?.key || '');

  useEffect(() => {
    if (currentStage) {
      setActiveStage(currentStage);
    }
  }, [currentStage]);

  useEffect(() => {
    const currentIndex = stages.findIndex(stage => stage.key === activeStage);
    if (currentIndex !== -1) {
      // Mark previous stages as completed
      const previousStages = stages.slice(0, currentIndex).map(stage => stage.key);
      setCompletedStages(new Set(previousStages));
    }

    // Check if all stages are completed
    if (currentIndex === stages.length - 1) {
      setTimeout(() => {
        setCompletedStages(new Set(stages.map(stage => stage.key)));
        onComplete?.();
      }, 1000);
    }
  }, [activeStage, stages, onComplete]);

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="space-y-4">
        {stages.map((stage, index) => {
          const isCompleted = completedStages.has(stage.key);
          const isActive = activeStage === stage.key;
          const isPending = !isCompleted && !isActive;

          return (
            <div key={stage.key} className="flex items-center space-x-3">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center
                ${isCompleted ? 'bg-green-500' : isActive ? 'bg-cultural-accent' : 'bg-gray-300'}
              `}>
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5 text-white" />
                ) : isActive ? (
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                ) : (
                  <Clock className="w-5 h-5 text-gray-500" />
                )}
              </div>
              
              <div className="flex-1">
                <p className={`
                  text-sm font-medium
                  ${isCompleted ? 'text-green-600' : isActive ? 'text-cultural-accent' : 'text-gray-500'}
                `}>
                  {stage.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Network Status Monitor
interface NetworkStatusProps {
  onRetry?: () => void;
}

export const NetworkStatus: React.FC<NetworkStatusProps> = ({ onRetry }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        setWasOffline(false);
        onRetry?.();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [wasOffline, onRetry]);

  if (isOnline) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
      <div className="flex items-center space-x-2">
        <WifiOff className="w-4 h-4" />
        <span className="text-sm font-medium">You're offline</span>
      </div>
    </div>
  );
};

// Lazy Component Loading
interface LazyComponentProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
}

export const LazyComponent: React.FC<LazyComponentProps> = ({
  children,
  fallback = <SkeletonLoader height="200px" />,
  threshold = 0.1,
  rootMargin = '50px',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(ref);

    return () => observer.disconnect();
  }, [ref, threshold, rootMargin]);

  return (
    <div ref={setRef}>
      {isVisible ? children : fallback}
    </div>
  );
};

// Infinite Scroll with loading
interface InfiniteScrollProps {
  children: React.ReactNode;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  threshold?: number;
}

export const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  children,
  onLoadMore,
  hasMore,
  isLoading,
  threshold = 0.8,
}) => {
  const [triggerRef, setTriggerRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!triggerRef || !hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onLoadMore();
        }
      },
      { threshold }
    );

    observer.observe(triggerRef);

    return () => observer.disconnect();
  }, [triggerRef, hasMore, isLoading, onLoadMore, threshold]);

  return (
    <div>
      {children}
      
      {hasMore && (
        <div ref={setTriggerRef} className="py-8 text-center">
          {isLoading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-cultural-accent mr-2" />
              <span className="text-cultural-text">Loading more...</span>
            </div>
          ) : (
            <button
              onClick={onLoadMore}
              className="btn-cultural-secondary"
            >
              Load More
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// Loading Overlay
interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  progress?: number;
  culturalTheme?: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  message = 'Loading...',
  progress,
  culturalTheme = true,
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`
        bg-white rounded-lg p-8 max-w-sm w-full mx-4 text-center
        ${culturalTheme ? 'bg-cultural-neutral border-cultural-secondary' : ''}
      `}>
        <div className="mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cultural-accent mx-auto"></div>
        </div>
        
        <h3 className={`text-lg font-semibold mb-2 ${culturalTheme ? 'text-cultural-text' : 'text-gray-900'}`}>
          {message}
        </h3>
        
        {progress !== undefined && (
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className="bg-cultural-accent h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
        
        {progress !== undefined && (
          <p className={`text-sm ${culturalTheme ? 'text-cultural-secondary' : 'text-gray-600'}`}>
            {Math.round(progress)}% complete
          </p>
        )}
      </div>
    </div>
  );
};

// Empty State Component
interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  culturalTheme?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  culturalTheme = true,
}) => {
  return (
    <div className="text-center py-12 px-4">
      <div className={`
        w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4
        ${culturalTheme ? 'bg-cultural-soft' : 'bg-gray-100'}
      `}>
        {icon || <Clock className="w-8 h-8 text-cultural-secondary" />}
      </div>
      
      <h3 className={`text-lg font-semibold mb-2 ${culturalTheme ? 'text-cultural-text' : 'text-gray-900'}`}>
        {title}
      </h3>
      
      <p className={`mb-6 ${culturalTheme ? 'text-cultural-secondary' : 'text-gray-600'}`}>
        {description}
      </p>
      
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="btn-cultural"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

// Original Spinner Loading Component
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
  LoadingState,
  ProgressiveLoading,
  NetworkStatus,
  LazyComponent,
  InfiniteScroll,
  LoadingOverlay,
  EmptyState,
  LoadingSpinner,
  LoadingDots,
  LoadingPulse,
  LoadingSkeleton,
  AIGenerationLoading,
  FileUploadLoading,
  FormSubmissionLoading,
  GalleryLoading
};