---
id: PRACTICE-revalidation
type: practice
owner: product-lead
status: active
host: stack-neutral
provenance: ported UP from the dhun dogfood (docs/workflows/lifecycles/REVALIDATION.md) via the 2026-06-20 method scan — BOSS v0.48.0
provenance_public: Ported up from a dogfooded product's own revalidation lifecycle.
last_reviewed: 2026-06-20
review_by: 2027-06-20
curve: craft
---

# Practice — Revalidation (the 3-line gate before paused work re-enters build)

> **The problem this kills: zombie features.** Work gets deferred for a good reason — a blocker, a
> capacity call, a "not yet." Months later it gets picked back up *on momentum*, never re-checked
> against a world that moved. The result is building something the project no longer needs. The fix
> is a deliberately tiny gate: three questions, answerable in a minute, before any paused item
> re-enters the build.

## The gate

Before a `deferred`/`paused` idea or feature becomes active again, its owner answers three lines:

1. **Still relevant?** — Is the pain/opportunity it addresses still real and still felt?
2. **Still aligned?** — Does it still fit the current goal / canvas / roadmap, or did the direction move?
3. **Has anything changed the answer?** — New evidence, a shipped dependency, a host/model shift, a
   competitor, a dead assumption?

## The outcome matrix

| Answers | Outcome |
|---|---|
| All three **yes** | **Revive.** Move to active; carry on. |
| Any **no** | **Rescope or kill.** Don't build it as-was. Either reshape it to the new reality or close it with a reason logged. |
| **Unclear** | **Re-pause** with a *new* `paused_reason` and a `next_review` date. Don't let it drift back in by default. |

## Why it's three lines, not a re-spec

The gate has to be *cheaper than the temptation to skip it*. A full re-spec is ceremony; people skip
ceremony and build the zombie. Three questions clear the bar of "I'll actually do this" — that's the
whole design. (Principle #2: just-in-time, never premature ceremony.)

## When it fires

- A board / RESUME item flagged **stale** (no movement past its `next_review`, or 14d+ untouched).
- Any time someone says "let's pick up X" about deferred work.
- Default review intervals when an item is paused: *blocked* → when the blocker ships + 1 week;
  *capacity* → +90 days. Set `next_review` so the gate has a trigger.

## Frontmatter hooks (what makes it automatable)

The gate runs off metadata the doc already carries: `status: deferred`, `paused_at`, `paused_reason`,
`next_review`. A board can surface "time to revalidate" the moment `next_review` passes — the practice
and the metadata are two halves of one mechanism.

## BOSS's own dogfood

BOSS's `docs/RESUME.md` carries a long deferred list and a backlog catalog (IDEA-012). This practice
is what `/revalidate` runs against them — BOSS eats it first. See `IDEA-027`.
