---
name: boss-sync
description: Pull current BOSS practices into this project — bring the installed modes' skills/agents up to the latest version as a reviewed, narrated diff, then bump the project's BOSS pin. The judgment layer over `boss sync`. Usage - /boss-sync
---

# /boss-sync — bring this project current

The distribution half of the learning loop (PRINCIPLES #1): improvements promoted UP into the BOSS
library flow back DOWN into every connected project. This skill brings *this* project's BOSS-managed
files (the skills, agents, and hooks of its installed modes) up to the current version — reviewed, not
blind. Hook *registrations* are merged into `.claude/settings.json` additively, never clobbering your
own permissions or hooks.

## 0. Orient (silent)

- `boss status` — current mode, the project's BOSS pin, and whether newer practices exist.
- `boss changelog --full` — **what changed since this project's pin**, straight from the installed
  package. This is the narration you'll give the user (not just a file list); without it you are
  describing files moving, which is the blind sync this skill exists to prevent.

## 1. Preview

Run `boss sync` (no flags). It lists each BOSS-managed file (skills, agents, hooks) as `new`,
`changed (N lines)`, or up to date, across all installed modes; flags a `~ merge settings/hooks` line if
hook registrations need adding to `.claude/settings.json`; and reconciles any stale mode label (e.g. an
old `L0-sketch` pin → `L0-quickstart`).

## 2. Review (the judgment)

Before applying, for each **changed** file:
- Read the project's current copy and the incoming version. Summarize what actually changes.
- **Flag conflicts:** if the project edited a BOSS-managed file locally, a sync overwrites it. Call this
  out by name and ask before clobbering. (v1 syncs BOSS-managed skills/agents only — see scope below.)
- Tie changes back to the CHANGELOG entries so the user understands *why*, not just *what*.

## 3. Apply

- `boss sync --apply` — writes the new/changed files and bumps the project's `.boss` pin to current.
- Then show `git diff` and let the user review and commit. The project is the source of truth for its
  own history; BOSS just proposes the update.

## Scope

- Syncs **BOSS-managed skills, agents, and hook scripts** for installed modes.
- **Merges hook registrations into `.claude/settings.json`** additively — adds the `UserPromptSubmit`
  (etc.) entries BOSS ships, matched by command so it's idempotent, and **preserves your permissions and
  any hooks you added.** This is the one user-editable file sync touches, and only the `hooks` block.
- Does **not** auto-merge `CLAUDE.md` or other `settings.json` keys. If the CHANGELOG implies those should
  change, surface it and let the user merge by hand.
- New skills/agents/hooks added to a mode since the pin are pulled in; nothing is removed.

## Rules

- Review before `--apply`. Never overwrite a locally-edited managed file without flagging it first.
- Narrate from the CHANGELOG — the user should learn what's new, not just see files move.
- Don't commit for the user; hand them a clean `git diff` to review.
