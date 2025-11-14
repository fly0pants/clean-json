# JSON Formatter - 技术架构方案

## 文档说明
本文档专注于技术架构选型、系统设计和技术决策，不包含具体代码实现。

---

## 1. 技术栈选型

### 1.1 前端框架

**选择：React 18 + TypeScript**

**选型理由**：
1. **生态成熟度**
   - 丰富的第三方库（Monaco Editor、状态管理等）
   - 活跃的社区支持
   - 完善的工具链

2. **开发效率**
   - 组件化开发模式
   - Hooks 简化状态管理和副作用处理
   - 热更新提升开发体验

3. **类型安全**
   - TypeScript 提供静态类型检查
   - 减少运行时错误
   - 提升代码可维护性

4. **性能优势**
   - Virtual DOM 高效更新
   - Concurrent Mode（并发模式）
   - 适合高频交互场景（实时格式化）

**备选方案及对比**：
| 框架 | 优势 | 劣势 | 是否采用 |
|------|------|------|---------|
| Vue 3 | 学习曲线平缓，双向绑定 | 生态较 React 小 | ❌ |
| Svelte | 编译时优化，包体积小 | 生态不够成熟 | ❌ |
| Solid.js | 性能极致 | 生态太小，库支持少 | ❌ |

---

### 1.2 构建工具

**选择：Vite 5**

**选型理由**：
1. **开发体验**
   - 冷启动速度快（< 1s）
   - HMR（热模块替换）即时响应
   - 原生 ESM 支持

2. **生产构建**
   - 基于 Rollup 的优化打包
   - Tree Shaking 自动剔除死代码
   - 代码分割（Code Splitting）

3. **开箱即用**
   - 内置 TypeScript 支持
   - CSS 预处理器支持
   - 零配置启动

**对比其他构建工具**：
| 工具 | 冷启动 | HMR | 生产构建 | 学习成本 |
|------|--------|-----|---------|---------|
| Vite | ⚡️ 极快 | ⚡️ 即时 | ✅ 优秀 | 低 |
| Webpack | 🐢 慢 | 🟡 中等 | ✅ 成熟 | 高 |
| Parcel | 🟢 快 | 🟢 快 | 🟡 一般 | 低 |
| esbuild | ⚡️ 极快 | ⚡️ 极快 | 🟡 功能少 | 中 |

---

### 1.3 代码编辑器

**选择：Monaco Editor**

**选型理由**：
1. **功能强大**
   - VS Code 同款编辑器核心
   - 内置语法高亮（支持 JSON）
   - 内置语法验证和错误提示
   - 代码折叠（Folding）
   - 查找替换
   - 多光标编辑

2. **性能表现**
   - 虚拟滚动（Virtual Scrolling）
   - 支持大文件编辑（10MB+）
   - 懒加载优化

3. **可定制性**
   - 丰富的主题 API
   - 完整的配置选项
   - 支持自定义语法高亮规则

4. **TypeScript 友好**
   - 官方 React 绑定（@monaco-editor/react）
   - 完整的类型定义

**对比其他编辑器**：
| 编辑器 | 功能 | 性能 | 体积 | 可定制性 | 推荐度 |
|--------|------|------|------|---------|--------|
| Monaco | ⭐️⭐️⭐️⭐️⭐️ | ⭐️⭐️⭐️⭐️⭐️ | 🟡 2.5MB | ⭐️⭐️⭐️⭐️⭐️ | ✅ 采用 |
| CodeMirror 6 | ⭐️⭐️⭐️⭐️ | ⭐️⭐️⭐️⭐️⭐️ | ✅ 500KB | ⭐️⭐️⭐️⭐️ | 🟡 备选 |
| Ace Editor | ⭐️⭐️⭐️⭐️ | ⭐️⭐️⭐️ | ✅ 800KB | ⭐️⭐️⭐️ | ❌ |
| Textarea | ⭐️ | ⭐️⭐️⭐️⭐️⭐️ | ✅ 0KB | ⭐️ | ❌ |

