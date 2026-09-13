---
id: RESUME
type: resume
owner: product-lead
status: active
updated: 2026-09-13
version: 0.325.0
---

# RESUME — BOSS

**Read this first each session.** State + next tasks + open decisions.
**Window: 200 lines.** What has shipped lives in `docs/devlog.md` (history, append-only, newest at
top); every version is in `registry/CHANGELOG.md` (canonical, tracked); standing rules and the two
incidents live in `CLAUDE.md`. Facts a command computes are not written here. `boss status` and
`npm run check` both say when this file is past its window — **move, don't trim** (IDEA-102).

## Ground truth — run these, never read them from here

Peer sessions write this tree; every number in this file is a floor. Before anything:

```
cat VERSION && git log -3 --format='%h %ad %s' --date=format:%H:%M && git status --short
npm run check            # zero findings = clean; check:published says how far npm is behind
```

## Now

- **IDEA-109 captured (2026-09-13) — the coach-in-residence positioning.** Ajesh: acquisition → acqui-hire →
  *"an incubator would wanna hire me… their coach, but also leverage this kind of tool for their cohorts."*
  Measured before opining: 0 stars, 196/196 commits his, riskiest assumption n=0 on a 2026-11-21 clock —
  nothing to *sell* but the person, which is the acqui-hire's point. Licence: **keep MIT and the words**
  (a copy edit claws nothing back; diligence reads `LICENSE`). Next step is one call, not a build.
- **v0.318.0 → v0.325.0 committed, none pushed (51 commits ahead of origin).** Each is a
  `registry/CHANGELOG.md` section and a devlog entry; the RESUME no longer restates them (window
  rule — moved, not trimmed, 2026-09-13). Headlines only: RESUME window (318) · `/skill-doctor` +
  `/extract` description fix (319) · plugin eval suite, Δ 1.0 (320, 321) · `/boss-learn` folded into
  `/extract` (322) · model attachment let go (323) · the board assessment applied, 16-skill MVP
  unlock, `boss status` 2.4s→0.17s (324) · `/boss:welcome` the everyday door by pointer (325).
- **Second tier landed under `## Unreleased` (2026-09-13)** — once-per-session conscience · `boss hooks
  enable|disable` (nothing lands until asked) · `modes:` label · manifest summaries one sentence ·
  checker hygiene + `parseEntries` in gen-site · MENTORS.md current. BOSS's own hooks re-synced.
- **Landed under `## Unreleased`, not stamped** — DEC-019 (release-on-publish: `npm run stamp` at publish;
  `VERSION is honest` replaces `is next`) and BOSS's own install synced 0.267→0.325 + a dogfood row
  that fails past 3 behind. The next version is Ajesh's to stamp.
- **Board pass, 2026-09-12/13 — Building and Taking shape both emptied, by finishing and by reading
  (`1b91586` → `5d87a12`, all under Unreleased).** `ready` renders in Taking shape. Five records had
  finished under other names and never said so (071, 084, 095, 096, 102) — flipped. Built: the return
  path (`revisit-due` + `unticked-shipped` in `boss records`/`boss status`, `/log` stamps `outcome:` at
  ship — first BOSS decision due **2026-09-20**); `/log`'s recipe as a script (measured: +4% body, the
  newest-first invariant is the gain; the other four don't convert); the shelf's product half (three
  shelves, provenance on the twelve, exactly-one check — found two more). Parked with triggers: 006
  (the port), 047 (fake door, keyless — when strangers exist), 082, 075, 076; 036 dropped; 066 owns
  outward research. Board: 4 captured · 0 taking shape · 0 building · 73 shipped · 29 parked.
- **FEAT-026 slice 1 landed under Unreleased (`55502e9`)** — `boss playbook`: the canvas as boxes in
  `.boss/playbook.html`, holes as holes, Humane ⇄ Lean with the DEC-004 floor, chips + ledger counted,
  Link · Copy · Slide, brand per-field with a monochrome default. 14 tests. **Seven assumptions in the
  FEAT are marked for Ajesh to reject in a word**; the Keynote/Slides paste is his hand-check. Slices
  2–4 (chapters, proof, the deck with a VC cut) are FEAT-027..029, not yet specced. The 27-row *Kicked
  up* table in IDEA-106 is the intake spec for what BOSS should ask a founder and doesn't.
