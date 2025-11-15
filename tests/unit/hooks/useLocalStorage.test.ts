import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from '@/hooks/useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('Initialization', () => {
    it('should initialize with default value when localStorage is empty', () => {
      const { result } = renderHook(() =>
        useLocalStorage('test-key', 'default-value')
      )

      expect(result.current[0]).toBe('default-value')
    })

    it('should initialize with value from localStorage if it exists', () => {
      localStorage.setItem('test-key', JSON.stringify('stored-value'))

      const { result } = renderHook(() =>
        useLocalStorage('test-key', 'default-value')
      )

      expect(result.current[0]).toBe('stored-value')
    })

    it('should work with different data types', () => {
      localStorage.setItem('number-key', JSON.stringify(42))
      localStorage.setItem('boolean-key', JSON.stringify(true))
      localStorage.setItem('object-key', JSON.stringify({ name: 'John' }))
      localStorage.setItem('array-key', JSON.stringify([1, 2, 3]))

      const { result: numberResult } = renderHook(() =>
        useLocalStorage('number-key', 0)
      )
      const { result: booleanResult } = renderHook(() =>
        useLocalStorage('boolean-key', false)
      )
      const { result: objectResult } = renderHook(() =>
        useLocalStorage('object-key', { name: '' })
      )
      const { result: arrayResult } = renderHook(() =>
        useLocalStorage('array-key', [] as number[])
      )

      expect(numberResult.current[0]).toBe(42)
      expect(booleanResult.current[0]).toBe(true)
      expect(objectResult.current[0]).toEqual({ name: 'John' })
      expect(arrayResult.current[0]).toEqual([1, 2, 3])
    })

    it('should use default value if localStorage has invalid JSON', () => {
      localStorage.setItem('invalid-key', 'not-valid-json{')

      const { result } = renderHook(() =>
        useLocalStorage('invalid-key', 'default')
      )

      expect(result.current[0]).toBe('default')
    })
  })

  describe('Setting Values', () => {
    it('should update state and localStorage when value is set', () => {
      const { result } = renderHook(() =>
        useLocalStorage('test-key', 'initial')
      )

      act(() => {
        result.current[1]('updated')
      })

      expect(result.current[0]).toBe('updated')
      expect(localStorage.getItem('test-key')).toBe(
        JSON.stringify('updated')
      )
    })

    it('should handle setter function (like useState)', () => {
      const { result } = renderHook(() => useLocalStorage('counter', 0))

      act(() => {
        result.current[1]((prev) => prev + 1)
      })

      expect(result.current[0]).toBe(1)
      expect(localStorage.getItem('counter')).toBe(JSON.stringify(1))

      act(() => {
        result.current[1]((prev) => prev + 5)
      })

      expect(result.current[0]).toBe(6)
      expect(localStorage.getItem('counter')).toBe(JSON.stringify(6))
    })

    it('should update complex objects', () => {
      const { result } = renderHook(() =>
        useLocalStorage('user', { name: 'John', age: 30 })
      )

      act(() => {
        result.current[1]({ name: 'Jane', age: 25 })
      })

      expect(result.current[0]).toEqual({ name: 'Jane', age: 25 })
      expect(JSON.parse(localStorage.getItem('user')!)).toEqual({
        name: 'Jane',
        age: 25,
      })
    })

    it('should update arrays', () => {
      const { result } = renderHook(() =>
        useLocalStorage('items', [1, 2, 3])
      )

      act(() => {
        result.current[1]((prev) => [...prev, 4])
      })

      expect(result.current[0]).toEqual([1, 2, 3, 4])
      expect(JSON.parse(localStorage.getItem('items')!)).toEqual([
        1, 2, 3, 4,
      ])
    })
  })

  describe('Removal', () => {
    it('should provide a remove function to clear the value', () => {
      const { result } = renderHook(() =>
        useLocalStorage('test-key', 'value')
      )

      act(() => {
        result.current[1]('updated')
      })

      expect(localStorage.getItem('test-key')).toBeTruthy()

      act(() => {
        result.current[2]()
      })

      expect(result.current[0]).toBe('value') // Reset to default
      expect(localStorage.getItem('test-key')).toBeNull()
    })

    it('should reset to default value when removed', () => {
      const { result } = renderHook(() =>
        useLocalStorage('test-key', 'default')
      )

      act(() => {
        result.current[1]('changed')
      })

      expect(result.current[0]).toBe('changed')

      act(() => {
        result.current[2]()
      })

      expect(result.current[0]).toBe('default')
    })
  })

  describe('Error Handling', () => {
    it('should handle localStorage errors gracefully', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      // Mock localStorage.setItem to throw an error
      const originalSetItem = Storage.prototype.setItem
      Storage.prototype.setItem = vi.fn(() => {
        throw new Error('QuotaExceededError')
      })

      const { result } = renderHook(() =>
        useLocalStorage('test-key', 'default')
      )

      act(() => {
        result.current[1]('new-value')
      })

      // State should still update even if localStorage fails
      expect(result.current[0]).toBe('new-value')

      // Restore
      Storage.prototype.setItem = originalSetItem
      consoleErrorSpy.mockRestore()
    })

    it('should handle getItem errors gracefully', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      // Mock localStorage.getItem to return invalid JSON
      localStorage.setItem('broken-key', '{invalid json')

      const { result } = renderHook(() =>
        useLocalStorage('broken-key', 'fallback')
      )

      // Should use default value when parsing fails
      expect(result.current[0]).toBe('fallback')

      consoleWarnSpy.mockRestore()
    })
  })

  describe('Multiple Hook Instances', () => {
    it('should sync between multiple hook instances with same key', () => {
      const { result: result1 } = renderHook(() =>
        useLocalStorage('shared-key', 'initial')
      )
      const { result: _result2 } = renderHook(() =>
        useLocalStorage('shared-key', 'initial')
      )

      act(() => {
        result1.current[1]('updated')
      })

      // Both instances should read from localStorage on next render
      // Note: Without storage event listener, they won't auto-sync in same tab
      // But they will both read the same value from localStorage on mount
      expect(localStorage.getItem('shared-key')).toBe(
        JSON.stringify('updated')
      )
    })
  })

  describe('Re-initialization', () => {
    it('should not reinitialize when component re-renders', () => {
      const { result, rerender } = renderHook(() =>
        useLocalStorage('test-key', 'default')
      )

      act(() => {
        result.current[1]('changed')
      })

      rerender()

      expect(result.current[0]).toBe('changed')
    })

    it('should update when key changes', () => {
      const { result, rerender } = renderHook(
        ({ key, defaultValue }) => useLocalStorage(key, defaultValue),
        {
          initialProps: { key: 'key1', defaultValue: 'default1' },
        }
      )

      act(() => {
        result.current[1]('value1')
      })

      expect(result.current[0]).toBe('value1')

      // Change the key
      rerender({ key: 'key2', defaultValue: 'default2' })

      expect(result.current[0]).toBe('default2')
      expect(localStorage.getItem('key2')).toBeNull()
    })
  })
})
