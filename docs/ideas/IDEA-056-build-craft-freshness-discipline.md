---
id: IDEA-056
type: idea
owner: mentor-architect
status: shipped (v0.135)
program: standing-freshness
proof: .claude/skills/practice-refresh
created: 2026-07-30
source: Ajesh, 2026-07-30 — "lets review thru mentors, experts best practices around building with AI,
  that is now outdated in our approach. Lets also create a process way to check and update as needed
  for our process. around building, maintaining agents, mcp, design processes, security, db design,
  testing, anything else anything to ensure we keep it fresh."
---

# IDEA-056 — the build-craft stays fresh (the third standing discipline)

> **The staleness-twin of [[IDEA-042]] (`/humane-refresh`) and [[IDEA-014]] (`/recalibrate`), pointed at the
> thing BOSS mostly *is*: the build craft.** Same seed shape as IDEA-042 — *"keep checking, since it keeps
> changing… design more process to easily run"* — a year of that instinct proving right.

## The seed

Ajesh asked two things at once: *what's outdated?*, and *how do we stop having to ask?* The second is the
durable one. The first is a symptom that a mechanism was missing.

## The gap it names

BOSS had **two** anti-rot disciplines and **zero** for the build craft:

| Curve | Discipline | Covered? |
|---|---|---|
| dark patterns / harm / regulation | `/humane-refresh` ([[IDEA-042]]) | ✅ since v0.95.0 |
| frontier-model capability + price | `/recalibrate` ([[IDEA-014]]) | ✅ since v0.101.0 |
| **agents · MCP · host · security · data · testing · design · deploy** | **nothing** | ❌ |

The 25-practice shelf came out of two big sweeps (2026-06-20, 2026-07-23). Good sweeps — but **snapshots**,
with no date, no owner, and no trigger.

**The sharpest framing, and the reason this is a Principle-#1 catch rather than a feature request: BOSS ships
a staleness discipline to founders that it does not apply to itself.** `/practice` writes `review_by:` onto a
founder's craft record and warns them the AI craft moves fast enough to go quietly out of date. BOSS's own
practices carried no such field; two had no frontmatter at all.

## What the audit found (full record: [SESSION-2026-07-30-craft-staleness-audit](../research/sessions/SESSION-2026-07-30-craft-staleness-audit.md))

1. **🔴 `mcp.md` is wrong today** — it describes the 2026-07-28 spec revision as forthcoming and the ground as
   "still moving." It shipped 2026-07-28 (stateless core, extensions framework, OAuth hardening) — and
   settled *in order to* stop moving. Also silently opens the deferred `/mcp` gate. **7 days old.**
2. **Coverage gaps in two domains Ajesh named** — no `data-and-schema` practice, no `testing` practice. Both
   live only inside agent prompts (`db-architect`, `tester`), which carry no provenance, no `/vet`, no dates.
3. **Two cross-doc holes** — `ship-it-live` names the RLS breach class; `db-architect` never says "RLS."
   `git-workflow` says *read the test diff harder than the code*; `tester` doesn't carry it.
4. **The shelf was invisible to its own maintenance** — `design-system.md` + `skill-authoring.md` had no
   frontmatter, so nothing could report them stale.
5. **The host binding is the widest uncovered surface** — 31 skills / 15 agents / 4 hooks in
   `stages/*/template/.claude/`, all host-shaped, zero freshness metadata. Named, not fixed.

## The decision: cadence AND events, because cadence alone provably fails

The first run of the new checker reported **25 fresh, 0 overdue** — while `mcp.md` was already wrong.
A quarterly cadence would have caught it in October. **A doc doesn't rot because time passed; it rots because
the ground under it moved.** So:

- `curve:` on every practice names *which ground* — which sets the cadence *and* routes to whichever
  discipline owns it (`model` → `/recalibrate`, `humane` → `/humane-refresh`, the rest → `/practice-refresh`).
- The watchlist carries per-domain **event triggers** (a spec revision, a new frontier model, a breach, a
  host deprecation) that fire a refresh on the spot, date irrelevant.

## Built (v0.135.0)

- **Freshness frontmatter** on all 25 practices — `last_reviewed:` / `review_by:` / `curve:`. `review_by:` is
  deliberately the same field `/practice` writes for founders: one discipline, two altitudes.
- **`npm run check:freshness`** (`scripts/check-freshness.js`) — zero-dep, reuses `parseFrontmatter` +
  `BOSS_ROOT`. Reports overdue + owner. Errors only on *unreadable* metadata; overdue is information, not a
  ship-blocker. Wired into the release gate on the gate's own terms (it caught a real shipped defect).
- **[`/practice-refresh`](../../.claude/skills/practice-refresh/SKILL.md)** — orchestrates what exists:
  `check:freshness` schedules → `/deep-research` finds → `/vet` judges → `/boss-learn` routes → re-stamp.
- **[`watchlists/build-craft.md`](../research/watchlists/build-craft.md)** — 10 domains, their taps, their
  event triggers, the standing query.

**Design choices held:** hunt for what's **wrong**, not just what's missing (the difference from
`/humane-refresh`, which mostly adds — and `boss sync` is actively pushing stale guidance into real
projects); `/vet`'s NO-bias applies to *additions*, not reversals (skepticism that only protects the status
quo is how a shelf rots); **stamp even when nothing changed** ("checked, still correct" is the deliverable);
correct in place rather than appending dated addenda; prefer subtraction.

**Internal only** — sits with `/vet` and `/humane-refresh`, not in the founder template. The founder surface
is under an explicit compose-and-subtract mandate ([[EVID-001]]); this adds nothing to it.

## Queued, deliberately not built

Findings aren't builds — each is Ajesh's call. In value order: **(1)** refresh `mcp.md` against the shipped
spec + reopen the `/mcp` deferral (the first live run of the new discipline); **(2)** RLS into
`db-architect`; **(3)** the test-diff discipline into `tester`; **(4)** a `data-and-schema` practice;
**(5)** a `testing` practice; **(6)** a `design-system.md` review; **(7)** freshness metadata for the
template surface.

> The honest line still holds: none of this moves the riskiest assumption — only founder contact does. What
> it buys is that when a founder *does* arrive, BOSS isn't confidently describing a spec that shipped last
> Tuesday.
