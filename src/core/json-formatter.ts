import JSONBigInt from 'json-bigint'
import type { FormatOptions } from '@/types/json.types'

/**
 * JSON Formatter
 * Formats JSON with customizable indentation and options
 */
export class JSONFormatter {
  private JSONBig = JSONBigInt({ useNativeBigInt: true })

  /**
   * Format JSON string with specified options
   */
  format(input: string, options: FormatOptions = { indent: 2, indentType: 'space' }): string {
    // Parse JSON (supports BigInt)
    const parsed = this.safeParse(input)

    // Stringify with formatting
    return this.stringify(parsed, options)
  }

  /**
   * Safely parse JSON with BigInt support
   */
  private safeParse(input: string): any {
    try {
      // Try to parse with BigInt support
      return this.JSONBig.parse(input)
    } catch (error: any) {
      // If BigInt parsing fails, enhance error
      throw this.enhanceError(error, input)
    }
  }

  /**
   * Stringify with custom formatting
   */
  private stringify(obj: any, options: FormatOptions): string {
    const { indent, indentType, sortKeys = false } = options
    const space = indentType === 'space' ? ' '.repeat(indent) : '\t'

    return this.stringifyValue(obj, 0, space, sortKeys)
  }

  /**
   * Recursively stringify value
   */
  private stringifyValue(
    value: any,
    depth: number,
    space: string,
    sortKeys: boolean
  ): string {
    // Handle null
    if (value === null) {
      return 'null'
    }

    // Handle primitives
    const type = typeof value
    if (type === 'string') {
      return JSON.stringify(value)
    }
    if (type === 'number' || type === 'boolean' || type === 'bigint') {
      return String(value)
    }

    // Handle arrays
    if (Array.isArray(value)) {
      return this.stringifyArray(value, depth, space, sortKeys)
    }

    // Handle objects
    if (type === 'object') {
      return this.stringifyObject(value, depth, space, sortKeys)
    }

    // Fallback to JSON.stringify
    return JSON.stringify(value)
  }

  /**
   * Format array
   */
  private stringifyArray(
    arr: any[],
    depth: number,
    space: string,
    sortKeys: boolean
  ): string {
    if (arr.length === 0) {
      return '[]'
    }

    const indent = this.getIndent(space, depth + 1)
    const closeIndent = this.getIndent(space, depth)

    const items = arr.map((item) =>
      indent + this.stringifyValue(item, depth + 1, space, sortKeys)
    )

    return '[\n' + items.join(',\n') + '\n' + closeIndent + ']'
  }

  /**
   * Format object
   */
  private stringifyObject(
    obj: Record<string, any>,
    depth: number,
    space: string,
    sortKeys: boolean
  ): string {
    let keys = Object.keys(obj)

    // Sort keys if requested
    if (sortKeys) {
      keys = keys.sort()
    }

    if (keys.length === 0) {
      return '{}'
    }

    const indent = this.getIndent(space, depth + 1)
    const closeIndent = this.getIndent(space, depth)

    const items = keys.map((key) => {
      const value = this.stringifyValue(obj[key], depth + 1, space, sortKeys)
      return `${indent}"${key}": ${value}`
    })

    return '{\n' + items.join(',\n') + '\n' + closeIndent + '}'
  }

  /**
   * Get indentation string for given depth
   */
  private getIndent(space: string, depth: number): string {
    return space.repeat(depth)
  }

  /**
   * Enhance error with position information
   */
  private enhanceError(error: Error, input: string): Error {
    const message = error.message

    // Try to extract position from error message
    const posMatch = message.match(/position (\d+)/)
    const position = posMatch ? parseInt(posMatch[1], 10) : 0

    // Calculate line and column
    const { line, column } = this.getLineColumn(input, position)

    // Create enhanced error
    const enhancedError = new Error(message) as any
    enhancedError.line = line
    enhancedError.column = column
    enhancedError.position = position

    return enhancedError
  }

  /**
   * Calculate line and column from position
   */
  private getLineColumn(input: string, position: number): { line: number; column: number } {
    const textBeforeError = input.substring(0, position)
    const lines = textBeforeError.split('\n')

    return {
      line: lines.length,
      column: lines[lines.length - 1].length + 1,
    }
  }
}
