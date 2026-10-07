## `--paths` — the pre-ship pass on the code the agent wrote (no LLM required)

Distinct from everything above: the **code the agent wrote for the product** is its own risk, and the
one a founder most often ships by accident. Before the first deploy, run a quick pass — this is the
single most valuable gate for a non-technical founder, who can't spot the vuln themselves.

**Start from the FEATs, not from a checklist.** `/spec` writes a *Paths that must not break* section
into each FEAT record — the money path, the destructive path, the negative path. Those are the
founder's own words about what would hurt, so they are the brief. Read every FEAT at
`shipped`/`done`, collect the paths, and prove each one the same way you prove an attack: **run it,
don't review it.**

### The three paths (rungs 2–4 of `boss craft testing-with-agents`)

- **Rung 4 — the negative path. Run this one first; it is the reason this pass exists.**
  *Can user A reach user B's data?* Create two real accounts (or two tenants), have A ask for B's
  record by its identifier — the API call, the direct URL, the exported file, the shared link — and
  record what came back. **Do it as user A, against the running app.** Reading the policy, the query,
  or the middleware is *not* this test: the failure mode here is a **missing security property**, not
  a broken behaviour, so every screen renders correctly and every click succeeds right up until
  someone else's row appears. If identifiers are sequential integers, that *is* the enumeration
  attack — try `id+1` and say so. Cross-check the schema side with `boss craft data-schema`: RLS
  enabled **and** a policy present, per table (either one alone enforces nothing).
- **Rung 3 — the destructive path.** Anything that deletes, charges, sends, or publishes. Two
  questions, both answered by doing: does it have a test that proves it does the right thing, and is
  there a **human gate** in front of the irreversible version? Try to reach the destructive call
  without passing the gate — a background job, a retry, an admin route, a webhook replay.
- **Rung 2 — the money path.** The flow that, broken, means there's no product. Run it end to end
  against the real thing. **A money path verified against mocks is verifying the mocks** — if the
  only proof it works is a suite where the payment provider is stubbed, that is not a result.

### The rest of the pass

- **No secrets in the shipped bundle or the repo.** API keys in frontend JS, an open storage bucket, a
  committed `.env`. **`secrets-guard` does NOT cover this** — it stops the *agent* reading secrets into
  context; it says nothing about a *shipped app* exposing one. Scan the build output + git history.
- **OWASP web basics** on any AI-generated code (Veracode's 2026 report: ~44% of AI generation tasks
  ship an OWASP-Top-10 vuln — 85% fail to defend XSS, 88% log injection, and it does *not* improve
  with bigger models). Treat generated code as unreviewed, not done. **If your host has a built-in
  security review of pending changes, run it for this half rather than re-deriving the list** — and
  hand it the FEATs' three paths as context, because it knows the generic vulnerabilities and not
  which path would hurt this founder. Its clean result covers the diff: not the git history (the
  secrets scan above), not the running app (the three paths), not what shipped before the diff.
- **Known-vulnerable dependencies** — `npm audit` / `pip-audit` / `cargo audit`, whatever your stack
  ships. LLM04 asks whether deps are *pinned*; this asks whether the pinned one is *already broken*.
  Different question, and the one an agent never volunteers. Record the count and the highest severity.
- **Re-scan after heavy iteration, not once.** Each round of an AI refining the same file introduces
  new vulnerabilities faster than it fixes old ones, so a green scan from twenty prompts ago is not a
  result about the file in front of you. Re-run this pass on any file that has been re-prompted hard.
- A `fail` here is a `/spec` fix before deploy, not a backlog item.

**If a FEAT named no paths at all**, don't invent them — say which FEATs you read and that they
declared none, and run the secrets + OWASP half. A founder with a genuinely single-user tool has an
honest answer to rung 4, and manufacturing one to look thorough is how a security pass becomes
theatre. **Name what you did not test**, every time.
