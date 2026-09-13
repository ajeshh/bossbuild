---
id: IDEA-087
type: idea
owner: product-lead
status: shipped (v-unreleased, 2026-09-13 — the first fix, per record class: ideas, extractions, verdicts, RESUME, devlog, CLAUDE.md tracked; evidence, brain, inbox, source, dossier, business and CANVAS.md stay local)
proof: none
proof_note: |
  Two honest fixes exist and they point opposite ways — publish the record classes that public
  prose cites, or stop citing private records in public prose. The proof of either would be a
  change to `.gitignore` plus a check; neither should be written before Ajesh decides which,
  because one of them publishes content that was private and that is not a reversible call.
program: front-door
created: 2026-09-08
source: |
  Found 2026-09-08 while trying to commit four captured ideas — `git commit` reported nothing to
  commit, because `docs/ideas/` is gitignored in BOSS's own repo. The same session's `boss recap`
  had already reported "82 record(s) not in git history" without either of us reading it as a
  finding.
---

# IDEA-087 — BOSS's own repo ignores the one convention BOSS ships as load-bearing

## The two statements, side by side

**What BOSS tells a founder** — shipped `AGENTS.md`, in every scaffolded project:

> *Your `docs/` (ideas, canvas, `DEC-NNN` decisions, RESUME) commits with the repo — so **pushing
> backs up your thinking**, and a cofounder who clones is **in the loop**. Only secrets and the
> conscience's private relationship-with-you stay local.*

The shipped `.gitignore` says the same thing in its own comment, deliberately.

**What BOSS's own `.gitignore` does** — lines 33–51:

```
docs/business/  docs/RESUME.md  docs/devlog.md  docs/RESUME-ARCHIVE.md
docs/evidence/  docs/ideas/  docs/decisions/  docs/extractions/
docs/research/  docs/source/  docs/dossier/  docs/design/  docs/loops/
```

BOSS is self-hosted — *"its own first project"*, per its own `CLAUDE.md` — and it does not keep the
convention it ships. **0 of 16 `DEC` records, 0 of 4 `EVID` records and 0 of 90 `IDEA` records are
in the repository.**

## Why this is more than an inconsistency

**`registry/CHANGELOG.md` makes 124 references to `[[DEC-NNN]]` / `[[IDEA-NNN]]` / `[[EVID-NNN]]`
records, and not one of them is in the repo.** That file is not internal: `boss changelog` reads it
in a founder's project, and `gen-site.js` publishes it to `oyeboss.build/whats-new.html`. So BOSS's
most public prose cites its own private records by name, constantly, as if the reader could follow
them. A `DEC` record's whole stated purpose is *"the rationale future-you and a cofounder can read
instead of guessing"* — and every citation of one is, to a stranger, a dead reference.

Three further consequences, all already observed and none previously connected to this cause:

1. **`boss recap` is structurally blind on BOSS's own tree** — it reported *"82 record(s) not in git
   history"* the first time it ran. Correct, and it means BOSS cannot dogfood its own weekly read.
2. **`docs/RESUME.md` produces duplicate writes across concurrent sessions**, which `RESUME.md`
   itself documents (*"gitignored, so concurrent writes here produce DUPLICATES, not conflicts —
   nothing is watching"*). That is the ignore rule causing the problem, named without being named.
3. **The 2026-08-21 incident** — an assistant deleted `.boss/`, `git status` stayed clean, and git
   could restore nothing. Same root: the records that matter are outside version control.

## The two honest fixes, and they point opposite ways

- **Publish what the public prose cites.** `docs/decisions/` is the strongest candidate: a `DEC` is
  a rationale record *designed* to be read by someone who wasn't in the room, and 16 of them are
  cited publicly today. `docs/ideas/` likely follows.
- **Or stop citing private records in public prose**, and make a check enforce it — a `[[DEC-NNN]]`
  in a tracked file must resolve to a tracked file.

**What is not defensible is the current state**, which claims the first and does the second. Note
that some ignored paths are correctly ignored — `docs/dossier/`, `docs/business/`, the founder's own
notes. This is not an argument for un-ignoring everything; it is an argument that the line is
currently drawn by accident rather than by decision.

## Why it is captured, not fixed

Un-ignoring a directory **publishes content that was private**, which is a one-way door and
explicitly Ajesh's call — Principle 5 says BOSS asks rather than assumes where a choice is
asymmetric, and names the asymmetry in both directions. Publishing 16 decisions cannot be undone by
a later commit; leaving them private quietly keeps every public citation dead. Both are real losses.

## Related

- The standing audit heuristic this belongs to: *a claim stated in one place and not kept in
  another*. This is the inverted flavour — not a checker that fails to enforce its own rule, but a
  **convention BOSS ships to strangers and does not keep itself**, on the repo that calls itself
  BOSS's first project.
- [[IDEA-085]] — same session, same method: measure the thing everyone assumed was fine.

## Resolution (2026-09-13)

Ajesh asked whether making the repo private should open the gitignore. Answer: the toggle is not
the variable — a private repo is one click from public and its history goes with it — so the
per-directory test is *"fine public forever?"*, the same one `docs/decisions/` passed per-record
in DEC-013. Content grep on the six (home paths, emails, tokens, phones, named people) came back
clean except eight `/Users/ajesh` paths in old handoff prompts, rewritten to `~`. **Tracked:**
`docs/ideas/` (IDEA + FEAT + INDEX), `docs/extractions/`, `docs/research/verdicts/`,
`docs/RESUME.md`, `docs/devlog.md`, `/CLAUDE.md`. **Still local, for someone else's sake:**
`docs/evidence/` (consent), `.boss/` (the brain's read on the founder), `research/inbox|sessions`,
`source/`, `dossier/`, `business/`. **Held out per file:** `docs/ideas/CANVAS.md` — the founder's
own hours, bus factor and stopping date; his call, not the project's. `check:refs` keeps working
unchanged: a tracked record earns the link form, an untracked one keeps the bare id.

