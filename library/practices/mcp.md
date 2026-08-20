---
id: PRACTICE-mcp
type: practice
owner: mentor-architect
status: active
host: stack-neutral
provenance: distilled from the 2026-07-23 research sweep (MCP thread) — MCP donated to the Linux Foundation / Agentic AI Foundation (Dec 2025), WorkOS/Anthropic ecosystem reads, Willison on MCP prompt-injection. Updates RVW-019 (NOT-YET → the standard is now durable). Security half lives in agent-security.md, not here (don't duplicate). BOSS v0.109.0 · **refreshed 2026-07-31 (v0.136.0) against the SHIPPED 2026-07-28 revision, read from the primary changelog** — the first event-fired run of /practice-refresh. What changed here is the *judgment*, not just the date: this doc called the ground "still moving" and said build against-not-toward; the revision landed with a formal feature-lifecycle + 12-month deprecation policy, which is the ground acquiring rules for how it moves. Caught by IDEA-056's audit at 7 days old — cadence would not have flagged it until October. · **swept again 2026-08-20 (v0.165.0)** — the prior pass read the revision as *governance* and treated the extensions framework as a footnote, which under-read the two extensions that change decisions rather than plumbing: MCP Apps (GA Jan 2026) makes shape (b) a product-surface call, not only a distribution one, and Tasks is the long-running seam that ties this doc to automation.md. Registry maturity (still preview) was never stated. Nothing here was found *wrong*; it was found under-weighted.
provenance_public: Distilled from the protocol's own record — MCP donated to the Linux Foundation / Agentic AI Foundation (Dec 2025), WorkOS and Anthropic ecosystem reads, Willison on MCP prompt injection — then refreshed against the shipped 2026-07-28 revision, read from the primary changelog. What changed on that pass was the judgment, not just the date: this doc had called the ground "still moving" and said build against it rather than toward it, and then the revision landed with a formal feature-lifecycle and a 12-month deprecation policy, which is the ground acquiring rules for how it moves. A later sweep found the extensions under-weighted rather than wrong — MCP Apps (GA Jan 2026) makes the integration shape a product-surface call and not only a distribution one, and Tasks is the long-running seam. The registry is still preview. The security half lives in agent-security.md, deliberately not duplicated here.
last_reviewed: 2026-08-20
review_by: 2026-11-18
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
  **Two of these are decisions, not plumbing** — see the section below; don't let the word "extension" file
  them under detail.
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

## The two extensions that change a decision (everything else is plumbing)

The extensions framework mostly matters to server authors. Two of its inhabitants change what a *founder*
is deciding, and both are easy to skim past because they arrived filed as features.

- **MCP Apps (GA since January 2026)** — a server can render **interactive UI inside the client**: charts
  you filter, forms you submit, a view you drill into, running in ChatGPT / Claude / VS Code / Goose. This
  moves shape (b) from *"expose your tools"* to **"a piece of your product's interface runs inside someone
  else's client."** That is a product-surface decision with a support burden and a brand surface, not just a
  distribution one — and it is the half founders under-cost, because a tool call fails invisibly while a
  broken embedded UI fails in front of the user, in a client you don't control and can't hotfix.
- **Tasks** — long-running work returns a **durable, server-minted handle you poll**, instead of holding a
  connection open. This is the seam where MCP meets automation: it's what makes "the agent kicks off a job
  that finishes later" a supported shape rather than a timeout you engineer around. If you're reaching for
  it, the prior question is on the ladder in [`automation.md`](automation.md) — *which rung is this, and
  does it need a model in the loop at all?*

**Not yet GA: the registry.** It's still **preview** — listings change as servers are validated and
namespaces verified. Treat a registry entry as a lead, never as a vetting.

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
- *Before you connect one, run the pre-install checklist* in [`agent-security.md`](agent-security.md). The
  registry is preview and most servers are unreviewed; a tool *description* is attacker-controlled text that
  lands in your context as if you'd written it.

**(b) Expose your product AS a server** — ship an MCP server so *every* agent (ChatGPT, Claude, Cursor…) can
drive your product. **This is the genuinely strategic one, and it's a distribution decision, not a dev one.**
- *JIT trigger:* you already have a product with users and an API surface, and "usable from inside
  ChatGPT/Claude" is a real acquisition or retention channel. → coordinate with **`mentor-customers`** (it's a channel).
- *Premature when:* pre-PMF. And **dangerous before you can do the auth correctly** — a read-only server is
  easy and safe; a real one means OAuth 2.1 + PKCE, audience validation, per-tenant scoping, plus (since
  2026-07-28) `iss` validation and credentials keyed to their issuing authorization server. Don't expose a
  write server until the `agent-security` auth checklist is met.
- *What the 2026-07-28 revision changed here:* the **hosting** floor dropped — a stateless server is a
  serverless function, so "expose a read-only server" is now genuinely cheap. **The auth cliff did not
  move.** If anything it got more precise (Dynamic Client Registration is deprecated in favor of Client ID
  Metadata Documents). Cheaper to stand up is not the same as safe to open; the gate is still auth, not effort.
- *And the ceiling rose while the floor dropped.* With **MCP Apps**, shape (b) can now mean shipping UI into
  a client you don't control — so the honest ordering is **read-only tools → write tools (auth cliff) → an
  App**, and most founders should stop after the first. An App is a second front end to maintain, on someone
  else's release cadence, and it earns its keep only when *"used from inside the assistant"* is the actual
  channel — which is a `mentor-customers` question before it is an engineering one.

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

**Re-decided again 2026-08-20, and the answer got cheaper.** The trigger that arrived was a *market* read —
"MCP and automation are becoming huge" — which is not the demand half; the demand half is a founder hitting
the wall, and that still hasn't happened. But the assessment found the real defect was never the missing
skill: **`mentor-architect` owns this practice in its own frontmatter and named MCP nowhere in its AI-MVP
decision set**, so the decision had no route to a founder at all. That's a composition bug, not a missing
verb. Fixed by adding the row to the mentor and the deterministic/agentic split to `/ai-first-init` step 1.
**The skill stays deferred, and the demand trigger is unchanged** — but the thing it was supposed to deliver
now ships without it, which raises the bar for ever building it.

## Altitude / JIT

Silent on a Quickstart. Surfaces the first time a founder says "should I add MCP / an integration / expose my
API to agents?" — never as a wall, one shape at a time. **The route is `mentor-architect`'s AI-MVP decision
set** (the integration-shape row), with `/ai-first-init` step 1 catching the adjacent automation question;
full depth is `boss craft mcp`. **Refresh on the spec curve** (`curve: protocol`,
90d) — and on the event, not the date: this doc was wrong seven days after it was written because a spec
landed on a Tuesday. Watch the [deprecated-features registry](https://modelcontextprotocol.io/specification/2026-07-28/deprecated)
and the [changelog](https://modelcontextprotocol.io/specification/2026-07-28/changelog). A spec
revision is what dates this doc — not the calendar, and not a model release.
