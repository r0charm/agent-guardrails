# agent-guardrails

## What this repo is

Five bash guards (`scripts/`) that deny or ask on destructive commands, plus the wiring that carries them into Claude Code (`hooks/hooks.json`), opencode (`.opencode/plugin.ts`) and Pi (`.pi/plugin.ts`, declared in `package.json`). Standalone. Policies per guard are in `policies/`; tiers and rationale in `setup.md`.

## Editing here

- `AGENTS.md` is a symlink to this file. Edit `CLAUDE.md`, never `AGENTS.md` directly.
- No em-dashes in prose.
- A change to any guard needs a case added to `scripts/test` in the same edit, and the suite has to pass. Anchor every verb you match: unanchored, `delete` fires on `-l app=delete-me` and `scale` on `deploy/scaler`, and a guard that asks on ordinary reads is one people learn to click through.
- A guard decides from the command alone. Never make a rule depend on knowing your infrastructure.
- Keep `deny` small: a denied command can only be authorised by editing the guard.
- CI runs `scripts/test` on every push.
