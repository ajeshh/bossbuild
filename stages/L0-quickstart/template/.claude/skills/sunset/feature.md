# Feature-level sunset — kill one zombie feature honestly

When invoked with a feature (`/sunset FEAT-007` or a named feature), this ends **one feature**, not the project.
The failure mode it treats: products accrete features and never remove them, so a *zombie* — shipped, then
quietly unused — sits there costing maintenance, widening the attack surface, and confusing new users, while
nobody wants to be the one who kills it. Removing it well is a real improvement.

## Move 1 — usage-validate that it's actually dead (don't kill on a hunch)

**A feature you *feel* is unused and a feature that *is* unused are different things.** Before anything, read the
evidence: analytics for this feature's usage, the retention read (`/health`), the `--feedback`
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
anti-patterns to refuse (`boss craft deceptive-patterns --surface cancel-and-delete`): the "we're improving your experience" euphemism for "we removed
what you relied on," the silent removal, the sunset with no export path (data hostage). Respect > spin.

## Move 4 — harvest, then remove

- **Harvest** the reusable pattern (same as a project sunset — offer to record it with `/extract`, or a line in the idea doc at Quickstart; the
  founder decides what generalizes). Even a killed feature usually taught something.
- **Append the lesson to the FEAT record itself** — a short `## What this taught` section in
  `docs/ideas/FEAT-NNN-*.md`: one or two sentences, in the founder's words. That is where the next
  attempt will look: `/spec` reads the dropped FEATs before writing a new one, so the lesson meets the
  next idea at the moment it would repeat the mistake. A lesson kept anywhere else is one nobody reads.
- **Remove** the feature and record it: mark the FEAT `status: dropped (sunset {{today}} — <the usage
  evidence, in a few words>)` in `docs/ideas/FEAT-NNN-*.md`, a one-line devlog entry (`/log`) with the
  reason, and remove the code in a small reversible commit. Nothing is hidden — the FEAT record stays;
  it's marked ended, not deleted.
  - **`dropped` is the word, and the parenthetical is where "it shipped and then we removed it"
    goes.** `docs/IDS.md` declares a closed set of seven statuses. Any other word — `retired`, `sunset`
    — is flagged by `boss records`, and `boss board` files an unrecognised status as in flight, so the
    *removed* feature reappears in the Building column. Detail after the first word is encouraged; a
    new word is not.

## Feature-level guardrails

- **Kill on usage, not vibes** (Move 1). A hunch is not evidence a feature is dead.
- **Guard the commitment/segment first** (Move 2) — the quiet cohort might be the one that matters most.
- **Honest deprecation, always** — real notice, a path out, no euphemism; never a data-hostage removal.
- **Subtraction is a feature, not a failure.** Removing a zombie makes the product better for everyone left.
- Still **never conscience-driven** — the `focus` moment may *point* at `/sunset FEAT-NNN`; it never pushes.
