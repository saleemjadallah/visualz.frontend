'use client';

import React from 'react';
import { Search, LayoutGrid } from 'lucide-react';
import Card from '../ui/Card';

const DesignGallery = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">
              Design Gallery
            </h2>
            <p className="text-xl text-gray-600">
              Explore culturally-intelligent designs created by our AI
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-6 lg:mt-0">
            <div className="flex items-center space-x-2">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search designs..."
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center">
                <LayoutGrid className="w-12 h-12 text-gray-400" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">
                  Sample Design {i}
                </h3>
                <p className="text-gray-600">Beautiful cultural design example</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DesignGallery;