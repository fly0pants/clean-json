import React, { useRef, useState } from 'react'
import { Button } from '../Common/Button'
import clsx from 'clsx'

export interface UtilityButtonsProps {
  onCopy: () => void
  onDownload: () => void
  onUpload: (content: string) => void
  onLoadFromURL: (url: string) => void
  onToUnicode: () => void
  onFromUnicode: () => void
  onRemoveComments: () => void
  onToXML: () => void
  onToCSV: () => void
  disabled?: boolean
  size?: 'small' | 'medium' | 'large'
  className?: string
}

export const UtilityButtons: React.FC<UtilityButtonsProps> = ({
  onCopy,
  onDownload,
  onUpload,
  onLoadFromURL,
  onToUnicode,
  onFromUnicode,
  onRemoveComments,
  onToXML,
  onToCSV,
  disabled = false,
  size = 'medium',
  className,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showURLModal, setShowURLModal] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const [loadingURL, setLoadingURL] = useState(false)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        onUpload(content)
      }
      reader.readAsText(file)
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleURLSubmit = async () => {
    if (!urlInput.trim()) return
    
    setLoadingURL(true)
    try {
      onLoadFromURL(urlInput.trim())
      setShowURLModal(false)
      setUrlInput('')
    } finally {
      setLoadingURL(false)
    }
  }

  const buttonClass = clsx(
    `btn-secondary btn-${size}`
  )

  return (
    <div className={clsx('flex flex-wrap gap-2 items-center', className)} role="group" aria-label="Utility buttons">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json,text/plain"
        onChange={handleFileChange}
        className="hidden"
        aria-label="Upload JSON file"
      />

      {/* Copy button */}
      <Button
        onClick={onCopy}
        disabled={disabled}
        className={buttonClass}
        size={size}
        variant="secondary"
        aria-label="Copy"
        title="Copy output to clipboard"
      >
        <svg className="h-4 w-4 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
        </svg>
        <span className="hidden md:inline">Copy</span>
      </Button>

      {/* Download button */}
      <Button
        onClick={onDownload}
        disabled={disabled}
        className={buttonClass}
        size={size}
        variant="secondary"
        aria-label="Download"
        title="Download as JSON file"
      >
        <svg className="h-4 w-4 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        <span className="hidden md:inline">Download</span>
      </Button>

      {/* Upload button */}
      <Button
        onClick={handleUploadClick}
        disabled={disabled}
        className={buttonClass}
        size={size}
        variant="secondary"
        aria-label="Upload"
        title="Upload JSON file"
      >
        <svg className="h-4 w-4 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        <span className="hidden md:inline">Upload</span>
      </Button>

      {/* URL button */}
      <Button
        onClick={() => setShowURLModal(true)}
        disabled={disabled}
        className={buttonClass}
        size={size}
        variant="secondary"
        aria-label="Load from URL"
        title="Load JSON from URL"
      >
        <svg className="h-4 w-4 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        <span className="hidden lg:inline">URL</span>
      </Button>

      {/* More menu button */}
      <div className="relative">
        <Button
          onClick={() => setShowMoreMenu(!showMoreMenu)}
          disabled={disabled}
          className={buttonClass}
          size={size}
          variant="secondary"
          aria-label="More options"
          title="More conversion options"
        >
          <svg className="h-4 w-4 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>
          <span className="hidden md:inline">More</span>
          <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </Button>

        {/* Dropdown menu */}
        {showMoreMenu && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowMoreMenu(false)}
            />
            <div className="absolute left-0 top-full mt-1 z-50 min-w-[180px] rounded-lg border border-border-default bg-primary-surface shadow-lg py-1">
              <button
                onClick={() => { onToUnicode(); setShowMoreMenu(false) }}
                className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-primary-bg flex items-center gap-2"
              >
                <svg className="h-4 w-4 text-neon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                Unicode 转义
              </button>
              <button
                onClick={() => { onFromUnicode(); setShowMoreMenu(false) }}
                className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-primary-bg flex items-center gap-2"
              >
                <svg className="h-4 w-4 text-neon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                Unicode 还原
              </button>
              <div className="border-t border-border-default my-1" />
              <button
                onClick={() => { onRemoveComments(); setShowMoreMenu(false) }}
                className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-primary-bg flex items-center gap-2"
              >
                <svg className="h-4 w-4 text-neon-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                去除注释
              </button>
              <div className="border-t border-border-default my-1" />
              <button
                onClick={() => { onToXML(); setShowMoreMenu(false) }}
                className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-primary-bg flex items-center gap-2"
              >
                <svg className="h-4 w-4 text-neon-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                转换为 XML
              </button>
              <button
                onClick={() => { onToCSV(); setShowMoreMenu(false) }}
                className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-primary-bg flex items-center gap-2"
              >
                <svg className="h-4 w-4 text-neon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                转换为 CSV
              </button>
            </div>
          </>
        )}
      </div>

      {/* URL Modal */}
      {showURLModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-primary-surface rounded-lg border border-border-default p-6 w-full max-w-md mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-text-primary mb-4">从 URL 加载 JSON</h3>
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://api.example.com/data.json"
              className="w-full px-4 py-2 rounded-lg border border-border-default bg-primary-bg text-text-primary placeholder-text-disabled focus:outline-none focus:ring-2 focus:ring-neon-blue mb-4"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleURLSubmit()
                if (e.key === 'Escape') setShowURLModal(false)
              }}
            />
            <div className="flex justify-end gap-2">
              <Button
                onClick={() => {
                  setShowURLModal(false)
                  setUrlInput('')
                }}
                variant="secondary"
                size="small"
              >
                取消
              </Button>
              <Button
                onClick={handleURLSubmit}
                disabled={!urlInput.trim() || loadingURL}
                size="small"
              >
                {loadingURL ? '加载中...' : '加载'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
