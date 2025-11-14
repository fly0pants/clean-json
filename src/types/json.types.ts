/**
 * JSON related type definitions
 */

export interface ValidationResult {
  valid: boolean
  error?: ValidationError
}

export interface ValidationError {
  message: string
  line: number
  column: number
  position: number
  snippet: string
  suggestion?: string
}

export interface FormatOptions {
  indent: number
  indentType: 'space' | 'tab'
  sortKeys?: boolean
}

export interface CompressionStats {
  originalSize: number
  compressedSize: number
  ratio: string
  saved: number
}

export interface ConversionResult {
  type: 'string-to-object' | 'object-to-string'
  output: string
}

export type DetectedType = 'string' | 'object'
