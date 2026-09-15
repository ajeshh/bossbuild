---
id: IDEA-091
type: idea
owner: designer
status: shipped (all seven parts, v0.276.0 → v0.282.0, one branch; ONE new loop and NO new verbs)
gist: BOSS has a design system's floor and its roof and not its middle — the plan that fills in components, patterns, flows and the language that grows from what gets built.
program: design-system
proof: none
proof_note: this record's product was the plan, the ordering and the refusals — the thing that belongs to no single part. Each part names its own proof when it lands. Part 1's is the component index `/design-tokens-init` writes.
created: 2026-09-10
---

# IDEA-091 — the design language: from a guide the founder reads to a substrate the agent retrieves

> Seed: Ajesh, 2026-09-10 — *"how boss does design system… component library for reuse, building
> blocks, UI kit, style guides… material design, human interface guidelines, atomic design, user
> flows… make it easily surfaceable, reusable, reduce cost of building prototypes and the actual app,
> easier for AI to use. I don't know how well we do it, what gaps we have. This is a critical part of
> BOSS and it may be under-developed."*
>
> **The audit said it is not under-developed. It is unevenly runged.** Extends [[IDEA-010]] (tokens,
> drift, prompt patterns — shipped) and sits beside [[IDEA-029]], which owns the interaction layer as
> a practice. This record owns the *ladder*: what a design system holds, which rungs BOSS built, and
> the order to fill the rest.

## The one move

A design system for an AI-built product is not a style guide the founder reads. It is **a retrievable
substrate the agent reads before it generates.**

Every part below is the same move at a different layer: turn a **filter** — a sentence asking the
model to remember — into a **boundary**: something it retrieves, or something that checks. BOSS made
this exact argument once already, *for colors*, and shipped `design-tokens-guard` to prove it. The
program is that argument carried up the ladder.

[[RVW-078]] is the outside confirmation and the warning in one: retrieval beats instruction for
design-system compliance (CHI EA '26 — direction credible, magnitude not; **never cite the ~95%
figure**, it is blog-sourced and the ACM body is 403 to us). BOSS took the mechanism as the portable
component index in v0.166.0 — **and shipped it at V1**, two rungs above where components are born.

## The ladder — what a design system actually holds

| # | Layer | What it holds | BOSS today | Verdict |
|---|---|---|---|---|
| 0 | **Brief** | why it looks like *this* | canvas Promises cell, `BRAND.md`, the 5-token distinctiveness pass | decisions get made and **recorded nowhere durable** |
| 1 | **Foundations** | color · spacing · type · radius · elevation · motion | `/design-tokens-init`, 3-layer DTCG, `design-tokens-guard` | ✅ strong — **1 of 6 families enforced** |
| 2 | **Components** | the reuse substrate | `manifest.json` reuse index | ✅ well designed, **wrong rung (V1)** |
| 3 | **Patterns** | composed recurring solutions *with guidance* | 10 of them in `ai-ux-patterns.md`, **UP only** | nothing lands them in a project |
| 4 | **Flows** | the sequence; the expensive judgment | an owner and two reviewers, **no artifact** | absent |
| 5 | **Content** | voice · tone · terminology | `STYLE_GUIDE.md` + `content-terminology-guard` | ✅ strong |
| 6 | **Visibility** | the lookable thing, and the handoff | `/design-library` | ✅ well designed, **V1-gated** |
| 7 | **Learning** | how the language grows from what gets built | — | absent, and the most BOSS-shaped part |

**The one-line verdict: BOSS has a design system's floor and its roof, and not its middle.** Layers 1
and 5 are genuinely good. 2 and 6 are built and runged wrong. 0, 3, 4 and 7 are missing.

## The governing constraints — read before proposing a part

1. **No new verbs.** The standing mandate from EVID-001 is *compose and SUBTRACT, never add
   another skill*, and the founder's own named fear is app bloat. Six of the seven parts below are a
   composition or a rung move. The seventh (flows) is held **precisely because** it is the one that
   would need a verb.
2. **Filter → boundary, at every layer.** If the only mechanism is "the prompt says to," it is not
   done. It is a filter, and the next prompt is free to forget.
