'use client';

import { lazy, Suspense } from 'react';
import { LoadingState, LoadingSpinner } from '../ui/LoadingStates';
import { SkeletonLoader } from '../ui/SkeletonLoader';

// Placeholder components for lazy loading demo
const PlaceholderComponent = ({ title }: { title: string }) => (
  <div className="h-64 bg-cultural-soft rounded-lg flex items-center justify-center">
    <p className="text-cultural-text">{title}</p>
  </div>
);

// Lazy load heavy components to reduce initial bundle size (using placeholders for demo)
const LazyThreeVisualization = lazy(() => Promise.resolve({ default: () => <PlaceholderComponent title="3D Visualization Component" /> }));
const LazyAIChat = lazy(() => Promise.resolve({ default: () => <PlaceholderComponent title="AI Chat Component" /> }));
const LazyDesignGallery = lazy(() => Promise.resolve({ default: () => <PlaceholderComponent title="Design Gallery Component" /> }));
const LazyEventRequirementsForm = lazy(() => Promise.resolve({ default: () => <PlaceholderComponent title="Event Requirements Form" /> }));
const LazyUploadZone = lazy(() => Promise.resolve({ default: () => <PlaceholderComponent title="Upload Zone Component" /> }));
const LazyResponsiveDesignDemo = lazy(() => Promise.resolve({ default: () => <PlaceholderComponent title="Responsive Design Demo" /> }));

// Loading fallbacks for different components
const ThreeVisualizationFallback = () => (
  <div className="w-full h-96 bg-cultural-soft rounded-lg flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cultural-accent mx-auto mb-4"></div>
      <p className="text-cultural-text">Loading 3D visualization...</p>
    </div>
  </div>
);

const FormFallback = () => (
  <div className="space-y-6 p-6">
    <SkeletonLoader height="48px" width="60%" />
    <SkeletonLoader height="120px" />
    <SkeletonLoader height="48px" width="40%" />
    <SkeletonLoader height="48px" width="200px" />
  </div>
);

const GalleryFallback = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="space-y-4">
        <SkeletonLoader height="200px" />
        <SkeletonLoader height="1.5rem" width="80%" />
        <SkeletonLoader height="1rem" width="60%" />
      </div>
    ))}
  </div>
);

const ChatFallback = () => (
  <div className="h-96 p-4 space-y-4">
    <SkeletonLoader height="40px" width="70%" />
    <SkeletonLoader height="40px" width="50%" />
    <SkeletonLoader height="40px" width="80%" />
    <SkeletonLoader height="48px" width="100%" />
  </div>
);

const UploadFallback = () => (
  <div className="border-2 border-dashed border-cultural-secondary rounded-lg p-8">
    <div className="text-center">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-cultural-text">Preparing upload area...</p>
    </div>
  </div>
);

// Lazy component wrappers with error boundaries
export const LazyThreeVisualizationWrapper = (props: any) => (
  <Suspense fallback={<ThreeVisualizationFallback />}>
    <LazyThreeVisualization {...props} />
  </Suspense>
);

export const LazyAIChatWrapper = (props: any) => (
  <Suspense fallback={<ChatFallback />}>
    <LazyAIChat {...props} />
  </Suspense>
);

export const LazyDesignGalleryWrapper = (props: any) => (
  <Suspense fallback={<GalleryFallback />}>
    <LazyDesignGallery {...props} />
  </Suspense>
);

export const LazyEventRequirementsFormWrapper = (props: any) => (
  <Suspense fallback={<FormFallback />}>
    <LazyEventRequirementsForm {...props} />
  </Suspense>
);

export const LazyUploadZoneWrapper = (props: any) => (
  <Suspense fallback={<UploadFallback />}>
    <LazyUploadZone {...props} />
  </Suspense>
);

export const LazyResponsiveDesignDemoWrapper = (props: any) => (
  <Suspense fallback={<LoadingState isLoading={true} loadingText="Loading responsive demo..." />}>
    <LazyResponsiveDesignDemo {...props} />
  </Suspense>
);

// Preload utilities for better user experience (demo structure)
export const preloadComponents = {
  threeVisualization: () => Promise.resolve({ default: () => <PlaceholderComponent title="3D Visualization" /> }),
  aiChat: () => Promise.resolve({ default: () => <PlaceholderComponent title="AI Chat" /> }),
  designGallery: () => Promise.resolve({ default: () => <PlaceholderComponent title="Design Gallery" /> }),
  eventForm: () => Promise.resolve({ default: () => <PlaceholderComponent title="Event Form" /> }),
  uploadZone: () => Promise.resolve({ default: () => <PlaceholderComponent title="Upload Zone" /> }),
  responsiveDemo: () => Promise.resolve({ default: () => <PlaceholderComponent title="Responsive Demo" /> }),
};

// Preload on user interaction
export const preloadOnHover = (componentName: keyof typeof preloadComponents) => {
  return {
    onMouseEnter: () => preloadComponents[componentName](),
    onFocus: () => preloadComponents[componentName](),
  };
};

// Route-based code splitting helpers (demo structure)
export const routeBasedComponents = {
  '/dashboard': () => Promise.resolve({ default: () => <PlaceholderComponent title="Dashboard Page" /> }),
  '/gallery': () => Promise.resolve({ default: () => <PlaceholderComponent title="Gallery Page" /> }),
  '/upload': () => Promise.resolve({ default: () => <PlaceholderComponent title="Upload Page" /> }),
  '/design': () => Promise.resolve({ default: () => <PlaceholderComponent title="Design Page" /> }),
};

// Bundle splitting configuration
export const bundleSplitConfig = {
  // Critical components (loaded immediately)
  critical: [
    'ThemeSelector',
    'CulturalValidation',
    'LoadingStates',
    'ErrorBoundary',
  ],
  
  // Important components (loaded on interaction)
  important: [
    'EventRequirementsForm',
    'DesignGallery',
    'UploadZone',
  ],
  
  // Heavy components (loaded on demand)
  heavy: [
    'ThreeVisualization',
    'AIChat',
    'ResponsiveDesignDemo',
  ],
  
  // Vendor libraries split
  vendors: {
    react: ['react', 'react-dom'],
    ui: ['framer-motion', 'lucide-react'],
    three: ['three', '@react-three/fiber', '@react-three/drei'],
    forms: ['react-hook-form'],
    state: ['zustand'],
    utils: ['clsx', 'tailwind-merge'],
  }
};

// Performance monitoring
export const performanceMonitor = {
  trackComponentLoad: (componentName: string) => {
    if (typeof window !== 'undefined' && window.performance) {
      const startTime = performance.now();
      return () => {
        const endTime = performance.now();
        console.log(`${componentName} loaded in ${endTime - startTime}ms`);
      };
    }
    return () => {};
  },
  
  trackBundleSize: (bundleName: string) => {
    if (typeof window !== 'undefined' && 'connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection) {
        console.log(`Loading ${bundleName} on ${connection.effectiveType} connection`);
      }
    }
  }
};

export default {
  LazyThreeVisualizationWrapper,
  LazyAIChatWrapper,
  LazyDesignGalleryWrapper,
  LazyEventRequirementsFormWrapper,
  LazyUploadZoneWrapper,
  LazyResponsiveDesignDemoWrapper,
  preloadComponents,
  preloadOnHover,
  routeBasedComponents,
  bundleSplitConfig,
  performanceMonitor,
};