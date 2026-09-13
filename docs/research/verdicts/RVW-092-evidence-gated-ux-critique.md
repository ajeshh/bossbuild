---
id: RVW-092
type: verdict
owner: product-lead
status: recorded
created: 2026-08-24
verdict: ADAPT
route: DOWN stages/L1-mvp (/ux-check honesty split + designer tool list) + UP library/practices/ai-ux-patterns.md (the flow-efficiency ceiling)
---

# RVW-092 — an AI UX review should be evidence-gated, and worth only what it repairs

## The claim
- **Source:** UXBench, *Measuring the Actionability of LLM-Generated UX Critiques*, Wang et al.
  (13 authors; Notre Dame / Penn / Rochester / CMU / MIT / Harvard / LMU).
  arXiv:2606.16262v1 [cs.SE], 15 Jun 2026. <https://arxiv.org/abs/2606.16262>
- **Core assertion:** a UX critique should be **gated on collected interaction evidence** — the
  reviewer may not stop until it has exercised the controls, and no finding counts unless it links
  to an observed event — and its quality should be measured by **repair lift**, whether a downstream
  agent can actually improve the interface from the report, not by whether the critique reads well.
- **Inbox file:** `docs/research/inbox/evidence-gated-ux-critique-2026.md`

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | **No — it serves #2 and #6.** The *discipline* (don't report what you didn't observe) is honesty, which is the humane lens applied to BOSS's own output. The *apparatus* (41 fixtures, a repair agent, a scoring judge, a model leaderboard) would fail #2 outright — that is a benchmark, not a founder's Tuesday. The verdict splits exactly there. |
| 2 | Evidence grade | **Pattern-with-data, preprint, small effects.** Real construction (41 fixtures, 8 models, two protocols) from a credible multi-institution group — but **arXiv v1, not peer-reviewed**; the headline metric is scored by an LLM judge (GPT-5.4-Mini) with human validation at only **n=6**; and the effects are small: baseline 3.27/5 → 3.41–3.49, i.e. **Δ +0.14 to +0.22**, best-to-worst spread **0.08**. Grade the *direction*, never the multiplier. |
| 3 | Duplicate or sharpen? | **Sharpens — and exposes a gap BOSS already knows how to name.** `/design-review` step 3 already argues the meta-point in BOSS's own words: read the manifest, because that is *"the difference between actually checking and asking the model to remember to check."* But `/ux-check` step 2 orders *"Open the page; click through; trigger every state"* and **BOSS ships no mechanism by which that can happen** — the `designer` agent's tools are `Read, Grep, Glob, Edit, Write` (no Bash), and no template ships an MCP config, Playwright, or any browser. **n=21 of the checkers-state-intents-they-don't-enforce pattern, this time in shipped founder surface.** |
| 4 | Who serves / harms? | **Serves everyone who runs `/ux-check`; the unfixed gap harms `first-product` and `non-tech-founder` most** — they are least able to tell a source-read review from a walked one, and a review that reports "contrast meets WCAG 2 AA" without rendering anything is worse than no review, because it retires the question. **But mandating a browser would harm the same two cohorts** (setup ceremony before the first finding). Hence: fix the honesty, not the toolchain. |
| 5 | Cost / ceremony | **Net lighter.** The adopted half is mostly a *subtraction* — stop claiming a walk that didn't happen — plus one cheap addition (label each finding observed vs. inferred). The refused half is where all the weight was. |

## Verdict: ADAPT

Take the **discipline**, refuse the **benchmark**. An AI UX review that cannot say which findings it
observed and which it inferred from source is a plausible essay, and BOSS already has a name for
that failure. The fix is honesty about scope, not a browser dependency shipped to a first-time
founder.

The most useful number in the paper is the one nobody quotes: **flow efficiency lift is ≈ 0 across
all eight models** (+0.03 to +0.12) while feedback (+0.24 to +0.44) and scannability (+0.26 to +0.39)
carry nearly all the gain. **An AI UX review is good at "you're missing a loading state" and bad at
"this flow is wrong"** — and "walk the actual flow" is precisely what `/ux-check` claims to own.
That limit should be written down, not discovered per founder.

## If ADAPT — what changes
- **DOWN → `/ux-check`:** split findings into **observed** ("I ran it, here is the interaction") and
  **inferred from source** ("I read the code; I did not render this"), and say which. **Precedent is
  already inside BOSS** — `/persona`'s `Evidence ledger: synthetic <N%> · real <N%>`. This is
  composition, not a new idea (the EVID-001 mandate: compose + subtract, never add a skill).
- **DOWN → `/ux-check` steps 3–4:** contrast ratios, screen-reader output and focus visibility are
  **unobservable without rendering.** Report them as *not checked*, never as passes. This is the
  v0.229.0 lesson restated: **a check that did not run must not look like a check that passed.**
- **DOWN → `designer` agent:** its tool list contradicts the skill it owns. **Recommend subtracting
  the instruction, not adding Bash** — keep the designer read-only, let the founder (or the main
  session) do the walk, and have the designer read back what was observed. Adding a browser to a
  design agent is how BOSS becomes the framework its own Risk #1 warns about.
- **UP → `library/practices/ai-ux-patterns.md`:** record the ceiling — AI UX critique pays on
  feedback and scannability, not on flow. Cite the direction, never the +0.22.
- **REFUSED:** fixtures, repair-lift scoring, per-model leaderboards. BOSS does not pin model names
  (`library/practices/model-routing.md`), and a leaderboard from a v1 preprint with a 0.08 spread is
  exactly the number that would rot in a week.

## Attribution
**Verified.** The PDF was fetched and read directly with `pdftotext` rather than summarized — which
mattered: the WebFetch summary returned "not clearly extractable" for the repair-lift table and the
coverage-gate definition, i.e. the two load-bearing facts. Table 1 and §3.4 supplied both.
Repair agent is Claude Code; scoring judge is GPT-5.4-Mini; human validation n=6. All stated above.

## Notes
- Prior related verdicts: [[RVW-082]] (designer bridge / Figma seam — its refusal of the
  code→editable-design round-trip **still stands**; 2026 "agents write to Figma" claims remain
  secondary-blog-only, no vendor primary opened). [[RVW-051]] (two new AI-UX patterns).
  [[RVW-077]] (the content-design half).
- **Misattribution caught in the same sweep, recorded so it isn't repeated:** *"NN/g's State of UX
  2026"* does not verify — *The State of UX* is **UX Collective** (Teixeira & Braga). See RVW-093.
- BOSS version when recorded: 0.229.0
