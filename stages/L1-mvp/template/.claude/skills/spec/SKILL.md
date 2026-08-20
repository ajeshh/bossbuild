---
name: spec
description: Promote an idea into a buildable spec — IDEA-NNN becomes FEAT-NNN with a goal, acceptance criteria, and a smoke check. The point at which "we should build this" turns into "here's how we'll know it's done." Usage - /spec [IDEA-NNN]  (or describe the feature inline)
---

# /spec — promote an idea into a buildable feature

In Quickstart, ideas live in `docs/ideas/IDEA-NNN.md` as living capture docs. In MVP, when one is ready
to *actually be built*, `/spec` lifts it into a **FEAT** — same number space, but now with a goal you
can measure, criteria you can check, and a smoke that proves it landed. The IDEA stays; the FEAT is
the build contract.

## When to run

- The idea has been captured (Quickstart) and ideally pressure-tested in `/canvas` — at minimum the
  riskiest assumption is named.
- You're ready to write code against it. If you're still figuring out *whether* to build, go back to
  `/triage` or `/canvas`; don't spec a maybe.

## Moment #4 — restraint check (v0.21.0+)

Before any FEAT spec is created, check `docs/loops/spec-loop.md` (which declares spec-loop's entry
predicate: canvas-loop must be closed for the active idea). If canvas-loop is NOT closed for the idea
being specced — i.e., the idea has no canvas, or its canvas has only placeholder cells, or the
riskiest assumption is unfilled — **surface BOSS's restraint nudge in your own voice**, cohort-aware
(read `.boss/config.json` `cohort` field; lean Fitzpatrick-plain):

