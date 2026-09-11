---
id: DEC-017
type: decision
owner: "@ajeshh"
decided_by: founder
status: decided
created: 2026-09-11
confirmed: 2026-09-11 — Ajesh, "I think i do want to publish to claude plugins"
reversibility: two-way
revisit_by: 2027-03-11
---

# DEC-017 — the plugin is the front door, never the body

> Written the morning it was built. IDEA-096 had held the question as *"is a plugin BOSS, or the
> CLI's clothes without its body?"* and refused to build until it was answered. This is the answer.

## Context

Claude Code has a plugin system: a directory with `.claude-plugin/plugin.json` plus `skills/`,
`agents/`, `hooks/hooks.json` and `bin/`, installed with `/plugin install name@marketplace`, and
discoverable through Anthropic's `claude-community` marketplace or any GitHub repo carrying a
`.claude-plugin/marketplace.json`. Ajesh wants BOSS there: *"a lot of folks use VS Code, Cursor
… how to be added to those places."*

BOSS's shape — 48 skills, 12 agents, two hooks, a settings floor — *is* the plugin shape. The
obvious move is to point `plugin.json` at `stages/*/template/.claude/` and ship everything.

That obvious move is wrong, for reasons IDEA-006 wrote down in June without knowing this was the
question: **under beats on-top.** BOSS's value is a *substrate in the project* — `.boss/manifest.json`,
`docs/loops/`, `docs/ideas/`, the evidence ledger, the venture brain — that the hooks read and
the skills write, versioned per project, diffed by `boss sync`, removed cleanly by `boss remove`.
A plugin is installed *per user*, not per project. It has no `.boss/`. It is enabled in every folder
the founder opens, including ones that are not ventures.

Two concrete failures if the full surface shipped as a plugin:

1. **Double-firing.** A founder with the plugin *and* a scaffolded project gets the conscience hook
   from `hooks/hooks.json` **and** from the project's `.claude/settings.json` — two nudges per turn,
   and no honest way to dedupe across the two registries.
2. **Two vocabularies.** Plugin skills are namespaced (`/boss:idea`), project skills are not
   (`/idea`). Both remain available — the docs say so — so every scaffolded project would show 96
   skills in `/help`, half of them the same thing with a colon in front.

## Decision

**The plugin is thin. It is the way a founder *finds* BOSS and the way `boss` reaches their PATH.
It is never where BOSS *runs*.**

Specifically:

1. **The repository is the plugin.** `.claude-plugin/plugin.json` sits at the repo root. Its
   `bin/` *is* the repo's `bin/`, so enabling the plugin puts `boss` on the Bash tool's PATH with no
   npm step — `boss new` and `boss adopt` work from inside Claude the moment it is installed.
2. **The plugin ships exactly one skill, `/boss:welcome`**, from `plugin/skills/`. It orients, it
   asks new-vs-adopt, it runs the CLI on the founder's say-so, and it hands off to the project's own
   `/welcome`. If it is invoked inside a project that already carries BOSS, it says so and steps
   aside.
3. **No hooks, no agents, no settings in the plugin.** The conscience, the mentors, the deny floor —
   all of it arrives through `boss new` / `boss adopt`, into the project, where it always has.
4. **The marketplace file lists the repo root as its own plugin** (`"source": "./"`), so
   `/plugin marketplace add ajeshh/bossbuild` → `/plugin install boss@bossbuild` works today, and
   the same directory is what gets submitted to `claude-community`.
5. **`plugin.json` `version` tracks `VERSION`**, enforced by the release gate. A plugin whose version
   never moves never updates.

## Why

- **The substrate is the product; the plugin is a door.** Everything that makes BOSS BOSS — the
  arc-memory, the interrupt points reading *this venture's* files — is per-project by construction
  (DEC-015 made even per-person state key on the project). A user-scoped install cannot carry it.
- **It answers the presence question without inventing a second BOSS.** One codebase, one set of
  skills, one place they run. The plugin adds a route in, not a parallel surface to keep in sync.
- **`bin/` on PATH is the real win, and it is free.** The one thing a plugin can do that the
  scaffold cannot is be *installed before there is a project*. Putting `boss` on PATH there means
  the README's `npm install -g oyeboss` becomes optional for anyone already in Claude Code.
- **It is reversible.** Nothing in the project changes shape. If a thicker plugin is ever right, it
  is additive to this one; if this one is wrong, deleting two files and a folder undoes it.

## Rejected alternatives

- **Full surface as a plugin** (`"skills": "./stages/L0-quickstart/template/.claude/skills"`).
  Double-firing and the 96-skill `/help`, above. Also breaks `boss sync`'s whole premise — a
  reviewed, per-project diff — since plugin updates arrive silently and globally.
- **Plugin hooks that no-op when the project has its own.** Technically possible (check for
  `.claude/hooks/conscience.js` and exit). Rejected because it makes the plugin's behaviour depend
  on a file it does not own, and because the conscience with no `.boss/` underneath has nothing to
  read — a hook that fires in every non-venture folder the founder opens is noise wearing BOSS's
  voice.
- **A Cursor-native port.** Cursor's own agent now has the hook primitives (IDEA-006 records this),
  but the Claude Code extension already installs in Cursor, so full BOSS is reachable there today.
  A second host port before a founder asks is the reach-money-before-demand mistake.
- **Waiting.** n=0 on plugin demand specifically. But this costs two JSON files and one skill, it
  is the cheapest presence move on IDEA-096's ladder, and the design question it forced was worth
  settling on its own.

## Falsifier — what would prove this wrong, and by when?

**By 2027-03-11:** if founders who arrive via the plugin consistently stall between `/boss:welcome`
and a scaffolded project — install, orient, never run `boss new` — the door is too far from the
room, and a thicker plugin (one that scaffolds without leaving Claude) is the fix. Evidence would be
an EVID record from a plugin-installed founder, or the community-marketplace listing's own
install-vs-activation signal if Anthropic exposes one.

The cheaper falsifier arrives sooner: if `claude plugin validate` or the community review rejects a
plugin whose `bin/` is the whole CLI, the "repo is the plugin" half needs a `plugin/` subtree with
its own copy of `bin/` — the decision survives; the layout changes.

## Consequences

- New files: `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`,
  `plugin/skills/welcome/SKILL.md`. `scripts/release.js` checks `plugin.json` version = `VERSION`.
- README gains a fourth install path. The site's install block does not — three commands is
  already the ceiling for a hero; the plugin route belongs on `start.html`.
- **Submission to `claude-community` is Ajesh's action** — the Console form at
  platform.claude.com/plugins/submit, after `claude plugin validate . --strict` passes. Approval
  pins a commit SHA; CI bumps it on push.
- `boss sync` is unaffected. `boss remove` is unaffected. Nothing in a founder's project changes.
- IDEA-096's distribution ladder: row 2 done; row 3 (community listings) becomes "submit the form".

## Related

- IDEA-096 — presence where founders already code (the question)
- IDEA-006 — conscience host-portability (*"under beats on-top"*, 2026-06-05)
- DEC-015 — per-person state is keyed to a person, not a directory (why the substrate is per-project)
- IDEA-095 — cross-platform (the `bin/boss` on PATH route assumes the CLI runs where Claude runs)
