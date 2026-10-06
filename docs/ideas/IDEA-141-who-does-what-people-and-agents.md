---
id: IDEA-141
type: idea
kind: capability
owner: Ajesh
status: seedling
proof: none
proof_note: captured only — nothing is built; the proof is the first page that shows an overlap or an orphan in a real project.
gist: As a founder's agents multiply and a team arrives, nobody can say who — person or agent — owns which surface and does which jobs. A generated "who does what" map, people and agents on one page, read from the files that already declare it; a responsibility map, not a hierarchy and never a RACI matrix.
created: 2026-10-05
relates: IDEA-124, FEAT-021, IDEA-136, IDEA-037
---

# Who does what — people and agents on one map

## Current shape
_The best articulation so far. Rewrite this as the idea sharpens._

- **What:** a page in the founder's playbook that answers *who is responsible for what, and what are
  their key jobs* — the people (the roster in `.boss/config.json`, `src/team.js`) and the agents
  (`.claude/agents/*.md`: description, tools, the surfaces and files each owns, the skills it runs) on
  one map. Generated from those files, never authored, so it can't drift from them.
- **What it would show that nothing shows now:** a surface **two** owners claim; a surface **nobody**
  owns; an agent nothing has called (IDEA-124 rung 6: retire it); which person approves which agent's
  work (FEAT-021's Driver/Approver — the only two primitives BOSS keeps).
- **Who it's for:** a founder whose agent inventory has outgrown memory, and a team past two people.
- **Not this:**
  - **Not a hierarchy.** Agents don't report to each other; a person answers for an agent's work.
  - **Not a RACI matrix** — FEAT-021 already rejected DACI/RACI/RAPID.
  - **Never a reading of people.** No counting a person's commits, calls or hours — governance pointed
    at a person is surveillance (IDEA-137 · H1). Agents may be counted (calls from the trace); people only declared.
- **When it arrives (lean):** dormant until it's earned, like `team.js` — a second person declared,
  an agent split (IDEA-124 rung 5), or more agents than a founder can name. V1/Scale, not MVP.
- **Warrant:** the craft curve (agents multiplying is the host moving), not founder evidence — n=0 asked.
- **Open questions:**
  - Q1 · Where does an agent's *ownership* get declared — a frontmatter field (`owns:`), or read from
    what already names an owner (`mentor-architect` owns the engineering seed; record `owner:` fields)?
    Lean: read what exists first; a field only if the reading can't find one.
  - Q2 · Its own page, or a section of the playbook's team space / IDEA-136's P4 (the agents on the code)?
  - Q3 · Does BOSS's own repo (many agents, one person) serve as the first instance?

## Capture log
- **2026-10-05 · Ajesh** — *"Another idea to create and store: Agentic and human organizational chart?
  As agent inventory grows, and teams scale. Who is responsible for what? and what are their key
  tasks? not sure"* → captured; read against IDEA-124 (agent shape), `team.js` (dormant-solo roster)
  and FEAT-021 (no RACI). Not building.
