---
id: FEAT-024
type: feature
owner: product-lead
status: shipped
gist: The missing leg of the pseudo→real spine: getting a working thing actually live and safe — secrets, RLS, and the client-bundled-DB-key trap where the AI created the hole and the founder wrote no code.
from: none
from_note: Came from the 2026-06-20 gap pass directly, not from a captured IDEA — the gap was named in conversation and specced straight to a build contract.
proof: library/practices/ship-it-live.md
created: 2026-06-20
shipped_on: 2026-06-21
spun_from: "what's-missing gap pass 2026-06-20 (Ajesh — hosting/CI-CD/deploy among named gaps)"
---

> **SHIPPED v0.92.0 (2026-06-21) — slices 1+2 built; slice 3 deferred.** Slice 1
> ([`ship-it-live.md`](../../library/practices/ship-it-live.md)) + slice 2 (`/ship` skill, L1/MVP) shipped;
> `/tmp`-verified (skill lands, 0 placeholders, `boss map` lists it, DOWN section in CLAUDE.md). Slice 3
> (the `reachable?` conscience moment) stays deferred — voicing-first, per the sequencing below. Sharpened
> 2026-06-20 by a `/deep-research` pass — slice boundaries below carry the verified evidence anchors and the
> one counter-argument that survived. **Read [`PRINCIPLES.md`](../../PRINCIPLES.md),
> [`library/practices/git-workflow.md`](../../library/practices/git-workflow.md), and the research capture
> [`SESSION-2026-06-20-cd-deploy-research.md`](../research/sessions/SESSION-2026-06-20-cd-deploy-research.md)
> first** — this FEAT is the *deploy* half of the build-process track (`git-workflow` shipped the *CI* half).

## What the research changed (read before touching the slices)

A 5-angle deep-research pass (21 sources, 25 claims adversarially verified 3-vote; full capture in the
SESSION doc above). Three findings reshape the starter plan:

1. **The secrets/RLS leg is the load-bearing one, not a cross-reference.** The best-evidenced, most
   on-ethos finding is the **client-bundled-DB-key + missing-RLS** trap — two named incidents where *the
   AI created the hole and the founder wrote no code* (**CVE-2025-48757 / Lovable**, 170+ apps leaking PII
   + keys; **MoltBook**, 1.5M credentials). This IS the pseudo→real thesis made literal. It moves from a
   "cross-reference `agent-security.md`" aside (original slice 1) to a **named, [EVIDENCE]-anchored section
   of the practice** — because it bites *at deploy*, which is exactly what `agent-security`'s `secrets-guard`
   client-side-key gap couldn't reach.
2. **"Deploy early" survived; "preview-per-branch is the review primitive" did not.** The strongest
   *deploy-early-is-wrong* counter (reliability is premature at MVP) was **killed 0-3** → the deploy-early
   headline stands un-hedged. But preview-per-branch tightening the review loop is **vendor-positioning
   only (the one verified counter)** → **demote it from headline to a JIT-gated judgment** (over-ceremony
   for 2 people). Don't make it a mandate.
3. **A deploy-time honesty anchor exists** (DORA 2024: AI adoption ↔ *worse* stability + throughput). It's
   the deploy twin of git-workflow's METR anchor. Include it — but do **NOT** claim small batches offset it
   (that inference was **killed 1-2**).

# FEAT-024 — Ship it live (the pseudo→real spine's missing leg)

## Why this is the one genuine build-craft gap (and on-ethos)

From the gap pass: of everything named (hosting, CI/CD, mobile, incorporation, finance, marketing), **most
is already positioned by a principle** — mobile = stack-neutral/learned (P4), incorporation/finance = JIT
pointers/mentors, OSS = optionality (P5). **Deploy/hosting is the exception: there is no practice and no
conscience moment for it.** And it's the most on-ethos thing on the list, because it's the **pseudo→real
spine itself**:

> An app that only runs on `localhost` **is a pseudo app.** You cannot prove pain, workflow fit, or
> willingness-to-pay on a thing no real user can reach. The validation conscience ("what does this prove?")
> has no teeth if the artifact was never put where someone could prove it.

