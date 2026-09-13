---
id: RVW-009
type: verdict
owner: product-lead
status: recorded
created: 2026-06-02
verdict: NOT-YET
route: n/a (reference — informs the cluster + conscience context-injection design)
---

# RVW-009 — context engineering + the four context failure modes

## The claim
- **Source:** Hamza Farooq & Jaya Rajwani, "Understanding Context Engineering." `docs/research/inbox/context-engineering-failure-modes.md`
- **Core assertion:** *Manage the context window deliberately. Four failure modes — poisoning,
  distraction (bigger ≠ better; a "distraction ceiling" ~100k tokens), confusion (cap tools ~10-15),
  clash (one unified prompt beats sharding across turns). Solutions: RAG, context quarantine,
  pruning, summarization, offloading.*

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No — loosely supports #3 (don't bloat). |
| 2 | Evidence grade | **Good — but borrowed.** The weight is in the *cited research* (DeepMind, Microsoft/Salesforce, LangChain), which is independent; the newsletter itself is Hamza-corpus (discount the wrapper, credit the citations). |
| 3 | Duplicate or sharpen? | **Neither — it's theory, not a practice.** It's the *rationale layer* under the cluster, not itself adoptable. |
| 4 | Who serves / harms? | Informs BOSS's own context design (conscience injection, doc length); no cohort-facing practice. |
| 5 | Cost / ceremony | N/A (reference). |

## Verdict: NOT-YET (reference — subsumed for now)

Not a standalone practice to adopt — it's the *why* behind concrete cluster items. Its real value:
- **It gives [[RVW-002]] a research-backed rationale** — "context distraction" is the *mechanism*
  explaining why BOSS's 650-line always-loaded `RESUME.md` is a real cost, not just untidiness. The
  *action* is RVW-002 + [[RVW-010]], not this.
- **It bears on the conscience's own design** — the hook injects `additionalContext` every prompt;
  "poisoning"/"distraction" are real risks if it fires often ([[IDEA-013]] over-fire smell), and
  "clash" is the v0.19 voice-fights-itself finding (the conscience contradicting CLAUDE.md). 

## If REJECT / NOT-YET
- **Why not (as a practice):** a survey, not a BOSS-adoptable practice; everything actionable is
  downstream in the cluster.
- **Re-open condition:** when BOSS next revisits **conscience context-injection** (what the hook puts
  in context) or builds a **context-budget check** — use the four failure modes as the design lens,
  and the "cap tools ~10-15" finding if BOSS ever ships many skills/MCP into one context (→ cohort/
  mode-scoped skill sets, which connects to [[RVW-010]]'s path-scoped rules).

## RE-OPENED 2026-06-20 (v0.63) — the condition fired

The re-open trigger ("when BOSS next revisits **conscience context-injection**") **was met**: v0.63
(IDEA-022 Track 4) made the conscience inject the **venture brain** into its composed context when a
moment fires. The four context failure modes are now directly load-bearing — and were handled, but
worth naming the mapping so it's deliberate:
- **Poisoning** (a wrong fact in context propagating) → mitigated by the explicit *"trust what you see
  now over the brain; the founder can correct it"* instruction.
- **Distraction / bloat** (too much context dilutes) → mitigated by the **bounded read** (standing
  summary + most-recent block only, ~1400-char cap), not the whole history.
- **Confusion** (irrelevant context) → mitigated by reading the brain **only when a moment fires**, not
  every prompt.
- **Clash** (context contradicts the live signal) → same trust-what-you-see rule resolves it.
**Verdict update:** NOT-YET → **partially ADOPTED in practice** (the four-mode lens was applied to the
brain injection). Remaining: a formal *context-budget check* if BOSS ever ships many skills/MCP into one
context (still NOT-YET; ties to path-scoped rules [[RVW-010]]). Source kept in `reviewed/not-yet/`.

## Notes
- Cited research is the independent evidence; author-concentration discount applies to the wrapper.
- BOSS version when recorded: 0.41.0
