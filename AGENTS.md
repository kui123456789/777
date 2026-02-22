# AGENTS.md — SillyTavern Helper Agentic Guidelines

This document provides context, architecture, and strict rules for AI coding assistants working on the SillyTavern Helper repository.

## 🚀 1. Commands & Workflows

> **CRITICAL**: NO unit testing framework (like Jest or Vitest) exists (`pnpm test` will fail). Validation relies entirely on `pnpm lint`, `pnpm build`, and manual browser testing. **Do not attempt to run unit tests.**

- **Build**: `pnpm build` (Production) | `pnpm build:dev` (Development)
- **Watch/Dev**: `pnpm watch` (Hot-reloads and auto-generates `schema.json` from `schema.ts`)
- **Lint**: `pnpm lint` (Check) | `pnpm lint:fix` (Fix)
- **Format**: `pnpm format` (Prettier - applies to ts, tsx, js, jsx, css, scss, html, vue)
- **Data Sync**: `pnpm sync` (Sync Tavern data) | `pnpm dump` (Generate JSON Schema from Zod)

### 🧪 How to Verify Code Changes
To "test" a single feature, script, or change:
1. Run `pnpm lint` to ensure no syntax/style/import errors.
2. Run `pnpm format` if you modified templates or styles.
3. Run `pnpm watch` to build the asset with hot-reloading.
4. Verify functionality manually in the browser extension environment using dev tools.

## 📁 2. Project Structure

- `src/[Name]/脚本/*/index.ts`: Background scripts (runs silently in Tavern in a sandbox-free iframe).
- `src/[Name]/界面/*/index.ts`: UI components (loaded in iframe via `index.html`).
- `src/[Name]/schema.ts`: MVU state definitions via Zod 4.
- `util/`: Shared helpers (`common.ts`, `script.ts`, `mvu.ts`).
- `@types/`: Tavern Helper ambient types (Globally available, NO imports needed).
- `.cursor/rules/`: Contains specialized markdown rules for Cursor/AI agents.

## 🛠️ 3. Tech Stack & Environment

1. **Vue 3 + Pinia + TailwindCSS**.
2. **Zod 4** for data validation (`z.coerce`, `z.prefault`, `z.record`).
3. **GSAP** (Animations) & **jQuery** (DOM Manipulation).
4. **Pixi.js + @pixi/react** (Media/Games).

> **PROHIBITED**: Node.js modules (`fs`, `path`, `os`, etc.) are STRICTLY FORBIDDEN. This is a pure browser extension environment.

## 📏 4. Code Style & Rules

- **Formatting**: Prettier is strictly enforced (Single quotes, 120 print width, semi-colons, LF newlines).
- **ESLint Overrides**:
  - `import-x/no-cycle`: error (circular dependencies are strictly forbidden).
  - `no-var`: error (always use `const` or `let`).
  - `no-floating-decimal`: error (no `.5`, must use `0.5`).
  - `any` type is allowed (`@typescript-eslint/no-explicit-any: off`), though explicit typing is preferred.
- **Naming Conventions**: 
  - `camelCase` for variables and functions.
  - `PascalCase` for types, interfaces, and Vue components.
  - Chinese or English for folder/file names based on the existing pattern.
- **Imports**: Use path aliases (`@util/`, `@/`). Import styles/assets directly into the module (`import './index.scss'`).

## 🧠 5. Architecture & Best Practices

### A. Script Environment & jQuery
- Scripts run in a sandbox-free iframe.
- `window.$` is aliased to `window.parent.$`. Thus, `$('body')` selects the main Tavern document's `<body>`, not the script iframe's body. 

### B. Lifecycle Management (CRITICAL)
- **DO NOT** use `DOMContentLoaded`. It will not trigger reliably in injected environments. Use:
  ```typescript
  $(() => {
    errorCatched(init)();
  });
  ```
- **DO NOT** use the window `unload` event. Use `pagehide` for cleanup memory leaks:
  ```typescript
  $(window).on('pagehide', () => {
    // Perform cleanup: unmount Vue, remove DOM elements, clear intervals
  });
  ```

### C. Vue Mounting & Styling Strategies
When a script needs to mount a Vue component, you must choose a strategy based on its styling needs:

**1. Complementary UI (Tavern DOM):**
- **Use case:** Enhancing existing Tavern elements, blending with current UI.
- **Method:** Use `createScriptIdDiv().appendTo('TargetSelector')`.
- **Styling:** Use `teleportStyle()` to inject styles into Tavern's `<head>`.
- **PROHIBITED:** Do not use TailwindCSS classes to prevent naming collisions with Tavern.

**2. Standalone UI (Iframe DOM):**
- **Use case:** Isolated UI, floating windows, or major structural overrides.
- **Method:** Use `createScriptIdIframe().appendTo('TargetSelector')`. Wait for `load` event.
- **Styling:** Mount app to `$app[0].contentDocument!.body`. Call `teleportStyle($app[0].contentDocument!.head)`.
- **Allowed:** TailwindCSS is perfectly safe here.

**Cleanup Routine (Required on pagehide):**
```typescript
app.unmount();
$app.remove();
destroy(); // The teardown function returned from teleportStyle()
```

### D. Reactive Data & MVU State
- Always parse state from Tavern vars using Zod:
  ```typescript
  const settings = ref(Schema.parse(getVariables({ type: 'script', script_id: getScriptId() })));
  ```
- **CRITICAL**: When saving back to Tavern, wrap the ref in `klona()` to strip Vue proxy wrappers:
  ```typescript
  watchEffect(() => replaceVariables(klona(settings.value), { type: 'script', script_id: getScriptId() }));
  ```
- **Complex State**: Use `defineMvuDataStore` from `@util/mvu`.

### E. Script Features: Settings & Buttons
- User configurations must be strictly typed and defaulted using `zod`.
- Register UI buttons via `appendInexistentScriptButtons([{ name: 'btnName', visible: true }])`.
- Listen to button clicks via `eventOn(getButtonEvent('btnName'), () => { ... })`.

### F. UI / Iframe Constraints
- **DO NOT** use `vh` units. Use `width` + `aspect-ratio`.
- **DO NOT** use `position: absolute` if it breaks document flow and container boundaries.
- Keep HTML entry points clean: `<head></head><body><div id="app"></div></body>`. No external tags.

### G. Error Handling
- Wrap top-level init logic in `errorCatched(func)` to prevent silently failing background scripts.
- Throw errors for fatal, unrecoverable states; use `console.warn/error` for recoverable issues.

## 🔍 6. Agent Instructions & Debugging

- **Tavern API Usage**: Use globally available Tavern functions directly without importing: `getVariables()`, `replaceVariables()`, `getChatMessages()`, `eventOn(tavern_events.MESSAGE_RECEIVED)`, `generate()`.
- **Debugging**: Hot-reloading works via `chrome-devtools MCP`. Instruct users to enable "实时监听" (Real-time listening) in `$('#extensions_settings')`.
