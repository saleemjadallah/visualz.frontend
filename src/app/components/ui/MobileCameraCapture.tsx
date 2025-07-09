'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Camera, Upload, X, RotateCcw, Zap, ZapOff } from 'lucide-react';

interface MobileCameraCaptureProps {
  onCapture: (file: File) => void;
  onClose: () => void;
  maxFileSize?: number;
  quality?: number;
  className?: string;
}

export const MobileCameraCapture: React.FC<MobileCameraCaptureProps> = ({
  onCapture,
  onClose,
  maxFileSize = 10 * 1024 * 1024, // 10MB
  quality = 0.8,
  className = '',
}) => {
  const [isActive, setIsActive] = useState(false);
  const [hasFlash, setHasFlash] = useState(false);
  const [flashMode, setFlashMode] = useState<'off' | 'on' | 'auto'>('off');
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Stop any existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode,
          width: { ideal: 1920, max: 1920 },
          height: { ideal: 1080, max: 1080 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      // Check for flash support
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities();
      setHasFlash((capabilities as any).torch === true);
      
      setIsActive(true);
      setIsLoading(false);
    } catch (err) {
      setError('Camera access denied or not available');
      setIsLoading(false);
      console.error('Error accessing camera:', err);
    }
  }, [facingMode]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsActive(false);
  }, []);

  const toggleFlash = useCallback(async () => {
    if (!streamRef.current || !hasFlash) return;

    try {
      const track = streamRef.current.getVideoTracks()[0];
      const newFlashMode = flashMode === 'off' ? 'on' : 'off';
      
      await track.applyConstraints({
        advanced: [{ torch: newFlashMode === 'on' } as any]
      });
      
      setFlashMode(newFlashMode);
    } catch (err) {
      console.error('Error toggling flash:', err);
    }
  }, [flashMode, hasFlash]);

  const switchCamera = useCallback(() => {
    const newFacingMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newFacingMode);
    if (isActive) {
      stopCamera();
      setTimeout(() => startCamera(), 100);
    }
  }, [facingMode, isActive, startCamera, stopCamera]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0);

    // Convert to blob
    canvas.toBlob(
      (blob) => {
        if (blob) {
          // Check file size
          if (blob.size > maxFileSize) {
            setError(`File size too large. Maximum ${Math.round(maxFileSize / (1024 * 1024))}MB allowed.`);
            return;
          }

          // Create file
          const file = new File([blob], `photo_${Date.now()}.jpg`, {
            type: 'image/jpeg',
          });

          onCapture(file);
          stopCamera();
        }
      },
      'image/jpeg',
      quality
    );
  }, [maxFileSize, quality, onCapture, stopCamera]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > maxFileSize) {
        setError(`File size too large. Maximum ${Math.round(maxFileSize / (1024 * 1024))}MB allowed.`);
        return;
      }
      
      onCapture(file);
      stopCamera();
    }
  }, [maxFileSize, onCapture, stopCamera]);

  const handleClose = useCallback(() => {
    stopCamera();
    onClose();
  }, [stopCamera, onClose]);

  // Clean up on unmount
  React.useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <div className={`fixed inset-0 z-50 bg-black ${className}`}>
      <div className="relative h-full flex flex-col">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
          <button
            onClick={handleClose}
            className="p-2 rounded-full bg-black/30 text-white ios-optimized android-optimized"
            style={{ minWidth: '40px', minHeight: '40px' }}
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-center space-x-4">
            {hasFlash && (
              <button
                onClick={toggleFlash}
                className={`p-2 rounded-full ${flashMode === 'on' ? 'bg-yellow-500' : 'bg-black/30'} text-white ios-optimized android-optimized`}
                style={{ minWidth: '40px', minHeight: '40px' }}
              >
                {flashMode === 'on' ? <Zap className="w-5 h-5" /> : <ZapOff className="w-5 h-5" />}
              </button>
            )}
            
            <button
              onClick={switchCamera}
              className="p-2 rounded-full bg-black/30 text-white ios-optimized android-optimized"
              style={{ minWidth: '40px', minHeight: '40px' }}
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Camera View */}
        <div className="flex-1 relative overflow-hidden">
          {isActive ? (
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              muted
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-900">
              {isLoading ? (
                <div className="text-white text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                  <p>Starting camera...</p>
                </div>
              ) : (
                <div className="text-white text-center p-8">
                  <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">Camera not active</p>
                  {error && <p className="text-red-400 text-sm">{error}</p>}
                </div>
              )}
            </div>
          )}

          {/* Grid overlay for better composition */}
          {isActive && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="w-full h-full grid grid-cols-3 grid-rows-3">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="border border-white/20"></div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/50 to-transparent">
          <div className="flex items-center justify-center space-x-8">
            {/* Gallery/Upload */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-4 rounded-full bg-black/30 text-white ios-optimized android-optimized"
              style={{ minWidth: '56px', minHeight: '56px' }}
            >
              <Upload className="w-6 h-6" />
            </button>

            {/* Capture Button */}
            <button
              onClick={isActive ? capturePhoto : startCamera}
              disabled={isLoading}
              className={`
                p-6 rounded-full border-4 border-white transition-all duration-200
                ${isActive 
                  ? 'bg-white text-black hover:bg-gray-100' 
                  : 'bg-black/30 text-white hover:bg-black/50'
                }
                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                ios-optimized android-optimized
              `}
              style={{ minWidth: '80px', minHeight: '80px' }}
            >
              <Camera className="w-8 h-8" />
            </button>

            {/* Placeholder for symmetry */}
            <div style={{ width: '56px', height: '56px' }} />
          </div>

          {/* Instructions */}
          <div className="text-center mt-4">
            <p className="text-white text-sm opacity-75">
              {isActive 
                ? 'Tap the camera button to capture' 
                : 'Tap the camera button to start'
              }
            </p>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Hidden canvas for photo processing */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

interface MobileCameraButtonProps {
  onCapture: (file: File) => void;
  buttonText?: string;
  className?: string;
}

export const MobileCameraButton: React.FC<MobileCameraButtonProps> = ({
  onCapture,
  buttonText = 'Take Photo',
  className = '',
}) => {
  const [showCamera, setShowCamera] = useState(false);

  const handleCapture = (file: File) => {
    onCapture(file);
    setShowCamera(false);
  };

  // Check if camera is available
  const isCameraAvailable = typeof navigator !== 'undefined' && 
    'mediaDevices' in navigator && 
    'getUserMedia' in navigator.mediaDevices;

  if (!isCameraAvailable) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setShowCamera(true)}
        className={`btn-cultural ${className} ios-optimized android-optimized`}
      >
        <Camera className="w-5 h-5 mr-2" />
        {buttonText}
      </button>

      {showCamera && (
        <MobileCameraCapture
          onCapture={handleCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
    </>
  );
};

export default MobileCameraCapture;