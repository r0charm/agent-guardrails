import type { ExtensionAPI } from "@earendil-works/pi-coding-agent"
import { spawn } from "node:child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"

type GuardResult =
  | { outcome: "pass" }
  | { outcome: "ask"; reason: string }
  | { outcome: "deny"; reason: string }

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const scripts = path.join(repoRoot, "scripts")
const guards = ["git-guard", "fs-guard", "kubernetes-guard", "data-guard", "cloud-guard"].map((guard) =>
  path.join(scripts, guard),
)

function runGuard(guard: string, command: string, signal?: AbortSignal): Promise<GuardResult> {
  return new Promise((resolve, reject) => {
    const child = spawn(guard, [command], {
      stdio: ["ignore", "pipe", "pipe"],
    })

    const stdout: Buffer[] = []
    const stderr: Buffer[] = []

    child.stdout.on("data", (chunk) => stdout.push(Buffer.from(chunk)))
    child.stderr.on("data", (chunk) => stderr.push(Buffer.from(chunk)))
    child.on("error", reject)

    const abort = () => child.kill("SIGTERM")
    signal?.addEventListener("abort", abort, { once: true })

    child.on("close", (code, killedSignal) => {
      signal?.removeEventListener("abort", abort)

      if (killedSignal || signal?.aborted) {
        reject(new Error("Guard execution aborted"))
        return
      }

      const stdoutText = Buffer.concat(stdout).toString("utf8").trim()
      const stderrText = Buffer.concat(stderr).toString("utf8").trim()

      if (code === 2) {
        resolve({
          outcome: "deny",
          reason: stderrText || `Blocked by ${path.basename(guard)}`,
        })
        return
      }

      if (code !== 0) {
        reject(new Error(stderrText || `${path.basename(guard)} exited with code ${code}`))
        return
      }

      if (!stdoutText.includes('"ask"')) {
        resolve({ outcome: "pass" })
        return
      }

      try {
        const payload = JSON.parse(stdoutText) as {
          hookSpecificOutput?: { permissionDecisionReason?: string }
        }
        resolve({
          outcome: "ask",
          reason: payload.hookSpecificOutput?.permissionDecisionReason || `Confirmation required by ${path.basename(guard)}`,
        })
      } catch {
        reject(new Error(`Could not parse guard output from ${path.basename(guard)}`))
      }
    })
  })
}

export default function (pi: ExtensionAPI) {
  pi.on("tool_call", async (event, ctx) => {
    if (event.toolName !== "bash") return

    const command = String(event.input.command ?? "").trim()
    if (!command) return

    for (const guard of guards) {
      const result = await runGuard(guard, command, ctx.signal)

      if (result.outcome === "pass") continue

      if (result.outcome === "deny") {
        return { block: true, reason: result.reason, terminate: true }
      }

      if (!ctx.hasUI) {
        return {
          block: true,
          reason: `Needs confirmation: ${result.reason}`,
          terminate: true,
        }
      }

      const confirmed = await ctx.ui.confirm(
        "Guardrail confirmation",
        `${result.reason}\n\nCommand:\n${command}\n\nAllow this one command?`,
      )

      if (!confirmed) {
        return {
          block: true,
          reason: `Needs confirmation: ${result.reason}`,
          terminate: true,
        }
      }
    }
  })
}
