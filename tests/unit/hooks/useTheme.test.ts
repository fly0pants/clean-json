import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTheme } from '@/hooks/useTheme'
import { useAppStore } from '@/store/app-store'

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear()
    // Reset app store to initial state
    const store = useAppStore.getState()
    if (store.theme === 'light') {
      store.toggleTheme()
    }
    // Clear any theme classes
    document.documentElement.classList.remove('dark', 'light')
  })

  afterEach(() => {
    // Clean up theme classes
    document.documentElement.classList.remove('dark', 'light')
  })

  describe('Initialization', () => {
    it('should initialize with dark theme by default', () => {
      const { result } = renderHook(() => useTheme())

      expect(result.current.theme).toBe('dark')
      expect(result.current.isDark).toBe(true)
    })

    it('should apply theme class to document element on mount', () => {
      renderHook(() => useTheme())

      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })

    it('should read theme from store if already set', () => {
      // Set theme to light in store
      const store = useAppStore.getState()
      store.toggleTheme() // Switch to light

      const { result } = renderHook(() => useTheme())

      expect(result.current.theme).toBe('light')
      expect(result.current.isDark).toBe(false)
    })
  })

  describe('Theme Toggle', () => {
    it('should toggle theme from dark to light', () => {
      const { result } = renderHook(() => useTheme())

      expect(result.current.theme).toBe('dark')

      act(() => {
        result.current.toggleTheme()
      })

      expect(result.current.theme).toBe('light')
      expect(result.current.isDark).toBe(false)
    })

    it('should toggle theme from light to dark', () => {
      // Set initial theme to light
      const store = useAppStore.getState()
      store.toggleTheme()

      const { result } = renderHook(() => useTheme())

      expect(result.current.theme).toBe('light')

      act(() => {
        result.current.toggleTheme()
      })

      expect(result.current.theme).toBe('dark')
      expect(result.current.isDark).toBe(true)
    })

    it('should update document class when toggling theme', () => {
      const { result } = renderHook(() => useTheme())

      expect(document.documentElement.classList.contains('dark')).toBe(true)

      act(() => {
        result.current.toggleTheme()
      })

      expect(document.documentElement.classList.contains('light')).toBe(true)
      expect(document.documentElement.classList.contains('dark')).toBe(false)
    })

    it('should persist theme to localStorage', () => {
      const { result } = renderHook(() => useTheme())

      act(() => {
        result.current.toggleTheme()
      })

      const stored = localStorage.getItem('clean-json-app-settings')
      expect(stored).toBeTruthy()

      const parsed = JSON.parse(stored!)
      expect(parsed.state.theme).toBe('light')
    })
  })

  describe('Set Theme', () => {
    it('should set theme to dark', () => {
      // Start with light theme
      const store = useAppStore.getState()
      store.toggleTheme()

      const { result } = renderHook(() => useTheme())

      act(() => {
        result.current.setTheme('dark')
      })

      expect(result.current.theme).toBe('dark')
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })

    it('should set theme to light', () => {
      const { result } = renderHook(() => useTheme())

      act(() => {
        result.current.setTheme('light')
      })

      expect(result.current.theme).toBe('light')
      expect(document.documentElement.classList.contains('light')).toBe(true)
    })

    it('should not toggle if setting same theme', () => {
      const { result } = renderHook(() => useTheme())

      expect(result.current.theme).toBe('dark')

      act(() => {
        result.current.setTheme('dark')
      })

      // Should still be dark
      expect(result.current.theme).toBe('dark')
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })
  })

  describe('Document Class Management', () => {
    it('should remove old theme class when switching', () => {
      const { result } = renderHook(() => useTheme())

      expect(document.documentElement.classList.contains('dark')).toBe(true)

      act(() => {
        result.current.setTheme('light')
      })

      expect(document.documentElement.classList.contains('dark')).toBe(false)
      expect(document.documentElement.classList.contains('light')).toBe(true)
    })

    it('should apply theme class on initial mount', () => {
      // Clear classes first
      document.documentElement.classList.remove('dark', 'light')

      renderHook(() => useTheme())

      expect(
        document.documentElement.classList.contains('dark') ||
          document.documentElement.classList.contains('light')
      ).toBe(true)
    })

    it('should clean up theme class on unmount', () => {
      const { unmount } = renderHook(() => useTheme())

      expect(document.documentElement.classList.contains('dark')).toBe(true)

      unmount()

      // Theme class should be removed on unmount
      expect(document.documentElement.classList.contains('dark')).toBe(false)
      expect(document.documentElement.classList.contains('light')).toBe(false)
    })
  })

  describe('Multiple Hook Instances', () => {
    it('should sync theme across multiple hook instances', () => {
      const { result: result1 } = renderHook(() => useTheme())
      const { result: result2 } = renderHook(() => useTheme())

      expect(result1.current.theme).toBe('dark')
      expect(result2.current.theme).toBe('dark')

      act(() => {
        result1.current.toggleTheme()
      })

      // Both instances should reflect the same theme
      expect(result1.current.theme).toBe('light')
      expect(result2.current.theme).toBe('light')
    })
  })

  describe('isDark Computed Value', () => {
    it('should return true when theme is dark', () => {
      const { result } = renderHook(() => useTheme())

      expect(result.current.isDark).toBe(true)
    })

    it('should return false when theme is light', () => {
      const store = useAppStore.getState()
      store.toggleTheme()

      const { result } = renderHook(() => useTheme())

      expect(result.current.isDark).toBe(false)
    })

    it('should update when theme changes', () => {
      const { result } = renderHook(() => useTheme())

      expect(result.current.isDark).toBe(true)

      act(() => {
        result.current.toggleTheme()
      })

      expect(result.current.isDark).toBe(false)
    })
  })
})
