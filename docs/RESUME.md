---
id: RESUME
type: resume
owner: product-lead
status: active
updated: 2026-09-13
version: 0.325.0
---

# RESUME — BOSS

**Read this first each session.** State + next tasks + open decisions.
**Window: 200 lines.** What has shipped lives in `docs/devlog.md` (history, append-only, newest at
top); every version is in `registry/CHANGELOG.md` (canonical, tracked); standing rules and the two
incidents live in `CLAUDE.md`. Facts a command computes are not written here. `boss status` and
`npm run check` both say when this file is past its window — **move, don't trim** (IDEA-102).

## Ground truth — run these, never read them from here

Peer sessions write this tree; every number in this file is a floor. Before anything:

```
cat VERSION && git log -3 --format='%h %ad %s' --date=format:%H:%M && git status --short
npm run check            # zero findings = clean; check:published says how far npm is behind
```

## Now

- **IDEA-114 slice 1 landed (2026-09-13, Unreleased) — an IDEA is `kind: venture` or `kind: capability`.**
  `/boss` writes the venture (one; carries the venture fields); `/idea` writes capabilities (many; none).
  `/canvas`, the playbook and `boss status` prefer the venture over the newest file. **In this repo every
  IDEA is a capability; BOSS's venture is the canvas** (CLAUDE.md rule 3). Open: the board's split.
- **IDEA-109 captured (2026-09-13) — the coach-in-residence positioning.** Ajesh: acquisition → acqui-hire →
  *"an incubator would wanna hire me… their coach, but also leverage this kind of tool for their cohorts."*
  Measured before opining: 0 stars, 196/196 commits his, riskiest assumption n=0 on a 2026-11-21 clock —
  nothing to *sell* but the person, which is the acqui-hire's point. Licence: **keep MIT and the words**
  (a copy edit claws nothing back; diligence reads `LICENSE`). Next step is one call, not a build.
- **v0.318.0 → v0.325.0 committed, none pushed (51 commits ahead of origin).** Each is a
  `registry/CHANGELOG.md` section and a devlog entry; the RESUME no longer restates them (window
  rule — moved, not trimmed, 2026-09-13). Headlines only: RESUME window (318) · `/skill-doctor` +
  `/extract` description fix (319) · plugin eval suite, Δ 1.0 (320, 321) · `/boss-learn` folded into
  `/extract` (322) · model attachment let go (323) · the board assessment applied, 16-skill MVP
  unlock, `boss status` 2.4s→0.17s (324) · `/boss:welcome` the everyday door by pointer (325).
- **Second tier landed under `## Unreleased` (2026-09-13)** — once-per-session conscience · `boss hooks
  enable|disable` (nothing lands until asked) · `modes:` label · manifest summaries one sentence ·
  checker hygiene + `parseEntries` in gen-site · MENTORS.md current. BOSS's own hooks re-synced.
- **Landed under `## Unreleased`, not stamped** — DEC-019 (release-on-publish: `npm run stamp` at publish;
  `VERSION is honest` replaces `is next`) and BOSS's own install synced 0.267→0.325 + a dogfood row
  that fails past 3 behind. The next version is Ajesh's to stamp.
- **Board pass, 2026-09-12/13 — Building and Taking shape both emptied, by finishing and by reading
  (`1b91586` → `5d87a12`, all under Unreleased).** `ready` renders in Taking shape. Five records had
  finished under other names and never said so (071, 084, 095, 096, 102) — flipped. Built: the return
  path (`revisit-due` + `unticked-shipped` in `boss records`/`boss status`, `/log` stamps `outcome:` at
  ship — first BOSS decision due **2026-09-20**); `/log`'s recipe as a script (measured: +4% body, the
  newest-first invariant is the gain; the other four don't convert); the shelf's product half (three
  shelves, provenance on the twelve, exactly-one check — found two more). Parked with triggers: 006
  (the port), 047 (fake door, keyless — when strangers exist), 082, 075, 076; 036 dropped; 066 owns
  outward research. Board: 4 captured · 0 taking shape · 0 building · 73 shipped · 29 parked.
