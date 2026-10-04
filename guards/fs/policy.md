# Filesystem policy

`rm` matches no other guard, so a recursive delete of a worktree path takes
uncommitted work in every worktree with it and nothing recovers it. This guard
closes that.

| Command | Why it needs a human |
|---|---|
| `rm ... worktree...` | Removes a git worktree by path; uncommitted work in it is gone, and git cannot recover it. |
| `rm -<flags> ... .claude...` | Deletes under `.claude`, which holds worktrees and local agent state. Short, long or split flags. |
| `rm -<flags> ... .git` | Deletes the repository itself: unpushed commits, stashes and the reflog go with it. A file inside it, such as `.git/index.lock`, stays silent. |
| `find ... worktree... -delete` | Deletes matched worktree paths, uncommitted work included. |

These are **ask**, not deny: legitimate cleanup is fine, it just needs a
conscious confirmation. In a no-UI/headless run an ask becomes a hard block,
so a model cannot delete worktrees unattended.
