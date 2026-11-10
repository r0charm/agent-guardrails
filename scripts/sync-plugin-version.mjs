#!/usr/bin/env node
// Copies package.json's version into .claude-plugin/plugin.json, so the two
// never disagree. `npm run version` runs it right after `changeset version`.
// With --check it writes nothing and exits 1 when they differ.

import { readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const pluginPath = join(root, ".claude-plugin", "plugin.json")
const { version } = JSON.parse(readFileSync(join(root, "package.json"), "utf8"))
const source = readFileSync(pluginPath, "utf8")
const current = JSON.parse(source).version

if (current === version) {
  console.log(`plugin.json is at ${version}`)
  process.exit(0)
}
if (process.argv.includes("--check")) {
  console.error(`plugin.json is at ${current}, package.json at ${version}: run npm run version`)
  process.exit(1)
}

// Only the version line changes, so key order and formatting stay as written.
const updated = source.replace(/("version"\s*:\s*")[^"]*(")/, `$1${version}$2`)
if (JSON.parse(updated).version !== version) {
  console.error(`no version field to replace in ${pluginPath}`)
  process.exit(1)
}
writeFileSync(pluginPath, updated)
console.log(`plugin.json ${current} -> ${version}`)
