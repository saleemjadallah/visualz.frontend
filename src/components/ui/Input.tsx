import React, { forwardRef, useState, useRef } from 'react';
import { LineIcon } from './Icon';
import { cn } from '@/lib/utils';
import { ComponentSize } from '@/lib/types';

// Base Input Props
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: ComponentSize;
  error?: string;
  success?: boolean;
  helperText?: string;
  label?: string;
  icon?: React.ReactNode;
  cultural?: boolean;
}

// Text Input Component
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type = 'text', 
    size = 'md', 
    error, 
    success, 
    helperText, 
    label, 
    icon,
    cultural = false,
    disabled,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;
    
    const baseClasses = `
      w-full rounded-xl border transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-1
      disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50
      ${icon ? 'pl-10' : ''}
      ${isPassword ? 'pr-10' : ''}
    `;
    
    const sizes: Record<ComponentSize, string> = {
      sm: 'px-3 py-2 text-sm h-8',
      md: 'px-4 py-3 text-base h-10',
      lg: 'px-5 py-4 text-lg h-12',
      xl: 'px-6 py-5 text-xl h-14'
    };
    
    const stateClasses = error 
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
      : success
      ? 'border-green-300 focus:border-green-500 focus:ring-green-500'
      : cultural
      ? 'border-cultural-primary/20 focus:border-cultural-primary focus:ring-cultural-primary'
      : 'border-primary-200 focus:border-cultural-primary focus:ring-cultural-primary';
    
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-primary-700 mb-2">
            {label}
          </label>
        )}
        
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400">
              {icon}
            </div>
          )}
          
          <input
            ref={ref}
            type={inputType}
            disabled={disabled}
            className={cn(
              baseClasses,
              sizes[size],
              stateClasses,
              className
            )}
            {...props}
          />
          
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-400 hover:text-primary-600"
            >
              {showPassword ? <LineIcon name="EyeOff" className="w-4 h-4" /> : <LineIcon name="Eye" className="w-4 h-4" />}
            </button>
          )}
          
          {success && !error && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
              <LineIcon name="Check" className="w-4 h-4" />
            </div>
          )}
          
          {error && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
              <LineIcon name="AlertCircle" className="w-4 h-4" />
            </div>
          )}
        </div>
        
        {(error || success || helperText) && (
          <div className={cn(
            'text-sm',
            error ? 'text-red-600' : success ? 'text-green-600' : 'text-primary-500'
          )}>
            {error || helperText}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Search Input Component
export interface SearchInputProps extends Omit<InputProps, 'icon'> {
  onSearch?: (value: string) => void;
  placeholder?: string;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onSearch, placeholder = 'Search...', className, ...props }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        onSearch?.(e.currentTarget.value);
      }
    };
    
    return (
      <Input
        ref={ref}
        type="search"
        placeholder={placeholder}
        icon={<LineIcon name="Search" className="w-4 h-4" />}
        onKeyDown={handleKeyDown}
        className={className}
        {...props}
      />
    );
  }
);

SearchInput.displayName = 'SearchInput';

