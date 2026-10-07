---
domain: model
for: has the SHAPE of the model tradeoff moved — not which model is newest
kinds: event "<what changed>" · (no event — walk all four)
open_first: library/practices/model-routing.md (the three capability shapes), the host's own current docs (never memory), `boss conscience activity`
verify_by: the host's documentation read today; for voice-affecting moves, the keyless judgment regrade (`/regrade`) — never a paid key
lands: a sentence in model-routing.md and a CHANGELOG bullet when a shape moved; a devlog line when nothing did
ages: event-fired only — 90-day curve for the practice
sensitive_when: never names a model in anything shipped
---

# `/scout model` — ride the model curve on purpose

BOSS's own domain. Was `/recalibrate`. BOSS pins no model names anywhere it ships (since v0.135.0),
so **a new model shipping is not an event** — a new model with the same shape changes nothing. What
deserves a pass is the shape of the tradeoff moving, which is rare.

## The four events

1. **A new tier moves a shape** — "cheap-bulk" or "deliberation" now means something different.
2. **A new axis appears on the host** — e.g. effort levels on skills and subagents: deliberation as
   effort on the same model, not a different model.
3. **A second host** resolves the shapes differently (IDEA-006).
4. **A frequency-ledger anomaly** — a judge-moment over- or under-firing.

## The walk

(a) Re-read the three shapes against what the host offers today; one line each — *unchanged* or
*moved, because ___*. (b) The effort axis: bind it **nowhere shipped** — the prose in
`model-routing.md` already carries the intent to any host. (c) If anything voice-affecting moved,
run `/regrade` (keyless, in-session) and investigate every flipped call; `npm run eval:judgment` must
show GRADED, 0 STALE, 0 REGRESSION. (d) Read `boss conscience activity`. (e) Record: edit the
sentence and add a bullet under `## Unreleased`; if nothing moved, a devlog line and stop — the
common, correct outcome.

**Never:** name a model in anything shipped; create `.boss/model-profile.json` to satisfy a
reference (it is where a binding would go *if one existed*); fire on a launch. Host-degrade machinery
waits for a real second host.
