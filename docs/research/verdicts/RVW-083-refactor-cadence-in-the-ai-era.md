---
id: RVW-083
type: verdict
owner: pm
status: recorded
created: 2026-08-24
verdict: ADAPT
route: UP → `mentor-architect` framing + `library/practices/` (the contraction half); NOT a new skill
sources:
  - https://www.gitclear.com/the_ai_code_quality_maintainability_gap
  - https://martinfowler.com/bliki/OpportunisticRefactoring.html
  - https://kentbeck.com/summaries
  - https://dora.dev/research/2025/dora-report/
---

# RVW-083 — "with AI, refactoring must be a built-in cadence"

## The claim
- **Source:** Ajesh, 2026-08-24, plus a same-session research run against four primaries.
- **Core assertion:** AI-assisted building accrues structural debt faster than the informal
  tidy-as-you-type habit can absorb, therefore the correction must be **scheduled** — a recurring
  refactor / rewrite / slim-down / schema-review beat built into the process.
- **Inbox file:** `docs/research/inbox/refactor-cadence-in-the-ai-era.md`

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | **The prescription does; the diagnosis doesn't.** A recurring beat is a standing obligation that fires whether or not the project earned it — that is exactly **#2 (JIT, never premature ceremony)**. Meanwhile the *concern* is **#1's own territory** already: "pause and sort the pattern" fires on a **breakpoint**, never a clock. |
| 2 | Evidence grade | **Split, and the split is the verdict.** The *problem* is [EVIDENCE]: GitClear's 623M-change telemetry, moved-code 13%→3.8% (2023→2026). The *prescription* is contradicted by both named practitioners BOSS respects — Fowler (verified primary) and Beck (his own domain). GitClear is vendor telemetry, correlational, and narrows its own mechanism to workflow incentive, not model capability. |
| 3 | Duplicate or sharpen? | **Mostly duplicate, one real gap.** Duplicated by PRINCIPLE #1, `/extract` (DOWN = "refactor the duplication into a named module"), `extraction-loop`, `quality-ratchet`, `scalable-architecture`, `data-schema`, and `/comprehend`'s *"a refactor that buys nothing this month is a refactor that can wait."* `/code-health` + `/refactor-wave` are already named at Scale as symptom-gated-not-yet. **The gap: every one of those is additive or holds-the-line. BOSS has no verb that asks "what should stop existing?" about the founder's own code.** |
| 4 | Who serves / harms? | Serves `eng-builder`, `returning-founder`. **Harms `first-product`, `vibe-coder-newbie`, and — sharply — `vibe-virtuoso`**, whose failure mode is 50+ repos and zero traction: a refactor beat hands them a legitimate-sounding way to not ship. Telling a founder with no users to go tidy is the **pseudo-app trap wearing an engineering hat**. |
| 5 | Cost / ceremony | **Heavier, against a standing mandate.** 47 skills ship across the four stages. [[EVID-001]]'s founder named **app bloat** as their own fear and the mandate is *compose + subtract, never add a 23rd skill*. Canvas Risk #1 is "BOSS bloats into a framework." A cadence is a fifth recurring obligation. |

## Verdict: ADAPT

**The cadence half is refused; the diagnosis half is the best thing in the claim.** Fowler's advice —
*"as regular and indivisible a part of programming as typing if statements"* — presumes **a human
typing the if statements**. GitClear's collapse of moved-code from 13% to 3.8% is plausibly that exact
substrate failing: nobody boy-scouts a file they never read. So the honest finding is not *"schedule a
refactor sprint"* (Fowler names that as the symptom of having skipped the opportunities). It is
**the boy-scout rule lost its host, and in an agent-driven build the host is a breakpoint, not a
calendar** — which is the trigger BOSS's PRINCIPLE #1 already fires on.

What survives: an **event-triggered contraction question**, on a surface that already exists, scoped to
founders who have something worth pruning. What dies: the clock, and any new skill.

