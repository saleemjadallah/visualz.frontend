'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { WebGLEngineManager, PerformanceMonitor } from './WebGLEngine';

// Mobile-specific WebGL optimizations
export class MobileWebGLOptimizer {
  private renderer: THREE.WebGLRenderer;
  private isMobile: boolean;
  private isLowEnd: boolean;
  private optimizationLevel: 'low' | 'medium' | 'high';

  constructor(renderer: THREE.WebGLRenderer) {
    this.renderer = renderer;
    this.isMobile = this.detectMobile();
    this.isLowEnd = this.detectLowEndDevice();
    this.optimizationLevel = this.determineOptimizationLevel();
    
    this.applyMobileOptimizations();
  }

  private detectMobile(): boolean {
    return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
  }

  private detectLowEndDevice(): boolean {
    const capabilities = this.renderer.capabilities;
    const memoryInfo = (navigator as any).memory;
    
    return (
      capabilities.maxTextureSize < 4096 ||
      capabilities.maxFragmentUniforms < 512 ||
      (memoryInfo && memoryInfo.totalJSHeapSize < 1000000000) || // < 1GB
      this.renderer.getContext().getParameter(this.renderer.getContext().MAX_VERTEX_ATTRIBS) < 16
    );
  }

  private determineOptimizationLevel(): 'low' | 'medium' | 'high' {
    if (this.isLowEnd) return 'low';
    if (this.isMobile) return 'medium';
    return 'high';
  }

  private applyMobileOptimizations() {
    switch (this.optimizationLevel) {
      case 'low':
        this.applyLowEndOptimizations();
        break;
      case 'medium':
        this.applyMediumOptimizations();
        break;
      case 'high':
        this.applyHighEndOptimizations();
        break;
    }
  }

  private applyLowEndOptimizations() {
    // Disable expensive features
    this.renderer.shadowMap.enabled = false;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
    this.renderer.toneMapping = THREE.LinearToneMapping;
    
    // Reduce precision
    this.renderer.capabilities.precision = 'mediump';
    
    console.log('Applied low-end optimizations');
  }

  private applyMediumOptimizations() {
    // Balanced settings for mobile
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.BasicShadowMap;
    this.renderer.toneMapping = THREE.ReinhardToneMapping;
    
    console.log('Applied medium optimizations for mobile');
  }

  private applyHighEndOptimizations() {
    // Full quality for desktop
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    
    console.log('Applied high-end optimizations');
  }

  // Progressive loading for mobile
  async loadEventSceneProgressive(sceneConfig: any, onProgress?: (progress: number) => void): Promise<THREE.Scene> {
    const scene = new THREE.Scene();
    let progress = 0;
    
    // Stage 1: Load basic geometry (20% progress)
    const basicObjects = await this.loadBasicGeometry(sceneConfig);
    scene.add(...basicObjects);
    progress = 20;
    onProgress?.(progress);
    
    // Stage 2: Load materials (40% progress)
    if (this.optimizationLevel !== 'low') {
      await this.loadMaterials(basicObjects);
      progress = 40;
      onProgress?.(progress);
    }
    
    // Stage 3: Load textures (70% progress)
    if (this.optimizationLevel === 'high') {
      await this.loadHighQualityTextures(basicObjects);
    } else {
      await this.loadOptimizedTextures(basicObjects);
    }
    progress = 70;
    onProgress?.(progress);
    
    // Stage 4: Load lighting (90% progress)
    const lights = await this.loadLighting(sceneConfig);
    scene.add(...lights);
    progress = 90;
    onProgress?.(progress);
    
    // Stage 5: Final optimizations (100% progress)
    this.applyFinalOptimizations(scene);
    progress = 100;
    onProgress?.(progress);
    
    return scene;
  }

