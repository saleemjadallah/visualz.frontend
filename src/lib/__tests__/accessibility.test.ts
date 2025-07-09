import {
  colorContrast,
  screenReader,
  keyboardNavigation,
  focusManagement,
  aria,
  touchAccessibility,
  accessibilityTesting,
  reducedMotion,
} from '../accessibility'

// Mock DOM methods
beforeEach(() => {
  document.body.innerHTML = ''
  
  // Mock scrollIntoView
  Element.prototype.scrollIntoView = jest.fn()
  
  // Mock focus
  HTMLElement.prototype.focus = jest.fn()
  
  // Mock getBoundingClientRect
  HTMLElement.prototype.getBoundingClientRect = jest.fn(() => ({
    width: 100,
    height: 100,
    top: 0,
    left: 0,
    bottom: 100,
    right: 100,
    x: 0,
    y: 0,
    toJSON: () => {},
  }))
})

describe('colorContrast', () => {
  describe('hexToRgb', () => {
    it('converts hex to RGB correctly', () => {
      expect(colorContrast.hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 })
      expect(colorContrast.hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 })
      expect(colorContrast.hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 })
    })

    it('handles short hex format', () => {
      expect(colorContrast.hexToRgb('#fff')).toBeNull()
      expect(colorContrast.hexToRgb('#000')).toBeNull()
    })

    it('handles invalid hex values', () => {
      expect(colorContrast.hexToRgb('invalid')).toBeNull()
      expect(colorContrast.hexToRgb('#gggggg')).toBeNull()
    })
  })

  describe('getLuminance', () => {
    it('calculates luminance correctly', () => {
      expect(colorContrast.getLuminance('#ffffff')).toBeCloseTo(1, 2)
      expect(colorContrast.getLuminance('#000000')).toBeCloseTo(0, 2)
    })
  })

  describe('getContrastRatio', () => {
    it('calculates contrast ratio correctly', () => {
      const ratio = colorContrast.getContrastRatio('#ffffff', '#000000')
      expect(ratio).toBeCloseTo(21, 0) // Maximum contrast ratio
    })

    it('handles same colors', () => {
      const ratio = colorContrast.getContrastRatio('#ffffff', '#ffffff')
      expect(ratio).toBeCloseTo(1, 2) // Minimum contrast ratio
    })
  })

  describe('meetsWCAG', () => {
    it('correctly identifies WCAG AA compliance', () => {
      expect(colorContrast.meetsWCAG('#ffffff', '#000000')).toBe(true)
      expect(colorContrast.meetsWCAG('#ffffff', '#cccccc')).toBe(false)
    })

    it('correctly identifies WCAG AAA compliance', () => {
      expect(colorContrast.meetsWCAG('#ffffff', '#000000', 'AAA')).toBe(true)
      expect(colorContrast.meetsWCAG('#ffffff', '#666666', 'AAA')).toBe(false)
    })
  })

  describe('meetsWCAGLarge', () => {
    it('correctly identifies WCAG AA compliance for large text', () => {
      expect(colorContrast.meetsWCAGLarge('#ffffff', '#000000')).toBe(true)
      expect(colorContrast.meetsWCAGLarge('#ffffff', '#999999')).toBe(true)
    })
  })
})

