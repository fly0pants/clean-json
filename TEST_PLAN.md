# Clean JSON - 测试计划

## 测试策略

### 测试金字塔
```
        /\
       /  \      E2E Tests (10%)
      /----\     - 用户完整流程测试
     /      \
    /--------\   Integration Tests (20%)
   /          \  - 组件集成测试
  /------------\
 /              \ Unit Tests (70%)
/________________\ - 核心业务逻辑测试
```

### TDD 开发流程
1. ✅ **Red**: 编写测试（失败）
2. ✅ **Green**: 编写代码（通过）
3. ✅ **Refactor**: 重构优化

---

## 1. JSON Formatter（格式化器）测试用例

### 测试文件：`tests/unit/core/json-formatter.test.ts`

#### 1.1 基础格式化功能

**Test Case 1.1.1: 格式化简单对象**
```typescript
describe('JSONFormatter - Basic Formatting', () => {
  it('should format simple object with 2 spaces indent', () => {
    const input = '{"name":"John","age":30}'
    const expected = `{
  "name": "John",
  "age": 30
}`
    expect(formatter.format(input, { indent: 2 })).toBe(expected)
  })
})
```

**Test Case 1.1.2: 格式化简单数组**
```typescript
it('should format simple array', () => {
  const input = '[1,2,3,4,5]'
  const expected = `[
  1,
  2,
  3,
  4,
  5
]`
  expect(formatter.format(input, { indent: 2 })).toBe(expected)
})
```

**Test Case 1.1.3: 格式化嵌套对象**
```typescript
it('should format nested object', () => {
  const input = '{"user":{"name":"John","address":{"city":"NYC"}}}'
  const expected = `{
  "user": {
    "name": "John",
    "address": {
      "city": "NYC"
    }
  }
}`
  expect(formatter.format(input, { indent: 2 })).toBe(expected)
})
```

**Test Case 1.1.4: 格式化嵌套数组**
```typescript
it('should format nested array', () => {
  const input = '[[1,2],[3,4]]'
  const expected = `[
  [
    1,
    2
  ],
  [
    3,
    4
  ]
]`
  expect(formatter.format(input, { indent: 2 })).toBe(expected)
})
```

**Test Case 1.1.5: 格式化混合结构**
```typescript
it('should format mixed nested structure', () => {
  const input = '{"users":[{"name":"John"},{"name":"Jane"}]}'
  const expected = `{
  "users": [
    {
      "name": "John"
    },
    {
      "name": "Jane"
    }
  ]
}`
  expect(formatter.format(input, { indent: 2 })).toBe(expected)
})
```

#### 1.2 缩进选项测试

**Test Case 1.2.1: 使用 4 空格缩进**
```typescript
it('should format with 4 spaces indent', () => {
  const input = '{"name":"John"}'
  const expected = `{
    "name": "John"
}`
  expect(formatter.format(input, { indent: 4 })).toBe(expected)
})
```

**Test Case 1.2.2: 使用 Tab 缩进**
```typescript
it('should format with tab indent', () => {
  const input = '{"name":"John"}'
  const expected = "{\n\t\"name\": \"John\"\n}"
  expect(formatter.format(input, { indentType: 'tab' })).toBe(expected)
})
```

#### 1.3 键名排序测试

**Test Case 1.3.1: 按字母排序键名**
```typescript
it('should sort keys alphabetically when sortKeys is true', () => {
  const input = '{"z":1,"a":2,"m":3}'
  const expected = `{
  "a": 2,
  "m": 3,
  "z": 1
}`
  expect(formatter.format(input, { indent: 2, sortKeys: true })).toBe(expected)
})
```

**Test Case 1.3.2: 不排序键名（保持原序）**
```typescript
it('should preserve key order when sortKeys is false', () => {
  const input = '{"z":1,"a":2,"m":3}'
  const expected = `{
  "z": 1,
  "a": 2,
  "m": 3
}`
  expect(formatter.format(input, { indent: 2, sortKeys: false })).toBe(expected)
})
```

#### 1.4 数据类型测试

**Test Case 1.4.1: 处理字符串值**
```typescript
it('should handle string values correctly', () => {
  const input = '{"text":"Hello World"}'
  const expected = `{
  "text": "Hello World"
}`
  expect(formatter.format(input, { indent: 2 })).toBe(expected)
})
```

