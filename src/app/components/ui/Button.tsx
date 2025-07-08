import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'cultural' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseClasses = `
      inline-flex items-center justify-center rounded-xl font-medium 
      transition-all duration-300 ease-out transform hover:scale-105
      focus:outline-none focus:ring-2 focus:ring-offset-2
      shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed
    `;
    
    const variants = {
      primary: `
        bg-gradient-to-r from-gray-900 to-gray-700 text-white
        hover:from-gray-800 hover:to-gray-600
        focus:ring-gray-500
      `,
      secondary: `
        bg-white text-gray-900 border-2 border-gray-200
        hover:border-gray-300 hover:bg-gray-50
        focus:ring-gray-500
      `,
      cultural: `
        bg-gradient-to-r from-blue-600 to-blue-500 text-white
        hover:from-blue-700 hover:to-blue-600 focus:ring-blue-500
      `,
      ghost: `
        text-gray-700 hover:text-gray-900 hover:bg-gray-100
        focus:ring-gray-500 shadow-none hover:shadow-sm
      `
    };
    
    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
      xl: 'px-10 py-5 text-xl'
    };
    
    return (
      <button 
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;