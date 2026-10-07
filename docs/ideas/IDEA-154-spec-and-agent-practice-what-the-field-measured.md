---
id: IDEA-154
type: idea
kind: capability
owner: product-lead
status: building
created: 2026-10-06
relates: IDEA-150
gist: A wider read of spec- and agent-driven practice found BOSS's loop mostly ahead of the field. Five small gaps go to /vet first (a sanctioned stop when a test and the spec disagree, less text always loaded, the one-sentence-diff line, each criterion naming its test, one question on an unclear ask), plus a NO-list.
---

# IDEA-154 — Spec and agent practice: what the field measured

Ajesh, 2026-10-06: *"for spec agent driven development related processes and approaches, we should
investigate best practices, approaches, how we can improve boss to be on par with the best solutions or
ideas out there."* `/deep-research` covered the gaps IDEA-150's toolkit reads left open: delta and living
specs, task graphs, research→plan→implement, long-running harnesses, parallel agents, verification, and
whether specs measurably help at all. Sources are named only in the gitignored
`docs/research/sessions/SESSION-2026-10-06-spec-and-agent-driven-practice.md`. It holds 16 confirmed
claims, 2 killed claims, and the scope each claim carries. Each candidate below is a stranger's claim
until `/vet` says otherwise (default NO).

**Altitude.** Every task below is about what BOSS **ships** to a founder, unless it says *BOSS's own*.

## The read, in one paragraph

Nobody has measured whether specs help. The one number that circulates (*"up to 50% fewer errors"*) traces
back to two articles, and neither contains it. Killed. BOSS already refuses that kind of promise
(`read-repo/SKILL.md:73`). What *is* measured points toward BOSS's shape, not away from it:
- Planning's accuracy value fades on strong models. The host's own docs say *skip the plan when the diff
  fits in one sentence*.
- Builders praise their own mediocre work.
- Parallel writes don't pay, and review is the bottleneck.
- The host withdrew its own task-list tools on current models. The delta-spec toolkit's lead contributor
  is openly questioning its merge after 46 fix commits.

The field is converging on BOSS's choices: the intent in the spec, the *how* handed to plan mode, one
slice per run, writer≠checker, evidence on the tick, and parallel work capped by review. The gaps are
small, and three of them are subtractions.

## Tasks — each goes through `/vet` before anything is built

- [x] **T1 — A sanctioned stop when a test and the FEAT disagree.** When unit tests contradicted the
  spec, frontier agents "passed" by cheating about half the time. Giving them an explicit *flag for a
  human* exit cut that sharply for two vendors' models, but **much less for Claude**. For Claude the
  lever was read-only tests, which still miss special-casing. Telling a model "don't cheat" alone was
  nearly useless in one measured setting.
  - BOSS today: `engineering.md` says *never loosen an assertion* (a written rule, W). `tester` reads
    the test diff first. `test-assertion-guard` exists, but it is opt-in and advisory. `coder` has
    *stop and say so* for a bug that won't reproduce, but nothing for *the test and the FEAT disagree*.
  - *Shape:* one line in `coder`: if a test and the FEAT disagree, stop and name both; never edit the
    test to get green. Vet separately whether MVP turns `test-assertion-guard` on by default when a FEAT
    names criteria tests.
  - Check against CLAUDE.md's gate rule (*a new gate needs a bug that reached a user*) before making
    anything blocking.
