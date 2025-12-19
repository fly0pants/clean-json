import React, { useState } from 'react'
import { clsx } from 'clsx'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
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
      return formatDistanceToNow(timestamp, { addSuffix: true, locale: zhCN })
    } catch {
      return '刚刚'
    }
  }

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-12 h-12 rounded-full bg-primary-elevated flex items-center justify-center mb-3">
        <svg className="w-6 h-6 text-text-disabled" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      </div>
      <p className="text-sm text-text-secondary">暂无历史记录</p>
      <p className="text-xs text-text-disabled mt-1">
        处理过的 JSON 将显示在这里
      </p>
    </div>
  )

  const renderLoadingState = () => (
    <div className="flex items-center justify-center py-12">
      <svg className="animate-spin h-6 w-6 text-neon-blue" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>
  )

  const renderHistoryItem = (item: HistoryItem) => (
    <li key={item.id} className="group">
      <div className="flex items-start gap-2 px-3 py-2.5 hover:bg-primary-elevated/50 transition-colors cursor-pointer"
           onClick={() => onItemClick(item)}>
        <div className="flex-1 min-w-0">
          <div className="font-mono text-xs text-text-primary truncate leading-relaxed bg-primary-bg/50 px-2 py-1 rounded">
            {item.preview}
          </div>
          <div className="flex items-center gap-2 mt-1.5 text-[10px] text-text-secondary">
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {formatTimestamp(item.timestamp)}
            </span>
            <span className="text-text-disabled">•</span>
            <span>{formatBytes(item.size)}</span>
            <span className="text-text-disabled">•</span>
            <span className={clsx(
              'flex items-center gap-0.5',
              item.isValid ? 'text-neon-green' : 'text-neon-red'
            )}>
              {item.isValid ? (
                <>
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  有效
                </>
              ) : (
                <>
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  无效
                </>
              )}
            </span>
          </div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onItemDelete(item.id) }}
          className="icon-btn opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 w-7 h-7 text-text-disabled hover:text-neon-red"
          aria-label="删除"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </li>
  )

  return (
    <div
      className={clsx(
        'flex flex-col h-full',
        compact && 'history-panel-compact',
        className
      )}
    >
      {/* Header */}
      <div className="panel-header">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-neon-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <h2 className="text-sm font-medium text-text-primary">
            历史记录
            {items.length > 0 && (
              <span className="ml-1.5 text-xs text-text-secondary">({items.length})</span>
            )}
          </h2>
        </div>
        {items.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs text-text-secondary hover:text-neon-red transition-colors"
            aria-label="清空历史记录"
          >
            清空
          </button>
        )}
      </div>

      {/* Search */}
      {showSearch && (
        <div className="px-3 py-2 border-b border-border-default">
          <Input
            type="search"
            placeholder="搜索历史..."
            value={searchQuery}
            onChange={handleSearchChange}
            size="small"
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          renderLoadingState()
        ) : items.length === 0 ? (
          renderEmptyState()
        ) : (
          <ul role="list" className="divide-y divide-border-default">
            {items.map(renderHistoryItem)}
          </ul>
        )}
      </div>
    </div>
  )
}
