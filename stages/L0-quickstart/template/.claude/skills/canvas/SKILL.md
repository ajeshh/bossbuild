---
name: canvas
description: Pressure-test an idea as a humane business, and show the same answers to whoever needs to read them. One set of answers, several frames (Humane by default, Lean, BMC, a onepager with the evidence ledger). A few cells at a time; the Quickstart→MVP gate. Usage - /canvas [IDEA-NNN] [--frame humane|lean|bmc|onepager]
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

## Frames — one set of answers, several ways to read them

**A canvas is a set of answers, not a layout.** The Humane Product Canvas is the *default frame*, not
the only one (DEC-004) — it was never meant to be, and became the sole spine by inheritance from
a v0.4.0 release note rather than by decision. So the answers live in one place and you project them:

| Frame | Reads as | Use when |
|---|---|---|
| **`humane`** _(default)_ | Human Foundation / Product Expression / Stewardship | you're building — it puts the questions that shape decisions first |
| **`lean`** | Maurya's nine: Problem · Existing Alternatives · Customer Segments · Early Adopters · UVP · Solution · Channels · Revenue · Cost Structure · Key Metrics · Unfair Advantage | you want the fast iteration view, or a reader who expects it |
| **`bmc`** | Osterwalder's nine: Customer Segments · Value Props · Channels · Customer Relationships · Revenue · Key Resources · Key Activities · Key Partnerships · Cost Structure | the audience is an operator or an investor |
| **`onepager`** | Prose, not a grid — the promise, who it's for, the tension, how it shows up, how it sustains itself, **what you actually know and how you know it**, and what could sink it | someone outside needs to read it in two minutes — a warm intro, an advisor, a would-be collaborator |

**The founder never picks a framework.** They answer questions; the frame is a view they can switch,
and switching never loses an answer or asks anything twice.

### 🔴 The floor — what a frame may and may not change

A frame changes **layout and vocabulary**. It does **not** change which cells are required.

> **Risks & Harms and Principles render in EVERY frame, including Lean and BMC.**

