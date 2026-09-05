```markdown
# 777 Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill introduces the core development patterns and workflows used in the `777` repository, a TypeScript-based React project. You'll learn about the project's coding conventions, automated workflows for dependency management and bundling, and how to structure and run tests. This guide is ideal for contributors aiming for consistency and efficiency in this codebase.

## Coding Conventions

### File Naming
- **Style:** camelCase
- **Example:**  
  ```
  userProfile.tsx
  statusBarComponent.ts
  ```

### Import Style
- **Relative imports** are used throughout the codebase.
- **Example:**
  ```typescript
  import { StatusBar } from './statusBarComponent';
  ```

### Export Style
- **Named exports** are preferred.
- **Example:**
  ```typescript
  // statusBarComponent.ts
  export function StatusBar() { /* ... */ }
  ```

### Commit Patterns
- **Type:** Freeform (no strict conventional commit format)
- **Prefixes:** Occasionally `[bot]`, `chore`
- **Average commit message length:** 17 characters

## Workflows

### Automated Dependency Bump
**Trigger:** When dependencies need to be updated, typically via a bot or automation  
**Command:** `/bump-deps`

1. Update `package.json` with the latest dependency versions.
2. Update `pnpm-lock.yaml` to reflect the new dependency tree.
3. Optionally update `pnpm-workspace.yaml` or related configuration files.
4. If type packages are bumped, update type definition files under `@types/function/*.d.ts`.
5. Commit all changes with a standardized message.

**Files involved:**
- `package.json`
- `pnpm-lock.yaml`
- `pnpm-workspace.yaml`
- `@types/function/*.d.ts`

**Frequency:** ~4-6 times per month

**Example:**
```bash
# Trigger dependency bump (if supported by bot/CI)
/bump-deps
```

---

### Automated Bundle Output
**Trigger:** When new code is built and distribution files need to be updated, typically via a bot or CI  
**Command:** `/bundle`

1. Build the project to generate updated distribution files.
2. Update files in the `dist/` directory (e.g., HTML, JS map files).
3. Commit the changes with a standardized message.

**Files involved:**
- `dist/角色卡示例/界面/状态栏/index.html`
- `dist/角色卡示例/界面/状态栏/index.js.map`

**Frequency:** ~2 times per month

**Example:**
```bash
# Trigger bundle output update (if supported by bot/CI)
/bundle
```

## Testing Patterns

- **Framework:** Unknown (not detected)
- **File Pattern:** Test files are named with the `.test.` infix.
  - **Example:** `statusBarComponent.test.ts`
- **Location:** Typically alongside the module being tested or in a dedicated test directory.

**Example Test File:**
```typescript
// statusBarComponent.test.ts
import { StatusBar } from './statusBarComponent';

test('StatusBar renders correctly', () => {
  // Test implementation here
});
```

## Commands

| Command      | Purpose                                             |
|--------------|-----------------------------------------------------|
| /bump-deps   | Automatically update project dependencies           |
| /bundle      | Generate and commit updated bundle/distribution files|
```
