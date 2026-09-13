---
id: IDEA-023
type: idea
owner: product-lead
status: shipped
gist: The on-ramp from 'I jotted it somewhere' — point BOSS at a doc, a PDF, an Obsidian note or a deck and have it brought in, instead of retyping an idea that already exists.
proof: stages/L0-quickstart/template/.claude/skills/import
---

# IDEA-023 — Bring-your-own-material import (the on-ramp from "I jotted it somewhere")

**Occasioned by** the 2026-06-19 founder-test session
([SESSION-2026-06-19-founder-test](../research/sessions/SESSION-2026-06-19-founder-test.md),
OBS-003 → OBS-005). Ajesh ran `boss new fraands`, then stalled — the idea lived *elsewhere*
(Word / Google Doc / Obsidian / PDF / slides / online refs) and there was **no on-ramp to bring it
in.** A correctly-scaffolded but idea-less project read to him as *"empty… im stuck."*

## The problem (founder's words)

> *"I may have jotted the idea anywhere, on a word doc, google doc, obsidian note… I wish i was able
> to just point to a file, somewhere and it can create a dupe or read it, so that its then brought into
> the folder. Like I could have a pdf, or presentations or online references. Need someway to migrate
> them in."*

Two distinct frictions:
1. **Discoverability** — `/boss <path>` already reads a single local PRD path, but the founder didn't
   know it existed at the moment of need.
2. **Capacity + heterogeneity** — material is multi-source and multi-format (docx, gdoc, obsidian, pdf,
   slides, URLs), not one tidy markdown PRD. And it may exist *before* the project folder does
   ("huge step to wait for BOSS to create a folder" first).

**Severity:** this is a *first-run dead-end*, not a nicety. The founder who arrives with material is the
common case; today they hit a wall right after `boss new`.

## The load-bearing decision (architecture)

BOSS's `src/` CLI is **zero-dependency (Node built-ins only)** — it cannot parse PDF/docx or fetch a
Google Doc without taking on deps, which Principle 4 forbids. The **skill layer (Claude in the project)
already can** read PDFs, extract Word docs, read Obsidian notes, and fetch URLs via its native tools.

→ **Import lives in the skill layer, not the CLI.** Deterministic core does the deterministic part
(snapshot/copy a local file into the project); the model does the judgment part (read heterogeneous
formats, shape them into an IDEA). Same predicate/runner split as [[IDEA-008]] loops.

## Smallest real slice (the build)

1. **Extend `/boss`** to ingest **one-or-more** sources — local files *and* URLs — not just a single
   PRD path. For each source: read it, write a **durable snapshot** into `docs/source/` (so the
   project owns a copy, per "create a dupe"), then seed/feed the `IDEA-001` capture from all of them.
2. **Discoverability fix** (the part that actually stuck the founder): advertise BYO-material on the
   `boss new` "Next:" output, in `/welcome`, and in the CLAUDE.md spin-up line.
3. **Thin `/import` skill** — the verb the founder reached for. Either a real alias that hands off to
   `/boss`'s ingest path, or a focused skill for "add material to an existing project's idea."

## Deferred (named, not forgotten)

- **Material-first ordering** — point at material → BOSS proposes the folder name *from* it → creates
  the project. (Founder's "huge step to wait for the folder" friction. Bigger; later.)
- **Binary/edge formats** — `.pptx` slide text, image-only PDFs (OCR), `.docx` with embedded media.
  Handle the common text-bearing cases first.
- **Live-source links** — a Google Doc that keeps changing vs. a one-time snapshot. Snapshot first;
  "re-pull" is a later question (touches the freshness/staleness theme in [[IDEA-020]]/[[IDEA-014]]).
- **A CLI `boss import`** staging command (pure local-file copy is zero-dep-safe) — only if the skill
  path proves it's wanted as a non-Claude entry point. Don't build the second door first.

## Relationship to existing ideas

- **Not [[IDEA-005]] brownfield (`boss adopt`)** — that adopts an existing *codebase*; this imports
  *idea material* into a fresh project. Adjacent on-ramps, different objects.
- **Touches [[IDEA-006]] host-portability** indirectly — if import is a skill, it's Claude-bound like
  the rest of the conscience; a future non-Claude host needs its own ingest. Name it; don't port.

## Dogfood target

`~/Projects/fraands` — build import, then resume fraands *through* it. The session that surfaced the
gap closes it.
