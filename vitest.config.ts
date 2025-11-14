import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
        '**/dist',
      ],
      // Coverage thresholds
      statements: 80,
      branches: 75,
      functions: 80,
      lines: 80,
    },
    // Test file patterns
    include: ['tests/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    // Test execution settings
    testTimeout: 10000,
    hookTimeout: 10000,
    // Reporter configuration
    reporters: ['verbose'],
    // Parallel execution
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@tests': path.resolve(__dirname, './tests'),
    },
  },
})
