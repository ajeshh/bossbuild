---
id: ENGINEERING
type: reference
owner: mentor-architect
status: active — BOSS's own engineering ecosystem; the founder-facing shape is extracted from this (IDEA-136 · B8, A1)
feeds: IDEA-136 (this is its B6), IDEA-137 (the second ecosystem built from docs/ECOSYSTEMS.md)
created: 2026-10-04
---

# Engineering — how BOSS's own code is built

**Who reads this:** a session or agent about to write code in `src/`, `scripts/`, `test/` or a shipped hook.
Read §3 (the map) before writing a helper; read §1 before arguing with a convention.

Everything below was **found living** in the code before it was written down — extracted, not
invented (`docs/ECOSYSTEMS.md` § Building a new ecosystem, step 1). Each rule says what enforces it.
**W** means *written only*: nothing fails when it is broken, and that is the list that rots.

## The centre

**The module** — one file, one job, named for the verb or noun it serves. Engineering grows around it
the way design grows around the component. It is planted **with** testing (every module's contract is
a test a person could run) and **beside** design, which stewards the one seam the two share: the
component index, read by the reuse check.

## 1 · Principles → guidelines → rules

Five. Each passes the test the design system uses: *could a reasonable person argue the opposite?*
Change one by the door in §8, not by working around it.

### 1. Fewer moving parts over convenience
*Opposite:* use the ecosystem — a flag, YAML or test library is cheaper than writing one.

- **Guideline:** write the thirty lines when the library would bring a tree; keep each hand-rolled
  piece small, with a header saying what it replaced.
- **Rules:**
  - Node built-ins only, always with the `node:` prefix. — **P**: CI has no install step, so an imported
    package fails, but only in a module some test loads. 492 of 492 imports hold today.
  - A needed library is a decision (`/decide`), never just an import. — **W**
  - ES modules everywhere; the shipped hooks pin `"type": "module"` in their own `package.json`, so a
    founder's CommonJS project can't break them. — **E** (`test/silent-damage.test.js`, bug 4)

### 2. One home per fact — and pin the copies a boundary forces
*Opposite:* a little duplication is cheaper than the wrong abstraction. (True — see the guideline.)

- **Guidelines:**
  - **Name a decision at two; write the helper at three.** A second copy is a note in the map; the third
    is the helper. Three separate *projects* is the bar for moving a pattern UP into what BOSS ships.
  - **When a shared helper grows a new parameter plus a new conditional for one caller, inline it back.**
    That is the sign of the wrong abstraction (Metz); widening is not always reuse.
  - **Derive, don't restate.** No number, count, roster or vocabulary is typed where it can be read
    from the files (`scripts/gen-site.js:5`, `src/modes.js:1-5`).
  - A fact both the CLI and a shipped hook need lives in the **hook lib** and `src/` imports it — never
    a second copy (`stages/L0-quickstart/template/.claude/hooks/lib/reentry.js:10-13`).
- **Rules:**
  - Check the map (§3) before writing a helper. — **W**
  - A copy forced by a boundary says so in its header **and** has a parity test. — **P**: two pairs
    are pinned (`test/yaml-parity.test.js`, `test/not-a-component-parity.test.js` — the second after
    the copy drifted and reached founders, IDEA-136 · F2); four are identical today and unpinned.
  - No import cycles; small shared utilities live at the leaves (`src/args.js:3-5`). — **W**. One stated
    exception: `board ↔ playbook ↔ design`, every edge annotated with its condition (call-time bindings
    only) and its exit (IDEA-136 · F1).

### 3. Honest output over confident output
*Opposite:* be helpful — infer, fill the gap, keep going.

- **Guidelines:**
  - **Forgive what a person wrote; refuse what a machine must trust.** A malformed doc reads as `{}`
    (`src/frontmatter.js:14-16`); a config about to be rewritten that doesn't parse throws
    (`src/config.js:34-44`) — writing over it would destroy what the person had.
  - An unknown shows as unknown (`src/playbook.js:11-13`: a hole is a hole). Detection reports
    candidates, never conclusions (`src/detect.js:11-15`, `src/ladder.js:9-14`).
  - An error offers the recovery it can compute (`failNotAProject` in `src/fail.js`).
  - The reason lives in the code: a module, gate or test opens with **why it exists**, usually the
    incident that made it. A deliberate exception carries its reason beside it.
