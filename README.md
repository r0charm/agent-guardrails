# agent-guardrails

Command guards for coding agents. Five bash guards deny or ask on destructive git, filesystem, Kubernetes, cloud and data commands, for Claude Code, opencode and Pi. Standalone: no skills, no other dependency.

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

| Command | Outcome | Why |
|---|---|---|
| `git reflog expire --all` | deny | removes the recovery net for every other git mistake |
| `kubectl delete namespace prod` | deny | takes every workload, secret and volume with it |
| `git push origin main` | ask | the point of no return for committed work |
| `terraform apply` | ask | changes infrastructure or its state file |
| `kubectl get pods` | silent | reads stay silent, or people learn to click through |

Verbs are anchored, so `delete` does not fire on `-l app=delete-me`.

`setup.md` has the tiers, what each guard covers, and how to confirm they fire. Read it before trusting them: a guard that was never wired is worse than none.

## Test

```bash
scripts/test
```
