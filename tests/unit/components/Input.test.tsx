import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '@/components/Common/Input'

describe('Input', () => {
  describe('Rendering', () => {
    it('should render input element', () => {
      render(<Input />)

      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('should render with label', () => {
      render(<Input label="Username" />)

      expect(screen.getByLabelText('Username')).toBeInTheDocument()
    })

    it('should render with placeholder', () => {
      render(<Input placeholder="Enter text..." />)

      expect(screen.getByPlaceholderText('Enter text...')).toBeInTheDocument()
    })

    it('should render with value', () => {
      render(<Input value="test value" onChange={() => {}} />)

      expect(screen.getByRole('textbox')).toHaveValue('test value')
    })

    it('should render with helper text', () => {
      render(<Input helperText="This is a helper message" />)

      expect(screen.getByText('This is a helper message')).toBeInTheDocument()
    })
  })

  describe('Input Types', () => {
    it('should render as text input by default', () => {
      render(<Input />)

      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text')
    })

    it('should render as password input', () => {
      render(<Input type="password" />)

      // Password inputs don't have role "textbox", query directly
      const input = document.querySelector('input[type="password"]')
      expect(input).toBeInTheDocument()
      expect(input).toHaveAttribute('type', 'password')
    })

    it('should render as email input', () => {
      render(<Input type="email" />)

      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email')
    })

    it('should render as number input', () => {
      render(<Input type="number" />)

      const input = document.querySelector('input[type="number"]')
      expect(input).toBeInTheDocument()
    })

    it('should render as search input', () => {
      render(<Input type="search" />)

      expect(screen.getByRole('searchbox')).toBeInTheDocument()
    })
  })

  describe('States', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Input disabled />)

      expect(screen.getByRole('textbox')).toBeDisabled()
    })

    it('should be readonly when readonly prop is true', () => {
      render(<Input readOnly />)

      expect(screen.getByRole('textbox')).toHaveAttribute('readonly')
    })

    it('should be required when required prop is true', () => {
      render(<Input required />)

      expect(screen.getByRole('textbox')).toBeRequired()
    })

    it('should show error state', () => {
      render(<Input error="This field is required" />)

      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('input-error')
      expect(input).toHaveAttribute('aria-invalid', 'true')
    })

    it('should display error message', () => {
      render(<Input error="Invalid input" />)

      expect(screen.getByText('Invalid input')).toBeInTheDocument()
    })
  })

  describe('Interactions', () => {
    it('should call onChange when typing', async () => {
      const handleChange = vi.fn()
      const user = userEvent.setup()

      render(<Input onChange={handleChange} />)

      const input = screen.getByRole('textbox')
      await user.type(input, 'Hello')

      expect(handleChange).toHaveBeenCalled()
      expect(handleChange).toHaveBeenCalledTimes(5) // One for each character
    })

    it('should call onFocus when focused', async () => {
      const handleFocus = vi.fn()
      const user = userEvent.setup()

      render(<Input onFocus={handleFocus} />)

      await user.click(screen.getByRole('textbox'))

      expect(handleFocus).toHaveBeenCalledTimes(1)
    })

    it('should call onBlur when blurred', async () => {
      const handleBlur = vi.fn()
      const user = userEvent.setup()

      render(<Input onBlur={handleBlur} />)

      const input = screen.getByRole('textbox')
      await user.click(input)
      await user.tab()

      expect(handleBlur).toHaveBeenCalledTimes(1)
    })

    it('should call onKeyDown when key is pressed', async () => {
      const handleKeyDown = vi.fn()
      const user = userEvent.setup()

      render(<Input onKeyDown={handleKeyDown} />)

      const input = screen.getByRole('textbox')
      input.focus()
      await user.keyboard('a')

      expect(handleKeyDown).toHaveBeenCalled()
    })
  })

  describe('Icon Support', () => {
    it('should render left icon', () => {
      const Icon = () => <span data-testid="left-icon">L</span>
      render(<Input leftIcon={<Icon />} />)

      expect(screen.getByTestId('left-icon')).toBeInTheDocument()
    })

    it('should render right icon', () => {
      const Icon = () => <span data-testid="right-icon">R</span>
      render(<Input rightIcon={<Icon />} />)

      expect(screen.getByTestId('right-icon')).toBeInTheDocument()
    })

    it('should render both left and right icons', () => {
      const LeftIcon = () => <span data-testid="left-icon">L</span>
      const RightIcon = () => <span data-testid="right-icon">R</span>

      render(<Input leftIcon={<LeftIcon />} rightIcon={<RightIcon />} />)

      expect(screen.getByTestId('left-icon')).toBeInTheDocument()
      expect(screen.getByTestId('right-icon')).toBeInTheDocument()
    })
  })

  describe('Sizes', () => {
    it('should render small size', () => {
      render(<Input size="small" />)

      expect(screen.getByRole('textbox')).toHaveClass('input-small')
    })

    it('should render medium size by default', () => {
      render(<Input />)

      expect(screen.getByRole('textbox')).toHaveClass('input-medium')
    })

    it('should render large size', () => {
      render(<Input size="large" />)

      expect(screen.getByRole('textbox')).toHaveClass('input-large')
    })
  })

  describe('Custom Props', () => {
    it('should accept custom className', () => {
      render(<Input className="custom-class" />)

      expect(screen.getByRole('textbox')).toHaveClass('custom-class')
    })

    it('should forward ref', () => {
      const ref = vi.fn()
      render(<Input ref={ref} />)

      expect(ref).toHaveBeenCalled()
    })

    it('should accept id prop', () => {
      render(<Input id="test-input" />)

      expect(screen.getByRole('textbox')).toHaveAttribute('id', 'test-input')
    })

    it('should link label to input with id', () => {
      render(<Input id="email" label="Email" />)

      const input = screen.getByLabelText('Email')
      expect(input).toHaveAttribute('id', 'email')
    })

    it('should auto-generate id when not provided', () => {
      render(<Input label="Name" />)

      const input = screen.getByLabelText('Name')
      expect(input).toHaveAttribute('id')
    })
  })

  describe('Full Width', () => {
    it('should support full width layout', () => {
      render(<Input fullWidth />)

      const input = screen.getByRole('textbox')
      const wrapper = input.parentElement
      expect(wrapper).toHaveClass('w-full')
    })
  })

  describe('Accessibility', () => {
    it('should be keyboard focusable', () => {
      render(<Input />)

      const input = screen.getByRole('textbox')
      input.focus()

      expect(input).toHaveFocus()
    })

    it('should not be keyboard focusable when disabled', () => {
      render(<Input disabled />)

      expect(screen.getByRole('textbox')).toBeDisabled()
    })

    it('should have aria-describedby when helperText is provided', () => {
      render(<Input helperText="Helper text" id="input-1" />)

      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-describedby', 'input-1-helper')
    })

    it('should have aria-describedby when error is provided', () => {
      render(<Input error="Error message" id="input-2" />)

      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-describedby', 'input-2-error')
    })

    it('should have aria-invalid when error exists', () => {
      render(<Input error="Error" />)

      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
    })

    it('should not have aria-invalid when no error', () => {
      render(<Input />)

      expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid')
    })
  })
})
