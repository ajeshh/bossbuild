---
id: RVW-019
type: verdict
owner: product-lead
status: recorded
created: 2026-06-20
verdict: NOT-YET
route: n/a
---

# RVW-019 — be ready to publish/consume MCP servers via the official MCP Registry

## The claim
- **Source:** registry.modelcontextprotocol.io (official MCP Registry, preview)
- **Core assertion:** the MCP ecosystem has an official registry; a tool like BOSS should have a be-ready
  path for publishing/consuming servers.
- **Inbox file:** `docs/research/inbox/mcp-server-publishing-registry.md`

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | Building on a preview registry fights "small, reversible, don't build on shifting ground." |
| 2 | Evidence grade | Real ecosystem move, but **preview** — trust/moderation unsettled. |
| 3 | Duplicate or sharpen? | BOSS deliberately bet **skills-as-files over MCP** (RVW-013 neighborhood; Jerry Liu's convergence). Adopting MCP-publishing risks duplicating that bet. |
| 4 | Serves / harms? | No founder need it serves today. |
| 5 | Cost / ceremony | Premature integration weight. |

## Verdict: NOT-YET
Readiness awareness, not a dependency. The registry is preview and BOSS already chose the skills-file
path; building MCP-publishing now is premature ceremony on shifting ground.

## If REJECT / NOT-YET
- **Why not:** preview/unstable + duplicates the skills-over-MCP bet.
- **Re-open condition:** the registry reaches stable **and** a real founder project needs to publish or
  consume an MCP server (a genuine integration, not BOSS infra). Ties to IDEA-006 (host portability).

## Notes
- Prior related: RVW-013 (skill-creator), the skills-can-replace-MCP finding in the gaps dossier.
- BOSS version when recorded: 0.66.0

## Update 2026-07-23 (research sweep)
The *standard* re-open condition is now **met** — MCP is durable (donated to the Linux Foundation / Agentic
AI Foundation, Dec 2025; adopted across every major vendor). The *registry* re-open condition is **not** (still
preview; the biggest-ever spec revision lands 2026-07-28). Routed: a lean **`library/practices/mcp.md`** decision
practice (consume / expose / build-on, JIT-gated; v0.109.0) — teach the judgment, not a scaffold. The **`/mcp`
scaffolding skill stays deferred** until the spec settles *and* a real founder project needs it. See
[SESSION-2026-07-23-research-sweep](../sessions/SESSION-2026-07-23-research-sweep.md).
