import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ButtonProps, ComponentVariant, ComponentSize } from '@/lib/types';

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    disabled = false,
    loading = false,
    icon,
    children,
    type = 'button',
    onClick,
    ...props 
  }, ref) => {
    const isDisabled = disabled || loading;
    
    const baseClasses = `
      inline-flex items-center justify-center gap-2 rounded-xl font-medium 
      transition-all duration-300 ease-out transform 
      focus:outline-none focus:ring-2 focus:ring-offset-2
      active:scale-95 select-none cursor-pointer
      ${!isDisabled ? 'hover:scale-105 hover:shadow-xl' : 'cursor-not-allowed'}
      ${loading ? 'cursor-wait' : ''}
    `;
    
    const variants: Record<ComponentVariant, string> = {
      primary: `
        bg-gradient-to-r from-primary-900 to-primary-700 text-white shadow-lg
        ${!isDisabled ? 'hover:from-primary-800 hover:to-primary-600' : ''}
        focus:ring-primary-500
        disabled:opacity-50 disabled:cursor-not-allowed
      `,
      secondary: `
        bg-white text-primary-900 border-2 border-primary-200 shadow-md
        ${!isDisabled ? 'hover:border-primary-300 hover:bg-primary-50' : ''}
        focus:ring-primary-500
        disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50
      `,
      cultural: `
        bg-gradient-to-r from-cultural-primary to-cultural-secondary text-white shadow-lg
        ${!isDisabled ? 'hover:opacity-90 hover:shadow-cultural' : ''}
        focus:ring-cultural-accent
        disabled:opacity-50 disabled:cursor-not-allowed
      `,
      ghost: `
        text-primary-700 shadow-none bg-transparent
        ${!isDisabled ? 'hover:text-primary-900 hover:bg-primary-100 hover:shadow-md' : ''}
        focus:ring-primary-500 focus:bg-primary-50
        disabled:opacity-50 disabled:cursor-not-allowed disabled:text-gray-400
      `
    };
    
    const sizes: Record<ComponentSize, string> = {
      sm: 'px-4 py-2 text-sm h-8 min-w-[2rem]',
      md: 'px-6 py-3 text-base h-10 min-w-[2.5rem]',
      lg: 'px-8 py-4 text-lg h-12 min-w-[3rem]',
      xl: 'px-10 py-5 text-xl h-14 min-w-[3.5rem]'
    };
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isDisabled) {
        e.preventDefault();
        return;
      }
      onClick?.();
    };
    
    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        onClick={handleClick}
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {loading && (
          <Loader2 className={cn(
            'animate-spin',
            size === 'sm' ? 'w-3 h-3' : 
            size === 'md' ? 'w-4 h-4' :
            size === 'lg' ? 'w-5 h-5' : 'w-6 h-6'
          )} />
        )}
        {!loading && icon && (
          <span className={cn(
            'flex items-center justify-center',
            size === 'sm' ? 'w-3 h-3' : 
            size === 'md' ? 'w-4 h-4' :
            size === 'lg' ? 'w-5 h-5' : 'w-6 h-6'
          )}>
            {icon}
          </span>
        )}
        {children && (
          <span className={cn(
            'flex items-center',
            loading || icon ? '' : 'justify-center'
          )}>
            {children}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
export type { ButtonProps };