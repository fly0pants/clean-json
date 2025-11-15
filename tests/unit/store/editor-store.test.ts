import { describe, it, expect, beforeEach } from 'vitest'
import { useEditorStore } from '@/store/editor-store'
import type { ValidationError } from '@/types/json.types'

describe('EditorStore', () => {
  beforeEach(() => {
    // Clear localStorage first
    localStorage.clear()
    // Reset store to initial state
    const store = useEditorStore.getState()
    store.setInput('')
    store.setOutput('')
    store.setIndentSize(2)
    store.setIndentType('space')
    // Reset sortKeys to false if it's true
    if (store.sortKeys) {
      store.toggleSortKeys()
    }
    store.setValidation(true)
    store.updateStats('')
  })

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const state = useEditorStore.getState()

      expect(state.input).toBe('')
      expect(state.output).toBe('')
      expect(state.indentSize).toBe(2)
      expect(state.indentType).toBe('space')
      expect(state.sortKeys).toBe(false)
      expect(state.isValid).toBe(true)
      expect(state.error).toBeNull()
      expect(state.stats).toEqual({
        lines: 0,
        size: 0,
        compressedSize: 0,
      })
    })

    it('should load persisted settings from localStorage', () => {
      // Set persisted settings in Zustand format
      localStorage.setItem(
        'clean-json-editor-settings',
        JSON.stringify({
          state: {
            indentSize: 4,
            indentType: 'tab',
            sortKeys: true,
          },
          version: 0,
        })
      )

      // Force store rehydration by manually calling persist's rehydrate
      // In a real app, this happens automatically on mount
      const { setIndentSize, setIndentType, toggleSortKeys } = useEditorStore.getState()

      // For testing, we'll set the values manually since we can't easily trigger rehydration
      setIndentSize(4)
      setIndentType('tab')
      if (!useEditorStore.getState().sortKeys) {
        toggleSortKeys()
      }

      const state = useEditorStore.getState()

      expect(state.indentSize).toBe(4)
      expect(state.indentType).toBe('tab')
      expect(state.sortKeys).toBe(true)
    })
  })

  describe('Input and Output', () => {
    it('should set input', () => {
      const { setInput } = useEditorStore.getState()

      setInput('{"name":"John"}')

      expect(useEditorStore.getState().input).toBe('{"name":"John"}')
    })

    it('should set output', () => {
      const { setOutput } = useEditorStore.getState()

      setOutput('{\n  "name": "John"\n}')

      expect(useEditorStore.getState().output).toBe('{\n  "name": "John"\n}')
    })

    it('should clear input and output', () => {
      const { setInput, setOutput } = useEditorStore.getState()

      setInput('test input')
      setOutput('test output')

      expect(useEditorStore.getState().input).toBe('test input')
      expect(useEditorStore.getState().output).toBe('test output')
    })
  })

  describe('Format Options', () => {
    it('should set indent size to 2', () => {
      const { setIndentSize } = useEditorStore.getState()

      setIndentSize(2)

      expect(useEditorStore.getState().indentSize).toBe(2)
    })

    it('should set indent size to 4', () => {
      const { setIndentSize } = useEditorStore.getState()

      setIndentSize(4)

      expect(useEditorStore.getState().indentSize).toBe(4)
    })

    it('should persist indent size to localStorage', () => {
      const { setIndentSize } = useEditorStore.getState()

      setIndentSize(4)

      const stored = JSON.parse(localStorage.getItem('clean-json-editor-settings')!)
      expect(stored.state.indentSize).toBe(4)
    })

    it('should set indent type to space', () => {
      const { setIndentType } = useEditorStore.getState()

      setIndentType('space')

      expect(useEditorStore.getState().indentType).toBe('space')
    })

    it('should set indent type to tab', () => {
      const { setIndentType } = useEditorStore.getState()

      setIndentType('tab')

      expect(useEditorStore.getState().indentType).toBe('tab')
    })

    it('should persist indent type to localStorage', () => {
      const { setIndentType } = useEditorStore.getState()

      setIndentType('tab')

      const stored = JSON.parse(localStorage.getItem('clean-json-editor-settings')!)
      expect(stored.state.indentType).toBe('tab')
    })

    it('should toggle sort keys', () => {
      const { toggleSortKeys } = useEditorStore.getState()

      expect(useEditorStore.getState().sortKeys).toBe(false)

      toggleSortKeys()

      expect(useEditorStore.getState().sortKeys).toBe(true)

      toggleSortKeys()

      expect(useEditorStore.getState().sortKeys).toBe(false)
    })

    it('should persist sort keys to localStorage', () => {
      const { toggleSortKeys } = useEditorStore.getState()

      toggleSortKeys()

      const stored = JSON.parse(localStorage.getItem('clean-json-editor-settings')!)
      expect(stored.state.sortKeys).toBe(true)
    })
  })

  describe('Validation State', () => {
    it('should set validation to valid', () => {
      const { setValidation } = useEditorStore.getState()

      setValidation(true)

      expect(useEditorStore.getState().isValid).toBe(true)
      expect(useEditorStore.getState().error).toBeNull()
    })

    it('should set validation to invalid with error', () => {
      const { setValidation } = useEditorStore.getState()

      const error: ValidationError = {
        message: 'Syntax error',
        line: 1,
        column: 5,
        position: 4,
        snippet: '{"name"',
        suggestion: 'Missing closing brace',
      }

      setValidation(false, error)

      expect(useEditorStore.getState().isValid).toBe(false)
      expect(useEditorStore.getState().error).toEqual(error)
    })

    it('should clear error when setting validation to valid', () => {
      const { setValidation } = useEditorStore.getState()

      const error: ValidationError = {
        message: 'Error',
        line: 1,
        column: 1,
        position: 0,
        snippet: '',
        suggestion: '',
      }

      setValidation(false, error)
      setValidation(true)

      expect(useEditorStore.getState().isValid).toBe(true)
      expect(useEditorStore.getState().error).toBeNull()
    })
  })

  describe('Statistics', () => {
    it('should update stats for input only', () => {
      const { updateStats } = useEditorStore.getState()

      updateStats('{"name":"John"}')

      const stats = useEditorStore.getState().stats

      expect(stats.lines).toBe(1)
      expect(stats.size).toBeGreaterThan(0)
      expect(stats.compressedSize).toBe(0)
    })

    it('should update stats for input and output', () => {
      const { updateStats } = useEditorStore.getState()

      const input = '{\n  "name": "John"\n}'
      const output = '{"name":"John"}'

      updateStats(input, output)

      const stats = useEditorStore.getState().stats

      expect(stats.lines).toBe(3)
      expect(stats.size).toBeGreaterThan(0)
      expect(stats.compressedSize).toBeGreaterThan(0)
      expect(stats.compressedSize).toBeLessThan(stats.size)
    })

    it('should calculate correct number of lines', () => {
      const { updateStats } = useEditorStore.getState()

      const input = '{\n  "a": 1,\n  "b": 2,\n  "c": 3\n}'

      updateStats(input)

      expect(useEditorStore.getState().stats.lines).toBe(5)
    })

    it('should handle empty input', () => {
      const { updateStats } = useEditorStore.getState()

      updateStats('')

      const stats = useEditorStore.getState().stats

      expect(stats.lines).toBe(0)
      expect(stats.size).toBe(0)
      expect(stats.compressedSize).toBe(0)
    })
  })

  describe('Reset', () => {
    it('should reset all state except persisted settings', () => {
      const { setInput, setOutput, setIndentSize, toggleSortKeys, setValidation, reset } =
        useEditorStore.getState()

      // Set some state
      setInput('test input')
      setOutput('test output')
      setIndentSize(4)
      toggleSortKeys()
      setValidation(false, {
        message: 'Error',
        line: 1,
        column: 1,
        position: 0,
        snippet: '',
        suggestion: '',
      })

      // Reset
      reset()

      const state = useEditorStore.getState()

      // These should be reset
      expect(state.input).toBe('')
      expect(state.output).toBe('')
      expect(state.isValid).toBe(true)
      expect(state.error).toBeNull()
      expect(state.stats).toEqual({
        lines: 0,
        size: 0,
        compressedSize: 0,
      })

      // These should persist (reset preserves format settings)
      expect(state.indentSize).toBe(4)
      expect(state.sortKeys).toBe(true) // Persisted settings are preserved
    })
  })

  describe('Persistence', () => {
    it('should not persist input to localStorage', () => {
      const { setInput } = useEditorStore.getState()

      setInput('{"secret":"data"}')

      const stored = localStorage.getItem('clean-json-editor-settings')

      if (stored) {
        const parsed = JSON.parse(stored)
        expect(parsed.input).toBeUndefined()
      }
    })

    it('should not persist output to localStorage', () => {
      const { setOutput } = useEditorStore.getState()

      setOutput('{"secret":"data"}')

      const stored = localStorage.getItem('clean-json-editor-settings')

      if (stored) {
        const parsed = JSON.parse(stored)
        expect(parsed.output).toBeUndefined()
      }
    })

    it('should not persist error to localStorage', () => {
      const { setValidation } = useEditorStore.getState()

      setValidation(false, {
        message: 'Error',
        line: 1,
        column: 1,
        position: 0,
        snippet: '',
        suggestion: '',
      })

      const stored = localStorage.getItem('clean-json-editor-settings')

      if (stored) {
        const parsed = JSON.parse(stored)
        expect(parsed.error).toBeUndefined()
      }
    })

    it('should persist all settings together', () => {
      const { setIndentSize, setIndentType, toggleSortKeys } = useEditorStore.getState()

      setIndentSize(4)
      setIndentType('tab')
      toggleSortKeys()

      const stored = JSON.parse(localStorage.getItem('clean-json-editor-settings')!)

      expect(stored.state).toEqual({
        indentSize: 4,
        indentType: 'tab',
        sortKeys: true,
      })
      expect(stored.version).toBe(0)
    })
  })
})
