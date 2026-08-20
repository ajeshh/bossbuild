---
id: PRACTICE-design-system
type: practice
owner: designer
status: active
host: stack-neutral
provenance: generalized from the dhun dogfood design system (DESIGN_TOKENS as single source of truth, central badge/pill style utils, the "no raw Tailwind colors" enforcement hook, the prototype REGISTRY), de-dhuned for reuse — BOSS v0.20.x. The AI-failure-mode catalog was added in the same pass; IDEA-010 carries the BOSS-specific design (loops, cohort-aware scaffolding, prompt patterns). Frontmatter added 2026-07-30 (v0.135.0) — this doc predated the practice frontmatter convention, which is why no refresh discipline could see it.
provenance_public: Generalized from a dogfooded design system — design tokens as the single source of truth, central badge and pill style utilities, an enforcement hook that rejects raw framework colors, and a prototype registry — then stripped of everything product-specific so it would transfer. The AI-failure-mode catalog was written in the same pass.
last_reviewed: 2026-08-20
review_by: 2027-02-16
curve: craft-ai
---

# Practice: Design system — style never locked into code

> Generalized from dhun's design system (DESIGN_TOKENS single source of truth, central badge/pill
> style utils, "no raw Tailwind colors" enforcement hook, Rangoli generative styles, prototype
> REGISTRY). De-dhuned for reuse. Lands in **V1 mode**; seeds the moment a project grows real UI.
>
> **v0.20.x update:** AI-failure-mode catalog added below. The classical practice survives;
> what AI-assisted building adds is a set of failure modes that *happen by default* when a
> founder asks Claude for UI work without design discipline. See [IDEA-010](../../docs/ideas/IDEA-010-scalable-ai-design.md)
> for the BOSS-specific design (loops, cohort-aware scaffolding, prompt patterns) — that's the
> live spec; this practice doc is the always-true ground.

## AI-failure-mode catalog (added v0.20.x)

When founders ask AI (Claude / Cursor / Lovable / v0) to "build me a UI" without design
discipline, these failure modes appear by default. Naming them is half the fix:

| Failure | What it looks like | Prevention |
|---|---|---|
| **Rudimentary first design** | AI generates generic-internet defaults (Tailwind blue-500, default spacing, no brand). "Looks ok" at one screen; falls apart by three. | Brand-anchor the first prompt from the canvas Promises cell, not from "make it look good." |
| **The 47 blues** | Each new screen, AI derives slightly different colors. `bg-blue-500`, `#3B82F6`, `bg-blue-600`, custom variables — all in the same codebase. No single source of truth. | Tokens file FIRST, before second screen. Reference tokens *by name* in every prompt. |
| **Pattern reinvention** | Each new component is a new file. `Button.tsx` → `CTAButton.tsx` → `PrimaryButton.tsx` — all near-identical. AI doesn't search for the existing pattern. | Prompt convention: *"search components/ for similar; reuse first, extend second, create last."* |
| **Billion-line drift** | Code grows linearly with screens instead of approximately constant after primitives are built. AI never generalizes across requests. | Token system + reuse-first prompting *together*. Either alone is insufficient. |
| **Missing states** | Default/hover/active/disabled/empty/loading — at least one always missing. Especially empty + loading (the most user-facing failures). | Five-state requirement enforced at prompt level — name the states before AI gets a chance to skip them. |
| **Brand-default problem** | AI defaults to generic-internet aesthetics because that's the training data. Your brand voice never makes it in unless you bring it. | Canvas Promises cell becomes the design brief, not "make it pretty." |

### The seed-that-scales test (added 2026-08-20)

*"Embed the design principles just enough from the start — seed form that scales, so there's less
rework, but not over-engineered."* The instinct is right and it needs a decision rule, or "just
enough" is a vibe you re-argue every week. The rule:

> **Decide it at seed if reversing it gets more expensive as the app grows. Defer everything else.**

Same shape as *cheapest-reversible* and `/decide`'s falsifier, pointed at design. It sorts cleanly:

| Seed decision | Cost of deferring it | Ceremony? |
|---|---|---|
| Semantic tokens named by **purpose**, not hue | every use site changes on a retheme | no — one file |
| **Component boundaries: element-shaped, not page-shaped** | extracting primitives later is a rewrite | no — it's a naming habit |
| **Five states as structure**, not a review checklist | retrofitting empty/loading/error touches every component | low |
| **Terminology: one word per concept** | renaming a core noun later hits copy, routes, schema, tests | no — it's a list |
| Motion, theming, density, versioning, a component library | cheap to add when earned | **yes — defer** |

