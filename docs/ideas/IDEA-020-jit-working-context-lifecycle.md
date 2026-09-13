---
id: IDEA-020
type: idea
owner: product-lead
status: shipped
gist: Keep the always-loaded context tiny and pull the right slice just-in-time. The token saving is the easy half — the lifecycle (what clears, what gets promoted, how it avoids drifting) is the actual design problem.
promoted_to: FEAT-020
proof: stages/L0-quickstart/template/.claude/rules/your-app-code.md
created: 2026-06-05
---

> 🔴 **`proof:` was `library/memory-seed` until 2026-09-08 (v0.249.0), and that shelf is gone.**
> Phase 1's real shipped artifact is the path-scoped `.claude/rules/` example in the L0 and L1
> templates — a founder receives it. The memory-seed shelf never was: it held a README and one
> example, nothing read it, and its premise (*seed memories every new project starts with*) was
> answered **NO** by [[IDEA-080]]/[[DEC-015]] at v0.245.0 — durable memory is machine-local and
> person-scoped, and BOSS does not seed anyone's memory store. The durable-vs-working cut it carried
> moved into `library/practices/context-discipline.md`, which ships via `boss craft`.
> **`check:backlog` caught this the moment the shelf was deleted** — a `proof:` field that names a
> path is the one part of a record the repo can contradict, and it did.

# JIT working-context with a lifecycle — load-little, render-on-demand, clear, promote, de-drift

> Building as [FEAT-020](FEAT-020-jit-working-context-lifecycle.md) (architected 2026-06-05; 4 phases, 4 forks decided).

