# `/roadmap` — the standing NO-list (bundled resource)

> Loaded **on demand** from `SKILL.md`. Write this to `docs/roadmap/NO-LIST.md` — **one file, not
> one per cycle.** The bet-list is dated and disposable; this is neither.
>
> **Why the two halves have different lifespans.** Shape Up is right that a bet-list you tend
> becomes a backlog, so `ROADMAP-<date>.md` is written, used, and deleted. But the NO-list is the
> half `/roadmap` itself calls load-bearing, and discarding it means the same declined feature
> comes back three cycles later with nothing to stop it — and the *reason* it was declined, which
> is usually a weak evidence grade, is gone. **Deleting your reasoning and keeping your conclusions
> is backwards.** So: bets are disposable, refusals compound.
>
> **Append-only.** Never rewrite a row. A refusal that was later reversed gets its `Reopened` cell
> filled in and stays on the page — the reversal is the interesting part, and a list that only
> shows refusals that stuck reads as wiser than it was.

```markdown
---
id: NO-LIST
type: roadmap
owner: product-lead
status: living
updated: {{today}}
---

# What we are not building — and why

**Append-only.** Add a row when `/roadmap` declines something. Never delete one; fill in `Reopened`
if it comes back.

**Not a graveyard for everything anyone ever suggested.** A row earns its place by having been
*weighed and declined* — an idea nobody has considered yet belongs in `docs/ideas/`, not here.

| Declined | What it is | Why not (the grade) | Re-open when | Reopened |
|---|---|---|---|---|
| {{today}} | <the request, in the asker's words> | <stated-pain only · serves a vocal few · doesn't move the current bet · it's a zombie → /sunset> | <the specific signal that would change this> | |

## How to write the three cells that matter

**Why not — name the grade, not a mood.** `/roadmap` ranks by confidence = the EVID grade, so the
refusal inherits it: *"stated-pain, n=2, both from the same account"* is a reason a future reader can
check. *"Not a priority"* is not — it tells them nothing about what changed if it stops being true.

**Re-open when — a signal, not a date.** *"Three more users ask unprompted"* · *"the churn interview
names it"* · *"we reach 50 users and it still comes up."* This is the same grammar every `deferred`
record in `docs/ideas/` already uses, and it is what makes a NO reversible without being weak.
A row with an empty re-open cell is a refusal nobody can ever undo, which is a decision nobody made.

**Reopened — the date and what moved.** When a row comes back, say what the signal was. Over a few
cycles this column is the most honest thing in the repo: it shows which of your refusals were
judgment and which were just the mood of that cycle.

## The humane note

This file is where the **silent majority** is protected — the features you decline for the loudest
few are a decision, and this is the only place that decision survives. It is also where you can
notice the opposite: if the reopened column fills up with rows you declined from the same segment,
you have been under-serving someone, and the list just told you.
```