**Component boundaries is the one most often missed, and it's the most expensive.** Ask an AI for a
screen and you get a page-shaped component — `DashboardPage.tsx` with its own buttons, cards and
inputs defined inline. Every one of those is a primitive that never got extracted, and the next
screen re-invents it. **This is the upstream cause of two failure modes the catalog above names as
symptoms** — *pattern reinvention* and *billion-line drift* both start here, at the first component,
before any token has drifted.

The seed-time fix is one sentence in the prompt and costs nothing: *build the button, then use it on
the page — don't build the page and leave the button inside it.* The V1-time fix is a refactor across
every screen you've shipped. Same decision, two prices.

### The field's published understanding (2025-2026)

The AI-design-failure-mode literature is more developed than founders typically realize:

- **Boldare** — *Design System for AI-Assisted Development* — failure modes named: context
  loss, token ignorance, brand-default problem.
- **uxmagic.ai** — *Can AI Follow Design Tokens? The Honest Answer* — direct treatment.
- **Mageswari (Medium)** — *AI Design Systems: Why Tokens, Schema & Generative Rules Matter
  Now* — articulates the three-layer token architecture and the "semantic translator" AI
  needs.
- **W3C Design Tokens Community Group** — the canonical format spec.
- **Brad Frost (Atomic Design)** + **Nathan Curtis (design tokens layer-cake)** — foundational
  pre-AI work that the AI-failure analysis extends.

### The minimum AI-tolerant architecture

From the field consensus: **three-layer tokens** (primitives → semantic → component), not
two. Two layers is fragile under AI generation — the AI takes the easier path and hex-codes
escape. Three layers gives the AI a semantic name to grab (`color.action.primary` not
`blue.500`) so the token system survives generation.

### Cohort-aware scaffolding (added v0.20.x; aligns with v0.20 cohort-aware conscience)

The intervention *shape* varies per cohort (per `.boss/config.json` cohort declaration):

- `vibe-coder-newbie` / `first-product` — **SHOW**: scaffold a minimal `DESIGN_TOKENS.md` +
  one example component refactored. The teaching IS the intervention.
- `eng-builder` / `returning-founder` — **OFFER**: "want me to scaffold the three-layer
  token system now or later?" Skip the 101.
- `vibe-virtuoso` — **OVERRIDE-FRIENDLY**: "you know this; here's the override pattern."
- `indie-hacker` — **RIGHT-SIZED**: minimum portable system; no stack lock-in.
- `non-tech-founder` / `domain-expert` — **PLAIN-LANGUAGE COACH**: describe the failure
  that's coming if you don't do this; offer the fix.

## Aesthetic ambition — past the slop default (added v0.61.0)

> Adapted from Anthropic's own `frontend-design` skill, vetted into BOSS's practice shelf (RVW-014).
> The failure-mode catalog above is the *discipline* axis — don't drift. This is the *taste* axis —
> don't be generic. They are different failures: "the 47 blues" is drift; "AI slop" is genericness.
> A codebase can be perfectly token-disciplined and still look like every other AI-built app.

AI defaults to the mean of its training data, so unprompted it ships the same interface everyone
else gets: Inter or Roboto, a purple gradient, a centered card on a gray background, motion that
isn't there. It reads as *fine* on one screen and as *forgettable* by the third. Naming the slop is
half the cure — the founder has to *ask* for character, because the model won't volunteer it.

**The sharper framing (RVW-052): AI-default isn't just generic — it's *indistinguishable from every
competitor*.** When Tailwind shipped `bg-indigo-500` as a default, its own creator later apologized that
"every AI-generated UI on earth" went indigo — because the models all converged on the same shadcn/Tailwind
default. Ship that default and you ship something a user can't tell apart from the ten other tools they
tried this week. *Build faster ≠ build sameness.* The move: **spend the time the AI just saved you on the
~5% that's actually yours** — the brand, the voice, the one memorable thing — instead of banking the speed
and shipping the mean. That 5% is the whole distinctiveness pass below; it's where the saved hours should go.

**The load-bearing line:** *intentionality, not intensity.* Both bold maximalism and refined
minimalism work — what fails is the absence of a decision. For a first-time founder, **minimalism
done precisely is the safer bet than maximalism done loosely** — restraint hides fewer mistakes.

