---
id: PRACTICE-context-discipline
type: practice
owner: product-lead
status: active
host: claude-code
provenance: vetted via /vet RVW-005 + RVW-010 (synthesizes RVW-002, RVW-009, RVW-012) — BOSS v0.42.0. AGENTS.md/CLAUDE.md split documented via /vet RVW-075 (2026-08-17), re-verified against code.claude.com/docs/en/memory — the practice had been silent about a scaffold BOSS shipped in v0.58.0, and was steering host-neutral rules into the Claude-only file. Session-lifecycle hooks (SessionStart/SessionEnd/PreCompact/PostCompact) added 2026-09-08, read out of the Claude Code 2.1.132 binary rather than the docs — the practice had been silent about the entire session lifecycle while being the doc BOSS points founders at for context discipline. Permission surface re-verified 2026-08-22 (BOSS v0.218.0, IDEA-071) against code.claude.com/docs/en/permission-modes, /permissions and /sandbox: the `defaultMode: auto` guidance added 2026-08-11 was WRONG for the file it recommended (v2.1.142+), and the practice had never named the sandbox — the host's largest prompt-reduction mechanism. Host-doc claims are now version-pinned, not date-pinned. · **one citation added 2026-09-12 (v0.315.0, RVW-101), clock NOT moved** — Cai et al. 2606.12231 corroborates move #1's architecture-over-formatting line from mined rule files; preprint, before/after only.
provenance_public: Vetted against BOSS's principles rather than adopted on popularity. The AGENTS.md / CLAUDE.md split is re-verified against the host's own memory documentation each time this is swept — that ground moves with the host, not with us, and the practice had once gone silent about a scaffold BOSS itself shipped.
last_reviewed: 2026-09-08
review_by: 2026-12-07
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
  *Corroborated 2026-09-12 (RVW-101):* the first mining study of rule files says the same thing from
  the other side — across 83 projects and 7,310 rules, practitioners rank **architectural constraints**
  highest while the rule files themselves are mostly *"low-level workflow and code formatting
  constraints"*, and 77.78% report editing rules mainly to correct an AI error, typically by adding a
  negative constraint (Cai, Li, Liang, Li, Shahin, arXiv 2606.12231 — preprint; its compliance lift is
  before/after with no control, so it is cited for the *shape*, not the number). Two consequences and
  no new rule: write the architecture line **before** an error forces it, and notice that a rule file
  grown one correction at a time is a deny-list nobody designed — prune it against the ~200-line
  rule of thumb above.
- **Session-state docs** (e.g. a `RESUME.md`): keep a **recency window** of the most recent few
  entries; let the full history live in the changelog it already maintains. Don't let an
  append-forever log become the file you read at every session start.

  **Decide the compaction rule while the file is still small — this is the move that gets skipped.**
  *Compaction* is one of the four patterns Anthropic names for long-running agents: preserve the
  decisions and the unresolved problems, discard the redundant detail. It applies to a file exactly
  as it applies to a context window, and the failure mode when it's unstated is specific and ugly:
  the doc grows until someone splits it **under pressure**, and entries get dropped in the split
  because nobody agreed beforehand what was safe to drop. Write the rule into the file itself:

  1. **The window** — how much stays (the last N releases, the last M sessions). A number, not "recent."
  2. **Where the rest goes** — a named archive file, so rolling something out is a move, not a delete.
  3. **What stays canonical** — the one file that holds the *complete* history (usually the changelog).
     The state doc is a **briefing**; it is allowed to be lossy precisely because that other file isn't.

  BOSS learned this on itself: `docs/RESUME.md` was hand-split twice, the second time when a gate
  flagged 592 lines, and several releases' state sections were **never written at all** — the split
  happened faster than the record could keep up. A stated rule would have cost one paragraph.
