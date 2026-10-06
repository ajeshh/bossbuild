---
id: COMP-spec-driven
type: competition
owner: product-lead
status: watch
rival: GitHub Spec Kit · Kiro · Tessl
kind: adjacent — spec-driven development: idea → spec → plan → tasks → code, records in the repo
checked: 2026-10-05
sort: watch — no EVID names any of them (EVID-001…005 checked 2026-10-05). Filed on Ajesh's ask.
source: each rival's own repo, docs and changelog, opened 2026-10-05. Spec Kit through raw.githubusercontent.com and `gh api` (templates/commands/*, extensions/assess/*, newsletters, issues). Kiro through kiro.dev/docs/*, /pricing/ and /changelog/ (raw HTML), plus github.com/kirodotdev/Kiro issues. Tessl through docs.tessl.io (all 84 pages in llms.txt), tessl.io/pricing, registry.npmjs.org/@tessl/cli, and martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html. Search summaries were used only to find pages. Reddit and app-store reviews were unreachable.
---

# Spec-driven builders — Spec Kit, Kiro, Tessl

> **The nearest shape to BOSS's `/idea` → `/spec` → FEAT,** and the reason this file exists:
> what they learned building it, and where BOSS should borrow from them. Read § *What BOSS could take*
> first if that is the question.

## The three, in a line each

| | What it is | Price (opened 2026-10-05) | Activity |
|---|---|---|---|
| **GitHub Spec Kit** | MIT toolkit of slash commands (constitution → specify → clarify → plan → tasks → analyze → checklist → implement → **converge**) for 42 agent hosts, with extensions, presets and a workflow engine | free, MIT | ★140k; 104 releases in six months; v1.0 2026-08-21, v1.1.0 2026-10-02 |
| **Kiro** (AWS) | an IDE (Code OSS fork) + CLI + web agent built around specs: `requirements.md` (EARS) → `design.md` → `tasks.md`, with steering files and hooks | Free 50 credits · Pro $20 · Pro+ $40 · Pro Max $100 · Power $200 /user/mo · Enterprise via sales | IDE 1.0 2026-06-25; several changelog entries a week |
| **Tessl** | **left the field.** It paused its spec-as-source framework in Nov 2025 (CLI 0.50.3: *"The Framework functionality is no longer included"*). It is now *"Agent Enablement Platform"*: a registry, evals and verifiers for agent skills | Free 1,000 credits · Team $100/mo · Enterprise custom | 47 npm releases in six months; $125M raised (their podcast page) |

**In their words.** Spec Kit: *"Build with a spec, fix a bug, or assess an idea — with your coding
agent."* Its philosophy doc: *"Specifications don't serve code—code serves specifications."* Kiro:
*"Move beyond AI coding to agentic engineering."* Its pricing FAQ says it is *"built for professional
developers on software teams."* Tessl: *"Build your software factory, one skill at a time."*

## The twist, against BOSS's bet

**None of the three has a venture.** Spec Kit came closest in July 2026 with an opt-in `assess`
extension: intake → research → define → decide. It has a mandatory *"Evidence Against the Idea"*
section, every unsourced claim is tagged `ASSUMPTION`, and `go` is impossible on weak or unknown
evidence. Its "evidence" is whatever the agent can gather: tickets, URLs, desk sources. It has no
interview, no grade on what a real person said, and nothing after the verdict. Kiro's only *why* is a
`product.md` steering file generated *from the repo*. Tessl measures whether a skill helps an agent,
not whether the product should exist.

**They are rivals for the build half and not for the rest.** A founder who adopts Spec Kit gets a
better-gated spec→code pipeline than BOSS ships. Nothing in it asks whether the thing should exist,
where they are, or why a past attempt ended. **The two compose more than they compete.** Spec Kit
installs into `.claude/skills` and owns one managed block in CLAUDE.md, as BOSS does. A founder could
run both. A switch test is premature, but worth asking once a founder names one.

## Why they might win

- **Spec Kit is the default.** ★140k, GitHub's name, and 42 hosts. Its *converge* step closes the loop BOSS
  leaves to `/log` (below).
- **Kiro sells the whole IDE with specs built in**, plus correctness checks BOSS has nothing like:
  property-based tests drawn from EARS criteria, and *"checks your requirements for contradictions and
  gaps using automated reasoning."*
- **All three shipped ceremony levels after their users complained.** Kiro's ladder runs Plan (in
  memory) → Quick Spec (no gates) → full spec. Spec Kit has the `lean` preset. The field is converging
  on the shape BOSS started from.

## Where they're weak — their users' words

