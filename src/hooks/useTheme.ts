import { useEffect, useCallback } from 'react'
import { useAppStore } from '@/store/app-store'

/**
 * useTheme Hook
 * Manages application theme (dark/light mode)
 * Applies theme class to document element
 */
export function useTheme() {
  const theme = useAppStore((state) => state.theme)
  const toggleThemeInStore = useAppStore((state) => state.toggleTheme)

  // Computed value
  const isDark = theme === 'dark'

  // Set specific theme
  const setTheme = useCallback(
    (newTheme: 'dark' | 'light') => {
      if (theme !== newTheme) {
        toggleThemeInStore()
      }
    },
    [theme, toggleThemeInStore]
  )

  // Toggle theme
  const toggleTheme = useCallback(() => {
    toggleThemeInStore()
  }, [toggleThemeInStore])

  // Apply theme class to document element
  useEffect(() => {
    const root = document.documentElement

    // Remove both classes first
    root.classList.remove('dark', 'light')

    // Add current theme class
    root.classList.add(theme)

    // Cleanup on unmount
    return () => {
      root.classList.remove('dark', 'light')
    }
  }, [theme])

  return {
    theme,
    isDark,
    toggleTheme,
    setTheme,
  }
}
