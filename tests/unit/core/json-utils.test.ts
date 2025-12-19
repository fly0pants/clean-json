import { describe, it, expect } from 'vitest'
import { 
  UnicodeConverter, 
  CommentRemover, 
  JSONToXMLConverter, 
  JSONToCSVConverter,
  JSONPathHelper 
} from '@/core/json-utils'

describe('UnicodeConverter', () => {
  const converter = new UnicodeConverter()

  describe('toUnicode', () => {
    it('should convert Chinese characters to unicode escape', () => {
      const input = '{"name": "你好"}'
      const result = converter.toUnicode(input)
      expect(result).toContain('\\u4f60')
      expect(result).toContain('\\u597d')
    })

    it('should keep ASCII characters unchanged', () => {
      const input = '{"name": "hello"}'
      const result = converter.toUnicode(input)
      expect(result).toContain('hello')
    })

    it('should handle mixed content', () => {
      const input = '{"greeting": "Hello 世界"}'
      const result = converter.toUnicode(input)
      expect(result).toContain('Hello')
      expect(result).toContain('\\u4e16')
      expect(result).toContain('\\u754c')
    })

    it('should throw on invalid JSON', () => {
      expect(() => converter.toUnicode('invalid')).toThrow()
    })
  })

  describe('fromUnicode', () => {
    it('should convert unicode escape back to characters', () => {
      const input = '{"name": "\\u4f60\\u597d"}'
      const result = converter.fromUnicode(input)
      expect(result).toContain('你好')
    })

    it('should handle already decoded content', () => {
      const input = '{"name": "hello"}'
      const result = converter.fromUnicode(input)
      expect(result).toContain('hello')
    })
  })
})

describe('CommentRemover', () => {
  const remover = new CommentRemover()

  describe('removeComments', () => {
    it('should remove single line comments', () => {
      const input = `{
        // this is a comment
        "name": "test"
      }`
      const result = remover.removeComments(input)
      const parsed = JSON.parse(result)
      expect(parsed.name).toBe('test')
      expect(result).not.toContain('//')
    })

    it('should remove block comments', () => {
      const input = `{
        /* this is a
           block comment */
        "name": "test"
      }`
      const result = remover.removeComments(input)
      const parsed = JSON.parse(result)
      expect(parsed.name).toBe('test')
      expect(result).not.toContain('/*')
      expect(result).not.toContain('*/')
    })

    it('should not remove comment-like strings in values', () => {
      const input = '{"url": "http://example.com"}'
      const result = remover.removeComments(input)
      const parsed = JSON.parse(result)
      expect(parsed.url).toBe('http://example.com')
    })

    it('should handle multiple comments', () => {
      const input = `{
        // comment 1
        "a": 1, // inline comment
        /* block */ "b": 2
      }`
      const result = remover.removeComments(input)
      const parsed = JSON.parse(result)
      expect(parsed.a).toBe(1)
      expect(parsed.b).toBe(2)
    })
  })
})

describe('JSONToXMLConverter', () => {
  const converter = new JSONToXMLConverter()

  describe('convert', () => {
    it('should convert simple object to XML', () => {
      const input = '{"name": "John", "age": 30}'
      const result = converter.convert(input)
      expect(result).toContain('<?xml version="1.0" encoding="UTF-8"?>')
      expect(result).toContain('<root>')
      expect(result).toContain('<name>John</name>')
      expect(result).toContain('<age>30</age>')
      expect(result).toContain('</root>')
    })

    it('should handle nested objects', () => {
      const input = '{"person": {"name": "John"}}'
      const result = converter.convert(input)
      expect(result).toContain('<person>')
      expect(result).toContain('<name>John</name>')
      expect(result).toContain('</person>')
    })

    it('should handle arrays', () => {
      const input = '{"items": [1, 2, 3]}'
      const result = converter.convert(input)
      expect(result).toContain('<items>')
      expect(result).toContain('<item>1</item>')
      expect(result).toContain('<item>2</item>')
      expect(result).toContain('<item>3</item>')
      expect(result).toContain('</items>')
    })

    it('should escape special XML characters', () => {
      const input = '{"text": "<script>alert(1)</script>"}'
      const result = converter.convert(input)
      expect(result).toContain('&lt;script&gt;')
      expect(result).not.toContain('<script>')
    })

    it('should handle null values', () => {
      const input = '{"value": null}'
      const result = converter.convert(input)
      expect(result).toContain('<value></value>')
    })

    it('should use custom root name', () => {
      const input = '{"name": "John"}'
      const result = converter.convert(input, 'data')
      expect(result).toContain('<data>')
      expect(result).toContain('</data>')
    })
  })
})

