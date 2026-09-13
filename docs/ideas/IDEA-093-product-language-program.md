---
id: IDEA-093
type: idea
owner: product-lead
status: shipped (parts 1–6 on disk — 1–5 v0.284.0, 6 Unreleased 2026-09-13; part 7 is IDEA-066's; part 8 deferred until the first BOSS project reaches V1)
gist: BOSS writes down what it is betting in four places and reads none of them back — the product practice has both ends of the loop and not the return path.
program: product-language
proof: stages/L1-mvp/template/.boss/loops/field-stale-loop.md
proof_note: >
  Nothing on disk yet — this record's product is the ladder, the ordering and the refusals. Each
  part names its own proof when it lands. Deliberately not stubbed: an empty JOURNEY.md or an empty
  NO-LIST.md renders as an answer when it is an absence.
created: 2026-09-10
relates: IDEA-066, IDEA-090, IDEA-049, IDEA-091, IDEA-089, IDEA-054
---

# IDEA-093 — the product language: the return path BOSS never built

> Seed: Ajesh, 2026-09-10 — *"lets explore product and how we do product / entrepreneur like we are
> doing for design: PRD… competitive eval as real intelligence gathering it can leverage during
> development… market research… measuring success… roadmapping (different from kanban)… tracking
> wins/losses… user stories, still worth it?… stakeholder management… persona seeds, how do we grow
> and keep refining and leverage them… edge cases… user journey. What else is crucial. Yes this is
> not coming from external but from me. What should be available at what time as the product scales,
> or the depth at which they do it scales."*
>
> The design twin is IDEA-091. This record owns the *product* ladder: what a product practice holds,
> which rungs BOSS built, which are built at the wrong rung, and which are a deliberate refusal.
> It supersedes nothing; it absorbs IDEA-066's inventory (the outward half) and keeps its gate.

## The one move

Design's move was *retrieval*: a design system is not a guide the founder reads, it is a substrate
the agent retrieves before it generates. **That argument transfers to product, and it is only half
the answer here** — because a design token has no outcome, and a product bet does.

**BOSS records a prediction in four separate places and reads none of them back:**

| Where | The prediction field | Read back by |
|---|---|---|
| `/canvas` | the riskiest assumption | `drift-loop` (is work aimed at it) — never *did it hold* |
| `/decide` → DEC | **the falsifier, with a by-when date** | **nothing** |
| `/spec` → FEAT | *Learning hypothesis* + *what result would change the plan* | **nothing** |
| `/roadmap` | confidence = the EVID grade behind the bet | **nothing — the file is deleted by design** |

So the one move is: **close the records BOSS already writes.** Not a win/loss tracker, not a
metrics surface — a return path on the four record classes that already carry a prediction and
already have a field waiting for the answer.

The retrieval half is the same argument design made, and the measurement is blunter here than it
was there:

```
docs/roadmap/     → read by 1 line in the entire repo: the skill that writes it
docs/competition/ → 2 readers, both advisory (a canvas pointer, mentor-capital). 0 at build time.
docs/personas/    → 0 readers in /spec, designer, coder, product-lead, /design-review
docs/measure/     → 2 readers (itself, /health)
```

Against the design layer *after* IDEA-091 shipped: `COMPONENTS.md` 5 readers + a hook, `PATTERNS.md`
7 readers + a loop, `FLOWS.md` 5 readers. **The product artifacts are where the design artifacts
were three days ago.**

## The ladder — what a product practice actually holds

| # | Layer | What it holds | BOSS today | Verdict |
|---|---|---|---|---|
| 0 | **The bet** | why this, for whom, what would prove it wrong | `/canvas` (4 frames), `/decide`, `/evidence`, `/idea` | ✅ **the strongest rung in BOSS** — and it never closes |
| 1 | **The field** | rivals, alternatives, doing-nothing, what moved | `/comp-eval` — living, sourced, honest | built, **inert**: no build-time reader, nothing says it went stale |
| 2 | **The user** | persona, jobs, pains, **journey**, **edge users**, segments | `/persona` + `harvest-loop`, `/interview`, `/research` | ✅ well designed, **read by nothing that builds**; journey + edge users absent |
| 3 | **The requirement** | the PRD: goal, criteria, flow, paths, assumptions | `/spec` — 339 lines, elicitation pass, three paths, flow | ✅ **best-in-class at its altitude** — but per-feature only, and it never names *who for* |
| 4 | **The sequence** | bets with a fixed appetite, the NO-list, what's next | `/roadmap` (Shape-Up, confidence = EVID grade), `boss board`, `planner` | ✅ well designed, **write-only** — and it deletes its own best half |
| 5 | **Success** | activation, retention, fit, the number that decides | `/measure`, `/health`, `/onboard`, `/trust`, `/money` | ✅ strong, correctly gated at n<10 |
| 6 | **The outcome** | we bet X → here is what happened | — | **absent, and the biggest hole on the ladder** |
| 7 | **The audience** | who needs to know what, and when | mentors (advisory), `/canvas --frame onepager` | absent as an artifact — **and mostly correctly so** |
| 8 | **Learning** | how the product language grows from what shipped | `harvest-loop`, `canvas-drift-loop`, `focus-loop`, `drift-loop`, `/extract` | ✅ **better built than design's was** — every loop watches for staleness, none watches for a closed bet |

**The one-line verdict: BOSS is strong at deciding and strong at measuring, and has no memory
between them.** Layers 0, 3, 5 and 8 are genuinely good. 1, 2 and 4 are built and inert. 6 is
missing. 7 is a refusal that was never written down.

## The rung answer — "what's available at what time"

The surface, counted:

| Rung | Skills | Agents | Loops |
|---|---|---|---|
| Quickstart | 17 | 4 | 5 |
| MVP | 28 | 7 | 14 |
| **V1** | **2** | **0** | **1** |
| **Scale** | **1** | **1** | **0** |

**The product ladder flattens exactly where product management becomes a discipline.** Segments,
packaging, the standing product doc, the stakeholder cadence, win/loss at deal volume — all of it is
V1+ work, and V1 ships `board` and `design-library`. This is the same flattening IDEA-089 measured
for documentation (inward 4 → 3 → **0** → **0**), found independently on a different axis. Two
measurements of one shape is worth more than either alone.

**That is not automatically a gap.** The thin top is partly deliberate: BOSS has no project at V1
and PRINCIPLE #2 refuses ceremony ahead of need. But the *reason* it is thin has never been written
down, which means nobody can tell discipline from neglect — and IDEA-089 reached the same sentence.

## The governing constraints — read before proposing a part

1. **No new verbs.** The standing mandate from EVID-001 is *compose and SUBTRACT*; the founder's own
   named fear is app bloat. Seven of the eight parts below are a field, a reader, a loop on an
   existing predicate, or a rung move. The one runtime addition is a **predicate**, not a verb.
2. **Filter → boundary.** If the only mechanism is "the skill text says to," it is a filter and the
   next session is free to forget. `/ux-check` already *suggests* pairing with a persona in prose
   and reads no persona file — that is the filter, in the wild, today.
3. **Close, don't count.** The fix for "we don't track wins and losses" is never a scoreboard. BOSS
   refuses composite scores (`/comp-eval`), refuses a tracked PMF number (`/health`), refuses a
   backlog you tend (`/roadmap`). A return path on records that already exist is in keeping; a
   win-rate dashboard is the thing all three of those refused.
4. **n=0, craft-driven, and said out loud.** Nobody asked for this by using BOSS. It does not
   outrank publish + Phase 3 outreach, and no part of it is evidence that BOSS works.

## The parts, in order

Ordered by *cost of deferring × cheapness*.

### Part 1 — the FEAT names its user · **shipped v0.284.0** · **and this is the answer to "are user stories still worth it?"**

**No, and BOSS should say so on the record.** `user story` has **zero occurrences** in the entire
shipped surface today — an accidental refusal, never a stated one.

The story form (*as a X I want Y so that Z*) exists to carry **who and why** into a ticket for a team
that wasn't in the conversation. BOSS's FEAT already carries Goal, Assumptions-with-corrections, what
*wrong* looks like, the Flow with a mandatory cut, three paths, and validated learning — strictly
richer. **Except for one thing: the FEAT never names the user.** There is no `for:` field, and
`/spec` contains the string `persona` zero times.

So: add the one payload the story form has and the FEAT lacks. **`for:` in the frontmatter, resolved
against `docs/personas/`**, plus the edge-user line in the Flow section. That single field closes the
user-story question *and* the persona retrieval gap, and it is the cheapest part on this list.

*One frontmatter field, one reader in `/spec`. No new anything.* **Rung: MVP.**

### Part 2 — the NO-list outlives the snapshot · **shipped v0.284.0**

`/roadmap`'s NO-list is mandatory and is called *"the load-bearing half of the roadmap."* The skill
then instructs: **"a snapshot, not a living plan — use it and discard; delete the old one."**

**So the most disciplined artifact BOSS produces is the one it deliberately deletes.** Three cycles
later the same declined feature is re-proposed by a founder with nothing to stop them, and the
reason it was declined — usually *low evidence grade* or *serves a vocal minority* — is gone.

Split the two halves by lifespan: **the bet-list stays disposable** (that is Shape-Up, and it is
right), and the NO-list becomes **append-only and dated**, each row carrying the reason and a
**re-open trigger**. That grammar already exists — every `deferred` record in this repo has one.
`/spec` reads it and says so, once, when a FEAT is on it.

*One file shape, one reader. No new verb.* **Rung: MVP.**

### Part 3 — the bet-list becomes readable at spec time · **shipped v0.284.0**

`docs/roadmap/` is referenced by **one line in the entire repo**, inside the skill that writes it.
A founder runs `/roadmap`, gets 2–4 bets with fixed appetites, and then `/spec` — the very next
step, which the roadmap skill itself points at — cannot see them.

`/spec` step 0 reads the current bet-list: is this FEAT one of the bets, and does the appetite match
what is about to be built? A FEAT that is neither a bet nor on the NO-list is not blocked — it is
*named once*, which is the whole mechanism.

*A reader in a skill that already has a step 0. No new verb.* **Rung: MVP.**

### Part 4 — the field goes stale out loud, and is readable when it matters · **shipped v0.284.0**

`/comp-eval` is well built: sources or silence, the spreadsheet and the agency and *doing nothing*
as rows, `why they might win` as a required honest line, add-don't-regenerate. Two defects, both
mechanical:

- **Nothing watches it.** The skill says rows past ~90 days "render with their age" — but rendering
  happens only when the founder re-runs the skill, which is exactly what a founder who has forgotten
  the file will not do. **`quiet_for` already exists as a predicate** (it was built for the commons
  half of the canvas, where silence was the signal). A `field-stale-loop` — `exists: docs/competition`
  guarded, `quiet_for` past the threshold — is pure composition on shipped machinery.
- **No build-time reader.** When a FEAT *is* the differentiator, the rival's weakness is the most
  relevant sentence in the repo and `/spec` cannot see it.

*One loop on an existing predicate, one conditional reader. No new verb.* **Rung: MVP.**

#### Part 4b — the field, read by what builds · **shipped v0.294.0, after a vet that cut half the plan**

Seeded by Ajesh on 2026-09-11: *not just price — what do we capture, what do we keep updating, do we
do a feature-by-feature matrix, does `/spec` see how the competition does it, how do we help when a
new rival with a twist gets added, how is it organised so it's reachable inside app building.*

The pre-research plan proposed a per-feature index (`FEATURES.md` emerging from FEATs), a `/spec`
reader for *how rivals do X*, and readers in `/design-review` and `designer`. **A `/deep-research`
pass with 3-vote verification cut all three** — SESSION-2026-09-11-competitive-intelligence-with-ai,
7 of 10 outside claims killed, and the useful output was what it did to BOSS's own plan:

- **A per-feature index is the parity trap however JIT it is.** `/spec`'s *what wrong looks like*
  is failure modes, not missing features; a table of how rivals implement things is a checklist of
  what to match, and a founder at n<10 cannot yet tell threshold features from differentiators.
- **Narrowed to failures.** Each rival's `<slug>.md` gains `## Where it breaks` — their users'
  complaints, dated and linked. `/spec` reads *that* into *what wrong looks like*. Never the feature
  list, never the praise.
- **New rival with a twist = a sort, not a gate.** `add <name>` labels the row *in evidence* (an
  EVID names them) or `watch` (nobody has — Dunford's phantom competitor). But when the twist lands
  on the differentiator, the would-you-switch question is offered **regardless** — a solo founder
  who finds an exact-match funded rival should reconsider now, not after a user says the name.
- **Readers that survived:** `/landing` (write *against the alternative*, never *at the rival*;
  the doing-nothing row is usually what the page competes with) and `/pretotype` (the switch test
  when the rival is in evidence). `/design-review` and `designer` did not; nothing supported them.
- **Kept, and now confirmed from outside:** 90 days (every argument to tighten it came from a
  vendor selling the tightening, measuring page diffs not price changes), per-cell `checked`
  dates, append-only rechecks, *doing nothing* as a row, sources-or-silence.

Readers of `docs/competition/` at build time went from **0** to `/spec` · `/landing` · `/pretotype`
plus the loop. No new file, no new verb, no matrix.

### Part 5 — the journey, authored once (the artifact a checker cannot produce) · **shipped v0.284.0**

`/ux-check` "walks the user journey." `designer` owns flows. `FLOWS.md` (v0.281.0) indexes
**per-FEAT** flows. **Nothing holds the journey across features** — from first hearing about the
thing to being a regular — which is the map `/landing`, `/onboard`, `/measure` and `/health` are all
standing on different parts of without sharing.

This is the same argument IDEA-091 Part 6 made about flows and it lands the same way: **no amount of
checking produces a journey nobody drew.** So it is authored, cheap, and owned by the skill that is
already deriving the shape of it — `/onboard`, which computes the aha-moment from retained-vs-churned
cohorts and currently writes that insight into a dated file nobody opens again.

Carries the **edge users** row, which is the honest home for the user's "edge cases" question: the
user with no data, the user with 10,000 rows, the user who is not the buyer, the hostile one, the
one using a screen reader. **BOSS's existing edge-case thinking is all code-path** (the three paths,
first-run, failure) and all of it is in `/spec`. The *user* edge case has no home.

*One authored artifact in a skill that already runs. No new verb.* **Rung: MVP.**

### Part 6 — the return path · **shipped 2026-09-13 (Unreleased) — and it cost no predicate**

Built as a `boss records` finding, not a loop: `revisit-due` fires when a record's `revisit_by:` has
passed and it carries no `outcome:`; `boss status` says *"DEC-NNN's falsifier date has passed — did
it fire? stamp `outcome:`"* once, and `outcome: held | fell | can't tell yet — why` silences it.
`/log`'s ship step reads the FEAT's *What result would change the plan* and *Still unknown* back and
stamps the same field (this is IDEA-094 part 5, designed with it as both records asked). 19 of BOSS's
own decisions carry a date; the first comes due **2026-09-20**. The "sixth predicate" below was the
price of doing it as a conscience moment; `records.js` already reads every record directory and
compares fields, so the honest home was there all along — the same *assumed the artifact needed a new
mechanism* shape IDEA-091's part 6 found. The canvas's riskiest assumption is not stamped: its
outcome is the evidence ladder, which `/evidence` already writes.

#### As originally written

The four prediction fields at the top of this record get an outcome.

- **DEC's falsifier has a by-when date and nothing on earth reads it.** `falsifier` appears in five
  files: the skill that writes it, `IDS.md` that defines it, and three that *tell you to write one*.
  Zero that check whether the date passed.
- **FEAT's *"what result would change the plan"*** is written at spec time, when the founder is
  most honest, and never opened at ship time, when the answer exists.
- **The canvas's riskiest assumption** is watched by `drift-loop` for whether work is *aimed* at it —
  never for whether it *held*.

The mechanism is an `outcome:` stamp on the record that made the prediction, asked **once**, at the
moment the answer exists: `/close` when a FEAT ships, `boss status` when a falsifier's date has
passed. **This is what "tracking wins and losses" should mean here** — not a win rate, which is the
scoreboard three separate BOSS skills already refuse, but *the bet you wrote down, and what actually
happened to it.*

🔴 **Named cost, and it is the one real one in this program:** a falsifier-due check needs a
predicate that can compare a date **inside** a file against today. The loop runtime has five
predicates (`exists`, `count_at_least`/`count_at_most`, `any_file_matches`, `outpaced_by`,
`quiet_for`) and **none of them can express it** — four are relations between files and `quiet_for`
reads mtimes. So this part costs a **sixth predicate**. That is a runtime addition, not a verb, and
it is the honest price of the biggest gap on the ladder. Everything else here is free.

**Depends on nothing. Everything else on this list gets better if it lands.** **Rung: MVP → V1.**

### Part 7 — the outward half **stays parked**, and this is the program's NO

Market research, market sizing, TAM/SAM/SOM, "why now." IDEA-066 inventoried this on 2026-08-20 and
parked it with a gate: *"Tier 1 is genuinely useful and still n=0 on demand… no founder has yet hit
the wall of being asked a question they can't answer."*

**That gate is still correct and this record does not re-open it.** A pre-PMF founder with n=0 doing
a TAM slide is doing investor cosplay, and BOSS's whole posture — `/health` defaulting to pre-PMF,
`/roadmap` refusing to weigh at n<10, `/measure` refusing to instrument — is built on saying so.
Adding a market-sizing worksheet at MVP would contradict three shipped skills at once.

**What this record adds to IDEA-066 is a sharper re-open trigger**: not "a founder asks," but *the
first time a founder is asked a question by someone else and cannot answer it* — a raise
conversation, a partner call, a pricing decision against a named rival. That is an event with a
date, and it arrives at **V1**, not MVP.

*Build nothing. Name the trigger and stop.* **Rung: V1, event-fired.**

### Part 8 — V1 is where product management starts, and BOSS ships two skills there · **held**

The honest list of what belongs above MVP, with nothing built now:

- **Segments.** `/persona` says *"one persona first"* — right at MVP, wrong forever. `/health` already
  says fit may be real *"with a specific segment"* and nothing holds segments.
- **The standing product doc.** Between the canvas (the bet) and the FEATs (the parts) there is
  nothing that says what the product *is*. That is what a joiner reads — IDEA-082's territory — and
  what IDEA-089 found missing on the outward side.
- **The stakeholder cadence — the narrow, real version of the user's question.** A stakeholder map
  for a solo founder is ceremony and BOSS should refuse it. **A recurring update to someone who
  gave you money or time is not** — and it is composable from records BOSS already writes (devlog +
  CHANGELOG + the EVID ledger + `/measure`'s numbers), which makes it a render, not a discipline.
  The internal half is already modeled: `mentor-cofounder`, `coordination-loop`, `/practice`'s
  shared PRAC records.
- **Win/loss in the sales sense** — why deals are won and lost — is a **different thing** from Part 6
  and needs real deals. Route: `/interview` pointed at the lost one, `/money` for the pattern.

**Held with a trigger, not deferred quietly:** the first BOSS project to reach V1. Today there are
none, and building V1 product surface for zero V1 projects is precisely the adjacency EVID-001 warns
about.

## Refusals — recorded so they are not re-proposed

1. **User stories.** Not adopted. Part 1 takes their one unique payload as a field. (See Part 1.)
2. **A win-rate / scoreboard.** Refused, consistent with `/comp-eval` (no composite scores),
   `/health` (no tracked PMF number) and `/roadmap` (no backlog you tend).
3. **A market-sizing worksheet at MVP.** Refused; IDEA-066's gate holds. (See Part 7.)
4. **A stakeholder map for a solo founder.** Refused as ceremony. The update *cadence* is the real
   artifact and it is V1.
5. **A persistent roadmap.** Still refused — Part 2 preserves the NO-list only, and deliberately
   leaves the bet-list disposable.
6. **A second PRD tier at MVP.** `/spec` is right at its altitude; the product-level doc is V1 (Part 8).

## The honest frame

This is **craft-driven, not evidence-driven** — the founder said so in the seed. It does not outrank
publish + Phase 3 outreach. Parts 1–4 are each an hour and close measured gaps; Part 6 is the one
with a real cost and the one that would change what BOSS *is* — an incubator that can tell you
whether your last decision was any good, which today it cannot.
