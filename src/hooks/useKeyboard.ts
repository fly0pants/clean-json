import { useEffect } from 'react'

/**
 * Key binding type
 * Maps key combinations to callback functions
 * Returns true from callback to preventDefault
 */
type KeyBindings = Record<string, (event: KeyboardEvent) => boolean | void>

/**
 * Check if event target is an input element
 */
function isInputElement(target: EventTarget | null): boolean {
  if (!target || !(target instanceof HTMLElement)) {
    return false
  }

  const tagName = target.tagName.toLowerCase()
  return (
    tagName === 'input' ||
    tagName === 'textarea' ||
    target.isContentEditable
  )
}

/**
 * Parse key combination string into parts
 * Example: "ctrl+shift+k" -> { ctrl: true, shift: true, key: "k" }
 */
function parseKeyCombo(combo: string) {
  const parts = combo.toLowerCase().split('+')
  const result = {
    ctrl: false,
    cmd: false,
    alt: false,
    shift: false,
    key: '',
  }

  for (const part of parts) {
    switch (part) {
      case 'ctrl':
        result.ctrl = true
        break
      case 'cmd':
      case 'meta':
        result.cmd = true
        break
      case 'alt':
        result.alt = true
        break
      case 'shift':
        result.shift = true
        break
      default:
        result.key = part
        break
    }
  }

  return result
}

/**
 * Check if keyboard event matches key combination
 */
function matchesKeyCombo(event: KeyboardEvent, combo: string): boolean {
  const parsed = parseKeyCombo(combo)
  const eventKey = event.key.toLowerCase()

  // Check modifiers
  if (parsed.ctrl && !event.ctrlKey) return false
  if (parsed.cmd && !event.metaKey) return false
  if (parsed.alt && !event.altKey) return false
  if (parsed.shift && !event.shiftKey) return false

  // If modifiers are specified but not all match, return false
  if (!parsed.ctrl && event.ctrlKey && combo.includes('+')) return false
  if (!parsed.cmd && event.metaKey && combo.includes('+')) return false
  if (!parsed.alt && event.altKey && combo.includes('+')) return false
  if (!parsed.shift && event.shiftKey && combo.includes('+')) return false

  // Check key
  return parsed.key === eventKey
}

/**
 * useKeyboard Hook
 * Listens for keyboard shortcuts and triggers callbacks
 *
 * @param bindings - Object mapping key combinations to callbacks
 *
 * @example
 * useKeyboard({
 *   'ctrl+k': (e) => { console.log('Format'); return true }, // preventDefault
 *   'cmd+s': (e) => { console.log('Save'); return true },
 *   'Escape': (e) => { console.log('Cancel') },
 * })
 */
export function useKeyboard(bindings: KeyBindings) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check each binding
      for (const [combo, callback] of Object.entries(bindings)) {
        // Check if this combo has modifiers
        const hasModifiers = combo.includes('+')

        // Skip if typing in input element (unless using modifier keys)
        if (isInputElement(event.target) && !hasModifiers) {
          continue
        }

        // Check if event matches this key combination
        if (matchesKeyCombo(event, combo)) {
          const shouldPreventDefault = callback(event)

          if (shouldPreventDefault === true) {
            event.preventDefault()
          }

          // Stop checking other bindings after match
          break
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [bindings])
}
