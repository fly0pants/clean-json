/**
 * History related type definitions
 */

export interface HistoryItem {
  id: string
  content: string
  preview: string
  timestamp: number
  size: number
  isValid: boolean
}

export type HistoryList = HistoryItem[]