Those two are the cells no conventional canvas has, and they are the reason this one is worth
keeping. If a conventional frame could drop them, "humane" would become a preference a founder can
decline — which is the argument BOSS already settled against an opt-in ethics mentor
(`registry/boundary.json`: *an ethics advisor a founder can decline to open is weaker than a
conscience they can't*). **A conventional frame is a different view of a humane canvas, never a way
out of one.**

When rendering `lean` or `bmc`, append the two cells under a plain heading — *"and two questions this
canvas asks that Lean doesn't"* — rather than hiding them or apologising for them.

### Mapping — where each answer shows up

One answer, several homes. Nothing is asked twice:

- **People** → Customer Segments (both) · the *who feels it worst* half → Early Adopters (Lean)
- **Problem** → Problem (Lean) · its *what they use today* half → Existing Alternatives (Lean)
- **Promises** → Unique Value Proposition (Lean) / Value Propositions (BMC)
- **Story** → Solution (Lean); its *why now* half has no conventional home — **render it anyway**
- **Modes of Engagement** → Customer Relationships (BMC) · its *unique advantage* half → Unfair Advantage (Lean)
- **Business Model** → Revenue Streams (both) · its acquisition/ongoing-channel half → Channels (both).
  **A project that won't earn still renders here** — *"not monetized; sustained by N hours a week and
  two maintainers"* is a real answer to Revenue Streams, and a truer one than a blank. Never render a
  non-commercial project's Revenue Streams as `_(not yet)_` when the founder has actually answered.
- **Cost Structure** → Cost Structure (both)
- **What it takes to deliver** → Key Resources + Key Activities (BMC)
- **Key Partnerships** → Key Partnerships (BMC)
- **Metrics** → Key Metrics (Lean)
- **Risks & Harms**, **Principles** → **no conventional home; required in every frame anyway**

**A cell with no answer renders as `_(not yet)_` in every frame.** Never quietly omit an empty cell
to make a conventional view look complete — that is the same dishonesty as a filled-in guess, wearing
a different layout.

### The `onepager` frame — the smallest thing you can hand to someone outside

The other three frames are for **you**. This one is for **someone else**, and that changes what
honesty costs. It is the smallest shareable version of the venture: prose, one page, no grid.

> ⚠️ **Say the one way it differs, don't hide it.** The other frames are pure projections — layout
> and vocabulary over the same answers. **The one-pager adds one thing the canvas does not hold: the
> evidence ledger.** That is deliberate, and it is the entire reason this frame is safe to hand
> outside. A page of claims with no account of what is behind them is a pitch; the same page with the
> account attached is a position. Do not quietly drop the ledger to make the page read better.

**The gate — do not render this early.** It needs the canvas cells filled *and* **at least one
`EVID-NNN`** in `docs/evidence/`. With zero evidence records, **do not produce a polished page.** Say
what is missing in one line and point at the cheaper thing: *"There's a real shape here and nothing
behind it yet. One 15-minute conversation would change that more than another canvas pass — `/interview`
preps it."* A handsome page built entirely of assertions is the failure mode this frame exists inside.

**What it renders, in this order:**

1. **The promise**, one sentence — *Promises*.
2. **Who it's for, and how many** — *People*, including the bottom-up count and where it came from.
   No count in the cell means no count on the page. Never render a market size the canvas doesn't hold.
3. **The tension, and what they do today** — *Problem* + existing alternatives, **including who else
   sells a fix and why they might win.** A one-pager where every rival is dismissed reads as a page
   that never looked.
4. **How it shows up, and why now** — *Story*.
5. **How it sustains itself** — *Business Model*, both branches. **A project that won't earn renders
   plainly** (*"not monetized; sustained by N hours a week and two maintainers"*), never as a blank
   and never as `_(not yet)_`.
6. **What is actually known** — the evidence ledger (below).
7. **What could sink it** — the riskiest assumption, plus **Risks & Harms**. The floor holds here like
   everywhere else, and it is *more* load-bearing outside than in: a founder who names the harm before
   a stranger asks is the one worth backing.
8. **Principles** — the floor's other half.

**The evidence ledger — countable facts, never a verdict, and never a manufactured ratio.**
One short block near the top, built only from things you can point at:

> *"Behind this page: **3 evidence records**, highest grade **`stated-pain`** (the lowest of three
> rungs). Nobody has been observed using it and nobody has committed anything. Newest record:
> **19 days old**. Two cells below are still open."*

🔴 **Do NOT write "N of M claims are backed."** It reads as the most rigorous line on the page and it
is the softest: **M is produced by deciding what counts as a claim**, so forgetting one shrinks the
denominator and *raises* the backed fraction. A ratio that improves when you look less carefully is a
comfort device wearing a lab coat. Count records, grades, ages and open cells — things that exist as
files — never a fraction whose bottom half you invented while rendering.

🔴 **Coverage is a fact; readiness is a verdict.** BOSS never renders a verdict about your venture —
**position, never a grade.** **Never render an "investor-readiness: 62%", a letter grade, a traffic
light, or a progress bar.** The test: *could this number go DOWN when the founder learns something
true?* The record count can — supersede an `EVID` and it drops. A readiness score never does, which
is exactly what makes it one.

**Say how old the evidence is.** A page resting on six-month-old records says so on its face. The
reader cannot tell a fresh position from a stale one, and they are the person it matters to.

**Holes render as holes.** `_(not yet)_` survives into the page. Do not smooth a gap into a
confident sentence because the audience is external — that is the exact pressure this frame has to
resist, and the only thing that makes it worth more than a template anyone could fill.

**Never invent.** No number, quote, logo, customer name, or testimonial that is not in a record. If
the founder wants one on the page, the answer is *"make it true first"* — `/interview` and
`/evidence` are how.

**At n=0-past-the-gate, lead with what isn't known.** One EVID at `stated-pain` clears the gate and
is still thin. The honest page opens with the promise and reaches the ledger fast; it does **not**
open with enthusiasm. This is the conscience's voice in a document rather than a nudge, and it must
never be softened into encouragement — a founder who hands out an over-confident page gets a warm
meeting and no information, which costs more than the awkward version.

