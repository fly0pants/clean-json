# Clean JSON - Modern JSON Formatter & Validator

<div align="center">

![Clean JSON](https://img.shields.io/badge/Clean-JSON-00d4ff?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tests](https://img.shields.io/badge/Tests-140+-00ff9f?style=for-the-badge)

打造一个现代化、高性能的在线 JSON 工具，提供格式化、验证、编辑等核心功能

[Live Demo](#) | [Documentation](./TEST_PLAN.md) | [Contributing](#)

</div>

---

## ✨ 核心功能

### 🔄 JSON String ↔ Object 双向转换
- 智能识别输入类型
- JSON String → JSON Object（解析和格式化）
- JSON Object → JSON String（字符串化，带转义）

### ✅ JSON 验证
- 实时语法验证
- 精确错误定位（行号、列号）
- 友好的错误提示和修复建议

### 🎨 JSON 格式化
- 自定义缩进（2/4 空格、Tab）
- 键名排序
- 语法高亮（Monaco Editor）
- 支持大数字（BigInt）

### 📦 JSON 压缩
- 移除所有空白字符
- 压缩率统计
- 大小对比

### 📜 历史记录
- localStorage 本地存储
- 最多保存 10 条记录
- 搜索历史
- 隐私模式

---

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 运行测试
```bash
# 所有测试
npm run test

# 监听模式
npm run test:watch

# 覆盖率报告
npm run test:coverage

# UI 模式
npm run test:ui
```

### 构建生产版本
```bash
npm run build
```

### 预览生产版本
```bash
npm run preview
```

---

## 📊 测试覆盖率

| 模块 | 测试用例 | 覆盖率目标 | 状态 |
|------|---------|-----------|------|
| JSON Formatter | 30+ | 100% | ✅ |
| JSON Validator | 25+ | 100% | ✅ |
| JSON Converter | 20+ | 100% | ✅ |
| JSON Compressor | 25+ | 100% | ✅ |
| History Manager | 40+ | 100% | ✅ |
| **总计** | **140+** | **100%** | ✅ |

---

## 🏗️ 技术栈

### 核心框架
- **React 18** - UI 框架
- **TypeScript** - 类型安全
- **Vite 5** - 构建工具

### 代码编辑器
- **Monaco Editor** - VS Code 同款编辑器

### 状态管理
- **Zustand** - 轻量级状态管理

### UI 框架
- **Tailwind CSS** - 原子化 CSS
- 自定义组件（赛博朋克风格）

### 测试框架
- **Vitest** - 单元测试
- **Testing Library** - React 组件测试

### 其他工具
- **json-bigint** - 大数字支持
- **date-fns** - 日期格式化
- **react-hot-toast** - 通知提示

---

## 📁 项目结构

```
clean-json/
├── src/
│   ├── core/                    # 核心业务逻辑
│   │   ├── json-formatter.ts    # JSON 格式化
│   │   ├── json-validator.ts    # JSON 验证
│   │   ├── json-converter.ts    # String ↔ Object 转换
│   │   └── json-compressor.ts   # JSON 压缩
│   ├── utils/                   # 工具函数
│   │   └── history-manager.ts   # 历史记录管理
│   ├── hooks/                   # 自定义 Hooks
│   ├── store/                   # Zustand 状态管理
│   ├── components/              # UI 组件
│   ├── styles/                  # 样式文件
│   └── types/                   # TypeScript 类型
├── tests/                       # 测试文件
│   ├── unit/                    # 单元测试
│   ├── integration/             # 集成测试
│   └── setup.ts                 # 测试配置
├── PRD.md                       # 产品需求文档
├── UI_DESIGN.md                 # UI 设计规范
├── TECHNICAL_PLAN.md            # 技术方案
├── TEST_PLAN.md                 # 测试计划
└── TESTING_GUIDE.md             # 测试指南
```

---

## 🎨 设计系统

### 配色方案（暗色主题）
```css
Primary Background:    #0a0e27
Surface Background:    #1a1f3a
Neon Blue (Primary):   #00d4ff
Neon Pink (Secondary): #ff006e
Neon Green (Success):  #00ff9f
Neon Yellow (Warning): #ffb800
Neon Red (Error):      #ff3366
```

详见 [UI_DESIGN.md](./UI_DESIGN.md)

---

## 📖 文档

- [产品需求文档 (PRD)](./PRD.md)
- [UI 设计规范](./UI_DESIGN.md)
- [技术架构方案](./TECHNICAL_PLAN.md)
- [测试计划](./TEST_PLAN.md)
- [测试指南](./TESTING_GUIDE.md)

---

## 🧪 TDD 开发流程

本项目采用**测试驱动开发（TDD）**模式：

1. **Red** - 先写测试（失败）✅
2. **Green** - 实现功能（通过）✅
3. **Refactor** - 优化代码（保持通过）⏳

所有核心模块都有完整的测试覆盖。

---

## 🚀 部署

### Vercel（推荐）
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### GitHub Pages
```bash
npm run build
# 部署 dist/ 目录
```

---

## 📊 性能指标

| 指标 | 目标 | 实际 |
|------|------|------|
| 首屏加载 | < 2s | ⏳ |
| 格式化响应（1KB） | < 10ms | ⏳ |
| 格式化响应（1MB） | < 100ms | ⏳ |
| Lighthouse 性能 | > 90 | ⏳ |

---

## 🤝 贡献指南

欢迎贡献！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

### 提交规范
```
feat: 新功能
fix: 修复
docs: 文档
style: 样式
refactor: 重构
test: 测试
chore: 构建/工具
```

---

## 📄 许可证

MIT License

---

## 🙏 致谢

- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [Vite](https://vitejs.dev/)
- [Vitest](https://vitest.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

---

<div align="center">

**Made with ❤️ by Clean JSON Team**

[⬆ 回到顶部](#clean-json---modern-json-formatter--validator)

</div>
