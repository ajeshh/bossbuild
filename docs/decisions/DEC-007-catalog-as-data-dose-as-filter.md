---
id: DEC-007
type: decision
owner: "@ajeshh"
decided_by: AI-suggested-ratified
status: decided
created: 2026-08-20
reversibility: reversible
revisit_by: 2026-11-18
---

# DEC-007 — The catalog is data; the dose is a filter

> Occasioned by Ajesh, 2026-08-20: *"our promise is that we will continue to grow and add to our dark
> pattern library"* — set against three reviewers independently answering *"stop growing it."*
> Related: [DEC-004](DEC-004-canvas-frames-humane-as-floor.md) (humane as the floor),
> [`PRINCIPLES.md`](../../PRINCIPLES.md) #2 (JIT, not ceremony).

## Context

The dark-pattern catalog had grown by accretion across five sweeps until it was 279 lines of prose,
46% of them a bad-pattern list inside a practice about AI *interaction*. `boss craft` was flagging it
as the shelf's one 2×-median outlier — BOSS's own printed warning, fired at BOSS.

Asked whether the catalog was underbaked, three reviewers converged from different directions:

- **the vibe-coder persona** — *"I don't read lists. I scan for the one example that looks like the
  thing on my screen. Doubling the list halves my odds of finding mine."*
- **the practice's owner (designer)** — every consumer restates its own hardcoded subset inline, so
  growing the catalog grows exactly one surface: the file.
- **the humane lens** — more names → more false positives → a mis-aimed nudge → the founder mutes the
  conscience. *A humane nudge fired on the wrong pattern is itself an attention cost.*

And a standing commitment pointing the other way: the library must keep growing, because the field
does.

## Decision

**Split the object.** The catalog becomes structured data (`library/deceptive-patterns.json`) indexed
by **product shape × surface**. The judgment becomes prose (`deceptive-patterns.md`). No consumer
reads the catalog whole; each reads the surface the founder is standing on.

**The dose ceiling lives on the surface, not the shape.** A first attempt put it on shape and the
coverage checker immediately failed 12 of 14 — a mobile-app founder's shape spans ~50 rows, which is
the wall again with extra steps. A founder is building *a checkout*, not their whole shape.
`npm run check:patterns` enforces 12 rows per surface.

## Why

The two promises — *grow the library* and *don't grow the ceremony* — only conflict while the catalog
and the dose are the same object. Separated, they stop competing: **the library may hold three
hundred patterns and a CLI founder standing on their install path still sees four.**

Shape is the filter that makes it work, and it is the axis BOSS didn't have. Cohort answers *who is
this founder*; stage answers *how much ceremony have they earned*; neither answers *what does this
product actually ship that could deceive someone*. A CLI has no cookie banner; a marketing site has
no permission prompt. Five sweeps written from the chatbot lens were structurally blind to both.

## Falsifier

**If, by 2026-11-18, no founder-facing surface has grown past the dose ceiling AND the catalog has
not gained a row, the split was ceremony** — the growth it was built to make safe never happened, and
a single well-pruned prose file would have served. Cheap to check: `npm run check:patterns` prints
both numbers.

The inverse failure is louder and needs no scheduled check: if a founder reports being handed a wall
of patterns for something they aren't building, the shape→surface map is wrong, not the architecture.

## Consequences

- The catalog can now be added to without a judgment call about length. That is the point, and it is
  also the new risk: **growth is no longer self-limiting, so `check:patterns` is now load-bearing.**
- Every consumer that inlined its own subset (`/red-team --humane`, `/landing`, `/money`, `/sunset`,
  `/pretotype`) should converge on reading the catalog. `--humane` did in this release; the rest
  still restate, which is acceptable where the list is 3 lines at exactly the right moment.
- A row can now ship marked `status: candidate` and render as **UNVETTED** rather than being held
  back entirely or quietly presented as settled — `consent-or-pay` and `ai-washing` are the first two.
- **The reflexive question, now answered (2026-08-20, same day).** The catalog names
  `exit-no-export` — *"The work is real and there is no export. Leaving means abandoning it."* So
  BOSS's own exit got audited against it. Most of it was already right: `boss remove` derives its
  boundary from the template trees, counts and names the founder's files, and prunes `docs/evidence/`
  **only if empty** — so DECs, EVIDs, the canvas and the ideas all survive by construction, because
  BOSS's durable artifacts are portable plain text.
  **One thing was not.** `.boss/brain/*.md` is model-owned prose about the venture, and `boss brain`
  tells the founder in as many words: *"This is yours to correct — edit `.boss/brain/read.md` if the
  read is wrong."* `boss remove` deleted it wholesale, described in the preview as "the conscience's
  private notes." Deleting a thing you told someone was theirs, with no way to take it with them, is
  the row. Fixed: remove now writes `docs/venture-brain.md` before deleting `.boss/`, and the preview
  says so. Verified on a throwaway project — `.boss/` gone, the DEC kept, the brain exported.
  **Worth recording as a method, not just a fix: writing the rule precisely is what found the
  violation.** A vaguer catalog line ("respect data portability") would not have sent anyone to read
  `remove.js`.
