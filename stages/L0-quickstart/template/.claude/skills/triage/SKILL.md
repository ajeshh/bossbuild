---
name: triage
description: Capture an idea — and keep adding to it. Creates a LIVING idea doc you return to over time: a sharpening "current shape" at the top, an append-only capture log below. The lightest step in Quickstart mode. Usage - /triage <thought>  (run again anytime to add more)
---

# /triage — capture & keep adding

Quickstart is about getting an idea out of your head and letting it *grow* with almost no
ceremony. Each idea is a **living document**, not a one-shot form. Run `/triage` whenever a new
thought lands — the first run creates the doc, every later run adds to it.

## Decide: new idea or add to an existing one?

1. Skim existing `docs/ideas/IDEA-*.md` titles (the files are the record — there is no index to read).
2. If the user's thought clearly extends an existing idea → **append** to that doc (don't make a new one).
3. Otherwise → **create** a new `IDEA-NNN`. **Get the number by running `boss id IDEA`** — it prints
   the next free one, computed from every `.md` under `docs/` (filenames *and* prose, because a
   number reserved in an index is taken even when no file exists yet). Do not count by hand: two
   files claiming one number makes every reference to it ambiguous, and it is invisible until it
   isn't.

## Create (first capture)

Make `docs/ideas/IDEA-NNN-<slug>.md`:

```markdown
---
id: IDEA-NNN
type: idea
owner: pm
status: seedling
created: {{today}}
---

# <Title — one plain line>

## Current shape
_The best articulation so far. Rewrite this as the idea sharpens._
- **What:** …
- **Who it's for:** …
- **Smallest version that proves it:** …

## Capture log
_Append-only. Newest at the bottom. Don't edit old entries._
- {{today}} — <the thought, in their words>

## Open questions
- <what's still fuzzy>

## Canvas
_Not started. When this has legs, run `/canvas` to pressure-test it as a business._
```

That's the whole capture — **nothing else to update.** `boss board` renders the idea from its own
frontmatter, so there is no index table to keep in sync.

## Add (every later run)

- Append a dated bullet to **Capture log** (their words — light touch, don't sanitize the spark).
- If the thought sharpens the idea, rewrite **Current shape** to reflect it.
- Move any resolved item out of **Open questions**; add new ones that surfaced.
- Don't restructure or "finalize" — this is an evolving notebook, not a deliverable.

## The validation check — BOSS's conscience

Quickstart makes it *easy* to keep capturing. That's the trap: a growing pile of captured ideas can
feel like progress while nothing has actually been tested. So after you capture or add, glance at the
state — and if it's drifting, **say one thing, then get out of the way.** This is the first of BOSS's
conscience moments: *what does this prove?*

**When to speak (keep it rare):** the idea you just added to has **≥3 capture-log entries** and there's
**no `IDEA-NNN-canvas.md` with a filled riskiest assumption** (no canvas at all, or the *Riskiest
assumption* line is still a placeholder). That's the "building lots, proving nothing" signal — and the
only time this fires.

**What to say:** one spare line, in BOSS's voice — name the drift, ask what they'd want to *learn* (or
*who they'd ask first* — Fitzpatrick-style, plain language), hand the decision back. Don't lecture, don't
block the capture, don't make it a gate. **Voice lineage decision (v0.20.0):** lean Fitzpatrick-plain over
Maurya-framework-name; the indie-hacker persona caught the prior mix and the cohort-portable version uses
ask-someone language consistently. Tune it to them by ear; don't paste this verbatim:

> *"That's the third thing you've added here, and none of it's been tested yet. Who would you talk to first
> to find out if any of them are real? `/canvas` is one way to pressure-test it — but a 15-minute call with
> the right person beats it."*

**Cohort awareness (v0.20.0+):** if `.boss/config.json` has a `cohort` field set, the conscience hook ships
that to your context. *Read the framing and adjust the voice* — a `first-product` founder needs *teaching*
(define terms inline; invite, never grade), a `returning-founder` wants the *harder cohort-aware question*
("is your conviction here at the level it needed to be for the last thing?"), a `vibe-virtuoso` deflects
discipline content but respects friction ("you've shipped a lot — what's the bet you'd stay on for six
months even if it didn't go viral?"). Same signal; different voice.

**Stay quiet otherwise.** Say it once. If they keep capturing without acting, don't repeat it every run —
a conscience that nags is just noise. Raise it again only if a lot more piles up, or they ask. Assume
they're smart: you're flagging a blind spot, not grading them.

## When it has legs

If the idea feels real (recurring, exciting, worth betting time on), say so and offer the next rung:
- `/canvas` — pressure-test it as a business (customer, problem, value prop, risks, validation…).
- or `boss unlock mvp` — if you're already sure and ready to build the first working version.

## The `--feedback` register (Scale mode)

Once the project has real users (Scale mode), `/triage --feedback` is the **customer register** — the
same living-capture habit, pointed at what users report instead of what you dreamed up. The point is
sorting, because the four kinds want opposite responses:

- **Bug** → fix now (it's broken).
- **Friction** → *observe more* before acting (one complaint isn't a pattern; watch for the second).
- **Feature request** → **a stated-pain `EVID`, never a spec.** This is the trap: a request is
  evidence of a pain, not a to-do. Capture the pain it implies into the evidence ledger (`/evidence`);
  don't auto-promote it to a `FEAT`. (If you *do* reach for `/spec` on a request, the conscience's
  **loud ≠ important** check fires there — how many actually asked, and what do the silent majority +
  the quiet churn say? — so this rule has teeth at decide-time, not just here.)
- **Churn signal** → the loudest evidence there is. Someone left — that's the highest-yield, most-
  avoided signal. Log it; it's what the conscience's evidence read weighs most.

This is where the project's evidence source officially flips from interviews to **live behavior**.
`/incident` handles the failures; `--feedback` handles the everyday signal. (Both are Scale-mode
surfaces; in earlier modes, plain `/triage` is the whole story.)

## Rules

- Capture > ceremony. A one-liner is a complete input.
- One idea per doc. If they chain several with "also", split into separate docs.
- Never start building from `/triage` — this is capture only.
- Preserve the original spark verbatim in the capture log; sharpen in "Current shape," not by overwriting history.
- The validation check is a nudge, never a gate — it never blocks a capture and never repeats into a nag.
