---
id: IDEA-012
type: idea
owner: product-lead
status: shipped (adopted as the working backlog, 2026-05-23 — the record says so in its own body)
gist: A pause to re-examine a roadmap sketched six capability releases ago, and check whether the remaining queue still captures the right things.
proof: none
proof_note: Produced a 30+ candidate catalog that became the working backlog. The backlog is the artifact; there is no single file.
created: 2026-05-23
---

# Strategic feature audit + revised roadmap

> Ajesh's call after the v0.22 architectural audit (IDEA-011) + the v0.23 README rewrite:
> *"BOSS.DK was just a back-pocket idea. I think we need to find more KEY FEATURES, roadmap
> and planning."*
>
> Same shape as IDEA-009/010/011: capture the question, audit honestly, claim narrowly, plan
> phases. **Different in two ways:** (1) this isn't one feature — it's a wider audit + a
> roadmap re-shape; (2) the most important finding may turn out to be that *the gap isn't a
> missing feature; the gap is a missing positioning*.

## Why audit now

The published roadmap (v0.24+ — Scale mode, moment #3, IDEA-003 finish, externalization,
backlog) was sketched at v0.17 alongside the personas + designer additions. It hasn't been
re-examined since. **Six capability releases (v0.18 → v0.23) have shipped against a 2-release-
old roadmap.** That's normal during execution; it's worth pausing now to check whether the
remaining queue still captures the right things.

Specifically: IDEA-009 (proto-personas), IDEA-010 (scalable AI design), IDEA-011 (override
discipline) each captured patterns the v0.17 roadmap didn't have. The persona reactions
surfaced cohort-specific needs that informed v0.20 but didn't reshape the larger queue. The
README rewrite (v0.23) opened the externalization surface — which changes what the next
"missing" feature actually is, since some gaps were "no one can find BOSS" gaps and that's
now partly addressed.

**Hypothesis (worth testing in the audit):** the roadmap has drifted. Some queued items may
be wrong-order; some unqueued items may be more load-bearing than anything currently
prioritized.

## The feature-gap catalog (the substantive section)

Honest brainstorm of capabilities BOSS doesn't have today. Organized by category. **The
catalog is not a commitment to ship all of these** — its value is forcing the question
*"which 3-5 matter most"* rather than continuing through the published queue by default.

Each candidate is tagged:
- **BOSS-distinctive** — the loops/conscience/mentor angle gives BOSS real leverage here
- **Better elsewhere** — probably solved well by other tools; integration > reinvention
- **Mixed** — partially both

### A. Build-shipping discipline (close to the metal)

| Candidate | Tag | Note |
|---|---|---|
| Test generation / coverage discipline beyond `/smoke` | BOSS-distinctive | `/evals` exists for AI; classical test discipline as a loop could mirror it. `coverage-loop` open when test ratio drops below threshold. |
| Deploy automation (`/deploy` skill) | Better elsewhere | Vercel/Railway/Fly all have first-class CLIs. BOSS should *coach the choice + record the decision*, not re-invent. |
| CI pipeline scaffolding | Mixed | GitHub Actions templates are everywhere; BOSS-distinctive contribution is *which checks belong in CI vs. local* — a loop that gates the answer. |
| Release management (`/release` skill, changelog gen, semver discipline) | Mixed | semver tools exist; BOSS-distinctive is *the discipline of writing the CHANGELOG entry as user-facing prose first, version-bumping second* — BOSS does this on itself; would generalize. |
| Database migration discipline | BOSS-distinctive | `db-architect` exists (v0.22); no skill or loop around the *practice* of migration-before-code, additive vs. destructive, rollback plans recorded. Loop-shaped naturally. |

### B. Production reality

| Candidate | Tag | Note |
|---|---|---|
| Observability — telemetry, logging, error tracking | Better elsewhere | Sentry/Honeycomb/Datadog/etc. are real tools. BOSS-distinctive contribution: a `/observability-decide` skill that picks the smallest viable setup for the cohort + stage. |
| Performance budgets (FE/BE) | Mixed | Lighthouse + standard tools exist; BOSS-distinctive: a `performance-loop` that drifts when budgets are violated, just as `design-drift-loop` drifts on raw hex codes. |
| **AI cost tracking** | **BOSS-distinctive — high priority gap** | Currently zero coverage. Every AI-native app needs to know its prompt costs per user / per feature / per cohort. A `/ai-cost` skill + a `cost-budget-loop` would be uniquely BOSS-shaped (cohort-aware budgets, override discipline on overages). **This is probably the single biggest "obviously needed" feature BOSS is missing.** |
| Security audit baked in | Mixed | `/security-review` exists as a Claude Code skill; BOSS-distinctive: when to run it (a loop that opens when net-new auth surfaces land). |
| Accessibility audit | Mixed | `/ux-check` covers some of this; could split into `accessibility-loop` (separately drifty) when WCAG violations exceed threshold. |

