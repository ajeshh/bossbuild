---
id: IDEA-125
type: idea
kind: capability
owner: Ajesh
status: shipped
proof: none
proof_note: a decision first — which merges, if any — then each merge proves itself by a skill count and a /skill-doctor pass that still fires the merged skill on its old trigger phrases
gist: Merge MVP skills that overlap in job, not text. Landed — /measure into /health, /ai-first-init into /spec's model-or-code line, /cost-review into /ai-cost (28 → 25). Declined with reopen triggers — /onboard, /design-review + /ux-check, and four more.
created: 2026-09-23
relates: IDEA-121, IDEA-114
---

# IDEA-125 — Merge the overlapping MVP skills

## Current shape

From the 2026-09-23 review (IDEA-121, shipped-content lane). The overlaps are in **job**, not text —
pairs share 0–1 sentences — so no gate can see them, and merging changes what a founder types.

| Candidate | Evidence | Would become |
|---|---|---|
| `/health` + `/measure` + `/onboard` | `/health` already "routes to the fix"; references `/measure` ×4; `/onboard` references `/measure` ×4 and `/health` ×2 | `/health` with measure-setup and onboarding sections (4 → 2 with `/roadmap` kept) |
| `/ai-first-init` | a pure conductor over the other four AI skills | the earned group's lay-down message does the conducting (5 → 4) |
| `/ai-cost` + `/cost-review` | "closes the cadence /ai-cost only declared" | `/ai-cost [review]` (→ 3 with the one above) |
| `/design-review` + `/ux-check` | "same lens, different timing", 40KB of bodies | lowest priority — `designer` owns both |

**Explicitly not merged:** `/evidence` + `/interview` (prep vs record are different jobs), `/drift-deep`
("the audit, not the tripwire"), `/money` (already a router).

## Decided 2026-09-23 (Ajesh: *"record why we shouldn't merge some, so we don't revisit; merge what makes sense"*)

**Merged:** `/measure` → `/health`. **Retired:** `/ai-first-init` (its declaration → `/spec`).
**Deferred, still a yes:** `/ai-cost` + `/cost-review` — waits on the conscience rework.

- [x] `/measure` → `/health` — landed 2026-09-23. Seam first (bossbuild-ca's catch: the n<10 gate
  would otherwise stop a just-shipped founder before `created_at` lands), then setup, then verdict.
  Still writes `docs/measure/`. Ladder entry moved to `health`; supersedes entry written.
- [x] `/ai-first-init` retired — landed 2026-09-23. Its one unique question is `/spec`'s **Model or
  code** section (per FEAT, in the FEAT template); `/ai-failure-states` reads that and the budget, and
  an older `docs/ai-first.md` if present. MVP 28 → 26, still opens on 14.
- [x] `/ai-cost` + `/cost-review` — landed 2026-09-25, after IDEA-123 shipped. `/ai-cost` reads
  where the project is: no budget → declare it; a budget and calls in the ledger (or `/ai-cost
  review`) → open the bundled `review.md` and write `docs/cost-reviews/REVIEW-*.md`; a budget and an
  empty ledger → say the logger isn't wired. The loops keep their ids; the conscience frames and
  `margin-trap-loop` point at `/ai-cost review`. Supersedes entry (`since 0.328.0`). MVP 26 → 25.
  *Trigger check, weaker than /health's: a blind router over the shipped descriptions sent 10/10
  cost phrases ("read the cost log", "weekly cost review", "is our gross margin OK"…) to `/ai-cost`,
  runner-up `/money` — but the other descriptions were shortened in the prompt, so it may flatter.*
- **Re-asked 2026-09-25 and held:** `/design-review` + `/ux-check` was proposed again from an outside
  field read that hadn't seen this file. The decline and its trigger stand.
- [x] Trigger check: does "what should I track", "set up analytics", "activation metric" still
  reach `/health`? *Checked 2026-09-23 by proxy (a blind router over the shipped descriptions, ten
  phrases; not the plugin eval): 7/10 → `/health`. The other three went where they should —
  "activation metric" → `/onboard` (which derives it; `/health` runner-up), "is my app working" →
  `/smoke`, "is the AI output useful" → `/evals`. None fell through.*