**权衡考虑**：
- Monaco 体积较大（~2.5MB gzipped），但功能和体验远超轻量级编辑器
- 可通过 CDN + 懒加载优化首屏加载
- 对于专业 JSON 工具，Monaco 的投入是值得的

---

### 1.4 UI 框架

**选择：Tailwind CSS + 自定义组件**

**选型理由**：

1. **为什么选择 Tailwind CSS**
   - **开发效率**：原子化 CSS，无需切换文件
   - **可定制性**：完全控制设计系统
   - **性能优化**：PurgeCSS 自动移除未使用样式
   - **响应式**：内置断点系统
   - **暗色模式**：原生支持 dark mode

2. **为什么不用组件库（Ant Design / MUI）**
   - **设计自由度**：赛博朋克风格需要高度定制
   - **包体积**：组件库通常较大（100KB+）
   - **样式覆盖成本**：定制组件库样式工作量大
   - **品牌独特性**：避免"千篇一律"的设计

3. **自定义组件策略**
   - 基于 Headless UI（无样式组件库）
   - 使用 Radix UI Primitives（可访问性基础）
   - 自行实现视觉层（完全控制）

**方案对比**：
| 方案 | 开发速度 | 定制性 | 体积 | 适合场景 |
|------|---------|--------|------|---------|
| Tailwind + 自定义 | 🟢 快 | ⭐️⭐️⭐️⭐️⭐️ | ✅ 小 | 独特设计 ✅ |
| Ant Design | ⚡️ 最快 | ⭐️⭐️ | 🔴 大 | 后台系统 |
| Material UI | ⚡️ 快 | ⭐️⭐️⭐️ | 🔴 大 | Material 风格 |
| Chakra UI | 🟢 快 | ⭐️⭐️⭐️⭐️ | 🟡 中 | 现代设计 |

---

### 1.5 状态管理

**选择：Zustand**

**选型理由**：

1. **轻量级**
   - 包体积仅 1.2KB（gzipped）
   - 零依赖

2. **简单易用**
   - API 简洁直观
   - 无需 Provider 包裹
   - 支持 Hooks

3. **性能优异**
   - 细粒度更新（只更新订阅的组件）
   - 无不必要的重渲染

4. **功能完整**
   - 内置 persist 中间件（localStorage 持久化）
   - 支持 devtools
   - TypeScript 友好

**对比其他方案**：
| 方案 | 体积 | 学习成本 | 性能 | 持久化 | 推荐度 |
|------|------|---------|------|--------|--------|
| Zustand | ✅ 1.2KB | ⭐️⭐️⭐️⭐️⭐️ | ⭐️⭐️⭐️⭐️⭐️ | ✅ 内置 | ✅ 采用 |
| Redux Toolkit | 🔴 47KB | ⭐️⭐️⭐️ | ⭐️⭐️⭐️⭐️ | 🟡 需插件 | ❌ 过重 |
| Jotai | ✅ 3KB | ⭐️⭐️⭐️⭐️ | ⭐️⭐️⭐️⭐️⭐️ | 🟡 需插件 | 🟡 备选 |
| Context API | ✅ 0KB | ⭐️⭐️⭐️⭐️ | ⭐️⭐️ | ❌ 无 | ❌ 性能差 |
| MobX | 🟡 16KB | ⭐️⭐️⭐️ | ⭐️⭐️⭐️⭐️ | 🟡 需配置 | ❌ 过重 |

**状态管理策略**：
- **全局状态**：Zustand（主题、设置、历史记录）
- **局部状态**：React useState（表单、临时数据）
- **服务端状态**：无需（纯前端应用）

---

### 1.6 JSON 处理库

**选择：原生 JSON API + json-bigint**

**选型理由**：

1. **原生 JSON.parse/JSON.stringify**
   - 性能最优（浏览器原生实现）
   - 零依赖
   - 标准兼容

2. **json-bigint（增强）**
   - 解决大数字精度问题
   - JavaScript Number 安全整数范围：±2^53
   - 超出范围需使用 BigInt

**是否需要重型 JSON 库？**

