---
id: IDEA-010
type: idea
owner: product-lead
status: shipped
program: design-system
proof: library/practices/design-system.md
created: 2026-05-23
---

# Scalable AI-assisted design — tokens, drift, and the prompt patterns that prevent the 47 blues

> Captured after Ajesh named a real failure mode: *"a lot of people with no design skill ask
> Claude to code up their design and give rudimentary designs, and then UX/UI patterns keep
> breaking — even how to use design tokens, how to standardize colors, how to create scalable
> design that doesn't create a billion lines of code."*
>
> Same shape as [IDEA-009](IDEA-009-proto-personas-as-evolving-instruments.md): honest field
> survey first, BOSS's narrower contribution claim second, phases mapped to the existing
> roadmap.

## The failure modes Ajesh named (in BOSS's words)

The catalog — each is a specific failure mode worth naming:

| Failure | What it looks like |
|---|---|
| **Rudimentary first design** | Founder asks Claude for a login screen. Claude generates generic defaults — Tailwind blues, default spacing, no thought to product context. Looks "ok" at one screen; falls apart by three. |
| **The 47 blues** | Each new screen, Claude derives slightly different colors. By screen 15, the codebase has `bg-blue-500`, `#3B82F6`, `bg-blue-600`, `rgb(59, 130, 246)`, plus a custom CSS variable. No single source of truth. |
| **Pattern reinvention** | Each new component is its own file with its own styles. No reuse; no shared primitives. Adding a button creates `Button.tsx`, then later `CTAButton.tsx`, then `PrimaryButton.tsx` — all near-identical. |
| **Billion-line drift** | Symptom of all of the above. The codebase grows linearly with screens instead of approximately constant after the primitives are built. AI doesn't generalize across requests. |
| **Missing states** | Default/hover/active/disabled/empty/loading — at least one always missing. Especially the empty + loading states (the most user-facing failures). |
| **Brand-default problem** | AI defaults to generic-internet aesthetics because that's the training data. Your brand voice never makes it into the design unless you bring it. |

These are real, common, and currently *handled by AI tools poorly* unless the founder knows to
do otherwise. The intervention BOSS could make is *prevention via discipline + scaffolding*,
not detection after the fact.

## What's already published (honest field survey, 2025-2026)

The AI-design-failure-mode literature is **more developed than the AI-personas literature was**
when IDEA-009 surveyed it. Specific recent writing:

- **Boldare** — *"Design System for AI-Assisted Development"* — explicit failure modes named:
  context loss, token ignorance, brand-default problem.
- **uxmagic.ai** — *"Can AI Follow Design Tokens? The Honest Answer"* — direct treatment of
  the question. Argues YES with proper architecture; NO with naive prompting.
- **Mageswari (Medium)** — *"AI Design Systems: Why Tokens, Schema & Generative Rules
  Matter Now"* — articulates the three-layer token architecture and the "semantic translator"
  concept AI needs.
- **intodesignsystems.com** — runs *"AI Conference for Designers 2026"* — the field is
  conferencing on this.
- **Brad Frost** — Atomic Design (foundational, pre-AI but applies). Has written more
  recently on Twitter about AI generation and atomic discipline. **Now on the BOSS practitioner
  roster** (`docs/mentor-practitioners.md` Builders → designer agent, design-systems section).
- **Nathan Curtis** (EightShapes) — design tokens canonical work, including layer-cake
  architecture (global / alias / component); governance models for systems that don't decay.
  *On the roster.*
- **Jina Anne** — W3C Design Tokens Community Group chair; tokens evangelism. *On the roster.*
- **Diana Mounter** — GitHub Primer leadership; design systems at scale; AI-aware system
  design. *On the roster.*
- **Dan Mall** — design systems consulting; hot takes on which systems ship vs. decay. *On
  the roster.*
- **W3C Design Tokens Community Group** — the canonical token format spec.
- **John Maeda** — *Design in Tech* reports; laws of simplicity applied to AI design tooling.
  *On the AI-augmented design roster.*
