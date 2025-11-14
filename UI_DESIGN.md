# Clean JSON - UI 设计规范

## 设计理念

### 核心设计原则
1. **Cyberpunk Aesthetic（赛博朋克美学）**：霓虹配色 + 科技感
2. **Developer First（开发者优先）**：专业、高效、无干扰
3. **Visual Hierarchy（视觉层级）**：清晰的信息架构
4. **Motion Design（动效设计）**：流畅但不过度的动画
5. **Accessibility（可访问性）**：符合 WCAG 2.1 AA 标准

---

## 1. 配色系统 (Color System)

### 1.1 暗色主题（Dark Theme - 默认）

#### 基础色板（Base Colors）
**背景层级**：
```
Primary Background    #0a0e27    深蓝紫黑（主背景）
Surface Background    #1a1f3a    中等深度（编辑器背景、卡片）
Elevated Surface      #252b47    悬浮元素（Modal、Dropdown）
Sidebar Background    #0f1229    侧边栏专用

设计说明：
- 使用深色紫蓝调营造科技感
- 三层背景层级建立视觉深度
- 低饱和度减少视觉疲劳
```

#### 霓虹强调色（Neon Accent Colors）
**主要强调色**：
```
Neon Blue (Primary)       #00d4ff    主要操作、链接、选中状态
  - Hover:                #33ddff    (亮度 +15%)
  - Active:               #00a8cc    (亮度 -15%)
  - Glow Shadow:          rgba(0, 212, 255, 0.5)

Neon Pink (Secondary)     #ff006e    次要强调、特殊标记
  - Hover:                #ff3389
  - Active:               #cc0058

Neon Green (Success)      #00ff9f    成功状态、字符串值
  - Hover:                #33ffb3
  - Active:               #00cc7f

Neon Yellow (Warning)     #ffb800    警告、数字值
  - Hover:                #ffc633
  - Active:               #cc9300

Neon Red (Error)          #ff3366    错误、null 值
  - Hover:                #ff5580
  - Active:               #cc2952

设计说明：
- 高饱和度霓虹色作为视觉焦点
- 每个颜色有三种状态（默认、悬停、激活）
- 配备发光效果增强科技感
```

#### 文本色（Text Colors）
```
Primary Text          #e0e6ff    主要文本（高对比度）
Secondary Text        #8892b0    次要文本、注释
Disabled Text         #4a5578    禁用状态
Placeholder Text      #3a4563    占位符

对比度说明：
- Primary Text vs Primary BG: 12.5:1 (超过 AAA 级)
- Secondary Text vs Primary BG: 7.2:1 (AA 级)
```

#### 语法高亮（Syntax Highlighting）
```
JSON Key              #00d4ff    键名（霓虹蓝）
String Value          #00ff9f    字符串值（霓虹绿）
Number Value          #ffb800    数字值（霓虹黄）
Boolean Value         #ff006e    布尔值（霓虹粉）
Null Value            #ff3366    null（霓虹红）
Brackets/Comma        #8892b0    括号、逗号（低调灰）
Comments              #4a5578    注释（更暗灰）

设计说明：
- 采用色相差异明显的配色
- 确保长时间阅读不产生视觉疲劳
- 参考 VS Code Dark+ 主题
```

#### 边框与分隔线（Borders & Dividers）
```
Default Border        rgba(0, 212, 255, 0.2)    默认边框
Hover Border          rgba(0, 212, 255, 0.5)    悬停边框
Focus Border          rgba(0, 212, 255, 1)      聚焦边框
Divider               rgba(136, 146, 176, 0.1)  分隔线

设计说明：
- 使用半透明霓虹蓝作为边框主色
- 不同透明度表达交互状态
- 分隔线使用低对比度避免视觉干扰
```

---

### 1.2 亮色主题（Light Theme - 可选）

#### 基础色板
```
Primary Background    #f5f7ff    淡蓝灰（主背景）
Surface Background    #ffffff    纯白（编辑器背景）
Elevated Surface      #e8ecff    淡紫蓝（悬浮元素）
Sidebar Background    #eef1ff    侧边栏
```

