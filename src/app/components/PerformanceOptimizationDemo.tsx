'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Clock, Gauge, Monitor, Zap, AlertTriangle } from 'lucide-react';
import { performanceMonitor, webVitals, memoryMonitor, connectionMonitor, optimize } from '@/lib/performance';
import { OptimizedImage } from './ui/OptimizedImage';
import { LoadingState, ProgressiveLoading, NetworkStatus, LazyComponent, LoadingOverlay } from './ui/LoadingStates';
import { LazyThreeVisualizationWrapper, LazyDesignGalleryWrapper, preloadOnHover } from './lazy/LazyComponents';

const PerformanceOptimizationDemo: React.FC = () => {
  const [vitals, setVitals] = useState<any>(null);
  const [memory, setMemory] = useState<any>(null);
  const [connection, setConnection] = useState<any>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Initialize performance monitoring
  useEffect(() => {
    const updateMetrics = () => {
      setMetrics(performanceMonitor.getSummary());
      setMemory(memoryMonitor.getMemoryUsage());
      setConnection(connectionMonitor.getConnectionInfo());
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 5000);

    // Get web vitals
    webVitals.getAllVitals().then(setVitals);

    return () => clearInterval(interval);
  }, []);

  // Demonstrate progressive loading
  const loadingStages = [
    { key: 'init', label: 'Initializing application' },
    { key: 'assets', label: 'Loading assets' },
    { key: 'components', label: 'Loading components' },
    { key: 'data', label: 'Fetching data' },
    { key: 'render', label: 'Rendering interface' }
  ];

  const demoProgressiveLoading = () => {
    setShowOverlay(true);
    setLoadingProgress(0);
    
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setShowOverlay(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  // Demonstrate API performance measurement
  const demoApiMeasurement = async () => {
    try {
      const result = await performanceMonitor.measureAPI('demo-api', async () => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { success: true, data: 'Demo data' };
      });
      console.log('API Result:', result);
    } catch (error) {
      console.error('API Error:', error);
    }
  };

  // Demonstrate component performance measurement
  const demoComponentMeasurement = () => {
    const result = performanceMonitor.measureComponent('demo-component', () => {
      // Simulate heavy computation
      let sum = 0;
      for (let i = 0; i < 1000000; i++) {
        sum += i;
      }
      return sum;
    });
    console.log('Component Result:', result);
  };

  // Debounced search
  const debouncedSearch = optimize.debounce((query: string) => {
    console.log('Searching for:', query);
  }, 300);

  // Throttled scroll handler
  const throttledScroll = optimize.throttle(() => {
    console.log('Scroll event handled');
  }, 100);

  return (
    <div className="min-h-screen bg-cultural-bg p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-cultural-text">
            Performance Optimization Demo
          </h1>
          <p className="text-cultural-secondary text-lg">
            Showcasing comprehensive performance optimization techniques
          </p>
        </div>

        {/* Performance Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Web Vitals */}
          <div className="card-cultural p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-cultural-text">Web Vitals</h3>
              <Gauge className="w-5 h-5 text-cultural-accent" />
            </div>
            {vitals ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-cultural-secondary">LCP</span>
                  <span className="text-sm font-medium">{vitals.lcp.toFixed(2)}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-cultural-secondary">FID</span>
                  <span className="text-sm font-medium">{vitals.fid.toFixed(2)}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-cultural-secondary">CLS</span>
                  <span className="text-sm font-medium">{vitals.cls.toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-cultural-secondary">TTFB</span>
                  <span className="text-sm font-medium">{vitals.ttfb.toFixed(2)}ms</span>
                </div>
              </div>
            ) : (
              <LoadingState isLoading={true} loadingText="Measuring..." />
            )}
          </div>

          {/* Memory Usage */}
          <div className="card-cultural p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-cultural-text">Memory</h3>
              <Monitor className="w-5 h-5 text-cultural-accent" />
            </div>
            {memory ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-cultural-secondary">Used</span>
                  <span className="text-sm font-medium">{(memory.used / 1024 / 1024).toFixed(2)}MB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-cultural-secondary">Total</span>
                  <span className="text-sm font-medium">{(memory.total / 1024 / 1024).toFixed(2)}MB</span>
                </div>
                <div className="w-full bg-cultural-soft rounded-full h-2">
                  <div 
                    className="bg-cultural-accent h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(memory.used / memory.total) * 100}%` }}
                  />
                </div>
              </div>
            ) : (
              <p className="text-cultural-secondary text-sm">Not available</p>
            )}
          </div>

          {/* Connection Info */}
          <div className="card-cultural p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-cultural-text">Connection</h3>
              <Activity className="w-5 h-5 text-cultural-accent" />
            </div>
            {connection ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-cultural-secondary">Type</span>
                  <span className="text-sm font-medium">{connection.effectiveType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-cultural-secondary">Downlink</span>
                  <span className="text-sm font-medium">{connection.downlink}Mbps</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-cultural-secondary">RTT</span>
                  <span className="text-sm font-medium">{connection.rtt}ms</span>
                </div>
                {connection.saveData && (
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    <span className="text-sm text-orange-500">Save Data Mode</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-cultural-secondary text-sm">Not available</p>
            )}
          </div>

          {/* Performance Metrics */}
          <div className="card-cultural p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-cultural-text">Metrics</h3>
              <Clock className="w-5 h-5 text-cultural-accent" />
            </div>
            {metrics ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-cultural-secondary">Total</span>
                  <span className="text-sm font-medium">{metrics.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-cultural-secondary">Components</span>
                  <span className="text-sm font-medium">{metrics.byType.component || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-cultural-secondary">API Calls</span>
                  <span className="text-sm font-medium">{metrics.byType.api || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-cultural-secondary">Avg Render</span>
                  <span className="text-sm font-medium">
                    {metrics.averageDuration.component?.toFixed(2) || 0}ms
                  </span>
                </div>
              </div>
            ) : (
              <LoadingState isLoading={true} loadingText="Calculating..." />
            )}
          </div>
        </div>

        {/* Demo Controls */}
        <div className="card-cultural p-6">
          <h3 className="text-xl font-semibold text-cultural-text mb-4">Performance Demos</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={demoProgressiveLoading}
              className="btn-cultural"
            >
              <Zap className="w-4 h-4 mr-2" />
              Progressive Loading
            </button>
            <button
              onClick={demoApiMeasurement}
              className="btn-cultural"
            >
              <Activity className="w-4 h-4 mr-2" />
              API Measurement
            </button>
            <button
              onClick={demoComponentMeasurement}
              className="btn-cultural"
            >
              <Monitor className="w-4 h-4 mr-2" />
              Component Measurement
            </button>
          </div>
        </div>

        {/* Image Optimization Demo */}
        <div className="card-cultural p-6">
          <h3 className="text-xl font-semibold text-cultural-text mb-4">Image Optimization</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-cultural-text">Responsive Images</h4>
              <OptimizedImage
                src="https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6?w=400&h=300"
                alt="Responsive image demo"
                width={400}
                height={300}
                placeholder="blur"
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-cultural-text">Lazy Loading</h4>
              <OptimizedImage
                src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300"
                alt="Lazy loading demo"
                width={400}
                height={300}
                lazy={true}
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-cultural-text">Progressive Loading</h4>
              <OptimizedImage
                src="https://images.unsplash.com/photo-1464822759844-d150baec0494?w=400&h=300"
                alt="Progressive loading demo"
                width={400}
                height={300}
                priority={true}
                className="rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Lazy Component Demo */}
        <div className="card-cultural p-6">
          <h3 className="text-xl font-semibold text-cultural-text mb-4">Lazy Components</h3>
          <div className="space-y-4">
            <div {...preloadOnHover('designGallery')}>
              <h4 className="font-medium text-cultural-text">Design Gallery (Hover to Preload)</h4>
              <LazyComponent fallback={<div className="h-32 bg-cultural-soft rounded-lg animate-pulse" />}>
                <LazyDesignGalleryWrapper />
              </LazyComponent>
            </div>
            
            <div {...preloadOnHover('threeVisualization')}>
              <h4 className="font-medium text-cultural-text">3D Visualization (Hover to Preload)</h4>
              <LazyComponent fallback={<div className="h-64 bg-cultural-soft rounded-lg animate-pulse" />}>
                <LazyThreeVisualizationWrapper />
              </LazyComponent>
            </div>
          </div>
        </div>

        {/* Debounce/Throttle Demo */}
        <div className="card-cultural p-6">
          <h3 className="text-xl font-semibold text-cultural-text mb-4">Optimization Techniques</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-cultural-text font-medium mb-2">
                Debounced Search (300ms delay)
              </label>
              <input
                type="text"
                placeholder="Type to search..."
                onChange={(e) => debouncedSearch(e.target.value)}
                className="input-cultural w-full"
              />
            </div>
            
            <div>
              <label className="block text-cultural-text font-medium mb-2">
                Throttled Scroll Handler
              </label>
              <div 
                className="h-32 bg-cultural-soft rounded-lg overflow-y-auto p-4"
                onScroll={throttledScroll}
              >
                <div className="h-64 bg-gradient-to-b from-cultural-accent to-cultural-secondary rounded-lg">
                  <p className="text-white p-4">Scroll me to see throttled events in console</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progressive Loading Demo */}
        <div className="card-cultural p-6">
          <h3 className="text-xl font-semibold text-cultural-text mb-4">Progressive Loading</h3>
          <ProgressiveLoading
            stages={loadingStages}
            currentStage="assets"
            onComplete={() => console.log('Loading complete!')}
          />
        </div>

        {/* Network Status Monitor */}
        <NetworkStatus onRetry={() => console.log('Retrying after network recovery')} />
      </div>

      {/* Loading Overlay */}
      <LoadingOverlay
        isVisible={showOverlay}
        message="Loading performance demo..."
        progress={loadingProgress}
      />
    </div>
  );
};

export default PerformanceOptimizationDemo;