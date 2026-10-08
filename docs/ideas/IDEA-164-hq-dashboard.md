---
id: IDEA-164
type: idea
kind: capability
owner: product-lead
status: seedling
created: 2026-10-08
program: PROG-006
relates: IDEA-015, IDEA-055, IDEA-162
gist: One view of every project on this machine — what each is, where it stands, what's next, and which window is on it.
next: decide whether `boss hq` replaces `boss list` (PROG-006 task), then build rung 1 (2026-10-08)
---

# IDEA-164 — The HQ dashboard

`boss board` reads the project you are standing in. `boss list` is the only thing that sees every
project, and it prints a name, a mode and a BOSS version — nothing about what the project *is* or
where it stands. With dhun and others on the same machine, there is no way to look across them.

## What a card shows

| On the card | Read from |
|---|---|
| What this is | the project's venture `gist:`, else the Mailroom row's ([[IDEA-165]]) |
| Where it stands | `boss board --json` in that project, else RESUME, else git |
| What's next | the board's `next:` (IDEA-162), else RESUME, else the Mailroom row |
| Last touched | git: last commit, branch, uncommitted changes, open worktrees |
| Which window | Claude Code sessions (`~/.claude/projects/<path>/`, last active); VS Code's open folders |
| Room | which of Mailroom · Office · Studio · Boardroom it lives in |

## Rungs

1. **`boss hq`** — the cards in the terminal, plus `--json` as the contract everything else reads.
   Node built-ins only.
2. **`boss hq --html`** — a local page from the same JSON (`page-shell.js` is already there).
3. **Window awareness** — which Claude session and which editor window is on which project. The newest
   part; nothing does it today. Read-only, local files only.
4. **The menubar app** — native, its own repo, reading only `boss hq --json`, with a global hotkey to
   drop a note into the Mailroom. Only if rung 2 gets used.

## Rules

PROG-006's: no rank, no nag, no streaks; busy projects loud, quiet ones resting; nothing leaves the
machine.

## Tasks

- [ ] Rung 1: `boss hq` + `--json`, reading each registered project's board without changing into it.
- [ ] Measure: how long does reading N boards take? Set a budget before rung 2 (a slow HQ is a closed HQ).
- [ ] Find out what VS Code and Claude Code write locally that names an open folder — read at source,
  not from memory — before promising rung 3.

## Found while building
