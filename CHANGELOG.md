# Changelog

Each release bumps `version` in `.claude-plugin/plugin.json` and `package.json` together; marketplace installs update only when it changes. Versions follow [SemVer](https://semver.org), read for a tool whose output is decisions:

- **Major**: a change that breaks an install or the wiring: the marketplace or plugin name, the hook contract, a harness dropped.
- **Minor**: a change that can add decisions: a guard or rule added, a rule moved from ask to deny, a new spelling or file read.
- **Patch**: a change that only removes wrong decisions: a false positive gone, a rule moved from deny to ask.

## 1.2.0

- The marketplace is named `r0charm`: install `agent-guardrails@r0charm`. An install from before 1.2.0 moves with:

  ```bash
  claude plugin uninstall agent-guardrails@agent-guardrails
  claude plugin marketplace remove agent-guardrails
  ```

  then the install in the README.
- Commands are read as the shell will see them (`$IFS`, empty expansions, brace expansion, `$'..'`, backticks, line continuations), and inline argv lists as the words they run.
- The scripts, `make` targets and `npm` scripts a command runs are read, three files deep.
- Pi support dropped.
