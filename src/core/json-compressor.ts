import type { CompressionStats } from '@/types/json.types'

/**
 * JSON Compressor
 * Removes all whitespace and provides compression statistics
 */
export class JSONCompressor {
  /**
   * Compress JSON by removing all unnecessary whitespace
   */
  compress(input: string): string {
    // Parse to validate
    const parsed = JSON.parse(input)

    // Stringify without any spacing
    return JSON.stringify(parsed)
  }

  /**
   * Get compression statistics
   */
  getStats(original: string, compressed: string): CompressionStats {
    const originalSize = this.getByteSize(original)
    const compressedSize = this.getByteSize(compressed)
    const saved = originalSize - compressedSize

    // Calculate ratio as percentage
    const ratio = originalSize > 0
      ? ((saved / originalSize) * 100).toFixed(2)
      : '0.00'

    return {
      originalSize,
      compressedSize,
      ratio,
      saved,
    }
  }

  /**
   * Get byte size of string using Blob
   */
  private getByteSize(str: string): number {
    return new Blob([str]).size
  }
}
