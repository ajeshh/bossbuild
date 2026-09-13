---
id: IDEA-047
type: idea
owner: product-lead
status: deferred (re-aimed keyless 2026-09-13 — the fake door, no model, no key. Re-open when a source of strangers exists — the plugin listed in claude-community, or Phase 3 outreach live — AND installs stay flat; a door with no traffic measures nothing)
program: public-surface
proof: pretotype/index.html
proof_note: Built and still unreachable, but no longer WRONG. v0.194.0 found its single call to action reading `npx bossbuild` — a package that no longer exists — because check:site only ever scanned web/ and this public page lives outside it. Fixed, and the scan now covers it. Both original blockers are gone (oyeboss is published; the domain was registered 2026-08-20); what remains is the deploy itself, which is not a build task.
created: 2026-07-02
source: fable-campaign step-back (Fable 5 deep read, 2026-07-02)
---

# IDEA-047 — BOSS pretotypes itself: the 60-second browser taste

## The gap

BOSS ships `/pretotype` (Savoia) and **has never run it on BOSS**. The v0.3 canvas says the remaining risk
is 100% demand and "building more is definitionally building around the risk" — with one exception this
canvas itself licenses: **a build whose purpose is to measure demand.** Today a founder cannot *feel* the
conscience without installing Node, cloning a repo, and opening Claude Code. The funnel starts behind a
terminal wall (canvas Risk #7). BOSS needs the thing it tells founders to make: the smallest experience of
the core promise that a stranger can touch in 60 seconds.

## The shape

One static-ish page (the pretotype discipline: cheapest thing that measures, not a product):

1. Founder pastes their idea (a sentence or a paragraph).
2. They get back a **humane-canvas pressure-test in miniature** — who's it for, what's the tension, what's
   the riskiest assumption — ending with **one conscience-style question** in BOSS's voice (the seasoned
   hand: *"who would you talk to first to find out if this is real?"*). One taste of the actual
   differentiator, not a feature tour.
3. Close: *"This lives in your terminal, with a mentor board behind it — `npx bossbuild`."* + the repo link.

**Instrumented as a pretotype, not a launch:** the metrics are Savoia's skin-in-the-game ladder — did they
paste a real idea (vs. lorem ipsum)? did they copy the output? did they click through to install? did
anyone come back with a second idea? Counted server-side or via the simplest honest mechanism available —
**no tracking beyond the count** (BOSS's no-telemetry stance applies to BOSS's own funnel too; count
events, never identify people).

## Positioning notes

- This *is* the distribution leg PRINCIPLES names and IDEA-041 voiced: reachable → discoverable, applied
  to BOSS itself.
- The domain question (boss.build pending) is adjacent but not blocking — the pretotype can live on any
  URL; a pretty domain is polish, and polish before signal is the exact trap.
- Model cost: each pressure-test is one short LLM call. Start with the cheapest honest model; this is a
  volume surface, not a judgment surface (per the [[IDEA-014]] routing rule).
- **The one open product question** (decide before building): keyed or keyless? A serverless function with
  a metered key is the simple answer; a "bring your own Claude" mode is the zero-cost answer but re-erects
  the terminal wall. Recommend: metered function + hard monthly cap, treat the cap as part of the
  experiment budget.

## Guardrails