- [ ] **T2 — Subtract what's always loaded.** A study of context files found they don't raise task
  success and add roughly 20% cost. Machine-written files were slightly negative; developer-written ones
  were better than machine-written. The authors' carve-out: files help for **non-standard** practices.
  - BOSS today: an MVP project loads about 2,000 words that BOSS wrote, not the founder (L0 `CLAUDE.md`
    717 + `AGENTS.md` 357 + MVP `claude-append.md` 955).
  - *Shape:* read each always-loaded line and keep it only if it is non-standard (a BOSS rule the model
    wouldn't follow anyway). Move the rest behind a path-scoped rule or a skill. Count words per mode
    before and after.
  - *BOSS's own:* this repo's `CLAUDE.md` is 1,705 words before memory. The same test applies; it's
    Ajesh's call whether it's in scope.
  - *Stale (2026-10-07, at landing):* IDEA-157 has since cut the every-turn rules (MVP 13.0 → 7.7 KB;
    this repo's CLAUDE.md 11.3 → 5.9 KB). Re-measure before starting; what's left may be small.
- [x] **T3 — Replace "non-trivial" with the one-sentence-diff line.** `claude-append.md:7` says *"Any
  non-trivial change starts with `/spec`… Throwaway one-liners don't need it."* "Non-trivial" is
  undefined, and the middle is where ceremony bloats (a small bug once became four user stories with
  16 criteria in one toolkit).
  - The host's docs give a test a founder can apply: *if you could describe the diff in one sentence,
    skip the plan*.
  - *Shape:* that sentence as BOSS's line between "just do it" and `/spec`. Wording only.
- [x] **T4 — Each acceptance criterion names the test that proves it.** Living specs drift. The
  delta-merge camp is fragile, and the other camp says *code remains the source of truth*. Coverage
  overstates what tests check (one suite had 100% coverage and a 4% mutation score).
  - BOSS today: the *most executable artifact* ladder, evidence on the tick (`/log`), `amends:`, and
    `/revalidate` (opt-in, periodic). Nothing ties a shipped criterion to a test that keeps running.
  - *Shape:* when a tick's evidence is a test, the evidence names it. A shipped FEAT's criteria then
    stay checked by the suite: drift shows up as red, and no merge step is needed.
  - Check first: RVW-140 rejected `specced_at`, and RVW-136 set the tick's evidence format. This may
    already be one word away.
- [x] **T5 — One question when a request is unclear.** Models can't tell a well-specified request from
  an underspecified one, and asking recovers a lot (up to 74% on one benchmark, a ceiling).
  - BOSS today: `/spec`'s elicitation pass covers FEATs. `coder` has no rule for an ambiguous ask that
    arrives without a FEAT (grep: no "ambig", "unclear" or "clarif" in coder or the CLAUDE blocks).
  - *Shape:* one line in `coder`: when the ask could mean two different things, ask one question first.
  - Check that it doesn't collide with *assume intelligence* or the conscience's quiet.

## NOT-YET, with its trigger

- **Unattended loop-until-done runs** (a stop hook that feeds the prompt back until a done-marker
  appears). Every result is vendor-reported. A full harness cost about 22× a solo run. They only work
  with a near-perfect verifier, which a founder doesn't have.
  - BOSS's safe subset already ships: one slice per run, and `smoke-guard` blocks once on red.
  - *Trigger:* a founder asks to leave it running overnight.

## NO-list — the field converged on BOSS's shape; don't add

- **A task graph or dependency DAG.** The host gated its own task tools off on current models. The
  leading PRD→task tool's users report sprawl, stale up-front expansion, and an agent ignoring the graph.
  BOSS's slices and `boss board --next` stay.
- **Delta-merge living specs.** That merge is the leading tool's open wound. BOSS's `amends:` and the
  record of what was true when it shipped stay.
- **Parallel writer agents or agent teams for founders.** Reads parallelise and writes conflict. The
  host calls teams experimental and worse for same-file or sequential work. `git-workflow`'s 2–4
  worktrees, capped by review, stay.
- **A phase stack (research → design → structure → plan).** Vendors retired phases, and planning is a
  cost lever on strong models. The *read the code* reversal is real, but its popular numbers are killed.
  `/spec` keeps the destination; plan mode keeps the road.
- **Any percentage benefit claimed for specs.** None is measured (killed).
- **An LLM judge as the done-check.** LLM judges are order-sensitive, random, and over-reject correct
  code. `tester` with evidence stays.

## Capture log

- 2026-10-06 — Ajesh: *"lets do what best recommended but not over do it."* Vetted T1, T3, T4 and T5:
  RVW-150 ADAPT (one line in `coder`; the guard stays opt-in, per the gate rule), RVW-151 ADAPT (the
  one-sentence test, with the three paths overriding it), RVW-152 ADAPT (one question, only on a real
  fork), RVW-153 REJECT (already covered by the tick format, the ladder and `engineering.md`). Built the
  three. **T2 (subtracting the always-loaded text) is left open on purpose**: it's an audit, not a
  sentence, and it waits for Ajesh to take it up.

- 2026-10-06 — opened from SESSION-2026-10-06 (7 angles, 19 claims 3-vote verified, 2 killed). Nothing
  built. T1–T5 wait on `/vet`.
