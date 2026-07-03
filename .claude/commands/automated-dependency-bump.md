---
name: automated-dependency-bump
description: Workflow command scaffold for automated-dependency-bump in 777.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /automated-dependency-bump

Use this workflow when working on **automated-dependency-bump** in `777`.

## Goal

Automatically updates project dependencies to their latest versions.

## Common Files

- `package.json`
- `pnpm-lock.yaml`
- `pnpm-workspace.yaml`
- `@types/function/*.d.ts`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Update package.json with new dependency versions
- Update pnpm-lock.yaml to reflect new dependency tree
- Optionally update pnpm-workspace.yaml or related config
- Optionally update type definition files under @types/function if type packages are bumped
- Commit changes with a standardized message

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.