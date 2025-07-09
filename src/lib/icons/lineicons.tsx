/**
 * LineIcons CSS-based Integration
 * 
 * Simple component that uses LineIcons via CDN CSS classes.
 * CDN Links are loaded in layout.tsx.
 */

import React from 'react';
import { cn } from '@/lib/utils';

export interface LineIconProps {
  name: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  spinning?: boolean;
  onClick?: () => void;
}

export const LineIcon: React.FC<LineIconProps> = ({
  name,
  size,
  className,
  style,
  spinning = false,
  onClick,
  ...props
}) => {
  const iconClass = `lni-${name}`;
  
  const sizeStyle = size ? { fontSize: `${size}px`, ...style } : style;
  
  const combinedClassName = cn(
    iconClass,
    spinning && 'animate-spin',
    className
  );
  
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={cn(combinedClassName, 'cursor-pointer')}
        style={sizeStyle}
        {...props}
      />
    );
  }
  
  return (
    <i
      className={combinedClassName}
      style={sizeStyle}
      {...props}
    />
  );
};

export default LineIcon;