### C. Common app primitives (things every product needs)

| Candidate | Tag | Note |
|---|---|---|
| Auth scaffolding (Clerk/Supabase/NextAuth patterns) | Better elsewhere | Those services already scaffold. BOSS-distinctive: an `auth-decide` skill that picks the right one for the cohort + stack + privacy needs. |
| Billing / payments (Stripe scaffolding) | Better elsewhere | Stripe + Paddle scaffold themselves. BOSS-distinctive: gating ("are you ready to charge? mentor-business has thoughts"). |
| Email / notifications (transactional patterns) | Better elsewhere | Postmark / Resend scaffold themselves. BOSS-distinctive: the *humane patterns* (no surprise emails; consent UX; rate-limiting). |
| **End-user onboarding flows** | **BOSS-distinctive** | `/boss` spins up a *project*; there's no analog for spinning up a *user inside* the scaffolded product. An `/onboarding-design` skill paired with `ux-designer` could be uniquely BOSS-shaped (5-state requirement applied to onboarding screens; cohort-aware tone). |
| Analytics / events instrumentation | Mixed | Tools exist; BOSS-distinctive: the *what-to-instrument* question via a loop tied to FEAT acceptance criteria. |
| Documentation generation | Mixed | TypeDoc / JSDoc / Docusaurus exist; BOSS-distinctive: *which docs matter at which stage* (Quickstart: zero auto-docs; V1: API reference; Scale: full doc site). |

### D. App-archetype templates (bigger primitives)

| Candidate | Tag | Note |
|---|---|---|
| B2B SaaS template | BOSS-distinctive | A starter that bakes in auth + billing + admin + email + observability — but only with the *decisions recorded* + the canvas-validated upstream. The template is a *FEAT-bundle*, not a code-bundle. |
| Marketplace template | BOSS-distinctive | Same shape — opinionated about two-sided dynamics, supply-side onboarding, demand-side liquidity early. |
| Content site / blog | Better elsewhere | Astro / Hugo / Eleventy do this well. BOSS shouldn't compete. |
| Internal tool template | Mixed | Retool / Internal exist; BOSS-distinctive: an opinionated stack for "the founder's own admin." |
| **AI-first product template** | **BOSS-distinctive — high priority** | BOSS's own home turf. Bakes in eval discipline + structured outputs + cost tracking + cohort-aware UX + AI-failure-state design *from day one*. This is the template that earns BOSS its name. |

### E. Legal / compliance / dignity scaffolds

| Candidate | Tag | Note |
|---|---|---|
| Privacy policy template | Mixed | Lots of generators exist; BOSS-distinctive: the policy *matches what the project actually does* (read from manifest + data declarations) rather than being a copy-paste. |
| Terms of service template | Mixed | Same as privacy. Caveat: BOSS routes to real lawyers; this scaffolds the *first draft*, not the final. |
| GDPR/CCPA primitives | BOSS-distinctive | Data export / deletion / consent UX as *first-class artifacts* in the V1+ template — most projects retrofit these badly. |
| Domain-specific compliance starting points (HIPAA / FERPA / PCI awareness) | BOSS-distinctive | Caveats + routing to real legal counsel, NEVER actual compliance. But for `domain-expert` cohort: a `/compliance-check` skill that surfaces the right questions for the domain. |

### F. Outward-facing surfaces

| Candidate | Tag | Note |
|---|---|---|
| Marketing site scaffold | Better elsewhere | Astro / Framer / Webflow do this. BOSS-distinctive: a `landing-page-decide` skill that picks the smallest viable surface per cohort + canvas Promises voice. |
| Documentation site scaffold | Better elsewhere | Docusaurus / Mintlify / GitBook scaffold. BOSS-distinctive: same — which surface, when, with what content discipline. |
| Open-source contribution path scaffold | BOSS-distinctive | When a project graduates to taking contributors, BOSS-distinctive surface: a `/contributors` skill that authors CONTRIBUTING.md + good-first-issue labels + welcome flow + attribution discipline. |

### G. Existing-codebase support

