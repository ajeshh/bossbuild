---
id: FEAT-025
type: feature
owner: product-lead
status: shipped (rungs 1–2 — the canvas cells at v0.191.0, the one-pager at v0.272.0 as `/canvas --frame onepager`; rungs 3–4 spun out 2026-09-12)
gist: A founder's business profile as a render over records they already made, not a document they sit down and write. Four rungs, each reachable only when the records under it exist.
proof: stages/L0-quickstart/template/.claude/skills/canvas/SKILL.md
proof_note: The proof pointed at `src/case.js` — a CLI render the CHANGELOG (v0.272.0) says was chosen AGAINST in favour of `/canvas --frame onepager`. Rungs 1–2 shipped inside the canvas skill; that is where the proof points now. Rungs 3–4 (`boss case`, the deck) are IDEA-104.
spun_to: IDEA-104 → folded into IDEA-106 on 2026-09-13 (rungs 3–4 — the case is the playbook shared, the deck is present mode; split when the one-pager shipped and the FEAT sat 84 days at building with its own rung unchecked)
created: 2026-08-20
from: IDEA-063
decided_by: DEC-004
source: Ajesh, 2026-08-20 — "lets create a check list for what else to build for helping create the
  business profile. im almost imagining, eventually it can help create a deck or anything a founder
  wants to help share their idea to investors, get funding, show business model, how they are making
  money, whatever else info needs to be on it"
---

# FEAT-025 — The business profile

The build contract under [IDEA-063](IDEA-063-canvas-frames-and-the-business-case-render.md), framed
by [DEC-004](../decisions/DEC-004-canvas-frames-humane-as-floor.md).

## The thesis, in one line

**A founder's business profile is a render over records they already made — not a document they sit
down and write.** Everything below is either a record BOSS should be able to hold, a view over
those records, or the discipline that keeps the view honest. If a slice can't be described as one
of those three, it doesn't belong here.

## The ladder — what a shareable venture story is made of

Four rungs. Each is the same answer store viewed at a different ceremony level, and **each one is
reachable only when the records under it exist.** That gating is the product.

| Rung | Output | Audience | Gate |
|---|---|---|---|
| 1 | **Canvas frames** (Humane / Lean / BMC) | the founder, a cofounder | exists today, partially |
| 2 | **One-pager** | a warm intro, an advisor | canvas cells filled, ≥1 `EVID` |
| 3 | **`boss case`** — business case / data room | a serious conversation | rung 2 + business model + metrics |
| 4 | **Deck** | a pitch meeting | rung 3 + `mentor-fundraising` says the raise question is live |

---

## Layer 1 — Records: the facts BOSS must be able to hold

### ✅ Already held (no build)
- [x] People / Customer Segments · Problem · Existing Alternatives — CANVAS
- [x] Promises / UVP · Story / Solution · Why now — CANVAS
- [x] Revenue ("who pays, how much") · Acquisition ("how the first 100 find you") — CANVAS
- [x] Metrics (activation, retention, WTP + regenerative) — CANVAS + `/measure`
- [x] Risks & Harms · Principles · Unfair Advantage — CANVAS
- [x] **Graded evidence** — `EVID-NNN` on the 3-rung ladder (`/evidence`, `/interview`, `/research`)
- [x] **Falsifiable decisions** — `DEC-NNN` with a falsifier and a revisit date
- [x] Roadmap — `/roadmap` · Demand test — `/pretotype` · AI cost-per-user — `/ai-cost`
- [x] Mentor positions — `docs/dossier/*.md`, **already commits** in a founder's project

