---
id: RVW-021
type: verdict
owner: product-lead
status: recorded
created: 2026-06-20
verdict: ADAPT
route: DOWN src/conscience.js (boss conscience activity) + the relationship loop
---

# RVW-021 — a proactive agent gets a finite interruption budget (3-5/day); measure notifications *acted on*, not sent

## The claim
- **Source:** tianpan.co/blog/2026-05-13-background-agents-notification-budget-attention-economy (May 2026)
- **Core assertion:** treat proactive notifications as withdrawals from a finite account — a hard daily cap
  (3-5), the planner *aware of remaining budget*, learn each user's fire-threshold from dismiss-vs-act
  behavior, and measure success by notifications *acted on*.
- **Inbox file:** `docs/research/inbox/notification-budget-conscience-cap.md`

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | The *measure-acted-on* half serves #6 + R&H #1 (don't nag). The *hard numeric cap* half fights the thesis — it could muzzle a load-bearing drift warning to stay under an arbitrary count. |
| 2 | Evidence grade | Named blogger, reasoned n=1, attention-economy framing (borrowed from engagement-push products). |
| 3 | Duplicate or sharpen? | **Sharpens a known gap.** IDEA-013 gave the conscience a frequency *ledger* (counts fires) + an over-fire smell + a self-throttle that was *deferred*. And v0.65 `relationship.md` already records acted-on / ignored / overrode. This is the design for the deferred outcome dimension. |
| 4 | Serves / harms? | Acted-on measurement serves all cohorts. A blanket cap **harms** by suppressing the one earned, load-bearing nudge that justifies the tool — BOSS's harm model is *inverted* (its fires are predicate-EARNED, not engagement push). |
| 5 | Cost / ceremony | The acted-on read is light (relationship.md already holds it). A budget-aware planner is heavier + risky. |

## Verdict: ADAPT
Borrow the **quality signal — "measure notifications *acted on*, not fired"** — and the *learn-from-
dismiss-vs-act* idea, both of which BOSS is already 80% wired for (the v0.65 relationship log records
exactly landed/ignored/overrode). **Reject the hard numeric daily cap:** BOSS's conscience isn't competing
for engagement, and an arbitrary count would muzzle the earned, load-bearing warning — the inverted harm
model means the cap solves a problem BOSS doesn't have. The earned cap BOSS already has is the *predicate
gate* (it fires only when a real precondition trips), plus per-session once-only, plus the pause primitive.

## If ADOPT / ADAPT
- **What to do:** turn IDEA-013's frequency ledger into an **outcome ledger** — `boss conscience activity`
  reads `relationship.md`'s acted-on/ignored/overrode tags and reports an *acted-on rate* ("you nudged 6×;
  4 landed"). A persistently-low acted-on rate is the honest over-fire smell (better than raw count). The
  relationship voicing (v0.65) already self-calibrates per-moment; this is the portfolio view. → `/boss-learn`
  DOWN. **Completes IDEA-013's deferred self-throttle the humane way: by outcome, not by fiat cap.**
- **Modified from original:** no hard daily cap; "acted-on rate" as a *measured signal*, never a silencer.

## Notes
- Connects IDEA-013 (frequency ledger) + FEAT-022 relationship.md (v0.65). The single most actionable item
  in this sweep.
- BOSS version when recorded: 0.66.0

## Routed via /boss-learn — APPLIED v0.67.0 (2026-06-20)
The ADAPT landed as specified above. See registry/CHANGELOG.md 0.67.0.