  private async loadBasicGeometry(config: any): Promise<THREE.Object3D[]> {
    return new Promise(resolve => {
      const objects = config.items.map((item: any) => {
        const geometry = this.getOptimizedGeometry(item.type);
        const material = new THREE.MeshBasicMaterial({ 
          color: item.color || 0x888888 
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(item.x, item.y, item.z);
        mesh.userData = { type: item.type, id: item.id };
        
        return mesh;
      });
      
      setTimeout(() => resolve(objects), 16); // Next frame
    });
  }

  private getOptimizedGeometry(type: string): THREE.BufferGeometry {
    const detail = this.optimizationLevel === 'low' ? 1 : 
                   this.optimizationLevel === 'medium' ? 2 : 3;
    
    switch (type) {
      case 'chair':
        return new THREE.BoxGeometry(1, 2, 1, detail, detail * 2, detail);
      case 'table':
        return new THREE.BoxGeometry(2, 0.8, 1, detail * 2, 1, detail);
      case 'stage':
        return new THREE.BoxGeometry(10, 0.5, 6, detail * 5, 1, detail * 3);
      default:
        return new THREE.BoxGeometry(1, 1, 1, detail, detail, detail);
    }
  }

  private async loadMaterials(objects: THREE.Object3D[]): Promise<void> {
    return new Promise(resolve => {
      objects.forEach(obj => {
        if (obj instanceof THREE.Mesh) {
          obj.material = new THREE.MeshStandardMaterial({
            color: (obj.material as THREE.MeshBasicMaterial).color,
            roughness: 0.8,
            metalness: 0.1
          });
        }
      });
      
      setTimeout(resolve, 16);
    });
  }

  private async loadOptimizedTextures(objects: THREE.Object3D[]): Promise<void> {
    const textureLoader = new THREE.TextureLoader();
    const promises: Promise<void>[] = [];
    
    objects.forEach(obj => {
      if (obj instanceof THREE.Mesh && obj.material instanceof THREE.MeshStandardMaterial) {
        const type = obj.userData.type;
        const texturePromise = new Promise<void>(resolve => {
          const textureUrl = this.getOptimizedTextureUrl(type);
          
          if (textureUrl) {
            textureLoader.load(textureUrl, texture => {
              texture.minFilter = THREE.LinearFilter;
              texture.generateMipmaps = false;
              obj.material.map = texture;
              obj.material.needsUpdate = true;
              resolve();
            }, undefined, () => resolve()); // Continue on error
          } else {
            resolve();
          }
        });
        
        promises.push(texturePromise);
      }
    });
    
    await Promise.all(promises);
  }

  private async loadHighQualityTextures(objects: THREE.Object3D[]): Promise<void> {
    const textureLoader = new THREE.TextureLoader();
    const promises: Promise<void>[] = [];
    
    objects.forEach(obj => {
      if (obj instanceof THREE.Mesh && obj.material instanceof THREE.MeshStandardMaterial) {
        const type = obj.userData.type;
        const texturePromise = new Promise<void>(resolve => {
          const textureUrls = this.getHighQualityTextureUrls(type);
          
          if (textureUrls.diffuse) {
            textureLoader.load(textureUrls.diffuse, texture => {
              obj.material.map = texture;
              obj.material.needsUpdate = true;
            });
          }
          
          if (textureUrls.normal) {
            textureLoader.load(textureUrls.normal, texture => {
              obj.material.normalMap = texture;
              obj.material.needsUpdate = true;
            });
          }
          
          if (textureUrls.roughness) {
            textureLoader.load(textureUrls.roughness, texture => {
              obj.material.roughnessMap = texture;
              obj.material.needsUpdate = true;
              resolve();
            }, undefined, () => resolve());
          } else {
            resolve();
          }
        });
        
        promises.push(texturePromise);
      }
    });
    
    await Promise.all(promises);
  }

  private async loadLighting(config: any): Promise<THREE.Light[]> {
    const lights: THREE.Light[] = [];
    
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    lights.push(ambientLight);
    
    // Directional light with shadows (if enabled)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = this.renderer.shadowMap.enabled;
    
    if (directionalLight.castShadow) {
      const shadowMapSize = this.optimizationLevel === 'low' ? 512 :
                           this.optimizationLevel === 'medium' ? 1024 : 2048;
      
      directionalLight.shadow.mapSize.width = shadowMapSize;
      directionalLight.shadow.mapSize.height = shadowMapSize;
      directionalLight.shadow.camera.near = 0.5;
      directionalLight.shadow.camera.far = 50;
      directionalLight.shadow.camera.left = -20;
      directionalLight.shadow.camera.right = 20;
      directionalLight.shadow.camera.top = 20;
      directionalLight.shadow.camera.bottom = -20;
    }
    
    lights.push(directionalLight);
    
    // Additional lights for higher optimization levels
    if (this.optimizationLevel === 'high') {
      const pointLight = new THREE.PointLight(0xffffff, 0.5, 100);
      pointLight.position.set(0, 10, 0);
      lights.push(pointLight);
    }
    
    return lights;
  }

  private applyFinalOptimizations(scene: THREE.Scene) {
    // Frustum culling
    scene.traverse(obj => {
      if (obj instanceof THREE.Mesh) {
        obj.frustumCulled = true;
        obj.castShadow = this.renderer.shadowMap.enabled && this.optimizationLevel !== 'low';
        obj.receiveShadow = this.renderer.shadowMap.enabled;
      }
    });
  }

  private getOptimizedTextureUrl(type: string): string | null {
    const quality = this.optimizationLevel === 'low' ? '512' : '1024';
    
    switch (type) {
      case 'chair':
        return `/textures/furniture/chair_${quality}.jpg`;
      case 'table':
        return `/textures/furniture/table_${quality}.jpg`;
      case 'stage':
        return `/textures/surfaces/stage_${quality}.jpg`;
      default:
        return null;
    }
  }

  private getHighQualityTextureUrls(type: string) {
    const baseUrl = `/textures/furniture/${type}`;
    return {
      diffuse: `${baseUrl}_diffuse_2k.jpg`,
      normal: `${baseUrl}_normal_2k.jpg`,
      roughness: `${baseUrl}_roughness_2k.jpg`
    };
  }

  getOptimizationLevel(): string {
    return this.optimizationLevel;
  }

  isMobileDevice(): boolean {
    return this.isMobile;
  }

  isLowEndDevice(): boolean {
    return this.isLowEnd;
  }
}

// Event Design Specific WebGL Settings
export class VenueRenderer {
  private renderer: THREE.WebGLRenderer;
  private performanceMonitor: PerformanceMonitor;
  private animationMixer?: THREE.AnimationMixer;

  constructor(renderer: THREE.WebGLRenderer) {
    this.renderer = renderer;
    this.performanceMonitor = new PerformanceMonitor(renderer);
    this.setupVenueSpecificSettings();
  }

  private setupVenueSpecificSettings() {
    // Accurate measurements for event planning
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    
    // Lighting for venue visualization
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.shadowMap.autoUpdate = true;
    
    // Tone mapping for realistic lighting
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    
    // Performance for real-time interaction
    this.renderer.info.autoReset = false;
  }

  // Venue-specific render loop
  renderVenue(scene: THREE.Scene, camera: THREE.Camera, deltaTime: number) {
    // Update any animations
    this.updateEventAnimations(deltaTime);
    
    // Render the scene
    this.renderer.render(scene, camera);
    
    // Performance monitoring
    this.performanceMonitor.update();
  }

  private updateEventAnimations(deltaTime: number) {
    if (this.animationMixer) {
      this.animationMixer.update(deltaTime);
    }
    
    // Update lighting effects
    this.updateLightingEffects(deltaTime);
  }

  private updateLightingEffects(deltaTime: number) {
    // Implement dynamic lighting changes for events
    // This could include color temperature changes, intensity variations, etc.
  }

  setupEventAnimations(scene: THREE.Scene) {
    this.animationMixer = new THREE.AnimationMixer(scene);
    
    // Create lighting animations for events
    scene.traverse(obj => {
      if (obj instanceof THREE.Light) {
        this.createLightAnimation(obj);
      }
    });
  }

  private createLightAnimation(light: THREE.Light) {
    // Create subtle lighting animations for ambiance
    const times = [0, 2, 4];
    const values = [light.intensity, light.intensity * 1.2, light.intensity];
    
    const track = new THREE.NumberKeyframeTrack(
      `${light.name}.intensity`,
      times,
      values
    );
    
    const clip = new THREE.AnimationClip('lightAnimation', 4, [track]);
    const action = this.animationMixer!.clipAction(clip);
    action.setLoop(THREE.LoopRepeat, Infinity);
    action.play();
  }

  dispose() {
    if (this.animationMixer) {
      this.animationMixer.stopAllAction();
    }
  }
}

// Furniture and Decoration Rendering Optimization
export class FurnitureRenderer {
  private renderer: THREE.WebGLRenderer;
  private lodManager: Map<string, THREE.LOD>;
  private instancedMeshes: Map<string, THREE.InstancedMesh>;

  constructor(renderer: THREE.WebGLRenderer) {
    this.renderer = renderer;
    this.lodManager = new Map();
    this.instancedMeshes = new Map();
  }

  setupFurnitureLOD(furnitureItem: any): THREE.LOD {
    const lod = new THREE.LOD();
    
    // High detail for close viewing (< 5 units)
    if (furnitureItem.highDetail) {
      lod.addLevel(furnitureItem.highDetail, 5);
    }
    
    // Medium detail for normal viewing (5-15 units)
    if (furnitureItem.mediumDetail) {
      lod.addLevel(furnitureItem.mediumDetail, 15);
    }
    
    // Low detail for overview (> 15 units)
    if (furnitureItem.lowDetail) {
      lod.addLevel(furnitureItem.lowDetail, 50);
    }
    
    this.lodManager.set(furnitureItem.id, lod);
    return lod;
  }

  createOptimizedFurnitureMaterial(options: any): THREE.Material {
    const capabilities = this.renderer.capabilities;
    const isLowEnd = capabilities.maxTextureSize < 2048;
    
    if (isLowEnd) {
      // Simple material for low-end devices
      return new THREE.MeshLambertMaterial({
        color: options.color || 0x888888,
        map: options.diffuseMap
      });
    } else {
      // Full PBR material for capable devices
      return new THREE.MeshStandardMaterial({
        map: options.diffuseMap,
        normalMap: options.normalMap,
        roughnessMap: options.roughnessMap,
        metalnessMap: options.metalnessMap,
        roughness: options.roughness || 0.8,
        metalness: options.metalness || 0.1,
        envMapIntensity: 1.0
      });
    }
  }

  // Batch similar furniture for instanced rendering
  createInstancedFurniture(type: string, count: number, geometry: THREE.BufferGeometry, material: THREE.Material): THREE.InstancedMesh {
    const instancedMesh = new THREE.InstancedMesh(geometry, material, count);
    
    // Enable shadows if supported
    instancedMesh.castShadow = this.renderer.shadowMap.enabled;
    instancedMesh.receiveShadow = this.renderer.shadowMap.enabled;
    
    this.instancedMeshes.set(type, instancedMesh);
    return instancedMesh;
  }

  updateInstancedPositions(type: string, positions: THREE.Vector3[]) {
    const instancedMesh = this.instancedMeshes.get(type);
    if (!instancedMesh) return;
    
    positions.forEach((position, index) => {
      const matrix = new THREE.Matrix4();
      matrix.setPosition(position);
      instancedMesh.setMatrixAt(index, matrix);
    });
    
    instancedMesh.instanceMatrix.needsUpdate = true;
  }

  dispose() {
    this.lodManager.clear();
    this.instancedMeshes.forEach(mesh => {
      mesh.geometry.dispose();
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach(mat => mat.dispose());
      } else {
        mesh.material.dispose();
      }
    });
    this.instancedMeshes.clear();
  }
}

// Draw Call Optimization System
export class DrawCallOptimizer {
  private renderer: THREE.WebGLRenderer;
  private batchedObjects: Map<string, THREE.Object3D[]>;

