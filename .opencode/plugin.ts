import type { Plugin } from "@opencode-ai/plugin"
import path from "path"
import { fileURLToPath } from "url"

// opencode has no hook manifest, so the wiring for it is code rather than the
// JSON hooks/hooks.json gives Claude Code. It stays wiring: the guards
// themselves are scripts/, shared by every harness.

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const scripts = path.join(repoRoot, "scripts")
const guards = [path.join(scripts, "guard")]

export const AgentGuardrails: Plugin = async ({ $ }) => {
  return {
    // Guards take the command as an argument here and read Claude Code's event
    // from stdin there. Exit 2 is a refusal; anything a guard wants merely
    // confirmed prints an ask decision, which opencode has no equivalent for,
    // so it is surfaced as a refusal naming the reason rather than passed.
    "tool.execute.before": async (input, output) => {
      if (input.tool !== "bash") return
      const command = String(output.args?.command ?? "")
      if (!command) return

      for (const guard of guards) {
        const result = await $`${guard} ${command}`.quiet().nothrow()
        if (result.exitCode !== 0) {
          throw new Error(result.stderr.toString().trim() || `BLOCKED: '${command}'`)
        }
        const stdout = result.stdout.toString()
        if (stdout.includes('"ask"')) {
          const reason = JSON.parse(stdout).hookSpecificOutput?.permissionDecisionReason
          throw new Error(
            `NEEDS CONFIRMATION: ${reason} Run it yourself, or ask the user to confirm.`,
          )
        }
      }
    },
  }
}
