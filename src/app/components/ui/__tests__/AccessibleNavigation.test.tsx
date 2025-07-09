import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import {
  AccessibleNavItem,
  AccessibleDropdown,
  AccessibleMobileMenu,
  AccessibleBreadcrumb,
  AccessibleSkipLink,
} from '../AccessibleNavigation'
import { Home } from 'lucide-react'

describe('AccessibleNavItem', () => {
  const defaultProps = {
    href: '/test',
    children: 'Test Link',
  }

  it('renders as link with correct attributes', () => {
    render(<AccessibleNavItem {...defaultProps} />)
    
    const link = screen.getByRole('menuitem')
    expect(link).toHaveAttribute('href', '/test')
    expect(link).toHaveTextContent('Test Link')
  })

  it('handles click events', async () => {
    const user = userEvent.setup()
    const handleClick = jest.fn()
    
    render(<AccessibleNavItem {...defaultProps} onClick={handleClick} />)
    
    await user.click(screen.getByRole('menuitem'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('handles keyboard navigation', async () => {
    const user = userEvent.setup()
    const handleClick = jest.fn()
    
    render(<AccessibleNavItem {...defaultProps} onClick={handleClick} />)
    
    const link = screen.getByRole('menuitem')
    link.focus()
    await user.keyboard('{Enter}')
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('shows active state', () => {
    render(<AccessibleNavItem {...defaultProps} isActive />)
    
    const link = screen.getByRole('menuitem')
    expect(link).toHaveAttribute('aria-current', 'page')
  })

  it('renders with icon', () => {
    render(<AccessibleNavItem {...defaultProps} icon={<Home />} />)
    
    const link = screen.getByRole('menuitem')
    expect(link.querySelector('svg')).toBeInTheDocument()
  })

  it('handles external links', () => {
    render(<AccessibleNavItem {...defaultProps} external />)
    
    const link = screen.getByRole('menuitem')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  describe('accessibility', () => {
    it('should not have any accessibility violations', async () => {
      const { container } = render(<AccessibleNavItem {...defaultProps} />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have proper ARIA attributes', () => {
      render(<AccessibleNavItem {...defaultProps} />)
      
      const link = screen.getByRole('menuitem')
      expect(link).toHaveAttribute('role', 'menuitem')
      expect(link).toHaveAttribute('tabIndex', '0')
    })
  })
})

describe('AccessibleDropdown', () => {
  const defaultProps = {
    trigger: 'Menu',
    label: 'Main menu',
    children: (
      <div>
        <AccessibleNavItem href="/item1">Item 1</AccessibleNavItem>
        <AccessibleNavItem href="/item2">Item 2</AccessibleNavItem>
      </div>
    ),
  }

  it('renders trigger button', () => {
    render(<AccessibleDropdown {...defaultProps} />)
    
    const trigger = screen.getByLabelText('Main menu')
    expect(trigger).toBeInTheDocument()
    expect(trigger).toHaveTextContent('Menu')
  })

  it('toggles dropdown on click', async () => {
    const user = userEvent.setup()
    
    render(<AccessibleDropdown {...defaultProps} />)
    
    const trigger = screen.getByLabelText('Main menu')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    
    await user.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
  })

  it('opens dropdown with Arrow Down key', async () => {
    const user = userEvent.setup()
    
    render(<AccessibleDropdown {...defaultProps} />)
    
    const trigger = screen.getByLabelText('Main menu')
    trigger.focus()
    await user.keyboard('{ArrowDown}')
    
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
  })

  it('closes dropdown with Escape key', async () => {
    const user = userEvent.setup()
    
    render(<AccessibleDropdown {...defaultProps} />)
    
    const trigger = screen.getByLabelText('Main menu')
    await user.click(trigger)
    
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    
    await user.keyboard('{Escape}')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('closes dropdown when clicking outside', async () => {
    const user = userEvent.setup()
    
    render(
      <div>
        <AccessibleDropdown {...defaultProps} />
        <button>Outside</button>
      </div>
    )
    
    const trigger = screen.getByLabelText('Main menu')
    const outside = screen.getByText('Outside')
    
    await user.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    
    await user.click(outside)
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  describe('accessibility', () => {
    it('should not have any accessibility violations', async () => {
      const { container } = render(<AccessibleDropdown {...defaultProps} />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have proper ARIA attributes', () => {
      render(<AccessibleDropdown {...defaultProps} />)
      
      const trigger = screen.getByLabelText('Main menu')
      expect(trigger).toHaveAttribute('aria-haspopup', 'true')
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
    })
  })
})

describe('AccessibleMobileMenu', () => {
  const defaultProps = {
    isOpen: false,
    onClose: jest.fn(),
    children: (
      <div>
        <AccessibleNavItem href="/item1">Item 1</AccessibleNavItem>
        <AccessibleNavItem href="/item2">Item 2</AccessibleNavItem>
      </div>
    ),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders when open', () => {
    render(<AccessibleMobileMenu {...defaultProps} isOpen />)
    
    const menu = screen.getByRole('dialog')
    expect(menu).toBeInTheDocument()
    expect(menu).toHaveAttribute('aria-label', 'Navigation menu')
  })

  it('does not render when closed', () => {
    render(<AccessibleMobileMenu {...defaultProps} />)
    
    const menu = screen.queryByRole('dialog')
    expect(menu).not.toBeVisible()
  })

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup()
    const handleClose = jest.fn()
    
    render(<AccessibleMobileMenu {...defaultProps} isOpen onClose={handleClose} />)
    
    const closeButton = screen.getByLabelText('Close menu')
    await user.click(closeButton)
    
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when Escape key is pressed', async () => {
    const user = userEvent.setup()
    const handleClose = jest.fn()
    
    render(<AccessibleMobileMenu {...defaultProps} isOpen onClose={handleClose} />)
    
    const menu = screen.getByRole('dialog')
    await user.keyboard('{Escape}')
    
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when backdrop is clicked', async () => {
    const user = userEvent.setup()
    const handleClose = jest.fn()
    
    render(<AccessibleMobileMenu {...defaultProps} isOpen onClose={handleClose} />)
    
    // Click on backdrop (the overlay div)
    const backdrop = document.querySelector('.bg-black')
    if (backdrop) {
      await user.click(backdrop)
      expect(handleClose).toHaveBeenCalledTimes(1)
    }
  })

  describe('accessibility', () => {
    it('should not have any accessibility violations when open', async () => {
      const { container } = render(<AccessibleMobileMenu {...defaultProps} isOpen />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have proper ARIA attributes', () => {
      render(<AccessibleMobileMenu {...defaultProps} isOpen />)
      
      const menu = screen.getByRole('dialog')
      expect(menu).toHaveAttribute('aria-modal', 'true')
      expect(menu).toHaveAttribute('aria-label', 'Navigation menu')
    })

    it('should trap focus when open', async () => {
      const user = userEvent.setup()
      
      render(<AccessibleMobileMenu {...defaultProps} isOpen />)
      
      const closeButton = screen.getByLabelText('Close menu')
      
      // Focus should be trapped within the menu
      await user.tab()
      expect(closeButton).toHaveFocus()
    })
  })
})

describe('AccessibleBreadcrumb', () => {
  const defaultProps = {
    items: [
      { href: '/', label: 'Home' },
      { href: '/category', label: 'Category' },
      { label: 'Current Page', current: true },
    ],
  }

  it('renders breadcrumb navigation', () => {
    render(<AccessibleBreadcrumb {...defaultProps} />)
    
    const nav = screen.getByRole('navigation')
    expect(nav).toHaveAttribute('aria-label', 'Breadcrumb')
  })

  it('renders all breadcrumb items', () => {
    render(<AccessibleBreadcrumb {...defaultProps} />)
    
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Category')).toBeInTheDocument()
    expect(screen.getByText('Current Page')).toBeInTheDocument()
  })

  it('marks current page correctly', () => {
    render(<AccessibleBreadcrumb {...defaultProps} />)
    
    const currentPage = screen.getByText('Current Page')
    expect(currentPage).toHaveAttribute('aria-current', 'page')
  })

  it('renders links for non-current items', () => {
    render(<AccessibleBreadcrumb {...defaultProps} />)
    
    const homeLink = screen.getByText('Home')
    const categoryLink = screen.getByText('Category')
    
    expect(homeLink).toHaveAttribute('href', '/')
    expect(categoryLink).toHaveAttribute('href', '/category')
  })

  describe('accessibility', () => {
    it('should not have any accessibility violations', async () => {
      const { container } = render(<AccessibleBreadcrumb {...defaultProps} />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have proper navigation structure', () => {
      render(<AccessibleBreadcrumb {...defaultProps} />)
      
      const nav = screen.getByRole('navigation')
      const list = nav.querySelector('ol')
      
      expect(nav).toHaveAttribute('aria-label', 'Breadcrumb')
      expect(list).toBeInTheDocument()
    })
  })
})

describe('AccessibleSkipLink', () => {
  const defaultProps = {
    href: '#main-content',
    children: 'Skip to main content',
  }

  it('renders skip link', () => {
    render(<AccessibleSkipLink {...defaultProps} />)
    
    const skipLink = screen.getByText('Skip to main content')
    expect(skipLink).toBeInTheDocument()
    expect(skipLink).toHaveAttribute('href', '#main-content')
  })

  it('handles click to focus target', async () => {
    const user = userEvent.setup()
    
    // Create a target element
    render(
      <div>
        <AccessibleSkipLink {...defaultProps} />
        <main id="main-content" tabIndex={-1}>
          Main Content
        </main>
      </div>
    )
    
    const skipLink = screen.getByText('Skip to main content')
    const mainContent = screen.getByText('Main Content')
    
    await user.click(skipLink)
    
    expect(mainContent).toHaveFocus()
  })

  it('is visually hidden by default', () => {
    render(<AccessibleSkipLink {...defaultProps} />)
    
    const skipLink = screen.getByText('Skip to main content')
    expect(skipLink).toHaveClass('sr-only')
  })

  it('becomes visible when focused', () => {
    render(<AccessibleSkipLink {...defaultProps} />)
    
    const skipLink = screen.getByText('Skip to main content')
    expect(skipLink).toHaveClass('focus:not-sr-only')
  })

  describe('accessibility', () => {
    it('should not have any accessibility violations', async () => {
      const { container } = render(<AccessibleSkipLink {...defaultProps} />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should be keyboard accessible', async () => {
      const user = userEvent.setup()
      
      render(<AccessibleSkipLink {...defaultProps} />)
      
      const skipLink = screen.getByText('Skip to main content')
      
      await user.tab()
      expect(skipLink).toHaveFocus()
    })
  })
})

// Integration tests
describe('Navigation integration', () => {
  it('works with keyboard navigation flow', async () => {
    const user = userEvent.setup()
    
    render(
      <div>
        <AccessibleSkipLink href="#main">Skip to main</AccessibleSkipLink>
        <nav>
          <AccessibleNavItem href="/home">Home</AccessibleNavItem>
          <AccessibleNavItem href="/about">About</AccessibleNavItem>
          <AccessibleDropdown trigger="More" label="More options">
            <AccessibleNavItem href="/help">Help</AccessibleNavItem>
          </AccessibleDropdown>
        </nav>
        <main id="main" tabIndex={-1}>Main content</main>
      </div>
    )
    
    // Tab through navigation
    await user.tab() // Skip link
    await user.tab() // Home
    await user.tab() // About
    await user.tab() // More dropdown
    
    const dropdown = screen.getByLabelText('More options')
    expect(dropdown).toHaveFocus()
  })

  it('maintains focus management across components', async () => {
    const user = userEvent.setup()
    
    render(
      <div>
        <AccessibleNavItem href="/test">Test Link</AccessibleNavItem>
        <button>Other Button</button>
      </div>
    )
    
    const link = screen.getByRole('menuitem')
    const button = screen.getByText('Other Button')
    
    await user.tab()
    expect(link).toHaveFocus()
    
    await user.tab()
    expect(button).toHaveFocus()
  })
})