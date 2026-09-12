---
id: PRACTICE-design-system
type: practice
owner: designer
status: active
host: stack-neutral
provenance: the AI-design-review ceiling (feedback/scannability move, flow efficiency does not) added 2026-08-24 from RVW-092 (UXBench, arXiv:2606.16262 — preprint, direction only) · generalized from the dhun dogfood design system (DESIGN_TOKENS as single source of truth, central badge/pill style utils, the "no raw Tailwind colors" enforcement hook, the prototype REGISTRY), de-dhuned for reuse — BOSS v0.20.x. The AI-failure-mode catalog was added in the same pass; IDEA-010 carries the BOSS-specific design (loops, cohort-aware scaffolding, prompt patterns). Frontmatter added 2026-07-30 (v0.135.0) — this doc predated the practice frontmatter convention, which is why no refresh discipline could see it.
provenance_public: The limits of an AI-run design review — it reliably improves feedback and scannability, and barely moves whether the flow itself is right — come from UXBench (2026), read as direction rather than magnitude. Generalized from a dogfooded design system — design tokens as the single source of truth, central badge and pill style utilities, an enforcement hook that rejects raw framework colors, and a prototype registry — then stripped of everything product-specific so it would transfer. The AI-failure-mode catalog was written in the same pass.
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
| **Pattern reinvention** | Each new component is a new file. `Button.tsx` → `CTAButton.tsx` → `PrimaryButton.tsx` — all near-identical. AI doesn't search for the existing pattern. | **A component index the agent opens** (`docs/design/COMPONENTS.md`, MVP) — retrieval, not recall. The prompt convention *"search components/ for similar"* is the filter this replaces; it held only while every future prompt remembered. |
| **Billion-line drift** | Code grows linearly with screens instead of approximately constant after primitives are built. AI never generalizes across requests. | Token system + reuse-first prompting *together*. Either alone is insufficient. |
| **Missing states** | Default/hover/active/disabled/empty/loading — at least one always missing. Especially empty + loading (the most user-facing failures). | Five-state requirement enforced at prompt level — name the states before AI gets a chance to skip them. |
| **Brand-default problem** | AI defaults to generic-internet aesthetics because that's the training data. Your brand voice never makes it in unless you bring it. | Canvas Promises cell becomes the design brief, not "make it pretty." |

### What an AI design review catches — and what it structurally doesn't (added 2026-08-24)

The catalog above is what AI gets wrong when it *builds* UI. This is what AI gets wrong when it
*reviews* it — because the obvious fix for the table above is "have the model review its own work,"
and that fix has a measured ceiling.

**The shape of it:** an LLM UX critique reliably improves **action feedback** and **scannability** —
the missing loading state, the buried confirmation, the wall of undifferentiated text. It moves
**flow efficiency** by almost nothing. Whether the *sequence of steps is wrong* — whether the person
should have been asked this at all, whether two screens are one screen — survives the review intact.
The same work also found no model that leads across surface types: strength on a chatbot surface
predicts nothing about strength on a pricing page.

Two consequences, and they are the whole point of writing this down:

- **Don't read a clean design review as a validated flow.** It is evidence about states and
  legibility. It is close to no evidence about whether the flow is right. That judgment is still the
  founder's, and it is the expensive half.
- **A review is worth what someone can repair from it.** The useful question about any critique —
  human or model — is *could a competent implementer act on this without asking a follow-up?* A
  finding that names the file, the state and the honest version is worth ten that name a heuristic.

⚠️ **Grade this as direction, not magnitude.** The source is a June 2026 arXiv preprint (UXBench,
Wang et al.), not peer-reviewed; its absolute effects are small and its headline metric is scored by
another model. The *relative* pattern — feedback and scannability move, flow doesn't — is the part
worth planning around, and it matches what BOSS already ships: `/design-review` and `/ux-check` are
both **checkers**, and no amount of checking produces a flow nobody designed.

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
| **User-facing strings live in one place** | extracting them later touches every screen ever generated | no — it's a habit, not a library |
| Motion, theming, density, versioning, a component library | cheap to add when earned | **yes — defer** |