- **Rules:**
  - The error policy is in the name: `readX` forgives, `readXForWrite` / `readXOrFail` refuses. —
    **E** for registry and config (`test/silent-damage.test.js`, bugs 1–2)
  - `src/` sets `process.exitCode` and never calls `process.exit()`; only `bin/boss` exits. — **W**
    (0 violations)
  - Shipped hooks exit 0 on every path; blocking goes through the JSON decision on stdout. — **P**
    (`secrets-guard.test.js`, `smoke-cli.js`; not every hook)
  - A network failure never exits non-zero. — **E** (`test/cli.test.js:421`)
  - `render*` returns a string and never touches the console; `print*` writes. — **W** (16 of 16 hold)
  - Every module opens with a WHY header. — **W** (42 of 42)

### 4. A mechanism over a remembered rule — where a bug reached a user
*Opposite:* write the convention down and trust people; or add the check before anything breaks.

- **Guidelines:**
  - A new gate names, in its header, the bug that reached a user. Not a near miss.
  - Test a check by breaking it in a sandbox; a check only ever seen passing has been a silent no-op
    before (`test/always-on-cost.test.js:5-7`).
  - A report that cannot fail stays out of the gate chain (`scripts/check-pattern-coverage.js:5-7`).
  - Put the fix in the failure message — the agent reading it acts on what it says.
  - **Built for several writers at once.** Concurrent sessions are the operating condition: any file two
    processes touch is written atomically, and tests never write the shared working tree.
- **Rules:**
  - Gates are soft by default and hard with `--strict`; a check that cannot run fails open
    (`scripts/hooks/pre-commit:50-53`). — **E** by construction
  - `writeFileAtomic` for registry, config and `settings.json`; `withLock` for read-modify-write. —
    **E** for the registry (`silent-damage.test.js`: concurrent registrations all survive)
  - Machine state lives under `BOSS_HOME`; the package is never written at runtime (`src/paths.js`). —
    **E** (`test/boss-home.test.js`)
  - Tests never write the shared tree, and never inherit the shell's `BOSS_HOME`. — **P**: the suite
    preloads `test/env-guard.js` (held by `test/test-env-isolation.test.js`); the tree rule is by habit
    (the last offender, `demo.test.js`, now sandboxes — IDEA-136 · F8)
  - A gate names its bug. — **W** (14 of 16)

### 5. Test the contract a person touches, not the implementation
*Opposite:* unit-test the internals; end-to-end is slow and flaky.

- **Guidelines:**
  - **Reproduce before you fix or gate** (CLAUDE.md rule 8). If the test you wrote passes on the old
    code, there is no bug — ship nothing.
  - A bug fix **adds** a test named for the bug; only a change in intended behaviour edits an existing
    test. Never loosen an assertion to make it pass.
  - Keep structural change and behaviour change in separate commits.
  - Assert the silence first: a guard's load-bearing behaviour is what it doesn't say
    (`test/design-tokens-guard.test.js:3`).
  - A structural test over source or shipped text is fine when it holds a cross-surface invariant, and
    it states its limits (`test/config-keys-have-readers.test.js:22-28`).
  - Judgment goes to evals (`npm run eval:*`), never to `assert`. Length is never tested as a threshold.
- **Rules:**
  - `node:test` and `node:assert/strict` only; fixtures are `{path: body}` maps (`test/helpers.js`). —
    **W**
  - CLI tests shell out to `bin/boss`; hook tests drive stdin → stdout the way the host does. — **W**
  - Anything that spawns runs with `NO_COLOR=1` and a temp `HOME` / `BOSS_HOME`. — **P** (`BOSS_HOME`
    is cleared for every test by the env guard)
  - A regression test is titled `REGRESSION:` (61 today). — **W**
  - Every test file opens with why: the incident, the invariant, or the FEAT it accepts. — **W** (61 of 62)
  - Every commit runs the **staged** tree through `test:ci` (`scripts/hooks/pre-commit`). — **P**: on per
    clone with `npm run hooks`; `--no-verify` skips once; CI repeats it on push.

## 2 · The seed — what was decided early because it gets dearer to reverse

| Decided at seed | Why it couldn't wait |
|---|---|
| Zero dependencies | removing a dependency tree later touches every module |
| ES modules, and the hooks pinned to them | a mixed module system breaks in a founder's repo, silently |
| Machine state under `BOSS_HOME`, never in the package | moving state later strands every install |
| The hook lib sits **below** `src/` | reversing an import direction is a rewrite of both sides |
| Atomic writes for anything shared | a torn registry loses projects; measured: 30 concurrent registrations kept 26 |
| Plan, then `--apply`, for anything destructive | a verb that acts by default can't be made safe after people rely on it |

**Deferred, on purpose:** a formatter and a linter (prose wraps near 100 columns; the renderers don't —
not yet a problem anyone hit); a size limit per module (the four large ones are the renderers);
TypeScript.

