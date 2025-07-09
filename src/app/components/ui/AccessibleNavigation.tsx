'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Menu, X, Home, Search, User, Settings } from 'lucide-react';
import { keyboardNavigation, focusManagement, aria, screenReader } from '@/lib/accessibility';

interface AccessibleNavItemProps {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  external?: boolean;
  cultural?: boolean;
}

export const AccessibleNavItem: React.FC<AccessibleNavItemProps> = ({
  href,
  children,
  icon,
  isActive = false,
  onClick,
  external = false,
  cultural = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (onClick) {
        onClick();
      }
    }
  };

  const baseClasses = [
    'flex items-center px-3 py-2 rounded-lg text-sm font-medium',
    'transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'hover:bg-opacity-80',
  ];

  const stateClasses = cultural ? {
    default: 'text-cultural-text hover:bg-cultural-soft focus:ring-cultural-accent',
    active: 'bg-cultural-accent text-white shadow-md',
  } : {
    default: 'text-gray-700 hover:bg-gray-100 focus:ring-blue-500',
    active: 'bg-blue-600 text-white shadow-md',
  };

  const linkClasses = [
    ...baseClasses,
    isActive ? stateClasses.active : stateClasses.default,
  ].join(' ');

  const commonProps = {
    className: linkClasses,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
    'aria-current': isActive ? 'page' : undefined,
    role: 'menuitem',
    tabIndex: 0,
  };

  const content = (
    <>
      {icon && (
        <span className="mr-2" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        {...commonProps}
        aria-label={`${children} (opens in new tab)`}
      >
        {content}
      </a>
    );
  }

  return (
    <a href={href} {...commonProps}>
      {content}
    </a>
  );
};

interface AccessibleDropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  label: string;
  cultural?: boolean;
}