`git-workflow` already shipped **CI** ("CI is a practice, not a platform"; `/smoke` is the gate). The
missing leg is **CD / reachability**: *is this where a real user can hit it, or just you?*

## The principles this must obey (the hard part — not a Vercel tutorial)

This is **not** "how to deploy to Vercel." Make it that and it violates the ethos (content/course, not
conscience). The discipline:

- **Stack-neutral (P4).** No baked-in deploy target. The deploy stack is *learned* per project and captured
  UP via the loop (Vercel / Fly / Railway / Cloudflare / a VPS — discovered, not assumed). The practice
  carries the *judgment* (deploy early, cheap, reversible); the *target* is the project's call.
- **JIT (P2).** Does **not** fire on a Quickstart sketch — `/prototype` runs locally and that's correct
  (sketch freely). The reachability discipline turns on at **MVP** (building-for-real), where validation
  needs a reachable artifact.
- **Optionality (P5).** Default to cheap + reversible + private hosting; don't lock to one platform; a
  custom domain / paid tier is earned, not assumed.
- **Conscience-not-censor.** Any moment here *asks* ("reachable by a real user yet?"), it never **gates** a
  commit or a build. (The careful slice — see sequencing.)
- **Not a course.** The shippable surface is a thin build-craft practice + deterministic "put it where a
  user can hit it" verbs — never strategy prose about hosting.

## Build shape (the predicate/runner split, same as `/import`, `/red-team`)

