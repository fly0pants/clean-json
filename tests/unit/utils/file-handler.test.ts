import { describe, it, expect, beforeEach, vi } from 'vitest'
import { FileHandler } from '@/utils/file-handler'

describe('FileHandler', () => {
  let fileHandler: FileHandler

  beforeEach(() => {
    fileHandler = new FileHandler()

    // Mock URL.createObjectURL and URL.revokeObjectURL if not available
    if (!URL.createObjectURL) {
      URL.createObjectURL = vi.fn(() => 'blob:mock-url')
    }
    if (!URL.revokeObjectURL) {
      URL.revokeObjectURL = vi.fn()
    }
  })

  describe('readFile', () => {
    it('should read file content as text', async () => {
      const content = '{"name":"John"}'
      const file = new File([content], 'test.json', { type: 'application/json' })

      const result = await fileHandler.readFile(file)
      expect(result).toBe(content)
    })

    it('should read empty file', async () => {
      const file = new File([''], 'empty.json', { type: 'application/json' })

      const result = await fileHandler.readFile(file)
      expect(result).toBe('')
    })

    it('should read file with UTF-8 characters', async () => {
      const content = '{"message":"你好世界","emoji":"😀"}'
      const file = new File([content], 'unicode.json', { type: 'application/json' })

      const result = await fileHandler.readFile(file)
      expect(result).toBe(content)
    })

    it('should handle large files', async () => {
      const largeContent = '{"data":"' + 'x'.repeat(10000) + '"}'
      const file = new File([largeContent], 'large.json', { type: 'application/json' })

      const result = await fileHandler.readFile(file)
      expect(result).toBe(largeContent)
    })

    it('should throw error if file reading fails', async () => {
      // Create a mock file that will fail to read
      const mockFile = {
        name: 'fail.json',
        type: 'application/json',
      } as File

      // Mock FileReader to trigger error
      const originalFileReader = global.FileReader
      global.FileReader = class {
        readAsText() {
          setTimeout(() => {
            if (this.onerror) {
              this.onerror(new Error('Read failed') as any)
            }
          }, 0)
        }
      } as any

      await expect(fileHandler.readFile(mockFile)).rejects.toThrow()

      // Restore original FileReader
      global.FileReader = originalFileReader
    })
  })

  describe('downloadFile', () => {
    it('should trigger file download with correct content and filename', () => {
      const content = '{"name":"John"}'
      const filename = 'test.json'

      // Create real link element but spy on methods
      const realLink = document.createElement('a')
      const createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(realLink)
      const clickSpy = vi.spyOn(realLink, 'click').mockImplementation(() => {})
      const createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url')
      const revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})

      fileHandler.downloadFile(content, filename)

      expect(createElementSpy).toHaveBeenCalledWith('a')
      expect(createObjectURLSpy).toHaveBeenCalled()
      expect(realLink.download).toBe(filename)
      expect(clickSpy).toHaveBeenCalled()
      expect(revokeObjectURLSpy).toHaveBeenCalled()

      createElementSpy.mockRestore()
      clickSpy.mockRestore()
      createObjectURLSpy.mockRestore()
      revokeObjectURLSpy.mockRestore()
    })

    it('should use default filename if not provided', () => {
      const content = '{"name":"John"}'

      const realLink = document.createElement('a')
      const createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(realLink)
      const clickSpy = vi.spyOn(realLink, 'click').mockImplementation(() => {})
      const createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url')
      const revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})

      fileHandler.downloadFile(content)

      expect(realLink.download).toBe('data.json')

      createElementSpy.mockRestore()
      clickSpy.mockRestore()
      createObjectURLSpy.mockRestore()
      revokeObjectURLSpy.mockRestore()
    })

    it('should handle empty content', () => {
      const realLink = document.createElement('a')
      const createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(realLink)
      const clickSpy = vi.spyOn(realLink, 'click').mockImplementation(() => {})
      const createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url')
      const revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})

      fileHandler.downloadFile('')

      expect(clickSpy).toHaveBeenCalled()

      createElementSpy.mockRestore()
      clickSpy.mockRestore()
      createObjectURLSpy.mockRestore()
      revokeObjectURLSpy.mockRestore()
    })

    it('should handle large content', () => {
      const largeContent = '{"data":"' + 'x'.repeat(100000) + '"}'

      const realLink = document.createElement('a')
      const createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(realLink)
      const clickSpy = vi.spyOn(realLink, 'click').mockImplementation(() => {})
      const createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url')
      const revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})

      fileHandler.downloadFile(largeContent, 'large.json')

      expect(clickSpy).toHaveBeenCalled()

      createElementSpy.mockRestore()
      clickSpy.mockRestore()
      createObjectURLSpy.mockRestore()
      revokeObjectURLSpy.mockRestore()
    })

    it('should create blob with correct MIME type', () => {
      const content = '{"name":"John"}'

      const realLink = document.createElement('a')
      const createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(realLink)
      const clickSpy = vi.spyOn(realLink, 'click').mockImplementation(() => {})
      const createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockImplementation((blob: Blob) => {
        expect(blob.type).toBe('application/json')
        return 'blob:mock-url'
      })
      const revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})

      fileHandler.downloadFile(content, 'test.json')

      createElementSpy.mockRestore()
      clickSpy.mockRestore()
      createObjectURLSpy.mockRestore()
      revokeObjectURLSpy.mockRestore()
    })
  })

  describe('Edge Cases', () => {
    it('should handle file with special characters in filename', async () => {
      const content = '{"test":true}'
      const file = new File([content], '测试-文件.json', { type: 'application/json' })

      const result = await fileHandler.readFile(file)
      expect(result).toBe(content)
    })

    it('should handle different file extensions', async () => {
      const content = '{"test":true}'
      const file = new File([content], 'data.txt', { type: 'text/plain' })

      const result = await fileHandler.readFile(file)
      expect(result).toBe(content)
    })
  })
})
