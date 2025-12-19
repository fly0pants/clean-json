/**
 * JSON Utilities
 * Additional JSON manipulation utilities
 */

/**
 * Unicode escape/unescape utilities
 */
export class UnicodeConverter {
  /**
   * Convert Chinese and special characters to Unicode escape sequences
   * Example: "你好" -> "\u4f60\u597d"
   */
  toUnicode(input: string): string {
    // Parse JSON first to validate
    const parsed = JSON.parse(input)
    
    // Convert to string with unicode escape
    return JSON.stringify(parsed, (_, value) => {
      if (typeof value === 'string') {
        return this.escapeUnicode(value)
      }
      return value
    }, 2).replace(/\\\\u/g, '\\u')
  }

  /**
   * Convert Unicode escape sequences back to characters
   * Example: "\u4f60\u597d" -> "你好"
   */
  fromUnicode(input: string): string {
    // Parse JSON (this will automatically convert unicode escapes)
    const parsed = JSON.parse(input)
    return JSON.stringify(parsed, null, 2)
  }

  /**
   * Escape string to unicode
   */
  private escapeUnicode(str: string): string {
    return str.replace(/[\u0080-\uffff]/g, (char) => {
      return '\\u' + ('0000' + char.charCodeAt(0).toString(16)).slice(-4)
    })
  }
}

/**
 * Remove comments from JSON-like string
 * Handles: // line comments and /* block comments * /
 */
export class CommentRemover {
  /**
   * Remove all comments from JSON string
   */
  removeComments(input: string): string {
    let result = ''
    let inString = false
    let inLineComment = false
    let inBlockComment = false
    let i = 0

    while (i < input.length) {
      const char = input[i]
      const nextChar = input[i + 1]

      // Handle string state
      if (!inLineComment && !inBlockComment) {
        if (char === '"' && (i === 0 || input[i - 1] !== '\\')) {
          inString = !inString
        }
      }

      // Not in string, check for comments
      if (!inString) {
        // Check for line comment start
        if (!inBlockComment && char === '/' && nextChar === '/') {
          inLineComment = true
          i += 2
          continue
        }

        // Check for block comment start
        if (!inLineComment && char === '/' && nextChar === '*') {
          inBlockComment = true
          i += 2
          continue
        }

        // Check for line comment end
        if (inLineComment && (char === '\n' || char === '\r')) {
          inLineComment = false
          result += char
          i++
          continue
        }

        // Check for block comment end
        if (inBlockComment && char === '*' && nextChar === '/') {
          inBlockComment = false
          i += 2
          continue
        }
      }

      // Add character if not in comment
      if (!inLineComment && !inBlockComment) {
        result += char
      }

      i++
    }

    // Validate the result is valid JSON
    JSON.parse(result)
    
    return result
  }
}

/**
 * JSON to XML converter
 */
export class JSONToXMLConverter {
  /**
   * Convert JSON to XML format
   */
  convert(input: string, rootName: string = 'root'): string {
    const parsed = JSON.parse(input)
    const xml = this.toXML(parsed, rootName)
    return '<?xml version="1.0" encoding="UTF-8"?>\n' + xml
  }

  /**
   * Recursively convert value to XML
   */
  private toXML(value: any, tagName: string, indent: string = ''): string {
    // Handle null
    if (value === null) {
      return `${indent}<${tagName}></${tagName}>`
    }

    // Handle primitives
    const type = typeof value
    if (type === 'string' || type === 'number' || type === 'boolean') {
      const escaped = this.escapeXML(String(value))
      return `${indent}<${tagName}>${escaped}</${tagName}>`
    }

    // Handle arrays
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return `${indent}<${tagName}></${tagName}>`
      }

      const itemTag = this.singularize(tagName)
      const items = value.map(item => this.toXML(item, itemTag, indent + '  ')).join('\n')
      return `${indent}<${tagName}>\n${items}\n${indent}</${tagName}>`
    }

    // Handle objects
    if (type === 'object') {
      const keys = Object.keys(value)
      if (keys.length === 0) {
        return `${indent}<${tagName}></${tagName}>`
      }

      const children = keys.map(key => {
        const safeKey = this.sanitizeTagName(key)
        return this.toXML(value[key], safeKey, indent + '  ')
      }).join('\n')

      return `${indent}<${tagName}>\n${children}\n${indent}</${tagName}>`
    }

    return `${indent}<${tagName}>${String(value)}</${tagName}>`
  }

  /**
   * Escape special XML characters
   */
  private escapeXML(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
  }

  /**
   * Make tag name singular (simple implementation)
   */
  private singularize(name: string): string {
    if (name.endsWith('ies')) {
      return name.slice(0, -3) + 'y'
    }
    if (name.endsWith('es')) {
      return name.slice(0, -2)
    }
    if (name.endsWith('s') && !name.endsWith('ss')) {
      return name.slice(0, -1)
    }
    return name + '_item'
  }

  /**
   * Sanitize string for XML tag name
   */
  private sanitizeTagName(name: string): string {
    // XML tag names cannot start with numbers or contain special characters
    let sanitized = name.replace(/[^a-zA-Z0-9_-]/g, '_')
    if (/^[0-9]/.test(sanitized)) {
      sanitized = '_' + sanitized
    }
    return sanitized || 'item'
  }
}

