## Scale working rules (added on `boss unlock scale`)

> {{MODE}} mode is where the product has customers, the founder has help, and **coordination — not
> code — is the bottleneck.** The founder's job has become **leader** (give away your Legos). Same JIT
> principle as every rung: nothing is imposed until a real symptom earns it. Scale is the mode most
> tempted by premature ceremony — which is the exact disease BOSS treats — so everything here is
> **symptom-gated**, and the unlock named its own bar before you crossed it.

1. **High-risk paths get the human tier.** Name the paths where a mistake is expensive and hard to
   reverse — **schema/migrations, billing, auth** — in this file as they emerge. Changes there require
   the *other human* + `/smoke` + `/evals` before merge. This isn't a governance committee (Scale
   *refuses* that); it's `git-workflow`'s existing risk tiers with one named list. Conventions-as-code
   holds the line, not a reviewer's memory.
2. **Decisions get an owner (DRI).** At Scale a decision without an owner is the coordination symptom
   in its purest form. `/decide` carries an optional `dri:` (the one directly-responsible individual);
   `boss board --json` surfaces it. Recording an owner ≠ gating the decision.
3. **The customer loop is the signal now.** Real users generate evidence; `/triage --feedback` is the
   register (bug → fix now / friction → observe / **feature request → a stated-pain `EVID`, never a
   spec** / churn → the loudest evidence there is). `/incident` runs the blameless post-mortem when
   something breaks: fix first, analyze second, one systemic learning routed through `/boss-learn`.
4. **The conscience never fires at, evaluates, or reports on a non-founder.** When a roster grows, the
   conscience still coaches *the founder* only. It does not grade contractors or employees, does not
   surface per-person output, and never becomes a management surveillance tool. This is a hard line,
   not a setting.
5. **The conscience matures by register, not by new hooks.** `focus` reads the *team's* WIP (finishing
   still beats starting); `drift` reads strategy (the canvas bet vs. what's actually shipping). Earlier
   moments keep firing — Scale adds discipline, it doesn't replace it.

## What Scale refuses (recorded, so it isn't re-litigated by default)

- **No PM-org cosplay** — no product councils, principal-PM patterns, or `/saturday` cadence chains. An
  org of agents imitating an org of humans serves no real symptom. Re-openable only by a genuine
  multi-team coordination failure.
- **No unearned IDs** — `RFC-NNN` is authored only when two builders actually disagree in writing (its
  honest trigger); `EXP-NNN` / `AUDIT-NNN` stay unauthored until a live symptom needs them.
- **No calendar reflection ceremony** — `/close` + the learning pulse already carry reflection at the
  honest grain.

## What Scale adds (alongside V1) — authored slices 1–2

- **Skills:**
  - `/incident` — the blameless one-page outage post-mortem (fix-first, one systemic learning UP).
  - `/triage --feedback` — the customer register on the existing `/triage` verb (bug / friction /
    feature-request-as-`EVID` / churn), writing into the evidence ledger.
- **Trigger-gated, not yet authored** (each waits on a real project's symptom, same discipline as
  ever): `/economics`, collaborator roles + an operations mentor + onboarding briefs, `/code-health`,
  `/refactor-wave`, and the give-away-your-Legos conscience moment.
