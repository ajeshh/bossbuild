---
id: RVW-067
type: verdict
owner: mentor-architect
status: recorded
created: 2026-08-11
verdict: ADOPT
route: UP library/practices/context-discipline.md (new section) — shipped v0.141.0. No template change needed.
retroactive: true
---

# RVW-067 — "Auto mode becoming the host default is something BOSS must respond to"

## The claim

- **Source:** [Claude Code Week 32 digest](https://code.claude.com/docs/en/whats-new/2026-w32) — primary.
- **Core assertion:** from **2026-08-14**, `auto` is the default permission mode for new sessions on
  Pro, Max and Team plans. A classifier answers permission prompts; safe actions run uninterrupted,
  risky ones are blocked. A default the user or their org set explicitly is left alone.
- **The question for BOSS:** does a scaffolded project need to change?

## Rubric

| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No. And it **vindicates** an earlier BOSS call — L0 has shipped `"defaultMode": "auto"` for some time; the host is now agreeing with it. |
| 2 | Evidence grade | **Primary source, dated, with a named effective date.** Not a claim to weigh — a fact about the ground BOSS stands on. |
| 3 | Duplicate or sharpen? | **Neither — it is a pure hole.** `grep -ri "auto mode" library/ stages/` returned **zero hits**, in the practice that claims the permission surface. `context-discipline` documented `permissions.deny`, `.claude/rules/`, and hooks, and never named the *mode* all three run inside. |
| 4 | Who serves / harms? | Naming it serves the founder who reads `context-discipline` and reasons about their permission surface. **Risk of NOT naming it:** a founder reads "the deny-list is the floor," sees prompts stop appearing, and concludes the floor stopped working — or worse, concludes the classifier *is* the security layer. |
| 5 | Cost / ceremony | **Documentation only, zero shipped-surface change.** No template edit, no new machinery, no founder action required. The cheapest possible adoption. |

## Verdict: ADOPT

Not because anything is broken — because a practice that owns a surface and cannot describe the mode
that surface runs in is **incomplete**, and the incompleteness was about to become visible on a date
three days out from the sweep.

The genuinely load-bearing content is the **distinction**, not the announcement:

> **Deny rules still win** — hard deny is unconditional, not something the classifier weighs.
> **And a classifier is non-deterministic**, which is precisely why move #3 exists.
> **Auto mode is a convenience layer, not a security layer.** Reading it as one is the trap.

With the counterweight that keeps this from reading as anti-auto-mode:
**prompt fatigue was never a boundary either** — it was a human in the loop often enough to notice.
Auto mode removes the fatigue; the floor was always doing the actual work.

## What shipped (v0.141.0)

`library/practices/context-discipline.md` — a new **Permission modes** section between move #4 and
the context-engineering section: the effective date and plans, that BOSS already set this default so
nothing needs to change, that deny still wins, the convenience-vs-security distinction, the four modes
with when each is right, and the explicit-preference snippet.

Tagged **host-bound and on the fastest curve BOSS tracks** — permission modes moved *four times* in
2026 (research preview March → Pro May → third-party providers June → default August). That volatility
note is the part most likely to still be useful in six months.

## Process finding (the more valuable half)

This hole was invisible to every existing discipline. `check:freshness` reported `context-discipline`
**fresh** — it was inside its 90-day window and its dates were self-consistent. Cadence cannot detect
*"the doc never covered this at all."* Only a field sweep against the host's own changelog found it.

**This is the second time in twelve days the host tap paid out something cadence structurally could
not catch** (the first: `mcp.md` event-stale at 7 days old). It is the evidence behind the cadence
correction now flagged in the watchlist — **domain 2 is quarterly; the host digest ships weekly.**
