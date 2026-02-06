# AGENTS.md - 酒馆助手开发模板

本项目用于编写 SillyTavern (酒馆) 的 Tavern Helper (酒馆助手) 前端界面和脚本。

## 必读规则

开始任何工作前，必须先读取 `.opencode/rules/` 或 `.cursor/rules/` 目录下的所有 `.mdc` 文件：

- 项目基本概念.mdc - 项目结构和核心机制
- 酒馆变量.mdc - 变量类型和持久化存储
- 酒馆助手接口.mdc - @types 文件夹中的 API 说明
- 脚本.mdc - 脚本项目编写规范
- 前端界面.mdc - 前端界面项目编写规范
- mvu角色卡.mdc - MVU 角色卡文件夹结构
- mvu变量框架.mdc - MVU 变量框架接口
- mcp.mdc - chrome-devtools MCP 使用

## 构建命令

```bash
pnpm build          # 生产环境打包
pnpm build:dev      # 开发环境打包
pnpm watch          # 开发模式 (热重载)
pnpm lint           # ESLint 检查
pnpm lint:fix       # ESLint 自动修复
pnpm format         # Prettier 格式化
pnpm dump           # 生成 zod schema 的 JSON Schema
pnpm sync           # 同步酒馆数据
```

## 项目结构

```
src/                    # 源代码目录
  角色卡名/
    脚本/*/index.ts     # 脚本项目
    界面/*/             # 前端界面项目 (index.ts + index.html)
    schema.ts           # MVU 变量结构定义 (zod 4)
    世界书/*.json       # 世界书条目
示例/                   # 参考示例
初始模板/               # 新项目模板
util/                   # 工具函数
@types/                 # 酒馆助手接口类型定义
dist/                   # 打包输出 (自动生成)
```

### 项目类型判断

- **脚本项目**: 文件夹中仅有 `index.ts`
- **前端界面项目**: 文件夹中同时有 `index.ts` 和 `index.html`

## 代码风格

### TypeScript 配置

- 目标: ESNext
- 严格模式: 启用
- 禁止未使用的变量和参数
- 禁止隐式返回
- 使用 `@util/*` 和 `@/*` 路径别名

### 导入规范

```typescript
// 路径别名
import { xxx } from '@util/common';
import { xxx } from '@/角色卡名/schema';

// 文件内容导入
import html from './file.html?raw';
import css from './style.scss?raw';
import md from './doc.md';

// Vue 组件
import Component from './Component.vue';

// 样式导入 (前端界面)
import './index.scss';
```

### 命名规范

- 文件夹/文件名: 中文或英文均可，与功能对应
- 变量/函数: camelCase
- 类型/接口: PascalCase
- 常量: UPPER_SNAKE_CASE 或 camelCase

### 格���化

- 使用 Prettier 格式化
- 单引号
- 无分号 (由 Prettier 决定)
- 2 空格缩进

## 核心编码规范

### 加载/卸载时机

```typescript
// 正确: 使用 jQuery ready
$(() => {
  // 加载时执行
});

// 正确: 使用 pagehide 事件卸载
$(window).on('pagehide', () => {
  // 卸载时执行
});

// 错误: 禁止使用 DOMContentLoaded
document.addEventListener('DOMContentLoaded', fn); // 不会触发!
```

### 错误处理

```typescript
import { errorCatched } from '@util/common';

function init() {
  /* ... */
}

$(() => {
  errorCatched(init)();
});
```

### Vue 组件挂载

```typescript
// 前端界面中
$(async () => {
  await waitGlobalInitialized('Mvu');
  await waitUntil(() => _.has(getVariables({ type: 'message' }), 'stat_data'));
  createApp(App).use(createPinia()).mount('#app');
});
```

### 脚本中挂载 Vue 到酒馆页面

```typescript
// 需要与酒馆样式隔离时
$(() => {
  const app = createApp(App).use(createPinia());
  const $app = createScriptIdIframe()
    .appendTo('目标位置')
    .on('load', () => {
      teleportStyle($app[0].contentDocument!.head);
      app.mount($app[0].contentDocument!.body);
    });

  $(window).on('pagehide', () => {
    app.unmount();
    $app.remove();
  });
});
```

