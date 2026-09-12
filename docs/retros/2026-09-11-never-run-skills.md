---
id: RETRO-2026-09-11-never-run-skills
type: retro
owner: product-lead
status: captured
---

# Retro: which of the 48 shipped skills has ever run on BOSS itself — 2026-09-11

> The `/retro` question from the comp-read batch (RESUME item 4), asked the way founder-mode's
> `bureaucracy-detector` ends: *"just stop doing it and see what breaks."* Both alive rivals in the
> source read subtracted their way to health. BOSS is at 48 skills / 19 loops with a standing
> *compose and subtract* mandate and, until this file, no denominator.

## Method — and why it is a floor

**No invocation record exists.** The trace hook records subagents + changed files, is opt-in, and
is off in this repo; `docs/devlog.md` has four entries. So the denominator is **the artifact each
skill leaves**, checked on disk in this repo (`ls`), with `git log -S` available for *when*. That is a
records read, not telemetry (IDEA-021 holds). Two consequences: a skill that leaves nothing
(`/welcome`) is *unknowable*, not *unrun*; and n=1 project — BOSS eating its own dogfood — so
every "never" below is a floor for BOSS's own use and says nothing about founders.

## The count

| Bin | n | Skills |
|---|---|---|
| **Ran — artifact on disk** | 22 | `/idea` `/boss` (107 IDEA docs) · `/canvas` (`docs/ideas/CANVAS.md`) · `/decide` (17 DEC) · `/evidence` (4 EVID) · `/import` (`docs/source/`) · `/spec` (6 FEAT) · `/comp-eval` (6 records) · `/consult` (today, IDEA-099) · `/close` + `/log` (RESUME, devlog — thin) · `/smoke` (`.boss/smoke.json`) · `/evals` (the 153-case gate) · `/extract` + `/boss-learn` (practices with *sorted UP* provenance) · `/boss-sync` (self-hosted pin) · `/design-review` + `/design-tokens-init` (`docs/design/`, the v0.276–292 program) · `/ux-check` (site pass, devlog) · `/revalidate` (5 records carry it) · `/pretotype` (18 IDEA docs name one) · `board` (`boss board`, daily) |
| **Never ran — rung not reached** (legitimate) | 11 | `/ai-cost` `/ai-failure-states` `/ai-first-init` `/cost-review` (BOSS calls no paid model at runtime) · `/health` `/measure` `/onboard` `/money` (n=0 users) · `/incident` (Scale) · `/design-library` (V1) · `/judge-traces` (trace off by design here) |
| **Never ran — superseded on BOSS itself** | 5 | `/feedback` (BOSS *is* upstream) · `/practice` (0 PRAC — `library/practices/` is the same object at BOSS's altitude) · `/ship` (`npm run release`) · `/landing` (`scripts/gen-site.js` *is* the landing) · `/research` (18 sessions are `/deep-research`, not transcripts — no founder transcript exists to digest) |
| **Never ran — and should have** | 6 | 🔴 `/drift-deep` (0 audits — *"am I fooling myself across everything I've built?"* on a repo whose RESUME calls its own build stream *"building around the risk"*) · 🔴 `/read-repo` (`.boss/brain/` **does not exist** — the conscience has no standing read of BOSS, so every brain-reading line in the frame is byte-identical-off here; `/close` has never written one either) · `/interview` (0 — EVID-001/003 were relayed, never prepped or debriefed through it) · `/persona` (0 — the dev workspace's 8 persona *agents* were built instead; the shipped skill was never exercised on BOSS's own founder) · `/red-team --self` (a devlog mention, no report on disk) · `/roadmap` (0) |
| **Unknowable** (no artifact) | 4 | `/welcome` · `/prototype` · `/sunset` (0 dropped — either nothing was ever ended, or it was ended by hand) · `/trust` |

Totals: 22 ran · 11 rung-not-reached · 5 superseded-on-self · **6 should-have** · 4 unknowable = 48 (17 Quickstart + 28 MVP + 2 V1 + 1 Scale).

## What it says

1. **Nothing in the "should have" bin is a sunset candidate.** Every one of the six is a skill BOSS
   would tell a founder to run in exactly BOSS's situation. The gap is dogfood, not surface.
   The two red ones are the same finding twice: **BOSS has never taken its own advice about
   itself** — no brain, no drift audit.
2. **The superseded-on-self bin is the honest sunset conversation, and it is small.** Five skills
   that BOSS replaces with its own tooling at its own altitude. None should be sunset *for
   founders* on that evidence — a founder has no `gen-site.js` — but `/practice` vs
   `library/practices/` is worth a look: same object, two shapes.
3. **The "just stop doing it" test cannot be run here.** With n=1 project and 22 of 48 exercised,
   removing a skill would "break" nothing observable — which is not evidence it is unneeded, it is
   evidence BOSS is the wrong subject. The test needs a founder.
4. **`/welcome` and the unknowables argue for one thing**: a skill that leaves no artifact is
   invisible to every honest denominator BOSS has. Not a reason to add telemetry. A reason to
   notice which skills those are, and whether they should leave a line somewhere.

## What to do — two actions, both dogfood, neither a build

- **Run `/read-repo` on BOSS** so `.boss/brain/read.md` exists and `/close` has something to update.
  Every conscience frame in this repo has been running without continuity since v0.22.
- **Run `/drift-deep` on BOSS**, once, and file the audit. RESUME already says what it will find;
  having it in `docs/drift-audits/` from the tool rather than from a human's memory is the point.

Sunset nothing on this evidence.

## Agent notes

None convened; this was a file-system read. The measurement took one pass because the artifacts
are typed records with predictable homes (`docs/IDS.md`) — the thing IDS.md exists for.
