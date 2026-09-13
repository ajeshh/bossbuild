---
id: IDEA-050
type: idea
owner: product-lead
status: shipped (v0.125.0, 2026-07-23 — post-launch program build #7a)
program: post-launch
proof: library/practices/first-dollar.md
created: 2026-07-02
source: fable-campaign lifecycle pass (Fable 5, 2026-07-02 — "what about the first paid customer?")
---

# IDEA-050 — The first-dollar moment: from "will anyone pay?" to "someone is paying"

## The gap

The conscience's founding question is *"will anyone pay?"* — and BOSS has **nothing for the moment someone
actually will.** Taking a first dollar is a cluster of real-world moves the build tooling never touches:
a legal entity (in most places you can't lawfully invoice without one), terms of service + privacy policy,
a payment rail, a refund posture, a price you can say out loud. Founders stall *at the moment of maximum
validation* because the money mechanics feel like a different universe from the codebase. This is the
sharpest JIT moment in the whole lifecycle — and the highest-grade evidence event BOSS will ever see:
**a paid customer is a commitment-grade EVID by definition** ([[IDEA-045]]).

## The shape

A deliberate-invoke skill (`/first-dollar`) + one practice, landing at MVP→V1:

1. **The checklist that isn't ceremony** — five questions, each with a "you can defer this if…" honesty
   line: entity (pointer to real counsel/registered-agent services, never legal advice — the `/decide`
   bright line extends here), ToS/privacy (template-pointer + "a real lawyer before real scale"), payment
   rail (the `/ship` pattern applied to money: cheapest reversible — a payment link before a billing
   system), refund posture (decide it *before* the first refund request), the price (one number, said out
   loud — points at `mentor-business`'s tier menu but forces the *first* number now).
2. **The evidence capture** — the skill's last act: write the commitment-grade EVID. First revenue is the
   single data point the entire canvas has been waiting for; it must not evaporate like the interviews did.
3. **The conscience inflection** — after a first-dollar EVID exists, the drift/caution voicings shift
   register from *validate* to *deliver* ("someone is paying — is what they paid for actually working for
   them?"). No new hook; the existing bounded read already sees the ledger ([[IDEA-045]] built that eye).
4. **UP practice**: `library/practices/first-dollar.md` — the checklist + the traps (charging before the
   entity exists; free-forever creep because asking is scary; the Stripe-account-in-personal-name mess).

## Bright lines

- Never legal/tax advice — every regulated item is a *pointer at a professional* with the questions to ask
  them ([[IDEA-052]]'s brief pattern). BOSS prepares the founder for the expert; it never plays the expert.
- Never a revenue dashboard, never MRR tracking — that's the founder's payment provider's job. BOSS records
  the *event* (evidence), not the *stream* (analytics).

## Trigger

**Ready-adjacent, not deferred:** buildable the moment any BOSS project (including a founder-friend's) has
a real WTP signal — one person who said yes. Cheap (skill + practice, zero `src/`). Do not build before the
first "yes" exists anywhere; the checklist content should be shaped by a real first-dollar attempt, not
imagined (Principle #2 + the RVW-001 anti-rot rule).

## OPUS HANDOFF PROMPT (run only when the trigger fires)

```
You are implementing IDEA-050 (/first-dollar) for BOSS. Repo: ~/Projects/bossbuild.
Read CLAUDE.md, docs/RESUME.md, docs/ideas/IDEA-050-first-dollar-moment.md, the /ship skill
(the pattern this mirrors: pre-flight + cheapest-reversible + hand back the proof), and
library/practices/ship-it-live.md first. CONFIRM WITH AJESH that a real WTP signal exists
before building — if not, stop and say so.

TASKS
1. New practice library/practices/first-dollar.md: the 5-item checklist (entity / ToS+privacy /
   payment rail / refund posture / the first price), each with its "defer if…" honesty line and
   its named trap; hard bright-line header: pointers to professionals, never legal/tax advice.
2. New L1/MVP skill /first-dollar (stages/L1-mvp template): walk the checklist JIT (detect what
   already exists — a Stripe link in the repo, a ToS page — and skip it); cheapest-reversible
   bias (payment link before billing system); end by writing the commitment-grade EVID via the
   IDEA-045 schema (if 045 unshipped, output the draft inline + TODO seam); point at
   mentor-business for pricing depth. Check-not-gate throughout.
3. Conscience register shift: in the voicing guidance where the evidence-ledger read lands
   (IDEA-045's integration point), add the one-line register rule: commitment-grade EVID with
   method=first-dollar present → voicings shift from validate to deliver. No new hook. If the
   voice frame changes materially, moments.js hash discipline applies — note if a regrade is due.
4. Wayfinding (boss map + GUIDE one-liner), VERSION minor bump + registry/CHANGELOG.md entry,
   /tmp smoke test per CLAUDE.md rule 6 (skill lands on boss unlock mvp, 0 placeholders), clean
   /tmp + prune registry/projects.json. Do not commit unless asked.
```