**Test Case 1.4.2: 处理数字值**
```typescript
it('should handle number values correctly', () => {
  const input = '{"int":42,"float":3.14,"negative":-10}'
  expect(formatter.format(input)).toContain('"int": 42')
  expect(formatter.format(input)).toContain('"float": 3.14')
})
```

**Test Case 1.4.3: 处理布尔值**
```typescript
it('should handle boolean values correctly', () => {
  const input = '{"isActive":true,"isDeleted":false}'
  expect(formatter.format(input)).toContain('"isActive": true')
  expect(formatter.format(input)).toContain('"isDeleted": false')
})
```

**Test Case 1.4.4: 处理 null 值**
```typescript
it('should handle null values correctly', () => {
  const input = '{"value":null}'
  expect(formatter.format(input)).toContain('"value": null')
})
```

#### 1.5 边界情况测试

**Test Case 1.5.1: 处理空对象**
```typescript
it('should handle empty object', () => {
  const input = '{}'
  expect(formatter.format(input)).toBe('{}')
})
```

**Test Case 1.5.2: 处理空数组**
```typescript
it('should handle empty array', () => {
  const input = '[]'
  expect(formatter.format(input)).toBe('[]')
})
```

**Test Case 1.5.3: 处理空字符串值**
```typescript
it('should handle empty string value', () => {
  const input = '{"text":""}'
  expect(formatter.format(input)).toContain('"text": ""')
})
```

**Test Case 1.5.4: 处理特殊字符**
```typescript
it('should handle special characters in strings', () => {
  const input = '{"text":"Hello\\nWorld\\t\\"Quote\\""}'
  expect(formatter.format(input)).toContain('Hello\\nWorld\\t\\"Quote\\"')
})
```

**Test Case 1.5.5: 处理 Unicode 字符**
```typescript
it('should handle Unicode characters', () => {
  const input = '{"chinese":"你好","emoji":"😀"}'
  expect(formatter.format(input)).toContain('"chinese": "你好"')
  expect(formatter.format(input)).toContain('"emoji": "😀"')
})
```

#### 1.6 大数字处理（BigInt）

**Test Case 1.6.1: 处理大整数**
```typescript
it('should handle large integers without precision loss', () => {
  const input = '{"bigNumber":9007199254740992}' // > Number.MAX_SAFE_INTEGER
  const result = formatter.format(input)
  expect(result).toContain('9007199254740992')
})
```

**Test Case 1.6.2: 处理超大数字**
```typescript
it('should handle very large numbers using BigInt', () => {
  const input = '{"huge":12345678901234567890}'
  const result = formatter.format(input)
  expect(result).toContain('12345678901234567890')
})
```

#### 1.7 错误处理测试

**Test Case 1.7.1: 拒绝无效 JSON**
```typescript
it('should throw error for invalid JSON', () => {
  const input = '{invalid json}'
  expect(() => formatter.format(input)).toThrow()
})
```

**Test Case 1.7.2: 拒绝未闭合的括号**
```typescript
it('should throw error for unclosed brackets', () => {
  const input = '{"name":"John"'
  expect(() => formatter.format(input)).toThrow()
})
```

**Test Case 1.7.3: 拒绝多余的逗号**
```typescript
it('should throw error for trailing comma', () => {
  const input = '{"name":"John",}'
  expect(() => formatter.format(input)).toThrow()
})
```

#### 1.8 性能测试

**Test Case 1.8.1: 处理中等大小 JSON（< 1MB）**
```typescript
it('should format 1MB JSON within 100ms', () => {
  const largeObject = { /* 生成 1MB 数据 */ }
  const input = JSON.stringify(largeObject)

  const start = performance.now()
  formatter.format(input)
  const duration = performance.now() - start

  expect(duration).toBeLessThan(100)
})
```

**Test Case 1.8.2: 处理深层嵌套（100 层）**
```typescript
it('should handle deeply nested objects (100 levels)', () => {
  let nested = '{"value":1}'
  for (let i = 0; i < 100; i++) {
    nested = `{"nested":${nested}}`
  }

  expect(() => formatter.format(nested)).not.toThrow()
})
```

---

## 2. JSON Validator（验证器）测试用例

