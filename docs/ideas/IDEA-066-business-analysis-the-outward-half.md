---
id: IDEA-066
type: idea
owner: product-lead
status: deferred (trigger-gated)
proof: none
proof_note: A capture record — its output is this inventory and the design question at the top of it. Whatever gets built lands as skills or canvas machinery with their own proofs; nothing here is committed yet.
created: 2026-08-20
source: Ajesh, 2026-08-20 — "lets also add potential todos for shoring up our business analysis:
  competition eval, market research, market sizing, not sure what else research or data would be
  beneficial that we should build as part of business analysis."
relates: FEAT-025, IDEA-063, DEC-004, DEC-006
---

# IDEA-066 — Business analysis: the outward half

> **PARKED 2026-08-20** (Ajesh: *"any other idea worth parking / archiving"*). `deferred` is the deliberate status — a decision, not a
> backlog item — and the re-open trigger is written in this file.
>
> **The record already carries a `## Gate` and it says wait.** *"Tier 1 is genuinely useful and still
> n=0 on demand. The cells it feeds shipped **today**, so no founder has yet hit the wall of being
> asked a question they can't answer."* The v0.189.0 canvas sharpens — competition, market size, team
> credibility — are live and unused by anyone but BOSS. The outward half is what happens *after*
> someone hits that wall.

## 📝 Note, 2026-09-11 — the persona shape, not the worksheet shape (Ajesh)

> *"I think it's like personas — for market sizing it's more of collecting the data shared by the
> user and slowly growing it."*

**This changes the shape without changing the gate.** The deferral above was against the
**worksheet** — sit down, produce TAM/SAM/SOM, paste it in a deck — and that version keeps its
trigger. The **persona** shape is a different thing: start from what is actually known, ledger how
much is real, grow it as evidence lands, never let the synthetic part read as more than it is.

In that shape market sizing is **not a skill you run; it is a projection over records that already
exist**, and it is empty until they do:

| Already kept | Gives the market file |
|---|---|
| `docs/personas/` | who is in it, and the segment each person stands for |
| `docs/evidence/` (EVID grades) | how many have actually been reached — **counted**, not estimated |
| `docs/competition/` | what they pay today for the alternative — **sourced**, dated |
| canvas Problem cell | what they use instead |

The honest bottom-up number is *people actually talked to × the segment they stand for × what they
already pay for the alternative*. All three inputs exist. Nothing is invented.

🔴 **The one discipline harder here than for personas, and it is the whole risk.** A persona is a
*description* and a model can derive a plausible one. A market is a *quantity*, and a model will
produce a confident number for anything — `/comp-eval`'s named failure mode (*"a confidently
invented price"*) at a larger scale. So the ledger must be stricter than the persona's
synthetic/real split: **every figure is `counted` (own records) · `sourced` (URL + checked date) ·
or `guessed`, and a guessed figure renders as a guess, never as a number.** A file whose ledger
says 90% guessed is honest and useful. One that hides it is a pitch slide.

**Where it would live:** the canvas already asks the market-size question (v0.189.0) and nothing
helps answer it. The projection is that cell's answer, computed from the records with the ledger
beside it — `/canvas` gains a read, growth follows `/persona enrich`'s pattern. No new skill, no new
file class, JIT by construction.

**Status: still `deferred`, on purpose.** Recorded so the next person to open this does not
re-derive the worksheet objection, and so the shape is on file when it is built. The re-open is now
either the original trigger **or** the cheaper one — a project holding all three inputs, at which
point the projection costs nothing.

## The finding that frames the list

v0.189.0 taught the canvas to **ask** about competition, market size and team credibility — three
sharpens on existing cells, no new ceremony. What it did not do is help a founder **answer** them.

**Every research skill a founder has points inward.** `/research` digests a transcript they were
given. `/interview` preps and debriefs a call they had. `/persona` derives from an idea they already
wrote. All three turn *material the founder already encountered* into graded records — which is
excellent, and is not market analysis.

**The outward-facing half ships to nobody.** `/deep-research` — fan-out search, fetch the primary
source, adversarially verify, cite — was written the same day and is `internal` in
`registry/boundary.json`: BOSS curating BOSS.

So the shape of the gap is precise: **BOSS asks the founder questions whose answers are outside the
building, and has no opinion about how to go get them.**

## 🔴 The design question, before any of the TODOs

**Does BOSS do the research, or structure it?**

Its own grain answers this consistently, and the precedents are strong:

- `/interview` — *"BOSS preps and debriefs; it never simulates the interview."*
- `/pretotype` — designs the demand test; the founder runs it.
- `/persona` — after today, says *"have your host search the web"* rather than naming a verb.

