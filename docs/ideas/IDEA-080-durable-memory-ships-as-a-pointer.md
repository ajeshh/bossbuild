---
id: IDEA-080
type: idea
owner: product-lead
status: deferred
proof: >
  [VERIFIED] mechanically, and the first claim CORRECTS a suspicion rather than confirming it.
  (1) `.claude/rules/` with `paths:` frontmatter is REAL and works exactly as v0.45.0 claimed —
  read out of 2.1.132's own loader: the memory scan keeps files WITHOUT `paths:` at session start
  and files WITH it only on a gitignore-style match against the opened file, with a trailing `/**`
  stripped. `src/**` resolves correctly. **No action; the shipped rule file is sound.**
  (2) "Claude's auto-memory" is also real and defaults ON — the gate returns true unless
  `CLAUDE_CODE_DISABLE_AUTO_MEMORY`/`CLAUDE_CODE_SIMPLE` is set, a rollout flag withholds it, or
  `autoMemoryEnabled` is false in settings. So the shipped CLAUDE.md line is TRUE.
  (3) What is NOT true is that BOSS does anything about it: no seed ships into a founder project
  (`library/memory-seed/` is BOSS's own shelf, not template content), `memory-cue.js` ships
  dormant and unregistered, and the host's per-project `autoMemoryEnabled` / `autoMemoryDirectory`
  settings are never set in the shipped `settings.json`. FOUNDER DEMAND [n=0].
proof_note: >
  This record started as a suspected [[checkers-state-intents-they-dont-enforce]] hit — shipped copy
  naming a host mechanism that does not exist — and the check killed that reading. Both mechanisms
  are real. Recording the kill matters as much as the finding: the `paths:` claim has now been
  verified against the BINARY, not the docs, which is a stronger provenance than v0.45.0 had.
gist: >
  BOSS's two-memory model has one half with a mechanism and one half with a pointer. Working state
  gets a real shipped file (`.claude/rules/your-app-code.md`, verified to work). Durable facts get
  a sentence in CLAUDE.md telling the founder they go to "Claude's auto-memory" — and nothing else:
  no seed, no registered cue, no setting. And where they land by default is machine-local
  (`~/.claude/projects/<slug>/memory/` on this machine), so the half BOSS calls "persists; compounds"
  is the half that does not survive a new laptop, a cofounder, or a fresh clone.
created: 2026-09-08
resolved: 2026-09-08 — the DEC is answered NO; the honest documentation fix shipped (v0.245.0).
source: >
  Ajesh, 2026-09-08 — the project-memory half of the memory/resume sweep.
---

# Durable memory ships as a pointer, not a mechanism

## The asymmetry

`library/memory-seed/README.md` states the cut cleanly and then only builds one side of it:

| | Durable facts | Working state |
|---|---|---|
| What BOSS ships the founder | one sentence in `CLAUDE.md` | `.claude/rules/your-app-code.md` (L0) and `feature-context.md` (L1) |
| Registered mechanism | none | the host's `paths:` loader, verified working |
| Where it lives | `~/.claude/projects/<slug>/memory/` — machine-local | in the repo, committed |

`memory-cue.js` is the mechanism that *would* close this, and it ships dormant on a principle
BOSS states well (an unregistered hook costs nothing). Fine — but dormant plus undocumented is how
five hooks went undiscoverable and needed `boss hooks` built to rescue them.

## The part that is actually uncomfortable

**Durable facts are the one thing BOSS calls durable, and they are the one thing kept on a single
laptop, outside git.** Everything else BOSS is proud of — canvas, decisions, evidence, RESUME,
devlog, `brain/read.md` — commits, deliberately, per DEC-001, and the shipped `.gitignore` says so
in a comment: *"pushing backs up your thinking AND keeps your cofounder in the loop."*

That comment is the argument. It just was not applied to auto-memory, because auto-memory is the
host's directory and BOSS never looked at where it points.

This is the same shape as the 2026-08-21 incident: valuable state, single copy, machine-local,
invisible to `git status`. It is not the same severity — nothing here is destroyed by a stray
command — but it is the same class, and BOSS has already paid once to learn it.

## The move, and why it is a decision rather than a task

The host exposes **`autoMemoryDirectory`** (per-project, `~/` prefix supported) alongside
`autoMemoryEnabled`. BOSS already ships a `.claude/settings.json`. Pointing the directory at
something like `.boss/memory/` would put durable facts in the repo, versioned, portable, and
visible to a cofounder.

**It should not be done on that argument alone.** Auto-memory holds facts *about the founder* —
how they work, what they keep getting wrong, what they have settled. DEC-001 drew a line for
exactly this class of thing and put `brain/relationship.md` on the LOCAL side, reasoning that the
conscience's relationship with *you* is yours alone and never travels to a teammate. Auto-memory is
closer to `relationship.md` than to `read.md`.

So the real question is not "should we set the setting". It is:

> **Which side of the DEC-001 line do durable facts sit on — and does the answer change when the
> founder is a solo builder versus a two-person team?**

That is a DEC, and it is worth writing before any setting changes. If the answer is "committed",
the founder needs a visible say in it, because BOSS would be moving a file full of observations
about them into a place their cofounder can read.

## ✅ Resolved 2026-09-08 — and shipping [[DEC-015]] INVERTED this record's own framing

This record called machine-local durable memory "the part that is actually uncomfortable" and
proposed a DEC on pointing `autoMemoryDirectory` into the repo. **Building DEC-015 answered it, and
the answer is the opposite of what this draft leaned toward.**

DEC-015 deliberately *moved* per-person conscience state OUT of the repo and INTO `~/.boss/`, on the
reasoning that machine-local is the correct home for person-scoped data and that a gitignore rule is
a weaker guarantee than not being in the tree at all. **Auto-memory is person-scoped data of exactly
that kind** — how the founder works, what they keep correcting, what they have settled. So it is
already in the right place, and committing it would contradict a decision made the same day.

- **NOT DONE, deliberately: `autoMemoryDirectory` is not set.** No repo-local durable memory.
- **SHIPPED instead — the honest sentence.** The template `CLAUDE.md` said durable facts go to
  "Claude's auto-memory, active across sessions" and stopped. It now says **where** that lives (this
  machine, not the repo), what follows (it does not reach a cofounder or a new laptop, so anything
  the *project* depends on belongs in `docs/`), and points at `memory-cue` as the mechanism —
  which `boss help hooks` can now actually find, as of v0.241.0.
- **Re-open trigger:** a founder loses durable memory moving machines AND says so. That is a real
  cost this resolution accepts; it is not a cost anyone has reported.
- ✅ **The kill this record already carried stands and is worth repeating:** `.claude/rules/` with
  `paths:` is REAL, re-verified against the 2.1.132 binary. The suspicion that it was Cursor-confusion
  was wrong.

## Open questions as originally filed

1. Is a seed even wanted? `durable-facts-example.md` exists in `library/` and has never been
   shipped into a project. Shipping an example file into every scaffold is surface, and
   [[EVID-001]]'s fear is surface.
2. Does the CLAUDE.md line need a caveat? Auto-memory is subject to a rollout flag and a managed
   setting, so a founder in an enterprise org may not have it while BOSS's copy says they do.
   One clause, not a paragraph.
3. **n=0 demand.** Nothing here is a founder request. Hold unless [[IDEA-081]] makes portability
   load-bearing — which it may, because a second machine is exactly what Remote Control introduces.

## Related

- [[IDEA-079]] — the same question for prompts.
- [[IDEA-081]] — Remote Control; machine-local state is what a second surface exposes.
- DEC-001 — the local/shared line this record has to be argued against.
