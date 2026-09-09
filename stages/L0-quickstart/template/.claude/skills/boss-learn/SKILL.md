---
name: boss-learn
description: Route a proven pattern two ways — UP into the BOSS library as a reusable superset practice, or DOWN into this app as hardened core functionality. The judgment layer over `boss learn`. Usage - /boss-learn [what to promote]
---

# /boss-learn — the two-destination router

PRINCIPLES #1: BOSS is always scaffolding, but at every natural breakpoint (a mode transition, a
shipped feature, the third time the same work repeats) you **pause and sort the pattern two ways.**
This skill is that router. It is **not** a one-way "promote to BOSS" — deciding UP vs DOWN *is* the
work.

## 0. Orient (silent)

- Read `.boss/manifest.json` (which project/mode you're in).
- Identify the concrete pattern: the file(s), prompt, workflow, convention, or token set in question.

## 1. Decide the destination

Ask one question if it's genuinely unclear; otherwise call it and say why.

- **UP → into BOSS** when the pattern is *project-neutral and reusable*: a workflow, an agent or
  skill shape, a hook, a best-practice doc. The test: *could a sibling project reuse this without
  copy-pasting code?* If yes, it's superset.
- **DOWN → app core** when the pattern is *this product's actual functionality* that happens to be
  living as scaffold/ad-hoc. It belongs in the app's own modules, with the app's own tests — not in BOSS.

A pattern can route **both**: the generalized shape goes UP, the concrete implementation hardens DOWN.

## 2a. Route UP

> **Check this first — routing UP needs a BOSS source checkout, and most installs don't have one.**
> `boss learn` writes into BOSS's own repo: it bumps a VERSION and prepends a CHANGELOG, which the
> read-only npm package cannot do. It looks for that repo in order — `$BOSS_SRC`, a self-hosted entry
> in your machine's registry, then the current directory if it *is* a checkout — and if it finds none
> it says so and stops. **If you installed BOSS from npm or Homebrew, that is you.** The honest
> outcome then is to *capture* the pattern where you are (`/extract` records it, with the reason it
> couldn't go up) and say plainly that promotion needs a checkout — not to imply the promotion
> happened. Because the target repo is almost never the one you're standing in, the first run also
> names it and asks for confirmation: add `--yes` once you've read which repo it picked.

1. **Generalize first.** Strip project specifics; replace them with `{{PLACEHOLDERS}}`. Domain logic
   never goes UP (PRINCIPLES: stack- and project-neutral only). Write/clean the file.
2. **Pick a category, and note that they land in two different places.**
   - `practices` → BOSS's **shelf**. What BOSS knows.
   - `agents` · `skills` · `hooks` → a **mode's template**. What BOSS ships — so these also need
     `--mode <quickstart|mvp|v1|scale>`, because one of these only exists for a founder at a rung.
3. **Promote it:**
   ```
   boss learn <path-to-generalized-file-or-dir> --as <category> [--mode <mode>] --note "<one line: what & why>"
   ```
   This copies it to the right home, bumps `VERSION` + `package.json` (minor by default;
   `--patch`/`--major`/`--version X.Y.Z` to override), and prepends a `registry/CHANGELOG.md` entry.
   For an agent, skill or hook it also **registers the artifact in that stage's manifest** — a file
   the manifest doesn't claim never syncs, so without that step it would sit on disk and reach
   nobody. A new hook is filed as *optional*: whether it fires for every founder is a decision.
4. **Sharpen the CHANGELOG prose** by hand — the auto entry is a stub. The CHANGELOG is what every
   project reads via `/boss-sync`, so make it say what's new and why it matters.
5. Tell the user: connected projects pull this via `boss sync` / `/boss-sync`.

## 2b. Route DOWN

No BOSS version change. This is product, not scaffold. Give concrete guidance (or do it, if asked):
- Move the pattern from ad-hoc/scaffold into a **named, owned module/config** in the app.
- Add the app's own tests around it; wire it into the app's real flow.
- If a *generalizable shape* remains, note it for a follow-up UP — don't lock value into code (PRINCIPLES #3).

## 3. Close the loop

- Update `docs/RESUME.md` if this was a breakpoint worth recording — that file arrives with MVP, so
  at Quickstart the idea doc is where it goes.
- One-line summary: what moved, which direction, the new BOSS version (if UP), the next step.

## Rules

- Deciding the direction is the point — never default to UP. Most app code routes DOWN.
- Never put domain specifics in `library/`. Generalize or don't promote.
- `boss learn` edits the BOSS **source** repo (found via the registry's self-hosted entry, or
  `$BOSS_SRC`). Review its diff and commit deliberately — don't auto-commit BOSS.
- One pattern per run. If the user names several, take the clearest first.
