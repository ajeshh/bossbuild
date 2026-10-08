---
id: RESUME
type: resume
owner: product-lead
status: active
updated: 2026-10-07
---

# RESUME — BOSS

**Read this first each session.** Where the work stands is read from the records, not from here
(IDEA-162): `boss board --next` says, for each piece in flight, how close it is in words and what's
next. This file keeps only what no record holds — the order Ajesh wants, the questions owed with no
record to live on, and what's held. **Window: 200 lines** (IDEA-102). History is `docs/devlog.md`;
versions are `registry/CHANGELOG.md`; standing rules are `CLAUDE.md`; facts a command computes are
not written here. **Move, don't trim** — and move to a record before here.

## Ground truth — run these, never read them from here

Peer sessions write this tree; every number in this file is a floor. Before anything:

```
cat VERSION && git log -3 --format='%h %ad %s' --date=format:%H:%M && git status --short
boss board --next        # what's in flight, how close, what's next — read from the records
npm run check            # zero findings = clean; check:published says how far npm is behind
git rev-list --count origin/main..HEAD   # commits not pushed
gh run list -L1          # CI — it sat red on Windows for ten days with nobody reading it
```

## Priority — Ajesh's order (the reading says what's close; this says what matters)

**Above all, unchanged: publish (npm is behind — `npm run check:published`) and Phase 3 outreach. Both
are Ajesh's.** The external evidence is n=4 signals / n=3 founders, all `stated-pain`; nobody has been
observed using BOSS. The mandate holds: compose and **subtract**, never add a skill.

1. **PROG-002 — the ladders still to plant**, for Ajesh to review: data & trust next (B4 holds the order).
2. **FEAT-039 — the Kettlewick showcase is weak overall; do it better.** Ajesh's words and where the story
   is are in its *Found after shipping*.

Everything else in flight — IDEA-135, IDEA-154 (T2 waits on Ajesh's scope call), PROG-003, PROG-005, the
programs' backlogs — is in `boss board --next`, with its next step.

## Found, no record yet

- **In a worktree, `npm run check` stopped at a stale-ledger row for the gitignored `regrade` skill**, hiding
  every check after it (found landing IDEA-148/149/154, 2026-10-07). **Not reproduced** in a fresh worktree
  the same day (`check-boundary` clean, every check ran) — nothing shipped (rule 8); re-open if seen again.
- **`test/demo-live.test.js` failed once under the pre-commit's full run** (*invalid object* for
  `docs/evidence/EVID-002.md` in its temp repo) and passed 3/3 alone — a race, not reproduced. (2026-10-07.)

## Waiting on Ajesh — each is a yes/no; the work is done

**A question that belongs to one record lives on it** as `waiting_on:` (`docs/IDS.md`), and
`boss board --blocked` lists those. What's below has no record to live on. (RVW-109; two of these
were already settled in their records, IDEA-087 and IDEA-098, and stayed here for 11 and 13 days.)

- 🔷 **What the site shares (for the 2026-10-14 read)** — marked share · hint · keep in `docs/business/SHARE-SORT-2026-10-04.md` (gitignored). Decide before the next `gen:site`: it renders the Done practice in full by default.
- 🔷 **Ajesh's browser read of the demo** — `npm run gen:site` → `site/demo/index.html`: does it read
  as *BOSS running*; the Kettlewick name (palette settled 09-23: oat/copper, devlog). Their playbook hand-checks: Present → VC cut
  (now also a filter), Export PDF in the sandbox, a removed slide after a re-render, the copy sheet,
  a Keynote paste, `/import` on a real deck. The design lane's sweep of the token descriptions
  still saying "blue" is theirs.
- 🔷 **`boss board --open`?** The playbook and design have `--open`, the board only `--html`; one line. Offered 09-23, unanswered.
- 🔷 **The maintainer message — what holds it?** Drafted 08-23, still unsent. No gating rule (09-23); a date by which it's sent is the open ask.
  `/drift-deep` (2026-09-14, `docs/drift-audits/DRIFT-2026-09-14.md`) read the tree as drifting and named sending it as the smallest re-aim.
- 🔷 **The design space, by hand:** `boss design --open` on a real project; paste a component's *SVG*
  frame and the icon sprite into a design tool (they should land as editable layers); paste a block
  into Keynote/Slides; reject any assumption in FEAT-030/031/032/033 in a word. The lane has nothing
  left to build until one of those says something.
- ⛔ **`npm run stamp` → `npm publish`** (`npm run check:published` says how far; DEC-019 — the stamp makes the version), then `npm run bump:formula`. He publishes himself — never run it for him.
- 🔷 **Submit the plugin to `claude-community`** (DEC-017; `claude plugin validate . --strict`
  passes; platform.claude.com/plugins/submit). A plugin with a near-identical name exists there — lead with what BOSS is not.
