import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { AccessibleFormField, AccessibleSelect, AccessibleTextarea } from '../AccessibleForm'

describe('AccessibleFormField', () => {
  const defaultProps = {
    id: 'test-field',
    label: 'Test Field',
    value: '',
    onChange: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders with correct label association', () => {
    render(<AccessibleFormField {...defaultProps} />)
    
    const input = screen.getByLabelText('Test Field')
    const label = screen.getByText('Test Field')
    
    expect(input).toBeInTheDocument()
    expect(label).toHaveAttribute('for', 'test-field')
  })

  it('handles input changes', async () => {
    const user = userEvent.setup()
    const handleChange = jest.fn()
    
    render(<AccessibleFormField {...defaultProps} onChange={handleChange} />)
    
    const input = screen.getByLabelText('Test Field')
    await user.type(input, 'Hello')
    
    expect(handleChange).toHaveBeenCalledWith('Hello')
  })

  it('shows required indicator', () => {
    render(<AccessibleFormField {...defaultProps} required />)
    
    const requiredIndicator = screen.getByText('*')
    expect(requiredIndicator).toBeInTheDocument()
    expect(requiredIndicator).toHaveAttribute('aria-label', 'required')
  })

  it('displays description text', () => {
    const description = 'This is a helpful description'
    render(<AccessibleFormField {...defaultProps} description={description} />)
    
    const descriptionElement = screen.getByText(description)
    expect(descriptionElement).toBeInTheDocument()
    expect(descriptionElement).toHaveAttribute('id', 'test-field-description')
  })

  it('displays error message', () => {
    const error = 'This field is required'
    render(<AccessibleFormField {...defaultProps} error={error} />)
    
    const errorElement = screen.getByText(error)
    const input = screen.getByLabelText('Test Field')
    
    expect(errorElement).toBeInTheDocument()
    expect(errorElement).toHaveAttribute('role', 'alert')
    expect(errorElement).toHaveAttribute('aria-live', 'polite')
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })

  it('handles password toggle', async () => {
    const user = userEvent.setup()
    
    render(
      <AccessibleFormField
        {...defaultProps}
        type="password"
        value="secret"
        showPasswordToggle
      />
    )
    
    const input = screen.getByLabelText('Test Field')
    const toggleButton = screen.getByLabelText('Show password')
    
    expect(input).toHaveAttribute('type', 'password')
    
    await user.click(toggleButton)
    expect(input).toHaveAttribute('type', 'text')
    expect(screen.getByLabelText('Hide password')).toBeInTheDocument()
  })

  it('shows character count', () => {
    render(
      <AccessibleFormField
        {...defaultProps}
        value="Hello"
        maxLength={10}
      />
    )
    
    const characterCount = screen.getByText('5/10 characters')
    expect(characterCount).toBeInTheDocument()
    expect(characterCount).toHaveAttribute('aria-live', 'polite')
  })

  it('warns when approaching character limit', () => {
    render(
      <AccessibleFormField
        {...defaultProps}
        value="Hello World"
        maxLength={12}
      />
    )
    
    const characterCount = screen.getByText('11/12 characters')
    expect(characterCount).toHaveClass('text-orange-600')
  })

  it('handles disabled state', () => {
    render(<AccessibleFormField {...defaultProps} disabled />)
    
    const input = screen.getByLabelText('Test Field')
    expect(input).toBeDisabled()
    expect(input).toHaveClass('disabled:opacity-50')
  })

  it('builds proper aria-describedby attribute', () => {
    render(
      <AccessibleFormField
        {...defaultProps}
        description="Description text"
        error="Error text"
        maxLength={10}
      />
    )
    
    const input = screen.getByLabelText('Test Field')
    const describedBy = input.getAttribute('aria-describedby')
    
    expect(describedBy).toContain('test-field-description')
    expect(describedBy).toContain('test-field-error')
    expect(describedBy).toContain('test-field-character-count')
  })

  describe('accessibility', () => {
    it('should not have any accessibility violations', async () => {
      const { container } = render(<AccessibleFormField {...defaultProps} />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have proper focus management', async () => {
      const user = userEvent.setup()
      render(<AccessibleFormField {...defaultProps} />)
      
      const input = screen.getByLabelText('Test Field')
      await user.tab()
      
      expect(input).toHaveFocus()
    })

    it('should announce errors to screen readers', () => {
      const error = 'This field is required'
      render(<AccessibleFormField {...defaultProps} error={error} />)
      
      const errorElement = screen.getByText(error)
      expect(errorElement).toHaveAttribute('aria-live', 'polite')
      expect(errorElement).toHaveAttribute('role', 'alert')
    })
  })
})

