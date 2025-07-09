// Accessibility utilities for WCAG 2.1 AA compliance

// Color contrast utilities
export const colorContrast = {
  // Calculate relative luminance
  getLuminance(hex: string): number {
    const rgb = this.hexToRgb(hex);
    if (!rgb) return 0;

    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
      const sRGB = c / 255;
      return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  },

  // Convert hex to RGB
  hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  },

  // Calculate contrast ratio
  getContrastRatio(color1: string, color2: string): number {
    const lum1 = this.getLuminance(color1);
    const lum2 = this.getLuminance(color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  },

  // Check if contrast meets WCAG standards
  meetsWCAG(color1: string, color2: string, level: 'AA' | 'AAA' = 'AA'): boolean {
    const ratio = this.getContrastRatio(color1, color2);
    return level === 'AA' ? ratio >= 4.5 : ratio >= 7;
  },

  // Check if contrast meets WCAG standards for large text
  meetsWCAGLarge(color1: string, color2: string, level: 'AA' | 'AAA' = 'AA'): boolean {
    const ratio = this.getContrastRatio(color1, color2);
    return level === 'AA' ? ratio >= 3 : ratio >= 4.5;
  }
};

// Screen reader utilities
export const screenReader = {
  // Announce to screen readers
  announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    if (typeof window === 'undefined') return;

    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  },

  // Create screen reader only text
  createSROnlyText(text: string): HTMLElement {
    const element = document.createElement('span');
    element.className = 'sr-only';
    element.textContent = text;
    return element;
  },

  // Skip link functionality
  createSkipLink(targetId: string, text: string = 'Skip to main content'): HTMLElement {
    const skipLink = document.createElement('a');
    skipLink.href = `#${targetId}`;
    skipLink.className = 'skip-link';
    skipLink.textContent = text;
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById(targetId);
      if (target) {
        target.focus();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
    return skipLink;
  }
};

// Keyboard navigation utilities
export const keyboardNavigation = {
  // Trap focus within an element
  trapFocus(element: HTMLElement): () => void {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable.focus();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable.focus();
          }
        }
      }
      
      if (e.key === 'Escape') {
        const closeButton = element.querySelector('[data-close]') as HTMLElement;
        if (closeButton) closeButton.click();
      }
    };

    element.addEventListener('keydown', handleKeyDown);
    
    // Focus first element
    if (firstFocusable) firstFocusable.focus();

    // Return cleanup function
    return () => {
      element.removeEventListener('keydown', handleKeyDown);
    };
  },

  // Handle arrow key navigation
  handleArrowKeys(
    container: HTMLElement,
    items: NodeListOf<HTMLElement>,
    orientation: 'horizontal' | 'vertical' = 'horizontal'
  ): () => void {
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentIndex = Array.from(items).indexOf(e.target as HTMLElement);
      let nextIndex = currentIndex;

      switch (e.key) {
        case 'ArrowRight':
          if (orientation === 'horizontal') {
            e.preventDefault();
            nextIndex = (currentIndex + 1) % items.length;
          }
          break;
        case 'ArrowLeft':
          if (orientation === 'horizontal') {
            e.preventDefault();
            nextIndex = (currentIndex - 1 + items.length) % items.length;
          }
          break;
        case 'ArrowDown':
          if (orientation === 'vertical') {
            e.preventDefault();
            nextIndex = (currentIndex + 1) % items.length;
          }
          break;
        case 'ArrowUp':
          if (orientation === 'vertical') {
            e.preventDefault();
            nextIndex = (currentIndex - 1 + items.length) % items.length;
          }
          break;
        case 'Home':
          e.preventDefault();
          nextIndex = 0;
          break;
        case 'End':
          e.preventDefault();
          nextIndex = items.length - 1;
          break;
      }

      if (nextIndex !== currentIndex) {
        items[nextIndex].focus();
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }
};

// Focus management utilities
export const focusManagement = {
  // Save current focus
  saveFocus(): HTMLElement | null {
    return document.activeElement as HTMLElement;
  },

  // Restore focus
  restoreFocus(element: HTMLElement | null): void {
    if (element && element.focus) {
      element.focus();
    }
  },

  // Find next focusable element
  findNextFocusable(element: HTMLElement): HTMLElement | null {
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    const currentIndex = Array.from(focusableElements).indexOf(element);
    return focusableElements[currentIndex + 1] || focusableElements[0];
  },

  // Find previous focusable element
  findPreviousFocusable(element: HTMLElement): HTMLElement | null {
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    const currentIndex = Array.from(focusableElements).indexOf(element);
    return focusableElements[currentIndex - 1] || focusableElements[focusableElements.length - 1];
  },

  // Create focus outline
  createFocusOutline(element: HTMLElement): void {
    element.style.outline = '2px solid var(--cultural-accent)';
    element.style.outlineOffset = '2px';
  },

  // Remove focus outline
  removeFocusOutline(element: HTMLElement): void {
    element.style.outline = 'none';
    element.style.outlineOffset = 'initial';
  }
};

