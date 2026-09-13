---
id: RVW-074
type: verdict
owner: product-lead
status: recorded
created: 2026-08-17
verdict: REJECT
route: n/a (spin-off hygiene fix applied to git-workflow.md)
---

# RVW-074 — the AI review bottleneck is pickup latency + batch size, not review speed

## The claim
- **Source:** LinearB 2026 benchmarks · CircleCI 2026 · 2026 State of Code survey · CodeRabbit ·
  GitHub-internal via practitioner writeups. All vendor or practitioner.
- **Core assertion:** reframe `git-workflow.md` from "review is the bottleneck" to "**pickup latency**
  is the bottleneck, and **batch size** is what you control" — AI PRs wait ~4.6× (agentic ~5.3×) before
  pickup and are ~2.6× larger.
- **Inbox file:** `docs/research/inbox/review-queue-latency-not-review-speed-2026.md`

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No hard contradiction; soft tension with **#2**. Pickup latency is team-queue mechanics and BOSS's validated cohort is **solo** — teaching queue dynamics to `first-product` or `vibe-coder-newbie` is ceremony ahead of the rung that earned it. |
| 2 | Evidence grade | Every load-bearing multiplier (4.6× / 5.3× / 2.6× / 1.7× / +59% / 96%) is **vendor [THOUGHT-LEAD], unverified to primary sources, and every named vendor profits from the conclusion.** The only non-vendor corroboration — DORA, *ROI of AI-Assisted Software Development* (2026.01) — corroborates **direction only** (a growing queue of unreviewed PRs absorbs the gains), which is the thesis the practice already opens with. |
| 3 | Duplicate or sharpen? | **Duplicate.** Batch size is already the practice's organizing frame five times over: "batches small enough," branches that live "hours, not days," "merge small — that's the whole discipline," blanket review "kills small batches," "the batch stays small and the review stays real," plus vertical slices. Sharper still: **the pickup-latency stat was already in the file** — and the practice still, correctly, framed the cap as *review capacity*. |
| 4 | Who serves / harms? | The reframe **misdescribes the solo bottleneck.** For every validated cohort a 400-line agent PR doesn't *wait* — there's nobody to wait for; it gets **merged unread**. The solo failure mode is rubber-stamping, which the practice already names ("unreviewed code with your name on the merge"). "Pickup latency is the bottleneck" implies the fix is faster pickup; the solo fix is diffs small enough to actually read. |
| 5 | Cost / ceremony | Cheap in bytes, but an **add, not a compose** — a second bottleneck vocabulary layered on a frame that is already correct for the cohort. EVID-001 and Risk #1 both cut against it. |

## Verdict: REJECT
The claimed "new lever" is the practice's existing organizing frame — `git-workflow.md` already caps
batch size in time units, already caps parallelism at review capacity, and already carried the
pickup-latency stat while keeping the review-capacity framing, because for one or two humans the queue
and the reviewer are the same person. The numbers that would justify the sharper reframe are
unverifiable vendor multipliers; the one non-vendor source corroborates the practice's *current*
thesis, not its replacement. Per [[RVW-024]], outside confirmation of an existing bet is a
REJECT-with-memory, not an adoption.

**Killing finding:** duplicate — the practice already contains both the lever and the stat — compounded
by vendor-only evidence for everything genuinely new, and a cohort mismatch that would make the
practice *less* true for the founders BOSS has actually validated.

**Re-open condition:** both of — (a) IDEA-037 graduates and a second human is actually picking up PRs in
a BOSS project, and (b) the latency/batch numbers appear in a non-vendor source. Then it earns a fresh
vet as a *team-layer* addition, not a rewrite of the solo frame.

## Separate ruling — the "review sandwich": REJECT as pitched
1. **Evidence:** the 30–50% figure is the product vendor's own number, reported second-hand — the worst
   grade in the file.
2. **Duplicate where it's safe:** the defensible core (an automated pass carries the cheap tier) already
   ships — "let the gate carry it," with `/smoke` + `/evals` + `/red-team` as the high-risk tier.
3. **Harmful where it's novel:** an AI blessing the AI's diff so the human reads *less* directly erodes
   **"whoever clicks merge owns what the agent wrote."** Selling reduced human attention as the benefit
   is the exact self-fooling the practice exists to prevent.

**Re-open condition:** non-vendor evidence measured in **defects reaching the human-owned merge** (not
reviewer-minutes saved), plus a framing that reinvests the freed attention into the high-risk tier.

## Spin-off correction — APPLIED (a subtraction, not an adoption)
This vet found a defect in the *existing* practice, independent of the claim's fate: `git-workflow.md`
read "(DORA names it directly; agentic PRs already sit ~5.3× longer before pickup)" — an unverifiable
vendor multiplier sitting adjacent to a DORA attribution, exactly the lane-blend `SOURCES.md` forbids.
**Fixed by subtraction:** the multiplier is cut, the direction kept and correctly sourced to DORA's
*ROI of AI-Assisted Software Development* (2026.01); the header's `~4×`/`~12%` are now stated as a gap
with their grade named rather than as precise figures.

**Numbers ruling, binding on future edits:** may cite the DORA 2026.01 *direction* — "more changes
waiting for review… a growing queue of unreviewed pull requests absorbs the productivity gains" — and
never as "State of DevOps 2026." May **not** cite as load-bearing: 4.6×, 5.3×, 2.6×, 1.7×, +59%, 96%,
30–50%.

## Notes
- Prior related: [[RVW-024]] (governing precedent — confirmation of an existing bet → REJECT with the
  side-finding spun off), [[RVW-053]] (review-ownership lineage), [[RVW-055]] (NOT-YET precedent,
  declined here because duplicates don't ripen), [[RVW-076]] (the sibling DORA-misattribution catch).
- BOSS version when recorded: 0.150.0
