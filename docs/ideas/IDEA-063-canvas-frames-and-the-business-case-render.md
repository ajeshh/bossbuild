---
id: IDEA-063
type: idea
owner: product-lead
status: shipped (frames v0.191.0; the render layer above rung 1 remains)
proof: none
proof_note: The output of this record was the audit and the decision it forced ([[DEC-004]]) — the canvas was never chosen, it was inherited from a v0.4.0 changelog sentence. The BUILD it justifies is carried by [[FEAT-025]], which declares its own proof.
created: 2026-08-20
promoted_to: FEAT-025
source: Ajesh, 2026-08-20 — "how do we do proto personas and help develop them for the founder?…
  how we do things like the lean canvas or different canvas, proto persona, and also gather all
  the facts or info for creating a business case to then provide it to potential investors?…
  im wondering if we should have that on the website all the things we do?" — then, on being
  shown the audit- "the humane product canvas was just one type, it was not supposed to be the
  only default… ideally we should cover all the bases for building, conventional and humane" and
  "the humane part became default as we built more boss, but i dont think it was intended so"
decides: DEC-004
---

# IDEA-063 — Canvas frames, and the business case that was already in the records

## Three questions that turned out to be one

The ask arrived as four separate things — proto personas, canvases, an investor-facing business
case, and what the website should claim. Two of them collapsed into one gap under audit, and the
audit is the reason this is `ready` rather than `exploring`.

## Finding 1 — the spine was never decided

`/canvas` runs the **Humane Product Canvas as the spine**, singular. That framing entered in the
v0.4.0 changelog entry (2026-05-21, the first canvas release):

> New `/canvas` skill: a **humane business pressure-test** — Ajesh Shah's Humane Product Canvas
> (Human Foundation / Product Expression / Stewardship) **as the spine**, with Lean + Lenny-style
> prompts folded into each cell…

There is **no `DEC` for it.** `docs/decisions/` holds three records and none concerns the canvas.
So a load-bearing framework choice was made in a release note and inherited through ~180 releases
without ever being weighed — the exact class `/decide` exists to catch, committed inside BOSS's own
repo. Confirmed with Ajesh: *"the humane part became default as we built more boss, but i dont
think it was intended so."*

Drift by inheritance, not a decision. That distinction matters: this is a **completion**, not a
reversal, and nothing that follows is an argument against the humane lens.

## Finding 2 — what the single spine dropped

Cell-by-cell against Lean Canvas (Maurya) and the Business Model Canvas (Osterwalder):

| Conventional cell | Home in the Humane canvas |
|---|---|
| Problem | ✅ Problem |
| Existing Alternatives | ✅ folded into Problem ("what do they use today instead") |
| Customer Segments | ✅ People |
| Unique Value Proposition | ✅ Promises ("We help X do Y without Z") |
| Solution | ✅ Story ("smallest compelling workflow") |
| Revenue Streams | ✅ Business Model ("who pays, how much") |
| Key Metrics | ✅ Metrics |
| Unfair Advantage | ✅ Modes of Engagement ("why you're the right team to win") |
| Channels | ⚠️ acquisition only — "how do the first 100 find you". No ongoing distribution. |
| Early Adopters | ⚠️ implied by "who *exactly* has the painful problem", never named |
| Customer Relationships | ⚠️ Modes of Engagement asks a *humane* question, not a relationship-type one |
| **Cost Structure** | ❌ **absent** |
| **Key Resources** | ❌ absent |
| **Key Activities** | ❌ absent |
| **Key Partnerships** | ❌ absent |

**Cost Structure is the load-bearing miss** — the only cell present in *both* Lean and the BMC with
no home here. Revenue without cost isn't a model, it's a price.

## Finding 3 — the investor gap and the canvas gap are the same gap

A separate audit ran first: what a seed data room asks for, against what BOSS holds as a record.
Ten of fourteen already exist — CANVAS cells, graded `EVID`, `DEC` falsifiers, `/measure`,
`/money`, `/pretotype`, `/roadmap`, `/ai-cost`. Four have **nothing**, verified by word-boundary
grep across `stages/*/template` + `library/`:

- **TAM / SAM / market sizing** — zero (one practitioner name-drop in `mentor-fundraising`)
- **Competitive landscape** — zero
- **CAC / LTV as records** — zero (one cohort-table mention in `/cost-review`)
- **Use of funds / the ask / runway** — zero

Those four are not an independent hole. **They are the downstream shadow of the cells the spine
never asked for.** No Cost Structure → no unit economics → no CAC/LTV. No Key Resources or
Activities → no "what would you spend it on" → no use of funds. Fix the canvas and most of the
data room stops being missing.

Worth naming, because it's the position: **the facts BOSS already holds are the ones founders
fake** (graded evidence, honest risks, falsifiable decisions). **The four it lacks are the ones
founders pad.** Some of them should stay absent.

## Finding 4 — the capability ships and the site never claims it

Measured across the whole site:

| Term | Mentions |
|---|---|
| `/canvas` | 4 — all rows in command tables |
| "Humane Product Canvas" | 1 |
| `/persona`, `/interview` | 0 |
| `mentor-business`, `mentor-fundraising`, `mentor-pitch` | 0 |
| "investor" | 0 |

`/persona` ships at **Quickstart** with the full lifecycle — `derive` → `enrich` (four ranked
sources) → `consult` (guides the build *and* QAs it) — carrying a visible **evidence ledger**
(`synthetic N% · real N%`, starts 100% synthetic, shifts as real research lands) and dated
`Notable refactors`. A proto-persona that knows it's a proto-persona. Unclaimed anywhere public.

