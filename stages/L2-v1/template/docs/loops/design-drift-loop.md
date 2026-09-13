---
id: design-drift-loop
type: loop
stage: L2-v1
runner_type: hook
attributed_to: [Brad Frost, Nathan Curtis, Diana Mounter]
also_relevant: [Dan Mall, Jina Anne, Ajesh Shah]
entry:
  - exists: { path: docs/design/DESIGN_TOKENS.md }
exit:
  - count_at_most:
      path_glob: $source
      pattern: '#[0-9a-fA-F]{3,8}\b'
      max: 0
      exclude_files_matching: '\.tokens?\.|\.theme\.|DESIGN_TOKENS'
drift_moment: coherence
---

# Loop: design-drift (V1)

The V1-stage counterpart to `design-tokens-loop` (MVP). MVP-stage gates *whether the tokens
exist*; V1-stage gates *whether the tokens are still authoritative.*

**What this loop actually detects: raw hex codes in source files. That is all.** The exit
predicate below is a single regex over `src/**`. It catches the *47 blues* and nothing else.

**What it does NOT detect, despite the failure catalog naming them:** near-duplicate components
multiplying (**pattern reinvention**), code growing linearly with screens (**billion-line
drift**), or the tokens file going stale while components grow. Those are component-shaped
failures, and a hex regex cannot see them.

> ⚠️ **This paragraph used to claim otherwise.** It listed near-duplicate components and a
> staling tokens file as drift signals this loop watches. It never did. A loop doc that
> overstates its predicate is worse than one that admits a gap — the founder stops looking for
> the failure the loop silently isn't catching. Corrected in v0.166.0. **A predicate is the
> claim; the prose must not exceed it.**

The component-shaped half is covered by [`/design-library`](../../.claude/skills/design-library/SKILL.md),
which reads every component into a manifest and reports duplicates, missing states and off-token
values that this regex structurally cannot reach.

`runner_type: hook` — the conscience hook evaluates this on every UserPromptSubmit at V1. The
entry predicate (tokens file exists) is met for any project that has unlocked V1 with the
MVP-stage `/design-tokens-init` having been run. The exit predicate says the **healthy**
condition — *at most zero* raw hex codes outside the tokens file — so the loop is closed when
the tokens are authoritative and open (emitting `coherence`) when raw hex has crept back in.

> 🔴 **This loop fired BACKWARDS from v0.166.0 until it was fixed.** The frontmatter used
> `count_at_least: { min: 1 }` and the paragraph here declared the exit predicate "**inverted**",
> asserting *"the IDEA-008 primitive supports this without modification."* **It does not.**
> `classifyLoop` has no inversion: `entry.all_ok && exit.all_ok` → CLOSED → silent. So finding
> ≥1 raw hex CLOSED the loop and said nothing, while a project with clean tokens sat permanently
> open emitting `coherence`. Verified in both directions before the fix.
>
> The repair is the new `count_at_most` predicate rather than an `invert:` flag, because a flag
> makes loop state conditional — "closed" would stop meaning healthy, and every reader of every
> other loop would have to check which kind this was. **An exit predicate states the healthy
> condition.** Nothing else in the vocabulary needed to change.
>
> Note what this cost and where: the correction directly below was written in v0.166.0 to stop
> this file's prose from exceeding its predicate, and the very next paragraph then described a
> mechanism the runtime had never implemented. *Prose can overstate a predicate in both
> directions — by claiming it catches more, and by claiming it inverts.*

## Entry artifact

`docs/design/DESIGN_TOKENS.md` exists. Set during MVP-stage via `/design-tokens-init`. If a
project is in V1 mode without this file, design-tokens-loop should re-open (founder skipped
it at MVP).

## Purpose

Catch design-system drift early. When a raw hex code lands in committed source code, the
conscience surfaces a `coherence` nudge — "you shipped `#FF6B35` directly in
`src/components/<X>`; should this be a new token in the system (and then referenced by
name)?" The founder either:
- Routes the value through the token system (the fix)
- Records an override (legitimate when the value is genuinely one-off / debug / non-shipping)

## Exit artifact

This loop is "closed" when **no raw hex codes** exist in source code (excluding the tokens
file itself and any `*.tokens.*` / `*.theme.*` config files where raw values legitimately
live).

## Drift

`entry: satisfied` (tokens file exists) AND `exit: not satisfied` (raw hex codes exist) →
loop open → conscience emits `coherence`.

Confidence scales with the count of raw hex codes:
- 1-3: low (might be transient — feature in flight)
- 4-10: medium (real accumulation)
- 11+: high (the 47-blues failure mode is in progress)

The voice (cohort-aware per v0.20):
- `vibe-coder-newbie` / `first-product`: explain *why* this matters; route to the token
- `eng-builder` / `returning-founder`: terse — list the files, propose the consolidation
- `vibe-virtuoso`: lean into the architecture — "your component pattern's drifting; want me
  to consolidate to the token?"
- `non-tech-founder` / `domain-expert`: plain language — "the visual system is drifting; the
  AI will compound this if we don't fix it now"
- `indie-hacker`: right-sized — "if this is throwaway, override; if it's keeping, consolidate"

## How to remix

- **Skip:** legitimate when the UI is genuinely one-off (a debug page, an internal admin
  tool, a transient feature). Override grammar:
  ```
  - **OVERRIDE:** proceeded with raw hex in `src/<file>` — rationale: <one-off /
    debug / not-user-facing>; expires <date or never>.
  ```
- **Swap predicate scope:** add `not_path_glob` filters to exclude specific directories
  (e.g., `src/admin/**`) if a whole directory legitimately operates outside the design system.
  Edit this loop spec's frontmatter; record the rationale in `docs/devlog.md`.
- **Tighten predicate:** add detection for near-duplicate components (similar file sizes,
  similar import patterns) — V1+ heuristic. Author the predicate; consider promoting via
  `/extract` if it generalizes.

## When this loop re-opens

- A raw hex code is added to a source file
- The tokens file is renamed or deleted (entry fails — re-open as unopenable; route to
  `/design-tokens-init` to re-establish)
- A new stack is introduced where the predicate's regex doesn't match — update the spec
  with the new stack's pattern

## Future v0.23+: PostToolUse hook

A PostToolUse hook (fires *after* Edit/Write tool calls) can catch raw style values *at
write-time* — before they're committed. The hook would flag the value, propose the token,
and let the founder accept/override. Deferred from v0.22 because PostToolUse is a different
hook surface than UserPromptSubmit (BOSS's only hook type today). The pre-commit drift
detection (this loop) is the v0.22 substitute; the at-write-time detection is the
v0.23+ upgrade.
