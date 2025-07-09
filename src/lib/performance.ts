// Performance monitoring and optimization utilities

interface PerformanceMetrics {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  type: 'component' | 'api' | 'bundle' | 'render' | 'paint';
  metadata?: Record<string, any>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private observers: PerformanceObserver[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeObservers();
    }
  }

  private initializeObservers() {
    // Observe paint timings
    if ('PerformanceObserver' in window) {
      try {
        const paintObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            this.addMetric({
              name: entry.name,
              startTime: entry.startTime,
              duration: entry.duration || 0,
              type: 'paint',
              metadata: { entryType: entry.entryType }
            });
          });
        });
        paintObserver.observe({ entryTypes: ['paint'] });
        this.observers.push(paintObserver);
      } catch (e) {
        console.warn('Paint observer not supported');
      }

      // Observe navigation timings
      try {
        const navigationObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            this.addMetric({
              name: 'navigation',
              startTime: entry.startTime,
              duration: entry.duration || 0,
              type: 'render',
              metadata: { 
                entryType: entry.entryType,
                loadEventEnd: (entry as any).loadEventEnd
              }
            });
          });
        });
        navigationObserver.observe({ entryTypes: ['navigation'] });
        this.observers.push(navigationObserver);
      } catch (e) {
        console.warn('Navigation observer not supported');
      }
    }
  }

  // Start timing a component or operation
  startTiming(name: string, type: PerformanceMetrics['type'] = 'component', metadata?: Record<string, any>): string {
    const id = `${name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const startTime = performance.now();
    
    this.metrics.push({
      name: id,
      startTime,
      type,
      metadata
    });

    return id;
  }

  // End timing and calculate duration
  endTiming(id: string): number | null {
    const metric = this.metrics.find(m => m.name === id);
    if (!metric) return null;

    const endTime = performance.now();
    const duration = endTime - metric.startTime;
    
    metric.endTime = endTime;
    metric.duration = duration;

    // Log slow operations
    if (duration > 1000) {
      console.warn(`Slow ${metric.type}: ${id} took ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  // Measure component render time
  measureComponent<T>(name: string, fn: () => T): T {
    const startTime = performance.now();
    const result = fn();
    const endTime = performance.now();
    
    this.addMetric({
      name,
      startTime,
      endTime,
      duration: endTime - startTime,
      type: 'component'
    });

    return result;
  }

  // Measure API call performance
  async measureAPI<T>(name: string, apiCall: () => Promise<T>): Promise<T> {
    const startTime = performance.now();
    try {
      const result = await apiCall();
      const endTime = performance.now();
      
      this.addMetric({
        name,
        startTime,
        endTime,
        duration: endTime - startTime,
        type: 'api',
        metadata: { success: true }
      });

      return result;
    } catch (error) {
      const endTime = performance.now();
      
      this.addMetric({
        name,
        startTime,
        endTime,
        duration: endTime - startTime,
        type: 'api',
        metadata: { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
      });

      throw error;
    }
  }

  // Add a metric manually
  addMetric(metric: Omit<PerformanceMetrics, 'endTime' | 'duration'> & { endTime?: number; duration?: number }) {
    this.metrics.push(metric as PerformanceMetrics);
  }

  // Get all metrics
  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  // Get metrics by type
  getMetricsByType(type: PerformanceMetrics['type']): PerformanceMetrics[] {
    return this.metrics.filter(m => m.type === type);
  }

  // Get performance summary
  getSummary() {
    const summary = {
      total: this.metrics.length,
      byType: {} as Record<string, number>,
      averageDuration: {} as Record<string, number>,
      slowest: {} as Record<string, PerformanceMetrics>,
    };

    this.metrics.forEach(metric => {
      const type = metric.type;
      summary.byType[type] = (summary.byType[type] || 0) + 1;
      
      if (metric.duration) {
        if (!summary.averageDuration[type]) {
          summary.averageDuration[type] = metric.duration;
        } else {
          summary.averageDuration[type] = (summary.averageDuration[type] + metric.duration) / 2;
        }

        if (!summary.slowest[type] || metric.duration > (summary.slowest[type].duration || 0)) {
          summary.slowest[type] = metric;
        }
      }
    });

    return summary;
  }

  // Clear all metrics
  clear() {
    this.metrics = [];
  }

  // Cleanup observers
  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Create global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Web Vitals monitoring
export const webVitals = {
  // Largest Contentful Paint
  measureLCP(): Promise<number> {
    return new Promise((resolve) => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry.startTime);
          observer.disconnect();
        });
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      } else {
        resolve(0);
      }
    });
  },

  // First Input Delay
  measureFID(): Promise<number> {
    return new Promise((resolve) => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const firstEntry = entries[0] as any;
          resolve(firstEntry.processingStart - firstEntry.startTime);
          observer.disconnect();
        });
        observer.observe({ entryTypes: ['first-input'] });
      } else {
        resolve(0);
      }
    });
  },

  // Cumulative Layout Shift
  measureCLS(): Promise<number> {
    return new Promise((resolve) => {
      if ('PerformanceObserver' in window) {
        let clsValue = 0;
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
        });
        observer.observe({ entryTypes: ['layout-shift'] });
        
        // Resolve after a delay to collect multiple entries
        setTimeout(() => {
          resolve(clsValue);
          observer.disconnect();
        }, 5000);
      } else {
        resolve(0);
      }
    });
  },

  // Time to First Byte
  measureTTFB(): number {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const navTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return navTiming.responseStart - navTiming.requestStart;
    }
    return 0;
  },

  // Get all Web Vitals
  async getAllVitals() {
    const [lcp, fid, cls] = await Promise.all([
      this.measureLCP(),
      this.measureFID(),
      this.measureCLS()
    ]);
    
    const ttfb = this.measureTTFB();
    
    return {
      lcp,
      fid,
      cls,
      ttfb,
      timestamp: Date.now()
    };
  }
};

