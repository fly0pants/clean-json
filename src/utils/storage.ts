/**
 * Storage Utility
 * Wrapper around localStorage with JSON serialization
 */
export class Storage {
  /**
   * Save data to localStorage
   */
  set<T>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value)
      localStorage.setItem(key, serialized)
    } catch (error) {
      console.error(`Failed to save to localStorage (${key}):`, error)
      throw error
    }
  }

  /**
   * Get data from localStorage
   */
  get<T>(key: string, defaultValue: T | null = null): T | null {
    try {
      const item = localStorage.getItem(key)

      if (item === null) {
        return defaultValue
      }

      return JSON.parse(item) as T
    } catch (error) {
      console.warn(`Failed to parse localStorage item (${key}):`, error)
      // If JSON parse fails, return the raw string or default value
      const item = localStorage.getItem(key)
      return item !== null ? (item as any) : defaultValue
    }
  }

  /**
   * Remove data from localStorage
   */
  remove(key: string): void {
    localStorage.removeItem(key)
  }

  /**
   * Clear all localStorage data
   */
  clear(): void {
    localStorage.clear()
  }

  /**
   * Check if key exists in localStorage
   */
  has(key: string): boolean {
    return localStorage.getItem(key) !== null
  }

  /**
   * Get all keys in localStorage
   */
  keys(): string[] {
    const keys: string[] = []

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key !== null) {
        keys.push(key)
      }
    }

    return keys
  }

  /**
   * Get number of items in localStorage
   */
  size(): number {
    return localStorage.length
  }
}
