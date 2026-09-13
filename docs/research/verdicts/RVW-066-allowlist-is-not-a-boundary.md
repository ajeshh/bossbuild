---
id: RVW-066
type: verdict
owner: mentor-architect
status: recorded
created: 2026-08-11
verdict: ADOPT
route: UP library/practices/agent-security.md + context-discipline.md · DOWN stages/L0/settings.json + src/sync.js — shipped v0.141.0
retroactive: true
---

# RVW-066 — "An allow/deny list of command names is a security boundary"

> **Recorded retroactively.** This was adopted and shipped in v0.141.0 *before* the verdict was
> written, because the sweep found BOSS's own shipped template carried the vulnerable pattern and
> the fix was a security fix. The rubric is applied honestly here after the fact; where it would
> have changed the decision, that is stated. It would not have — but the process note stands:
> **a security finding is the one case where shipping ahead of the paper trail is defensible, and
> it should stay the exception.** See [SESSION-2026-08-11](../sessions/SESSION-2026-08-11-host-and-agent-craft-sweep.md).

## The claim

- **Source:** **CVE-2026-22708** — [Pillar Security](https://www.pillar.security/blog/the-agent-security-paradox-when-trusted-commands-in-cursor-become-attack-vectors) /
  [danusminimus](https://danusminimus.github.io/posts/The-Agent-Security-Paradox-When-Trusted-Commands-In-Cursor-Become-Attack-Vectors/); vendor fix in Cursor 2.3.
  Corroborated by Claude Code's Week-32 hardening notes (primary source).
- **Core assertion (the claim being REFUTED):** that a `permissions.allow` / `permissions.deny`
  list of command names is a boundary an agent cannot cross.
- **What actually happened:** with auto-run + allowlist mode on, shell **built-ins** (`export`,
  `typeset`, `declare`) executed **without appearing in the allowlist and without user approval**.
  `typeset` abused zsh expansion flags to force evaluation of an embedded command substitution —
  arbitrary code, zero prompts, reachable by **indirect prompt injection**. The attack **poisoned
  the environment a trusted command runs in** rather than smuggling an untrusted command past the check.

## Rubric

| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | **No — it enforces one.** "Enforce in the harness, not the prompt" survives; what dies is the belief that *this particular* harness mechanism is sufficient. |
| 2 | Evidence grade | **Highest available.** A CVE with a vendor fix, a working exploit chain, the vendor's own guidance reversing, and **independent corroboration** — Claude Code shipped four matching hardening fixes the same month. This is incident-grade, not commentary. |
| 3 | Duplicate or sharpen? | **Sharpens, and partially REVERSES.** `agent-security` already said classifiers are non-deterministic; it did **not** say a deterministic *list* is also not a boundary. `context-discipline` called the deny-list "the universal floor" — true, but it framed the list as the boundary. |
| 4 | Who serves / harms? | Serves **every cohort** — the deny floor ships silently with every project. Most protective for `non-tech-founder` / `first-product` / `domain-expert`, who cannot audit their own permission config. Harms no one: a deny entry only ever restricts. |
| 5 | Cost / ceremony | **Near-zero and invisible.** 24 more deny entries in a file the founder never opens. The one real cost is the `secrets-guard` recommendation moving earlier — and that stays **opt-in**, so it is a recommendation, not imposed machinery. |

## Verdict: ADOPT

The claim BOSS held is refuted by incident-grade evidence with independent corroboration, and BOSS's
own shipped artifact carried the vulnerable shape. Three things adopted:

1. **The correction, stated plainly in the practice** — a list of *command names* is an enumeration,
   and an enumeration of an unbounded surface is a **speed bump**. Ship it; know what it buys.
2. **The generalization worth more than the CVE** — *defend on the thing being protected (the path,
   the credential, the egress destination), not on the verb.* This is the same shape as the mount
   tiers and the tool-layer memory bound already in `agent-security`: **bound the capability, don't
   enumerate the route.** The CVE is one instance of a rule BOSS already half-held.
3. **`secrets-guard`'s trigger moves earlier** — from *"regulated / PHI work"* to **"as soon as the
   project holds a real credential."** It matches on the path, so it is the only layer here that is
   actually a boundary. It stays opt-in: the per-call latency argument is unchanged.

## What shipped (v0.141.0)

- `library/practices/agent-security.md` — two new bullets (the CVE + *trusted ≠ safe*), and the
  enforce-in-harness bullet now points forward to its own limit.
- `library/practices/context-discipline.md` — move #3 opens with the refutation **before** the JSON,
  so no one copies the block without reading what it doesn't do.
- `stages/L0-quickstart/template/.claude/settings.json` — **5 deny entries → 29**; bare-path and
  `**/` forms added alongside `./`; readers beyond `cat` covered.
- `src/sync.js` — **the deny floor now merges on `boss sync`**, additive and deny-only. This is the
  half that mattered most: before it, the fix could only reach projects created *after* today.

## The honest limit (recorded so it isn't lost)

The Bash half **cannot be completed**. It does not cover `awk`, `sed`, `python -c`, `node -e`, a
renamed binary, or a shell built-in. The practice now says so in as many words and tells the reader
not to grow the list toward completeness. **A defense whose own documentation overstates it is worse
than a weaker defense honestly described.**