describe('JSONToCSVConverter', () => {
  const converter = new JSONToCSVConverter()

  describe('convert', () => {
    it('should convert array of objects to CSV', () => {
      const input = '[{"name": "John", "age": 30}, {"name": "Jane", "age": 25}]'
      const result = converter.convert(input)
      const lines = result.split('\n')
      expect(lines[0]).toContain('name')
      expect(lines[0]).toContain('age')
      expect(lines[1]).toContain('John')
      expect(lines[1]).toContain('30')
      expect(lines[2]).toContain('Jane')
      expect(lines[2]).toContain('25')
    })

    it('should handle single object', () => {
      const input = '{"name": "John", "age": 30}'
      const result = converter.convert(input)
      const lines = result.split('\n')
      expect(lines[0]).toContain('name')
      expect(lines[0]).toContain('age')
      expect(lines[1]).toContain('John')
      expect(lines[1]).toContain('30')
    })

    it('should escape values with commas', () => {
      const input = '[{"name": "Doe, John"}]'
      const result = converter.convert(input)
      expect(result).toContain('"Doe, John"')
    })

    it('should escape values with quotes', () => {
      const input = '[{"name": "John \\"Jack\\" Doe"}]'
      const result = converter.convert(input)
      expect(result).toContain('""')
    })

    it('should handle array of primitives', () => {
      const input = '[1, 2, 3, 4, 5]'
      const result = converter.convert(input)
      const lines = result.split('\n')
      expect(lines).toHaveLength(5)
      expect(lines[0]).toBe('1')
    })

    it('should handle empty array', () => {
      const input = '[]'
      const result = converter.convert(input)
      expect(result).toBe('')
    })

    it('should handle objects with missing keys', () => {
      const input = '[{"a": 1}, {"b": 2}, {"a": 3, "b": 4}]'
      const result = converter.convert(input)
      const lines = result.split('\n')
      expect(lines[0]).toContain('a')
      expect(lines[0]).toContain('b')
    })
  })
})

describe('JSONPathHelper', () => {
  const helper = new JSONPathHelper()

  describe('getAllPaths', () => {
    it('should return all paths in simple object', () => {
      const input = '{"name": "John", "age": 30}'
      const paths = helper.getAllPaths(input)
      expect(paths).toContain('$')
      expect(paths).toContain('$.name')
      expect(paths).toContain('$.age')
    })

    it('should handle nested objects', () => {
      const input = '{"person": {"name": "John"}}'
      const paths = helper.getAllPaths(input)
      expect(paths).toContain('$.person')
      expect(paths).toContain('$.person.name')
    })

    it('should handle arrays', () => {
      const input = '{"items": [1, 2, 3]}'
      const paths = helper.getAllPaths(input)
      expect(paths).toContain('$.items')
      expect(paths).toContain('$.items[0]')
      expect(paths).toContain('$.items[1]')
      expect(paths).toContain('$.items[2]')
    })
  })

  describe('getValueAtPath', () => {
    it('should get value at simple path', () => {
      const input = '{"name": "John", "age": 30}'
      expect(helper.getValueAtPath(input, '$.name')).toBe('John')
      expect(helper.getValueAtPath(input, '$.age')).toBe(30)
    })

    it('should get value at nested path', () => {
      const input = '{"person": {"name": "John"}}'
      expect(helper.getValueAtPath(input, '$.person.name')).toBe('John')
    })

    it('should get value at array index', () => {
      const input = '{"items": [1, 2, 3]}'
      expect(helper.getValueAtPath(input, '$.items[0]')).toBe(1)
      expect(helper.getValueAtPath(input, '$.items[2]')).toBe(3)
    })

    it('should return root for $ path', () => {
      const input = '{"name": "John"}'
      const result = helper.getValueAtPath(input, '$')
      expect(result).toEqual({ name: 'John' })
    })
  })
})