| Candidate | Tag | Note |
|---|---|---|
| **Brownfield adoption (`boss adopt`)** | **BOSS-distinctive — IDEA-005 already captured** | The biggest under-shipped distinctive feature. Today BOSS is greenfield-only; `boss adopt` would let an existing project declare its current state + accept BOSS loops/conscience selectively. |
| Migration between modes (downgrade? branch?) | BOSS-distinctive | `boss unlock` is one-way today. A founder who unlocked V1 prematurely should be able to step back. |
| Project-to-project pattern copy | BOSS-distinctive | `/boss-learn` does *pattern → library*; not *project → project*. When a founder has two BOSS projects and learns something on one, copying to the other today requires manual + `boss sync` round-trip via the library. |

### H. Architecture extensions

| Candidate | Tag | Note |
|---|---|---|
| **Host portability (IDEA-006)** | **BOSS-distinctive — already captured** | Naming the host contract so a future port to non-Claude-Code is plausible. Small spec; not a port — just the contract. |
| Multi-stack pattern adapters | BOSS-distinctive | `design-tokens-loop` regex catches React/Vue/Svelte/Solid; need Python / Go / Rust / Mobile patterns. Each is a small per-stack edit to the loop spec; BOSS-distinctive contribution is the *registry of adapters* in `library/practices/<stack>/`. |
| Cross-project mentor memory | BOSS-distinctive | A mentor advising on project B remembers what the founder said on project A. Storage / privacy decisions are real; would be a Phase 3+ kind of thing. |
| Persona evolution mechanism | BOSS-distinctive | IDEA-009 Phase 2+ — when real-founder evidence arrives, structured way for personas to absorb it without blurring synthetic/real attribution. |
| **The library expansion (IDEA-003 finish)** | **BOSS-distinctive — already captured** | The full practitioner roster encoded UP as named loops, not free-floating practice docs. Reshape per IDEA-008. |

### I. Founder-experience polish

| Candidate | Tag | Note |
|---|---|---|
| Per-loop opt-out as first-class | BOSS-distinctive | IDEA-011 Phase 2. `boss conscience disable <loop-id>` instead of editing the spec. |
| Hook performance instrumentation | BOSS-distinctive | IDEA-011 Phase 2. Measured today: unknown. Should be <100ms. |
| Override-pattern discoverability | BOSS-distinctive | IDEA-011 Phase 2. When the conscience speaks, surface "override is always available" in-context, not just in docs. |
| First-time BOSS-user onboarding flow | BOSS-distinctive | A founder running `boss new` for the first time today gets the scaffold + a CLAUDE.md. No *introduction* to BOSS itself — what to do first, what the personas are for, etc. A `/welcome` skill (or `boss new` post-script) could land it. |

### J. Mentor / persona / conscience evolution

| Candidate | Tag | Note |
|---|---|---|
| **Real-evidence integration mechanism** | **BOSS-distinctive — IDEA-009 Phase 2+** | When the override on conversation-loop lifts, *how* does real-founder evidence land in the persona files without blurring synthetic/real? A `/persona-update` skill is one shape. |
| Cohort-aware skill text | BOSS-distinctive | Today cohort-aware applies to the conscience hook's `additionalContext`; skills themselves are not cohort-aware. The `/triage` exemplar voice could vary per cohort (this came up in v0.20). |
| **Mentor consults as structured flows** | **BOSS-distinctive — high priority** | Today: "talk to mentor-X" is a single agent invocation. The advisory-pass-001 doc IS a structured multi-mentor flow, but it was done by hand. A `/consult` skill that orchestrates 2-3 mentors in sequence around a specific question would be a uniquely BOSS-shaped capability. |
| Continuous mentor / persona auto-evolution | BOSS-distinctive | Phase 3+ — patterns the founder repeatedly overrides become signal for adjusting the mentor's defaults. Too early to build; worth naming. |

## Persona-reactions overlay (sketch)

For each major category, which cohorts would react most strongly. Not a full reactions-loop pass
— that would be a separate session — but a calibrated sketch:

| Category | cohorts that care most | cohorts that don't |
|---|---|---|
| **B. AI cost tracking** | all of them — universal AI-native concern | none |
| **D. AI-first product template** | vibe-virtuoso, first-product, non-tech-founder | indie-hacker (already opinionated), eng-builder (rolls own) |
| **G. Brownfield adoption** | returning-founder, eng-builder, indie-hacker (have existing projects) | first-product, non-tech-founder (no existing projects yet) |
| **J. Mentor consults as structured flows** | first-product, non-tech-founder (most coaching benefit), returning-founder (respects structured advisory) | vibe-virtuoso (deflects coaching) |
| **C. End-user onboarding flows** | all of them — universal product concern | none |
| **E. GDPR/CCPA + domain compliance** | domain-expert (urgent), eng-builder (responsible), non-tech-founder (anxious about getting it wrong) | first-product, vibe-virtuoso (premature) |
| **I. First-time BOSS-user onboarding** | first-product, non-tech-founder, vibe-coder-newbie | returning-founder, eng-builder (intolerant of basics) |
| **A. Database migration discipline** | eng-builder (familiar), returning-founder (battle-scarred), db-architect cohort | first-product, non-tech-founder |

