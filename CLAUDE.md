# CLAUDE.md — BOSS

> BOSS is **self-hosted**: it's its own first project (mode: MVP). It eats the dogfood it serves.
> Behavior rules first; reference below. What BOSS *is* lives in [`PRINCIPLES.md`](PRINCIPLES.md).

## Working rules (read first)

1. **Read [`docs/RESUME.md`](docs/RESUME.md) at the start of every session.** It carries state + next tasks + open decisions. Update it at session end.
2. **Apply BOSS's own principles to BOSS** ([`PRINCIPLES.md`](PRINCIPLES.md)). Especially #1: when work pauses, sort patterns UP (BOSS practice) or DOWN (here, that's BOSS's own code/features).
3. **Capture before building.** New ideas → `docs/ideas/IDEA-NNN`. Features being built → promote to a spec. Track in `docs/ideas/INDEX.md`. **Every IDEA in this repo is a `kind: capability`** — BOSS's *venture* idea is the canvas, not an IDEA record (`docs/IDS.md` § Two kinds; IDEA-114).
3b. **Write a found task down before you act on it.** The things identified mid-session — "this also needs a rollback", "the adjacent rule is probably wrong too" — live only in the chat until something durable holds them, and a compaction takes them silently. Put them somewhere on disk as you find them (the active IDEA/FEAT record, `docs/RESUME.md`, or a devlog line), sorted three ways: a **task** stays on a list, genuinely **new scope** becomes its own id, and an **open question** gets written as a question rather than carried. The conscience's `task-hygiene` moment notices when the chat's list has outrun the files, but it fires on a **timestamp** and cannot see whether you already wrote them down — a reminder, never a referee. Recovering by re-reading what you built tells you what you *did*; it can never tell you what you *meant to do next*.
4. **Zero-dependency CLI.** `src/` stays dependency-free (Node built-ins only). Machine state is JSON (`.boss/`, `registry/`).
5. **Every capability = a commit + a bullet under `## Unreleased` in `registry/CHANGELOG.md`. VERSION does not move** (DEC-019). Ajesh stamps a version when he publishes: `npm run stamp`, then `npm publish`. The CHANGELOG is what `boss sync` reads to tell projects what's new — stamped entries only.
6. **Test the CLI before claiming done.** Scaffold a throwaway in `/tmp` with `BOSS_HOME` pointed at a temp dir (`BOSS_HOME=$(mktemp -d) boss new …`), exercise the command, then delete both. With `BOSS_HOME` set, nothing reaches the real `~/.boss/registry.json`, so there is no row to prune. Without it, prune the row by hand; the registry is per-machine and never in the repo.
7. **Small, reversible steps.** One concern per change. Don't break the working `boss` CLI.

## Operating conditions of this tree (standing — moved out of RESUME, IDEA-102)

