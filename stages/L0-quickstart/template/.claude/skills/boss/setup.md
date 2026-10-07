## 4. Stack + stage

- **Stack:** If the idea implies a stack (web app, CLI, mobile, backend service), propose it in one
  line and, on agreement, record the decision in the IDEA doc and specialize
  `.claude/agents/coder.md` (fill in its build/test/run commands). If unclear, stay
  stack-neutral and say the decision is pending the first build step. Never silently assume a stack.
- **Mode:** Default is Quickstart (L0). If the PRD is rich and clearly a real product to build now,
  *recommend* `boss unlock mvp` (specs + `/smoke` gate) — but don't run it for them; suggest the command.
- **AI-native check:** If the idea names the model as load-bearing (the product
  doesn't work without it — a chatbot, a copilot, an LLM-pipeline, a generation tool, a
  RAG-mediated product), name it explicitly back to the founder: *"This sounds AI-native —
  the model is doing the work, not just polishing it."* Then **recommend the AI-first sequence**:
  *"After `boss unlock mvp`, the first FEAT that calls a model: `/spec` draws the line between
  what the model does and what stays code, then `/evals`, `/ai-failure-states` and `/ai-cost`.
  Cheaper to declare upfront than to retrofit after the first bill, the first hallucination, or
  the first refusal in front of a user."* Don't run anything for them; the recommendation is the artifact.

## 5–6. The setup, in one message

The repo, the licence and the optional cohort question are **one message with numbered items**, not
three turns. The founder answers *"1 private, 2 not yet, 3 skip"* and is done. Each item keeps its
full content below (the licence's two costs especially: it can be irreversible); only the turns
merge. Skip an item whose config already answers it.

## 5. GitHub repo (the gated step)

Read `github`, `visibility` and `license` from `.boss/config.json`.

- `never` → skip this whole section.
- `ask` (default) → *"Want a GitHub repo for this? **Private or public** — private is where I'd start,
  only because nobody's checked this for a stray API key yet, and you can flip it the day you want."*
- `always` → proceed with the configured `visibility` without asking.

**Then the licence — and ask it straight.** `license` scaffolds as `null`, which means *undecided*.
**BOSS does not pick this for you**: a licence is the one scaffold decision that can be
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

## 6. Cohort (optional, low-friction)

Read `cohort` from `.boss/config.json`. If `null` (the default — never asked), ask ONE open
question, the same one `/welcome` asks. **If it is `skipped`, they were asked there and declined:
don't ask again** — a second ask is the nag this skill's own step 3.5 refuses.

> *"Quick optional thing — which of these sounds most like where you're starting from? It changes
> how BOSS frames a nudge, nothing else. If none fit, skip:*
> - *this is the first thing you've built* (`first-product`)
> - *you've shipped a couple of small things with AI; no engineering or startup background* (`vibe-coder-newbie`)
> - *you know a business or a trade, and the AI is how you'll build* (`non-tech-founder`)
> - *you've built real systems; this is your first company* (`eng-builder`)
> - *you ship a lot; finishing one is the hard part* (`vibe-virtuoso`)
> - *right-sized on purpose — a calm company, not a venture* (`indie-hacker`)
> - *you've shipped real products before; depth, not 101* (`returning-founder`)
> - *being wrong has real costs — health, legal, money, safety* (`domain-expert`)
> - *skip — leave it generic"*

The phrase is the question; the slug is what gets stored. On answer, write the slug to
`.boss/config.json` (don't disturb other fields). If they skip, write `"cohort": "skipped"`. Either
way, move on. Don't argue with their choice; they can edit the file later.

**Voice note:** these are *beginner personas*. The cohort declaration sharpens BOSS for
this founder *as evidence comes in over time* — not the other way around. If the user mishears their own
cohort, real use will reveal it; the file is editable.

## 7. Wrap up

Say only what they'll act on next, not a receipt of the setup they just answered (they know the
stack, the mode and the cohort; they chose them):

- **Where the idea lives, and that it's living.** The idea doc is *living*, and if nobody says so,
  the insights that arrive tomorrow have nowhere to go. One line, in words that fit, e.g. *"Your idea
  is in `docs/ideas/IDEA-NNN` — it's meant to grow; `/idea <the thought>` adds to it when more lands."*
- **The repo URL**, if one was created.

Then the single best next step (usually: start building the smallest version, or `boss unlock mvp` if
it's clearly a real build).

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
