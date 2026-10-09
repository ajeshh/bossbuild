---
id: IDEA-166
type: idea
kind: capability
owner: product-lead
status: seedling
created: 2026-10-08
program: PROG-006
relates: IDEA-005, IDEA-020, IDEA-162
gist: "Help me hold the context" — working rules, RESUME and decisions, so a project remembers where you left off and its HQ card writes itself.
next: list the Office's exact file set against today's L0 and L1 templates (2026-10-08)
---

# IDEA-166 — The Office

Level 3, above the Mailroom: you get an office. The Mailroom catches things; the Office remembers them.
RESUME is what's on your desk when you walk in.

## What goes in the office (draft, from sorting today's templates)

Everything in the Mailroom and Security, plus:

- `CLAUDE.md` / `AGENTS.md` — the working rules
- `docs/RESUME.md`, `docs/decisions/`
- Hooks: re-entry, memory-cue
- Skills: `/decide`, **`/close` and `/log`** — these two ship in MVP today, not Quickstart, so the
  Office takes from both modes (DEC-024)

Left out: agents, the conscience, loops, canvas, evidence, everything venture.

## Why it matters most

This is the floor that fixes the forgetting: a session opens by reading where you were and closes by
writing it, so the HQ card is never stale. Below the Office, the card is only as current as the last
time you typed into it.

## Tasks

- [ ] The exact file set, checked against `stages/L0-quickstart/template/` and `stages/L1-mvp/template/`.
- [ ] The Office preset, as a list of IDEA-163 part names (DEC-024: floors are presets over parts).
- [ ] `boss adopt --floor office` on an existing repo; test it on a throwaway with its own `BOSS_HOME`.

## Found while building
