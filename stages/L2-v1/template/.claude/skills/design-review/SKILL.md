---
name: design-review
description: Before-code design review for {{PROJECT_NAME}}. Runs the proposed UI through `ui-designer` (token + visual authority) and `ux-designer` (flows + 5-state requirement) in sequence. Reads `docs/design/DESIGN_TOKENS.md` + `docs/design/STYLE_GUIDE.md` + the relevant FEAT spec. Outputs concrete diffs or numbered issues. Catches token violations + missing states + brand drift BEFORE code commits. Pairs with `/ux-check` (after-code review). Usage - /design-review [FEAT-NNN | path-to-component-spec]
---

# /design-review — before-code design review

Catch design failures *before* they're in production code, where they're cheapest to fix. Most
of the AI-generated-UI failure modes from IDEA-010 (the 47 blues, pattern reinvention, billion-
line drift, missing states, brand-default) are catchable at this stage with a structured
review. After-code review (`/ux-check`) is the second gate; this is the first.

## When to run it

- A FEAT introduces or significantly modifies UI — *before* `coder-generalist` writes the code.
- A new component is being added — *before* the file lands.
- The founder wants a second look on a design decision they made — anytime.

## How to run it

1. **Read the spec.** The FEAT being reviewed, the proposed component (sketch / mockup /
   description), and the relevant section of any design brief.
2. **Read the system.** `docs/design/DESIGN_TOKENS.md` (authoritative tokens), `docs/design/
   STYLE_GUIDE.md` (how tokens compose into patterns), `docs/ideas/CANVAS.md` (Promises cell —
   the brand anchor), and **`docs/design/library/manifest.json`** (what already exists — the
   reuse index).
3. **Run `ui-designer` first** — pass the spec + the design system; ask for review against:
   - Token compliance (no raw hex; no raw spacing; no font-family inlined)
   - Three-layer architecture preserved (semantic tokens used, not primitives)
   - Brand-anchored choices (matches canvas Promises voice, not internet-default)
   - Reuse-before-creation: does a similar pattern exist? **Read
     `docs/design/library/manifest.json` if it exists** — name + purpose + variants for every
     component, which is the difference between actually checking and asking the model to
     remember to check. No manifest yet? Run `/design-library` first; reviewing reuse without an
     index is how `CTAButton` gets born.
4. **Run `ux-designer` next** — pass the spec + ui-designer's notes; ask for review against:
   - All 5 states named (default / hover / active / disabled / empty) — plus loading + error
     for async / interactive elements
   - Affordances clear (Norman's lens — the user can tell what's interactive)
   - Nielsen heuristics (visibility, recognition, error prevention, recovery)
   - Accessibility floor: keyboard nav, focus visibility, screen reader output, color-isn't-
     the-only-signal, WCAG 2 AA contrast
   - AI-specific UX (if applicable): options-not-truth, visible confidence, undo/edit/regenerate,
     deliberate failure states
   - **Content** — the half a design review usually skips. Read `STYLE_GUIDE.md`'s Terminology,
     Voice and Tone tables and check the proposed copy against them:
     - **Terminology** — one word per concept. The most checkable rule you have; check it first.
     - **Errors say what to do next**, not what failed. **Destructive confirms name the
       consequence**, not "are you sure". **Empty states say what to do next**, not "nothing here".
     - **On-voice** — does this read like the product's 3 voice traits, or like the model's default?
       *"Oops! Something went wrong"* is the mean, and the mean is what you get unless you asked.
     - **If the FEAT is AI-mediated, the copy the model will generate at runtime is in scope** —
       system prompt, refusal and hedge language, retry and rate-limit messages, the words before an
       irreversible action. That copy ships to users and usually nobody reviewed it.
5. **Synthesize.** Output:
   - **Token violations** — list each; propose the right token; flag if a new token is
     legitimately needed and which layer
   - **Missing states** — list each missing state; propose what each should be
   - **Brand drift** — flag any visual choices that contradict the canvas Promises voice
   - **Accessibility issues** — listed by WCAG / Nielsen heuristic violated
   - **AI-UX issues** (where applicable) — listed
   - **Content issues** — terminology violations (name the word and its replacement), off-voice
     strings (quote them, propose the rewrite), missing error-recovery or empty-state copy
6. **Capture the review** in `docs/design/reviews/<feat-nnn-or-date>.md`. The review is a
   diff against the proposed design, not a critique-only doc — propose every change concretely.

## What this skill does NOT do

- Doesn't write the implementation. After review passes, `coder-generalist` writes the code.
- Doesn't run on existing shipped code. That's `/ux-check`'s job.
- Doesn't approve when an override is recorded. The founder can override a finding (record in
  the review doc with substantive rationale); the review respects.

## Cohort-aware delivery

Per `.boss/config.json` cohort declaration (v0.20+):
- `vibe-coder-newbie` / `first-product`: explain *why* each token-compliance / state-coverage
  point matters; this cohort is most likely to find design discipline foreign
- `eng-builder` / `returning-founder`: terse list of violations; assume context
- `vibe-virtuoso`: lean into the architecture (atomic discipline, token layer-cake); skip the
  101 explanations
- `non-tech-founder` / `domain-expert`: plain language; emphasize the user-facing consequences
  of each issue
- `indie-hacker`: right-sized — avoid suggesting heavier discipline than the project earns

## Rules

- **Before code.** This review is BEFORE the implementation. If you're reviewing shipped code,
  you're running the wrong skill — use `/ux-check`.
- **Propose, don't just critique.** Every finding includes a specific change suggestion.
- **Reuse first.** The first question on every new component: *does a similar pattern exist?*
- **Cite the practitioner / heuristic.** "Violates Nielsen #4 — consistency and standards"
  beats "this is inconsistent."
- **Capture the review.** Without `docs/design/reviews/`, the discipline doesn't compound.