**A design-thinking pre-pass, before the first UI prompt** (one paragraph, not a document): who is
this for, what should it feel like, and what's the one thing that should make it memorable? Feed
that — not "make it look good" — into the prompt. (It's the same brand-anchor move the failure-mode
catalog prescribes for "rudimentary first design," pointed at taste instead of tokens.)

Five dimensions worth a deliberate choice (each is a prompt instruction, not a vibe):

| Dimension | The generic default to escape | The intentional move |
|---|---|---|
| **Typography** | Inter / Roboto / Arial, one weight | A distinctive pairing chosen for the product's tone; weight + scale as hierarchy |
| **Color & theme** | Purple gradient; timid mid-grays | One committed palette in CSS variables; a dominant color with sharp accents |
| **Motion** | None, or easing on everything | A few high-impact moments — staggered load reveal, scroll-triggered — not motion-everywhere |
| **Spatial composition** | Centered card, even grid | Asymmetry, overlap, diagonal flow, deliberate grid-breaks |
| **Visual detail** | Flat fills | Gradients, texture, atmosphere — *matched to* the aesthetic, not sprinkled on |

**The restraint that bounds the ambition (non-negotiable, even maximalist):** the failure-mode
catalog and the five-state requirement still hold. Accessibility (contrast, focus, reduced-motion),
the five states, and performance are floors, not trade-offs — a striking interface that fails
contrast or drops loading states is still broken. Ambition rides *on top of* the discipline; it
never substitutes for it. (This bound is the BOSS-specific adaptation; the source skill leans
maximalist, which is unsafe advice for a green founder.)

**Cohort-aware, same as the discipline axis:** `first-product`/`vibe-coder-newbie` can't yet *see*
the slop — SHOW them one before/after so the eye gets trained. `eng-builder`/`vibe-virtuoso` have
the eye but skip the pre-pass — OFFER the design-thinking prompt, skip the lecture.
`non-tech-founder`/`domain-expert` — translate "memorable" into their domain's language.

Lands at **V1**, with the rest of the design layer — the moment a UI is worth keeping is the moment
genericness starts to cost.

## Making the system visible — the design library (added 2026-08-20)

Everything above is markdown, and **markdown cannot show you a button.** `DESIGN_TOKENS.md`,
`STYLE_GUIDE.md` and `PROTOTYPES.md` are the right artifacts and all three are *unlookable*, which
leaves the question a founder actually asks — *"what do I already have, and does it still match what
I said?"* — with no surface that answers it. Most people need to see it to assess it.

`/design-library` (V1) generates that surface: one self-contained HTML library, no build step, no
service, no account.

**The load-bearing rule: generated, never authored.** The code is the source of truth; the library is
derived from it. A gallery authored *beside* the code is the two-sources-of-truth trap — the same
battle every design-tool sync loses, ending in two definitions of a button and a permanent
reconciliation problem.

> This also answers the question people ask first — *"how do I update it centrally so the change
> flows back to everywhere the component is used?"* **You don't, because you never had to.**
> `Button.tsx` *is* the button; every use site imports it; editing it updates all of them. That
> propagation isn't a feature to build — it's what a component already is. **The library's job was
> never propagation. It's visibility, reuse, and drift.**

**And it is not just components — the rule sets are half of it.** A library of components with no
principles, no rendered do/don't pairs and no terminology teaches both the founder and the agent that
design *is* components. It isn't; the rules are the part that survives a rewrite. Three sections:
foundations (tokens made visible), **rules** (principles with their tradeoffs, do/don't rendered side
by side, terminology, voice, the five-state table), components (every variant, all five states, with
gaps rendered *as* gaps).

**A rendered rule is a different object than a written one.** *"No unread-count badges"* in prose is
a sentence you skim; the same rule as two rendered examples is a thing you see. That's the SHOW
delivery the cohort guidance already prescribes, made structural instead of conversational.

Three consequences worth naming:

1. **Drift renders on the component, not in a report.** `/ux-check` writes findings to
   `docs/design/ux-check-*.md`; those files are correct and nobody opens them twice. A badge on the
   card — *off-token · missing state · near-duplicate · stale · unused* — puts the finding where the
   eye already is. A clean library is a page with no badges, which is a **positive** signal as much
   as a warning: it shows what you've built, not only what's wrong.
2. **The manifest is the reuse index the system never had.** *Reuse first, extend second, create
   last* has always been a prompt convention — a filter that depends on every future prompt
   remembering. `manifest.json` (name · purpose · import line · variants) gives the agent something
   to actually look at. And a **source hash per component** makes staleness mechanically checkable,
   which is the boundary the enforcement section below keeps asking for.
