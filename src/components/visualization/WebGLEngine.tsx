'use client';

import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useThree, extend } from '@react-three/fiber';
import * as THREE from 'three';

// WebGL capability detection and optimization
export class WebGLCapabilities {
  private renderer: THREE.WebGLRenderer;
  private capabilities: any;

  constructor(renderer: THREE.WebGLRenderer) {
    this.renderer = renderer;
    this.capabilities = renderer.capabilities;
  }

  // Check WebGL support and version
  static isWebGLAvailable(): boolean {
    try {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      return !!context;
    } catch (e) {
      return false;
    }
  }

  static isWebGL2Available(): boolean {
    try {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('webgl2');
      return !!context;
    } catch (e) {
      return false;
    }
  }

  // Get device capabilities for optimization
  getDeviceProfile() {
    const gl = this.renderer.getContext();
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    
    return {
      isWebGL2: this.capabilities.isWebGL2,
      maxTextureSize: this.capabilities.maxTextureSize,
      maxCubemapSize: this.capabilities.maxCubemapSize,
      maxAttributes: this.capabilities.maxAttributes,
      maxVertexUniforms: this.capabilities.maxVertexUniforms,
      maxFragmentUniforms: this.capabilities.maxFragmentUniforms,
      maxVaryings: this.capabilities.maxVaryings,
      vertexTextures: this.capabilities.vertexTextures,
      floatFragmentTextures: this.capabilities.floatFragmentTextures,
      floatVertexTextures: this.capabilities.floatVertexTextures,
      maxAnisotropy: this.capabilities.getMaxAnisotropy(),
      precision: this.capabilities.precision,
      logarithmicDepthBuffer: this.capabilities.logarithmicDepthBuffer,
      renderer: debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'Unknown',
      vendor: debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'Unknown'
    };
  }

  // Detect if device is low-end
  isLowEndDevice(): boolean {
    const profile = this.getDeviceProfile();
    return (
      profile.maxTextureSize < 4096 ||
      profile.maxFragmentUniforms < 512 ||
      !profile.floatFragmentTextures
    );
  }

  // Get optimal settings for current device
  getOptimalSettings() {
    const isLowEnd = this.isLowEndDevice();
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
    
    return {
      antialias: !isMobile && !isLowEnd,
      precision: isLowEnd ? 'mediump' : 'highp',
      powerPreference: isLowEnd ? 'low-power' : 'high-performance',
      pixelRatio: Math.min(window.devicePixelRatio, isLowEnd ? 1.5 : 2),
      shadowMapSize: isLowEnd ? 512 : isMobile ? 1024 : 2048,
      maxLights: isLowEnd ? 4 : 8,
      enablePostProcessing: !isLowEnd,
      textureQuality: isLowEnd ? 'low' : isMobile ? 'medium' : 'high'
    };
  }
}

// Advanced WebGL Renderer Manager
export class WebGLEngineManager {
  private renderer: THREE.WebGLRenderer;
  private capabilities: WebGLCapabilities;
  private performanceMonitor: PerformanceMonitor;
  private textureManager: EventTextureManager;
  private sceneManager: EventSceneManager;

