---
id: IDEA-072
type: idea
owner: product-lead
status: deferred
proof: none
proof_note: Deliberately no proof path. Work-order 2c asked which of two shapes to build; the honest
  answer was neither, yet. A proof file here means a founder actually hit the gap — see re-open
  triggers.
gist: /sunset closes a feature, an idea, or a whole app. It has no scope for a PROGRAM — a named
  long-running initiative spanning many FEATs around one bet. The question was queued as a decision;
  it is filed as an idea because n=0 and the cheap half already shipped.
created: 2026-08-22
source: work-order item 2c (2026-08-21, from the Fable review pass), which framed it as a binary —
  bundle-of-FEATs (an afternoon) vs. a new record type (a spine through /board, /roadmap, the backlog
  checker). Deferred rather than answered, 2026-08-22.
relates: DEC-011, IDEA-069, EVID-001, PRINCIPLES.md
---

# IDEA-072 — /sunset at program scale

## The gap

`/sunset` gained its **third** scope at v0.204.0 — one captured idea, with a deferred-vs-dropped
router. It now closes:

| scope | shipped |
|---|---|
| a feature | ✅ |
| a whole app | ✅ |
| one captured idea | ✅ v0.204.0 |
| **a program** — many FEATs around one bet, run over months | ❌ |

Ajesh's original framing was that `/sunset` should *"go as far as it needs to — feature, idea,
program, whole app."* Three of four exist.

## Why it is NOT decided

**n=0, and the expensive half is the one that's missing.** The work order posed it as a binary, and
both branches fail their own test today:

- **Bundle-of-FEATs (an afternoon).** Cheap, but it is barely a feature — `/sunset` on each FEAT plus
  a paragraph does the same work. Building it buys a verb, not a capability.
- **A named record type (a spine).** That is a **seventh word in `docs/IDS.md`'s closed vocabulary**,
  plus readers in `/board`, `/roadmap` and `check-backlog`. Adding a record type is a [[DEC]], not a
  side effect — the same conclusion reached when this repo declined to invent `EXP` to hold one
  experiment.

**And nobody has one.** A program is a thing you only have after months of multi-FEAT work on a
single bet. BOSS's own repo has never run one; no founder has run one, because there are no
founders yet. Deciding the shape of a container for a thing that has never existed is precisely the
premature ceremony Principle 2 exists to refuse — and it would be **adding surface** while
EVID-001's mandate is *compose and subtract, never add.*

## What it would take to be worth building

Not "someone asks for it." Specifically: **a real project with 3+ FEATs pointed at one bet, where
that bet dies, and closing it feature-by-feature loses the reason.** The loss of *the reason* is the
only thing the cheap branch cannot carry — and it is the whole argument for the expensive one.

## Re-open triggers

- A founder (or BOSS itself) kills a multi-FEAT bet and the per-FEAT close visibly drops the why.
- `/board` or `/roadmap` grows a grouping concept for its own reasons — then the spine exists and
  `/sunset` composes onto it instead of paying for it alone.
- [[IDEA-069]] (*what is this meant to outlast?*) gets built — an endings-and-horizons pass would
  naturally reach this, and composing beats two separate builds.
