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
  compact = false,
  showTooltips = false,
  className,
}) => {
  const isButtonDisabled = (buttonName: string) => {
    return disabled || loading || disabledButtons.includes(buttonName as any)
  }

  const getTooltip = (action: string) => {
    if (!showTooltips) return undefined

    const tooltips: Record<string, string> = {
      format: 'Format JSON with proper indentation',
      compress: 'Minify JSON by removing whitespace',
      stringToObject: 'Convert JSON string to object',
      objectToString: 'Convert JSON object to string',
      autoConvert: 'Auto-detect and convert',
      clear: 'Clear all content',
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
      className={clsx('action-buttons', className)}
      role="group"
      aria-label="JSON action buttons"
    >
      <Button
        onClick={onFormat}
        disabled={isButtonDisabled('format')}
        className={buttonClass('primary')}
        size={size}
        aria-label={compact ? 'Format' : undefined}
        title={getTooltip('format')}
      >
        {!compact && 'Format'}
      </Button>

      <Button
        onClick={onCompress}
        disabled={isButtonDisabled('compress')}
        className={buttonClass('primary')}
        size={size}
        aria-label={compact ? 'Compress' : undefined}
        title={getTooltip('compress')}
      >
        {!compact && 'Compress'}
      </Button>

      <Button
        onClick={onStringToObject}
        disabled={isButtonDisabled('stringToObject')}
        className={buttonClass('primary')}
        size={size}
        aria-label={compact ? 'String to Object' : undefined}
        title={getTooltip('stringToObject')}
      >
        {!compact && 'String → Object'}
      </Button>

      <Button
        onClick={onObjectToString}
        disabled={isButtonDisabled('objectToString')}
        className={buttonClass('primary')}
        size={size}
        aria-label={compact ? 'Object to String' : undefined}
        title={getTooltip('objectToString')}
      >
        {!compact && 'Object → String'}
      </Button>

      <Button
        onClick={onAutoConvert}
        disabled={isButtonDisabled('autoConvert')}
        className={buttonClass('primary')}
        size={size}
        aria-label={compact ? 'Auto Convert' : undefined}
        title={getTooltip('autoConvert')}
      >
        {!compact && 'Auto Convert'}
      </Button>

      <Button
        onClick={onClear}
        disabled={isButtonDisabled('clear')}
        className={buttonClass('secondary')}
        size={size}
        variant="secondary"
        aria-label={compact ? 'Clear' : undefined}
        title={getTooltip('clear')}
      >
        {!compact && 'Clear'}
      </Button>
    </div>
  )
}
