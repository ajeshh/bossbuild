---
id: IDEA-108
type: idea
owner: designer
status: deferred (re-open when a designer arrives with a file — the seam is real on one layer and gated on another; the honest list is below)
gist: Design-tool integration as its own feature — what BOSS can honestly do to let a designer open, import, and round-trip the design guidelines in their tool (Figma today), sorted by which direction actually works and on which plan; refuses the vendor-shaped mechanisms (a plugin, a .fig, an MCP BOSS ships).
proof: none
proof_note: Captured. The one build that stands on its own is a `design:` link per component and pattern, rendered as "Open in your design tool" — zero-dep, class-named, and the honest coverage number ("2 of 4 components have a design-file counterpart") comes free with it.
created: 2026-09-13
program: design-system
relates: IDEA-107, IDEA-106, RVW-082, RVW-078, RVW-081, IDEA-091
source: Ajesh, 2026-09-13 — "I think of figma integration as its own feature, like how to open the key
  aspects in figma. Maybe we auto generate a file for figma? what else could we do to further
  integrate into figma?"
altitude: what BOSS ships a founder (not BOSS's own practice)
---

# IDEA-108 — design-tool integration: open it, import it, round-trip it

## What was checked today, at source (2026-09-13)

| Claim | Source opened | Finding |
|---|---|---|
| The Variables REST API is two-way | developers.figma.com/docs/rest-api/variables/ | **Read and write both require the Enterprise plan** ("Any organization member … Enterprise" to read; "Full seats, admins … Enterprise" to write). [[RVW-082]] graded this layer *verified two-way*; it is — **for enterprises**. A solo founder on a free or professional plan cannot use it in either direction. |
| Variables import a tokens JSON natively | help.figma.com "Overview of variables, collections, and modes" | **Not on the page.** Native DTCG import without a plugin is **unverified** as of today. The path that is known to work for everyone is a tokens plugin (community; name the class in shipped text). |
| Design→code component mapping exists | [[RVW-082]] (Code Connect, vendor-documented) | Unchanged: real, vendor-sourced, direction not multiplier. |
| Code→editable design file round-trips | [[RVW-082]] | Unchanged: **does not verify**. |
| IBM's design system ships an MCP server | carbon-website `developing/carbon-mcp` (Public Preview; a *Token conservation* page) | Real. Confirms [[RVW-078]] — the design system as a **retrieval substrate for the agent** — and that even IBM worries about context tokens. BOSS's `manifest.json` is that substrate; the server is the host's job ([[RVW-081]]). |

## What "Figma integration" can honestly mean — by direction, by plan

| # | Integration | Direction | Real for whom | BOSS's move |
|---|---|---|---|---|
| 1 | **`tokens.json` (DTCG) as a guaranteed file** | code → tool | everyone, via a tokens plugin; Enterprise via the API; native import unverified | write the file always ([[IDEA-107]] step 2); the site offers it as a download and says *which* path applies |
| 2 | **Icons as SVG files** in `docs/design/icons/` | code → tool | everyone (drag in) | the site renders the set from the files; a zip is one click |
| 3 | **`design:` link per component / pattern** — a URL into the founder's own file and node | tool ← site | everyone | one frontmatter field in `COMPONENTS.md` / the manifest; the site renders **Open in your design tool**; **kit coverage** (*2 of 4 components have a design counterpart*) is the honest number this yields |
| 4 | **Return trip on the token layer** — designer exports DTCG, `--check` diffs it | tool → code | everyone with a plugin that exports DTCG | already in 107's plan; a diff per token, founder decides |
| 5 | **A mapping file for the tool's dev mode** (Code Connect) generated from the manifest | tool → code | Figma users; the format is the vendor's | ⚠️ **question** — BOSS would be *emitting a vendor's file format*. Not the same as naming the class. Hold; ask a designer whether they'd use it before writing an emitter |
| 6 | **The tool's agent server** (Figma's dev-mode MCP; Carbon's MCP) | tool → agent | users of that tool | **practice-level, dated** — *"if your design tool exposes an agent server, the agent reads the frame, not a screenshot"*; nothing shipped |
| 7 | **Auto-generate a `.fig`** | code → tool | nobody | **refuse** — no open file format; the honest version of this ask is row 1 + row 2 |
| 8 | **A BOSS-shipped Figma plugin** | — | — | **refuse** (PRINCIPLE #4, vendor artifact) — until native import is verified absent *and* a founder asks; then the answer is still a pointer at the plugin class |

Rows 1–4 are compositions over files BOSS already writes or could write with one field. Row 3 is the
build that stands alone: it answers *"how to open the key aspects in Figma"* literally, costs one
frontmatter field, and produces the only integration number worth showing.

## Carbon's design-kit discipline, read at source

Carbon's *component checklist* (`contributing/component-checklist`) has a **Design kit** section:
the Figma component must be *built to spec — matching the design spec down to the pixel* and
*published to a library*; and its definition of done runs Draft → Preview candidate → Preview →
Stable across *code, kit, docs, design*. For a solo founder the kit is the designer's, not BOSS's.
What carries over is the **coverage idea**: a component is not *Stable* until the code, the docs
and the kit agree — and BOSS can show which of the three exist (row 3 above), never assert they match.

## Refusals — settled

A plugin · a `.fig` · an MCP server BOSS runs · a sync engine ([[RVW-081]]) · any sentence that
says "two-way" without "for enterprises" after it · a vendor name in `stages/**`.

## Open questions

1. Is native DTCG import present in the tool today? (A ten-minute check with a real account;
   if yes, row 1 needs no plugin sentence.)
2. Would a designer use a generated dev-mode mapping file (row 5), or do they write those
   themselves? Ask one — it decides whether BOSS ever emits a vendor format.
3. Where does the `design:` link live for a *pattern* (a do/don't pair) — `PATTERNS.md` row, or
   only components?

## Gate

`captured`. Trigger, unchanged from [[RVW-082]]: **a designer arrives on a real project carrying a
file.** Until then, row 3 is cheap enough to draw on the prototype (done in [[IDEA-107]] v1), and
[[RVW-082]] gets a dated correction note about the plan gate.

## Capture log

- 2026-09-13 — seed (Ajesh). Checked at source: Variables API is Enterprise-only both ways;
  native JSON import unverified; Carbon ships an MCP and a kit checklist. Eight integrations sorted
  by direction and plan; three refusals; one build that stands alone (the `design:` link).
