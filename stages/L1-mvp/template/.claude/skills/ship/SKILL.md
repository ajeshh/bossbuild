---
name: ship
description: Put {{PROJECT_NAME}} where a real user can hit it — the CD half of building. Detects the stack, runs a deploy-time pre-flight (no secrets in the client bundle; server-side authz/RLS actually on — the signature vibe-coded-leak surface), picks or confirms the cheapest reversible host, deploys, and hands back the live URL + the rollback path. Stack-neutral (no baked-in target — Vercel / Fly / Railway / Cloudflare / Render / a VPS, learned per project). The pre-flight is a check, not a gate. "localhost is not shipped" — reachability is what turns a pseudo app into one a user can prove. And at the live moment it voices the one leg the conscience otherwise skips — reachable isn't found: "who's the first real user, and how do they hit this?" (once, situation-not-person, points at mentor-gtm — never a marketing nag). Full depth - library/practices/ship-it-live.md. Usage - /ship [--preview | --rollback]
---

# /ship — localhost is not shipped

An app only you can reach is a pseudo app — you can't prove pain, fit, or willingness-to-pay on a thing
no real user can hit. `/smoke` asks *is it alive?*; `/evals` asks *is the AI part correct?*; **`/ship`
asks *can a real user reach it?*** It's the CD half of the build process (`git-workflow` shipped the CI
half). Full discipline: [`ship-it-live`](../../../library/practices/ship-it-live.md).

This is **not** a deploy tutorial. It carries the *judgment* (deploy early, cheap, reversible; don't leak
secrets; know your revert path) and runs the deterministic verbs. The *target* is the project's call.

## When to run it

- The first time {{PROJECT_NAME}} is real enough to put in front of someone — at **MVP**, not at launch.
  (A `/prototype` sketch runs locally; that's correct. Don't deploy a sketch.)
- After a meaningful change you want a real user to be able to hit.
- `--preview` — a throwaway URL for one branch/PR (a reviewer or stakeholder needs to click before merge).
- `--rollback` — put the last-good build back, and surface what rollback does *not* undo (the database).

## How to run it

### 1. Detect the stack (don't assume it)
Read the project — framework, build command, where it expects to run, whether it has a server, a database,
env vars. BOSS bakes in no deploy target (Principle #4). If a host is already chosen (a `PRAC-NNN` /
stack-profile from a past ship, a config file), use it. Otherwise propose the **cheapest reversible** fit
and confirm with the founder before doing anything irreversible.

### 2. Pre-flight — the check with teeth (NOT a gate)
Before handing back a URL, refuse to be *silent* about the #1 way AI-built apps fail at deploy — but never
block the founder's deploy (conscience-not-censor). Surface, then proceed if they choose to:

- **Secrets in the client.** Scan the build output + repo for API keys / tokens / a committed `.env`
  shipping in frontend code. A key in the bundle is public the moment it deploys.
- **Authz at the boundary.** If the app talks to a database with a public/anon key, are the row-level
  security / access rules actually on? The agent does **not** configure them by default — this is the
  CVE-2025-48757 / MoltBook trap (170+ apps, 1.5M credentials, founders who wrote no code).
- **Don't restate the security pass — run it.** This pre-flight is the *trigger*; the depth lives in
  **`/red-team`**'s pre-ship app-security pass (the shipped-secret scan `secrets-guard` doesn't cover)
  and [`agent-security`](../../../library/practices/agent-security.md). A `fail` here is a `/spec` fix
  *before* the public URL, not a backlog item — especially for a non-technical founder who can't spot it.

### 3. Deploy → hand back the URL
Run the deploy. Hand back the **live URL** plainly — that's the proof the work is now reachable. Note what
it cost (free tier vs. paid) so the founder keeps optionality in view.

### 4. Name the rollback path (every time)
State the one command/click that restores the last-good build — and the honest caveat: **rollback restores
the app, not the database.** A migration that already ran does not un-run on rollback. If this deploy
includes a schema change, it should be backward-compatible (expand-migrate-contract — see
[`scalable-architecture`](../../../library/practices/scalable-architecture.md)) so a code rollback never
strands the data.

