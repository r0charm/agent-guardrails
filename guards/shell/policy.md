# Shell Policy

Every other guard reads the command it is given. A pipe into a shell, a variable run as a command or a substitution hands the shell text that only exists at run time, so no guard can see what will run. This guard asks on those, because it is the one place the rest are blind.

| Command | Why it needs a human |
|---|---|
| `... \| sh`, `... \| bash`, `... \| sudo bash` | What runs is the output of the left side, not text in the command. Covers `curl ... \| sh` and `base64 -d \| sh`. |
| `... \| python3`, `perl`, `ruby`, `node` with no script | Same, through an interpreter. `python3 -m json.tool` names its program and stays silent. |
| `bash <(...)`, `source <(...)` | Runs the output of a command as a script. |
| `eval $VAR` | Evaluates a variable as a command. `eval "$(ssh-agent -s)"` stays silent. |
| `$VAR args`, `$(...) args` in command position | The command name exists only at run time. `$HOME/bin/tool` names a path and stays silent. |
| `git $VAR`, `kubectl $VAR` and other guarded tools | The verb exists only at run time, so the tool's own guard cannot read it. |

All are **ask**: none is destructive in itself, it is that the guards cannot tell.

## Known limits

What runs from a file the command names is out of reach for a guard that decides from the command alone: `bash deploy.sh`, `make release`, `npm run deploy`, and a program passing argv as a list (`subprocess.run(['git', 'push'])`). That is what credential scope and isolation are for. `guards/known-leaks` lists each, and `scripts/test` checks every guard stays silent on them, so a change that closes or widens one shows up.
