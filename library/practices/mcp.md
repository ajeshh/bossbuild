---
id: PRACTICE-mcp
type: practice
owner: mentor-architect
status: active
host: stack-neutral
provenance: distilled from the 2026-07-23 research sweep (MCP thread) — MCP donated to the Linux Foundation / Agentic AI Foundation (Dec 2025), the 2026-07-28 spec revision, WorkOS/Anthropic ecosystem reads, Willison on MCP prompt-injection. Updates RVW-019 (NOT-YET → the standard is now durable; the *registry* is still preview and the spec is mid-revision). Security half lives in agent-security.md, not here (don't duplicate). BOSS v0.109.0.
---

# Practice — MCP (decide *whether it matters yet*, before you wire anything)

> **Where this sits.** This is a **decision** doc, not an integration guide. MCP's security surface lives in
> [`agent-security.md`](agent-security.md) (confused-deputy, poisoned servers, the lethal trifecta); this owns
> the prior question a founder should answer first — *do I need MCP at all, and in which of its three
> unrelated shapes?* BOSS's job here is JIT judgment (Principle #2), not a server scaffold.

## What MCP is now (so you can reason, not follow hype)

The Model Context Protocol is the standard way an AI app talks to tools and data sources — "the USB-C of
agents." As of 2026 it's **durable**: donated to the Linux Foundation's Agentic AI Foundation (Dec 2025),
adopted across ChatGPT / Claude / Cursor / Gemini / Copilot, ~97M SDK downloads/month. It is **plumbing, not
magic** — its value is *uniformity* (one client speaks to any server), not a new capability. The biggest spec
revision since launch lands **2026-07-28** (stateless core, Extensions, MCP Apps) — so anything you *build on*
MCP right now is building on ground that's still moving. Worth building *against*, not yet worth building *toward*.

## Three shapes — they are not the same decision

Founders (and hype) blur these. Separate them; they matter in very different orders.

**(a) Consume a server** — wire your app's agent to an existing MCP server (GitHub, Stripe, a DB) instead of
hand-coding the integration.
- *JIT trigger:* a feature genuinely needs an external tool/data source *at runtime* **and** a maintained
  server already exists for it.
- *Premature when:* you pull in servers "to have integrations" before a feature needs one. For most early
  apps a single **direct API call you control** beats a server you don't — and every server you connect is
  untrusted code in your agent's context (see `agent-security.md`; connecting several is how you assemble the
  lethal trifecta by accident).

**(b) Expose your product AS a server** — ship an MCP server so *every* agent (ChatGPT, Claude, Cursor…) can
drive your product. **This is the genuinely strategic one, and it's a distribution decision, not a dev one.**
- *JIT trigger:* you already have a product with users and an API surface, and "usable from inside
  ChatGPT/Claude" is a real acquisition or retention channel. → coordinate with **`mentor-gtm`** (it's a channel).
- *Premature when:* pre-PMF. And **dangerous before you can do the auth correctly** — a read-only server is
  easy and safe; a real one means OAuth 2.1 + PKCE, audience validation, per-tenant scoping (the cost cliff).
  Don't expose a write server until the `agent-security` auth checklist is met.

**(c) Build on it internally** — use MCP servers in *your own* Claude-Code/Cursor dev loop (talk to your DB,
docs, issue tracker while you build).
- *JIT trigger:* whenever it saves real time **and** you can name the servers you trust.
- *Premature is rarely the issue here; insecure is* — never wire a random registry server into a dev agent
  that holds your secrets. Treat registry servers as unpinned, untrusted dependencies.

## The ranking for BOSS's cohorts

Most founders should touch MCP **(c) casually → (a) when a feature demands it → (b) only once they have a
product worth distributing.** (b) is the shape everyone over-indexes on because it sounds like growth; it's
the one to gate hardest. And note: a founder building *in Claude Code* already has agentic retrieval and tool
use for free — grep/file-search over a repo is "retrieval as a tool" with no server at all. Many founders'
"I need MCP" is smaller than they think.

## One line for the conscience

*"MCP is real plumbing now — worth building against, not toward. Consume a server when a feature demands it,
expose one only when you have a product worth distributing, and never wire an untrusted server into an agent
that holds your secrets."*

## Deferred (don't build yet)

A **`/mcp` scaffolding skill** (help a founder scaffold a server/client) is attractive but **premature until
the 2026-07-28 spec settles** — and even then it should mostly *route this decision* + hand off the
auth-hardening checklist, not generate a server BOSS then owns (that's "doing," not mentoring). Re-open when a
real founder project hits the "should I MCP this?" wall (RVW-019's re-open condition, now half-met: the
standard is durable, the registry + spec are not). Ties [[IDEA-006]] (host portability) + [[IDEA-017]]
(founder-facing domain practices).

## Altitude / JIT

Silent on a Quickstart. Surfaces the first time a founder says "should I add MCP / an integration / expose my
API to agents?" — never as a wall, one shape at a time. Refresh on the spec curve (the 2026-07-28 revision;
`IDEA-014`).
