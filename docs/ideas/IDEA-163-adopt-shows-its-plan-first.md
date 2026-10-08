---
id: IDEA-163
type: idea
kind: capability
owner: product-lead
status: exploring
created: 2026-10-08
relates: IDEA-005, IDEA-073, IDEA-118, IDEA-162, IDEA-153
proof: test/adopt.test.js
proof_note: S1 (the preview) ships with its test; S2 and choosing parts are still open
gist: `boss adopt` says what it found and what it would change before it changes anything, and an adopted repo's own record layout is read instead of ignored.
next: Ajesh confirms the finding shape and where findings live; then build the grouped preview + baseline
---

# IDEA-163 — Adopt shows its plan first

Ajesh, 2026-10-08, relaying a founder who ran `boss adopt` on a repo that already had its own way of
working: they wanted to see what it would change before it changed anything, take some of it and not
all of it, or not all at once. The same founder hit a layout mismatch on install (below).

## What's true today (reproduced 2026-10-08, throwaway repo, own `BOSS_HOME`)

- **Adopt is the one door that writes on first run.** `boss sync` and `boss remove` preview by default
  and act on `--apply`; `boss adopt` lays down ~76 files, appends to `CLAUDE.md` / `AGENTS.md` /
  `.gitignore`, merges hooks into `.claude/settings.json`, and registers the project, then reports.
  The assessment (`/read-repo`) is a skill adopt installs, so it can only run after.
- **Records outside `docs/ideas/` are invisible.** A repo keeping `docs/features/FEAT-001-login/README.md`
  with `status: building`: the session-start hook says nothing, `boss board --next` says *nothing in
  flight*. The same file copied to `docs/ideas/FEAT-001-login.md` shows in both. Readers that assume
  the flat path: hooks `working-state.js`, `resume-reading.js`, `task-hygiene.js` (`docs/ideas` +
  `docs/programs` only); CLI `board.js`, `insights.js`; `records.js` lists `docs/features` but reads
  only flat files in it, never a folder per record. Adopt itself never says it couldn't see them.
- **Detection ignores records.** The same repo adopted at Quickstart (*1 source file*) with a FEAT
  already in build.

## Shape (proposed, not decided)

- **S1 — preview by default, `--apply` acts**, same as sync and remove. The preview is the assessment:
  the mode it reads and why · what it would add, grouped (skills, agents, hooks, `docs/` surfaces) ·
  what of yours it would append to, by name · **what it can't see** (records in a layout it doesn't
  read). Taking part of it already has two levers — `--mode` and the opt-in hooks — and the preview
  should name them.
- **S2 — read the layout the repo already has.** Either readers learn folder-per-record
  (`<dir>/<ID>-*/README.md`), or adopt writes the found location into `.boss/config.json` the way it
  writes `sourceGlobs` (IDEA-073) and every reader honours it. Never move the founder's files.

Ajesh, same day, on the direction: this is adopt's whole UX — how a person goes through integrating
BOSS into a project that already works, not only the docs layout. **Investigate first, then see to what
degree and which aspects someone wants to adopt; never overhaul an existing project.** The journey,
stage by stage with file:line, is `docs/design/ADOPT-JOURNEY-2026-10-08.md` (designer). Its main read:
the preview fixes first contact; what still breaks is *convention* — adopt writes "every idea goes to
`docs/ideas/`" into the founder's AGENTS.md, and from then on what they already keep is either not read
(board, session hooks) or given a second home (`/spec`, `/close`, `/log`).

## The reframe (Ajesh, 2026-10-08)

Adopt is not an install. It is: **take stock of how this project already works → compare it with BOSS,
part by part → snapshot what they have → take the parts they choose → reconcile later.** Some of their
mechanism is already on par, some needs a tweak, some BOSS adds; nothing of their organization's way of
working gets trashed. Ajesh: group the parts finely (agents by discipline, not one bundle), and ask
about the ecosystem too — the design library, the playbook, how documents are organized, how the work
is managed.

**The parts, grounded in what the three modes ship** (manifests, 2026-10-08):

| Part | What BOSS brings | What theirs would look like |
|---|---|---|
| Working rules | the block in CLAUDE.md / AGENTS.md, `.claude/rules/` | their own CLAUDE.md, AGENTS.md, contributing guide |
| Documents & records | IDEA / FEAT / DEC / EVID / PRAC / PROG with ids and frontmatter, INDEX, `boss records` | `docs/features/`, ADRs, specs, a wiki folder |
| Project management | `boss board`, `next:` on a record, RESUME, devlog, `/spec` `/close` `/log`, programs, `/roadmap` | issues, a RESUME/devlog/changelog of their own, a tracker |
| Session memory & conscience | reentry hook, conscience + loops | their own session hooks, none |
| Agents — product | product-lead, planner, prompt-coach | their own `.claude/agents/` |
| Agents — engineering | coder, tester, mentor-architect | 〃 |
| Agents — design | designer | 〃 |
| Agents — venture mentors | mentor-founder, -customers, -cofounder, -capital | — |
| Skills — discovery | idea, canvas, scout, interview, evidence, pretotype, persona, inbox | their own `.claude/skills/` |
| Skills — build & quality | spec, prototype, smoke, evals, red-team, ai-cost, ai-failure-states, judge-traces, extract, drift-deep, revalidate | tests, CI |
| Skills — launch & grow | ship, landing, onboard, health, money, trust | deploy config, analytics |
| Skills — decisions & team | decide, consult, practice, sunset | ADRs |
| Design system | design-tokens-init, design-review, design library (`boss design`), the design guards | a tokens file, Storybook, a component dir |
| Playbook | `boss playbook` — the venture as one page | a pitch doc, a one-pager |
| Guards | secrets, smoke, test-assertion, schema, design guards (all opt-in) | their own pre-commit / CI checks |
| The ecosystem | `boss sync` updates, the `~/.boss` registry, a pinned BOSS version | — |

