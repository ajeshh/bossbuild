---
id: IDEA-112
type: idea
owner: designer
status: shipped
proof: stages/L1-mvp/template/.claude/skills/design-review/templates/component-usage.md
gist: Everything the agent or the founder builds becomes a reusable, documented part of the design library without a separate act — and a new part is asked for, not slipped in. Families 4 → 10 (the decisions each forces, never a catalog); a usage page per component (when · when not · why it exists · variants · content · layout · accessibility · research) written at the review and read by agents, the founder, the team and the designer alike; a lifecycle (proposed → draft → stable → deprecated → retired) where a usage page written before the code IS the request; and a mechanical read of what is in the tree with no row, so the index cannot quietly lag.
created: 2026-09-13
from: IDEA-107
relates: IDEA-108, FEAT-030, FEAT-033, IDEA-092
promoted_to: FEAT-037, IDEA-113
---

# The library keeps itself

> Ajesh, 2026-09-13: *"as the agents or entrepreneur builds more components or anything, we should
> be able to translate that into a design library so that it becomes reusable, highly leveraged…
> expand more families, and become more robust. also its not just components… not just for the
> agents to leverage them and know when to use, but also for the entrepreneur or his team, or his
> designer… you make updates in the library, then it should be easy to request updating it… keeping
> it in check to not introduce new elements unless its new behavior entirely… when to reuse, when to
> make something new, our system should be able to guide and assist with this."*

## What BOSS already holds (grep first)

- **Reuse first, extend second, create last** — `component-reuse-guard` asks *reuse, adjust, or new?*
  at the write, with near-names and the job-not-look test, and says *if it IS new, say why in one
  line and add its row*. **Nothing holds the why.** The one line goes into the chat and is gone.
- **The index** — `COMPONENTS.md` at MVP (authored, can lag; the template says the staleness is
  *visible* but nothing enforces it), `manifest.json` at V1 (generated from the code, source hash,
  usage count, near-duplicate badge). The lag between a component in the tree and its row is the
  gap the reuse rule falls through.
- **Four element families** with their decisions (inputs · data display · icons · waiting). The
  field converges on ten; six have no slot (navigation · overlays · selection controls · feedback ·
  forms as a whole · layout primitives). Counted 2026-09-13: *toast* 0, *toggle* 0, *tabs* 0.
- **No usage page per component.** Carbon (Usage · Style · Code · Accessibility), Fluent
  (Resources · Types · Behavior · Layout · Accessibility · Content) and GOV.UK (+ research) all
  have one; BOSS's card has purpose, variants, states, import, a frame and a research chip — the
  *when* is nowhere.
- **Lifecycle** — three statuses (draft · stable · deprecated → X) plus retired rows. No *proposed*:
  a designer or teammate has no way to ask for a part except to build it.

## The plan — four slices, one FEAT

| # | Slice | Mechanism | Reads / writes |
|---|---|---|---|
| 1 | **Families 4 → 10** | the pattern-set template gains navigation · overlays · selection controls · feedback · forms as a whole · layout primitives — each as *the decisions it forces*, never a catalog, seeded only for what the product has | `PATTERNS.md` |
| 2 | **A usage page per component** | `docs/design/components/<Name>.md` — When it applies · When it doesn't · **Why it exists** (reuse / adjust / new — and the new behaviour) · Variants and when · Content · Layout · Accessibility · Research. `/design-review` writes it at that component's review (the moment); the reuse guard sends the one-line *why* there; `boss design` renders it as the card's Usage and lists every component without one | `docs/design/components/*.md` |
| 3 | **The tree, read** | `boss design` scans the conventional component directories the way `/design-library` does and reports *N components in the tree with no row* — the MVP-time boundary the authored index never had | `src/components/**` etc. → the page and `--questions` |
| 4 | **Lifecycle, with a front door** | `proposed → draft → stable → deprecated → retired`. A usage page with `status: proposed` and no file IS the request — a designer or teammate writes what it is for and why it is new; `/design-review` picks it up; the page lists proposals under *Asked for*. Resources gains *How to ask for a part / change a token / retire one* | the usage page's `status:` · the index's Status column |

**Refused, still:** a shipped component set (PRINCIPLE #4; the consistent-looking-behaves-differently
trap). A hook that writes docs on its own (a guard hands the instruction to the agent; the page is
the boundary that notices when it wasn't followed).

## Capture log
- 2026-09-13 — seed (Ajesh, above). The system already asks the question; it never kept the answer.
- 2026-09-13 — all four slices landed as FEAT-037 in one commit; the refusals hold.
