---
id: IDEA-092
type: idea
owner: designer
status: shipped (every item built or explicitly refused, v0.286.0 → v0.292.0; see the close-out at the foot)
gist: After the eight-layer ladder was filled, the five things still missing that an advanced design system has — ranked, with the two that are decisions rather than gaps called out so they are not re-proposed.
program: design-system
proof: none
proof_note: a reassessment; each item names its own proof if it is ever built.
created: 2026-09-10
---

# IDEA-092 — what an advanced design system still has that BOSS doesn't

> Seed: Ajesh, 2026-09-10, immediately after [[IDEA-091]] shipped all seven parts — *"lets go back
> and reassess what is missing from this list that could be great for an advanced design system."*

Every claim below was grepped against the tree before it was written, because this program's history
is four releases of *a claim outliving its mechanism* and a reassessment is the easiest place in the
world to add a fifth.

## First, the two that are DECISIONS, not gaps

Both looked like gaps on the first pass of this reassessment. **They are not, and re-proposing them
is a waste of a future session.**

**Motion · theming · density · versioning · a component library.** `design-system.md`'s
seed-that-scales table defers all five explicitly — *"cheap to add when earned."* That reasoning is
sound: they are the row where deferring costs nothing, which is the whole point of the test. Density
already has a slot in the style-guide template, and versioning was separately refused in [[RVW-080]]
(Curtis's context is multi-team enterprise; a solo founder has no consuming teams).

> 🔷 **The one question worth holding, and it is a question and not a finding:** dark mode is the case
> most likely to test *"cheap to add when earned."* It is cheap **if the semantic layer is honest** —
> and a semantic token named `color.surface.background` pointing at `gray.100` is a light-mode
> assumption wearing a semantic name. If a real project ever pays a retheme, that is the evidence,
> and the fix is a sentence in the token guidance, not a theming system.

## The five real ones, ranked

### 1. Contrast is arithmetic, and BOSS treats it as unknowable 🔴

**The sharpest one, because BOSS both claims it and disclaims it, in shipped text:**

- `designer.md` — *"Anything needing a rendered page — contrast ratios, focus order, screen-reader
  sequence — is **not checked**, never a pass."*
- `design-library/templates/library-shell.html` — `contrast {{ratio}}:1 {{PASS_OR_FAIL}}`, a
  placeholder **nothing computes**, which means at V1 the model is being asked to fill it by
  reasoning about hex values.

**Both are wrong, in opposite directions.** WCAG contrast is a pure function of two colours —
relative luminance, a published formula, no browser and no guess. It is the **only** accessibility
property that can be a real boundary in a tool with no renderer, and it is the one BOSS has
simultaneously promised and called impossible.

Why it matters more than it looks: the accessibility floor is the part of a design system a founder
is least equipped to judge and most likely to be legally and ethically exposed by. And the values are
**already in the tokens file** — the pairs are semantic (`text.body` on `surface.background`), so the
check is over a handful of pairs, not the whole codebase.

**Shape if built:** compute it where the tokens are defined, not where they are used. A pair that
fails is a token-system finding, and it is caught once rather than on every screen. Zero-dep
arithmetic. The honest scope note writes itself: *this checks the declared pairs, not what the page
actually renders* — real contrast can still be broken by an overlay or an image, and that stays
`not checked`.

### 2. i18n is the seed-that-scales row nobody wrote

**Zero occurrences of `i18n` / `localization` / `RTL` across the entire shipped surface.** Not
deferred — absent.

And it passes BOSS's own test harder than most rows already on it: **retrofitting string extraction
touches every screen ever generated**, while *"user-facing strings live in one place"* at seed is a
habit with no file and no library. It is the content half's version of **component boundaries** —
the same shape, the same asymmetry, and the same one-sentence fix.

It also compounds with something BOSS just shipped: the terminology table is a word list, which is
the one content rule a check can enforce — and a terminology table is *most* valuable exactly when
strings are centralized, because that is when one word per concept becomes mechanically true rather
than aspirational.

**The refusal to carry with it:** this is a *seam*, not a localization system. No locale files, no
pluralization rules, no translation pipeline until there is a second language anyone has asked for.

### 3. Flows × `/measure` — the data can answer what the review can't 🔷

**The strongest idea here, and pure composition of two things that already exist.**

The entire flow layer ([[IDEA-091]] part 6) rests on an honest admission: *no amount of checking
produces a flow nobody designed*, and a model review moves flow efficiency by almost nothing. So the
sequence judgment stays with the founder — **on a guess.**

But `docs/design/FLOWS.md` now holds **an ordered list of steps**, which is exactly an instrumentation
spine. One event per step gives drop-off per step, and **drop-off per step is the answer to the
question the review cannot answer.** The flow the founder guessed at is falsifiable within a week of
real use.

`/measure` caps at ~10 events on purpose (it kills analytics theater) and knows nothing about flows.
A flow with three steps costs three events. That is a cheap, bounded, humane fit — it measures
whether people *got through*, not whether they came back.

**The discipline that keeps it honest:** at n<10 users, `/measure` already says go talk to them, and
that must not change. This is a post-launch answer to a design question, not a reason to instrument
before anyone is there.

### 4. Component API consistency — the props, not the pixels

`variant` vs `type` vs `kind`. `onClick` vs `onPress` vs `onSelect`. `disabled` vs `isDisabled`.

`COMPONENTS.md` records what variants a component has and **nothing about the shape of its
interface**, so an agent writing component number seven has six precedents and no rule — which is the
*pattern reinvention* failure mode moved one level in, from what components look like to how they are
called. It is the layer a developer feels every day and a design review never looks at.

This is the component layer's version of **one word per concept**, and it inherits that rule's best
property: **it is a word list, so it is greppable.** BOSS already ships `content-terminology-guard`
on exactly that reasoning for user-facing copy. The same argument applies to prop names, and the
honest caveat is the same too — it is worth a convention long before it is worth a hook.

### 5. The rendering ceiling — name it, don't fix it

Everything visual BOSS says is `inferred`. It ships no renderer, and `/ux-check` is **right** to
refuse sending a founder to install a browser stack to receive a design review.

Worth writing down as a property rather than a backlog item, because it is what shapes everything
above: **this design system can check values, names, structure and presence. It cannot check
appearance.** Item 1 is the one place that line can honestly be crossed, and it is worth crossing
*because* it is the only one.

The thing to refuse: adding a headless browser to close this. That is a dependency, a platform
surface and a maintenance stream, against PRINCIPLE #4 — and it buys a screenshot that still needs a
judge.

## What this list is not

**None of it is evidence.** [[IDEA-091]] closed with the same line and it has not changed: no founder
asked for any of this by using BOSS. The design system is now genuinely good, and *"our design system
is excellent"* has never been the reason anyone adopted a tool. **Publish and Phase 3 outreach still
outrank every row above.**


---

# Ajesh's topic list, mapped against the tree (2026-09-10)

> *"Other topics or things our design program should cover — anti-design patterns · dark design
> patterns · design tokens · typography · documentation on how/when to use what UI element · design
> principles (capture and evolve as the app scales) · accessibility · layout · materials · branding ·
> inputs · motion · user flows · user feedback capturing · not sure what else."*

Each row grepped. Two things I would have gotten wrong from memory and did not, because I checked:
**line length IS in the style guide** (Density & rhythm), and the **accessibility floor already names
the right method for contrast** — *"check the token pairs, not screenshots."* The instruction is
there; only the arithmetic is missing. That is a sharper version of item 1 above, not a different one.

| Topic | Status | Where it lives | What is actually missing |
|---|---|---|---|
| **Dark design patterns** | ✅ **strongest on the list** | `deceptive-patterns.json` (shape × surface), `deceptive-patterns.md`, `harm-taxonomy.md`, `/red-team --humane`, `deception-loop`, `/ux-check` step 8, kept fresh by `/humane-refresh` | nothing |
| **Design tokens** | ✅ | 3-layer DTCG, five-family guard, inlined in CLAUDE.md | nothing |
| **User flows** | ✅ | `/spec` step 7b, `FLOWS.md`, three paths, the cut test | shipped v0.281.0 |
| **Design principles** | ✅ capture · 🟡 evolve | `STYLE_GUIDE.md` 3–5 with tradeoffs descending into rules; rendered as do/don'ts | **patterns evolve (`design-pattern-loop`); principles have no evolution mechanism and no falsifier.** A principle is a decision — it could carry one |
| **Anti-design patterns** | 🟡 structurally covered | the **Anti-pattern column** in `PATTERNS.md` — each pattern carries its own | the rows are thin because BOSS only seeds what it holds. A standalone catalog is the general-UI catalog deliberately refused |
| **User feedback capturing** | 🟡 product altitude only | `/feedback`, `/interview`, `/research`, `/evidence`, the Scale register | design-specific feedback = **flows × `/measure`** (item 3 above) |
| **Accessibility** | 🟡 | floor in `STYLE_GUIDE.md`, checks in `/design-review` + `/ux-check`, honest `not checked` labels | **the arithmetic** (item 1). The method is already written down |
| **Typography** | 🟡 **thinnest of the "covered"** | a token family, now guarded; *"intentional type pairing"* in the 5-token pass; `Line length:` one blank line | **no scale ratio, no line-height, no hierarchy rule.** The highest-leverage lever for *does this look designed*, and it is one fill-in-the-blank |
| **Branding** | 🟡 **has a defect, not a gap** | `BRAND.md` read by `/landing` and `/pretotype`; brand anchor now a `DEC` | 🔴 **nothing writes `BRAND.md` and nothing offers to.** `/landing` degrades honestly (*"never invent a brand the founder didn't choose"*) and then hands them no way to close the gap. **Voice also lives in two homes** — `BRAND.md` and `STYLE_GUIDE.md`'s *Voice in the interface* — one of which has no producer |
| **Layout** | ❌ **missing** | zero occurrences of grid / breakpoint / container across the design surface | proxied weakly by spacing tokens + *Density & rhythm* |
| **Materials** | ❔ ambiguous | elevation is a token family (now guarded); *Surface / card* is a composition pattern | if this means **surface language** — when a card vs a border vs nothing — it is pattern-layer and thin. **Worth confirming what was meant** |
| **Inputs** | ❌ missing as a family | the flow **cut test** covers the strategic half — *what you ask for and why now* | the tactical half: validation timing, error placement, label vs placeholder, required-field marking |
| **How/when to use what UI element** | ⛔ **refused, deliberately** | — | this is the Material-sized catalog. The refusal was on **inventing** one. The middle path already exists: `PATTERNS.md`'s *"when it applies"* column is this, one row at a time, grown by the project |
| **Motion** | ⛔ **deferred by rule** | `prefers-reduced-motion` in the a11y floor | seed-that-scales: *"cheap to add when earned."* Do not re-propose without evidence |

## The synthesis — three of these are one thing

**Typography, layout and materials are not three topics. They are one missing layer: composition.**

The token system says what a colour *is*. The component index says what a button *is*. `PATTERNS.md`
says what to do in a *situation*. **Nothing says what a page is** — how type scales down a hierarchy,
how a grid holds a screen together, when a surface is raised versus outlined.

That is the difference between an interface that is **consistent** and one that looks **designed**,
and it is the gap a founder feels without being able to name — which is exactly how Ajesh's list
arrived: three separate-sounding topics that are one hole.

It is also where the *"BOSS ships no general-UI catalog"* refusal is load-bearing and should be
re-examined rather than restated. Composition is **not** a catalog of elements. It is a small number
of ratios and rules — a type scale, a spacing rhythm, a measure, a container width, a surface
language — and those are *decisions with tradeoffs*, which is the one thing this design system is
built to hold.

## And the "not sure what else" — four not on the list

- **Icons.** A real design-system component (the set, the sizing scale, the semantic mapping of icon
  to meaning). Absent entirely. Cheap to decide, expensive to retrofit — an icon set is a dependency.
- **Data display.** Tables, lists, charts, numbers. Absent. Genuinely a category, and the one where
  AI-generated UI is worst.
- **i18n** (item 2 above) — the seed-that-scales row nobody wrote.
- **Component API shape** (item 4 above) — the props, not the pixels.

## The honest ranking, if it gets built

1. **Composition** (typography + layout + materials) — the biggest felt gap, and one artifact
2. **Branding's missing writer** — a defect with readers and no producer; cheapest real fix
3. **Contrast arithmetic** — the method is already written; only the math is missing
4. **Inputs + data display** — the two element families worth having even under the catalog refusal
5. Icons · i18n · component API · principle falsifiers

**And the standing line, unchanged:** none of this is evidence. It does not outrank publish and
Phase 3 outreach.


---

# Round two — Ajesh's clarifications, and the finding they produced (2026-09-10)

## Three corrections to the map above

**1. Branding is not marketing, and it is not a one-time anchor.** *"Branding is more about leveraging
it against design… we might need to help the entrepreneur to continue to keep defining the branding
in general."* So `BRAND.md` needs **two** things, not one: a producer (it has readers and none), and a
**growth mechanism** — the same living-document shape `/idea` has and `PATTERNS.md` now has. The brand
anchor `DEC` records the *visual* five; it does not carry positioning, story, personality, or the
words. Marketing is downstream of that and belongs on its own; conflating them is how a brand doc
becomes a landing-page brief and stops being read by the design system.

**2. Typography is a system of roles, not a size scale.** Ajesh's own definition: *"different fonts,
when to use which font, why, size, consistency, color of the fonts."* That is four decisions —
**roles** (display / body / mono / UI), **the when-and-why** for each, **the scale**, and **type
colour**, which is not a typography decision at all but a token *pair* and therefore the contrast
check from item 1. Type is where the composition layer and the accessibility layer meet.

**3. Surface-neutrality is a requirement, not a caveat.** *"We never know what surface someone is
building for, but we should have it, as it's more likely to have some technical aspect that needs
design."*

## 🔴 The finding: BOSS builds a design system for a surface it then refuses to review

Verified by grep, and it is exact:

| Layer | Reads `.boss/config.json` `shape`? |
|---|---|
| `/design-review` | ✅ branches: `cli`/`dev-tool`, `agent`/`chatbot`, `mobile-app`, no-shape-declared |
| `/ux-check` | ✅ same, and has always done it |
| **`/design-tokens-init`** | ❌ **never** — every "shape" in it is the English word (*page-shaped*, *component-shaped*) |
| **`/design-library`** | ❌ **never** — same, all four are *prop shapes* / *page-shaped* |
| `designer` | ❌ one mention, also the English word |

**The definition layer is surface-blind while the review layer is surface-aware**, and the
consequence is concrete: a CLI founder is walked through a three-layer colour token cake, a component
index and — at V1 — an HTML gallery of component cards. Then `/design-review` correctly tells them
*"there is no token layer-cake for terminal output and no hover state to design"* and stops.

**BOSS builds the system, then refuses to review it.** That is the ceremony Principle #2 exists to
prevent, and it is the *same bug* `/design-review` already fixed for itself — its Step 0 says so in
as many words: *"`/ux-check` has always done this and this skill never did."* The fix was applied to
one skill and never asked of its neighbours.

**What surface-neutral actually means here** — and it is not "write it four times":

- **Universal** (every surface, no branch): hierarchy · contrast · the five states · one word per
  concept · error copy that says what to do next · what a flow asks for and why now · reuse before
  creation.
- **Per-surface** (branch or stay silent): colour tokens and hover states (meaningless in a terminal,
  where `NO_COLOR` and pipes govern) · touch targets and Dynamic Type (mobile, no web equivalent) ·
  the transcript as the whole surface (agent/chatbot) · a rendered gallery (only where there is
  something to render).

The design system already knows this split — `/design-review` wrote it down. **It just isn't applied
where the system is built.**

## What else — verified absent, and the good one is boring

**The unglamorous surfaces.** Every product grows surfaces nobody designs, and they are where a solo
founder's credibility leaks:

- **Transactional email.** Verified absent — the `email` hits in the tree are GDPR export and payment
  receipts, not design. Every product sends email. It is the surface a user sees when they are **not
  in your app**, it is almost always the ugliest thing you ship, and it is the one an incumbent
  competitor gets right.
- **Settings · admin · billing · error pages · the docs site.** The second surface always arrives and
  is never in the design brief.
- **Export and print.** A PDF, a CSV, a shared link preview. Someone else sees these.

This is the answer to *"we never know what surface someone is building for"* pointed inward: **every
product has more surfaces than its founder thinks**, and the design system should ask once.

Also verified absent or thin:

- **Perceived performance.** `designer.md` names *Loading* as a state; nothing says skeleton vs
  spinner, optimistic UI, or how streamed output should behave. Design, not engineering — and for an
  AI product it is the dominant felt quality.
- **Accessibility beyond the visual.** The floor is contrast, focus, colour-alone — all visual. Motor
  (target size, drag alternatives) and cognitive (plain language, no timeouts, recoverable steps) are
  absent, and the cognitive half is the one that matters most for a `first-product` cohort's users.
- **Icons** and **data display** — as named in round one.

## One correction from round one

**Consent UI is covered and I nearly listed it as a gap.** `/trust` step 3.5 is *"the consent surface
and what actually leaks"* and it calls `boss craft deceptive-patterns --surface consent-ui` — the
deceptive-patterns catalog is surface-indexed and consent is one of its surfaces. Checked before
claiming; the claim did not survive.

## Revised build order

1. **Composition** — typography-as-roles, layout, surface language. One artifact, closes three rows.
2. **Surface-gate the definition layer** — the same Step 0 `/design-review` already has. Cheapest
   real fix and it stops BOSS handing a CLI founder a colour cake.
3. **`BRAND.md` gets a producer and a growth mechanism** — living, not a one-time anchor.
4. **Contrast arithmetic** — the method is already written; only the math is missing.
5. The unglamorous surfaces · inputs · data display · icons · i18n · component API.


---

# Stock-take, 2026-09-10 — what "done with design" actually means

**The structure is done. The content inside the layers is not.** That distinction is the whole answer:
there are no missing *layers* left, and there is plenty of missing *material*.

**Shipped, v0.276.0 → v0.287.0 (12 releases):** all eight ladder layers · a demotion path at every
layer (promotion had a threshold and nothing did) · the reuse/adjust/new boundary · the composition
slots · surface-gating on both definition skills. **One new loop, one new hook, no new verbs.**

**Open — each verified absent by grep, not by memory:**

| Open item | Why it is next, or isn't |
|---|---|
| 🔴 **Brand: no writer, no growth mechanism** | Ajesh's own point — *brand starts early MVP, stays nascent, keeps learning, grows.* `BRAND.md` has two readers and nothing that writes it or offers to. **The top of the list, and the only one the founder raised himself.** |
| **Contrast arithmetic** | the method is already written in the a11y floor (*check the token pairs, not screenshots*); only the math is missing. Cheapest real mechanism left |
| **Inputs · data display** | the two element families worth having even under the no-general-catalog refusal |
| **The unglamorous surfaces** | transactional email (0 hits), settings, admin, billing, error pages, export. Where a solo founder's credibility actually leaks |
| **Icons · i18n · component API shape** | 0 hits each. i18n is a seed-that-scales row; the other two are conventions before they are mechanisms |
| **Perceived performance** | skeleton vs spinner, optimistic UI, streamed output. For an AI product this is the dominant felt quality |
| **A11y beyond the visual** | the floor is contrast/focus/colour-alone — all visual. Motor and cognitive absent; cognitive matters most for a beginner's users |
| **Principle falsifiers** | patterns evolve, principles don't. A principle is a decision and could carry one |

**Decided, not gaps — do not re-propose:** motion · theming · density · versioning · a shipped
component library (all deferred by the seed-that-scales table) · a general-UI element catalog
(refused; `PATTERNS.md`'s *when it applies* column is the middle path).

**The standing line, and twelve releases have not moved it:** none of this is evidence. npm is twelve
releases behind, and publish + Phase 3 outreach still outrank every row above.


---

# Close-out, 2026-09-10 — everything on this record is built or refused

| Item | Outcome |
|---|---|
| Composition (type · rhythm · surface · hierarchy) | ✅ v0.286.0 — completed `STYLE_GUIDE.md`, no sixth artifact |
| Surface-gating the definition layer | ✅ v0.286.0 + v0.287.0 (the second skill, one release late) |
| Brand: writer + growth + not-a-design-artifact | ✅ v0.288.0 — moved to `docs/BRAND.md`, living, lens-neutral |
| Contrast arithmetic | ✅ v0.289.0 — `contrast-guard`, and the **practice** it belongs to |
| Accessibility as knowledge, not enforcement | ✅ v0.289.0 — `boss craft accessibility`, the gap Ajesh named |
| Inputs · data display · icons | ✅ v0.290.0 — as *the decisions each forces*, not a catalog |
| The unglamorous surfaces | ✅ v0.290.0 — a question asked once in `/ux-check` |
| i18n · component API · perceived performance · principle falsifiers | ✅ v0.291.0 |
| Help docs + website | ✅ v0.292.0 |

**Seventeen releases, v0.276.0 → v0.292.0. One new loop, two dormant hooks, NO new verbs** — 48 skills
before and after.

## The three ideas that came out of it, which are worth more than the features

1. **A system that can only add rules locks design in.** Promotion had a threshold and demotion had
   none. *Three exceptions to the same rule means the rule is wrong* — and the exceptions table that
   proves it was being written and never read.
2. **Name the slot, earn the value.** The composition layer ships empty because a ratio handed over on
   day one, when the founder knows least, is lock-in wearing a best-practice hat. **A named blank is a
   decision made noticeable.**
3. **Lead with knowledge, not enforcement** (Ajesh's correction, mid-build). A tool that leads with
   enforcement teaches a founder that accessibility is the set of things a linter catches — the most
   expensive wrong idea available. Contrast is arithmetic and **nothing else joins it.**

## The recurring defect, six instances, one method

Every one was *a claim outliving its mechanism*: the `design-drift-loop` overstatement in always-on
agent context · a stale "read the component directory" note · a `capture` moment voicing the wrong
loop's words · a test whose body contradicted its own name · a surface-gate fix applied to one sibling
and not the other · `BRAND.md`'s three readers and no writer.

**The method that found all six: when a fact changes, grep the string.** And the sharper version,
learned the hard way at v0.287.0 — **when a correction names more than one file, fix them in the same
change, or the second one does not happen.**

## Standing, and unchanged by any of it

**None of this is evidence.** No founder asked for it by using BOSS. **npm is 17 releases behind**, so
none of it has reached anyone. Publish and Phase 3 outreach still outrank every line above.
