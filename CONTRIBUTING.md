# Contributing

```bash
git clone https://github.com/r0charm/agent-guardrails.git
cd agent-guardrails
scripts/test   # Node 22+ also loads the opencode wiring
```

Try one command without a harness:

```bash
scripts/guard "kubectl delete namespace prod"; echo $?   # 2 denied, 0 with JSON asked, 0 silent
scripts/guard --only kubernetes "kubectl delete namespace prod"
```

## Add a guard

1. Create `guards/<name>/` with three files:
   - `rules`: `SCOPE`, `DENY`, `ASK`, and optionally `SKIP`, `CASE_SENSITIVE`, `COMMAND_ONLY`. The header of `scripts/guard` documents each.
   - `cases`: one `DENY`, `ASK` or `PASS` and a command per line, including the reads that must stay silent.
   - `policy.md`: what it guards and why each rule is deny or ask.
2. Anchor every verb, so a word inside an argument does not fire.
3. Keep `deny` small: a denied command can only be authorised by editing the guard.
4. Run `scripts/test`.

Nothing outside the folder names a guard, so dropping one is deleting its folder.

## Releases

A pull request that changes a decision or the install adds a changeset: `npx changeset`, pick the bump, write one line for users. On `main`, the release workflow gathers them into a "Version packages" pull request; merging it bumps `package.json`, copies the version into `.claude-plugin/plugin.json`, writes [CHANGELOG.md](CHANGELOG.md), publishes to npm and tags the release. Claude Code installs update when `plugin.json`'s version changes, opencode installs when npm's does.

Versions follow [SemVer](https://semver.org), read for a tool whose output is decisions:

- **Major**: a change that breaks an install or the wiring: the plugin or package name, the hook contract, a harness dropped.
- **Minor**: a change that can add decisions: a guard or rule added, a rule moved from ask to deny, a new spelling or file read.
- **Patch**: a change that only removes wrong decisions: a false positive gone, a rule moved from deny to ask.
