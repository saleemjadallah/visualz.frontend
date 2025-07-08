import React from 'react';
import { cn } from '@/lib/utils';
import { BaseComponentProps } from '@/lib/types';

export interface GridProps extends BaseComponentProps {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12 | 'auto-fit' | 'auto-fill';
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  responsive?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  cultural?: boolean;
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
}

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ 
    className, 
    cols = 'auto-fit',
    gap = 'md',
    responsive,
    cultural = false,
    align = 'stretch',
    justify = 'start',
    children,
    ...props 
  }, ref) => {
    const getColsClass = () => {
      if (cols === 'auto-fit') {
        return 'grid-cols-[repeat(auto-fit,minmax(250px,1fr))]';
      }
      if (cols === 'auto-fill') {
        return 'grid-cols-[repeat(auto-fill,minmax(250px,1fr))]';
      }
      return `grid-cols-${cols}`;
    };
    
    const getResponsiveClasses = () => {
      if (!responsive) return '';
      
      const classes = [];
      if (responsive.sm) classes.push(`sm:grid-cols-${responsive.sm}`);
      if (responsive.md) classes.push(`md:grid-cols-${responsive.md}`);
      if (responsive.lg) classes.push(`lg:grid-cols-${responsive.lg}`);
      if (responsive.xl) classes.push(`xl:grid-cols-${responsive.xl}`);
      
      return classes.join(' ');
    };
    
    const gapClasses = {
      none: 'gap-0',
      sm: 'gap-2',
      md: 'gap-4', 
      lg: 'gap-6',
      xl: 'gap-8'
    };
    
    const alignClasses = {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch'
    };
    
    const justifyClasses = {
      start: 'justify-items-start',
      center: 'justify-items-center',
      end: 'justify-items-end',
      between: 'justify-items-stretch',
      around: 'justify-items-stretch',
      evenly: 'justify-items-stretch'
    };
    
    const baseClasses = `
      grid
      ${cultural ? 'transition-all duration-300' : ''}
    `;
    
    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          getColsClass(),
          getResponsiveClasses(),
          gapClasses[gap],
          alignClasses[align],
          justifyClasses[justify],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Grid.displayName = 'Grid';

// Grid Item Component
export interface GridItemProps extends BaseComponentProps {
  colSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 12 | 'full';
  rowSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 'full';
  order?: number;
  cultural?: boolean;
}

const GridItem = React.forwardRef<HTMLDivElement, GridItemProps>(
  ({ 
    className, 
    colSpan,
    rowSpan,
    order,
    cultural = false,
    children,
    ...props 
  }, ref) => {
    const getColSpanClass = () => {
      if (!colSpan) return '';
      if (colSpan === 'full') return 'col-span-full';
      return `col-span-${colSpan}`;
    };
    
    const getRowSpanClass = () => {
      if (!rowSpan) return '';
      if (rowSpan === 'full') return 'row-span-full';
      return `row-span-${rowSpan}`;
    };
    
    const getOrderClass = () => {
      if (order === undefined) return '';
      return `order-${order}`;
    };
    
    const baseClasses = `
      ${cultural ? 'transition-all duration-300' : ''}
    `;
    
    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          getColSpanClass(),
          getRowSpanClass(),
          getOrderClass(),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GridItem.displayName = 'GridItem';

// Flex Layout Component
export interface FlexProps extends BaseComponentProps {
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
  wrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  cultural?: boolean;
}

const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  ({ 
    className, 
    direction = 'row',
    wrap = 'nowrap',
    justify = 'start',
    align = 'start',
    gap = 'none',
    cultural = false,
    children,
    ...props 
  }, ref) => {
    const directionClasses = {
      row: 'flex-row',
      col: 'flex-col',
      'row-reverse': 'flex-row-reverse',
      'col-reverse': 'flex-col-reverse'
    };
    
    const wrapClasses = {
      wrap: 'flex-wrap',
      nowrap: 'flex-nowrap',
      'wrap-reverse': 'flex-wrap-reverse'
    };
    
    const justifyClasses = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly'
    };
    
    const alignClasses = {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
      baseline: 'items-baseline'
    };
    
    const gapClasses = {
      none: 'gap-0',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8'
    };
    
    const baseClasses = `
      flex
      ${cultural ? 'transition-all duration-300' : ''}
    `;
    
    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          directionClasses[direction],
          wrapClasses[wrap],
          justifyClasses[justify],
          alignClasses[align],
          gapClasses[gap],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Flex.displayName = 'Flex';

// Stack Component (Vertical Flex)
export interface StackProps extends Omit<FlexProps, 'direction'> {
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ spacing = 'md', gap, ...props }, ref) => {
    const effectiveGap = gap || spacing;
    
    return (
      <Flex
        ref={ref}
        direction="col"
        gap={effectiveGap}
        {...props}
      />
    );
  }
);

Stack.displayName = 'Stack';

// HStack Component (Horizontal Flex)
export interface HStackProps extends Omit<FlexProps, 'direction'> {
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

const HStack = React.forwardRef<HTMLDivElement, HStackProps>(
  ({ spacing = 'md', gap, ...props }, ref) => {
    const effectiveGap = gap || spacing;
    
    return (
      <Flex
        ref={ref}
        direction="row"
        gap={effectiveGap}
        {...props}
      />
    );
  }
);

HStack.displayName = 'HStack';

export { Grid, GridItem, Flex, Stack, HStack };