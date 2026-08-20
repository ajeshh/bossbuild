---
id: PRACTICE-git-workflow
type: practice
owner: mentor-architect
status: active
host: stack-neutral
provenance: distilled from the 2026-06-20 founding-teams research (RESEARCH-COMPENDIUM-2026-06-20 Part B5 — dev process / git workflow) — DORA/Accelerate [EVIDENCE], Addy Osmani on AI code review, METR n=16 perception-gap [EVIDENCE], the worktree-as-parallelism-primitive practitioner pattern — BOSS v0.87.0, FEAT-023 thread 1. Citation-hygiene pass 2026-08-17 (spun off from /vet RVW-074): unverified vendor multipliers were sitting next to a DORA attribution — numbers cut, direction kept and correctly sourced to DORA's *ROI of AI-Assisted Software Development* (2026.01).
provenance_public: Distilled from founding-teams research on dev process — DORA/Accelerate, Addy Osmani on AI code review, the METR n=16 perception-gap study, and the worktree-as-parallelism-primitive practitioner pattern. A later citation-hygiene pass found unverified vendor multipliers sitting next to a DORA attribution: the numbers were cut, the direction kept and correctly sourced to DORA's *ROI of AI-Assisted Software Development* (2026.01).
last_reviewed: 2026-06-20
review_by: 2027-06-20
curve: craft
---

# Practice — Git workflow for AI-native building (trunk-based, review-bounded)

> **The shape of the problem.** AI didn't change what good version control is — it changed which part
> hurts. The bottleneck used to be *writing* the code; now an agent writes it several times faster and
> you deliver only a little more, because the new bottleneck is **review**. *(That gap is the finding;
> the specific multipliers floating around it are vendor- and practitioner-grade, and none of them were
> measured on your team.)* So the whole discipline reorients around one
> question: *how much can two humans actually read and stand behind in a day?* Everything below is in
> service of keeping the batches small enough, and the ownership clear enough, that the answer stays
> honest. (DORA's 2025 line: **AI amplifies what's already there** — install the fundamentals *before*
> you point agents at the repo, or the agent amplifies the mess.)

## Trunk-based is the default (and the highest-leverage fundamental)

For 2–5 people, commit to `main` or branches that live **hours, not days**, and merge daily. DORA's
[EVIDENCE]: trunk-based teams are ~2.3× more likely to be elite performers, and speed and stability are
**not** a trade-off — the same practice buys both. The rule of thumb: **fewer than 3 active branches**,
each short-lived, integrated continuously.

- **`/smoke` is the gate that makes trunk-based safe.** Daily merges to a green `main` only work if "is
  the app even alive" is one command away. Run it before every commit; a red smoke is information, not a
  failure — fix it or document the regression.
