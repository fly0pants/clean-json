import { describe, it, expect, beforeEach } from 'vitest'
import { useHistoryStore } from '@/store/history-store'

describe('HistoryStore', () => {
  beforeEach(() => {
    localStorage.clear()
    // Reset store
    const store = useHistoryStore.getState()
    store.clearHistory()
    // Reset privacy mode
    if (store.privacyMode) {
      store.togglePrivacyMode()
    }
  })

  describe('Initial State', () => {
    it('should have empty items initially', () => {
      const state = useHistoryStore.getState()

      expect(state.items).toEqual([])
      expect(state.privacyMode).toBe(false)
    })
  })

  describe('Add Item', () => {
    it('should add new item', () => {
      const { addItem } = useHistoryStore.getState()

      addItem('{"name":"John"}')

      expect(useHistoryStore.getState().items).toHaveLength(1)
      expect(useHistoryStore.getState().items[0].content).toBe('{"name":"John"}')
    })

    it('should add newest items first', () => {
      const { addItem } = useHistoryStore.getState()

      addItem('{"first":1}')
      addItem('{"second":2}')

      const items = useHistoryStore.getState().items

      expect(items[0].content).toBe('{"second":2}')
      expect(items[1].content).toBe('{"first":1}')
    })

    it('should limit to 10 items', () => {
      const { addItem } = useHistoryStore.getState()

      // Add 15 items
      for (let i = 1; i <= 15; i++) {
        addItem(`{"item":${i}}`)
      }

      const items = useHistoryStore.getState().items

      expect(items).toHaveLength(10)
      // Newest should be kept
      expect(items[0].content).toBe('{"item":15}')
      expect(items[9].content).toBe('{"item":6}')
    })

    it('should not add item in privacy mode', () => {
      const { togglePrivacyMode, addItem } = useHistoryStore.getState()

      togglePrivacyMode() // Enable privacy mode
      addItem('{"secret":"data"}')

      expect(useHistoryStore.getState().items).toHaveLength(0)
    })
  })

  describe('Load Item', () => {
    it('should load item by ID', () => {
      const { addItem, loadItem } = useHistoryStore.getState()

      addItem('{"name":"John"}')

      const items = useHistoryStore.getState().items
      const id = items[0].id

      const loaded = loadItem(id)

      expect(loaded).toBeDefined()
      expect(loaded?.content).toBe('{"name":"John"}')
    })

    it('should return undefined for non-existent ID', () => {
      const { loadItem } = useHistoryStore.getState()

      const loaded = loadItem('non-existent')

      expect(loaded).toBeUndefined()
    })
  })

  describe('Delete Item', () => {
    it('should delete item by ID', () => {
      const { addItem, deleteItem } = useHistoryStore.getState()

      addItem('{"a":1}')
      addItem('{"b":2}')

      const items = useHistoryStore.getState().items
      const idToDelete = items[1].id

      deleteItem(idToDelete)

      expect(useHistoryStore.getState().items).toHaveLength(1)
      expect(useHistoryStore.getState().items[0].content).toBe('{"b":2}')
    })

    it('should do nothing when deleting non-existent ID', () => {
      const { addItem, deleteItem } = useHistoryStore.getState()

      addItem('{"a":1}')

      deleteItem('non-existent')

      expect(useHistoryStore.getState().items).toHaveLength(1)
    })
  })

  describe('Clear History', () => {
    it('should clear all history', () => {
      const { addItem, clearHistory } = useHistoryStore.getState()

      addItem('{"a":1}')
      addItem('{"b":2}')
      addItem('{"c":3}')

      clearHistory()

      expect(useHistoryStore.getState().items).toHaveLength(0)
    })
  })

  describe('Search History', () => {
    it('should search by keyword', () => {
      const { addItem, searchHistory } = useHistoryStore.getState()

      addItem('{"name":"John"}')
      addItem('{"name":"Jane"}')
      addItem('{"city":"NYC"}')

      const results = searchHistory('John')

      expect(results).toHaveLength(1)
      expect(results[0].content).toBe('{"name":"John"}')
    })

    it('should be case insensitive', () => {
      const { addItem, searchHistory } = useHistoryStore.getState()

      addItem('{"name":"John"}')

      const results = searchHistory('john')

      expect(results).toHaveLength(1)
    })

    it('should return empty array when no match', () => {
      const { addItem, searchHistory } = useHistoryStore.getState()

      addItem('{"name":"John"}')

      const results = searchHistory('nonexistent')

      expect(results).toHaveLength(0)
    })

    it('should search in values', () => {
      const { addItem, searchHistory } = useHistoryStore.getState()

      addItem('{"city":"New York"}')

      const results = searchHistory('York')

      expect(results).toHaveLength(1)
    })
  })

  describe('Privacy Mode', () => {
    it('should toggle privacy mode on', () => {
      const { togglePrivacyMode } = useHistoryStore.getState()

      expect(useHistoryStore.getState().privacyMode).toBe(false)

      togglePrivacyMode()

      expect(useHistoryStore.getState().privacyMode).toBe(true)
    })

    it('should toggle privacy mode off', () => {
      const { togglePrivacyMode } = useHistoryStore.getState()

      togglePrivacyMode() // On
      togglePrivacyMode() // Off

      expect(useHistoryStore.getState().privacyMode).toBe(false)
    })

    it('should not persist items in privacy mode', () => {
      const { togglePrivacyMode, addItem } = useHistoryStore.getState()

      togglePrivacyMode()
      addItem('{"secret":"data"}')

      const stored = localStorage.getItem('clean-json-history')

      // Items should not be added in privacy mode
      if (stored) {
        const parsed = JSON.parse(stored)
        expect(parsed.state.items).toEqual([])
      }
    })

    it('should persist privacy mode preference', () => {
      const { togglePrivacyMode } = useHistoryStore.getState()

      togglePrivacyMode()

      const stored = JSON.parse(localStorage.getItem('clean-json-history')!)

      expect(stored.state.privacyMode).toBe(true)
    })
  })

  describe('Persistence', () => {
    it('should persist items to localStorage', () => {
      const { addItem } = useHistoryStore.getState()

      addItem('{"name":"John"}')

      const stored = JSON.parse(localStorage.getItem('clean-json-history')!)

      expect(stored.state.items).toHaveLength(1)
      expect(stored.state.items[0].content).toBe('{"name":"John"}')
    })

    it('should persist after delete', () => {
      const { addItem, deleteItem } = useHistoryStore.getState()

      addItem('{"a":1}')
      addItem('{"b":2}')

      const items = useHistoryStore.getState().items
      deleteItem(items[1].id)

      const stored = JSON.parse(localStorage.getItem('clean-json-history')!)

      expect(stored.state.items).toHaveLength(1)
    })

    it('should persist after clear', () => {
      const { addItem, clearHistory } = useHistoryStore.getState()

      addItem('{"a":1}')
      clearHistory()

      const stored = JSON.parse(localStorage.getItem('clean-json-history')!)

      expect(stored.state.items).toHaveLength(0)
    })
  })
})
