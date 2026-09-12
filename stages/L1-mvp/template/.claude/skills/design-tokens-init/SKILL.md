---
name: design-tokens-init
description: Scaffold the minimal three-layer design token system at the first UI commit, plus the component index the agent opens before creating component number two. Prevents the 47-blues / pattern-reinvention / billion-line-drift failure modes that happen by default when AI generates UI without discipline (IDEA-010). Cohort-aware delivery — vibe-coder-newbie gets SHOWING; eng-builder gets OFFERING; vibe-virtuoso gets OVERRIDE-FRIENDLY. JIT — runs when design-tokens-loop opens. Usage - /design-tokens-init
---

# /design-tokens-init — scaffold the design tokens system

The discipline that prevents the most-common AI-generated-UI failure modes. Without it, every new
screen Claude generates will derive its own colors, spacing, and component patterns — and the
codebase grows linearly with screens (the "billion-line drift" from IDEA-010). With it, the
tokens file is the single source of truth that survives AI generation because the AI is
*explicitly told to use it.*

This skill is **JIT**: ships in MVP mode, but only runs when `design-tokens-loop` opens (i.e.,
the project starts accumulating UI without a tokens file). For a backend-only project, this skill
never runs. For a UI-heavy project, it runs at the first UI commit.

## Step 0 — does it already exist, and is this the right rung?

**Look for a design token system before you make one** — `docs/design/DESIGN_TOKENS.md`, `tokens.json`, `design-tokens/**`, `src/styles/tokens.css`, `src/tokens.ts`, `app/tokens.css`. If it's there: say so and stop
when it's fine (a complete outcome, not a failure to act), or name the *specific* gap and offer the
*specific* edit when it's behind. Never quietly generate a second one.

**Also look for a system another tool wrote** — a root `DESIGN.md` or `PRODUCT.md`, an
`.impeccable/` directory, `design-system/*/MASTER.md`. Design skills that install alongside this one
write those (Google's DESIGN.md spec and impeccable both claim the `DESIGN.md` name, in different
formats; ui-ux-pro-max writes `MASTER.md`). **A hit is prior art, not a competitor:** read it, name
what it already decided, and build the tokens file *from* it — a founder who arrives carrying one has
already made choices, and generating a second system beside theirs is the exact failure this step
exists to prevent. Don't convert their file into this one's format and don't emit theirs; the code
file is the source of truth either way, and both docs describe it.

**Rung: MVP.** Applies only when the project starts accumulating UI. If this project is **earlier** than that, don't run this — leave the seam instead:
**Name the first color for what it MEANS, not what it looks like — `action.primary`, not `indigo-600`. One habit, zero files.** That is the whole ask; it is *not* a three-layer token architecture, a style dictionary pipeline, a semantic layer, a component library. Nothing is technically lost — but the cost is the only one on this list that compounds per screen. Retrofitting is linear in UI you already generated, and an agent generating screen forty has forty precedents telling it to invent a new blue.

## Step 0b — read the shape before you build the system

Read `shape` from `.boss/config.json` (`/canvas` writes it; it is a list of tags). **`/design-review`
and `/ux-check` have always done this and this skill never did** — so BOSS has been *building* a
three-layer colour token cake and an HTML component gallery for founders whose surface is a terminal,
and then correctly refusing to *review* it. Building a system for a surface you will not review is the
ceremony Principle #2 exists to prevent, and it is the same bug `/design-review` fixed for itself.

**What is universal, whatever the surface** — do these for everybody: hierarchy · contrast · the five
states · one word per concept (terminology) · error copy that says what to do next · reuse before
creation.

**What is per-surface:**

- **`cli` / `dev-tool` with no GUI alongside** — there is no colour layer-cake for terminal output:
  colour is a capability that may be absent (`NO_COLOR`, a pipe, a CI log), so it can never be the
  carrier of meaning. Skip tokens, radius, elevation and surface language entirely. **Write the style
  guide anyway** — terminology (one verb per concept across every command), voice (what an error
  says), the five states in their CLI form (no output / in progress / partial / failed / needs input),
  and hierarchy as *what the eye finds first in a wall of text*. That is a real design system; it just
  isn't a visual one.
