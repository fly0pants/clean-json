import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { HistoryItem, HistoryList } from '@/types/history.types'

const MAX_ITEMS = 10
const MAX_SIZE = 1024 * 1024 // 1MB

/**
 * History state
 */
interface HistoryState {
  items: HistoryList
  privacyMode: boolean
  idCounter: number

  // Actions
  addItem: (content: string) => void
  loadItem: (id: string) => HistoryItem | undefined
  deleteItem: (id: string) => void
  clearHistory: () => void
  togglePrivacyMode: () => void
  searchHistory: (keyword: string) => HistoryList
}

/**
 * Create preview (first 100 characters)
 */
const createPreview = (content: string): string => {
  if (content.length <= 100) {
    return content
  }
  return content.substring(0, 100) + '...'
}

/**
 * History Store
 */
export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      items: [],
      privacyMode: false,
      idCounter: 0,

      addItem: (content: string) => {
        const { privacyMode, idCounter } = get()

        // Don't add in privacy mode
        if (privacyMode) {
          return
        }

        // Validate content
        if (!content || content.trim() === '') {
          throw new Error('Content cannot be empty')
        }

        // Check size limit
        const size = new Blob([content]).size
        if (size > MAX_SIZE) {
          throw new Error('Content too large (exceeds 1MB)')
        }

        // Check if valid JSON
        let isValid = true
        try {
          JSON.parse(content)
        } catch {
          isValid = false
        }

        // Create history item
        const timestamp = Date.now()
        const item: HistoryItem = {
          id: `${timestamp}-${idCounter}`,
          content,
          preview: createPreview(content),
          timestamp,
          size,
          isValid,
        }

        set((state) => ({
          items: [item, ...state.items].slice(0, MAX_ITEMS),
          idCounter: state.idCounter + 1,
        }))
      },

      loadItem: (id: string) => {
        const { items } = get()
        return items.find((item) => item.id === id)
      },

      deleteItem: (id: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }))
      },

      clearHistory: () => {
        set({ items: [] })
      },

      togglePrivacyMode: () => {
        set((state) => ({
          privacyMode: !state.privacyMode,
        }))
      },

      searchHistory: (keyword: string) => {
        const { items } = get()
        const lowerKeyword = keyword.toLowerCase()

        return items.filter((item) => item.content.toLowerCase().includes(lowerKeyword))
      },
    }),
    {
      name: 'clean-json-history',
      // Persist both items and privacy mode
      partialize: (state) => ({
        items: state.items,
        privacyMode: state.privacyMode,
      }),
    }
  )
)