| 库 | 功能 | 体积 | 是否采用 |
|-----|------|------|---------|
| lodash/fp | 函数式工具 | 🔴 70KB | ❌ 不需要 |
| immer | 不可变数据 | 🟡 14KB | ❌ 不需要 |
| fast-json-stringify | 快速序列化 | 🟡 20KB | ❌ 不需要 |

**结论**：原生 API 足够，仅引入 json-bigint（3KB）处理边缘情况

---

### 1.7 工具库

**精选原则**：
- ✅ 功能明确、体积小
- ✅ 维护活跃、无安全漏洞
- ❌ 避免"瑞士军刀"式的大而全库

**采用的工具库**：

| 库 | 版本 | 体积 | 用途 |
|-----|------|------|------|
| clsx | ^2.0 | 0.5KB | 条件类名组合 |
| copy-to-clipboard | ^3.3 | 1KB | 剪贴板操作 |
| file-saver | ^2.0 | 2KB | 文件下载 |
| react-hot-toast | ^2.4 | 4KB | 通知提示 |
| date-fns | ^3.0 | 20KB* | 日期格式化（仅导入需要的函数） |

**不采用的库**：
- ❌ Lodash（太大，优先使用原生 ES6+ 方法）
- ❌ Moment.js（过时，体积大）
- ❌ jQuery（完全不需要）

---

## 2. 系统架构设计

### 2.1 整体架构

**架构模式**：前端单页应用（SPA）

