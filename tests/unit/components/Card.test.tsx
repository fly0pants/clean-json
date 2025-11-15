import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Card } from '@/components/Common/Card'

describe('Card', () => {
  describe('Rendering', () => {
    it('should render children content', () => {
      render(
        <Card>
          <h2>Card Title</h2>
          <p>Card content</p>
        </Card>
      )

      expect(screen.getByText('Card Title')).toBeInTheDocument()
      expect(screen.getByText('Card content')).toBeInTheDocument()
    })

    it('should render as div by default', () => {
      const { container } = render(<Card>Content</Card>)

      expect(container.firstChild?.nodeName).toBe('DIV')
    })

    it('should apply base card styles', () => {
      const { container } = render(<Card>Content</Card>)

      const card = container.firstChild as HTMLElement
      expect(card).toHaveClass('card')
      expect(card).toHaveClass('card-default') // Default variant includes bg-surface
      expect(card).toHaveClass('rounded-lg')
    })
  })

  describe('Variants', () => {
    it('should render default variant', () => {
      const { container } = render(<Card>Content</Card>)

      const card = container.firstChild as HTMLElement
      expect(card).toHaveClass('card-default')
    })

    it('should render elevated variant', () => {
      const { container } = render(<Card variant="elevated">Content</Card>)

      const card = container.firstChild as HTMLElement
      expect(card).toHaveClass('card-elevated')
    })

    it('should render outlined variant', () => {
      const { container } = render(<Card variant="outlined">Content</Card>)

      const card = container.firstChild as HTMLElement
      expect(card).toHaveClass('card-outlined')
    })
  })

  describe('Padding', () => {
    it('should apply default padding', () => {
      const { container } = render(<Card>Content</Card>)

      const card = container.firstChild as HTMLElement
      expect(card).toHaveClass('p-6')
    })

    it('should apply small padding', () => {
      const { container } = render(<Card padding="small">Content</Card>)

      const card = container.firstChild as HTMLElement
      expect(card).toHaveClass('p-4')
    })

    it('should apply medium padding', () => {
      const { container } = render(<Card padding="medium">Content</Card>)

      const card = container.firstChild as HTMLElement
      expect(card).toHaveClass('p-6')
    })

    it('should apply large padding', () => {
      const { container } = render(<Card padding="large">Content</Card>)

      const card = container.firstChild as HTMLElement
      expect(card).toHaveClass('p-8')
    })

    it('should support no padding', () => {
      const { container } = render(<Card padding="none">Content</Card>)

      const card = container.firstChild as HTMLElement
      expect(card).toHaveClass('p-0')
    })
  })

  describe('Interactive', () => {
    it('should be interactive when onClick is provided', () => {
      const handleClick = vi.fn()
      const { container } = render(<Card onClick={handleClick}>Content</Card>)

      const card = container.firstChild as HTMLElement
      expect(card).toHaveClass('card-interactive')
      expect(card).toHaveClass('cursor-pointer')
    })

    it('should call onClick when clicked', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()

      const { container } = render(<Card onClick={handleClick}>Content</Card>)

      await user.click(container.firstChild as HTMLElement)

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should not be interactive without onClick', () => {
      const { container } = render(<Card>Content</Card>)

      const card = container.firstChild as HTMLElement
      expect(card).not.toHaveClass('card-interactive')
      expect(card).not.toHaveClass('cursor-pointer')
    })

    it('should support hover state styles when interactive', () => {
      const { container } = render(<Card onClick={() => {}}>Content</Card>)

      const card = container.firstChild as HTMLElement
      expect(card).toHaveClass('hover:-translate-y-1')
      expect(card).toHaveClass('hover:shadow-lg')
    })
  })

  describe('Header and Footer', () => {
    it('should render with header', () => {
      render(
        <Card header={<h3>Card Header</h3>}>
          <p>Card body</p>
        </Card>
      )

      expect(screen.getByText('Card Header')).toBeInTheDocument()
      expect(screen.getByText('Card body')).toBeInTheDocument()
    })

    it('should render with footer', () => {
      render(
        <Card footer={<button>Action</button>}>
          <p>Card body</p>
        </Card>
      )

      expect(screen.getByText('Card body')).toBeInTheDocument()
      expect(screen.getByText('Action')).toBeInTheDocument()
    })

    it('should render with both header and footer', () => {
      render(
        <Card
          header={<h3>Header</h3>}
          footer={<button>Footer</button>}
        >
          <p>Body</p>
        </Card>
      )

      expect(screen.getByText('Header')).toBeInTheDocument()
      expect(screen.getByText('Body')).toBeInTheDocument()
      expect(screen.getByText('Footer')).toBeInTheDocument()
    })

    it('should apply header styles', () => {
      const { container: _container } = render(
        <Card header={<div data-testid="header">Header</div>}>
          Content
        </Card>
      )

      const header = screen.getByTestId('header').parentElement
      expect(header).toHaveClass('card-header')
    })

    it('should apply footer styles', () => {
      const { container: _container } = render(
        <Card footer={<div data-testid="footer">Footer</div>}>
          Content
        </Card>
      )

      const footer = screen.getByTestId('footer').parentElement
      expect(footer).toHaveClass('card-footer')
    })
  })

  describe('Custom Props', () => {
    it('should accept custom className', () => {
      const { container } = render(<Card className="custom-class">Content</Card>)

      const card = container.firstChild as HTMLElement
      expect(card).toHaveClass('custom-class')
      expect(card).toHaveClass('card') // Should still have base class
    })

    it('should forward additional HTML attributes', () => {
      const { container: _container } = render(
        <Card data-testid="test-card" id="card-1">
          Content
        </Card>
      )

      expect(screen.getByTestId('test-card')).toBeInTheDocument()
      expect(screen.getByTestId('test-card')).toHaveAttribute('id', 'card-1')
    })

    it('should accept role attribute', () => {
      const { container } = render(
        <Card role="article">Content</Card>
      )

      const card = container.firstChild as HTMLElement
      expect(card).toHaveAttribute('role', 'article')
    })
  })

  describe('Hoverable', () => {
    it('should be hoverable by default when not interactive', () => {
      const { container } = render(<Card>Content</Card>)

      const card = container.firstChild as HTMLElement
      expect(card).toHaveClass('transition-all')
    })

    it('should disable hover effects when hoverable is false', () => {
      const { container } = render(<Card hoverable={false}>Content</Card>)

      const card = container.firstChild as HTMLElement
      expect(card).not.toHaveClass('hover:shadow-md')
    })
  })

  describe('Full Width', () => {
    it('should support full width layout', () => {
      const { container } = render(<Card fullWidth>Content</Card>)

      const card = container.firstChild as HTMLElement
      expect(card).toHaveClass('w-full')
    })

    it('should not be full width by default', () => {
      const { container } = render(<Card>Content</Card>)

      const card = container.firstChild as HTMLElement
      expect(card).not.toHaveClass('w-full')
    })
  })

  describe('As Prop', () => {
    it('should render as specified element', () => {
      const { container } = render(<Card as="article">Content</Card>)

      expect(container.firstChild?.nodeName).toBe('ARTICLE')
    })

    it('should render as section', () => {
      const { container } = render(<Card as="section">Content</Card>)

      expect(container.firstChild?.nodeName).toBe('SECTION')
    })

    it('should support button element', () => {
      const { container } = render(
        <Card as="button">
          Content
        </Card>
      )

      expect(container.firstChild?.nodeName).toBe('BUTTON')
    })
  })

  describe('Accessibility', () => {
    it('should be keyboard accessible when interactive', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()

      const { container } = render(<Card onClick={handleClick}>Content</Card>)

      const card = container.firstChild as HTMLElement
      card.focus()
      await user.keyboard('{Enter}')

      expect(handleClick).toHaveBeenCalled()
    })

    it('should have appropriate tabIndex when interactive', () => {
      const { container } = render(<Card onClick={() => {}}>Content</Card>)

      const card = container.firstChild as HTMLElement
      expect(card).toHaveAttribute('tabIndex', '0')
    })

    it('should support custom aria-label', () => {
      const { container } = render(
        <Card aria-label="User profile card">Content</Card>
      )

      const card = container.firstChild as HTMLElement
      expect(card).toHaveAttribute('aria-label', 'User profile card')
    })
  })
})
