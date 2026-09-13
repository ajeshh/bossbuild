---
id: RVW-002
type: verdict
owner: product-lead
status: recorded
created: 2026-06-02
verdict: ADAPT
route: DOWN docs/RESUME.md (+ UP candidate library/practices/)
---

# RVW-002 — keep the always-loaded doc lean; archive history ("3 most recent updates")

## The claim
- **Source:** Reddit comment (slaorta), same thread as RVW-001. Their own working CLAUDE.md pattern.
- **Core assertion:** *Keep CLAUDE.md concise and scannable — brief 5-15 line concept overviews,
  references to detailed docs, an env-vars table, endpoints; NOT detailed implementation / long schema
  examples / >6-step workflows. And: show only the **3 most recent updates** in CLAUDE.md, moving the
  oldest to `docs/archive/CHANGELOG.md`.*
- **Inbox file:** `docs/research/inbox/slaorta-lean-claude-md-modular-docs.md`

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | **No** — aligns. Leanness + "details live in decoupled docs you reference" is PRINCIPLE #3 (nothing valuable locked in; decoupled nameable structure) and #2 (no premature ceremony in the file you read every session). |
| 2 | Evidence grade | **Single practitioner's working convention** (n=1, "copied from one of my projects"). But it's a *documentation-hygiene* convention, not an outcome claim — lower stakes, self-consistent, easy to reverse. Sound craft, modestly evidenced. |
| 3 | Duplicate or sharpen? | **Sharpen — and it lands on a real BOSS smell.** BOSS's CLAUDE.md is already fairly lean and reference-based (this half is duplicate). But the *recency-window* idea exposes that **`RESUME.md`'s "State" section is an ever-growing append log** — ~25 fat entries back to v0.6, 650+ lines, read at the start of *every* session — that **largely duplicates the per-version detail already in `registry/CHANGELOG.md`.** That's the sharpen. |
| 4 | Who serves / harms? | **Serves the maintainer** (Ajesh + every future session) — less stale context loaded at boot, faster orientation. No cohort harmed; if ever made founder-facing, lean docs help all cohorts. Low harm. |
| 5 | Cost / ceremony | **Net lighter** — actively reduces the always-loaded surface (R&H #1 mitigation: BOSS not bloating). The only cost is the small discipline of trimming, and BOSS *already has the archive* (`registry/CHANGELOG.md` holds the full history). |

## Verdict: ADAPT

Not the literal CLAUDE.md rules (BOSS's CLAUDE.md is already lean) — but the **recency-window
principle, applied to `RESUME.md`'s State section.** Today that section duplicates `CHANGELOG.md`
and grows unbounded, so every session boots by reading ~650 lines, most of them ancient. The
adaptation: **keep the most recent ~3-5 State entries in RESUME; trust `registry/CHANGELOG.md` for
the full history; trim/point-to-it for the rest.** The original "archive to `docs/archive/CHANGELOG.md`"
step is unnecessary for BOSS — the archive already exists.

## If ADOPT / ADAPT
- **What to do (DOWN, BOSS-local):** trim `RESUME.md` State to a recency window (most recent ~3-5
  capability entries), replacing the older fat entries with a one-line pointer to `registry/CHANGELOG.md`
  (which already carries the detail). Keep *Next tasks* + *Open decisions* intact — those are live
  state, not history. **Confirm before cutting** — the fat entries do carry at-a-glance narrative some
  sessions lean on; the trade is boot-context size vs. inline history. Ajesh's call on the window size.
- **What's modified from the claim:** "3 most recent" → "~3-5" (BOSS's entries are denser); "archive
  to `docs/archive/CHANGELOG.md`" → "point to the existing `registry/CHANGELOG.md`"; scope shifted
  from CLAUDE.md (already lean) → RESUME.md State (the actual offender).
- **UP candidate (generalizable shape):** *"the always-loaded session-state doc keeps a recency
  window; full history lives in the changelog it already maintains."* Every BOSS project has a
  `RESUME.md` + a `CHANGELOG`, so this is a real superset practice → `library/practices/`. Hand to
  `/boss-learn` if Ajesh wants it promoted (it may re-route or decline — the check on the check).

## Notes
- Prior related verdicts: [[RVW-001]] (same thread; the headline claim, REJECTED).
- This is the first ADAPT — useful counterweight to RVW-001's REJECT (the skill isn't reflexively
  saying no; it routes on the merits).
- BOSS version when recorded: 0.40.1
