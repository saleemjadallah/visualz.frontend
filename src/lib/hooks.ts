// Main hooks file - exports all custom hooks
export * from './hooks';

// Store hooks
export * from './store';

// Additional utility hooks can be added here
export { default as useScrollAnimation } from './hooks/useScrollAnimation';
export { default as useCulturalTheme } from './hooks/useCulturalTheme';
export { default as useCulturalValidation } from './hooks/useCulturalValidation';
export { default as useFormPersistence } from './hooks/useFormPersistence';
export { default as useImageUpload } from './hooks/useImageUpload';