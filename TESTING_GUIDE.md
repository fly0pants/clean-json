# Testing Guide - TDD Setup Complete ✅

## 概述

本项目采用 **TDD（测试驱动开发）** 模式，所有测试用例已根据 PRD 提前编写完成。

---

## 📁 测试文件结构

```
tests/
├── unit/                          # 单元测试
│   ├── core/                      # 核心业务逻辑测试
│   │   ├── json-formatter.test.ts    (30+ test cases)
│   │   ├── json-validator.test.ts    (25+ test cases)
│   │   ├── json-converter.test.ts    (20+ test cases)
│   │   └── json-compressor.test.ts   (25+ test cases)
│   ├── utils/                     # 工具函数测试
│   │   └── history-manager.test.ts   (40+ test cases)
│   └── hooks/                     # React Hooks 测试（待实现）
├── integration/                   # 集成测试（待实现）
├── performance/                   # 性能测试（待实现）
├── setup.ts                       # 测试环境配置
└── utils/
    └── test-helpers.ts            # 测试工具函数
```

---

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 运行测试

```bash
# 运行所有测试
npm run test

# 监听模式（开发时推荐）
npm run test:watch

# 仅运行一次（CI 环境）
npm run test:run

# 生成覆盖率报告
npm run test:coverage

# UI 模式（可视化界面）
npm run test:ui
```

---

## 📊 测试覆盖率目标

| 模块 | 目标覆盖率 | 状态 |
|------|-----------|------|
| Core 模块 | 100% | ⏳ 待实现 |
| Utils 模块 | 100% | ⏳ 待实现 |
| Hooks | 80%+ | ⏳ 待实现 |
| Components | 60%+ | ⏳ 待实现 |

---

## 🧪 测试统计

### 已编写测试用例总数：**140+**

#### 按模块分类：
- **JSON Formatter**: 30+ 测试用例
  - 基础格式化（5）
  - 缩进选项（2）
  - 键名排序（2）
  - 数据类型（4）
  - 边界情况（5）
  - 大数字处理（2）
  - 错误处理（5）
  - 性能测试（2）

- **JSON Validator**: 25+ 测试用例
  - 基础验证（6）
  - 错误检测（6）
  - 错误定位（4）
  - 错误提示（3）
  - 复杂结构（3）

- **JSON Converter**: 20+ 测试用例
  - String → Object（6）
  - Object → String（6）
  - 智能识别（4）
  - 往返转换（3）

- **JSON Compressor**: 25+ 测试用例
  - 基础压缩（7）
  - 压缩统计（5）
  - 字符串内容保留（4）
  - 边界情况（5）
  - 性能测试（2）

- **History Manager**: 40+ 测试用例
  - 添加记录（8）
  - 容量限制（4）
  - localStorage 持久化（5）
  - CRUD 操作（5）
  - 搜索功能（6）
  - 隐私模式（6）
  - 边界情况（5）

---

## 🎯 TDD 开发流程

### Red → Green → Refactor

#### 阶段 1: Red（失败）✅ **当前阶段**
- ✅ 编写测试用例（已完成）
- ✅ 运行测试（所有测试失败，因为功能未实现）

#### 阶段 2: Green（通过）⏳ **下一步**
- ⏳ 实现最小可行代码，使测试通过
- ⏳ 按模块顺序实现：
  1. JSON Formatter
  2. JSON Validator
  3. JSON Converter
  4. JSON Compressor
  5. History Manager

#### 阶段 3: Refactor（重构）⏳ **后续**
- ⏳ 优化代码质量
- ⏳ 提升性能
- ⏳ 确保测试仍然通过

---

## 🛠️ 测试工具和框架

### 核心工具
- **Vitest**: 快速的单元测试框架
- **@testing-library/react**: React 组件测试
- **@testing-library/jest-dom**: DOM 断言扩展
- **jsdom**: 浏览器环境模拟

### 配置文件
- `vitest.config.ts`: Vitest 配置
- `tests/setup.ts`: 测试环境初始化
- `tsconfig.json`: TypeScript 配置

---

## 📝 编写新测试

### 测试文件命名规范
```
src/core/json-formatter.ts  →  tests/unit/core/json-formatter.test.ts
```

### 测试模板
```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { YourModule } from '@/path/to/module'

describe('ModuleName', () => {
  let instance: YourModule

  beforeEach(() => {
    instance = new YourModule()
  })

  describe('Feature Group', () => {
    it('should do something specific', () => {
      const result = instance.method(input)
      expect(result).toBe(expected)
    })
  })
})
```

