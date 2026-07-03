---
id: EXP-001
type: experiment
owner: pm
status: ready-to-run
created: 2026-07-02
review_by: 2026-07-30
---

# The BOSS pretotype experiment (IDEA-047)

**This file is the point. The page is just its instrument.** BOSS ships `/pretotype` (Savoia) and had
never run it on BOSS itself. This is that pretotype — and, like every pretotype, its success criteria are
written down *before* it ships (Savoia's own rule).

## Hypothesis

If strangers who feel the "I can build, but is it *real*?" tension get a 60-second taste of BOSS's
conscience — one sharp, on-voice pressure-test of their own idea — a meaningful fraction will want the
real thing (`npx bossbuild`). This attacks the two live risks at once: **Risk #7 (the terminal wall** — is
a CLI-shaped tool reachable by its audience?) and **n=0** (the demand gap the whole canvas turns on).

## What it is / isn't

- **Is:** one page. Paste an idea → one Claude call (cheapest honest model) → a Humane-Product-Canvas
  pressure-test + one conscience-style question → the `npx bossbuild` close.
- **Isn't:** a product. No accounts, no saved state, no "try the mentor board too," no second call. One
  taste. It never grows features (that's the trap this pretotype exists to *avoid* funding).
- **Does not replace** the v0.3 canvas experiment (watch 1–3 real founders). The pretotype widens the
  funnel; watching a real session is still the higher-signal move and still outranks this.

## The ladder (Savoia skin-in-the-game — counts only, no identification)

| Rung | Event | What it means |
|---|---|---|
| 1 — attempt | `pasted-real-idea` (idea > 80 chars) | Someone gave a real idea, not a poke. |
| 2 — value landed | `output-copied` | The pressure-test was worth keeping. |
| 3 — intent | `install-link-clicked` | They went looking for the real thing. |

Counts are emitted to server logs (`console.log`) and read from the host's log view. **No IPs stored by
us, no cookies, no fingerprint, no analytics scripts.** The platform's own request logs are the only
lower layer, and we don't join against them. This is honest but coarse — see *Honest limits* below.

## Success thresholds (decide before running)

Over the first **~200 real attempts** (rung 1):

- **Kill** if `install-link-clicked / pasted-real-idea` < **3%** *and* `output-copied` < **20%** — the
  taste isn't landing and isn't pulling. That's a real answer: update the canvas, don't iterate the page.
- **Iterate** if copy-rate is healthy (≥20%) but install-clicks are weak (<3%) — the pressure-test lands
  but the CTA/wall doesn't convert. The wedge is the *close*, not the conscience.
- **Advance** if install-clicks ≥ **3%** of real attempts — enough signal to justify watching where those
  clicks actually go (do they install? that's the next, harder pretotype).

If fewer than ~50 real attempts arrive in the window, the honest reading is **distribution, not
conversion** — the page didn't reach anyone, which is Risk #7 restated. Kill or re-place; don't tune copy.

## Review date

**2026-07-30** (≈4 weeks). At review, record the result as a **commitment/observed-behavior `EVID`** in
BOSS's own `docs/evidence/` (IDEA-045) — this experiment's outcome is exactly the kind of signal that
ledger exists to hold, and a pretotype result that evaporates is the failure IDEA-045 was built to stop.

## Honest limits (say them out loud)

- Log-based counts can't dedupe a person hitting refresh, can't tell a bot from a founder, and can't
  follow a click past the repo link. It measures *interest*, not *installs* — the install itself is the
  next pretotype, not this one.
- A pretotype answers "is there pull?", never "will it retain?" A high install-click rate is permission
  to do the expensive experiment, not proof of a business.

## Cost cap (part of the experiment budget)

Hard monthly ceiling: **$50** at the platform level (Vercel spend limit). Each pressure-test is one short
Haiku call (~600 output tokens max) — a fraction of a cent — so $50 comfortably covers thousands of real
attempts. If spend approaches the cap, that itself is a strong demand signal worth surfacing, not just a
bill to pay. Per-request `max_tokens` is also capped in code as a second guard.

**Honest limit on the abuse posture (from the pre-ship red-team):** the $50 cap is a **billing
kill-switch, not a rate limiter** — when it trips it can pause the deployment, so an abuser can't run up an
unbounded bill but *can* knock the page offline for real users (a cheap DoS), and organic traffic can hit
it too. There are two real guards: (1) per-call cost is bounded (`max_tokens` 600 + 2000-char input cap);
(2) a coarse per-IP sliding-window limiter in `api/pressure-test.js` (8 req/min/IP) raises the cost of
casual scripted abuse. That limiter is **best-effort** — serverless instances don't share memory, so a
determined abuser spreading across instances gets past it. Before any high-traffic exposure, add a **Vercel
WAF / platform rate rule on `/api/*`** as the robust layer. For a throwaway demand-measurement page behind
a spend cap, this is an accepted, stated posture — not an omission.
