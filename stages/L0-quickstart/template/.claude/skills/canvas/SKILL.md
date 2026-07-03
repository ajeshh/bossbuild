---
name: canvas
description: Pressure-test an idea as a humane business — Ajesh Shah's Humane Product Canvas as the spine, with Lean/Lenny-style commercial prompts folded into each cell. Filled just-in-time (a few cells at a time), it's the Quickstart→MVP graduation gate. Usage - /canvas [IDEA-NNN]
---

# /canvas — pressure-test the idea (humanely)

The just-in-time mentor that shows up once an idea has legs. Built on **the Humane Product Canvas
(by Ajesh Shah)** — values-first — with sharp Lean/Lenny business prompts folded into each cell so
the idea is both *humane* and *viable*.

It is **a snapshot, not a final blueprint.** Answers evolve as insight grows. Don't rush to fill
boxes — sit with the hard questions, sketch, talk, revisit. A half-filled canvas with a sharp
riskiest-assumption beats a fully-filled canvas of guesses.

When the canvas is reasonably filled and the **riskiest assumption has a validation plan**, the idea
is ready to `boss unlock mvp`.

## How to run it

1. Pick the idea: `[IDEA-NNN]` if given, else the most active idea in `docs/ideas/`.
2. Open (or create) `docs/ideas/IDEA-NNN-canvas.md` from the template below.
3. **Don't interrogate.** Ask about 2-4 cells at a time, starting with the most uncertain. Pull
   answers from the idea's "Current shape" + capture log; only ask what's missing.
4. Leave `_(not yet)_` on anything unknown — blanks are honest signal, not failure. Re-run anytime.
5. After each pass, name the **single riskiest assumption** and propose **one experiment this week**
   to test it. Write both in. That's the heartbeat of incubation. If any `EVID-NNN` records in
   `docs/evidence/` bear on this assumption (`/evidence` captures them; `/interview` debriefs into
   them), **cite their ids in the riskiest-assumption cell** — the bet should argue from receipts, not
   vibes, and their grades (stated-pain → observed-behavior → commitment) show how far it's really been
   tested.
6. When most cells are filled + the top risk has a validation plan, mark it **Done!** (below) — name
   what became real — then offer `boss unlock mvp`.

## The canvas template

```markdown
---
id: IDEA-NNN-canvas
type: canvas
owner: pm
status: drafting
version: 0.1
updated: {{today}}
---

# Humane Product Canvas — <Idea title>

> A snapshot, not a blueprint. Revisit as insight grows.

## 1 · Human Foundation
_Who you serve, the tension they carry, the value you promise._

| Cell | Humane prompt | Sharpen with |
|---|---|---|
| **People** | Who are you designing for & what matters to them? | Who *exactly* has the painful problem? Be specific — not "everyone." |
| **Problem** | What real human tension are you solving? | Is it urgent, frequent, expensive, or emotionally painful? What do they use *today* instead (current alternatives)? |
| **Promises** | What emotional / relational value will it deliver? | The sharp promise: "We help X do Y without Z." |

## 2 · Product Expression
_How it shows up in a life, how people engage, how it sustains itself._

| Cell | Humane prompt | Sharpen with |
|---|---|---|
| **Story** | How does your product show up in someone's life? | What changed that makes this newly possible or urgent (insight / why now)? What's the smallest compelling workflow that solves it (solution)? |
| **Modes of Engagement** | How do people interact with your product in a humane way? | Does it respect time, attention, autonomy, data? Why are you the right team/product to win (unique advantage)? |
| **Business Model** | How will you sustain this without compromising your promise? | Who pays, how much, why is it worth it? How do the first 100 find you (acquisition)? What makes usage compound (growth loop)? |

## 3 · Stewardship
_Impact, risks, and the values that guide decisions._

| Cell | Humane prompt | Sharpen with |
|---|---|---|
| **Metrics** | What does meaningful success look like — for people and planet? | Real pull: activation, retention, conversion, willingness to pay. **And the regenerative ones, weighted as seriously:** what people *learn* or gain in well-being, what makes the venture more *resilient* over time — growth that renews, not just extracts. |
| **Risks & Harms** | What could unintentionally go wrong? Who might be harmed or excluded? | Rank the assumptions that could kill the idea. Be honest about harm at scale. |
| **Build or buy?** _(for tool-shaped ideas)_ | Is the honest move to *build* this — or would using/buying something that already solves it serve the person better? | Only ask for internal-tool / process-automation ideas (Jason Fried, 2026: most people want the problem *gone*, not a system to maintain). For a genuine product venture, building **is** the move — skip this cell. The humane answer is sometimes "don't build it yourself." |
| **Principles** | What values will guide your decisions? | The non-negotiables you'll hold even when it's costly. |

## Incubation heartbeat
- **Riskiest assumption:** _(the one most likely to be fatal and least proven)_
- **Experiment this week:** _(the smallest test to prove/disprove it — often a 15-minute call with the right person; `/interview` preps it and debriefs it into graded evidence)_
- **What result would change the plan?** _(decide before you run it)_
```

## Done! — the graduation moment

When the canvas holds up — most cells filled with real answers (not `_(not yet)_` placeholders) and the
**riskiest assumption has a validation plan** (an experiment + what result would change the plan) — the
idea has crossed a real threshold: it's *done enough to build*. Most founders blow right past this and
just start coding. Don't. This is the conscience's **affirming** voice — the counterpart to "what does
this prove?" — and you mark it in two beats:

1. **Arrival.** Name what became real. Where did they start, and what's solid now — a specific person, a
   real tension, a sharp promise, the one bet that could sink it *with* a way to test it? Say it plainly
   and let it land. This isn't praise; it's acknowledging the idea grew up.
2. **Next doorway.** Point at what's next without rushing: `boss unlock mvp` brings the build tools and
   the next mentors (architect, GTM). The canvas keeps — they're free to sit with it.

In BOSS's voice (the warm register — still spare; tune by ear, don't paste verbatim):

> *"Worth stopping here a second. You came in with 'an app that plans meals' — now there's a specific
> person, a tension that's real, and the one bet that could sink it, with a way to test it this week.
> That's the idea becoming real. When you're ready, `boss unlock mvp` brings the build tools. No rush —
> the canvas keeps."*

A threshold, not a finish line: "done" here means *ready for the next thing*, and the canvas keeps
evolving as you learn. Never force it — a half-filled canvas with a sharp riskiest assumption is a fine
place to sit; mark it Done only when it's genuinely earned, not as a box to tick.

## Rules

- Humane-first. The Risks & Harms cell is not optional polish — surface real harm honestly, even when inconvenient.
- Just-in-time, not all-at-once. Blanks are data; never fabricate answers to look complete.
- Snapshot, not blueprint — expect it to change; bump `version` when it meaningfully shifts.
- The canvas informs the decision to build; it never replaces actually talking to the people you serve.
- Credit the framework: Humane Product Canvas by Ajesh Shah.
