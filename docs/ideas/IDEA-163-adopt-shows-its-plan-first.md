---
id: IDEA-163
type: idea
kind: capability
owner: product-lead
status: exploring
created: 2026-10-08
relates: IDEA-005, IDEA-073, IDEA-118, IDEA-162, IDEA-153, IDEA-172, IDEA-174, DEC-024
proof: test/adopt.test.js
proof_note: S1 (the preview) ships with its test; S2 and choosing parts are still open
gist: `boss adopt` says what it found and what it would change before it changes anything, and an adopted repo's own record layout is read instead of ignored.
next: paused (Ajesh, 2026-10-08) until PROG-006's floors are built — then re-read what's left against them
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

## ⏸ Paused — 2026-10-08 (Ajesh)

*"Lets pause before the ladder system is complete because it may help cure a lot of adopt and change
the shape of adopt moving forward."* Landed on main: the preview, the baseline, records read where they
live, `theirs` (sync never overwrites the founder's files), the monorepo and naming reads, and
**Security as the bare `--apply`**. Everything still open below waits for PROG-006's floors (Lobby,
Mailroom, Office, Studio, `boss up`), because several of these may dissolve or change shape there:

- **`--take`** — the parts list itself is now **IDEA-174** (PROG-006 Q13, Ajesh), started from this record's
  parts table and the `planStageSafe` seam; `--take` stays here and reuses that list. Security is **IDEA-172**
  (shipped, built under this record).
- **Agent overlap by trigger words** — Studio is where the build agents arrive; how it holds a generic
  agent against a repo's specialist is Studio's question first.
- **The layout map beyond records** (devlog, RESUME, worktrees) and **"couldn't look"** — the Office is
  where RESUME and the devlog land. Q8 (`boss layout`) is decided there.
- **`.gitattributes`, the CLAUDE.md pointer, the AGENTS.md rules, the write contract, existing session
  hooks** — each is a question of what a floor lays down.
- **`boss remove` / `boss sync` on Security** — the elevator (`boss up`) and its way down set the shape.
- **The reconcile** (finding shape, Q5, Q6) — unchanged by the floors; resumes with the rest.

**Re-open when:** PROG-006's floors 2–4 and `boss up` are on main. Then re-read every open task here
against them before building any — drop what the floors cured.

## Tasks

- [x] **Security (floor 1) is the bare `adopt --apply`** (DEC-024, Q7) — shipped 2026-10-08, with the climb (`adopt --mode` from floor 1). `--take` and the parts export are still open: deny/ask rules, the secrets pre-commit
      check, the `.gitignore` block — nothing else. The plan is built from named parts; `--take <part>`
      adds one; the preview shows the plan for what was asked. Lands after DEC-024 reaches main.
      **The seam with PROG-006 (agreed 2026-10-08):** IDEA-163 exports the parts — each a name plus the
      files, hooks and settings it lays down, read from `stages/` (never copies) — and adopt's plan and
      preview take a list of part names. PROG-006 adds `--room <floor>` (floor → its parts → this plan)
      and owns `room:`'s stored value (name or level key, Ajesh to decide). Nothing here depends on it.
      **Security slice (2026-10-08, DEC-024 on main):** bare `--apply` merges deny/ask (no hooks), lays
      `commit-secrets.js` + the pre-commit shim, the `.gitignore` block, a stamp with `floor: 1`, and a
      registry row — nothing else. `--mode <m>` stays the whole of BOSS at that mode (modes live only in
      the Boardroom). The bare preview shows the Security plan and names the mode the repo reads as.
      Probed on a hand-made floor-1 stamp: nothing crashes; `status`/`map` said *You are here: undefined*
      (fixed: `whereLabel`). Found building it: detection ran only without `--mode`, so `--mode mvp` on a
      live repo lost *shipped before* and held the after-you-ship skills — detection now always runs.
- **Pre-land review of Security (2026-10-08), fixed:** `unlock` on floor 1 laid Quickstart down and kept
  `floor: 1` — it now refuses and points at the climb; the climb reported Security's own `settings.json`
  and `.gitignore` as the founder's — Security now records which were already theirs and the climb reads
  that; the preview's pre-commit line now asks the installer (`installCommitGuard(..., { dry })`), so
  `core.hooksPath` is said, not promised over; the climb keeps `createdAt`; Security runs no hook
  migrations (it registers no hooks, so a migration could only delete one).
