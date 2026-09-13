---
id: RVW-003
type: verdict
owner: product-lead
status: recorded
created: 2026-06-02
verdict: NOT-YET
route: n/a
---

# RVW-003 — teach vibe coders "the plumbing" (system architecture) before code

## The claim
- **Source:** Reddit r/vibecoding (thelocalnative), 296 upvotes. `docs/research/inbox/plumbing-first-architecture-for-vibe-coders.md`
- **Core assertion:** *New builders should start at the highest level (system architecture), not the
  code — and learn "the plumbing" (APIs, hosting/DNS/deploy/secrets, authn/authz/security/backups,
  version control/testing/monitoring/analytics) because AI skips it unless you know to ask. You don't
  need every piece day one, but you must know they exist by name.*

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | **No** — and "know it exists, add it when earned" is explicitly PRINCIPLE #2-compatible. The security/backups emphasis serves #6 (harm prevention). |
| 2 | Evidence grade | Experienced engineer, craft-sound, n=1; comments add real teeth (rate-limiting cost $500; secrets-in-public-repo). **Independent of the Hamza corpus.** Practitioner craft, not data. |
| 3 | Duplicate or sharpen? | **Sharpen / real gap.** BOSS has `/ai-first-init`, `/ai-failure-states`, `/ai-cost` — but those are *AI-mediation* specific. The broad production-plumbing *awareness map* (auth, hosting, secrets, backups, monitoring, rate-limiting) is **not** something BOSS gives founders as a cohort-aware checklist. |
| 4 | Who serves / harms? | Serves `first-product` / `vibe-coder-newbie` / `non-tech-founder` strongly (they don't know what they don't know) and `domain-expert` (security/backups are stakes). Would bore `eng-builder` → cohort-scope. Low harm if JIT. |
| 5 | Cost / ceremony | Low **iff** delivered JIT (awareness, not a day-one production-readiness gate). A heavy "do all the plumbing now" checklist would *become* the premature ceremony (PRINCIPLE #2). |

## Verdict: NOT-YET

Genuinely sound and addresses a real BOSS gap — but the value is **founder-facing** (a cohort-aware,
mode-gated "plumbing awareness" surface for the *scaffolded project*), and BOSS itself (a zero-dep
CLI) is not the kind of full-stack app this map is for. Under the internal-first scope (IDEA-016),
the founder-facing build is deferred, so this can't be actioned yet — but it's a strong candidate to
log.

## If REJECT / NOT-YET
- **Why not (now):** purely founder-facing value; no BOSS-internal adoption, and the founder-facing
  surface is the deferred UP scope.
- **Re-open condition:** when BOSS builds founder-facing MVP/V1 skills (or the founder-facing `/vet`),
  promote a **cohort-aware "plumbing awareness" skill** — fires JIT at the right mode, lists the
  pieces by name, lets the founder decide what to add when. Pairs with `/ai-first-init`; belongs in
  the IDEA-012 catalog. **Scope it (`eng-builder` gets the 10-second version) and keep it
  awareness-not-gate** to avoid the ceremony trap.

## Notes
- Independent source — does **not** get the author-concentration discount the Hamza pieces do.
- BOSS version when recorded: 0.41.0
