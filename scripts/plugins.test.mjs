// Loads the opencode wiring with a stand-in for the harness and checks
// that every outcome of scripts/guard reaches it: deny, ask and pass. The rules
// themselves are scripts/test's job; this is only the wiring.
//
// Run by scripts/test as: node --experimental-strip-types scripts/plugins.test.mjs

import { test } from "node:test"
import assert from "node:assert/strict"
import { spawn } from "node:child_process"

const DENY = "git reflog expire --all"
const ASK = "git push"
const PASS = "git status"

// opencode hands plugins Bun's `$`. Each interpolated value is one argument,
// as Bun escapes it, so the stand-in runs the values as argv.
function bunShell(strings, ...values) {
  const run = () =>
    new Promise((resolve) => {
      const [cmd, ...args] = values
      const child = spawn(cmd, args)
      const out = []
      const err = []
      child.stdout.on("data", (c) => out.push(c))
      child.stderr.on("data", (c) => err.push(c))
      child.on("close", (exitCode) =>
        resolve({ exitCode, stdout: Buffer.concat(out), stderr: Buffer.concat(err) }),
      )
    })
  return { quiet() { return this }, nothrow: run }
}

const { AgentGuardrails } = await import("../.opencode/plugin.ts")
const opencode = (await AgentGuardrails({ $: bunShell }))["tool.execute.before"]
const bash = (command) => opencode({ tool: "bash" }, { args: { command } })

test("opencode: deny refuses with the guard's reason", async () => {
  await assert.rejects(bash(DENY), /BLOCKED \(git\)/)
})

test("opencode: ask refuses, naming the reason", async () => {
  await assert.rejects(bash(ASK), /NEEDS CONFIRMATION: git: pushes to a remote/)
})

test("opencode: pass runs", async () => {
  await bash(PASS)
})

test("opencode: other tools are left alone", async () => {
  await opencode({ tool: "read" }, { args: { command: DENY } })
})