**Recommendation: structure and grade, don't fetch.** The founder's host already searches the web,
and it will keep getting better at it faster than BOSS can. What BOSS uniquely owns is the *method*
and the *honesty bar* — what to look for, what counts as an answer, how to grade what comes back, and
which numbers to refuse. A `/deep-research` clone in the founder template would be BOSS competing
with its own host, which [[IDEA-006]] warns against, and would age badly.

The corollary: whatever ships here is **thin**. A page of method and a grading rubric, not a crawler.

---

## The TODO list

### Tier 1 — feeds a cell that now exists (clearly scoped, highest value)

| # | What | Feeds | The honesty bar it must carry |
|---|---|---|---|
| 1 | **Competitive eval** | Problem cell | Include the non-obvious competitors — the spreadsheet, the agency, the intern, and doing nothing. **For each real one, why they might win.** A landscape where everyone else is dismissed is one you drew rather than looked at. |
| 2 | **Market sizing (bottom-up method)** | People cell | A *method*, never a calculator: find the list, the forum, the filterable job title; count; name the source. Refuses any number whose provenance the founder can't say out loud. |
| 3 | **Pricing / WTP anchors** | Business Model + Cost Structure | What comparable things actually charge, and what that implies about the ceiling. Pricing is BOSS's best-researched corner already (`RVW-023/030/036`, two practices) — this is the *founder-facing* half of it. |
| 4 | **Channel research** | the ongoing-Channels sharpen | Where these people actually gather, and which of those a solo founder can reach this month. Distinguishes *a channel* from *you hustling* — the sharpen already names the distinction and gives no way to test it. |
| 5 | **Why-now evidence** | Story cell | What changed — a price curve, a regulation, a model capability, a behaviour shift. The cell asks; nothing helps establish it. Weakest-evidenced cell on the canvas today, and the one investors probe hardest. |

### Tier 2 — real, but needs a trigger before it earns a build

| # | What | Trigger |
|---|---|---|
| 6 | **Regulatory / compliance scan** | A regulated domain (`domain-expert` cohort: clinical, legal, financial). `/trust` is adjacent but scoped to privacy, not to whether the venture is *allowed*. |
| 7 | **Build-vs-buy scan** | The canvas has the cell (tool-shaped ideas) and **nothing researches it** — the honest answer is sometimes "this exists, buy it," and BOSS currently asks the founder to know that unaided. |
| 8 | **Cost / benchmark research** | What it costs to build and run this class of thing. `/ai-cost` covers inference; nothing covers the rest. |

### Already covered — do not rebuild
Customer research (`/interview`, `/research`, `/persona`) · demand (`/pretotype`) · AI unit cost
(`/ai-cost`) · retention and activation (`/measure`, `/health`, `/onboard`).

### ⛔ Refuse
- **Automated competitor scraping.** Brittle, ToS-hostile, and stale the day it runs.
- **Analyst-report numbers.** Mostly paywalled, and they are precisely the padded figures
  [[FEAT-025]] refuses to let a founder lean on.
- **Any number BOSS cannot name a source for.** Already the shipped rule in the market-sizing
  sharpen; it generalises to everything here.
- **A founder-facing `/deep-research` clone.** See the design question — that is the host's job.

---

## 🔴 Correction — competition is a verb, and BOSS *should* fetch for it

Ajesh, 2026-08-20, on reading the recommendation above: *"competition: it can help do research, and
structure it. if i say find me all the competition for x, features, pricing, differentiators. then
help do research and organize. so its more like /comp-eval or something. and i can add names of new
comp, and have it do the eval."*

**This narrows "structure and grade, don't fetch" rather than overturning it, and the distinction is
worth keeping straight.** The recommendation holds where the founder already knows what to look for
and only needs a method. It fails for competition, for one reason the other four TODOs don't share:

> **You cannot list the competitors you don't know exist.** Every other Tier-1 item asks the founder
> a question they could in principle answer from their own head. *"Who else is selling a fix?"* has a
> tail the founder is structurally blind to — and that tail is where the surprise lives.

**And competition is the only one with a durable artifact that has a lifecycle.** Market sizing is a
number you establish and revisit. Why-now is a claim. **A competitor set is a living table** — rows
get added ("I heard about this one"), rows go stale (they changed their pricing last month), rows get
re-evaluated. That is the accretion property from [[FEAT-025]] Layer 4, and it is what earns
competition a **verb of its own** rather than a method attached to a cell.

