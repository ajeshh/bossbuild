---
id: IDEA-070
type: idea
owner: product-lead
status: exploring (F1 shipped v0.217.0 · F3+F5 shipped v0.219.0)
proof: none
proof_note: One half needs no proof — F1 is a verified privacy hole on the `boss adopt` path and is a bug fix, not a feature. The other half (commit-time public/private judgment) is n=0 and gated.
gist: BOSS learned the LOCAL / PUBLIC-REPO / INSTALLED cut the expensive way in its own repo, built two checkers so the tiers can't disagree again, and never sorted any of it UP. The founder gets a two-tier `.gitignore` — and on the brownfield path, doesn't get it at all.
created: 2026-08-22
source: Ajesh, 2026-08-22 — "when assisting on git commits, should do it smartly where there are dev
  related that may be checked in and then there might be public facing. like for example docs, good to
  commit but not public right? but ideally should boss be not checked in? also like designing the first
  gitignore smartly on best practices."
relates: DEC-001, DEC-011, IDEA-005, IDEA-038, EVID-001, PRINCIPLES.md, library/practices/git-workflow.md
---

# IDEA-070 — What commits, and what goes public

## Three questions wearing one coat

The seed reads as one question about `.gitignore`. It is three, and they have very different
answers today:

1. **What gets committed at all** (local vs. tracked). **BOSS has a good answer** — it just
   doesn't reach every founder. See F1.
2. **What gets committed but stays out of public view** (tracked vs. published). **BOSS has a
   hard-won answer for ITSELF and has never sorted it UP.** See F3. This is the genuinely new half.
3. **A first `.gitignore` "on best practices."** BOSS's is hand-curated and guesses the stack. See F4.

