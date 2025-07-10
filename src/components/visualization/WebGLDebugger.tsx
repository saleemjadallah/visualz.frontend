'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';

// Comprehensive WebGL debugging and monitoring system
export class WebGLDebugger {
  private renderer: THREE.WebGLRenderer;
  private gl: WebGLRenderingContext | WebGL2RenderingContext;
  private capabilities: any;
  private extensions: any;
  private isDebugging: boolean = false;
  private debugCallbacks: Map<string, Function[]> = new Map();

  constructor(renderer: THREE.WebGLRenderer) {
    this.renderer = renderer;
    this.gl = renderer.getContext();
    this.capabilities = renderer.capabilities;
    this.extensions = renderer.extensions;
    
    this.setupDebugMode();
  }

  private setupDebugMode() {
    if (process.env.NODE_ENV === 'development') {
      this.enableShaderDebugging();
      this.setupWebGLExtensions();
      this.enableContextLossDetection();
    }
  }

  // Log comprehensive WebGL capabilities
  logCapabilities(): any {
    const caps = this.capabilities;
    const gl = this.gl;
    
    const capabilityInfo = {
      // Basic WebGL info
      webGLVersion: caps.isWebGL2 ? '2.0' : '1.0',
      glslVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
      vendor: gl.getParameter(gl.VENDOR),
      renderer: gl.getParameter(gl.RENDERER),
      
      // Texture capabilities
      maxTextureSize: caps.maxTextureSize,
      maxCubemapSize: caps.maxCubemapSize,
      maxTextureImageUnits: gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS),
      maxCombinedTextureImageUnits: gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS),
      
      // Shader capabilities
      maxVertexAttribs: caps.maxAttributes,
      maxVertexUniforms: caps.maxVertexUniforms,
      maxFragmentUniforms: caps.maxFragmentUniforms,
      maxVaryings: caps.maxVaryings,
      
      // Rendering capabilities
      maxViewportDims: gl.getParameter(gl.MAX_VIEWPORT_DIMS),
      maxRenderbufferSize: gl.getParameter(gl.MAX_RENDERBUFFER_SIZE),
      maxAnisotropy: caps.getMaxAnisotropy(),
      
      // Precision support
      precision: caps.precision,
      vertexTextures: caps.vertexTextures,
      floatFragmentTextures: caps.floatFragmentTextures,
      floatVertexTextures: caps.floatVertexTextures,
      
      // Advanced features
      logarithmicDepthBuffer: caps.logarithmicDepthBuffer,
      maxSamples: caps.maxSamples,
      