### 测试文件：`tests/unit/core/json-validator.test.ts`

#### 2.1 基础验证功能

**Test Case 2.1.1: 验证合法 JSON**
```typescript
describe('JSONValidator - Basic Validation', () => {
  it('should return valid for correct JSON', () => {
    const input = '{"name":"John","age":30}'
    const result = validator.validate(input)
    expect(result.valid).toBe(true)
    expect(result.error).toBeUndefined()
  })
})
```

**Test Case 2.1.2: 检测语法错误**
```typescript
it('should detect syntax error', () => {
  const input = '{"name":"John"'
  const result = validator.validate(input)
  expect(result.valid).toBe(false)
  expect(result.error).toBeDefined()
})
```

**Test Case 2.1.3: 验证空字符串**
```typescript
it('should reject empty string', () => {
  const input = ''
  const result = validator.validate(input)
  expect(result.valid).toBe(false)
})
```

**Test Case 2.1.4: 验证空白字符串**
```typescript
it('should reject whitespace only string', () => {
  const input = '   \n  \t  '
  const result = validator.validate(input)
  expect(result.valid).toBe(false)
})
```

#### 2.2 错误定位测试

**Test Case 2.2.1: 定位错误行号**
```typescript
it('should locate error line number', () => {
  const input = `{
  "name": "John",
  "age": 30,
  "city": "NYC"
}`
  const result = validator.validate(input)
  expect(result.error?.line).toBe(4)
})
```

**Test Case 2.2.2: 定位错误列号**
```typescript
it('should locate error column number', () => {
  const input = '{"name":"John",}'
  const result = validator.validate(input)
  expect(result.error?.column).toBeGreaterThan(0)
})
```

**Test Case 2.2.3: 计算错误字符位置**
```typescript
it('should calculate error position', () => {
  const input = '{"name":"John",}'
  const result = validator.validate(input)
  expect(result.error?.position).toBe(15)
})
```

#### 2.3 错误提示测试

**Test Case 2.3.1: 生成友好的错误信息**
```typescript
it('should generate friendly error message', () => {
  const input = '{"name":"John",}'
  const result = validator.validate(input)
  expect(result.error?.message).toMatch(/多余的逗号|trailing comma/i)
})
```

**Test Case 2.3.2: 提供代码片段**
```typescript
it('should provide error code snippet', () => {
  const input = `{
  "name": "John",
  "age": 30,
}`
  const result = validator.validate(input)
  expect(result.error?.snippet).toContain('"age": 30,')
})
```

**Test Case 2.3.3: 提供修复建议**
```typescript
it('should provide fix suggestion for trailing comma', () => {
  const input = '{"name":"John",}'
  const result = validator.validate(input)
  expect(result.error?.suggestion).toMatch(/删除.*逗号/i)
})
```

#### 2.4 常见错误检测

**Test Case 2.4.1: 检测缺少引号**
```typescript
it('should detect missing quotes on key', () => {
  const input = '{name:"John"}'
  const result = validator.validate(input)
  expect(result.valid).toBe(false)
  expect(result.error?.suggestion).toMatch(/引号/i)
})
```

**Test Case 2.4.2: 检测单引号错误**
```typescript
it('should detect single quotes (should be double)', () => {
  const input = "{'name':'John'}"
  const result = validator.validate(input)
  expect(result.valid).toBe(false)
})
```

**Test Case 2.4.3: 检测缺少逗号**
```typescript
it('should detect missing comma', () => {
  const input = '{"name":"John" "age":30}'
  const result = validator.validate(input)
  expect(result.valid).toBe(false)
})
```

**Test Case 2.4.4: 检测未闭合括号**
```typescript
it('should detect unclosed bracket', () => {
  const input = '{"name":"John","address":{"city":"NYC"}'
  const result = validator.validate(input)
  expect(result.error?.suggestion).toMatch(/闭合括号/i)
})
```

---

## 3. JSON Converter（转换器）测试用例

### 测试文件：`tests/unit/core/json-converter.test.ts`

#### 3.1 String → Object 转换

**Test Case 3.1.1: 转换 JSON 字符串为对象**
```typescript
describe('JSONConverter - String to Object', () => {
  it('should convert JSON string to object', () => {
    const input = '"{\\\"name\\\":\\\"John\\\"}"'
    const expected = '{"name":"John"}'
    expect(converter.stringToObject(input)).toBe(expected)
  })
})
```

