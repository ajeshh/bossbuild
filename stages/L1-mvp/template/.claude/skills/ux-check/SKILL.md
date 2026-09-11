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

## Step 0 — read the shape, and be willing to stop

Read `shape` from `.boss/config.json` (`/canvas` writes it; it is a list of tags).

**This skill is written for a graphical interface, and says so instead of pretending otherwise.**
Hover states, focus rings, tab order and contrast ratios are properties of a GUI. Walking a
founder through them because a checklist exists is the ceremony BOSS is supposed to prevent.

- **`cli` / `dev-tool` and no GUI shape alongside** — say so and run the short version: is
  `--help` the first thing a lost user finds; do errors go to stderr with a non-zero exit; is
  there a `--json`/quiet path for scripts; does colour degrade under `NO_COLOR` or a pipe; is
  destructive work preview-first. Then stop. Do **not** narrate the five visual states.
- **`agent` / `chatbot` with no screen** — the surface is the *transcript*: can the person tell
  what it did from what it said, is there a refusal/uncertainty path, can they interrupt and undo.
  `boss craft deceptive-patterns --surface ai-voice` is the row set that applies.
- **`mobile-app`** — the checks below hold, the mechanics don't. Focus ring → VoiceOver/TalkBack
  focus order; tab through → rotor and swipe order; contrast → the platform's own audit; and add
  touch-target size plus Dynamic Type / font-scale reflow, which have no web equivalent.
- **No shape declared** — ask one line (*"is there a screen to walk, or is this a CLI/API?"*)
  rather than assuming a browser. Don't send them to `/canvas` to find out.

Everything below assumes a GUI. If step 0 sent you elsewhere, you are already done.

## How to run it

1. **Pick the surface.** A specific route, a component, or the FEAT-NNN whose UI is being
   reviewed.
2. **Walk the actual flow — and record how you walked it.** Not the spec — the SHIPPED
   experience. Open the page, click through, trigger every state.

   **Check what you can actually do before you promise that.** BOSS ships no browser and no
   renderer: the `designer` agent's tools are Read/Grep/Glob/Edit/Write, and no BOSS template
   installs Playwright, an MCP server, or anything that can draw a pixel. Your *host* may have
   more — a Bash tool that can start the dev server, a browser you added yourself. Look, then
   pick your lane:

   - **Observed** — it was running and you drove it. Name the interaction: what you clicked and
     what came back.
   - **Inferred from source** — you read the code and reasoned about what it renders. Legitimate,
     usually all that's available, and **not the same thing.**

   **Mark every finding with which one it is.** A review that blends them silently is a plausible
   essay: the founder can't tell which parts you saw, so they can't tell which parts to trust.

   If nothing is running and you can't start it, say so in one line and run the inferred version.
   **Don't send a founder to install a browser stack to receive a design review** — that trade is
   worse than the review is good.

3. **Check the 5 states are real:**
   - Default — does it look like the design?  *(observable only)*
   - Hover — feedback visible?  *(observable only)*
   - Active — feedback during the action?  *(observable only)*
   - Disabled — *and the reason for disabled* (so the user can act on it)?
   - Empty — designed copy + visual, not "no results"
   - Loading — skeleton (almost always) not spinner
   - Error — recovery path, not just error text

   From source you can prove a state **exists** (the branch is there, the copy is written) and
   never that it **looks right**. Report the half you did.

4. **Accessibility heuristics.** Split them honestly — this list is where an inferred review most
   often reports a pass it did not earn:

   *Checkable from source:*
   - Color isn't the only signal (red alone for error, green alone for success — fail)
   - Semantic markup: does each control announce as something, with a name?
   - Touch targets ≥ 44×44 px on mobile / responsive — if the size is a token, not a computed layout

   *Requires rendering — if you didn't render, these are **not checked**, never "pass":*
   - Tab through every interactive element; focus visible at each step?
   - Screen-reader output: does the announced sequence make sense in isolation?
   - Contrast ratios meet WCAG 2 AA — a computed value; **eyeballing hex pairs is not a check**
   - Touch targets where the size comes out of layout rather than a token

   **A check that didn't run must not look like a check that passed.** Write *not checked — needs a
   rendered page*, and say what would run it. Retiring an accessibility question you never asked is
   worse than leaving it open, because nobody comes back to it.
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

8. **The deceptive-pattern walk — read the markup, not the intent.** This is the one check where
   the founder's intention proves nothing, because **the pattern may not be theirs**: ask a model
   for a signup flow or an upgrade modal and it frequently ships a fake countdown, a pre-ticked
   opt-in, or confirmshaming in the decline copy — unprompted, from the average of its training
   data (Vaccaro et al., *Deception at Scale*, CHI 2026). The founder never designed it and often
   can't see it. `/ux-check` is the routine that catches it, because this skill is already
   standing in front of the shipped page.

   Pull the rows for the surfaces this flow touches — don't work from memory:

   ```
   boss craft deceptive-patterns --shape <the tags from .boss/config.json>
   boss craft deceptive-patterns --surface <the one this flow is on>
   ```

   Then check the **shipped markup** — the `generated-markup` surface plus the visible rows on
   `consent-ui`, `signup-and-identity` and `checkout-and-pricing`. **Go by surface, not by the
   `[model-written]` tag**: that tag means *the model decided this, not you*, and it sits on
   behavioural rows too (sycophancy, guilt on exit) that no amount of reading markup can catch.
   In this order:
   - **Is any checkbox pre-ticked?** Marketing, sharing, terms-plus-something. `defaultChecked`,
     `checked={true}`, `checked` in the HTML.
   - **Is there a countdown or a scarcity claim, and is it true?** A timer that resets on reload,
     "only 2 left" on a digital good, "12 people viewing" from a random number.
   - **Read the decline copy out loud.** "No thanks, I like paying full price" is confirmshaming.
     The person declining owes you no apology.
   - **Weigh the two buttons.** Accept vs. Reject, Subscribe vs. Not now, Allow vs. Deny — same
     visual weight, same number of clicks, same screen? *If the good door takes more clicks than
     the bad one, it's already failed* (11 CCR § 7004).
   - **Find the way out.** Cancel, unsubscribe, delete account — does it exist, is it reachable
     from here, and is it as easy as the way in? A deletion flow you never built is a named
     pattern, not a to-do.

   **What this walk cannot see**, and must say so in the findings rather than let read as a clean pass:
   - **`tracking-and-telemetry`** — a pixel, an SDK, a session-replay recorder, a training-data
     default. No UI at all, nothing to look at. `/trust` §3.5 owns it.
   - **`ai-voice` and `agent-actions`** — whether the assistant caves when pushed, resists ending, or
     leans on rapport near the upgrade is a property of a *conversation*, not of a page.
     `/red-team --humane` owns it. A markup walk that reported on these reported on nothing.

   Founder framing, once: *"You didn't design these. Check whether the model did."* Then the
   finding, specific and short — the file, the line, and the honest version. Never a lecture.

