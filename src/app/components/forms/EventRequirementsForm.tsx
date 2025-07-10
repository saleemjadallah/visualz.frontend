'use client';

import React from 'react';
import { ChevronRight, Clock, Users, DollarSign, Heart } from 'lucide-react';
import { useFormPersistence } from '../../../lib/hooks/useFormPersistence';
import { EventType } from '../../../lib/types';

const EventRequirementsForm = () => {
  const {
    currentStep,
    formData,
    goToNextStep,
    goToPrevStep,
    updateField,
    hasFieldError,
    getFieldError,
    getStepProgress,
    isSubmitting,
    handleSubmit
  } = useFormPersistence();
  
  const totalSteps = 5;
  
  const eventTypes = [
    { 
      id: 'birthday' as EventType, 
      label: 'Birthday Celebration', 
      icon: '🎂', 
      description: 'Personal milestone celebrations',
      color: 'from-pink-400 to-red-400'
    },
    { 
      id: 'wedding' as EventType, 
      label: 'Wedding Reception', 
      icon: '💒', 
      description: 'Sacred union celebrations',
      color: 'from-purple-400 to-pink-400'
    },
    { 
      id: 'corporate' as EventType, 
      label: 'Corporate Event', 
      icon: '🏢', 
      description: 'Professional gatherings',
      color: 'from-blue-400 to-indigo-400'
    },
    { 
      id: 'cultural' as EventType, 
      label: 'Cultural Festival', 
      icon: '🎭', 
      description: 'Traditional celebrations',
      color: 'from-green-400 to-teal-400'
    }
  ];

  const handleEventTypeSelect = (eventType: EventType) => {
    updateField('eventType', eventType);
    goToNextStep();
  };

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="relative max-w-md mx-auto">
              <div className="flex items-center justify-between mb-4">
                {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
                  <div
                    key={step}
                    className={`
                      flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold text-sm
                      transition-all duration-300 ${
                        step <= currentStep
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'bg-white border-gray-300 text-gray-500'
                      }
                    `}
                  >
                    {step}
                  </div>
                ))}
              </div>
              <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200 -z-10">
                <div 
                  className="h-full bg-blue-600 transition-all duration-500 ease-out"
                  style={{ width: `${getStepProgress()}%` }}
                ></div>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 mt-4">
              Step {currentStep} of {totalSteps} • Takes about 3 minutes
            </p>
          </div>
          
          {/* Form Card */}
          <div className="card-hover p-8 lg:p-12">
            {currentStep === 1 && (
              <div className="space-y-8 animate-slide-up">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto">
                    <Heart className="w-8 h-8 text-blue-600" />
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-display font-bold text-gray-900">
                    What's the occasion?
                  </h2>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Let's start with the type of celebration you're planning
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {eventTypes.map((event) => (
                    <button
                      key={event.id}
                      onClick={() => handleEventTypeSelect(event.id)}
                      className="group relative p-6 rounded-2xl border-2 border-gray-200 hover:border-blue-500 transition-all duration-300 hover:shadow-lg text-left"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${event.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity`}></div>
                      <div className="relative">
                        <div className="text-4xl mb-3">{event.icon}</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.label}</h3>
                        <p className="text-gray-600">{event.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-8 animate-slide-up">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto">
                    <Users className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-display font-bold text-gray-900">
                    How many guests?
                  </h2>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    This helps us design the perfect space for your group size
                  </p>
                </div>

                <div className="max-w-md mx-auto space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { id: 10, label: 'Intimate', range: '1-10 guests' },
                      { id: 30, label: 'Small', range: '11-30 guests' },
                      { id: 75, label: 'Medium', range: '31-75 guests' },
                      { id: 150, label: 'Large', range: '76-150 guests' },
                      { id: 300, label: 'X-Large', range: '150-300 guests' },
                      { id: 500, label: 'Massive', range: '300+ guests' }
                    ].map((option) => (
                      <button
                        key={option.id}
                        onClick={() => updateField('guestCount', option.id)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          formData.guestCount === option.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-semibold text-gray-900">{option.range}</div>
                        <div className="text-sm text-gray-600">{option.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center mt-12">
              {currentStep > 1 && (
                <button
                  onClick={goToPrevStep}
                  className="btn-secondary"
                >
                  Back
                </button>
              )}
              
              <div className="flex space-x-2">
                {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
                  <div
                    key={step}
                    className={`w-2 h-2 rounded-full transition-all ${
                      step === currentStep ? 'w-8 bg-blue-600' : 'bg-gray-300'
                    }`}
                  ></div>
                ))}
              </div>
              
              <button 
                onClick={currentStep === totalSteps ? handleSubmit : goToNextStep}
                disabled={isSubmitting}
                className="btn-primary group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Generating...' : currentStep === totalSteps ? 'Generate Design' : 'Next Step'}
                <ChevronRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventRequirementsForm;