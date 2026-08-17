---
id: design-tokens-loop
type: loop
stage: L1-mvp
runner_type: hook
attributed_to: [Brad Frost, Nathan Curtis, Ajesh Shah]
also_relevant: [Jina Anne, Diana Mounter, Dan Mall, John Maeda]
entry:
  - count_at_least:
      path_glob: src/**
      pattern: '(className=|style={|css`|styled\.)'
      min: 3
exit:
  - exists: { path: docs/design/DESIGN_TOKENS.md }
  - count_at_least:
      path_glob: src/**
      pattern: '(token\.|var\(--|colors\.|tokens\.|theme\.)'
      min: 3
drift_moment: coherence
---

# Loop: design-tokens (MVP)

The discipline that **prevents the 47 blues** (`boss craft design-system`).
The most-common AI-generated-UI failure mode: each new screen Claude generates derives its own
colors, spacing, components — and the codebase grows linearly with screens. This loop catches
that early, JIT, *only when UI is actually accumulating.*

`runner_type: hook` — the conscience hook evaluates this loop on every UserPromptSubmit. But the
loop is structured so it **doesn't fire on fresh projects** (the entry predicate requires ≥3
style declarations across `src/`; a brand-new repo has 0). It opens only when the founder has
started accumulating UI — *the first UI commit inflection* (the early-start JIT rule).

When open, the conscience surfaces a `coherence` moment (new in v0.21.0 — a flavor of caution
specific to system-vs-code drift): *"You're putting style into code without a token system. The
AI doesn't have a reference, so each screen will reinvent colors and spacing — fast-forward to
the 47 blues. Want me to run `/design-tokens-init` now?"*

## Entry artifact

`src/` contains ≥3 source files with inline style declarations (matched by a regex covering
common patterns: Tailwind `className=`, inline `style={}`, css-in-js template literals, styled-
components syntax). Threshold of 3 is the *"the first UI commit"* signal — one or two are an
exploratory file; three is the founder starting to *build*. Stack-agnostic enough to catch most
common React / Vue / Svelte / Solid projects today.

For projects in stacks the regex misses, the founder can either:
- Edit this loop spec's entry pattern to match their stack
- Or simply run `/design-tokens-init` manually (the loop respects override)

## Purpose

Scaffold the minimum three-layer design token system *before* drift accumulates. Cohort-aware
delivery (per `/design-tokens-init`): vibe-coder-newbie gets SHOWING; eng-builder gets OFFERING;
vibe-virtuoso gets OVERRIDE-FRIENDLY; etc.

## Exit artifact

`docs/design/DESIGN_TOKENS.md` exists AND code references tokens (≥3 occurrences across `src/`
of patterns like `token.`, `var(--`, `colors.` (when a tokens module is imported), `tokens.`,
`theme.` — covers most token-consumption styles). The dual requirement matters: a tokens file
without any code consuming it is theater, not discipline.

## Drift

Entry satisfied (≥3 style declarations) AND exit not satisfied (no tokens file OR no token refs)
→ loop is open → conscience emits `coherence` moment. Confidence scales:
- 3-5 style declarations: low confidence (might be exploratory)
- 6-10: medium
- 11+: high (real drift)

The voice (cohort-aware via v0.20's framing): name the drift in one line, offer to scaffold,
hand the decision back. Override is recorded in devlog per IDEA-008.

## How to remix

- **Skip:** legitimate when the project's UI is genuinely throwaway (an internal admin script,
  a one-off demo). Override:
  ```
  - **OVERRIDE:** skipped `design-tokens-loop` — rationale: <UI is throwaway —
    e.g., admin script for personal use; not user-facing; not maintained beyond
    this build>.
  ```
- **Swap discipline:** Frost-Atomic-Design lineage vs. Curtis-tokens-layer-cake vs. a stack-
  native pattern (e.g., Mantine's theme tokens; Chakra's theme; Tailwind's config). The loop's
  exit predicate checks for token *consumption*, not a specific tool. If a stack needs its own adapter,
  author it as a project practice via `/practice` — BOSS ships no per-stack token adapters.
- **Author your own:** a domain-specific scaling discipline (e.g., a `data-vocabulary-loop` for
  a project where the load-bearing standardization is API field names, not visual style).

## When this loop re-opens

- Tokens file deleted or renamed without code update → exit predicate fails again
- New UI added in a way that bypasses tokens (raw hex codes proliferate) → arguably should
  re-open; today's predicate doesn't catch this (it just checks for *some* token consumption).
  The v0.22 design-drift-loop will catch this case.
- Stack migration (e.g., Mantine → Tailwind) → exit predicate may transiently fail; re-init
  in the new stack
