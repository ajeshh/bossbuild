---
id: RESUME
type: resume
owner: product-lead
status: active
updated: 2026-09-14
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

- **IDEA-118 (2026-09-14, `94e800c` → `c72c385`, Unreleased) — the seams after the overhaul; shipped.**
  Walked the founder path end to end (site → Quickstart → MVP → a FEAT shipped); twelve seams fixed,
  one family — a rule kept in one reader and not its sibling (day-0 collapse, `/boss` not `/idea`
  for the venture holes, the verb gate in every reader, `cohort: skipped`, `src/clock.js` local dates,
  recap reads the founder's canvas, the earned-seven fold after the first ship, no tally on *Ready
  for V1*). **Ruled: no fixed order between the conversation and the canvas** — the arc is now
  *capture → pressure-test · talk to one person (either order) → unlock*; a `coreLoop` step may be
  a pair. BOSS's own install synced 2026-09-14 (`--keep-mine`; the 7 BOSS-tuned agents stay). The
  adopted-repo door walked too: adopt now keeps the holds new/unlock keep, a live repo counts as
  `shippedBefore`, the small-repo why line says what it read. All three doors done.
- **IDEA-114 slice 1 landed (2026-09-13, Unreleased) — an IDEA is `kind: venture` or `kind: capability`.**
  `/boss` writes the venture (one; carries the venture fields); `/idea` writes capabilities (many; none).
  `/canvas`, the playbook and `boss status` prefer the venture over the newest file. **In this repo every
  IDEA is a capability; BOSS's venture is the canvas** (CLAUDE.md rule 3). Open: the board's split.
- **DEC-021 (2026-09-14) — the mark is the built B, Ajesh's own SVG; applied.** Two boards on
  IDEA-115 (marks: eight straight cuts, β in six cuts, a ribbon β, then his reference and file) →
  *"K1 is great!! lets go with that."* `web/boss-logo-mark.svg` + `scripts/mark.js` (one reader; the
  lockup, favicon, demo ribbon and `npm run gen:og` share card all through it); a small cut widens the
  seams under 24px (*"becomes blobby"* — fixed, rendered 16/20/24/32/48 both ways); two fills per
  ground (cornflower/persimmon on ice, authored sky/persimmon on deep). ✦ lineage retired honestly —
  **the CLI's success glyph is an open task** (IDEA-115). Falsifier: a real reader calls it a template
  3D icon, by 2026-10-14. Unreleased.
- **DEC-020 (2026-09-13) — the brand is five colours with one job each; applied.** Ajesh: *"go back
  to the drawing board"* → *"not boring mandatory blue… break the mold"* → his own pair → *"3-4 colors,
  and offwhite"* → *"ok lets go with O."* Paper `#F6F6F3` ground · ice `#D7EFFF` surfaces · cornflower
  `#5089E0` structure · persimmon `#FF5C34` the one loud thing · ink `#14202B` / deep `#0E1C28`.
  **Cornflower structures, persimmon points.** `tokens.css` is the mechanism; help.css, og-card
  (og.png re-rendered), the demo ribbon, board.js, BRAND.md moved with it; VISUAL.md rewritten; stop
  went crimson. The board with all fourteen candidates is linked from IDEA-115. Falsifier: a real
  reader says *playful* or *clinical*, or a tap finds cornflower pointing — by 2026-10-13. Unreleased.
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
- **Second tier landed under `## Unreleased` (2026-09-13)** — moved to the devlog (2026-09-13 entry); the CHANGELOG holds each.
- **Landed under `## Unreleased`, not stamped** — DEC-019 (release-on-publish: `npm run stamp` at publish;
  `VERSION is honest` replaces `is next`) and BOSS's own install synced 0.267→0.325 + a dogfood row
  that fails past 3 behind. The next version is Ajesh's to stamp.
- **Shipped 2026-09-12/13, all under `## Unreleased` — the devlog holds each; RESUME keeps the pointer.**
  · **Board pass** (`1b91586` → `5d87a12`): Building and Taking shape emptied by finishing and by reading;
  the return path (`revisit-due`, `unticked-shipped`, `/log` stamps `outcome:` — first BOSS decision due
  **2026-09-20**); five records flipped to `shipped`; 006/047/082/075/076 parked with triggers, 036 dropped.
  · **Playbook** — FEAT-026/027/028/029 + the pull (`590748f`), FEAT-035 intake doors, FEAT-036 Company
  chapters, RVW-103, the four never-asked fields, the BMC frame, the deck (`2d7563e`). Four slices done.
  · **Showcase** — FEAT-039 Kettlewick (`6fe5942` → `a4187cc`, `e6b4cdf`): a fictional full record set,
  `scripts/gen-demo.js` through the real renderers, `check:demo` red on a hole. **Standing rule: a new
  chapter or record type adds its demo record in the same commit.** Board: 4 captured · 2 building · 88 shipped · 28 parked.
  · **Board dates + the honest bar** (`3747bc9`): every card says `added <date>`, Shipped cards `shipped
  <date>`; a Building FEAT's criteria bar renders at `0/N`, and no section at all renders as a hole.
  Card shows **criteria, not todos** (the promise, fixed at spec time) — reasoning in the CHANGELOG entry.
  · **Design lane** — FEAT-030/031/032/033 (`c2c63ea` → `c0b76fb`): `boss design`, seventeen sections, the
  templates caught up. Open by design: IDEA-108 row 3 waits for a designer with a file; the data-viz
  palette question (107 gap row 3) is still a question.
- **The external evidence is still n=3 signals / n=2 founders, all `stated-pain`.** Nobody has been
  observed using BOSS, nobody has committed anything. The mandate holds: compose and **subtract**,
  never add a skill. Detail: `docs/evidence/`, the memory note, and the devlog's moved block.

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
5. **2026-09-20: the first `revisit-due` fires on BOSS's own tree.** Answer it with `outcome:`.
8. **`npm run check` is GREEN and the suite is green (2026-09-14)** — the 50 `[[EVID-NNN]]` links
   became bare ids (evidence is private forever; brackets promise a door), `docs/design/tokens.json`
   joined the shared-names list (fourth instance of the `RESUME.md` shape), and the 21 backlog findings
   the red `&&` chain had hidden for two days were closed (proofs, promotion pairs, vocabulary, INDEX).
   **Keep it green** — a red gate hides everything behind it.
9. **`/drift-deep` ran on this tree for the first time (2026-09-14) — verdict: drifting.**
   `docs/drift-audits/DRIFT-2026-09-14.md`. The bet (*will a real founder return*) is sharp and its
   experiment is written to the message; ~270 commits since 08-24 built what a returning founder
   would read back, and the maintainer message drafted 08-23 is unsent. Smallest re-aim: send it.
   Still open from the retro: `.claude/rules/feature-context.md` exists here; `docs/product/JOURNEY.md`
   not written (every row would be `assumed`) — at the second flow.

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
