---
name: design-tokens-init
description: Scaffold the minimal three-layer design token system at the first UI commit. Prevents the 47-blues / pattern-reinvention / billion-line-drift failure modes that happen by default when AI generates UI without discipline (IDEA-010). Cohort-aware delivery — vibe-coder-newbie gets SHOWING; eng-builder gets OFFERING; vibe-virtuoso gets OVERRIDE-FRIENDLY. JIT — runs when design-tokens-loop opens. Usage - /design-tokens-init
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

Read `docs/ideas/CANVAS.md` Promises cell. The brand voice declared there should anchor the
*choice of primitives*. Don't default to Tailwind blues; pick primitives that match the
declared brand. If the canvas's Promises cell is `_(not yet)_`, flag it — design tokens without
a brand anchor will drift back to internet-defaults.

### The 5-token distinctiveness pass (2026 — the "shadcn trap" fix)

The fastest tell of a generic AI app: shadcn defaults straight out of the box — slate neutrals,
Inter, 8px radius, indigo accent. AI codegen reaches for these because they're the internet
average. Five deliberate overrides break the sameness without a redesign — do this *as part of
picking primitives*, anchored to the canvas Promises cell:

1. **Warm (or cool) the neutral scale** — pick a neutral with a temperature, not pure slate gray.
2. **Choose a radius on purpose** — sharp (0–2px) or soft (12px+), not the default 8.
3. **Intentional type pairing** — one characterful display/heading face + a clean body face; not
   Inter-on-Inter.
4. **One saturated accent** the brand owns — a single confident color, not indigo-by-default.
5. **One "signature token" the defaults omit** — a texture, a shadow language, a custom easing
   curve. This is the brandable one; it's what makes the UI *yours*.

Cohort-aware: `vibe-coder-newbie` / `first-product` → just *do* the 5 overrides and show the
before/after. `eng-builder` / `vibe-virtuoso` → *offer* them as a checklist, override-friendly.
`domain-expert` → keep it sober; distinctiveness ≠ playful when the stakes are clinical.

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

   Ship it now, even mostly-empty with the headings and two filled principles. `/design-review`,
   `ui-designer` and `ux-designer` all *read* this file — it is not optional scaffolding, it's the
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

2. The `design-tokens-loop` exit predicate now passes — loop closes.

3. Going forward, `design-drift-loop` (V1) watches for drift (raw hex codes appearing, near-
   duplicate components, tokens file untouched while components grow).

## Rules

- **Three layers, not two.** Two-layer (primitives → component) is fragile under AI generation.
  Three layers (primitives → semantic → component) gives AI a meaningful name to grab.
- **Brand-anchor the primitives.** Don't default to internet-aesthetic. Canvas Promises cell IS
  the brief.
- **Tokens file LIVES in the prompt context.** When asking AI for UI work, *always* pass
  `DESIGN_TOKENS.md` as context. This single discipline prevents 80% of the drift — **and the
  remaining 20% is where the 47 blues actually live**, because a prompt convention is a *filter*
  (it depends on every future prompt remembering), not a boundary.
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
  > color the moment it's written and hands Claude your token names instead. It stays silent unless
  > this tokens file exists, and it costs a process per file write."*

  If yes, add the `PostToolUse` block from the header of `.claude/hooks/design-tokens-guard.js` to
  `.claude/settings.json`. If no, **drop it and don't re-ask** — the tokens file alone is a real
  choice, and `boss hooks` will still list it whenever they want it.
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