**Test Case 3.1.2: 处理嵌套转义**
```typescript
it('should handle nested escaped JSON string', () => {
  const input = '"{\\\"user\\\":{\\\"name\\\":\\\"John\\\"}}"'
  const result = converter.stringToObject(input)
  expect(result).toContain('"user"')
  expect(result).toContain('"name"')
})
```

**Test Case 3.1.3: 智能识别输入类型**
```typescript
it('should auto-detect input is a string', () => {
  const input = '"{\\\"name\\\":\\\"John\\\"}"'
  const result = converter.autoConvert(input)
  expect(result.type).toBe('string-to-object')
})
```

#### 3.2 Object → String 转换

**Test Case 3.2.1: 转换 JSON 对象为字符串**
```typescript
describe('JSONConverter - Object to String', () => {
  it('should convert JSON object to string', () => {
    const input = '{"name":"John"}'
    const expected = '"{\\\"name\\\":\\\"John\\\"}"'
    expect(converter.objectToString(input)).toBe(expected)
  })
})
```

**Test Case 3.2.2: 保留所有转义字符**
```typescript
it('should preserve all escape characters', () => {
  const input = '{"text":"Hello\\nWorld"}'
  const result = converter.objectToString(input)
  expect(result).toContain('\\\\n')
})
```

**Test Case 3.2.3: 处理特殊字符转义**
```typescript
it('should escape special characters', () => {
  const input = '{"quote":"\\"Hello\\""}'
  const result = converter.objectToString(input)
  expect(result).toContain('\\\\\\"')
})
```

#### 3.3 智能识别测试

**Test Case 3.3.1: 识别普通 JSON 对象**
```typescript
it('should detect input as normal JSON object', () => {
  const input = '{"name":"John"}'
  const result = converter.detect(input)
  expect(result).toBe('object')
})
```

**Test Case 3.3.2: 识别 JSON 字符串**
```typescript
it('should detect input as JSON string', () => {
  const input = '"{\\\"name\\\":\\\"John\\\"}"'
  const result = converter.detect(input)
  expect(result).toBe('string')
})
```

**Test Case 3.3.3: 双重解析检测**
```typescript
it('should handle double-parsed JSON', () => {
  const input = '"{\\\"name\\\":\\\"John\\\"}"'
  const parsed1 = JSON.parse(input)
  const parsed2 = JSON.parse(parsed1)
  expect(parsed2).toEqual({ name: 'John' })
})
```

---

## 4. JSON Compressor（压缩器）测试用例

### 测试文件：`tests/unit/core/json-compressor.test.ts`

#### 4.1 基础压缩功能

**Test Case 4.1.1: 移除所有空白字符**
```typescript
describe('JSONCompressor - Basic Compression', () => {
  it('should remove all whitespace', () => {
    const input = `{
  "name": "John",
  "age": 30
}`
    const expected = '{"name":"John","age":30}'
    expect(compressor.compress(input)).toBe(expected)
  })
})
```

**Test Case 4.1.2: 移除换行符**
```typescript
it('should remove all newlines', () => {
  const input = '{\n"name":\n"John"\n}'
  expect(compressor.compress(input)).not.toContain('\n')
})
```

**Test Case 4.1.3: 移除 Tab 字符**
```typescript
it('should remove all tabs', () => {
  const input = '{\t"name":\t"John"\t}'
  expect(compressor.compress(input)).not.toContain('\t')
})
```

#### 4.2 压缩统计测试

**Test Case 4.2.1: 计算原始大小**
```typescript
it('should calculate original size in bytes', () => {
  const input = '{"name":"John"}'
  const stats = compressor.getStats(input, compressor.compress(input))
  expect(stats.originalSize).toBeGreaterThan(0)
})
```

**Test Case 4.2.2: 计算压缩后大小**
```typescript
it('should calculate compressed size', () => {
  const input = `{
  "name": "John"
}`
  const compressed = compressor.compress(input)
  const stats = compressor.getStats(input, compressed)
  expect(stats.compressedSize).toBeLessThan(stats.originalSize)
})
```