## 3 · The map — check it before writing a helper

**Direction.** Imports point down: shipped hook lib → leaves → state readers → domain → renderers →
`cli.js`. Nothing imports `cli.js` except `bin/boss`.

**`cli.js` shrinks as it's touched.** It holds 2,000+ lines and 23 `cmd*` handlers, and it's the file
concurrent sessions collide on most. When you change a handler, move it into the domain module it
already calls (`cmdSync` → `sync.js`, `cmdBoard` → `board.js`) and leave `cli.js` the dispatch line.
Never a big-bang split, which would collide with every open worktree. — **W** (IDEA-150 D3)

| Layer | Modules |
|---|---|
| Shipped hook lib (below `src/`) | `stages/L0-quickstart/template/.claude/hooks/lib/*` |
| Leaves (no internal imports) | `args` `atomic` `clock` `paths` `ui` `frontmatter` `page-shell` `glossary` `gitdates` `detect` `managed` |
| State readers | `config` `registry` `scaffold` `supersede` `modes` `fail` |
| Domain | `board` (projection) `records` `earned` `ladder` `sync` `remove` `hooks` `learn` `team` `brain` `conscience` |
| Renderers and verbs | `playbook` `design` `recap` `map` `help` `help-html` `craft` `patterns` `changelog` `update` `orientation` `readiness` `insights` `credit` |
| Top | `cli` |

**Against the grain today:** `board ↔ playbook ↔ design` (a cycle, F1); `design → hooks` (a renderer
reaching into a command module); `earned → board` (the earned check computes the whole board).

### Find this before you write one

