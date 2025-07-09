'use client';

import { useCallback, useRef, useState, useEffect } from 'react';
import { useUploadStore } from '../store';
import { UploadedImage } from '../types';

interface ImageUploadConfig {
  maxFileSize?: number; // in bytes
  acceptedTypes?: string[];
  maxFiles?: number;
  autoAnalyze?: boolean;
  compressionQuality?: number;
  maxDimensions?: { width: number; height: number };
}

interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
  fileName: string;
}

interface ImageAnalysis {
  dimensions: {
    estimatedLength: number;
    estimatedWidth: number;
    estimatedHeight: number;
  };
  lighting: {
    type: 'natural' | 'artificial' | 'mixed';
    quality: 'excellent' | 'good' | 'fair' | 'poor';
    direction: string[];
  };
  objects: {
    name: string;
    confidence: number;
    position: { x: number; y: number; width: number; height: number };
  }[];
  style: {
    current: string[];
    recommendations: string[];
  };
}

const DEFAULT_CONFIG: ImageUploadConfig = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  acceptedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  maxFiles: 10,
  autoAnalyze: true,
  compressionQuality: 0.8,
  maxDimensions: { width: 1920, height: 1080 }
};

export const useImageUpload = (config: ImageUploadConfig = {}) => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  const {
    uploads,
    isUploading,
    uploadProgress,
    dragActive,
    addUpload,
    removeUpload,
    updateUpload,
    setUploading,
    setUploadProgress,
    setDragActive,
    clearUploads
  } = useUploadStore();

  const [uploadProgressDetails, setUploadProgressDetails] = useState<UploadProgress[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag and drop handlers
  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, [setDragActive]);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, [setDragActive]);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer?.files || []);
    handleFiles(files);
  }, [setDragActive]);

  // File validation
  const validateFile = useCallback((file: File): string | null => {
    if (!finalConfig.acceptedTypes?.includes(file.type)) {
      return `File type ${file.type} is not supported. Please use ${finalConfig.acceptedTypes?.join(', ')}.`;
    }
    
    if (file.size > finalConfig.maxFileSize!) {
      return `File size ${(file.size / (1024 * 1024)).toFixed(2)}MB exceeds maximum ${(finalConfig.maxFileSize! / (1024 * 1024)).toFixed(2)}MB.`;
    }
    
    if (uploads.length >= finalConfig.maxFiles!) {
      return `Maximum ${finalConfig.maxFiles} files allowed.`;
    }
    
    return null;
  }, [finalConfig, uploads.length]);

  // Image compression
  const compressImage = useCallback((file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        const { width, height } = finalConfig.maxDimensions!;
        const { width: imgWidth, height: imgHeight } = img;
        
        let newWidth = imgWidth;
        let newHeight = imgHeight;
        
        if (imgWidth > width || imgHeight > height) {
          const ratio = Math.min(width / imgWidth, height / imgHeight);
          newWidth = imgWidth * ratio;
          newHeight = imgHeight * ratio;
        }
        
        canvas.width = newWidth;
        canvas.height = newHeight;
        
        ctx?.drawImage(img, 0, 0, newWidth, newHeight);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, { type: file.type });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        }, file.type, finalConfig.compressionQuality);
      };
      
      img.src = URL.createObjectURL(file);
    });
  }, [finalConfig.maxDimensions, finalConfig.compressionQuality]);

  // Mock image analysis (replace with actual AI service)
  const analyzeImage = useCallback(async (file: File): Promise<ImageAnalysis> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock analysis results
    return {
      dimensions: {
        estimatedLength: 12 + Math.random() * 8, // 12-20 feet
        estimatedWidth: 8 + Math.random() * 6,   // 8-14 feet
        estimatedHeight: 8 + Math.random() * 4   // 8-12 feet
      },
      lighting: {
        type: ['natural', 'artificial', 'mixed'][Math.floor(Math.random() * 3)] as any,
        quality: ['excellent', 'good', 'fair', 'poor'][Math.floor(Math.random() * 4)] as any,
        direction: ['north', 'south', 'east', 'west'].filter(() => Math.random() > 0.5)
      },
      objects: [
        {
          name: 'Table',
          confidence: 0.85 + Math.random() * 0.15,
          position: { x: 100, y: 150, width: 200, height: 100 }
        },
        {
          name: 'Chair',
          confidence: 0.75 + Math.random() * 0.25,
          position: { x: 50, y: 200, width: 80, height: 120 }
        }
      ],
      style: {
        current: ['Modern', 'Minimalist'],
        recommendations: ['Scandinavian', 'Japanese', 'Contemporary']
      }
    };
  }, []);

  // File upload handler
  const uploadFile = useCallback(async (file: File): Promise<UploadedImage> => {
    const id = `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Compress image if needed
    const compressedFile = await compressImage(file);
    
    // Create object URL for preview
    const url = URL.createObjectURL(compressedFile);
    
    // Create upload object
    const upload: UploadedImage = {
      id,
      url,
      name: file.name,
      size: compressedFile.size,
      type: file.type,
      uploadedAt: new Date()
    };
    
    // Add to store
    addUpload(upload);
    
    // Analyze image if enabled
    if (finalConfig.autoAnalyze) {
      try {
        const analysis = await analyzeImage(compressedFile);
        updateUpload(id, { analysis });
      } catch (error) {
        console.error('Image analysis failed:', error);
      }
    }
    
    return upload;
  }, [finalConfig.autoAnalyze, compressImage, analyzeImage, addUpload, updateUpload]);

  // Handle multiple files
  const handleFiles = useCallback(async (files: File[]) => {
    const validFiles: File[] = [];
    const errors: string[] = [];
    
    // Validate all files first
    for (const file of files) {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    }
    
    if (errors.length > 0) {
      console.error('File validation errors:', errors);
      return;
    }
    
    if (validFiles.length === 0) return;
    
    setUploading(true);
    setUploadProgressDetails([]);
    
    try {
      const uploadPromises = validFiles.map(async (file, index) => {
        const progressDetails: UploadProgress = {
          loaded: 0,
          total: file.size,
          percentage: 0,
          fileName: file.name
        };
        
        setUploadProgressDetails(prev => [...prev, progressDetails]);
        
        // Simulate upload progress
        const updateProgress = (loaded: number) => {
          const percentage = Math.round((loaded / file.size) * 100);
          setUploadProgressDetails(prev => 
            prev.map(p => 
              p.fileName === file.name 
                ? { ...p, loaded, percentage }
                : p
            )
          );
          
          // Update overall progress
          const totalProgress = Math.round((index + percentage / 100) / validFiles.length * 100);
          setUploadProgress(totalProgress);
        };
        
        // Simulate progressive upload
        let loaded = 0;
        const interval = setInterval(() => {
          loaded += file.size * 0.1;
          if (loaded >= file.size) {
            loaded = file.size;
            clearInterval(interval);
          }
          updateProgress(loaded);
        }, 100);
        
        const result = await uploadFile(file);
        clearInterval(interval);
        updateProgress(file.size);
        
        return result;
      });
      
      await Promise.all(uploadPromises);
      
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
      setUploadProgress(0);
      setUploadProgressDetails([]);
    }
  }, [validateFile, uploadFile, setUploading, setUploadProgress]);

  // File input handler
  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [handleFiles]);

  // Open file dialog
  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Remove upload
  const removeUploadFile = useCallback((id: string) => {
    const upload = uploads.find(u => u.id === id);
    if (upload) {
      URL.revokeObjectURL(upload.url);
      removeUpload(id);
    }
  }, [uploads, removeUpload]);

  // Clear all uploads
  const clearAllUploads = useCallback(() => {
    uploads.forEach(upload => {
      URL.revokeObjectURL(upload.url);
    });
    clearUploads();
  }, [uploads, clearUploads]);

  // Get upload by ID
  const getUpload = useCallback((id: string) => {
    return uploads.find(upload => upload.id === id);
  }, [uploads]);

  // Get uploads by type
  const getUploadsByType = useCallback((type: string) => {
    return uploads.filter(upload => upload.type === type);
  }, [uploads]);

  // Setup drag and drop listeners
  useEffect(() => {
    const handleDragEnterBound = (e: DragEvent) => handleDragEnter(e);
    const handleDragLeaveBound = (e: DragEvent) => handleDragLeave(e);
    const handleDragOverBound = (e: DragEvent) => handleDragOver(e);
    const handleDropBound = (e: DragEvent) => handleDrop(e);
    
    window.addEventListener('dragenter', handleDragEnterBound);
    window.addEventListener('dragleave', handleDragLeaveBound);
    window.addEventListener('dragover', handleDragOverBound);
    window.addEventListener('drop', handleDropBound);
    
    return () => {
      window.removeEventListener('dragenter', handleDragEnterBound);
      window.removeEventListener('dragleave', handleDragLeaveBound);
      window.removeEventListener('dragover', handleDragOverBound);
      window.removeEventListener('drop', handleDropBound);
    };
  }, [handleDragEnter, handleDragLeave, handleDragOver, handleDrop]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      uploads.forEach(upload => {
        URL.revokeObjectURL(upload.url);
      });
    };
  }, [uploads]);

  return {
    // State
    uploads,
    isUploading,
    uploadProgress,
    dragActive,
    uploadProgressDetails,
    
    // File operations
    handleFiles,
    openFileDialog,
    removeUploadFile,
    clearAllUploads,
    
    // Utilities
    getUpload,
    getUploadsByType,
    validateFile,
    
    // Refs
    fileInputRef,
    
    // Handlers
    handleFileInput,
    
    // Configuration
    config: finalConfig,
    
    // Statistics
    totalUploads: uploads.length,
    totalSize: uploads.reduce((sum, upload) => sum + upload.size, 0),
    hasUploads: uploads.length > 0,
    canUploadMore: uploads.length < finalConfig.maxFiles!,
    
    // Analysis results
    getAnalyzedUploads: useCallback(() => {
      return uploads.filter(upload => upload.analysis);
    }, [uploads]),
    
    getUploadAnalysis: useCallback((id: string) => {
      return uploads.find(upload => upload.id === id)?.analysis;
    }, [uploads])
  };
};

export default useImageUpload;