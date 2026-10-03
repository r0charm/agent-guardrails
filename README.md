# agent-guardrails

Command guards for coding agents. Five bash guards deny or ask on destructive git, filesystem, Kubernetes, cloud and data commands, for Claude Code, opencode and Pi. Standalone: no skills, no other dependency.

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

`git push`, `kubectl apply` and `terraform apply` stop for confirmation, which auto mode does not skip. A short list of the irreversible is denied outright (`git reflog expire`, `kubectl delete namespace`, `aws ec2 terminate-instances`, among them), and a denial cannot be lifted in session, only by editing the guard.

`setup.md` has the tiers, what each guard covers, and how to confirm they fire. Read it before trusting them: a guard that was never wired is worse than none.

## Test

```bash
scripts/test
```