3. **Drift collapses from a three-way problem to a one-way one.** Implementation, style guide and
   prototypes look like three surfaces to reconcile. But if the library is *generated* from code it
   **is** the implementation, and if prototypes *compose* library components they are too. The only
   axis left is **declared rules vs. actual system** — one comparison, not three.

   ⚠️ **With a hard bound: that comparison only reaches as far down the ladder as you went.** A
   principle can't be diffed against code; a *rule* can. So the principle→guideline→rule ladder isn't
   only about making the agent actionable — **it's what makes drift detectable at all.** A principle
   that never descended into a rule is one you can never audit against.

### Retirement is the other half (added 2026-08-20)

The library flags ⚪ **unused** components. Say what to do about them, or the badge is trivia.

> **A component nobody uses is drift you're paying to maintain** — and worse, it's a decision the
> agent will keep re-encountering and re-applying. An unused variant isn't neutral; it's a wrong
> answer sitting in the reuse index where something looking for a pattern will find it.

This is the prototype registry's subtraction rule, one level up — *a discarded prototype is a
question already answered, and deleting its row means paying for the answer twice.* Same logic,
higher stakes, because a component ships.

It lands harder under AI generation than it ever did for a human team: **components accumulate faster
than anyone prunes them** (that's the billion-line drift failure mode, seen from the other end). The
generation side of that has been documented since v0.20.x. The pruning side never was.

The founder-scale version is one habit, not a process: **when the library shows unused, delete it in
the same pass.** Not a deprecation window, not SemVer, not an RFC — those are real for teams with
consuming teams, and unearned ceremony for one person. Just: it's dead, and you can see that it's
dead, so remove it while you're looking at it.

### The designer seam

The library is also the handoff artifact, already built: a designer gets a **URL, not a repo
checkout.** Two seams, in order of how real they are:

- **Tokens are genuinely two-way.** They're structured data with stable IDs, which is why this is the
  one layer where design-tool sync actually works — and why emitting **DTCG** (above) is already the
  bridge. Push to the tool's variables, pull their edits back.
- **Components are one-way, each direction, by a different mechanism.** Design→code mapping is
  mature. Code→editable-design-file round-trip is **not** well established; treat any claim that it
  is as unproven until you've watched it work on your own components.

If the host offers a design-system pane, the library's `@dsCard` markers mean it uploads as cards for
free. **Don't build a sync engine or a hosting surface** — that's the host's job, and building a
second one is how this discipline becomes the thing it exists to prevent.

## The principle (PRINCIPLES.md #3)

Style is reusable structure, so it must not get buried in implementation. Extract it into a
**single source of truth** the app *and* prototypes both consume. The test: could a prototype or a
sibling project reuse this design approach without copy-pasting component code? If not, it's locked.

## What the design layer establishes

1. **Design tokens — one source of truth.** Color, type, spacing, radius, elevation, motion as
   named tokens (`DESIGN_TOKENS.md` + a machine format the code imports). Code references token
   names, never raw values. Renaming/retheming happens in one place.
2. **Style guide.** How the tokens compose into patterns: components, states, density, voice. The
   "why," not just the "what."
3. **Central style utilities.** Shared helpers for recurring decorated elements (badges, pills,
   chips) live in one util with a colour budget — never ad-hoc per surface. (dhun: `badgeStyles.ts`,
   pill governance, 4-colour ceiling per surface.)
4. **Five-state requirement.** Every component specifies default / hover / active / disabled /
   empty (and loading where relevant). Missing states are the most common drift.
5. **Prototype reuse.** Prototypes import the *same* tokens and are listed in a registry
   (`docs/design/PROTOTYPES.md`), so a mockup looks like the product and graduates to code cleanly.
   (dhun: prototype `REGISTRY.md`.)

   > **This is what makes the rich-reference ladder safe.** `/spec` now says an executable artifact
   > beats prose — a crude HTML mockup outperforms three paragraphs about the layout. True, and it
   > carries a hazard: **a mockup that doesn't consume your tokens is worse than prose.** Prose is
   > obviously incomplete, so the implementer fills the gaps from the design system; a mockup is a
   > *confident, complete-looking answer*, so the implementation reproduces it faithfully — raw hexes
   > and all. **An off-system mockup injects the 47 blues at spec time**, before a line of product
   > code exists, with the authority of something you can see. So: a prototype imports the tokens, or
   > it is labeled a throwaway sketch. Both are fine; a mockup that *looks* like a decision and
   > silently isn't is not.
   >
   > The registry's second job is subtraction: **a discarded prototype is a question already
   > answered**, and deleting its row means paying for the answer twice.

## Authoring your design principles (added 2026-08-11)

Founders are told to "have design principles" and produce a list of words nobody consults. The fix is
a **three-level hierarchy**, because each level does a different job and only the last one is
enforceable:

| Level | What it is | Example | Who it steers |
|---|---|---|---|
| **Principle** | a direction that *contains a tradeoff* | *"Calm over engaging."* | you, in an argument |
| **Guideline** | how to approach the principle | *"Notifications are opt-in and batched daily."* | you and the agent, in a decision |
| **Rule** | a direct, checkable instruction | *"No unread-count badges. No red dots."* | the agent, and a lint rule |

> **The test for a principle: could a reasonable person argue the opposite?** *"Be delightful"* fails
> — nobody argues for undelightful, so it decides nothing. *"Calm over engaging"* passes, because
> "engaging" is a real thing you're giving up. **A principle that can't lose an argument isn't a
> principle; it's a mood.** (Same shape as `/decide`'s falsifier and BOSS's own `PRINCIPLES.md`.)

**The three levels are a ladder from taste to enforcement, and that's why it matters here.** An agent
cannot act on *"calm over engaging"* — it has no way to check itself against it. It *can* act on
*"no unread-count badges."* So if you want AI-generated UI to carry your design intent, **you have to
get down to rules**, and the rules are the artifact the model actually consumes. Principles that never
descend into rules are decoration.

Three to five principles, maximum. A dozen is a list nobody remembers, which is the same as none.

## Iterating on design (added 2026-08-11)

The first output is always a draft — the model returns the mean of its training data, and the mean is
the slop. Iteration is where the distinctiveness pass actually happens. Four rules that make it
converge instead of wander:

- **Iterate on the artifact, not the description.** Change the mockup and look at it; don't write
  another paragraph of adjectives. This is the rich-reference ladder from
  [`harness-engineering`](harness-engineering.md) pointed at design — *an HTML mockup generally beats
  a description of the design or a screenshot of it.* Adjectives are where taste goes to die.
- **Vary one dimension at a time.** Type, or color, or spacing, or density — not three at once. Change
  three and you've learned nothing about which one worked.
- **Compare in parallel, don't refine in series.** Generate three variants and pick, rather than
  saying *"make it better"* five times. Serial refinement **drifts toward the mean** (each pass
  re-averages); parallel comparison forces an actual decision, which is the one thing the model can't
  do for you.
- **Have a stop rule.** Stop when the next change isn't visible to someone who isn't you. Design
  iteration has no natural terminator, and "one more pass" is how a week disappears.

> **Re-check the states after heavy iteration.** The same degradation
> [`agent-security`](agent-security.md) documents for code applies here: each pass over the same file
> can quietly drop what an earlier pass established — and **empty and loading states are the first
> casualties**, because they're invisible in the screenshot you're staring at. The five-state
> requirement is not one-and-done; re-run it after a redesign, not just at first build.

## Enforcement — just-in-time

> **A prompt convention is a filter; a check in the harness is a boundary.** The failure table above
> prescribes *"reference tokens by name in every prompt"* — worth doing, and **not** a boundary: it
> depends on every future prompt remembering. The same lesson [`agent-security`](agent-security.md)
> took from CVE-2026-22708 applies to design — *bound the capability, don't enumerate the route.* The
> thing that actually stops the 47 blues is a check that **fails on a raw hex**, not a sentence asking
> nicely. Ship the convention; know it's a speed bump; put the hook in as soon as the UI is worth keeping.

- **Quickstart / MVP:** no design enforcement. Hardcoded styles in a throwaway are fine; don't
  impose ceremony unearned. But the *moment* a UI is worth keeping, create the tokens file so style
  is decoupled from the very first commit that matters.
- **Cohort-scope the content layer, don't hand everyone the matrix (RVW-077).** Ship the
  **checkable** content rule (terminology) to everyone; ship the **judgment-shaped** ones (voice
  traits, tone-by-context) only to founders with enough product to judge against. A green founder
  cannot yet tell *"plain over clever"* from *"friendly over formal"*, and a table filled in because
  it was asked for steers nothing. Content discipline arriving before there is copy to be
  inconsistent about is PRINCIPLE #2's premature ceremony wearing a design-system hat. The one
  inversion: in **high-stakes domains**, how the product speaks when it is *uncertain or wrong*
  outranks vocabulary consistency — tone first there.
- **The moment a terminology table has real rows (MVP):** `content-terminology-guard` — the content
  layer's only boundary, and deliberately its only one. **Voice and tone cannot be regexed and the
  hook doesn't pretend otherwise**; terminology can, because it's a word list. It watches the
  *strings the UI shows* — never identifiers, imports or paths, per the style guide's own rule that
  the product says `team` while the code can say whatever it likes. Everything else in the content
  layer is a filter, shipped as a filter, and named as one.
- **The moment tokens exist (MVP):** `design-tokens-guard` — a `PostToolUse` hook that catches a
  hardcoded hex / `rgb()` / palette class the instant it's written and hands the model your token
  names instead. **Ships dormant at L1 and is offered once by `/design-tokens-init`**, because the
  tokens file is the opt-in signal: *no token system, no opinion.* This is the boundary the note
  above asks for — the check that doesn't depend on the next prompt remembering.
- **MVP:** `designer` unlocks, with `/design-review` before code and `/ux-check` after — moved
  down from V1 in v0.189.0 (DEC-005). AI-generated UI nails the happy path and skips
  empty/loading/disabled/error, and that lands the first week someone builds a screen.
- **V1:** the enforcement that needs a real component set to exist first — `/design-library`
  rendered from the code, and `design-drift-loop`.
- **Scale:** design drift audits, token versioning, multi-surface theming.

## Shipped (this section was a TODO until 2026-08-11)

Everything the V1 design layer needed now exists — the list below was carried as *"to author"* long
after it was built, which is exactly the rot the build-craft watchlist predicted for this doc:

- ✅ `/design-review` (before code) · `/ux-check` (after code) · `/design-tokens-init` (L1, at the
  first UI commit) — the latter **writes** `docs/design/DESIGN_TOKENS.md` at runtime, which is right:
  tokens are project-specific, not template-shippable.
- ✅ `designer` — both halves in one agent (visual system + flows/states). Superseded the
  `ui-designer`/`ux-designer` split in v0.189.0; BOSS had been shipping a two-agent split while
  running a single designer itself.
- ✅ `docs/design/STYLE_GUIDE.md` — **written by `/design-tokens-init` from v0.146.0.**
  ⚠️ **Correction:** v0.144.0's version of this list claimed the style guide already shipped. It did
  not. `docs/design/` was an **empty directory**, and `STYLE_GUIDE.md` was **read by three consumers**
  (`/design-review` and the designers, as they were then named) and **written by nothing.** The stale-TODO fix
  introduced a false ✅ in the same pass that warned against exactly that — *"converting a stale TODO
  into a clean ✅ would have hidden the one gap that matters."* It hid a different one. **A checklist
  is a claim; verify each line against the filesystem, not against the doc it came from.**

- ✅ `design-tokens-guard` — the hardcoded-style hook (shipped v0.145.0, dormant at L1, offered by
  `/design-tokens-init`). It was the one gap that actually mattered: the doc prescribed a boundary it
  didn't provide.
- ✅ `docs/design/PROTOTYPES.md` — the prototype registry (v0.146.0), with the token-consumption rule.

- ✅ `/design-library` + `docs/design/library/` — the visual surface, the rendered rule sets, the
  reuse manifest and the source-hash staleness check (v0.166.0).
- ✅ The content half — Do/Don't pairs, a terminology list, voice-vs-tone with real strings, inlined
  into `CLAUDE.md` (v0.167.0) — and `content-terminology-guard`, the one boundary it can have
  (v0.168.0). **Shipped in the same pass that claimed it was possible**, because this doc has twice
  described a mechanism it didn't provide (the prompt-convention-as-boundary, then
  `design-drift-loop`'s overstated predicate). A third time would have been a pattern, not a slip.
- ⚠️ **Corrected in the same pass:** `design-drift-loop.md` claimed it watched *"near-duplicate
  components multiplying"* and a staling tokens file. Its predicate is a single hex regex over
  `src/**` and always was. **A predicate is the claim; prose must not exceed it** — a loop doc that
  overstates what it catches is worse than one admitting a gap, because the founder stops looking for
  the failure it silently isn't catching. This is the third doc-vs-filesystem mismatch found in this
  practice's history (after the stale TODO list and the `STYLE_GUIDE.md` false ✅). **The pattern is
  now unmistakable: this doc's claims rot faster than its ideas.** Verify each line against the
  filesystem every sweep.

**Nothing on this list is open.** Verified against the filesystem, not against this doc.