  constructor(renderer: THREE.WebGLRenderer) {
    this.renderer = renderer;
    this.batchedObjects = new Map();
  }

  // Batch similar objects to reduce draw calls
  batchEventItems(items: THREE.Object3D[]): Map<string, THREE.Object3D[]> {
    const batches = new Map<string, THREE.Object3D[]>();
    
    items.forEach(item => {
      if (item instanceof THREE.Mesh) {
        const key = `${item.geometry.uuid}_${(item.material as THREE.Material).uuid}`;
        if (!batches.has(key)) {
          batches.set(key, []);
        }
        batches.get(key)!.push(item);
      }
    });
    
    this.batchedObjects = batches;
    return batches;
  }

  // Create instanced rendering for repeated elements
  createInstancedChairs(count: number, geometry: THREE.BufferGeometry, material: THREE.Material): THREE.InstancedMesh {
    const instancedMesh = new THREE.InstancedMesh(geometry, material, count);
    
    // Set up random positions for chairs around tables
    for (let i = 0; i < count; i++) {
      const matrix = new THREE.Matrix4();
      matrix.setPosition(
        Math.random() * 20 - 10,  // Random X
        0,                        // Ground level
        Math.random() * 20 - 10   // Random Z
      );
      instancedMesh.setMatrixAt(i, matrix);
    }
    
    instancedMesh.instanceMatrix.needsUpdate = true;
    instancedMesh.castShadow = true;
    instancedMesh.receiveShadow = true;
    
    return instancedMesh;
  }

