import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HistoryPanel } from '@/components/Sidebar/HistoryPanel'
import type { HistoryItem } from '@/types/history.types'

describe('HistoryPanel', () => {
  const mockHistoryItems: HistoryItem[] = [
    {
      id: '1',
      content: '{"name":"John","age":30}',
      preview: '{"name":"John","age":30}',
      timestamp: Date.now() - 1000,
      size: 25,
      isValid: true,
    },
    {
      id: '2',
      content: '{"invalid json',
      preview: '{"invalid json',
      timestamp: Date.now() - 2000,
      size: 15,
      isValid: false,
    },
  ]

  const mockHandlers = {
    onItemClick: vi.fn(),
    onItemDelete: vi.fn(),
    onClearAll: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render history panel', () => {
      render(<HistoryPanel items={mockHistoryItems} {...mockHandlers} />)

      expect(screen.getByText(/history/i)).toBeInTheDocument()
    })

    it('should render all history items', () => {
      render(<HistoryPanel items={mockHistoryItems} {...mockHandlers} />)

      expect(screen.getAllByRole('button').length).toBeGreaterThan(0)
    })

    it('should render empty state when no items', () => {
      render(<HistoryPanel items={[]} {...mockHandlers} />)

      expect(screen.getByText(/no history/i)).toBeInTheDocument()
    })

    it('should display item count', () => {
      render(<HistoryPanel items={mockHistoryItems} {...mockHandlers} />)

      const heading = screen.getByRole('heading', { name: /history/i })
      expect(heading.textContent).toContain('(2)')
    })
  })

  describe('Item Display', () => {
    it('should display item preview', () => {
      render(<HistoryPanel items={mockHistoryItems} {...mockHandlers} />)

      expect(screen.getByText(/John/)).toBeInTheDocument()
    })

    it('should display item size', () => {
      render(<HistoryPanel items={mockHistoryItems} {...mockHandlers} />)

      expect(screen.getByText(/25 Bytes/i)).toBeInTheDocument()
    })

    it('should show validation status for valid items', () => {
      render(<HistoryPanel items={mockHistoryItems} {...mockHandlers} />)

      const validIndicators = screen.getAllByText(/✓.*valid/i)
      expect(validIndicators.length).toBeGreaterThan(0)
    })

    it('should show validation status for invalid items', () => {
      render(<HistoryPanel items={mockHistoryItems} {...mockHandlers} />)

      const invalidIndicators = screen.getAllByText(/✗.*invalid/i)
      expect(invalidIndicators.length).toBeGreaterThan(0)
    })
  })

  describe('Interactions', () => {
    it('should call onItemClick when item is clicked', async () => {
      const user = userEvent.setup()
      render(<HistoryPanel items={mockHistoryItems} {...mockHandlers} />)

      const buttons = screen.getAllByRole('button')
      // Find item button (not Clear All or Delete buttons)
      const itemButtons = buttons.filter(btn =>
        !btn.getAttribute('aria-label')?.includes('Delete') &&
        !btn.textContent?.includes('Clear All')
      )
      await user.click(itemButtons[0])

      expect(mockHandlers.onItemClick).toHaveBeenCalledWith(mockHistoryItems[0])
    })

    it('should call onItemDelete when delete button is clicked', async () => {
      const user = userEvent.setup()
      render(<HistoryPanel items={mockHistoryItems} {...mockHandlers} />)

      const deleteButtons = screen.getAllByRole('button', { name: /delete history item/i })
      await user.click(deleteButtons[0])

      expect(mockHandlers.onItemDelete).toHaveBeenCalledWith('1')
    })

    it('should call onClearAll when clear all button is clicked', async () => {
      const user = userEvent.setup()
      render(<HistoryPanel items={mockHistoryItems} {...mockHandlers} />)

      const clearButton = screen.getByRole('button', { name: /clear all/i })
      await user.click(clearButton)

      expect(mockHandlers.onClearAll).toHaveBeenCalled()
    })
  })

  describe('Search Functionality', () => {
    it('should render search input when showSearch is true', () => {
      render(<HistoryPanel items={mockHistoryItems} {...mockHandlers} showSearch />)

      expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument()
    })

    it('should not render search input by default', () => {
      render(<HistoryPanel items={mockHistoryItems} {...mockHandlers} />)

      expect(screen.queryByPlaceholderText(/search/i)).not.toBeInTheDocument()
    })

    it('should filter items based on search query', async () => {
      const user = userEvent.setup()
      const onSearch = vi.fn()
      render(
        <HistoryPanel
          items={mockHistoryItems}
          {...mockHandlers}
          showSearch
          onSearch={onSearch}
        />
      )

      const searchInput = screen.getByPlaceholderText(/search/i)
      await user.type(searchInput, 'test')

      expect(onSearch).toHaveBeenCalled()
      expect(onSearch).toHaveBeenLastCalledWith('test')
    })
  })

  describe('Empty State', () => {
    it('should show empty state message', () => {
      render(<HistoryPanel items={[]} {...mockHandlers} />)

      expect(screen.getByText(/no history/i)).toBeInTheDocument()
    })

    it('should not show clear all button when empty', () => {
      render(<HistoryPanel items={[]} {...mockHandlers} />)

      expect(screen.queryByRole('button', { name: /clear all/i })).not.toBeInTheDocument()
    })
  })

  describe('Loading State', () => {
    it('should show loading indicator when loading', () => {
      render(<HistoryPanel items={[]} {...mockHandlers} loading />)

      expect(screen.getByText(/loading/i)).toBeInTheDocument()
    })

    it('should not show items when loading', () => {
      render(<HistoryPanel items={mockHistoryItems} {...mockHandlers} loading />)

      expect(screen.queryByText(/John/)).not.toBeInTheDocument()
    })
  })

  describe('Custom Styling', () => {
    it('should accept custom className', () => {
      const { container } = render(
        <HistoryPanel items={mockHistoryItems} {...mockHandlers} className="custom-panel" />
      )

      expect(container.querySelector('.custom-panel')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have accessible heading', () => {
      render(<HistoryPanel items={mockHistoryItems} {...mockHandlers} />)

      expect(screen.getByRole('heading', { name: /history/i })).toBeInTheDocument()
    })

    it('should have accessible list', () => {
      render(<HistoryPanel items={mockHistoryItems} {...mockHandlers} />)

      const list = screen.queryByRole('list')
      expect(list).toBeInTheDocument()
    })

    it('should have accessible buttons', () => {
      render(<HistoryPanel items={mockHistoryItems} {...mockHandlers} />)

      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        expect(button).toHaveAccessibleName()
      })
    })
  })

  describe('Item Timestamps', () => {
    it('should display relative time for recent items', () => {
      render(<HistoryPanel items={mockHistoryItems} {...mockHandlers} />)

      const timestamps = screen.getAllByText(/ago|just now/i)
      expect(timestamps.length).toBeGreaterThan(0)
    })
  })

  describe('Compact Mode', () => {
    it('should render compact layout when compact is true', () => {
      const { container } = render(
        <HistoryPanel items={mockHistoryItems} {...mockHandlers} compact />
      )

      expect(container.querySelector('.history-panel-compact')).toBeInTheDocument()
    })

    it('should render normal layout by default', () => {
      const { container } = render(<HistoryPanel items={mockHistoryItems} {...mockHandlers} />)

      expect(container.querySelector('.history-panel-compact')).not.toBeInTheDocument()
    })
  })
})
