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

## Step 0 — does it already exist, and is this the right rung?

**Look for the venture canvas before you make one** — `docs/ideas/CANVAS.md`. If it's there: say so and stop
when it's fine (a complete outcome, not a failure to act), or name the *specific* gap and offer the
*specific* edit when it's behind. Never quietly generate a second one.

**Rung: Quickstart.** If this project is **earlier** than that, don't run this — and there is **no seam** worth planting, which is a complete answer rather than a gap: There is no rung below this one. The canvas IS the seed.

## How to run it

1. Pick the idea: `[IDEA-NNN]` if given, else the most active idea in `docs/ideas/`.
2. Open (or create) `docs/ideas/IDEA-NNN-canvas.md` from the template below.
3. **Don't interrogate.** Ask about 2-4 cells at a time, starting with the most uncertain. Pull
   answers from the idea's "Current shape" + capture log; only ask what's missing.
   **On an adopted repo, also read `.boss/brain/read.md`** — `/comprehend` put its read of the
   existing codebase there, and several cells (People, Problem, Story, Business Model) often have a
   partial answer sitting in what's already built. Propose those as *drafts to correct*, never as
   filled cells: code tells you what someone decided to build, not whether anyone wanted it. A cell
   answered from the repo alone is still `_(not yet)_` on the evidence that matters.
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
owner: product-lead
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
| **People** | Who are you designing for & what matters to them? | Who *exactly* has the painful problem? Be specific — not "everyone." And **who feels it worst, today** — the early adopters you could actually reach this month, not the market you'd eventually serve. |
| **Problem** | What real human tension are you solving? | Is it urgent, frequent, expensive, or emotionally painful? What do they use *today* instead (current alternatives)? |
| **Promises** | What emotional / relational value will it deliver? | The sharp promise: "We help X do Y without Z." |

## 2 · Product Expression
_How it shows up in a life, how people engage, how it sustains itself._

| Cell | Humane prompt | Sharpen with |
|---|---|---|
| **Story** | How does your product show up in someone's life? | What changed that makes this newly possible or urgent (insight / why now)? What's the smallest compelling workflow that solves it (solution)? |
| **Modes of Engagement** | How do people interact with your product in a humane way? | Does it respect time, attention, autonomy, data? Why are you the right team/product to win (unique advantage)? What **kind of relationship** is this — self-serve, hands-on, community, a tool they forget they're using? Name it, because it sets what you'll owe them later. |
| **Business Model** | How will you sustain this without compromising your promise? | Who pays, how much, why is it worth it? How do the first 100 find you (acquisition)? What makes usage compound (growth loop)? And once the first 100 are in — **which channels keep working**, and which were just you hustling? (The two are different, and only one of them scales.) |
| **Cost Structure** _(live once there's a price, or a real cost)_ | What does it actually cost to serve one person well — and does that cost hold as more arrive? | Fixed vs. variable. For an AI product the variable cost is the one that bites: **cost per active user** and **cost per successful outcome** (`/ai-cost` computes both). Revenue without cost isn't a model, it's a price. |
| **What it takes to deliver** _(live when the answer isn't "just me and a laptop")_ | What do you need to *have*, and to *do*, for this to work at all? | The few resources and repeated activities the promise depends on — the data you need access to, the thing you must do every week, the skill you can't outsource. Keep it to what is genuinely load-bearing. |
| **Key Partnerships** _(live only if someone else is load-bearing)_ | Is there anyone whose cooperation this cannot work without? | A supplier, a platform, a regulator, a distribution partner, a data source. **Most ventures have none — `_(not yet)_` is the common and correct answer.** Ask only when the domain implies one (regulated, marketplace, hardware, embedded).|

> **These four are additive and mostly dormant.** They exist so the canvas can answer a conventional
> reader (a Lean or BMC audience, an operator, an investor) without a second artifact — see
> [[DEC-004]]. **Do not walk a founder through them at Quickstart.** Each carries the condition that
> makes it live; until that condition holds, `_(not yet)_` is the honest answer and the canvas is not
> less complete for it. The frame layer will formalise this gating; until then, judgement does.

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

   **Say what the unlock is *for*, not just what it contains.** A sharp Promises cell is the first
   moment the idea can be shown to a stranger, and the unlock carries the tools for that — `/pretotype`
   can publish the promise as a real shareable page in one turn (no host, no account), and `/landing`
   builds the in-repo version when there's a product behind it. Naming only "the build tools" quietly
   teaches that the unlock means *start building*, which is the one inversion this whole skill exists
   to prevent. **The canvas earns the right to test the promise, not just to build it.** Mention the
   page once, as an option, never as the next task.

In BOSS's voice (the warm register — still spare; tune by ear, don't paste verbatim):

> *"Worth stopping here a second. You came in with 'an app that plans meals' — now there's a specific
> person, a tension that's real, and the one bet that could sink it, with a way to test it this week.
> That's the idea becoming real. When you're ready, `boss unlock mvp` brings the build tools — and the
> ones for testing that promise on someone before you build it. No rush — the canvas keeps."*

A threshold, not a finish line: "done" here means *ready for the next thing*, and the canvas keeps
evolving as you learn. Never force it — a half-filled canvas with a sharp riskiest assumption is a fine
place to sit; mark it Done only when it's genuinely earned, not as a box to tick.

## Rules

- Humane-first. The Risks & Harms cell is not optional polish — surface real harm honestly, even when inconvenient.
- Just-in-time, not all-at-once. Blanks are data; never fabricate answers to look complete.
- Snapshot, not blueprint — expect it to change; bump `version` when it meaningfully shifts.
- The canvas informs the decision to build; it never replaces actually talking to the people you serve.
- Credit the framework: Humane Product Canvas by Ajesh Shah.