**The strings row is the content half's version of component boundaries**, added v0.291.0 and easy
to mistake for premature i18n. It is not: **the seam is one habit — user-facing text comes from one
place rather than being typed inline — and it is emphatically NOT a localization system.** No locale
files, no pluralization rules, no translation pipeline until a second language is something a real
person has asked for. The asymmetry is the familiar one: the habit costs nothing at seed, and
retrofitting extraction across every screen an agent has generated is a rewrite. It also compounds
with the terminology table, which only becomes *mechanically* true — one word per concept — once the
strings are in one place to check.

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

### The tells move — a dated list, or last year's list (added v0.299.0)

**The anti-slop catalog above was a 2024 list, and the fix it prescribed became the 2026 tell.**
Found by running `/comp-eval` on Anthropic's own `frontend-design` skill (Apache-2.0, read at source
2026-09-11 — `docs/competition/frontend-design.md`): the "shadcn trap" (slate, Inter, 8px, indigo) was
what generated UI converged on in 2024, and BOSS's first override — *warm the neutral scale* — is now
the single commonest tell: **warm cream + high-contrast serif + terracotta.**

> **The tells are not a list. They are the current attractor**, and the attractor moves as the models
> and the prompts do. Any anti-slop catalog needs a **date and an owner**, or it quietly becomes a
> catalog of last year's tells — worse than none, because it reads as current.

**Current as of 2026-09** (the five, per `frontend-design`, quoted with attribution): warm cream +
serif display + terracotta · near-black + acid green or vermilion · the broadsheet (hairlines, zero
radius, dense columns) · the SaaS-card kit (identical rounded cards, one radius everywhere, the same
`rgba(0,0,0,.1)` shadow, gradient washes) · template chrome regardless of subject (ALL-CAPS eyebrows,
`A · B · C` middle dots, spaced em dashes, tinted near-black for black, mono data labels, `→` on every
link). **The live copy is in `/design-tokens-init`'s distinctiveness pass, stamped; this section
records the rule and the date.** Two copies is a known cost; the stamp is what makes drift visible.