- **Concurrent sessions are the norm, not an anomaly.** Six peer sessions were live on 2026-08-21;
  it cost five version collisions before DEC-019 moved the unit: capabilities land under
  `## Unreleased`, nobody bumps VERSION, and `npm run release` refuses a stale read. Before any
  commit: `git log -1`, `git status`. Claim a lane (message the peers the files you'll touch) for
  anything wider than one file. **The tree is one shared checkout — do not `git checkout` a branch
  in it; that switches HEAD under every peer.** `registry/CHANGELOG.md` is the only surface that can
  describe a tree with many writers.
- **`docs/RESUME.md`, `devlog.md`, `CLAUDE.md`, `ideas/`, `extractions/`, `research/verdicts/` are
  tracked since 2026-09-13 (IDEA-087 — two unrecoverable losses, duplicates from concurrent writes,
  124 dead CHANGELOG citations).** Still gitignored, for someone else's sake: `evidence/` (real
  people's words), `.boss/` (the brain), `research/inbox|sessions`, `source/`, `dossier/`,
  `business/`, and `ideas/CANVAS.md` (Ajesh's own — his call, per file). The test for tracking is
  *"fine public forever?"*, never *"is the repo private"* — history goes with the toggle. Read
  before you write there all the same; git now saves you, but only what you committed.
- 🔴 **Never open a file for writing before you have finished reading it.** `open(p,'w')` truncates on
  open, so `open(p,'w').write(x + open(p).read())` reads as *prepend* and **is** *truncate*. Read fully,
  close, then write — or compose to a new path and `mv`. A shape to recognise, not a lapse of care.
- **Two incidents, both gitignored single-copy files, both unrecoverable:** 2026-08-21 an assistant
  ran `boss remove --apply` in this checkout and destroyed `.boss/conscience-log.jsonl` (restored
  EMPTY — frequency data restarts that day; v0.221.0 added the guard). 2026-09-09 the truncate-on-open
  shape above destroyed `RESUME-ARCHIVE.md` (~600 lines of narrative for v0.223–0.254; the releases
  themselves are all in the CHANGELOG). **Do not "restore" either by re-deriving from the CHANGELOG** —
  that manufactures a record nobody wrote.
- **`npm publish` and `npm run bump:formula` are Ajesh's.** Never run them for him. `check:published`
  says how far npm is behind; that is his number, not a task.
- **Every commit runs the STAGED tree through `npm run test:ci`** (`scripts/hooks/pre-commit`, ~9s: a
  throwaway worktree at HEAD with the index copied over it, so peers' unstaged edits never count).
  On per clone with `npm run hooks`; `git commit --no-verify` skips once. It is the CI half only —
  `npm run check` still needs the gitignored records, so run it by hand as below.
- **Verify with `npm run check`, never a hand-rolled loop over `npm run check:*`** — several print
  errors and exit 0 without `--strict`. `npm run release` before every release; a red gate is not a
  suggestion (v0.228.0: `package.json` sat six versions behind `VERSION` over a gate that checks
  exactly that — two *generated* docs frozen at the same old version is the tell that a gate was
  skipped). **`node scripts/release.js` is not read-only** — it regenerates `docs/CHEATSHEET.md`,
  `docs/SKILLS.md` and `site/`; never run it to "just check" a tree someone else is releasing into.
- Commit with the GH noreply env-var: `NR=$(gh api user --jq '"\(.id)+\(.login)@users.noreply.github.com"')`.
  After CLI changes: `npm i -g ~/Projects/bossbuild`, then test in `/tmp` with `BOSS_HOME` set to a
  temp dir (rule 6). `npm run pack:preview` confirms only the package ships.
- **Confirm the altitude before analysing.** BOSS is self-hosted: *BOSS's own practice* and *what BOSS
  ships a founder* are the same file and look like the same question. Ask which one is meant.

## What BOSS is (one line)

**BOSS is the conscience that keeps you honest while you build fast.** It runs inside Claude Code,
sets a project up with only the structure it has earned, says one thing when you're drifting, and
stays quiet the rest of the time. (The home of that sentence is `PRINCIPLES.md` — quote it, don't
rewrite it.) It scaffolds at the right level of ceremony (Quickstart → MVP → V1 → Scale) and mentors
the founder from idea to a thing that stands on its own — a company, a co-op, or a commons. Which one
is the founder's call; BOSS doesn't assume the venture ([[DEC-011]]).

## Repo map

- `bin/boss`, `src/` — the zero-dep CLI (cli, scaffold, registry, paths; loop = learn/sync when built)
- `stages/L{0..3}-*/` — the modes. **Quickstart authored**; MVP being extracted from this repo's own practice.
- `library/` — what BOSS *knows*: `practices/`, `sources.json`, `deceptive-patterns.json`, `help/`. Agents,
  skills and hooks live only in `stages/` (the shelf mirror went in v0.246.0; `library/README.md` says why)
- `registry/` — `CHANGELOG.md` (per-version notes) + `supersedes.json`, `surface-freshness.json`. The
  project list is **not** here: it's per-machine at `~/.boss/registry.json` (pulled out of the repo — it carried a home path)
- `docs/` — BOSS's own dogfooded docs: `ideas/`, `IDS.md`, `RESUME.md`, the canvas
- `PRINCIPLES.md` — the six rules that define BOSS

## Reference

### Two classes of agents (see [`docs/MENTORS.md`](docs/MENTORS.md))
- **Builders** — make the product (pm, coder, tester, designer…).
- **Mentors** (`mentor-*`) — coach the founder (venture lead, business, architect, fundraising, talent, pitch).

### Conventions
- IDs: `IDEA-NNN` (ideas), `FEAT-NNN` (features in build). See `docs/IDS.md`.
- Frontmatter on every doc: `id`, `type`, `owner`, `status`.
- Git: small commits; commits use the GitHub noreply email (env-var, never global config) to avoid GH007.
