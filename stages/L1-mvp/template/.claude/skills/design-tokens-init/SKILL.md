---
name: design-tokens-init
description: Scaffold the minimal three-layer design token system at the first UI commit, plus the component index the agent opens before creating component number two. Prevents the 47-blues, pattern-reinvention and billion-line-drift failures AI-generated UI produces by default. Cohort-aware delivery. Runs when design-tokens-loop opens. Usage - /design-tokens-init
---

# /design-tokens-init — scaffold the design tokens system

The discipline that prevents the most-common AI-generated-UI failure modes. Without it, every new
screen Claude generates will derive its own colors, spacing, and component patterns — and the
codebase grows linearly with screens (the "billion-line drift"). With it, the
tokens file is the single source of truth that survives AI generation because the AI is
*explicitly told to use it.*

This skill is **JIT**: ships in MVP mode, but only runs when `design-tokens-loop` opens (i.e.,
the project starts accumulating UI without a tokens file). For a backend-only project, this skill
never runs. For a UI-heavy project, it runs at the first UI commit.

## Step 0 — does it already exist, and is this the right rung?

**Look for a design token system before you make one** — `docs/design/DESIGN_TOKENS.md`, `tokens.json`, `design-tokens/**`, `src/styles/tokens.css`, `src/tokens.ts`, `app/tokens.css`. If it's there: say so and stop
when it's fine (a complete outcome, not a failure to act), or name the *specific* gap and offer the
*specific* edit when it's behind. Never quietly generate a second one.

**Also look for a system another tool wrote** — a root `DESIGN.md` or `PRODUCT.md`, a
`design-system/*/MASTER.md`, a dot-directory a design skill left behind with surface or design
files in it. Design skills that install alongside this one write those, and more than one claims
the `DESIGN.md` name in a different format. **A hit is prior art, not a competitor:** read it, name
what it already decided, and build the tokens file *from* it — a founder who arrives carrying one has
already made choices, and generating a second system beside theirs is the exact failure this step
exists to prevent. Don't convert their file into this one's format and don't emit theirs; the code
file is the source of truth either way, and both docs describe it.

**Rung: MVP.** Applies only when the project starts accumulating UI. If this project is **earlier** than that, don't run this — leave the seam instead:
**Name the first color for what it MEANS, not what it looks like — `action.primary`, not `indigo-600`. One habit, zero files.** That is the whole ask; it is *not* a three-layer token architecture, a style dictionary pipeline, a semantic layer, a component library. Nothing is technically lost — but the cost is the only one on this list that compounds per screen. Retrofitting is linear in UI you already generated, and an agent generating screen forty has forty precedents telling it to invent a new blue.

## Step 0b — read the shape before you build the system

Read `shape` from `.boss/config.json` (`/canvas` writes it; it is a list of tags). `/design-review`
reads it too, before code and after, so both agree on which surface exists. A three-layer colour token
cake and an HTML component gallery for a founder whose surface is a terminal is the ceremony
Principle #2 exists to prevent: build only for a surface that will be reviewed.

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

## How to run it — cohort-aware delivery

Read `.boss/config.json` for the `cohort` field. What each cohort needs to hear is below; say it in
words that fit this project, not as a script.

### `vibe-coder-newbie` / `first-product` — SHOW

Generate the tokens file + a worked example. Don't just create — refactor one existing component
to use the new tokens so the founder *sees* the pattern. In plain language, they need: colors,
spacing and type now live in one file; which component you refactored so they can look at it; and
that from now on new UI references these tokens, and a new color gets added there, never inline.

### `eng-builder` / `returning-founder` — OFFER + SKIP THE 101

Name the architecture in a line (three layers: primitives → semantic → component) and ask the one
real question: scaffold a Style Dictionary config, or do they have their own pipeline?

### `vibe-virtuoso` — OVERRIDE-FRIENDLY

Terse. The override is there if they want to skip it (rationale goes in the devlog), and the failure
they'd most likely hit by skipping is 47 blues within a few sprints. The choice stays theirs.

### `non-tech-founder` / `domain-expert` — PLAIN-LANGUAGE COACH

Say the problem this prevents in plain words: as screens pile up, each drifts to slightly different
colors and spacing unless they live in one file the AI reads every time — and it takes a minute.
For `domain-expert`: if colors carry meaning (medical severity, regulated states), name them by
meaning in the tokens, not by hue.

### `indie-hacker` — RIGHT-SIZED

Minimal and stack-portable, no tooling lock-in; skip the heavy Style Dictionary / Theo machinery
until the system earns it.

### Unspecified — neutral plain language

One source of truth for style, so the codebase doesn't grow 47 shades of blue. About a minute.

## The minimum three-layer token system (Nathan Curtis layer-cake)