- **Christopher Noessel** — *Designing Agentive Technology* — UX patterns for AI agents acting
  on behalf of users. The most-directly-relevant book for BOSS's own design discipline. *On
  the roster.*
- **Linus Lee** (Notion AI), **Karri Saarinen** (Linear), **Maggie Appleton**, **Geoffrey
  Litt**, **Sarah Drasner** — voices on practical AI-tool design + AI-workflow integration.
  *On the AI-augmented design roster as of v0.20.x.*

Specific failure modes already named in the field:

- **Context loss and token ignorance.** "AI tools like Claude Code and Figma Make don't know
  your spacing scale or which modal variants your team standardized on."
- **Two-layer-systems-are-fragile.** Flat tokens (just primitives, no semantic layer) → AI
  picks the easier path → hex codes in code. Three-layer (primitives → semantic → component)
  is the AI-tolerant minimum.
- **Context rot.** When token rules are buried in long context, the model takes the easier
  path and ignores them.
- **Governance and system drift.** Within months, teams add components ad-hoc, tokens drift.
  Without governance, the system is a time-limited asset.
- **The brand-default problem.** AI defaults to internet-averages — generic-modern blues,
  generic spacing — not the brand's specifics.

So: the **failure mode catalog is mostly known.** What's *not* well-developed:

- **Build-integration as a continuous discipline.** Most published advice is *upstream design
  system work* OR *retrospective audits*. Neither is integrated with the build loop the way
  BOSS's primitives could be.
- **Cohort-aware intervention.** The published advice assumes a knowledgeable team; doesn't
  address that a first-time builder needs SHOWING + a vibe-virtuoso needs OVERRIDE-FRIENDLY
  + a non-tech-founder needs PLAIN-LANGUAGE.
- **Formalized prompt patterns paired with token context.** "Always pass the tokens file" is
  spoken about; not encoded as a skill or convention founders inherit by default.
- **Early-start scaffolding at the *first UI commit*.** Most published guidance assumes you
  start with a design system. BOSS would *create* one *when* the founder needs it (the JIT
  principle applied to design).

## What's actually novel in BOSS's frame (calibrated, narrow)

Four claims — each calibrated against the field above:

### 1. Build-integration as a continuous loop discipline

**Field norm:** design systems are upstream work; AI-design failure detection happens via
periodic audit (or never).

**BOSS's contribution:** apply the IDEA-008 loop primitive to design discipline. Two specific
loops authored for MVP/V1 templates:

- **`design-tokens-loop`** (MVP-stage, structural-or-with-drift): entry = any component/page
  file with style declarations exists; exit = `docs/design/DESIGN_TOKENS.md` exists + tokens
  referenced by name in code (not raw hex). Drift moment = `restraint` (premature ceremony
  on new components without tokens) or new moment `coherence`.
- **`design-drift-loop`** (V1-stage onwards, drift-emitting): entry = tokens file exists;
  drift signal = count of raw hex codes / count of near-duplicate components / tokens file
  untouched while components grow. Drift moment = new moment `coherence` (drift between
  declared system and shipped code).

The loop primitive makes this *continuous* — the conscience surfaces drift early, when it
costs five minutes to fix; not at audit time, when it costs five days.

### 2. Cohort-aware design intervention

**Field norm:** published advice assumes a knowledgeable team — designer + engineer pair.

**BOSS's contribution:** the design discipline lands differently per cohort (per the v0.20
cohort-aware conscience). Each cohort gets a different scaffolding shape when
`design-tokens-loop` opens:

- `vibe-coder-newbie`: SHOW — generate a minimal `DESIGN_TOKENS.md` + one example component
  refactored to use it. The teaching IS the intervention.
- `first-product`: DEFINE TERMS — what *is* a token, why does this matter, with the smallest
  possible setup. Teach, don't grade.
- `eng-builder`: OFFER — "want me to scaffold the three-layer token system now or later?"
  with inspect affordance.
- `vibe-virtuoso`: OVERRIDE-FRIENDLY — "you know this; here's the override pattern; record
  why you're not doing tokens this round" (and the conscience respects).
