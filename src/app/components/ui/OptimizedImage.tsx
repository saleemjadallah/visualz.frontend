'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ImageIcon, AlertTriangle } from 'lucide-react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  onLoad?: () => void;
  onError?: () => void;
  lazy?: boolean;
  responsive?: boolean;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  fallbackSrc?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  fill = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false,
  quality = 80,
  placeholder = 'empty',
  blurDataURL,
  className = '',
  style = {},
  onClick,
  onLoad,
  onError,
  lazy = true,
  responsive = true,
  objectFit = 'cover',
  fallbackSrc,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const [isInView, setIsInView] = useState(!lazy || priority);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    const element = document.getElementById(`img-${src}`);
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [lazy, priority, src]);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    
    // Try fallback image
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(false);
      setIsLoading(true);
      return;
    }
    
    onError?.();
  };

  // Generate responsive sizes based on breakpoints
  const generateResponsiveSizes = () => {
    if (!responsive) return sizes;
    
    return `
      (max-width: 475px) 100vw,
      (max-width: 640px) 100vw,
      (max-width: 768px) 50vw,
      (max-width: 1024px) 33vw,
      (max-width: 1280px) 25vw,
      20vw
    `;
  };

  // Generate blur data URL for better loading experience
  const generateBlurDataURL = () => {
    if (blurDataURL) return blurDataURL;
    
    // Simple base64 blur placeholder
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:var(--cultural-soft);stop-opacity:1" />
            <stop offset="100%" style="stop-color:var(--cultural-neutral);stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill="url(#grad)" />
      </svg>
    `)}`;
  };

  if (!isInView) {
    return (
      <div
        id={`img-${src}`}
        className={`flex items-center justify-center bg-cultural-soft ${className}`}
        style={{
          width: width || '100%',
          height: height || '200px',
          ...style,
        }}
      >
        <div className="animate-pulse">
          <ImageIcon className="w-8 h-8 text-cultural-secondary" />
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-cultural-soft ${className}`}
        style={{
          width: width || '100%',
          height: height || '200px',
          ...style,
        }}
      >
        <div className="text-center text-cultural-secondary">
          <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
          <p className="text-sm">Image failed to load</p>
        </div>
      </div>
    );
  }

  const imageProps = {
    src: currentSrc,
    alt,
    quality,
    priority,
    sizes: generateResponsiveSizes(),
    className: `transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className}`,
    style: {
      objectFit,
      ...style,
    },
    onClick,
    onLoad: handleLoad,
    onError: handleError,
    ...(placeholder === 'blur' && {
      placeholder: 'blur' as const,
      blurDataURL: generateBlurDataURL(),
    }),
  };

  return (
    <div className="relative overflow-hidden">
      {fill ? (
        <Image
          fill
          {...imageProps}
        />
      ) : (
        <Image
          width={width || 400}
          height={height || 300}
          {...imageProps}
        />
      )}
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-cultural-soft">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cultural-accent"></div>
        </div>
      )}
    </div>
  );
};

interface CulturalImageProps extends OptimizedImageProps {
  culturalContext?: string;
  showCulturalBadge?: boolean;
}

export const CulturalImage: React.FC<CulturalImageProps> = ({
  culturalContext,
  showCulturalBadge = false,
  ...props
}) => {
  return (
    <div className="relative">
      <OptimizedImage {...props} />
      
      {showCulturalBadge && culturalContext && (
        <div className="absolute top-2 right-2 px-2 py-1 bg-cultural-accent text-cultural-text text-xs rounded-full">
          {culturalContext}
        </div>
      )}
    </div>
  );
};

interface LazyImageGalleryProps {
  images: Array<{
    src: string;
    alt: string;
    width?: number;
    height?: number;
    culturalContext?: string;
  }>;
  className?: string;
  onImageClick?: (index: number) => void;
}

export const LazyImageGallery: React.FC<LazyImageGalleryProps> = ({
  images,
  className = '',
  onImageClick,
}) => {
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => new Set(prev).add(index));
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {images.map((image, index) => (
        <div
          key={index}
          className="aspect-square cursor-pointer rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          onClick={() => onImageClick?.(index)}
        >
          <OptimizedImage
            src={image.src}
            alt={image.alt}
            width={image.width || 400}
            height={image.height || 400}
            className="w-full h-full"
            objectFit="cover"
            lazy={index > 6} // Load first 6 images immediately
            onLoad={() => handleImageLoad(index)}
            placeholder="blur"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      ))}
    </div>
  );
};

interface ProgressiveImageProps extends OptimizedImageProps {
  lowQualitySrc?: string;
  highQualitySrc: string;
}

export const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  lowQualitySrc,
  highQualitySrc,
  ...props
}) => {
  const [isHighQualityLoaded, setIsHighQualityLoaded] = useState(false);

  useEffect(() => {
    const img = new window.Image();
    img.onload = () => setIsHighQualityLoaded(true);
    img.src = highQualitySrc;
  }, [highQualitySrc]);

  return (
    <div className="relative">
      {lowQualitySrc && !isHighQualityLoaded && (
        <OptimizedImage
          {...props}
          src={lowQualitySrc}
          quality={20}
          className={`absolute inset-0 filter blur-sm ${props.className}`}
        />
      )}
      
      <OptimizedImage
        {...props}
        src={highQualitySrc}
        className={`transition-opacity duration-500 ${
          isHighQualityLoaded ? 'opacity-100' : 'opacity-0'
        } ${props.className}`}
      />
    </div>
  );
};

export default OptimizedImage;