---
paths:
  - ".claude/agents/**"
---

<!-- BOSS ships this rule and `boss sync` keeps it current. It loads ONLY when an agent file is
     opened, written or deleted — the moment it matters — never at session start. Delete it if you
     don't want it; sync will leave it deleted. -->

# Agent shape — when an agent specializes, splits, remembers or retires

Every agent here starts as one broad hand. Change its shape only when the work gives you a reason,
and take the **cheapest rung that answers it**. Every rung up adds a handoff, and handoffs are where
context gets lost. This holds for every agent — the coder, the designer, the tester, the planner.

| The work shows you | Rung | Do this |
|---|---|---|
| A stack, a test tool or a design system got picked | **1 · Specialize** | Write its conventions and commands into the agent's own file. The file *is* the expertise — reviewed, and shared with whoever works here next. |
| A second surface with its own conventions (web and mobile, app and API) | **2 · Scope** | A path-scoped rule per surface in `.claude/rules/`, with `paths:` set to that surface's folder. Still one agent; each surface's context loads only where it applies. |
| You corrected the same thing twice | **3 · Remember** | Write it into the agent's file. When the learnings outgrow the file, turn on the host's per-agent memory (`memory: project` in the agent's frontmatter): the agent keeps its own notes under `.claude/agent-memory/<name>/`, committed. The agent writes those, so read them like code. |
| The work runs long, or several pieces run at once | **4 · Run on** | Run it in the background and resume it. Give agents that work in parallel on one repo their own worktree (`isolation: worktree`). Neither needs a second agent. |
| One of the four reasons below | **5 · Split** | Make a second agent. Name both for the work they do, not the org chart. |
| Two agents hand off on nearly every task, or one is never called | **6 · Merge or retire** | Merge the pair. Delete the unused one. `boss sync` leaves a deleted BOSS agent deleted. |

**The four reasons to split** — one has to hold, and "the project got bigger" is not one:

- **Different tools.** A reviewer that must not edit; a deploy step that needs a shell the designer
  must not have.
- **A different model tier or effort.** Cheap wide search and deliberate review want different settings.
- **Genuinely independent work.** Neither side ever needs to see the other's output.
- **Two people own two surfaces**, and each shapes their own agent.

**Never split the step that has to see everything** — the one that decides, reconciles or
synthesizes. If you'd need a checker to fix disagreements between two agents, the split was wrong.
Gather in parallel; conclude in one place.

**How you know (rung 6):** the evidence is what agents actually did, not what they're for. If the
trace hook is on, `/judge-traces` counts calls per agent and the pairs that always hand off.

## Making, changing or deleting an agent

- **`description:`** says *when* to call it, in the words a request would use. Keep it short —
  every agent's description sits in context on every turn.
- **`tools:`** the fewest that do the job. Never tell it to run something it has no tool for.
- **A reshape that changes who does what is a decision.** Record it with `/decide`, including what
  would reverse it.
- **Say it in one line** before you do it. Never reshape an agent silently in the middle of a task.
- An agent file you create or edit is picked up mid-session; a brand-new `.claude/agents/` folder may
  need a restart.
