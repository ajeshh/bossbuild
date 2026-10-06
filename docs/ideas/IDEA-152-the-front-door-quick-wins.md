---
id: IDEA-152
type: idea
kind: capability
owner: product-lead
status: building
proof: test/front-door.test.js
program: PROG-004
created: 2026-10-05
relates: IDEA-150, IDEA-148
gist: The cheapest usability wins in the front door — the slash menu shows what to type, `boss unlock` with no mode names the next one, one status line for any bar, and bare `boss` in a project says where you are.
---

# IDEA-152 — The front door, quick wins

Ajesh, 2026-10-05: *"lets start with the easiest and quickest ones that deliver the most. and then save
the rest."* The rest is PROG-004's backlog. Each task below was checked against what `boss` does
today before it was written down (did-you-mean, examples in help, project-scoped help already exist).

## Tasks

- [ ] **Q1 · `argument-hint` on every shipped skill**, derived from its `Usage -` tail. The host shows
  it greyed after `/canvas ` as you type; today the usage sits at the end of a description the `/`
  menu truncates. A test keeps the two in step.
- [ ] **Q2 · `boss unlock` with no mode** names the next rung and shows its bar, ending in the command
  to type. Today: `usage: boss unlock <mode> (current: MVP)` — it knew the answer and didn't say it.
- [ ] **Q3 · `boss status --line`** — one plain line (mode · building now · what needs you) for any
  status bar or prompt: Claude Code's `statusLine`, a Starship custom module. Plain text, no colour.
- [ ] **Q4 · Bare `boss` inside a project** opens with that line and points at `boss status`, then help.
  Outside a project it is unchanged.

## Not in this slice

Planting the status line, shell completion, hiding internal skills — PROG-004 B1–B8.
