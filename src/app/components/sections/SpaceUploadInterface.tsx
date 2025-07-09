'use client';

import React, { useState } from 'react';
import { Upload, Camera, Sparkles, Image, CheckCircle } from 'lucide-react';

const SpaceUploadInterface = () => {
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'success'>('idle');
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const handleFileUpload = () => {
    setUploadState('uploading');
    // Simulate upload process
    setTimeout(() => {
      setUploadState('success');
      setUploadedFiles(['living-room-1.jpg', 'living-room-2.jpg', 'kitchen-view.jpg']);
    }, 2000);
  };

  const features = [
    {
      icon: Sparkles,
      title: 'AI Space Analysis',
      description: 'Our AI analyzes dimensions, lighting, and architectural features'
    },
    {
      icon: Image,
      title: 'Multi-Angle Capture',
      description: 'Upload multiple photos for comprehensive space understanding'
    },
    {
      icon: CheckCircle,
      title: 'Instant Results',
      description: 'Get immediate feedback on your space potential and recommendations'
    }
  ];

  return (
    <section className="section-cultural pattern-japanese">
      <div className="container-cultural">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 animate-gentle-float"
               style={{ backgroundColor: 'var(--cultural-accent)' }}>
            <Camera className="w-8 h-8" style={{ color: 'var(--cultural-text)' }} />
          </div>
          <h2 className="hero-title" style={{ color: 'var(--cultural-text)' }}>
            Capture Your Space
          </h2>
          <p className="section-subtitle">
            Upload photos of your space and watch our AI analyze dimensions, lighting, and potential
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <div key={index} className="card-cultural p-6 text-center hover:transform hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                   style={{ backgroundColor: 'var(--cultural-soft)' }}>
                <feature.icon className="w-6 h-6" style={{ color: 'var(--cultural-accent)' }} />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--cultural-text)' }}>
                {feature.title}
              </h3>
              <p className="text-sm" style={{ color: 'var(--cultural-text-light)' }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        
        {/* Upload Interface */}
        <div className="card-cultural p-8 max-w-2xl mx-auto">
          <div 
            className="border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 cursor-pointer"
            style={{ 
              borderColor: uploadState === 'success' ? 'var(--cultural-accent)' : 'var(--cultural-secondary)',
              backgroundColor: uploadState === 'success' ? 'var(--cultural-soft)' : 'transparent'
            }}
            onClick={uploadState === 'idle' ? handleFileUpload : undefined}
          >
            {uploadState === 'idle' && (
              <>
                <Upload className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--cultural-text-light)' }} />
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--cultural-text)' }}>
                  Drop photos here or click to upload
                </h3>
                <p className="text-sm mb-6" style={{ color: 'var(--cultural-text-light)' }}>
                  Multiple angles help our AI better understand your space
                </p>
              </>
            )}
            
            {uploadState === 'uploading' && (
              <>
                <div className="w-16 h-16 mx-auto mb-4 animate-spin rounded-full border-4 border-t-4"
                     style={{ 
                       borderColor: 'var(--cultural-soft)',
                       borderTopColor: 'var(--cultural-accent)'
                     }} />
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--cultural-text)' }}>
                  Analyzing your space...
                </h3>
                <p className="text-sm" style={{ color: 'var(--cultural-text-light)' }}>
                  Our AI is processing your photos
                </p>
              </>
            )}
            
            {uploadState === 'success' && (
              <>
                <CheckCircle className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--cultural-accent)' }} />
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--cultural-text)' }}>
                  Analysis Complete!
                </h3>
                <p className="text-sm mb-4" style={{ color: 'var(--cultural-text-light)' }}>
                  {uploadedFiles.length} photos processed successfully
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {uploadedFiles.map((file, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{ 
                        backgroundColor: 'var(--cultural-accent)',
                        color: 'var(--cultural-text)'
                      }}
                    >
                      {file}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
          
          {uploadState === 'idle' && (
            <div className="flex justify-center space-x-3 mt-6">
              <button 
                className="btn-cultural flex items-center"
                onClick={handleFileUpload}
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose Files
              </button>
              <button 
                className="btn-cultural-secondary flex items-center"
                onClick={handleFileUpload}
              >
                <Camera className="w-4 h-4 mr-2" />
                Take Photo
              </button>
            </div>
          )}
          
          {uploadState === 'success' && (
            <div className="text-center mt-6">
              <button 
                className="btn-cultural"
                onClick={() => {
                  setUploadState('idle');
                  setUploadedFiles([]);
                }}
              >
                Upload More Photos
              </button>
            </div>
          )}
          
          {/* Tips */}
          <div className="mt-8 p-4 rounded-xl" style={{ backgroundColor: 'var(--cultural-soft)' }}>
            <h4 className="font-semibold mb-2" style={{ color: 'var(--cultural-text)' }}>
              📷 Photography Tips:
            </h4>
            <ul className="text-sm space-y-1" style={{ color: 'var(--cultural-text-light)' }}>
              <li>• Take photos from multiple corners of the room</li>
              <li>• Include ceiling and floor in your shots</li>
              <li>• Capture any architectural features or limitations</li>
              <li>• Use good lighting for better AI analysis</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpaceUploadInterface;