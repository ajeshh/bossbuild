---
id: IDEA-034
type: idea
owner: product-lead
status: shipped
gist: Turn the board from a mirror into something the founder and the agent steer by — --next, --blocked, --json, aging, priority, and the program roll-up.
program: the-record-system
proof: src/board.js
created: 2026-06-20
---

# Board intelligence — from a mirror to something you (and the agent) steer by

> Builds on [IDEA-015](IDEA-015-visual-board.md) (the board as a pure projection — text + `--html`)
> and [IDEA-027](IDEA-027-dhun-machinery-imports.md) (staleness / `next_review` / the board line).
> Occasioned by a founder ask: *"we have the kanban visual + the internal board that syncs —
> what else makes it better? any AI board-management best practices?"*

## The reframe

The board is already ahead of most "AI board" advice: it's a **pure projection** of `status:`
frontmatter (`src/board.js`), never a maintained document. The 2026 best practice — *stop
maintaining a board by hand, project it from the work artifacts* — is exactly what's already here.
So the improvements aren't "richer kanban" (drag-drop, swimlanes, story points, a `board.json` —
all **refused**: each reintroduces a second source of truth or the ceremony BOSS subtracts). They're
"make the projection answer harder questions and feed the conscience."

## The four tracks (all building this pass)

- **A — Agent-readable board (`boss board --next` / `--blocked` / `--json`).** Today Claude *writes*
  the source files but never *reads* the board. The AI-native move is the board as the agent's
  task-queue/shared-state: `--blocked` (only blocked + review-due, with the reason), `--next` (an
  ordered "what to pick up" over the flow), `--json` (the machine-readable projection — the actual
  agent-readability enabler). CLI-level, so it works in every mode; a lighter cousin of the V1
  `/board` skill (which reads smoke/evals/deps the CLI doesn't have).
- **B — Time-in-column aging.** Extends the `↻ review due` half (IDEA-027). A FEAT stuck in Building
  for weeks is the zombie-feature smell `/revalidate` targets. **Frontmatter-true, never guessed**
  (same discipline the board already holds for `next_review`): `/spec` stamps `building_since:` when
  it sets `status: building`; the board flags `⌛ Nw in build` past a threshold. No `building_since`
  → no flag.
- **C — Honest flow in `boss insights`.** Time-to-graduation (captured→build), derived only from the
  `created:` dates that already exist — never throughput/velocity/burndown (the vanity metrics the
  humane lens refuses). Per-project "stuck for Nd" + a portfolio "median idea→build" where derivable;
  omit when the dates aren't there (don't guess).
- **D — Board state → conscience signal (`focus` moment).** A pile in Building with nothing Shipped
  is a drift smell: *finishing beats starting.* New `focus-loop` (L1-mvp; entry = ≥4 in-flight FEATs,
  exit = ≥1 shipped → auto-silences the moment you prove you can finish). Judge-style voice (read the
  board, distinguish real WIP-overload from genuinely parallel tracks), at most once per session,
  never a gate. Conservative threshold + auto-silence are the over-fire guards.

## Track E — lightweight priority (added on Ajesh's follow-up)

He asked: *"priority does matter if someone says 'this is high priority'… dunno."* The load-bearing
call, because priority is exactly where a board tips into the maintained-Jira BOSS refuses to be. The
cut: priority is a **property of the work**, so `priority: high` in frontmatter is legit and
frontmatter-true (the board reads it; you never maintain the board). What BOSS refuses is the
*ceremony* — P0/P1/P2/P3 tiers and drag-to-reorder, which become a planning toy you fiddle with
instead of shipping. So: **one optional `high` flag** — floats to the top of its column (`⬆`), leads
`--next`, layered over the default finish-first sort. The caveat (*re-prioritizing isn't progress;
finishing is*) ships in `/spec`. Decided with Ajesh via a previewed question (chose lightweight-flag
over full-tiers over no-priority). Same pass: a **visual sharpening** of the HTML (chosen over
"good as-is") — bold titles / quiet ids, tinted stuck-cards that pull the eye, uppercase kicker.

## Decisions held

- **Ships as one themed release** (4 tracks), matching the v0.51 "visual kanban + voice" precedent —
  renumber into separate bumps if wanted.
- **Refuse:** drag-to-move, manual card edits, swimlanes, story points/velocity, a writable
  `board.json`. Every one reintroduces a second source of truth or premature ceremony.
- **Track D limitation** (documented, like drift-loop's): exit = "≥1 shipped ever," so the moment
  targets the never-finished pile and goes quiet after the first ship; a "shipped *recently*"
  semantic would need date-compare the predicate vocabulary doesn't have. Deferred until it matters.
- **Track D judgment evals:** gate eval added now; the GRADED judgment-surface row deferred (consistent
  with how `restraint`/`coherence` are deferred) — build it the week it first matters.
