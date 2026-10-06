---
id: COMP-zeroheight
type: competition
owner: product-lead
status: watch
rival: zeroheight
kind: adjacent — a design-system platform that now sells itself as the agents' context layer
checked: 2026-10-05
sort: watch — no EVID names them (EVID-001…005 checked 2026-10-05). Filed on Ajesh's ask, not a user's.
prior: one name inside the design-system tooling row (design-system-tooling.md, 2026-09-12, pricing only)
---

# zeroheight

> **In their words** (zeroheight.com, checked 2026-10-05): *"Get teams and agents building from your
> design system."* — *"Bring your design system together in one platform and deliver the right
> context to every team, tool, and AI workflow."* — *"Consolidate your design system into a single
> source of truth."* On /mcp/: *"The context layer for every AI tool your teams build with."*

## What it is

A hosted design-system documentation platform: guidelines, tokens, Figma and Storybook embeds, in
one styleguide site. Since 2025 it has turned toward agents. It now sells the styleguide as governed
context that coding agents read over MCP. Its argument against the neighbours is explicit
(/mcp/, checked 2026-10-05): *"Figma's MCP surfaces design properties. Storybook's surfaces code.
Neither surfaces your guidelines, usage rules, or validated decisions. zeroheight aggregates all of
it – one source of truth, reviewed by your team, used by every agent."*

