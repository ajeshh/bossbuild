---
name: board
description: The cross-FEAT sequencing surface for {{PROJECT_NAME}}. Reads INDEX + FEAT frontmatter + smoke state + evals state + override entries to produce a live board view — what's open, what's blocked, what's next, what's parallelizable. Owned by `planner` (the *when*; distinct from `product-lead`'s *what*). Usage - /board  (or /board --next, /board --blocked, /board --by-cohort)
---

# /board — the cross-FEAT sequencing surface

At MVP the queue was small; `planner`'s next-up list lived in conversation. At V1
there are usually 5+ FEATs in flight, real dependencies between them, real blockers, and a
real need to surface *what is the project actually working on right now.* `/board` is that
view.

It's a *live read*, not a maintained document. The skill computes it from the frontmatter +
state of the actual FEAT files. If you want to change the board, change the FEATs — don't
edit the board view.

## What the board shows

By default (`/board` with no flags):

```
{{PROJECT_NAME}} — board
  mode: {{MODE}}
  smoke: ✓ green  (last run: <when>)
  evals: 12 / 14 cases passing across 3 FEATs  (2 failing in FEAT-007)

  In flight (3):
    ⊙ FEAT-005  user-onboarding-flow      acceptance: 3/5  smoke: ✓  evals: n/a
    ⊙ FEAT-007  AI-summarization-prompt   acceptance: 1/4  smoke: ✓  evals: 4/6 ⚠
    ⊙ FEAT-008  schema-migration-v2       acceptance: 0/3  smoke: ✗  blocked: schema review

  Next-up (2, ordered):
    ◯ FEAT-009  empty-state-illustrations  deps: FEAT-005 done
    ◯ FEAT-010  hover-state-microinteractions  deps: design-tokens-loop closed

  Blocked (1):
    ▣ FEAT-006  team-permissions           blocked: needs mentor-money call (pricing tier shape)

  Deferred (1):
    ⌀ FEAT-011  ai-suggest-completion      override: skipped — rationale: re-open after FEAT-007 evals stabilize

  Recently shipped (3, last 14 days):
    ✓ FEAT-002 ✓ FEAT-003 ✓ FEAT-004
```

## How to run it

1. **Walk `docs/ideas/FEAT-*.md`** to enumerate every FEAT. Read each one's frontmatter
   (`status`), acceptance-criteria checklist progress, smoke field, evals field.
2. **Walk `docs/devlog.md`** for override entries naming FEATs. Filter recent ones.
3. **Walk `docs/loops/*.md` state** (use the same logic `boss status --conscience` uses) to
   identify loops that gate any FEATs (e.g., a FEAT depends on `design-tokens-loop` being
   closed).
4. **Compute the board.** Group FEATs by status:
   - **In flight** — `status: building`; show acceptance progress + smoke + evals state
   - **Next-up** — `status: ready` (specced, not yet started); show dependencies + suggested order
   - **Blocked** — `status: building` AND smoke is red, or a dep is unclosed, or an override
     was recorded
   - **Deferred** — `status: deferred` or an override entry naming this FEAT exists
   - **Recently shipped** — `status: shipped` within last 14 days (cap at 5)
5. **Output the board** in a readable Markdown-friendly text format.

## Flags

- `--next` — show only Next-up, ordered with rationale
- `--blocked` — show only Blocked, with the specific blocker for each
- `--by-cohort` — group by which persona-cohort the FEAT primarily serves (reads
  `.boss/config.json` cohort + FEAT frontmatter `serves_cohort` if present)
- `--deferred` — show only Deferred + the re-open conditions from each override
- `--evals` — show evals state across FEATs; highlight FEATs with failing cases

## How the board interacts with the conscience

The board is `planner`'s view; the conscience's loops are independent. But they
intersect at the boundaries:
- A FEAT in *Next-up* whose `spec-loop`'s entry isn't satisfied (canvas-loop not closed) is
  arguably premature; flag with `⚠` and a one-liner.
- A FEAT in *Blocked* on `design-tokens-loop` is signal that `/design-tokens-init` should run.
- Multiple FEATs *Deferred* with overrides pointing at the same upstream concern is signal
  for `product-lead` or `mentor-founder` — there's a real bottleneck, not just incidental skips.

## What this skill does NOT do

- Doesn't edit FEAT files. View-only. To change priority, change the FEAT's frontmatter or
  acceptance state.
- Doesn't run smoke / evals. It reports their *last known result* per FEAT. To get fresh
  state, run `/smoke` or `/evals` first.
- Doesn't track dependencies that aren't declared. If `FEAT-008` actually depends on `FEAT-005`
  but the FEAT files don't say so, the board can't show it. Declaring deps in FEAT frontmatter
  (`requires: [FEAT-005]`) is the discipline that makes the board honest.

## Rules

- **Live read, not maintained doc.** Don't write a `docs/board.md`. The view IS the board.
- **Frontmatter is truth.** If the board is wrong, fix the source FEAT file, not the board view.
- **Brief.** A board view longer than one screen is failing — group, summarize, link to detail.
- **`planner`-owned.** This skill is the planner agent's primary surface; when
  ambiguity about priority emerges, route to `planner`.
