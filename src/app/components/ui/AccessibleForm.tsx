'use client';

import React, { useState, useRef, useEffect } from 'react';
import { AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { aria, focusManagement, screenReader } from '@/lib/accessibility';

interface AccessibleFormFieldProps {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'search' | 'number';
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
  pattern?: string;
  autoComplete?: string;
  cultural?: boolean;
  showPasswordToggle?: boolean;
  ariaDescribedBy?: string;
}

export const AccessibleFormField: React.FC<AccessibleFormFieldProps> = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  description,
  required = false,
  disabled = false,
  placeholder,
  maxLength,
  pattern,
  autoComplete,
  cultural = false,
  showPasswordToggle = false,
  ariaDescribedBy,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const errorId = `${id}-error`;
  const descriptionId = `${id}-description`;
  const characterCountId = `${id}-character-count`;

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  // Handle focus
  const handleFocus = () => {
    setIsFocused(true);
  };

  // Handle blur
  const handleBlur = () => {
    setIsFocused(false);
    if (onBlur) onBlur();
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    
    // Announce to screen readers
    screenReader.announce(
      showPassword ? 'Password hidden' : 'Password revealed'
    );
    
    // Keep focus on input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Build aria-describedby
  const buildAriaDescribedBy = () => {
    const describedBy = [];
    if (description) describedBy.push(descriptionId);
    if (error) describedBy.push(errorId);
    if (maxLength) describedBy.push(characterCountId);
    if (ariaDescribedBy) describedBy.push(ariaDescribedBy);
    return describedBy.join(' ') || undefined;
  };

  // Input type handling
  const inputType = type === 'password' && showPassword ? 'text' : type;

  // Character count
  const characterCount = maxLength ? `${value.length}/${maxLength}` : null;
  const isNearLimit = maxLength && value.length > maxLength * 0.8;

  // Base classes
  const baseClasses = [
    'block w-full rounded-lg border px-3 py-2',
    'text-base leading-6',
    'transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'placeholder:text-gray-400',
  ];

  // State classes
  const stateClasses = cultural ? {
    default: 'border-cultural-secondary bg-cultural-neutral text-cultural-text focus:ring-cultural-accent focus:border-cultural-accent',
    error: 'border-red-500 bg-red-50 text-red-900 focus:ring-red-500 focus:border-red-500',
    success: 'border-green-500 bg-green-50 text-green-900 focus:ring-green-500 focus:border-green-500',
  } : {
    default: 'border-gray-300 bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500',
    error: 'border-red-500 bg-red-50 text-red-900 focus:ring-red-500 focus:border-red-500',
    success: 'border-green-500 bg-green-50 text-green-900 focus:ring-green-500 focus:border-green-500',
  };

  const currentStateClass = error ? stateClasses.error : stateClasses.default;

  // Combine classes
  const inputClasses = [...baseClasses, currentStateClass].join(' ');

  // Label classes
  const labelClasses = [
    'block text-sm font-medium mb-2',
    cultural ? 'text-cultural-text' : 'text-gray-700',
    required ? 'required' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className="space-y-1">
      {/* Label */}
      <label htmlFor={id} className={labelClasses}>
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>

      {/* Description */}
      {description && (
        <p id={descriptionId} className="text-sm text-gray-600 mb-2">
          {description}
        </p>
      )}

      {/* Input container */}
      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          type={inputType}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={inputClasses}
          placeholder={placeholder}
          maxLength={maxLength}
          pattern={pattern}
          autoComplete={autoComplete}
          required={required}
          disabled={disabled}
          aria-describedby={buildAriaDescribedBy()}
          aria-invalid={error ? 'true' : 'false'}
          aria-required={required}
        />

        {/* Password toggle button */}
        {showPasswordToggle && type === 'password' && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={0}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400" aria-hidden="true" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400" aria-hidden="true" />
            )}
          </button>
        )}

        {/* Status icon */}
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <AlertCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
          </div>
        )}
      </div>

      {/* Character count */}
      {maxLength && (
        <p 
          id={characterCountId}
          className={`text-sm ${isNearLimit ? 'text-orange-600' : 'text-gray-500'}`}
          aria-live="polite"
        >
          {characterCount} characters
        </p>
      )}

      {/* Error message */}
      {error && (
        <p 
          id={errorId}
          className="text-sm text-red-600 flex items-center"
          aria-live="polite"
          role="alert"
        >
          <AlertCircle className="h-4 w-4 mr-1" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
};

interface AccessibleSelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  error?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  cultural?: boolean;
}

