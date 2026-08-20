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

## The other direction — a SHIPPED FEAT, re-read against the code (v0.172.0+)

Everything above is the **pre-build** gate: paused work, checked before it revives. This is the same
gate pointed the other way, at work that already **shipped** — and it asks one question instead of
three:

> **Does this FEAT still describe what the code does?**

**Why it exists.** A spec written before the build and never re-read afterwards is *spec-first* —
scaffolding, discarded at ship. A spec that stays true is *spec-anchored*, and it's the only kind
worth keeping, because the whole value of a spec after ship is that someone can trust it without
reading the code. Nothing decays more quietly: the FEAT still sits there, still looks authoritative,
and has been wrong for two months.

**How to run it.** Read the FEAT's acceptance criteria and *"What wrong looks like"*, then look at
what the code actually does now. Route the same way the table above does:

| Finding | Do this |
|---|---|
| Criteria still true | **Say so and stop.** Stamp a fresh `next_review`. A confirmed spec is a real result, not a wasted pass. |
| Code moved past the spec | **Update the FEAT to what's true now**, and put the *why* in its `## Build log`. The drift is usually a decision nobody wrote down. |
| Criteria were quietly abandoned | **Untick them and say which.** A criterion silently dropped is the most useful thing this pass can find — it's a scope change that never got made explicitly. |
| The feature is gone or absorbed | `status: folded`, one-line reason. Don't leave a spec for something that no longer exists. |

**Keep it rare and opt-in.** This fires when *you* run it, or when a `next_review:` you set has
passed — never on a schedule BOSS chose. Re-reading every shipped spec on a cadence is the
maintenance ceremony BOSS refuses; re-reading the two or three that are **load-bearing for someone
else** is just honest. If a FEAT would never be read by anyone again, it doesn't need this pass, and
saying so is a legitimate outcome.

## Why three lines and not a re-spec

The gate has to be cheaper than the temptation to skip it. A full re-spec is ceremony; people skip
ceremony and build the zombie anyway. Three questions clear the bar of "I'll actually do this." That
restraint *is* the design — see `boss craft revalidation`.
