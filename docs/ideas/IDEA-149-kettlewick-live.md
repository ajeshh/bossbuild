---
id: IDEA-149
type: idea
kind: capability
owner: coder
program: PROG-003
status: building
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
- **Open question:** should IDEA-147's C7.2 (*"three throwaway scaffolds"*) use this? One venture
  is one shape, and C7.2 wants three.

## Capture log

- **2026-10-05** — Ajesh: *"build kettlewick into a full local demo, so we dont have to do a whole
  throwaway app often to validate. it can literally mock up everything we need."* Feasibility run
  before capture: `boss adopt --mode mvp` on a copy installs 101 files and keeps 4 of the demo's own.
  `boss status` reads it as a live MVP project (building FEAT-003, the ladder 2/1/1, ready for V1).
  What it lacked was a git history and a shell pointed at it.
