# AGENTS.md — {{PROJECT_NAME}}

> Working rules for **any** AI coding agent in this repo (host-neutral). Scaffolded by BOSS
> {{BOSS_VERSION}} on {{DATE}}. Claude Code reads this through `CLAUDE.md`; other tools (Codex,
> Cursor, Copilot, Devin…) read it directly. Source of truth for *how work is done here*.

## Working rules (read first)

1. **Capture before you build.** Every idea, bug or ask becomes an `IDEA-NNN` in `docs/ideas/` before code. Its frontmatter `status` is the record of where it stands; `boss board` renders the rest.
2. **Stack-neutral until decided.** No assumed stack. The first real build decision picks one — record it, don't hold it in your head.
3. **Source of truth is the docs, not the chat.** If code and a doc disagree, surface it before changing either.
4. **Small, reversible steps.** One concern at a time. Prefer editing an existing file to adding one.
5. **Ask before risky or irreversible actions** (deletes, force-push, anything shared). Local reversible edits don't need a check.
6. **Don't over-build.** No speculative abstractions, no handling for impossible states, no comments that restate the code.
7. **Grow the system deliberately.** Ceremony arrives by mode (Quickstart → MVP → V1 → Scale), only when earned. `boss unlock <mode>` lays each one down.

## Conventions

- **IDs:** `IDEA-NNN` (raw ideas), `DEC-NNN` (load-bearing or one-way-door decisions). See `docs/IDS.md`; more types unlock with later modes.
- **Decisions:** `/decide` writes the record — Context / Decision / Why / Consequences, who decided, how reversible. Supersede, don't edit.
- **Frontmatter:** every new doc carries `id`, `type`, `owner`, `status`.
- **Backup & share:** `docs/` commits with the repo, so **pushing backs up your thinking** and a cofounder who clones is in the loop. Only secrets and the conscience's private read stay local. `boss team add @handle "Name"` when someone joins — solo is the default.
- **Git:** small commits, present-tense messages, never force-push a shared branch without asking.

## Project overview

<!-- Replace this with what {{PROJECT_NAME}} is. Already written somewhere — a doc, a deck, an
     Obsidian note, a PDF, a link? Point your agent at it and capture the idea. -->

_TBD — describe {{PROJECT_NAME}} here._
