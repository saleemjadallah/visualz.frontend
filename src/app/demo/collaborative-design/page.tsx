'use client';

import React from 'react';
import { CollaborativeDesignPage } from '@/components/pages/CollaborativeDesignPage';

export default function CollaborativeDesignDemo() {
  // Demo project and design IDs
  const projectId = 'demo-project-123';
  const designId = 'demo-design-456';

  return (
    <div className="w-full h-screen">
      <CollaborativeDesignPage 
        projectId={projectId}
        designId={designId}
      />
    </div>
  );
}