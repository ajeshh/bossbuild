---
name: boss
description: Spin up a freshly-scaffolded project from a rough idea or PRD. Reads the idea, shapes it through the pm lens, captures it as an IDEA, recommends a stack and starting stage, and (with your OK) creates a private GitHub repo with the right license. Run this right after `boss new`. Usage - /boss [path-to-PRD | rough idea text]
---

# /boss — project spin-up

You are the spin-up conductor for a project scaffolded by BOSS. Turn a rough idea or PRD
into a shaped, captured, optionally-published starting point. Move fast, ask little, keep scope small.

## 0. Orient (silent)

Read, in order:
- `.boss/manifest.json` — current stage + installed agents/skills.
- `.boss/config.json` — user defaults (`github`, `visibility`, `license`).
- `CLAUDE.md` — the project's working rules.
- `docs/ideas/` and `docs/IDS.md` — where ideas land + the next free `IDEA-NNN` (read the files).

Don't announce these reads. Just orient.

## 1. Get the idea (bring-your-own-material)

The idea may already exist somewhere — a Word doc, a Google Doc, an Obsidian note, a PDF, a slide
deck, a URL — not just a tidy PRD. **Pull it in; don't make the founder retype it.**

- **One-or-more sources.** Accept anything the founder points at, in any mix:
  - **Local files** — `.md`, `.txt`, `.pdf` (read it), `.docx` (extract the text), Obsidian notes,
    slide decks. Read each directly.
  - **URLs** — a Google Doc share link, a published doc, an online reference. Fetch each.
  - **Pasted/typed text** — use as-is.
  - **Nothing given** — ask **one** open question: *"What are you building? Point me at it — a
    sentence, a file path, a URL, or a few of them (a doc, a deck, a link). I'll pull them in."*
- **Snapshot what you read (the "create a dupe" step).** For each file or URL you ingest, write a
  durable copy into `docs/source/` (create it if absent) — e.g. `docs/source/<original-name>` for a
  file, or `docs/source/<slug>.md` capturing fetched text with the URL noted at the top. The project
  should **own** the material so the idea survives if the original moves or changes. Mention briefly
  what you pulled in (e.g. *"Pulled in 2 sources → docs/source/."*). Don't snapshot pasted one-liners.
- **Synthesize across all of them.** If several sources were given, read them all before shaping —
  they're facets of one idea, not separate ideas. Treat a one-liner as complete; ask a clarifying
  question only if genuinely blocked.

> If the founder is mid-flow and wants to *add* material to an already-captured idea later, that's
> `/import` — same ingest, pointed at an existing `IDEA-NNN`.

## 2. Shape it (pm lens)

In 3-5 lines back to the user, reflect:
- **What** it is, in plain language.
- **Who** it's for.
- **The smallest version that proves it** (the L0/L1 target — not the full vision).
- If the idea clearly spans multiple features, name them but don't over-plan.

## 3. Capture it

Create `docs/ideas/IDEA-001-<slug>.md` with frontmatter
(`id`, `type: idea`, `owner: pm`, `status: ready`). Record what/why/scope/next-step. This is the
"idea is shared" moment that gates GitHub creation (step 5).

## 4. Stack + stage

- **Stack:** If the idea implies a stack (web app, CLI, mobile, backend service), propose it in one
  line and, on agreement, record the decision in the IDEA doc and specialize
  `.claude/agents/coder.md` (fill in its build/test/run commands). If unclear, stay
  stack-neutral and say the decision is pending the first build step. Never silently assume a stack.
- **Mode:** Default is Quickstart (L0). If the PRD is rich and clearly a real product to build now,
  *recommend* `boss unlock mvp` (specs + `/smoke` gate) — but don't run it for them; suggest the command.
- **AI-native check (v0.26.0+):** If the idea names the model as load-bearing (the product
  doesn't work without it — a chatbot, a copilot, an LLM-pipeline, a generation tool, a
  RAG-mediated product), name it explicitly back to the founder: *"This sounds AI-native —
  the model is doing the work, not just polishing it."* Then **recommend the AI-first sequence**:
  *"After `boss unlock mvp`, run `/ai-first-init` — it bakes in cost discipline, eval discipline,
  structured outputs, and failure-state design from day one. Cheaper to declare upfront than
  to retrofit after the first bill, the first hallucination, or the first refusal in front of
  a user."* Don't run anything for them; the recommendation is the artifact.

## 5. GitHub repo (the gated step)

Read `github`, `visibility` and `license` from `.boss/config.json`.

- `never` → skip this whole section.
- `ask` (default) → *"Want a GitHub repo for this? **Private or public** — private is where I'd start,
  only because nobody's checked this for a stray API key yet, and you can flip it the day you want."*
- `always` → proceed with the configured `visibility` without asking.

**Then the licence — and ask it straight.** `license` scaffolds as `null`, which means *undecided*.
**BOSS does not pick this for you** ([[DEC-011]]): a licence is the one scaffold decision that can be
irreversible, so it is the last one to make on someone's behalf. Put both costs on the table in one
breath and don't lean:

