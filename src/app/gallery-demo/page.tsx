'use client';

import React from 'react';
import { DesignGallery } from '@/components/sections/DesignGallery';
import { Design } from '@/lib/types';

export default function GalleryDemoPage() {
  const handleDesignSelect = (design: Design) => {
    console.log('Selected design:', design);
    alert(`Selected: ${design.title}\nClick OK to view details (feature coming soon)`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-cultural-primary/5">
      <DesignGallery onDesignSelect={handleDesignSelect} />
    </div>
  );
}