# Git Policy

## Denied

| Command | Why |
|---|---|
| `git reflog expire` | Deletes the reflog, which is what makes every other git mistake recoverable. |
| `git gc --prune` | Prunes unreachable objects, discarding what the reflog would have recovered. |
| `git filter-branch`, `git filter-repo` | Rewrites every commit in the repository. |
| `git update-ref -d` | Deletes a ref directly, bypassing the reflog. |

These four are denied rather than asked because they remove the recovery net. Everything else in git is survivable while the old tip is still reachable; these are what make it unreachable.

## Asked

| Command | Why |
|---|---|
| `git push`, force variants, `git send-pack` | The point of no return for anything already committed. Force additionally discards commits on the remote. |
| `git reset --hard` | Discards every uncommitted change. |
| `git clean -f` | Deletes untracked files, which git never had a copy of. |
| `git branch -D` | Force-deletes without checking the branch is merged. |
| `git checkout .`, `git restore .`, and the named-file forms | Discards uncommitted changes. The single-file form is included because it is the one people forget. |
| `git checkout -f`, `git switch -f`, `git switch --discard-changes` | Switches branch and discards every uncommitted change on the way. |
| `git read-tree -u`, `git read-tree --reset` | Overwrites the index or working tree from a tree. |
| `git branch -f` | Moves an existing branch, and the commits it pointed at stop being reachable from it. |
| `git update-ref` | Moves a ref directly, without the checks `branch` or `reset` make. |
| `git tag -d` | Deletes a tag, which no reflog records. |
| `git rebase`, `git commit --amend` | Rewrites history, and loses commits when a conflict is resolved wrongly. |
| `git stash drop`, `git stash clear` | Discards work nothing else references. |
| `git worktree remove --force` | Removes a worktree along with uncommitted work in it. |
| `git submodule deinit -f` | Discards uncommitted work inside the submodule. |

## Not guarded

`git commit` is deliberately absent. A commit on a feature branch is the cheapest place for work to sit, and everything that could undo one is above.

## Note on scope

A local guard protects the machine that has it. Branch protection on the remote protects every machine, every agent and every harness, and is the control that actually holds. Treat this file as the second line.
