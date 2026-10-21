// Loads the opencode and Pi wiring with a stand-in for each harness and checks
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

// Pi hands extensions an API to register on, and each tool call a context.
const handlers = {}
const { default: register } = await import("../.pi/plugin.ts")
register({ on: (event, handler) => { handlers[event] = handler } })
const prompts = []
const pi = (command, { hasUI = true, confirm = false } = {}) =>
  handlers.tool_call(
    { toolName: "bash", input: { command } },
    {
      hasUI,
      signal: new AbortController().signal,
      ui: { confirm: async (title, body) => { prompts.push(body); return confirm } },
    },
  )

test("pi: deny blocks and ends the turn", async () => {
  const result = await pi(DENY)
  assert.equal(result.block, true)
  assert.equal(result.terminate, true)
  assert.match(result.reason, /BLOCKED \(git\)/)
})

test("pi: ask prompts with the reason and the command", async () => {
  prompts.length = 0
  assert.equal(await pi(ASK, { confirm: true }), undefined)
  assert.equal(prompts.length, 1)
  assert.match(prompts[0], /git: pushes to a remote/)
  assert.match(prompts[0], /git push/)
})

test("pi: ask declined blocks", async () => {
  const result = await pi(ASK, { confirm: false })
  assert.equal(result.block, true)
  assert.match(result.reason, /Needs confirmation/)
})

test("pi: ask with no UI blocks rather than runs", async () => {
  prompts.length = 0
  const result = await pi(ASK, { hasUI: false })
  assert.equal(result.block, true)
  assert.equal(prompts.length, 0)
})

test("pi: pass runs without a prompt", async () => {
  prompts.length = 0
  assert.equal(await pi(PASS), undefined)
  assert.equal(prompts.length, 0)
})

test("pi: other tools are left alone", async () => {
  assert.equal(
    await handlers.tool_call({ toolName: "read", input: { command: DENY } }, { hasUI: false }),
    undefined,
  )
})
