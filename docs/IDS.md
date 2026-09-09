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

Frontmatter on every doc: `id`, `type`, `owner`, `status`. On `IDEA`/`FEAT`, add a one-line
`gist:` — see below.

## Citing a record: the `[[…]]` form vs a bare id

**`[[DEC-011]]` promises the reader can open it. A bare `DEC-011` says a record exists.**

The distinction is load-bearing because BOSS's own working records — ideas, decisions, evidence,
research verdicts — are gitignored, while the files that cite them (`registry/CHANGELOG.md` above
all, which ships inside the npm package) are not. 198 citations across 28 tracked files were
offering a reader a door into a room that isn't there.

`npm run check:refs` enforces it: **a tracked file may carry the link form only if that record is
also tracked.** Nothing is exempt, including the CHANGELOG — an allowlist that excuses whole files
is how this class of drift survives (v0.251.0). A mention inside backticks is a mention, not a
citation. Publish a record class and its brackets become legal again automatically; there is no
list to update.

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

> 🔴 **This sentence was false for ~150 releases, and it named its own enforcer.**
> `check-backlog.js` did not contain the string `promoted_to`, and `boss records` verified only that
> each *target existed* — never that the two ends pointed at each other, so two records could both
> pass while disagreeing about the same promotion. Enforced for real at **v0.247.0**, by importing
> `recordDrift` rather than writing the rule a second time. All 87 records already satisfied it:
> **the rule was right and only the enforcement was missing** — the opposite of the IDEA-015 case,
> where a rule violated 46 times turned out to be the wrong rule.

## `gist:` — the one line that makes a record findable again

**A title is a name. After twenty records, a name stops being a reminder.**

```
gist: A way to end a project honestly, harvest what it taught, and mark it retired.
```

One plain sentence saying what the record *is*. `boss board --detail`, the `--html` board's hover,
`boss board <ID>` and the `--json` contract all read it. Write what the thing *does*, not what kind
of record it is — *"a way to point BOSS at a doc you already jotted the idea in"* beats *"an import
feature."*

**Omitting it is legal and the board still works.** With no `gist:`, the board reads the record's
own opening prose instead — always something, never better than the first paragraph happens to be.
That fallback is deliberate: a field with no mechanism behind it goes unfilled, and a board that
goes blank for most of its cards is worse than one that reads well most of the time. Authored wins;
derived fills the silence. Same posture as `shipped_on:` and its git-derived fallback.

**Rewrite the gist when the record's shape changes.** A gist describing a superseded shape is worse
than none — it is the one field that can lie quietly, because nothing can check it against the body.

## When scope grows — `spun_to:` and the rule that keeps a build finishable

**A build contract closes at the scope it was written at. New scope gets a new id.**

That one sentence is the whole discipline, and the act it forbids is specific: *do not add
acceptance criteria to a FEAT that is already in flight.* It feels like bookkeeping — the work is
related, the record is right there, the criteria list is one line longer. But a target that moves
every time you approach it is a target you never reach, and this is exactly how a feature becomes
the one that has been "nearly done" for four months. Nothing else on your board can tell you it
happened, because the record looks *more* thorough every time it grows.

So when the work grows past what you specced, **ship what you specced** and spin the rest out:

```
FEAT-003                       IDEA-021
  status: shipped                status: ready
  spun_to: IDEA-021 (the        spun_from: FEAT-003 (scope that
    export half, split when       arrived after the spec — the
    the import half shipped)      export half)
```

`boss records` checks it the same way it checks a promotion, plus one thing promotion doesn't:
**both records must name each other.** A `spun_from:` on the new record alone means the only way to
discover where the rest of the work went is to already know it exists — which is no better than the
prose note everybody writes and nobody finds. The leading word is the link; everything after it is
free-form detail and is encouraged, exactly like a status.

**The split is a decision, so make it out loud.** Three honest destinations, and the choice is
about how much you still believe in the new scope:

| The remainder is | Send it to | Because |
|---|---|---|
| genuinely the next slice | a new **FEAT** | it already has a contract's worth of clarity |
| an idea again — it needs re-thinking | a new **IDEA** | shipping the first half changed what you know |
| not worth doing after all | nothing; say so in the FEAT | *"we decided against the export half"* is a result, and the cheapest one |

**Not every growth is a split.** Finding out mid-build that a criterion was *wrong* is a correction
— fix it in place. Finding out there is *more* is a split. The tell: could you ship what you have
and have it be worth something? Then you have two features. If the extra thing makes the first half
meaningless on its own, it was one feature all along and you underspecced it — say that in the FEAT
and carry on.

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

**IDs are never reused.** Two files claimed `IDEA-059` at once, which made every `IDEA-059`
link ambiguous — including the one in `RESUME.md`. Take the next free number; a gap is free and a
collision is not.