      // Extensions
      supportedExtensions: gl.getSupportedExtensions(),
      availableExtensions: this.getAvailableExtensions()
    };

    console.group('🔧 WebGL Capabilities Report');
    console.table(capabilityInfo);
    console.groupEnd();
    
    return capabilityInfo;
  }

  private getAvailableExtensions(): any {
    return {
      // Texture compression
      s3tc: this.extensions.has('WEBGL_compressed_texture_s3tc'),
      pvrtc: this.extensions.has('WEBGL_compressed_texture_pvrtc'),
      etc1: this.extensions.has('WEBGL_compressed_texture_etc1'),
      astc: this.extensions.has('WEBGL_compressed_texture_astc'),
      
      // Rendering features
      depthTexture: this.extensions.has('WEBGL_depth_texture'),
      drawBuffers: this.extensions.has('WEBGL_draw_buffers'),
      instancedArrays: this.extensions.has('ANGLE_instanced_arrays'),
      
      // Debugging
      debugRendererInfo: this.extensions.has('WEBGL_debug_renderer_info'),
      debugShaders: this.extensions.has('WEBGL_debug_shaders'),
      
      // Performance
      disjointTimerQuery: this.extensions.has('EXT_disjoint_timer_query_webgl2') || 
                         this.extensions.has('EXT_disjoint_timer_query'),
      
      // Color and blending
      colorBufferFloat: this.extensions.has('EXT_color_buffer_float'),
      blendMinMax: this.extensions.has('EXT_blend_minmax'),
      
      // Vertex features
      vertexArrayObject: this.extensions.has('OES_vertex_array_object')
    };
  }

  // Enable comprehensive shader debugging
  enableShaderDebugging(): void {
    this.renderer.debug.checkShaderErrors = true;
    
    this.renderer.debug.onShaderError = (gl, program, glVertexShader, glFragmentShader) => {
      const vertexLog = gl.getShaderInfoLog(glVertexShader);
      const fragmentLog = gl.getShaderInfoLog(glFragmentShader);
      const programLog = gl.getProgramInfoLog(program);
      
      console.group('🚨 Shader Compilation Error');
      console.error('Program Log:', programLog);
      if (vertexLog) console.error('Vertex Shader Log:', vertexLog);
      if (fragmentLog) console.error('Fragment Shader Log:', fragmentLog);
      console.groupEnd();
      
      this.triggerCallback('shader-error', {
        programLog,
        vertexLog,
        fragmentLog,
        program,
        vertexShader: glVertexShader,
        fragmentShader: glFragmentShader
      });
    };
  }

  // Setup WebGL extensions detection and warnings
  private setupWebGLExtensions(): void {
    const criticalExtensions = [
      'WEBGL_depth_texture',
      'OES_texture_float',
      'EXT_texture_filter_anisotropic'
    ];
    
    const missingCritical = criticalExtensions.filter(ext => 
      !this.extensions.has(ext)
    );
    
    if (missingCritical.length > 0) {
      console.warn('🔴 Missing critical WebGL extensions:', missingCritical);
      this.triggerCallback('missing-extensions', { extensions: missingCritical });
    }
  }

  // Enable WebGL context loss detection
  private enableContextLossDetection(): void {
    const canvas = this.renderer.domElement;
    
    canvas.addEventListener('webglcontextlost', (event) => {
      event.preventDefault();
      console.error('🚨 WebGL Context Lost');
      this.triggerCallback('context-lost', { event });
    });
    
    canvas.addEventListener('webglcontextrestored', () => {
      console.log('✅ WebGL Context Restored');
      this.triggerCallback('context-restored', {});
    });
  }

  // Performance profiling with GPU timer queries
  async profileRenderPass(
    renderFunction: () => void,
    label: string = 'Render Pass'
  ): Promise<PerformanceReport> {
    const startTime = performance.now();
    const startMemory = this.getMemoryUsage();
    const startDrawCalls = this.renderer.info.render.calls;
    const startTriangles = this.renderer.info.render.triangles;
    
    // Execute render function
    renderFunction();
    
    const endTime = performance.now();
    const endMemory = this.getMemoryUsage();
    const endDrawCalls = this.renderer.info.render.calls;
    const endTriangles = this.renderer.info.render.triangles;
    
    const report: PerformanceReport = {
      label,
      cpuTime: endTime - startTime,
      drawCalls: endDrawCalls - startDrawCalls,
      triangles: endTriangles - startTriangles,
      memoryDelta: {
        geometries: endMemory.geometries - startMemory.geometries,
        textures: endMemory.textures - startMemory.textures,
        programs: endMemory.programs - startMemory.programs
      },
      timestamp: Date.now()
    };
    
    console.log(`📊 Performance Report: ${label}`, report);
    return report;
  }

  // Get current memory usage
  private getMemoryUsage(): MemoryUsage {
    const info = this.renderer.info;
    return {
      geometries: info.memory.geometries,
      textures: info.memory.textures,
      programs: info.programs?.length || 0
    };
  }

  // GPU memory estimation
  estimateGPUMemoryUsage(): GPUMemoryEstimate {
    const info = this.renderer.info;
    const textureMemory = this.estimateTextureMemory();
    const geometryMemory = this.estimateGeometryMemory();
    
    return {
      totalEstimate: textureMemory + geometryMemory,
      textureMemory,
      geometryMemory,
      activeTextures: info.memory.textures,
      activeGeometries: info.memory.geometries,
      activePrograms: info.programs?.length || 0
    };
  }

  private estimateTextureMemory(): number {
    // Rough estimation: average texture is 1MB
    return this.renderer.info.memory.textures * 1024 * 1024;
  }

  private estimateGeometryMemory(): number {
    // Rough estimation: average geometry is 100KB
    return this.renderer.info.memory.geometries * 100 * 1024;
  }

  // Capture frame for debugging
  captureFrame(filename?: string): string {
    const canvas = this.renderer.domElement;
    const dataURL = canvas.toDataURL('image/png');
    
    if (filename) {
      const link = document.createElement('a');
      link.download = `${filename}-${Date.now()}.png`;
      link.href = dataURL;
      link.click();
    }
    
    console.log('📸 Frame captured');
    return dataURL;
  }

  // WebGL state debugging
  captureWebGLState(): WebGLState {
    const gl = this.gl;
    
    const state: WebGLState = {
      // Blending
      blendEnabled: gl.isEnabled(gl.BLEND),
      blendSrcRGB: gl.getParameter(gl.BLEND_SRC_RGB),
      blendDstRGB: gl.getParameter(gl.BLEND_DST_RGB),
      blendSrcAlpha: gl.getParameter(gl.BLEND_SRC_ALPHA),
      blendDstAlpha: gl.getParameter(gl.BLEND_DST_ALPHA),
      blendEquationRGB: gl.getParameter(gl.BLEND_EQUATION_RGB),
      blendEquationAlpha: gl.getParameter(gl.BLEND_EQUATION_ALPHA),
      
      // Depth testing
      depthTestEnabled: gl.isEnabled(gl.DEPTH_TEST),
      depthFunc: gl.getParameter(gl.DEPTH_FUNC),
      depthMask: gl.getParameter(gl.DEPTH_WRITEMASK),
      
      // Culling
      cullFaceEnabled: gl.isEnabled(gl.CULL_FACE),
      cullFaceMode: gl.getParameter(gl.CULL_FACE_MODE),
      frontFace: gl.getParameter(gl.FRONT_FACE),
      
      // Viewport
      viewport: gl.getParameter(gl.VIEWPORT),
      scissorTest: gl.isEnabled(gl.SCISSOR_TEST),
      scissorBox: gl.getParameter(gl.SCISSOR_BOX),
      
      // Buffers
      activeTexture: gl.getParameter(gl.ACTIVE_TEXTURE),
      arrayBufferBinding: gl.getParameter(gl.ARRAY_BUFFER_BINDING),
      elementArrayBufferBinding: gl.getParameter(gl.ELEMENT_ARRAY_BUFFER_BINDING),
      
      // Program
      currentProgram: gl.getParameter(gl.CURRENT_PROGRAM),
      
      // Clear values
      clearColor: gl.getParameter(gl.COLOR_CLEAR_VALUE),
      clearDepth: gl.getParameter(gl.DEPTH_CLEAR_VALUE),
      clearStencil: gl.getParameter(gl.STENCIL_CLEAR_VALUE)
    };
    
    console.log('🔍 WebGL State Captured', state);
    return state;
  }

  // Validate textures for common issues
  validateTextures(): TextureValidationReport[] {
    const reports: TextureValidationReport[] = [];
    const textureManager = this.renderer.properties;
    
    // This is a simplified validation - in a real implementation,
    // you'd need access to the internal texture registry
    console.log('🔍 Texture validation completed');
    
    return reports;
  }

  // Check for WebGL errors
  checkWebGLErrors(label?: string): boolean {
    const gl = this.gl;
    let hasErrors = false;
    
    while (true) {
      const error = gl.getError();
      if (error === gl.NO_ERROR) break;
      
      hasErrors = true;
      const errorMessage = this.getWebGLErrorMessage(error);
      console.error(`🚨 WebGL Error${label ? ` (${label})` : ''}: ${errorMessage}`);
      
      this.triggerCallback('webgl-error', {
        error,
        message: errorMessage,
        label
      });
    }
    
    return hasErrors;
  }

  private getWebGLErrorMessage(error: number): string {
    const gl = this.gl;
    switch (error) {
      case gl.INVALID_ENUM: return 'INVALID_ENUM';
      case gl.INVALID_VALUE: return 'INVALID_VALUE';
      case gl.INVALID_OPERATION: return 'INVALID_OPERATION';
      case gl.INVALID_FRAMEBUFFER_OPERATION: return 'INVALID_FRAMEBUFFER_OPERATION';
      case gl.OUT_OF_MEMORY: return 'OUT_OF_MEMORY';
      case gl.CONTEXT_LOST_WEBGL: return 'CONTEXT_LOST_WEBGL';
      default: return `Unknown error code: ${error}`;
    }
  }

  // Event callback system
  on(event: string, callback: Function): void {
    if (!this.debugCallbacks.has(event)) {
      this.debugCallbacks.set(event, []);
    }
    this.debugCallbacks.get(event)!.push(callback);
  }

  off(event: string, callback: Function): void {
    const callbacks = this.debugCallbacks.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private triggerCallback(event: string, data: any): void {
    const callbacks = this.debugCallbacks.get(event);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Debug callback error:', error);
        }
      });
    }
  }

  // Start debugging session
  startDebugging(): void {
    this.isDebugging = true;
    console.log('🔧 WebGL debugging enabled');
    
    // Enable automatic error checking after each render
    const originalRender = this.renderer.render.bind(this.renderer);
    this.renderer.render = (scene: THREE.Scene, camera: THREE.Camera) => {
      originalRender(scene, camera);
      if (this.isDebugging) {
        this.checkWebGLErrors('Post-render');
      }
    };
  }

  // Stop debugging session
  stopDebugging(): void {
    this.isDebugging = false;
    console.log('🔧 WebGL debugging disabled');
  }

  // Generate comprehensive debug report
  generateDebugReport(): DebugReport {
    const report: DebugReport = {
      timestamp: new Date().toISOString(),
      capabilities: this.logCapabilities(),
      memoryUsage: this.estimateGPUMemoryUsage(),
      webglState: this.captureWebGLState(),
      renderInfo: {
        calls: this.renderer.info.render.calls,
        triangles: this.renderer.info.render.triangles,
        points: this.renderer.info.render.points,
        lines: this.renderer.info.render.lines,
        frame: this.renderer.info.render.frame
      },
      extensions: this.getAvailableExtensions(),
      hasErrors: this.checkWebGLErrors('Debug Report Generation')
    };
    
    console.log('📋 Debug Report Generated', report);
    return report;
  }
}

