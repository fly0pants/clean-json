import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeToggle } from '@/components/Toolbar/ThemeToggle'

describe('ThemeToggle', () => {
  const mockOnToggle = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render theme toggle button', () => {
      render(<ThemeToggle theme="dark" onToggle={mockOnToggle} />)

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    it('should display current theme state', () => {
      render(<ThemeToggle theme="dark" onToggle={mockOnToggle} />)

      // Check aria-label contains theme information
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-label')
    })

    it('should render light mode icon when theme is dark', () => {
      const { container } = render(<ThemeToggle theme="dark" onToggle={mockOnToggle} />)

      // Should show icon to switch TO light mode
      expect(container.querySelector('svg') || container.querySelector('.icon')).toBeInTheDocument()
    })

    it('should render dark mode icon when theme is light', () => {
      const { container } = render(<ThemeToggle theme="light" onToggle={mockOnToggle} />)

      expect(container.querySelector('svg') || container.querySelector('.icon')).toBeInTheDocument()
    })
  })

  describe('Interaction', () => {
    it('should call onToggle when clicked', async () => {
      const user = userEvent.setup()
      render(<ThemeToggle theme="dark" onToggle={mockOnToggle} />)

      await user.click(screen.getByRole('button'))

      expect(mockOnToggle).toHaveBeenCalledTimes(1)
    })

    it('should not call onToggle when disabled', async () => {
      const user = userEvent.setup()
      render(<ThemeToggle theme="dark" onToggle={mockOnToggle} disabled />)

      await user.click(screen.getByRole('button'))

      expect(mockOnToggle).not.toHaveBeenCalled()
    })

    it('should support keyboard interaction', async () => {
      const user = userEvent.setup()
      render(<ThemeToggle theme="dark" onToggle={mockOnToggle} />)

      const button = screen.getByRole('button')
      button.focus()

      await user.keyboard('{Enter}')

      expect(mockOnToggle).toHaveBeenCalled()
    })
  })

  describe('States', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<ThemeToggle theme="dark" onToggle={mockOnToggle} disabled />)

      expect(screen.getByRole('button')).toBeDisabled()
    })

    it('should not be disabled by default', () => {
      render(<ThemeToggle theme="dark" onToggle={mockOnToggle} />)

      expect(screen.getByRole('button')).not.toBeDisabled()
    })
  })

  describe('Sizes', () => {
    it('should render medium size by default', () => {
      render(<ThemeToggle theme="dark" onToggle={mockOnToggle} />)

      const button = screen.getByRole('button')
      expect(button).toHaveClass('btn-medium')
    })

    it('should support small size', () => {
      render(<ThemeToggle theme="dark" onToggle={mockOnToggle} size="small" />)

      const button = screen.getByRole('button')
      expect(button).toHaveClass('btn-small')
    })

    it('should support large size', () => {
      render(<ThemeToggle theme="dark" onToggle={mockOnToggle} size="large" />)

      const button = screen.getByRole('button')
      expect(button).toHaveClass('btn-large')
    })
  })

  describe('Variants', () => {
    it('should render ghost variant by default', () => {
      render(<ThemeToggle theme="dark" onToggle={mockOnToggle} />)

      const button = screen.getByRole('button')
      expect(button).toHaveClass('btn-ghost')
    })

    it('should support custom variant', () => {
      render(<ThemeToggle theme="dark" onToggle={mockOnToggle} variant="secondary" />)

      const button = screen.getByRole('button')
      expect(button).toHaveClass('btn-secondary')
    })
  })

  describe('Custom Styling', () => {
    it('should accept custom className', () => {
      render(<ThemeToggle theme="dark" onToggle={mockOnToggle} className="custom-toggle" />)

      const button = screen.getByRole('button')
      expect(button).toHaveClass('custom-toggle')
    })
  })

  describe('Accessibility', () => {
    it('should have accessible name', () => {
      render(<ThemeToggle theme="dark" onToggle={mockOnToggle} />)

      const button = screen.getByRole('button')
      expect(button).toHaveAccessibleName()
    })

    it('should have aria-label describing action', () => {
      render(<ThemeToggle theme="dark" onToggle={mockOnToggle} />)

      const button = screen.getByRole('button')
      const ariaLabel = button.getAttribute('aria-label')
      expect(ariaLabel).toBeTruthy()
      expect(ariaLabel?.toLowerCase()).toContain('theme')
    })

    it('should be keyboard focusable', () => {
      render(<ThemeToggle theme="dark" onToggle={mockOnToggle} />)

      const button = screen.getByRole('button')
      button.focus()
      expect(button).toHaveFocus()
    })

    it('should not be keyboard focusable when disabled', () => {
      render(<ThemeToggle theme="dark" onToggle={mockOnToggle} disabled />)

      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })
  })

  describe('Tooltip', () => {
    it('should show tooltip when showTooltip is true', () => {
      render(<ThemeToggle theme="dark" onToggle={mockOnToggle} showTooltip />)

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('title')
    })

    it('should not show tooltip by default', () => {
      render(<ThemeToggle theme="dark" onToggle={mockOnToggle} />)

      const button = screen.getByRole('button')
      expect(button).not.toHaveAttribute('title')
    })
  })

  describe('Animation', () => {
    it('should have transition classes for smooth animation', () => {
      const { container } = render(<ThemeToggle theme="dark" onToggle={mockOnToggle} />)

      const button = screen.getByRole('button')
      const classes = button.className
      expect(classes).toMatch(/transition/)
    })
  })
})
