---
id: IDEA-125
type: idea
kind: capability
owner: Ajesh
status: seedling
proof: none
proof_note: a decision first — which merges, if any — then each merge proves itself by a skill count and a /skill-doctor pass that still fires the merged skill on its old trigger phrases
gist: Spun out of IDEA-121 — skills that overlap in job, not text, and could merge under the subtract mandate. health+measure+onboard, ai-first-init as the earned lay-down message, ai-cost+cost-review. ~28 → 24 at MVP. A product call, not a mechanical one.
created: 2026-09-23
relates: IDEA-121, IDEA-114
---

# IDEA-125 — Merge the overlapping MVP skills

## Current shape

From the 2026-09-23 review (IDEA-121, shipped-content lane). The overlaps are in **job**, not text —
pairs share 0–1 sentences — so no gate can see them, and merging changes what a founder types.

| Candidate | Evidence | Would become |
|---|---|---|
| `/health` + `/measure` + `/onboard` | `/health` already "routes to the fix"; references `/measure` ×4; `/onboard` references `/measure` ×4 and `/health` ×2 | `/health` with measure-setup and onboarding sections (4 → 2 with `/roadmap` kept) |
| `/ai-first-init` | a pure conductor over the other four AI skills | the earned group's lay-down message does the conducting (5 → 4) |
| `/ai-cost` + `/cost-review` | "closes the cadence /ai-cost only declared" | `/ai-cost [review]` (→ 3 with the one above) |
| `/design-review` + `/ux-check` | "same lens, different timing", 40KB of bodies | lowest priority — `designer` owns both |

**Explicitly not merged:** `/evidence` + `/interview` (prep vs record are different jobs), `/drift-deep`
("the audit, not the tripwire"), `/money` (already a router).

## Open questions

- Which of the four, if any? Each one is a verb a founder may already have in muscle memory — a merge
  needs a `supersedes.json` entry and a sync migration, not just a deletion.
- Does a merged skill still fire on the old trigger phrases? Check with `/skill-doctor` or the plugin
  eval before and after.