## Step 0 — does it already exist, and is this the right rung?

**Look for the venture canvas before you make one** — `docs/ideas/CANVAS.md`. If it's there: say so and stop
when it's fine (a complete outcome, not a failure to act), or name the *specific* gap and offer the
*specific* edit when it's behind. Never quietly generate a second one.

**Rung: Quickstart.** If this project is **earlier** than that, don't run this — and there is **no seam** worth planting, which is a complete answer rather than a gap: the only rung below this one is step 0 — the plugin door, where a founder says the idea and hears it back before any file exists (IDEA-099) — and a canvas has nothing to stand on there. Inside a project, the canvas IS the seed.

## How to run it

0. **If `--frame` is given and a canvas already exists, this is a RENDER, not an interview.** Read
   the answers, project them into the requested frame, and stop. Do not ask anything — the founder
   asked to see what they have in a different shape, not to fill more in. **`--frame onepager` also
   reads `docs/evidence/` and is gated on at least one `EVID-NNN`** — see the one-pager section above
   for what to do when there are none (it is not "render it anyway").
1. Pick the idea: `[IDEA-NNN]` if given, else the most active idea in `docs/ideas/`.
2. Open (or create) `docs/ideas/IDEA-NNN-canvas.md` from the template below.
3. **Don't interrogate.** Ask about 2-4 cells at a time, starting with the most uncertain. Pull
   answers from the idea's "Current shape" + capture log; only ask what's missing.
   **Read `motivation:` and `success_looks_like:` from the IDEA doc first** (IDEA-097 — `/boss`
   asks them at spin-up). They decide two things below without a question: which branch of
   **Business Model** to open (`revenue` → the earning branch; anything else → the *not every
   project is trying to earn* branch, and don't offer both), and what sits in **Metrics** beside
   "for people and planet" — their own sentence for *it worked*, quoted, not paraphrased. **If both
   are `unset` / empty, ask them here as one of your first cells** — *"before the grid: why this
   one, for you, and what would 'it worked' look like in three months?"* — write the answers back to
   the IDEA doc's two fields (mapping the why to `learning` · `revenue` · `community` · `credibility`
   · `own-problem`, shown before saving), and only then open Business Model. *Skip* is an answer;
   leave them empty and open the earning branch with the not-earning note in view.
   **On an adopted repo, also read `.boss/brain/read.md`** — `/read-repo` put its read of the
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
6. When most of the **live** cells are filled + the top risk has a validation plan, mark it **Done!**
   (below) — name
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
| **People** | Who are you designing for & what matters to them? | Who *exactly* has the painful problem? Be specific — not "everyone." And **who feels it worst, today** — the early adopters you could actually reach this month, not the market you'd eventually serve. **How many of them are there, and how do you know?** Count from the bottom up — a list, a forum, a conference, a job title you can filter on. *"$50B market"* is not an answer; **"about 4,000 of these exist and I can name where they gather" is.** A number you cannot say the source of out loud does not go in this cell. |
| **Problem** | What real human tension are you solving? | Is it urgent, frequent, expensive, or emotionally painful? What do they use *today* instead (current alternatives)? And **who else is selling a fix** — not just tools, but the spreadsheet, the agency, the intern, and doing nothing. For each of the real ones, **say why they might win**. A competitive picture where everyone else is dismissed is a picture you drew rather than looked at. *(MVP+: `/comp-eval` researches this field and keeps it in `docs/competition/` — cite it here rather than duplicating it.)* |
| **Promises** | What emotional / relational value will it deliver? | The sharp promise: "We help X do Y without Z." |

## 2 · Product Expression
_How it shows up in a life, how people engage, how it sustains itself._