```
┌─────────────────────────────────────────────────────────┐
│                      浏览器层                             │
│  ┌───────────────────────────────────────────────────┐  │
│  │             React 应用层                           │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌──────────┐  │  │
│  │  │ UI 组件层   │  │ 状态管理层   │  │ 路由层    │  │  │
│  │  │ (Components)│  │ (Zustand)    │  │ (未来)    │  │  │
│  │  └─────────────┘  └─────────────┘  └──────────┘  │  │
│  │                                                     │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │           业务逻辑层 (Core)                   │  │  │
│  │  │  - JSON Formatter                            │  │  │
│  │  │  - JSON Validator                            │  │  │
│  │  │  - JSON Compressor                           │  │  │
│  │  │  - Error Detector                            │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  │                                                     │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │           工具层 (Utils)                      │  │  │
│  │  │  - File Handler                              │  │  │
│  │  │  - Clipboard                                 │  │  │
│  │  │  - Storage (localStorage)                    │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────┘  │
│                                                           │
│  ┌───────────────────────────────────────────────────┐  │
│  │        浏览器 API                                  │  │
│  │  - localStorage / sessionStorage                  │  │
│  │  - Clipboard API                                  │  │
│  │  - File API                                       │  │
│  │  - Web Worker (性能优化)                          │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**架构分层职责**：

1. **UI 组件层**（Presentation Layer）
   - 职责：视图渲染、用户交互
   - 原则：纯展示组件，无业务逻辑
   - 通信：通过 Props 接收数据，通过回调触发事件

2. **状态管理层**（State Management）
   - 职责：全局状态存储和同步
   - 范围：主题、编辑器设置、历史记录
   - 持久化：关键状态写入 localStorage

3. **业务逻辑层**（Business Logic）
   - 职责：JSON 处理核心算法
   - 特点：纯函数，可独立测试
   - 无依赖：不依赖 React、DOM

4. **工具层**（Utilities）
   - 职责：通用工具函数
   - 特点：高复用性、无副作用

---

### 2.2 目录结构设计

**设计原则**：
- 按功能模块划分（Feature-based）
- 清晰的层级关系
- 易于扩展和维护

```
clean-json/
├── public/                      # 静态资源
│   ├── favicon.ico
│   └── robots.txt
│
├── src/
│   ├── assets/                  # 资源文件
│   │   ├── icons/               # SVG 图标
│   │   └── images/              # 图片
│   │
│   ├── components/              # UI 组件（按功能分组）
│   │   ├── Editor/
│   │   │   ├── MonacoEditor.tsx
│   │   │   ├── EditorToolbar.tsx
│   │   │   └── EditorStatusBar.tsx
│   │   │
│   │   ├── JSONViewer/
│   │   │   ├── JSONTree.tsx
│   │   │   ├── JSONNode.tsx
│   │   │   └── SyntaxHighlight.tsx
│   │   │
│   │   ├── Toolbar/
│   │   │   ├── ActionButtons.tsx
│   │   │   ├── ThemeToggle.tsx
│   │   │   └── SettingsMenu.tsx
│   │   │
│   │   ├── Sidebar/
│   │   │   ├── HistoryPanel.tsx
│   │   │   ├── HistoryItem.tsx
│   │   │   └── HistorySearch.tsx
│   │   │
│   │   ├── ErrorDisplay/
│   │   │   ├── ErrorMessage.tsx
│   │   │   └── ErrorHighlight.tsx
│   │   │
│   │   └── Common/              # 通用组件
│   │       ├── Button.tsx
│   │       ├── Modal.tsx
│   │       ├── Dropdown.tsx
│   │       ├── Tooltip.tsx
│   │       └── Toast.tsx
│   │
│   ├── core/                    # 核心业务逻辑（纯函数）
│   │   ├── json-formatter.ts
│   │   ├── json-validator.ts
│   │   ├── json-compressor.ts
│   │   ├── json-converter.ts    # String ↔ Object 转换
│   │   └── error-detector.ts
│   │
│   ├── utils/                   # 工具函数
│   │   ├── file-handler.ts
│   │   ├── clipboard.ts
│   │   ├── storage.ts           # localStorage 封装
│   │   ├── debounce.ts
│   │   └── format-bytes.ts
│   │
│   ├── hooks/                   # 自定义 Hooks
│   │   ├── useJSONFormatter.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useTheme.ts
│   │   └── useKeyboard.ts
│   │
│   ├── store/                   # Zustand 状态管理
│   │   ├── editor-store.ts      # 编辑器状态
│   │   ├── history-store.ts     # 历史记录状态
│   │   └── app-store.ts         # 全局应用状态
│   │
│   ├── styles/                  # 样式文件
│   │   ├── globals.css          # 全局样式
│   │   ├── themes.css           # 主题 CSS 变量
│   │   ├── animations.css       # 动画定义
│   │   └── monaco-theme.ts      # Monaco 编辑器主题
│   │
│   ├── types/                   # TypeScript 类型定义
│   │   ├── json.types.ts
│   │   ├── editor.types.ts
│   │   └── app.types.ts
│   │
│   ├── config/                  # 配置文件
│   │   ├── constants.ts         # 常量定义
│   │   ├── editor-config.ts     # Monaco 编辑器配置
│   │   └── theme-config.ts      # 主题配置
│   │
│   ├── App.tsx                  # 根组件
│   ├── main.tsx                 # 应用入口
│   └── vite-env.d.ts            # Vite 类型定义
│
├── tests/                       # 测试文件
│   ├── unit/                    # 单元测试
│   │   ├── core/
│   │   └── utils/
│   └── e2e/                     # E2E 测试（未来）
│
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── PRD.md                       # 产品需求文档
├── TECHNICAL_PLAN.md            # 技术方案（本文档）
├── UI_DESIGN.md                 # UI 设计规范
└── README.md
```

**目录设计亮点**：
1. **按功能分组**：components 下按功能模块划分，非扁平化
2. **业务逻辑隔离**：core 目录纯函数，可独立测试
3. **清晰的层次**：UI → Hooks → Store → Core → Utils
4. **可扩展性**：添加新功能只需新增目录，不影响现有结构

---

### 2.3 核心模块设计

#### 2.3.1 JSON Formatter（格式化器）

**职责**：
- 将压缩的 JSON 转换为易读格式
- 支持自定义缩进（2/4 空格、Tab）
- 支持键名排序
- 处理大数字（BigInt）

**输入输出**：
```
输入：string (压缩的 JSON)
输出：string (格式化的 JSON) 或 Error

