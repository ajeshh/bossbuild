# CLAUDE.md — {{PROJECT_NAME}}

@AGENTS.md

> Scaffolded by BOSS {{BOSS_VERSION}} in **{{MODE}}** mode ({{STAGE}}) on {{DATE}}.
> Host-neutral rules live in `@AGENTS.md` (imported above); this file adds the Claude-specific layer.
> **Keep both short** — every line is read on every turn, so it spends the founder's context budget.
> If something can be *looked up*, link it.

> **First time? Run `/welcome`.** Already know BOSS? `/boss <idea, file, doc, or URL>` spins up.
> Already have a repo? `/read-repo` reads it and says where you stand.

## What's here

- **Agents:** `product-lead` (what's worth building), `coder` (builds it, in whatever stack gets
  chosen), `mentor-founder` (is this worth it, the riskiest assumption, the next real step),
  `prompt-coach` (sharpens how you ask — *"help me ask this better"*).
- **Skills and mode:** `boss map` lists what this project has, live; `boss status` says the mode and
  what's next; `boss unlock <mode>` climbs a rung (Quickstart → MVP → V1 → Scale, each when earned).
- **Docs:** `docs/ideas/` (living idea docs + canvases), `docs/IDS.md` (the ID system).
- **Memory:** facts about *you* go to Claude's auto-memory (this machine only); anything the project
  depends on belongs in `docs/`. Notes for one area of the code go in `.claude/rules/`.
- **`/clear` and `/compact` drop working context.** What survives is what's on disk: every session
  start reads the work in flight back from its records (the idea doc; at MVP, the FEAT and its
  program). Put anything you'd hate to re-derive into the record *before* you run them.
- **When compacting, keep:** the files changed and why, the decisions made this session, and every
  task or question found that is not yet written into a record.

## The Quickstart arc

**capture → pressure-test · talk to one person (either order) → unlock MVP.**
`/idea` captures (a living doc; re-run it as thoughts land) · `/canvas` pressure-tests and names the
riskiest assumption (`/scout market rivals` answers its *who else sells a fix*, with sources) · `/interview` preps a Mom-Test call and `/evidence` grades what you heard ·
`boss unlock mvp` when the canvas holds. `/prototype` is a legitimate start too. Capturing isn't
validating — the conscience says so once, never as a gate.

## Before you generate anything durable

Three questions, three seconds: **does it already exist?** (look for the *output*; if it's there and
fine, say so and stop) · **what rung is this project on, and what rung does this belong to?** · **if
it's above their rung, what's the seam** — the one cheap thing that stops history being *gone*.
`boss craft seed-to-scale` has the worked examples.
