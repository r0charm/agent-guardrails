# agent-guardrails

[![version](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fr0charm%2Fagent-guardrails%2Fmain%2F.claude-plugin%2Fplugin.json&query=%24.version&label=version)](https://github.com/r0charm/agent-guardrails/blob/main/.claude-plugin/plugin.json) [![license](https://img.shields.io/github/license/r0charm/agent-guardrails)](https://github.com/r0charm/agent-guardrails/blob/main/LICENSE)

Command guards for coding agents. Bash guards that deny or ask on destructive commands before they run, wired into the coding agent harnesses that run them. Standalone: needs only bash, and jq for Claude Code.

> **A safety net, not a security boundary.** The guards catch an agent's mistakes, not an agent working against you. Real protection sits below them: credential scope and isolation. Layering is in [`setup.md`](setup.md).

## What it stops, and what it does not

**Stops**, per command, before it runs:

- destructive or irreversible verbs in the tools it covers: version control, its hosting CLI, Kubernetes, infrastructure as code, cloud control planes, managed databases, object storage, secrets stores and the filesystem;
- the same verbs written with quotes, backslashes, tabs, `$IFS`, empty expansions, brace expansion or `$'..'` escapes, since the guards match the command as the shell will see it;
- a pipe into a shell, or a command named by a variable or substitution: these ask, because the guards cannot see what will run.

**Does not stop**:

- a file named through an expansion, `bash $DIR/deploy.sh`, or run by a tool whose files are not read, as `just` or `task`; scripts, `make` targets and `npm run` scripts are read, three files deep;
- a program that builds a command from variables or data at run time; an argv list written inline, as `subprocess.run(['git', 'push'])`, is read;
- another client for a guarded resource: an alias, a vendor fork, `curl` to its API, an SDK;
- tools nothing guards yet;
- an agent that sets out to get past them. A pattern on text loses to anyone rewriting the text.

Every known gap is a test case in [`guards/known-leaks`](guards/known-leaks): the suite expects each to pass silently, so closing one is a visible change.

**Use instead, or underneath**: a read-only cloud profile, a kubeconfig without prod, no push rights to protected branches, deletion protection and backups on the data, and a container or sandbox with no production credentials in it. Those hold whatever the agent types.

## Install

### Claude Code

```bash
claude plugin marketplace add r0charm/agent-guardrails
claude plugin install agent-guardrails@r0charm
```

Installed before 1.2.0, the marketplace was named `agent-guardrails`. Remove it first, then add as above:

```bash
claude plugin uninstall agent-guardrails@agent-guardrails
claude plugin marketplace remove agent-guardrails
```

Or, from a clone you edit, load it in place:

```bash
ln -s "$PWD" ~/.claude/skills/agent-guardrails
```

Either way `hooks/hooks.json` wires the guards. Confirm with `claude plugin details agent-guardrails`. Without plugins at all, see `setup.md`.

### opencode

```bash
mkdir -p ~/.config/opencode/plugins
ln -s "$PWD/.opencode/plugin.ts" ~/.config/opencode/plugins/agent-guardrails.ts
```

## Behaviour

Three outcomes per command: **deny** (exit 2, cannot be lifted in session), **ask** (a prompt auto mode does not skip in Claude Code, a refusal naming the reason in opencode, which plugins cannot prompt from), or silent (falls through to your permission rules). Guards never allow.

Destructive or irreversible commands deny or ask; reads stay silent, so a confirmation keeps its meaning. Verbs are anchored, so a match on a word inside an argument does not fire.

`setup.md` has what is covered and how to confirm the guards fire; each guard and its policy is a folder in `guards/`. Read it before trusting them: a guard that was never wired is worse than none.

## Test

```bash
scripts/test   # Node 22+ also loads the opencode wiring
```
