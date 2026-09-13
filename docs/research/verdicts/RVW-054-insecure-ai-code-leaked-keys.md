---
id: RVW-054
type: verdict
owner: product-lead
status: recorded
created: 2026-06-20
verdict: ADAPT
route: UP → agent-security.md + secrets-guard scope + a /red-team pre-ship pass
---

# RVW-054 — AI writes insecure code and leaks keys (the pre-ship security moment)

## The claim
- **Source:** Veracode *2025 GenAI Code Security Report* (**45%** of AI-generated code introduces an OWASP-Top-10 vuln, no improvement with scale) + the Tea-app breach (72k images, 1.1M DMs from an open Firebase bucket) + RedHunt/Escape (~25k exposed secrets across vibe-coded sites; Moltbook 1.5M API keys).
- **Core assertion:** AI defaults to insecure when a secure option exists; vibe-coded apps routinely ship vulnerabilities and leak secrets — a distinct surface from prompt-injection.

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No. |
| 2 | Evidence grade | [EVIDENCE] — large model study (Veracode) + multiple named breaches. |
| 3 | Duplicate or sharpen? | **Partly new.** BOSS covers *agent* security (trifecta, secrets-guard deny-list) but the *"AI writes vulnerable app code + exposes client-side keys"* surface isn't explicitly named; secrets-guard is a read-deny, not a ship-time scan. |
| 4 | Who serves / harms? | Serves every founder shipping AI-written code; sharpest for non-technical/`vibe-coder-newbie` who can't spot the vuln. No harm. |
| 5 | Cost / ceremony | Light-moderate — a pre-ship check + scope confirmation on secrets-guard. |

## Verdict: ADAPT
The lethal trifecta is covered, but "AI ships vulnerable app code and leaks keys" is a *different* surface and the strongest concrete hooks (Veracode 45%, Tea breach) are exactly what makes a pre-ship security moment land for non-technical founders. ADAPT: add an AI-generated-code security note to `agent-security.md` + a `/red-team` (or a light dedicated) **pre-ship pass** (secret scan + the OWASP web basics); confirm `secrets-guard` covers *client-side key exposure*, not just read-deny. Don't duplicate the trifecta material — this sits beside it.

## If ADOPT / ADAPT
- **What to do:** Route **UP** → `agent-security.md` gains the insecure-AI-code surface; a pre-ship secret/vuln check; verify secrets-guard scope. → hand to `/boss-learn`.
- **What's modified:** A ship-time scan (not just read-deny); framed for the non-technical founder.

## Notes
- Prior related: [[RVW-042]] (ASI Top 10), [[RVW-044]] (containment), agent-security.md + secrets-guard hook.
- BOSS version when recorded: 0.74.0
