---
id: IDEA-044
type: idea
owner: product-lead
status: shipped
gist: BOSS had birth and life and no death. A way to end a project honestly, harvest what it taught, and mark it retired — quitting faster is the payoff validation promises.
proof: stages/L0-quickstart/template/.claude/skills/sunset
created: 2026-07-02
source: fable-campaign step-back (Fable 5 deep read, 2026-07-02)
---

# IDEA-044 — `/sunset`: quitting as a first-class feature

> **Implemented v0.103.0 (2026-07-03).** New L0 `/sunset` skill (post-mortem → harvest → clean close);
> new `boss retire [--undo]` CLI verb + `retired`/`retired_on` project status in the registry + local
> stamp; `boss list` folds retired projects, `boss board` shows a quiet retired banner, `boss insights`
> gains a **kill-speed** line (bets run vs. retired + median idea→retire days). Deliberate-invoke only;
> retiring ≠ deleting and is reversible. Zero-dep; gate 122/0; `/tmp`-verified end-to-end.

## The gap

PRINCIPLES.md stakes BOSS's whole "why" on Camuffo: validation's payoff is **deciding faster, including
quitting faster**. But BOSS has birth (`boss new`), life (modes), and **no death**. There is no way to
honestly end a project, harvest what it taught, and mark it retired. The README's own sharp-fit persona has
"2+ unfinished projects in `~/projects/`" — those projects are *undead*: never killed, never learned-from,
silently accusing. No tool on earth helps a founder close a project with dignity. The conscience that helps
you **stop** may be more novel than the one that helps you start.

## The shape

A deliberate-invoke L0 skill (`/sunset`), never a hook (a tool that suggests quitting unprompted would be
the most violent possible conscience over-fire). Three movements:

1. **The honest post-mortem** — what was the bet, what evidence came in (reads the canvas + any EVID
   ledger [[IDEA-045]] + devlog), what did this project teach that the next one inherits? Framed as
   *"this was a real experiment that returned an answer"*, never as failure. Mom-Test discipline on the
   founder's own narrative: what did you observe vs. what do you still just believe?
2. **The harvest** — route reusable patterns UP via `/boss-learn` on the way out (the exit is a natural
   Principle-#1 breakpoint — arguably the richest one, and currently completely uncaptured). Write a
   `docs/POSTMORTEM.md` the founder keeps.
3. **The clean close** — registry status → `retired` (new state in `~/.boss/registry.json` + `.boss/`),
   `boss board` shows it honestly, `boss insights` can finally answer "how many bets did I run and how
   fast did I kill the dead ones?" — *kill-speed is the Camuffo metric and BOSS currently can't measure it.*

Voice matters more here than anywhere: the seasoned hand who's shut down more projects than most people
have started. No grief-bot performance; no "congrats on your pivot!" cheerleading. One honest page.

## Why it's differentiated

Every tool in the ecosystem optimizes starting and building. Nobody ships an ending. It's cheap (skill +
one registry state), deeply on-thesis, on-voice, and it quietly builds the substrate for portfolio-level
learning ([[IDEA-049]]): an incubator can only learn from outcomes if outcomes get recorded.

## Guardrails

- **Never a hook.** Deliberate-invoke only. The conscience may *point at* `/sunset` at most inside an
  existing deliberate moment (e.g. `/drift-deep` finding a long-dead project), never push.
- Retiring ≠ deleting. Nothing destructive; the repo stays; only status changes.
- The post-mortem must not become ceremony — one page, three questions, done in 20 minutes.

## OPUS HANDOFF PROMPT

```
You are implementing IDEA-044 (/sunset — quitting as a first-class feature) for BOSS.
Repo: ~/Projects/bossbuild. Read CLAUDE.md, docs/RESUME.md, and
docs/ideas/IDEA-044-sunset-quitting-as-first-class.md first. Design decisions are made;
do not re-litigate.

CONSTRAINTS: src/ zero-dep (Node built-ins only); machine state JSON; small reversible
commits; BOSS voice (seasoned hand, no performed warmth, no grief-bot).

TASKS
1. Registry support: add a `retired` project status. Where project status lives today
   (check src/registry.js + .boss/manifest or config), support status "retired" with a
   retired_on date. `boss board` renders retired projects folded/quiet (mirror the
   shipped_on archive pattern from v0.69). `boss insights` gains ONE honest new line when
   ≥1 retired project exists: bets run, bets retired, median idea→retire time
   ("kill-speed") — facts from real dates, never scores or judgment. Zero-dep.
2. New L0 skill stages/L0-quickstart/template/.claude/skills/sunset/SKILL.md — /sunset:
   - Movement 1, the honest post-mortem: read the project's canvas, docs/ideas/, devlog,
     and docs/evidence/ if present; ask the founder 3 questions max (the bet; what
     evidence actually came in — observed vs believed; what this project taught). Frame:
     "a real experiment that returned an answer," never failure language.
   - Movement 2, the harvest: surface UP-candidates and offer to run /boss-learn on each
     (offer, don't auto-run). Write docs/POSTMORTEM.md (one page).
   - Movement 3, the close: set status retired + retired_on in .boss state and the
     registry (via a small `boss retire` CLI verb OR direct state edit — pick whichever
     the existing skill/CLI split supports; predicate/runner split, model logic stays in
     the skill).
   - Explicit guardrail text in the skill: never invoked by the conscience unprompted;
     nothing is deleted; reversible (status can flip back).
3. Wayfinding: `boss map` lists /sunset; one line in docs/GUIDE.md's lifecycle section
   ("projects can end well — /sunset"); README gets ONE sentence in "What BOSS is" only
   if it fits the existing rhythm (voice-check it).
4. Version: bump VERSION (minor) + registry/CHANGELOG.md entry: "/sunset — projects can
   end honestly: post-mortem, harvest UP, retired status; boss insights learns kill-speed."
5. TEST (CLAUDE.md rule 6): scaffold a throwaway in /tmp, run /sunset's CLI half
   (retire + board fold + insights line), verify skill file lands with 0 placeholders via
   boss new, then clean /tmp and prune registry/projects.json.
Do not commit unless asked. Report file-by-file when done.
```
