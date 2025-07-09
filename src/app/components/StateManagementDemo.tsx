'use client';

import React from 'react';
import { useCulturalTheme } from '../../lib/hooks/useCulturalTheme';
import { useFormPersistence } from '../../lib/hooks/useFormPersistence';
import { useImageUpload } from '../../lib/hooks/useImageUpload';
import { useDesignGalleryStore } from '../../lib/store';

const StateManagementDemo = () => {
  const { currentTheme, setTheme, getThemeInfo } = useCulturalTheme();
  const { currentStep, formData, getStepProgress } = useFormPersistence();
  const { uploads, openFileDialog, totalUploads } = useImageUpload();
  const { designs, searchQuery, setSearchQuery } = useDesignGalleryStore();

  const themeInfo = getThemeInfo();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-cultural-heading">
        State Management Demo
      </h1>
      
      {/* Cultural Theme Demo */}
      <div className="card-cultural p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Cultural Theme State</h2>
        <div className="space-y-4">
          <div>
            <strong>Current Theme:</strong> {currentTheme}
          </div>
          <div>
            <strong>Theme Name:</strong> {themeInfo?.name}
          </div>
          <div>
            <strong>Description:</strong> {themeInfo?.description}
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => setTheme('japanese')}
              className="btn-cultural-secondary"
            >
              Japanese
            </button>
            <button 
              onClick={() => setTheme('scandinavian')}
              className="btn-cultural-secondary"
            >
              Scandinavian
            </button>
            <button 
              onClick={() => setTheme('italian')}
              className="btn-cultural-secondary"
            >
              Italian
            </button>
            <button 
              onClick={() => setTheme('french')}
              className="btn-cultural-secondary"
            >
              French
            </button>
          </div>
        </div>
      </div>

      {/* Form State Demo */}
      <div className="card-cultural p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Form State</h2>
        <div className="space-y-4">
          <div>
            <strong>Current Step:</strong> {currentStep} / 5
          </div>
          <div>
            <strong>Progress:</strong> {getStepProgress()}%
          </div>
          <div>
            <strong>Event Type:</strong> {formData.eventType || 'Not selected'}
          </div>
          <div>
            <strong>Guest Count:</strong> {formData.guestCount || 'Not specified'}
          </div>
          <div>
            <strong>Budget Tier:</strong> {formData.budgetTier || 'Not selected'}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${getStepProgress()}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Upload State Demo */}
      <div className="card-cultural p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Upload State</h2>
        <div className="space-y-4">
          <div>
            <strong>Total Uploads:</strong> {totalUploads}
          </div>
          <div>
            <strong>Uploaded Files:</strong>
            <ul className="ml-4 mt-2">
              {uploads.map((upload) => (
                <li key={upload.id} className="text-sm text-gray-600">
                  {upload.name} ({(upload.size / 1024 / 1024).toFixed(2)} MB)
                </li>
              ))}
            </ul>
          </div>
          <button 
            onClick={openFileDialog}
            className="btn-cultural"
          >
            Upload Images
          </button>
        </div>
      </div>

      {/* Design Gallery State Demo */}
      <div className="card-cultural p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Design Gallery State</h2>
        <div className="space-y-4">
          <div>
            <strong>Total Designs:</strong> {designs.length}
          </div>
          <div>
            <strong>Search Query:</strong> {searchQuery || 'None'}
          </div>
          <div>
            <input
              type="text"
              placeholder="Search designs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Color Demonstration */}
      <div className="card-cultural p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Cultural Colors</h2>
        <div className="grid grid-cols-5 gap-4">
          <div className="space-y-2">
            <div className="w-16 h-16 rounded-lg" style={{ backgroundColor: 'var(--cultural-primary)' }}></div>
            <div className="text-sm">Primary</div>
          </div>
          <div className="space-y-2">
            <div className="w-16 h-16 rounded-lg" style={{ backgroundColor: 'var(--cultural-secondary)' }}></div>
            <div className="text-sm">Secondary</div>
          </div>
          <div className="space-y-2">
            <div className="w-16 h-16 rounded-lg" style={{ backgroundColor: 'var(--cultural-accent)' }}></div>
            <div className="text-sm">Accent</div>
          </div>
          <div className="space-y-2">
            <div className="w-16 h-16 rounded-lg" style={{ backgroundColor: 'var(--cultural-neutral)' }}></div>
            <div className="text-sm">Neutral</div>
          </div>
          <div className="space-y-2">
            <div className="w-16 h-16 rounded-lg" style={{ backgroundColor: 'var(--cultural-soft)' }}></div>
            <div className="text-sm">Soft</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StateManagementDemo;