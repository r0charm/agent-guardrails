# agent-guardrails

## What this repo is

Bash guards that deny or ask on destructive commands. Each guard is a folder in `guards/`: `rules`, `cases` and `policy.md`. `scripts/guard` runs them all and returns one decision; it is the only thing the wiring calls: Claude Code (`hooks/hooks.json`), opencode (`.opencode/plugin.ts`) and Pi (`.pi/plugin.ts`, declared in `package.json`). Standalone. Tiers and rationale in `setup.md`.

## Editing here

- `AGENTS.md` is a symlink to this file. Edit `CLAUDE.md`, never `AGENTS.md` directly.
- No em-dashes in prose.
- Grow by folders, not by edits elsewhere: a new guard is a new `guards/<name>/`, dropping one is deleting it. Never name a guard in the runner, the wiring or the docs outside its folder.
- A change to any guard needs a case in its `cases` in the same edit, and `scripts/test` has to pass. Anchor every verb you match: unanchored, `delete` fires on `-l app=delete-me` and `scale` on `deploy/scaler`, and a guard that asks on ordinary reads is one people learn to click through.
- A guard decides from the command alone. Never make a rule depend on knowing your infrastructure.
- Keep `deny` small: a denied command can only be authorised by editing the guard.
- Commits are the repo owner's. Author them as `Ricardo Rocha <7465674+r0charm@users.noreply.github.com>` alone: no `Co-Authored-By`, no agent or model named, in commits, PR titles, descriptions or comments. Check `git config user.name` and `user.email` before the first commit of a session; a hosted session starts with the harness identity, so set the owner's repo-locally if it differs.
- CI runs `scripts/test` on every push.
