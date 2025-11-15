import React from 'react'
import { Button } from '../Common/Button'

export interface ThemeToggleProps {
  theme: 'light' | 'dark'
  onToggle: () => void
  disabled?: boolean
  size?: 'small' | 'medium' | 'large'
  variant?: 'primary' | 'secondary' | 'ghost'
  showTooltip?: boolean
  className?: string
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  theme,
  onToggle,
  disabled = false,
  size = 'medium',
  variant = 'ghost',
  showTooltip = false,
  className,
}) => {
  const getAriaLabel = () => {
    return theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
  }

  const getTooltip = () => {
    if (!showTooltip) return undefined
    return theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
  }

  const renderIcon = () => {
    if (theme === 'dark') {
      // Sun icon for switching to light mode
      return (
        <svg
          className="icon w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      )
    } else {
      // Moon icon for switching to dark mode
      return (
        <svg
          className="icon w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )
    }
  }

  return (
    <Button
      onClick={onToggle}
      disabled={disabled}
      size={size}
      variant={variant}
      className={className}
      aria-label={getAriaLabel()}
      title={getTooltip()}
      icon={renderIcon()}
    />
  )
}
