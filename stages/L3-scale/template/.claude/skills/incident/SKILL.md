---
name: incident
description: The blameless one-page post-mortem for an outage — /sunset's honest-accounting shape, scoped to something that broke in production. Captures what happened, what the user actually saw (and whether the status message was honest), a fix-first-analyze-second timeline, and the ONE systemic learning worth routing UP via /boss-learn. Not a blame doc, not a compliance artifact, not a ticket — one page you'll actually re-read. Runs when a real user hit a real failure. Usage - /incident [what broke]
---

# /incident — what broke, what it taught, once

At Scale you have users, which means things break in front of them. The failure isn't the problem —
*not learning from it* is. `/incident` writes the one page that turns an outage into a systemic fix
instead of a scar: blameless, fix-first, and honest about what the user actually experienced.

It's `/sunset`'s shape (a real event that returned an answer) scoped to an outage — and the operate
loop's counterpart to `/smoke` ("is it alive?") and `/red-team` ("can it be attacked?"): *when it
wasn't alive, what did that teach?*

## The one rule

**Blameless.** The post-mortem names systems and gaps, never people. "Whoever clicks merge owns what
the agent wrote" is about *ownership*, not fault — a good incident doc makes the next failure less
likely, and blame makes people hide the next one. If a sentence points at a person, rewrite it to
point at the missing guardrail.

## How to run it

Write **one page** — `docs/incidents/INC-YYYY-MM-DD-<slug>.md` — with:

1. **What happened** — plainly, in a sentence or two. When it started, when it resolved, blast radius
   (who/how many were affected).
2. **What the user actually saw** — and *was the status message honest?* A silent failure, a lying
   "everything's fine," or a clear "we're down, here's the workaround" are three very different harms.
   This is the humane half — the user's experience of the outage, not just the server's.
3. **Timeline — fix first, analyze second.** What you did to stop the bleeding, then what you found
   about *why*. Don't moralize the root cause before the fire's out.
4. **The one systemic learning.** Not ten action items — the single change that makes this *class* of
   failure less likely (a high-risk-path guardrail, a migration check, a rollback that actually
   restores state, an eval case). **Route it UP with `/boss-learn`** if it generalizes beyond this
   project, or into a high-risk-paths entry in the Scale working rules if it's local.

## Ties into what already exists

- The systemic learning often lands as a **high-risk-paths** entry (Scale working rules) or an
  `/evals` regression case — prevention you can point to next time.
- `ship-it-live`'s *rollback ≠ reversible* line and `scalable-architecture`'s migration discipline are
  the two failures that most often show up here; name them when they're the cause.
- One page. If it's sprawling into a compliance artifact, you've left the point — cut it back.

## Guardrails

- Blameless, always. Systems and gaps, never people.
- Fix first; the doc is written *after* the bleeding stops, not during.
- One systemic learning beats ten forgotten action items. Ship the one that changes a guardrail.
