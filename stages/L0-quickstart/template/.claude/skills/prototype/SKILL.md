---
name: prototype
description: Get the idea out of your head and onto the screen — fast. Builds the smallest runnable, clickable version of an idea (the one core thing, fastest stack), then runs it so you can react to something tangible instead of arguing with a blank page. Build-first is a legitimate place to start a lean cycle; the conscience helps you fill the gaps AFTER you can see it, not before. Usage - /prototype [IDEA-NNN | rough idea text]
---

# /prototype — drop an idea, hit go, see something tangible

Sometimes the fastest way to think about an idea is to **see it**. Not a spec, not a canvas — a
small, real, clickable thing you can react to. `/prototype` builds that: the one core interaction of
your idea, in whatever stack gets to "click it" fastest, running in front of you in minutes.

Building first is a legitimate way to start a lean cycle — get the idea out of your head, see the gist
made tangible, then fill in the missing pieces once there's something concrete to fill them *around*.
The conscience stays out of the way until the thing is on the screen.

> It's a sketch to think with, not your MVP — BOSS names that once, *after* you've seen it.

> **This is BOSS's one licensed play space.** A prototype is a *magic circle* — bounded, safe-to-fail,
> nothing precious, nothing shipped. Build it badly, build three of them, build the wrong one on purpose;
> the only job here is to learn by doing. The walls of the circle (it's labelled a sketch, it graduates
> deliberately when it earns a real build, the conscience waits outside until you step out) are exactly
> what make playing safe. Play isn't the warm-up to the work — for an idea you can't yet see, it *is*
> the work.

