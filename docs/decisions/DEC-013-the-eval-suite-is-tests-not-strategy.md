---
id: DEC-013
type: decision
owner: "@ajeshh"
decided_by: founder
status: decided
created: 2026-08-21
reversibility: partially-reversible
revisit_by: 2026-11-21
follows: DEC-012
---

# DEC-013 — The conscience eval suite is tests, not strategy, and moves to the public tier

> Work-order item **2e**, surfaced by Ajesh on 2026-08-21: *"did we do the whole thing of building
> locally but not for the main boss app?"* Held for three sessions on the grounds that adding files
> to git history is asymmetric. Decided once the question got smaller and the answer got sharper.

## Context

`docs/architecture/` is tier-1 LOCAL, and the `.gitignore` header names its contents as *"the
dogfood workspace: roadmap, research, strategy, design, **evals**."* That declaration was
deliberate. Two findings moved it:

1. **Four public claims about BOSS's own rigour were resting on evidence no reader could open** —
   and all four were wrong (v0.212.0): README said the gate suite was *"143 passing"* (152),
   `docs/PATTERNS.md` said 57 unit tests (181) and 43 judgment cases (50), and
   `registry/dogfood.json` justified an **exemption** with *"143 eval cases"*. A reason not to do
   something, resting on a number nobody had checked in nine releases.
2. **The eval suite is the odd one out in its own tier.** Everything else in `docs/architecture/` is
   a document *about* BOSS — audits, briefs, the venture brain. `conscience-evals/` is executable
   verification of shipped behaviour. It is the same category as `test/`, which has always been
   tracked.

## Decision

**Track the cases and the runners. Leave the recorded transcripts local.**

- **Tracked (30 files, ~320KB):** `runner.js`, the 14 `moment-*.yml` gate suites, `lib/yaml-eval.js`,
  the 5 `*.judgment.yml` case sets, `replay.js`, `regrade.js`, `regrade-keyless.js`, `moments.js`,
  the fixtures, and both READMEs.
- **NOT tracked:** `judgment/transcripts/` — 50 files, 200KB of recorded model output.

**The transcripts are excluded on a mechanism, not on size.** They are stamped with a voice-hash,
and the suite's own tripwire marks them **STALE the moment a frame is edited** — by design, because
a frozen transcript otherwise asserts a decision the model would no longer make and *passes green*.
Tracking artifacts the system itself declares expired is committing to carry dead weight in a
history that cannot be un-written. They regenerate with `npm run regrade:keyless`.

### What this buys, stated narrowly

*"152 passing"* becomes exactly as verifiable as *"181 tests pass"* — the bar this repo already
lives at for `test/`. **Not** that any specific historical grade is auditable: that would need the
transcripts. The standard is the one every repo uses for tests — **you ship the tests, not the
console log proving they passed.**

## Why the asymmetry argument stopped applying

It was sized wrong. *"80 files / 564K, and history can't be un-written"* was true of the whole
directory, and the whole directory was never the right unit. The durable half is 30 files of source
that changes when the conscience changes. The 200KB that genuinely should not be carried forever is
exactly the half being left out.

## What is NOT decided

- **The rest of `docs/architecture/` stays LOCAL.** The audits, briefs, `venture-brain.md` and
  `MODEL-RECALIBRATION.md` are strategy. This moves one subdirectory on one stated ground.
- **`docs/decisions/` stays LOCAL**, so this file is not readable by anyone who reads the code it
  authorises. ⚠️ **That is the same shape as the defect above, and it is knowingly accepted here**:
  the repo convention is the `[[DEC-NNN]]` reference, and the tracked tier note in
  `conscience-evals/README.md` carries the *substance* inline so the reference is supplementary
  rather than load-bearing. If a second tracked claim ever needs DEC content to be checkable, that
  is the trigger to revisit the decisions tier — not this one.

## Falsifier

1. **The repo grows and nobody reads them.** If at `revisit_by` no one outside this machine has run,
   cited, or corrected a case, the claim *"the evals are the strongest evidence the conscience is
   real"* was about BOSS's comfort rather than a reader's need.
2. **The tracked half rots the way the claims did.** The cases are now a public surface; if they
   drift from the frames they test and nothing catches it, this traded an invisible problem for a
   visible one.
3. **Transcript absence bites.** If a fresh clone or a second machine cannot meaningfully run the
   judgment layer without them, the split was drawn in the wrong place and the transcripts belong in
   too.

## Consequences

- `.gitignore` changes from `docs/architecture/` to `docs/architecture/*` + a re-include, and its
  tier comment stops listing "evals" under LOCAL.
- Two newly-tracked files were **corrected before being committed**: `regrade.js` printed *"Commit
  the transcripts"* and `judgment/README.md` called them *"the committed dataset."* Both were true
  when written and false the moment this decision landed.
- `check-roster-claims.js` stops reporting gate-eval counts as unverifiable-from-tracked-files.
- **[[DEC-012]] clause 3 is served, not merely respected** — inspectability was the constraint, and
  this is the first change that adds inspectable evidence rather than only avoiding removing it.