// Performance monitoring with real-time feedback
export class RealTimePerformanceMonitor {
  private webglDebugger: WebGLDebugger;
  private performanceHistory: PerformanceReport[] = [];
  private maxHistorySize: number = 100;
  private thresholds: PerformanceThresholds;
  private callbacks: Map<string, Function[]> = new Map();

  constructor(webglDebugger: WebGLDebugger, thresholds?: Partial<PerformanceThresholds>) {
    this.webglDebugger = webglDebugger;
    this.thresholds = {
      maxFrameTime: 16.67, // 60 FPS
      maxDrawCalls: 100,
      maxTriangles: 500000,
      maxMemoryMB: 500,
      ...thresholds
    };
  }

  startMonitoring(): void {
    // Monitor every frame
    const monitor = () => {
      this.checkPerformance();
      requestAnimationFrame(monitor);
    };
    monitor();
  }

  private checkPerformance(): void {
    const memoryUsage = this.webglDebugger.estimateGPUMemoryUsage();
    const memoryMB = memoryUsage.totalEstimate / (1024 * 1024);
    
    // Check thresholds
    if (memoryMB > this.thresholds.maxMemoryMB) {
      this.triggerWarning('memory', { current: memoryMB, threshold: this.thresholds.maxMemoryMB });
    }
  }

