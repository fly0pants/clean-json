/**
 * Format bytes to human readable string
 * @param bytes - Number of bytes
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string (e.g., "1.50 KB")
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']

  const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(k))

  // Safety check for invalid index (handle negative and out of bounds)
  const sizeIndex = Math.max(0, Math.min(i, sizes.length - 1))

  // For bytes, don't apply decimal formatting
  if (sizeIndex === 0) {
    return `${bytes} ${sizes[sizeIndex]}`
  }

  const value = bytes / Math.pow(k, sizeIndex)
  return `${value.toFixed(dm)} ${sizes[sizeIndex]}`
}
