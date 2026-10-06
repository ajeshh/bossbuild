---
id: PRAC-002
type: practice
owner: "@ola"
status: active
created: 2026-09-19
applies_to: shipping Kettlewick (the stack profile /ship reads)
review_by: 2027-03-19
---

# PRAC-002 — How Kettlewick ships: the stack profile

## What we learned
The recipe, written down at the FEAT-007 ship, so the next ship starts from it instead of from Ola's
memory of 2026-08-28.

- **Shape:** a web app. "Shipped" means a live URL an owner opens on her phone.
- **Build:** `npm ci && npm test && npm run build`, inside the `Dockerfile`'s first stage.
- **Run:** `node src/server.ts` serves `dist/` and the one route with a secret (`/api/ask/draft`).
- **Host:** a small container host, one instance, the cheapest tier that doesn't sleep. Reversible
  in an afternoon: anything that runs the image works.
- **Environment (server only, never in the bundle):** the texting key; `ASK_MODEL`,
  `ASK_PRICE_IN_PER_M`, `ASK_PRICE_OUT_PER_M`, `ASK_TIMEOUT_MS`, `ASK_DAILY_CAP_USD` and the model
  key (FEAT-007).
- **Smoke gates the deploy:** `npm run smoke` (`.boss/smoke.json`), then CI runs tests, smoke, the
  token check and the build on every push.
- **Live check:** fetch `/healthz` on the live URL and open the day view on a phone, before saying
  it shipped. The image's own health check calls `/healthz` too.
- **Who hears at 3am:** an external uptime check on `/healthz` every five minutes texts Ola's phone.
  The host's log page is the second place to look.
- **Deploys:** by hand. Deploy-on-push was offered at this ship and declined: Ola wants the card
  form live before a push can reach owners on its own. Ask again then.
- **Rollback:** redeploy the previous image from the host's list. It restores the app, not the
  data; no migration has run since 2026-08-28, and FEAT-007's two columns are nullable.
- **Kill switch for the model:** unset `ASK_MODEL`. Every ask falls back to the template at once,
  no deploy (`draftAsk` returns the template when no model is set).

## Why it works
Every step that was a judgment on 2026-08-28 is now a line, and the two that weren't decided then
(who hears, and the kill switch) are decided.

## How to apply
Run `/ship`; it reads this first. Change a line here when the recipe changes, not after.
