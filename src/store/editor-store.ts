import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ValidationError } from '@/types/json.types'

/**
 * Editor statistics
 */
export interface EditorStats {
  lines: number
  size: number
  compressedSize: number
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
  autoFormat: boolean

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
  toggleAutoFormat: () => void
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
  autoFormat: true,
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

      toggleAutoFormat: () => {
        set((state) => ({ autoFormat: !state.autoFormat }))
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
        const { indentSize, indentType, sortKeys, autoFormat } = get()
        set({
          ...initialState,
          // Preserve persisted settings
          indentSize,
          indentType,
          sortKeys,
          autoFormat,
        })
      },
    }),
    {
      name: 'clean-json-editor-settings',
      // Persist format options and input content for memory feature
      partialize: (state) => ({
        indentSize: state.indentSize,
        indentType: state.indentType,
        sortKeys: state.sortKeys,
        autoFormat: state.autoFormat,
        input: state.input, // Remember user's last input
        output: state.output, // Remember user's last output
      }),
    }
  )
)
