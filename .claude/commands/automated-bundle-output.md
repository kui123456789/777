---
name: automated-bundle-output
description: Workflow command scaffold for automated-bundle-output in 777.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /automated-bundle-output

Use this workflow when working on **automated-bundle-output** in `777`.

## Goal

Generates and commits bundled distribution files, likely as part of a build or release process.

## Common Files

- `dist/角色卡示例/界面/状态栏/index.html`
- `dist/角色卡示例/界面/状态栏/index.js.map`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Build project to generate distribution files
- Update files in dist/ directory (e.g., HTML, JS map files)
- Commit changes with a standardized message

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.