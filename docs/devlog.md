---
id: DEVLOG
type: devlog
owner: pm
status: active
---

# Devlog — BOSS

Append-only. Newest at the top. Each entry: date, FEAT (if any), what landed, what's next.

> **Why this file exists, starting 2026-08-20.** BOSS ships `/log` and tells founders a devlog is
> "the thing future-you reads before starting work" — and kept none itself for 190 releases. That
> wasn't only a dogfood gap: **three of BOSS's own loops assert on `docs/devlog.md`**, so
> `drift-loop`, `extraction-loop` and `coordination-loop` were structurally unopenable on the
> project building BOSS. `check:refs` had been reporting them as dead predicates the whole time,
> which is why `npm test` sat permanently red — and a gate that is always red is one everybody
> learns to ignore. RESUME is a *briefing* (current state, rewritten each time) and CHANGELOG is a
> *release record*; neither is the append-only "what happened, session by session" the loops read.
> This is that third thing.
>
> Expect the conscience to start firing on BOSS once three entries accumulate. That is the
> mechanism working, not a bug.

## 2026-09-14
- **FEAT:** _no FEAT — IDEA-118, the seams after the overhaul_
- **Landed:** Walked the founder path end to end after 202 commits (site → `boss new` → `/welcome`, `/boss` as written → the readers on day 0 / day 1 / after unlock / a FEAT building / shipped). The surfaces told one story; the seams didn't — twelve fixed, all one family, *a rule kept in one reader and not its sibling*: day 0 collapses to one sentence in playbook and design as the board already did; the venture holes point at `/boss` until the record exists (they pointed at `/idea`, which asks nothing); the verb gate reaches recap, the re-entry line, the board footer and status's *Ready to build* arrow; *Who is building it* asked once; the cohort question in the site's phrases with `cohort: skipped` remembered; `src/clock.js` — every day-stamp local, not UTC; a cleared unlock bar says *Unlocking.*; recap's *The bet* reads the founder's `IDEA-NNN-canvas.md`; after the first ship, status stops asking for an idea and `boss map` shows the earned seven as *earned — `boss sync` lays them down* instead of dropping them; *Ready for V1* names the unknowns as yours, no tally. Plus the small copy (`code .`, *This unlock adds*, *stack and mode*, Start's three questions and MVP verbs said as MVP). BOSS's own install synced (29 files, 13 retired loop copies removed, the 7 BOSS-tuned agents kept); `relationship.md` flipped to `exercised`.
- **Next:** stamp · the site redeploy (Ajesh's). Pushed 2026-09-14 (66 commits, `b4adcfb..e6a38bc`). Then `npm run check` went green: 50 EVID citations unbracketed, `tokens.json` on the shared-names list, and 21 backlog findings the red chain had hidden closed. Later the same evening the adopted-repo door was walked too (IDEA-118 M–P): adopt kept none of new/unlock's holds — all 28 MVP skills and all ten opt-in hooks landed; now the same holds, with a live repo counting as `shippedBefore`.
- **Surprises / decisions:** Late: the remaining RESUME items — IDEA-114 slice 2 (the venture above the columns; capabilities never offered `/canvas`; the *pick* group), the watchlist's domain 15, RVW-104 (Cagan read at source — the fetch summary's quotes were paraphrases; ADAPT, one line), RVW-103 (the persona sources, ADAPT, 09-13) also retired from RESUME's list here; Cagan's reversals #1 and #5 are worth their own `/vet`; and the first `/drift-deep` on this tree: **drifting** — the experiment is written to the message and unsent since 08-23. Two rulings, both against my top findings. *"I disagree that they have to talk to 1 person before the canvas, talking can come whenever"* — so the arc is now *capture → pressure-test · talk to one person (either order) → unlock*, a `coreLoop` step may be an unordered pair, and the router/site/`/welcome` stopped sequencing it. *"Site has nothing to do with app"* — the footer's *no analytics* is the CLI's claim; the site's GA4 is a separate fact; dropped. Also: I wrote a *1 of 3* on the readiness line and reverted it — `readiness.js` refuses a tally on purpose and a test pins it; the authored rule was right.