- It is a **pretotype**: if 200 strangers touch it and nobody installs, that's the answer — kill it and
  update the canvas. Success criteria written down *before* it ships (Savoia's own rule).
- Never grows features. No accounts, no saved state, no "try the mentor board too." One taste.
- The v0.3 canvas experiment (watch 1–3 real founders) still outranks this — the pretotype widens the
  funnel; it doesn't replace watching a real session.

## OPUS HANDOFF PROMPT

```
You are implementing IDEA-047 (BOSS pretotypes itself — the 60-second browser taste).
Repo: ~/Projects/bossbuild. Read docs/ideas/IDEA-047-boss-pretotypes-itself.md,
PRINCIPLES.md, and the /pretotype skill in stages/ first. NOTE: this is the one campaign
item that is NOT inside the zero-dep CLI — it's a separate tiny web surface. Keep it OUT
of src/ entirely; put it in a new top-level pretotype/ directory (or a separate repo if
Ajesh prefers — ASK via a single question before scaffolding).

BEFORE BUILDING, confirm with Ajesh: (a) hosting target (the /ship skill's cheapest-
reversible-host logic applies to BOSS itself here), (b) keyed serverless function vs
static-only mock, (c) the monthly cost cap. Do not proceed without these three answers.

TASKS (assuming keyed serverless)
1. pretotype/index.html — one page, BOSS voice, no framework needed: an idea textarea,
   a "pressure-test it" button, an output card, the npx bossbuild close. Design: calm,
   not startup-bro (the boss board --html aesthetic precedent). No accounts, no cookies,
   no analytics scripts.
2. pretotype/api (one serverless function for the chosen host): takes the idea text,
   calls the Claude API ONCE with a prompt built from the Humane Product Canvas spine
   (who's served / what tension / riskiest assumption) + ONE conscience-style closing
   question in BOSS's voice — derive the voice from library/practices/conscience-voicing.md
   and the canvas skill, ~40 lines of prompt max. Use the cheapest current model per the
   /claude-api skill (check it — do not hardcode from memory); hard per-request token cap;
   hard monthly spend cap via the host's limits.
3. Counting (Savoia ladder, no identification): increment plain counters for
   pasted-real-idea (len>80), output-copied (client event), install-link-clicked.
   Simplest honest mechanism on the chosen host; no IPs stored, no fingerprinting.
4. Write pretotype/EXPERIMENT.md BEFORE shipping: hypothesis, the ladder metrics, success
   thresholds, kill criteria, review date (2-4 weeks). This file is the point — the page
   is just its instrument.
5. Security pass: the /ship skill's pre-flight applies — no client-side API key, rate
   limiting on the function, input length caps. Run /red-team's pre-ship pass against it.
6. BOSS bookkeeping: this experiment gets an EVID entry in BOSS's own docs/evidence/ when
   results land (seam only for now). CHANGELOG entry + VERSION bump only if any shipped
   BOSS surface changed; otherwise log it in docs/RESUME.md as an experiment, not a release.
7. TEST: run locally end-to-end with one real idea; verify the conscience question lands
   on-voice (read it aloud against the voice-keeper bar); verify caps work.
Do not deploy without Ajesh's explicit go. Report file-by-file.
```

## Re-aim — 2026-09-13: no key is coming, so the wizard becomes a fake door

Ajesh: *"we are not gonna get an anthro key — need to rethink approach."* The July build was a
**wizard-of-oz** pretotype: a real model behind `/api/pressure-test`, so a stranger got a live read.
That shape needs a key, a spend cap and a WAF rule, and has sat ten weeks on that gate. Savoia's
cheaper rung is the **fake door**, and it measures the same thing — *does a stranger want this
enough to take the next step* — without a model in the loop:

1. **Drop `pretotype/api/`.** No call, no key, no cost, no failure states to design, no WAF.
2. **Keep the page and the paste box.** On submit, no model runs: the page shows **one recorded
   pressure-test** of a sample idea — produced honestly once, in BOSS's voice, and **labelled as a
   recording** (*"this is what BOSS said about a real idea; yours runs inside Claude Code"*). A
   recording presented as live would be the dark pattern BOSS catalogues; the label is the whole
   difference.
3. **The next step is the plugin.** The CTA becomes the one-line plugin install (DEC-017) — the real
   taste runs on the founder's own Claude Code, on their own access, which is where BOSS lives anyway.
   `npx oyeboss` stays as the second door.
4. **Measure the click, nothing else.** The ladder in `EXPERIMENT.md` already counts
   `install-link-clicked` server-side; without an API the page has no server, so the count moves to
   the host's edge analytics (Cloudflare's own, no cookie, no identification) or is dropped and the
   install count on the registry side stands in. Counts only — the record's original rule.

What this loses: the *personalised* moment. What it keeps: the 60-second feel of the conscience's
voice, and a demand number Ajesh can read. **Held, 2026-09-13 (Ajesh: *"keep it for a later time"*):** a fake door measures what strangers do,
and the site has no strangers yet. Re-open trigger: **a source of strangers exists** — the plugin
listed in `claude-community`, or Phase 3 outreach live — **and the install count stays flat.** That is
the moment the question *what did a visitor see, and why didn't they step through* is worth an hour.
Until then the plugin listing's own description is the taste. Deploy, when it comes, is the ordinary
site redeploy — no key, no cap.

