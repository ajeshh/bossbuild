---
id: IDEA-011
type: idea
owner: product-lead
status: shipped
program: ai-native-boss
proof: src/conscience.js
created: 2026-05-23
---

# BOSS's own override discipline — applying IDEA-008 to the conscience itself

> Captured after Ajesh's audit-pause request: *"I wanna step and see how we've architected
> BOSS, and just contemplate ... that our boss program is nimble, flexible, scaffolds and
> allows for speedy development if someone chooses to rock out a new app, without holding
> them back if they do a rapid all day all night build."*
>
> This is the canvas's Risks & Harms #1 — *"BOSS bloats into a heavy framework — the most
> ironic, most likely failure"* — examined directly. The honest read after 22 capability
> releases (v0.0 → v0.22.0) is: **architecturally BOSS is mostly what it claims to be, with
> one specific gap that, left unfixed, would make BOSS fight the founders it claims to
> serve.**

## The audit — 8 architectural dimensions, scored honestly

| Dimension | Read | Notes |
|---|---|---|
| **1. JIT discipline at the loop level** | ✓ working | All 6 loops have guarded entry predicates. capture-loop + pretotype-loop are *structural* (no `drift_moment`; never speak). canvas-loop requires ≥3 active captures. spec-loop is `runner_type: skill` (only fires when `/spec` runs). design-tokens-loop requires ≥3 style declarations. design-drift-loop requires the tokens file. **Fresh project = silent hook.** ✓ |
| **2. Modes earn additivity** | ✓ working | Quickstart = 5 skills + 3 agents + 2 loops. MVP adds 7 + 4 + 3. V1 adds 3 + 7 + 1. Each `boss unlock` is the founder's call. Additive, not all-at-once. |
| **3. Override grammar exists** | ⚠ partial | `**OVERRIDE:** skipped \`loop\` — rationale:` works in devlog. `boss status --conscience` reads them. BUT the conscience hook *does not check overrides* before emitting; it relies on the model to honor the override metadata in `additionalContext`. **Robust within a sophisticated-model session; not robust across sessions or with smaller models.** Real gap. |
| **4. Remix is structurally supported** | ✓ working | Founders can edit any loop spec, any skill, any agent. Settings.json can drop the hook entirely. /boss-learn carries patterns UP. The remix space holds. |
| **5. Speed-to-first-action** | ✓ working | `boss new <name>` → working project in ~5 seconds. `/boss` shapes the idea + optional GitHub. Path from intent → building is tight. |
| **6. Speed when in flow** | ❌ **real gap** | The conscience hook fires on every `UserPromptSubmit`. Even with overrides recorded, the hook re-emits next prompt. **There is no session-level off-switch.** A founder rocking out all night has only heavy escape hatches: edit settings.json (drop hook), edit each loop (drop drift_moment), record per-loop overrides (doesn't truly silence). Not nimble. *This is the canvas's R&H #1 made concrete.* |
| **7. Cognitive load** | ✓ working | Hour-1 founder needs to know `boss new`, `/boss`, `/triage`. That's it. Discipline accretes as modes unlock — only if they unlock. Quickstart is genuinely lean. |
| **8. Removability per-feature** | ⚠ partial | Can remove the whole hook (heavy); can edit individual loops (heavy); cannot quickly disable, say, just the design-tokens-loop while keeping others. **Per-loop opt-out is not a first-class affordance.** Lesser gap than #6 but worth naming. |
| **9. Performance (bonus)** | ⚠ unmeasured | Hook reads loops dir (6 files), evaluates predicates (file reads + regex matches), composes context. Should be <100ms but **never instrumented.** Worth measuring at v0.23. |
| **10. Discoverability of override pattern (bonus)** | ❌ gap | Founders learn about override grammar through skill docs they may not read. Nothing surfaces it loudly when relevant. **A founder who skips the docs misses the entire deviation-discipline.** |
| **11. Stack-specificity (bonus)** | ⚠ partial | design-tokens-loop's regex catches React/Vue/Svelte/Solid patterns. A Go/Rust/Python project's UI (or non-UI) work doesn't match. Loop spec frontmatter is editable but founder may not know. |

**Overall read:** Architecturally BOSS is JIT and remix-friendly *at the macro level*. The
gap is at the *session level* — once the conscience is active, there's no nimble way to
silence it for the in-flow founder. **Fixing dimension #6 alone closes the most-acute version
of the R&H #1 risk.** The other gaps (#3 partial, #8 partial, #9-#11 lesser) are worth
naming but not blocking.

## The specific architectural pattern needed

**Apply IDEA-008's override discipline one level up:** instead of overriding a *specific
loop*, override the *entire conscience* for a bounded time. The pattern fractal-replicates
the existing one — deviation conscious, recorded, never blocked, never forgotten:

- **Conscious:** the founder issues `boss conscience pause [...]` deliberately. Not an
  accidental flag.
- **Recorded:** the pause state lives in `.boss/config.json` (current state, not historical
  event). With timestamp, reason, expiry.
- **Never blocked:** the founder can always pause. The conscience never refuses to be
  silenced.
- **Never forgotten:** the pause has an expiry (auto-resume) OR is explicitly `until-resume`
  (founder ends it). Even un-bounded pauses are surfaced loudly in `boss status` so it can't
  silently linger forever.

The mechanism:

```json
// .boss/config.json
{
  "github": "ask",
  "visibility": "private",
  "license": "proprietary",
  "cohort": "vibe-virtuoso",
  "conscience": {
    "mode": "paused",
    "since": "2026-05-23T22:00:00Z",
    "expires": "2026-05-24T22:00:00Z",
    "reason": "all-night build sprint — going hard on FEAT-012"
  }
}
```

The hook reads this *first*. If `mode: paused` and not expired → exit silent (no signal, no
context injection). If `mode: paused` and expired → emit a "your pause expired" signal in
`additionalContext` once, then clear the pause and run normally. If `mode: active` (or
absent) → run normally.

CLI surface:

```bash
boss conscience pause [--for 8h | --until 2026-05-24T08:00 | --until-resume] [--reason "..."]
boss conscience resume
boss status --conscience    # shows pause state if paused
```

The pause state behaves *like* IDEA-008's override pattern at the session level: same shape
(conscious, recorded, never blocked, never forgotten), same accountability (the reason is
real text, not a checkbox), same kindness (auto-resume so the founder isn't forever in
silenced-conscience mode after one all-nighter).

## What's already published (field survey)

The notion of "discipline tools with off-switches" is more developed than I first thought:

- **Cal Newport — *Digital Minimalism*, *Deep Work*.** The discipline of *bounded* presence
  vs. always-on attention. The bounded-pause-with-auto-resume pattern matches this lens.
- **Anthropic's own Claude Code design** — the *Stop hook* exists; *PreToolUse* and
  *PostToolUse* can return non-blocking warnings; nothing in the hook system *forces* the
  model to surface a nudge. The architecture *already* respects "the model decides whether
  to speak." BOSS is a layer on top; the pause primitive extends that respect to
  "the founder decides whether the model should *receive* the nudge."
- **Linus Lee + Maggie Appleton — calm AI tool design.** Both have written on tools that
  withdraw when not needed. Same pattern.
- **The classical "do not disturb" / "focus mode" pattern.** Familiar from OS-level tooling
  (macOS Focus, Windows Focus Assist). BOSS would apply the same shape to its conscience
  layer.

**Nothing about this is novel as a *pattern*.** What's worth claiming is the *application*
— treating the conscience as a discipline that can be paused at the session level using
the same override discipline applied to individual loops. Same recipe at a different scale.
Fractal-consistent design.

## Phases mapped to the roadmap

### Phase 1 — Pause primitive (v0.23 — alongside Scale mode)

Build:
- `boss conscience pause/resume` CLI subcommand (new file `src/conscience-cli.js` — extends
  `src/conscience.js`)
- `.boss/config.json` carries `conscience` block with mode + since + expires + reason
- Hook reads pause state first; exits silent when paused + not expired; emits one-time
  "your pause expired" signal when expiry crosses
- `boss status --conscience` shows pause state prominently
- Eval examples for the pause/resume + expired-pause cases

Effort: ~1-2 hours of code + tests. Ships in v0.23 alongside Scale-mode + moment #3 +
PostToolUse hook work.

### Phase 2 — Other gaps addressed (v0.24+)

- **Per-loop opt-out as first-class** (dimension #8). `boss conscience disable <loop-id>`
  stores opt-out in `.boss/config.json`; hook honors. (Today's workaround: edit the loop's
  `drift_moment` to null.)
- **Performance instrumentation** (dimension #9). Hook reports its own wall-clock; emit a
  warning if >250ms; consider lazy-loading the YAML parser. Probably not urgent.
- **Override-pattern discoverability** (dimension #10). When the conscience fires, the
  `additionalContext` mentions "override is always available — `boss conscience pause` for
  session-level; record per-loop overrides in devlog." Surface the mechanism in the moment
  the founder needs it most.
- **Stack-specificity** (dimension #11). Loop specs accept multiple regex patterns per
  predicate; founders declare their stack at `boss new` time; the design-tokens-loop spec
  ships per-stack patterns.

### Phase 3 — Capture as a publishable practice (v0.25 externalization)

This pattern — *applying override discipline fractally from individual artifacts up to the
tool's own behavior* — is worth writing up as a practice doc once it's been used on > 1
project. Cite Newport, Lee, Appleton; claim the fractal-consistent-design framing as the
narrow contribution.

## Open questions

- **Pause vs. mute semantics.** `pause` implies "I'll come back to this." `mute` implies
  "I just don't want to hear it." Subtly different — pause has the auto-resume kindness;
  mute might not. Lean `pause` because the auto-resume IS the kindness. But consider: should
  there be a `mute` for founders who genuinely want the conscience off permanently for a
  project? (Probably yes; same mechanism with `expires: never`.)
- **Default expiry.** When the founder says `boss conscience pause` with no duration, what's
  the default? Lean: 8 hours (a build session). Or maybe `--until-resume` as default —
  forces the founder to explicitly resume. Decide before shipping.
- **What about the per-skill discipline checks?** `/spec` checks canvas-loop state and may
  surface moment #4 even when the hook is paused. Should skill-level conscience checks
  honor the pause too? Probably yes — the pause should silence the *whole* conscience layer,
  not just the hook. Each skill's conscience-check reads the same `.boss/config.json` block.
- **Telemetry / introspection.** Should there be a `boss conscience log` showing the last N
  signals (whether suppressed, surfaced, overridden)? Useful for debugging "is the conscience
  firing correctly" — but adds surface. Defer to Phase 2.
- **Stack-specificity** vs. loop redaction. If the design-tokens-loop's regex doesn't match
  a stack (say Python), what happens? Today: the loop is `unopenable` (entry predicate
  never satisfied), so it never fires — *which is fine*, the loop is silently inert. So
  this is less urgent than I first thought; named for completeness.

## What this IDEA is NOT

- **Not a re-architecture.** The macro shape (modes / loops / conscience / mentor board /
  builder team / personas) is right. This is a small flexibility-and-honesty fix at the
  session level.
- **Not a critique of the existing design.** The discipline that exists serves its purpose
  when active. The gap is the off-switch, not the discipline.
- **Not novel as a pattern.** The pause-with-auto-resume is OS-level table stakes. What's
  novel (if anything) is the fractal-consistent application of IDEA-008's override
  discipline at the session level.

## Status

`exploring` — full audit captured, gap named, fix sketched, phases mapped. **Recommend
shipping Phase 1 in v0.23** alongside Scale mode + moment #3 work; Phase 2 in v0.24+.
Phase 3 (publishable practice) only after BOSS has been used on > 1 project and the pattern
has been validated externally.

## Canvas

_Covered by BOSS's overall canvas ([CANVAS.md](CANVAS.md)). The R&H #1 mitigation gets
sharper with this IDEA — "BOSS bloats into a heavy framework" risk is now operationally
addressed at the session level, not just the macro level._