**Convergences worth noting:**
- **AI cost tracking** lands for *every* cohort. That's rare and significant.
- **AI-first product template** lands for the *needs-most-scaffolding* cohorts (vibe-virtuoso,
  first-product, non-tech-founder) — exactly the cohorts BOSS most wants to serve well.
- **Mentor consults as structured flows** lands for the *coaching-receptive* cohorts —
  high-leverage there.
- **First-time-BOSS onboarding** lands for the cohorts most likely to bounce off BOSS today.

## Killer-use-case articulation — *the deeper finding*

The audit was meant to surface missing features. It surfaced something else:

**The most acute gap may not be any feature on this catalog. It may be that BOSS doesn't yet
have a *one-sentence killer use case* that distinguishes it from "Cursor + a folder."**

Today's positioning surfaces (the new README, the canvas, the practitioner roster) describe BOSS
*well* but don't compress it into a sentence that makes a stranger say *"that's the thing I
needed."* Several candidates exist:

- *"BOSS is the tool that nudges you to validate before you build, without imposing ceremony
  you haven't earned."*  — accurate but mouthful; doesn't land
- *"BOSS is the discipline that doesn't fight you when you're in flow."* — closer; still vague
- *"BOSS is what happens when the conscience of a senior founder ships in your CLI."* — has
  voice; possibly too writer-y
- *"BOSS is a calm-company alternative to scaffolders that turn you into a developer of the
  framework."* — clear positioning vs. enterprise scaffolds; misses the conscience

**None of these are killer.** A founder hearing any of them would nod politely; none would
say "I need that."

The Dunford exercise (from v0.15 advisory pass — never actually executed) is the right move
here: *what does the target founder use today, and what's the differentiated value vs. that*.
The answer would shape the next 3-5 feature decisions more than any item in the catalog.

**Therefore the IDEA-012 finding worth claiming:** the catalog matters less than the
positioning. **Run the Dunford exercise next.** Use the catalog after, to pick which 3-5
features serve the sharpened positioning.

## Revised roadmap (v0.24+ — supersedes the v0.17 sketch)

Based on the audit + persona overlay + killer-use-case finding:

### v0.24 — Positioning pass (NOT a feature release)

**The Dunford exercise, executed.** A focused dossier at `docs/dossier/positioning-pass-001.md`
that:
- Names what BOSS's target founder uses today (alternatives), specifically not aspirationally
- Names what BOSS does *uniquely well* vs. each alternative
- Produces a one-sentence killer description that survives the "stranger read" test
- Cohort-tailored variants for each persona (vibe-virtuoso version, first-product version, etc.)
- Updates the README's opening if positioning shifts
- Output: a positioning that the next 3-5 feature decisions can be calibrated against

**Why this before any feature:** building more without sharpening positioning compounds the
build-trap. The persona-reactions in v0.19 already showed cohort divergence; positioning is
how those divergences resolve into "BOSS is for whom, doing what."

### v0.25 — AI cost tracking (the universal-cohort feature)

Per the persona overlay, **AI cost tracking is the only candidate every cohort cares about**.
Build:
- `/ai-cost` skill — instruments LLM calls in the user's app
- `cost-budget-loop` — drifts when prompts-per-user or cost-per-feature exceed declared budgets
- Per-cohort defaults — first-product gets a tight budget (avoid runaway); vibe-virtuoso gets
  inspect affordance (show me the numbers); domain-expert gets compliance overlay
- Pairs with `mentor-architect` (architecture decisions affected by cost) and `mentor-business`
  (unit economics)

### v0.26 — One of: AI-first product template OR brownfield adoption

Both are high-priority BOSS-distinctive. Choose based on what v0.24's positioning surfaces:
- If positioning leans "BOSS as the AI-native scaffolder," ship AI-first template
- If positioning leans "BOSS as the discipline tool that adopts existing projects," ship `boss
  adopt` (IDEA-005)
- The v0.25 + v0.26 work together likely defines BOSS's killer demo

### v0.27 — Mentor consults as structured flows