- [ ] `boss sync` on a Security project keeps its deny/ask and secrets script current (today: no layers → nothing).
- [ ] `boss remove` on a Security project: says what it keeps (deny/ask, by design) and takes the shim,
      script and `.gitignore` block.

- [x] S1: `boss adopt` previews; `--apply` writes. Callers moved: `scripts/demo.js`, tests, README,
      GUIDE, `web/index.html`, `web/start.html`, help. The preview's file count equals what `--apply` adds.
- [x] S1: the preview's *can't see* group — records under `docs/` outside the folder each kind is read
      from, frontmatter-checked (`unreadRecords`, `src/detect.js`).
- [x] `/welcome`'s adopted branch no longer offers re-adopting with `--mode` (adopt refuses an adopted repo).
- [x] The preview says which two hooks run from the start, instead of implying every hook is opt-in.
- [x] S2 for records: one reader (`hooks/lib/record-files.js`) for flat and folder-per-record, used by
      the session-start hooks, `boss board`, `boss records`; adopt writes `layout.records` in
      `.boss/config.json` on apply, and the preview says it first (*Where you keep things*).
- [ ] The rest of the layout map: `layout.devlog`, `layout.resume`, worktrees — the re-entry read, the
      five skills that hard-code `docs/devlog.md` / `docs/RESUME.md`, `open-work`, the V1 `/board` skill,
      `insights.js`.
- [ ] The AGENTS.md block adopt appends names `docs/ideas/` — it should name where *this* repo keeps ideas.
- [ ] `/close` and `/log` keep an existing RESUME / devlog rather than starting a second (reproduce first).
- [ ] `/read-repo` assess-only: with no `.boss/manifest.json`, the position read and nothing written, so
      the preview can hand off to it before apply. Check Claude Code doesn't stall reading outside the project.
- [ ] Detection: a FEAT at `building` counts toward MVP.

## Found installing for real — dhun at MVP (Ajesh's own project, 2026-10-08)

BOSS 0.332.0 adopted into a worktree of dhun (a monorepo with its own agents, skills, devlog and
worktree practice). Nothing of dhun's was overwritten — and dhun would still have behaved differently.
**Reading the docs found none of these; installing found five.** Each is a task here until it ships.

- [x] **A quiet deletion.** The settings merge removed `defaultMode: "auto"` and adopt said nothing —
      `computeSettingsMerge` returns `migrated`, `boss sync` prints it, adopt drops it. The preview must
      say it too.
- [ ] **Most of BOSS can't see a repo that keeps things elsewhere — and silence reads as fine.** The
      re-entry read looks for `docs/devlog.md`; dhun's is `logs/devlog.yaml`, so the tool built for the
      six-week return never fires. Records were one case of this; the fix is a **layout map** in
      `.boss/config.json` (records, devlog, RESUME, worktrees) that every hook reads, and every hook that
      can't find its file says *could not look*, never nothing (the IDEA-073 rule, again).
- [ ] **Routing, not names, is the risk.** BOSS's `coder` answers to *build / implement / fix*, the same
      words as dhun's `coder-rust` and `coder-frontend`, and knows nothing of their smoke or ratchets;
      `designer`, `planner`, `product-lead` overlap the same way. The preview must name agents whose
      triggers overlap the repo's own, and agents stay out of a bare `--apply`.
- [ ] **Same-named skills.** dhun's `/smoke`, `/close`, `/log`, `/board`, `/design-review` were kept
      (copy-if-absent) — right — but the preview should say *yours wins* for each, by name.
- [x] **Detection misread a monorepo.** `package.json` and `Cargo.toml` in subfolders → Quickstart, "no
      build manifest". Manifests one level down count.
- [x] **The worktree's folder name became the project's name** (`dhun-boss`) in files and the registry.
      Name it from the main worktree, or the package.
- [ ] **`.gitattributes` would renormalize line endings on 36 files**, a migration's data CSV among them.
      The preview must flag a `.gitattributes` against a repo with history; never laid down silently.
