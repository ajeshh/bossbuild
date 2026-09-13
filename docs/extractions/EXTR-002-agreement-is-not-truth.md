---
id: EXTR-002
type: extraction
owner: product-lead
status: recorded
created: 2026-08-20
trigger: FEAT-NNN-shipped
---

# EXTR-002 — a checker that compares two documents proves they agree, not that either is right

## Recent context

`check:backlog` shipped at v0.181.0 to stop the backlog drifting. It compared each record's
frontmatter to its row in `INDEX.md`. Ajesh's response to the result was the correction that
mattered: *"lets update boss so that this kind of stale never happens again."* Re-reading the gate
against the 21 findings it was built for showed **all 21 would have passed it** if the index had
simply agreed with the wrong files.

## Candidate 1: check the claim against the world, not against another claim

- **What it is:** a validation rule. When a document asserts something about a system, the check
  must resolve against **the system**. Document-to-document consistency is a weaker property that
  looks identical from the outside and fails in the one direction that costs most.
- **Where it lives now:** `scripts/check-backlog.js` class 1b (`proof:` resolved against disk, both
  directions), `src/records.js` (`recordDrift`), `scripts/check-refs.js` class 3c (a path that
  resolves *in BOSS's repo* is the discriminator), `scripts/check-dogfood.js` (the ledger checked
  against the repo).
- **Route:** **UP**
- **Rationale:** it generalises past records entirely. `check:site` already does the strong form
  (claims resolved against the roster); `check:refs` had been doing the weak form for two classes
  and shipped a founder-facing escape because of it. Four separate checkers in this repo needed the
  same sentence and none of them had it written down. **Any project with docs that describe code
  has this failure available to it.**
- **If UP:** a section in `library/practices/documentation.md` rather than a new practice — that doc
  already owns *what to write down* and has no position on *how to know it is still true*.

## Candidate 2: the escape hatch must be declared, never inferred

- **What it is:** where a rule has legitimate exceptions, the exception is a **required written
  field**, not a silent tolerance. `proof: none` needs a `proof_note:`. `check:dogfood` rejects a
  reason under 40 characters. `boundary.json` rejects an inherited verdict.
- **Where it lives now:** `check-backlog.js`, `check-dogfood.js`, `src/records.js`.
- **Route:** **UP**, into the same section.
- **Rationale:** it is what makes the strong form survivable. Without it, an honest state
  (built-but-blocked, completes-on-a-condition) either lies about itself or turns the gate red
  forever — and a gate that is red forever is a gate you bypass. **You may hold the state; you may
  not hold it silently.**

## What didn't make the cut

- **"Provoke every finding class before believing a gate works"** — already `library/practices/`
  material via the release-gate discipline, and it is a *testing* rule, not a documentation one.
  Recorded here only so the next pass doesn't re-derive it: every class in `check:backlog`,
  `check:dogfood` and `check:refs` class 3c was proven by breaking something and watching it fire.
- **The fail-open trap** (`try/catch` swallowing a `ReferenceError` so every derived date silently
  became null) — DOWN, fixed in place in `src/board.js` by re-throwing programming errors. It is a
  code smell with a one-line fix, not a practice. Third occurrence of this exact shape in the repo
  (`readLadder()`, `readBrainContext`, `gitFirst`), so **if it happens a fourth time it goes UP.**
