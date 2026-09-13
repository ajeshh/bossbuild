---
name: extract
description: Pause and sort patterns — Principle 1 as a skill. Reads recent work (git log, devlog, src/, library/) and proposes 1–3 extractions, each routed UP (BOSS's library, where a source checkout exists) or DOWN (the app's own core). Records the decision in docs/extractions/EXTR-NNN-*.md. Claude's reading, not regex. Usage - /extract
---

# /extract — pause and sort the pattern

> *"BOSS is always scaffolding, but scaffolding is the **motion**, not the goal. At every
> natural breakpoint — a mode transition, a shipped feature, the third time the same work
> repeats — **pause and sort the pattern two ways:** UP into BOSS as a reusable superset
> practice. DOWN into the app as core functionality."* — PRINCIPLE #1.

The conscience's other moments fire on predicate matches (regex over files). This one needs
**judgment** — *"is this pattern actually reusable?"* — which a regex can't see. /extract is
the LLM-as-judge counterpart: Claude reads recent work and proposes specific routes.

The discipline says **two destinations**, not one:
- **UP** → `library/<category>/` in the BOSS source repo. Every future project inherits it.
  Promoted via `boss learn <path> --as <cat>`. *"This pattern is reusable across projects."*
- **DOWN** → into the app's core code (refactor inline duplication into a named module,
  function, or schema in `src/`). *"This pattern is product, not scaffold."*

A pattern can also be **neither yet** — the third honest answer. Recording the *not yet* IS
the discipline; pretending everything is extractable is the failure mode.

## When to run it

- The conscience surfaced the `capture` moment (extraction-loop opened — heuristic says ≥3
  devlog entries, no extraction recorded yet). The loop's nudge is the prompt; run this skill
  to act on it.
