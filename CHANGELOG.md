# @rocharm/agent-guardrails

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
