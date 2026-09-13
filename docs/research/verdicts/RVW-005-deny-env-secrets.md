---
id: RVW-005
type: verdict
owner: product-lead
status: recorded
created: 2026-06-02
verdict: ADOPT
route: UP library/hooks/ (secrets-guard PreToolUse) + template .claude/settings.json deny default
---

# RVW-005 — hard-deny Claude from reading .env / secrets (don't trust prompting)

## The claim
- **Source:** Reddit "Resource" PSA + comments (tonyboi76, lambda-legend). `docs/research/inbox/deny-claude-reading-env-secrets.md`
- **Core assertion:** *Don't rely on prompting Claude to avoid secrets — add a hard `permissions.deny`
  rule (`Read(./.env)`, `Read(./.env.*)`, `Read(./secrets/**)`). For full coverage also deny Bash
  bypasses, or better, a **PreToolUse hook** that blocks any tool touching secret paths (catches MCP +
  future skills); gitignore + a secret manager is the eventual floor→ceiling.*

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | **No** — serves #5 (safe defaults) and #6 (harm prevention). |
| 2 | Evidence grade | **Strong + cross-source.** Practitioner PSA with a well-reasoned thread (the Read-tool-only-vs-Bash-bypass nuance is real craft), and **independently confirmed** by the enforce-in-harness principle in [[RVW-012]] and the `permissions.deny` technique in [[RVW-010]] — three distinct angles, not one author. |
| 3 | Duplicate or sharpen? | **New (pending check).** BOSS merges hooks additively and ships a template, but does not (apparently) ship a secrets **deny-list** or a secrets-guard hook. Verify the template/gitignore before building. |
| 4 | Who serves / harms? | Serves **every cohort**, acutely `domain-expert` (PHI/regulated) and beginners (`first-product`/`vibe-coder-newbie` who commit keys because the AI hardcoded them). No cohort harmed. |
| 5 | Cost / ceremony | **Net lighter/safer** — a few deny lines + one hook. A safe default, not ceremony. |

## Verdict: ADOPT

The strongest, best-evidenced, most actionable drop in the batch — and it's a **BOSS product action,
not the deferred founder-facing scope:** the template + `library/` are what BOSS ships and syncs, so
hardening the scaffolded default is core BOSS work. "Enforce in the harness, don't trust the model to
refuse" ([[RVW-012]]) is the principle; this is its concrete safe-default.

## If ADOPT / ADAPT
- **What to do →** hand to `/boss-learn`:
  - **UP** `library/hooks/` — a **secrets-guard PreToolUse hook** (blocks Read + Bash touching
    `.env`/`secrets/**`; catches MCP + skills added later). Architecturally native (BOSS already ships
    a `UserPromptSubmit` conscience hook + merges hook registrations).
  - **Template default** — a `permissions.deny` block for `.env`/secrets in the Quickstart/MVP
    `.claude/settings.json`, plus `.env*` in the template `.gitignore`.
- **⚠️ Verify before building:** (a) confirm the current Claude Code `permissions.deny` syntax +
  PreToolUse hook behavior (the PSA is secondhand); (b) check the existing template doesn't already
  cover this. **Vet/build together with [[RVW-010]]** — its `permissions.deny` for *bloat*
  (`node_modules/**`, `dist/**`) is the same mechanism; one hook + one deny-block covers both
  secrets and context-bloat.

## Notes
- Part of the **context-discipline cluster** ([[RVW-002]], [[RVW-009]], [[RVW-010]], [[RVW-012]]) —
  see the synthesized hand-off.
- BOSS version when recorded: 0.41.0