describe('screenReader', () => {
  describe('announce', () => {
    it('creates announcement element', () => {
      screenReader.announce('Test message')
      
      const announcements = document.querySelectorAll('[aria-live]')
      expect(announcements).toHaveLength(1)
      expect(announcements[0]).toHaveTextContent('Test message')
    })

    it('sets correct aria-live priority', () => {
      screenReader.announce('Test message', 'assertive')
      
      const announcement = document.querySelector('[aria-live]')
      expect(announcement).toHaveAttribute('aria-live', 'assertive')
    })

    it('removes announcement after timeout', (done) => {
      screenReader.announce('Test message')
      
      setTimeout(() => {
        const announcements = document.querySelectorAll('[aria-live]')
        expect(announcements).toHaveLength(0)
        done()
      }, 1100)
    })
  })

  describe('createSROnlyText', () => {
    it('creates screen reader only element', () => {
      const element = screenReader.createSROnlyText('Hidden text')
      
      expect(element.tagName).toBe('SPAN')
      expect(element.className).toBe('sr-only')
      expect(element.textContent).toBe('Hidden text')
    })
  })

  describe('createSkipLink', () => {
    it('creates skip link element', () => {
      const skipLink = screenReader.createSkipLink('main-content')
      
      expect(skipLink.tagName).toBe('A')
      expect(skipLink.href).toContain('#main-content')
      expect(skipLink.textContent).toBe('Skip to main content')
    })

    it('handles custom text', () => {
      const skipLink = screenReader.createSkipLink('nav', 'Skip to navigation')
      
      expect(skipLink.textContent).toBe('Skip to navigation')
    })

    it('focuses target on click', () => {
      const target = document.createElement('div')
      target.id = 'main-content'
      document.body.appendChild(target)
      
      const skipLink = screenReader.createSkipLink('main-content')
      
      // Simulate click
      skipLink.click()
      
      expect(target.focus).toHaveBeenCalled()
    })
  })
})

describe('keyboardNavigation', () => {
  describe('trapFocus', () => {
    it('traps focus within element', () => {
      const container = document.createElement('div')
      const button1 = document.createElement('button')
      const button2 = document.createElement('button')
      
      container.appendChild(button1)
      container.appendChild(button2)
      document.body.appendChild(container)
      
      const cleanup = keyboardNavigation.trapFocus(container)
      
      expect(button1.focus).toHaveBeenCalled()
      
      cleanup()
    })

    it('handles Tab key navigation', () => {
      const container = document.createElement('div')
      const button1 = document.createElement('button')
      const button2 = document.createElement('button')
      
      container.appendChild(button1)
      container.appendChild(button2)
      document.body.appendChild(container)
      
      keyboardNavigation.trapFocus(container)
      
      // Simulate Tab key on last element
      Object.defineProperty(document, 'activeElement', {
        value: button2,
        configurable: true,
      })
      
      const event = new KeyboardEvent('keydown', { key: 'Tab' })
      Object.defineProperty(event, 'preventDefault', {
        value: jest.fn(),
      })
      
      container.dispatchEvent(event)
      
      expect(button1.focus).toHaveBeenCalled()
    })

    it('handles Escape key', () => {
      const container = document.createElement('div')
      const closeButton = document.createElement('button')
      closeButton.setAttribute('data-close', '')
      closeButton.click = jest.fn()
      
      container.appendChild(closeButton)
      document.body.appendChild(container)
      
      keyboardNavigation.trapFocus(container)
      
      const event = new KeyboardEvent('keydown', { key: 'Escape' })
      container.dispatchEvent(event)
      
      expect(closeButton.click).toHaveBeenCalled()
    })
  })

  describe('handleArrowKeys', () => {
    it('handles horizontal arrow navigation', () => {
      const container = document.createElement('div')
      const items = document.querySelectorAll('button') as NodeListOf<HTMLElement>
      
      const cleanup = keyboardNavigation.handleArrowKeys(container, items, 'horizontal')
      
      expect(cleanup).toBeInstanceOf(Function)
      
      cleanup()
    })

    it('handles vertical arrow navigation', () => {
      const container = document.createElement('div')
      const items = document.querySelectorAll('button') as NodeListOf<HTMLElement>
      
      const cleanup = keyboardNavigation.handleArrowKeys(container, items, 'vertical')
      
      expect(cleanup).toBeInstanceOf(Function)
      
      cleanup()
    })
  })
})