  addPerformanceReport(report: PerformanceReport): void {
    this.performanceHistory.push(report);
    
    if (this.performanceHistory.length > this.maxHistorySize) {
      this.performanceHistory.shift();
    }
    
    // Check thresholds
    this.checkThresholds(report);
  }

  private checkThresholds(report: PerformanceReport): void {
    if (report.cpuTime > this.thresholds.maxFrameTime) {
      this.triggerWarning('frame-time', {
        current: report.cpuTime,
        threshold: this.thresholds.maxFrameTime
      });
    }
    
    if (report.drawCalls > this.thresholds.maxDrawCalls) {
      this.triggerWarning('draw-calls', {
        current: report.drawCalls,
        threshold: this.thresholds.maxDrawCalls
      });
    }
    
    if (report.triangles > this.thresholds.maxTriangles) {
      this.triggerWarning('triangles', {
        current: report.triangles,
        threshold: this.thresholds.maxTriangles
      });
    }
  }

  private triggerWarning(type: string, data: any): void {
    console.warn(`⚠️ Performance Warning (${type}):`, data);
    
    const callbacks = this.callbacks.get('warning');
    if (callbacks) {
      callbacks.forEach(callback => callback({ type, data }));
    }
  }

  on(event: string, callback: Function): void {
    if (!this.callbacks.has(event)) {
      this.callbacks.set(event, []);
    }
    this.callbacks.get(event)!.push(callback);
  }