8a. **Walk the authored flow against the shipped one.** Read the FEAT's **Flow** section and
   `docs/design/FLOWS.md`, then check what actually shipped against it — **step count first**. A flow
   specced at three steps that shipped at five is the single most common and least-noticed regression
   in a build, because each added step arrived for a good local reason and nobody was holding the
   total. Name the added steps and ask the same question the spec asked: why is this needed *now*?

   Then the two paths that are usually only on paper: **first-run** (make an empty account and walk
   it — not the happy path with less data) and **failure** (break a step and see where you land, and
   whether what you already gave it survived). Label each `observed` or `inferred` like everything
   else here; a flow walked by reading the router is inferred, and saying so is the honest work.

8b. **Check it against the pattern set.** Read `docs/design/PATTERNS.md` and walk its rows against
   what actually shipped. This is the cheapest high-yield pass in the list, because every row is a
   decision somebody already made — you are checking compliance, not exercising taste, and the
   finding writes itself: *"the delete confirm says 'Are you sure?'; our destructive-confirm pattern
   says name the consequence."*

   **A pattern with no enforcement is a preference.** `/design-review` names them before code; this
   is where they are checked after. If a row is violated in more than one place, the finding is not
   the screen — it is that the pattern never reached the code, and the fix belongs upstream in the
   component or in `CLAUDE.md`.

   No `PATTERNS.md`? Say so once and move on. It is created by the first `/design-review`, and
   telling a founder to go run another skill mid-review is worse than a missing section.

9. **Capture findings** in `docs/design/ux-check-<feat-or-date>.md`. Each issue: severity
   (blocking / serious / minor / nit), the specific scene, the proposed fix — and **`observed` or
   `inferred`**, per step 2.

   Open the file with one line naming how the review was run, so the next reader doesn't have to
   guess and the *next* review can tell whether coverage improved:

   ```
   Evidence:  observed <N> · inferred <N> · not checked <N>   (ran against: <what, or "source only">)
   ```

   **`not checked` is a real category and it must appear**, or the unrenderable checks quietly
   read as passes. Same discipline as `/persona`'s synthetic/real ledger: the count is the honesty.

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
  is the mechanical version of this check** and the drift loop cannot see it. ⚠️ **`/design-library`
  arrives at V1** — at MVP, do this pass by reading the component directory. If you're at V1, run
  the check before the walk; flag the duplicate pair, propose consolidation, let the founder decide
- **At V1, run `/design-library` after the fixes land.** The library is generated, so it only tells
  the truth if it's regenerated — a stale card is the drift it exists to catch
- **Missing states** → these are the most common shipped-UX failures; track them as a category
  in `docs/design/ux-check-summary.md` so you can see if a particular state-category is your
  pattern weakness
- **AI-UX issues** → may surface needs for the v0.20 cohort-aware-conscience design (the
  conscience speaks differently per cohort about how to fix AI-UX)

## Rules

- **Walk the actual flow.** The spec might say the empty state is designed; the shipped
  reality might say "No results." Trust the experience, not the spec.
- **Say which flow you actually walked.** The rule above is the goal, not a description of what
  happened. An inferred review is honest work; an inferred review presented as a walk is not.
- **Severity matters.** A blocking accessibility issue is not the same as a polish issue;
  don't flatten the list.
- **Capture every check.** Without `docs/design/ux-check-*.md` files, the discipline doesn't
  compound.
- 🔴 **Open `docs/personas/` and the FEAT's `for:` field — don't just recommend it (v0.283.0).**
  This rule said *"pair with personas where relevant"* for twelve releases and named no path, which
  made it a suggestion the next session was free to skip. **Read the persona this surface is for**
  (the FEAT frontmatter's `for:` slug, or the only persona there is), and walk its `pains` and its
  *what we don't know yet* block against what is actually on the screen. A review run without
  opening the file is a review of a generic user, and this product does not have one.
- **Pair with personas (v0.19) where relevant** — *carrying `/persona`'s discount with them.* A
  persona's reaction can surface cohort-specific failures the heuristic walk misses. It can also
  like your flow more than a real person would: synthetic readers skew agreeable, and the research
  on this is consistent enough to plan around (NN/g, 2024). **A persona's approval is not a pass.**
  Their *confusion*, on the other hand, is worth taking straight — it costs nothing to fix a
  stumble that a synthetic reader found and a real one would have hit too.
