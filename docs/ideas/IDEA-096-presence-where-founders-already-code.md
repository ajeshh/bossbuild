---
id: IDEA-096
type: idea
owner: mentor-customers
status: shipped (the copy v0.296.0 and the plugin door v0.302.0; the port is IDEA-006, parked)
gist: BOSS already runs at full strength inside VS Code, Cursor, JetBrains and other VS Code forks — through the Claude Code extension — and tells nobody. The Cursor answer is copy, not a port. What is genuinely open is presence: where founders find BOSS, not where it runs.
program: host-and-portability
proof: README.md
proof_note: >
  Nothing on disk yet. The earned slice is a paragraph in README + site, and its checker is the
  claim itself being true — which two primary sources confirm below. Everything past copy is
  gated on IDEA-006's trigger or on a founder asking.
created: 2026-09-11
relates: IDEA-006, IDEA-032, IDEA-095, IDEA-066, EVID-001
---

# IDEA-096 — presence where founders already code

> Seed: Ajesh, 2026-09-11 — *"alot of folks use vscode, cursor, so maybe its worth trying to figure
> out how to be added to those places or any other place that is cli like but used for coding?"*

## Three questions, and two were already answered

[[IDEA-006]] resolved this once, on 2026-06-05 (*"plugin for VSCode/Cursor/vim?"*), by splitting
two questions that sound like one:

1. **Where do I type?** — the editor surface. **Already solved:** Claude Code runs in the terminal,
   VS Code, JetBrains and the web, so BOSS is already cross-surface at full strength.
2. **What hosts the conscience?** — a capability question. Claude Code only; anything else gets
   Layer 1 (the CLI) and no unprompted firing. Parked, with a written re-open trigger.

Today's ask adds a third, and it is the one nobody has held:

3. **Where do founders *find* it?** — presence and distribution. The Claude Code VS Code extension
   is the answer to (1); a founder in Cursor does not know that, and BOSS does not tell them.

## What changed since June (verified 2026-09-11, primary sources)

- **Claude Code's extension installs in Cursor and other forks.** Its own docs carry an explicit
  *"Install for Cursor"* link (`cursor:extension/anthropic.claude-code`) and say *"The extension also
  installs in other VS Code forks like Devin Desktop or Kiro,"* with a fallback to the Open VSX
  registry. Source: code.claude.com/docs/en/vs-code, read 2026-09-11.
  **So BOSS in Cursor is already true, conscience included** — via the Claude Code extension, not
  Cursor's own agent.
- **Cursor's native agent now has hooks.** `.cursor/hooks.json` documents `sessionStart` (with
  `additional_context`), `beforeSubmitPrompt`, `preCompact`, `stop`, and more — the same four
  primitives BOSS's conscience uses (`SessionStart` → `reentry.js`, `UserPromptSubmit` →
  `conscience.js`). Source: cursor.com/docs/agent/hooks, read 2026-09-11. IDEA-006's table row
  *"none have Claude Code's hooks"* (2026-06-02) is stale; the correction is logged there.

## The map

| Where a founder codes | What BOSS is there | Cost to be present |
|---|---|---|
| Claude Code — terminal | full BOSS | done |
| VS Code + Claude Code extension | full BOSS | **copy** — README says `code .` once; the site says nothing |
| **Cursor** + Claude Code extension | full BOSS | **copy** — nobody is told this works |
| Kiro / Windsurf / other forks + the extension | full BOSS (per Claude's docs; unverified by us) | copy, hedged until someone runs it |
| JetBrains + Claude Code plugin | full BOSS | copy |
| Cursor's **own** agent | Layer 1 today; a port is now *possible* (hooks exist) | a port — [[IDEA-006]], still gated |
| Codex CLI / Gemini CLI / Copilot CLI / Zed / OpenCode / Aider | Layer 1; `AGENTS.md` already read ([[IDEA-032]]) | unknown — hooks/commands per host **not surveyed; don't claim** |
| Windows / Linux, any of the above | see [[IDEA-095]] | four fixes + a CI matrix |

The first five rows are the whole earned slice, and they cost words.

## Distribution — the part that is actually new

Where a founder would *discover* BOSS, ranked by how much it costs and how much it invents:

1. **Say it where it is already true.** README install block + one line on the site: *"Runs wherever
   Claude Code runs — terminal, VS Code, Cursor, JetBrains."* Zero build. Do this first.
2. **Claude Code plugin marketplace.** BOSS's shape — skills + agents + hooks + settings — *is* the
   plugin shape, and `/plugin` is a discovery surface inside the home host. **Open question, not a
   task:** a plugin delivers the surface without `boss new`'s substrate (`.boss/`, the registry, the
   stage tree). Is a plugin BOSS, or the CLI's clothes without its body? IDEA-006's *"under beats
   on-top"* verdict argues for keeping the scaffold primary and letting a plugin be the front door
   that points at it. Needs a design note before anything is built.
3. **Community listings** (cursor.directory, awesome-lists, Open VSX for the extension itself).
   Cheap, and n=0 says reach-money before a single founder asks is Principle 2 backwards.
4. **Cursor native / other-host ports.** [[IDEA-006]]. The host half of its trigger is now met for
   Cursor; the founder half is not. It stays parked until one asks.

## Refusals (carried from IDEA-006, still standing)

- **No VS Code extension of our own.** That is "shell on top" — middleware chasing N hosts' APIs.
  The extension that matters already exists and is not ours to maintain.
- **No "supports Codex / Gemini / Copilot" claim** without having run it. The table above says
  *unknown* on purpose; the survey is a `/comp-eval`-shaped job when a founder on one of them shows up.
- **No port before a founder asks.** The evidence memory is explicit: more surface ≠ more readiness.

## Gate — moved to IDEA-006, 2026-09-13

This record closes at the scope it shipped: the copy (v0.296.0) and the plugin door (v0.302.0,
DEC-017). The port — everything below row 2 — is [[IDEA-006]]'s, parked there with the triggers
that used to sit here. Everything below it re-opens on **one of**:
a founder on a non-Claude-Code host asks for BOSS (flips IDEA-006 fully), or a Claude Code plugin
design note answers the substrate question above.

## Capture log
- 2026-09-11 (evening) — **row 2 shipped: BOSS is a Claude Code plugin (v0.302.0, DEC-017 — the
  front door, never the body).** `/plugin marketplace add ajeshh/bossbuild` → `/plugin install
  boss@bossbuild`. Submission to `claude-community` is Ajesh's form. Same day, `/comp-eval` filed
  the plugin field (`docs/competition/claude-plugin-field.md` + `superpowers.md`): **superpowers
  ships to fourteen hosts from one repo with per-host adapter dirs** — the worked example for this
  record's table if IDEA-006 ever re-opens; and **`boss-ai-agent` already exists in the community
  marketplace** doing chase-reminders (DEC-016's forbidden thing) — the `boss` submission's first
  line must say what BOSS is not.
- 2026-09-11 (later) — row 1 shipped in v0.296.0: one sentence in README, `web/_shell.html` (every
  page's footer), `web/index.html`, `web/start.html`. Nothing else built.
- 2026-09-11 — captured with IDEA-095. Two facts verified against primary sources the same day
  (Cursor hooks; the extension installs in Cursor). Owner is `mentor-customers` because the open
  half is reach, not capability.
