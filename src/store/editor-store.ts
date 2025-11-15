import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ValidationError } from '@/types/json.types'

/**
 * Editor statistics
 */
interface EditorStats {
  lines: number
  size: number
  compressedSize: number
}

/**
 * Editor settings (persisted)
 */
interface EditorSettings {
  indentSize: 2 | 4
  indentType: 'space' | 'tab'
  sortKeys: boolean
}

/**
 * Editor state
 */
interface EditorState {
  // Content
  input: string
  output: string

  // Format options
  indentSize: 2 | 4
  indentType: 'space' | 'tab'
  sortKeys: boolean

  // Validation state
  isValid: boolean
  error: ValidationError | null

  // Statistics
  stats: EditorStats

  // Actions
  setInput: (input: string) => void
  setOutput: (output: string) => void
  setIndentSize: (size: 2 | 4) => void
  setIndentType: (type: 'space' | 'tab') => void
  toggleSortKeys: () => void
  setValidation: (isValid: boolean, error?: ValidationError) => void
  updateStats: (input: string, output?: string) => void
  reset: () => void
}

/**
 * Initial state
 */
const initialState = {
  input: '',
  output: '',
  indentSize: 2 as 2 | 4,
  indentType: 'space' as 'space' | 'tab',
  sortKeys: false,
  isValid: true,
  error: null,
  stats: {
    lines: 0,
    size: 0,
    compressedSize: 0,
  },
}

/**
 * Editor Store
 */
export const useEditorStore = create<EditorState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setInput: (input: string) => {
        set({ input })
      },

      setOutput: (output: string) => {
        set({ output })
      },

      setIndentSize: (size: 2 | 4) => {
        set({ indentSize: size })
      },

      setIndentType: (type: 'space' | 'tab') => {
        set({ indentType: type })
      },

      toggleSortKeys: () => {
        set((state) => ({ sortKeys: !state.sortKeys }))
      },

      setValidation: (isValid: boolean, error?: ValidationError) => {
        set({
          isValid,
          error: isValid ? null : error || null,
        })
      },

      updateStats: (input: string, output?: string) => {
        const lines = input ? input.split('\n').length : 0
        const size = new Blob([input]).size
        const compressedSize = output ? new Blob([output]).size : 0

        set({
          stats: {
            lines,
            size,
            compressedSize,
          },
        })
      },

      reset: () => {
        const { indentSize, indentType, sortKeys } = get()
        set({
          ...initialState,
          // Preserve persisted settings
          indentSize,
          indentType,
          sortKeys,
        })
      },
    }),
    {
      name: 'clean-json-editor-settings',
      // Only persist format options, not content or errors
      partialize: (state) => ({
        indentSize: state.indentSize,
        indentType: state.indentType,
        sortKeys: state.sortKeys,
      }),
    }
  )
)
