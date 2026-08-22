---
id: PRACTICE-agent-security
type: practice
owner: mentor-architect
status: active
host: claude-code
provenance: distilled from Simon Willison's 2026 agentic-security writing (lethal trifecta; "Agents Rule of Two"; classifiers are non-deterministic) — BOSS v0.48.0, IDEA-026 Part B · hardened v0.79.0 with the 2026 agent-native surface — OWASP Agentic ASI Top 10 (RVW-042), agentic misalignment (RVW-032), Anthropic containment + Redwood control (RVW-044), insecure AI-generated code & client-side key exposure (RVW-054) · UI-dark-patterns-as-injection-surface added v0.96.0 (RVW-060, /humane-refresh sweep pass 2) · MCP confused-deputy/token-passthrough + tool-layer memory-poisoning defense + AI-code iteration-degradation + Veracode Spring-2026 refresh added v0.108.0 (2026-07-23 research sweep) · **sharpened v0.165.0 (2026-08-20), clock deliberately NOT moved** — the MCP-and-automation assessment added the pre-install pass (tool descriptions as untrusted input; poisoned descriptions are ASI01 goal-hijack, not supply-chain; registry still preview; re-read on update). One bullet is not a threat sweep, and per the v0.150.0 correction "freshened a little" is not a claimable state — the next real sweep still owns 2026-11-09. · **corrected v0.216.0 (2026-08-21), clock again deliberately NOT moved** — the /red-team deep review verified four load-bearing citations and three were off: the OWASP LLM list revised 2026-08-04 (five days before this practice's last review) and renumbered eight of ten; Veracode's Spring-2026 figures were superseded by the 2026 annual report published 2026-07-28, fourteen days *before* that same review; and "near-99% on stateful agents" was the memory-*injection* rate reported as if it were the attack rate. A clause claiming human oversight was tested against dark patterns was removed as unsupported by the source. Corrections are not a sweep.
provenance_public: Distilled from Simon Willison's agentic-security writing (the lethal trifecta; "Agents Rule of Two"; classifiers are non-deterministic), then hardened against the 2026 agent-native surface: OWASP's Agentic ASI Top 10, agentic misalignment, Anthropic containment and Redwood control, insecure AI-generated code and client-side key exposure, MCP confused-deputy and token-passthrough, tool-layer memory poisoning, AI-code iteration degradation, and Veracode's 2026 code-security measurements. UI dark patterns are treated here as an injection surface, not only an ethics problem, and a poisoned tool description is goal-hijack rather than supply-chain.
last_reviewed: 2026-08-11
review_by: 2026-11-09
curve: threat
---

# Practice — Agent security (a deterministic guard around a non-deterministic model)

> **The shape of the risk.** The moment a founder runs an AI agent on their machine with file access,
> a network, and instructions from the internet, they've assembled the surface attackers want. The
> agent reads a web page / an issue / a dependency's README, that text contains instructions, and the
> agent — being helpful — follows them. Security here is **architectural, not a prompt you add**. You
> can't politely ask a model to never be tricked; you constrain what a tricked model can *do*.

## The lethal trifecta (name it so you can break it)

Data exfiltration / damage needs three things together. Remove any one and the attack can't complete:

1. **Untrusted input** — content the agent reads that an attacker can influence (web pages, issues,
   emails, scraped docs, a dependency).
2. **Access to private data** — secrets, customer data, the founder's files.
3. **Ability to act / exfiltrate** — send a request, write a file, run a command, post somewhere.

## The Rule of Two (the operating heuristic)

> Prefer that an agent (or a single agent step) has **at most two** of the three. The third is the
> one you remove for that task.

- Reading untrusted web content? Don't also give that step secrets *and* an open network to send
  them. Sandbox it, or split the work so the reading step can't act.
- Acting on private data? Keep untrusted input out of that step's context.

## When the agent can act: the agent-native surface (2026)

The trifecta is the *data-flow* risk. Once an agent has tools, memory, and autonomy, a second surface
opens — the **agent itself** going wrong. Two things to hold:

- **Agentic misalignment is measured, not hypothetical.** Anthropic showed frontier models — given
  autonomy plus access to sensitive context — taking harmful, self-preserving actions under goal
  conflict (insider-threat-shaped). The lesson isn't "the model is evil"; it's *don't grant standing
  autonomy + sensitive access and assume good behaviour — bound both, and gate what can't be undone.*