**Test Case 4.2.3: 计算压缩率**
```typescript
it('should calculate compression ratio', () => {
  const input = `{
  "name": "John",
  "age": 30
}`
  const compressed = compressor.compress(input)
  const stats = compressor.getStats(input, compressed)
  expect(stats.ratio).toMatch(/^\d+\.\d+$/) // 格式：12.34
  expect(parseFloat(stats.ratio)).toBeGreaterThan(0)
})
```

**Test Case 4.2.4: 计算节省字节数**
```typescript
it('should calculate bytes saved', () => {
  const input = '{\n  "name": "John"\n}'
  const compressed = compressor.compress(input)
  const stats = compressor.getStats(input, compressed)
  expect(stats.saved).toBe(stats.originalSize - stats.compressedSize)
})
```

#### 4.3 边界情况测试

**Test Case 4.3.1: 压缩已压缩的 JSON**
```typescript
it('should return same result for already compressed JSON', () => {
  const input = '{"name":"John"}'
  const compressed = compressor.compress(input)
  expect(compressed).toBe(input)
})
```

**Test Case 4.3.2: 处理空对象**
```typescript
it('should compress empty object', () => {
  const input = '{\n\n}'
  expect(compressor.compress(input)).toBe('{}')
})
```

**Test Case 4.3.3: 保留字符串内的空白**
```typescript
it('should preserve whitespace inside strings', () => {
  const input = '{"text":"Hello World"}'
  const compressed = compressor.compress(input)
  expect(compressed).toContain('Hello World')
})
```

---

## 5. History Manager（历史记录）测试用例

### 测试文件：`tests/unit/utils/history-manager.test.ts`

#### 5.1 添加历史记录

**Test Case 5.1.1: 添加单条记录**
```typescript
describe('HistoryManager - Add Records', () => {
  it('should add a new history item', () => {
    const content = '{"name":"John"}'
    historyManager.addItem(content)

    const items = historyManager.getItems()
    expect(items).toHaveLength(1)
    expect(items[0].content).toBe(content)
  })
})
```

**Test Case 5.1.2: 自动生成唯一 ID**
```typescript
it('should generate unique ID for each item', () => {
  historyManager.addItem('{"a":1}')
  historyManager.addItem('{"b":2}')

  const items = historyManager.getItems()
  expect(items[0].id).not.toBe(items[1].id)
})
```

**Test Case 5.1.3: 记录时间戳**
```typescript
it('should record timestamp', () => {
  const before = Date.now()
  historyManager.addItem('{"name":"John"}')
  const after = Date.now()

  const item = historyManager.getItems()[0]
  expect(item.timestamp).toBeGreaterThanOrEqual(before)
  expect(item.timestamp).toBeLessThanOrEqual(after)
})
```

**Test Case 5.1.4: 生成预览文本**
```typescript
it('should generate preview (first 100 chars)', () => {
  const longContent = '{"data":"' + 'x'.repeat(200) + '"}'
  historyManager.addItem(longContent)

  const item = historyManager.getItems()[0]
  expect(item.preview.length).toBeLessThanOrEqual(100)
})
```

**Test Case 5.1.5: 计算文件大小**
```typescript
it('should calculate file size in bytes', () => {
  const content = '{"name":"John"}'
  historyManager.addItem(content)

  const item = historyManager.getItems()[0]
  expect(item.size).toBe(new Blob([content]).size)
})
```

**Test Case 5.1.6: 记录验证状态**
```typescript
it('should record validation status', () => {
  historyManager.addItem('{"valid":true}')
  historyManager.addItem('{invalid}')

  const items = historyManager.getItems()
  expect(items[0].isValid).toBe(true)
  expect(items[1].isValid).toBe(false)
})
```

#### 5.2 容量限制测试

**Test Case 5.2.1: 最多保存 10 条记录**
```typescript
it('should keep maximum 10 items', () => {
  for (let i = 0; i < 15; i++) {
    historyManager.addItem(`{"index":${i}}`)
  }

  expect(historyManager.getItems()).toHaveLength(10)
})
```

**Test Case 5.2.2: FIFO 删除最旧记录**
```typescript
it('should remove oldest item when exceeding limit', () => {
  for (let i = 0; i < 11; i++) {
    historyManager.addItem(`{"index":${i}}`)
  }

  const items = historyManager.getItems()
  expect(items[0].content).toContain('"index":10') // 最新的在前
  expect(items[items.length - 1].content).toContain('"index":1') // 最旧的（0 被删除）
})
```

