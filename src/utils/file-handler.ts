import { saveAs } from 'file-saver'

/**
 * File Handler
 * Handles file upload, download, and URL loading
 */
export class FileHandler {
  /**
   * Read file content as text
   */
  async readFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (event) => {
        const content = event.target?.result as string
        resolve(content)
      }

      reader.onerror = () => {
        reject(new Error('Failed to read file'))
      }

      reader.readAsText(file)
    })
  }

  /**
   * Download JSON as file
   */
  downloadJSON(content: string, filename: string = 'data.json'): void {
    const blob = new Blob([content], { type: 'application/json' })
    saveAs(blob, filename)
  }

  /**
   * Load JSON from URL
   */
  async loadFromURL(url: string): Promise<string> {
    try {
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return JSON.stringify(data)
    } catch (error: any) {
      throw new Error(`Failed to load from URL: ${error.message}`)
    }
  }

  /**
   * Validate if file is a JSON file
   */
  isValidJSONFile(file: File): boolean {
    // Check file extension
    const hasJSONExtension = file.name.toLowerCase().endsWith('.json')

    // Check MIME type
    const hasJSONMimeType = file.type === 'application/json'

    return hasJSONExtension || hasJSONMimeType
  }

  /**
   * Get file size in bytes
   */
  getFileSize(file: File): number {
    return file.size
  }

  /**
   * Format file size to human readable format
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'

    const units = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const k = 1024
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    if (i === 0) {
      return `${bytes} ${units[0]}`
    }

    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${units[i]}`
  }
}
