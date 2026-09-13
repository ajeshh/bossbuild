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

- **v0.318.0 committed (`e035ce2`), not pushed** — IDEA-102: RESUME is a briefing with a window.
  `boss status` reads the window; `/close` writes it; the old file and `RESUME-ARCHIVE.md` are in the
  devlog verbatim; the archive is gone.
- **v0.319.0 committed (`5c35568`), not pushed** — `/skill-doctor` ran in a fresh MVP scaffold: **all 45
  descriptions resident every turn (~4.7k tokens); 10 of 45 ever invoked on this machine, 35 never**
  (n=1, BOSS-on-BOSS — not a cut list). `/extract`'s description was truncated at `PRINCIPLE #1` (YAML
  comment) — fixed, gated in `check:manifests`, two tests. **RVW-102 ADAPT**: `context-discipline.md`
  move 1b (budget the list; measure with the instrument; judge a cut by distinguishability + observed
  use, never count).
- **v0.320.0 committed (`48fcff9`), not pushed** — IDEA-103 built: `plugin/evals/door/`, two graders,
  `npm run eval:plugin`. **With the plugin 1.0, without 0, Δ = 1.0**, ~$0.20 a run — the first measure of
  *does the plugin change what the model does*. Needs a host with `plugin eval` out of early access
  (PATH `claude` is 2.1.236 and refuses; the VS Code-bundled 2.1.269 runs it).
- **v0.321.0 committed (`259d152` + `b5e9dc1`), not pushed** — second eval case, the repo door: with
  1.0 / without 0.33 / Δ 0.67 (the baseline passes "ran nothing" by running nothing). `model-routing.md`
  notes `effort:` as a shape knob, artifacts still inherit; `check-refs` caught the practice naming
  `/recalibrate` (ships to nobody) — reworded. RubyGems grepped: nothing covers a pipeline executing
  repo-controlled config; held for the Nov 9 security sweep with the grep answer in the inbox file.
- **v0.322.0 committed (`f387d67`), not pushed** — IDEA-101 shipped: `/boss-learn` out of the L0 template,
  `/extract` checkout-aware (promotes via `boss learn` where a checkout exists, records UP-pending otherwise),
  supersedes row, 38 shipped mentions rewritten, BOSS's own workspace on `/extract` too. `boss sync` on a
  0.321.0-pinned throwaway printed the migration. 48 → 47 shipped skills.
- **v0.323.0 committed, not pushed** — model attachment let go: shipped surface was already clean (v0.135.0);
  residue removed — `/vet` asks for the shape not `model: "fable"`, `/recalibrate` rewritten around its
  four honest triggers, `model-routing.md` says `.boss/model-profile.json` is where a binding WOULD go
  (it never existed — four months of two skills describing updates to a file nobody wrote), four
  shipped vendor-model examples → *cheap tier / capable tier*.
- **v0.324.0 committed (`27e9252`, main fast-forwarded from `assess/board-2026-09-12`), not pushed** —
  the board assessment applied (`docs/retros/2026-09-12-board-assessment.md`; 17 reviewers, the splits
  kept). MVP unlock lays down 16 skills not 28 (`earned` in the manifest — postLaunch after first ship,
  a new `aiMediated` group on first model call; `boss status` says, `boss sync` lays down); `/boss` is
  the door any day (position + intent, verb named after the act); `/evidence` = record/debrief/digest,
  `/research` retired, `/interview` prep-only; `boss status` 2.4s→0.17s (378 git spawns→2); drift +
  focus loops can open on BOSS for the first time (both fired this session); 202 lines of BOSS
  bookkeeping out of shipped text + a gate; one checker list, `check:external` for Ajesh's numbers,
  release refuses a stale VERSION; loops → `.boss/loops` with fallback; old-vintage sync test
  (v0.267.0 → now) passes; one sentence in PRINCIPLES.md, quoted everywhere. 15 commits, 448 tests.
- **v0.325.0 committed, not pushed** — `/boss:welcome` is the everyday door by POINTER (DEC-017 intact);
  `claude plugin eval --scaffold` on both everyday-door cases: with 1.0 / without 0 / Δ 1.0.
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
- **IDEA-106 captured (2026-09-13)** — the playbook: the canvas as boxes + the why, personas, rivals,
  evidence and DECs as one on-brand single-file HTML, every block liftable into a deck. Design plan is
  in the record; the honest next step is a **mock** over BOSS's own records, not a build. Board: 5 captured.
- **The external evidence is still n=3 signals / n=2 founders, all `stated-pain`.** Nobody has been
  observed using BOSS, nobody has committed anything. The mandate holds: compose and **subtract**,
  never add a skill. Detail: `docs/evidence/`, the memory note, and the devlog's moved block.

## Next (in order)

1. **The four Captured cards are the whole open queue** — 070 (what commits/what goes public: the
   adopted-repo `.gitignore` gap), 074 (the contraction verb, n=0), 081 (Remote Control: two DECs to
   write — per-person state, push), 087 (un-ignore `docs/` — Ajesh's door). None is a build today;
   081's two DECs are the cheapest honest move.
2. **2026-09-20: the first `revisit-due` fires on BOSS's own tree.** Answer it with `outcome:` on the
   record — the mechanism's first real use.
3. **`/vet` Cagan's 2026-09-11 retraction #2** (*"teams over-invest in validating problems"*). Inbox it first.
4. **Watchlist needs a row for the project/PM rung** (`planner`, `boss board`, `program:`).
5. **Docs-accuracy found task:** CLAUDE.md's repo map and `/vet` step 2 name `library/agents|skills|
   hooks|memory-seed/` — none exist. Fix the sentences.
6. **`npm run check` is red at 50 since `d20f15d` (IDEA-087):** `[[EVID-NNN]]` links in now-tracked
   ideas/verdicts point at evidence that stays gitignored. Not a regression to chase — `check:refs` needs
   to know evidence is private by design (skip or soften the EVID class), not un-ignore it.
7. **Two dogfood gaps from the `/retro`:** `.boss/brain/` (run `/read-repo`), `/drift-deep` never run here.

**Above all of these, unchanged: publish (npm is behind — `npm run check:published` says by how
much) and Phase 3 outreach. Both are Ajesh's.**

## Waiting on Ajesh — each is a yes/no; the work is done

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