- After a FEAT ships (a natural breakpoint per PRINCIPLE #1).
- After `boss unlock` lands a new mode (another natural breakpoint).
- The *third time* you find yourself writing similar code or skill prompt or copy-paste-then-
  edit (the *"three repetitions"* signal).
- Mid-session when something feels reusable but you can't name where it should live.

## How to run it

### 1. Orient on recent work

Read, silently:
- Last 10-20 commits (`git log --oneline -20`)
- The most recent 3-5 devlog entries (`docs/devlog.md` — newest first)
- The current FEAT (if any) and its acceptance criteria
- `library/` listing in the BOSS source repo (if accessible) — what's already extracted UP
- `src/` directory structure — what's accumulating DOWN

Don't announce these reads. Just orient.

### 2. Identify 1-3 candidate patterns

Look for one of three signals (these are the same signals PRINCIPLE #1 names):

**Signal A — same work repeated.** A skill prompt rewritten three times across FEATs. A
component-shape copied to three pages. A test fixture duplicated across three test files. A
helper function reinvented twice.

**Signal B — a named-and-stable shape.** A pattern you've started referring to by name in
devlog or commits — *"the cohort-aware framing,"* *"the structured signal,"* *"the
fallback handler stub."* Names indicate the pattern has earned identity.

**Signal C — a load-bearing decision.** A choice that other choices depend on — a schema
shape, a prompt convention, a file-layout pattern, a test harness. Even if it only exists
once, its *role* is foundational.

For each candidate, name it in plain language. Don't propose more than 3 — pick the most
load-bearing ones. **It's fine to find zero** — record that explicitly.

### 3. Route each candidate (UP / DOWN / NOT-YET)

For each candidate, ask the routing questions:

| Question | UP signal | DOWN signal | NOT-YET signal |
|---|---|---|---|
| **Can a sibling project reuse this without copy-paste?** | Yes | No (project-specific) | Maybe with rework |
| **Does this depend on this project's domain?** | No (stack-neutral) | Yes (domain-bound) | Partially |
| **Has it been used 3+ times in this project?** | Yes (battle-tested) | Yes but won't generalize | No (single use) |
| **Is the value in the pattern, or in the code?** | The pattern | The code | Unclear |
| **Where does future-you look for it?** | Across projects (BOSS library) | Within this project (src/) | Not findable yet |

Route each candidate based on the dominant signal:
- **UP** → into BOSS, in one of two homes. A **practice** or a **memory seed** goes onto BOSS's
  shelf (`library/`); an **agent**, **skill** or **hook** goes into a mode's template, because that
  is the only place it ships from — so it also takes `--mode <quickstart|mvp|v1|scale>`. Run
  `boss learn <path> --as <cat> [--mode <mode>]` to copy + register + bump VERSION + add a
  CHANGELOG entry. (Requires a BOSS source checkout — `$BOSS_SRC`, a self-hosted registry entry, or
  running from one. An npm/Homebrew install cannot promote; record the candidate instead — step 6
  says how.)
- **DOWN** → refactor the duplication into a named module/function/schema in `src/`. /extract
  doesn't execute the refactor (the founder owns the code); it names the target file path +
  the smallest valuable refactor.
- **NOT-YET** → record the candidate + reason. *"Worth watching; not yet load-bearing enough
  / not yet generalizable / not yet used outside one feature."*

### 4. Write `docs/extractions/EXTR-NNN-<slug>.md`

Skeleton: **[`templates/extraction-record.md`](templates/extraction-record.md)**.

The frontmatter and the `Route` line are load-bearing — they're what `extraction-loop` reads. And keep
the **What didn't make the cut** section honest: a pass that promotes everything it looked at wasn't
sorting, it was collecting.


### 5. Update IDS allocation

Record it as a file alongside the ideas (or wherever your project tracks IDs) under an *Extractions*
heading; allocate the next free `EXTR-NNN` integer by grepping `docs/extractions/*.md`.

### 6. If any candidates are UP — check for a checkout, then promote or record

**UP needs a BOSS source checkout, and most installs don't have one.** `boss learn` writes into BOSS's
own repo — bumps its VERSION, prepends its CHANGELOG — which the read-only npm/Homebrew package cannot
do. It looks for that repo in order: `$BOSS_SRC`, a self-hosted entry in this machine's registry, then
the current directory if it *is* a checkout. So, for each UP-routed candidate, after the founder confirms:

- **Check first:** does a checkout exist? (`echo $BOSS_SRC`; `boss learn --help` says where it looks.)
- **If yes** — generalize the artifact (strip every domain specific; a practice doc, a skill, an agent,
  or a hook), show the command, and run it only on their go:
  `boss learn <path-to-generalized-file-or-dir> --as <category> [--mode <mode>] --note "<what & why>"`.
  Review its diff in the BOSS repo and commit deliberately — never auto-commit BOSS. Record in the
  EXTR file whether the UP landed (VERSION bumped? CHANGELOG line written?).
- **If no** — which is the common case — **record the candidate as UP-pending in the EXTR file, with
  the reason** (*"no BOSS checkout on this machine"*), and stop. Say plainly that promotion needs a
  checkout; never imply it happened. The record is the value; the promotion can follow from any
  machine that has one.
- Either way, the router may still disagree with itself here — a candidate that looked UP at propose
  time often turns out DOWN once generalized, because most app code routes DOWN. That reversal is the
  discipline's check on the discipline; write it in the EXTR.

### 7. If any candidates are DOWN — name the refactor

Don't execute the refactor inside `/extract` (that's `coder`'s job). Just:
- Name the target file path and the smallest valuable cut.
- Add a TODO to `docs/RESUME.md`'s Next-tasks: *"Refactor <name> per EXTR-NNN."*
- Hand off if the founder wants to start the refactor now.

### 8. If all are NOT-YET — record honestly

NOT-YET is a legitimate answer for an extraction record. The `- **Route:** NOT-YET` line
still closes extraction-loop (the discipline IS the practice of pausing-and-routing, not the
volume of extractions). Future-you reads this file and sees: *"BOSS made me look; I looked
honestly; nothing was extractable yet."* That's the principle working.

## Cohort-aware delivery

| Cohort | Posture |
|---|---|
| `first-product` | Walk through the routing carefully. Define UP / DOWN inline (they may not know what `library/` is). Lean toward NOT-YET for early projects; the discipline of *looking* matters more than the volume of *finding*. |
| `vibe-coder-newbie` | Show the three signals (A/B/C) with named examples from THIS project. Avoid abstract framings. |
| `non-tech-founder` | Plain language. UP = "reusable across projects" / DOWN = "make it real in this product" / NOT-YET = "not the right time to extract." They likely own the routing call but may delegate the actual extraction. |
| `eng-builder` | Terse. They'll spot extractables fast; the question is whether they'll *do* the work. The skill's job is to anchor the decision in the EXTR file, not to teach. |
| `vibe-virtuoso` | They have a backlog of extractable patterns from past projects. The skill's leverage here is *"which of THESE three from THIS project is the load-bearing one?"* — not the full inventory. |
| `indie-hacker` | Calm-company framing. UP is investment in the system; DOWN is investment in this product. NOT-YET is the most-used route — patience is the discipline. |
| `returning-founder` | Skip the routing-question table; they know it. Ask: *"Three sessions in. What did you do twice? What did you almost do a third time?"* They'll name the candidates without prompting. |
| `domain-expert` | High-stakes: extractions involving regulated logic (PHI handling, financial calculations, legal templates) lean NOT-YET-with-caveats *"this is too domain-specific to generalize; document the project-internal abstraction; do NOT lift to library/."* The default is conservative. |

## Connection to other loops + skills

- **Triggered by:** `extraction-loop` (this skill's job is to close it). The loop opens at
  the heuristic breakpoint; the skill is the judgment.
- **Routes to:** `boss learn` (the CLI, for UP candidates where a checkout exists) — see `library/`
  rules in the BOSS source repo. /extract is the router at both the *propose* and the *promote*
  step since v0.322.0; the CLI is the mechanism under its UP half, never a second verb.
- **Adjacent:** `/log` (devlog discipline produces the entry signal); `/close` (session-end
  may surface "consider /extract" when devlog has accumulated entries).

## What this skill is NOT

- **Not a one-time ritual.** Re-run after each FEAT, each mode unlock, each *"third time"* signal.
- **Not an automatic refactor.** The skill names the route; the founder (or `coder`)
  owns the actual code change.
- **Not a quality gate.** Skipping extraction doesn't fail anything. The override grammar
  applies — record in devlog if you deliberately skip.

## Rules

- **NOT-YET is a legitimate answer.** Honest no-pattern-extractable beats inventing one.
- **Two destinations, not one.** PRINCIPLE #1 is explicit: UP into BOSS or DOWN into app.
  Treating extraction as one-way (always-UP) is the failure mode this skill exists to prevent.
- **Three signals, not feelings.** Same-work-repeated / named-and-stable / load-bearing-
  decision. If you can't tie the candidate to one of the three, it's premature.
- **Record before route.** Write the EXTR-NNN file FIRST; run `boss learn` or refactor
  AFTER. The record IS the discipline.
- **Cite PRINCIPLE #1.** This skill exists to encode that principle. Naming it in the EXTR
  file ties the discipline back to its source.
- **At most three candidates per /extract run.** More than three means you're inventorying,
  not pausing. Pick the load-bearing ones; let the rest re-surface naturally.