**Test Case 5.2.3: 拒绝超大文件（> 1MB）**
```typescript
it('should reject item larger than 1MB', () => {
  const largeContent = '{"data":"' + 'x'.repeat(1024 * 1024) + '"}'

  expect(() => historyManager.addItem(largeContent)).toThrow(/too large/i)
})
```

#### 5.3 localStorage 持久化测试

**Test Case 5.3.1: 保存到 localStorage**
```typescript
it('should save to localStorage', () => {
  historyManager.addItem('{"name":"John"}')

  const stored = localStorage.getItem('clean-json-history')
  expect(stored).not.toBeNull()

  const parsed = JSON.parse(stored!)
  expect(parsed).toHaveLength(1)
})
```

**Test Case 5.3.2: 从 localStorage 加载**
```typescript
it('should load from localStorage on init', () => {
  const items = [
    { id: '1', content: '{"a":1}', timestamp: Date.now(), /* ... */ }
  ]
  localStorage.setItem('clean-json-history', JSON.stringify(items))

  const manager = new HistoryManager()
  expect(manager.getItems()).toHaveLength(1)
})
```

**Test Case 5.3.3: 同步更新 localStorage**
```typescript
it('should sync with localStorage on every change', () => {
  historyManager.addItem('{"a":1}')
  historyManager.addItem('{"b":2}')

  const stored = JSON.parse(localStorage.getItem('clean-json-history')!)
  expect(stored).toHaveLength(2)
})
```

#### 5.4 CRUD 操作测试

**Test Case 5.4.1: 加载单条记录**
```typescript
it('should load item by ID', () => {
  historyManager.addItem('{"name":"John"}')
  const id = historyManager.getItems()[0].id

  const item = historyManager.loadItem(id)
  expect(item.content).toBe('{"name":"John"}')
})
```

**Test Case 5.4.2: 删除单条记录**
```typescript
it('should delete item by ID', () => {
  historyManager.addItem('{"a":1}')
  historyManager.addItem('{"b":2}')

  const id = historyManager.getItems()[0].id
  historyManager.deleteItem(id)

  expect(historyManager.getItems()).toHaveLength(1)
})
```

**Test Case 5.4.3: 清空所有记录**
```typescript
it('should clear all history', () => {
  historyManager.addItem('{"a":1}')
  historyManager.addItem('{"b":2}')

  historyManager.clearHistory()

  expect(historyManager.getItems()).toHaveLength(0)
  expect(localStorage.getItem('clean-json-history')).toBe('[]')
})
```

#### 5.5 搜索功能测试

**Test Case 5.5.1: 按内容搜索**
```typescript
it('should search by content keyword', () => {
  historyManager.addItem('{"name":"John"}')
  historyManager.addItem('{"name":"Jane"}')
  historyManager.addItem('{"city":"NYC"}')

  const results = historyManager.searchHistory('name')
  expect(results).toHaveLength(2)
})
```

**Test Case 5.5.2: 搜索不区分大小写**
```typescript
it('should search case-insensitively', () => {
  historyManager.addItem('{"NAME":"John"}')

  const results = historyManager.searchHistory('name')
  expect(results).toHaveLength(1)
})
```

**Test Case 5.5.3: 搜索返回空数组（无匹配）**
```typescript
it('should return empty array when no match', () => {
  historyManager.addItem('{"name":"John"}')

  const results = historyManager.searchHistory('xyz')
  expect(results).toHaveLength(0)
})
```

#### 5.6 隐私模式测试

**Test Case 5.6.1: 启用隐私模式**
```typescript
it('should enable privacy mode', () => {
  historyManager.togglePrivacyMode()
  expect(historyManager.isPrivacyMode()).toBe(true)
})
```

**Test Case 5.6.2: 隐私模式下不保存到 localStorage**
```typescript
it('should not save to localStorage in privacy mode', () => {
  historyManager.togglePrivacyMode() // 开启
  historyManager.addItem('{"secret":"data"}')

  const stored = localStorage.getItem('clean-json-history')
  expect(stored).toBeNull()
})
```

