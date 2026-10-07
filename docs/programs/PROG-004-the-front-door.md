---
id: PROG-004
type: program
owner: product-lead
status: active
created: 2026-10-05
graduated_from: front-door
gist: How a founder finds, types and is oriented by BOSS — the `boss` shell CLI and BOSS inside Claude Code (the slash menu, the status line, completion, help, errors). Where you are without asking; the next command without guessing.
---

# PROG-004 — The front door

**Graduated 2026-10-05** from the slug `front-door` (IDEA-083…087), when Ajesh asked for the CLI work
to be a program: *"lets start with the easiest and quickest ones that deliver the most. and then save
the rest. i think we should make the cli related work as a program."* The reasoning that belongs to no
single member is the rule set below and the backlog — usability ideas read off the tools people
praise, each checked against what `boss` already does (2026-10-05 session).

**Members:** every record with `program: PROG-004` — `boss board PROG-004`. IDEA-084 (the MVP wall:
16 verbs at unlock, the rest earned) · IDEA-085 (the description budget) · IDEA-086 (three doors to
one job) · IDEA-083 (a filled example project, deferred) · IDEA-152 (the first usability slice).
IDEA-087 (public prose cites private records) came over with the slug and fits poorly — it is about
which records are tracked, not the door. Left as is; move it if a pass wants it gone.

## Rules every change carries

- **Meet them where they already are.** Prefer the surfaces a founder already has open — Claude
  Code's slash menu and status line, their shell's completion, a prompt like Starship — over a new
  BOSS surface. One computed line can feed several of them (`boss status --line`).
- **Subtract or compose; never a new skill** for a usability gap (the 2026-09 founder-evidence
  mandate). A hint, a default, a better error — not a verb.
- **Position, never a score.** No streak, no completion percentage, no burndown (`board.js` already
  refuses one). "What's remaining" is a place on a map, not a bar to fill.
- **A missing argument names the obvious one.** If BOSS knows the answer (the next rung, the card in
  flight), say it with the command to type — or ask. Never fail with only the syntax.
- **The skill description stays the trigger; the hint is for the human.** `argument-hint` carries what
  to type (shown greyed in the `/` menu); `description` keeps its `Usage -` tail, which the CLI splits
  on (`src/modes.js`), under the 420-byte cap (`check:manifests`).
- **Zero dependencies still.** Completion scripts, pickers and status lines are written with Node
  built-ins, or not at all.

## Backlog — saved for later passes (pick, cut or keep)

- [ ] **B1 · Plant the status line** — *thought through as IDEA-159 (2026-10-07); waits on Ajesh.* Opt-in through `boss hooks enable statusline` (the optional-hooks
  door that exists), writing `statusLine` into the project's `.claude/settings.json` with
  `boss status --line`. Never overwrite a founder's own `statusLine`.
- [ ] **B2 · Shell completion.** `boss completion zsh|bash|fish` prints a script; it completes the
  founder's own record ids (`boss board IDEA-1⇥`), mode words for `unlock`, moment names for
  `conscience mute`, help topics — the places people guess today.
- [ ] **B3 · Hide internal skills from the `/` menu.** Anything a founder never calls by name
  `user-invocable: false` (documented in the host's skills reference, checked 2026-10-05: hidden from
  the `/` menu, Claude can still run it). Check what `/boss` and the CLI's skill lists read first.
- [ ] **B4 · Verb-first descriptions**, so the `/` menu scans: every description opens with its verb.
- [ ] **B5 · An explain layer for findings** — the `rustc --explain` shape: a one-line finding carries a
  key, `boss help <key>` says why it matters. Read `boss help glossary` first; it may be most of it.
- [ ] **B6 · Mode tips in the host's spinner** — custom spinner tips are NOT in the host's settings docs
  (checked 2026-10-05), so this waits until they are; then
  only the current rung's, and only if it stays quiet (Principle: says one thing, stays quiet).
- [ ] **B7 · A clig.dev pass over `boss`** — an audit against the Command Line Interface Guidelines,
  findings as lines here, not a build.
- [ ] **B8 · Every other required-argument command** gets B-rule 4 (`unlock` was first, IDEA-152).
- [ ] **B9 · A clash audit of BOSS's generic verbs** — *Ajesh 2026-10-06: "save a new todo for later so
  we dont forget."* New and renamed verbs now get BOSS-specific names (`/scout`, `/inbox` — PROG-005)
  so they don't collide with the host or another tool; the host already shipped its own
  `deep-research`, colliding with BOSS's. Check the generic ones (`/log`, `/close`, `/ship`,
  `/health`, `/money`, `/trust`, `/spec`, `/idea`…) against the host and common plugins; rename only
  what clashes, each with a supersedes row. The rule: the name is BOSS's own, the first five words of
  the description are plain English.

## Learned from (the shapes, not endorsements)

`git status` (the next command in the output) · the GitHub CLI (ask for a missing argument) · the Rust
and Elm compilers (errors that teach; `--explain`) · tldr and Stripe's docs (examples first, with your
own values — BOSS has both) · Starship, lazygit, k9s (where you are, always on screen) · fish, fzf,
Raycast, the VS Code palette (never need the exact name — `/boss` is this inside Claude) · Vercel's CLI
(no arguments does the obvious thing) · and as a warning, streak mechanics (what the humane lens
refuses).

## Log

- **2026-10-05** — graduated from `front-door`; IDEA-152 is the first slice (argument hints, `unlock`
  with no mode, `status --line`, bare `boss` in a project). Shipped the same day, Unreleased.
- **2026-10-05 (close)** — paused before B1. Questions for it: opt-in or default; the host passes JSON on stdin
  (`workspace.current_dir`) — read that instead of the cwd; never overwrite a founder's own `statusLine`; what the
  line says when nothing is in flight; does it carry the conscience (paused, one ranked nudge) or stay position-only.
- **2026-10-07** — B1 thought through as IDEA-159: five recommendations for Ajesh to react to. The
  host check changed the plan — a project `statusLine` overrides the user's, so planting by default would
  hide a founder's own line; compose instead. VS Code display unconfirmed.
