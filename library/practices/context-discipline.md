---
id: PRACTICE-context-discipline
type: practice
owner: pm
status: active
host: claude-code
provenance: vetted via /vet RVW-005 + RVW-010 (synthesizes RVW-002, RVW-009, RVW-012) — BOSS v0.42.0. AGENTS.md/CLAUDE.md split documented via /vet RVW-075 (2026-08-17), re-verified against code.claude.com/docs/en/memory — the practice had been silent about a scaffold BOSS shipped in v0.58.0, and was steering host-neutral rules into the Claude-only file.
last_reviewed: 2026-08-11
review_by: 2026-11-09
curve: host
---

# Practice — Context discipline

> **What every always-loaded token costs.** On Claude Code, your `CLAUDE.md`, memory, rules, MCP tool
> schemas, and skill descriptions enter the context window at session start — paid on *every* turn.
> Bloat doesn't just cost money on the API; it **dilutes the model's attention** (context distraction:
> bigger context ≠ better answers). Context discipline keeps the always-loaded surface small,
> scopes the rest to load only when relevant, and **enforces** secret/no-read boundaries in the
> harness rather than trusting a prompt.

> **Host-bound.** This practice targets the **Claude Code** host (syntax verified against current
> behavior 2026-06-02). The *principles* (lean always-loaded context; scope-by-relevance; enforce-in-harness)
> are host-neutral; the *mechanisms* (`permissions.deny`, `.claude/rules/`, hooks) are Claude-Code
> specifics. On a different host/model, recalibrate — see the model-recalibration discipline. **Re-verify
> the syntax below when the host changes**; flags and frontmatter formats drift.

## Why (the failure modes it prevents)

- **Context distraction** — past a threshold the model over-weights repeated/irrelevant context and
  neglects its training; creativity and accuracy drop. Lean context is a *quality* lever, not just a
  cost one.
- **Secret leakage** — the model will sometimes read (or even edit) a `.env`/secrets file even when
  told not to. A prompt is not a boundary. Beginners commit keys the model hardcoded.
- **Stale always-on rules** — domain rules that load every session whether or not they're relevant
  are pure overhead (and risk contradicting each other — context clash).

## The four moves

### 1. Keep the always-loaded docs lean
- **`CLAUDE.md`**: only what would *genuinely surprise an experienced dev new to the repo* —
  non-obvious build/test commands, against-default architecture decisions, project constraints. Cut
  anything the model already knows from training (framework syntax, generic preambles) or could learn
  by reading the code for 20 minutes. Rule of thumb: keep it tight (compliance drops past ~200 lines).
  *Confirmed 2026-08-11:* Anthropic's own guidance for the Claude 5 generation lands in the same
  place — *"keep your CLAUDE.md lightweight and briefly describe what your repo is for, but spend
  most of the tokens on gotchas inside of the codebase."* This line needs no change.
- **Session-state docs** (e.g. a `RESUME.md`): keep a **recency window** of the most recent few
  entries; let the full history live in the changelog it already maintains. Don't let an
  append-forever log become the file you read at every session start.
