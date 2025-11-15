import { describe, it, expect, beforeEach } from 'vitest'
import { Storage } from '@/utils/storage'

describe('Storage', () => {
  let storage: Storage

  beforeEach(() => {
    localStorage.clear()
    storage = new Storage()
  })

  describe('Set and Get', () => {
    it('should save data to localStorage', () => {
      const key = 'test-key'
      const value = { name: 'John' }

      storage.set(key, value)

      const stored = localStorage.getItem(key)
      expect(JSON.parse(stored!)).toEqual(value)
    })

    it('should get data from localStorage', () => {
      const key = 'test-key'
      const value = { name: 'John' }

      localStorage.setItem(key, JSON.stringify(value))

      const result = storage.get(key)
      expect(result).toEqual(value)
    })

    it('should handle string values', () => {
      const key = 'test-key'
      const value = 'simple string'

      storage.set(key, value)

      const result = storage.get(key)
      expect(result).toBe(value)
    })

    it('should handle number values', () => {
      const key = 'test-key'
      const value = 42

      storage.set(key, value)

      const result = storage.get(key)
      expect(result).toBe(value)
    })

    it('should handle boolean values', () => {
      const key = 'test-key'
      const value = true

      storage.set(key, value)

      const result = storage.get(key)
      expect(result).toBe(value)
    })

    it('should handle null values', () => {
      const key = 'test-key'
      const value = null

      storage.set(key, value)

      const result = storage.get(key)
      expect(result).toBe(value)
    })

    it('should handle array values', () => {
      const key = 'test-key'
      const value = [1, 2, 3, 4, 5]

      storage.set(key, value)

      const result = storage.get(key)
      expect(result).toEqual(value)
    })

    it('should handle nested objects', () => {
      const key = 'test-key'
      const value = {
        user: {
          name: 'John',
          address: {
            city: 'NYC',
          },
        },
      }

      storage.set(key, value)

      const result = storage.get(key)
      expect(result).toEqual(value)
    })

    it('should return null for non-existent key', () => {
      const result = storage.get('non-existent')

      expect(result).toBeNull()
    })

    it('should overwrite existing value', () => {
      const key = 'test-key'

      storage.set(key, 'old value')
      storage.set(key, 'new value')

      const result = storage.get(key)
      expect(result).toBe('new value')
    })
  })

  describe('Remove', () => {
    it('should remove data from localStorage', () => {
      const key = 'test-key'
      storage.set(key, { name: 'John' })

      storage.remove(key)

      expect(localStorage.getItem(key)).toBeNull()
      expect(storage.get(key)).toBeNull()
    })

    it('should not throw when removing non-existent key', () => {
      expect(() => storage.remove('non-existent')).not.toThrow()
    })
  })

  describe('Clear', () => {
    it('should clear all localStorage data', () => {
      storage.set('key1', 'value1')
      storage.set('key2', 'value2')
      storage.set('key3', 'value3')

      storage.clear()

      expect(storage.get('key1')).toBeNull()
      expect(storage.get('key2')).toBeNull()
      expect(storage.get('key3')).toBeNull()
      expect(localStorage.length).toBe(0)
    })
  })

  describe('Has', () => {
    it('should return true if key exists', () => {
      const key = 'test-key'
      storage.set(key, 'value')

      expect(storage.has(key)).toBe(true)
    })

    it('should return false if key does not exist', () => {
      expect(storage.has('non-existent')).toBe(false)
    })

    it('should return false after key is removed', () => {
      const key = 'test-key'
      storage.set(key, 'value')
      storage.remove(key)

      expect(storage.has(key)).toBe(false)
    })
  })

  describe('Get All Keys', () => {
    it('should return all keys in storage', () => {
      storage.set('key1', 'value1')
      storage.set('key2', 'value2')
      storage.set('key3', 'value3')

      const keys = storage.keys()

      expect(keys).toHaveLength(3)
      expect(keys).toContain('key1')
      expect(keys).toContain('key2')
      expect(keys).toContain('key3')
    })

    it('should return empty array when storage is empty', () => {
      const keys = storage.keys()

      expect(keys).toHaveLength(0)
    })
  })

  describe('Get Size', () => {
    it('should return number of items in storage', () => {
      storage.set('key1', 'value1')
      storage.set('key2', 'value2')

      expect(storage.size()).toBe(2)
    })

    it('should return 0 when storage is empty', () => {
      expect(storage.size()).toBe(0)
    })

    it('should update size after remove', () => {
      storage.set('key1', 'value1')
      storage.set('key2', 'value2')

      storage.remove('key1')

      expect(storage.size()).toBe(1)
    })
  })

  describe('Error Handling', () => {
    it('should handle corrupted data gracefully', () => {
      const key = 'test-key'
      localStorage.setItem(key, 'invalid json')

      const result = storage.get(key)

      // Should return null or the raw string
      expect(result).toBeTruthy()
    })

    it('should handle storage quota exceeded', () => {
      // Mock localStorage.setItem to throw quota exceeded error
      const originalSetItem = localStorage.setItem
      localStorage.setItem = () => {
        throw new Error('QuotaExceededError')
      }

      expect(() => storage.set('key', 'value')).toThrow()

      // Restore
      localStorage.setItem = originalSetItem
    })
  })

  describe('Get with Default Value', () => {
    it('should return default value if key does not exist', () => {
      const defaultValue = { name: 'Default' }

      const result = storage.get('non-existent', defaultValue)

      expect(result).toEqual(defaultValue)
    })

    it('should return stored value if key exists', () => {
      const key = 'test-key'
      const value = { name: 'John' }
      const defaultValue = { name: 'Default' }

      storage.set(key, value)

      const result = storage.get(key, defaultValue)

      expect(result).toEqual(value)
    })
  })
})