**How it stays current — and why the previous sweep failed to notice it wasn't.** The 2026-08-11
sweep declared this catalog *"confirmed current by the sameness literature"* while it was a 2024
list. The literature was right about the *principle*; it cannot see the *instance*, because every
tap it used writes about sameness and none observes what gets generated. **A tap that confirms the
principle cannot be trusted to refresh the instance.** The watchlist now carries output-observing
taps (§7b — the tools' own maintained lists read as a diff, framework defaults, practitioners found
fresh each sweep, and BOSS's own projects once there are any) and fires on **the model curve, not
the calendar**: a new frontier model is what moves the attractor, so it is the event that re-opens
this list.

**The genericness test** (also from `frontend-design`, and the best single idea in it): before
building, *would this exact plan have been produced for any similar brief?* Swap the product for a
neighbour in the same category; whatever survives the swap unchanged is a default, not a choice. It is
a filter — but it is the one filter that makes *sameness* visible to the model that produced it.

### The field, read together — the index is being host-shipped and the detector exists (added v0.307.0)

Nine design-system tools read at source on 2026-09-12 (`docs/competition/design-system-tooling.md`),
and three things changed what this practice says:

1. **The rendered-output check exists; don't build it, point at it.** `impeccable` ships 61
   deterministic tells that run against a live page — contrast, overflow, touch targets, skipped
   headings, design-system drift — with no API key. `/ux-check`'s *"not checked — needs a rendered
   page, and say what would run it"* now names it. BOSS's four hooks stay what they are: the
   source-level, token-vocabulary half. The arithmetic half of accessibility and the *rendered*
   half of drift are somebody else's maintained list, and that is the right place for them.
2. **The generated component index is host-shipped at V1 for the big three frameworks.** Storybook
   MCP's `docs-list` is `design-library`'s manifest, made by the code's own tool. `/design-library`
   now defers to it where present and keeps what Storybook cannot render — the rule sets and drift
   shown on the component. The MVP-rung authored `COMPONENTS.md` is unaffected: it exists for
   component two, before anyone has installed Storybook.
3. **Founders now arrive carrying a design system.** impeccable writes `PRODUCT.md` + `DESIGN.md`,
   ui-ux-pro-max writes `MASTER.md`, Google's spec claims `DESIGN.md` in a different format. Step 0
   of `/design-tokens-init` looks for all of them and treats a hit as prior art — the alternative is
   the second-system failure step 0 was written to prevent, arriving from outside.

And one thing that did *not* change, now with evidence: the most-starred design skill in the field
(★127k) sells **palettes by industry** — the attractor as a product. **Values blank until earned** is
the contrarian position in this market. Hold it, and say so when a founder asks why BOSS did not
just pick them a palette.

### Craft floors and brand values are different kinds of thing (added v0.299.0)

*Name the slot, earn the value* is the composition layer's governing rule, and `frontend-design`
exposed where it overreaches. That skill hands over *line length under 80*, *one family or two,
clearly distinct*, *serif gets more line-height* on turn one — and it is right to, because those are
not decisions. They are **floors**: true for almost every product, known to the craft, and
withholding them is withholding a fact.

| | Floor | Value |
|---|---|---|
| What it is | craft knowledge | a decision |
| True for | almost every product | this product |
| Ships as | **pre-filled** | **blank until earned** |
| Example | measure under ~80 characters | *which* typeface, *what* ratio |

The composition slots now carry both — a `Floor (pre-filled)` line and the empty value lines
beneath it. Bringhurst is the reference for the typographic floors; `frontend-design` is where BOSS
took the short form. **The rule survives sharper than before:** a slot can carry its floor and leave
its value empty, and a founder who fills the floor line with a value has confused the two.

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

### Brand is upstream, and it is not ours (added v0.288.0)

🔴 **The defect:** `docs/design/BRAND.md` had **three readers** — `/landing`, `/pretotype` and this
skill's brand-anchor step — and **nothing that wrote it or offered to.** `/landing` degraded honestly
(*"never invent a brand the founder didn't choose"*) and then handed the founder no way to close the
gap. Same family as the `STYLE_GUIDE.md` failure, and it survived longer for a structural reason:
**its readers were in different lenses from the writer that did not exist**, so no discipline-scoped
check could see it.

**Two corrections, and the first is a path.**

1. **It moved to `docs/BRAND.md`.** Filing it under `docs/design/` made it the designer's, and it
   isn't. Brand is upstream of design — the accent colour and the voice in a button trace back to it,
   and so do the landing page, the pitch, the first email and the words in a sales call. Ajesh:
   *"brand should be part of marketing, not design — more under the entrepreneur lens, and
   independent, but it can be developed from any."* **Any lens may grow it; none owns it.**
   **And brand is not marketing either** — marketing is what you *do* with a brand, downstream, with
   its own artifacts. Collapsing the two is how a brand doc becomes a landing-page brief and stops
   being read by everything else.
2. **It is living, and starts nascent.** *"Brand starts early MVP but stays nascent, keeps learning,
   then grows."* So it has `/idea`'s shape — a current shape that sharpens, and an **append-only
   capture log** whose rows are things that actually happened (a phrase a user used, a comparison
   someone made unprompted, a word that got a blank look). **Rows come from `/interview` and
   `/research`, never from brainstorming.** The failure mode to refuse is a complete-looking brand
   document written on day one from imagination, which everything downstream then faithfully obeys:
   *a confident answer arrived at with no information is worse than a blank, because a blank invites a
   question and a confident answer ends it.*

**Seeded by whoever needs it first**, which is not one skill on purpose — a shared artifact with one
owning skill becomes that skill's artifact, and the other lenses stop writing to it.

### The invariant that would have caught it (added v0.288.0)

`scaffold.test.js` had *"every design doc a consumer reads is a design doc some skill writes"* — and
it could not see this, because `BRAND.md`'s readers were not design skills. **The class is "a shared
artifact with readers and no origin", and it is not a design problem.** The test is now repo-wide
across every stage: any `docs/**/SHOUTY.md` named by any skill or agent must either **ship as a
template file** or be **written by some skill**. It watches 17 shared docs today.

Two things it taught immediately, both worth keeping:

- It flagged `TRUST.md`, whose skill *did* write it under a heading that said `## Output` and never
  said *writes*. **A heading is not a declaration** — the fix was one sentence in `/trust`.
- The first version of its regex excluded `.` from the match window, so a sentence naming two
  filenames could never match, because `PRIVACY.md` ended it. **A test that cannot express the
  artifact it checks will pass for the wrong reason.**

### Composition — the layer between tokens and a page (added v0.286.0)

Tokens say what a colour *is*. Components say what a button *is*. Patterns say what to do in a
*situation*. **Nothing said what a page is** — and that is the difference between an interface that is
*consistent* and one that looks *designed*. It is also the gap a founder feels without being able to
name it; Ajesh's own list arrived as three separate-sounding topics — typography, layout, materials —
that turn out to be one hole.

**It did not need a new artifact.** `STYLE_GUIDE.md` has always described itself as *how the tokens
compose*; it was missing three of its four slots and carried the fourth as three blank lines. So this
completes a document rather than adding one, and **subtracts** the thin *Density & rhythm* section into
the slot that supersedes it.

| Slot | The question it makes noticeable |
|---|---|
| **Type roles** | which faces, when, why — and *how many roles does this product actually have?* Most need two, not four; more roles is the commonest way a young interface starts looking unresolved |
| **Rhythm** | the base step, the steps actually used, the measure, the container, the density |
| **Surface language** | border · shadow · fill · space alone · nothing — **which one is primary**, not which ones exist |
| **Hierarchy** | size · weight · colour · space · position — and *in what order*, everywhere. The slot that most decides whether it looks designed |

**The rule that shapes all of it: name the slot, earn the value.** The founder's own framing —
*"we're not trying to lock it in, but helping one emerge"* — has a concrete consequence here: **this
layer must not ship a type scale.** A ratio handed to someone on day one, when they know least, is
lock-in wearing a best-practice hat. A named blank is not a gap; it is a decision that exists whether
or not anyone looked at it, made **noticeable**.

**And the slots get filled by reading, not by asking.** `/design-review` step 4a looks at what is
already built and says what the product *appears to have decided* — marked **`observed`**, which is a
description the founder can still change their mind about, as distinct from **`declared`**, which is a
decision to defend. Graduating a row from one to the other is the founder's act. **An inconsistency
found while reading is the most useful output** — *"everything is a border except one shadow"* has two
honest resolutions, and the second (*"border, and shadow for things that float"*) is usually right and
never written down.

### The definition layer is now surface-gated (added v0.286.0)

🔴 **The finding that occasioned it:** `/design-review` and `/ux-check` branch on `shape` from
`.boss/config.json`. **`/design-tokens-init` and `/design-library` never read it** — every `shape` in
those files is the English word. So BOSS *built* a three-layer colour cake and an HTML component
gallery for founders whose surface is a terminal, and then correctly *refused to review it*.

**Building a system for a surface you will not review is the ceremony Principle #2 exists to prevent**,
and it is the same bug `/design-review`'s own Step 0 records fixing for itself — *"`/ux-check` has
always done this and this skill never did."* **The fix was applied to one skill and never asked of its
neighbours**, which is the generalizable half: when a skill fixes a class of bug, the next question is
which of its siblings has it.

The split the gate uses was already written down; it just wasn't applied where the system is built:

- **Universal, every surface:** hierarchy · contrast · the five states · one word per concept · error
  copy that says what to do next · reuse before creation.
- **`cli`/`dev-tool`:** no colour cake — colour is a *capability that may be absent* (`NO_COLOR`, a
  pipe, a CI log), so it can never carry meaning. Still write the style guide: terminology, voice, the
  five states in CLI form, and hierarchy as *what the eye finds first in a wall of text*. **A real
  design system that isn't a visual one.**
- **`agent`/`chatbot`:** the surface is the transcript, so the content half is the whole system.
- **`mobile-app`:** the slots hold; the units and mechanics don't (pt/dp, Dynamic Type reflow, safe
  areas, touch targets).