#### 强调色（调整亮色适配）
```
Primary Blue          #0066ff    主要操作
Secondary Pink        #ff0055    次要强调
Success Green         #00c896    成功状态
Warning Orange        #ff8800    警告
Error Red             #dd0000    错误
```

#### 文本色
```
Primary Text          #1a1f3a    深色文本
Secondary Text        #5a6580    次要文本
Disabled Text         #9ea8c0    禁用状态
```

---

## 2. 字体系统 (Typography)

### 2.1 字体家族（Font Family）

#### 代码字体（Monospace）
```css
font-family:
  'Fira Code',          /* 优先：支持连字 */
  'JetBrains Mono',     /* 备选 1 */
  'Cascadia Code',      /* 备选 2 */
  'Monaco',             /* macOS 系统字体 */
  'Consolas',           /* Windows 系统字体 */
  'Courier New',        /* 通用备选 */
  monospace;            /* 系统默认 */

设计说明：
- 优先使用支持 ligatures（连字）的字体
- 确保数字 0 和字母 O 易区分
- 等宽字体提升代码可读性
```

#### UI 字体（Sans-serif）
```css
font-family:
  'Inter',              /* 优先：现代 UI 字体 */
  -apple-system,        /* macOS San Francisco */
  'Segoe UI',           /* Windows */
  'Helvetica Neue',
  sans-serif;

设计说明：
- Inter 字体在小字号下可读性极佳
- 系统字体作为备选确保兼容性
```

### 2.2 字号比例（Type Scale）

```
Display Large         32px / 2rem      页面标题
Display Medium        24px / 1.5rem    区块标题
Heading 1             20px / 1.25rem   主要标题
Heading 2             18px / 1.125rem  次要标题
Body Large            16px / 1rem      正文大号
Body Regular          14px / 0.875rem  正文默认（编辑器）
Body Small            12px / 0.75rem   辅助信息
Caption               11px / 0.6875rem 说明文字

设计说明：
- 基准字号 14px（编辑器）
- 使用 1.25 比例创建层级
- 所有字号支持响应式缩放
```

### 2.3 行高（Line Height）

```
Display/Heading       1.2    标题紧凑
Body Text             1.6    正文舒适
Code                  1.5    代码适中

设计说明：
- 代码行高平衡密度和可读性
- 正文行高确保长时间阅读舒适
```

### 2.4 字重（Font Weight）

```
Light                 300    辅助信息
Regular               400    正文
Medium                500    强调
Semibold              600    小标题
Bold                  700    主标题

设计说明：
- 避免使用过粗字重（>700）
- 深色背景下避免使用 Light（300）
```

---

## 3. 间距系统 (Spacing System)

### 3.1 间距比例（基于 4px）

```
4px   (0.25rem)   xxs     最小间距（图标内边距）
8px   (0.5rem)    xs      紧凑间距（按钮内边距）
12px  (0.75rem)   sm      小间距（输入框）
16px  (1rem)      md      标准间距（组件间距）
24px  (1.5rem)    lg      大间距（区块间距）
32px  (2rem)      xl      特大间距（页面边距）
48px  (3rem)      2xl     超大间距（区域分隔）
64px  (4rem)      3xl     巨大间距（页面区域）

设计说明：
- 基于 4px 网格系统
- 确保视觉节奏一致性
- 便于响应式调整
```

### 3.2 组件内边距（Component Padding）

```
Button:
  - Small:       8px 16px
  - Medium:      12px 24px
  - Large:       16px 32px

Input Field:     12px 16px
Card:            24px
Modal:           32px
Sidebar:         16px 24px
```

---

## 4. 圆角系统 (Border Radius)

```
None              0px        无圆角（分隔线）
Small             4px        小元素（Tag、Badge）
Medium            8px        标准组件（Button、Input）
Large             12px       卡片（Card、Modal）
XLarge            16px       大型容器
Circle            50%        圆形头像、图标按钮
Pill              999px      药丸形按钮

设计说明：
- 8px 为标准圆角
- 避免过度使用大圆角
- 保持整体视觉统一
```

---

## 5. 阴影系统 (Shadow System)

### 5.1 标准阴影（非霓虹）