### ✅ Added v0.189.0 — the DEC-004 cells (unblocks most of the data room)
All four are **dormant by default with their own trigger**, and the graduation gate was rescoped to
the **live** cells so a dormant `_(not yet)_` never counts against leaving Quickstart.
- [x] **Cost Structure** — *the load-bearing one.* Only cell in both Lean and BMC with no home here
- [x] **Key Resources** · **Key Activities** · **Key Partnerships** — Resources+Activities folded into one cell (*What it takes to deliver*); for a solo founder they are one question. Partnerships is its own, dormant unless someone else is load-bearing
- [x] **Channels** beyond first-100 acquisition (ongoing distribution)
- [x] **Early Adopters** as a named cell (today only implied by "who *exactly*")
- [x] **Customer Relationships** (distinct from Modes of Engagement's humane question)

### ⬜ To add — investor-specific, each with a judgment attached
**Three landed v0.189.0 as SHARPENS on existing cells, not new ones** — full coverage, zero added
ceremony, and `/canvas`'s "don't interrogate" rule intact. `mentor-capital` now reads all five
data-room-bearing cells before it asks the founder for anything.
- [x] **Market sizing** — landed as a *sharpen on People*, not a new cell: *how many are there, and how
      do you know?* Counted bottom-up (a list, a forum, a job title you can filter on). **"$50B market"
      is not an answer; "about 4,000 exist and I can name where they gather" is** — and a number whose
      source you can't say out loud doesn't go in the cell
- [x] **Competitive landscape** — a *sharpen on Problem*: who else sells a fix, including the
      spreadsheet, the agency, the intern and doing nothing — and **for each real one, why they might
      win.** A picture where everyone else is dismissed is one you drew rather than looked at
- [ ] **CAC / LTV** — gated on real customers (L2+). `/ai-cost` already computes
      cost-per-acquired-user and cost-per-active-user; this connects them to price
- [x] **Team / founder background** — a *sharpen on Modes of Engagement's unique advantage*, because a
      bio isn't a venture fact but credibility is: **what makes that advantage believable to someone who
      doesn't know you?** Not a CV — the specific thing you've seen, built, sold or lived
- [ ] **The ask + use of funds** — belongs in **`mentor-capital`'s** dossier artifact (it absorbed the
      fundraising lens in [[DEC-006]]), live **only** once the raise question is. Not a canvas cell —
      and gated behind the coach's hard "not yet" default, so this stays open on purpose
- [⊘] **Traction timeline** — **resolved as WON'T-BUILD (as a record).** Fully derivable from `EVID`
      dates + CHANGELOG + `/measure`; adding a field would duplicate truth. It belongs to the render
      layer, and is closed here so it stops reading as outstanding work

### ⛔ Refused as records — the bright lines
- [ ] ~~Cap table, entity structure, securities~~ — pointers to a real lawyer/accountant only.
      Unchanged from `/money` and `mentor-fundraising`
- [ ] ~~Financial projections~~ — a five-year hockey stick BOSS computes is fabrication with a
      spreadsheet attached. The honest version is price × cost at today's numbers, which is Cost
      Structure and already listed above
- [ ] ~~Anything BOSS would have to invent to fill~~ — a hole renders as a hole

---

## Layer 2 — Renders: the outputs

- [x] **Canvas frames** — Humane (default) / Lean / BMC, shipped v0.191.0. Required-set floor holds:
      **Risks & Harms and Principles render in every frame**, appended under *"two questions this
      canvas asks that Lean doesn't"* rather than hidden. A full answer→cell mapping means switching
      **never asks anything twice**, and `--frame` on an existing canvas is a RENDER, not an interview
- [x] **One-pager** — shipped v0.272.0 as `/canvas --frame onepager`. The smallest shareable thing. Probably the highest-value/lowest-cost render
      and the one a founder actually needs first
- [ ] **`boss case`** — business case / data room. Projection over canvas + `EVID` + `DEC` +
      dossier + roadmap + measure. **Markdown first**, `--html` second (precedents: `boss board
      --html`, `pretotype/index.html`)
- [ ] **Deck** — rung 4. ⚠️ *The refusal was amended:* the original "never a deck" refused a format
      when the objection was fabrication. A deck is the highest-ceremony frame over the same store,
      it renders holes like every other frame, and BOSS never invents the numbers on a slide
- [ ] **Shareable link** — single-file, no host, no account. `/pretotype`'s publish path already
      does exactly this; reuse it rather than inventing a second one
- [ ] **Investor update** — recurring, post-raise. **n=0 and gated**; do not build on imagination

> **The surface these are browsed on is NOT part of this FEAT** → [[IDEA-065]] (the living
> dashboard). It was heading in here as a Layer-5 bolt-on and got pulled out deliberately: a private
> workbench showing *everything* and a curated artifact shown to *someone outside* are two products,
> and merging them makes a thin record read as a strong one. The renders above are the deliverable;
> where a founder browses them is a separate question with its own gate.

---

## Layer 3 — Discipline: what keeps the render honest

This layer is the differentiator. Without it, this feature is a deck generator, and the world has
plenty.

- [ ] **Holes render, never fill.** Every unsupported claim appears as a named gap *with the
      question that would close it* — the `_(not yet)_` and `synthetic%·real%` conventions, extended
- [ ] **An evidence ledger on the whole profile.** The persona already does this per-persona; the
      business profile needs it end-to-end: *what fraction of this document is backed by graded
      evidence versus asserted?* One number, visible, at the top
- [ ] **Freshness.** Records rot. A case resting on six-month-old `EVID` says so. `check:freshness`
      and `revisit_by` precedents exist — reuse the machinery
- [ ] **The "not yet" default must survive the render.** `mentor-fundraising` defaults to *don't
      raise*. A render that makes a raise feel closer than the evidence supports is the failure mode
