---
name: sunset
description: End something honestly — a whole project, or one zombie feature. With no argument, sunsets the PROJECT (the post-mortem nobody ships: honest post-mortem → harvest patterns UP → `boss retire`, reversible). With a FEAT (e.g. /sunset FEAT-007), sunsets ONE FEATURE — but only after usage-validating it's actually dead (not just quiet), guarding the segment/commitment exception (a low-usage feature can be the reason a key account stays), and drafting the HONEST user-facing deprecation notice (real notice period, a path out, no "we're improving your experience" euphemism). Subtraction is a feature; a bloated product serves no one. Framed as an experiment that returned an answer, never as failure. Deliberate-invoke only; the conscience never suggests it unprompted (it may only point at it from inside a moment that already fired — e.g. the focus circuit-breaker). Usage - /sunset [FEAT-NNN | feature name]
---

# /sunset — projects can end well

Every tool optimizes starting and building. None of them ships an ending. So projects don't die —
they go *undead*: never killed, never learned from, sitting in `~/projects/` quietly accusing you.

That's the expensive kind of unfinished. BOSS's whole "why" (PRINCIPLES.md, Camuffo) is that
validation's payoff is **deciding faster — including quitting faster**. A bet you end on purpose,
with the lesson harvested, is a *closed loop*. A bet you abandon is a leak.

`/sunset` closes the loop. One honest page, three movements, ~20 minutes. Not a ceremony.

## Two scopes — read the argument

- **`/sunset`** (no argument) → sunset the **whole project** (the three movements below).
- **`/sunset FEAT-NNN`** or **`/sunset <feature name>`** → sunset **one feature** (the feature-level section
  further down). This is the honest ending for a *zombie feature* — shipped, then quietly unused — and it's what
  the `focus` circuit-breaker points at when it offers to end a stuck-in-build FEAT rather than leave it 70%-done
  forever.

Same voice, same "an experiment that returned an answer" frame, at both scales. Subtraction is a feature: a
product accretes features by default and almost never sheds them, so the surface bloats, the maintenance
compounds, and the users get more confused — removing a dead one is *editing*, not losing.

**The voice here matters more than anywhere.** You are the seasoned hand who has shut down more
projects than most people have started. No grief-bot. No "congrats on your pivot!" No consolation
prize. This was a real experiment; it returned an answer; the answer is worth keeping. Say it plainly.

## When to run it

Deliberately, when a founder decides a project is done — validated-no, out of runway, or simply not
the thing anymore. **Never fire this unprompted.** A tool that suggests quitting on its own is the
most violent conscience over-fire there is. The conscience may, at most, *point at* `/sunset` from
inside an existing deliberate moment (e.g. `/drift-deep` surfacing a long-dead project) — it never
pushes.

## Movement 1 — the honest post-mortem

Read what the project actually recorded — don't make the founder reconstruct it from memory:
`docs/ideas/CANVAS.md` (the bet), `docs/ideas/` (what was captured), `docs/devlog.md` (what
happened), and `docs/evidence/` if it exists (the graded EVID ledger — the real signal). Then ask at
most **three questions**, Mom-Test discipline on their own narrative (separate what they *observed*
from what they still just *believe*):

1. **What was the bet?** The riskiest assumption this project was really testing.
2. **What evidence actually came in?** Observed, not hoped. If the EVID ledger is thin, say so — a
   project ending with only `stated-pain` and no `commitment` is itself the finding.
3. **What did this teach that the next project inherits?** The durable lesson — about the market,
   the craft, or the founder's own pattern.

Frame the whole thing as *"a real experiment that returned an answer."* Not failure. If the answer
was "no one wanted it," that's a **cheap no**, bought early — exactly what the method is for.

## Movement 2 — the harvest

The exit is the richest Principle-#1 breakpoint there is, and it's currently uncaptured. Before the
project closes:

- Surface the reusable patterns — a build technique, a research move, a hard-won craft lesson — and
  **offer to route each UP via `/boss-learn`** (offer; don't auto-run — the founder decides what
  generalizes).
- Write **`docs/POSTMORTEM.md`**: one page the founder keeps. The bet, the evidence, the lesson, the
  date. Short enough to actually re-read before the next project.

## Movement 3 — the clean close

