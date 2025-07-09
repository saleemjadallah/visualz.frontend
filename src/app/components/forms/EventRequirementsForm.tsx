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
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-gray-900 mb-6">
              Tell Us About Your Vision
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Help our AI understand your cultural preferences and design dreams
            </p>
            
            {/* Progress Bar */}
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
                    <Clock className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-display font-semibold text-gray-900">
                    What type of event are you planning?
                  </h3>
                  <p className="text-gray-600">
                    Choose the category that best describes your celebration
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {eventTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => handleEventTypeSelect(type.id)}
                      className={`group relative overflow-hidden p-8 rounded-2xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl text-left ${
                        formData.eventType === type.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-transparent'
                      }`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                      <div className="relative">
                        <div className="text-4xl mb-4">{type.icon}</div>
                        <h4 className="text-xl font-semibold text-gray-900 mb-2">{type.label}</h4>
                        <p className="text-gray-600">{type.description}</p>
                        {formData.eventType === type.id && (
                          <div className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                
                {hasFieldError('eventType') && (
                  <div className="text-red-500 text-sm mt-4 text-center">
                    {getFieldError('eventType')}
                  </div>
                )}
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-8 animate-slide-up">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto">
                    <Users className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-display font-semibold text-gray-900">
                    How many guests will attend?
                  </h3>
                  <p className="text-gray-600">
                    This helps us design the perfect space and layout
                  </p>
                </div>
                
                <div className="max-w-md mx-auto space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { range: '1-10', label: 'Intimate' },
                      { range: '11-25', label: 'Small' },
                      { range: '26-50', label: 'Medium' },
                      { range: '51-100', label: 'Large' },
                      { range: '100+', label: 'Grand' }
                    ].map((option, index) => (
                      <button
                        key={index}
                        className="p-4 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-center"
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
              <button 
                onClick={goToPrevStep}
                disabled={currentStep === 1}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <div className="flex space-x-2">
                {Array.from({ length: totalSteps }, (_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i + 1 === currentStep ? 'bg-blue-600 w-8' : 'bg-gray-300'
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