- **CI is a *practice*, not a platform.** A two-person team's `/smoke` check **is** its CI. Keep `main`
  green and merge small — that's the whole discipline. Add the hosted pipeline when surface area grows,
  not before (premature ceremony — Principle #2). Don't cargo-cult a 12-stage GitHub Actions matrix onto
  a repo two people share.

## Worktrees are the AI-parallelism primitive — capped at your review capacity

The native way to run agents in parallel is **one git worktree per task**: each agent works in its own
checkout of the same repo, you review and merge each to trunk as it lands. But the cap is the thing most
people get wrong:

> **Cap parallel agents at ≈2–4 — and that number is your *review* capacity, not your *agent* count.**

You can spawn ten agents. You cannot read ten diffs well. The constraint that matters is how many
parallel streams of agent output a human can actually review to the point of standing behind them — and
that's small. Fan out into 2–4 worktrees, merge to trunk daily, and treat the review budget as the hard
limit. More agents than you can review isn't throughput; it's unreviewed code with your name on the merge.

- **Vertical slices keep the worktrees from colliding.** Give each agent a feature end-to-end — a `FEAT`
  is a natural slice — so the worktrees touch different code and merge cleanly. Informal ownership ("you
  take checkout, I take auth") beats a formal locking scheme at this size.

## Risk-tiered review, not blanket gates

Blanket multi-approver review is what *kills* small batches (DORA names it directly). And the wait is
the expensive part: DORA's 2026 ROI reading is that when review can't keep pace, the gains resurface
downstream as costs — **more changes waiting for review**, more rework, more risk reaching production.
*(Delivery-analytics vendors publish hard multipliers for that wait; they're unverified and every such
vendor profits from the conclusion, so take the direction and leave the numbers.)* The answer isn't less
review — it's review **proportioned to risk**.

- **Whoever clicks merge owns what the agent wrote** (Addy Osmani). This is the load-bearing line. The
  agent is not accountable; the human who merged it is. That ownership is what keeps "the AI wrote it"
  from becoming an excuse.
- **Read the test diff *harder* than the code.** This is the AI-specific trap: an agent under pressure to
  make tests pass will quietly **rewrite the assertions to match the broken behaviour**. The code looks
  clean, the suite is green, and the test now certifies the bug. When you review an agent's change, read
  the test changes first and ask *did the behaviour get fixed, or did the expectation get lowered?*
  This is the **review-time** enforcement of a rule that now has a home:
  [`testing-with-agents`](testing-with-agents.md) §1 holds the full failure mode and the other three
  that come with it (green-by-construction, coverage-as-noise, non-determinism).
- **The tiers.** Low-risk (copy, styling, an isolated pure function, a reversible config) — a single
  glance, or let the gate carry it. High-risk (anything touching auth, money, data migrations, deletes,
  deploys, or an AI-mediated control path) — **the *other* human reviews it**, not the one who prompted
  it. BOSS's `/smoke` + `/evals` + `/red-team` **are** the high-risk tier: smoke proves it's alive, evals
  prove the AI path is correct, red-team proves the defences hold. Wire them in as the gate for the
  irreversible, and leave the cheap stuff cheap.

## Mob the hard problems (the questioning reflex degrades)

There's an [EVIDENCE] finding (partly student-population, so held loosely): with an AI as the pair,
people **question the suggestion less** and accept subtly-wrong code more — the second set of eyes a human
pair used to provide gets replaced by an agent that doesn't push back. So for genuinely hard or novel
problems, **put the two humans *and* the agent on it together** rather than one founder + agent in a
worktree. The conscience's nudge here is narrow and rare: at a **high-stakes accept-without-a-second-look**
— an irreversible change merged on a single glance — surface the question, never gate the merge.

## The honesty anchor (don't sell yourself the speedup)

**METR, n=16 [EVIDENCE]:** experienced developers working on *mature* repositories they knew well were
**19% slower** with AI — while *believing* they were 20% faster. The perception gap is the point. This is
the *opposite* population to a greenfield startup (where AI's speedup is real and large), so the lesson
is **not** "AI is slower." The lesson is that your *felt* sense of velocity is an unreliable instrument —
which is exactly why the batch stays small and the review stays real. Trust the green `main` and the
merged diff, not the feeling of moving fast. (This is the build-process echo of BOSS's whole reason to
exist: faster building doesn't make being wrong any cheaper.)

## Ownership = prompt-author intent + reviewer acceptance

The blameless-but-accountable answer to *"who owns the AI's bug?"* — and the one principle this practice
shares verbatim with the founding-team layer (FEAT-021's `/decide` and credit work):

> **Ownership is the prompt-author's intent plus the reviewer's acceptance.** The agent is the
> instrument. The person who asked for the change owns the *intent*; the person who merged it owns the
> *acceptance*. When those are the same person (solo, or a self-merge), they own both. There is no third
> party to blame — which is the entire point of writing it down.

State it once; both this practice and the team layer reference it.

## Altitude / JIT (don't front-load it)

This is **not** a Quickstart lecture. A founder dropping an idea into `/prototype` doesn't need a
branching policy. The discipline earns its place at **MVP**, when there's a real `main` to keep green and
a `/smoke` gate to anchor it — which is why the DOWN of this practice is a tight section in the L1/MVP
working rules, not a wall of git theory. The worktree cap surfaces the first time a founder reaches for
parallel agents; the risk-tiered review surfaces the first time a change touches an irreversible surface.
Right ceremony, right rung (Principle #2).

## Relationship to BOSS

BOSS already ships most of the *mechanism* — `/smoke` (the trunk-safe gate), `/evals` and `/red-team`
(the high-risk tier), `quality-ratchet` (keep `main` from backsliding), and `FEAT-NNN` (the vertical
slice). This practice is the **operating discipline that wires them into a daily rhythm**, plus the two
AI-specific cautions a pre-2025 git guide wouldn't have: the **review cap** on parallelism and **reading
the test diff harder than the code**. A CLI `boss worktree` helper is a *possible* DOWN later — only once
the by-hand pattern has earned it (Principle #1). See [`quality-ratchet.md`](quality-ratchet.md),
[`agent-security.md`](agent-security.md) (the irreversible-action gate), and FEAT-023.
