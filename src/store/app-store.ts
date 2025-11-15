import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * App state
 */
interface AppState {
  theme: 'dark' | 'light'
  sidebarOpen: boolean

  // Actions
  toggleTheme: () => void
  toggleSidebar: () => void
}

/**
 * App Store
 * Global application settings
 */
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'dark',
      sidebarOpen: true,

      toggleTheme: () => {
        set((state) => ({
          theme: state.theme === 'dark' ? 'light' : 'dark',
        }))
      },

      toggleSidebar: () => {
        set((state) => ({
          sidebarOpen: !state.sidebarOpen,
        }))
      },
    }),
    {
      name: 'clean-json-app-settings',
      // Persist everything
      partialize: (state) => ({
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
)