// Bundle size monitoring
export const bundleMonitor = {
  // Estimate bundle size based on loaded scripts
  estimateBundleSize(): number {
    if (typeof window === 'undefined') return 0;
    
    let totalSize = 0;
    const scripts = document.querySelectorAll('script[src]');
    
    scripts.forEach(script => {
      const src = script.getAttribute('src');
      if (src && src.includes('/_next/static/')) {
        // Estimate based on script tag presence
        // In production, this would be more sophisticated
        totalSize += 50000; // Rough estimate
      }
    });
    
    return totalSize;
  },

  // Monitor resource loading
  monitorResourceLoading(): Promise<PerformanceResourceTiming[]> {
    return new Promise((resolve) => {
      if ('PerformanceObserver' in window) {
        const resources: PerformanceResourceTiming[] = [];
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries() as PerformanceResourceTiming[];
          resources.push(...entries);
        });
        observer.observe({ entryTypes: ['resource'] });
        
        setTimeout(() => {
          resolve(resources);
          observer.disconnect();
        }, 3000);
      } else {
        resolve([]);
      }
    });
  }
};

// Memory usage monitoring
export const memoryMonitor = {
  // Get memory usage (Chrome only)
  getMemoryUsage(): any {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const memory = (performance as any).memory;
      if (memory) {
        return {
          used: memory.usedJSHeapSize,
          total: memory.totalJSHeapSize,
          limit: memory.jsHeapSizeLimit,
          timestamp: Date.now()
        };
      }
    }
    return null;
  },

  // Monitor memory usage over time
  startMemoryMonitoring(interval: number = 5000): () => void {
    if (typeof window === 'undefined') return () => {};
    
    const readings: any[] = [];
    const intervalId = setInterval(() => {
      const usage = this.getMemoryUsage();
      if (usage) {
        readings.push(usage);
        
        // Log if memory usage is concerning
        if (usage.used / usage.limit > 0.8) {
          console.warn('High memory usage detected:', usage);
        }
      }
    }, interval);
    
    return () => {
      clearInterval(intervalId);
      return readings;
    };
  }
};

// Connection monitoring
export const connectionMonitor = {
  // Get connection information
  getConnectionInfo(): any {
    if (typeof window !== 'undefined' && 'navigator' in window) {
      const connection = (navigator as any).connection;
      if (connection) {
        return {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
          saveData: connection.saveData,
          timestamp: Date.now()
        };
      }
    }
    return null;
  },

  // Monitor connection changes
  monitorConnectionChanges(callback: (info: any) => void): () => void {
    if (typeof window === 'undefined') return () => {};
    
    const connection = (navigator as any).connection;
    if (connection) {
      const handler = () => callback(this.getConnectionInfo());
      connection.addEventListener('change', handler);
      
      return () => connection.removeEventListener('change', handler);
    }
    
    return () => {};
  }
};

// Performance optimization utilities
export const optimize = {
  // Debounce function calls
  debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
    let timeout: NodeJS.Timeout;
    return ((...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    }) as T;
  },

  // Throttle function calls
  throttle<T extends (...args: any[]) => any>(func: T, limit: number): T {
    let inThrottle: boolean;
    return ((...args: any[]) => {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }) as T;
  },

  // Lazy load images
  lazyLoadImages(selector: string = 'img[data-src]') {
    if (typeof window === 'undefined') return;
    
    const images = document.querySelectorAll(selector);
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.getAttribute('data-src');
          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  },

  // Preload critical resources
  preloadCriticalResources(resources: string[]) {
    if (typeof window === 'undefined') return;
    
    resources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      
      // Determine resource type
      if (resource.endsWith('.js')) {
        link.as = 'script';
      } else if (resource.endsWith('.css')) {
        link.as = 'style';
      } else if (resource.includes('fonts')) {
        link.as = 'font';
        link.crossOrigin = 'anonymous';
      }
      
      document.head.appendChild(link);
    });
  }
};

// Development-only performance reporting
export const devPerformanceReport = () => {
  if (process.env.NODE_ENV === 'development') {
    console.group('Performance Report');
    console.log('Metrics:', performanceMonitor.getSummary());
    console.log('Memory:', memoryMonitor.getMemoryUsage());
    console.log('Connection:', connectionMonitor.getConnectionInfo());
    console.log('Bundle Size Estimate:', bundleMonitor.estimateBundleSize());
    console.groupEnd();
  }
};

// Cleanup function
export const cleanup = () => {
  performanceMonitor.cleanup();
};

export default {
  performanceMonitor,
  webVitals,
  bundleMonitor,
  memoryMonitor,
  connectionMonitor,
  optimize,
  devPerformanceReport,
  cleanup
};