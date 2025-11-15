import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { HistoryManager } from '@/utils/history-manager'

describe('HistoryManager', () => {
  let historyManager: HistoryManager

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    historyManager = new HistoryManager()
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('Add Records', () => {
    it('should add a new history item', () => {
      const content = '{"name":"John"}'
      historyManager.addItem(content)

      const items = historyManager.getItems()
      expect(items).toHaveLength(1)
      expect(items[0].content).toBe(content)
    })

    it('should generate unique ID for each item', () => {
      historyManager.addItem('{"a":1}')
      historyManager.addItem('{"b":2}')

      const items = historyManager.getItems()
      expect(items[0].id).not.toBe(items[1].id)
    })

    it('should record timestamp', () => {
      const before = Date.now()
      historyManager.addItem('{"name":"John"}')
      const after = Date.now()

      const item = historyManager.getItems()[0]
      expect(item.timestamp).toBeGreaterThanOrEqual(before)
      expect(item.timestamp).toBeLessThanOrEqual(after)
    })

    it('should generate preview (first 100 chars)', () => {
      const longContent = '{"data":"' + 'x'.repeat(200) + '"}'
      historyManager.addItem(longContent)

      const item = historyManager.getItems()[0]
      expect(item.preview.length).toBeLessThanOrEqual(103) // 100 + '...'
    })

    it('should not add preview suffix if content is short', () => {
      const shortContent = '{"name":"John"}'
      historyManager.addItem(shortContent)

      const item = historyManager.getItems()[0]
      expect(item.preview).toBe(shortContent)
      expect(item.preview).not.toContain('...')
    })

    it('should calculate file size in bytes', () => {
      const content = '{"name":"John"}'
      historyManager.addItem(content)

      const item = historyManager.getItems()[0]
      expect(item.size).toBe(new Blob([content]).size)
    })

    it('should record validation status for valid JSON', () => {
      historyManager.addItem('{"valid":true}')

      const item = historyManager.getItems()[0]
      expect(item.isValid).toBe(true)
    })

    it('should record validation status for invalid JSON', () => {
      historyManager.addItem('{invalid}')

      const item = historyManager.getItems()[0]
      expect(item.isValid).toBe(false)
    })

    it('should add newest items to the beginning', () => {
      historyManager.addItem('{"first":1}')
      historyManager.addItem('{"second":2}')
      historyManager.addItem('{"third":3}')

      const items = historyManager.getItems()
      expect(items[0].content).toBe('{"third":3}')
      expect(items[1].content).toBe('{"second":2}')
      expect(items[2].content).toBe('{"first":1}')
    })
  })

  describe('Capacity Limits', () => {
    it('should keep maximum 10 items', () => {
      for (let i = 0; i < 15; i++) {
        historyManager.addItem(`{"index":${i}}`)
      }

      expect(historyManager.getItems()).toHaveLength(10)
    })

    it('should remove oldest item when exceeding limit (FIFO)', () => {
      for (let i = 0; i < 11; i++) {
        historyManager.addItem(`{"index":${i}}`)
      }

      const items = historyManager.getItems()
      expect(items[0].content).toContain('"index":10') // newest
      expect(items[9].content).toContain('"index":1')  // oldest (index:0 was removed)

      // Verify index:0 was removed
      const hasIndexZero = items.some(item => item.content.includes('"index":0'))
      expect(hasIndexZero).toBe(false)
    })

    it('should reject item larger than 1MB', () => {
      const largeContent = '{"data":"' + 'x'.repeat(1024 * 1024 + 1) + '"}'

      expect(() => historyManager.addItem(largeContent)).toThrow(/too large|exceeds/i)
    })

    it('should accept item exactly 1MB', () => {
      // Create content close to 1MB
      const content = '{"data":"' + 'x'.repeat(1024 * 1024 - 20) + '"}'

      expect(() => historyManager.addItem(content)).not.toThrow()
    })
  })

  describe('localStorage Persistence', () => {
    it('should save to localStorage on add', () => {
      historyManager.addItem('{"name":"John"}')

      const stored = localStorage.getItem('clean-json-history')
      expect(stored).not.toBeNull()

      const parsed = JSON.parse(stored!)
      expect(parsed).toHaveLength(1)
      expect(parsed[0].content).toBe('{"name":"John"}')
    })

    it('should load from localStorage on initialization', () => {
      const items = [
        {
          id: '1',
          content: '{"a":1}',
          preview: '{"a":1}',
          timestamp: Date.now(),
          size: 7,
          isValid: true
        }
      ]
      localStorage.setItem('clean-json-history', JSON.stringify(items))

      const newManager = new HistoryManager()
      expect(newManager.getItems()).toHaveLength(1)
      expect(newManager.getItems()[0].content).toBe('{"a":1}')
    })

    it('should sync with localStorage on every change', () => {
      historyManager.addItem('{"a":1}')
      historyManager.addItem('{"b":2}')

      const stored = JSON.parse(localStorage.getItem('clean-json-history')!)
      expect(stored).toHaveLength(2)
    })

    it('should handle corrupted localStorage data gracefully', () => {
      localStorage.setItem('clean-json-history', 'corrupted data')

      const newManager = new HistoryManager()
      expect(newManager.getItems()).toHaveLength(0)
    })

    it('should handle missing localStorage gracefully', () => {
      // No localStorage data
      const newManager = new HistoryManager()
      expect(newManager.getItems()).toHaveLength(0)
    })
  })

  describe('CRUD Operations', () => {
    it('should load item by ID', () => {
      historyManager.addItem('{"name":"John"}')
      const id = historyManager.getItems()[0].id

      const item = historyManager.loadItem(id)
      expect(item).toBeDefined()
      expect(item?.content).toBe('{"name":"John"}')
    })

    it('should return undefined for non-existent ID', () => {
      const item = historyManager.loadItem('non-existent-id')
      expect(item).toBeUndefined()
    })

    it('should delete item by ID', () => {
      historyManager.addItem('{"a":1}')
      historyManager.addItem('{"b":2}')

      const idToDelete = historyManager.getItems()[0].id
      historyManager.deleteItem(idToDelete)

      expect(historyManager.getItems()).toHaveLength(1)
      expect(historyManager.getItems()[0].content).toBe('{"a":1}')
    })

    it('should sync localStorage after deletion', () => {
      historyManager.addItem('{"a":1}')
      historyManager.addItem('{"b":2}')

      const idToDelete = historyManager.getItems()[0].id
      historyManager.deleteItem(idToDelete)

      const stored = JSON.parse(localStorage.getItem('clean-json-history')!)
      expect(stored).toHaveLength(1)
    })

    it('should clear all history', () => {
      historyManager.addItem('{"a":1}')
      historyManager.addItem('{"b":2}')
      historyManager.addItem('{"c":3}')

      historyManager.clearHistory()

      expect(historyManager.getItems()).toHaveLength(0)
    })

    it('should clear localStorage on clearHistory', () => {
      historyManager.addItem('{"a":1}')
      historyManager.clearHistory()

      const stored = localStorage.getItem('clean-json-history')
      expect(stored).toBe('[]')
    })
  })

  describe('Search Functionality', () => {
    beforeEach(() => {
      historyManager.addItem('{"name":"John","city":"NYC"}')
      historyManager.addItem('{"name":"Jane","city":"LA"}')
      historyManager.addItem('{"product":"Laptop","price":999}')
    })

    it('should search by content keyword', () => {
      const results = historyManager.searchHistory('name')
      expect(results).toHaveLength(2)
    })

    it('should search case-insensitively', () => {
      const results = historyManager.searchHistory('NAME')
      expect(results).toHaveLength(2)
    })

    it('should return empty array when no match', () => {
      const results = historyManager.searchHistory('xyz')
      expect(results).toHaveLength(0)
    })

    it('should search by value', () => {
      const results = historyManager.searchHistory('John')
      expect(results).toHaveLength(1)
      expect(results[0].content).toContain('John')
    })

    it('should search by key', () => {
      const results = historyManager.searchHistory('product')
      expect(results).toHaveLength(1)
      expect(results[0].content).toContain('Laptop')
    })

    it('should return results in chronological order (newest first)', () => {
      const results = historyManager.searchHistory('city')
      expect(results).toHaveLength(2)
      expect(results[0].content).toContain('LA')    // newer
      expect(results[1].content).toContain('NYC')   // older
    })
  })

  describe('Privacy Mode', () => {
    it('should toggle privacy mode on', () => {
      historyManager.togglePrivacyMode()
      expect(historyManager.isPrivacyMode()).toBe(true)
    })

    it('should toggle privacy mode off', () => {
      historyManager.togglePrivacyMode() // on
      historyManager.togglePrivacyMode() // off
      expect(historyManager.isPrivacyMode()).toBe(false)
    })

    it('should not save to localStorage in privacy mode', () => {
      historyManager.togglePrivacyMode() // enable privacy mode
      historyManager.addItem('{"secret":"data"}')

      const stored = localStorage.getItem('clean-json-history')
      // Should either be null or empty array
      expect(stored === null || stored === '[]').toBe(true)
    })

    it('should still keep items in memory during privacy mode', () => {
      historyManager.togglePrivacyMode()
      historyManager.addItem('{"name":"John"}')

      expect(historyManager.getItems()).toHaveLength(1)
    })

    it('should clear memory when privacy mode is disabled', () => {
      historyManager.togglePrivacyMode() // enable
      historyManager.addItem('{"temp":"data"}')
      historyManager.togglePrivacyMode() // disable

      // Items added during privacy mode should be cleared
      expect(historyManager.getItems()).toHaveLength(0)
    })

    it('should resume saving to localStorage after disabling privacy mode', () => {
      historyManager.togglePrivacyMode() // enable
      historyManager.addItem('{"temp":"data"}')
      historyManager.togglePrivacyMode() // disable
      historyManager.addItem('{"name":"John"}')

      const stored = JSON.parse(localStorage.getItem('clean-json-history')!)
      expect(stored).toHaveLength(1)
      expect(stored[0].content).toBe('{"name":"John"}')
    })

    it('should persist privacy mode preference', () => {
      historyManager.togglePrivacyMode()

      const newManager = new HistoryManager()
      expect(newManager.isPrivacyMode()).toBe(true)
    })
  })

  describe('Edge Cases', () => {
    it('should handle duplicate content', () => {
      historyManager.addItem('{"name":"John"}')
      historyManager.addItem('{"name":"John"}')

      const items = historyManager.getItems()
      expect(items).toHaveLength(2)
      expect(items[0].id).not.toBe(items[1].id)
    })

    it('should handle empty string as content', () => {
      expect(() => historyManager.addItem('')).toThrow()
    })

    it('should handle whitespace-only content', () => {
      expect(() => historyManager.addItem('   \n  ')).toThrow()
    })

    it('should handle special characters in content', () => {
      const content = '{"text":"Hello\\nWorld\\t\\"Quote\\""}'
      historyManager.addItem(content)

      const item = historyManager.getItems()[0]
      expect(item.content).toBe(content)
    })

    it('should handle Unicode characters', () => {
      const content = '{"chinese":"你好","emoji":"😀"}'
      historyManager.addItem(content)

      const item = historyManager.getItems()[0]
      expect(item.content).toContain('你好')
      expect(item.content).toContain('😀')
    })
  })

  describe('Get Items', () => {
    it('should return empty array initially', () => {
      expect(historyManager.getItems()).toHaveLength(0)
    })

    it('should return items in chronological order (newest first)', () => {
      vi.useFakeTimers()

      historyManager.addItem('{"first":1}')
      historyManager.addItem('{"second":2}')
      historyManager.addItem('{"third":3}')

      const items = historyManager.getItems()
      expect(items[0].content).toBe('{"third":3}')
      expect(items[1].content).toBe('{"second":2}')
      expect(items[2].content).toBe('{"first":1}')

      vi.useRealTimers()
    })

    it('should return copy of items (not reference)', () => {
      historyManager.addItem('{"name":"John"}')

      const items1 = historyManager.getItems()
      const items2 = historyManager.getItems()

      expect(items1).not.toBe(items2) // Different references
      expect(items1).toEqual(items2)  // Same content
    })
  })
})