---

## 🔧 测试工具函数

### 可用的测试辅助函数
```typescript
import {
  generateJSON,           // 生成指定大小的 JSON
  generateNestedJSON,     // 生成深度嵌套的 JSON
  createMockHistoryItem,  // 创建模拟历史记录
  createMockFile,         // 创建模拟文件
  benchmark,              // 性能基准测试
  wait,                   // 异步等待
} from '@tests/utils/test-helpers'
```

### 示例用法
```typescript
// 生成 1KB 测试数据
const data = generateJSON(1024)

// 创建 100 层嵌套
const nested = generateNestedJSON(100)

// 性能测试
const result = benchmark(() => {
  formatter.format(data)
}, 100)

console.log(`Average: ${result.avg}ms`)
```

---

## 🎨 测试覆盖率报告

### 生成报告
```bash
npm run test:coverage
```

### 查看报告
```bash
# HTML 报告（推荐）
open coverage/index.html

# 终端输出
npm run test:coverage | grep -A 20 "Coverage"
```

### 覆盖率阈值
```typescript
// vitest.config.ts
coverage: {
  statements: 80,
  branches: 75,
  functions: 80,
  lines: 80,
}
```

---

## 🚦 CI/CD 集成

### GitHub Actions（自动运行测试）
```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:run
      - run: npm run test:coverage
```

---

## 🐛 调试测试

### VS Code 调试配置
在 `.vscode/launch.json` 添加：
```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Vitest Tests",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["run", "test"],
  "console": "integratedTerminal"
}
```

### 调试单个测试
```typescript
it.only('should debug this test', () => {
  // 只运行这个测试
  debugger
  expect(true).toBe(true)
})
```

---

## 📚 下一步：实现功能

### 实现顺序（按优先级）

#### 第 1 批：核心模块（P0）
```bash
# 创建核心模块文件
mkdir -p src/core src/utils src/hooks src/store

# 按顺序实现
1. src/core/json-formatter.ts
2. src/core/json-validator.ts
3. src/core/json-converter.ts
4. src/core/json-compressor.ts
5. src/utils/history-manager.ts
```

#### 实现步骤（以 JSON Formatter 为例）

**Step 1**: 创建文件骨架
```typescript
// src/core/json-formatter.ts
export interface FormatOptions {
  indent: number
  indentType: 'space' | 'tab'
  sortKeys?: boolean
}

export class JSONFormatter {
  format(input: string, options: FormatOptions): string {
    // TODO: 实现
    throw new Error('Not implemented')
  }
}
```

**Step 2**: 运行测试
```bash
npm run test:watch json-formatter
```

**Step 3**: 逐个通过测试
- 从最简单的测试开始
- 每次让一个测试通过
- 重复直到所有测试通过

**Step 4**: 重构优化
- 代码通过后再优化
- 确保测试仍然通过

---

## 📌 常见问题

### Q: 测试都失败怎么办？
**A**: 这是正常的！TDD 模式下，测试先写，功能后实现。当前所有测试都会失败，因为功能代码还未编写。

### Q: 如何运行特定测试文件？
**A**:
```bash
npm run test json-formatter
npm run test history-manager
```

### Q: 测试太慢怎么办？
**A**:
- 使用 `it.skip()` 跳过非关键测试
- 使用 `describe.only()` 只运行特定测试组
- 启用并行执行（已配置）

### Q: localStorage 在测试中不工作？
**A**: 已在 `tests/setup.ts` 中 mock，自动清理

---

## 📖 参考资料

- [Vitest 官方文档](https://vitest.dev/)
- [Testing Library 文档](https://testing-library.com/)
- [TDD 最佳实践](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [测试金字塔](https://martinfowler.com/articles/practical-test-pyramid.html)

---

## ✅ 检查清单

在开始实现之前，确认：
- [x] 所有测试文件已创建
- [x] 测试配置正确
- [x] 依赖已安装
- [x] 测试可以运行（失败是正常的）

准备开始实现：
- [ ] 创建 `src/` 目录结构
- [ ] 实现 JSONFormatter
- [ ] 实现 JSONValidator
- [ ] 实现 JSONConverter
- [ ] 实现 JSONCompressor
- [ ] 实现 HistoryManager

---

**测试驱动开发，从现在开始！** 🚀

让测试引导你的实现，确保每一行代码都有测试保障。
