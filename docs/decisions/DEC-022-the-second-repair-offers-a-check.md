---
id: DEC-022
type: decision
owner: "@ajeshh"
decided_by: ai-suggested-ratified
status: decided
created: 2026-10-04
confirmed: 2026-10-04 — Ajesh, on the IDEA-137 governance step ("sure")
reversibility: reversible — one behaviour in the conscience and the repair moments, not yet built; dropping it is deleting a sentence
revisit_by: 2027-01-04
falsifier: a founder who answered "keep fixing it for me" hears the offer again for the same kind of break, or a founder reads the offer as blame or a count ("this is the second time…"), by 2027-01-04 → reword or drop it
refines: DEC-003 (its "If they say yes, BOSS does the migration" — kept; this adds what happens the second time)
scope: build
---

# DEC-022 — the second repair offers a check the project can own

## Context

DEC-003 makes BOSS's help fair: *"naming a problem and leaving them with it is a critique; naming it and
then doing the work is help."* That stays true once. As a standing habit it has a cost nobody chose: a
tool that quietly repairs the same kind of break every time keeps the founder's own project from ever
learning to catch it. Peter Senge named the pattern *shifting the burden* (*The Leader's New Work*, Sloan
Management Review, 1990 — read at source); IDEA-137's research found it the strongest risk in the
"ecosystem of ecosystems" frame, and the humane review (IDEA-137 · H1) found the opposite risk just as
real — a founder who *wants* BOSS to keep doing it, and a reminder that reads as blame.

## Decision

When BOSS repairs a break in a founder's project, and **the same kind of break in the same file has come
up before**, and **the founder's own work caused it**, BOSS offers once — without counting, without
blame — a check that would catch it at the write:

> *"This has come up before. I've fixed it. Want a check that catches it at the write? I'll write it."*

Two answers, both first-class: **yes** (BOSS writes the check), or **"keep fixing it for me"** —
recorded once, never offered again for that kind. Either way, this repair is done.

**Not for BOSS's own breaks.** When the break is in something BOSS shipped (all six IDEA-137 found were),
it is fixed upstream and arrives by `boss sync`; handing it to the founder would shift BOSS's burden onto
them.

## Why

- **Fair once, harmful as an unchosen habit.** The help in DEC-003 stays; what changes is that the
  founder gets to choose whether the repair stays BOSS's job.
- **Rejected: say nothing and keep repairing.** Quietly, the project never grows the check. **Rejected:
  hand it over by default.** That withdraws help on BOSS's read — legitimate delegation (a solo,
  overloaded or disabled founder) is a real answer, so it gets its own button.
- **"Same file, same class," not "same kind" in general** — BOSS's guess at *kind* is thin evidence, and
  a wrong match is a nag (the humane review).
- Attribution: Senge's article was read at source; the archetype's detailed form comes from secondary
  sources and is not quoted.

## Falsifier — what would prove this wrong, and by when?

A founder who said "keep fixing it for me" hears the offer again for the same kind of break, or a founder
reads the offer as blame or a count — by **2027-01-04**. Either means the wording or the memory is wrong:
reword, or drop the offer.

## Consequences

- Commits BOSS to remembering one answer per kind of break, per project — in the project, never as a
  reading of the founder (paths, never people: `docs/ECOSYSTEMS.md`).
- Rules out a repair counter, a streak, or any "you've had this N times" wording.
- Built 2026-10-04 (IDEA-137 · C6.2) as text the `coder` agent follows; the remembered answer is a
  line in the founder's `.claude/rules/engineering.md` under *Left to the agent* — theirs to read and delete.
