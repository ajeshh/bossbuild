---
id: RVW-052
type: verdict
owner: product-lead
status: recorded
created: 2026-06-20
verdict: ADAPT
route: UP → design-review / design-system.md + a conscience nudge
---

# RVW-052 — AI-default output is indistinguishable; build faster ≠ build sameness (the "indigo problem")

## The claim
- **Source:** Adam Wathan's Aug 2025 public apology that `bg-indigo-500` made "every AI-generated UI on earth also indigo"; AI converges on the shadcn/Tailwind default aesthetic; + workslop generic-output evidence (HBR Sep 2025).
- **Core assertion:** AI defaults to the statistical average of everything — ship the default and you ship something indistinguishable from every competitor.

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No — it's #3 (nothing valuable buried in defaults) in aesthetic form. |
| 2 | Evidence grade | [THOUGHT-LEAD] (homogenization) + [EVIDENCE] (workslop generic-output study). |
| 3 | Duplicate or sharpen? | **Sharpens, names a gap.** BOSS has design surfaces (`design-tokens-init` 5-token distinctiveness pass, `design-review`) but doesn't explicitly name *"AI-default = indistinguishable from every competitor."* |
| 4 | Who serves / harms? | Serves every cohort shipping AI-generated UI/content; sharpest for `vibe-coder-newbie`. No harm. |
| 5 | Cost / ceremony | Light — a named nudge at the design boundary + a line in design-system.md. |

## Verdict: ADAPT
Strong, memorable, on-thesis (build faster ≠ build sameness) — and it has a real concrete hook (the indigo apology). ADAPT: name the homogenization risk explicitly at the design boundary — `design-review` / `design-system.md` gain an "AI-default = generic; spend the time you saved on the 5% that's yours (brand, voice, the hard part)" check, with the existing 5-token distinctiveness pass as the antidote. A conscience nudge ("is this the AI default?") at the design moment, suggestive not blocking.

## If ADOPT / ADAPT
- **What to do:** Route **UP** → design-review/design-system.md gain the homogenization check; optional conscience nudge at the design boundary. → hand to `/boss-learn`.
- **What's modified:** Tie to the *existing* distinctiveness pass rather than a new mechanism.

## Notes
- Prior related: [[RVW-014]] (aesthetic ambition), design-system.md 5-token pass.
- BOSS version when recorded: 0.74.0

## `/boss-learn` outcome — 2026-06-20 (v0.90.0, final /vet sweep bundle)
- **Routed UP** (with [[RVW-051]]) into `library/practices/design-system.md` — sharpened the existing
  "Aesthetic ambition — past the slop default" section with the RVW-052 framing: AI-default isn't just
  generic, it's **indistinguishable from every competitor** (the Tailwind `bg-indigo-500` apology as the
  concrete hook), *build faster ≠ build sameness*, and **spend the time the AI saved on the ~5% that's
  yours** — pointed at the existing distinctiveness pass, no new mechanism (as scoped). Did **not** add a
  new conscience predicate (consistent with the rest of the sweep — no over-fire machinery). **Shipped in
  v0.90.0** (consolidated final-sweep bundle, commit `b35ac66`).