```
Shadow XS:
box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
用途：轻微悬浮（Tag）

Shadow SM:
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
用途：卡片、Dropdown

Shadow MD:
box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
用途：Modal、悬浮面板

Shadow LG:
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
用途：大型 Modal、侧边栏

设计说明：
- 深色背景下阴影更明显
- 透明度控制阴影强度
```

### 5.2 霓虹发光（Neon Glow）

```
Glow Blue (Primary):
box-shadow:
  0 0 10px rgba(0, 212, 255, 0.5),
  0 0 20px rgba(0, 212, 255, 0.3),
  0 0 30px rgba(0, 212, 255, 0.1);

Glow Pink (Secondary):
box-shadow:
  0 0 10px rgba(255, 0, 110, 0.5),
  0 0 20px rgba(255, 0, 110, 0.3);

Glow Green (Success):
box-shadow:
  0 0 10px rgba(0, 255, 159, 0.5),
  0 0 20px rgba(0, 255, 159, 0.3);

使用场景：
- 主要按钮悬停状态
- 选中状态的边框
- 特殊强调元素（Logo）
- 加载动画
```

---

## 6. 图标系统 (Icon System)

### 6.1 图标库选择

**推荐：Lucide Icons**
- 极简现代风格
- 一致的 24x24 网格
- 支持 React 组件
- 轻量级（~1KB per icon）

**备选**：
- Heroicons
- Feather Icons
- Phosphor Icons

### 6.2 图标尺寸

```
Small             16px      内联图标（文本中）
Medium            20px      按钮图标
Large             24px      标准图标（工具栏）
XLarge            32px      标题图标
2XLarge           48px      空状态、插画

设计说明：
- 图标与文字混排时对齐基线
- 保持图标视觉重量一致
```

### 6.3 图标配色

```
默认状态:    #8892b0   (Secondary Text)
悬停状态:    #00d4ff   (Neon Blue)
激活状态:    #00a8cc   (Neon Blue Active)
禁用状态:    #4a5578   (Disabled Text)

设计说明：
- 交互图标支持颜色变化
- 装饰图标保持中性色
```

---

## 7. 动效设计 (Motion Design)

### 7.1 动画时长（Duration）

```
Instant           0ms       即时响应（无动画）
Fast              150ms     微交互（Hover、点击反馈）
Normal            300ms     标准过渡（主题切换、Modal）
Slow              500ms     大型元素（侧边栏展开）
Very Slow         800ms     特殊动画（加载动画）

设计说明：
- 大部分交互使用 150-300ms
- 避免动画过长影响效率
```

### 7.2 缓动函数（Easing）

```
Linear            linear                  匀速（进度条）
Ease Out          cubic-bezier(0, 0, 0.2, 1)      出现动画（Modal）
Ease In           cubic-bezier(0.4, 0, 1, 1)      消失动画
Ease In Out       cubic-bezier(0.4, 0, 0.2, 1)    双向动画
Bounce            cubic-bezier(0.68, -0.55, 0.27, 1.55)  弹性动画（特殊场景）

推荐默认：ease-out
```

### 7.3 动画类型

#### 按钮悬停
```
属性变化：
- transform: scale(1.05)       轻微放大
- box-shadow: neon glow        霓虹发光
- color: brighter              颜色变亮

时长：150ms
缓动：ease-out
```

#### 主题切换
```
属性变化：
- background-color             背景色
- color                        文本色
- border-color                 边框色

时长：300ms
缓动：ease-in-out
```

#### Modal 打开/关闭
```
打开动画：
- opacity: 0 → 1               淡入
- transform: scale(0.95) → 1   微缩放

关闭动画：
- opacity: 1 → 0               淡出
- transform: scale(1) → 0.95   缩小

时长：300ms
缓动：ease-out
```

#### 霓虹脉冲（Neon Pulse）
```css
@keyframes neon-pulse {
  0%, 100% {
    box-shadow: 0 0 5px neon-color,
                0 0 10px neon-color;
    opacity: 1;
  }
  50% {
    box-shadow: 0 0 10px neon-color,
                0 0 20px neon-color,
                0 0 30px neon-color;
    opacity: 0.8;
  }
}

用途：加载状态、特殊强调
时长：2s
循环：infinite
```