  constructor(canvas?: HTMLCanvasElement) {
    // Check WebGL availability
    if (!WebGLCapabilities.isWebGLAvailable()) {
      throw new Error('WebGL is not supported on this device');
    }

    // Get optimal settings for current device
    const caps = new WebGLCapabilities(this.createTempRenderer());
    const optimalSettings = caps.getOptimalSettings();

    // Create optimized renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      
      // Quality settings
      antialias: optimalSettings.antialias,
      precision: optimalSettings.precision as any,
      
      // Performance settings
      powerPreference: optimalSettings.powerPreference as any,
      failIfMajorPerformanceCaveat: false,
      
      // Transparency and effects
      alpha: true,
      premultipliedAlpha: true,
      
      // Buffer settings
      depth: true,
      stencil: false,
      preserveDrawingBuffer: false,
      
      // Advanced buffer settings
      logarithmicDepthBuffer: false,
      reverseDepthBuffer: false
    });

    this.setupAdvancedConfiguration(optimalSettings);
    this.capabilities = new WebGLCapabilities(this.renderer);
    this.performanceMonitor = new PerformanceMonitor(this.renderer);
    this.textureManager = new EventTextureManager(this.renderer);
    this.sceneManager = new EventSceneManager(this.renderer);
  }

  private createTempRenderer(): THREE.WebGLRenderer {
    return new THREE.WebGLRenderer({ alpha: true });
  }

  private setupAdvancedConfiguration(settings: any) {
    // Auto-clear settings
    this.renderer.autoClear = true;
    this.renderer.autoClearColor = true;
    this.renderer.autoClearDepth = true;
    this.renderer.autoClearStencil = true;

    // Sorting and culling
    this.renderer.sortObjects = true;
    this.renderer.localClippingEnabled = false;

    // Color space and tone mapping
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;

    // Shadow configuration
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = settings.antialias ? 
      THREE.PCFSoftShadowMap : THREE.BasicShadowMap;
    this.renderer.shadowMap.autoUpdate = true;

    // Debug settings (development only)
    if (process.env.NODE_ENV === 'development') {
      this.renderer.debug.checkShaderErrors = true;
    }

    // Set pixel ratio
    this.renderer.setPixelRatio(settings.pixelRatio);
  }

  // Configure for responsive design
  setupResponsiveCanvas(container: HTMLElement) {
    const resizeHandler = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      
      this.renderer.setSize(width, height);
      
      // Trigger camera update event
      window.dispatchEvent(new CustomEvent('webgl-resize', {
        detail: { width, height }
      }));
    };

    // Initial setup
    resizeHandler();

    // Handle window resize
    window.addEventListener('resize', resizeHandler);
    
    // Handle device orientation change
    window.addEventListener('orientationchange', () => {
      setTimeout(resizeHandler, 100); // Delay for orientation change
    });

    return resizeHandler;
  }

  // Get renderer instance
  getRenderer(): THREE.WebGLRenderer {
    return this.renderer;
  }

  // Get capabilities
  getCapabilities(): WebGLCapabilities {
    return this.capabilities;
  }

  // Get performance monitor
  getPerformanceMonitor(): PerformanceMonitor {
    return this.performanceMonitor;
  }

  // Get texture manager
  getTextureManager(): EventTextureManager {
    return this.textureManager;
  }

  // Get scene manager
  getSceneManager(): EventSceneManager {
    return this.sceneManager;
  }

  // Update method for render loop
  update(deltaTime: number) {
    this.performanceMonitor.update();
    this.textureManager.disposeUnusedTextures();
    this.sceneManager.updateActiveObjects(deltaTime);
  }

  // Cleanup and disposal
  dispose() {
    this.textureManager.disposeAll();
    this.sceneManager.disposeAll();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
  }
}

// Performance monitoring system
export class PerformanceMonitor {
  private renderer: THREE.WebGLRenderer;
  private stats: {
    fps: number;
    frameTime: number;
    drawCalls: number;
    triangles: number;
    memoryUsage: any;
    gpuTime: number;
  };
  private lastTime: number;
  private frameHistory: number[];
  private performanceCallbacks: ((stats: any) => void)[];

  constructor(renderer: THREE.WebGLRenderer) {
    this.renderer = renderer;
    this.stats = {
      fps: 0,
      frameTime: 0,
      drawCalls: 0,
      triangles: 0,
      memoryUsage: { geometries: 0, textures: 0 },
      gpuTime: 0
    };
    this.lastTime = performance.now();
    this.frameHistory = [];
    this.performanceCallbacks = [];
  }

  update() {
    const currentTime = performance.now();
    this.stats.frameTime = currentTime - this.lastTime;
    this.stats.fps = 1000 / this.stats.frameTime;

    // Maintain frame history for averaging
    this.frameHistory.push(this.stats.fps);
    if (this.frameHistory.length > 60) {
      this.frameHistory.shift();
    }

    const info = this.renderer.info;
    this.stats.drawCalls = info.render.calls;
    this.stats.triangles = info.render.triangles;

    // WebGL memory usage approximation
    this.stats.memoryUsage = {
      geometries: info.memory.geometries,
      textures: info.memory.textures
    };

    this.checkPerformanceThresholds();
    this.notifyCallbacks();
    this.lastTime = currentTime;
  }

  private checkPerformanceThresholds() {
    const avgFps = this.frameHistory.reduce((a, b) => a + b, 0) / this.frameHistory.length;

    if (avgFps < 30) {
      this.triggerPerformanceWarning('low-fps', { fps: avgFps });
    }

    if (this.stats.drawCalls > 100) {
      this.triggerPerformanceWarning('high-draw-calls', { calls: this.stats.drawCalls });
    }

    if (this.stats.triangles > 500000) {
      this.triggerPerformanceWarning('high-triangle-count', { triangles: this.stats.triangles });
    }
  }

  private triggerPerformanceWarning(type: string, data: any) {
    console.warn(`Performance warning: ${type}`, data);
    
    // Dispatch custom event for UI handling
    window.dispatchEvent(new CustomEvent('webgl-performance-warning', {
      detail: { type, data }
    }));
  }

