---
id: PRACTICE-analytics-for-ai-products
type: practice
owner: mentor-gtm
status: active
host: stack-neutral
provenance: distilled from the 2026-07-23 research sweep (post-ship validation thread) — the "model accuracy != user success" doctrine (iamprayerson 2026), AI product metrics (TianPan 2026 — TCR, retained-character rate, frustration index), PostHog LLM analytics (product+observability convergence), Hamel Husain & Shreya Shankar (online evals on production traffic), the Camuffo RCT (validation buys faster quitting). Pairs with /measure (the runner), /evals + /judge-traces (correctness), /ai-cost + /cost-review (spend), the EVID ladder, and the humane lens (ai-ux-patterns.md). BOSS v0.113.0.
---

# Practice — Analytics for products that ARE AI (measure the right thing; don't surveil the human)

> **Where this sits.** BOSS owns *pre-build* validation (`/pretotype`, `/evidence`, `/interview`,
> `/research`). This is the *post-ship* half, for AI products specifically — and its `/measure` skill is the
> runner. The load-bearing idea: **classic analytics assumes deterministic output; an AI product violates
> that, so measurement partly breaks and must fuse with the eval loop.** The humane clause below is the part
> no listicle carries and the part BOSS won't drop.

## First, the JIT boundary (the strongest one in this whole practice)

**A founder at 0–10 users needs none of this.** Analytics on ten users is noise — you *talk* to ten users.
The correct output of `/measure` at n<10 is *"close this and go talk to them."* Instrument at roughly **n≥30–50**
(when you can no longer eyeball every session), and even then: **one activation metric, one retention curve,
≤10 events.** Dashboards, 200-event taxonomies, a "North Star committee," paid tiers, warehouse analytics —
all premature ceremony before you have a retention curve worth reading (Principle #2).

## Why classic analytics breaks on an AI product

Traditional metrics assume outputs are consistent and attributable to system logic. An AI output is a *sample
from a distribution*, so: binary success/fail misses *partial* correctness; funnels miss *invisible user
effort* (verifying, editing, regenerating); latency misses *cognitive latency* (time from output to *usable*
result). The one line to carry: **model accuracy ≠ user success.** A model can be "right" and the user still
fails — measure the user's success, not the model's score.

## The metric vocabulary for AI products

- **Task Completion Rate (TCR)** — % of initiated tasks reaching a successful end state. The closest thing to
  an AI north star; products above ~70% TCR retain materially better than below ~55% *at the same DAU*.
- **Acceptance rate → retained-character rate.** % of outputs used — but "kept unmodified" is a weaker signal
  than *how much survived* (Copilot's real trust signal was ~88% of accepted characters *retained*).
- **Edit rate / edit distance** — how much the user changes output before accepting. Low edit + high TCR = they
  trust it and use it directly; high edit = "usable only with effort."
- **Regeneration frequency** — repeated "try again" = dissatisfaction.
- **Containment / deflection** — for agentic/support: % resolved without escalation or error.
- **Frustration Index** (message repetition, short follow-ups after long answers, clarification requests,
  abandonment) — rising frustration across sessions ≈ 3× churn within two weeks. A *leading* churn signal.
- **Cost per *successful* outcome** — not cost-per-request. Tokens spent on users who *succeeded/converted*,
  not raw spend. This is the half `/ai-cost` + `/cost-review` are missing (they track the budget; this ties it
  to a good outcome).
- **Thumbs up/down — treat with suspicion.** Heavily self-selected, correlates poorly with real quality. A
  starting point, not truth (rhymes with BOSS's "vibes-eval is only a starting point").

## Product analytics and the eval loop are merging

Every AI product runs two products at once: the one users see, and the AI layer underneath. So the loop is:
**traces (what the model did) → evals (was it good) → product metrics (did the user succeed / stay)** — joined
on the same user/session. `/evals` + `/judge-traces` own the inner (correctness) loop *offline*; the new half
is **online evals on a *sample* of production traffic** — shadow-score live sessions, alert on drift, auto-curate
failing traces into the eval set. Tooling: PostHog links LLM generations to the full user session (the product
outer loop); Langfuse/Phoenix own the inner loop (both free/OSS) — but a first app needs neither platform
(print-logging + a JSONL trace + a spreadsheet *is* the practice the tools operationalize).

## The humane clause (BOSS's actual differentiator here — non-negotiable)

Product analytics quietly becomes surveillance and engagement-maximization — the exact dark pattern the humane
lens exists to catch. So:
- **Measure task success and graduation / loop-closure, NOT engagement / DAU / time-in-app.** Engagement-as-goal
  is the surveillance-capitalism failure mode; a humane product wants the user to *succeed and leave*, not stay.
- **Prefer aggregate / privacy-first instrumentation** (Plausible/Fathom/Matomo pattern; PostHog with PII
  discipline). Measure the *product*, don't surveil the *human* (the [[IDEA-021]] contract: the work leaves an
  honest trace; read the trace, don't instrument the person).
- **The Frustration Index is legitimate *because it helps the user*** — catch churn-from-struggle and fix the
  product — not to manipulate retention. Name that line so it isn't weaponized.
- Regulatory tailwind, not the reason: CCPA/CPRA dark-pattern rules, the EU Digital Fairness Act. A pointer,
  never a compliance gate (see `ai-ux-patterns.md`).

## Ties to the EVID ladder and the thesis

Post-ship behavior is the **top of the evidence ladder** — real usage/retention is `observed-behavior` /
`commitment` EVID, not `stated-pain`. And the honest frame holds: cheap AI lowered the cost of *building*, not
of *being wrong* (Camuffo) — so the live product is now your best evidence instrument. Instrument it, or you're
just shipping faster into the dark. Feeds [[IDEA-051]] (operate-mode customer loop).

## Altitude / JIT

Silent until a project is AI-mediated **and** live with real users past the n<10 boundary. Surfaces via
`/measure` (the runner) and around `/ship`'s "who's the first real user?" voicing. The A/B / experimentation
half (nondeterminism = test a *distribution*, randomize on users, bigger variance-aware samples, offline-eval-
can-lie) is a `mentor-gtm` pointer for *later* — real conversion volume (~100+ per arm) is far off for most.
Multivariate stays premature for essentially every BOSS founder.
