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
      format: '格式化 JSON (Ctrl+B)',
      compress: '压缩 JSON (Ctrl+M)',
      stringToObject: '字符串 → 对象',
      objectToString: '对象 → 字符串',
      autoConvert: '智能转换',
      clear: '清空 (Ctrl+K)',
    }

    return tooltips[action]
  }

  return (
    <div
      className={clsx('flex flex-wrap gap-1.5 items-center', className)}
      role="group"
      aria-label="JSON action buttons"
    >
      {/* Format Button - Primary Action */}
      <Button
        onClick={onFormat}
        disabled={isButtonDisabled('format')}
        className={clsx('btn-primary', `btn-${size}`)}
        size={size}
        aria-label="Format"
        title={getTooltip('format')}
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h10M4 14h16M4 18h10" />
        </svg>
        <span className="hidden sm:inline">格式化</span>
      </Button>

      {/* Compress Button */}
      <Button
        onClick={onCompress}
        disabled={isButtonDisabled('compress')}
        className={clsx('btn-secondary', `btn-${size}`)}
        size={size}
        aria-label="Compress"
        title={getTooltip('compress')}
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V6a2 2 0 012-2h12a2 2 0 012 2v2M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M9 12h6M12 9v6" />
        </svg>
        <span className="hidden sm:inline">压缩</span>
      </Button>

      <div className="divider hidden sm:block" />

      {/* String to Object */}
      <Button
        onClick={onStringToObject}
        disabled={isButtonDisabled('stringToObject')}
        className={clsx('btn-secondary', `btn-${size}`)}
        size={size}
        aria-label="String to Object"
        title={getTooltip('stringToObject')}
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l2 2 4-4" />
        </svg>
        <span className="hidden lg:inline">Str→Obj</span>
      </Button>

      {/* Object to String */}
      <Button
        onClick={onObjectToString}
        disabled={isButtonDisabled('objectToString')}
        className={clsx('btn-secondary', `btn-${size}`)}
        size={size}
        aria-label="Object to String"
        title={getTooltip('objectToString')}
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h8m-8 4h8m-8 4h4" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
        </svg>
        <span className="hidden lg:inline">Obj→Str</span>
      </Button>

      {/* Auto Convert */}
      <Button
        onClick={onAutoConvert}
        disabled={isButtonDisabled('autoConvert')}
        className={clsx('btn-secondary', `btn-${size}`)}
        size={size}
        aria-label="Auto Convert"
        title={getTooltip('autoConvert')}
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span className="hidden md:inline">智能</span>
      </Button>

      <div className="divider hidden sm:block" />

      {/* Clear Button */}
      <Button
        onClick={onClear}
        disabled={isButtonDisabled('clear')}
        className={clsx('btn-secondary text-neon-red hover:border-neon-red', `btn-${size}`)}
        size={size}
        variant="secondary"
        aria-label="Clear"
        title={getTooltip('clear')}
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        <span className="hidden sm:inline">清空</span>
      </Button>
    </div>
  )
}
