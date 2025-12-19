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

  useEffect(() => {
    document.body.className = theme
  }, [theme])

  const editorTheme = theme === 'dark' ? 'vs-dark' : 'light'

  const editorOptions = {
    minimap: { enabled: false },
    fontSize: 14,
    fontFamily: 'Fira Code, JetBrains Mono, Monaco, Consolas, monospace',
    lineNumbers: 'on' as const,
    rulers: [],
    wordWrap: 'on' as const,
    wrappingIndent: 'indent' as const,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 2,
    formatOnPaste: true,
    formatOnType: false,
  }

  const handleFormat = () => {
    format()
    if (output) {
      addItem(output)
      toast.success('JSON 格式化成功!')
    }
  }

  const handleCompress = () => {
    compress()
    if (output) {
      addItem(output)
      toast.success('JSON 压缩成功!')
    }
  }

  const handleStringToObject = () => {
    convertStringToObject()
    if (output) {
      addItem(output)
      toast.success('已转换为对象!')
    }
  }

  const handleObjectToString = () => {
    convertObjectToString()
    if (output) {
      addItem(output)
      toast.success('已转换为字符串!')
    }
  }

  const handleAutoConvert = () => {
    autoConvert()
    if (output) {
      addItem(output)
      toast.success('自动转换成功!')
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
      <Toaster position="top-right" />
      <header className="flex h-16 items-center justify-between border-b border-border-default bg-primary-surface px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-gradient-to-br from-neon-blue to-neon-pink text-xl sm:text-2xl font-bold text-white shadow-glow-blue">
              {'{}'}
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-neon-blue">Clean JSON</h1>
              <p className="text-xs text-text-secondary">Format & Validate with Style</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={toggleAutoFormat}
            className={`btn-ghost flex items-center gap-2 text-xs sm:text-sm ${autoFormat ? 'text-neon-green' : 'text-text-secondary'}`}
            aria-label="Toggle auto format"
            title={`自动格式化: ${autoFormat ? '开启' : '关闭'}`}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="hidden md:inline">{autoFormat ? '自动' : '手动'}</span>
          </button>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="btn-ghost relative" aria-label="Toggle history panel">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {historyItems.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-neon-pink text-xs font-semibold text-white">{historyItems.length}</span>
            )}
          </button>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>
      </header>

      {/* Toolbar */}
      <div className="border-b border-border-default bg-primary-surface px-2 sm:px-6 py-3 overflow-x-auto">
        <div className="flex flex-wrap items-center gap-4">
          <ActionButtons
            onFormat={handleFormat}
            onCompress={handleCompress}
            onStringToObject={handleStringToObject}
            onObjectToString={handleObjectToString}
            onAutoConvert={handleAutoConvert}
            onClear={handleClear}
          />
          <div className="hidden sm:block w-px h-8 bg-border-default" />
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

      <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
        <div className="flex flex-1 flex-col">
          <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
            <div className="flex flex-1 flex-col border-b md:border-b-0 md:border-r border-border-default min-h-[300px] md:min-h-0">
              <div className="flex items-center justify-between border-b border-border-default bg-primary-surface px-4 py-2">
                <h2 className="text-sm font-semibold text-text-secondary">输入</h2>
                <span className="text-xs text-text-disabled hidden sm:inline">在此粘贴或输入 JSON</span>
              </div>
              <div className="flex-1 overflow-hidden">
                <Editor height="100%" language="json" value={input} onChange={(value) => setInput(value || '')} theme={editorTheme} options={editorOptions} />
              </div>
            </div>
            <div className="flex flex-1 flex-col min-h-[300px] md:min-h-0">
              <div className="flex items-center justify-between border-b border-border-default bg-primary-surface px-4 py-2">
                <h2 className="text-sm font-semibold text-text-secondary">输出</h2>
                {error && <div className="flex items-center gap-2 text-xs text-neon-red truncate max-w-[200px] sm:max-w-none"><svg className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg><span className="hidden sm:inline">错误: {error.message}</span><span className="sm:hidden">错误</span></div>}
                {isValid && !error && output && <div className="flex items-center gap-2 text-xs text-neon-green"><svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg><span className="hidden sm:inline">有效 JSON</span><span className="sm:hidden">✓</span></div>}
              </div>
              <div className="flex-1 overflow-hidden">
                <Editor height="100%" language="json" value={output} onChange={(value) => setOutput(value || '')} theme={editorTheme} options={editorOptions} />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-border-default bg-primary-sidebar px-4 sm:px-6 py-2 text-xs text-text-secondary">
            <div className="flex items-center gap-4 sm:gap-6">
              <span>行数: {stats.lines}</span>
              <span>大小: {formatBytes(stats.size)}</span>
            </div>
            <div className="flex items-center gap-2">
              {isValid ? <span className="text-neon-green">✓ 有效</span> : error ? <span className="text-neon-red">✗ 无效</span> : <span className="text-text-disabled">⚪ 未验证</span>}
            </div>
          </div>
        </div>
        {sidebarOpen && (
          <aside className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-border-default bg-primary-sidebar max-h-[300px] lg:max-h-none">
            <HistoryPanel items={historyItems} onItemClick={handleHistoryItemClick} onItemDelete={handleHistoryItemDelete} onClearAll={handleClearAllHistory} />
          </aside>
        )}
      </div>
    </div>
  )
}

export default App