示例：
输入：'{"name":"John","age":30}'
输出：
{
  "name": "John",
  "age": 30
}
```

**架构设计**：
- 使用 json-bigint 解析（避免精度丢失）
- 递归格式化对象/数组
- 可选键名排序
- 错误增强（定位行列号）

**性能考虑**：
- < 1MB：主线程处理（< 100ms）
- 1-10MB：使用 debounce 防抖
- > 10MB：Web Worker 后台处理

---

#### 2.3.2 JSON Validator（验证器）

**职责**：
- 实时验证 JSON 语法
- 精确定位错误位置（行、列）
- 生成友好的错误提示
- 提供修复建议

**输出结构**：
```typescript
interface ValidationResult {
  valid: boolean
  error?: {
    message: string        // 友好的错误信息
    line: number           // 错误行号
    column: number         // 错误列号
    position: number       // 字符位置
    snippet: string        // 错误代码片段
    suggestion?: string    // 修复建议
  }
}
```

**错误检测策略**：
1. 尝试 JSON.parse()
2. 捕获错误并解析错误信息
3. 计算行列号
4. 生成代码片段（错误行 ± 2 行）
5. 智能生成修复建议

**常见错误及建议**：
| 错误类型 | 提示建议 |
|---------|---------|
| Unexpected token ',' | 多余的逗号，尝试删除 |
| Unexpected end | 缺少闭合括号 } 或 ] |
| Expected property name | 键名需要用双引号包裹 |
| Unexpected string | 可能缺少逗号 |

---

#### 2.3.3 JSON Converter（转换器）

**职责**：
- JSON String → JSON Object
- JSON Object → JSON String

**场景 1：String → Object**
```
输入：'"{\"name\":\"John\"}"'   (带转义的字符串)
输出：'{"name":"John"}'          (解析后的对象)
```

**场景 2：Object → String**
```
输入：'{"name":"John"}'          (普通对象)
输出：'"{\"name\":\"John\"}"'    (字符串化，带转义)
```

**智能识别策略**：
1. 检测输入是否以引号开头
2. 尝试双重解析（parse → parse）
3. 根据结果判断输入类型
4. 自动选择转换方向

---

#### 2.3.4 JSON Compressor（压缩器）

**职责**：
- 移除所有空白字符
- 生成最小化 JSON
- 计算压缩率

**输出信息**：
```typescript
interface CompressionStats {
  originalSize: number      // 原始字节数
  compressedSize: number    // 压缩后字节数
  ratio: string             // 压缩率（百分比）
  saved: number             // 节省字节数
}
```

**实现策略**：
- 使用 JSON.stringify() 无参数模式
- 计算 Blob 大小（准确字节数）
- 显示人类可读格式（KB、MB）

---

#### 2.3.5 History Manager（历史记录管理）

**职责**：
- 保存最近 10 条 JSON 记录
- 持久化到 localStorage
- 支持搜索、删除、清空

**存储结构**：
```typescript
interface HistoryItem {
  id: string                // 唯一 ID（时间戳）
  content: string           // JSON 内容（完整）
  preview: string           // 预览（前 100 字符）
  timestamp: number         // 保存时间
  size: number              // 字节数
  isValid: boolean          // 是否合法
}

type HistoryList = HistoryItem[]  // 最多 10 条
```

**存储策略**：
- 键名：`clean-json-history`
- 容量：最多 10 条，FIFO 策略
- 大小限制：单条 < 1MB（避免 localStorage 溢出）
- 自动清理：超出限制删除最旧记录

**隐私模式**：
- 提供"隐私模式"开关
- 开启时不写入 localStorage
- 仅保存在内存中（刷新即清空）

---

### 2.4 状态管理架构

**Zustand Store 设计**：

#### Store 1: Editor Store（编辑器状态）

**职责**：管理编辑器核心状态

**状态字段**：
```typescript
interface EditorState {
  // 内容
  input: string
  output: string

  // 格式化选项
  indentSize: 2 | 4
  indentType: 'space' | 'tab'
  sortKeys: boolean

  // 验证状态
  isValid: boolean
  error: ValidationError | null

  // 统计信息
  stats: {
    lines: number
    size: number
    compressedSize?: number
  }

