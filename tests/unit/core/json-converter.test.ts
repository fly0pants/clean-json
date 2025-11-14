import { describe, it, expect, beforeEach } from 'vitest'
import { JSONConverter } from '@/core/json-converter'

describe('JSONConverter', () => {
  let converter: JSONConverter

  beforeEach(() => {
    converter = new JSONConverter()
  })

  describe('String to Object Conversion', () => {
    it('should convert JSON string to object', () => {
      const input = '"{\\\"name\\\":\\\"John\\\"}"'
      const expected = '{"name":"John"}'

      const result = converter.stringToObject(input)
      expect(result).toBe(expected)
    })

    it('should handle nested escaped JSON string', () => {
      const input = '"{\\\"user\\\":{\\\"name\\\":\\\"John\\\"}}"'
      const result = converter.stringToObject(input)

      expect(result).toContain('"user"')
      expect(result).toContain('"name"')
      expect(result).toContain('"John"')
    })

    it('should handle escaped special characters', () => {
      const input = '"{\\\"text\\\":\\\"Hello\\\\nWorld\\\"}"'
      const result = converter.stringToObject(input)

      expect(result).toContain('Hello\\nWorld')
    })

    it('should handle escaped quotes', () => {
      const input = '"{\\\"quote\\\":\\\"He said \\\\\\\"Hello\\\\\\\"\\\"}"'
      const result = converter.stringToObject(input)

      expect(result).toContain('He said')
    })

    it('should handle array in string format', () => {
      const input = '"[1,2,3]"'
      const result = converter.stringToObject(input)

      expect(result).toBe('[1,2,3]')
    })

    it('should handle complex nested structure', () => {
      const input = '"{\\\"users\\\":[{\\\"name\\\":\\\"John\\\"},{\\\"name\\\":\\\"Jane\\\"}]}"'
      const result = converter.stringToObject(input)

      expect(result).toContain('"users"')
      expect(result).toContain('"John"')
      expect(result).toContain('"Jane"')
    })
  })

  describe('Object to String Conversion', () => {
    it('should convert JSON object to string', () => {
      const input = '{"name":"John"}'
      const expected = '"{\\\"name\\\":\\\"John\\\"}"'

      const result = converter.objectToString(input)
      expect(result).toBe(expected)
    })

    it('should escape all special characters', () => {
      const input = '{"text":"Hello\\nWorld"}'
      const result = converter.objectToString(input)

      expect(result).toContain('\\\\n')
    })

    it('should escape quotes correctly', () => {
      const input = '{"quote":"He said \\"Hello\\""}'
      const result = converter.objectToString(input)

      expect(result).toContain('\\\\\\"')
    })

    it('should handle nested objects', () => {
      const input = '{"user":{"name":"John","age":30}}'
      const result = converter.objectToString(input)

      expect(result).toContain('\\"user\\"')
      expect(result).toContain('\\"name\\"')
      expect(result).toContain('\\"age\\"')
    })

    it('should handle arrays', () => {
      const input = '{"numbers":[1,2,3]}'
      const result = converter.objectToString(input)

      expect(result).toContain('[1,2,3]')
    })

    it('should handle all data types', () => {
      const input = '{"string":"text","number":42,"bool":true,"null":null}'
      const result = converter.objectToString(input)

      expect(result).toContain('\\"string\\"')
      expect(result).toContain('\\"number\\"')
      expect(result).toContain('\\"bool\\"')
      expect(result).toContain('\\"null\\"')
    })
  })

  describe('Auto Detection', () => {
    it('should detect input as normal JSON object', () => {
      const input = '{"name":"John"}'
      const type = converter.detectType(input)

      expect(type).toBe('object')
    })

    it('should detect input as JSON string', () => {
      const input = '"{\\\"name\\\":\\\"John\\\"}"'
      const type = converter.detectType(input)

      expect(type).toBe('string')
    })

    it('should detect array as object type', () => {
      const input = '[1,2,3]'
      const type = converter.detectType(input)

      expect(type).toBe('object')
    })

    it('should detect stringified array', () => {
      const input = '"[1,2,3]"'
      const type = converter.detectType(input)

      expect(type).toBe('string')
    })
  })

  describe('Auto Conversion', () => {
    it('should auto-convert based on input type', () => {
      const stringInput = '"{\\\"name\\\":\\\"John\\\"}"'
      const result1 = converter.autoConvert(stringInput)

      expect(result1.type).toBe('string-to-object')
      expect(result1.output).toBe('{"name":"John"}')
    })

    it('should auto-convert object to string', () => {
      const objectInput = '{"name":"John"}'
      const result = converter.autoConvert(objectInput)

      expect(result.type).toBe('object-to-string')
      expect(result.output).toBe('"{\\\"name\\\":\\\"John\\\"}"')
    })
  })

  describe('Double Parsing', () => {
    it('should handle double-parsed JSON', () => {
      const input = '"{\\\"name\\\":\\\"John\\\"}"'

      // First parse
      const parsed1 = JSON.parse(input)
      expect(typeof parsed1).toBe('string')

      // Second parse
      const parsed2 = JSON.parse(parsed1)
      expect(parsed2).toEqual({ name: 'John' })
    })

    it('should detect double-stringified JSON', () => {
      const original = { name: 'John' }
      const stringified1 = JSON.stringify(original)
      const stringified2 = JSON.stringify(stringified1)

      const type = converter.detectType(stringified2)
      expect(type).toBe('string')

      const converted = converter.stringToObject(stringified2)
      expect(JSON.parse(converted)).toEqual(original)
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty object', () => {
      const input = '{}'
      const result = converter.objectToString(input)

      expect(result).toBe('"{}"')
    })

    it('should handle empty array', () => {
      const input = '[]'
      const result = converter.objectToString(input)

      expect(result).toBe('"[]"')
    })

    it('should handle empty string value', () => {
      const input = '{"text":""}'
      const result = converter.objectToString(input)

      expect(result).toContain('\\"text\\"')
      expect(result).toContain('\\"\\"')
    })

    it('should handle Unicode characters', () => {
      const input = '{"chinese":"你好","emoji":"😀"}'
      const result = converter.objectToString(input)

      expect(result).toContain('你好')
      expect(result).toContain('😀')
    })

    it('should handle backslashes', () => {
      const input = '{"path":"C:\\\\\\\\Users\\\\\\\\John"}'
      const result = converter.objectToString(input)

      expect(result).toContain('\\\\\\\\')
    })
  })

  describe('Error Handling', () => {
    it('should throw error for invalid JSON string', () => {
      const input = '"{invalid}"'

      expect(() => converter.stringToObject(input)).toThrow()
    })

    it('should throw error for malformed input', () => {
      const input = 'not a json'

      expect(() => converter.objectToString(input)).toThrow()
    })

    it('should throw error for unclosed brackets', () => {
      const input = '{"name":"John"'

      expect(() => converter.objectToString(input)).toThrow()
    })
  })

  describe('Roundtrip Conversion', () => {
    it('should preserve data through object -> string -> object', () => {
      const original = '{"name":"John","age":30}'

      const stringified = converter.objectToString(original)
      const backToObject = converter.stringToObject(stringified)

      expect(backToObject).toBe(original)
    })

    it('should preserve data through string -> object -> string', () => {
      const original = '"{\\\"name\\\":\\\"John\\\"}"'

      const toObject = converter.stringToObject(original)
      const backToString = converter.objectToString(toObject)

      expect(backToString).toBe(original)
    })

    it('should preserve complex nested structure', () => {
      const original = '{"users":[{"name":"John"},{"name":"Jane"}],"count":2}'

      const stringified = converter.objectToString(original)
      const backToObject = converter.stringToObject(stringified)

      expect(JSON.parse(backToObject)).toEqual(JSON.parse(original))
    })
  })
})