The `/consult` skill that orchestrates 2-3 mentors around a specific question. Existing
mentor agents stay; the new skill choreographs them. Highest-leverage for the coaching-
receptive cohorts (first-product, non-tech-founder, returning-founder).

### v0.28 — First-time BOSS-user onboarding

A `/welcome` skill (or `boss new` post-script) for the cohorts most likely to bounce. Likely
small (couple hours). Closes the v0.19-persona-finding for first-product cohort directly.

### v0.29+ — Choose from:

- Scale mode authoring (the v0.17 queue item) — but probably premature; no projects at scale
- Moment #3 (capture — reusable value at breakpoint) — LLM-as-judge or heuristic
- IDEA-003 finish (practitioners encoded UP as named loops)
- IDEA-011 Phase 2 (per-loop opt-out, performance, discoverability)
- IDEA-006 host portability (name the contract; don't port)
- The compliance/dignity scaffolds (GDPR/CCPA primitives — especially if domain-expert use
  case lands)

**The previously-published v0.24 (Scale mode) is explicitly deprioritized.** Scale mode is a
ceremony for projects that have already grown; BOSS itself doesn't have non-Ajesh use yet, let
alone scale-shaped use. Premature.

## Open questions

- **Should BOSS try to be ONE tool that covers all these categories, or should some
  (marketing site / legal scaffolds / etc.) be *integrations* with existing tools?** Argument
  for integration: don't reinvent. Argument for native: opinionated choice with override is
  BOSS-distinctive. Lean: BOSS authors the *decision* + *override discipline* + *cohort
  framing*; the actual scaffolding can call out to existing tools. *"BOSS-decides; tools-do."*
- **Is the next move ANY feature, or is positioning + use first?** The audit's killer-use-
  case finding suggests positioning first. But Ajesh's earlier call was *"keep stewing"* —
  worth re-checking whether positioning is part of the stew or a separate concern.
- **AI cost tracking as a paid feature?** Conflicts with the canvas's "don't monetize lock-in"
  stance. The cost-tracking discipline itself should be free + open. *Hosted aggregation
  across projects* (compare your costs to other projects in your cohort) is a plausible paid
  surface — but premature; defer.
- **Are some catalog items already partially handled?** E.g., `db-architect` exists; what
  exactly does "database migration discipline" add? Worth a finer-grained read at build time.

## What this IDEA does NOT do

- **Doesn't pick the next feature definitively.** That's the founder's call after reading the
  audit. The recommendation is *positioning first*, but the founder can override.
- **Doesn't claim BOSS should ship all 30+ candidate features.** The catalog's value is
  forcing the question of priority.
- **Doesn't replace IDEA-010 (scalable AI design).** That stays domain-specific; this is the
  wider strategic pass.
- **Doesn't address business model decisions.** Calm-company default holds. Pricing decisions
  deferred until WTP evidence arrives.
- **Doesn't promise the revised roadmap is right.** It's a *current best read*. The actual
  ordering will adjust as positioning sharpens and real use happens.

## Honest meta-note

**This IDEA may itself be more capture-without-use.** Same risk we named in IDEA-011's "build
trap" callout + the advisory-pass extended override. The honest move after IDEA-012 lands is
*not* "author another IDEA"; it's *act on the positioning recommendation* — execute the
Dunford exercise as v0.24. If positioning surfaces a clear killer use case, ship the feature
that earns it. If it doesn't, the issue isn't a feature gap; it's deeper.

## Status

`exploring → adopted as working backlog 2026-05-23`. **Ajesh's read on the catalog:** *"a lot
is critical and I can see the value of all of it. Would be amazing to do some or all of it.
Let's add it."* The catalog is now treated as the live backlog (not a one-time audit). Items
get pulled into specific release planning as they fit; the catalog grows as new gaps surface.

**Ajesh's read on the killer-use-case articulation:** *"I like the killer-use-case
articulation."* Confirms positioning pass as v0.24's load-bearing work. The Dunford exercise
gates the next 3-5 feature decisions.

The two highest-leverage recommendations:
1. **v0.24 = positioning pass (Dunford exercise)** — not a feature release; the foundation
   for the next 3-5 feature decisions
2. **v0.25 = AI cost tracking** — the only universal-cohort candidate, highly BOSS-distinctive

After those, sequencing of v0.26+ pulls from the catalog based on what positioning surfaces.

## Canvas

_Covered by BOSS's overall canvas ([CANVAS.md](CANVAS.md)). This audit may surface a need to
re-version the canvas (v0.3) once positioning sharpens in v0.24._
