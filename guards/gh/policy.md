# GitHub CLI Policy

`gh` reaches the remote directly. What the git guard asks on the way out, a push or a deleted ref, has a second door here that never touches git, and `gh api` is a door to everything.

## Denied

| Command | Why |
|---|---|
| `gh repo delete` | The repository, its issues, pull requests and wiki. Nothing restores them. |

## Asked: the raw API

| Command | Why |
|---|---|
| `gh api -X/--method POST\|PUT\|PATCH\|DELETE` | Any change at all, including the ones every command below guards. |
| `gh api <path> -f/-F/--field/--raw-field/--input` | Fields switch `gh api` to POST. REST paths carry a slash and `graphql` does not, so a GraphQL read with `-f query=` stays silent. |
| `gh api graphql` with `mutation` | A GraphQL write. |

## Asked: outward actions

| Command | Why |
|---|---|
| `gh pr merge` | The remote point of no return; `--admin` also skips branch protection. |
| `gh pr review --approve` | Branch protection counts it as a human's review. |
| `gh issue\|run\|cache\|label delete` | Nothing restores them. |
| `gh release create\|delete\|delete-asset\|edit\|upload` | Changes what others download. |
| `gh repo archive\|unarchive\|rename\|edit\|deploy-key`, `gh repo create --public` | Settings, visibility, name or access. |
| `gh gist create\|edit\|delete` | A secret gist is still reachable by URL. |
| `gh secret\|variable set\|delete` | Changes what CI runs with. |
| `gh workflow run\|enable\|disable` | Triggers or toggles a workflow, which can deploy. |
| `gh ssh-key\|gpg-key add\|delete` | Changes who can authenticate as the account. |
| `gh auth token` | Prints the token into the transcript. |

## Not guarded

Reads, and writes that stay reversible or only propose: `pr create`, `pr comment`, `pr close`, `issue create`, `repo create --private`, `pr review --comment`. A pull request is where work waits for a human, so opening one is the cheapest step and stays silent.
