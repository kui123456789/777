# AGENTS.md — 酒馆助手开发模板

本项目为 SillyTavern（酒馆）的 Tavern Helper（酒馆助手）编写前端界面和脚本。

## 必读规则

开始任何工作前，**必须**读取 `.cursor/rules/` 下的所有 `.mdc`
文件（项目基本概念、酒馆变量、酒馆助手接口、脚本、前端界面、mvu角色卡、mvu变量框架、mcp）。

## 构建命令

```bash
pnpm build        # 生产打包
pnpm build:dev    # 开发打包
pnpm watch        # 开发模式（热重载，schema.ts → schema.json 自动生成）
pnpm lint         # ESLint 检查
pnpm lint:fix     # ESLint 自动修复
pnpm format       # Prettier 格式化
pnpm dump         # 生成 zod schema 的 JSON Schema
pnpm sync         # 同步酒馆数据
```

> **注意**：本项目无测试框架，不存在 `pnpm test` 命令。验证方式为 `pnpm lint` + `pnpm build` + 浏览器内检查。

## 项目结构

```
src/角色卡名/
  脚本/*/index.ts        # 脚本项目（仅 index.ts → 后台运行）
  界面/*/                 # 前端界面（index.ts + index.html → iframe 显示）
  schema.ts              # MVU 变量结构定义（zod 4）
  世界书/                 # 世界书条目
示例/                     # 参考示例（勿删除，AI 需参考）
初始模板/                 # 新项目模板
util/                     # 工具函数（common.ts, script.ts, mvu.ts, streaming.ts）
@types/                   # 酒馆助手接口类型（可直接使用，无需导入）
```

**判断项目类型**：文件夹有 `index.ts` + `index.html` = 前端界面；仅 `index.ts` = 脚本。

## 代码风格

### 格式化（Prettier + EditorConfig）

- 单引号，有分号，2 空格缩进，行宽 120
- 尾逗号 all，箭头函数单参数省略括号
- 换行符 LF，UTF-8 编码

### ESLint 关键规则

- `import-x/no-cycle`: error — 禁止循环导入
- `import-x/no-nodejs-modules`: warn — 禁止 Node.js 模块（浏览器环境）
- `no-var`: error，`prefer-const`: warn
- `@typescript-eslint/no-explicit-any`: off（允许 any）
- `no-floating-decimal`: error，`yoda`: error

### TypeScript 配置

- target/module: ESNext，strict: true
- noUnusedLocals/Parameters: true，noImplicitReturns: true
- 路径别名：`@util/*` → `./util/*`，`@/*` → `./src/*`

### 命名规范

- 文件夹/文件名：中文或英文均可
- 变量/函数：camelCase | 类型/接口：PascalCase

### 导入规范

```typescript
import { xxx } from '@util/common'; // 路径别名
import { Schema } from '@/角色卡名/schema'; // src 别名
import Component from './Component.vue'; // Vue 组件
import html from './file.html?raw'; // 文件内容（字符串）
import css from './style.scss?raw'; // 编译后的 CSS 字符串
import md from './doc.md'; // Markdown → HTML 字符串
import './index.scss'; // 前端界面全局样式
```

## 核心编码规范

### 生命周期（最重要）

```typescript
// ✅ 加载时执行（禁止 DOMContentLoaded，它不会触发！）
$(() => {
  errorCatched(init)();
});

// ✅ 卸载时清理（禁止 'unload'，使用 'pagehide'）
$(window).on('pagehide', () => {
  /* cleanup */
});
```

### 错误处理

```typescript
import { errorCatched } from '@util/common';
// 致命错误：throw Error + errorCatched 包裹顶层函数
// 可恢复：console.warn / console.error
// 关键节点：console.info 记录日志
```

### Vue 挂载

```typescript
// 前端界面：直接挂载到 #app
createApp(App).use(createPinia()).mount('#app');

// 脚本挂载到酒馆页面（需样式隔离时用 iframe）：
const $app = createScriptIdIframe()
  .appendTo('目标位置')
  .on('load', () => {
    teleportStyle($app[0].contentDocument!.head);
    app.mount($app[0].contentDocument!.body);
  });

// 脚本挂载到酒馆页面（不隔离，禁用 TailwindCSS）：
const $app = createScriptIdDiv().appendTo('目标位置');
app.mount($app[0]);
const { destroy } = teleportStyle(); // 卸载时调用 destroy()
```

### 响应式数据持久化（Pinia + Zod）

```typescript
const Settings = z.object({ enabled: z.boolean().default(false) }).prefault({});
export const useSettingsStore = defineStore('settings', () => {
  const settings = ref(Settings.parse(getVariables({ type: 'script', script_id: getScriptId() })));
  watchEffect(() => replaceVariables(klona(settings.value), { type: 'script', script_id: getScriptId() }));
  return { settings };
});
```

> **关键**：写回酒馆数据前必须 `klona()` 去除 Vue proxy。

### Vue Router

```typescript
// iframe 内必须用 createMemoryHistory()
const router = createRouter({ history: createMemoryHistory(), routes });
// createRouter() 必须在全局执行，不能在 $(() => {}) 内
```

## 技术栈优先级

1. **Vue 3 + Pinia + TailwindCSS** 编写界面（脚本挂载到酒馆页面时禁用 Tailwind）
2. **Zod 4** 数据校验（`z.coerce.number()`, `z.prefault()`, `z.record()`, `z.transform()`）
3. **酒馆助手 `@types/` 接口**优先于酒馆原生接口和 STScript
4. **GSAP** 制作所有动画，**jQuery/jQueryUI** 操作 DOM
5. **Pixi.js + @pixi/react** 用于多媒体/游戏场景
6. 禁止使用 Node.js 库（浏览器环境）

## 酒馆助手接口速查

接口定义在 `@types/` 目录，**可直接使用无需导入**：

```typescript
getVariables({ type: 'message', message_id: 5 }); // 变量读取
replaceVariables(data, { type: 'chat' }); // 变量写入
getChatMessages({ start: 0, end: 10 }); // 消息读取
eventOn(tavern_events.MESSAGE_RECEIVED, callback); // 事件监听
const resp = await generate({ user_input: '你好' }); // AI 生成
getCurrentMessageId();
getIframeName(); // 工具函数
```

## MVU 变量框架

```typescript
// 1. 等待初始化（代码顶部执行一次）
await waitGlobalInitialized('Mvu');
// 前端界面还需等待变量就绪：
await waitUntil(() => _.has(getVariables({ type: 'message' }), 'stat_data'));

// 2. 推荐方式：defineMvuDataStore（Pinia）
import { defineMvuDataStore } from '@util/mvu';
export const useDataStore = defineMvuDataStore(Schema, {
  type: 'message',
  message_id: getCurrentMessageId(),
});

// 3. 直接访问
const data = Mvu.getMvuData({ type: 'message', message_id: 5 });
const stat_data = Schema.parse(_.get(data, 'stat_data'));
```

## 前端界面 iframe 适配

- 禁止 `vh` 单位 → 用 `width` + `aspect-ratio`
- 避免 `min-height`、`overflow: auto` 撑高容器
- 禁止 `position: absolute` 脱离文档流
- `index.html` 只写 `<head></head><body><div id="app"></div></body>`
- 禁止 HTML 中引用外部文件或用 `src=""` 占位

## 调试

使用 chrome-devtools MCP 连接浏览器。检查 `$('#extensions_settings')`
中的「酒馆助手-实时监听-允许监听」开关启用后，代码变更自动热重载，无需手动 build 或刷新。