  // Merge geometries for static objects (simplified version)
  mergeStaticGeometries(objects: THREE.Mesh[]): THREE.Group {
    // For now, return a group instead of merged geometry
    // TODO: Implement proper geometry merging when BufferGeometryUtils is available
    const group = new THREE.Group();
    objects.forEach(obj => {
      group.add(obj.clone());
    });
    return group;
  }

  getBatchStats() {
    const totalBatches = this.batchedObjects.size;
    const totalObjects = Array.from(this.batchedObjects.values())
      .reduce((sum, batch) => sum + batch.length, 0);
    
    return {
      totalBatches,
      totalObjects,
      drawCallReduction: totalObjects - totalBatches
    };
  }
}

// Progressive loading manager
export class ProgressiveLoadingManager {
  private loadingProgress: number = 0;
  private totalAssets: number = 0;
  private loadedAssets: number = 0;
  private onProgressCallbacks: ((progress: number) => void)[] = [];

  setTotalAssets(count: number) {
    this.totalAssets = count;
    this.loadedAssets = 0;
    this.loadingProgress = 0;
  }

  incrementLoaded() {
    this.loadedAssets++;
    this.loadingProgress = (this.loadedAssets / this.totalAssets) * 100;
    this.notifyProgress();
  }

  private notifyProgress() {
    this.onProgressCallbacks.forEach(callback => {
      try {
        callback(this.loadingProgress);
      } catch (error) {
        console.error('Progress callback error:', error);
      }
    });
  }

