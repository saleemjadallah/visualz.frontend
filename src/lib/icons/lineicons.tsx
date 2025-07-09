/**
 * LineIcons CSS-based Integration
 * 
 * This file provides a simple way to use LineIcons via CDN CSS classes
 * instead of importing thousands of React components.
 * 
 * CDN Links added to layout.tsx:
 * - Regular: https://pro-cdn.lineicons.com/5.0/regular/lineicons.css
 * - Solid: https://pro-cdn.lineicons.com/5.0/solid/lineicons-solid.css
 * - Light: https://pro-cdn.lineicons.com/4.0/light/lineicons-light.css
 * - Fill: https://pro-cdn.lineicons.com/4.0/fill/lineicons-fill.css
 */

import React from 'react';
import { cn } from '@/lib/utils';

// LineIcon CSS class mappings
export const LINE_ICON_CLASSES = {
  // Common icons
  menu: 'lni-menu',
  close: 'lni-close',
  upload: 'lni-upload',
  download: 'lni-download',
  camera: 'lni-camera',
  share: 'lni-share',
  search: 'lni-search-alt',
  user: 'lni-user',
  users: 'lni-users',
  settings: 'lni-cog',
  palette: 'lni-palette',
  eye: 'lni-eye',
  eyeOff: 'lni-eye-close',
  globe: 'lni-world',
  home: 'lni-home',
  sparkles: 'lni-star',
  check: 'lni-checkmark',
  checkCircle: 'lni-checkmark-circle',
  alertCircle: 'lni-warning',
  info: 'lni-information',
  chevronRight: 'lni-chevron-right',
  chevronLeft: 'lni-chevron-left',
  chevronUp: 'lni-chevron-up',
  chevronDown: 'lni-chevron-down',
  refresh: 'lni-reload',
  copy: 'lni-copy',
  
  // Shopping & Commerce
  shoppingBag: 'lni-shopping-basket',
  cart: 'lni-cart',
  
  // 3D & Design
  cube: 'lni-cube',
  layers: 'lni-layers',
  
  // Communication
  mail: 'lni-envelope',
  phone: 'lni-phone',
  
  // Media
  image: 'lni-image',
  video: 'lni-video',
  play: 'lni-play',
  pause: 'lni-pause',
  
  // Navigation
  arrowUp: 'lni-arrow-up',
  arrowDown: 'lni-arrow-down',
  arrowLeft: 'lni-arrow-left',
  arrowRight: 'lni-arrow-right',
  
  // Social
  heart: 'lni-heart',
  like: 'lni-thumbs-up',
  
  // File & Document
  file: 'lni-files',
  folder: 'lni-folder',
  document: 'lni-document',
  
  // Technology
  code: 'lni-code',
  database: 'lni-database',
  cloud: 'lni-cloud',
  wifi: 'lni-wifi',
  
  // Business
  chart: 'lni-bar-chart',
  calendar: 'lni-calendar',
  clock: 'lni-timer',
  
  // UI Elements
  plus: 'lni-plus',
  minus: 'lni-minus',
  edit: 'lni-pencil',
  trash: 'lni-trash-can',
  lock: 'lni-lock',
  unlock: 'lni-unlock',
  
  // Arrows & Direction
  expand: 'lni-expand',
  compress: 'lni-compress',
  
  // Status
  loading: 'lni-spinner-arrow',
  error: 'lni-cross-circle',
  success: 'lni-checkmark-circle',
  warning: 'lni-warning',
} as const;

export type LineIconName = keyof typeof LINE_ICON_CLASSES;

export interface LineIconProps {
  name: LineIconName;
  variant?: 'regular' | 'solid' | 'light' | 'fill';
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  className?: string;
  style?: React.CSSProperties;
  spinning?: boolean;
  onClick?: () => void;
}

export const LineIcon: React.FC<LineIconProps> = ({
  name,
  variant = 'regular',
  size = 'md',
  className,
  style,
  spinning = false,
  onClick,
  ...props
}) => {
  const iconClass = LINE_ICON_CLASSES[name];
  
  if (!iconClass) {
    console.warn(`LineIcon: Icon "${name}" not found in mapping`);
    return null;
  }
  
  // Size classes
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };
  
  const getSizeClass = () => {
    if (typeof size === 'number') {
      return '';
    }
    return sizeClasses[size] || sizeClasses.md;
  };
  
  const getSizeStyle = () => {
    if (typeof size === 'number') {
      return {
        fontSize: `${size}px`,
        ...style
      };
    }
    return style;
  };
  
  // Variant classes for different LineIcons weights
  const variantClasses = {
    regular: '',
    solid: 'font-bold',
    light: 'font-light',
    fill: 'font-black'
  };
  
  const combinedClassName = cn(
    iconClass,
    getSizeClass(),
    variantClasses[variant],
    spinning && 'animate-spin',
    className
  );
  
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={cn(combinedClassName, 'cursor-pointer')}
        style={getSizeStyle()}
        {...props}
      />
    );
  }
  
  return (
    <i
      className={combinedClassName}
      style={getSizeStyle()}
      {...props}
    />
  );
};

// Convenience component for commonly used icons
export const CommonLineIcons = {
  Menu: (props: Omit<LineIconProps, 'name'>) => <LineIcon name="menu" {...props} />,
  Close: (props: Omit<LineIconProps, 'name'>) => <LineIcon name="close" {...props} />,
  Upload: (props: Omit<LineIconProps, 'name'>) => <LineIcon name="upload" {...props} />,
  Download: (props: Omit<LineIconProps, 'name'>) => <LineIcon name="download" {...props} />,
  Camera: (props: Omit<LineIconProps, 'name'>) => <LineIcon name="camera" {...props} />,
  Share: (props: Omit<LineIconProps, 'name'>) => <LineIcon name="share" {...props} />,
  Search: (props: Omit<LineIconProps, 'name'>) => <LineIcon name="search" {...props} />,
  User: (props: Omit<LineIconProps, 'name'>) => <LineIcon name="user" {...props} />,
  Settings: (props: Omit<LineIconProps, 'name'>) => <LineIcon name="settings" {...props} />,
  Palette: (props: Omit<LineIconProps, 'name'>) => <LineIcon name="palette" {...props} />,
  Eye: (props: Omit<LineIconProps, 'name'>) => <LineIcon name="eye" {...props} />,
  EyeOff: (props: Omit<LineIconProps, 'name'>) => <LineIcon name="eyeOff" {...props} />,
  Globe: (props: Omit<LineIconProps, 'name'>) => <LineIcon name="globe" {...props} />,
  Home: (props: Omit<LineIconProps, 'name'>) => <LineIcon name="home" {...props} />,
  Sparkles: (props: Omit<LineIconProps, 'name'>) => <LineIcon name="sparkles" {...props} />,
  Check: (props: Omit<LineIconProps, 'name'>) => <LineIcon name="check" {...props} />,
  CheckCircle: (props: Omit<LineIconProps, 'name'>) => <LineIcon name="checkCircle" {...props} />,
  AlertCircle: (props: Omit<LineIconProps, 'name'>) => <LineIcon name="alertCircle" {...props} />,
  ChevronRight: (props: Omit<LineIconProps, 'name'>) => <LineIcon name="chevronRight" {...props} />,
  Refresh: (props: Omit<LineIconProps, 'name'>) => <LineIcon name="refresh" {...props} />,
  ShoppingBag: (props: Omit<LineIconProps, 'name'>) => <LineIcon name="shoppingBag" {...props} />,
};

export default LineIcon;