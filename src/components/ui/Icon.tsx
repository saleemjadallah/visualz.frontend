import React from 'react';
import { cn } from '@/lib/utils';
import { ComponentSize } from '@/lib/types';
import { LineIcons, StyledLineIcons, LineIconName } from '@/lib/icons';

// Core icon props
export interface IconProps {
  className?: string;
  size?: ComponentSize | number;
  color?: 'current' | 'primary' | 'secondary' | 'cultural' | 'success' | 'warning' | 'error' | string;
  cultural?: boolean;
  spinning?: boolean;
  children?: React.ReactNode;
}

// LineIcon component props
export interface LineIconProps extends Omit<IconProps, 'children'> {
  name: LineIconName;
  title?: string;
}

// Icon wrapper component
const Icon = React.forwardRef<HTMLSpanElement, IconProps>(
  ({ 
    className, 
    size = 'md', 
    color = 'current',
    cultural = false,
    spinning = false,
    children,
    ...props 
  }, ref) => {
    const getSizeClass = () => {
      if (typeof size === 'number') {
        return {
          width: `${size}px`,
          height: `${size}px`
        };
      }
      
      const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
        xl: 'w-8 h-8'
      };
      
      return sizeClasses[size];
    };
    
    const getColorClass = () => {
      const colorClasses = {
        current: 'text-current',
        primary: 'text-primary-600',
        secondary: 'text-primary-400',
        cultural: 'text-cultural-primary',
        success: 'text-green-600',
        warning: 'text-yellow-600',
        error: 'text-red-600'
      };
      
      return colorClasses[color as keyof typeof colorClasses] || `text-[${color}]`;
    };
    
    const baseClasses = `
      inline-flex items-center justify-center flex-shrink-0
      ${spinning ? 'animate-spin' : ''}
      ${cultural ? 'transition-colors duration-300' : ''}
    `;
    
    const sizeStyle = typeof size === 'number' ? getSizeClass() as React.CSSProperties : undefined;
    const sizeClass = typeof size === 'string' ? getSizeClass() as string : '';
    
    return (
      <span
        ref={ref}
        className={cn(
          baseClasses,
          sizeClass,
          getColorClass(),
          className
        )}
        style={sizeStyle}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Icon.displayName = 'Icon';

// LineIcon component - A bridge between Icon wrapper and LineIcons
const LineIcon = React.forwardRef<HTMLSpanElement, LineIconProps>(
  ({ name, title, size = 'md', color = 'current', className, ...props }, ref) => {
    const IconComponent = LineIcons[name];
    
    if (!IconComponent) {
      console.warn(`LineIcon: Icon "${name}" not found in LineIcons mapping`);
      return null;
    }
    
    const getSizeValue = () => {
      if (typeof size === 'number') return size;
      
      const sizeMap = {
        sm: 16,
        md: 20,
        lg: 24,
        xl: 32
      };
      
      return sizeMap[size] || 20;
    };
    
    return (
      <Icon 
        ref={ref}
        size={size} 
        color={color} 
        className={className}
        {...props}
      >
        <IconComponent 
          title={title}
          style={{
            width: getSizeValue(),
            height: getSizeValue(),
            display: 'block'
          }}
        />
      </Icon>
    );
  }
);

LineIcon.displayName = 'LineIcon';

// Cultural icon mappings
export const CULTURAL_ICONS = {
  japanese: {
    flag: '🇯🇵',
    symbol: '⛩️',
    pattern: '🌸',
    material: '🎋'
  },
  scandinavian: {
    flag: '🇸🇪',
    symbol: '🏔️',
    pattern: '❄️',
    material: '🌲'
  },
  italian: {
    flag: '🇮🇹',
    symbol: '🏛️',
    pattern: '🍇',
    material: '🪨'
  },
  french: {
    flag: '🇫🇷',
    symbol: '🗼',
    pattern: '⚜️',
    material: '🥖'
  },
  american: {
    flag: '🇺🇸',
    symbol: '🗽',
    pattern: '⭐',
    material: '🦅'
  }
};

// Cultural Icon Component
export interface CulturalIconProps extends Omit<IconProps, 'children'> {
  culture: keyof typeof CULTURAL_ICONS;
  type?: 'flag' | 'symbol' | 'pattern' | 'material';
}

const CulturalIcon = React.forwardRef<HTMLSpanElement, CulturalIconProps>(
  ({ culture, type = 'flag', size = 'md', ...props }, ref) => {
    const iconSymbol = CULTURAL_ICONS[culture]?.[type] || CULTURAL_ICONS[culture]?.flag;
    
    return (
      <Icon ref={ref} size={size} cultural {...props}>
        <span role="img" aria-label={`${culture} ${type}`}>
          {iconSymbol}
        </span>
      </Icon>
    );
  }
);

CulturalIcon.displayName = 'CulturalIcon';

// Icon button component
export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  size?: ComponentSize;
  variant?: 'ghost' | 'solid' | 'outline' | 'cultural';
  cultural?: boolean;
  loading?: boolean;
  'aria-label': string;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ 
    icon,
    size = 'md',
    variant = 'ghost',
    cultural = false,
    loading = false,
    className,
    disabled,
    ...props 
  }, ref) => {
    const isDisabled = disabled || loading;
    
    const sizeClasses = {
      sm: 'w-8 h-8 p-1',
      md: 'w-10 h-10 p-2',
      lg: 'w-12 h-12 p-3',
      xl: 'w-14 h-14 p-3.5'
    };
    
    const variantClasses = {
      ghost: `
        text-primary-600 hover:text-primary-800 hover:bg-primary-100
        focus:ring-primary-500
      `,
      solid: `
        bg-primary-600 text-white hover:bg-primary-700
        focus:ring-primary-500
      `,
      outline: `
        border border-primary-300 text-primary-600 hover:bg-primary-50
        focus:ring-primary-500
      `,
      cultural: `
        text-cultural-primary hover:text-cultural-secondary hover:bg-cultural-primary/10
        focus:ring-cultural-accent
      `
    };
    
    const baseClasses = `
      inline-flex items-center justify-center rounded-lg
      transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1
      disabled:opacity-50 disabled:cursor-not-allowed
      ${!isDisabled ? 'active:scale-95' : ''}
    `;
    
    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          baseClasses,
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        <Icon 
          size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : size === 'xl' ? 'xl' : 'md'}
          spinning={loading}
          cultural={cultural}
        >
          {icon}
        </Icon>
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';