describe('focusManagement', () => {
  describe('saveFocus', () => {
    it('saves current focus', () => {
      const button = document.createElement('button')
      document.body.appendChild(button)
      
      Object.defineProperty(document, 'activeElement', {
        value: button,
        configurable: true,
      })
      
      const saved = focusManagement.saveFocus()
      expect(saved).toBe(button)
    })
  })

  describe('restoreFocus', () => {
    it('restores focus to element', () => {
      const button = document.createElement('button')
      document.body.appendChild(button)
      
      focusManagement.restoreFocus(button)
      expect(button.focus).toHaveBeenCalled()
    })

    it('handles null element', () => {
      expect(() => focusManagement.restoreFocus(null)).not.toThrow()
    })
  })

  describe('createFocusOutline', () => {
    it('creates focus outline', () => {
      const element = document.createElement('div')
      
      focusManagement.createFocusOutline(element)
      
      expect(element.style.outline).toBe('2px solid var(--cultural-accent)')
      expect(element.style.outlineOffset).toBe('2px')
    })
  })

  describe('removeFocusOutline', () => {
    it('removes focus outline', () => {
      const element = document.createElement('div')
      element.style.outline = '2px solid blue'
      
      focusManagement.removeFocusOutline(element)
      
      expect(element.style.outline).toBe('none')
    })
  })
})

describe('aria', () => {
  describe('setAttributes', () => {
    it('sets multiple ARIA attributes', () => {
      const element = document.createElement('div')
      
      aria.setAttributes(element, {
        'aria-label': 'Test label',
        'aria-expanded': 'false',
        'role': 'button',
      })
      
      expect(element.getAttribute('aria-label')).toBe('Test label')
      expect(element.getAttribute('aria-expanded')).toBe('false')
      expect(element.getAttribute('role')).toBe('button')
    })
  })

  describe('toggleExpanded', () => {
    it('toggles aria-expanded attribute', () => {
      const element = document.createElement('div')
      element.setAttribute('aria-expanded', 'false')
      
      aria.toggleExpanded(element)
      expect(element.getAttribute('aria-expanded')).toBe('true')
      
      aria.toggleExpanded(element)
      expect(element.getAttribute('aria-expanded')).toBe('false')
    })
  })

  describe('setSelected', () => {
    it('sets aria-selected attribute', () => {
      const element = document.createElement('div')
      
      aria.setSelected(element, true)
      expect(element.getAttribute('aria-selected')).toBe('true')
      
      aria.setSelected(element, false)
      expect(element.getAttribute('aria-selected')).toBe('false')
    })
  })

  describe('updateLiveRegion', () => {
    it('updates live region content', () => {
      const region = document.createElement('div')
      region.id = 'live-region'
      document.body.appendChild(region)
      
      aria.updateLiveRegion('live-region', 'Updated content')
      
      expect(region.textContent).toBe('Updated content')
    })
  })
})

describe('touchAccessibility', () => {
  describe('meetsTouchTarget', () => {
    it('checks if element meets touch target size', () => {
      const element = document.createElement('button')
      
      // Mock getBoundingClientRect to return small size
      element.getBoundingClientRect = jest.fn(() => ({
        width: 30,
        height: 30,
        top: 0,
        left: 0,
        bottom: 30,
        right: 30,
        x: 0,
        y: 0,
        toJSON: () => {},
      }))
      
      expect(touchAccessibility.meetsTouchTarget(element)).toBe(false)
      
      // Mock larger size
      element.getBoundingClientRect = jest.fn(() => ({
        width: 50,
        height: 50,
        top: 0,
        left: 0,
        bottom: 50,
        right: 50,
        x: 0,
        y: 0,
        toJSON: () => {},
      }))
      
      expect(touchAccessibility.meetsTouchTarget(element)).toBe(true)
    })
  })

  describe('addTouchTargetPadding', () => {
    it('adds padding to meet touch target size', () => {
      const element = document.createElement('button')
      
      // Mock small size
      element.getBoundingClientRect = jest.fn(() => ({
        width: 30,
        height: 30,
        top: 0,
        left: 0,
        bottom: 30,
        right: 30,
        x: 0,
        y: 0,
        toJSON: () => {},
      }))
      
      touchAccessibility.addTouchTargetPadding(element)
      
      expect(element.style.paddingLeft).toBe('7px')
      expect(element.style.paddingRight).toBe('7px')
      expect(element.style.paddingTop).toBe('7px')
      expect(element.style.paddingBottom).toBe('7px')
    })
  })
})

