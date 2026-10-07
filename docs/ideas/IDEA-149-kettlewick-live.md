---
id: IDEA-149
type: idea
kind: capability
owner: coder
program: PROG-003
status: shipped (S1, S2, S5–S9, 2026-10-05; S3 and S4 wait on a first need)
shipped_on: 2026-10-05
proof: scripts/demo.js
proof_note: done when `npm run demo` lays Kettlewick down as a live project — this checkout's `boss` on its PATH, BOSS's real `adopt`, a git history, its own BOSS_HOME — and a test runs a command against it.
gist: Kettlewick as a live local project, so you don't have to build a throwaway app to check a change. One command lays the demo's records down outside the repo with a git history, installs BOSS the way a founder's install does, and gives you a shell where `boss` is this checkout's code.
created: 2026-10-05
relates: FEAT-039, IDEA-110, IDEA-120, IDEA-147
---

# IDEA-149 — Kettlewick, live

## Current shape

- **What:** today a check of the CLI means `boss new` in `/tmp`, then writing records by hand until
  the command under test has something to read (CLAUDE.md rule 6). Kettlewick (`demo/kettlewick/`,
  FEAT-039) already holds a full MVP-stage record set, with every chapter filled, kept that way by
  `check:demo`. It is only ever rendered into the site. Lay it down as a project instead:
  `npm run demo` → `$TMPDIR/boss-kettlewick/{kettlewick,home}` plus `env.sh`.
