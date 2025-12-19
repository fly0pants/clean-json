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

    it('should render sun icon when theme is dark (to switch to light)', () => {
      const { container } = render(<ThemeToggle theme="dark" onToggle={mockOnToggle} />)

      // Should show icon to switch TO light mode
      expect(container.querySelector('svg')).toBeInTheDocument()
    })

    it('should render moon icon when theme is light (to switch to dark)', () => {
      const { container } = render(<ThemeToggle theme="light" onToggle={mockOnToggle} />)

      expect(container.querySelector('svg')).toBeInTheDocument()
    })

    it('should have yellow color when dark theme', () => {
      render(<ThemeToggle theme="dark" onToggle={mockOnToggle} />)

      const button = screen.getByRole('button')
      expect(button).toHaveClass('text-neon-yellow')
    })

    it('should have blue color when light theme', () => {
      render(<ThemeToggle theme="light" onToggle={mockOnToggle} />)

      const button = screen.getByRole('button')
      expect(button).toHaveClass('text-neon-blue')
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

  describe('Custom Styling', () => {
    it('should accept custom className', () => {
      render(<ThemeToggle theme="dark" onToggle={mockOnToggle} className="custom-toggle" />)

      const button = screen.getByRole('button')
      expect(button).toHaveClass('custom-toggle')
    })

    it('should have icon-btn class', () => {
      render(<ThemeToggle theme="dark" onToggle={mockOnToggle} />)

      const button = screen.getByRole('button')
      expect(button).toHaveClass('icon-btn')
    })
  })

  describe('Accessibility', () => {
    it('should have accessible name', () => {
      render(<ThemeToggle theme="dark" onToggle={mockOnToggle} />)

      const button = screen.getByRole('button')
      expect(button).toHaveAccessibleName()
    })

    it('should have aria-label describing action in Chinese', () => {
      render(<ThemeToggle theme="dark" onToggle={mockOnToggle} />)

      const button = screen.getByRole('button')
      const ariaLabel = button.getAttribute('aria-label')
      expect(ariaLabel).toBeTruthy()
      expect(ariaLabel).toContain('浅色模式')
    })

    it('should have aria-label for light theme', () => {
      render(<ThemeToggle theme="light" onToggle={mockOnToggle} />)

      const button = screen.getByRole('button')
      const ariaLabel = button.getAttribute('aria-label')
      expect(ariaLabel).toBeTruthy()
      expect(ariaLabel).toContain('深色模式')
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
    it('should have title attribute for tooltip', () => {
      render(<ThemeToggle theme="dark" onToggle={mockOnToggle} />)

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('title')
    })

    it('should show correct tooltip for dark theme', () => {
      render(<ThemeToggle theme="dark" onToggle={mockOnToggle} />)

      const button = screen.getByRole('button')
      expect(button.getAttribute('title')).toBe('浅色模式')
    })

    it('should show correct tooltip for light theme', () => {
      render(<ThemeToggle theme="light" onToggle={mockOnToggle} />)

      const button = screen.getByRole('button')
      expect(button.getAttribute('title')).toBe('深色模式')
    })
  })

  describe('Animation', () => {
    it('should have SVG icons with transition classes', () => {
      const { container } = render(<ThemeToggle theme="dark" onToggle={mockOnToggle} />)

      const svgs = container.querySelectorAll('svg')
      expect(svgs.length).toBe(2) // Sun and Moon icons
      
      // Check that SVGs have transition classes via class attribute
      svgs.forEach(svg => {
        const classAttr = svg.getAttribute('class') || ''
        expect(classAttr).toContain('transition')
      })
    })
  })
})