3. **The rung is decided by the seed-that-scales test**, not by how finished the layer feels:
   *decide it at seed if reversing it gets more expensive as the app grows.* That test is already
   written in `design-system.md`; Part 1 exists because the test was applied to tokens and not to
   components.
4. **A claim may not exceed its predicate.** This program has the worst doc-rot record in the repo —
   three doc-vs-filesystem mismatches, and the practice says out loud that *"this doc's claims rot
   faster than its ideas."* v0.276.0 found a fourth. Every part verifies its claims against the
   filesystem, not against the doc they came from.
5. **n=0, and this is craft-driven, not evidence-driven.** Nobody asked for this by using BOSS. It
   does not outrank publish + Phase 3 outreach, and no part of it is evidence that BOSS works.

## The parts, in order

Ordered by *cost of deferring × cheapness*, which is the seed-that-scales test doing the sequencing.

### Part 1 — retrieval at the rung where generation happens · **shipped v0.276.0**
Move the component index DOWN to MVP and carry the component-boundary rule with it.

The two most expensive failures in BOSS's own catalog — **pattern reinvention** and **billion-line
drift** — both start at component number two, which is MVP week one. The fix shipped at V1. Same
inversion `designer` had before v0.189.0, same argument, never made for the index.

Carries the sentence the practice calls *"the one most often missed, and the most expensive"* — **build
the button, then use it on the page; don't build the page and leave the button inside it** — from the
craft shelf into the file the agent reads every turn. Seed-time cost: one sentence. V1-time cost: a
refactor across every screen shipped.

`/design-library` at V1 then **generates over the same shape** instead of introducing it.
*No new skill. `/design-tokens-init` writes one more file; `designer` and `/design-review` read it.*

### Part 2 — the guard past color · **shipped v0.277.0**
`design-tokens-guard` checks hex, `rgb()/hsl()` and Tailwind palette classes. The tokens file also
defines spacing, type, radius, elevation and motion. **One family of six is a boundary; five are
prose.**

⚠️ **Named risk, and it is the whole difficulty:** a spacing literal is far more common and far more
often legitimate than a hex — `gap: 1px`, a hairline border, a third-party embed. A noisy guard gets
turned off, and a guard that is off is worth less than no guard, because the founder believes it is
on. Start with radius and font-size (small, closed sets, high signal), leave spacing behind a
deliberate on-switch, and measure the false-positive rate on a real project before widening.
*No new anything — one existing hook, one existing test file.*

### Part 3 — the pattern layer lands DOWN · **shipped v0.278.0**
The middle of the ladder, and the layer the founder's own references actually are: Material and HIG
are not token files and not component dumps — they are **patterns with guidance**.

BOSS holds ten real interaction patterns in `ai-ux-patterns.md` ([[IDEA-029]]) and they are **UP
only** — on the craft shelf, read by whoever runs `boss craft`. Nothing lands them in a project as
retrievable building blocks with a do/don't pair and a five-state table. JIT, not a catalog dump:
only the patterns the project's actual surface needs.
*Composes `/design-library`'s rule-set rendering with the practice shelf. No new verb.*

### Part 4 — design decisions become durable · **shipped v0.279.0**
The 5-token distinctiveness pass makes five genuinely hard-to-reverse choices — neutral temperature,
radius, type pairing, the one owned accent, the signature token — and records them **nowhere a future
session can read as a decision**. Six months later nobody knows whether the 2px radius was a choice
or a default, which means nobody will defend it and everybody will drift off it.

`/decide` and `DEC-NNN` already exist, with a falsifier field built in. **Route design choices into
the record class BOSS already ships**, and have `/design-library` render the lineage beside the
swatch. This is the *capture* half of "develop the design language."
*A routing edit. No new record class, no new skill.*

### Part 5 — the learning loop: the language grows from what gets built · **shipped v0.280.0**
The engine, and the most BOSS-shaped thing on this list: **PRINCIPLE #1 pointed at design.** You built
this shape three times → name it, extract it, promote it into the pattern set.

Every piece already exists and none of them are connected. `/design-library` already computes
near-duplicates. `/extract` and `extraction-loop` already encode the UP/DOWN router. A
`design-pattern-loop` whose entry predicate reads the near-duplicate count out of `manifest.json` and
whose moment routes to `/extract` is **composition, not invention** — one loop on the v0.18 primitive.

