---
id: RVW-085
type: verdict
owner: product-lead
status: recorded
created: 2026-08-24
verdict: ADAPT
route: DOWN stages/L0-quickstart/template/.claude/skills/prototype (the "Mock freely" rule, ~line 104)
sources:
  - https://www.rfc-editor.org/rfc/rfc2606
  - https://www.nature.com/articles/s43856-025-01021-3
  - https://jamanetwork.com/journals/jamaophthalmology/fullarticle/2811505
  - https://www.theregister.com/2025/07/21/replit_saastr_vibe_coding_incident/
---

# RVW-085 — "mock data should be right in SHAPE and unmistakably fake in CONTENT"

## The claim
- **Source:** session record §4.2, already 3-vote-narrowed.
- **Core assertion:** replace *"Mock freely… fake responses — all fine"* with structure-real +
  content-unmistakably-synthetic, and *never invent a domain value that could be mistaken for a fact.*
- **Opposite claim already killed:** "mock data should be domain-realistic" (no control condition;
  the belief was written into the source paper's own system prompt).

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | **Split.** The *content* half aligns with #6 and the pseudo-app thesis. The *shape* half brushes **#2** — edge-case mock coverage inside a skill whose own rule is *"don't gold-plate a throwaway."* |
| 2 | Evidence grade | **Mechanism-strong, incident-inferred, out-of-domain.** Omar/Taloni are clinical-research; Replit is an agent incident, not a prototype demo. No documented case of a *prototype's* mock data being taken as real. Convention precedent (RFC 2606, 555-01xx, Luhn-valid) is settled engineering practice. |
| 3 | Duplicate or sharpen? | **Sharpen.** *"Fake"* licenses fabrication but constrains nothing about **plausibility**. `claims-fabricated-activity` and `voice-hallucination-as-truth` are both already ADOPTED for the product surface — this one sentence is the only place in the template leaning the other way. The `domain-expert` guardrail covers real data going **in**; nothing covered plausible fake data coming **out**. |
| 4 | Serves / harms? | 🔑 **The founder never reads SKILL.md — the rule instructs the model.** So "a longer rule confuses a beginner" is mostly imaginary: `Pat Placeholder` renders as fast as `Pat Morrison`. Serves `domain-expert` squarely. The real harm is the *shape* half telling the model to build empty states and layout-breaking names — that gold-plates the sketch and costs the beginner their minute-to-click. |
| 5 | Cost / ceremony | Proposed ≈70 words vs current 25. **A ~50-word form keeping the "Mock freely" header and adding only the content constraint gets ~90% of the value.** |

## Verdict: ADAPT
The current wording's consumer is the model, and *"fake responses — all fine"* constrains speed but
not plausibility — the one axis where the model's documented default (fabricating seemingly-authentic
domain data) collides with BOSS's founding thesis and two already-adopted deceptive patterns. That
half is a genuine sharpening costing the founder nothing. **The shape half is robustness ceremony
smuggled into a speed skill and is dropped.**

## If ADOPT / ADAPT
- **What to do (exact wording):**
  > **Mock freely — and make fake data look fake.** Hardcoded values, canned responses, no backend —
  > that's the point of a sketch. Keep the values unmistakably synthetic (`example.com`, `555-0155`,
  > "Pat Placeholder"); never invent a plausible domain fact — a lab value, a dosage, a citation, a
  > price. Mock data that looks real fools people, starting with you.
- **Dropped from the claim:** the entire shape prescription (realistic lengths, layout-breaking names,
  empty state, zero row).
- **The `domain-expert` cohort guardrail stays untouched** — it covers real data going in; this covers
  fake data coming out. Complementary, not overlapping.

## Attribution
**Verified.** RFC 2606 `.invalid` rationale, NANP 555-0100–0199, Omar et al. 50–82% (not the
"up to 83%" some secondaries render), Taloni "300 eyes belonging to 250 patients", Replit 4,000
fictional records — all read against primaries.

## Notes
- **Re-open condition for the dropped shape half:** a founder's sketch observed misleading on *shape*
  grounds, at observed-behavior not mechanism.
- **The content half's hazard remains inferred.** The first observed "someone took the demo data as
  real" event should be captured as an `EVID` and would upgrade this from convention-alignment to
  incident-grounded.
- BOSS version when recorded: 0.222.0 (in flight, peer-held).
