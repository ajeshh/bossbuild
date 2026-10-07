---
id: IDEA-157
type: idea
kind: capability
owner: product-lead
status: shipped
shipped_on: 2026-10-07
proof: stages/L1-mvp/template/claude-append.md
created: 2026-10-07
relates: IDEA-153, IDEA-156, IDEA-085
gist: The rules a founder's session reads on every turn say the rule and where to look; the reasoning moves to the file that is opened when the rule applies.
---

# IDEA-157 — The rules read every turn

Ajesh, 2026-10-06, after IDEA-153: *"we are solving for breaking up some of them to make it less
expensive, lets continue with whats remaining in context and guadrailes and commit as needed"* — and
earlier, *"i thought its not abt lines but size"*. IDEA-156 broke up the skill bodies (paid per run);
this is the layer it left: what is paid on **every turn**.

## Measured first (2026-10-07, a throwaway project per mode, bytes; ~4 bytes/token)

| Mode | CLAUDE.md + AGENTS.md | Skill descriptions | Agent descriptions | Every turn |
|---|---|---|---|---|
| Quickstart | 6,954 | 4,734 (15) | 1,164 (4) | ≈3.2k tokens |
| MVP | 13,046 | 9,115 (29) | 3,615 (11) | ≈6.4k |
| V1 | 16,337 | 9,761 (31) | 3,615 (11) | ≈7.4k |
| Scale | 19,830 | 10,089 (32) | 3,951 (12) | ≈8.5k |

From MVP on, the instruction files are the largest layer, and descriptions already have a cap
(IDEA-085). The MVP block alone is ~6.5 KB, mostly the *why* of each rule — which already lives
where the rule is acted on (the reentry hook, the FEAT template's *Found while building* header,
`boss craft git-workflow`, `/close`, `/log`).

## The rule (IDEA-156's, applied to the always-on file)

1. The every-turn file keeps **the rule, in a line or two, and where to look**.
2. The reasoning lives in the file that is open when the rule applies. Check it is there before
   cutting it here — a move, not a loss.
3. A guardrail whose whole point is being in view before the act (the client-bundle secret, row-level
   security) stays whole.
4. What a check or a reader depends on stays: every shipped agent named in backticks
   (`check-manifests`), rule 5's loop line (`src/modes.js`).

## Tasks

- [x] T1 · MVP block (6,044 → 2,756 bytes) — rules in a line or two, the inventory folded
- [x] T2 · V1 (3,246 → 1,754) and Scale (3,439 → 2,185) blocks, same rule
- [x] T3 · Quickstart CLAUDE.md 4,707 → 2,620 (the mode table and arc walkthrough folded into `boss status` / one line). New projects only — the base file is the founder's; sync refreshes only the later blocks. AGENTS.md (2.3 KB) is rules, left as is.
- [x] T4 · Before/after table (below); existing projects get the shorter MVP/V1/Scale blocks through
  `boss sync` (untouched blocks only — a block the founder edited is left alone and named)
- [x] T5 · BOSS's own every-turn files: CLAUDE.md 11,281 → 5,310 (rules keep their ids; history and
  overview left to the records); the memory index 9,697 → 4,425 (outside the repo)
- [x] T6 · CHANGELOG bullet

## Result (2026-10-07, same measurement)

| Mode | CLAUDE.md + AGENTS.md | Every turn |
|---|---|---|
| Quickstart | 6,954 → 4,867 (−30%) | ≈3.2k → 2.7k tokens |
| MVP | 13,046 → 7,671 (−41%) | ≈6.4k → 5.1k |
| V1 | 16,337 → 9,470 (−42%) | ≈7.4k → 5.7k |
| Scale | 19,830 → 11,709 (−41%) | ≈8.5k → 6.4k |

What is left on every turn is mostly the skill and agent descriptions (~5–6k bytes at MVP+), already
under IDEA-085's per-description cap. The next cut there is fewer skills a rung loads, not shorter
descriptions — a product decision, not a trim.

## Log

- 2026-10-07 · captured with the measurement; built in worktree `idea-157`.
- 2026-10-07 · built: MVP, V1, Scale blocks; Quickstart CLAUDE.md; BOSS's CLAUDE.md; the memory index.