**Declined — don't reopen without the trigger named.** Each was read end to end, not judged from
cross-references; the overlap is real in *vocabulary*, not in *job*.

| Pair | Why not | Reopen only if |
|---|---|---|
| `/onboard` into `/health` | `/health` *diagnoses* where the curve dies; `/onboard` is the *fix* it routes to at the D0→D1 cliff. Merging buries the one doing-verb under a reading-verb and makes `/health` the largest MVP skill. The real shared text was one gate (n<10 → go talk), now said once in `/health`. | a founder runs `/health`, gets routed, and doesn't find `/onboard` |
| `/design-review` + `/ux-check` | Split *on purpose* by IDEA-121: `/ux-check` is earned at the first screen (`uiBuilt`), `/design-review` stays ungated because before-code is where it's worth most. A merge either gates the before-code review behind code, or hands the after-code check to a project with no screen. | the earned mechanism can gate *halves* of a skill |
| `/evidence` + `/interview` | Before the call vs after it. `/interview` is 725 words and prints a page; `/evidence` grades what came back. | never — different moments, different outputs |
| `/pretotype` + `/prototype` | Demand test vs build. The names collide; the jobs don't. Fix is in the descriptions, not a merge. | — |
| `/drift-deep` + the conscience's drift moment | The audit vs the tripwire — one is deliberate and whole-project, the other one line, JIT. | — |
| `/money` into anything | Already a router over the money path. | — |

## Open questions

- Which of the four, if any? Each one is a verb a founder may already have in muscle memory — a merge
  needs a `supersedes.json` entry and a sync migration, not just a deletion.
- Does a merged skill still fire on the old trigger phrases? Check with `/skill-doctor` or the plugin
  eval before and after.

## Reassessment — read the bodies, not the cross-references (2026-09-23, second pass)

Read all eight skills end to end. Three changes to the table above:

- **`/measure` → `/health`: yes, highest confidence.** Both read the same retention curve
  (`/measure` Step 1: "`/measure` reads the curve; `/health` fixes it"; `/health` Step 1 pulls
  `/measure`'s curve). `/health` is already a merge of two skills and its opening paragraph is the
  argument for this one: keeping them apart "made a founder pick which question they had before they
  had the answer." Shape: `/health` with nothing instrumented plants `/measure`'s seam
  (`created_at` + a `track()` stub) and names the one activation metric; with data, the verdict.
  Touches no conscience loop.
- **`/onboard` stays.** It is the *doing* verb `/health` routes to (Step 3a), not a second read.
  Folding it in makes `/health` the largest skill in MVP and buries the fix under the diagnosis.
  What the three genuinely share is one gate — n<10 → go talk — written three times; say it once in
  `/health` and have `/onboard` point at it.
- **`/ai-first-init` is not a pure conductor.** Of its sections, schemas are already `/spec:408`,
  the lethal trifecta is `/red-team` + `boss craft agent-security`, and steps 3–5 call the other
  three. The one thing nothing else holds is the **declaration** — *what stays deterministic*, and the
  automation ladder under it. That becomes a question in `/spec` for a FEAT that touches the model,
  not a lay-down message: no such message exists (`src/earned.js` has none), so "the lay-down message
  conducts" would be building a new surface to delete an old one.
- **`/ai-cost` + `/cost-review`: yes, but after the conscience rethink.** Same declare/read shape as
  measure/health. It touches `cost-review-loop` and `margin-trap-loop`, which the conscience window
  is reworking — sequence it behind that.
- **`/design-review` + `/ux-check`: drop the row.** IDEA-121 split them on purpose (`uiBuilt` earns
  `/ux-check` at the first screen; `/design-review` stays ungated because before-code is where it's
  worth most). A merge would undo the better answer.

Net: MVP 28 → 25, not 24. Order: measure→health (now) · ai-first-init retired, declaration into
`/spec` · ai-cost+cost-review after the conscience lands. Each: a `supersedes.json` entry, the
demo, and a trigger-phrase check before and after.
