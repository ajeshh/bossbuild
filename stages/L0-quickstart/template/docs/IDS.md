---
id: IDS
type: index
owner: product-lead
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
| `FEAT-NNN` | An idea that earned a **build contract** — named slices, or a build spanning more than one release | MVP |
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

## IDEA → FEAT — promote when it earns a contract

**Most ideas never become a FEAT, and that's correct.** Promote when the build has **named slices**
or **spans more than one release** — otherwise the IDEA carries itself to `shipped`. A second
document for a one-afternoon change is ceremony, and ceremony you don't need is the thing that makes
people stop keeping records at all.

When you do promote, link it **both ways** so either end tells you the whole story:

```
IDEA-014                    FEAT-003
  promoted_to: FEAT-003  ←→   from: IDEA-014
```

`boss records` checks both directions. `from: none` is valid — some features come straight from a
conversation with a customer, never from a captured idea. Say so in `from_note:`.

> BOSS got this wrong on itself: its own rule said *"an idea in active build"* becomes a FEAT, and
> then 46 of its ideas shipped without one. Every FEAT that actually got written was a multi-slice
> build. The rule was wrong, not the people.

## `program:` — grouping things that belong together

When several records are really one effort, give them one line:

```
program: checkout-rebuild
```

`boss records --programs` and `boss board --html` roll it up — shipped vs open per umbrella. That
answers something a column board can't: not *what am I working on* but **which of the things I
committed to is actually stuck**. An umbrella sitting at 0-of-5 is worth seeing early.

Use a short slug. Don't create anything first — the program exists because records point at it.

**When it outgrows a line.** Eventually a program has something to say that belongs to *no single
member*: why these go together, what you decided across them, what you deliberately refused. That's
when it earns its own record — take a number, write it down, and point `program:` at that id
instead. The field doesn't change shape, so nothing you already wrote has to be rewritten.

**Don't graduate on a count.** "Three or more" is a rule that generates paperwork. Graduate when you
notice you're about to lose the reasoning that spans them — that's the thing a slug can't hold.

## Numbering

Allocate the next free integer per prefix. Before reserving one, grep all of `docs/` — not just an
index — so planning docs that reserve numbers ahead of folders don't get clobbered.

**IDs are never reused, and a gap is free.** Two files claiming the same number makes every reference
to that number ambiguous, including references already written down somewhere you've forgotten. If
you're unsure, take the next number up. Nothing is owed to a tidy sequence.