| Cell | Humane prompt | Sharpen with |
|---|---|---|
| **Story** | How does your product show up in someone's life? | What changed that makes this newly possible or urgent (insight / why now)? What's the smallest compelling workflow that solves it (solution)? |
| **Modes of Engagement** | How do people interact with your product in a humane way? | Does it respect time, attention, autonomy, data? Why are you the right team/product to win (unique advantage) — and **what in your background makes that credible to someone who doesn't know you?** Not a CV: the specific thing you've seen, built, sold or lived that most people attempting this haven't. What **kind of relationship** is this — self-serve, hands-on, community, a tool they forget they're using? Name it, because it sets what you'll owe them later. |
| **Business Model** | How will you sustain this without compromising your promise? | **Two branches — take the one their answer points at, never both.** *If it will earn:* who pays, how much, why is it worth it? How do the first 100 find you (acquisition)? What makes usage compound (growth loop)? And once the first 100 are in — **which channels keep working**, and which were just you hustling? (The two are different, and only one of them scales.) *If it won't:* see the note under this table — the cell stays live, the question changes. |
| **Cost Structure** _(live once there's a price, or a real cost)_ | What does it actually cost to serve one person well — and does that cost hold as more arrive? | Fixed vs. variable. For an AI product the variable cost is the one that bites: **cost per active user** and **cost per successful outcome** (`/ai-cost` computes both). Revenue without cost isn't a model, it's a price. |
| **What it takes to deliver** _(live when the answer isn't "just me and a laptop")_ | What do you need to *have*, and to *do*, for this to work at all? | The few resources and repeated activities the promise depends on — the data you need access to, the thing you must do every week, the skill you can't outsource. Keep it to what is genuinely load-bearing. |
| **Key Partnerships** _(live only if someone else is load-bearing)_ | Is there anyone whose cooperation this cannot work without? | A supplier, a platform, a regulator, a distribution partner, a data source. **Most ventures have none — `_(not yet)_` is the common and correct answer.** Ask only when the domain implies one (regulated, marketplace, hardware, embedded).|

> ### 🔴 Not every project is trying to earn — and this cell stays live anyway
>
> Open source, Creative Commons, a research tool, a thing built for friends, a thing built for fun.
> **The humane prompt above is already the right question for all of them** — *how will you sustain
> this* — and it is only the sharpen that assumes money. So do **not** skip the cell, and do **not**
> let a founder write a revenue line they don't mean to make it look finished.
>
> **Take the second branch instead** — and take it without asking when the IDEA doc's `motivation:`
> is `learning`, `community`, `credibility` or `own-problem`. Sustainability without revenue is
> time, attention, other people, and an ending:
>
> - **What keeps this alive?** Your own hours are the budget. How many a week, and for how long — a
>   season, a year, indefinitely? Name it, because "indefinitely" is the answer that ends projects.
> - **Who else could carry it?** One maintainer is a single point of failure. Is there a second
>   person, or a path to one?
> - **What happens when you get bored, busy, or hit by a bus?** Archive it, hand it over, let it sit
>   read-only? Deciding this early is a kindness to whoever depends on it later — and to you.
> - **What would make you stop?** The counterpart to the commercial branch's unit economics. Not
>   failure — a stated condition, so stopping stays a decision rather than a slow fade. (`/sunset`.)
>
> **This is a harder question than pricing, not a softer one.** Most open-source projects die of
> maintainer exhaustion, not of a missing business model — and a founder who has answered it has
> answered the thing that actually decides whether the project survives.
>
> ⛔ **Never talk a founder into monetizing** because the cell would look better filled. Some tools
> should stay free — that is BOSS's own position, not a concession — and the conscience does not sell.

> **These four are additive and mostly dormant.** They exist so the canvas can answer a conventional
> reader (a Lean or BMC audience, an operator, an investor) without a second artifact — see
> DEC-004. **Do not walk a founder through them at Quickstart.** Each carries the condition that
> makes it live; until that condition holds, `_(not yet)_` is the honest answer and the canvas is not
> less complete for it. The frame layer will formalise this gating; until then, judgement does.

## 3 · Stewardship
_Impact, risks, and the values that guide decisions._

| Cell | Humane prompt | Sharpen with |
|---|---|---|
| **Metrics** | What does meaningful success look like — for people and planet? | Real pull: activation, retention, conversion, willingness to pay. **And the regenerative ones, weighted as seriously:** what people *learn* or gain in well-being, what makes the venture more *resilient* over time — growth that renews, not just extracts. **Then the planet half, which this cell had been promising and not asking:** what does one unit of this consume — compute, storage, egress, a device someone had to buy — and does it grow with *users* or with *success*? For most software *"very little, and here's why"* is a complete and honest answer; **don't manufacture a footprint to look serious.** It stops being complete when the growth loop *is* inference — an AI feature's footprint is its variable cost wearing a different hat, so `/ai-cost`'s cost-per-successful-outcome is already most of the measurement. Read that number twice: once for the wallet, once for the world. |
| **Risks & Harms** | What could unintentionally go wrong? Who might be harmed or excluded? | Rank the assumptions that could kill the idea. Be honest about harm at scale. Name the *worst-served* person, not an abstraction — the harm axes are in `boss craft harm-taxonomy`. Then run the six surface questions below; they decide which deceptive-pattern families are live for this product at all. |
| **Build or buy?** _(for tool-shaped ideas)_ | Is the honest move to *build* this — or would using/buying something that already solves it serve the person better? | Only ask for internal-tool / process-automation ideas (Jason Fried, 2026: most people want the problem *gone*, not a system to maintain). For a genuine product venture, building **is** the move — skip this cell. The humane answer is sometimes "don't build it yourself." |
| **Principles** | What values will guide your decisions? | The non-negotiables you'll hold even when it's costly. |

### The six questions under Risks & Harms

Ask these once, plainly, and write the answers into the cell. They take a minute and they are the
**only** thing that turns a general catalog into the handful of patterns that can actually bite this
product — a CLI has no cookie banner; a marketing site has no permission prompt; handing either
founder the other's list is how a catalog teaches people to skim.

1. **Do you hold data about people who aren't users and never agreed to anything?** The harvested
   contact, the face in an upload, the second party on a recorded call, the name in a note.
2. **Can the product be used to find or reach someone physically?** Location, family plans, "who
   viewed you", a people-lookup. Assume an intimate-partner-violence threat model if yes.
3. **Does it score, rank, match, or pay a person?**
4. **Could someone under 18 plausibly use it?** If yes, a handful of rows you already have get
   stricter rather than new ones appearing — `boss craft deceptive-patterns --minors`.
5. **Do you send anything about a user to a third party?** Analytics, ads, a pixel, an SDK, a model
   provider.
6. **What shape is this?** `cli` · `dev-tool` · `mobile-app` · `web-app` · `marketing-site` ·
   `chatbot` · `ai-feature` · `agent` · `marketplace` · `ecommerce` · `edtech` ·
   `health-or-regulated` · `social-or-ugc` · `hardware-or-iot`. **Pick every one that fits** — they
   are tags, not buckets, and most products are several.

**Write the tags into the cell AND into `.boss/config.json`** — the config is what makes them
durable. Add or update a `shape` key holding the tags as an array (leave every other key alone):

```json
"shape": ["mobile-app", "edtech"]
```

That is the one answer that saves work three times later — `/red-team --humane`, `/ux-check` and
`/trust` each read `shape` from the config and skip what doesn't apply to you. Then see your rows:

```
boss craft deceptive-patterns --shape <the tags you just picked>
```

> ⚠️ **This paragraph used to claim those three skills already read the tags. They did not.**
> The tags went into a prose cell and nowhere else; `/trust` contained no reference to shape at
> all, and the other two re-asked or inferred. `cohort` — *who the founder is* — had been
> persisted in the config and read everywhere for a hundred releases, while `shape` — *what they
> are building* — was asked and thrown away. A producer/consumer contract that lives only in
> prose is a claim, not a mechanism.

**A "no" is a real answer and the common one.** Four noes and a shape of `cli` is a complete,
honest pass — it means most of the catalog is inert for you, which is exactly what you wanted to
find out. Don't manufacture a yes to look thorough.

## Incubation heartbeat
- **Riskiest assumption:** _(the one most likely to be fatal and least proven)_
- **Experiment this week:** _(the smallest test to prove/disprove it — often a 15-minute call with the right person; `/interview` preps it and debriefs it into graded evidence)_
- **What result would change the plan?** _(decide before you run it)_
```

## Done! — the graduation moment

When the canvas holds up — most of the **live** cells filled with real answers (not `_(not yet)_`
placeholders) and the
**riskiest assumption has a validation plan** (an experiment + what result would change the plan) — the
idea has crossed a real threshold: it's *done enough to build*. Most founders blow right past this and
just start coding. Don't. This is the conscience's **affirming** voice — the counterpart to "what does
this prove?" — and you mark it in two beats:

1. **Arrival.** Name what became real. Where did they start, and what's solid now — a specific person, a
   real tension, a sharp promise, the one bet that could sink it *with* a way to test it? Say it plainly
   and let it land. This isn't praise; it's acknowledging the idea grew up.
2. **Next doorway.** Point at what's next without rushing: `boss unlock mvp` brings the build tools and
   the next mentors (architect, GTM). The canvas keeps — they're free to sit with it.

   **Say what the unlock is *for*, not just what it contains** — and name the thing that needs no
   unlock at all. A sharp Promises cell is the first moment the idea can be shown to a stranger, and
   **`/pretotype` is already here**: it can publish the promise as a real shareable page in one turn,
   no host, no account, no unlock. (`/landing` builds the in-repo version when there's a product
   behind it; that one is on the far side.) Naming only "the build tools" quietly teaches that the
   unlock means *start building*, which is the one inversion this whole skill exists to prevent.
   **The canvas earns the right to test the promise, not just to build it — and testing it is the
   cheaper of the two, so offer it first.** Mention the page once, as an option, never as the next
   task.

In BOSS's voice (the warm register — still spare; tune by ear, don't paste verbatim):

> *"Worth stopping here a second. You came in with 'an app that plans meals' — now there's a specific
> person, a tension that's real, and the one bet that could sink it, with a way to test it this week.
> That's the idea becoming real. Testing it doesn't need anything you don't already have — `/pretotype`
> puts the promise in front of someone this afternoon. `boss unlock mvp` brings the build tools when
> you want them. No rush — the canvas keeps."*

A threshold, not a finish line: "done" here means *ready for the next thing*, and the canvas keeps
evolving as you learn. Never force it — a half-filled canvas with a sharp riskiest assumption is a fine
place to sit; mark it Done only when it's genuinely earned, not as a box to tick.

## Rules

- Humane-first. The Risks & Harms cell is not optional polish — surface real harm honestly, even when inconvenient.
- **The frame never changes the required set.** Risks & Harms and Principles render in Lean and BMC
  too. Un-defaulting the *frame* is not un-defaulting the *ethics* — humane stopped being the only
  frame and became the floor under all of them (DEC-004).
- **Switching frames never asks a question twice.** If an answer exists under any name, it renders
  under its new one. A founder who switches views and gets re-interviewed will not switch again.
- Just-in-time, not all-at-once. Blanks are data; never fabricate answers to look complete.
- **"Live" cells are the ones whose condition holds.** The four conditional cells in §2 (Cost
  Structure, What it takes to deliver, Key Partnerships) and the Build-or-buy cell in §3 are dormant
  until their stated trigger fires, and **a dormant cell left `_(not yet)_` never counts against
  graduation.** Counting them would raise the bar for leaving Quickstart every time the canvas
  learned to answer a new audience — the exact inversion the mode ladder exists to prevent.
- Snapshot, not blueprint — expect it to change; bump `version` when it meaningfully shifts.
- The canvas informs the decision to build; it never replaces actually talking to the people you serve.
- **Credit the frame you rendered, not a blanket line.** Humane Product Canvas by Ajesh Shah ·
  Lean Canvas by Ash Maurya · Business Model Canvas by Alexander Osterwalder & Yves Pigneur. With
  three frames, one blanket credit would be wrong on two of them.
