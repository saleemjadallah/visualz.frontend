'use client';

import React from 'react';

interface SkeletonLoaderProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  variant?: 'rectangular' | 'circular' | 'text';
  animation?: 'pulse' | 'wave' | 'none';
  count?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  className = '',
  width = '100%',
  height = '1rem',
  variant = 'rectangular',
  animation = 'pulse',
  count = 1,
}) => {
  const baseClasses = 'bg-cultural-soft';
  
  const variantClasses = {
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
    text: 'rounded-md',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-pulse',
    none: '',
  };

  const skeletonStyle = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  if (count > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
            style={skeletonStyle}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={skeletonStyle}
    />
  );
};

interface CardSkeletonProps {
  showImage?: boolean;
  showAvatar?: boolean;
  showButton?: boolean;
  className?: string;
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({
  showImage = true,
  showAvatar = false,
  showButton = false,
  className = '',
}) => {
  return (
    <div className={`card-cultural p-6 space-y-4 ${className}`}>
      {showImage && (
        <SkeletonLoader
          height="200px"
          className="w-full"
          variant="rectangular"
        />
      )}
      
      <div className="space-y-3">
        {showAvatar && (
          <div className="flex items-center space-x-3">
            <SkeletonLoader
              width="40px"
              height="40px"
              variant="circular"
            />
            <div className="flex-1">
              <SkeletonLoader width="60%" height="1rem" />
            </div>
          </div>
        )}
        
        <SkeletonLoader width="80%" height="1.5rem" />
        <SkeletonLoader width="100%" height="1rem" />
        <SkeletonLoader width="60%" height="1rem" />
        
        {showButton && (
          <div className="pt-2">
            <SkeletonLoader width="120px" height="40px" />
          </div>
        )}
      </div>
    </div>
  );
};

interface FormSkeletonProps {
  fields?: number;
  showButton?: boolean;
  className?: string;
}

export const FormSkeleton: React.FC<FormSkeletonProps> = ({
  fields = 5,
  showButton = true,
  className = '',
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {Array.from({ length: fields }).map((_, index) => (
        <div key={index} className="space-y-2">
          <SkeletonLoader width="150px" height="1rem" />
          <SkeletonLoader width="100%" height="48px" />
        </div>
      ))}
      
      {showButton && (
        <div className="pt-4">
          <SkeletonLoader width="200px" height="48px" />
        </div>
      )}
    </div>
  );
};

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
  className?: string;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  columns = 4,
  showHeader = true,
  className = '',
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {showHeader && (
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, index) => (
            <SkeletonLoader key={index} width="100%" height="1.5rem" />
          ))}
        </div>
      )}
      
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <SkeletonLoader key={colIndex} width="100%" height="1rem" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

interface NavigationSkeletonProps {
  items?: number;
  showLogo?: boolean;
  className?: string;
}

export const NavigationSkeleton: React.FC<NavigationSkeletonProps> = ({
  items = 4,
  showLogo = true,
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-between p-4 ${className}`}>
      {showLogo && (
        <div className="flex items-center space-x-3">
          <SkeletonLoader width="48px" height="48px" variant="circular" />
          <div>
            <SkeletonLoader width="120px" height="1.5rem" />
            <SkeletonLoader width="80px" height="1rem" />
          </div>
        </div>
      )}
      
      <div className="flex items-center space-x-6">
        {Array.from({ length: items }).map((_, index) => (
          <SkeletonLoader key={index} width="80px" height="1.5rem" />
        ))}
      </div>
      
      <div className="flex items-center space-x-3">
        <SkeletonLoader width="100px" height="40px" />
        <SkeletonLoader width="120px" height="40px" />
      </div>
    </div>
  );
};

interface GallerySkeletonProps {
  items?: number;
  columns?: number;
  showFilters?: boolean;
  className?: string;
}

export const GallerySkeleton: React.FC<GallerySkeletonProps> = ({
  items = 12,
  columns = 3,
  showFilters = true,
  className = '',
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {showFilters && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <SkeletonLoader width="200px" height="40px" />
            <SkeletonLoader width="120px" height="40px" />
            <SkeletonLoader width="120px" height="40px" />
          </div>
          <SkeletonLoader width="150px" height="40px" />
        </div>
      )}
      
      <div className={`grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns}`}>
        {Array.from({ length: items }).map((_, index) => (
          <div key={index} className="space-y-4">
            <SkeletonLoader height="200px" variant="rectangular" />
            <div className="space-y-2">
              <SkeletonLoader width="80%" height="1.5rem" />
              <SkeletonLoader width="60%" height="1rem" />
              <div className="flex items-center justify-between">
                <SkeletonLoader width="40%" height="1rem" />
                <SkeletonLoader width="60px" height="30px" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface CulturalSkeletonProps {
  variant?: 'card' | 'list' | 'hero' | 'form';
  culturalTheme?: boolean;
  className?: string;
}

export const CulturalSkeleton: React.FC<CulturalSkeletonProps> = ({
  variant = 'card',
  culturalTheme = true,
  className = '',
}) => {
  const baseClass = culturalTheme ? 'bg-cultural-soft' : 'bg-gray-200';
  
  switch (variant) {
    case 'hero':
      return (
        <div className={`space-y-8 text-center ${className}`}>
          <div className="space-y-4">
            <SkeletonLoader width="60%" height="3rem" className="mx-auto" />
            <SkeletonLoader width="80%" height="1.5rem" className="mx-auto" />
            <SkeletonLoader width="40%" height="1rem" className="mx-auto" />
          </div>
          <div className="flex justify-center space-x-4">
            <SkeletonLoader width="150px" height="48px" />
            <SkeletonLoader width="150px" height="48px" />
          </div>
        </div>
      );
      
    case 'form':
      return (
        <div className={`space-y-6 ${className}`}>
          <div className="text-center space-y-2">
            <SkeletonLoader width="50%" height="2rem" className="mx-auto" />
            <SkeletonLoader width="70%" height="1rem" className="mx-auto" />
          </div>
          <FormSkeleton fields={4} />
        </div>
      );
      
    case 'list':
      return (
        <div className={`space-y-4 ${className}`}>
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
              <SkeletonLoader width="60px" height="60px" variant="circular" />
              <div className="flex-1 space-y-2">
                <SkeletonLoader width="70%" height="1.5rem" />
                <SkeletonLoader width="50%" height="1rem" />
              </div>
              <SkeletonLoader width="80px" height="32px" />
            </div>
          ))}
        </div>
      );
      
    default:
      return (
        <CardSkeleton
          showImage
          showAvatar
          showButton
          className={className}
        />
      );
  }
};

export default SkeletonLoader;