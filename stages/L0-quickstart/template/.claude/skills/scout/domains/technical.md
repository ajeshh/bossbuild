---
domain: technical
for: what an API, a library or a service actually does — and whether to build it, buy it, or not do it yet
kinds: api <name> · choose <need> · feasible <thing> · advisories
open_first: the official reference docs and changelog, the source or its issue tracker, the status and pricing pages — then a probe you run yourself
verify_by: run it — a small call, a test, a spike; the docs are a claim about the code, and the code is the answer
lands: docs/research/technical/<topic>.md (commits — your agents need it); a choice that's hard to reverse becomes a /decide record
ages: days to weeks — versions, limits and prices move fastest here
sensitive_when: a key, a token or an account detail appears in what you found — never written down, anywhere
---

# `/scout technical` — what it actually does

**The docs are a claim; running it is the evidence.** Rate limits, pagination, error shapes, auth
quirks and what a free tier really allows are where documentation and behaviour part company — and
they are what breaks a build in week three. Note the version and the date on everything.

- **`api <name>`** — the reference docs, the changelog (what changed recently, what's deprecated),
  limits and pricing, auth. Then the smallest real call that proves the part you depend on. Use the
  AI tool's documentation lookup if it has one; they're often fresher than search.
- **`choose <need>`** — build or buy, and which. For each candidate: what it costs at your size *and*
  at ten times it, how you'd leave (export, lock-in), when it last shipped, how many open issues look
  like yours. **"Build it yourself" and "don't do this yet" are always rows.**
- **`feasible <thing>`** — has anyone done it; what broke for them; the smallest spike that would
  settle it. Prior art first, a spike second, a week of building last.
- **`advisories`** — known vulnerabilities and deprecations in what you depend on, from the
  maintainers' own advisories. Names the version you're on, not the latest.
- **Hand-offs:** a choice that's hard to undo → `/decide`; what you learned about an API → the spec
  that uses it cites the file.