## 2026-09-13
- **FEAT:** _no FEAT — the second tier under `## Unreleased`_ (moved here from RESUME's *Now* on 2026-09-14, past the window)
- **Landed:** once-per-session conscience · `boss hooks enable|disable` (nothing lands until asked) · `modes:` label · manifest summaries one sentence · checker hygiene + `parseEntries` in gen-site · MENTORS.md current. BOSS's own hooks re-synced.
- **Next:** stamp (Ajesh's).
- **Surprises / decisions:** —

## 2026-09-13
- **FEAT:** _no FEAT — the board, from Ajesh's read of it_
- **Landed:** Every card carries a labelled `added <date>` (`created:` wins, git's add-date fills, prose after the day ignored) and Shipped cards add `shipped <date>`; `boss board <id>` gains `added`, `--json` gains `addedOn`/`shippedOn`/`criteria`. A Building FEAT's acceptance-criteria bar renders at `0/N` (all segments off) instead of hiding; a Building FEAT with no `## Acceptance criteria` section renders **no acceptance criteria** in caution — a hole in the spec, not a bar. Ideas still show no bar. `3747bc9`, under Unreleased; board tests 38 (+2).
- **Next:** FEAT-030 (11/11) and FEAT-031 (6/6) sit full-bar in Building — the design lane's call to flip them `shipped`. `site/demo/board.html` picks the dates up on the next `gen:site` (peer's lane). IDEA-114 slice 2 (the venture card above the columns) is the next board question.
- **Surprises / decisions:** Ajesh: *"none of those feat had acceptance criteria. eek"* — they all did, ticked full (026 11/11, 027 9/9, 028 8/8, 029 4/4); the bar is only drawn in Building, so shipped cards looked criteria-less. **AC on the card, not todos** — criteria are the promise fixed at spec time and a todo list's denominator moves every session, so its fraction can fall while you work; found tasks go in the FEAT record (CLAUDE.md 3b). Process: I ran `git stash` in the shared tree to diff the gate against HEAD — it popped clean, but it is the same shape as checking out a branch under every peer; the entry below hit the sweep the same day. Compare by `git diff <file>`, never stash here.

## 2026-09-13
- **FEAT:** _no FEAT — IDEA-114 slice 1_
- **Landed:** An IDEA is one of two kinds and the record says which: `kind: venture` (`/boss` writes it, one per project, alone carries `motivation`/`success_looks_like`/`in_a_few_years`/`prior_capital` + Canvas) or `kind: capability` (`/idea`, many, none of those). `/canvas` no-arg, `src/playbook.js readIdea()` and `readIntentContext()` rank the venture first; fallback for pre-field projects is the record carrying `motivation:` at all; no `kind:` = capability. IDS.md § Two kinds; CLAUDE.md rule 3 says every IDEA in this repo is a capability and BOSS's venture is the canvas. Tests +2. Under `## Unreleased`.
- **Next:** IDEA-114 open questions — the board shows the venture as a card among capabilities (sit it above the columns?); two venture records on day 0 → `/canvas` asks which; measure before gating the venture fields on a capability.
- **Surprises / decisions:** Ajesh asked *"what is an idea in boss? I think its getting interchanged"* — the definition in IDS.md had the conflation in one slash, and BOSS's own tree was the proof nobody meant the venture fields on a capability (0 of 113 set `prior_capital`). Playbook picked the NEWEST idea as the venture — a founder's third feature capture would have been rendered as the company. Field, not prefix. Process: `git stash -u` in the shared tree swept a peer's uncommitted `demo/kettlewick` work for ten seconds and left their staged file in my index, which the commit then took — amended it back out. Stash nothing here; compare by `git diff <file>`.

## 2026-09-13
- **FEAT:** _no FEAT — the close_
- **Landed:** Ajesh's read of the demo, answered: five ideas whose status words were off-vocabulary (superseded, promoted) now say shipped and the board shows IDEA-065 where it belongs (ba38d62); BOSS's own playbook and board are set in BOSS's look via a local docs/design/tokens.json copied from the site's tokens — mono display, 3px cuts, hi-vis ink; the shell's default palette for a founder with no tokens is chosen, not inherited — warm stone, blue-cast ink, teal accent with a dark twin, DEFAULT_ACCENT exported (e6b4cdf); the deck's browser store keyed by project. 15 commits on this lane today, all under Unreleased.
- **Next:** Ajesh: publish when ready (npm run stamp → npm publish; ~13 commits ahead of origin); his hand-checks on the playbook (Present → VC cut, Export PDF in the sandbox, a Keynote paste, /import on a real deck). The design lane's prose sweep to copper. The standing red: check:refs (EVID dangles, RESUME Next #9).
- **Surprises / decisions:** Two off-vocabulary status words looked terminal to a reader and were invisible to the board — the accomplice pattern again, in the records this time. Every .boss/ page shares the file:// origin, so a browser store keyed by nothing leaks between projects.

## 2026-09-13
- **FEAT:** FEAT-039 (second pass)
- **Landed:** Ajesh's four notes on the demo, built: the board joined the dashboard — boss board --html renders through page-shell (fd96771); Organization replaced Folders (grouped by what the founder is doing, verbs as accent chips, the four rules, the modes strip from the manifests, counts from the tree); Learning replaced Inside (the venture's trail from its records); the demo board got six ideas and six FEATs across three months. Then: playbook + board set in the venture's tokens.json (light only), Kettlewick recoloured sage/green-black/copper with contrast checked (872e5c8); the cut is a filter and Everything → All; the conscience runs for real on the demo at build time and its two open signals sit on Learning as schema (a4187cc). Suite 544 pass + 3.
- **Next:** Ajesh's browser read of site/demo; his playbook hand-checks; the design lane's prose sweep to copper.
- **Surprises / decisions:** Running the real hook on the demo caught a demo bug the render didn't: the canvas lacked the incubation heartbeat, so canvas-loop read as open — the conscience is a checker for the demo too. The loop files' opening prose is BOSS's own history, not founder-facing; the frame's first sentence is the plain statement of the moment. A nested backtick inside playbookJs's template broke the whole page once — string concatenation inside the JS-in-a-template from here on.

## 2026-09-13
- **FEAT:** FEAT-039
- **Landed:** The Kettlewick showcase (6fe5942): Ajesh's go on IDEA-110 with four additions — rename (Tidewell is a real product; Kettlewick has no product, only a dormant handle), fully filled on every page, a folders page, the shipped files as examples, and a standing update rule. demo/kettlewick/ is a tracked fictional record set in the shipped shapes (39 files, my half: idea + 13-cell canvas, 2 personas incl. a 100% proto, 3 rivals, 4 EVIDs, 3 DECs, devlog, sources, dossier, BRAND with How we build + mark, team incl. a role: missing file, health, measure, trust, 4 FEATs). scripts/gen-demo.js copies it to a temp dir and runs playbookHtml/designHtml/boardHtml (no boss new, no registry) → site/demo/ with a folders page read from the rendered tree and an inside page read from stages/. web/demo.html + Demo nav. check:demo (in npm run check, before the pre-existing red) fails on any open question or missing folder — the discipline Ajesh asked for. Two renderer changes: role: missing fills Who is missing; Vision lists the team. Zero open questions on the demo playbook. Suite 541 pass + 3.
- **Next:** Design lane commits docs/design/** for the demo + regenerates site/demo + extends check:demo's folder list. Ajesh reads site/demo in a browser. Deferred: the conscience firing on the demo (a real hook run, never a manufactured log).
- **Surprises / decisions:** The demo was the checker again: two holes no founder project would have shown yet (Who is missing, Who is building it) turned into records. A README that IS the record (the competition table) has no first sentence — the folders page falls back to the verb map. The peer began writing into demo/ while I was committing; git add demo + git reset their folders kept the lanes clean.

## 2026-09-13
- **FEAT:** FEAT-029
- **Landed:** The deck (2d7563e): a Present bar with three cuts read off the rendered page as block-id lists — VC (the pitch arc; a 100% synthetic persona stays on the page and off the cut), Internal (filled blocks; chapter-rendered cells leave the grid), Everything — Remove from this cut / restore (localStorage, one key per cut; never a record), Export PDF through a print-only container (landscape, one slide per page). The playbook's four slices are done: 16 chapters, three canvas frames, the pull, the doors. 36 playbook tests; suite 535 pass + 3 pre-existing; gate at 50.
- **Next:** IDEA-110 the showcase on oyeboss (trigger fired). Ajesh's hand-checks: Present → VC cut on a real project; Export PDF in the sandbox; a removed slide after a re-render; the copy sheet; Keynote paste; /import on a real deck.
- **Surprises / decisions:** Cuts read off the rendered HTML rather than recomputed from data — the list can never name a block the page lacks. The removed strip showed while empty: the artifact host's reset has [hidden]{display:none}, a file in .boss/ has nothing — the page now carries its own.

## 2026-09-13
- **FEAT:** FEAT-035 · FEAT-036 · RVW-103 (+ the four asks, the BMC frame)
- **Landed:** Ajesh: 'do the deck last, everything else first' — done. Sorted the 27-row kicked-up table (6a16e76). FEAT-035 the intake doors (61a7c2c): /import takes pasted text, dates its snapshot (docs/source/YYYY-MM-DD-<file>), assesses what else a source fills (≤5 lines, yes/no, owning shapes; a document's number is a claim never an EVID; a transcript routes to /evidence); /close 3d notices what the founder said that no record holds. FEAT-036 the Company chapters (3bfde2b): Team from docs/team/<slug>.md (README ships; boss team add writes the stub; photos inlined as data URIs, never a stand-in; placeholders never render), Brand as the doc holds it (learned rows counted, never quoted), Values from a new '## How we build' section on the brand-doc template; 16 chapters. RVW-103 (8da18b0): persona vetted at source — NN/g verified (Taylor Dykes 2025-10-03), two vendor blogs read as such; ADAPT: photo: (a real file) and quote: (only from an EVID via enrich); demographics/sliders/tiles rejected. Ajesh's rulings on the four asks (1daf260): in_a_few_years: (his phrasing) and prior_capital: on the IDEA doc via /boss 3.5 and /canvas, runway as a Cost Structure sharpen, AI-era defensibility + compliance stance on Risks & Harms; unit economics beyond price/cost refused. The BMC frame + the ask read from business-<date>.md (ed46b24) — the file the shipped mentor actually writes (the render read mentor-capital.md: a reader/writer mismatch, n=33 of the checkers pattern). Suite 529 pass + 3 pre-existing; gate at 50.
- **Next:** /spec FEAT-029 — the deck (profiles as block-id lists, remove/restore in the browser, Export PDF via the print sheet); then IDEA-110. Ajesh's hand-checks: boss playbook --open on a real project, the copy sheet, a Keynote paste, /import on a real deck.
- **Surprises / decisions:** Two shared-file sweeps in one day (INDEX by the peer, cli.js by me) — staging by synthetic blob is the fix and is now in feature-context. A stub's <placeholders> rendered as a person's words until a test caught it. The always-on cap (420 B) caught a 472 B description; the record-id gate caught an EVID-007 example in a shipped skill. Ajesh reframed 'five years' as 'a few years' — the far horizon is his word, not Sequoia's.

## 2026-09-13 — the design lane
- **FEAT:** FEAT-030 → FEAT-031 · FEAT-032 · FEAT-033 (all shipped), then IDEA-107's kicks-up rows and the moments
- **Landed:** `boss design` is complete — seventeen sections read from the files (c2c63ea · 33305a4 · c1516fe · e8da647), every value copies with the sheet showing the payload, Code and an SVG spec frame on every component card, icons and the logo from files or not at all, contrast computed once, *not checked* said once. The shipped templates caught up (c0b76fb): Statement/Grounded in, a Logo section, Layout's six sub-slots and the three families it earns, a Principle column on Ours only, research on a design object by name via `about:`. Then Ajesh's question — *some of this has no way of being populated as the app is built* — measured true for seven slots and answered by moments, not forms (bbc8989): `/design-review` reads layout, icons, the five-state row, do/don't and grounding back from the first screen that decides them; `/ux-check` fills the tone table from shipped strings; `boss design --questions` lists every open slot with its verb and the moment that earns it.
- **Next:** Ajesh's hand checks (a real project; the sprite and a spec frame into a design tool; a block into Keynote; a word against any assumption in 030–033). Gated by design: the `design:` link in the template (IDEA-108 — a designer with a file), the data-viz palette question (107 gap row 3).
- **Surprises / decisions:** Two of my own hole verbs named a moment nothing ran at — the checkers-state-intents shape, in a file I'd written the same day; the fix was the moment (4a widened), not the verb. `boss id FEAT` reserves a number the moment a plan names it. The persona parser took `- who does the rota…` as a `who` label until a label was required to carry a separator. A comment with backticks inside a `String.raw` template broke every render for ten minutes — the peer caught it. Shared-file sweeps went both ways in one afternoon (INDEX row, a cli.js hunk); `git diff <file>` before `git add` is now the rule on both sides.

## 2026-09-13
- **FEAT:** FEAT-028 (+ the pull, IDEA-111)
- **Landed:** Three commits under Unreleased: 590748f the pull — boss playbook prints the open questions (--questions lists them; verbLine shared with the design space, gated verbs say so and rivals/brand holes point at /import; rail+ledger say 'N open · start: /canvas'); 6736162 FEAT-028 commit 1 — the playbook renders through the peer's src/page-shell.js (family bar, copy sheet replaces the toast, frame toggle into the canvas chapter, Slide kept); edf52cc FEAT-028 slice 3 — the Proof chapters: Evidence as ladder rows (never a body, never source:, tested), Learnings from devlog lines, Decisions with falsifier/overdue/superseded, Risks & harms + trust page, Health dormant until HEALTH/MEASURE files. 13 chapters; 28 playbook tests; suite 515 pass + the 3 pre-existing EVID-citation failures. IDEA-111 captured (intake: three doors, no wizard; The folder section). IDEA-106 gained Q7 (page file name/place).
- **Next:** Ajesh: assumption answers for 026/027/028, hand-check on a real project, the two calls (docs/source vs inbox; file name/place). Then /spec FEAT-029 (the deck: cuts as block-id lists, remove/restore, Export PDF via the shell's print sheet); IDEA-111's doors under a fresh boss id; IDEA-110 after 029.
- **Surprises / decisions:** Two shared-file costs in one afternoon: the peer's commit swept my INDEX row (harmless), and their in-progress page-shell edit — made at my request — broke every render for a few minutes (backticks inside a String.raw comment). Staging by synthetic blob (git hash-object + update-index) is the clean way to commit one line of a shared file. The old scratchpad screenshot fooled me once: $TMPDIR is not the scratchpad. A dormant cell rendered as a hole in the chapters until the terminal list made the mismatch visible — the pull is also a checker.

## 2026-09-13
- **FEAT:** FEAT-026
- **Landed:** IDEA-106 captured → absorbed 065 + 104 → six prototype rounds (https://claude.ai/code/artifact/e3f72fdf-dc50-4ebe-9f78-0d0f66684c35, a fictional venture 'Tidewell', 18 chapters, 16 drawn, deck with VC cut / internal / everything, Export PDF, three single-hue charts, How we build, personas as the classic card) → /spec → FEAT-026 → slice 1 SHIPPED under Unreleased (55502e9): `boss playbook` renders the canvas as boxes into .boss/playbook.html — holes as holes, Humane ⇄ Lean with the DEC-004 floor band, chip per cell + ledger counted from the files, Link · Copy · Slide, brand per-field with a monochrome default in board.html's greys. 14 tests; suite 476 pass (3 pre-existing EVID-citation failures). mentor-fundraising + mentor-pitch reviewed the prototype; Ajesh ruled: the playbook is for the founder and team first, the VC deck is a CUT (Priya the proto-persona stays; the cut omits her). Research graded: Sequoia + DocSend readable; Carta/YC/Kawasaki bot-blocked, vendor claims filed unverified. Persona sources inboxed for /vet (gitignored). Peers live all day — one added a Design sibling artifact and a family nav; lane claimed by message, committed by name only.
- **Next:** Ajesh rejects any of FEAT-026's seven assumptions in a word; his hand-check (boss playbook --open in a real project, Lean toggle, copy a box into Keynote/Slides). Then: spec FEAT-027 (pitch chapters), 028 (proof), 029 (the deck + VC cut). /vet the persona sources. The 27-row Kicked-up table in IDEA-106 = the intake spec for what BOSS should ask a founder and doesn't (person record + photos, vision line, prior capital, compliance stance, AI-defensibility, screenshot at ship, dated /import). IDEA-110: the full showcase on oyeboss.
- **Surprises / decisions:** The prototype kept finding fields the records don't hold — 27 rows by the end; the render is a better intake audit than any checker. 'Hopping' was a CSS class collision (.slide button vs overlay), not focus. A live artifact republish swaps the DOM without re-running scripts. Every categorical palette from the brand's greys failed the dataviz validator — one hue, no pies. The design-tokens conscience was right: two generated pages, two hand-inlined palettes. /spec and /close both name .claude/rules/feature-context.md and BOSS's own tree never had it. YC's guide is a JS app with no readable body.

## 2026-09-13 (positioning — from "acquired" to "an incubator hires me and I bring the tool")
- **FEAT:** _no FEAT — a conversation, captured as IDEA-109_
- **Landed:** Ajesh opened with *"i could see boss potentially being acquired, so maybe worth dropping the
  open source part… but i do plan to keep boss free"* and, over three turns, arrived at *"an incubator would
  wanna hire me… their coach, but also leverage this kind of tool to help their cohorts."* Checked the tree
  before answering: MIT in `LICENSE`, `package.json`, every site footer, `charter.html`; 0 stars / 0 forks;
  1,784 npm downloads a month with 13 self-publishes in the window; 196/196 commits his; riskiest assumption
  n=0 on a 2026-11-21 clock. Verdict on the copy edit: **no** — the words would say less than the LICENSE
  grants on a public repo, the mechanism-vs-claim shape BOSS catches in itself. IDEA-109 captured with the
  acqui-hire read (demo on *their* founder's repo · the paper trail as résumé · MIT as an asset · n=1 is
  enough) and one next step. Peer session bossbuild-64 claimed the FEAT-026 lane (`src/playbook.js`, cli,
  CHANGELOG); this session touched only `docs/`.
- **Next:** `/interview` — one founder in a target incubator's orbit, or its program director. The README
  *"never the CLI itself"* line is the real licence decision, on Ajesh's list. Above all, unchanged: publish
  and Phase 3 outreach — his.
- **Surprises / decisions:** *Free to use* and *open source* pull opposite ways under a change of owner —
  MIT on what shipped is the only "free" that survives a transfer, so the instinct to drop it worked
  against the stated intent. **YC does not buy companies; it invests** — the acqui-hire reframe made the
  numbers stop mattering and the person start mattering, which is the honest read of a 0-star repo with
  a year of DECs behind it. The drift-loop fired every turn; this was the one session where the
  stated-vs-actual line fit (the deck and the design playbook do not test the named bet), so it was said once.

## 2026-09-13 (the board emptied — Building and Taking shape both at zero, by finishing and by reading)
- **FEAT:** _no FEAT — exploration/ops_
- **Landed:** Five commits under Unreleased (`1b91586` → `3ffb630`). Ajesh, from his phone: *"on the board what are some ideas that have been vetted and ready to implement next"* → *"flip status, elevate stuff to taking shape, review older ideas that could be deprecated"* → *"lets go, finish whats building and then continue to taking shape."* **The board never read `ready`** — `/revalidate` writes it on revive and it rendered as Captured; fixed, one test. **Five cards had finished under other names and never said so** (IDEA-071 v0.218.0, 084 v0.324.0 `earned`, 095 v0.300.0 exec-form, 096 the copy + plugin door, 102 v0.318.0) — flipped, remainders parked with the triggers their records already carried (006 owns the port again; 066 owns outward research with 093 p7's sharper trigger; 047 re-aimed keyless as a fake door, parked until strangers exist; 036 dropped by Ajesh; 075/076/082 deferred). **Built:** the return path (IDEA-093 p6 + 094 p2/p5) — `revisit-due` and `unticked-shipped` in `boss records`/`boss status`, `/log` stamps `outcome:` at ship; priced as a sixth loop predicate, cost none; first run caught FEAT-021 (6/6 unticked, all true on disk); first BOSS decision due 2026-09-20. `/log`'s recipe as a script (IDEA-100 pilot) — measured 1,140 → 1,186 words, no token gain, the newest-first invariant is the gain; this entry is its first real use. The shelf's product half (IDEA-090) — product/project/conscience shelves, `provenance_public` on the twelve (five say *no outside source is claimed*), the exactly-one check found two more (accessibility, deceptive-patterns). The board's summary line hid the shipped count when the middle emptied — fixed. Board artifact published for the phone (claude.ai/code/artifact/168927a8…). Board: 4 captured · 0 · 0 · 73 shipped · 29 parked.
- **Next:** The four Captured cards are the whole open queue; 081's two DECs (per-person state, push) are the cheapest honest move. 2026-09-20: the first `revisit-due` fires here — answer it with `outcome:`. Above all, unchanged: publish (`npm run stamp`, 18+ behind) and Phase 3 outreach — Ajesh's.
- **Surprises / decisions:** **The Building column was not a pile; it was a ledger nobody re-read.** Five of five "building" cards had shipped or been decided elsewhere — the focus-loop's count was right and its story was wrong, which is exactly the judgment IDEA-034 says the predicate cannot make. **IDEA-094 part 6 had shipped three weeks before the record was written** (`boss records --programs`, v0.186.0) — the record was written against one call site and missed the other. **The "sixth predicate" was a cost the record invented** by assuming the mechanism needed a new home (the same shape IDEA-091 p6 found: *assumed the artifact needed a new home*). **The fake door beats the wizard when there is no key** — and neither is worth an hour until there is traffic; Ajesh chose the trigger over the build. **Task-hygiene fired at 575 minutes with nothing durable moved** and was right in the letter and wrong in the fact: every found item was already in RESUME; the gate cannot see that, as its own frame admits.

## 2026-09-12 (evening — the instrument ran — v0.319.0)

- **FEAT:** none. Ajesh: *"what do you recommend for skill-doctor, i think maybe good idea, same for
  plugin eval?"* Both run/checked the same hour, in a throwaway `boss new` + `unlock mvp` scaffold,
  cleaned and pruned from the registry after.
- **Landed (5c35568):** `/skill-doctor` output filed (`docs/research/sessions/SKILL-DOCTOR-…`). All 45
  descriptions resident every turn, ~4.7k tokens; 10 of 45 ever invoked on this machine, 35 never —
  n=1, BOSS-on-BOSS, so not a cut list and the practice says so. **RVW-102 ADAPT** (tool-surface
  economy, parked since 09-08 until this number existed) → `context-discipline.md` move 1b. **Bug the
  instrument found and reading could not:** `/extract`'s description said `PRINCIPLE #1`; ` #` opens
  a YAML comment; the host had shown it as *"Pause and sort patterns — PRINCIPLE"* since the line was
  written, and `/health` carried `the #1 way startups die` the same way until v0.316.0 removed it by
  luck. Fixed; `check:manifests` refuses ` #` now; two tests, one proving the gate bites.
  `claude plugin eval` has nothing to run — no `evals/` in the plugin → IDEA-103 (first case = the door).
- **Version collision, handled by the handshake:** a peer (`bossbuild-ed`) rewrote RESUME into its
  200-line window (IDEA-102) and folded the archive into this file at 19:03 while I was on 0.318.0
  too. Messaged it; it committed 0.318.0 (e035ce2) with only its hunks and restored mine; I took
  0.319.0. Its move left two `RESUME-ARCHIVE.md` links briefly broken — it fixed them in its commit.
- **What surprised:** the "progressive disclosure" defence of 45 skills was half-true — bodies, yes;
  the list, no. And the only usage data BOSS has is itself: `close`/`smoke` 59×, `boss-learn` 4×,
  `extract` 0× — which is the number IDEA-101's reversed merge was waiting for.
- **Later (v0.320.0, 48fcff9) — IDEA-103 built the same evening.** `claude plugin eval` is early-access
  on the PATH `claude` (2.1.236 refuses `init`); the VS Code-bundled 2.1.269 runs it. One case
  (`plugin/evals/door/`), two LLM graders, host ablation with-without: **with 1.0 / without 0 / Δ 1.0**,
  $0.19–0.26 a run. Run 1 failed the *offer* grader on the CASE, not the door — no Bash in the sandbox
  made step 1 apologise and name the install fallback, and the judge read a named command as an act.
  Allowed `Bash(boss:*)`, made the grader fail only on scaffolding. `tool_used: Skill` is not the
  indicator for a slash command. `npm run eval:plugin`; results gitignored; peer's dogfood row folded in.
- **Later still (v0.321.0, 259d152 + b5e9dc1):** repo-door eval case — with 1.0 / without 0.33 / Δ 0.67;
  the door refused to adopt the sandbox folder and said so, which is the failure the skill exists to
  prevent. `model-routing.md` gains the `effort:`-is-a-shape paragraph; `check-refs` caught it naming
  `/recalibrate` in shipped text (the dev-workspace-described-as-shipped pattern, n+1) — reworded.
  RubyGems open question grepped and answered into the inbox: nothing covers pipelines that execute
  repo-controlled config; held for the Nov 9 security sweep.
- **Later (v0.322.0, f387d67) — IDEA-101 shipped.** Ajesh: *"go for it i guess."* `/boss-learn` out of the
  L0 template; supersedes row; `/extract` step 6 rewritten to check for a checkout first and record
  UP-pending with the reason when there is none; 38 shipped mentions → `/extract` (or `boss learn` where
  the CLI is meant); `check-refs` caught the last three (a provenance line, the L3 hint, GUIDE.md) and
  then, once the supersedes row existed, every mention in BOSS's own gitignored workspace — so BOSS
  itself now hands ADOPT/ADAPT to `/extract`. One verb, two altitudes. Boundary ledger and ladder
  `_exempt` rows removed. Verified: fresh scaffold has no `boss-learn`; a 0.321.0-pinned throwaway with
  the old skill gets the full migration text from `boss sync`. 48 → 47 as a side effect.
- **Later (v0.323.0) — model attachment let go.** Ajesh: *"should we get rid of the whole fable model
  pinning?"* Measured: shipped surface had zero pins since v0.135.0. Residue: `/vet`'s `model: "fable"`
  line (ignored today, nothing broke), `/recalibrate` walking a models/routing/pricing profile, and
  `.boss/model-profile.json` — **never existed**, referenced by two skills and a practice for four
  months. `/vet` now asks for the shape; `/recalibrate` rewritten (tier moves a shape · `effort:` axis ·
  second host · ledger anomaly; never create the profile to satisfy the reference); four shipped
  Haiku/Sonnet/opus examples → tiers. `task-hygiene.js`'s retained-model list stays: a dated host fact.
- **Next:** npm sixteen behind; nothing pushed.

## 2026-09-12 (later still — RESUME is a briefing with a window — v0.318.0)

- **FEAT:** none. IDEA-102. Ajesh: *"what is our approach to resume? is it the right way? i feel like
  we are often adding random things, or hitting the max and it needs pruning."* Then: *"file, and then
  lets fix both for here and in app right?"*
- **Landed:** measured first — 742 lines / ~15.6k tokens read first every session, two days after an
  archive pass; npm's version stated seven ways in one file; a 5.5 KB `updated:` field; State sections
  out of order; the length check an advisory in `npm run release`, which nobody runs. Diagnosis: the
  concept is right, the design had three defects (the only guaranteed-read file is a magnet · the
  window had no number and no runner · rewrite-shaped, append-written, holding computed facts).
  **Shipped:** `boss status` prints one line past a 200-line window (silent under it; *move, don't
  trim*); `/close` writes the window into the RESUME header it creates, both copies; the re-entry
  parser accepts a titled date heading (it was refusing four of six entries in this very devlog and
  quoting a session three weeks stale). **Here:** RESUME rewritten to a fixed skeleton — no dated
  State stack, no numbers a command computes; the whole old file and the whole of `RESUME-ARCHIVE.md`
  moved into this devlog verbatim (the two entries below this one); the archive retired; the check
  moved into `npm run check` as a hard finding; standing rules and the two incidents moved to
  `CLAUDE.md`; `dogfood.json`'s devlog row `exempt → exercised`.
- **What surprised:** the practice BOSS ships (`context-discipline.md`) already said *write the window
  as a number into the file* — and BOSS's own file had every part of that rule except the number. The
  second surprise was the parser: the home history was being moved into had one reader, and it was
  blind to the heading convention every recent entry used.
- **Committed `e035ce2`.** A peer session held the `/skill-doctor` release on the same number; it
  messaged first (*you keep 0.318.0, commit first, I take 0.319.0*), I committed by explicit path with
  the two shared files as HEAD + my hunk and restored theirs after; `5c35568` landed on top a minute
  later. Cleaner than the stash dance — take that offer when a peer makes it. Not pushed.
- **Next:** run `/close` at the end of the next real session and confirm the file stays under the
  window without anyone thinking about it. The lesson generalises to the auto-memory index (same
  magnet, different file) — a separate session.

## 2026-09-12 (later — the vet sweep: the host took a primitive away — v0.315.0 → v0.316.0)

- **FEAT:** none. Ajesh: *"lets do a vet and see if there are any new ai agentic practices since we
  last checked"*, then *"is it better to have more scripts than skills? should we be trying to reduce
  our bloat of skills?"*, then *"lets see whats the best way forward … lemme know what you need input
  … then do fixes and lets implement."* All four recommendations taken.
- **Landed:** `SESSION-2026-09-12-agentic-practice-since-the-harness-sweep.md` (6 angles, 9 primaries,
  3-skeptic panel — first pass in weeks to actually run it); RVW-098 ADOPT · 099 NOT-YET · 100 REJECT
  · 101 ADAPT. **v0.315.0:** `task-hygiene` no longer reads `TodoWrite` (Claude Code 2.1.268 withdrew
  it on current models; the moment had been silent two weeks) — time-only gate from the transcript's
  own stat times, parses nothing; `harness-engineering.md` seam rule gets its detection half.
  **v0.316.0:** all 48 skill descriptions ≤50 words (3,654 → 2,274; ~4.8k → ~3.0k always-loaded
  tokens), cap 700 → 420 B. IDEA-100 (recipe skills → scripts, `/log` pilot, not built) and IDEA-101
  (distinctness read: one merge candidate, one sharpening, nine keeps) filed.
- **What surprised:** the finding was in the host CHANGELOG, not in any doctrine tap — and the hook's
  own dated "what could rot" header listed two facts that didn't and missed the one that did.
  Second: my WebFetch summary of the Shopify post **manufactured two quotes**; a skeptic caught it by
  reopening the page. Third: the 09-08 session's "Anthropic silent since April" was wrong and BOSS had
  the refutation on file (RVW-044) with no URL, so nothing could see it.
- **Later the same session (v0.317.0):** `/pretotype` ↔ `/prototype` cross-reference shipped; freshness
  ledger regenerated (8 files had no row at all — worse than the stale one); domain-1 tap added for the
  other harnesses' config docs. **The altitude read reversed IDEA-101's merge:** the shipped `/boss-learn`
  admits UP is impossible off a checkout, so it is the internal verb and it ships at Quickstart —
  candidate is now `/boss-learn` → `/extract`, waiting on a yes and on `/skill-doctor`.
- **Next:** the `/boss-learn` → `/extract` call; `/skill-doctor` + `claude plugin eval` (Ajesh); npm is
  eleven behind; nothing pushed.

## 2026-09-12 (engineering + PM read as one system — v0.312.0)

- **FEAT:** none. Ajesh: *"engineering best practices — organization, naming, execution,
  documentation — idea → major initiative; competition + thought leaders; the four crafts in sync."*
  Record: `docs/research/sessions/SESSION-2026-09-12-engineering-and-pm-as-a-system.md`.
- **Landed:** six primaries at source (DORA capabilities model, Radar vol 34, Linear Method + AIG,
  Cagan 2026-09-11, Karpathy's own post, Beads). 15 of ~18 claims already held. Two gaps, one shape —
  **rule held, runner absent**: `smoke-guard` (Stop hook, dormant; 7 tests; driven from a real
  scaffold) · `/smoke` plants strict typecheck + formatter at first run · `/spec` step 0b asks for
  `program:` on the second sibling FEAT · the four-crafts table in the FEAT template header + one
  sentence on the site index · Beads filed `watch`. 48 skills before and after.
- **Next:** still **publish** (npm at 0.306.0, now six behind) and Phase 3 outreach. Then: send
  Cagan's *"teams over-invest in validating problems"* through `/vet` — it rubs against the
  conscience's validation nudges and deserves a verdict; add a watchlist row for the project/PM rung
  (nobody owns sequencing); the `blocked_by:` / `ready` seam if a real project ever asks.
- **Surprised me.** Two peer sessions cut v0.309.0 and v0.311.0 *during* this one, and the second
  regenerated `site/` — which erased my two site edits twice, because I had edited the BUILD OUTPUT
  (`site/*.html`) and not the SOURCE (`web/*.html`). The header of `gen-site.js` says exactly this.
  Read the generator before editing anything it generates.

## 2026-09-10 (the design program — seventeen releases)

- **FEAT:** no FEAT — [[IDEA-091]] (the eight-layer ladder, parts 1–7) and [[IDEA-092]] (everything
  the reassessment found). Both `shipped` with dated close-outs; read those rather than re-deriving.
- **Landed:** v0.276.0 → v0.292.0. **One new loop, two dormant hooks, NO new verbs** — 48 skills
  before and after. Components at the rung where they are born · the guard across all five token
  families · the pattern layer · brand as a `DEC` · `design-pattern-loop` · flows authored in `/spec` ·
  the prototype seam · demotion · reuse-adjust-or-new · composition · surface-gating · `BRAND.md` out
  of `docs/design/` · `boss craft accessibility` + `contrast-guard` · the element families and the
  unglamorous surfaces · four seams · docs and site regenerated.
- **Next:** **publish.** npm is 17 releases behind and none of this has reached a person. Then Phase 3
  outreach. Nothing on the design board outranks either.
- **Surprised me — three things.**
  1. **The biggest ideas came from Ajesh mid-build, not from the plan.** *"A system that can only add
     rules locks design in"* and *"it's more about the principle than enforcement"* each redirected a
     release that was already underway, and both were right. The second one caught me building a
     contrast guard for a system that had **no accessibility practice at all** — rules with no basis.
  2. **Six instances of one defect: a claim outliving its mechanism.** Including one I shipped *in the
     release whose stated lesson was that exact bug* — v0.286.0 named two surface-blind skills and
     fixed one. **Writing the lesson down is not the same as applying it**, and the operational form is
     narrow enough to keep: when a correction names more than one file, fix them in the same change.
  3. **BOSS's own gates caught more of my mistakes than I caught myself** — test counts twice, a hook
     `boss hooks` wouldn't list (shipped undiscoverable), a practice naming a BOSS-only skill that
     would dangle in every founder's install, a `review_by` off the craft curve, and a `gen:site` crash
     that deleted most of `site/` because two source records I added had no `name` field. The generator
     was right to die loudly.
- ⚠️ **Branch state, for whoever reads this next.** A peer session was live in this tree throughout. It
  shipped **v0.284.0 (`product-language`)** mid-stream — version collision, resolved by renumbering
  ours to 0.285.0 — and the working tree is now on **`product-language-program`**, where everything
  from v0.283.0 onward lives. `evid-003-second-turn` stopped at **9ac43bc** (v0.282.0, the end of
  IDEA-091). The two are not merged, and that call is Ajesh's.
- 🔷 **Found, not fixed:** `readShape()` is exported from `src/config.js` with a careful comment and
  **nothing in `src/`, `test/`, `scripts/` or `bin/` calls it** — a reader nobody calls.

## 2026-08-21 (later — the drift + canvas session)
- **FEAT:** no FEAT — v0.196.0 and v0.198.0, both from questions rather than a backlog.
- **Landed:** **`outpaced`** (v0.196.0) — the conscience's second temporal loop, watching the canvas
  fall behind *shipped work* rather than behind evidence. `outpaced_by` gained an optional `pattern`
  so it fires on `status: shipped` and **not** on drafting; verified on a throwaway in all three
  directions (opens · silenced by touching the canvas · **still silent** when the same three FEATs
  are `building`). **`npm run check`** now exists. **v0.198.0** — the Humane Product Canvas published
  free as `web/canvas.html` + a CC BY-SA 4.0 template ([[IDEA-068]], [[DEC-010]]); frames and all
  BOSS couplings deliberately stripped, no interactive state. Also: BOSS's own `CANVAS.md` → v0.4,
  Business Model answered on both branches from git evidence, and its roster cell corrected (it named
  eight retired agents and three internal-only surfaces as founder features).
- 🔴 **What surprised me, and it was my own work:** `check:manifests` reported **PASS** on a loop file
  I had added without declaring it in the manifest. The check was right — **the way I was running it
  was wrong.** Three of the ten check scripts print errors and exit 0 without `--strict`, and I had
  been hand-rolling a verification loop over exit codes all session. Nothing was actually masked, but
  **the method could not have told the difference**, which makes every "all green" I said before that
  point lucky rather than verified. That is the eighth instance of *the claim and the enforcement
  disagree* in this repo, and the first pointed at the runner instead of the checker.
- **Also worth remembering:** publishing the canvas was blocked for one round on **attribution** — a
  lineage note said "built with" someone, which was enough to stop and ask rather than stake a public
  byline. Sole authorship confirmed. **The cost of asking was one question; the cost of being wrong
  would have been a correction, not an edit.**
- **Next:** the succession hole in BOSS's own canvas (MIT, bus factor 1, no archive-or-handover
  decision — a founder call), and the publish queue, where [[DEC-010]]'s CC grant becomes real at
  deploy and only loosening is available afterwards.

## 2026-08-21
- **FEAT:** no FEAT — working the open list from v0.190.0
- **Landed:** `minors` dissolved from a surface into a `stricter_when_minors` modifier (it was never
  a place in the product); `build-craft`'s watchlist marker reconciled; five inlining skills given
  catalog pointers; the local half of `/vet`'s rubric pre-resolved on both candidate rows. **`npm
  test` and all nine checkers are green together for the first time.**
- **Next:** ONE source pass covering all three open items — FTC Operation AI Comply, the EDPB
  consent-or-pay opinion's *scope*, and the two moderation rows. They share a single blocker
  (citations), so three separate passes would be waste.
- **Surprises / decisions:** The shape check earned its keep twice in one day — it dissolved
  `minors` and then *halved* the moderation gap (two of four candidates already had homes) while
  confirming that surface is real. A rule written in the morning paid for itself by evening.
  Also: the thin cell was the finding, not the gap. `minors` refused to fill for
  a structural reason, and the fix was to delete the category rather than research it — now written
  into the practice as a rule. Second: reviewing the open list found more than it closed, which is
  the argument for the review being a step rather than a footnote.

## 2026-08-20
- **FEAT:** no FEAT — the deceptive-pattern catalog rebuild (v0.190.0)
- **Landed:** The catalog became data (`library/deceptive-patterns.json`, 89 rows indexed by product
  shape × surface) with the judgment split into `deceptive-patterns.md`; `/red-team --humane` became
  a conditional battery instead of five chatbot probes; a `deception` conscience moment + loop now
  watch for patterns the *model* wrote; `/ux-check`, `/trust`, `/canvas` and `harm-taxonomy` all
  gained the delivery that made the catalog reachable. Then the follow-up pass: `boss remove` now
  exports the venture brain instead of deleting it, `check:freshness` grew a watchlist-marker sweep,
  and this file.
- **Next:** `/vet` the two `status: candidate` rows (`consent-or-pay`, `claims-ai-washing`) — both
  are queued in `docs/research/inbox/`. Then the `minors`-is-a-modifier-not-a-surface question.
- **Surprises / decisions:** The question was "are we missing patterns?" and the answer was "yes,
  but the runner was certifying passes it never ran" — coverage was the third-biggest problem.
  Recorded as [[DEC-007]]. Second surprise: writing a catalog row for `exit-no-export` sent me to
  check BOSS's own exit, and BOSS was tripping it — `.boss/brain/` held prose BOSS told the founder
  was theirs to edit, and `boss remove` deleted it. Fixed the same day. **Writing the rule found the
  violation**, which is the argument for naming patterns precisely rather than gesturing at them.

## 2026-09-12 (RESUME.md as it stood before the window — moved here verbatim, IDEA-102)

> The whole file, headings demoted one level, nothing summarised. It was 742 lines. Every version it names is in
> `registry/CHANGELOG.md`, which is canonical and tracked; this is the narrative around them.

```yaml
id: RESUME
type: resume
owner: product-lead
status: active
updated: 2026-09-12 — **v0.317.0** (/pretotype ↔ /prototype name each other; freshness ledger regenerated — 8 files had no row; IDEA-101's merge REVERSED on the altitude read, waiting; vet sweep → RVW-098→101; v0.315.0 task-hygiene reads the transcript's clock, not the withdrawn `TodoWrite`; v0.316.0 all 48 descriptions ≤50 words, cap 700→420 B; IDEA-100/101 filed, two per-pair decisions waiting; before that: the plugin gate moved into `check`, the board on the same floors; v0.313.0: the site and the shipped guide measured against their own floors: 40 → 0 on every floor, DEC-018 moved the ground cool; before that, v0.312.0: engineering + PM read as one system — `smoke-guard`, the `/smoke` seam, `program:` offered by `/spec`, the four-crafts table, Beads filed; the same hour, peers cut v0.309.0 and v0.311.0 — design-system tooling field, governance/code-shape seeds, then the two guards behind them; a peer's batch was v0.303–v0.306 the day before; the whole comp-read batch shipped: IDEA-097/098/099 + citations + retro) alongside a peer's v0.299/v0.301 — all PUSHED; CI green ×6 on every push since v0.298.0. npm + Homebrew tap both serve 0.273.0; `npm run check` at zero findings.
  Per-release detail is in `registry/CHANGELOG.md` and the *State* sections below. **This block is a
  briefing, not a log — if you find yourself narrating releases here, it belongs in *State*.**
  ✅ **npm HOLD LIFTED. Ajesh, 2026-09-09: *"lets commit, and then i can publish to npm."*
  He publishes it himself — do not run `npm publish` or `npm run bump:formula` for him.** npm sits at
  **0.268.0, five behind** (was 0.245.0/twenty-three when this block was written), and everything
  shipped since is unreachable by founders until it runs — which is written to read as urgent and is **paused, not owed**. Local commits and version
  bumps are unaffected. 🔴 **This hold was written at 19:40 and a peer session had dropped it by
  21:26.** If you rewrite this block, carry it forward or confirm with Ajesh that it is lifted.
  ✅ **THE ONE-WAY DOOR: DECIDED AND HALF-WALKED (Ajesh, 2026-09-09).** IDEA-087 is resolved for
  two of its three parts. **v0.263.0** — the rule: *the `[[…]]` form promises the reader can open
  it; a bare id says a record exists.* 198 citations across 28 tracked files lost their brackets and
  kept their ids; `check-refs` class 6 enforces it with **no exemptions**, self-correcting from
  `git ls-files`. **v0.264.0** — `docs/decisions/` is **published**, 16 records, scanned first: no
  personal, customer or financial content. **Per-record, not a standing rule** — the 16 were written
  with no reader, which is why several are unflattering on purpose, and the seventeenth gets its own
  call. Ideas and evidence stay private by decision (Ajesh: *"ideas from boss dont need to be front
  facing"*); **evidence permanently — those are real people who spoke in confidence.**
  🟡 **STILL OPEN, and the cheapest remaining half: `docs/research/verdicts/`** — 96 files / 552K,
  measured to contain zero home paths, keys or emails, and un-ignoring it resolves 27 dangling
  `RVW-nnn` references in the tracked CHANGELOG. Same call as the decisions, same asymmetry, not yet
  made. 🔴 **The repo stays PUBLIC — settled 2026-09-09.** Going private hides history and issues,
  not code: `oyeboss` is on npm, MIT, through 0.245.0, and `npm pack` reads `src/`, `stages/` and
  `library/` today. It would also contradict the README's *"Open. Inspectable."* and DEC-011.
  🔷 **The standing read, and it is uncomfortable:** a long run of internal correction, all real,
  none of it moving the **n=0** risk. EVID-001's adjacency warning applies — *more surface ≠ more
  readiness*. The two items above every engineering task are **publish** and **Phase 3 outreach**,
  and both are Ajesh's.
  ⚠️ **Treat every version number here as a FLOOR, not a reading.** Peer sessions write this tree —
  six releases landed from other sessions during 2026-09-08 alone. Run `cat VERSION && git log -1`
  first. `registry/CHANGELOG.md` is canonical.
archived: 🔴 **`RESUME-ARCHIVE.md` WAS DESTROYED 2026-09-09 and now holds ONLY the Carried-forward /
  Work-Order / Captured-not-built / Next-tasks / Open-decisions blocks moved that day.** It previously
  held ~600 lines of *State* commentary for **v0.223.0 → v0.254.0**; that text is **gone and not
  recoverable** — the file is gitignored, single-copy, and there was no backup. Cause: an assistant
  script opened the archive with mode `'w'` (which truncates immediately) and *then* read it to
  prepend — so it read an already-empty file. **Do not look for that content. It is not there.**
  ✅ **What survives is the part that matters:** all 27 affected versions are present in
  [`registry/CHANGELOG.md`](../registry/CHANGELOG.md) — verified individually — which is tracked,
  committed, and which this file has always called the canonical and complete record. What was lost
  was RESUME-flavoured narrative *about* those releases, not the releases.
  🔴 **This is the SECOND destructive loss of a gitignored single-copy file in this repo** (the first:
  `.boss/conscience-log.jsonl`, 2026-08-21). Both would have been survivable under [[IDEA-087]]. The
  standing correction below was written about a pointer that *claimed* an archive it never had; it is
  now literally true again, by different means, which is why it stays. **A pointer to history that
  isn't there is worse than no pointer** — so this line says plainly what is gone.
```

## RESUME — BOSS

**Read this first each session.** State + next tasks + open decisions.
Kept short on purpose: a briefing, not a log. History lives in
`RESUME-ARCHIVE.md` *(folded into this devlog 2026-09-12; link removed)*; the canonical per-version record is
[`registry/CHANGELOG.md`](../registry/CHANGELOG.md).

### What BOSS is
A just-in-time **startup incubator** (not just a scaffolder): `boss new` → open Claude → `/boss`.
Scaffolds at the right level of ceremony and grows the project through **modes**
(Quickstart → MVP → V1 → Scale), with two agent classes — **builders** (make the app) and
**mentors** (coach the founder). See [`PRINCIPLES.md`](../PRINCIPLES.md) and [`README.md`](../README.md).

### 🔴 THE EXTERNAL EVIDENCE — n=3 signals, n=2 independent founders (standing; read before any build)

**All of it is `stated-pain`. Nobody has been observed using BOSS and nobody has committed anything.**
Convergence raises conviction; it does not raise the grade. Ledger: `docs/evidence/` (gitignored).

- **EVID-001 · 2026-07-23 · a founder, using it.** BOSS's first-ever evidence file, ~120 releases
  in. *"hard to gauge where i am / which stage / how it aligns with my roadmap; i forget what feature
  i'm building / get adhd; worried about bloating my app; help me keep focus + when to rearchitect;
  knowing exactly where i am like a train line, seeing my progress; more visual cues to feel like i'm
  making great headway."* The praise around it (*"great app, love the direction"*) is Mom-Test fluff —
  **a compliment is not a receipt.** The load-bearing read is the **thesis/execution split**: the
  vision lands, the offering is what's unready.
- **EVID-002 · the website, weakest of the three.** *"the value is not being seen"* — 14 pages
  describing the machinery, and no answer to *what would I get out of this?*
- **EVID-003 · 2026-08-21 · a founder who actually installed and ran it.** Setup was easy; then
  `/boss` *"jumped straight into building, rather than checking or giving feedback or saying back what
  the idea was."* ✅ **Provenance settled by Ajesh 2026-08-21: a DIFFERENT founder from EVID-001.
  n=2 independent** — so the old *"hold until a second signal"* condition is **MET**, on its own terms.
  *(This file carried that as an open question for three days after it was answered.)*

- 🔴 **The mandate, and it survives its own discharge.** *Compose and **SUBTRACT** the existing surface
  into one "you are here" — never add another skill.* The founder's own stated fear is app bloat, which
  is BOSS's canvas Risk #1. **The met condition is not a licence to resume feature building.** Discharged
  twice so far, both by subtraction: **v0.214.0** (an opt-in *"ready to build, or want to share more?"*
  stop before the paperwork — four of the founder's five asks already had surfaces, just never offered
  at the moment they'd help) and **v0.231.0** (`boss status`'s re-entry + evidence reads, composed from
  records `/log`, `/close` and `/evidence` were already writing). ⚠️ **The historic "22-skill/11-loop →
  never a 23rd" phrasing is out of date and was wrong to leave standing — the shipped surface is now
  48 skills / 19 loops.** The number moved; the discipline did not.
- **The convergence — hypothesis, not finding. Hold it loosely.** Three sources, three different
  people, one axis: **BOSS emits and never mirrors.** EVID-002 couldn't see what they'd get, EVID-001
  couldn't see where they were, EVID-003 couldn't get BOSS to reflect their idea back. Consistent with
  a mechanical fact: the conscience has eleven watchers whose only positive signal is *silence*. The
  synthesis is **retrospective**, which is exactly the condition under which a tidy pattern is easiest
  to invent. Worth *aiming* work with; not worth building a "mirror" surface on.
- 🔴 **The uncomfortable adjacency, kept because it recurs.** In the same session EVID-001 arrived
  saying *"the offering isn't ready and I can't tell where I am,"* the build stream shipped v0.120→
  v0.126 — seven post-launch releases of *operator* surface for operators BOSS has **zero** of. That is
  "building around the risk" in real time. **The riskiest assumption is unchanged: will a real founder
  RETURN, and will BOSS change a decision they'd otherwise make worse?** More surface ≠ more readiness.
- **The cheapest next move is still not a build.** The three questions at the foot of the EVID-003
  file — *show me the idea doc BOSS made you, what's wrong with it? · what did you actually do with the
  extra insights? · did you come back a second time?* — are what move `stated-pain` → `observed-behavior`.
  Only the third has an answer that is a behavior.

### 🔴 INCIDENT 2026-09-09 — an assistant destroyed `RESUME-ARCHIVE.md`

Consolidating this file, an assistant prepended to the archive with
`open(path,'w').write(new + open(path).read())`. **Mode `'w'` truncates on open**, so the inner read
returned an empty file: ~600 lines of *State* commentary for v0.223.0 → v0.254.0 were overwritten by
the 155 lines being moved in. Gitignored, single-copy, no backup, **not recoverable**.

- ✅ **Blast radius was limited by something already true, not by anything done in the moment:** every
  affected version is in `registry/CHANGELOG.md`, tracked and committed. **The canonical record never
  depended on the archive.** Losing the narrative cost context, not history.
- 🔴 **Second loss of this exact shape.** 2026-08-21 destroyed `.boss/conscience-log.jsonl`; today
  destroyed the archive. Both files were gitignored, single-copy, unrecoverable by git.
  **[[IDEA-087]] would have made both survivable** — that decision now has two demonstrations behind it
  instead of an argument.
- **The transferable rule, and it is not "be careful":** *never open a file for writing before you have
  finished reading it.* Read fully into memory, close, then write. The one-liner
  `open(p,'w').write(x + open(p).read())` reads as prepend and **is** truncate — it is not a slip that
  care prevents, it is a shape that has to be recognised.
- ⚠️ **Do not "restore" the archive by re-deriving it from `registry/CHANGELOG.md`.** That would
  manufacture a record nobody wrote and present it as recovered — the same dishonesty the 2026-08-21
  entry refused when it left the frequency log empty rather than inventing entries.

### 🔴 INCIDENT 2026-08-21 — an assistant deleted `.boss/` from this repo

Cleaning up after an npm smoke test, an assistant ran `boss remove --apply` from `~/Projects/bossbuild`
instead of the throwaway. **`.boss/` is gitignored, so `git status` stayed clean and git could restore
nothing.** Every TRACKED file was untouched, and `.claude/`'s 19 dev agents survived — the v0.197.0
provenance ledger is never back-filled onto files merely present on disk, so `remove` correctly saw
them as not BOSS's. **The release that shipped hours earlier is what limited the blast radius.**

- 🔴 **GENUINELY LOST: `.boss/conscience-log.jsonl`** — BOSS's own frequency ledger, populating since
  2026-08-20. Restored as an EMPTY file. **Frequency data restarts 2026-08-21; do not read that log
  as continuous.** Inventing entries would have been the exact dishonesty this repo keeps catching.
- ✅ **Both built — v0.221.0 (`60bc643`).** `remove --apply` refuses in BOSS's own checkout (`--yes`
  overrides) and copies `.boss/` to `~/.boss/removed/` first. 🔴 **This bullet was WRONG about where
  the flag lives:** `.boss/manifest.json` has no `selfHosted` field and never has — it is in the
  machine-local `~/.boss/registry.json`, which is why the guard reads the FILESYSTEM (a fresh clone
  has no registry entry, so a flag-based guard would silently not fire). A guard written from this
  note would have been vacuous. Detail in `registry/CHANGELOG.md` 0.221.0 — **that
  section is not "below" and never was archived; it was dropped.**

### ⚠️ CONCURRENT SESSIONS ARE THE NORM IN THIS TREE — read before you commit

**Six `bossbuild` peer sessions were live on 2026-08-21.** One committed six releases while this one
was three commands into reading ground truth. **This is not an anomaly to note once — it is the
operating condition**, and it has cost **four** version collisions — v0.177.0, v0.191.0, v0.199.0,
and **v0.213.0 on 2026-08-21**: DEC-013 committed as `38e209e` at 20:58 while a peer session was
mid-build on the same number (its work renumbers to 0.214.0; the shared memory note was corrected).

- **Before any commit or version bump:** `git log -1`, then `git status`, then mtimes on `src/` and
  `registry/CHANGELOG.md`. If either moved in the last few minutes, someone else is mid-release.
- **Every version number in this file is a FLOOR, not a reading.** This file once went stale *while
  it was being written* — two releases in thirteen minutes. The lesson is not "update RESUME more
  often": **a read-every-session briefing cannot describe a tree with six writers**, and
  `registry/CHANGELOG.md` is the only surface that can.
- **`docs/RESUME.md` is gitignored, so concurrent writes here produce DUPLICATES, not conflicts** —
  nothing is watching. Read before you write; repair rather than overwrite.
- ⚠️ **`node scripts/release.js` is NOT read-only.** It regenerates `docs/CHEATSHEET.md`,
  `docs/SKILLS.md` and 15 `site/` files **on disk**. Never run it to "just check" a tree someone else
  is releasing into — and note it writes the website, which is under a standing do-not-touch.

### State (shipped, v0.276.0 → v0.292.0, 2026-09-10) — the design program, start to finish

**Seventeen releases. One new loop, two dormant hooks, NO new verbs — 48 skills before and after.**
[[IDEA-091]] built the eight-layer ladder (parts 1–7); [[IDEA-092]] closed every gap the reassessment
found. Both records are `shipped` with dated close-outs; read those rather than re-deriving.

- **The three ideas worth more than the features.** (1) **A system that can only add rules locks
  design in** — promotion had a threshold and demotion had none, and the exceptions table that proves
  a rule wrong was being written and never read. (2) **Name the slot, earn the value** — the
  composition layer ships EMPTY, because a ratio handed over on day one is lock-in wearing a
  best-practice hat. (3) **Lead with knowledge, not enforcement** — Ajesh's correction mid-build;
  `boss craft accessibility` is the gap it exposed, and contrast is arithmetic while *nothing else
  joins it*.
- 🔴 **Six instances of one defect, and the method that found them all.** Every one was *a claim
  outliving its mechanism*. **When a fact changes, grep the string** — and the sharper version, learned
  by shipping it wrong: **when a correction names more than one file, fix them in the same change, or
  the second one does not happen** (v0.286.0 named two surface-blind skills and fixed one).
- ⚠️ **A peer session shipped v0.284.0 (`product-language`) into this branch mid-stream.** Version
  collision resolved by renumbering ours to 0.285.0. Concurrent sessions are the norm here; check
  `git log` before assuming a version is free.
- 🔷 **Incidental, unfixed, worth a look when the tree is quiet:** `readShape()` is exported from
  `src/config.js` with a careful comment and **nothing in `src/`, `test/`, `scripts/` or `bin/` calls
  it** — a reader nobody calls, the mirror of the field-nobody-reads pattern.

#### The old part-by-part detail


Ajesh asked whether BOSS's design system is under-developed. **It is not — it is unevenly runged.**
The audit is [[IDEA-091]] and it is a *program plan*, not a feature: the 8-layer ladder a design
system actually holds (brief · foundations · components · patterns · flows · content · visibility ·
learning), which rungs BOSS built, and the order to fill the rest. Foundations and content are
strong. **Components and visibility were built at the wrong rung.** Brief, patterns, flows and
learning are missing. Six of its seven parts are a composition or a rung move — **no new verbs** —
and the seventh (flows) is held *because* it would need one.

- **Part 1 shipped (v0.276.0).** `/design-tokens-init` now writes `docs/design/COMPONENTS.md` at the
  first component, plus the CLAUDE.md rule *build the button, then use it on the page*. The catalog's
  two most expensive failures — pattern reinvention, billion-line drift — both begin at component
  **two**, and the index preventing them shipped at **V1**. Same inversion `designer` had before
  v0.189.0; the argument was never made for the index. `/design-library` now generates over the same
  shape and **supersedes** the file rather than sitting beside it.
- **Scope said on the artifact, not hidden:** at MVP the index is *authored*, so it can go stale and
  nothing catches a component created without its row. **A better filter, not yet a boundary.** It
  becomes one at V1 with the source hash.
- 🔴 **Fourth doc-vs-filesystem mismatch in this practice's history, in the worst file for one.**
  `stages/L2-v1/template/claude-append.md` is appended to the *founder's own CLAUDE.md* — read every
  turn — and still carried the `design-drift-loop` overstatement the loop doc corrected in v0.166.0,
  plus a *"(Future: … lands in v0.23)"* for a hook that shipped in v0.145.0. The correction landed in
  the loop doc and never in its twin. **Method: when you correct a claim, `grep` the string.** The
  copy in always-on agent context is the one that matters most.
- ✅ **ALL SEVEN PARTS SHIPPED** (Ajesh, same session: *"we are gonna finish all the pieces today"*),
  on one branch, merged. **One new loop and NO new verbs** — every other part was a rung move, a
  composition, or an edit to a surface that already existed. The shipped skill count is unchanged.
  · **2 (v0.277.0)** the guard watches all five token families, gated per-family on vocabulary
  (*no named tokens for a family, no opinion about it*) · **3 (v0.278.0)** `PATTERNS.md`, born in the
  first `/design-review` · **4 (v0.279.0)** the brand anchor becomes ONE `/decide` record ·
  **5 (v0.280.0)** `design-pattern-loop` — PRINCIPLE #1 pointed at design · **6 (v0.281.0)** the flow
  layer, authored in `/spec` · **7 (v0.282.0)** the prototype seam.
- 🔷 **Part 6 was written as HELD on the reasoning that it needed a new verb. It didn't.** The flow is
  authored in `/spec`, which already existed and already wrote the artifact it belongs in. **What made
  it look like it needed a verb was assuming the artifact needed a new home.** Worth carrying: that
  assumption is probably wearing other hats elsewhere in the backlog.
- 🔴 **FOUR corrections landed alongside, all one family — a claim outliving its mechanism.** The
  `design-drift-loop` overstatement in always-on agent context · `/design-review`'s stale "read the
  component directory" · the `capture` moment voicing extraction-loop's words at a design review
  (**found by running it, not reading it**) · `scaffold.test.js`'s design-doc invariant, whose body
  hardcoded one producer while its own name said *"some skill"*. **The method that found all four:
  when a fact changes, grep the string.**
- **The old part list, for reference:** guard past color · the pattern layer DOWN · design
  decisions become durable (route to `/decide`) · the learning loop (`design-pattern-loop` composing
  `/extract` + the manifest's near-duplicate count) · flows (HELD) · the prototype seam (a closer).
  Six refusals are carried from RVW-078/079/080/081/082 so they are not re-proposed.
- ⚠️ **This is craft-driven, not evidence-driven.** Nobody asked for it by using BOSS, and it does not
  outrank **publish + Phase 3 outreach**. EVID-001's adjacency warning applies to it like anything
  else: more surface ≠ more readiness.


### State (shipped, v0.273.0, 2026-09-10) — the in-project guide, and the vet that broke it

**`boss help --html`** — the whole guide as a page, scoped to the founder's own project. One flag on
a verb that exists; no new command, noun or skill. Mirrors `boss board --html`: read the stamp,
render, write to gitignored `.boss/`, re-run to refresh, **so it cannot rot**. Verified across a
rung — Quickstart renders `17 skills · 4 agents` with MVP dimmed; after `boss unlock mvp` the same
command renders `45 · 11`, the MVP group opens, and the *"— at MVP"* annotations in the wayfinding
map **disappear on their own**.

**`web/quick-guide.html` is absorbed and deleted.** Its three parts are now the guide's wayfinding
map, command table, and a new complete index (all 48 skills, every rung, folded except the one
you're on, `·` marking what you don't have) — which shows install state, the thing a web page
structurally cannot do. `web/index.html` was also reordered outcome-first and `guide.html` had a
**live wrong claim** fixed (`/pretotype` filed under MVP; it moved to Quickstart at v0.271.0).

#### 🔴 The vet found two defects in the release, the same day

A `/deep-research` pass (5 angles, 4 primaries fetched, 9 claims → 3 independent skeptics)
**killed 8 of 9 claims.** Two kills were BOSS's own mechanisms:

1. **`library/help/` shipped UNTRACKED.** 7 files on disk, `git ls-files` → 0, **all 7 in
   `npm pack`**. So the freshness comparison read a null git time and **could never fire**; a fresh
   clone has no `library/help/` so **`npm run check` fails for everyone else**; and the hand-written
   half existed on one machine. Found by the IDEA-087 method (`git ls-files` vs `ls`) on a directory
   whose README promised *"something is watching it."* **n=28.**
2. **`reviewed:` was decorative in `check-site.js` AND `check-help.js`** — three comments said
   otherwise. Both parsed it as a presence gate, then compared source-change time against the doc's
   **touch time** (`max(git, mtime)`), so **editing a page for any reason cleared the flag**. Now
   measured against the date, which surfaced `charter.html` — hidden until now.

Also: an untracked `covers:` path freezes a tripwire forever (`docs/loops` read `2026-06-20`
permanently) — now a hard finding; `check:site` gained **internal-link validation** (nothing had it,
and deleting `quick-guide.html` would have shipped two dead links in silence), including
`_shell.html`, whose brand link renders on every page.

**Two citations a documentation practice would have leaned on do not say what they are reputed to
say.** Diátaxis **does** address upkeep (*"documentation is also never finished"*) — the claim that
it doesn't was wrong. And *"paradox of sense-making"* is **not Carroll's**: it is the title of
Raymond S. Nickerson's 1991 review of him, and the openly-readable PDF circulating under Carroll's
book title **is that review**. Minimalism originated Carroll **1984** (*Datamation*), not the 1990
book; the documentation extension is **van der Meij** & Carroll 1995.

**Verdicts:** RVW-096 ADAPT (uncertainty-gated context → sharpen `context-discipline.md`, not a new
file). **RVW-097 NOT-YET** on shipping a documentation practice — n=1-day, both load-bearing parts
were defective, largely duplicates `documentation.md` which already refuses a doc generator by name,
and adds founder surface under the subtract mandate. Re-open conditions written.

**`documentation.md` §7 refreshed** — its provenance flagged the llms.txt claim as *"the
fastest-moving thing in this doc"* and it was six months stale. The read-commitment caveat survives;
the adoption evidence is now verbatim from the primary (v2, 10 Aug 2026, Lighthouse audits for it).

**IDEA-089 filed, `deferred`** — *documentation should grow with the app, and its outward half
doesn't grow at all.* Measured: inward docs Quickstart 4 → MVP 3 → **V1 0 → Scale 0**; outward docs
**0 at every rung**; loops 5 → 13 → **1 → 0**. The whole ladder flattens after MVP. Fix is ONE seed
at the ship moment as a loop (`hasShipped()` + README unchanged since scaffold), never a 49th skill.
Held on n=0 + EVID-001's adjacency warning: the thin top of the ladder is discipline, not neglect.

#### Open

1. **npm — yours, and now unblocked.** npm 0.268.0 vs repo 0.273.0 (5 unpublished); tap 23 behind
   npm (`npm run bump:formula`). Everything else in `npm run release` is green (367 tests, 153/0
   eval gate).
2. **The website is only HALF re-aimed.** `index.html` + `guide.html` are done and `quick-guide` is
   gone (15 → 14 pages). **The two-door IA and the decisions hub are NOT built** — that was step 2
   of the agreed sequence and the help build + vet took its place. 11 pages still trail their
   `reviewed:` date, now honestly measured.
3. **The live site is still ~36 releases behind** (pre-v0.237.0, no generator stamp). Deploy is yours.
4. **IDEA-089's re-open trigger** — the first founder who ships and then asks about their README.

### State (shipped, v0.272.0, 2026-09-09) — the one-pager, and Building went 7 → 1

Committed `3f8a8e2`; **pushed 2026-09-10**. Two halves, both from working the `Building` column.

**`/canvas --frame onepager`** — FEAT-025's rung 2, built as a **fourth projection, not a fourth
verb**: frames are prose in the canvas skill, so it is one file, zero commands, no code. Chosen over
the `boss case` CLI the FEAT named (Ajesh picked the frame shape). Gated on ≥1 `EVID`; with none it
refuses the page. **Dogfooding it against BOSS's own canvas caught a defect in its own spec** — the
first ledger read *"eleven claims; three rest on a graded record"*, and **M is produced by deciding
what counts as a claim**, so forgetting one raises the backed fraction. Countable facts only now.

**Board honesty: `Building` 7 → 1** (FEAT-025 alone, which is also *on now*; a FEAT can only leave
Building by shipping). `check:backlog` caught all six `INDEX.md` rows immediately — the gate works.
→ `shipped`: IDEA-060, IDEA-057, IDEA-031. → `deferred` with triggers written: IDEA-047 (waits on
your deploy), IDEA-055 (an OBSERVED session), IDEA-059 (a real post-ship signal or a project at V1).

🔴 **The pattern under all five, worth keeping:** *a card in `building` is the only board state
nothing verifies.* `check:backlog` compares record↔index; `recordDrift` compares a `shipped` claim to
disk; **neither asks whether a card claiming to be in flight has anyone in flight on it.** Three
separate staleness shapes were sitting there: a status line two items behind its own build order
(IDEA-060), an Open item contradicted by the record's own `proof:` file (IDEA-057), and a dead proof
pointer that `recordDrift` structurally cannot see while status ≠ `shipped` (IDEA-031).

#### Open

1. **npm — yours, and it is the ONLY red gate.** npm 0.268.0 vs repo 0.272.0 (4 unpublished); tap 23
   behind npm (`npm run bump:formula`). Everything else in `npm run release` is green.
2. **13 site pages trail their `reviewed:` date** and the live copy has no generator stamp (~40
   releases behind). Both yours — the website is under a standing do-not-touch.
3. ✅ **Both pushed 2026-09-10** (`b5e3793`, `3f8a8e2`) — they had sat unpushed since 2026-09-09.

### Older State windows — archived 2026-09-10

**7 State sections (v0.261.0 → v0.271.0) moved to `RESUME-ARCHIVE.md` *(folded into this devlog 2026-09-12; link removed)*, in full.** Not summarised, not deleted — the file is on disk and its line count is verifiable. This happened because `npm run release` flagged this file at **671 lines** against its own *~400-line* threshold.

⚠️ **`registry/CHANGELOG.md` is the canonical per-version record and always was.** If the archive and the changelog ever disagree, the changelog wins — it is tracked and committed; this file and the archive are both gitignored, which is how ~600 lines were lost on 2026-09-09.

### State (shipped, v0.296.0 → v0.302.0, 2026-09-11) — the first CI, Windows, exec-form hooks, the plugin

- **v0.300.0 — exec-form hooks.** Shell form runs via PowerShell on native Windows without Git Bash,
  where `$CLAUDE_PROJECT_DIR` is undefined → the conscience silently never fired. Both hooks are now
  `"command":"node","args":["${CLAUDE_PROJECT_DIR}/…"]`; `HOOK_MIGRATIONS` swaps the old line on
  `/boss-sync`; `hookKey()` = command + args for merge/removal. **Verified**: both hooks instrumented,
  one `-p` turn on Claude Code 2.1.236, both fired. Floor 2.1.139. Ajesh's Homebrew cask was 2.1.132
  → upgraded to 2.1.236. His stale global `oyeboss` (0.237.0) re-linked from the checkout.
- **v0.302.0 — the plugin ([[DEC-017]]).** `.claude-plugin/plugin.json` + `marketplace.json` (repo
  root as `"./"`), `plugin/skills/welcome/` → `/boss:welcome`, `bin/` on Claude's PATH. No hooks,
  no agents, no settings in the plugin — the substrate stays per project. Release gate checks
  `plugin.json` version = `VERSION`. README has the `/plugin install boss@bossbuild` path.
- **`/comp-eval`**: `docs/competition/superpowers.md` (adjacent — craft half, ★285k, fourteen hosts
  from one repo, no venture) + `claude-plugin-field.md` (2,282 community plugins keyword-scanned; the
  founder niche is a graveyard of one-shot pipelines at 0–33★; haytham retired 2026-07; study
  product-discovery's REAL/SYNTHETIC/INFERRED evidence rung). Method holes named in the file.
- **Peer session** shipped v0.299.0 and v0.301.0 (design-system) in the same hours; the version
  handshake worked — both sides re-read `VERSION` and renumbered. Nothing was clobbered.
- **v0.307.0 (2026-09-12, the design session) — the design-system tooling field.** Nine tools read at
  source (`docs/competition/design-system-tooling.md`); three already had verdicts (RVW-079/081/082),
  unchanged. **impeccable** (★67.5k, `frontend-design`'s successor) ships the executable anti-slop
  detector §7b of the build-craft watchlist asked for a day earlier — now tap 1's third source.
  `/design-tokens-init` step 0 reads a `DESIGN.md`/`PRODUCT.md`/`MASTER.md` a founder arrives
  carrying (RVW-079 condition #2, now ordinary); `/ux-check` names the runners for its *not checked*
  rows; `/design-library` defers to Storybook MCP's index where present. **Open, not built:** run
  `npx impeccable detect https://oyeboss.build` on BOSS's own site as the first execution of tap 1 —
  cheap, and it would say whether BOSS's tokens pass somebody else's tells list.
- **v0.308.0 (same session) — governance and the shape of UI code.** Ajesh redirected: *not
  templates — governance, scaling, documentation, drift, and how UI code is organized.* Read at
  source: Primer contributor docs + ADRs, zeroheight DS Report 2026 (n=147), Omlet, DTCG 2025.10
  (`$deprecated` verified on the stable spec), Chromatic, FSD, bulletproof-react, Radix, Curtis.
  Seeded at MVP: index `Status` column (`deprecated → X`, replaced ≠ unused), one-directory-per-
  component, partials-are-components, one-way import rule in CLAUDE.md, component API floors,
  *behaviour from a primitive*, token `$deprecated`; V1 library prints on-system ratio + promotion
  candidates. **Deliberately not built:** the V1 ESLint boundary for the import rule (a filter
  until then — the practice says so), semver/RFC/CODEOWNERS (Scale, symptom-gated). **Caught:**
  v0.307.0 shipped 3 dead `[[RVW]]` citations because I grepped the gate's tail — read the exit code.
- **v0.309.0 (same session) — the boundaries behind v0.308.0's sentences.** Ajesh: *"implement
  whatever is needed for improving UI organization and practices."* New `ui-boundary-guard` (one-way
  imports, paths-not-syntax, JIT on `features/` beside `ui/`); `component-reuse-guard` reads
  `deprecated → X` and counts the boolean pile. 13 tests; exercised from a fresh scaffold. **Still a
  convention, not a check:** DTCG `$deprecated` tokens (the tokens guard reads the markdown doc,
  not `tokens.json`) — a separate change if wanted. npm is now 3 behind (0.306.0).
- **v0.311.0 (same session) — no vendor names in shipped text; `$deprecated` tokens checked; the
  tap run.** Rule recorded in `design-system.md` *Leverage or own*: skills/templates/agents name
  the CLASS, the practice names the tools with a date. `design-tokens-guard` reads the tokens doc's
  `## Deprecated` table. ✅ **CLOSED v0.313.0 — BOSS's own site failed its own tells, and was fixed at the
  source** (see the State section for v0.313.0 below). The detector stays a tap via `npx`, never a
  hook or dependency in BOSS's tree.
- **⚠️ Peer handshake (2026-09-12 evening):** the peer's uncommitted `smoke-guard` release is
  numbered **0.310.0** in the working tree and sits *below* my committed 0.311.0 in the CHANGELOG.
  VERSION is 0.311.0. Peer: renumber to 0.312.0, move the entry to the top, re-run gen:docs/gen:site.
  Count claims in PATTERNS.md/dogfood.json read 429 (their 7 + my 3 on 419) — correct once both land.


- **[[IDEA-095]]** — `npm test` had **never been run on a clean checkout**; it fails at step one there
  (`check-refs` → gitignored docs, `check-dogfood` → `.boss/`) — that is IDEA-087's door, not CI's.
  So: `npm run test:ci`, `npm run smoke:cli`, `.github/workflows/ci.yml` on ubuntu/windows/macos ×
  Node 22/24. **Three runs the same day: 22 red → 1 red → green ×6.** What the matrix found that
  reading had not: CRLF checkouts blinded both frontmatter parsers and 32 line readers (v0.297.0);
  `expandGlob` matched a `/`-regex against `\\` paths; **three release gates (`manifests`,
  `wayfinding-drift`, `freshness`) guarded `main` with a URL-vs-argv compare that is never true on
  Windows, so they had exited 0 without running** (v0.298.0 + a test that refuses the idiom).
  README + site now say *macOS, Linux, Windows*. ✅ npm needs ONE publish (0.298.0) to cover all three.
- **[[IDEA-096]]** — BOSS runs at full strength inside Cursor / VS Code / JetBrains via the Claude Code
  extension (Claude's docs: *Install for Cursor*, verified). Copy shipped in README + three web
  sources. Nothing else built; plugin-marketplace is an open design question in the record.
  [[IDEA-006]] got a dated correction: Cursor now has hooks (host-half of its trigger met; founder-half
  n=0; stays parked).

### State (shipped, v0.313.0 → v0.314.0, 2026-09-12) — the site, the shipped guide and the board, measured against their own floors

The first execution of build-craft tap 1 (a rendered-page design linter, pinned via `npx`, never
installed) returned **40 findings on oyeboss.build**; summed over all 17 pages plus the source scan it
was **low-contrast 114 · line-length 183 · undersized text 142 · ALL-CAPS body 30 · cream 17 · side-tab
10 · stripes 11**, and the rest. **After: every floor at 0 on every page and on `boss help --html`;
two advisories left, both decided in writing** (charter's hazard stripes stay; `Author — Work`
citation labels on credits and the CHANGELOG's own lines on whats-new are not rewritten).

- **Three root causes, not forty.** (1) `--slate` inheriting into `<code>` on `--concrete-sunk` at
  4.22:1 — 83 findings from one token pair; the same pair sat in `src/board.js`'s palette copy.
  (2) `--measure: 64ch` on *containers*: `ch` is the root zero, so a 14px line inside ran to ~100
  chars — **`40em` on the element is the rule that holds** (80 chars at any size). (3) `opacity` on
  SVG labels, which a pixel reader correctly calls invisible. **Fix the floor in the token, not the
  element.**
- **DEC-018 — the ground was cream.** `tokens.css` said *"cool poured concrete — deliberately NOT
  warm cream"* since 2026-08-19; the value was hue **43°** (the cream tell's own hue at 13%
  saturation) while the graphite half sat at **210°**. Light neutrals moved to 210°, `--bone` →
  `--chalk`, the comment now states the number, VISUAL.md keeps its wrong sentence with the
  correction beside it. Nothing had been pointed at the value for 24 releases. **A comment is a
  claim; run the arithmetic.** `decided_by: AI-suggested-ratified` on the strength of Ajesh's brief
  ("either it is not cream… or move it") — confirm or reverse.
- **The founder-facing copy was FURTHER from the rule than the showpiece.** `library/help/help.css`
  had its own warm-cream palette (`#f4f2ec`, 45°), white-on-hi-vis at 3.6:1, ALL-CAPS kicker /
  eyebrow / th, `opacity: .62`, inline `style=` in cells, and an eyebrow repeating the h2. All moved
  to the site's values (copied; the copy says so). Check the shipped copy before the website.
- **Chrome removed, not restyled:** the kicker above every h1 (17 pages), 34 `→` link suffixes, every
  `A · B · C` string outside real CLI output, `WORD — fragment` headings in the guide and four practice
  H1s, 3px hi-vis side-tabs (`--hivis-rule` → `--turn-rule`, 1px ink), hazard stripes 15 → 1.
  Em-dashes: index 79 → 18 (12 are CLI transcript), a real pass over every hand-written page, no
  global replace. The `.stencil` labels became real `<h2>`s, which fixed skipped-heading honestly.
- **Found and fixed on the way:** the skip link's dark-mode hover was chalk on chalk (real, tiny);
  `og.png` re-rendered from its recipe so the two agree; the brew command box can now shrink under
  ~390px. **Found, left, then done in v0.314.0 on Ajesh's "continue":** `boss board`'s HTML
  (kicker, uppercase 9.5–11px labels, a 3px tab on every card, opacity dimming, a middle-dot
  footer) got the same floors — detector on a fresh board returns nothing; and
  **`.claude-plugin/plugin.json` had sat at 0.306.0 through seven releases** because the
  `VERSION ↔ plugin.json` gate lives in `npm run release`, which nobody runs, and not in
  `npm run check`, which everybody does. `check:manifests` now carries it (strict = red).
  🔎 **Pattern for the checkers note: a gate in the wrong loop is a gate on paper** — anyone on the
  plugin install path was frozen at 0.306.0 and could not know.
- **Verification:** `npm run check` exit 1 on `check:published` only (npm 6 behind — yours);
  `check:deployed` red on the live site being behind (yours). 429 tests green. Detector re-run on all
  17 pages + a fresh `boss new` guide from `/tmp` (pruned).

### ✅ SHIPPED 2026-09-12 (v0.315.0 → v0.317.0) — the vet sweep, and what it turned into

*(Source: `docs/research/sessions/SESSION-2026-09-12-agentic-practice-since-the-harness-sweep.md` —
Ajesh: *"lets do a vet and see if there are any new ai agentic practices since we last checked."* Six
angles, nine primaries fetched, five load-bearing claims through a 3-skeptic panel; verdicts RVW-098 →
RVW-101. **No new agentic doctrine in the window, and none expected**; the finding came from the host
CHANGELOG, as the watchlist said it would. Ajesh took all four recommendations: retire the TodoWrite read ·
trim every description to ≤50 words · pairs read with proposals, no cuts · scripts filed as an IDEA, not built.)*

- ✅ **v0.315.0** — `task-hygiene` reads only the transcript's mtime/birthtime now (session ≥45 min, not a
  resume, nothing durable moved for that stretch); parses nothing; 9 tests, one proving garbage in the file
  changes nothing. `harness-engineering.md` seam rule gained its detection half (clock held). RVW-101
  citation on `context-discipline.md` (clock held); `sources.json` +1 row, 2605.29442 got its URL. The
  CLAUDE.md / `/vet` shelf sentences fixed — **local only, both files gitignored.** 428/428 tests.
- ✅ **v0.316.0** — 48 descriptions 3,654 → 2,274 words (~4.8k → ~3.0k always-loaded tokens), max 50 on the
  `split()` counter, gloss + `Usage -` kept, no `: ` in values; `DESCRIPTION_CAP` 700 → **420** B (max is
  399), `always-on-cost.test.js` follows. Docs + site regenerated. `registry/surface-freshness.json` was
  NOT regenerated — a regen drops a stale `comprehend` row and reorders; that ledger was already behind,
  separate concern, **found task below**.
- ✅ **IDEA-100** (recipe-shaped skills → scripts; `/log` pilot; file-don't-build) and **IDEA-101** (the
  distinctness read: one merge candidate, one sharpening, nine keeps) in `docs/ideas/`, INDEX rows added.
- ✅ **v0.317.0** — `/pretotype` ↔ `/prototype` first sentences name each other (47w/333B, 50w/305B).
  `registry/surface-freshness.json` regenerated in its own commit: five skills + three hooks had NO row,
  one `comprehend` row outlived its skill; new rows seeded from git last-touch, no existing date moved.
  Watchlist domain 1 gained the other-harnesses tap (Cursor rules, Codex/AGENTS.md, Copilot, GEMINI.md).
- 🔴 **`check:published` is red at 0.306.0 vs 0.317.0 — eleven unpublished.** Yours. Nothing pushed either.

*(The original findings, kept for the record:)*

- 🔴 **RVW-098 · ADOPT — Claude Code 2.1.268 stopped offering `TodoWrite`/`TaskCreate` on current models**
  (retained: Claude 3.x, Opus 4.0–4.7, Sonnet 4.0–4.6, Haiku 4.5; `CLAUDE_CODE_ENABLE_TODO_TOOLS=1` elsewhere).
  BOSS's `task-hygiene` moment (v0.293.0, IDEA-094 part 0; CLAUDE.md rule 3b) reads **only** `TodoWrite`
  blocks from the transcript — `task-hygiene.js:99-113`, no fallback, root copy identical — so on every
  default model it is **permanently silent and nothing can tell.** The hook's dated `HOST-VERSION-DEPENDENT`
  block listed two facts that could rot and not the one that did. Confirmed in the finding session's own
  toolbelt (Opus 5: no TodoWrite). **Tasks:** (1) DOWN — both hook copies: add the fact to the dated header,
  and make a zero-TodoWrite long session say *"can't see the list on this model"* rather than nothing;
  (2) UP — `harness-engineering.md` §"name the seam" gains its detection half (Ultraplan was the first
  instance; this is the second); (3) VERSION + CHANGELOG. **Open decision, yours (below):** retire the
  TodoWrite read · opt back in via the template's settings `env` (a host key BOSS then sweeps — the
  v0.218.0 cost) · or leave it silent and say so in the CHANGELOG.
- 🟡 **RVW-101 · ADAPT — Cai et al. (arXiv 2606.12231, preprint):** rule files grow by negative constraint
  after AI errors (77.78%, n=99 survey); repos hold formatting rules while devs rank architecture first;
  compliance 49→72% after updates (**before/after, no control**). **Task:** one `[EVIDENCE]` citation +
  one clause on `context-discipline.md` move #1, `sources.json` row. **No rule-evolution section**; the
  freshness clock does not move.
- ⚪ **RVW-099 · NOT-YET — Galster et al.** (skills/subagents rarely adopted; skills are prose). Measured
  locally: **48 shipped skills, 0 executable scripts** (12 carry markdown/HTML templates; BOSS's executable
  half is its hooks). Same re-open condition as the parked tool-surface item: the `/skill-doctor` number.
  "First population study" was killed — arXiv 2511.09268 (328 CLAUDE.md files) predates it by 3 months.
- ⚪ **RVW-100 · REJECT — Shopify back to native** (2026-09-10): n=1 self-published decision, no
  measurement, and BOSS holds **no** mobile-stack position to revise (grep: zero). ⚠️ The first fetch
  summary of the article **fabricated two quotes**; only *"agents can now do enough of the implementation,
  translation, testing, and review work that it's no longer the deciding factor it was in 2020"* is real.
- 🔴 **Killed from the 2026-09-08 session:** its C1 *"Anthropic's engineering blog published nothing since
  April"* — `How we contain Claude across products` is dated **2026-05-25** on the page (the index shows it
  *Featured*, undated), and BOSS had **already vetted it in June** (RVW-044, ADAPT). RVW-044 carries no URL,
  which is why nothing in the repo could refute the claim. **Tap lesson:** a featured slot hides the date.
- **Held, not vetted:** the RubyGems agent attack (rubyhack.ai, 2026-09-11; ~2,000 packages, RCE via the
  doc-build pipeline's `.yardopts`; attribution to OpenAI is the authors' *inference*, unconfirmed) → an
  event for the agent-security sweep (2026-11-09). Inbox: `rubygems-agent-attack-2026-security-event.md`.
- **Docs-accuracy found task:** CLAUDE.md's repo map and `/vet` step 2 name `library/agents|skills|hooks|
  memory-seed/` — **none exist on disk** (`library/` = README, deceptive-patterns.json, help/, practices/,
  sources.json). Fix the two sentences; do not create the directories.
- **Instrument to add to the watchlist:** `claude plugin eval` (host 2.1.269) — a scored, reproducible eval
  suite for a plugin, and BOSS ships as one. Sits next to `/skill-doctor`. Also worth one line at the next
  `/recalibrate`: `effort:` frontmatter on skills/subagents is now honoured on pinned-effort models (2.1.267).

### 🟢 NEXT TASKS — after the engineering + PM read (2026-09-12, v0.312.0)

*(Source: `docs/research/sessions/SESSION-2026-09-12-engineering-and-pm-as-a-system.md` — six
primaries at source, every claim grepped against `stages/` first; 15 of ~18 already held. Ajesh:
*"ok lets go"* on the four-item shipment. The rule this read produced: **the two gaps had one shape —
BOSS held the rule and shipped no runner** — and both sat on the engineering/PM side, where the last
month's enforcement work had not gone.)*

1. ✅ **`smoke-guard`** — SHIPPED v0.312.0. Dormant `Stop` hook; runs `.boss/smoke.json`'s command once
   per turn that touched source, green in one line, red handed back once (`stop_hook_active` is the
   loop guard). 7 tests; driven red → silent → green → docs-only from a real `boss new` + `unlock mvp`
   scaffold, pruned after. `/smoke` plants strict typecheck + formatter at its first run and offers
   the guard once. Practice + engineering page name the runner.
2. ✅ **`/spec` step 0b asks for `program:`** — SHIPPED v0.312.0. The idea → initiative rung shipped in
   IDS.md since v0.199.0 with no verb offering it.
3. ✅ **The four crafts meet on the FEAT, written down** — the writes/checks/holds table in the FEAT
   template header + one sentence on the site index (edited in `web/`, the SOURCE — `site/` is build
   output and `gen:site` overwrites it; learned twice this session).
4. ✅ **Beads** filed `watch` (`docs/competition/beads.md`) — the Radar's *agent-native project memory*
   category; study `ready`, don't adopt the graph.
5. 🟡 **`/vet` Cagan's 2026-09-11 retraction #2** — *"teams over-invest in validating problems… when a
   product fails it's almost always because the solution just wasn't good enough."* It rubs against
   the conscience's validation nudges; `/prototype`'s build-first is the partial answer. A verdict,
   not a flinch. Inbox it first.
6. 🟡 **Watchlist has no row for the project/PM rung** (`planner`, `boss board`, `program:`,
   `feature-context.md`): domain 13 owns the record, nobody owns *sequencing*. Add on next revision.
7. ⚪ Seams named, NOT-YET: rework rate / first-pass acceptance as a `/judge-traces` header line
   (substrate is `.boss/trace.jsonl`; team-level only, never per-person — Scale rule 4) · `blocked_by:`
   → a derived `ready` column, if a real project asks · agent topologies (Scale, trigger-gated).

**Above all of these, unchanged: publish (npm at 0.306.0, eight behind) and Phase 3 outreach — both yours.**

### 🟢 NEXT TASKS — the comp-read batch (Ajesh, 2026-09-11) — build in this order, after the list is complete

*(The first engineering-shaped list since the 2026-09-09 consolidation. Source: five founder plugins
read at file level — `docs/competition/founder-plugins-source-read.md`. Ajesh: approved 1, 3, 4;
asked for the design on 2; reframed cross-project sharing as passive — which already exists.
**Rule for the batch: "wait first to come up with all the tasks… then start building."** Add to
this list before touching a skill.)*

1. ✅ **IDEA-097 — founder intent at intake — SHIPPED v0.303.0** (same day). Question in `/boss`
   3.5, `motivation:` + `success_looks_like:` on the IDEA doc, five readers (conscience rung ·
   `boss status` *Toward:* · `/canvas` branch · `/consult` context · `/interview` commitment shape),
   the interpretation line in step 2. 7 tests; `/tmp`-verified. **Not yet published to npm (yours).**
2. ✅ **IDEA-098 — `/consult` movement round — SHIPPED v0.304.0.** Step 3.5 + the *what moved* line.
   Dogfooded on IDEA-099's split; both sides moved. **Gate leg 2 is Ajesh's: did the movement line
   beat the plain split?** (Both are in IDEA-099's "The board's read".)
3. ✅ **IDEA-099 — the door hears the idea first — SHIPPED v0.305.0** (Ajesh: *"build"*). Step 0 of
   the ladder: `/boss:welcome` asks *what are you building*, reflects via the shipped `/boss`
   `## 2. Shape it` heading (pointer gated by `check:manifests`), offers once, **writes nothing**.
   `--idea` deferred with its spec. **Measure:** corrected the reflection · said go · second session
   in 7 days. Falsifier: a founder stalls at the post-restart retype → build `--idea` that day.
   Standing cheaper move (mentor-founder): **EVID-003's *did you come back?* — still unasked, yours.**
4. ✅ **The `/retro` question — MEASURED** (`docs/retros/2026-09-11-never-run-skills.md`, v0.306.0):
   22 ran · 11 rung-not-reached · 5 superseded-on-self · **6 should-have** · 4 unknowable. Sunset
   nothing. 🔴 **Two dogfood gaps it found: `.boss/brain/` does not exist here (run `/read-repo`), and
   `/drift-deep` has never been run on BOSS.** Both are next-session actions, neither is a build.
5. ✅ **Two citations landed** (v0.306.0): haytham ADR-026 → `harness-engineering.md`; ADR-023 →
   `testing-with-agents.md` rule 7. Source in `sources.json` with URL.
6. ✅ **10x→2x paragraph** in `mentor-founder` (v0.306.0).

**Batch complete — six of six.** Three releases unpublished (v0.303–0.306; npm at 0.295). Publish is yours.

Parked, with unpark conditions written: assumptions-plural in `boss status` · `waiting_on:` ·
cohort re-fit from records (propose, never apply) · time-per-task-type · the concept-anchor grep
(measure first). All in the competition record's ranked table.

### 🔷 DECISIONS WAITING ON AJESH — all work done, each is a yes/no

*(Consolidated 2026-09-09 from five sections — Carried forward, the Work Order, Captured-not-built,
Next tasks, Open decisions — which between them held 3 closed items, 2 duplicates and 1 stale premise.
The closed and captured detail moved **in full** to `RESUME-ARCHIVE.md`. **Nothing engineering-shaped
remains: every live item below needs a human.** That is the state, not a gap in the list.)*

- **🔷 IDEA-101 — one per-pair call left (2026-09-12):** the altitude read is DONE and it **reversed the
  direction** — at a founder's rung UP cannot happen (`/boss-learn` step 2a says so itself; `src/learn.js`
  stops without a checkout), so the merge is **`/boss-learn` → `/extract`**: `/boss-learn` leaves the L0
  template for the root-only internal set (with `/vet`, `/deep-research`…), `/extract` gains the
  checkout-aware `boss learn` branch, `/practice` untouched. **Yes / no / after `/skill-doctor`**
  (recommended: after — reasoning done, number not). (`/pretotype` ↔ `/prototype` cross-reference:
  ✅ shipped v0.317.0.) **The instruments are still yours:**
  `/skill-doctor` in a scaffolded MVP project, and `claude plugin eval` against the plugin — they close
  RVW-099 and the parked tool-surface item either way.
0. 🔷 **Submit the plugin to `claude-community` — your form.** BOSS is a Claude Code plugin as of
   v0.302.0 (DEC-017: *the front door, never the body* — one skill `/boss:welcome` + `bin/` on
   PATH; the incubator still arrives per project). `claude plugin validate . --strict` passes.
   Console form: platform.claude.com/plugins/submit. ⚠️ `boss-ai-agent` already exists there and
   does chase-reminders — the first line of the submission should say what BOSS is *not*.
   ✅ Exec-form hooks: decided by your "move to 2.1.139", shipped v0.300.0, verified on 2.1.236.
1. ⛔ **`npm publish` — HELD BY YOU.** npm at 0.295.0 vs repo 0.302.0, **seven behind** (one publish covers all). Then
   `npm run bump:formula`. Everything shipped since is unreachable by founders until this runs.
2. 🔴 **[[IDEA-087]] — un-ignore `docs/`. A one-way door (Principle 5).** Detail + measurement in the
   frontmatter. Short version: **zero** secrets/home-paths/emails found in `docs/research/verdicts/`
   (96 files, 552K), and un-ignoring it alone resolves **27 dangling `[[RVW-nnn]]` links** in the
   tracked CHANGELOG. Supersedes the old "RVW ledger has no git history" bullet, which was the same
   defect stated smaller. 🔴 **This decision now has TWO demonstrations, not an argument:**
   `.boss/conscience-log.jsonl` (2026-08-21) and `RESUME-ARCHIVE.md` (2026-09-09) were both destroyed
   and both unrecoverable **because they were gitignored**. The cost of "private by default" has now
   been paid twice in three weeks.
3. 🔷 **Phase 3 outreach — human-only, and nothing blocks it.** Three maintainers chosen
   (`justinabrahms/agent-chat` · `hschne/puny-monitor` · `williamsharkey/shiro`), both messages
   drafted, in [`evidence/CANDIDATES-2026-08-23-maintainer-experiment.md`](evidence/CANDIDATES-2026-08-23-maintainer-experiment.md).
   🔴 **The first message must not mention BOSS** — leading with the tool reproduces EVID-001's weak
   `stated-pain` grade. Metric: Activation, **watched not asked**. ⛔ **No features from this.**
4. ⬜ **Work-order 2b — PREMISE WAS STALE; restated 2026-09-09 and now bigger than it looked.** It
   claimed the site still says *"tell a real business from a convincing demo."* **It does not** — both
   `web/index.html:16` and `site/index.html:52` have read *"a thing people actually need"* since
   v0.215.0. What actually remains is **`venture` as BOSS's default noun for what a founder builds**:
   19 shipped template files, plus the artifact path **`docs/venture-brain.md`** (5 files, 2 of them
   in `src/`+`stages/`). **That is a rename with a migration cost for existing projects, not a copy
   edit** — which is why it kept being re-proposed as though it were cheap. Decide: rename · leave ·
   or accept the asymmetric cost a fourth time and **stop proposing it**.
5. ⬜ **The seven `building_since:` dates — computed, and the computation argues against itself.**
   Using your own offered fallback (first CHANGELOG version mentioning each): FEAT-025 → 2026-08-20 ·
   IDEA-031 → 2026-06-20 · IDEA-047 → 2026-08-20 · IDEA-055 → 2026-07-23 · IDEA-057 → 2026-08-19 ·
   IDEA-059 → 2026-08-20 · IDEA-060 → 2026-08-20. 🔴 **Four of seven land on the same day**, so the
   fallback is clustering on a CHANGELOG batch rather than finding when work began. And
   `src/board.js:351` sets `ageSource: 'authored'` **the moment the field exists** — so writing a
   derived date makes the board claim provenance it does not have, which is the exact class of bug
   this repo keeps catching. Options: supply real dates · accept these knowingly · leave empty and
   let the board say `derived`.
6. ⬜ **Cloudflare re-deploy — and the staleness now has a DATE.** Repo is ready and
   `check:site --strict` passes. The upload artifact (`site.zip`) was hand-zipped **2026-08-24**, so
   unless it was rebuilt outside this repo, **the live site is roughly forty releases behind.**
   **Waits on an explicit yes.** Rebuild the artifact with
   `cd site && zip -r ../site.zip . -x '.*' -x '__MACOSX/*'` — there is no script for it, and the old
   one was a Finder zip carrying `__MACOSX` cruft. 🔴 **Durable rule, learned by breaking it three
   times: never describe the live site from this file — grep the repo, then open the URL.**
7. ✅ **`site.zip` — RESOLVED 2026-09-09.** Ajesh: *"can be deleted, it's only used to upload to
   Cloudflare."* Deleted, and **added to `.gitignore`** with the rebuild command in a comment — it is a
   deploy artifact, not source, and being untracked is why it kept resurfacing as a thing to ask about.
   The work order's *"ask before deleting"* note is retired with it.
8. ⬜ *Optional:* scrub the old `registry/projects.json` (home path + `margin`) from git history.
   Removed going forward at v0.7.0; only matters if the public history bothers you. Needs force-push.

### Held — not decisions, and each has a re-open condition

**These are parked deliberately. Do not build them; the condition is the whole point.**

- **[[IDEA-076]] — position WITHIN a rung.** `renderLadder` shows four mode names and never where you
  are inside one, which is where a founder spends weeks. **Defect verified mechanically; demand is
  `stated-pain` only.** The obvious cure is a dark pattern BOSS already catalogs — *a progress surface
  that cannot go down is a comfort device*. **Re-open on an OBSERVED session, not a third statement.**
- **[[IDEA-075]] — the scaffold has no way down.** BOSS ships one of scaffolding's three defining
  characteristics; `boss unlock` says *"Additive — nothing is ever removed."* **n=0 demand, and two of
  three signals asked for MORE presence, not less scaffold.** Cheapest move is not a build: add one
  question to EVID-003's three — *"anything BOSS gave you that you've stopped needing?"* Full
  detail, including the ⚠️ attribution trap (Wood/Bruner/Ross 1976 has no withdrawal step; fading is
  Collins 2006), is in the archive.
- **Tool-surface economy** — `docs/research/inbox/tool-surface-economy-has-no-practice.md`. **Deliberately
  unvetted:** its verdict needs `/skill-doctor` **run** against BOSS's 45-skill MVP surface first, and
  that is yours to run. Vetting it without the number would repeat the mistake v0.261.0 was written to
  prevent.
- **`/practice-refresh` stays boundary-`not-yet`** — re-open when a real project passes ~10 PRACs **and**
  one is found stale in practice. (`not-yet` is 2; the rest of that list resolved at v0.235.0–v0.237.0
  and moved to the archive.)
- **Standing, from v0.175.0: confirm the altitude before analysing.** BOSS is self-hosted, so *BOSS's own
  practice* and *what BOSS ships a founder* are the same file and look like the same question. Answered
  at the wrong altitude twice in one session; both catches were Ajesh's.


### Prompt for the next session
> **Keep this evergreen.** A pointer + procedure, never a status report. Status lives in *State*
> above. If you find yourself writing "we're at v0.X" here, delete it and trust the rest of the file.

> Continue BOSS (in `~/Projects/bossbuild`).
>
> **Read first, in order:** `docs/RESUME.md` (this file), `CLAUDE.md`, `PRINCIPLES.md`. Then
> `VERSION` + `registry/CHANGELOG.md` for what just shipped. **Cross-check freshness:** `git log -3`
> against what RESUME claims — if they disagree, RESUME is stale and you re-read after
> re-establishing ground truth.
>
> Then pick up **🟢 NEXT TASKS — the comp-read batch** in order. If something at the top looks
> already done, scan recent commits + CHANGELOG before assuming the list is current.
>
> **Per capability shipped:** `npm run release` must pass (it checks VERSION↔package.json, the
> generated docs, wayfinding, the eval gate, and the docs' own claims about the gate) → add a
> `registry/CHANGELOG.md` entry → update *State* + *Next tasks* here → `/tmp`-test the CLI and prune
> those entries from `~/.boss/registry.json` → commit with the GH noreply env-var (never global
> config) → push when asked.

### Working reminders
- 🔴 **`npm run release` is not optional, and a red gate is not a suggestion.** v0.228.0 found
  `package.json` six versions behind `VERSION`, committed, over a gate that checks exactly that. The
  tell was two *generated* docs (`CHEATSHEET`, `SKILLS`) frozen at the same old version. **If a
  generated file's version stamp disagrees with `VERSION`, the gate has not run — go look before you
  do anything else.**
- 🔴 **Verify with `npm run check` — never hand-roll a loop over `npm run check:*` exit codes.**
  `manifests`, `site` and `wayfinding-drift` print errors and **exit 0** without `--strict`, so a
  hand-rolled loop reads real failures as passes. (Learned the hard way in v0.196.0; `release.js`
  always passed `--strict`, so the release gate was never the thing at risk — the *session's own*
  verification was.)
- Commit with GH noreply env-var (never global config): `NR=$(gh api user --jq '"\(.id)+\(.login)@users.noreply.github.com"')`.
- After CLI changes: `npm i -g ~/Projects/bossbuild`, test in `/tmp`, prune `/tmp` entries from `~/.boss/registry.json` (registry is machine-local now, not in the repo).
- Keep `VERSION` and `package.json` version in sync. `npm run pack:preview` to confirm only the package ships.
- Every capability: VERSION bump + `registry/CHANGELOG.md` entry + update this RESUME.
- 🔴 **Never open a file for writing before you have finished reading it.** `open(p,'w')` truncates on
  open, so `open(p,'w').write(x + open(p).read())` reads as *prepend* and **is** *truncate*. Read fully,
  close, then write. This destroyed `RESUME-ARCHIVE.md` on 2026-09-09; it is a shape to recognise, not
  a lapse of care. Same rule for any gitignored single-copy file: **git will not save you there.**
- **`npm run release` before every release.** It exists because the checks that already existed were
  wired to nothing for 56 releases. Advisory notes (context budget, this file's length) are reports,
  not gates — but read them.

## 2026-09-12 (RESUME-ARCHIVE.md — folded in verbatim and retired, IDEA-102)

> The archive was a second gitignored single-copy history file beside this one, and it was destroyed once (2026-09-09).
> Its surviving content, in full, headings demoted one level. There is no archive file any more; history is here, releases are in the CHANGELOG.

<!-- moved from docs/RESUME.md 2026-09-10 — seven State windows (v0.261.0 → v0.271.0), in full
     and not summarised, because `npm run release` flagged RESUME at 671 lines against its own
     ~400-line threshold: a read-every-session doc past that stops being read.
     The canonical per-version record is and always was registry/CHANGELOG.md. -->

### State (shipped, v0.271.0, 2026-09-09) — the demand test was behind the build unlock

Committed `b5e3793`, **NOT pushed** *(true when written; pushed 2026-09-10)*. Came out of a board review: of 7 `Building` + 9 `Captured`,
almost everything is held on its own written n=0 gate, blocked on you, or already shipped with a
stale record (**IDEA-071 reads as open and was resolved at v0.218.0**; **IDEA-060's status line says
*"items 1-4 done, 5-7 open"* when it is 1-5 ✅, 6 superseded, 7 gated**). The one live, unblocked
item was buried in IDEA-060 as *"Open, and the more important half."*

**`/pretotype` and `pretotype-loop` moved L1 → L0.** The loop's entry predicate reads
`docs/ideas/*-canvas.md` — a Quickstart artifact — and `/canvas`'s graduation moment invites the
pretotype by name, while both loop and runner shipped at MVP. The skill contradicted itself two
paragraphs apart (*"In Quickstart the riskiest assumption isn't sharp enough yet"* directly above
*"an IDEA has a `/canvas` with a real riskiest-assumption line"*, which is the Quickstart gate).
**A MOVE: 16→17 / 29→28, total unchanged at 45**, IDEA-084's cliff one verb shorter. `/landing` and
`/ship` stay at MVP — they make a page you intend to keep, and keeping is a build. Both migration
paths were WALKED: MVP sees zero diff (the stamp is a flat union across layers), a pre-move
Quickstart project gets `+ new`. No supersedes entry — nothing left the union.

#### 🔴 The eval gate had been red for three releases, and v0.269.0 + v0.270.0 shipped over it

`npm run eval:gate` was **146/6**, identical at clean `HEAD`. Cause: **v0.268.0's own `min_files: 3`
fix**, which was correct and **shipped with no test that could see it** — so it silently inverted all
six `should-fire` fixtures (each styling in ONE file) and there was no `should-not-fire` case for the
single-file generator the bar exists for. Fixed: six cases now spread across three files;
**`m-coh-105` is that missing regression test**, verified by deleting `min_files` and watching it be
the only failure. **153/0.** Four tracked `152` claims re-stamped.

> **The v0.228.0 lesson repeating verbatim: a red gate is not a suggestion.** Two releases passed
> over it. `npm run release` is the only thing that reads the eval gate — `npm run check` does not.

#### ⚠️ Concurrency artifact, worth knowing about

**v0.270.0 as committed is internally inconsistent**: its manifests have `pretotype` at MVP while its
own generated `docs/CHEATSHEET.md` + `docs/SKILLS.md` list it under Quickstart. The peer session ran
`npm run release` while this session's manifest edits sat uncommitted in the shared tree, so
`release.js` regenerated from in-progress work and that got committed. **Harmless and now resolved**
(v0.271.0 makes the manifests match), but it is the RESUME warning firing in the *other* direction:
not "don't run release.js to check someone else's tree" but "someone else's release will pick up your
uncommitted work." Nothing to fix; do not try to rewrite `08bd6a6`.

#### Open

1. **npm — yours.** `check-published` is now the ONLY failing gate: npm at 0.268.0 vs repo 0.271.0
   (3 unpublished), and the Homebrew tap 23 behind npm (`npm run bump:formula`). Everything else in
   `npm run release` is green.
2. **Not built, correctly:** `/landing` + `/ship` stay MVP-only, so a Quickstart founder still cannot
   put an *in-repo* page in front of anyone. That is IDEA-060's remaining half and it is the right
   outcome, not an omission.
3. **Observed, not fixed:** `computeConfidence` reads `count / min` only — spread gates entry but
   never raises confidence. Noted in `m-coh-002`'s `why:`; moving a confidence curve is not a passing
   change.
4. **Board honesty is the next cheap pass.** IDEA-071 and IDEA-060 both read as open work that is
   done. BOSS ships `/revalidate` for exactly this and has never run it on its own board.

### State (shipped, v0.268.0, 2026-09-09) — IDEA-088 closed: BOSS ran its own conscience

`boss sync --apply --keep-mine` installed 85 files and left all **8 dev-workspace agents/skills
untouched** (`mentor-founder`, `prompt-coach`, `mentor-architect`, `mentor-customers`,
`mentor-capital`, `designer`, `boss-sync`, `boss-learn`). Two stale hook libs and three stale loops
were refreshed by hand — verified stale copies of BOSS's own source (3 and 2 unique lines), not dev
forks — then re-synced so the ledger records them. **`.boss/managed.json` now exists for the first
time**, which mattered beyond sync.

**Three shipped bugs in five minutes, none findable from inside `stages/`:**

1. **`design-tokens-loop` fired at HIGH confidence on a zero-dep CLI.** All 52 matches were in ONE
   file — `src/board.js`, which *generates* an HTML board — while the moment said *"several files
   styling by hand"*. `count_at_least` counted **occurrences**; the claim was about **spread**.
   Added an optional `min_files` bar (additive) + `matchedFiles` reported apart from files read.
   **A shipped false-positive class** — any repo with one report generator or mailer tripped it.
2. **A loop cross-link that only resolved before installation.** `../../../../` escapes a real
   project; every MVP project has carried a dead link. De-linked per the v0.263.0 rule.
3. **`check-boundary` inverted** — 48 installed product files read as unruled workspace artifacts
   (27 → 75). Now reads the managed ledger, which only existed because of step 1.

**And it was right about what it is for.** Re-entry opened with *"back after 19 days away"* — that
is **54 commits with no `docs/devlog.md` entry**. BOSS ships *"devlog every session"* as MVP rule 3
and does not follow it. The first thing BOSS's conscience did was catch BOSS skipping BOSS's rule.

**The record's central worry did not survive contact.** It predicted the conscience might be
*"permanently, uselessly loud"* here. After the calibration fix it is **silent on an ordinary
prompt** — designed behaviour, now observed rather than assumed. **Leave it running:**
`.boss/conscience-log.jsonl` is no longer 0 lines, and this is the first observed-behavior data BOSS
has about its own core mechanism against `stated-pain` from two founders.

⚠️ **`.claude/` and `docs/loops/` here are gitignored** — the pre-sync copies are the only rollback
and they live in this session's scratchpad, which is temporary. Nothing else depends on them.

#### Open

1. **npm — Ajesh publishes.** 23 unpublished; the hold is lifted, and it is his hand on the command.
2. **`docs/research/verdicts/`** — the unresolved third of IDEA-087.
3. **IDEA-076's position half** — still held for an observed session.

### State (shipped, v0.267.0, 2026-09-09) — the thread IDEA-088 left open

**The hypothesis was wrong, and closing it was the point.** IDEA-088 asked whether `boss sync` was
failing to install hooks — which would have meant every adopted project lacked the conscience. It is
not: `planSync` reads the **stage manifest**, not the project stamp, so a project pinned at 0.6.0
correctly sees everything added since (`hook/conscience` and `hook/reentry` both list as `+ new`
right here). **The real cause is that BOSS's own project has never run `boss sync --apply`** — stamp
`0.6.0`, `2026-05-21`, `agents: 0`, `skills: 0`, `hooks: []`, 260 releases.

**What the check found one rung down (v0.267.0).** `provenance()` is a tri-state and its own comment
names both causes of the third value — *"BOSS wrote this before the ledger existed **or never wrote
it at all**"* — and the apply path collapsed them into one behaviour. Right for the first; wrong for
the second, which is a founder whose repo already had `.claude/agents/coder.md` before `boss adopt`
ran. **`adopt` protects them on day one (copy-if-absent); `sync --apply` replaced them on day
thirty**, rendering it as `~ changed (30 lines)` — the words a genuine BOSS update gets. Never data
loss (backed up, path printed); it was **invisibility**.

Fixed: `? unclaimed` as its own status word · `boss sync --apply --keep-mine` skips them and applies
the rest · the two skip reasons no longer share a sentence (*"you changed them"* is false for an
unclaimed file). **The default is unchanged on purpose** — making `--keep-mine` the default would
stop every pre-ledger project from updating, the trade-off the original comment weighed correctly.

**Ajesh, 2026-09-09, on the blast radius: *"not a lot of installs of boss so its fine anyways."***
Correct as a risk read — do not re-raise this as urgent.

#### ⚠️ Before ever running `boss sync --apply` in THIS repo

It reports `~ changed` for `agent/mentor-founder` (71L dev → 103L shipped) and `agent/prompt-coach`
(95L → 101L). Those are **dev-workspace agents sharing a name with shipped ones** — two worlds, one
namespace. Use **`boss sync --apply --keep-mine`**, which installs the conscience and reentry hook
without touching a single dev agent. That is the cheap path if IDEA-088 is ever taken up.

#### Still open, all Ajesh's call

1. **npm** — 22 unpublished, held by his own instruction.
2. **Turn the conscience on here** (IDEA-088) — now safe via `--keep-mine`; one week, then read
   `.boss/conscience-log.jsonl`, an instrument that has never had data.
3. **`docs/research/verdicts/`** — the unresolved third of IDEA-087.

### State (shipped, v0.266.0, 2026-09-09) — three captured ideas, worked in evidence order

Ajesh: *"target as many of the ideas that are worth it and start hitting it as needed. If an idea is
unsure or no clear value yet, go research and see if its valuable."* Three shipped; one researched
and the research found something.

- **IDEA-076 — the readiness half of the train line.** `src/readiness.js`. Every rung now names what
  earns it before you cross; only `boss unlock scale` ever did, hard-coded inline, so the rung almost
  nobody reaches was the one that spoke. Legs BOSS has ground truth for are READ; the rest stay a
  first-class `unknown`, named and unjudged. `boss status` adds ONE line, only when every checkable
  leg is met, silent otherwise. **No counter of any kind, and it goes DOWN** — supersede the EVID
  behind it and the line retracts, which is the property `test/readiness.test.js` guards.
  ⚠️ **The POSITION half is NOT built and must not be read as done.** What shipped answers *am I
  ready to climb*, not *how far am I inside this rung* — which is what EVID-001 actually asked. Still
  held for an observed session.
- **IDEA-085 — the other always-on bill.** Ten skill descriptions were summarising their bodies;
  trimmed to the trigger after verifying each cut clause had its own body heading. **MVP carries
  21.0 KB instead of 24.3 KB on every turn.** `check-manifests` gained the budget; the cap (700 B) is
  DERIVED from the real distribution (48 skills, median 485, p75 633), and was verified by making it
  fail. The per-rung total prints and never fails — a budget on a total improves when BOSS ships
  fewer skills.
- **IDEA-086 — three doors to one job.** The routing line ships inside `/evidence`, naming the cost
  of picking wrong out loud (a transcript captured here loses the synthesis silently). The MERGE
  stays refused: it would cost `/interview`'s prep and `/research`'s synthesis to fix a naming problem.

#### 🔴 The research turned up a finding — IDEA-088

IDEA-085's third surface was the hooks' own output, never measured. It costs **0 bytes unless a
moment fires, ~1.4 KB when one does** — so the record's generalization (*"whatever the host loads
unprompted is a standing cost"*) is **wrong as written**: two surfaces are standing, one is episodic,
and the episodic one is the only one designed with its cost in mind.

Getting that number needed a positive control — a 0-byte reading is indistinguishable from a broken
probe. Forcing a real fire found that **BOSS does not run its own conscience.** Verified four ways:
`.claude/hooks/` holds only `lib/`, neither settings file registers a hook, `.boss/manifest.json`
says `hooks: []`, and `.boss/conscience-log.jsonl` is **0 lines**. **The manifest is HONEST, which is
exactly why no check catches it** — absence is not drift, and BOSS has no detector for what it never
installed. Noted once in passing (IDEA-067) and never given a record or a cause.

**Deliberately not fixed.** Registering the hook changes Ajesh's live working session mid-flight, and
the conscience's own premise is that it is invited, not imposed. It is also not obviously right —
BOSS has 93 records and a conscience tuned for a founder with four ideas may be uselessly loud here.
**The argument FOR is the strongest evidence argument BOSS has:** it has `stated-pain` from two
founders and zero observed sessions, and Ajesh is the one founder BOSS can observe continuously.
Too loud is a calibration finding; quiet and occasionally right is commitment-grade signal about the
core claim. Either beats 266 releases of no data.

#### Open, and all three are Ajesh's call

1. **npm** — 21 unpublished. Held by his own instruction; the only thing that makes any of the above
   reachable by a founder.
2. **Turn the conscience on here?** (IDEA-088.) One week, then read the ledger.
3. **`docs/research/verdicts/`** — still the unresolved third of IDEA-087. 96 files, measured clean,
   would resolve 27 dangling `RVW-nnn` references.

### State (shipped, v0.263.0–v0.265.0, 2026-09-09) — the citation layer, and adopt walked

Continuation of the partner-review thread. **Every finding came from RUNNING something, not reading
it**, and two of the three fixes were caught mid-build by BOSS's own gates.

- **v0.263.0 · 198 dead citations.** Found by `git commit` refusing four captured ideas — `docs/ideas/`
  is gitignored. `registry/CHANGELOG.md` ships inside the npm package, so 151 references to records
  nobody outside this machine can reach were **distributed**, not merely published. History was not
  rewritten; a false door was removed from it. 🔴 **The new check was a silent no-op TWICE before it
  worked** — a `catch` swallowing a missing `execFileSync` import, then placement *below* the
  `total === 0` early exit. **Both printed "Everything BOSS points at exists."** Neither would have
  been caught by *does it pass?* — only by *can I still make it fail?*, which is now the regression
  test. **Anything that pushes a finding belongs above the count of findings.**
- **v0.264.0 · the decisions published.** 31 pointers out of them de-linked, **0 further records
  published** — nine were pure provenance, three illustrative and self-contained, one pointed at
  this file. The filter: *can the decision be understood without opening it?* Publishing the target
  was right zero times out of 31. Two test fixtures broke and both were the check working: the probe
  used `DEC-011`, which had quietly encoded *"no record class is ever published."*
- **v0.265.0 · `boss adopt` walked against six real-shaped repos.** Detection right in all six;
  **the merge is better than expected and must not be rebuilt** — a founder's `permissions`, `env`,
  their own hook and their own skill all survive. 🔴 **The bug: three of the four day-one agents
  (`coder`, `mentor-founder`, `prompt-coach`) were installed and invocable by NOTHING** in any repo
  that already had a `CLAUDE.md` — the commonest arrival. `check-manifests` enforces exactly that
  rule **against the template**, and nothing read the adopted result, so the gate held for
  `boss new` and quietly did not for `boss adopt`. Two smaller drifts of the same shape, both from
  v0.259.0's own pass: the adopt block still said *"/welcome then /boss"*, and `boss status` told a
  shipped app to *"capture an idea"* one line above *"Already built: a deploy config."*
- **Confirmed, not fixed:** `boss map` lists **36 verbs at once** in an adopted MVP repo
  (IDEA-084). What `boss unlock` installs is the least reversible thing BOSS does to a repo.

### State (shipped, v0.257.0–v0.260.0, 2026-09-08) — BOSS as a tool someone would recommend

**Seed: *"what would YC and similar incubators say are the gaps of BOSS — why wouldn't they
recommend it to their cohorts, even free?"*** Deliberately scoped away from users/revenue, at
Ajesh's direction, onto **how the product functions as-is.** Five of six findings were built; the
sixth was captured ([[IDEA-083]]).

- **Everything shipped was subtraction or composition.** Nothing new was added except one CLI
  command that maintains nothing. The standing EVID-001 mandate held on its own terms.
- **The measurements are the durable part**, and none had been taken before: 16→45 verbs on one
  `boss unlock mvp` ([[IDEA-084]]) · ~24 KB of skill `description:` frontmatter, a second always-on
  cost nobody had weighed ([[IDEA-085]]) · three verbs sharing one job ([[IDEA-086]]) · 124 public
  citations to private records ([[IDEA-087]]).
- **Two gates earned their keep mid-build.** `check-manifests` refused the deletion of MVP's agent
  roster — *"agent 'tester' ships but is named nowhere in this stage's CLAUDE.md contribution"* —
  which is correct and was invisible while cutting. `test/cli-vocabulary.test.js` (a peer session's,
  committed hours earlier) caught `boss recap` dispatching while invisible to the typo suggester.
- ⚠️ **A peer session was mid-release when this one started** — v0.255.0 sat uncommitted in the tree
  with 26 files touched. The rename was backed out and the work waited for `9fab8cf` to land. This is
  the fifth time concurrency has cost something in this tree; the difference is it cost nothing here.

### State (shipped, v0.261.0 + v0.262.0, 2026-09-08) — an absence is a claim

**Committed `44a8d42`, NOT pushed** *(true when written; the branch was pushed 2026-09-10)*. Both came out of one `/deep-research` + `/vet` pass; the
research record is `docs/research/sessions/SESSION-2026-09-08-harness-and-host-since-august.md`.

**v0.261.0 — UP into `testing-with-agents.md`.** *An agent's "I found nothing" is the least reliable
thing it says.* A positive finding carries its own evidence (`auth.ts:88` — you can open it); a
negative is a claim about the whole codebase resting on whichever queries happened to run, with
nothing attached to check. **You cannot open an absence.** The moves: a synonym pass (3–4 phrasings,
including the words *you* wouldn't use), one search by *behaviour* not name, and the rule underneath
— **a word count is not a coverage measure.** Plus the tell: **weight the absences you'd like to be
true**, because a gap that makes your idea necessary is where the check gets skipped.

🔴 **Sorted UP because BOSS made this exact mistake TWICE in one session** — grep one word, conclude
a gap, both times the concept shipped under other words. n=2 in one sitting is the breakpoint.

**v0.262.0 — [[RVW-095]] ADAPT.** EVID-001 asked for *"when to rearchitect"*; the word had zero
occurrences and the first read was a coverage gap. **Wrong.** The judgment ships twice and is good
(`mentor-architect`'s *"breakpoint, not a calendar… debt is only worth naming once the code is what's
slowing them down"*; `scalable-architecture`'s *"extract when forced"*). **The gap was vocabulary.**
Five founder phrasings added to `mentor-architect`'s trigger line. No new skill, no new guidance,
**deliberately not promoted above MVP** — the judgment's own first move is *check the register*.

**[[RVW-094]] REJECT — the VC "prototype → funding → engineers rebuild" trend.** Killed on cohort
harm first (three of eight personas harmed; the message is *"a real engineer will redo your work"*,
sourced from firms paid to do the redoing), evidence second (the "8,000 startups" figure has **no
methodology**, marked *"Calculated"*; the "2.74x per Veracode" figure is **absent from Veracode's own
blog and from the CSA synthesis of that same report**). Framing also re-imports the venture assumption
[[DEC-011]] removed. **REJECT not NOT-YET, on purpose.**

⚠️ **Still open, deliberately unvetted:** `docs/research/inbox/tool-surface-economy-has-no-practice.md`
— no BOSS practice covers tool-surface economy while BOSS ships 45 skills at MVP and the host shipped
`/skill-doctor` to measure exactly that. **Its verdict needs `/skill-doctor` RUN first** (Ajesh's —
not invocable from here); vetting it without the number would repeat the session's own mistake.

⚠️ **This file is 512 lines and the release gate says so** — past the ~400 advisory, which is the
point at which a read-every-session doc stops being read. An archive pass is owed.

<!-- moved from docs/RESUME.md 2026-09-09 — the Carried-forward / Work-Order / Captured-not-built /
     Next-tasks / Open-decisions blocks, in full and not summarised. What stayed live was
     consolidated into RESUME's DECISIONS + HELD sections; everything closed lives here. -->

### Carried forward — standing items with no home in a version window

*(Two entries retired here 2026-08-24 because they were marked ✅ and a briefing should not carry
closed work: RVW-077's independent pass, and the five `seam: null` entries — both landed, both
recorded in `registry/CHANGELOG.md` and their verdicts. Only the live half of the first survives.)*

- 🔴 **The RVW ledger has no git history** — `.gitignore:41`. **Folded into [[IDEA-087]] in the
  frontmatter, which states the same defect at its real size** (all record types, not just verdicts)
  and now carries the measurement. This bullet stays only as the pointer; do not re-argue it here.
- 🔴 **HELD, not built — [[IDEA-076]]** *(lifted out of the v0.232.0–v0.234.0 window when it was
  archived 2026-08-25; it was that window's one unresolved item)*: position WITHIN a rung.
  `renderLadder` shows four mode names and never where you are inside one, which is where a founder
  spends weeks; `graduationHint` is a static string and only `unlock scale` names a bar. **Defect
  verified mechanically; demand is stated-pain only.** The obvious cure is a dark pattern BOSS
  already catalogs — *a progress surface that cannot go down is a comfort device*. Needs an OBSERVED
  session, not a third statement.
- **Standing, from v0.175.0: confirm the altitude before analysing.** BOSS is self-hosted, so
  *BOSS's own practice* and *what BOSS ships a founder* are the same file and look like the same
  question. It was answered at the wrong altitude twice in one session, and both catches were Ajesh's.

### 🔷 WORK ORDER — 2026-08-21, from the Fable review pass

*(Phases 0–1 ✅ closed: v0.200.0 → v0.212.0, detail in `registry/CHANGELOG.md`. Guardrails folded
into the CONCURRENT SESSIONS section above and CLAUDE.md's working rules. Two that live nowhere else:
**manifest summaries are one long JSON string — never paste prose containing `"` into them**, and
`site.zip` in the repo root is another session's artifact — **ask before deleting**.)*

**Phase 2 decisions — ✅ 2a** (CANVAS v0.5: two doors, company-building is opt-in; Riskiest Assumption
deliberately untouched) · **✅ 2c** ([[IDEA-072]] filed not decided — n=0, nobody has run a program) ·
**✅ 2d** (`oyeboss@0.215.0` published 2026-08-21; ⚠️ never read a version gap from this file — run
`npm view oyeboss version`).

- **⬜ 2b — THE LIVE ONE. The website criterion: propose NEUTRALITY, NOT ADVOCACY.** The site
  currently makes the *opposite* claim (*"tell a real business from a convincing demo"*), which
  actively filters commons founders — an asymmetric cost now taken **three** times. Proposal: drop
  the venture-assumptive lines (the same edit CLAUDE.md's telos got), claim NO commons support
  (rungs 2–3 stay unbuilt). **If yes → DEC-013 + one site release. If no → record the cost taken a
  fourth time, and stop proposing it.**

#### Phase 3 — THE OUTSIDE EXPERIMENT · ✅ CANDIDATES BUILT 2026-08-23, awaiting outreach

🔷 **The list exists: [`evidence/CANDIDATES-2026-08-23-maintainer-experiment.md`](evidence/CANDIDATES-2026-08-23-maintainer-experiment.md)**
— 12 named repos where **the project stalled but the maintainer is still active**, built from live
GitHub data. The 80-day stall on *"get BOSS in front of 1–3 founders"* was never reluctance; the
door-1 cohort is **not enumerable** and door 2 is.

- **The unlock:** criterion 4 (*"plausibly sharp-fit — has used Claude Code"*) looked unsearchable.
  **A committed `CLAUDE.md` IS that signal** — and BOSS runs inside Claude Code, so these people are
  already in the host environment, not "plausibly" in it. Funnel: 99 repos → 39 quiet 45d+ → 27
  personal → 18 solo (≥80% one author) → **12 with a reachable maintainer.**
- **Approach three:** `justinabrahms/agent-chat` (active today, agent-adjacent, 645 followers) ·
  `hschne/puny-monitor` (the most representative case — a useful indie tool, 310d silent, maintainer
  commits daily elsewhere; **exactly what `sustaining` was built to notice**) · `williamsharkey/shiro`
  (the honest control — small following, no courtesy-reply pressure).
- ⚠️ **`badlogic/vs-claude` is deliberately NOT top-three** despite 7,445 followers: not
  representative, and a famous maintainer's reaction is the easiest signal to over-read — the exact
  error made when persona output was treated as demand.
- 🔴 **The first message must NOT mention BOSS.** EVID-001 is graded `stated-pain` *because* the
  founder was shown BOSS and reacted to it. Lead with the tool and you reproduce the weak evidence.
  Ask what happened when their project went quiet; demo only if the pain is real. Both messages are
  drafted in the candidates doc.
- **ONE metric: Activation** — first canvas with a real riskiest assumption, reached unprompted.
  **Watched, not asked** — where they stop, what they skip, what makes them close the terminal.
- **Success** = a second unprompted session **and** a decision BOSS changed. **Kill** = not one
  willing maintainer out of twelve → distribution precedes product, and `mentor-customers` leads.
- ⛔ **No features from this.** EVID-001 stands: compose and subtract, never add. If it produces
  a second signal, THAT is what gets built — not more charter work.
- ✅ **2d cleared** — `oyeboss@0.215.0` is on npm, so a maintainer installing today gets the licence
  ask, the planet question, the teeth limit and `sustaining`. Nothing blocks this now except sending
  the message.

*(Fable review, 2026-08-21 evening. Five findings: uncommitted risk; sustaining voice untested;
surface grew while demand moved 0%; the site's cost is asymmetric; sustaining partially satisfies
DEC-012 falsifier #2 — the first time BOSS asks a founder about time and continuity.)*

### Captured, not built — 2026-08-24 (docs only; no release, no CHANGELOG)

**[[IDEA-075]] — the scaffold has no way down.** 🔴 **BOSS ships ONE of scaffolding's three defining
characteristics** (van de Pol/Volman/Beishuizen 2010: *"contingency, fading, and transfer of
responsibility"*) — partial contingency, on the PROJECT's evidence, never the founder's competence.
`boss unlock` says the rest: *"Additive — nothing is ever removed."* The founder's dial has two
settings, MORE and GONE. 🔴 **Subtraction WAS built, for BOSS not the founder** — `src/supersede.js`
removes what BOSS retired; nothing removes what the FOUNDER outgrew, and its own header argues this.

- ⚠️ **Do not claim the literature always had fading.** Wood/Bruner/Ross **1976** coined the word; its six
  functions have **no withdrawal step**, only *"the major risk is in creating too much dependency on the
  tutor."* Fading is **Collins 2006**, whose readable chapter is NOT the Collins/Brown/Newman **1989**
  everyone cites — quoting one as the other is [[vet-verify-attribution]]'s trap, n=13.
- **McGrenere/Baecker/Booth CHI 2002 (n=20): adaptable BEAT adaptive** — invisible auto-hiding drove
  dissatisfaction, so any fix is founder-invoked and fades the **surface, never disk** (which dissolves
  the destructive-verb fear the 2026-08-21 incident earned). 🔴 **n=0 demand; two of three signals asked
  for MORE presence, not less scaffold — not a build.** Cheapest move: add one question to EVID-003's
  three — *"anything BOSS gave you that you've stopped needing?"*

### Next tasks

**The two that matter are not engineering.**

1. **[[IDEA-060]] items 6–7 — and both are now decisions, not tasks.** Item 6 (`site-drift-loop`) is
   **SUPERSEDED at v0.182.0** — `check:site`'s `covers:`/`reviewed:` comparison already does it
   better, and building the loop would have added a blinder second watcher over one surface. Item 7
   (the demand-page count) is **trigger-gated on someone actually running a demand page**. What is
   genuinely left is **not item-shaped**: BOSS's own `og:image` needs a bought domain, and the bigger
   half IDEA-060 named itself — *at Quickstart, BOSS cannot put anything in front of anyone*
   (`/pretotype`, `/landing` and `/ship` are all behind the MVP unlock, so **the demand test is gated
   behind the build unlock**, inverting the thesis `/pretotype` opens with). That is a stage-boundary
   call with an EVID-001 cost — adding to the mode most protected from addition. **Founder decision.**
   *(Historic: items 1–5 shipped inside*
   `f6515a2` (`/design-library` scans the public surface · `/landing` composes from the library ·
   the share layer sorted up into `landing-page.md` · the §7 contradiction superseded · item 5's
   first-app offer at `/canvas`'s Done beat).*
2. **The seven `building_since:` dates — a founder decision, deliberately not guessed (v0.242.0).**
   BOSS's own in-flight records carry none, and `docs/ideas/` is gitignored here by design, so there
   is nothing for the derived fallback to read: **BOSS's board is the one board that still cannot age
   a card.** `created:` is the *capture* date — the exact conflation v0.242.0 removed — so
   back-filling from it would have re-introduced the bug as authored data. Either supply the dates,
   or say "use the first CHANGELOG version that mentions each" and accept it as an approximation.
3. **4.4** — package/template decoupling. Mooted by v0.132.0; only if the seam bites again.
4. **The human-only queue, which no release can substitute for:** get BOSS in front of a second real
   founder, or move the first from `stated-pain` to **observed-behavior** (watch them use it — an
   `/interview` debrief or a live session).

*(Closed: "verify `model: fable` resolves on the versions founders run — 8 shipped mentors carry the
bare alias." **Nothing shipped carries `model:` frontmatter at all** — the eight pins were removed at
**v0.135.0**, which `model-routing.md`'s own provenance records. The task outlived its subject by 44
releases. Only the prose residue in §3 above remains.)*

### Open decisions
- **✅ The boundary `not-yet` list is RESOLVED — 2026-08-24, v0.235.0 → v0.237.0.** It was never five:
  **`designer` crossed at v0.189.0** and the count had gone un-redone for ~48 releases. Of the real four —
  · **`prompt-coach` CROSSED to Quickstart** (v0.236.0). Its own description said *"outward-facing"* — it
  was authored for founders and never left. An AGENT, so nothing was added to the 48-skill wall.
  · **`/vet` SPLIT** (v0.237.0). The judgment crossed as `library/practices/outside-claims.md` + a step 0
  in `/decide`; the RVW ledger stays internal. 🔴 **It was never portable for a concrete reason: its rubric
  scores against `PRINCIPLES.md`, which no scaffolded project has.** Row stays `not-yet` — the SKILL did
  not cross; re-open is a founder-scoped skill, never this one ported.
  · **`voice-keeper` → `internal`** (v0.237.0). It sat at `not-yet` while its own reason already held the
  answer, and v0.227.0 + v0.235.0 had crossed the discipline as prose. **A verdict left open after its
  condition is met can never close.**
  · **`practice-refresh` stays `not-yet`, now with a TESTABLE re-open condition** — a real project past
  ~10 PRACs AND one found stale *in practice*. A reason with no test gets re-read forever.
  **`not-yet` is now 2.** The EVID-001 tension resolved the way the mandate says: **no new skills, 48
  before and after** — one agent, one practice, one step inside a skill that already shipped.
- **The domain is SETTLED; what's open is a RE-DEPLOY.** `oyeboss.build` registered 2026-08-20
  (Cloudflare), live, `og:image` shipped v0.194.0. 🔴 **This bullet rotted THREE times** — it claimed
  the domain resolved to nothing (wrong), then that the public page still read *"tell a real business
  from a convincing demo"* (wrong: `web/index.html:16` and `site/index.html:47` both read *"a thing
  people actually need"*, committed **and** built since v0.215.0). Only the **deployed** copy is stale.
  **The durable rule, learned by breaking it three times: never describe the live site from this file —
  grep the repo, then look at the URL.** The pending `site/`+`web/` work (favicon `{{HEAD_ICONS}}`, the
  dangling `--color-accent`, extensionless canonicals) is complete and `check:site --strict` passes;
  Ajesh pushes to Cloudflare once the queue clears. **It waits on an explicit yes.**
- Optional: scrub the old `registry/projects.json` (home path + `margin`) from git history. Removed
  going forward as of v0.7.0; only matters if the public history bothers you (needs force-push).
