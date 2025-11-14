import type { ConversionResult, DetectedType } from '@/types/json.types'

/**
 * JSON Converter
 * Converts between JSON String and JSON Object
 */
export class JSONConverter {
  /**
   * Convert JSON string (escaped) to JSON object
   * Example: "{\"name\":\"John\"}" -> {"name":"John"}
   */
  stringToObject(input: string): string {
    // Parse once to get the string
    const stringValue = JSON.parse(input)

    // Validate it's a string
    if (typeof stringValue !== 'string') {
      throw new Error('Input is not a JSON string')
    }

    // The string should itself be valid JSON
    // Validate by parsing it
    JSON.parse(stringValue)

    // Return the unescaped JSON string
    return stringValue
  }

  /**
   * Convert JSON object to JSON string (escaped)
   * Example: {"name":"John"} -> "{\"name\":\"John\"}"
   */
  objectToString(input: string): string {
    // Parse to validate it's valid JSON
    const parsed = JSON.parse(input)

    // Stringify to get the original JSON string
    const jsonString = JSON.stringify(parsed)

    // Stringify again to escape it
    return JSON.stringify(jsonString)
  }

  /**
   * Detect input type (string or object)
   */
  detectType(input: string): DetectedType {
    try {
      const parsed = JSON.parse(input)

      // If it's a string, it might be a JSON string
      if (typeof parsed === 'string') {
        // Try to parse it again to see if it's a JSON string
        try {
          JSON.parse(parsed)
          return 'string'
        } catch {
          // It's just a regular string, treat as object type
          return 'object'
        }
      }

      // It's an object or array
      return 'object'
    } catch {
      throw new Error('Invalid JSON')
    }
  }

  /**
   * Auto-convert based on detected type
   */
  autoConvert(input: string): ConversionResult {
    const type = this.detectType(input)

    if (type === 'string') {
      return {
        type: 'string-to-object',
        output: this.stringToObject(input),
      }
    } else {
      return {
        type: 'object-to-string',
        output: this.objectToString(input),
      }
    }
  }
}
