import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'

// Cleanup after each test
afterEach(() => {
  cleanup()
  // Clear all mocks
  vi.clearAllMocks()
  // Clear localStorage
  localStorage.clear()
  // Clear sessionStorage
  sessionStorage.clear()
})

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
    get length() {
      return Object.keys(store).length
    },
    key: (index: number) => {
      const keys = Object.keys(store)
      return keys[index] || null
    },
  }
})()

globalThis.localStorage = localStorageMock as Storage

// Mock Blob for file size calculations
globalThis.Blob = class Blob {
  constructor(
    public parts: any[],
    public options?: BlobPropertyBag
  ) {}

  get size() {
    return this.parts.reduce((size, part) => {
      if (typeof part === 'string') {
        return size + new TextEncoder().encode(part).length
      }
      return size
    }, 0)
  }

  get type() {
    return this.options?.type || ''
  }
}

// Mock performance.now() for consistent timing tests
let mockTime = 0

performance.now = vi.fn(() => {
  return mockTime
})

// Helper to advance mock time
globalThis.advanceMockTime = (ms: number) => {
  mockTime += ms
}

// Reset mock time before each test
afterEach(() => {
  mockTime = 0
})

// Custom matchers
expect.extend({
  toBeValidJSON(received: string) {
    try {
      JSON.parse(received)
      return {
        pass: true,
        message: () => `Expected ${received} not to be valid JSON`,
      }
    } catch (error) {
      return {
        pass: false,
        message: () => `Expected ${received} to be valid JSON`,
      }
    }
  },
})

// Declare custom matcher types
declare global {
  namespace Vi {
    interface Matchers<R = any> {
      toBeValidJSON(): R
    }
  }

  function advanceMockTime(ms: number): void
}