- **Don't hand-tend what the host now remembers for you.** The `#` hotkey era — *prompt the user to
  save that to CLAUDE.md* — is over; Claude saves durable facts to **auto-memory** on its own. The
  cut that matters survives: **durable facts → auto-memory · working state → a path-scoped rule
  (move #2) · what surprises a new dev → `CLAUDE.md`.** What changes is the *default*: reach for
  auto-memory first and let `CLAUDE.md` hold only what auto-memory structurally can't — the
  repo-shaped gotchas that are true regardless of who is working or what they're doing.

  **A build has two memories, and keeping them apart is what keeps context lean.** This is the cut
  the rest of this practice leans on:

  | | **Durable facts** | **Working state** |
  |---|---|---|
  | Changes | rarely, across sessions | fast, within one build |
  | Examples | who the founder is, settled decisions, project constraints, the stack once chosen | the live feature's local decisions, gotchas, scratch context |
  | Home | Claude's **auto-memory** — machine-local, scoped to a person | `.claude/rules/*.md` with `paths:`, loading **only** when the model opens a matching file |
  | Lifecycle | persists; compounds | created → cleared at `/close` → the best bits promoted |

  **The test for which one you're holding:** *would this still be true, and still worth loading,
  three sessions from now?* If it is only true while one feature is in flight, it is working state —
  it belongs in a path-scoped rule, not in memory.

  ⚠️ **Auto-memory is machine-local and person-scoped, and that is deliberate, not a gap.** It does
  not travel to a cofounder or a new laptop, so **anything the project depends on belongs in
  `docs/`** — a durable fact about *you* is not the same thing as a fact the project needs. BOSS
  does not seed, manage or ship anyone's memory store; it says where the store is and leaves it to
  its owner.
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
durable-vs-working-state cut that decides what belongs here rather than in always-loaded memory is
the table in move #1 above. Re-verified against the official Claude Code docs 2026-06-05: `paths:`
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
  - **BOSS ships this hook dormant** as `.claude/hooks/secrets-guard.js` — one copy, in the
    Quickstart template, which is the only place it ships from: Read/Edit of a secrets file → **deny**, Bash/MCP referencing
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

- 🔴 **`auto` only works from *your* settings file, not the project's — and this practice got it
  wrong for eleven days.** From **Claude Code v2.1.142**, an `"auto"` value in a project's
  `.claude/settings.json` or `.claude/settings.local.json` **does not take effect** — *and* its
  presence makes the host fall back to its built-in default **instead of reading the `defaultMode`
  you set in `~/.claude/settings.json`**. So a project file that sets `auto` doesn't give you auto
  mode; it quietly drops whatever standing preference you chose for yourself. Every other value
  (`plan`, `acceptEdits`, `default`) does apply from a project file. **BOSS shipped that exact line
  in the L0 template until v0.218.0 and has now removed it** — the host's own precedence (your
  `~/.claude/settings.json`, then the built-in default) is the behavior you want, and a scaffolded
  project should not be silently outranking you. Set your standing preference in
  **`~/.claude/settings.json`**, and nowhere else.
- **The VS Code extension doesn't read project settings for the starting mode at all** — it keeps
  its own list. Anything a project file says about `defaultMode` is invisible there, which is a
  second, independent reason not to put it in one.
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
- **Switch any time** (`Shift+Tab` cycles), and set your standing preference explicitly rather than
  inheriting a default that can change under you. **In `~/.claude/settings.json` — see the first
  bullet; this does nothing in a project file:**
  ```json
  { "permissions": { "defaultMode": "auto" } }
  ```
- **`allow` rules wait for trust; `deny` rules don't.** A project's `permissions.allow` entries (and
  `additionalDirectories`) only apply after you accept the workspace-trust dialog for that folder,
  because they *grant*. `deny` and `ask` apply immediately, because they only restrict. This is the
  same asymmetry that decides what `boss sync` will merge into your file (the deny floor, and
  nothing else) — and it is why BOSS ships you a floor rather than an allow list.
- **A bare tool name in `allow` means *every* use of that tool.** `"Bash"` allows every shell
  command; `"Bash(npm run test:*)"` allows one. Reads inside your working directory are already
  free, and so is a built-in set of read-only shell commands (`ls`, `cat`, `head`, `tail`, `grep`,
  `find`, `wc`, `which`, `diff`, `stat`, `du`, `cd`, and read-only forms of `git`) that no rule
  configures. So a blanket `allow` list mostly buys you the two grants worth reading — and hands you
  them in a trust dialog before you've run anything. **Add a scoped rule when a specific prompt has
  actually annoyed you twice; don't pre-grant the tool.** `/permissions` writes them for you.

### The sandbox — the one that actually removes the prompts

Permission modes decide *whether the agent asks*. The **Bash sandbox** decides *what a command can
reach once it runs* — and because the boundary is enforced by the operating system rather than by a
prompt, commands inside it can be approved automatically. Anthropic's own measurement, on their
internal usage: **sandboxing "safely reduces permission prompts by 84%."** It is the largest
prompt-reduction move on this host, and the only one that is *more* enforced rather than less.