**Test Case 5.6.3: 隐私模式下仍保存在内存**
```typescript
it('should still keep items in memory during privacy mode', () => {
  historyManager.togglePrivacyMode()
  historyManager.addItem('{"name":"John"}')

  expect(historyManager.getItems()).toHaveLength(1)
})
```

**Test Case 5.6.4: 关闭隐私模式后恢复保存**
```typescript
it('should resume saving to localStorage after disabling privacy mode', () => {
  historyManager.togglePrivacyMode() // 开启
  historyManager.addItem('{"temp":"data"}')
  historyManager.togglePrivacyMode() // 关闭
  historyManager.addItem('{"name":"John"}')

  const stored = JSON.parse(localStorage.getItem('clean-json-history')!)
  expect(stored).toHaveLength(1) // 只有关闭后的被保存
})
```

---

## 6. 工具函数测试用例

### 6.1 File Handler 测试

**测试文件**: `tests/unit/utils/file-handler.test.ts`

**Test Case 6.1.1: 读取文件内容**
```typescript
it('should read file content as text', async () => {
  const file = new File(['{"name":"John"}'], 'test.json', { type: 'application/json' })
  const content = await fileHandler.readFile(file)
  expect(content).toBe('{"name":"John"}')
})
```

**Test Case 6.1.2: 下载为 JSON 文件**
```typescript
it('should download JSON as file', () => {
  const content = '{"name":"John"}'
  const filename = 'data.json'

  // Mock file-saver
  const saveSpy = vi.spyOn(FileSaver, 'saveAs')
  fileHandler.downloadJSON(content, filename)

  expect(saveSpy).toHaveBeenCalledWith(
    expect.any(Blob),
    filename
  )
})
```

### 6.2 Clipboard 测试

**测试文件**: `tests/unit/utils/clipboard.test.ts`

**Test Case 6.2.1: 复制到剪贴板**
```typescript
it('should copy text to clipboard', async () => {
  const text = '{"name":"John"}'
  await clipboard.copy(text)

  // 验证 Clipboard API 被调用
  expect(navigator.clipboard.writeText).toHaveBeenCalledWith(text)
})
```

### 6.3 Storage 测试

**测试文件**: `tests/unit/utils/storage.test.ts`

**Test Case 6.3.1: 保存数据到 localStorage**
```typescript
it('should save data to localStorage', () => {
  storage.set('test-key', { name: 'John' })

  const stored = localStorage.getItem('test-key')
  expect(JSON.parse(stored!)).toEqual({ name: 'John' })
})
```

**Test Case 6.3.2: 从 localStorage 读取数据**
```typescript
it('should get data from localStorage', () => {
  localStorage.setItem('test-key', JSON.stringify({ name: 'John' }))

  const data = storage.get('test-key')
  expect(data).toEqual({ name: 'John' })
})
```

**Test Case 6.3.3: 删除 localStorage 数据**
```typescript
it('should remove data from localStorage', () => {
  storage.set('test-key', { name: 'John' })
  storage.remove('test-key')

  expect(localStorage.getItem('test-key')).toBeNull()
})
```

---

## 7. Hooks 测试用例

### 7.1 useJSONFormatter Hook

**测试文件**: `tests/unit/hooks/useJSONFormatter.test.ts`

**Test Case 7.1.1: 格式化 JSON**
```typescript
import { renderHook, act } from '@testing-library/react'

it('should format JSON on format()', () => {
  const { result } = renderHook(() => useJSONFormatter())

  act(() => {
    result.current.setInput('{"name":"John"}')
    result.current.format()
  })

  expect(result.current.output).toContain('"name": "John"')
})
```

**Test Case 7.1.2: 验证并格式化**
```typescript
it('should validate before formatting', () => {
  const { result } = renderHook(() => useJSONFormatter())

  act(() => {
    result.current.setInput('{invalid}')
    result.current.format()
  })

  expect(result.current.isValid).toBe(false)
  expect(result.current.error).toBeDefined()
})
```

### 7.2 useLocalStorage Hook

**测试文件**: `tests/unit/hooks/useLocalStorage.test.ts`

**Test Case 7.2.1: 初始化从 localStorage 读取**
```typescript
it('should initialize from localStorage', () => {
  localStorage.setItem('test-key', JSON.stringify({ name: 'John' }))

  const { result } = renderHook(() => useLocalStorage('test-key', {}))

  expect(result.current[0]).toEqual({ name: 'John' })
})
```

