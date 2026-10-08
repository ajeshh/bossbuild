---
id: IDEA-166
type: idea
kind: capability
owner: product-lead
status: seedling
created: 2026-10-08
program: PROG-006
relates: IDEA-005, IDEA-020, IDEA-162
gist: "Help me hold the context" — just enough BOSS that a project remembers what it is and where you left off, and its HQ card writes itself.
next: list the Desk's exact file set against today's L0 and L1 templates (2026-10-08)
---

# IDEA-166 — The Desk

The room above the Mailroom: you get a desk — your files, your notes, where you left off. RESUME is
what's on the desk when you sit down.

## What goes on the desk (draft, from sorting today's templates)

- `CLAUDE.md` / `AGENTS.md` — the working rules
- `docs/RESUME.md`, `docs/ideas/` + `INDEX.md`, `docs/IDS.md`, `docs/source/`
- Hooks: re-entry, memory-cue, secrets-guard
- Skills: `/idea`, `/inbox`, `/decide`, **`/close` and `/log`** — these two ship in MVP today, not
  Quickstart, so the Desk takes from both modes (PROG-006 Q1)

Left out: agents, the conscience, loops, canvas, evidence, everything venture.

## Why it matters most

This is the room that fixes the forgetting: a session opens by reading where you were and closes by
writing it, so the HQ card is never stale. The Mailroom's card is only as current as the last time
you typed into it.

## Tasks

- [ ] The exact file set, checked against `stages/L0-quickstart/template/` and `stages/L1-mvp/template/`.
- [ ] How a room is installed: a manifest per room, or a tag on each file saying which rooms carry it
  (one source of truth either way — never a second copy of a skill).
- [ ] `boss adopt --desk` on an existing repo; test it on a throwaway with its own `BOSS_HOME`.

## Found while building
