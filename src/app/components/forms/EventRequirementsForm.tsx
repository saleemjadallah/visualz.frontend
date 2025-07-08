'use client';

import React from 'react';
import Card from '../ui/Card';

const EventRequirementsForm = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">
            Tell Us About Your Vision
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Help our AI understand your cultural preferences and design dreams
          </p>
          
          <Card className="p-8">
            <div className="text-center text-gray-500">
              <p className="text-lg">Event Requirements Form</p>
              <p className="text-sm mt-2">Multi-step form coming soon...</p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default EventRequirementsForm;