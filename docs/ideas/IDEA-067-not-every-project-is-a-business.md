---
id: IDEA-067
type: idea
owner: product-lead
status: shipped (rung 1, v0.195.0) — rungs 2-3 deferred by DEC-009
gist: BOSS has one axis for who the founder is (cohort) and none for what the project is for. Commercial intent is assumed in exactly one load-bearing place — and BOSS's own project is the counter-example.
proof: stages/L0-quickstart/template/.claude/skills/canvas/SKILL.md
proof_note: Rung 1 landed in the canvas skill's Business Model sharpen and `/money`'s Step-0 router — composition over existing machinery (conditional cells, DEC-004 frames), no new ceremony. Rungs 2-3 are deferred by DEC-009 with a written re-open trigger and deliberately have no proof file.
created: 2026-08-21
source: Ajesh, 2026-08-21 — "one of the assumption is that all products are built for profit. what
  about creative commons, open source, just for fun and other kind of ideas, how do we support from
  the business end those.. or release them from needing, but building other support for those items."
relates: DEC-004, DEC-009, FEAT-025, IDEA-066, DEC-006
---

# IDEA-067 — Not every project is a business

> ✅ **SETTLED 2026-08-21 by [[DEC-009]]** — Ajesh chose *"incubator that handles other intents
> gracefully."* **Rung 1 shipped** (the canvas's second branch + `/money`'s stop-don't-route branch).
> **Rungs 2 and 3 are `deferred`**, not open work: no `intent` axis, no second body of non-commercial
> support, and **the positioning does not change.** The re-open trigger is at the foot of this file.
>
> The same shape as [[DEC-004]]: **a default that arrived by inheritance rather than by decision.**
> There the inherited default was a *frame* (humane as the only canvas). Here it is an *intent*
> (commercial as the only reason to build). Both were reasonable; neither was chosen.

## The audit — and most of it is good news

I expected to find commercial assumptions everywhere. **They are not everywhere. They are in one
load-bearing place**, and naming the rest as already-fine matters, because the fix is small enough to
be worth doing and would be invisible under a wider claim.

### ✅ Already handles this well — do not rebuild

| Surface | What it already does |
|---|---|
| **Licensing** | `/boss` asks during spin-up and offers MIT / Apache-2.0 / AGPL-3.0. The proprietary default is **argued, not lazy**: *"a permissive open-source grant, once published, cannot be revoked"* — a reversibility argument, and the correct one. Defaulting to the reversible option and asking is exactly right. |
| **`mentor-capital`** | Its structure axis already holds **"Open-source / free, supported by other revenue OR not monetized at all (some tools should stay free)"** as a first-class option, alongside sponsorship and patronage. The coach is not the problem. |
| **`/money`** | Gated hard by *stage*: no willingness-to-pay signal → **"Stop. Don't build a payment rail for a customer who doesn't exist."** It never front-runs. |
| **`margin-trap-loop`** | Explicitly dormant pre-revenue: *"there is no price and no ARPU, so there is nothing to compare cost against."* |
| **Cost Structure / Partnerships / delivery cells** | Already conditional, and [[DEC-004]] settled that **a dormant cell never counts against graduation.** The mechanism this needs already exists and is already load-bearing. |
| **`/sunset`** | The standing precedent that not every project must grow. Ending well is shipped as a skill. |

### 🔴 The one that actually bites — and it is one word

**`Business Model` is the only cell in its group with no condition on it**, so it is live for every
project and counts toward the Quickstart→MVP graduation gate. Its neighbours are all gated. It isn't.

But look at what the cell actually asks:

> | **Business Model** | *How will you sustain this without compromising your promise?* | Who pays, how much, why is it worth it? … |

**The humane prompt is already intent-neutral.** *"How will you sustain this"* is exactly the right
question for a maintainer, an artist, a researcher, or someone building a thing for their friends —
arguably it is the question that kills more open-source projects than any commercial one.