  // Actions
  setInput: (input: string) => void
  setOutput: (output: string) => void
  setIndentSize: (size: 2 | 4) => void
  toggleSortKeys: () => void
  setValidation: (isValid: boolean, error?: any) => void
  updateStats: (input: string, output?: string) => void
  reset: () => void
}
```

**持久化字段**：
- indentSize
- indentType
- sortKeys

**不持久化字段**：
- input / output（避免泄露隐私）
- error（临时状态）

---

#### Store 2: History Store（历史记录）

**职责**：管理历史记录

**状态字段**：
```typescript
interface HistoryState {
  items: HistoryItem[]
  privacyMode: boolean

  // Actions
  addItem: (content: string) => void
  loadItem: (id: string) => void
  deleteItem: (id: string) => void
  clearHistory: () => void
  togglePrivacyMode: () => void
  searchHistory: (keyword: string) => HistoryItem[]
}
```

**持久化**：
- items（完整列表）
- privacyMode（用户偏好）

---

#### Store 3: App Store（全局应用状态）

**职责**：管理全局设置

**状态字段**：
```typescript
interface AppState {
  theme: 'dark' | 'light'
  sidebarOpen: boolean

  // Actions
  toggleTheme: () => void
  toggleSidebar: () => void
}
```

**持久化**：
- theme（用户偏好）
- sidebarOpen（布局状态）

---

### 2.5 数据流设计

**单向数据流**：

```
用户操作 → 触发 Action → 更新 Store → 触发组件重渲染 → 更新视图
   ↑                                                          ↓
   └──────────────────── 用户看到新视图 ←─────────────────────┘
```

**示例：格式化 JSON 流程**

```
1. 用户点击 "Format" 按钮
   ↓
2. Button 组件调用 onClick 回调
   ↓
3. 回调函数调用自定义 Hook: useJSONFormatter()
   ↓
4. Hook 从 Editor Store 获取 input
   ↓
5. Hook 调用 Core 层 JSONFormatter.format()
   ↓
6. 格式化成功，Hook 调用 Store.setOutput()
   ↓
7. Store 状态更新，触发订阅组件重渲染
   ↓
8. Monaco Editor 组件接收新的 output，显示格式化结果
   ↓
