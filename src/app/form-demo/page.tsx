'use client';

import React from 'react';
import { EventRequirementsForm } from '@/components/forms/EventRequirementsForm';
import { EventRequirementsForm as FormData } from '@/lib/types';

export default function FormDemoPage() {
  const handleFormComplete = (data: FormData) => {
    console.log('Form completed with data:', data);
    alert('Form completed! Check console for data.');
  };

  const handleStepChange = (step: number) => {
    console.log('Current step:', step);
  };

  return (
    <EventRequirementsForm 
      onComplete={handleFormComplete}
      onStepChange={handleStepChange}
    />
  );
}