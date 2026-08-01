---
id: PRACTICE-mcp
type: practice
owner: mentor-architect
status: active
host: stack-neutral
provenance: distilled from the 2026-07-23 research sweep (MCP thread) — MCP donated to the Linux Foundation / Agentic AI Foundation (Dec 2025), WorkOS/Anthropic ecosystem reads, Willison on MCP prompt-injection. Updates RVW-019 (NOT-YET → the standard is now durable). Security half lives in agent-security.md, not here (don't duplicate). BOSS v0.109.0 · **refreshed 2026-07-31 (v0.136.0) against the SHIPPED 2026-07-28 revision, read from the primary changelog** — the first event-fired run of /practice-refresh. What changed here is the *judgment*, not just the date: this doc called the ground "still moving" and said build against-not-toward; the revision landed with a formal feature-lifecycle + 12-month deprecation policy, which is the ground acquiring rules for how it moves. Caught by IDEA-056's audit at 7 days old — cadence would not have flagged it until October.
last_reviewed: 2026-07-31
review_by: 2026-10-29
curve: protocol
---

# Practice — MCP (decide *whether it matters yet*, before you wire anything)

> **Where this sits.** This is a **decision** doc, not an integration guide. MCP's security surface lives in
> [`agent-security.md`](agent-security.md) (confused-deputy, poisoned servers, the lethal trifecta); this owns
> the prior question a founder should answer first — *do I need MCP at all, and in which of its three
> unrelated shapes?* BOSS's job here is JIT judgment (Principle #2), not a server scaffold.

## What MCP is now (so you can reason, not follow hype)

The Model Context Protocol is the standard way an AI app talks to tools and data sources — "the USB-C of
agents." As of 2026 it's **durable**: donated to the Linux Foundation's Agentic AI Foundation (Dec 2025),
adopted across ChatGPT / Claude / Cursor / Gemini / Copilot. It is **plumbing, not magic** — its value is
*uniformity* (one client speaks to any server), not a new capability.

**The 2026-07-28 revision shipped, and it is the one that changes this doc's advice.** The headline is not any
single feature — it's that the protocol **acquired rules for how it changes**:

- **A formal feature-lifecycle + deprecation policy**: Active / Deprecated / Removed states, a **minimum
  twelve-month deprecation window**, and a public registry of deprecated features. This is the part that
  matters to a founder. It is the difference between *"the ground is moving"* and *"the ground moves on a
  published schedule you can plan around."*
- **An extensions framework** (`extensions` on client/server capabilities). New capability — Tasks, MCP Apps —
  now arrives as versioned extensions instead of core-protocol churn. The core is meant to stop growing.
- **A stateless core.** The `initialize`/`initialized` handshake and protocol-level sessions (the
  `Mcp-Session-Id` header) are **gone**; every request carries its own version and capabilities, and servers
  implement `server/discover`. Practically: **an MCP server can now be a plain serverless function** — no
  sticky sessions, no long-lived process. That is a real cost-floor drop for shape (b).
- **Authorization got more specified, not less**: `iss` validation (RFC 9207), credentials keyed to their
  issuing authorization server, and **OAuth Dynamic Client Registration deprecated** in favor of Client ID
  Metadata Documents.

**The honest counterweight: this revision was substantially breaking.** Sessions, the handshake, `ping`,
`logging/setLevel`, and SSE stream resumability were removed; server-initiated requests (roots, sampling,
elicitation) are replaced by the Multi-Round-Trip-Request pattern; **Roots, Sampling and Logging are
deprecated outright.** If you built against the previous revision, you have migration work — the twelve-month
window is what makes that manageable rather than an emergency.

**So the advice changes:** MCP is no longer ground to merely build *against*. The core is stable enough to
build *on*, and the lifecycle policy is your insurance. What has *not* changed is the JIT question below —
"is it stable?" was never the main reason to wait. **"Do you need it yet?" was, and still is.**

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
  easy and safe; a real one means OAuth 2.1 + PKCE, audience validation, per-tenant scoping, plus (since
  2026-07-28) `iss` validation and credentials keyed to their issuing authorization server. Don't expose a
  write server until the `agent-security` auth checklist is met.
- *What the 2026-07-28 revision changed here:* the **hosting** floor dropped — a stateless server is a
  serverless function, so "expose a read-only server" is now genuinely cheap. **The auth cliff did not
  move.** If anything it got more precise (Dynamic Client Registration is deprecated in favor of Client ID
  Metadata Documents). Cheaper to stand up is not the same as safe to open; the gate is still auth, not effort.

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

*"MCP is settled plumbing now — stable enough to build on, with a twelve-month deprecation window as your
insurance. That was never the reason to wait. Consume a server when a feature demands it, expose one only
when you have a product worth distributing, and never wire an untrusted server into an agent that holds your
secrets."*

## Deferred (don't build yet) — re-decided 2026-07-31

A **`/mcp` scaffolding skill** (help a founder scaffold a server/client) stays deferred — but the reason has
changed, and that distinction is the whole point of re-deciding rather than letting a deferral sit.

The old reason was *"premature until the 2026-07-28 spec settles."* **That condition is now met**, and a
deferral whose stated condition has expired is not a decision — it's just a stale note. So, explicitly:

- **The spec half of RVW-019's re-open condition: MET.** The standard is durable, the core is stable, and the
  lifecycle policy means a scaffold written today has a twelve-month floor.
- **The demand half: NOT met.** No real founder project has hit the "should I MCP this?" wall. That was always
  the load-bearing half — building a scaffolder for a cohort of zero is the ceremony Principle #2 refuses, and
  the current mandate is compose-and-subtract, not add.

**Re-open on the demand trigger alone** — a real project asking the question. And when it does, the skill
should mostly *route this decision* + hand off the auth-hardening checklist, not generate a server BOSS then
owns (that's "doing," not mentoring). Ties [[IDEA-006]] (host portability) + [[IDEA-017]] (founder-facing
domain practices).

## Altitude / JIT

Silent on a Quickstart. Surfaces the first time a founder says "should I add MCP / an integration / expose my
API to agents?" — never as a wall, one shape at a time. **Refresh on the spec curve** (`curve: protocol`,
90d) — and on the event, not the date: this doc was wrong seven days after it was written because a spec
landed on a Tuesday. Watch the [deprecated-features registry](https://modelcontextprotocol.io/specification/2026-07-28/deprecated)
and the [changelog](https://modelcontextprotocol.io/specification/2026-07-28/changelog); fire
`/practice-refresh --event` when a revision ships. Model-curve twin: `IDEA-014` / `/recalibrate`.
