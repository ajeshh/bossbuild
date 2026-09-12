---
id: COMP-beads
type: competition
owner: product-lead
status: living
sort: watch
checked: 2026-09-12
source: github.com/steveyegge/beads — README at main (raw), fetched 2026-09-12 · named as a category by the Thoughtworks Technology Radar vol 34 (April 2026, PDF read at source), Tools › Assess, blip 78
updated: 2026-09-12
---

# Beads — an issue tracker built for agents, which is BOSS's project rung with the venture removed

> **Read from the primary.** The README at `main` on 2026-09-12 and the Radar's own blip text.
> Where this says *"the README says"*, it is quoting. Stars and the Dolt storage claim were read
> from the GitHub page the same day.

## What it is

*"Distributed graph issue tracker for AI agents, powered by Dolt."* Steve Yegge. **★27.1k, MIT.**
The README's motivation, verbatim: *"Beads provides a persistent, structured memory for coding
agents. It replaces messy markdown plans with a dependency-aware graph, allowing agents to handle
long-horizon tasks without losing context."*

The mechanism is a task graph the agent reads and writes through a CLI: `bd ready` (tasks with no
open blockers), `bd create`, `bd update <id> --claim` (atomic claim, for many agents on one graph),
`bd prime` (prints the workflow context and persistent memories at session start), `bd remember`
(stores a memory `bd prime` will inject later). Hierarchical ids for epics (`bd-a3f8`, `bd-a3f8.1`,
`bd-a3f8.1.1`); graph links `relates-to`, `duplicates`, `supersedes`, `replies-to`. **Compaction:**
*"Semantic 'memory decay' summarizes old closed tasks to save context window."* Storage is Dolt (a
versioned SQL database) under `.beads/`; sync is `bd dolt push/pull` against git remotes; the
`.beads/issues.jsonl` is an export, not the source of truth. Installs into Codex CLI, Claude Code,
Factory Droid, Mux and Cursor via `bd setup`.

**The Radar's reading (vol 34, Assess):** *"a new category of agent-native project memory and task
tracking tools. Other early projects in this space include `ticket` and `tracer`. Unlike traditional
ticketing systems such as GitHub Issues and Jira, Beads and similar tools enable new workflows for
coordinating autonomous multi-agent execution, including agents assigning tasks to one another."*
It is the durable work ledger Gas Town uses for its swarm — and the Radar puts *coding agent swarms*
at **Caution**.

## Pricing

Free. A CLI in a public repository. Nothing to compare.

## Why they might win

- **It is the category's name.** When the Radar needed a word for *"agent-native project memory"* it
  used this repo, at 27k stars. BOSS's project rung — records, board, `reentry`, `feature-context.md`
  — is in that category and nobody outside BOSS has ever called it that.
- **`ready` is a derived column BOSS does not have.** *Tasks with no open blockers* is computed from
  the graph, not maintained. `boss board` derives status from frontmatter and progress from ticked
  criteria, but "what is unblocked right now" is a question it cannot answer because FEATs carry no
  `blocked_by:`. That is the one mechanism here worth studying.
- **`bd prime` is BOSS's `reentry` hook, and `bd remember` is BOSS's memory-cue** — the same two
  seams, closed the same way, from a repo with a hundred times the audience.
- **Compaction of closed work is a real answer to a real cost.** BOSS's records are append-only by
  design and its context discipline is *don't load them*; Beads summarizes the old ones. Different
  bet, and theirs is cheaper per session on a long project.
- **The pitch is aimed at BOSS's substrate.** *"Replaces messy markdown plans"* is a sentence a
  founder arriving from Beads will hold against `docs/ideas/*.md`.

## Where they're weak

- **No *why*.** A bead has a title, a priority, blockers and links. Nothing in the model asks who it
  is for, what evidence earned it, or what result would change the plan — `for:`, `from:`, the
  EVID grade, *Validated learning*. It tracks work; it does not know whether the work is worth doing.
- **No closed status vocabulary and no `proof:`.** A status is what an agent last wrote. BOSS's
  `check:backlog` refuses a `shipped` whose proof is not on disk, and refuses a built thing nobody
  marked shipped; a bead can say anything.
- **Nothing about the person.** No rung, no cohort, no conscience, no *"where am I"* — the exact
  axis BOSS's three evidence files converge on (*emits and never mirrors*). Beads is for the agents.
- **Built for swarms, sold to everyone.** Atomic claims and hash ids that *"prevent merge collisions
  in multi-agent/multi-branch workflows"* solve a problem a solo founder with one Claude does not
  have — and the Radar's verdict on the workload it was built for is Caution.
- **A second source of truth beside git.** Dolt under `.beads/`, synced separately from the code.
  BOSS's records are files in the repo; `git log -S` reads them. That is the same two-sources-of-truth
  shape the design-system field file refuses for tokens (RVW-081), one layer down.

## Where it breaks

_Not observed — no BOSS founder has named it. The README's own known limitation: schema-version
mismatches between the binary and the database fail hard, with an escape hatch
(`BD_IGNORE_SCHEMA_SKEW`). A versioned-database dependency in a task tracker is a maintenance
surface a markdown file does not have._

## What I did not find

`ticket` and `tracer` — the Radar's two other members of the category — were not opened. Not
searched: how Beads reads inside Claude Code specifically (`bd setup claude` was not run).

## The read

Beads is what the project rung looks like when you keep the ledger and drop the venture: a good
graph, a session-start injection, compaction — and no evidence, no why, no person. **Study `ready`.
Do not adopt the graph.** A `blocked_by:` field on a FEAT is a cheap seam if a real project ever
asks "what's unblocked"; until one does, the board's derived columns are the right answer at this
rung.

## Change log

- **2026-09-12** — filed, from the SESSION-2026-09-12 engineering + PM read. `watch`.
