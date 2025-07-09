'use client';

import React, { useState, useCallback } from 'react';
import { Upload, Camera, X, Check, AlertCircle, Eye, RotateCcw } from 'lucide-react';
import { useImageUpload } from '@/lib/hooks/useImageUpload';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface SpaceAnalysis {
  dimensions: {
    estimatedLength: number;
    estimatedWidth: number;
    estimatedHeight: number;
    confidence: number;
  };
  detected_objects: Array<{
    name: string;
    category: string;
    confidence: number;
    position: { x: number; y: number; width: number; height: number };
  }>;
  lighting_analysis: {
    overall_brightness: number;
    light_sources: string[];
    color_temperature: string;
    quality_score: number;
  };
  architectural_style: {
    style_detected: string[];
    confidence: number;
    characteristics: string[];
  };
  color_palette: {
    dominant_colors: string[];
    accent_colors: string[];
    mood: string;
  };
  recommendations: {
    furniture_suggestions: string[];
    layout_tips: string[];
    improvement_areas: string[];
  };
}

interface SpaceImageUploadProps {
  onAnalysisComplete?: (analysis: SpaceAnalysis) => void;
  onDimensionsExtracted?: (dimensions: { length: number; width: number; height: number }) => void;
  className?: string;
}

export function SpaceImageUpload({ 
  onAnalysisComplete, 
  onDimensionsExtracted,
  className = '' 
}: SpaceImageUploadProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<SpaceAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  
  const {
    uploads,
    isUploading,
    dragActive,
    uploadProgress,
    handleFiles,
    openFileDialog,
    removeUploadFile,
    fileInputRef,
    handleFileInput
  } = useImageUpload({
    maxFiles: 5,
    autoAnalyze: false, // We'll handle analysis manually
    maxFileSize: 15 * 1024 * 1024, // 15MB for high quality space photos
  });

  // Analyze space photo using our backend API
  const analyzeSpacePhoto = useCallback(async (file: File) => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/cv-analysis/analyze-space', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze space photo');
      }
      
      const result = await response.json();
      const spaceAnalysis: SpaceAnalysis = result.analysis;
      
      setAnalysis(spaceAnalysis);
      onAnalysisComplete?.(spaceAnalysis);
      
      // Extract dimensions for form auto-fill
      if (spaceAnalysis.dimensions) {
        onDimensionsExtracted?.({
          length: Math.round(spaceAnalysis.dimensions.estimatedLength),
          width: Math.round(spaceAnalysis.dimensions.estimatedWidth),
          height: Math.round(spaceAnalysis.dimensions.estimatedHeight)
        });
      }
      
    } catch (error) {
      console.error('Space analysis failed:', error);
      setAnalysisError('Failed to analyze space photo. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  }, [onAnalysisComplete, onDimensionsExtracted]);

  // Handle new file uploads
  const handleNewFiles = useCallback(async (files: File[]) => {
    await handleFiles(files);
    
    // Analyze the first uploaded photo
    if (files.length > 0) {
      setSelectedImage(URL.createObjectURL(files[0]));
      await analyzeSpacePhoto(files[0]);
    }
  }, [handleFiles, analyzeSpacePhoto]);

  // Handle file selection from existing uploads
  const handleImageSelect = useCallback(async (uploadId: string) => {
    const upload = uploads.find(u => u.id === uploadId);
    if (!upload) return;
    
    setSelectedImage(upload.url);
    
    // Re-analyze if no analysis exists
    if (!analysis) {
      // Convert blob URL back to file for analysis
      const response = await fetch(upload.url);
      const blob = await response.blob();
      const file = new File([blob], upload.name, { type: upload.type });
      await analyzeSpacePhoto(file);
    }
  }, [uploads, analysis, analyzeSpacePhoto]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Upload Interface */}
      <Card className="p-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Upload Space Photos
          </h3>
          <p className="text-gray-600">
            Take or upload photos of your space for AI-powered analysis
          </p>
        </div>

        {/* Drop Zone */}
        <div 
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            dragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={(e) => {
            e.preventDefault();
            const files = Array.from(e.dataTransfer.files);
            handleNewFiles(files);
          }}
          onDragOver={(e) => e.preventDefault()}
        >
          <Upload className={`w-12 h-12 mx-auto mb-4 ${dragActive ? 'text-blue-500' : 'text-gray-400'}`} />
          
          <h4 className="text-lg font-medium text-gray-800 mb-2">
            Drop photos here or click to upload
          </h4>
          <p className="text-gray-600 text-sm mb-4">
            Multiple angles help our AI understand your space better
          </p>
          
          <div className="flex justify-center space-x-3">
            <Button 
              onClick={openFileDialog}
              disabled={isUploading}
              className="flex items-center"
            >
              <Upload className="w-4 h-4 mr-2" />
              Choose Files
            </Button>
            
            <Button 
              variant="secondary"
              onClick={() => {
                // Trigger camera on mobile devices
                if (fileInputRef.current) {
                  fileInputRef.current.setAttribute('capture', 'environment');
                  fileInputRef.current.click();
                }
              }}
              className="flex items-center"
            >
              <Camera className="w-4 h-4 mr-2" />
              Take Photo
            </Button>
          </div>
          
          {isUploading && (
            <div className="mt-4">
              <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-blue-600 h-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />
      </Card>

      {/* Uploaded Images Gallery */}
      {uploads.length > 0 && (
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            Uploaded Photos ({uploads.length})
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {uploads.map((upload) => (
              <div key={upload.id} className="relative group">
                <div 
                  className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-colors ${
                    selectedImage === upload.url 
                      ? 'border-blue-500' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleImageSelect(upload.id)}
                >
                  <img
                    src={upload.url}
                    alt={upload.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Selection indicator */}
                  {selectedImage === upload.url && (
                    <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                      <div className="bg-blue-500 rounded-full p-1">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                  
                  {/* Hover actions */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeUploadFile(upload.id);
                        if (selectedImage === upload.url) {
                          setSelectedImage(null);
                          setAnalysis(null);
                        }
                      }}
                      className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                
                <p className="text-xs text-gray-600 mt-2 truncate">
                  {upload.name}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Analysis Results */}
      {selectedImage && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-800">
              Space Analysis
            </h4>
            
            {isAnalyzing && (
              <div className="flex items-center text-blue-600">
                <RotateCcw className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Selected Image */}
            <div>
              <img
                src={selectedImage}
                alt="Selected space"
                className="w-full rounded-lg shadow-md"
              />
            </div>

            {/* Analysis Results */}
            <div className="space-y-4">
              {analysisError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                    <span className="text-red-700">{analysisError}</span>
                  </div>
                </div>
              )}

              {analysis && (
                <div className="space-y-4">
                  {/* Dimensions */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h5 className="font-medium text-green-800 mb-2">Room Dimensions</h5>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="text-green-600">Length:</span>
                        <span className="block font-medium">{Math.round(analysis.dimensions.estimatedLength)}'</span>
                      </div>
                      <div>
                        <span className="text-green-600">Width:</span>
                        <span className="block font-medium">{Math.round(analysis.dimensions.estimatedWidth)}'</span>
                      </div>
                      <div>
                        <span className="text-green-600">Height:</span>
                        <span className="block font-medium">{Math.round(analysis.dimensions.estimatedHeight)}'</span>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-green-600">
                      Confidence: {Math.round(analysis.dimensions.confidence * 100)}%
                    </div>
                  </div>

                  {/* Detected Objects */}
                  {analysis.detected_objects.length > 0 && (
                    <div>
                      <h5 className="font-medium text-gray-800 mb-2">Detected Furniture</h5>
                      <div className="space-y-2">
                        {analysis.detected_objects.slice(0, 5).map((obj, index) => (
                          <div key={index} className="flex justify-between items-center text-sm">
                            <span className="text-gray-700">{obj.name}</span>
                            <span className="text-gray-500">{Math.round(obj.confidence * 100)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Lighting Analysis */}
                  {analysis.lighting_analysis && (
                    <div>
                      <h5 className="font-medium text-gray-800 mb-2">Lighting Analysis</h5>
                      <div className="text-sm space-y-1">
                        <div>
                          <span className="text-gray-600">Brightness:</span>
                          <span className="ml-2">{Math.round(analysis.lighting_analysis.overall_brightness * 100)}%</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Color Temperature:</span>
                          <span className="ml-2">{analysis.lighting_analysis.color_temperature}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Quality Score:</span>
                          <span className="ml-2">{Math.round(analysis.lighting_analysis.quality_score * 100)}%</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Style Detection */}
                  {analysis.architectural_style && (
                    <div>
                      <h5 className="font-medium text-gray-800 mb-2">Architectural Style</h5>
                      <div className="flex flex-wrap gap-2">
                        {analysis.architectural_style.style_detected.map((style, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {style}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Color Palette */}
                  {analysis.color_palette && (
                    <div>
                      <h5 className="font-medium text-gray-800 mb-2">Color Palette</h5>
                      <div className="flex space-x-2">
                        {analysis.color_palette.dominant_colors.slice(0, 5).map((color, index) => (
                          <div
                            key={index}
                            className="w-8 h-8 rounded-full border-2 border-gray-300"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        Mood: {analysis.color_palette.mood}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}