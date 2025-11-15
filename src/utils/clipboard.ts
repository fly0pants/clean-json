/**
 * Clipboard Utility
 * Handles clipboard operations with fallback support
 */
export class Clipboard {
  /**
   * Copy text to clipboard
   */
  async copy(text: string): Promise<boolean> {
    try {
      // Try modern Clipboard API first
      if (this.isSupported()) {
        await navigator.clipboard.writeText(text)
        return true
      }

      // Fallback to legacy method
      return this.legacyCopy(text)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      return false
    }
  }

  /**
   * Read text from clipboard
   */
  async read(): Promise<string> {
    try {
      if (this.isSupported()) {
        return await navigator.clipboard.readText()
      }

      // Cannot read from clipboard using legacy method
      return ''
    } catch (error) {
      console.error('Failed to read from clipboard:', error)
      return ''
    }
  }

  /**
   * Check if Clipboard API is supported
   */
  isSupported(): boolean {
    return (
      typeof navigator !== 'undefined' &&
      navigator.clipboard !== undefined &&
      navigator.clipboard.writeText !== undefined
    )
  }

  /**
   * Legacy copy method using document.execCommand
   */
  private legacyCopy(text: string): boolean {
    try {
      // Create temporary textarea
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'

      document.body.appendChild(textarea)

      // Select and copy
      textarea.select()
      const success = document.execCommand('copy')

      // Clean up
      document.body.removeChild(textarea)

      return success
    } catch (error) {
      console.error('Failed to copy using legacy method:', error)
      return false
    }
  }
}
