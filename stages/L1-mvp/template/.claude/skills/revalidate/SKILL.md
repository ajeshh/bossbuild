---
name: revalidate
description: The 3-line gate before paused work re-enters the build — checks a deferred idea/feature against a world that moved (still relevant? still aligned? anything changed?) and routes it to revive / rescope / kill / re-pause, so you never build a zombie feature. Usage - /revalidate [ID or paused item]
---

# /revalidate — don't build the zombie

Work gets deferred for good reasons. Months later it gets picked up *on momentum* and built against a
world that already moved on. `/revalidate` is the tiny gate that prevents that: three questions,
answerable in a minute, before any paused item becomes active again.

It's the counterpart to deferring something in the first place — defer with a reason, revive with a check.

## When to run it

- A board / `docs/RESUME.md` item is flagged **stale** (untouched past its `next_review`, or 14d+ cold).
- Any time you're about to "pick up" deferred work — before you spec or build it.
- When a blocker just shipped and the thing it was blocking wants back in.

## How to run it

**1. Find the item.** If an `[ID]` was given (e.g. `IDEA-012`, `FEAT-007`), read that doc. Otherwise
ask which paused item, or scan `status: deferred` / `paused_reason` items in the ideas/features index
and offer the stalest.

**2. Run the gate — three lines, out loud:**
- **Still relevant?** Is the pain/opportunity it addresses still real and still felt?
- **Still aligned?** Does it still fit the current goal / canvas / roadmap — or did the direction move?
- **Has anything changed the answer?** New evidence, a shipped dependency, a host/model shift, a
  competitor, a dead assumption.

Answer from what the project actually shows now (recent commits, canvas, RESUME) — not from the
item's own framing, which was written in the old world.

**3. Route on the outcome:**

| Answers | Do this |
|---|---|
| All three **yes** | **Revive.** Set `status` to active, note it in RESUME's next-tasks, carry on. |
| Any **no** | **Rescope or kill.** Reshape it to the new reality (and say how), or close it — set `status: killed` / `folded` with a one-line reason logged. Don't build it as-was. |
| **Unclear** | **Re-pause.** Write a *new* `paused_reason` and a fresh `next_review` date. Don't let it drift back in by default. |

**4. Record the call.** Update the item's frontmatter (`status`, `paused_reason`, `next_review`) and
leave a one-line trace of the decision (devlog / RESUME). The point is that the next person sees the
gate already ran.

## Why three lines and not a re-spec

The gate has to be cheaper than the temptation to skip it. A full re-spec is ceremony; people skip
ceremony and build the zombie anyway. Three questions clear the bar of "I'll actually do this." That
restraint *is* the design — see `boss craft revalidation`.
