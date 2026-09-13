---
id: IDEA-088
type: idea
owner: product-lead
status: shipped
program: dogfood
proof: .claude/hooks/conscience.js
proof_verified: >
  ⚠️ THE FINDING AS IT STOOD, now RESOLVED — read in past tense; the conscience is installed and
  running here as of v0.267.0. [VERIFIED MECHANICALLY, 2026-09-09, at v0.266.0] Four independent reads agree. (1) `.claude/hooks/` in this repo contains `lib/` and NOTHING ELSE — neither `conscience.js` nor `reentry.js` is installed. (2) Neither `.claude/settings.json` nor `.claude/settings.local.json` registers any hook: `Object.keys(s.hooks)` is empty in both. (3) `.boss/manifest.json` declares `"hooks": []`. (4) `.boss/conscience-log.jsonl` exists and is **0 lines** — the frequency ledger has never recorded a fire. BOSS is self-hosted at MVP and ships the conscience as its central mechanism.
proof_note: >
  The manifest is HONEST — it says `hooks: []`, which is true. That is exactly why no check catches
  this and why it has sat here: nothing is inconsistent. The capability was simply never installed,
  and every surface that could have noticed agrees with every other surface that it isn't there.
  This is an absence, not a drift, and BOSS has no detector for absences it never claimed.