### Reuse, adjust, or new — the decision that actually happens (added v0.285.0)

*Twice is a pattern* governs **promotion**, and promotion is rare. The decision that lands **every
time something gets built** is narrower and was never named:

> **Given this already exists and my need is eighty percent of it — do I reuse it, adjust it, or
> make a new one?**

The shipped rule was an *ordering* — *reuse first, extend second, create last* — which tells you the
preference and not the test. And the ordering loses to a structural fact about generation: **writing
a new file is easier than reading an existing one and widening it**, so *create* is the path of least
resistance and the default silently lands there. The cost arrives later, one reasonable-looking
decision at a time: `Button`, `CTAButton`, `PrimaryButton`.

**The test is the job, not the look.**

| What you have | The answer |
|---|---|
| same job, different look | a **variant** — a prop, not a file |
| same job, slightly different need | **widen** the one that exists |
| different job that happens to look alike | genuinely **new** — `Chip` and `Badge` can be pixel-identical and still be two things, because one is interactive |
| two existing things doing the same job | **reconcile** — the fourth answer, and the one that gets missed. Propose the merge; the blast radius is the founder's call |
| can't tell | **variant.** Forking is cheap now and expensive forever; extending is slightly expensive now and free forever |

**The asymmetry is why this earns a boundary rather than a rule.** A model optimizes for now, because
now is the only thing in its context. `component-reuse-guard` fires when a component-shaped file is
written whose name has no row in the index, hands over the rows it should have been compared against,
and asks the three-way question. It fires **once per new component name** — never on an edit to a
known one — which is what keeps it usable.

