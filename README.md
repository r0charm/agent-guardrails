# agent-guardrails

[![checks](https://github.com/r0charm/agent-guardrails/actions/workflows/checks.yml/badge.svg)](https://github.com/r0charm/agent-guardrails/actions/workflows/checks.yml)

Command guards for coding agents. Bash guards that deny or ask on destructive commands before they run, wired into the coding agent harnesses that run them. Standalone: no skills, no other dependency.

> **A safety net, not a security boundary.** Each guard decides from the command text alone, so a determined or creative command can slip past a pattern. Real protection is credential scope (a read-only cloud profile, a kubeconfig without prod) and isolation (containers, worktrees, sandboxes). These guards catch the mistakes those let through. Layering is in [`setup.md`](setup.md).

## Install

### Claude Code

```bash
ln -s "$PWD" ~/.claude/skills/agent-guardrails
```

Loads this repo as a plugin; `hooks/hooks.json` wires the guards. Confirm with `claude plugin details agent-guardrails`.

### opencode

```bash
mkdir -p ~/.config/opencode/plugins
ln -s "$PWD/.opencode/plugin.ts" ~/.config/opencode/plugins/agent-guardrails.ts
```

### Pi

```bash
pi install "$PWD"
```

## Behaviour

Three outcomes per command: **deny** (exit 2, cannot be lifted in session), **ask** (a confirmation, which auto mode does not skip), or silent (falls through to your permission rules). Guards never allow.

Destructive or irreversible commands deny or ask; reads stay silent, so a confirmation keeps its meaning. Verbs are anchored, so a match on a word inside an argument does not fire.

`setup.md` has what is covered and how to confirm the guards fire; each guard and its policy is a folder in `guards/`. Read it before trusting them: a guard that was never wired is worse than none.

## Test

```bash
scripts/test
```
