# 酒馆助手前端界面或脚本编写 - Agent 指南

本项目用于编写酒馆助手 (Tavern Helper) 所支持的前端界面或脚本。代码在酒馆 (SillyTavern) 中以前台或后台形式运行。

## 构建命令

- `pnpm build` - 生产模式构建
- `pnpm build:dev` - 开发模式构建
- `pnpm watch` - 开发模式热重载监听（与酒馆实时同步）
- `pnpm format` - 使用 Prettier 格式化代码
- `pnpm lint` - 使用 ESLint 检查代码
- `pnpm lint:fix` - ESLint 自动修复
- `pnpm dump` - 将所有 schema.ts 转换为 schema.json

注意：项目没有测试框架，不需要运行测试命令。

## 项目结构

前端界面或脚本项目位于 `src/` 或 `示例/` 文件夹中：
- **前端界面**：文件夹中包含 `index.ts` 和 `index.html`
- **脚本**：文件夹中仅包含 `index.ts`

路径别名：
- `@/*` → `./src/*`
- `@util/*` → `./util/*`

## 代码风格指南

### 1. 语言与类型
- **必须使用 TypeScript**，而非 JavaScript
- 遵循 strict 模式（tsconfig.json 已配置）
- 禁止使用 `as any`、`@ts-ignore`、`@ts-expect-error`

### 2. 导入规范

自动导入（无需显式导入）：
- Vue 3 API（ref, computed, watch, 等）
- Pinia API（defineStore, storeToRefs, 等）
- @vueuse/core
- `dedent` (dedent.default)
- `klona` (klona.default)
- `useModal` (vue-final-modal)
- `z` (zod)

特殊导入方式：
- `import content from './file?raw'` - 导入原始文件内容（TS/SCSS 会先打包）
- `import html from './file.html'` - 通过 html-loader 最小化导入
- `import markdown from './file.md'` - 通过 remark-loader 解析为 HTML
- `import Component from './file.vue'` - 导入 Vue 组件
- `import './index.scss'` - 导入全局 SCSS（自动插入到 `<head>`）

### 3. 前端界面编写（Vue）

优先使用 Vue 编写界面：
- 使用 `<script setup>` 语法
- 使用 Pinia 管理状态
- 使用 `<style scoped>` 或 TailwindCSS 编写样式
- Vue Router 必须使用 `history: createMemoryHistory()`

数据持久化示例：
```typescript
const Schema = z.object({ button_selected: z.boolean().default(false) });
const settings = ref(Schema.parse(getVariables({ type: 'script', script_id: getScriptId() })));
watchEffect(() => replaceVariables(klona(settings.value), { type: 'script', script_id: getScriptId() }));
```

### 4. 脚本编写

脚本运行在无沙盒 iframe 中：
- jQuery 直接作用于酒馆页面（通过 `window.parent.$`）
- 向酒馆页面挂载 Vue 组件时使用 `createScriptIdDiv()` 或 `createScriptIdIframe()`
- 使用 `teleportStyle()` 将样式复制到酒馆页面

加载/卸载时机：
```typescript
// 加载时 - 禁止使用 DOMContentLoaded
$(() => {
  console.info('脚本加载');
});

// 卸载时 - 使用 pagehide 而非 unload
$(window).on('pagehide', () => {
  console.info('脚本卸载');
});
```

### 5. 样式编写

优先级：
1. **TailwindCSS** - 直接在 Vue 组件的 `<template>` 中使用
2. `<style scoped>` - Vue 组件内样式
3. 全局 SCSS - `import './index.scss'`

TailwindCSS 可直接使用，无需导入。注意：脚本向酒馆页面挂载组件时禁止使用 TailwindCSS（避免类名冲突）。

### 6. 第三方库使用

推荐使用以下库：
- **jQuery** - DOM 操作
- **Vue 3 + Pinia** - 界面和状态管理
- **Zod 4** - 数据校验（使用 `z.prettifyError()` 格式化错误）
- **GSAP** - 动画效果
- **@vueuse/core** - Vue 组合式工具函数
- **@pixi/react** - 多媒体资源丰富的界面

避免使用 Node.js 库，因为代码在浏览器中运行。

### 7. 酒馆助手接口

优先使用 `@types/function/` 中定义的接口，而非酒馆原生接口：
- `getChatMessages()`, `setChatMessages()` - 消息楼层操作
- `getVariables()`, `replaceVariables()` - 酒馆变量读写
- `getWorldbook()`, `replaceWorldbook()` - 世界书操作
- `generate()`, `generateRaw()` - AI 生成请求

禁止直接使用 STScript 命令，应通过 `triggerSlash()` 函数调用。

### 8. 错误处理与日志

日志记录：
- `console.info()` - 关键节点日志
- `console.warn()` / `console.error()` - 可恢复错误
- `throw Error()` - 无法继续使用的错误

错误捕获：
```typescript
function init() { /* ... */ }

$(() => {
  errorCatched(init)();
});
```

### 9. MVU 变量框架（如涉及）

使用 MVU 时必须在代码顶部：
```typescript
await waitGlobalInitialized('Mvu');
await waitUntil(() => _.has(getVariables({type: 'message'}), 'stat_data'));
```

### 10. ESLint 规则

主要规则（已配置）：
- `no-var` - 必须使用 let/const
- `yoda` - 条件判断避免 Yoda 表达式
- `no-floating-decimal` - 数字必须包含前导零
- `import-x/no-cycle` - 禁止循环导入

关闭的规则：
- `no-undef` - 因全局变量（$、_、toastr、YAML 等）
- `@typescript-eslint/no-explicit-any` - 允许 any 类型（但建议尽量避免）

## MCP 使用

使用 chrome-devtools 连接浏览器：
- 从中读取或操纵酒馆网页
- 检查 `$('#extensions_settings')` 中的热重载开关
- 获取 DOM 情况、Console 情况

## 注意事项

1. 前端界面 `index.html` 只能写静态 `<body>` 内容，禁止引用其他文件
2. 禁止在 `index.html` 中使用 `src=""` 占位的 `<img>` 标签
3. 流式楼层界面使用 `util/streaming.ts` 中的 `mountStreamingMessage` 函数
4. 重载前端界面/脚本使用 `window.location.reload()`
5. 前端界面高度调整避免使用 `vh` 单位，使用 `aspect-ratio` 替代
