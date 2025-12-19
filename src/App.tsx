import { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import Editor from '@monaco-editor/react'
import { ActionButtons } from './components/Toolbar/ActionButtons'
import { UtilityButtons } from './components/Toolbar/UtilityButtons'
import { ThemeToggle } from './components/Toolbar/ThemeToggle'
import { HistoryPanel } from './components/Sidebar/HistoryPanel'
import { useTheme } from './hooks/useTheme'
import { useJSONFormatter } from './hooks/useJSONFormatter'
import { useEditorStore } from './store/editor-store'
import { useHistoryStore } from './store/history-store'
import { formatBytes } from './utils/format-bytes'
import { Clipboard } from './utils/clipboard'
import { FileHandler } from './utils/file-handler'
import { UnicodeConverter, CommentRemover, JSONToXMLConverter, JSONToCSVConverter } from './core/json-utils'
import type { HistoryItem } from './types/history.types'

// Initialize utilities
const clipboard = new Clipboard()
const fileHandler = new FileHandler()
const unicodeConverter = new UnicodeConverter()
const commentRemover = new CommentRemover()
const xmlConverter = new JSONToXMLConverter()
const csvConverter = new JSONToCSVConverter()

function App() {
  const { theme, toggleTheme } = useTheme()
  const {
    input,
    output,
    stats,
    isValid,
    error,
    autoFormat,
    setInput,
    format,
    compress,
    convertStringToObject,
    convertObjectToString,
    autoConvert,
    toggleAutoFormat,
  } = useJSONFormatter()
  const { setOutput, updateStats, setValidation } = useEditorStore()
  const { items: historyItems, addItem, deleteItem, clearHistory } = useHistoryStore()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)

  // Apply theme to body
  useEffect(() => {
    document.body.className = theme
  }, [theme])

  // Initialize stats on load (for remembered input)
  useEffect(() => {
    if (!isLoaded && input) {
      updateStats(input, output)
      setIsLoaded(true)
    } else if (!isLoaded) {
      setIsLoaded(true)
    }
  }, [input, output, isLoaded, updateStats])

  const editorTheme = theme === 'dark' ? 'vs-dark' : 'light'

  const editorOptions = {
    minimap: { enabled: false },
    fontSize: 13,
    fontFamily: 'JetBrains Mono, Fira Code, Monaco, Consolas, monospace',
    lineNumbers: 'on' as const,
    rulers: [],
    wordWrap: 'on' as const,
    wrappingIndent: 'indent' as const,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 2,
    formatOnPaste: true,
    formatOnType: false,
    renderLineHighlight: 'line' as const,
    cursorBlinking: 'smooth' as const,
    smoothScrolling: true,
    padding: { top: 12, bottom: 12 },
  }

  const handleFormat = () => {
    format()
    const currentOutput = useEditorStore.getState().output
    if (currentOutput) {
      addItem(currentOutput)
      toast.success('JSON 格式化成功!')
    }
  }

  const handleCompress = () => {
    compress()
    const currentOutput = useEditorStore.getState().output
    if (currentOutput) {
      addItem(currentOutput)
      toast.success('JSON 压缩成功!')
    }
  }

  const handleStringToObject = () => {
    convertStringToObject()
    const currentOutput = useEditorStore.getState().output
    if (currentOutput) {
      addItem(currentOutput)
      toast.success('已转换为对象!')
    }
  }

  const handleObjectToString = () => {
    convertObjectToString()
    const currentOutput = useEditorStore.getState().output
    if (currentOutput) {
      addItem(currentOutput)
      toast.success('已转换为字符串!')
    }
  }

  const handleAutoConvert = () => {
    autoConvert()
    const currentOutput = useEditorStore.getState().output
    if (currentOutput) {
      addItem(currentOutput)
      toast.success('智能转换成功!')
    }
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
    updateStats('', '')
    toast.success('已清空!')
  }

  // Utility handlers
  const handleCopy = async () => {
    const textToCopy = output || input
    if (!textToCopy) {
      toast.error('没有内容可复制')
      return
    }
    const success = await clipboard.copy(textToCopy)
    if (success) {
      toast.success('已复制到剪贴板!')
    } else {
      toast.error('复制失败')
    }
  }

  const handleDownload = () => {
    const contentToDownload = output || input
    if (!contentToDownload) {
      toast.error('没有内容可下载')
      return
    }
    const timestamp = new Date().toISOString().slice(0, 10)
    fileHandler.downloadJSON(contentToDownload, `json-${timestamp}.json`)
    toast.success('文件下载成功!')
  }

  const handleUpload = (content: string) => {
    setInput(content)
    toast.success('文件上传成功!')
  }

  const handleLoadFromURL = async (url: string) => {
    try {
      const content = await fileHandler.loadFromURL(url)
      // Format the loaded JSON
      const formatted = JSON.stringify(JSON.parse(content), null, 2)
      setInput(formatted)
      toast.success('从 URL 加载成功!')
    } catch (err: any) {
      toast.error(`加载失败: ${err.message}`)
    }
  }

  const handleToUnicode = () => {
    try {
      const sourceText = input
      if (!sourceText) {
        toast.error('请先输入 JSON')
        return
      }
      const result = unicodeConverter.toUnicode(sourceText)
      setOutput(result)
      setValidation(true)
      updateStats(sourceText, result)
      addItem(result)
      toast.success('Unicode 转义成功!')
    } catch (err: any) {
      toast.error(`转换失败: ${err.message}`)
    }
  }

  const handleFromUnicode = () => {
    try {
      const sourceText = input
      if (!sourceText) {
        toast.error('请先输入 JSON')
        return
      }
      const result = unicodeConverter.fromUnicode(sourceText)
      setOutput(result)
      setValidation(true)
      updateStats(sourceText, result)
      addItem(result)
      toast.success('Unicode 还原成功!')
    } catch (err: any) {
      toast.error(`转换失败: ${err.message}`)
    }
  }

  const handleRemoveComments = () => {
    try {
      const sourceText = input
      if (!sourceText) {
        toast.error('请先输入 JSON')
        return
      }
      const result = commentRemover.removeComments(sourceText)
      // Format the result
      const formatted = JSON.stringify(JSON.parse(result), null, 2)
      setOutput(formatted)
      setValidation(true)
      updateStats(sourceText, formatted)
      addItem(formatted)
      toast.success('注释已去除!')
    } catch (err: any) {
      toast.error(`处理失败: ${err.message}`)
    }
  }

  const handleToXML = () => {
    try {
      const sourceText = input
      if (!sourceText) {
        toast.error('请先输入 JSON')
        return
      }
      const result = xmlConverter.convert(sourceText)
      setOutput(result)
      setValidation(true)
      updateStats(sourceText, result)
      toast.success('已转换为 XML!')
    } catch (err: any) {
      toast.error(`转换失败: ${err.message}`)
    }
  }

  const handleToCSV = () => {
    try {
      const sourceText = input
      if (!sourceText) {
        toast.error('请先输入 JSON')
        return
      }
      const result = csvConverter.convert(sourceText)
      setOutput(result)
      setValidation(true)
      updateStats(sourceText, result)
      toast.success('已转换为 CSV!')
    } catch (err: any) {
      toast.error(`转换失败: ${err.message}`)
    }
  }

  const handleHistoryItemClick = (item: HistoryItem) => {
    setInput(item.content)
    toast.success('已从历史记录加载!')
  }

  const handleHistoryItemDelete = (id: string) => {
    deleteItem(id)
    toast.success('已从历史记录删除!')
  }

  const handleClearAllHistory = () => {
    clearHistory()
    toast.success('历史记录已清空!')
  }

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-primary-bg text-text-primary">
      <Toaster 
        position="top-center" 
        toastOptions={{
          duration: 2000,
          style: {
            background: 'var(--color-bg-surface)',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-border-default)',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
          },
          success: {
            iconTheme: {
              primary: 'var(--color-neon-green)',
              secondary: 'white',
            },
          },
          error: {
            iconTheme: {
              primary: 'var(--color-neon-red)',
              secondary: 'white',
            },
          },
        }}
      />
      
      {/* Header */}
      <header className="flex h-14 items-center justify-between border-b border-border-default bg-primary-surface px-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple text-lg font-bold text-white shadow-lg">
              {'{}'}
            </div>
            <div className="hidden sm:block">
              <h1 className="text-base font-bold text-gradient">Clean JSON</h1>
              <p className="text-[10px] text-text-secondary -mt-0.5">在线 JSON 格式化工具</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={toggleAutoFormat}
            className={`icon-btn relative ${autoFormat ? 'text-neon-green' : 'text-text-secondary'}`}
            aria-label="Toggle auto format"
            title={`自动格式化: ${autoFormat ? '开启' : '关闭'}`}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {autoFormat && <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-neon-green rounded-full" />}
          </button>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className={`icon-btn relative ${sidebarOpen ? 'text-neon-blue' : 'text-text-secondary'}`}
            aria-label="Toggle history panel"
            title="历史记录"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {historyItems.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-neon-pink text-[10px] font-semibold text-white">
                {historyItems.length > 9 ? '9+' : historyItems.length}
              </span>
            )}
          </button>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>
      </header>

      {/* Toolbar */}
      <div className="border-b border-border-default bg-primary-surface/80 backdrop-blur-sm px-3 py-2 overflow-x-auto">
        <div className="flex items-center gap-3">
          <ActionButtons
            onFormat={handleFormat}
            onCompress={handleCompress}
            onStringToObject={handleStringToObject}
            onObjectToString={handleObjectToString}
            onAutoConvert={handleAutoConvert}
            onClear={handleClear}
          />
          <div className="divider hidden md:block" />
          <UtilityButtons
            onCopy={handleCopy}
            onDownload={handleDownload}
            onUpload={handleUpload}
            onLoadFromURL={handleLoadFromURL}
            onToUnicode={handleToUnicode}
            onFromUnicode={handleFromUnicode}
            onRemoveComments={handleRemoveComments}
            onToXML={handleToXML}
            onToCSV={handleToCSV}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
        <div className="flex flex-1 flex-col min-w-0">
          <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
            {/* Input Panel */}
            <div className="flex flex-1 flex-col border-b md:border-b-0 md:border-r border-border-default min-h-[250px] md:min-h-0">
              <div className="panel-header">
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-neon-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <h2 className="text-sm font-medium text-text-primary">输入</h2>
                </div>
                <span className="text-xs text-text-disabled hidden sm:block">在此粘贴或输入 JSON</span>
              </div>
              <div className="flex-1 overflow-hidden bg-primary-bg">
                <Editor 
                  height="100%" 
                  language="json" 
                  value={input} 
                  onChange={(value) => setInput(value || '')} 
                  theme={editorTheme} 
                  options={editorOptions}
                  loading={
                    <div className="flex items-center justify-center h-full">
                      <div className="flex items-center gap-2 text-text-secondary">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <span className="text-sm">加载编辑器...</span>
                      </div>
                    </div>
                  }
                />
              </div>
            </div>

            {/* Output Panel */}
            <div className="flex flex-1 flex-col min-h-[250px] md:min-h-0">
              <div className="panel-header">
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-neon-purple" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h2 className="text-sm font-medium text-text-primary">输出</h2>
                </div>
                <div className="flex items-center gap-2">
                  {error && (
                    <div className="badge badge-error flex items-center gap-1">
                      <span className="status-dot status-dot-error" />
                      <span className="hidden sm:inline truncate max-w-[150px]">{error.message}</span>
                      <span className="sm:hidden">错误</span>
                    </div>
                  )}
                  {isValid && !error && output && (
                    <div className="badge badge-success flex items-center gap-1">
                      <span className="status-dot status-dot-success" />
                      <span className="hidden sm:inline">有效 JSON</span>
                      <span className="sm:hidden">✓</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1 overflow-hidden bg-primary-bg">
                <Editor 
                  height="100%" 
                  language="json" 
                  value={output} 
                  onChange={(value) => setOutput(value || '')} 
                  theme={editorTheme} 
                  options={{...editorOptions, readOnly: false}}
                  loading={
                    <div className="flex items-center justify-center h-full">
                      <div className="flex items-center gap-2 text-text-secondary">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <span className="text-sm">加载编辑器...</span>
                      </div>
                    </div>
                  }
                />
              </div>
            </div>
          </div>

          {/* Status Bar */}
          <div className="flex items-center justify-between border-t border-border-default bg-primary-sidebar px-4 py-1.5 text-xs">
            <div className="flex items-center gap-4 text-text-secondary">
              <span className="flex items-center gap-1.5">
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                {stats.lines} 行
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7c-2 0-3 1-3 3z" />
                </svg>
                {formatBytes(stats.size)}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {isValid ? (
                <span className="flex items-center gap-1 text-neon-green">
                  <span className="status-dot status-dot-success" />
                  有效
                </span>
              ) : error ? (
                <span className="flex items-center gap-1 text-neon-red">
                  <span className="status-dot status-dot-error" />
                  无效
                </span>
              ) : (
                <span className="flex items-center gap-1 text-text-disabled">
                  <span className="status-dot status-dot-idle" />
                  待验证
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-border-default bg-primary-sidebar max-h-[280px] lg:max-h-none fade-in">
            <HistoryPanel 
              items={historyItems} 
              onItemClick={handleHistoryItemClick} 
              onItemDelete={handleHistoryItemDelete} 
              onClearAll={handleClearAllHistory} 
            />
          </aside>
        )}
      </div>
    </div>
  )
}

export default App
