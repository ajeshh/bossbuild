---
id: IDS
type: index
owner: product-lead
status: active
---

# ID System — BOSS

| Prefix | Means | Lives in |
|---|---|---|
| `IDEA-NNN` | A raw idea / planned capability | `docs/ideas/` |
| `FEAT-NNN` | An idea that earned a **build contract** — named slices, or a build spanning more than one release | `docs/ideas/` |
| `DEC-NNN` | A load-bearing / hard-to-reverse decision record (ADR-lite; `status: decided \| superseded`, supersede-don't-edit) | `docs/decisions/` |
| `PRAC-NNN` | A shared craft learning — a better way to build with AI (`status: active \| stale \| retired`, staleness-aware via `review_by:`) | `docs/practices/` |
| `EVID-NNN` | A single piece of evidence bearing on a canvas assumption — one signal per file, graded on a fixed 3-rung ladder (`stated-pain` → `observed-behavior` → `commitment`) | `docs/evidence/` |
| `RVW-NNN` | A `/vet` verdict on an unproven outside claim (ADOPT/ADAPT/REJECT/NOT-YET) | `docs/research/verdicts/` |
| `vX.Y.Z` | A released BOSS version | `registry/CHANGELOG.md` |

Frontmatter on every doc: `id`, `type`, `owner`, `status`.

## Status — the declared vocabulary

**The file's frontmatter is truth. `docs/ideas/INDEX.md` is a view of it.** When they disagree, the
file wins and the index is what gets corrected — [`IDEA-015`](ideas/IDEA-015-visual-board.md) wrote
that rule down for `boss board` and then the index drifted from it anyway, in 21 rows.

| Status | Means |
|---|---|
| `seedling` | Captured, not yet thought about. |
| `exploring` | Being thought about. No build committed. |
| `ready` | Thought through, waiting on a build slot. |
| `building` | Work started and not finished — including *partly* finished, where some slices shipped and named ones remain. |
| `shipped` | The capability exists on disk and a founder can reach it. |
| `deferred` | Deliberately NOT being built, with a **written re-open trigger**. A decision, not a backlog item. |
| `dropped` | Decided against. Kept for the reasoning. |

**The status must START with one of those seven words.** Everything after is free-form detail and is
encouraged — `shipped (v0.106 read-state slice)` and `building (items 1–4 done; 5–7 open)` are both
well-formed and both say more than the base word alone.

**Why the list is closed.** It used to be six words in this sentence and fifteen in practice —
`implemented`, `built`, `partially-built`, `keystone-shipped`, `resolved`, `captured`,
`adopted-as-backlog`, `implemented-not-deployed`. Four of those meant *shipped* and no reader or
checker could tell, so the index quietly disagreed with the files for ~80 releases and nothing
noticed. A vocabulary nobody can enumerate is not a vocabulary. `npm run check:backlog` enforces
this, the ID↔file mapping, and index agreement.

## IDEA → FEAT — when to promote, and the link that proves you did

**Not every idea becomes a FEAT.** The rule used to read *"an idea in active build"*, and the repo
violated it 46 times: 46 IDEAs went `building` or `shipped` and never became one, while only 5 FEATs
ever existed. That is not sloppiness — it is the rule being wrong. **All 5 real FEATs are multi-slice,
multi-release build contracts.** The rule that got followed was narrower than the rule that got written.

> **Promote when the build has named slices, or spans more than one release.** Otherwise the IDEA
> carries it to `shipped` on its own. A second document for a one-release change is the ceremony
> Principle #2 exists to refuse.

**A promotion is legible from both ends, and that part IS enforced** (`npm run check:backlog`):

```
IDEA-020                    FEAT-020
  promoted_to: FEAT-020  ←→   from: IDEA-020
```

A `FEAT` that cannot name its idea is an orphan; an idea pointing at a `FEAT` that does not exist is
the duplicate-ID problem wearing a different hat. `from: none` is a valid answer — FEAT-024 came
straight from a conversation, and says so in `from_note:`.

## `program:` — the umbrella, and the ladder it climbs

Records that belong together carry one line:

```
program: ai-native-boss
```

That is the whole seed. It groups records across types (`IDEA` and `FEAT` alike), needs nothing
created first, and `boss records --programs` / `boss board --html` roll it up — shipped vs open per
umbrella. **It answers the question a column board structurally cannot: not *what is in flight* but
*which of the things I decided to do is actually stuck*.** BOSS's own first run: `ai-native-boss`
6-of-6 done, `public-surface` **0-of-5**.

**The graduation, when it is earned.** A slug becomes a `PROG-NNN` record when there is something to
write down that **belongs to no single member** — why these belong together, what got decided across
them, what was refused. Then `program:` points at that id instead:

```
program: PROG-001
```

**The field never changes shape; only its value does.** Nothing migrates, no member is rewritten.

**The trigger is not a member count.** *"Three or more records"* is arbitrary ceremony, and ceremony
you don't need is what makes people stop keeping records at all. It is the seam test from
[`seed-to-scale`](../library/practices/seed-to-scale.md): **skip six months — what is *gone* versus
merely *undone*?** For a program, the thing that goes is the cross-member reasoning. Nothing else
holds it. Until then, a slug is enough.

**Why this exists at all:** BOSS improvised this umbrella **60+ times** — *"Phase 1"* ×24, *"Phase 2"*
×22, plus slices, threads and Tracks — and never named it. A pattern proven that often and never
sorted UP is exactly what PRINCIPLE #1 exists to catch.

## `proof:` — the field that makes a status checkable

**A status is a claim about the code, so every record names the artifact that would settle it.**

```
status: building
proof:  src/fleet.js          # the path that would not exist if this were done
```

`npm run check:backlog` reads it both ways, and the second direction is the one that cost ~80
releases of drift:

| The record says | The proof is | Verdict |
|---|---|---|
| `shipped` | not on disk | 🔴 the record claims something the repo cannot show |
| not shipped | **on disk** | 🔴 **you built it and never said so** |

**Naming `proof:` on something you have NOT built is the point.** It is a tripwire laid in advance:
the day that file appears, the gate fails until the record is updated. Drift then survives one
release instead of a hundred.

Two honest states are **declared, never silent**:
- `proof: none` + `proof_note:` — the record produced a *decision*, not a file (IDEA-012's catalog
  became the backlog; IDEA-028's audit produced retire/keep calls).
- `proof_note:` on a non-shipped record whose proof exists anyway — built-but-unreachable
  (IDEA-047 needs a bought domain, which is not a build task) or completes-on-a-condition
  (IDEA-058 ends when citation debt hits zero, which is not a file).

**The note is the price of the exception.** You may hold the state; you may not hold it silently.

**Why this exists rather than just a rule.** The first version of `check:backlog` compared each
record to its INDEX row — document against document. All 21 drifted records would have passed it if
the index had simply agreed with the wrong files. **Agreement is not truth.** Ajesh, on reading the
result: *"the whole point of us managing the docs was to avoid this."*

**IDs are never reused.** Two files claimed `IDEA-059` at once, which made every `[[IDEA-059]]`
link ambiguous — including the one in `RESUME.md`. Take the next free number; a gap is free and a
collision is not.
