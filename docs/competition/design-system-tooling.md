---
id: COMP-design-system-tooling
type: competition
owner: product-lead
status: living
sort: watch
checked: 2026-09-12
source: each rival's own repo README, docs site or pricing page, opened 2026-09-12 (impeccable.style/docs/{detector,hooks,design-md} + github.com/pbakaus/impeccable + `npm view impeccable` · github.com/vercel-labs/web-interface-guidelines · github.com/nextlevelbuilder/ui-ux-pro-max-skill · github.com/google-labs-code/design.md + blog.google 2026-04-21 · storybook.js.org/docs/ai/mcp/overview + github.com/storybookjs/mcp · ui.shadcn.com/docs/mcp · help.figma.com MCP guide · supernova.io/pricing · zeroheight.com/pricing). Search-engine summaries were used only to find these pages, never as a fact source.
prior: RVW-079 (DESIGN.md format — NOT-YET) · RVW-081 (Claude Design sync — ADAPT, pointer deferred) · RVW-082 (Figma seam — ADAPT, round-trip refused) · frontend-design.md (2026-09-11)
updated: 2026-09-12
---

# Design-system tooling — everything that props up a design system for an AI-built product

> **Why one file and not eight.** Each of these was grepped against `stages/` and `library/` before
> it was written down, and three of them turned out to have a BOSS verdict already (RVW-079/081/082).
> Filing eight rows would restate three verdicts and pad the table. What is new is **the shape of the
> field read together**, and one rival that changes a decision.

## The shape of the field, in one paragraph

Three kinds of thing get called "design-system tooling," and they do not compete with each other.
**(A) Skills the agent reads at generation time** — `frontend-design`, `impeccable`,
`web-interface-guidelines`, `ui-ux-pro-max`: a prompt, sometimes with a file it writes to the repo.
**(B) The code's own component surface served to the agent** — Storybook MCP, shadcn registries:
generated from the code, so it cannot drift from it. **(C) A design tool or platform as the source of
truth** — Figma MCP + Code Connect, Supernova, zeroheight, Claude Design: a second place the system is
defined, kept in sync by converters. BOSS's doctrine is written for (B) — *the code is the source of
truth; the library is derived from it* — and its MVP-rung artifacts (`DESIGN_TOKENS.md`,
`STYLE_GUIDE.md`, `COMPONENTS.md`, four dormant hooks) are BOSS's own entry in (A). **The one rival
that matters is impeccable**, because it is (A) with a deterministic detector attached, and it now
writes the files BOSS writes, under names BOSS does not look for.

## (A) Skills the agent reads

### impeccable — Paul Bakaus · Apache-2.0 · npm 4.1.0 (2026-09-08) · ★67.5k · 17 hosts

**What it is.** 23 slash commands (`craft`, `init`, `document`, `extract`, `shape`, `critique`,
`audit`, `polish`, `bolder`, `quieter`, `distill`, `harden`, `onboard`, `animate`, `colorize`,
`typeset`, `layout`, `delight`, `overdrive`, `clarify`, `adapt`, `optimize`, `live`), installed by
`npx impeccable install` into Claude Code, Cursor, Copilot, Codex, Gemini CLI and twelve others. Its
README says it *"started from"* Anthropic's `frontend-design` and positions itself as the successor.

**What it writes into the founder's repo — this is the part that matters to BOSS:**
- `PRODUCT.md` — *"durable product truth"*: audience, purpose, operating context, constraints, voice,
  evidence. Written once by `init`, read by every later command. **This is BOSS's canvas + brand doc,
  in one file at the repo root.**
