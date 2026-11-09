# Contributing

```bash
git clone https://github.com/r0charm/agent-guardrails.git
cd agent-guardrails
scripts/test   # Node 22+ also loads the opencode wiring
```

Try one command without a harness:

```bash
scripts/guard "kubectl delete namespace prod"; echo $?   # 2 denied, 0 with JSON asked, 0 silent
scripts/guard --only kubernetes "kubectl delete namespace prod"
```

## Add a guard

1. Create `guards/<name>/` with three files:
   - `rules`: `SCOPE`, `DENY`, `ASK`, and optionally `SKIP`, `CASE_SENSITIVE`, `COMMAND_ONLY`. The header of `scripts/guard` documents each.
   - `cases`: one `DENY`, `ASK` or `PASS` and a command per line, including the reads that must stay silent.
   - `policy.md`: what it guards and why each rule is deny or ask.
2. Anchor every verb, so a word inside an argument does not fire.
3. Keep `deny` small: a denied command can only be authorised by editing the guard.
4. Run `scripts/test`.

Nothing outside the folder names a guard, so dropping one is deleting its folder.

## Releases

See [CHANGELOG.md](CHANGELOG.md) for the versioning policy.
