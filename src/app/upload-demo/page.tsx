'use client';

import React from 'react';
import { SpaceUploadInterface } from '@/components/forms/SpaceUploadInterface';
import { UploadedImage } from '@/lib/types';

export default function UploadDemoPage() {
  const handleUploadComplete = (images: UploadedImage[]) => {
    console.log('Upload completed with images:', images);
  };

  const handleAnalysisComplete = (analysis: any) => {
    console.log('Analysis completed:', analysis);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-cultural-primary/5">
      <SpaceUploadInterface 
        onUploadComplete={handleUploadComplete}
        onAnalysisComplete={handleAnalysisComplete}
        maxFiles={10}
      />
    </div>
  );
}