## Implementation notes (2026-07-02) — BUILT, NOT DEPLOYED (the wizard shape; superseded above)

Ajesh answered the 3 blocking questions → "build with Fable's defaults." Resolved defaults noted:
**keyed serverless**, **host = Vercel** (cheapest reversible per `/ship`), **cap = $50/mo** (platform
spend limit). Built as a separate top-level `pretotype/` surface, entirely OUTSIDE `src/` (the zero-dep
rule is src-only; this surface takes `@anthropic-ai/sdk`). File-by-file:
- **`pretotype/index.html`** — one page, BOSS voice, calm (cream/serif/terracotta, not startup-bro):
  idea textarea → "pressure-test it" → output card → `npx bossbuild` close. No accounts, cookies, or
  analytics scripts. Client-half Savoia ladder via `navigator.sendBeacon` (copied / install-clicked).
- **`pretotype/api/pressure-test.js`** — the one serverless call. `claude-haiku-4-5` (cheapest honest
  model per the live `/claude-api` table — this is a demand-**volume** surface, not judgment; matches
  IDEA-047's "cheapest honest model" + the campaign routing rule). ~40-line system prompt = Humane
  Product Canvas spine (who / tension / riskiest assumption) + ONE conscience-style question in BOSS's
  voice, derived from `conscience-voicing.md` + the canvas skill. Caps: idea ≤2000 chars, `max_tokens`
  600, POST-only, empty-key honest-fail.
- **`pretotype/api/event.js`** — ladder beacon; allow-listed rung names → `console.log` counts only. No
  idea text, no IP stored by us, no fingerprint.
- **`pretotype/EXPERIMENT.md`** — written BEFORE shipping (Savoia's rule): hypothesis (attacks Risk #7 +
  n=0), the 3-rung ladder, success/kill/iterate thresholds over ~200 real attempts, review date
  **2026-07-30**, honest limits, the $50 cap. **The result lands as an `EVID` in `docs/evidence/`
  (IDEA-045) at review** — seam named, not yet wired (no results until deployed).
- **`pretotype/package.json`** / **`.gitignore`** / **`README.md`** — run-locally + deploy steps; the
  "do not deploy without Ajesh's go" gate is loud in both README and this file.

**Security (the `/ship` pre-flight on BOSS itself):** no client-side key (server env only — verified),
input length caps, no stored user data. **`/red-team` pre-ship pass DONE** (in-session adversarial review,
commit `28e6b2c`): no security-critical issues — key isolation, XSS (textContent throughout), crash
handling, per-call cost bounds all verified clean. Two real findings fixed: **HIGH** — added a coarse
per-IP rate limiter (8/min, best-effort) because the $50 cap is a billing kill-switch not a rate limiter
(documented in EXPERIMENT.md; a Vercel WAF `/api/*` rule is the robust layer, still needed for high
traffic); **MEDIUM** — the Savoia beacon now sends a typed `Blob` so ladder counts don't silently
undercount. **Remaining deploy gate: Ajesh's key + spend cap + the WAF rule.**
**No VERSION bump / no CHANGELOG entry** — no shipped CLI surface changed (per the handoff rule); this is
an experiment, logged in `docs/RESUME.md`, not a release. **Verified locally:** both functions
`node --check`-clean, no secret in the client HTML, key read only via `process.env`, caps + cheapest
model present. **NOT verified:** the live end-to-end model call + on-voice read + real spend cap — those
need Ajesh's key and his deploy go (deliberately gated).

## Re-grade 2026-09-09 — parked, because the remainder is not a build task

This record's own `proof_note` says it: *"what remains is the deploy itself, **which is not a build
task**."* Both original blockers are gone — `oyeboss` is published and the domain is registered and
serving. The code is written, `/red-team`-passed, and guarded.

**`building` was claiming an engineer's attention that nothing here needs.** Parked with the
re-open trigger written plainly: **Ajesh deploys** (his key, his spend cap, the Vercel WAF `/api/*`
rule). Nothing about this is underdeveloped — it is finished and waiting on one hand that is not an
assistant's. That is what `deferred` is for.