- `DESIGN.md` — the visual system, *generated from existing code* by `/impeccable document`
  (sections seen: Color, Type, Shape, Components; **no YAML frontmatter — it is impeccable's own
  format, not Google's DESIGN.md spec**, which it mentions only as a comparison point).
- `.impeccable/surfaces/*.md` — *"route- or artifact-specific strategy and direction contracts."*
  A surface here is a route, not a platform; BOSS's `shape` is the platform. Different axis, same
  instinct: design direction is scoped, not global.

**The detector.** *"61 deterministic detector rules plus LLM-only critique checks."* Runs three ways:
`npx impeccable detect src/` (source), `npx impeccable detect http://localhost:3000` (**rendered
page** — DOM, computed layout, linked stylesheets, 1280×800 default viewport), or piped. No API key.
Exit 0 / 2 (primary findings) / 1 (scan failure); `--json`. Named tells include overused fonts (Arial,
Inter, system), gray text on coloured backgrounds, **pure black/gray — "always tint"**, nested cards,
bounce/elastic easing, side-tab borders, purple gradients, dark glows, gradient text, line-length
violations, cramped padding, small touch targets, skipped headings, and **"drift from your design
system"** — it reads `DESIGN.md` and flags departures. Exceptions are recorded per rule and value
with a `--reason` (`npx impeccable ignores add-value`). As a hook: `PostToolUse` + `Stop` in Claude
Code, advisory, source-level on `.tsx/.jsx/.html/.vue/.svelte/.astro/.css/...`; Cursor's variant
blocks the write.

**Why they might win.** Four honest reasons. (1) **The detector is the output-observing tap BOSS's
watchlist §7b asked for, already built and executable** — a maintained list of 61 tells that runs
against a page rather than a paragraph about sameness. (2) 67.5k stars on a design skill means the
vocabulary (`bolder`, `quieter`, `distill`) is becoming *the* vocabulary; a founder who has used it
will expect those words. (3) It reads product context before every design command — BOSS's design
skills read the canvas Promises cell, impeccable reads audience + operating context + constraints +
voice, which is more of the canvas than BOSS's design skills open. (4) Seventeen hosts from one
install — the `superpowers` layout applied to design.

**Where they're weak.** (1) **Stateless about *time* even though it writes files** — `DESIGN.md` is
regenerated from code; nothing records *why* a token exists, when it was earned, or which values are
still blank. BOSS's floor/value split and the promotion threshold have no counterpart. (2) **No
rung.** `init` asks the same questions of a Quickstart throwaway and a V1 product; the 23 commands
are all available on day one. (3) **The tells list has no stated maintenance policy** — the docs
never say how the 61 rules are added or retired, so it carries the same claim-outlives-mechanism risk
BOSS caught in itself on 2026-09-11. (4) **`PRODUCT.md` is a design tool's idea of product truth** —
audience and voice, no problem/alternatives/evidence ladder; a founder could fill it in a minute and
believe the product question was answered. (5) Web-only in practice: every detector input is DOM or
a web stylesheet.

**Where it breaks against BOSS.** Two current tells lists now **disagree on the same axis**:
`frontend-design` (2026-09) names *tinted near-black standing in for black* as template chrome;
impeccable's rule says *pure black/gray — always tint*. Neither is wrong; **the tint is not the tell,
the combination is**, which is the strongest evidence yet that this is an attractor and not a list.
BOSS's stamp text already says a list without a mechanism is a claim; this is what two lists without
a shared mechanism look like.

### web-interface-guidelines — Vercel Labs · MIT · ★862

One `AGENTS.md`-style file of 100+ rules in nine categories (interactions, animations, layout,
content, forms, performance, design, copywriting, Vercel-specific), read two ways: **audit mode** as
an installed skill that reviews existing UI code, and **generation mode** by dropping the file into
the repo. Verbatim rules of the kind BOSS's style guide calls *floors*: *"Never `transition: all`"* ·
*"Honor `prefers-reduced-motion`"* · *"Tabular numbers for comparisons"* · *"Icon-only buttons are
named"* · *"Prefer curly quotes"*. **Why they might win:** it is the long-form of what BOSS's
`style-guide.md` floors say in ten lines, and a 133k-weekly-install number circulates for the skill
(reported by a third-party skill index; **unverified** here — the repo shows ★862). **Where they're
weak:** it is a checklist with no state and no rung; every rule applies to every project equally, and
nothing distinguishes a floor from a value. **Read against BOSS:** BOSS should *not* copy the list —
it should say the list exists. A floor is pre-filled knowledge; a pointer to a maintained floor list
is cheaper and stays current without BOSS re-checking it.

### ui-ux-pro-max — nextlevelbuilder · MIT · ★127.1k

The most-starred design skill in the field, and the one that argues *against* BOSS's position.
79 UI styles, **192 colour palettes "aligned 1:1 with product types"**, 74 font pairings, 119 UX
guidelines, 192 reasoning rules, BM25 search over all of it; `--persist` writes
`design-system/<slug>/MASTER.md` + per-page overrides. **Why they might win:** a founder who does
not know what they want gets a complete, coherent, industry-appropriate system in one turn, and the
hierarchy (MASTER + page overrides) is sound. **Where they're weak, and it is the whole thing:**
*"wellness → these palettes; fintech → those"* is **the attractor as a product** — it manufactures
the sameness the rest of the field is trying to escape, one industry at a time. Its anti-pattern
guidance is per-industry (*"avoid AI purple/pink gradients for wellness"*), which is a list of last
year's tells indexed by vertical. BOSS's bet — craft floors pre-filled, **brand values blank until
earned** — is the direct counter-bet, and this row is the evidence that the counter-bet is contrarian
in the market. Note that for the pitch; do not soften the position for it.

### Google DESIGN.md (Stitch) — Apache-2.0 · `@google/design.md` 0.4.0 · ★27.9k · spec status "alpha"

Already vetted: [[RVW-079]] (NOT-YET, 2026-08-20). What changed since: **the spec is still alpha**
(*"Expect changes to the format as it matures"*), the CLI grew `lint`, `diff`, `export` (Tailwind
v3/v4, **DTCG**), and — the material change — **impeccable now writes a root `DESIGN.md` in a
different format.** Two tools with a combined ~95k stars both claim the filename and do not agree on
what is in it. That is not a standard forming; it is a namespace collision, and it makes RVW-079's
re-open condition #2 (*a founder arrives already carrying a `DESIGN.md`*) the **common case** rather
than the edge case. The verdict's own answer to #2 — *read it, which is cheaper than emitting it* —
is what shipped (v0.307.0). The FORMAT question stays NOT-YET on the same grounds.

## (B) The code's own components, served to the agent

### Storybook MCP — Storybook 10.6 · MIT · preview

`@storybook/addon-mcp` (the standalone repo was archived 2026-09-07 and folded into the monorepo).
Tools: `docs-list` (*"an index containing components and unattached docs entries"*), `docs-show`
(props), `stories-find-by-component`, `stories-changed`, `stories-preview`, `test-run` (*"including
any accessibility issues"*), `review-create`. The docs toolset needs a **component manifest**, which
only React, Angular-Vite and Vue3-Vite generate. The stated loop: the agent reads the index, reuses
instead of inventing, writes a story, runs the test, fixes, re-runs — *"a self-healing loop."*

**Read against BOSS.** This is BOSS's V1 `design-library` **generated index** shipped by the host —
same GENERATED-never-authored rule, same reuse-before-invent step, plus a test runner BOSS does not
have. For a React/Vue/Angular project with Storybook, `docs-list` *is* the component index and
BOSS's `manifest.json` would be the second copy of it. **What Storybook does not render is exactly
what BOSS's library adds:** the rule sets — principles, do/don't pairs, terminology, voice — and the
drift shown *on* the component. The MVP-rung authored `COMPONENTS.md` is untouched by this: it exists
because the failures start at component two, before anyone has installed Storybook.

### shadcn registries + MCP — components.json namespaces

The MCP server browses, searches and installs from any registry configured in `components.json`;
namespaces like `@acme` or `@internal` (with an `Authorization` header) let **a team publish its own
design system as an installable registry.** Read against BOSS: this is the *distribution* half of a
design system, which is a Scale-rung problem (multi-project, multi-team) BOSS has at n=0 projects.
Nothing to build; the row exists so the Scale mode names it when the time comes.

## (C) A design tool or platform as source of truth

- **Figma MCP + Code Connect** — remote server on all seats/plans; desktop server needs a Dev/Full
  seat on a paid plan. Code Connect maps Figma components to code components because *"without it,
  the model is guessing."* Already vetted: [[RVW-082]] — ship the seam (DTCG), refuse the vendor,
  refuse the code→design round-trip. Nothing found changes it.
- **Supernova** — Free $0 (5 seats, 1 design system, 5 MCP consumers), Pro **$35/seat/mo as
  displayed** (page toggle shows a −22% yearly option; whether $35 is the monthly or the yearly rate
  is ambiguous on the page), Enterprise custom. *"Reading your contexts via MCP is unlimited on every
  plan."* Serves tokens, components, docs, decisions to Claude Code/Cursor/Codex; an "Editor MCP"
  lets agents *write* to the system.
- **zeroheight** — Free $0 (1 editor, 1 styleguide, 1 token set, MCP 500 calls/mo), Starter
  **$49/editor/mo** (yearly saves 15%; up to 5 editors), Enterprise contact sales.
- **Claude Design** — already vetted: [[RVW-081]]. BOSS emits compatible `@dsCard` markers and does
  not point founders at it (reachability unverified).

**Read against BOSS, as a group.** All of (C) is the two-sources-of-truth shape BOSS's
`design-library` names and refuses: a place the button is defined that is not the code. They are
right for a company with a design team and a designer's tool in the loop — Scale — and wrong for a
founder whose only designer is the model. The pricing is the tell: per-editor seats price for teams.

## What this field says, read together

1. **The reuse index is being host-shipped at V1, and the detector exists.** Storybook MCP generates
   the component index for the three big frameworks; impeccable ships 61 executable tells and a
   design-system drift check with a rendered-page mode. BOSS should *point* at both where they apply
   and keep what neither has: the rung, the rule sets, the floor/value split, and *why*.
2. **Two ~95k-star tools now write `PRODUCT.md` / `DESIGN.md` / `MASTER.md` into the repo root.**
   A founder arriving at BOSS from any of them carries a design system BOSS's step 0 did not look
   for. Reading those files is a one-line seed; not reading them is a second system generated beside
   the first — the exact failure `/design-tokens-init` warns about in its own step 0.
3. **The most-starred skill in the field sells the attractor.** ui-ux-pro-max's palettes-by-industry
   is sameness as a feature. BOSS's *values-blank-until-earned* is the contrarian bet, and this file
   is the evidence that it is contrarian.
4. **Two current tells lists disagree** (tint vs. no-tint). An attractor, not a list — and the
   strongest argument yet that the model-curve trigger, not any one list, is the mechanism.

## What I did not find

- **impeccable's full 61-rule inventory** — neither the docs nor the README enumerate it; the
  rules live in the source and were not read this pass. The `git log -p` tap on that directory is
  named in the watchlist; it has not been run yet.
- **Whether impeccable's `DESIGN.md` and Google's can coexist in one repo** — nobody has written it
  down; presumably the second tool overwrites the first.
- **Any adoption number for Google's DESIGN.md outside Stitch** — the blog names only Stitch; the
  27.9k stars are the spec repo.
- **The 133k-weekly-installs figure for web-design-guidelines** — third-party index only, not
  verified at the source.
- **Cursor's, Codex's and Gemini's own design-skill directories** — not opened; impeccable's 17-host
  list suggests the same files are in all of them.
- **Chromatic / visual regression** as the drift boundary at Scale — deliberately out of scope for
  this pass; belongs with `design-drift-loop` when that rung has a project.

## Change log

- **2026-09-12** — filed. Nine tools read at source in one pass; three were already vetted and are
  cross-referenced rather than re-argued. The one decision it changed: `/design-tokens-init` step 0
  now looks for `DESIGN.md`, `PRODUCT.md`, `.impeccable/`, and `design-system/*/MASTER.md`
  (v0.307.0), per RVW-079's own re-open condition #2.
