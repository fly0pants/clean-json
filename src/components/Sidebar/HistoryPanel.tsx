import React, { useState } from 'react'
import { clsx } from 'clsx'
import { formatDistanceToNow } from 'date-fns'
import { Button } from '../Common/Button'
import { Input } from '../Common/Input'
import type { HistoryItem } from '@/types/history.types'
import { formatBytes } from '@/utils/format-bytes'

export interface HistoryPanelProps {
  items: HistoryItem[]
  onItemClick: (item: HistoryItem) => void
  onItemDelete: (id: string) => void
  onClearAll: () => void
  showSearch?: boolean
  onSearch?: (query: string) => void
  loading?: boolean
  compact?: boolean
  className?: string
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  items,
  onItemClick,
  onItemDelete,
  onClearAll,
  showSearch = false,
  onSearch,
  loading = false,
  compact = false,
  className,
}) => {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    onSearch?.(query)
  }

  const formatTimestamp = (timestamp: number) => {
    try {
      return formatDistanceToNow(timestamp, { addSuffix: true })
    } catch {
      return 'just now'
    }
  }

  const renderEmptyState = () => (
    <div className="empty-state text-center py-8 px-4">
      <p className="text-text-secondary">No history items yet</p>
      <p className="text-sm text-text-secondary mt-2">
        Your JSON history will appear here
      </p>
    </div>
  )

  const renderLoadingState = () => (
    <div className="loading-state text-center py-8">
      <p className="text-text-secondary">Loading...</p>
    </div>
  )

  const renderHistoryItem = (item: HistoryItem) => (
    <li key={item.id} className="history-item border-b border-border last:border-0">
      <div className="flex items-start gap-2 p-3 hover:bg-surface/50 transition-colors">
        <button
          onClick={() => onItemClick(item)}
          className={clsx(
            'flex-1 text-left min-w-0',
            compact && 'p-2'
          )}
        >
          <div className="font-mono text-sm text-text-primary truncate">
            {item.preview}
          </div>
          <div className="flex items-center gap-2 mt-1 text-xs text-text-secondary">
            <span>{formatTimestamp(item.timestamp)}</span>
            <span>•</span>
            <span>{formatBytes(item.size)}</span>
            <span>•</span>
            <span className={item.isValid ? 'text-success' : 'text-error'}>
              {item.isValid ? '✓ Valid' : '✗ Invalid'}
            </span>
          </div>
        </button>
        <Button
          size="small"
          variant="ghost"
          onClick={() => onItemDelete(item.id)}
          aria-label={`Delete history item ${item.id}`}
          className="flex-shrink-0"
        >
          Delete
        </Button>
      </div>
    </li>
  )

  return (
    <div
      className={clsx(
        'history-panel flex flex-col h-full',
        compact && 'history-panel-compact',
        className
      )}
    >
      {/* Header */}
      <div className="history-panel-header p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-text-primary">
            History {items.length > 0 && `(${items.length})`}
          </h2>
          {items.length > 0 && (
            <Button
              size="small"
              variant="ghost"
              onClick={onClearAll}
              aria-label="Clear all history"
            >
              Clear All
            </Button>
          )}
        </div>

        {/* Search */}
        {showSearch && (
          <Input
            type="search"
            placeholder="Search history..."
            value={searchQuery}
            onChange={handleSearchChange}
            size="small"
          />
        )}
      </div>

      {/* Content */}
      <div className="history-panel-content flex-1 overflow-y-auto">
        {loading ? (
          renderLoadingState()
        ) : items.length === 0 ? (
          renderEmptyState()
        ) : (
          <ul role="list" className="divide-y divide-border">
            {items.map(renderHistoryItem)}
          </ul>
        )}
      </div>
    </div>
  )
}
