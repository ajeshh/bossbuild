---
id: IDS
type: index
owner: pm
status: active
---

# ID System — BOSS

| Prefix | Means | Lives in |
|---|---|---|
| `IDEA-NNN` | A raw idea / planned capability | `docs/ideas/` |
| `FEAT-NNN` | An idea in active build (promoted from IDEA) | `docs/ideas/` (or a `docs/features/` folder if it grows) |
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