**It also closes the honest weakness the index shipped with.** v0.276.0 said so plainly: *at MVP the
index is authored, so it can go stale, and nothing catches a component created without its row — a
better filter, not yet a boundary.* This is the boundary, and it arrived because a founder named the
pain (*"sometimes vibe coding can go really wild"*) rather than because the gap was on a list.

### Promotion has a threshold; so does demotion (added v0.283.0)

Retirement above is about **artifacts** — a component nobody imports. This is about **rules**, and it
is the half that decides whether a design system helps a design emerge or quietly locks it in.

The system knows how to add. *Twice is a pattern* promotes a recurring decision into a rule. What it
had no way to do was **take one back** — and a system that only ratchets tighter is lock-in no matter
how emergently each individual rule arrived.

The data was already being collected and never read: `STYLE_GUIDE.md`'s **Exceptions** table. The
discipline around it was right (*an exception recorded is a decision; an exception unrecorded is
drift*) and incomplete, because nobody ever asked what a *repeated* exception means.

> **Three exceptions to the same rule means the rule is wrong, not that you have three exceptions.**
> A rule with three standing exceptions is not being followed — it is being worked around, and the
> working-around is the real convention now.

Same threshold as promotion, pointed the other way. Narrow the rule, split it, or retire it.

**The general form, which applies at every layer:**

| Layer | Promotes when | Demotes when |
|---|---|---|
| Pattern | the same decision comes up twice | nothing cites it · three exceptions against it |
| Component | it is used in more than one place | nobody imports it (⚪ unused → delete in this pass) |
| Token | a value recurs with a meaning | nothing references it |
| Principle | it survives being argued with | it is contradicted more often than it is applied |
| Rule in the style guide | a review keeps re-deriving it | **three exceptions of the same kind** |

