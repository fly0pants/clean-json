import type { ValidationResult, ValidationError } from '@/types/json.types'

/**
 * JSON Validator
 * Validates JSON syntax and provides detailed error information
 */
export class JSONValidator {
  /**
   * Validate JSON string
   */
  validate(input: string): ValidationResult {
    // Check for empty or whitespace-only input
    if (!input || input.trim() === '') {
      return {
        valid: false,
        error: {
          message: 'JSON 不能为空',
          line: 1,
          column: 1,
          position: 0,
          snippet: '',
          suggestion: '请输入有效的 JSON 内容',
        },
      }
    }

    try {
      JSON.parse(input)
      return { valid: true }
    } catch (error: any) {
      return {
        valid: false,
        error: this.parseError(error, input),
      }
    }
  }

  /**
   * Parse error and extract detailed information
   */
  private parseError(error: Error, input: string): ValidationError {
    const message = error.message

    // Extract position from error message if available
    const position = this.extractPosition(message, input)

    // Calculate line and column
    const { line, column } = this.getLineColumn(input, position)

    // Get code snippet
    const snippet = this.getErrorSnippet(input, line)

    // Generate fix suggestion
    const suggestion = this.generateSuggestion(message, input, position)

    return {
      message: this.friendlyMessage(message),
      line,
      column,
      position,
      snippet,
      suggestion,
    }
  }

  /**
   * Extract position from error message
   */
  private extractPosition(message: string, input: string): number {
    // Try to extract position from various error message formats
    const posMatch = message.match(/position (\d+)/i)
    if (posMatch) {
      return parseInt(posMatch[1], 10)
    }

    // For some browsers, try to extract from "at position X"
    const atPosMatch = message.match(/at position (\d+)/i)
    if (atPosMatch) {
      return parseInt(atPosMatch[1], 10)
    }

    // Try to extract context from error message like: "Unexpected token 'N', ...\"city\": NYC..."
    // Look for the pattern: '...\"<context>\"...'
    const contextMatch = message.match(/\.\.\.(.+?)\.\.\./)
    if (contextMatch) {
      const context = contextMatch[1]
      // Find this context in the input
      const contextPos = input.indexOf(context)
      if (contextPos !== -1) {
        // Find the first non-whitespace character in the context
        // This is likely where the error is
        const trimmedContext = context.trimStart()
        const offset = context.length - trimmedContext.length
        return contextPos + offset
      }
    }

    // Try to find error character in the message
    const tokenMatch = message.match(/Unexpected token '(.)'/)
    if (tokenMatch) {
      const token = tokenMatch[1]
      // Find the first occurrence of this token that's not in a string
      let inString = false
      let escapeNext = false

      for (let i = 0; i < input.length; i++) {
        const char = input[i]

        if (escapeNext) {
          escapeNext = false
          continue
        }

        if (char === '\\') {
          escapeNext = true
          continue
        }

        if (char === '"') {
          inString = !inString
          continue
        }

        if (!inString && char === token) {
          return i
        }
      }
    }

    return 0
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

  /**
   * Get code snippet around error line
   */
  private getErrorSnippet(input: string, errorLine: number): string {
    const lines = input.split('\n')
    const start = Math.max(0, errorLine - 2)
    const end = Math.min(lines.length, errorLine + 1)

    return lines
      .slice(start, end)
      .map((line, index) => {
        const lineNum = start + index + 1
        const marker = lineNum === errorLine ? '> ' : '  '
        return `${marker}${lineNum} | ${line}`
      })
      .join('\n')
  }

  /**
   * Generate friendly error message
   */
  private friendlyMessage(message: string): string {
    const mappings: Record<string, string> = {
      'Unexpected token': '意外的字符',
      'Unexpected end of JSON input': 'JSON 结构不完整',
      'Expected property name': '期望键名（需要双引号）',
      'Unexpected string': '意外的字符串',
      'Unexpected number': '意外的数字',
      'Expected': '期望',
      'but got': '但得到',
    }

    let friendlyMsg = message

    for (const [key, value] of Object.entries(mappings)) {
      if (friendlyMsg.includes(key)) {
        friendlyMsg = friendlyMsg.replace(key, value)
      }
    }

    return friendlyMsg
  }

  /**
   * Generate fix suggestion based on error type
   */
  private generateSuggestion(message: string, input: string, position: number): string {
    const lowerMessage = message.toLowerCase()

    // Trailing comma
    if (lowerMessage.includes('unexpected token') && input[position] === ',') {
      return '多余的逗号。尝试删除最后一个逗号。'
    }

    // Unclosed brackets
    if (lowerMessage.includes('unexpected end')) {
      const openBrackets = (input.match(/\{/g) || []).length
      const closeBrackets = (input.match(/\}/g) || []).length
      const openSquare = (input.match(/\[/g) || []).length
      const closeSquare = (input.match(/\]/g) || []).length

      if (openBrackets > closeBrackets) {
        return '缺少闭合括号 }'
      }
      if (openSquare > closeSquare) {
        return '缺少闭合括号 ]'
      }
      return '缺少闭合括号 } 或 ]'
    }

    // Missing quotes
    if (lowerMessage.includes('expected property name') || lowerMessage.includes('unexpected token')) {
      const char = input[position]

      if (char === ':') {
        return '键名需要用双引号包裹。'
      }

      if (char === '}' || char === ']') {
        return '可能缺少逗号或引号。'
      }

      // Check for single quotes
      if (input.includes("'")) {
        return 'JSON 中应使用双引号（"）而非单引号（\'）。'
      }
    }

    // Missing comma
    if (lowerMessage.includes('unexpected string') || lowerMessage.includes('unexpected number')) {
      return '可能缺少逗号分隔。'
    }

    // Generic suggestion
    if (lowerMessage.includes('unexpected')) {
      return '请检查 JSON 语法是否正确。'
    }

    return '请检查 JSON 语法，确保所有括号、引号和逗号正确使用。'
  }
}