- **Playbook, 2026-09-13 — everything before the deck, done (Ajesh: *"do the deck last"*).** Under
  Unreleased: the pull (`590748f`), FEAT-028 Proof chapters (`6736162`, `edf52cc`), Ajesh's answers
  on 026/027/028 recorded — Learnings merges the IDEA capture logs, the URL prints, `docs/source/
  README.md` ships (`1b1df27`); the kicked-up table sorted (`6a16e76`); **FEAT-035 the intake
  doors** — `/import` takes pasted text, dates its snapshot, assesses what else a source fills (≤5,
  yes/no, owning shapes, a document's number is never evidence), `/close` 3d notices what the
  founder said (`61a7c2c`); **FEAT-036 the Company chapters** — Team from `docs/team/` person
  records (`boss team add` stubs, photos inlined, never a stand-in), Brand as the doc holds it,
  Values from `## How we build` (`3bfde2b`); **RVW-103** persona vetted at source — `photo:` and
  `quote:` on the record, gated (`8da18b0`); four things BOSS never asked — `in_a_few_years:`,
  `prior_capital:`, runway and defensibility/compliance sharpens (`1daf260`); the **BMC frame**
  and the ask read from `business-<date>.md` (`ed46b24`). 16 chapters, 35 playbook tests, suite
  529 pass + the 3 pre-existing. Then **FEAT-029 the deck** (`2d7563e`): Present with three cuts as
  block-id lists (VC · Internal · Everything), remove/restore in the browser, Export PDF — **the
  playbook's four slices are done.** 36 playbook tests; suite 535 pass + 3.
- **The showcase — FEAT-039 (`6fe5942`).** IDEA-110's trigger fired and Ajesh added: rename (Tidewell
  is real → **Kettlewick**), fully filled incl. design and board, a folders page, the shipped files as
  examples, and a standing rule. Built: `demo/kettlewick/` (a tracked, fictional, full record set —
  no faces, no real company), `scripts/gen-demo.js` (the real renderers → `site/demo/`: playbook,
  design, board, folders-from-the-tree, inside-the-folder from `stages/`), *Demo* in the site nav,
  and **`check:demo`** in `npm run check` — a hole on the demo fails the build, so a feature shipped
  without demo content can't hide. Design records are the design lane's (in flight, unstaged).
  **Then, the same evening:** the design half landed (design lane, `78d13f4`); the board joined the
  dashboard on page-shell (`fd96771`); Organization + Learning replaced Folders + Inside; the demo
  board got six ideas / six FEATs; playbook + board set in the venture's tokens, Kettlewick
  recoloured sage/copper (`872e5c8`); the cut became a filter and Everything → All; the conscience
  runs for real on the demo at build time and its signals sit on Learning (`a4187cc`).
  **Last:** IDEA-065/104/106/110/111 flipped to `shipped` — `superseded`/`promoted` were off-vocabulary
  and the board filed two as Captured (`ba38d62`); BOSS eats its dogfood with a local
  `docs/design/tokens.json` so its own pages look like the site; the shell's default palette is
  chosen, not inherited (warm stone · blue-cast ink · teal, `DEFAULT_ACCENT`), and the deck store is
  keyed by project (`e6b4cdf`). Board: 4 captured · 0 taking shape · 2 building · 88 shipped · 28 parked.
- **FEAT-027 landed under Unreleased (`48ff59c`)** — the Pitch chapters: eight sections + a rail, each a
  projection over a record; a chapter line = the record's first sentence, tested.
- **Earlier the same day:** FEAT-026 slice 1 (`55502e9`, the canvas as boxes) and IDEA-106 captured
  absorbing 065 + 104, six prototype rounds (link in the record) — the devlog holds the detail.
- **The external evidence is still n=3 signals / n=2 founders, all `stated-pain`.** Nobody has been
  observed using BOSS, nobody has committed anything. The mandate holds: compose and **subtract**,
  never add a skill. Detail: `docs/evidence/`, the memory note, and the devlog's moved block.

- **Design lane, 2026-09-13 — the design space is complete and the templates caught up (`c2c63ea` →
  `c0b76fb`, all under Unreleased).** `boss design` renders seventeen sections from the files — the
  people and the story, the language with contrast computed, the parts with Code and an SVG spec
  frame on every component card, icons from files and as a sprite, the logo from the brand's file or
  not at all, resources (the DTCG file, a derived variables block, kit coverage from `design:` links
  nobody has written), exceptions grouped by rule; 27 tests. FEAT-030/031/032/033 shipped. IDEA-107's
  kicks-up rows landed in the shipped templates (Statement/Grounded in · Logo · Layout's six sub-slots
  · the three earned families · a `Principle` column on Ours only · research on a design object by
  name via `about:`). Open by design: IDEA-108 row 3 (the `design:` link in the template) waits for a
  designer with a file; the data-viz palette question (107 gap row 3) is still a question.

