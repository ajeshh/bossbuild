---
id: IDEA-032
type: idea
owner: product-lead
status: shipped
gist: BOSS scaffolds only CLAUDE.md, which locks every venture it creates to one host — contradicting both its own host-agnostic claim and the optionality principle. AGENTS.md is the cross-tool answer.
program: host-and-portability
proof: stages/L0-quickstart/template/AGENTS.md
created: 2026-06-20
---

# IDEA-032 — Scaffold AGENTS.md (the host-neutral agent file)

> Seed: the 2026-06-20 Anthropic-appeal + gaps research
> ([dossier](../dossier/anthropic-appeal-and-gaps-2026.md)). **The clearest, cheapest miss — and it
> fixes a contradiction with BOSS's own [[IDEA-006]] host-portability principle.**

## The gap (verified in-repo)

BOSS scaffolds **only `CLAUDE.md`** (Claude-specific). But `AGENTS.md` is the cross-tool open "README
for agents" — 60k+ projects, read by Codex, Cursor, Copilot, Devin, and others; AAIF-stewarded
(https://agents.md). By emitting Claude-only, **every BOSS-scaffolded venture is locked to one host** —
which directly contradicts IDEA-006 (the CLI is meant to be host-agnostic; only the *conscience* is
Claude-bound) and Principle #5 (optionality by default).

## The cut (where host-neutral ends and Claude-specific begins)

- **`AGENTS.md` (host-neutral):** the working rules any agent should follow — capture-before-build,
  stack-neutral-until-decided, source-of-truth-is-docs, small-reversible-steps, ask-before-irreversible,
  don't-over-build, the mode/ID conventions. This is most of today's `CLAUDE.md` working-rules block.
- **`CLAUDE.md` (Claude-specific):** the conscience hook, the skills, the `.claude/` specifics — the
  parts that only mean something inside Claude Code. Keep these here; have CLAUDE.md **reference
  AGENTS.md** for the shared rules (don't duplicate — duplication is the drift surface).

The standard pattern: AGENTS.md is canonical; CLAUDE.md is a thin host-specific layer that points at it
(some projects even symlink). Pick the non-duplicating shape.

## Why it's not a one-liner (build carefully, not at the tail of a marathon)

It touches a **load-bearing file across all templates** (L0–L3 CLAUDE.md) + the scaffold/adopt logic:
- `boss new` emits both files.
- `boss adopt` must append to / create both non-destructively (it already handles CLAUDE.md; AGENTS.md
  needs the same care — and a repo may already *have* an AGENTS.md to preserve).
- `boss sync` / the doc generators may reference CLAUDE.md.
Getting the CLAUDE.md↔AGENTS.md split right (no duplication, no drift) is the actual work.

## Smallest shippable slice
Add `AGENTS.md` to the L0 template carrying the host-neutral working rules; slim the L0 `CLAUDE.md`
working-rules block to *reference* it + keep the Claude-specifics; verify `boss new` + `boss adopt`
both lay/append both files non-destructively. Then ripple to L1–L3 (mostly claude-append blocks).

## Links
[[IDEA-006]] (host-portability — this is its cheapest concrete down-payment) · Principle #5
(optionality) · the [dossier](../dossier/anthropic-appeal-and-gaps-2026.md) (also an Anthropic-appeal
signal — portability is the property they most evangelize).
