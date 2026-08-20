---
id: PRACTICE-ship-it-live
type: practice
owner: mentor-architect
status: active
host: stack-neutral
provenance: distilled from the 2026-06-21 CD/deploy deep-research pass (SESSION-2026-06-20-cd-deploy-research — 21 sources, 25 claims adversarially verified 3-vote, 22 confirmed / 3 killed) — DORA/Accelerate 2022-2024 [EVIDENCE], Fowler ParallelChange [EVIDENCE], Willison lethal-trifecta + OWASP LLM Top 10, CVE-2025-48757 (Lovable) + the MoltBook breach as the named vibe-coded incidents — BOSS v0.92.0, FEAT-024
provenance_public: Distilled from a CD/deploy deep-research pass — 21 sources, 25 claims adversarially verified by 3-vote, 22 confirmed and 3 killed. DORA/Accelerate 2022–2024, Fowler's ParallelChange, Willison's lethal trifecta and the OWASP LLM Top 10, with CVE-2025-48757 (Lovable) and the MoltBook breach as the named vibe-coded incidents.
last_reviewed: 2026-07-23
review_by: 2027-07-23
curve: craft
---

# Practice — Ship it live (the CD half: localhost is not shipped)

> **The shape of the problem.** An app that only runs on `localhost` **is a pseudo app.** You cannot
> prove pain, workflow fit, or willingness-to-pay on a thing no real user can reach — the validation
> conscience ("what does this prove?") has no teeth if the artifact was never put where someone could
> prove it. `git-workflow` covered **CI** (is `main` green, can two humans stand behind the merge);
> this is **CD** — *is this where a real user can hit it, or just you?* The URL is the proof. Everything
> below is in service of getting that URL early, keeping the deploy reversible, and not leaking your
> users' data on the way out the door (which, in 2025-26, is exactly how the AI-built app fails).

## Deploy early, deploy cheap, deploy reversible