- **Don't hand-tend what the host now remembers for you.** The `#` hotkey era — *prompt the user to
  save that to CLAUDE.md* — is over; Claude saves durable facts to **auto-memory** on its own. The
  cut BOSS already draws in [`library/memory-seed/README.md`](../memory-seed/README.md) is the one
  that matters, and it survives: **durable facts → auto-memory · working state → a path-scoped rule
  (move #2) · what surprises a new dev → `CLAUDE.md`.** What changes is the *default*: reach for
  auto-memory first and let `CLAUDE.md` hold only what auto-memory structurally can't — the
  repo-shaped gotchas that are true regardless of who is working or what they're doing.
- `<!-- HTML comments -->` are stripped before injection (zero-token notes for humans).
- **Which file the words go in is a two-file split — and it's the one BOSS has scaffolded since
  v0.58.0.** *Verified against the primary docs 2026-08-17:* **Claude Code reads `CLAUDE.md`, not
  `AGENTS.md`** — *"If your repository already uses `AGENTS.md` for other coding agents, create a
  `CLAUDE.md` that imports it so both tools read the same instructions without duplicating them."*
  That's exactly the shape BOSS ships: host-neutral working rules and conventions live in `AGENTS.md`
  (read directly by Codex, Cursor, Copilot and the rest); `CLAUDE.md` opens with `@AGENTS.md` and adds
  only the Claude-specific layer. **Keep new rules on the right side of that cut** — a host-neutral
  convention written into `CLAUDE.md` is invisible to every other tool you or a collaborator use.
  (A symlink works when there's no Claude-specific layer, but needs Admin/Developer Mode on Windows —
  prefer the import.) Adopting a repo that already has one: `/init` (with `CLAUDE_CODE_NEW_INIT=1`)
  reads it, and `/import` appends a **one-time copy** — one-time means it can drift, so the live
  import is the better default.
- **The split saves zero tokens.** `@path` imports are organizational only — every imported file,
  `AGENTS.md` included, still loads at startup. So the "keep it tight" budget above applies to
  **`CLAUDE.md` + `AGENTS.md` together**, and `/context` shows you both. One source of truth across
  tools, not context economy.
- `CLAUDE.local.md` (gitignored) holds personal/local notes. Edits to `CLAUDE.md` apply on
  restart/`/compact`, not mid-session. Run `/context` and `/memory` to see what actually loaded.

### 2. Scope rules to where they apply (`.claude/rules/`)
Put domain-specific instructions in `.claude/rules/*.md` with `paths:` frontmatter so they load
**only when the model touches a matching file** — JIT context instead of always-on:
```markdown
---
paths:
  - "{{SRC_GLOB}}"          # e.g. "src/api/**/*.ts"
---
# {{Area}} rules
{{the rules that only matter for files under that path}}
```
Rules **without** `paths:` load at launch (a second always-loaded `CLAUDE.md`) — use that only for
genuinely global rules. This is just-in-time support (Principle 2) applied to the context window.

**Shipped instance (BOSS FEAT-020 Phase 1, v0.45.0):** the L0 and L1 templates now ship a
`.claude/rules/` example so every `boss new` project is JIT-by-construction, not just
deny-by-construction — L0 `your-app-code.md` (the basic path-scoped pattern), L1 `feature-context.md`
(the live feature's working notes, which `/close` will later compress — FEAT-020 Phases 2-3). The
durable-vs-working-state cut that decides what belongs here vs. always-loaded memory lives in
`library/memory-seed/README.md`. Re-verified against the official Claude Code docs 2026-06-05: `paths:`
is the correct key (not Cursor's `globs:`); path-scoped rules load when Claude reads a matching file,
not at session start.

### 3. Enforce no-read boundaries in the harness, not the prompt

> **⚠️ Read this before the JSON: a command list is a filter, not a boundary.**
> **CVE-2026-22708** (Cursor, disclosed 2026-08, fixed in 2.3) is the proof. With auto-run + allowlist
> mode on, shell **built-ins** — `export`, `typeset`, `declare` — executed **without appearing in the
> allowlist and without user approval**; `typeset` abused zsh expansion flags to force evaluation of an
> embedded command substitution. Arbitrary code, zero prompts, reachable by indirect prompt injection.
> **Cursor's own hardening guidance now discourages relying on allowlists as a security barrier.**
> Claude Code shipped matching fixes the same month (a Bash command can no longer hide part of itself
> from permission checks; tab/invisible-Unicode padding no longer hides a command from the approval
> dialog; PreToolUse auto-allow hooks no longer bypass tool restrictions in internal side tasks).
>
> The lesson is **not** "lists are useless." It's that a list of *command names* is an enumeration, and
> **an enumeration of an unbounded surface is a speed bump.** So: ship the list (it's free and it stops
> the common accident), and know exactly what it buys you. When the stakes are real, the boundary is the
> **path-based hook** below — it matches on the *secret*, not on the command that reaches for it.

Secrets and noise get a **hard block** via `permissions.deny` in `.claude/settings.json` — verified
Claude Code glob syntax (`./` = relative to cwd; `**` = any depth):
```json
{
  "permissions": {
    "deny": [
      "Read(./.env)", "Read(./.env.*)", "Read(.env)", "Read(.env.*)",
      "Read(**/.env)", "Read(**/.env.*)",
      "Read(./secrets/**)", "Read(**/secrets/**)",
      "Read(**/*.pem)", "Read(**/*.key)", "Read(**/id_rsa*)",
      "Read(**/.ssh/**)", "Read(**/.aws/**)",
      "Bash(cat ./.env*)", "Bash(cat .env*)", "Bash(cat ./secrets/*)",
      "Bash(head *.env*)", "Bash(tail *.env*)", "Bash(less *.env*)", "Bash(more *.env*)",
      "Bash(grep * .env*)", "Bash(xxd *.env*)", "Bash(od *.env*)", "Bash(strings *.env*)",
      "Bash(base64 *.env*)", "Bash(source *.env*)", "Bash(. *.env*)",
      "Bash(printenv)", "Bash(env)",
      "Read(./node_modules/**)", "Read(./dist/**)", "Read(./build/**)", "Read(*.lock)"
    ]
  }
}
```
- **Write the bare path *and* the `./` form.** `Read(./.env)` and `Read(.env)` are different patterns;
  shipping only one leaves the other open. Same for `**/` (a `.env` in a subdirectory).
- **A `Read(...)` deny does NOT block Bash** (`cat .env` still works) — add the `Bash(...)` rules too.
- **The Bash half is the enumeration you can't finish.** The list above covers the frequent readers.
  It does not cover `awk`, `sed`, `python -c`, `node -e`, a shell built-in, or anything an attacker
  renames. Don't grow this list toward completeness — it has no end. Escalate to the hook instead.
- **BOSS merges this floor on `boss sync`** (v0.141.0), because a security floor that only reaches
  *new* projects is not a floor. The merge is **additive and deny-only** — a deny entry can only ever
  restrict, never grant, so merging it can't break a project. `allow` and `defaultMode` stay yours.
- **There is no `.claudeignore` file** in Claude Code (a common myth). `permissions.deny` is the
  mechanism; `.gitignore` is separate and only stops commits, not reads.
- For coverage that also catches MCP tools and skills added later, a **PreToolUse hook** can reject
  any tool call touching a secret path (exit code `2`, or JSON `permissionDecision: "deny"`). **But
  weigh the cost:** a `PreToolUse` hook fires on *every tool call* (a process spawn per call — real
  latency), where the deny-list is a zero-cost native check. So: the **deny-list is the universal
  floor** (always ship it); a **secrets-guard hook is a high-stakes ceiling** — reserve it for
  regulated/PHI work or make it opt-in, don't impose per-call overhead on every project by default.
  A real secret manager is beyond both. (Cost discipline: don't add always-on machinery for marginal
  coverage — the framework BOSS warns founders against becoming.)
  - **The trigger for turning it on moved (2026-08).** This bullet used to read as "nice-to-have
    breadth." CVE-2026-22708 reframes it: the hook matches on the **path**, so it catches `head`,
    `grep`, `xxd`, `source`, a renamed binary and a shell built-in alike — the exact surface the
    command list structurally cannot reach. It is no longer "broader coverage"; it is **the only
    layer here that is actually a boundary.** The per-call latency argument still stands, so it
    stays opt-in — but the honest recommendation is now: **turn it on as soon as the project holds a
    real credential**, not only for regulated work.
  - **BOSS ships this hook dormant** as `.claude/hooks/secrets-guard.js` (canonical in
    `library/hooks/secrets-guard.js`): Read/Edit of a secrets file → **deny**, Bash/MCP referencing
    one → **ask**, else allow; fail-open. It is **not registered by default** (an unregistered hook
    costs nothing — registration is the on-switch). Turn it on by adding the `PreToolUse` block in the
    file header. **Recommended for the `domain-expert` / regulated cohort.**

### 4. Filter noisy tool output before it enters context
A **PostToolUse hook** can compress a 10k-line build/test log to a short error summary before it
reaches the model — the model reasons over the summary, not the firehose.

## Permission modes — the surface all four moves sit on

> Added 2026-08-11. This practice claimed the permission surface for a year and never named the
> **mode** that surface runs in — while the host quietly made a classifier the default.

**From 2026-08-14, `auto` is the default permission mode** for new Claude Code sessions on Pro, Max
and Team plans. (A default you set yourself, or one your organization manages, is left alone.) In auto
mode a classifier answers the permission prompts: safe actions run uninterrupted, risky ones are
blocked. The classifier calls don't count against usage limits.

What a founder needs to know, in order:

- **BOSS already ships `"defaultMode": "auto"`** in the L0 template — this change makes the host agree
  with a call BOSS made earlier, and nothing in a scaffolded project needs to move.
- **Deny rules still win.** Hard deny is unconditional; it is not something the classifier weighs and
  can decide to allow. The floor in move #3 is exactly as load-bearing under auto mode as under
  prompts — which is why it is worth hardening.
- **But a classifier is non-deterministic, and that is the whole point of move #3.** `agent-security`
  puts it plainly: *never let the classifier be the only thing between untrusted text and a
  destructive action.* Auto mode is a **convenience** layer that removes prompt fatigue. It is not a
  security layer, and reading it as one is the trap — prompt fatigue was never the boundary either,
  it was just a human in the loop often enough to notice.
- **The modes, and when each is right:** `auto` (default — classifier-mediated) · `plan` (read-only
  until you approve a plan; the right mode for "explore this codebase and tell me") ·
  `acceptEdits` (file edits land without asking; Bash still gated) · `default` (prompt on everything —
  the mode to fall back to when you're doing something you don't fully trust yet).
- **Switch any time**, and set your standing preference explicitly rather than inheriting a default
  that can change under you:
  ```json
  { "permissions": { "defaultMode": "auto" } }
  ```

> **Host-bound, and on the fastest curve BOSS tracks.** Permission modes are a Claude Code mechanism
> and they moved three times in 2026 (research preview in March → Pro in May → third-party providers
> in June → default in August). Re-verify on host change; see the build-craft watchlist, domain 2.

## Context engineering — the discipline these four moves serve

The four moves above are the *mechanics* on this host; the discipline they serve got a name in 2026 —
**context engineering** ("the load-bearing skill of the year," Anthropic; see also
[`harness-engineering`](harness-engineering.md), the environment this sits inside). Four findings sharpen the
moves with numbers and named failure modes:

- **The dumb zone — don't fill the window.** More context is not better. Reliability degrades *well before*
  the advertised limit — effective usable context is often ~60–70% of the window, and quality drops **even on
  simple tasks** as input grows ("context rot," Chroma 2026). Past roughly ~300–400K tokens on a 1M-token
  model (far less on smaller ones) you're in the dumb zone. *Token smarter, not harder* (Dex Horthy). This is
  the quality reason under move #1's "keep it lean," now with a number.
- **Intentional compaction over accretion.** When a working session gets long, don't keep appending —
  **compress the useful state into a short markdown artifact and start a fresh session that references it.**
  (That's what `/close` + the recency-window in move #1 already do; name it so it's deliberate.) A handoff
  note beats a 200-turn scrollback the model half-ignores.
- **Trajectory poisoning — restart, don't correct.** Once a session has gone wrong and the model starts
  agreeing with your corrections ("you're right to push back"), the trajectory is poisoned — the bad context
  is now load-bearing and steering it straight rarely works. Restart from the compacted state.
- **Five criteria to judge a context by** (borrow the vocabulary): **relevance · sufficiency · isolation ·
  economy · provenance.** *Provenance* is the one that also does security work — *where did this context come
  from, can I trust it?* is the same question as the tool-layer memory-poisoning defense in
  [`agent-security`](agent-security.md).

## The test
*Would this token survive an experienced dev asking "does the model actually need this, here, every
turn?"* If not, cut it, scope it, or block it. Lean context is faster, cheaper, **and sharper**.

## Sources / how this was vetted
Vetted via `/vet` (the skeptical inbox), not adopted on popularity — see `docs/research/verdicts/`
RVW-005 (deny secrets), RVW-010 (token optimization), with RVW-002 (lean session docs), RVW-009
(context-engineering failure modes), RVW-012 (enforce-in-harness). The `.claudeignore` claim was
**rejected at verification** — it does not exist. Re-verify all Claude Code syntax on host change.