- 🔷 **Phase 3 outreach** — three maintainers chosen, two messages drafted, in
  `docs/evidence/CANDIDATES-2026-08-23-maintainer-experiment.md`. The first message must not mention
  BOSS. Metric: activation, watched not asked. No features from this.
- 🔷 **EVID-003's *did you come back?*** — still unasked.
- 🔷 **DEC-018 — the ground moved from 43° to 210°** on the strength of a brief; `AI-suggested-ratified`.
  Confirm or reverse. (Here because `boss board --blocked` doesn't read DECs.)
- ⬜ **`venture` as the default noun** (19 template files + `docs/venture-brain.md`) — a rename with a
  migration cost, re-proposed four times as if cheap. Rename · leave · or stop proposing it.
- ⬜ **The seven `building_since:` dates** — the CHANGELOG fallback clusters four on one day and the
  board would stamp them `authored`. Supply real dates · accept knowingly · leave empty (`derived`).
- ⬜ **Cloudflare re-deploy** — live site is ~40+ releases behind; waits on an explicit yes.
  `cd site && zip -r ../site.zip . -x '.*' -x '__MACOSX/*'`. Never describe the live site from this
  file — open the URL.
- ⬜ *Optional:* scrub the old `registry/projects.json` from git history (force-push).

## Held — not decisions; each has its re-open condition

Held *records* (IDEA-047, 075, 076, 089, 130, 159 and the rest) carry their own triggers — `boss board`
folds them into Parked. What's here has no record.

- **IDEA-106's kicked-up table** is sorted (2026-09-13); what's left waits on a trigger (#23, #27, #15, #1, #10) — the table is in the record.
- **`docs/product/JOURNEY.md`** — not written (every row would be `assumed`); at the second flow. (From the 2026-09-14 drift retro.)
- **The two watchlist markers `check:freshness` flags** — deliberately unstamped (targeted passes, logged); stamp only after a full sweep.
- **`/practice-refresh` boundary not-yet** — a real project past ~10 PRACs with one found stale.
- **Parked from the comp-read batch** (unpark conditions in the competition record's table):
  assumptions-plural in `boss status` · `waiting_on:` · cohort re-fit · time-per-task-type · the
  concept-anchor grep.
- **Seams named, NOT-YET:** rework rate as a `/judge-traces` header line (team-level only) ·
  `blocked_by:` → a derived `ready` column · agent topologies (Scale, trigger-gated).
- **Incidental:** `readShape()` is exported from `src/config.js` and nothing calls it — the mirror of
  the field-nobody-reads pattern. Worth a look when the tree is quiet.
- **`effort:` frontmatter** honoured on pinned-effort models (2.1.267) — one line at the next `/recalibrate`.
- **Plugin eval, further cases** — both doors are covered (v0.320.0, v0.321.0). The next case worth
  writing is *after* the door: a founder who says "no, more to say" — does it keep talking and offer
  once more, never twice? Cheap; after the first real founder.
- **RubyGems agent attack** (rubyhack.ai, 2026-09-11) — inboxed as an event for the agent-security
  sweep (2026-11-09). Attribution is the authors' inference.
- **CI runner warnings (seen on run 36174154875, 2026-09-25, all six jobs green).** `actions/checkout@v4`
  and `actions/setup-node@v4` target Node 20, which GitHub deprecated; they're forced onto Node 24
  for now. Bump both to their current major when it next touches `.github/`. `ubuntu-latest` becomes
  Ubuntu 26 from **2026-10-19**: re-open only if the Linux jobs break after that date.

## Prompt for the next session

> **Keep this evergreen.** A pointer + procedure, never a status report.
>
> Continue BOSS (in `~/Projects/bossbuild`). **Read first, in order:** `docs/RESUME.md` (this file),
> `CLAUDE.md`, `PRINCIPLES.md`. Then run the *Ground truth* block above — `boss board --next` is where
> the work stands. Pick up in *Priority* order unless Ajesh says otherwise; within it, the reading's
> *Pick up* order (the cheapest finish first).
>
> **Per capability landed:** `npm run check` at zero → a bullet under `## Unreleased` in
> `registry/CHANGELOG.md` (VERSION does not move — DEC-019) → `/tmp`-test the CLI and prune those
> entries from `~/.boss/registry.json` → `npm run release` (the gate) → commit with the GH noreply
> env-var → push when asked → `/close`, which writes `next:` on each record it touched, updates
> *Priority* here, and appends the narrative to the devlog. **Stamping a version is Ajesh's:**
> `npm run stamp`, then `npm publish`. If this file is past its window, move — don't trim.