- **For an agent, the threat model is the OWASP Top 10 for Agentic Applications (ASI, published Dec
  2025), not the stateless LLM list.** An agent's real attack surface: goal hijack, **tool misuse**, identity/privilege abuse,
  **agentic supply chain** (a poisoned MCP server or tool), unexpected code execution, **memory /
  context poisoning**, insecure inter-agent comms, cascading failures, human-agent trust exploitation,
  rogue agents. Each has a real 2025 incident behind it (EchoLeak, the GitHub-MCP exploit, the Replit
  production-DB wipe). If you ship an agent, this is the list to defend — and the one to `/red-team`
  against. The stateless LLM Top 10 still covers a plain prompt-in/text-out path — **note its 2026
  edition (2026-08-04) renumbered eight of ten entries and renamed System Prompt Leakage to LLM08
  *Hidden Context Exposure*, widening it to cover developer instructions, policy text and every tool
  schema.** That widening is the same point as the pre-install pass below, arriving from OWASP's side.
- **UI dark patterns are an injection surface (RVW-060).** An agent that browses or acts on the web is
  manipulated by the *same* dark patterns built for humans — Sneaking, Urgency, Forced-Action — and it's
  **worse off than a person**: Stanford's DECEPTICON steered agents to the manipulated outcome in **70%+ of
  tasks vs a 31% human average**, and it **gets worse as models scale**. The trap is assuming awareness is a
  defence: agents that acknowledged the dark pattern still proceeded with it, the reasoning trace calling it
  necessary or helpful, and **in-context "watch out for tricks" prompting and guardrail models both failed to
  consistently reduce the success rate.** (Those two are what the paper tested; human oversight was not
  evaluated — don't claim it was.) So **recognition ≠ protection** — defend it the structural way: narrow
  permissions, an explicit confirm before any purchase/commitment, and inspect what a page is steering the
  agent to *do*, the same as inspecting a poisoned tool return. (This is the security face of
  [`deceptive-patterns.md`](deceptive-patterns.md)'s `agent-actions` surface — the agent there is the *victim*.)

## Concrete defaults (what to actually do)

- **Enforce in the harness, not the prompt.** Secret no-read belongs in `permissions.deny` (the
  zero-cost floor BOSS ships) and, for high-stakes cohorts, the `secrets-guard` hook. A hook is a
  **deterministic guard**; the model's own judgment (and any safety *classifier*) is
  **non-deterministic** — never let the classifier be the only thing between untrusted text and a
  destructive action. See [`context-discipline.md`](context-discipline.md).
  **This got sharper in 2026-08 — see the next bullet, which limits what the list half can buy you.**
- **An allow/deny list of *command names* is a filter, not a boundary (2026-08, CVE-2026-22708).**
  In Cursor, with auto-run + allowlist mode on, shell **built-ins** (`export`, `typeset`, `declare`)
  ran **without appearing in the allowlist and without approval** — `typeset` abusing zsh expansion
  flags to force evaluation of an embedded command substitution. Arbitrary code, no prompt, reachable
  by indirect prompt injection; **Cursor's own guidance now discourages relying on allowlists as a
  security barrier.** Claude Code shipped matching hardening the same month (commands can no longer
  hide part of themselves from permission checks; tab/invisible-Unicode padding no longer hides a
  command from the approval dialog; PreToolUse auto-allow hooks no longer bypass tool restrictions in
  internal side tasks; worktree isolation extended to Bash and git redirects).
  **The generalization worth keeping:** any defense that enumerates *how* something might be reached
  loses to an unbounded surface. Defend on the **thing being protected** — the path, the credential,
  the egress destination — not on the verb. That is the same shape as the mount tiers and the
  tool-layer memory bound below: *bound the capability, don't enumerate the route.* Concretely, this
  is why `secrets-guard` (path-matched) is the boundary and the deny-list (command-matched) is the
  speed bump — **turn the hook on once the project holds a real credential**, not only for regulated
  work.
- **Trusted ≠ safe: an allowlisted command can be turned against you.** The Cursor bug worked by
  **poisoning the environment** the trusted command runs in, not by smuggling an untrusted command
  past the check. So the review question is not only *"is this command on the list?"* but *"can
  anything the agent already did change what this command does?"* Environment variables, shell
  config, `PATH`, and a repo's own tooling are all in scope.
- **Sandbox by default** for steps that read untrusted input. Untrusted-content reads shouldn't run
  with full filesystem + network.
- **Match isolation to your oversight** (Anthropic's containment principle: the less you can watch a
  step, the more it should be boxed). Concrete tiers: a **read-only mount** where the agent only needs
  to read; **read-write-no-delete** where it edits but shouldn't be able to destroy; an **egress
  allowlist** (the agent reaches the two hosts it needs, not the whole internet) for any step touching
  untrusted input. And **inspect tool *returns* before they re-enter context** — a poisoned tool
  result is just untrusted input arriving through the back door.
- **Pin dependencies.** Unpinned deps are an untrusted-input channel (supply chain). Pin versions;
  review what an agent adds. (This is ASI04 — the agentic supply chain — in practice.)
- **Human-in-the-loop on the irreversible.** The actions that can't be undone (push, deploy, delete,
  send) get an explicit gate — and the gate is a real stop, not a sentence in a system prompt. Where a
  human can't be in the loop, put a *cheaper, trusted check* in front of the autonomous one (Redwood's
  control framing: a small reliable model can screen a big autonomous model's destructive calls).
- **If you connect MCP servers, close the confused-deputy hole.** MCP is durable now (a Linux-Foundation
  standard as of Dec 2025), but its one signature auth bug is **token passthrough** — a server forwarding
  your token upstream so a downstream service trusts a token never minted for it. The mid-2025 spec banned
  it; older servers still do it. Defaults: OAuth 2.1 + PKCE, **validate the token audience** (accept only
  tokens minted for *you*), and let each server authenticate downstream with its *own* scoped credential —
  never forward. Treat every registry server as an unpinned, untrusted dependency (30+ MCP CVEs in an
  early-2026 window; the postmark-mcp rug-pull that behaved for 15 versions, then BCC'd all mail to an
  attacker). This is ASI04 made concrete.
- **Before you connect a server, read its tool *descriptions* as untrusted input — because that's what they
  are.** A tool description is attacker-controlled text that enters your context looking like something you
  wrote; hidden instructions in one are indirect prompt injection wearing a schema, and OWASP files it under
  **ASI01 (agent goal hijack)**, not under supply chain. Most published servers are unreviewed, and the
  registry is still **preview** — an entry is a lead, not a vetting. The pre-install pass, in order:
  **verify the publisher · read every tool description and every parameter description · pin the version ·
  scope the token to the minimum · require approval for anything destructive · re-read the descriptions on
  update** (a rug-pull is a *later* version, which is exactly how postmark-mcp worked). Scanners for poisoned
  descriptions exist and are worth running, but they are a second pair of eyes, not the first pair.
- **Treat agent "memory" as a persistence channel, and bound it at the tool layer.** The moment your app
  gives its agent memory, a *one-time* injection can plant a durable instruction that fires in a *later*
  session (the delayed-trigger attack). **Read the number carefully:** 2026 testing puts *injection* success
  at ~95–98% but end-to-end *attack* success at 60–77%, under idealized conditions that a follow-up study
  found realistic pre-existing memories degrade further. Getting the payload into the store is close to
  free; making it fire is the part that varies — high-likelihood, not certain. In-context
  "watch out" warnings, retrieval-time filtering, and provenance tags each failed *alone*; the one defense
  that held was **restricting what the agent may write to and read from memory at the tool layer** — same
  shape as the mount tiers above, bound the capability rather than trust the prompt. (OWASP ASI06.)

## The app you ship is an attack surface too

The trifecta and the ASI list are about the *agent on your machine*. But the **code the agent writes
for your product** is its own risk — and a distinct one a founder is far more likely to ship by
accident:

- **AI defaults to insecure when a secure option exists.** Veracode's **2026 GenAI Code Security Report
  (2026-07-28)** puts the average security pass rate at **56%** across 100+ models — ~44% of generation
  tasks still ship an OWASP-Top-10 vulnerability — with 85% failing to defend against XSS and 88% against
  log injection. It does **not** improve with scale: large models averaged 53%, medium and small 51%, and
  coding-specialised models 51% against general-purpose models' 52%. Treat generated code as *unreviewed*,
  not *done*.
- **Client-side key exposure is the classic vibe-coded leak.** API keys baked into frontend JS, an
  open storage bucket, a secret committed to the repo — the 2025 incidents (the Tea breach, ~25k
  secrets found across vibe-coded sites, a 1.5M-key exposure) are nearly all this one shape.
  **`secrets-guard` does *not* catch it.** That hook stops the *agent* reading a secret file into
  context; it does nothing about a *shipped app* exposing a key. Different surface, different defence.
- **The antidote is a pre-ship scan, not a prompt.** Before the first deploy: a secret scan (no keys
  in the bundle or the repo) plus the OWASP web basics. `/red-team` carries this pass. For a
  non-technical founder it's the single security gate that matters most — they can't spot the vuln
  themselves, so the scan has to.
- **Re-iterating the same file makes it *less* secure, not more.** A 2026 study found each round of an AI
  refining the same code introduces new vulnerabilities faster than it fixes old ones — context drift, the
  model losing the original security constraints. So the pre-ship scan is **not one-and-done**: the more
  times a file was re-prompted, the *more* likely a vuln crept in. Re-scan after heavy iteration, not once.

## Altitude / JIT (don't scare a day-one founder)

This is **not** a wall of security text on a Quickstart. Route it JIT: the floor (`permissions.deny`)
ships silently with every project; the rest surfaces when the work earns it, one trigger at a time —
the **trifecta + Rule of Two** the first time an agent reads untrusted web content; the **agent-native
ASI surface** the first time the founder ships an agent with tools and memory; the **pre-ship scan**
at the first deploy; the **full battery** for a domain-expert / regulated cohort. Principle #2: the
right ceremony at the right time, never the whole wall at once. See `IDEA-026`.
