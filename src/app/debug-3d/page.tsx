'use client';

import { useEffect, useState } from 'react';

export default function Debug3DPage() {
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Try to load the problematic component
    import('@/components/visualization/GeneratedDesign3D')
      .then((module) => {
        console.log('Module loaded successfully:', module);
        setLoaded(true);
      })
      .catch((err) => {
        console.error('Failed to load module:', err);
        setError(err.toString());
      });
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">3D Module Debug</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Error loading module:</p>
          <pre className="mt-2 text-sm">{error}</pre>
        </div>
      )}
      
      {loaded && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <p>Module loaded successfully!</p>
        </div>
      )}
      
      <div className="mt-4">
        <p>Check the browser console for more details.</p>
      </div>
    </div>
  );
}