**Why this is the load-bearing half of an emergent system, not a tidiness feature.** The founder's
own framing: *design is constantly emerging; we are not trying to lock it in, but as it develops,
keep establishing the norms so it can be reused and remembered.* Both clauses need a mechanism. BOSS
built the *establishing* half thoroughly — indexes, patterns, an extraction loop — and the *not
locking it in* half was a sentence of intent with nothing behind it. **The seed-that-scales test
already governs what to decide EARLY; this governs what to un-decide LATER**, and a system with only
the first is a system that gets more confident as it gets more wrong.

**Where it fires:** `/design-review` step 4c, at the moment an exception is about to be recorded —
which is the strongest place for a filter, because it is the instant the decision is being made and
the evidence is already in hand. **Not a loop.** A loop over exception counts is buildable and is not
yet earned: no project has an exceptions table with three rows in it, and building the watcher before
the thing it watches exists is the premature ceremony this practice keeps warning about.

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
  From v0.276.0 it also writes **`docs/design/COMPONENTS.md`** — the authored component index, plus
  the *build the button, then use it on the page* rule inlined into CLAUDE.md. The rung is the
  argument: the two most expensive failures in the catalog above both begin at **component number
  two**, and the index that prevents them had been shipping at V1 (IDEA-091 part 1).
- **V1:** the enforcement that needs a real component set to exist first — `/design-library`
  rendered from the code (it **generates over the MVP index's shape and supersedes it**, never beside
  it), and `design-drift-loop`.
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
  didn't provide. **Widened to all five token families in v0.277.0** — it had enforced *one of five*
  (color) while the tokens file defined color, spacing, type, radius and elevation, so four families
  were prose calling itself a system. The gate that keeps the four quiet is the JIT rule applied per
  family: **no named tokens for a family, no opinion about it** — you cannot ask an agent to use a
  name that does not exist. Color stays unconditional; weakening a shipped boundary to generalize it
  would be a bad trade. Spacing is deliberately the narrowest pattern in the file (CSS declarations
  and Tailwind *arbitrary* values only — never `p-4`, which IS the scale; never `0` or a hairline),
  because **a guard that cries wolf gets turned off, and a guard that is off is worth less than no
  guard, since the founder believes it is on.**
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

- ✅ `docs/design/COMPONENTS.md` — the component index at **MVP** (v0.276.0), with the
  component-boundary rule in CLAUDE.md. Closes the layer this practice had been describing as a V1
  concern while naming its failures as week-one ones. **Honest scope: authored, therefore a filter** —
  a component created without its row is not caught by anything. It becomes a boundary at V1 when
  `/design-library` generates it with a source hash. Said here so the next sweep does not have to
  rediscover it.
