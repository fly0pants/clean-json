import { useState, useEffect, useCallback, useRef } from 'react'
import { Storage } from '@/utils/storage'

// Create a singleton storage instance
const storage = new Storage()

/**
 * useLocalStorage Hook
 * React hook for state that persists to localStorage
 *
 * @param key - localStorage key
 * @param defaultValue - Default value if key doesn't exist
 * @returns [value, setValue, remove] - Similar to useState with additional remove function
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // Track the previous key to detect changes
  const prevKeyRef = useRef<string>(key)

  // Initialize state from localStorage or default value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const rawItem = localStorage.getItem(key)
      if (rawItem === null) {
        return defaultValue
      }

      // Try to parse JSON
      try {
        return JSON.parse(rawItem) as T
      } catch {
        // If parsing fails, use default value
        console.warn(`Failed to parse localStorage key "${key}", using default value`)
        return defaultValue
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return defaultValue
    }
  })

  // Update localStorage when state changes
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        // Allow value to be a function (like setState)
        // Use functional setState to avoid dependency on storedValue
        setStoredValue((prev) => {
          const valueToStore = value instanceof Function ? value(prev) : value

          // Update localStorage
          try {
            storage.set(key, valueToStore)
          } catch (storageError) {
            console.error(`Error setting localStorage key "${key}":`, storageError)
          }

          return valueToStore
        })
      } catch (error) {
        console.error(`Error in setValue for "${key}":`, error)
      }
    },
    [key]
  )

  // Remove from localStorage and reset to default
  const remove = useCallback(() => {
    try {
      storage.remove(key)
      setStoredValue(defaultValue)
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error)
    }
  }, [key, defaultValue])

  // Re-sync when key changes
  useEffect(() => {
    // Only run if key actually changed
    if (prevKeyRef.current !== key) {
      prevKeyRef.current = key

      try {
        const rawItem = localStorage.getItem(key)
        if (rawItem === null) {
          // Key doesn't exist, use default value
          setStoredValue(defaultValue)
          return
        }

        // Try to parse JSON
        try {
          setStoredValue(JSON.parse(rawItem) as T)
        } catch {
          // If parsing fails, use default value
          console.warn(`Failed to parse localStorage key "${key}", using default value`)
          setStoredValue(defaultValue)
        }
      } catch (error) {
        console.warn(`Error reading localStorage key "${key}":`, error)
        setStoredValue(defaultValue)
      }
    }
  }, [key, defaultValue])

  return [storedValue, setValue, remove]
}
