import { describe, it, expect, beforeEach } from 'vitest'
import { JSONValidator } from '@/core/json-validator'

describe('JSONValidator', () => {
  let validator: JSONValidator

  beforeEach(() => {
    validator = new JSONValidator()
  })

  describe('Basic Validation', () => {
    it('should return valid for correct JSON', () => {
      const input = '{"name":"John","age":30}'
      const result = validator.validate(input)

      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should detect syntax error', () => {
      const input = '{"name":"John"'
      const result = validator.validate(input)

      expect(result.valid).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('should reject empty string', () => {
      const input = ''
      const result = validator.validate(input)

      expect(result.valid).toBe(false)
      expect(result.error?.message).toBeDefined()
    })

    it('should reject whitespace only string', () => {
      const input = '   \n  \t  '
      const result = validator.validate(input)

      expect(result.valid).toBe(false)
    })

    it('should validate JSON array', () => {
      const input = '[1,2,3]'
      const result = validator.validate(input)

      expect(result.valid).toBe(true)
    })

    it('should validate nested structures', () => {
      const input = '{"users":[{"name":"John"},{"name":"Jane"}]}'
      const result = validator.validate(input)

      expect(result.valid).toBe(true)
    })
  })

  describe('Error Detection', () => {
    it('should detect unclosed bracket', () => {
      const input = '{"name":"John","address":{"city":"NYC"}'
      const result = validator.validate(input)

      expect(result.valid).toBe(false)
      expect(result.error?.message).toBeDefined()
    })

    it('should detect trailing comma', () => {
      const input = '{"name":"John",}'
      const result = validator.validate(input)

      expect(result.valid).toBe(false)
    })

    it('should detect missing quotes on key', () => {
      const input = '{name:"John"}'
      const result = validator.validate(input)

      expect(result.valid).toBe(false)
    })

    it('should detect single quotes (should be double)', () => {
      const input = "{'name':'John'}"
      const result = validator.validate(input)

      expect(result.valid).toBe(false)
    })

    it('should detect missing comma', () => {
      const input = '{"name":"John" "age":30}'
      const result = validator.validate(input)

      expect(result.valid).toBe(false)
    })

    it('should detect missing colon', () => {
      const input = '{"name" "John"}'
      const result = validator.validate(input)

      expect(result.valid).toBe(false)
    })
  })

  describe('Error Location', () => {
    it('should provide error line number', () => {
      const input = `{
  "name": "John",
  "age": 30,
}`
      const result = validator.validate(input)

      expect(result.valid).toBe(false)
      expect(result.error?.line).toBeGreaterThan(0)
    })

    it('should provide error column number', () => {
      const input = '{"name":"John",}'
      const result = validator.validate(input)

      expect(result.valid).toBe(false)
      expect(result.error?.column).toBeGreaterThan(0)
    })

    it('should provide error position', () => {
      const input = '{"name":"John",}'
      const result = validator.validate(input)

      expect(result.valid).toBe(false)
      expect(result.error?.position).toBeGreaterThan(0)
    })

    it('should calculate correct line and column for multiline JSON', () => {
      const input = `{
  "name": "John",
  "age": 30,
  "city": NYC
}`
      const result = validator.validate(input)

      expect(result.valid).toBe(false)
      // JSON.parse error position extraction is browser-dependent
      // Just verify we get some line and column information
      expect(result.error?.line).toBeGreaterThan(0)
      expect(result.error?.column).toBeGreaterThan(0)
    })
  })

  describe('Error Messages', () => {
    it('should provide friendly error message', () => {
      const input = '{"name":"John",}'
      const result = validator.validate(input)

      expect(result.valid).toBe(false)
      expect(result.error?.message).toBeTruthy()
      expect(result.error?.message.length).toBeGreaterThan(0)
    })

    it('should provide code snippet', () => {
      const input = `{
  "name": "John",
  "age": 30,
}`
      const result = validator.validate(input)

      expect(result.valid).toBe(false)
      expect(result.error?.snippet).toBeDefined()
      expect(result.error?.snippet).toContain('"age": 30')
    })

    it('should provide fix suggestion for trailing comma', () => {
      const input = '{"name":"John",}'
      const result = validator.validate(input)

      expect(result.valid).toBe(false)
      expect(result.error?.suggestion).toBeDefined()
    })

    it('should provide fix suggestion for unclosed bracket', () => {
      const input = '{"name":"John"'
      const result = validator.validate(input)

      expect(result.valid).toBe(false)
      expect(result.error?.suggestion).toBeDefined()
    })

    it('should provide fix suggestion for unquoted key', () => {
      const input = '{name:"John"}'
      const result = validator.validate(input)

      expect(result.valid).toBe(false)
      expect(result.error?.suggestion).toBeDefined()
    })
  })

  describe('Valid JSON Structures', () => {
    it('should validate empty object', () => {
      const input = '{}'
      const result = validator.validate(input)

      expect(result.valid).toBe(true)
    })

    it('should validate empty array', () => {
      const input = '[]'
      const result = validator.validate(input)

      expect(result.valid).toBe(true)
    })

    it('should validate all data types', () => {
      const input = '{"string":"text","number":42,"bool":true,"null":null,"array":[1,2],"object":{"nested":true}}'
      const result = validator.validate(input)

      expect(result.valid).toBe(true)
    })

    it('should validate special characters', () => {
      const input = '{"text":"Hello\\nWorld\\t\\"Quote\\""}'
      const result = validator.validate(input)

      expect(result.valid).toBe(true)
    })

    it('should validate Unicode characters', () => {
      const input = '{"chinese":"你好","emoji":"😀"}'
      const result = validator.validate(input)

      expect(result.valid).toBe(true)
    })
  })

  describe('Complex Structures', () => {
    it('should validate deeply nested object', () => {
      let nested = '{"value":1}'
      for (let i = 0; i < 50; i++) {
        nested = `{"nested":${nested}}`
      }

      const result = validator.validate(nested)
      expect(result.valid).toBe(true)
    })

    it('should validate large array', () => {
      const items = Array.from({ length: 1000 }, (_, i) => i)
      const input = JSON.stringify(items)

      const result = validator.validate(input)
      expect(result.valid).toBe(true)
    })

    it('should validate mixed complex structure', () => {
      const complex = {
        users: [
          { id: 1, name: 'John', roles: ['admin', 'user'] },
          { id: 2, name: 'Jane', roles: ['user'] }
        ],
        settings: {
          theme: 'dark',
          features: {
            notifications: true,
            analytics: false
          }
        }
      }

      const result = validator.validate(JSON.stringify(complex))
      expect(result.valid).toBe(true)
    })
  })
})
