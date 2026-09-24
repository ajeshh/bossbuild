# `/design-tokens-init` — the content half (bundled resource)

> Loaded **on demand** from `SKILL.md`, when `STYLE_GUIDE.md` first has voice traits or a terminology list. Don't load it otherwise.

**Inline the voice the same way — it's the same trick, and copy needs it more.** Once
   `STYLE_GUIDE.md` has voice traits and a terminology list, add this block right underneath:

   ```markdown
   ## Voice (added by /design-tokens-init)

   Voice is constant; tone shifts by context. Full table in `docs/design/STYLE_GUIDE.md`.

   | trait | giving up |
   |---|---|
   | <trait 1> | <the tradeoff> |
   | <trait 2> | <the tradeoff> |

   Terminology — use the left column, never the right:
   | use | never |
   |---|---|
   | <the word> | <the synonyms> |

   When writing ANY user-facing string (button, error, empty state, confirm dialog,
   system prompt, refusal message):
   1. Errors say what to do next, not what failed.
   2. Destructive confirms name the consequence, not "are you sure".
   3. Empty states say what to do next, not "nothing here".
   4. Use the terminology table. One word per concept.
   ```

   **Why this matters more for copy than for color:** the model reverts to the mean harder on
   words than on values. Nobody has to prompt an LLM into writing *"Oops! Something went wrong."*
   — that **is** the mean. It's the 47 blues, in sentences. And unlike a hex code there is no
   regex for off-voice, so the guard-hook boundary that saves the token system does not transfer
   here. **Terminology is the exception — it's a word list, so it's the one content rule a check
   can actually enforce.** Everything else in this block is a filter, and worth shipping anyway.

**Cohort-scope the content half — do NOT hand everyone the full matrix** (the vetted source's required
   modification). The token half of this skill is carefully cohort-aware and the content half must
   be too, for the same reason: *a table filled in because it was asked for steers nothing.*

   - **`first-product` / `vibe-coder-newbie` — TERMINOLOGY ONLY.** One table, the checkable one,
     three rows max. **Defer voice and tone entirely** — say the section exists and that it's worth
     doing once they've watched real users read their screens. Someone who hasn't shipped cannot yet
     tell "plain over clever" from "friendly over formal," and asking them to decide produces a
     confident-looking answer nobody consults. *"Pick the words for your two or three main things and
     stay consistent. That's the whole job today."*
   - **`eng-builder` / `returning-founder`** — offer the full set tersely; they've argued about a
     terminology table before. *"Terminology, voice traits, tone-by-context. Want all three or just
     the terms?"*
   - **`vibe-virtuoso`** — lead with the mechanism: the terminology guard is checkable, voice/tone
     are not, and here's why that asymmetry is real rather than a missing feature.
   - **`domain-expert` — TONE FIRST, not terminology.** In a regulated or high-stakes domain the
     load-bearing decision is how the product speaks when it's *uncertain or wrong* — hedging,
     escalation language, what a refusal says. That outranks vocabulary consistency. Start there.
   - **`non-tech-founder`** — plain language, one concrete example: *"if your app says 'client' in
     one place and 'customer' in another, people notice and it reads as sloppy. Pick one."*
   - **`indie-hacker`** — right-sized: terminology plus one voice trait. No matrix, no ceremony.

   **The general rule this encodes:** ship the *checkable* content rule to everyone and the
   *judgment-shaped* ones only to founders who have enough product to judge against. Content
   discipline that arrives before there is copy to be inconsistent about is PRINCIPLE #2's premature
   ceremony wearing a design-system hat.
