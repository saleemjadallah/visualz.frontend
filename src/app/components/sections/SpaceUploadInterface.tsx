'use client';

import React from 'react';
import { Upload, Camera } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

const SpaceUploadInterface = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">
            Capture Your Space
          </h2>
          <p className="text-xl text-gray-600">
            Upload photos of your space and watch our AI analyze dimensions, lighting, and potential
          </p>
        </div>
        
        <Card className="p-8 max-w-2xl mx-auto">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-gray-400 transition-colors">
            <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Drop photos here or click to upload
            </h3>
            <p className="text-gray-600 text-sm mb-6">
              Multiple angles help our AI better understand your space
            </p>
            <div className="flex justify-center space-x-3">
              <Button variant="primary">
                <Upload className="w-4 h-4 mr-2" />
                Choose Files
              </Button>
              <Button variant="secondary">
                <Camera className="w-4 h-4 mr-2" />
                Take Photo
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default SpaceUploadInterface;