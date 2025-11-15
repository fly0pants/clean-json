import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { debounce } from '@/utils/debounce'

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  describe('Basic Functionality', () => {
    it('should delay function execution', () => {
      const fn = vi.fn()
      const debouncedFn = debounce(fn, 100)

      debouncedFn()

      // Should not execute immediately
      expect(fn).not.toHaveBeenCalled()

      // Should execute after delay
      vi.advanceTimersByTime(100)
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should only execute once when called multiple times within delay', () => {
      const fn = vi.fn()
      const debouncedFn = debounce(fn, 100)

      debouncedFn()
      debouncedFn()
      debouncedFn()

      vi.advanceTimersByTime(100)

      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should reset timer on subsequent calls', () => {
      const fn = vi.fn()
      const debouncedFn = debounce(fn, 100)

      debouncedFn()
      vi.advanceTimersByTime(50)

      debouncedFn()
      vi.advanceTimersByTime(50)

      // Should not execute yet (only 50ms since last call)
      expect(fn).not.toHaveBeenCalled()

      vi.advanceTimersByTime(50)

      // Should execute now (100ms since last call)
      expect(fn).toHaveBeenCalledTimes(1)
    })
  })

  describe('Arguments', () => {
    it('should pass arguments to debounced function', () => {
      const fn = vi.fn()
      const debouncedFn = debounce(fn, 100)

      debouncedFn('arg1', 'arg2')

      vi.advanceTimersByTime(100)

      expect(fn).toHaveBeenCalledWith('arg1', 'arg2')
    })

    it('should use latest arguments when called multiple times', () => {
      const fn = vi.fn()
      const debouncedFn = debounce(fn, 100)

      debouncedFn('first')
      debouncedFn('second')
      debouncedFn('third')

      vi.advanceTimersByTime(100)

      expect(fn).toHaveBeenCalledWith('third')
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should handle different argument types', () => {
      const fn = vi.fn()
      const debouncedFn = debounce(fn, 100)

      const obj = { key: 'value' }
      const arr = [1, 2, 3]

      debouncedFn(42, 'string', true, obj, arr)

      vi.advanceTimersByTime(100)

      expect(fn).toHaveBeenCalledWith(42, 'string', true, obj, arr)
    })
  })

  describe('Context (this)', () => {
    it('should preserve context when calling debounced function', () => {
      const mockFn = vi.fn()
      const obj = {
        value: 42,
        fn: function(this: any) {
          mockFn(this.value)
        }
      }

      const debouncedFn = debounce(obj.fn, 100)

      debouncedFn.call(obj)

      vi.advanceTimersByTime(100)

      expect(mockFn).toHaveBeenCalledWith(42)
    })
  })

  describe('Delay Variations', () => {
    it('should handle different delay values', () => {
      const fn = vi.fn()
      const debouncedFn = debounce(fn, 500)

      debouncedFn()

      vi.advanceTimersByTime(400)
      expect(fn).not.toHaveBeenCalled()

      vi.advanceTimersByTime(100)
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should handle very short delays', () => {
      const fn = vi.fn()
      const debouncedFn = debounce(fn, 1)

      debouncedFn()

      vi.advanceTimersByTime(1)

      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should handle zero delay', () => {
      const fn = vi.fn()
      const debouncedFn = debounce(fn, 0)

      debouncedFn()

      vi.advanceTimersByTime(0)

      expect(fn).toHaveBeenCalledTimes(1)
    })
  })

  describe('Multiple Invocations', () => {
    it('should execute multiple times if delay passes between calls', () => {
      const fn = vi.fn()
      const debouncedFn = debounce(fn, 100)

      debouncedFn('first')
      vi.advanceTimersByTime(100)

      debouncedFn('second')
      vi.advanceTimersByTime(100)

      expect(fn).toHaveBeenCalledTimes(2)
      expect(fn).toHaveBeenNthCalledWith(1, 'first')
      expect(fn).toHaveBeenNthCalledWith(2, 'second')
    })

    it('should handle rapid successive calls followed by delay', () => {
      const fn = vi.fn()
      const debouncedFn = debounce(fn, 100)

      // First batch
      debouncedFn('a')
      debouncedFn('b')
      debouncedFn('c')
      vi.advanceTimersByTime(100)

      expect(fn).toHaveBeenCalledTimes(1)
      expect(fn).toHaveBeenCalledWith('c')

      // Second batch
      debouncedFn('d')
      debouncedFn('e')
      vi.advanceTimersByTime(100)

      expect(fn).toHaveBeenCalledTimes(2)
      expect(fn).toHaveBeenCalledWith('e')
    })
  })

  describe('Edge Cases', () => {
    it('should handle no arguments', () => {
      const fn = vi.fn()
      const debouncedFn = debounce(fn, 100)

      debouncedFn()

      vi.advanceTimersByTime(100)

      expect(fn).toHaveBeenCalledWith()
    })

    it('should handle undefined arguments', () => {
      const fn = vi.fn()
      const debouncedFn = debounce(fn, 100)

      debouncedFn(undefined)

      vi.advanceTimersByTime(100)

      expect(fn).toHaveBeenCalledWith(undefined)
    })

    it('should handle null arguments', () => {
      const fn = vi.fn()
      const debouncedFn = debounce(fn, 100)

      debouncedFn(null)

      vi.advanceTimersByTime(100)

      expect(fn).toHaveBeenCalledWith(null)
    })
  })

  describe('Real-world Scenarios', () => {
    it('should work like search input debouncing', () => {
      const searchFn = vi.fn()
      const debouncedSearch = debounce(searchFn, 300)

      // User types "hello" quickly
      debouncedSearch('h')
      vi.advanceTimersByTime(50)
      debouncedSearch('he')
      vi.advanceTimersByTime(50)
      debouncedSearch('hel')
      vi.advanceTimersByTime(50)
      debouncedSearch('hell')
      vi.advanceTimersByTime(50)
      debouncedSearch('hello')

      // Search shouldn't execute yet
      expect(searchFn).not.toHaveBeenCalled()

      // After user stops typing for 300ms
      vi.advanceTimersByTime(300)

      // Search should execute once with final value
      expect(searchFn).toHaveBeenCalledTimes(1)
      expect(searchFn).toHaveBeenCalledWith('hello')
    })

    it('should work like window resize debouncing', () => {
      const resizeHandler = vi.fn()
      const debouncedResize = debounce(resizeHandler, 150)

      // Simulate rapid resize events
      for (let i = 0; i < 10; i++) {
        debouncedResize({ width: 100 + i, height: 200 + i })
        vi.advanceTimersByTime(10)
      }

      // Should not execute during rapid calls
      expect(resizeHandler).not.toHaveBeenCalled()

      // After resize stops
      vi.advanceTimersByTime(150)

      // Should execute once with latest dimensions
      expect(resizeHandler).toHaveBeenCalledTimes(1)
      expect(resizeHandler).toHaveBeenCalledWith({ width: 109, height: 209 })
    })
  })
})
