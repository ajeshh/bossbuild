---
id: IDEA-073
type: idea
owner: product-lead
status: shipped (P0–P3 + P5; P4 partial — see below)
proof: stages/L0-quickstart/template/.claude/hooks/lib/loop-runtime.js
proof_grade: verified-defect (mechanism) · n=0 (demand)
proof_note: >
  Two separable claims. The DEFECTS are verified by running BOSS's own loop runtime against six
  platform fixtures (react, vue, swiftui, android, flutter, go-service) — not by grep, not by
  reading. The DEMAND claim — that founders building non-web things want BOSS — has n=0. Nobody
  has asked. The defects need no demand: they are broken for the web founders BOSS already has
  the moment those founders use Vue instead of React, or ship a Go service.
gist: >
  BOSS is stack-neutral by principle and shape-blind in practice. The binding is narrower and
  worse than "web-shaped": the shipped conscience hardcodes `src/**` as the source root and JSX as
  the UI idiom, and when either misses, the loop reports `unopenable` — which is SILENT and renders
  to the founder as "waiting". BOSS cannot tell "no match" from "nowhere to look", so a Swift,
  Android, Flutter, Go or Rails project gets a conscience that is quiet because it is blind, and
  looks identical to one that is quiet because the work is clean.
created: 2026-08-24
source: >
  Ajesh, 2026-08-24 — "does boss only support web apps, do we support mobile apps, cli based, ai,
  websites, or other platforms easily for app creation, what about services based?? do we need to
  strengthen the range further?" then "lets see if there are any absolutes that we may have missed,
  and prioritize. i may wanna build some."
relates: EVID-001, EVID-003, IDEA-008, IDEA-039, IDEA-041, IDEA-059, DEC-004, PRINCIPLES#4, PRINCIPLES#5
---

# IDEA-073 — Product-shape range, and the `src/**` absolute nobody wrote down

## The frame

Principle #4 says *stack-neutral; stacks are learned, not assumed.* BOSS honours that where it
**reads** a repo — `boss adopt` recognises 14 manifest types including `Package.swift`,
`pubspec.yaml` and `build.gradle`, across 30 source extensions. It does not honour it where it
**watches** one. The conscience's predicates are globs and regexes written by someone with a
React app open.

The interesting part is not that some skills say "page". It is that **the failure is silent, and
BOSS's own vocabulary hides it.**

## The absolutes, verified

Method: six fixture projects, each carrying the *same* three signals (a pre-ticked checkbox, a
scarcity string, a raw hex colour) expressed in that platform's idiom. Classified with the shipped
`loop-runtime.js`. `unopenable` = entry predicate unmet = **no signal emitted at all**.

```
loop                 react   vue     swiftui  android  flutter  gosvc
deception-loop       open    open    UNOPEN   UNOPEN   open     UNOPEN
design-tokens-loop   open    UNOPEN  UNOPEN   UNOPEN   UNOPEN   UNOPEN
verification-loop    open    open    UNOPEN   UNOPEN   UNOPEN   UNOPEN
```

## 🔴 The build found a deeper root cause than this record first named

This record originally described A1 as *"`src/**` is hardcoded in five loop predicates"*. That was
true and incomplete. **`expandGlob` never supported `**` at all** — its own header comment read
*"Glob expansion (single-`*`, single-level — no `**`)"* — so `src/**` silently meant `src/*`.

The consequence is much wider than the platform question that started this: **any project keeping
code in subdirectories — which is every real one, React included — had all five loops scanning
exactly the top level of `src/` and finding nothing.** A `src/components/Button.tsx` was invisible.
The platform gap was real, but it was the *second* effect; the first was that these loops barely
worked for anyone. `deception-loop`'s hand-enumerated glob list is the workaround someone wrote
instead of fixing the expander, and it still missed `src/app/(marketing)/`.

**Generalisable, and the sharpest instance of this repo's recurring finding: a vocabulary that
documents its own limit does not enforce it.** The data files ignored that header comment for as
long as it existed. Verified by fixture, not by reading — a `nested` project was `unopenable`
while an otherwise-identical `flat` one was `open`.

### A1 — `src/**` is the source root (widest; silent)
Hardcoded in five loop predicates: `verification-loop` (entry), `design-tokens-loop`,
`design-drift-loop`, `cost-budget-loop`, `ai-failure-state-loop`. `path_glob` is a literal string
in each loop's frontmatter; `expandGlob` has no notion of a project source root and nothing in
`.boss/config.json` configures one.

Breaks: Swift (`Sources/`), Android (`app/src/main/`), Flutter/Dart (`lib/`), Go (`cmd/`,
`internal/`), Rails (`app/`), Python (`<pkg>/`), Elixir (`lib/`).

**This is not a UI problem.** `verification-loop` asks *"you marked a FEAT shipped — is anything
verifying it?"* That question has nothing to do with the web, and it does not fire for a Swift,
Kotlin, Dart or Go project. One glob takes out the conscience's non-visual legs too.

