# Scope

A request fits when it stops a command an agent can run by mistake and nobody can undo.

## In

- Destructive or irreversible commands, in any tool an agent drives from a shell.
- New ways to spell a command already guarded: quoting, expansions, wrappers, files a command runs.
- False positives: a read that asks or denies is a bug, because a prompt people click through protects nothing.

## Out

- **Allow decisions.** Guards deny or ask; granting is the permission rules' job, and a guard that allows would override them.
- **Rules that know your infrastructure.** Which cluster is production, which bucket matters: a guard decides from the command text alone, so it cannot be wrong about your setup.
- **Stopping an adversary.** A pattern on text loses to anyone rewriting the text. That is credential scope and isolation, see [`setup.md`](setup.md).
- **Per-user configuration in this repo.** Change a decision in a clone, as the README says.