9. 同时更新 StatusBar（显示行数、大小）
```

---

## 3. 性能优化策略

### 3.1 首屏加载优化

**目标**：< 2s（4G 网络）

**优化手段**：

1. **代码分割（Code Splitting）**
   - Monaco Editor 懒加载
   - 路由级别分割（未来扩展）
   - 组件级别动态导入

2. **资源优化**
   - Vite 自动压缩（Gzip / Brotli）
   - 图片使用 WebP 格式
   - 图标使用 SVG

3. **CDN 加速**
   - Monaco Editor 使用 CDN
   - 字体使用 Google Fonts CDN

4. **预加载关键资源**
   - `<link rel="preload">` 加载关键字体
   - `<link rel="dns-prefetch">` 预解析 CDN 域名

**打包优化配置**：
- Tree Shaking（移除未使用代码）
- Minification（代码压缩）
- Chunk 拆分（vendor / app / monaco）

---

### 3.2 运行时性能优化

**目标**：格式化响应 < 100ms（1MB 内）

**优化手段**：

1. **防抖（Debounce）**
   - 实时格式化使用 300ms 防抖
   - 避免频繁计算

2. **Web Worker**
   - 大文件（> 10MB）在后台线程处理
   - 避免阻塞主线程

3. **虚拟滚动**
   - Monaco Editor 内置虚拟滚动
   - 大文件只渲染可见行

4. **React 优化**
   - 使用 React.memo 避免不必要渲染
   - 使用 useMemo 缓存计算结果
   - 使用 useCallback 缓存函数引用

5. **懒加载**
   - 历史记录面板按需加载
   - 设置面板按需加载

---

### 3.3 内存优化

**目标**：< 100MB

**优化手段**：

1. **限制历史记录**
   - 最多 10 条
   - 单条 < 1MB

2. **清理无用数据**
   - 定期清理 localStorage
   - 组件卸载时清理定时器

3. **避免内存泄漏**
   - 及时清理事件监听器
   - 清理 setInterval / setTimeout

---

## 4. 浏览器兼容性

### 4.1 目标浏览器

**支持版本**：
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**不支持**：
- IE 11（已停止维护）
- 移动端浏览器（首版不支持，未来考虑）

---

### 4.2 兼容性策略

**Polyfill 策略**：
- Vite 自动注入必要的 Polyfill
- 使用 @vitejs/plugin-legacy（如需支持旧浏览器）

**特性检测**：
- 检测 localStorage 支持
- 检测 Clipboard API 支持
- 优雅降级（如不支持则隐藏功能）

---

## 5. 安全性考虑

### 5.1 数据安全

**原则**：所有数据本地处理，不上传服务器

**措施**：
1. **无服务器依赖**
   - 纯前端应用，无后端
   - 无数据上传

2. **localStorage 安全**
   - 不存储敏感信息
   - 提供"隐私模式"

3. **XSS 防护**
   - React 自动转义 HTML
   - 避免使用 dangerouslySetInnerHTML

---

### 5.2 第三方依赖安全

**措施**：
1. 定期更新依赖（npm audit）
2. 使用 npm audit fix 修复漏洞
3. 避免使用废弃的包

---

## 6. 测试策略

### 6.1 单元测试

**测试框架**：Vitest + Testing Library

**测试覆盖**：
- Core 模块：100% 覆盖
- Utils 模块：100% 覆盖
- Hooks：80%+ 覆盖
- Components：关键组件覆盖

**测试重点**：
- JSON Formatter 各种输入场景
- JSON Validator 错误检测准确性
- History Manager CRUD 操作
- localStorage 持久化逻辑

---

### 6.2 E2E 测试（未来）

**测试框架**：Playwright

**测试场景**：
- 用户完整工作流
- 跨浏览器测试
- 响应式布局测试

---

## 7. 部署方案

### 7.1 构建命令

```bash
npm run build
```

**输出**：
- dist/ 目录
- HTML + CSS + JS（已压缩）

---

### 7.2 部署平台

**推荐平台**：

1. **Vercel**（首选）
   - 零配置部署
   - 全球 CDN
   - 自动 HTTPS
   - CI/CD 自动化

2. **Netlify**（备选）
   - 同样零配置
   - 表单处理（未来可用）

3. **GitHub Pages**（免费）
   - 静态托管
   - 无需服务器

**部署步骤**：
1. 连接 GitHub 仓库
2. 配置构建命令：`npm run build`
3. 配置输出目录：`dist`
4. 自动部署

---

### 7.3 性能监控

**工具**：
- Lighthouse CI（自动化性能测试）
- Web Vitals（关键指标监控）

**关键指标**：
- LCP（Largest Contentful Paint）< 2.5s
- FID（First Input Delay）< 100ms
- CLS（Cumulative Layout Shift）< 0.1

---

## 8. 开发规范

### 8.1 代码规范

**工具**：
- ESLint（代码检查）
- Prettier（代码格式化）
- TypeScript（类型检查）

**规则**：
- Airbnb Style Guide
- React Hooks 规则
- TypeScript Strict Mode

---

### 8.2 Git 提交规范

**格式**：
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type 类型**：
- feat：新功能
- fix：修复
- docs：文档
- style：样式（不影响逻辑）
- refactor：重构
- test：测试
- chore：构建/工具

**示例**：
```
feat(formatter): add BigInt support for large numbers

- Integrate json-bigint library
- Handle numbers beyond Number.MAX_SAFE_INTEGER
- Add unit tests for BigInt parsing

Closes #123
```

---

### 8.3 分支策略

```
main          生产分支（稳定版本）
  ↑
develop       开发分支（集成分支）
  ↑
