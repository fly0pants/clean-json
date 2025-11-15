import React, { forwardRef, InputHTMLAttributes, useId } from 'react'
import { clsx } from 'clsx'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Input label
   */
  label?: string

  /**
   * Helper text displayed below input
   */
  helperText?: string

  /**
   * Error message - displays error state and message
   */
  error?: string

  /**
   * Left icon element
   */
  leftIcon?: React.ReactNode

  /**
   * Right icon element
   */
  rightIcon?: React.ReactNode

  /**
   * Input size
   */
  size?: 'small' | 'medium' | 'large'

  /**
   * Full width input
   */
  fullWidth?: boolean
}

/**
 * Input Component
 * Text input field following the cyberpunk design system
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      size = 'medium',
      fullWidth = false,
      className,
      id: providedId,
      type = 'text',
      disabled,
      ...props
    },
    ref
  ) => {
    // Generate unique ID for accessibility
    const autoId = useId()
    const id = providedId || autoId

    const helperId = helperText ? `${id}-helper` : undefined
    const errorId = error ? `${id}-error` : undefined
    const describedBy = errorId || helperId

    const hasError = Boolean(error)

    const containerClasses = clsx(
      'input-container',
      {
        'input-full-width': fullWidth && 'w-full',
      }
    )

    const wrapperClasses = clsx(
      'input-wrapper',
      'relative',
      'flex',
      'items-center',
      {
        'w-full': fullWidth,
      }
    )

    const inputClasses = clsx(
      // Base styles
      'input',
      'w-full',
      'font-mono',
      'bg-surface',
      'text-text-primary',
      'border',
      'rounded-lg',
      'transition-all',
      'duration-150',
      'ease-out',
      'placeholder:text-text-placeholder',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-offset-2',
      'focus:ring-offset-bg-primary',

      // Size styles
      {
        'input-small': size === 'small' && 'text-sm px-3 py-2',
        'input-medium': size === 'medium' && 'text-base px-4 py-3',
        'input-large': size === 'large' && 'text-lg px-5 py-4',
      },

      // Icon padding
      {
        'pl-10': leftIcon && size === 'small',
        'pl-11': leftIcon && size === 'medium',
        'pl-12': leftIcon && size === 'large',
        'pr-10': rightIcon && size === 'small',
        'pr-11': rightIcon && size === 'medium',
        'pr-12': rightIcon && size === 'large',
      },

      // State styles
      {
        'input-error':
          hasError &&
          'border-neon-red focus:ring-neon-red/20 focus:border-neon-red',
        'border-neon-blue/20 focus:ring-neon-blue/20 focus:border-neon-blue':
          !hasError,
        'opacity-50 cursor-not-allowed bg-surface/50': disabled,
      },

      // Custom className
      className
    )

    const iconClasses = 'absolute text-text-secondary pointer-events-none'

    const leftIconClasses = clsx(iconClasses, {
      'left-3': size === 'small',
      'left-4': size === 'medium',
      'left-5': size === 'large',
    })

    const rightIconClasses = clsx(iconClasses, {
      'right-3': size === 'small',
      'right-4': size === 'medium',
      'right-5': size === 'large',
    })

    return (
      <div className={containerClasses}>
        {/* Label */}
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-text-primary mb-2"
          >
            {label}
          </label>
        )}

        {/* Input Wrapper */}
        <div className={wrapperClasses}>
          {/* Left Icon */}
          {leftIcon && <span className={leftIconClasses}>{leftIcon}</span>}

          {/* Input */}
          <input
            ref={ref}
            id={id}
            type={type}
            className={inputClasses}
            disabled={disabled}
            aria-invalid={hasError || undefined}
            aria-describedby={describedBy}
            {...props}
          />

          {/* Right Icon */}
          {rightIcon && <span className={rightIconClasses}>{rightIcon}</span>}
        </div>

        {/* Helper Text */}
        {helperText && !error && (
          <p id={helperId} className="mt-2 text-sm text-text-secondary">
            {helperText}
          </p>
        )}

        {/* Error Message */}
        {error && (
          <p
            id={errorId}
            className="mt-2 text-sm text-neon-red flex items-center gap-1"
          >
            <span className="text-base">⚠</span>
            {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