So: **`/comp-eval`** — discovery *and* structure, both. Roughly: name a space or a competitor, BOSS
researches and files it into a standing comparison (features · pricing · differentiators · why they
might win), the founder adds names as they hear them, and re-running re-evaluates rather than
regenerating.

### The three risks that decide whether it's honest or embarrassing

1. 🔴 **Fabricated pricing is the single biggest danger.** A model will confidently invent tier names
   and dollar figures for a product it half-remembers. **Every cell in the table needs a source URL
   and a checked-on date, or it is marked unverified** — no exceptions, no "approximately."
   This is the `sources.json` citation-debt lesson applied before the debt exists.
2. **Comp tables rot faster than anything else BOSS holds.** Competitor pricing changes monthly. A
   table with no per-row *last checked* is actively misleading by month three, and it will be quoted
   into a pitch.
3. **Scope creep to a CRM.** Build the view, refuse the app ([[IDEA-034]]). No pipelines, no alerts,
   no "track competitor" daemon.

**Unchanged:** the *"why might they win"* bar from the Problem sharpen carries into every row, and
the refusal list above stands — no scraping, no analyst-report numbers, no unsourced figures.

### Settled with Ajesh, 2026-08-20 — `/comp-eval` is unblocked

| Question | Answer |
|---|---|
| **Rung** | **MVP (L1).** It is real work with a real artifact; at Quickstart the canvas's *"what do they use today?"* is the right-sized version. Accepted cost: the *"someone already built this"* surprise is most valuable **before** you build, and this arrives one rung after that. The canvas's build-or-buy cell partly covers the gap. |
| **Staleness** | **Age badge per row.** Every cell carries `checked`, and rows past the threshold render visibly stale — the same passive-honesty move `/design-library` makes with source hashes. Chosen over active re-verification (heavier, and re-checking on every open burns the founder's time on rows that rarely move) and over a conscience moment, **which is unbuildable today** — `loop-runtime.js` has three content/existence predicates and none compares timestamps. |
| **Artifact** | **`docs/competition/`** — a directory, README table plus one file per rival. Commits with the repo like `docs/personas/` and `docs/evidence/`, so it is diffable, greppable and cofounder-visible. Per-rival files hold the depth (notes, quotes, history) that a single table cannot. |

**The gate is satisfied:** IDEA-066's re-open trigger was *a founder who can't answer the sharpen* —
Ajesh asked for this directly while filling exactly that role. Building.

## Open questions

1. **One verb or several?** A single `/analyze` covering tiers 1–2 risks becoming the interrogation
   `/canvas` refuses. Five thin methods attached to the cells they feed may be truer to JIT — but
   five new skills contradicts compose-and-subtract. **Possibly it is zero new verbs: the methods
   live in the cells' own guidance and `mentor-capital` runs them.**
2. ✅ **RESOLVED — [[DEC-008]]: desk research is context, not evidence.** It lives in the artifact it
   informs with a source URL and a `checked` date; it never becomes an `EVID`. The deciding argument
   was downstream: **the conscience reads the evidence ledger, so research counting as `EVID` would
   let a founder raise their evidence grade by googling** — silencing the nudge toward a real
   conversation while the riskiest assumption stayed untested. **Tier 1 is unblocked.**
3. ~~Where do findings land?~~ *(superseded by the above)* A market-size answer is evidence about the world, not about a user.
   `EVID-NNN`'s three-rung ladder (stated-pain → observed-behavior → commitment) **does not fit
   desk research at all** — that ladder grades what a *person* did. This needs an answer before
   anything is built, or the findings will be graded on a scale designed for something else.
3. **Does `/vet` handle outside claims here?** It exists for exactly this — an unproven claim from a
   stranger — but it is BOSS-internal today.

## Gate

⚠️ **Tier 1 is genuinely useful and still n=0 on demand.** The cells it feeds shipped *today*, so no
founder has yet hit the wall of being asked a question they can't answer. **Re-open trigger:** a
founder fills the canvas and leaves the competition or market-size sharpen at `_(not yet)_` **because
they didn't know how to find out** — as distinct from it not being live yet. That distinction is the
whole signal, and question 2 above should be settled before anything is built.

**Sharpened 2026-09-13 (carried in from [[IDEA-093]] part 7, so this record is the one owner):** not
*"a founder asks"*, but **the first time a founder is asked one of these questions by someone else and
cannot answer it** — a raise conversation, a partner call, a pricing decision against a named rival.
An event with a date, and it arrives at **V1**, not MVP. Distinct from [[IDEA-104]], which is the
other direction — rendering what BOSS already holds *out* (a case, a deck); this record is about
finding answers that live *outside* the building.
