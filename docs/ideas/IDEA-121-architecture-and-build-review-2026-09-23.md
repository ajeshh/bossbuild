---
id: IDEA-121
type: idea
kind: capability
owner: Ajesh
status: ready
proof: none
proof_note: each task below names its own proof; the record is done when every box is ticked or moved to its own id
gist: Four-lane read-only review (build process, CLI, hook runtime, shipped content), 2026-09-23. Three silent data-loss bugs, a shipped hook that dies under a CommonJS package.json, a conscience that injects ~3k tokens per first prompt off a word-match, and CI red on Windows for ten days with nobody reading it.
created: 2026-09-23
program: harness
relates: IDEA-119, IDEA-120, IDEA-087, IDEA-102
---

# IDEA-121 — Architecture and build review, 2026-09-23

Ajesh: *"review how we build boss, and also over all boss architecture and implementation for
potential improvements."* Four parallel read-only reviewers; the headline claims re-verified by hand
(marked ✓v).

**Tier 1 fixed 2026-09-23** — each with a test in `test/silent-damage.test.js` that fails on the
old code (run against HEAD in a worktree). Not done in that pass: the dynamic `import()` inside the
hook's try (conscience.js:19) — the package.json removes the crash that motivated it.

## Tier 1 — silent damage (fix first; each is small)

- [x] **Registry wipe / lost writes.** `src/registry.js:5-17` — `load()` returns `{projects:[]}` on a parse
  error, `save()` is a non-atomic `writeFileSync`. Measured: 30 concurrent registers → 26 kept; a torn
  file + one register → 1 entry. ✓v. Fix: temp+rename; writers throw on parse error.
- [x] **`boss team add` erases a hand-typo'd `config.json`.** `src/team.js:47,92` via `readConfig` → `{}`
  (`src/config.js:19`). Measured: github/visibility/license/cohort gone. ✓v. Also the hook writes
  config non-atomically (`loop-runtime.js:811,863`). Fix: writers use the throwing reader; atomic write.
- [x] **`boss learn` breaks DEC-019.** `src/learn.js:167-186` bumps VERSION + package.json and prepends a
  numbered section above `## Unreleased`. ✓v. Fix: bullet under Unreleased; no version writes; `cli.js:1407` copy.
- [x] **Shipped hooks crash under `"type": "commonjs"`** (what `npm init -y` writes). conscience + reentry
  exit 1 on every prompt; the conscience is silently dead. ✓v (Node 24). Fix: ship
  `.claude/hooks/package.json` = `{"type":"module"}`; dynamic import inside the try (conscience.js:19).

## Tier 2 — the conscience breaks its own thesis ("says one thing")

- [x] **No cap on injected signals.** `moment-frames.js:68-109` joins every open signal. bossbuild's first
  prompt: 11.4KB / 5 signals. Real ledger: 57 fires, median 7.4k chars, 489k total. Fix: rank, inject one
  frame + a one-line list of the other loop ids.
- [x] **"Calls an LLM" is a word match.** cost-budget + ai-failure-state loops fire on a README, a JSON
  fixture, a test comment — and on `src/earned.js:36`, BOSS's own copy of the regex; misses a real
  Gemini call. Fired on 43/57 prompts here. Fix: extension filter (`SOURCE_EXT`), exclude fixtures/tests/evals,
  match import/constructor shapes, build earned.js's copy from fragments.
- [ ] **Dedup is per session, keyed by moment.** New session / `/clear` re-sends the full block; loops
  sharing a moment silence each other. Fix: key on loop id + evidence hash; re-voice on change.