| You need | Use | Not |
|---|---|---|
| Fail a command (text, or JSON under `--json`) | `fail.fail`, `failNotAProject` | `console.error` + `process.exitCode` by hand |
| Parse flags | `args.parseArgs` | a hand loop (brain.js had one; it got valueless flags wrong) |
| Write a file another process reads | `atomic.writeFileAtomic`; read-modify-write: `withLock` | `writeFileSync` on settings, config, registry |
| Any path to the package, stages, shelf or machine state | `paths.*` — `BOSS_ROOT`, `STAGES_DIR`, `PRACTICES_DIR`, `BOSS_HOME`, `REGISTRY_FILE` | `homedir()`, a local `ROOT` |
| "Is this BOSS's own repo?" | `paths.isBossRepo(dir)` | the registry's `selfHosted` flag |
| A day a person reads (src or scripts) | `clock.isoDay` / `isoMinute` | `toISOString().slice(0, 10)` (UTC — held for four scripts by `test/local-day-scripts.test.js`) |
| Terminal colour (src or scripts) | `ui.dim` / `bold` / `ok` / `warn` / `err` | raw `\x1b[` (ignores `NO_COLOR` — held by `test/scripts-honour-no-color.test.js`) |
| A doc's frontmatter, a field, a date, a status | `frontmatter.frontmatter`, `field`, `dateField`, `baseStatus`, `isParked`, `revisitDue` | `text.match(/^key:\s*(.+)$/m)` — breaks on `key: >` |
| `.boss/config.json` | `config.readConfig` / `readConfigForWrite` + `writeConfig`; `readCohort`, `readSourceGlobs` | inline `JSON.parse(readFileSync(…))` |
| The registry, a project's stamp or pin | `registry.readProjectStamp`, `projectPin` | another stamp reader (three exist — F3) |
| When a record was added or touched | `gitdates.firstAdded` / `lastTouched` | `git log` per record (the 378-process N+1) |
| Compare versions, parse the CHANGELOG | `changelog.cmpVersion`, `parseEntries`, `unreleased` | a local `cmpVersion` |
| A stage manifest, a template copy, a CLAUDE.md block | `scaffold.readStageManifest`, `applyStage`, `appendMarkedBlock` | — |
| Modes, skills, glosses on any surface | `modes.loadModes`, `skillGloss` | a typed list |
| HTML escaping, page chrome | `page-shell.esc`, `shellPage` | a local `esc` (gen-site's turns `0` into `''` — F4) |
| WCAG contrast | `design.contrast` / `luminance` / `grade` | — (the hook keeps its own, by boundary) |
| A record's first sentence or paragraph; markdown → HTML | `playbook.firstSentence`, `firstParagraph`, `blockMd`, `prose` | — |
| Markdown tables | `design.mdTables`, `design.clean` | — |
| Re-entry or evidence context | `hooks/lib/reentry.js`, `loop-runtime.readEvidenceContext` | a `src/` copy |
| A test fixture project | `test/helpers.project({path: body})`, `idea()`, `feat()`, `canvas()`, `cleanup` | an ad-hoc `mkdtempSync` tree |
| Review dates in a script (local) | `scripts/lib/freshness.js` | a copy |
| Keep a retired file's full text (an archive) | `node scripts/archive.js <dest> <files…>` — rewrites its links for where it now lives | `cp` (37 links broke that way, 2026-10-07) |

**Helpers that don't exist yet, and should** (each replaces copies already in the tree — F3): the
body under a heading (four implementations, different stop rules); a record's title without its id
(~13 inline); a project-stamp reader with the `installedLayers` fallback (retyped 7×); a timed HTTP
`get` for scripts (three copies).

**Naming.** Files: lowercase, usually one word; gates `check-<noun>.js`, generators `gen-<noun>.js`,
each with an npm script. Handlers `cmd<Verb>`. Export verbs say what they do: `read*` reads a file into
data, `render*` returns a string, `print*` writes, `collect*`, `plan*`/`apply*`, `is*`/`has*`, `parse*`.
Module-level data is `SCREAMING_SNAKE`. Tests are `<module>.test.js` or `<invariant-as-a-phrase>.test.js`,
with titles that are behavioural sentences. *Known collision:* `design.dim` (a dimension) shadows `ui.dim`.

## 4 · The planting moment

**BOSS's own engineering was never planted; it grew**, and the seed in §2 was decided release by
release. This document is the first time it is written in one place. The founder's planting moment is
an open question (IDEA-136 · Q3).

## 5 · Checks at the write

For BOSS's own code there are **none at the write** — no hook fires when a source file is written.
The checks run at commit (`scripts/hooks/pre-commit` → `test:ci`: `check-boundary`, `check-ladder`, the
unit tests) and on push (CI, three operating systems, Node 22 and 24, `smoke:cli`, `npm pack --dry-run`).
Most rules in §1 are **W**. Turning a W into an E needs a bug that reached a user (principle 4).

## 6 · The drift reader

**None for code.** The `npm run check` gates read docs, records, the site and the ladder — not the
code's own conventions. The first drift read of the code was done by hand (IDEA-136 · B1, B3, B7) and
produced F1–F10.

## 7 · Retirement

- **A helper absorbs its duplicates, and its header names them** — that is how a copy retires here
  (`src/ui.js:10-11`, `src/frontmatter.js:3-7`, `src/config.js:3-5`, `scripts/lib/freshness.js:1-3`).
- **A shipped thing that leaves names its successor** in `registry/supersedes.json`; `boss sync` reads it.
- **A rule that only exists in prose and is never enforced** is a retirement candidate: either it earns
  a mechanism (principle 4) or it comes out of this file.
- **A pattern the code has absorbed leaves the list.** Once a decision is a helper, the prose entry goes.

## 8 · Amendment

- **Who:** Ajesh decides. A session proposes, with the evidence.
- **How:** a load-bearing change is a `/decide` record. **Three exceptions to the same rule mean the rule
  is wrong** — narrow it, split it, or retire it, rather than recording a fourth.
- **A principle that stops passing** *could a reasonable person argue the opposite?* goes.

## Connections

**None declared yet.** BOSS's own engineering exchanges nothing through `registry/flows.json`; that
ledger holds the hand-offs between ecosystems in a founder's project. The founder-side engineering
ecosystem (IDEA-136, A-track) declares its flows as they are built — the reuse check reading the map is
the first.

## Where engineering disagrees with the draft guide

Written down for IDEA-137 · C7, which finalises `docs/ECOSYSTEMS.md` from the overlaps between design and
engineering.

1. **Part 1 needs an enforcement mark.** Design's rules don't say what enforces each one; engineering's
   turned out to need it, because most of them are written only and two of those have already broken
   (F1, F2). Proposal: every rule in every ecosystem carries **E / P / W**.
2. **Parts 4–6 can be empty for a long time and the ecosystem still works.** BOSS's code has no planting
   moment, no write-time check and no drift reader, and it holds — because a small set of tests and a
   pre-commit gate do the work. The anatomy may describe what an ecosystem *can* have, not what it needs.
3. **Principle 3 (repair before addition) is how engineering already retires copies** — consolidation
   into a helper whose header names what it replaced. It fits.
4. **A principle that seems shared across ecosystems:** *parse at the boundary, fail loud inside* turned
   up independently in four layers of the research (data, API, config, AI calls). BOSS's own form of it is
   principle 3 here — forgive what a person wrote, refuse what a machine must trust. A candidate for the
   shared set, if a third ecosystem shows it too.

## Known breaks

IDEA-136 · F1–F10 (BOSS's own code) — each a task, each reproduced before it is fixed.