- ⚠️ **Corrected in the same pass (the fourth doc-vs-filesystem mismatch in this practice's history):**
  `stages/L2-v1/template/claude-append.md` — which is appended to the founder's own CLAUDE.md and read
  on every turn — still carried the `design-drift-loop` overstatement (*"near-duplicate components,
  tokens-file-untouched-while-components-grow"*) that the loop doc itself corrected in v0.166.0, plus
  a *"(Future: PostToolUse hook … lands in v0.23)"* for a hook that shipped in v0.145.0. **The
  correction landed in the loop doc and not in its twin.** When a claim is corrected, grep the string —
  the same sentence is usually in two places, and the copy in always-on agent context is the one that
  matters most.

- ✅ `docs/design/PATTERNS.md` — **the pattern layer** (v0.278.0), born in the first
  `/design-review` and grown one review at a time. The middle of the ladder: a token is a value, a
  component is a thing, **a pattern is a recurring decision with a rule** — and it is what Material
  and HIG mostly *are*. Read by `designer`, checked by `/ux-check`, rendered as do/don't pairs by
  `/design-library`. Threshold for a new row: **the same decision comes up twice.**
  ⚠️ **Its honest limit is written into the template rather than papered over:** BOSS holds the
  five-state requirement, the content rules and the AI-interaction patterns — it does **not** ship a
  general-UI catalog (forms, tables, navigation) and should not pretend to. The `designer` agent's
  cited lens is the source for those, and the project grows better ones than a generic catalog would.

- ✅ **Design decisions route to `/decide`** (v0.279.0) — the brand anchor recorded as ONE
  `DEC-NNN`, not five and not zero. The five distinctiveness overrides are the most hard-to-reverse
  choices in the system (every use site changes on a retheme) and were being made in one conversation
  and written down nowhere readable as a *decision*. `designer` now argues against the record and its
  falsifier rather than against the current value, and `/design-library` renders *"chosen — DEC-NNN"*
  beside the swatch. **The bar for what earns a record is the seed-that-scales test already in this
  doc** — record it if reversing it gets more expensive as the app grows — so no new rule was needed,
  which is why this is a routing edit rather than a feature.

- ✅ `design-pattern-loop` — **PRINCIPLE #1 pointed at design** (v0.280.0). `extraction-loop`
  applies the UP/DOWN sort to the *work*; this applies it to the *design*, and it needed its own
  moment because the two breakpoints differ: the work's inflection is a devlog entry, the design's is
  a **review**. Predicate: three or more reviews exist and `PATTERNS.md` still holds no `PAT-N` row of
  the product's own — it has been thinking, and none of it stuck.
  **It counts reviews, not components, and the reasoning generalizes:** a predicate pointed at the
  component index would break at V1 when the manifest supersedes it (*a predicate that breaks on
  graduation is worse than none*), and components are not where patterns come from — a pattern is a
  recurring **decision**, and decisions happen in reviews.
  ⚠️ **The `capture` frame now branches on which loop fired.** Reusing the moment without branching
  voiced extraction-loop's *"read your devlog"* text at a design review — sending the founder to the
  wrong file, which is how a conscience moment teaches a founder to ignore it. Same fix the
  `coherence` frame already carried for the two design loops; **many-to-one moments need a branch, not
  just a shared name.**

- ✅ `docs/design/FLOWS.md` + the FEAT's **Flow** section — **the flow layer** (v0.281.0), authored
  in `/spec` rather than reviewed into existence. It is the one layer a checker structurally cannot
  give you, and this doc already said why: an AI review moves feedback and scannability and moves
  **flow efficiency by almost nothing** (UXBench, direction only). *No amount of checking produces a
  flow nobody designed*, so it is decided while the FEAT is still prose and changing it is free.
  **The mechanism is one column and one question: each step names what it asks the user for and why
  it is needed *now*, and a step that cannot answer is the step to cut.** Cut rows are kept — a
  question you decided not to ask is the decision most likely to be silently reversed. Three paths,
  not one (happy / first-run / failure) — the five-state requirement raised a level.
  ⚠️ **Stated on the artifact: there is no boundary here at any rung, and there is not going to be
  one.** Every other layer got a mechanism; this got a cheap format and a hard question. Saying so is
  the point — this practice's oldest failure is describing a mechanism it does not provide.
  `designer` and `/design-review` both now grade their own flow verdict as **the weakest thing they
  say**, because a clean review is evidence about states and legibility and close to none about
  whether the sequence is right.

- ✅ **The prototype seam** (v0.282.0) — `/prototype` looks for a design system before it draws one,
  and composes from it when one exists. It lives at Quickstart where there is usually nothing to
  find, and **silence is the correct behaviour there, not a gap**: sending a founder to build a token
  system before they can see their idea would invert the skill. The point is a speed-up, not a
  discipline — *copying is faster than drawing, and what you get is a preview of what will ship
  instead of a picture of something adjacent to it.* Every prototype is now labelled **on-system** or
  **sketch** in the file itself, because a mockup that looks like a design decision and silently
  isn't is the one artifact an implementation will reproduce faithfully, raw hexes and all.

**Nothing on this list is open.** Verified against the filesystem, not against this doc.
