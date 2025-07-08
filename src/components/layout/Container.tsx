import React from 'react';
import { cn } from '@/lib/utils';
import { BaseComponentProps } from '@/lib/types';

export interface ContainerProps extends BaseComponentProps {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  centerContent?: boolean;
  cultural?: boolean;
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ 
    className, 
    maxWidth = 'xl', 
    padding = 'md',
    centerContent = true,
    cultural = false,
    children,
    ...props 
  }, ref) => {
    const maxWidthClasses = {
      sm: 'max-w-screen-sm',
      md: 'max-w-screen-md', 
      lg: 'max-w-screen-lg',
      xl: 'max-w-screen-xl',
      '2xl': 'max-w-screen-2xl',
      full: 'max-w-full'
    };
    
    const paddingClasses = {
      none: '',
      sm: 'px-2 sm:px-4',
      md: 'px-4 sm:px-6 lg:px-8',
      lg: 'px-6 sm:px-8 lg:px-12',
      xl: 'px-8 sm:px-12 lg:px-16'
    };
    
    const baseClasses = `
      w-full
      ${centerContent ? 'mx-auto' : ''}
      ${cultural ? 'transition-all duration-300' : ''}
    `;
    
    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          maxWidthClasses[maxWidth],
          paddingClasses[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = 'Container';

export { Container };