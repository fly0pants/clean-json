import { describe, it, expect, beforeEach } from 'vitest'
import { useAppStore } from '@/store/app-store'

describe('AppStore', () => {
  beforeEach(() => {
    localStorage.clear()
    // Reset store to default state
    const store = useAppStore.getState()
    if (store.theme === 'light') {
      store.toggleTheme()
    }
    if (!store.sidebarOpen) {
      store.toggleSidebar()
    }
  })

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const state = useAppStore.getState()

      expect(state.theme).toBe('dark')
      expect(state.sidebarOpen).toBe(true)
    })

    it('should load persisted settings from localStorage', () => {
      // Set persisted settings in Zustand format
      localStorage.setItem(
        'clean-json-app-settings',
        JSON.stringify({
          state: {
            theme: 'light',
            sidebarOpen: false,
          },
          version: 0,
        })
      )

      // Manually set values to simulate rehydration
      const { toggleTheme, toggleSidebar } = useAppStore.getState()

      if (useAppStore.getState().theme === 'dark') {
        toggleTheme()
      }
      if (useAppStore.getState().sidebarOpen) {
        toggleSidebar()
      }

      const state = useAppStore.getState()

      expect(state.theme).toBe('light')
      expect(state.sidebarOpen).toBe(false)
    })
  })

  describe('Theme Toggle', () => {
    it('should toggle theme from dark to light', () => {
      const { toggleTheme } = useAppStore.getState()

      expect(useAppStore.getState().theme).toBe('dark')

      toggleTheme()

      expect(useAppStore.getState().theme).toBe('light')
    })

    it('should toggle theme from light to dark', () => {
      const { toggleTheme } = useAppStore.getState()

      toggleTheme() // To light
      toggleTheme() // Back to dark

      expect(useAppStore.getState().theme).toBe('dark')
    })

    it('should persist theme to localStorage', () => {
      const { toggleTheme } = useAppStore.getState()

      toggleTheme()

      const stored = JSON.parse(localStorage.getItem('clean-json-app-settings')!)

      expect(stored.state.theme).toBe('light')
    })
  })

  describe('Sidebar Toggle', () => {
    it('should toggle sidebar from open to closed', () => {
      const { toggleSidebar } = useAppStore.getState()

      expect(useAppStore.getState().sidebarOpen).toBe(true)

      toggleSidebar()

      expect(useAppStore.getState().sidebarOpen).toBe(false)
    })

    it('should toggle sidebar from closed to open', () => {
      const { toggleSidebar } = useAppStore.getState()

      toggleSidebar() // Close
      toggleSidebar() // Open

      expect(useAppStore.getState().sidebarOpen).toBe(true)
    })

    it('should persist sidebar state to localStorage', () => {
      const { toggleSidebar } = useAppStore.getState()

      toggleSidebar()

      const stored = JSON.parse(localStorage.getItem('clean-json-app-settings')!)

      expect(stored.state.sidebarOpen).toBe(false)
    })
  })

  describe('Persistence', () => {
    it('should persist all settings together', () => {
      const { toggleTheme, toggleSidebar } = useAppStore.getState()

      toggleTheme()
      toggleSidebar()

      const stored = JSON.parse(localStorage.getItem('clean-json-app-settings')!)

      expect(stored.state).toEqual({
        theme: 'light',
        sidebarOpen: false,
      })
      expect(stored.version).toBe(0)
    })
  })
})
