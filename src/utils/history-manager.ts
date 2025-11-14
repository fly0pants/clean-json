import type { HistoryItem, HistoryList } from '@/types/history.types'

const STORAGE_KEY = 'clean-json-history'
const PRIVACY_MODE_KEY = 'clean-json-privacy-mode'
const MAX_ITEMS = 10
const MAX_SIZE = 1024 * 1024 // 1MB

/**
 * History Manager
 * Manages JSON history with localStorage persistence
 */
export class HistoryManager {
  private items: HistoryList = []
  private privacyMode: boolean = false

  constructor() {
    this.loadPrivacyMode()
    if (!this.privacyMode) {
      this.loadFromStorage()
    }
  }

  /**
   * Add new history item
   */
  addItem(content: string): void {
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
    const item: HistoryItem = {
      id: Date.now().toString(),
      content,
      preview: this.createPreview(content),
      timestamp: Date.now(),
      size,
      isValid,
    }

    // Add to beginning of array (newest first)
    this.items.unshift(item)

    // Keep only MAX_ITEMS
    if (this.items.length > MAX_ITEMS) {
      this.items = this.items.slice(0, MAX_ITEMS)
    }

    // Save to storage (if not in privacy mode)
    if (!this.privacyMode) {
      this.saveToStorage()
    }
  }

  /**
   * Get all items
   */
  getItems(): HistoryList {
    // Return a copy to prevent external modification
    return [...this.items]
  }

  /**
   * Load item by ID
   */
  loadItem(id: string): HistoryItem | undefined {
    return this.items.find((item) => item.id === id)
  }

  /**
   * Delete item by ID
   */
  deleteItem(id: string): void {
    this.items = this.items.filter((item) => item.id !== id)

    // Save to storage
    if (!this.privacyMode) {
      this.saveToStorage()
    }
  }

  /**
   * Clear all history
   */
  clearHistory(): void {
    this.items = []

    // Clear storage
    if (!this.privacyMode) {
      this.saveToStorage()
    }
  }

  /**
   * Search history by keyword
   */
  searchHistory(keyword: string): HistoryList {
    const lowerKeyword = keyword.toLowerCase()

    return this.items.filter((item) =>
      item.content.toLowerCase().includes(lowerKeyword)
    )
  }

  /**
   * Toggle privacy mode
   */
  togglePrivacyMode(): void {
    this.privacyMode = !this.privacyMode

    // Save privacy mode preference
    localStorage.setItem(PRIVACY_MODE_KEY, JSON.stringify(this.privacyMode))

    if (this.privacyMode) {
      // Clear items from memory when enabling privacy mode
      this.items = []
      // Don't touch localStorage - keep existing history
    } else {
      // Clear items added during privacy mode
      this.items = []
      // Load from storage when disabling
      this.loadFromStorage()
    }
  }

  /**
   * Check if privacy mode is enabled
   */
  isPrivacyMode(): boolean {
    return this.privacyMode
  }

  /**
   * Create preview (first 100 characters)
   */
  private createPreview(content: string): string {
    if (content.length <= 100) {
      return content
    }
    return content.substring(0, 100) + '...'
  }

  /**
   * Load from localStorage
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        this.items = JSON.parse(stored)
      }
    } catch (error) {
      // If localStorage is corrupted, start fresh
      console.warn('Failed to load history from storage:', error)
      this.items = []
    }
  }

  /**
   * Save to localStorage
   */
  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items))
    } catch (error) {
      console.error('Failed to save history to storage:', error)
    }
  }

  /**
   * Load privacy mode preference
   */
  private loadPrivacyMode(): void {
    try {
      const stored = localStorage.getItem(PRIVACY_MODE_KEY)
      if (stored) {
        this.privacyMode = JSON.parse(stored)
      }
    } catch {
      this.privacyMode = false
    }
  }
}
