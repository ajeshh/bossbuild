---
id: IDEA-083
type: idea
owner: product-lead
status: deferred (trigger-gated)
proof: none
proof_note: Nothing exists yet and nothing should until the trigger fires. When built, the proof is the generated fixture tree plus the check that regenerates it — a hand-written example is a claim about the output, not a sample of it.
program: front-door
created: 2026-09-08
source: |
  A partner-review read of BOSS as a *tool someone would recommend* rather than as a business
  (2026-09-08 session). Item 6 of six; the other five shipped as v0.257.0–v0.260.0. Ajesh:
  "I think 6, capture as an idea."
---

# IDEA-083 — a filled example project, so a founder sees the output before generating it

## The gap

Nobody adopts a documentation system on faith. BOSS asks a founder to accept an ID system, a
frontmatter contract, four modes and a conscience **before they have ever seen what any of it
produces**. Every artifact BOSS makes — a living idea doc, a canvas with a real riskiest
assumption, a graded `EVID`, a `DEC` with a falsifier, a `boss recap` — is invisible until the
founder has already done the work of making one.

That is backwards for the *recommend* case specifically: the person deciding whether to pass BOSS
on to someone else has no way to look at the output without adopting the process first.

## The shape (unbuilt, deliberately)

A small, real, finished example — one plausible project carried far enough that every record type
exists and they visibly refer to each other. Openable in three ways, cheapest first:

1. **`boss example`** (or `boss new --example`) — scaffold a copy locally and poke at it. Reuses
   `boss new`; the content is a fixture, not a feature.
2. **Rendered on the site** — the same tree as HTML, so it needs no install to look at.
3. **A `boss recap --md` of it** — the one artifact that is *already* paste-shaped.

## What would make it dishonest, and therefore the constraints

- **It must not model a success.** A worked example where the canvas holds and the evidence
  climbs to `commitment` teaches the wrong lesson and is the flattery failure this repo keeps
  catching. The honest example includes a bet that got **weaker** on contact — an `EVID` at
  `stated-pain` that never rose, a `/sunset` of one idea, a `DEC` whose falsifier fired.
- **It must be generated from the real skills, not hand-written prose.** A fixture authored by
  hand is a claim about what BOSS produces. Generating it (and regenerating it on release) makes
  it a *sample of the actual output*, and lets a check compare it against the current templates —
  otherwise it rots into the most visible stale surface BOSS has.
- **It must be obviously fictional.** A realistic example project invites someone to read it as a
  real venture's private records.

## Why it is not being built now

It is a demand-shaped bet with the same n as everything else, and the five changes shipped ahead
of it were all subtraction or composition. This one is **addition** — a new command, a fixture
tree, and a generator to keep it true. That earns a trigger rather than a slot:

**Re-open trigger:** someone asks *"what does it actually produce?"* — or a second person bounces
off the front door without generating anything. Either makes this the cheapest next move.

**Noted 2026-09-12:** the generator this record asked for now half-exists — `claude plugin eval
--scaffold` (IDEA-103, v0.320.0) builds a scaffolded project as a fixture on every run. If the
trigger fires, the example is that fixture rendered, not a second tree. The trigger itself has not
fired — nobody has asked *"what does it actually produce?"* yet.

## Related

- [[IDEA-047]] — BOSS pretotypes itself: the 60-second browser taste. Same instinct, different
  surface; if both get built they should share one fixture, not two.
- [[IDEA-057]] — BOSS's own visual identity + the site (where option 2 would live).
