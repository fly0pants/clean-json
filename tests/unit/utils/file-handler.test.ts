import { describe, it, expect, vi, beforeEach } from 'vitest'
import { FileHandler } from '@/utils/file-handler'
import * as FileSaver from 'file-saver'

// Mock file-saver
vi.mock('file-saver', () => ({
  saveAs: vi.fn(),
}))

describe('FileHandler', () => {
  let fileHandler: FileHandler

  beforeEach(() => {
    fileHandler = new FileHandler()
    vi.clearAllMocks()
  })

  describe('Read File', () => {
    it('should read file content as text', async () => {
      const content = '{"name":"John"}'
      const file = new File([content], 'test.json', { type: 'application/json' })

      const result = await fileHandler.readFile(file)

      expect(result).toBe(content)
    })

    it('should read file with UTF-8 encoding', async () => {
      const content = '{"chinese":"你好","emoji":"😀"}'
      const file = new File([content], 'test.json', { type: 'application/json' })

      const result = await fileHandler.readFile(file)

      expect(result).toBe(content)
    })

    it('should handle empty file', async () => {
      const file = new File([''], 'empty.json', { type: 'application/json' })

      const result = await fileHandler.readFile(file)

      expect(result).toBe('')
    })

    it('should handle large file', async () => {
      const largeContent = '{"data":"' + 'x'.repeat(10000) + '"}'
      const file = new File([largeContent], 'large.json', { type: 'application/json' })

      const result = await fileHandler.readFile(file)

      expect(result).toBe(largeContent)
    })
  })

  describe('Download File', () => {
    it('should download JSON as file', () => {
      const content = '{"name":"John"}'
      const filename = 'data.json'

      fileHandler.downloadJSON(content, filename)

      expect(FileSaver.saveAs).toHaveBeenCalledWith(
        expect.any(Blob),
        filename
      )
    })

    it('should create Blob with correct content', () => {
      const content = '{"name":"John"}'
      const filename = 'test.json'

      fileHandler.downloadJSON(content, filename)

      const callArgs = (FileSaver.saveAs as any).mock.calls[0]
      const blob = callArgs[0] as Blob

      expect(blob.type).toBe('application/json')
      expect(blob.size).toBeGreaterThan(0)
    })

    it('should use default filename if not provided', () => {
      const content = '{"name":"John"}'

      fileHandler.downloadJSON(content)

      expect(FileSaver.saveAs).toHaveBeenCalledWith(
        expect.any(Blob),
        'data.json'
      )
    })

    it('should handle Unicode content in download', () => {
      const content = '{"chinese":"你好"}'
      const filename = 'unicode.json'

      fileHandler.downloadJSON(content, filename)

      expect(FileSaver.saveAs).toHaveBeenCalledWith(
        expect.any(Blob),
        filename
      )
    })

    it('should handle empty content', () => {
      const content = ''
      const filename = 'empty.json'

      fileHandler.downloadJSON(content, filename)

      expect(FileSaver.saveAs).toHaveBeenCalledWith(
        expect.any(Blob),
        filename
      )
    })
  })

  describe('Load from URL', () => {
    it('should fetch JSON from URL', async () => {
      const mockData = { name: 'John' }
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockData,
      })

      const result = await fileHandler.loadFromURL('https://example.com/data.json')

      expect(result).toEqual(JSON.stringify(mockData))
    })

    it('should handle fetch error', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
      })

      await expect(
        fileHandler.loadFromURL('https://example.com/not-found.json')
      ).rejects.toThrow()
    })

    it('should handle network error', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

      await expect(
        fileHandler.loadFromURL('https://example.com/data.json')
      ).rejects.toThrow('Network error')
    })
  })

  describe('Validate File', () => {
    it('should validate JSON file type', () => {
      const file = new File(['{}'], 'test.json', { type: 'application/json' })

      const isValid = fileHandler.isValidJSONFile(file)

      expect(isValid).toBe(true)
    })

    it('should accept .json extension', () => {
      const file = new File(['{}'], 'test.json', { type: 'text/plain' })

      const isValid = fileHandler.isValidJSONFile(file)

      expect(isValid).toBe(true)
    })

    it('should reject non-JSON file type', () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' })

      const isValid = fileHandler.isValidJSONFile(file)

      expect(isValid).toBe(false)
    })

    it('should reject file without extension', () => {
      const file = new File(['{}'], 'test', { type: 'application/octet-stream' })

      const isValid = fileHandler.isValidJSONFile(file)

      expect(isValid).toBe(false)
    })
  })

  describe('Get File Size', () => {
    it('should return file size in bytes', () => {
      const content = '{"name":"John"}'
      const file = new File([content], 'test.json')

      const size = fileHandler.getFileSize(file)

      expect(size).toBe(file.size)
    })

    it('should format file size to human readable', () => {
      const size1KB = 1024
      const size1MB = 1024 * 1024
      const size1GB = 1024 * 1024 * 1024

      expect(fileHandler.formatFileSize(size1KB)).toBe('1.00 KB')
      expect(fileHandler.formatFileSize(size1MB)).toBe('1.00 MB')
      expect(fileHandler.formatFileSize(size1GB)).toBe('1.00 GB')
    })

    it('should format bytes correctly', () => {
      expect(fileHandler.formatFileSize(0)).toBe('0 Bytes')
      expect(fileHandler.formatFileSize(500)).toBe('500 Bytes')
      expect(fileHandler.formatFileSize(1023)).toBe('1023 Bytes')
    })
  })
})