export const AccessibleSelect: React.FC<AccessibleSelectProps> = ({
  id,
  label,
  value,
  onChange,
  options,
  error,
  description,
  required = false,
  disabled = false,
  placeholder,
  cultural = false,
}) => {
  const errorId = `${id}-error`;
  const descriptionId = `${id}-description`;

  // Handle change
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  // Build aria-describedby
  const buildAriaDescribedBy = () => {
    const describedBy = [];
    if (description) describedBy.push(descriptionId);
    if (error) describedBy.push(errorId);
    return describedBy.join(' ') || undefined;
  };

  // Base classes
  const baseClasses = [
    'block w-full rounded-lg border px-3 py-2',
    'text-base leading-6',
    'transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'bg-white',
  ];

  // State classes
  const stateClasses = cultural ? {
    default: 'border-cultural-secondary text-cultural-text focus:ring-cultural-accent focus:border-cultural-accent',
    error: 'border-red-500 text-red-900 focus:ring-red-500 focus:border-red-500',
  } : {
    default: 'border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500',
    error: 'border-red-500 text-red-900 focus:ring-red-500 focus:border-red-500',
  };

  const currentStateClass = error ? stateClasses.error : stateClasses.default;

  // Combine classes
  const selectClasses = [...baseClasses, currentStateClass].join(' ');

  // Label classes
  const labelClasses = [
    'block text-sm font-medium mb-2',
    cultural ? 'text-cultural-text' : 'text-gray-700',
    required ? 'required' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className="space-y-1">
      {/* Label */}
      <label htmlFor={id} className={labelClasses}>
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>

      {/* Description */}
      {description && (
        <p id={descriptionId} className="text-sm text-gray-600 mb-2">
          {description}
        </p>
      )}

      {/* Select container */}
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={handleChange}
          className={selectClasses}
          required={required}
          disabled={disabled}
          aria-describedby={buildAriaDescribedBy()}
          aria-invalid={error ? 'true' : 'false'}
          aria-required={required}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>

        {/* Error icon */}
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <AlertCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p 
          id={errorId}
          className="text-sm text-red-600 flex items-center"
          aria-live="polite"
          role="alert"
        >
          <AlertCircle className="h-4 w-4 mr-1" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
};

interface AccessibleTextareaProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
  rows?: number;
  cultural?: boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export const AccessibleTextarea: React.FC<AccessibleTextareaProps> = ({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  description,
  required = false,
  disabled = false,
  placeholder,
  maxLength,
  rows = 3,
  cultural = false,
  resize = 'vertical',
}) => {
  const errorId = `${id}-error`;
  const descriptionId = `${id}-description`;
  const characterCountId = `${id}-character-count`;

  // Handle change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  // Build aria-describedby
  const buildAriaDescribedBy = () => {
    const describedBy = [];
    if (description) describedBy.push(descriptionId);
    if (error) describedBy.push(errorId);
    if (maxLength) describedBy.push(characterCountId);
    return describedBy.join(' ') || undefined;
  };

  // Character count
  const characterCount = maxLength ? `${value.length}/${maxLength}` : null;
  const isNearLimit = maxLength && value.length > maxLength * 0.8;

  // Base classes
  const baseClasses = [
    'block w-full rounded-lg border px-3 py-2',
    'text-base leading-6',
    'transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'placeholder:text-gray-400',
    `resize-${resize}`,
  ];

  // State classes
  const stateClasses = cultural ? {
    default: 'border-cultural-secondary bg-cultural-neutral text-cultural-text focus:ring-cultural-accent focus:border-cultural-accent',
    error: 'border-red-500 bg-red-50 text-red-900 focus:ring-red-500 focus:border-red-500',
  } : {
    default: 'border-gray-300 bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500',
    error: 'border-red-500 bg-red-50 text-red-900 focus:ring-red-500 focus:border-red-500',
  };

  const currentStateClass = error ? stateClasses.error : stateClasses.default;

  // Combine classes
  const textareaClasses = [...baseClasses, currentStateClass].join(' ');

  // Label classes
  const labelClasses = [
    'block text-sm font-medium mb-2',
    cultural ? 'text-cultural-text' : 'text-gray-700',
    required ? 'required' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className="space-y-1">
      {/* Label */}
      <label htmlFor={id} className={labelClasses}>
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>

      {/* Description */}
      {description && (
        <p id={descriptionId} className="text-sm text-gray-600 mb-2">
          {description}
        </p>
      )}

      {/* Textarea */}
      <textarea
        id={id}
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        className={textareaClasses}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={rows}
        required={required}
        disabled={disabled}
        aria-describedby={buildAriaDescribedBy()}
        aria-invalid={error ? 'true' : 'false'}
        aria-required={required}
      />

      {/* Character count */}
      {maxLength && (
        <p 
          id={characterCountId}
          className={`text-sm ${isNearLimit ? 'text-orange-600' : 'text-gray-500'}`}
          aria-live="polite"
        >
          {characterCount} characters
        </p>
      )}

      {/* Error message */}
      {error && (
        <p 
          id={errorId}
          className="text-sm text-red-600 flex items-center"
          aria-live="polite"
          role="alert"
        >
          <AlertCircle className="h-4 w-4 mr-1" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
};

export default {
  AccessibleFormField,
  AccessibleSelect,
  AccessibleTextarea,
};