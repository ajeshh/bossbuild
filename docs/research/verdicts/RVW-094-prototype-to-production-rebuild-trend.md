---
id: RVW-094
type: verdict
owner: pm
status: recorded
created: 2026-09-08
verdict: REJECT
route: n/a
---

# RVW-094 — founders raise on an AI-built prototype, then hire engineers to rebuild it

## The claim
- **Source:** Ajesh, 2026-09-08, reported second-hand from VC conversations and **explicitly flagged
  by him as "needs further validation."** Searched the same day.
- **Core assertion:** Founders use agentic AI to build a prototype, raise on it, and then bring
  engineers in to rebuild it for production — so BOSS should support that transition.
- **Inbox file:** `docs/research/inbox/prototype-to-production-rebuild-after-funding.md`

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | **Not outright, but it fails [[DEC-011]]'s discipline.** The claim is venture-shaped end to end — *raise, then scale, then rebuild.* BOSS's telos was deliberately widened to *"a company, a co-op, or a commons,"* and **BOSS doesn't assume the venture.** Adopting the arc as framed re-imports the assumption the re-aim removed. Also brushes #2 (JIT, never premature ceremony): the transition sits past a stage no BOSS founder has reached. |
| 2 | Evidence grade | 🔴 **Effectively n=0, and two headline numbers are DEAD.** "8,000 startups need rebuilds / $400M–$4B" traces to a vendor blog with **no methodology** — a table sourced to *"Industry estimates"* / *"Engineering firms"*, total marked *"Calculated"*, published by a company selling the remedy. "2.74x more vulnerabilities per Veracode" is **absent from Veracode's own blog on that report AND from the CSA's 2026-04-04 synthesis of the same report**; it survives only on vendor pages, attributed inconsistently to Veracode *or* Apiiro. What is real is **adjacent, not the claim**: Veracode's 45%, Apiiro's 10x findings, YC's 25%-of-W25-at-95%-AI-generated. **None of them say anyone rebuilt after funding.** No survey, no cohort study, no first-party VC or founder account exists. |
| 3 | Duplicate or sharpen? | **Substantially duplicate at the layer that matters.** [[RVW-016]] already ADAPTed Cagan's *build to learn vs build to earn* DOWN into `/prototype` + `/spec` — that **is** the prototype-vs-production distinction, shipped since v0.52. The genuinely-missing piece is narrower and is **not this claim**: `rearchitect` appears **zero times anywhere in the repo**, including in the shipped `mentor-architect`. Split out — see *Notes*. |
| 4 | Who serves / harms? | 🔴 **The killing finding.** Serves `eng-builder` and `returning-founder`, who already know what a rewrite is. **Harms `first-product`, `vibe-coder-newbie`, and `non-tech-founder` directly**: the claim's content is *"what you built isn't real and professionals will replace it,"* sourced from firms that sell the replacement. That is the precise message BOSS exists to refuse. `indie-hacker` is anti-VC by choice, so the arc does not apply to them at all — **three of eight cohorts harmed, one unserved, two served.** |
| 5 | Cost / ceremony | **Heavier**, at the worst possible place: a new surface for a stage BOSS's founders have not reached, serving a cohort of **zero**. [[EVID-001]]'s own stated fear is app bloat, which is canvas Risk #1, and the standing mandate is *compose and SUBTRACT, never add another skill.* |

## Verdict: REJECT

Rejected on **question 4 first and question 2 second** — and either alone is sufficient. The claim's
substance, delivered to the cohorts BOSS is actually for, is *"a real engineer will redo your work,"*
and its only witnesses are the firms that would be paid to do the redoing. A claim whose entire
evidence base is its own beneficiaries is not thin evidence; it is marketing with a citation style.

This is **REJECT rather than NOT-YET on purpose.** NOT-YET says *sound, but unevidenced.* This is not
sound-but-unevidenced: its two circulating numbers are dead, its framing re-imports an assumption
[[DEC-011]] deliberately removed, and the part of it BOSS *should* care about is already shipped via
[[RVW-016]]. Leaving it open as NOT-YET would keep a vendor narrative alive in BOSS's queue on the
strength of having been repeated a lot.

## Why not

- **The evidence is manufactured by its beneficiaries** (rubric 2). Verify before repeating: the
  honest number is Veracode's **45% of samples introduce OWASP Top 10 vulnerabilities**, and it says
  nothing about rebuilds.
- **It harms more of BOSS's cohorts than it serves** (rubric 4). Humane lens applies.
- **The useful half already shipped** (rubric 3, [[RVW-016]]).

**What is NOT rejected:** the narrow, independently corroborated version — *code audits are now
normal in technical due diligence, and "95% AI-generated, nobody can explain it" reads as risk rather
than flex.* That is a **diligence** claim, not a **rebuild** claim. It is not adopted here either; it
has not been vetted and would need its own pass and its own evidence.

## Attribution
🔴 **Does not verify, in two distinct ways.**
1. **The 2.74x figure does not verify against its claimed source.** Not in Veracode's blog on the
   report; not in the CSA research note that synthesizes that report. Vendor pages split it between
   Veracode and Apiiro. It may exist in the gated full PDF — **unverified against any primary, and it
   must not be repeated by BOSS in any form.**
2. **The "8,000 startups" figure has no author to verify.** Its publisher discloses no methodology and
   marks the total *"Calculated."*
The originating VC attribution is **second-hand and unverifiable by construction** — no named
investor, no published account. Ajesh flagged this himself when raising it; the search confirmed the
instinct.

## Notes
- **Split out for its own pass (NOT covered by this verdict):** `rearchitect` has **zero occurrences**
  anywhere in the repo while [[EVID-001]] asked for *"help me keep focus + when to rearchitect"* in
  those words. That is a **first-party founder ask with no surface** — a different claim, a different
  evidence grade, and it must not inherit this REJECT. Filed as
  `docs/research/inbox/rearchitect-has-no-surface.md`.
- **Also split out:** the *focus/disorientation* half of EVID-001. `focus-loop` (v0.67.0) catches
  **over-commitment** (≥4 FEATs in flight, none shipped); EVID-001 described **disorientation**. A
  founder with one FEAT and no memory of it trips nothing — and BOSS's own tree (6 FEATs, 1 in flight)
  would never fire it either. That is a **reach** question, likely already discharged by v0.231.0's
  `boss status` re-entry read, and it is not a practice claim.
- Prior related verdicts: [[RVW-016]] (build to learn vs build to earn — ADAPT, the shipped answer to
  the prototype/production distinction).
- Research record: `docs/research/sessions/SESSION-2026-09-08-harness-and-host-since-august.md`.
- Verdict reached **in-session**, not delegated to a Fable subagent as step 4 suggests — subagent
  delegation was unavailable this session. Recorded so the method is not overstated.
- BOSS version when recorded: 0.260.0