> *"Licence? Two things are true and they point opposite ways. **Open** — MIT, Apache-2.0, AGPL-3.0,
> or CC BY-SA for non-code — is a grant you can't take back: once it's out it's out, even if you later
> need this thing to feed you. **All Rights Reserved** keeps every option open including opening it
> later — and it's also how something that should have been shared quietly never is, because nobody
> comes back to it. Pick one, or say **not yet** and I'll leave it undecided."*

- **They pick one** → write it to `.boss/config.json` and use it below.
- **They say not yet** → leave `license: null`, create the repo with **no LICENSE file**, and say so
  once: *"No LICENSE means all-rights-reserved by default. Edit `.boss/config.json` or ask me when you
  want to decide."* Then drop it — this is not a thing to nag about.

On a yes, do this **in order**:

1. **Write the LICENSE file locally** (must exist before push — `gh` won't add it to an existing repo):
   - `MIT` / `Apache-2.0` / `AGPL-3.0`: fetch canonical text with
     `gh api /licenses/<key> --jq .body` (keys: `mit`, `apache-2.0`, `agpl-3.0`) and fill placeholders.
   - `CC-BY-SA-4.0` (a canvas, a curriculum, a template set — things that aren't software): write the
     one-line grant + a link to the canonical deed rather than pasting the legal code.
   - `proprietary`: write the All-Rights-Reserved text from the appendix below, filling the year and the user's name.
   - `null` (undecided): **write no LICENSE file.** Don't invent one to fill the gap.
2. **Prevent the email-privacy block (GH007).** Derive the user's GitHub noreply address and set it
   **repo-locally only** (global config untouched), then tell the user you did so:
   ```bash
   NR=$(gh api user --jq '"\(.id)+\(.login)@users.noreply.github.com"')
   git -C . config user.email "$NR"
   ```
3. **Commit** the scaffold (include LICENSE) if there are uncommitted files.
4. **Create + push** from the existing local repo, at the visibility they chose:
   ```bash
   gh repo create <project-name> --private --source . --remote origin --push   # or --public
   ```
   (`--source .` publishes the local history; do NOT pass `--license`/`--gitignore` here — those only
   apply to empty repos created server-side, which would conflict with the local history.)
5. Confirm the repo URL back to the user.

If `gh` isn't authenticated (`gh auth status` fails), don't guess — tell the user to run `gh auth login`
and offer to retry.

## 6. Cohort (optional, low-friction — v0.20.0+)

Read `cohort` from `.boss/config.json`. If `null` (the default), ask ONE open question:

> *"Quick optional thing — which of these sounds most like where you're starting from? It lets BOSS's
> conscience tune its voice for you. If none fit, skip:*
> - *`vibe-coder-newbie` — picked up Cursor/Claude Code recently, no eng/startup background*
> - *`eng-builder` — strong eng background, first-time founder*
> - *`non-tech-founder` — domain expertise, no coding background, AI is the bridge*
> - *`first-product` — absolute first product ever, learning everything as you go*
> - *`vibe-virtuoso` — ships a lot of projects, harder time sustaining one*
> - *`indie-hacker` — building right-sized; calm-company, not venture*
> - *`returning-founder` — shipped before; want depth, not 101*
> - *`domain-expert` — deep expertise in a high-stakes domain (medical/legal/financial)*
> - *skip — leave it generic"*

On answer, write the value to `.boss/config.json` (don't disturb other fields). If they skip, leave `null`.
Either way, move on. Don't argue with their choice; they can edit the file later.

**Voice note:** these are *beginner personas* (per IDEA-009). The cohort declaration sharpens BOSS for
this founder *as evidence comes in over time* — not the other way around. If the user mishears their own
cohort, real use will reveal it; the file is editable.

## 7. Wrap up

Give a tight summary: what the idea is, where it's captured (`IDEA-001`), the stack decision (or that
it's pending), the mode, the cohort (if set), and the repo URL if created. Then the single best next step
(usually: start building the smallest version, or `boss unlock mvp` if it's clearly a real build).

## Rules

- Capture before code. Don't start implementing inside `/boss` — this is spin-up only.
- **Never decide the licence for them, in either direction** — ask, name both costs, accept "not yet".
- Never create a public repo without asking.
- Never touch global git config. Repo-local email only, and say so.
- Prefer one well-placed question over an interrogation.

---

## Appendix — proprietary LICENSE template

```
Copyright (c) {{YEAR}} {{OWNER}}. All Rights Reserved.

This software and its source code are proprietary and confidential. No license,
express or implied, is granted to any person to use, copy, modify, merge, publish,
distribute, sublicense, or sell copies of this software, in whole or in part,
without the prior written permission of the copyright holder.
```

*(No self-justifying paragraph in the file — a LICENSE states terms, it doesn't argue for itself. The
argument for and against this choice lives in the ask above, where its counterpart is standing next
to it.)*
