import { describe, it, expect } from 'vitest'
import { formatBytes } from '@/utils/format-bytes'

describe('formatBytes', () => {
  describe('Bytes', () => {
    it('should format 0 bytes', () => {
      expect(formatBytes(0)).toBe('0 Bytes')
    })

    it('should format bytes less than 1024', () => {
      expect(formatBytes(1)).toBe('1 Bytes')
      expect(formatBytes(500)).toBe('500 Bytes')
      expect(formatBytes(1023)).toBe('1023 Bytes')
    })
  })

  describe('Kilobytes', () => {
    it('should format exactly 1 KB', () => {
      expect(formatBytes(1024)).toBe('1.00 KB')
    })

    it('should format KB with 2 decimal places', () => {
      expect(formatBytes(1536)).toBe('1.50 KB')
      expect(formatBytes(2048)).toBe('2.00 KB')
      expect(formatBytes(2560)).toBe('2.50 KB')
    })

    it('should format values less than 1 MB', () => {
      expect(formatBytes(102400)).toBe('100.00 KB')
      expect(formatBytes(1048575)).toBe('1024.00 KB')
    })
  })

  describe('Megabytes', () => {
    it('should format exactly 1 MB', () => {
      expect(formatBytes(1048576)).toBe('1.00 MB')
    })

    it('should format MB with 2 decimal places', () => {
      expect(formatBytes(1572864)).toBe('1.50 MB')
      expect(formatBytes(2097152)).toBe('2.00 MB')
    })

    it('should format values less than 1 GB', () => {
      expect(formatBytes(104857600)).toBe('100.00 MB')
      expect(formatBytes(1073741823)).toBe('1024.00 MB')
    })
  })

  describe('Gigabytes', () => {
    it('should format exactly 1 GB', () => {
      expect(formatBytes(1073741824)).toBe('1.00 GB')
    })

    it('should format GB with 2 decimal places', () => {
      expect(formatBytes(1610612736)).toBe('1.50 GB')
      expect(formatBytes(2147483648)).toBe('2.00 GB')
    })

    it('should format large GB values', () => {
      expect(formatBytes(10737418240)).toBe('10.00 GB')
      expect(formatBytes(107374182400)).toBe('100.00 GB')
    })
  })

  describe('Terabytes', () => {
    it('should format exactly 1 TB', () => {
      expect(formatBytes(1099511627776)).toBe('1.00 TB')
    })

    it('should format TB with 2 decimal places', () => {
      expect(formatBytes(1649267441664)).toBe('1.50 TB')
      expect(formatBytes(2199023255552)).toBe('2.00 TB')
    })
  })

  describe('Petabytes', () => {
    it('should format exactly 1 PB', () => {
      expect(formatBytes(1125899906842624)).toBe('1.00 PB')
    })

    it('should format PB with 2 decimal places', () => {
      expect(formatBytes(1688849860263936)).toBe('1.50 PB')
    })
  })

  describe('Edge Cases', () => {
    it('should handle negative numbers', () => {
      expect(formatBytes(-1024)).toBe('-1.00 KB')
      expect(formatBytes(-1048576)).toBe('-1.00 MB')
    })

    it('should handle very small positive values', () => {
      expect(formatBytes(0.5)).toBe('0.5 Bytes')
      expect(formatBytes(0.99)).toBe('0.99 Bytes')
    })

    it('should handle floating point bytes', () => {
      expect(formatBytes(1536.5)).toBe('1.50 KB')
    })
  })

  describe('Custom Decimal Places', () => {
    it('should support custom decimal places', () => {
      expect(formatBytes(1536, 0)).toBe('2 KB')
      expect(formatBytes(1536, 1)).toBe('1.5 KB')
      expect(formatBytes(1536, 3)).toBe('1.500 KB')
    })

    it('should default to 2 decimal places', () => {
      expect(formatBytes(1536)).toBe('1.50 KB')
    })

    it('should handle 0 decimal places for various sizes', () => {
      expect(formatBytes(1048576, 0)).toBe('1 MB')
      expect(formatBytes(1073741824, 0)).toBe('1 GB')
    })
  })

  describe('Rounding', () => {
    it('should round up correctly', () => {
      expect(formatBytes(1536.7, 2)).toBe('1.50 KB')
    })

    it('should round down correctly', () => {
      expect(formatBytes(1536.4, 2)).toBe('1.50 KB')
    })

    it('should handle rounding at MB boundary', () => {
      expect(formatBytes(1048575.5)).toBe('1024.00 KB')
      expect(formatBytes(1048576.5)).toBe('1.00 MB')
    })
  })
})