- [ ] **At n=0 the render is a conscience moment.** Its honest first output is *"here's how little
      you can claim, and here are four things no record supports."* This is what makes the feature
      not-premature-packaging, and it must never be softened into encouragement
- [ ] **No score, no grade.** [DEC-003](../decisions/DEC-003-position-not-verdict.md) applies here
      with full force: position, never verdict. No "investor-readiness: 62%"

---

---

## Layer 4 — Accretion: do the artifacts keep building as evidence lands?

Seed: Ajesh, 2026-08-20 — *"is it designed in such a way, that as more data is uncovered those
artifacts continue to build, iterate, edit… follow the principles of continue harvesting."*

**Audited 2026-08-20. The answer is split, and the split is the finding.**

### ✅ Per-artifact, accretion is genuinely designed in
Every founder artifact already has a growth model, and they are good ones:

| Artifact | How it accretes |
|---|---|
| `/persona` | evidence ledger (`synthetic% · real%`) + dated **Notable refactors** + three enrich sources ranked by strength |
| `/triage` | living doc — sharpening "current shape" over an **append-only capture log** |
| `/canvas` | `version:` bump, `_(not yet)_` blanks as honest signal, re-runnable, cites `EVID` ids in the riskiest-assumption cell |
| `EVID-NNN` | append-only, one signal per file, fixed 3-rung grade |
| `DEC-NNN` | **supersede, don't edit** + falsifier + `revisit_by` |
| `docs/dossier/` | mentors append dated positions and **read their own prior artifact before speaking** |

### ❌ Cross-artifact, the harvest is entirely manual
Nothing notices that new evidence should update an older artifact. Verified:

- **`/research` never mentions `/persona`. Zero times.** It is the skill that digests a whole
  transcript into graded `EVID` *and* synthesized pains/jobs/verbatim/workarounds — and `/persona`
  declares dropped-in real research **"the strongest source — it shrinks the synthetic share
  fastest."** So the two skills that produce real evidence at scale do not know the artifact that
  most wants it exists. **The loop is open exactly where the value is highest.**
- **`/interview` references `/persona` only in the other direction** — the persona may *rehearse
  your questions* beforehand. Results never flow back.
- **No loop watches staleness — the runtime cannot express it.** `loop-runtime.js` has a closed
  vocabulary of three predicates (`exists`, `count_at_least`, `any_file_matches`), and **all three
  test content or existence; none compares two timestamps.** So L0's `canvas-loop` and
  `capture-loop` both fire on **absence** by construction, not by oversight. Zero loops mention the
  persona at all.
- **`boss board` staleness covers `FEAT`/`IDEA` frontmatter only** (`next_review:`), and
  `src/board.js` *deliberately* refuses to infer staleness from age. Canvas and persona are outside it.

> 🔴 **The one-line version: BOSS's conscience watches for what was never made. It does not watch for
> what stopped being true.** Every existing moment is an absence predicate. Harvesting is a staleness
> predicate, and BOSS has none for founder artifacts.

### The fix shape — composition, not new skills ([[EVID-001]])
1. **Close the highest-value link first.** `/research` and `/interview`, on producing real signal,
   **offer** to fold it into the persona — one step each, reusing `enrich`. Not automatic: the
   ledger's honesty depends on the founder seeing what shifted.
2. **One staleness predicate, not a suite.** *N new `EVID` since the persona or canvas last moved.*
   That is a real, cheap, non-guessed signal — it reads two mtimes and a count, and never infers
   from age, which keeps `board.js`'s refusal intact.
3. ✅ **BUILT v0.190.0 — `outpaced_by` + `harvest-loop`.** The runtime gained its only temporal
   predicate, and the persona half of the harvest is live: ≥2 `EVID` newer than the persona opens a
   judgment-gated `harvest` moment, and running `/persona enrich` silences it by making the persona
   the newest file. **The canvas half is deliberately still open** — evidence-to-cell is a looser
   mapping than evidence-to-person, and looser mappings mean false fires on the one loop whose whole
   risk is crying wolf.
4. **Voice it once, as a situation.** *"Three pieces of evidence have landed since the canvas last
   moved."* Situation-not-person, overridable, auto-silencing — the standing conscience grammar.

**Refuse:** auto-editing an artifact when evidence lands. The persona's ledger and the canvas's
version history are only worth anything because a human watched them move; silently rewriting them
is how a synthetic read gets laundered into a real one.

### The brownfield face of the same gap — reverse-mining an existing app

Seed: Ajesh, 2026-08-20 — *"how does it work, if its in an existing app folder installed, being able
to reverse mine for the data is key."*

**The reading is genuinely good. The wiring is missing.** `/comprehend` on an adopted repo reads the
code, README, structure and deps with wide context, forms a real position, and writes it to
`.boss/brain/read.md` — plus the `AGENTS.md` overview, plus a *recommendation* to run `/persona`
when it sees a target user worth modeling. All reversible and diffable, honoring [[DEC-003]]
(position, never verdict).

