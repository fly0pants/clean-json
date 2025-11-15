/**
 * Test Utilities and Helpers
 */

/**
 * Generate random JSON for testing
 */
export function generateJSON(targetSize: number): string {
  const baseObject = {
    users: [] as any[],
  }

  let currentSize = JSON.stringify(baseObject).length

  while (currentSize < targetSize) {
    const user = {
      id: baseObject.users.length + 1,
      name: `User ${baseObject.users.length + 1}`,
      email: `user${baseObject.users.length + 1}@example.com`,
      active: true,
      data: 'x'.repeat(100), // Padding
    }

    baseObject.users.push(user)
    currentSize = JSON.stringify(baseObject).length
  }

  return JSON.stringify(baseObject)
}

/**
 * Generate deeply nested JSON
 */
export function generateNestedJSON(depth: number): string {
  let result = '{"value":1}'

  for (let i = 0; i < depth; i++) {
    result = `{"nested":${result}}`
  }

  return result
}

/**
 * Create formatted JSON with specific indentation
 */
export function createFormattedJSON(
  obj: any,
  indent: number,
  indentType: 'space' | 'tab' = 'space'
): string {
  const _indentStr = indentType === 'space' ? ' '.repeat(indent) : '\t'
  return JSON.stringify(obj, null, indentType === 'space' ? indent : '\t')
}

/**
 * Create mock history item
 */
export function createMockHistoryItem(overrides: Partial<any> = {}) {
  return {
    id: Date.now().toString(),
    content: '{"name":"John"}',
    preview: '{"name":"John"}',
    timestamp: Date.now(),
    size: 15,
    isValid: true,
    ...overrides,
  }
}

/**
 * Wait for async operations
 */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Create a File object for testing
 */
export function createMockFile(
  content: string,
  filename: string = 'test.json',
  type: string = 'application/json'
): File {
  const blob = new Blob([content], { type })
  return new File([blob], filename, { type })
}

/**
 * Measure execution time
 */
export async function measureTime(fn: () => void | Promise<void>): Promise<number> {
  const start = performance.now()
  await fn()
  return performance.now() - start
}

/**
 * Create localStorage mock with data
 */
export function setupLocalStorage(data: Record<string, any>) {
  Object.keys(data).forEach((key) => {
    localStorage.setItem(key, JSON.stringify(data[key]))
  })
}

/**
 * Assert localStorage contains specific data
 */
export function assertLocalStorageContains(key: string, expected: any) {
  const stored = localStorage.getItem(key)
  if (!stored) {
    throw new Error(`localStorage key "${key}" not found`)
  }

  const parsed = JSON.parse(stored)
  expect(parsed).toEqual(expected)
}

/**
 * Create invalid JSON with specific error type
 */
export function createInvalidJSON(errorType: 'unclosed' | 'trailing-comma' | 'unquoted-key' | 'single-quotes'): string {
  switch (errorType) {
    case 'unclosed':
      return '{"name":"John"'
    case 'trailing-comma':
      return '{"name":"John",}'
    case 'unquoted-key':
      return '{name:"John"}'
    case 'single-quotes':
      return "{'name':'John'}"
    default:
      return '{invalid}'
  }
}

/**
 * Benchmark function execution
 */
export interface BenchmarkResult {
  avg: number
  min: number
  max: number
  median: number
  p95: number
  p99: number
}

export function benchmark(fn: () => void, iterations: number = 100): BenchmarkResult {
  const times: number[] = []

  for (let i = 0; i < iterations; i++) {
    const start = performance.now()
    fn()
    const duration = performance.now() - start
    times.push(duration)
  }

  times.sort((a, b) => a - b)

  const sum = times.reduce((a, b) => a + b, 0)
  const avg = sum / times.length
  const min = times[0]
  const max = times[times.length - 1]
  const median = times[Math.floor(times.length / 2)]
  const p95 = times[Math.floor(times.length * 0.95)]
  const p99 = times[Math.floor(times.length * 0.99)]

  return { avg, min, max, median, p95, p99 }
}

/**
 * Mock console methods
 */
export function mockConsole() {
  const originalConsole = { ...console }

  console.log = vi.fn()
  console.warn = vi.fn()
  console.error = vi.fn()

  return {
    restore: () => {
      console.log = originalConsole.log
      console.warn = originalConsole.warn
      console.error = originalConsole.error
    },
  }
}

/**
 * Create a deferred promise for async testing
 */
export function defer<T = void>() {
  let resolve!: (value: T) => void
  let reject!: (reason?: any) => void

  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })

  return { promise, resolve, reject }
}
