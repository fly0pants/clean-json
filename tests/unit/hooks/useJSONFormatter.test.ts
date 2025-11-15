import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useJSONFormatter } from '@/hooks/useJSONFormatter'
import { useEditorStore } from '@/store/editor-store'

describe('useJSONFormatter', () => {
  beforeEach(() => {
    localStorage.clear()
    // Reset editor store to initial state
    const store = useEditorStore.getState()
    store.reset()
    store.setInput('')
    store.setOutput('')
    store.setIndentSize(2)
    store.setIndentType('space')
    if (store.sortKeys) {
      store.toggleSortKeys()
    }
    store.setValidation(true)
  })

  describe('Basic Formatting', () => {
    it('should format JSON with default settings', () => {
      const { result } = renderHook(() => useJSONFormatter())

      act(() => {
        result.current.setInput('{"name":"John"}')
        result.current.format()
      })

      const store = useEditorStore.getState()
      expect(store.output).toContain('"name": "John"')
      expect(store.isValid).toBe(true)
    })

    it('should format with custom indent', () => {
      const { result } = renderHook(() => useJSONFormatter())

      act(() => {
        result.current.setIndentSize(4)
        result.current.setInput('{"name":"John"}')
        result.current.format()
      })

      const store = useEditorStore.getState()
      expect(store.output).toContain('    "name":')
    })

    it('should sort keys when enabled', () => {
      const { result } = renderHook(() => useJSONFormatter())

      act(() => {
        result.current.toggleSortKeys()
        result.current.setInput('{"z":1,"a":2}')
        result.current.format()
      })

      const store = useEditorStore.getState()
      const aIndex = store.output.indexOf('"a"')
      const zIndex = store.output.indexOf('"z"')
      expect(aIndex).toBeLessThan(zIndex)
    })
  })

  describe('Validation', () => {
    it('should validate before formatting', () => {
      const { result } = renderHook(() => useJSONFormatter())

      act(() => {
        result.current.setInput('{invalid}')
        result.current.format()
      })

      const store = useEditorStore.getState()
      expect(store.isValid).toBe(false)
      expect(store.error).toBeDefined()
    })

    it('should set valid state for correct JSON', () => {
      const { result } = renderHook(() => useJSONFormatter())

      act(() => {
        result.current.setInput('{"valid":true}')
        result.current.format()
      })

      const store = useEditorStore.getState()
      expect(store.isValid).toBe(true)
      expect(store.error).toBeNull()
    })
  })

  describe('Compression', () => {
    it('should compress JSON', () => {
      const { result } = renderHook(() => useJSONFormatter())

      act(() => {
        result.current.setInput('{\n  "name": "John"\n}')
        result.current.compress()
      })

      const store = useEditorStore.getState()
      expect(store.output).toBe('{"name":"John"}')
    })

    it('should update stats after compression', () => {
      const { result } = renderHook(() => useJSONFormatter())

      act(() => {
        result.current.setInput('{\n  "name": "John"\n}')
        result.current.compress()
      })

      const store = useEditorStore.getState()
      expect(store.stats.compressedSize).toBeGreaterThan(0)
      expect(store.stats.compressedSize).toBeLessThan(store.stats.size)
    })
  })

  describe('Conversion', () => {
    it('should convert string to object', () => {
      const { result } = renderHook(() => useJSONFormatter())

      act(() => {
        result.current.setInput('"{\\\"name\\\":\\\"John\\\"}"')
        result.current.convertStringToObject()
      })

      const store = useEditorStore.getState()
      expect(store.output).toContain('"name":"John"')
    })

    it('should convert object to string', () => {
      const { result } = renderHook(() => useJSONFormatter())

      act(() => {
        result.current.setInput('{"name":"John"}')
        result.current.convertObjectToString()
      })

      const store = useEditorStore.getState()
      expect(store.output).toContain('\\"name\\"')
    })

    it('should auto-detect and convert', () => {
      const { result } = renderHook(() => useJSONFormatter())

      // Test string to object
      act(() => {
        result.current.setInput('"{\\\"name\\\":\\\"John\\\"}"')
        result.current.autoConvert()
      })

      let store = useEditorStore.getState()
      expect(store.output).toContain('"name":"John"')

      // Test object to string
      act(() => {
        result.current.setInput('{"name":"John"}')
        result.current.autoConvert()
      })

      store = useEditorStore.getState()
      expect(store.output).toContain('\\"name\\"')
    })
  })

  describe('State Management', () => {
    it('should update input state', () => {
      const { result } = renderHook(() => useJSONFormatter())

      act(() => {
        result.current.setInput('{"test":1}')
      })

      const store = useEditorStore.getState()
      expect(store.input).toBe('{"test":1}')
    })

    it('should update statistics on input change', () => {
      const { result } = renderHook(() => useJSONFormatter())

      act(() => {
        result.current.setInput('{\n  "a": 1,\n  "b": 2\n}')
      })

      const store = useEditorStore.getState()
      expect(store.stats.lines).toBe(4)
      expect(store.stats.size).toBeGreaterThan(0)
    })

    it('should reset state', () => {
      const { result } = renderHook(() => useJSONFormatter())

      act(() => {
        result.current.setInput('{"test":1}')
        result.current.format()
        result.current.reset()
      })

      const store = useEditorStore.getState()
      expect(store.input).toBe('')
      expect(store.output).toBe('')
      expect(store.isValid).toBe(true)
      expect(store.error).toBeNull()
    })
  })

  describe('Settings Persistence', () => {
    it('should persist indent settings', () => {
      const { result } = renderHook(() => useJSONFormatter())

      act(() => {
        result.current.setIndentSize(4)
        result.current.toggleSortKeys()
      })

      const store = useEditorStore.getState()
      expect(store.indentSize).toBe(4)
      expect(store.sortKeys).toBe(true)
    })
  })

  describe('Error Handling', () => {
    it('should handle empty input gracefully', () => {
      const { result } = renderHook(() => useJSONFormatter())

      act(() => {
        result.current.setInput('')
        result.current.format()
      })

      const store = useEditorStore.getState()
      expect(store.isValid).toBe(false)
      expect(store.error).toBeDefined()
    })

    it('should handle malformed JSON', () => {
      const { result } = renderHook(() => useJSONFormatter())

      act(() => {
        result.current.setInput('{"name":}')
        result.current.format()
      })

      const store = useEditorStore.getState()
      expect(store.isValid).toBe(false)
      expect(store.error).toBeDefined()
    })
  })
})
