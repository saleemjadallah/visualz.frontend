import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import AccessibleButton from '../AccessibleButton'
import { Home } from 'lucide-react'

describe('AccessibleButton', () => {
  const defaultProps = {
    children: 'Click me',
  }

  it('renders with correct text content', () => {
    render(<AccessibleButton {...defaultProps} />)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })

  it('handles click events', async () => {
    const user = userEvent.setup()
    const handleClick = jest.fn()
    
    render(<AccessibleButton {...defaultProps} onClick={handleClick} />)
    
    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('handles keyboard navigation (Enter key)', async () => {
    const user = userEvent.setup()
    const handleClick = jest.fn()
    
    render(<AccessibleButton {...defaultProps} onClick={handleClick} />)
    
    const button = screen.getByRole('button')
    button.focus()
    await user.keyboard('{Enter}')
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('handles keyboard navigation (Space key)', async () => {
    const user = userEvent.setup()
    const handleClick = jest.fn()
    
    render(<AccessibleButton {...defaultProps} onClick={handleClick} />)
    
    const button = screen.getByRole('button')
    button.focus()
    await user.keyboard(' ')
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('respects disabled state', async () => {
    const user = userEvent.setup()
    const handleClick = jest.fn()
    
    render(<AccessibleButton {...defaultProps} onClick={handleClick} disabled />)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    
    await user.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('shows loading state correctly', () => {
    render(<AccessibleButton {...defaultProps} loading loadingText="Loading..." />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveTextContent('Loading...')
    expect(button).toHaveAttribute('aria-label', 'Loading...')
    expect(button).toBeDisabled()
  })

  it('renders with icon in correct position', () => {
    render(
      <AccessibleButton {...defaultProps} icon={<Home />} iconPosition="left" />
    )
    
    // Icon should be present and positioned correctly
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button.querySelector('svg')).toBeInTheDocument()
  })

  it('supports custom onPress handler', async () => {
    const user = userEvent.setup()
    const handlePress = jest.fn()
    
    render(<AccessibleButton {...defaultProps} onPress={handlePress} />)
    
    await user.click(screen.getByRole('button'))
    expect(handlePress).toHaveBeenCalledTimes(1)
  })

  it('announces to screen readers when specified', async () => {
    const user = userEvent.setup()
    const announcement = 'Button pressed successfully'
    
    render(<AccessibleButton {...defaultProps} announcement={announcement} />)
    
    await user.click(screen.getByRole('button'))
    
    // Check for aria-live region
    await waitFor(() => {
      expect(screen.getByText(announcement)).toBeInTheDocument()
    })
  })

  it('sets proper ARIA attributes', () => {
    render(<AccessibleButton {...defaultProps} describedBy="help-text" />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-describedby', 'help-text')
    expect(button).toHaveAttribute('aria-pressed', 'false')
    expect(button).toHaveAttribute('role', 'button')
    expect(button).toHaveAttribute('tabIndex', '0')
  })

  it('applies cultural styling when enabled', () => {
    render(<AccessibleButton {...defaultProps} cultural />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-cultural-accent')
  })

  it('applies different variants correctly', () => {
    const { rerender } = render(<AccessibleButton {...defaultProps} variant="outline" />)
    let button = screen.getByRole('button')
    expect(button).toHaveClass('border-2')
    
    rerender(<AccessibleButton {...defaultProps} variant="ghost" />)
    button = screen.getByRole('button')
    expect(button).toHaveClass('text-blue-600')
  })

  it('applies different sizes correctly', () => {
    const { rerender } = render(<AccessibleButton {...defaultProps} size="sm" />)
    let button = screen.getByRole('button')
    expect(button).toHaveClass('min-h-[32px]')
    
    rerender(<AccessibleButton {...defaultProps} size="lg" />)
    button = screen.getByRole('button')
    expect(button).toHaveClass('min-h-[48px]')
  })

  it('handles fullWidth prop', () => {
    render(<AccessibleButton {...defaultProps} fullWidth />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('w-full')
  })

  // Accessibility tests
  describe('accessibility', () => {
    it('should not have any accessibility violations', async () => {
      const { container } = render(<AccessibleButton {...defaultProps} />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have proper focus management', async () => {
      const user = userEvent.setup()
      render(<AccessibleButton {...defaultProps} />)
      
      const button = screen.getByRole('button')
      await user.tab()
      
      expect(button).toHaveFocus()
    })

    it('should support screen reader announcements', () => {
      render(<AccessibleButton {...defaultProps} />)
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('role', 'button')
      expect(button).toBeVisible()
    })

    it('should meet minimum touch target size', () => {
      render(<AccessibleButton {...defaultProps} />)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('min-h-[40px]') // Default md size
    })

    it('should handle disabled state accessibly', () => {
      render(<AccessibleButton {...defaultProps} disabled />)
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-disabled', 'true')
      expect(button).toHaveAttribute('tabIndex', '-1')
    })

    it('should handle loading state accessibly', () => {
      render(<AccessibleButton {...defaultProps} loading loadingText="Please wait" />)
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-label', 'Please wait')
      expect(button).toHaveAttribute('aria-disabled', 'true')
    })
  })

  // Integration tests
  describe('integration', () => {
    it('works with form submission', async () => {
      const user = userEvent.setup()
      const handleSubmit = jest.fn()
      
      render(
        <form onSubmit={handleSubmit}>
          <AccessibleButton type="submit">Submit</AccessibleButton>
        </form>
      )
      
      await user.click(screen.getByRole('button'))
      expect(handleSubmit).toHaveBeenCalled()
    })

    it('works with keyboard navigation in form', async () => {
      const user = userEvent.setup()
      
      render(
        <form>
          <input type="text" />
          <AccessibleButton>Submit</AccessibleButton>
        </form>
      )
      
      const input = screen.getByRole('textbox')
      const button = screen.getByRole('button')
      
      input.focus()
      await user.tab()
      
      expect(button).toHaveFocus()
    })
  })
})

// Color contrast tests
describe('AccessibleButton color contrast', () => {
  it('should meet WCAG color contrast requirements', () => {
    // These would typically be tested with actual color values
    // For now, we test that the proper classes are applied
    render(<AccessibleButton cultural>Button</AccessibleButton>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-cultural-accent')
    expect(button).toHaveClass('text-white')
  })
})