> ⚠️ **One premise in the seed runs against a decision BOSS already made.** *"Ideally should boss be
> not checked in?"* — no. `.boss/` commits **on purpose**, minus per-person state: the venture record
> (canvas, ideas, decisions, RESUME, the brain's `read.md`) travels with the repo so pushing backs up
> your thinking and keeps a cofounder in the loop. The counter-evidence is BOSS's own: `/.boss/` **is**
> fully gitignored in this repo, an assistant ran `boss remove --apply` here on 2026-08-21, `git status`
> stayed clean, and git could restore nothing — the conscience frequency ledger was genuinely lost.
> The line is not "BOSS out of git." It is **per-person state local, venture state tracked** ([[DEC-001]]),
> and that line is already drawn correctly in `stages/L0-quickstart/template/.gitignore`.

## Findings (verified 2026-08-22)

### F1 ✅ SHIPPED v0.217.0 — `boss adopt` never installed BOSS's `.gitignore` — and the file it silently declines is the one enforcing DEC-001

`applyStageSafe` copies **only files that don't collide**. An existing repo always has a `.gitignore`,
so BOSS's lands in `skipped` and **nothing merges**. Verified by running the function against a dir
holding a two-line `.gitignore`: result was `skipped: [.../.gitignore]`, `copied: []`, file unchanged.

Consequence — every adopted repo can commit:

| file | what it is |
|---|---|
| `.boss/brain/relationship.md` | 🔴 **per-person conscience state — [[DEC-001]] says it never travels to a cofounder** |
| `.boss/conscience-log.jsonl` | the frequency ledger |
| `.boss/trace.jsonl` | local trace |
| `.boss/backups/` | pre-overwrite copies from `boss sync` |
| `.boss/board.html` | a pure projection — a 200-line diff every time the board moves |

**The privacy guarantee is enforced by a file the brownfield path doesn't install.** Tenth instance of
[[checkers-state-intents-they-don't-enforce]], and the purest one yet: the `.gitignore` comment *states*
the DEC-001 intent in prose, directly above the pattern, and on the adopt path nothing carries it.

Two things sharpen it:

- **The merge primitive already exists and adopt already uses it — twice.** `appendMarkedBlock` folds
  BOSS's rules into a pre-existing `AGENTS.md`, and `appendClaudeBlock` does the same for `CLAUDE.md`.
  Three collision files worth merging; two got the mechanism. Same asymmetry as *"`boss sync --force`
  grew a backup and `boss remove` never did"* — one function over.
- **Adopt reports the failure as reassurance.** It prints `N of yours kept as-is` — deliberate wording,
  written to answer trust anxiety at the moment of maximum trust anxiety. For `.gitignore`, the file
  kept as-is is the one that was supposed to protect them.

### F2 Only L0 carries a `.gitignore` at all

`stages/L1-mvp|L2-v1|L3-scale/template/` have none, and `boss unlock` has no ignore-delta mechanism
(it has `claude-append.md` for CLAUDE.md and nothing equivalent here). Anything a later mode starts
writing has no way to declare itself local.

### F3 ✅ SHIPPED v0.219.0 — the founder's ignore file has **two** tiers. BOSS's own has **three** — and the third was learned the expensive way.

This repo's root `.gitignore` carries a long comment declaring **LOCAL / PUBLIC REPO / INSTALLED**, and
records that it *"USED TO BE WRONG, and the error was load-bearing"*: six tier-2 docs were described as
shipped, and **nine shipped mentor agents sent founders to `MENTORS.md`, which has never been in the
tarball.** The repair was mechanical — `check:refs` class 3b and `check:boundary` (+ `registry/boundary.json`)
now fail when the tiers disagree.

**None of it is in `library/`.** `library/practices/git-workflow.md` has nine sections — trunk-based,
worktrees, risk-tiered review, mobbing, the honesty anchor, ownership, altitude — and **not one about
what to commit or what a repo publishes.** Principle #1 says sort proven patterns UP; this one was
proven at the cost of nine mis-pointed agents and never sorted.

The founder-shaped version of the same cut:

| tier | example | mechanism |
|---|---|---|
| **local** | secrets, per-person conscience state, generated projections, caches | `.gitignore` |
| **tracked, not public** | `docs/` — canvas, EVIDs, decisions, roadmap, the venture record | repo visibility · what a public repo would expose |
| **public** | README, LICENSE, the landing page, the shipped package | deliberate publication |

Tier 2 is exactly what the seed named (*"docs, good to commit but not public"*) and it is the tier
BOSS currently has **no vocabulary for on the founder side**. Today the only lever is a single
private/public choice made once, in `/boss` step 5, before any of those docs exist.

### F5 ✅ SHIPPED v0.219.0 — the citation-hygiene pass fixed the UP and never swept the DOWN (found 2026-08-23, while placing F3)

`library/practices/git-workflow.md` deliberately says an agent writes *"several times faster"* and adds
that *"the specific multipliers floating around it are vendor- and practitioner-grade, and none of them
were measured on your team"* — because v0.159.0's `/vet` citation pass **cut** the unverified vendor
multipliers, and the doc's own `provenance` field records that it did.

**`stages/L1-mvp/template/claude-append.md:15` still ships `~4× faster` to every MVP project, as fact.**
Single instance (`grep -rn '4×' stages/ library/`). Same shape as everything else in this record: the
right fix, applied to one surface of two. Rides along with F3 — same file pair, same release.

**Observed, deliberately NOT fixed:** the same Veracode figure appears as `~45%` (`testing-with-agents.md`,
"Spring 2026"), `~44%` (`agent-security.md`, "2026-07-28", derived from a 56% pass rate) and `~44%`
(`red-team/SKILL.md`, "Veracode's 2026 report"). Two dates, two numbers, v0.212.0's exact shape.
Resolving it means reading the report — a `/vet` job, not an edit.

### F4 The starter list guesses the stack

`node_modules/`, `target/`, `dist/`, `build/` ship to every project — including a Python or Go one —
which sits against **stack-neutral (P4)**. Real best-practice ignore lists are per-stack
(`github/gitignore`), and the stack isn't known at `boss new`; it's known at `/spec` or
`/ai-first-init`. So "design the first `.gitignore` on best practices" resolves to **grow it JIT when
the stack is declared**, not ship a better guess.

## Shape, if earned

- ✅ **F1 — DONE (v0.217.0).** `appendGitignoreBlock` merges the rules a founder lacks into their own
  `.gitignore` as a `#`-marked block (couldn't reuse `appendMarkedBlock`: its HTML marker would land as
  two literal patterns). Two tests, both verified to fail without the fix — one on the merge, one
  end-to-end through `bin/boss`, since a correct function wired into nothing is how this went missing.
  🔴 **Follow-up NOT done: already-adopted repos are unremediated.** `adopt` refuses to run twice and
  `sync`'s contract is *files BOSS installed* — a founder's `.gitignore` isn't one. The v0.217.0
  changelog says so plainly and tells them to copy the block by hand. Growing `sync` to reach them is a
  real design question (it would be the first time sync edits a file the founder owns), not a patch.
- ✅ **F3 + F5 — DONE (v0.219.0).** "What commits, what stays local, what goes public" added to
  `library/practices/git-workflow.md` (6 rules), a one-line version in the L1 DOWN, and `~4×` corrected.
  **Both `provenance` fields now say the section is NOT from the 2026-06-20 research** — without that,
  a sort-UP silently inherits a citation it did not come from, which is the bug `/vet` step 3 exists for.
  No new skill, no new practice doc: [[EVID-001]]'s compose-and-subtract held.
- **Grow the ignore file JIT** when the stack becomes known, rather than guessing at scaffold time.
- **The commit-assistance half needs the open question answered first** (below) before anything is designed.

## Refusals (candidate)

- ⛔ **No `/commit` or `/gitignore` skill.** The surface is already ~47 skills and [[EVID-001]]'s standing
  mandate is *compose and subtract, never add the 23rd*.
- ⛔ **BOSS does not become a secret scanner.** `/red-team` and `agent-security` own that; a half-scanner
  that misses one key is worse than no scanner, because it gets trusted.
- ⛔ **Don't flip `.boss/` to ignored** — see the callout above. The 2026-08-21 incident is the evidence
  against, and it happened in this repo.

## Open question (blocks the tier-2 half)

**What does "public" mean for a founder — repo visibility, or a published surface?** For BOSS the two
are different tiers (the repo is public; the npm tarball is a subset). For a founder with one repo they
usually collapse: "not public" just means the repo is private, and tier 2 only becomes real if the repo
later goes public or something is published *from* it. Settle this before designing anything, or the
tier gets built on a distinction the founder's repo doesn't have.

## Gate

- ✅ **F1: shipped v0.217.0.** The remediation path for already-adopted repos is the open half.
- ✅ **F3 + F5: shipped v0.219.0.**
- 🔴 **Open: the Veracode figure disagrees with itself** across three shipped surfaces (~45% vs ~44%,
  two dates). Needs the report read, not an edit — `/vet`, not a patch.
- **F3: cheap and Principle-#1-mandated** — an UP sort of a pattern already paid for.
- **F2, F4, and commit-time assistance: still n=0 — capture, don't build.** Re-open trigger: a founder commits
  something they didn't mean to, or asks BOSS what should be in the repo.
