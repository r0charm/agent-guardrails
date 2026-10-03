# Setup

Deterministic limits on what an agent does without asking, across git, Kubernetes, cloud and data.

## Install

Nothing to wire. Claude Code carries them with the plugin through `hooks/hooks.json`, opencode through `.opencode/plugin.ts`, and Pi through `.pi/plugin.ts` once `pi install` adds this repo as a package, so the root `README.md` install step is the whole setup.

**Verify they fire before trusting them.** A guard that was never wired is worse than none:

```bash
scripts/test
```

Then check each outcome by hand:

```bash
scripts/git-guard "git reflog expire --all"          # BLOCKED, exit 2
scripts/data-guard "aws s3 sync . s3://b --delete"   # an ask decision
scripts/kubernetes-guard "kubectl get pods"          # silent, exit 0
```

Finally, in a real session, ask for one and confirm you are stopped. That is the only check that proves the harness is actually running them.

## What is guarded

| Guard | Covers | Policy |
|---|---|---|
| `git-guard` | git | [policies/git.md](policies/git.md) |
| `fs-guard` | `rm` and `find -delete` on worktrees and `.claude` | [policies/filesystem.md](policies/filesystem.md) |
| `kubernetes-guard` | kubectl, helm | [policies/kubernetes.md](policies/kubernetes.md) |
| `data-guard` | DynamoDB, S3, MongoDB, RDS | [policies/data.md](policies/data.md) |
| `cloud-guard` | EC2, IAM, ECR, CloudFormation, EKS, Terraform | [policies/cloud.md](policies/cloud.md) |

Split by what breaks rather than by vendor, which is why DynamoDB is data and not cloud: `aws dynamodb delete-table` and `db.collection.drop()` fail the same way.

## Tiers

Each guard sorts a command into one of three outcomes.

| Tier | Meaning | Outcome |
|---|---|---|
| **Deny** | no good reason for an agent to do this, and a distracted yes is an incident | exit 2, stopping the call before permission rules are evaluated |
| **Ask** | legitimate, and needs a human looking at it | a `permissionDecision: "ask"`, which is still shown in auto mode |
| Neither | falls through to whatever the permission rules say | exit 0 |

Guards never return "allow". Granting from a hook would override rules written elsewhere, and nothing here is worth that.

Keep `deny` small. A denied command cannot be authorised in session, only by editing the guard, so it is reserved for the irreversible.

## Permissions are the last line, not the first

Every layer above beats the one below it, and this folder is the second weakest. Push work down the table wherever it will go.

| Layer | Prod infrastructure | Branches | Strength |
|---|---|---|---|
| Credential scope | the agent's AWS profile is read-only; its kubeconfig holds only non-prod contexts | the agent has no push rights to main | cannot be bypassed by anything |
| Isolation | separate kubeconfig, container, sandbox | a worktree per feature | strong |
| **These guards** | **deny and ask, per command** | **deny and ask, per command** | bypassed only by changing config |
| Context | a skill, `CLAUDE.md` | instructions | advisory, and may not load |

A kubeconfig without the prod context cannot have the gap a pattern can. Treat what is here as the layer that catches what the ones above let through.

## The rules that shape the lists

**A guard decides from the command alone.** If a decision needs to know something about your infrastructure, the rule is wrong: make it coarser until it is decidable syntactically. Detecting which cluster is production was tried and removed for this reason. It existed only to avoid asking in non-prod, which is convenience, and every branch of it was a way to fail. A guard that can fail to recognise production is worse than one that asks every time.

**Anything phrased as a prohibition belongs here, not in a skill.** A skill describes what exists. A "never do X" in a skill is a rule nobody enforces and that may not even load.

**Anchor every verb.** Unanchored, `delete` fires on `-l app=delete-me`, `label` on `--show-labels`, `scale` on `deploy/scaler`. A guard that cries wolf on reads is one people learn to click through, which is the failure the whole design exists to avoid.

## How the harness treats a guard

Quoted from Claude Code's permissions and permission-modes documentation, because it decides how much any of this is worth:

- Rules resolve before the classifier: *"Actions matching your allow, ask, or deny rules resolve immediately"*, then *"Everything else goes to the classifier."*
- Both tiers hold everywhere: *"Deny rules block in every mode, including `bypassPermissions`"*, and explicit ask rules force a prompt there too.
- A hook counts the same as a rule: *"Claude Code doesn't add the option to prompts forced by one of your ask rules or by a hook, because auto mode still shows you those prompts."*

One caveat against leaning on a wide allowlist: entering auto mode drops broad allow rules that grant arbitrary execution, `Bash(*)`, wildcarded interpreters and package-manager run commands, while narrow ones like `Bash(npm test)` stay.

A permission rule could express much of what these guards do, since a Bash pattern matches the whole command text with `*` standing in for any part. The guards earn their place on completeness instead: rules need every verb enumerated in both flag positions, and one nobody thought of fails silently.

## Changing a guard

Guards take the command as an argument, so a change is checked without a harness:

```bash
scripts/kubernetes-guard "kubectl delete namespace prod"
echo $?   # 2 denied, 0 with JSON asked, 0 with no output passed
```

Add the case to `scripts/test` in the same edit, then run the suite. Every pattern in here has a test, including the reads that must stay silent.
