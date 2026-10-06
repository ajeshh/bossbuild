---
id: IDEA-148
type: idea
kind: capability
owner: product-lead
status: exploring (gated — one observed session with a non-technical founder before any build)
proof: n=0 (no non-technical founder has been watched trying to start)
proof_note: done when a founder who has never opened a terminal goes from "I have an idea" to a scaffolded project with BOSS answering in it, without a terminal, and the session that proves it is written up as EVID.
gist: Less technical founders should reach BOSS without a terminal. Before building a downloadable BOSS app, use the surfaces that already exist — Claude's desktop app (Code tab), the plugin as the front door, the generated HTML pages as the visual layer — and watch one real person to see where they actually fall off.
created: 2026-10-05
relates: IDEA-096, IDEA-015, IDEA-065, IDEA-106, IDEA-144, IDEA-055
decisions: DEC-017
altitude: what ships a founder
---

# IDEA-148: BOSS without a terminal

## Current shape
_The best articulation so far. Rewrite this as the idea sharpens._

- **What:** a way for less tech-savvy founders to use BOSS without the terminal. Ajesh, 2026-10-05:
  *"while boss has been primarily cli, im wondering if we should have its own UI, for people to help
  build … downloadable … the CLI but then a ui piece built on top of it. This is for folks less tech
  savvy … its own UI engine to help people get there quickly. Im also open to suggestions if this is
  overkill."*
- **The reframe:** the CLI is not where a founder lives. They talk to Claude Code; BOSS's skills,
  conscience and agents run inside that conversation. The terminal stands in front of three things
  only: opening a terminal, installing Node + Claude Code + `boss`, and the first `boss new`. After
  that, the experience is already a chat. So "a BOSS UI" is mostly a chat window around Claude, which
  Anthropic already ships.
- **First slice (no new surface):** make the path *Claude desktop app → Code tab → BOSS plugin →
  "I have an idea for…"* work end to end, with the plugin carrying `boss new` so the founder never
  types a command. The visual layer is what already renders: the board, the playbook ([[IDEA-106]]),
  `.boss/index.html` ([[IDEA-144]]) — read-only pages to look at, with the chat as the place to act.
- **The gate:** sit one genuinely non-technical person in front of that path and watch where they
  fall off. Install friction → fix the plugin's onboarding. Lost inside the chat → that is the
  orientation gap from EVID-001/003, and no app fixes it. Only a failure *only an app could fix*
  earns the app.

## If the app is ever earned — the shape that keeps BOSS whole

- A thin desktop shell (Tauri or Electron) around the Claude Agent SDK, which runs the same project
  `.claude/` skills and hooks. BOSS stays the body; the shell is clothes (the [[DEC-017]] line, one
  surface over).
- Auth through the founder's own Claude account. Never their API key (hostile to exactly this
  founder), never BOSS reselling inference (a different business: billing, abuse, margin).
- Panels are the generated pages. Read-only. The line from [[IDEA-015]] and [[IDEA-065]] holds:
  *an app holds state and gets edited in, and so becomes a second source of truth* — the files in
  `docs/` stay the truth.

## Why not now

- BOSS has refused "the app" three times ([[IDEA-015]], [[IDEA-034]], [[IDEA-065]]); a downloadable
  UI engine meets the same second-source-of-truth problem.
- The founder evidence says compose and subtract; a second product surface adds.
- n=0: no non-technical founder has been watched bouncing off the terminal. The bounce is assumed.

## Open questions

- Can the plugin run `boss new` (and install the CLI) from inside the Code tab without a terminal
  step, given DEC-017 keeps the plugin thin?
- Does the desktop Code tab load project hooks and settings the way the terminal does?
- Who is the person for the observed session, and what do they get asked to do (`/interview` preps it)?

## Capture log

- 2026-10-05 — captured from Ajesh's question about a downloadable BOSS UI. Recommendation given in
  the session: don't build the app yet; prove the no-terminal path on existing surfaces and watch one
  person first.