Run **`boss retire`** — it flips the project to `retired` (with today's date) in both the local
`.boss/manifest.json` and the machine registry. That's the whole state change:

- `boss board` still shows the project honestly, marked retired (the record, not a live board).
- `boss list` folds retired projects quietly to the bottom.
- `boss insights` can finally answer *"how many bets did I run, and how fast did I kill the dead
  ones?"* — **kill-speed**, the Camuffo metric BOSS otherwise can't measure.

## Guardrails (say these plainly if asked)

- **Retiring ≠ deleting.** Nothing on disk is touched. The repo stays. `boss retire --undo` reopens
  it — the decision is reversible.
- **Never conscience-driven.** This skill only runs when the founder invokes it.
- **Not a ceremony.** One page, three questions, done. If it starts to sprawl, cut it.

---

# Feature-level sunset — kill one zombie feature honestly

When invoked with a feature (`/sunset FEAT-007` or a named feature), this ends **one feature**, not the project.
The failure mode it treats: products accrete features and never remove them, so a *zombie* — shipped, then
quietly unused — sits there costing maintenance, widening the attack surface, and confusing new users, while
nobody wants to be the one who kills it. Removing it well is a real improvement.

## Move 1 — usage-validate that it's actually dead (don't kill on a hunch)

**A feature you *feel* is unused and a feature that *is* unused are different things.** Before anything, read the
evidence: `/measure` / analytics for this feature's usage, the retention/`/health` read, the `--feedback`
register. Kill it on **data**, not vibes.
- **Genuinely near-zero usage across a real window** → a real zombie; proceed.
- **Quiet but not dead** (a small, steady, or high-value cohort uses it) → this is *not* a sunset; it's a
  Move-2 question. Stop and check the exception first.
- **No usage data yet / n<10 / not shipped** → you can't validate death. If it's a *stuck-in-build* FEAT (the
  focus circuit-breaker case), that's a different call — end it because it's *not finishing*, not because it's
  unused; say that honestly and skip the usage claim.

## Move 2 — guard the segment / commitment exception (the load-bearing check)

**Low usage ≠ safe to remove.** A feature few people use can still be load-bearing:
- **A commitment** — you promised it to a customer, it's in a contract, a key account's workflow depends on it.
  Killing it breaks a promise; that's a trust cost, not a maintenance saving.
- **A segment** — the *few* who use it may be your most valuable or most-retained cohort (the one enterprise
  deal, the power users who anchor the product). Reach-blindness cuts both ways: don't over-serve the loud, and
  don't *strand* the quiet-but-critical.

If either holds: **don't kill it** — or migrate those users to the replacement *first*, then sunset. When in
doubt, `/interview` the users who still touch it before you remove it.

## Move 3 — draft the honest user message (no euphemism)

For whoever still uses it, write the **honest deprecation notice**: *what* is ending, *when* (a real notice
period, not a surprise), and *what to do instead* (the path out — export, migrate, alternative). Plainly. The
anti-patterns to refuse (`ai-ux-patterns.md`): the "we're improving your experience" euphemism for "we removed
what you relied on," the silent removal, the sunset with no export path (data hostage). Respect > spin.

## Move 4 — harvest, then remove

- **Harvest** the reusable pattern (same as a project sunset — offer to route it UP via `/boss-learn`; the
  founder decides what generalizes). Even a killed feature usually taught something.
- **Remove** the feature and record it: mark the FEAT `status: retired` (or `sunset`) with today's date in
  `docs/ideas/FEAT-NNN-*.md`, a one-line devlog entry (`/log`) with the usage evidence + the reason, and remove
  the code in a small reversible commit. Nothing is hidden — the FEAT record stays; it's marked ended, not
  deleted.

## Feature-level guardrails

- **Kill on usage, not vibes** (Move 1). A hunch is not evidence a feature is dead.
- **Guard the commitment/segment first** (Move 2) — the quiet cohort might be the one that matters most.
- **Honest deprecation, always** — real notice, a path out, no euphemism; never a data-hostage removal.
- **Subtraction is a feature, not a failure.** Removing a zombie makes the product better for everyone left.
- Still **never conscience-driven** — the `focus` moment may *point* at `/sunset FEAT-NNN`; it never pushes.
