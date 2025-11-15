import React from 'react'
import { Button } from '../Common/Button'
import clsx from 'clsx'

export interface ActionButtonsProps {
  onFormat: () => void
  onCompress: () => void
  onStringToObject: () => void
  onObjectToString: () => void
  onAutoConvert: () => void
  onClear: () => void
  loading?: boolean
  disabled?: boolean
  disabledButtons?: Array<'format' | 'compress' | 'stringToObject' | 'objectToString' | 'autoConvert' | 'clear'>
  size?: 'small' | 'medium' | 'large'
  compact?: boolean
  showTooltips?: boolean
  className?: string
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onFormat,
  onCompress,
  onStringToObject,
  onObjectToString,
  onAutoConvert,
  onClear,
  loading = false,
  disabled = false,
  disabledButtons = [],
  size = 'medium',
  showTooltips = true,
  className,
}) => {
  const isButtonDisabled = (buttonName: string) => {
    return disabled || loading || disabledButtons.includes(buttonName as any)
  }

  const getTooltip = (action: string) => {
    if (!showTooltips) return undefined

    const tooltips: Record<string, string> = {
      format: 'Format JSON with proper indentation (Ctrl+B)',
      compress: 'Minify JSON by removing whitespace (Ctrl+M)',
      stringToObject: 'Convert JSON string to object',
      objectToString: 'Convert JSON object to string',
      autoConvert: 'Auto-detect and convert',
      clear: 'Clear all content (Ctrl+K)',
    }

    return tooltips[action]
  }

  const buttonClass = (variant: 'primary' | 'secondary') => {
    return clsx(
      `btn-${variant}`,
      `btn-${size}`
    )
  }

  return (
    <div
      className={clsx('flex flex-wrap gap-2 items-center', className)}
      role="group"
      aria-label="JSON action buttons"
    >
      <Button
        onClick={onFormat}
        disabled={isButtonDisabled('format')}
        className={buttonClass('primary')}
        size={size}
        aria-label="Format"
        title={getTooltip('format')}
      >
        <svg className="h-4 w-4 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
        </svg>
        <span className="hidden md:inline">Format</span>
      </Button>

      <Button
        onClick={onCompress}
        disabled={isButtonDisabled('compress')}
        className={buttonClass('primary')}
        size={size}
        aria-label="Compress"
        title={getTooltip('compress')}
      >
        <svg className="h-4 w-4 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <span className="hidden md:inline">Compress</span>
      </Button>

      <Button
        onClick={onStringToObject}
        disabled={isButtonDisabled('stringToObject')}
        className={buttonClass('primary')}
        size={size}
        aria-label="String to Object"
        title={getTooltip('stringToObject')}
      >
        <svg className="h-4 w-4 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
        <span className="hidden lg:inline">Str → Obj</span>
        <span className="hidden md:inline lg:hidden">S→O</span>
      </Button>

      <Button
        onClick={onObjectToString}
        disabled={isButtonDisabled('objectToString')}
        className={buttonClass('primary')}
        size={size}
        aria-label="Object to String"
        title={getTooltip('objectToString')}
      >
        <svg className="h-4 w-4 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
        <span className="hidden lg:inline">Obj → Str</span>
        <span className="hidden md:inline lg:hidden">O→S</span>
      </Button>

      <Button
        onClick={onAutoConvert}
        disabled={isButtonDisabled('autoConvert')}
        className={buttonClass('primary')}
        size={size}
        aria-label="Auto Convert"
        title={getTooltip('autoConvert')}
      >
        <svg className="h-4 w-4 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span className="hidden lg:inline">Auto</span>
      </Button>

      <Button
        onClick={onClear}
        disabled={isButtonDisabled('clear')}
        className={buttonClass('secondary')}
        size={size}
        variant="secondary"
        aria-label="Clear"
        title={getTooltip('clear')}
      >
        <svg className="h-4 w-4 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        <span className="hidden md:inline">Clear</span>
      </Button>
    </div>
  )
}
