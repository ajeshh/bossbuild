---
id: IDEA-105
type: idea
owner: product-lead
status: deferred (trigger: `check:reach` shows a human count that stays inside the crawl band for a month, or a founder asks "how many people use this")
gist: The public counters (`npm run check:reach`) can estimate installs and never see a running one; the only instrument that could is a phone-home, and `/feedback` ships "never background telemetry" — so whether to point `boss update`'s version check at a host with logs is a DEC, not a script.
proof: none
proof_note: Would exist as a DEC record with the disclosure/opt-out shape decided, and a `latest.json` on a host that counts unique IPs; until then the ledger is `.boss/reach.jsonl`.
created: 2026-09-13
---

# IDEA-105 — Seeing a running install

## Current shape

`npm run check:reach` (v-unreleased, 2026-09-13) reads what exists without asking anyone:
npm downloads with the crawl floor subtracted, the repo and tap 14-day traffic, stars/forks/issues,
appended to `.boss/reach.jsonl` per run. First read: **≈4 human installs last week, inside the
crawl band** — 0 stars, 3 unique viewers, 17 machines with the tap (Ajesh's included).

None of that can see a *running* install. `src/update.js` already hits
`registry.npmjs.org/oyeboss/latest` on `boss update` — a metadata GET npm does not count. The
only way to count running installs is to point that check at a `latest.json` on a host with
access logs (unique IPs per day). That is a phone-home.

## Open question

- **Is a version-check request to a host we control "background telemetry"?** `/feedback`'s shipped
  promise is *"never background telemetry"* and *"shows you exactly what it will send before
  anything leaves your machine."* A GET with no payload beyond the request itself is the narrowest
  possible form, and it is still a request the founder did not ask to send. If yes: disclose in
  README, no payload, opt-out flag, and a DEC record. If no: the ledger stays an estimate. Not
  decided; nothing built.

## Found alongside (2026-09-13)

- `/feedback` ships `gh issue create --repo ajeshh/bossbuild` and a prefilled `issues/new` link.
  A private `bossbuild` turns both into a 404 for a stranger. `check:reach` flags it; the fix, if
  the repo goes private for real, is a public issues-only repo or the link removed.

## Capture log

- 2026-09-13 — Ajesh: *"because there is no gatekeeping, i have no way of seeing how many people
  install boss"* → the counters wired as `check:reach`; the phone-home parked here as a question.