Create three files, in this order — **`docs/design/tokens.json`** (the tokens themselves, in the W3C
DTCG format — the one file a colour is a fact in, whatever the stack), `docs/design/DESIGN_TOKENS.md`
(the human-readable spec over it: the same names, the reasons, the deprecated table), and the
stack-specific token file **derived from the JSON** (CSS variables / TypeScript / a theme object —
whatever the stack consumes). The JSON is not optional and not stack-dependent: it is JSON. It is
what a design tool imports, what the guard reads for vocabulary, and what a gallery renders from.

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

### The `Deprecated` table — empty on day one, and the guard reads it

```markdown
## Deprecated

| Old | Use instead | Why |
|---|---|---|
| `color.brand` | `color.action.primary` | named by hue; renamed by purpose |
```

A retired token gets a row here, never a deletion. `design-tokens-guard` reads this table and tells
the agent the successor the moment the old name is typed again. Delete the row when the last use is
gone. Ship the heading with no rows so the shape is there when the first rename happens.

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

**Current as of 2026-09** (the host maker's own current design skill, read at source; the
practice carries the citation and the date) — generated design clusters around five looks, and each
is a default rather than a choice because it appears *regardless of subject*:

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
as template chrome, a rendered-page linter's rule set said *pure black — always tint*. Neither is
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
   one paragraph. (From the same source as the list above; the best single idea in it.)

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

What they need to hear, in words that fit: these five (the neutral, the radius, the type pairing,
the accent, the signature) are their brand anchor, and recording them keeps the reasoning and a
falsifier so the next session knows they were chosen rather than defaulted. It is one item in the
end-of-run list (Rules, *Offers due at the end go out as one list*), not an ask of its own.

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
Curtis). Emit the tokens in the **W3C DTCG** format (it reached a first stable version) as
`docs/design/tokens.json` — always, whatever the stack — so the system is portable and you're not
locked into one vendor's token dialect, which also honors the canvas's "don't monetize lock-in"
line. The shape: a group per family, a token per name, `$type` and `$value` on each (`color`,
`dimension` as `{ value, unit }`, `fontFamily` as a list), `$description` where a reader would want
the reason. **The stack file is derived from this one** — the CSS variable is the JSON name with
dots as dashes (`color.text.muted` → `--color-text-muted`) — never the other way round. Two files
that can both be edited is the two-definitions-of-a-button trap at the token layer.

This file is also the design-tool seam, and it is honest about which way it goes: a designer
imports it into their tool's variables (a tokens plugin on any plan; the tool's own API only on an
enterprise plan; native JSON import is not something to promise), edits there, exports DTCG, and the
export is diffed against this file one token at a time — the founder decides per token. Tokens are
the one layer where that round-trip is real, because a token has a stable name. **Retire a token by marking it, not by
deleting it.** `DESIGN_TOKENS.md` carries a `## Deprecated` table — `| \`old.name\` | \`new.name\` |
why |` — and `design-tokens-guard` reads it: a write that references a deprecated name is told the
successor. Mirror it into the code file where the format has a field (DTCG 2025.10 defines
`$deprecated` on tokens and groups — `true`, or a string naming the replacement). A deleted token
breaks every screen that used it in one silent step; a deprecated one keeps working, names its
successor, and can be removed when the last use is gone. `$description` on every semantic token is
the other field worth filling — it is what an editor shows on hover, and the agent reads hovers.

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

   **Then run `boss design`.** It renders the system as it is — every slot you just left as a
   `<placeholder>` is a hole on the page, and `boss design --questions` lists them in build order
   with the verb and the *moment* that earns each: `/design-review` reads layout, icons, the
   five-state row and a do/don't back from the first screen that decides them; `/design-review after` fills the
   tone table from the strings that shipped; `/spec` writes the flows; a logo needs a file. Nothing
   here is filled by asking the founder a form — each slot has a moment, and the page says which.

