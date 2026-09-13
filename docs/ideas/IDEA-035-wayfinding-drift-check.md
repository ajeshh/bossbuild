---
id: IDEA-035
type: idea
owner: product-lead
status: shipped
gist: A scope-aware nudge when something genuinely new is named nowhere a founder would look. Deliberately not an enumeration gate — the prose is drift-resistant by design.
program: standing-freshness
proof: scripts/check-wayfinding-drift.js
created: 2026-06-20
---

# IDEA-035 — Wayfinding-drift check (catch stale prose before 20 releases do)

> **Built v0.71.0 (2026-06-20) — cheapest slice only.** `scripts/check-wayfinding-drift.js` +
> `npm run check:wayfinding`, wired as a courtesy nudge into `gen:docs`. Guards `GUIDE.md` against the
> manifest skill lists; nudges, never blocks; printed exempt list for internal/meta skills. Cleared the
> drift it found on first run (added `/import`, `/cost-review`, `/boss-sync`, `/feedback` to `GUIDE.md`).
> **Still NOT-YET:** the founder-facing `boss sync` generalization (instance #2 below) — earns its place
> after this dev-side check proves out (PRINCIPLE #2).

> Seed: Ajesh, 2026-06-20 — after a 20-release build day, the *generated* wayfinding (`boss map`,
> `CHEATSHEET.md`, `SKILLS.md`) stayed current automatically, but the *hand-authored* prose (README,
> `/welcome`, `GUIDE.md`, template `CLAUDE.md`) had drifted — the **recurrence of the exact "19-release
> README drift"** [[IDEA-018]] was built to catch (v0.68 was the manual de-rot pass). The lesson:
> generated wayfinding is drift-proof; **curated prose isn't, and nothing flags when it falls behind.**
> Ajesh: capture a `boss sync`-style "did the prose drift?" check. **Capture, don't build** (CLAUDE.md #3).

## The trap (the load-bearing reframe — get this wrong and the check is noise)

The obvious version — *"every skill in the manifest must appear in the README / `/welcome`"* — is
**wrong**, and would false-positive on nearly every doc. The prose is **drift-resistant *by design***
(the [[IDEA-018]] move): it deliberately does **not** enumerate skills; it points at `boss map` and the
generated cheatsheet for the live list, and each surface names only what fits *its* scope (README =
headline on-ramps; `/welcome` = L0 founder skills; `GUIDE.md` = the full ladder). A blanket "skill X is
missing from doc Y" check fights that design and trains the maintainer to ignore it — the same
false-alarm failure the conscience guards against.

So the check must be **scope-aware and soft** — a *nudge that what's genuinely new isn't named anywhere
it should be*, not an enumeration gate.

## The honest signal (what's actually worth flagging)

A capability that shipped and is mentioned in **no** hand-authored surface at all — not even the one
doc meant to be comprehensive. Concretely:
- **`GUIDE.md` is the one prose doc that *is* meant to walk the whole ladder.** A manifest skill that
  appears in **no** mode's GUIDE rung is a real omission (today's actual failure). That's the highest-
  signal, lowest-false-positive check.
- **README / `/welcome`** — *don't* check these against the full skill list (they're curated by design).
  Only flag when a **headline on-ramp** (a new top-level CLI verb like `boss adopt`, or a new front-door
  skill) ships and the README's install flow names none of it. A short allow-list of "front-door"
  surfaces, not every skill.

## Two instances (same idea, two owners)

1. **BOSS's own repo (the today problem).** A dev-only `scripts/check-wayfinding-drift.js` (or a check
   folded into `npm run gen:docs`) that greps `GUIDE.md` against the manifest skill lists and warns on
   any skill in **no** rung; optionally checks the README front-door allow-list. Runs in CI / pre-commit.
   *This is the targeted fix for what actually bit us.*
2. **A founder's project (the `boss sync` version — UP candidate).** `boss sync` already narrates the
   CHANGELOG diff since the pin. Add one line: *"N new skills since your pin aren't named in your
   `CLAUDE.md`/`docs/` — want me to surface them?"* — a nudge in the sync narration, never a gate. This
   is the founder-facing generalization; build it only after the BOSS-own check proves out (PRINCIPLE #2).

## Restraint

- **Nudge, never enforce.** A drift check that *blocks* a commit for unnamed prose is the ceremony BOSS
  refuses. It informs; the maintainer decides.
- **Don't fight the drift-resistant design.** The whole point of `boss map` + generated docs is that the
  prose *doesn't* have to list everything. The check guards the genuinely-comprehensive doc (`GUIDE.md`)
  + the front-door allow-list — not blanket coverage.
- **Cheapest slice first:** the `GUIDE.md`-vs-manifest grep for BOSS's own repo. ~30 lines, dev-only, no
  founder-facing surface. The `boss sync` founder version earns its place later.

## Links
[[IDEA-018]] (wayfinding + the generated-vs-prose split this completes — generated is drift-proof, this
catches when prose lags) · [[IDEA-001]] (the `boss sync` loop the founder-facing version rides) ·
`scripts/gen-docs.js` (the natural home for the dev-side check — same `src/modes.js` source of truth).