## If ADOPT / ADAPT
- **What to do (small, in order of confidence):**
  1. **Refresh the data vintage inside `mentor-architect`.** It carries the 2024 GitClear figures via
     [[RVW-053]] (*"copy-paste overtook refactor in 2024"*). The 2026 slope — moved code 13%→3.8%,
     duplication +81% — is the same finding three years sharper. **A citation refresh, not a feature.**
  2. **Add the substrate argument as `mentor-architect` framing**, one paragraph: refactoring stopped
     being automatic because it was never a practice, it was a side-effect of reading the code you
     were editing. Suggestive, never a gate — same treatment RVW-053 got.
  3. **The contraction verb is the genuinely-new part and it does NOT ship yet** — see the re-open
     condition below. It is captured as an IDEA, not built.
- **What's modified from the original claim:** trigger is a **breakpoint, not a clock**; it lands on an
  **existing surface**, not a new skill; it is **scoped to L1+**, so the two beginner cohorts never
  meet it; and the schema/DB half of the claim is **explicitly not covered** (no source was gathered).

## If REJECT / NOT-YET
- **Why the contraction verb is held:** **n=0 founder projects have hit this symptom.** BOSS's own repo
  has (221 releases, 47 skills, a RESUME that needed three archive passes against its own 400-line
  gate) — but that is BOSS's practice, not a founder's, and building a founder feature from BOSS's own
  itch is the exact inversion [[EVID-001]] warned about. Scale already holds `/refactor-wave` as
  symptom-gated; opening a second front at MVP without evidence would jump that queue for no reason.
- **Re-open condition:** a real founder project shows the symptom in a form BOSS can name — an
  `EVID` past `stated-pain`, or a `/health` / `/comprehend` run where the honest read is *"the code is
  the thing slowing you down,"* not *"you have no users."* Until then the diagnosis is framing, not
  machinery.

## Attribution
- **GitClear — VERIFIED (primary fetched).** Every number re-read off `gitclear.com`. ⚠️ Two honest
  dents: the **+47% error-masking figure names no baseline year** on the page, and the report's own
  framing is narrower than its citations — *"The headline is not 'AI writes bad code.' It is that
  today's default AI workflow is incentivized to deliver atomic code."* Vendor telemetry; correlational.
- **Fowler — VERIFIED (primary fetched), and it contradicts the claim.** Direct: *"a team that's using
  refactoring well should hardly ever need to plan refactoring."*
- **Beck — PARTLY VERIFIED.** Fetched `kentbeck.com/summaries` — **his own domain, but the text is the
  site's summaries of his essays, not the essays.** Treat *"a sustainable rhythm of feature-then-options"*
  and *"alternating investment between features and futures"* as attributed, not verbatim. The one thing
  it does establish: **Beck's unit of rhythm is per-feature, not per-quarter** — closer to Fowler than to
  the claim.
- **DORA 2025 — PARTLY VERIFIED, and the useful half did NOT verify.** Only *"AI's primary role is as an
  amplifier"* came off `dora.dev`. **The widely-repeated instability / rework-rate specifics rest on
  secondary summaries and are NOT cited here.** [[RVW-076]] already quarantined one DORA attribution;
  this is the second time the primary would not support what the summaries assert.
- **The counter-argument was searched for and not found.** "AI makes large refactors cheap, so rewrite
  instead" returned only vendor content. **Recorded as absent, not as refuted** — this verdict has not
  heard the other side.

## Notes
- Prior related verdicts: [[RVW-053]] (the 70% problem — this is its data refreshed and its mechanism
  named), [[RVW-076]] (the quarantined DORA attribution — same failure mode recurred here).
- Idea captured: [[IDEA-074]] — the contraction half, held at NOT-YET.
- ⚠️ **Process note:** step 4's model-routing instruction (delegate the verdict to a Fable subagent)
  was **not followed** — this session carries a standing "no subagents unless requested" directive.
  Verdict reached on the session model.
- BOSS version when recorded: 0.221.0
