import { describe, it, expect, beforeEach } from 'vitest'
import { JSONCompressor } from '@/core/json-compressor'

describe('JSONCompressor', () => {
  let compressor: JSONCompressor

  beforeEach(() => {
    compressor = new JSONCompressor()
  })

  describe('Basic Compression', () => {
    it('should remove all whitespace', () => {
      const input = `{
  "name": "John",
  "age": 30
}`
      const expected = '{"name":"John","age":30}'

      expect(compressor.compress(input)).toBe(expected)
    })

    it('should remove all newlines', () => {
      const input = '{\n"name":\n"John"\n}'
      const compressed = compressor.compress(input)

      expect(compressed).not.toContain('\n')
      expect(compressed).toBe('{"name":"John"}')
    })

    it('should remove all tabs', () => {
      const input = '{\t"name":\t"John"\t}'
      const compressed = compressor.compress(input)

      expect(compressed).not.toContain('\t')
      expect(compressed).toBe('{"name":"John"}')
    })

    it('should remove spaces around colons', () => {
      const input = '{ "name" : "John" }'
      const compressed = compressor.compress(input)

      expect(compressed).toBe('{"name":"John"}')
    })

    it('should remove spaces around commas', () => {
      const input = '{"name":"John" , "age":30}'
      const compressed = compressor.compress(input)

      expect(compressed).toBe('{"name":"John","age":30}')
    })

    it('should compress array', () => {
      const input = `[
  1,
  2,
  3
]`
      const compressed = compressor.compress(input)

      expect(compressed).toBe('[1,2,3]')
    })

    it('should compress nested structures', () => {
      const input = `{
  "user": {
    "name": "John",
    "address": {
      "city": "NYC"
    }
  }
}`
      const compressed = compressor.compress(input)

      expect(compressed).toBe('{"user":{"name":"John","address":{"city":"NYC"}}}')
    })
  })

  describe('Compression Statistics', () => {
    it('should calculate original size in bytes', () => {
      const input = '{"name":"John"}'
      const compressed = compressor.compress(input)
      const stats = compressor.getStats(input, compressed)

      expect(stats.originalSize).toBeGreaterThan(0)
      expect(stats.originalSize).toBe(new Blob([input]).size)
    })

    it('should calculate compressed size', () => {
      const input = `{
  "name": "John"
}`
      const compressed = compressor.compress(input)
      const stats = compressor.getStats(input, compressed)

      expect(stats.compressedSize).toBeLessThan(stats.originalSize)
      expect(stats.compressedSize).toBe(new Blob([compressed]).size)
    })

    it('should calculate compression ratio as percentage', () => {
      const input = `{
  "name": "John",
  "age": 30
}`
      const compressed = compressor.compress(input)
      const stats = compressor.getStats(input, compressed)

      expect(stats.ratio).toMatch(/^\d+\.\d+$/)
      const ratio = parseFloat(stats.ratio)
      expect(ratio).toBeGreaterThan(0)
      expect(ratio).toBeLessThan(100)
    })

    it('should calculate bytes saved', () => {
      const input = '{\n  "name": "John"\n}'
      const compressed = compressor.compress(input)
      const stats = compressor.getStats(input, compressed)

      expect(stats.saved).toBe(stats.originalSize - stats.compressedSize)
      expect(stats.saved).toBeGreaterThan(0)
    })

    it('should show higher compression ratio for heavily formatted JSON', () => {
      const input = `{
  "users": [
    {
      "name": "John",
      "age": 30
    },
    {
      "name": "Jane",
      "age": 25
    }
  ]
}`
      const compressed = compressor.compress(input)
      const stats = compressor.getStats(input, compressed)

      const ratio = parseFloat(stats.ratio)
      expect(ratio).toBeGreaterThan(30) // At least 30% compression
    })
  })

  describe('Preserve String Content', () => {
    it('should preserve whitespace inside strings', () => {
      const input = '{"text":"Hello World"}'
      const compressed = compressor.compress(input)

      expect(compressed).toContain('Hello World')
      expect(compressed).toBe('{"text":"Hello World"}')
    })

    it('should preserve newlines in string values', () => {
      const input = '{"text":"Hello\\nWorld"}'
      const compressed = compressor.compress(input)

      expect(compressed).toContain('Hello\\nWorld')
    })

    it('should preserve tabs in string values', () => {
      const input = '{"text":"Hello\\tWorld"}'
      const compressed = compressor.compress(input)

      expect(compressed).toContain('Hello\\tWorld')
    })

    it('should preserve multiple spaces in strings', () => {
      const input = '{"text":"Hello     World"}'
      const compressed = compressor.compress(input)

      expect(compressed).toContain('Hello     World')
    })
  })

  describe('Edge Cases', () => {
    it('should return same result for already compressed JSON', () => {
      const input = '{"name":"John","age":30}'
      const compressed = compressor.compress(input)

      expect(compressed).toBe(input)
    })

    it('should compress empty object', () => {
      const input = '{\n\n}'
      const compressed = compressor.compress(input)

      expect(compressed).toBe('{}')
    })

    it('should compress empty array', () => {
      const input = '[\n\n]'
      const compressed = compressor.compress(input)

      expect(compressed).toBe('[]')
    })

    it('should handle empty string value', () => {
      const input = '{"text":""}'
      const compressed = compressor.compress(input)

      expect(compressed).toBe('{"text":""}')
    })

    it('should handle object with single property', () => {
      const input = `{
  "name": "John"
}`
      const compressed = compressor.compress(input)

      expect(compressed).toBe('{"name":"John"}')
    })
  })

  describe('Data Types', () => {
    it('should compress all data types correctly', () => {
      const input = `{
  "string": "text",
  "number": 42,
  "float": 3.14,
  "boolean": true,
  "null": null,
  "array": [1, 2, 3],
  "object": {"nested": true}
}`
      const compressed = compressor.compress(input)

      expect(compressed).toBe('{"string":"text","number":42,"float":3.14,"boolean":true,"null":null,"array":[1,2,3],"object":{"nested":true}}')
    })

    it('should handle negative numbers', () => {
      const input = '{"number": -10}'
      const compressed = compressor.compress(input)

      expect(compressed).toBe('{"number":-10}')
    })

    it('should handle scientific notation', () => {
      const input = '{"number": 1.5e10}'
      const compressed = compressor.compress(input)

      expect(compressed).toContain('1.5e')
    })
  })

  describe('Complex Structures', () => {
    it('should compress deeply nested object', () => {
      const input = `{
  "level1": {
    "level2": {
      "level3": {
        "value": "deep"
      }
    }
  }
}`
      const compressed = compressor.compress(input)

      expect(compressed).toBe('{"level1":{"level2":{"level3":{"value":"deep"}}}}')
    })

    it('should compress array of objects', () => {
      const input = `[
  {
    "name": "John"
  },
  {
    "name": "Jane"
  }
]`
      const compressed = compressor.compress(input)

      expect(compressed).toBe('[{"name":"John"},{"name":"Jane"}]')
    })

    it('should compress mixed nested structure', () => {
      const input = `{
  "users": [
    {
      "name": "John",
      "roles": ["admin", "user"]
    }
  ],
  "count": 1
}`
      const compressed = compressor.compress(input)

      expect(compressed).toBe('{"users":[{"name":"John","roles":["admin","user"]}],"count":1}')
    })
  })

  describe('Unicode and Special Characters', () => {
    it('should handle Unicode characters', () => {
      const input = '{"chinese":"你好","emoji":"😀"}'
      const compressed = compressor.compress(input)

      expect(compressed).toContain('你好')
      expect(compressed).toContain('😀')
    })

    it('should handle escaped characters', () => {
      const input = '{"text":"Hello\\nWorld\\t\\"Quote\\""}'
      const compressed = compressor.compress(input)

      expect(compressed).toContain('Hello\\nWorld\\t\\"Quote\\"')
    })

    it('should handle backslashes', () => {
      const input = '{"path":"C:\\\\\\\\Users"}'
      const compressed = compressor.compress(input)

      expect(compressed).toContain('C:\\\\\\\\Users')
    })
  })

  describe('Performance', () => {
    it('should compress large JSON quickly', () => {
      const largeObject = {
        users: Array.from({ length: 100 }, (_, i) => ({
          id: i,
          name: `User ${i}`,
          email: `user${i}@example.com`
        }))
      }
      const input = JSON.stringify(largeObject, null, 2)

      const start = performance.now()
      compressor.compress(input)
      const duration = performance.now() - start

      expect(duration).toBeLessThan(50) // Should be < 50ms
    })

    it('should handle very deep nesting', () => {
      let nested = '{"value":1}'
      for (let i = 0; i < 100; i++) {
        nested = `{"nested":${nested}}`
      }

      const formatted = JSON.stringify(JSON.parse(nested), null, 2)
      const compressed = compressor.compress(formatted)

      expect(compressed).toBe(nested)
    })
  })

  describe('Error Handling', () => {
    it('should throw error for invalid JSON', () => {
      const input = '{invalid json}'

      expect(() => compressor.compress(input)).toThrow()
    })

    it('should throw error for unclosed brackets', () => {
      const input = '{"name":"John"'

      expect(() => compressor.compress(input)).toThrow()
    })
  })
})
