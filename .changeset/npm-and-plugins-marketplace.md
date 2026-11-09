---
"@rocharm/agent-guardrails": major
---

The marketplace moves to `r0charm/plugins`, which lists every r0charm plugin, and opencode installs from npm. Move a Claude Code install with `claude plugin marketplace remove r0charm`, then `claude plugin marketplace add r0charm/plugins` and `claude plugin install agent-guardrails@r0charm`. For opencode, replace the clone and link with `"plugin": ["@rocharm/agent-guardrails"]` in `opencode.json`.