### 4b. Risky or AI-mediated? Offer the kill switch (a check, not a gate)
If this deploy is a **risky or AI-mediated feature** — an LLM in the user path, a payment flow, anything that
fails non-deterministically in production — *offer* (never impose) to ship it **behind a flag**: dark (off), or
to a small % of users, with a **kill switch** you can flip in seconds. Why it belongs here: a flag is the
**fast application-layer rollback step 4 says a code-deploy rollback doesn't give you** — an AI feature
hallucinating for your whole user base needs a *toggle* (seconds), not a redeploy (minutes). **Zero-ceremony
first:** the honest version is an env var / a `const FLAGS = {…}` boolean and one `if` — not a platform. For an
AI feature, put the model/prompt/params *in* the flag so a bad model swap (which CI/CD never sees) rolls back
without a deploy — "flag the model, not just the feature." Full judgment + the env-var-first ladder:
[`feature-flags`](../../../library/practices/feature-flags.md). Offer once, suggestive; a founder shipping a
plain static page doesn't need it — skip.

### 5. Capture the recipe (feed the loop)
First ship of a new stack? The host + deploy command + rollback path + env boundary is a stack-profile
output worth keeping — offer to capture it as a `PRAC-NNN` (`/practice`) so the next project of this kind
starts from a known-good deploy recipe instead of rediscovering it (Principle #4).

### 6. One more thing — who finds it? (the demand voicing, once)
Reachable is the line between a pseudo app and a real one — but **reachable isn't found.** This is the one
leg of a real-value app the conscience otherwise never voices: *"will anyone pay?"* gets asked in the flow;
*"will anyone ever find it?"* doesn't. So at the moment it goes live — and only then — name the cost once:

> **It's reachable now. Who's the first real user, and how do they hit this?**

Keep it the *demand* question, not a marketing checklist. Ask *who specifically* and *what's the one channel
to them* — that's the n=0 risk itself. Do **not** turn it into "have you posted on Product Hunt?" (that's the
growth-hacking nag that repels the founders BOSS most wants). **Describe the situation, never the person** —
it's about the work's path to a user, never a judgment that the founder hasn't hustled. Say it once, point at
`mentor-gtm` for the depth, and drop it — a founder who's already got a first user or who's deliberately not
distributing yet hears it and moves on. Never a gate.

## Cohort-aware

- `first-product` / `vibe-coder-newbie` — plain language; the pre-flight is **non-negotiable** (they can't
  spot a leaked key themselves) but framed as protection, not a scolding. Default to the simplest host with
  the most forgiving free tier.
- `non-tech-founder` — lead with "here's your live link" and the one-line rollback; keep the secrets check
  but explain *why* in their terms (your users' data is reachable if this is wrong).
- `eng-builder` / `returning-founder` — terse; assume they know deploy mechanics, lead with the pre-flight
  findings and the rollback caveat, skip the hand-holding.
- `indie-hacker` and any anti-growth-hacking founder — the **demand voicing (step 6) needs the lightest
  touch**: this cohort flees a marketing nag. Ask the genuine first-user question, never the channel-checklist;
  if they've clearly already got a user or a deliberate no-distribution stance, skip it entirely.

## Rules

- **Stack-neutral.** No baked-in target. Detect, propose the cheapest reversible fit, confirm. The host is
  learned per project, captured UP, never assumed.
- **The pre-flight is a check, not a gate.** It surfaces the secrets/authz risk and points at the fix; it
  never blocks the deploy. (Conscience-not-censor.)
- **Hand back the real URL.** "It deployed" is not the result. The URL a user can hit is.
- **Reversibility is part of shipping.** No deploy without a named revert path, and an honest word that the
  database isn't part of it.
- **Offer the flag, don't impose it.** For a risky/AI-mediated deploy, offer to ship it dark / behind a kill
  switch (env-var-first) — the fast app-layer rollback a code-deploy rollback doesn't give. A check/offer, once;
  never a gate, and skip it for a plain static ship. (See `feature-flags`.)
- **JIT.** Don't deploy a `/prototype` sketch. Reachability discipline turns on at MVP, when validation
  needs an artifact a real user can reach.
- **Graceful when there's nothing to ship.** If the project has no deployable artifact yet, say so and point
  at what's missing — don't invent a deploy.
- **The demand voicing is once, suggestive, and situation-not-person.** Reachable → discoverable: name the
  first-user question at the live moment, point at `mentor-gtm`, drop it. It's the demand question, not a
  marketing checklist, and never a judgment of the founder. (Closes the distribution-leg asymmetry IDEA-041
  named — voiced at the `/ship` moment rather than as an unprompted hook.)