// Textarea Component
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  size?: ComponentSize;
  error?: string;
  success?: boolean;
  helperText?: string;
  label?: string;
  cultural?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    className, 
    size = 'md', 
    error, 
    success, 
    helperText, 
    label, 
    cultural = false,
    ...props 
  }, ref) => {
    const baseClasses = `
      w-full rounded-xl border transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-1
      disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50
      resize-y min-h-[100px]
    `;
    
    const sizes: Record<ComponentSize, string> = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-base',
      lg: 'px-5 py-4 text-lg',
      xl: 'px-6 py-5 text-xl'
    };
    
    const stateClasses = error 
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
      : success
      ? 'border-green-300 focus:border-green-500 focus:ring-green-500'
      : cultural
      ? 'border-cultural-primary/20 focus:border-cultural-primary focus:ring-cultural-primary'
      : 'border-primary-200 focus:border-cultural-primary focus:ring-cultural-primary';
    
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-primary-700 mb-2">
            {label}
          </label>
        )}
        
        <div className="relative">
          <textarea
            ref={ref}
            className={cn(
              baseClasses,
              sizes[size],
              stateClasses,
              className
            )}
            {...props}
          />
          
          {success && !error && (
            <div className="absolute right-3 top-3 text-green-500">
              <LineIcon name="Check" className="w-4 h-4" />
            </div>
          )}
          
          {error && (
            <div className="absolute right-3 top-3 text-red-500">
              <LineIcon name="AlertCircle" className="w-4 h-4" />
            </div>
          )}
        </div>
        
        {(error || success || helperText) && (
          <div className={cn(
            'text-sm',
            error ? 'text-red-600' : success ? 'text-green-600' : 'text-primary-500'
          )}>
            {error || helperText}
          </div>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

// File Upload Component
export interface FileUploadProps {
  onFileSelect?: (files: FileList) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  className?: string;
  cultural?: boolean;
  children?: React.ReactNode;
}

const FileUpload = ({ 
  onFileSelect, 
  accept = 'image/*', 
  multiple = false, 
  maxSize = 10,
  className,
  cultural = false,
  children 
}: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };
  
  const handleFiles = (files: FileList) => {
    setError(null);
    
    // Validate file size
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > maxSize * 1024 * 1024) {
        setError(`File ${file.name} is too large. Maximum size is ${maxSize}MB.`);
        return;
      }
    }
    
    onFileSelect?.(files);
  };
  
  const baseClasses = cn(
    'relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer',
    'hover:border-primary-400 hover:bg-primary-50',
    dragActive ? 'border-cultural-primary bg-cultural-primary/5' : 'border-primary-300',
    cultural ? 'border-cultural-primary/30' : ''
  );
  
  return (
    <div className="space-y-2">
      <div
        className={cn(baseClasses, className)}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />
        
        {children || (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-cultural-primary to-cultural-accent rounded-xl flex items-center justify-center mx-auto">
              <LineIcon name="Upload" className="w-8 h-8 text-white" />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-primary-900 mb-2">
                Drop files here or click to upload
              </h3>
              <p className="text-primary-600 text-sm">
                {accept.includes('image') ? 'Images' : 'Files'} up to {maxSize}MB
              </p>
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <div className="text-sm text-red-600 flex items-center gap-2">
          <LineIcon name="AlertCircle" className="w-4 h-4" />
          {error}
        </div>
      )}
    </div>
  );
};

FileUpload.displayName = 'FileUpload';

// Select Component
export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  size?: ComponentSize;
  error?: string;
  success?: boolean;
  helperText?: string;
  label?: string;
  cultural?: boolean;
  options: { value: string; label: string; disabled?: boolean }[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ 
    className, 
    size = 'md', 
    error, 
    success, 
    helperText, 
    label, 
    cultural = false,
    options,
    placeholder,
    ...props 
  }, ref) => {
    const baseClasses = `
      w-full rounded-xl border transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-1
      disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50
      appearance-none bg-white
    `;
    
    const sizes: Record<ComponentSize, string> = {
      sm: 'px-3 py-2 text-sm h-8',
      md: 'px-4 py-3 text-base h-10',
      lg: 'px-5 py-4 text-lg h-12',
      xl: 'px-6 py-5 text-xl h-14'
    };
    
    const stateClasses = error 
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
      : success
      ? 'border-green-300 focus:border-green-500 focus:ring-green-500'
      : cultural
      ? 'border-cultural-primary/20 focus:border-cultural-primary focus:ring-cultural-primary'
      : 'border-primary-200 focus:border-cultural-primary focus:ring-cultural-primary';
    
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-primary-700 mb-2">
            {label}
          </label>
        )}
        
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              baseClasses,
              sizes[size],
              stateClasses,
              'pr-8', // Space for dropdown arrow
              className
            )}
            {...props}
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
          
          {/* Custom dropdown arrow */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          {success && !error && (
            <div className="absolute right-8 top-1/2 transform -translate-y-1/2 text-green-500">
              <LineIcon name="Check" className="w-4 h-4" />
            </div>
          )}
          
          {error && (
            <div className="absolute right-8 top-1/2 transform -translate-y-1/2 text-red-500">
              <LineIcon name="AlertCircle" className="w-4 h-4" />
            </div>
          )}
        </div>
        
        {(error || success || helperText) && (
          <div className={cn(
            'text-sm',
            error ? 'text-red-600' : success ? 'text-green-600' : 'text-primary-500'
          )}>
            {error || helperText}
          </div>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export { Input, SearchInput, Textarea, FileUpload, Select };