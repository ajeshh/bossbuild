---
name: design-review
description: Before-code design review for {{PROJECT_NAME}}. Runs the proposed UI through `designer` in two passes — the visual system, then flows and states (flows + 5-state requirement) in sequence, then names what recurs as a pattern. Reads `docs/design/DESIGN_TOKENS.md` + `docs/design/STYLE_GUIDE.md` + the relevant FEAT spec. Outputs concrete diffs or numbered issues. Catches token violations + missing states + brand drift BEFORE code commits. Pairs with `/ux-check` (after-code review). Usage - /design-review [FEAT-NNN | path-to-component-spec]
---

# /design-review — before-code design review

Catch design failures *before* they're in production code, where they're cheapest to fix. Most
of the AI-generated-UI failure modes from IDEA-010 (the 47 blues, pattern reinvention, billion-
line drift, missing states, brand-default) are catchable at this stage with a structured
review. After-code review (`/ux-check`) is the second gate; this is the first.

## When to run it

- A FEAT introduces or significantly modifies UI — *before* `coder` writes the code.
- A new component is being added — *before* the file lands.
- The founder wants a second look on a design decision they made — anytime.

## Step 0 — read the shape, and be willing to stop

Read `shape` from `.boss/config.json` (`/canvas` writes it; it is a list of tags). **`/ux-check`
has always done this and this skill never did** — so the before-code gate has been walking CLI
founders through hover states and token layer-cakes, which is the exact ceremony BOSS exists to
prevent (Principle #2).

Everything in *How to run it* assumes a graphical interface. If that's not what's being specced:

- **`cli` / `dev-tool` and no GUI shape alongside** — there is no token layer-cake for terminal
  output and no hover state to design. Review the surface that *does* exist: is the first thing a
  lost user finds `--help`; is there one verb per concept across every command; do errors go to
  stderr with a non-zero exit and say what to do next; is there a `--json`/quiet path; does colour
  degrade under `NO_COLOR` or a pipe; is destructive work preview-first. Then stop.
- **`agent` / `chatbot` with no screen** — the surface is the *transcript*. Review what it says
  when it's uncertain, when it refuses, and before it does something irreversible; whether the
  person can tell what it did; whether they can interrupt and undo. Pass two's AI-specific UX list
  is the whole review here, not a sub-bullet.
- **`mobile-app`** — the 5-state requirement and the token discipline hold; the mechanics don't.
  Focus ring → VoiceOver/TalkBack focus order; tab order → rotor and swipe order; and add touch
  targets plus Dynamic Type / font-scale reflow, which have no web equivalent.
- **No shape declared** — ask one line (*"is there a screen here, or is this a CLI/API?"*) rather
  than assuming a browser. Don't send them to `/canvas` to find out.

## How to run it

1. **Read the spec.** The FEAT being reviewed, the proposed component (sketch / mockup /
   description), and the relevant section of any design brief.
2. **Read the system.** `docs/design/DESIGN_TOKENS.md` (authoritative tokens), `docs/design/
   STYLE_GUIDE.md` (how tokens compose into patterns), `docs/ideas/CANVAS.md` (Promises cell —
   the brand anchor), **`docs/design/COMPONENTS.md`** (the component index at MVP, superseded by
   **`docs/design/library/manifest.json`** at V1 — read whichever exists, never both), **`docs/design/PATTERNS.md`** (the pattern set — see step 4b), and `STYLE_GUIDE.md`'s
   **Composition** slots (see step 4a).

   **If `PATTERNS.md` does not exist, this is the run that creates it.** Seed it from
   [`templates/pattern-set.md`](templates/pattern-set.md) with the rows that apply to *this*
   product — the state and content rules always, the AI-interaction rows only if the product is
   AI-mediated, the anti-patterns always. Don't seed rows for surfaces this product doesn't have; a
   pattern for a situation you never hit is noise, and noise is how a file stops being opened.
3. **Run `designer` — pass one, the visual system.** Pass the spec + the design system; ask for
   review against:
   - Token compliance (no raw hex; no raw spacing; no font-family inlined)
   - Three-layer architecture preserved (semantic tokens used, not primitives)
   - Brand-anchored choices (matches canvas Promises voice, not internet-default)
   - **The genericness test** — *would this exact plan have been produced for any similar brief?*
     Swap the product for a neighbour in the same category; whatever survives the swap unchanged is a
     default, not a choice. Name it. (The current tells, dated, are in `/design-tokens-init`.)
   - Reuse-before-creation: does a similar pattern exist? **Read
     `docs/design/library/manifest.json` if it exists** — name + purpose + variants for every
     component, which is the difference between actually checking and asking the model to
     remember to check. **At MVP the index is `docs/design/COMPONENTS.md`** (written by
     `/design-tokens-init`); the generated manifest supersedes it at V1. If neither exists, read the
     component directory itself before adding to it — reviewing reuse without an index is how
     `CTAButton` gets born.
4. **Then pass two — flow, state and content.** Same agent, second lens: pass the spec **plus its
   own pass-one notes**. Two passes rather than one prompt on purpose — a single sweep reliably
   trades depth on the second half for fluency on the first, and the content check at the end of
   this list is the one that gets dropped. Ask for review against:
   - All 5 states named (default / hover / active / disabled / empty) — plus loading + error
     for async / interactive elements
   - **The flow as authored** — read the FEAT's **Flow** section and `docs/design/FLOWS.md`. Check
     the three paths are all there (happy / first-run / failure), that the first-run path is a real
     design and not "the happy path with less data", and that the cut list was actually attempted.
     **Grade your own flow finding as the weakest thing in this review and say so** — an AI review
     moves feedback and scannability and barely moves whether the sequence is right. A clean design
     review is evidence about states and legibility; it is close to no evidence that the flow is
     good. That judgment stayed with the founder, and it should read that way on the page.
   - Affordances clear (Norman's lens — the user can tell what's interactive)
   - Nielsen heuristics (visibility, recognition, error prevention, recovery)
   - **The basis is `boss craft accessibility`** — reason from POUR and name the principle, not
     just the rule, so the founder can look the criterion up themselves. Say what you did *not*
     check; an accessibility note with no blind spots named reads as clearance.
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
4a. **Fill a composition slot by reading, never by asking.** `STYLE_GUIDE.md`'s **Composition**
   section has four slots — type roles, rhythm, surface language, hierarchy — and they ship empty on
   purpose. **Do not hand the founder a form.** Every one of them already has a de-facto answer
   sitting in the code, and your job is to read it back so an implicit decision becomes a visible one.

   Look at what is in front of you plus what is already built, and say what the product *appears to
   have decided*:

   > *"You're using two type roles, not four. Everything raised uses a border — except the menu,
   > which uses a shadow. And what carries emphasis is space, consistently. Want those written down
   > as `observed`?"*

   **Mark it `observed`, not `declared`.** An observed answer is a description the founder can still
   change their mind about; a declared one is a decision to defend. Graduating a row from observed to
   declared is *their* act, not yours — and it is the moment the slot stops being a reading and starts
   being a rule.

   **An inconsistency you find while reading is the most useful thing here** — *"everything is a
   border except one shadow"* is exactly the finding, and it has two honest resolutions: the shadow is
   wrong, or the rule is *"border, and shadow for things that float."* Offer both; the second is
   usually right and nobody ever writes it down.

   **Fill at most one or two slots per review.** All four at once is the form you just refused.

4b. **Name the pattern, not just the fix.** Pass two produces findings about *this* screen. Before
   you write them up, ask the question that makes them compound: **is this decision going to come up
   again?**

   - **Already in `PATTERNS.md`?** Cite the row. A finding that says *"this violates our
     destructive-confirm pattern"* is worth five that re-derive the reasoning, because it is
     reviewable by someone who wasn't in this session.
   - **Came up once before and now again?** That is the threshold. Add it to the **Ours** table with
     the situation, the rule, the anti-pattern, and where it was first seen. Once is a choice; twice
     is a pattern.
   - **Novel and genuinely one-off?** Leave it a finding. Most things are. A pattern set that grows
     on every review is a transcript, not a system.

   - **Refused it?** Put it in the **Refused** table with the reason. And if the refusal is
     load-bearing — *we will not ship streaks*, *we will not use a modal for this class of action* —
     offer `/decide` once. A refusal is the kind of decision that gets silently reversed by the next
     person who thinks it was an oversight, which is exactly what a DEC record prevents.

   **Where this layer earns its keep:** a component answers *what to use*, a pattern answers *what to
   do* — and the second question is the one that comes up on a screen that has no component yet.

4c. **Before you record an exception, read the ones already there — the rule may be what's wrong.**
   `STYLE_GUIDE.md` has an Exceptions table and the discipline is right: *an exception recorded is a
   decision; an exception unrecorded is drift.* But an exceptions table nobody reads back is a
   ratchet, and a system that only tightens is a system that locks design in.

   So, when this review is about to add one, count the ones like it:

   - **First of its kind** — record it. That is what the table is for.
   - **Second** — record it and say out loud that it is the second. No action yet; twice is a
     coincidence you should be able to see.
   - **Third of the same kind** — 🔴 **stop. The rule is wrong, not the three screens.** Three
     exceptions is the same threshold as *twice is a pattern*, pointed the other way. Propose the
     rule change: narrow it (*"one primary per view, **except** in a toolbar"*), split it into two
     rules, or retire it. A rule with three standing exceptions is not being followed — it is being
     worked around, and the working-around is the real convention now.

   **Say which one you are doing.** "Recording an exception" and "this rule needs to change" are
   different acts and the table cannot tell them apart on its own.

5. **Synthesize.** Output:
   - **Token violations** — list each; propose the right token; flag if a new token is
     legitimately needed and which layer
   - **Missing states** — list each missing state; propose what each should be
   - **Brand drift** — flag any visual choices that contradict the canvas Promises voice
   - **Accessibility issues** — listed by WCAG / Nielsen heuristic violated
   - **AI-UX issues** (where applicable) — listed
   - **Content issues** — terminology violations (name the word and its replacement), off-voice
     strings (quote them, propose the rewrite), missing error-recovery or empty-state copy
   - **Pattern findings** — each one cited to its row in `PATTERNS.md`, plus any row this review
     *added*, and the decision you deliberately left un-patterned
6. **Capture the review** in `docs/design/reviews/<feat-nnn-or-date>.md`. The review is a
   diff against the proposed design, not a critique-only doc — propose every change concretely.

## What this skill does NOT do

- Doesn't write the implementation. After review passes, `coder` writes the code.
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
- **Every layer has a demotion path, not just a promotion path.** A pattern nobody cites, a token
  nothing references, a component nobody imports, a rule with three exceptions — each is a thing the
  system should be able to *take back*. Promotion has a threshold (*twice*); so does demotion
  (*three exceptions, or zero uses*). A design system that can only add is one that locks design in,
  which is the opposite of the job.
- **Cite the pattern; don't re-derive it.** If `PATTERNS.md` has the row, name it. Re-arguing a
  settled rule every review is how a design system becomes a set of opinions that happen to agree.
- **Seed only what applies.** A pattern for a surface this product doesn't have is noise, and noise
  is how a file stops being opened. The general-UI half is deliberately thin — BOSS holds the state
  rules, the content rules and the AI-interaction patterns, and does **not** ship a forms-and-tables
  catalog. Say so rather than inventing one.
- **Cite the practitioner / heuristic.** "Violates Nielsen #4 — consistency and standards"
  beats "this is inconsistent."
- **Capture the review.** Without `docs/design/reviews/`, the discipline doesn't compound.
