'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, Search, X, ChevronDown, Check } from 'lucide-react';

interface TouchOptimizedInputProps {
  type?: 'text' | 'email' | 'password' | 'search' | 'number' | 'tel' | 'url';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  disabled?: boolean;
  error?: string;
  label?: string;
  required?: boolean;
  autoComplete?: string;
  maxLength?: number;
  pattern?: string;
  className?: string;
}

export const TouchOptimizedInput: React.FC<TouchOptimizedInputProps> = ({
  type = 'text',
  placeholder,
  value = '',
  onChange,
  onFocus,
  onBlur,
  disabled = false,
  error,
  label,
  required = false,
  autoComplete,
  maxLength,
  pattern,
  className = '',
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  const clearInput = () => {
    onChange?.('');
    inputRef.current?.focus();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium mb-2 text-cultural-text">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          ref={inputRef}
          type={inputType}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={placeholder}
          autoComplete={autoComplete}
          maxLength={maxLength}
          pattern={pattern}
          required={required}
          className={`
            input-cultural
            ${isFocused ? 'border-cultural-accent ring-2 ring-cultural-accent ring-opacity-20' : ''}
            ${error ? 'border-red-500' : 'border-cultural-secondary'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${type === 'search' ? 'pl-12' : ''}
            ${(type === 'password' || (type === 'search' && value)) ? 'pr-12' : ''}
            ios-optimized android-optimized
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-cultural-accent focus:ring-opacity-20
          `}
          style={{
            backgroundColor: 'var(--cultural-soft)',
            borderColor: error ? '#ef4444' : isFocused ? 'var(--cultural-accent)' : 'var(--cultural-secondary)',
            color: 'var(--cultural-text)',
          }}
        />

        {/* Search Icon */}
        {type === 'search' && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <Search className="w-5 h-5 text-cultural-secondary" />
          </div>
        )}

        {/* Clear Button for Search */}
        {type === 'search' && value && (
          <button
            type="button"
            onClick={clearInput}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors ios-optimized"
            style={{ minWidth: '28px', minHeight: '28px' }}
          >
            <X className="w-4 h-4 text-cultural-secondary" />
          </button>
        )}

        {/* Password Toggle */}
        {type === 'password' && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors ios-optimized"
            style={{ minWidth: '28px', minHeight: '28px' }}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4 text-cultural-secondary" />
            ) : (
              <Eye className="w-4 h-4 text-cultural-secondary" />
            )}
          </button>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

interface TouchOptimizedSelectProps {
  options: { value: string; label: string }[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  required?: boolean;
  className?: string;
}

export const TouchOptimizedSelect: React.FC<TouchOptimizedSelectProps> = ({
  options,
  value = '',
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  error,
  label,
  required = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const selectRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find(option => option.value === value);

  const handleSelect = (optionValue: string) => {
    onChange?.(optionValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`w-full ${className}`} ref={selectRef}>
      {label && (
        <label className="block text-sm font-medium mb-2 text-cultural-text">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          onClick={handleToggle}
          disabled={disabled}
          className={`
            input-cultural
            flex items-center justify-between w-full text-left
            ${error ? 'border-red-500' : 'border-cultural-secondary'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            ${isOpen ? 'border-cultural-accent ring-2 ring-cultural-accent ring-opacity-20' : ''}
            ios-optimized android-optimized
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-cultural-accent focus:ring-opacity-20
          `}
          style={{
            backgroundColor: 'var(--cultural-soft)',
            borderColor: error ? '#ef4444' : isOpen ? 'var(--cultural-accent)' : 'var(--cultural-secondary)',
            color: 'var(--cultural-text)',
          }}
        >
          <span className={selectedOption ? 'text-cultural-text' : 'text-cultural-secondary'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown className={`w-5 h-5 text-cultural-secondary transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white border border-cultural-secondary rounded-lg shadow-lg max-h-64 overflow-hidden">
            {options.length > 5 && (
              <div className="p-3 border-b border-cultural-secondary">
                <input
                  type="text"
                  placeholder="Search options..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-cultural-secondary rounded-lg focus:outline-none focus:border-cultural-accent"
                  style={{
                    backgroundColor: 'var(--cultural-soft)',
                    color: 'var(--cultural-text)',
                  }}
                />
              </div>
            )}
            
            <div className="max-h-48 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className={`
                      w-full px-4 py-3 text-left hover:bg-cultural-soft transition-colors flex items-center justify-between
                      ${option.value === value ? 'bg-cultural-accent text-cultural-text' : 'text-cultural-text'}
                      ios-optimized android-optimized
                    `}
                    style={{
                      backgroundColor: option.value === value ? 'var(--cultural-accent)' : 'transparent',
                    }}
                  >
                    <span>{option.label}</span>
                    {option.value === value && (
                      <Check className="w-4 h-4 text-cultural-text" />
                    )}
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-cultural-secondary text-center">
                  No options found
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

interface TouchOptimizedTextareaProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  disabled?: boolean;
  error?: string;
  label?: string;
  required?: boolean;
  rows?: number;
  maxLength?: number;
  className?: string;
}

export const TouchOptimizedTextarea: React.FC<TouchOptimizedTextareaProps> = ({
  placeholder,
  value = '',
  onChange,
  onFocus,
  onBlur,
  disabled = false,
  error,
  label,
  required = false,
  rows = 4,
  maxLength,
  className = '',
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium mb-2 text-cultural-text">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <textarea
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={placeholder}
          required={required}
          rows={rows}
          maxLength={maxLength}
          className={`
            input-cultural
            resize-none
            ${isFocused ? 'border-cultural-accent ring-2 ring-cultural-accent ring-opacity-20' : ''}
            ${error ? 'border-red-500' : 'border-cultural-secondary'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ios-optimized android-optimized
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-cultural-accent focus:ring-opacity-20
          `}
          style={{
            backgroundColor: 'var(--cultural-soft)',
            borderColor: error ? '#ef4444' : isFocused ? 'var(--cultural-accent)' : 'var(--cultural-secondary)',
            color: 'var(--cultural-text)',
          }}
        />

        {maxLength && (
          <div className="absolute bottom-2 right-2 text-xs text-cultural-secondary">
            {value.length}/{maxLength}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default TouchOptimizedInput;