# agent-guardrails

## What this repo is

Bash guards that deny or ask on destructive commands. Each guard is a folder in `guards/`: `rules`, `cases` and `policy.md`. `scripts/guard` runs them all and returns one decision; it is the only thing the wiring calls: Claude Code (`hooks/hooks.json`) and opencode (`.opencode/plugin.ts`, published to npm as `@rocharm/agent-guardrails`). The repo is its own Claude Code marketplace, `agent-guardrails` (`.claude-plugin/marketplace.json`, listing `./`). Standalone. Tiers and rationale in `setup.md`.

## Editing here

- `AGENTS.md` at the root is a symlink to this file, `.claude/CLAUDE.md`, which lives there so it stays out of the plugin root. Edit this file, never `AGENTS.md` directly.
- No em-dashes in prose.
- Grow by folders, not by edits elsewhere: a new guard is a new `guards/<name>/`, dropping one is deleting it. Never name a guard in the runner, the wiring or the docs outside its folder.
- A change to any guard needs a case in its `cases` in the same edit, and `scripts/test` has to pass. Anchor every verb you match: unanchored, `delete` fires on `-l app=delete-me` and `scale` on `deploy/scaler`, and a guard that asks on ordinary reads is one people learn to click through.
- A guard decides from the command and the files it runs (scripts, make targets, package.json scripts), which the runner reads for it. Never make a rule depend on knowing your infrastructure.
- Keep `deny` small: a denied command can only be authorised by editing the guard.
- Commits are the repo owner's. Author them as `Ricardo Rocha <7465674+r0charm@users.noreply.github.com>` alone: no `Co-Authored-By`, no agent or model named, in commits, PR titles, descriptions or comments. Check `git config user.name` and `user.email` before the first commit of a session; a hosted session starts with the harness identity, so set the owner's repo-locally if it differs.
- `main` changes only through a pull request, squash-merged on GitHub: GitHub signs that commit, so it shows Verified, and the account's private-email setting makes it use the noreply address. A session never pushes to `main`; it pushes a branch and opens the pull request. Merge only when the owner says to.
- `scripts/test` covers the rules and the wiring; it loads the opencode plugin through `scripts/plugins.test.mjs`, which needs Node 22+. CI runs it on Linux and macOS's bash 3.2, plus shellcheck.
- A change to a decision or the install adds a changeset (`npx changeset`), bumped by the policy in `CONTRIBUTING.md`. Never edit `version` by hand: the release workflow's "Version packages" pull request bumps `package.json` and `scripts/sync-plugin-version.mjs` copies it into `.claude-plugin/plugin.json`. Installs stay on their cached copy until that string changes, however many commits land.
