---
id: PRACTICE-scalable-architecture
type: practice
owner: mentor-architect
status: active
host: stack-neutral
provenance: distilled from the 2026-06-20 founding-teams research (RESEARCH-COMPENDIUM-2026-06-20 Part B7 — technical scaffolding that survives the climb) — Fowler MonolithFirst, Shopify's 2.8M-line modular monolith [EVIDENCE], Bezos one-way/two-way doors, Factory.ai "documented conventions rot; enforced conventions compound", Notion's eslint ratchet — BOSS v0.89.0, FEAT-023 thread 2
provenance_public: Distilled from founding-teams research on technical scaffolding that survives the climb — Fowler's MonolithFirst, Shopify's 2.8M-line modular monolith, Bezos's one-way and two-way doors, Factory.ai ("documented conventions rot; enforced conventions compound"), and Notion's eslint ratchet.
last_reviewed: 2026-06-20
review_by: 2027-06-20
curve: craft
---

# Practice — Architecture that survives the climb (defer the tax, enforce the conventions)

> **The spine.** The value is never the rule — it's the **enforcement loop**. A convention an agent (or
> the fiftieth hire) can't enforce against itself rots within a week. AI sharpens this to a point: an agent
> re-derives the codebase's conventions from scratch every session, so anything you only *wrote down*
> drifts, and anything you *encoded as a check* compounds. Factory.ai's line is the cleanest statement of
> it: **"documented conventions rot; enforced conventions compound."** This practice is two moves —
> **defer the architecture costs you can defer**, and **encode the conventions you can't afford to lose** —
> so a fast AI build doesn't dig a hole that's expensive to climb out of.

## Modular-monolith-first, extract when forced

Start with **one deployable**. Resist the pull to split into services before a real seam demands it
(Fowler's MonolithFirst; Shopify runs a **2.8M-line modular monolith** [EVIDENCE] — "microservice envy"
is on the *Hold* ring of the ThoughtWorks radar for a reason). The distributed-systems tax — network
calls, partial failure, deploy orchestration, eventual consistency — is real and you pay it forever once
you take it on. At n=1–5 with an AI writing most of the code, that tax buys you nothing and costs you
velocity.

- **The *modular* half is the part that's load-bearing.** A monolith isn't a license for a mud-ball.
  Keep clear module boundaries *inside* the single deployable — each feature/domain owns its code, talks
  to others through a named interface, doesn't reach into another's internals. That's what makes the
  eventual extraction *cheap when forced*: you cut along a seam that already exists, instead of
  untangling one that doesn't. A `FEAT` is a natural module.
- **"Extract when forced"** means the trigger is a real constraint — a scaling wall, a team that needs
  independent deploys, a compliance boundary — not an aesthetic preference or a blog post. Until then,
  the monolith is the right answer, not the embarrassing one.

## Spend the rigor on the one-way doors — and the schema is the one

Most architecture decisions are two-way doors (Bezos): reversible, so decide fast and cheap. **One is
not — the database schema.** Data outlives code; a bad migration on live data is the change you can't
take back. So that's where the ceremony goes, from the *first table*:

- **Migrations-as-code from day one.** Every schema change is a versioned, reviewed, replayable migration
  file in the repo — never a hand-run `ALTER TABLE` on the database. This is the single thing that's
  genuinely expensive to retrofit (evodb / evolutionary-database discipline), so it's the one piece of
  upfront ceremony that pays for itself immediately.
- **The migration log *is* a guardrail against AI schema drift.** An agent generating schema changes
  across sessions will happily diverge — add a column here, rename one there, no record of why. The
  migrations directory turns that into a reviewable, ordered, ownable history: the same artifact that
  lets you replay the schema also lets a human (and the next agent) see what changed and veto what
  shouldn't have. Wire schema changes into the **high-risk review tier** (see
  [`git-workflow.md`](git-workflow.md)).

## Conventions as code (enforced, not remembered)

A convention only counts if a machine enforces it — otherwise it's a suggestion an agent forgets.

- **Formatting is law, not taste.** Adopt a formatter and let it end the style debate permanently
  (Prettier, or **Biome** — its single binary is genuinely agent-friendly for a new repo: one tool, no
  config archaeology). No human and no agent argues about formatting again; the tool decides on save.
- **Boundaries as lint.** The module boundaries above are worth nothing if anyone can quietly cross them.
  Encode them as lint rules / import boundaries / architectural fitness functions so a crossing *fails a
  check*, not *gets noticed in review* (which it won't, at AI output speed). Start with the principle and
  the lint rules you can write today; the heavier custom-plugin / fitness-function tooling is **NOT-YET**
  until the surface area earns it (Principle #2).
- **Types at the boundary.** Where the stack has them, turn the strict knobs on early (`strict` mode,
  no-implicit-any) — they're the cheapest enforced convention there is, and they're far more painful to
  retrofit onto a large AI-generated codebase than to start with.

## The ratchet holds the line (extends `quality-ratchet`)

The mechanism for *keeping* any of this — module-boundary crossings, schema-drift, type violations,
skipped tests — is the [`quality-ratchet`](quality-ratchet.md) already in BOSS's library: pick one
countable number, baseline it, and let it move **only the right way**, gated in `/smoke`. The point of
naming it here is the architectural application: **the gate holds the line, not the reviewer.** At AI
output speed a human reviewer cannot be the thing standing between the codebase and a thousand small
regressions — a "no-new-violations" baseline (Notion's eslint-seatbelt pattern) can. Don't restate the
ratchet mechanics; reach for that practice and point it at an architecture metric.

## One canonical context file (don't re-derive the rules)

The conventions an agent *can't* lint — the why-we're-shaped-this-way, the domain language, the
landmines — belong in **one canonical, version-controlled context file** (CLAUDE.md / the AGENTS.md
standard), pruned ruthlessly. The 2026 finding is counterintuitive and worth holding: **the failure mode
is over-length, not under-spec** — a bloated context file gets *ignored* by the model, which is exactly
why BOSS keeps its wayfinding lean and JIT-loads the rest. This is [`context-discipline`](context-discipline.md)'s
territory; named here only because architecture-at-scale lives or dies on whether the next agent inherits
the decisions or re-invents them.

## Altitude / JIT (right rigor, right rung)

Not a Quickstart lecture, and not all at once. **Modular boundaries** matter from the first real build
(MVP — clear module seams as features accumulate). **Migrations-as-code** arrives at the *first table*,
not before — a prototype with mock data needs no migration log. **Conventions-as-code** earns its place
the moment a *second* author touches the repo — and a second *agent* counts, which is sooner than most
solo founders expect. The distributed-services question is a **V1→Scale** concern; bringing it up at MVP
is the premature-ceremony failure (Principle #2).

## Relationship to BOSS

This extends [`quality-ratchet`](quality-ratchet.md) (the enforcement mechanism) and sits alongside
[`git-workflow`](git-workflow.md) (the daily flow that merges these conventions safely),
[`context-discipline`](context-discipline.md) (the one context file), and
[`agent-security`](agent-security.md) (the human-gate on the irreversible — of which the schema migration
is the canonical case). A CLI `boss migrate` / a scaffolded migrations directory is a *possible* DOWN
later, once a real project hits its first table and the by-hand discipline has earned the machinery
(Principle #1). The `mentor-architect` agent is the natural place to surface this JIT to a founder; that
DOWN is **deferred** only to avoid a live edit collision, not on judgment. The org/scaling half of
"surviving the climb" — DRI, give-away-your-Legos, stage breakpoints — is FEAT-023 thread 3 (the
unauthored V1→Scale rung). See FEAT-023.