created: 2026-09-09
source: >
  Found 2026-09-09 while measuring the third always-on context surface for [[IDEA-085]] — the
  hooks' own output. The measurement needed a real fire to calibrate against, BOSS's own ledger was
  empty, and checking why turned up the cause. Noted once before in passing (IDEA-067: *"the
  conscience that had never fired on BOSS"*) but never given a record or a mechanism.
---

# IDEA-088 — BOSS does not run its own conscience

## What is actually true

The conscience is the mechanism BOSS is *for* — the JIT nudge that is supposed to be the difference
between a scaffolder and an incubator. In the repo that calls itself BOSS's first project, it has
never run, and the hook scripts are not even on disk.

Every other part of the dogfood is real: `docs/ideas/`, the board, the evidence ledger, `boss
status`, the loops, the release gate. This one part is not, and it is the part with the strongest
claim to being the product.

## Why it stayed invisible

`check-manifests` verifies that a declared hook has a file behind it. BOSS declares none, so there
is nothing to verify — the check passes truthfully. `check-dogfood` reads what BOSS *claims* to
practice. Nothing anywhere reads **what BOSS ships as central against what BOSS runs on itself.**

That is the reusable half of this record, and it generalizes past hooks:

> **A self-hosted tool's checks are written from its own install record, so anything it never
> installed is invisible to every one of them.** Drift is checkable; absence is not. The question a
> check cannot ask is *"what do we ship that we do not use?"*

## Why this is not just "turn it on"

The obvious fix — register the hook in `.claude/settings.json` — is a change to **Ajesh's live
working session**, in the repo he is working in right now. It would start injecting conscience
context into his prompts mid-session. That is his call to make, not a sweep to run, and the whole
point of the conscience is that it is invited rather than imposed.

It is also not obviously *correct*. Three honest reasons it might stay off, and they should be
answered before it goes on:

1. **BOSS's own drift moments may be miscalibrated for BOSS.** The canvas-loop fires at ≥3 dated
   captures with no sharp riskiest assumption. This repo has 93 records. A conscience tuned for a
   founder with four ideas may be permanently, uselessly loud here — and a nudge that fires every
   turn is the one that gets muted, which is worse than off.
2. **Ajesh is not the persona.** The conscience coaches a founder toward validation. Ajesh is
   building the tool that does the coaching. Some moments genuinely do not apply.
3. **Turning it on is a real evidence opportunity, which is the actual argument FOR.** BOSS has
   `stated-pain` from two founders and **zero observed sessions** ([[IDEA-076]], [[EVID-001]]).
   The one founder BOSS can observe continuously is Ajesh. Running the conscience here is the
   cheapest observed-behavior BOSS will ever get about its own central mechanism — and if it turns
   out to be too loud, *that is the finding*, and it is one no eval suite has produced in 266
   releases.

## The smallest honest version

1. **Install the two hook files and register them** — `boss sync` is the mechanism that should have
   done this and did not; whether that is a `sync` bug is worth checking separately.
2. **Run it for a week and read `.boss/conscience-log.jsonl`.** The ledger already records moments,
   judge decisions and injected char counts — the instrument exists and has never had data.
3. **Then decide.** Too loud is a calibration finding. Quiet and occasionally right is a
   commitment-grade signal about the product's core claim.

## What this record must NOT become

A rule that BOSS must dogfood everything it ships. It ships `/red-team`, `/onboard`, `/trust` and
`/money`, and BOSS has no users, no signup and no revenue — not using those is correct, not a gap.
The conscience is different because it is the mechanism BOSS's whole thesis rests on, and because
BOSS is exactly the kind of project it fires on.

## Related

- [[IDEA-085]] — the measurement that surfaced this. Its third surface (hook output) turned out to
  cost **0 bytes unless a moment fires**, which is only knowable if a moment can fire at all.
- [[IDEA-067]] — noted the symptom in passing without a record or a cause.
- [[IDEA-076]] — the observed-session gap this could partly close.

## Capture log

- **2026-09-09 — the `boss sync` hypothesis in this record is CLOSED, and it was wrong.** This record
  said *"whether that is a `sync` bug is worth checking separately."* It is not. `planSync` reads the
  **stage manifest**, not the project's stamp, so a project pinned at 0.6.0 correctly sees every
  hook, skill and agent added since — verified by running `boss sync` in this repo, which lists
  `hook/conscience` and `hook/reentry` as `+ new` and would install both. **The mechanism works.**
- **The real cause is simpler and worse: BOSS's own project has never run `boss sync --apply`.**
  The stamp reads `bossVersion: 0.6.0`, `createdAt: 2026-05-21`, `agents: 0`, `skills: 0`,
  `hooks: []` — **260 releases**. It is not that the conscience failed to install; it is that BOSS
  has never once consumed its own product in the repo that calls itself its first project.
- **🔴 And running it here is NOT safe today, which is a finding in its own right.** `boss sync`
  reports `~ changed` for `agent/mentor-founder` (71L dev → 103L shipped) and `agent/prompt-coach`
  (95L → 101L). Those are **dev-workspace agents that share a name with shipped ones** — two
  different worlds, one namespace. `--apply` would replace Ajesh's tooling with the product's
  version. Backed up, but silently. **This is [[confirm-the-altitude-first]] materialised as a file
  operation**: "our agent" is ambiguous between BOSS's own and what BOSS ships, and here the
  ambiguity had write access.
- **v0.267.0 fixes the general case** (`? unclaimed` + `boss sync --apply --keep-mine`), so the
  hazard is now visible and avoidable. **It does not decide whether to turn the conscience on here**
  — that is still the open question this record exists for, and the answer is now cheaper to act on:
  `boss sync --apply --keep-mine` installs the conscience without touching a single dev agent.

- **2026-09-09 — DONE. The conscience is installed and running in BOSS's own repo (v0.267.0 →
  v0.268.0).** `boss sync --apply --keep-mine` installed 85 files and left the 8 dev-workspace
  agents/skills untouched; the two stale hook libs and three stale loops were refreshed by hand
  (verified stale copies of BOSS's own source, 3 and 2 unique lines, not dev forks) and re-synced so
  the provenance ledger records them. Both hooks are registered. **`.boss/managed.json` now exists
  for the first time**, which turned out to matter for more than sync.
- **The experiment answered its own question in five minutes, and the answer was "not too loud —
  WRONG", which is better.** Three shipped bugs, none findable from inside `stages/`:
  1. **`design-tokens-loop` fired at HIGH confidence on a zero-dep CLI.** All 52 matches were in one
     HTML-generating module; the predicate counted OCCURRENCES while the moment claimed *"several
     files"*. Fixed with an additive `min_files` spread bar. **A shipped false-positive class** —
     any repo with one report generator or mailer was tripping it.
  2. **A loop cross-link that only resolved before installation** (`../../../../` escapes a real
     project). Every MVP project has carried a dead link. De-linked per the v0.263.0 rule.
  3. **`check-boundary` inverted** — 48 installed product files read as unruled workspace artifacts.
     Fixed by reading the managed ledger, which only existed because of step one.
- **And it was RIGHT about the thing it was designed to catch.** The re-entry hook opened with *"back
  after 19 days away"* — that is 54 commits with no `docs/devlog.md` entry. BOSS ships *"devlog every
  session"* as MVP rule 3 and does not follow it. **The first thing BOSS's conscience did was catch
  BOSS skipping BOSS's own rule.**
- **The record's central worry did not materialise.** It predicted the conscience might be
  *"permanently, uselessly loud"* here given 93 records. After the calibration fix it is **silent**
  on an ordinary prompt — which is the designed behaviour, now observed rather than assumed.
- **Standing value: this is the first OBSERVED-behavior data BOSS has about its own core mechanism**,
  against `stated-pain` from two founders and zero observed sessions ([[IDEA-076]], [[EVID-001]]).
  `.boss/conscience-log.jsonl` is no longer 0 lines. Leave it running.
