---
name: trust
description: Earn trust honestly — the AI-specific privacy/compliance load-bearing set, without the SOC2 theater. Walks the pieces that actually matter first: a data-minimization privacy policy (what you collect, why, how long, how to delete) + ToS + a real retention/deletion path; a subprocessor list auto-derived from what the app actually uses (LLM provider, vector DB, observability); the config act that founders skip — "did you actually turn on the provider's training opt-out?" (an act, not a promise); and a public trust-page stub. Explicitly DEFERS SOC2 / ISO / DPIA until a NAMED enterprise deal demands them (the 9-month clock — don't start it for a 50-user app). Bright line: pointers to a real lawyer, never legal advice. Humane — privacy as respect; the trust page as honesty; "the AI did it" is not a legal defense (Air-Canada). Usage - /trust
---

# /trust — earn it honestly (privacy + compliance, JIT, no theater)

The load-bearing trust set for an AI product, in the order that actually matters — and pointedly *without* the
compliance theater a 50-user app doesn't need. `/ship`'s pre-flight points here; `/money` hands off the
ToS/privacy piece here; `/money`'s graceful-offboarding (data export) lives here too.

> **Bright line:** every legal item is a **pointer at a real lawyer** with the questions to ask — never advice.
> BOSS prepares the founder for counsel; it never plays counsel.

## Step 0 — the JIT gate (fire on the real trigger, not a milestone)

Each piece has its own trigger; do the one that's live, defer the rest:
- **First PII collected / user input sent to an LLM** → the privacy policy + the provider opt-out (Steps 1–3).
- **First B2B deal** → a DPA (pointer to counsel).
- **First *named* enterprise deal that asks** → *only then* start SOC2 (Step 5). **Not before.**

If none of these is true yet (no PII, no users, purely local), say so — this is premature, come back at the
first real user-data flow.

## Step 1 — the data-minimization privacy policy (the one that's always load-bearing)

The moment you collect PII or send user input to a model provider, you need a **privacy policy** — and the honest
one starts from **data minimization**: collect the least you can, say so plainly. Name, in plain language:
- **What** you collect (and what you *don't*), **why**, and **how long** you keep it.
- **The deletion path** — how a user gets their data removed (and that it actually works, not just a promise).
- **Who it goes to** — which leads straight to the subprocessor list (Step 2).
Write it to `docs/trust/PRIVACY.md`. A real lawyer reviews it before real scale; the draft is yours now.

## Step 2 — the subprocessor list (auto-derived from what you actually use)

Every third party that touches user data is a **subprocessor**, and listing them is both honest and increasingly
required. Derive it from the app itself — don't imagine it:
- **The LLM provider** (Anthropic / OpenAI / …) — user input goes here.
- **The vector DB / data store** (if RAG or storage) — embeddings + content.
- **Observability / analytics** (PostHog, Sentry, LLM-tracing) — traces may contain user data.
- Auth, email, payments, hosting — anything that sees user data.
Write `docs/trust/SUBPROCESSORS.md`. This is the list an enterprise buyer *will* ask for, and it's five minutes
now versus a scramble later.

## Step 3 — the provider training opt-out (a config ACT, not a promise)

The one founders skip: **did you actually configure your model provider's data/training opt-out?** Writing "we
don't train on your data" in the privacy policy while the provider's default *does* is the exact gap that turns
into a breach headline. This is a **config act** — go turn it on (the provider's data-controls / zero-retention /
no-training setting), confirm it, and note *where* it's configured. **"The AI did it" is not a legal defense**
(Air-Canada) — the posture has to be real, not stated.

## Step 4 — the public trust-page stub

A single honest page a user or buyer can read: what you collect, your subprocessors, your security posture in
plain terms, and how to reach you about data. Not a compliance badge wall — an honest paragraph. Stub it in
`docs/trust/TRUST.md` (and, when you have a site, publish it). Honesty *is* the trust artifact.

## Step 5 — what you DEFER (name it, so the theater doesn't start early)

- **SOC2 / ISO 27001** — start **only when a named enterprise deal demands it** (it's a ~6–9 month, real-money
  clock). Doing it speculatively for a 50-user app with no enterprise pipeline is the exact premature ceremony
  BOSS refuses (Principle #2). When a real deal names it, *then* it's the highest-leverage thing you can do.
- **DPIA / formal data-protection assessments** — trigger on genuinely sensitive/large-scale processing, with
  counsel; not a default.
- **A compliance/audit *platform*** (Vanta / Drata) — point at it *when* SOC2 is real; don't subscribe early.

## The humane line (PRINCIPLE #6)

- **Privacy as respect, not compliance.** Data minimization is the humane default *and* the cheapest posture —
  the data you don't collect can't leak, can't be subpoenaed, and can't be misused.
- **The trust page is honesty**, not marketing. If you can't say it plainly, don't do it.
- **Liability names the stakes.** "The AI did it" protects no one; the founder owns what the product does. That's
  not a threat — it's the reason to make the posture real.

## Output

Files under `docs/trust/`: `PRIVACY.md`, `SUBPROCESSORS.md`, `TRUST.md` (stub), and a note recording **where the
provider training opt-out is configured** (and that it's confirmed on). A short summary of what's done vs.
deferred (and the trigger that would un-defer SOC2). Record load-bearing calls (retention period, opt-out) as
`/decide` DECs.

## Cohort-aware
- `first-product` / `vibe-coder-newbie`: the privacy policy + the opt-out config are the whole job; define
  "subprocessor" and "PII" inline; heavily defer the rest. Reassure — this is a page and a settings toggle, not a
  law degree.
- `non-tech-founder`: plain business framing; they grasp "respect the customer's data" instantly — focus on the
  deletion path + the honest trust page.
- `eng-builder` / `returning-founder`: terse; the subprocessor derivation + the opt-out-as-config-act + the
  don't-start-SOC2-early line; they'll respect the anti-theater stance.
- `domain-expert` / regulated (health/legal/financial): the trigger fires *earlier* and harder — real
  lawyer + DPIA may be genuinely load-bearing at day one; caveat strongly and route to counsel, don't hand-wave.

## Rules
- **Pointers to a real lawyer, never legal advice.**
- **Privacy policy + provider opt-out are always load-bearing** once user data flows; do them now.
- **The opt-out is a config ACT, not a promise** — turn it on, confirm it, note where.
- **Subprocessor list = auto-derived** from what the app actually uses; don't imagine it.
- **Defer SOC2/ISO/DPIA until a NAMED deal demands it** — no speculative compliance theater (Principle #2).
- **Data minimization is the humane default** — the data you don't collect is the data that can't hurt anyone.