## Next (in order)

1. **Ajesh's browser read of the demo** — `npm run gen:site` → `site/demo/index.html`: does it read
   as *BOSS running*; the Kettlewick name; sage/copper. His playbook hand-checks: Present → VC cut
   (now also a filter), Export PDF in the sandbox, a removed slide after a re-render, the copy sheet,
   a Keynote paste, `/import` on a real deck. The design lane's sweep of the token descriptions
   still saying "blue" is theirs.
2. **IDEA-106's kicked-up table is sorted** (2026-09-13); what's left waits on a trigger — #23 a
   screenshot at ship (`/ship`), #27 channel per first user (`/measure`), #15 a series from an
   import, #1 the matrix (three FEATs + two rivals with `## How they do it`), #10 which chapters
   earn a visual. Previously it named: a person record + photos (#11), a `vision:` line (#12), prior capital (#18), the
   compliance stance (#21), the AI-defensibility question (#20), a screenshot at ship (#23), a dated
   `/import` (#13), the ask record (#17).
3. ~~`/vet` the persona sources~~ — RVW-103 (ADAPT: `photo:` and `quote:` gated; the rest rejected).
4. **IDEA-110 — the full showcase on oyeboss** (after 029): one worked example generated by the
   real renderers. Reposition is IDEA-109's.
5. **2026-09-20: the first `revisit-due` fires on BOSS's own tree.** Answer it with `outcome:`.
6. **`/vet` Cagan's 2026-09-11 retraction #2** (*"teams over-invest in validating problems"*). Inbox it first.
7. **Watchlist needs a row for the project/PM rung** (`planner`, `boss board`, `program:`).
8. **Docs-accuracy found task:** CLAUDE.md's repo map and `/vet` step 2 name `library/agents|skills|
   hooks|memory-seed/` — none exist. Fix the sentences.
9. **`npm run check` is red at 50 since `d20f15d` (IDEA-087):** `[[EVID-NNN]]` links in now-tracked
   ideas/verdicts point at evidence that stays gitignored; three tests fail on the same class. Not a
   regression — `check:refs` needs to know evidence is private by design (skip or soften the EVID
   class), not un-ignore it.
10. **Two dogfood gaps from the `/retro`:** `.boss/brain/` (run `/read-repo`), `/drift-deep` never run here.
    Plus two new: `.claude/rules/feature-context.md` now exists here (`/spec`/`/close` name it);
    `docs/product/JOURNEY.md` not written (every row would be `assumed`) — write it at the second flow.

**Above all of these, unchanged: publish (npm is behind — `npm run check:published` says by how
much) and Phase 3 outreach. Both are Ajesh's.**

## Waiting on Ajesh — each is a yes/no; the work is done

- 🔷 **The design space, by hand:** `boss design --open` on a real project; paste a component's *SVG*
  frame and the icon sprite into a design tool (they should land as editable layers); paste a block
  into Keynote/Slides; reject any assumption in FEAT-030/031/032/033 in a word. The lane has nothing
  left to build until one of those says something.
- ⛔ **`npm run stamp` → `npm publish`** (18 behind; DEC-019 — the stamp makes the version), then `npm run bump:formula`. He publishes himself — never run it for him.
- 🔷 **Submit the plugin to `claude-community`** (DEC-017; `claude plugin validate . --strict`
  passes; platform.claude.com/plugins/submit). `boss-ai-agent` exists there — lead with what BOSS is not.
- 🔴 **IDEA-087 — un-ignore `docs/`.** A one-way door. Two demonstrations now, not an argument:
  `.boss/conscience-log.jsonl` (08-21) and `RESUME-ARCHIVE.md` (09-09) were both destroyed because
  they were gitignored. Cheapest half first: `docs/research/verdicts/` (96 files, measured clean,
  resolves 27 dangling `RVW` refs in the tracked CHANGELOG). Decisions are already published (v0.264.0).
  Ideas stay private by his call; evidence permanently — real people spoke in confidence.
- 🔷 **Phase 3 outreach** — three maintainers chosen, two messages drafted, in
  `docs/evidence/CANDIDATES-2026-08-23-maintainer-experiment.md`. The first message must not mention
  BOSS. Metric: activation, watched not asked. No features from this.
- 🔷 **IDEA-098 gate leg 2:** did the `/consult` movement line beat the plain split? Both reads are in
  IDEA-099. And EVID-003's *did you come back?* — still unasked.
- ⬜ **`venture` as the default noun** (19 template files + `docs/venture-brain.md`) — a rename with a
  migration cost, re-proposed four times as if cheap. Rename · leave · or stop proposing it.
- ⬜ **The seven `building_since:` dates** — the CHANGELOG fallback clusters four on one day and the
  board would stamp them `authored`. Supply real dates · accept knowingly · leave empty (`derived`).
- ⬜ **Cloudflare re-deploy** — live site is ~40+ releases behind; waits on an explicit yes.
  `cd site && zip -r ../site.zip . -x '.*' -x '__MACOSX/*'`. Never describe the live site from this
  file — open the URL.
- ⬜ *Optional:* scrub the old `registry/projects.json` from git history (force-push).
- ⬜ **IDEA-047 re-aimed keyless (2026-09-13)** — the fake door: drop `pretotype/api/`, one labelled
  recording, CTA = plugin install, count the click. Parked on a trigger: strangers exist (plugin listed / outreach live) and installs stay flat.
  IDEA-036 dropped; IDEA-066 is the one owner of outward research (093 p7's trigger carried in).
- ⬜ **IDEA-109 — the `README.md` §License line *"never the CLI itself"*.** Stronger than "open source"
  and it closes a door the coach-in-residence shape may want open. Keep · soften · or write the DEC.
  (Not: drop "open source" from the site while `LICENSE` stays MIT.)
- 🔷 **DEC-018 — the ground moved from 43° to 210°** on the strength of a brief; `AI-suggested-ratified`.
  Confirm or reverse.

## Held — not decisions; each has its re-open condition

- **IDEA-076 position within a rung** — re-open on an OBSERVED session, not a third statement.
- **IDEA-075 the scaffold has no way down** — n=0; add *"anything BOSS gave you that you've stopped
  needing?"* to EVID-003's questions before building anything.
- **IDEA-089 outward docs flatten after MVP** — re-open on the first founder who ships and asks about
  their README.
- **`/practice-refresh` boundary not-yet** — a real project past ~10 PRACs with one found stale.
- **Parked from the comp-read batch** (unpark conditions in the competition record's table):
  assumptions-plural in `boss status` · `waiting_on:` · cohort re-fit · time-per-task-type · the
  concept-anchor grep.
- **Seams named, NOT-YET:** rework rate as a `/judge-traces` header line (team-level only) ·
  `blocked_by:` → a derived `ready` column · agent topologies (Scale, trigger-gated).
- **Incidental:** `readShape()` is exported from `src/config.js` and nothing calls it — the mirror of
  the field-nobody-reads pattern. Worth a look when the tree is quiet.
- **`effort:` frontmatter** honoured on pinned-effort models (2.1.267) — one line at the next `/recalibrate`.
- **Plugin eval, further cases** — both doors are covered (v0.320.0, v0.321.0). The next case worth
  writing is *after* the door: a founder who says "no, more to say" — does it keep talking and offer
  once more, never twice? Cheap; after the first real founder.
- **RubyGems agent attack** (rubyhack.ai, 2026-09-11) — inboxed as an event for the agent-security
  sweep (2026-11-09). Attribution is the authors' inference.

## Prompt for the next session

> **Keep this evergreen.** A pointer + procedure, never a status report.
>
> Continue BOSS (in `~/Projects/bossbuild`). **Read first, in order:** `docs/RESUME.md` (this file),
> `CLAUDE.md`, `PRINCIPLES.md`. Then run the *Ground truth* block above — if `git log` disagrees with
> *Now*, this file is stale; re-establish ground truth, then re-read. Then pick up *Next* top down.
>
> **Per capability landed:** `npm run check` at zero → a bullet under `## Unreleased` in
> `registry/CHANGELOG.md` (VERSION does not move — DEC-019) → `/tmp`-test the CLI and prune those
> entries from `~/.boss/registry.json` → `npm run release` (the gate) → commit with the GH noreply
> env-var → push when asked → `/close`, which rewrites *Now* and *Next* here and appends the
> narrative to the devlog. **Stamping a version is Ajesh's:** `npm run stamp`, then `npm publish`.
> If this file is past its window, move — don't trim.
