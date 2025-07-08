import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  cultural?: boolean;
  children: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = true, cultural = false, children, ...props }, ref) => {
    const baseClasses = `
      bg-white rounded-2xl border border-gray-100 shadow-lg
      ${hover ? 'hover:shadow-xl hover:-translate-y-1' : ''}
      ${cultural ? 'bg-gradient-to-br from-white to-blue-25' : ''}
      transition-all duration-300 ease-out
    `;
    
    return (
      <div 
        className={cn(baseClasses, className)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export default Card;