**Two reads, one mechanical and one judged.** The CLI preview detects what they *have* per part (cheap,
no model). Whether theirs is on par, needs a tweak, or BOSS adds something is judgment — `/read-repo`
in an assess-only pass, reading the snapshot against BOSS's part.

**The baseline, not a snapshot** (Ajesh: git already keeps the before). Adopt records the commit it
started from (`adoptedFrom: <sha>` in `.boss/manifest.json`); the reconcile diffs against it, and
`boss remove` already restores from git. A dirty tree is said in the preview: commit first, so the
baseline is theirs and whole. What was missing was never a copy — it is **the reconcile**.

**Bare `--apply`** takes records, project management and session memory; every other part is named.

## The reconcile — how BOSS shows a difference (Ajesh, 2026-10-08)

*"The way we talk and show the differences, what improvements, and why, and what level of improvement…
a badly designed system, how may it improve with ours. It's all about context, and showing in context…
eventually all the code, and it might lead to refactors."*

Two existing positions shape it. `/read-repo` is **position, never a grade** — so "level" is never a
score on their work; it is **the size of the change and what it buys**. And IDEA-074: a refactor's host
is **a breakpoint, not a calendar** — so a code finding is offered when the work next touches that code,
never as a cleanup wave.

**One shape for every finding, docs or code:**

- **Theirs, in context** — the file and lines, quoted, and what was counted (never asserted).
- **What BOSS would change** — shown in *their* file with *their* names, as a diff or a sketch.
- **Why** — the failure it prevents, tied to something already in their repo, never a generic best practice.
- **Size** — *keep* (on par: say what's good, and BOSS reads theirs) · *tweak* (a few lines, one place,
  reversible) · *rework* (a convention across files) · *refactor* (code restructure).
- **What it buys, and what skipping it costs** — in their terms.
- **When** — on apply · the next time you touch `<path>` · only if `<thing>` happens.

**Example — a design system that grew by accident:** *theirs:* 31 distinct hex values across 22 files,
9 of them blues within a few shades of each other; three button components (`Button.tsx`,
`PrimaryBtn.tsx`, `ui/button.tsx`). *Change:* the 9 blues become 2 tokens (`color.action.primary`,
`color.action.hover`) — shown on their `Button.tsx`, 4 lines; the three buttons become one, at the
breakpoint. *Why:* a retheme today edits 22 files and misses some. *Size:* tokens = rework (mechanical,
reversible); the buttons = refactor. *When:* tokens on apply if taken; buttons the next time a FEAT
touches a button.

**Where findings live:** one reconcile doc per run (`docs/adopt/RECONCILE-<date>.md`, a section per
part, in their layout), the accepted ones become tasks on the record of the work that will touch them —
no new record type. Code findings carry their paths, so they come back at the breakpoint.

## Tasks

- [x] S1: `boss adopt` previews; `--apply` writes. Callers moved: `scripts/demo.js`, tests, README,
      GUIDE, `web/index.html`, `web/start.html`, help. The preview's file count equals what `--apply` adds.
- [x] S1: the preview's *can't see* group — records under `docs/` outside the folder each kind is read
      from, frontmatter-checked (`unreadRecords`, `src/detect.js`).
- [x] `/welcome`'s adopted branch no longer offers re-adopting with `--mode` (adopt refuses an adopted repo).
- [x] The preview says which two hooks run from the start, instead of implying every hook is opt-in.
- [ ] S2: one reader for "where are this repo's records" (flat and folder-per-record), in the hooks lib
      that `src/` already imports from; adopt writes the found location into `.boss/config.json` on apply,
      as it writes `sourceGlobs`; the preview says it as a default ("BOSS reads your FEATs here and writes
      new ones here").
- [ ] The AGENTS.md block adopt appends names `docs/ideas/` — it should name where *this* repo keeps ideas.
- [ ] `/close` and `/log` keep an existing RESUME / devlog rather than starting a second (reproduce first).
- [ ] `/read-repo` assess-only: with no `.boss/manifest.json`, the position read and nothing written, so
      the preview can hand off to it before apply. Check Claude Code doesn't stall reading outside the project.
- [ ] Detection: a FEAT at `building` counts toward MVP.

## Found while building

- [ ] **Suspected, not reproduced:** `boss id` could hand out a FEAT number already used by a
      `docs/<other>/FEAT-*/README.md` record — the prose scan runs only inside `RECORD_DIRS`.
- [ ] `boss hooks disable` reaches only the opt-in hooks; conscience and reentry can only be paused.

## Open questions

- **Q1** · ~~Which first~~ — answered 2026-10-08 (Ajesh): investigate first; S1 shipped.
- **Q2** · S2 by convention or by config? Designer recommends both: one reader that understands both
  layouts, and adopt records the found path — the preview shows the guess, so `--apply` is consent to it.
- **Q3** · ~~Is a per-group skip earned?~~ — answered 2026-10-08 (Ajesh): yes in spirit — *which aspects*
  someone adopts is the point. How is Q4.
- **Q4** · ~~Which parts stand alone~~ — answered 2026-10-08 (Ajesh): the parts table above; bare
  `--apply` takes records, project management and session memory.
- **Q5** · Is the reconcile the second pass of `/read-repo` (position first, then part by part), or does
  each part hand to the skill that owns it (design system → `/design-review`, code → `mentor-architect`)?
- **Q6** · How do parked code findings come back at the breakpoint — a conscience loop keyed on the
  paths a FEAT touches, or only when `/spec` writes the FEAT?
