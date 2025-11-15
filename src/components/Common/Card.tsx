import React, { HTMLAttributes, KeyboardEvent } from 'react'
import { clsx } from 'clsx'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Card variant style
   */
  variant?: 'default' | 'elevated' | 'outlined'

  /**
   * Padding size
   */
  padding?: 'none' | 'small' | 'medium' | 'large'

  /**
   * Header content
   */
  header?: React.ReactNode

  /**
   * Footer content
   */
  footer?: React.ReactNode

  /**
   * Click handler - makes card interactive
   */
  onClick?: () => void

  /**
   * Enable hover effects
   */
  hoverable?: boolean

  /**
   * Full width card
   */
  fullWidth?: boolean

  /**
   * Render as different HTML element
   */
  as?: 'div' | 'section' | 'article' | 'button'

  /**
   * Card children (body content)
   */
  children: React.ReactNode
}

/**
 * Card Component
 * Container component following the cyberpunk design system
 */
export const Card = ({
  variant = 'default',
  padding = 'medium',
  header,
  footer,
  onClick,
  hoverable = true,
  fullWidth = false,
  as: Component = 'div',
  className,
  children,
  tabIndex,
  onKeyDown,
  ...props
}: CardProps) => {
  const isInteractive = Boolean(onClick)

  // Handle keyboard interaction for interactive cards
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      onClick?.()
    }
    onKeyDown?.(e)
  }

  const cardClasses = clsx(
    // Base styles
    'card',
    'rounded-lg',
    'transition-all',
    'duration-150',
    'ease-out',

    // Variant styles
    {
      'card-default':
        variant === 'default' &&
        'bg-surface border border-neon-blue/10 shadow-md',
      'card-elevated':
        variant === 'elevated' &&
        'bg-elevated shadow-lg border border-neon-blue/20',
      'card-outlined':
        variant === 'outlined' &&
        'bg-transparent border-2 border-neon-blue/30',
    },

    // Padding styles
    {
      'p-0': padding === 'none',
      'p-4': padding === 'small',
      'p-6': padding === 'medium',
      'p-8': padding === 'large',
    },

    // Interactive styles
    {
      'card-interactive': isInteractive,
      'cursor-pointer': isInteractive,
      'hover:-translate-y-1': isInteractive,
      'hover:shadow-lg': isInteractive,
      'hover:border-neon-blue/40': isInteractive,
      'active:translate-y-0': isInteractive,
    },

    // Hoverable (non-interactive)
    {
      'hover:shadow-md': !isInteractive && hoverable,
      'hover:border-neon-blue/20': !isInteractive && hoverable,
    },

    // Full width
    {
      'w-full': fullWidth,
    },

    // Custom className
    className
  )

  // Determine tabIndex for interactive cards
  const finalTabIndex = isInteractive ? (tabIndex ?? 0) : tabIndex

  const commonProps = {
    className: cardClasses,
    onClick: isInteractive ? onClick : undefined,
    onKeyDown: isInteractive ? handleKeyDown : onKeyDown,
    tabIndex: finalTabIndex,
    ...props,
  }

  return (
    <Component {...(commonProps as any)}>
      {/* Header */}
      {header && (
        <div className="card-header mb-4 pb-4 border-b border-neon-blue/10">
          {header}
        </div>
      )}

      {/* Body */}
      <div className="card-body">{children}</div>

      {/* Footer */}
      {footer && (
        <div className="card-footer mt-4 pt-4 border-t border-neon-blue/10">
          {footer}
        </div>
      )}
    </Component>
  )
}