> **The frame, plainly (Jeff Patton's phrase, via Marty Cagan, 2026):** this is *building to **learn***
> — a sketch to think with, to discover whether the idea's worth it. Building it *for real* is
> *building to **earn*** — the `/spec` path, a build you'll stand behind. `/prototype` is
> build-to-learn; `boss unlock mvp` → `/spec` is build-to-earn.

## When to run it

- You have an idea (a sentence, or an `IDEA-NNN` from `/idea`) and you want to *see* it, now.
- You're stuck arguing with yourself in the abstract — a tangible version would unstick you.
- You want to show someone the gist before you've written a word of spec.

**And its one-letter neighbour, `/pretotype`, ships on this same rung.** Prototype answers *can this
work?*; pretotype answers *does anyone want it?* Both are legitimate places to start a lean cycle and
neither outranks the other. Reach for `/pretotype` instead when the thing you actually want to know
is whether anyone would show up — its page-shaped patterns publish a real shareable URL in one turn,
with no code at all. **Say which of the two you're running and why, once, before you run it** — they
are one letter apart and they answer opposite questions.

## How to run it

**1. Get the idea.** If given an `IDEA-NNN`, read it (and its canvas if one exists). If given rough
text, use it. If neither, ask one line: *"What's the idea — one sentence is enough."* Don't
interrogate; you have enough to start with the gist.

**2. Find the ONE core thing.** Name the single interaction or artifact that *is* the idea — the
thing that, once someone can do/see it, the idea clicks. A meal-planner's core thing is "see a week
of meals generated from my constraints," not auth + settings + a profile page. Say what you picked,
in one line, so the founder can redirect: *"I'll make the part where you [X] — that's the heart of
it. Everything else can come after."*

**3. Pick the fastest runnable stack** (Principle #4 — stack-neutral, but here optimize for
*time-to-click*, not production-fitness):
- **The founder can name it:** `/prototype --stack=<x>` is a first-class option — if they say it, use
  it, no argument. Only auto-pick when they don't.
- Simple UI / visual idea → a single self-contained HTML file (open it, done) or a minimal Vite +
  React app if it needs real interactivity.
- A tool / transform / data idea → the smallest script with a tiny UI or CLI.
- Pick the one that runs **fastest with fewest moving parts.**
- **Narrate the pick in plain words, not jargon** — to a beginner, say *"a single web page, nothing to
  install"*, not *"a Vite stack."* Name it as a speed pick they can change, not a decision made for
  them. (If the project already chose a stack, respect it unless it'd slow the sketch down.)

**3.5. Look for a design system before you draw one.** This skill lives at Quickstart, where there
is usually nothing to find — and *that is the common case, so check fast and move on.* But a founder
keeps prototyping long after they start building, and when they do, the system is right there:

- **`docs/design/COMPONENTS.md`** (or `docs/design/library/` at V1) — the components that exist, with
  the import line for each.
- **`docs/design/DESIGN_TOKENS.md`** — the values.
- **`docs/design/PATTERNS.md`** — what an empty state says, what a destructive confirm names.

If they exist, **compose from them.** This is the cheapest speed-up in the skill and it is worth
saying as a selling point rather than a discipline: the library is a pile of working, on-brand HTML
and components. **Copying is faster than drawing, and what you get is a preview of what will actually
ship instead of a picture of something adjacent to it.**

If they don't exist, **say nothing and keep moving.** A prototype at Quickstart is *supposed* to be
off-system, and sending a founder to go build a token system before they can see their idea would
invert this entire skill. Silence is the correct behaviour, not a gap.

**4. Build the minimal slice.** Just the core thing, made real. Use mock/sample data freely — the
point is tangibility, not a backend. **Don't gold-plate a throwaway** — tangible beats pretty (it's a
sketch). Skip the design polish by default; only if the sketch is becoming something you'll keep (or
an `eng-builder`/design-minded cohort asks) reach for the 5-token distinctiveness pass from
`/design-tokens-init`. Keep it in a clearly-a-sketch place (`prototype/` if the repo has other code;
root if it's empty).

**Label it, once, in the file itself.** A prototype is either **on-system** (it imports the tokens
and uses the real components) or a **sketch** (it doesn't, and decides nothing). Both are legitimate.
What is not legitimate is a mockup that *looks* like a design decision and silently isn't — because
prose is obviously incomplete while a mockup is a confident, complete-looking answer the
implementation will reproduce faithfully, raw hexes and all. One HTML comment at the top is enough.
If the project has `docs/design/PROTOTYPES.md`, add the row there with the same status.

**4.5. Commit it, before you run it.** `git init` if the folder isn't a repo yet, then commit the
sketch. One line, no lecture: *"committed — you can always get back to this version."* This is the
only real undo here: `/rewind` restores files written with the editing tools, but **not** changes made
by shell commands, **not** a subagent's edits, and it does not rewind the conversation. Git does.

**5. Run it.** Use `/run` (or just open the file). Get it on the screen. This is the moment — don't
bury it in narration.

**6. Then — and only then — the conscience rides along (gently).** Once it's running, lead with a
**concrete next action in plain words**, not a vocabulary word. The shape:
> *"There it is. Click around — does seeing it change what you thought the idea was? Want me to fake
> the next screen, or change the part that feels off?"*

Then, *only if they're ready*, introduce the next step **by what it does**, not its name: *"When you
want to figure out who this is really for and what would make it worth building — there's a step for
that (`/canvas`). And 'I don't know yet' is a fine answer; that's what it's for."* Never let the nudge
imply the sketch *isn't real* or that not-knowing-the-user is a failure — they're building precisely
to find out. Don't say `/canvas` / "pressure-test" cold to a beginner; let the step introduce itself
when they get there.

That's the whole conscience touch: *after* the tangible thing, a concrete action first and the
vocabulary later, never a gate before.

**If showing someone is the next move** — they say so, or that's why the sketch exists — offer one
cheap trick before they go, **once**: *"Take two rough versions, not your one best. With one, people
protect your feelings; with two, they compare — you'll hear what's actually off."* Build the second
only if they want it: minutes, still rough, differing in the one thing they're unsure about. One
sketch stays the default output — this is for **showing**, never for building. (Thin but real — one
study, Tohidi et al. 2006 — and it buys candour, not ideas. A compliment on either version still
isn't evidence.)

## Coming back to it

A sketch is something you return to, so the second run is not the first one again.

- **Read what's there first.** If a sketch for this idea already exists, open it and **change that** —
  don't regenerate from the idea text. Say which file you changed.
- **Commit before each round**, same as step 4.5. That's what makes *"actually, go back"* real.
- **Trying a different direction rather than fixing this one?** Copy the current one aside before you
  change it. The version you walk away from is a question already answered — and at MVP,
  `docs/design/PROTOTYPES.md` is where those answers get kept.
- **After about three rounds of "change this, now change that," stop and look at it yourself.**
  Security defects accumulate across unsupervised edit chains — measured at 2.1 → 6.2 per sample by
  the eighth round, and the researchers' own advice is a cap of three consecutive AI-only iterations
  (Shukla et al., IEEE-ISTAS 2025). Not a gate and not a lecture: open the thing, click it, read one
  file. Then keep going. A sketch nobody has looked at in ten rounds is not a sketch you can trust to
  tell you anything.

## Cohort-aware delivery

Read `cohort` from `.boss/config.json`:
- **`first-product` / `vibe-coder-newbie`** — lead with the magic moment; narrate in plain language
  ("I'm building the one core screen so you can see it — about a minute"); celebrate seeing it
  *running*, not the code.
- **`eng-builder` / `returning-founder`** — give stack control up front ("fastest path is a single
  Vite page — or name your stack"); skip the 101; leave the escape hatch obvious.
- **`vibe-virtuoso`** — they'll have opinions; offer the stack pick as a default to override, move fast.
- **`non-tech-founder`** — plain language, no jargon; the deliverable is "a thing you can click and
  show someone," not "a React app."
- **`domain-expert`** — one guardrail up front: *"this is a sketch to react to, not a
  clinical/regulated tool — don't put real [patient/client/financial] data in it."* Stakes are real;
  say so before, not after.

## Rules

- **Tangible beats complete.** A rough thing that runs beats a polished thing that doesn't. Ship the
  click, not the codebase.
- **Mock freely — and make fake data look fake.** Hardcoded values, canned responses, no backend —
  that's the point of a sketch. Keep the values unmistakably synthetic (`example.com`, `555-0155`,
  "Pat Placeholder"); never invent a plausible domain fact — a lab value, a dosage, a citation, a
  price. Mock data that looks real fools people, starting with you.
- **Name it as a sketch — once.** "See-it, not sell-it." Say it one time (cohort-appropriate), then
  let them play. Don't moralize.
- **Conscience after, never before.** No "have you validated this?" gate in front of the build. The
  whole point is that building *is* a legitimate first move. The nudge toward `/canvas` comes once
  there's something to react to.
- **Don't quietly become the MVP.** The real failure isn't abstract — it's the sketch that picked up
  4 real users and is now getting auth and a database bolted onto throwaway code nobody meant to keep.
  When the sketch earns a real build, graduate it deliberately — `boss unlock mvp` → `/spec` — with
  the sketch in hand as the tangible reference for what to build. **Keep or rebuild is the founder's
  call, piece by piece**; the honest test for any piece is whether someone can say what it does — and
  *"walk me through it"* is a one-minute ask, not a failing grade. The sketch's shortcuts around auth
  and other people's data are exactly what the deliberate path exists to catch. Fast to *see*;
  deliberate to *keep*.
