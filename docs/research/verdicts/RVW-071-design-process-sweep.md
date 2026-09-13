---
id: RVW-071
type: verdict
owner: designer
status: recorded
created: 2026-08-11
verdict: ADOPT (3 additions + 1 rot fix + 1 cadence fix; the existing catalog CONFIRMED)
route: UP library/practices/design-system.md · scripts/check-freshness.js (new `craft-ai` tier) — shipped v0.144.0
---

# RVW-071 — Design process sweep (domain 7): frameworks, iteration, principles

## The claim

- **Ajesh, 2026-08-11:** *"anything else around UI design frameworks or designing or iterating on it,
  as well as creating design guidelines and principles"*
- **Standing suspicion to test:** the build-craft watchlist flagged `design-system.md` as the
  **weakest doc on the shelf** — dhun-derived, predating the frontmatter convention, and riding a
  `craft`/365d cadence its AI-failure catalog outpaces.
- **Sources swept:** the 2026 "sameness problem" literature (Pixso, Superside, UXPin, IxDF), AI-native
  design-system writing, design-principles-authoring guidance (the principles → guidelines → rules
  hierarchy).

## Rubric

| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No. The principles-authoring addition **reinforces** #3 (style as reusable structure) and mirrors `/decide`'s falsifier. |
| 2 | Evidence grade | **Mixed, and it matters.** The sameness material is commentary-grade and largely *restates* what BOSS already held via RVW-052 — it earns confirmation, not adoption. The principles→guidelines→rules hierarchy is durable design practice with a clear mechanism behind it. |
| 3 | Duplicate or sharpen? | **Mostly duplicate — which is the finding.** The catalog (47 blues, pattern reinvention, missing states, brand-default) and the aesthetic-ambition section held up cleanly against a 2026 sweep. Three genuine holes remained. |
| 4 | Who serves / harms? | The iteration rules serve **every cohort** — "make it better" five times is the universal failure. Principles-authoring most serves `non-tech-founder` / `first-product`, who are told to "have design principles" and produce a list of adjectives. |
| 5 | Cost / ceremony | **Additive to one doc; no new skill, agent, or hook.** The cadence change is one line in `check-freshness.js`. |

## Verdict: the "weakest doc" call was half right

**Confirmed, no change:** the AI-failure-mode catalog, the three-layer token architecture, the
indigo-apology / AI-slop framing, *intentionality not intensity*, the five dimensions, the
accessibility-and-five-states floor, and the cohort-aware delivery. The 2026 sameness literature
**agrees with BOSS and adds nothing** — a doc dismissed as weakest turned out to be substantially
current in its substance. *The staleness was in its edges, not its content.*

### 1. ROT — a TODO list of things that had all shipped

`## To author (when V1 mode is built)` listed five items. **Every one existed**: `docs/design/`
tokens + style guide, `/design-review`, `/ux-check`, `/design-tokens-init`, `ui-designer`,
`ux-designer`. The doc had been describing built work as unbuilt for multiple versions.

Replaced with a **Shipped** section — *and the genuinely-open items kept honest*: the hardcoded-style
detection hook is described in *Enforcement* but **not shipped**, and the prototype registry is
unbuilt. Converting a stale TODO into a clean ✅ list would have hidden the one gap that matters.

### 2. ADD — authoring design principles (principles → guidelines → rules)

The hole a founder actually falls into. Three levels, because each steers a different reader:

| Level | Contains | Steers |
|---|---|---|
| Principle | a **tradeoff** — *"calm over engaging"* | you, in an argument |
| Guideline | how to approach it | you and the agent, in a decision |
| Rule | a checkable instruction — *"no unread-count badges"* | the agent, and a lint rule |

Two lines carry it. **The test:** *could a reasonable person argue the opposite?* — "be delightful"
fails, "calm over engaging" passes. **A principle that can't lose an argument is a mood.**
**The reason it belongs in an AI-design doc:** an agent cannot act on a principle; it can act on a
rule. So the hierarchy is the ladder from taste to enforcement, and **principles that never descend
into rules are decoration.**

### 3. ADD — iterating on design

Missing entirely; the doc covered structure (tokens) and taste (ambition) but not *how you get from
draft to good*. Four rules, of which the third is the one people get wrong:

- Iterate on the **artifact**, not the description (the rich-reference ladder pointed at design —
  adjectives are where taste goes to die).
- Vary **one dimension at a time**.
- **Compare in parallel; don't refine in series.** Serial *"make it better"* re-averages toward the
  mean each pass — i.e. toward exactly the slop the doc spends a section warning about. Parallel
  variants force a decision, which is the one thing the model can't do for you.
- **Have a stop rule** — when the change isn't visible to someone who isn't you.

Plus a cross-doc catch: `agent-security`'s **re-iteration degradation** applies to design too, and
**empty/loading states are the first casualties** because they're invisible in the screenshot you're
staring at. The five-state requirement is not one-and-done.