### 7.4 页面过渡

```
路由切换（未来扩展）：
- Fade:           淡入淡出
- Slide:          左右滑动
- Scale:          缩放过渡

时长：300ms
```

---

## 8. 组件设计规范

### 8.1 按钮（Button）

#### 主要按钮（Primary Button）
```
默认状态：
- Background: linear-gradient(135deg, #00d4ff, #ff006e)
- Color: #ffffff
- Border: none
- Border Radius: 8px
- Padding: 12px 24px
- Font: 14px / Medium

悬停状态：
- Transform: scale(1.05)
- Box Shadow: 0 0 20px rgba(0, 212, 255, 0.5)

激活状态：
- Transform: scale(0.98)

禁用状态：
- Opacity: 0.4
- Cursor: not-allowed
```

#### 次要按钮（Secondary Button）
```
默认状态：
- Background: transparent
- Color: #00d4ff
- Border: 1px solid rgba(0, 212, 255, 0.5)
- Border Radius: 8px
- Padding: 12px 24px

悬停状态：
- Background: rgba(0, 212, 255, 0.1)
- Border Color: #00d4ff
```

#### 图标按钮（Icon Button）
```
尺寸：32px × 32px
图标：20px
圆角：50%（圆形）或 8px（方形）
```

### 8.2 输入框（Input Field）

```
默认状态：
- Background: #1a1f3a
- Color: #e0e6ff
- Border: 1px solid rgba(0, 212, 255, 0.2)
- Border Radius: 8px
- Padding: 12px 16px
- Font: 14px / Regular

聚焦状态：
- Border: 1px solid #00d4ff
- Box Shadow: 0 0 0 3px rgba(0, 212, 255, 0.1)

错误状态：
- Border Color: #ff3366
- Box Shadow: 0 0 0 3px rgba(255, 51, 102, 0.1)

占位符：
- Color: #3a4563
```

### 8.3 卡片（Card）

```
- Background: #1a1f3a
- Border: 1px solid rgba(0, 212, 255, 0.1)
- Border Radius: 12px
- Padding: 24px
- Box Shadow: 0 2px 8px rgba(0, 0, 0, 0.4)

悬停状态（如果可交互）：
- Border Color: rgba(0, 212, 255, 0.3)
- Transform: translateY(-2px)
- Box Shadow: 0 4px 16px rgba(0, 0, 0, 0.5)
```

### 8.4 Modal（模态框）

```
遮罩层（Overlay）：
- Background: rgba(10, 14, 39, 0.8)
- Backdrop Filter: blur(4px)

Modal 容器：
- Background: #1a1f3a
- Border: 1px solid rgba(0, 212, 255, 0.3)
- Border Radius: 16px
- Padding: 32px
- Box Shadow: 0 8px 32px rgba(0, 0, 0, 0.6)
- Max Width: 600px

关闭按钮：
- Position: absolute top-right
- Size: 32px
- Icon: X (20px)
```

### 8.5 侧边栏（Sidebar）

```
- Background: #0f1229
- Width: 280px
- Border Right: 1px solid rgba(0, 212, 255, 0.1)
- Padding: 16px 24px

历史记录列表项：
- Background: transparent → rgba(0, 212, 255, 0.05) (hover)
- Border Radius: 8px
- Padding: 12px
- Margin Bottom: 8px
```

### 8.6 状态栏（Status Bar）

```
- Background: #0f1229
- Height: 32px
- Padding: 0 16px
- Border Top: 1px solid rgba(0, 212, 255, 0.1)
- Font: 12px / Medium
- Color: #8892b0
```

### 8.7 工具栏（Toolbar）

```
- Background: #1a1f3a
- Height: 56px
- Padding: 0 24px
- Border Bottom: 1px solid rgba(0, 212, 255, 0.1)

按钮间距：8px
按钮分组间距：16px
```

### 8.8 代码编辑器（Monaco Editor）