The CLI stays zero-dep (P4 / working rule #4); the model picks the stack and runs the deploy → the work
lives in the **skill + practice** layers, not `src/`.

### Slice 1 — `library/practices/ship-it-live.md` (UP) — the deployment discipline
The inheritable spine, ordered by what the research proved load-bearing (de-cargo-culted, stack-neutral):

- **"localhost is not shipped"** — the headline. The URL is the proof; reachability is the gate between
  pseudo and real. *(Survives — un-hedged.)*
- **Deploy early, deploy cheap, deploy reversible** — get a real URL at MVP, not at launch; smallest viable
  host; pick reversible-and-cheap over impressive (P5). The "wait, that's premature ceremony" counter was
  **adversarially killed 0-3** — so this stands without the apologetic caveat. (JIT still governs the
  *amount of ceremony*, not *whether to be reachable* — see Altitude.)
- **Secrets & authz at the boundary — the LEG WITH TEETH** (promote, [EVIDENCE]-anchor, don't bury as a
  cross-ref). Never client-bundled secrets; enforce server-side authz / RLS **before** the first public
  URL; a human security gate at first deploy. Cite the named incidents (**CVE-2025-48757 / Lovable** —
  170+ apps, ~10.3% leaking PII + keys; **MoltBook** — 1.5M credentials, founder wrote no code) as the
  proof that *the AI ships the hole*. This is where `agent-security.md`'s `secrets-guard` client-side-key
  gap actually bites — name the trap here (it's a deploy-time failure), cross-ref `agent-security` for the
  lethal-trifecta / egress mechanics. **The single most on-ethos section: a 1.5M-credential leak from a
  founder who couldn't grade what the AI shipped IS the pseudo-app thesis.**
- **Rollback ≠ reversible: schema is the one-way door** — instant rollback re-points the app artifact but
  does **NOT** undo DB migrations or env (Vercel documents this against its own feature). So name the revert
  path *and* the schema discipline: **expand-migrate-contract** (Fowler ParallelChange — each phase
  releasable + backward-compatible). This is `scalable-architecture.md`'s "schema = one-way door"; **deploy
  is WHEN it pays off.** Cross-ref for the migration mechanics; keep the deploy-time teeth here.
- **The deploy honesty anchor (the METR twin)** — DORA 2024: AI adoption correlated with *worse* stability
  AND throughput (larger batches). Shipping faster with AI doesn't make deploys safer; **measured** stability
  (change-fail-rate / restore-time) is the instrument, the felt speedup isn't. **Do NOT** claim small
  batches offset this (that inference was killed 1-2) — state the finding and stop.
- **Preview-per-branch — a JIT-gated judgment, NOT the review primitive** (demoted; this is the one verified
  counter-argument). A preview URL *can* be what the other human reviews, but its loop-tightening efficacy
  is **vendor-positioning, not independently proven**, and it's **over-ceremony for a 2-person team**. Name
  it as available + useful as review load grows; never a mandate at MVP. (Honors P2; ties to `git-workflow`'s
  review-capacity cap without inheriting an unproven claim.)
- **Stack-neutral capture** — the chosen host/runtime is a `PRAC-NNN` / stack-profile output of the loop,
  so the *next* project of that kind starts from it (P4).

### Slice 2 — `/ship` skill (L1/MVP) — the deterministic verbs
The model-driven "put it where a real user can hit it" runner (skill layer because it parses the project's
stack and shells out — the CLI can't). Smallest honest version: detect the stack → **run a pre-flight
reachability+safety check** → pick/confirm the reversible-cheap host → deploy → **hand back the live URL**
→ note the rollback path. Graceful when there's nothing to deploy.

**The pre-flight is what the research made concrete — it's the deterministic verb with teeth** (and what
separates `/ship` from a deploy alias): before handing back a URL, *refuse to be silent* if it detects the
verified #1 failure mode — **secrets in the client bundle / a DB anon-key with no server-side authz**. This
is a check, not a gate (conscience-not-censor): it surfaces the trap and points at the discipline, it
doesn't block the deploy. Open thread for the build (from research, not blocking): which scanner backs it —
gitleaks / trufflehog / GitHub push-protection / build-time bundle scan. Keep it the *minimal honest*
version; a full secret-scanner may be `agent-security`'s job, not `/ship`'s.

*Decide its exact verbs with the founder — don't over-build slice 2.*

### Slice 3 (CAREFUL — defer unless earned) — the `reachable?` conscience moment
The mirror of moment #1 ("what does this prove?"). Detect-candidate: a **built MVP `FEAT` with no live URL /
no deploy recorded** → the conscience asks *"is this reachable by a real user, or just by you?"* once.
**This is the over-fire-risk piece** (per [boss-ethos] the hook needs a *real* detect predicate — manufacture
one and it's a nag, not a conscience). **Do not build the hook in slice 1.** Start the voicing as a
`/ship`-adjacent / `/prototype`-graduation line (like other careful moments that started as voicings before
earning a hook). The reachability-state predicate is the research question this slice opens.

## Restraint / sequencing

- **Slice 1 (practice) + slice 2 (`/ship` skill) are the buildable scope now** — both clear the solo test
  (a solo founder needs to ship to a real URL day one) and are on-ethos (stack-neutral, JIT-at-MVP).
- **Slice 3 (the hook moment) is the careful, deferrable half** — voicing first; hook only when a real
  reachability predicate exists. Don't gold-plate BOSS's own conscience (the moment #3 BOSS guards against).
- **n=0 reality:** this is real build-craft (passes the solo test cleanly), but demand is still the dominant
  risk ([[IDEA-019]]) — ship the practice + skill, don't let slice 3 become a research rabbit-hole.

## Ties

- [`git-workflow.md`](../../library/practices/git-workflow.md) — the CI half; this is the CD half (preview
  URLs = the review primitive that workflow already leans on).
- [`agent-security.md`](../../library/practices/agent-security.md) — the secrets-at-the-boundary /
  client-side-key gap / egress defaults bite at deploy time.
- [`scalable-architecture.md`](../../library/practices/scalable-architecture.md) — migrations-as-code is the
  deploy-safe-schema discipline; deploy is when it pays off.
- [[IDEA-041]] — **the natural sequel.** Once it's *reachable* (this FEAT), the next conscience question is
  *"does anyone know it exists?"* (distribution as a conscience leg). Reachable → discoverable.
- `PRINCIPLES.md` — the pseudo→real spine + P2/P4/P5 are the governing constraints above.