- [x] **Two frontmatter parsers disagree.** hooks `lib/yaml.js` drops every key after a wrapped/`>`
  field: 37–157 keys across this repo (25 IDEAs lose `created`); read by `orientation.js` (boss status),
  the hook, check-freshness/manifests. Plus `craft.js:24` and `help-html.js:192` regexes. Fix: port the
  multi-line block into yaml.js + a parity test over docs/** and library/**.

Tier 2 parser parity fixed 2026-09-23 (IDEA-124's session): `yaml.js` folds block, wrapped-plain and
open-quoted values into one token, measured from the key's column (a `- id:` item's siblings sit at
that column). 102 lost keys → 0 across 537 docs; every changed `.md` value is a completion of the
old one; the one eval-file change is a `why: >` that read as `>`. `craft.js` and `help-html.js` now
call `src/frontmatter.js`. `test/yaml-parity.test.js` walks docs/library/stages both ways.

Tier 2, first two items fixed 2026-09-23 (`test/conscience-one-thing.test.js`, 27 cases, 14 fail on the
old code). Still open: cross-session dedup (a new session re-voices the top signal), and the parser parity.
Voiced + named signals are all marked said — the rest wait for the next session, never drip per prompt.

## Tier 3 — always-on cost and drift in what ships

- [x] **MVP per-turn bill ~7.6k tokens** (skills 10.1KB + agents 6.6KB + CLAUDE.md 13.6KB). L1
  `claude-append.md` "Git workflow" + "Shipping" (~4KB) duplicate practices. Fix: 2-line pointers to `boss craft`.
- [x] **Agent descriptions uncapped and uncounted.** mentor-capital 1,073B, designer 871B; check-manifests'
  printed bill omits agents + CLAUDE.md. Fix: apply DESCRIPTION_CAP to agents; count them.
- [x] **`{{DATE}}` filled at sync** (`src/sync.js:445`, 16 files) → 9 files "changed" daily; stale
  literal dates Claude obeys (`cost-review` REVIEW-<install date>). ✓v. Fix: leave a runtime placeholder.
- [x] **CLAUDE.md block never syncs** (not in managedFiles). ✓v. Fix: manage the marked block, report-only first.
- [ ] **MVP unlock cliff.** 15→31 skills; design skills + designer before any UI. Fix: an earned `ui` group.
- [ ] **Merge candidates** (subtract mandate): health+measure+onboard; ai-first-init as the lay-down message;
  ai-cost+cost-review. ~28→24. Needs Ajesh's call — not mechanical.
- [ ] **secrets-guard bypasses** (`cat .env|head`, `cat <.env`, Grep tool, .pem/.ssh/.aws). Fix: boundary
  chars, Grep/Glob, mirror deny globs; header says speed bump, not boundary.
- [ ] Mentor block copied into 6 files with no detector — one byte-identity assertion.

Tier 3, first two items fixed 2026-09-23: fresh MVP scaffold 30.3KB → 24.0KB per turn (~7.6k → ~6.0k
tokens). The CLAUDE.md block now syncs (region-scoped provenance, `test/claude-block-sync.test.js`), so existing
projects get the trim on `boss sync --apply`.

## Tier 4 — how BOSS is built

- [ ] **CI red on Windows since 2026-09-13** (11 tests; last green `f87a62d`). ✓v. Nobody reads it. Fix the
  tests (path separators/CRLF, inferred) and add `gh run list -L1` to RESUME's ground-truth block.
- [ ] **RESUME carries computed facts that went wrong**: version 0.325.0, "51 commits ahead" (real: 1 ✓v),
  a due date already past. Fix: delete them; check-dogfood fails on version ≠ VERSION.
- [ ] **No commit-time gate.** `npm test` is ~5s. Fix: tracked `scripts/hooks/pre-commit` + `core.hooksPath`.
- [ ] **`BOSS_HOME` override** (`src/paths.js:22`) so smoke/tests/throwaways never touch `~/.boss`
  (2 /tmp entries leaked; retires rule 6's prune step).
- [ ] **Session read-in ~11k tokens; MEMORY.md is 4.2k of it** (one entry 5.7k chars on one line). Cap
  entries ~300 chars; history into topic files.
- [ ] Commit subjects median 104 / p90 323 chars — ≤72, rationale in the CHANGELOG.
- [ ] CHANGELOG 1.14MB = 30% of the npm package. Ship a recent-N file.
- [ ] Untested: registry, conscience pause/mute, help-html, insights, map. registry test would have caught tier 1.
- [ ] Readers duplicated across board/design/playbook (two readDecisions, five esc); playbook's revisit-due
  ignores status and uses UTC (`playbook.js:498` vs `records.js:407`). *Revisit half fixed 2026-09-23:
  one `revisitDue()` in `src/frontmatter.js` read by both (`test/revisit-due.test.js`); the
  duplicated readers are still open.*
- [ ] IDEA-120 (worktree per session) would retire ~6 standing rules.

## Keep — the reviewers agreed these are right

Sync's provenance ledger never overwrote a founder edit · the earned-group mechanism · fail-open hooks
(bad stdin/config/regex → silent) · `src/frontmatter.js` + `clock.js` as the single rules · gates are fast
(check 1s, 561 tests 4s) · DEC-019 · performance (every command ≤0.13s on this repo).
