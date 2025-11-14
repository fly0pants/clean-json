import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'monaco': ['monaco-editor', '@monaco-editor/react'],
          'vendor': ['react', 'react-dom', 'zustand'],
        },
      },
    },
  },
  server: {
    port: 3000,
  },
})