- **IDEA-106 captured (2026-09-13), absorbing 065 + 104** — the playbook: the canvas as boxes + the why,
  personas, rivals, evidence and DECs as one on-brand single-file HTML; every block linkable, Copy where
  worth copying, Slide/Present. Design + prototype plan in the record; next is a **prototype** over a
  fictional venture — **published v0** (link + what to react to in the record); the paste-into-Keynote
  test is Ajesh's. Board: 6 captured · 1 building · 28 parked.
- **The external evidence is still n=3 signals / n=2 founders, all `stated-pain`.** Nobody has been
  observed using BOSS, nobody has committed anything. The mandate holds: compose and **subtract**,
  never add a skill. Detail: `docs/evidence/`, the memory note, and the devlog's moved block.

## Next (in order)

1. **FEAT-026 — Ajesh's turn.** Reject any of the seven assumptions in the FEAT in a word; hand-check
   `boss playbook --open` in a real project (Lean toggle, copy a box into Keynote/Slides, ledger vs
   files). Then **spec FEAT-027** (pitch chapters: Vision · Product · Customers · Problem · Market ·
   Competition · Business model), **028** (proof: Evidence · Health · Learnings · Decisions · Risks),
   **029** (the deck: VC cut / internal / everything, remove-and-restore, Export PDF). Prototype v6 is
   the mockup for all three (link in IDEA-106). Same recipe: `/spec`, lane by message, commit by name.