- [ ] **Adopting in a worktree touches every checkout.** The pre-commit hook lands in the shared
      `.git/hooks` (inert elsewhere, but there) and the registry row outlives the branch.
- [ ] **`boss remove` is not a full undo.** It leaves the permission rules, the `.gitignore` block and the
      pre-commit hook. Either it takes them, or the preview says so.

**The fuller report (same install, 2026-10-08)** — the *builder who already built a system* case: ~40
agents, ~40 skills, shell hooks, tiered CI, its own doc layout. Went well: copy-if-absent held, the marked
CLAUDE.md block is clean, the deny/ask floor conflicts with nothing, the commit shim only fills an empty
slot, `boss map` shows the repo's own skill descriptions. New beyond the list above:

- [x] **`boss id` hands out a number already taken** when records live in a folder per record outside
      BOSS's folders — reproduced 2026-10-08: `docs/specs/FEAT-001-login/README.md` → `boss id FEAT` says
      `FEAT-001`. The census reads ids from file names, and the file is `README.md`.
- [ ] **More hard-wired paths:** `open-work.js` sees only `.claude/worktrees/` (misses sibling worktrees
      like `~/Projects/<app>-*`); the V1 `/board` skill reads `docs/ideas/FEAT-*`; `consult`, `drift-deep`,
      `extract`, `revalidate`, `sunset` hard-code `docs/devlog.md` and `docs/RESUME.md`.
- [x] **Collision is per file; it should be per skill.** *(The folder skip shipped with the overwrite fix; `assumes:` is still open.)* Where the repo's `SKILL.md` was kept, 18 sibling
      files still landed in those folders (dead; `log/scripts/entry.js` would start a second devlog). If
      `<skill>/SKILL.md` exists, skip the folder. Skills declare what they assume (`assumes: [log, spec]`);
      adopt holds or warns about a skill whose assumption is now the repo's own version — `sunset` writes
      `dropped` where the repo says `killed`; `red-team/paths.md` reads a section the repo's `/spec` never
      writes; `/idea` numbers through `boss id` and ignores the repo's own INDEX.
- [ ] **Agent overlap compared by trigger words**, against every `.claude/agents/*`; hold the generic one
      where a specialist owns the words, and say so. The four builders matter; the mentors are additive.
- [ ] **"Nothing of yours overwritten" is asserted, not computed** — the summary should come from a diff
      of what was touched. `.gitattributes`: detect CRLF with `git ls-files --eol` and skip or exempt.
- [x] **Source globs are blind to a monorepo too** — `inferSourceGlobs` returned nothing, so the
      conscience reports it could not look at the code. Per-package roots (extends IDEA-073).
- [x] **Identity:** name from `git rev-parse --git-common-dir`'s toplevel or the remote, or ask (IDEA-161's family).
- [ ] **`boss remove` misattributes:** files skipped as collisions are stamped as managed, so the remove
      preview lists the repo's own `tester.md`, `close/SKILL.md` as *BOSS files you edited*. It should list
      every adopt side effect, kept ones too, with why.
- [ ] **A large CLAUDE.md** (413 lines) got 59 lines appended at the end, the lowest-compliance zone →
      a ≤10-line pointer near the top. A repo with a stack shouldn't import *stack-neutral until decided*.
- [ ] **`boss status` called a 51-day-stale IDEA "Ready to build".** Staleness should outrank `ready`.
- [ ] **A third state for every hook:** spoke · quiet because fine · *quiet because it couldn't see*.
- **New scope, not this record:** worktree-per-work and `land` as founder verbs (`boss worktree`,
  `boss land`), and `open-work` reading `git worktree list` — BOSS solves stranded branches and
  sessions sweeping each other for itself and ships neither.
- **Practice, not adopt (for `/extract`):** a gate lands on main first and alone · automation needs
  someone who merges, not only someone told · a doc describing a module is not evidence about it · probe
  against production-shaped data, not the fixture.

**Its frame:** adopting into an existing system is a negotiation, not a scaffold — a repo with 40 agents
has opinions, and adopt discovers them by colliding. The receiving repo's gates come first; BOSS offers
its version as an extension, not a sibling.