## Current shape
- **What:** A **local working-context layer** for a BOSS project that keeps the *always-loaded*
  surface tiny and pulls the right slice of context **just-in-time** at the moment the work touches
  it — *plus a lifecycle* so that store doesn't silently rot into the thing it was meant to prevent.
  The token-saving idea is the easy half; **the lifecycle is the actual design problem** (Ajesh's
  framing: "what happens once done, how does old data get cleared, how do the best ideas/docs get
  captured for later, how does it not start to drift").
- **Why this is home turf (the principle is already proven):** this is **Principle 2 (just-in-time)
  applied to the context window itself.** It's already a *vetted* practice —
  [`library/practices/context-discipline.md`](../../library/practices/context-discipline.md) (through
  `/vet`, RVW-005/010, shipped v0.42.0). That doc names the moves: lean always-loaded docs · scope
  the rest JIT · enforce no-reads in the harness · filter noisy output. And the ethos already says
  BOSS *can* be a conscience only because it **holds the arc** — "story-holder = the substrate"
  ([[boss-ethos]]). This idea is that substrate, made disciplined about its own size and freshness.

- **Two memories that must stay distinct (the clarifying cut):**
  1. **Durable facts** — slow-changing, true across sessions (who the founder is, settled decisions,
     ethos). Lives in token-memory (`MEMORY.md` index + recall-on-relevance files). Small,
     always-loaded index is fine.
  2. **Working state** — fast-changing "what I'm building right now" (`docs/RESUME.md`, `.boss/`,
     the canvas, a feature's scratch context). The trap is letting #2 leak into a #1-shaped
     (always-loaded) surface — that's the token bleed, paid every turn, *and* it dilutes attention
     (context distraction). The whole idea is: **store #2 locally, load almost none of it always,
     pull the right slice in exactly when the work touches it.**

- **What already ships DOWN vs. the gap (honest):**
  - ✅ `permissions.deny` block in the L0 template (the zero-cost no-read floor).
  - ✅ RESUME **recency-window** applied (trimmed 727→346 lines; history → CHANGELOG) — the first
    real instance of "old data gets cleared" *by hand*.
  - ✅ dormant `secrets-guard` hook (opt-in high-stakes ceiling).
  - ❌ **`.claude/rules/` with `paths:` frontmatter** — the actual JIT mechanism (a rule that loads
    *only when the model opens a matching file*). **No template ships one.** This is the
    highest-leverage, cheapest, already-proven missing piece: "context right in time, stored locally."
  - ❌ `library/memory-seed/` is **empty** — no per-project working-memory convention at all.
  - ❌ **no lifecycle** — nothing defines done/clear/promote/de-drift for working context.

## The lifecycle — the four questions, each mapped to a mechanism BOSS already has
> The point of capturing (vs. building) is that each of these is a real design call. The good news:
> BOSS already owns a primitive for **three of the four** — the work is wiring, not invention.

1. **"What happens once done?"** → BOSS already has a *done* primitive: **moment #4 ("Done!") + `/close`**
   ([[boss-ethos]]). The open design: when a feature closes, its working-context should **not** just
   linger. Options to weigh — compress to a one-line outcome in the changelog, archive the scratch,
   or promote the durable bits (see #3). Done should *trigger* the context GC, not leave it to entropy.

2. **"How does old data get cleared?"** → the **recency-window** is the precedent (RVW-002, applied to
   RESUME). Generalize it: what's the eviction rule for the working-context store — a window? a TTL?
   on-`/close`? The discipline already exists ("don't let an append-forever log become the file you
   read every session start"); this idea makes it a **mechanism, not a manual trim.**

3. **"How do the best ideas/docs get captured for later?"** → this is **exactly moment #2/#3 (capture)
   + `/extract` (UP/DOWN/NOT-YET) + `/boss-learn`** — already shipped (v0.29). The promotion path from
   "ephemeral working note" → "durable practice/idea" exists. The gap is that the working-context store
   should **feed** that path: clearing should run *through* capture ("before this scratch is evicted,
   is there a pattern to extract UP?"), so GC and learning are the same gesture — Principle 1 +
   Principle 3 ("nothing valuable locked in your head / scattered scratch").

4. **"How does it not start to drift?"** → the **staleness twin of [[IDEA-014]]** (ride the model curve)
   and [[IDEA-017]] (ride the ecosystem curve). Precedents: the **`drift-loop`** (work-vs-named-risk)
   and the **`cost-stale` moment** (an artifact that's gone stale trips a moment). A working-context
   store wants the same: a **"last-touched / last-vetted" stamp** so a slice that's gone stale either
   evicts or trips a freshness moment, instead of quietly misinforming the model. **Drift is the
   failure mode the whole thing exists to prevent — so the store must be self-policing about its own
   freshness, or it becomes the bloat it was meant to cure.**

## The restraint check (Principle 2 — "you haven't earned this yet")
- The **principle** is proven and the **cheapest slice is just missing from the template**: shipping an
  example `.claude/rules/` (paths-scoped) into L0/MVP + a `memory-seed/` convention would make every
  `boss new` project **JIT-by-construction**, not just deny-by-construction. That slice is low-risk,
  high-leverage, and doesn't need the full lifecycle — build candidate when next touching the template.
- The **full lifecycle store** (per-feature working-context with GC + promote-on-evict + freshness
  stamps) is **real machinery** — and the honest question is whether a real project has *asked* for it,
  or whether this is BOSS gold-plating its own substrate (moment #3 firing on BOSS itself). Lean toward
  **capture now; build the `.claude/rules/` slice when the template is next open; defer the lifecycle
  store until a project's working-context actually hurts.** The recency-window-by-hand is, for now,
  enough — and its pain is the re-open trigger.

## Capture log
- 2026-06-05 — captured from Ajesh's question: "we have tokens for Claude to keep something in memory,
  but we also have project / feature / what-someone's-working-on memory — what's the best way to save
  tokens with a great approach to context, context right-in-time stored locally? Would that help? Do
  we already do this?" Answer that occasioned the capture: the *principle* is vetted and partly shipped
  (deny-list + recency-window), but the JIT-local *machinery* (`.claude/rules/` paths, a working-memory
  convention) is documented UP, **not shipped DOWN** — and the empty `library/memory-seed/` proves it.
  Ajesh's push — "I think we need to architect it more: what happens once done, how does old data get
  cleared, how do best ideas/docs get captured, how does it not drift" — is the reason this is an IDEA,
  not a build. Those four are the lifecycle, and three of the four already have a BOSS primitive to
  hang on (close/recency-window/extract); drift is the IDEA-014/017 staleness family.

## Open questions (carried forward)
- **Where does the working-context store physically live?** `.boss/` (machine state) vs. a new
  scratch shelf vs. `.claude/rules/` (host-native, JIT) — and which parts are host-bound (Claude Code
  `paths:` syntax) vs. host-neutral (the lifecycle). Names the [[IDEA-006]] portability seam.
- **Is GC its own gesture or a rider on `/close`?** Cleanest if "done" *is* the GC trigger (no
  separate sweep) — but background staleness (a slice that rots without anything closing) may still
  need a `cost-stale`-style moment.
- **Promote-on-evict: automatic or asked?** Running every eviction through `/extract`'s LLM-as-judge
  could over-fire (the v0.34 cost trap). Maybe only *flagged* scratch is offered UP at close; the rest
  evicts silently. Needs the frequency-ledger lens ([[IDEA-013]]).
- **Does the freshness stamp trip a *moment* or just evict?** A moment keeps the founder in the loop
  (humane) but adds fire-paths; silent eviction is cheaper but can drop something that mattered.
- **First instance to dogfood:** BOSS itself — does *this repo's* RESUME/`.boss`/canvas working-set
  want the lifecycle before any founder's project does? (BOSS is its own first project — the recency-
  window trim was already the manual version of #2.)

## Canvas
_Covered by BOSS's overall canvas ([CANVAS.md](CANVAS.md))._
