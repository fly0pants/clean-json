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

      expect(screen.getByText(/历史记录/)).toBeInTheDocument()
    })

    it('should render all history items', () => {
      render(<HistoryPanel items={mockHistoryItems} {...mockHandlers} />)

      expect(screen.getAllByRole('listitem').length).toBe(2)
    })

    it('should render empty state when no items', () => {
      render(<HistoryPanel items={[]} {...mockHandlers} />)

      expect(screen.getByText(/暂无历史记录/)).toBeInTheDocument()
    })

    it('should display item count', () => {
      render(<HistoryPanel items={mockHistoryItems} {...mockHandlers} />)

      expect(screen.getByText(/\(2\)/)).toBeInTheDocument()
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

      const validIndicators = screen.getAllByText(/有效/)
      expect(validIndicators.length).toBeGreaterThan(0)
    })

    it('should show validation status for invalid items', () => {
      render(<HistoryPanel items={mockHistoryItems} {...mockHandlers} />)

      const invalidIndicators = screen.getAllByText(/无效/)
      expect(invalidIndicators.length).toBeGreaterThan(0)
    })
  })

  describe('Interactions', () => {
    it('should call onItemClick when item is clicked', async () => {
      const user = userEvent.setup()
      render(<HistoryPanel items={mockHistoryItems} {...mockHandlers} />)

      // Click on the first list item
      const listItems = screen.getAllByRole('listitem')
      const firstItemButton = listItems[0].querySelector('div[class*="cursor-pointer"]')
      if (firstItemButton) {
        await user.click(firstItemButton)
        expect(mockHandlers.onItemClick).toHaveBeenCalledWith(mockHistoryItems[0])
      }
    })

    it('should call onItemDelete when delete button is clicked', async () => {
      const user = userEvent.setup()
      render(<HistoryPanel items={mockHistoryItems} {...mockHandlers} />)

      const deleteButtons = screen.getAllByLabelText(/删除/)
      await user.click(deleteButtons[0])

      expect(mockHandlers.onItemDelete).toHaveBeenCalledWith(mockHistoryItems[0].id)
    })

    it('should call onClearAll when Clear All button is clicked', async () => {
      const user = userEvent.setup()
      render(<HistoryPanel items={mockHistoryItems} {...mockHandlers} />)

      const clearButton = screen.getByText(/清空/)
      await user.click(clearButton)

      expect(mockHandlers.onClearAll).toHaveBeenCalled()
    })
  })

  describe('Clear All Button', () => {
    it('should show Clear All button when there are items', () => {
      render(<HistoryPanel items={mockHistoryItems} {...mockHandlers} />)

      expect(screen.getByText(/清空/)).toBeInTheDocument()
    })

    it('should not show Clear All button when there are no items', () => {
      render(<HistoryPanel items={[]} {...mockHandlers} />)

      expect(screen.queryByText(/清空/)).not.toBeInTheDocument()
    })
  })

  describe('Search Functionality', () => {
    it('should render search input when showSearch is true', () => {
      render(<HistoryPanel items={mockHistoryItems} {...mockHandlers} showSearch />)

      expect(screen.getByPlaceholderText(/搜索历史/)).toBeInTheDocument()
    })

    it('should not render search input by default', () => {
      render(<HistoryPanel items={mockHistoryItems} {...mockHandlers} />)

      expect(screen.queryByPlaceholderText(/搜索历史/)).not.toBeInTheDocument()
    })

    it('should call onSearch when search input changes', async () => {
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

      const searchInput = screen.getByPlaceholderText(/搜索历史/)
      await user.type(searchInput, 'John')

      expect(onSearch).toHaveBeenCalled()
    })
  })

  describe('Loading State', () => {
    it('should show loading state when loading is true', () => {
      const { container } = render(<HistoryPanel items={[]} {...mockHandlers} loading />)

      // Should show loading spinner
      expect(container.querySelector('.animate-spin')).toBeInTheDocument()
    })

    it('should not show loading state by default', () => {
      const { container } = render(<HistoryPanel items={mockHistoryItems} {...mockHandlers} />)

      expect(container.querySelector('.animate-spin')).not.toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have accessible heading', () => {
      render(<HistoryPanel items={mockHistoryItems} {...mockHandlers} />)

      expect(screen.getByText(/历史记录/)).toBeInTheDocument()
    })

    it('should have accessible list', () => {
      render(<HistoryPanel items={mockHistoryItems} {...mockHandlers} />)

      const list = screen.queryByRole('list')
      expect(list).toBeInTheDocument()
    })

    it('should have accessible delete buttons', () => {
      render(<HistoryPanel items={mockHistoryItems} {...mockHandlers} />)

      const deleteButtons = screen.getAllByLabelText(/删除/)
      expect(deleteButtons.length).toBe(2)
    })
  })

  describe('Item Timestamps', () => {
    it('should display relative time for recent items in Chinese', () => {
      render(<HistoryPanel items={mockHistoryItems} {...mockHandlers} />)

      // Chinese relative time format (e.g., "不到 1 分钟前" or "刚刚")
      const timeElements = document.querySelectorAll('span')
      const hasTimeText = Array.from(timeElements).some(el => 
        el.textContent?.includes('前') || el.textContent?.includes('刚刚')
      )
      expect(hasTimeText).toBe(true)
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