**The twist, against BOSS's bet.** zeroheight is a type (C) rival in `design-system-tooling.md`: the
tool is the source of truth and code is a destination. BOSS's doctrine is the opposite: the code is
the source of truth and the library is derived from it. They overlap on one job, keeping an AI
builder on the design system. They answer it from opposite ends. zeroheight's answer is a team that
reviews docs, which an agent then obeys. BOSS's answer is a founder whose values stay blank until
earned, plus checks in the repo. **The buyer differs too:** zeroheight sells per editor to a design-system *team*
(the report's audience is teams of practitioners). BOSS's founder is one person with no
design-system team. The differentiators don't collide, so this is no switch test. It is a source to
study.

## Pricing — opened 2026-10-05, zeroheight.com/pricing

| Tier | Price | What gates it |
|---|---|---|
| Free | $0, "single contributors" | 1 editor, 1 styleguide, 1 token set · design/dev tool connections · AI assistant (editors) · "MCP server (with Standard Search, 500 calls/month)" |
| Starter | **$49 per editor/month** (yearly saves 15%; 14-day trial) | up to 5 editors · 2 styleguides · 3 token sets · custom domain, commenting, hidden pages · MCP, Standard Search, 500 calls/month |
| Enterprise | **not public** ("contact sales for custom pricing"; 14-day trial) | 5+ editors and reviewers · 5+ styleguides · 10 token sets · SSO · styleguide releases · AI assistant for viewers too · adoption tracking · API · "MCP server with Fast Search", no call cap stated · draft pages and review · AI Analytics |

**Changed since 2026-09-12:** Starter now includes the 500 MCP calls a month (changelog 2026-09-17:
*"Free and Starter plans now include 500 MCP calls a month"*). The Standard/Fast search split and
Starter's 2-styleguide / 3-token-set limits were not recorded in the earlier read, so whether they
changed is **unknown**.

## Why they might win

- **They got to "the design system is agent context" first, with a product and a price.** A remote
  MCP server, plugins for Claude Code, Cursor, Codex and Zed (`github.com/zeroheight/ai-plugins`,
  MIT, last commit 2026-10-05), and a client list that includes v0, Lovable, Replit and Figma Make.
  A founder's tools will already be on it.
- **`lint-code` ships the check BOSS keeps as dormant hooks.** It is an MCP tool that lints
  CSS/TS/JSX against the token set for hardcoded values, and the server tells the agent it *"MUST
  fix them"* (@zeroheight/mcp-server v2.10.2 source).
- **Governance an agent respects.** Drafts and hidden pages are invisible to MCP until merged
  (changelog 2026-07-30). The agent reads only what a human approved.
- **They measure AI consumption** (AI Analytics, 2026-07-21, Enterprise): queries per channel,
  including MCP. *"If AI consumption isn't counted, that measurement is incomplete."*
- **Weekly-to-fortnightly releases** July–October 2026. They are investing, not coasting.

## Where they're weak

- **Two sources of truth.** Tokens flow Figma → zeroheight → a PR into code, and guidance lives in
  zeroheight. Their own Markdown export is *"a snapshot rather than a live feed"*. That is the drift
  shape BOSS's doctrine refuses, and they sell the sync as the fix.
- **No why, no rung, no venture.** A styleguide records what was decided, not when a value was
  earned or why. Nothing asks whether the product needs a design system yet.
- **Priced for a team.** $49 per editor, Enterprise-gated review, analytics and Markdown export.
  A solo founder gets 1 styleguide and 500 calls a month.
- **One AI vendor**, with the model swapped by changelog (2026-09-25).
- **The local MCP sends telemetry by default** (Sentry, opt-out env var), per the package README.

## Where it breaks

**No 1–2★ review text was verified.** G2 returned 403. Capterra holds 3 reviews, all 5★ and all
from 2022. The only breakage signal is their own fix log, which reads as long-running Figma
friction: plugin sync *"interrupted"*, and large variable imports that *"no longer time out"*
(changelog 2026-10-02). Cons inside the 2022 Capterra reviews: *"design file uploads can be slow to
update"* (2022-06-14); not enough control over spacing, padding and colour (2022-07-12). Both are
paraphrased by the fetch tool and old.

## How they do it — the three features that touch BOSS's bet

**1. Design system → agent (MCP).** The local package exposes read tools: `list-styleguides`,
`list-pages`, `search-pages`, `get-page`, `get-page-images`, `get-page-asset`, `list-releases`,
`list-token-sets`, `get-tokens` (*"W3C design tokens"*), and the linter. *Default:* the server's
instructions tell the agent to call it *"FIRST whenever the user asks to build, generate, modify,
or review UI"* and to treat it *"as the source of truth"*. That is an instruction to the agent, not
a hook. *Asks for:* OAuth or a client ID plus token. *Limits:* 500 calls a month below Enterprise,
with email warnings at 250, 333 and 500 and a limit message from the tools after that. **Possible
write path, unverified:** the 2026-10-02 changelog says drafts *"made elsewhere, such as through
MCP"* appear in the editor. The help centre that would name the write tools returned 403.

**2. Tokens and sync.** A tokens manager. *"Token pipelines sync Figma variables from across
multiple files, update documentation automatically, and create pull requests with exact token
changes"* (/delivery/). Import and export via GitHub, GitLab, Azure DevOps and Bitbucket. DTCG
format is confirmed only by the MCP tool's description; Style Dictionary export is **unverified**
(the help centre returned 403). *What users expect:* *"great connectors to design software as Figma
and Sketch"* (Capterra, 2022).

**3. Docs that agents can read.** The `/audit-docs` skill in `zeroheight/ai-plugins` grades a
styleguide's machine-readability against the *Design System Documentation Spec*
(designsystemdocspec.org). The pairing to note is AI Analytics, which counts what agents actually
read. BOSS writes a component index for the agent (`design-tokens-init`) and guards reuse with hooks.
Whether anything counts the agent's *reads* of it was not checked for this filing.

## Context they publish

The *Design Systems Report 2026* (report.zeroheight.com, n=147, from a fetch summary and not checked
against the raw page): *"Only 12% of teams use AI for documentation delivery, but 57% wish they
were"*; *"only 40% of teams have any kind of token pipelines"*; *"3 in 5 design system teams are
understaffed."* Vendor research about its own market. Read it as their framing, not as evidence.

## What I did not find

- The help centre (every article returned 403): the remote MCP tool list, any write tools, DTCG and
  Style Dictionary details.
- G2's rating and any 1–2★ text (403). A search snippet says 4.3 from 20 reviews, **unverified**.
- The Enterprise price, the Enterprise MCP cap, and what "Fast" versus "Standard" search means.
- The product itself was not clicked through. Free tier exists, not signed up.

## Change log

- **2026-10-05** — filed as its own row on Ajesh's ask (previously one name in the design-system
  tooling row, pricing only). Sources opened: zeroheight.com (/, /pricing, /mcp/, /mcp/use-cases/,
  /ai/, /delivery/, /documentation/, /integrations/, /management/, /whats-new/ and nine posts),
  registry.npmjs.org/@zeroheight/mcp-server + the v2.10.2 tarball, github.com/zeroheight/ai-plugins,
  capterra.com/p/252716/zeroheight/, report.zeroheight.com. Client-rendered pages were read from raw
  HTML or `__NEXT_DATA__`.
