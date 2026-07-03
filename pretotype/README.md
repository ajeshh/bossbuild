# BOSS pretotype — the 60-second browser taste

BOSS pretotypes itself (IDEA-047). One page: paste an idea → one conscience-style pressure-test →
`npx bossbuild`. This is a **demand experiment**, not a product — read [`EXPERIMENT.md`](EXPERIMENT.md)
first; it's the point, and it holds the kill criteria.

> **Not part of the zero-dep CLI.** This lives outside `src/` on purpose — it's a separate web surface and
> may take a dependency (`@anthropic-ai/sdk`). The `boss` CLI stays dependency-free.

## Shape

- `index.html` — the whole front end (inline CSS/JS, BOSS voice, calm not startup-bro).
- `api/pressure-test.js` — one serverless function; one Claude call (`claude-haiku-4-5`, the cheapest
  honest model — this is a volume surface, not a judgment surface).
- `api/event.js` — the Savoia ladder beacon (counts only: copied / install-clicked).

## Run locally

```bash
cd pretotype
npm install
export ANTHROPIC_API_KEY=sk-ant-...      # server-side only — never shipped to the browser
npx vercel dev                            # serves index.html + the /api functions
# then open the printed localhost URL and paste a real idea
```

(Any static host + Node serverless runtime works; Vercel is the cheapest reversible default per BOSS's
own `/ship` logic. `npx vercel dev` is the closest local mirror of production.)

## Security posture (the `/ship` pre-flight, applied to BOSS itself)

- **No client-side key.** The API key is read from the server env only; the browser never sees it.
- **Input caps.** Idea length is hard-capped; empty/short input is rejected; `max_tokens` is capped.
- **No stored user data.** No accounts, cookies, fingerprints, or analytics scripts. Ladder counts are
  plain `console.log` events (idea text is never logged).
- Before any public deploy, run `/red-team`'s pre-ship pass against this surface.

## Deploy

**Do not deploy without Ajesh's explicit go.** When greenlit:

1. `vercel` (link the project), set `ANTHROPIC_API_KEY` as an encrypted env var.
2. Set a **hard $50/month spend cap** in the Vercel project's spend-management settings (the experiment
   budget — see EXPERIMENT.md).
3. Deploy; verify the pressure-test lands on-voice and the caps hold.
4. Watch the ladder in the host's log view. At the review date, write the result as an `EVID` in
   `docs/evidence/`.
