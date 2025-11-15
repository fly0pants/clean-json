import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useKeyboard } from '@/hooks/useKeyboard'

describe('useKeyboard', () => {
  beforeEach(() => {
    // Clear any existing event listeners
    vi.clearAllMocks()
  })

  describe('Event Listener Setup', () => {
    it('should add keydown event listener on mount', () => {
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener')

      renderHook(() => useKeyboard({}))

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function)
      )

      addEventListenerSpy.mockRestore()
    })

    it('should remove event listener on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')

      const { unmount } = renderHook(() => useKeyboard({}))

      unmount()

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function)
      )

      removeEventListenerSpy.mockRestore()
    })
  })

  describe('Single Key Handlers', () => {
    it('should trigger callback for single key press', () => {
      const callback = vi.fn()

      renderHook(() =>
        useKeyboard({
          a: callback,
        })
      )

      const event = new KeyboardEvent('keydown', { key: 'a' })
      document.dispatchEvent(event)

      expect(callback).toHaveBeenCalledTimes(1)
      expect(callback).toHaveBeenCalledWith(event)
    })

    it('should not trigger callback for different key', () => {
      const callback = vi.fn()

      renderHook(() =>
        useKeyboard({
          a: callback,
        })
      )

      const event = new KeyboardEvent('keydown', { key: 'b' })
      document.dispatchEvent(event)

      expect(callback).not.toHaveBeenCalled()
    })

    it('should handle multiple different key bindings', () => {
      const callbackA = vi.fn()
      const callbackB = vi.fn()

      renderHook(() =>
        useKeyboard({
          a: callbackA,
          b: callbackB,
        })
      )

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }))
      expect(callbackA).toHaveBeenCalledTimes(1)
      expect(callbackB).not.toHaveBeenCalled()

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'b' }))
      expect(callbackB).toHaveBeenCalledTimes(1)
      expect(callbackA).toHaveBeenCalledTimes(1)
    })
  })

  describe('Modifier Keys', () => {
    it('should handle Ctrl+key combination', () => {
      const callback = vi.fn()

      renderHook(() =>
        useKeyboard({
          'ctrl+k': callback,
        })
      )

      const event = new KeyboardEvent('keydown', {
        key: 'k',
        ctrlKey: true,
      })
      document.dispatchEvent(event)

      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('should handle Cmd+key combination (Meta)', () => {
      const callback = vi.fn()

      renderHook(() =>
        useKeyboard({
          'cmd+k': callback,
        })
      )

      const event = new KeyboardEvent('keydown', {
        key: 'k',
        metaKey: true,
      })
      document.dispatchEvent(event)

      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('should handle Alt+key combination', () => {
      const callback = vi.fn()

      renderHook(() =>
        useKeyboard({
          'alt+k': callback,
        })
      )

      const event = new KeyboardEvent('keydown', {
        key: 'k',
        altKey: true,
      })
      document.dispatchEvent(event)

      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('should handle Shift+key combination', () => {
      const callback = vi.fn()

      renderHook(() =>
        useKeyboard({
          'shift+k': callback,
        })
      )

      const event = new KeyboardEvent('keydown', {
        key: 'K',
        shiftKey: true,
      })
      document.dispatchEvent(event)

      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('should not trigger if modifier is missing', () => {
      const callback = vi.fn()

      renderHook(() =>
        useKeyboard({
          'ctrl+k': callback,
        })
      )

      // Press k without ctrl
      const event = new KeyboardEvent('keydown', { key: 'k' })
      document.dispatchEvent(event)

      expect(callback).not.toHaveBeenCalled()
    })

    it('should not trigger if wrong modifier is pressed', () => {
      const callback = vi.fn()

      renderHook(() =>
        useKeyboard({
          'ctrl+k': callback,
        })
      )

      // Press k with alt instead of ctrl
      const event = new KeyboardEvent('keydown', {
        key: 'k',
        altKey: true,
      })
      document.dispatchEvent(event)

      expect(callback).not.toHaveBeenCalled()
    })
  })

  describe('Multiple Modifiers', () => {
    it('should handle Ctrl+Shift+key combination', () => {
      const callback = vi.fn()

      renderHook(() =>
        useKeyboard({
          'ctrl+shift+k': callback,
        })
      )

      const event = new KeyboardEvent('keydown', {
        key: 'K',
        ctrlKey: true,
        shiftKey: true,
      })
      document.dispatchEvent(event)

      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('should handle Cmd+Alt+key combination', () => {
      const callback = vi.fn()

      renderHook(() =>
        useKeyboard({
          'cmd+alt+k': callback,
        })
      )

      const event = new KeyboardEvent('keydown', {
        key: 'k',
        metaKey: true,
        altKey: true,
      })
      document.dispatchEvent(event)

      expect(callback).toHaveBeenCalledTimes(1)
    })
  })

  describe('Special Keys', () => {
    it('should handle Enter key', () => {
      const callback = vi.fn()

      renderHook(() =>
        useKeyboard({
          Enter: callback,
        })
      )

      const event = new KeyboardEvent('keydown', { key: 'Enter' })
      document.dispatchEvent(event)

      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('should handle Escape key', () => {
      const callback = vi.fn()

      renderHook(() =>
        useKeyboard({
          Escape: callback,
        })
      )

      const event = new KeyboardEvent('keydown', { key: 'Escape' })
      document.dispatchEvent(event)

      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('should handle ArrowDown key', () => {
      const callback = vi.fn()

      renderHook(() =>
        useKeyboard({
          ArrowDown: callback,
        })
      )

      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' })
      document.dispatchEvent(event)

      expect(callback).toHaveBeenCalledTimes(1)
    })
  })

  describe('preventDefault', () => {
    it('should prevent default if callback returns true', () => {
      const callback = vi.fn(() => true)

      renderHook(() =>
        useKeyboard({
          'ctrl+k': callback,
        })
      )

      const event = new KeyboardEvent('keydown', {
        key: 'k',
        ctrlKey: true,
      })
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault')

      document.dispatchEvent(event)

      expect(preventDefaultSpy).toHaveBeenCalled()
    })

    it('should not prevent default if callback returns false', () => {
      const callback = vi.fn(() => false)

      renderHook(() =>
        useKeyboard({
          'ctrl+k': callback,
        })
      )

      const event = new KeyboardEvent('keydown', {
        key: 'k',
        ctrlKey: true,
      })
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault')

      document.dispatchEvent(event)

      expect(preventDefaultSpy).not.toHaveBeenCalled()
    })

    it('should not prevent default if callback returns nothing', () => {
      const callback = vi.fn()

      renderHook(() =>
        useKeyboard({
          'ctrl+k': callback,
        })
      )

      const event = new KeyboardEvent('keydown', {
        key: 'k',
        ctrlKey: true,
      })
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault')

      document.dispatchEvent(event)

      expect(preventDefaultSpy).not.toHaveBeenCalled()
    })
  })

  describe('Input Elements', () => {
    it('should not trigger when typing in input element by default', () => {
      const callback = vi.fn()

      renderHook(() =>
        useKeyboard({
          a: callback,
        })
      )

      const input = document.createElement('input')
      document.body.appendChild(input)

      const event = new KeyboardEvent('keydown', {
        key: 'a',
        bubbles: true,
      })
      Object.defineProperty(event, 'target', {
        value: input,
        writable: false,
      })

      input.dispatchEvent(event)

      expect(callback).not.toHaveBeenCalled()

      document.body.removeChild(input)
    })

    it('should not trigger when typing in textarea element', () => {
      const callback = vi.fn()

      renderHook(() =>
        useKeyboard({
          a: callback,
        })
      )

      const textarea = document.createElement('textarea')
      document.body.appendChild(textarea)

      const event = new KeyboardEvent('keydown', {
        key: 'a',
        bubbles: true,
      })
      Object.defineProperty(event, 'target', {
        value: textarea,
        writable: false,
      })

      textarea.dispatchEvent(event)

      expect(callback).not.toHaveBeenCalled()

      document.body.removeChild(textarea)
    })

    it('should trigger modifier combinations even in input elements', () => {
      const callback = vi.fn()

      renderHook(() =>
        useKeyboard({
          'ctrl+k': callback,
        })
      )

      const input = document.createElement('input')
      document.body.appendChild(input)

      const event = new KeyboardEvent('keydown', {
        key: 'k',
        ctrlKey: true,
        bubbles: true,
      })
      Object.defineProperty(event, 'target', {
        value: input,
        writable: false,
      })

      input.dispatchEvent(event)

      expect(callback).toHaveBeenCalledTimes(1)

      document.body.removeChild(input)
    })
  })

  describe('Case Insensitivity', () => {
    it('should handle lowercase and uppercase keys the same', () => {
      const callback = vi.fn()

      renderHook(() =>
        useKeyboard({
          k: callback,
        })
      )

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k' }))
      expect(callback).toHaveBeenCalledTimes(1)

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'K' }))
      expect(callback).toHaveBeenCalledTimes(2)
    })
  })

  describe('Dynamic Bindings', () => {
    it('should update bindings when they change', () => {
      const callback1 = vi.fn()
      const callback2 = vi.fn()

      const { rerender } = renderHook(
        ({ bindings }) => useKeyboard(bindings),
        {
          initialProps: { bindings: { a: callback1 } },
        }
      )

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }))
      expect(callback1).toHaveBeenCalledTimes(1)
      expect(callback2).not.toHaveBeenCalled()

      // Update bindings
      rerender({ bindings: { a: callback2 } })

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }))
      expect(callback1).toHaveBeenCalledTimes(1)
      expect(callback2).toHaveBeenCalledTimes(1)
    })
  })
})
