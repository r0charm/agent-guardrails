# @rocharm/agent-guardrails

## 0.1.0

First release on npm, and a fresh start for the version: the versions up to 1.2.0 were development builds.

- Claude Code: `claude plugin marketplace add r0charm/agent-guardrails`, then `claude plugin install agent-guardrails@agent-guardrails`. An install of 1.2.0 (`agent-guardrails@r0charm`) moves with `claude plugin uninstall agent-guardrails@r0charm` and `claude plugin marketplace remove r0charm` first.
- opencode: `"plugin": ["@rocharm/agent-guardrails"]` in `opencode.json`.
- Commands are read as the shell will see them (`$IFS`, empty expansions, brace expansion, `$'..'`, backticks, line continuations), inline argv lists as the words they run, and the scripts, `make` targets and `npm` scripts a command runs, three files deep.