  private notifyCallbacks() {
    this.performanceCallbacks.forEach(callback => {
      try {
        callback(this.getStats());
      } catch (error) {
        console.error('Performance callback error:', error);
      }
    });
  }

  addCallback(callback: (stats: any) => void) {
    this.performanceCallbacks.push(callback);
  }

  removeCallback(callback: (stats: any) => void) {
    const index = this.performanceCallbacks.indexOf(callback);
    if (index > -1) {
      this.performanceCallbacks.splice(index, 1);
    }
  }

  getStats() {
    return {
      ...this.stats,
      avgFps: this.frameHistory.reduce((a, b) => a + b, 0) / this.frameHistory.length
    };
  }

  getReport() {
    return {
      performance: this.getStats(),
      capabilities: this.renderer.capabilities,
      extensions: this.renderer.extensions
    };
  }
}

// Optimized texture management for event assets
export class EventTextureManager {
  private renderer: THREE.WebGLRenderer;
  private textureCache: Map<string, THREE.Texture>;
  private maxTextureSize: number;
  private compressionSupport: any;

  constructor(renderer: THREE.WebGLRenderer) {
    this.renderer = renderer;
    this.textureCache = new Map();
    this.maxTextureSize = renderer.capabilities.maxTextureSize;
    this.compressionSupport = this.detectCompressionSupport();
  }

  private detectCompressionSupport() {
    const gl = this.renderer.getContext();
    return {
      s3tc: !!gl.getExtension('WEBGL_compressed_texture_s3tc'),
      pvrtc: !!gl.getExtension('WEBGL_compressed_texture_pvrtc'),
      etc1: !!gl.getExtension('WEBGL_compressed_texture_etc1'),
      astc: !!gl.getExtension('WEBGL_compressed_texture_astc')
    };
  }

  loadOptimizedTexture(url: string, options: any = {}): THREE.Texture {
    if (this.textureCache.has(url)) {
      const texture = this.textureCache.get(url)!;
      texture.userData.lastUsed = Date.now();
      return texture;
    }

    const loader = new THREE.TextureLoader();
    const texture = loader.load(url);

    // Optimization settings
    texture.minFilter = THREE.LinearMipMapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;
    texture.wrapS = options.wrapS || THREE.RepeatWrapping;
    texture.wrapT = options.wrapT || THREE.RepeatWrapping;

    // Anisotropic filtering
    const maxAnisotropy = this.renderer.capabilities.getMaxAnisotropy();
    texture.anisotropy = Math.min(options.anisotropy || 4, maxAnisotropy);

    // Quality-based optimization
    if (options.quality === 'low') {
      texture.minFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
    }

    // Mark usage time
    texture.userData = {
      url,
      lastUsed: Date.now(),
      quality: options.quality || 'high'
    };

    this.textureCache.set(url, texture);
    return texture;
  }

  disposeUnusedTextures() {
    const currentTime = Date.now();
    const unusedThreshold = 60000; // 1 minute

    this.textureCache.forEach((texture, url) => {
      if (currentTime - texture.userData.lastUsed > unusedThreshold) {
        texture.dispose();
        this.textureCache.delete(url);
      }
    });
  }

  disposeAll() {
    this.textureCache.forEach(texture => texture.dispose());
    this.textureCache.clear();
  }

  getCompressionSupport() {
    return this.compressionSupport;
  }

  getCacheStats() {
    return {
      totalTextures: this.textureCache.size,
      memoryEstimate: this.textureCache.size * 1024 * 1024, // Rough estimate
      compressionSupport: this.compressionSupport
    };
  }
}

// Memory-efficient scene management
export class EventSceneManager {
  private renderer: THREE.WebGLRenderer;
  private activeObjects: Set<THREE.Object3D>;
  private objectPool: Map<string, THREE.Object3D[]>;
  private lodManager: Map<string, THREE.LOD>;

  constructor(renderer: THREE.WebGLRenderer) {
    this.renderer = renderer;
    this.activeObjects = new Set();
    this.objectPool = new Map();
    this.lodManager = new Map();
  }

  addEventItem(type: string, position: THREE.Vector3, scene: THREE.Scene): THREE.Object3D {
    let item = this.objectPool.get(type)?.pop();

    if (!item) {
      item = this.createEventItem(type);
    }

    item.position.copy(position);
    item.visible = true;
    this.activeObjects.add(item);
    scene.add(item);

    return item;
  }

  removeEventItem(item: THREE.Object3D, scene: THREE.Scene) {
    item.visible = false;
    scene.remove(item);
    this.activeObjects.delete(item);

    const type = item.userData.type;
    if (!this.objectPool.has(type)) {
      this.objectPool.set(type, []);
    }
    this.objectPool.get(type)!.push(item);
  }

