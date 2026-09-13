---
id: FEAT-022
type: feature
owner: mentor-architect
status: shipped (v0.60.0–v0.65.0)
gist: The conscience's memory — a venture brain the model reads before it speaks, so BOSS stops re-asking what it was already told.
program: ai-native-boss
from: IDEA-022
proof: src/brain.js
created: 2026-06-14
shipped_on: 2026-06-20
---

# FEAT-022 — the venture brain (the conscience's memory)

> Build contract for the spine of [IDEA-022](IDEA-022-ai-native-boss-living-conscience.md) —
> *"BOSS stops being templates + predicates and becomes AI-native, with a conscience that has a
> **mind**."* Track 0 of that program. **Complete at v0.65.0.**

## Why this record exists at all

**It was written 60 releases late, because nothing was checking.** `FEAT-022` was named in a
**shipped** practice — [`conscience-voicing.md:108`](../../library/practices/conscience-voicing.md) —
and twice in `registry/CHANGELOG.md`, including the sentence *"FEAT-022 (the venture brain) is now
complete."* There was no record behind the id. A founder reading the practice, or anyone reading the
changelog, met a pointer to a document that had never been written.

Recovered 2026-08-20 during the backlog-integrity sweep that also found 21 status disagreements and a
duplicate `IDEA-059`. `npm run check:backlog` now enforces the ID↔file mapping, so an id can no
longer be cited by shipped content while existing nowhere. The lesson is the one `check-refs` was
built on and this simply extends: **a reference is a dependency** — including a reference to BOSS's
own record of why it built something.

## The shape

Two model-owned files, one CLI-owned index. The split is the whole design: **the model owns the
prose, the CLI owns the index.** Zero-dep holds; the CLI never calls a model.

| File | What it holds | Written by |
|---|---|---|
| `read.md` | The POV — what BOSS understands about this venture right now. | `/close`, `/comprehend` |
| `relationship.md` | What the conscience *said*, and what the founder *did* with it. | `/close`, only when the conscience actually fired |

`relationship.md` is the half that closes the loop [`IDEA-013`](IDEA-013-conscience-frequency-ledger.md)
only *counts*. The frequency ledger answers *how often did it fire?*; the relationship log answers the
question that matters — **did the nudge land?** Entries are tagged honestly: *landed* / *ignored* /
*overrode, with the reason* / **pushed back and was right**. The last is the most valuable one in the
file: it is how the conscience learns to fire *better* rather than *less*.

## The payoff — reading it back

When a moment fires, the hook hands the model a **bounded** slice of the recent log (~1–2 sessions,
~900 chars) so it **adjusts instead of repeats**: if it raised a point and the founder moved past it
for a stated reason, it says it lighter or stays silent; if a past nudge landed, it builds on it.
That is what makes the conscience feel like it remembers *the conversation*, not just the venture.

## Bright lines (held, and still held)

- **It logs the conscience's own hit rate. It never scores the founder.** A memory of what someone
  ignored, pointed at the person, is a compliance file. Pointed at BOSS, it is calibration.
- **Bounded read, and only while a moment is firing** — never a standing context tax.
- **Byte-identical when no log exists**, which is what let the eval gate stay honest across the build.
- **Living memory:** `boss brain forget --before <date>` prunes *both* files symmetrically. Memory a
  founder cannot delete is surveillance with a nicer name.

## CLI

`boss brain` · `boss brain --relationship` · `boss brain record --kind read|relationship` ·
`boss brain forget --before <date>`

## Verification at the time

Conscience gate **105/0** plus the 24 GRADED judgment evals green, verified end-to-end in `/tmp`.

## Ties

- Parent program: [[IDEA-022]] (Track 0 — the spine).
- Counts what this one judges: [[IDEA-013]] (frequency ledger).
- Seeds the first read at scaffold time: `/comprehend` (v0.64.0, Track 3).
- Consumed by: `library/practices/conscience-voicing.md`.