Then the trail stops:

| Skill | Reads `.boss/brain/` ? |
|---|---|
| `/comprehend` | ✅ writes it |
| `/close` | ✅ updates it |
| `/persona` | ❌ **0 mentions** |
| `/canvas` | ❌ **0 mentions** |
| `/triage` | ❌ **0 mentions** |

`/persona derive` reads *"the captured idea (`docs/ideas/*.md`) + its canvas if one exists."* On an
adopted brownfield repo both are typically **empty** — so the founder runs `derive` and it starts
from near-nothing, **minutes after BOSS read their entire application.** `/comprehend` even *suggests*
`/persona`, then hands it no material.

> 🔴 **The synthesis: this and the accretion gap above are one architectural defect with two faces.**
> BOSS produces understanding and stores it faithfully, and **the artifacts do not consume the
> stores.** `/research` produces graded evidence → the persona never sees it. `/comprehend` produces
> a whole-repo read → the persona and canvas never see it. The brain is **write-only from the
> artifact layer's point of view**: two writers, zero readers.
>
> This is why "reverse mine for the data" feels missing even though the mining works. The mining
> works. The delivery doesn't.

**The fix is the same one applied at the other end:** `/persona derive` and `/canvas` read
`.boss/brain/read.md` as a source when the idea docs are thin — and, being derived from code rather
than from users, it lands in the persona's ledger as **synthetic**, marked *derived from your repo,
not from a person*. That keeps the ledger honest while making the brownfield start non-blank, which
is the entire point.


## Layer 0 — Enforcement (done first, because it guards everything above)

- [x] **`check-site.js` agent regex missed `persona-`** — the eight `persona-*` agents are
      `internal` per `boundary.json`, and were the single most tempting thing to put on a page about
      `/persona`. Prefix added; guard verified to fire. *(2026-08-20)*
- [x] **Coverage was one-directional, and the generated table hid it** — `{{REFERENCE}}` expands to
      a row per skill, so the built site "mentions" all 47 and greps clean. Now measured against
      `web/` (hand-written) instead: **10/47 skills and 7/15 agents appear in no hand-written
      sentence**, including `persona` and all four money mentors. *(2026-08-20)*
- [x] **Fix the prose gap** — closed to **zero** in v0.192.0. Both counts went 10/48 skills and
      5/11 agents → **0 and 0**. The sweep also found what the measurement couldn't: **three retired
      agent names live on the public site** (`pm` in two terminal mocks, "a database architect" in
      two pages of prose), a V1 rung described as hiring mentors when [[DEC-006]] left it with **zero
      agents**, and the canvas still presented as one framework rather than [[DEC-004]]'s frames.
      `check-site.js`'s agent scan now reads `<pre>` mocks as well as `<code>` tags — the mock was
      the one place it couldn't see, and it is the strongest claim on the site. *(2026-08-21)*

> 🔴 **A correction to the earlier audit.** It reported `/persona` and `/interview` at "0 site
> mentions." Measured precisely: `/persona` appears once, in the **generated** reference table on
> `quick-guide.html`, and in **zero** hand-written sentences. `/interview` has two real prose
> mentions. The distinction matters more than the original claim did — *listed in a generated table*
> is not *claimed*, and the table is exactly why nobody noticed for 188 releases.

---

## Build order

1. **Layer 0** — enforcement. ✅ two of three done today
2. **Site prose** — claim what already ships. No product work, unblocked
3. **DEC-004 cells** — Cost Structure first; it unblocks unit economics and most of the data room
4. **Canvas frames** — the answer store + required-set floor
5. **One-pager** — smallest useful render, proves the architecture
6. **`boss case`** — the data room render
7. **Deck** — rung 4, gated

## Gates — what must NOT be built on imagination

Rungs 3 and 4, and the investor update, are **n=0 on real founder demand**. The architecture is
worth building because the records already exist and the render is cheap; the *ceremony* is not
worth building ahead of a founder who wants it. Build 1–5 on the strength of the design. Build 6 and
7 when someone asks. ([[EVID-001]] compose-and-subtract.)

## Build log

_Append-only, newest at the bottom. The decision and the surprise, not the narration —
the parts you cannot reconstruct in six weeks. Empty is an honest answer; it means the
work so far was routine. `/log` and `/close` append here._

- 2026-08-25 — Section added retroactively. This FEAT was written after v0.172.0 introduced the
  build log and shipped without one, so `/log` and `/close` had nowhere to append and silently
  didn't. Earlier arc is not reconstructed here — Layer 0's landing is recorded in `proof_note:`
  and `registry/CHANGELOG.md` is canonical.
