---
name: roadmap
description: Weigh what to build next — feedback against behavior — into a SMALL bet-list with a mandatory NO-list. Not a Gantt, not a backlog to tend: a Shape-Up-style handful of bets with a fixed appetite, produced periodically and thrown away, never a persistent planning surface. Confidence on each bet = the EVID grade behind it (Gilad's Confidence Meter mapped onto BOSS's stated-pain → observed-behavior → commitment ladder), so a bet's rank comes from evidence, not volume or a HiPPO. RICE-reach is OFF by default (reach-weighting optimizes for the loud majority-of-noise). Pre-PMF, the only honest roadmap is "find fit" — it defers to /health. Humane — serves the silent majority who drive value, not whoever shouts, and the NO-list is where that discipline lives. At n<10 the honest output is "go talk to them." Usage - /roadmap
---

# /roadmap — what's worth building next (a small bet-list + an honest NO-list)

The fuller version of the `/spec` "loud ≠ important" check: that one fires on a *single* request at decide-time;
this weighs *all* the signal at once into a small set of bets. It is deliberately **not** a persistent roadmap.
BOSS refuses the Gantt/backlog-you-tend (a planning surface you maintain instead of ship) — this produces a
dated bet-list you *use and discard*, then re-run when the picture has genuinely changed.

## Step 0 — the JIT gate + the PMF check

- **n<10 → stop. There's nothing to weigh yet** — the honest output is `/interview`, not a bet-list.
- **Pre-PMF (run `/health` if unsure) → the roadmap is one item: *find fit.*** Adding features before fit is
  the build trap (Perri) — a longer roadmap pre-PMF is usually avoidance of the fit question. Say so plainly.
- **At/post-PMF with real usage → proceed** — now weighing bets is the actual work.

## Step 1 — gather both kinds of signal (behavior outranks requests)

Read two columns, and keep them apart:
- **What users *say*** — the `--feedback` register (feature requests, friction), support threads, `/interview`
  notes. Requests are `stated-pain` — the *weakest* evidence grade.
- **What users *do*** — `/measure` (where they succeed/stall), the retention curve and *churn* (`/health` — who
  left and where), usage concentration. Behavior is `observed-behavior` / `commitment` — the *stronger* grade.

**When they disagree, behavior wins.** The loudest requesters are rarely the median user; the churn you can't
hear outranks the complaint you can (the loud≠important discipline, applied across the whole board).

## Step 2 — score each candidate by CONFIDENCE = the EVID grade (not reach, not a vibe)

Itamar Gilad's Confidence Meter maps exactly onto BOSS's evidence ladder — use it as the rank:
- **commitment-grade evidence** (someone paid / gave time / a cohort's behavior proves it) → high confidence.
- **observed-behavior** (usage/retention data points at it) → medium.
- **stated-pain** (people asked, nothing more) → low — a hypothesis to *test cheaply* (`/pretotype`,
  `/interview`), not a bet to fund.

**RICE-reach is OFF by default.** Reach-weighting systematically favors whatever touches the most users, which
early is a vanity signal — it optimizes for the loud majority-of-noise over the *right* users. Rank by evidence
(confidence) and the size of the pain, not by headcount. (If you later have real scale and genuinely comparable
bets, reach can re-enter as a tiebreaker — name it when it does; it's off until then.)

## Step 3 — write the bet-list with a fixed appetite (Shape-Up, not a backlog)

Pick a **small handful of bets** (2–4), each with a **fixed appetite** — the time you're willing to spend, not an
estimate you'll overrun (Singer, *Shape Up*). A bet is *"this problem, this much time, this rough shape"* — not a
ticket, not a spec (that's `/spec`'s job, downstream). Anything that isn't a bet this cycle isn't "later" — it's
**not now**, and it goes on the NO-list.

## Step 4 — the NO-list is mandatory (this is where the discipline lives)

Write down, explicitly, **what you are NOT building** — the requests you're declining this cycle and *why*
(usually: low evidence grade, serves a vocal minority, or doesn't move the current bet). **No is the default;
the NO-list is the load-bearing half of the roadmap** — a roadmap that only says yes is a wish-list. This is also
where you protect the **silent majority**: the features you're *not* building for the loudest few are a decision,
so record it.

## The humane line (PRINCIPLE #6)

- **The roadmap serves the users who drive the value, not the users who shout.** A board captured by whoever
  complains loudest quietly degrades the product for everyone who doesn't — the NO-list is the guard.
- **Kill honestly.** If a candidate is a zombie (shipped, unused), it's not a roadmap item — it's a
  `/sunset` (feature-level) candidate. Don't let the roadmap hide the things that should end.
- **Not an engagement roadmap.** Bets are judged on whether they help users *succeed*, never on whether they'd
  lift time-in-app.

## Output

A dated `docs/roadmap/ROADMAP-<date>.md`: the **bet-list** (2–4 bets, each with its problem + appetite +
confidence = EVID grade), the **NO-list** (declined + why), and the **one riskiest assumption** the top bet
still rests on. **A snapshot, not a living plan** — re-run when the signal has genuinely moved (a Shape-Up cycle,
a new cohort), never on a calendar; delete the old one. Promote a chosen bet with `/spec` (that's where it
becomes a FEAT).

## Cohort-aware
- `first-product` / `vibe-coder-newbie`: keep it to 1–2 bets + a NO-list; teach "what users *do* beats what they
  *say*" plainly. If n<10, don't — `/interview`.
- `non-tech-founder`: business-language bets; the confidence = evidence-grade framing lands (they know a signed
  deal beats a "great idea").
- `returning-founder` / `eng-builder`: terse; the Gilad-ladder mapping + fixed-appetite bets; skip the basics.
- `indie-hacker`: calm-company — a short bet-list you can actually ship beats a big backlog; the NO-list is the
  point.
- `vibe-virtuoso`: the sharp cut — the bet-list is 3 items *with a fixed appetite each*, not another 20-idea
  backlog; finishing one bet beats shaping ten.

## Rules
- **Say no at n<10; defer to `/health` pre-PMF** — the roadmap pre-fit is "find fit."
- **Behavior outranks requests.** Requests are `stated-pain` (weak); usage/churn is the strong grade.
- **Confidence = the EVID grade**, not reach, not a HiPPO. **RICE-reach OFF by default.**
- **A small bet-list with fixed appetites, never a Gantt/backlog you tend.** Snapshot, use, discard.
- **The NO-list is mandatory** — no is the default; it's where the silent-majority discipline lives.
- **Not a scheduled cadence.** Re-run when the signal moves, not on a calendar (BOSS refuses the weekly-discovery
  treadmill). Promote a bet with `/spec`; end a zombie with `/sunset`.