/**
 * JSON to CSV converter (for array of objects)
 */
export class JSONToCSVConverter {
  /**
   * Convert JSON array to CSV format
   */
  convert(input: string, delimiter: string = ','): string {
    const parsed = JSON.parse(input)

    // Handle array of objects
    if (Array.isArray(parsed)) {
      if (parsed.length === 0) {
        return ''
      }

      // Check if all items are objects
      const allObjects = parsed.every(item => 
        typeof item === 'object' && item !== null && !Array.isArray(item)
      )

      if (allObjects) {
        return this.convertObjectArray(parsed, delimiter)
      }

      // Handle array of primitives
      return this.convertPrimitiveArray(parsed, delimiter)
    }

    // Handle single object
    if (typeof parsed === 'object' && parsed !== null) {
      return this.convertSingleObject(parsed, delimiter)
    }

    throw new Error('Input must be an array or object to convert to CSV')
  }

  /**
   * Convert array of objects to CSV
   */
  private convertObjectArray(arr: Record<string, any>[], delimiter: string): string {
    // Get all unique keys
    const keys = new Set<string>()
    arr.forEach(obj => Object.keys(obj).forEach(key => keys.add(key)))
    const headers = Array.from(keys)

    // Build CSV
    const headerRow = headers.map(h => this.escapeCSV(h, delimiter)).join(delimiter)
    const dataRows = arr.map(obj => {
      return headers.map(header => {
        const value = obj[header]
        return this.escapeCSV(this.valueToString(value), delimiter)
      }).join(delimiter)
    })

    return [headerRow, ...dataRows].join('\n')
  }

  /**
   * Convert array of primitives to CSV
   */
  private convertPrimitiveArray(arr: any[], delimiter: string): string {
    return arr.map(item => this.escapeCSV(this.valueToString(item), delimiter)).join('\n')
  }

  /**
   * Convert single object to CSV
   */
  private convertSingleObject(obj: Record<string, any>, delimiter: string): string {
    const keys = Object.keys(obj)
    const headerRow = keys.map(k => this.escapeCSV(k, delimiter)).join(delimiter)
    const valueRow = keys.map(k => this.escapeCSV(this.valueToString(obj[k]), delimiter)).join(delimiter)
    return [headerRow, valueRow].join('\n')
  }

  /**
   * Convert value to string representation
   */
  private valueToString(value: any): string {
    if (value === null || value === undefined) {
      return ''
    }
    if (typeof value === 'object') {
      return JSON.stringify(value)
    }
    return String(value)
  }

  /**
   * Escape CSV value
   */
  private escapeCSV(value: string, delimiter: string): string {
    // Check if quoting is needed
    const needsQuoting = value.includes(delimiter) || 
                        value.includes('"') || 
                        value.includes('\n') ||
                        value.includes('\r')

    if (needsQuoting) {
      // Escape double quotes by doubling them
      const escaped = value.replace(/"/g, '""')
      return `"${escaped}"`
    }

    return value
  }
}

/**
 * JSON Path utility
 * Get the path of a key in JSON
 */
export class JSONPathHelper {
  /**
   * Get all paths in a JSON object
   */
  getAllPaths(input: string): string[] {
    const parsed = JSON.parse(input)
    const paths: string[] = []
    this.extractPaths(parsed, '$', paths)
    return paths
  }

  /**
   * Recursively extract paths
   */
  private extractPaths(value: any, currentPath: string, paths: string[]): void {
    paths.push(currentPath)

    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        this.extractPaths(item, `${currentPath}[${index}]`, paths)
      })
    } else if (typeof value === 'object' && value !== null) {
      Object.keys(value).forEach(key => {
        const safePath = /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key) 
          ? `.${key}` 
          : `["${key}"]`
        this.extractPaths(value[key], `${currentPath}${safePath}`, paths)
      })
    }
  }

  /**
   * Get value at path
   */
  getValueAtPath(input: string, path: string): any {
    const parsed = JSON.parse(input)
    
    // Remove $ prefix
    if (path.startsWith('$')) {
      path = path.slice(1)
    }
    
    if (!path) return parsed

    // Parse path segments
    const segments = this.parsePath(path)
    let current = parsed

    for (const segment of segments) {
      if (current === null || current === undefined) {
        throw new Error(`Cannot access property "${segment}" of ${current}`)
      }
      current = current[segment]
    }

    return current
  }

  /**
   * Parse path into segments
   */
  private parsePath(path: string): (string | number)[] {
    const segments: (string | number)[] = []
    const regex = /\.([a-zA-Z_][a-zA-Z0-9_]*)|\[(\d+)\]|\["([^"]+)"\]/g
    let match

    while ((match = regex.exec(path)) !== null) {
      if (match[1] !== undefined) {
        segments.push(match[1])
      } else if (match[2] !== undefined) {
        segments.push(parseInt(match[2], 10))
      } else if (match[3] !== undefined) {
        segments.push(match[3])
      }
    }

    return segments
  }
}