- `indie-hacker`: RIGHT-SIZED — "minimum system that doesn't lock you in; portable to any
  stack."
- `returning-founder`: SKIP THE 101 — "tokens setup is one command; here it is."
- `non-tech-founder` / `domain-expert`: COACH IN PLAIN LANGUAGE — describe the failure that's
  coming if you don't do this; offer the fix with caveat-friendly language.

This per-cohort tailoring is **not in the published field.** Worth claiming.

### 3. Formalized AI-prompt patterns for UI work

**Field norm:** "always pass the tokens file" is spoken about but not encoded as a discipline
the tool inherits.

**BOSS's contribution:** a `/design-prompt` skill (or a prompting-pattern doc the founder
inherits) that encodes:

- *"Before asking for a new component, check if the pattern exists."* — Prompt:
  *"Search `src/components/` for components similar to <X>. If found, reuse; if missing one
  feature, extend. If genuinely new, create — but match the existing token + spacing
  vocabulary."*
- *"Pass the tokens file as context every time."* — Auto-inject `DESIGN_TOKENS.md` when the
  user asks for UI work.
- *"Specify all 5 states explicitly."* — Default/hover/active/disabled/empty for every
  interactive element, before the AI gets a chance to skip them.
- *"Reject 'make it pretty.'"* — A vague aesthetic prompt invites the brand-default problem.
  The skill nudges toward *"match brand X (which the canvas Promise cell names) — specific:
  rounded corners, low contrast, warm palette"* etc.

This is the prompt-coach pattern (BOSS-internal builder agent v0.17) applied to design.
**Possibly novel** as an encoded skill — most field advice is descriptive ("you should...")
not prescriptive (a tool's default workflow).

### 4. Early-start JIT scaffolding (the "first UI commit" inflection)

**Field norm:** "design enforcement turns on at V1" (which is also the existing
`library/practices/design-system.md` line). But by V1, the drift has already accumulated.

**BOSS's contribution:** at MVP stage, the `design-tokens-loop` is *structural* (no drift
signal, no nag) UNTIL the founder's project crosses *the first UI commit threshold*. At that
moment, the loop opens and offers (cohort-aware) to scaffold the minimal token system. **JIT
applied to design.**

The detection mechanism (in IDEA-008 predicate terms):
- Entry predicate: `count_at_least` of style declarations across source files (rough proxy
  for "UI is happening")
- Exit predicate: `exists` of `docs/design/DESIGN_TOKENS.md` AND `count_at_least` of token
  references in code

When entry-met + exit-unmet → drift signal. The conscience composes a cohort-aware nudge.
The founder either runs `/design-tokens-init` (a new skill that scaffolds the minimal system)
or overrides (recorded in devlog).

The cleanness here: design discipline arrives JIT — *not* when the project starts (premature)
and *not* at V1 (too late) — but when the first UI begins to take shape.

## How this connects to existing BOSS work

- **`library/practices/design-system.md`** — already exists; well-written for the classical
  case. Phase 1 of this IDEA updates it to NAME the AI failure modes + reference the field
  survey above + cite the new loops/skill when authored.
- **`mentor-architect`** — already cites AI-native practitioners. Could extend to cite design-
  system AI practitioners (Boldare, Nathan Curtis, Brad Frost on AI generation).
- **`designer` builder agent (BOSS-internal, v0.17)** — exists for BOSS's UX. A *project-side*
  `designer` agent would arrive in V1 mode per the existing roadmap (v0.22). Could move
  earlier if v0.21 needs it.
- **`prompt-coach` (BOSS-internal, v0.17)** — analogous design-prompt patterns could
  graduate into a generalized prompt-coach for scaffolded projects (parallel to BOSS-internal),
  or stay focused as `/design-prompt`.
- **The persona reactions in v0.19** — confirmed cohort divergence in design intervention
  needs. `vibe-coder-newbie` doesn't know what tokens are; `eng-builder` would want the
  three-layer architecture out of the box. Cohort-aware framing IS the design-discipline
  delivery mechanism.

