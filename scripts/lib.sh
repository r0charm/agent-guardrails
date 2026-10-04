# Shared by every guard. Not executable on its own.
#
# A guard defines two lists and calls `guard_run`:
#
#   DENY  patterns that must never run, whoever asks. Exit 2, which stops the
#         call before permission rules are even evaluated.
#   ASK   patterns that need a human. Emits the PreToolUse ask decision, which
#         survives auto mode where the classifier would otherwise decide.
#
# Matching ignores case unless the guard sets CASE_SENSITIVE=1, which git needs:
# `branch -D` force-deletes and `branch -d` refuses an unmerged branch.
#
# Anything matching neither exits 0 and takes whatever path the permission
# rules give it. Guards never grant: a guard that returns "allow" would
# override rules written elsewhere, and nothing here is worth that.

set -uo pipefail

# Claude Code sends the event as JSON on stdin. Everything else passes the
# command as arguments, which is also how the guards are tested.
guard_command() {
  if [ "$#" -gt 0 ]; then
    printf '%s' "$*"
  elif command -v jq >/dev/null 2>&1; then
    jq -r '.tool_input.command // empty'
  else
    # No jq means no way to read the event. Say so rather than exiting 0 and
    # leaving the caller believing a guard ran.
    echo "GUARD ERROR: jq is required to read the hook event." >&2
    exit 2
  fi
}

guard_deny() {
  echo "BLOCKED: $2" >&2
  echo "" >&2
  echo "  Command: $1" >&2
  echo "" >&2
  echo "This is denied outright, not pending approval. Run it yourself if you mean it." >&2
  exit 2
}

guard_ask() {
  jq -n --arg reason "$1" '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "ask",
      permissionDecisionReason: $reason
    }
  }'
  exit 0
}

# Each list entry is "pattern<TAB>reason", so the reason shown names the rule
# that fired rather than the whole list.
guard_match() {
  local command="$1" entry pattern flags=-qiE
  shift
  [ -n "${CASE_SENSITIVE:-}" ] && flags=-qE
  for entry in "$@"; do
    [ -n "$entry" ] || continue
    pattern="${entry%%	*}"
    [ -n "$pattern" ] || continue
    if printf '%s' "$command" | grep "$flags" "$pattern"; then
      printf '%s' "${entry#*	}"
      return 0
    fi
  done
  return 1
}

# $1 is the regex a command must match for this guard to care at all, so a
# git guard stays out of the way of kubectl.
guard_run() {
  local scope="$1" command reason
  command=$(guard_command "${@:2}")
  [ -n "$command" ] || exit 0

  # The shell strips quotes and backslashes before it runs anything, so
  # `"git" push`, `git 'reset' --hard` and `git<TAB>push` run as the plain
  # command. Match the raw text and the text as the shell will see it, one per
  # line, so a pattern written for one catches the other.
  local seen
  seen=$(printf '%s' "$command" | tr -d "'\"\\\\" | tr '\t' ' ')
  seen="$command"$'\n'"$seen"
  printf '%s' "$seen" | grep -qE "$scope" || exit 0

  if reason=$(guard_match "$seen" "${DENY[@]:-}"); then
    guard_deny "$command" "$reason"
  fi
  if reason=$(guard_match "$seen" "${ASK[@]:-}"); then
    guard_ask "$reason"
  fi
  exit 0
}
