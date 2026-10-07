---
id: RVW-151
type: verdict
owner: pm
status: recorded
created: 2026-10-06
verdict: ADAPT
route: DOWN stages/L1-mvp/template/claude-append.md
feeds: IDEA-154 T3
---

# RVW-151 — "if you could describe the diff in one sentence, skip the plan" as BOSS's spec line

## The claim
- **Source:** the host's best-practices docs (live page, verbatim), named in docs/research/sessions/SESSION-2026-10-06-spec-and-agent-driven-practice.md (gitignored; sources named there).
- **Core assertion:** size the up-front artifact to the change. If the diff fits in one sentence, skip the plan.

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No. It is principle #2 (structure only when it's earned) said as a test a founder can run. |
| 2 | Evidence grade | A vendor's guidance, not a measurement. It is supported by a preprint finding that planning's accuracy value fades on strong models. Moderate. |
| 3 | Duplicate or sharpen? | Sharpens. MVP rule 1 says *"Any non-trivial change starts with /spec… Throwaway one-liners don't need it."* "Non-trivial" is undefined, and *assume intelligence, never assume knowledge* says a newcomer can't apply an undefined word. **But the claim is about the *plan*, and `/spec` is the *what* and *how we'll know*.** A one-sentence change to who can see what still needs its negative path. Taken whole, the claim would let the riskiest small changes skip the spec. |
| 4 | Who serves / harms? | Serves `first-product` and `vibe-coder-newbie` (a test they can apply), and stops `returning-founder` being speced at for a copy fix. The unscoped version would harm anyone whose one-liner touches money or access. |
| 5 | Cost / ceremony | Lighter. The rule gets more precise with the same length. |

## Verdict: ADAPT
Take the one-sentence test, and keep BOSS's three paths as the exception: a one-line change to money,
deletion or access still gets a spec. That keeps the host's sizing without opening the hole `/spec`'s
paths exist to close.

## If ADOPT / ADAPT
- **What to do:** rule 1 in `claude-append.md` becomes: a change you can't say in one sentence, or one
  that touches money, deletes data or changes who can see what, starts with `/spec`. Anything else, just
  build it.
- **Modified from the claim:** the three named paths override the size test.

## Attribution
Verified. The sentence is verbatim on the live page. The same page recommends interview → spec → fresh
session for larger features, so it scales the plan to the job rather than arguing against specs.

## Notes
- Prior related verdicts: RVW-139 (recommended answers, rejected) and RVW-147 (a rabbit-hole line, rejected).
- BOSS version when recorded: 0.330.0