describe('AccessibleSelect', () => {
  const defaultProps = {
    id: 'test-select',
    label: 'Test Select',
    value: '',
    onChange: jest.fn(),
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3', disabled: true },
    ],
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders with correct options', () => {
    render(<AccessibleSelect {...defaultProps} />)
    
    const select = screen.getByLabelText('Test Select')
    const options = screen.getAllByRole('option')
    
    expect(select).toBeInTheDocument()
    expect(options).toHaveLength(3)
    expect(options[0]).toHaveTextContent('Option 1')
    expect(options[2]).toBeDisabled()
  })

  it('handles selection changes', async () => {
    const user = userEvent.setup()
    const handleChange = jest.fn()
    
    render(<AccessibleSelect {...defaultProps} onChange={handleChange} />)
    
    const select = screen.getByLabelText('Test Select')
    await user.selectOptions(select, 'option1')
    
    expect(handleChange).toHaveBeenCalledWith('option1')
  })

  it('shows placeholder option', () => {
    render(<AccessibleSelect {...defaultProps} placeholder="Choose an option" />)
    
    const placeholderOption = screen.getByText('Choose an option')
    expect(placeholderOption).toBeInTheDocument()
    expect(placeholderOption).toHaveAttribute('value', '')
    expect(placeholderOption).toBeDisabled()
  })

  it('displays error state', () => {
    const error = 'Please select an option'
    render(<AccessibleSelect {...defaultProps} error={error} />)
    
    const select = screen.getByLabelText('Test Select')
    const errorElement = screen.getByText(error)
    
    expect(select).toHaveAttribute('aria-invalid', 'true')
    expect(errorElement).toHaveAttribute('role', 'alert')
  })

  describe('accessibility', () => {
    it('should not have any accessibility violations', async () => {
      const { container } = render(<AccessibleSelect {...defaultProps} />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have proper ARIA attributes', () => {
      render(<AccessibleSelect {...defaultProps} required />)
      
      const select = screen.getByLabelText('Test Select')
      expect(select).toHaveAttribute('aria-required', 'true')
      expect(select).toHaveAttribute('aria-invalid', 'false')
    })
  })
})

describe('AccessibleTextarea', () => {
  const defaultProps = {
    id: 'test-textarea',
    label: 'Test Textarea',
    value: '',
    onChange: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders with correct attributes', () => {
    render(<AccessibleTextarea {...defaultProps} rows={5} />)
    
    const textarea = screen.getByLabelText('Test Textarea')
    expect(textarea).toBeInTheDocument()
    expect(textarea).toHaveAttribute('rows', '5')
  })

  it('handles input changes', async () => {
    const user = userEvent.setup()
    const handleChange = jest.fn()
    
    render(<AccessibleTextarea {...defaultProps} onChange={handleChange} />)
    
    const textarea = screen.getByLabelText('Test Textarea')
    await user.type(textarea, 'Hello\nWorld')
    
    expect(handleChange).toHaveBeenCalledWith('Hello\nWorld')
  })

  it('shows character count with limit', () => {
    render(
      <AccessibleTextarea
        {...defaultProps}
        value="Hello World"
        maxLength={50}
      />
    )
    
    const characterCount = screen.getByText('11/50 characters')
    expect(characterCount).toBeInTheDocument()
  })

  it('warns when approaching character limit', () => {
    render(
      <AccessibleTextarea
        {...defaultProps}
        value="This is a long text that approaches the limit"
        maxLength={50}
      />
    )
    
    const characterCount = screen.getByText('45/50 characters')
    expect(characterCount).toHaveClass('text-orange-600')
  })

  it('handles resize property', () => {
    render(<AccessibleTextarea {...defaultProps} resize="horizontal" />)
    
    const textarea = screen.getByLabelText('Test Textarea')
    expect(textarea).toHaveClass('resize-horizontal')
  })

  describe('accessibility', () => {
    it('should not have any accessibility violations', async () => {
      const { container } = render(<AccessibleTextarea {...defaultProps} />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have proper ARIA attributes', () => {
      render(
        <AccessibleTextarea
          {...defaultProps}
          required
          description="Enter your message"
        />
      )
      
      const textarea = screen.getByLabelText('Test Textarea')
      expect(textarea).toHaveAttribute('aria-required', 'true')
      expect(textarea).toHaveAttribute('aria-describedby', 'test-textarea-description')
    })
  })
})

// Form validation tests
describe('Form validation integration', () => {
  it('validates required fields', async () => {
    const user = userEvent.setup()
    const handleSubmit = jest.fn()
    
    render(
      <form onSubmit={handleSubmit}>
        <AccessibleFormField
          id="required-field"
          label="Required Field"
          value=""
          onChange={() => {}}
          required
        />
        <button type="submit">Submit</button>
      </form>
    )
    
    const input = screen.getByLabelText('Required Field')
    const submitButton = screen.getByText('Submit')
    
    await user.click(submitButton)
    
    // HTML5 validation should prevent submission
    expect(input).toBeInvalid()
  })

  it('validates email format', async () => {
    const user = userEvent.setup()
    
    render(
      <AccessibleFormField
        id="email-field"
        label="Email"
        type="email"
        value="invalid-email"
        onChange={() => {}}
      />
    )
    
    const input = screen.getByLabelText('Email')
    
    // Trigger validation
    await user.blur(input)
    
    expect(input).toHaveAttribute('type', 'email')
  })

  it('validates pattern matching', () => {
    render(
      <AccessibleFormField
        id="pattern-field"
        label="Pattern Field"
        pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
        value="123-456-7890"
        onChange={() => {}}
      />
    )
    
    const input = screen.getByLabelText('Pattern Field')
    expect(input).toHaveAttribute('pattern', '[0-9]{3}-[0-9]{3}-[0-9]{4}')
  })
})