1. Update the project's CLAUDE.md (or claude-append.md) to declare the token discipline:

   ```markdown
   ## Design tokens (added by /design-tokens-init)

   This project uses three-layer design tokens. **All style values come from
   `docs/design/tokens.json` (DTCG — the source), read as `docs/design/DESIGN_TOKENS.md` and
   consumed through the derived code file.**

   When generating new UI:
   1. Search `src/components/` for similar patterns first; reuse before creating.
   2. Reference tokens by semantic name (`color.action.primary`), never raw hex.
   3. Specify all 5 states (default / hover / active / disabled / empty) explicitly.
   4. Reject "make it pretty" prompts; anchor to the canvas Promises cell.
   5. Imports flow one way: `ui/` (system components — know nothing about the product) →
      `features/` (product) → `app/` (routes, shell). A system component never imports a
      feature; a feature never reaches into another feature's internals. Open
      `docs/design/COMPONENTS.md` before creating a component; read its `Status` column
      before copying an import — `deprecated → X` means use `X`.

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

1b. **Once `STYLE_GUIDE.md` has voice traits or a terminology list, inline them into CLAUDE.md the
   same way** — then scope that content half by cohort (terminology to everyone, voice and tone only to
   founders with copy to judge). The block to paste, why copy needs it more than colour, and who gets
   which half: [`reference/content.md`](reference/content.md). Skip it until the style guide has either.

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

   **This one is not cohort-scoped, and that follows the rule in 1b:** ship the *checkable*
   thing to everyone, cohort-scope only the judgment-shaped ones. An index is an index. What varies is
   how much you explain — SHOW cohorts get one walked example (*"you already have a Button; that's
   what this row is for"*); terse cohorts get the path and nothing else.

2. The `design-tokens-loop` exit predicate now passes — loop closes. At V1, `design-drift-loop`
   watches for raw hex in source (one regex, nothing more), and `/design-library` generates the
   visible system over `COMPONENTS.md`'s shape — it sees the component-shaped failures this rung can't.

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
- **Three families the layout slot earns, and none of them on day one.** `breakpoint.*` (`sm`, `md`,
  `lg` as `dimension` tokens — a media query is a name, not a number typed twice), `z-index.*` (the
  five or six layers a page has, named — `dropdown`, `sticky`, `overlay`, `toast` — so two overlays
  never fight by magic number) and `target.min` (the touch target, 44px is the usual — the one rule
  that otherwise lives as prose in three places). Add each **when the Layout slot in
  `STYLE_GUIDE.md` names it**, not before: a breakpoint token for a product with one surface is a
  number nobody reads. `boss design` renders them beside the slot once they exist.
- **Prototypes consume the tokens, or they're labeled sketches.** Once this project has tokens *and*
  more than one mockup, start `docs/design/PROTOTYPES.md` —
  **[`templates/prototypes-registry.md`](templates/prototypes-registry.md)**. The rule it carries is
  what makes `/spec`'s mockup guidance safe: **a mockup that doesn't import your tokens is worse than
  prose**, because prose is obviously incomplete while a mockup is a confident, complete-looking
  answer the implementation will reproduce faithfully — raw hexes and all. Don't create the registry
  for a single sketch; that's ceremony. Create it when prototypes start accumulating.
- **Offers due at the end go out as one list.** The anchor record, the token guard, and any later
  guard whose condition already holds (below) land at the same moment — ask them as one numbered
  list the founder can answer by number ("1 and 3"), never as a run of separate yes/no turns. Each
  item keeps its own rule: offered once, only when its condition holds, dropped after a no.
- **Offer the guard once, here, at the end.** The moment the tokens file exists is the moment a
  check has something to point at — so this is the JIT on-switch, not a V1 afterthought. What the
  founder needs to know: `design-tokens-guard` is a hook that catches a hardcoded style value (color,
  radius, type, spacing, elevation) as it's written and hands Claude their token names instead; it is
  silent unless this tokens file exists, has an opinion only about a family they defined tokens for,
  and costs a process per file write.

  If yes, run `boss hooks enable design-tokens-guard`: it copies the hook into the project and
  registers it in `.claude/settings.json` in one move. If no, **drop it and don't re-ask** — the tokens file alone is a real
  choice, and `boss hooks` will still list it whenever they want it.

- **Offer the other three guards later, each once, when its condition first holds** — never before,
  never re-asked after a no: `component-reuse-guard` when `COMPONENTS.md` has real rows,
  `ui-boundary-guard` the day a `features/` directory appears beside `ui/` or `components/`,
  `content-terminology-guard` when the terminology table has a real row. When one comes due at the
  same moment as another offer, it joins that one list. What each needs to say, and why each earns a
  hook: [`reference/guards.md`](reference/guards.md).
- **JIT — only scaffold when needed.** Don't init tokens before there's UI to use them. The
  loop's entry predicate is the trigger; don't pre-empt it.
- **Override is recorded, not blocked.** A founder skipping this skill is legitimate; record
  in devlog with substantive rationale.
- **Run the 5-token distinctiveness pass.** Three layers prevent drift; the 5 overrides prevent
  *sameness* (the generic-AI-app look). Both, not one. The "signature token" is the brandable one.
- **Name by purpose; `tokens.json` is DTCG, always, and the stack file is derived from it.**
  Semantic tokens reason about intent (`color.text.error`), not hue (`color.red.500`); DTCG keeps it
  portable (no lock-in) and is the file a design tool imports.
- **Cite the field.** Brad Frost (Atomic Design), Nathan Curtis (layer-cake + purpose-naming), W3C
  Design Tokens Community Group (DTCG stable). 2026 distinctiveness tactic per the AI-UX scan. Not
  BOSS's inventions — applied with build-integration. Interaction-layer companion:
  `boss craft ai-ux-patterns`.