- **How it stays honest:** the install is BOSS's own `adopt --mode <the demo's stage>`, run with this
  checkout's `bin/boss`. Nothing is hand-stamped, so the live project is what a founder's install
  produces from these records. The history is built from the dates the records carry (`created:`,
  devlog entries) and authored by the fictional founder. It is generated, says so in each commit, and
  lives only in the temp copy, never in `demo/`.
- **Why it's safe:** it refuses to write inside a git checkout that isn't its own, and only `--fresh`
  wipes, and only a dir it marked (`.boss-demo`). The 2026-08-21 incident was a cleanup run in the
  wrong folder.
- **What it does not replace:** `boss new` / `unlock` are still the path to check when the command
  being changed is *those*. A blank project is a different state from a lived-in one.

## Work

- [x] **S1** · `scripts/demo.js` + `npm run demo`: copy, history, adopt, overlay the cohort/team the
  site render uses, `env.sh` (BOSS_HOME + a `boss` shim to this checkout), `--fresh`, `--dir`, the
  wrong-folder guard. A test runs `boss status` against it.
- [x] **S2** · CLAUDE.md rule 6 names `npm run demo` as the lived-in check, and `boss new` in `/tmp`
  as the blank one.
- [ ] **S3** · `--at quickstart`: the same venture earlier on (records up to a date, adopted at
  Quickstart). Builds when the first check needs an earlier state. Not before.
- [ ] **S4** · A `gen-demo` / `demo` shared core (the copy + overlay), when the second one drifts. Not
  before.
- **Answered (Ajesh, 2026-10-05):** IDEA-147's C7.2 uses this instead of three throwaway scaffolds.

### Every piece — what the demo lacked (inventory 2026-10-05)

Read from what every Quickstart and MVP skill writes (its SKILL.md paths), the earned predicates
(`src/earned.js`), and `src/detect.js`, against the record set:

- [x] **S5 · The app is code, not stubs.** The `src/components/*.tsx` return `null`, so `adopt` saw no
  styled screen and no model call, and held back `/design-tokens-init`, `/ai-cost`,
  `/ai-failure-states` and `/evals`. Needed: components styled from the tokens; one model call site
  (an AI-mediated FEAT); `package.json`; a runnable, dependency-free logic module with a test (so
  `/smoke` has something to run); CI; a deploy config (so `adopt` reads it as shipped and tested).
- [x] **S6 · The AI chain, for that FEAT:** FEAT-007 (the office drafts a cover ask with a model's
  help), `docs/ai-cost-budget.md`, `docs/cost-reviews/REVIEW-<date>.md`, `docs/ai-failure-states.md`,
  `docs/evals/FEAT-007.yml`, `.boss/cost-log.jsonl`; TRUST gains `PRIVACY.md` and `SUBPROCESSORS.md`
  (the model provider is now a subprocessor).
- [x] **S7 · Each MVP verb's record:** `/extract` (EXTR), `/red-team` (RT, incl. `--paths`),
  `/drift-deep` (DRIFT), `/roadmap` (ROADMAP + NO-LIST), `/onboard` (ONBOARD), `/money` (MONEY),
  `/practice` (PRAC), `/design-review` (reviews/), `/design-tokens-init` (tokens.json,
  DESIGN_TOKENS.md), `/prototype` (PROTOTYPES.md), `/pretotype` (its section in the idea),
  `/smoke` and `/ship` (`.boss/smoke.json`), `/close` (`.boss/brain/read.md`, `relationship.md`).
  Devlog entries for the sessions that wrote them.
- [x] **S8 · "Always": `check:demo` gains coverage.** Each Quickstart/MVP skill maps to the demo
  record that shows its output, or to a named reason it has none. A test fails when a shipped skill
  is in neither list, so the next new skill is a decision rather than a quiet gap. This enforces
  PROG-003's rule (*"a new record type adds its demo record in the same commit"*), which today
  holds only for playbook chapters.
- [x] **S9 · Found while building S7 (a founder-facing gap):** `src/places.js` lists only the folders
  BOSS knew about at FEAT-039. The founder's own home (`.boss/index.html`, *Where things live*) and
  the demo's page skip every other folder silently: `docs/programs`, `roadmap`, `red-team`, `evals`,
  `extractions`, `practices`, `drift-audits`, `onboard`, `money`, `cost-reviews`, `design/reviews`.
  Add them, and add a test that every folder a shipped verb writes has a place, so the next one
  can't fall off. This one gets a CHANGELOG bullet (a founder sees it).
- [x] **S10 · Found at landing (2026-10-07):** S7 named `library/manifest.json` under
  `/design-tokens-init`. That file is V1's `/design-library` output (`docs/design/library/`), which waits on
  `--at v1` below; MVP's `/design-tokens-init` writes `tokens.json` + `DESIGN_TOKENS.md`, both on the demo. S7's
  line corrected; nothing to add.
- **Deliberately absent:** `docs/POSTMORTEM.md` (a whole-venture sunset; Kettlewick is alive),
  `.boss/feedback.log` (feedback to BOSS's makers, not the venture's), `.boss/backups/` (`boss-sync`'s
  undo). V1/Scale's `board`, `design-library`, `incident` and `design-drift-loop` wait for `--at v1`.
- The site's `site/demo/` regenerates from these, so every new record is public fiction: no real
  person, company or quote.

## Capture log

- **2026-10-05** — Ajesh: *"build kettlewick into a full local demo, so we dont have to do a whole
  throwaway app often to validate. it can literally mock up everything we need."* Feasibility run
  before capture: `boss adopt --mode mvp` on a copy installs 101 files and keeps 4 of the demo's own.
  `boss status` reads it as a live MVP project (building FEAT-003, the ladder 2/1/1, ready for V1).
  What it lacked was a git history and a shell pointed at it.
- **2026-10-05** — Ajesh: *"what kettlewick doesnt have, lets build it, so its always got all the pieces."* Inventory
  (§ Every piece) → three builder lanes in parallel (app, AI chain, each verb's record) plus the gate.
  Result: a fresh `npm run demo` adopts with nothing held back (39 skills, `deferred` empty, where four
  were held before). The app's own `npm test` passes 24/24 with nothing installed (10 more need its
  packages) and `npm run smoke` is green. `check:demo` maps all 39 Quickstart+MVP skills (34 to a
  record, 5 to a named reason) and fails an unmapped one. Found on the way: S9 (the home page dropped
  10 folders), and the new main guards had to use `realpathSync` (a temp-dir symlink made the probe
  pass by never running: the IDEA-095 shape).
- **Reconciled across lanes:** quiet hours are 6:30 everywhere (FEAT-005, DEC-003). QuietNotice stays a
  *proposal* (the `.tsx` the app lane built was removed: the demo's one request for a part is on
  purpose). FEAT-001 logs that *qualified* became the owner's call because the import keeps four
  fields. CI and the Dockerfile use `npm install` (no lockfile in a demo).
- **Left open, on purpose (they are the demo's live threads, and RESUME carries them):**
  `POST /api/ask/draft` has no session check (RT-2026-09-17 records it as accepted); two RT cases are
  not yet in the eval set; there's no HEALTH record after 09-07; the canvas heartbeat is stale (the drift
  audit asks for it).