**Depends on Part 1.** A learning loop over a component index that only exists at V1 can only learn
at V1, which is after the language has already set.

### Part 6 — the flow layer · **shipped v0.281.0** (held in the plan; Ajesh called it: *"finish all the pieces today"*)
The only layer with nothing behind it, and the only part that would earn a verb — which is exactly
why it is last and why it is not being built yet.

`designer` owns flows; `/design-review` pass two reviews flows; `/ux-check` walks the journey.
**Nothing produces one.** And the practice already names the ceiling: an AI review *"moves flow
efficiency by almost nothing… no amount of checking produces a flow nobody designed"* ([[RVW-092]],
UXBench — direction, not magnitude).

So the gap is real and the obvious fix is wrong: another checker cannot close it. What is needed is a
cheap **authored artifact** — the founder's judgment, captured once, in a form the agent reads — and
designing that is its own pass. **Captured, not built.** Re-open when Parts 1–5 have landed and a real
project has more than three screens whose order anybody argued about.

### Part 7 — the prototype seam · **shipped v0.282.0** (closer, not opener)
`/design-library` says a prototype should compose the components that already exist rather than redraw
them. `/prototype` lives two rungs below at Quickstart and **has no way to ever learn that.** The
first visual thing a founder makes is off-system by construction.

Cheap edit, genuinely worth doing — and worth nothing until Parts 1 and 3 give it something to
compose *from*. Ordered last for that reason, not because it is small.

## Refusals — settled, so nobody re-proposes them

| Refused | Why | Source |
|---|---|---|
| A shipped UI kit / starter components | PRINCIPLE #4 — zero-dep and stack-neutral. BOSS cannot ship React components without picking a stack. **The stack-neutral substitute IS the index + the generated gallery**, which is what got built. | — |
| Emitting `DESIGN.md` as the format | `version: alpha`; "becoming the standard" does not verify; visual-only, no voice or content half | [[RVW-079]] NOT-YET |
| Versioning / SemVer / deprecation machinery | Curtis's context is multi-team enterprise with *consuming teams*. A solo founder has none. Using a real authority outside the conditions that made him right. | [[RVW-080]] NOT-YET |
| Code → editable-design-file round-trip | Does not verify — personal blog, community MCP, a GitHub issue. No vendor primary, no reproduction. | [[RVW-082]] REFUSED |
| Building a sync engine, a hosting surface or a card index | That is the host's job, and building a second one is how this program becomes the thing it exists to prevent. | [[RVW-081]] ADAPT |
| Citing "~95% compliance" for registry-based retrieval | Blog-sourced; ACM body 403; GPT-5 grading GPT-5 | [[RVW-078]] |

## What would prove this wrong

A real founder reaches three or more components, with the index present, and **still** ships
`CTAButton` beside `Button`. That would say retrieval-at-MVP is not the boundary this record claims
it is, and the whole ladder needs re-thinking from Part 1 up.

Cheaper and available sooner: the first founder to run `/design-tokens-init` and then build a second
screen. Watch whether the agent reads the index unprompted.

## Outcome — what actually shipped, 2026-09-10

Seven parts, seven releases, on one branch. **One new loop (`design-pattern-loop`) and no new
verbs** — everything else was a rung move, a composition, or an edit to a surface that already
existed. The mandate held.

Part 6 was written as *held*, on the reasoning that it would need a verb. It turned out not to: the
flow is **authored in `/spec`**, which already existed and already wrote the artifact it belongs in.
**The thing that made it look like it needed a verb was assuming the artifact needed a new home.**

**Four corrections landed alongside the seven parts**, all one family — a claim outliving its
mechanism:

1. `design-drift-loop`'s overstatement in `claude-append.md`, which is *always-on agent context*
2. `/design-review`'s "at MVP read the component directory", stale the moment part 1 shipped
3. the `capture` moment voicing extraction-loop's words at a design review — **found by running it,
   not reading it**
4. `scaffold.test.js`'s design-doc invariant, whose body hardcoded one producer while its own name
   said *"some skill"*

**The method that found all four is the same and it generalizes: when a fact changes, grep the
string.** The same sentence is usually in two places, and the copy in always-on context is the one
that matters most.
