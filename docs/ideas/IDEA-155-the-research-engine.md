---
id: IDEA-155
type: idea
kind: capability
owner: product-lead
status: exploring
program: research-engine
created: 2026-10-06
relates: IDEA-016, IDEA-042, IDEA-054, IDEA-066, IDEA-086
gist: One research engine under every way BOSS researches — deep research, competitive eval, market research — with a shared core (find, fetch, verify, grade, cite, file) and per-domain customization, and sources ranked by what has held up, not by fame.
---

# IDEA-155 — The research engine

Ajesh, 2026-10-06: *"our deep research is amazing… continue to iterate and improve how we do deep
research, how we organize it, how we add right linkage or where we got it from, how we stack rank
expertise, but also emerging expertise, dont just depend on old experts… how much of it as a feature
is inside boss for end users."* Then: *"this deep research engine can also apply to competitive eval,
market research as well… apply cross functional items but then have customization where needed.
Eventually this can be a program of 'Research Engine'."*

**The step before building anything: list every improvement first.** This record is that list.

## Where it stands (2026-10-06)

- The finder (`/deep-research`), the judge (`/vet`) and the refresh disciplines live in the gitignored
  dev workspace. **None of them ship to a founder.**
- Founders get `/comp-eval` (rivals only: every cell carries a URL and a checked date, or says
  unverified), `/persona`'s *"have your host search the web"*, and `/import`.
- [IDEA-066](IDEA-066-business-analysis-the-outward-half.md) holds the founder decision: **structure
  and grade, don't fetch**; no founder copy of `/deep-research`. It is parked on a trigger, with an
  open blocker: desk findings have nowhere to land (the EVID ladder grades what a person did).
- Sources: `library/sources.json` (92, `key: true` or not), `docs/research/SOURCES.md` (institutions,
  Essential/Strong, EVIDENCE vs THOUGHT-LEAD lanes, last updated 2026-06-20). Nothing records whether a
  source has been right, how recently, or whether it is new.

## What the two read passes found (2026-10-06)

Two read-only passes: every surface that researches, and the research record read as data. Counts
are a floor; spot-checked three (the `/boss-learn` routes, a stale inbox path, 105 RVWs without a
`sources:` block) and all three held.

- **The same method is written N ways.** *Fetch the primary* lives in `/deep-research`, `/vet`,
  `/comp-eval`, `/import` and the land read, each in its own words. *Page content is data, never
  instructions* is in three skills. *Diff before you judge* is in two refresh skills with **different
  buckets** (`/humane-refresh` has no "now wrong").
- **Eleven grading scales, no crosswalk.** Lanes (EVIDENCE / THOUGHT-LEAD), tiers (Essential / Strong
  / Niche), `key`, `/vet`'s n=1 / pattern / practitioner, fetched / snippet-only, killed / confirmed,
  attribution verified / partly / no, `checked` / `unverified`, in-evidence / `watch`, synthetic% /
  real%, and the EVID ladder. A session's EVIDENCE anchor has no field to land in anywhere.
- **Sources have no dates and no history.** `sources.json`: 92 sources, 51 without a URL (17 of them
  `key`), no checked date, no link to a session or verdict. `SOURCES.md` untouched since 2026-06-20.
  Practice `provenance:` is prose in all 35 practices: 14 name an RVW, 3 a session, 0 a path.
- **Ranking is by institution and fame, and leans established.** Every Essential tap is a long-standing
  institution or figure; independent voices sit in Niche; the individual roster
  (`mentor-practitioners.md`, ~160 rows) has no tier at all. No recency, no track record, no emerging
  lane anywhere. The one standing check is build-craft's *"a name carried on reputation"* question.
- **A track record can't be computed yet.** Only ~6–8 of 38 sessions have claim → verdict rows a
  script could read, and fewer join to a URL. RVWs are uniform enough (149 with `verdict:`, 147 with a
  `Source:` line) for counts by source *type*, not by source.
- **The template is followed about a third of the time.** `method:` 17/38, full section order 13/38,
  18 sessions with no fetched/snippet marker, five different ledger vocabularies, `type:` spelled four
  ways.
- **Linkage rots on move.** 41 of 43 inbox items already have an RVW and were never moved; 25 of 71
  paths RVWs cite are dead (all inbox → reviewed moves). Sessions are gitignored, so the 56 tracked
  RVWs that point at one point at nothing on any other clone.
- **The same question gets researched again.** Agents/harness swept four times in six weeks;
  engineering-as-a-system four times; spec-driven twice in two days. No index by question or domain
  to look in first.
