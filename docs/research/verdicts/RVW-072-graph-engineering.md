---
id: RVW-072
type: verdict
owner: product-lead
status: recorded
created: 2026-08-17
verdict: REJECT
route: n/a
---

# RVW-072 — re-architect BOSS around "graph engineering" (Karpathy ladder: loop → graph)

## The claim
- **Source:** Substack derivative of Karpathy's Stanford lecture "Delete Everything, Keep Graph"
  (~July 2026; ladder LLM→Prompt→Agent→Loop→Graph); corroborating-season signals: Anthropic 2026
  Agentic Coding Trends Report ("orchestration era" + delegation gap + "start with ONE controlled
  workflow"), Cognition's revision of "Don't Build Multi-Agents" → manager + **single-writer**.
  Provenance verified 2026-08-17 (the second shared video was Karpathy's older LLM explainer,
  unrelated).
- **Core assertion (load-bearing):** BOSS should re-architect as an explicit execution graph.
  (Weaker form: adopt the lens — the ladder extension, the four shapes chain/diamond/router/
  controlled-cycle, single-writer — into the practice shelf now.)
- **Inbox file:** `docs/research/inbox/graph-engineering-agent-systems.md`

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | **Strong form: yes — #2** (architecture-level ceremony for n=0 validated founders) and inverts **#1/#4** (practices are *outputs* of the proven-work loop, not imports from a lecture). A graph runtime in `src/` re-rolls the host's Workflow primitive — `harness-engineering.md`'s own "don't author what the host ships" names that **drift**. Weak form: no textual contradiction, but re-runs the exact move RVW-065 ruled NOT-YET. |
| 2 | Evidence grade | **Respected-practitioner thesis** (Karpathy; top-tier authority, zero production data) — and **self-undermining**: the delegation gap (fully delegate 0–20%, supervise 80–100%), "one controlled workflow," and single-writer are evidence *for* BOSS's existing bet (RVW-024/IDEA-028), not for living at the graph rung. Authority is an input, not a verdict (RVW-001). |
| 3 | Duplicate or sharpen? | **Mostly duplicate.** Ladder progression + seam rule already in `harness-engineering.md`; the pattern catalog is the host's Workflow primitive; single-driver already ruled (RVW-024 — Cognition 2026 *sharpens* it, doesn't retract); BOSS's flows already graph-shaped where it pays (`/practice-refresh`,`/humane-refresh` = diamond+gate+router; conscience = gate; `RESUME.md` = durable state; verdicts ledger = the seen-set). Residue: four-shapes vocabulary + naming loop/graph as host seams — inside RVW-065's deferred territory, re-open condition unfired. |
| 4 | Who serves / harms? | Serves `eng-builder`; **flatters `vibe-virtuoso`** (feeds sophistication-over-traction, the cohort's pathology). Harms `first-product`/`vibe-coder-newbie`/`non-tech-founder` (topology-as-ceremony). The EVID-001 founder's own fear was bloat; the recorded answer was compose + subtract. Shelf growth is Canvas Risk #1, "materializing." |
| 5 | Cost / ceremony | Strong form is the maximal violation of EVID-001 ("capture + re-aim, **build nothing yet**") and the canvas's own line: *"building more is now, definitionally, building around the risk."* Weak form is cheap in diff but not in the currency the canvas measures (surface); the scheduled freshness pass (`review_by: 2026-11-09`) re-weighs the vocabulary within a quarter for free. |

## Verdict: REJECT
The claim's own best evidence prescribes BOSS's shipped architecture: delegation gap + "one
controlled workflow" + manager/single-writer all converge on *single durable judgment layer +
verification gates + rented execution* — which is RVW-024. The host already ships the graph runtime
(Claude Code's Workflow primitive), so authoring one is drift by BOSS's own seam rule; and the
article's own exit clause ("keep one agent in one loop when the task is short, one context holds it,
failure is cheap, a human reviews quickly") describes BOSS's core exactly. Its last checklist line —
*"Is the graph simpler than the problem? If no, delete nodes"* — is the REJECT in the author's own
words.

## If REJECT / NOT-YET
- **Why not:** duplicate-plus-drift under a frozen build. The weak form was already adjudicated
  (RVW-065, NOT-YET, re-open condition unfired) — a bigger name doesn't buy a different verdict for
  the same claim shape; that's what the ledger is *for*.
- **Re-open conditions (residue only — four-shapes vocabulary + loop/graph seam-naming):**
  1. RVW-065's condition fires: a real founder build ships an agent-loop/graph-shaped system and
     gets stuck → then a host-neutral, vocabulary-only note (name the seam, point at the host's
     Workflow primitive, cite single-writer as RVW-024-sharpened).
  2. The `harness-engineering.md` freshness review (due 2026-11-09) folds the rung-naming in as part
     of a sweep it's already paying for.
  3. EVID-001 lifts (second external signal, or stated-pain → observed-behavior).
  The **re-architecture itself has no re-open condition** — "don't author what the host ships" makes
  it category-wrong, not early.
- **Strongest counterargument, answered:** a two-sentence seam note is arguably "naming the seam,"
  which the practice endorses — capture, not build. Answer: the canvas counts shelf growth as
  Risk-#1 surface, RVW-065 already priced this sliver as NOT-YET, and the freshness pass reconsiders
  it within three months. Waiting costs nothing; an authority exception costs the ledger's integrity.

## Notes
- Prior related: RVW-024 (single driver > swarm; Cognition 2026 sharpens, doesn't retract), RVW-065
  (governs the residue), RVW-012 / RVW-009 (the model: theory held until live work earned it),
  RVW-001 (authority ≠ verdict), RVW-070, IDEA-028 (keep judgment, rent execution).
- Verdict pass run as an independent NO-biased Fable subagent per the skill's model-routing note;
  it overruled the capturing session's ADAPT lean — the check on the check, working as designed.
- BOSS version when recorded: 0.149.0