**Test Case 7.2.2: 更新时同步到 localStorage**
```typescript
it('should sync to localStorage on update', () => {
  const { result } = renderHook(() => useLocalStorage('test-key', {}))

  act(() => {
    result.current[1]({ name: 'Jane' })
  })

  const stored = JSON.parse(localStorage.getItem('test-key')!)
  expect(stored).toEqual({ name: 'Jane' })
})
```

---

## 8. 集成测试用例

### 8.1 完整工作流测试

**测试文件**: `tests/integration/json-workflow.test.ts`

**Test Case 8.1.1: 格式化 → 验证 → 压缩 → 保存历史**
```typescript
it('should complete full workflow', () => {
  const input = '{"name":"John","age":30}'

  // 1. 格式化
  const formatted = formatter.format(input)
  expect(formatted).toContain('"name": "John"')

  // 2. 验证
  const validation = validator.validate(formatted)
  expect(validation.valid).toBe(true)

  // 3. 压缩
  const compressed = compressor.compress(formatted)
  expect(compressed).toBe(input)

  // 4. 保存历史
  historyManager.addItem(input)
  expect(historyManager.getItems()).toHaveLength(1)
})
```

---

## 9. 性能基准测试

### 测试文件: `tests/performance/benchmarks.test.ts`

**Test Case 9.1: 格式化 1KB JSON < 10ms**
```typescript
it('should format 1KB JSON within 10ms', () => {
  const data = generateJSON(1024) // 1KB

  const times = []
  for (let i = 0; i < 100; i++) {
    const start = performance.now()
    formatter.format(data)
    times.push(performance.now() - start)
  }

  const avg = times.reduce((a, b) => a + b) / times.length
  expect(avg).toBeLessThan(10)
})
```

**Test Case 9.2: 格式化 1MB JSON < 100ms**
```typescript
it('should format 1MB JSON within 100ms', () => {
  const data = generateJSON(1024 * 1024) // 1MB

  const start = performance.now()
  formatter.format(data)
  const duration = performance.now() - start

  expect(duration).toBeLessThan(100)
})
```

---

## 10. 测试覆盖率目标

| 模块 | 目标覆盖率 | 优先级 |
|------|-----------|--------|
| **Core 模块** | 100% | P0 |
| - JSON Formatter | 100% | P0 |
| - JSON Validator | 100% | P0 |
| - JSON Converter | 100% | P0 |
| - JSON Compressor | 100% | P0 |
| **Utils 模块** | 100% | P0 |
| - History Manager | 100% | P0 |
| - File Handler | 90%+ | P1 |
| - Clipboard | 90%+ | P1 |
| - Storage | 100% | P0 |
| **Hooks** | 80%+ | P1 |
| **Components** | 60%+ | P2 |

---

## 11. 测试工具和框架

### 11.1 单元测试
- **Vitest**: 测试框架（Vite 原生支持）
- **@testing-library/react**: React 组件测试
- **@testing-library/user-event**: 用户交互模拟

### 11.2 Mock 工具
- **vi.mock()**: Vitest 内置 mock
- **@testing-library/react-hooks**: Hook 测试

### 11.3 断言库
- Vitest 内置 expect（兼容 Jest）

---

## 12. CI/CD 集成

### GitHub Actions 配置

```yaml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3
```

---

## 13. 测试执行命令

```bash
# 运行所有测试
npm run test

# 监听模式（开发时）
npm run test:watch

# 生成覆盖率报告
npm run test:coverage

# 运行特定测试文件
npm run test json-formatter

# 运行性能基准测试
npm run test:benchmark
```

---

## 总结

**测试用例总数**: 100+ 条

**分类统计**:
- JSON Formatter: 30+ 条
- JSON Validator: 20+ 条
- JSON Converter: 10+ 条
- JSON Compressor: 15+ 条
- History Manager: 25+ 条
- Utils & Hooks: 15+ 条
- Integration: 5+ 条

**覆盖场景**:
- ✅ 正常功能测试
- ✅ 边界条件测试
- ✅ 错误处理测试
- ✅ 性能基准测试
- ✅ 集成测试

**下一步**: 开始编写实际的测试代码！
