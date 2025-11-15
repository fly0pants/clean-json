import React, { forwardRef, ButtonHTMLAttributes } from 'react'
import { clsx } from 'clsx'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button variant style
   */
  variant?: 'primary' | 'secondary' | 'ghost'

  /**
   * Button size
   */
  size?: 'small' | 'medium' | 'large'

  /**
   * Loading state - shows spinner and disables button
   */
  loading?: boolean

  /**
   * Icon element to display before text
   */
  icon?: React.ReactNode

  /**
   * Full width button
   */
  fullWidth?: boolean

  /**
   * Button children (text content)
   */
  children?: React.ReactNode
}

/**
 * Button Component
 * Customizable button following the cyberpunk design system
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'medium',
      loading = false,
      icon,
      fullWidth = false,
      className,
      disabled,
      type = 'button',
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading

    const buttonClasses = clsx(
      // Base styles
      'btn',
      'inline-flex',
      'items-center',
      'justify-center',
      'font-medium',
      'transition-all',
      'duration-150',
      'ease-out',
      'focus:outline-none',
      'focus-visible:ring-2',
      'focus-visible:ring-neon-blue',
      'focus-visible:ring-offset-2',
      'focus-visible:ring-offset-bg-primary',

      // Variant styles
      {
        'btn-primary':
          variant === 'primary' &&
          'bg-gradient-to-br from-neon-blue to-neon-pink text-white border-none hover:scale-105 hover:shadow-glow-blue active:scale-98',
        'btn-secondary':
          variant === 'secondary' &&
          'bg-transparent text-neon-blue border border-neon-blue/50 hover:bg-neon-blue/10 hover:border-neon-blue active:bg-neon-blue/20',
        'btn-ghost':
          variant === 'ghost' &&
          'bg-transparent text-text-secondary hover:bg-surface/50 hover:text-text-primary',
      },

      // Size styles
      {
        'btn-small': size === 'small' && 'text-sm px-4 py-2 rounded-md',
        'btn-medium': size === 'medium' && 'text-base px-6 py-3 rounded-lg',
        'btn-large': size === 'large' && 'text-lg px-8 py-4 rounded-lg',
      },

      // State styles
      {
        'btn-loading': loading,
        'opacity-40 cursor-not-allowed': isDisabled,
        'btn-full-width': fullWidth && 'w-full',
      },

      // Custom className
      className
    )

    return (
      <button
        ref={ref}
        type={type}
        className={buttonClasses}
        disabled={isDisabled}
        aria-busy={loading}
        {...props}
      >
        {/* Loading Spinner */}
        {loading && (
          <span className="loading-spinner mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}

        {/* Icon */}
        {icon && !loading && <span className="mr-2">{icon}</span>}

        {/* Text Content */}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
