# library/ — the superset

The de-dhuned, generalized knowledge base that stages draw from and the learning loop feeds.

| Folder | Holds | Source |
|---|---|---|
| `agents/` | Structural agent templates (placeholders for domain specifics) | dhun's structural agents |
| `skills/` | Structural skill templates | dhun's structural skills |
| `hooks/` | Generic hooks (type-check slot, frontmatter, session lifecycle) | dhun's hooks, stack-genericized |
| `practices/` | Best-practice docs: git, testing, data/schema, security, context discipline, harness engineering, market + lifecycle | mined from a dogfooded product's memory + workflow docs, then grown by vetting outside claims and routing what survives with `/boss-learn` |
| `memory-seed/` | Project-agnostic feedback memories every new project should start with | mined from dhun's 143 memory files |

**Authoring rule:** anything here is stack-neutral and project-neutral. Domain specifics
(dhun's music/DJ logic, raag engine, Rangoli, etc.) never land here. Use `{{PLACEHOLDERS}}`
for anything project-specific.

**How it grows:** `/boss-learn` promotes a proven practice from a real project into here
(human-gated), bumps BOSS's VERSION, and appends `registry/CHANGELOG.md`. Existing projects
pull it via `/boss-sync`.
