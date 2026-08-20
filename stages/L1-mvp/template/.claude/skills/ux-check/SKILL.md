---
name: ux-check
description: After-code UX review for {{PROJECT_NAME}}. Run against shipped UI to catch what slipped through `/design-review` or accumulated as drift. Walks the actual user journey (not the spec), checks the 5 states are real (not just designed), runs accessibility heuristics, applies AI-specific UX where relevant. Pairs with `/design-review` (before-code) — same lens, different timing. Usage - /ux-check [route-or-component-path | FEAT-NNN]
---

# /ux-check — after-code UX review

The before-code review catches design-spec failures; this skill catches *implementation*
failures — the gap between what was specced and what shipped. Most production UX failures
live in this gap: the empty state was designed but never built; the loading state defaults to
a spinner instead of the designed skeleton; the error state shows raw stack traces because
the recovery path was an afterthought.

This is also where AI-generated drift becomes visible. Even with `/design-review` upstream, the
`coder` (or AI doing the same role) sometimes ships a slight variant that
accumulates. `/ux-check` catches that.

## When to run it

- A FEAT just landed and is functionally working — *before* it's considered "shipped."
- A user reported a UX issue — start `/ux-check` here, walk to where the issue surfaces.
- Routine audit — run against the most-recently-shipped FEATs every 1-2 weeks.
- A new persona-reaction (v0.19) surfaced a UX concern — `/ux-check` validates whether the
  persona's read matches the shipped reality.

## How to run it

1. **Pick the surface.** A specific route, a component, or the FEAT-NNN whose UI is being
   reviewed.
2. **Walk the actual flow.** Not the spec — the SHIPPED experience. Open the page; click
   through; trigger every state.
3. **Check the 5 states are real:**
   - Default — does it look like the design?
   - Hover — feedback visible?
   - Active — feedback during the action?
   - Disabled — *and the reason for disabled* (so the user can act on it)?
   - Empty — designed copy + visual, not "no results"
   - Loading — skeleton (almost always) not spinner
   - Error — recovery path, not just error text
4. **Accessibility heuristics:**
   - Tab through every interactive element; focus visible at each step?
   - Read with screen reader (or use semantic HTML inspection); does the announced output
     make sense in isolation?
   - Color isn't the only signal (red alone for error, green alone for success — fail)
   - Contrast ratios meet WCAG 2 AA
   - Touch targets ≥ 44×44 px on mobile / responsive
5. **Nielsen heuristics walk:**
   - **#1 Visibility of system status** — does the user always know what's happening?
   - **#3 User control and freedom** — is undo / cancel / back available where consequential?
   - **#5 Error prevention** — does the design avoid errors rather than just handle them?
   - **#9 Help users recognize/diagnose/recover from errors** — error states with recovery
     paths?
6. **AI-specific UX (where applicable):**
   - AI as **options**, not truth — visible confidence; multiple plausible answers where
     uncertainty exists
   - **Human-in-the-loop** on consequential actions (no auto-apply on irreversible)
   - **Undo / edit / regenerate** on AI outputs
   - **Deliberate failure states** — what does the user get when the AI is unavailable / wrong /
     slow?
7. **Read the copy that actually shipped.** The spec's copy and the shipped copy diverge more often
   than the spec's layout does, because strings get written inline at 2am and never reviewed:
   - **Terminology** — one word per concept across the whole flow. Two words for one thing reads as
     two different products. (`content-terminology-guard` catches this at write time if it's on;
     this is the cross-confirm, and it also catches what landed before the hook was enabled.)
   - **Errors** say what to do next · **destructive confirms** name the consequence ·
     **empty states** say what to do next
   - **On-voice** against the style guide's voice traits — quote the offenders, don't summarize them
   - **For AI features, read the generated copy too** — trigger a refusal, a rate limit, a failure.
     That copy is in your product, in whoever's voice the model defaulted to. `/judge-traces` reads
     the same surface for correctness; this reads it for voice.

8. **Capture findings** in `docs/design/ux-check-<feat-or-date>.md`. Each issue: severity
   Each issue: severity (blocking / serious / minor / nit), the specific scene, the proposed fix.

## What this skill does NOT do

- Doesn't fix the code. Findings route to `coder` (or stack-specific coder) for
  fixes.
- Doesn't replace usability testing with real users (Erika Hall's discipline — *Just Enough
  Research*). Heuristic walkthroughs catch a lot but miss what real users do.
- Doesn't approve when issues are recorded as overrides. Same override discipline as
  everywhere else: skip with substantive rationale + re-open conditions.

## How findings feed back

- **Token violations** (raw hex in shipped code) → `design-drift-loop` detects this (and *only*
  this — it's a hex regex, nothing more); this skill cross-confirms
- **Pattern reinvention** (new component that duplicates existing) → **`/design-library --check`
  is the mechanical version of this check** and the drift loop cannot see it. Run it before the
  walk; flag the duplicate pair, propose consolidation, let the founder decide
- **Run `/design-library` after the fixes land.** The library is generated, so it only tells the
  truth if it's regenerated — a stale card is the drift it exists to catch
- **Missing states** → these are the most common shipped-UX failures; track them as a category
  in `docs/design/ux-check-summary.md` so you can see if a particular state-category is your
  pattern weakness
- **AI-UX issues** → may surface needs for the v0.20 cohort-aware-conscience design (the
  conscience speaks differently per cohort about how to fix AI-UX)

## Rules

- **Walk the actual flow.** The spec might say the empty state is designed; the shipped
  reality might say "No results." Trust the experience, not the spec.
- **Severity matters.** A blocking accessibility issue is not the same as a polish issue;
  don't flatten the list.
- **Capture every check.** Without `docs/design/ux-check-*.md` files, the discipline doesn't
  compound.
- **Pair with personas (v0.19) where relevant.** A persona's reaction to a flow can surface
  cohort-specific UX failures that the heuristic walk misses.
