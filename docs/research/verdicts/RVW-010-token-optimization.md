---
id: RVW-010
type: verdict
owner: product-lead
status: recorded
created: 2026-06-02
verdict: ADOPT
route: UP library/practices/ (context-discipline) + DOWN BOSS's own docs + template (path-scoped rules + deny)
---

# RVW-010 — structurally optimize Claude Code context (lean docs, scoped rules, deny, hook-filter)

## The claim
- **Source:** Hamza Farooq, "Claude Code token optimization." `docs/research/inbox/claude-code-token-optimization.md`
- **Core assertion:** *Cut context structurally: CLAUDE.md under ~500 tokens (strip what the model can
  infer); `.claudeignore` (advisory) vs `permissions.deny` (hard block); **path-scoped `.claude/rules/`
  that load only when a matching file is touched**; MCP overhead; PreToolUse hooks that compress noisy
  output before it enters context. (API caching is a separate, founders'-apps track.)*

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | **No — aligns sharply.** Path-scoped rules = "load it only when earned" = **PRINCIPLE #2 in the context window.** Lean docs = #3 (don't bloat). |
| 2 | Evidence grade | **Highest-rigor of the Hamza pieces** — "tested ~20 repos, only a couple worked," benchmarks, GitHub-issue citations, **public repo** (checkable). Still discount the author somewhat, but the *data* is real, not vibes. |
| 3 | Duplicate or sharpen? | **Multiple genuine sharpens.** Lean-CLAUDE.md extends [[RVW-002]] (and reframes it: BOSS's *own* CLAUDE.md may be over budget — token-audit it). `permissions.deny` = same mechanism as [[RVW-005]]. **Path-scoped `.claude/rules/` is genuinely NEW to BOSS.** |
| 4 | Who serves / harms? | Serves BOSS-internal (it's a heavy CC citizen: 14+ skills, long RESUME) **and** the scaffolded template. Low harm; risk = over-engineering the template with too many rules files. |
| 5 | Cost / ceremony | **Net lighter** (less always-loaded context). |

## Verdict: ADOPT

The cluster anchor, and the second clean ADOPT — with real **internal + product** action (not the
deferred founder-facing scope). It operationalizes RVW-002's instinct with a checkable method.

## If ADOPT / ADAPT
- **What to do →** hand to `/boss-learn` as **one synthesized "BOSS context discipline" practice**
  (UP `library/practices/`), with these facets:
  1. **Lean always-loaded docs** — token-audit BOSS's own `CLAUDE.md` against the <500-token / "only
     what surprises an experienced dev" test; apply [[RVW-002]]'s recency-window to `RESUME.md` State.
  2. **Path-scoped `.claude/rules/`** — the new pattern. For the template: scope rules by **mode /
     cohort** (MVP rules load in MVP; domain-expert rules only when relevant) = JIT context. Strong
     standalone UP candidate.
  3. **`permissions.deny`** — for secrets ([[RVW-005]]) *and* bloat (`node_modules/**`, `dist/**`,
     `*.lock`). One deny-block covers both.
  4. **Hook noise-filtering** — a PostToolUse log-compressor; native to BOSS's hook architecture.
- **⚠️ Verify before building:** several specifics are **Claude-Code-version-bound** (token floors,
  `.claude/rules/` `paths:` frontmatter, `ENABLE_TOOL_SEARCH`, the deny syntax). Confirm current
  behavior first — this is [[IDEA-014]] (recalibration) territory; don't encode a version-bound flag
  as permanent practice. Pull the public repo's real benchmark data at build time if useful.

## Notes
- **Cluster collapse:** [[RVW-002]] + [[RVW-005]] + this = ONE practice; [[RVW-009]] is its rationale;
  [[RVW-012]] is its enforce-in-harness backing. See the sweep summary's synthesized hand-off.
- Self-audit angle: BOSS may be a poster child for the bloat this measures — eat the dogfood.
- BOSS version when recorded: 0.41.0