  onProgress(callback: (progress: number) => void) {
    this.onProgressCallbacks.push(callback);
  }

  removeProgressCallback(callback: (progress: number) => void) {
    const index = this.onProgressCallbacks.indexOf(callback);
    if (index > -1) {
      this.onProgressCallbacks.splice(index, 1);
    }
  }

  getProgress(): number {
    return this.loadingProgress;
  }

  isComplete(): boolean {
    return this.loadingProgress >= 100;
  }

  reset() {
    this.loadingProgress = 0;
    this.totalAssets = 0;
    this.loadedAssets = 0;
  }
}

// React hook for WebGL optimization
export function useWebGLOptimization(renderer: THREE.WebGLRenderer | null) {
  const [optimizer, setOptimizer] = useState<MobileWebGLOptimizer | null>(null);
  const [venueRenderer, setVenueRenderer] = useState<VenueRenderer | null>(null);
  const [furnitureRenderer, setFurnitureRenderer] = useState<FurnitureRenderer | null>(null);

  useEffect(() => {
    if (!renderer) return;

    const mobileOptimizer = new MobileWebGLOptimizer(renderer);
    const venue = new VenueRenderer(renderer);
    const furniture = new FurnitureRenderer(renderer);

    setOptimizer(mobileOptimizer);
    setVenueRenderer(venue);
    setFurnitureRenderer(furniture);

    return () => {
      venue.dispose();
      furniture.dispose();
    };
  }, [renderer]);

  return {
    optimizer,
    venueRenderer,
    furnitureRenderer
  };
}