**What it taught (Ajesh's session's words):** adding without overwriting is not the same as changing
nothing — routing, line endings and one quiet deletion would all have changed how the project behaves.
A tool that stays quiet is ambiguous unless it says when it couldn't look. The fix for the worst failure
was already built; it just couldn't find the files — shared file conventions mattered more than another
feature.

Not BOSS's: dhun's own `/design-review` reads the old CLI's files. Practice UP (the eleven proposals,
worktree-per-work and `land` shipping beyond bossbuild) belongs to their own records, not this one.

## 🔴 Adopt then sync overwrote the founder's own files (reproduced 2026-10-08)

Adopt stamps every template path that exists after it ran as BOSS-managed (`stampManaged(targetDir, [s])`,
no exclude) — including the founder's own files it *skipped* as collisions. The ledger then holds their
bytes as BOSS's, unedited, and `boss sync --apply` overwrites them. Repro: a repo with its own
`.claude/agents/tester.md` and `.claude/skills/smoke/SKILL.md`; `adopt --apply --mode mvp`; `sync --apply`
→ both replaced by BOSS's. dhun's report saw the symptom (remove calling them *BOSS files you edited*).

- [x] Fixed forward: adopt records what the repo already had as `theirs` in `.boss/manifest.json`
      (files and whole skill folders), keeps them out of the managed stamp, and `boss sync` never plans
      them — it says *N of yours, left alone since adopt*. Was: adopt passes the skipped paths to `stampManaged`'s exclude (the mechanism sync already
      uses for edited files). Test: adopt → sync preview does not list them; sync --apply leaves them.
- [x] Already-adopted repos carry the wrong stamps. Reproduced (old adopt, new sync → still `~ changed`).
      Fixed: for an adopted stamp with no `theirs`, sync reads git — what was under `.claude/` before the
      commit that added `.boss/manifest.json` (or at HEAD, uncommitted) is theirs — and keeps the record.
      Not covered: founder files that were never committed before adopt.

## dhun's answers, and its check of the preview (2026-10-08)

Full text, local only: `docs/source/2026-10-08-dhun-adopt-answers.md`. **Context (Ajesh):** dhun predates
BOSS — the first BOSS was built from dhun's practice, and BOSS has moved on since. So a dhun difference is
one of three: **intentional** (keep, don't argue) · **older than BOSS's fix** (offer) · **ahead of BOSS**
(sort UP — tiered smoke, ratchets). The reconcile cannot tell these apart from code: each finding asks
*was this deliberate?*, or reads the repo's own decision log first.

**What the answers settle, as proposals for Ajesh:**

- **Layout: find, show, confirm once in the preview; ask only for what it couldn't find.** Always confirm
  the devlog — its *format* changes how it's read (dhun's is YAML, latest date not last line, skip
  `auto_logged` stubs). RESUMEs can be one per record (a glob, not a file). Worktrees can be siblings.
- **Agents: hold, don't scope down** — a deferring router is an extra hop that still routes on BOSS's
  description. Hold, say so, offer the held agent's distinctive section as an extension to the specialist.
  Narrow triggers that over-reach (`prompt-coach` to prompting; `mentor-architect` drops bare "architecture").
- **An extension is a marked block in their skill, in their words** (`killed`, `origin:`); deleting the
  block leaves their skill exactly as before.
- **Their parts order puts the safety floor first** (deny/ask, secrets check, `.gitignore` block — no
  conflicts), session continuity second once it can read the layout, the CLAUDE.md rules last as a
  pointer. ⚠️ Differs from Q4's answer (bare `--apply` = records, PM, session memory) — **Q7**.
- **The finding shape, refined:** gates side by side (not two descriptions) · a verdict with one reason ·
  cost of each addition in files and lines, and its undo · what it depends on before it does anything ·
  **the bug behind each gate**, applied both ways.
- **"Couldn't look": one combined line**, at adopt and the first session start, then only when it changes;
  permanent in `boss status`.
- **Identity:** git remote name → main worktree's folder → ask if they disagree; never `package.json`.

**New, from the answers:** existing session-orientation hooks and memory (BOSS's reentry adds a second
block; two memories of one person) · ID spaces BOSS doesn't know (date-based DEC, IDEA→FEAT renumbering
with `git mv`) · a declared write contract (`AGENT_DOC_MAP.md`) that BOSS skills would break · frontmatter
rules (`owner: "@you"` ships) · other worktrees and a dirty tree in the preview, and that `.git/hooks` is
shared by all of them · CI that skips `.claude/**` and `docs/**` · README files written into folders the
same adopt ignores.