> Frame: this is the cheapest place to catch the question AI made easy to skip — **not "is it built
> right?" but "is it worth building?"** (the bottleneck moved from *how* to build to *what* to build —
> Ng/Appleton, 2026). So don't surface a checklist gap; surface the substantive one: **who is this
> for, and what's the bet that could sink it?** Name it in one line, offer to back up to /canvas, hand
> the decision back. Never block. The founder can override (record in `docs/devlog.md` with IDEA-008's
> grammar: `- **OVERRIDE:** proceeded `spec-loop` without `canvas-loop` exit — rationale: <substantive
> reason>`).
>
> Respect the sketch: a throwaway prototype needs none of this — `/prototype` exists precisely to get
> the gist out of your head, build-first, no gate. This fires only when you're committing to build it
> **for real** (a FEAT you'll carry forward). Build-first is legitimate; building-for-keeps without
> naming who it's for is the drift this catches.

Then proceed with the spec if the founder confirms — overriding the conscience is a legitimate move;
*recording the override* is the contract.

## The loud ≠ important check (post-launch — the `drift` twin at decide-time)

Restraint (above) is the *pre-launch* question — *is this worth building at all?* This is its
**post-launch sibling**, and it fires on a different symptom: **the source of this FEAT is a user
request.** When the project has real users, the trap flips from "no evidence" to "the wrong evidence" —
building around **the loudest few** while the **silent majority** (who never wrote in) and the **quiet
churn** (who just left) go unheard. Loud is not the same as important; the users who complain the
articulately are rarely the users who pay.

**Gate — surface this only when BOTH hold** (otherwise skip it entirely; it's not a checklist):

1. **There are real users** — a `--feedback` register with entries (`docs/feedback/` or the register
   `/triage --feedback` writes), an EVID ledger, or a live analytics read (`/measure`). Pre-launch there
   is no vocal minority yet, so this stays silent — restraint (above) is the only check that fires.
2. **This FEAT traces to a request/complaint**, not to a founder-named bet — the source is a feature
   request, a friction complaint, or "a few users asked." (If the source is the canvas's *riskiest
   assumption* backed by broad or commitment-grade evidence, this isn't the loud-minority trap — stay
   silent; that's `drift`'s territory, not this.)

When it fits, **surface BOSS's nudge in your own voice** (cohort-aware; read `.boss/config.json`
`cohort`; lean Fitzpatrick-plain). Do the judgment before speaking — silently read the source request +
the `--feedback` register (or EVID ledger): is this a *pattern across your active core*, or **one loud
voice** the register itself says to treat as a `stated-pain` EVID, not a spec? Then say, in one spare
line, the specific version of:

> **How many users actually asked for this — and are they your active core, or a vocal few?** A request
> is evidence of *a* pain, not a mandate to build (it's a `stated-pain` EVID — the weakest grade; the
> quiet majority's *observed behavior* outranks a loud request). Before you spend the build on it, two
> cheaper reads: what does **the silent majority** — the users who *didn't* write in — actually *do*
> (`/measure` — behavior over volume)? And what is your **quiet churn** telling you — the people who
> left without a word are the loudest evidence there is, and this feature probably isn't why (talk to
> them: `/interview`; the `--feedback` register's churn entries)? If those still point here, build it
> with conviction. If they point elsewhere, you were about to serve the few at the expense of the many.

Point at `/measure` (what behavior says), `/interview` (talk to the silent / the churned), the
`--feedback` register (is the request a *pattern* or a one-off), and `mentor-venture` (is this the right
bet). Cohort decides framing — returning-founder gets the blunt "the loudest user isn't your median
user — who are you actually building for?"; first-product gets "one person asking loudly can feel like
everyone; here's how to check" taught plainly; indie-hacker gets the calm "serve the quiet ones who
stayed, not just the loud one who's leaving anyway"; domain-expert gets the who-is-actually-harmed lens
on over-serving an edge case. **Suggestive, once, never a gate** — the founder may have every reason to
build it (a strategic account, a load-bearing workflow); the nudge just makes the silent majority
*visible* before the build, and recording the reason is the honest close. **Humane note (PRINCIPLE #6):
protect the silent majority who actually drive the value** — the anti-pattern is a roadmap captured by
whoever shouts, which quietly degrades the product for everyone who doesn't.

_(This fires on a *single* request at decide-time. The fuller version — weighing *all* the signal, behavior
vs. requests, across the whole register into a small bet-list + a mandatory NO-list — is **`/roadmap`**. Run
that when you're choosing among many candidates, not just reacting to one.)_

## How to run it

1. Pick the source: `[IDEA-NNN]` if given, else the idea the user names, else the most active idea
   currently in `building` status.
2. Allocate the next free `FEAT-NNN` (parallel numbering to IDEA — same N if it's a clean promotion,
   otherwise next free integer; grep the **files** under `docs/` for existing FEATs, per `docs/IDS.md`).
3. **The elicitation pass — say back what you had to guess (v0.172.0+).** Draft the spec from what
   you actually have, then **before you show it, separate what you were told from what you filled
   in.** This is the cheapest step in the whole skill and the one that decides whether the build
   matches the founder's head: a model asked to spec a feature will complete every gap fluently,
   and the founder cannot correct a guess they never saw. Ask, in one short pass — never an
   interrogation, and never more than fits on a screen:

   - **"Here's what I had to assume."** List every gap you filled without being told, each phrased
     so it can be rejected in one word. Put them in the FEAT's **Assumptions** section with the
     founder's answer recorded next to each. If you assumed nothing, say so — that's a real signal
     the idea was already sharp.
   - **"Walk me through one concrete instance."** One real example, start to finish, in their words.
     **This is the highest-yield question in the skill** — a single worked example surfaces
     constraints, states, and vocabulary that no checklist thinks to ask for.
   - **"What would make you say this is broken even if it technically works?"** The inverse question.
     Most real acceptance criteria come from here, not from restating the goal. Record it under
     **What "wrong" looks like**.
   - **Name what you deliberately did NOT guess** and leave it under *Still unknown*. A blank is
     honest signal; a confident invention is the failure this step exists to catch.

   > **Corrections are the documentation.** When the founder rejects an assumption, the sentence
   > they replace it with is the most valuable line in the file — it's exactly the thing that was
   > non-obvious enough that a competent reader got it wrong. Keep their wording. Those lines are
   > what a guide, a README gotcha, or a piece of positioning later gets written from.
   >
   > **Keep it proportional.** One pass, then build. If this starts to feel like a requirements
   > interview, you've turned a spec into a PRD written *instead of* the thinking — which is the
   > exact failure Cagan names and the one BOSS's restraint check above already guards.

4. Create `docs/ideas/FEAT-NNN-<slug>.md` from the template below.
5. Update the source IDEA's `status` to `building` and add a one-line pointer at the top:
   `> Building as [FEAT-NNN](FEAT-NNN-<slug>.md).`
6. Nothing else to register — `boss board` picks the FEAT up from its frontmatter and shows it
   alongside the ideas.
   - `building_since:` anchors the board's time-in-build aging (`boss board` flags a FEAT that's sat
     in Building past ~3 weeks — the zombie-feature smell). It's **frontmatter-true, never guessed**:
     set it to today when the FEAT enters `building`, and refresh it if a paused FEAT is re-opened
     (so the age reflects *this* build run, not the original).
   - When status moves to `shipped`, **drop `building_since:` and stamp `shipped_on: <today>`.** The
     board archives a shipped FEAT older than ~30 days into the "shipped earlier" fold (a true date
     window, not just the recent-count cap), so the Shipped column shows what landed *lately* instead
     of every ship forever. Frontmatter-true: no `shipped_on:` → it falls back to the count cap.
   - `priority: high` is **optional** — add it only when a FEAT genuinely jumps the queue. The board
     floats it to the top of its column with a `⬆` marker and leads `boss board --next` with it. One
     level by design (no P0/P1/P2 ladder — that turns the board into a planning surface you tend
     instead of ship). The honest caveat the seasoned hand would add: *re-prioritizing isn't progress;
     finishing is.* Most FEATs need no priority field at all.
7. **Offer plan mode before the coder.** The FEAT says *what* and *how we'll know it's done*; it
   deliberately doesn't say *how*. On this host, the built-in `Plan` agent reads the actual codebase
   and returns an implementation route — which is the half a spec shouldn't contain and shouldn't guess:

   > *"The spec's set. Want me to plan the implementation against the code first (plan mode), or go
   > straight to building?"*

   Straight-to-building is a fine answer for a small, obvious FEAT — don't push. Reach for the plan
   when the FEAT touches code you haven't read, spans more than a couple of files, or has an
   out-of-scope line you're worried about crossing.

   **`/spec` decides the destination; the plan picks the road.** Keep them separate: a route that
   arrives without a spec is a well-planned trip to nowhere, and an implementation plan is *not* a
   substitute for acceptance criteria — it can't tell you whether the thing was worth building.
8. Hand off to `coder-generalist` (or the stack's coder, if specialized) with the FEAT as the brief —
   plus the plan, if one was made. If this host has no plan mode, this step is unchanged: the FEAT
   alone is a complete brief.

## The FEAT template

Template: **[`templates/feat-record.md`](templates/feat-record.md)**.

## Ship the most executable artifact you can (not just prose about it)

A markdown spec is the *floor*, not the goal. An artifact the agent can **execute, render or diff**
beats prose describing it — the ordering, worst to best:

> prose < a screenshot < a rendered mockup < a failing test < a rubric the verifier runs

So after the FEAT record exists, ask what this particular feature's most-executable form is, and
produce **that too**. It usually costs less than the paragraphs it replaces:

- **Building UI?** A crude HTML mockup next to the FEAT beats three paragraphs about the layout —
  even ugly. Ambiguity in a layout description is invisible until it's built wrong.
  **But if this project has a token system, the mockup imports it.** A mockup that doesn't is *worse
  than prose*: prose is obviously incomplete so the implementer fills the gaps from the design
  system, while a mockup is a confident, complete-looking answer that gets reproduced faithfully —
  raw hexes and all. An off-system mockup injects the 47 blues at spec time. If you want it fast and
  off-system, that's fine — **label it a sketch** so nobody implements from it. Registry and rule:
  `docs/design/PROTOTYPES.md`.
- **Building logic?** Write the acceptance criteria **as failing tests**. A criterion that can't be
  expressed as one is usually a criterion that isn't checkable yet — which is worth finding out now,
  not at review. See `boss craft testing-with-agents`: a test derived from the spec can
  fail; a test derived from the implementation cannot.
- **Judging something fuzzy** (tone, quality, "did it capture the point")? Write the **rubric** the
  verifier reads. That's a spec the harness can actually gate on.

**Don't force it.** A one-line copy change doesn't need a mockup, and the ladder is about leverage,
not ceremony (Principle #2). The question is *"what's the cheapest artifact that removes the most
ambiguity?"* — sometimes that genuinely is one clear sentence.

## Rules

- One FEAT per concern. A feature that needs three smoke checks is probably two features.
- Acceptance criteria are testable statements, not vibes. "Feels fast" → "Initial page render < 1s on a cold reload."
- Out-of-scope is load-bearing. Naming what's *not* in this FEAT prevents the scope creep that kills MVPs.
- Spec a delegation, not just a feature (Ethan Mollick, 2026). A FEAT is a brief you hand to a coder
  (human or agent), so it should answer two things the acceptance criteria don't: **what will *you*
  verify** before it's done (not "tests pass" — the one or two things you'll click/read to trust it),
  and **what's out of the agent's authority** (decisions it must surface to you, not make — a schema
  change, a new dependency, anything irreversible). Don't write "know what good looks like" platitudes;
  write the checkable line.
- The spec is a contract with future-you, not paperwork. Keep it short enough that you'll actually re-read it mid-build.
- Don't spec a maybe. If the riskiest assumption is still wide open, you're not ready — go run an experiment instead.