- **`agent` / `chatbot` with no screen** — the surface is the **transcript**, so the content half *is*
  the whole system: voice, tone, terminology, what it says when uncertain, when refusing, before
  something irreversible. Type, layout and surface language are nil. Do not scaffold tokens.
- **`mobile-app`** — tokens, the three layers and every composition slot hold. The **units and the
  mechanics** don't: pt/dp rather than px, Dynamic Type / font-scale reflow instead of a fixed type
  scale, safe areas in the rhythm slot, and touch targets as a floor with no web equivalent.
- **Web / desktop GUI, or a GUI shape alongside any of the above** — everything below applies as
  written.
- **No shape declared** — ask one line (*"is there a screen here, or is this a CLI/API?"*) rather than
  assuming a browser. Don't send them to `/canvas` to find out.

## When to run it

- `design-tokens-loop` is open (UI exists, no tokens file).
- Founder ran the skill explicitly because they want the system before any UI.
- After a design audit revealed drift — re-init to consolidate.

## How to run it — cohort-aware delivery (v0.20+)

Read `.boss/config.json` for the `cohort` field. Adjust the delivery accordingly:

### `vibe-coder-newbie` / `first-product` — SHOW

Generate the tokens file + a worked example. Don't just create — refactor one existing component
to use the new tokens so the founder *sees* the pattern. Plain language:

> *"I'm setting up a tokens file. Colors, spacing, typography in one place. I'll also refactor
> your `<existing-button>` to use the tokens — so you can see what the pattern looks like.
> From now on, when you ask me for new UI, I'll reference these tokens. New colors only get
> added here; never inline. Sound good?"*

### `eng-builder` / `returning-founder` — OFFER + SKIP THE 101

> *"Setting up three-layer tokens: primitives → semantic → component. Standard architecture.
> Want me to scaffold the Style Dictionary config too, or are you using your own pipeline?"*

### `vibe-virtuoso` — OVERRIDE-FRIENDLY

> *"Tokens system, three layers. The override pattern's there if you want to skip — record
> rationale in the devlog. Most likely failure mode you'll hit if you skip: 47 blues by sprint
> 3. Your call."*

### `non-tech-founder` / `domain-expert` — PLAIN-LANGUAGE COACH

> *"Quick setup before the UI accumulates. The problem this prevents: as you build more
> screens, each one will use slightly different colors and spacing unless we put them in one
> file the AI reads every time. I'll do that now — takes a minute. Domain-specific note: if
> your colors carry meaning (e.g., medical severity, regulated states), name them by meaning
> in the tokens, not by hue."*

### `indie-hacker` — RIGHT-SIZED

> *"Minimal tokens setup. Stack-portable — won't lock you into a tooling choice. I'll skip the
> heavy Style Dictionary / Theo machinery; we can add it later if the system earns it."*

### Unspecified — neutral plain language

> *"Setting up a tokens file so style stays one source of truth. Reduces the chance the
> codebase grows 47 shades of blue. Takes about a minute."*

## The minimum three-layer token system (Nathan Curtis layer-cake)

Create `docs/design/DESIGN_TOKENS.md` (the human-readable spec) + the stack-specific token file
(JSON / CSS variables / TypeScript / etc. depending on stack):

### Layer 1 — Primitives (raw values)

Color scales, spacing scale, typography scale, radius scale, elevation, motion. Names are
descriptive of the *value*, not the use:

```yaml
color.gray.100: '#f7f7f7'
color.gray.500: '#888888'
color.blue.500: '#3B82F6'
spacing.s: 4
spacing.m: 8
spacing.l: 16
```

### Layer 2 — Semantic (meaning)

Names describe the *role*, not the value. AI uses these. **This is the AI-tolerant layer.**

```yaml
color.action.primary: { ref: color.blue.500 }
color.surface.background: { ref: color.gray.100 }
color.surface.foreground: { ref: color.gray.900 }
color.text.body: { ref: color.gray.700 }
color.text.muted: { ref: color.gray.500 }
spacing.element: { ref: spacing.s }
spacing.section: { ref: spacing.l }
```

### Layer 3 — Component (occasionally needed)