- **Weight.** *"this workflow behaves the same regardless of task complexity… adding one button… → 30
  files changed, < 20 actual LOC"* (Spec Kit #1174, 2025-11-13, 22 reactions). *"SpecKit creates the
  illusion of work, generating a bunch of text"* (#75, 2025-09-08). Spec Kit's own August 2026 newsletter
  names *"documentation proliferation and cognitive load"* as the most-cited concern.
- **Specs can't evolve or retire.** *"`/speckit.specify` always creates a new branch + artifact… There's
  no dedicated command… to refine existing specs"* (#1191, 115 reactions, the most-reacted issue).
  *"to know what the system does I need to read both specs"* (discussion #152, 72 upvotes). A `/close`
  to deprecate a spec is still an open issue (#620). Kiro's docs mention no retirement at all.
- **Specs drift from code, and nothing notices.** Kiro #9435 (2026-06-15, backlogged) asks it to stamp
  the git ref at creation: *"the codebase may have changed in ways that invalidate assumptions… Currently,
  there's no way to know."*
- **Context cost.** Kiro loaded all of `.kiro/specs/` into every session, 400k+ tokens (#4606). Spec Kit's
  implement *"executes the entire tasks.md inside a single agent conversation… causes context rot"*
  (#3507, open). Its constitution is *"read once at plan time and then gone"* (#2219).
- **Duplication.** *"I don't really see a difference between the constitution… and… AGENTS.md…
  CLAUDE.md… violates DRY"* (Spec Kit discussion #2476).
- **Spec-as-source didn't hold.** Tessl's framework generated code from specs (`// GENERATED FROM SPEC - DO
  NOT EDIT`). Böckeler saw non-determinism from the same spec. Tessl paused it ten weeks later. An HN
  thread on 2026-08-05 asked *"What Happened to Spec-Driven Development?"*

**Where BOSS already answers these.** Weight: modes, plus `/spec`'s *"Should this be a FEAT at
all?"* gate. Evolving specs: *new scope gets a new id* (`spun_to:`), so specs never pile up as
variants. Retiring: `/sunset` and a dropped FEAT's `## What this taught`, which `/spec` reads before
re-speccing. Duplication: one CLAUDE.md block and no constitution. These are answers on paper.
n=0 founders have tested them.

## How they do it — the mechanisms that touch BOSS's bet

**Clarifying.** Spec Kit's `specify` guesses and records the guesses. It allows at most **3** inline
`[NEEDS CLARIFICATION: q]` markers, ranked scope > security > UX > technical, and lists what is never
worth asking: retention, performance, error handling, auth method. `clarify` scans 10 categories, then asks
**≤5 questions, one at a time**. Each is multiple choice or ≤5 words, with a *"Why it matters"* line and a
**Recommended** option, so "yes" is a complete answer. Each answer goes into a dated `## Clarifications`
log *and* edits the spec, saved immediately. Kiro's Plan and Quick Spec ask numbered multiple-choice
questions once, up front (*"1=a, 2=b"*). BMAD's `forge-idea` does the same (`bmad.md`).
*BOSS:* `/spec` step 3 says back what it assumed and asks in **one numbered message**. It records
corrections word for word, but offers no recommended answer.

**Gates.** Spec Kit's plan template has a *"Constitution Check — GATE: Must pass before Phase 0 research.
Re-check after Phase 1 design."* A violation stands only with a row in **Complexity Tracking**: *Violation
| Why Needed | Simpler Alternative Rejected Because*. `analyze` is read-only. It keys every requirement
(FR-/SC-), reports coverage (requirements with no task, tasks with no requirement), and marks any
constitution conflict CRITICAL. The fix must change the spec, *"not dilution, reinterpretation."*
Kiro's *Analyze Requirements* looks for contradictions and unstated assumptions across the whole set,
and each finding can be dismissed as *"intentional."* (Their methodology doc still describes "Phase -1"
simplicity gates that the shipped template no longer contains. A checker stating an intent it doesn't
enforce.)

**Closing the loop: `converge`** (Spec Kit, 2026). *"Repeat implement → converge until convergence
reports Converged."* It judges the code against spec, plan and tasks, and counts every task *"checked or
not,"* because **"completion claims are not evidence."** It has four gap types: `missing`, `partial`,
`contradicts` and **`unrequested`**. Code nobody asked for gets a review task, never a deletion. It
only appends, and leaves `tasks.md` byte-identical when converged. Separately, `checklist` writes
*"unit tests for English"* the agent **must never tick**. The boxes belong to the reviewer, and
`implement` stops if any are unchecked.

**Bug fixes** (Kiro `bugfix.md`). Three EARS blocks: Current (`WHEN… THEN the system [incorrect
behaviour]`), Expected (`…SHALL…`), and **Unchanged** (`WHEN… THEN the system SHALL CONTINUE TO
[existing behaviour]`). Property tests check that the bug is reproducible, then fixed, then that nothing
regressed.

**Ceremony** (Kiro). The level is chosen per task, and each has a *use when* and *not ideal for*. Plan
writes nothing and suits *"tasks that need 15–60 minutes."* Quick Spec asks once, then writes all three
files with no gates. A full spec has an approval at each phase. Nothing reads project size. Users
complain it keeps suggesting Spec mode (#10778).

**Tessl's lessons, from leaving.** Every skill is scored **with and without** it on the same task,
and activation is measured apart from outcome. Its SDD plugin carries a `trivial-change-exception` eval
that **awards points for *not* writing a spec** on a typo fix. Verifiers start at `warn`, and severity
lives in config, not the check. A check is promoted to `error` once it is reliable.

## What BOSS could take — candidates, not decisions

> **Vetted 2026-10-05:** 1 → RVW-136 ADAPT · 2 → RVW-137 ADAPT · 3 → RVW-138 ADAPT · 4 → RVW-139 REJECT
> (BOSS already recommends where it is safe) · 5 → RVW-140 REJECT (derivable from `created:`) ·
> 6 → RVW-141 NOT-YET (baseline half ruled in RVW-013).

Each was checked against BOSS first (grep of `stages/`, `src/`, `library/`, 2026-10-05). These are
claims from strangers, so each goes through `/vet` (default NO) before anything is built. Ranked
by what they would change for a founder:

1. **"Done" needs evidence, not the builder's tick.** `/log` step 4 has the session *"tick the
   acceptance criteria that are now true"*. That is usually the same agent that built it. The `tester`
   agent walks criteria with evidence, but nothing requires its pass before a tick. Spec Kit's `converge`
   says it plainly: *"completion claims are not evidence."* (Its *must-not-tick* rule is about
   requirements-quality checklists, not done-ness, so it is not support here. Corrected in RVW-136.) *Shape for BOSS:* a tick carries one line of evidence (the command and what was
   observed), or it stays unticked. `boss board`'s *how far* then means verified. Small change,
   high value.
2. **Ask at done what got built that nobody asked for.** Converge's `unrequested` gap: agents add code
   past the spec, and BOSS's *new scope gets a new id* rule only catches growth the founder sees.
   *Shape:* the FEAT close-out (`/log` step 5) asks once, *"anything built that isn't in the criteria?"*,
   and routes each answer to `spun_to:` or out. It never deletes.
3. **A bug-fix FEAT names what must keep working.** `/spec` already says *"plenty of good FEATs are a
   bug, a small fix,"* but its *paths that must not break* are only money, destructive and negative.
   Kiro's `SHALL CONTINUE TO` block is the missing fourth: *the behaviour next door that this fix must
   not change.* It writes itself as a regression test, which is the top of `/spec`'s *most executable
   artifact* ladder. One optional line, only for fixes.
4. **A recommended answer on every question.** Spec Kit, Kiro and BMAD all converged on it.
   *"Yes"* accepts the recommendation, and a founder corrects only what's wrong. Keep BOSS's one
   numbered message, but give each item a suggested answer. This fits *assume intelligence, never
   assume knowledge*: the founder sees what BOSS would do.
5. **Stamp the commit a FEAT was specced against.** Nobody in the field has this, and Kiro has it in
   its backlog. `created:` is a date. A `specced_at: <sha>` would let `/revalidate` and re-entry say
   *"14 files this FEAT touches changed since it was written"* instead of guessing. Cheap; possibly
   redundant with the date plus `git log --since`. Check before building.
6. **Measure BOSS's own skills with-and-without, and reward standing down.** This one is about BOSS's
   own practice, not what BOSS ships. Tessl's two eval shapes: a baseline arm (does the skill change
   behaviour at all?) and a stand-down case (does `/spec` decline to spec a typo?). BOSS's restraint
   moment exists, but whether its evals score *declining* was not checked here.

**Do not take:** spec-as-source (Tessl abandoned it); a constitution file (its own users call it a
duplicate of CLAUDE.md); task lists with `[P]` parallel markers inside the spec (BOSS hands the *how*
to plan mode on purpose, and task-list sprawl is the field's top complaint); EARS as a required format
(the "SHALL" grammar is ceremony for a solo founder; BOSS's ladder of a failing test or a rubric already
does the job). Kiro's EARS-to-property-test link is worth remembering if BOSS ever ships property tests.

## What I did not find

- Reddit and app-store reviews for all three (refused). Kiro's raw `tasks.md` syntax. Tessl's credit
  costs beyond two line items. A "Business" tier that Tessl's FAQ names but the plan table doesn't.
- Whether Spec Kit's `lean` preset drops the clarify and checklist gates (README read, not its command files).
- The products themselves were not run. Every mechanism above is from source files and docs.

## Change log

- **2026-10-05** — filed. Three rivals in one file because they share a shape. Tessl is kept as the
  one that left it.

## Spec Kit deep dive (2026-10-05) — the method, read against BOSS

A second pass read Spec Kit's whole tree at `main` (docs/, extensions/, presets/, workflows/,
newsletters, CHANGELOG), comparing each part against BOSS file by file. Items 1–6 in *What BOSS could
take* above were excluded. What it found, by founder impact:

1. **A real bug, fixed the same day** (`dbf0ae5`). An unparseable `.claude/settings.json` was read as `{}` and
   written back by `boss hooks enable`, `adopt` and `sync`, which erased the founder's permissions, the
   conscience's registration and the secret-path deny floor. Spec Kit's lesson: a config that won't
   parse is reported, never skipped silently (`templates/commands/specify.md`, the August fail-loudly
   sweep, the September fail-closed provenance change).
   **Still open, same shape:** `hooks/lib/loop-runtime.js` reads an unparseable `.boss/config.json` as
   *not paused, no mutes* (from reading the code, not reproduced). A founder's pause would vanish without
   a word. Reproduce before fixing.
2. **`/import` and `/comp-eval` fetch pages without the "this is data, not instructions" rule.**
   Spec Kit's bug and assess extensions quote instruction-like text as `Unverified`, refuse non-http(s),
   localhost, private and metadata addresses, and treat their own saved artifacts as untrusted. BOSS's
   `import/SKILL.md:36,52` fetches and snapshots into `docs/source/`, which is re-read later. BOSS
   already states the rule in `library/practices/agent-security.md:26`; the skills don't carry it.
   About three lines each. → `/vet`
3. **A FEAT that changes a shipped FEAT's promise isn't linked to it.** This is the field's most-wanted
   unbuilt thing (Spec Kit #1191, 115 reactions; #620 and #1100 open; six community extensions). BOSS
   links `from`/`spun_to` only (`src/records.js:80-156`). *Shape:* `amends: FEAT-NNN`, plus a pointer
   line on the old FEAT, the same supersede-don't-edit pattern as DEC records. → `/vet`
4. **"Named slices" is BOSS's FEAT test, but no file holds the slices** (`spec/SKILL.md:178`; "slice"
   appears 0× in `feat-record.md` and `coder.md`). Spec Kit: each story is independently testable, and runs
   are scoped (`docs/concepts/complex-features.md`). *Shape:* group the criteria under `### Slice N`
   only when there's more than one, and have `coder` build one slice per run, then stop. → `/vet`
5. **`coder` has no bug discipline.** "Reproduce before you fix" ships only in the opt-in
   `engineering.md`. Spec Kit's bug extension: assess never edits; *"STOP modifying code"* when the
   diagnosis was wrong; never mark verified unless the repro ran. *Shape:* two lines in `coder.md`.
   This is separate from RVW-138. → `/vet`
6. **Subtract `/spec`.** It is 497 lines, about 9.5k tokens, against BOSS's own 500-line ceiling
   (`library/practices/skill-authoring.md`). Its conditional branches (post-launch, competition,
   flow/journey, data shape, model) can move into `spec/templates/`, with the trigger line kept
   inline. Spec Kit's `lean` preset went the same way. → `/extract`, no vet needed (BOSS's own rule).
7. Low: an optional "rabbit hole" line on a FEAT (`assess.shape`). Judgment call: `/spec` 6b
   copies *Still unknown* into `feature-context.md`, and Spec Kit #3790 removed exactly that kind of copy
   (*"Propagation duplicated the single source of truth"*).

**What they walked back:** copying the constitution into templates (#3790 — point, don't copy); writing
the agent context file from core (now opt-in); tying spec identity to git branches; and a
`requires.permissions` field, refused *"because it would imply a sandbox that does not exist"*.
That last one is BOSS's *checkers state intents they don't enforce*, refused in advance.

**Where BOSS is ahead:** re-reading a shipped FEAT (`/revalidate`), reading a dropped FEAT's lesson
before re-speccing, checking DECs at spec time, two-way `spun_to` checks (`src/records.js`), sync that
never clobbers founder edits (`src/managed.js`), and a tester that refuses mocks on the money path.