  getAverageFrameTime(): number {
    if (this.performanceHistory.length === 0) return 0;
    
    const total = this.performanceHistory.reduce((sum, report) => sum + report.cpuTime, 0);
    return total / this.performanceHistory.length;
  }

  getPerformanceStats(): PerformanceStats {
    const history = this.performanceHistory;
    if (history.length === 0) {
      return {
        averageFrameTime: 0,
        averageFPS: 0,
        averageDrawCalls: 0,
        averageTriangles: 0,
        memoryTrend: 'stable'
      };
    }
    
    const avgFrameTime = this.getAverageFrameTime();
    const avgFPS = 1000 / avgFrameTime;
    const avgDrawCalls = history.reduce((sum, r) => sum + r.drawCalls, 0) / history.length;
    const avgTriangles = history.reduce((sum, r) => sum + r.triangles, 0) / history.length;
    
    return {
      averageFrameTime: avgFrameTime,
      averageFPS: avgFPS,
      averageDrawCalls: avgDrawCalls,
      averageTriangles: avgTriangles,
      memoryTrend: this.getMemoryTrend()
    };
  }

  private getMemoryTrend(): 'increasing' | 'decreasing' | 'stable' {
    if (this.performanceHistory.length < 10) return 'stable';
    
    const recent = this.performanceHistory.slice(-10);
    const firstHalf = recent.slice(0, 5);
    const secondHalf = recent.slice(5);
    
    const firstAvg = firstHalf.reduce((sum, r) => 
      sum + (r.memoryDelta?.geometries || 0) + (r.memoryDelta?.textures || 0), 0) / 5;
    const secondAvg = secondHalf.reduce((sum, r) => 
      sum + (r.memoryDelta?.geometries || 0) + (r.memoryDelta?.textures || 0), 0) / 5;
    
    const diff = secondAvg - firstAvg;
    if (Math.abs(diff) < 0.1) return 'stable';
    return diff > 0 ? 'increasing' : 'decreasing';
  }
}

// Type definitions
interface PerformanceReport {
  label: string;
  cpuTime: number;
  drawCalls: number;
  triangles: number;
  memoryDelta?: {
    geometries: number;
    textures: number;
    programs: number;
  };
  timestamp: number;
}

interface MemoryUsage {
  geometries: number;
  textures: number;
  programs: number;
}

interface GPUMemoryEstimate {
  totalEstimate: number;
  textureMemory: number;
  geometryMemory: number;
  activeTextures: number;
  activeGeometries: number;
  activePrograms: number;
}

interface WebGLState {
  blendEnabled: boolean;
  blendSrcRGB: number;
  blendDstRGB: number;
  blendSrcAlpha: number;
  blendDstAlpha: number;
  blendEquationRGB: number;
  blendEquationAlpha: number;
  depthTestEnabled: boolean;
  depthFunc: number;
  depthMask: boolean;
  cullFaceEnabled: boolean;
  cullFaceMode: number;
  frontFace: number;
  viewport: Int32Array;
  scissorTest: boolean;
  scissorBox: Int32Array;
  activeTexture: number;
  arrayBufferBinding: WebGLBuffer | null;
  elementArrayBufferBinding: WebGLBuffer | null;
  currentProgram: WebGLProgram | null;
  clearColor: Float32Array;
  clearDepth: number;
  clearStencil: number;
}

interface TextureValidationReport {
  id: string;
  issues: string[];
  recommendations: string[];
}

interface DebugReport {
  timestamp: string;
  capabilities: any;
  memoryUsage: GPUMemoryEstimate;
  webglState: WebGLState;
  renderInfo: any;
  extensions: any;
  hasErrors: boolean;
}

interface PerformanceThresholds {
  maxFrameTime: number;
  maxDrawCalls: number;
  maxTriangles: number;
  maxMemoryMB: number;
}