## Concrete next moves (phases, mapped to the published roadmap)

### Phase 1 — small (v0.20.x docs)

**Update `library/practices/design-system.md`** to:
- Name the 6 AI-specific failure modes explicitly with the failure mode catalog at the top
- Add a "What the field has written" section pointing at Boldare, uxmagic.ai, Mageswari, etc.
- Add a "Cohort-aware scaffolding" section noting that the intervention SHAPE varies by cohort
- Reference IDEA-010 as the live design for the future loops + skills

Cost: ~30 min of doc work. Cleanest first step; gets the AI-failure-mode catalog on the record
where the existing practice already lives.

### Phase 2 — design-tokens-loop in MVP template (v0.21)

When v0.21 (MVP discipline upgrades) ships, include:
- `stages/L1-mvp/template/.boss/loops/design-tokens-loop.md`
- A minimal `template/docs/design/DESIGN_TOKENS.md` STARTER (placeholder; created when loop
  scaffolds)
- A `/design-tokens-init` skill that the loop's exit work uses
- Eval examples for the new loop (predicate-based)

Cost: substantial. Pairs naturally with `/spec` + `/evals` + `/pretotype` v0.21 work.

### Phase 3 — design-drift-loop + ui-designer + ux-designer agents (v0.22, V1 mode)

Per the existing `library/practices/design-system.md` plan:
- Full design system enforcement (PostToolUse hook flags hardcoded styles)
- `ui-designer` (token / visual authority) + `ux-designer` (flows / states) agents
- `/design-review` before code, `/ux-check` after
- Component audit + state checklist
- Prototype registry

The existing practice doc has most of this scoped. Phase 3 is *executing* the existing plan
with the AI-failure-mode catalog folded in.

### Phase 4 — `/design-prompt` skill (v0.22 or v0.23)

Encodes the prompting patterns. Either as a separate skill or folded into `/design-review` /
`/spec`'s coaching. Decision deferred until v0.22 work surfaces what's natural.

### Phase 5 — external publishing (v0.24+ externalization)

If BOSS has used this on 3+ external projects by then: write up as
`library/practices/scalable-ai-design.md` standalone (separate from the classical
design-system.md), publish as blog / arXiv. Acknowledge field honestly; claim narrowly.

## Open questions

- **Is the new `coherence` moment (system-vs-code drift) a real new moment, or a flavor of
  `caution`?** Worth a small spec call before authoring.
- **Stack-coupling problem.** Design tokens look different in Tailwind / Mantine / Chakra /
  vanilla CSS / styled-components / Stitches. The `design-tokens-loop` needs to be stack-aware
  OR stack-agnostic with a stack-specific runner. Lean stack-agnostic with per-stack adapters
  in `library/practices/scalable-ai-design/<stack>.md`.
- **Where the brand voice comes from.** The brand-default problem is real. BOSS's canvas
  has a Promises cell; could the tokens loop READ the canvas's Promises + Story to generate
  a brand-anchored starter (vs. internet-default)? Possible novel angle.
- **Lovable / v0 / Bolt overlap.** These tools have opinions about design system scaffolding
  baked in. BOSS is downstream of them (operates in Claude Code, not the design tools). The
  intervention needs to handle the case where the founder's code originated in v0 and has
  the v0-defaults already baked. Adoption story (per IDEA-005 brownfield).
- **Persona file split for design-skill?** Today the 8 personas don't distinguish design
  fluency vs. eng fluency. `eng-builder` might be design-savvy or not; same for `non-tech-
  founder`. As real evidence arrives, may want a `design-skill` axis added to the cohort
  declaration.

## Status

`exploring` — captured the failure mode catalog, calibrated against the field, named 4
specific BOSS contributions, sketched 5 phases mapped to the existing roadmap. **Not promoting
to FEAT yet.** Phase 1 (practice-doc retrofit) can ship now as docs follow-up. Phase 2+ waits
for v0.21+ work.

## Canvas

_Covered by BOSS's overall canvas ([CANVAS.md](CANVAS.md))._
