import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ActionButtons } from '@/components/Toolbar/ActionButtons'

describe('ActionButtons', () => {
  const mockHandlers = {
    onFormat: vi.fn(),
    onCompress: vi.fn(),
    onStringToObject: vi.fn(),
    onObjectToString: vi.fn(),
    onAutoConvert: vi.fn(),
    onClear: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render all action buttons', () => {
      render(<ActionButtons {...mockHandlers} />)

      expect(screen.getByRole('button', { name: /format/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /compress/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /string.*object/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /object.*string/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /auto.*convert/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument()
    })

    it('should render as button group', () => {
      const { container } = render(<ActionButtons {...mockHandlers} />)

      const buttonGroup = container.querySelector('[role="group"]')
      expect(buttonGroup).toBeInTheDocument()
    })

    it('should render buttons with icons', () => {
      render(<ActionButtons {...mockHandlers} />)

      // Check that buttons contain icon elements (svg or span)
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })
  })

  describe('Button Actions', () => {
    it('should call onFormat when Format button is clicked', async () => {
      const user = userEvent.setup()
      render(<ActionButtons {...mockHandlers} />)

      await user.click(screen.getByRole('button', { name: /format/i }))

      expect(mockHandlers.onFormat).toHaveBeenCalledTimes(1)
    })

    it('should call onCompress when Compress button is clicked', async () => {
      const user = userEvent.setup()
      render(<ActionButtons {...mockHandlers} />)

      await user.click(screen.getByRole('button', { name: /compress/i }))

      expect(mockHandlers.onCompress).toHaveBeenCalledTimes(1)
    })

    it('should call onStringToObject when String→Object button is clicked', async () => {
      const user = userEvent.setup()
      render(<ActionButtons {...mockHandlers} />)

      await user.click(screen.getByRole('button', { name: /string.*object/i }))

      expect(mockHandlers.onStringToObject).toHaveBeenCalledTimes(1)
    })

    it('should call onObjectToString when Object→String button is clicked', async () => {
      const user = userEvent.setup()
      render(<ActionButtons {...mockHandlers} />)

      await user.click(screen.getByRole('button', { name: /object.*string/i }))

      expect(mockHandlers.onObjectToString).toHaveBeenCalledTimes(1)
    })

    it('should call onAutoConvert when Auto Convert button is clicked', async () => {
      const user = userEvent.setup()
      render(<ActionButtons {...mockHandlers} />)

      await user.click(screen.getByRole('button', { name: /auto.*convert/i }))

      expect(mockHandlers.onAutoConvert).toHaveBeenCalledTimes(1)
    })

    it('should call onClear when Clear button is clicked', async () => {
      const user = userEvent.setup()
      render(<ActionButtons {...mockHandlers} />)

      await user.click(screen.getByRole('button', { name: /clear/i }))

      expect(mockHandlers.onClear).toHaveBeenCalledTimes(1)
    })
  })

  describe('Loading States', () => {
    it('should disable Format button when loading', () => {
      render(<ActionButtons {...mockHandlers} loading />)

      expect(screen.getByRole('button', { name: /format/i })).toBeDisabled()
    })

    it('should disable all buttons when loading', () => {
      render(<ActionButtons {...mockHandlers} loading />)

      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        expect(button).toBeDisabled()
      })
    })

    it('should not call handlers when buttons are disabled', async () => {
      const user = userEvent.setup()
      render(<ActionButtons {...mockHandlers} loading />)

      await user.click(screen.getByRole('button', { name: /format/i }))

      expect(mockHandlers.onFormat).not.toHaveBeenCalled()
    })
  })

  describe('Disabled State', () => {
    it('should disable all buttons when disabled prop is true', () => {
      render(<ActionButtons {...mockHandlers} disabled />)

      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        expect(button).toBeDisabled()
      })
    })

    it('should allow individual button disable', () => {
      render(
        <ActionButtons
          {...mockHandlers}
          disabledButtons={['format', 'compress']}
        />
      )

      expect(screen.getByRole('button', { name: /format/i })).toBeDisabled()
      expect(screen.getByRole('button', { name: /compress/i })).toBeDisabled()
      expect(screen.getByRole('button', { name: /auto.*convert/i })).not.toBeDisabled()
    })
  })

  describe('Button Variants', () => {
    it('should render primary variant for main actions', () => {
      render(<ActionButtons {...mockHandlers} />)

      const formatButton = screen.getByRole('button', { name: /format/i })
      expect(formatButton).toHaveClass('btn-primary')
    })

    it('should render secondary variant for secondary actions', () => {
      render(<ActionButtons {...mockHandlers} />)

      const clearButton = screen.getByRole('button', { name: /clear/i })
      expect(clearButton).toHaveClass('btn-secondary')
    })
  })

  describe('Button Sizes', () => {
    it('should render medium size buttons by default', () => {
      render(<ActionButtons {...mockHandlers} />)

      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        expect(button).toHaveClass('btn-medium')
      })
    })

    it('should support custom size', () => {
      render(<ActionButtons {...mockHandlers} size="small" />)

      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        expect(button).toHaveClass('btn-small')
      })
    })
  })

  describe('Compact Mode', () => {
    it('should render icon-only buttons in compact mode', () => {
      render(<ActionButtons {...mockHandlers} compact />)

      const formatButton = screen.getByRole('button', { name: /format/i })
      // Button should have aria-label but minimal visible text
      expect(formatButton).toHaveAttribute('aria-label')
    })

    it('should render full text buttons in normal mode', () => {
      render(<ActionButtons {...mockHandlers} />)

      expect(screen.getByText(/格式化/)).toBeInTheDocument()
    })
  })

  describe('Custom Styling', () => {
    it('should accept custom className', () => {
      const { container } = render(
        <ActionButtons {...mockHandlers} className="custom-toolbar" />
      )

      expect(container.querySelector('.custom-toolbar')).toBeInTheDocument()
    })

    it('should maintain base classes with custom className', () => {
      const { container } = render(
        <ActionButtons {...mockHandlers} className="custom-class" />
      )

      const buttonGroup = container.querySelector('[role="group"]')
      expect(buttonGroup).toHaveClass('custom-class')
    })
  })

  describe('Accessibility', () => {
    it('should have accessible button labels', () => {
      render(<ActionButtons {...mockHandlers} />)

      expect(screen.getByRole('button', { name: /format/i })).toHaveAccessibleName()
      expect(screen.getByRole('button', { name: /compress/i })).toHaveAccessibleName()
    })

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup()
      render(<ActionButtons {...mockHandlers} />)

      const firstButton = screen.getByRole('button', { name: /format/i })
      firstButton.focus()

      expect(firstButton).toHaveFocus()

      // Tab to next button
      await user.tab()
      const secondButton = screen.getByRole('button', { name: /compress/i })
      expect(secondButton).toHaveFocus()
    })

    it('should group buttons semantically', () => {
      const { container } = render(<ActionButtons {...mockHandlers} />)

      const group = container.querySelector('[role="group"]')
      expect(group).toBeInTheDocument()
    })
  })

  describe('Tooltips', () => {
    it('should show tooltips on hover if provided', () => {
      render(
        <ActionButtons
          {...mockHandlers}
          showTooltips
        />
      )

      const formatButton = screen.getByRole('button', { name: /format/i })
      expect(formatButton).toHaveAttribute('title')
    })
  })
})