**The preview, checked on dhun main (b228b2b): wrote nothing** (status, `BOSS_HOME`, hook hash unchanged);
showed every side effect, the baseline, all 32 folder FEATs. Still wrong — each a task:

- [x] "N new files; none of yours is replaced" and "29 skills" while 18 files land in dhun's own skill
      folders and five of the 29 are dhun's — the folder-level skip fixes both.
- [x] False positive: `docs/pm/labs/IDEA-009-RESUME.md` (a RESUME named after an idea) listed as a record.
- [x] `defaultMode` not mentioned, though dhun's settings has it.
- [x] The registry line says `~/.boss` with `BOSS_HOME` set — show the real path.
- [x] Layout gaps: the 9 `docs/ideas/IDEA-*.md` should read as *found*, not be left out.

## Found while building

- [ ] **Suspected, not reproduced:** `boss id` could hand out a FEAT number already used by a
      `docs/<other>/FEAT-*/README.md` record — the prose scan runs only inside `RECORD_DIRS`.
- [ ] `boss hooks disable` reaches only the opt-in hooks; conscience and reentry can only be paused.

- [ ] **Board double-count (pre-land review):** a record kept both flat in `docs/ideas/` and as a folder
      elsewhere gets two cards; two same-named flat files in two layout folders keep only the first. Unlikely.
- [ ] A founder file inside their own kept skill folder, at a path BOSS also ships, is still stamped as
      BOSS's (only `SKILL.md` is excluded). Sync skips it via `theirs.skills`; `boss remove` may not — part
      of the remove-misattribution task.
- **Noted, kept:** `boss records` now also reads `docs/programs` (PROG records), through the shared reader.
  Pre-land review: no output change on bossbuild.
- **Pre-land review fixes (2026-10-08):** adopt always writes `theirs`, so the git guess runs only for repos
  adopted before it existed, and declines when the adopt was never committed (HEAD may already hold BOSS's
  files); board dates read the record's real path; `docs/features/` is a default record folder, so a repo
  adopted earlier needs no setting.

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
- **Q7** · ~~What does a bare `--apply` take?~~ — answered 2026-10-08 (Ajesh): **the safety floor** (deny/ask
  rules, the secrets check, the `.gitignore` block) — *"just the right amount of safeguard, guardrails"*,
  and the easiest win. Session continuity follows once the layout is confirmed. Supersedes Q4's default.
- **Q8** · *(decide at the layout-map slice; Ajesh wants it explained then)* Is `boss layout` (point BOSS at where things live, after adopt) a verb, or is re-running the
  preview and editing `.boss/config.json` enough?
- **Q9** · ~~Rooms vs parts~~ — **decided: DEC-024** (2026-10-08, ai-suggested, ratified by Ajesh; on
  `work/prog-006`, not yet on main). BOSS is a building: Basement (this record's Q7 safety floor) →
  Mailroom → Office → Studio → Boardroom, each carrying every floor below; a Lobby outside (registry row
  only). **Floors are presets over this record's parts; `--take` adds or drops one part.** The floor is
  declared (`room:` on the stamp). A bare `adopt --apply` takes the Basement; adopt asks which floor.
  `boss up` is the elevator. Modes live only in the Boardroom.
  **Split:** IDEA-163 builds the adopt side — the Basement as the bare `--apply`, the parts as named sets
  in the plan, `--take`, the preview showing the floor's plan. PROG-006 owns the floor presets, `room:`,
  the registry fields and `boss up`.
  *Corrected before landing (DEC-024, `work/prog-006` abe05999): the safety floor is **Security, floor 1**
  (where the project gets its badge); the flag is `--floor <name>`; the stamp stores `floor: 0–5`
  (0 Lobby · 1 Security · 2 Mailroom · 3 Office · 4 Studio · 5 Boardroom; existing projects are 5).
  PROG-006 asks at the door only when git says the repo is someone else's — it reuses
  `projectName()` (`src/detect.js`), which returns the origin URL as `remote`.*
