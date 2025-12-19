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

  const buttonClass = clsx('btn-secondary', `btn-${size}`)

  return (
    <div className={clsx('flex flex-wrap gap-1.5 items-center', className)} role="group" aria-label="Utility buttons">
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
        title="复制到剪贴板"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <rect x="9" y="9" width="13" height="13" rx="2" />
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
        </svg>
        <span className="hidden md:inline">复制</span>
      </Button>

      {/* Download button */}
      <Button
        onClick={onDownload}
        disabled={disabled}
        className={buttonClass}
        size={size}
        variant="secondary"
        aria-label="Download"
        title="下载 JSON 文件"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
        </svg>
        <span className="hidden md:inline">下载</span>
      </Button>

      {/* Upload button */}
      <Button
        onClick={handleUploadClick}
        disabled={disabled}
        className={buttonClass}
        size={size}
        variant="secondary"
        aria-label="Upload"
        title="上传 JSON 文件"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
        </svg>
        <span className="hidden md:inline">上传</span>
      </Button>

      {/* URL button */}
      <Button
        onClick={() => setShowURLModal(true)}
        disabled={disabled}
        className={buttonClass}
        size={size}
        variant="secondary"
        aria-label="Load from URL"
        title="从 URL 加载"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
        </svg>
        <span className="hidden lg:inline">URL</span>
      </Button>

      <div className="divider hidden sm:block" />

      {/* More menu button */}
      <div className="relative">
        <Button
          onClick={() => setShowMoreMenu(!showMoreMenu)}
          disabled={disabled}
          className={clsx(buttonClass, showMoreMenu && 'bg-primary-elevated border-border-hover')}
          size={size}
          variant="secondary"
          aria-label="More options"
          title="更多转换选项"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
          <span className="hidden md:inline">更多</span>
          <svg className={clsx("h-3 w-3 transition-transform", showMoreMenu && "rotate-180")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </Button>

        {/* Dropdown menu */}
        {showMoreMenu && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowMoreMenu(false)}
            />
            <div className="dropdown-menu fade-in">
              <div className="px-3 py-2 text-xs font-medium text-text-secondary uppercase tracking-wider">
                编码转换
              </div>
              <button
                onClick={() => { onToUnicode(); setShowMoreMenu(false) }}
                className="dropdown-item"
              >
                <svg className="h-4 w-4 text-neon-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                Unicode 转义
              </button>
              <button
                onClick={() => { onFromUnicode(); setShowMoreMenu(false) }}
                className="dropdown-item"
              >
                <svg className="h-4 w-4 text-neon-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                Unicode 还原
              </button>

              <div className="dropdown-divider" />
              
              <div className="px-3 py-2 text-xs font-medium text-text-secondary uppercase tracking-wider">
                JSON 处理
              </div>
              <button
                onClick={() => { onRemoveComments(); setShowMoreMenu(false) }}
                className="dropdown-item"
              >
                <svg className="h-4 w-4 text-neon-yellow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                去除注释
              </button>

              <div className="dropdown-divider" />
              
              <div className="px-3 py-2 text-xs font-medium text-text-secondary uppercase tracking-wider">
                格式转换
              </div>
              <button
                onClick={() => { onToXML(); setShowMoreMenu(false) }}
                className="dropdown-item"
              >
                <svg className="h-4 w-4 text-neon-pink" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                转换为 XML
              </button>
              <button
                onClick={() => { onToCSV(); setShowMoreMenu(false) }}
                className="dropdown-item"
              >
                <svg className="h-4 w-4 text-neon-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18M3 18h18M3 6h18M7 6v12M11 6v12M15 6v12M19 6v12" />
                </svg>
                转换为 CSV
              </button>
            </div>
          </>
        )}
      </div>

      {/* URL Modal */}
      {showURLModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm fade-in">
          <div className="card w-full max-w-md mx-4 fade-in">
            <div className="panel-header">
              <h3 className="text-base font-semibold text-text-primary flex items-center gap-2">
                <svg className="h-5 w-5 text-neon-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                </svg>
                从 URL 加载 JSON
              </h3>
              <button 
                onClick={() => { setShowURLModal(false); setUrlInput('') }}
                className="icon-btn"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://api.example.com/data.json"
                className="w-full px-3 py-2.5 rounded-lg border border-border-default bg-primary-bg text-text-primary placeholder-text-disabled focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-colors text-sm"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleURLSubmit()
                  if (e.key === 'Escape') { setShowURLModal(false); setUrlInput('') }
                }}
              />
              <p className="mt-2 text-xs text-text-secondary">
                输入 JSON API 地址或 JSON 文件的直接链接
              </p>
            </div>
            <div className="flex justify-end gap-2 px-4 pb-4">
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
                className="btn-primary"
              >
                {loadingURL ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    加载中...
                  </>
                ) : '加载'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