feature/*     功能分支
hotfix/*      紧急修复
```

**工作流程**：
1. 从 develop 创建 feature 分支
2. 开发完成后 PR 到 develop
3. Code Review 通过后合并
4. 定期从 develop 合并到 main

---

## 9. 项目里程碑

### Phase 1 - MVP（2 周）
**目标**：核心功能可用

**交付物**：
- ✅ JSON 格式化（String ↔ Object）
- ✅ JSON 验证 + 错误提示
- ✅ JSON 压缩
- ✅ Monaco 编辑器集成
- ✅ 暗色主题
- ✅ 基础 UI 组件

**验收标准**：
- 格式化准确率 100%
- 错误定位准确率 > 95%
- 响应时间 < 100ms（1MB 内）

---

### Phase 2 - 增强（1 周）
**目标**：提升用户体验

**交付物**：
- ✅ 历史记录（localStorage）
- ✅ 搜索历史
- ✅ 文件上传/下载
- ✅ 亮色主题
- ✅ 快捷键支持

**验收标准**：
- 历史记录正常保存和加载
- 主题切换流畅
- 快捷键响应正常

---

### Phase 3 - 优化（1 周）
**目标**：性能和体验优化

**交付物**：
- ✅ 动画效果
- ✅ 响应式设计
- ✅ 性能优化（Web Worker）
- ✅ 单元测试

**验收标准**：
- Lighthouse 性能分数 > 90
- 移动端布局正常
- 测试覆盖率 > 80%

---

### Phase 4 - 扩展（未来）
**目标**：高级功能

**交付物**：
- JSON Schema 验证
- JSONPath 查询
- JSON Diff
- JSON ↔ YAML/XML 转换

---

## 10. 风险评估与应对

### 10.1 技术风险

**风险 1：Monaco Editor 体积过大**

- **影响**：首屏加载慢
- **概率**：高
- **应对**：
  - 使用 CDN 加载
  - 懒加载（按需引入）
  - 考虑 CodeMirror 6 作为备选

---

**风险 2：大文件处理性能**

- **影响**：浏览器卡顿
- **概率**：中
- **应对**：
  - Web Worker 后台处理
  - 虚拟滚动
  - 文件大小限制（10MB）

---

**风险 3：浏览器兼容性**

- **影响**：部分用户无法使用
- **概率**：低
- **应对**：
  - 明确目标浏览器版本
  - Polyfill 关键 API
  - 提供浏览器检测提示

---

### 10.2 项目风险

**风险 1：进度延期**

- **影响**：交付延迟
- **概率**：中
- **应对**：
  - 按 MVP → 增强 → 优化 分阶段交付
  - 优先实现核心功能
  - 降低非核心功能优先级

---

**风险 2：需求变更**

- **影响**：开发返工
- **概率**：中
- **应对**：
  - PRD 明确需求优先级
  - 模块化设计，易于调整
  - Code Review 把控质量

---

## 11. 总结

### 11.1 技术栈总览

| 层级 | 技术选型 | 理由 |
|------|---------|------|
| 前端框架 | React 18 + TypeScript | 生态成熟、类型安全 |
| 构建工具 | Vite 5 | 极快的开发体验 |
| 编辑器 | Monaco Editor | 功能强大、VS Code 同款 |
| UI 框架 | Tailwind CSS + 自定义 | 高度定制、体积小 |
| 状态管理 | Zustand | 轻量、简单、性能好 |
| JSON 处理 | 原生 API + json-bigint | 性能最优 |

---

### 11.2 核心优势

1. **现代化技术栈**
   - 使用最新稳定版本
   - 优秀的开发体验
   - 长期可维护

2. **高性能**
   - 首屏加载 < 2s
   - 格式化响应 < 100ms
   - 支持 10MB+ 大文件

3. **出色的用户体验**
   - 赛博朋克酷炫设计
   - 流畅的动画交互
   - 完善的错误提示

4. **隐私安全**
   - 纯前端处理
   - 无数据上传
   - 隐私模式支持

5. **可扩展性**
   - 模块化架构
   - 清晰的代码组织
   - 易于添加新功能

---

### 11.3 预期成果

**技术指标**：
- 性能：Lighthouse > 90 分
- 体积：初始加载 < 500KB（gzipped）
- 兼容性：支持主流浏览器 90+

**用户指标**：
- 格式化准确率：100%
- 错误定位准确率：> 95%
- 用户满意度：> 4.5/5

---

**文档版本**：v1.0
**最后更新**：2024
**维护团队**：Clean JSON Tech Team