### 4. SHARPEN — prevention was framed as prompting, not enforcement

The failure table prescribes *"reference tokens by name in every prompt."* That's a **prompt
convention — a filter**, dependent on every future prompt remembering. This is the same lesson
[RVW-066](RVW-066-allowlist-is-not-a-boundary.md) took from CVE-2026-22708, in a different domain:
**bound the capability, don't enumerate the route.** What stops the 47 blues is a check that fails on
a raw hex. The *Enforcement* section now opens with that, and the unshipped hook is named as the gap
it implies.

> Worth noting the shape: **a security refutation generalized into a design practice.** That
> transfer — filter vs. boundary — is looking like a BOSS-wide lens rather than a security one.

### 5. FIX — the cadence, properly rather than by re-dating

`craft`/365d was too slow. Mis-filing it under `model` would have routed it to `/recalibrate`, which
owns neither design nor testing. So a **new tier**: `craft-ai` — **180d, `/practice-refresh`**,
*"durable craft whose AI-default half moves with the tools."* `design-system.md` and
`testing-with-agents.md` both moved onto it.

**Two sweeps in a row hit this same gap** (testing was filed at `craft`/365 on 2026-08-11 with a note
that it was too slow). That repetition is the signal a **tier was missing**, not that two dates were
wrong — and `check-freshness.js` says in its own comment that the cadences are a revisable claim.

## Still open (logged, not dropped)

- ~~**The hardcoded-style detection hook is unshipped.**~~ → **CLOSED v0.145.0.** `design-tokens-guard`
  ships dormant at L1, offered once by `/design-tokens-init` at the only JIT moment that makes sense
  (right after the tokens exist). **The design decision worth recording is the silence:** it does
  nothing without a `DESIGN_TOKENS.md`, because a hook that nags a founder who never opted into a
  token system is the unearned ceremony BOSS refuses — and it's the failure mode that would get the
  hook switched off permanently. The 5 regression tests lock the silence *before* the detection, for
  that reason.
- ~~**The prototype registry**~~ → **CLOSED v0.146.0**, and it turned out to close a hazard this very
  verdict's sibling (RVW-069) had opened: telling `/spec` that a mockup beats prose is only safe if
  the mockup consumes the token system. **An off-system mockup is worse than prose** — prose is
  obviously incomplete so the implementer fills gaps from the design system; a mockup is a confident,
  complete-looking answer reproduced faithfully, raw hexes and all. *A recommendation can create the
  gap that the next recommendation has to close; the ladder and the registry are one idea, shipped
  two versions apart.*
- **A false ✅ shipped in v0.144.0 and was corrected in v0.146.0.** This verdict's own §1 replaced a
  stale TODO with a Shipped list, and claimed `STYLE_GUIDE.md` existed. It didn't — it was read by
  three consumers and written by nothing. **The lesson generalizes past this doc: a checklist is a
  claim, and the failure mode of "fix the stale TODO" is writing a new one that's wrong in the other
  direction.** Now covered by a regression test on the class (*every design doc a consumer reads is
  one some skill writes*), not the instance.
- ~~**`design-system.md` wants the v0.143.0 bundled-resource split.**~~ → **WITHDRAWN v0.147.0. This
  item was wrong, and the reason is worth more than the item.**

  It imported skill logic into a place it doesn't apply. The v0.143.0 split was justified because a
  `SKILL.md` body **auto-loads when the skill fires** — you pay for every line whether you need it or
  not, so deferring the rarely-read half is a real saving. **A practice is never auto-loaded.** It's
  read deliberately (`boss craft <name>`, or an agent following a pointer), and a deliberate reader
  wants the whole document. Splitting it would add indirection to buy nothing.

  The measurement made this concrete: across 28 practices the median is **~115 lines**, and
  `design-system` (256) and `ai-ux-patterns` (278) are the only two past 2×. So the length *is*
  anomalous — but "anomalous" and "should be split" are different claims, and only the first was
  supported.

  **What the outlier actually signals is growth, not structure.** A shelf that only ever grows is how
  BOSS becomes the framework it refuses to be (R&H #1) — and file-splitting would *hide* that by
  making each piece look small. So the fix points at subtraction instead:

  - `boss craft` now prints each practice's length, flags anything past 2× the median, and says
    plainly that the next `/practice-refresh` should ask **what can be deleted**, not just what to add.
  - `boss craft <name> --outline` prints the section map, so a long practice can be navigated before
    it's pulled whole — the actual ergonomic complaint underneath "it's long."

  > **The general lesson:** a rule that earned its place in one context is the easiest kind of wrong
  > guidance to write, because it arrives pre-justified. Progressive disclosure is about *what loads
  > without being asked for* — applied to something nobody loads unasked, it's cargo cult.
- **`design-system.md` is 210 lines** and would benefit from the same bundled-resource split applied
  in v0.143.0 — the failure catalog and the five-dimension table are reference, not procedure.