// ARIA utilities
export const aria = {
  // Set ARIA attributes
  setAttributes(element: HTMLElement, attributes: Record<string, string>): void {
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  },

  // Toggle ARIA expanded
  toggleExpanded(element: HTMLElement): void {
    const isExpanded = element.getAttribute('aria-expanded') === 'true';
    element.setAttribute('aria-expanded', (!isExpanded).toString());
  },

  // Set ARIA selected
  setSelected(element: HTMLElement, selected: boolean): void {
    element.setAttribute('aria-selected', selected.toString());
  },

  // Set ARIA pressed
  setPressed(element: HTMLElement, pressed: boolean): void {
    element.setAttribute('aria-pressed', pressed.toString());
  },

  // Create ARIA describedby relationship
  createDescribedBy(element: HTMLElement, descriptionId: string): void {
    element.setAttribute('aria-describedby', descriptionId);
  },

  // Create ARIA labelledby relationship
  createLabelledBy(element: HTMLElement, labelId: string): void {
    element.setAttribute('aria-labelledby', labelId);
  },

  // Update live region
  updateLiveRegion(regionId: string, content: string): void {
    const region = document.getElementById(regionId);
    if (region) {
      region.textContent = content;
    }
  }
};

// Touch and gesture accessibility
export const touchAccessibility = {
  // Minimum touch target size (44px)
  MINIMUM_TOUCH_TARGET: 44,

  // Check if element meets touch target size
  meetsTouchTarget(element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect();
    return rect.width >= this.MINIMUM_TOUCH_TARGET && rect.height >= this.MINIMUM_TOUCH_TARGET;
  },

  // Add touch target padding
  addTouchTargetPadding(element: HTMLElement): void {
    const rect = element.getBoundingClientRect();
    if (rect.width < this.MINIMUM_TOUCH_TARGET) {
      const padding = (this.MINIMUM_TOUCH_TARGET - rect.width) / 2;
      element.style.paddingLeft = `${padding}px`;
      element.style.paddingRight = `${padding}px`;
    }
    if (rect.height < this.MINIMUM_TOUCH_TARGET) {
      const padding = (this.MINIMUM_TOUCH_TARGET - rect.height) / 2;
      element.style.paddingTop = `${padding}px`;
      element.style.paddingBottom = `${padding}px`;
    }
  }
};

// Accessibility testing utilities
export const accessibilityTesting = {
  // Test color contrast
  testColorContrast(color1: string, color2: string): {
    ratio: number;
    passesAA: boolean;
    passesAAA: boolean;
    passesAALarge: boolean;
    passesAAALarge: boolean;
  } {
    const ratio = colorContrast.getContrastRatio(color1, color2);
    return {
      ratio,
      passesAA: ratio >= 4.5,
      passesAAA: ratio >= 7,
      passesAALarge: ratio >= 3,
      passesAAALarge: ratio >= 4.5
    };
  },

  // Test keyboard navigation
  testKeyboardNavigation(element: HTMLElement): {
    isFocusable: boolean;
    hasProperTabIndex: boolean;
    hasKeyboardHandlers: boolean;
  } {
    const isFocusable = element.tabIndex >= 0 || 
      ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(element.tagName);
    
    const hasProperTabIndex = element.tabIndex >= 0;
    
    const hasKeyboardHandlers = [
      'keydown', 'keyup', 'keypress'
    ].some(event => {
      const listeners = (element as any).getEventListeners?.(event);
      return listeners && listeners.length > 0;
    });

    return {
      isFocusable,
      hasProperTabIndex,
      hasKeyboardHandlers
    };
  },

  // Test ARIA attributes
  testAriaAttributes(element: HTMLElement): {
    hasAriaLabel: boolean;
    hasAriaDescription: boolean;
    hasProperRole: boolean;
    hasAriaStates: boolean;
  } {
    const hasAriaLabel = !!(
      element.getAttribute('aria-label') ||
      element.getAttribute('aria-labelledby')
    );
    
    const hasAriaDescription = !!(
      element.getAttribute('aria-description') ||
      element.getAttribute('aria-describedby')
    );
    
    const hasProperRole = !!element.getAttribute('role');
    
    const hasAriaStates = !!(
      element.getAttribute('aria-expanded') ||
      element.getAttribute('aria-selected') ||
      element.getAttribute('aria-pressed') ||
      element.getAttribute('aria-checked')
    );

    return {
      hasAriaLabel,
      hasAriaDescription,
      hasProperRole,
      hasAriaStates
    };
  }
};

// Reduced motion utilities
export const reducedMotion = {
  // Check if user prefers reduced motion
  prefersReducedMotion(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  // Apply reduced motion styles
  applyReducedMotion(element: HTMLElement): void {
    if (this.prefersReducedMotion()) {
      element.style.animation = 'none';
      element.style.transition = 'none';
      element.style.transform = 'none';
    }
  },

  // Create reduced motion media query listener
  createReducedMotionListener(callback: (prefersReduced: boolean) => void): () => void {
    if (typeof window === 'undefined') return () => {};

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => callback(e.matches);
    
    mediaQuery.addEventListener('change', handler);
    
    return () => mediaQuery.removeEventListener('change', handler);
  }
};

export default {
  colorContrast,
  screenReader,
  keyboardNavigation,
  focusManagement,
  aria,
  touchAccessibility,
  accessibilityTesting,
  reducedMotion
};