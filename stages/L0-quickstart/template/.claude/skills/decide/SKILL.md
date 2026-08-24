---
name: decide
description: Record a load-bearing decision as a durable DEC-NNN record — Context / Decision / Why / a cheap Falsifier (what would prove this wrong, and by when) / Consequences, stamped with who decided (founder vs AI-suggested-ratified vs AI-autonomous) and how reversible it is. The rationale future-you (and a cofounder who wasn't in the room) can read instead of guessing — and the falsifier makes finding out you were wrong cheap and scheduled. Lighter than an RFC, denser than a commit message. Usage - /decide <the decision, or describe it>
---

# /decide — the decision record

Most decisions vanish. The diff shows *what* changed; the chat where you chose it scrolls away. Six
weeks later someone — future-you, or a cofounder — finds the choice and faces two bad options: blindly
accept it, or blindly change it. Neither knows *why*. A decision record fixes that: it captures the
**reasoning**, not just the outcome.

This is an ADR (architecture decision record), kept light. Use it for the calls that are **load-bearing
or hard to reverse** — which idea to pursue, which stack, which market, how equity/ownership splits, a
constraint you're committing to. Skip it for the small two-way-door choices you can undo in a minute
(those belong in `/log` as a one-line note).

## When to reach for it

- A choice you'll be asked to justify later, or that you'd regret silently reversing.
- A **one-way door** (Bezos): expensive or impossible to undo. These *always* deserve a record.
- A decision a **cofounder** needs to see and could later want to discuss — ownership, direction, who
  owns what. (In a team, the record is the thing both can point at instead of misremembering.)

If it's a reversible two-way door, don't ceremonialize it — a `/log` line is enough.

## How to run it

0. **Did this come from outside?** *(Skip unless it did — most decisions are your own.)* If the reason
   you are making this call is that somebody said you should — a thread, a talk, a post with a number
   in the headline — **check the attribution before you write the record.** Who actually said it, and
   is the claim the thing they actually said? A decision inherits the authority of whatever it was
   built on, and a `DEC-NNN` makes that inheritance durable: the wrong attribution stops being a bad
   afternoon and becomes the reason a future decision cites this one.

   Two minutes: `boss craft outside-claims`. It names the six ways an attribution goes wrong (each one
   real — BOSS got them wrong itself), how to grade what kind of evidence you actually have, and why
   naming the re-open condition is what stops a `no` being re-argued every month.

   Then write what you found into **Why** below — *"adopted from X, primary checked"* or *"the
   attribution did not verify; decided on our own reasoning instead."* The second is a fine answer and
   a much more useful record than a citation nobody re-opened.

1. **Resolve the decider** (the one named accountable person — the "DRI"). Get their GitHub handle:

   ```bash
   gh api user --jq '.login' 2>/dev/null || git config user.name
   ```

   Use it as `@<login>`. If neither resolves, leave `@you` — never fabricate a name. Also set **how the
   call was made** in `decided_by`: `founder` (a human chose it), `ai-suggested-ratified` (the model
   proposed it, a human signed off), or `ai-autonomous` (the model decided and acted). This makes
   over-delegation of load-bearing calls *visible* — it's where automation bias quietly enters.

2. **Pick the next number.** Look in `docs/decisions/` for the highest `DEC-NNN`; add one. First one is
   `DEC-001`. Create the directory if it doesn't exist.

3. **Write `docs/decisions/DEC-NNN-<short-slug>.md`:**

   ```markdown
   ---
   id: DEC-NNN
   type: decision
   owner: "@<github-login of the decider>"
   decided_by: founder        # founder | ai-suggested-ratified | ai-autonomous
   status: decided
   created: {{today}}
   reversibility: reversible | costly | one-way
   revisit_by: <YYYY-MM-DD>   # optional — the "by when" of the Falsifier below
   # supersedes: DEC-MMM      # only if this replaces an earlier decision
   ---

   # DEC-NNN — <the decision, in one line>

   ## Context
   What's true that forced a choice? The constraints, the options on the table, what's at stake.

   ## Decision
   What we're doing. One or two plain sentences. If there were named contributors to the call beyond the
   decider (pairing, a cofounder who weighed in), name them here — credit the thinking.

   ## Why
   The reasoning. Why this over the alternatives. Name the alternative you rejected and what would change
   your mind. (For `costly`/`one-way` calls, weigh the real options: considered · chosen · why-not.)

   ## Falsifier — what would prove this wrong, and by when?
   The cheapest signal you were wrong, with a date. *"If signups don't move by July, X was wrong."*
   This is the load-bearing field: naming who decided and who's accountable **is not enough** — the real
   bottleneck is the *cost of finding out later* that the call was wrong. A falsifier makes the check cheap
   and scheduled (mirror the date into `revisit_by:`). **Required for `costly`/`one-way`; encouraged for
   `reversible`.**

   ## Consequences
   What this commits you to, what it rules out, what to watch. If `reversibility` is `costly`/`one-way`,
   say what the exit would cost.
   ```

4. **Fill from what the founder gave you.** If they only have the one-liner, write Context + Decision and
   leave **Why** as a single honest question prompt rather than inventing rationale. Blanks are honest;
   fabricated reasoning is worse than a gap.

5. **Scale the ceremony to `reversibility` — never block, just match the rigor:**
   - **`reversible`** (undo in minutes) — keep it to a line or two. The bar isn't "is this provably right?"
     but **"is it safe enough to try?"** (the consent question — it gives a non-technical cofounder honest
     language to agree to a reversible call without fully evaluating the technical detail). A falsifier is
     encouraged, not required. Don't ceremonialize a two-way door.
   - **`costly` / `one-way`** (real switching cost / effectively permanent) — **require the Falsifier**
     (what would prove this wrong, by when) and **weigh the alternatives** in `## Why` (considered · chosen
     · why-not). These are the calls worth the extra minutes.

6. **If `decided_by` is `ai-suggested-ratified` or `ai-autonomous` AND it's `costly`/`one-way`, ask one
   skeptical question — then stop.** *"This came from the model — what's the one thing you'd check before
   you can't undo it?"* Disposition (a moment of skepticism) catches more than any process; install it at
   the single moment it matters. **It's a prompt, never a gate** — forcing verification backfires (it raises
   the odds people rubber-stamp). Record their answer in the Falsifier; if they wave it off, that's their
   call — note it and move on.

## Superseding, not editing

A decision record is a **historical fact** — it was true when made. Don't rewrite it when you change your
mind. Instead: write a **new** `DEC` with `supersedes: DEC-MMM`, and flip the old one's `status:` to
`superseded`. The chain *is* the story of how your thinking evolved — keep it readable, don't erase it.

## What this is not

- Not an approval gate. `/decide` records a decision; it never blocks one. (BOSS's conscience may *surface*
  a tension; it never picks the decision for you — and with cofounders, it never takes a side.)
- Not a cap table or a legal instrument. A `DEC` can record *that* you agreed equity splits 60/40 with a
  4-year vest — it does not compute the split, and it is not legal advice. For ownership/equity/vesting,
  the record is the conversation you had; **a real attorney is the authority.**
- Not for every choice. Over-record and the log rots. Reserve it for the load-bearing and the one-way.

## Why it's worth the two minutes

The decisions you don't write down are the ones that cause the worst fights and the slowest re-litigation
— solo (with your future self) and especially with a cofounder. A short, dated, attributed record is the
cheapest insurance there is against "wait, why did we do it this way?"