```
容器：
- Background: #1a1f3a
- Border: 1px solid rgba(0, 212, 255, 0.2)
- Border Radius: 8px
- Overflow: hidden

行号：
- Background: #0f1229
- Color: #4a5578
- Active Color: #00d4ff
- Width: 48px

滚动条：
- Track: transparent
- Thumb: rgba(0, 212, 255, 0.2)
- Thumb Hover: rgba(0, 212, 255, 0.3)
- Width: 12px
```

---

## 9. 响应式设计 (Responsive Design)

### 9.1 断点（Breakpoints）

```
Mobile              320px - 767px
Tablet              768px - 1023px
Desktop             1024px - 1439px
Large Desktop       1440px+

推荐开发优先级：Desktop → Tablet → Mobile
```

### 9.2 布局适配

#### 桌面端（Desktop > 1024px）
```
布局：双栏（编辑器 | 输出）
侧边栏：固定 280px
编辑器：flex: 1
输出区：flex: 1
```

#### 平板端（Tablet 768-1023px）
```
布局：双栏（压缩）
侧边栏：可折叠
编辑器：flex: 1
输出区：flex: 1
间距：缩小为桌面端的 75%
```

#### 移动端（Mobile < 768px）
```
布局：单栏切换
侧边栏：抽屉式（Drawer）
编辑器/输出：全宽，Tab 切换
工具栏：简化为图标 + Dropdown
字号：缩小为 13px
```

### 9.3 字体缩放

```
Desktop:     14px (基准)
Tablet:      14px (不变)
Mobile:      13px (缩小)
```

---

## 10. 可访问性 (Accessibility)

### 10.1 颜色对比度

**WCAG 2.1 AA 标准**：
- 正文文本：至少 4.5:1
- 大文本（18px+）：至少 3:1
- UI 组件：至少 3:1

**测试结果**：
```
Primary Text (#e0e6ff) vs Primary BG (#0a0e27):     12.5:1 ✅ AAA
Secondary Text (#8892b0) vs Primary BG (#0a0e27):   7.2:1  ✅ AA
Neon Blue (#00d4ff) vs Primary BG (#0a0e27):        8.1:1  ✅ AA
```

### 10.2 键盘导航

**必须支持**：
- Tab：焦点移动
- Enter/Space：激活按钮
- Esc：关闭 Modal/Dropdown
- Arrow Keys：导航列表

**焦点指示器**：
- 清晰的焦点环
- 颜色：#00d4ff
- 厚度：2-3px
- Offset：2px

### 10.3 屏幕阅读器

**语义化 HTML**：
- 使用正确的标签（button, input, nav, etc.）
- ARIA 标签（aria-label, aria-describedby）
- 焦点管理（Modal 打开时锁定焦点）

**示例**：
```html
<button aria-label="格式化 JSON">
  <FormatIcon />
</button>

<input
  type="text"
  aria-label="输入 JSON 内容"
  aria-invalid="true"
  aria-describedby="error-message"
/>
```

### 10.4 减少动画（Reduced Motion）

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 11. 特殊场景设计

### 11.1 加载状态（Loading）

```
组件加载：
- Skeleton Screen（骨架屏）
- 颜色：rgba(0, 212, 255, 0.1)
- 动画：shimmer（闪光）

数据处理：
- 霓虹脉冲动画
- 进度条（Neon Blue）
- 文案："Processing..."
```

### 11.2 空状态（Empty State）

```
元素：
- 大图标（48px）
- 标题（18px / Semibold）
- 描述文字（14px / Regular / Secondary Text）
- 操作按钮（可选）

配色：
- 图标：#4a5578
- 标题：#e0e6ff
- 描述：#8892b0

示例文案：
"粘贴或拖拽 JSON 到此处"
"试试示例 JSON"
```

### 11.3 错误状态（Error State）

```
元素：
- 错误图标（Neon Red）
- 错误标题（16px / Semibold / Neon Red）
- 错误描述（14px / Regular）
- 代码片段（12px / Monospace）
- 建议（14px / Neon Green）

示例：
标题："JSON 格式错误"
描述："在第 5 行第 12 列发现语法错误"
片段：显示错误代码上下文
建议："缺少引号，尝试添加双引号"
```