### A2 — the UI is JSX (silent)
`design-tokens-loop` entry pattern is ``(className=|style={|css`|styled\.)``. A Vue SFC with
`class="a"` and three raw hexes in `<style scoped>` is **unopenable** — verified. So plain Vue,
Angular, Svelte, ERB, Django templates, HTML+Tailwind (`class=`, not `className=`), SwiftUI,
Compose and Flutter never open the design-tokens loop at all.

Same binding in the write-time guards: `design-tokens-guard.js` `STYLE_EXT` and
`content-terminology-guard.js` `COPY_EXT` are web extension sets — no `.swift`, `.kt`, `.dart`,
`.xml`. (`secrets-guard.js` filters by *tool*, not extension, and is genuinely neutral. That is the
shape the others should copy.)

### A3 — the dark-pattern conscience only sees React/Next (silent; highest stakes)
`deception-loop` globs `src/*,src/components/*,src/app/*,app/*,components/*,pages/*,lib/*` — the
Next.js layout, **non-recursively** — and matches JSX literals (`defaultChecked`,
`checked={true}`). Verified unopenable for SwiftUI (`Toggle(isOn: .constant(true))`), Android
(`android:checked="true"`, which sits under `app/src/main/res/` and `app/*` does not recurse to it)
and any service.

The humane lens is BOSS's stated differentiator. Its **only automatically-firing leg** is
React-only. `/red-team --humane` and `/ux-check` still work when deliberately invoked — but the
whole point of a conscience is that it fires unasked.

### A4 — "shipped" means a live URL (loud)
`/ship` is titled *"localhost is not shipped"*; step 3 hands back "the live URL"; every deploy
config it recognises is a web host. `claude-append.md` carries the phrase into every MVP project's
always-on context, and `celebration-of-done.md` calls the first live URL *"the cleanest threshold
there is"* — so the **celebration threshold itself** is a web absolute.

**Zero occurrences** of TestFlight, App Store Connect, Play Console, `npm publish`, Homebrew, PyPI
or crates.io anywhere in `stages/`. For a CLI, localhost genuinely *is* where it runs.

### A5 — "UX" means a GUI (loud)
`/ux-check` walks hover, focus rings, tab order, WCAG contrast, semantic HTML. No CLI equivalent
(exit codes, `--help`, stderr vs stdout, TTY detection, `NO_COLOR`), no mobile equivalent (VoiceOver
rotor, Dynamic Type, touch targets), no API equivalent (error shape, status codes, pagination).
`design-tokens-init`'s model is colour/spacing/radius/**elevation**/motion — a visual-UI ontology.

### A6 — `waiting` conflates two different states (naming; the one that hides the rest)
`src/conscience.js:427` renders the internal `unopenable` as **"waiting"** to the founder. BOSS
means that as *"you haven't earned this rung yet"* — temporary, correct, encouraging. It reads
identically for *"this predicate can never match on your platform"* — permanent, invisible.

A Swift founder sees `3 waiting` and is being told something false. This is the 15th instance of
[[checkers-state-intents-they-dont-enforce]], in its sharpest form yet: **a rendered NAME asserting
a semantics nobody defined**, and the reason the other five absolutes have gone unnoticed.

### A7 — shape is asked and thrown away (the enabler)
BOSS has a 14-shape taxonomy (`cli`, `dev-tool`, `mobile-app`, `web-app`, `marketing-site`,
`chatbot`, `ai-feature`, `agent`, `marketplace`, `ecommerce`, `edtech`, `health-or-regulated`,
`social-or-ugc`, `hardware-or-iot`). It powers exactly one command: `boss craft
deceptive-patterns --shape`. **`cohort` (who the founder is) is persisted in `.boss/config.json`
and read everywhere; `shape` (what they are building) is persisted nowhere.** BOSS knows how to
talk to you and does not know what you are making.

`/canvas` asks for it (step 6) and claims *"`/red-team --humane`, `/ux-check` and `/trust` all read
them"*. `/trust` contains **zero** references to shape; the other two instruct the model to re-ask
or infer. A producer/consumer contract living only in prose.

## 🔴 Found en route — a separable, verified defect (not this idea's subject)

**`design-drift-loop`'s exit predicate is inverted from its own documentation.** Verified by
running `classifyLoop`:

| fixture | raw hex in src? | state | signal |
|---|---|---|---|
| clean | no (the **good** state) | `open` | **emits `coherence`** |
| drifty | yes — the "47 blues" it exists to catch | `closed` | **silent** |

The loop doc states the exit predicate is *"inverted — when the exit predicate fires (≥1 raw hex
code in code), the loop is 'stalled' and the conscience emits `coherence`"*, and asserts *"the
IDEA-008 primitive supports this without modification."* It does not: `classifyLoop` has no
inversion — `entry.all_ok && exit.all_ok` → `closed` → no signal. So the V1 design conscience nags
every project doing it right and goes quiet on every project drifting.

The same file carries a v0.166.0 correction whose closing line is *"A predicate is the claim; the
prose must not exceed it."* It exceeded it again, in the opposite direction, in the paragraph
below the correction. **Fix on its own release with a locking test; do not bundle it with the
range work.**

## What shipped

Staged rather than released — a peer session held `VERSION` and `registry/CHANGELOG.md`
mid-release when this landed, so the entry and bump wait in the scratchpad rather than racing
them (`apply-release.sh` refuses to run while either file is dirty).

| | what | verified by |
|---|---|---|
| **P0** | `design-drift-loop` un-inverted via a new `count_at_most` predicate | both directions, + a test that bans prose-declared inversions outright |
| **P0a** | `**` genuinely recurses; globs return files, never directory entries | `nested` fixture went `unopenable` → `open` |
| **P1** | `$source` + `sourceGlobs`; `boss adopt` infers the root; blind ≠ waiting | a scaffolded Swift repo: `5 not evaluated here` → clean after inference |
| **P2** | `shape` persisted by `/canvas`; `/ux-check` `/trust` `/red-team` read it and SUBTRACT | the false `/canvas` claim corrected in place |
| **P3** | `/ship` asks what *reachable* means; `celebration-of-done` de-URL'd | — |
| **P4** | pattern sets widened to SwiftUI/Compose/Flutter/Android/HTML idioms — **partial by design** | swiftui/android/flutter fixtures now open `deception-loop` |
| **P5** | guards read `.swift/.kt/.dart/.xml/.strings`; `Color(0x…)`; `colors.xml` skipped | — |

**P4 remains open**: this extended the existing pattern list, it did not build per-shape routing.
That stays gated on evidence (n=0). What it no longer does is fail *silently* — a shape BOSS
cannot pattern-match is now visible as an unopened loop rather than an absent one.

**One process note worth keeping:** a `` $` `` inside a `String.replace()` replacement spliced 100
lines of a file's own header back into it mid-build. `node --check` passed, because the splice
landed inside a comment block. It was caught by `check-refs.js` failing for an unrelated reason.
*A patch script that uses `.replace()` with a literal replacement must pass a function.*

## Priority (as assessed before the build — kept for the record)

**P0 — the drift-loop inversion.** Not a range issue. A live correctness defect in shipped code,
verified, cheap, with an obvious locking test. Ship independently.

**P1 — A1 + A6 together, because they are one change.** The root is that
`expandGlob` returning zero files is indistinguishable from a predicate that legitimately did not
match. Give `.boss/config.json` a `sourceGlobs` key defaulting to today's `src/**` — every existing
project then evaluates **byte-identically** — and let the runtime distinguish *nowhere to look* from
*looked and found nothing*, so `boss conscience` can say `not evaluated here` instead of `waiting`.
One knob repairs five loops. Composition, not addition: no new skill, no new surface, reversible.

**P2 — A7, shape as a persisted field.** It already exists, is already asked, already has 14
values. Persist it, make the three skills that claim to read it actually read it, and let a shape
**subtract**: `/ux-check` on `shape: cli` should say *"no GUI surface — here are the three rows that
apply"* and stop, rather than walking a founder through hover states they do not have. Same lever
as `--shape` on the pattern catalog: filter the dose, don't grow the catalog. Fixes the false
`/canvas` claim as a side effect.

**P3 — A4, `/ship` learns to ask.** The temptation is a table of app-store and package-registry
recipes. Principle #4 forbids it: stack profiles are an **output** of the learning loop, not a
pre-baked input. The correct change is small and prose-only — `/ship` asks *"what is the reachable
artifact for this thing?"*, captures the answer as a `PRAC-NNN` stack profile the way it already
does for hosts, and `celebration-of-done` stops calling a URL "the cleanest threshold there is".

**P4 — A3, per-shape deception patterns.** Highest stakes, but the fix is authoring, not a knob,
and it is genuine surface growth. Gate on P2 landing and on evidence. The cheap honest interim: when
the deception-loop's glob matches zero files, **say so** — that falls out of P1 for free.

**P5 — A2 guard extensions, A5 non-GUI UX heuristics.** Real, deliberate-invoke, lower stakes.
Capture only.

## Refusals (standing)

- ⛔ **No mobile mode, no per-platform skills, no app-store deploy table.** n=0 non-web founders.
  That is addition against [[EVID-001]]/[[EVID-003]]'s compose-and-subtract mandate, aimed at a
  cohort BOSS does not have, while the founders it *does* have said the offering isn't ready.
- ⛔ **No 23rd skill.** Every item above is a config key, a glob, or a paragraph.
- ⛔ **Do not "fix" range by widening every regex.** A wider regex that still cannot say *"I could
  not evaluate this here"* reproduces A6 with more false confidence.
- ⚠️ **P1 must default to today's behaviour.** A source-root change that silently re-opens loops in
  live projects is a conscience that starts nagging people for a release they did not ask for.

## What would change the priority

A single founder building a non-web thing who runs BOSS and reports what was quiet. That moves the
demand claim off n=0 and would justify P3/P4 ahead of P2. Until then the defects justify P0–P2 on
their own, because they are already broken for web founders who chose Vue.
