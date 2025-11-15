import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Clipboard } from '@/utils/clipboard'

describe('Clipboard', () => {
  let clipboard: Clipboard

  beforeEach(() => {
    clipboard = new Clipboard()

    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
        readText: vi.fn().mockResolvedValue(''),
      },
    })
  })

  describe('Copy to Clipboard', () => {
    it('should copy text to clipboard', async () => {
      const text = '{"name":"John"}'

      await clipboard.copy(text)

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(text)
    })

    it('should copy empty string', async () => {
      const text = ''

      await clipboard.copy(text)

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(text)
    })

    it('should copy Unicode text', async () => {
      const text = '{"chinese":"你好","emoji":"😀"}'

      await clipboard.copy(text)

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(text)
    })

    it('should copy large text', async () => {
      const text = '{"data":"' + 'x'.repeat(10000) + '"}'

      await clipboard.copy(text)

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(text)
    })

    it('should return true on successful copy', async () => {
      const text = '{"name":"John"}'

      const result = await clipboard.copy(text)

      expect(result).toBe(true)
    })

    it('should return false on copy error', async () => {
      navigator.clipboard.writeText = vi.fn().mockRejectedValue(new Error('Permission denied'))

      const result = await clipboard.copy('test')

      expect(result).toBe(false)
    })
  })

  describe('Read from Clipboard', () => {
    it('should read text from clipboard', async () => {
      const expectedText = '{"name":"John"}'
      navigator.clipboard.readText = vi.fn().mockResolvedValue(expectedText)

      const result = await clipboard.read()

      expect(result).toBe(expectedText)
      expect(navigator.clipboard.readText).toHaveBeenCalled()
    })

    it('should return empty string if clipboard is empty', async () => {
      navigator.clipboard.readText = vi.fn().mockResolvedValue('')

      const result = await clipboard.read()

      expect(result).toBe('')
    })

    it('should handle read error', async () => {
      navigator.clipboard.readText = vi.fn().mockRejectedValue(new Error('Permission denied'))

      const result = await clipboard.read()

      expect(result).toBe('')
    })
  })

  describe('Check Clipboard API Support', () => {
    it('should return true if clipboard API is supported', () => {
      const isSupported = clipboard.isSupported()

      expect(isSupported).toBe(true)
    })

    it('should return false if clipboard API is not supported', () => {
      // @ts-ignore
      delete navigator.clipboard

      const isSupported = clipboard.isSupported()

      expect(isSupported).toBe(false)
    })
  })

  describe('Fallback Copy (Legacy)', () => {
    it('should use fallback method when clipboard API is unavailable', async () => {
      // @ts-ignore
      delete navigator.clipboard

      // Mock document.execCommand
      document.execCommand = vi.fn().mockReturnValue(true)

      const result = await clipboard.copy('test')

      expect(document.execCommand).toHaveBeenCalledWith('copy')
      expect(result).toBe(true)
    })

    it('should create temporary textarea for fallback', async () => {
      // @ts-ignore
      delete navigator.clipboard

      document.execCommand = vi.fn().mockReturnValue(true)

      const text = '{"name":"John"}'
      await clipboard.copy(text)

      // Should have created and removed a textarea
      expect(document.execCommand).toHaveBeenCalled()
    })
  })
})
