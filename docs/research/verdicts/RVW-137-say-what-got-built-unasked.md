---
id: RVW-137
type: verdict
owner: pm
status: recorded
created: 2026-10-05
verdict: ADAPT
route: UP stages/L1-mvp/template/.claude/skills/log/SKILL.md (step 5)
---

# RVW-137 — at close, name what got built that the criteria never asked for

## The claim
- **Source:** Spec Kit `converge.md:161` (opened 2026-10-05): the **`unrequested`** gap type, *"the code
  contains work not called for by the spec, plan, or tasks"*. It is answered with a review task, never a
  deletion.
- **Core assertion:** agents add work past the spec, and a done check should surface it rather than let it
  ship unnamed.

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No. It supports #2 (the build carries only what it earned) and the honesty sentence. |
| 2 | Evidence grade | **Pattern, thin.** One product's design (Spec Kit), consistent with RVW-108's receipt and BOSS's own *"new scope gets a new id"* rule (`spec/SKILL.md` Rules). No BOSS founder has reported it (n=0). |
| 3 | Duplicate or sharpen? | **Sharpens.** BOSS's rule catches growth **the founder** adds mid-build. It cannot catch what the **agent** added unasked, because nobody sees it. `/log` step 5 already asks a cost question about *"more work"*, but only about future work. |
| 4 | Who serves / harms? | It serves `non-tech-founder` and `first-product`, who cannot read the diff. Harm risk: it nags `eng-builder` if it fires on every close. |
| 5 | Cost / ceremony | Light if **silent when empty**. Heavier if it becomes a ritual question. |

## Verdict: ADAPT
Take it as a check the agent runs, not a question the founder answers. At close, the agent compares
what it built against the criteria and **says one line only if something is extra**: what, and whether
it goes to `spun_to:` or comes out. Nothing extra means nothing said. It never deletes on its own.

## If ADOPT / ADAPT
- **What to do:** one paragraph in `/log` step 5, beside *"Then the next step is a new decision"*. →
  `/extract` (UP).
- **Modified:** no gap taxonomy, no review tasks appended to a file. A silent-when-empty line, routed to
  BOSS's existing `spun_to:`.

## Attribution
**Verified** — `converge.md:161`, `:180-182` (severities for `unrequested`).

## Notes
- Prior related: RVW-108 (role-agent pipeline, REJECT). Pairs with RVW-136; build them together.
- BOSS version when recorded: 0.329.0
