---
id: FEAT-020
type: feature
owner: product-lead
status: shipped
gist: Keeps a project's always-loaded context tiny and pulls the right slice just-in-time — with a lifecycle that clears, promotes and de-drifts it through gestures the founder already makes.
from: IDEA-020
proof: stages/L0-quickstart/template/.claude/rules
created: 2026-06-05
---

# JIT working-context with a lifecycle — load-little, clear, promote, de-drift

> Build contract for [IDEA-020](IDEA-020-jit-working-context-lifecycle.md). Architected via a
> `mentor-architect` pass (2026-06-05) grounded in the real seams; four scope/taste forks decided with
> Ajesh (recorded in **Decisions** below). Shipped as **four independently-shippable phases**, each a
> VERSION bump. One concern per phase; the parent frames the arc.

> **WRAPPED 2026-06-20 (Phase 1 shipped; Phases 2-4 deliberately parked).** Phase 1 (`.claude/rules/`
> `paths:` JIT scoping + the durable-vs-working cut + `memory-seed/` — *the shelf half retired at
> v0.249.0; the cut moved into `context-discipline.md`, which ships*) shipped v0.45.0. Phases 2-4
> (`/close` as GC ledger · promote-on-evict · the freshness *moment*) were **always trigger-gated by the
> IDEA's own restraint** — *"build the full lifecycle only when a project's working-context actually
> hurts."* It still hasn't. **Re-alignment check vs. the trends+dhun session:** adjacent work landed
> (`auto-log` traces, `/close → .boss/brain/`, `/judge-traces`) but none of it is the *working-context*
> GC — so the trigger is unchanged and the restraint holds. Marking shipped (earned slice delivered);
> **re-opens on the original trigger** (a Phase-1 slice going stale in a real project). Not abandoned —
> parked by design (Principle #2).

## Goal
Every BOSS project keeps its **always-loaded** context tiny and pulls the right working-context slice
**just-in-time** when the work touches it — and that store **clears, promotes, and de-drifts itself**
through gestures the founder already performs (`/close`, `/extract`), never a new always-on nag.

## The two homes (the architecture, in one cut)
- **`.claude/rules/*.md` with `paths:`** — the JIT *render* surface (host-bound; loads only when the
  model opens a matching file). The "context right in time, stored locally" half.
- **`.boss/working-context.json`** — the host-neutral lifecycle *ledger*: one record per slice
  `{ id, feat, paths, last_touched, promote, status }`. Same shelf as `manifest.json`.
- **The host seam (IDEA-006 payoff):** only the rule file is host-bound and would be re-authored on a
  new host; the ledger + the close/evict gestures travel everywhere. Keep the freshness stamp in the
  ledger, never in the rule file.

## Decisions (locked with Ajesh, 2026-06-05)
1. **Scope:** spec all four phases now; build incrementally.
2. **Promote-flag authorship:** **model suggests, founder confirms.** The model may mark a slice a
   promote *candidate* mid-work; it is surfaced at `/close` and only promotes on founder confirmation.
   The model never writes a final `promote: true` to durable state unasked.
3. **Freshness:** the unprompted freshness *moment* **is on the roadmap (Phase 4)** — not the
   permanent answer. Phases 1–3 use the cheap `/close`-read; Phase 4 builds the real time-predicate
   when its trigger fires.
4. **Evict trace:** **both** — the one-line outcome → `registry/CHANGELOG.md` (durable, the sync
   surface) **and** the scratch → `docs/devlog.md` (working history).

---

## Phase 1 — the earned slice (JIT-by-construction template floor)
**Ships first. No lifecycle. Parallels the deny-by-construction floor already in `settings.json`.**

### Acceptance criteria
- [ ] L0 (`stages/L0-quickstart/template/`) and L1 (`stages/L1-mvp/template/`) each ship one example
      `.claude/rules/<example>.md` with `paths:` frontmatter scoping it to a real glob (commented so a
      founder sees *why* it loads only on touch).
- [x] ~~`library/memory-seed/` gains: one durable-facts seed file + a `README.md` that names the
      **durable-facts vs. working-state** cut and points at the rule-file mechanism.~~ **Done at
      v0.45.0, then RETIRED at v0.249.0.** The shelf was read by nothing, and its premise — seeds
      every new project starts with — was answered **NO** by [[IDEA-080]]/[[DEC-015]] at v0.245.0:
      durable memory is machine-local and person-scoped, and BOSS does not seed anyone's memory
      store. **The cut survived the shelf** — it moved into `library/practices/context-discipline.md`,
      which ships via `boss craft`, where two lines had been delegating to the unreadable shelf file.
- [ ] `library/practices/context-discipline.md` cross-links FEAT-020 as the shipped instance of its
      "scope rules to where they apply" move (the practice currently *describes* `paths:`; now a
      template *ships* it).
- [ ] Zero-dep held: `npm run pack:preview` shows only intended files; the rule/seed files don't leak
      into the published package unless they belong there.

### Smoke check
- `boss new /tmp/fc-p1 && ls /tmp/fc-p1/.claude/rules/` shows the example rule; `grep paths: …` confirms
  the frontmatter. Prune the `/tmp` entry from `~/.boss/registry.json` after.

### Validated learning
- **Learning hypothesis:** founders (and BOSS itself) actually *use* a paths-scoped rule once it's
  scaffolded, rather than dumping working-state back into `CLAUDE.md`.
- **What result would change the plan:** if the shipped example sits unused / unedited across real
  projects, JIT-by-construction is a nicety, not a need — stop at Phase 1 and don't build the lifecycle.

---

## Phase 2 — `/close` as the GC trigger
**Builds when a project's working-context first hurts. Still no hook, no moment.**

### Acceptance criteria
- [ ] `.boss/working-context.json` ledger schema defined + written/read by the CLI (host-neutral JSON,
      same discipline as `manifest.json`).
- [ ] `/close` (`stages/L1-mvp/.../close/SKILL.md`) gains a GC step: for each FEAT flipped to
      `shipped`, **compress its slice to a one-line outcome** and mark its ledger record `closed`.
- [ ] Eviction = **recency-window made mechanical**: window is "open FEATs + current"; closing a FEAT
      is the eviction event (no TTL, no background sweep — that needs Phase 4's predicate).
- [ ] **Evict trace (both):** the one-line outcome is appended to `registry/CHANGELOG.md` **and** the
      evicted scratch to `docs/devlog.md`.
- [ ] `last_touched` stamp written on each ledger record when its slice is touched.

### Smoke check
- In `/tmp`: scaffold, create two FEATs, ship one, run `/close`; assert the shipped FEAT's ledger
  record is `closed`, its rule slice compressed, and a one-liner appears in **both** CHANGELOG and
  devlog. Conscience eval suite regression-clean.

### Validated learning
- **Learning hypothesis:** tying eviction to `/close` keeps the always-loaded surface lean *without*
  the founder hand-trimming (the way RESUME was trimmed by hand at v0.42.1).
- **What result would change the plan:** if `/close` rarely runs in practice, GC-on-close starves and
  the store bloats anyway — then the background sweep (Phase 4) becomes load-bearing earlier.

---

## Phase 3 — promote-on-evict (model suggests, founder confirms)
**After Phase 2 has run a few cycles. Reuses the one paid-for judge; adds no second one.**

### Acceptance criteria
- [ ] A slice can carry a `promote` *candidate* flag set by the model mid-work (Decision 2) — recorded
      in the ledger as a candidate, **not** a committed promotion.
- [ ] At `/close`, only flagged-candidate slices are surfaced to the founder; on confirmation they route
      through the **existing `/extract` / extraction-loop / `capture` moment** (UP/DOWN/NOT-YET).
- [ ] Eviction **never** calls a fresh model judge per slice (the v0.34 cost trap) — promotion only ever
      goes through the already-ledgered `capture` judge, and only on a flagged + confirmed slice.
- [ ] Unflagged slices evict silently (with the Phase-2 trace).

### Smoke check
- In `/tmp`: model-flag a slice, run `/close`, confirm it's surfaced as a candidate and (on accept)
  hands to `/extract`; flag-nothing case surfaces nothing and fires no judge. Frequency ledger
  (`boss conscience activity`) shows no per-eviction judge calls.

### Validated learning
- **Learning hypothesis:** a slice worth keeping gets caught at the GC boundary instead of lost — GC
  and learning (Principles 1 + 3) become the same gesture.
- **What result would change the plan:** if confirmed-promotions are near-zero, model-suggested flags
  are noise — drop to founder-only flagging (the conservative fork from the decision).

---

## Phase 4 — the freshness *moment* (DEFERRED — build on trigger)
**The unprompted stale-slice detector. Requires real new machinery; ships only when its trigger fires.**

### Re-open trigger (precise — do not build before both hold)
1. The Phase-2 `/close`-read freshness flag proves **insufficient** — slices rot *between* closes often
   enough that founder-in-loop catching is too late; **AND**
2. the frequency ledger (`.boss/conscience-log.jsonl`) shows judge-moment **headroom** (adding a fire-
   path won't push the conscience into over-fire / nag territory).

### Acceptance criteria (when built)
- [ ] New time-based predicate in `loop-runtime.js` (`stale_since` / `mtime_older_than`) — the runtime
      currently imports `statSync` but never uses it; this is the seam. Documented as a loop-contract
      vocabulary extension every project inherits.
- [ ] A `freshness`/`context-stale` loop spec + voice frame, modeled on `cost-stale` (but genuinely
      time-triggered, where `cost-stale` is content-triggered).
- [ ] **Eval set shipped with it** (`tester` agent): `moment-context-stale.yml` with should-fire /
      should-not-fire cases — no new moment without its eval set (the discipline `cost-stale` set).
- [ ] Founder always decides (asks, never blocks/auto-evicts); fail-open.

### Validated learning
- **Learning hypothesis:** an unprompted stale-context catch prevents the model being silently
  misinformed in a way the `/close`-read can't (because the founder wasn't closing anything).
- **What result would change the plan:** if it fires rarely and the `/close`-read already caught those
  cases, it was premature ceremony — keep it shelved, the `/close`-read was enough.

---

## Out of scope (the whole FEAT)
- **No new always-on machinery in Phases 1–3** — no hook, no moment, no per-eviction model judge.
- **No TTL / background sweep** until Phase 4's trigger (it *requires* the new predicate; it isn't a
  cheap rider on Phase 2).
- **Not a general cross-project memory server** — this is per-project local context, not a shared store
  (that would be a different idea, and a heavier one).
- **Founder-app domain knowledge** is [[IDEA-017]], not this — FEAT-020 is *build-context* discipline,
  not *domain-practice* delivery.

## Notes
- Source idea: [IDEA-020](IDEA-020-jit-working-context-lifecycle.md)
- Architecture pass: `mentor-architect`, 2026-06-05 (seams: `loop-runtime.js` closed predicate vocab +
  unused `statSync`; `UserPromptSubmit` not `Stop`; `/close` does no eviction today; `capture` ∈
  `JUDGE_MOMENTS`).
- Restraint posture (the honest note carried from IDEA-020): Phases 2–4 risk being BOSS gold-plating
  its own substrate. The recency-window-by-hand is currently *enough*. **First dogfood = BOSS's own
  repo** — its Phase-1 slice being the first place a stale rule misinforms a session is the cleanest
  Phase-2 re-open signal. Let BOSS feel the pain before it builds the cure.
- Twins: [[IDEA-014]] (ride the model curve) + [[IDEA-017]] (ride the ecosystem curve) — same staleness
  family; this is "ride the *context* curve." Portability seam: [[IDEA-006]].
