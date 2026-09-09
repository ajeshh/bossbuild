# library/ — the shelf

**What BOSS knows.** Not what BOSS ships — that lives in `stages/<id>/template/`, and the two are
kept apart on purpose.

| Folder | Holds | Read by |
|---|---|---|
| `practices/` | Best-practice docs: git, testing, data/schema, security, context discipline, harness engineering, market + lifecycle | `boss craft <name>`, from inside any project |

Plus two data files the CLI reads directly: `deceptive-patterns.json` (the shape × surface catalog
behind `boss patterns`) and `sources.json` (the citation registry behind `/credits`).

**One folder, and that is the point.** Everything on this shelf has exactly one copy and a reader
that resolves from the installed package. If something here is read by nothing, it does not belong
here — see below.

**Authoring rule:** anything here is stack-neutral and project-neutral. Use `{{PLACEHOLDERS}}` for
anything project-specific. `provenance:` is internal and never renders to a founder;
`provenance_public:` is the one that does.

## Why there are no agents, skills or hooks here

There were, until v0.246.0, and they were a mirror. `applyStage()` and `managedFiles()` read
`stages/<id>/template/` and nothing else, so an agent on this shelf shipped to nobody — it had to
be hand-copied into a template first, after which the two copies drifted. Four of the eight
artifacts with a twin had, every one stale on this side, two of them still carrying defects
already fixed on the shipped copy. And the route that was supposed to fill this shelf was never
once used: in 245 releases the CHANGELOG records not a single `boss learn` promotion.

So the line is now: **the shelf holds what BOSS knows; the stages hold what BOSS ships.** An agent,
skill or hook is a thing a founder gets at a rung, and `boss learn --as agents --mode v1` puts it
where that is true — in the stage template, registered in that stage's manifest, because a file the
manifest doesn't claim never syncs. See [`IDEA-038`](../docs/ideas/IDEA-038-library-as-canonical-shelf.md).

## Why there is no `memory-seed/` either

It went in v0.249.0, one release after the mirror, for a different reason: **its premise had already
been answered NO.** The shelf existed to hold *"project-agnostic feedback memories every new project
should start with"* — but [`IDEA-080`](../docs/ideas/IDEA-080-durable-memory-ships-as-a-pointer.md)
and [`DEC-015`](../docs/decisions/) settled at v0.245.0 that durable memory is **machine-local and
person-scoped**: `autoMemoryDirectory` stays unset, and BOSS does not seed, manage or ship anyone's
memory store. The shelf outlived its own premise by four releases, holding a README and one example
and no actual seeds.

The one genuinely good thing on it — the **durable-facts vs working-state** table — moved into
[`practices/context-discipline.md`](practices/context-discipline.md), which ships and is read. Two
places in that same practice had been *delegating* the cut to the unreadable shelf file, so a founder
running `boss craft context-discipline` was told where the answer lived and could not open it.

## How it grows

`/boss-learn` promotes a proven pattern from a real project (human-gated), bumps BOSS's VERSION,
and appends `registry/CHANGELOG.md`. Existing projects pull it via `/boss-sync`.
