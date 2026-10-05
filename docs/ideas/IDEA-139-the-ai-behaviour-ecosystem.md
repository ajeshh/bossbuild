---
id: IDEA-139
type: idea
kind: capability
owner: mentor-architect
program: ecosystem-of-ecosystems
status: shipped
proof: test/earned.test.js
proof_note: step 3 items 0–5 landed 2026-10-05 (Unreleased). The test reproduces T1 and failed on the old code. Done is the return path declared — evals ← red-team and evals ← ai-failure-states as takes in registry/flows.json, held by check-refs class 7 — plus the reproduced stack-miss fix in src/earned.js with its test. Both takes were mutation-tested. Open: T5 and Q2 are Ajesh's.
gist: AI behaviour — what the founder's product does when it asks a model (what it costs, how it fails, whether it's right, whether it can be turned) — gets its own ecosystem, centred on the first place the founder's code calls a model. The four skills already exist and agree on a shared vocabulary; what is missing is the way back. Every finding is told to "become an eval case" and nothing that writes eval cases reads a finding.
created: 2026-10-05
anatomy: 3
---

# The AI behaviour ecosystem — no output trusted further than what tested it

## Current shape
_The best articulation so far. Rewrite this as the idea sharpens._

- **Purpose:** AI behaviour covers what the founder's product does when it asks a model: what the
  call costs, how it fails, whether the answer is right, and whether someone can turn it. It keeps
  each output trusted no further than what has tested it. **What the project is worse at without
  it:** the founder learns how the model fails from their users, and pays the bill before they see
  it. A non-deterministic part can't be checked once. It is only as honest as the loop that brings
  what went wrong back to the tests.
