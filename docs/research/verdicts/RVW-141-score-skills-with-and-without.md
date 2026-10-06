---
id: RVW-141
type: verdict
owner: pm
status: recorded
created: 2026-10-05
verdict: NOT-YET
---

# RVW-141 — score each skill with and without it, and reward standing down

## The claim
- **Source:** an agent-skills platform's eval docs (opened by the research pass 2026-10-05;
  `docs/research/sessions/SESSION-2026-10-05-spec-driven-reading.md` (gitignored; names and URLs live there)). Its eval run defaults to two variants, without and with the skill. Its SDD plugin's `trivial-change-exception` eval
  awards points for *not* writing a spec on a typo fix.
- **Core assertion:** a skill is proven only by a baseline delta, and a discipline is proven by when it
  declines.
- **Altitude:** BOSS's own practice, about how BOSS tests its skills. It is not something BOSS ships.

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No. |
| 2 | Evidence grade | **Vendor practice**, by a well-funded team whose product is evals. Sound, but they sell it. |
| 3 | Duplicate or sharpen? | **The baseline half was already ruled on.** RVW-013 scoped out the eval harness as *"ceremony-accretion"* and *"a near-duplicate of the question `/vet` and `conscience-evals/` already ask ('does this beat the baseline?')"*. The **stand-down half is held for the conscience**: `docs/architecture/conscience-evals/moment-*.yml` carry *SHOULD NOT FIRE* cases. It is **absent for skills**: `plugin/evals/` holds only door cases, and nothing tests `/spec` declining to make a FEAT of a one-release change. |
| 4 | Who serves / harms? | It serves BOSS's maintainers. No founder is touched. |
| 5 | Cost / ceremony | A paid or keyless run per skill per change. Real cost for one maintainer. |

## Verdict: NOT-YET
Nothing has changed since RVW-013 on the baseline half. The stand-down half is the sharper idea: BOSS
says restraint is a feature, and only the conscience's restraint is tested. It waits for a trigger, not a
build.

## If REJECT / NOT-YET
- **Re-open condition:** the next time `plugin/evals/` gains a case for a skill, add its *should-decline*
  twin in the same change (for `/spec`: a one-line fix that must stay an IDEA). Or sooner, if a founder
  reports `/spec` or `/idea` making ceremony out of something trivial.

## Attribution
**Partly verified.** The docs page was opened by the research pass. The `trivial-change-exception` eval
is in the platform's public spec plugin and was not re-opened for this verdict.

## Notes
- Prior related: RVW-013 (skill-creator: adopt the wisdom, leave the harness).
- BOSS version when recorded: 0.329.0
