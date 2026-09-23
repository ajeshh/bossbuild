---
id: IDEA-124
type: idea
kind: capability
owner: Ajesh
status: shipped
proof: none
proof_note: warrant is the craft curve (host subagents gained per-agent memory, background runs and live reload), not founder demand — same warrant as IDEA-122. The check that the wording works is the first founder project that reshapes an agent.
gist: One rule for every builder agent — when it specializes, splits, remembers, runs on, merges or retires, cheapest rung first. BOSS promised a coder split at V1/Scale and shipped nothing there to say it; and a founder who deleted an agent got it back on the next sync.
created: 2026-09-23
relates: IDEA-014, IDEA-122
---

# IDEA-124 — Agent shape: when an agent specializes, splits, remembers or retires

## Current shape

Ajesh, 2026-09-23: *"how our engineering agents work and scale … when to know to split agents into
more pieces and being able to scale them as needed, and adapt accordingly to the tech being
involved"* → *"not just for eng, but … design or others as well … when should we start breaking it
based on work, collab, allowing the agents to keep running, building more expertise, and being able
to create or edit or delete agents accordingly."*

**Altitude:** what BOSS ships a founder. BOSS runs on the same agent files, so it applies here too.

### Measured before building

- `coder` is stack-neutral and told to (1) `/decide` the stack, (2) specialize its own file, (3)
  *"propose splitting into stack-specific coders in V1/Scale mode."* **(2) and (3) have no moment.**
  `/decide` never mentions an agent; V1 ships no agents; Scale ships only `mentor-hiring`; no loop
  watches for a second stack. A promised verb at a moment nothing runs (memory note, n=33 shape).
- The right split test already exists, in the wrong place: `harness-engineering.md` § *Split the
  gathering, never the synthesis* (different tools / model tier / genuinely independent work). The
  agent carries the weaker test ("multiple stacks").
- 🔴 **`boss sync` resurrects a deleted agent.** A managed file that is missing plans as `new`, so a
  founder who retires `designer` or splits `coder` into two gets the original back on the next
  `--apply`. "Delete agents accordingly" cannot work until that is fixed. The ledger already knows
  BOSS wrote the file (entries are never removed), so *ledger entry + no file* = the founder removed it.
- Rules files (`.claude/rules/`) are scaffold-only — not managed by sync — so a BOSS-owned rule would
  reach new projects and never existing ones.
- Host facts (code.claude.com/docs/en/sub-agents, read 2026-09-23; version for `memory:` not stated
  in the docs): per-agent `memory: user|project|local` (project = `.claude/agent-memory/<name>/`,
  first 200 lines of its `MEMORY.md` loaded); `background: true`; resume by message; `isolation:
  worktree`; agent files created or edited mid-session are picked up within seconds.

### The shape — one ladder, cheapest rung first, every builder agent

1. **Specialize** — a stack / test tool / design system gets pinned → write it into the agent's file.
2. **Scope** — a second surface with its own conventions → a path-scoped rule per surface; one agent.
3. **Remember** — the same correction twice → into the agent file (reviewed); learnings too many or
   too specific for the file → the host's per-agent project memory, reviewed like code.
4. **Run on** — long work → background + resume; parallel work on one repo → worktree isolation.
   Neither needs a second agent.
5. **Split** — only on different tools, different model tier/effort, genuinely independent work, or
   two people owning two surfaces. Never split the step that has to see everything.
6. **Merge / retire** — two agents that always hand off to each other → one; an agent nothing has
   called → delete it (sync now leaves it deleted).

## Slices

1. **sync leaves a deleted agent deleted** — ledger entry + missing file → `declined`, not `new`;
   `--force` brings it back. Test.
2. **sync manages BOSS-owned rules** — a `rules` manifest list, kind `rule`, same provenance guards.
3. **The rule** — `.claude/rules/agent-shape.md` (paths: `.claude/agents/**` — loads when an agent is
   being made, edited or deleted, never at session start), shipped in Quickstart.
4. **The agents point at it** — coder's split line replaced; designer, tester, planner, product-lead
   each carry one line: notice the signal, say it once in the report, never reshape uninvited.
5. **`/decide` closes rung 1** — a decision that changes what an agent must know updates that
   agent's file in the same turn.
6. **`/judge-traces` reads agent shape** — calls per agent, never-called agents, pairs that always
   hand off; the evidence for rungs 5–6.
7. **The practice** — `harness-engineering.md` gets the ladder and the dated host facts.

## Open questions / found tasks

- **Skills have the same resurrection bug** (a deleted skill dir plans as `new`). Not in slice 1 —
  a skill is a tree (SKILL.md + resources) and earned groups interact. Task, not new scope.
- A rule removed from a manifest later is not reported as an orphan (slice 2 manages, doesn't retire).
- Should agent memory ever be default-on for `coder`? No until a real project shows file-level
  specialization running out. Question, not a task.

## Log

- 2026-09-23 — captured; host facts verified; slices 1–7 cut.
- 2026-09-23 — all seven built in one pass. Slice 1: `declined` status in `planSync` (agent + rule
  kinds, ledger entry + no file), skipped by `applySync` unless `--force`, rendered under *Removed by
  you*; three tests. Slice 2: `manifest.rules` → kind `rule` in `managedFiles`, checked by
  `check-manifests`; one test. Slice 3: `agent-shape.md` in Quickstart. Slices 4–7: coder, designer,
  tester, planner, product-lead; `/decide` step 7; `/judge-traces` step 2; `harness-engineering.md`.
  `/tmp` run: deleted `prompt-coach` stayed deleted through `sync --apply`. 608/608, check green.