> ⚠️ **The split that must not be fumbled.** "Proto persona" means two different things in this
> repo. `/persona` ships to founders. The eight `persona-*` agents (vibe-coder-newbie,
> indie-hacker, eng-builder, …) are BOSS's own instruments for pretotyping founder reactions and
> `registry/boundary.json` rules every one of them **`internal`**. README and GUIDE have already
> described dev-workspace agents as founder features once. Putting "proto personas" on the website
> without holding this line repeats that error in the most public place there is.

## The shape — one answer store, several frames

A canvas is **a set of answers, not a layout.** Hold the union of cells as the record; project it
through whichever frame the moment needs:

- **Humane** — Risks & Harms and Principles prominent. Default while the founder is building.
- **Lean** — Maurya's nine, for speed and iteration.
- **BMC** — Osterwalder's nine, when the audience is an operator or an investor.
- **`boss case`** — the investor render, reading the same store.

Same architecture as `boss board` ([[IDEA-015]], [[IDEA-034]]): pure projection, frontmatter is
truth, build the view and refuse the app. A new frame costs a renderer, not a new artifact. It also
dodges the chooser problem — a `first-product` founder never picks a framework; they answer
questions and the frame is a view.

### `boss case` — the render, not a generator

Projects canvas + `EVID` + `DEC` + `docs/dossier/` + `/roadmap` + `/measure` into an
investor-facing document. **Every unsupported claim renders as a named hole with the question that
would close it** — the same convention as the canvas's `_(not yet)_` and the persona's ledger.
Markdown, optionally `--html` (both precedents exist: `boss board --html`, `pretotype/index.html`).

`docs/dossier/` **commits in a founder's project** — it's gitignored only in BOSS's own repo, tier
1. So the mentor artifacts are already durable, shareable, and cofounder-visible. Nothing to build
for that.

**The n=0 objection, and why it resolves.** The first read was *file it, don't build it* — no
founder has asked. What changes it: **at n=0 this render is a conscience moment.** Its honest first
output is *"here is what you can actually claim, and here are four things you'll have to say out
loud that no record supports."* It cannot teach premature packaging, because premature is precisely
what it reports. That's the version worth building, and it's compose-and-subtract ([[EVID-001]]) —
a render over records that exist, not a 47th skill.

## Constraints — where this goes wrong

- **The union is ~16 cells, and `/canvas` says "Don't interrogate"** (asks 2–4 at a time). Frames
  must gate which cells are **live**, not merely how they display. Cost Structure goes live when
  there's a price; Key Partnerships when the domain needs one. Real design work, not a rendering
  detail.
- **Un-defaulting the frame is not un-defaulting the ethics.** If humane becomes one frame among
  three, Risks & Harms and Principles quietly become optional — and those are the two cells no
  conventional canvas has. Frames change layout and vocabulary; they never change the required set.
  **Humane stops being the only frame and becomes the floor under all of them.** → **[[DEC-004]]**

## Refusals — decided up front

- **Never generates a deck _the record can't support_.** ⚠️ *Amended 2026-08-20.* The original
  refusal read "never generates a deck," which was wrong — it refused a **format** when the real
  objection was **fabrication**. Ajesh: *"eventually it can help create a deck or anything a founder
  wants to help share their idea to investors."* That doesn't contradict the architecture, it
  completes it: **a deck is simply the highest-ceremony frame over the same answer store**, and BOSS
  already produces designed artifacts (`/landing`, `pretotype/index.html`). The refusal that
  survives: the deck **renders holes like every other frame**, and BOSS never invents the numbers on
  a slide. A deck is gated on record completeness, not forbidden. → [[FEAT-025]]
- **Never invents a TAM.** The most-faked number in startups; a synthetic fill here is a lie with a
  spreadsheet attached.
- **No legal / tax / securities advice.** The existing bright line (`/money`, `mentor-fundraising`)
  holds unchanged — pointers to real professionals only.
- **No investor CRM or raise tracker.** Build the view, refuse the app.
- **Must not silently invert `mentor-fundraising`'s "not yet" default.** A render that makes the
  raise feel closer than the evidence supports is the failure mode.

## Build order

1. **The site tells the truth about what already ships** — `/persona`, `/interview`, `/research`,
   `/evidence`, the canvas by name with its nine cells, the seven-mentor bench. **No product work,
   unblocked today.** Guards: never say "Lean Canvas" for the humane spine (trades a real position
   for a commodity one), and the eight `persona-*` agents stay invisible. Worth checking whether
   `check-boundary.js` treats `web/` as a shipped surface — if it doesn't, that's the enforcement
   hole that let the README leak happen. → [[IDEA-060]]
2. **Canvas frames** — the answer store, the required-set floor, the live-cell gating.
3. **`boss case`** — the render, once the store has the cells to render.

## Watch

- **Frames are the ceremony risk.** If every real canvas stays in the Humane frame and nobody ever
  asks for Lean or BMC, the frames were ceremony and the single spine was accidentally right. The
  falsifier lives in [[DEC-004]].
- **The floor is the thing that erodes quietly.** The pressure to let a "conventional" frame skip
  Risks & Harms will arrive framed as respecting the founder's time.
- **The website is the leak surface.** Every past dev-workspace-described-as-shipped error happened
  in outward-facing prose, not in code.