## 技术栈

### 可用依赖

- **UI**: Vue 3, Pinia, Vue Router, TailwindCSS
- **动画**: GSAP
- **DOM**: jQuery, jQueryUI
- **数据**: Zod 4, Lodash, YAML
- **游戏**: Pixi.js, @pixi/react
- **工具**: async-wait-until, klona, dedent

### 优先级

1. 优先使用 Vue + Pinia + TailwindCSS 编写界面
2. 优先使用 `@types` 中的酒馆助手接口
3. 优先使用 Zod 进行数据校验
4. 优先使用 GSAP 制作动画
5. 优先使用 jQuery 操作 DOM

## 酒馆助手接口

接口定义在 `@types/` 目录，可直接使用无需导入：

```typescript
// 变量操作
getVariables({ type: 'message', message_id: 5 });
replaceVariables(data, { type: 'chat' });

// 消息操作
getChatMessages({ start: 0, end: 10 });
setChatMessages(messages);

// 事件监听
eventOn(tavern_events.MESSAGE_RECEIVED, callback);

// AI 生成
const response = await generate({ user_input: '你好' });

// 工具函数
getCurrentMessageId();
getIframeName();
substitudeMacros(text);
```

## MVU 变量框架

### 等待初始化

```typescript
await waitGlobalInitialized('Mvu');
await waitUntil(() => _.has(getVariables({ type: 'message' }), 'stat_data'));
```

### 数据访问

```typescript
// 使用 defineMvuDataStore (推荐)
import { defineMvuDataStore } from '@util/mvu';
export const useDataStore = defineMvuDataStore(Schema, {
  type: 'message',
  message_id: getCurrentMessageId(),
});

// 直接访问
const data = Mvu.getMvuData({ type: 'message', message_id: 5 });
const stat_data = Schema.parse(_.get(data, 'stat_data'));
```

### Zod Schema 规范

```typescript
export const Schema = z
  .object({
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    物品栏: z.record(
      z.string(),
      z.object({
        数量: z.coerce.number(),
        描述: z.string(),
      }),
    ),
  })
  .prefault({});
```

- 使用 `z.coerce.number()` 而非 `z.number()`
- 使用 `z.prefault()` 而非 `z.default()`
- 使用 `z.record()` 而非数组存储动态键值
- 使用 `z.transform()` 进行值约束

## 前端界面规范

### index.html 结构

```html
<head></head>
<body>
  <div id="app"></div>
</body>
```

- 禁止在 HTML 中引用外部文件
- 禁止使用 `src=""` 占位
- 所有资源通过 TypeScript 导入

### iframe 适配

- 禁止使用 `vh` 单位
- 使用 `width` + `aspect-ratio` 控制高度
- 避免 `min-height`、`overflow: auto`
- 禁止 `position: absolute` 脱离文档流

## 脚本规范

- jQuery 作用于整个酒馆页面 (`window.$ = window.parent.$`)
- 挂载到酒馆页面时禁止使用 TailwindCSS (避免类名冲突)
- 使用 `teleportStyle()` 复制样式到酒馆页面

## ESLint 规则

- 禁止循环导入 (`import-x/no-cycle`)
- 警告 Node.js 模块导入 (`import-x/no-nodejs-modules`)
- 禁止 `var`，优先 `const`
- 允许 `@typescript-eslint/no-explicit-any`

## 调试

使用 chrome-devtools MCP 连接浏览器：

1. 检查 `$('#extensions_settings')` 中的实时监听开关
2. 代码变更后自动热重载，无需刷新
3. 查看 Console、DOM、网络请求等

## 常见模式

### 聊天变更时重载

```typescript
import { reloadOnChatChange } from '@util/script';
reloadOnChatChange();
```

### 响应式设置存储

```typescript
const Settings = z.object({ enabled: z.boolean().default(false) }).prefault({});
const settings = ref(Settings.parse(getVariables({ type: 'script', script_id: getScriptId() })));
watchEffect(() => replaceVariables(klona(settings.value), { type: 'script', script_id: getScriptId() }));
```

### 按钮事件

```typescript
eventOn(getButtonEvent('按钮名'), () => {
  console.log('按钮被点击');
});
```