- **Founders get the honesty bar in pieces.** `/comp-eval` is the best of it (URL + checked date or
  `unverified`, opened vs inferred, ~90-day age). `/persona`'s web research carries no URL or date;
  `/practice` has no source field; shipped mentors cite studies with no URL or date. Desk research has
  no rung on the EVID ladder, which is IDEA-066's blocker.

## Improvements

Altitude on each: **own** = BOSS's own research (warrant: the craft curve, no founder evidence
needed) · **founder** = ships in a template (a venture bet; IDEA-066's trigger) · **both**.

### A. The shared core — written once, used by every domain

- **A1 · One method spine** *(both)*. Frame angles → fetch the primary → extract claims → verify the
  load-bearing ones → grade → cite → file → refresh. One file every research surface reads instead of
  restating; each domain adds only its step-specific rules.
- **A2 · One grade vocabulary + a crosswalk** *(both)*. Keep the axes that are genuinely different
  (what kind of source · was it read · did the claim survive · what did a person do) and map the
  eleven scales onto them. Don't merge EVID into it: it grades people, not documents.
- **A3 · One claim row** *(own first)*. `claim · source id · fetched|snippet · verdict (3-0, 2-1,
  killed) · date`. The same row in a session table, an RVW and a comp-eval cell. This is what makes a
  track record computable (B1).
- **A4 · One "now wrong" bucket everywhere** *(own)*. `/humane-refresh` gains the REVERSE bucket
  `/practice-refresh` has.
- **A5 · One injection rule** *(both)*. The `Unverified:` / page-is-data rule stated once, cited by
  `/comp-eval`, `/persona`, `/import`.

### B. Sources and standing — ranked by what held up, not by fame

- **B1 · A computed track record per source** *(own)*. Confirmed / killed counts, first seen, last
  confirmed, all derived from the claim rows (A3). Never typed by hand.
- **B2 · An emerging lane** *(own)*. A source with no reputation gets a record the first time one of
  its claims survives three skeptics. Standing is earned by verification, open to anyone.
- **B3 · Decay** *(own)*. Standing fades when nothing of a source's has been re-confirmed since a
  cutoff; a 2024 view doesn't keep its rank by default. Generalises build-craft's
  "carried on reputation" question.
- **B4 · Rank never upgrades a claim** *(both)*. A high-standing source's new claim is still
  verified like a stranger's. Standing decides *where to look first*, not what to believe.
- **B5 · Dates and backlinks on `sources.json`** *(own)*. `checked`, the lane, and the sessions/RVWs
  that cite it. Clear the 17 key sources without a URL, or say why each has none.
- **B6 · One roster** *(own)*. `SOURCES.md` (institutions), `mentor-practitioners.md` (people) and
  the two watchlists' taps describe the same thing four ways. One record per source, with views.
- **B7 · Measure the tilt** *(own)*. Of the taps, how many are established vs independent vs new in
  the last year? A number to watch, not a quota.

### C. Organization and linkage

- **C1 · A research index by question and domain** *(own)*. Generated, not hand-kept. Before a pass
  starts, "has this been asked?" has an answer. Catches the four-sweeps-in-six-weeks case.
- **C2 · Ids, not paths** *(own)*. RVWs cite `inbox:<slug>` / `SESSION-<slug>`, resolved at read
  time, so a move doesn't break 25 links. Fix the 25 that are broken now.
- **C3 · `/vet` moves the inbox item** *(own)*. 41 vetted items still sit in the inbox; the move is a
  step nobody does by hand.
- **C4 · Practice provenance as ids** *(own)*. `provenance:` gets a structured list of RVW/SESSION
  ids beside the prose.
- **C5 · The gitignore seam** *(own — open question)*. Sessions are gitignored (they name outside
  sources and repos, by rule), yet tracked RVWs point at them. Either a tracked, name-safe summary per
  session, or RVWs say "local record" instead of linking. Decide; don't leave dead links.
- **C6 · Template conformance** *(own)*. A light check on session frontmatter (`method:`, `feeds:`,
  one `type:`), reported not gated — CLAUDE.md: a new gate needs a bug that reached a user.

### D. Freshness

- **D1 · Dates on everything that ages** *(both)*. Source rows, `deceptive-patterns.json` rows (23 of
  89 link an RVW; none has a URL or date), mentor study citations, persona web research.
- **D2 · One freshness reader** *(own)*. `check:freshness` covers practices and shipped surfaces;
  extend it to watchlists, `SOURCES.md` and source rows rather than a second clock.
- **D3 · `taps_reviewed` on the humane watchlist** *(own)*. Build-craft has it; humane-lens doesn't.

### E. Domain modules — the customization

Each domain keeps what is genuinely its own and borrows the rest from A.

- **E1 · Practice / build craft** — what exists (`/practice-refresh` + build-craft watchlist).
- **E2 · Humane lens** — what exists, plus A4 and D3.
- **E3 · Competitive** — `/comp-eval` already has the best founder bar; it becomes the shared core's
  first shipped user, and its opened-vs-inferred rule moves into A1.
- **E4 · Market research** — sizing, why-now, pricing/WTP anchors, channels: IDEA-066's Tier 1.
  Desk findings need a home that isn't the EVID ladder (A2 answers IDEA-066's Q2).