2. **The 27-row *Kicked up* table in IDEA-106** is the intake spec for what BOSS should ask a founder
   and doesn't — sort it (task / new scope / question) before 027, because 027's chapters render the
   fields it names: a person record + photos (#11), a `vision:` line (#12), prior capital (#18), the
   compliance stance (#21), the AI-defensibility question (#20), a screenshot at ship (#23), a dated
   `/import` (#13), the ask record (#17).
3. **`/vet` the persona sources** — `docs/research/inbox/persona-record-is-thin-against-the-craft.md`
   (three pages + the example card; verdict per field; record or render).
4. **IDEA-110 — the full showcase on oyeboss** (after 027–029): one worked example generated by the
   real renderers. Reposition is IDEA-109's.
5. **2026-09-20: the first `revisit-due` fires on BOSS's own tree.** Answer it with `outcome:`.
6. **`/vet` Cagan's 2026-09-11 retraction #2** (*"teams over-invest in validating problems"*). Inbox it first.
7. **Watchlist needs a row for the project/PM rung** (`planner`, `boss board`, `program:`).
8. **Docs-accuracy found task:** CLAUDE.md's repo map and `/vet` step 2 name `library/agents|skills|
   hooks|memory-seed/` — none exist. Fix the sentences.
9. **`npm run check` is red at 50 since `d20f15d` (IDEA-087):** `[[EVID-NNN]]` links in now-tracked
   ideas/verdicts point at evidence that stays gitignored; three tests fail on the same class. Not a
   regression — `check:refs` needs to know evidence is private by design (skip or soften the EVID
   class), not un-ignore it.
10. **Two dogfood gaps from the `/retro`:** `.boss/brain/` (run `/read-repo`), `/drift-deep` never run here.
    Plus two new: `.claude/rules/feature-context.md` now exists here (`/spec`/`/close` name it);
    `docs/product/JOURNEY.md` not written (every row would be `assumed`) — write it at the second flow.

**Above all of these, unchanged: publish (npm is behind — `npm run check:published` says by how
much) and Phase 3 outreach. Both are Ajesh's.**

## Waiting on Ajesh — each is a yes/no; the work is done

- ⛔ **`npm run stamp` → `npm publish`** (18 behind; DEC-019 — the stamp makes the version), then `npm run bump:formula`. He publishes himself — never run it for him.
- 🔷 **Submit the plugin to `claude-community`** (DEC-017; `claude plugin validate . --strict`
  passes; platform.claude.com/plugins/submit). `boss-ai-agent` exists there — lead with what BOSS is not.
- 🔴 **IDEA-087 — un-ignore `docs/`.** A one-way door. Two demonstrations now, not an argument:
  `.boss/conscience-log.jsonl` (08-21) and `RESUME-ARCHIVE.md` (09-09) were both destroyed because
  they were gitignored. Cheapest half first: `docs/research/verdicts/` (96 files, measured clean,
  resolves 27 dangling `RVW` refs in the tracked CHANGELOG). Decisions are already published (v0.264.0).
  Ideas stay private by his call; evidence permanently — real people spoke in confidence.
- 🔷 **Phase 3 outreach** — three maintainers chosen, two messages drafted, in
  `docs/evidence/CANDIDATES-2026-08-23-maintainer-experiment.md`. The first message must not mention
  BOSS. Metric: activation, watched not asked. No features from this.
- 🔷 **IDEA-098 gate leg 2:** did the `/consult` movement line beat the plain split? Both reads are in
  IDEA-099. And EVID-003's *did you come back?* — still unasked.
- ⬜ **`venture` as the default noun** (19 template files + `docs/venture-brain.md`) — a rename with a
  migration cost, re-proposed four times as if cheap. Rename · leave · or stop proposing it.
- ⬜ **The seven `building_since:` dates** — the CHANGELOG fallback clusters four on one day and the
  board would stamp them `authored`. Supply real dates · accept knowingly · leave empty (`derived`).
- ⬜ **Cloudflare re-deploy** — live site is ~40+ releases behind; waits on an explicit yes.
  `cd site && zip -r ../site.zip . -x '.*' -x '__MACOSX/*'`. Never describe the live site from this
  file — open the URL.
- ⬜ *Optional:* scrub the old `registry/projects.json` from git history (force-push).
- ⬜ **IDEA-047 re-aimed keyless (2026-09-13)** — the fake door: drop `pretotype/api/`, one labelled
  recording, CTA = plugin install, count the click. Parked on a trigger: strangers exist (plugin listed / outreach live) and installs stay flat.
  IDEA-036 dropped; IDEA-066 is the one owner of outward research (093 p7's trigger carried in).
- ⬜ **IDEA-109 — the `README.md` §License line *"never the CLI itself"*.** Stronger than "open source"
  and it closes a door the coach-in-residence shape may want open. Keep · soften · or write the DEC.
  (Not: drop "open source" from the site while `LICENSE` stays MIT.)
- 🔷 **DEC-018 — the ground moved from 43° to 210°** on the strength of a brief; `AI-suggested-ratified`.
  Confirm or reverse.

## Held — not decisions; each has its re-open condition

- **IDEA-076 position within a rung** — re-open on an OBSERVED session, not a third statement.
- **IDEA-075 the scaffold has no way down** — n=0; add *"anything BOSS gave you that you've stopped
  needing?"* to EVID-003's questions before building anything.
- **IDEA-089 outward docs flatten after MVP** — re-open on the first founder who ships and asks about
  their README.
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

## Prompt for the next session

> **Keep this evergreen.** A pointer + procedure, never a status report.
>
> Continue BOSS (in `~/Projects/bossbuild`). **Read first, in order:** `docs/RESUME.md` (this file),
> `CLAUDE.md`, `PRINCIPLES.md`. Then run the *Ground truth* block above — if `git log` disagrees with
> *Now*, this file is stale; re-establish ground truth, then re-read. Then pick up *Next* top down.
>
> **Per capability landed:** `npm run check` at zero → a bullet under `## Unreleased` in
> `registry/CHANGELOG.md` (VERSION does not move — DEC-019) → `/tmp`-test the CLI and prune those
> entries from `~/.boss/registry.json` → `npm run release` (the gate) → commit with the GH noreply
> env-var → push when asked → `/close`, which rewrites *Now* and *Next* here and appends the
> narrative to the devlog. **Stamping a version is Ajesh's:** `npm run stamp`, then `npm publish`.
> If this file is past its window, move — don't trim.