- **Centre:** the call site, meaning the first place the founder's code calls a model. That is literally
  the predicate that plants it (`src/earned.js:20-22`: *"the moment that nudges toward /ai-cost is the
  moment that can install it"*). It is planted with its neighbours around that call: **design**
  (failure copy, the system prompt as product copy), **engineering** (the logger and the handlers wrap
  the call), **money** (cost per user → pricing), **trust** (the provider's training opt-out,
  subprocessors), **evidence** (`/health`'s task completion).
- **Boundary:** **In:** the model call, its cost, its five failure states and their declared
  responses, correctness cases, adversarial cases against the model path, and the system prompt's
  behaviour. **Out:** BOSS's own builder agents working in the founder's repo (the agents ecosystem,
  IDEA-124, and `/judge-traces`); app security with no model in it (`/red-team --paths`, which
  belongs to engineering); deceptive UI (the catalog, claims and trust). **On the seam:**
  the catalog's `ai-voice` and `agent-actions` rows, which `/red-team --humane` probes behaviourally.
- **The finding that shapes all of it:** like claims (IDEA-138), the parts exist. Unlike claims,
  they are **already connected forward** and share one vocabulary: the five failure-state names are the
  same in `/ai-failure-states`' table and `/evals`' `failure_mode` enum. **What's missing is the
  way back.** Three givers tell their findings to *"become an eval case"*, and the one skill that
  writes eval cases reads none of them. The hypothesis is confirmed (§ Step 1, *Do findings flow
  back?*).
- **Mandate:** compose and subtract, never add a skill. A new gate needs a bug that reached a user.

## Step 1 — inventory (read-only, 2026-10-05)

### What a founder gets

**The trigger.** Three skills are held back until the code calls a model: `stages/L1-mvp/manifest.json:74-78`
(`aiMediated: ai-cost, ai-failure-states, evals`) and `:82-85` (`earned.aiMediated: llm-in-source`).
The predicate is the cost-budget loop's own entry regex, evaluated by the hook runtime
(`src/earned.js:44`, `:79-88`). `/red-team` is **not** in the group. It is laid down at MVP unlock
(`manifest.json:29`), because `--paths` and most of `--humane` need no model (`red-team/SKILL.md:16-18`).
The two loops open at the same predicate: `cost-budget-loop.md:8-23`, `ai-failure-state-loop.md:8-23`.

| Skill | WRITES | READS from the others | Hand-offs that are only prose |
|---|---|---|---|
| `/ai-cost` | `docs/ai-cost-budget.md`, a logger in source, `.boss/cost-log.jsonl` (`SKILL.md:46-51`); `docs/cost-reviews/REVIEW-YYYY-MM-DD.md` (`:23-25`, `review.md`); a RESUME line (`:146-148`) | cohort (`:57`) | *"the eval set IS a cost lever"* (`:170-171`); recurring cost spikes → *"the handler should fire"* (`review.md:128-129`); mentor hand-offs (`:150-160`); *"the logger is the only path to the SDK. Lint it"* (`:180`): a rule nothing checks |
| `/ai-failure-states` | `docs/ai-failure-states.md`, with an **Eval-tested** field per state: a case id or `STUB` (`SKILL.md:92-94`; template `:31`); handler stubs in source (`:96-118`); a Failure states section in each FEAT (`:120-127`) | cohort; FEAT *Model or code* sections; `docs/ai-cost-budget.md` call sites (`:54-56`). **Declared take** in `registry/flows.json` | *"Upstream: /evals running"* (`:159-160`); *the system prompt is product copy*, written against `STYLE_GUIDE.md` (`:149-152`), which no check can see; nothing points at `ai-ux-patterns.md` §6 *trust repair* / §8 *degraded-state honesty* (`library/practices/ai-ux-patterns.md:61`, `:75`), the UX half of the same responses |
| `/evals` | `docs/evals/FEAT-NNN.yml` (`SKILL.md:44-49`) | **Step 0 reads only `docs/evals/**`, `evals/**`** (`:19`); `docs/ai-failure-states.md` (one `should-fail` per declared state, `:86-105`) | *"after a real-user bug report — add the failing case"* (`:40`); *"add the failure when something breaks live"* (`:58`); *"isn't done until /red-team has run"* (`:28-33`); online evals *"auto-curate the failing traces back"* (`:145-146`), with no path named |
| `/red-team` | `docs/red-team/RT-YYYY-MM-DD.md` (`SKILL.md:257`); `--self` **inline only, no file** (`:247`) | `.boss/config.json` shape; the FEATs' *Paths that must not break* (`:110-114`); the catalog | ***"Failures are findings — each becomes a /spec fix or an /evals case"*** (`:265-266`); ***"Failures become evals"*** (`:294`); LLM06 *"cross-check the /ai-cost per-call cap"* (`:53`); LLM07 overlaps hallucination (`:54-55`) |

**Code that reads these paths:**

- `docs/red-team/RT-*.md` is read by the conscience: `verification-loop.md:19-25` (the *Negative path*
  line) and `deception-loop.md:15`. That is red-team → conscience, never red-team → evals.
- `.boss/cost-log.jsonl` is read by `margin-trap-loop` (money) and `src/remove.js`.
  `docs/cost-reviews/` is read by `cost-review-loop.md:10-14` (the first review only, no cadence:
  `:54-62`) and `/drift-deep`.
- `docs/evals/**` is read by nothing outside `/evals` itself. The FEAT template only names the path
  (`spec/templates/feat-record.md:139-142`).

**The practices.** `model-routing.md` holds the three capability shapes (`:47`) and reaches founders through
`/ai-cost`, `/red-team` and the mentors. `analytics-for-ai-products.md` holds *traces → evals →
product metrics* (`:88-90`) and is named by `/evals` and `/health` (`health/SKILL.md:69-72`, `:156`).
`ai-ux-patterns.md` is named by `/pretotype`, `/health` and the design skills, **never by
`/ai-failure-states`**. `retrieval.md` is named by `mentor-architect`, `/red-team` (LLM09) and `/trust`.

**The conscience moments.** `cost`, `failure-mode`, `cost-stale` and `unverified` (`moment-frames.js:168-215`).
None of them is about correctness: no moment notices that an eval set is missing or that a finding sat unturned.

**`registry/flows.json`** has **one** AI-behaviour take: `ai-failure-states ← ai-cost`
(`docs/ai-cost-budget.md`). It has nothing for evals, red-team, or the failure-states doc's readers.

### How BOSS keeps its own AI behaviour honest

| What | Receipt | Kind |
|---|---|---|
| The suite: 161 detector cases across 14 moments; 50 judgment cases across 5 | `docs/architecture/conscience-evals/*.yml`, `judgment/*.judgment.yml`; run 2026-10-05: 161 passed · 0 failed | tests, tracked (DEC-013) |
| *"When the conscience fires wrongly, add a case… the set grows from real friction"* | `conscience-evals/README.md:99-113` | rule, written |
| Release gate runs the detector suite and checks every doc that quotes its count | `scripts/release.js:297-340` | check, at release only, **not in CI** (`package.json:55` `test:ci` has no eval) |
| Judgment transcripts carry a voice-hash; a changed frame makes them STALE, loudly, with exit 0 | `judgment/replay.js:11-19`; run 2026-10-05: **10 of 10 `drift` cases STALE** | drift reader, never gates |
| `/regrade` (keyless, in-session subagents) | `.claude/skills/regrade/` (gitignored, BOSS-only) | the re-grade |
| `/recalibrate`: fires on a **shape** change, never a model launch | `.claude/skills/recalibrate/SKILL.md:16-34` | event-fired pass |
| *Capability shapes, not model names*: no `model:` key in shipped frontmatter | `scripts/check-manifests.js:198-211` | check, enforced (frontmatter only, on purpose) |
| `/red-team --self`: three probes against the conscience | `red-team/SKILL.md:230-248` | **reports inline; no run is on record anywhere** |

### Do findings flow back? — confirmed: no, for a founder

1. **`/red-team` → `/evals`: prose in the giver, and the taker never looks.** `/red-team` says it twice
   (`:265-266`, `:294`). `/evals` Step 0 reads only `docs/evals/**` (`:19`), and no line of `/evals`
   names `docs/red-team/`. A `fail` in `RT-*.md` reaches the conscience (rung 4) and never reaches a case.
2. **A failure seen in real use has nowhere to land.** `/evals` says to add it (`:40`, `:58`) and names no
   intake. The pre-model seam, *"Keep the bad outputs. One folder"* (`registry/surface-ladder.json`
   `evals.seam`; `SKILL.md:24`), **names no folder**, so even a founder who kept them leaves nothing
   for Step 0 to find. `boss status` never shows that seam either: `nextSeam` skips every ladder entry
   with `appliesWhen` (`src/ladder.js:225-227`), and both `/evals` and `/ai-cost` have one.
3. **`/evals` points at the wrong traces.** *"If the project runs BOSS's auto-log trace substrate,
   `.boss/trace.jsonl` is exactly this raw material"* (`:118`). `auto-log.js:5-7` records **which files a
   builder subagent touched**, not what the product's model said, and it is dormant by default
   (`registry/dogfood.json`). Error analysis on the product needs the product's outputs.
4. **Eval-tested ↔ the case: named, never matched.** `/ai-failure-states` writes a case id or `STUB`. The loop
   closes on the doc plus one handler name (`ai-failure-state-loop.md:18-23`), so `STUB` closes it for good.
   Nothing reads the id against `docs/evals/`. (Not proposed as a gate: no bug has reached a user.)
5. **A recurring cost spike → a handler, not a case** (`review.md:128-129`), although `cost-spike` is one
   of `/evals`' five canonical modes (`evals/SKILL.md:96`).
6. **`/judge-traces` routes to `/extract`** (`judge-traces/SKILL.md:62`), not to `/evals`, and it reads the builder trace anyway.

**For BOSS: the discipline holds by hand, in whichever suite fits.** The case files grew when moments were
*authored* (`git log -- docs/architecture/conscience-evals/*.yml`: every commit adds a moment). The one
real misfire with receipts (IDEA-121: the cost and failure-mode moments fired on 43 of 57 prompts because
the detector matched itself) came back as a **unit test**, `test/conscience-one-thing.test.js:6`, `:76`,
not as an eval case. That return is real, and it happened because one person runs both ends. `--self`
findings **cannot** return, because they are never written down.

### Found while reading (3b): tasks, written here before acting

- **T1 · 🔴 Reproduced: the stack-miss escape hatch points at a skill that isn't there.** `cost-budget-loop.md:55-57`
  tells a founder on an unmatched stack (LangChain, Bedrock…) to *"edit this loop's entry pattern, or
  simply run `/ai-cost` manually"*. `src/earned.js:44` reads **BOSS's** copy of the loop
  (`STAGES_DIR/…`), never the project's. Reproduced 2026-10-05 in a `/tmp` scaffold with `BOSS_HOME`
  set to a temp dir: MVP unlocked, `src/agent.ts` with `new ChatAnthropic(…)` from `@langchain/anthropic`,
  then the project's loop edited to match `@langchain/…`. **The conscience fired `cost` and said to run
  `/ai-cost`, `/ai-cost` was not on disk, and `boss sync` reported up to date.** That is a correctness fix,
  not a gate.
- **T2** · `/evals:118` names the builder trace as product raw material (finding 3). Text fix.
- **T3** · BOSS-only: `judgment/replay.js:296` still says *"run regrade.js when an API key is
  available"*, against the keyless discipline (`/regrade`). One line.
- **T4** · BOSS-only, gitignored: `/recalibrate:59` says *"a practice change = a VERSION bump"*, which is
  stale since DEC-019 (`## Unreleased`; Ajesh stamps). One line.
- **T5** · BOSS-only: the 10 `drift` judgment transcripts are STALE. Re-grade with `/regrade` when the
  drift frame settles (IDEA-135 touched it on 2026-10-04). That is Ajesh's call on the token spend.
- **T6** · BOSS-only: `README.md:244`, `docs/PATTERNS.md:33` and `registry/dogfood.json:51`, `:135` say
  **154** gate cases, and the 2026-10-05 run passed **161** (IDEA-135 added cases). `npm run release`
  catches this by design (`release.js:310-340`), so it's the release-time gate doing its job, not a
  miss. Fix the numbers at the next release, not here: the release regenerates generated docs.
- **T7** · found by the planting test: `boss unlock mvp` on an app that **already** calls a model
  prints *"3 held back when the app first calls a model"*, which is untrue for that project. `boss status`
  corrects it one step later (*"Earned … `boss sync` lays them down"*). `holdAtAdopt` already evaluates
  the predicates at adopt; unlock doesn't. Fix: unlock reads the predicates too. That's in `src/cli.js`,
  which carried another session's uncommitted hunks on 2026-10-05, so it's written here, not done.

## Step 2 — the eight parts

| # | Part | BOSS's own (B) | What ships to a founder (A) |
|---|---|---|---|
| 1 | **Principles → guidelines → rules** | *look at your data* (README:29) · failure modes over success count · *capability shapes, not model names* (enforced for frontmatter) · *keyless, never an API key* · *a transcript recorded against another frame is stale* · *a claim about your own rigour is derived* (`release.js:310-340`) | *20 beats 0* · eval-set first · *correctness ≠ safety* · binary pass/fail with the attack shown · *declare before the bill* · *the system prompt is product copy* · *write the string, not a description of it*. **No rule says where a finding goes.** *"Failures become evals"* is a sentence with no path |
| 2 | **A seed that scales** | the case shape (README:34-58) and a zero-dep runner | **the five canonical failure names**, shared by two skills, plus the per-call ledger line and the three shapes. The seam that would keep a real failure names no folder |
| 3 | **A map of what exists** | the case files and `moments.js`; the frequency ledger (`boss conscience activity`) | `docs/ai-cost-budget.md`, one row per call site, which is the only map of where the model is called; `docs/ai-failure-states.md` per state with Eval-tested; the FEAT's Evals and Failure states sections. **Nothing maps findings not yet turned into cases** |
| 4 | **A planting moment** | **empty**: it grew (v0.16.0) | `llm-in-source` earns three skills and opens two loops at the same predicate. **Broken for an unmatched stack** (T1). `/red-team` arrives earlier, on purpose |
| 5 | **Checks at the write** | **empty**: at release only, not in CI; the judgment half never gates | **empty**: the loops read at prompt time. *"The logger is the only path to the SDK. Lint it"* is checked by nothing |
| 6 | **A drift reader** | replay's STALE (voice-hash) · the eval-count claims · `/recalibrate`'s frequency read | **`/ai-cost review`**: ledger against budget, including *quiet drift* (`review.md:57-79`). `cost-review-loop` notices only the first review. **Correctness drift: empty**; *"re-run after a model swap"* is prose (`evals:41`) |
| 7 | **Retirement** | `supersedes.json` (`/cost-review` → `/ai-cost review`); `/recalibrate` retired the *"a new model shipped"* trigger | a failure state can be overridden with a re-open condition (template `:70-76`). **Empty** for a case whose call site was removed, or a call site that left |
| 8 | **Amendment** | `/recalibrate` edits a shape's sentence in `model-routing.md`; Ajesh decides | the override grammar in the devlog (`ai-failure-states:192-193`, `ai-cost:184-185`); *"the five are the floor, not the ceiling"* (`:194-195`) |

### Where AI behaviour disagrees with the draft guide (for IDEA-137 · C7)

1. **Its broken flows are *inside* one ecosystem.** `docs/ECOSYSTEMS.md` § Connections declares flows
   *between* ecosystems. Here, red-team → evals, the Eval-tested ↔ case match, and review → case
   are all AI behaviour talking to itself, one discipline split across four skill files. The guide has no
   word for an internal flow. `flows.json` doesn't care (a take is skill to skill), so the
   **declarations already work inside an ecosystem**, and the guide should say so.
2. **Its weight sits at the return, which is not one of the eight parts.** Design is heavy at the write,
   and claims grew a drift reader first (IDEA-138). AI behaviour fails *in use*, non-deterministically, and
   its whole discipline is the loop back: what went wrong becomes a test. In the guide, *returns* live
   only in Connections. Either part 6 has a sibling, *an intake* (where what went wrong lands), or IDEA-138's
   rule extends: **weight sits where the failure is seen**, which for AI behaviour is after it happened.
3. **Its planting moment is read from code, and the founder can't amend the trigger.** Principle 4
   (*every rule can be changed by the people who live with it*) is silent on part 4. T1 is that gap
   reaching a real path. The fix has to keep principle 4's other half: **mute stays free and never
   feeds a reading.** A founder who narrows or deletes the loop to quiet the moment must still get
   the skills. So the trigger is BOSS's pattern **or** the founder's, never the founder's alone.
4. **One skill, three ecosystems.** `/red-team`'s LLM/ASI battery is AI behaviour, `--paths` is engineering,
   and `--humane` is claims and trust. The guide assumes a part belongs to one ecosystem. A skill
   that serves several is fine, but its *gives* need per-mode declarations.

## Trigger and yield

- **Trigger:** the first model call in the founder's source (`llm-in-source`), or the founder saying it is one (T1).
- **Yield on first use:** a budget with a logger that fills, and the five failure states with a string for
  each. **A store** after that: the eval set gives nothing until a case fails, and then it is the
  only place the failure is kept.

## Connections

| | What | With | Path | Declared in `flows.json`? |
|---|---|---|---|---|
| **takes** | the budget's call sites and per-call cap | (internal) ai-cost → ai-failure-states | `docs/ai-cost-budget.md` | **yes** |
| **takes** | the declared states, one `should-fail` each | (internal) ai-failure-states → evals | `docs/ai-failure-states.md` | no: prose (`evals:86-105`) |
| **takes** | the voice and terminology | design → the system prompt and failure copy | `STYLE_GUIDE.md` | no: prose, and no check can see a runtime string |
| **takes** | the paths that must not break | product (spec) → red-team | `docs/ideas/FEAT-*.md` | no |
| **takes** | shape tags | canvas → red-team `--humane` | `.boss/config.json` | no (config) |
| **gives** | cost per user | money (`margin-trap-loop`, `mentor-capital`) | `.boss/cost-log.jsonl` | no: code reads it |
| **gives** | a negative-path result | conscience (`verification-loop`, `deception-loop`) | `docs/red-team/RT-*.md` | no: code reads it |
| **gives** | task completion, cost per successful outcome | evidence (`/health`) | — | prose |
| **returns** | a red-team `fail` → a `should-fail` case | (internal) red-team → evals | `docs/red-team/RT-*.md` → `docs/evals/` | **absent: the missing flow** |
| **returns** | a failure seen in real use → a case | the founder → evals | (no folder named) | **absent** |
| **returns** | a recurring cost spike → a `cost-spike` case | (internal) ai-cost review → evals | `docs/cost-reviews/` | absent: points at the handler only |
| **returns** | a case id → the state it tests | (internal) evals → ai-failure-states | Eval-tested field | written by hand, never matched |
| **store** | the eval set itself, and STUB states under a recorded override | — | — | — |
| **steward** | **`docs/ai-failure-states.md`**, for respond ↔ prove: the one file that names both the declared response and the case that tests it (as the brand doc is for evidence ↔ claims) | | | |
| **not planted** | no model call in source → none of it arrives; `/red-team` still runs `--paths`/`--humane` | | | |

**Stands alone?** Checked per take:
- `/evals` without `/ai-failure-states`: yes. The coverage clause applies only to FEATs that declare
  responses there (`:88-90`).
- `/ai-failure-states` without a budget: yes, it reads the budget *"if it exists"* (`:55-56`). The
  cost-spike cap then has to be declared in the doc itself, and nothing says so. That is a small gap.
- `/red-team` without `/evals` or a model: yes. Two of five modes need no model, and the cohort note
  forbids implying a subset.
- **The proposed return takes** (red-team → evals, failure-states → evals) must read *"if any"*: with no
  RT file and no doc, `/evals` writes cases from what the founder saw, as it does today.
- **The ecosystem without its trigger (T1): no.** The conscience speaks, and the skill it names never
  arrives. That is the only take that doesn't stand alone, and it is a bug, not a design.

**How its rules change, and who changes them:** the founder, through the override grammar already in place
(a devlog line with a re-open condition). Three overrides of the same state mean the five are wrong for
this product, and the doc grows a sixth. **How it leaves:** at real traffic, offline cases hand over to
online evals on sampled production traffic (`evals:141-156`). The hand-written intake becomes
auto-curated, and the folder's reader follows. Nothing replaces `/ai-failure-states`; it stays the steward.

## Step 3 — what a founder gets (proposed 2026-10-05, smallest first; Ajesh: *"go for it"*)

**Landed 2026-10-05:**
- **0** (`083b3ed`) — and the same bug one loop over: `design-tokens-loop` had the identical hatch
  and `uiInSource` read only BOSS's copy. Reproduced by a test first, then fixed the same way.
- **1–4** — the `/evals` Step 0 intake, `docs/evals/seen/`, the trace pointer corrected, and
  `/ai-cost review`'s spike line. Two takes were added to `flows.json`. Each was mutation-tested:
  moving the path in `/evals` turns class 7 red, with the file and line.
- **5** — T3 (replay's hint now names `/regrade`) and T4 (`/recalibrate`, gitignored, local only).
- Two Unreleased bullets. Rule 6: a `/tmp` scaffold earned the AI skills from a widened loop on a
  LangChain call, and the new text arrived on `boss sync --apply`.
- Fixed in passing: the first commit's comment in `src/earned.js` cited `docs/ECOSYSTEMS.md`, which
  doesn't ship. `test:ci` doesn't run check-refs, so `npm run check` caught it after the commit.


0. **Fix T1, reproduced.** `llmInSource` reads BOSS's loop **and** the project's
   `.boss/loops/cost-budget-loop.md` when present, earning if **either** matches (union: the founder can
   widen the trigger, and a narrowed or deleted loop never withholds the skills). The loop's text changes
   from *"or simply run `/ai-cost` manually"* to *"then `boss sync` lays the AI skills down"*. A test in
   `test/earned.test.js` takes the reproduction as its fixture and fails on today's code first (rule 8).
   No CHANGELOG bullet unless Ajesh wants one: a founder would feel it only on an unmatched stack.
1. **The return path, text plus two takes.** `/evals` Step 0 opens with *"read what already failed,
   if any"*: `fail` lines in `docs/red-team/RT-*.md` not yet a case, `STUB` rows in
   `docs/ai-failure-states.md`, and the folder from item 2. Write those first. When it writes a case, it
   fills Eval-tested back on the state. Two takes in `flows.json`, both read by `evals/SKILL.md`:
   `docs/red-team/RT-*.md` from `red-team`, and `docs/ai-failure-states.md` from `ai-failure-states`.
   Both are mutation-tested. `/red-team:265-266` points at that Step 0 instead of restating it.
2. **Name the seam's folder: `docs/evals/seen/`.** One phrase in the seam (surface-ladder and `SKILL.md:24`,
   kept identical) and one in `/evals` Step 0: files there are raw failures, the first cases to write, never
   an eval set that "already exists". It sits inside the glob Step 0 already reads, so the ladder needs no new path.
3. **Fix T2:** `/evals:118` says the raw material is the product's own outputs, the ones you saw and the
   ones users reported, landing in `docs/evals/seen/`. `.boss/cost-log.jsonl` says *which* calls to look at
   (the outliers by FEAT, by tokens), never what they said, because it is privacy-first by design.
   `/judge-traces` is named for its real job, BOSS's agents in this repo.
4. **One line in `/ai-cost review`:** a recurring cost spike becomes a `cost-spike` case as well as a handler
   (`review.md:128-129`).
5. **BOSS's own, no bullets:** T3 (replay's hint → `/regrade`), T4 (`/recalibrate` → `## Unreleased`).
   T5 and a `--self` record (Q2) are Ajesh's.

**Not now:** a check that Eval-tested ids exist in `docs/evals/` (no bug has reached a user) · a correctness
conscience moment (the founder is already nudged three times at the first call) · the eval suite in BOSS's
CI · online-eval machinery (n<10) · adding `/red-team` to the `aiMediated` group (it must stand alone
without a model) · pointing `/ai-failure-states` at `ai-ux-patterns.md` §6/§8 (true, but an addition
with no bug behind it; offer at the next practice refresh).

## The test (docs/ECOSYSTEMS.md step 8, run 2026-10-05)

A throwaway in `/tmp` with `BOSS_HOME` set to a temp dir, using the CLI from this tree:

- **Wrong mode** (Quickstart, the app calls a model): none of the four skills, no loop, no moment,
  nothing in `boss status`. **Silent** ✓
- **Neighbours missing** (MVP; no budget, style guide, red-team report or evidence): the skills arrive
  on `boss sync`, and only the two AI moments speak (`cost`, `failure-mode`). Nothing names a missing
  neighbour ✓. Found T7.
- **A neighbour's path moved** (`docs/redteam/`): silent in the founder's project. That is by design
  until the founder-side reader exists (IDEA-137 · C8). In BOSS's own repo, class 7 names it with the file and
  line (the two mutation tests) ✓
- **The return, run by following the skill** (subagents acting as the founder's session, three runs):
  - *empty* (no failures anywhere): no error; the cases were written from the FEAT and labelled that way ✓
  - *full* (a red-team fail, a STUB, a dangling id, a STUB under an override, a kept failure): every
    source became a case, and every id went back on its state ✓
  - The runs found four gaps in the new text: nothing seen at all · a STUB under an override · a dangling
    Eval-tested id · no `source:` on a case. Each was fixed, and a re-run on a fresh copy handled the
    override as written. The same pass aligned the two spellings of the failure modes
    (`hallucinates` → the five canonical names).
- **Fits the eight parts?** Yes. Nothing was invented to fill a row; parts 4 and 5 are honestly empty for B.

## Open questions

- **Q1** · Steward: the failure-states doc (names the response *and* its case) or the eval set (holds the
  cases)? Lean: the doc. It is the contract, and the eval set is part 3's map.
- **Q2** · Should `/red-team --self` write a record? Today BOSS's own adversarial findings can't come back
  because they're never written down. For BOSS a record lands in its own tree, so the first question is
  *"fine public forever?"* (CLAUDE.md).
- **Q3** · `/red-team` spans three ecosystems (C7 · 4). Are its *gives* declared per mode, or is it AI
  behaviour's with two lent out?
- **Q4** · *(answered 2026-10-05: `/evals` Step 0 now says to strip anyone else's personal data before a kept failure becomes a case, the rule `/ai-cost` holds for the ledger)* Does `docs/evals/seen/` hold model outputs that contain user data? For `domain-expert` the
  privacy rule from `/ai-cost` (*no PII, no prompt body unless redacted*, `:89`, `:182-183`) has to reach
  this folder too. Probably one clause in item 2.
- **Q5** · *(found by the test; it predates this record)* `/evals` says *"write 20+ cases before the
  LLM call ships"* and also *"error analysis first, on real traces, not invented cases"*. All three runs
  hit it, and two stopped at 6–8 real or spec cases. Which rule wins at MVP? Lean: real failures
  first, with the FEAT's criteria as the floor. *20* stays a target, not a gate.

## Capture log

- **2026-10-05** — planted from IDEA-137 · B4 (order: claims → **AI behaviour** → data & trust). Steps 1–2
  were written read-only from the repo, and T1 was reproduced in a throwaway scaffold. The hypothesis
  (findings don't flow back) is confirmed for a founder. For BOSS it holds only because one person runs both ends.
  Step 3 is proposed to Ajesh, not built.
- **2026-10-05** — Ajesh: *"go for it"* → step 3 built (`083b3ed`, `6060c85`). Then Ajesh asked, *"is this
  idea complete"*: no, the guide's test hadn't run. Ran it (§ The test). It passed after four gaps in the new
  `/evals` text were fixed; it also found T7 and Q5.
