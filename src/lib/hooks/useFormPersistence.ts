'use client';

import { useCallback, useEffect, useMemo } from 'react';
import { useFormProgressStore } from '../store';
import { EventRequirementsForm } from '../types';

interface FormPersistenceConfig {
  autoSave?: boolean;
  autoSaveInterval?: number;
  validateOnStep?: boolean;
  clearOnSubmit?: boolean;
}

interface FormValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  completedFields: string[];
  requiredFields: string[];
}

export const useFormPersistence = (config: FormPersistenceConfig = {}) => {
  const {
    autoSave = true,
    autoSaveInterval = 2000,
    validateOnStep = true,
    clearOnSubmit = true
  } = config;

  const {
    currentStep,
    formData,
    completedSteps,
    isSubmitting,
    errors,
    setStep,
    nextStep,
    prevStep,
    updateFormData,
    markStepComplete,
    setError,
    clearError,
    clearAllErrors,
    resetForm,
    submitForm
  } = useFormProgressStore();

  // Auto-save functionality
  useEffect(() => {
    if (!autoSave) return;

    const interval = setInterval(() => {
      if (Object.keys(formData).length > 0) {
        // Form data is automatically persisted via Zustand persistence
        console.log('Form auto-saved');
      }
    }, autoSaveInterval);

    return () => clearInterval(interval);
  }, [autoSave, autoSaveInterval, formData]);

  // Form validation logic
  const validateStep = useCallback((step: number, data: Partial<EventRequirementsForm>): FormValidationResult => {
    const errors: Record<string, string> = {};
    const completedFields: string[] = [];
    const requiredFields: string[] = [];

    switch (step) {
      case 1: // Event Type Selection
        requiredFields.push('eventType');
        if (!data.eventType) {
          errors.eventType = 'Please select an event type';
        } else {
          completedFields.push('eventType');
        }
        break;

      case 2: // Cultural Preferences
        requiredFields.push('culturalPreferences');
        if (!data.culturalPreferences || data.culturalPreferences.length === 0) {
          errors.culturalPreferences = 'Please select at least one cultural preference';
        } else {
          completedFields.push('culturalPreferences');
        }
        break;

      case 3: // Budget Range
        requiredFields.push('budgetTier');
        if (!data.budgetTier) {
          errors.budgetTier = 'Please select a budget tier';
        } else {
          completedFields.push('budgetTier');
        }
        break;

      case 4: // Guest Details
        requiredFields.push('guestCount', 'ageRange');
        if (!data.guestCount || data.guestCount < 1) {
          errors.guestCount = 'Please enter a valid guest count';
        } else {
          completedFields.push('guestCount');
        }
        if (!data.ageRange) {
          errors.ageRange = 'Please specify the age range';
        } else {
          completedFields.push('ageRange');
        }
        break;

      case 5: // Style Preferences
        requiredFields.push('stylePreferences');
        if (!data.stylePreferences || !data.stylePreferences.colors?.length) {
          errors.stylePreferences = 'Please select at least one color preference';
        } else {
          completedFields.push('stylePreferences');
        }
        break;
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      completedFields,
      requiredFields
    };
  }, []);

  // Enhanced form actions
  const updateField = useCallback((field: string, value: any) => {
    const newData = { ...formData, [field]: value };
    updateFormData(newData);
    
    // Clear error for this field
    if (errors[field]) {
      clearError(field);
    }
  }, [formData, errors, updateFormData, clearError]);

  const updateStylePreferences = useCallback((preferences: Partial<EventRequirementsForm['stylePreferences']>) => {
    const currentPreferences = formData.stylePreferences || {
      colors: [],
      materials: [],
      styles: [],
      mustHave: [],
      mustAvoid: []
    };
    
    updateField('stylePreferences', {
      ...currentPreferences,
      ...preferences
    });
  }, [formData.stylePreferences, updateField]);

  const goToNextStep = useCallback(() => {
    const validation = validateStep(currentStep, formData);
    
    if (validation.isValid) {
      markStepComplete(currentStep);
      nextStep();
      clearAllErrors();
    } else {
      // Set validation errors
      Object.entries(validation.errors).forEach(([field, error]) => {
        setError(field, error);
      });
    }
  }, [currentStep, formData, validateStep, markStepComplete, nextStep, clearAllErrors, setError]);

  const goToPrevStep = useCallback(() => {
    clearAllErrors();
    prevStep();
  }, [clearAllErrors, prevStep]);

  const goToStep = useCallback((step: number) => {
    if (step < currentStep || completedSteps.includes(step - 1)) {
      clearAllErrors();
      setStep(step);
    }
  }, [currentStep, completedSteps, clearAllErrors, setStep]);

  const isStepAccessible = useCallback((step: number) => {
    return step <= currentStep || completedSteps.includes(step - 1);
  }, [currentStep, completedSteps]);

  const isStepComplete = useCallback((step: number) => {
    return completedSteps.includes(step);
  }, [completedSteps]);

  const getStepProgress = useCallback(() => {
    const totalSteps = 5;
    const completedCount = completedSteps.length;
    const currentStepProgress = currentStep > completedCount ? 0.5 : 0;
    
    return Math.round(((completedCount + currentStepProgress) / totalSteps) * 100);
  }, [completedSteps, currentStep]);

  const canSubmit = useCallback(() => {
    const requiredSteps = [1, 2, 3, 4, 5];
    return requiredSteps.every(step => completedSteps.includes(step));
  }, [completedSteps]);

  const handleSubmit = useCallback(async () => {
    if (!canSubmit()) {
      setError('submit', 'Please complete all required steps before submitting');
      return;
    }

    try {
      await submitForm();
      if (clearOnSubmit) {
        resetForm();
      }
    } catch (error) {
      setError('submit', 'Failed to submit form. Please try again.');
    }
  }, [canSubmit, submitForm, clearOnSubmit, resetForm, setError]);

  // Form data helpers
  const getFieldValue = useCallback((field: string) => {
    return formData[field as keyof EventRequirementsForm];
  }, [formData]);

  const hasFieldError = useCallback((field: string) => {
    return Boolean(errors[field]);
  }, [errors]);

  const getFieldError = useCallback((field: string) => {
    return errors[field];
  }, [errors]);

  // Save form as draft
  const saveDraft = useCallback(() => {
    // Draft is automatically saved via Zustand persistence
    console.log('Draft saved');
  }, []);

  // Load form from draft
  const loadDraft = useCallback(() => {
    // Draft is automatically loaded via Zustand persistence
    console.log('Draft loaded');
  }, []);

  // Get current step validation
  const currentStepValidation = useMemo(() => {
    return validateStep(currentStep, formData);
  }, [currentStep, formData, validateStep]);

  // Get form summary
  const getFormSummary = useCallback(() => {
    return {
      eventType: formData.eventType,
      culturalPreferences: formData.culturalPreferences || [],
      budgetTier: formData.budgetTier,
      guestCount: formData.guestCount,
      completedSteps: completedSteps.length,
      totalSteps: 5,
      progress: getStepProgress(),
      isComplete: canSubmit()
    };
  }, [formData, completedSteps, getStepProgress, canSubmit]);

  return {
    // Current state
    currentStep,
    formData,
    completedSteps,
    isSubmitting,
    errors,
    
    // Navigation
    goToNextStep,
    goToPrevStep,
    goToStep,
    
    // Form updates
    updateField,
    updateFormData,
    updateStylePreferences,
    
    // Validation
    validateStep,
    currentStepValidation,
    isStepAccessible,
    isStepComplete,
    canSubmit,
    
    // Form actions
    handleSubmit,
    resetForm,
    saveDraft,
    loadDraft,
    
    // Utilities
    getFieldValue,
    hasFieldError,
    getFieldError,
    getStepProgress,
    getFormSummary,
    
    // Error handling
    setError,
    clearError,
    clearAllErrors,
    
    // Configuration
    config: {
      autoSave,
      autoSaveInterval,
      validateOnStep,
      clearOnSubmit
    }
  };
};

export default useFormPersistence;