describe('accessibilityTesting', () => {
  describe('testColorContrast', () => {
    it('tests color contrast and returns comprehensive results', () => {
      const result = accessibilityTesting.testColorContrast('#ffffff', '#000000')
      
      expect(result.ratio).toBeCloseTo(21, 0)
      expect(result.passesAA).toBe(true)
      expect(result.passesAAA).toBe(true)
      expect(result.passesAALarge).toBe(true)
      expect(result.passesAAALarge).toBe(true)
    })
  })

  describe('testKeyboardNavigation', () => {
    it('tests keyboard navigation capabilities', () => {
      const button = document.createElement('button')
      
      const result = accessibilityTesting.testKeyboardNavigation(button)
      
      expect(result.isFocusable).toBe(true)
      expect(result.hasProperTabIndex).toBe(true)
    })
  })

  describe('testAriaAttributes', () => {
    it('tests ARIA attributes presence', () => {
      const element = document.createElement('div')
      element.setAttribute('aria-label', 'Test label')
      element.setAttribute('role', 'button')
      
      const result = accessibilityTesting.testAriaAttributes(element)
      
      expect(result.hasAriaLabel).toBe(true)
      expect(result.hasProperRole).toBe(true)
    })
  })
})

describe('reducedMotion', () => {
  describe('prefersReducedMotion', () => {
    it('checks prefers-reduced-motion preference', () => {
      // Mock matchMedia
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockReturnValue({
          matches: true,
          media: '(prefers-reduced-motion: reduce)',
        }),
      })
      
      expect(reducedMotion.prefersReducedMotion()).toBe(true)
    })
  })

  describe('applyReducedMotion', () => {
    it('applies reduced motion styles when preferred', () => {
      const element = document.createElement('div')
      
      // Mock prefersReducedMotion to return true
      jest.spyOn(reducedMotion, 'prefersReducedMotion').mockReturnValue(true)
      
      reducedMotion.applyReducedMotion(element)
      
      expect(element.style.animation).toBe('none')
      expect(element.style.transition).toBe('none')
      expect(element.style.transform).toBe('none')
    })
  })

  describe('createReducedMotionListener', () => {
    it('creates media query listener', () => {
      const callback = jest.fn()
      const mockMediaQuery = {
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }
      
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockReturnValue(mockMediaQuery),
      })
      
      const cleanup = reducedMotion.createReducedMotionListener(callback)
      
      expect(mockMediaQuery.addEventListener).toHaveBeenCalledWith('change', expect.any(Function))
      
      cleanup()
      expect(mockMediaQuery.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function))
    })
  })
})

// Integration tests
describe('accessibility integration', () => {
  it('combines multiple accessibility features', () => {
    const container = document.createElement('div')
    const button = document.createElement('button')
    
    container.appendChild(button)
    document.body.appendChild(container)
    
    // Set ARIA attributes
    aria.setAttributes(button, {
      'aria-label': 'Test button',
      'role': 'button',
    })
    
    // Test color contrast
    const contrastResult = accessibilityTesting.testColorContrast('#ffffff', '#000000')
    
    // Test keyboard navigation
    const keyboardResult = accessibilityTesting.testKeyboardNavigation(button)
    
    // Test ARIA attributes
    const ariaResult = accessibilityTesting.testAriaAttributes(button)
    
    expect(contrastResult.passesAA).toBe(true)
    expect(keyboardResult.isFocusable).toBe(true)
    expect(ariaResult.hasAriaLabel).toBe(true)
  })
})