Component-specific tokens when a component has unique constraints. Most projects don't need
this layer until V1. If you're reaching for it at MVP, you're probably premature.

### The brand-anchor

**Read `docs/BRAND.md` first if it exists, and `docs/ideas/CANVAS.md`'s Promises cell either way.**
The brand doc is *upstream of this skill and not owned by it* — it also feeds `/landing`,
`/pretotype`, the pitch and the words in a sales call. If it doesn't exist, seed it (`/landing`
carries the skeleton at its `templates/brand-doc.md`), mark it `nascent`, and take the anchor from
it rather than inventing one here. **Design consumes brand; it does not define it.**

Read `docs/ideas/CANVAS.md` Promises cell. The brand voice declared there should anchor the
*choice of primitives*. Don't default to Tailwind blues; pick primitives that match the
declared brand. If the canvas's Promises cell is `_(not yet)_`, flag it — design tokens without
a brand anchor will drift back to internet-defaults.

### The 5-token distinctiveness pass

**The tells are not a fixed list. They are the current attractor**, and the attractor moves: the
"shadcn trap" (slate, Inter, 8px radius, indigo) was the 2024 tell, and the fix for it — *warm the
neutral* — is now **the 2026 tell**. A list of tells without a date is a list of last year's tells.

**Current as of 2026-09** (Anthropic's `frontend-design` skill, Apache-2.0, read at source) —
generated design clusters around five looks, and each is a default rather than a choice because it
appears *regardless of subject*:

1. **Warm cream (~`#F4F1EA`) + a high-contrast serif display + a terracotta or warm-clay accent
   (~`#D97757`)** — the commonest one, and the terracotta is Claude's own interaction accent, so on a
   founder's product it reads as a tell twice over.
2. **Near-black + one bright acid-green or vermilion accent.**
3. **The broadsheet** — hairline rules, zero border-radius, dense newspaper columns.
4. **The SaaS-card kit** — content chopped into identical rounded cards, one radius on everything
   regardless of hierarchy, the same soft `rgba(0,0,0,.1)` shadow under each, gradient washes.
5. **Template chrome, whatever the subject** — a tracked-out ALL-CAPS eyebrow above every heading ·
   meta strings joined with middle dots (`A · B · C`) · `WORD — fragment` with a spaced em dash ·
   tinted near-black (`#0B0B0B`, `#111`) standing in for black · a mono face for small labels · a `→`
   appended to every link and button.

**The stamp is a claim, not a mechanism.** The list is re-checked on the *model curve*, not the
calendar — a new frontier model is what moves the attractor, and it is the event that re-opens this
list (BOSS's build-craft watchlist, §7b). **If a newer frontier model has shipped since the stamp,
treat the list as stale regardless of the date**, and say so rather than applying it as current. When the brief *asks* for one of these looks, follow the brief — these are
defaults, not sins. And expect lists to disagree: the same month this one named *tinted near-black*
as template chrome, impeccable's detector shipped a rule saying *pure black — always tint*. Neither is
wrong; **the tint is not the tell, the combination is.** Read any tell as a symptom of *default
chosen for you*, never as a banned value.

Five deliberate overrides break the sameness without a redesign — do this *as part of picking
primitives*, anchored to the brand doc and the canvas Promises cell:

1. **Give the neutral a temperature — and not warm cream.** A neutral with a temperature was the
   2024 fix and warm cream is the 2026 default; cool, or a warm that isn't cream, or a genuine tint.
2. **Choose a radius on purpose** — sharp (0–2px) or soft (12px+), not the default 8.
3. **Intentional type pairing** — one characterful display/heading face + a clean body face; not
   Inter-on-Inter.
4. **One saturated accent** the brand owns — a single confident color, not indigo-by-default.
5. **One "signature token" the defaults omit** — a texture, a shadow language, a custom easing
   curve. This is the brandable one; it's what makes the UI *yours*.

6. **Then run the genericness test, before a single component is written.** *Would I have
   produced this exact plan for any similar brief?* Work through a neighbouring prompt in your head —
   a different product, same category — and see whether you arrive somewhere similar. **Any part that
   survives that swap unchanged is a default, not a choice**: revise it, and say what changed and why.
   This is the one check that makes *sameness* visible to the model that produced it, and it costs
   one paragraph. (From `frontend-design`; the best single idea in it.)

Cohort-aware: `vibe-coder-newbie` / `first-product` → just *do* the 5 overrides and show the
before/after. `eng-builder` / `vibe-virtuoso` → *offer* them as a checklist, override-friendly.
`domain-expert` → keep it sober; distinctiveness ≠ playful when the stakes are clinical.

### Record the anchor as ONE decision — not five, and not zero

The five overrides above are the most hard-to-reverse choices in the whole design system: **every
use site changes on a retheme.** They are also, today, made in a single conversation and written
down nowhere a future session can read as a *decision*. Six months later nobody knows whether the
2px radius was a choice or a default — which means nobody will defend it, and everybody will
gradually drift off it.

**Offer `/decide` once, with the five choices as one record.** Not five records: they were made
together, for one reason, and splitting them would be the ceremony PRINCIPLE #2 refuses.

> *"That's your brand anchor — the neutral, the radius, the type pairing, the accent, the signature.
> Want me to record it as a decision (`/decide`)? It takes the reasoning and a falsifier, so the next
> session knows these were chosen rather than defaulted. Two minutes, and it's the difference between
> a design system and a set of values nobody will defend."*

Set `reversibility: costly` — a retheme touches every use site — and write a falsifier that is
actually cheap to check, e.g. *"if three people describe the product as generic-looking by <date>,
the anchor didn't do its job."* If they decline, drop it and don't re-ask; the tokens file alone is
a real choice.

**Which design choices earn a record, and which don't** — this is already answered by the
seed-that-scales test and needs no new rule:

| Earns a `/decide` | Doesn't |
|---|---|
| the brand anchor (the five overrides) | which grey the disabled state uses |
| naming semantics by purpose rather than hue | adding a token to an existing scale |
| the terminology of a core noun (`team` vs `org`) | the wording of one button |
| a pattern you deliberately **refused** (see `/design-review`) | a pattern you adopted — that's just the pattern set |
| component boundaries — element-shaped, not page-shaped | which file a component lives in |

The test underneath is the same one that decided this skill's own rung: **record it if reversing it
gets more expensive as the app grows.** Everything else is a note in the devlog, and treating it as
more is how a decision log becomes something nobody reads.

### Name by purpose, build on the standard (DTCG)

Name semantic tokens by **purpose, not appearance** — `color.text.error`, never `color.red.500`
at the semantic layer — so the AI can *reason* about intent rather than guess from a hue (Nathan
Curtis). Where the stack allows, emit tokens in the **W3C DTCG** format (it reached a first stable
version) so the system is portable and you're not locked into one vendor's token dialect — which
also honors the canvas's "don't monetize lock-in" line.

## After scaffolding

0. **Write the style guide alongside the tokens.** `DESIGN_TOKENS.md` is the *what* (values and their
   names); `docs/design/STYLE_GUIDE.md` is the *how and why* — how tokens compose into patterns, the
   3–5 design principles with their rules, the five-state table, the accessibility floor. **Skeleton:
   [`templates/style-guide.md`](templates/style-guide.md).**

   Ship it now, even mostly-empty with the headings and two filled principles. `/design-review` and `designer` both *read* this file — it is not optional scaffolding, it's the
   half of the system those three consume.

   Push hardest on the principles section: **each principle must contain a tradeoff** (if nobody
   could argue the opposite, it's a mood, not a principle), and **each must descend into rules**,
   because an agent can't act on "calm over engaging" — it can act on "no unread-count badges."

1. Update the project's CLAUDE.md (or claude-append.md) to declare the token discipline:

   ```markdown
   ## Design tokens (added by /design-tokens-init)

   This project uses three-layer design tokens. **All style values come from
   `docs/design/DESIGN_TOKENS.md` + the corresponding code file.**

   When generating new UI:
   1. Search `src/components/` for similar patterns first; reuse before creating.
   2. Reference tokens by semantic name (`color.action.primary`), never raw hex.
   3. Specify all 5 states (default / hover / active / disabled / empty) explicitly.
   4. Reject "make it pretty" prompts; anchor to the canvas Promises cell.

   Semantic → primitive map (the AI reads this without opening another file):
   | semantic                 | primitive        |
   |--------------------------|------------------|
   | color.action.primary     | <your accent>    |
   | color.surface.background  | <your neutral>   |
   | color.text.body           | <your ink>       |
   | radius.default            | <your radius>    |
   | font.display / font.body  | <your pairing>   |
   | <signature token>         | <the one that's yours> |
   ```
   Inlining the map in CLAUDE.md (not just `DESIGN_TOKENS.md`) means the agent inherits the
   brand for free on every turn — the single most useful artifact for a Claude-Code-native scaffold.

1b. **Inline the voice the same way — it's the same trick, and copy needs it more.** Once
   `STYLE_GUIDE.md` has voice traits and a terminology list, add this block right underneath:

   ```markdown
   ## Voice (added by /design-tokens-init)

   Voice is constant; tone shifts by context. Full table in `docs/design/STYLE_GUIDE.md`.

   | trait | giving up |
   |---|---|
   | <trait 1> | <the tradeoff> |
   | <trait 2> | <the tradeoff> |

   Terminology — use the left column, never the right:
   | use | never |
   |---|---|
   | <the word> | <the synonyms> |

   When writing ANY user-facing string (button, error, empty state, confirm dialog,
   system prompt, refusal message):
   1. Errors say what to do next, not what failed.
   2. Destructive confirms name the consequence, not "are you sure".
   3. Empty states say what to do next, not "nothing here".
   4. Use the terminology table. One word per concept.
   ```

   **Why this matters more for copy than for color:** the model reverts to the mean harder on
   words than on values. Nobody has to prompt an LLM into writing *"Oops! Something went wrong."*
   — that **is** the mean. It's the 47 blues, in sentences. And unlike a hex code there is no
   regex for off-voice, so the guard-hook boundary that saves the token system does not transfer
   here. **Terminology is the exception — it's a word list, so it's the one content rule a check
   can actually enforce.** Everything else in this block is a filter, and worth shipping anyway.

1c. **Cohort-scope the content half — do NOT hand everyone the full matrix** (RVW-077's required
   modification). The token half of this skill is carefully cohort-aware and the content half must
   be too, for the same reason: *a table filled in because it was asked for steers nothing.*

   - **`first-product` / `vibe-coder-newbie` — TERMINOLOGY ONLY.** One table, the checkable one,
     three rows max. **Defer voice and tone entirely** — say the section exists and that it's worth
     doing once they've watched real users read their screens. Someone who hasn't shipped cannot yet
     tell "plain over clever" from "friendly over formal," and asking them to decide produces a
     confident-looking answer nobody consults. *"Pick the words for your two or three main things and
     stay consistent. That's the whole job today."*
   - **`eng-builder` / `returning-founder`** — offer the full set tersely; they've argued about a
     terminology table before. *"Terminology, voice traits, tone-by-context. Want all three or just
     the terms?"*
   - **`vibe-virtuoso`** — lead with the mechanism: the terminology guard is checkable, voice/tone
     are not, and here's why that asymmetry is real rather than a missing feature.
   - **`domain-expert` — TONE FIRST, not terminology.** In a regulated or high-stakes domain the
     load-bearing decision is how the product speaks when it's *uncertain or wrong* — hedging,
     escalation language, what a refusal says. That outranks vocabulary consistency. Start there.
   - **`non-tech-founder`** — plain language, one concrete example: *"if your app says 'client' in
     one place and 'customer' in another, people notice and it reads as sloppy. Pick one."*
   - **`indie-hacker`** — right-sized: terminology plus one voice trait. No matrix, no ceremony.

   **The general rule this encodes:** ship the *checkable* content rule to everyone and the
   *judgment-shaped* ones only to founders who have enough product to judge against. Content
   discipline that arrives before there is copy to be inconsistent about is PRINCIPLE #2's premature
   ceremony wearing a design-system hat.

1d. **Write the component index — and the one rule that outranks it.** `DESIGN_TOKENS.md` governs
   *values*. The more expensive AI-UI failures are **component-shaped**: `Button` → `CTAButton` →
   `PrimaryButton`, and code that grows linearly with screens. Both begin at component number two,
   which is this rung — not V1.

   **Create `docs/design/COMPONENTS.md` as soon as the first component exists. Skeleton:
   [`templates/component-index.md`](templates/component-index.md).** An index of one is not ceremony
   the way a registry of one prototype would be: a prototype is a throwaway, a component is a
   precedent, and the index is where the *second* one gets written down.

   Then add this to CLAUDE.md, directly under the token map. Keep it this short — it is read on every
   turn:

   ```markdown
   ## Components (added by /design-tokens-init)

   **Before creating a component, open `docs/design/COMPONENTS.md`** — the index of what already
   exists, with the import line for each. Reuse first, extend second, create last.

   1. Build the button, then use it on the page. Don't build the page and leave the button inside it.
   2. A new component gets its row in the index in the same change that creates it.
   3. **Reuse, adjust, or new?** Match on the **job**, not the look.
      - same job, different look → a **variant** (a prop, not a file)
      - same job, slightly different need → **widen** the one that exists
      - different job that happens to look alike → genuinely **new**
      - can't tell → it's a variant. Forking is cheap now and expensive forever; extending is
        slightly expensive now and free forever.
   ```

   **Why a file and not just the rule:** *"search `components/` for similar first"* has been the
   prescribed prevention for years and it is a **filter** — it holds only while every future prompt
   remembers. An index gives the agent something to *open* instead of something to recall. That is
   the same filter→boundary move `design-tokens-guard` makes for hex codes, one layer up.

   **Do not overstate it.** At this rung the index is *authored*, so it can go stale; the staleness is
   visible (a component in the tree with no row) and nothing enforces it. It is a better filter, not
   yet a boundary. At V1 `/design-library` generates the same fields from the code with a per-component
   source hash, and **supersedes this file rather than sitting beside it** — two definitions of a
   button is the trap that skill exists to refuse.

   **This one is not cohort-scoped, and that follows the rule 1c just set:** ship the *checkable*
   thing to everyone, cohort-scope only the judgment-shaped ones. An index is an index. What varies is
   how much you explain — SHOW cohorts get one walked example (*"you already have a Button; that's
   what this row is for"*); terse cohorts get the path and nothing else.

2. The `design-tokens-loop` exit predicate now passes — loop closes.

3. Going forward, `design-drift-loop` (V1) watches for raw hex codes appearing in source — **that
   is all it watches; it's a single regex.** The component-shaped failures the catalog also names
   (near-duplicate components, code growing linearly with screens) need `/design-library` at V1,
   which reads every component into a manifest and can actually see them.

4. **At V1, `/design-library` makes the system visible** — one self-contained HTML page with the
   foundations, the rule sets, and every component in all five states, generated from the code so it
   can't drift. That's the artifact a founder spot-checks against and a designer gets handed. It
   **generates over `COMPONENTS.md`'s shape rather than introducing it**: same fields, plus a source
   hash and a usage count the generator can compute and an author can't.

## Rules

- **The index is written the same turn the component is.** A component created without its row is
  how the index starts lying, and an index that lies is worse than none — the agent trusts it and
  stops looking. This is a filter at MVP and becomes a boundary at V1 when `/design-library`
  generates it; say which one you have, never imply the other.
- **Build the button, then use it on the page.** Page-shaped components (`DashboardPage.tsx` with its
  buttons and inputs defined inline) are the upstream cause of both *pattern reinvention* and
  *billion-line drift* — every inlined primitive is one the next screen reinvents. One sentence at
  seed; a refactor across every screen at V1.
- **Three layers, not two.** Two-layer (primitives → component) is fragile under AI generation.
  Three layers (primitives → semantic → component) gives AI a meaningful name to grab.
- **Brand-anchor the primitives.** Don't default to internet-aesthetic. Canvas Promises cell IS
  the brief.
- **Tokens file LIVES in the prompt context.** When asking AI for UI work, *always* pass
  `DESIGN_TOKENS.md` as context. This single discipline prevents 80% of the drift — **and the
  remaining 20% is where the 47 blues actually live**, because a prompt convention is a *filter*
  (it depends on every future prompt remembering), not a boundary.
- **Define a family or don't — but know the guard follows you.** `design-tokens-guard` has an
  opinion about radius, type, spacing and elevation **only if your tokens file names tokens for
  them** (color is unconditional — it is the original boundary). This is deliberate: you cannot ask
  an agent to use a token name that does not exist, so an undefined family is silence rather than
  nagging. The practical consequence is worth saying out loud — **defining a spacing scale turns on
  its enforcement**, which is the right trade and should not be a surprise.
- **Prototypes consume the tokens, or they're labeled sketches.** Once this project has tokens *and*
  more than one mockup, start `docs/design/PROTOTYPES.md` —
  **[`templates/prototypes-registry.md`](templates/prototypes-registry.md)**. The rule it carries is
  what makes `/spec`'s mockup guidance safe: **a mockup that doesn't import your tokens is worse than
  prose**, because prose is obviously incomplete while a mockup is a confident, complete-looking
  answer the implementation will reproduce faithfully — raw hexes and all. Don't create the registry
  for a single sketch; that's ceremony. Create it when prototypes start accumulating.
- **Offer the guard once, here, at the end.** The moment the tokens file exists is the moment a
  check has something to point at — so this is the JIT on-switch, not a V1 afterthought:

  > *"Tokens are in. Want me to turn on `design-tokens-guard`? It's a hook that catches a hardcoded
  > style value the moment it's written — color, radius, type, spacing, elevation — and hands Claude
  > your token names instead. It stays silent unless this tokens file exists, and it only has an
  > opinion about a family you actually defined tokens for. Costs a process per file write."*

  If yes, add the `PostToolUse` block from the header of `.claude/hooks/design-tokens-guard.js` to
  `.claude/settings.json`. If no, **drop it and don't re-ask** — the tokens file alone is a real
  choice, and `boss hooks` will still list it whenever they want it.

- **Offer `component-reuse-guard` when the index has real rows.** The index made *reuse first*
  checkable; this is what makes it a **boundary**, and it closes the one honest weakness of the index
  itself — nothing noticed a component written without consulting it.

  > *"Your index has components in it now. Want `component-reuse-guard` on? When a component gets
  > written that isn't in the index, it hands Claude the rows it should have compared against and
  > asks the actual question — reuse, adjust, or new? It fires once per new component, never on an
  > edit to one you already have, and it stays silent until this index exists."*

  **Why it earns a hook when a prompt rule doesn't:** writing a new file is easier for a generating
  model than reading an existing one and widening it, so *create* is the path of least resistance and
  the default silently lands there. The cost arrives later and one reasonable decision at a time —
  `Button`, `CTAButton`, `PrimaryButton`. Same JIT gate and same drop-it-if-declined rule as the
  others.

- **Offer the terminology guard the same way — but only once a terminology table has real rows.**
  Voice and tone can't be checked by a regex and this hook doesn't try. **Terminology can**, because
  it's a word list:

  > *"You've got a terminology table now. Want `content-terminology-guard` on? It watches the
  > strings your UI actually shows and flags a word the table rules out — `org` when you decided on
  > `team`. Copy only; your variable names are your business."*

  Same JIT gate as the token guard: **a skeleton table is not a decision**, so the hook stays silent
  until at least one real row exists. Same rule if they decline — drop it, don't re-ask.
- **JIT — only scaffold when needed.** Don't init tokens before there's UI to use them. The
  loop's entry predicate is the trigger; don't pre-empt it.
- **Override is recorded, not blocked.** A founder skipping this skill is legitimate; record
  in devlog with substantive rationale.
- **Run the 5-token distinctiveness pass.** Three layers prevent drift; the 5 overrides prevent
  *sameness* (the generic-AI-app look). Both, not one. The "signature token" is the brandable one.
- **Name by purpose; emit DTCG where the stack allows.** Semantic tokens reason about intent
  (`color.text.error`), not hue (`color.red.500`); DTCG keeps it portable (no lock-in).
- **Cite the field.** Brad Frost (Atomic Design), Nathan Curtis (layer-cake + purpose-naming), W3C
  Design Tokens Community Group (DTCG stable). 2026 distinctiveness tactic per the AI-UX scan. Not
  BOSS's inventions — applied with build-integration. Interaction-layer companion:
  `boss craft ai-ux-patterns`.
