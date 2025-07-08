'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  Camera, 
  Image as ImageIcon, 
  X, 
  Eye, 
  Download,
  AlertCircle,
  CheckCircle,
  Loader2,
  FileText,
  Maximize2,
  RotateCw,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/layout/Container';
import { useTheme } from '@/components/cultural/ThemeProvider';
import { cn } from '@/lib/utils';
import { UploadedImage } from '@/lib/types';

interface SpaceUploadInterfaceProps {
  onUploadComplete?: (images: UploadedImage[]) => void;
  onAnalysisComplete?: (analysis: any) => void;
  maxFiles?: number;
  className?: string;
}

const SpaceUploadInterface: React.FC<SpaceUploadInterfaceProps> = ({
  onUploadComplete,
  onAnalysisComplete,
  maxFiles = 10,
  className
}) => {
  const { currentTheme } = useTheme();
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<UploadedImage | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleFiles = async (files: File[]) => {
    setIsUploading(true);
    
    const validFiles = files.filter(file => {
      return file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024; // 10MB limit
    });

    const newImages: UploadedImage[] = [];

    for (const file of validFiles) {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      
      const newImage: UploadedImage = {
        id: Math.random().toString(36).substr(2, 9),
        url: previewUrl,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date(),
        // Mock analysis - in real app this would come from AI
        analysis: {
          dimensions: {
            estimatedLength: Math.floor(Math.random() * 20) + 10,
            estimatedWidth: Math.floor(Math.random() * 15) + 8,
            estimatedHeight: Math.floor(Math.random() * 5) + 8
          },
          lighting: {
            type: ['natural', 'artificial', 'mixed'][Math.floor(Math.random() * 3)] as any,
            quality: ['excellent', 'good', 'fair'][Math.floor(Math.random() * 3)] as any,
            direction: ['north', 'south', 'east', 'west']
          },
          objects: [
            { name: 'table', confidence: 0.95, position: { x: 100, y: 150, width: 200, height: 100 } },
            { name: 'chair', confidence: 0.88, position: { x: 50, y: 200, width: 80, height: 120 } },
            { name: 'window', confidence: 0.92, position: { x: 300, y: 50, width: 150, height: 200 } }
          ],
          style: {
            current: ['modern', 'minimalist'],
            recommendations: ['scandinavian', 'japanese', 'contemporary']
          }
        }
      };
      
      newImages.push(newImage);
    }

    setUploadedImages(prev => [...prev, ...newImages]);
    setIsUploading(false);
    
    // Simulate AI analysis
    if (newImages.length > 0) {
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        onUploadComplete?.(newImages);
        onAnalysisComplete?.(newImages[0].analysis);
      }, 2000);
    }
  };

  const removeImage = (id: string) => {
    setUploadedImages(prev => prev.filter(img => img.id !== id));
    if (selectedImage?.id === id) {
      setSelectedImage(null);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const triggerCameraCapture = () => {
    cameraInputRef.current?.click();
  };

  return (
    <div className={cn("space-y-8", className)}>
      <Container maxWidth="2xl" padding="lg">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-cultural-primary/10 rounded-full mb-4"
          >
            <Camera className="w-4 h-4 text-cultural-primary" />
            <span className="text-sm font-medium text-cultural-primary">Space Analysis</span>
          </motion.div>
          <h1 className="text-3xl lg:text-4xl font-bold text-primary-900 mb-2">
            Upload your space photos
          </h1>
          <p className="text-lg text-primary-600 max-w-2xl mx-auto">
            Our AI will analyze your space to understand dimensions, lighting, and existing elements
          </p>
        </div>

        {/* Upload Area */}
        <Card className="p-8 mb-8">
          <div
            className={cn(
              "border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300",
              dragActive
                ? "border-cultural-primary bg-cultural-primary/5"
                : "border-primary-300 hover:border-cultural-primary/50"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {isUploading ? (
              <div className="space-y-4">
                <Loader2 className="w-12 h-12 text-cultural-primary mx-auto animate-spin" />
                <p className="text-lg font-medium text-primary-900">Uploading images...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Upload Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-20 h-20 bg-cultural-primary/10 rounded-2xl flex items-center justify-center mx-auto"
                >
                  <Upload className="w-10 h-10 text-cultural-primary" />
                </motion.div>

                {/* Upload Text */}
                <div>
                  <h3 className="text-xl font-semibold text-primary-900 mb-2">
                    Drag and drop your photos here
                  </h3>
                  <p className="text-primary-600 mb-6">
                    Or use the buttons below to upload from device or camera
                  </p>
                </div>

                {/* Upload Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    variant="cultural"
                    size="lg"
                    icon={<ImageIcon />}
                    onClick={triggerFileUpload}
                    className="shadow-lg"
                  >
                    Choose Files
                  </Button>
                  <Button
                    variant="ghost"
                    size="lg"
                    icon={<Camera />}
                    onClick={triggerCameraCapture}
                    className="border-2 border-primary-200 hover:border-cultural-primary"
                  >
                    Take Photo
                  </Button>
                </div>

                {/* File Info */}
                <div className="text-sm text-primary-500 space-y-1">
                  <p>Supports: JPG, PNG, WEBP (Max 10MB each)</p>
                  <p>Upload up to {maxFiles} images for best analysis</p>
                </div>
              </div>
            )}
          </div>

          {/* Hidden File Inputs */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
            className="hidden"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
            className="hidden"
          />
        </Card>

        {/* AI Analysis Status */}
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="p-6 bg-gradient-to-r from-cultural-primary/10 to-cultural-secondary/10">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-cultural-primary rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white animate-pulse" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-primary-900 mb-1">
                    AI Analysis in Progress
                  </h3>
                  <p className="text-primary-600 text-sm">
                    Analyzing space dimensions, lighting conditions, and existing elements...
                  </p>
                </div>
                <Loader2 className="w-6 h-6 text-cultural-primary animate-spin" />
              </div>
            </Card>
          </motion.div>
        )}

        {/* Uploaded Images Grid */}
        {uploadedImages.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-primary-900">
                Uploaded Images ({uploadedImages.length})
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setUploadedImages([])}
                className="text-red-600 hover:text-red-700"
              >
                Clear All
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {uploadedImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ImagePreviewCard
                    image={image}
                    onRemove={() => removeImage(image.id)}
                    onView={() => setSelectedImage(image)}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Image Detail Modal */}
        <AnimatePresence>
          {selectedImage && (
            <ImageDetailModal
              image={selectedImage}
              onClose={() => setSelectedImage(null)}
            />
          )}
        </AnimatePresence>
      </Container>
    </div>
  );
};

// Image Preview Card Component
interface ImagePreviewCardProps {
  image: UploadedImage;
  onRemove: () => void;
  onView: () => void;
}

const ImagePreviewCard: React.FC<ImagePreviewCardProps> = ({
  image,
  onRemove,
  onView
}) => {
  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-square">
        <img
          src={image.url}
          alt={image.name}
          className="w-full h-full object-cover"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            icon={<Eye />}
            onClick={onView}
            className="text-white border-white hover:bg-white/20"
          >
            View
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={<X />}
            onClick={onRemove}
            className="text-white border-white hover:bg-red-500/20"
          >
            Remove
          </Button>
        </div>

        {/* Analysis Status */}
        {image.analysis && (
          <div className="absolute top-2 right-2">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
          </div>
        )}
      </div>

      <div className="p-3">
        <h4 className="font-medium text-primary-900 truncate text-sm">
          {image.name}
        </h4>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-primary-500">
            {(image.size / 1024 / 1024).toFixed(1)} MB
          </span>
          {image.analysis && (
            <span className="text-xs text-green-600 font-medium">
              Analyzed
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};

// Image Detail Modal Component
interface ImageDetailModalProps {
  image: UploadedImage;
  onClose: () => void;
}

const ImageDetailModal: React.FC<ImageDetailModalProps> = ({
  image,
  onClose
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-primary-200">
          <h3 className="text-xl font-bold text-primary-900">{image.name}</h3>
          <Button
            variant="ghost"
            size="sm"
            icon={<X />}
            onClick={onClose}
          />
        </div>

        <div className="grid lg:grid-cols-2 h-[calc(90vh-80px)]">
          {/* Image */}
          <div className="flex items-center justify-center p-6 bg-primary-50">
            <img
              src={image.url}
              alt={image.name}
              className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
            />
          </div>

          {/* Analysis Results */}
          <div className="p-6 overflow-y-auto">
            <h4 className="text-lg font-semibold text-primary-900 mb-4">
              AI Analysis Results
            </h4>

            {image.analysis && (
              <div className="space-y-6">
                {/* Dimensions */}
                <div>
                  <h5 className="font-medium text-primary-800 mb-2">Estimated Dimensions</h5>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center p-3 bg-primary-50 rounded-lg">
                      <div className="font-semibold text-primary-900">
                        {image.analysis.dimensions.estimatedLength}'
                      </div>
                      <div className="text-primary-600">Length</div>
                    </div>
                    <div className="text-center p-3 bg-primary-50 rounded-lg">
                      <div className="font-semibold text-primary-900">
                        {image.analysis.dimensions.estimatedWidth}'
                      </div>
                      <div className="text-primary-600">Width</div>
                    </div>
                    <div className="text-center p-3 bg-primary-50 rounded-lg">
                      <div className="font-semibold text-primary-900">
                        {image.analysis.dimensions.estimatedHeight}'
                      </div>
                      <div className="text-primary-600">Height</div>
                    </div>
                  </div>
                </div>

                {/* Lighting */}
                <div>
                  <h5 className="font-medium text-primary-800 mb-2">Lighting Analysis</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-primary-600">Type:</span>
                      <span className="font-medium capitalize">{image.analysis.lighting.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-primary-600">Quality:</span>
                      <span className="font-medium capitalize">{image.analysis.lighting.quality}</span>
                    </div>
                  </div>
                </div>

                {/* Detected Objects */}
                <div>
                  <h5 className="font-medium text-primary-800 mb-2">Detected Objects</h5>
                  <div className="space-y-2">
                    {image.analysis.objects.map((obj, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-primary-50 rounded text-sm">
                        <span className="font-medium capitalize">{obj.name}</span>
                        <span className="text-primary-600">{Math.round(obj.confidence * 100)}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Style Recommendations */}
                <div>
                  <h5 className="font-medium text-primary-800 mb-2">Style Recommendations</h5>
                  <div className="flex flex-wrap gap-2">
                    {image.analysis.style.recommendations.map((style, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-cultural-primary/10 text-cultural-primary rounded-full text-sm font-medium capitalize"
                      >
                        {style}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SpaceUploadInterface;
export { SpaceUploadInterface };