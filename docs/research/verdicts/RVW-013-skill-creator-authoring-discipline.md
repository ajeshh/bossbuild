---
id: RVW-013
type: verdict
owner: product-lead
status: recorded
created: 2026-06-20
verdict: ADAPT
route: UP library/practices/skill-authoring.md
---

# RVW-013 — Anthropic's skill-creator (a skill-authoring discipline)

## The claim
- **Source:** https://skillsmp.com/creators/anthropics/skills/skills-skill-creator — Anthropic's
  official skill-creator skill.
- **Core assertion:** Author skills with a discipline — (1) explanatory over prescriptive (ALL-CAPS
  ALWAYS/NEVER and rigid structures are yellow flags); (2) progressive disclosure (metadata →
  SKILL.md body → bundled resources); (3) "pushy" descriptions with explicit triggers to fight
  under-triggering; (4) validate with a with-skill vs without-skill eval loop in
  `workspace/iteration-N/eval-ID/`.
- **Inbox file:** `docs/research/inbox/skill-creator-anthropic.md`

> One claim per run. The load-bearing claim is **adopting a skill-authoring discipline**. The heavy
> eval-harness portion (claim 4) is scoped *out* of the ADAPT and parked — see verdict.

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | **No — it serves #2.** "Explanatory over prescriptive / no rigid ALL-CAPS rules" is PRINCIPLE #2 (JIT, no premature ceremony) and IDEA-014 (don't freeze model behavior) applied to *how we write skills*. Progressive disclosure is #2 applied to context budget. |
| 2 | Evidence grade | **Respected practitioner — the highest grade.** This is Anthropic's *own* authoring guidance for the very mechanism BOSS is built on (skills run on Claude Code). Not n=1 vibe; the source defines the substrate. |
| 3 | Duplicate or sharpen? | **Sharpens — fills a genuine void.** No skill-authoring guidance exists anywhere in the repo (grep confirms). BOSS *practices* some of this implicitly; nothing *names* it. A new `library/practices/skill-authoring.md` is the artifact. |
| 4 | Who serves / harms? | **Serves BOSS-authoring-BOSS first**, then every founder who writes a skill in their scaffolded project (UP candidate). Harms no cohort — it's discipline, not ceremony imposed on founders. |
| 5 | Cost / ceremony | **Split.** The *principles* are net-lighter (they argue *against* rigid ceremony). The *eval harness* (claim 4: `iteration-N/eval-ID/` dirs, parallel with/without runs) is real ceremony — heavier than BOSS needs until a skill's value is actually in doubt. Adopt the first, defer the second. |

## Verdict: ADAPT

Adopt the **authoring principles** — explanatory-over-prescriptive, progressive disclosure, pushy
descriptions — as a `library/practices/skill-authoring.md`. These are Anthropic's own guidance for
BOSS's own substrate, fill a real void, and *reinforce* PRINCIPLE #2 rather than adding weight. The
**eval-harness half (claim 4) is scoped out** — building `workspace/iteration-N/eval-ID/` machinery
now is exactly the ceremony-accretion the conscience and IDEA-033 warn against. It is also a near-
duplicate of the question `/vet` and `conscience-evals/` already ask ("does this beat the baseline?").
A skim says "adopt the whole skill-creator"; the honest read is "adopt the wisdom, leave the harness."

## If ADOPT / ADAPT
- **What to do:** Write `library/practices/skill-authoring.md` capturing the three principles, with
  BOSS-specific examples (cite our own SKILL.md files). → handed to `/boss-learn` to route UP.
- **What's modified from the original:** the with/without eval harness is **omitted** (NOT-YET, see
  below). The "pushy descriptions" guidance is kept but reframed in BOSS voice (assume-intelligence;
  triggers earn their pushiness, they don't shout).

## Deferred (NOT-YET)
- **The skill-eval harness (claim 4).** Re-open when a shipped skill's value is genuinely disputed and
  a careful read can't settle it — *then* a with/without comparison earns its weight. Until then it
  duplicates `/vet` + `conscience-evals/`. Logged in IDEA-033's bundle.

## Notes
- Prior related verdicts: none directly. Spiritually adjacent to RVW-001 (rejected *frozen* rules; this
  adopts a *principle that argues against* freezing).
- BOSS version when recorded: 0.58.0
