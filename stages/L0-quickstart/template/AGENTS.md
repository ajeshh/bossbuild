# AGENTS.md — {{PROJECT_NAME}}

> Working rules for **any** AI coding agent in this repo (host-neutral). Scaffolded by BOSS
> (BOSS) {{BOSS_VERSION}} on {{DATE}}. Claude Code reads these through `CLAUDE.md` (which imports this
> file); other agent tools (Codex, Cursor, Copilot, Devin, …) read this file directly. Keep it the
> source of truth for how work is done here — `CLAUDE.md` adds only the Claude-specific layer.

## Working rules (read first)

1. **Capture before you build.** Every idea, bug, or ask becomes an `IDEA-NNN` file in `docs/ideas/` before code. Its frontmatter `status` is the only record of where it stands; `boss board` renders the rest.
2. **Stack-neutral until decided.** This project has no assumed stack. The first real build decision picks one; record it in an idea/spec, not in your head.
3. **Source of truth is the docs, not the chat.** Decisions go in `docs/`. If code and a doc disagree, surface it before changing either.
4. **Small, reversible steps.** One concern at a time. Prefer editing existing files to adding new ones.
5. **Ask before risky/irreversible actions** (deletes, force-push, anything affecting shared state). Local reversible edits don't need a check.
6. **Don't over-build.** No speculative abstractions, no error handling for impossible states, no comments that restate the code.
7. **Grow the system deliberately.** This project grows through *modes* (Quickstart → MVP → V1 → Scale); add ceremony only when the project earns it. The BOSS CLI lays each mode down (`boss unlock <mode>`).

## Conventions

- **IDs:** `IDEA-NNN` for raw ideas, `DEC-NNN` for load-bearing/hard-to-reverse decisions (see `docs/IDS.md`). More ID types unlock with later modes.
- **Decisions:** record the load-bearing or one-way-door calls with `/decide` → a `DEC-NNN` (Context / Decision / Why / Consequences + who decided + how reversible). Supersede, don't edit. The rationale future-you and a cofounder can read instead of guessing.
- **Frontmatter:** every new doc carries `id`, `type`, `owner`, `status`.
- **Backup & share:** your `docs/` (ideas, canvas, `DEC-NNN` decisions, RESUME) and the venture brain's `read.md` commit with the repo — so **pushing backs up your thinking**, and a cofounder who clones is **in the loop**. Only secrets and the conscience's private relationship-with-you stay local. Building with a cofounder? `boss team add @their-handle "Name"` (solo stays the default — the team layer is dormant until someone joins).
- **Git:** small commits, present-tense messages, never force-push shared branches without asking.

## Project overview

<!-- Replace this with what {{PROJECT_NAME}} is. Already have it written somewhere — a doc, a deck,
     an Obsidian note, a Google Doc, a PDF, a link? Point your agent at it and capture the idea. -->

_TBD — describe {{PROJECT_NAME}} here._
