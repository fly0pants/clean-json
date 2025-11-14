import { describe, it, expect, beforeEach } from 'vitest'
import { JSONFormatter } from '@/core/json-formatter'

describe('JSONFormatter', () => {
  let formatter: JSONFormatter

  beforeEach(() => {
    formatter = new JSONFormatter()
  })

  describe('Basic Formatting', () => {
    it('should format simple object with 2 spaces indent', () => {
      const input = '{"name":"John","age":30}'
      const expected = `{
  "name": "John",
  "age": 30
}`
      expect(formatter.format(input, { indent: 2, indentType: 'space' })).toBe(expected)
    })

    it('should format simple array', () => {
      const input = '[1,2,3,4,5]'
      const expected = `[
  1,
  2,
  3,
  4,
  5
]`
      expect(formatter.format(input, { indent: 2, indentType: 'space' })).toBe(expected)
    })

    it('should format nested object', () => {
      const input = '{"user":{"name":"John","address":{"city":"NYC"}}}'
      const expected = `{
  "user": {
    "name": "John",
    "address": {
      "city": "NYC"
    }
  }
}`
      expect(formatter.format(input, { indent: 2, indentType: 'space' })).toBe(expected)
    })

    it('should format nested array', () => {
      const input = '[[1,2],[3,4]]'
      const expected = `[
  [
    1,
    2
  ],
  [
    3,
    4
  ]
]`
      expect(formatter.format(input, { indent: 2, indentType: 'space' })).toBe(expected)
    })

    it('should format mixed nested structure', () => {
      const input = '{"users":[{"name":"John"},{"name":"Jane"}]}'
      const expected = `{
  "users": [
    {
      "name": "John"
    },
    {
      "name": "Jane"
    }
  ]
}`
      expect(formatter.format(input, { indent: 2, indentType: 'space' })).toBe(expected)
    })
  })

  describe('Indent Options', () => {
    it('should format with 4 spaces indent', () => {
      const input = '{"name":"John"}'
      const expected = `{
    "name": "John"
}`
      expect(formatter.format(input, { indent: 4, indentType: 'space' })).toBe(expected)
    })

    it('should format with tab indent', () => {
      const input = '{"name":"John"}'
      const expected = "{\n\t\"name\": \"John\"\n}"
      expect(formatter.format(input, { indent: 1, indentType: 'tab' })).toBe(expected)
    })
  })

  describe('Key Sorting', () => {
    it('should sort keys alphabetically when sortKeys is true', () => {
      const input = '{"z":1,"a":2,"m":3}'
      const result = formatter.format(input, { indent: 2, indentType: 'space', sortKeys: true })

      // Check that 'a' comes before 'm' which comes before 'z'
      const aIndex = result.indexOf('"a"')
      const mIndex = result.indexOf('"m"')
      const zIndex = result.indexOf('"z"')

      expect(aIndex).toBeLessThan(mIndex)
      expect(mIndex).toBeLessThan(zIndex)
    })

    it('should preserve key order when sortKeys is false', () => {
      const input = '{"z":1,"a":2,"m":3}'
      const result = formatter.format(input, { indent: 2, indentType: 'space', sortKeys: false })

      // Check original order preserved
      const zIndex = result.indexOf('"z"')
      const aIndex = result.indexOf('"a"')
      const mIndex = result.indexOf('"m"')

      expect(zIndex).toBeLessThan(aIndex)
      expect(aIndex).toBeLessThan(mIndex)
    })
  })

  describe('Data Types', () => {
    it('should handle string values correctly', () => {
      const input = '{"text":"Hello World"}'
      const result = formatter.format(input)
      expect(result).toContain('"text": "Hello World"')
    })

    it('should handle number values correctly', () => {
      const input = '{"int":42,"float":3.14,"negative":-10}'
      const result = formatter.format(input)
      expect(result).toContain('"int": 42')
      expect(result).toContain('"float": 3.14')
      expect(result).toContain('"negative": -10')
    })

    it('should handle boolean values correctly', () => {
      const input = '{"isActive":true,"isDeleted":false}'
      const result = formatter.format(input)
      expect(result).toContain('"isActive": true')
      expect(result).toContain('"isDeleted": false')
    })

    it('should handle null values correctly', () => {
      const input = '{"value":null}'
      const result = formatter.format(input)
      expect(result).toContain('"value": null')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty object', () => {
      const input = '{}'
      expect(formatter.format(input)).toBe('{}')
    })

    it('should handle empty array', () => {
      const input = '[]'
      expect(formatter.format(input)).toBe('[]')
    })

    it('should handle empty string value', () => {
      const input = '{"text":""}'
      const result = formatter.format(input)
      expect(result).toContain('"text": ""')
    })

    it('should handle special characters in strings', () => {
      const input = '{"text":"Hello\\nWorld\\t\\"Quote\\""}'
      const result = formatter.format(input)
      expect(result).toContain('Hello\\nWorld\\t\\"Quote\\"')
    })

    it('should handle Unicode characters', () => {
      const input = '{"chinese":"你好","emoji":"😀"}'
      const result = formatter.format(input)
      expect(result).toContain('"chinese": "你好"')
      expect(result).toContain('"emoji": "😀"')
    })
  })

  describe('Large Numbers (BigInt)', () => {
    it('should handle large integers without precision loss', () => {
      const input = '{"bigNumber":9007199254740992}'
      const result = formatter.format(input)
      expect(result).toContain('9007199254740992')
    })

    it('should handle very large numbers using BigInt', () => {
      const input = '{"huge":12345678901234567890}'
      const result = formatter.format(input)
      expect(result).toContain('12345678901234567890')
    })
  })

  describe('Error Handling', () => {
    it('should throw error for invalid JSON', () => {
      const input = '{invalid json}'
      expect(() => formatter.format(input)).toThrow()
    })

    it('should throw error for unclosed brackets', () => {
      const input = '{"name":"John"'
      expect(() => formatter.format(input)).toThrow()
    })

    it('should throw error for trailing comma', () => {
      const input = '{"name":"John",}'
      expect(() => formatter.format(input)).toThrow()
    })

    it('should throw error for unquoted keys', () => {
      const input = '{name:"John"}'
      expect(() => formatter.format(input)).toThrow()
    })

    it('should throw error for single quotes', () => {
      const input = "{'name':'John'}"
      expect(() => formatter.format(input)).toThrow()
    })
  })

  describe('Performance', () => {
    it('should handle deeply nested objects (100 levels)', () => {
      let nested = '{"value":1}'
      for (let i = 0; i < 100; i++) {
        nested = `{"nested":${nested}}`
      }

      expect(() => formatter.format(nested)).not.toThrow()
    })

    it('should format large array with 1000 items', () => {
      const items = Array.from({ length: 1000 }, (_, i) => i)
      const input = JSON.stringify(items)

      const start = performance.now()
      formatter.format(input)
      const duration = performance.now() - start

      expect(duration).toBeLessThan(100) // Should be < 100ms
    })
  })
})
