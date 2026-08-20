---
id: IDS
type: index
owner: pm
status: active
---

# ID System — {{PROJECT_NAME}}

Stable IDs make work addressable across sessions and docs. New types unlock as the project matures.

## Active in Quickstart mode

| Prefix | Means | Lives in |
|---|---|---|
| `IDEA-NNN` | A raw idea, bug, or ask | `docs/ideas/` |
| `EVID-NNN` | One real signal about your riskiest assumption, honestly graded | `docs/evidence/` |
| `DEC-NNN` | A load-bearing or hard-to-reverse call, with a falsifier. Supersede, don't edit | `docs/decisions/` |

## Unlocks later

| Prefix | Means | Unlocks in mode |
|---|---|---|
| `FEAT-NNN` | A scoped feature with a spec | MVP |
| `PRAC-NNN` | A craft learning worth keeping — and sharing with a cofounder | MVP |
| `EXTR-NNN` | A pattern extraction decision (UP into the library / DOWN into app core; PRINCIPLE #1) | MVP |
| `RFC-NNN` | A decision document | Scale |
| `EXP-NNN` | A lab experiment | Scale |

## Frontmatter (required on every new doc)

```yaml
---
id: <ID or slug>
type: <idea | feature | fix | decision | index | spec | ...>
owner: <agent or person>
status: <one of the seven below>
---
```

## Status — a closed vocabulary

**The file's frontmatter is truth.** Any index, board, or summary is a *view* of it. When the two
disagree, the file wins and the view is what gets corrected.

| Status | Means |
|---|---|
| `seedling` | Captured, not yet thought about. |
| `exploring` | Being thought about. No build committed. |
| `ready` | Thought through, waiting on a build slot. |
| `building` | Started and not finished — including *partly* finished, where some slices shipped and named ones remain. |
| `shipped` | It exists, and a user can reach it. |
| `deferred` | Deliberately NOT being built, with a **written re-open trigger**. A decision, not a backlog item. |
| `dropped` | Decided against. Keep the file for the reasoning. |

**The status must START with one of those seven words.** Everything after is free-form detail and is
encouraged — `shipped (v0.4, read-only slice)` and `building (steps 1–3 done, 4 open)` both say more
than the base word alone.

**Why the list is closed.** The moment `implemented`, `built`, `done`, and `resolved` all show up in
one project, four words mean *shipped* and no reader — you, a teammate, or an agent — can tell them
apart. Your board quietly disagrees with your files and nothing announces it. A vocabulary nobody can
enumerate is not a vocabulary.

## `proof:` — how a status stays honest (optional, and worth it)

A status is a **claim about your code**. `shipped` means the thing exists. Nothing checks that for
you unless you say what "exists" looks like:

```
status: building
proof:  src/checkout.ts       # the path that would not exist if this were done
```

Then `boss records` reads it both ways:

| Your record says | The proof is | What it tells you |
|---|---|---|
| `shipped` | not there | the record claims something your repo can't show |
| not shipped | **there** | **you built it and never wrote it down** |

The second row is the one that costs you. A finished thing that still reads *"exploring"* is a
finished thing you might build again — or hand to an agent that rebuilds it, because the agent
believes your docs.

**Naming `proof:` before you build is the point**, not extra work: it's a tripwire. The day that
file appears, `boss records` tells you the record is stale. Two states are declared rather than
hidden — `proof: none` with a `proof_note:` when a record's output was a *decision* rather than a
file, and a `proof_note:` on something built-but-blocked ("done, waiting on the domain").

> BOSS learned this on itself. It audited its own records and found **21 of 64 wrong — 18 claiming
> work was unbuilt that had shipped**, one of them for a hundred releases. The rules were all
> written down and nothing checked them, which made them preferences. `boss records` is the half
> that was missing.

## Numbering

Allocate the next free integer per prefix. Before reserving one, grep all of `docs/` — not just an
index — so planning docs that reserve numbers ahead of folders don't get clobbered.

**IDs are never reused, and a gap is free.** Two files claiming the same number makes every reference
to that number ambiguous, including references already written down somewhere you've forgotten. If
you're unsure, take the next number up. Nothing is owed to a tidy sequence.
