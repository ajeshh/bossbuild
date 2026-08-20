---
id: PRACTICE-quality-ratchet
type: practice
owner: pm
status: active
host: stack-neutral
provenance: ported UP from the dhun dogfood (.ratchet/ + /code-health gate) via the 2026-06-20 method scan — BOSS v0.48.0
provenance_public: Ported up from a dogfooded product's own code-health gate: a ratchet file plus a check that is only ever allowed to tighten.
last_reviewed: 2026-06-20
review_by: 2027-06-20
curve: craft
---

# Practice — The quality ratchet (a baseline that only moves the right way)

> **The problem this kills: silent backsliding.** A codebase accumulates the thing you're trying to
> reduce — `unwrap()`s, `any`s, TODOs, untyped boundaries, skipped tests, bundle bytes — one
> reasonable-looking change at a time. No single diff looks bad; the trend is the damage. A ratchet
> turns the trend into a gate: pick one number, write it down, and let it move only in the direction
> you want.

## The mechanism (deliberately minimal)

1. **Pick one metric** that proxies the quality you care about and can be counted mechanically
   (a grep count, a coverage %, a bundle size, a lint-violation total).
2. **Baseline it.** Write the current number to one file (e.g. `.ratchet/<metric>.txt`). One number,
   no ceremony.
3. **Gate regressions.** A check (CI, a hook, a `/smoke` step) recomputes the number; if it moved the
   wrong way, the gate trips. Improving the number updates the baseline (the ratchet clicks tighter).
4. **Log the why, elsewhere.** When the baseline moves — especially if an override let it loosen — a
   one-line note in a devlog/CHANGELOG records *why*. The ratchet file stays a bare number; the
   reasoning lives where reasoning lives.

## Why one number, one direction

The power is in the constraint. A dashboard of twelve metrics gets ignored; one number with a hard
direction is a decision you can't accidentally skip. The ratchet doesn't ask you to fix everything —
it asks you to **never make it worse**, which is the achievable version of quality discipline on a
fast-moving build. (Principle #1: extract the reusable discipline, not a one-off cleanup.)

## When to reach for it vs. when not to

- **Reach for it** when something you care about degrades gradually and reversibly, and a single
  countable proxy exists (error-handling debt, type coverage, test count, a11y violations).
- **Don't** ratchet a number that can't be gamed-proof or that punishes legitimate growth (raw LOC,
  file count). A ratchet on the wrong metric just adds friction. And don't add the gate before the
  metric has earned it — premature ceremony (Principle #2).

## Relationship to BOSS

A CLI `boss ratchet` is a *possible* DOWN later — but only once a metric earns it. For now this is the
named pattern a founder (or BOSS's own repo) can apply by hand or wire into `/smoke`. See `IDEA-027`.