  private createEventItem(type: string): THREE.Object3D {
    // Factory method for creating different event items
    switch (type) {
      case 'chair':
        return this.createChair();
      case 'table':
        return this.createTable();
      case 'stage':
        return this.createStage();
      default:
        return new THREE.Mesh(
          new THREE.BoxGeometry(1, 1, 1),
          new THREE.MeshStandardMaterial({ color: 0x888888 })
        );
    }
  }

  private createChair(): THREE.Object3D {
    const group = new THREE.Group();
    group.userData.type = 'chair';
    
    // Create chair geometry (simplified for example)
    const seat = new THREE.Mesh(
      new THREE.BoxGeometry(1, 0.1, 1),
      new THREE.MeshStandardMaterial({ color: 0x8B4513 })
    );
    seat.position.y = 0.5;
    
    const back = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1.5, 0.1),
      new THREE.MeshStandardMaterial({ color: 0x8B4513 })
    );
    back.position.set(0, 1.2, -0.45);
    
    group.add(seat, back);
    return group;
  }

  private createTable(): THREE.Object3D {
    const group = new THREE.Group();
    group.userData.type = 'table';
    
    const top = new THREE.Mesh(
      new THREE.BoxGeometry(2, 0.1, 1),
      new THREE.MeshStandardMaterial({ color: 0x8B4513 })
    );
    top.position.y = 1;
    
    group.add(top);
    return group;
  }

  private createStage(): THREE.Object3D {
    const group = new THREE.Group();
    group.userData.type = 'stage';
    
    const platform = new THREE.Mesh(
      new THREE.BoxGeometry(10, 0.5, 6),
      new THREE.MeshStandardMaterial({ color: 0x444444 })
    );
    platform.position.y = 0.25;
    
    group.add(platform);
    return group;
  }

  updateActiveObjects(deltaTime: number) {
    // Update any animated objects
    this.activeObjects.forEach(object => {
      if (object.userData.animate) {
        this.updateObjectAnimation(object, deltaTime);
      }
    });
  }

  private updateObjectAnimation(object: THREE.Object3D, deltaTime: number) {
    // Implement object-specific animations
    if (object.userData.animationType === 'rotate') {
      object.rotation.y += deltaTime * 0.001;
    }
  }

  disposeAll() {
    this.activeObjects.forEach(item => {
      if (item instanceof THREE.Mesh) {
        item.geometry?.dispose();
        if (Array.isArray(item.material)) {
          item.material.forEach(mat => mat.dispose());
        } else {
          item.material?.dispose();
        }
      }
    });
    
    this.objectPool.clear();
    this.activeObjects.clear();
    this.lodManager.clear();
  }

  getStats() {
    return {
      activeObjects: this.activeObjects.size,
      pooledObjects: Array.from(this.objectPool.values()).reduce((sum, arr) => sum + arr.length, 0),
      totalObjects: this.activeObjects.size + Array.from(this.objectPool.values()).reduce((sum, arr) => sum + arr.length, 0)
    };
  }
}

// React hook for WebGL engine
export function useWebGLEngine() {
  const { gl, camera, scene } = useThree();
  const [engineManager, setEngineManager] = useState<WebGLEngineManager | null>(null);

  useEffect(() => {
    try {
      const manager = new WebGLEngineManager(gl.domElement);
      setEngineManager(manager);

      // Setup responsive canvas
      const container = gl.domElement.parentElement;
      if (container) {
        manager.setupResponsiveCanvas(container);
      }

      return () => {
        manager.dispose();
      };
    } catch (error) {
      console.error('Failed to initialize WebGL engine:', error);
    }
  }, [gl]);

  return engineManager;
}

// WebGL Error Handling Component
export function WebGLErrorHandler({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!WebGLCapabilities.isWebGLAvailable()) {
      setHasError(true);
      setErrorMessage('WebGL is not supported on this device. Please use a modern browser with WebGL support.');
      return;
    }

    // Listen for WebGL context loss
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      setHasError(true);
      setErrorMessage('Graphics context lost. Please refresh the page.');
    };

    const handleContextRestored = () => {
      setHasError(false);
      setErrorMessage('');
    };

    document.addEventListener('webglcontextlost', handleContextLost);
    document.addEventListener('webglcontextrestored', handleContextRestored);

    return () => {
      document.removeEventListener('webglcontextlost', handleContextLost);
      document.removeEventListener('webglcontextrestored', handleContextRestored);
    };
  }, []);

  if (hasError) {
    return (
      <div className="flex items-center justify-center h-full bg-red-50">
        <div className="text-center p-8">
          <div className="text-red-600 text-xl mb-4">WebGL Error</div>
          <div className="text-gray-700 mb-4">{errorMessage}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}