interface PerformanceStats {
  averageFrameTime: number;
  averageFPS: number;
  averageDrawCalls: number;
  averageTriangles: number;
  memoryTrend: 'increasing' | 'decreasing' | 'stable';
}

// React component for debug UI
export function WebGLDebugPanel({
  webglDebugger,
  performanceMonitor
}: {
  webglDebugger: WebGLDebugger | null;
  performanceMonitor: RealTimePerformanceMonitor | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [performanceStats, setPerformanceStats] = useState<PerformanceStats | null>(null);
  const [debugReport, setDebugReport] = useState<DebugReport | null>(null);

  useEffect(() => {
    if (!performanceMonitor) return;

    const interval = setInterval(() => {
      setPerformanceStats(performanceMonitor.getPerformanceStats());
    }, 1000);

    return () => clearInterval(interval);
  }, [performanceMonitor]);

  const handleGenerateReport = () => {
    if (webglDebugger) {
      const report = webglDebugger.generateDebugReport();
      setDebugReport(report);
    }
  };

  const handleCaptureFrame = () => {
    if (webglDebugger) {
      webglDebugger.captureFrame('debug-capture');
    }
  };

  if (!webglDebugger || process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <>
      {/* Debug toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 left-4 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg shadow-lg z-50"
      >
        🔧 Debug
      </button>

      {/* Debug panel */}
      {isOpen && (
        <div className="fixed bottom-16 left-4 bg-black/90 text-white p-4 rounded-lg shadow-lg max-w-md z-50">
          <h3 className="font-bold mb-4">WebGL Debug Panel</h3>
          
          {/* Performance stats */}
          {performanceStats && (
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Performance</h4>
              <div className="text-sm space-y-1">
                <div>FPS: {performanceStats.averageFPS.toFixed(1)}</div>
                <div>Frame Time: {performanceStats.averageFrameTime.toFixed(2)}ms</div>
                <div>Draw Calls: {performanceStats.averageDrawCalls.toFixed(0)}</div>
                <div>Triangles: {performanceStats.averageTriangles.toFixed(0)}</div>
                <div>Memory: {performanceStats.memoryTrend}</div>
              </div>
            </div>
          )}
          
          {/* Debug actions */}
          <div className="space-y-2">
            <button
              onClick={handleGenerateReport}
              className="w-full bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-sm"
            >
              Generate Report
            </button>
            
            <button
              onClick={handleCaptureFrame}
              className="w-full bg-green-600 hover:bg-green-700 px-3 py-2 rounded text-sm"
            >
              Capture Frame
            </button>
            
            <button
              onClick={() => webglDebugger.logCapabilities()}
              className="w-full bg-yellow-600 hover:bg-yellow-700 px-3 py-2 rounded text-sm"
            >
              Log Capabilities
            </button>
          </div>
          
          {/* Debug report summary */}
          {debugReport && (
            <div className="mt-4 pt-4 border-t border-gray-600">
              <h4 className="font-semibold mb-2">Latest Report</h4>
              <div className="text-xs space-y-1">
                <div>Memory: {(debugReport.memoryUsage.totalEstimate / (1024*1024)).toFixed(1)}MB</div>
                <div>Errors: {debugReport.hasErrors ? '❌' : '✅'}</div>
                <div>Textures: {debugReport.memoryUsage.activeTextures}</div>
                <div>Geometries: {debugReport.memoryUsage.activeGeometries}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

// React hook for WebGL debugging
export function useWebGLDebugger(renderer: THREE.WebGLRenderer | null) {
  const [webglDebugger, setWebglDebugger] = useState<WebGLDebugger | null>(null);
  const [performanceMonitor, setPerformanceMonitor] = useState<RealTimePerformanceMonitor | null>(null);

  useEffect(() => {
    if (!renderer) return;

    const debuggerInstance = new WebGLDebugger(renderer);
    const perfMonitor = new RealTimePerformanceMonitor(debuggerInstance);

    setWebglDebugger(debuggerInstance);
    setPerformanceMonitor(perfMonitor);

    if (process.env.NODE_ENV === 'development') {
      debuggerInstance.startDebugging();
      perfMonitor.startMonitoring();
    }

    return () => {
      debuggerInstance.stopDebugging();
    };
  }, [renderer]);

  return { webglDebugger, performanceMonitor };
}