export const AccessibleDropdown: React.FC<AccessibleDropdownProps> = ({
  trigger,
  children,
  label,
  cultural = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  // Handle trigger click
  const handleTriggerClick = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Announce menu opening
      screenReader.announce('Menu opened');
    }
  };

  // Handle trigger key events
  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
      case 'ArrowDown':
        e.preventDefault();
        setIsOpen(true);
        setFocusedIndex(0);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setIsOpen(true);
        // Focus last item
        const menuItems = menuRef.current?.querySelectorAll('[role="menuitem"]');
        if (menuItems) {
          setFocusedIndex(menuItems.length - 1);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  // Handle menu item navigation
  const handleMenuKeyDown = (e: React.KeyboardEvent) => {
    const menuItems = menuRef.current?.querySelectorAll('[role="menuitem"]') as NodeListOf<HTMLElement>;
    if (!menuItems) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        const nextIndex = (focusedIndex + 1) % menuItems.length;
        setFocusedIndex(nextIndex);
        menuItems[nextIndex].focus();
        break;
      case 'ArrowUp':
        e.preventDefault();
        const prevIndex = (focusedIndex - 1 + menuItems.length) % menuItems.length;
        setFocusedIndex(prevIndex);
        menuItems[prevIndex].focus();
        break;
      case 'Home':
        e.preventDefault();
        setFocusedIndex(0);
        menuItems[0].focus();
        break;
      case 'End':
        e.preventDefault();
        const lastIndex = menuItems.length - 1;
        setFocusedIndex(lastIndex);
        menuItems[lastIndex].focus();
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
        break;
      case 'Tab':
        setIsOpen(false);
        break;
    }
  };

  // Handle outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        triggerRef.current &&
        menuRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  // Trap focus when menu is open
  useEffect(() => {
    if (isOpen && menuRef.current) {
      cleanupRef.current = keyboardNavigation.trapFocus(menuRef.current);
    }

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, [isOpen]);

  // Update ARIA expanded state
  useEffect(() => {
    if (triggerRef.current) {
      aria.setAttributes(triggerRef.current, {
        'aria-expanded': isOpen.toString(),
      });
    }
  }, [isOpen]);

  const menuClasses = [
    'absolute top-full left-0 mt-2 w-48 rounded-lg shadow-lg border z-50',
    'transition-all duration-200',
    cultural ? 'bg-cultural-neutral border-cultural-secondary' : 'bg-white border-gray-200',
    isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none',
  ].join(' ');

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        onClick={handleTriggerClick}
        onKeyDown={handleTriggerKeyDown}
        className="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        aria-label={label}
        aria-expanded={isOpen}
        aria-haspopup="true"
        id="menu-button"
      >
        {trigger}
        <ChevronDown
          className={`ml-1 h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      <div
        ref={menuRef}
        className={menuClasses}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
        onKeyDown={handleMenuKeyDown}
      >
        <div className="py-1" role="none">
          {children}
        </div>
      </div>
    </div>
  );
};

interface AccessibleMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  cultural?: boolean;
}

export const AccessibleMobileMenu: React.FC<AccessibleMobileMenuProps> = ({
  isOpen,
  onClose,
  children,
  cultural = false,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  // Handle escape key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  // Save and restore focus
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      
      // Trap focus
      if (menuRef.current) {
        cleanupRef.current = keyboardNavigation.trapFocus(menuRef.current);
      }
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      // Announce menu opening
      screenReader.announce('Navigation menu opened');
    } else {
      // Restore focus
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
      
      // Restore body scroll
      document.body.style.overflow = 'auto';
      
      // Announce menu closing
      screenReader.announce('Navigation menu closed');
    }

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const overlayClasses = [
    'fixed inset-0 z-50 transition-opacity duration-300',
    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
  ].join(' ');

  const menuClasses = [
    'fixed inset-y-0 left-0 w-64 shadow-xl transform transition-transform duration-300',
    'focus:outline-none',
    cultural ? 'bg-cultural-neutral' : 'bg-white',
    isOpen ? 'translate-x-0' : '-translate-x-full',
  ].join(' ');

  return (
    <div className={overlayClasses}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu */}
      <div
        ref={menuRef}
        className={menuClasses}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        onKeyDown={handleKeyDown}
      >
        {/* Close button */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close menu"
            data-close
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Menu content */}
        <div className="p-4">
          <nav role="navigation" aria-label="Mobile navigation">
            {children}
          </nav>
        </div>
      </div>
    </div>
  );
};

interface AccessibleBreadcrumbProps {
  items: Array<{
    href?: string;
    label: string;
    current?: boolean;
  }>;
  cultural?: boolean;
}

export const AccessibleBreadcrumb: React.FC<AccessibleBreadcrumbProps> = ({
  items,
  cultural = false,
}) => {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <span className="mx-2 text-gray-400" aria-hidden="true">
                /
              </span>
            )}
            
            {item.current ? (
              <span
                className={`text-sm font-medium ${
                  cultural ? 'text-cultural-text' : 'text-gray-900'
                }`}
                aria-current="page"
              >
                {item.label}
              </span>
            ) : (
              <a
                href={item.href}
                className={`text-sm font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded ${
                  cultural ? 'text-cultural-secondary' : 'text-gray-600'
                }`}
              >
                {item.label}
              </a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

interface AccessibleSkipLinkProps {
  href: string;
  children: React.ReactNode;
  cultural?: boolean;
}

export const AccessibleSkipLink: React.FC<AccessibleSkipLinkProps> = ({
  href,
  children,
  cultural = false,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.querySelector(href) as HTMLElement;
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={`
        sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50
        px-4 py-2 rounded-lg font-medium text-sm
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${cultural 
          ? 'bg-cultural-accent text-white focus:ring-cultural-accent' 
          : 'bg-blue-600 text-white focus:ring-blue-500'
        }
      `}
    >
      {children}
    </a>
  );
};

// Demo navigation component
export const AccessibleNavigationDemo: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="bg-cultural-bg">
      {/* Skip link */}
      <AccessibleSkipLink href="#main-content" cultural>
        Skip to main content
      </AccessibleSkipLink>

      {/* Header */}
      <header className="bg-cultural-neutral border-b border-cultural-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-cultural-text">
                DesignVisualz
              </h1>
            </div>

            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center space-x-4" role="navigation" aria-label="Main navigation">
              <AccessibleNavItem href="/" icon={<Home className="h-4 w-4" />} cultural>
                Home
              </AccessibleNavItem>
              <AccessibleNavItem href="/gallery" cultural>
                Gallery
              </AccessibleNavItem>
              <AccessibleNavItem href="/about" cultural>
                About
              </AccessibleNavItem>
              
              {/* Dropdown example */}
              <AccessibleDropdown trigger="More" label="More options" cultural>
                <AccessibleNavItem href="/help" cultural>
                  Help
                </AccessibleNavItem>
                <AccessibleNavItem href="/contact" cultural>
                  Contact
                </AccessibleNavItem>
                <AccessibleNavItem href="/support" external cultural>
                  Support
                </AccessibleNavItem>
              </AccessibleDropdown>
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-cultural-soft focus:outline-none focus:ring-2 focus:ring-cultural-accent"
              aria-label="Open navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AccessibleMobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        cultural
      >
        <div className="space-y-2">
          <AccessibleNavItem href="/" icon={<Home className="h-4 w-4" />} cultural>
            Home
          </AccessibleNavItem>
          <AccessibleNavItem href="/gallery" cultural>
            Gallery
          </AccessibleNavItem>
          <AccessibleNavItem href="/about" cultural>
            About
          </AccessibleNavItem>
          <AccessibleNavItem href="/help" cultural>
            Help
          </AccessibleNavItem>
          <AccessibleNavItem href="/contact" cultural>
            Contact
          </AccessibleNavItem>
        </div>
      </AccessibleMobileMenu>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <AccessibleBreadcrumb
          items={[
            { href: '/', label: 'Home' },
            { href: '/gallery', label: 'Gallery' },
            { label: 'Wedding Designs', current: true },
          ]}
          cultural
        />
      </div>

      {/* Main content */}
      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-cultural-text mb-4">
          Accessible Navigation Demo
        </h2>
        <p className="text-cultural-secondary">
          This demo showcases accessible navigation patterns with proper ARIA attributes,
          keyboard navigation, and screen reader support.
        </p>
      </main>
    </div>
  );
};

export default {
  AccessibleNavItem,
  AccessibleDropdown,
  AccessibleMobileMenu,
  AccessibleBreadcrumb,
  AccessibleSkipLink,
  AccessibleNavigationDemo,
};