// Badge with icon
export interface IconBadgeProps {
  icon: React.ReactNode;
  children: React.ReactNode;
  size?: ComponentSize;
  variant?: 'primary' | 'secondary' | 'cultural' | 'success' | 'warning' | 'error';
  className?: string;
}

const IconBadge = ({ 
  icon, 
  children, 
  size = 'md', 
  variant = 'primary',
  className 
}: IconBadgeProps) => {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs gap-1',
    md: 'px-3 py-1.5 text-sm gap-1.5',
    lg: 'px-4 py-2 text-base gap-2',
    xl: 'px-5 py-2.5 text-lg gap-2.5'
  };
  
  const variantClasses = {
    primary: 'bg-primary-100 text-primary-800 border-primary-200',
    secondary: 'bg-gray-100 text-gray-800 border-gray-200',
    cultural: 'bg-cultural-primary/10 text-cultural-primary border-cultural-primary/20',
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    error: 'bg-red-100 text-red-800 border-red-200'
  };
  
  return (
    <span className={cn(
      'inline-flex items-center rounded-full border font-medium',
      sizeClasses[size],
      variantClasses[variant],
      className
    )}>
      <Icon size={size === 'sm' ? 'sm' : 'md'}>
        {icon}
      </Icon>
      {children}
    </span>
  );
};

IconBadge.displayName = 'IconBadge';

export { Icon, LineIcon, CulturalIcon, IconButton, IconBadge };

// Re-export LineIcons for direct usage
export { LineIcons, StyledLineIcons } from '@/lib/icons';