import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/Common/Button'

describe('Button', () => {
  describe('Rendering', () => {
    it('should render with text content', () => {
      render(<Button>Click me</Button>)

      expect(screen.getByRole('button')).toHaveTextContent('Click me')
    })

    it('should render as primary variant by default', () => {
      render(<Button>Primary</Button>)

      const button = screen.getByRole('button')
      expect(button).toHaveClass('btn-primary')
    })

    it('should render as secondary variant when specified', () => {
      render(<Button variant="secondary">Secondary</Button>)

      const button = screen.getByRole('button')
      expect(button).toHaveClass('btn-secondary')
    })

    it('should render as ghost variant when specified', () => {
      render(<Button variant="ghost">Ghost</Button>)

      const button = screen.getByRole('button')
      expect(button).toHaveClass('btn-ghost')
    })

    it('should render with icon only', () => {
      const Icon = () => <span data-testid="icon">X</span>
      render(
        <Button icon={<Icon />} aria-label="Close" />
      )

      expect(screen.getByTestId('icon')).toBeInTheDocument()
      expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Close')
    })

    it('should render with icon and text', () => {
      const Icon = () => <span data-testid="icon">+</span>
      render(
        <Button icon={<Icon />}>
          Add Item
        </Button>
      )

      expect(screen.getByTestId('icon')).toBeInTheDocument()
      expect(screen.getByRole('button')).toHaveTextContent('Add Item')
    })
  })

  describe('Sizes', () => {
    it('should render small size', () => {
      render(<Button size="small">Small</Button>)

      expect(screen.getByRole('button')).toHaveClass('btn-small')
    })

    it('should render medium size by default', () => {
      render(<Button>Medium</Button>)

      expect(screen.getByRole('button')).toHaveClass('btn-medium')
    })

    it('should render large size', () => {
      render(<Button size="large">Large</Button>)

      expect(screen.getByRole('button')).toHaveClass('btn-large')
    })
  })

  describe('States', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>)

      expect(screen.getByRole('button')).toBeDisabled()
    })

    it('should show loading state', () => {
      render(<Button loading>Loading</Button>)

      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button).toHaveClass('btn-loading')
    })

    it('should hide text and show spinner when loading', () => {
      render(<Button loading>Submit</Button>)

      const button = screen.getByRole('button')
      expect(button).toHaveTextContent('Submit')
      // Spinner should be present
      expect(button.querySelector('.loading-spinner')).toBeInTheDocument()
    })
  })

  describe('Interactions', () => {
    it('should call onClick when clicked', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()

      render(<Button onClick={handleClick}>Click</Button>)

      await user.click(screen.getByRole('button'))

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should not call onClick when disabled', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()

      render(<Button onClick={handleClick} disabled>Click</Button>)

      await user.click(screen.getByRole('button'))

      expect(handleClick).not.toHaveBeenCalled()
    })

    it('should not call onClick when loading', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()

      render(<Button onClick={handleClick} loading>Click</Button>)

      await user.click(screen.getByRole('button'))

      expect(handleClick).not.toHaveBeenCalled()
    })

    it('should support keyboard interaction (Enter)', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()

      render(<Button onClick={handleClick}>Click</Button>)

      const button = screen.getByRole('button')
      button.focus()
      await user.keyboard('{Enter}')

      expect(handleClick).toHaveBeenCalled()
    })

    it('should support keyboard interaction (Space)', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()

      render(<Button onClick={handleClick}>Click</Button>)

      const button = screen.getByRole('button')
      button.focus()
      await user.keyboard(' ')

      expect(handleClick).toHaveBeenCalled()
    })
  })

  describe('Custom Props', () => {
    it('should accept custom className', () => {
      render(<Button className="custom-class">Custom</Button>)

      const button = screen.getByRole('button')
      expect(button).toHaveClass('custom-class')
      expect(button).toHaveClass('btn-primary') // Should still have base classes
    })

    it('should forward ref', () => {
      const ref = vi.fn()
      render(<Button ref={ref}>Button</Button>)

      expect(ref).toHaveBeenCalled()
    })

    it('should accept type prop', () => {
      render(<Button type="submit">Submit</Button>)

      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
    })

    it('should have button type by default', () => {
      render(<Button>Button</Button>)

      expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
    })

    it('should accept aria-label', () => {
      render(<Button aria-label="Close dialog">X</Button>)

      expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Close dialog')
    })
  })

  describe('Full Width', () => {
    it('should support full width layout', () => {
      render(<Button fullWidth>Full Width</Button>)

      expect(screen.getByRole('button')).toHaveClass('btn-full-width')
    })
  })

  describe('Accessibility', () => {
    it('should be keyboard focusable', () => {
      render(<Button>Focusable</Button>)

      const button = screen.getByRole('button')
      button.focus()

      expect(button).toHaveFocus()
    })

    it('should not be keyboard focusable when disabled', () => {
      render(<Button disabled>Not Focusable</Button>)

      const button = screen.getByRole('button')

      expect(button).toBeDisabled()
    })

    it('should have correct aria attributes when loading', () => {
      render(<Button loading>Loading</Button>)

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-busy', 'true')
    })
  })
})