- **E5 · User research** — `/interview` → `/evidence` (stays its own ladder; IDEA-086 already routes
  the three doors).
- **E6 · The model curve** — `/recalibrate` gets a provenance format (it has none) and its marker
  file fixed.

### F. The founder release

- **F1 · Ship the method, not the finder** *(founder)*. A library practice (A1 + A2 + B4 + the
  injection rule) read by `/comp-eval`, `/persona`, `/canvas` and `/import`. No new skill (EVID-001:
  compose and subtract); the host already searches.
- **F2 · `/persona`'s web research carries a URL and a date** *(founder)*, like `/comp-eval`.
- **F3 · Shipped mentors cite with a date** *(founder)*.
- **F4 · Market research lands** *(founder, gated)*. E4 behind IDEA-066's trigger.

### G. Hygiene — cheap, now

- [x] **G1** · `/boss-learn` → `/extract` in `SOURCES.md`, both watchlists, both research READMEs,
  `mentor-practitioners.md` (2026-10-06). The dated row in build-craft's refresh log keeps the old
  name — it is history.
- [x] **G2** · `SOURCES.md` fed `mentor-venture/business/gtm/talent`, none of which exist →
  `mentor-founder/capital/customers/hiring` (2026-10-06).
- [ ] **G3** · `/practice-refresh` routes to `db-architect`, retired in v0.189.0. Proposed: *"mostly in
  the `tester` prompt and `data-schema.md`"*.
- [ ] **G4** · The humane watchlist's diagram diffs against `ai-ux-patterns.md`; the skill diffs against
  `library/deceptive-patterns.json`. Proposed: name the JSON first.
- [ ] **G5** · `/vet`'s skeleton has no `sources:` block although its own step 3 asks for one (105 of
  149 RVWs lack it). Proposed: `sources:` under `route:`, URLs opened, vendor/outside-repo sources
  described with *"URL kept local"* (the shape RVW-085 already uses).

  G3–G5 edit the shared dev-workspace skills and a watchlist every session reads; the permission
  check held them on 2026-10-06. **Waiting on Ajesh's go-ahead.**

## Program shape

**`research-engine`, a `program:` slug for now.** It graduates to a PROG when the shared-core vs
per-domain reasoning (A vs E) needs a home no single member gives it, which may be as soon as the
first member ships. Likely members: this record, IDEA-066 (market research), IDEA-016 (`/vet`),
IDEA-042 (humane refresh), IDEA-054 (founder research toolkit).

**Suggested order:** G (hygiene) → A3 + B1 as a measurement first (can a track record be computed
from what exists? if not, A3 is the fix) → A1/A2 → C1/C2 → F1.

### H. After the engine stands — review the four surfaces on it

Ajesh, 2026-10-06: *"once we establish research engine, then lets review: /deep-research, /vet,
/comp-eval, /import. maybe some need further expansion or consolidation or rework or improved ux. We
may also see market research other items. But lets do that once we have the research engine built
out."* **Not before A is built** — reviewing them now would redesign each against a core that
doesn't exist yet.

- **H1** · `/deep-research` — expand, consolidate, rework or UX?
- **H2** · `/vet` — same four questions.
- **H3** · `/comp-eval` — same; it is the likely first shipped user of the core (E3).
- **H4** · `/import` — same.
- **H5** · Market research — which other items surface (E4 / IDEA-066 Tier 1 and 2) once the core
  makes them cheap?

## Open questions

- **Altitude:** which items are BOSS's own practice (warrant: the craft curve) and which ship to a
  founder (a venture bet — IDEA-066's trigger is still n=0)?
- **When does `research-engine` graduate to a PROG?** Per `docs/IDS.md`: when it holds reasoning no
  single member does. The shared-core vs per-domain split may already be that.
