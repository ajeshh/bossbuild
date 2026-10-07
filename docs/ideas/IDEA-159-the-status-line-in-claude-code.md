---
id: IDEA-159
type: idea
kind: capability
owner: product-lead
status: exploring
proof: test/statusline.test.js
created: 2026-10-07
program: PROG-004
relates: IDEA-152, IDEA-156
gist: Where you are in BOSS, always on screen in Claude Code's status line — offered once, never replacing a founder's own line, position only.
---

# IDEA-159 — The status line in Claude Code (PROG-004 B1)

Ajesh, 2026-10-05: *"a bigger feature… more thinking, tomorrow."* This record is that thinking: the five
open questions from PROG-004's log, each with a recommendation, for Ajesh to react to before anything
is built. **Nothing below is decided until Ajesh says so.**

## What was checked first (2026-10-07)

- **The host's rules** (Claude Code docs, statusline + settings reference, read 2026-10-07):
  `statusLine: {type: "command", command, padding?, refreshInterval?}`; stdin is JSON with `cwd`,
  `workspace.current_dir`, `workspace.project_dir` and ~45 other fields; it re-runs after each
  assistant message (300 ms debounce, an in-flight run is cancelled); multi-line output and ANSI are
  supported; it stays blank until the folder is trusted; an error or empty output blanks it.
  **Precedence: a project's `.claude/settings.json` overrides the user's `~/.claude/settings.json`.**
  No documented way for a plugin to contribute one. **Whether it renders in the VS Code extension or
  the desktop app is not in the docs.**
- **`boss status --line` today:** 0.04 s. On a fresh project it prints `BOSS · Quickstart` and
  nothing else. It reads the cwd only — run from `/` with the host's JSON on stdin, it prints nothing.
- **The plugin** puts `boss` on PATH, so the command exists for plugin-only founders too.

## The five questions

**1. Opt-in or default? → Opt-in, offered once at the moment it helps.**
Because a project setting *overrides* the user's, planting it by default would silently replace a
status line the founder built for themselves (cost meters and git branches are common) — without
touching their file, so they'd never find why. Opt-in through the door that exists
(`boss hooks enable statusline`). Offered once, in one line, where orientation is the job: the end of
`boss new` / `boss adopt`, and `/welcome`. Never re-offered after a no.

**2. Read the host's JSON, not the cwd? → Yes: `workspace.project_dir`, then walk up to `.boss/`.**
`project_dir` is where the session started; `current_dir` moves when Claude `cd`s into `src/`. Read
stdin only when it is piped (a founder typing `boss status --line` in a terminal must not hang), with
a short timeout, and fall back to the cwd.

**3. Never overwrite a founder's own line → compose instead of refusing.**
If any settings level the founder owns (`~/.claude/settings.json`, `.claude/settings.local.json`,
or the project file) already has a `statusLine`, don't replace it. Offer to **add BOSS as a second
row**: the planted command runs their command with the same stdin, prints its output, then BOSS's
line. Multi-line is supported, so both survive. `boss hooks disable statusline` restores exactly what
was there (the original command is kept in `.boss/`).

**4. What does it say when nothing is in flight? → The next step, with the command.**
`BOSS · Quickstart` alone is the one state where a founder is most lost and the line says least.
PROG-004 rule 4 (a missing argument names the obvious one) applies: no idea yet →
`BOSS · Quickstart · next: /boss <your idea>`; an idea but no canvas → `next: /canvas`; and so on,
reusing `computeNext` and `nextSeam`. The existing in-flight phrasings stay.

**5. Carry the conscience, or position only? → Position only — plus one state word.**
A status line is on screen every turn; the conscience's promise is *says one thing when you're
drifting, stays quiet the rest of the time*. A nudge pinned to the screen is the opposite of quiet,
and it would compete with the in-chat nudge that has context. The one exception is state, not
advice: when the conscience is paused, say `conscience paused` — a founder who forgot they muted it
should be able to see that. No counts, no streaks, no nudges.

## The open question only Ajesh can answer in ten seconds

- **Does a status line show in the VS Code panel you use?** The docs only describe the terminal. If
  it doesn't show there, B1 reaches terminal users only — still worth it, but the offer in Q1 should
  say "in the terminal", and the IDE-first founders need another surface (B2's shell completion
  doesn't help them either). A quick check: open any project, run `/statusline` in the panel.

## If approved — the build, small

- [ ] S1 · `--line` reads `workspace.project_dir` from piped stdin (timeout, cwd fallback) and names
  the next step when nothing is in flight; `conscience paused` when paused
- [ ] S2 · `boss hooks enable statusline`: plant, or compose over an existing line; `disable` restores
- [ ] S3 · the one-line offer at the end of `boss new` / `boss adopt` and in `/welcome`
- [ ] S4 · tests: never clobbers a user-level line; composed output carries both; disable round-trips;
  no stdin hang
- [ ] S5 · a live check in a throwaway project in the terminal (and the panel, if Q above says yes)
