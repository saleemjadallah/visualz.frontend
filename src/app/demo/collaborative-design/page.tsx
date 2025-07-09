'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ClientOnly } from '@/components/ui/ClientOnly';

// Dynamically import the collaborative design component to prevent SSR issues
const CollaborativeDesignPage = dynamic(() => 
  import('@/components/pages/CollaborativeDesignPage').then(mod => ({ default: mod.CollaborativeDesignPage })),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading collaborative design interface...</p>
        </div>
      </div>
    )
  }
);

export default function CollaborativeDesignDemo() {
  // Demo project and design IDs
  const projectId = 'demo-project-123';
  const designId = 'demo-design-456';

  return (
    <div className="w-full h-screen">
      <ClientOnly fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Initializing collaborative design...</p>
          </div>
        </div>
      }>
        <CollaborativeDesignPage 
          projectId={projectId}
          designId={designId}
        />
      </ClientOnly>
    </div>
  );
}