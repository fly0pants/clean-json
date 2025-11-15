import { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import Editor from '@monaco-editor/react'
import { ActionButtons } from './components/Toolbar/ActionButtons'
import { ThemeToggle } from './components/Toolbar/ThemeToggle'
import { HistoryPanel } from './components/Sidebar/HistoryPanel'
import { useTheme } from './hooks/useTheme'
import { useJSONFormatter } from './hooks/useJSONFormatter'
import { useEditorStore } from './store/editor-store'
import { useHistoryStore } from './store/history-store'
import { formatBytes } from './utils/format-bytes'
import type { HistoryItem } from './types/history.types'

function App() {
  const { theme, toggleTheme } = useTheme()
  const {
    input,
    output,
    stats,
    isValid,
    error,
    setInput,
    format,
    compress,
    convertStringToObject,
    convertObjectToString,
    autoConvert,
  } = useJSONFormatter()
  const { setOutput, updateStats } = useEditorStore()
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
      toast.success('JSON formatted successfully!')
    }
  }

  const handleCompress = () => {
    compress()
    if (output) {
      addItem(output)
      toast.success('JSON compressed successfully!')
    }
  }

  const handleStringToObject = () => {
    convertStringToObject()
    if (output) {
      addItem(output)
      toast.success('Converted string to object!')
    }
  }

  const handleObjectToString = () => {
    convertObjectToString()
    if (output) {
      addItem(output)
      toast.success('Converted object to string!')
    }
  }

  const handleAutoConvert = () => {
    autoConvert()
    if (output) {
      addItem(output)
      toast.success('Auto-converted successfully!')
    }
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
    updateStats('', '')
    toast.success('Cleared!')
  }

  const handleHistoryItemClick = (item: HistoryItem) => {
    setInput(item.content)
    toast.success('Loaded from history!')
  }

  const handleHistoryItemDelete = (id: string) => {
    deleteItem(id)
    toast.success('Deleted from history!')
  }

  const handleClearAllHistory = () => {
    clearHistory()
    toast.success('History cleared!')
  }

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-primary-bg text-text-primary">
      <Toaster position="top-right" />
      <header className="flex h-16 items-center justify-between border-b border-border-default bg-primary-surface px-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-neon-blue to-neon-pink text-2xl font-bold text-white shadow-glow-blue">
              {'{}'}
            </div>
            <div>
              <h1 className="text-lg font-bold text-neon-blue">Clean JSON</h1>
              <p className="text-xs text-text-secondary">Format & Validate with Style</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
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
      <div className="border-b border-border-default bg-primary-surface px-6 py-3">
        <ActionButtons onFormat={handleFormat} onCompress={handleCompress} onStringToObject={handleStringToObject} onObjectToString={handleObjectToString} onAutoConvert={handleAutoConvert} onClear={handleClear} />
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col">
          <div className="flex flex-1 overflow-hidden">
            <div className="flex flex-1 flex-col border-r border-border-default">
              <div className="flex items-center justify-between border-b border-border-default bg-primary-surface px-4 py-2">
                <h2 className="text-sm font-semibold text-text-secondary">Input</h2>
                <span className="text-xs text-text-disabled">Paste or type JSON here</span>
              </div>
              <div className="flex-1 overflow-hidden">
                <Editor height="100%" language="json" value={input} onChange={(value) => setInput(value || '')} theme={editorTheme} options={editorOptions} />
              </div>
            </div>
            <div className="flex flex-1 flex-col">
              <div className="flex items-center justify-between border-b border-border-default bg-primary-surface px-4 py-2">
                <h2 className="text-sm font-semibold text-text-secondary">Output</h2>
                {error && <div className="flex items-center gap-2 text-xs text-neon-red"><svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>Error: {error.message}</div>}
                {isValid && !error && output && <div className="flex items-center gap-2 text-xs text-neon-green"><svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>Valid JSON</div>}
              </div>
              <div className="flex-1 overflow-hidden">
                <Editor height="100%" language="json" value={output} onChange={(value) => setOutput(value || '')} theme={editorTheme} options={editorOptions} />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-border-default bg-primary-sidebar px-6 py-2 text-xs text-text-secondary">
            <div className="flex items-center gap-6">
              <span>Lines: {stats.lines}</span>
              <span>Size: {formatBytes(stats.size)}</span>
            </div>
            <div className="flex items-center gap-2">
              {isValid ? <span className="text-neon-green"> Valid</span> : error ? <span className="text-neon-red"> Invalid</span> : <span className="text-text-disabled">Ë No validation</span>}
            </div>
          </div>
        </div>
        {sidebarOpen && (
          <aside className="w-80 border-l border-border-default bg-primary-sidebar">
            <HistoryPanel items={historyItems} onItemClick={handleHistoryItemClick} onItemDelete={handleHistoryItemDelete} onClearAll={handleClearAllHistory} />
          </aside>
        )}
      </div>
    </div>
  )
}

export default App
