---
id: IDEA-027
type: idea
owner: product-lead
status: shipped
proof: library/practices/quality-ratchet.md
created: 2026-06-20
---

# IDEA-027 — Proven-machinery imports from dhun (ratchet · revalidation · memory-cue · board · doc-map)

> Seed: 2026-06-20 dhun method scan
> ([SESSION-2026-06-20](../research/sessions/SESSION-2026-06-20-trends-and-dhun-scan.md)). Principle #1
> in its purest form: a sibling project (dhun) evolved working-method machinery; sort the
> non-domain-specific parts **UP** into BOSS. Several map onto BOSS's own deferred roadmap
> ([[IDEA-020]]/[FEAT-020]) — so this is an **accelerant with a working reference impl**, not new bets.

## The bundle (each independently shippable, ranked by fit)

### 1. memory-cue hook (ship first — cleanest)
`dhun/.claude/hooks/memory-cue.sh` (UserPromptSubmit): regex-detects feedback patterns — directive
("from now on…"), corrective ("no, don't…"), confirmation ("perfect, keep…") — and **nudges** Claude
to save it to memory. Silent on no-match (zero token cost); nudges, never auto-writes (wording needs
reasoning). → Port as zero-dep `library/hooks/memory-cue.js`, dormant in L0/L1 template. Directly
serves the `library/memory-seed/` ambition + mirrors the auto-memory pattern.

### 2. /revalidate — the 3-line gate for deferred work (ship — BOSS needs its own dogfood)
`dhun/docs/workflows/lifecycles/REVALIDATION.md`: before paused work re-enters build, the owner
answers 3 lines — *still relevant? still aligned with the goal? has anything changed the answer?* —
with an outcome matrix (all-yes → revive; any-no → rescope/kill; unclear → re-pause with a new reason)
and default review intervals. **BOSS has dozens of deferred IDEAs in RESUME and no re-entry hygiene** —
this is the exact gap. → `library/practices/revalidation.md` (UP) + a thin `/revalidate [ID]` L1 skill
that runs the gate against a paused IDEA/FEAT. Eats BOSS's own dogfood immediately.

### 3. .ratchet — the one-way quality baseline (ship as practice + optional helper)
`dhun/.ratchet/unwrap-count.txt`: one number, one-way; a metric that may only go **down**; CI/refactor
gate trips on regression; the *why* is logged elsewhere. → `library/practices/quality-ratchet.md` (UP)
naming the pattern stack-neutrally (pick one metric, baseline it, gate regressions, log the why). A
CLI `boss ratchet` is a *possible* DOWN later — capture, don't build the CLI until a metric earns it.

### 4. board stale-detection + next_review (extend `boss board`, don't rebuild)
`dhun/docs/BOARD.md` + `session-start.sh`: the board is **derived** (regen from frontmatter, never
hand-edited); 14d stale flag; `next_review` paused-trigger surfaces "time to decide." BOSS already has
`boss board` ([[IDEA-015]]); the gap is the **stale/review triggers**. → add a `next_review`/staleness
read to `boss board` (frontmatter is already truth). Pairs with #2 (revalidate is what you *do* when
the board flags staleness).

### 5. AGENT_DOC_MAP — per-agent read/write contract (capture; build when coherence hurts)
`dhun/docs/AGENT_DOC_MAP.md`: explicit per-agent doc ownership + sole-ownership + handoff protocol
(propose via `scratch/`, not direct edit). BOSS has ~25 agents and no doc-ownership contract — a real
coherence gap *as it grows*, but not biting yet (Principle #2). → capture; build when two agents
actually collide on a doc.

## Restraint
Items 1-3 are cheap, proven, low-risk, mostly-already-roadmapped — ship them. Items 4-5 extend or
defer. The meta-risk is BOSS gold-plating its own substrate (the [[IDEA-020]] warning) — so each
import must earn its place by serving BOSS's *own* dogfood first, not by "dhun has it."

## Smallest shippable slice
memory-cue hook (dormant template) + `/revalidate` skill + `revalidation.md` & `quality-ratchet.md`
practices. Board staleness + doc-map deferred with triggers above.
