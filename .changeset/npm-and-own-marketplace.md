---
"@rocharm/agent-guardrails": major
---

The marketplace is named `agent-guardrails` again, so install is `agent-guardrails@agent-guardrails`, and opencode installs from npm. Move a Claude Code install from 1.2.0 with `claude plugin uninstall agent-guardrails@r0charm` and `claude plugin marketplace remove r0charm`, then `claude plugin marketplace add r0charm/agent-guardrails` and `claude plugin install agent-guardrails@agent-guardrails`. For opencode, replace the clone and link with `"plugin": ["@rocharm/agent-guardrails"]` in `opencode.json`.