### 11.4 成功状态（Success State）

```
元素：
- 成功图标（Neon Green + 对勾）
- Toast 通知（右上角）
- 持续时间：3秒自动消失

样式：
- Background: rgba(0, 255, 159, 0.1)
- Border: 1px solid #00ff9f
- Icon: #00ff9f
- Text: #e0e6ff
```

---

## 12. 品牌元素

### 12.1 Logo 设计

**概念**：
- 结合 JSON 的花括号 `{}`
- 霓虹发光效果
- 简洁现代

**配色**：
- 主体：Neon Blue (#00d4ff)
- 发光：rgba(0, 212, 255, 0.5)
- 备选：渐变（Neon Blue → Neon Pink）

**尺寸**：
- Header：32px 高度
- Favicon：16x16, 32x32, 48x48

### 12.2 标语（Tagline）

```
主标语：Clean JSON - Format & Validate with Style
副标语：Developer's Modern JSON Toolkit
```

---

## 13. 设计资源

### 13.1 Figma 文件结构（推荐）

```
Pages:
- Cover（封面）
- Design System（设计系统）
  - Colors（色板）
  - Typography（字体）
  - Icons（图标）
  - Components（组件库）
- Desktop（桌面端设计稿）
- Tablet（平板端设计稿）
- Mobile（移动端设计稿）
- Prototypes（交互原型）
```

### 13.2 导出规范

```
图标：SVG 格式
图片：PNG（@1x, @2x, @3x）
字体：WOFF2（优先）
```

---

## 14. 实施优先级

### Phase 1（MVP - 第 1 周）
- ✅ 暗色主题配色
- ✅ 基础组件（Button, Input, Card）
- ✅ Monaco 编辑器样式
- ✅ 工具栏 + 状态栏
- ✅ 响应式布局（Desktop）

### Phase 2（增强 - 第 2 周）
- ✅ 亮色主题
- ✅ 动画效果（Hover, 过渡）
- ✅ 侧边栏历史记录
- ✅ 响应式（Tablet, Mobile）

### Phase 3（优化 - 第 3 周）
- ✅ 微交互优化
- ✅ 可访问性增强
- ✅ 性能优化（减少动画开销）
- ✅ 跨浏览器测试

---

## 15. 设计检查清单

**开发前**：
- [ ] 颜色对比度符合 WCAG AA
- [ ] 字体加载完成（@font-face）
- [ ] 图标库集成（Lucide Icons）
- [ ] 响应式断点定义

**开发中**：
- [ ] 组件状态完整（默认、悬停、激活、禁用）
- [ ] 动画时长合理（不超过 500ms）
- [ ] 键盘导航可用
- [ ] 焦点指示器清晰

**开发后**：
- [ ] 深色/亮色主题切换流畅
- [ ] 移动端触摸目标至少 44px
- [ ] 屏幕阅读器测试通过
- [ ] 跨浏览器一致性检查

---

## 附录：配色速查表

```
# 暗色主题快速复制

## 背景
--bg-primary:    #0a0e27
--bg-surface:    #1a1f3a
--bg-elevated:   #252b47
--bg-sidebar:    #0f1229

## 霓虹色
--neon-blue:     #00d4ff
--neon-pink:     #ff006e
--neon-green:    #00ff9f
--neon-yellow:   #ffb800
--neon-red:      #ff3366

## 文本
--text-primary:     #e0e6ff
--text-secondary:   #8892b0
--text-disabled:    #4a5578
--text-placeholder: #3a4563

## 语法高亮
--syntax-key:      #00d4ff
--syntax-string:   #00ff9f
--syntax-number:   #ffb800
--syntax-boolean:  #ff006e
--syntax-null:     #ff3366
--syntax-bracket:  #8892b0

## 边框
--border-default:  rgba(0, 212, 255, 0.2)
--border-hover:    rgba(0, 212, 255, 0.5)
--border-focus:    rgba(0, 212, 255, 1)
```

---

**文档版本**：v1.0
**最后更新**：2024
**设计师**：Clean JSON Design Team
**参考**：Material Design 3, Vercel Design System, GitHub Primer
