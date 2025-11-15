import { useCallback } from 'react'
import { useEditorStore } from '@/store/editor-store'
import { JSONFormatter } from '@/core/json-formatter'
import { JSONValidator } from '@/core/json-validator'
import { JSONCompressor } from '@/core/json-compressor'
import { JSONConverter } from '@/core/json-converter'
import type { FormatOptions } from '@/types/json.types'

// Create instances
const formatter = new JSONFormatter()
const validator = new JSONValidator()
const compressor = new JSONCompressor()
const converter = new JSONConverter()

/**
 * useJSONFormatter Hook
 * Provides JSON formatting, validation, compression, and conversion functionality
 */
export function useJSONFormatter() {
  // Get state from store
  const {
    input,
    output,
    indentSize,
    indentType,
    sortKeys,
    isValid,
    error,
    stats,
    setInput,
    setOutput,
    setIndentSize,
    setIndentType,
    toggleSortKeys,
    setValidation,
    updateStats,
    reset,
  } = useEditorStore()

  /**
   * Format JSON with current settings
   */
  const format = useCallback(() => {
    // Get latest values from store
    const state = useEditorStore.getState()
    const currentInput = state.input
    const currentIndentSize = state.indentSize
    const currentIndentType = state.indentType
    const currentSortKeys = state.sortKeys

    // Validate first
    const validationResult = validator.validate(currentInput)

    if (!validationResult.valid) {
      setValidation(false, validationResult.error)
      setOutput('')
      updateStats(currentInput, '')
      return
    }

    // Format
    try {
      const options: FormatOptions = {
        indent: currentIndentSize,
        indentType: currentIndentType,
        sortKeys: currentSortKeys,
      }

      const formatted = formatter.format(currentInput, options)

      setOutput(formatted)
      setValidation(true)
      updateStats(currentInput, formatted)
    } catch (error: any) {
      setValidation(false, {
        message: error.message,
        line: 1,
        column: 1,
        position: 0,
        snippet: '',
        suggestion: 'Please check JSON syntax',
      })
      setOutput('')
      updateStats(currentInput, '')
    }
  }, [setOutput, setValidation, updateStats])

  /**
   * Compress JSON
   */
  const compress = useCallback(() => {
    // Get latest input from store
    const currentInput = useEditorStore.getState().input

    // Validate first
    const validationResult = validator.validate(currentInput)

    if (!validationResult.valid) {
      setValidation(false, validationResult.error)
      setOutput('')
      updateStats(currentInput, '')
      return
    }

    // Compress
    try {
      const compressed = compressor.compress(currentInput)

      setOutput(compressed)
      setValidation(true)
      updateStats(currentInput, compressed)
    } catch (error: any) {
      setValidation(false, {
        message: error.message,
        line: 1,
        column: 1,
        position: 0,
        snippet: '',
        suggestion: 'Please check JSON syntax',
      })
      setOutput('')
      updateStats(currentInput, '')
    }
  }, [setOutput, setValidation, updateStats])

  /**
   * Convert string to object
   */
  const convertStringToObject = useCallback(() => {
    // Get latest input from store
    const currentInput = useEditorStore.getState().input

    try {
      const result = converter.stringToObject(currentInput)

      setOutput(result)
      setValidation(true)
      updateStats(currentInput, result)
    } catch (error: any) {
      setValidation(false, {
        message: error.message,
        line: 1,
        column: 1,
        position: 0,
        snippet: '',
        suggestion: 'Input is not a valid JSON string',
      })
      setOutput('')
      updateStats(currentInput, '')
    }
  }, [setOutput, setValidation, updateStats])

  /**
   * Convert object to string
   */
  const convertObjectToString = useCallback(() => {
    // Get latest input from store
    const currentInput = useEditorStore.getState().input

    try {
      const result = converter.objectToString(currentInput)

      setOutput(result)
      setValidation(true)
      updateStats(currentInput, result)
    } catch (error: any) {
      setValidation(false, {
        message: error.message,
        line: 1,
        column: 1,
        position: 0,
        snippet: '',
        suggestion: 'Input is not valid JSON',
      })
      setOutput('')
      updateStats(currentInput, '')
    }
  }, [setOutput, setValidation, updateStats])

  /**
   * Auto-detect and convert
   */
  const autoConvert = useCallback(() => {
    // Get latest input from store
    const currentInput = useEditorStore.getState().input

    try {
      const result = converter.autoConvert(currentInput)

      setOutput(result.output)
      setValidation(true)
      updateStats(currentInput, result.output)
    } catch (error: any) {
      setValidation(false, {
        message: error.message,
        line: 1,
        column: 1,
        position: 0,
        snippet: '',
        suggestion: 'Invalid JSON',
      })
      setOutput('')
      updateStats(currentInput, '')
    }
  }, [setOutput, setValidation, updateStats])

  /**
   * Update input and statistics
   */
  const handleSetInput = useCallback((value: string) => {
    setInput(value)
    updateStats(value)
  }, [setInput, updateStats])

  return {
    // State
    input,
    output,
    indentSize,
    indentType,
    sortKeys,
    isValid,
    error,
    stats,

    // State setters
    setInput: handleSetInput,
    setIndentSize,
    setIndentType,
    toggleSortKeys,
    reset,

    // Actions
    format,
    compress,
    convertStringToObject,
    convertObjectToString,
    autoConvert,
  }
}
