---
id: PRACTICE-design-system
type: practice
owner: designer
status: active
host: stack-neutral
provenance: generalized from the dhun dogfood design system (DESIGN_TOKENS as single source of truth, central badge/pill style utils, the "no raw Tailwind colors" enforcement hook, the prototype REGISTRY), de-dhuned for reuse — BOSS v0.20.x. The AI-failure-mode catalog was added in the same pass; IDEA-010 carries the BOSS-specific design (loops, cohort-aware scaffolding, prompt patterns). Frontmatter added 2026-07-30 (v0.135.0) — this doc predated the practice frontmatter convention, which is why no refresh discipline could see it.
last_reviewed: 2026-06-20
review_by: 2027-06-20
curve: craft
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

> Adapted from Anthropic's own `frontend-design` skill via [RVW-014](../../docs/research/verdicts/RVW-014-frontend-design-aesthetic-ambition.md).
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
5. **Prototype reuse.** Prototypes import the *same* tokens + a component registry, so a mockup
   looks like the product and graduates to code cleanly. (dhun: prototype `REGISTRY.md`.)

## Enforcement — just-in-time

- **Quickstart / MVP:** no design enforcement. Hardcoded styles in a throwaway are fine; don't
  impose ceremony unearned. But the *moment* a UI is worth keeping, create the tokens file so style
  is decoupled from the very first commit that matters.
- **V1:** enforcement turns on. A `PostToolUse` hook flags hardcoded style values (e.g. raw colour
  classes) and points at the token instead. `/design-review` before code, `/ux-check` after.
  Agents `ui-designer` (token/visual authority) + `ux-designer` (flows, the 5 states) unlock here.
- **Scale:** design drift audits, token versioning, multi-surface theming.

## To author (when V1 mode is built)

- `template/docs/design/DESIGN_TOKENS.md` (+ a tokens file in the chosen stack's format)
- `template/docs/design/STYLE_GUIDE.md`, component-audit + state checklist
- `template/.claude/skills/design-review/`, `ux-check/`, hook for hardcoded-style detection
- `ui-designer` + `ux-designer` agents
- a prototype registry + the rule that prototypes consume the token system