**It is the *sharpen* that assumes commerce.** "Who pays, how much" has no honest answer for a
CC-licensed project, and the canvas forbids fabricating one (*"blanks are data; never fabricate
answers to look complete"*). So a non-commercial founder is left with two bad moves: invent a revenue
line, or leave the cell `_(not yet)_` and read as permanently unfinished against a gate their project
will never clear.

**The cell does not need re-framing. Its sharpen needs a second branch.** That is composition, not
addition — and it is a much smaller change than the question sounds like it needs.

### 🔴 The structural gap behind it — BOSS has one axis where it needs two

The **cohort** system is real, well-built and read by the conscience: eight declared cohorts routing
voice, depth and pacing. Every one of them answers **"how much do you already know?"**

- `first-product` · `vibe-coder-newbie` · `non-tech-founder` · `eng-builder` · `vibe-virtuoso` ·
  `returning-founder` · `domain-expert` · `indie-hacker`

**Not one answers "what is this for?"** `indie-hacker` is the closest — anti-VC, sustainability over
scale — and it is still commercial. Intent is a **second, orthogonal axis**, and BOSS has one axis.

That is why this reads as an assumption rather than a decision: BOSS never asks, so the commercial
reading is what's left.

### The dogfood proof — BOSS is its own counter-example

BOSS is **MIT-licensed**, ships on npm, and is self-hosted as its own first project. Its own canvas
answers the Business Model cell with:

> *"Default shape: calm-company / OSS / patronage… **unchangeable until there's WTP signal from a
> real cohort**… No pricing decision is honest before then."*

**That is not an answer to "who pays, how much." It is a well-written deferral in a cell that has no
honest way to hold one** — the workaround a non-commercial project has to invent because the cell
offers no other shape. n=1, and it is the project writing the tool.

Same family as [[DEC-006]] (*BOSS shipped a heavier org than the incubator it models*) and the
conscience that had never fired on BOSS: **the gap is visible from inside its own repo.**

## The design — three rungs, and only the first is clearly earned

### ✅ Rung 1 — the sharpen gets a second branch *(SHIPPED v0.195.0)*
The Business Model cell keeps its humane prompt and gains an alternative sharpen for projects that
will not charge: **what keeps this alive, who else could carry it, and what happens when you get
bored, busy, or hit by a bus?** Sustainability without revenue is time, attention, contributors and a
succession plan — a *harder* question than pricing, not a softer one. The cell stops being a
commercial gate and becomes what its own prompt always said it was.

### ⊘ Rung 2 — intent as a declared axis *(DEFERRED by [[DEC-009]] — n=0)*
An `intent` field beside `cohort` in `.boss/config.json` — asked once, editable, never re-asked.
Candidate values: `commercial` · `open-source` · `public-good` · `personal`. It would gate cells,
re-frame vocabulary, branch `/money`'s router (which today reads *where you are* in the arc and has
no branch for *not being in it*), scope `/comp-eval`'s relevance, and change what
[[FEAT-025]]'s render layer is even *for* — a "business profile" for a CC project is a different
document with a different reader.

⚠️ **This is the expensive rung and the one that could go wrong.** A second declaration axis is real
machinery, and BOSS's own mandate is compose-and-subtract ([[EVID-001]]). It should not be built
until the charter question below is answered, because the answer determines whether it is a *first-class
axis* or a *graceful edge case*.

### ⊘ Rung 3 — the support that replaces the business support *(DEFERRED by [[DEC-009]] — n=0)*
If a project is released from the revenue questions, the honest move is not silence — it is the
questions that actually decide whether a non-commercial project survives. The real ones, from the
literature and from watching OSS projects die: **maintainer burnout · the contributor pipeline (the
bus factor) · scope discipline and saying no to feature requests · governance and license choice as a
succession plan · funding-for-sustenance (sponsors, grants) as distinct from funding-for-growth.**

None of these has a home in BOSS today. **All of them are n=0 on demand** and none should be built
before someone asks. Captured so the shape is on record, not so it gets built.

## ✅ The charter question — answered 2026-08-21

BOSS's own one-line description is **"a just-in-time startup incubator"** that takes a founder
*"from idea to fundable/hireable venture."* Making non-commercial projects first-class is not a
feature decision; **it changes what BOSS says it is.**

Two honest readings were on the table. **Ajesh chose the first**, and [[DEC-009]] records it with a
falsifier:

1. ✅ **CHOSEN — startup incubator that handles other intents gracefully.** Rung 1 only. The commercial arc stays
   the spine; a non-commercial project is never *blocked* or made to lie, but BOSS doesn't grow a
   second body of support for it. Cheap, honest, and leaves the positioning alone.
2. ⊘ **Not chosen — build tool for anyone making something, of which startups are the best-served case.** Rungs 1–2,
   and rung 3 when someone asks. Truer to *"Make it real"* and to the [[boss-ethos]] framing of BOSS
   as a **catalyst / build tool** rather than a startup-specific product — but it widens the surface
   at exactly the moment [[EVID-001]] says compose and subtract.

## Gate

⚠️ **Rung 1 is n=1 and the n is BOSS.** That is a legitimate signal — BOSS is a real MIT-licensed
project whose own canvas had to invent a workaround — and it is also the weakest kind of n=1, because
the tool's author is the user. **Rungs 2 and 3 are n=0.**

**Re-open trigger for rungs 2–3:** a founder whose project will genuinely never charge hits the
Business Model cell, or the graduation gate, and either fabricates an answer or stalls. That is the
symptom; rung 1 is the treatment. Everything above rung 1 waits for someone who isn't Ajesh.