Run **`/sandbox`** to turn it on and see what's missing on your machine. It's built in — Seatbelt on
macOS, bubblewrap on Linux/WSL2, no native Windows (run it inside WSL2). Two independent layers:

- **Filesystem** — by default a sandboxed command may write only to your working directory and the
  session temp dir; it may still *read* widely, so name your credential files.
- **Network** — **no domains are pre-allowed.** The first connection to a new host prompts (or, in
  auto mode, goes to the classifier); `allowedDomains` pre-approves the ones your build needs.

Both, or neither. Anthropic is explicit about why: *"effective sandboxing requires both filesystem
and network isolation. Without network isolation, a compromised agent could exfiltrate sensitive
files like SSH keys; without filesystem isolation, a compromised agent could easily escape the
sandbox and gain network access."*

```json
{
  "sandbox": {
    "enabled": true,
    "filesystem": { "allowWrite": ["~/.npm", "/tmp/build"] },
    "network": { "allowedDomains": ["github.com", "*.npmjs.org"] },
    "credentials": {
      "files": [{ "path": "~/.aws/credentials", "mode": "deny" }, { "path": "~/.ssh", "mode": "deny" }],
      "envVars": [{ "name": "GITHUB_TOKEN", "mode": "deny" }]
    }
  }
}
```

> **BOSS does not ship this block, on purpose.** `allowWrite` and `allowedDomains` are *stack-specific*
> — a Node project needs `~/.npm`, a Python one doesn't, and a default that breaks `npm install` on
> day one costs a founder more than the prompts it saved. This practice is where the move lives until
> a project has a stack to write it against; add it when you have one, at `/spec` time or when the
> prompts start to bite. **The deny floor BOSS does ship works in every mode and needs no stack.**
>
> And keep move #3's line in view: the sandbox is a *boundary*, auto mode is a *convenience*. The
> sandbox is the one of the two that `agent-security`'s "deterministic guardrails around a
> nondeterministic core" is actually describing. Even inside it, explicit `deny` rules still win, and
> `rm` against a critical path still goes through the normal flow.

> **Host-bound, and on the fastest curve BOSS tracks.** Permission modes are a Claude Code mechanism
> and they moved four times in 2026 (research preview in March → Pro in May → third-party providers
> in June → default in August), and the *file a value is legal in* moved with them (v2.1.142). **Pin a
> version, not a date, when you record a host fact here** — a date says when someone looked, a version
> says what the claim is true of. Re-verify on host change; see the build-craft watchlist, domain 2.

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
- **The session lifecycle is a MECHANISM, not just a discipline — and this practice was silent about
  it until 2026-09-08.** Claude Code fires `SessionStart` (with `source: startup|resume|clear|compact`),
  `SessionEnd`, `PreCompact` (`trigger: manual|auto`) and `PostCompact` (carrying the summary it
  produced). Everything above is advice a founder has to remember; these are the points at which a
  tool can act. **Verify against the host you are on** — this list is read out of Claude Code 2.1.132.
  - **BOSS uses exactly one of them, and the restraint is the interesting part.** `SessionStart` runs
    the re-entry read (v0.244.0). `SessionEnd` is deliberately unused: a hook cannot run `/close`, so
    all that is left is a nag arriving as someone leaves. `PreCompact` is a real opportunity —
    auto-compaction is when working state evaporates, and it is the one moment "write down what you'd
    lose" is both possible and cheap — but **a hook that auto-writes on a schedule the founder does
    not control is the accretion this section warns against**, so it stays unbuilt until someone has
    actually lost work to it.
  - **The founder-facing half is vocabulary.** `/resume`, `--continue`, `/clear`, `/compact`,
    `/context`, `/memory`. A founder who does not know `/compact` exists cannot practise "intentional
    compaction over accretion", however well this section argues for it.
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
Vetted against BOSS's principles before adoption, not adopted on popularity
RVW-005 (deny secrets), RVW-010 (token optimization), with RVW-002 (lean session docs), RVW-009
(context-engineering failure modes), RVW-012 (enforce-in-harness). The `.claudeignore` claim was
**rejected at verification** — it does not exist. Re-verify all Claude Code syntax on host change.
