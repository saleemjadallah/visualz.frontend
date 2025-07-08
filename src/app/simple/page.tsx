'use client';

import React from 'react';

export default function Simple() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          DesignVisualz is Working! 🎉
        </h1>
        <p className="text-xl text-gray-700 mb-8">
          Your Next.js server is running successfully on port 3456.
        </p>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Features:</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Cultural theming system</li>
            <li>Premium UI components</li>
            <li>Responsive design</li>
            <li>AI-powered event design</li>
          </ul>
        </div>
      </div>
    </div>
  );
}