Get a real URL at **MVP**, not at launch. Pick the smallest viable host and pick
reversible-and-cheap over impressive (Principle #5 — optionality: a private URL on a free tier
preserves every later choice; a hand-rolled Kubernetes cluster forecloses them). The host is the
project's call and the project's stack decides it (Principle #4) — Vercel, Fly, Railway, Cloudflare,
Render, a $5 VPS — the *practice* carries the judgment, not the target.

The instinct to wait — "it's not ready, I'll deploy when it's polished" — does not survive scrutiny.
The "reliability investment is premature at MVP, just keep iterating locally" counter-argument was
**adversarially tested and failed (killed 0-3)**: there is no good evidence that staying on localhost
buys you anything. What it costs you is the only thing that matters this early — *contact with a real
user*. Deploy-day surprises (env that only existed on your laptop, a build step that only you can run,
a secret you hard-coded) are cheaper to find on day one with one user than at launch with a hundred.

> **localhost is not shipped.** Reachability is the gate between a pseudo app and a real one. Ship the
> ugly version to a real URL, then iterate *in the open*.

## Secrets & authz at the boundary — the leg with teeth

This is where the AI-built app actually fails in 2025-26, and it fails the same way every time: **the
agent ships a frontend that talks to the database with a public key, trusting a security rule it never
configured.** Read the bundle, get the key, read and write everything. The founder wrote no code, so
the founder never saw the hole.

This is not hypothetical — it's the best-evidenced finding in the whole research pass [EVIDENCE]:

- **CVE-2025-48757 (Lovable)** — AI-generated frontends made direct calls to the database via the
  public anon key, relying solely on row-level security the AI never set up. **303 endpoints across
  170+ apps (~10.3% of those scanned)** leaked PII and third-party API keys. (CVSS is disputed — 8.26
  vs 9.3, supplier-contested — so trust the *mechanism*, not the score.)
- **MoltBook** — a hardcoded database key plus disabled row-level security leaked **1.5M API tokens and
  35K emails**. The founder wrote no code at all.

A 1.5M-credential leak from a founder who couldn't grade what the AI shipped **is the pseudo→real
thesis made literal.** So the discipline is non-negotiable at the deploy boundary:

- **No secrets in the client.** API keys, tokens, service credentials live in server-side env, never in
  the shipped bundle. A key in frontend JS is public the moment you deploy.
- **Enforce authz server-side *before* the first public URL.** If the app talks to a database with a
  public/anon key, the row-level security or access rules are what stand between your users and the
  internet — and the AI does **not** configure them by default. Verify they're on before you ship, not
  after the breach.
- **A human security gate at first deploy.** For a non-technical founder this is the single highest-value
  check, because they can't spot the vuln themselves. BOSS already owns this surface — **don't restate
  it here, run it:** `/red-team`'s pre-ship app-security pass scans the build output + git history for
  shipped secrets (the gap `secrets-guard` deliberately does *not* cover), and
  [`agent-security.md`](agent-security.md) carries the lethal-trifecta / egress mechanics (Willison;
  OWASP ranks prompt-injection #1 and notes it cannot be fully solved within current LLM architecture).
  This practice's job is to make sure that pass *happens at deploy time* — the one moment it pays off.

## Rollback ≠ reversible: schema is the one-way door

"I can roll back" is half-true, and the half that's false is the one that hurts. **Instant rollback
restores only the application artifact** — it re-points the domain at a previous build. It does **not**
revert your database, and usually not your env either (Vercel documents this limitation against its own
rollback feature, which is why it's safe to trust). The code goes back; the migration that dropped a
column does not.

So shipping reversibly means two separate disciplines:

- **Name the revert path before you deploy.** A deploy you can't undo is a one-way door. Know the one
  command (or one click) that puts the last-good build back, and that it doesn't depend on the deploy
  that just broke.
- **Make schema changes backward-compatible — expand-migrate-contract** (Fowler, *ParallelChange*
  [EVIDENCE]). Add the new column/table (expand), move code and data to it while both shapes work
  (migrate), drop the old one only once nothing reads it (contract). Each phase is releasable and
  rollback-safe on its own, so a code rollback never strands a database that already moved on. This is
  [`scalable-architecture.md`](scalable-architecture.md)'s "schema = the one-way door" — **deploy is
  *when* it pays off.** Cross-reference for the migration mechanics; the deploy-time teeth are here.

## A feature flag is the fast rollback the app layer gives you

Code rollback restores the app but not the database, and it takes a redeploy (minutes). For a **risky or
AI-mediated feature** that's too slow — an AI feature failing non-deterministically hits your whole user base at
once. A **feature flag is the faster, finer rollback the app layer gives you**: flip it off in *seconds*, no
deploy, and roll out gradually (1% → 5% → 100%) so a problem shows at 5% exposure, not 100%. For an AI feature,
put the model/prompt/params *in* the flag ("flag the model, not just the feature") so a bad model swap — which
CI/CD never sees — rolls back with a toggle. **Env-var-first** (a kill switch is one `if (env)`; a platform only
earns its place for remote-toggle or user-bucketing). And it's how you *finish*: ship the thin done slice behind
a flag rather than holding a half-built branch — but a flag left off forever is WIP wearing a toggle (retire it
or promote it). Full ladder: [`feature-flags`](feature-flags.md). This is the `/ship` step-4b offer — a check,
never a gate.

## The honesty anchor (don't sell yourself the safe deploy)

**DORA 2024 [EVIDENCE]: AI adoption correlated with *worse* software-delivery stability *and*
throughput** — driven by larger batches. This is the deploy-time twin of `git-workflow`'s METR anchor:
shipping faster with an agent does not make your deploys safer, and the felt speedup is not the
instrument. The instrument is **measured** — change-failure rate and time-to-restore (DORA's stability
metrics are first-class, not an afterthought to deploy-frequency).

One honesty caveat that cuts the other way: it is tempting to claim "but small batches offset the AI
penalty." The research **killed that inference (1-2)** — DORA does not conclude it. Keep batches small
because `git-workflow` already earns it (review capacity), not because it's a proven antidote to the
stability hit. State the finding; don't oversell the fix.

## Preview-per-branch — a judgment, not the review primitive

A preview URL per branch *can* be what the other human actually reviews, and several platforms make it
nearly free. But this is the one place to resist the vendor pitch: **the claim that preview-per-branch
tightens the review loop is platform-positioning, not independently proven** (it was the single counter-
argument that survived verification in the research pass). For a two-person team it is often
**over-ceremony** — the review capacity cap in `git-workflow` is the real constraint, and a preview env
doesn't raise it.

So: reach for preview environments when review *load* grows enough to earn them — multiple concurrent
branches, a reviewer who isn't the author, a stakeholder who needs to click before merge. Not as a
mandate at MVP. Right ceremony, right rung (Principle #2).

## Stack-neutral capture (feed the loop)

The host, the deploy command, the rollback path, the env-var boundary you settled on — that's a
**stack-profile output of the learning loop** (Principle #4). Capture it as a `PRAC-NNN` (via
`/practice`) or a stack profile so the *next* project of that kind starts from a known-good deploy
recipe instead of rediscovering it. BOSS assumes no deploy target; it *learns* yours and carries it UP.

## Altitude / JIT (don't front-load it)

This is **not** a Quickstart lecture. A founder dropping an idea into `/prototype` runs it locally and
that's correct — sketch freely, no deploy discipline. The reachability discipline earns its place at
**MVP**, when the work is building-for-real and validation needs an artifact a real user can reach. The
secrets-at-the-boundary check surfaces the first time the app talks to a database or holds a key; the
schema discipline surfaces at the first migration; preview environments surface only when review load
asks for them. Right ceremony, right rung (Principle #2).

## Relationship to BOSS

BOSS already ships the security *mechanism* this practice leans on — `/red-team`'s pre-ship pass (the
shipped-secret scan), [`agent-security.md`](agent-security.md) (the deny-list floor, `secrets-guard`,
the lethal-trifecta containment), and [`scalable-architecture.md`](scalable-architecture.md)
(migrations-as-code). This practice is the **operating discipline that fires them at deploy time**, plus
the deploy-specific judgment a pre-AI CD guide wouldn't have carried: the client-bundled-key trap as the
*signature* AI-built failure, and rollback-is-not-reversibility. The runner is **`/ship`** — the
deterministic "put it where a real user can hit it" verbs, with the secrets/authz pre-flight wired in as
a *check, not a gate* (conscience-not-censor).

**Reachable → discoverable.** Reachability is the *first* leg this practice closes; the next is the one the
conscience otherwise never voices — *will anyone find it?* `/ship` carries a single demand voicing at the
live moment (*"who's the first real user, and how do they hit this?"*), situation-not-person, pointing at
`mentor-customers` for depth — never a marketing nag. That's the distribution-leg asymmetry (IDEA-041) closed at
the `/ship` moment rather than as an unprompted hook. See [`git-workflow.md`](git-workflow.md) (the CI half
this extends), and FEAT-024.
